import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIClient, CHAT_MODEL_FAST } from '@/lib/ai-client'
import { checkUserRateLimit, checkKIBudget, trackKIUsage, rateLimitResponse } from '@/lib/rate-limiter'
import { berechneMengen } from '@/lib/mengen/engine'
import { PROMPT_EXTRAKTION } from '@/lib/mengen/prompt-extraktion'
import type { ExtrahierteDaten, MengenErgebnis } from '@/lib/mengen/types'
import * as Sentry from '@sentry/nextjs'

export const maxDuration = 60

export interface ExtraktionResponse {
  extraktion: ExtrahierteDaten
  mengen: MengenErgebnis
  hat_rueckfragen: boolean
}

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

  const { text } = await req.json() as { text: string }
  if (!text?.trim()) return NextResponse.json({ error: 'Kein Text' }, { status: 400 })

  const { data: company } = await supabase.from('companies').select('gewerke').eq('user_id', user.id).single()
  const gewerke = (company as { gewerke?: string[] } | null)?.gewerke ?? []

  const gewerkHinweis = gewerke.length > 0
    ? `\n\nDer Handwerker arbeitet hauptsächlich in: ${gewerke.join(', ')}. Bevorzuge diese Gewerke bei der Zuweisung.`
    : ''

  try {
    const client = await getAIClient()
    const response = await client.chat.completions.create({
      model: CHAT_MODEL_FAST,
      messages: [
        { role: 'system', content: PROMPT_EXTRAKTION + gewerkHinweis },
        { role: 'user', content: `Transkript:\n\n${text}\n\nAntworte NUR mit validem JSON-Objekt, kein Markdown, keine Erklärung.` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 1500,
    })

    const raw = response.choices[0]?.message?.content ?? ''
    if (!raw) return NextResponse.json({ error: 'Leere Antwort vom KI-Modell' }, { status: 500 })

    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    const extraktion = JSON.parse(cleaned) as ExtrahierteDaten
    extraktion.transkript = text

    // Kosten tracken
    const tokensIn = response.usage?.prompt_tokens ?? 0
    const tokensOut = response.usage?.completion_tokens ?? 0
    await trackKIUsage({
      userId: user.id,
      endpunkt: 'extraktion',
      tokensIn,
      tokensOut,
      kostenEur: (tokensIn * 0.00015 + tokensOut * 0.0006) / 1000,
    })

    // Lokale Mengenberechnung
    const mengen = berechneMengen(extraktion.gewerk, extraktion)

    return NextResponse.json({
      extraktion,
      mengen,
      hat_rueckfragen: mengen.rueckfragen.length > 0,
    } satisfies ExtraktionResponse)

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('angebot-extrahieren error:', msg)
    Sentry.captureException(err, { tags: { feature: 'extraktion' } })
    return NextResponse.json({ error: `Extraktion fehlgeschlagen: ${msg}` }, { status: 500 })
  }
}
