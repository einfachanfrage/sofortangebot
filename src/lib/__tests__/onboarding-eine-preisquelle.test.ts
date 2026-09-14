import { describe, it, expect } from 'vitest'
import {
  mischeEigenePreise,
  preisSchluessel,
  standardpreiseFuerGewerke,
  zuPriceItemRows,
} from '../default-price-selection'
import { GEWERK_PREISE, GEWERK_VORLAGEN } from '../preise-vorlagen'

// CoS-E-052, zweiter Teil (14.09.2026). Das Onboarding hatte zwei
// Preisquellen, die beide in `price_items` schrieben: den Basis-Katalog und
// die eingetippten Vorlagenzahlen. Bei identischem Titel entstanden zwei
// Zeilen, und welche der Matcher nimmt, war nicht festgelegt — ein echter
// Münzwurf zwischen „sein Preis" und „Marktpreis".

describe('CoS-E-052: eine Zeile je Position, sein Preis gewinnt', () => {
  const basis = [
    { company_id: 'c', category: 'Maler', title: 'Wand streichen 2x Anstrich', unit: 'm²', unit_price: 9.5 },
    { company_id: 'c', category: 'Maler', title: 'Decke streichen 2x Anstrich', unit: 'm²', unit_price: 11 },
  ]

  it('seine Zahl überschreibt die Basiszeile, statt daneben zu liegen', () => {
    const { zeilen, zusaetzlich } = mischeEigenePreise(basis, [
      { category: 'Maler', title: 'Wand streichen 2x Anstrich', unit: 'm²', unit_price: 11.5 },
    ])
    expect(zeilen).toHaveLength(2)
    expect(zusaetzlich).toHaveLength(0)
    expect(zeilen.find(z => z.title.startsWith('Wand'))!.unit_price).toBe(11.5)
    expect(zeilen.find(z => z.title.startsWith('Decke'))!.unit_price).toBe(11)
  })

  it('was es im Katalog nicht gibt, kommt als eigene Zeile dazu', () => {
    const { zeilen, zusaetzlich } = mischeEigenePreise(basis, [
      { category: 'Maler', title: 'Hohlkehle ziehen', unit: 'lfdm', unit_price: 14 },
    ])
    expect(zeilen).toHaveLength(2)
    expect(zusaetzlich).toEqual([
      { category: 'Maler', title: 'Hohlkehle ziehen', unit: 'lfdm', unit_price: 14 },
    ])
  })

  it('die Einheit gehört zum Schlüssel — m² und lfdm sind zwei Zeilen', () => {
    const { zeilen, zusaetzlich } = mischeEigenePreise(basis, [
      { category: 'Maler', title: 'Wand streichen 2x Anstrich', unit: 'lfdm', unit_price: 4 },
    ])
    expect(zeilen.find(z => z.title.startsWith('Wand'))!.unit_price).toBe(9.5)
    expect(zusaetzlich).toHaveLength(1)
  })

  it('am echten Katalog: kein Titel doppelt, egal welches Gewerk', () => {
    for (const gewerk of ['maler', 'boden_parkett']) {
      const vorlagen = (GEWERK_VORLAGEN[gewerk] ?? [])
        .flatMap(schluessel => GEWERK_PREISE[schluessel] ?? [])
        .map(v => ({ category: v.category, title: v.title, unit: v.unit, unit_price: v.defaultPrice }))

      const { zeilen, zusaetzlich } = mischeEigenePreise(
        zuPriceItemRows(standardpreiseFuerGewerke([gewerk]), 'c'),
        vorlagen,
      )

      const alle = [...zeilen, ...zusaetzlich].map(preisSchluessel)
      expect(new Set(alle).size, `${gewerk}: doppelte Zeilen`).toBe(alle.length)
      // Gegenprobe, dass der Fall überhaupt eintritt: Es MUSS Überschneidung
      // geben, sonst prüft dieser Test nichts.
      expect(zusaetzlich.length, `${gewerk}: keine Überschneidung?`).toBeLessThan(vorlagen.length)
    }
  })
})
