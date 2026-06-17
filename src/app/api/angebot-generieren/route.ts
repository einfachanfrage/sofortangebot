import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGewerkePromptContext } from '@/lib/gewerke'
import { getAIClient, CHAT_MODEL_FAST } from '@/lib/ai-client'
import { checkUserRateLimit, checkKIBudget, trackKIUsage, rateLimitResponse } from '@/lib/rate-limiter'
import * as Sentry from '@sentry/nextjs'

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

const SYSTEM_PROMPT = `Du bist Kalkulations-Profi im deutschen Handwerk. Weise den vorgegebenen Positionen Preise zu.

PREISDATENBANK:
{PREISE}

GEWERK-KONTEXT:
{GEWERKE}

DEINE AUFGABE — NUR PREISE ZUWEISEN:
Die Positionen und Mengen sind bereits durch eine Berechnungsengine festgelegt und UNVERÄNDERLICH.
Du musst NUR für jede Position einen passenden Netto-Einzelpreis (unit_price) zuweisen.
Gib die Positionen in EXAKT DERSELBEN REIHENFOLGE zurück wie du sie erhalten hast.
Füge am Ende eine Kleinmaterial-Pauschale hinzu: min. 25€ oder 4% der Lohnkosten.

WAS DU NICHT TUN DARFST:
- Mengen (quantity) verändern — quantity wird IGNORIERT, die Engine überschreibt es
- Positionen weglassen oder umbenennen
- Neue Positionen erfinden (außer Kleinmaterial-Pauschale)

MARKTPREISE DEUTSCHLAND (Netto, wenn Preisdatenbank leer):
MALER: Wandflächen streichen 2×Anstrich: 9,50€/m² | Deckenfläche streichen: 8,50€/m² | Boden schützen/Abdecken: 2,50€/m² | Sockelleisten abkleben: 1,50€/lfdm | Tapete aufziehen: 12,00€/m² | Tapete entfernen: 4,00€/m²
FLIESEN: Bodenfliesen verlegen: 35,00€/m² | Wandfliesen verlegen: 42,00€/m² | Verbundabdichtung: 18,00€/m² | Verfugung: 8,00€/m² | Altfliesen entfernen: 15,00€/m²
TROCKENBAU: Ständerwand GK: 55,00€/m² | Abgehängte Decke: 48,00€/m² | Spachtelarbeiten Q2: 12,00€/m²
BODEN: Parkett verlegen: 28,00€/m² | Laminat verlegen: 18,00€/m² | Vinyl verlegen: 22,00€/m² | Sockelleisten: 8,00€/lfdm
SANITÄR: WC montieren: 180,00€/Stk | Waschtisch montieren: 150,00€/Stk | Dusche montieren: 320,00€/Stk | Silikon: 45,00€/Stk
ELEKTRO: Steckdose UP: 85,00€/Stk | Lichtschalter: 65,00€/Stk | Einbaustrahler: 95,00€/Stk

Antworte NUR mit JSON:
{"zusammenfassung":"...","items":[{"title":"...","description":"...","unit_price":9.50,"kategorie":"..."}],"rückfragen":[],"notizen":"..."}`

