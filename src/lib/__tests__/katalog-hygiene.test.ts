import { describe, expect, it } from 'vitest'
import { DEFAULT_PRICES } from '../default-prices'
import { ALLGEMEINE_PREISE, GEWERK_PREISE } from '../preise-vorlagen'

// Sandys Auftrag (2026-08-24): "es stört mich, ändere das" — zu zwei Rubriken
// für dieselbe Sache im selben Gewerk ("Abbruch – Erschwernisse" neben
// "Abbruch – Erschwernisse & Zuschläge"). Entstanden ist das nicht durch einen
// Tippfehler, sondern weil eine spätere Erweiterung (strukturierte
// VOB/DIN-Erschwerniszuschläge) eine eigene Rubrik-Schreibweise mitbrachte,
// statt die vorhandene zu benutzen. Genau diese Klasse von Drift fängt dieser
// Test ab — er ersetzt Aufräumen im Nachhinein durch Auffallen beim Anlegen.

const VORLAGEN = [...ALLGEMEINE_PREISE, ...Object.values(GEWERK_PREISE).flat()]

/** Rubrik-Paare, die absichtlich ähnlich heißen und NICHT dasselbe sind. */
const ERLAUBTE_AEHNLICHE_RUBRIKEN = new Set([
  // Parkett neu verlegen vs. vorhandenes Parkett abschleifen/aufarbeiten —
  // zwei verschiedene Arbeiten, gehören fachlich getrennt.
  'Boden::Parkett::Parkett Aufarbeitung',
])

function rubrikenProGewerk(rows: ReadonlyArray<{ category: string }>): Map<string, Set<string>> {
  const proGewerk = new Map<string, Set<string>>()
  for (const p of rows) {
    const i = p.category.indexOf(' – ')
    if (i < 0) continue // rubriklose Sammelkategorien wie "Allgemein"
    const gewerk = p.category.slice(0, i)
    const rubrik = p.category.slice(i + 3)
    if (!proGewerk.has(gewerk)) proGewerk.set(gewerk, new Set())
    proGewerk.get(gewerk)!.add(rubrik)
  }
  return proGewerk
}

function beinahDubletten(rows: ReadonlyArray<{ category: string }>): string[] {
  const norm = (s: string) => s.toLocaleLowerCase('de-DE').replace(/[^a-zäöüß]/g, '')
  const treffer: string[] = []
  for (const [gewerk, rubriken] of rubrikenProGewerk(rows)) {
    const arr = [...rubriken].sort()
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const a = norm(arr[i])
        const b = norm(arr[j])
        if (!a.includes(b) && !b.includes(a)) continue
        if (ERLAUBTE_AEHNLICHE_RUBRIKEN.has(`${gewerk}::${arr[i]}::${arr[j]}`)) continue
        treffer.push(`${gewerk}: "${arr[i]}" und "${arr[j]}"`)
      }
    }
  }
  return treffer
}

describe('Katalog-Hygiene', () => {
  it('hat je Gewerk keine zwei Rubriken für offensichtlich dasselbe (Standardpreise)', () => {
    expect(beinahDubletten(DEFAULT_PRICES)).toEqual([])
  })

  it('hat je Gewerk keine zwei Rubriken für offensichtlich dasselbe (Onboarding-Vorlagen)', () => {
    expect(beinahDubletten(VORLAGEN)).toEqual([])
  })

  it('schreibt Erschwernis-Rubriken überall gleich', () => {
    const schreibweisen = new Set<string>()
    for (const p of [...DEFAULT_PRICES, ...VORLAGEN]) {
      if (!/erschwernis/i.test(p.category)) continue
      schreibweisen.add(p.category.slice(p.category.indexOf(' – ') + 3))
    }
    expect([...schreibweisen]).toEqual(['Erschwernisse & Zuschläge'])
  })

  it('führt keine Position doppelt innerhalb derselben Rubrik', () => {
    const zaehler = new Map<string, number>()
    for (const p of DEFAULT_PRICES) {
      const key = `${p.category}::${p.title.toLocaleLowerCase('de-DE')}::${p.unit.toLocaleLowerCase('de-DE')}`
      zaehler.set(key, (zaehler.get(key) ?? 0) + 1)
    }
    expect([...zaehler.entries()].filter(([, n]) => n > 1).map(([k]) => k)).toEqual([])
  })
})
