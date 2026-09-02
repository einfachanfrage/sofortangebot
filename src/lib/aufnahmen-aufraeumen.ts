// Sprachaufnahmen automatisch löschen (Head of Product Engineering, 2026-09-02)
//
// Sandys Frage war die richtige: müssen die Aufnahmen überhaupt dauerhaft
// gespeichert werden? Nein. Die Audiodatei wird nach der Aufnahme nur noch für
// zwei Dinge gebraucht — den Wiederholungslauf in `api/entwurf/aufnahme/verarbeite`
// (falls Whisper beim ersten Versuch scheitert) und das Nachhören im Entwurf.
// Beides passiert in den Stunden und Tagen nach der Aufnahme, nie Monate
// später. Alles, was das Angebot ausmacht — Transkript, erkannte Positionen,
// Mengen — liegt in der Datenbank und bleibt unberührt.
//
// Eine Aufnahme in einer fremden Wohnung ist dagegen das Sensibelste, was
// dieses Produkt anfasst: Kundenname, Adresse, Nebengespräche, Kinder im
// Hintergrund. Sie ohne Zweck und ohne Frist zu behalten, ist das Gegenteil
// von Datenminimierung (Art. 5 Abs. 1 lit. c DSGVO).
//
// Deshalb: 30 Tage nach der Aufnahme wird die Audiodatei gelöscht, das
// Transkript bleibt. Dieselbe Frist wie bei der Konto-Löschung — eine Zahl,
// die der Nutzer sich merken kann, statt drei verschiedener.

import type { SupabaseClient } from '@supabase/supabase-js'

export const AUFNAHME_FRIST_TAGE = 30
export const AUFNAHME_BUCKET = 'entwurf-audio'

const TAG_MS = 24 * 60 * 60 * 1000

/** Aufnahmen, die vor diesem Zeitpunkt entstanden sind, verlieren ihre Audiodatei. */
export function aufnahmenFristVor(jetzt: Date = new Date()): string {
  return new Date(jetzt.getTime() - AUFNAHME_FRIST_TAGE * TAG_MS).toISOString()
}

/** Verbleibende volle Tage, bis die Audiodatei einer Aufnahme gelöscht wird. */
export function tageBisAudioLoeschung(erstelltAm: string | Date, jetzt: Date = new Date()): number {
  const start = typeof erstelltAm === 'string' ? new Date(erstelltAm) : erstelltAm
  const rest = start.getTime() + AUFNAHME_FRIST_TAGE * TAG_MS - jetzt.getTime()
  return Math.max(0, Math.ceil(rest / TAG_MS))
}

export interface AufraeumErgebnis {
  geprueft: number
  dateien: number
  fehler: string[]
}

/**
 * Löscht die Audiodateien abgelaufener Aufnahmen und setzt `audio_url` zurück.
 *
 * Reihenfolge wie bei der Konto-Löschung: erst die Datei, dann der Verweis.
 * Andersherum entstünde eine Datei, die niemand mehr findet und die deshalb
 * nie wieder gelöscht wird — genau die Sorte Rest, wegen der wir hier sind.
 */
export async function loescheAlteAufnahmen(
  service: SupabaseClient,
  jetzt: Date = new Date(),
): Promise<AufraeumErgebnis> {
  const fehler: string[] = []

  const { data: alte, error } = await service
    .from('entwurf_aufnahmen')
    .select('id, audio_url')
    .not('audio_url', 'is', null)
    .lt('erstellt_am', aufnahmenFristVor(jetzt))
    .limit(1000)

  if (error) {
    return { geprueft: 0, dateien: 0, fehler: [`entwurf_aufnahmen lesen: ${error.message}`] }
  }

  const treffer = alte ?? []
  if (treffer.length === 0) return { geprueft: 0, dateien: 0, fehler }

  let dateien = 0
  for (let i = 0; i < treffer.length; i += 100) {
    const block = treffer.slice(i, i + 100)
    const { error: storageFehler } = await service.storage
      .from(AUFNAHME_BUCKET)
      .remove(block.map(a => a.audio_url as string))

    if (storageFehler) {
      // Nicht den Verweis löschen, wenn die Datei noch da ist — sonst bleibt
      // sie unauffindbar liegen. Beim nächsten Lauf nochmal versuchen.
      fehler.push(`${AUFNAHME_BUCKET}: ${storageFehler.message}`)
      continue
    }
    dateien += block.length

    const { error: updateFehler } = await service
      .from('entwurf_aufnahmen')
      .update({ audio_url: null })
      .in('id', block.map(a => a.id))
    if (updateFehler) fehler.push(`audio_url zurücksetzen: ${updateFehler.message}`)
  }

  return { geprueft: treffer.length, dateien, fehler }
}
