// DC-037: gezeichnete Grundrisse überleben das Neu-Aufbauen der Raumdaten.
import { describe, expect, it } from 'vitest'
import { uebernehmeGrundrisse, type RaumDetail } from '../raum-details'
import type { Wand } from '@/lib/raum-geometrie'

const L_FORM: Wand[] = [
  { laenge: 5 }, { laenge: 4, turn: 'R' }, { laenge: 2, turn: 'R' },
  { laenge: 2, turn: 'L' }, { laenge: 3, turn: 'R' }, { laenge: 2, turn: 'R' },
]
const identisch = (n: string) => n

describe('DC-037 — Grundrisse aus der Aufnahme übernehmen', () => {
  it('setzt Modus und Grundriss, ohne Höhe/Türen/Fenster zu verlieren', () => {
    const vorher: Record<string, RaumDetail> = {
      Wohnzimmer: { modus: 'rechteck', laenge: 6, breite: 4, hoehe: 2.6, tueren: 2, fenster: 1 },
    }
    const nachher = uebernehmeGrundrisse(vorher, { Wohnzimmer: L_FORM }, identisch)

    expect(nachher.Wohnzimmer.modus).toBe('grundriss')
    expect(nachher.Wohnzimmer.grundriss).toEqual(L_FORM)
    expect(nachher.Wohnzimmer.hoehe).toBe(2.6)
    expect(nachher.Wohnzimmer.tueren).toBe(2)
    expect(nachher.Wohnzimmer.fenster).toBe(1)
  })

  it('ordnet den gezeichneten Raum über die Namensfindung dem Positions-Titel zu', () => {
    const nachher = uebernehmeGrundrisse({}, { wohnzimmer: L_FORM }, () => 'Wohnzimmer')
    expect(Object.keys(nachher)).toEqual(['Wohnzimmer'])
    expect(nachher.Wohnzimmer.modus).toBe('grundriss')
  })

  it('ignoriert unfertige Zeichnungen statt eine kaputte Form zu speichern', () => {
    const vorher: Record<string, RaumDetail> = { Flur: { modus: 'rechteck', laenge: 4, breite: 1.5 } }
    const nachher = uebernehmeGrundrisse(
      vorher,
      { Flur: [{ laenge: 4 }, { laenge: 2, turn: 'R' }], '': L_FORM },
      identisch,
    )
    expect(nachher).toEqual(vorher)
  })

  it('lässt die Raumdaten unangetastet, wenn gar nichts gezeichnet wurde', () => {
    const vorher: Record<string, RaumDetail> = { Bad: { modus: 'flaeche', wandflaeche: 22 } }
    expect(uebernehmeGrundrisse(vorher, undefined, identisch)).toEqual(vorher)
    expect(uebernehmeGrundrisse(vorher, {}, identisch)).toEqual(vorher)
  })

  it('verändert das übergebene Objekt nicht (kein stiller Seiteneffekt)', () => {
    const vorher: Record<string, RaumDetail> = { Küche: { modus: 'rechteck', laenge: 3, breite: 3 } }
    uebernehmeGrundrisse(vorher, { Küche: L_FORM }, identisch)
    expect(vorher.Küche.modus).toBe('rechteck')
    expect(vorher.Küche.grundriss).toBeUndefined()
  })
})
