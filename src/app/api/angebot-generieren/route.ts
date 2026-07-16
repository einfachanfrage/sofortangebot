import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGewerkePromptContext } from '@/lib/gewerke'
import { getAIClient, CHAT_MODEL_FAST } from '@/lib/ai-client'
import { pruefeKIZugriff, trackKIUsage } from '@/lib/rate-limiter'
import { kleinmaterialPosition, anfahrtPosition } from '@/lib/gewerke-config'
import { erkenneArbeiten } from '@/lib/arbeiten-normalisierer'
import { malerFallbackPreis } from '@/lib/preis-fallback'
import { waehleUntertitel } from '@/lib/positions-untertitel'
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
WICHTIG: unit_price ist der PREIS PRO EINHEIT (pro m², pro Stk, pro lfdm) — NIEMALS der Gesamtpreis!
Beispiel: "Deckenfläche streichen | 8 m²" → unit_price: 8.50 (nicht 68.00!). Gesamtpreis = quantity × unit_price, das berechnet das System automatisch.
Gib die Positionen in EXAKT DERSELBEN REIHENFOLGE zurück wie du sie erhalten hast.

WAS DU NICHT TUN DARFST:
- Mengen (quantity) verändern — quantity wird IGNORIERT, die Engine überschreibt es
- Positionen weglassen, umbenennen oder zusammenfassen
- Neue Positionen erfinden
- Mehrere Positionen zu einer kombinieren — JEDE Position bekommt einen eigenen Eintrag
- Bei MALER + Tapezieren/Raufaser: NIEMALS "Untergrund glätten", "Spachteln" oder Trockenbau-Positionen ergänzen — Raufaser verbirgt Unebenheiten

MARKTPREISE DEUTSCHLAND (Netto, wenn Preisdatenbank leer):
MALER: Wandflächen streichen 2×Anstrich: 9,50€/m² | Deckenfläche streichen: 8,50€/m² | Boden schützen/Abdecken: 2,50€/m² | Sockelleisten abkleben: 1,50€/lfdm | Tapete aufziehen: 12,00€/m² | Tapete entfernen: 4,00€/m²
FLIESEN: Bodenfliesen verlegen: 35,00€/m² | Wandfliesen verlegen: 42,00€/m² | Verbundabdichtung: 18,00€/m² | Verfugung: 8,00€/m² | Altfliesen entfernen: 15,00€/m²
TROCKENBAU: Ständerwand GK: 55,00€/m² | Abgehängte Decke: 48,00€/m² | Spachtelarbeiten Q2: 12,00€/m²
BODEN: Fertigparkett verlegen: 28,00€/m² | Parkett verlegen: 28,00€/m² | Laminat verlegen: 18,00€/m² | Klick-Vinyl verlegen: 24,00€/m² | Vinyl-Boden verlegen: 22,00€/m² | Vinyl verlegen: 22,00€/m² | Kork verlegen: 26,00€/m² | Linoleum verlegen: 20,00€/m² | Teppichboden verlegen: 16,00€/m² | Nadelvlies-Teppichboden verlegen: 14,00€/m² | Sockelleisten montieren: 8,00€/lfdm | Altbelag entfernen: 8,00€/m² | Untergrundvorbereitung / Ausgleich: 12,00€/m² | Epoxidharz-Feuchtigkeitssperre aufwalzen: 18,00€/m² | Parkett schleifen: 15,00€/m²
HINWEIS: Titel wie "Fertigparkett verlegen inkl. 10% Verschnitt" → Preis für "Fertigparkett verlegen" verwenden (Verschnitt-Suffix ignorieren)
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
- Mengen-Logik: Teilflächen dürfen Gesamtfläche nicht überschreiten
- Keine Kleinmaterial-Pauschale hinzufügen — wird automatisch ergänzt
- Marktübliche deutsche Handwerkerpreise

