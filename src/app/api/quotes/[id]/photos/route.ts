import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function getService() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GET — alle Fotos eines Angebots laden
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: company } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
  if (!company) return NextResponse.json({ error: 'No company' }, { status: 403 })

  const { data: photos } = await supabase
    .from('quote_photos')
    .select('*')
    .eq('quote_id', id)
    .eq('company_id', company.id)
    .order('erstellt_am', { ascending: true })

  // Signed URLs generieren (1h gültig)
  const service = getService()
  const withUrls = await Promise.all((photos ?? []).map(async (p) => {
    const { data } = await service.storage
      .from('quote-photos')
      .createSignedUrl(p.filename, 3600)
    return { ...p, signed_url: data?.signedUrl ?? p.url }
  }))

  return NextResponse.json(withUrls)
}

// POST — neues Foto hochladen
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: company } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
  if (!company) return NextResponse.json({ error: 'No company' }, { status: 403 })

  // Foto-Limit prüfen
  const { count } = await supabase
    .from('quote_photos')
    .select('*', { count: 'exact', head: true })
    .eq('quote_id', id)
  if ((count ?? 0) >= 10) return NextResponse.json({ error: 'Maximal 10 Fotos pro Angebot' }, { status: 400 })

  const form = await req.formData()
  const file = form.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'Kein Bild' }, { status: 400 })

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  const uuid = crypto.randomUUID()
  const storagePath = `${company.id}/${id}/${uuid}.${ext}`

  const service = getService()
  const { error: uploadError } = await service.storage
    .from('quote-photos')
    .upload(storagePath, await file.arrayBuffer(), {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    return NextResponse.json({ error: 'Upload fehlgeschlagen' }, { status: 500 })
  }

  // Signed URL für sofortige Anzeige
  const { data: signed } = await service.storage
    .from('quote-photos')
    .createSignedUrl(storagePath, 3600)

  const { data: photo, error: dbError } = await supabase
    .from('quote_photos')
    .insert({
      quote_id: id,
      company_id: company.id,
      url: storagePath,
      filename: storagePath,
      in_pdf: false,
    })
    .select()
    .single()

  if (dbError) {
    console.error('DB insert error:', dbError)
    return NextResponse.json({ error: 'Datenbankfehler' }, { status: 500 })
  }

  return NextResponse.json({ ...photo, signed_url: signed?.signedUrl ?? storagePath })
}

// PATCH — in_pdf Toggle
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { photo_id, in_pdf } = await req.json()
  await supabase.from('quote_photos').update({ in_pdf }).eq('id', photo_id).eq('quote_id', id)
  return NextResponse.json({ ok: true })
}

// DELETE — Foto löschen
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { photo_id } = await req.json()
  const { data: photo } = await supabase
    .from('quote_photos')
    .select('filename')
    .eq('id', photo_id)
    .eq('quote_id', id)
    .single()

  if (photo) {
    const service = getService()
    await service.storage.from('quote-photos').remove([photo.filename])
    await supabase.from('quote_photos').delete().eq('id', photo_id)
  }

  return NextResponse.json({ ok: true })
}
