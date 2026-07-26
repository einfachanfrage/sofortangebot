import { describe, it, expect } from 'vitest'
import { positionsUntertitel, waehleUntertitel } from '../positions-untertitel'

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

  it('Spachtel-Untertext berechnet Schleifen nicht verdeckt doppelt', () => {
    expect(positionsUntertitel('Spachtelarbeiten Q2 — Wohnzimmer')).not.toMatch(/schleif/i)
  })
})

describe('waehleUntertitel — Generator gewinnt, KI nur bei echtem Satz', () => {
  it('Generator gewinnt IMMER gegen KI-Mengen-Echo (der Live-Bug)', () => {
    expect(waehleUntertitel('Wandflächen streichen — Wohnzimmer', '47,71 m²'))
      .toMatch(/anstrich/i)
  })
  it('Mengen-Echo wird NIE zum Untertitel', () => {
    expect(waehleUntertitel('Exotische Sonderposition XY', '28,65 lfdm')).toBe(null)
    expect(waehleUntertitel('Exotische Sonderposition XY', '1 Pauschale')).toBe(null)
  })
  it('echter KI-Satz greift nur ohne Generator-Treffer', () => {
    expect(waehleUntertitel('Exotische Sonderposition XY', 'Sorgfältige Vorarbeit inklusive Randabdichtung'))
      .toMatch(/randabdichtung/i)
  })
  it('KI = Titel → verworfen', () => {
    expect(waehleUntertitel('Irgendwas Spezielles', 'Irgendwas Spezielles')).toBe(null)
  })
})
