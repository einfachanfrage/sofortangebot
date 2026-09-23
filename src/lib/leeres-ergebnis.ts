import { istZeitAusschlussHinweis } from '@/lib/zeit-ausschluss'
import { istBauteilAusschlussHinweis } from '@/lib/bauteil-ausschluss'
import { hinweisRang, sortiereHinweise } from '@/lib/hinweis-rang'

/**
 * PD-019 Punkt 1 (PM-113, Prüfmeister 2026-09-16) — „Wohnzimmer streichen."
 * erzeugt null Positionen. Der Satz, den der Betrieb dafür bisher zu sehen
 * bekam, war „Keine Positionen erkannt" — und der ist in genau diesem Fall
 * unwahr: erkannt wurde die Leistung sehr wohl, nur ihre Menge nicht.
 *
 * „Null Positionen" hat DREI Ursachen, die sich für den Betrieb völlig
 * verschieden anfühlen:
 *
 *   1. Es wurde nichts verstanden (Rauschen, abgebrochener Satz, kein Gewerk).
 *      → „Noch nichts erkannt" ist wahr, der richtige Weg ist eine neue Aufnahme.
 *   2. Es wurde etwas verstanden, aber eine gestellte Rückfrage blieb offen.
 *      → Der richtige Weg ist dieselbe Rückfrage, nicht eine neue Aufnahme.
 *   3. PD-026/DC-143: Es wurde alles verstanden und gerechnet — und danach hat
 *      eine Bremse (Zeit- oder Bauteil-Ausschluss) jede Position wieder
 *      abgeräumt. Der richtige Weg ist ein Satz, der die Ansage zurücknimmt;
 *      eine neue Aufnahme desselben Diktats führt exakt hierher zurück.
 *
 * Unterschieden werden 1 und 2 an dem einzigen Merkmal, das sicher trägt: Gab
 * es zu dieser Runde Rückfragen, die unbeantwortet geblieben sind? Fall 3 hat
 * sein eigenes, genauso hartes Merkmal: die Route hat eine Hinweiszeile
 * mitgeschickt, die sagt, dass etwas **herausgenommen** wurde.
 *
 * **Warum eine offene Rückfrage vorgeht (Rangfolge 2 vor 3):** Wer eine Frage
 * offen gelassen hat, kann sie beantworten und ist damit fertig — das ist der
 * kürzere Weg zurück ins Angebot. Die Reihenfolge ist außerdem die
 * unveränderte: Fall 2 verhält sich genau wie vor DC-143.
 *
 * **Warum eine Rückfrage-Zeile (PM-136) Fall 3 NICHT auslöst:** Sie sagt
 * ausdrücklich, dass **nichts** entfernt wurde („bleiben im Angebot"). Eine
 * Zeile, die nichts wegnimmt, kann kein leeres Blatt erklären — sie darf
 * mitfahren, aber sie darf nicht der Grund sein. Sonst stünde über einem
 * leeren Blatt eine Begründung, die es nicht begründet.
 *
 * Damit gilt die harte Grenze aus DC-112 auch hier: nie null Positionen und
 * null Einträge.
 */

export type LeeresErgebnis =
  /** Gehört, aber nicht rechenbar: diese Fragen sind offen geblieben (Wortlaut). */
  | { art: 'offene_angaben'; fragen: string[] }
  /**
   * PD-026/DC-143: Gehört, gerechnet — und auf Ansage des Betriebs wieder
   * abgeräumt. `hinweise` sind die Bannerzeilen im Rohtext, bereits in der
   * Bannerreihenfolge (DC-142); gelesen werden sie von denselben
   * `zerlege…`-Funktionen wie im Bernsteinbanner.
   */
  | { art: 'alles_ausgeschlossen'; hinweise: string[] }
  /** Alles andere — bleibt beim bisherigen Fehlertext, unverändert. */
  | { art: 'fehler' }

/** `null` = bewusst übersprungen (PM-007), `undefined` = nie beantwortet. Beides zählt als offen. */
export type AntwortBestand = Record<string, unknown>

export const KEINE_POSITIONEN = 'Keine Positionen erkannt'

/**
 * Sagt die Zeile, dass etwas aus dem Angebot **herausgenommen** wurde?
 *
 * Bewusst nicht `hinweisRang(z) > 0`: das wäre „ist irgendeine Ausschluss-
 * Sorte" und schlösse die Rückfrage (PM-136) mit ein, die das Gegenteil
 * behauptet. Hier zählt nur, was ein leeres Blatt tatsächlich erklärt.
 */
function nimmtEtwasWeg(zeile: string): boolean {
  return istZeitAusschlussHinweis(zeile) || istBauteilAusschlussHinweis(zeile)
}

export function beurteileLeeresErgebnis(eingabe: {
  /** `error` aus der Antwort von /api/entwurf/generiere-positionen. */
  fehlerText: string
  /** Anzahl der Positionen, denen ein Preis in der Preisdatenbank fehlt. */
  anzahlFehlendePreise: number
  /** Die Rückfragen, die in dieser Runde gestellt wurden. */
  fragen: Array<{ id: string; frage: string }>
  /** Was davon beantwortet wurde. */
  antworten: AntwortBestand
  /**
   * DC-143: `warnungen` aus derselben Antwort. Fehlt das Feld (ältere Route,
   * alter Zwischenspeicher), verhält sich alles wie vor DC-143 — die Bremsen
   * sind dann schlicht nicht bekannt, und geraten wird nichts.
   */
  hinweise?: string[]
}): LeeresErgebnis {
  // Ein fehlender Preis ist eine ganz andere Geschichte und hat einen eigenen,
  // präzisen Text. Er darf hier nie überschrieben werden.
  if (eingabe.anzahlFehlendePreise > 0) return { art: 'fehler' }
  if (eingabe.fehlerText !== KEINE_POSITIONEN) return { art: 'fehler' }

  const offen = eingabe.fragen
    .filter(f => !eingabe.antworten[f.id])
    .map(f => f.frage.trim())
    .filter(f => f.length > 0)

  if (offen.length > 0) return { art: 'offene_angaben', fragen: offen }

  const zeilen = eingabe.hinweise ?? []
  if (zeilen.some(nimmtEtwasWeg)) {
    // Mitgegeben wird alles, was ins Bernsteinbanner gehört — auch die
    // Rückfrage, die für sich allein nicht ausgelöst hätte: sie gehört zum
    // selben Diktat und ist oben am wichtigsten (DC-142). Sortiert wird mit
    // derselben Funktion wie im Banner, damit es keine zweite Reihenfolge gibt.
    return { art: 'alles_ausgeschlossen', hinweise: sortiereHinweise(zeilen.filter(z => hinweisRang(z) > 0)) }
  }

  return { art: 'fehler' }
}
