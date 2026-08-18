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

    expect(ergebnis.find(p => /sockelleisten demontieren/i.test(p.beschreibung))?.menge).toBe(22)
    expect(ergebnis.find(p => /sockelleisten montieren/i.test(p.beschreibung))?.menge).toBe(22)
  })

  it('setzt für vollflächig verklebtes Fertigparkett den exakten Katalogtitel', () => {
    const ergebnis = normalisiereBodenPositionenAusAufnahme([
      pos('Fertigparkett verlegen — Wohnzimmer', 32),
    ], 'Eichen-Fertigparkett im Fischgrätmuster vollflächig verkleben.')

    expect(ergebnis[0].beschreibung).toBe('Fertigparkett verlegen vollflächig verklebt — Wohnzimmer')
  })
})
