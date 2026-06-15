import type { MengenErgebnis, BerechnetePosition } from '../types'

export function elektroEngine(daten: any): MengenErgebnis {
  const positionen: BerechnetePosition[] = []
  const warnungen: string[] = []

  const geraete: Array<{ key: string; label: string }> = [
    { key: 'steckdosen',    label: 'Steckdose einbauen' },
    { key: 'schalter',     label: 'Lichtschalter einbauen' },
    { key: 'spots',        label: 'Einbaustrahler / Spot montieren' },
    { key: 'aussenlampen', label: 'Außenleuchte montieren' },
    { key: 'wandlampen',   label: 'Wandleuchte montieren' },
  ]

  for (const g of geraete) {
    const anzahl = daten[g.key]
    if (anzahl && anzahl > 0) {
      positionen.push({
        beschreibung: g.label,
        menge: anzahl,
        einheit: 'Stück',
        konfidenz: 'high',
        berechnungsweg: `Direkt aus Angabe: ${anzahl} Stück`,
        annahmen: [],
      })
    }
  }

  const anschluesse: Array<{ key: string; label: string }> = [
    { key: 'herdanschluss',   label: 'Herdanschluss herstellen' },
    { key: 'wallbox',         label: 'Wallbox montieren + anschließen' },
    { key: 'unterverteilung', label: 'Unterverteilung einbauen' },
    { key: 'hauptverteilung', label: 'Hauptverteilung erneuern' },
  ]

  for (const a of anschluesse) {
    const val = daten[a.key]
    if (val) {
      positionen.push({
        beschreibung: a.label,
        menge: typeof val === 'number' ? val : 1,
        einheit: 'Stück',
        konfidenz: 'high',
        berechnungsweg: 'Direkt aus Angabe',
        annahmen: [],
      })
    }
  }

  if (daten.kabelmeter) {
    positionen.push({
      beschreibung: 'Leitungen verlegen',
      menge: daten.kabelmeter,
      einheit: 'lfdm',
      konfidenz: 'high',
      berechnungsweg: `Angabe: ${daten.kabelmeter} lfdm`,
      annahmen: [],
    })
  } else if (daten.neu_verkabeln) {
    // Keine Meterangabe: Rückfrage kommt aus kontext-analyzer (kabel_meter)
    positionen.push({
      beschreibung: 'Leitungen verlegen (Pauschale)',
      menge: 1,
      einheit: 'Pauschale',
      konfidenz: 'low',
      berechnungsweg: 'Keine Meterangabe — Pauschale angesetzt',
      annahmen: ['Leitungsmeter nicht angegeben — bitte Menge manuell anpassen'],
    })
  }

  if (positionen.length === 0) {
    warnungen.push('Keine Elektro-Positionen erkannt. Bitte Angaben prüfen.')
  }

  return {
    gewerk: 'elektro',
    quelleText: daten.transkript ?? '',
    objekte: [],
    positionen,
    rueckfragen: [],
    warnungen,
    plausibel: warnungen.length === 0,
  }
}
