import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getWoerterbuchEintraege, getWoerterbuchStatistik, deaktiviereEintrag } from '@/lib/nutzer-learning'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const [eintraege, statistik] = await Promise.all([
    getWoerterbuchEintraege(user.id),
    getWoerterbuchStatistik(user.id),
  ])

  return NextResponse.json({ eintraege, statistik })
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { id } = await req.json() as { id: string }
  if (!id) return NextResponse.json({ error: 'Keine ID' }, { status: 400 })

  await deaktiviereEintrag(user.id, id)
  return NextResponse.json({ ok: true })
}
