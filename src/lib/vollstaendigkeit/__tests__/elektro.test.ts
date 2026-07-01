import { describe, it, expect } from 'vitest'
import { pruefeUndErgaenzeVollstaendigkeit } from '../index'
import type { BerechnetePosition } from '../../mengen/types'

function pos(beschreibung: string): BerechnetePosition {
  return { beschreibung, menge: 1, einheit: 'Stück', konfidenz: 'high', berechnungsweg: 'test', annahmen: [] }
}

describe('elektro – basis', () => {
  it('3 Steckdosen → Stück-Position mit Menge 3', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('elektro', [], '3 Steckdosen nachrüsten')
    const steckdosePos = positionen.find(p => p.beschreibung.toLowerCase().includes('steckdose'))
    expect(steckdosePos).toBeDefined()
    expect(steckdosePos!.menge).toBe(3)
    expect(steckdosePos!.einheit).toBe('Stück')
  })

  it('Steckdose ohne Anzahl → Rückfrage in fehlende', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('elektro', [], 'Steckdosen einbauen')
    expect(fehlende.some(f => f.includes('Steckdose') && f.includes('Anzahl'))).toBe(true)
  })

  it('"unterputz" → UP-Suffix in Position', () => {
    const { positionen, fehlende } = pruefeUndErgaenzeVollstaendigkeit('elektro', [], '5 Steckdosen unterputz setzen')
    const alle = [...positionen.map(p => p.beschreibung), ...fehlende]
    expect(alle.some(b => b.includes('UP'))).toBe(true)
  })

  it('"aufputz" → AP-Suffix in Position', () => {
    const { positionen, fehlende } = pruefeUndErgaenzeVollstaendigkeit('elektro', [], '2 Steckdosen aufputz einbauen')
    const alle = [...positionen.map(p => p.beschreibung), ...fehlende]
    expect(alle.some(b => b.includes('AP'))).toBe(true)
  })

  it('Lichtschalter einbauen → Schalter-Position', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('elektro', [], '4 Lichtschalter einbauen')
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)]
    expect(alle.some(b => b.toLowerCase().includes('schalter'))).toBe(true)
  })

  it('Leitungen verlegen → lfdm-Position', () => {
    const { positionen, fehlende } = pruefeUndErgaenzeVollstaendigkeit('elektro', [], '20 m Leitungen verlegen')
    const alle = [...positionen.map(p => p.beschreibung), ...fehlende]
    expect(alle.some(b => b.toLowerCase().includes('leitungen'))).toBe(true)
  })

  it('kein Elektro-Trigger → keine Positionen', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('elektro', [], 'Wände streichen')
    expect(fehlende).toHaveLength(0)
    expect(positionen).toHaveLength(0)
  })
})

describe('elektro – spezial', () => {
  it('Wallbox → mindestens 3 Pflicht-Positionen', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('elektro', [], 'Wallbox montieren für E-Auto')
    expect(fehlende).toContain('Wallbox montieren')
    expect(fehlende).toContain('Absicherung Wallbox')
    expect(fehlende).toContain('Inbetriebnahme / Einmessen')
  })

  it('Wallbox mit Zuleitungslänge → Zuleitung als lfdm', () => {
    const { positionen, fehlende } = pruefeUndErgaenzeVollstaendigkeit('elektro', [], 'Wallbox einbauen, Zuleitung 15 Meter')
    const alle = [...positionen.map(p => p.beschreibung), ...fehlende]
    const zuleitungPos = positionen.find(p => p.beschreibung.includes('Zuleitung'))
    expect(zuleitungPos?.menge).toBe(15)
    expect(zuleitungPos?.einheit).toBe('lfdm')
  })

  it('Smart Home → Smart-Schalter-Hinweis in fehlende', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('elektro', [], 'Smart Home System, Alexa kompatibel, Schalter einbauen')
    expect(fehlende.some(f => f.includes('Smart-Schalter') || f.includes('Aktor'))).toBe(true)
  })

  it('Sicherungskasten erneuern → Demontage + Neu + FI', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('elektro', [], 'Sicherungskasten erneuern')
    expect(fehlende.some(f => f.includes('Demontage'))).toBe(true)
    expect(fehlende.some(f => f.includes('Unterverteilung'))).toBe(true)
    expect(fehlende.some(f => f.includes('FI'))).toBe(true)
  })

  it('Küche neu → Herdanschluss-Rückfrage', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('elektro', [], 'Küche neu einbauen, Steckdosen setzen')
    expect(fehlende.some(f => f.includes('Herdanschluss') || f.includes('Rückfrage'))).toBe(true)
  })

  it('Ladestation E-Auto → wird als Wallbox erkannt', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('elektro', [], 'Ladestation für E-Auto einbauen')
    expect(fehlende).toContain('Wallbox montieren')
  })
})
