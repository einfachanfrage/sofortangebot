import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIClient, WHISPER_MODEL } from '@/lib/ai-client'
import { checkUserRateLimit, checkKIBudget, trackKIUsage, rateLimitResponse } from '@/lib/rate-limiter'
import * as Sentry from '@sentry/nextjs'

// Whisper-Transkription kann >10s dauern
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  // Rate Limit prüfen
  const { data: company } = await supabase.from('companies').select('plan').eq('user_id', user.id).single()
  const plan = (company as { plan?: string } | null)?.plan ?? 'starter'

  const rlCheck = await checkUserRateLimit(user.id, 'ki_transkription', plan)
  if (!rlCheck.allowed) return rateLimitResponse(rlCheck)

  const budgetCheck = await checkKIBudget(user.id)
  if (!budgetCheck.allowed) {
    return NextResponse.json(
      { error: 'KI-Tageslimit erreicht. Morgen geht\'s weiter.', isKIBudget: true },
      { status: 429 }
    )
  }

  const formData = await req.formData()
  const audio = formData.get('audio') as File
  if (!audio) return NextResponse.json({ error: 'Keine Audiodatei' }, { status: 400 })

  // iOS Safari produziert audio/mp4 (AAC) → m4a-Endung für Whisper
  const ext = audio.type.includes('mp4') || audio.type.includes('m4a') ? 'm4a'
    : audio.type.includes('ogg') ? 'ogg'
    : audio.type.includes('mp3') ? 'mp3'
    : 'webm'

  // Dateiname-Endung aus dem Original-Dateinamen ableiten (Frontend setzt bereits korrekte Endung)
  const originalName = audio.name ?? ''
  const resolvedExt = originalName.endsWith('.m4a') ? 'm4a'
    : originalName.endsWith('.ogg') ? 'ogg'
    : originalName.endsWith('.mp3') ? 'mp3'
    : originalName.endsWith('.wav') ? 'wav'
    : ext  // MIME-Type-basierter Fallback

  const audioFile = new File([await audio.arrayBuffer()], `aufnahme.${resolvedExt}`, {
    type: audio.type || 'audio/webm',
  })

  try {
    const client = await getAIClient()
    const transcription = await client.audio.transcriptions.create({
      file: audioFile,
      model: WHISPER_MODEL,
      language: 'de',
    })

    if (!transcription.text?.trim()) {
      return NextResponse.json({ error: 'Keine Sprache erkannt. Bitte nochmal versuchen.' }, { status: 400 })
    }

    // Kosten tracken (~$0.006/min, Schätzung)
    await trackKIUsage({ userId: user.id, endpunkt: 'transkription', kostenEur: 0.006 })

    return NextResponse.json({ text: transcription.text })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unbekannter Fehler'
    console.error('Transkription Fehler:', msg)
    Sentry.captureException(err, {
      tags: { feature: 'ki_transkription' },
      extra: { audio_size: audio.size },
    })
    return NextResponse.json({ error: `Transkription fehlgeschlagen: ${msg}` }, { status: 500 })
  }
}
