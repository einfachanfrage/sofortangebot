import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 30

// Erstellt entwurf_aufnahmen-Eintrag + lädt Audio in Storage hoch
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const formData = await req.formData()
  const angebotId = formData.get('angebot_id') as string
  const audio = formData.get('audio') as File | null
  const dauerSek = parseInt(formData.get('dauer_sekunden') as string || '0', 10)
  const geraet = formData.get('geraet') as string | null

  if (!angebotId || !audio) {
    return NextResponse.json({ error: 'angebot_id und audio erforderlich' }, { status: 400 })
  }

  // Zugriff prüfen
  const { data: quote } = await supabase
    .from('quotes')
    .select('id, company_id')
    .eq('id', angebotId)
    .single()
  if (!quote) return NextResponse.json({ error: 'Angebot nicht gefunden' }, { status: 404 })

  // Aufnahme-Eintrag anlegen (sofort, damit Timeline-Card erscheint)
  const { data: aufnahme, error: insertErr } = await supabase
    .from('entwurf_aufnahmen')
    .insert({
      angebot_id: angebotId,
      typ: 'sprache',
      audio_dauer_sekunden: dauerSek || null,
      verarbeitung_status: 'ausstehend',
      geraet,
    })
    .select('id')
    .single()

  if (insertErr || !aufnahme) {
    return NextResponse.json({ error: 'Aufnahme konnte nicht angelegt werden' }, { status: 500 })
  }

  // Audio in Storage hochladen
  const rawType = audio.type || 'audio/webm'
  const ext = rawType.includes('mp4') || rawType.includes('m4a') ? 'm4a'
    : rawType.includes('ogg') ? 'ogg'
    : 'webm'
  // Normalize: strip codec params so bucket mime check passes (e.g. "audio/webm;codecs=opus" → "audio/webm")
  const contentType = rawType.includes('ogg') ? 'audio/ogg'
    : rawType.includes('mp4') || rawType.includes('m4a') ? 'audio/mp4'
    : 'audio/webm'

  const storagePath = `${user.id}/${angebotId}/${aufnahme.id}/audio.${ext}`
  const { error: storageErr } = await supabase.storage
    .from('entwurf-audio')
    .upload(storagePath, await audio.arrayBuffer(), {
      contentType,
      upsert: true,
    })

  if (storageErr) {
    console.error('Audio upload error:', storageErr)
    // Aufnahme-Eintrag bleibt, wird ohne Audio verarbeitet
  } else {
    await supabase
      .from('entwurf_aufnahmen')
      .update({ audio_url: storagePath })
      .eq('id', aufnahme.id)
  }

  // Autosave-Timestamp auf quotes
  await supabase
    .from('quotes')
    .update({ entwurf_gespeichert_am: new Date().toISOString(), entwurf_geraet: geraet })
    .eq('id', angebotId)

  return NextResponse.json({ id: aufnahme.id, audio_url: storageErr ? null : storagePath })
}
