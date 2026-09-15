import { describe, expect, it } from 'vitest'
import { DEFAULT_PRICES } from '../default-prices'

const boden = DEFAULT_PRICES.filter(position => position.category.startsWith('Boden – '))

describe('Boden-Standardpreiskatalog', () => {
  // CoS-018 (2026-08-24): wie beim Maler-Katalog — 177 → 186 durch die 9 im
  // Preisdatenbank-Audit vom 20.08. (Commit e06b7f5) bewusst ergänzten
  // Boden-Positionen. Keine Dopplung, Dopplungs-Test unten war durchgehend
  // grün.
  //
  // PM-013-A (15.09.2026): 189 → 188. „Dehnungsfuge einbauen" 45,00 €/Stück
  // ist raus. Dieselbe Arbeit stand zweimal im Katalog, mit zwei Einheiten —
  // „Dehnungsfuge mit Bewegungsprofil herstellen" 18,00 €/lfdm bleibt.
  // Entscheidung des Prüfmeisters: eine Dehnungsfuge wird in Metern gelegt,
  // nicht in Stück. Der Dopplungs-Test darunter fand das nicht, weil er
  // Bezeichnung UND Einheit vergleicht — zwei Einheiten für dieselbe Arbeit
  // sind für ihn zwei verschiedene Zeilen. Genau diese Lücke ist die
  // Katalog-Dopplung, die sich nicht zählen lässt.
  it('enthält den vollständigen kuratierten Boden-Katalog', () => {
    expect(boden).toHaveLength(188)
  })

  it('enthält keine doppelten Kombinationen aus Bezeichnung und Einheit', () => {
    const keys = boden.map(position =>
      `${position.title.toLocaleLowerCase('de-DE')}::${position.unit.toLocaleLowerCase('de-DE')}`,
    )

    expect(new Set(keys).size).toBe(keys.length)
  })

  it.each([
    'Teppichboden verklebt entfernen',
    'Klebe-Vinyl / Designbelag entfernen',
    'Estrichriss kraftschlüssig verharzen und verklammern',
    'Stabparkett im französischen Fischgrät verlegen',
    'Feuchtraumlaminat verlegen schwimmend',
    'Dryback-Designbelag vollflächig kleben',
    'Kautschukbelag vollflächig verkleben',
    'Nadelvlies vollflächig verkleben',
    'Hamburger / Berliner Sockelleisten montieren',
    'Hohlkehlsockel aus Bodenbelag herstellen',
  ])('deckt die Bodenleistung "%s" ab', title => {
    expect(boden.some(position => position.title === title)).toBe(true)
  })
})
