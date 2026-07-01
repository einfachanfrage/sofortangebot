import type { BerechnetePosition } from '../mengen/types'

export function hat(positionen: BerechnetePosition[], ...begriffe: string[]): boolean {
  return positionen.some(p => p.beschreibung != null && begriffe.some(b => p.beschreibung.toLowerCase().includes(b)))
}

export function add(ergaenzt: BerechnetePosition[], fehlende: string[], beschreibung: string): void {
  if (!hat(ergaenzt, ...beschreibung.toLowerCase().split(' ').slice(0, 2))) {
    fehlende.push(beschreibung)
  }
}

export function addMitMenge(ergaenzt: BerechnetePosition[], beschreibung: string, menge: number, einheit: string, berechnungsweg: string): void {
  if (!hat(ergaenzt, ...beschreibung.toLowerCase().split(' ').slice(0, 2))) {
    ergaenzt.push({ beschreibung, menge, einheit, konfidenz: 'high', berechnungsweg, annahmen: [] })
  }
}

// Ersetzt den ergaenzt.length = 0 + forEach-Pattern
export function filtereArray(ergaenzt: BerechnetePosition[], filterFn: (p: BerechnetePosition) => boolean): void {
  const gefiltert = ergaenzt.filter(filterFn)
  ergaenzt.length = 0
  gefiltert.forEach(p => ergaenzt.push(p))
}

// Zahl vor/nach Schlüsselwort im Text suchen
export function anzahlAus(lower: string, schluessel: string, fallback = 1): number {
  const escaped = schluessel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const vorher = new RegExp(`(\\d+)\\s*(?:stück\\s*)?(?:[a-zäöüß]+)?${escaped}`, 'i')
  const nachher = new RegExp(`${escaped}\\s*(\\d+)`, 'i')
  const stueckAllgemein = new RegExp(`(\\d+)\\s*stück`, 'i')
  const m = lower.match(vorher) ?? lower.match(nachher) ?? lower.match(stueckAllgemein)
  return m ? parseInt(m[1]) : fallback
}
