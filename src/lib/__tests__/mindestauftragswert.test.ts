import { describe, it, expect } from 'vitest'
import {
  mindestauftragsPosition, MINDESTAUFTRAG_BEZEICHNUNG, MINDESTAUFTRAGSWERT_VORSCHLAG,
} from '../gewerke-config'

// ── Mindestauftragswert (CoS + Sandy, 07.09.2026) ────────────────────────
//
// Ausgelöst vom Prüfmeister: „Wer nur die Außenleibungen streicht, verbringt
// einen halben Tag mit Gerüst, Abdecken und Wetter — für 1,60 m². Da ist nicht
// der Satz zu klein, da ist die Positionsform falsch."
//
// Die Einstellung `companies.mindestauftragswert` existierte seit Langem und
// wurde NIRGENDS gelesen — die Einstellungsseite versprach sogar eine Warnung,
// die es nie gab. Dieselbe Familie wie „X Positionen erkannt": Die Oberfläche
// verspricht, der Code schweigt.

describe('Mindestauftragswert — der Originalfall', () => {
  // 1,60 m² Außenleibungen × 45,00 € = 72,00 €. Bei 180 € Schwelle fehlen 108 €.
  it('72,00 € Auftrag bei 180 € Schwelle → 108,00 € Differenz', () => {
    const p = mindestauftragsPosition(72, 180)
    expect(p?.title).toBe('Anfahrt & Vorbereitung')
    expect(p?.unit_price).toBe(108)
    expect(p?.quantity).toBe(1)
    expect(p?.unit).toBe('Pauschale')
  })

  // Sandys Wortlaut: beschreibt den echten Aufwand, statt nach Strafgebühr zu
  // klingen. Legal hatte „liest sich wie eine Strafgebühr" moniert.
  it('heißt nicht „Zuschlag" oder „Mindestauftragswert"', () => {
    expect(MINDESTAUFTRAG_BEZEICHNUNG).toBe('Anfahrt & Vorbereitung')
    expect(MINDESTAUFTRAG_BEZEICHNUNG).not.toMatch(/zuschlag|gebühr|mindest/i)
  })

  // Head of Legal: kein stiller Aufschlag auf die m²-Preise, sondern eine
  // eigene Zeile — sonst ist das Aufmaß nicht mehr nachrechenbar (VOB-007)
  // und es entsteht ein § 5a-UWG-Risiko.
  it('nennt den Schwellenwert im Text, damit die Zeile nachvollziehbar ist', () => {
    expect(mindestauftragsPosition(72, 180)?.description).toMatch(/180/)
    expect(mindestauftragsPosition(72, 180)?.description).toMatch(/netto/)
  })
})

describe('Wann die Position NICHT entsteht', () => {
  it('nicht ohne gesetzten Wert — 0 heißt aus', () => {
    expect(mindestauftragsPosition(72, 0)).toBeNull()
    expect(mindestauftragsPosition(72, null)).toBeNull()
    expect(mindestauftragsPosition(72, undefined)).toBeNull()
  })

  it('nicht, wenn der Auftrag die Schwelle erreicht', () => {
    expect(mindestauftragsPosition(180, 180)).toBeNull()
    expect(mindestauftragsPosition(1200, 180)).toBeNull()
  })

  // Ein leeres Angebot ist kein Kleinauftrag, sondern ein leeres Angebot —
  // sonst stünde auf einer noch leeren Aufnahme plötzlich eine 180-€-Zeile.
  it('nicht auf einem leeren Angebot', () => {
    expect(mindestauftragsPosition(0, 180)).toBeNull()
    expect(mindestauftragsPosition(-5, 180)).toBeNull()
  })
})

describe('Die Zeile darf sich nicht selbst tragen', () => {
  // Sie zählt nicht in ihre eigene Bemessungsgrundlage: Gerechnet wird die
  // Arbeitssumme ohne sie. Sonst höbe sie sich selbst über die Schwelle und
  // verschwände beim nächsten Durchlauf — die Summe würde hin- und herspringen.
  it('mit der eigenen Zeile mitgerechnet käme null heraus — deshalb ohne', () => {
    const erst = mindestauftragsPosition(72, 180)
    expect(erst?.unit_price).toBe(108)
    // So sähe der zweite Durchlauf aus, wenn man 72 + 108 einsetzte:
    expect(mindestauftragsPosition(72 + 108, 180)).toBeNull()
    // Richtig ist, weiterhin nur die Arbeitssumme zu übergeben:
    expect(mindestauftragsPosition(72, 180)?.unit_price).toBe(108)
  })

  it('wächst der Auftrag, schrumpft die Differenz', () => {
    expect(mindestauftragsPosition(100, 180)?.unit_price).toBe(80)
    expect(mindestauftragsPosition(179.5, 180)?.unit_price).toBe(0.5)
  })

  it('rechnet auf zwei Nachkommastellen', () => {
    expect(mindestauftragsPosition(72.333, 180)?.unit_price).toBe(107.67)
  })
})

describe('Der Vorschlagswert', () => {
  // Legal: 180 € ≈ drei Arbeitsstunden bei 55–65 €/h. Regional liegen die
  // Stundensätze zwischen 44 € (MV) und 90 € (BY/BW) — deshalb ein
  // Vorschlagswert und keine Konstante im Code.
  it('ist 180 € und bleibt ein Vorschlag, keine Grenze', () => {
    expect(MINDESTAUFTRAGSWERT_VORSCHLAG).toBe(180)
    // Ein Betrieb mit einem anderen Wert bekommt genau seinen.
    expect(mindestauftragsPosition(72, 260)?.unit_price).toBe(188)
    expect(mindestauftragsPosition(72, 100)?.unit_price).toBe(28)
  })
})

// ── Migration 20260907140000: NULL = nie eingestellt ──────────────────────
//
// Sandys Freigabe vom 07.09.: Die Spalte unterscheidet jetzt „nie eingestellt"
// (NULL, Formular schlägt 180 € vor) von „bewusst aus" (0). Vorher war beides
// derselbe Zustand — ein Vorschlagswert hätte bestehenden Betrieben ungefragt
// Geld in die Angebote gerechnet.
//
// Für die Berechnung bleiben beide gleich: kein Wert, keine Position. Das ist
// die Sicherung, damit die Migration selbst nichts an bestehenden Angeboten
// ändert.
describe('NULL und 0 verhalten sich in der Rechnung identisch', () => {
  it('beide erzeugen keine Position — die Migration ändert nichts an Bestandsangeboten', () => {
    expect(mindestauftragsPosition(72, null)).toBeNull()
    expect(mindestauftragsPosition(72, 0)).toBeNull()
  })

  // Der Unterschied liegt allein im Formular: Bei NULL steht 180 € im Feld,
  // bei 0 bleibt es aus. Ein Test dafür gehört in die Einstellungsseite; hier
  // wird nur festgehalten, dass die Rechenregel den Unterschied NICHT kennt —
  // genau das macht die Umstellung ungefährlich.
  it('der Vorschlagswert wirkt erst, wenn er gespeichert wurde', () => {
    expect(mindestauftragsPosition(72, MINDESTAUFTRAGSWERT_VORSCHLAG)?.unit_price).toBe(108)
  })
})
