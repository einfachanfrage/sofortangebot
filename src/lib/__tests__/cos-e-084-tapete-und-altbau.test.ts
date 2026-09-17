// CoS-E-084 — PM-102 und PM-103 aus Sandys zweitem Live-Lauf (17.09.2026)
//
// Zwei Funde des Prüfmeisters, beide auf demselben Diktat:
//
//   „Altbauwohnzimmer, 5,50 mal 4,20, Deckenhöhe 3,40.
//    Alte Tapete muss runter. Danach Wände und Decke zweimal weiß."
//
//   PM-102  Im Angebot fehlte die Wandposition (626,62 €) und stattdessen
//           stand „Tapete tapezieren" darin (1.714,96 €) — zwei Fehler auf
//           derselben Zeile, in entgegengesetzte Richtungen.
//   PM-103  „Erschwerniszuschlag Altbau · 20 % · 460,20 €", ausgelöst allein
//           vom RAUMNAMEN „Altbauwohnzimmer".
//
// Die Sperrklinken des Prüfmeisters stehen in
// `pruefmeister-batch-47-56.test.ts`. Diese Datei hält dieselben Zusicherungen
// aus Sicht des Baus fest — sie gehört zum Fix und geht mit ihm in denselben
// Commit, damit die Zusicherung nicht in einer fremden, uncommitteten Datei
// hängt.
//
// Aufbau wie dort: über die Pipeline, nicht direkt in die Engine.
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ersetzeZahlenWorte } from '../zahlen-parser'

const TUER = { anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }
const FENSTER = { anzahl: 1, breite: 1.2, hoehe: 1.0, annahme: true }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk: 'maler', raeume, transkript } } as never)
  const text = ersetzeZahlenWorte(transkript)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen('maler', extraktion)
  const r2 = extraktion.raeume ?? raeume
  const signale = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arbeitenTexte: r2.flatMap((r: any) => r.arbeiten ?? []),
    belagText: null,
    altbelagEntfernen: false,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], m: RegExp) => pos.find(p => m.test(p.beschreibung))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const menge = (pos: any[], m: RegExp) => finde(pos, m)?.menge

const DIKTAT = 'Altbauwohnzimmer, 5,50 mal 4,20, Deckenhöhe 3,40. Alte Tapete muss runter. Danach Wände und Decke zweimal weiß.'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const RAUM = (arbeiten: string[], name = 'Altbauwohnzimmer'): any[] =>
  [raum(name, { laenge: 5.5, breite: 4.2, hoehe: 3.4, tueren: [TUER], fenster: [FENSTER], arbeiten })]

describe('PM-102 — der Wandanstrich bleibt stehen', () => {
  // Die Kernursache: in `["tapete entfernen", "tapezieren", "decke_streichen"]`
  // steht das Wort „Wand" nicht, „Decke" schon. Die schwächste Scope-Regel
  // („eine Fläche genannt, die andere nicht") schloss daraus „nur Decke" und
  // löschte Wandanstrich und Sockelleisten aus dem fertigen Angebot.
  it('Tapezierarbeiten in der Arbeitenliste löschen die Wandpositionen nicht', () => {
    const p = lauf(DIKTAT, RAUM(['tapete entfernen', 'tapezieren', 'decke_streichen']))
    expect(menge(p, /wand streichen 2x/i)).toBe(65.96)
    expect(finde(p, /sockelleisten abkleben/i)).toBeDefined()
    expect(finde(p, /decke streichen/i)).toBeDefined()
  })

  // Der Live-Fall: die Extraktion schrieb „tapete aufziehen" in die
  // Arbeitenliste. Daraus entstand die Zeile `Tapete tapezieren` mit 65,96 m²
  // × 26,00 € = 1.714,96 €, und der Wandanstrich fiel dafür weg.
  it('eine erfundene Tapezierarbeit schlägt die ausgesprochene Ansage nicht', () => {
    const p = lauf(DIKTAT, RAUM(['tapete entfernen', 'tapete aufziehen', 'decke_streichen']))
    expect(finde(p, /tapezier/i)).toBeUndefined()
    expect(menge(p, /wand streichen 2x/i)).toBe(65.96)
    expect(menge(p, /tapete entfernen/i)).toBe(65.96)
  })

  // Gegenprobe — der Fix darf nicht in die andere Richtung Geld verlieren:
  // sagt das Diktat wirklich, dass neu tapeziert wird, bleibt es dabei.
  it('Gegenprobe: „danach neue Raufaser drauf" bleibt Tapezieren', () => {
    const T = 'Wohnzimmer, 5,50 mal 4,20, Deckenhöhe 3,40. Alte Tapete muss runter. Danach neue Raufaser drauf und zweimal weiß streichen.'
    const p = lauf(T, RAUM(['tapete entfernen', 'tapete aufziehen', 'waende_streichen'], 'Wohnzimmer'))
    expect(finde(p, /tapezier/i)).toBeDefined()
  })

  // Gegenprobe in die zweite Richtung: ein echter „nur die Decke"-Auftrag
  // bleibt ein „nur die Decke"-Auftrag. Die Ausnahme greift nur bei der
  // schwachen Erwähnungs-Regel, nicht bei einer ausdrücklichen Einschränkung.
  it('Gegenprobe: „nur die Decke" bleibt ohne Wandposition', () => {
    const T = 'Wohnzimmer, 5,50 mal 4,20, Deckenhöhe 2,50. Nur die Decke streichen, zweimal. Die Wände bleiben.'
    const p = lauf(T, RAUM(['nur decke streichen'], 'Wohnzimmer'))
    expect(finde(p, /wand streichen/i)).toBeUndefined()
  })
})

