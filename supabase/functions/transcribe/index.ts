import { corsHeaders } from '../_shared/cors.ts'
import { trackKIUsage } from '../_shared/ki-usage.ts'
import { getUser } from '../_shared/auth.ts'
import { mitTimeout } from '../_shared/timeout.ts'
import { createOpenAIClient } from '../_shared/openai.ts'

const WHISPER_PROMPT = `Handwerker spricht Aufmaß für Angebotskalkulation ein. Fachbegriffe: Malerarbeiten: Anstrich, Voranstrich, Schlussanstrich, Dispersionsfarbe, Silikonharzfarbe, Raufaser, Vliestapete, Spachtelmasse, Tiefengrund, Grundierung, Abdecken, Abkleben, Sockelleisten. Trockenbau: Rigips, Gipskarton, GK, Ständerwand, CW-Profil, UW-Profil, Unterdecke, Abhängung, Mineralwolle, Rockwool, Knauf, Q2, Q3, Spachtelqualität. Fliesen: Feinsteinzeug, Naturstein, Bodenfliesen, Wandfliesen, Verfugung, Fugenmasse, Fliesenkleber, Verbundabdichtung, Dichtschlämme, Silikon, bodengleich, Ablauf, Rinne, Mosaik, Verschnitt, Format, Rektifiziert. Bodenbeläge: Parkett, Laminat, Vinyl, Designboden, Kork, Linoleum, Teppich, Sockelleisten, Übergangsschiene, Trittschalldämmung, Dampfsperre, Estrich, Ausgleichsmasse, Schleifen, Versiegeln, Ölen, Wachsen. Elektro: Unterputz, Aufputz, Steckdose, Schuko, Lichtschalter, Dimmer, Unterverteilung, Sicherungskasten, Herdanschluss, CEE, Wallbox, Ladestation, Einbaustrahler, Spots, Downlights, Leerrohre, NYM-Leitung, Kabelkanal. Sanitär: Waschtisch, Waschbecken, WC, Toilette, Dusche, Duschtasse, bodengleich, Badewanne, Urinal, Armatur, Einhebelmischer, Thermostat, Heizkörper, Ventil, Thermostatventil, Heizungsrohr, Kupfer, Verbundrohr, Silikon, Dichtung, Rosette. Maße: Quadratmeter, qm, m2, Laufmeter, lfdm, lfm, Kubikmeter, cbm, m3, Stück, Stk, Pauschale, mal, auf, breit, lang, hoch, tief. Zahlen werden als Ziffern geschrieben. Dezimaltrennzeichen ist Komma.`

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

    const formData = await req.formData()
    const audioFile = formData.get('audio') as File
    const angebotId = formData.get('angebot_id') as string | null

    if (!audioFile) {
      return new Response(JSON.stringify({ error: 'Keine Audiodatei' }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    if (audioFile.size > 25 * 1024 * 1024) {
      return new Response(
        JSON.stringify({ error: 'Aufnahme zu lang. Bitte kürzer sprechen.' }),
        { status: 400, headers: corsHeaders }
      )
    }

    const apiKey = createOpenAIClient()

    const { text: rohText, konfidenz } = await mitTimeout(
      async (signal) => {
        const whisperForm = new FormData()
        whisperForm.append('file', audioFile)
        whisperForm.append('model', 'whisper-1')
        whisperForm.append('language', 'de')
        whisperForm.append('temperature', '0')
        whisperForm.append('response_format', 'verbose_json')
        whisperForm.append('prompt', WHISPER_PROMPT)

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}` },
          body: whisperForm,
          signal,
        })

        if (!response.ok) {
          const err = await response.json()
          throw new Error(`Whisper ${response.status}: ${err.error?.message}`)
        }

        // deno-lint-ignore no-explicit-any
        const data = await response.json() as any
        const segs = data.segments ?? []
        const konfidenzGesamt = segs.length > 0
          ? segs.reduce((s: number, g: { avg_logprob?: number }) => s + (g.avg_logprob ?? 0), 0) / segs.length
          : 0

        return { text: (data.text as string)?.trim() ?? '', konfidenz: konfidenzGesamt }
      },
      45000,
      'Transkription dauerte zu lange. Nochmal versuchen.'
    )

    if (!rohText) {
      return new Response(
        JSON.stringify({ error: 'Keine Sprache erkannt. Bitte nochmal versuchen.' }),
        { status: 400, headers: corsHeaders }
      )
    }

    if (konfidenz < -1.0) {
      console.warn('Niedrige Konfidenz:', konfidenz)
    }

    // KI-Kosten loggen (feuern und vergessen)
    const dauerSek = audioFile.size / (16000 * 2)
    // Whisper rechnet nach Minuten, nicht nach Tokens — `tokens_in` trägt hier
    // die Sekunden, `tokens_out` die Zeichenzahl des Transkripts (unverändert
    // zur bisherigen Absicht, nur jetzt in den richtigen Spalten).
    trackKIUsage(supabase, {
      userId: user.id,
      endpunkt: 'transkription',
      tokensIn: Math.ceil(dauerSek),
      tokensOut: rohText.length,
      kostenEur: (dauerSek / 60) * 0.006,
    })

    return new Response(
      JSON.stringify({
        text: rohText,
        text_original: rohText,
        konfidenz,
        hat_korrektur: false,
        hat_raumwechsel: false,
        normalisierungs_aenderungen: [],
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unbekannt'
    console.error('[transcribe] Verarbeitung fehlgeschlagen')

    if (msg.includes('zu lange')) {
      return new Response(JSON.stringify({ error: msg, retry: true }), {
        status: 504,
        headers: corsHeaders,
      })
    }

    return new Response(
      JSON.stringify({ error: 'Transkription fehlgeschlagen. Nochmal versuchen.', retry: true }),
      { status: 500, headers: corsHeaders }
    )
  }
})
