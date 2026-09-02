import { corsHeaders } from '../_shared/cors.ts'
import { PROMPT_EXTRAKTION_V4 } from '../_shared/prompt-extraktion-v4.ts'
import { trackKIUsage } from '../_shared/ki-usage.ts'
import { getUser } from '../_shared/auth.ts'
import { mitTimeout } from '../_shared/timeout.ts'
import { createOpenAIClient, openaiRequest } from '../_shared/openai.ts'



Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const auth = await getUser(req)
    if (!auth) {
      return new Response(JSON.stringify({ error: 'Nicht eingeloggt' }), {
        status: 401,
        headers: corsHeaders,
      })
    }
    const { user, supabase } = auth

    const { transkript, angebot_id, gewerk_hinweis } = await req.json()

    if (!transkript || transkript.length < 5) {
      return new Response(JSON.stringify({ error: 'Transkript zu kurz' }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    const apiKey = createOpenAIClient()
    const systemPrompt = PROMPT_EXTRAKTION_V4 + (gewerk_hinweis ? `\n\n${gewerk_hinweis}` : '')

    const result = await mitTimeout(
      async (signal) => {
        const data = await openaiRequest(
          'chat/completions',
          {
            // Bewusst gpt-4o statt gpt-4o-mini: bei diesem langen Multi-Gewerk-
            // Prompt (v. a. "genau ein Raum pro [RAUM]-Segment") hält das große
            // Modell die Anweisungen zuverlässiger ein. Kostet ca. 16× mehr pro
            // Aufruf, dafür weniger Positionen, die falsch zusammengelegt werden.
            model: 'gpt-4o',
            temperature: 0.1,
            max_tokens: 2000,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: `Transkript:\n\n${transkript}\n\nAntworte NUR mit validem JSON-Objekt, kein Markdown, keine Erklärung.` },
            ],
          },
          signal,
          apiKey
        )

        if (data.usage) {
          const { prompt_tokens: pIn, completion_tokens: pOut } = data.usage
          // gpt-4o-Preise: $2.50 / $10.00 pro 1M Tokens (Stand 2026)
          trackKIUsage(supabase, {
            userId: user.id,
            endpunkt: 'extraktion',
            tokensIn: pIn,
            tokensOut: pOut,
            kostenEur: ((pIn * 0.0025 + pOut * 0.01) / 1000) * 0.92,
          })
        }

        const raw = data.choices[0].message.content
        const parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim())
        // Hier stand von 2026-08-07 bis 2026-09-02 ein TEMP-DEBUG-Insert, der
        // JEDES Transkript und die rohe GPT-Antwort in die Tabelle
        // `debug_extraktion_roh` geschrieben hat — angelegt für die Suche nach
        // dem Multi-Raum-Bug, danach nie wieder entfernt. Das war das
        // Sensibelste, was durch dieses System läuft (Kundennamen, Adressen,
        // Gesprächsinhalte aus fremden Wohnungen), gespeichert ohne Zweck und
        // ohne Frist, in genau der Tabelle des Datenleck-Altfalls vom August.
        //
        // Entfernt samt Tabelle (Migration 20260902120000). Wer für eine
        // Fehlersuche wieder Rohdaten braucht: bitte befristet, mit
        // Löschjob und nur für den eigenen Testaccount — nicht für alle.
        return parsed
      },
      25000,
      'KI-Verarbeitung dauerte zu lange.'
    )

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unbekannt'
    console.error('[ki-extrahieren] Verarbeitung fehlgeschlagen')

    if (msg.includes('zu lange')) {
      return new Response(JSON.stringify({ error: msg, fallback: true, retry: true }), {
        status: 504,
        headers: corsHeaders,
      })
    }
    if (msg.includes('429')) {
      return new Response(
        JSON.stringify({ error: 'KI gerade überlastet. 30 Sekunden warten.', retry_after: 30 }),
        { status: 429, headers: corsHeaders }
      )
    }

    return new Response(JSON.stringify({ error: 'KI-Verarbeitung fehlgeschlagen.', fallback: true }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})
