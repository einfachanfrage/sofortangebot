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
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(foto.type)) {
    return NextResponse.json({ error: 'Ungültiges Bildformat' }, { status: 400 })
  }
  if (foto.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'Bild zu groß (max. 10 MB)' }, { status: 413 })
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

  return NextResponse.json({ id: aufnahme.id, foto_url: storageErr ? null : storagePath })
}

// CoS-021 / DC-034 (2026-08-25): „Ins PDF aufnehmen"-Schalter für Aufnahme-
// Fotos. Bisher gab es diesen Schalter nur im separaten „Notizen & Fotos"-Tab
// und damit nur für den zweiten, getrennten Upload-Weg (`quote_photos`).
// Sandys Entscheidung: ein Foto-Pool statt zwei — die Fotos, die beim Aufmaß
// ohnehin entstehen, bekommen denselben Schalter. Diesen Endpunkt braucht der
// Product Designer für die zusammengelegte Ansicht.
export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const body = await req.json().catch(() => ({})) as { aufnahme_id?: string; in_pdf?: boolean }
  const { aufnahme_id, in_pdf } = body
  if (typeof aufnahme_id !== 'string' || typeof in_pdf !== 'boolean') {
    return NextResponse.json({ error: 'aufnahme_id und in_pdf erforderlich' }, { status: 400 })
  }

  // Eigentum ausdrücklich prüfen, nicht allein auf RLS vertrauen (dieselbe
  // Verteidigung in der Tiefe wie in den Angebots-Routen): Die Aufnahme muss
  // zu einem Angebot des eigenen Betriebs gehören.
  const { data: aufnahme } = await supabase
    .from('entwurf_aufnahmen')
    .select('id, typ, angebot_id')
    .eq('id', aufnahme_id)
    .single()
  if (!aufnahme) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  // Bewusst als eigene Abfrage über denselben, bereits erprobten Weg wie in
  // den Angebots-Routen (`quotes` → `companies!inner(user_id)`), statt auf eine
  // Verschachtelung zu setzen, die von einer Fremdschlüssel-Benennung abhängt.
  const { data: angebot } = await supabase
    .from('quotes')
    .select('id, companies!inner(user_id)')
    .eq('id', aufnahme.angebot_id)
    .single()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const companyRel = (angebot as any)?.companies
  const besitzerId = Array.isArray(companyRel) ? companyRel[0]?.user_id : companyRel?.user_id
  if (!angebot || besitzerId !== user.id) {
    return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  }
  if (aufnahme.typ !== 'foto') {
    return NextResponse.json({ error: 'Nur Fotos können ins PDF übernommen werden' }, { status: 400 })
  }

  const { error } = await supabase
    .from('entwurf_aufnahmen')
    .update({ in_pdf })
    .eq('id', aufnahme_id)

  if (error) return NextResponse.json({ error: 'Konnte nicht gespeichert werden' }, { status: 500 })
  return NextResponse.json({ ok: true, in_pdf })
}
