import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIClient, CHAT_MODEL_FAST } from '@/lib/ai-client'
import { checkUserRateLimit, checkKIBudget, trackKIUsage, rateLimitResponse } from '@/lib/rate-limiter'
import { berechneMengen } from '@/lib/mengen/engine'
import { berechneBewertung } from '@/lib/mengen/bewertung'
import { PROMPT_EXTRAKTION_V4 } from '@/lib/ai-prompts'
import { ersetzeZahlenWorte } from '@/lib/zahlen-parser'
import { segmentiereRaeume, loeseKorrekturenAuf, bauSegmentiertenTranskript } from '@/lib/raum-segmentierer'
import { erkenneErgaenzungen, bereiteFuerKiAuf } from '@/lib/ergaenzungs-erkenner'
import { extrahiereKorrekturen, formatKorrekturenFuerKi } from '@/lib/korrektur-resolver'
import { wendeImplizitRegelnAn } from '@/lib/implizit-wissen'
import type { ExtrahierteDaten, MengenErgebnis, KalkulationsBewertung, KIRueckfrage } from '@/lib/mengen/types'
import * as Sentry from '@sentry/nextjs'

export const maxDuration = 60

export interface ExtraktionResponse {
  extraktion: ExtrahierteDaten
  mengen: MengenErgebnis
  bewertung: KalkulationsBewertung
  hat_rueckfragen: boolean
  implizit_positionen: string[]
  implizit_flags: Record<string, unknown>
  korrekturen_erkannt: number
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

  // Vorverarbeitung: Zahlwörter ersetzen + Multi-Raum-Segmentierung
  const textMitZahlen = ersetzeZahlenWorte(text)
  const segmente = segmentiereRaeume(textMitZahlen)
  const segmenteGeklaert = loeseKorrekturenAuf(segmente)
  const segmentiertText = segmenteGeklaert.length > 1
    ? bauSegmentiertenTranskript(segmenteGeklaert)
    : textMitZahlen

  // Ergänzungs-Erkennung + Korrektur-Auflösung
  const ergaenzungen = erkenneErgaenzungen(segmentiertText)
  const korrekturen = extrahiereKorrekturen(segmentiertText)
  let verarbeitetText = bereiteFuerKiAuf(segmentiertText, ergaenzungen)
  if (korrekturen.length > 0) {
    verarbeitetText += formatKorrekturenFuerKi(korrekturen)
  }

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
        { role: 'system', content: PROMPT_EXTRAKTION_V4 + gewerkHinweis },
        { role: 'user', content: `Transkript:\n\n${verarbeitetText}\n\nAntworte NUR mit validem JSON-Objekt, kein Markdown, keine Erklärung.` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
      max_tokens: 2000,
    })

    const raw = response.choices[0]?.message?.content ?? ''
    if (!raw) return NextResponse.json({ error: 'Leere Antwort vom KI-Modell' }, { status: 500 })

    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
    let extraktion = JSON.parse(cleaned) as ExtrahierteDaten
    extraktion.transkript = verarbeitetText

    // Implizit-Wissen anwenden (nach GPT-Extraktion)
    const implizitResultat = wendeImplizitRegelnAn(text, extraktion.gewerk, extraktion)
    extraktion = implizitResultat.extraktion_angereichert

    // Neue implizite Positionen als Rückfragen-Hinweise ins annahmen[]-Feld
    if (implizitResultat.neue_positionen.length > 0) {
      extraktion.annahmen = [
        ...(extraktion.annahmen ?? []),
        ...implizitResultat.neue_positionen.map(p => `Automatisch erkannt: ${p}`),
      ]
    }

    // Neue implizite Rückfragen ergänzen
    if (implizitResultat.neue_rueckfragen.length > 0) {
      const neueRueckfragen: KIRueckfrage[] = implizitResultat.neue_rueckfragen.map((frage, i) => ({
        id: `implizit_${i}`,
        frage,
        typ: 'ja_nein' as const,
        betrifft: 'Allgemein',
        prioritaet: 1,
        schnell_antworten: [
          { label: 'Ja', wert: true },
          { label: 'Nein', wert: false },
        ],
      }))
      extraktion.rueckfragen = [...(extraktion.rueckfragen ?? []), ...neueRueckfragen]
    }

    if (implizitResultat.angewendete_regeln.length > 0) {
      console.log('Implizit-Regeln angewendet:', implizitResultat.angewendete_regeln.map(r => r.aenderung))
    }

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

    // Lokale Mengenberechnung + Bewertung
    const mengen = berechneMengen(extraktion.gewerk, extraktion)
    const bewertung = berechneBewertung(extraktion, mengen)

    return NextResponse.json({
      extraktion,
      mengen,
      bewertung,
      hat_rueckfragen: mengen.rueckfragen.length > 0,
      implizit_positionen: implizitResultat.neue_positionen,
      implizit_flags: implizitResultat.neue_flags,
      korrekturen_erkannt: korrekturen.length,
    } satisfies ExtraktionResponse)

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('angebot-extrahieren error:', msg)
    Sentry.captureException(err, { tags: { feature: 'extraktion' } })
    return NextResponse.json({ error: `Extraktion fehlgeschlagen: ${msg}` }, { status: 500 })
  }
}
