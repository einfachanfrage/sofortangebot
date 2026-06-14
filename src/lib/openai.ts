import OpenAI from 'openai'
import { getOpenAIKey } from '@/lib/vault'

let _client: OpenAI | null = null

export async function getOpenAIClient(): Promise<OpenAI> {
  if (_client) return _client
  const apiKey = await getOpenAIKey()
  _client = new OpenAI({ apiKey, timeout: 45000, maxRetries: 0 })
  return _client
}
