import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('logo') as File | null
  if (!file) return NextResponse.json({ error: 'Keine Datei' }, { status: 400 })

  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
  if (!allowed.includes(file.type)) {
    return NextResponse.json({ error: 'Nur PNG, JPG, WebP oder SVG erlaubt' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'Datei zu groß (max. 5 MB)' }, { status: 400 })
  }

  const ext = file.type === 'image/svg+xml' ? 'svg' : file.type.split('/')[1]
  // Erstes Pfadsegment muss die User-ID sein — die RLS-Policies auf
  // storage.objects prüfen genau das (storage.foldername(name)[1]).
  const path = `${user.id}/logo.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { error: uploadError } = await supabase.storage
    .from('company-logos')
    .upload(path, buffer, { upsert: true, contentType: file.type })

  if (uploadError) {
    return NextResponse.json({ error: 'Upload fehlgeschlagen: ' + uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage.from('company-logos').getPublicUrl(path)

  await supabase.from('companies').update({ logo_url: publicUrl }).eq('user_id', user.id)

  return NextResponse.json({ url: publicUrl })
}
