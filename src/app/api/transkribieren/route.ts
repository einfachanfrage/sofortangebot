import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIClient, WHISPER_MODEL } from '@/lib/ai-client'
import { normalisierenTranskript } from '@/lib/transkript-normalisierer'

export const maxDuration = 60

const WHISPER_PROMPT = `Handwerker spricht Aufmaß für Angebotskalkulation ein. Fachbegriffe: Malerarbeiten: Anstrich, Voranstrich, Schlussanstrich, Dispersionsfarbe, Silikonharzfarbe, Raufaser, Vliestapete, Spachtelmasse, Tiefengrund, Grundierung, Abdecken, Abkleben, Sockelleisten. Trockenbau: Rigips, Gipskarton, GK, Ständerwand, CW-Profil, UW-Profil, Unterdecke, Abhängung, Mineralwolle, Rockwool, Knauf, Q2, Q3, Spachtelqualität. Fliesen: Feinsteinzeug, Naturstein, Bodenfliesen, Wandfliesen, Verfugung, Fugenmasse, Fliesenkleber, Verbundabdichtung, Dichtschlämme, Silikon, bodengleich, Ablauf, Rinne, Mosaik, Verschnitt, Format, Rektifiziert. Bodenbeläge: Parkett, Laminat, Vinyl, Designboden, Kork, Linoleum, Teppich, Sockelleisten, Übergangsschiene, Trittschalldämmung, Dampfsperre, Estrich, Ausgleichsmasse, Schleifen, Versiegeln, Ölen, Wachsen. Elektro: Unterputz, Aufputz, Steckdose, Schuko, Lichtschalter, Dimmer, Unterverteilung, Sicherungskasten, Herdanschluss, CEE, Wallbox, Ladestation, Einbaustrahler, Spots, Downlights, Leerrohre, NYM-Leitung, Kabelkanal. Sanitär: Waschtisch, Waschbecken, WC, Toilette, Dusche, Duschtasse, bodengleich, Badewanne, Urinal, Armatur, Einhebelmischer, Thermostat, Heizkörper, Ventil, Thermostatventil, Heizungsrohr, Kupfer, Verbundrohr, Silikon, Dichtung, Rosette. Maße: Quadratmeter, qm, m2, Laufmeter, lfdm, lfm, Kubikmeter, cbm, m3, Stück, Stk, Pauschale, mal, auf, breit, lang, hoch, tief. Zahlen werden als Ziffern geschrieben. Dezimaltrennzeichen ist Komma.`

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const formData = await req.formData()
  const audioFile = formData.get('audio') as File | null

  if (!audioFile) {
    return NextResponse.json({ error: 'Keine Audiodatei' }, { status: 400 })
  }

  if (audioFile.size > 25 * 1024 * 1024) {
    return NextResponse.json({ error: 'Aufnahme zu lang. Bitte kürzer sprechen.' }, { status: 400 })
  }

  try {
    const openai = await getAIClient()

    const result = await openai.audio.transcriptions.create({
      file: audioFile,
      model: WHISPER_MODEL,
      language: 'de',
      temperature: 0,
      response_format: 'verbose_json',
      prompt: WHISPER_PROMPT,
    } as Parameters<typeof openai.audio.transcriptions.create>[0]) as unknown as {
      text: string
      segments?: { avg_logprob?: number }[]
    }

    // verbose_json liefert segments mit avg_logprob für Konfidenz
    const segs = result.segments ?? []
    const konfidenz = segs.length > 0
      ? segs.reduce((s, g) => s + (g.avg_logprob ?? 0), 0) / segs.length
      : 0

    const rohText = result.text?.trim() ?? ''
    if (!rohText) {
      return NextResponse.json({ error: 'Keine Sprache erkannt. Bitte nochmal versuchen.' }, { status: 400 })
    }

    const norm = normalisierenTranskript(rohText)

    // Kosten-Tracking fire-and-forget
    const dauerSek = audioFile.size / (16000 * 2)
    supabase.from('ki_usage').insert({
      user_id: session.user.id,
      angebot_id: formData.get('angebot_id') as string | null,
      prompt_typ: 'transkription',
      input_tokens: Math.ceil(dauerSek),
      output_tokens: rohText.length,
      kosten_eur: (dauerSek / 60) * 0.006,
    }).then(() => {})

    return NextResponse.json({
      text: norm.normalisiert,
      text_original: rohText,
      konfidenz,
      hat_korrektur: norm.hat_korrektur,
      hat_raumwechsel: norm.hat_raumwechsel,
      normalisierungs_aenderungen: norm.aenderungen,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unbekannt'
    console.error('Transkribieren Fehler:', msg)
    return NextResponse.json(
      { error: 'Transkription fehlgeschlagen. Nochmal versuchen.', retry: true },
      { status: 500 }
    )
  }
}
