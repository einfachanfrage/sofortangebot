import { describe, expect, it } from 'vitest'
import { DEFAULT_PRICES } from '../default-prices'

const maler = DEFAULT_PRICES.filter(position => position.category.startsWith('Maler – '))
const tapezieren = maler.filter(position => position.category === 'Maler – Tapezieren')

describe('Maler-Standardpreiskatalog', () => {
  it('enthält den vollständigen kuratierten Maler-Katalog', () => {
    expect(maler).toHaveLength(164)
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
