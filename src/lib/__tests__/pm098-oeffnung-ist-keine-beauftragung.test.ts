// PM-098 — die Nennung einer Öffnung ist keine Beauftragung
// (Engineering, 16.09.2026 · Auftrag: CoS-E-069 Nachtrag)
//
// Der Befund selbst steht als Sperrklinke beim Prüfmeister
// (`pruefmeister-batch-47-56.test.ts`, PM-098-A): „Ein Fenster, eine Tür."
// erzeugte zusammen mit einem „lackieren" an einem GANZ ANDEREN Bauteil
// sieben Positionen für 280,00 €.
//
// Hier stehen die Zusicherungen, die die neue Bremse davon abhalten, zu viel
// wegzunehmen. Jede einzelne ist am Prüfstand gemessen, bevor sie hier steht —
// keine davon ist ein Vorsatz.
//
// Die Staffelung, die `auftragGiltFuer` (vollstaendigkeit/helpers.ts) baut:
//   1. Lackier-Wort gar nicht im Rohtext → unverändert (KI-Signal entscheidet).
//   2. Arbeit im SELBEN Satz wie das Bauteil → beauftragt.
//   3. Arbeit nur in Sätzen mit einem ANDEREN Bauteil → nicht beauftragt.
//   4. Arbeit in einem Satz ohne jedes Bauteil → allgemeine Ansage, gilt.
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ergaenzeAusAufnahmeHinweisen, normalisiereBodenPositionenAusAufnahme } from '../mengen/aufnahme-hinweise'
import { ersetzeZahlenWorte } from '../zahlen-parser'
import { auftragGiltFuer } from '../vollstaendigkeit/helpers'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// Derselbe Weg wie im Prüfstand des Prüfmeisters — über die Pipeline, nicht
// direkt in die Engine.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(gewerk: 'maler', transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk, raeume, transkript } } as never)
  const text = ersetzeZahlenWorte(transkript)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen(gewerk, extraktion)
  const r2 = extraktion.raeume ?? raeume
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
  const ergebnis = pruefeUndErgaenzeVollstaendigkeit(gewerk, eng.positionen, text, meta as never, signale as never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chips: string[] = r2.flatMap((r: any) =>
    (r.arbeiten ?? []).map((a: string) => `${a}${r.name ? ` — ${r.name}` : ''}`),
  )
  return normalisiereBodenPositionenAusAufnahme(
    ergaenzeAusAufnahmeHinweisen(ergebnis.positionen, chips, text), text,
  )
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], m: RegExp) => pos.find(p => m.test(p.beschreibung))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const menge = (pos: any[], m: RegExp) => finde(pos, m)?.menge

const TUER = { anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }
const FENSTER = { anzahl: 1, breite: 1.2, hoehe: 1.0, annahme: true }
const WZ = (arbeiten: string[]) => [raum('Wohnzimmer', {
  laenge: 5, breite: 4, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER], arbeiten,
})]

const TUERARBEIT = /türen (abschleifen|grundieren|lackieren)|türzarge/i
const FENSTERARBEIT = /fenster (abschleifen|grundieren|lackieren)/i

describe('PM-098 — die Regel selbst (auftragGiltFuer)', () => {
  const TUER_RE = /tür|tuer/i
  const FENSTER_RE = /fenster/i
  const HZK_RE = /heizkörper|heizung/i
  const LACK = /lackier\w*|neu\s+streich\w*/i

  it('Staffelung 1 — steht die Arbeit nicht im Rohtext, bleibt alles wie bisher', () => {
    expect(auftragGiltFuer(TUER_RE, LACK, 'wohnzimmer, 5 mal 4. eine tür.', [FENSTER_RE, HZK_RE])).toBe(true)
  })

  it('Staffelung 2 — Bauteil und Arbeit im selben Satz: beauftragt', () => {
    expect(auftragGiltFuer(TUER_RE, LACK, 'die türen lackieren. ein fenster.', [FENSTER_RE, HZK_RE])).toBe(true)
  })

  it('Staffelung 3 — die Arbeit hängt nur am anderen Bauteil: nicht beauftragt', () => {
    expect(auftragGiltFuer(TUER_RE, LACK, 'die 2 heizkörper lackieren. ein fenster, eine tür.', [FENSTER_RE, HZK_RE])).toBe(false)
  })

  it('Staffelung 4 — ein Satz ohne jedes Bauteil ist eine allgemeine Ansage', () => {
    expect(auftragGiltFuer(TUER_RE, LACK, 'die türen und die fenster sind alt. alles lackieren.', [FENSTER_RE, HZK_RE])).toBe(true)
  })
})

