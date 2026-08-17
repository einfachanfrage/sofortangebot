import { describe, it, expect } from 'vitest'
import { pruefeMassPlausibilitaet } from '../mass-plausibilitaet'

describe('pruefeMassPlausibilitaet — PM-010 Whisper-Vorschlag (Plausibilitäts-Warnung)', () => {
  it('warnt bei absurder Länge (Whisper "drei fünfzig" → 350)', () => {
    const warnungen = pruefeMassPlausibilitaet([{ name: 'Gästezimmer', laenge: 350, breite: 3 }])
    expect(warnungen).toHaveLength(1)
    expect(warnungen[0]).toContain('Gästezimmer')
    expect(warnungen[0]).toContain('Länge')
    expect(warnungen[0]).toContain('350')
  })

  it('warnt bei absurder Breite genauso wie bei Länge', () => {
    const warnungen = pruefeMassPlausibilitaet([{ name: 'Flur', laenge: 5, breite: 280 }])
    expect(warnungen).toHaveLength(1)
    expect(warnungen[0]).toContain('Breite')
  })

  it('keine Warnung bei normalen Raummaßen', () => {
    expect(pruefeMassPlausibilitaet([{ name: 'Wohnzimmer', laenge: 5.2, breite: 4.1 }])).toEqual([])
  })

  it('keine Warnung bei fehlenden Maßen (null/undefined)', () => {
    expect(pruefeMassPlausibilitaet([{ name: 'Wohnzimmer', laenge: null, breite: undefined }])).toEqual([])
  })

  it('grenzwertig: genau am Schwellenwert (15 m) noch keine Warnung, knapp drüber schon', () => {
    expect(pruefeMassPlausibilitaet([{ name: 'Halle', laenge: 15, breite: 4 }])).toEqual([])
    expect(pruefeMassPlausibilitaet([{ name: 'Halle', laenge: 15.1, breite: 4 }])).toHaveLength(1)
  })

  it('mehrere Räume: nur der betroffene Raum bekommt eine Warnung', () => {
    const warnungen = pruefeMassPlausibilitaet([
      { name: 'Küche', laenge: 3.5, breite: 2.8 },
      { name: 'Gästezimmer', laenge: 350, breite: 3 },
    ])
    expect(warnungen).toHaveLength(1)
    expect(warnungen[0]).toContain('Gästezimmer')
  })

  it('leere/fehlende Raumliste → keine Warnung, kein Crash', () => {
    expect(pruefeMassPlausibilitaet([])).toEqual([])
    expect(pruefeMassPlausibilitaet(undefined)).toEqual([])
    expect(pruefeMassPlausibilitaet(null)).toEqual([])
  })
})
