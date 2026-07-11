import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIClient } from '@/lib/ai-client'
import { pruefeKIZugriff, trackKIUsage } from '@/lib/rate-limiter'
import { extrahiereChips } from '@/lib/chips-extraktion'

export const maxDuration = 60

// Scan-Eingang: Foto → Vision liest NUR ab (transkribiert) → der Text läuft
// durch dieselbe Pipeline wie eine Sprachaufnahme (Extraktion → Engine →
// Vollständigkeit → Preise). Vision ist der Vorleser — gerechnet wird
// deterministisch.
//
// Zwei Arten:
//  - 'zettel'    — handschriftlicher Aufmaß-Zettel
//  - 'grundriss' — Grundriss/Exposé (Raumnamen + m² pro Raum)

type ScanArt = 'zettel' | 'grundriss'

const SCAN_CONFIG: Record<ScanArt, { beschreibung: string; ablehnung: string; fehlertext: string; prompt: string }> = {
  zettel: {
    beschreibung: 'Aufmaß-Zettel',
    ablehnung: 'KEIN_ZETTEL',
    fehlertext: 'Kein Aufmaß-Zettel erkannt. Bitte den Zettel gut lesbar und vollständig fotografieren.',
    prompt: `Auf dem Foto ist ein handschriftlicher Aufmaß-Zettel eines Handwerkers (Maler/Bodenleger).

Lies die Notizen ab und gib sie als Fließtext wieder. Regeln:
- NUR ablesen, NICHTS erfinden oder ergänzen. Keine Interpretation, keine Preise.
- Übliche Abkürzungen ausschreiben: "Wohnz." → Wohnzimmer, "W+D str." → Wände und Decke streichen, "Fe" → Fenster, "T" → Tür, "SL" → Sockelleisten, "qm/m2" → Quadratmeter, "lfm" → laufende Meter.
- Maße beibehalten wie notiert (z.B. "5x4" → "5 mal 4 Meter", "2,60" → "2,60 Meter hoch" wenn als Höhe erkennbar).
- Pro Raum/Abschnitt einen Satz, Sätze mit Punkt trennen.
- Unleserliches als [unleserlich] markieren, NICHT raten.
- Wenn das Foto kein Aufmaß-Zettel ist, antworte exakt: KEIN_ZETTEL

Antworte NUR mit dem abgelesenen Text.`,
  },
  grundriss: {
    beschreibung: 'Grundriss',
    ablehnung: 'KEIN_GRUNDRISS',
    fehlertext: 'Kein Grundriss erkannt. Bitte einen Grundriss mit lesbaren Raumangaben fotografieren oder hochladen.',
    prompt: `Auf dem Bild ist ein Wohnungs-/Haus-Grundriss (z.B. aus einem Makler-Exposé).

Lies die Räume mit ihren Angaben ab und gib sie als Fließtext wieder. Regeln:
- NUR ablesen, was im Grundriss steht. NICHTS erfinden, keine Arbeiten, keine Preise.
- Pro Raum ein Satz: "Raumname, X Quadratmeter Bodenfläche." (z.B. "Wohnzimmer, 24,5 Quadratmeter Bodenfläche.")
- Wenn Maßketten lesbar sind (z.B. 4,20 × 3,50), nutze stattdessen: "Raumname, 4,20 mal 3,50 Meter."
- Wenn eine Deckenhöhe angegeben ist, nenne sie. Wenn NICHT, schreib am Ende einen Satz: "Deckenhöhe 2,50 Meter angenommen."
- Räume ohne Malerrelevanz (Balkon, Terrasse, Garten) weglassen. Flur/Diele/Abstellraum mitnehmen.
- Unleserliches als [unleserlich] markieren, NICHT raten.
- Wenn das Bild kein Grundriss ist, antworte exakt: KEIN_GRUNDRISS

Antworte NUR mit dem abgelesenen Text.`,
  },
}

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
  const artRaw = (formData.get('art') as string | null) ?? 'zettel'
  const art: ScanArt = artRaw === 'grundriss' ? 'grundriss' : 'zettel'
  const cfg = SCAN_CONFIG[art]

  if (!angebotId || !foto) {
    return NextResponse.json({ error: 'angebot_id und foto erforderlich' }, { status: 400 })
  }

  // Zugriff prüfen (Angebot gehört zur Company des Users)
  const { data: quote } = await supabase
    .from('quotes').select('id').eq('id', angebotId).single()
  if (!quote) return NextResponse.json({ error: 'Angebot nicht gefunden' }, { status: 404 })

  // Eintrag anlegen — typ 'foto' mit transkript = Scan
  const { data: aufnahme, error: insertErr } = await supabase
    .from('entwurf_aufnahmen')
    .insert({
      angebot_id: angebotId,
      typ: 'foto',
      foto_beschreibung: cfg.beschreibung,
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
  const storagePath = `${user.id}/${angebotId}/${aufnahme.id}/${art}.${ext}`
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

    // ── 1. Vision: Bild NUR ablesen ──────────────────────────────────────
    const visionRes = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64}`, detail: 'high' } },
          { type: 'text', text: cfg.prompt },
        ],
      }],
      max_tokens: 800,
    })

    const transkript = (visionRes.choices[0]?.message?.content ?? '').trim()
    const tokensIn1 = visionRes.usage?.prompt_tokens ?? 0
    const tokensOut1 = visionRes.usage?.completion_tokens ?? 0

    if (!transkript || transkript.includes(cfg.ablehnung)) {
      await supabase.from('entwurf_aufnahmen')
        .update({ verarbeitung_status: 'fehler' }).eq('id', aufnahme.id)
      return NextResponse.json({ error: cfg.fehlertext }, { status: 422 })
    }

    // ── 2. Erkannte Positionen (Chips) — gemeinsame Extraktion ────────────
    const chips = await extrahiereChips(client, transkript)
    const positionen = chips.positionen

    // ── 3. Speichern ──────────────────────────────────────────────────────
    await supabase.from('entwurf_aufnahmen').update({
      transkript,
      erkannte_positionen: positionen,
      verarbeitung_status: 'fertig',
    }).eq('id', aufnahme.id)

    await trackKIUsage({
      userId: user.id,
      endpunkt: `${art}_scan`,
      tokensIn: tokensIn1 + chips.tokensIn,
      tokensOut: tokensOut1 + chips.tokensOut,
      // gpt-4o Vision: ~$2.50/1M in, $10/1M out (dominiert die Kosten)
      kostenEur: (tokensIn1 * 0.0025 + tokensOut1 * 0.01 + chips.tokensIn * 0.00015 + chips.tokensOut * 0.0006) / 1000,
    })

    return NextResponse.json({
      id: aufnahme.id,
      transkript,
      positionen,
      foto_url: storageErr ? null : storagePath,
    })
  } catch (err) {
    console.error('Scan Fehler:', err)
    await supabase.from('entwurf_aufnahmen')
      .update({ verarbeitung_status: 'fehler' }).eq('id', aufnahme.id)
    return NextResponse.json({ error: `${cfg.beschreibung} konnte nicht gelesen werden` }, { status: 500 })
  }
}
