import { NextRequest, NextResponse, after } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cacheKombinierteExtraktion, type AufnahmeFuerKombination } from '@/lib/kombinierte-extraktion-cache'

export const maxDuration = 60

// CoS-002 Option 1, Schritt 3 – Mehrfach-Aufnahmen-Fall (Head of Product
// Engineering, 2026-08-21, siehe ausführlichen Kommentar in
// src/lib/kombinierte-extraktion-cache.ts): wird vom Frontend spekulativ
// (fire-and-forget, Antwort wird nicht ausgewertet) angestoßen, sobald
// "Entwurf erstellen" für mehrere neue Aufnahmen klickbar wird — bevor der
// Nutzer tatsächlich klickt. Antwortet immer schnell (die eigentliche
// Arbeit läuft über after() im Hintergrund weiter), damit das Frontend nie
// darauf wartet.
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false }, { status: 401 })

  const { angebot_id, aufnahmen_ids } = await req.json() as { angebot_id?: string; aufnahmen_ids?: string[] }
  if (!angebot_id || !aufnahmen_ids || aufnahmen_ids.length < 2) {
    return NextResponse.json({ ok: false, skipped: true })
  }

  // Ownership-Check — identisch zu generiere-positionen/route.ts.
  const { data: quoteCheck } = await supabase
    .from('quotes')
    .select('id, companies!inner(user_id)')
    .eq('id', angebot_id)
    .single()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const companyData = quoteCheck?.companies as any
  const companyUserId = Array.isArray(companyData) ? companyData[0]?.user_id : companyData?.user_id
  if (!quoteCheck || companyUserId !== user.id) {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  const { data: aufnahmen } = await supabase
    .from('entwurf_aufnahmen')
    .select('id, typ, transkript, notiz_text, verarbeitung_status')
    .eq('angebot_id', angebot_id)
    .in('id', aufnahmen_ids)

  if (!aufnahmen?.length) return NextResponse.json({ ok: false, skipped: true })

  after(() => cacheKombinierteExtraktion(supabase, user.id, angebot_id, aufnahmen as AufnahmeFuerKombination[]))

  return NextResponse.json({ ok: true })
}
