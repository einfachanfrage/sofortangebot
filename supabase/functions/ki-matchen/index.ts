import { corsHeaders } from '../_shared/cors.ts'
import { getUser } from '../_shared/auth.ts'
import { mitTimeout } from '../_shared/timeout.ts'
import { createOpenAIClient, openaiRequest } from '../_shared/openai.ts'
// deno-lint-ignore no-unused-vars
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const PROMPT_KONTEXTUELLES_MATCHING = `Du bist ein spezialisierter Kalkulator für das deutsche Handwerk.

Deine Aufgabe: Ordne alle Positionen eines Angebots auf einmal den passenden Einträgen aus der Positionsdatenbank zu.

Du siehst dabei den VOLLEN KONTEXT:
- Das Gewerk
- Alle Positionen zusammen
- Die Raumsituation
- Bereits erkannte Zusammenhänge

Nutze diesen Kontext aktiv:
- "bodengleiche Dusche" im Bad bei Fliesen-Auftrag → Bodengleiche Dusche einbauen (nicht Duschtasse)
- "Decke" beim Maler nach "Wände streichen" → Deckenfläche streichen (nicht Unterdecke GK)
- "Abkleben" bei Malerarbeiten → Sockelleisten abkleben (nicht Folie)
- "Anschluss" beim Elektriker nach "Herd" → Herdanschluss (nicht Wasseranschluss)

REGELN:
- Antworte AUSSCHLIESSLICH mit validem JSON
- Für jede Input-Position eine Output-Position
- Reihenfolge beibehalten
- Wenn keine passende DB-Position: position_id = null
- confidence unter 0.55: lieber null als falsch
- alternative_ids: bis zu 2 weitere Optionen
- begruendung: warum du diese Wahl getroffen hast (intern, nicht für Nutzer)

KONTEXT DES AUFTRAGS:
Gewerk: {{gewerk}}
Gesamtsituation: {{situation}}
Raumdetails: {{raumdetails}}

ZU MATCHENDE POSITIONEN:
{{positionen_liste}}
Format: INDEX | Beschreibung | Menge | Einheit

VERFÜGBARE DB-POSITIONEN:
{{db_positionen}}
Format: ID | Bezeichnung | Einheit | Preis €

AUSGABE:
{"matches":[{"index":0,"position_id":"string oder null","bezeichnung_gefunden":"string oder null","confidence":0.0,"begruendung":"string","alternative_ids":["id1","id2"],"kontext_genutzt":true}]}`

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

    const { positionen, gewerk, situation, raumdetails, angebot_id } = await req.json()

    if (!positionen?.length) {
      return new Response(JSON.stringify({ matches: [] }), {
        status: 200,
        headers: corsHeaders,
      })
    }

    // Service-Role-Client für DB-Abfragen (alle Positionen sehen)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data: dbPositionen } = await supabaseAdmin
      .from('positionen')
      .select('id, bezeichnung, einheit, preis_netto')
      .eq('gewerk_id', gewerk)
      .order('nutzungshaeufigkeit', { ascending: false })
      .limit(60)

    // deno-lint-ignore no-explicit-any
    const positionenListe = positionen.map((p: any, i: number) =>
      `${i} | ${p.beschreibung} | ${p.menge} ${p.einheit}`
    ).join('\n')

    // deno-lint-ignore no-explicit-any
    const dbListe = (dbPositionen || []).map((p: any) =>
      `${p.id} | ${p.bezeichnung} | ${p.einheit} | ${p.preis_netto} €`
    ).join('\n')

    const prompt = PROMPT_KONTEXTUELLES_MATCHING
      .replace('{{gewerk}}', gewerk || '')
      .replace('{{situation}}', situation || '')
      .replace('{{raumdetails}}', raumdetails || '')
      .replace('{{positionen_liste}}', positionenListe)
      .replace('{{db_positionen}}', dbListe)

    const apiKey = createOpenAIClient()

    const result = await mitTimeout(
      async (signal) => {
        const data = await openaiRequest(
          'chat/completions',
          {
            model: 'gpt-4o',
            temperature: 0.1,
            max_tokens: 1500,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: prompt },
              { role: 'user', content: `Ordne alle ${positionen.length} Positionen zu.` },
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
            prompt_typ: 'matching',
            input_tokens: pIn,
            output_tokens: pOut,
            kosten_eur: ((pIn * 0.005 + pOut * 0.015) / 1000) * 0.92,
          }).then(() => {})
        }

        return JSON.parse(data.choices[0].message.content)
      },
      30000,
      'Matching dauerte zu lange.'
    )

    // Nutzungshäufigkeit updaten (fire & forget)
    const gematchteIds = (result.matches || [])
      // deno-lint-ignore no-explicit-any
      .filter((m: any) => m.position_id && m.confidence >= 0.6)
      // deno-lint-ignore no-explicit-any
      .map((m: any) => m.position_id)

    for (const id of gematchteIds) {
      supabaseAdmin.rpc('increment_nutzung', { p_position_id: id }).then(() => {})
    }

    return new Response(JSON.stringify({ matches: result.matches || [] }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unbekannt'
    console.error('KI-Matching Fehler:', msg)

    // Matching-Fehler soll Flow nicht brechen → 200 mit leerem Array
    return new Response(JSON.stringify({ matches: [], fehler: msg, fallback: true }), {
      status: 200,
      headers: corsHeaders,
    })
  }
})
