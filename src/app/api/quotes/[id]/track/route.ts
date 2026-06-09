import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { via } = await req.json()
  if (!via) return NextResponse.json({ error: 'via fehlt' }, { status: 400 })

  const { data: quote } = await supabase
    .from('quotes')
    .select('sent_via, company_id, companies!inner(user_id)')
    .eq('id', id)
    .single()

  if (!quote) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  const existing: string[] = quote.sent_via ?? []
  if (existing.includes(via)) return NextResponse.json({ ok: true })

  await supabase
    .from('quotes')
    .update({ sent_via: [...existing, via] })
    .eq('id', id)

  return NextResponse.json({ ok: true })
}
