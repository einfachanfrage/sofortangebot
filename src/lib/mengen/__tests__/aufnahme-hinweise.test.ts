import { describe, expect, it } from 'vitest'
import { ergaenzeAusAufnahmeHinweisen, normalisiereBodenPositionenAusAufnahme } from '../aufnahme-hinweise'
import type { BerechnetePosition } from '../types'

const pos = (beschreibung: string, menge: number, einheit = 'm²', berechnungsweg = ''): BerechnetePosition => ({
  beschreibung, menge, einheit, berechnungsweg, konfidenz: 'high', annahmen: [],
})

describe('Aufnahme-Hinweise als sicheres Fallback', () => {
  it('ergänzt Arbeiten, ohne Phantomraum oder Parkett-Aufarbeitung zu erzeugen', () => {
    const ergebnis = ergaenzeAusAufnahmeHinweisen([
      pos('Wandflächen streichen — Wohnzimmer', 45.93),
      pos('Vinyl-Boden verlegen inkl. 10% Verschnitt — Wohnzimmer', 23.45, 'm²', '21.32 m² + 10% Verschnitt'),
      pos('Sockelleisten montieren — Wohnzimmer', 18, 'lfdm'),
    ], ['Wände schleifen', 'Teppichboden entfernen', 'Klickvinyl verlegen', 'Sockelleisten montieren'])

    const namen = ergebnis.map(p => p.beschreibung.toLowerCase())
    expect(namen).toEqual(expect.arrayContaining([
      'schleifen — wohnzimmer', 'altbelag entfernen — wohnzimmer',
      'trittschalldämmung — wohnzimmer', 'sockelleisten montieren — wohnzimmer',
    ]))
    expect(namen.some(name => name.includes('parkett'))).toBe(false)
    expect(namen.some(name => name.includes('raum'))).toBe(false)
  })

  it('ersetzt Sockelleisten abkleben durch die ausdrücklich genannte Montage', () => {
    const ergebnis = ergaenzeAusAufnahmeHinweisen([
      pos('Wandflächen streichen — Wohnzimmer', 45.93),
      pos('Vinyl-Boden verlegen inkl. 10% Verschnitt — Wohnzimmer', 23.45, 'm²', '21.32 m² + 10% Verschnitt'),
      pos('Sockelleisten abkleben — Wohnzimmer', 17.7, 'lfdm'),
    ], ['Wände streichen', 'Klickvinyl verlegen', 'Sockelleisten montieren'], 'Es werden achtzehn laufende Meter Sockelleisten montiert.')

    const sockel = ergebnis.filter(p => /sockelleisten/i.test(p.beschreibung))
    expect(sockel).toHaveLength(1)
    expect(sockel[0].beschreibung).toBe('Sockelleisten montieren — Wohnzimmer')
    expect(sockel[0].menge).toBe(18)
    expect(sockel[0].einheit).toBe('lfdm')
  })

  it('übernimmt Demontage und Montage alter/neuer Sockelleisten getrennt', () => {
    const ergebnis = ergaenzeAusAufnahmeHinweisen([
      pos('Klick-Vinyl verlegen inkl. 10% Verschnitt — Schlafzimmer', 22, 'm²', '20 m² + 10% Verschnitt'),
      pos('Sockelleisten montieren — Schlafzimmer', 18, 'lfdm'),
    ], ['Sockelleisten demontieren', 'Sockelleisten montieren'], 'Die alten Sockelleisten werden demontiert und zweiundzwanzig laufende Meter neue Sockelleisten montiert.')

    expect(ergebnis.find(p => /sockelleisten entfernen/i.test(p.beschreibung))?.menge).toBe(22)
    expect(ergebnis.find(p => /sockelleisten montieren/i.test(p.beschreibung))?.menge).toBe(22)
  })

  // PM-010, Nachtest 5 (2026-08-19): echter Live-Fund. Der Karten-Chip sagte
  // wörtlich "Sockelleisten entfernen" (nicht "demontieren") — die alte
  // Prüfung hier kannte nur "demontieren" als Wort, deshalb ist die Position
  // im fertigen Entwurf komplett verschwunden, obwohl die Karte "5 Positionen
  // erkannt" gemeldet hatte. Bestätigt am echten Transkript aus dem Nachtest.
  it('erkennt "Sockelleisten entfernen" als Chip-Titel (nicht nur "demontieren") — PM-010', () => {
    const ergebnis = ergaenzeAusAufnahmeHinweisen([
      pos('Wandflächen streichen — Gästezimmer', 30.71),
      pos('Deckenfläche streichen — Gästezimmer', 10.5),
      pos('Sockelleisten montieren — Gästezimmer', 12.1, 'lfdm'),
    ], ['Wände streichen', 'Decke streichen', 'Sockelleisten entfernen', 'Neue Sockelleisten montieren', 'Sockelleisten streichen'],
      'Die alten Sockelleisten kommen raus, neue werden montiert, weiße MDF-Leisten.')

    const entfernenPos = ergebnis.find(p => /sockelleisten entfernen/i.test(p.beschreibung))
    expect(entfernenPos, `keine Position — hat: ${ergebnis.map(p => p.beschreibung).join(' | ')}`).toBeDefined()
    // Keine eigene Meterangabe fürs Entfernen im Transkript → gleiche Länge wie "Sockelleisten montieren".
    expect(entfernenPos!.menge).toBe(12.1)
  })

  // PM-013 (2026-08-19): echter Live-Fund. Die Karte erkennt "Dehnungsfuge
  // einbauen (1 Stück)" als eigene Leistung, der fertige Entwurf enthält sie
  // nicht — weder als Zeile noch als offene Rückfrage. Anders als bei den
  // Sockelleisten-Fällen gab es hierfür bisher GAR KEINE Erkennung im
  // System, nicht mal in "fehlende" — der Chip-Titel ist die einzige Quelle.
  it('erkennt "Dehnungsfuge einbauen" vom Chip-Titel, auch ohne eigene Erkennung in der Engine — PM-013', () => {
    const ergebnis = ergaenzeAusAufnahmeHinweisen([
      pos('Fertigparkett verlegen — Wohnzimmer', 36, 'm²'),
      pos('Altbelag entfernen — Wohnzimmer', 36, 'm²'),
    ], ['Eichenparkett verlegen — Wohnzimmer', 'Dehnungsfuge einbauen — Wohnzimmer'],
      'Wohnzimmer, acht mal viereinhalb. Eichenparkett, Fischgrät verlegt, das braucht ja mehr Verschnitt. ' +
      'Ist schon ne große Fläche, da muss wahrscheinlich ne Dehnungsfuge rein, mach das bitte mit rein.')

    const dehnungsfuge = ergebnis.find(p => /dehnungsfuge/i.test(p.beschreibung))
    expect(dehnungsfuge, `keine Position — hat: ${ergebnis.map(p => p.beschreibung).join(' | ')}`).toBeDefined()
    expect(dehnungsfuge!.menge).toBe(1)
    expect(dehnungsfuge!.einheit).toBe('Stück')
  })

  // PM-013, Nachtest 2 (2026-08-20): echter Live-Fund, direkte Folge des
  // Fixes oben. Bei NACHWEISLICH IDENTISCHEM Transkript (Sandy bestätigt:
  // "habe Dehnungsfuge mit gesagt", gleicher Wortlaut wie beim ersten Test)
  // hat GPTs Karten-Erkennung die Dehnungsfuge beim zweiten Testlauf NICHT
  // gemeldet — der reine Chip-Titel-Fix von PM-013 hing komplett an dieser
  // einen, nachweislich nicht deterministischen Chip-Antwort und griff
  // deshalb ins Leere. Fix: Fallback direkt im Rohtranskript, unabhängig
  // vom Chip (analog BODEN_VERLEGEN_SIGNAL in boden.ts/kontext-analyzer.ts).
  it('erkennt "Dehnungsfuge" auch im Rohtranskript, wenn der Chip sie diesmal NICHT meldet — PM-013 Nachtest 2', () => {
    const ergebnis = ergaenzeAusAufnahmeHinweisen([
      pos('Fertigparkett verlegen inkl. 15% Verschnitt — Wohnzimmer', 41.4, 'm²'),
      // Chip meldet diesmal absichtlich KEINE Dehnungsfuge — genau das reale
      // Nachtest-2-Muster (Karte: "3 Positionen erkannt" statt "4").
    ], ['Eichenparkett verlegen — Wohnzimmer'],
      'Wohnzimmer, acht mal viereinhalb. Eichenparkett, Fischgrät verlegt, das braucht ja mehr Verschnitt. ' +
      'Ist schon ne große Fläche, da muss wahrscheinlich ne Dehnungsfuge rein, mach das bitte mit rein.')

    const dehnungsfuge = ergebnis.find(p => /dehnungsfuge/i.test(p.beschreibung))
    expect(dehnungsfuge, `keine Position — hat: ${ergebnis.map(p => p.beschreibung).join(' | ')}`).toBeDefined()
    expect(dehnungsfuge!.menge).toBe(1)
    expect(dehnungsfuge!.einheit).toBe('Stück')
  })

  it('erfindet keine Dehnungsfuge, wenn sie im Transkript ausdrücklich verneint wird', () => {
    const ergebnis = ergaenzeAusAufnahmeHinweisen([
      pos('Fertigparkett verlegen — Wohnzimmer', 36, 'm²'),
    ], ['Eichenparkett verlegen — Wohnzimmer'],
      'Wohnzimmer, acht mal viereinhalb. Eichenparkett verlegt. Keine Dehnungsfuge nötig, die Fläche ist nicht so groß.')

    const dehnungsfuge = ergebnis.find(p => /dehnungsfuge/i.test(p.beschreibung))
    expect(dehnungsfuge).toBeUndefined()
  })

  // PM-012, zweiter Nachtest (2026-08-19): echter Live-Fund. Nur Streichen
  // verlangt, Neumontage ausdrücklich ausgeschlossen — Karte meldet
  // "Sockelleisten streichen" zuverlässig, der Fix in der Maler-Engine vom
  // 17.08. griff live trotzdem nicht (Golden-Test grün, live tot — gleiches
  // Muster wie bei PM-010). Menge kommt hier von "Sockelleisten abkleben"
  // (14,1 lfdm), weil keine Neumontage existiert — exakt die Soll-Lösung.
  it('erkennt "Sockelleisten streichen" vom Chip-Titel als Sicherheitsnetz, auch ohne Neumontage — PM-012', () => {
    const ergebnis = ergaenzeAusAufnahmeHinweisen([
      pos('Wandflächen streichen — Esszimmer', 35.16),
      pos('Boden schützen — Esszimmer', 13.5),
      pos('Sockelleisten abkleben — Esszimmer', 14.1, 'lfdm'),
    ], ['Wände streichen', 'Sockelleisten streichen'],
      'Esszimmer, viereinhalb mal drei, Höhe zwo fünfundfünfzig. Wände streichen, zweimal drüber. ' +
      'Die Sockelleisten bleiben genau wie sie sind, die werden NICHT neu gemacht, die NICHT demontiert — ' +
      'die sollen nur nochmal mitgestrichen werden, in der gleichen Farbe wie die Wand.')

    const streichPos = ergebnis.find(p => /sockelleisten streich/i.test(p.beschreibung))
    expect(streichPos, `keine Position — hat: ${ergebnis.map(p => p.beschreibung).join(' | ')}`).toBeDefined()
    expect(streichPos!.menge).toBe(14.1)
    // Kein Phantom auf der Boden-Seite — Ausschluss bleibt respektiert.
    expect(ergebnis.some(p => /sockelleisten montieren|sockelleisten entfernen/i.test(p.beschreibung))).toBe(false)
  })

  // PM-013, Nachtest 3 (2026-08-21): echter Live-Fund. Die Karten-Chip-Titel
  // tragen selbst keinen Raumbezug (siehe generiere-positionen/route.ts,
  // `erkannteArbeiten` ist eine flache, deduplizierte Liste über alle
  // Aufnahmen) — das "sockelleisten montieren"-Sicherheitsnetz entfernte
  // deshalb bisher JEDE "Sockelleisten abkleben"-Position im GESAMTEN
  // Auftrag, sobald IRGENDEIN Raum eine Montage-Karte hatte. Live traf das
  // eine völlig unbeteiligte "Sockelleisten abkleben — Flur"-Position, nur
  // weil das Wohnzimmer eine (fehlerhafte) Sockelleisten-Montage-Karte hatte.
  it('entfernt "Sockelleisten abkleben" nur im selben Raum wie die Montage-Position — PM-013 Nachtest 3', () => {
    const ergebnis = ergaenzeAusAufnahmeHinweisen([
      pos('Wandflächen streichen — Flur', 33.47),
      pos('Deckenfläche streichen — Flur', 9),
      pos('Sockelleisten abkleben — Flur', 12.7, 'lfdm'),
      pos('Fertigparkett verlegen inkl. 15% Verschnitt — Wohnzimmer', 41.4),
      pos('Sockelleisten montieren — Wohnzimmer', 25, 'lfdm'),
    ], ['Wandflächen streichen', 'Deckenfläche streichen', 'Sockelleisten abkleben', 'Fertigparkett verlegen', 'Sockelleisten montieren'],
      'Wohnzimmer, 8x4,5, Eichenparkett, Fischgrät verlegt. Flur daneben, nur Wände und Decke streichen.')

    const abklebenFlur = ergebnis.find(p => /sockelleisten abkleben/i.test(p.beschreibung))
    expect(abklebenFlur, `Flur-Abkleben fehlt — hat: ${ergebnis.map(p => p.beschreibung).join(' | ')}`).toBeDefined()
    expect(abklebenFlur!.beschreibung).toContain('Flur')
    expect(abklebenFlur!.menge).toBe(12.7)
  })

  it('setzt für vollflächig verklebtes Fertigparkett den exakten Katalogtitel', () => {
    const ergebnis = normalisiereBodenPositionenAusAufnahme([
      pos('Fertigparkett verlegen — Wohnzimmer', 32),
    ], 'Eichen-Fertigparkett im Fischgrätmuster vollflächig verkleben.')

    expect(ergebnis[0].beschreibung).toBe('Fertigparkett verlegen vollflächig verklebt — Wohnzimmer')
  })
})

