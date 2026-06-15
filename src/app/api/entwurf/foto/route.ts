import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 30

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const formData = await req.formData()
  const angebotId = formData.get('angebot_id') as string
  const foto = formData.get('foto') as File | null
  const beschreibung = (formData.get('beschreibung') as string | null)?.trim() || null
  const geraet = formData.get('geraet') as string | null

  if (!angebotId || !foto) {
    return NextResponse.json({ error: 'angebot_id und foto erforderlich' }, { status: 400 })
  }

  // Eintrag anlegen
  const { data: aufnahme, error: insertErr } = await supabase
    .from('entwurf_aufnahmen')
    .insert({
      angebot_id: angebotId,
      typ: 'foto',
      foto_beschreibung: beschreibung,
      verarbeitung_status: 'fertig',
      geraet,
    })
    .select('id')
    .single()

  if (insertErr || !aufnahme) {
    return NextResponse.json({ error: 'Foto-Eintrag konnte nicht angelegt werden' }, { status: 500 })
  }

  // Foto hochladen
  const ext = foto.type.includes('png') ? 'png'
    : foto.type.includes('webp') ? 'webp'
    : 'jpg'

  const storagePath = `${user.id}/${angebotId}/${aufnahme.id}/foto.${ext}`
  const { error: storageErr } = await supabase.storage
    .from('entwurf-fotos')
    .upload(storagePath, await foto.arrayBuffer(), {
      contentType: foto.type || 'image/jpeg',
      upsert: true,
    })

  if (!storageErr) {
    await supabase
      .from('entwurf_aufnahmen')
      .update({ foto_url: storagePath })
      .eq('id', aufnahme.id)
  }

  await supabase
    .from('quotes')
    .update({ entwurf_gespeichert_am: new Date().toISOString() })
    .eq('id', angebotId)

  return NextResponse.json({ id: aufnahme.id, foto_url: storageErr ? null : storagePath })
}
