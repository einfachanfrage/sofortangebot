// Schrumpf-Prüfung (CoS-P-025) — dritter Datenverlust in zwei Tagen.
//
// `docs-sichern.mjs pruefen` findet Textreste NACH der Endmarkierung. Der
// dritte Vorfall hatte eine andere Form: eine Pflichtdatei wurde beim
// Zurückschreiben schlicht kürzer (649 bzw. 458 Zeilen weniger), die
// Endmarkierung blieb dabei intakt — der bestehende Prüfer schlug nicht an.
// Betroffen war auch `.github/workflows/ci.yml` selbst, vier Tage lang
// unbemerkt. Diese Tests decken die reine Kernfunktion ab, ohne echtes Git.
import { describe, it, expect } from 'vitest'
import { schrumpfBefunde } from '../../../scripts/docs-sichern.mjs'

function groessen(karte: Record<string, number>) {
  return (pfad: string) => (pfad in karte ? karte[pfad] : null)
}

describe('Schrumpf-Befunde', () => {
  it('meldet eine Pflichtdatei, die kleiner geworden ist', () => {
    const vorher = groessen({ 'docs/design-check.md': 547217 })
    const jetzt = groessen({ 'docs/design-check.md': 513757 })
    const funde = schrumpfBefunde(['docs/design-check.md'], vorher, jetzt, 'irgendein Commit')
    expect(funde).toHaveLength(1)
    expect(funde[0]).toContain('docs/design-check.md')
    expect(funde[0]).toContain('547217')
    expect(funde[0]).toContain('513757')
  })

  it('meldet nichts, wenn die Datei gleich groß bleibt oder wächst', () => {
    const vorher = groessen({ 'docs/a.md': 100000 })
    const jetzt = groessen({ 'docs/a.md': 100000 })
    expect(schrumpfBefunde(['docs/a.md'], vorher, jetzt, '')).toEqual([])

    const jetztGewachsen = groessen({ 'docs/a.md': 150000 })
    expect(schrumpfBefunde(['docs/a.md'], vorher, jetztGewachsen, '')).toEqual([])
  })

  it('meldet KEINEN Fund bei einer winzigen Schrumpfung (getrimmtes Leerzeichen o.Ä.) — kein Fehlalarm', () => {
    // Genau der Fall, den `endmarkierung.mjs` als schlimmer als kein Prüfer
    // beschreibt: ein paar Byte Unterschied sind kein Datenverlust.
    const vorher = groessen({ 'docs/design-check.md': 575692 })
    const jetzt = groessen({ 'docs/design-check.md': 575689 }) // 3 B weniger
    expect(schrumpfBefunde(['docs/design-check.md'], vorher, jetzt, '')).toEqual([])
  })

  it('meldet einen Fund erst, wenn die Schwelle überschritten ist', () => {
    // 1000 B Datei, 1 % = 10 B, absolute Schwelle 500 B greift hier -> 400 B
    // weniger bleibt unauffällig, 600 B weniger meldet.
    const vorher = groessen({ 'docs/a.md': 1000 })
    expect(schrumpfBefunde(['docs/a.md'], vorher, groessen({ 'docs/a.md': 600 }), '')).toEqual([])
    expect(schrumpfBefunde(['docs/a.md'], vorher, groessen({ 'docs/a.md': 400 }), '')).toHaveLength(1)
  })

  it('überspringt Dateien, die bei einer der beiden Revisionen nicht existierten (neu/gelöscht)', () => {
    const vorher = groessen({}) // Datei existierte vorher nicht — neu angelegt
    const jetzt = groessen({ 'docs/neu.md': 500 })
    expect(schrumpfBefunde(['docs/neu.md'], vorher, jetzt, '')).toEqual([])
  })

  it('meldet nichts, wenn der Commit-Text das Kürzen ausdrücklich erlaubt', () => {
    const vorher = groessen({ 'docs/a.md': 1000 })
    const jetzt = groessen({ 'docs/a.md': 200 })
    const erlaubtNachricht = 'docs: Archiv-Abschnitt gekürzt [schrumpfung erlaubt]'
    expect(schrumpfBefunde(['docs/a.md'], vorher, jetzt, erlaubtNachricht)).toEqual([])
  })

  it('der Marker ist gross-/kleinschreibungsunempfindlich', () => {
    const vorher = groessen({ 'docs/a.md': 1000 })
    const jetzt = groessen({ 'docs/a.md': 200 })
    expect(schrumpfBefunde(['docs/a.md'], vorher, jetzt, '[SCHRUMPFUNG ERLAUBT]')).toEqual([])
  })

  it('erkennt genau die Fehlerform von CoS-P-025: ci.yml wird beschädigt, ohne dass es auffällt', () => {
    const vorher = groessen({ '.github/workflows/ci.yml': 24000 })
    const jetzt = groessen({ '.github/workflows/ci.yml': 21000 })
    const funde = schrumpfBefunde(['.github/workflows/ci.yml'], vorher, jetzt, 'ci.yml Schritt ergänzt')
    expect(funde).toHaveLength(1)
    expect(funde[0]).toContain('.github/workflows/ci.yml')
  })

  it('prüft mehrere Dateien unabhängig voneinander', () => {
    const vorher = groessen({ 'docs/a.md': 100000, 'docs/b.md': 200000 })
    const jetzt = groessen({ 'docs/a.md': 100000, 'docs/b.md': 150000 })
    const funde = schrumpfBefunde(['docs/a.md', 'docs/b.md'], vorher, jetzt, '')
    expect(funde).toHaveLength(1)
    expect(funde[0]).toContain('docs/b.md')
  })
})
