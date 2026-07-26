import { describe, expect, it } from 'vitest'
import { getPriceTradeKey, priceItemIdentity } from '../price-catalog'

describe('price catalog helpers', () => {
  it.each([
    ['Maler – Anstrich', 'Maler'],
    ['Maler — Anstrich', 'Maler'],
    ['Maler - Anstrich', 'Maler'],
    ['Maler & Lackierer – Anstrich', 'Maler'],
    ['Boden – Parkett', 'Boden'],
    ['Bodenbeläge & Parkett — Vinyl', 'Boden'],
  ])('normalisiert %s auf %s', (category, expected) => {
    expect(getPriceTradeKey(category)).toBe(expected)
  })

  it('unterscheidet gleiche Positionen in verschiedenen Kategorien', () => {
    expect(priceItemIdentity({ category: 'Maler – Anfahrt', title: 'Anfahrt', unit: 'Pauschale' }))
      .not.toBe(priceItemIdentity({ category: 'Boden – Anfahrt', title: 'Anfahrt', unit: 'Pauschale' }))
  })

  it('erkennt echte Dubletten unabhängig von Großschreibung und Leerzeichen', () => {
    expect(priceItemIdentity({ category: ' Boden – Vinyl ', title: ' Klickvinyl verlegen ', unit: ' M² ' }))
      .toBe(priceItemIdentity({ category: 'boden – vinyl', title: 'klickvinyl verlegen', unit: 'm²' }))
  })
})
