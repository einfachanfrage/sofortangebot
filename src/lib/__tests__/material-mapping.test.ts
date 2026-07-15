import { describe, it, expect } from 'vitest'
import { materialFuerPosition } from '../material-mapping'

describe('materialFuerPosition', () => {
  it.each([
    ['Wandflächen streichen — Wohnzimmer', 'Wandfarbe', 'm²'],
    ['Deckenfläche streichen — Flur', 'Deckenfarbe', 'm²'],
    ['Voranstrich / Grundierung', 'Tiefengrund / Grundierung', 'm²'],
    ['Wände spachteln / glätten', 'Spachtelmasse', 'm²'],
    ['Vinyl-Boden verlegen inkl. 10% Verschnitt — Flur', 'Vinyl / Designboden (Material)', 'm²'],
    ['Laminat verlegen', 'Laminat (Material)', 'm²'],
    ['Fertigparkett verlegen — Zimmer', 'Parkett (Material)', 'm²'],
    ['Türen lackieren (2× Anstrich)', 'Lack (Türen)', 'Stück'],
    ['Sockelleisten montieren', 'Sockelleisten (Material)', 'lfdm'],
  ] as const)('"%s" → %s (%s)', (titel, name, unit) => {
    const m = materialFuerPosition(titel)
    expect(m).toEqual({ name, unit })
  })

  it.each([
    'Sockelleisten abkleben — Bad',
    'Boden schützen / Abdecken',
    'Altbelag entfernen — Flur',
    'Kleberreste abschleifen',
    'Erschwerniszuschlag Raumhöhe > 3m',
    'Kleinmaterial und Verbrauchsmaterial',
    'An- und Abfahrt',
  ])('"%s" → kein Material (null)', (titel) => {
    expect(materialFuerPosition(titel)).toBe(null)
  })

  it('Material-Position selbst bekommt kein weiteres Material', () => {
    expect(materialFuerPosition('Wandfarbe')).toBe(null)
    expect(materialFuerPosition('Vinyl / Designboden (Material)')).toBe(null)
  })
})
