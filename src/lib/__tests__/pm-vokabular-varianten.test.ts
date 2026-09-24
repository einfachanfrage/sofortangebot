// Die sechs Titel, die `vokabular-abgleich.mjs` still nicht geprüft hat
// (Prüfmeister, 15.09.2026 — Restliste Nr. 10).
//
// Der Zähler „Titel aus Variablen, nicht prüfbar" stand auf 6 und war von 3
// gewachsen. Er war KEINE Grenze der Methode, sondern ein Lesefehler: Der
// Literal-Leser des Skripts zählte `${ … }` nicht mit und brach deshalb am
// ersten Backtick eines verschachtelten Templates ab —
// `Voranstrich / Grundierung${raum ?` war der Rest, der übrig blieb. Jeder
// neue Raum-Anhang als Ternär hat den Zähler weiter erhöht, ohne dass jemand
// merkte, dass dahinter ein ganz normaler, prüfbarer Titel steht.
//
// Das Skript liest jetzt zu Ende (Zähler 0, 161 statt 155 Titel). Diese Datei
// hält fest, was dabei herauskam — an den Zahlen, nicht an der Behauptung:
// Alle sechs finden einen Katalogpreis, keiner ist eine Lücke. Wer einen der
// Titel ändert, sieht hier, was sich am Geld ändert.
//
// Warum als Test und nicht als Zeile in der Doku: Eine Zahl, die niemand
// nachrechnen kann, veraltet still — derselbe Grund, aus dem es das Skript
// überhaupt gibt.
import { describe, expect, it } from 'vitest'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '../positions-gewerk'

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))

function treffer(titel: string, einheit: string) {
  const gewerk = gewerkFuerPosition(titel, undefined)
  return findePreisposition(titel, einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, gewerk)))
}

describe('Restliste 10 — die sechs vormals ungelesenen Titel haben alle einen Preis', () => {
  // `${titel}` aus maler-lackieren.ts:136 (`schritte`) — einmal mit Raum im
  // Titel, einmal ohne. Beide Fassungen schreibt die Engine wirklich.
  it.each([
    ['Heizkörper abschleifen', 'Stück', 'Heizkörper abschleifen', 20],
    ['Heizkörper grundieren', 'Stück', 'Heizkörper grundieren', 25],
    ['Heizkörper lackieren (2× Anstrich)', 'Stück', 'Heizkörper streichen / lackieren', 40],
  ])('%s → %s', (titel, einheit, erwarteterKatalogTitel, erwarteterPreis) => {
    const t = treffer(titel, einheit)
    expect(t?.position.title).toBe(erwarteterKatalogTitel)
    expect(t?.position.unit_price).toBe(erwarteterPreis)
  })

  // `${raum ? ` — ${raum}` : ''}` aus maler-basis.ts — der Raum-Anhang ist im
  // Katalog nie vorhanden, der Rumpf muss trotzdem treffen.
  it.each([
    ['Voranstrich / Grundierung'],
    ['Voranstrich / Grundierung Decke'],
  ])('%s trifft Grundieren — Tiefengrund zu 4,50 €', titel => {
    const t = treffer(titel, 'm²')
    expect(t?.position.title).toBe('Grundieren — Tiefengrund')
    expect(t?.position.unit_price).toBe(4.5)
  })

  it('Sockelleisten montieren trifft die Katalogzeile zu 5,50 €/lfdm', () => {
    const t = treffer('Sockelleisten montieren', 'lfdm')
    expect(t?.position.title).toBe('Sockelleisten montieren (Holz / MDF / Kunststoff)')
    expect(t?.position.unit_price).toBe(5.5)
  })
})

describe('Restliste 10 — der Zonen-Zusatz bewegt den Treffer nicht', () => {
  // `${zoneZusatz}` aus maler.ts:421. Zone und Farbe kommen als freier Text
  // aus dem Diktat; eine Liste zum Abschreiben gibt es nicht. Deshalb wird
  // hier GEMESSEN statt aufgezählt: Der Klammerzusatz darf den Preis nicht
  // bewegen, sonst hinge der Wandpreis daran, welche Farbe jemand genannt hat.
  const ohne = treffer('Wand streichen 2x', 'm²')

  it.each([
    'Wand streichen 2x (Zone oben)',
    'Wand streichen 2x (Blau, Zone oben)',
    'Wand streichen 2x (Zone Sockel)',
    'Wand streichen 2x (RAL 9010, Zone 1)',
  ])('%s → derselbe Treffer wie ohne Zusatz', titel => {
    const t = treffer(titel, 'm²')
    expect(t?.position.title).toBe(ohne?.position.title)
    expect(t?.position.unit_price).toBe(ohne?.position.unit_price)
  })

  it('und der Zusatz hebelt die Anstrichzahl nicht aus', () => {
    // Die Klammer darf den Titel nicht so weit verwischen, dass 3x auf 2x
    // fällt — das wäre 3,50 €/m² zu wenig.
    expect(ohne?.position.unit_price).toBe(9.5)
    expect(treffer('Wand streichen 3x (Zone oben)', 'm²')?.position.unit_price).toBe(13)
  })
})
