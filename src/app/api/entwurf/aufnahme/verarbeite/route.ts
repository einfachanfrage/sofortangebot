import { NextRequest, NextResponse, after } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIClient, WHISPER_MODEL } from '@/lib/ai-client'
import { pruefeKIZugriff } from '@/lib/rate-limiter'
import { extrahiereChips } from '@/lib/chips-extraktion'
import { ergaenzeChipsUmAutomatischeNebenpositionen } from '@/lib/chips-vervollstaendigung'
import { ersetzeZahlenWorte } from '@/lib/zahlen-parser'
import { korrigiereHoerfehler } from '@/lib/hoerfehler'
import { segmentiereRaeume } from '@/lib/raum-segmentierer'
import { cacheVolleExtraktion } from '@/lib/volle-extraktion-cache'
import * as Sentry from '@sentry/nextjs'

export const maxDuration = 60

// Sichtbarkeit: zählt Wörter, die ersetzeZahlenWorte von Wort in Ziffer
// umgewandelt hat ("drei" → "3"). Reine Anzeige-Kennzahl, keine Business-Logik.
function zaehleErsetzteZahlen(original: string, verarbeitet: string): number {
  const origTokens = original.split(/\s+/)
  const neuTokens = verarbeitet.split(/\s+/)
  const laenge = Math.min(origTokens.length, neuTokens.length)
  let anzahl = 0
  for (let i = 0; i < laenge; i++) {
    const alt = origTokens[i].toLowerCase().replace(/[^\wäöüß.,]/g, '')
    const neu = neuTokens[i]
    const altIstZahl = /^\d+([.,]\d+)?$/.test(alt)
    const neuIstZahl = /^\d+([.,]\d+)?$/.test(neu)
    if (!altIstZahl && neuIstZahl) anzahl++
  }
  return anzahl
}

// CoS-P-002 (Platform & Integrations Engineer, 2026-09-06): siehe
// upload/route.ts für die volle Begründung (PM-010-Bezug). Bewusst hier
// noch einmal dieselbe kleine Funktion statt eines gemeinsamen Imports —
// gleiche Begründung wie bei zaehleErsetzteZahlen oben: beide Routen bleiben
// unabhängig lesbar.
function berechneWhisperKonfidenz(segments: Array<{ avg_logprob?: number }> | undefined): number | null {
  if (!segments || segments.length === 0) return null
  const summe = segments.reduce((s, seg) => s + (seg.avg_logprob ?? 0), 0)
  return summe / segments.length
}

