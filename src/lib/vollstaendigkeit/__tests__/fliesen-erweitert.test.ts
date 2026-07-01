import { describe, it, expect } from 'vitest'
import { pruefeUndErgaenzeVollstaendigkeit } from '../index'
import type { BerechnetePosition } from '../../mengen/types'

function pos(beschreibung: string): BerechnetePosition {
  return { beschreibung, menge: 10, einheit: 'm²', konfidenz: 'high', berechnungsweg: 'test', annahmen: [] }
}

describe('fliesen – Verfugung Pflicht', () => {
  it('Bodenfliesen im Transkript → Verfugung Boden Pflicht', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('fliesen', [], 'Bodenfliesen verlegen im Bad')
    expect(fehlende).toContain('Verfugung Boden')
  })

  it('Wandfliesen → Verfugung Wand', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('fliesen', [], 'Wandfliesen im Badezimmer setzen')
    expect(fehlende).toContain('Verfugung Wand')
  })

  it('Boden + Wand → beide Verfugungen', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('fliesen', [pos('Bodenfliesen verlegen'), pos('Wandfliesen setzen')], 'Bad fliesen')
    expect(fehlende).toContain('Verfugung Boden')
    expect(fehlende).toContain('Verfugung Wand')
  })

  it('schon Verfugung in ergaenzt → nichts nochmal hinzufügen', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('fliesen', [pos('Verfugung Boden')], 'Bodenfliesen verlegen')
    expect(fehlende).not.toContain('Verfugung Boden')
  })

  it('"nur Wandfliesen" → keine Verfugung Boden', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('fliesen', [pos('Wandfliesen setzen')], 'nur Wandfliesen im Bad')
    expect(fehlende).not.toContain('Verfugung Boden')
    expect(fehlende).toContain('Verfugung Wand')
  })
})

describe('fliesen – Nassbereich', () => {
  it('Bad + Bodenfliesen → Abdichtung Boden Pflicht', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('fliesen', [pos('Bodenfliesen verlegen')], 'Bad fliesen')
    expect(fehlende).toContain('Abdichtung Boden (Nassbereich)')
  })

  it('Bad + Wandfliesen → Abdichtung Wand Pflicht', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('fliesen', [pos('Wandfliesen setzen')], 'Badezimmer nur Wandfliesen')
    expect(fehlende).toContain('Abdichtung Wand (Nassbereich)')
  })

  it('kein Nassbereich → keine Abdichtung', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('fliesen', [pos('Bodenfliesen verlegen')], 'Küche fliesen')
    expect(fehlende.some(f => f.includes('Abdichtung'))).toBe(false)
  })

  it('Bodengleiche Dusche → eigene Position', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('fliesen', [], 'Bad fliesen, bodengleiche Dusche')
    expect(fehlende).toContain('Bodengleiche Dusche einbauen')
  })
})

describe('fliesen – Entsorgung', () => {
  it('"fliesen raus" → Entsorgung Altfliesen', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('fliesen', [], 'Alte Fliesen raus, neue Bodenfliesen verlegen')
    expect(fehlende.some(f => f.toLowerCase().includes('entsorgung'))).toBe(true)
  })

  it('"entfernen" → Entsorgung', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('fliesen', [], 'Fliesen entfernen und neu verlegen, Bodenfliesen')
    expect(fehlende.some(f => f.toLowerCase().includes('entsorgung'))).toBe(true)
  })
})

describe('fliesen – Sonderfälle', () => {
  it('Diagonal → 15 % Verschnitt', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('fliesen', [pos('Bodenfliesen verlegen')], 'Diagonal verlegen, 45 Grad')
    expect(fehlende.some(f => f.includes('15') && f.includes('Diagonal'))).toBe(true)
  })

  it('Mosaik → eigene Position', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('fliesen', [], 'Mosaikfliesen im Duschbereich')
    expect(fehlende.some(f => f.toLowerCase().includes('mosaik'))).toBe(true)
  })

  it('Naturstein → Imprägnierung + Spezialfuge', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('fliesen', [pos('Marmor verlegen')], 'Marmorfliesen verlegen, Naturstein')
    expect(fehlende.some(f => f.includes('Imprägnierung'))).toBe(true)
    expect(fehlende.some(f => f.includes('Fugenmasse') && f.includes('Naturstein'))).toBe(true)
  })
})
