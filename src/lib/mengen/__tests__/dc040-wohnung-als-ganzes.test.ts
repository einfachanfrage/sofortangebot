// DC-040: Der Handwerker spricht die Wohnung als Ganzes ein
// ("120 m² Wandfläche, 55 m² Laminat") statt Raum für Raum.
//
// Sandys Entscheidung vom 29.08.: bei einer direkt genannten Wandfläche NICHT
// raten, ob Türen und Fenster noch drinstecken, sondern einmal nachfragen.
import { describe, expect, it } from 'vitest'
import { bereiteRueckfragenVor } from '../rueckfragen-flow'
import { verarbeiteAntworten } from '../antworten-verarbeiter'
import { malerEngine } from '../gewerke/maler'
import { extrahiereBodenflaeche } from '@/lib/extraktion-masse'
import { PROMPT_EXTRAKTION } from '../prompt-extraktion'
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

const TRANSKRIPT = 'In der ganzen Wohnung müssen 120 m² Wandfläche gestrichen werden und 55 m² Laminat verlegt werden.'

function wohnung(extra: Record<string, unknown> = {}): ExtrahierteDaten {
  return basis({
    transkript: TRANSKRIPT,
    raeume: [{
      name: 'Wohnung', laenge: null, breite: null, hoehe: null, flaeche: 55,
      wandflaeche_direkt: 120, fenster: [], tueren: [],
      arbeiten: ['waende_streichen'],
      altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
      ...extra,
    }],
  })
}

describe('DC-040 — Bodenfläche aus dem Transkript lesen', () => {
  it('findet die Bodenfläche neben der Wandfläche im selben Satz', () => {
    expect(extrahiereBodenflaeche(TRANSKRIPT)).toBe(55)
    expect(extrahiereBodenflaeche('Bodenfläche 40 qm')).toBe(40)
    expect(extrahiereBodenflaeche('30 m² Parkett abschleifen')).toBe(30)
  })

  it('hält eine reine Wandflächen-Angabe für keine Bodenfläche', () => {
    expect(extrahiereBodenflaeche('120 m² Wandfläche streichen')).toBeNull()
    expect(extrahiereBodenflaeche('Wohnzimmer 5 mal 4 Meter')).toBeNull()
  })
})

describe('DC-040 — Prompt behandelt die Wohnung als Pseudo-Raum', () => {
  it('nennt "die ganze Wohnung" nur noch mit Einschränkung als vage', () => {
    expect(PROMPT_EXTRAKTION).toMatch(/WOHNUNG \/ HAUS ALS GANZES/)
    expect(PROMPT_EXTRAKTION).toMatch(/"die ganze Wohnung" — ABER NUR wenn keine Flächen- oder Maßangabe/)
  })

  it('nimmt Gesamtflächen von der 200-m²-Plausibilitätsgrenze aus', () => {
    expect(PROMPT_EXTRAKTION).toMatch(/AUSNAHME: Pseudo-Räume/)
  })
})

