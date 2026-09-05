import { describe, it, expect } from 'vitest'
import { bodenEngine } from '../gewerke/boden'

// ── PM-032, Auftrag des Prüfmeisters vom 04.09.2026 ───────────────────────
//
// Dreimal dasselbe Diktat, zweimal „Klick-Vinyl · 16,00 €/m²", einmal
// „Vinyl-Boden · 22,00 €/m²". Die Mengen stimmten jedes Mal. Instabil war
// allein, was das Modell ins Belagfeld schrieb: mal „klick-vinyl", mal nur
// „vinyl".
//
// Der Auftrag wörtlich: „Wenn das Belagfeld nur ‚vinyl' hergibt, im
// Rohtranskript nachsehen. Steht dort ‚Klick-Vinyl', ‚Klickvinyl' oder
// ‚Klick', gilt das. Ansage vor Struktur." Dazu zwei Tests, einer in jede
// Richtung — sonst kippt der Fix und jeder Designboden wird zum Klick-System.

const raum = (name: string, laenge: number, breite: number, belag: string) => ({
  name, laenge, breite, belag, tueren: [], fenster: [], arbeiten: [`${belag} verlegen`],
})

const titel = (t: ReturnType<typeof bodenEngine>) =>
  t.positionen.filter(p => /verlegen/i.test(p.beschreibung)).map(p => p.beschreibung)

describe('PM-032 — Belagfeld instabil, Ansage schlägt Struktur', () => {
  it('Belagfeld „vinyl" + „Klick-Vinyl" im Transkript → Klick-Vinyl', () => {
    // Genau der Lauf, der danebenging.
    const e = bodenEngine({
      transkript: 'Erdgeschosswohnung, Flur 6 x 1,20, Wohnzimmer 5 x 4, Küche 3 x 2,80. '
        + 'Überall dasselbe Klick-Vinyl, gerade verlegt.',
      raeume: [raum('Flur', 6, 1.2, 'vinyl'), raum('Wohnzimmer', 5, 4, 'vinyl'), raum('Küche', 3, 2.8, 'vinyl')],
    })
    expect(titel(e)).toEqual([
      'Klick-Vinyl verlegen inkl. 5% Verschnitt — Flur',
      'Klick-Vinyl verlegen inkl. 5% Verschnitt — Wohnzimmer',
      'Klick-Vinyl verlegen inkl. 5% Verschnitt — Küche',
    ])
  })

  it('Belagfeld „vinyl" ohne „klick" im Transkript → bleibt Vinyl-Boden', () => {
    // Die Gegenrichtung: sonst wird jeder Designboden zum Klick-System.
    const e = bodenEngine({
      transkript: 'Wohnzimmer 5 x 4, Vinylboden vollflächig verklebt, gerade verlegt.',
      raeume: [raum('Wohnzimmer', 5, 4, 'vinyl')],
    })
    expect(titel(e)).toEqual(['Vinyl-Boden verlegen inkl. 5% Verschnitt — Wohnzimmer'])
  })

  it('auch die Kurzform „Klick" allein zählt', () => {
    const e = bodenEngine({
      transkript: 'Wohnzimmer 5 x 4, das Klick-System kommt rein, gerade verlegt.',
      raeume: [raum('Wohnzimmer', 5, 4, 'vinyl')],
    })
    expect(titel(e)[0]).toContain('Klick-Vinyl')
  })

  it('verhörtes „Klickvenü" zählt ebenfalls', () => {
    const e = bodenEngine({
      transkript: 'Wohnzimmer 5 x 4, überall Klickvenü verlegen.',
      raeume: [raum('Wohnzimmer', 5, 4, 'vinyl')],
    })
    expect(titel(e)[0]).toContain('Klick-Vinyl')
  })

  it('ein sauberes Belagfeld bleibt unangetastet — der Text muss gar nichts sagen', () => {
    const e = bodenEngine({
      transkript: 'Wohnzimmer 5 x 4, Boden neu.',
      raeume: [raum('Wohnzimmer', 5, 4, 'klick-vinyl')],
    })
    expect(titel(e)[0]).toContain('Klick-Vinyl')
  })

  it('ein anderer Belag wird von „klick" im Text nicht angefasst', () => {
    const e = bodenEngine({
      transkript: 'Wohnzimmer 5 x 4, Klick-Vinyl war mal geplant, jetzt kommt Eichenparkett.',
      raeume: [raum('Wohnzimmer', 5, 4, 'eichenparkett')],
    })
    expect(titel(e)[0]).toContain('Fertigparkett')
  })
})

describe('PM-032 — der Rückfall bleibt raumweise', () => {
  it('gemischter Auftrag: nur der Raum mit der Ansage wird Klick', () => {
    // Über das GANZE Transkript gelesen würde die Küche mitgerissen — genau
    // die Fehlerfamilie, die diese Woche viermal aufgetaucht ist.
    const e = bodenEngine({
      transkript: 'In der Küche wird Vinyl vollflächig verklebt, im Wohnzimmer kommt Klick-Vinyl rein.',
      raeume: [raum('Küche', 3, 2.8, 'vinyl'), raum('Wohnzimmer', 5, 4, 'vinyl')],
    })
    expect(titel(e)).toEqual([
      'Vinyl-Boden verlegen inkl. 5% Verschnitt — Küche',
      'Klick-Vinyl verlegen inkl. 5% Verschnitt — Wohnzimmer',
    ])
  })
})