Antworte NUR mit JSON:
{"zusammenfassung":"...","items":[{"title":"...","description":"...","quantity":1,"unit":"m²","unit_price":0,"kategorie":"..."}],"rückfragen":[],"notizen":"..."}`

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const blocked = await pruefeKIZugriff(user.id, 'ki_extraktion')
  if (blocked) return blocked

  const body = await req.json() as { text?: string; berechnete_positionen?: Array<{ beschreibung: string; menge: number; einheit: string; annahmen: string[]; berechnungsweg?: string; flaechen_parameter?: { brutto_m2: number; fenster_anzahl: number; fenster_einzelflaeche: number; tuer_anzahl: number; tuer_einzelflaeche: number } }>; originaltext?: string }
  const text = body.text ?? body.originaltext ?? ''
  if (!text) return NextResponse.json({ error: 'Kein Text' }, { status: 400 })
  const berechnetePositionen = (body.berechnete_positionen?.length ?? 0) > 0 ? body.berechnete_positionen : null

  const { data: company } = await supabase.from('companies').select('id, vat_rate, gewerke, kleinmaterial_config, anfahrt_config').eq('user_id', user.id).single()
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
    if (berechnetePositionen && result.items) {
      const gptItemsOrig = [...result.items]
      // Preis-Lookup: title (normalisiert) → unit_price
      const gptPreise = new Map<string, number>()
      for (const item of gptItemsOrig) {
        const key = (item.title ?? '').toLowerCase().replace(/[^a-zäöüß0-9]/g, '')
        if (item.unit_price > 0) gptPreise.set(key, item.unit_price)
      }
      // Jede berechnetePosition bekommt einen eigenen Item
      result.items = berechnetePositionen.map((eng, i) => {
        const engKey = eng.beschreibung.toLowerCase().replace(/[^a-zäöüß0-9]/g, '')
        const gptItem = gptItemsOrig[i]
        let price = gptPreise.get(engKey) ?? gptItem?.unit_price ?? 0
        // Sicherheitsnetz: kein Preis von GPT → deterministischer Marktpreis-Fallback,
        // damit Kernpositionen nie stumm auf 0 € stehen (Beta: "Nullerpositionen")
        if (!price || price <= 0) price = malerFallbackPreis(eng.beschreibung, eng.einheit) ?? 0
        // Untertitel: deterministischer Generator gewinnt; KI nur bei echtem Satz
        // (GPT liefert im Preis-Modus oft nur die Menge zurück → würde "47,71 m²" zeigen)
        const description = waehleUntertitel(eng.beschreibung, gptItem?.description) ?? undefined
        return {
          title: eng.beschreibung,
          description,
          unit_price: price,
          quantity: eng.menge,
          unit: eng.einheit,
          kategorie: gptItem?.kategorie ?? '',
          // Rechenweg-Transparenz ("rechnet statt rät") — für die Info-Anzeige pro Position
          berechnungsweg: eng.berechnungsweg ?? null,
          annahmen: eng.annahmen ?? [],
          ...(eng.flaechen_parameter ? { flaechen_parameter: eng.flaechen_parameter } : {}),
        }
      })
      // Kleinmaterial: AI-Vorschläge entfernen, programmatisch nach Schwelle ergänzen
      result.items = result.items.filter((it: { title?: string }) =>
        !(it.title ?? '').toLowerCase().includes('kleinmaterial')
      )
      const summeNetto = result.items.reduce((s: number, it: { unit_price?: number; quantity?: number }) =>
        s + (it.unit_price ?? 0) * (it.quantity ?? 1), 0)
      const gewerk = company?.gewerke?.[0] ?? null
      const klein = kleinmaterialPosition(gewerk, summeNetto, company?.kleinmaterial_config ?? null)
      if (klein) result.items.push(klein)

      // An- und Abfahrt: AI-Vorschläge entfernen, nach Betriebs-Einstellung ergänzen
      result.items = result.items.filter((it: { title?: string }) => {
        const t = (it.title ?? '').toLowerCase()
        return !(t.includes('anfahrt') || t.includes('abfahrt') || t.includes('fahrtkosten'))
      })
      const anfahrt = anfahrtPosition(company?.anfahrt_config ?? null)
      if (anfahrt) result.items.push(anfahrt)

      // Bei NEU-Tapezieren (Raufaser/Vlies aufziehen): Untergrund glätten/Spachteln
      // entfällt — die Tapete verbirgt Unebenheiten. ABER nur bei echtem Neu-Aufziehen,
      // NICHT bei "Raufaser abnehmen und streichen" (da ist Spachteln nötig!).
      const arbeiten = erkenneArbeiten(text)
      const istNeuTapezieren = arbeiten.has('tapezieren') && !arbeiten.has('tapete_entfernen')
      if (istNeuTapezieren) {
        result.items = result.items.filter((it: { title?: string; kategorie?: string }) => {
          const t = (it.title ?? '').toLowerCase()
          const k = (it.kategorie ?? '').toLowerCase()
          return !k.includes('trockenbau') && !t.includes('spachtel') && !t.includes('glätten') && !t.includes('untergrund gl')
        })
      }
    }

    // Kleinmaterial aus notizen entfernen (KI schreibt es manchmal rein)
    if (result.notizen) {
      result.notizen = result.notizen
        .split('\n')
        .filter((line: string) => !line.toLowerCase().includes('kleinmaterial'))
        .join('\n')
        .trim()
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
