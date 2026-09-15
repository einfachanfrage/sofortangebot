// CoS-E-059 / PM-045-C, Eingriff 2 — eine Vorarbeit bleibt bei ihrem Bauteil.
//
// Der Fund des Prüfmeisters, wörtlich gemessen:
//
//   „Im Flur die vier Innentüren lackieren, die sind alt, die müssen vorher
//    angeschliffen und grundiert werden. Im Wohnzimmer die zwei Fenster von
//    innen streichen."
//
// Daraus entstanden zusätzlich `Fenster abschleifen` (20,00 €) und
// `Fenster grundieren` (25,00 €) — beide mit Preis, beide nie gesagt. Die
// Ursache war nicht die Stückzahl (das war PM-045-A), sondern die
// REICHWEITE: Die Regeln in `maler-lackieren.ts` lesen `lower`, also das
// ganze Transkript, und ein Wort aus dem Türen-Satz löst damit eine
// bepreiste Zeile am Fenster aus.
//
// Zugesichert wird die Staffelung aus `vorarbeitGiltFuer` — in dieser
// Reihenfolge, weil nur sie garantiert, dass der Eingriff nirgends eine
// Zeile wegnimmt, wo heute zu Recht eine steht:
//
//   1. Vorarbeit im Diktat gar nicht genannt  → unverändert (fachlicher
//      Standard bleibt, kein Geld verloren)
//   2. im Satz MIT diesem Bauteil genannt     → gilt
//   3. nur im Satz eines ANDEREN Bauteils     → gilt hier nicht  ← der Fund
//   4. in einem Satz ohne jedes Bauteil       → allgemeine Ansage, gilt
//
// Punkt 1 ist ausdrücklich KEINE Aussage darüber, ob eine ungenannte
// Vorarbeit auf dem Kundenpapier stehen darf. Das ist eine fachliche Frage
// und liegt beim Prüfmeister; dieser Eingriff lässt sie offen.
//
// Head of Product Engineering · 2026-09-15
import { describe, expect, it } from 'vitest'
import { vorarbeitGiltFuer } from '../vollstaendigkeit/helpers'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { ersetzeZahlenWorte } from '../zahlen-parser'
import type { BerechnetePosition } from '../mengen/types'

const TUER = /tür|tuer/i
const FENSTER = /fenster/i
const SCHLEIFEN = /schleif|schliff/i
const GRUNDIEREN = /grundier/i

describe('vorarbeitGiltFuer — die vier Stufen', () => {
  it('1. nicht genannt → gilt (nichts wird weggenommen)', () => {
    expect(vorarbeitGiltFuer(TUER, SCHLEIFEN, 'die innentüren lackieren', [FENSTER])).toBe(true)
    expect(vorarbeitGiltFuer(FENSTER, SCHLEIFEN, 'die fenster lackieren', [TUER])).toBe(true)
  })

  it('2. im Satz mit dem Bauteil genannt → gilt', () => {
    const t = 'die türen anschleifen und lackieren'
    expect(vorarbeitGiltFuer(TUER, SCHLEIFEN, t, [FENSTER])).toBe(true)
  })

  it('3. nur beim anderen Bauteil genannt → gilt hier NICHT (der Fund)', () => {
    const t = 'im flur die 4 innentüren lackieren, die sind alt, die müssen vorher angeschliffen und grundiert werden. im wohnzimmer die 2 fenster von innen streichen'
    expect(vorarbeitGiltFuer(TUER, SCHLEIFEN, t, [FENSTER]), 'Türen behalten es').toBe(true)
    expect(vorarbeitGiltFuer(TUER, GRUNDIEREN, t, [FENSTER]), 'Türen behalten es').toBe(true)
    expect(vorarbeitGiltFuer(FENSTER, SCHLEIFEN, t, [TUER]), 'Fenster nicht').toBe(false)
    expect(vorarbeitGiltFuer(FENSTER, GRUNDIEREN, t, [TUER]), 'Fenster nicht').toBe(false)
  })

  it('4. allgemeine Ansage ohne Bauteil → gilt für alle', () => {
    const t = 'alles muss vorher angeschliffen werden. die türen lackieren. die fenster lackieren'
    expect(vorarbeitGiltFuer(TUER, SCHLEIFEN, t, [FENSTER])).toBe(true)
    expect(vorarbeitGiltFuer(FENSTER, SCHLEIFEN, t, [TUER])).toBe(true)
  })

  it('das Komma trennt nicht — der Nebensatz meint das Bauteil des Hauptsatzes', () => {
    // „…, die sind alt, die müssen angeschliffen werden" nennt die Tür nur
    // im ersten Teilsatz. Getrennt am Punkt, nicht am Komma, gehört beides
    // zusammen. Wer hier auf Teilsätze umstellt, nimmt den Türen ihre
    // ausdrücklich bestellte Vorarbeit weg.
    const t = 'die innentüren lackieren, die müssen vorher angeschliffen werden'
    expect(vorarbeitGiltFuer(TUER, SCHLEIFEN, t, [FENSTER])).toBe(true)
  })

  it('leerer Text stürzt nicht ab', () => {
    expect(vorarbeitGiltFuer(TUER, SCHLEIFEN, '', [FENSTER])).toBe(true)
  })
})

