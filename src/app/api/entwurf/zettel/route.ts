import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIClient, CHAT_MODEL_FAST } from '@/lib/ai-client'
import { pruefeKIZugriff, trackKIUsage } from '@/lib/rate-limiter'

export const maxDuration = 60

// Zettel-Scan: Foto eines handschriftlichen Aufmaß-Zettels → Vision liest ihn
// NUR ab (transkribiert), der Text läuft danach durch dieselbe Pipeline wie
// eine Sprachaufnahme (Extraktion → Engine → Vollständigkeit → Preise).
// Vision ist der Vorleser — gerechnet wird deterministisch.
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const blocked = await pruefeKIZugriff(user.id, 'ki_transkription')
  if (blocked) return blocked

  const formData = await req.formData()
  const angebotId = formData.get('angebot_id') as string
  const foto = formData.get('foto') as File | null
  const geraet = formData.get('geraet') as string | null

  if (!angebotId || !foto) {
    return NextResponse.json({ error: 'angebot_id und foto erforderlich' }, { status: 400 })
  }

  // Zugriff prüfen (Angebot gehört zur Company des Users)
  const { data: quote } = await supabase
    .from('quotes').select('id').eq('id', angebotId).single()
  if (!quote) return NextResponse.json({ error: 'Angebot nicht gefunden' }, { status: 404 })

  // Eintrag anlegen — typ 'foto' mit transkript = Zettel-Scan
  const { data: aufnahme, error: insertErr } = await supabase
    .from('entwurf_aufnahmen')
    .insert({
      angebot_id: angebotId,
      typ: 'foto',
      foto_beschreibung: 'Aufmaß-Zettel',
      verarbeitung_status: 'verarbeitung',
      geraet,
    })
    .select('id')
    .single()

  if (insertErr || !aufnahme) {
    return NextResponse.json({ error: 'Eintrag konnte nicht angelegt werden' }, { status: 500 })
  }

  // Foto in Storage
  const ext = foto.type.includes('png') ? 'png' : foto.type.includes('webp') ? 'webp' : 'jpg'
  const storagePath = `${user.id}/${angebotId}/${aufnahme.id}/zettel.${ext}`
  const bytes = await foto.arrayBuffer()
  const { error: storageErr } = await supabase.storage
    .from('entwurf-fotos')
    .upload(storagePath, bytes, { contentType: foto.type || 'image/jpeg', upsert: true })
  if (!storageErr) {
    await supabase.from('entwurf_aufnahmen').update({ foto_url: storagePath }).eq('id', aufnahme.id)
  }

  try {
    const client = await getAIClient()
    const base64 = Buffer.from(bytes).toString('base64')
    const mimeType = foto.type || 'image/jpeg'

    // ── 1. Vision: Zettel NUR ablesen ────────────────────────────────────
    const visionRes = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}`, detail: 'high' } },
          {
            type: 'text',
            text: `Auf dem Foto ist ein handschriftlicher Aufmaß-Zettel eines Handwerkers (Maler/Bodenleger).

Lies die Notizen ab und gib sie als Fließtext wieder. Regeln:
- NUR ablesen, NICHTS erfinden oder ergänzen. Keine Interpretation, keine Preise.
- Übliche Abkürzungen ausschreiben: "Wohnz." → Wohnzimmer, "W+D str." → Wände und Decke streichen, "Fe" → Fenster, "T" → Tür, "SL" → Sockelleisten, "qm/m2" → Quadratmeter, "lfm" → laufende Meter.
- Maße beibehalten wie notiert (z.B. "5x4" → "5 mal 4 Meter", "2,60" → "2,60 Meter hoch" wenn als Höhe erkennbar).
- Pro Raum/Abschnitt einen Satz, Sätze mit Punkt trennen.
- Unleserliches als [unleserlich] markieren, NICHT raten.
- Wenn das Foto kein Aufmaß-Zettel ist, antworte exakt: KEIN_ZETTEL

Antworte NUR mit dem abgelesenen Text.`,
          },
        ],
      }],
      max_tokens: 800,
    })

    const transkript = (visionRes.choices[0]?.message?.content ?? '').trim()
    const tokensIn1 = visionRes.usage?.prompt_tokens ?? 0
    const tokensOut1 = visionRes.usage?.completion_tokens ?? 0

    if (!transkript || transkript.includes('KEIN_ZETTEL')) {
      await supabase.from('entwurf_aufnahmen')
        .update({ verarbeitung_status: 'fehler' }).eq('id', aufnahme.id)
      return NextResponse.json({ error: 'Kein Aufmaß-Zettel erkannt. Bitte den Zettel gut lesbar und vollständig fotografieren.' }, { status: 422 })
    }

    // ── 2. Erkannte Positionen (Chips) — gleicher Stil wie Sprach-Verarbeitung ──
    const chipsRes = await client.chat.completions.create({
      model: CHAT_MODEL_FAST,
      messages: [
        {
          role: 'system',
          content: `Du bist Kalkulations-Profi im deutschen Handwerk. Extrahiere aus dem Aufmaß die konkreten Positionen als JSON.
Wenn ein Raum genannt wird, schreib ihn mit " — Raumname" ans Ende des Titels.
Wände streichen und Decke streichen sind IMMER getrennte Positionen.
Antworte NUR mit JSON: {"positionen":[{"titel":"...","menge":0,"einheit":"m²","einzelpreis":0,"gesamtpreis":0,"erkannt":true}]}`,
        },
        { role: 'user', content: transkript },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 800,
    })

    let positionen: unknown[] = []
    try {
      positionen = JSON.parse(chipsRes.choices[0]?.message?.content ?? '{}').positionen ?? []
    } catch { positionen = [] }

    // ── 3. Speichern ──────────────────────────────────────────────────────
    await supabase.from('entwurf_aufnahmen').update({
      transkript,
      erkannte_positionen: positionen,
      verarbeitung_status: 'fertig',
    }).eq('id', aufnahme.id)

    const tokensIn2 = chipsRes.usage?.prompt_tokens ?? 0
    const tokensOut2 = chipsRes.usage?.completion_tokens ?? 0
    await trackKIUsage({
      userId: user.id,
      endpunkt: 'zettel_scan',
      tokensIn: tokensIn1 + tokensIn2,
      tokensOut: tokensOut1 + tokensOut2,
      // gpt-4o Vision: ~$2.50/1M in, $10/1M out (dominiert die Kosten)
      kostenEur: (tokensIn1 * 0.0025 + tokensOut1 * 0.01 + tokensIn2 * 0.00015 + tokensOut2 * 0.0006) / 1000,
    })

    return NextResponse.json({
      id: aufnahme.id,
      transkript,
      positionen,
      foto_url: storageErr ? null : storagePath,
    })
  } catch (err) {
    console.error('Zettel-Scan Fehler:', err)
    await supabase.from('entwurf_aufnahmen')
      .update({ verarbeitung_status: 'fehler' }).eq('id', aufnahme.id)
    return NextResponse.json({ error: 'Zettel konnte nicht gelesen werden' }, { status: 500 })
  }
}
