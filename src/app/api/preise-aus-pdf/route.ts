import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { aiClient, CHAT_MODEL } from '@/lib/ai-client'

const SYSTEM_PROMPT = `Du bist Experte für Handwerker-Kalkulation in Deutschland.
Dir wird der extrahierte Text aus einem oder mehreren echten Handwerker-Angeboten übergeben.

AUFGABE: Analysiere die Angebote und extrahiere die Preislogik des Betriebs.
Finde heraus:
- Welche Einheitspreise der Handwerker verwendet (€/m², €/Stk, €/h, €/lm etc.)
- Welche Kategorien und Leistungsarten er anbietet
- Seinen Stundensatz (falls erkennbar)
- Fahrtkosten-Ansatz (falls erkennbar)

WICHTIG:
- Nur Preise die sich klar aus dem Text ableiten lassen
- Keine Gesamtpreise nehmen — nur Einzelpreise / Einheitspreise
- Wenn ein Preis pro m² mit Mengenangabe vorkommt: Einheitspreis = Gesamtpreis ÷ Menge
- Kategorie soll das Gewerk/den Bereich beschreiben (z.B. "Malerarbeiten", "Bodenbeläge", "Fahrtkosten")
- Title soll die konkrete Leistung beschreiben (z.B. "Wände streichen 2× Anstrich", "Vinyl verlegen")
- Maximal 30 Positionen, nur die aussagekräftigsten

Antworte NUR mit JSON:
{
  "erkannte_gewerke": ["Maler", "Bodenbeläge"],
  "preise": [
    {
      "category": "Malerarbeiten",
      "title": "Wände streichen, 2× Anstrich",
      "unit": "m²",
      "unit_price": 12.50
    },
    {
      "category": "Fahrtkosten",
      "title": "Anfahrt pro km (einfache Strecke)",
      "unit": "km",
      "unit_price": 0.45
    }
  ],
  "hinweise": "optional — was auffällt (z.B. Preise wirken sehr günstig / hochpreisig)"
}`

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const formData = await req.formData()
  const files = formData.getAll('pdfs') as File[]

  if (!files.length) {
    return NextResponse.json({ error: 'Keine Dateien hochgeladen' }, { status: 400 })
  }

  // PDF-Text extrahieren
  let extractedTexts: string[] = []

  for (const file of files.slice(0, 5)) {
    try {
      const buffer = Buffer.from(await file.arrayBuffer())
      // pdf-parse dynamisch importieren (hat CommonJS-Probleme mit Next.js)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse')
      const data = await pdfParse(buffer)
      if (data.text?.trim()) {
        extractedTexts.push(`--- Angebot: ${file.name} ---\n${data.text.trim()}`)
      }
    } catch (err) {
      console.error(`PDF parse Fehler bei ${file.name}:`, err)
      // Weiter mit nächster Datei
    }
  }

  if (!extractedTexts.length) {
    return NextResponse.json({
      error: 'Konnte keine Texte aus den PDFs lesen. Sind die PDFs textbasiert (nicht gescannt)?'
    }, { status: 400 })
  }

  const combinedText = extractedTexts.join('\n\n')
  // Auf max. 8000 Zeichen kürzen um Token-Limit zu respektieren
  const trimmedText = combinedText.length > 8000
    ? combinedText.substring(0, 8000) + '\n\n[...Text gekürzt...]'
    : combinedText

  const response = await aiClient.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Hier sind die Angebote:\n\n${trimmedText}` },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
  })

  try {
    const result = JSON.parse(response.choices[0].message.content ?? '{}')
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Analyse fehlgeschlagen' }, { status: 500 })
  }
}
