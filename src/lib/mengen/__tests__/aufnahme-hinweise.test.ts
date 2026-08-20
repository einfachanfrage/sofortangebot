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

  it('setzt für vollflächig verklebtes Fertigparkett den exakten Katalogtitel', () => {
    const ergebnis = normalisiereBodenPositionenAusAufnahme([
      pos('Fertigparkett verlegen — Wohnzimmer', 32),
    ], 'Eichen-Fertigparkett im Fischgrätmuster vollflächig verkleben.')

    expect(ergebnis[0].beschreibung).toBe('Fertigparkett verlegen vollflächig verklebt — Wohnzimmer')
  })
})
