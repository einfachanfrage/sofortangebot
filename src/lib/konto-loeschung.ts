// Konto-Löschung (Head of Product Engineering, 2026-09-02)
//
// „Konto löschen" hat bis heute nur `companies.deleted_at` gesetzt. Die
// 30-Tage-Frist aus AGB § 6.5 war gebaut (RestoreBanner + api/account/restore),
// nur passierte danach nichts: Auth-Nutzer, Angebote, Kundendaten, Aufnahmen
// und sämtliche Dateien blieben unbefristet liegen — gegen die ausdrückliche
// Zusage in Datenschutzerklärung Abschnitt 8.
//
// Diese Datei ist die eine Stelle, an der steht, WAS zu einem Konto gehört.
// Die reinen Funktionen (Frist, Speicherplan) sind getestet; die beiden
// Funktionen mit Supabase-Zugriff sind bewusst dünn gehalten, damit die
// Entscheidungen prüfbar bleiben und nicht in einer Route versteckt sind.
//
// Reihenfolge ist Absicht: erst Storage, dann Datenbank, dann Auth-Nutzer.
// Eine Datei ohne DB-Zeile ist unauffindbarer Müll; eine DB-Zeile ohne Datei
// wäre ein kaputtes Konto, das der Nutzer noch sieht. Bricht es in der Mitte
// ab, läuft der nächste Durchlauf einfach nochmal — jeder Schritt verträgt
// Wiederholung.

import type { SupabaseClient } from '@supabase/supabase-js'

/** AGB § 6.5: 30 Tage vorhalten (Export/Wiederherstellung), danach löschen. */
export const LOESCH_FRIST_TAGE = 30

const TAG_MS = 24 * 60 * 60 * 1000

/** Zeitpunkt, ab dem ein am `deleted_at` gelöschtes Konto endgültig fällig ist. */
export function loeschungFaelligAm(deletedAt: string | Date): Date {
  const start = typeof deletedAt === 'string' ? new Date(deletedAt) : deletedAt
  return new Date(start.getTime() + LOESCH_FRIST_TAGE * TAG_MS)
}

/** Verbleibende volle Tage bis zur endgültigen Löschung (nie negativ). */
export function tageBisLoeschung(deletedAt: string | Date, jetzt: Date = new Date()): number {
  const rest = loeschungFaelligAm(deletedAt).getTime() - jetzt.getTime()
  return Math.max(0, Math.ceil(rest / TAG_MS))
}

/**
 * Ist die Frist abgelaufen? Bewusst `>=` auf den Fälligkeitszeitpunkt und
 * nicht „älter als 30 Tage" per Streichung der Uhrzeit: der Nutzer hat die
 * vollen 30 Tage, auf die Minute.
 */
export function istLoeschreif(deletedAt: string | Date | null | undefined, jetzt: Date = new Date()): boolean {
  if (!deletedAt) return false
  const faellig = loeschungFaelligAm(deletedAt)
  if (Number.isNaN(faellig.getTime())) return false
  return jetzt.getTime() >= faellig.getTime()
}

/** Der Zeitpunkt, vor dem ein `deleted_at` löschreif ist — für die DB-Abfrage. */
export function loeschreifVor(jetzt: Date = new Date()): string {
  return new Date(jetzt.getTime() - LOESCH_FRIST_TAGE * TAG_MS).toISOString()
}

// ── Speicher ───────────────────────────────────────────────────────────────

export interface SpeicherAuftrag {
  bucket: string
  /** Ordner, die vollständig geleert werden (rekursiv). */
  praefixe: string[]
  /** Einzelne Dateien ohne Konto-Ordner (Altlast: flacher Namensraum). */
  dateien: string[]
}

export interface KontoSchluessel {
  userId: string
  companyId: string | null
  /** IDs aller Angebote des Betriebs — nur für `quote-signatures` nötig. */
  quoteIds: string[]
}

/**
 * Welche Dateien gehören zu diesem Konto?
 *
 * Die Pfadmuster stehen hier zusammen, weil sie sonst über sechs Routen
 * verteilt sind und beim nächsten neuen Bucket garantiert eine vergessen
 * wird. `tts-cache` fehlt bewusst: der Bucket ist nach dem Hash des
 * vorgelesenen Textes benannt (Marketing-Demo, `api/tts-demo`), enthält
 * keinen Personenbezug und gehört keinem Konto.
 */
export function speicherPlan({ userId, companyId, quoteIds }: KontoSchluessel): SpeicherAuftrag[] {
  const c = companyId ? [companyId] : []
  return [
    // `${user.id}/${angebot}/${aufnahme}/audio.<ext>`
    { bucket: 'entwurf-audio', praefixe: [userId], dateien: [] },
    // `${user.id}/${angebot}/${aufnahme}/<art>.<ext>`
    { bucket: 'entwurf-fotos', praefixe: [userId], dateien: [] },
    // Zwei Muster: `${user.id}/logo.<ext>` (Betriebslogo) und
    // `${betrieb_id}/briefpapiere/${id}/logo.<ext>` (Briefpapier-Logo).
    { bucket: 'company-logos', praefixe: [userId, ...c], dateien: [] },
    // `${company.id}/${share_token}.pdf`
    { bucket: 'public-pdfs', praefixe: c, dateien: [] },
    // `${company.id}/${angebot}/${uuid}.<ext>`
    { bucket: 'quote-photos', praefixe: c, dateien: [] },
    // Altlast: `signatures/${quote.id}.png` — flach, ohne Konto-Ordner.
    // Deshalb als Einzeldateien über die Angebots-IDs.
    { bucket: 'quote-signatures', praefixe: [], dateien: quoteIds.map(id => `signatures/${id}.png`) },
  ]
}