// Retry-Pfad: Whisper + Chips für eine bereits hochgeladene Aufnahme
// (der normale Weg läuft direkt in /aufnahme/upload — dort reist das Audio
// nur einmal. Hier wird es aus Storage geladen.)
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const blocked = await pruefeKIZugriff(user.id, 'ki_transkription')
  if (blocked) return blocked

  const { aufnahme_id } = await req.json()
  if (!aufnahme_id) return NextResponse.json({ error: 'aufnahme_id fehlt' }, { status: 400 })

  // Aufnahme laden
  const { data: aufnahme } = await supabase
    .from('entwurf_aufnahmen')
    .select('*, quote:angebot_id(company_id)')
    .eq('id', aufnahme_id)
    .single()

  if (!aufnahme || aufnahme.typ !== 'sprache') {
    return NextResponse.json({ error: 'Aufnahme nicht gefunden' }, { status: 404 })
  }

  // Status → verarbeitung
  await supabase
    .from('entwurf_aufnahmen')
    .update({ verarbeitung_status: 'verarbeitung' })
    .eq('id', aufnahme_id)

  const ai = await getAIClient()

  try {
    // ── Whisper-Kette und Kontext-Query PARALLEL ──────────────────────────
    // CoS-P-002: gibt jetzt auch die Whisper-Konfidenz zurück (null, wenn
    // `vorhandenes` gegriffen hat — dann lief in diesem Aufruf gar kein
    // Whisper, es gibt also nichts zu messen).
    const whisperKette = (async (): Promise<{ text: string | null; konfidenz: number | null }> => {
      const vorhandenes = aufnahme.transkript as string | null
      if (vorhandenes) return { text: vorhandenes, konfidenz: null }
      if (!aufnahme.audio_url) return { text: null, konfidenz: null }

      const { data: audioData } = await supabase.storage
        .from('entwurf-audio')
        .download(aufnahme.audio_url as string)
      if (!audioData) return { text: null, konfidenz: null }

      const ext = (aufnahme.audio_url as string).split('.').pop() ?? 'webm'
      const audioFile = new File([await audioData.arrayBuffer()], `audio.${ext}`, {
        type: audioData.type || 'audio/webm',
      })
      const result = await ai.audio.transcriptions.create({
        file: audioFile,
        model: WHISPER_MODEL,
        language: 'de',
        prompt: 'Handwerker, Aufmaß, Angebot, Quadratmeter, Laufmeter, Stück, Malerarbeiten, Fliesen, Elektro, Sanitär',
        // CoS-P-002: siehe berechneWhisperKonfidenz unten / upload/route.ts.
        response_format: 'verbose_json',
      })
      const konfidenz = berechneWhisperKonfidenz(
        (result as unknown as { segments?: Array<{ avg_logprob?: number }> }).segments
      )
      return { text: result.text, konfidenz }
    })()

    const kontextQuery = supabase
      .from('entwurf_aufnahmen')
      .select('notiz_text, transkript')
      .eq('angebot_id', aufnahme.angebot_id)
      .neq('id', aufnahme_id)
      .order('erstellt_am', { ascending: true })
      .limit(5)

    const [{ text: whisperText, konfidenz: konfidenzWhisper }, { data: bisherige }] = await Promise.all([whisperKette, kontextQuery])
    // Bekannte Hörfehler direkt nach Whisper geraderücken — siehe
    // src/lib/hoerfehler.ts und die Begründung in upload/route.ts.
    // Der Rohtext bleibt in `transkript_original` erhalten.
    const transkriptRoh = whisperText?.trim() ?? ''
    const { text: transkript, korrekturen: hoerfehler } = korrigiereHoerfehler(transkriptRoh)
    if (hoerfehler.length > 0) {
      console.log('[aufnahme-verarbeite] Hörfehler korrigiert:', hoerfehler.join(' | '))
    }

    if (!transkript) {
      await supabase
        .from('entwurf_aufnahmen')
        .update({ verarbeitung_status: 'fehler', transkript: '' })
        .eq('id', aufnahme_id)
      return NextResponse.json({ error: 'Keine Sprache erkannt' }, { status: 400 })
    }

    const kontextNotizen = (bisherige ?? [])
      .filter(a => a.notiz_text || a.transkript)
      .map(a => a.notiz_text ?? a.transkript)
      .join('\n')

    // ── Chips-Extraktion ──────────────────────────────────────────────────
    const chipsErgebnis = await extrahiereChips(ai, transkript, kontextNotizen || undefined)
    // PM-001 (2026-08-20): automatisch ergänzte Nebentätigkeiten (Boden
    // schützen, Sockelleisten abkleben, Grundierung, ...) mit auf die Karte
    // bringen, sonst weicht die Karten-Anzahl von der finalen Angebotsanzahl
    // ab. Siehe chips-vervollstaendigung.ts für die volle Begründung.
    const positionen = ergaenzeChipsUmAutomatischeNebenpositionen(chipsErgebnis.positionen, transkript)

    // ── Sichtbarkeit: was hat die Vorverarbeitung mit dem Rohtext gemacht? ──
    // Rein zu Anzeigezwecken (Logging-Spalten) — verändert nichts an der
    // eigentlichen Pipeline, die läuft weiterhin über /angebot-extrahieren.
    const transkriptVerarbeitet = ersetzeZahlenWorte(transkript)
    const segmente = segmentiereRaeume(transkriptVerarbeitet)

    // ── Ergebnis speichern ────────────────────────────────────────────────
    await supabase
      .from('entwurf_aufnahmen')
      .update({
        transkript,
        erkannte_positionen: positionen,
        verarbeitung_status: 'fertig',
        transkript_original: transkriptRoh,
        transkript_verarbeitet: transkriptVerarbeitet,
        hat_normalisierung: hoerfehler.length > 0,
        hat_raumwechsel: segmente.length > 1,
        segment_anzahl: segmente.length,
        zahlen_ersetzt: zaehleErsetzteZahlen(transkript, transkriptVerarbeitet),
        ...(konfidenzWhisper !== null ? { konfidenz_whisper: konfidenzWhisper } : {}),
      })
      .eq('id', aufnahme_id)

    // CoS-002 Option 1, Schritt 1 (2026-08-20): läuft NACH der Antwort,
    // siehe volle-extraktion-cache.ts.
    after(() => cacheVolleExtraktion(supabase, user.id, aufnahme_id, aufnahme.angebot_id as string, transkript))

    return NextResponse.json({ transkript, positionen })

  } catch (e) {
    console.error('[aufnahme-verarbeiten] Verarbeitung fehlgeschlagen')
    Sentry.captureException(e, { tags: { feature: 'aufnahme_verarbeiten' } })
    await supabase
      .from('entwurf_aufnahmen')
      .update({ verarbeitung_status: 'fehler' })
      .eq('id', aufnahme_id)
    return NextResponse.json({ error: 'Verarbeitung fehlgeschlagen' }, { status: 500 })
  }
}
