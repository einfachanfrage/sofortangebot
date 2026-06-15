import type { MengenErgebnis, BerechnetePosition } from '../types'

export function sanitaerEngine(daten: any): MengenErgebnis {
  const positionen: BerechnetePosition[] = []
  const warnungen: string[] = []

  const istAustausch = daten.austausch || daten.erneuerung

  const objekte: Array<{ key: string; label: string }> = [
    { key: 'wc',        label: 'WC montieren' },
    { key: 'waschtisch', label: 'Waschtisch montieren' },
    { key: 'wanne',     label: 'Badewanne montieren' },
    { key: 'dusche',    label: 'Dusche / Duschtasse montieren' },
    { key: 'urinal',    label: 'Urinal montieren' },
    { key: 'bidet',     label: 'Bidet montieren' },
  ]

  for (const obj of objekte) {
    const anzahl = daten[obj.key]
    if (!anzahl) continue
    const menge = typeof anzahl === 'number' ? anzahl : 1

    if (istAustausch) {
      positionen.push({
        beschreibung: obj.label.replace('montieren', 'demontieren') + ' (Altanlage)',
        menge,
        einheit: 'Stück',
        konfidenz: 'high',
        berechnungsweg: 'Austausch = Demontage + Montage',
        annahmen: [],
      })
    }
    positionen.push({
      beschreibung: obj.label,
      menge,
      einheit: 'Stück',
      konfidenz: 'high',
      berechnungsweg: 'Direkt aus Angabe',
      annahmen: [],
    })
  }

  if (daten.armaturen) {
    const anzahl = typeof daten.armaturen === 'number' ? daten.armaturen : 1
    positionen.push({
      beschreibung: 'Armatur montieren',
      menge: anzahl,
      einheit: 'Stück',
      konfidenz: 'high',
      berechnungsweg: `Angabe: ${anzahl} Stück`,
      annahmen: [],
    })
  }

  if (daten.rohrmeter) {
    positionen.push({
      beschreibung: 'Rohrleitungen erneuern',
      menge: daten.rohrmeter,
      einheit: 'lfdm',
      konfidenz: 'high',
      berechnungsweg: `Angabe: ${daten.rohrmeter} lfdm`,
      annahmen: [],
    })
  } else if (daten.leitungen_erneuern) {
    // Keine Meterangabe: Rückfrage kommt aus kontext-analyzer (rohre_erneuern)
    positionen.push({
      beschreibung: 'Rohrleitungen erneuern (Pauschale)',
      menge: 1,
      einheit: 'Pauschale',
      konfidenz: 'low',
      berechnungsweg: 'Keine Meterangabe',
      annahmen: ['Rohrmeter nicht angegeben — bitte anpassen'],
    })
  }

  if (daten.heizkoerper) {
    const anzahl = typeof daten.heizkoerper === 'number' ? daten.heizkoerper : 1
    positionen.push({
      beschreibung: 'Heizkörper montieren',
      menge: anzahl,
      einheit: 'Stück',
      konfidenz: 'high',
      berechnungsweg: `Angabe: ${anzahl} Stück`,
      annahmen: [],
    })
  }

  return {
    gewerk: 'sanitaer_heizung',
    quelleText: daten.transkript ?? '',
    objekte: [],
    positionen,
    rueckfragen: [],
    warnungen,
    plausibel: true,
  }
}
