import type { createClient } from './supabase/server'
import { callEdgeFunction } from './edge-function-client'
import { ersetzeZahlenWorte } from './zahlen-parser'
import { pruefeKIZugriff } from './rate-limiter'
import { verarbeiteExtraktion } from './mengen/extraktion-pipeline'
import type { ExtrahierteDaten } from './mengen/types'
import type { ErkanntPosition, VollExtraktionCache } from './types'
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
// heute schon zu reinen Anzeigezwecken nutzt.
//
// Schritt 2 (Head of Product Engineering, 2026-08-21, docs/design-check.md
// DC-030): Neu seit Schritt 2 — das rohe ki-extrahieren-Ergebnis läuft hier
// direkt durch dieselbe deterministische Nachbearbeitung
// (verarbeiteExtraktion, src/lib/mengen/extraktion-pipeline.ts), die auch
// die finale Berechnung nutzt (PM-012-Lehre: keine zweite, unabhängige
// Heuristik für dieselbe Aufgabe). Das Ergebnis (`positionen`) ist deshalb
// keine neue Vorschau-Quelle, sondern derselbe Zwischenstand, den auch
// /api/angebot-extrahieren produziert — genau das Ziel von CoS-002.
//
// Fehlschlag-Markierung (neu seit Schritt 2, DC-030-Nachtrag): Die Karte
// wartet ab jetzt aktiv auf ein `voll_extraktion`-Ergebnis, bevor sie
// Positionen zeigt UND bevor "Entwurf erstellen" freigeschaltet wird (siehe
// entwurf/page.tsx, kannFertigstellen). Würde diese Funktion bei einem
// Fehlschlag (Rate-Limit aufgebraucht, Netzwerk-/GPT-Fehler) die Zeile
// einfach unverändert lassen wie in Schritt 1, bliebe die Karte —
// und damit der Button — für den Nutzer dauerhaft blockiert, ohne dass er
// je erfährt warum. Deshalb wird jetzt IMMER geschrieben: entweder das
// echte Ergebnis, oder eine explizite `__fehlgeschlagen`-Markierung, auf
// die die Karte mit Fail-Open reagiert (zurück zur schnellen Vorschau,
// siehe kartenAnsicht() in entwurf/page.tsx). Zusätzliche Absicherung
// clientseitig: ein Timeout, falls diese Funktion selbst nie durchläuft
// (z. B. Server-Absturz mitten in after()) — siehe
// VOLL_EXTRAKTION_TIMEOUT_MS dort.
export async function cacheVolleExtraktion(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  aufnahmeId: string,
  angebotId: string,
  transkript: string,
): Promise<void> {
  async function schreibeFehlgeschlagen() {
    try {
      const wert: VollExtraktionCache = { __fehlgeschlagen: true }
      await supabase.from('entwurf_aufnahmen').update({ voll_extraktion: wert }).eq('id', aufnahmeId)
    } catch {
      // Best effort — wenn selbst das scheitert, greift client-seitig
      // trotzdem der Timeout-Fallback (siehe Kommentar oben).
    }
  }

  try {
    const blocked = await pruefeKIZugriff(userId, 'ki_extraktion')
    if (blocked) { await schreibeFehlgeschlagen(); return }

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { await schreibeFehlgeschlagen(); return }

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
    ) as { result: ExtrahierteDaten }

    // Dieselbe Nachbearbeitung wie die finale Berechnung — `text` bewusst
    // das rohe Transkript (nicht textVorbereitet), exakt wie
    // /api/angebot-extrahieren es auch übergibt (verarbeiteExtraktion
    // berechnet seine Vorstufen selbst, siehe Kommentar dort). Nur für die
    // Karten-Vorschau (Schritt 2) — Schritt 3 (Geld-Pfad) nutzt NICHT dieses
    // `positionen`, sondern `edgeResult.result` direkt (siehe unten), weil
    // dort zum Zeitpunkt von "Entwurf erstellen" mit dem tatsächlichen,
    // ggf. mehrere Aufnahmen umfassenden combinedText und den echten
    // antworten/basis_extraktion neu durch verarbeiteExtraktion gejagt wird.
    let positionen: ErkanntPosition[] | undefined
    try {
      const verarbeitet = verarbeiteExtraktion(transkript, edgeResult)
      positionen = verarbeitet.mengen.positionen.map(p => ({
        titel: p.beschreibung,
        menge: p.menge,
        einheit: p.einheit,
        einzelpreis: 0,
        gesamtpreis: 0,
        erkannt: true,
      }))
    } catch (mapFehler) {
      // Nachbearbeitung für die Karten-Vorschau fehlgeschlagen — das rohe
      // Ergebnis (`edgeResult.result`) wird trotzdem gecacht, siehe unten,
      // nur die Karten-Vorschau selbst bleibt in diesem Fall leer. Kein
      // schreibeFehlgeschlagen() hier: die Karte soll nicht auf die alte
      // Chip-Vorschau zurückfallen, wenn die neue Pipeline an genau diesem
      // Transkript tatsächlich einen Bug hat — das wäre ein Fehler, den man
      // sehen will (Sentry), nicht stillschweigend verstecken.
      console.error('[volle-extraktion-cache] Nachbearbeitung fehlgeschlagen, Rohergebnis bleibt trotzdem gecacht')
      Sentry.captureException(mapFehler, { tags: { feature: 'cos002_schritt2_pipeline_mapping' } })
    }

    const wert: VollExtraktionCache = { result: edgeResult.result, ...(positionen ? { positionen } : {}) }
    await supabase.from('entwurf_aufnahmen').update({ voll_extraktion: wert }).eq('id', aufnahmeId)
  } catch (e) {
    // Nie den Aufnahme-Flow stören — reines Hintergrund-Caching (siehe
    // Kommentar oben). Aber: anders als in Schritt 1 nicht mehr stillschweigend
    // aufgeben, sonst wartet die Karte ewig auf ein Ergebnis, das nie kommt.
    console.error('[volle-extraktion-cache] Caching fehlgeschlagen')
    Sentry.captureException(e, { tags: { feature: 'cos002_option1_schritt1_cache' } })
    await schreibeFehlgeschlagen()
  }
}
