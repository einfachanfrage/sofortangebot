// VOB-013 — Leibungen dreiseitig, Fensterbank nur einmal
// (Fund des Prüfmeisters, Auftrag CoS-036, umgesetzt 03.09.2026)
//
// Die Leibung läuft um drei Seiten der Öffnung: Sturz oben, zwei Wangen
// seitlich. Unten sitzt beim Fenster die Fensterbank, bei der Tür der
// Fußboden — dort gibt es keine Leibungsfläche zu streichen. Gerechnet wurde
// `2×br + 2×hoe`, also einmal rundherum.
//
// Das ist keine Norm-, sondern eine Geometriefrage (Head of Legal
// ausdrücklich) — deshalb konnte der Fix vor dem Normtext-Kauf kommen.
import { describe, it, expect } from 'vitest'
import { malerEngine } from '../gewerke/maler'

/** Minimaldaten: nur Leibungen, damit die Zahlen isoliert prüfbar sind. */
function mitLeibungen(leibungen: unknown[], transkript = '') {
  return malerEngine({ gewerk: 'maler', raeume: [], waende: [], leibungen, transkript })
}

const leibung = (p: Record<string, unknown> = {}) => ({
  typ: 'fenster', anzahl: 1, breite: 1.2, hoehe: 1.0, tiefe: 0.25, ...p,
})

function position(ergebnis: { positionen: { beschreibung: string; menge: number }[] }, teil: string) {
  return ergebnis.positionen.find(p => p.beschreibung.toLowerCase().includes(teil.toLowerCase()))
}

describe('Leibungsfläche', () => {
  it('rechnet dreiseitig: Standardfenster 0,80 m², nicht 1,10 m²', () => {
    // (1,20 + 2×1,00) × 0,25 = 0,80 — vorher (2×1,20 + 2×1,00) × 0,25 = 1,10.
    const pos = position(mitLeibungen([leibung()]), 'leibungen')
    expect(pos?.menge).toBe(0.8)
  })

  it('war vorher rund ein Drittel zu groß — die Differenz ist genau die Fensterbank', () => {
    const dreiseitig = 0.8
    const rundherum = 1.1
    const bankflaeche = 1.2 * 0.25
    expect(Math.round((rundherum - dreiseitig) * 100) / 100).toBe(bankflaeche)
  })

  it('rechnet die Anzahl mit', () => {
    const pos = position(mitLeibungen([leibung({ anzahl: 4 })]), 'leibungen')
    expect(pos?.menge).toBe(3.2)
  })

  it('gilt genauso für Türen — unten ist der Fußboden', () => {
    // Tür 0,90 × 2,10, 25 cm: (0,90 + 2×2,10) × 0,25 = 1,275 m².
    // Herauskommt 1,27, nicht 1,28: `round2` rechnet `Math.round(n*100)/100`,
    // und 1.275 × 100 ist in Gleitkomma 127.49999999999999. Bekannter
    // Rundungs-Effekt, KEIN Fehler dieses Fixes — er trifft jede Menge, die
    // exakt auf einer halben Nachkommastelle landet, und steckt in neun
    // eigenen round2-Kopien im Projekt. Gemeldet, nicht hier nebenbei
    // geändert: Rundung ist Geld, und Geld ändere ich nicht still.
    const pos = position(mitLeibungen([leibung({ typ: 'tuer', breite: 0.9, hoehe: 2.1 })]), 'türleibungen')
    expect(pos?.menge).toBe(1.27)
  })

  it('erklärt den Rechenweg dreiseitig, damit der Handwerker es nachvollziehen kann', () => {
    const ergebnis = mitLeibungen([leibung()])
    const pos = ergebnis.positionen.find(p => p.beschreibung.includes('leibungen') || p.beschreibung.includes('Leibungen'))
    expect((pos as { berechnungsweg?: string })?.berechnungsweg).toContain('dreiseitig')
    expect((pos as { berechnungsweg?: string })?.berechnungsweg).not.toMatch(/2×1\.2/)
  })
})

describe('Fensterbank', () => {
  it('wird genau einmal berechnet — Leibung + Bank ergeben zusammen die Rundum-Fläche', () => {
    const ergebnis = mitLeibungen([leibung({ typ: 'fenster_innen' })], 'die fensterbank bitte mitstreichen')
    const leib = position(ergebnis, 'innenleibungen')!
    const bank = position(ergebnis, 'fensterbänke')!
    expect(leib.menge).toBe(0.8)
    expect(bank.menge).toBe(0.3)
    // Zusammen wieder 1,10 — aber jetzt als zwei getrennte, je einmal
    // gezählte Flächen statt einer doppelt gezählten.
    expect(Math.round((leib.menge + bank.menge) * 100) / 100).toBe(1.1)
  })

  it('bleibt weg, wenn niemand sie genannt hat', () => {
    const ergebnis = mitLeibungen([leibung({ typ: 'fenster_innen' })], 'wände streichen')
    expect(position(ergebnis, 'fensterbänke')).toBeUndefined()
  })

  it('bleibt weg bei einer Außenleibung, auch wenn sie genannt wird', () => {
    const ergebnis = mitLeibungen([leibung({ typ: 'fenster' })], 'fensterbank')
    expect(position(ergebnis, 'fensterbänke')).toBeUndefined()
  })
})
