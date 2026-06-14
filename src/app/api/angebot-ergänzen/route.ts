import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIClient, CHAT_MODEL_FAST } from '@/lib/ai-client'

export const maxDuration = 60

const SYSTEM_PROMPT = `Du bist Kalkulations-Profi mit 20 Jahren Erfahrung im deutschen Handwerk.

AUFGABE: Ein bestehendes Angebot soll ergänzt werden. Der Handwerker hat nachträglich neue Informationen eingesprochen.
Füge NUR neue Positionen hinzu die noch NICHT im Angebot stehen. Keine Duplikate.
Wenn der Handwerker etwas korrigiert (z.B. "nicht 30 sondern 45 Quadratmeter"), gib die geänderte Position zurück mit dem Prefix "KORREKTUR:" im title — die App übernimmt dann die Änderung.

Antworte NUR mit JSON:
{
  "items": [
    {
      "title": "Neue Position",
      "description": "optional",
      "quantity": 10,
      "unit": "m²",
      "unit_price": 25.00,
      "kategorie": "Arbeitsleistung"
    }
  ],
  "notizen": "Was wurde ergänzt und warum"
}`

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { existingItems, transcript } = await req.json()
  if (!transcript) return NextResponse.json({ error: 'Kein Text' }, { status: 400 })

  const existingList = (existingItems ?? [])
    .map((i: { title: string; quantity: number; unit: string; unit_price: number }) =>
      `- ${i.title}: ${i.quantity} ${i.unit} × ${i.unit_price}€`)
    .join('\n')

  let response
  try {
    const client = await getAIClient()
    response = await client.chat.completions.create({
      model: CHAT_MODEL_FAST,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Bestehende Positionen im Angebot:\n${existingList}\n\nNeu eingesprochene Ergänzung:\n${transcript}\n\nWas muss ergänzt oder korrigiert werden? Antworte NUR mit JSON.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 2000,
    })
  } catch (err) {
    console.error('angebot-ergänzen error:', err)
    return NextResponse.json({ error: 'Analyse fehlgeschlagen' }, { status: 500 })
  }

  try {
    const raw = response.choices[0].message.content ?? '{}'
    const cleaned = raw.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '').trim()
    const result = JSON.parse(cleaned)
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Analyse fehlgeschlagen' }, { status: 500 })
  }
}
