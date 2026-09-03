// PM-032 / PM-033 / PM-035 — Trittschalldämmung je Raum
// (Prüfmeister, eingesprochen 02.09.2026)
//
// Derselbe Fund aus drei Richtungen: `pruefeTrittschalldaemmung()` nahm die
// ERSTE Verlegeposition und baute daraus EINE Dämmung.
//   PM-032: ein Belag über drei Räume → 28,40 m² fehlten (127,80 €, zulasten
//           des Betriebs). Der Fall galt als bestanden, weil die erste
//           Position zufällig die richtige war.
//   PM-033: „Trittschall nur unterm Laminat im Flur" → landete im Wohnzimmer.
//   PM-035: dritter Beleg.
import { describe, it, expect } from 'vitest'
import { pruefeTrittschalldaemmung, raumAusDaemmungsSatz } from '../boden-sonder'
import type { BerechnetePosition } from '../../mengen/types'

const verlegen = (raum: string, menge: number, belag = 'Klick-Vinyl', prozent = 5): BerechnetePosition => ({
  beschreibung: `${belag} verlegen inkl. ${prozent} % Verschnitt — ${raum}`,
  menge, einheit: 'm²', konfidenz: 'high', annahmen: [],
  berechnungsweg: `${Math.round((menge / (1 + prozent / 100)) * 100) / 100} m² + ${prozent} % Verschnitt`,
} as BerechnetePosition)

function daemmungen(positionen: BerechnetePosition[], text: string) {
  const ergaenzt = [...positionen]
  const fehlende: string[] = []
  pruefeTrittschalldaemmung(ergaenzt, fehlende, text.toLowerCase())
  return ergaenzt.filter(p => /trittschall/i.test(p.beschreibung))
}

describe('PM-032 — ein Belag über drei Räume', () => {
  const positionen = [verlegen('Flur', 7.56), verlegen('Wohnzimmer', 21), verlegen('Küche', 8.82)]
  const text = 'Überall dasselbe Klick-Vinyl, durchgehend ohne Schwellen. Trittschalldämmung drunter.'

  it('liegt unter ALLEN drei Räumen, nicht nur unter dem ersten', () => {
    const d = daemmungen(positionen, text)
    expect(d).toHaveLength(3)
    expect(d.map(p => p.beschreibung.split('—')[1]?.trim())).toEqual(['Flur', 'Wohnzimmer', 'Küche'])
  })

  it('ergibt in Summe 35,60 m² — Raumfläche OHNE Verschnitt', () => {
    // Soll des Prüfmeisters ausdrücklich: 35,60 und nicht 37,38 — die Dämmung
    // wird stumpf gestoßen, da ist kein Verschnitt drin.
    const summe = daemmungen(positionen, text).reduce((s, p) => s + p.menge, 0)
    expect(Math.round(summe * 100) / 100).toBe(35.6)
  })

  it('trägt kein Vorschlag-Etikett, wenn der Handwerker sie selbst genannt hat', () => {
    for (const p of daemmungen(positionen, text)) {
      expect((p as { automatisch_ergaenzt?: boolean }).automatisch_ergaenzt).toBe(false)
    }
  })
})

describe('PM-033 — „nur unterm Laminat im Flur"', () => {
  const positionen = [
    verlegen('Wohnzimmer', 31.05, 'Fischgrät-Parkett', 15),
    verlegen('Schlafzimmer', 14.4, 'Teppichboden', 0),
    verlegen('Flur', 7.88, 'Laminat', 5),
  ]
  // Der Prüfmeister protokolliert seinen Satz als „Trittschall nur unterm
  // Laminat im Flur". Ausgelöst wird die Position aber nur vom vollen Wort
  // „Trittschalldämmung" — sein Diktat muss es also enthalten haben, sonst
  // wäre gar keine Dämmung entstanden. Hier steht deshalb die auslösende
  // Fassung. Ob die Kurzform ebenfalls auslösen SOLL, ist eine offene Frage
  // an ihn: „ohne Trittschall" würde dann nämlich auch auslösen, und eine
  // Verneinung wertet die Prüfung heute nicht aus.
  const text = 'Wohnzimmer Fischgrät-Parkett, Schlafzimmer Teppich, Flur Laminat. Trittschalldämmung nur unterm Laminat im Flur.'

  it('landet im Flur — und nur dort', () => {
    const d = daemmungen(positionen, text)
    expect(d).toHaveLength(1)
    expect(d[0].beschreibung).toContain('Flur')
  })

  it('nicht im Wohnzimmer, obwohl das die erste Position ist', () => {
    // Genau der gemeldete Fehler: 121,50 € für eine Leistung, die niemand
    // verlangt hat.
    expect(daemmungen(positionen, text).some(p => p.beschreibung.includes('Wohnzimmer'))).toBe(false)
  })

  it('trifft die Flurfläche ohne Verschnitt (7,50 m²)', () => {
    expect(daemmungen(positionen, text)[0].menge).toBeCloseTo(7.5, 1)
  })
})

describe('Teppich bekommt keine Trittschalldämmung', () => {
  it('auch nicht, wenn kein Raum genannt ist', () => {
    const positionen = [verlegen('Schlafzimmer', 14.4, 'Teppichboden', 0), verlegen('Flur', 7.88, 'Laminat', 5)]
    const d = daemmungen(positionen, 'Teppich und Laminat, Trittschalldämmung drunter.')
    expect(d.map(p => p.beschreibung.split('—')[1]?.trim())).toEqual(['Flur'])
  })
})

describe('raumAusDaemmungsSatz', () => {
  const positionen = [verlegen('Wohnzimmer', 21), verlegen('Flur', 7.56)]

  it('liest den Raum aus dem Satz, in dem die Dämmung steht', () => {
    expect(raumAusDaemmungsSatz('trittschall nur unterm laminat im flur', positionen)).toBe('Flur')
  })

  it('lässt sich nicht von einem Raum aus einem ANDEREN Satz ablenken', () => {
    // Der eigentliche Kern: satzweise statt über das ganze Transkript.
    const text = 'im wohnzimmer kommt fischgrät. trittschall nur im flur. sockelleisten bleiben.'
    expect(raumAusDaemmungsSatz(text, positionen)).toBe('Flur')
  })

  it('gibt null zurück, wenn kein Raum genannt ist — dann gilt: alle Räume', () => {
    expect(raumAusDaemmungsSatz('trittschalldämmung drunter', positionen)).toBeNull()
  })
})
