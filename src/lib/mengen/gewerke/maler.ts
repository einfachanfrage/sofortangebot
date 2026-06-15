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

    if (laenge && breite) {
      bodenflaecheM2 = round2(laenge * breite)
      umfangM = round2(2 * laenge + 2 * breite)

      if (hoehe) {
        const wandBrutto = round2(umfangM * hoehe)
        const fensterFlaeche = fenster.reduce(
          (sum: number, f: any) => sum + (f.breite ?? 1.5) * (f.hoehe ?? 1.2), 0
        )
        const tuerFlaeche = tueren.reduce(
          (sum: number, t: any) => sum + (t.breite ?? 0.9) * (t.hoehe ?? 2.1), 0
        )
        wandflaecheNettoM2 = round2(wandBrutto - fensterFlaeche - tuerFlaeche)
        deckenflaecheM2 = bodenflaecheM2
      }
      // Keine Höhe: kein Fehler, nur Decke + Boden wird berechnet
    } else if (flaeche_angegeben) {
      bodenflaecheM2 = flaeche_angegeben
      // Wandfläche kann ohne Raummaße nicht berechnet werden — Annahme statt Rückfrage
    }
    // Keine Maße: Engine überspringt den Raum (Rückfrage kommt aus rueckfragen-generator)

    const arbeitenStr = arbeiten.join(' ').toLowerCase()
    const anWaenden = arbeitenStr.includes('wand') || arbeitenStr.includes('streichen') || arbeitenStr.includes('tapez') || arbeiten.length === 0
    const anDecke = arbeitenStr.includes('decke')
    const bodenSchutz = arbeitenStr.includes('boden') || arbeitenStr.includes('schutz')
    const hatSockel = sockel || arbeitenStr.includes('sockel') || arbeitenStr.includes('leiste') || arbeitenStr.includes('abkleben')

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
      const tuerBreiten = tueren.reduce((sum: number, t: any) => sum + (t.breite ?? 0.9), 0)
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
