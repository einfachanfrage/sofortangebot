import { describe, expect, it } from 'vitest'
import { konsolidierePlatzhalterRaum } from '../raum-konsolidierung'
import type { ExtrahierteDaten } from '../types'

describe('Platzhalter-Räume', () => {
  it('führt Raum und Schlafzimmer zusammen, ohne Arbeiten zu verlieren', () => {
    const extraktion = {
      raeume: [
        { name: 'Raum', laenge: null, breite: null, hoehe: null, flaeche: null, fenster: [], tueren: [], arbeiten: ['tapete entfernen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false },
        { name: 'Schlafzimmer', laenge: null, breite: null, hoehe: null, flaeche: null, fenster: [], tueren: [], arbeiten: ['waende_streichen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false },
      ],
    } as unknown as ExtrahierteDaten
    const ergebnis = konsolidierePlatzhalterRaum(extraktion)
    expect(ergebnis.raeume).toHaveLength(1)
    expect(ergebnis.raeume[0].name).toBe('Schlafzimmer')
    expect(ergebnis.raeume[0].arbeiten).toEqual(expect.arrayContaining(['tapete entfernen', 'waende_streichen']))
  })

  it('benennt einen einzelnen Platzhalter anhand des gesprochenen Raums um', () => {
    const extraktion = {
      raeume: [{ name: 'Raum', laenge: null, breite: null, hoehe: null, flaeche: null, fenster: [], tueren: [], arbeiten: ['wände streichen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false }],
    } as unknown as ExtrahierteDaten
    const ergebnis = konsolidierePlatzhalterRaum(extraktion, 'Im Flur alte Tapete entfernen und die Wände streichen.')
    expect(ergebnis.raeume[0].name).toBe('Flur')
  })
})
