import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Signed URLs für Audio/Fotos generieren (60 Minuten gültig)
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { paths } = await req.json() as { paths: Array<{ bucket: string; path: string }> }
  if (!paths?.length) return NextResponse.json({ urls: {} })
  if (!Array.isArray(paths) || paths.length > 20) {
    return NextResponse.json({ error: 'Zu viele Pfade' }, { status: 400 })
  }

  const allowedBuckets = new Set(['entwurf-audio', 'entwurf-fotos'])

  const urls: Record<string, string> = {}

  for (const { bucket, path } of paths) {
    if (!allowedBuckets.has(bucket) || typeof path !== 'string' || !path.startsWith(`${user.id}/`)) {
      return NextResponse.json({ error: 'Ungültiger Storage-Pfad' }, { status: 403 })
    }
    const { data } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, 3600)
    if (data?.signedUrl) urls[path] = data.signedUrl
  }

  return NextResponse.json({ urls })
}
