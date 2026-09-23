import type { SupabaseClient } from '@supabase/supabase-js'
import { PRICING } from './pricing'

// ── CoS-038-B (Head of Product Engineering, 23.09.2026) ───────────────────
//
// „Kein Gratis-Kontingent." Diese Datei hat bis heute die Monatszählung aus
// DC-045 durchgesetzt: 3 neu angelegte Angebote pro Kalendermonat, danach
// gesperrt, dauerhaft und für jeden Starter-Betrieb.
//
// Das Modell, das diese Zahl trug, gibt es seit Sandys Entscheidung vom
// 03.09. nicht mehr (`docs/preismodell.md`): EIN bezahlter Tarif, davor
// 14 Tage testen ohne Kreditkarte, kein Dauer-Gratis-Tarif. Der Platform &
// Integrations Engineer hat die Datenseite dafür am 06.09. gebaut
// (CoS-P-007) und die neue Sperrregel im Handoff wörtlich festgelegt:
//
//   gesperrt (neues Angebot anlegen), wenn `plan === 'starter'` UND
//   `trial_ends_at` gesetzt UND `trial_ends_at < jetzt`. Firmen mit
//   `trial_ends_at = NULL` sind Bestandskonten und von der Sperre ausgenommen.
//
// Genau das steht jetzt hier. `PRICING.freeAngeboteProMonat` ist damit weg,
// nicht auf 0 gesetzt — eine 0 wäre eine Zahl, die jemand später wieder
// hochdrehen kann, ohne die Entscheidung dahinter zu sehen.
//
// ── Was aus DC-045 UNVERÄNDERT gilt ──────────────────────────────────────
//
// 1. **Gesperrt wird nur das ANLEGEN eines neuen Angebots.** Ein bereits
//    begonnener Entwurf lässt sich immer zu Ende bearbeiten, versenden und
//    bezahlen. Wer beim Kunden steht, darf nicht mitten in der Aufnahme
//    hängenbleiben — eine Grenze, die das täte, wäre schlimmer als gar keine.
// 2. **Pro wird nie gesperrt.**
// 3. **Eine Quelle für Anzeige und Sperre.** Die Abo-Seite liest dieselbe
//    Funktion, die auch blockiert. Eine Zahl, die man sieht, und eine andere,
//    die blockiert, wäre der schlimmste Ausgang.
//
// Was aus DC-045 WEGFÄLLT, ist ausschließlich die Monatszählung: Revisionen,
// Monatsgrenze, freigewordene Plätze. Ohne Kontingent gibt es nichts mehr zu
// zählen, das sperrt. Die Zählung selbst bleibt als reine ANZEIGE erhalten
// (`zaehleNeueAngeboteDiesenMonat`) — sie steht auf der Abo-Seite und ist
// dort eine Auskunft, keine Schranke.

/** Grund, aus dem das Anlegen gesperrt ist. */
export type SperrGrund = 'keine' | 'testphase_abgelaufen'

export interface AngebotsSperre {
  /** true = das nächste NEUE Angebot ist gesperrt. */
  gesperrt: boolean
  grund: SperrGrund
  /** Ende der Testphase, ISO. null = Pro oder Bestandskonto ohne Testphase. */
  testEndeISO: string | null
  /**
   * Volle Tage bis zum Ende der Testphase. 0 = läuft heute ab,
   * negativ = seit so vielen Tagen abgelaufen, null = keine Testphase.
   */
  tageRestlich: number | null
  /** Bestandskonto (`trial_ends_at = NULL`) — von der Sperre ausgenommen. */
  istBestandskonto: boolean
}

export function istProPlan(plan: string | null | undefined): boolean {
  return (plan ?? 'starter') !== 'starter'
}

export function monatsStartISO(jetzt = new Date()): string {
  return new Date(jetzt.getFullYear(), jetzt.getMonth(), 1).toISOString()
}

const MS_PRO_TAG = 24 * 60 * 60 * 1000

/**
 * Die Regel selbst — ohne Datenbank, damit sie prüfbar ist, ohne Supabase
 * nachzubauen. `pruefeAngebotsSperre` unten ist nur die Zuleitung.
 */
