/**
 * Erschwerniszuschläge — welche der Betrieb automatisch vorgeschlagen haben will.
 *
 * ── CoS-E-040 / TN-097 (Manfred) ──────────────────────────────────────────
 *
 * *„Erschwerniszuschläge ‚Altbau'/‚bewohnt' lassen sich in den Einstellungen
 * nirgends abschalten."*
 *
 * Die Zuschläge entstehen aus dem Diktat: Sagt jemand „Altbau", schlägt die
 * Vollständigkeitsprüfung einen Altbau-Zuschlag vor. Für viele Betriebe ist
 * das richtig. Für einen, der ausschließlich im Altbau arbeitet, ist es
 * Unsinn — der Zuschlag steckt bei ihm längst im normalen Quadratmeterpreis,
 * und er löscht ihn in jedem Angebot von Hand. Das ist keine Einstellung,
 * das ist Handarbeit gegen die eigene Software.
 *
 * ── Warum das eine Liste ist und keine Wahrheit im Code ───────────────────
 *
 * Ein Zuschlag ist keine technische Eigenschaft, sondern eine
 * Kalkulationsentscheidung. Ob „bewohnt" Mehraufwand ist, weiß der Betrieb
 * und nicht die App. Deshalb steht hier nur, WELCHE es gibt und wie sie
 * heißen — ob sie greifen, entscheidet der Betrieb in den Einstellungen.
 *
 * NULL in der Datenbank heißt „nie etwas eingestellt" und bedeutet: alle an.
 * Das ist das bisherige Verhalten, und ein Update darf niemandem still
 * Zuschläge wegnehmen, die er bisher bekommen hat.
 */

export interface ErschwernisConfig {
  altbau?: boolean
  denkmalschutz?: boolean
  bewohnt?: boolean
  untergrund?: boolean
  raumhoehe?: boolean
}

export interface ErschwernisArt {
  id: keyof ErschwernisConfig
  /** Wie die Position heißt, wenn die Prüfung sie erzeugt. */
  titel: RegExp
  /** Beschriftung in den Einstellungen. */
  label: string
  /** Ein Satz, der erklärt, wann er ausgelöst wird. */
  erklaerung: string
}

export const ERSCHWERNIS_ARTEN: ErschwernisArt[] = [
  {
    id: 'altbau',
    titel: /^Erschwerniszuschlag Altbau/i,
    label: 'Altbau',
    erklaerung: 'Wird vorgeschlagen, wenn im Diktat „Altbau" vorkommt.',
  },
  {
    id: 'denkmalschutz',
    titel: /^Erschwerniszuschlag Denkmalschutz/i,
    label: 'Denkmalschutz',
    erklaerung: 'Wird vorgeschlagen, wenn im Diktat „Denkmalschutz" vorkommt.',
  },
  {
    id: 'bewohnt',
    titel: /^Erschwerniszuschlag bewohnt/i,
    label: 'Bewohnter Zustand',
    erklaerung: 'Wird vorgeschlagen, wenn das Objekt während der Arbeiten bewohnt ist.',
  },
  {
    id: 'untergrund',
    titel: /^Erschwerniszuschlag schwieriger Untergrund/i,
    label: 'Schwieriger Untergrund',
    erklaerung: 'Wird vorgeschlagen bei Nikotin, Ruß, Wasserflecken oder ähnlichen Altlasten.',
  },
  {
    id: 'raumhoehe',
    titel: /^Erschwerniszuschlag Raumhöhe/i,
    label: 'Raumhöhe über 3 m',
    erklaerung: 'Wird vorgeschlagen, wenn ein Raum höher als 3 m ist (Gerüst, Leiter).',
  },
]

/**
 * Ist dieser Zuschlag für diesen Betrieb eingeschaltet?
 *
 * Alles, was nicht ausdrücklich auf `false` steht, gilt als an — auch eine
 * Art, die es beim letzten Speichern der Einstellungen noch nicht gab.
 */
export function erschwernisAktiv(config: ErschwernisConfig | null | undefined, id: keyof ErschwernisConfig): boolean {
  return config?.[id] !== false
}

/**
 * Entfernt die Zuschläge, die der Betrieb abgeschaltet hat.
 *
 * Bewusst EINE Stelle statt einer Abfrage an jedem `push(...)`: Die Zuschläge
 * entstehen an fünf verschiedenen Orten in drei Dateien, und die nächste Art
 * entsteht an einem sechsten. Eine zentrale Filterung kann man nicht
 * vergessen — dieselbe Überlegung wie bei `automatisch_ergaenzt`.
 *
 * Positionen, die KEIN Erschwerniszuschlag sind, fasst die Funktion nie an.
 */
export function filtereErschwernis<T extends { beschreibung: string }>(
  positionen: T[],
  config: ErschwernisConfig | null | undefined,
): T[] {
  if (!config) return positionen
  const abgeschaltet = ERSCHWERNIS_ARTEN.filter(a => config[a.id] === false)
  if (abgeschaltet.length === 0) return positionen
  return positionen.filter(p => !abgeschaltet.some(a => a.titel.test(p.beschreibung ?? '')))
}
