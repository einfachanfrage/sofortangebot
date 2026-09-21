// PM-144 · Der Wortlaut der Bemessungsgrundlage, wenn ZWEI Filter greifen
//
// ── Die Frage ─────────────────────────────────────────────────────────────
//
// Engineering, 21.09.2026, 16:50 UTC: Seit CoS-E-083 §3 rechnen die fünf
// Erschwerniszuschläge nur noch auf die Leistungen des betroffenen Gewerks.
// Trägt ein Zuschlag zusätzlich einen Raum im Titel, stehen zwei Filter
// hintereinander — erst der Raum, dann das Gewerk. Die Zahl stimmt, die
// Beschriftung nicht mehr:
//
//   Erschwerniszuschlag Raumhöhe > 3m — Wohnzimmer
//     → 15 % auf 863,99 € (Leistungen Wohnzimmer)
//
// Die 863,99 € sind die MALERleistungen im Wohnzimmer; die Fliesenarbeit
// dort ist bewusst draußen. „(Leistungen Wohnzimmer)" sagt das nicht.
//
// ── Die Entscheidung (Prüfmeister, 21.09.2026, abends) ────────────────────
//
// Wenn beide Filter greifen, steht BEIDES da, getrennt durch denselben
// Gedankenstrich, den der Kunde von jeder Positionszeile kennt:
//
//   (Leistungen Maler — Wohnzimmer)
//
// Drei Fassungen standen zur Wahl, zwei fallen aus:
//
//  * `(Leistungen Maler, Wohnzimmer)` — Engineerings Vorschlag. Das Komma
//    liest sich als AUFZÄHLUNG zweier Dinge („Maler und Wohnzimmer"), es
//    sind aber zwei Filter hintereinander. Genau die Ungenauigkeit, die wir
//    gerade abstellen.
//  * `(Leistungen Maler im Wohnzimmer)` — die Präposition bräuchte das
//    grammatische Geschlecht des Raumnamens. „im Bad" ✓, „im Flur" ✓,
//    „im Küche" ✗. Ein Wortlaut, der bei „Küche" kaputtgeht, ist keiner.
//    Das ganze Papier kommt bisher ohne Präposition vor Raumnamen aus, und
//    das ist der Grund.
//  * `(Leistungen Maler — Wohnzimmer)` — der Gedankenstrich ist auf diesem
//    Blatt bereits der Trenner zwischen Arbeit und Raum: „Wand streichen 2x
//    — Wohnzimmer". Der Kunde hat ihn oben auf derselben Seite gelernt.
//    Kein neues Zeichen, kein Geschlecht, keine Aufzählung.
//
// Die zwei Fassungen mit nur EINEM Filter bleiben, wie sie sind — sie waren
// nie falsch. Geändert wird ausschließlich der Fall, in dem beide greifen.
//
// Die Stelle ist `zuschlagBerechnungsweg()` in `src/lib/zuschlag-basis.ts`,
// es ist eine Zeile. Sie liegt gerade in Engineerings Arbeitsbaum
// (CoS-E-092) — deshalb steht die Entscheidung hier als Zusicherung und
// nicht als fremde Hand in seiner Datei.
import { describe, expect, it } from 'vitest'
import { zuschlagBerechnungsweg, zuschlagsBezugAus } from '../zuschlag-basis'

describe('PM-144 · Bemessungsgrundlage mit Raum UND Gewerk', () => {
  it('PM-144 · gemessener Stand: der Raum verdrängt das Gewerk', () => {
    // Gemessen am 21.09.2026, abends. Der Raum gewinnt, das Gewerk fällt
    // aus der Beschriftung — obwohl beide gerechnet wurden.
    expect(zuschlagBerechnungsweg(15, 863.99, 'Wohnzimmer', 'maler'))
      .toBe('15 % auf 863,99 € (Leistungen Wohnzimmer)')
  })

  it('PM-144-1 · die zwei Fassungen mit einem Filter sind richtig und bleiben', () => {
    expect(zuschlagBerechnungsweg(15, 863.99, null, 'maler'))
      .toBe('15 % auf 863,99 € (Leistungen Maler)')
    expect(zuschlagBerechnungsweg(15, 863.99, 'Wohnzimmer', null))
      .toBe('15 % auf 863,99 € (Leistungen Wohnzimmer)')
    expect(zuschlagBerechnungsweg(15, 863.99, null, null))
      .toBe('15 % auf 863,99 € (Leistungen dieses Angebots)')
  })

  it('PM-144-2 · der Gedankenstrich ist auf diesem Blatt schon der Trenner Arbeit—Raum', () => {
    // Keine neue Erfindung: so heißt jede raumbezogene Position auf dem
    // Kundenpapier. Der Wortlaut der Grundlage borgt sich dieses Zeichen.
    expect('Wand streichen 2x — Wohnzimmer').toContain(' — ')
  })

  it.fails('PM-144-A · SOLL: greifen beide Filter, steht auch beides da', () => {
    // Sperrklinke. Eine Zeile in `zuschlagBerechnungsweg()`: der Zweig für
    // `raum` nimmt das Gewerk mit, wenn es gesetzt ist.
    expect(zuschlagBerechnungsweg(15, 863.99, 'Wohnzimmer', 'maler'))
      .toBe('15 % auf 863,99 € (Leistungen Maler — Wohnzimmer)')
  })

  it.fails('PM-144-B · SOLL: und der Raumname bleibt dabei unangetastet', () => {
    // Gegenprobe zum Geschlechter-Argument oben: „Küche" darf nicht zu
    // „in der Küche" oder „im Küche" werden — der Name steht, wie er steht.
    expect(zuschlagBerechnungsweg(20, 2301.14, 'Küche', 'fliesen'))
      .toBe('20 % auf 2.301,14 € (Leistungen Fliesen — Küche)')
  })

  it('PM-144-3 · und der Leser für das abgeschaltete Rechenweg-Blatt trägt ihn mit', () => {
    // DC-137: Bei abgeschaltetem Rechenweg bleibt genau diese Klammer
    // stehen. Das Muster in `zuschlagsBezugAus()` nimmt beliebigen Text in
    // der Klammer — der Gedankenstrich braucht dort also KEINE Änderung.
    expect(zuschlagsBezugAus('15 % auf 863,99 € (Leistungen Maler — Wohnzimmer)'))
      .toBe('15 % auf 863,99 € (Leistungen Maler — Wohnzimmer)')
  })
})
