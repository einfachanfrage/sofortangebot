import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { pruefeKIZugriff } from '@/lib/rate-limiter'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: { session } } = await supabase.auth.getSession()
  if (!user || !session) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const blocked = await pruefeKIZugriff(user.id, 'ki_transkription')
  if (blocked) return blocked

  const formData = await req.formData()
  const audioFile = formData.get('audio') as File | null
  const angebotId = formData.get('angebot_id') as string | null

  if (!audioFile) {
    return NextResponse.json({ error: 'Keine Audiodatei' }, { status: 400 })
  }
  if (audioFile.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: 'Audiodatei zu groß (max. 25 MB)' }, { status: 413 })
  }

  // FormData neu aufbauen damit Dateiname + Typ erhalten bleiben
  const outForm = new FormData()
  outForm.append('audio', new Blob([await audioFile.arrayBuffer()], { type: audioFile.type }), audioFile.name)
  if (angebotId) outForm.append('angebot_id', angebotId)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const url = `${supabaseUrl}/functions/v1/transcribe`

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: outForm,
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    console.error('[transkribieren] Upstream-Anfrage fehlgeschlagen')
    return NextResponse.json(
      { error: 'Transkription fehlgeschlagen. Nochmal versuchen.', retry: true },
      { status: 500 }
    )
  }
}
