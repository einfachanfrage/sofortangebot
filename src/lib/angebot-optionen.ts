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
  }
}

/** "2 % Skonto bei Zahlung innerhalb von 10 Tagen" — oder null. */
export function skontoText(o: EffektiveOptionen): string | null {
  if (!o.skontoProzent || o.skontoProzent <= 0 || !o.skontoTage || o.skontoTage <= 0) return null
  const p = String(o.skontoProzent).replace('.', ',')
  return `${p} % Skonto bei Zahlung innerhalb von ${o.skontoTage} Tagen.`
}
