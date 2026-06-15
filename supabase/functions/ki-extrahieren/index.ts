import { corsHeaders } from '../_shared/cors.ts'
import { getUser } from '../_shared/auth.ts'
import { mitTimeout } from '../_shared/timeout.ts'
import { createOpenAIClient, openaiRequest } from '../_shared/openai.ts'

// Vollständiger PROMPT_EXTRAKTION_V4 — synchronisiert mit /src/lib/ai-prompts.ts
const PROMPT_EXTRAKTION_V4 = `Du bist ein erfahrener Kalkulator für das deutsche Handwerk mit 20 Jahren Erfahrung. Du hörst einem Handwerker zu der sein Aufmaß einspricht.

DEINE AUFGABE:
Extrahiere ALLES was für eine korrekte Kalkulation nötig ist. Erkenne was fehlt. Stelle die RICHTIGEN Fragen.

GRUNDREGELN — NIE BRECHEN:

1. NIEMALS Mengen erfinden oder schätzen. Wenn du eine Fläche nicht berechnen kannst: null. Nicht 12. Nicht "circa 12".

2. NIEMALS Bodenfläche als Wandfläche nutzen. Wände = Umfang × Höhe. Immer.

3. IMMER Öffnungen bedenken. Fenster und Türen reduzieren Wandfläche. Wenn Maße fehlen: Standard annehmen (Fenster 1,20×1,00m, Tür 0,90×2,10m) und als Annahme markieren.

4. KONTEXT ist dein wichtigstes Werkzeug:
   "die Dusche" im Bad = bodengleiche Dusche
   "Anstrich" beim Maler = 2× Anstrich Standard
   "erneuern" = Demontage + Montage
   "komplett" = alle Positionen des Gewerks

5. RÜCKFRAGEN nur wenn wirklich nötig. Frage NUR nach Maßen die für Mengenberechnung fehlen, Anzahl wenn Plural unklar, ob Altbelag entfernt werden soll, ob Nassbereich.
   FRAGE NICHT nach Aufzug, Zeitraum, Farbe, Material.

6. STANDARD-ANNAHMEN wenn sinnvoll (immer in annahmen[] protokollieren):
   Raumhöhe unbekannt → 2,60m
   Fenstermaß unbekannt → 1,20×1,00m
   Türmaß unbekannt → 0,90×2,10m
   Verschnitt Fliesen/Boden → 10%
   Anstrich → 2× wenn nicht anders gesagt

IMPLIZITES WISSEN — IMMER ANWENDEN:
Du kennst die Handwerksregeln und wendest sie automatisch an:

MALER: Streichen erwähnt → Abdecken/Abkleben ergänzen. Wände streichen → prüfen ob Decke auch gemeint. Tapezieren → nach Altbelag fragen. Neubau → Voranstrich ergänzen. "Komplett" → Wände + Decke + Rahmen.
FLIESEN: Bad/Dusche/Nassbereich → nassbereich: true. Nassbereich → Abdichtung als Position. "Bodengleich" → eigene teure Position. "Komplett erneuern" → nach Altfliesen fragen. Diagonal → Verschnitt 15%.
SANITÄR: "Bad komplett" → nach Leitungen fragen. WC/Waschtisch/Wanne → Silikon ergänzen. "Tauschen/Wechseln" → Demontage ergänzen. Heizkörper neu → Thermostatventil ergänzen.
ELEKTRO: Küche neu → Herdanschluss prüfen. Smart Home → Flag setzen. "Unterputz/UP" → up_oder_ap: up. "Aufputz/AP" → up_oder_ap: ap.
TROCKENBAU: Brandschutz → brandschutz: true. Schallschutz → doppelte Beplankung prüfen.
BODENBELÄGE: "Parkett schleifen" → 3 Arbeitsgänge. Fußbodenheizung → fussbodenheizung: true.
ALLGEMEIN: Altbau → altbau: true. Bewohnt → bewohnt: true. Denkmalschutz → denkmalschutz: true.

WICHTIG: Ergänze Positionen nur wenn sie NICHT schon im Angebot sind. Doppelungen verhindern.

MULTI-RAUM PARSING:
[RAUM] = neuer Raum, eigener Eintrag in raeume[]. [ERGAENZUNG] = Zusatz zum letzten Raum. [KORREKTUR] = vorherige Angabe verwerfen.

GEWERK-SPEZIFISCHES WISSEN:
MALER: "Zimmer streichen" = Wände + Decke. Wandfläche = Umfang × Höhe − Öffnungen. Abdecken/Abkleben immer wenn Streichen.
FLIESEN: Nassbereich → immer Abdichtung. "Bad fliesen" = Boden + Wände. Altfliesen entfernen = eigene Position.
TROCKENBAU: Ständerwand = immer doppelte Beplankung prüfen. Dämmung separat. Spachtel Q2 Standard.
BODENBELÄGE: Bodenfläche = Länge × Breite + Verschnitt. Sockelleisten = Umfang − Türbreiten.
ELEKTRO: Steckdosen/Schalter/Spots als Stück. Kabelmeter NICHT erfinden. Herdanschluss teure Sonderleistung.
SANITÄR: Objekte als Stück. Rohrmeter NICHT erfinden — Rückfrage stellen. Demontage + Montage trennen.

AUSGABE — EXAKTES FORMAT:
Antworte NUR mit diesem JSON. Kein Text davor, kein Text danach.

{"gewerk":"maler|fliesen|trockenbau|boden_parkett|sanitaer_heizung|elektro","confidence_gewerk":0.95,"kunde":{"name":null,"adresse":null,"ort":null},"situation":"Kurze Beschreibung","raeume":[],"waende":[],"decken":[],"bereiche":[],"steckdosen":null,"schalter":null,"spots":null,"aussenlampen":null,"wandlampen":null,"herdanschluss":false,"wallbox":false,"unterverteilung":false,"hauptverteilung":false,"kabelmeter":null,"neu_verkabeln":false,"wc":null,"waschtisch":null,"dusche":null,"wanne":null,"urinal":null,"bidet":null,"armaturen":null,"rohrmeter":null,"leitungen_erneuern":false,"heizkoerper":null,"austausch":false,"erneuerung":false,"altbelag":[],"erschwernisse":[],"anmerkungen":null,"annahmen":[],"rueckfragen":[],"fehlende_angaben":[],"transkript":""}`

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
            model: 'gpt-4o-mini',
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
          supabase.from('ki_usage').insert({
            user_id: user.id,
            angebot_id: angebot_id || null,
            prompt_typ: 'extraktion',
            input_tokens: pIn,
            output_tokens: pOut,
            kosten_eur: ((pIn * 0.00015 + pOut * 0.0006) / 1000) * 0.92,
          }).then(() => {})
        }

        const raw = data.choices[0].message.content
        return JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim())
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
    console.error('KI-Extraktion Fehler:', msg)

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
