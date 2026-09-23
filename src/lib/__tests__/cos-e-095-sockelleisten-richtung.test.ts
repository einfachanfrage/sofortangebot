// ── CoS-E-095 · PM-141-A und PM-143-A ──────────────────────────────────────
//
// Der Auftrag des Prüfmeisters, wörtlich: „zwei Antworten auf demselben
// Angebot sind nicht zu verteidigen." Gemeint sind die zwei Bremsen —
// `bauteil-ausschluss.ts` (Wände, Decken, Türen …) und
// `sockelleisten-ausschluss.ts`. Seit CoS-E-091/PM-134/PM-135 hat die erste
// eine RICHTUNG und eine RAUMGRENZE; die zweite hatte beides nicht.
//
// Gemessen VOR dem Bau, am echten Projektstand:
//
//   „Flur, Sockelleisten bleiben wie sie sind. Sockelleisten im Flur neu."
//        → Flur blieb ausgeschlossen          (PM-141-A)
//   „An den Sockelleisten machen wir nichts, Sockelleisten neu."
//        → Ausschluss blieb stehen            (PM-143-A)
//   „An den Wänden machen wir nichts, Wände streichen."   (dieselbe Form!)
//        → kein Ausschluss
//
// Welche der zwei Antworten die richtige ist, hat der Prüfmeister ausdrücklich
// NICHT entschieden. Entschieden wurde sie hier, zugunsten der Bauteil-Bremse:
// **das jüngere Wort gewinnt.** Begründung, damit sie prüfbar ist und nicht
// nur behauptet — diese Richtung ist die einzige der beiden, die gebaut,
// begründet und an Geld gemessen ist (PM-135: ein Komma statt eines Punktes
// kostete 465,90 € GEGEN den Kunden), und sie ist die einzige, die den
// häufigsten Fall im Diktat trifft: der Handwerker überlegt es sich mitten im
// Satz anders.
//
// ⚠ Die Richtung hat zwei Grenzen, und beide sind hier festgenagelt:
//   1. Ein Auftrag VOR dem Ausschluss hebt ihn nicht auf.
//   2. Ein Auftrag in einem ANDEREN Raum hebt ihn nicht auf.
//      Ein GLOBALER Ausschluss behält dafür die alte Satzgrenze — er hat
//      keinen Raum, gegen den sich prüfen ließe.
//
// Was hier NICHT gebaut ist und deshalb auch nicht zugesichert wird: PM-142
// (Ausschluss ohne Raumnamen erbt den zuletzt genannten Raum, statt zu
// fragen). Die Sperrklinke `PM-142-A` in `pruefmeister-batch-139-143.test.ts`
// steht unverändert rot. Sie ist ein eigener Punkt.

import { describe, it, expect } from 'vitest'
import {
  erkenneSockelleistenAusschluss,
  sockelleistenAusgeschlossen,
} from '../sockelleisten-ausschluss'
import { erkenneBauteilAusschluss } from '../bauteil-ausschluss'

const RAEUME = ['Flur', 'Wohnzimmer', 'Küche', 'Esszimmer']

const sockel = (t: string, raeume: string[] = RAEUME) => {
  const a = erkenneSockelleistenAusschluss(t, raeume)
  return { global: a.global, raeume: [...a.raeume].sort() }
}

describe('CoS-E-095 · der spätere Auftrag hebt den Ausschluss auf (PM-141-A)', () => {
  it('über die Satzgrenze hinweg, im selben Raum', () => {
    expect(sockel('Flur, Sockelleisten bleiben wie sie sind. Sockelleisten im Flur neu.'))
      .toEqual({ global: false, raeume: [] })
  })

  it('auch bei Whisper-Hörfehler im Auftragssatz („Zockelleisten")', () => {
    // PM-034: der stimmhafte Anlaut wird regelmäßig verhört. Wäre die
    // Auftragsprüfung auf der exakten Schreibweise gebaut, liefe sie still
    // vorbei — und der Ausschluss bliebe stehen.
    expect(sockel('Flur, Sockelleisten bleiben wie sie sind. Zockelleisten im Flur neu.'))
      .toEqual({ global: false, raeume: [] })
  })

  it('auch beim Synonym („Fußleisten … montieren")', () => {
    expect(sockel('Flur, Sockelleisten bleiben wie sie sind. Fußleisten im Flur montieren.'))
      .toEqual({ global: false, raeume: [] })
  })

  it('die Kurzform antwortet mit: der Raum ist nicht mehr ausgeschlossen', () => {
    const text = 'Flur, Sockelleisten bleiben wie sie sind. Sockelleisten im Flur neu.'
    expect(sockelleistenAusgeschlossen(text, 'Flur', RAEUME)).toBe(false)
    expect(sockelleistenAusgeschlossen('Flur, Sockelleisten bleiben wie sie sind.', 'Flur', RAEUME))
      .toBe(true)
  })

  it('kein Beleg bleibt liegen: ein aufgehobener Ausschluss begründet nichts mehr', () => {
    // Sonst stünde auf dem Angebot eine Hinweiszeile „Sockelleisten bleiben
    // wie sie sind" über einer Position, die gerade berechnet wurde.
    const a = erkenneSockelleistenAusschluss(
      'Flur, Sockelleisten bleiben wie sie sind. Sockelleisten im Flur neu.', RAEUME)
    expect(a.belege).toEqual([])
  })
})

