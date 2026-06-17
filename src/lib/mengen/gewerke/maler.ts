import type { MengenErgebnis, BerechnetePosition } from '../types'

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function malerEngine(daten: any): MengenErgebnis {
  const positionen: BerechnetePosition[] = []
  const warnungen: string[] = []

  for (const raum of (daten.raeume ?? [])) {
    const {
      name: nameRaw = 'Raum',
      laenge, breite, hoehe,
      flaeche: flaeche_angegeben,
      fenster = [],
      tueren = [],
      arbeiten = [],
      sockelleisten: sockel = false,
    } = raum

    let bodenflaecheM2: number | null = null
    let wandflaecheNettoM2: number | null = null
    let deckenflaecheM2: number | null = null
    let umfangM: number | null = null

    const arbeitenStr = arbeiten.join(' ').toLowerCase()
    const transkriptLower = (daten.transkript ?? '').toLowerCase()

    // GPT gibt manchmal "Raum" als generischen Namen zurück — Raumtyp aus Transkript holen
    const raumTypen = ['kinderzimmer', 'wohnzimmer', 'schlafzimmer', 'badezimmer', 'bad', 'küche', 'flur', 'diele', 'keller', 'kellerraum', 'büro', 'arbeitszimmer', 'esszimmer', 'gästezimmer', 'garage', 'treppenhaus', 'dachgeschoss', 'dachzimmer', 'hobbyraum', 'spielzimmer', 'abstellraum', 'hauswirtschaftsraum', 'werkstatt']
    const nameAusTranskript = nameRaw === 'Raum'
      ? (raumTypen.find(t => transkriptLower.includes(t)) ?? nameRaw)
      : nameRaw
    // Ersten Buchstaben großschreiben
    const name = nameAusTranskript.charAt(0).toUpperCase() + nameAusTranskript.slice(1)

    // Garagen: kein Standard-Fenster, kein Standard-Tür — Tor wird via route.ts in tueren[] injiziert
    const istGarageRaum = name.toLowerCase().includes('garage') || name.toLowerCase().includes('carport')
      || transkriptLower.includes('garage') || transkriptLower.includes('carport')
    // "kein Fenster" / "ohne Fenster" → Standard-Fenster-Fallback unterdrücken
    const keinFenster = transkriptLower.includes('kein fenster') || transkriptLower.includes('keine fenster')
      || transkriptLower.includes('ohne fenster') || transkriptLower.includes('fensterlos')
    const effFenster = fenster.length > 0 ? fenster : (istGarageRaum || keinFenster) ? [] : [{ breite: 1.2, hoehe: 1.0, annahme: true }]
    const effTueren = tueren.length > 0 ? tueren : istGarageRaum ? [] : [{ breite: 0.9, hoehe: 2.1, annahme: true }]

    if (laenge && breite) {
      bodenflaecheM2 = round2(laenge * breite)
      umfangM = round2(2 * laenge + 2 * breite)
      // Deckenfläche = Bodenfläche — immer, unabhängig von Höhe
      deckenflaecheM2 = bodenflaecheM2

      if (hoehe) {
        const wandBrutto = round2(umfangM * hoehe)
        const fensterFlaeche = effFenster.reduce(
          (sum: number, f: any) => sum + (f.breite ?? 1.2) * (f.hoehe ?? 1.0), 0
        )
        const tuerFlaeche = effTueren.reduce(
          (sum: number, t: any) => sum + (t.breite ?? 0.9) * (t.hoehe ?? 2.1), 0
        )
        wandflaecheNettoM2 = round2(wandBrutto - fensterFlaeche - tuerFlaeche)
      }
    } else if (laenge && hoehe && !breite) {
      // Fassade / einzelne Wand: Breite × Höhe — kein Raum, nur Wandfläche
      const wandBrutto = round2(laenge * hoehe)
      const fensterFlaeche = effFenster.reduce(
        (sum: number, f: any) => sum + (f.breite ?? 1.2) * (f.hoehe ?? 1.0), 0
      )
      const tuerFlaeche = effTueren.reduce(
        (sum: number, t: any) => sum + (t.breite ?? 0.9) * (t.hoehe ?? 2.1), 0
      )
      wandflaecheNettoM2 = round2(wandBrutto - fensterFlaeche - tuerFlaeche)
      // Keine Decke, kein Boden, kein Umfang für Fassaden
    } else if (flaeche_angegeben) {
      // Nettofläche direkt angegeben (z.B. nach Tor-Abzug)
      wandflaecheNettoM2 = flaeche_angegeben
    }
    // Keine Maße: Engine überspringt den Raum (Rückfrage kommt aus rueckfragen-generator)
    // Leeres arbeiten[] = implizit "komplett streichen" (GPT hat Feld weggelassen)
    const leerOderKomplett = arbeiten.length === 0 || arbeitenStr.includes('komplett') || arbeitenStr.includes('alles')
    const hatStreichen = leerOderKomplett || arbeitenStr.includes('streichen') || arbeitenStr.includes('anstrich') || arbeitenStr.includes('anstreichen')
    // nurDecke/nurWaende: GPT schreibt selten "nur X" in arbeiten[] — Transkript als Primärquelle
    const nurWaende = arbeitenStr.includes('nur wand') || arbeitenStr.includes('nur die wand')
      || transkriptLower.includes('nur wand') || transkriptLower.includes('nur die wand') || transkriptLower.includes('nur wände')
    const nurDecke = arbeitenStr.includes('nur decke') || arbeitenStr.includes('nur die decke')
      || transkriptLower.includes('nur decke') || transkriptLower.includes('nur die decke')
    // Akzentwand: "nur eine Wand tapezieren, Rest streichen" — eine Wand = min(laenge,breite) × hoehe
    const hatAkzentwand = (transkriptLower.includes('eine wand') || transkriptLower.includes('akzentwand') || transkriptLower.includes('1 wand'))
      && (transkriptLower.includes('tapez') || transkriptLower.includes('vliestapete') || transkriptLower.includes('tapete'))
      && (transkriptLower.includes('rest') || transkriptLower.includes('übrige') || transkriptLower.includes('weiß'))
    const anWaenden = !nurDecke && (hatStreichen || arbeitenStr.includes('wand') || arbeitenStr.includes('tapez'))
    const anDecke = !nurWaende && ((hatStreichen) || arbeitenStr.includes('decke'))
    const bodenSchutz = hatStreichen || arbeitenStr.includes('boden') || arbeitenStr.includes('schutz')
    // Sockelleisten wenn Wände gestrichen werden (inkl. Garage — Garagen haben oft Sockelleisten)
    const nameLower = name.toLowerCase()
    const hatSockel = anWaenden && wandflaecheNettoM2 !== null
      && (hatStreichen || sockel || arbeitenStr.includes('sockel') || arbeitenStr.includes('leiste') || arbeitenStr.includes('abkleben'))

    const fensterStandard = fenster.some((f: any) => !f.breite || !f.hoehe)
    const annahmenFenster = fensterStandard ? ['Standardmaß Fenster 1,50 × 1,20 m verwendet (nicht angegeben)'] : []

    if (anWaenden && wandflaecheNettoM2 !== null) {
      const fensterFlaeche2 = effFenster.reduce((s: number, f: any) => s + (f.breite ?? 1.2) * (f.hoehe ?? 1.0), 0)
      const tuerFlaeche2 = effTueren.reduce((s: number, t: any) => s + (t.breite ?? 0.9) * (t.hoehe ?? 2.1), 0)

      if (hatAkzentwand && laenge && breite && hoehe) {
        // Akzentwand = längere Seite × Höhe (Sichtwand = Hauptwand = länger ist typischer Akzent)
        const akzentWandBreite = Math.max(laenge, breite)
        const akzentWandFlaeche = round2(akzentWandBreite * hoehe)
        const restwandFlaeche = round2(wandflaecheNettoM2 - akzentWandFlaeche)
        positionen.push({
          beschreibung: `Akzentwand Vliestapete — ${name}`,
          menge: akzentWandFlaeche,
          einheit: 'm²',
          konfidenz: 'high',
          berechnungsweg: `${akzentWandBreite} m × ${hoehe} m = ${akzentWandFlaeche} m²`,
          annahmen: ['Kürzere Raumseite als Akzentwand angenommen'],
        })
        if (restwandFlaeche > 0) {
          positionen.push({
            beschreibung: `Restwände streichen — ${name}`,
            menge: restwandFlaeche,
            einheit: 'm²',
            konfidenz: 'high',
            berechnungsweg: `Gesamt ${wandflaecheNettoM2} m² − Akzentwand ${akzentWandFlaeche} m²`,
            annahmen: annahmenFenster,
          })
        }
      } else {
        positionen.push({
          beschreibung: `Wandflächen streichen — ${name}`,
          menge: wandflaecheNettoM2,
          einheit: 'm²',
          konfidenz: 'high',
          berechnungsweg: `Umfang ${umfangM ?? '?'} lfm × ${hoehe} m = ${round2((umfangM ?? 0) * (hoehe ?? 0))} m² − Fenster ${round2(fensterFlaeche2)} m² − Türen ${round2(tuerFlaeche2)} m² [${effTueren.map((t: any) => `${t.breite ?? 0.9}×${t.hoehe ?? 2.1}`).join(', ')}]`,
          annahmen: annahmenFenster,
        })
      }
    }

    if (anDecke && deckenflaecheM2 !== null) {
      positionen.push({
        beschreibung: `Deckenfläche streichen — ${name}`,
        menge: deckenflaecheM2,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `Länge (${laenge}) × Breite (${breite})`,
        annahmen: [],
      })
    }

    if (bodenSchutz && bodenflaecheM2 !== null) {
      positionen.push({
        beschreibung: `Boden schützen — ${name}`,
        menge: bodenflaecheM2,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `Bodenfläche = Länge × Breite`,
        annahmen: [],
      })
    }

    if (hatSockel && umfangM !== null) {
      const tuerBreiten = effTueren.reduce((sum: number, t: any) => sum + (t.breite ?? 0.9), 0)
      const sockelM = round2(umfangM - tuerBreiten)
      positionen.push({
        beschreibung: `Sockelleisten abkleben — ${name}`,
        menge: sockelM,
        einheit: 'lfdm',
        konfidenz: 'high',
        berechnungsweg: `Umfang (${umfangM} lfm) − Türbreiten (${round2(tuerBreiten)} m)`,
        annahmen: [],
      })
    }
  }

  for (const pos of positionen) {
    const wand = positionen.find(p => p.beschreibung.includes('Wandfläche'))
    const boden = positionen.find(p => p.beschreibung.includes('Boden'))
    if (wand && boden && wand.menge < boden.menge) {
      warnungen.push('Wandfläche kleiner als Bodenfläche — Raumhöhe prüfen!')
    }
    if (pos.menge > 500 && pos.einheit === 'm²') {
      warnungen.push(`${pos.beschreibung}: ${pos.menge} m² — ungewöhnlich groß, bitte prüfen`)
    }
    if (pos.menge <= 0) {
      warnungen.push(`${pos.beschreibung}: Menge 0 — Berechnung prüfen`)
    }
  }

  return {
    gewerk: 'maler',
    quelleText: daten.transkript ?? '',
    objekte: [],
    positionen,
    rueckfragen: [],
    warnungen,
    plausibel: warnungen.length === 0,
  }
}
