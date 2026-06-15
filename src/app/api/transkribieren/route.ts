import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIClient, WHISPER_MODEL } from '@/lib/ai-client'
import { checkUserRateLimit, checkKIBudget, trackKIUsage, rateLimitResponse } from '@/lib/rate-limiter'
import { normalisierenTranskript } from '@/lib/transkript-normalisierer'
import * as Sentry from '@sentry/nextjs'

export const maxDuration = 60

const WHISPER_PROMPT = `Handwerker spricht Aufmaß für Angebotskalkulation ein. Fachbegriffe: Malerarbeiten: Anstrich, Voranstrich, Schlussanstrich, Dispersionsfarbe, Silikonharzfarbe, Raufaser, Vliestapete, Spachtelmasse, Tiefengrund, Grundierung, Abdecken, Abkleben, Sockelleisten. Trockenbau: Rigips, Gipskarton, GK, Ständerwand, CW-Profil, UW-Profil, Unterdecke, Abhängung, Mineralwolle, Rockwool, Knauf, Q2, Q3, Spachtelqualität. Fliesen: Feinsteinzeug, Naturstein, Bodenfliesen, Wandfliesen, Verfugung, Fugenmasse, Fliesenkleber, Verbundabdichtung, Dichtschlämme, Silikon, bodengleich, Ablauf, Rinne, Mosaik, Verschnitt, Format, Rektifiziert. Bodenbeläge: Parkett, Laminat, Vinyl, Designboden, Kork, Linoleum, Teppich, Sockelleisten, Übergangsschiene, Trittschalldämmung, Dampfsperre, Estrich, Ausgleichsmasse, Schleifen, Versiegeln, Ölen, Wachsen. Elektro: Unterputz, Aufputz, Steckdose, Schuko, Lichtschalter, Dimmer, Unterverteilung, Sicherungskasten, Herdanschluss, CEE, Wallbox, Ladestation, Einbaustrahler, Spots, Downlights, Leerrohre, NYM-Leitung, Kabelkanal. Sanitär: Waschtisch, Waschbecken, WC, Toilette, Dusche, Duschtasse, bodengleich, Badewanne, Urinal, Armatur, Einhebelmischer, Thermostat, Heizkörper, Ventil, Thermostatventil, Heizungsrohr, Kupfer, Verbundrohr, Silikon, Dichtung, Rosette. Maße: Quadratmeter, qm, m2, Laufmeter, lfdm, lfm, Kubikmeter, cbm, m3, Stück, Stk, Pauschale, mal, auf, breit, lang, hoch, tief. Zahlen werden als Ziffern geschrieben. Dezimaltrennzeichen ist Komma.`

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data: company } = await supabase.from('companies').select('plan').eq('user_id', user.id).single()
  const plan = (company as { plan?: string } | null)?.plan ?? 'starter'

  const rlCheck = await checkUserRateLimit(user.id, 'ki_transkription', plan)
  if (!rlCheck.allowed) return rateLimitResponse(rlCheck)

  const budgetCheck = await checkKIBudget(user.id)
  if (!budgetCheck.allowed) {
    return NextResponse.json(
      { error: 'KI-Tageslimit erreicht. Morgen geht\'s weiter.', isKIBudget: true },
      { status: 429 }
    )
  }

  const formData = await req.formData()
  const audio = formData.get('audio') as File
  if (!audio) return NextResponse.json({ error: 'Keine Audiodatei' }, { status: 400 })

  // iOS Safari produziert audio/mp4 (AAC) → m4a-Endung für Whisper
  const ext = audio.type.includes('mp4') || audio.type.includes('m4a') ? 'm4a'
    : audio.type.includes('ogg') ? 'ogg'
    : audio.type.includes('mp3') ? 'mp3'
    : 'webm'

  const originalName = audio.name ?? ''
  const resolvedExt = originalName.endsWith('.m4a') ? 'm4a'
    : originalName.endsWith('.ogg') ? 'ogg'
    : originalName.endsWith('.mp3') ? 'mp3'
    : originalName.endsWith('.wav') ? 'wav'
    : ext

  const audioFile = new File([await audio.arrayBuffer()], `aufnahme.${resolvedExt}`, {
    type: audio.type || 'audio/webm',
  })

  try {
    const client = await getAIClient()
    const transcription = await client.audio.transcriptions.create({
      file: audioFile,
      model: WHISPER_MODEL,
      language: 'de',
      temperature: 0,
      response_format: 'verbose_json',
      prompt: WHISPER_PROMPT,
    })

    const rohText = transcription.text?.trim() ?? ''
    if (!rohText) {
      return NextResponse.json({ error: 'Keine Sprache erkannt. Bitte nochmal versuchen.' }, { status: 400 })
    }

    // Konfidenz aus Segmenten auslesen
    interface Segment { avg_logprob?: number }
    const segs = (transcription as unknown as { segments?: Segment[] }).segments ?? []
    const konfidenzGesamt = segs.length > 0
      ? segs.reduce((sum, seg) => sum + (seg.avg_logprob ?? 0), 0) / segs.length
      : 0

    if (konfidenzGesamt < -1.0 && segs.length > 0) {
      console.warn('Niedrige Transkriptions-Konfidenz:', konfidenzGesamt, '— Aufnahme-Qualität möglicherweise schlecht')
    }

    // Dialekt-Normalisierung + Fachbegriff-Standardisierung
    const normalisierung = normalisierenTranskript(rohText)

    await trackKIUsage({ userId: user.id, endpunkt: 'transkription', kostenEur: 0.006 })

    return NextResponse.json({
      text: normalisierung.normalisiert,
      text_original: rohText,
      hat_korrektur: normalisierung.hat_korrektur,
      hat_raumwechsel: normalisierung.hat_raumwechsel,
      normalisierungs_aenderungen: normalisierung.aenderungen,
      konfidenz: konfidenzGesamt,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unbekannter Fehler'
    console.error('Transkription Fehler:', msg)
    Sentry.captureException(err, {
      tags: { feature: 'ki_transkription' },
      extra: { audio_size: audio.size },
    })
    return NextResponse.json({ error: `Transkription fehlgeschlagen: ${msg}` }, { status: 500 })
  }
}
