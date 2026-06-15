import type { BerechnetePosition } from '@/lib/mengen/types'
import type { ExtrahierteDaten } from '@/lib/mengen/types'
import type { MatchResult } from '@/app/api/ki/matchen/route'
import { buildSituation, buildRaumdetails } from '@/lib/ki-flow-helpers'

async function callMitRetry(
  url: string,
  init: RequestInit,
  maxVersuche = 3
): Promise<Response> {
  let letzterFehler: Error = new Error('Unbekannt')
  for (let versuch = 0; versuch < maxVersuche; versuch++) {
    try {
      const res = await fetch(url, init)
      if (res.status === 429 || res.status === 504) {
        const warteMs = Math.min(1000 * 2 ** versuch, 8000)
        await new Promise(r => setTimeout(r, warteMs))
        letzterFehler = new Error(`HTTP ${res.status}`)
        continue
      }
      return res
    } catch (err) {
      letzterFehler = err instanceof Error ? err : new Error(String(err))
      if (versuch < maxVersuche - 1) {
        await new Promise(r => setTimeout(r, 500 * (versuch + 1)))
      }
    }
  }
  throw letzterFehler
}

export interface GematchtePosition extends BerechnetePosition {
  position_id: string | null
  bezeichnung_db: string | null
  unit_price_db: number | null
  match_methode: 'kontextuell' | 'kein_match'
  confidence: number
  kontext_genutzt: boolean
  alternativen: string[]
}

export async function matchePositionen(
  positionen: BerechnetePosition[],
  extraktion: ExtrahierteDaten,
  angebotId?: string
): Promise<GematchtePosition[]> {
  if (positionen.length === 0) return []

  const situation = buildSituation(extraktion)
  const raumdetails = buildRaumdetails(extraktion)

  try {
    const res = await callMitRetry('/api/ki/matchen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        positionen,
        gewerk: extraktion.gewerk,
        situation,
        raumdetails,
        angebot_id: angebotId,
      }),
    })

    if (!res.ok) throw new Error(`Matching HTTP ${res.status}`)

    const { matches } = await res.json() as { matches: MatchResult[] }

    return positionen.map((pos, i) => {
      const match = matches.find(m => m.index === i)

      if (!match || !match.position_id || match.confidence < 0.55) {
        return {
          ...pos,
          position_id: null,
          bezeichnung_db: null,
          unit_price_db: null,
          match_methode: 'kein_match',
          confidence: match?.confidence ?? 0,
          kontext_genutzt: false,
          alternativen: match?.alternative_ids ?? [],
        }
      }

      return {
        ...pos,
        position_id: match.position_id,
        bezeichnung_db: match.bezeichnung_gefunden,
        unit_price_db: match.unit_price ?? null,
        match_methode: 'kontextuell',
        confidence: match.confidence,
        kontext_genutzt: match.kontext_genutzt,
        alternativen: match.alternative_ids ?? [],
      }
    })

  } catch (err) {
    console.warn('Kontextuelles Matching fehlgeschlagen, Fallback auf kein Match:', err)
    // Fallback: alle Positionen ohne Match zurückgeben
    return positionen.map(pos => ({
      ...pos,
      position_id: null,
      bezeichnung_db: null,
      unit_price_db: null,
      match_methode: 'kein_match',
      confidence: 0,
      kontext_genutzt: false,
      alternativen: [],
    }))
  }
}
