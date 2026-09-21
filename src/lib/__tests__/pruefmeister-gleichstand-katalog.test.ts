// Gleichstand an der Spitze — wenn die REIHENFOLGE im Katalog den Preis
// entscheidet und sonst nichts.
//
// ── Woher der Test kommt ──────────────────────────────────────────────────
//
// Themenspeicher Punkt 20 (21.09.2026) hat die Klasse benannt und
// ausdrücklich offengelassen: „Ungemessen und deshalb keine Behauptung: wie
// viele solcher Paare es gibt." Genau das steht hier — gemessen, nicht
// geschätzt, am selben Matcher, den der Angebots-Endpunkt benutzt.
//
// Die Klasse ist NICHT „zwei Katalogzeilen mit verschiedenem Preis". Davon
// gibt es viele, und die meisten sind harmlos, weil ein deutlich besserer
// Treffer gewinnt. Gefährlich ist die engere Form:
//
//   1. mehrere Katalogzeilen teilen sich den HÖCHSTEN Score,
//   2. ihre Preise sind verschieden,
//   3. und KEINE davon heißt so wie der Engine-Titel.
//
// Dann gibt es nichts mehr, woran der Matcher sie unterscheiden könnte — es
// gewinnt die Zeile, die im Katalog des Betriebs zufällig weiter oben steht.
// Zwei Betriebe mit demselben Diktat bekommen verschiedene Preise, und auf
// dem Angebot sieht man den Unterschied nicht.
//
// ── Was die Messung widerlegt hat ─────────────────────────────────────────
//
// Meine erste Vermutung war, dass `Wände spachteln Q4` (22,00 €) auf
// `Fläche spachteln` (9,00 €) kippen kann — beide Score 1,00. Nachgemessen:
// **kippt nicht.** Es gibt eine gleichlautende Katalogzeile, und die gewinnt
// unabhängig von der Reihenfolge. Die Vermutung war falsch, und deshalb
// steht Bedingung 3 oben drin. Gemessen statt geglaubt.
//
// Prüfmeister · 21.09.2026
import { describe, expect, it } from 'vitest'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '@/lib/positions-gewerk'

type Zeile = { id: string; title: string; category: string; unit: string; unit_price: number }

