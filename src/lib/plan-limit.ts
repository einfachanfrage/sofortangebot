import type { SupabaseClient } from '@supabase/supabase-js'
import { PRICING } from './pricing'

// ── DC-045, Sandys Entscheidung vom 06.09.2026: „A — harte Grenze" ────────
//
// „Ab dem 4. Angebot geht es erst nach dem Upgrade weiter."
//
// Vorher stand die Grenze an ZWEI Stellen und an keiner davon richtig:
//   * `api/quotes/create` hatte `PLAN_LIMITS.starter = 5` — eine dritte Zahl
//     neben den 3 aus der Werbung. Und diese Route wird nur beim DUPLIZIEREN
//     eines Angebots aufgerufen.
//   * `api/entwurf/neu` — der Weg, den jeder echte Nutzer geht — hatte gar
//     keine Prüfung.
// Genau die Streuung, gegen die `pricing.ts` angelegt wurde. Deshalb steht
// die Regel jetzt einmal hier und liest ihre Zahl von dort.
//
// ── Zwei Festlegungen, die eine harte Grenze zwingend braucht ─────────────
//
// 1. **Gesperrt wird nur das ANLEGEN eines neuen Angebots.** Ein bereits
//    begonnener Entwurf lässt sich immer zu Ende bearbeiten, versenden und
//    bezahlen. Wer beim Kunden steht, darf nicht mitten in der Aufnahme
//    hängenbleiben — eine Grenze, die das täte, wäre schlimmer als gar keine.
//
// 2. **Revisionen zählen nicht mit.** Eine Revision ist eine neue Fassung
//    desselben Angebots (`original_id` gesetzt), kein neuer Auftrag. Würden
//    sie zählen, wäre der Monat nach einem Kunden mit zwei Änderungswünschen
//    aufgebraucht — der Handwerker würde dafür bestraft, dass er sorgfältig
//    arbeitet.
//
// Gezählt werden also die im laufenden Kalendermonat NEU angelegten
// Angebote. Ein gelöschter Entwurf gibt seinen Platz wieder frei; das ist
// gewollt, ein Fehlversuch soll nicht den Monat kosten.

export interface AngebotsLimit {
  /** true = das nächste NEUE Angebot ist gesperrt. */
  erreicht: boolean
  /** Neu angelegte Angebote im laufenden Kalendermonat (ohne Revisionen). */
  anzahl: number
  /** null = unbegrenzt (Pro). */
  limit: number | null
}

export function monatsStartISO(jetzt = new Date()): string {
  return new Date(jetzt.getFullYear(), jetzt.getMonth(), 1).toISOString()
}

export function istProPlan(plan: string | null | undefined): boolean {
  return (plan ?? 'starter') !== 'starter'
}

/**
 * Zählt die neu angelegten Angebote des laufenden Monats und sagt, ob die
 * Grenze erreicht ist. EINE Quelle für die Anzeige (Abo-Seite) und für die
 * Sperre (Entwurf anlegen) — eine Zahl, die man sieht, und eine andere, die
 * blockiert, wäre der schlimmste Ausgang.
 */
export async function pruefeAngebotsLimit(
  supabase: SupabaseClient,
  companyId: string,
  plan: string | null | undefined,
): Promise<AngebotsLimit> {
  if (istProPlan(plan)) return { erreicht: false, anzahl: 0, limit: null }

  const limit = PRICING.freeAngeboteProMonat
  const seit = monatsStartISO()

  // Revisionen tragen `original_id`. Sollte die Spalte in einer Umgebung
  // fehlen, wird ohne den Filter gezählt statt zu scheitern — dieselbe
  // Vorsicht wie bei `baustelle_id` in den Insert-Routen. Lieber eine
  // Revision zu viel gezählt als eine Route, die 500 wirft.
  const gefiltert = await supabase
    .from('quotes')
    .select('id', { count: 'exact', head: true })
    .eq('company_id', companyId)
    .gte('created_at', seit)
    .is('original_id', null)

  const anzahl = gefiltert.error
    ? (await supabase
        .from('quotes')
        .select('id', { count: 'exact', head: true })
        .eq('company_id', companyId)
        .gte('created_at', seit)).count ?? 0
    : gefiltert.count ?? 0

  return { erreicht: anzahl >= limit, anzahl, limit }
}

/** Der Text, den der Nutzer zu sehen bekommt. Einmal formuliert, nicht dreimal. */
export function limitNachricht(limit: number): string {
  return `Im Starter-Plan sind ${limit} Angebote pro Monat enthalten. `
    + 'Angefangene Angebote kannst du weiter bearbeiten und versenden — '
    + 'für ein neues brauchst du Pro.'
}
