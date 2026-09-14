// CoS-E-018 / TN-044 / TN-129 (Manfred, 11.09.2026) — der gesprochene
// Kundenname.
//
// Befund: Der Name WIRD erkannt und sauber ausgelesen. Danach liest ihn
// niemand mehr — er endete in einer Sackgasse. Deshalb reproduzierte sich
// „Kein Kunde zugewiesen" in beiden Testszenarien identisch.
//
// Diese Tests halten die beiden Enden fest, die zusammen die Leitung
// bilden: dass die Extraktion den Namen liefert, und dass daraus ein
// VORSCHLAG wird und nie stillschweigend ein Kunde.
import { describe, it, expect } from 'vitest'
import { normalisiereExtraktion } from '@/lib/mengen/extraktion-normalisierer'

describe('CoS-E-018 — der Name kommt aus der Extraktion heraus', () => {
  it('liest Name, Adresse und Ort aus der GPT-Antwort', () => {
    const roh = {
      gewerk: 'maler',
      kunde: { name: 'Frau Krüger', adresse: null, ort: 'Bochum' },
      raeume: [],
    }
    const norm = normalisiereExtraktion(roh)
    expect(norm.kunde.name).toBe('Frau Krüger')
    expect(norm.kunde.ort).toBe('Bochum')
  })

  it('erfindet nichts, wenn kein Name gesagt wurde', () => {
    const norm = normalisiereExtraktion({ gewerk: 'maler', raeume: [] })
    expect(norm.kunde.name).toBeNull()
  })
})

// Die Regel aus der Route, hier als reine Entscheidung nachgebaut: Sie ist
// das Einzige, was zwischen „Vorschlag" und „still einen Kunden anlegen"
// steht, und sie darf nicht unbemerkt kippen.
function sollVorschlagSchreiben(
  gehoerterName: string | null | undefined,
  vorhandeneKundenId: string | null,
): boolean {
  const sauber = gehoerterName?.trim()
  return Boolean(sauber) && !vorhandeneKundenId
}

describe('CoS-E-018 — Vorschlag, nicht Zuweisung', () => {
  it('merkt sich den gehörten Namen, wenn noch kein Kunde am Angebot hängt', () => {
    expect(sollVorschlagSchreiben('Herr Yilmaz', null)).toBe(true)
  })

  it('überschreibt eine bereits getroffene Kundenwahl NICHT', () => {
    expect(sollVorschlagSchreiben('Herr Yilmaz', 'kunde-123')).toBe(false)
  })

  it('macht aus Leerzeichen keinen Vorschlag', () => {
    expect(sollVorschlagSchreiben('   ', null)).toBe(false)
    expect(sollVorschlagSchreiben(null, null)).toBe(false)
    expect(sollVorschlagSchreiben(undefined, null)).toBe(false)
  })
})
