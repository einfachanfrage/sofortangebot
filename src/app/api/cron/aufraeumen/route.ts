// Täglicher Aufräumlauf — zwei Fristen, ein Job.
//
// 1. Konten, deren 30-Tage-Frist abgelaufen ist, endgültig löschen.
//    Gegenstück zu `api/account/delete` (setzt `deleted_at`) und
//    `api/account/restore` (nimmt es zurück). Erst dieser Schritt macht aus
//    dem Soft-Delete die Löschung, die Datenschutzerklärung Abschnitt 8 und
//    AGB § 6.5 zusagen.
// 2. Audiodateien von Aufnahmen, die älter als 30 Tage sind, löschen.
//    Transkript und Positionen bleiben — siehe `aufnahmen-aufraeumen.ts`.
// 3. Dateien, deren Datenbankzeile es nicht mehr gibt, und abgelaufene
//    öffentliche PDFs löschen — siehe `speicher-aufraeumen.ts`. Punkt 2
//    arbeitet über die Datenbankzeilen und erreicht diese Dateien nie.
//
// Bewusst EIN Job statt zwei: dieselbe Frist, dieselbe Uhrzeit, und ein
// Cron-Eintrag weniger, um den man sich kümmern muss.
//
// Jeder Lauf schreibt eine Zeile nach `system_laeufe`. Ohne die ist ein Job,
// der nie startet, nicht von einem zu unterscheiden, der nichts zu tun hatte —
// der Erinnerungs-Job war deshalb monatelang unbemerkt tot.
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/nextjs'
import { loescheKontoHart, loeschreifVor, LOESCH_FRIST_TAGE } from '@/lib/konto-loeschung'
import { loescheAlteAufnahmen, AUFNAHME_FRIST_TAGE } from '@/lib/aufnahmen-aufraeumen'
import { protokolliereLauf } from '@/lib/system-laeufe'
import { raeumeSpeicherAuf } from '@/lib/speicher-aufraeumen'
import { meldeUeberfaelligeJobs } from '@/lib/job-wachhund'

// Viele Konten × Storage-Auflistung — kann dauern.
export const maxDuration = 300

function getSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET

  // 2026-09-02: Ein FEHLENDES Secret war bisher nicht von einem falschen zu
  // unterscheiden — beides 401, jeden Tag, ohne Spur. Eine fehlende
  // Konfiguration ist aber kein Angriffsversuch, sondern unser eigener Fehler
  // und muss laut sein.
  if (!cronSecret) {
    console.error('[aufraeumen] CRON_SECRET ist nicht gesetzt — der Job kann nie laufen')
    Sentry.captureException(new Error('CRON_SECRET nicht gesetzt: Aufräum-Job läuft nie'), {
      level: 'fatal',
      tags: { feature: 'cron_konfiguration' },
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()

  return protokolliereLauf<NextResponse>(supabase, 'aufraeumen', async () => {
    // ── 1. Fällige Konten ──────────────────────────────────────────────────
    const { data: faellige, error } = await supabase
      .from('companies')
      .select('id, user_id, deleted_at')
      .not('deleted_at', 'is', null)
      .lt('deleted_at', loeschreifVor())

    if (error) {
      console.error('[aufraeumen] Fällige Konten konnten nicht gelesen werden')
      Sentry.captureException(new Error(error.message), { tags: { feature: 'konto_purge_abfrage' } })
      return {
        ok: false,
        details: { schritt: 'konten_abfrage', fehler: error.message },
        ergebnis: NextResponse.json({ error: 'Abfrage fehlgeschlagen' }, { status: 500 }),
      }
    }

    const ergebnisse = []
    for (const konto of faellige ?? []) {
      const ergebnis = await loescheKontoHart(supabase, konto.user_id as string)
      ergebnisse.push(ergebnis)

      if (!ergebnis.ok) {
        // Nicht abbrechen: ein hängendes Konto darf die übrigen nicht
        // blockieren. Beim nächsten Lauf ist es wieder dabei, jeder Schritt
        // verträgt Wiederholung — aber wir wollen davon erfahren.
        console.error('[aufraeumen] Konto konnte nicht vollständig gelöscht werden')
        Sentry.captureException(
          new Error(`Konto-Löschung unvollständig: ${ergebnis.fehler.join(' | ')}`),
          { tags: { feature: 'konto_purge_loeschung' } },
        )
      }
    }

    // ── 2. Alte Sprachaufnahmen ────────────────────────────────────────────
    // Läuft unabhängig von den Konten — ein Fehlschlag oben darf diesen Teil
    // nicht ausfallen lassen.
    const aufnahmen = await loescheAlteAufnahmen(supabase)
    if (aufnahmen.fehler.length > 0) {
      console.error('[aufraeumen] Alte Sprachaufnahmen konnten nicht vollständig gelöscht werden')
      Sentry.captureException(
        new Error(`Aufnahmen-Aufräumen unvollständig: ${aufnahmen.fehler.join(' | ')}`),
        { tags: { feature: 'aufnahmen_aufraeumen' } },
      )
    }

    // ── 3. Verwaiste und abgelaufene Dateien ───────────────────────────────
    // Läuft auch dann, wenn oben etwas schiefging: Diese Dateien haben keine
    // Datenbankzeile mehr, die sie beim nächsten Mal wiederfindet.
    const speicher = await raeumeSpeicherAuf(supabase)
    const speicherFehler = speicher.flatMap(b => b.fehler)
    if (speicherFehler.length > 0) {
      console.error('[aufraeumen] Verwaiste Dateien konnten nicht vollständig gelöscht werden')
      Sentry.captureException(
        new Error(`Speicher-Aufräumen unvollständig: ${speicherFehler.join(' | ')}`),
        { tags: { feature: 'speicher_aufraeumen' } },
      )
    }

    // ── 4. Läuft der andere Job noch? ──────────────────────────────────────
    // Die beiden täglichen Jobs überwachen sich gegenseitig. Vorher hing die
    // Warnung an der Admin-Seite, die niemand von sich aus öffnet.
    const jobs = await meldeUeberfaelligeJobs(supabase, {
      ausser: 'aufraeumen',
      empfaenger: process.env.ADMIN_ALERT_EMAIL ?? 'sandraholm95@gmail.com',
    })

    // ── 5. Das Protokoll selbst ────────────────────────────────────────────
    // Ein Jahr reicht, um „lief der Job?" zu beantworten. Best effort — ein
    // volles Protokoll ist kein Grund, den Lauf als gescheitert zu melden.
    const vorEinemJahr = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
    await supabase.from('system_laeufe').delete().lt('gestartet_am', vorEinemJahr)

    const konten = {
      frist_tage: LOESCH_FRIST_TAGE,
      geprueft: faellige?.length ?? 0,
      geloescht: ergebnisse.filter(e => e.ok).length,
      unvollstaendig: ergebnisse.filter(e => !e.ok).length,
      dateien: ergebnisse.reduce((s, e) => s + e.dateien, 0),
    }
    const aufnahmenBericht = {
      frist_tage: AUFNAHME_FRIST_TAGE,
      geprueft: aufnahmen.geprueft,
      dateien: aufnahmen.dateien,
      fehler: aufnahmen.fehler.length,
    }

    const speicherBericht = speicher.map(b => ({
      bucket: b.bucket, gesamt: b.gesamt, verwaist: b.verwaist,
      geloescht: b.geloescht, uebersprungen: b.uebersprungen,
    }))

    return {
      ok: konten.unvollstaendig === 0 && aufnahmen.fehler.length === 0 && speicherFehler.length === 0,
      details: { konten, aufnahmen: aufnahmenBericht, speicher: speicherBericht, jobs },
      ergebnis: NextResponse.json({ konten, aufnahmen: aufnahmenBericht, speicher: speicherBericht, jobs }),
    }
  })
}
