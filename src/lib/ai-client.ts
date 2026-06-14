import OpenAI from 'openai'
import { getOpenAIKey } from '@/lib/vault'

const isGroq = process.env.AI_PROVIDER === 'groq'

// Synchroner Client für Groq (kein Vault-Bedarf)
// Für OpenAI: getAIClient() verwenden (async, mit Vault-Fallback)
export const aiClient = isGroq
  ? new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
      timeout: 45000,
      maxRetries: 0,
    })
  : new OpenAI({
      apiKey: process.env.OPENAI_API_KEY ?? '',
      timeout: 45000,
      maxRetries: 0,
    })

// Modelle je nach Provider
export const CHAT_MODEL = isGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o'
export const CHAT_MODEL_FAST = isGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o-mini'
export const WHISPER_MODEL = isGroq ? 'whisper-large-v3-turbo' : 'whisper-1'

let _openaiClient: OpenAI | null = null

// Async-Getter: holt API-Key aus Vault wenn nicht in Env gesetzt
export async function getAIClient(): Promise<OpenAI> {
  if (isGroq) return aiClient

  if (_openaiClient) return _openaiClient

  try {
    const apiKey = await getOpenAIKey()
    _openaiClient = new OpenAI({ apiKey, timeout: 45000, maxRetries: 0 })
    return _openaiClient
  } catch {
    // Fallback auf synchronen Client (funktioniert wenn OPENAI_API_KEY in Env)
    return aiClient
  }
}
