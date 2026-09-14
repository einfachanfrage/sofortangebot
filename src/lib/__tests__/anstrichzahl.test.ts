// 1× ↔ 2× ↔ 3× — ein Griff statt drei.
//
// ── CoS-E-021 / TN-052 (Manfred) ──────────────────────────────────────────
//
// *„Wechsel 1× → 2× verlangt manuelles Ändern von Titel, Untertitel UND
// Preis statt eines Umschalters, obwohl die App den Preis kennt."*
//
// Die Handarbeit war nicht nur lästig, sie war gefährlich: Wer den Titel auf
// 2× stellt und den Preis vergisst, hat eine Position, die zwei Anstriche
// verspricht und einen kostet — genau der Zustand, den Regel 1 vom 24.08. im
// Matcher verhindert („ein 2x-Auftrag bekommt nie einen 1x-Preis"), nur von
// Hand wiederhergestellt.
//
// Diese Datei sichert die drei Dinge, die dabei zusammenpassen müssen:
// derselbe Blick auf den Titel wie im Matcher, ein Umbau, der nichts anderes
// kaputtmacht, und ein Preis, der aus dem Katalog kommt statt aus einer
// Formel.
import { describe, expect, it } from 'vitest'
import { hatAnstrichzahl, anstrichzahl, mitAnstrichzahl } from '../anstrichzahl'
import { findePreisposition, anstrichzahlAusTitel } from '../preis-matcher'
import { waehleUntertitel } from '../positions-untertitel'
import { DEFAULT_PRICES } from '../default-prices'

const KATALOG = DEFAULT_PRICES.map((p, i) => ({ id: `p${i}`, ...p }))
const preis = (titel: string, einheit = 'm²', gewerk = 'Maler') =>
  findePreisposition(titel, einheit, KATALOG.filter(p => p.category.startsWith(gewerk)))?.position.unit_price ?? null

describe('Der Umschalter sieht genau das, was auch der Matcher sieht', () => {
  // Wenn die beiden verschieden lesen, bietet die Oberfläche einen Schalter
  // an, den die Preissuche ignoriert — oder umgekehrt.
  it.each([
    'Wand streichen 2x — Wohnzimmer',
    'Türen lackieren (2× Anstrich)',
    'Fenster lackieren (2× Anstrich)',
    'Tapete / Raufaser überstreichen 2x',
    'Wand streichen 3x Anstrich (Vollton / Dunkelfarbe)',
    'Zweifach Anstrich',
    'Boden abdecken (Abdeckvlies)',
    'Tapete ablösen (einlagig)',
  ])('„%s"', titel => {
    expect(anstrichzahl(titel) ?? undefined).toBe(anstrichzahlAusTitel(titel))
  })

  it('erkennt „2×" mit Malzeichen', () => {
    // Der erste Anlauf hatte hier ein `\b` hinter dem Zeichen. Nach dem „×"
    // steht ein Leerzeichen — zwei Zeichen ohne Wortcharakter, also gar keine
    // Wortgrenze. Ausgerechnet die Schreibweise des Katalogs blieb damit
    // unerkannt, und bei der häufigsten Position wäre kein Schalter
    // erschienen.
    expect(hatAnstrichzahl('Türen lackieren (2× Anstrich)')).toBe(true)
    expect(anstrichzahl('Türen lackieren (2× Anstrich)')).toBe('2')
  })
})

describe('Der Umbau lässt alles andere in Ruhe', () => {
  it.each([
    ['Wand streichen 1x — Wohnzimmer', '2', 'Wand streichen 2x — Wohnzimmer'],
    ['Wand streichen 1x (ohne Akzentwand) — Salon', '3', 'Wand streichen 3x (ohne Akzentwand) — Salon'],
    ['Türen lackieren (2× Anstrich)', '3', 'Türen lackieren (3× Anstrich)'],
    ['Tapete / Raufaser überstreichen 1x', '2', 'Tapete / Raufaser überstreichen 2x'],
    ['Zweifach Anstrich', '3', 'Dreifach Anstrich'],
  ])('„%s" → %s× ergibt „%s"', (titel, stufe, erwartet) => {
    // Der Raum hinter dem Gedankenstrich und der Klammerzusatz müssen stehen
    // bleiben: Ohne Raum fällt die Position unter „Allgemein" (CoS-E-022),
    // ohne Klammer verliert sie ihren Preis. Beides ist heute teuer genug
    // gewesen — deshalb ersetzt der Umbau an Ort und Stelle, statt einen
    // neuen Titel zusammenzusetzen.
    expect(mitAnstrichzahl(titel, stufe as '1' | '2' | '3')).toBe(erwartet)
  })

  it('fasst Titel ohne Anstrichzahl nicht an', () => {
    expect(hatAnstrichzahl('Boden abdecken (Abdeckvlies)')).toBe(false)
    expect(mitAnstrichzahl('Boden abdecken (Abdeckvlies)', '2')).toBe('Boden abdecken (Abdeckvlies)')
  })
})

describe('Der Preis kommt aus dem Katalog, nicht aus einer Formel', () => {
  it('jede Stufe bekommt ihren eigenen Preis', () => {
    const basis = 'Wand streichen 1x — Wohnzimmer'
    expect(preis(basis)).toBe(6)
    expect(preis(mitAnstrichzahl(basis, '2'))).toBe(9.5)
    expect(preis(mitAnstrichzahl(basis, '3'))).toBe(13)
  })

  it('zwei Anstriche kosten NICHT das Doppelte', () => {
    // Die eigentliche Begründung dafür, dass hier gesucht und nicht gerechnet
    // wird: Grundierung, Abkleben und Anfahrt fallen einmal an. 6,00 € → 9,50 €,
    // nicht 12,00 €. Wer × 2 rechnet, verkauft den zweiten Anstrich zu teuer.
    expect(preis(mitAnstrichzahl('Wand streichen 1x — Wohnzimmer', '2'))).not.toBe(12)
    expect(preis(mitAnstrichzahl('Decke streichen 1x — Bad', '2'))).not.toBe(14)
    expect(preis(mitAnstrichzahl('Decke streichen 1x — Bad', '2'))).toBe(11)
  })

  it('sagt ehrlich, wenn es die Stufe im Katalog nicht gibt', () => {
    // `Türen lackieren (3× Anstrich)` steht nicht im Standardkatalog. Der
    // Titel wird trotzdem umgestellt — der Handwerker darf sagen, was er tut —
    // aber der Preis geht sichtbar auf 0,00 €, statt still der alte zu
    // bleiben. PM-018.
    expect(preis(mitAnstrichzahl('Türen lackieren (2× Anstrich)', '3'), 'Stück')).toBeNull()
  })
})

describe('Der Untertitel wandert mit', () => {
  it('sagt bei 2× auch „zweilagig"', () => {
    // Manfreds dritter Handgriff. Bleibt der Untertitel stehen, steht unter
    // „2×" die Erklärung für „1×" — auf dem Kundenpapier.
    expect(waehleUntertitel('Wand streichen 1x — Wohnzimmer')).toMatch(/einlagig/i)
    expect(waehleUntertitel('Wand streichen 2x — Wohnzimmer')).toMatch(/zweilagig/i)
  })
})
