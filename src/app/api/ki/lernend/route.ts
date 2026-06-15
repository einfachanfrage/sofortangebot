import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { bestaetigeMatches, LernEintrag } from '@/lib/nutzer-learning'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data: companyData } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single()
  const betriebId = (companyData as { id?: string } | null)?.id
  if (!betriebId) return NextResponse.json({ error: 'Kein Betrieb' }, { status: 400 })

  const body = await req.json() as { eintraege: LernEintrag[] }
  if (!body.eintraege || body.eintraege.length === 0) {
    return NextResponse.json({ ok: true })
  }

  await bestaetigeMatches(user.id, betriebId, body.eintraege)
  return NextResponse.json({ ok: true })
}
