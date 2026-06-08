import OpenAI from 'openai'

const isGroq = process.env.AI_PROVIDER === 'groq'

export const aiClient = isGroq
  ? new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    })
  : new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

// Modelle je nach Provider
export const CHAT_MODEL = isGroq ? 'llama-3.3-70b-versatile' : 'gpt-4o'
export const WHISPER_MODEL = isGroq ? 'whisper-large-v3-turbo' : 'whisper-1'
