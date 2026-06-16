import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const formData = await req.formData()
  const audioFile = formData.get('audio') as File | null
  const angebotId = formData.get('angebot_id') as string | null

  if (!audioFile) {
    return NextResponse.json({ error: 'Keine Audiodatei' }, { status: 400 })
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
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unbekannt'
    console.error('Transkribieren Proxy Fehler:', msg)
    return NextResponse.json(
      { error: 'Transkription fehlgeschlagen. Nochmal versuchen.', retry: true },
      { status: 500 }
    )
  }
}
