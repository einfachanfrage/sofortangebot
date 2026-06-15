import type { MengenErgebnis, BerechnetePosition } from '../types'

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function bodenEngine(daten: any): MengenErgebnis {
  const positionen: BerechnetePosition[] = []
  const warnungen: string[] = []

  for (const raum of (daten.raeume ?? [])) {
    const {
      name = 'Raum',
      laenge, breite,
      flaeche: f,
      belag,
      verlegerichtung,
      altbelag_entfernen = false,
      sockelleisten = false,
      ausgleich = false,
    } = raum

    let flaeche: number | null = null
    let umfang: number | null = null

    if (laenge && breite) {
      flaeche = round2(laenge * breite)
      umfang = round2(2 * laenge + 2 * breite)
    } else if (f) {
      flaeche = f
    }

    if (!flaeche) {
      // Keine Maße: Rückfrage kommt aus kontext-analyzer (masse_boden_*)
      continue
    }

    const verschnitt = verlegerichtung === 'diagonal' ? 0.15 : 0.10
    const label = belag ?? 'Bodenbelag'

    positionen.push({
      beschreibung: `${label} verlegen — ${name}`,
      menge: round2(flaeche * (1 + verschnitt)),
      einheit: 'm²',
      konfidenz: 'high',
      berechnungsweg: `${flaeche} m² + ${verschnitt * 100}% Verschnitt`,
      annahmen: [
        `${verschnitt * 100}% Verschnitt${verlegerichtung === 'diagonal' ? ' (Diagonalverlegung)' : ' (Standard)'}`,
      ],
    })

    if (altbelag_entfernen) {
      positionen.push({
        beschreibung: `Altbelag entfernen — ${name}`,
        menge: flaeche,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `Bodenfläche: ${flaeche} m²`,
        annahmen: [],
      })
    }

    if (sockelleisten && umfang) {
      positionen.push({
        beschreibung: `Sockelleisten montieren — ${name}`,
        menge: umfang,
        einheit: 'lfdm',
        konfidenz: 'high',
        berechnungsweg: `Umfang: ${umfang} lfm`,
        annahmen: [],
      })
    }

    if (ausgleich) {
      positionen.push({
        beschreibung: `Untergrundausgleich — ${name}`,
        menge: flaeche,
        einheit: 'm²',
        konfidenz: 'high',
        berechnungsweg: `Bodenfläche: ${flaeche} m²`,
        annahmen: [],
      })
    }
  }

  if (positionen.length === 0) {
    warnungen.push('Keine Bodenbelag-Flächen erkannt. Bitte Raummaße angeben.')
  }

  return {
    gewerk: 'boden_parkett',
    quelleText: daten.transkript ?? '',
    objekte: [],
    positionen,
    rueckfragen: [],
    warnungen,
    plausibel: warnungen.length === 0,
  }
}
