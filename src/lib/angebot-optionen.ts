// Effektive Einstellungen für EIN Angebot.
//
// Regel überall: Wert am Angebot (Zahnrad) schlägt Betriebs-Einstellung schlägt
// Standard. NULL/undefined am Angebot = "erben".

import type { AngebotStruktur } from './angebot-struktur'
import { braucheWiderrufsbelehrung } from './widerrufsbelehrung'

export type DokumentTyp = 'angebot' | 'kostenvoranschlag'
export type PreisDarstellung = 'netto' | 'brutto'

export const DOKUMENT_TYP_LABEL: Record<DokumentTyp, string> = {
  angebot: 'Angebot',
  kostenvoranschlag: 'Kostenvoranschlag',
}

/** Was am Angebot überschrieben sein kann (NULL = erben). */
export interface AngebotOverrides {
  angebot_struktur?: AngebotStruktur | null
  kopftext?: string | null
  fusstext?: string | null
  zahlungsziel_tage?: number | null
  dokument_typ?: DokumentTyp | null
  skonto_prozent?: number | null
  skonto_tage?: number | null
  widerruf_beilegen?: boolean | null
  preis_darstellung?: PreisDarstellung | null
  /**
   * DC-056 (Manfred/TN-010, Sandys Entscheidung 12.09.2026): Kleinbeträge auf
   * dem Kundendokument zu einer Zeile zusammenfassen? NULL/undefined = nein.
   * Standard ist bewusst AUS — eine echte Aufstellung ist kein Fehler.
   */
  kleinbetraege_zusammenfassen?: boolean | null
}

/** Die relevanten Betriebs-Einstellungen. */
export interface BetriebsDefaults {
  angebot_struktur?: AngebotStruktur | null
  payment_days?: number | null
  angebot_gueltig_tage?: number | null
  widerruf_aktiv?: boolean | null
}

export interface EffektiveOptionen {
  struktur: AngebotStruktur
  kopftext: string | null
  fusstext: string | null
  zahlungszielTage: number
  gueltigTage: number
  dokumentTyp: DokumentTyp
  skontoProzent: number | null
  skontoTage: number | null
  /** Widerrufsbelehrung ans PDF hängen? */
  widerrufBeilegen: boolean
  preisDarstellung: PreisDarstellung
  /** DC-056: Kleinbeträge auf dem Kundendokument zu einer Zeile bündeln. */
  kleinbetraegeZusammenfassen: boolean
}

const STANDARD_ZAHLUNGSZIEL = 14
const STANDARD_GUELTIG = 30

/**
 * Löst die effektiven Optionen auf.
 * preis_darstellung: ohne Override richtet sie sich nach dem Kundentyp —
 * Privatkunden brauchen Endpreise (brutto, PAngV), Geschäftskunden netto.
 */
export function effektiveOptionen(
  quote: AngebotOverrides,
  company: BetriebsDefaults,
  kundeIstUnternehmen?: boolean | null,
): EffektiveOptionen {
  const widerrufAuto = braucheWiderrufsbelehrung({
    widerrufAktiv: company.widerruf_aktiv,
    kundeIstUnternehmen,
  })

  return {
    struktur: quote.angebot_struktur ?? company.angebot_struktur ?? 'raeume',
    kopftext: (quote.kopftext ?? '').trim() || null,
    fusstext: (quote.fusstext ?? '').trim() || null,
    zahlungszielTage: quote.zahlungsziel_tage ?? company.payment_days ?? STANDARD_ZAHLUNGSZIEL,
    gueltigTage: company.angebot_gueltig_tage ?? STANDARD_GUELTIG,
    dokumentTyp: quote.dokument_typ ?? 'angebot',
    skontoProzent: quote.skonto_prozent ?? null,
    skontoTage: quote.skonto_tage ?? null,
    // Explizites Nein am Angebot gewinnt; sonst automatisch nach Kundentyp
    widerrufBeilegen: quote.widerruf_beilegen ?? widerrufAuto,
    preisDarstellung: quote.preis_darstellung ?? (kundeIstUnternehmen === true ? 'netto' : 'brutto'),
    // Kein Erben vom Betrieb: die Frage „wie ausführlich ist DIESES Angebot"
    // hängt am einzelnen Angebot, nicht am Betrieb. Fehlt die Spalte noch,
    // ist das Ergebnis false und das Dokument verhält sich wie bisher.
    kleinbetraegeZusammenfassen: quote.kleinbetraege_zusammenfassen === true,
  }
}

/** "2 % Skonto bei Zahlung innerhalb von 10 Tagen" — oder null. */
export function skontoText(o: EffektiveOptionen): string | null {
  if (!o.skontoProzent || o.skontoProzent <= 0 || !o.skontoTage || o.skontoTage <= 0) return null
  const p = String(o.skontoProzent).replace('.', ',')
  return `${p} % Skonto bei Zahlung innerhalb von ${o.skontoTage} Tagen.`
}

// ── Gültigkeit des Angebots (CoS-E-013/031/042, Manfred 11.09.2026) ────────
//
// Drei Meldungen, eine Ursache: Die Einstellung „Angebot gültig für 30 Tage"
// wurde zwar oben zu `gueltigTage` aufgelöst — aber niemand hat sie je
// benutzt. Das Dokument las ausschließlich `quotes.valid_until`, und der Weg,
// auf dem Angebote heute wirklich entstehen (`api/entwurf/neu`, der
// Aufnahme-Flow), setzt dieses Feld überhaupt nicht. Ergebnis auf dem
// Kunden-PDF: keine Gültigkeitsdauer, dafür prominent „Zahlungsziel: 14
// Tage". Manfred: „Das ist Rechnungssprache. Aufs Angebot gehört ‚gültig
// bis …'."
//
// Bewusst RECHNEN statt speichern:
//   * Es erreicht den Bestand. Die Angebote, die schon in der Datenbank
//     liegen, haben kein `valid_until` — eine neue Spalte oder ein Setzen
//     beim Anlegen hätte für die alle nichts geändert.
//   * Es bleibt in sich stimmig. Das PDF zeigt oben „Datum" (= created_at);
//     „gültig bis" ist genau dieses Datum plus die eingestellten Tage. Der
//     Kunde kann es nachrechnen.
//   * Ein Entwurf, der drei Wochen liegen bleibt, hätte sonst schon beim
//     Versand eine halb abgelaufene Frist mitgebracht.
// Ein ausdrücklich am Angebot gesetztes Datum (Zahnrad) schlägt die Rechnung
// weiterhin — sonst könnte der Handwerker seine eigene Eingabe nicht halten.

/**
 * Das Datum, bis zu dem das Angebot gilt — als ISO-Datum (YYYY-MM-DD).
 * `valid_until` am Angebot gewinnt; sonst Dokumentdatum + eingestellte Tage.
 */
export function gueltigBis(
  quote: { valid_until?: string | null; created_at?: string | null },
  gueltigTage: number,
): string | null {
  if (quote.valid_until) return quote.valid_until.slice(0, 10)
  if (!quote.created_at) return null
  const d = new Date(quote.created_at)
  if (Number.isNaN(d.getTime())) return null
  d.setDate(d.getDate() + gueltigTage)
  return d.toISOString().slice(0, 10)
}
