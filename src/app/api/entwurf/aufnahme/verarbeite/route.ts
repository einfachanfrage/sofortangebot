import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIClient, WHISPER_MODEL, CHAT_MODEL_FAST } from '@/lib/ai-client'
import { pruefeKIZugriff } from '@/lib/rate-limiter'

export const maxDuration = 60

// Whisper + GPT für eine Aufnahme ausführen, Ergebnis in DB schreiben
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
    // ── 1. Transkription ──────────────────────────────────────────────────
    let transkript = aufnahme.transkript as string | null

    if (!transkript && aufnahme.audio_url) {
      const { data: audioData } = await supabase.storage
        .from('entwurf-audio')
        .download(aufnahme.audio_url as string)

      if (audioData) {
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
        transkript = result.text
      }
    }

    if (!transkript?.trim()) {
      await supabase
        .from('entwurf_aufnahmen')
        .update({ verarbeitung_status: 'fehler', transkript: '' })
        .eq('id', aufnahme_id)
      return NextResponse.json({ error: 'Keine Sprache erkannt' }, { status: 400 })
    }

    // ── 2. Bisherige Notizen als Kontext laden ────────────────────────────
    const { data: bisherige } = await supabase
      .from('entwurf_aufnahmen')
      .select('notiz_text, transkript')
      .eq('angebot_id', aufnahme.angebot_id)
      .neq('id', aufnahme_id)
      .order('erstellt_am', { ascending: true })
      .limit(5)

    const kontextNotizen = (bisherige ?? [])
      .filter(a => a.notiz_text || a.transkript)
      .map(a => a.notiz_text ?? a.transkript)
      .join('\n')

    // ── 3. KI-Extraktion ──────────────────────────────────────────────────
    const systemPrompt = `Du bist Kalkulations-Profi im deutschen Handwerk.
Extrahiere aus dem Aufmaß die konkreten Positionen als JSON.

WICHTIG: Jede Arbeit ist eine EIGENE Position. Wände streichen und Decke streichen sind IMMER getrennte Positionen, auch wenn im gleichen Satz genannt.
Beispiel: "Wände und Decke streichen" → zwei Positionen: "Wände streichen" und "Decke streichen".

Wenn ein Raum genannt wird, schreib ihn mit " — Raumname" ans Ende des Titels.
Beispiel: "Wände streichen — Wohnzimmer", "Decke streichen — Küche"

${kontextNotizen ? `BISHERIGER KONTEXT:\n${kontextNotizen}\n` : ''}

Antworte NUR mit JSON:
{
  "positionen": [
    {
      "titel": "Wände streichen — Wohnzimmer",
      "menge": 35,
      "einheit": "m²",
      "einzelpreis": 8,
      "gesamtpreis": 280,
      "erkannt": true
    }
  ]
}

Wenn etwas unklar ist, setze erkannt: false und einzelpreis: 0.
Typische Preise: Maler 25-45€/m², Fliesen 35-65€/m², Elektro 65-95€/h`

    const response = await ai.chat.completions.create({
      model: CHAT_MODEL_FAST,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: transkript },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 800,
    })

    let positionen: unknown[] = []
    try {
      const parsed = JSON.parse(response.choices[0].message.content ?? '{}')
      positionen = parsed.positionen ?? []
    } catch {
      positionen = []
    }

    // ── 4. Ergebnis speichern ─────────────────────────────────────────────
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
