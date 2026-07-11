import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIClient, WHISPER_MODEL } from '@/lib/ai-client'
import { pruefeKIZugriff } from '@/lib/rate-limiter'
import { extrahiereChips } from '@/lib/chips-extraktion'

export const maxDuration = 60

// Retry-Pfad: Whisper + Chips für eine bereits hochgeladene Aufnahme
// (der normale Weg läuft direkt in /aufnahme/upload — dort reist das Audio
// nur einmal. Hier wird es aus Storage geladen.)
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const blocked = await pruefeKIZugriff(user.id, 'ki_transkription')
  if (blocked) return blocked

  const { aufnahme_id } = await req.json()
  if (!aufnahme_id) return NextResponse.json({ error: 'aufnahme_id fehlt' }, { status: 400 })

  // Aufnahme laden
  const { data: aufnahme } = await supabase
    .from('entwurf_aufnahmen')
    .select('*, quote:angebot_id(company_id)')
    .eq('id', aufnahme_id)
    .single()

  if (!aufnahme || aufnahme.typ !== 'sprache') {
    return NextResponse.json({ error: 'Aufnahme nicht gefunden' }, { status: 404 })
  }

  // Status → verarbeitung
  await supabase
    .from('entwurf_aufnahmen')
    .update({ verarbeitung_status: 'verarbeitung' })
    .eq('id', aufnahme_id)

  const ai = await getAIClient()

  try {
    // ── Whisper-Kette und Kontext-Query PARALLEL ──────────────────────────
    const whisperKette = (async (): Promise<string | null> => {
      const vorhandenes = aufnahme.transkript as string | null
      if (vorhandenes) return vorhandenes
      if (!aufnahme.audio_url) return null

      const { data: audioData } = await supabase.storage
        .from('entwurf-audio')
        .download(aufnahme.audio_url as string)
      if (!audioData) return null

      const ext = (aufnahme.audio_url as string).split('.').pop() ?? 'webm'
      const audioFile = new File([await audioData.arrayBuffer()], `audio.${ext}`, {
        type: audioData.type || 'audio/webm',
      })
      const result = await ai.audio.transcriptions.create({
        file: audioFile,
        model: WHISPER_MODEL,
        language: 'de',
        prompt: 'Handwerker, Aufmaß, Angebot, Quadratmeter, Laufmeter, Stück, Malerarbeiten, Fliesen, Elektro, Sanitär',
      })
      return result.text
    })()

    const kontextQuery = supabase
      .from('entwurf_aufnahmen')
      .select('notiz_text, transkript')
      .eq('angebot_id', aufnahme.angebot_id)
      .neq('id', aufnahme_id)
      .order('erstellt_am', { ascending: true })
      .limit(5)

    const [transkriptRoh, { data: bisherige }] = await Promise.all([whisperKette, kontextQuery])
    const transkript = transkriptRoh?.trim()

    if (!transkript) {
      await supabase
        .from('entwurf_aufnahmen')
        .update({ verarbeitung_status: 'fehler', transkript: '' })
        .eq('id', aufnahme_id)
      return NextResponse.json({ error: 'Keine Sprache erkannt' }, { status: 400 })
    }

    const kontextNotizen = (bisherige ?? [])
      .filter(a => a.notiz_text || a.transkript)
      .map(a => a.notiz_text ?? a.transkript)
      .join('\n')

    // ── Chips-Extraktion ──────────────────────────────────────────────────
    const { positionen } = await extrahiereChips(ai, transkript, kontextNotizen || undefined)

    // ── Ergebnis speichern ────────────────────────────────────────────────
    await supabase
      .from('entwurf_aufnahmen')
      .update({
        transkript,
        erkannte_positionen: positionen,
        verarbeitung_status: 'fertig',
      })
      .eq('id', aufnahme_id)

    return NextResponse.json({ transkript, positionen })

  } catch (err) {
    console.error('Verarbeitung Fehler:', err)
    await supabase
      .from('entwurf_aufnahmen')
      .update({ verarbeitung_status: 'fehler' })
      .eq('id', aufnahme_id)
    return NextResponse.json({ error: 'Verarbeitung fehlgeschlagen' }, { status: 500 })
  }
}
