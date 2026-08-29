// DC-035 Teil 2: Eine einzelne, abweichend große Öffnung (Terrassentür,
// Panoramafenster) darf in der Türen-/Fenster-Rückfrage mitgegeben werden.
// Getestet wird der DATENWEG — Fragen-Typ → Antwort → Öffnungsliste →
// VOB-Abzug. Die Eingabe-Oberfläche dazu baut der Product Designer (Teil 1
// der DC-035-Spezifikation).
import { describe, expect, it } from 'vitest'
import { bereiteRueckfragenVor } from '../rueckfragen-flow'
import { verarbeiteAntworten } from '../antworten-verarbeiter'
import { berechneOeffnungsabzugVob } from '../gewerke/vob-uebermessung'
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

function wohnzimmer(): ExtrahierteDaten {
  return basis({
    raeume: [{
      name: 'Wohnzimmer', laenge: 6, breite: 4, hoehe: 2.6, flaeche: 24,
      fenster: [], tueren: [], arbeiten: ['waende_streichen'],
      altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
    }],
  })
}

describe('DC-035 — abweichend große Einzelöffnung', () => {
  it('bietet die Ausnahme-Maße nur bei Türen-/Fenster-Stückzahlfragen an', () => {
    const analyse = bereiteRueckfragenVor(wohnzimmer())
    const tueren = analyse.rueckfragen.find(f => f.id === 'tueren_anzahl_wohnzimmer')
    const fenster = analyse.rueckfragen.find(f => f.id === 'fenster_anzahl_wohnzimmer')

    expect(tueren?.ausnahme_masse).toEqual({
      label: 'Eine davon abweichend groß? (z. B. Terrassentür)',
      standard_breite: 0.9,
      standard_hoehe: 2.1,
    })
    expect(fenster?.ausnahme_masse?.standard_breite).toBe(1.2)
    expect(fenster?.ausnahme_masse?.standard_hoehe).toBe(1.0)

    for (const frage of analyse.rueckfragen) {
      if (!/^(tueren|fenster)_anzahl_/.test(frage.id)) {
        expect(frage.ausnahme_masse).toBeUndefined()
      }
    }
  })

  it('bleibt ohne Ausnahme exakt beim bisherigen Verhalten', () => {
    const beantwortet = verarbeiteAntworten(wohnzimmer(), {
      tueren_anzahl_wohnzimmer: { wert: 3, einheit: 'Stück' },
    })
    expect(beantwortet.raeume[0].tueren).toEqual([{ anzahl: 3 }])
  })

  it('teilt drei Türen in zwei Standard-Türen plus eine Terrassentür', () => {
    const beantwortet = verarbeiteAntworten(wohnzimmer(), {
      tueren_anzahl_wohnzimmer: { wert: 3, einheit: 'Stück', ausnahme: { breite: 2, hoehe: 2.2 } },
    })
    expect(beantwortet.raeume[0].tueren).toEqual([
      { anzahl: 2 },
      { anzahl: 1, breite: 2, hoehe: 2.2 },
    ])
  })

  it('erzeugt bei genau einer Öffnung keinen leeren Rest-Eintrag', () => {
    const beantwortet = verarbeiteAntworten(wohnzimmer(), {
      fenster_anzahl_wohnzimmer: { wert: 1, einheit: 'Stück', ausnahme: { breite: 3, hoehe: 2.4 } },
    })
    expect(beantwortet.raeume[0].fenster).toEqual([{ anzahl: 1, breite: 3, hoehe: 2.4 }])
  })

  it('ignoriert unvollständige oder unsinnige Ausnahme-Maße', () => {
    const ohneHoehe = verarbeiteAntworten(wohnzimmer(), {
      tueren_anzahl_wohnzimmer: { wert: 2, einheit: 'Stück', ausnahme: { breite: 2, hoehe: 0 } },
    })
    expect(ohneHoehe.raeume[0].tueren).toEqual([{ anzahl: 2 }])

    const nullAntwort = verarbeiteAntworten(wohnzimmer(), {
      tueren_anzahl_wohnzimmer: { wert: 0, einheit: 'Stück', ausnahme: { breite: 2, hoehe: 2.2 } },
    })
    expect(nullAntwort.raeume[0].tueren).toEqual([{ anzahl: 0 }])
  })

  it('zieht nur die große Ausnahme ab und übermisst die Standard-Türen (VOB/DIN 18363)', () => {
    const beantwortet = verarbeiteAntworten(wohnzimmer(), {
      tueren_anzahl_wohnzimmer: { wert: 3, einheit: 'Stück', ausnahme: { breite: 2, hoehe: 2.2 } },
    })
    const abzug = berechneOeffnungsabzugVob(beantwortet.raeume[0].tueren, 0.9, 2.1)

    // 2 × (0,9 × 2,1) = 3,78 m² Einzelgröße 1,89 m² ≤ 2,5 m² → übermessen
    expect(abzug.uebermessenAnzahl).toBe(2)
    // 1 × (2,0 × 2,2) = 4,4 m² > 2,5 m² → wird abgezogen
    expect(abzug.abzugFlaeche).toBe(4.4)
  })
})
