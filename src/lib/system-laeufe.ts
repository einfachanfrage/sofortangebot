// Protokoll für Hintergrundjobs (Head of Product Engineering, 2026-09-02)
//
// Warum das existiert: Ein Cron-Job, der nie startet, sieht von außen exakt
// so aus wie einer, der nichts zu tun hatte. Beim Erinnerungs-Job hat dieser
// blinde Fleck Monate gehalten — er hat nie eine E-Mail verschickt, und
// niemand konnte das sehen, weil es keine Spur gab.
//
// Jeder Lauf schreibt jetzt eine Zeile: Start, Ende, Erfolg, Ergebnis. Damit
// ist „hat der Job gelaufen?" eine Abfrage, keine Vermutung — und zwar auch
// dann, wenn niemand Zugriff auf die Hosting-Oberfläche hat.

import type { SupabaseClient } from '@supabase/supabase-js'

export interface LaufErgebnis<T> {
  ergebnis: T
  ok: boolean
  details?: Record<string, unknown>
}

/**
 * Führt einen Job aus und protokolliert ihn — auch wenn er wirft.
 *
 * Das Protokoll darf den Job nie zu Fall bringen: schlägt das Schreiben fehl
 * (z. B. weil die Migration noch nicht gelaufen ist), läuft der Job trotzdem.
 * Ein fehlendes Protokoll ist ärgerlich, ein nicht gelöschtes Konto ist ein
 * Rechtsverstoß.
 */
export async function protokolliereLauf<T>(
  service: SupabaseClient,
  job: string,
  arbeit: () => Promise<LaufErgebnis<T>>,
): Promise<T> {
  const gestartet = new Date().toISOString()
  let laufId: string | null = null

  try {
    const { data } = await service
      .from('system_laeufe')
      .insert({ job, gestartet_am: gestartet })
      .select('id')
      .single()
    laufId = (data?.id as string) ?? null
  } catch { /* Protokoll ist Beiwerk, nicht Voraussetzung */ }

  const abschluss = async (ok: boolean, details?: Record<string, unknown>, fehler?: string) => {
    if (!laufId) return
    try {
      await service
        .from('system_laeufe')
        .update({ beendet_am: new Date().toISOString(), ok, details: details ?? null, fehler: fehler ?? null })
        .eq('id', laufId)
    } catch { /* siehe oben */ }
  }

  try {
    const { ergebnis, ok, details } = await arbeit()
    await abschluss(ok, details)
    return ergebnis
  } catch (e) {
    await abschluss(false, undefined, e instanceof Error ? e.message : String(e))
    throw e
  }
}

/** Wann lief dieser Job zuletzt erfolgreich? `null` = noch nie. */
export async function letzterErfolgreicherLauf(
  service: SupabaseClient,
  job: string,
): Promise<Date | null> {
  const { data } = await service
    .from('system_laeufe')
    .select('beendet_am')
    .eq('job', job)
    .eq('ok', true)
    .order('beendet_am', { ascending: false })
    .limit(1)
    .maybeSingle()
  const wert = data?.beendet_am as string | undefined
  return wert ? new Date(wert) : null
}

/**
 * Ist ein täglicher Job überfällig? Zwei Tage Puffer, damit ein einzelner
 * Ausfall (Deploy, Wartungsfenster) keinen Fehlalarm auslöst — aber ein
 * dauerhaft toter Job auffällt.
 */
export function istUeberfaellig(letzterLauf: Date | null, jetzt: Date = new Date(), maxStunden = 48): boolean {
  if (!letzterLauf) return true
  return jetzt.getTime() - letzterLauf.getTime() > maxStunden * 60 * 60 * 1000
}
