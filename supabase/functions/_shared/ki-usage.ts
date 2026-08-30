// CoS-015: Eine Stelle für die Kosten-Protokollierung der Edge Functions.
//
// Vorher schrieb jede der vier Functions ihren eigenen Insert — alle vier mit
// denselben falschen Spaltennamen (`prompt_typ`/`input_tokens`/`output_tokens`
// /`angebot_id` statt `endpunkt`/`tokens_in`/`tokens_out`). Die echte Tabelle
// hat diese Spalten nicht, jeder Insert scheiterte. Gemerkt hat es niemand,
// weil das Ergebnis mit `.then(() => {})` weggeworfen wurde: seit dem
// 20.07.2026 kam für `extraktion` kein einziger Eintrag mehr an, während die
// Rechnung von OpenAI normal weiterlief.
//
// Zwei Lehren, die hier festgehalten sind:
//   1. Die Spaltennamen stehen einmal, nicht viermal.
//   2. Ein Fehler wird protokolliert. Kosten-Tracking darf den Request nie
//      blockieren — aber lautlos scheitern darf es auch nicht.

// deno-lint-ignore no-explicit-any
type SupabaseClient = any

/** Erlaubte Werte der Spalte `endpunkt` — bewusst eng, damit Auswertungen stabil bleiben. */
export type KIEndpunkt = 'extraktion' | 'matching' | 'plausibilitaet' | 'transkription'

export async function trackKIUsage(
  supabase: SupabaseClient,
  params: {
    userId: string
    endpunkt: KIEndpunkt
    tokensIn?: number
    tokensOut?: number
    kostenEur?: number
  },
): Promise<void> {
  try {
    const { error } = await supabase.from('ki_usage').insert({
      user_id: params.userId,
      endpunkt: params.endpunkt,
      tokens_in: Math.round(params.tokensIn ?? 0),
      tokens_out: Math.round(params.tokensOut ?? 0),
      kosten_eur: params.kostenEur ?? 0,
    })
    if (error) {
      console.error(`[ki_usage] Kosten-Eintrag "${params.endpunkt}" nicht gespeichert:`, error.message)
    }
  } catch (fehler) {
    console.error(`[ki_usage] Kosten-Eintrag "${params.endpunkt}" fehlgeschlagen:`, fehler)
  }
}
