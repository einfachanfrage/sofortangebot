/**
 * PD-019 Punkt 1 (PM-113, Prüfmeister 2026-09-16) — „Wohnzimmer streichen."
 * erzeugt null Positionen. Der Satz, den der Betrieb dafür bisher zu sehen
 * bekam, war „Keine Positionen erkannt" — und der ist in genau diesem Fall
 * unwahr: erkannt wurde die Leistung sehr wohl, nur ihre Menge nicht.
 *
 * „Null Positionen" hat zwei Ursachen, die sich für den Betrieb völlig
 * verschieden anfühlen:
 *
 *   1. Es wurde nichts verstanden (Rauschen, abgebrochener Satz, kein Gewerk).
 *      → „Noch nichts erkannt" ist wahr, der richtige Weg ist eine neue Aufnahme.
 *   2. Es wurde etwas verstanden, aber eine gestellte Rückfrage blieb offen.
 *      → Der richtige Weg ist dieselbe Rückfrage, nicht eine neue Aufnahme.
 *
 * Unterschieden werden sie an dem einzigen Merkmal, das sicher trägt: Gab es
 * zu dieser Runde Rückfragen, die unbeantwortet geblieben sind? Geraten wird
 * nichts — ohne offene Frage bleibt es beim bisherigen Weg.
 *
 * Damit gilt die harte Grenze aus DC-112 auch hier: nie null Positionen und
 * null Einträge.
 */

export type LeeresErgebnis =
  /** Gehört, aber nicht rechenbar: diese Fragen sind offen geblieben (Wortlaut). */
  | { art: 'offene_angaben'; fragen: string[] }
  /** Alles andere — bleibt beim bisherigen Fehlertext, unverändert. */
  | { art: 'fehler' }

/** `null` = bewusst übersprungen (PM-007), `undefined` = nie beantwortet. Beides zählt als offen. */
export type AntwortBestand = Record<string, unknown>

export const KEINE_POSITIONEN = 'Keine Positionen erkannt'

export function beurteileLeeresErgebnis(eingabe: {
  /** `error` aus der Antwort von /api/entwurf/generiere-positionen. */
  fehlerText: string
  /** Anzahl der Positionen, denen ein Preis in der Preisdatenbank fehlt. */
  anzahlFehlendePreise: number
  /** Die Rückfragen, die in dieser Runde gestellt wurden. */
  fragen: Array<{ id: string; frage: string }>
  /** Was davon beantwortet wurde. */
  antworten: AntwortBestand
}): LeeresErgebnis {
  // Ein fehlender Preis ist eine ganz andere Geschichte und hat einen eigenen,
  // präzisen Text. Er darf hier nie überschrieben werden.
  if (eingabe.anzahlFehlendePreise > 0) return { art: 'fehler' }
  if (eingabe.fehlerText !== KEINE_POSITIONEN) return { art: 'fehler' }

  const offen = eingabe.fragen
    .filter(f => !eingabe.antworten[f.id])
    .map(f => f.frage.trim())
    .filter(f => f.length > 0)

  return offen.length > 0 ? { art: 'offene_angaben', fragen: offen } : { art: 'fehler' }
}
