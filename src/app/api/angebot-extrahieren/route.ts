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
import { pruefeUndErgaenzeVollstaendigkeit } from '@/lib/mengen/vollstaendigkeits-check'

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

    // Rückfragen filtern: "Wie viele Fenster/Türen?" supprimieren wenn Raummaße bekannt (Standard-Annahmen)
    const hatRaumMasse = (extraktion.raeume ?? []).some(r => r.laenge && (r.breite || r.hoehe))
      || (extraktion.raeume ?? []).some(r => r.flaeche)
      || textMitZahlen.toLowerCase().includes('dachschräge') || textMitZahlen.toLowerCase().includes('schräge')
    const textLower = textMitZahlen.toLowerCase()
    const istFensterAuftrag = textLower.includes('fenster') &&
      (textLower.includes('lackier') || textLower.includes('streich') || textLower.includes('holzfenster') || textLower.includes('anstrich'))
    const istHeizkörperAuftrag = textLower.includes('heizkörper') || textLower.includes('heizkoerper') || textLower.includes('heizung')
    if (hatRaumMasse || istFensterAuftrag || istHeizkörperAuftrag) {
      extraktion.rueckfragen = (extraktion.rueckfragen ?? []).filter(r => {
        const frage = (r.frage ?? '').toLowerCase()
        return !(frage.includes('fenster') || frage.includes('türen') || frage.includes('türmaß') || frage.includes('fenstermaß') || frage.includes('fenstergrö'))
      })
    }

    // Raw-Text überschreibt GPT-Transkript — GPT normalisiert und verliert "nur X"-Angaben
    extraktion.transkript = text

    // Tor/Garagentor direkt aus vorverarbeitetem Text in tueren[] injizieren — GPT erkennt "Tor" oft nicht
    if (extraktion.gewerk === 'maler') {
      const tl = textMitZahlen.toLowerCase()
      // Permissive Regex: nach "tor" jede zwei Zahlen — egal ob × / mal / x / Leerzeichen trennt
      const tm = tl.match(/\b(?:tor|garagentor|einfahrtstor)\b[^\d]*(\d+(?:[.,]\d+)?)[^\d]+(\d+(?:[.,]\d+)?)/i)
      if (tm) {
        const torBreite = parseFloat(tm[1].replace(',', '.'))
        const torHoehe = parseFloat(tm[2].replace(',', '.'))
        if (torBreite > 0 && torHoehe > 0) {
          for (const raum of extraktion.raeume ?? []) {
            // Nur injizieren wenn noch keine passende Tür/kein Tor vorhanden
            const hatBigTuer = (raum.tueren ?? []).some((t: {breite?: number}) => (t.breite ?? 0) >= 1.5)
            if (!hatBigTuer) {
              raum.tueren = [{ breite: torBreite, hoehe: torHoehe }]
            }
          }
        }
      }
    }

    const mengenRoh = berechneMengen(extraktion.gewerk, extraktion)

    // Fenster/Tür-Anzahl: direkt aus Text extrahieren (zuverlässiger als GPT-Felder)
    const tl = textMitZahlen.toLowerCase()
    const fensterTextMatch = tl.match(/(\d+)\s*\S*fenster/i)
    const fensterAnzahlText = fensterTextMatch ? parseInt(fensterTextMatch[1]) : 0
const tuerTextMatch = tl.match(/(\d+)\s*(?:stück\s*)?\S*tür(?:en)?/i)
    const tuerenAnzahlText = tuerTextMatch ? parseInt(tuerTextMatch[1]) : 0

    // Vollständigkeits-Check: fehlende Pflicht-Positionen automatisch ergänzen
    const { fehlende, positionen: positionenKomplett } = pruefeUndErgaenzeVollstaendigkeit(
      extraktion.gewerk,
      mengenRoh.positionen,
      textMitZahlen,
      { fensterAnzahl: fensterAnzahlText || undefined, tuerenAnzahl: tuerenAnzahlText || undefined }
    )
    if (fehlende.length > 0) {
      console.log('=== VOLLSTÄNDIGKEITS-CHECK: ergänzt ===', fehlende)
    }
    const mengen = { ...mengenRoh, positionen: positionenKomplett }
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
