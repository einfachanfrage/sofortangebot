import { describe, expect, it } from 'vitest'
import { bereiteRueckfragenVor } from '../rueckfragen-flow'
import { verarbeiteAntworten } from '../antworten-verarbeiter'
import type { ExtrahierteDaten } from '../types'

function basis(overrides: Partial<ExtrahierteDaten> = {}): ExtrahierteDaten {
  return {
    gewerk: 'maler', confidence_gewerk: 1,
    kunde: { name: null, adresse: null, ort: null },
    raeume: [], waende: [], decken: [], bereiche: [],
    steckdosen: null, schalter: null, spots: null, aussenlampen: null, wandlampen: null,
    herdanschluss: false, wallbox: false, unterverteilung: false, hauptverteilung: false,
    kabelmeter: null, neu_verkabeln: false,
    wc: null, waschtisch: null, dusche: null, wanne: null, urinal: null, bidet: null,
    armaturen: null, rohrmeter: null, leitungen_erneuern: false, heizkoerper: null,
    austausch: false, erneuerung: false, altbelag: [], erschwernisse: [],
    anmerkungen: null, fehlende_angaben: [], transkript: '',
    ...overrides,
  }
}

describe('geschlossener Rückfragen-Flow', () => {
  it('plant bei mehreren Räumen alle Rückfragen in einer Runde und respektiert direkte Wandfläche', () => {
    const extraktion = basis({
      transkript: 'Wohnzimmer 6 mal 4 Meter und 2,50 hoch, Wände und Decke streichen. Schlafzimmer 4 mal 3 Meter, 2,50 hoch, nur Wände streichen. Im Flur sind es 18 Quadratmeter Wandfläche. In allen Räumen Böden schützen.',
      raeume: [
        { name: 'Wohnzimmer', laenge: 6, breite: 4, hoehe: 2.5, flaeche: 24, fenster: [], tueren: [], arbeiten: ['waende_streichen', 'decke_streichen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false },
        { name: 'Schlafzimmer', laenge: 4, breite: 3, hoehe: 2.5, flaeche: 12, fenster: [], tueren: [], arbeiten: ['waende_streichen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false },
        { name: 'Flur', laenge: null, breite: null, hoehe: null, flaeche: 18, fenster: [], tueren: [], arbeiten: ['waende_streichen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false },
      ],
    })
    const analyse = bereiteRueckfragenVor(extraktion)
    expect(analyse.rueckfragen.map(frage => frage.id)).toEqual([
      'tueren_anzahl_wohnzimmer', 'fenster_anzahl_wohnzimmer',
      'tueren_anzahl_schlafzimmer', 'fenster_anzahl_schlafzimmer',
      'masse_boden_flur',
    ])
    expect(analyse.extraktion.raeume[2].wandflaeche_direkt).toBe(18)
    expect(analyse.rueckfragen.some(frage => frage.id.includes('hoehe_flur'))).toBe(false)
  })

  it('bewahrt die ausdrücklich gewählte Anzahl null für Öffnungen', () => {
    const extraktion = basis({
      raeume: [{ name: 'Flur', laenge: 4, breite: 4, hoehe: 2.6, flaeche: 16, fenster: [], tueren: [], arbeiten: ['waende_streichen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false }],
    })
    const beantwortet = verarbeiteAntworten(extraktion, {
      fenster_anzahl_flur: { wert: 0, einheit: 'Stück' },
      tueren_anzahl_flur: { wert: 3, einheit: 'Stück' },
    })
    expect(beantwortet.raeume[0].fenster).toEqual([{ anzahl: 0 }])
    expect(beantwortet.raeume[0].tueren).toEqual([{ anzahl: 3 }])
  })

  it('übernimmt auch sechs Türen statt die Anzahl künstlich zu begrenzen', () => {
    const extraktion = basis({
      raeume: [{ name: 'Flur', laenge: 8, breite: 1.5, hoehe: 2.6, flaeche: 12, fenster: [], tueren: [], arbeiten: ['waende_streichen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false }],
    })
    const beantwortet = verarbeiteAntworten(extraktion, {
      tueren_anzahl_flur: { wert: 6, einheit: 'Stück' },
    })
    expect(beantwortet.raeume[0].tueren).toEqual([{ anzahl: 6 }])
  })

  it('übernimmt eine direkt eingegebene Wandfläche ohne weitere Raumgeometrie', () => {
    const extraktion = basis({
      raeume: [{ name: 'Flur', laenge: null, breite: null, hoehe: null, flaeche: null, fenster: [], tueren: [], arbeiten: ['waende_streichen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false }],
    })
    const beantwortet = bereiteRueckfragenVor(extraktion, {
      masse_flur: { wert: 42, einheit: 'm²' },
    })
    expect(beantwortet.extraktion.raeume[0]).toMatchObject({ flaeche: 42, wandflaeche_direkt: 42 })
    expect(beantwortet.rueckfragen.some(frage => /^(hoehe|tueren_anzahl|fenster_anzahl)_flur$/.test(frage.id))).toBe(false)
  })

  it('fragt nach vollständiger Geometrie noch Türen und Fenster ab', () => {
    const extraktion = basis({
      transkript: 'Im Schlafzimmer die Wände streichen',
      raeume: [{
        name: 'Schlafzimmer', laenge: 5, breite: 4, hoehe: 2.6, flaeche: 20,
        fenster: [], tueren: [], arbeiten: ['waende_streichen'],
        altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
      }],
    })
    const analyse = bereiteRueckfragenVor(extraktion)
    expect(analyse.rueckfragen.map(frage => frage.id)).toEqual(expect.arrayContaining([
      'tueren_anzahl_schlafzimmer', 'fenster_anzahl_schlafzimmer',
    ]))
  })

  it('fragt eine fehlende Raumhöhe ab und übernimmt die Antwort', () => {
    const extraktion = basis({
      raeume: [{
        name: 'Wohnzimmer', laenge: 5, breite: 4, hoehe: null, flaeche: null,
        fenster: [], tueren: [], arbeiten: ['wände streichen'],
        altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
      }],
    })

    const analyse = bereiteRueckfragenVor(extraktion)
    expect(analyse.rueckfragen.some(frage => frage.id === 'hoehe_wohnzimmer')).toBe(true)

    const beantwortet = bereiteRueckfragenVor(extraktion, {
      hoehe_wohnzimmer: { wert: 2.7, einheit: 'm' },
    })
    expect(beantwortet.extraktion.raeume[0].hoehe).toBe(2.7)
    expect(beantwortet.rueckfragen.some(frage => frage.id === 'hoehe_wohnzimmer')).toBe(false)
  })

  it('übernimmt Länge und Breite vor der Mengenberechnung', () => {
    const extraktion = basis({
      raeume: [{
        name: 'Küche', laenge: null, breite: null, hoehe: 2.6, flaeche: null,
        fenster: [], tueren: [], arbeiten: ['wände streichen'],
        altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
      }],
    })
    const beantwortet = bereiteRueckfragenVor(extraktion, {
      masse_küche: { wert: [4, 3], einheit: 'm' },
    })
    expect(beantwortet.extraktion.raeume[0]).toMatchObject({ laenge: 4, breite: 3, flaeche: 12 })
  })

  it('fragt nach beantworteten Raummaßen anschließend noch die fehlende Höhe', () => {
    const extraktion = basis({
      raeume: [{
        name: 'Schlafzimmer', laenge: null, breite: null, hoehe: null, flaeche: null,
        fenster: [], tueren: [], arbeiten: ['waende_streichen'],
        altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
      }],
    })
    const beantwortet = bereiteRueckfragenVor(extraktion, {
      masse_schlafzimmer: { wert: [6, 3.4], einheit: 'm' },
    })
    expect(beantwortet.rueckfragen.some(frage => frage.id === 'hoehe_schlafzimmer')).toBe(true)
  })

  it('wendet Belag, Altbelag und Leitungsmeter deterministisch an', () => {
    const extraktion = basis({
      gewerk: 'boden_parkett',
      raeume: [{
        name: 'Flur', laenge: 5, breite: 2, hoehe: null, flaeche: null,
        fenster: [], tueren: [], arbeiten: ['boden verlegen'],
        altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
      }],
    })
    const boden = verarbeiteAntworten(extraktion, {
      belag_flur: { wert: 2, einheit: 'Auswahl' },
      altbelag_flur: { wert: 1, einheit: 'bool' },
    })
    expect(boden.raeume[0].belag).toBe('Vinyl')
    expect(boden.raeume[0].altbelag_entfernen).toBe(true)

    const elektro = verarbeiteAntworten(basis({ gewerk: 'elektro' }), {
      kabel_meter: { wert: 40, einheit: 'm' },
      unterverteilung: { wert: 1, einheit: 'bool' },
    })
    expect(elektro.kabelmeter).toBe(40)
    expect(elektro.unterverteilung).toBe(true)
  })
})
