// PM-099 — die zweite Bremse: ein Ausschlusssatz entfernt die Positionen
// NACH der Mengenberechnung (Engineering, 16.09.2026)
//
// Der Befund selbst steht als Sperrklinke beim Prüfmeister
// (`pruefmeister-batch-47-56.test.ts`, PM-099-A). Hier stehen die
// Zusicherungen, die die Bremse davon abhalten, zu viel wegzunehmen — jede
// einzelne davon ist am Prüfstand gemessen, bevor sie hier steht.
//
// Die drei Grenzen, um die es geht:
//   1. Ein Auftrag im selben Satz schlägt den Ausschluss
//      („Die Wände nicht tapezieren, nur streichen").
//   2. Ein Auftrag an einem ANDEREN Bauteil schlägt ihn nicht
//      („Decke streichen, an den Wänden nichts").
//   3. Der Ausschluss gilt für seinen Raum, nicht für den Auftrag.
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ergaenzeAusAufnahmeHinweisen, normalisiereBodenPositionenAusAufnahme } from '../mengen/aufnahme-hinweise'
import { ersetzeZahlenWorte } from '../zahlen-parser'
import { erkenneBauteilAusschluss, entferneAusgeschlosseneBauteile } from '../bauteil-ausschluss'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// Derselbe Weg wie im Prüfstand des Prüfmeisters — über die Pipeline, nicht
// direkt in die Engine.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(gewerk: 'maler' | 'boden_parkett', transkript: string, raeume: any[]) {
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
    ergaenzeAusAufnahmeHinweisen(ergebnis.positionen, chips, text),
    text,
  )
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], m: RegExp) => pos.find(p => m.test(p.beschreibung))

describe('PM-099 — welche Sätze überhaupt ein Bauteil abbestellen', () => {
  const lies = (t: string, r: string[] = ['Flur']) => erkenneBauteilAusschluss(t, r)

  it('„An den Wänden machen wir nichts" bestellt die Wand ab', () => {
    const a = lies('Flur, 4 mal 1.50. An den Wänden machen wir nichts.')
    expect([...(a.jeRaum.get('Flur') ?? [])]).toContain('wand')
  })

  it('„Die Wände bleiben wie sie sind" genauso', () => {
    const a = lies('Flur, 4 mal 1.50. Die Wände bleiben wie sie sind.')
    expect([...(a.jeRaum.get('Flur') ?? [])]).toContain('wand')
  })

  // Grenze 1: derselbe Satz beauftragt das Bauteil, das er einschränkt.
  // „nur streichen" nennt kein Bauteil — es trägt die Wand aus dem
  // Teilsatz davor weiter. Ohne diese Gegenprobe nähme die Bremse hier
  // die bestellte Wandleistung mit.
  it('ein Auftrag im selben Satz schlägt den Ausschluss', () => {
    const a = lies('Wohnzimmer, 5 mal 4. Die Wände nicht tapezieren, nur streichen.', ['Wohnzimmer'])
    expect([...(a.jeRaum.get('Wohnzimmer') ?? [])]).not.toContain('wand')
  })

  // Grenze 2: der Auftrag im selben Satz gilt einem ANDEREN Bauteil.
  it('ein Auftrag an einem anderen Bauteil schlägt ihn nicht', () => {
    const a = lies('Wohnzimmer, 5 mal 4. Decke streichen, an den Wänden nichts.', ['Wohnzimmer'])
    const w = a.jeRaum.get('Wohnzimmer') ?? new Set()
    expect([...w]).toContain('wand')
    expect([...w]).not.toContain('decke')
  })

  it('„bleiben nicht" ist das Gegenteil und bestellt nichts ab', () => {
    const a = lies('Flur, 4 mal 1.50. Die Wände bleiben nicht so.')
    expect(a.jeRaum.get('Flur') ?? new Set()).toEqual(new Set())
  })

  it('ohne Bauteilwort passiert nichts („sonst nix Großes")', () => {
    const a = lies('Küche, 4 mal 3. 3 Dübellöcher müssen gespachtelt werden, sonst nix Großes.', ['Küche'])
    expect(a.jeRaum.size).toBe(0)
    expect(a.global.size).toBe(0)
  })
})

