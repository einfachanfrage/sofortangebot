// Fallbasis Richtung 100 — Batch PM-079 bis PM-088 (Prüfmeister, 15.09.2026)
//
// Zehn Fälle. Einer kommt von Engineering (der neue Fall aus CoS-E-059
// Eingriff 3), neun räumen die Spalte „offen" im Themenspeicher weiter ab:
//
//   Engineering · zwei verrauchte Räume, Isoliergrund nur auf dem ersten
//                                                          → PM-079
//   A · die Ursachenwörter lösen den Sperrgrund nicht aus   → PM-080
//   A · Erker (Zusatzfläche)                                → PM-081
//   A · Bodenluke / Revisionsklappe                         → PM-082
//   C · elektrische Heizmatte                               → PM-083
//   C · feuchter Untergrund, Sperrschicht nötig             → PM-084
//   D · runder Raum                                         → PM-085
//   D · Raum mit Podest                                     → PM-086
//   G · Kleinauftrag mit Anfahrt                            → PM-087
//   G · Kunde stellt Material selbst                        → PM-088
//
// Aufbau wie `pruefmeister-batch-69-77.test.ts`: über die Pipeline, Text
// einmal am Eingang normalisiert (K.2). Zu jedem Fund steht eine Kontrolle
// daneben — derselbe Satz ohne das fragliche Wort. Ohne Kontrolle ist ein
// Fund eine Behauptung.
//
// Dazu am Ende die Belege zu K.4 (Setzstufe beim Bodenbelag) als grüne
// Zusicherungen am Katalog: Die Entscheidung steht in
// `pruefmeister-themenspeicher.md`, die Zeilen hier halten sie fest.
//
// Fallbasis danach: 88 von 100.
//
// Prüfmeister · 15.09.2026
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '@/lib/positions-gewerk'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ersetzeZahlenWorte } from '../zahlen-parser'

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function laufVoll(gewerk: 'maler' | 'boden_parkett', transkript: string, raeume: any[]) {
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
  return pruefeUndErgaenzeVollstaendigkeit(gewerk, eng.positionen, text, meta as never, signale as never)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lauf = (g: 'maler' | 'boden_parkett', t: string, r: any[]) => laufVoll(g, t, r).positionen
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], m: RegExp) => pos.find(p => m.test(p.beschreibung))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function preis(pos: any[], m: RegExp, gewerk: string) {
  const p = finde(pos, m)
  if (!p) return null
  const g = gewerkFuerPosition(p.beschreibung, gewerk)
  return findePreisposition(p.beschreibung, p.einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))?.position.unit_price ?? null
}
const katalog = (titel: string) => DEFAULT_PRICES.find(p => p.title === titel)!.unit_price

const malerRaum = (name: string, l: number, b: number, h = 2.5) =>
  raum(name, { laenge: l, breite: b, hoehe: h, arbeiten: ['wände streichen', 'decke streichen'] })
const bodenRaum = (name: string, l: number, b: number) =>
  raum(name, { laenge: l, breite: b, belag: 'Vinyl' })

