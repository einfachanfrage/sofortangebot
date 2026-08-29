// DC-037: Grundrisse, die der Handwerker schon während der Aufnahme
// gezeichnet hat, in die `raum_details` des Angebots übernehmen.
//
// Warum überhaupt eine eigene Funktion: `generiere-positionen/route.ts` baut
// `raum_details` bei jedem Lauf aus der KI-Extraktion neu auf. Eine gezeichnete
// Form kann die Extraktion nie erzeugen — sie muss also NACH der Extraktion
// und ausdrücklich wieder eingesetzt werden, sonst fällt der Raum stillschweigend
// auf ein Standard-Rechteck zurück (die Art Fehler, die der Nutzer erst merkt,
// wenn die Fläche im Angebot falsch ist).
import type { Wand } from '@/lib/raum-geometrie'

export type RaumDetail = {
  modus?: 'rechteck' | 'flaeche' | 'wand' | 'grundriss'
  breite?: number; laenge?: number; hoehe?: number; tueren?: number; fenster?: number
  tuerFlaeche?: number; fensterFlaeche?: number
  wandflaeche?: number; bodenflaeche?: number
  grundriss?: Wand[]
}

/** Eine Form unter drei Wänden ist kein geschlossener Raum — bewusst ignorieren. */
const MIN_WAENDE = 3

/**
 * Setzt gezeichnete Grundrisse in die aus der Extraktion gebauten Raumdaten.
 *
 * - Höhe, Türen und Fenster aus der Extraktion bleiben stehen: sie ergänzen den
 *   Grundriss (Umfang × Höhe − Öffnungen), statt mit ihm zu konkurrieren.
 * - `findeTitelName` ordnet den beim Zeichnen sichtbaren Raumnamen dem
 *   kanonischen Namen aus den Positions-Titeln zu — dieselbe unscharfe Logik,
 *   die die Route auch für Extraktions-Räume nutzt, keine zweite Matching-Regel.
 */
export function uebernehmeGrundrisse(
  raumDetails: Record<string, RaumDetail>,
  grundrisse: Record<string, Wand[]> | undefined,
  findeTitelName: (rawName: string) => string,
): Record<string, RaumDetail> {
  const ergebnis = { ...raumDetails }
  for (const [rawName, waende] of Object.entries(grundrisse ?? {})) {
    if (!rawName.trim() || !Array.isArray(waende) || waende.length < MIN_WAENDE) continue
    const key = findeTitelName(rawName.trim())
    ergebnis[key] = { ...ergebnis[key], modus: 'grundriss', grundriss: waende }
  }
  return ergebnis
}
