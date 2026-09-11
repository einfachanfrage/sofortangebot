// DC-003: EINE Quelle für Angebots-Status → Label/Farbe, statt der bisher
// fünf voneinander unabhängigen Kopien (AngebotDetail.tsx, angebote/page.tsx,
// dashboard/page.tsx, MobileQuoteCard.tsx, kunden/[id]/page.tsx), die sich
// beim selben Status in Label UND Farbe widersprochen haben (z. B. "Offen"
// vs. "Versendet", drei verschiedene Grün-Töne für "Beauftragt", 'bereit'
// fiel auf der Angebote-Liste stumm auf grauen "Entwurf"-Stil zurück).
// Jede Stelle im Produkt, die einen Status anzeigt oder ändern lässt, soll
// ab jetzt AUSSCHLIESSLICH von hier importieren, keine eigene Kopie mehr
// anlegen.
//
// 'in_bearbeitung' ist bewusst ein Alias von 'draft' (identisches Label,
// identische Farbe) — beide werden im Produkt an keiner Stelle sichtbar
// unterschieden, siehe die alten DRAFT_STATUSES-Gruppierung in
// AngebotDetail.tsx. Der tote 'viewed'-Status (in mehreren alten
// Label-Tabellen vorhanden, aber nirgends im Code je geschrieben) taucht
// hier bewusst nicht mehr auf.

// DC-042 (2026-08-30): Sandy fand die Statuslogik "nicht klar und clean
// genug" — komplette Bestandsaufnahme ergab u. a., dass "Fertiggestellt"
// mit der Alltagsbedeutung von "fertig = erledigt" kollidiert (bedeutet
// hier nur "ich bin mit dem Rechnen fertig, Kunde hat's noch nicht
// gesehen") und "Offen" nicht sagt, WER gerade dran ist. Sandys Go
// ("dc042 deinen vorschklag auch live stellen", 2026-08-30): nur diese
// zwei Labels umbenannt, der Rest bleibt unverändert — mehr Umbenennung
// hätte nur neue Gewöhnung gekostet, ohne etwas zu gewinnen. Das
// Archivieren-als-Flag-statt-Status (Punkt 2 im Konzept, überschreibt
// aktuell den echten Ausgang) braucht eine DB-Migration und ist bewusst
// NICHT Teil dieser Änderung — liegt als Spec bei Head of Product
// Engineering (siehe design-check.md DC-042).

import type { QuoteStatus } from './types'

export interface StatusInfo {
  /** Anzeige-Text, überall im Produkt identisch */
  label: string
  /** Hintergrund-Klasse für Badges/Pills */
  bg: string
  /** Text-Klasse für Badges/Pills */
  text: string
  /** Kräftige, volltonige Farbe für Punkte/Ränder (kein Pastell) */
  dot: string
  /**
   * DC-053 (2026-09-11, Manfred/TN-003): Ein Satz, der sagt, was der Status
   * BEDEUTET — "Bereit versteh ich nicht. Bereit wofür? Fertig geschrieben,
   * noch nicht raus? Sag's mir." Das Label allein beantwortet die Frage
   * nicht, und die Antwort stand bisher nur als Code-Kommentar hier oben
   * bzw. in einem Empty-State, den man nur sieht, wenn nichts da ist.
   * Gehört zur Status-Quelle selbst, damit jede Stelle, die einen Status
   * erklärt, denselben Satz nimmt.
   */
  hilfe: string
}

export const STATUS_CONFIG: Record<QuoteStatus, StatusInfo> = {
  draft: { label: 'Entwurf', bg: 'bg-anthracite/8', text: 'text-anthracite/50', dot: '#9CA3AF', hilfe: 'Noch in Arbeit — du kannst weiter aufmessen und rechnen.' },
  in_bearbeitung: { label: 'Entwurf', bg: 'bg-anthracite/8', text: 'text-anthracite/50', dot: '#9CA3AF', hilfe: 'Noch in Arbeit — du kannst weiter aufmessen und rechnen.' },
  // Fertig kalkuliert, aber noch nicht beim Kunden — bewusst Gelb (Marke,
  // "handlungsbereit"), nicht Grün: Grün bleibt für "Kunde hat zugesagt"
  // reserviert, sonst wirken zwei ganz unterschiedlich wichtige Momente
  // (selbst fertig vs. Kunde hat beauftragt) optisch gleich bedeutsam.
  bereit: { label: 'Bereit', bg: 'bg-[#FEF9C3]', text: 'text-[#8B7000]', dot: '#D9A400', hilfe: 'Fertig gerechnet, aber noch nicht beim Kunden.' },
  sent: { label: 'Beim Kunden', bg: 'bg-blue-50', text: 'text-blue-700', dot: '#3B82F6', hilfe: 'Raus an den Kunden — du wartest auf Antwort.' },
  accepted: { label: 'Beauftragt', bg: 'bg-[#EDFAF0]', text: 'text-[#1A7A38]', dot: '#22C55E', hilfe: 'Kunde hat zugesagt.' },
  rejected: { label: 'Abgelehnt', bg: 'bg-red-50', text: 'text-red-700', dot: '#EF4444', hilfe: 'Kunde hat abgesagt.' },
  archived: { label: 'Archiviert', bg: 'bg-gray-100', text: 'text-gray-500', dot: '#9CA3AF', hilfe: 'Abgelegt — taucht in der normalen Liste nicht mehr auf.' },
}

/** Fällt nie auf "falsch eingefärbt" zurück — unbekannter/alter Status zeigt neutral Grau statt eines zufälligen anderen Status. */
export function getStatusInfo(status: string): StatusInfo {
  return STATUS_CONFIG[status as QuoteStatus] ?? STATUS_CONFIG.draft
}

// Als string[] statt QuoteStatus[] getypt (bewusst, nicht aus Nachlässigkeit):
// currentStatus in AngebotDetail.tsx ist seit jeher ein einfaches string
// (siehe Kommentar dort), u. a. weil 'bereit' lange nicht im QuoteStatus-Typ
// stand. .includes(currentStatus) an den bestehenden Aufrufstellen bräuchte
// sonst überall einen zusätzlichen Cast.
/** Noch nicht kalkuliert/fertig — hier ist der Aufmaß-Editor die Hauptansicht. */
export const DRAFT_STATUSES: string[] = ['draft', 'in_bearbeitung']
/** Schon beim Kunden bzw. entschieden — Bearbeiten öffnet hier den Revisions-Weg, nicht den normalen Editor. */
export const SENT_STATUSES: string[] = ['sent', 'accepted', 'rejected']

/**
 * Status, die im "Status ändern"-Sheet manuell wählbar sind, abhängig vom
 * aktuellen Status (DC-003: vorher fix ['bereit','sent','accepted',
 * 'rejected','archived'] — 'draft' war nie manuell erreichbar, nur als
 * versteckter Nebeneffekt von "Bearbeiten"). Zurück zu "Entwurf" nur ab
 * 'bereit' anbieten, NICHT ab sent/accepted/rejected — die haben schon
 * einen bewussteren, extra abgesicherten "Neue Version"-Weg (SENT_STATUSES,
 * siehe handleEditClick in AngebotDetail.tsx); der einfache Status-Picker
 * soll den nicht umgehen können.
 */
export function waehlbareStatus(aktuell: string): QuoteStatus[] {
  const basis: QuoteStatus[] = ['bereit', 'sent', 'accepted', 'rejected', 'archived']
  return aktuell === 'bereit' ? ['draft', ...basis] : basis
}
