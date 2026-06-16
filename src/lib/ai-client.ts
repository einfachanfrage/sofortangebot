import OpenAI from 'openai'
import { getOpenAIKey } from '@/lib/vault'

export const aiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
  timeout: 45000,
  maxRetries: 0,
})

export const CHAT_MODEL = 'gpt-4o'
export const CHAT_MODEL_FAST = 'gpt-4o-mini'
export const WHISPER_MODEL = 'whisper-1'

let _openaiClient: OpenAI | null = null

export async function getAIClient(): Promise<OpenAI> {
  if (_openaiClient) return _openaiClient

  try {
    const apiKey = await getOpenAIKey()
    _openaiClient = new OpenAI({ apiKey, timeout: 45000, maxRetries: 0 })
    return _openaiClient
  } catch {
    return aiClient
  }
}
