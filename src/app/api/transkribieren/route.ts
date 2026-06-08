import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { aiClient, WHISPER_MODEL } from '@/lib/ai-client'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const formData = await req.formData()
  const audio = formData.get('audio') as File
  if (!audio) return NextResponse.json({ error: 'Keine Audiodatei' }, { status: 400 })

  // Dateiname mit korrekter Endung für Groq/OpenAI
  const ext = audio.type.includes('mp4') ? 'mp4'
    : audio.type.includes('ogg') ? 'ogg'
    : audio.type.includes('mp3') ? 'mp3'
    : 'webm'

  const audioFile = new File([await audio.arrayBuffer()], `aufnahme.${ext}`, { type: audio.type || 'audio/webm' })

  try {
    const transcription = await aiClient.audio.transcriptions.create({
      file: audioFile,
      model: WHISPER_MODEL,
      language: 'de',
    })

    if (!transcription.text?.trim()) {
      return NextResponse.json({ error: 'Keine Sprache erkannt. Bitte nochmal versuchen.' }, { status: 400 })
    }

    return NextResponse.json({ text: transcription.text })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unbekannter Fehler'
    console.error('Transkription Fehler:', msg)
    return NextResponse.json({ error: `Transkription fehlgeschlagen: ${msg}` }, { status: 500 })
  }
}