// ───────────────────────────────────────────────────────────────────────────
// PM-079 · Zwei verrauchte Räume — der Isoliergrund steht nur auf einem
//
// Von Engineering gemeldet, nicht heimlich mitrepariert (CoS-E-059,
// 15.09.2026): `pruefeWasserflecken` nimmt die ERSTE Wand- und die ERSTE
// Deckenposition. Bei zwei Räumen fehlt der zweite.
//
// Gemessen: Wohnzimmer 4×5 (Wand 45 m², Decke 20 m²), Schlafzimmer 3×4
// (Wand 35 m², Decke 12 m²). Soll 112 m², Ist 65 m² — 47 m² × 9,00 € =
// 423,00 € fehlen.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-079 · zwei verrauchte Räume', () => {
  const ZWEI_RAEUME = [malerRaum('Wohnzimmer', 4, 5), malerRaum('Schlafzimmer', 3, 4)]
  const T_BEIDE =
    'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen, alles verraucht, da muss Sperrgrund drauf. '
    + 'Schlafzimmer drei mal vier, Höhe zwo fünfzig, Wände und Decke streichen, auch verraucht.'

  it('PM-079-C · Kontrolle: bei EINEM Raum stimmt die Fläche', () => {
    const p = lauf('maler',
      'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen, alles verraucht, da muss Sperrgrund drauf.',
      [malerRaum('Wohnzimmer', 4, 5)])
    const iso = finde(p, /Isoliergrund/)
    expect(iso).toBeDefined()
    // Wandfläche 45 m² + Deckenfläche 20 m²
    expect(iso!.menge).toBe(65)
  })

  it('PM-079-D · Kontrolle: der Isoliergrund findet seinen Katalogpreis', () => {
    const p = lauf('maler',
      'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen, alles verraucht, da muss Sperrgrund drauf.',
      [malerRaum('Wohnzimmer', 4, 5)])
    expect(preis(p, /Isoliergrund/, 'maler')).toBe(katalog('Isoliergrund gegen Nikotin / Ruß / Wasserflecken'))
  })

  it.fails('PM-079-A · beide verrauchten Räume tragen den Isoliergrund', () => {
    const iso = finde(lauf('maler', T_BEIDE, ZWEI_RAEUME), /Isoliergrund/)
    expect(iso).toBeDefined()
    // 45 + 20 + 35 + 12 = 112 m². Ist: 65 m² — der zweite Raum fehlt.
    expect(iso!.menge).toBe(112)
  })

  it.fails('PM-079-B · der Auslöser im zweiten Satz meint auch den zweiten Raum', () => {
    // Schärfer als PM-079-A: Hier ist NUR das Schlafzimmer verraucht. Die
    // Regel legt den Isoliergrund trotzdem auf die Flächen des Wohnzimmers —
    // die Position steht auf dem falschen Raum, nicht bloß auf zu wenigen.
    const t =
      'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen. '
      + 'Schlafzimmer drei mal vier, Höhe zwo fünfzig, Wände und Decke streichen, total verraucht, da muss Sperrgrund drauf.'
    const iso = finde(lauf('maler', t, ZWEI_RAEUME), /Isoliergrund/)
    expect(iso).toBeDefined()
    // Schlafzimmer: Wand 35 m² + Decke 12 m² = 47 m². Ist: 65 m² (Wohnzimmer).
    expect(iso!.menge).toBe(47)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-080 · „Der Raum ist total verraucht" löst gar nichts aus
//
// Antwort auf die Frage von Engineering („fehlt euch ein Sperrwort?"): Es
// fehlt nicht ein Wort, es fehlt eine ganze Liste. `SPERR_AUSLOESER` kennt
// nur Wörter aus der Familie „sperren/Fleck". Die URSACHEN-Wörter — nikotin,
// ruß, rauch, verraucht, verqualmt, vergilbt, gelb, zigaretten — stehen in
// `URSACHE_BEIDE`, aber nicht im Auslöser. Sagt der Handwerker die Ursache
// und nicht das Mittel, entsteht WEDER eine Position NOCH ein Fehlt-Eintrag.
// Genau so redet aber ein Handwerker auf der Baustelle.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-080 · die Ursache allein löst den Sperrgrund nicht aus', () => {
  const T_URSACHE =
    'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen. '
    + 'Der Raum ist total verraucht, an der Decke ist alles gelb vom Nikotin.'

  it('PM-080-C · Kontrolle: mit dem Wort „Sperrgrund" entsteht die Position', () => {
    const p = lauf('maler',
      'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen. Der Raum ist total verraucht, da muss Sperrgrund drauf.',
      [malerRaum('Wohnzimmer', 4, 5)])
    expect(finde(p, /Isoliergrund/)).toBeDefined()
  })

  it.fails('PM-080-A · „total verraucht, alles gelb vom Nikotin" erzeugt den Isoliergrund', () => {
    const p = lauf('maler', T_URSACHE, [malerRaum('Wohnzimmer', 4, 5)])
    expect(finde(p, /Isoliergrund/)).toBeDefined()
  })

  it.fails('PM-080-B · und wenn schon keine Position, dann wenigstens die Rückfrage', () => {
    const r = laufVoll('maler', T_URSACHE, [malerRaum('Wohnzimmer', 4, 5)])
    expect(r.fehlende.some(f => /Isoliergrund/i.test(f))).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-081 · Erker — die gesagte Zusatzfläche verschwindet
// Themenspeicher A: „Erker (Zusatzfläche über 2,5 m²)".
// ───────────────────────────────────────────────────────────────────────────
describe('PM-081 · Erker', () => {
  const T = 'Wohnzimmer fünf mal vier, Höhe zwo fünfzig, Wände und Decke streichen. Da ist ein Erker mit drei Quadratmetern extra.'

  it('PM-081-C · Kontrolle: ohne den Erkersatz steht die Wandfläche auf 45 m²', () => {
    const p = lauf('maler', 'Wohnzimmer fünf mal vier, Höhe zwo fünfzig, Wände und Decke streichen.', [malerRaum('Wohnzimmer', 5, 4)])
    expect(finde(p, /Wand streichen/)!.menge).toBe(45)
  })

  it.fails('PM-081-A · die drei Quadratmeter Erker stehen in der Wandfläche', () => {
    const p = lauf('maler', T, [malerRaum('Wohnzimmer', 5, 4)])
    // Regel H Satz 1: gesagt → gerechnet. 45 + 3 = 48 m².
    expect(finde(p, /Wand streichen/)!.menge).toBe(48)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-082 · Bodenluke / Revisionsklappe
// Der Katalog führt die Zeile: `Bodentank / Revisionsdeckel passgenau
// ausschneiden`, 35,00 €/Stück. Gesagt wird sie, entstehen tut sie nicht.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-082 · Revisionsklappe im Boden', () => {
  const T = 'Flur vier mal zwei, Vinyl verlegen. Im Boden ist eine Revisionsklappe sechzig mal sechzig, die muss ausgespart und passgenau belegt werden.'

  it('PM-082-C · Kontrolle: die Katalogzeile gibt es', () => {
    expect(katalog('Bodentank / Revisionsdeckel passgenau ausschneiden')).toBe(35.0)
  })

  it.fails('PM-082-A · die gesagte Revisionsklappe wird eine Position', () => {
    const p = lauf('boden_parkett', T, [bodenRaum('Flur', 4, 2)])
    expect(finde(p, /Revisionsdeckel|Revisionsklappe|Bodentank/)).toBeDefined()
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-083 · Elektrische Heizmatte unter dem Belag
// Der Katalog führt `Aufpreis Fußbodenheizung Vinyl`, 4,00 €/m², und
// `Zuschlag Fußbodenheizung (CM-Messung, erhöhte Sorgfalt)`, 55,00 €
// pauschal. Beides ist Pflicht bei einer Heizmatte und entsteht nicht.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-083 · elektrische Heizmatte', () => {
  const T = 'Bad zwei mal drei, Vinyl verlegen, darunter kommt eine elektrische Heizmatte.'

  it('PM-083-C · Kontrolle: beide Katalogzeilen gibt es', () => {
    expect(katalog('Aufpreis Fußbodenheizung Vinyl')).toBe(4.0)
    expect(katalog('Zuschlag Fußbodenheizung (CM-Messung, erhöhte Sorgfalt)')).toBe(55.0)
  })

  it.fails('PM-083-A · die Heizmatte erzeugt den Aufpreis Fußbodenheizung', () => {
    const p = lauf('boden_parkett', T, [bodenRaum('Bad', 2, 3)])
    expect(finde(p, /Fußbodenheizung|Heizmatte/)).toBeDefined()
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-084 · Feuchter Untergrund, Sperrschicht nötig
// „Sperrschicht" steht beim Maler im Auslöser (`SPERR_AUSLOESER`) — beim
// Boden bewirkt dasselbe Wort nichts. Der Katalog hätte
// `Dampfbremse / PE-Folie verlegen (Feuchtigkeitsschutz)` 3,50 €/m² und
// `Epoxidharz-Feuchtigkeitssperre zweilagig` 24,00 €/m².
// ───────────────────────────────────────────────────────────────────────────
describe('PM-084 · feuchter Untergrund', () => {
  const T = 'Keller fünf mal vier, Vinyl verlegen. Der Untergrund ist feucht, da muss eine Sperrschicht drunter.'

  it('PM-084-C · Kontrolle: der Belag selbst wird gerechnet und bepreist', () => {
    const p = lauf('boden_parkett', T, [bodenRaum('Keller', 5, 4)])
    expect(finde(p, /Vinyl-Boden verlegen/)!.menge).toBe(21)
    expect(preis(p, /Vinyl-Boden verlegen/, 'boden_parkett')).not.toBeNull()
  })

  it.fails('PM-084-A · „Sperrschicht" beim feuchten Untergrund erzeugt eine Position', () => {
    const p = lauf('boden_parkett', T, [bodenRaum('Keller', 5, 4)])
    expect(finde(p, /Sperrschicht|Dampfbremse|Feuchtigkeitssperre|PE-Folie/)).toBeDefined()
  })

  it.fails('PM-084-B · mindestens die CM-Messung wird angeboten', () => {
    const p = lauf('boden_parkett', T, [bodenRaum('Keller', 5, 4)])
    expect(finde(p, /Feuchtemessung|CM-Messung/)).toBeDefined()
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-085 · Runder Raum — das Angebot bleibt leer
// Der schwerste Fund dieses Batches: Durchmesser gesagt, kein einziger
// Posten. Nicht eine falsche Zahl, sondern gar keine.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-085 · runder Raum', () => {
  const T = 'Der Raum ist rund, Durchmesser vier Meter, Höhe zwo fünfzig, Wände und Decke streichen.'

  it('PM-085-C · Kontrolle: derselbe Raum rechteckig ergibt Positionen', () => {
    const p = lauf('maler', 'Der Raum ist vier mal vier, Höhe zwo fünfzig, Wände und Decke streichen.', [malerRaum('Raum', 4, 4)])
    expect(p.length).toBeGreaterThan(0)
  })

  it.fails('PM-085-A · der runde Raum erzeugt überhaupt Positionen', () => {
    const p = lauf('maler', T, [raum('Raum', { laenge: null, breite: null, hoehe: 2.5, arbeiten: ['wände streichen', 'decke streichen'] })])
    expect(p.length).toBeGreaterThan(0)
  })

  it.fails('PM-085-B · Wandfläche = Umfang × Höhe = π × 4 m × 2,5 m', () => {
    const p = lauf('maler', T, [raum('Raum', { laenge: null, breite: null, hoehe: 2.5, arbeiten: ['wände streichen', 'decke streichen'] })])
    const wand = finde(p, /Wand streichen/)
    expect(wand).toBeDefined()
    expect(wand!.menge).toBeCloseTo(31.42, 1)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-086 · Raum mit Podest
// ───────────────────────────────────────────────────────────────────────────
describe('PM-086 · Podest im Raum', () => {
  const T = 'Wohnzimmer fünf mal vier, Vinyl verlegen. Da ist ein Podest zwei mal eins, zwanzig Zentimeter hoch, das wird mit belegt.'

  it('PM-086-C · Kontrolle: die Grundfläche stimmt', () => {
    const p = lauf('boden_parkett', T, [bodenRaum('Wohnzimmer', 5, 4)])
    // 20 m² + 5 % Verschnitt
    expect(finde(p, /Vinyl-Boden verlegen/)!.menge).toBe(21)
  })

  it.fails('PM-086-A · das Podest steht als eigene Fläche oder Position im Angebot', () => {
    const p = lauf('boden_parkett', T, [bodenRaum('Wohnzimmer', 5, 4)])
    expect(finde(p, /Podest|Stufe/)).toBeDefined()
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-087 · Kleinauftrag mit Anfahrt
// Der Katalog führt `Anfahrt pauschal (bis 20 km)` 45,00 € und
// `Anfahrt je Kilometer (ab 20 km)` 0,50 €/km. Bei vierzig gesagten
// Kilometern wären das 45,00 + 20 × 0,50 = 55,00 €. Auf einem Auftrag von
// rund 155,00 € ist das gut ein Drittel.
//
// Nicht Gegenstand dieses Falls: der Mindestauftragswert. Den regelt
// `mindestauftragsPosition()` aus den Firmeneinstellungen, nicht der Katalog.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-087 · Kleinauftrag mit Anfahrt', () => {
  const T = 'Nur die Gästetoilette, ein Komma fünf mal ein Komma zwei, Höhe zwo fünfzig, Wände streichen. Anfahrt Hamburg, gute vierzig Kilometer.'

  it('PM-087-C · Kontrolle: beide Anfahrt-Zeilen gibt es im Katalog', () => {
    expect(katalog('Anfahrt pauschal (bis 20 km)')).toBe(45.0)
    expect(katalog('Anfahrt je Kilometer (ab 20 km)')).toBe(0.5)
  })

  it.fails('PM-087-A · die gesagte Anfahrt wird eine Position', () => {
    const p = lauf('maler', T, [raum('Gäste-WC', { laenge: 1.5, breite: 1.2, hoehe: 2.5, arbeiten: ['wände streichen'] })])
    expect(finde(p, /Anfahrt|Fahrt/)).toBeDefined()
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-088 · Kunde stellt Material selbst
// Dieselbe Grenze wie PM-059: `preis-ableitung.ts` kennt den Schalter `wahl`,
// `materialanteil.ts` gibt ihn nicht her. Hier von der Sprachseite gemessen —
// der Satz kommt gar nicht erst an.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-088 · Kunde stellt Material selbst', () => {
  const T = 'Wohnzimmer fünf mal vier, Höhe zwo fünfzig, Wände und Decke streichen. Die Farbe stellt der Kunde selbst.'

  it('PM-088-C · Kontrolle: ohne den Satz sind es dieselben Positionen', () => {
    const ohne = lauf('maler', 'Wohnzimmer fünf mal vier, Höhe zwo fünfzig, Wände und Decke streichen.', [malerRaum('Wohnzimmer', 5, 4)])
    const mit = lauf('maler', T, [malerRaum('Wohnzimmer', 5, 4)])
    expect(mit.map(p => p.beschreibung)).toEqual(ohne.map(p => p.beschreibung))
  })

  it.fails('PM-088-A · „die Farbe stellt der Kunde selbst" hinterlässt eine Spur', () => {
    const r = laufVoll('maler', T, [malerRaum('Wohnzimmer', 5, 4)])
    const spur =
      r.positionen.some(p => /bauseits|ohne Material|Kunde stellt/i.test(p.beschreibung))
      || r.fehlende.some(f => /bauseits|Material/i.test(f))
    expect(spur).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// K.4 — die Belege zur Antwort (Setzstufe beim Bodenbelag)
//
// Antwort: Die Setzstufe steckt im Stufenpreis. Die zweite Zeile muss WEG,
// nicht einen Preis bekommen. Begründet am Katalog selbst — dort, wo eine
// Setzstufe eigens bezahlt wird, führt der Katalog sie eigens auf.
// ───────────────────────────────────────────────────────────────────────────
describe('K.4 · Setzstufe beim Bodenbelag steckt im Stufenpreis', () => {
  it('K.4-A · der Bodenkatalog kennt je Belag genau EINE Stufenzeile', () => {
    const stufen = DEFAULT_PRICES.filter(p => p.category.startsWith('Boden') && /Treppenstufe/i.test(p.title) && !/Zuschlag/i.test(p.title))
    // Vinyl, Laminat, Linoleum, Teppich, dazu die belagsoffene Zeile.
    expect(stufen.map(s => s.title).sort()).toEqual([
      'Laminat auf Treppenstufen verlegen',
      'Linoleum auf Treppenstufen verlegen',
      'Teppich auf Treppenstufen verlegen',
      'Treppenstufe mit Belag belegen (schwimmend / geklebt)',
      'Vinyl auf Treppenstufen kleben',
    ])
  })

  it('K.4-B · und KEINE einzige Setzstufenzeile im Bodenkatalog', () => {
    const setz = DEFAULT_PRICES.filter(p => p.category.startsWith('Boden') && /Setzstufe/i.test(p.title))
    expect(setz).toEqual([])
  })

  it('K.4-C · wo die Setzstufe eigens bezahlt wird, führt der Katalog sie eigens auf', () => {
    // Naturstein und Schreiner trennen Tritt- und Setzstufe ausdrücklich.
    expect(katalog('Naturstein Treppenstufe verlegen')).toBe(75.0)
    expect(katalog('Naturstein Treppensockel / Setzstufe verlegen')).toBe(45.0)
    expect(katalog('Setzstufe montieren / ersetzen')).toBe(120.0)
  })

  it('K.4-D · der Fliesenkatalog sagt die Regel sogar im Titel', () => {
    expect(katalog('Treppenstufe fliesen (inkl. Setz- und Trittstufe)')).toBe(55.0)
  })

  it('K.4-E · der Stufenpreis ist ein Stückpreis, kein Flächenpreis', () => {
    // Eine Vinyl-Trittstufe misst rund 0,27 m². Zum Flächenpreis wären das
    // 4,32 €. Der Stückpreis liegt bei 55,00 € — er bezahlt die Stufe als
    // Bauteil, nicht ihren Grundriss. Deshalb trägt er die Setzstufe mit.
    expect(katalog('Vinyl auf Treppenstufen kleben')).toBe(55.0)
    expect(katalog('Klick-Vinyl (LVT) verlegen schwimmend, Standard')).toBe(16.0)
  })

  it.fails('K.4-F · PM-066: vierzehn Stufen ergeben EINE Stufenposition, nicht zwei', () => {
    const p = lauf('boden_parkett',
      'Treppenhaus, vierzehn Stufen, Vinyl geklebt.',
      [raum('Treppenhaus', { laenge: 3.5, breite: 0.9, belag: 'Vinyl' })])
    const stufen = p.filter(x => /stufen/i.test(x.beschreibung))
    expect(stufen).toHaveLength(1)
  })

  it.fails('K.4-G · PM-066: und diese eine Position findet ihren Preis', () => {
    const p = lauf('boden_parkett',
      'Treppenhaus, vierzehn Stufen, Vinyl geklebt.',
      [raum('Treppenhaus', { laenge: 3.5, breite: 0.9, belag: 'Vinyl' })])
    expect(preis(p, /Trittstufen belegen|Treppenstufe/, 'boden_parkett')).toBe(katalog('Vinyl auf Treppenstufen kleben'))
  })

  it.fails('K.4-H · PM-066: die gesagte Treppennase entsteht (22,00 €/Stück im Katalog)', () => {
    // `pruefeTreppenBoden` hört auf „kantenprofil", „treppenkante",
    // „rutschhemmend" — aber nicht auf „Treppennase", obwohl der Katalog die
    // Zeile genau so führt.
    expect(katalog('Treppennase / Kantenprofil Treppe montieren')).toBe(22.0)
    const p = lauf('boden_parkett',
      'Treppenhaus, vierzehn Stufen, Vinyl geklebt, Treppennase soll auch gemacht werden.',
      [raum('Treppenhaus', { laenge: 3.5, breite: 0.9, belag: 'Vinyl' })])
    expect(finde(p, /Treppennase|Kantenprofil/)).toBeDefined()
  })
})
