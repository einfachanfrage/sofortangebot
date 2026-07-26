import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { callEdgeFunction } from '@/lib/edge-function-client'
import { ersetzeZahlenWorte } from '@/lib/zahlen-parser'
import { segmentiereRaeume, loeseKorrekturenAuf, bauSegmentiertenTranskript } from '@/lib/raum-segmentierer'
import { erkenneErgaenzungen, bereiteFuerKiAuf } from '@/lib/ergaenzungs-erkenner'
import { extrahiereKorrekturen, formatKorrekturenFuerKi } from '@/lib/korrektur-resolver'
import { wendeImplizitRegelnAn } from '@/lib/implizit-wissen'
import { berechneUndPruefeAlleGewerke } from '@/lib/mengen/mehrgewerk'
import { berechneBewertung } from '@/lib/mengen/bewertung'
import type { ExtrahierteDaten, MengenErgebnis, KalkulationsBewertung, KIRueckfrage } from '@/lib/mengen/types'
import { normalisiereExtraktion } from '@/lib/mengen/extraktion-normalisierer'
import { repariereDuplikatMasse, repariereDuplikatNamen } from '@/lib/mengen/mehrraum-reparatur'
import { pruefeKIZugriff } from '@/lib/rate-limiter'
import {
  extrahiereWandflaeche, extrahiereDeckenflaeche, extrahiereAbzug,
  extrahiereTorMasse, zaehleFenster, zaehleTueren,
} from '@/lib/extraktion-masse'
import { bereiteRueckfragenVor } from '@/lib/mengen/rueckfragen-flow'
import type { KalkulationsAntworten } from '@/lib/mengen/antworten-verarbeiter'
import type { RueckfrageItem } from '@/lib/mengen/rueckfragen-generator'
import { konsolidierePlatzhalterRaum } from '@/lib/mengen/raum-konsolidierung'

export const maxDuration = 60

