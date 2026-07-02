import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { angebot_id, text, geraet } = await req.json()
  if (!angebot_id || !text?.trim()) {
    return NextResponse.json({ error: 'angebot_id und text erforderlich' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('entwurf_aufnahmen')
    .insert({
      angebot_id,
      typ: 'notiz',
      notiz_text: text.trim(),
      verarbeitung_status: 'fertig',
      geraet: geraet ?? null,
    })
    .select('*')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
