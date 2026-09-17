import { describe, it, expect } from 'vitest'
import { beurteileLeeresErgebnis, KEINE_POSITIONEN } from '../leeres-ergebnis'

// PD-019 Punkt 1 (Prüfmeister, 16.09.2026, PM-113):
// „Wohnzimmer streichen." → null Positionen, `fehlende` leer. Der Betrieb
// bekam ein leeres Blatt und den Satz „Keine Positionen erkannt" — in genau
// diesem Fall unwahr.
//
// Der teuerste Fehler bei dieser Regel wäre, zu viel einzufangen: der
// präzise Text „Preis fehlt in deiner Preisdatenbank: …" und das ehrliche
// „nichts verstanden" dürfen nicht von der neuen Karte verdeckt werden.
// Deshalb stehen die Gegenproben hier direkt neben dem Positivfall.

const RAUMFRAGE = { id: 'raum_Wohnzimmer_masse', frage: 'Wie groß ist das Wohnzimmer?' }
const HOEHENFRAGE = { id: 'raum_Wohnzimmer_hoehe', frage: 'Wie hoch ist das Wohnzimmer?' }

describe('PM-113 — gehört, aber nicht rechenbar', () => {
  it('übersprungene Maßfrage: die Frage kommt im Wortlaut zurück, nicht der rote Satz', () => {
    expect(beurteileLeeresErgebnis({
      fehlerText: KEINE_POSITIONEN,
      anzahlFehlendePreise: 0,
      fragen: [RAUMFRAGE],
      antworten: {},
    })).toEqual({ art: 'offene_angaben', fragen: ['Wie groß ist das Wohnzimmer?'] })
  })

  it('bewusst übersprungen (PM-007: `null`) zählt wie unbeantwortet', () => {
    expect(beurteileLeeresErgebnis({
      fehlerText: KEINE_POSITIONEN,
      anzahlFehlendePreise: 0,
      fragen: [RAUMFRAGE],
      antworten: { raum_Wohnzimmer_masse: null },
    })).toEqual({ art: 'offene_angaben', fragen: ['Wie groß ist das Wohnzimmer?'] })
  })

  it('mehrere offene Fragen kommen in der gestellten Reihenfolge, beantwortete fallen raus', () => {
    const befund = beurteileLeeresErgebnis({
      fehlerText: KEINE_POSITIONEN,
      anzahlFehlendePreise: 0,
      fragen: [RAUMFRAGE, HOEHENFRAGE],
      antworten: { raum_Wohnzimmer_hoehe: { wert: 2.5, einheit: 'm' } },
    })
    expect(befund).toEqual({ art: 'offene_angaben', fragen: ['Wie groß ist das Wohnzimmer?'] })
  })
})

describe('Gegenproben — wo die Karte NICHT greifen darf', () => {
  it('wirklich nichts verstanden (keine Rückfrage gestellt): bleibt beim bisherigen Weg', () => {
    expect(beurteileLeeresErgebnis({
      fehlerText: KEINE_POSITIONEN,
      anzahlFehlendePreise: 0,
      fragen: [],
      antworten: {},
    })).toEqual({ art: 'fehler' })
  })

  it('alle Rückfragen beantwortet und trotzdem nichts gerechnet: bleibt beim bisherigen Weg', () => {
    expect(beurteileLeeresErgebnis({
      fehlerText: KEINE_POSITIONEN,
      anzahlFehlendePreise: 0,
      fragen: [RAUMFRAGE],
      antworten: { raum_Wohnzimmer_masse: { wert: [4, 5], einheit: 'm' } },
    })).toEqual({ art: 'fehler' })
  })

  it('fehlender Datenbankpreis behält seinen eigenen, präzisen Text', () => {
    expect(beurteileLeeresErgebnis({
      fehlerText: KEINE_POSITIONEN,
      anzahlFehlendePreise: 2,
      fragen: [RAUMFRAGE],
      antworten: {},
    })).toEqual({ art: 'fehler' })
  })

  it('jeder andere Fehlertext (Netzwerk, Raummaße, 500) bleibt unangetastet', () => {
    expect(beurteileLeeresErgebnis({
      fehlerText: 'Raummaße konnten nicht gespeichert werden',
      anzahlFehlendePreise: 0,
      fragen: [RAUMFRAGE],
      antworten: {},
    })).toEqual({ art: 'fehler' })
  })

  it('eine leere Fragestellung erzeugt keine leere Zeile auf der Karte', () => {
    expect(beurteileLeeresErgebnis({
      fehlerText: KEINE_POSITIONEN,
      anzahlFehlendePreise: 0,
      fragen: [{ id: 'kaputt', frage: '   ' }],
      antworten: {},
    })).toEqual({ art: 'fehler' })
  })
})
