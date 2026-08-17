import { describe, it, expect } from 'vitest'
import { filtereExakteDubletten } from '../quote-items-dedup'

describe('filtereExakteDubletten — PM-014 (verdoppeltes Angebot 2026-0016)', () => {
  it('blockt exakte Dublette mit Raum-Suffix (der eigentliche PM-014-Fall)', () => {
    const neue = [
      { title: 'Wandflächen streichen 2x — Arbeitszimmer', quantity: 30.71 },
      { title: 'Boden schützen — Arbeitszimmer', quantity: 10.5 },
    ]
    const bestehende = [
      { title: 'Wandflächen streichen 2x — Arbeitszimmer', quantity: 30.71 },
      { title: 'Boden schützen — Arbeitszimmer', quantity: 10.5 },
    ]
    expect(filtereExakteDubletten(neue, bestehende)).toEqual([])
  })

  it('erlaubt denselben Titel in ZWEI unterschiedlichen Räumen (kein falscher Positiv)', () => {
    const neue = [{ title: 'Wandflächen streichen — Küche', quantity: 20 }]
    const bestehende = [{ title: 'Wandflächen streichen — Flur', quantity: 20 }]
    expect(filtereExakteDubletten(neue, bestehende)).toHaveLength(1)
  })

  it('erlaubt denselben Titel im selben Raum mit ANDERER Menge (echte Korrektur, keine Dublette)', () => {
    const neue = [{ title: 'Wandflächen streichen — Flur', quantity: 25 }]
    const bestehende = [{ title: 'Wandflächen streichen — Flur', quantity: 20 }]
    expect(filtereExakteDubletten(neue, bestehende)).toHaveLength(1)
  })

  it('blockt exakte Dublette auch OHNE Raum-Suffix (allgemeine Position)', () => {
    const neue = [{ title: 'Kleinmaterial', quantity: 1 }]
    const bestehende = [{ title: 'Kleinmaterial', quantity: 1 }]
    expect(filtereExakteDubletten(neue, bestehende)).toEqual([])
  })

  it('Groß-/Kleinschreibung und Leerzeichen spielen keine Rolle', () => {
    const neue = [{ title: '  Wandflächen Streichen — Flur  ', quantity: 20 }]
    const bestehende = [{ title: 'wandflächen streichen — flur', quantity: 20 }]
    expect(filtereExakteDubletten(neue, bestehende)).toEqual([])
  })

  it('leere bestehende Liste → nichts wird gefiltert', () => {
    const neue = [{ title: 'Wandflächen streichen — Flur', quantity: 20 }]
    expect(filtereExakteDubletten(neue, [])).toHaveLength(1)
  })

  it('fehlende Menge (undefined) wird wie 1 behandelt, konsistent auf beiden Seiten', () => {
    const neue = [{ title: 'Anfahrt', quantity: undefined }]
    const bestehende = [{ title: 'Anfahrt', quantity: 1 }]
    expect(filtereExakteDubletten(neue, bestehende)).toEqual([])
  })
})
