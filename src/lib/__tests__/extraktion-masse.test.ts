import { describe, it, expect } from 'vitest'
import {
  extrahiereWandflaeche, extrahiereDeckenflaeche, extrahiereAbzug,
  extrahiereTorMasse, zaehleFenster, zaehleTueren, extrahiereRaumhoehe,
} from '../extraktion-masse'

describe('extrahiereWandflaeche', () => {
  it.each([
    ['Wandfläche 40 m²', 40],
    ['40 qm Wandfläche', 40],
    ['die Wände haben 52,5 Quadratmeter', 52.5],
  ] as const)('"%s" → %s', (t, erw) => { expect(extrahiereWandflaeche(t)).toBe(erw) })

  it('Bodenfläche wird NICHT als Wandfläche gelesen', () => {
    expect(extrahiereWandflaeche('24 Quadratmeter Bodenfläche')).toBe(null)
  })
  it('Frust-Ansage: 24 qm Boden + Wände in getrenntem Satz → keine falsche Wandfläche', () => {
    expect(extrahiereWandflaeche('24 Quadratmeter Bodenfläche. Die Wände sind 2,60 hoch.')).toBe(null)
  })
})

describe('extrahiereDeckenflaeche', () => {
  it.each([
    ['die Decke ist 20 m²', 20],
    ['20 qm Deckenfläche', 20],
  ] as const)('"%s" → %s', (t, erw) => { expect(extrahiereDeckenflaeche(t)).toBe(erw) })
})

describe('extrahiereAbzug', () => {
  it.each([
    ['davon 5 m² abziehen', 5],
    ['minus 3,5 qm', 3.5],
    ['abzüglich 8 m²', 8],
  ] as const)('"%s" → %s', (t, erw) => { expect(extrahiereAbzug(t)).toBe(erw) })
})

describe('extrahiereTorMasse', () => {
  it.each([
    ['Garagentor 2,5 mal 2 Meter', { breite: 2.5, hoehe: 2 }],
    ['Tor 3x2,2', { breite: 3, hoehe: 2.2 }],
  ] as const)('"%s"', (t, erw) => { expect(extrahiereTorMasse(t)).toEqual(erw) })
  it('kein Tor → null', () => { expect(extrahiereTorMasse('normale Tür 0,9 x 2,1')).toBe(null) })
})

describe('extrahiereRaumhoehe — robust gegen "2 Meter 60"-Falle', () => {
  it.each([
    ['2,60 m hoch', 2.6],
    ['2,60 hoch', 2.6],
    ['2,60 meter hoch', 2.6],
    ['2 Meter 60 hoch', 2.6],   // Whisper-Kompaktform — DARF nicht 60 werden
    ['2 m 60 hoch', 2.6],
    ['3 meter hoch', 3],
    ['Raumhöhe 4,5', 4.5],
    ['bodenfläche 20qm, 2,60 hoch, eine tür', 2.6],
  ] as const)('"%s" → %s', (t, erw) => { expect(extrahiereRaumhoehe(t)).toBe(erw) })

  it('keine Höhe → null', () => { expect(extrahiereRaumhoehe('20 qm streichen')).toBe(null) })
  it('unplausibel (60 m) → null', () => { expect(extrahiereRaumhoehe('60 m hoch')).toBe(null) })
})

describe('zaehleFenster / zaehleTueren', () => {
  it('2 Fenster, 1 Tür', () => {
    expect(zaehleFenster('2 Fenster')).toBe(2)
    expect(zaehleTueren('1 Tür')).toBe(1)
  })
  it('3 Dachfenster', () => { expect(zaehleFenster('3 Dachfenster')).toBe(3) })
  it('keine Zahl → 0', () => {
    expect(zaehleFenster('mit Fenster')).toBe(0)
    expect(zaehleTueren('eine Tür')).toBe(0)
  })
})
