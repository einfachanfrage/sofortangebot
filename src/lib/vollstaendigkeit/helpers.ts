import type { BerechnetePosition } from '../mengen/types'

export function hat(positionen: BerechnetePosition[], ...begriffe: string[]): boolean {
  return positionen.some(p => p.beschreibung != null && begriffe.some(b => p.beschreibung.toLowerCase().includes(b)))
}

export function add(ergaenzt: BerechnetePosition[], fehlende: string[], beschreibung: string): void {
  if (!hat(ergaenzt, ...beschreibung.toLowerCase().split(' ').slice(0, 2))) {
    fehlende.push(beschreibung)
  }
}

/**
 * Findet den Raum, zu dem eine Arbeit gehört: sucht den Satz, der den Begriff
 * enthält ("im Wohnzimmer den Heizkörper lackieren"), und darin einen der
 * bekannten Raumnamen. So bekommen raumbezogene Positionen ihr "— Raum"-Suffix
 * und landen nicht im Allgemein-Topf.
 */
export function findeRaumImSatz(begriff: RegExp, lower: string, raumNamen: string[]): string | null {
  if (raumNamen.length === 0) return null
  for (const satz of (lower ?? '').split(/[.!?\n;]+/)) {
    if (!begriff.test(satz)) continue
    const treffer = raumNamen.find(r => satz.includes(r.toLowerCase()))
    if (treffer) return treffer
  }
  return null
}

/** Alle Raumnamen aus vorhandenen Positions-Suffixen ("… — Wohnzimmer"). */
export function raumNamenAus(positionen: BerechnetePosition[]): string[] {
  const namen: string[] = []
  for (const p of positionen) {
    const m = p.beschreibung?.match(/\s+[-–—]\s+(.+)$/)
    const n = m?.[1]?.trim()
    if (n && !namen.includes(n)) namen.push(n)
  }
  return namen
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
