// CoS-E-065 Punkt 1 — die Tür-Menge sagt jetzt, woher sie kommt: auch dann,
// wenn sie von nirgendwo kommt.
//
// Der Fund des Designers (DC-107): `tuerQuelle` in `maler-lackieren.ts` war
// zweiwertig — „aus Aufnahme" oder „aus Transkript". Einen dritten Wert gab
// es nicht, also stand „aus Transkript" auch dann da, wenn im Transkript
// keine Zahl stand und die App die Menge selbst gesetzt hat: bei der
// Zimmer-Annahme („drei Zimmer → je 1 Tür") und bei der Eins als letztem
// Rest. Bei den Fenstern ist derselbe Ausdruck seit CoS-E-058 dreiwertig
// (`fensterQuelle`), bei den Türen war er es nicht.
//
// Warum das mehr ist als ein Wort: Auf dem Kundenpapier streicht
// `kundenRechenweg` (DC-108) die reine Herkunft und behält „angenommen" in
// Klammern. Mit „aus Transkript" verschwand die Annahme damit lautlos — das
// Angebot behauptete eine Tür, ohne zu sagen, dass sie geraten ist. In der
// App las der Betrieb dasselbe.
//
// Zugesichert wird hier genau dreierlei — die drei Quellen, in der
// Reihenfolge, in der die Regel die Menge bildet; dazu die Sperrklinke, dass
// die Fenster-Seite unverändert bleibt und dass die Annahme auf dem
// Kundenpapier ankommt.
import { describe, expect, it } from 'vitest'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { kundenRechenweg } from '../rechenweg-kundentext'
import { ersetzeZahlenWorte } from '../zahlen-parser'
import type { BerechnetePosition } from '../mengen/types'

const wand = (raum: string): BerechnetePosition =>
  ({ beschreibung: `Wand streichen 2x — ${raum}`, menge: 40, einheit: 'm²', konfidenz: 'high', berechnungsweg: '', annahmen: [] })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lauf = (text: string, meta?: any) =>
  pruefeUndErgaenzeVollstaendigkeit('maler', [wand('Wohnzimmer')], ersetzeZahlenWorte(text), meta).positionen

/** Der Rechenweg der einen Position, die die Herkunft trägt. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const weg = (text: string, titel: RegExp, meta?: any): string =>
  lauf(text, meta).find(p => titel.test(p.beschreibung))?.berechnungsweg ?? ''

describe('CoS-E-065 Punkt 1 — tuerQuelle kennt den dritten Fall', () => {
  it('Zahl im Satz → aus Transkript', () => {
    expect(weg('Die vier Innentüren lackieren.', /Türen abschleifen/))
      .toBe('4 Tür(en) aus Transkript')
  })

  it('Zahl aus dem Raumbestand → aus Aufnahme', () => {
    expect(weg('Die Innentüren lackieren.', /Türen abschleifen/, { tuerenAusAufnahme: 4 }))
      .toBe('4 Tür(en) aus Aufnahme')
  })

  it('keine Zahl, nur die Eins als Rest → angenommen (war „aus Transkript")', () => {
    expect(weg('Die Innentüren lackieren.', /Türen abschleifen/))
      .toBe('1 Tür(en) angenommen')
  })

  it('Zimmerzahl → je 1 Tür ist eine Annahme, und heißt jetzt auch so', () => {
    // Derselbe Fall, den `tuerAnnahme` schon immer als Annahme ausgewiesen
    // hat. Vorher widersprachen sich die zwei Angaben auf derselben Zeile.
    const p = lauf('Drei Zimmer, Türen lackieren.').find(x => /Türen abschleifen/.test(x.beschreibung))
    expect(p?.berechnungsweg).toBe('3 Tür(en) angenommen')
    expect(p?.annahmen.join(' ')).toMatch(/3 Zimmer → je 1 Tür angenommen/)
  })

  it('eine gesagte Zahl bleibt eine gesagte Zahl, auch neben einer Aufnahme', () => {
    expect(weg('Die zwei Türen lackieren.', /Türen abschleifen/, { tuerenAusAufnahme: 4 }))
      .toBe('2 Tür(en) aus Transkript')
  })
})

describe('Sperrklinken — was sich NICHT ändern durfte', () => {
  it('die Menge selbst bleibt unverändert (nur das Wort daneben wechselt)', () => {
    const p = lauf('Die Innentüren lackieren.').filter(x => /Tür|Zarge/i.test(x.beschreibung))
    expect(p.length).toBeGreaterThanOrEqual(4)
    expect(new Set(p.map(x => x.menge))).toEqual(new Set([1]))
  })

  it('die Fenster-Seite ist unberührt — dreiwertig wie vorher', () => {
    expect(weg('Die Fenster lackieren.', /Fenster abschleifen/)).toBe('1 Fenster angenommen')
    expect(weg('Die drei Fenster lackieren.', /Fenster abschleifen/)).toBe('3 Fenster aus Transkript')
    expect(weg('Die Fenster lackieren.', /Fenster abschleifen/, { fensterAusAufnahme: 3 }))
      .toBe('3 Fenster aus Aufnahme')
  })

  it('auf dem Kundenpapier steht die Annahme jetzt in Klammern, nicht nirgends', () => {
    // Das ist der Punkt, an dem das Wort Geld wert ist: „aus Transkript"
    // wurde gestrichen, „angenommen" bleibt und wird gekennzeichnet.
    expect(kundenRechenweg(weg('Die Innentüren lackieren.', /Türen abschleifen/)))
      .toBe('1 Tür(en) (angenommen)')
    expect(kundenRechenweg(weg('Die vier Innentüren lackieren.', /Türen abschleifen/)))
      .toBe('4 Tür(en)')
  })
})
