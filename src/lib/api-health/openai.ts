import { getAIClient } from '@/lib/ai-client'
import type { ApiHealthResult } from './lexoffice'

export async function testOpenAIAPI(): Promise<ApiHealthResult> {
  try {
    const client = await getAIClient()
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 1,
    })

    if (!res.choices?.length) return { ok: false, fehler: 'Leere Antwort vom Modell' }
    return { ok: true, version: 'v1' }
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    return { ok: false, fehler: msg }
  }
}
