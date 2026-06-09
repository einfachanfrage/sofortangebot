import OpenAI from 'openai'

const isGroq = process.env.AI_PROVIDER === 'groq'

export const aiClient = isGroq
  ? new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
      timeout: 45000,
      maxRetries: 0,
    })
  : new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 45000,
      maxRetries: 0,
    })

// Modelle je nach Provider
// llama-3.1-8b-instant: 30.000 TPM (Free) vs 6.000 TPM bei 70b — besser für Prod
export const CHAT_MODEL = isGroq ? 'llama-3.1-8b-instant' : 'gpt-4o'
export const WHISPER_MODEL = isGroq ? 'whisper-large-v3-turbo' : 'whisper-1'