describe('CoS-E-095 · die Richtung: nur nach vorn (PM-143-A)', () => {
  it('Auftrag HINTER dem Ausschluss, im selben Satz — hebt auf', () => {
    expect(sockel('Wohnzimmer. An den Sockelleisten machen wir nichts, Sockelleisten neu.'))
      .toEqual({ global: false, raeume: [] })
  })

  it('Auftrag VOR dem Ausschluss, im selben Satz — hebt NICHT auf', () => {
    // Das ist die teuerste Zeile dieser Datei. Fiele sie, liefe das Geld
    // gegen den Kunden: er bestellt am Satzende ab, und die Maschine
    // rechnet trotzdem, weil vorne einmal „neu" stand.
    expect(sockel('Wohnzimmer. Sockelleisten neu, an den Sockelleisten machen wir nichts.'))
      .toEqual({ global: false, raeume: ['Wohnzimmer'] })
  })

  it('Auftrag VOR dem Ausschluss, ein Satz früher — hebt NICHT auf', () => {
    expect(sockel('Flur, Sockelleisten im Flur neu. Sockelleisten bleiben wie sie sind.'))
      .toEqual({ global: false, raeume: ['Flur'] })
  })

  it('ein VERNEINTER späterer Auftrag zählt nicht als Auftrag', () => {
    expect(sockel('Flur, Sockelleisten bleiben wie sie sind. Sockelleisten nicht neu machen.'))
      .toEqual({ global: false, raeume: ['Flur'] })
  })

  it('beide Bremsen antworten auf denselben Satzbau jetzt gleich', () => {
    const wand = [...(erkenneBauteilAusschluss(
      'Wohnzimmer. An den Wänden machen wir nichts, Wände streichen.', ['Wohnzimmer'],
    ).jeRaum.get('Wohnzimmer') ?? [])]
    expect(wand).toEqual([])
    expect(sockel('Wohnzimmer. An den Sockelleisten machen wir nichts, Sockelleisten neu.').raeume)
      .toEqual(wand)
  })
})

describe('CoS-E-095 · die Raumgrenze (sie ersetzt die Satzgrenze, nicht ersatzlos)', () => {
  it('ein Auftrag im anderen Raum hebt den Ausschluss NICHT auf', () => {
    expect(sockel('Flur, Sockelleisten bleiben wie sie sind. Sockelleisten im Wohnzimmer neu.'))
      .toEqual({ global: false, raeume: ['Flur'] })
  })

  it('Aufzählung: der später bestellte Raum fällt heraus, der andere bleibt', () => {
    // „Zockelleisten bleiben in Küche und Esszimmer, wie sie sind.
    //  Sockelleisten in der Küche neu."  →  nur das Esszimmer bleibt.
    expect(sockel('Zockelleisten bleiben in Küche und Esszimmer, wie sie sind. '
      + 'Sockelleisten in der Küche neu.'))
      .toEqual({ global: false, raeume: ['Esszimmer'] })
  })

  it('Zimmer-Gruppe (PM-035): dasselbe, je Zimmer einzeln', () => {
    expect(sockel(
      'Sockelleisten nur im Flur neu. In den Zimmern bleiben die alten. '
      + 'Im Wohnzimmer Sockelleisten neu.',
      ['Flur', 'Wohnzimmer', 'Esszimmer'],
    )).toEqual({ global: false, raeume: ['Esszimmer'] })
  })
})

describe('CoS-E-095 · der globale Ausschluss behält die Satzgrenze', () => {
  it('ein Auftrag im NÄCHSTEN Satz hebt ihn nicht auf', () => {
    // Bewusst so, wortgleich zur Begründung in `bauteil-ausschluss.ts`:
    // Der globale Ausschluss hat keinen Raum, gegen den sich prüfen ließe.
    // Ein Auftrag für EINEN Raum würde ihn sonst für ALLE aufheben — aus
    // einer Bremse, die zu viel nimmt, würde eine, die zu wenig nimmt.
    // Das richtige Mittel wäre ein Teil-Aufheben; es ist nicht gemessen.
    expect(sockel('Sockelleisten bleiben überall, wie sie sind. Sockelleisten im Flur neu.'))
      .toEqual({ global: true, raeume: [] })
  })

  it('im SELBEN Satz dahinter hebt er dagegen auf', () => {
    expect(sockel('Sockelleisten bleiben überall wie sie sind, Sockelleisten neu.'))
      .toEqual({ global: false, raeume: [] })
  })
})

describe('CoS-E-095 · die Schutzfälle von PM-033 bis PM-035 stehen unverändert', () => {
  it('PM-033 · „bleiben überall, wie sie sind" ist weiter global', () => {
    expect(sockel('Sockelleisten bleiben überall, wie sie sind.'))
      .toEqual({ global: true, raeume: [] })
  })

  it('PM-034 · die Aufzählung trifft weiter beide Räume', () => {
    expect(sockel('Zockelleisten in Küche und Esszimmer neu. Im Wohnzimmer bleiben sie.'))
      .toEqual({ global: false, raeume: ['Wohnzimmer'] })
  })

  it('PM-035 · „in den Zimmern bleiben die alten" trifft weiter nicht den Flur', () => {
    expect(sockel('Sockelleisten nur im Flur neu. In den Zimmern bleiben die alten.',
      ['Flur', 'Wohnzimmer', 'Esszimmer']))
      .toEqual({ global: false, raeume: ['Esszimmer', 'Wohnzimmer'] })
  })

  it('PM-141-C · der spätere Ausschluss gewinnt weiter gegen den früheren Auftrag', () => {
    expect(sockel('Flur, Sockelleisten im Flur neu. Sockelleisten bleiben wie sie sind.'))
      .toEqual({ global: false, raeume: ['Flur'] })
  })
})