describe('PM-098 — über die Pipeline: was wegfällt und was bleibt', () => {
  // ── Der Fall des Prüfmeisters, ohne die Öffnungen nachzubauen ──────────
  it('der Heizkörper-Auftrag trägt Tür und Fenster NICHT mit', () => {
    const p = lauf('maler', 'Wohnzimmer, 5 mal 4, Höhe 2,50. Wände zweimal streichen. Die 2 Heizkörper bitte mit lackieren. Ein Fenster, eine Tür.',
      WZ(['waende_streichen', 'heizkoerper lackieren']))
    expect(finde(p, TUERARBEIT)).toBeUndefined()
    expect(finde(p, FENSTERARBEIT)).toBeUndefined()
    // Was bestellt war, steht unverändert da — die Bremse nimmt nichts mit.
    expect(menge(p, /heizkörper lackieren/i)).toBe(2)
    expect(menge(p, /wand streichen 2x/i)).toBe(45)
  })

  // ── Der zweite Weg in denselben Fehler ────────────────────────────────
  // `hatTuerenLackieren` hat einen zweiten Zweig: „neu streichen". Ohne ihn
  // in der Bremse wäre PM-098 nur zur Hälfte zu — „Die Wände neu streichen"
  // hätte Tür und Fenster weiter mitlackiert.
  it('„Die Wände neu streichen" beauftragt keine Türlackierung', () => {
    const p = lauf('maler', 'Wohnzimmer, 5 mal 4, Höhe 2,50. Die Wände neu streichen. Ein Fenster, eine Tür.',
      WZ(['waende_streichen']))
    expect(finde(p, TUERARBEIT)).toBeUndefined()
    expect(finde(p, FENSTERARBEIT)).toBeUndefined()
    expect(menge(p, /wand streichen/i)).toBe(45)
  })

  // ── Grenze 1: der eigene Auftrag bleibt (PM-099-Form) ─────────────────
  it('steht die Tür im Lackier-Satz selbst, entstehen ihre vier Zeilen', () => {
    const p = lauf('maler', 'Wohnzimmer, 5 mal 4, Höhe 2,50. Die Türen abschleifen, grundieren und lackieren. Ein Fenster.',
      WZ(['tueren lackieren']))
    expect(menge(p, /türen abschleifen/i)).toBe(1)
    expect(menge(p, /türen grundieren/i)).toBe(1)
    expect(menge(p, /türen lackieren/i)).toBe(1)
    expect(menge(p, /türzarge lackieren/i)).toBe(1)
    // …und das bloß genannte Fenster bleibt trotzdem draußen.
    expect(finde(p, FENSTERARBEIT)).toBeUndefined()
  })

  // ── Grenze 2: die allgemeine Ansage ───────────────────────────────────
  it('„Alles abschleifen, grundieren und lackieren" gilt für beide Bauteile', () => {
    const p = lauf('maler', 'Wohnzimmer, 5 mal 4, Höhe 2,50. Die Türen und die Fenster sind alt. Alles abschleifen, grundieren und lackieren.',
      WZ(['tueren lackieren', 'fenster lackieren']))
    expect(menge(p, /türen lackieren/i)).toBe(1)
    expect(menge(p, /fenster lackieren/i)).toBe(1)
  })

  // ── Grenze 3: zwei Bauteile in einem Satz ─────────────────────────────
  it('nennt derselbe Satz Tür UND Heizkörper, bekommen beide ihre Zeilen', () => {
    const p = lauf('maler', 'Wohnzimmer, 5 mal 4, Höhe 2,50. Die Türen und die Heizkörper lackieren. Ein Fenster.',
      WZ(['tueren lackieren', 'heizkoerper lackieren']))
    expect(menge(p, /türen lackieren/i)).toBe(1)
    expect(menge(p, /heizkörper lackieren/i)).toBe(1)
    expect(finde(p, FENSTERARBEIT)).toBeUndefined()
  })

  // ── Grenze 4: der Fenster-Auslöser hat drei eigene Zweige ─────────────
  // „Fenster streichen" nennt das Fenster bereits im selben Atemzug wie die
  // Arbeit — das IST die Beauftragung, die PM-098 verlangt. Bremste die
  // Regel auch hier, nähme sie dem Fenster seinen eigenen Auftrag, sobald
  // irgendwo sonst ein „lackieren" fällt. Gemessen, nicht angenommen.
  it('„Die Fenster streichen" bleibt neben einem Heizkörper-Lackierauftrag stehen', () => {
    const p = lauf('maler', 'Wohnzimmer, 5 mal 4, Höhe 2,50. Wände zweimal streichen. Die 2 Heizkörper lackieren. Die Fenster streichen.',
      WZ(['waende_streichen', 'heizkoerper lackieren', 'fenster streichen']))
    expect(menge(p, /fenster lackieren/i)).toBe(1)
    expect(menge(p, /heizkörper lackieren/i)).toBe(2)
    // Die Tür war nie genannt worden — und bleibt es auch.
    expect(finde(p, TUERARBEIT)).toBeUndefined()
  })

  // ── Grenze 5: die Sockelleiste zählt als eigenes Bauteil ──────────────
  it('ein Lackierauftrag an den Sockelleisten trägt die Öffnungen nicht mit', () => {
    const p = lauf('maler', 'Wohnzimmer, 5 mal 4, Höhe 2,50. Wände zweimal streichen. Die Sockelleisten lackieren. Ein Fenster, eine Tür.',
      WZ(['waende_streichen', 'sockelleisten lackieren']))
    expect(finde(p, TUERARBEIT)).toBeUndefined()
    expect(finde(p, FENSTERARBEIT)).toBeUndefined()
  })
})
