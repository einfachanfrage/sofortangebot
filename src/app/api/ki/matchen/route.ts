import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIClient, CHAT_MODEL } from '@/lib/ai-client'
import { checkUserRateLimit, checkKIBudget, trackKIUsage, rateLimitResponse } from '@/lib/rate-limiter'
import { PROMPT_KONTEXTUELLES_MATCHING } from '@/lib/ai-prompts'
import { pruefeWoerterbuch } from '@/lib/nutzer-learning'
import * as Sentry from '@sentry/nextjs'

export const maxDuration = 60

export interface MatchResult {
  index: number
  position_id: string | null
  bezeichnung_gefunden: string | null
  unit_price: number | null
  confidence: number
  begruendung: string
  alternative_ids: string[]
  kontext_genutzt: boolean
  aus_woerterbuch?: boolean
}

export interface MatchenResponse {
  matches: MatchResult[]
  kontext_positionen_count: number
  db_positionen_count: number
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data: companyData } = await supabase.from('companies').select('id, plan').eq('user_id', user.id).single()
  const plan = (companyData as { plan?: string } | null)?.plan ?? 'starter'
  const companyId = (companyData as { id?: string } | null)?.id

  const rlCheck = await checkUserRateLimit(user.id, 'ki_extraktion', plan)
  if (!rlCheck.allowed) return rateLimitResponse(rlCheck)

  const budgetCheck = await checkKIBudget(user.id)
  if (!budgetCheck.allowed) {
    return NextResponse.json({ error: 'KI-Tageslimit erreicht. Morgen geht\'s weiter.', isKIBudget: true }, { status: 429 })
  }

  const body = await req.json() as {
    positionen: Array<{ beschreibung: string; menge: number; einheit: string }>
    gewerk: string
    situation?: string
    raumdetails?: string
    angebot_id?: string
  }

  const { positionen, gewerk, situation, raumdetails, angebot_id } = body

  if (!positionen || positionen.length === 0) {
    return NextResponse.json({ matches: [], kontext_positionen_count: 0, db_positionen_count: 0 } satisfies MatchenResponse)
  }

  // Alle Preispositionen der Firma laden (nach Nutzungshäufigkeit sortiert)
  const { data: dbPositionen } = await supabase
    .from('price_items')
    .select('id, title, unit, unit_price, category, nutzungshaeufigkeit')
    .eq('company_id', companyId ?? '')
    .order('nutzungshaeufigkeit', { ascending: false })
    .limit(80)

  if (!dbPositionen || dbPositionen.length === 0) {
    return NextResponse.json({
      matches: positionen.map((_: unknown, i: number) => ({
        index: i,
        position_id: null,
        bezeichnung_gefunden: null,
        unit_price: null,
        confidence: 0,
        begruendung: 'Keine Preispositionen in der Datenbank',
        alternative_ids: [],
        kontext_genutzt: false,
      })),
      kontext_positionen_count: positionen.length,
      db_positionen_count: 0,
    } satisfies MatchenResponse)
  }

  // ── Wörterbuch-Check VOR KI-Call ──────────────────────────────────────────
  const priceMap = new Map(dbPositionen.map(p => [p.id, p]))
  const woerterbuchMatches = await pruefeWoerterbuch(
    user.id,
    positionen.map(p => p.beschreibung),
    gewerk || ''
  )

  // Positionen aufteilen: aus Wörterbuch vs. braucht KI
  const woerterbuchErgebnisse = new Map<number, MatchResult>()
  const brauchtKI: Array<{ pos: typeof positionen[number]; origIdx: number }> = []

  for (let i = 0; i < positionen.length; i++) {
    const wm = woerterbuchMatches.get(positionen[i].beschreibung)
    if (wm && wm.konfidenz >= 0.80) {
      const dbEntry = priceMap.get(wm.position_id)
      woerterbuchErgebnisse.set(i, {
        index: i,
        position_id: wm.position_id,
        bezeichnung_gefunden: dbEntry?.title ?? null,
        unit_price: dbEntry?.unit_price ?? null,
        confidence: wm.konfidenz,
        begruendung: 'Aus persönlichem Wörterbuch',
        alternative_ids: [],
        kontext_genutzt: false,
        aus_woerterbuch: true,
      })
    } else {
      brauchtKI.push({ pos: positionen[i], origIdx: i })
    }
  }

  // Wenn alle aus Wörterbuch → KI-Call überspringen
  if (brauchtKI.length === 0) {
    const allMatches = positionen.map((_, i) => woerterbuchErgebnisse.get(i)!)
    return NextResponse.json({
      matches: allMatches,
      kontext_positionen_count: positionen.length,
      db_positionen_count: dbPositionen.length,
    } satisfies MatchenResponse)
  }

  // Nur die KI-Positionen an GPT schicken
  const positionenListe = brauchtKI
    .map(({ pos }, i) => `${i} | ${pos.beschreibung} | ${pos.menge} ${pos.einheit}`)
    .join('\n')

  const dbPositionenListe = dbPositionen
    .map(p => `${p.id} | ${p.title} | ${p.unit} | ${p.unit_price} €`)
    .join('\n')

  const prompt = PROMPT_KONTEXTUELLES_MATCHING
    .replace('{{gewerk}}', gewerk || 'Nicht angegeben')
    .replace('{{situation}}', situation || 'Nicht angegeben')
    .replace('{{raumdetails}}', raumdetails || 'Nicht angegeben')
    .replace('{{positionen_liste}}', positionenListe)
    .replace('{{db_positionen}}', dbPositionenListe)

  try {
    const client = await getAIClient()
    const response = await client.chat.completions.create({
      model: CHAT_MODEL, // gpt-4o für besseres Kontext-Verständnis
      temperature: 0.1,
      max_tokens: 1500,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: prompt },
        {
          role: 'user',
          content: `Ordne alle ${positionen.length} Positionen zu. Nutze den Kontext: ${situation || gewerk || 'Handwerk'}.`,
        },
      ],
    })

    const raw = response.choices[0]?.message?.content ?? '{}'
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const result = JSON.parse(cleaned) as { matches: MatchResult[] }

    // Kosten tracken (gpt-4o: $5/1M in, $15/1M out)
    const tokensIn = response.usage?.prompt_tokens ?? 0
    const tokensOut = response.usage?.completion_tokens ?? 0
    await trackKIUsage({
      userId: user.id,
      endpunkt: 'matching',
      tokensIn,
      tokensOut,
      kostenEur: (tokensIn * 0.005 + tokensOut * 0.015) / 1000 * 0.92,
    })

    // GPT-Indizes beziehen sich auf brauchtKI → auf Original-Indizes zurückmappen
    const kiMatches: MatchResult[] = (result.matches ?? []).map((m: MatchResult) => {
      const original = brauchtKI[m.index]
      const dbEntry = m.position_id ? priceMap.get(m.position_id) : null
      return {
        ...m,
        index: original?.origIdx ?? m.index,
        unit_price: dbEntry?.unit_price ?? null,
        bezeichnung_gefunden: dbEntry?.title ?? m.bezeichnung_gefunden,
      }
    })

    // Alle Matches (Wörterbuch + KI) in Original-Reihenfolge zusammenführen
    const allMatchMap = new Map<number, MatchResult>()
    for (const [i, wm] of woerterbuchErgebnisse) allMatchMap.set(i, wm)
    for (const km of kiMatches) allMatchMap.set(km.index, km)

    const matches = positionen.map((_, i) => allMatchMap.get(i) ?? {
      index: i,
      position_id: null,
      bezeichnung_gefunden: null,
      unit_price: null,
      confidence: 0,
      begruendung: 'Nicht gematcht',
      alternative_ids: [],
      kontext_genutzt: false,
    })

    // Nutzungshäufigkeit für gematchte Positionen hochzählen
    const gematchteIds = matches
      .filter(m => m.position_id && m.confidence >= 0.6 && !m.aus_woerterbuch)
      .map(m => m.position_id as string)

    if (gematchteIds.length > 0) {
      supabase.rpc('increment_nutzung', { p_position_ids: gematchteIds }).then(
        () => {},
        () => {}
      )
    }

    return NextResponse.json({
      matches,
      kontext_positionen_count: positionen.length,
      db_positionen_count: dbPositionen.length,
    } satisfies MatchenResponse)

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('ki/matchen error:', msg)
    Sentry.captureException(err, {
      tags: { feature: 'kontextuelles_matching' },
      extra: { gewerk, positionen_count: positionen.length, angebot_id },
    })

    // Fallback: alle als ungematcht zurückgeben
    return NextResponse.json({
      matches: positionen.map((_: unknown, i: number) => ({
        index: i,
        position_id: null,
        bezeichnung_gefunden: null,
        unit_price: null,
        confidence: 0,
        begruendung: 'Matching fehlgeschlagen',
        alternative_ids: [],
        kontext_genutzt: false,
      })),
      kontext_positionen_count: positionen.length,
      db_positionen_count: dbPositionen?.length ?? 0,
    } satisfies MatchenResponse)
  }
}
