import { describe, it, expect } from 'vitest'
import { findePreisposition, type PreisPosition } from '../preis-matcher'

// ── PM-018, zweiter Durchgang (Prüfmeister, 04.09.2026) ───────────────────
//
// „Spachtelarbeiten Q3" (39,00 m²) bekam 9,00 €/m² — den Q2-Preis.
// „Spachtelarbeiten Q3 Decke" (14,00 m²) bekam gar keinen Treffer.
//
// Der Widerspruch war der Beweis: Fehlt Q3 in der Preisliste, müssten BEIDE
// „Preis fehlt" zeigen. Dass eine 9,00 € bekam, heißt, sie ist auf den
// Q2-Eintrag ausgewichen — 195,00 € für Arbeit, die der Betrieb macht.
//
// Die Regel des Prüfmeisters: „Trägt eine Position eine Qualitäts- oder
// Ausführungsstufe im Titel, darf der Preis-Matcher niemals auf einen Eintrag
// mit einer ANDEREN Stufe ausweichen. Lieber sichtbar kein Preis als still
// der falsche."

const p = (id: string, title: string, unit_price: number): PreisPosition =>
  ({ id, title, category: 'Maler – Untergrundvorbereitung', unit: 'm²', unit_price })

// Sandys Lage: Q2 hinterlegt, Q3 nicht.
const NUR_Q2 = [p('1', 'Fläche spachteln (Q2)', 9.00)]
const BEIDE = [p('1', 'Fläche spachteln (Q2)', 9.00), p('2', 'Fläche feinspachteln (Q3, streichfertig)', 14.00)]

describe('PM-018 — ein Q3-Titel zieht nie einen Q2-Preis', () => {
  it('ohne Q3 im Katalog: sichtbar kein Preis statt still 9,00 €', () => {
    expect(findePreisposition('Spachtelarbeiten Q3 — Arbeitszimmer', 'm²', NUR_Q2)).toBeNull()
  })

  it('auch die Deckenzeile bleibt ohne Preis — nicht nur zufällig', () => {
    expect(findePreisposition('Spachtelarbeiten Q3 Decke — Arbeitszimmer', 'm²', NUR_Q2)).toBeNull()
  })

  it('mit Q3 im Katalog trifft beides den Q3-Preis', () => {
    expect(findePreisposition('Spachtelarbeiten Q3 — Arbeitszimmer', 'm²', BEIDE)?.position.unit_price).toBe(14.00)
    expect(findePreisposition('Spachtelarbeiten Q3 Decke — Arbeitszimmer', 'm²', BEIDE)?.position.unit_price).toBe(14.00)
  })

  it('ein Q2-Titel trifft weiterhin Q2 — die Sperre wirkt in beide Richtungen', () => {
    expect(findePreisposition('Spachtelarbeiten Q2 — Arbeitszimmer', 'm²', BEIDE)?.position.unit_price).toBe(9.00)
  })

  it('Q4 nimmt nicht ersatzweise Q3', () => {
    expect(findePreisposition('Spachtelarbeiten Q4 — Arbeitszimmer', 'm²', BEIDE)).toBeNull()
  })
})

describe('PM-018 — ein Eintrag OHNE Stufe darf weiterhin einspringen', () => {
  // Dieselbe Systematik wie bei den Anstrichzahlen (Regel 3): Ein
  // Katalogeintrag ohne Stufenangabe ist der eigene Preis des Betriebs für
  // genau diese Arbeit. Ihn zu ignorieren wäre keine Vorsicht, sondern
  // Verlust. Nur eine ANDERE Stufe ist gesperrt.
  const OHNE_STUFE = [p('1', 'Fläche spachteln (Flächenspachtel)', 9.00)]

  it('Q3-Titel nimmt den stufenlosen Eintrag', () => {
    expect(findePreisposition('Spachtelarbeiten Q3 — Arbeitszimmer', 'm²', OHNE_STUFE)?.position.unit_price).toBe(9.00)
  })

  it('… aber eine passende Stufe gewinnt gegen den stufenlosen Eintrag', () => {
    const gemischt = [...OHNE_STUFE, p('2', 'Fläche feinspachteln (Q3, streichfertig)', 14.00)]
    expect(findePreisposition('Spachtelarbeiten Q3 — Arbeitszimmer', 'm²', gemischt)?.position.unit_price).toBe(14.00)
  })
})

describe('PM-018 — das Flächen-Suffix darf den Abgleich nicht kippen', () => {
  it('„… Decke" findet denselben Eintrag wie die Wandzeile', () => {
    const wand = findePreisposition('Spachtelarbeiten Q3 — Raum', 'm²', BEIDE)
    const decke = findePreisposition('Spachtelarbeiten Q3 Decke — Raum', 'm²', BEIDE)
    expect(decke?.position.id).toBe(wand?.position.id)
  })

  it('der Rückfall hebelt die Stufen-Sperre nicht aus', () => {
    expect(findePreisposition('Spachtelarbeiten Q3 Decke — Raum', 'm²', NUR_Q2)).toBeNull()
  })
})

describe('Die Anstrichregel bleibt unangetastet', () => {
  const ANSTRICH = [
    p('1', 'Wand streichen 1x Anstrich', 6.00),
    p('2', 'Wand streichen 2x Anstrich', 11.50),
  ]
  it('2x nimmt nie den 1x-Preis', () => {
    expect(findePreisposition('Wandflächen streichen 2x — Raum', 'm²', ANSTRICH)?.position.unit_price).toBe(11.50)
  })
  it('1x nimmt nie den 2x-Preis', () => {
    expect(findePreisposition('Wandflächen streichen 1x — Raum', 'm²', ANSTRICH)?.position.unit_price).toBe(6.00)
  })
})
