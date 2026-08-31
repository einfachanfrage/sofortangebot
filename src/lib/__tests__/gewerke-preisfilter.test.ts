// Der Gewerke-Filter vor dem Preis-Matcher: greift er für JEDES Gewerk, das
// die Extraktion vergeben darf?
//
// Hintergrund: Allgemeine Positionen (Anfahrt, Kleinstauftrag, Möbel rücken)
// stehen im Katalog einmal pro Gewerk — mit unterschiedlichen Preisen. Wenn
// der Filter für ein Gewerk nicht greift, konkurrieren alle Gewerke um
// denselben Titel, und weil die Preise nach Rubrik sortiert geladen werden,
// gewinnt der alphabetisch erste — praktisch immer "Abbruch". Das fällt
// niemandem auf: die Position ist da, sie hat einen Preis, er ist nur der
// eines fremden Gewerks.
import { describe, expect, it } from 'vitest'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { GEWERK_KATEGORIE_PREFIXE } from '../gewerke-config'
import { findePreisposition } from '../preis-matcher'
import { readFileSync } from 'node:fs'

/**
 * Der Prompt, der WIRKLICH läuft — er liegt in der Edge Function, nicht in
 * `src/`. Bewusst von der Platte gelesen statt importiert: so kann kein
 * zweiter, ungenutzter Prompt entstehen, gegen den Tests grün laufen, während
 * live etwas anderes passiert (genau das ist am 30.08.2026 passiert).
 */
const PROMPT_LIVE = readFileSync('supabase/functions/_shared/prompt-extraktion-v4.ts', 'utf8')


/** Die Gewerke, die der Extraktions-Prompt als einzige vergeben darf. */
const EXTRAKTIONS_GEWERKE = ['maler', 'fliesen', 'trockenbau', 'boden_parkett', 'sanitaer_heizung', 'elektro']

const ANFAHRT_IM_KATALOG: Array<[string, number]> = [
  ['Abbruch – Anfahrt & Organisation', 65],
  ['Boden – Anfahrt & Organisation', 45],
  ['Elektro – Anfahrt & Organisation', 45],
  ['Fliesen – Anfahrt & Organisation', 45],
  ['Maler – Anfahrt & Organisation', 45],
  ['SHK – Anfahrt & Organisation', 55],
  ['Trockenbau – Anfahrt & Organisation', 45],
]

const katalog = ANFAHRT_IM_KATALOG.map(([category, unit_price], i) => ({
  id: String(i), title: 'Anfahrt pauschal (bis 20 km)', category, unit: 'Pauschale', unit_price,
}))

describe('Gewerke-Filter vor dem Preis-Matcher', () => {
  it('deckt genau die Gewerke ab, die der Extraktions-Prompt vergeben darf', () => {
    // Schutz gegen die eigentliche Fehlerursache: ein neues Gewerk im Prompt,
    // für das niemand ein Rubrik-Präfix hinterlegt — der Filter fällt dann
    // still auf "passt zu allem" zurück.
    for (const gewerk of EXTRAKTIONS_GEWERKE) {
      expect(PROMPT_LIVE).toContain(gewerk)
      expect(GEWERK_KATEGORIE_PREFIXE[gewerk]?.length ?? 0).toBeGreaterThan(0)
    }
  })

  it('lässt für jedes Gewerk nur die eigenen Rubriken zu', () => {
    for (const gewerk of EXTRAKTIONS_GEWERKE) {
      const eigene = katalog.filter(p => preisKategoriePasstZuGewerk(p.category, gewerk))
      expect(eigene.length).toBeGreaterThan(0)
      expect(eigene.every(p => !p.category.startsWith('Abbruch'))).toBe(true)
    }
  })

  it('nimmt bei einer allgemeinen Position den Preis des eigenen Gewerks', () => {
    const preisFuer = (gewerk: string) => findePreisposition(
      'Anfahrt pauschal (bis 20 km)', 'Pauschale',
      katalog.filter(p => preisKategoriePasstZuGewerk(p.category, gewerk)),
    )?.position

    expect(preisFuer('maler')?.category).toBe('Maler – Anfahrt & Organisation')
    expect(preisFuer('boden_parkett')?.category).toBe('Boden – Anfahrt & Organisation')
    // Vor dem Fix landeten diese beiden bei "Abbruch – …" mit 65 € statt 45/55 €.
    expect(preisFuer('fliesen')?.category).toBe('Fliesen – Anfahrt & Organisation')
    expect(preisFuer('sanitaer_heizung')?.category).toBe('SHK – Anfahrt & Organisation')
  })

  it('bleibt ohne bekanntes Gewerk beim bisherigen Verhalten (kein Filter)', () => {
    expect(preisKategoriePasstZuGewerk('Abbruch – Anfahrt & Organisation', undefined)).toBe(true)
    expect(preisKategoriePasstZuGewerk('Abbruch – Anfahrt & Organisation', 'allrounder')).toBe(true)
  })
})
