import { createClient } from '@supabase/supabase-js'

const cache: Record<string, string> = {}

export async function getVaultSecret(name: string): Promise<string | null> {
  if (cache[name]) return cache[name]

  try {
    const service = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Vault secrets via RPC (service role hat Zugriff auf vault schema)
    const { data, error } = await service.rpc('get_vault_secret', { secret_name: name })

    if (error || !data) return null

    cache[name] = data as string
    return cache[name]
  } catch {
    return null
  }
}

export async function getOpenAIKey(): Promise<string> {
  // Env-Variable hat Vorrang (Vercel, .env.local)
  const envKey = process.env.OPENAI_API_KEY
  if (envKey && envKey !== 'your_openai_api_key' && envKey.startsWith('sk-')) {
    return envKey
  }

  // Fallback: Supabase Vault
  const vaultKey = await getVaultSecret('OPENAI_API_KEY')
  if (vaultKey) return vaultKey

  throw new Error('OPENAI_API_KEY weder in Env-Variablen noch in Supabase Vault gefunden')
}
