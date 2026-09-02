// Wachhund für die Hintergrundjobs (Head of Product Engineering, 2026-09-02)
//
// Peinlicher Nachtrag zum Vormittag: Ich habe die Warnung „Hintergrundjob
// läuft nicht" in `api/admin/api-health-check` gebaut — eine Route, die
// NUR von der Admin-Seite von Hand aufgerufen wird. Es gibt keinen Cron
// dafür (`api_versionen.letzter_test` ist bei allen fünf Einträgen leer, die
// Route lief also noch nie). Eine Warnung, die nur sieht, wer ohnehin
// nachschaut, ist keine Warnung.
//
// Jetzt prüfen sich die beiden täglichen Jobs gegenseitig: Der Aufräum-Job
// (3:30) meldet, wenn der Erinnerungs-Job seit über 48 Stunden nichts
// gemeldet hat, und umgekehrt. Ein einzelner toter Job fällt damit
// spätestens am nächsten Tag auf.
//
// Ehrliche Grenze: Sind BEIDE Jobs tot — der wahrscheinlichste Fall, weil
// beide am selben `CRON_SECRET` hängen —, kann keiner den anderen melden.
// Dagegen hilft nur ein Blick von außen: `system_laeufe` ist leer, dann ist
// nichts gelaufen. Genau dafür gibt es die Tabelle.

import type { SupabaseClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { letzterErfolgreicherLauf, istUeberfaellig } from './system-laeufe'

export const UEBERWACHTE_JOBS = ['aufraeumen', 'reminder'] as const
export type UeberwachterJob = typeof UEBERWACHTE_JOBS[number]

export const JOB_BESCHREIBUNG: Record<UeberwachterJob, string> = {
  aufraeumen: 'Konten nach 30 Tagen endgültig löschen, alte Sprachaufnahmen und verwaiste Dateien entfernen',
  reminder: 'Erinnerungs-E-Mails an Kunden mit offenen Angeboten',
}

export interface JobStatus {
  job: string
  letzterLauf: string | null
  ueberfaellig: boolean
}

/** Status aller überwachten Jobs — ohne Nebenwirkung, für Anzeige und Prüfung. */
export async function jobStatus(service: SupabaseClient, jetzt: Date = new Date()): Promise<JobStatus[]> {
  const status: JobStatus[] = []
  for (const job of UEBERWACHTE_JOBS) {
    const letzter = await letzterErfolgreicherLauf(service, job)
    status.push({ job, letzterLauf: letzter?.toISOString() ?? null, ueberfaellig: istUeberfaellig(letzter, jetzt) })
  }
  return status
}

/**
 * Meldet überfällige Jobs per E-Mail. `ausser` überspringt den Job, der
 * gerade selbst läuft — der ist per Definition nicht überfällig, und ein Job,
 * der sich selbst überwacht, überwacht nichts.
 */
export async function meldeUeberfaelligeJobs(
  service: SupabaseClient,
  opts: { ausser?: string; empfaenger: string; jetzt?: Date },
): Promise<JobStatus[]> {
  const alle = await jobStatus(service, opts.jetzt)
  const zuMelden = alle.filter(s => s.ueberfaellig && s.job !== opts.ausser)
  if (zuMelden.length === 0) return alle

  const resend = new Resend(process.env.RESEND_API_KEY)
  for (const s of zuMelden) {
    const beschreibung = JOB_BESCHREIBUNG[s.job as UeberwachterJob] ?? ''
    await resend.emails.send({
      from: 'Sofortangebot <alert@sofortangebot.app>',
      to: [opts.empfaenger],
      subject: `Hintergrundjob "${s.job}" läuft nicht`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px;">
          <p><strong>Der Job "${s.job}" hat seit ${s.letzterLauf ? new Date(s.letzterLauf).toLocaleString('de-DE') : 'jeher'} keinen erfolgreichen Lauf gemeldet.</strong></p>
          <p>Aufgabe dieses Jobs: ${beschreibung}.</p>
          <p>Übliche Ursachen, in dieser Reihenfolge prüfen:</p>
          <ol>
            <li><code>CRON_SECRET</code> in den Vercel-Projekteinstellungen gesetzt (Production)? Ohne das antwortet der Job jeden Tag mit 401.</li>
            <li>Steht der Job unter Vercel → Settings → Cron Jobs überhaupt drin?</li>
            <li>Fehler in Sentry unter dem Tag <code>cron_konfiguration</code>?</li>
          </ol>
          <p>Solange "aufraeumen" nicht läuft, werden gelöschte Konten, alte Sprachaufnahmen und verwaiste Dateien <strong>nicht</strong> gelöscht — entgegen Datenschutzerklärung und AGB.</p>
        </div>
      `,
    }).catch(() => {
      console.error(`[job-wachhund] Warn-E-Mail zu "${s.job}" fehlgeschlagen`)
    })
  }
  return alle
}
