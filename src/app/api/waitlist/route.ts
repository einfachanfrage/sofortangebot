import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json() as { email?: string }

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Ungültige E-Mail' }, { status: 400 })
  }

  const supabase = await createClient()
  const { error } = await supabase.from('waitlist').insert({ email: email.toLowerCase().trim() })

  if (error?.code === '23505') {
    return NextResponse.json({ ok: true, duplicate: true })
  }
  if (error) {
    return NextResponse.json({ error: 'Fehler beim Speichern' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
