// Rohtext-Audit (Sandys Auftrag nach PM-026, 2026-08-30).
//
// Grundsatz: Regeln, die den ROHEN Transkript-Text lesen, dürfen nicht darüber
// entscheiden, ob eine Position entsteht, wenn die strukturierte Erkennung
// etwas anderes sagt. Whisper verhört sich zwangsläufig — ein Buchstabe darf
// nicht die Hauptposition eines Angebots kosten (PM-026: „Bände" statt
// „Wände"). Ausdrückliche Einschränkungen des Nutzers behalten Vorrang.
import { describe, expect, it } from 'vitest'
import { malerEngine } from '../gewerke/maler'
import { pruefeUndErgaenzeVollstaendigkeit } from '@/lib/vollstaendigkeit'
import type { BerechnetePosition } from '../types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const titel = (raeume: any[], transkript: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  malerEngine({ gewerk: 'maler', raeume, transkript } as any).positionen.map(p => p.beschreibung)

const WOHNZIMMER = {
  name: 'Wohnzimmer', laenge: 5, breite: 4, hoehe: 2.6, flaeche: 20,
  fenster: [], tueren: [{ anzahl: 1 }], arbeiten: ['wände streichen'],
}
const KELLER = {
  name: 'Keller', laenge: 3, breite: 3, hoehe: 2.2, flaeche: 9,
  fenster: [], tueren: [{ anzahl: 1 }], arbeiten: ['wände streichen'],
}

describe('Rohtext-Rangordnung — ein Signal aus einem Raum färbt nicht auf die anderen ab', () => {
  it('nimmt dem Wohnzimmer nicht die Sockelleisten, nur weil ein Keller mit im Angebot ist', () => {
    const t = titel([WOHNZIMMER, KELLER], 'Wohnzimmer 5 mal 4 Meter, 2,60 hoch, Wände streichen. Keller 3 mal 3 Meter, 2,20 hoch, Wände streichen.')
    expect(t).toContain('Sockelleisten abkleben — Wohnzimmer')
    // Im Keller selbst bleibt die Sonderregel bestehen.
    expect(t).not.toContain('Sockelleisten abkleben — Keller')
  })

  it('behält die Keller-Regel, wenn der Keller der einzige Raum ist', () => {
    const t = titel([KELLER], 'Keller 3 mal 3 Meter, 2,20 hoch, Wände streichen.')
    expect(t.some(b => /sockelleisten abkleben/i.test(b))).toBe(false)
  })

  it('rechnet die Wandfläche auch dann, wenn das Wandwort im Transkript verhört wurde', () => {
    // Strukturiert steht „wände streichen" — der Rohtext kennt nur „Bände".
    const t = titel([WOHNZIMMER], 'Wohnzimmer 5 mal 4 Meter, 2,60 hoch, Bände streichen, Decke auch.')
    expect(t.some(b => /wandfl/i.test(b))).toBe(true)
  })
})

describe('Rohtext-Rangordnung — der globale Scope löscht keine Positionen mehr auf Verdacht', () => {
  const positionen: BerechnetePosition[] = [
    { beschreibung: 'Wandflächen streichen 2x — Küche', menge: 39, einheit: 'm²', konfidenz: 'high', berechnungsweg: '15,6 × 2,5', annahmen: [] },
    { beschreibung: 'Deckenfläche streichen 1x — Küche', menge: 15.12, einheit: 'm²', konfidenz: 'high', berechnungsweg: '4,2 × 3,6', annahmen: [] },
  ]

  it('behält die Wandposition, obwohl der Rohtext kein Wandwort enthält', () => {
    const { positionen: ergebnis } = pruefeUndErgaenzeVollstaendigkeit(
      'maler', positionen,
      'Küche 4,20 x 3,60, Höhe 2,50, Bände zweimal streichen, Decke reicht einmal.',
      undefined,
      { arbeitenTexte: ['wände streichen', 'decke streichen'], raeume: [{ name: 'Küche', arbeiten: ['wände streichen', 'decke streichen'] }] },
    )
    expect(ergebnis.some(p => /wandfl/i.test(p.beschreibung))).toBe(true)
  })

  it('respektiert weiterhin ein ausdrückliches „nur die Decke"', () => {
    const { positionen: ergebnis } = pruefeUndErgaenzeVollstaendigkeit(
      'maler', positionen,
      'Küche 4,20 x 3,60, Höhe 2,50, nur die Decke streichen.',
      undefined,
      { arbeitenTexte: ['decke streichen'], raeume: [{ name: 'Küche', arbeiten: ['decke streichen'] }] },
    )
    expect(ergebnis.some(p => /wandfl/i.test(p.beschreibung))).toBe(false)
  })
})
