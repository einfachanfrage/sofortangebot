import { describe, expect, it } from 'vitest'
import { bereiteRueckfragenVor } from '../rueckfragen-flow'
import type { ExtrahierteDaten } from '../types'

// Systemischer Fund Punkt 6 / PM-019 + PM-020, Sandys Ansage vom 2026-08-25:
// „die maße müssen natürlich stimmen!!!"
//
// Whisper verschluckt beim Muster „[Zahlwort] mal [Zahl]" die erste Maßangabe.
// Beide Fixtures unten sind die ECHTEN Transkripte und die echten
// GPT-Extraktionen aus der Produktions-DB — nicht nachgebaut.

function extraktion(raum: Record<string, unknown>, transkript: string, gewerk = 'maler'): ExtrahierteDaten {
  return {
    gewerk, confidence_gewerk: 1,
    kunde: { name: null, adresse: null, ort: null },
    raeume: [raum], waende: [], decken: [], bereiche: [],
    steckdosen: null, schalter: null, spots: null, aussenlampen: null, wandlampen: null,
    herdanschluss: false, wallbox: false, unterverteilung: false, hauptverteilung: false,
    kabelmeter: null, neu_verkabeln: false,
    wc: null, waschtisch: null, dusche: null, wanne: null, urinal: null, bidet: null,
    armaturen: null, rohrmeter: null, leitungen_erneuern: false, heizkoerper: null,
    austausch: false, erneuerung: false, altbelag: [], erschwernisse: [],
    anmerkungen: null, fehlende_angaben: [], transkript,
  } as unknown as ExtrahierteDaten
}

const basisRaum = {
  vage: false, tueren: [], umfang: null, fenster: [], flaeche: null,
  nassbereich: false, sockelleisten: false, altbelag_entfernen: false,
  wandflaeche_direkt: null, deckflaeche_direkt: null, kniestockhoehe: null,
}

describe('Punkt 6 – Verdacht auf verschluckte Maßangabe', () => {
  it('fragt beim Gästeklo nach (PM-019: „zweimal 1,50" → 1,50 × 1,50)', () => {
    const raum = { ...basisRaum, name: 'Gästeklo', laenge: 1.5, breite: 1.5, hoehe: 2.4, arbeiten: ['wände streichen'] }
    const transkript = 'Gästeklo zweimal 1,50, Höhe 2,40, Wände streichen zweimal, der Putz ist aber total uneben und bröckelig, eine Tür, kein Fenster.'
    const { rueckfragen } = bereiteRueckfragenVor(extraktion(raum, transkript), {}, transkript)
    const frage = rueckfragen.find(f => f.id === 'masse_gästeklo')
    expect(frage, `keine Maß-Rückfrage — hat: ${rueckfragen.map(f => f.id).join(', ')}`).toBeDefined()
    // Die Frage nennt beide Lesarten, damit niemand raten muss.
    expect(frage!.frage).toContain('1,50 × 1,50')
    expect(frage!.frage).toContain('zweimal 1,50')
    expect(frage!.frage).toContain('2,00 × 1,50')
  })

  it('fragt beim Kinderzimmer nach (PM-020: „dreimal 360" → 3,60 × 3,60)', () => {
    const raum = { ...basisRaum, name: 'Kinderzimmer', laenge: 3.6, breite: 3.6, hoehe: 2.6, arbeiten: ['teppich verlegen'], belag: 'teppich' }
    const transkript = 'Kinderzimmer, dreimal 360, Teppichboden auslegen, ganz normal, kein Muster, die alten Dielen bleiben einfach drunter liegen.'
    const { rueckfragen } = bereiteRueckfragenVor(extraktion(raum, transkript, 'boden_parkett'), {}, transkript)
    const frage = rueckfragen.find(f => f.id === 'masse_kinderzimmer')
    expect(frage, `keine Maß-Rückfrage — hat: ${rueckfragen.map(f => f.id).join(', ')}`).toBeDefined()
    expect(frage!.frage).toContain('3,00 × 3,60')
  })

  it('lässt einen echt quadratischen Raum in Ruhe', () => {
    // „vier mal vier" — sauber gesprochen, kein zusammengeschriebenes Zahlwort
    // vor einer Ziffer. Hier darf keine Frage kommen.
    const raum = { ...basisRaum, name: 'Lager', laenge: 4, breite: 4, hoehe: 2.5, arbeiten: ['wände streichen'] }
    const transkript = 'Lager, vier mal vier Meter, Höhe 2,50, Wände streichen.'
    const { rueckfragen } = bereiteRueckfragenVor(extraktion(raum, transkript), {}, transkript)
    expect(rueckfragen.map(f => f.id)).not.toContain('masse_lager')
  })

  it('verwechselt „zweimal streichen" nicht mit einer Maßangabe', () => {
    // Der häufigste Satz überhaupt — nach „zweimal" folgt keine Ziffer.
    const raum = { ...basisRaum, name: 'Büro', laenge: 3, breite: 3, hoehe: 2.5, arbeiten: ['wände streichen'] }
    const transkript = 'Büro, 3 mal 3 Meter, Höhe 2,50, Wände streichen zweimal.'
    const { rueckfragen } = bereiteRueckfragenVor(extraktion(raum, transkript), {}, transkript)
    expect(rueckfragen.map(f => f.id)).not.toContain('masse_büro')
  })

  it('lässt einen rechteckigen Raum in Ruhe, auch wenn das Muster im Text steht', () => {
    const raum = { ...basisRaum, name: 'Flur', laenge: 5, breite: 1.8, hoehe: 2.6, arbeiten: ['wände streichen'] }
    const transkript = 'Flur 5 x 1,80, Höhe 2,60, Wände streichen zweimal 1,50 Meter hoch abkleben.'
    const { rueckfragen } = bereiteRueckfragenVor(extraktion(raum, transkript), {}, transkript)
    expect(rueckfragen.map(f => f.id)).not.toContain('masse_flur')
  })
})
