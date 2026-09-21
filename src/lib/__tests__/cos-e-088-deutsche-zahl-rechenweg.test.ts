// ═══════════════════════════════════════════════════════════════════════════
// CoS-E-088 (aus DC-130 §2) — der Rechenweg schrieb die Zahl englisch auf
// das Kundendokument
// ═══════════════════════════════════════════════════════════════════════════
//
// `src/lib/vollstaendigkeit/maler-sonder.ts` gab die Menge ungeformt in den
// Rechenweg: `${t.menge} m²`. Bei 45 m² fällt das nicht auf. Bei 47,5 m²
// stand auf dem Papier, das der Kunde bekommt, **„Wandfläche 47.5 m²"** —
// mit Punkt.
//
// Warum keine der vier E-085-Prüfungen das finden konnte: dort fällt jeder
// Prüfraum auf eine ganze Zahl (4 × 5 und 3 × 4 bei 2,50 m ergeben
// 45/35/20/12). Eine Prüfung mit runden Zahlen kann diesen Fehler nie
// sehen. Deshalb rechnet dieser Prüfraum ausdrücklich krumm:
//
//   Wohnzimmer 4,20 × 5,30 bei 2,50 m
//     Umfang       2 × (4,20 + 5,30)  = 19,00 lfm
//     Wandfläche   19,00 × 2,50       = 47,50 m²   ← eine Nachkommastelle
//     Deckenfläche 4,20 × 5,30        = 22,26 m²   ← zwei Nachkommastellen
//     Isoliergrund 47,50 + 22,26      = 69,76 m²
//
// Am Prüfstand gemessen, vor dem Bau:
//   „Wandfläche 47.5 m² + Deckenfläche 22.26 m²"
// danach:
//   „Wandfläche 47,5 m² + Deckenfläche 22,26 m²"
//
// `zahlDe()` ist keine neue Hilfe — sie steht seit DC-119 in
// `mengen/wandflaechen-konflikt.ts` und wird in `mengen/gewerke/maler.ts`
// dreimal benutzt. Sie hängt keine Null an: „47,5" statt „47,50", und „45"
// bleibt „45".
//
// Zu jedem Fund steht eine Kontrolle daneben. Ohne Kontrolle ist ein Fund
// eine Behauptung.

import { describe, it, expect } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { zahlDe } from '../mengen/wandflaechen-konflikt'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ersetzeZahlenWorte } from '../zahlen-parser'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// Derselbe Weg wie in `cos-e-085-isoliergrund-alle-raeume.test.ts` — über die
// Pipeline, nicht direkt in die Engine.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk: 'maler', raeume, transkript } } as never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen('maler', extraktion)
  const r2 = extraktion.raeume ?? raeume
  const text = ersetzeZahlenWorte(transkript)
  const signale = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arbeitenTexte: r2.flatMap((r: any) => r.arbeiten ?? []),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    belagText: r2.find((r: any) => r.belag)?.belag ?? null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    altbelagEntfernen: r2.some((r: any) => r.altbelag_entfernen === true),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeume: r2.map((r: any) => ({ name: r.name, arbeiten: r.arbeiten ?? [] })),
  }
  const meta = {
    fensterAnzahl: zaehleFenster(text) || undefined,
    tuerenAnzahl: zaehleTueren(text) || undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeume: r2.map((r: any) => ({ name: r.name, hoehe: r.hoehe ?? null })),
  }
  return pruefeUndErgaenzeVollstaendigkeit('maler', eng.positionen, text, meta as never, signale as never).positionen
}

const malerRaum = (name: string, l: number, b: number, h = 2.5) =>
  raum(name, { laenge: l, breite: b, hoehe: h, arbeiten: ['wände streichen', 'decke streichen'] })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iso = (pos: any[]) => pos.find(p => /Isoliergrund/.test(p.beschreibung))

// Der krumme Prüfraum. 47,50 m² Wand, 22,26 m² Decke.
const KRUMM = () => [malerRaum('Wohnzimmer', 4.2, 5.3)]
const T_KRUMM =
  'Wohnzimmer 4,20 mal 5,30, Höhe 2,50, Wände und Decke streichen, alles verraucht, da muss Sperrgrund drauf.'

// Der runde Gegenfall aus CoS-E-085 — er darf sich durch den Fix um nichts
// ändern. 45,00 + 20,00 = 65,00 m².
const RUND = () => [malerRaum('Wohnzimmer', 4, 5)]
const T_RUND =
  'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen, alles verraucht, da muss Sperrgrund drauf.'

describe('CoS-E-088 — deutsche Zahl im Rechenweg des Kundendokuments', () => {

  it('E-088-A · der krumme Prüfraum: kein Punkt mehr im Rechenweg', () => {
    const p = iso(lauf(T_KRUMM, KRUMM()))
    expect(p).toBeDefined()
    // Erst die Zahl selbst — ohne sie wäre der Text ein Zufallstreffer.
    expect(p!.menge).toBe(69.76)
    // Vor dem Bau: „Wandfläche 47.5 m² + Deckenfläche 22.26 m²"
    expect(p!.berechnungsweg).toBe('Wandfläche 47,5 m² + Deckenfläche 22,26 m²')
  })

  it('E-088-B · Kontrolle: im Rechenweg steht kein Dezimalpunkt mehr', () => {
    const p = iso(lauf(T_KRUMM, KRUMM()))
    // Ziffer, Punkt, Ziffer — genau die englische Schreibweise.
    expect(p!.berechnungsweg ?? '').not.toMatch(/\d\.\d/)
  })

  it('E-088-C · Kontrolle: der runde Fall aus CoS-E-085 schreibt sich unverändert', () => {
    const p = iso(lauf(T_RUND, RUND()))
    // Keine erfundene Null hinter dem Komma: „45 m²", nicht „45,00 m²".
    expect(p!.menge).toBe(65)
    expect(p!.berechnungsweg).toBe('Wandfläche 45 m² + Deckenfläche 20 m²')
  })

  it('E-088-D · Kontrolle: `zahlDe` tut genau das und nicht mehr', () => {
    expect(zahlDe(47.5)).toBe('47,5')
    expect(zahlDe(22.26)).toBe('22,26')
    expect(zahlDe(45)).toBe('45')
  })
})

// ── Offen, ausdrücklich NICHT hier gebaut ────────────────────────────────
//
// Derselbe Fehler steht noch in `mengen/gewerke/maler.ts` — an genau diesem
// Prüfraum gemessen:
//
//   „Umfang 19 lfm × 2.5 m = 47.5 m²"   (Wand streichen, Z. 771)
//   „Länge (4.2) × Breite (5.3)"        (Decke streichen, Z. 823)
//   „Umfang … lfm × … m = … m²"         (Kniestock, Z. 535)
//
// Das ist die Engine, nicht die Vollständigkeitsprüfung: dort hängen
// `flaechen_parameter`, die Golden-Tests und der DC-119-Zweig mit dran, der
// `zahlDe()` bereits richtig benutzt. Ein Zweizeiler ist es nicht, und halb
// gebaut wäre er schlechter als gar nicht — deshalb steht er als eigener
// Punkt (E-090) in `docs/chief-of-staff-engineering-todos.md`.