export interface ExtraktionResponse {
  extraktion: ExtrahierteDaten
  mengen: MengenErgebnis
  bewertung: KalkulationsBewertung
  hat_rueckfragen: boolean
  implizit_positionen: string[]
  implizit_flags: Record<string, unknown>
  korrekturen_erkannt: number
  rueckfragen: RueckfrageItem[]
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: { session } } = await supabase.auth.getSession()
  if (!user || !session) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const blocked = await pruefeKIZugriff(user.id, 'ki_extraktion')
  if (blocked) return blocked

  const { text, antworten = {}, basis_extraktion } = await req.json() as {
    text: string
    antworten?: KalkulationsAntworten
    basis_extraktion?: ExtrahierteDaten
  }
  if (!text?.trim()) return NextResponse.json({ error: 'Kein Text' }, { status: 400 })
  if (text.length > 50_000) return NextResponse.json({ error: 'Text zu lang' }, { status: 413 })

  // Gewerk-Hinweis aus Company-Profil
  const { data: company } = await supabase.from('companies').select('gewerke').eq('user_id', user.id).single()
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

  try {
    // Bei beantworteten Rückfragen muss exakt dieselbe Extraktion weiterlaufen.
    // Eine erneute KI-Auswertung könnte Räume oder Arbeiten anders erkennen.
    const edgeResult = basis_extraktion ? null : await callEdgeFunction(
      'ki-extrahieren',
      { transkript: verarbeitetText, gewerk_hinweis },
      session.access_token
    ) as { result: ExtrahierteDaten }

    let extraktion = basis_extraktion
      ? normalisiereExtraktion(structuredClone(basis_extraktion) as unknown as Record<string, unknown>)
      : normalisiereExtraktion(edgeResult!.result as unknown as Record<string, unknown>)

    // Manche KI-Antworten enthalten zusätzlich zum benannten Einzelraum einen
    // generischen Platzhalter "Raum". Bei genau einem echten Raum werden beide
    // zusammengeführt, statt den Nutzer doppelt nach denselben Maßen zu fragen.
    extraktion = konsolidierePlatzhalterRaum(extraktion, text)
    extraktion.transkript = verarbeitetText

    // GPT-Bug: Bei Mehrraum-Aufträgen gibt GPT manchmal falsche Namen oder kopierte Maße zurück
    if (extraktion.raeume.length > 1) {
      const { repariert: mitNamen, wurdeRepariert: nRep } = repariereDuplikatNamen(extraktion.raeume, text)
      if (nRep) extraktion = { ...extraktion, raeume: mitNamen }
      const { repariert, wurdeRepariert } = repariereDuplikatMasse(extraktion.raeume, text)
      if (wurdeRepariert) extraktion = { ...extraktion, raeume: repariert }
    }
    if (extraktion.bereiche.length > 1) {
      const { repariert: mitNamen, wurdeRepariert: nRep } = repariereDuplikatNamen(extraktion.bereiche, text)
      if (nRep) extraktion = { ...extraktion, bereiche: mitNamen }
      const { repariert, wurdeRepariert } = repariereDuplikatMasse(extraktion.bereiche, text)
      if (wurdeRepariert) extraktion = { ...extraktion, bereiche: repariert }
    }

    // Rückfragen aus KI und deterministischer Kontextanalyse zusammenführen.
    // Bereits beantwortete Angaben werden vor der Mengenberechnung eingesetzt.
    const rueckfragenErgebnis = bereiteRueckfragenVor(extraktion, antworten)
    extraktion = rueckfragenErgebnis.extraktion
    const rueckfragen = rueckfragenErgebnis.rueckfragen

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

    // Direkte Flächenangaben aus Transkript patchen wenn GPT sie nicht extrahiert hat
    // Greift für Single-Raum — bei Multi-Raum zu riskant (Zuordnung unklar)
    if ((extraktion.raeume?.length ?? 0) === 1) {
      const r = extraktion.raeume[0]
      const t = verarbeitetText

      if (r.wandflaeche_direkt === null || r.wandflaeche_direkt === undefined) {
        const wand = extrahiereWandflaeche(t)
        if (wand !== null) r.wandflaeche_direkt = wand
      }

      if (r.deckflaeche_direkt === null || r.deckflaeche_direkt === undefined) {
        const deck = extrahiereDeckenflaeche(t)
        if (deck !== null) {
          r.deckflaeche_direkt = deck
          if (!r.flaeche) r.flaeche = deck
        }
      }

      if ((r.wandflaeche_abzug_m2 === null || r.wandflaeche_abzug_m2 === undefined) && r.wandflaeche_direkt) {
        const abzug = extrahiereAbzug(t)
        if (abzug !== null) r.wandflaeche_abzug_m2 = abzug
      }

    }

    // Tor/Garagentor in tueren[] injizieren — GPT erkennt "Tor" oft nicht
    if (extraktion.gewerk === 'maler') {
      const tor = extrahiereTorMasse(textMitZahlen)
      if (tor) {
        for (const raum of extraktion.raeume ?? []) {
          // Nur injizieren wenn noch keine passende Tür/kein Tor vorhanden
          const hatBigTuer = (raum.tueren ?? []).some((t: {breite?: number}) => (t.breite ?? 0) >= 1.5)
          if (!hatBigTuer) {
            raum.tueren = [{ breite: tor.breite, hoehe: tor.hoehe }]
          }
        }
      }
    }

    // Fenster/Tür-Anzahl: direkt aus Text extrahieren (zuverlässiger als GPT-Felder)
    const fensterAnzahlText = zaehleFenster(textMitZahlen)
    const tuerenAnzahlText = zaehleTueren(textMitZahlen)

    // Etappe 2: saubere KI-Signale bündeln — der Vertrag bevorzugt diese vor Rohtext-Regex
    const kiSignale = {
      arbeitenTexte: [
        ...(extraktion.raeume ?? []).flatMap(r => r.arbeiten ?? []),
        ...(extraktion.bereiche ?? []).flatMap(b => b.arbeiten ?? []),
      ],
      belagText: (extraktion.raeume ?? []).find(r => r.belag)?.belag ?? null,
      altbelagEntfernen: (extraktion.raeume ?? []).some(r => r.altbelag_entfernen),
    }

    // Mengen + Vollständigkeit über ALLE beteiligten Gewerke (Maler UND Boden im
    // selben Auftrag) — nicht nur das Haupt-Gewerk.
    const { positionen: positionenKomplett, mengenRoh } = berechneUndPruefeAlleGewerke(
      extraktion,
      textMitZahlen,
      { fensterAnzahl: fensterAnzahlText || undefined, tuerenAnzahl: tuerenAnzahlText || undefined },
      kiSignale,
    )
    const mengen = { ...mengenRoh, positionen: positionenKomplett }
    const bewertung = berechneBewertung(extraktion, mengen)

    return NextResponse.json({
      extraktion,
      mengen,
      bewertung,
      hat_rueckfragen: rueckfragen.length > 0,
      rueckfragen,
      implizit_positionen: implizitResultat.neue_positionen,
      implizit_flags: implizitResultat.neue_flags,
      korrekturen_erkannt: korrekturen.length,
    } satisfies ExtraktionResponse)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[angebot-extrahieren] Verarbeitung fehlgeschlagen')
    return NextResponse.json({ error: `Extraktion fehlgeschlagen: ${msg}` }, { status: 500 })
  }
}
