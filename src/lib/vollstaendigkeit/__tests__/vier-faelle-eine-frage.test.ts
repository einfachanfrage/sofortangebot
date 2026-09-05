import { describe, it, expect } from 'vitest'
import { pruefeTrittschalldaemmung, raeumeAusDaemmungsSatz } from '../boden-sonder'
import type { BerechnetePosition } from '../../mengen/types'

// ── Sandys Vier-Fälle-Tabelle (05.09.2026) ────────────────────────────────
//
//   PM-033  „Trittschall nur im Flur"        landet im ersten Raum
//   PM-034  „in Küche und Esszimmer neu"     fällt ganz aus
//   PM-035  „überall drunter"                landet im letzten Raum
//   PM-036  „im Wohnzimmer bleiben sie"      entsteht trotzdem
//
// Vier Symptome, EINE Frage: welche Räume meint dieser Satz? Sie wurde im
// Code zweimal beantwortet — in satz-raum.ts und, privat und schlechter, in
// dieser Datei. Diese Tests halten die zweite Antwort auf der ersten fest.

const pos = (beschreibung: string, menge: number): BerechnetePosition => ({
  beschreibung, menge, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${menge} m²`, annahmen: [],
})

const DREI = [
  pos('Fertigparkett verlegen — Wohnzimmer', 27),
  pos('Teppichboden verlegen — Schlafzimmer', 14.4),
  pos('Laminat verlegen — Flur', 7.5),
]

describe('welche Räume meint der Dämmungs-Satz?', () => {
  it('PM-033: der Raum steht im letzten von drei Teilsätzen — nicht der erste gewinnt', () => {
    const text = 'an den beiden türen zum wohnzimmer und zum schlafzimmer jeweils eine '
      + 'übergangsschiene, weil ja unterschiedliche beläge, trittschall nur unterm laminat im flur, '
      + 'sockelleisten bleiben überall wie sie sind'
    expect(raeumeAusDaemmungsSatz(text, DREI)).toEqual(['Flur'])
  })

  it('PM-035: „überall drunter" meint alle — auch wenn davor ein Raum stand', () => {
    const text = 'sockelleisten nur im flur neu. trittschalldämmung überall drunter'
    expect(raeumeAusDaemmungsSatz(text, DREI)).toBeNull()
  })

  it('PM-034-Muster: eine Aufzählung meint BEIDE Räume, nicht den letzten', () => {
    const text = 'trittschalldämmung in wohnzimmer und flur drunter'
    expect(raeumeAusDaemmungsSatz(text, DREI)).toEqual(['Wohnzimmer', 'Flur'])
  })

  it('PM-023: der Raum aus einem früheren Teilsatz DESSELBEN Satzes zählt', () => {
    const text = 'flur, 4 mal 3.5, laminat, trittschalldämmung drunter'
    expect(raeumeAusDaemmungsSatz(text, DREI)).toEqual(['Flur'])
  })

  it('PM-032: über die Satzgrenze hinweg zählt er NICHT — eigener Satz heißt alle', () => {
    const text = 'das läuft von der küche durch den flur ins wohnzimmer. trittschalldämmung drunter'
    expect(raeumeAusDaemmungsSatz(text, DREI)).toBeNull()
  })

  it('kein Dämmungs-Wort im Text: kein Raum', () => {
    expect(raeumeAusDaemmungsSatz('sockelleisten im flur neu', DREI)).toBeNull()
  })
})

describe('PM-033: die Kurzform „Trittschall" ist dasselbe Gewerk', () => {
  it('erzeugt die Dämmung — vorher fiel sie komplett aus', () => {
    const ergaenzt = [...DREI]
    const fehlende: string[] = []
    pruefeTrittschalldaemmung(ergaenzt, fehlende, 'trittschall nur unterm laminat im flur')
    const daemmung = ergaenzt.filter(p => /trittschall/i.test(p.beschreibung))
    expect(daemmung).toHaveLength(1)
    expect(daemmung[0].beschreibung).toBe('Trittschalldämmung — Flur')
    expect(daemmung[0].menge).toBe(7.5)
  })

  it('landet NICHT im Wohnzimmer und nicht unterm Teppich', () => {
    const ergaenzt = [...DREI]
    pruefeTrittschalldaemmung(ergaenzt, [], 'trittschall nur unterm laminat im flur')
    const namen = ergaenzt.filter(p => /trittschall/i.test(p.beschreibung)).map(p => p.beschreibung)
    expect(namen.some(n => /Wohnzimmer|Schlafzimmer/.test(n))).toBe(false)
  })

  it('die Kurzform gilt als ausdrücklich gesagt, nicht als Vorschlag', () => {
    const ergaenzt = [...DREI]
    pruefeTrittschalldaemmung(ergaenzt, [], 'trittschall nur unterm laminat im flur')
    const d = ergaenzt.find(p => /trittschall/i.test(p.beschreibung))
    expect(d?.automatisch_ergaenzt).toBe(false)
  })
})

// ── Die vierte Stelle: das Chip-Sicherheitsnetz ──────────────────────────
// Sie hat den PM-033-Live-Fund erzeugt — nicht die Vollständigkeitsprüfung.
import { ergaenzeAusAufnahmeHinweisen } from '../../mengen/aufnahme-hinweise'

describe('aufnahme-hinweise: das Netz rät nicht mehr selbst', () => {
  const PM033 = 'wohnzimmer, 6 x 4,50, eichenparkett, fischgrät verlegt. schlafzimmer, 4 x 3,60, teppich. '
    + 'flur, 5 x 1,50, laminat. trittschall nur unterm laminat im flur.'

  it('legt die Dämmung in den GENANNTEN Raum, nicht in den ersten', () => {
    const p = ergaenzeAusAufnahmeHinweisen([...DREI], ['Trittschalldämmung'], PM033)
    const d = p.filter(x => /trittschall/i.test(x.beschreibung))
    expect(d.map(x => x.beschreibung)).toEqual(['Trittschalldämmung — Flur'])
    expect(d[0].menge).toBe(7.5)
  })

  it('erfindet bei mehreren Räumen ohne Beleg im Diktat gar nichts', () => {
    const p = ergaenzeAusAufnahmeHinweisen([...DREI], ['Trittschalldämmung'], 'drei räume, boden neu')
    expect(p.some(x => /trittschall/i.test(x.beschreibung))).toBe(false)
  })

  it('das Netz greift weiter, wenn es nur EINEN verlegten Boden gibt', () => {
    const einer = [pos('Klick-Vinyl verlegen — Wohnzimmer', 21)]
    const p = ergaenzeAusAufnahmeHinweisen(einer, ['Trittschalldämmung'], 'wohnzimmer boden neu')
    expect(p.some(x => /trittschall/i.test(x.beschreibung))).toBe(true)
  })
})