const SYSTEM_PROMPT_OHNE_MENGEN = `Du bist Kalkulations-Profi im deutschen Handwerk. Erstelle aus dem Aufmaß ein vollständiges Angebot.

PREISDATENBANK:
{PREISE}

GEWERK-KONTEXT:
{GEWERKE}

REGELN:
- Arbeitsleistung immer als eigene Positionen (Demontage, Vorbereitung, Hauptarbeit)
- Verschnitt bei Belägen/Fliesen: +10% auf Menge, im Titel erwähnen
- Kleinmaterial-Pauschale IMMER: min. 25€ oder 4% der Lohnkosten
- Mengen-Logik: Teilflächen dürfen Gesamtfläche nicht überschreiten
- Marktübliche deutsche Handwerkerpreise

Antworte NUR mit JSON:
{"zusammenfassung":"...","items":[{"title":"...","description":"...","quantity":1,"unit":"m²","unit_price":0,"kategorie":"..."}],"rückfragen":[],"notizen":"..."}`

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data: companyPlan } = await supabase.from('companies').select('plan').eq('user_id', user.id).single()
  const plan = (companyPlan as { plan?: string } | null)?.plan ?? 'starter'

  const rlCheck = await checkUserRateLimit(user.id, 'ki_extraktion', plan)
  if (!rlCheck.allowed) return rateLimitResponse(rlCheck)

  const budgetCheck = await checkKIBudget(user.id)
  if (!budgetCheck.allowed) {
    return NextResponse.json({ error: 'KI-Tageslimit erreicht. Morgen geht\'s weiter.', isKIBudget: true }, { status: 429 })
  }

  const body = await req.json() as { text?: string; berechnete_positionen?: Array<{ beschreibung: string; menge: number; einheit: string; annahmen: string[] }>; originaltext?: string }
  const text = body.text ?? body.originaltext ?? ''
  if (!text) return NextResponse.json({ error: 'Kein Text' }, { status: 400 })
  const berechnetePositionen = (body.berechnete_positionen?.length ?? 0) > 0 ? body.berechnete_positionen : null

  const { data: company } = await supabase.from('companies').select('id, vat_rate, gewerke').eq('user_id', user.id).single()
  const { data: priceItems } = await supabase.from('price_items').select('*').eq('company_id', company?.id ?? '')
  // Max 50 Einträge — Groq TPM-Limit: zu viele Preise sprengen das Token-Budget
  const priceList = priceItems?.length
    ? priceItems.slice(0, 50).map(p => `- ${p.title} | ${p.unit} | ${p.unit_price}€`).join('\n')
    : '(leer — verwende marktübliche Preise)'

  const gewerkeContext = getGewerkePromptContext(company?.gewerke ?? [])

  // Wenn berechnete Positionen vorliegen → nehme Mengen daraus, GPT nur noch für Preise
  const systemPrompt = berechnetePositionen
    ? SYSTEM_PROMPT.replace('{PREISE}', priceList).replace('{GEWERKE}', gewerkeContext || '(nicht angegeben)')
    : SYSTEM_PROMPT_OHNE_MENGEN.replace('{PREISE}', priceList).replace('{GEWERKE}', gewerkeContext || '(nicht angegeben — erkenne aus dem Aufmaß)')

  const userContent = berechnetePositionen
    ? `Aufmaß (nur zur Orientierung):\n${text}\n\nPOSITIONEN (weise nur Preise zu — gleiche Reihenfolge behalten):\n${berechnetePositionen.map((p, i) => `${i + 1}. ${p.beschreibung} | ${p.menge} ${p.einheit}`).join('\n')}\n\nAntworte NUR mit validem JSON-Objekt, kein Markdown, keine Erklärung.`
    : `Aufmaß:\n\n${text}\n\nAntworte NUR mit validem JSON-Objekt, kein Markdown, keine Erklärung.`

  try {
    const client = await getAIClient()
    const response = await client.chat.completions.create({
      model: CHAT_MODEL_FAST,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 2000,
    })
    const raw = response.choices[0]?.message?.content ?? ''
    if (!raw) return NextResponse.json({ error: 'Leere Antwort vom KI-Modell' }, { status: 500 })
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const result: GeneratedQuote = JSON.parse(cleaned)

    // Engine-Mengen überschreiben GPT-Mengen — immer, ohne Ausnahme
    // GPT darf keine eigenen Positionen hinzufügen wenn berechnetePositionen vorgegeben
    if (berechnetePositionen && result.items) {
      result.items = result.items
        .slice(0, berechnetePositionen.length) // GPT-Extras abschneiden
        .map((item, i) => {
          const eng = berechnetePositionen[i]
          if (!eng) return item
          return { ...item, quantity: eng.menge, unit: eng.einheit }
        })
    }

    // Kosten tracken (gpt-4o-mini ~$0.15/1M tokens in, $0.60/1M tokens out)
    const tokensIn = response.usage?.prompt_tokens ?? 0
    const tokensOut = response.usage?.completion_tokens ?? 0
    await trackKIUsage({
      userId: user.id,
      endpunkt: 'extraktion',
      tokensIn,
      tokensOut,
      kostenEur: (tokensIn * 0.00015 + tokensOut * 0.0006) / 1000,
    })

    return NextResponse.json(result)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('angebot-generieren error:', msg)
    Sentry.captureException(err, {
      tags: { feature: 'ki_extraktion' },
      extra: { transkript_laenge: text?.length ?? 0 },
    })
    return NextResponse.json({ error: `Analyse fehlgeschlagen: ${msg}` }, { status: 500 })
  }
}
