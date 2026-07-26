import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIClient, WHISPER_MODEL } from '@/lib/ai-client'
import { pruefeKIZugriff, trackKIUsage } from '@/lib/rate-limiter'
import { extrahiereChips } from '@/lib/chips-extraktion'

export const maxDuration = 60

// Aufnahme-Eingang: EIN Request macht alles — Storage-Upload, Whisper und
// Kontext-Query laufen PARALLEL (das Audio reist nur einmal zum Server,
// statt hoch → runter → zu OpenAI). Danach Chips-Extraktion.
// /aufnahme/verarbeite bleibt als Retry-Pfad (lädt aus Storage).
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const blocked = await pruefeKIZugriff(user.id, 'ki_transkription')
  if (blocked) return blocked

  const formData = await req.formData()
  const angebotId = formData.get('angebot_id') as string
  const audio = formData.get('audio') as File | null
  const dauerSek = parseInt(formData.get('dauer_sekunden') as string || '0', 10)
  const geraet = formData.get('geraet') as string | null

  if (!angebotId || !audio) {
    return NextResponse.json({ error: 'angebot_id und audio erforderlich' }, { status: 400 })
  }
  const allowedAudioTypes = ['audio/webm', 'audio/mp4', 'audio/m4a', 'audio/ogg', 'audio/mpeg', 'audio/wav']
  const normalizedAudioType = (audio.type || 'audio/webm').split(';')[0]
  if (!allowedAudioTypes.includes(normalizedAudioType)) {
    return NextResponse.json({ error: 'Ungültiges Audioformat' }, { status: 400 })
  }
  if (audio.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: 'Audiodatei zu groß (max. 25 MB)' }, { status: 413 })
  }

  // Zugriff prüfen
  const { data: quote } = await supabase
    .from('quotes')
    .select('id, company_id')
    .eq('id', angebotId)
    .single()
  if (!quote) return NextResponse.json({ error: 'Angebot nicht gefunden' }, { status: 404 })

  // Aufnahme-Eintrag anlegen (sofort, damit die Timeline-Card eine echte ID hat)
  const { data: aufnahme, error: insertErr } = await supabase
    .from('entwurf_aufnahmen')
    .insert({
      angebot_id: angebotId,
      typ: 'sprache',
      audio_dauer_sekunden: dauerSek || null,
      verarbeitung_status: 'verarbeitung',
      geraet,
    })
    .select('id')
    .single()

  if (insertErr || !aufnahme) {
    return NextResponse.json({ error: 'Aufnahme konnte nicht angelegt werden' }, { status: 500 })
  }

  const rawType = audio.type || 'audio/webm'
  const ext = rawType.includes('mp4') || rawType.includes('m4a') ? 'm4a'
    : rawType.includes('ogg') ? 'ogg'
    : 'webm'
  // Normalize: strip codec params so bucket mime check passes (e.g. "audio/webm;codecs=opus" → "audio/webm")
  const contentType = rawType.includes('ogg') ? 'audio/ogg'
    : rawType.includes('mp4') || rawType.includes('m4a') ? 'audio/mp4'
    : 'audio/webm'

  const storagePath = `${user.id}/${angebotId}/${aufnahme.id}/audio.${ext}`
  const audioBytes = await audio.arrayBuffer()

  const ai = await getAIClient()

  // ── Alles Unabhängige PARALLEL: Storage-Upload + Whisper + Kontext + Gerät ──
  const [storageErgebnis, whisperErgebnis, kontextErgebnis] = await Promise.allSettled([
    supabase.storage
      .from('entwurf-audio')
      .upload(storagePath, audioBytes, { contentType, upsert: true }),
    ai.audio.transcriptions.create({
      file: new File([audioBytes], `audio.${ext}`, { type: contentType }),
      model: WHISPER_MODEL,
      language: 'de',
      prompt: 'Handwerker, Aufmaß, Angebot, Quadratmeter, Laufmeter, Stück, Malerarbeiten, Fliesen, Elektro, Sanitär',
    }),
    supabase
      .from('entwurf_aufnahmen')
      .select('notiz_text, transkript')
      .eq('angebot_id', angebotId)
      .neq('id', aufnahme.id)
      .order('erstellt_am', { ascending: true })
      .limit(5),
    geraet
      ? supabase.from('quotes').update({ entwurf_geraet: geraet }).eq('id', angebotId)
      : Promise.resolve(),
  ])

  // Storage-Ergebnis: bei Erfolg audio_url merken (Fehler ist nicht fatal — Transkript zählt)
  const storageOk = storageErgebnis.status === 'fulfilled' && !storageErgebnis.value.error
  if (storageErgebnis.status === 'fulfilled' && storageErgebnis.value.error) {
    console.error('[aufnahme-upload] Storage-Upload fehlgeschlagen')
  }

  // Whisper-Ergebnis
  const transkript = whisperErgebnis.status === 'fulfilled' ? whisperErgebnis.value.text?.trim() : ''
  if (whisperErgebnis.status === 'rejected') {
    console.error('[aufnahme-upload] Transkription fehlgeschlagen')
  }

  if (!transkript) {
    await supabase.from('entwurf_aufnahmen').update({
      verarbeitung_status: 'fehler',
      transkript: '',
      ...(storageOk ? { audio_url: storagePath } : {}),
    }).eq('id', aufnahme.id)
    return NextResponse.json(
      { error: 'Keine Sprache erkannt', id: aufnahme.id, audio_url: storageOk ? storagePath : null },
      { status: 422 }
    )
  }

  // Kontext aus bisherigen Aufnahmen
  const kontextNotizen = kontextErgebnis.status === 'fulfilled'
    ? (kontextErgebnis.value.data ?? [])
        .filter((a: { notiz_text: string | null; transkript: string | null }) => a.notiz_text || a.transkript)
        .map((a: { notiz_text: string | null; transkript: string | null }) => a.notiz_text ?? a.transkript)
        .join('\n')
    : ''

  // ── Chips-Extraktion (braucht das Transkript, daher sequenziell) ──────────
  let positionen: unknown[] = []
  let chipTokens = { tokensIn: 0, tokensOut: 0 }
  try {
    const chips = await extrahiereChips(ai, transkript, kontextNotizen || undefined)
    positionen = chips.positionen
    chipTokens = { tokensIn: chips.tokensIn, tokensOut: chips.tokensOut }
  } catch {
    console.error('[aufnahme-upload] Positionsextraktion fehlgeschlagen')
  }

  // ── Ergebnis in EINEM Update speichern ────────────────────────────────────
  await supabase.from('entwurf_aufnahmen').update({
    ...(storageOk ? { audio_url: storagePath } : {}),
    transkript,
    erkannte_positionen: positionen,
    verarbeitung_status: 'fertig',
  }).eq('id', aufnahme.id)

  await trackKIUsage({
    userId: user.id,
    endpunkt: 'transkription',
    tokensIn: chipTokens.tokensIn,
    tokensOut: chipTokens.tokensOut,
    // whisper-1: ~$0.006/Minute
    kostenEur: (dauerSek / 60) * 0.006 + (chipTokens.tokensIn * 0.00015 + chipTokens.tokensOut * 0.0006) / 1000,
  })

  return NextResponse.json({
    id: aufnahme.id,
    audio_url: storageOk ? storagePath : null,
    transkript,
    positionen,
  })
}