// PM-013, Nachtest 4 (2026-08-25): Die Dehnungsfuge war zum dritten Mal anders
// ausgegangen — diesmal komplett weg. Im Rohtranskript aus der Produktions-DB
// stand der Grund: Whisper hat „Dehnungsfuge" als „DEHNUNGSFUHRE" geschrieben.
// Der Fallback war nie kaputt, das Wort kam nur nie bei ihm an.
describe('PM-013 – Whisper-Verhörer bei „Dehnungsfuge"', () => {
  const parkett = (): BerechnetePosition[] => ([
    pos('Fertigparkett verlegen inkl. 15% Verschnitt — Wohnzimmer', 41.4),
  ])

  it('erkennt die Dehnungsfuge auch als „Dehnungsfuhre" (echtes Transkript)', () => {
    const ergebnis = ergaenzeAusAufnahmeHinweisen(
      parkett(), [],
      '8 x 4,5, Wohnzimmer, Eichenparkett, Fischgrät verlegt. Das braucht ja mehr Verschnitt, ist schon eine große Fläche, da muss wahrscheinlich eine Dehnungsfuhre rein. Macht das mal bitte mit rein.',
    )
    const treffer = ergebnis.find(p => /dehnungsfuge/i.test(p.beschreibung))
    expect(treffer, `keine Position — hat: ${ergebnis.map(p => p.beschreibung).join(' | ')}`).toBeDefined()
    expect(treffer!.menge).toBe(1)
    expect(treffer!.einheit).toBe('Stück')
  })

  it.each([
    'da muss ne Dehnungsfuge rein',
    'da muss ne Dehnungsfuhre rein',
    'da muss eine Bewegungsfuge rein',
    'da müssen Dehnungsfugen rein',
    'da muss eine Dehn-Fuge rein',
  ])('versteht die Schreibweise „%s"', satz => {
    const ergebnis = ergaenzeAusAufnahmeHinweisen(parkett(), [], satz)
    expect(ergebnis.some(p => /dehnungsfuge/i.test(p.beschreibung))).toBe(true)
  })

  it('erfindet ohne Wortstamm nichts — eine „Fuhre" allein reicht nicht', () => {
    const ergebnis = ergaenzeAusAufnahmeHinweisen(parkett(), [], 'Eine Fuhre Sand kommt noch dazu.')
    expect(ergebnis.some(p => /dehnungsfuge/i.test(p.beschreibung))).toBe(false)
  })

  it('respektiert die Verneinung weiterhin, auch beim Verhörer', () => {
    const ergebnis = ergaenzeAusAufnahmeHinweisen(parkett(), [], 'Ohne Dehnungsfuhre, das brauchen wir hier nicht.')
    expect(ergebnis.some(p => /dehnungsfuge/i.test(p.beschreibung))).toBe(false)
  })
})