export function bewerteTestphase(
  plan: string | null | undefined,
  trialEndsAt: string | null | undefined,
  jetzt: Date = new Date(),
): AngebotsSperre {
  if (istProPlan(plan)) {
    return { gesperrt: false, grund: 'keine', testEndeISO: null, tageRestlich: null, istBestandskonto: false }
  }

  // Bestandskonten: `trial_ends_at` ist bewusst leer (CoS-P-007). Sie nie zu
  // sperren ist Absicht — ihnen rückwirkend eine Testphase anzudichten, die
  // dann sofort abgelaufen wäre, würde sie über Nacht aussperren.
  if (!trialEndsAt) {
    return { gesperrt: false, grund: 'keine', testEndeISO: null, tageRestlich: null, istBestandskonto: true }
  }

  const ende = new Date(trialEndsAt)
  if (Number.isNaN(ende.getTime())) {
    // Unlesbares Datum sperrt nicht. Ein kaputter Wert in einer Spalte darf
    // niemanden vor dem Kunden aussperren; er gehört gemeldet, nicht vollstreckt.
    return { gesperrt: false, grund: 'keine', testEndeISO: null, tageRestlich: null, istBestandskonto: false }
  }

  const abgelaufen = ende.getTime() <= jetzt.getTime()
  return {
    gesperrt: abgelaufen,
    grund: abgelaufen ? 'testphase_abgelaufen' : 'keine',
    testEndeISO: ende.toISOString(),
    tageRestlich: Math.floor((ende.getTime() - jetzt.getTime()) / MS_PRO_TAG),
    istBestandskonto: false,
  }
}

/**
 * Liest Plan und Testphasen-Ende des Betriebs und wendet `bewerteTestphase`
 * an. EINE Quelle für die Anzeige (Abo-Seite) und für die Sperre (Entwurf
 * anlegen).
 *
 * Die Spalten werden hier selbst geladen und nicht von der aufrufenden Route
 * durchgereicht: sonst muss jede Route daran denken, `trial_ends_at` in ihr
 * `select` aufzunehmen, und die erste, die es vergisst, sperrt niemanden mehr
 * — ohne dass es auffällt. Genau die Streuung, an der die Grenze vor DC-045
 * schon einmal gescheitert ist.
 */
export async function pruefeAngebotsSperre(
  supabase: SupabaseClient,
  companyId: string,
): Promise<AngebotsSperre> {
  const { data, error } = await supabase
    .from('companies')
    .select('plan, trial_ends_at')
    .eq('id', companyId)
    .single()

  if (error || !data) {
    // Fehlt die Spalte (Migration nicht ausgeführt) oder scheitert der Lesevorgang,
    // wird NICHT gesperrt. Dieselbe Vorsicht wie bei `baustelle_id` in den
    // Insert-Routen: lieber ein Angebot zu viel als eine Route, die jemanden
    // beim Kunden stehen lässt.
    return { gesperrt: false, grund: 'keine', testEndeISO: null, tageRestlich: null, istBestandskonto: false }
  }

  return bewerteTestphase(
    data.plan as string | null,
    data.trial_ends_at as string | null,
    new Date(),
  )
}

/**
 * Zählt die im laufenden Kalendermonat NEU angelegten Angebote (ohne
 * Revisionen). Reine ANZEIGE für die Abo-Seite — seit CoS-038-B hängt daran
 * keine Sperre mehr.
 */
export async function zaehleNeueAngeboteDiesenMonat(
  supabase: SupabaseClient,
  companyId: string,
): Promise<number> {
  const seit = monatsStartISO()

  // Revisionen tragen `original_id`. Sollte die Spalte in einer Umgebung
  // fehlen, wird ohne den Filter gezählt statt zu scheitern.
  const gefiltert = await supabase
    .from('quotes')
    .select('id', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .gte('created_at', seit)
    .is('original_id', null)

  if (!gefiltert.error) return gefiltert.count ?? 0

  const roh = await supabase
    .from('quotes')
    .select('id', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .gte('created_at', seit)
  return roh.count ?? 0
}

/**
 * Der Text, den der Nutzer zu sehen bekommt. Einmal formuliert, nicht dreimal.
 *
 * ⚠ Der zweite Satz ist unverändert der aus DC-045 („Angefangene Angebote …"),
 * weil die Zusage dieselbe geblieben ist. Nur der erste Satz ist neu: das
 * Kontingent ist durch die Testphase ersetzt. Die ZAHL kommt aus PRICING.
 * Der Wortlaut liegt beim Head of Marketing zur Bestätigung (Notiz in
 * `chief-of-staff-marketing-todos.md`, 23.09.).
 */
export function sperrNachricht(): string {
  return `Deine ${PRICING.testTage} Tage zum Testen sind vorbei. `
    + 'Angefangene Angebote kannst du weiter bearbeiten und versenden — '
    + 'für ein neues brauchst du ein Abo.'
}
