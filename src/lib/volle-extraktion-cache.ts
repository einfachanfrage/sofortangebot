import type { createClient } from './supabase/server'
import { callEdgeFunction } from './edge-function-client'
import { ersetzeZahlenWorte } from './zahlen-parser'
import { pruefeKIZugriff } from './rate-limiter'
import * as Sentry from '@sentry/nextjs'

// CoS-002 Option 1, Schritt 1 (Head of Product Engineering, 2026-08-20,
// Sandys Auftrag "Option 1 komplett, alle 3 Schritte" —
// docs/cos-002-architektur-vorschlag.md):
//
// Root Cause von CoS-002: Aufnahmekarte (extrahiereChips, gpt-4o-mini) und
// finale Berechnung (ki-extrahieren, gpt-4o) sind zwei unabhängige
// KI-Aufrufe auf demselben Text. Das Ziel über alle drei Schritte: nur noch
// EIN KI-Aufruf pro Aufnahme, dessen Ergebnis beide Seiten (Karte UND
// finale Berechnung) lesen.
//
// Dies ist bewusst NUR Schritt 1: reines Caching, PLUMBING OHNE
// Verhaltensänderung. Ruft ki-extrahieren zusätzlich zur bestehenden
// extrahiereChips auf (die bleibt unverändert bestehen) und speichert das
// Ergebnis in der neuen Spalte entwurf_aufnahmen.voll_extraktion. NIEMAND
// liest diese Spalte bisher — das kommt in Schritt 2 (Karte) und Schritt 3
// (Geld-Pfad). Deshalb hier maximale Vorsicht: darf NIE die Aufnahme
// blockieren oder verlangsamen (Aufrufer nutzt next/server's after(), läuft
// also erst NACH der eigentlichen Antwort), und schluckt jeden eigenen
// Fehler statt ihn hochzureichen.
//
// Kosten-Hinweis (im Vorschlag ausdrücklich benannt): dieser Aufruf teilt
// sich das bestehende ki_extraktion-Budget (rate-limiter.ts) mit "Entwurf
// erstellen" — kein neuer, unbegrenzter Kostenpfad. Solange Schritt 3 noch
// nicht live ist, wird das Budget dadurch pro Aufnahme QUASI DOPPELT
// belastet (einmal hier, einmal beim tatsächlichen "Entwurf erstellen") —
// das ist ein bewusster, befristeter Kompromiss für die additive
// Zwischenphase, kein Versehen. Ist das Budget schon aufgebraucht, wird
// einfach übersprungen statt selbst mitzuzählen oder zu blockieren.
//
// Vorverarbeitung bewusst NICHT identisch zu angebot-extrahieren
// (segmentiereRaeume/loeseKorrekturenAuf/Ergänzungen/Korrekturen fehlen
// hier) — nur ersetzeZahlenWorte, dieselbe leichte Vorstufe, die die Karte
// heute schon zu reinen Anzeigezwecken nutzt. Volle Parität wird erst für
// Schritt 3 gebraucht, wenn dieses Ergebnis tatsächlich in die Berechnung
// einfließt; hier bewusst nicht vorgezogen, um Schritt 1 klein zu halten.
export async function cacheVolleExtraktion(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  aufnahmeId: string,
  angebotId: string,
  transkript: string,
): Promise<void> {
  try {
    const blocked = await pruefeKIZugriff(userId, 'ki_extraktion')
    if (blocked) return

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { data: company } = await supabase
      .from('companies')
      .select('gewerke')
      .eq('user_id', userId)
      .single()
    const gewerke = (company as { gewerke?: string[] } | null)?.gewerke ?? []
    const gewerk_hinweis = gewerke.length > 0
      ? `Der Handwerker arbeitet hauptsächlich in: ${gewerke.join(', ')}. Bevorzuge diese Gewerke bei der Zuweisung.`
      : ''

    const textVorbereitet = ersetzeZahlenWorte(transkript)

    const edgeResult = await callEdgeFunction(
      'ki-extrahieren',
      { transkript: textVorbereitet, angebot_id: angebotId, gewerk_hinweis },
      session.access_token,
    )

    await supabase
      .from('entwurf_aufnahmen')
      .update({ voll_extraktion: edgeResult })
      .eq('id', aufnahmeId)
  } catch (e) {
    // Nie blockieren, nie den Aufnahme-Flow stören — reines Caching für
    // spätere Schritte (siehe Kommentar oben).
    console.error('[volle-extraktion-cache] Caching fehlgeschlagen (unkritisch, CoS-002 Schritt 1)')
    Sentry.captureException(e, { tags: { feature: 'cos002_option1_schritt1_cache' } })
  }
}
