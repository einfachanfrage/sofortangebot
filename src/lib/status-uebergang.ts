/**
 * DC-042 — Datenpfad für das neue Status-Modell (Sandys Entscheidungen vom
 * 2026-08-31). Bewusst eine reine, testbare Funktion ohne UI und ohne
 * Datenbank: die Oberfläche dazu baut der Product Designer, hier liegt nur,
 * WAS beim Statuswechsel mitgeschrieben werden muss.
 *
 * Punkt 3 — „Abgelehnt" unterscheidet jetzt zwischen einem echten Nein des
 * Kunden und „nie wieder gehört". Beides bleibt derselbe Status (die Liste,
 * die Zahlen und die Farbe ändern sich nicht), der Unterschied steckt in
 * `abgelehnt_grund`. Ohne Angabe bleibt das Feld leer — geraten wird nicht.
 *
 * Archivieren — der eigentliche Ausgang eines Angebots wurde bisher vom
 * Archivieren überschrieben: ein archiviertes, in Wahrheit beauftragtes
 * Angebot war hinterher nicht mehr von einem archivierten abgelehnten zu
 * unterscheiden. `status_vor_archiv` bewahrt ihn auf, `archiviert_am` sagt,
 * seit wann. Der Status selbst bleibt unverändert 'archived', damit keine
 * einzige bestehende Liste, Zählung oder Filterabfrage anders reagiert als
 * bisher — die Ergänzung ist additiv, nicht umbauend.
 */

export type AblehnungsGrund = 'aktiv' | 'keine_rueckmeldung'

export interface StatusPatch {
  status: string
  archiviert_am?: string | null
  status_vor_archiv?: string | null
  abgelehnt_grund?: AblehnungsGrund | null
}

export function statusPatch(
  aktuell: string,
  neu: string,
  optionen?: { grund?: AblehnungsGrund; jetzt?: Date },
): StatusPatch {
  const patch: StatusPatch = { status: neu }
  const jetzt = (optionen?.jetzt ?? new Date()).toISOString()

  if (neu === 'archived') {
    patch.archiviert_am = jetzt
    // Zweimal archivieren darf den bewahrten Ausgang nicht durch 'archived'
    // ersetzen — sonst wäre er beim zweiten Klick doch wieder weg.
    if (aktuell !== 'archived') patch.status_vor_archiv = aktuell
  } else if (aktuell === 'archived') {
    patch.archiviert_am = null
    patch.status_vor_archiv = null
  }

  if (neu === 'rejected') {
    patch.abgelehnt_grund = optionen?.grund ?? null
  } else if (aktuell === 'rejected') {
    patch.abgelehnt_grund = null
  }

  return patch
}

/**
 * Was im Angebot wirklich passiert ist — auch wenn es inzwischen archiviert
 * wurde. Für Anzeige und Statistik, damit „archiviert" keine Ergebnisse mehr
 * verschluckt.
 */
export function echterAusgang(quote: { status: string; status_vor_archiv?: string | null }): string {
  return quote.status === 'archived' && quote.status_vor_archiv
    ? quote.status_vor_archiv
    : quote.status
}

/** Tage, die ein Angebot schon beim Kunden liegt — null, wenn es nie raus ging. */
export function tageBeimKunden(gesendetAm: string | null | undefined, jetzt: Date = new Date()): number | null {
  if (!gesendetAm) return null
  const gesendet = new Date(gesendetAm)
  if (Number.isNaN(gesendet.getTime())) return null
  const tage = Math.floor((jetzt.getTime() - gesendet.getTime()) / 86_400_000)
  return tage < 0 ? 0 : tage
}
