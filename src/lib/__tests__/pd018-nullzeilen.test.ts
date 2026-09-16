import { describe, it, expect } from 'vitest'
import { istNullzeile, ohneNullzeilen, gruppiereNachRaum } from '../angebot-gruppierung'
import { unbepreistePositionen } from '../versandbereit'

// PD-018 Punkt 2 (Prüfmeister, 16.09.2026, aus Sandys Live-Lauf):
// „Eine Position mit Menge 0 kommt nicht auf das Angebot."
//
// Der teuerste Fehler bei dieser Regel wäre, zu viel zu entfernen: eine
// Position OHNE Preis muss sichtbar bleiben (src/lib/versandbereit.ts).
// Deshalb steht die Gegenprobe hier direkt neben den Positivfällen.

function zeile(over: Partial<{ id: string; title: string; quantity: number; unit: string; unit_price: number; total_price: number; position: number }> = {}) {
  const basis = { id: '1', title: 'Wand streichen', description: null, quantity: 10, unit: 'm²', unit_price: 9.5, total_price: 95, position: 1 }
  return { ...basis, ...over }
}

describe('istNullzeile — was nachweislich nichts trägt', () => {
  it('Menge 0 bei vorhandenem Einzelpreis: „0 Stück × 25,00 € = 0,00 €"', () => {
    expect(istNullzeile(zeile({ title: 'Voranstrich / Grundierung', quantity: 0, unit: 'Stück', unit_price: 25, total_price: 0 }))).toBe(true)
  })

  it('Prozent-Zuschlag auf eine Bemessungsgrundlage von 0: „15 % × 0,00 €"', () => {
    expect(istNullzeile(zeile({ title: 'Erschwerniszuschlag Raumhöhe > 3m', quantity: 15, unit: '%', unit_price: 0, total_price: 0 }))).toBe(true)
  })

  it('Cent-genau statt === 0 — Rundungsreste zählen als 0', () => {
    expect(istNullzeile(zeile({ quantity: 0, unit: 'Stück', unit_price: 25, total_price: 0.001 }))).toBe(true)
  })
})

describe('istNullzeile — was stehen bleiben MUSS', () => {
  it('unbepreiste echte Position: „12 m² × 0,00 €" bleibt', () => {
    const p = zeile({ title: 'Parkett schleifen', quantity: 12, unit: 'm²', unit_price: 0, total_price: 0 })
    expect(istNullzeile(p)).toBe(false)
    // …und sie ist genau die, die versandbereit.ts als „Preis fehlt" meldet
    expect(unbepreistePositionen([{ title: p.title, unit_price: p.unit_price, price_item_id: null }])).toHaveLength(1)
  })

  it('bewusste 0-€-Leistung mit Katalogbezug (Kulanz) bleibt', () => {
    expect(istNullzeile(zeile({ title: 'Boden schützen', quantity: 1, unit: 'Pauschale', unit_price: 0, total_price: 0 }))).toBe(false)
  })

  it('Prozent-Zuschlag mit echtem Betrag bleibt', () => {
    expect(istNullzeile(zeile({ quantity: 15, unit: '%', unit_price: 4.56, total_price: 68.4 }))).toBe(false)
  })

  it('negative Zeile (Gutschrift/Rabattposition) bleibt', () => {
    expect(istNullzeile(zeile({ quantity: 1, unit: 'Pauschale', unit_price: -50, total_price: -50 }))).toBe(false)
  })
})

describe('ohneNullzeilen — der Fassaden-Entwurf aus dem Live-Lauf', () => {
  const entwurf = [
    zeile({ id: '1', title: 'Fassadenfläche streichen 2x — Fassade', quantity: 72, unit: 'm²', unit_price: 14, total_price: 1008, position: 1 }),
    zeile({ id: '2', title: 'Grundierung — Fassade', quantity: 72, unit: 'm²', unit_price: 6, total_price: 432, position: 2 }),
    zeile({ id: '3', title: 'Erschwerniszuschlag Raumhöhe > 3m — Raum', quantity: 15, unit: '%', unit_price: 0, total_price: 0, position: 3 }),
    zeile({ id: '4', title: 'Voranstrich / Grundierung', quantity: 0, unit: 'Stück', unit_price: 25, total_price: 0, position: 4 }),
    zeile({ id: '5', title: 'Gerüst stellen und abbauen', quantity: 1, unit: 'Pauschale', unit_price: 450, total_price: 450, position: 5 }),
    zeile({ id: '6', title: 'Kleinmaterial', quantity: 1, unit: 'Pauschale', unit_price: 25, total_price: 25, position: 6 }),
  ]

  it('entfernt genau die zwei Zeilen, die nichts sagen', () => {
    expect(ohneNullzeilen(entwurf).map(i => i.id)).toEqual(['1', '2', '5', '6'])
  })

  it('bewegt kein Geld — die Summe ist Cent für Cent dieselbe', () => {
    const vorher = entwurf.reduce((s, i) => s + i.total_price, 0)
    const nachher = ohneNullzeilen(entwurf).reduce((s, i) => s + i.total_price, 0)
    expect(nachher).toBe(vorher)
  })

  it('der leere Raum-Block verschwindet, die Fassade bleibt', () => {
    const vorher = gruppiereNachRaum(entwurf, ['Fassade', 'Raum'])!
    expect(vorher.raeume.map(r => r.raumName).sort()).toEqual(['Fassade', 'Raum'])

    const nachher = gruppiereNachRaum(ohneNullzeilen(entwurf), ['Fassade', 'Raum'])!
    expect(nachher.raeume.map(r => r.raumName)).toEqual(['Fassade'])
    expect(nachher.raeume[0].summe).toBe(1440)
    expect(nachher.gesamtsumme).toBe(vorher.gesamtsumme)
    expect(nachher.allgemein.map(i => i.title)).toEqual(['Gerüst stellen und abbauen', 'Kleinmaterial'])
  })
})
