import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const TTS_TEXTS: Record<string, string> = {
  maler: 'Beim Müller soll ich das Wohnzimmer streichen, vierzig Quadratmeter Wände, zweimal Anstrich, Farbe weiß. Die Decke auch, und die Fenster abkleben nicht vergessen.',
  fliesenleger: 'Beim Müller soll ich das Bad fliesen, Boden sechs Quadratmeter, Wände zwölf. Alte Fliesen müssen vorher runter. Und ne bodengleiche Dusche.',
  elektriker: 'Bei Schmidt soll ich die Wohnung neu verkabeln, drei Zimmer, neue Unterverteilung, sechs neue Steckdosen in der Küche.',
  sanitaer: 'Bei Meier soll ich das Bad komplett sanieren, neue Dusche, WC tauschen, Heizkörper bleibt.',
  default: 'Beim Müller soll ich das Bad fliesen, Boden sechs Quadratmeter, Wände zwölf. Alte Fliesen müssen vorher runter. Und ne bodengleiche Dusche.',
}

function getService() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { gewerk } = await req.json()
  const gewerkKey = Object.keys(TTS_TEXTS).find(k => (gewerk ?? '').toLowerCase().includes(k)) ?? 'default'
  const text = TTS_TEXTS[gewerkKey]
  const cacheKey = `tts-demo-${gewerkKey}.mp3`

  // Cache in Supabase Storage prüfen
  const service = getService()
  const { data: cached } = await service.storage.from('tts-cache').download(cacheKey)
  if (cached) {
    return new NextResponse(cached, {
      headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=86400' },
    })
  }

  // OpenAI TTS generieren
  let openAIKey: string
  try {
    const { getOpenAIKey } = await import('@/lib/vault')
    openAIKey = await getOpenAIKey()
  } catch {
    return NextResponse.json({ error: 'TTS nicht konfiguriert' }, { status: 503 })
  }

  const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${openAIKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'tts-1', voice: 'onyx', input: text, speed: 0.95 }),
  })

  if (!ttsRes.ok) return NextResponse.json({ error: 'TTS fehlgeschlagen' }, { status: 500 })

  const audioBuffer = await ttsRes.arrayBuffer()

  // In Supabase Storage cachen (fire-and-forget)
  service.storage.from('tts-cache').upload(cacheKey, audioBuffer, {
    contentType: 'audio/mpeg', upsert: true,
  }).catch(() => {})

  return new NextResponse(audioBuffer, {
    headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=86400' },
  })
}
