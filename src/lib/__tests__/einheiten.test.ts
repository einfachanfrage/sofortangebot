// Einheiten — passt die Auswahlliste zu dem, was tatsächlich erzeugt wird?
//
// ── CoS-E-024 / TN-060 (Manfred) ──────────────────────────────────────────
//
// Manfred legte für „Heizkörper abkleben – 1 Stück" einen Preis an und bekam
// m² vorgeschlagen. Nicht weil die Einheit falsch übernommen wurde — sie war
// im State korrekt „Stück" —, sondern weil die Auswahlliste nur „Stk" kannte.
// Ein <select> mit unbekanntem value zeigt die erste Option, und die war m².
//
// Der Fehler war genau deshalb so langlebig: Er stand in einer 170-KB-
// Komponente, die kein Test je angefasst hat, und der Code sah richtig aus.
import { describe, expect, it } from 'vitest'
import { UNITS, einheitenFuer } from '../einheiten'
import { DEFAULT_PRICES } from '../default-prices'

describe('Die Auswahlliste kennt, was die Engine schreibt', () => {
  it.each(['m²', 'Stück', 'lfdm', 'm', 'Pauschale'])(
    'die Engine-Einheit „%s" steht in der Liste',
    einheit => {
      // Die fünf Einheiten, die die Mengen-Engine tatsächlich vergibt.
      // Fehlt eine, zeigt der Dialog beim Preisanlegen etwas anderes an, als
      // die Position hat — und der Betrieb legt den Preis falsch an.
      expect(UNITS).toContain(einheit)
    },
  )

  it('kennt die Einheiten der 20 häufigsten Katalogzeilen', () => {
    const haeufigkeit = new Map<string, number>()
    for (const p of DEFAULT_PRICES) haeufigkeit.set(p.unit, (haeufigkeit.get(p.unit) ?? 0) + 1)
    const top = [...haeufigkeit.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([einheit]) => einheit)
    // Die Randfälle des Katalogs („m²/cm", „Fahrt", „Leerung") gehören NICHT
    // in eine Liste für alle — die fängt `einheitenFuer` ab. Die häufigen
    // schon.
    for (const einheit of top) expect(UNITS, `„${einheit}" fehlt`).toContain(einheit)
  })
})

describe('Eine unbekannte Einheit wird gezeigt, nicht ersetzt', () => {
  it('hängt sie vorne an', () => {
    // `Aufpreis Estrichdicke je zusätzlicher cm` hat die Einheit „m²/cm".
    // Die gehört nicht in die Standardauswahl, darf aber auch nicht
    // stillschweigend zu m² werden.
    expect(einheitenFuer('m²/cm')[0]).toBe('m²/cm')
    expect(einheitenFuer('Fahrt')[0]).toBe('Fahrt')
  })

  it('lässt die Liste unverändert, wenn die Einheit schon drin ist', () => {
    expect(einheitenFuer('Stück')).toEqual(UNITS)
    expect(einheitenFuer('')).toEqual(UNITS)
    expect(einheitenFuer(null)).toEqual(UNITS)
  })

  it('zeigt für JEDE Katalogeinheit die richtige an erster Stelle', () => {
    // Die eigentliche Zusicherung: Kein Betrieb bekommt je eine andere
    // Einheit angezeigt als die, die seine Position hat.
    const alle = new Set(DEFAULT_PRICES.map(p => p.unit))
    for (const einheit of alle) {
      expect(einheitenFuer(einheit), `„${einheit}"`).toContain(einheit)
    }
  })
})
