// Ausgleichsmasse — die Staffel entscheidet den Preis.
//
// Der Katalog kennt drei Stärken, und sie liegen weit auseinander:
// bis 3 mm = 10,00 €, 3–10 mm = 16,00 €, 10–30 mm = 26,00 €. Die Engine
// schrieb bis zum 12.09.2026 `Ausgleichsmasse einbringen (bis 10mm)` — eine
// Schreibweise, die im Katalog nicht vorkommt. Der Matcher warf die Klammer
// weg, und alle drei Stärken bekamen den 3-mm-Preis.
//
// Der Prüfmeister über diese Fehlerklasse: *„Das sind die leisesten von
// allen."* Bei 60 m² Estrich sind 16,00 € Unterschied pro Quadratmeter knapp
// tausend Euro, die niemandem auffallen.
import { describe, expect, it } from 'vitest'
import { ausgleichsmasseTitel } from '../vollstaendigkeit/boden-basis'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'

const boden = DEFAULT_PRICES
  .filter(p => p.category.startsWith('Boden'))
  .map((p, i) => ({ id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price }))

const preis = (titel: string) => findePreisposition(titel, 'm²', boden)?.position.unit_price ?? null

describe('Ausgleichsmasse — Stärke aus dem Diktat in die Staffel des Katalogs', () => {
  it.each([
    [2, 'Ausgleichsmasse bis 3 mm einbringen', 10],
    [3, 'Ausgleichsmasse bis 3 mm einbringen', 10],
    [5, 'Ausgleichsmasse 3–10 mm einbringen', 16],
    [10, 'Ausgleichsmasse 3–10 mm einbringen', 16],
    [12, 'Ausgleichsmasse 10–30 mm einbringen', 26],
    [30, 'Ausgleichsmasse 10–30 mm einbringen', 26],
  ])('%i mm → %s', (mm, titel, betrag) => {
    expect(ausgleichsmasseTitel(mm)).toBe(titel)
    expect(preis(titel)).toBe(betrag)
  })

  it('nimmt ohne Angabe im Diktat den Grundfall', () => {
    // Kein „drei Millimeter" im Transkript: Die Engine erfindet keine Stärke.
    // Der Titel ohne Staffel trifft den Grundfall — das ist die günstigste
    // der drei Stufen und damit die vorsichtige Richtung.
    expect(ausgleichsmasseTitel(null)).toBe('Ausgleichsmasse einbringen')
    expect(preis('Ausgleichsmasse einbringen')).toBe(10)
  })

  it('lässt oberhalb der Staffel lieber den Preis weg', () => {
    // Der Boden-Katalog hört bei 30 mm auf; darüber geht es nur unter
    // „Estrich – Ausgleich & Spachtelung" weiter, einem anderen Gewerk.
    // PM-018: lieber sichtbar kein Preis als still der 26-€-Satz für eine
    // Schicht, die anderthalbmal so dick ist.
    expect(ausgleichsmasseTitel(45)).toBe('Ausgleichsmasse einbringen (45 mm)')
    expect(preis('Ausgleichsmasse einbringen (45 mm)')).toBeNull()
  })

  it('gibt keiner Stärke den Preis einer anderen', () => {
    // Die eigentliche Zusicherung. Fällt dieser Test, rechnet jemand 26-mm-
    // Arbeit zum 10-€-Satz ab und merkt es erst auf der Baustelle.
    const betraege = [2, 5, 12].map(mm => preis(ausgleichsmasseTitel(mm)))
    expect(betraege).toEqual([10, 16, 26])
    expect(new Set(betraege).size).toBe(3)
  })
})
