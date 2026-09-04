// PM-026 (Sandys Live-Test, 2026-08-30): Im fertigen Angebot fehlten
// „Wandflächen streichen" (39 m²) und „Sockelleisten abkleben" (15,6 lfdm, VOB-012)
// komplett — die Hauptpositionen eines Malerauftrags.
//
// Ursache: Whisper transkribierte „Wände zweimal streichen" als „BÄNDE zweimal
// streichen". Die schwächste Scope-Regel („eine Fläche wurde genannt, die
// andere nicht") liest den Rohtext, fand kein Wandwort, wohl aber „Decke" —
// und schloss daraus „nur Decke". Die strukturierte Extraktion hatte
// „wände streichen" korrekt erkannt und wurde überstimmt.
import { describe, expect, it } from 'vitest'
import { malerEngine } from '../gewerke/maler'

const KUECHE = {
  name: 'Küche', laenge: 4.2, breite: 3.6, hoehe: 2.5, flaeche: 15.12,
  tueren: [{ anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }],
  fenster: [{ anzahl: 2, breite: 1.2, hoehe: 1, annahme: true }],
  arbeiten: ['wände streichen', 'decke streichen', 'boden abdecken', 'sockelleisten abkleben'],
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function positionen(raum: any, transkript: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return malerEngine({ gewerk: 'maler', raeume: [raum], transkript } as any).positionen
    .map(p => p.beschreibung)
}

describe('PM-026 — ein Verhörer im Transkript darf keine Position löschen', () => {
  it('rechnet die Wandfläche, obwohl das Transkript „Bände" statt „Wände" sagt', () => {
    const beschreibungen = positionen(
      KUECHE,
      'Küche 4,20 m x 3,60 m, Höhe 2,50 m, Bände zweimal streichen, Decke reicht einmal, zwei Fenster Standardmaß, eine Tür normal.',
    )
    expect(beschreibungen).toContain('Wandflächen streichen 2x — Küche')
    expect(beschreibungen).toContain('Sockelleisten abkleben — Küche')
  })

  it('liefert dabei exakt die Soll-Mengen des Testfalls', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pos = malerEngine({ gewerk: 'maler', raeume: [KUECHE],
      transkript: 'Küche 4,20 m x 3,60 m, Höhe 2,50 m, Bände zweimal streichen, Decke reicht einmal.' } as any).positionen
    // Umfang 15,60 lfm × 2,50 m = 39,00 m² (Öffnungen ≤ 2,5 m² → VOB-Übermessung)
    expect(pos.find(p => /wandfl/i.test(p.beschreibung))?.menge).toBe(39)
    // 15,60 lfm − 0,90 m Türbreite
    expect(pos.find(p => /sockelleisten abkleben/i.test(p.beschreibung))?.menge).toBe(15.6) // VOB-012 (CoS-042): Tür 0,90 m nicht abgezogen
  })

  it('respektiert weiterhin ein ausdrückliches „nur die Decke"', () => {
    const beschreibungen = positionen(
      { ...KUECHE, arbeiten: ['wände streichen', 'decke streichen'] },
      'Küche 4,20 mal 3,60, Höhe 2,50, nur die Decke streichen.',
    )
    expect(beschreibungen.some(b => /wandfl/i.test(b))).toBe(false)
    expect(beschreibungen.some(b => /deckenfl/i.test(b))).toBe(true)
  })

  it('respektiert weiterhin ein ausdrückliches „ohne Decke"', () => {
    const beschreibungen = positionen(
      { ...KUECHE, arbeiten: ['wände streichen', 'decke streichen'] },
      'Küche 4,20 mal 3,60, Höhe 2,50, Wände streichen, ohne Decke.',
    )
    expect(beschreibungen.some(b => /deckenfl/i.test(b))).toBe(false)
    expect(beschreibungen.some(b => /wandfl/i.test(b))).toBe(true)
  })

  it('lässt die schwache Regel wirken, wenn die Arbeiten-Liste nichts anderes sagt', () => {
    // Kein Wandeintrag in arbeiten[] → das Nicht-Erwähnen darf weiterhin
    // einschränken, sonst wäre der Schutz eine Blanko-Erlaubnis.
    const beschreibungen = positionen(
      { ...KUECHE, arbeiten: ['decke streichen'] },
      'Küche 4,20 mal 3,60, Höhe 2,50, Decke streichen.',
    )
    expect(beschreibungen.some(b => /wandfl/i.test(b))).toBe(false)
  })
})
