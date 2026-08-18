import { describe, expect, it } from 'vitest'
import { getPriceTradeKey, inferPriceCategory, priceItemIdentity } from '../price-catalog'

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

  it('sortiert neue Bodenpositionen automatisch ein', () => {
    expect(inferPriceCategory('Boden', 'Klickvinyl verlegen')).toBe('Boden – Vinyl / LVT')
    expect(inferPriceCategory('Boden', 'Alten Teppichboden entfernen')).toBe('Boden – Altbelag entfernen')
    expect(inferPriceCategory('Boden', 'Sockelleisten montieren')).toBe('Boden – Abschlussarbeiten')
  })

  it('sortiert neue Malerpositionen automatisch ein', () => {
    expect(inferPriceCategory('Maler', 'Raufasertapete tapezieren')).toBe('Maler – Tapezieren')
    expect(inferPriceCategory('Maler', 'Wände grundieren')).toBe('Maler – Untergrundvorbereitung')
    expect(inferPriceCategory('Maler', 'Decke zweimal streichen')).toBe('Maler – Anstrich Innen')
  })
})