/** Listet einen Ordner rekursiv auf (Supabase Storage listet nur eine Ebene). */
async function pfadeUnter(service: SupabaseClient, bucket: string, praefix: string): Promise<string[]> {
  const gefunden: string[] = []
  const offen = [praefix]

  while (offen.length > 0) {
    const ordner = offen.pop()!
    // Seitenweise, sonst enden wir stillschweigend bei 100 Dateien.
    for (let offset = 0; ; offset += 100) {
      const { data, error } = await service.storage.from(bucket).list(ordner, { limit: 100, offset })
      if (error || !data || data.length === 0) break
      for (const eintrag of data) {
        const voll = ordner ? `${ordner}/${eintrag.name}` : eintrag.name
        // Ordner haben in der Storage-API keine id — daran unterscheidet
        // Supabase Datei von Unterordner.
        if (eintrag.id === null || eintrag.id === undefined) offen.push(voll)
        else gefunden.push(voll)
      }
      if (data.length < 100) break
    }
  }
  return gefunden
}

export interface SpeicherErgebnis {
  geloescht: number
  fehler: string[]
}

/** Räumt alle Dateien eines Kontos aus dem Storage. */
export async function loescheSpeicher(service: SupabaseClient, plan: SpeicherAuftrag[]): Promise<SpeicherErgebnis> {
  let geloescht = 0
  const fehler: string[] = []

  for (const auftrag of plan) {
    const pfade = [...auftrag.dateien]
    for (const praefix of auftrag.praefixe) {
      try {
        pfade.push(...await pfadeUnter(service, auftrag.bucket, praefix))
      } catch (e) {
        fehler.push(`${auftrag.bucket}: Auflisten von ${praefix} fehlgeschlagen (${String(e)})`)
      }
    }
    if (pfade.length === 0) continue

    // In Blöcken löschen — die Storage-API nimmt keine beliebig langen Listen.
    for (let i = 0; i < pfade.length; i += 100) {
      const block = pfade.slice(i, i + 100)
      const { error } = await service.storage.from(auftrag.bucket).remove(block)
      if (error) fehler.push(`${auftrag.bucket}: ${error.message}`)
      else geloescht += block.length
    }
  }

  return { geloescht, fehler }
}

// ── Gesamtablauf ───────────────────────────────────────────────────────────

export interface LoeschErgebnis {
  ok: boolean
  userId: string
  companyId: string | null
  dateien: number
  tabellen: Record<string, number> | null
  fehler: string[]
}

/**
 * Löscht ein Konto unwiderruflich: Dateien, Datenbank, Auth-Nutzer.
 *
 * Jeder Fehlschlag wird gemeldet statt verschluckt — ein „gelöschtes" Konto,
 * dessen Daten noch da sind, ist genau der Zustand, den wir gerade abstellen.
 */
export async function loescheKontoHart(
  service: SupabaseClient,
  userId: string,
): Promise<LoeschErgebnis> {
  const fehler: string[] = []

  const { data: company, error: companyFehler } = await service
    .from('companies')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()
  if (companyFehler) fehler.push(`companies lesen: ${companyFehler.message}`)
  const companyId = company?.id ?? null

  let quoteIds: string[] = []
  if (companyId) {
    const { data: quotes, error: quotesFehler } = await service
      .from('quotes')
      .select('id')
      .eq('company_id', companyId)
    if (quotesFehler) fehler.push(`quotes lesen: ${quotesFehler.message}`)
    quoteIds = (quotes ?? []).map(q => q.id as string)
  }

  const speicher = await loescheSpeicher(service, speicherPlan({ userId, companyId, quoteIds }))
  fehler.push(...speicher.fehler)

  const { data: bericht, error: rpcFehler } = await service.rpc('konto_hart_loeschen', { p_user_id: userId })
  if (rpcFehler) {
    // Ohne DB-Löschung ist der Rest wertlos — hier abbrechen, damit der
    // nächste Lauf es erneut versucht, statt den Auth-Nutzer zu entfernen
    // und die Daten verwaist zurückzulassen.
    fehler.push(`konto_hart_loeschen: ${rpcFehler.message}`)
    return { ok: false, userId, companyId, dateien: speicher.geloescht, tabellen: null, fehler }
  }

  const { error: authFehler } = await service.auth.admin.deleteUser(userId)
  if (authFehler) fehler.push(`auth-Nutzer löschen: ${authFehler.message}`)

  return {
    ok: fehler.length === 0,
    userId,
    companyId,
    dateien: speicher.geloescht,
    tabellen: (bericht ?? null) as Record<string, number> | null,
    fehler,
  }
}