describe('PM-103 — der Altbau-Zuschlag entsteht nicht aus einem Namen', () => {
  const ARBEITEN = ['tapete entfernen', 'waende_streichen', 'decke_streichen']

  it('„Altbauwohnzimmer" im Transkript löst keinen Zuschlag aus', () => {
    expect(finde(lauf(DIKTAT, RAUM(ARBEITEN)), /erschwerniszuschlag altbau/i)).toBeUndefined()
  })

  it('ein Raum, der in der Aufnahme „Altbau" heißt, löst keinen Zuschlag aus', () => {
    const T = 'Altbau, 5,50 mal 4,20, Deckenhöhe 3,40. Wände und Decke zweimal weiß streichen.'
    expect(finde(lauf(T, RAUM(ARBEITEN, 'Altbau')), /erschwerniszuschlag altbau/i)).toBeUndefined()
  })

  it('eine Aussage über den Bau löst ihn weiterhin aus', () => {
    const T = 'Wohnzimmer, 5,50 mal 4,20, Deckenhöhe 3,40. Ist ein Altbau, Kalkputz, alles krumm. Wände und Decke zweimal weiß streichen.'
    expect(finde(lauf(T, RAUM(ARBEITEN, 'Wohnzimmer')), /erschwerniszuschlag altbau/i)).toBeDefined()
  })

  it('„im Altbau" und „Altbauten" zählen ebenfalls als Aussage', () => {
    const A = 'Wohnzimmer, 4 mal 3, Höhe 2,50. Wir arbeiten im Altbau. Wände zweimal streichen.'
    const B = 'Wohnzimmer, 4 mal 3, Höhe 2,50. Altbauten sind das hier alle. Wände zweimal streichen.'
    expect(finde(lauf(A, RAUM(ARBEITEN, 'Wohnzimmer')), /erschwerniszuschlag altbau/i)).toBeDefined()
    expect(finde(lauf(B, RAUM(ARBEITEN, 'Wohnzimmer')), /erschwerniszuschlag altbau/i)).toBeDefined()
  })

  // Der Denkmalschutz-Zuschlag ist bewusst NICHT mitgeändert — er hat
  // denselben Bau, aber keinen gemessenen Fund. Hier steht er als Beleg, dass
  // dieser Lauf ihn nicht angefasst hat.
  it('Denkmalschutz bleibt unverändert', () => {
    const T = 'Wohnzimmer, 4 mal 3, Höhe 2,50. Steht unter Denkmalschutz. Wände zweimal streichen.'
    expect(finde(lauf(T, RAUM(ARBEITEN, 'Wohnzimmer')), /erschwerniszuschlag denkmalschutz/i)).toBeDefined()
  })
})
