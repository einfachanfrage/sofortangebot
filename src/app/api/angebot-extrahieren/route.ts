import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { callEdgeFunction } from '@/lib/edge-function-client'
import { ersetzeZahlenWorte } from '@/lib/zahlen-parser'
import { segmentiereRaeume, loeseKorrekturenAuf, bauSegmentiertenTranskript } from '@/lib/raum-segmentierer'
import { erkenneErgaenzungen, bereiteFuerKiAuf } from '@/lib/ergaenzungs-erkenner'
import { extrahiereKorrekturen, formatKorrekturenFuerKi } from '@/lib/korrektur-resolver'
import { wendeImplizitRegelnAn } from '@/lib/implizit-wissen'
import { berechneMengen } from '@/lib/mengen/engine'
import { berechneBewertung } from '@/lib/mengen/bewertung'
import type { ExtrahierteDaten, MengenErgebnis, KalkulationsBewertung, KIRueckfrage } from '@/lib/mengen/types'
import { normalisiereExtraktion } from '@/lib/mengen/extraktion-normalisierer'

export const maxDuration = 60

export interface ExtraktionResponse {
  extraktion: ExtrahierteDaten
  mengen: MengenErgebnis
  bewertung: KalkulationsBewertung
  hat_rueckfragen: boolean
  implizit_positionen: string[]
  implizit_flags: Record<string, unknown>
  korrekturen_erkannt: number
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { text } = await req.json() as { text: string }
  if (!text?.trim()) return NextResponse.json({ error: 'Kein Text' }, { status: 400 })

  // Gewerk-Hinweis aus Company-Profil
  const { data: company } = await supabase.from('companies').select('gewerke').eq('user_id', session.user.id).single()
  const gewerke = (company as { gewerke?: string[] } | null)?.gewerke ?? []
  const gewerk_hinweis = gewerke.length > 0
    ? `Der Handwerker arbeitet hauptsächlich in: ${gewerke.join(', ')}. Bevorzuge diese Gewerke bei der Zuweisung.`
    : ''

  // Vorverarbeitung: Zahlwörter + Multi-Raum + Ergänzungen + Korrekturen
  const textMitZahlen = ersetzeZahlenWorte(text)
  const segmente = segmentiereRaeume(textMitZahlen)
  const segmenteGeklaert = loeseKorrekturenAuf(segmente)
  const segmentiertText = segmenteGeklaert.length > 1
    ? bauSegmentiertenTranskript(segmenteGeklaert)
    : textMitZahlen

  const ergaenzungen = erkenneErgaenzungen(segmentiertText)
  const korrekturen = extrahiereKorrekturen(segmentiertText)
  let verarbeitetText = bereiteFuerKiAuf(segmentiertText, ergaenzungen)
  if (korrekturen.length > 0) {
    verarbeitetText += formatKorrekturenFuerKi(korrekturen)
  }

  // Bug 2: Logging — Whisper-Text VOR GPT sichtbar machen
  console.log('=== WHISPER TRANSKRIPT RAW ===')
  console.log(text)
  console.log('=== VERARBEITET FÜR GPT ===')
  console.log(verarbeitetText)
  console.log('==============================')

  try {
    // KI-Extraktion via Edge Function
    const edgeResult = await callEdgeFunction(
      'ki-extrahieren',
      { transkript: verarbeitetText, gewerk_hinweis },
      session.access_token
    ) as { result: ExtrahierteDaten }

    let extraktion = normalisiereExtraktion(edgeResult.result as unknown as Record<string, unknown>)
    extraktion.transkript = verarbeitetText

    // Bug 2: GPT-Extraktion loggen
    console.log('=== GPT-4o EXTRAKTION ===')
    console.log(JSON.stringify({ gewerk: extraktion.gewerk, confidence: extraktion.confidence_gewerk, raeume: extraktion.raeume?.length }, null, 2))
    console.log('=========================')

    // Implizit-Wissen lokal anwenden (kein extra Edge-Function-Call nötig)
    const implizitResultat = wendeImplizitRegelnAn(text, extraktion.gewerk, extraktion)
    extraktion = implizitResultat.extraktion_angereichert

    if (implizitResultat.neue_positionen.length > 0) {
      extraktion.annahmen = [
        ...(extraktion.annahmen ?? []),
        ...implizitResultat.neue_positionen.map(p => `Automatisch erkannt: ${p}`),
      ]
    }

    if (implizitResultat.neue_rueckfragen.length > 0) {
      const neueRueckfragen: KIRueckfrage[] = implizitResultat.neue_rueckfragen.map((frage, i) => ({
        id: `implizit_${i}`,
        frage,
        typ: 'ja_nein' as const,
        betrifft: 'Allgemein',
        prioritaet: 1,
        schnell_antworten: [
          { label: 'Ja', wert: true },
          { label: 'Nein', wert: false },
        ],
      }))
      extraktion.rueckfragen = [...(extraktion.rueckfragen ?? []), ...neueRueckfragen]
    }

    const mengen = berechneMengen(extraktion.gewerk, extraktion)
    const bewertung = berechneBewertung(extraktion, mengen)

    return NextResponse.json({
      extraktion,
      mengen,
      bewertung,
      hat_rueckfragen: mengen.rueckfragen.length > 0,
      implizit_positionen: implizitResultat.neue_positionen,
      implizit_flags: implizitResultat.neue_flags,
      korrekturen_erkannt: korrekturen.length,
    } satisfies ExtraktionResponse)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('angebot-extrahieren error:', msg)
    return NextResponse.json({ error: `Extraktion fehlgeschlagen: ${msg}` }, { status: 500 })
  }
}
