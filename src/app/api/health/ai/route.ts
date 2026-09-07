import { NextResponse } from 'next/server'
import { aiClient, CHAT_MODEL } from '@/lib/ai-client'
import * as Sentry from '@sentry/nextjs'

export const dynamic = 'force-dynamic'
export const maxDuration = 15

export async function GET() {
  try {
    // Minimaler Test mit günstigstem Modell
    await aiClient.chat.completions.create({
      model: CHAT_MODEL,
      max_tokens: 1,
      messages: [{ role: 'user', content: 'Ping' }],
    })
    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('[health-ai] Prüfung fehlgeschlagen')
    Sentry.captureException(error, { level: 'error', tags: { feature: 'health_check_ai' } })
    return NextResponse.json({ status: 'error' }, { status: 503 })
  }
}
