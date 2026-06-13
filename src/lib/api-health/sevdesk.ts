import type { ApiHealthResult } from './lexoffice'

export async function testSevdeskAPI(apiKey: string): Promise<ApiHealthResult> {
  try {
    const res = await fetch('https://my.sevdesk.de/api/v1/Contact?limit=1', {
      headers: { 'Authorization': apiKey },
      signal: AbortSignal.timeout(10000),
    })

    if (res.status === 401) return { ok: false, fehler: 'API-Token ungültig oder abgelaufen' }
    if (!res.ok) return { ok: false, fehler: `HTTP ${res.status}: ${res.statusText}` }

    return { ok: true, version: 'v1' }
  } catch (e) {
    return { ok: false, fehler: `Netzwerkfehler: ${e instanceof Error ? e.message : String(e)}` }
  }
}
