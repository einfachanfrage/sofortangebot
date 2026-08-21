import type { createClient } from './supabase/server'
import { callEdgeFunction } from './edge-function-client'
import { pruefeKIZugriff } from './rate-limiter'
import type { ExtrahierteDaten } from './mengen/types'
import type { EntwurfAufnahmeTyp, EntwurfVerarbeitungStatus, KombinierteExtraktionCache } from './types'
import * as Sentry from '@sentry/nextjs'

// CoS-002 Option 1, Schritt 3 – Mehrfach-Aufnahmen-Fall (Head of Product
// Engineering, 2026-08-21, Sandys Auftrag "mach komplett rund, das auch
// noch schließen"):
//
// Der bisherige Schritt-3-Cache (voll-extraktion-cache.ts, entwurf_
// aufnahmen.voll_extraktion) deckt nur den Einzelaufnahme-Fall ab — bei
// mehreren gleichzeitig neuen Aufnahmen macht "Entwurf erstellen" weiterhin
// einen frischen, kombinierten ki-extrahieren-Aufruf (siehe Kommentar in
// generiere-positionen/route.ts). Ein deterministisches lokales Zusammen-
// führen mehrerer UNABHÄNGIG (je Aufnahme isoliert) extrahierter Ergebnisse
// wäre riskant: genau die Cross-Aufnahme-Bezüge, wegen derer combinedText
// heute an EINEN gemeinsamen GPT-Aufruf geht (z. B. "und noch die Decke im
// Wohnzimmer" in Aufnahme 2, bezogen auf ein in Aufnahme 1 erwähntes
// Wohnzimmer), lassen sich nicht zuverlässig aus zwei getrennten JSON-
// Ergebnissen rekonstruieren — genau die Art von stillem Korrektheits-Fehler,
// die CoS-002 eigentlich beheben soll. Deshalb hier bewusst KEIN Merge,
// sondern ein spekulativer VORAB-Aufruf derselben kombinierten Extraktion,
// die generiere-positionen sonst erst beim Klick frisch auslösen würde —
// ausgelöst vom Frontend, sobald "Entwurf erstellen" für mehrere neue
// Aufnahmen klickbar wird (kannFertigstellen), also potenziell schon
// während der Nutzer noch überlegt/den Bildschirm anschaut. Trifft der
// Klick später auf exakt dieselbe Aufnahmen-Menge, nutzt generiere-
// positionen dieses Ergebnis statt eines zweiten, echten Aufrufs — sonst
// (Menge hat sich geändert, Cache fehlt/fehlgeschlagen) unverändert der
// bisherige frische Kombi-Aufruf. Kein Korrektheits-Risiko, weil GPT in
// beiden Fällen denselben combinedText auf einmal sieht — nur WANN der
// Aufruf passiert, verschiebt sich.
//
// Kosten-Einordnung: kein Kosten-Zuwachs gegenüber dem bisherigen Zustand
// im Erwartungsfall (derselbe eine Kombi-Aufruf, nur vorgezogen). Wird
// zwischenzeitlich eine weitere Aufnahme hinzugefügt, bevor der Nutzer
// klickt, feuert das Frontend einen neuen Vorab-Aufruf für die dann neue,
// größere Menge — bewusst nur EINMAL pro tatsächlich geänderter Menge
// (nicht pro Aufnahme), siehe Ref-Guard in entwurf/page.tsx. Rein
// spekulativ: schlägt der Aufruf fehl (Rate-Limit, Netzwerk-/GPT-Fehler),
// wird einfach nichts geschrieben — anders als volle-extraktion-cache.ts
// hängt hier kein sichtbarer Karten- oder Button-Zustand dran, die Route
// fällt beim Klick automatisch auf den bekannten frischen Aufruf zurück.

export interface AufnahmeFuerKombination {
  id: string
  typ: EntwurfAufnahmeTyp
  transkript: string | null
  notiz_text: string | null
  verarbeitung_status: EntwurfVerarbeitungStatus
}

// Identische Sammel-Logik wie generiere-positionen/route.ts (texte[] +
// combinedText) — bewusst dieselben drei Fälle (Sprache/Notiz/Zettel-Scan),
// damit ein Cache-Treffer garantiert denselben Text abdeckt, den ein
// frischer Aufruf dort produzieren würde.
export function baueKombiniertenText(aufnahmen: AufnahmeFuerKombination[]): string {
  const texte: string[] = []
  for (const a of aufnahmen) {
    if (a.typ === 'sprache' && a.verarbeitung_status === 'fertig' && a.transkript) {
      texte.push(a.transkript)
    } else if (a.typ === 'notiz' && a.notiz_text) {
      texte.push(a.notiz_text)
    } else if (a.typ === 'foto' && a.verarbeitung_status === 'fertig' && a.transkript) {
      texte.push(a.transkript)
    }
  }
  return texte.join('\n\n---\n\n')
}

export async function cacheKombinierteExtraktion(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  angebotId: string,
  aufnahmen: AufnahmeFuerKombination[],
): Promise<void> {
  try {
    // Einzelfall läuft über den bestehenden Pro-Aufnahme-Cache (voll-
    // extraktion-cache.ts) — hier nur der Mehrfach-Fall.
    if (aufnahmen.length < 2) return

    const blocked = await pruefeKIZugriff(userId, 'ki_extraktion')
    if (blocked) return // spekulativ — kein Fehlschlag-Marker nötig, siehe Kommentar oben

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const combinedText = baueKombiniertenText(aufnahmen)
    if (!combinedText.trim()) return

    const { data: company } = await supabase
      .from('companies')
      .select('gewerke')
      .eq('user_id', userId)
      .single()
    const gewerke = (company as { gewerke?: string[] } | null)?.gewerke ?? []
    const gewerk_hinweis = gewerke.length > 0
      ? `Der Handwerker arbeitet hauptsächlich in: ${gewerke.join(', ')}. Bevorzuge diese Gewerke bei der Zuweisung.`
      : ''

    const edgeResult = await callEdgeFunction(
      'ki-extrahieren',
      { transkript: combinedText, angebot_id: angebotId, gewerk_hinweis },
      session.access_token,
    ) as { result: ExtrahierteDaten }

    const wert: KombinierteExtraktionCache = {
      aufnahme_ids: aufnahmen.map(a => a.id).sort(),
      result: edgeResult.result,
    }
    await supabase.from('quotes').update({ kombinierte_extraktion_cache: wert }).eq('id', angebotId)
  } catch (e) {
    console.error('[kombinierte-extraktion-cache] Vorab-Berechnung fehlgeschlagen')
    Sentry.captureException(e, { tags: { feature: 'cos002_schritt3_mehrfach_vorab_cache' } })
  }
}
