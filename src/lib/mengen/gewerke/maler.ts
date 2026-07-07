import type { MengenErgebnis, BerechnetePosition } from '../types'
import { hatArbeit } from '../../arbeiten-normalisierer'

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
      wandflaeche_direkt: wandflaeche_direkt_raw,
      deckflaeche_direkt: deckflaeche_direkt_raw,
      wandflaeche_abzug_m2: wandflaeche_abzug_raw,
      umfang: umfang_direkt,
      kniestockhoehe = null,
      dachschraege_links_m2: dgLinks = null,
      dachschraege_rechts_m2: dgRechts = null,
      dachschraege_je_seite_m2: dgJeSeite = null,
      deckenspiegel_m2: dgDeckenspiegel = null,
      dachfenster: dgFensterRoh = [],
      fenster = [],
      tueren = [],
      arbeiten = [],
      sockelleisten: sockel = false,
    } = raum

    let bodenflaecheM2: number | null = null
    let wandflaecheNettoM2: number | null = null
    let deckenflaecheM2: number | null = null
    let umfangM: number | null = null
    const annahmenUmfang: string[] = []

    const arbeitenStr = arbeiten.join(' ').toLowerCase()
    const transkriptLower = (daten.transkript ?? '').toLowerCase()
    // Früh deklarieren — wird in flaeche_angegeben-Branch benötigt
    const istDachschraege = arbeitenStr.includes('dachschräge') || arbeitenStr.includes('schräge')
      || transkriptLower.includes('dachschräge') || transkriptLower.includes('schräge')
    const dgLinksM2: number | null = (dgLinks as number | null) ?? (dgJeSeite as number | null)
    const dgRechtsM2: number | null = (dgRechts as number | null) ?? (dgJeSeite as number | null)
    const dgFenster = dgFensterRoh as any[]
    const istDachgeschoss = (kniestockhoehe as number | null) !== null || dgLinksM2 !== null || (dgDeckenspiegel as number | null) !== null

    // GPT gibt manchmal "Raum" als generischen Namen zurück — Raumtyp aus Transkript holen
    const raumTypen = ['kinderzimmer', 'wohnzimmer', 'schlafzimmer', 'badezimmer', 'bad', 'küche', 'flur', 'diele', 'keller', 'kellerraum', 'büro', 'arbeitszimmer', 'esszimmer', 'gästezimmer', 'garage', 'treppenhaus', 'dachgeschoss', 'dachzimmer', 'hobbyraum', 'spielzimmer', 'abstellraum', 'hauswirtschaftsraum', 'werkstatt']
    const nameAusTranskript = nameRaw === 'Raum'
      ? (raumTypen.find(t => transkriptLower.includes(t)) ?? nameRaw)
      : nameRaw
    // Ersten Buchstaben großschreiben
    const name = nameAusTranskript.charAt(0).toUpperCase() + nameAusTranskript.slice(1)

    // Garagen/Keller: kein Standard-Fenster — Tor/Tür wird separat behandelt
    const istGarageRaum = name.toLowerCase().includes('garage') || name.toLowerCase().includes('carport')
      || transkriptLower.includes('garage') || transkriptLower.includes('carport')
    const istKellerRaum = name.toLowerCase().includes('keller') || transkriptLower.includes('keller')
      || name.toLowerCase().includes('souterrain')
    // "kein Fenster" / "ohne Fenster" → Standard-Fenster-Fallback unterdrücken
    const keinFenster = transkriptLower.includes('kein fenster') || transkriptLower.includes('keine fenster')
      || transkriptLower.includes('ohne fenster') || transkriptLower.includes('fensterlos')
    const keineTuer = transkriptLower.includes('keine tür') || transkriptLower.includes('ohne tür')
      || transkriptLower.includes('kein eingang') || transkriptLower.includes('keine türen')
    const fensterGefiltert = (fenster as any[]).filter(Boolean)
    const tuerenGefiltert = (tueren as any[]).filter(Boolean)
    const effFenster = fensterGefiltert.length > 0 ? fensterGefiltert : (istGarageRaum || istKellerRaum || keinFenster) ? [] : [{ breite: 1.2, hoehe: 1.0, annahme: true }]
    const effTueren = tuerenGefiltert.length > 0 ? tuerenGefiltert : (istGarageRaum || keineTuer) ? [] : [{ breite: 0.9, hoehe: 2.1, annahme: true }]

    if (laenge && breite) {
      bodenflaecheM2 = round2(laenge * breite)
      umfangM = round2(2 * laenge + 2 * breite)
      // Deckenfläche = Bodenfläche — immer, unabhängig von Höhe
      deckenflaecheM2 = bodenflaecheM2

      if (hoehe) {
        const wandBrutto = round2(umfangM * hoehe)
        const fensterFlaeche = effFenster.reduce(
          (sum: number, f: any) => sum + (f.anzahl ?? 1) * (f.breite ?? 1.2) * (f.hoehe ?? 1.0), 0
        )
        const tuerFlaeche = effTueren.reduce(
          (sum: number, t: any) => sum + (t.anzahl ?? 1) * (t.breite ?? 0.9) * (t.hoehe ?? 2.1), 0
        )
        wandflaecheNettoM2 = round2(wandBrutto - fensterFlaeche - tuerFlaeche)
      }
    } else if (laenge && hoehe && !breite) {
      // Fassade / einzelne Wand: Breite × Höhe — kein Raum, nur Wandfläche
      const wandBrutto = round2(laenge * hoehe)
      const fensterFlaeche = effFenster.reduce(
        (sum: number, f: any) => sum + (f.anzahl ?? 1) * (f.breite ?? 1.2) * (f.hoehe ?? 1.0), 0
      )
      const tuerFlaeche = effTueren.reduce(
        (sum: number, t: any) => sum + (t.anzahl ?? 1) * (t.breite ?? 0.9) * (t.hoehe ?? 2.1), 0
      )
      wandflaecheNettoM2 = round2(wandBrutto - fensterFlaeche - tuerFlaeche)
      // Keine Decke, kein Boden, kein Umfang für Fassaden
    } else if (umfang_direkt && hoehe) {
      // Umfang direkt angegeben (Halle, Lagerhalle) — ohne L×B
      umfangM = round2(umfang_direkt)
      const fensterFlU = effFenster.reduce(
        (sum: number, f: any) => sum + (f.anzahl ?? 1) * (f.breite ?? 1.2) * (f.hoehe ?? 1.0), 0
      )
      const tuerFlU = effTueren.reduce(
        (sum: number, t: any) => sum + (t.anzahl ?? 1) * (t.breite ?? 0.9) * (t.hoehe ?? 2.1), 0
      )
      wandflaecheNettoM2 = round2(umfangM * hoehe - fensterFlU - tuerFlU)
      // Boden-/Deckenfläche unbekannt ohne L×B → Rückfrage kommt
    } else if (flaeche_angegeben) {
      // flaeche = immer Bodenfläche (GPT-Konvention). Nur bei Dachschräge/Fassade = Wandfläche.
      if (istDachschraege) {
        wandflaecheNettoM2 = flaeche_angegeben
      } else {
        bodenflaecheM2 = flaeche_angegeben
        deckenflaecheM2 = flaeche_angegeben
        if (hoehe) {
          // Nutzer nennt nur Bodenfläche + Höhe (typische Sprechweise: "20 qm, Decke 3 m hoch").
          // Umfang über Quadrat-Annahme schätzen: Seite = √Fläche → Umfang = 4·√Fläche.
          // Bei üblichen Raumproportionen (bis ~1:2) liegt der Fehler unter ~7 % — klar als Annahme markiert.
          umfangM = round2(4 * Math.sqrt(flaeche_angegeben))
          const fensterFlQ = effFenster.reduce(
            (sum: number, f: any) => sum + (f.anzahl ?? 1) * (f.breite ?? 1.2) * (f.hoehe ?? 1.0), 0
          )
          const tuerFlQ = effTueren.reduce(
            (sum: number, t: any) => sum + (t.anzahl ?? 1) * (t.breite ?? 0.9) * (t.hoehe ?? 2.1), 0
          )
          wandflaecheNettoM2 = Math.max(0, round2(umfangM * hoehe - fensterFlQ - tuerFlQ))
          annahmenUmfang.push(`Umfang aus Bodenfläche geschätzt (≈ quadratischer Raum, ${umfangM} lfm) — bei länglichem Raum bitte Maße prüfen`)
        }
        // Ohne Höhe: Wandfläche bleibt null (Rückfrage kommt)
      }
    }

    // Explizite Wandfläche/Deckfläche vom User überschreiben Engine-Berechnungen
    // (`!= null` statt `!== null`: GPT lässt Felder oft ganz weg → undefined, sonst NaN!)
    if (wandflaeche_direkt_raw != null) {
      const abzug = (wandflaeche_abzug_raw as number | null) ?? 0
      wandflaecheNettoM2 = round2((wandflaeche_direkt_raw as number) - abzug)
    }
    if (deckflaeche_direkt_raw != null) {
      deckenflaecheM2 = deckflaeche_direkt_raw as number
      // Bodenfläche ≈ Deckenfläche wenn nicht anders bekannt
      if (bodenflaecheM2 === null) bodenflaecheM2 = deckflaeche_direkt_raw as number
    }

    // Keine Maße: Engine überspringt den Raum (Rückfrage kommt aus rueckfragen-generator)
    // Leeres arbeiten[] = implizit "komplett streichen" (GPT hat Feld weggelassen)
    const leerOderKomplett = arbeiten.length === 0 || arbeitenStr.includes('komplett') || arbeitenStr.includes('alles')
    // Normalisierer deckt Flexionen ab ("gestrichen", "anmalen" …) — nur auf arbeiten[],
    // NICHT aufs Transkript (das gilt raumübergreifend und würde Signale in andere Räume streuen)
    const hatStreichen = leerOderKomplett || hatArbeit(arbeitenStr, 'streichen')
    // nurDecke/nurWaende: GPT schreibt selten "nur X" in arbeiten[] — Transkript als Primärquelle
    const nurWaende = arbeitenStr.includes('nur wand') || arbeitenStr.includes('nur die wand')
      || transkriptLower.includes('nur wand') || transkriptLower.includes('nur die wand') || transkriptLower.includes('nur wände')
    const nurDecke = arbeitenStr.includes('nur decke') || arbeitenStr.includes('nur die decke')
      || transkriptLower.includes('nur decke') || transkriptLower.includes('nur die decke')
    // Akzentwand: "nur eine Wand tapezieren, Rest streichen" — eine Wand = min(laenge,breite) × hoehe
    const hatAkzentwand = (transkriptLower.includes('eine wand') || transkriptLower.includes('akzentwand') || transkriptLower.includes('1 wand'))
      && (transkriptLower.includes('tapez') || transkriptLower.includes('vliestapete') || transkriptLower.includes('tapete'))
      && (transkriptLower.includes('rest') || transkriptLower.includes('übrige') || transkriptLower.includes('weiß'))
    // Boden streichen (Keller/Garage): NUR wenn explizit "boden streichen"/"boden anstrich" — nicht bei "boden abdecken"/"boden schützen"
    const hatBodenStreichen = arbeitenStr.includes('boden streich') || arbeitenStr.includes('boden anstrich')
      || transkriptLower.includes('boden streich') || transkriptLower.includes('boden anstrich')
      || ((istKellerRaum || istGarageRaum) && (transkriptLower.includes('boden streich') || transkriptLower.includes('boden anstrich')))
    const anWaenden = !nurDecke && (hatStreichen || arbeitenStr.includes('wand') || arbeitenStr.includes('tapez'))
    // Decke: nicht wenn explizit Boden gestrichen wird (Keller-Fall) oder nurWaende
    const anDecke = !nurWaende && !hatBodenStreichen && ((hatStreichen) || arbeitenStr.includes('decke'))
    const bodenStreichen = hatBodenStreichen && bodenflaecheM2 !== null
    // Boden schützen: immer wenn Wände ODER Decke gestrichen wird (Farbe tropft)
    const bodenSchutz = !bodenStreichen && (hatStreichen || arbeitenStr.includes('schutz') || anDecke || anWaenden)
    // Sockelleisten: nicht in Kellern (kein Sockelleisten-Standard im Keller)
    const nameLower = name.toLowerCase()
    const hatSockel = anWaenden && wandflaecheNettoM2 !== null && !istKellerRaum
      && (hatStreichen || sockel || arbeitenStr.includes('sockel') || arbeitenStr.includes('leiste') || arbeitenStr.includes('abkleben'))

    const fensterStandard = fenster.some((f: any) => !f.breite || !f.hoehe)
    const annahmenFenster = fensterStandard ? ['Standardmaß Fenster 1,50 × 1,20 m verwendet (nicht angegeben)'] : []

    const wandzonen = (raum.wandzonen ?? []) as Array<{zone: string, hoehe: number, farbe?: string, aktion?: string}>
    const effUmfangWZ = umfangM ?? (laenge && breite ? round2(2 * (laenge + breite)) : null)
    const hatWandzonen = wandzonen.length >= 2 && effUmfangWZ !== null

    if (hatWandzonen) {
      // Wandzonen-Branch: je Zone eigene Position
      let zoneStart = 0
      for (const zone of wandzonen) {
        const zoneEnd = round2(zoneStart + zone.hoehe)

        if (zone.aktion === 'abkleben') {
          positionen.push({
            beschreibung: `Holzvertäfelung / Wandbelag abkleben — ${name}`,
            menge: effUmfangWZ!, einheit: 'lfdm', konfidenz: 'high',
            berechnungsweg: `Umfang ${effUmfangWZ} lfm (Oberkante Zone ${zone.zone} bei ${zoneEnd}m)`, annahmen: [],
          })
          zoneStart = zoneEnd
          continue
        }

        // Fenster: nur abziehen wenn explizit dieser Zone zugeordnet (f.wandzone) ODER keine Zone gesetzt und keine andere Zone da
        const fensterInZone = effFenster.filter((f: any) => f.wandzone ? f.wandzone === zone.zone : true)
        // Vermeidung Doppelabzug: wenn wandzone annotiert, nur in der passenden Zone
        const fensterMitZone = effFenster.some((f: any) => f.wandzone)
        const fensterFl = round2(
          (fensterMitZone ? effFenster.filter((f: any) => f.wandzone === zone.zone) : fensterInZone).reduce(
            (s: number, f: any) => s + (f.anzahl ?? 1) * (f.breite ?? 1.2) * (f.hoehe ?? 1.0), 0
          )
        )

        // Türen: Überschneidung mit Zone [zoneStart, zoneEnd]
        const tuerFl = round2(effTueren.reduce((s: number, t: any) => {
          const hoeT = t.hoehe ?? 2.1
          const overlap = Math.max(0, Math.min(zoneEnd, hoeT) - zoneStart)
          return s + (t.anzahl ?? 1) * (t.breite ?? 0.9) * overlap
        }, 0))

        const zoneFl = round2(effUmfangWZ! * zone.hoehe - fensterFl - tuerFl)
        const zoneLabel = zone.farbe ? `${zone.farbe} streichen` : `Wandzone ${zone.zone} streichen`
        positionen.push({
          beschreibung: `${zoneLabel} — ${name}`,
          menge: Math.max(0, zoneFl), einheit: 'm²', konfidenz: 'high',
          berechnungsweg: `${effUmfangWZ}m × ${zone.hoehe}m − Fenster ${fensterFl} m² − Türen ${tuerFl} m²`,
          annahmen: [],
        })
        zoneStart = zoneEnd
      }
      if (anDecke && deckenflaecheM2 !== null) {
        positionen.push({ beschreibung: `Deckenfläche streichen — ${name}`, menge: deckenflaecheM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${laenge} × ${breite}`, annahmen: [] })
      }
      if (bodenStreichen && bodenflaecheM2 !== null) {
        positionen.push({ beschreibung: `Boden streichen — ${name}`, menge: bodenflaecheM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${bodenflaecheM2} m²`, annahmen: [] })
      }
      if (bodenSchutz && bodenflaecheM2 !== null) {
        positionen.push({ beschreibung: `Boden schützen — ${name}`, menge: bodenflaecheM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${bodenflaecheM2} m²`, annahmen: [] })
      }
      if (hatSockel && effUmfangWZ !== null) {
        const tuerBreiten = effTueren.reduce((s: number, t: any) => s + (t.breite ?? 0.9), 0)
        positionen.push({ beschreibung: `Sockelleisten abkleben — ${name}`, menge: round2(effUmfangWZ - tuerBreiten), einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `Umfang ${effUmfangWZ} − Türen ${round2(tuerBreiten)}`, annahmen: [] })
      }
    } else if (istDachgeschoss) {
      // DG-Branch: Kniestockwände + Dachschrägen + Deckenspiegel separat
      const knH = kniestockhoehe as number | null
      if (knH && laenge && breite && anWaenden) {
        const kniestockM2 = round2(2 * (laenge + breite) * knH)
        positionen.push({
          beschreibung: `Kniestockwände streichen — ${name}`,
          menge: kniestockM2, einheit: 'm²', konfidenz: 'high',
          berechnungsweg: `Umfang ${round2(2*(laenge+breite))} lfm × ${knH} m = ${kniestockM2} m²`,
          annahmen: [],
        })
      }
      if (dgLinksM2 !== null || dgRechtsM2 !== null) {
        const brutto = round2((dgLinksM2 ?? 0) + (dgRechtsM2 ?? 0))
        const dgFensterFl = round2(dgFenster.reduce((s: number, f: any) => s + (f.anzahl ?? 1) * (f.breite ?? 0.78) * (f.hoehe ?? 1.18), 0))
        const netto = round2(brutto - dgFensterFl)
        positionen.push({
          beschreibung: `Dachschrägen streichen — ${name}`,
          menge: Math.max(0, netto), einheit: 'm²', konfidenz: 'high',
          berechnungsweg: dgFensterFl > 0
            ? `Links ${dgLinksM2 ?? 0} m² + Rechts ${dgRechtsM2 ?? 0} m² = ${brutto} m² − Dachfenster ${dgFensterFl} m²`
            : `Links ${dgLinksM2 ?? 0} m² + Rechts ${dgRechtsM2 ?? 0} m² = ${brutto} m²`,
          annahmen: [],
        })
      }
      if ((dgDeckenspiegel as number | null) !== null && anDecke) {
        positionen.push({
          beschreibung: `Deckenspiegel streichen — ${name}`,
          menge: dgDeckenspiegel as number, einheit: 'm²', konfidenz: 'high',
          berechnungsweg: `Deckenspiegel ${dgDeckenspiegel} m²`, annahmen: [],
        })
      }
      if (bodenStreichen && bodenflaecheM2 !== null) {
        positionen.push({ beschreibung: `Boden streichen — ${name}`, menge: bodenflaecheM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${bodenflaecheM2} m²`, annahmen: [] })
      }
      if (bodenSchutz && bodenflaecheM2 !== null) {
        positionen.push({ beschreibung: `Boden schützen — ${name}`, menge: bodenflaecheM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${bodenflaecheM2} m²`, annahmen: [] })
      }
      // Sockelleisten am Kniestockumfang
      if (knH && laenge && breite && hatSockel) {
        const knUmfang = round2(2 * (laenge + breite))
        const tuerBr = effTueren.reduce((s: number, t: any) => s + (t.breite ?? 0.9), 0)
        positionen.push({
          beschreibung: `Sockelleisten abkleben — ${name}`,
          menge: round2(knUmfang - tuerBr), einheit: 'lfdm', konfidenz: 'high',
          berechnungsweg: `Kniestockumfang ${knUmfang} lfm − Türen ${round2(tuerBr)} m`, annahmen: [],
        })
      }
    } else {
      // Normal-Branch: Wände + Decke + Boden
      if (anWaenden && wandflaecheNettoM2 !== null) {
        const fensterFlaeche2 = effFenster.reduce((s: number, f: any) => s + (f.anzahl ?? 1) * (f.breite ?? 1.2) * (f.hoehe ?? 1.0), 0)
        const tuerFlaeche2 = effTueren.reduce((s: number, t: any) => s + (t.anzahl ?? 1) * (t.breite ?? 0.9) * (t.hoehe ?? 2.1), 0)
        if (hatAkzentwand && laenge && breite && hoehe) {
          const akzentWandBreite = Math.max(laenge, breite)
          const akzentWandFlaeche = round2(akzentWandBreite * hoehe)
          const restwandFlaeche = round2(wandflaecheNettoM2 - akzentWandFlaeche)
          positionen.push({ beschreibung: `Akzentwand Vliestapete — ${name}`, menge: akzentWandFlaeche, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${akzentWandBreite} m × ${hoehe} m = ${akzentWandFlaeche} m²`, annahmen: ['Kürzere Raumseite als Akzentwand angenommen'] })
          if (restwandFlaeche > 0) positionen.push({ beschreibung: `Restwände streichen — ${name}`, menge: restwandFlaeche, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gesamt ${wandflaecheNettoM2} m² − Akzentwand ${akzentWandFlaeche} m²`, annahmen: annahmenFenster })
        } else {
          const wandLabel = istDachschraege ? `Dachschräge streichen — ${name}` : `Wandflächen streichen — ${name}`
          const wandBrutto2 = round2((umfangM ?? 0) * (hoehe ?? 0))
          const fensterAnzahl2 = effFenster.reduce((s: number, f: any) => s + (f.anzahl ?? 1), 0)
          const tuerAnzahl2 = effTueren.reduce((s: number, t: any) => s + (t.anzahl ?? 1), 0)
          const fensterEinzel2 = fensterAnzahl2 > 0 ? round2(fensterFlaeche2 / fensterAnzahl2) : 0
          const tuerEinzel2 = tuerAnzahl2 > 0 ? round2(tuerFlaeche2 / tuerAnzahl2) : 0
          positionen.push({
            beschreibung: wandLabel, menge: wandflaecheNettoM2, einheit: 'm²', konfidenz: annahmenUmfang.length > 0 ? 'medium' : 'high',
            berechnungsweg: istDachschraege ? `Dachschrägenfläche ${wandflaecheNettoM2} m²` : `Umfang ${umfangM ?? '?'} lfm × ${hoehe} m = ${wandBrutto2} m² − Fenster ${round2(fensterFlaeche2)} m² − Türen ${round2(tuerFlaeche2)} m² [${effTueren.map((t: any) => `${t.breite ?? 0.9}×${t.hoehe ?? 2.1}`).join(', ')}]`,
            annahmen: [...annahmenFenster, ...annahmenUmfang],
            ...(!istDachschraege && umfangM && hoehe ? {
              flaechen_parameter: {
                brutto_m2: wandBrutto2,
                fenster_anzahl: fensterAnzahl2,
                fenster_einzelflaeche: fensterEinzel2,
                tuer_anzahl: tuerAnzahl2,
                tuer_einzelflaeche: tuerEinzel2,
              }
            } : {}),
          })
        }
      }
      if (anDecke && deckenflaecheM2 !== null) {
        positionen.push({ beschreibung: `Deckenfläche streichen — ${name}`, menge: deckenflaecheM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: laenge && breite ? `Länge (${laenge}) × Breite (${breite})` : `Deckenfläche ${deckenflaecheM2} m² (= Bodenfläche)`, annahmen: [] })
      }
      if (bodenStreichen && bodenflaecheM2 !== null) {
        positionen.push({ beschreibung: `Boden streichen — ${name}`, menge: bodenflaecheM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche = Länge × Breite`, annahmen: [] })
      }
      if (bodenSchutz && bodenflaecheM2 !== null) {
        positionen.push({ beschreibung: `Boden schützen — ${name}`, menge: bodenflaecheM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche = Länge × Breite`, annahmen: [] })
      }
      if (hatSockel && umfangM !== null) {
        const tuerBreiten = effTueren.reduce((sum: number, t: any) => sum + (t.breite ?? 0.9), 0)
        const sockelM = round2(umfangM - tuerBreiten)
        positionen.push({ beschreibung: `Sockelleisten abkleben — ${name}`, menge: sockelM, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `Umfang (${umfangM} lfm) − Türbreiten (${round2(tuerBreiten)} m)`, annahmen: [] })
      }
    }
  }

  // Leibungen (Top-Level-Feld im GPT-Output — außerhalb der Raum-Schleife)
  const transkriptAll = (daten.transkript ?? '').toLowerCase()
  for (const l of ((daten.leibungen ?? []) as any[])) {
    const anz = l.anzahl ?? 1
    const br = l.breite ?? 1.2
    const hoe = l.hoehe ?? 1.0
    const tiefe = l.tiefe ?? 0.25
    const istAnnahme = !l.tiefe
    const leibungsUmfang = round2(2 * br + 2 * hoe)
    const flaecheM2 = round2(anz * leibungsUmfang * tiefe)
    const posTyp = (l.typ ?? '').includes('innen') ? 'Fenster Innenleibungen streichen'
      : l.typ === 'tuer' ? 'Türleibungen streichen'
      : 'Fensterleibungen streichen'
    positionen.push({
      beschreibung: posTyp,
      menge: flaecheM2, einheit: 'm²', konfidenz: 'high',
      berechnungsweg: `${anz} × (2×${br} + 2×${hoe}) × ${tiefe}m = ${anz} × ${leibungsUmfang} × ${tiefe} = ${flaecheM2} m²`,
      annahmen: istAnnahme ? ['Leibungstiefe 25cm Standard (nicht angegeben)'] : [],
    })
    // Fensterbänke bei Innenleibung + Erwähnung
    if ((l.typ ?? '').includes('innen') && transkriptAll.includes('fensterbank')) {
      const bankFl = round2(anz * br * tiefe)
      positionen.push({ beschreibung: 'Fensterbänke streichen', menge: bankFl, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${anz} × ${br}m × ${tiefe}m = ${bankFl} m²`, annahmen: [] })
    }
  }

  // Sonderarbeiten — top-level fields, unabhängig von Räumen
  for (const s of ((daten.sonder ?? []) as any[])) {
    const m2 = s.m2 ?? null
    const mk = { konfidenz: 'high' as const, annahmen: [] as string[] }
    switch (s.typ) {
      case 'schimmelbehandlung':
        positionen.push({ beschreibung: 'Schimmelbehandlung / Grundierung', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m² aus Transkript`, ...mk })
        break
      case 'kalkputz':
        positionen.push({ beschreibung: 'Kalkputz aufbringen', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        break
      case 'silikatfarbe':
        positionen.push({ beschreibung: 'Silikatfarbe auftragen (2×)', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        break
      case 'nikotinsperre':
        positionen.push({ beschreibung: 'Nikotinsperre auftragen', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        break
      case 'geruest':
        positionen.push({ beschreibung: 'Gerüst stellen (Pauschale)', menge: 1, einheit: 'Pauschale', berechnungsweg: 'Pauschale', ...mk })
        break
      case 'rissversschluss':
        positionen.push({ beschreibung: 'Rissverschluss mit Gewebe', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        break
      case 'heizkoerper':
        positionen.push({ beschreibung: 'Heizkörper schleifen und lackieren', menge: s.anzahl ?? 1, einheit: 'Stück', berechnungsweg: `${s.anzahl ?? 1} Stück`, ...mk })
        break
      case 'fussleisten':
        positionen.push({ beschreibung: 'Fußleisten schleifen und lackieren', menge: s.lfdm, einheit: 'lfdm', berechnungsweg: `${s.lfdm} lfdm`, ...mk })
        break
      case 'bautrockner':
        positionen.push({ beschreibung: 'Bautrockner aufstellen und betreiben', menge: s.tage, einheit: 'Tage', berechnungsweg: `${s.tage} Tage`, ...mk })
        break
      case 'antischimmel':
        positionen.push({ beschreibung: 'Anti-Schimmel-Anstrich', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        break
      case 'kalken':
        positionen.push({ beschreibung: 'Kalken / Weißkalkung', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        break
      case 'spachteltechnik':
        positionen.push({ beschreibung: 'Spachteltechnik (Betonoptik)', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        break
      case 'versiegelung_spachtel':
        positionen.push({ beschreibung: 'Versiegelung / Schutzanstrich', menge: m2, einheit: 'm²', berechnungsweg: `${m2} m²`, ...mk })
        break
      case 'holzbalken': {
        const lfdm = round2((s.anzahl ?? 1) * (s.laenge_m ?? 1))
        positionen.push({ beschreibung: 'Holzbalken anschleifen', menge: lfdm, einheit: 'lfdm', berechnungsweg: `${s.anzahl} × ${s.laenge_m} m = ${lfdm} lfdm`, ...mk })
        positionen.push({ beschreibung: 'Lasur auftragen (transparent)', menge: lfdm, einheit: 'lfdm', berechnungsweg: `${lfdm} lfdm`, ...mk })
        break
      }
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
