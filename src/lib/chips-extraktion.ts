import type OpenAI from 'openai'
import { CHAT_MODEL_FAST } from './ai-client'

// Schnelle Positions-Erkennung ("Chips") für die Aufnahme-Cards im Aufmaß-Flow.
// Zeigt dem Nutzer sofort, WAS erkannt wurde — die echten Mengen/Preise rechnet
// später die Engine in generiere-positionen.

export async function extrahiereChips(
  client: OpenAI,
  transkript: string,
  kontextNotizen?: string,
): Promise<{ positionen: unknown[]; tokensIn: number; tokensOut: number }> {
  const systemPrompt = `Du bist Kalkulations-Profi im deutschen Handwerk.
Extrahiere aus dem Aufmaß die konkreten Positionen als JSON.

WICHTIG: Jede Arbeit ist eine EIGENE Position. Wände streichen und Decke streichen sind IMMER getrennte Positionen, auch wenn im gleichen Satz genannt.
Beispiel: "Wände und Decke streichen" → zwei Positionen: "Wände streichen" und "Decke streichen".

Wenn ein Raum genannt wird, schreib ihn mit " — Raumname" ans Ende des Titels.
Beispiel: "Wände streichen — Wohnzimmer", "Decke streichen — Küche"

Wenn nur Räume und Flächen ohne Arbeiten genannt sind (z.B. Grundriss), gib die Räume als Positionen zurück, z.B. {"titel":"Wohnzimmer — 24,5 m²","erkannt":true}.

${kontextNotizen ? `BISHERIGER KONTEXT:\n${kontextNotizen}\n` : ''}

Antworte NUR mit JSON:
{
  "positionen": [
    {
      "titel": "Wände streichen — Wohnzimmer",
      "menge": 35,
      "einheit": "m²",
      "einzelpreis": 8,
      "gesamtpreis": 280,
      "erkannt": true
    }
  ]
}

Wenn etwas unklar ist, setze erkannt: false und einzelpreis: 0.
Typische Preise: Maler 25-45€/m², Fliesen 35-65€/m², Elektro 65-95€/h`

  const response = await client.chat.completions.create({
    model: CHAT_MODEL_FAST,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: transkript },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.1,
    max_tokens: 800,
  })

  let positionen: unknown[] = []
  try {
    positionen = JSON.parse(response.choices[0]?.message?.content ?? '{}').positionen ?? []
  } catch {
    positionen = []
  }

  return {
    positionen,
    tokensIn: response.usage?.prompt_tokens ?? 0,
    tokensOut: response.usage?.completion_tokens ?? 0,
  }
}
