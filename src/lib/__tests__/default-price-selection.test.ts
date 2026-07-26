import { describe, expect, it } from 'vitest'
import { standardpreiseFuerGewerke } from '@/lib/default-price-selection'
import { DEFAULT_PRICES } from '@/lib/default-prices'

describe('Standardpreise je Gewerk', () => {
  it('kopiert beim Maler-Onboarding keine fremden Gewerke', () => {
    const preise = standardpreiseFuerGewerke(['malerarbeiten'])
    expect(preise.length).toBeGreaterThan(100)
    expect(preise.every(p => p.category.startsWith('Maler'))).toBe(true)
  })

  it('kombiniert Maler und Boden vollständig', () => {
    const preise = standardpreiseFuerGewerke(['malerarbeiten', 'bodenbeläge'])
    expect(preise.some(p => p.category.startsWith('Maler'))).toBe(true)
    expect(preise.some(p => p.category.startsWith('Boden'))).toBe(true)
    expect(preise.every(p => p.category.startsWith('Maler') || p.category.startsWith('Boden'))).toBe(true)
  })

  it('behält für Allrounder den vollständigen Katalog', () => {
    expect(standardpreiseFuerGewerke(['allrounder'])).toHaveLength(DEFAULT_PRICES.length)
  })
})
