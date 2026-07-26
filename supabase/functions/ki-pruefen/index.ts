import { corsHeaders } from '../_shared/cors.ts'
import { getUser } from '../_shared/auth.ts'
import { mitTimeout } from '../_shared/timeout.ts'
import { createOpenAIClient, openaiRequest } from '../_shared/openai.ts'

const PROMPT_PLAUSIBILITAET = `Du bist ein erfahrener Kalkulationsprüfer für das deutsche Handwerk.

Prüfe dieses Angebot auf Plausibilität. Reagiere NUR auf echte Probleme — nicht auf Kleinigkeiten.

GEWERK: {{gewerk}}

POSITIONEN MIT MENGEN:
{{positionen_mit_mengen}}

GESAMTSUMME: {{summe}} €

PRÜFPUNKTE:
1. Sind die Mengen realistisch für das Gewerk? (z.B. 500 m² Wände in einem Zimmer = Problem)
2. Fehlen typische Positionen für diesen Auftragstyp? (z.B. Bad ohne Abdichtung)
3. Stimmen die Einheiten? (m² für Laufmeter, etc.)
4. Ist der Gesamtpreis grob plausibel?

REGELN:
- Nur wirklich kritische Warnungen ausgeben (max. 2)
- Nur wichtige fehlende Positionen vorschlagen (max. 2)
- Keine Stilkritik, keine Materialempfehlungen
- Wenn alles ok: warnungen und vorschlaege leer lassen

Antworte NUR mit diesem JSON:
{"plausibel":true,"warnungen":[],"vorschlaege":[]}`

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const leerErgebnis = { plausibel: true, warnungen: [], vorschlaege: [] }

  try {
    const auth = await getUser(req)
    if (!auth) {
      return new Response(JSON.stringify({ error: 'Nicht eingeloggt' }), {
        status: 401,
        headers: corsHeaders,
      })
    }
    const { user, supabase } = auth

    const { gewerk, positionen, summe, angebot_id } = await req.json()

    // Mindestens 2 Positionen für sinnvolle Prüfung
    if (!positionen || positionen.length < 2) {
      return new Response(JSON.stringify({ result: leerErgebnis }), {
        status: 200,
        headers: corsHeaders,
      })
    }

    // deno-lint-ignore no-explicit-any
    const positionenText = positionen.map((p: any) =>
      `- ${p.bezeichnung ?? p.beschreibung}: ${p.menge} ${p.einheit} = ${p.gesamtpreis ?? p.total_gross ?? 0} €`
    ).join('\n')

    const prompt = PROMPT_PLAUSIBILITAET
      .replace('{{gewerk}}', gewerk || 'unbekannt')
      .replace('{{positionen_mit_mengen}}', positionenText)
      .replace('{{summe}}', String(summe || 0))

    const apiKey = createOpenAIClient()

    const result = await mitTimeout(
      async (signal) => {
        const data = await openaiRequest(
          'chat/completions',
          {
            model: 'gpt-4o',
            temperature: 0.1,
            max_tokens: 300,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: prompt },
              { role: 'user', content: 'Prüfe dieses Angebot.' },
            ],
          },
          signal,
          apiKey
        )

        if (data.usage) {
          const { prompt_tokens: pIn, completion_tokens: pOut } = data.usage
          supabase.from('ki_usage').insert({
            user_id: user.id,
            angebot_id: angebot_id || null,
            prompt_typ: 'plausibilitaet',
            input_tokens: pIn,
            output_tokens: pOut,
            kosten_eur: ((pIn * 0.005 + pOut * 0.015) / 1000) * 0.92,
          }).then(() => {})
        }

        return JSON.parse(data.choices[0].message.content)
      },
      20000,
      'Plausibilitätsprüfung übersprungen.'
    )

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch {
    console.error('[ki-pruefen] Verarbeitung fehlgeschlagen')

    // Plausibilitätsfehler NIE den Flow blocken
    return new Response(JSON.stringify({ result: leerErgebnis }), {
      status: 200,
      headers: corsHeaders,
    })
  }
})
