import { describe, it, expect } from 'vitest'
import { positionsUntertitel } from '../positions-untertitel'

describe('positionsUntertitel', () => {
  it.each([
    ['Wandflächen streichen — Wohnzimmer', /anstrich/i],
    ['Deckenfläche streichen — Flur', /decken/i],
    ['Wände spachteln / glätten', /spachteln|eben/i],
    ['Tapete entfernen', /tapete/i],
    ['Voranstrich / Grundierung', /grundier|saugf/i],
    ['Sockelleisten abkleben — Bad', /abkleben/i],
    ['Boden schützen / Abdecken', /schütz/i],
    ['Vinyl-Boden verlegen inkl. 10% Verschnitt — Flur', /verlegt/i],
    ['Altbelag entfernen — Flur', /aufnehmen|entsorg/i],
    ['Kleberreste abschleifen', /kleberrest/i],
    ['Sockelleisten montieren', /montier/i],
    ['Türen lackieren (2× Anstrich)', /lackier/i],
    ['Kleinmaterial und Verbrauchsmaterial', /verbrauchsmaterial/i],
  ] as const)('"%s" → passender Untertitel', (titel, muster) => {
    const u = positionsUntertitel(titel)
    expect(u).toBeTruthy()
    expect(u!).toMatch(muster)
  })

  it('unbekannte Position → null', () => {
    expect(positionsUntertitel('Irgendwas Exotisches XY')).toBe(null)
  })

  it('Untertitel wiederholt nie den Titel', () => {
    const titel = 'Wandflächen streichen — Wohnzimmer'
    expect(positionsUntertitel(titel)).not.toBe(titel)
  })
})
