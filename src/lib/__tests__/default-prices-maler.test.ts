import { describe, expect, it } from 'vitest'
import { DEFAULT_PRICES } from '../default-prices'

const maler = DEFAULT_PRICES.filter(position => position.category.startsWith('Maler – '))
const tapezieren = maler.filter(position => position.category === 'Maler – Tapezieren')

describe('Maler-Standardpreiskatalog', () => {
  // CoS-018 (2026-08-24): Die Zahl war seit dem Preisdatenbank-Audit vom
  // 20.08. (Commit e06b7f5) veraltet — 164 → 208, also exakt die dort
  // bewusst ergänzten 44 Maler-Positionen. Über die Commit-Historie
  // nachgezählt, keine Dopplung (der Dopplungs-Test unten war die ganze Zeit
  // grün). Die Zahl bleibt bewusst hart, damit ein versehentliches Löschen
  // halber Rubriken auffällt — beim nächsten bewussten Katalog-Ausbau hier
  // mit anpassen.
  it('enthält den vollständigen kuratierten Maler-Katalog', () => {
    expect(maler).toHaveLength(209)
    expect(tapezieren).toHaveLength(22)
  })

  it('enthält keine doppelten Kombinationen aus Bezeichnung und Einheit', () => {
    const keys = maler.map(position =>
      `${position.title.toLocaleLowerCase('de-DE')}::${position.unit.toLocaleLowerCase('de-DE')}`,
    )

    expect(new Set(keys).size).toBe(keys.length)
  })

  it.each([
    'Raufaser tapezieren ohne Anstrich',
    'Vliestapete tapezieren',
    'Papiertapete tapezieren',
    'Vinyltapete tapezieren',
    'Textiltapete tapezieren',
    'Naturwerkstofftapete / Grastapete tapezieren',
    'Metalltapete tapezieren',
    'Fototapete / Digitaldrucktapete tapezieren',
    'Mustertapete mit Rapport tapezieren',
    'Renoviervlies / Malervlies tapezieren',
    'Decke tapezieren (Aufpreis)',
    'Kleinfläche / einzelne Tapetenbahn tapezieren',
  ])('deckt die Tapezierleistung "%s" ab', title => {
    expect(tapezieren.some(position => position.title === title)).toBe(true)
  })

  it.each(['Spachtelung Q1', 'Spachtelung Q2', 'Spachtelung Q3', 'Spachtelung Q4'])(
    'führt die Qualitätsstufe "%s" als eigene Preisposition',
    title => {
      expect(maler.some(position => position.title === title)).toBe(true)
    },
  )
})
