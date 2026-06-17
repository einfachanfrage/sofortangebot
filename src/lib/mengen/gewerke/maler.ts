import type { MengenErgebnis, BerechnetePosition } from '../types'

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function malerEngine(daten: any): MengenErgebnis {
  const positionen: BerechnetePosition[] = []
  const warnungen: string[] = []

  for (const raum of (daten.raeume ?? [])) {
    const {
      name = 'Raum',
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

    // Wenn GPT keine Fenster/Türen zurückgibt: 1 Standardöffnung annehmen
    const effFenster = fenster.length > 0 ? fenster : [{ breite: 1.2, hoehe: 1.0, annahme: true }]
    const effTueren = tueren.length > 0 ? tueren : [{ breite: 0.9, hoehe: 2.1, annahme: true }]

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

    const arbeitenStr = arbeiten.join(' ').toLowerCase()
    const transkriptLower = (daten.transkript ?? '').toLowerCase()
    // Leeres arbeiten[] = implizit "komplett streichen" (GPT hat Feld weggelassen)
    const leerOderKomplett = arbeiten.length === 0 || arbeitenStr.includes('komplett') || arbeitenStr.includes('alles')
    const hatStreichen = leerOderKomplett || arbeitenStr.includes('streichen') || arbeitenStr.includes('anstrich') || arbeitenStr.includes('anstreichen')
    // nurDecke/nurWaende: GPT schreibt selten "nur X" in arbeiten[] — Transkript als Primärquelle
    const nurWaende = arbeitenStr.includes('nur wand') || arbeitenStr.includes('nur die wand')
      || transkriptLower.includes('nur wand') || transkriptLower.includes('nur die wand') || transkriptLower.includes('nur wände')
    const nurDecke = arbeitenStr.includes('nur decke') || arbeitenStr.includes('nur die decke')
      || transkriptLower.includes('nur decke') || transkriptLower.includes('nur die decke')
    const anWaenden = !nurDecke && (hatStreichen || arbeitenStr.includes('wand') || arbeitenStr.includes('tapez'))
    const anDecke = (hatStreichen && !nurWaende) || arbeitenStr.includes('decke')
    const bodenSchutz = hatStreichen || arbeitenStr.includes('boden') || arbeitenStr.includes('schutz')
    // Sockelleisten nur wenn Wände tatsächlich gestrichen werden
    const hatSockel = anWaenden && wandflaecheNettoM2 !== null
      && (hatStreichen || sockel || arbeitenStr.includes('sockel') || arbeitenStr.includes('leiste') || arbeitenStr.includes('abkleben'))

    const fensterStandard = fenster.some((f: any) => !f.breite || !f.hoehe)
    const annahmenFenster = fensterStandard ? ['Standardmaß Fenster 1,50 × 1,20 m verwendet (nicht angegeben)'] : []

    if (anWaenden && wandflaecheNettoM2 !== null) {
      positionen.push({
        beschreibung: `Wandflächen streichen — ${name}`,
        menge: wandflaecheNettoM2,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `Umfang (${umfangM} lfm) × Höhe (${hoehe} m) = Brutto, abzgl. Fenster + Türen`,
        annahmen: annahmenFenster,
      })
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