describe('PM-099 — was die Bremse aus der fertigen Liste nimmt', () => {
  const FLUR = () => [raum('Flur', { laenge: 4, breite: 1.5, hoehe: 2.5, tueren: [{ anzahl: 4, breite: 0.9, hoehe: 2.1, annahme: false }], fenster: [], arbeiten: ['tueren lackieren', 'waende_streichen'] })]
  const TUEREN = 'Flur, 4 mal 1,50, Höhe 2,50. Die 4 Innentüren mit Zargen abschleifen, grundieren und weiß lackieren.'

  it('die Türarbeiten bleiben unangetastet', () => {
    const p = lauf('maler', TUEREN + ' An den Wänden machen wir nichts.', FLUR())
    expect(finde(p, /türen lackieren/i)).toBeDefined()
    expect(finde(p, /türzarge lackieren/i)).toBeDefined()
  })

  // Gemessen am 16.09.: die Vorarbeit `Voranstrich / Grundierung` trägt die
  // Wandfläche (27,50 m²), nennt die Wand aber nicht im Titel. Sie fällt
  // deshalb über die Folgeregel, nicht über den Titel.
  it('die Wandfläche fällt samt Vorarbeit und Schutzpositionen', () => {
    const p = lauf('maler', TUEREN + ' An den Wänden machen wir nichts.', FLUR())
    expect(finde(p, /wand streichen/i)).toBeUndefined()
    expect(finde(p, /voranstrich|grundierung/i)).toBeUndefined()
    expect(finde(p, /boden schützen/i)).toBeUndefined()
    expect(finde(p, /sockelleisten abkleben/i)).toBeUndefined()
  })

  // Die Kehrseite derselben Regel: wird im Raum weiter gestrichen, bleibt
  // der Schutz stehen. Sonst nähme die Bremse dem Maler die Abdeckung weg.
  it('bleibt die Decke beauftragt, bleiben auch die Schutzpositionen', () => {
    const p = lauf('maler', 'Wohnzimmer, 5 mal 4, Höhe 2,50. Decke streichen, an den Wänden nichts.',
      [raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.5, arbeiten: ['waende_streichen', 'decke_streichen'] })])
    expect(finde(p, /wand streichen/i)).toBeUndefined()
    expect(finde(p, /decke streichen/i)).toBeDefined()
    expect(finde(p, /boden schützen/i)).toBeDefined()
    expect(finde(p, /sockelleisten abkleben/i)).toBeDefined()
  })

  // Grenze 3: der Ausschluss gehört seinem Raum. Gemessen mit zwei Räumen —
  // im Flur fällt die Wand, im Wohnzimmer bleibt sie mit 45,00 m² stehen.
  it('der Ausschluss gilt nur für seinen Raum', () => {
    const p = lauf('maler', 'Wohnzimmer, 5 mal 4, Höhe 2,50. Wände zweimal streichen. Flur, 4 mal 1,50, Höhe 2,50. An den Wänden machen wir nichts.',
      [raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.5, arbeiten: ['waende_streichen'] }),
       raum('Flur', { laenge: 4, breite: 1.5, hoehe: 2.5, arbeiten: ['waende_streichen'] })])
    expect(finde(p, /wand streichen 2x — Flur/i)).toBeUndefined()
    expect(finde(p, /wand streichen 2x — Wohnzimmer/i)?.menge).toBe(45)
  })
})

describe('PM-099 — die Bremse fasst nichts an, was sie nicht versteht', () => {
  const P = [{ beschreibung: 'Wand streichen 2x — Flur' }, { beschreibung: 'Türen lackieren' }]

  it('ohne Ausschlusssatz bleibt die Liste dieselbe Liste (Objekt-Identität)', () => {
    const raus = entferneAusgeschlosseneBauteile(P, 'Flur, 4 mal 1.50. Wände streichen.', ['Flur'])
    expect(raus).toBe(P)
  })

  it('leerer Text ändert nichts', () => {
    expect(entferneAusgeschlosseneBauteile(P, '', ['Flur'])).toBe(P)
  })

  // Bei mehreren Räumen ist eine Position ohne Raum im Titel nicht
  // zuzuordnen. Eine Bremse, die rät, ist schlimmer als keine.
  it('bei mehreren Räumen bleibt eine Position ohne Raumangabe stehen', () => {
    const ohneRaum = [{ beschreibung: 'Wand streichen 2x' }]
    const raus = entferneAusgeschlosseneBauteile(
      ohneRaum, 'Wohnzimmer, 5 mal 4. Wände streichen. Flur, 4 mal 1.50. An den Wänden machen wir nichts.',
      ['Wohnzimmer', 'Flur'],
    )
    expect(raus).toHaveLength(1)
  })
})
