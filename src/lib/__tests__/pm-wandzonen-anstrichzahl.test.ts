// Prüfmeister F.5 Punkt 2 (12.09.2026): „Anstrichzahl in JEDEN Decken-/
// Wandtitel, auch im Wandzonen-Zweig. Das ist ein Einzeiler und der teuerste
// Fehler auf dieser Seite."
//
// Sein Befund aus der 130er-Durchsicht: „Deckenfläche streichen" OHNE
// Anstrichzahl trifft `Decke streichen 1x Anstrich` (7,00 €). Der
// Wandzonen-Zweig in maler.ts schreibt die Zahl nicht in den Titel; ohne
// Zahl greift die Sperre aus Regel 1 nicht, und unter 1x/2x/3x gewinnt der
// alphabetisch erste — also der billigste. **Jede Decke in einem Angebot mit
// Farbzonen wurde zum 1x-Preis kalkuliert.** Dieselbe Fehlerklasse wie
// TN-093, nur an einer anderen Stelle.
import { describe, it, expect } from 'vitest'
import { berechneMengen } from '../mengen/engine'

const raum = (extra: Record<string, unknown> = {}) => ({
  name: 'Wohnzimmer', laenge: 5, breite: 4, hoehe: 2.5, flaeche: null, umfang: null,
  tueren: [{ anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }],
  fenster: [{ anzahl: 1, breite: 1.2, hoehe: 1.0, annahme: true }],
  arbeiten: ['waende_streichen', 'decke_streichen'],
  ...extra,
})

function titel(transkript: string, extra: Record<string, unknown> = {}) {
  const r = berechneMengen('maler', { transkript, raeume: [raum(extra)], gewerk: 'maler' })
  return r.positionen.map(p => p.beschreibung)
}

describe('Kein Streich-Titel ohne Anstrichzahl', () => {
  it('die Decke trägt ihre Anstrichzahl auch im Farbzonen-Fall', () => {
    // Zwei Farbzonen an der Wand — genau der Zweig, der die Zahl verlor.
    const alle = titel(
      'Wohnzimmer fünf mal vier, Höhe zwei fünfzig. Unten bis einen Meter dunkelblau, '
      + 'darüber weiß, alles zweimal streichen. Decke auch zweimal.',
      { wandzonen: [
        { zone: 1, hoehe: 1.0, farbe: 'Dunkelblau', aktion: 'streichen' },
        { zone: 2, hoehe: 1.5, farbe: 'Weiß', aktion: 'streichen' },
      ] },
    )
    const decke = alle.find(t => /decke streichen/i.test(t))
    expect(decke).toBeDefined()
    expect(decke).toMatch(/\d+x/)
  })

  it('auch die Zonen selbst tragen sie — und heißen nach der Leistung, nicht nach der Farbe', () => {
    const alle = titel(
      'Wohnzimmer fünf mal vier, Höhe zwei fünfzig. Unten dunkelblau, oben weiß, zweimal streichen.',
      { wandzonen: [
        { zone: 1, hoehe: 1.0, farbe: 'Dunkelblau', aktion: 'streichen' },
        { zone: 2, hoehe: 1.5, farbe: 'Weiß', aktion: 'streichen' },
      ] },
    )
    const zonen = alle.filter(t => /wand streichen/i.test(t))
    expect(zonen.length).toBeGreaterThanOrEqual(2)
    for (const z of zonen) expect(z).toMatch(/wand streichen \d+x/i)
    // Der Farbton bleibt sichtbar — aber in der Klammer, wo er den
    // Preisvergleich nicht stört (Farbtöne sind laut Prüfmeister
    // ausdrücklich KEIN Aufwandswort).
    expect(zonen.some(z => /dunkelblau/i.test(z))).toBe(true)
    // Und kein Titel heißt mehr einfach nach der Farbe.
    expect(alle.some(t => /^dunkelblau streichen/i.test(t))).toBe(false)
  })

  it('der normale Zweig (ohne Farbzonen) bleibt unverändert', () => {
    const alle = titel('Wohnzimmer fünf mal vier, Höhe zwei fünfzig, Wände und Decke zweimal streichen.')
    expect(alle.find(t => /decke streichen/i.test(t))).toMatch(/\d+x/)
  })
})
