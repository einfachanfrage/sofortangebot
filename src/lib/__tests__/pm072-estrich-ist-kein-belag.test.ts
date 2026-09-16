// PM-072, Zug 3 — Estrich ist ein Unterboden, kein Belag.
//
// Der Fund des Prüfmeisters: „Keller fünf mal vier. Zementestrich schwimmend
// einbauen, sechzig Millimeter." erzeugte eine einzige Position,
// `Bodenbelag verlegen inkl. 5% Verschnitt — Keller`, 21,00 m², 0,00 €.
// Eine erfundene Zeile — niemand hat einen Belag bestellt.
//
// Dieser Zug nimmt die erfundene Zeile weg. Er baut KEINE Estrich-Zeile:
// die Kategorie des Katalogeintrags passt zu keinem aktiven Gewerk, eine
// Zeile käme mit 0,00 €. Die gesagte Arbeit sichtbar zu machen ist Zug 2.
// So entschieden in CoS-E-064.
//
// Aufbau wie `pruefmeister-batch-69-77.test.ts` — über die Pipeline.
// Jede Bremse steht hier mit ihrer Gegenprobe: der Nachbarsatz, der weiter
// durchlaufen MUSS. Ohne Gegenprobe ist eine Bremse eine Behauptung.
//
// Head of Product Engineering · 16.09.2026
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ersetzeZahlenWorte } from '../zahlen-parser'
import { istBelagsAuftrag } from '../mengen/gewerke/boden'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(gewerk: 'maler' | 'boden_parkett', transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk, raeume, transkript } } as never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen(gewerk, extraktion)
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
  return {
    positionen: pruefeUndErgaenzeVollstaendigkeit(gewerk, eng.positionen, text, meta as never, signale as never).positionen,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeumeNachher: r2.map((r: any) => ({ name: r.name, belag: r.belag, altbelag_entfernen: r.altbelag_entfernen, arbeiten: r.arbeiten })),
  }
}

const KELLER = 'Keller fünf mal vier. Zementestrich schwimmend einbauen, sechzig Millimeter.'
const keller = (arbeiten: string[]) => [raum('Keller', { laenge: 5, breite: 4, arbeiten })]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], m: RegExp) => pos.find(p => m.test(p.beschreibung))