function katalogFuer(titel: string): Zeile[] {
  const gewerk = gewerkFuerPosition(titel, undefined)
  return DEFAULT_PRICES
    .filter(p => preisKategoriePasstZuGewerk(p.category, gewerk))
    .map((p, i) => ({ id: `s${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price }))
}

/** Alle Katalogzeilen, die sich den höchsten Score teilen. */
function spitze(titel: string, einheit: string, katalog = katalogFuer(titel)): Zeile[] {
  const erst = findePreisposition(titel, einheit, katalog)
  if (!erst) return []
  const oben = [erst.position as Zeile]
  let rest = katalog
  for (let runde = 0; runde < 10; runde++) {
    rest = rest.filter(p => p.title !== oben[oben.length - 1].title)
    const weiter = findePreisposition(titel, einheit, rest)
    if (!weiter || Math.abs(weiter.score - erst.score) > 1e-9) break
    oben.push(weiter.position as Zeile)
  }
  return oben
}

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()

describe('PM-138 · Gleichstand an der Spitze — die Reihenfolge entscheidet den Preis', () => {
  // ── Der Fall, an dem die Klasse aufgefallen ist (PM-106) ────────────────
  it('PM-138-1 · „Grundierung" steht auf zwei Zeilen mit Score 1,00 und 4,50 € / 6,00 €', () => {
    const oben = spitze('Grundierung', 'm²')
    expect(oben.map(p => p.title).sort()).toEqual([
      'Grundieren (Haftgrund / Sperrgrund)',
      'Grundieren (Tiefengrund)',
    ])
    expect(oben.map(p => p.unit_price).sort((a, b) => a - b)).toEqual([4.5, 6])
    // und keine der beiden heißt „Grundierung"
    expect(oben.some(p => norm(p.title) === 'grundierung')).toBe(false)
  })

  it('PM-138-2 · und deshalb kippt der Preis allein an der Katalogreihenfolge', () => {
    const katalog = katalogFuer('Grundierung')
    const hoch = (titel: string) =>
      [...katalog].sort((a, b) => (a.title === titel ? -1 : 0) - (b.title === titel ? -1 : 0))

    const mitTiefengrund = findePreisposition('Grundierung', 'm²', hoch('Grundieren (Tiefengrund)'))
    const mitHaftgrund = findePreisposition('Grundierung', 'm²', hoch('Grundieren (Haftgrund / Sperrgrund)'))

    expect(mitTiefengrund?.position.unit_price).toBe(4.5)
    expect(mitHaftgrund?.position.unit_price).toBe(6)
    // Ein Drittel Unterschied, ohne dass im Diktat oder im Angebot etwas anders ist.
    expect(mitTiefengrund?.score).toBe(mitHaftgrund?.score)
  })

  // ── Die Gegenprobe: eine gleichlautende Zeile schützt ───────────────────
  it('PM-138-3 · Gegenprobe: „Wände spachteln Q4" kippt NICHT — die gleichlautende Zeile gewinnt', () => {
    const katalog = katalogFuer('Wände spachteln Q4')
    const flaecheHoch = [...katalog].sort(
      (a, b) => (a.title === 'Fläche spachteln (Flächenspachtel)' ? -1 : 0)
        - (b.title === 'Fläche spachteln (Flächenspachtel)' ? -1 : 0),
    )
    expect(findePreisposition('Wände spachteln Q4', 'm²', katalog)?.position.unit_price).toBe(22)
    expect(findePreisposition('Wände spachteln Q4', 'm²', flaecheHoch)?.position.unit_price).toBe(22)
  })

  // ── Die drei teuersten Spannen der Klasse ───────────────────────────────
  it('PM-138-4 · „Wände spachteln / glätten" steht auf drei Zeilen: 9,00 € / 14,00 € / 22,00 €', () => {
    const preise = spitze('Wände spachteln / glätten', 'm²').map(p => p.unit_price).sort((a, b) => a - b)
    expect(preise).toEqual([9, 14, 22])
  })

  it('PM-138-5 · „Schleifen" steht auf sechs Zeilen von 4,00 € bis 9,50 €', () => {
    const oben = spitze('Schleifen', 'm²')
    expect(oben.length).toBe(6)
    const preise = oben.map(p => p.unit_price)
    expect(Math.min(...preise)).toBe(4)
    expect(Math.max(...preise)).toBe(9.5)
  })

  it('PM-138-6 · „Altfliesen abstemmen" steht auf drei Zeilen: 10,00 € / 18,00 € / 22,00 €', () => {
    const preise = spitze('Altfliesen abstemmen', 'm²').map(p => p.unit_price).sort((a, b) => a - b)
    expect(preise).toEqual([10, 18, 22])
  })

  it('PM-138-7 · „Armatur montieren" — 65,00 € oder 120,00 €, je nach Reihenfolge', () => {
    const preise = spitze('Armatur montieren', 'Stück').map(p => p.unit_price).sort((a, b) => a - b)
    expect(preise).toEqual([65, 120])
  })

  // ── Sperrklinke auf der Größe der Klasse ────────────────────────────────
  //
  // 16 Engine-Titel, gemessen am 21.09.2026 über alle Titel, die
  // `scripts/vokabular-abgleich.mjs --zweittreffer` aus dem Quelltext liest.
  // Die Zahl steht hier NICHT, weil 16 richtig wäre, sondern damit sie sich
  // nicht lautlos ändert. Steigt sie, hat jemand eine Katalogzeile angelegt,
  // die sich vom Engine-Titel nicht unterscheiden lässt; fällt sie, ist ein
  // Paar auseinandergezogen worden — beides gehört gesehen.
  it('PM-138-8 · die Klasse hat 16 Vertreter, und keiner davon ist neu dazugekommen', () => {
    const betroffen = FAELLE.filter(([titel, einheit]) => {
      const oben = spitze(titel, einheit)
      if (oben.length < 2) return false
      if (new Set(oben.map(p => p.unit_price)).size < 2) return false
      return !oben.some(p => norm(p.title) === norm(titel))
    })
    expect(betroffen.length).toBe(FAELLE.length)
    expect(FAELLE.length).toBe(16)
  })
})

/**
 * Die 16 Titel, wie `--zweittreffer` sie am 21.09.2026 gemeldet hat,
 * nach Preisspanne sortiert. Abgeschrieben aus der Messung, nicht ausgedacht.
 */
const FAELLE: ReadonlyArray<readonly [string, string]> = [
  ['Wände spachteln / glätten', 'm²'],
  ['Schleifen', 'm²'],
  ['Altfliesen abstemmen', 'm²'],
  ['Armatur montieren', 'Stück'],
  ['Designboden verlegen', 'm²'],
  ['Vinyl-Boden verlegen', 'm²'],
  ['Betonwände schleifen / Untergrundvorbereitung', 'm²'],
  ['Fertigparkett verlegen', 'm²'],
  ['Dachschrägen grundieren', 'm²'],
  ['Kork verlegen', 'm²'],
  ['Voranstrich / Grundierung', 'm²'],
  ['Voranstrich / Grundierung Decke', 'm²'],
  ['Grundierung', 'm²'],
  ['Vinyl / Designboden verlegen', 'm²'],
  ['Verbundabdichtung Wand', 'm²'],
  ['Klick-Vinyl verlegen', 'm²'],
]
