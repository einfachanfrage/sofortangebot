// DC-056 / TN-010 (Manfred, 11.09.2026) — Kleinbeträge zusammenfassen.
import { describe, it, expect } from 'vitest'
import { fasseKleinbetraegeZusammen, SAMMEL_TITEL } from '@/lib/kleinbetraege'
import { istAllgemeinPosition } from '@/lib/angebot-gruppierung'

function pos(id: string, title: string, total: number, position: number, unit = 'm²') {
  return { id, title, description: null, quantity: 1, unit, unit_price: total, total_price: total, position }
}

const MANFRED = [
  pos('1', 'Wandflächen streichen 2x — Wohnzimmer', 611.8, 1),
  pos('2', 'Boden schützen — Wohnzimmer', 2.7, 2),
  pos('3', 'Sockelleisten abkleben — Flur', 4.08, 3),
  pos('4', 'An- und Abfahrt', 4.5, 4, 'Pauschale'),
]

describe('DC-056 — Kleinbeträge', () => {
  it('lässt alles in Ruhe, solange der Schalter aus ist', () => {
    expect(fasseKleinbetraegeZusammen(MANFRED, false, istAllgemeinPosition)).toBe(MANFRED)
  })

  it('fasst Manfreds zwei Pfennigposten zu einer Zeile zusammen', () => {
    const r = fasseKleinbetraegeZusammen(MANFRED, true, istAllgemeinPosition)
    expect(r).toHaveLength(3)
    const sammel = r.find(i => i.title === SAMMEL_TITEL)!
    expect(sammel.total_price).toBe(6.78)
    expect(sammel.description).toBe('Boden schützen — Wohnzimmer · Sockelleisten abkleben — Flur')
  })

  it('fasst An-/Abfahrt nicht mit ein, auch wenn sie klein ist', () => {
    const r = fasseKleinbetraegeZusammen(MANFRED, true, istAllgemeinPosition)
    expect(r.some(i => i.title === 'An- und Abfahrt')).toBe(true)
  })

  it('ändert die Gesamtsumme nicht', () => {
    const vorher = MANFRED.reduce((s, i) => s + i.total_price, 0)
    const nachher = fasseKleinbetraegeZusammen(MANFRED, true, istAllgemeinPosition)
      .reduce((s, i) => s + i.total_price, 0)
    expect(Math.round(nachher * 100)).toBe(Math.round(vorher * 100))
  })

  it('fasst eine einzelne Kleinposition nicht zusammen', () => {
    const eins = [MANFRED[0], MANFRED[1]]
    expect(fasseKleinbetraegeZusammen(eins, true, istAllgemeinPosition)).toBe(eins)
  })

  it('fasst Prozent-Zuschläge nicht mit ein', () => {
    const mitZuschlag = [
      pos('1', 'Wand streichen', 500, 1),
      pos('2', 'Boden schützen', 2.7, 2),
      pos('3', 'Sockelleisten abkleben', 4.08, 3),
      pos('4', 'Erschwerniszuschlag Altbau', 5, 4, '%'),
    ]
    const r = fasseKleinbetraegeZusammen(mitZuschlag, true, istAllgemeinPosition)
    expect(r.some(i => i.title === 'Erschwerniszuschlag Altbau')).toBe(true)
    expect(r.find(i => i.title === SAMMEL_TITEL)!.total_price).toBe(6.78)
  })

  it('setzt die Sammelzeile an die Stelle der ersten zusammengefassten Position', () => {
    const r = fasseKleinbetraegeZusammen(MANFRED, true, istAllgemeinPosition)
    expect(r.map(i => i.title)).toEqual([
      'Wandflächen streichen 2x — Wohnzimmer',
      SAMMEL_TITEL,
      'An- und Abfahrt',
    ])
  })
})
