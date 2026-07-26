import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { callEdgeFunction } from '@/lib/edge-function-client'
import { pruefeKIZugriff } from '@/lib/rate-limiter'

export interface MatchResult {
  index: number
  position_id: string | null
  bezeichnung_gefunden: string | null
  confidence: number
  begruendung: string
  alternative_ids: string[]
  kontext_genutzt: boolean
  unit_price: number | null
}

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: { session } } = await supabase.auth.getSession()
  if (!user || !session) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  const blocked = await pruefeKIZugriff(user.id, 'ki_extraktion')
  if (blocked) return blocked

  const body = await req.json()

  try {
    const result = await callEdgeFunction('ki-matchen', body, session.access_token)
    return NextResponse.json(result)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unbekannt'
    console.error('[ki-matchen] Upstream-Anfrage fehlgeschlagen')
    // Matching-Fehler soll Flow nicht brechen
    return NextResponse.json({ matches: [], fehler: msg, fallback: true })
  }
}
