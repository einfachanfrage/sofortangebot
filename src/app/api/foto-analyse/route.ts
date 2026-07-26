import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIClient } from '@/lib/ai-client'
import { pruefeKIZugriff } from '@/lib/rate-limiter'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })
  const blocked = await pruefeKIZugriff(user.id, 'ki_extraktion')
  if (blocked) return blocked

  const formData = await req.formData()
  const image = formData.get('image') as File
  if (!image) return NextResponse.json({ error: 'Kein Bild' }, { status: 400 })
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(image.type)) {
    return NextResponse.json({ error: 'Ungültiges Bildformat' }, { status: 400 })
  }
  if (image.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'Bild zu groß (max. 10 MB)' }, { status: 413 })
  }

  const { data: company } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
  const { data: priceItems } = await supabase.from('price_items').select('*').eq('company_id', company?.id ?? '')
  const priceList = priceItems?.map(p => `- ${p.title} | ${p.unit} | ${p.unit_price}€`).join('\n') ?? ''

  const bytes = await image.arrayBuffer()
  const base64 = Buffer.from(bytes).toString('base64')
  const mimeType = image.type || 'image/jpeg'

  try {
    // Vision ist nur mit OpenAI verfügbar (NEXT_PUBLIC_VISION_ENABLED steuert das im Frontend)
    const client = await getAIClient()
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64}`, detail: 'high' },
            },
            {
              type: 'text',
              text: `Du bist Assistent für einen Handwerksbetrieb. Analysiere dieses Foto einer Baustelle / eines Raumes.

Preisdatenbank:
${priceList || '(leer — schätze marktübliche Preise)'}

Identifiziere was zu renovieren/reparieren ist, schätze Flächen/Mengen und welche Arbeiten nötig sind.

Antworte NUR mit JSON:
{"beschreibung":"Kurze Einschätzung","items":[{"title":"Bezeichnung","description":"kurze Erläuterung","quantity":28,"unit":"m²","unit_price":8.00}]}`,
            },
          ],
        },
      ],
      max_tokens: 1000,
    })

    const raw = response.choices[0]?.message?.content ?? ''
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const result = JSON.parse(cleaned)
    return NextResponse.json(result)
  } catch {
    console.error('[foto-analyse] Verarbeitung fehlgeschlagen')
    return NextResponse.json({ error: 'Foto-Analyse fehlgeschlagen' }, { status: 500 })
  }
}
