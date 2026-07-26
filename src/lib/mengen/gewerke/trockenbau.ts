import type { MengenErgebnis, BerechnetePosition } from '../types'

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function trockenBauEngine(daten: any): MengenErgebnis {
  const positionen: BerechnetePosition[] = []
  const warnungen: string[] = []

  for (const wand of (daten.waende ?? [])) {
    const { laenge, hoehe, beplankung = 1, daemmung = false } = wand

    if (laenge && hoehe) {
      const flaeche = round2(laenge * hoehe)

      positionen.push({
        beschreibung: 'Ständerwand errichten (GK)',
        menge: flaeche,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `${laenge} × ${hoehe} = ${flaeche} m²`,
        annahmen: [],
      })

      if (beplankung >= 2) {
        positionen.push({
          beschreibung: 'Doppelbeplankung (2× GK)',
          menge: flaeche,
          einheit: 'm²',
          konfidenz: 'high',
          berechnungsweg: `Doppelte Beplankung: ${flaeche} m²`,
          annahmen: [],
        })
      }

      if (daemmung) {
        positionen.push({
          beschreibung: 'Dämmung Ständerwand einlegen',
          menge: flaeche,
          einheit: 'm²',
          konfidenz: 'high',
          berechnungsweg: `Wandfläche: ${flaeche} m²`,
          annahmen: [],
        })
      }

      const anzahlStaender = Math.ceil(laenge / 0.625)
      positionen.push({
        beschreibung: 'Ständerwerk CW-Profil',
        menge: round2(anzahlStaender * hoehe),
        einheit: 'lfdm',
        konfidenz: 'medium',
        berechnungsweg: `${anzahlStaender} Ständer × ${hoehe} m Höhe`,
        annahmen: ['Achsmaß 62,5 cm Standard angesetzt'],
      })
    }
    // Keine Maße: Rückfrage kommt aus kontext-analyzer (decke_masse)
  }

  for (const decke of (daten.decken ?? [])) {
    const { laenge, breite, flaeche: f } = decke
    const deckFlaeche = laenge && breite ? round2(laenge * breite) : (f ?? null)

    if (deckFlaeche) {
      positionen.push({
        beschreibung: 'Abgehängte Decke (GK)',
        menge: deckFlaeche,
        einheit: 'm²',
        konfidenz: laenge && breite ? 'high' : 'medium',
        berechnungsweg: laenge && breite
          ? `${laenge} × ${breite} = ${deckFlaeche} m²`
          : `Angabe: ${deckFlaeche} m²`,
        annahmen: !laenge || !breite ? ['Nur Fläche angegeben, keine Raummaße'] : [],
      })
    }
    // Keine Maße: Rückfrage kommt aus kontext-analyzer (decke_masse)
  }

  for (const raum of (daten.raeume ?? [])) {
    const { name = 'Raum', laenge, breite, arbeiten = [] } = raum
    const arbeitenStr = arbeiten.join(' ').toLowerCase()

    if ((arbeitenStr.includes('unterdecke') || arbeitenStr.includes('abgehängt')) && laenge && breite) {
      const flaeche = round2(laenge * breite)
      positionen.push({
        beschreibung: `Abgehängte Decke — ${name}`,
        menge: flaeche,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `${laenge} × ${breite} = ${flaeche} m²`,
        annahmen: [],
      })
    }
  }

  if (positionen.length === 0) {
    warnungen.push('Keine Trockenbau-Maße erkannt. Bitte Wandmaße oder Deckenfläche angeben.')
  }

  return {
    gewerk: 'trockenbau',
    quelleText: daten.transkript ?? '',
    objekte: [],
    positionen,
    rueckfragen: [],
    warnungen,
    plausibel: true,
  }
}
