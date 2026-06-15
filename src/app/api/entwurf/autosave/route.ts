import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false })

  try {
    const { angebot_id } = await req.json() as { angebot_id: string }
    if (!angebot_id) return NextResponse.json({ ok: false })

    await supabase
      .from('quotes')
      .update({ entwurf_gespeichert_am: new Date().toISOString() })
      .eq('id', angebot_id)

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
