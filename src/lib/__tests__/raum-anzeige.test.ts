import { describe, it, expect } from 'vitest'
import { brauchtWandmasse } from '../raum-anzeige'

// Die Titel hier sind wörtlich die aus Sandys Live-Lauf vom 05.09.2026
// (PM-034) und aus den Maler-Testfällen — keine ausgedachten Beispiele.

describe('PM-034: reiner Bodenauftrag braucht keine Raumhöhe', () => {
  it('Küche — Vinyl, Altbelag, Sockelleisten, Ausgleich', () => {
    expect(brauchtWandmasse([
      'Vinyl-Boden verlegen inkl. 5% Verschnitt',
      'Altbelag entfernen',
      'Sockelleisten montieren',
      'Untergrundvorbereitung / Ausgleich',
    ])).toBe(false)
  })

  it('Esszimmer — der Fall, an dem es kippte: „Estrich grundieren"', () => {
    expect(brauchtWandmasse([
      'Vinyl-Boden verlegen inkl. 5% Verschnitt',
      'Sockelleisten montieren',
      'Estrich grundieren',
    ])).toBe(false)
  })

  it('auch „Boden spachteln" und „Parkett schleifen" sind keine Wandarbeit', () => {
    expect(brauchtWandmasse(['Boden spachteln'])).toBe(false)
    expect(brauchtWandmasse(['Parkett schleifen'])).toBe(false)
    expect(brauchtWandmasse(['Untergrund grundieren'])).toBe(false)
  })
})

describe('Wandarbeiten brauchen die Maße weiterhin', () => {
  for (const titel of [
    'Wandflächen streichen',
    'Decke zweimal streichen',
    'Raufasertapete entfernen',
    'Wände spachteln Q3',
    'Akzentwand tapezieren',
    'Dachschrägen grundieren',
    'Kniestock streichen',
    'Fassadenfarbe auftragen',
    'Leibungen streichen',
  ]) {
    it(titel, () => expect(brauchtWandmasse([titel])).toBe(true))
  }

  it('ein Wandobjekt reicht, auch neben Bodenpositionen', () => {
    expect(brauchtWandmasse(['Vinyl-Boden verlegen', 'Wände streichen'])).toBe(true)
  })

  it('Wandfliesen bleiben wandrelevant, Bodenfliesen nicht', () => {
    expect(brauchtWandmasse(['Wandfliesen verlegen'])).toBe(true)
    expect(brauchtWandmasse(['Bodenfliesen verlegen'])).toBe(false)
  })
})

describe('Randfälle', () => {
  it('leere Liste', () => expect(brauchtWandmasse([])).toBe(false))
  it('null und undefined stören nicht', () => {
    expect(brauchtWandmasse([null, undefined, 'Wände streichen'])).toBe(true)
    expect(brauchtWandmasse([null, undefined])).toBe(false)
  })
})
