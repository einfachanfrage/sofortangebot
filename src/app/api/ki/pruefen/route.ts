import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { callEdgeFunction } from '@/lib/edge-function-client'
import { pruefeKIZugriff } from '@/lib/rate-limiter'

export const maxDuration = 30

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: { session } } = await supabase.auth.getSession()
  if (!user || !session) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  const blocked = await pruefeKIZugriff(user.id, 'ki_extraktion')
  if (blocked) return blocked

  const body = await req.json()

  try {
    const result = await callEdgeFunction('ki-pruefen', body, session.access_token)
    return NextResponse.json(result)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unbekannt'
    console.error('[ki-pruefen] Upstream-Anfrage fehlgeschlagen')
    // Plausibilitätsprüfung darf Flow nie blockieren
    return NextResponse.json({ plausibel: true, warnungen: [], vorschlaege: [], fehler: msg })
  }
}
