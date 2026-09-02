// Täglicher Aufräumlauf — zwei Fristen, ein Job.
//
// 1. Konten, deren 30-Tage-Frist abgelaufen ist, endgültig löschen.
//    Gegenstück zu `api/account/delete` (setzt `deleted_at`) und
//    `api/account/restore` (nimmt es zurück). Erst dieser Schritt macht aus
//    dem Soft-Delete die Löschung, die Datenschutzerklärung Abschnitt 8 und
//    AGB § 6.5 zusagen.
// 2. Audiodateien von Aufnahmen, die älter als 30 Tage sind, löschen.
//    Transkript und Positionen bleiben — siehe `aufnahmen-aufraeumen.ts`.
//
// Bewusst EIN Job statt zwei: dieselbe Frist, dieselbe Uhrzeit, und ein
// Cron-Eintrag weniger, um den man sich kümmern muss.
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/nextjs'
import { loescheKontoHart, loeschreifVor, LOESCH_FRIST_TAGE } from '@/lib/konto-loeschung'
import { loescheAlteAufnahmen, AUFNAHME_FRIST_TAGE } from '@/lib/aufnahmen-aufraeumen'

// Viele Konten × Storage-Auflistung — kann dauern.
export const maxDuration = 300

function getSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function GET(req: NextRequest) {
  // Gleiche Härtung wie in cron/reminder: ohne konfiguriertes Secret IMMER
  // ablehnen, sonst liefe der Vergleich gegen "Bearer undefined".
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()

  const { data: faellige, error } = await supabase
    .from('companies')
    .select('id, user_id, deleted_at')
    .not('deleted_at', 'is', null)
    .lt('deleted_at', loeschreifVor())

  if (error) {
    console.error('[aufraeumen] Fällige Konten konnten nicht gelesen werden')
    Sentry.captureException(new Error(error.message), { tags: { feature: 'konto_purge_abfrage' } })
    return NextResponse.json({ error: 'Abfrage fehlgeschlagen' }, { status: 500 })
  }

  const ergebnisse = []
  for (const konto of faellige ?? []) {
    const ergebnis = await loescheKontoHart(supabase, konto.user_id as string)
    ergebnisse.push(ergebnis)

    if (!ergebnis.ok) {
      // Nicht abbrechen: ein hängendes Konto darf die übrigen nicht blockieren.
      // Beim nächsten Lauf ist es wieder dabei, jeder Schritt verträgt
      // Wiederholung — aber wir wollen davon erfahren.
      console.error('[aufraeumen] Konto konnte nicht vollständig gelöscht werden')
      Sentry.captureException(
        new Error(`Konto-Löschung unvollständig: ${ergebnis.fehler.join(' | ')}`),
        { tags: { feature: 'konto_purge_loeschung' } },
      )
    }
  }

  // Aufnahmen laufen unabhängig von den Konten — ein Fehlschlag oben darf den
  // Teil hier nicht ausfallen lassen.
  const aufnahmen = await loescheAlteAufnahmen(supabase)
  if (aufnahmen.fehler.length > 0) {
    console.error('[aufraeumen] Alte Sprachaufnahmen konnten nicht vollständig gelöscht werden')
    Sentry.captureException(
      new Error(`Aufnahmen-Aufräumen unvollständig: ${aufnahmen.fehler.join(' | ')}`),
      { tags: { feature: 'aufnahmen_aufraeumen' } },
    )
  }

  return NextResponse.json({
    konten: {
      frist_tage: LOESCH_FRIST_TAGE,
      geprueft: faellige?.length ?? 0,
      geloescht: ergebnisse.filter(e => e.ok).length,
      unvollstaendig: ergebnisse.filter(e => !e.ok).length,
      dateien: ergebnisse.reduce((s, e) => s + e.dateien, 0),
    },
    aufnahmen: {
      frist_tage: AUFNAHME_FRIST_TAGE,
      geprueft: aufnahmen.geprueft,
      dateien: aufnahmen.dateien,
      fehler: aufnahmen.fehler.length,
    },
  })
}
