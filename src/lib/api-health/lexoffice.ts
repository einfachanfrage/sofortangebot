export interface ApiHealthResult {
  ok: boolean
  version?: string
  fehler?: string
}

export async function testLexofficeAPI(apiKey: string): Promise<ApiHealthResult> {
  try {
    const res = await fetch('https://api.lexoffice.io/v1/profile', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (res.status === 401) return { ok: false, fehler: 'API-Key ungültig oder abgelaufen' }
    if (res.status === 404) return { ok: false, fehler: 'Endpunkt nicht gefunden — API möglicherweise geändert' }
    if (!res.ok) return { ok: false, fehler: `HTTP ${res.status}: ${res.statusText}` }

    const version = res.headers.get('X-API-Version') ?? 'v1'
    return { ok: true, version }
  } catch (e) {
    return { ok: false, fehler: `Netzwerkfehler: ${e instanceof Error ? e.message : String(e)}` }
  }
}
