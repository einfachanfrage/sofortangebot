// PM-023 und PM-024 (Sandys Live-Tests, 25.–30.08.2026)
import { describe, expect, it } from 'vitest'
import { pruefeUndErgaenzeVollstaendigkeit } from '@/lib/vollstaendigkeit'
import { ergaenzeNachkommaAusText } from '@/lib/extraktion-masse'
import { malerEngine } from '../gewerke/maler'
import type { BerechnetePosition } from '../types'

describe('PM-023 — Trittschalldämmung gehört zum Raum, nicht zu „Allgemein"', () => {
  const transkript = 'Flur, sechs Meter mal eins Meter achtzig, eine Tür normal Maß. Laminat, ganz normal gerade verlegt, mit Trittschalldämmung drunter. Sockelleisten neu montieren rundrum.'
  const positionen: BerechnetePosition[] = [
    { beschreibung: 'Laminat verlegen inkl. 5% Verschnitt — Flur', menge: 11.34, einheit: 'm²', konfidenz: 'high', berechnungsweg: '10.8 m² × 1.05', annahmen: [] },
    { beschreibung: 'Sockelleisten montieren — Flur', menge: 14.7, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: '15.6 − 0.9', annahmen: [] },
  ]

  it('hängt den Raum an, damit die Position beim Flur landet', () => {
    const { positionen: ergebnis } = pruefeUndErgaenzeVollstaendigkeit('boden_parkett', positionen, transkript)
    const daemmung = ergebnis.find(p => /trittschall/i.test(p.beschreibung))
    expect(daemmung?.beschreibung).toBe('Trittschalldämmung — Flur')
  })

  it('markiert sie nicht als Vorschlag — sie wurde ausdrücklich verlangt', () => {
    const { positionen: ergebnis } = pruefeUndErgaenzeVollstaendigkeit('boden_parkett', positionen, transkript)
    const daemmung = ergebnis.find(p => /trittschall/i.test(p.beschreibung))
    expect(daemmung?.automatisch_ergaenzt).toBe(false)
  })

  it('lässt die gesprochenen Ausgangspositionen unangetastet', () => {
    const { positionen: ergebnis } = pruefeUndErgaenzeVollstaendigkeit('boden_parkett', positionen, transkript)
    for (const titel of ['Laminat verlegen inkl. 5% Verschnitt — Flur', 'Sockelleisten montieren — Flur']) {
      expect(ergebnis.find(p => p.beschreibung === titel)?.automatisch_ergaenzt).toBeUndefined()
    }
  })

  it('markiert eine WIRKLICH ergänzte Position weiterhin als Vorschlag', () => {
    // Klick-Vinyl ohne ein Wort zur Dämmung: hier ergänzt das Tool von sich
    // aus — das ist der Fall, für den das Vorschlag-Etikett gedacht ist.
    const { positionen: ergebnis } = pruefeUndErgaenzeVollstaendigkeit(
      'boden_parkett',
      [{ beschreibung: 'Klick-Vinyl verlegen — Bad', menge: 21, einheit: 'm²', konfidenz: 'high', berechnungsweg: '21 m²', annahmen: [] }],
      'Bad, 21 Quadratmeter, Klick-Vinyl verlegen.',
    )
    expect(ergebnis.some(p => p.automatisch_ergaenzt === true)).toBe(true)
  })
})

describe('PM-024 — verlorene Nachkommastelle bei Einzelmaßen', () => {
  it('holt „Höhe 3 Meter, 20" als 3,20 m zurück', () => {
    expect(ergaenzeNachkommaAusText(3, 'Büro, 5 Meter mal 4 Meter, Höhe 3 Meter, 20, Wände zweimal streichen.')).toBe(3.2)
  })

  it('fasst Zahlen ohne passende Ganzzahl im Text nicht an', () => {
    expect(ergaenzeNachkommaAusText(5, 'Höhe 3 Meter, 20')).toBe(5)
    expect(ergaenzeNachkommaAusText(4, 'Flur 4 Meter, 3 Türen')).toBe(4)
    expect(ergaenzeNachkommaAusText(2.5, 'Höhe 2,50 m')).toBe(2.5)
  })

  it('erfindet keinen Sprung über einen ganzen Meter', () => {
    // "4 Meter, 200 Zentimeter" ist keine Nachkommastelle.
    expect(ergaenzeNachkommaAusText(4, 'Raum 4 Meter, 200 Zentimeter')).toBe(4)
  })
})

describe('PM-026 — Anstrichzahl gilt je Fläche, nicht für den ganzen Raum', () => {
  const KUECHE = {
    name: 'Küche', laenge: 4.2, breite: 3.6, hoehe: 2.5, flaeche: 15.12,
    tueren: [{ anzahl: 1, breite: 0.9, hoehe: 2.1 }], fenster: [{ anzahl: 2, breite: 1.2, hoehe: 1 }],
    arbeiten: ['wände streichen', 'decke streichen'],
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const titel = (transkript: string) => malerEngine({ gewerk: 'maler', raeume: [KUECHE], transkript } as any)
    .positionen.map(p => p.beschreibung)

  it('rechnet Wände 2x und Decke 1x, wenn beides so gesagt wurde', () => {
    const t = titel('Küche 4,20 x 3,60, Höhe 2,50, Wände zweimal streichen, Decke reicht einmal.')
    expect(t).toContain('Wandflächen streichen 2x — Küche')
    expect(t).toContain('Deckenfläche streichen 1x — Küche')
  })

  it('gilt auch, wenn das Wandwort im Transkript verhört wurde', () => {
    const t = titel('Küche 4,20 x 3,60, Höhe 2,50, Bände zweimal streichen, Decke reicht einmal.')
    expect(t).toContain('Wandflächen streichen 2x — Küche')
    expect(t).toContain('Deckenfläche streichen 1x — Küche')
  })

  it('bleibt bei einer einzigen Angabe für beide Flächen', () => {
    const t = titel('Küche 4,20 x 3,60, Höhe 2,50, alles zweimal streichen.')
    expect(t).toContain('Wandflächen streichen 2x — Küche')
    expect(t).toContain('Deckenfläche streichen 2x — Küche')
  })
})
