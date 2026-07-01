import { describe, it, expect } from 'vitest'
import { pruefeUndErgaenzeVollstaendigkeit } from '../index'
import type { BerechnetePosition } from '../../mengen/types'

function pos(beschreibung: string): BerechnetePosition {
  return { beschreibung, menge: 1, einheit: 'Stück', konfidenz: 'high', berechnungsweg: 'test', annahmen: [] }
}

describe('sanitaer – Demontage', () => {
  it('"WC tauschen" → Demontage WC + Silikon', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('sanitaer_heizung', [], 'WC tauschen')
    expect(fehlende).toContain('Demontage WC (alt)')
    expect(fehlende).toContain('Silikon Anschlussfugen')
  })

  it('"Waschtisch erneuern" → Demontage Waschtisch', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('sanitaer_heizung', [], 'Waschtisch erneuern')
    expect(fehlende).toContain('Demontage Waschtisch (alt)')
  })

  it('"Dusche wechseln" → Demontage Dusche', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('sanitaer_heizung', [], 'Dusche wechseln')
    expect(fehlende).toContain('Demontage Dusche / Wanne (alt)')
  })

  it('schon Demontage in ergaenzt → nicht nochmal', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('sanitaer_heizung', [pos('Demontage WC (alt)')], 'WC tauschen')
    expect(fehlende.filter(f => f.includes('Demontage'))).toHaveLength(0)
  })
})

describe('sanitaer – Silikon', () => {
  it('Dusche einbauen → Silikon', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('sanitaer_heizung', [], 'Dusche einbauen')
    expect(fehlende).toContain('Silikon Anschlussfugen')
  })

  it('Armatur wechseln → Silikon', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('sanitaer_heizung', [], 'Armatur wechseln')
    expect(fehlende).toContain('Silikon Anschlussfugen')
  })

  it('schon Silikon vorhanden → kein Duplikat', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('sanitaer_heizung', [pos('Silikon Anschlussfugen')], 'Dusche einbauen')
    expect(fehlende).not.toContain('Silikon Anschlussfugen')
  })
})

describe('sanitaer – Heizung', () => {
  it('Heizkörper tauschen → Thermostatventil + Demontage', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('sanitaer_heizung', [], 'Heizkörper tauschen')
    expect(fehlende).toContain('Thermostatventil montieren')
    expect(fehlende.some(f => f.includes('Demontage'))).toBe(true)
  })

  it('Heizkörper vorhanden ohne Tausch → kein Thermostatventil', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('sanitaer_heizung', [pos('Heizkörper montieren')], 'Heizkörper entlüften')
    expect(fehlende).not.toContain('Thermostatventil montieren')
  })

  it('"Bad komplett" → Rückfrage Leitungen', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('sanitaer_heizung', [], 'Bad komplett sanieren')
    expect(fehlende.some(f => f.includes('Leitungen') || f.includes('Rückfrage'))).toBe(true)
  })
})

describe('sanitaer – Sonder', () => {
  it('Wärmepumpe → 3 Pflicht-Positionen', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('sanitaer_heizung', [], 'Wärmepumpe installieren')
    expect(fehlende).toContain('Wärmepumpe montieren')
    expect(fehlende).toContain('Kältemittelkreislauf / Befüllung')
    expect(fehlende).toContain('Inbetriebnahme Wärmepumpe')
  })

  it('Boiler tauschen → Demontage alt + Montage neu + Anschluss', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('sanitaer_heizung', [], 'Warmwasserspeicher tauschen')
    expect(fehlende).toContain('Demontage Boiler (alt)')
    expect(fehlende).toContain('Boiler / Warmwasserspeicher montieren')
    expect(fehlende).toContain('Anschluss Zu- und Abwasser')
  })

  it('FBH → Verlegung + Verteiler + Einregulierung', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('sanitaer_heizung', [], 'Fußbodenheizung einbauen')
    expect(fehlende).toContain('Fußbodenheizung verlegen')
    expect(fehlende).toContain('Verteiler / Heizkreisverteiler')
    expect(fehlende).toContain('Einregulierung / Druckprobe')
  })
})