/** Engine ohne Pipeline davor — isoliert `hatEchtenBelagAuftrag` in boden.ts. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function engineDirekt(r: any) {
  const voll = { tueren: [], fenster: [], hoehe: null, flaeche: null, umfang: null,
    altbelag_entfernen: false, altbelag_vorhanden: false, sockelleisten: false,
    nassbereich: false, ausgleich: false, ...r }
  return berechneMengen('boden_parkett', { transkript: '', raeume: [voll] } as never).positionen
}

// ── Die Staffelung, Stufe für Stufe ──────────────────────────────────────
describe('PM-072 · die Staffelung einzeln', () => {
  it('Stufe 1 — ein genannter Belag ist ein Belagsauftrag', () => {
    expect(istBelagsAuftrag('vinyl verlegen')).toBe(true)
    expect(istBelagsAuftrag('laminat verlegen')).toBe(true)
    expect(istBelagsAuftrag('alten estrich raus, vinyl verlegen')).toBe(true)
  })

  it('Stufe 2 — Estrich allein ist keiner, egal mit welchem Verb', () => {
    expect(istBelagsAuftrag('zementestrich einbauen')).toBe(false)
    expect(istBelagsAuftrag('estrich verlegen')).toBe(false)
    expect(istBelagsAuftrag('fließestrich einbringen')).toBe(false)
    expect(istBelagsAuftrag('estrich abschleifen')).toBe(false)
  })

  it('Stufe 3 — ohne Estrich bleibt alles wie bisher', () => {
    expect(istBelagsAuftrag('boden verlegen')).toBe(true)
    expect(istBelagsAuftrag('teppich verlegen')).toBe(true)
  })

  it('kein Bodensignal bleibt kein Bodensignal', () => {
    expect(istBelagsAuftrag('wände streichen')).toBe(false)
    expect(istBelagsAuftrag('sockelleisten')).toBe(false)
  })
})

// ── Über die volle Pipeline ──────────────────────────────────────────────
describe('PM-072 · über die Pipeline', () => {
  it('🟢 PM-072-Zug3 · die erfundene Belagszeile entsteht nicht mehr', () => {
    const p = lauf('boden_parkett', KELLER, keller(['zementestrich einbauen'])).positionen
    expect(finde(p, /Bodenbelag verlegen/), 'erfundene Belagszeile').toBeUndefined()
  })

  it('der Estrich-Auftrag erzeugt gar keine Belagszeile — auch keine andere', () => {
    const p = lauf('boden_parkett', KELLER, keller(['zementestrich einbauen'])).positionen
    expect(finde(p, /verlegen/), 'irgendeine Verlegezeile').toBeUndefined()
  })

  it('GEGENPROBE · wird ein Belag genannt, bleibt die Zeile stehen', () => {
    const T = 'Keller fünf mal vier. Alten Estrich raus, Vinyl verlegen.'
    const p = lauf('boden_parkett', T, keller(['alten estrich raus', 'vinyl verlegen'])).positionen
    expect(finde(p, /verlegen/), 'Belagszeile').toBeDefined()
  })

  it('GEGENPROBE · ein gewöhnlicher Belagsauftrag ohne Estrich ist unberührt', () => {
    const T = 'Wohnzimmer fünf mal vier. Laminat verlegen.'
    const p = lauf('boden_parkett', T, [raum('Wohnzimmer', { laenge: 5, breite: 4, arbeiten: ['laminat verlegen'] })]).positionen
    expect(finde(p, /verlegen/), 'Belagszeile').toBeDefined()
    expect(finde(p, /verlegen/)!.menge).toBe(21)
  })

  // Diese zwei fahren die Engine DIREKT an, nicht über die Pipeline: die
  // Pipeline rechnet `altbelag_entfernen` aus dem Rohtext neu aus und setzt
  // ein von Hand gesetztes Flag wieder auf false. Für die Frage, ob die
  // PM-072-Bremse den Altbelag-Zweig verschluckt, wäre das der falsche
  // Prüfstand — sie muss den Zweig in `hatEchtenBelagAuftrag` treffen,
  // nicht die Rohtext-Erkennung davor.
  //
  // (Dass die Pipeline das Flag überschreibt, ist beim Messen aufgefallen
  // und hier nur notiert, nicht angefasst — eigener Fall, siehe Bericht.)
  it('GEGENPROBE · der Altbelag-Zweig ist unberührt — er sticht die Bremse', () => {
    const p = engineDirekt({
      name: 'Keller', laenge: 5, breite: 4,
      arbeiten: ['zementestrich einbauen'], altbelag_entfernen: true,
    })
    expect(finde(p, /verlegen/), 'Belagszeile über den Altbelag-Zweig').toBeDefined()
  })

  it('GEGENPROBE · der Belagsfeld-Zweig ist unberührt — er sticht die Bremse', () => {
    const p = engineDirekt({
      name: 'Keller', laenge: 5, breite: 4,
      arbeiten: ['zementestrich einbauen'], belag: 'vinyl',
    })
    expect(finde(p, /verlegen/), 'Belagszeile über das Belagsfeld').toBeDefined()
  })

  it('und ohne die beiden Zweige bremst PM-072 genau diesen Raum', () => {
    const p = engineDirekt({
      name: 'Keller', laenge: 5, breite: 4, arbeiten: ['zementestrich einbauen'],
    })
    expect(finde(p, /verlegen/)).toBeUndefined()
  })

  it('die Grenze ist der Estrich, nicht der Keller: derselbe Raum mit Belag bekommt seine Zeile', () => {
    const mit = lauf('boden_parkett', KELLER, keller(['zementestrich einbauen'])).positionen
    const ohne = lauf('boden_parkett', 'Keller fünf mal vier. Teppich verlegen.', keller(['teppich verlegen'])).positionen
    expect(finde(mit, /verlegen/)).toBeUndefined()
    expect(finde(ohne, /verlegen/)).toBeDefined()
  })
})
