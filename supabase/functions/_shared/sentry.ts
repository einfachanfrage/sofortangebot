// CoS-P-002 (Platform & Integrations Engineer, 2026-09-06): eine Stelle für
// die Sentry-Anbindung der Edge Functions — gleiche Lehre wie bei
// ki-usage.ts (CoS-015): einmal richtig statt fünfmal beinah richtig.
//
// Bisher hatte KEINE der fünf Deno-Functions eine eigene Sentry-Verbindung —
// ein Fehler in `ki-extrahieren` (der einzigen davon, die laut Aufruf-Logs
// tatsächlich noch produktiv läuft, siehe Nachtrag zu CoS-P-002 in
// chief-of-staff-platform-todos.md) landete bisher nur in der
// Supabase-eigenen Log-Konsole — niemand bekommt einen Alarm.
//
// Setzt voraus, dass `SENTRY_DSN` als Edge-Function-Secret gesetzt ist
// (`supabase secrets set SENTRY_DSN=... --project-ref <ref>`, für Staging
// UND Produktion). Ist das Secret nicht gesetzt, meldet diese Datei das
// einmal über console.warn und bleibt danach still — ein fehlendes Secret
// darf niemals einen echten Request zum Absturz bringen.

// deno-lint-ignore no-explicit-any
let sentryModul: any = null
let initVersucht = false
let dsnFehlteBereitsGemeldet = false

async function ladeSentry() {
  if (initVersucht) return sentryModul
  initVersucht = true

  const dsn = Deno.env.get('SENTRY_DSN')
  if (!dsn) {
    if (!dsnFehlteBereitsGemeldet) {
      console.warn('[sentry] SENTRY_DSN nicht gesetzt — Fehler dieser Function werden NICHT an Sentry gemeldet, nur in die Konsole geschrieben.')
      dsnFehlteBereitsGemeldet = true
    }
    return null
  }

  try {
    // Version + Importpfad wie im offiziellen Supabase-Beispiel
    // (github.com/supabase/supabase/blob/master/examples/edge-functions/
    // supabase/functions/sentry/index.ts) — dort `npm:@sentry/deno@^10`.
    const mod = await import('npm:@sentry/deno@^10')
    // SUPABASE_URL wird von der Edge-Runtime automatisch gesetzt und enthält
    // die Projekt-Ref (z. B. https://yqlledouhfovytifeekd.supabase.co) —
    // daraus Staging/Produktion unterscheiden, ohne ein weiteres Secret zu
    // brauchen. Produktions-Ref: yqlledouhfovytifeekd.
    const projectUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const environment = projectUrl.includes('yqlledouhfovytifeekd') ? 'production' : 'staging'
    mod.init({
      dsn,
      integrations: [],
      debug: false,
      // Edge Functions sind kurzlebig — Performance-Tracing bringt hier
      // wenig und kostet nur Sentry-Kontingent. Nur Fehler.
      tracesSampleRate: 0,
      environment,
    })
    // SB_REGION/SB_EXECUTION_ID: von der Edge-Runtime automatisch gesetzt,
    // gleiche Tags wie im offiziellen Supabase-Beispiel — hilft beim
    // Nachvollziehen, welcher konkrete Aufruf einen Fehler hatte.
    mod.setTag('region', Deno.env.get('SB_REGION') ?? 'unbekannt')
    mod.setTag('execution_id', Deno.env.get('SB_EXECUTION_ID') ?? 'unbekannt')
    sentryModul = mod
    return sentryModul
  } catch (fehler) {
    console.error('[sentry] Sentry-SDK konnte nicht geladen werden:', fehler)
    return null
  }
}

/**
 * Meldet einen Fehler an Sentry, falls konfiguriert — sonst reine
 * Konsolen-Ausgabe. Wartet auf den Versand (`flush`), weil eine Edge
 * Function nach der Antwort jederzeit beendet werden kann; ohne Warten
 * käme das Ereignis oft gar nicht mehr raus. Wirft selbst nie — ein
 * Problem bei der Fehlermeldung darf nie den eigentlichen Fehler
 * verschlucken oder einen zweiten Fehler auslösen.
 */
export async function meldeFehler(
  error: unknown,
  tags: Record<string, string> = {},
): Promise<void> {
  try {
    const sentry = await ladeSentry()
    if (!sentry) return
    sentry.captureException(error, { tags })
    await sentry.flush(2000)
  } catch (meldeFehlerSelbst) {
    console.error('[sentry] Fehlermeldung an Sentry selbst fehlgeschlagen:', meldeFehlerSelbst)
  }
}
