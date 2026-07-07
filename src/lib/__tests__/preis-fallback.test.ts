import { describe, it, expect } from 'vitest'
import { malerFallbackPreis } from '../preis-fallback'

describe('malerFallbackPreis — Kernpositionen bekommen nie 0 €', () => {
  it.each([
    ['Wandflächen streichen — Wohnzimmer', 'm²', 9.5],
    ['Deckenfläche streichen — Küche', 'm²', 8.5],
    ['Boden schützen — Flur', 'm²', 2.5],
    ['Sockelleisten abkleben — Bad', 'lfdm', 1.5],
    ['Tapete entfernen', 'm²', 4.0],
    ['Wände spachteln / glätten', 'm²', 8.0],
    ['Raufaser aufziehen', 'm²', 12.0],
    ['Raufaser streichen', 'm²', 9.5],
    ['Türen lackieren (2× Anstrich)', 'Stück', 45.0],
    ['Türen abschleifen', 'Stück', 35.0],
    ['Fenster Lack (2× Anstrich)', 'Stück', 45.0],
    ['Heizkörper lackieren (2× Anstrich)', 'Stück', 45.0],
  ])('"%s" (%s) → %s €', (title, unit, erwartet) => {
    expect(malerFallbackPreis(title, unit)).toBe(erwartet)
  })

  it('unterscheidet Wand und Decke trotz gleicher Einheit', () => {
    expect(malerFallbackPreis('Wandflächen streichen', 'm²')).toBe(9.5)
    expect(malerFallbackPreis('Deckenfläche streichen', 'm²')).toBe(8.5)
  })

  it('unterscheidet Sockelleisten abkleben vs. lackieren', () => {
    expect(malerFallbackPreis('Sockelleisten abkleben', 'lfdm')).toBe(1.5)
    expect(malerFallbackPreis('Sockelleisten lackieren (2× Anstrich)', 'lfdm')).toBe(3.5)
  })

  it('gibt null für unbekannte Positionen (kein falscher Preis)', () => {
    expect(malerFallbackPreis('Bautrockner mieten', 'Tag')).toBeNull()
    expect(malerFallbackPreis('Gerüst aufbauen', 'Pauschale')).toBeNull()
  })

  it('falsche Einheit → kein Match', () => {
    expect(malerFallbackPreis('Wandflächen streichen', 'lfdm')).toBeNull()
  })
})