describe('DC-040 — nachfragen statt raten', () => {
  it('fragt bei direkt genannter Wandfläche, ob Türen und Fenster noch drin sind', () => {
    const { rueckfragen } = bereiteRueckfragenVor(wohnung())
    const frage = rueckfragen.find(f => f.id === 'oeffnungen_brutto_wohnung')
    expect(frage?.frage).toBe('Sind die 120 m² Wandfläche in "Wohnung" inklusive Türen und Fenster?')
    expect(frage?.typ).toBe('ja_nein')
    // Vor der Antwort keine Stückzahl-Fragen — die wären ohne Brutto/Netto sinnlos.
    expect(rueckfragen.some(f => /^(tueren|fenster)_anzahl_/.test(f.id))).toBe(false)
  })

  it('fragt bei einem einzelnen Raum NICHT — dort bleibt eine genannte Fläche netto', () => {
    // Bewusste Grenze: „im Flur sind es 18 m² Wandfläche" verhält sich
    // unverändert wie bisher. Ob das auch dort gefragt werden soll, ist eine
    // offene Produktentscheidung für Sandy, kein Teil von DC-040.
    const flur = basis({
      raeume: [{
        name: 'Flur', laenge: null, breite: null, hoehe: null, flaeche: null,
        wandflaeche_direkt: 18, fenster: [], tueren: [], arbeiten: ['waende_streichen'],
        altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
      }],
    })
    const { rueckfragen } = bereiteRueckfragenVor(flur)
    expect(rueckfragen.some(f => f.id === 'oeffnungen_brutto_flur')).toBe(false)
  })

  it('fragt nicht, wenn der Handwerker den Abzug selbst genannt hat', () => {
    const { rueckfragen } = bereiteRueckfragenVor(wohnung({ wandflaeche_abzug_m2: 5 }))
    expect(rueckfragen.some(f => f.id === 'oeffnungen_brutto_wohnung')).toBe(false)
  })

  it('fragt nach der Antwort "ja, sind noch drin" die Stückzahlen nach', () => {
    const { rueckfragen } = bereiteRueckfragenVor(wohnung(), {
      oeffnungen_brutto_wohnung: { wert: 1, einheit: 'bool' },
    })
    expect(rueckfragen.map(f => f.id)).toContain('tueren_anzahl_wohnung')
    expect(rueckfragen.map(f => f.id)).toContain('fenster_anzahl_wohnung')
    // Die beantwortete Frage kommt nicht zurück (PM-007-Endlosschleife).
    expect(rueckfragen.some(f => f.id === 'oeffnungen_brutto_wohnung')).toBe(false)
  })

  it('fragt nach "nein, schon abgezogen" gar nicht weiter', () => {
    const { rueckfragen } = bereiteRueckfragenVor(wohnung(), {
      oeffnungen_brutto_wohnung: { wert: 0, einheit: 'bool' },
    })
    expect(rueckfragen.some(f => /^(tueren|fenster)_anzahl_|^oeffnungen_brutto_/.test(f.id))).toBe(false)
  })

  it('merkt sich die Antwort in der Extraktion', () => {
    const ja = verarbeiteAntworten(wohnung(), { oeffnungen_brutto_wohnung: { wert: 1, einheit: 'bool' } })
    expect(ja.raeume[0].wandflaeche_brutto).toBe(true)
    const nein = verarbeiteAntworten(wohnung(), { oeffnungen_brutto_wohnung: { wert: 0, einheit: 'bool' } })
    expect(nein.raeume[0].wandflaeche_brutto).toBe(false)
  })
})

describe('DC-040 — Berechnung', () => {
  function wandmenge(daten: ExtrahierteDaten): number | undefined {
    const { positionen } = malerEngine(daten)
    return positionen.find(p => /wandfl/i.test(p.beschreibung))?.menge
  }

  it('lässt eine genannte Fläche unangetastet, solange nichts beantwortet ist', () => {
    expect(wandmenge(wohnung())).toBe(120)
  })

  it('rechnet ohne Abzug, wenn der Handwerker "schon abgezogen" sagt', () => {
    expect(wandmenge(wohnung({ wandflaeche_brutto: false, tueren: [{ anzahl: 8 }], fenster: [{ anzahl: 6 }] }))).toBe(120)
  })

  it('zieht bei "sind noch drin" nur die großen Öffnungen ab (VOB, PM-021)', () => {
    // 8 Zimmertüren (0,9 × 2,1 = 1,89 m²) und 6 Fenster (1,2 × 1,0 = 1,2 m²)
    // liegen alle unter 2,5 m² → werden übermessen, nicht abgezogen.
    expect(wandmenge(wohnung({ wandflaeche_brutto: true, tueren: [{ anzahl: 8 }], fenster: [{ anzahl: 6 }] }))).toBe(120)
    // Eine Terrassentür 2,0 × 2,2 = 4,4 m² > 2,5 m² → wird abgezogen.
    expect(wandmenge(wohnung({
      wandflaeche_brutto: true,
      tueren: [{ anzahl: 7 }, { anzahl: 1, breite: 2, hoehe: 2.2 }],
      fenster: [{ anzahl: 6 }],
    }))).toBe(115.6)
  })
})
