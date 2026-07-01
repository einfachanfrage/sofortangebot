import { describe, it, expect } from 'vitest'
import { pruefeUndErgaenzeVollstaendigkeit } from '../index'
import type { BerechnetePosition } from '../../mengen/types'

function pos(beschreibung: string): BerechnetePosition {
  return { beschreibung, menge: 10, einheit: 'm²', konfidenz: 'high', berechnungsweg: 'test', annahmen: [] }
}

describe('trockenbau – basis', () => {
  it('Rigipswand → Ständerwerk + Beplankung + Spachtelarbeiten', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('trockenbau', [], 'Rigipswand stellen')
    expect(fehlende).toContain('Ständerwerk')
    expect(fehlende).toContain('Spachtelarbeiten Q2')
    expect(fehlende.some(f => f.includes('Beplankung'))).toBe(true)
  })

  it('kein Trigger → keine Positionen', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('trockenbau', [], 'Wände streichen')
    expect(fehlende).toHaveLength(0)
    expect(positionen).toHaveLength(0)
  })

  it('abgehängte Decke → wird erkannt', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('trockenbau', [], 'Abgehängte Decke aus GK einbauen')
    expect(fehlende).toContain('Ständerwerk')
  })

  it('standard Beplankung → 1-lagig', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('trockenbau', [], 'Ständerwand GK')
    expect(fehlende.some(f => f.includes('Beplankung'))).toBe(true)
  })
})

describe('trockenbau – Brandschutz', () => {
  it('Brandschutz F30 → Spezialplatte + Zeugnis-Hinweis', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('trockenbau', [], 'Brandschutzwand F30 in Rigips')
    expect(fehlende).toContain('GK-Spezialplatte (Brandschutz F30/F60)')
    expect(fehlende.some(f => f.includes('Brandschutzzeugnis') || f.includes('Abnahme'))).toBe(true)
  })

  it('F60 → ebenfalls erkannt', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('trockenbau', [], 'Trockenbau F60 Anforderung')
    expect(fehlende.some(f => f.includes('Spezialplatte'))).toBe(true)
  })
})

describe('trockenbau – Schallschutz', () => {
  it('Schallschutzwand → doppelte Beplankung + Dämmung', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('trockenbau', [], 'Schallschutzwand in Rigips stellen')
    expect(fehlende.some(f => f.includes('2-lagig') || f.includes('Schallschutz'))).toBe(true)
    expect(fehlende.some(f => f.includes('Dämmung') || f.includes('Mineralwolle'))).toBe(true)
  })

  it('Schalldämmung → beide Positionen', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('trockenbau', [], 'Schalldämmung Trockenbau')
    expect(fehlende.some(f => f.includes('Schallschutz') || f.includes('lagig'))).toBe(true)
    expect(fehlende.some(f => f.includes('Mineralwolle') || f.includes('Dämmung'))).toBe(true)
  })

  it('schon doppelt beplankt in ergaenzt → keine weitere Beplankung', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('trockenbau', [pos('GK-Beplankung 2-lagig')], 'Schallschutz Trockenbau')
    expect(fehlende.filter(f => f.includes('Beplankung') || f.includes('lagig'))).toHaveLength(0)
  })
})
