import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { callEdgeFunction } from '@/lib/edge-function-client'
import { ersetzeZahlenWorte } from '@/lib/zahlen-parser'
import { segmentiereRaeume, loeseKorrekturenAuf, bauSegmentiertenTranskript } from '@/lib/raum-segmentierer'
import { erkenneErgaenzungen, bereiteFuerKiAuf } from '@/lib/ergaenzungs-erkenner'
import { extrahiereKorrekturen, formatKorrekturenFuerKi } from '@/lib/korrektur-resolver'
import { pruefeKIZugriff } from '@/lib/rate-limiter'
import * as Sentry from '@sentry/nextjs'
import type { ExtrahierteDaten } from '@/lib/mengen/types'
import type { KalkulationsAntworten } from '@/lib/mengen/antworten-verarbeiter'
import { verarbeiteExtraktion, type ExtraktionResponse } from '@/lib/mengen/extraktion-pipeline'

export const maxDuration = 60

export type { ExtraktionResponse }

// CoS-002 Option 1, Schritt 2 (Head of Product Engineering, 2026-08-20,
// docs/cos-002-architektur-vorschlag.md): diese Route macht jetzt NUR noch
// Auth/Rate-Limit, holt den Gewerk-Hinweis, bereitet den Text fürs Edge-
// Function-Prompt auf, ruft ki-extrahieren frisch auf — und übergibt das
// Ergebnis danach an verarbeiteExtraktion() (src/lib/mengen/
// extraktion-pipeline.ts). Die komplette deterministische Nachbearbeitung
// (Normalisierung, Reparaturen, Rückfragen, implizite Regeln, Mengen-
// berechnung ...) ist von hier 1:1 dorthin ausgelagert, NICHT dupliziert —
// PM-012-Lehre: zwei Stellen mit derselben Logik laufen irgendwann
// auseinander. Dieselbe Funktion kann später auch eine bereits gecachte
// voll_extraktion (Schritt 1) nachbearbeiten, ohne dass die Kette ein
// zweites Mal geschrieben werden muss (Schritt 2/3-Ziel).
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: { session } } = await supabase.auth.getSession()
  if (!user || !session) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { text, antworten = {}, basis_extraktion, voll_extraktion_cache } = await req.json() as {
    text: string
    antworten?: KalkulationsAntworten
    basis_extraktion?: ExtrahierteDaten
    // CoS-002 Option 1, Schritt 3 (Head of Product Engineering, 2026-08-21,
    // docs/cos-002-architektur-vorschlag.md): das rohe ki-extrahieren-
    // Ergebnis aus entwurf_aufnahmen.voll_extraktion (Schritt 1/2), von
    // generiere-positionen/route.ts durchgereicht, wenn genau EINE
    // Sprachaufnahme neu ist und deren Cache noch gültig ist (siehe dortiger
    // Kommentar). Ist dieser Wert gesetzt, entfällt der eigene, zweite
    // GPT-Aufruf hier komplett — exakt das CoS-002-Ziel: nur noch EIN
    // KI-Aufruf pro Aufnahme statt zwei.
    voll_extraktion_cache?: ExtrahierteDaten
  }
  if (!text?.trim()) return NextResponse.json({ error: 'Kein Text' }, { status: 400 })
  if (text.length > 50_000) return NextResponse.json({ error: 'Text zu lang' }, { status: 413 })

  // Rate-Limit nur prüfen, wenn hier tatsächlich ein frischer, kostenpflichtiger
  // GPT-Aufruf ansteht — bei einer Rückfragen-Runde (basis_extraktion) oder
  // einem Cache-Treffer (voll_extraktion_cache, neu seit Schritt 3) findet
  // keiner statt, ein Blockieren wäre hier falsch (ein Nutzer, der sein
  // Tageslimit gerade erreicht hat, muss trotzdem seine bereits laufende
  // Rückfragen-Runde zu Ende bringen bzw. von einem Cache-Treffer profitieren
  // können, ohne neu gezählt zu werden).
  const brauchtFrischenGptAufruf = !basis_extraktion && !voll_extraktion_cache
  if (brauchtFrischenGptAufruf) {
    const blocked = await pruefeKIZugriff(user.id, 'ki_extraktion')
    if (blocked) return blocked
  }

  // Gewerk-Hinweis aus Company-Profil
  const { data: company } = await supabase.from('companies').select('gewerke').eq('user_id', user.id).single()
  const gewerke = (company as { gewerke?: string[] } | null)?.gewerke ?? []
  const gewerk_hinweis = gewerke.length > 0
    ? `Der Handwerker arbeitet hauptsächlich in: ${gewerke.join(', ')}. Bevorzuge diese Gewerke bei der Zuweisung.`
    : ''

  // Vorverarbeitung nur für den Edge-Prompt (Zahlwörter + Multi-Raum +
  // Ergänzungen + Korrekturen). verarbeiteExtraktion() rechnet dieselben
  // Schritte unabhängig aus `text` nochmal aus — bewusst, damit die Funktion
  // eigenständig bleibt (siehe Kommentar dort). Beide Berechnungen sind
  // deterministisch und liefern für denselben `text` identische Werte.
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
    // Reihenfolge der Vorrangregel: Rückfragen-Runde (basis_extraktion) zuerst
    // — die lief schon immer ohne neuen GPT-Aufruf und ändert sich hier
    // nicht. Erst danach der neue Cache-Treffer (Schritt 3): nur wenn WEDER
    // eine Rückfragen-Runde läuft NOCH ein gültiger Cache vorliegt, wird
    // ki-extrahieren tatsächlich frisch aufgerufen.
    const edgeResult = basis_extraktion
      ? null
      : voll_extraktion_cache
        ? { result: voll_extraktion_cache }
        : await callEdgeFunction(
            'ki-extrahieren',
            { transkript: verarbeitetText, gewerk_hinweis },
            session.access_token
          ) as { result: ExtrahierteDaten }

    const antwort = verarbeiteExtraktion(text, edgeResult, antworten, basis_extraktion)

    return NextResponse.json(antwort satisfies ExtraktionResponse)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[angebot-extrahieren] Verarbeitung fehlgeschlagen')
    Sentry.captureException(err, { tags: { feature: 'angebot_extrahieren' } })
    return NextResponse.json({ error: `Extraktion fehlgeschlagen: ${msg}` }, { status: 500 })
  }
}
