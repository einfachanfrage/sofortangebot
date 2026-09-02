// Verwaiste und abgelaufene Dateien aufräumen (Head of Product Engineering, 2026-09-02)
//
// Gefunden beim Durchgehen meiner eigenen offenen Punkte: Im Bucket
// `entwurf-audio` liegen 263 Dateien, aber nur 81 Aufnahmen in der Datenbank
// nennen eine davon. **182 Dateien gehören zu gelöschten Entwürfen und
// Angeboten** — Sprachaufnahmen aus fremden Wohnungen, die niemand mehr
// findet und die deshalb auch der neue 30-Tage-Job nie erwischt hätte: der
// arbeitet über die Datenbankzeilen, und die gibt es nicht mehr.
//
// Die Ursache ist immer dieselbe: Beim Löschen eines Angebots räumt die
// Datenbank per Kaskade auf, der Objektspeicher kennt keine Kaskade. Wer die
// Zeile zuerst löscht, verliert die Datei aus dem Blick — genau davor warnt
// der Kommentar in `konto-loeschung.ts`, und genau das ist hier über Monate
// passiert.
//
// Was hier NICHT passiert: direkt in `storage.objects` löschen. Das entfernt
// nur den Eintrag, die Datei bliebe im Objektspeicher liegen. Gelöscht wird
// ausschließlich über die Storage-API.

import type { SupabaseClient } from '@supabase/supabase-js'

/** Buckets, für die die Datenbank sagen kann, ob eine Datei noch gebraucht wird. */
export const AUFRAEUMBARE_BUCKETS = [
  'entwurf-audio',
  'entwurf-fotos',
  'quote-photos',
  'public-pdfs',
] as const

export type AufraeumbarerBucket = typeof AUFRAEUMBARE_BUCKETS[number]

/** Höchstens so viele Dateien je Bucket und Lauf — der Rest kommt morgen dran. */
export const MAX_LOESCHUNGEN_JE_LAUF = 500

/**
 * Sicherung gegen eine kaputte Verknüpfung: Meldet die Datenbank ALLE Dateien
 * eines gut gefüllten Buckets als verwaist, ist wahrscheinlich die Abfrage
 * defekt und nicht der Bucket leer zu räumen. Bei winzigen Buckets ist
 * „alles verwaist" dagegen völlig plausibel (ein Foto, dessen Angebot
 * gelöscht wurde), deshalb greift die Sperre erst ab 20 Dateien.
 */
export function istVerdaechtig(verwaist: number, gesamt: number): boolean {
  return gesamt >= 20 && verwaist === gesamt
}

export interface BucketErgebnis {
  bucket: string
  gesamt: number
  verwaist: number
  geloescht: number
  uebersprungen: boolean
  fehler: string[]
}

export async function raeumeBucketAuf(
  service: SupabaseClient,
  bucket: AufraeumbarerBucket,
): Promise<BucketErgebnis> {
  const fehler: string[] = []

  const { data: gesamtRoh, error: zaehlFehler } = await service.rpc('speicher_dateien_anzahl', { p_bucket: bucket })
  if (zaehlFehler) {
    return { bucket, gesamt: 0, verwaist: 0, geloescht: 0, uebersprungen: true, fehler: [`Anzahl: ${zaehlFehler.message}`] }
  }
  const gesamt = Number(gesamtRoh ?? 0)

  const { data: verwaisteRoh, error: listeFehler } = await service.rpc('verwaiste_speicherdateien', { p_bucket: bucket })
  if (listeFehler) {
    return { bucket, gesamt, verwaist: 0, geloescht: 0, uebersprungen: true, fehler: [`Liste: ${listeFehler.message}`] }
  }
  const verwaiste = ((verwaisteRoh ?? []) as { name: string }[]).map(z => z.name)

  if (istVerdaechtig(verwaiste.length, gesamt)) {
    return {
      bucket, gesamt, verwaist: verwaiste.length, geloescht: 0, uebersprungen: true,
      fehler: [`Alle ${gesamt} Dateien gelten als verwaist — sieht nach einer kaputten Verknüpfung aus, nicht nach Müll. Nichts gelöscht.`],
    }
  }

  let geloescht = 0
  const zuLoeschen = verwaiste.slice(0, MAX_LOESCHUNGEN_JE_LAUF)
  for (let i = 0; i < zuLoeschen.length; i += 100) {
    const block = zuLoeschen.slice(i, i + 100)
    const { error } = await service.storage.from(bucket).remove(block)
    if (error) fehler.push(`${bucket}: ${error.message}`)
    else geloescht += block.length
  }

  return { bucket, gesamt, verwaist: verwaiste.length, geloescht, uebersprungen: false, fehler }
}

/** Räumt alle aufräumbaren Buckets auf. Ein Fehlschlag stoppt die übrigen nicht. */
export async function raeumeSpeicherAuf(service: SupabaseClient): Promise<BucketErgebnis[]> {
  const ergebnisse: BucketErgebnis[] = []
  for (const bucket of AUFRAEUMBARE_BUCKETS) {
    ergebnisse.push(await raeumeBucketAuf(service, bucket))
  }
  return ergebnisse
}
