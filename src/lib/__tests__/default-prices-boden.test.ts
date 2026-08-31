import { describe, expect, it } from 'vitest'
import { DEFAULT_PRICES } from '../default-prices'

const boden = DEFAULT_PRICES.filter(position => position.category.startsWith('Boden – '))

describe('Boden-Standardpreiskatalog', () => {
  // CoS-018 (2026-08-24): wie beim Maler-Katalog — 177 → 186 durch die 9 im
  // Preisdatenbank-Audit vom 20.08. (Commit e06b7f5) bewusst ergänzten
  // Boden-Positionen. Keine Dopplung, Dopplungs-Test unten war durchgehend
  // grün.
  it('enthält den vollständigen kuratierten Boden-Katalog', () => {
    expect(boden).toHaveLength(189)
  })

  it('enthält keine doppelten Kombinationen aus Bezeichnung und Einheit', () => {
    const keys = boden.map(position =>
      `${position.title.toLocaleLowerCase('de-DE')}::${position.unit.toLocaleLowerCase('de-DE')}`,
    )

    expect(new Set(keys).size).toBe(keys.length)
  })

  it.each([
    'Teppichboden verklebt entfernen',
    'Klebe-Vinyl / Designbelag entfernen',
    'Estrichriss kraftschlüssig verharzen und verklammern',
    'Stabparkett im französischen Fischgrät verlegen',
    'Feuchtraumlaminat verlegen schwimmend',
    'Dryback-Designbelag vollflächig kleben',
    'Kautschukbelag vollflächig verkleben',
    'Nadelvlies vollflächig verkleben',
    'Hamburger / Berliner Sockelleisten montieren',
    'Hohlkehlsockel aus Bodenbelag herstellen',
  ])('deckt die Bodenleistung "%s" ab', title => {
    expect(boden.some(position => position.title === title)).toBe(true)
  })
})
