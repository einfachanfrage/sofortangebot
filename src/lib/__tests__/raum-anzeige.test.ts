import { describe, it, expect } from 'vitest'
import { brauchtWandmasse, brauchtRaumhoehe } from '../raum-anzeige'

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

describe('PM-030, Befund 3 — im Dachgeschoss gibt es keine eine Raumhöhe', () => {
  const DACHZIMMER = [
    'Kniestockwände streichen 2x',
    'Dachschrägen streichen 2x',
    'Boden schützen',
    'Sockelleisten abkleben',
  ]

  it('keine Raumhöhe abfragen — Kniestockhöhe und Schrägen sind einzeln genannt', () => {
    expect(brauchtRaumhoehe(DACHZIMMER)).toBe(false)
  })

  it('Türen und Dachfenster bleiben aber auf der Karte', () => {
    // Das ist der Unterschied zu zwei Fragen in einer Funktion: Das
    // Dachfenster geht in die Schrägenfläche ein, es muss korrigierbar
    // bleiben. Nur die Höhe verschwindet.
    expect(brauchtWandmasse(DACHZIMMER)).toBe(true)
  })

  it('auch ein Deckenspiegel reicht als Dachgeschoss-Signal', () => {
    expect(brauchtRaumhoehe(['Deckenspiegel streichen', 'Wandflächen streichen 2x'])).toBe(false)
  })

  it('ein normaler Raum braucht seine Höhe weiterhin', () => {
    expect(brauchtRaumhoehe(['Wandflächen streichen 2x', 'Deckenfläche streichen 2x'])).toBe(true)
  })

  it('ein reiner Bodenauftrag braucht weiterhin keine (PM-034)', () => {
    expect(brauchtRaumhoehe(['Vinyl-Boden verlegen', 'Estrich grundieren'])).toBe(false)
  })
})
