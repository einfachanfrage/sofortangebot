import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const formData = await req.formData()
  const image = formData.get('image') as File
  if (!image) return NextResponse.json({ error: 'Kein Bild' }, { status: 400 })

  const { data: company } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
  const { data: priceItems } = await supabase.from('price_items').select('*').eq('company_id', company?.id ?? '')
  const priceList = priceItems?.map(p => `- ${p.title} | ${p.unit} | ${p.unit_price}€`).join('\n') ?? ''

  const bytes = await image.arrayBuffer()
  const base64 = Buffer.from(bytes).toString('base64')
  const mimeType = image.type || 'image/jpeg'

  const response = await openai.chat.completions.create({
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

Identifiziere:
1. Was zu renovieren/reparieren ist
2. Schätze Flächen/Mengen (grob anhand sichtbarer Proportionen)
3. Welche Arbeiten nötig sind

Antworte NUR mit JSON:
{
  "beschreibung": "Kurze Einschätzung des Fotos",
  "items": [
    {"title": "Bezeichnung", "description": "kurze Erläuterung", "quantity": 28, "unit": "m²", "unit_price": 8.00}
  ]
}`,
          },
        ],
      },
    ],
    response_format: { type: 'json_object' },
    max_tokens: 1000,
  })

  try {
    const result = JSON.parse(response.choices[0].message.content ?? '{}')
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Analyse fehlgeschlagen' }, { status: 500 })
  }
}
