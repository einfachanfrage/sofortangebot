import { NextResponse } from 'next/server'
import { aiClient, CHAT_MODEL } from '@/lib/ai-client'

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
    console.error('AI health check failed:', error)
    return NextResponse.json({ status: 'error', error: String(error) }, { status: 503 })
  }
}
