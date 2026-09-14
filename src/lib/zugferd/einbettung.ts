// DC-100 — die eine Stelle, die über E-Rechnung entscheidet.
//
// Vorgeschichte (design-check.md, DC-100): Das Produkt erzeugt ausschließlich
// Angebote und Kostenvoranschläge. In das Angebots-PDF wurde trotzdem eine
// ZUGFeRD-XML eingebettet, die sich selbst als RECHNUNG auswies
// (`ExchangedDocument/TypeCode` = 380, `fx:DocumentType` = INVOICE). Bei
// Geschäftskunden ging sie zusätzlich als eigene Datei mit der E-Mail raus —
// also direkt in die Buchhaltung des Kunden. Sandy hat am 13.09.2026
// entschieden: abschalten, vor Gate 1.
//
// Warum eine eigene Datei und nicht dreimal `if (false)`:
// Dieselbe Bedingung stand in drei Routen (`api/pdf`, `api/email`,
// `api/quotes/[id]/send`) plus einer vierten Route ohne jede Bedingung
// (`api/pdf/xrechnung`). Genau diese Streuung ist der Grund, warum der
// Fehler jahrelang niemandem auffiel. Ab jetzt gibt es einen Schalter, und
// er liegt hier.
//
// Der Code zum Erzeugen und Einbetten bleibt bestehen und ist in Ordnung —
// er ist nur nicht mehr erreichbar. Sobald es echte Rechnungen gibt, wird
// 'rechnung' in E_RECHNUNG_DOKUMENTTYPEN aufgenommen und alles vier
// Aufrufstellen leben wieder auf, ohne dass eine davon vergessen werden kann.

import type { DokumentTyp } from '../angebot-optionen'

/**
 * Dokumenttypen, für die eine E-Rechnungs-XML entstehen darf.
 *
 * Die Liste ist leer — und das IST DC-100. Eine XML, die sich als Rechnung
 * ausweist, darf nur zu einer Rechnung gehören. Angebot und
 * Kostenvoranschlag sind keine.
 */
export const E_RECHNUNG_DOKUMENTTYPEN: readonly DokumentTyp[] = []

/**
 * Klartext für Oberfläche und Antworten. Bewusst ohne Fachbegriffe: Der Satz
 * landet unter Umständen vor einem Handwerker, nicht vor einem Entwickler.
 */
export const E_RECHNUNG_ABGESCHALTET =
  'E-Rechnungen entstehen erst beim Abrechnen. Ein Angebot ist keine Rechnung ' +
  'und bekommt deshalb keine E-Rechnungs-Datei.'

export interface ERechnungLage {
  /** `quotes.dokument_typ`. NULL/undefined wird wie 'angebot' behandelt. */
  dokumentTyp?: DokumentTyp | null
  /** `companies.e_rechnung_aktiv`. NULL/undefined gilt als aktiv. */
  eRechnungAktiv?: boolean | null
  /** Nur Geschäftskunden hatten je eine XML bekommen. */
  kundeIstUnternehmen?: boolean | null
}

/**
 * Darf für dieses Dokument eine E-Rechnungs-XML entstehen — eingebettet ins
 * PDF, als Anhang oder als reiner XRechnung-Download?
 *
 * Reihenfolge der Prüfung ist Absicht: Der Dokumenttyp steht VORNE. Er ist
 * die rechtliche Frage; alles andere sind Einstellungen. Ein Betrieb kann
 * den Schalter nicht so stellen, dass ein Angebot zur Rechnung wird.
 */
export function eRechnungErlaubt(lage: ERechnungLage): boolean {
  const typ: DokumentTyp = lage.dokumentTyp ?? 'angebot'
  if (!E_RECHNUNG_DOKUMENTTYPEN.includes(typ)) return false
  if (lage.eRechnungAktiv === false) return false
  return lage.kundeIstUnternehmen === true
}
