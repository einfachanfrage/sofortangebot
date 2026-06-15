import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Signed URLs für Audio/Fotos generieren (60 Minuten gültig)
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { paths } = await req.json() as { paths: Array<{ bucket: string; path: string }> }
  if (!paths?.length) return NextResponse.json({ urls: {} })

  const urls: Record<string, string> = {}

  for (const { bucket, path } of paths) {
    const { data } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600)
    if (data?.signedUrl) urls[path] = data.signedUrl
  }

  return NextResponse.json({ urls })
}