// ── Der gemessene Fall, durch den echten Weg ─────────────────────────────
// Kein von Hand gebautes `meta` — das ist die Lehre aus PM-045-B.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const durchLauf = (transkript: string, raeume: any[]): BerechnetePosition[] =>
  verarbeiteExtraktion(transkript, { result: { gewerk: 'maler', raeume, transkript } } as never)
    .mengen.positionen

const FUND = 'Im Flur die vier Innentüren lackieren, die sind alt, die müssen vorher angeschliffen und grundiert werden. Im Wohnzimmer die zwei Fenster von innen streichen.'

const FUND_RAEUME = [
  raum('Flur', { laenge: 4, breite: 1.5, hoehe: 2.5, tueren: [{ anzahl: 4, breite: 0.9, hoehe: 2.1, annahme: false }], arbeiten: ['türen lackieren beidseitig'] }),
  raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.5, fenster: [{ anzahl: 2, breite: 1.2, hoehe: 1.4, annahme: false }], arbeiten: ['fenster streichen innen'] }),
]

describe('PM-045-C im echten Weg', () => {
  const pos = () => durchLauf(FUND, FUND_RAEUME)
  const finde = (muster: RegExp) => pos().find(p => muster.test(p.beschreibung))

  it('keine erfundene Fenster-Vorarbeit — das ist der Fund', () => {
    expect(finde(/Fenster abschleifen/)).toBeUndefined()
    expect(finde(/Fenster grundieren/)).toBeUndefined()
  })

  it('die Türen behalten ihre ausdrücklich bestellte Vorarbeit', () => {
    expect(finde(/Türen abschleifen/)).toBeTruthy()
    expect(finde(/Türen grundieren/)).toBeTruthy()
  })

  it('und die Stückzahl aus CoS-E-058 steht weiter auf 4', () => {
    expect(finde(/Türen abschleifen/)?.menge).toBe(4)
    expect(finde(/Türen lackieren/)?.menge).toBe(4)
  })
})

// ── Die Gegenprobe: der Eingriff nimmt nichts weg ────────────────────────

const wand = (r: string): BerechnetePosition =>
  ({ beschreibung: `Wand streichen 2x — ${r}`, menge: 40, einheit: 'm²', konfidenz: 'high', berechnungsweg: '', annahmen: [] })

const lauf = (text: string) =>
  pruefeUndErgaenzeVollstaendigkeit('maler', [wand('Wohnzimmer')], ersetzeZahlenWorte(text)).positionen

describe('Gegenprobe — ohne genannte Vorarbeit bleibt alles wie vorher', () => {
  it('„Die Innentüren lackieren." trägt weiter Abschleifen und Grundieren', () => {
    const p = lauf('Die Innentüren lackieren.')
    expect(p.find(x => /Türen abschleifen/.test(x.beschreibung))).toBeTruthy()
    expect(p.find(x => /Türen grundieren/.test(x.beschreibung))).toBeTruthy()
  })

  it('„Die Fenster lackieren." trägt weiter Abschleifen und Grundieren', () => {
    const p = lauf('Die Fenster lackieren.')
    expect(p.find(x => /Fenster abschleifen/.test(x.beschreibung))).toBeTruthy()
    expect(p.find(x => /Fenster grundieren/.test(x.beschreibung))).toBeTruthy()
  })

  it('Heizkörper: der Anstrich bleibt immer, auch wenn die Vorarbeit fremd zugeordnet ist', () => {
    const p = lauf('Die Türen anschleifen und lackieren. Die Heizkörper lackieren.')
    expect(p.find(x => /Heizkörper lackieren/.test(x.beschreibung)), 'der Auftrag selbst').toBeTruthy()
    expect(p.find(x => /Heizkörper abschleifen/.test(x.beschreibung)), 'die fremde Vorarbeit').toBeUndefined()
  })
})
