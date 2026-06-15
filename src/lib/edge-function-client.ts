const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function callEdgeFunction(
  name: string,
  body: FormData | Record<string, unknown>,
  token: string,
  isFormData = false
): Promise<unknown> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    apikey: SUPABASE_ANON_KEY,
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: 'POST',
    headers,
    body: isFormData ? (body as FormData) : JSON.stringify(body),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({})) as Record<string, unknown>
    throw new Error((error.error as string) || `Edge Function ${name} Fehler: ${response.status}`)
  }

  return response.json()
}
