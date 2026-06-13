import { aiClient } from '@/lib/ai-client'
import type { ApiHealthResult } from './lexoffice'

export async function testOpenAIAPI(): Promise<ApiHealthResult> {
  try {
    const res = await aiClient.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 1,
    })

    if (!res.choices?.length) return { ok: false, fehler: 'Leere Antwort vom Modell' }
    return { ok: true, version: 'v1' }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    // Groq-spezifischer Fehler: Modell nicht gefunden
    if (msg.includes('model') || msg.includes('404')) {
      return { ok: false, fehler: `Modell nicht verfügbar: ${msg}` }
    }
    return { ok: false, fehler: msg }
  }
}
