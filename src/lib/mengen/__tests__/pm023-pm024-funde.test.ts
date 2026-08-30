// PM-023 und PM-024 (Sandys Live-Tests, 25.–30.08.2026)
import { describe, expect, it } from 'vitest'
import { pruefeUndErgaenzeVollstaendigkeit } from '@/lib/vollstaendigkeit'
import { ergaenzeNachkommaAusText, extrahiereRaumhoehe } from '@/lib/extraktion-masse'
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

// ── Nachtest-Runde 2 (Sandy, 2026-08-30 abends) ────────────────────────────
describe('PM-024-Nachtest — Erschwerniszuschlag Höhe hängt nicht mehr an einer Regex', () => {
  it('kennt jetzt auch die häufigste Sprechweise „Höhe 3,20 m"', () => {
    expect(extrahiereRaumhoehe('büro, 5m x 4m, höhe 3,20m, wände zweimal streichen')).toBe(3.2)
  })

  it('löst den Zuschlag über die erkannte Raumhöhe aus, nicht über den Rohtext', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
      'maler',
      [{ beschreibung: 'Wandflächen streichen 2x — Büro', menge: 57.6, einheit: 'm²', konfidenz: 'high', berechnungsweg: '18 × 3,2', annahmen: [] }],
      // Transkript ohne jedes Höhen-Stichwort, das eine Regex finden könnte
      'Büro streichen.',
      { raumhoehen: [3.2] },
    )
    expect(positionen.some(p => /erschwerniszuschlag raumhöhe/i.test(p.beschreibung))).toBe(true)
  })

  it('löst ihn nicht aus, wenn kein Raum über 3 m ist', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
      'maler',
      [{ beschreibung: 'Wandflächen streichen 2x — Küche', menge: 39, einheit: 'm²', konfidenz: 'high', berechnungsweg: '15,6 × 2,5', annahmen: [] }],
      'Küche streichen.',
      { raumhoehen: [2.5] },
    )
    expect(positionen.some(p => /erschwerniszuschlag raumhöhe/i.test(p.beschreibung))).toBe(false)
  })
})

describe('PM-026-Nachtest — Anstrichzahl auch bei zwei Räumen im Angebot', () => {
  const raeume = [
    { name: 'Büro', laenge: 5, breite: 4, hoehe: 3.2, flaeche: 20, umfang: 18,
      tueren: [{ anzahl: 1 }], fenster: [{ anzahl: 2 }], arbeiten: ['wände streichen', 'decke streichen'] },
    { name: 'Küche', laenge: 4.2, breite: 3.6, hoehe: 2.5, flaeche: 15.12, umfang: 15.6,
      tueren: [{ anzahl: 1 }], fenster: [{ anzahl: 2 }], arbeiten: ['wände streichen', 'decke streichen'] },
  ]
  const T = 'Büro, 5m x 4m, Höhe 3,20m, Wände zweimal streichen. Küche, 4,20 m x 3,60 m, Höhe 2,50 m, Wände zweimal streichen, Decke reicht einmal.'

  it('liest „Decke reicht einmal" aus dem Abschnitt der Küche, nicht aus dem ganzen Text', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const titel = malerEngine({ gewerk: 'maler', raeume, transkript: T } as any).positionen.map(p => p.beschreibung)
    expect(titel).toContain('Deckenfläche streichen 1x — Küche')
    // Das Büro hat keine eigene Decken-Angabe → bleibt beim Standard 2×.
    expect(titel).toContain('Deckenfläche streichen 2x — Büro')
    // Und die Wand-Angabe des einen Raums färbt nicht auf den anderen ab.
    expect(titel).toContain('Wandflächen streichen 2x — Küche')
    expect(titel).toContain('Wandflächen streichen 2x — Büro')
  })
})

describe('PM-023-Nachtest — Trittschalldämmung nimmt die eigene Raumfläche', () => {
  it('nimmt nicht die Fläche des anderen Raums im selben Angebot', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
      'boden_parkett',
      [
        { beschreibung: 'Laminat verlegen inkl. 5% Verschnitt — Flur', menge: 11.34, einheit: 'm²', konfidenz: 'high', berechnungsweg: '10.8 m² × 1.05', annahmen: [] },
        { beschreibung: 'Sockelleisten montieren — Flur', menge: 14.7, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: '15.6 − 0.9', annahmen: [] },
      ],
      // Im selben Angebot steht auch das Gästezimmer mit 4 mal 3,50 m = 14 m².
      'Flur, sechs Meter mal eins Meter achtzig, Laminat mit Trittschalldämmung drunter. Gästezimmer, vier Meter mal drei Meter fünfzig, Vinyl im Fischgrätmuster.',
    )
    const daemmung = positionen.find(p => /trittschall/i.test(p.beschreibung))
    expect(daemmung?.menge).toBe(10.8)
    expect(daemmung?.beschreibung).toBe('Trittschalldämmung — Flur')
  })
})
