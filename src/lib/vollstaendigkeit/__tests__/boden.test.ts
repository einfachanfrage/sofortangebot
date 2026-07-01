import { describe, it, expect } from 'vitest'
import { pruefeUndErgaenzeVollstaendigkeit } from '../index'
import type { BerechnetePosition } from '../../mengen/types'

function pos(beschreibung: string, menge = 10, einheit = 'm²'): BerechnetePosition {
  return { beschreibung, menge, einheit, konfidenz: 'high', berechnungsweg: 'test', annahmen: [] }
}

describe('boden – basis', () => {
  it('Parkett → Untergrundvorbereitung + Verlegen + Sockelleisten', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Parkett verlegen, 35 qm')
    // Mit bekannter m² → Untergrundvorbereitung in positionen (nicht fehlende)
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)]
    expect(alle.some(b => b.toLowerCase().includes('untergrundvorbereitung'))).toBe(true)
    expect(fehlende).toContain('Sockelleisten montieren')
  })

  it('Laminat → wird als Laminat-Position erkannt', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Laminat verlegen in Wohnzimmer')
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)]
    expect(alle.some(b => b.toLowerCase().includes('laminat'))).toBe(true)
  })

  it('Vinyl/Designboden-Trigger', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Vinyl verlegen, Designboden klick')
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)]
    expect(alle.some(b => b.toLowerCase().includes('vinyl') || b.toLowerCase().includes('design'))).toBe(true)
  })

  it('"ohne Sockelleisten" → kein Sockel in fehlende', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Parkett verlegen ohne Sockelleisten')
    expect(fehlende).not.toContain('Sockelleisten montieren')
  })

  it('Fläche aus Text wird extrahiert (Laminat inkl. 10% Verschnitt)', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Laminat verlegen, 48 qm.')
    const laminatPos = positionen.find(p => p.beschreibung.toLowerCase().includes('laminat'))
    // Laminat bekommt Standard-10%-Verschnitt: 48 × 1.10 = 52.8
    expect(laminatPos?.menge).toBeCloseTo(52.8, 1)
  })

  it('kein Trigger → keine Boden-Positionen', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Wände streichen')
    expect(fehlende).toHaveLength(0)
    expect(positionen).toHaveLength(0)
  })
})

describe('boden – vorarbeiten', () => {
  it('"Altbelag entfernen" → Entfernen-Position', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Alten Laminatboden raus, neues Parkett verlegen')
    expect(fehlende).toContain('Altbelag entfernen')
  })

  it('"alter Belag" → Entfernen-Position', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Alter Belag entfernen, dann Vinyl verlegen')
    expect(fehlende).toContain('Altbelag entfernen')
  })

  it('Übergangsprofil bei "Raumübergang"', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Parkett verlegen, am Übergang zum Flur ein Anschlussprofil')
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)].join(' ')
    expect(alle.toLowerCase()).toContain('übergangsprofil')
  })
})

describe('boden – sonder', () => {
  it('Diagonalverlegung → Verschnitt 15 % in fehlende', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Parkett diagonal verlegen, 30 qm')
    expect(fehlende).toContain('Verschnitt 15 % (Diagonalverlegung)')
  })

  it('FBH-Hinweis wenn Fußbodenheizung erwähnt', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Laminat verlegen, Fußbodenheizung vorhanden')
    expect(fehlende.some(f => f.includes('FBH'))).toBe(true)
  })

  it('Parkett schleifen → genau 3 Positionen (schleifen + 2 Versiegelungen)', () => {
    const { positionen, fehlende } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Parkett schleifen, 40 qm')
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)]
    expect(alle).toContain('Parkett schleifen')
    expect(alle).toContain('Versiegelung 1. Gang')
    expect(alle).toContain('Versiegelung 2. Gang')
  })

  it('Parkett schleifen mit m² → Menge in positionen', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Parkett schleifen, 40 qm.')
    const schleifPos = positionen.find(p => p.beschreibung.includes('schleifen'))
    expect(schleifPos?.menge).toBe(40)
    const vers1 = positionen.find(p => p.beschreibung.includes('1. Gang'))
    expect(vers1?.menge).toBe(40)
    const vers2 = positionen.find(p => p.beschreibung.includes('2. Gang'))
    expect(vers2?.menge).toBe(40)
  })

  it('Treppe → Trittstufen + Setzstufen separat', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Parkett verlegen, Treppe mit 14 Stufen auch belegen')
    // Mit Anzahl → positionen; ohne Anzahl → fehlende
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)].join(' ')
    expect(alle.toLowerCase()).toContain('trittstufen')
    expect(alle.toLowerCase()).toContain('setzstufen')
  })

  it('Treppe mit Anzahl → Menge korrekt', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('boden', [], 'Parkett verlegen, 14 Treppenstufen belegen')
    const trittPos = positionen.find(p => p.beschreibung.toLowerCase().includes('trittstufen'))
    expect(trittPos?.menge).toBe(14)
    expect(trittPos?.einheit).toBe('Stück')
  })
})
