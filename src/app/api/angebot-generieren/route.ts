import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGewerkePromptContext } from '@/lib/gewerke'
import { aiClient, CHAT_MODEL } from '@/lib/ai-client'

// OpenAI-Analyse kann bei langen Aufmaßen >10s dauern
export const maxDuration = 60

export interface GeneratedQuestion {
  id: string
  frage: string
  typ: 'ja_nein' | 'zahl' | 'auswahl' | 'text'
  optionen?: string[]
  einheit?: string
  standard?: string | number
  wichtig: boolean // wichtig = immer stellen, sonst nur wenn relevant
}

export interface GeneratedQuote {
  items: Array<{
    title: string
    description?: string
    quantity: number
    unit: string
    unit_price: number
    kategorie?: string
  }>
  rückfragen: GeneratedQuestion[]
  zusammenfassung: string
  notizen?: string
}

const SYSTEM_PROMPT = `Du bist Kalkulations-Profi im deutschen Handwerk. Erstelle aus dem Aufmaß ein vollständiges Angebot.

PREISDATENBANK:
{PREISE}

GEWERK-KONTEXT:
{GEWERKE}

REGELN:
- Arbeitsleistung immer als eigene Positionen (Demontage, Vorbereitung, Hauptarbeit)
- Verschnitt bei Belägen/Fliesen: +10% auf Menge, im Titel erwähnen
- Kleinmaterial-Pauschale IMMER: min. 25€ oder 4% der Lohnkosten
- Mengen-Logik: Teilflächen dürfen Gesamtfläche nicht überschreiten
- Marktübliche deutsche Handwerkerpreise (inkl. MwSt.)

RÜCKFRAGEN (max. 5, nur die wichtigsten):
1. Material: lieferst du oder Kunde? (fast immer)
2. Fahrtweg in km (immer)
3. Stockwerk/Aufzug (bei Wohnräumen)
4. Entsorgung nötig? (bei Abriss)
5. Bewohnte Wohnung? (bei Wohnräumen)

Antworte NUR mit JSON:
{"zusammenfassung":"...","items":[{"title":"...","description":"...","quantity":1,"unit":"m²","unit_price":0,"kategorie":"..."}],"rückfragen":[{"id":"material","frage":"...","typ":"ja_nein","wichtig":true}],"notizen":"..."}`

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { text } = await req.json()
  if (!text) return NextResponse.json({ error: 'Kein Text' }, { status: 400 })

  const { data: company } = await supabase.from('companies').select('id, vat_rate, gewerke').eq('user_id', user.id).single()
  const { data: priceItems } = await supabase.from('price_items').select('*').eq('company_id', company?.id ?? '')
  const priceList = priceItems?.length
    ? priceItems.map(p => `- ${p.title} | ${p.unit} | ${p.unit_price}€ | Kategorie: ${p.category}`).join('\n')
    : '(leer — verwende marktübliche Preise)'

  const gewerkeContext = getGewerkePromptContext(company?.gewerke ?? [])

  const prompt = SYSTEM_PROMPT
    .replace('{PREISE}', priceList)
    .replace('{GEWERKE}', gewerkeContext || '(nicht angegeben — erkenne aus dem Aufmaß)')

  try {
    const response = await aiClient.chat.completions.create({
      model: CHAT_MODEL,
      messages: [
        { role: 'system', content: prompt },
        { role: 'user', content: `Aufmaß:\n\n${text}\n\nAntworte NUR mit validem JSON-Objekt, kein Markdown, keine Erklärung.` },
      ],
      // response_format absichtlich weggelassen — macht Probleme mit Groq-Modellen
      temperature: 0.1,
      max_tokens: 2000,
    })
    const raw = response.choices[0]?.message?.content ?? ''
    if (!raw) return NextResponse.json({ error: 'Leere Antwort vom KI-Modell' }, { status: 500 })
    // JSON aus Markdown-Fences befreien
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const result: GeneratedQuote = JSON.parse(cleaned)
    return NextResponse.json(result)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('angebot-generieren error:', msg)
    // Echte Fehlermeldung zurückgeben damit wir debuggen können
    return NextResponse.json({ error: `Analyse fehlgeschlagen: ${msg}` }, { status: 500 })
  }
}
