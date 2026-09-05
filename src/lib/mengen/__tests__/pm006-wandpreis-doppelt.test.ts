import { describe, it, expect } from 'vitest'
import { malerEngine } from '../gewerke/maler'
import { DEFAULT_PRICES } from '../../default-prices'
import { findePreisposition } from '../../preis-matcher'

// ── PM-006 / PM-028, Prüfmeister 04.09.2026 ───────────────────────────────
//
// „Wandflächen streichen 2x" kostet 11,50 €/m², „Restwände streichen" in
// PM-002 kostet 9,50 €/m². Zwei Preise für denselben Arbeitsgang, im selben
// Konto, abhängig allein davon, wie die Position heißt.
//
// Damit ist auch der alte PM-028-Fund erklärt („Wandflächen-Grundpreis 11,50
// statt 9,50"): Es war nie ein Preisfehler, sondern ein zweiter
// Katalogeintrag für dieselbe Leistung.
//
// Fachlich sind Restwände Wandflächen, nur um die Akzentwand vermindert —
// also ein Titel, ein Katalogeintrag, ein Preis.

describe('PM-006 — ein Arbeitsgang, ein Katalogtitel', () => {
  it('die Restwand-Position trägt den normalen Wandtitel inkl. Anstrichzahl', () => {
    const e = malerEngine({
      transkript: 'Schlafzimmer 4 x 3,5, Höhe 2,60, drei Wände weiß streichen, zweimal, '
        + 'die Wand hinterm Bett kriegt Tapete, Akzentwand, ein Fenster, eine Tür, normal.',
      raeume: [{
        name: 'Schlafzimmer', laenge: 4, breite: 3.5, hoehe: 2.6,
        tueren: [{ breite: 0.9, hoehe: 2.1, anzahl: 1 }],
        fenster: [{ breite: 1.5, hoehe: 1.2, anzahl: 1 }],
        arbeiten: ['wände streichen', 'akzentwand tapezieren'],
        akzentwand: true,
      }],
    })
    const titel = e.positionen.map(p => p.beschreibung)
    expect(titel).toContain('Wandflächen streichen 2x (ohne Akzentwand) — Schlafzimmer')
    expect(titel.some(t => /Restwände/i.test(t))).toBe(false)
  })

  it('die Einschränkung steht im Berechnungsweg, nicht im Katalogschlüssel', () => {
    const e = malerEngine({
      transkript: 'Schlafzimmer 4 x 3,5, Höhe 2,60, drei Wände weiß streichen, zweimal, '
        + 'die Wand hinterm Bett kriegt Tapete, Akzentwand, ein Fenster, eine Tür, normal.',
      raeume: [{
        name: 'Schlafzimmer', laenge: 4, breite: 3.5, hoehe: 2.6,
        tueren: [{ breite: 0.9, hoehe: 2.1, anzahl: 1 }],
        fenster: [{ breite: 1.5, hoehe: 1.2, anzahl: 1 }],
        arbeiten: ['wände streichen', 'akzentwand tapezieren'],
        akzentwand: true,
      }],
    })
    const rest = e.positionen.find(p => /Wandflächen streichen/i.test(p.beschreibung))
    // Der Kunde sieht weiterhin, dass nicht alle Wände gestrichen werden —
    // nur eben im Rechenweg statt im Katalogtitel.
    expect(rest?.berechnungsweg).toMatch(/Akzentwand/)
    expect(rest?.menge).toBeLessThan(39)
  })

  it('der Klammerzusatz erklärt die Differenz, ohne den Preis zu verstellen', () => {
    // Der Matcher entfernt Klammerinhalte — der Titel trifft weiterhin
    // denselben Eintrag wie eine ganz normale Wandposition.
    const katalog = [{ id: '1', title: 'Wand streichen 2x Anstrich', category: 'Maler – Anstrich Innen', unit: 'm²', unit_price: 11.50 }]
    const mit = findePreisposition('Wandflächen streichen 2x (ohne Akzentwand) — Schlafzimmer', 'm²', katalog)
    const ohne = findePreisposition('Wandflächen streichen 2x — Schlafzimmer', 'm²', katalog)
    expect(mit?.position.unit_price).toBe(11.50)
    expect(mit?.position.id).toBe(ohne?.position.id)
  })

  it('es gibt keinen zweiten Katalogeintrag „Restwände streichen" mehr', () => {
    expect(DEFAULT_PRICES.some(p => /restwände/i.test(p.title))).toBe(false)
  })
})
