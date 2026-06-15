import { createClient as createServiceClient } from '@supabase/supabase-js'

function getService() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ── Begriff normalisieren ─────────────────────────────────────────────────────

export function normalisiereBegriff(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s]/g, '')
}

// ── Persönliches Wörterbuch prüfen ───────────────────────────────────────────

export interface WoerterbuchMatch {
  position_id: string
  konfidenz: number
  aus_woerterbuch: true
}

export async function pruefeWoerterbuch(
  userId: string,
  begriffe: string[],
  gewerkId: string
): Promise<Map<string, WoerterbuchMatch>> {
  const service = getService()
  const ergebnisse = new Map<string, WoerterbuchMatch>()

  // Alle Begriffe parallel nachschlagen
  await Promise.all(begriffe.map(async (begriff) => {
    const normalisiert = normalisiereBegriff(begriff)
    try {
      const { data } = await service.rpc('lookup_nutzer_begriff', {
        p_user_id: userId,
        p_begriff: normalisiert,
        p_gewerk_id: gewerkId,
      })
      if (data && data.length > 0) {
        ergebnisse.set(begriff, {
          position_id: data[0].position_id,
          konfidenz: Number(data[0].konfidenz),
          aus_woerterbuch: true,
        })
      }
    } catch {
      // Fehler beim Lookup nie den Flow blockieren
    }
  }))

  return ergebnisse
}

// ── Match bestätigen (implizite Bestätigung bei Versand) ─────────────────────

export interface LernEintrag {
  beschreibung_original: string
  position_id: string
  gewerk_id: string
  korrigiert?: boolean
  neuer_position_id?: string
}

export async function bestaetigeMatches(
  userId: string,
  betriebId: string,
  eintraege: LernEintrag[]
): Promise<void> {
  const service = getService()

  await Promise.allSettled(eintraege.map(async (e) => {
    if (!e.position_id) return
    const normalisiert = normalisiereBegriff(e.beschreibung_original)

    if (e.korrigiert && e.neuer_position_id) {
      await service.rpc('registriere_korrektur', {
        p_user_id: userId,
        p_betrieb_id: betriebId,
        p_begriff: normalisiert,
        p_alter_position_id: e.position_id,
        p_neuer_position_id: e.neuer_position_id,
        p_gewerk_id: e.gewerk_id,
      })
    } else {
      await service.rpc('bestatige_nutzer_match', {
        p_user_id: userId,
        p_betrieb_id: betriebId,
        p_begriff: normalisiert,
        p_position_id: e.position_id,
        p_gewerk_id: e.gewerk_id,
      })
    }
  }))
}

// ── Wörterbuch-Statistik ─────────────────────────────────────────────────────

export async function getWoerterbuchStatistik(userId: string): Promise<{
  total: number
  bestaetigt: number
  lernend: number
}> {
  const service = getService()
  const { data } = await service
    .from('nutzer_begriffe')
    .select('status')
    .eq('user_id', userId)
    .neq('status', 'deaktiviert')

  const total = data?.length ?? 0
  const bestaetigt = data?.filter(d => d.status === 'bestaetigt').length ?? 0
  return { total, bestaetigt, lernend: total - bestaetigt }
}

// ── Wörterbuch-Einträge auflisten ─────────────────────────────────────────────

export interface WoerterbuchEintrag {
  id: string
  begriff: string
  position_id: string
  gewerk_id: string | null
  match_count: number
  bestaetigt_count: number
  status: string
  zuletzt_verwendet: string
}

export async function getWoerterbuchEintraege(userId: string): Promise<WoerterbuchEintrag[]> {
  const service = getService()
  const { data } = await service
    .from('nutzer_begriffe')
    .select('id, begriff, position_id, gewerk_id, match_count, bestaetigt_count, status, zuletzt_verwendet')
    .eq('user_id', userId)
    .neq('status', 'deaktiviert')
    .order('bestaetigt_count', { ascending: false })
  return (data ?? []) as WoerterbuchEintrag[]
}

// ── Eintrag deaktivieren ("löschen") ─────────────────────────────────────────

export async function deaktiviereEintrag(userId: string, id: string): Promise<void> {
  const service = getService()
  await service
    .from('nutzer_begriffe')
    .update({ status: 'deaktiviert' })
    .eq('id', id)
    .eq('user_id', userId)
}
