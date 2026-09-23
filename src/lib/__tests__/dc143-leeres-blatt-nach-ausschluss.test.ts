import { describe, it, expect } from 'vitest'
import { beurteileLeeresErgebnis, KEINE_POSITIONEN } from '../leeres-ergebnis'
import { zeitAusschlussHinweis } from '../zeit-ausschluss'
import { bauteilAusschlussHinweis, bauteilUnklarHinweis } from '../bauteil-ausschluss'

// ── DC-143 · PD-026: das leere Blatt sagt nicht mehr „Keine Positionen erkannt" ─
//
// Der Fall des Prüfmeisters (23.09.2026), über die volle Pipeline gemessen:
//
//   „Wohnzimmer, 5 mal 4, Höhe 2,50. An den Wänden machen wir nichts.
//    Wände und Decke weiß."
//
// Die Bauteil-Bremse nimmt die Wand weg, mit ihr fallen `Boden schützen` und
// `Sockelleisten abkleben` als Folgepositionen. Übrig: null Positionen,
// 0,00 €. `generiere-positionen` bricht bei `positionen.length === 0` mit
// 400 „Keine Positionen erkannt" ab — obwohl die Maschine alles erkannt,
// gerechnet UND den Grund fertig dastehen hat.
//
// Zugesichert wird hier die Entscheidung aus DC-143, nicht ihre Darstellung:
//
//   Nr. 1–2 · Eine Zeile, die etwas WEGNIMMT, erklärt das leere Blatt. Ohne
//     diese Zusicherung fällt der Fall zurück in den roten Satz, und zwar
//     stumm — niemand merkt es, bis ein Betrieb ein zweites Mal dasselbe
//     diktiert.
//   Nr. 3 · Die Rückfrage (PM-136) sagt „bleiben im Angebot" — sie nimmt
//     nichts weg und darf deshalb NIE der Grund für ein leeres Blatt sein.
//     Sonst stünde über dem leeren Blatt eine Begründung, die es nicht
//     begründet. Das ist die teuerste Verwechslung in dieser Regel.
//   Nr. 4 · Sie darf aber MITFAHREN, wenn ein echter Ausschluss danebensteht:
//     sie gehört zum selben Diktat und steht oben (DC-142).
//   Nr. 5–7 · Die Gegenproben von PD-019 gelten unverändert weiter: offene
//     Rückfrage, fehlender Preis und ein fremder Fehlertext gehen vor.
//     DC-143 darf keinen davon verdecken.
//   Nr. 8 · Ohne mitgeschickte Hinweise bleibt alles wie vor DC-143.

const WAND_WEG = bauteilAusschlussHinweis('Wohnzimmer', ['wand'], 'An den Wänden machen wir nichts')
const RAUM_WEG = zeitAusschlussHinweis('Küche', 'Die Küche machen wir später')
const RUECKFRAGE = bauteilUnklarHinweis(['wand'], 'An den Wänden machen wir nichts')

const BASIS = {
  fehlerText: KEINE_POSITIONEN,
  anzahlFehlendePreise: 0,
  fragen: [] as Array<{ id: string; frage: string }>,
  antworten: {},
}

describe('DC-143 — null Positionen, weil eine Bremse gegriffen hat', () => {
  it('1 · Bauteil-Ausschluss: das leere Blatt bekommt seinen Grund statt des roten Satzes', () => {
    const befund = beurteileLeeresErgebnis({ ...BASIS, hinweise: [WAND_WEG] })
    expect(befund).toEqual({ art: 'alles_ausgeschlossen', hinweise: [WAND_WEG] })
  })

  it('2 · Zeit-Ausschluss (ein ganzer Raum) trägt denselben Fall', () => {
    const befund = beurteileLeeresErgebnis({ ...BASIS, hinweise: [RAUM_WEG] })
    expect(befund).toEqual({ art: 'alles_ausgeschlossen', hinweise: [RAUM_WEG] })
  })

  it('3 · die Rückfrage allein löst NICHT aus — sie sagt, dass nichts entfernt wurde', () => {
    expect(beurteileLeeresErgebnis({ ...BASIS, hinweise: [RUECKFRAGE] })).toEqual({ art: 'fehler' })
  })

  it('4 · neben einem echten Ausschluss fährt sie mit — und steht oben (DC-142)', () => {
    const befund = beurteileLeeresErgebnis({ ...BASIS, hinweise: [WAND_WEG, RUECKFRAGE] })
    expect(befund).toEqual({ art: 'alles_ausgeschlossen', hinweise: [RUECKFRAGE, WAND_WEG] })
  })

  it('5 · eine offen gebliebene Rückfrage geht vor (PD-019 bleibt unverändert)', () => {
    const befund = beurteileLeeresErgebnis({
      ...BASIS,
      fragen: [{ id: 'raum_Wohnzimmer_masse', frage: 'Wie groß ist das Wohnzimmer?' }],
      hinweise: [WAND_WEG],
    })
    expect(befund).toEqual({ art: 'offene_angaben', fragen: ['Wie groß ist das Wohnzimmer?'] })
  })

  it('6 · ein fehlender Preis hat seinen eigenen, präzisen Text und wird nie verdeckt', () => {
    expect(beurteileLeeresErgebnis({
      ...BASIS,
      anzahlFehlendePreise: 1,
      hinweise: [WAND_WEG],
    })).toEqual({ art: 'fehler' })
  })

  it('7 · ein fremder Fehlertext bleibt ein Fehler, auch mit Hinweisen daneben', () => {
    expect(beurteileLeeresErgebnis({
      ...BASIS,
      fehlerText: 'Preisberechnung fehlgeschlagen: 500',
      hinweise: [WAND_WEG],
    })).toEqual({ art: 'fehler' })
  })

  it('8 · ohne mitgeschickte Hinweise verhält sich alles wie vor DC-143', () => {
    expect(beurteileLeeresErgebnis(BASIS)).toEqual({ art: 'fehler' })
    expect(beurteileLeeresErgebnis({ ...BASIS, hinweise: [] })).toEqual({ art: 'fehler' })
  })

  it('9 · ein Maß-Hinweis ist kein Ausschluss — eine geradegerückte Zahl erklärt kein leeres Blatt', () => {
    expect(beurteileLeeresErgebnis({
      ...BASIS,
      hinweise: ['Wohnzimmer: Höhe 350 m wirkt unrealistisch für einen Innenraum — bitte kurz prüfen.'],
    })).toEqual({ art: 'fehler' })
  })
})
