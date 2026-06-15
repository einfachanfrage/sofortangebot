export function createOpenAIClient(): string {
  const apiKey = Deno.env.get('OPENAI_API_KEY')
  if (!apiKey) throw new Error('OPENAI_API_KEY nicht gesetzt')
  return apiKey
}

export async function openaiRequest(
  endpoint: string,
  // deno-lint-ignore no-explicit-any
  body: any,
  signal: AbortSignal,
  apiKey: string
  // deno-lint-ignore no-explicit-any
): Promise<any> {
  const response = await fetch(`https://api.openai.com/v1/${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`OpenAI ${response.status}: ${error.error?.message ?? 'Unbekannt'}`)
  }

  return response.json()
}
