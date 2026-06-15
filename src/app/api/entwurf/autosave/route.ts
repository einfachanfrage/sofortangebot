import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { callEdgeFunction } from '@/lib/edge-function-client'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const body = await req.json()

  try {
    const result = await callEdgeFunction('angebot-autosave', body, session.access_token)
    return NextResponse.json(result)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unbekannt'
    console.error('Autosave Proxy Fehler:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
