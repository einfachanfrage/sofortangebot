// Fallbasis Richtung 100 — Batch PM-089 bis PM-097 (Prüfmeister, 16.09.2026)
//
// Neun Fälle. Sie räumen die Spalte „offen" im Themenspeicher genau dort ab,
// wo sie ohne die laufende App prüfbar ist — die acht Zeilen aus der
// Arbeitsreihenfolge plus der Erker-Nachbar „Wandnische außerhalb des Bades":
//
//   A · Regalnische außerhalb des Bades                     → PM-089
//   B · bewohnte Baustelle: Staubschutzwand, Abendreinigung → PM-090
//   C · Estrich rissig, muss verharzt werden                → PM-091
//   E · Handwerker nennt den Preis selbst                   → PM-092
//   E · Handwerker nennt Stunden statt Mengen               → PM-093
//   E · sehr kurze Aufnahme                                 → PM-094
//   E · widersprüchliche Angaben im selben Diktat           → PM-095
//   G · Nachtrag zu einem bestehenden Angebot               → PM-096
//   G · zwei Bauabschnitte, getrennte Angebote              → PM-097
//
// Aufbau wie `pruefmeister-batch-79-88.test.ts`: über die Pipeline, Text
// einmal am Eingang normalisiert (K.2). Zu jedem Fund steht eine Kontrolle
// daneben — derselbe Satz ohne das fragliche Wort, oder der Katalogtreffer
// unter dem genauen Titel. Ohne Kontrolle ist ein Fund eine Behauptung.
//
// Zwei Dinge sind in diesem Batch neu und gehören gelesen, bevor jemand
// einen Fall als „Kleinigkeit" einsortiert:
//
//   * PM-093 und PM-094 liefern ein Angebot, das NICHTS von dem enthält,
//     was gesagt wurde. Bei PM-094 besteht das ganze Angebot aus einer
//     einzigen Zeile, die NIE jemand gesagt hat — und die trägt einen Preis.
//   * PM-092 und PM-095 setzen eine Zahl aufs Kundenpapier, die der
//     Handwerker so nicht gesagt hat, wortlos und ohne Rückfrage.
//
// Die Katalogzeilen zu PM-090, PM-091 und PM-093 EXISTIEREN und werden unter
// ihrem genauen Titel auch gefunden (Kontrollen -D). Die Lücke liegt also
// nicht im Katalog, sondern davor: Es entsteht keine Position, die danach
// suchen könnte. Ausnahme PM-089 — dort ist es wirklich der Katalog.
//
// Fallbasis danach: 97 von 100.
//
// Prüfmeister · 16.09.2026
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
const fehltHat = (f: string[], m: RegExp) => f.some(x => m.test(x))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function preis(pos: any[], m: RegExp, gewerk: string) {
  const p = finde(pos, m)
  if (!p) return null
  const g = gewerkFuerPosition(p.beschreibung, gewerk)
  return findePreisposition(p.beschreibung, p.einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))?.position.unit_price ?? null
}
const katalog = (titel: string) => DEFAULT_PRICES.find(p => p.title === titel)!.unit_price
const trefferIm = (titel: string, einheit: string, gewerk: string | null) => {
  const liste = gewerk ? KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, gewerk)) : KATALOG
  return findePreisposition(titel, einheit, liste)?.position ?? null
}

const malerRaum = (name: string, l: number, b: number, h = 2.5) =>
  raum(name, { laenge: l, breite: b, hoehe: h, arbeiten: ['wände streichen', 'decke streichen'] })
const wandRaum = (name: string, l: number, b: number, h = 2.5) =>
  raum(name, { laenge: l, breite: b, hoehe: h, arbeiten: ['wände streichen'] })
const bodenRaum = (name: string, l: number, b: number) =>
  raum(name, { laenge: l, breite: b, belag: 'Vinyl' })

// ───────────────────────────────────────────────────────────────────────────
// PM-089 · Regalnische außerhalb des Bades
//
// Der Themenspeicher führt „Wandnische im Bad, gefliest" als PM-075 und
// „Wandnische / Regalnische" getrennt als offen. Zu Recht: Im Bad gibt es
// eine eigene Katalogzeile (Fliesen, 95,00 €/Stück), im Wohnzimmer nicht.
//
// Gemessen: Der Nischensatz ändert NICHTS — nicht die Wandfläche, nicht die
// Positionen, nicht die Fehlt-Liste. Der Satz mit Nische und der Satz ohne
// Nische liefern Zeile für Zeile dasselbe Angebot.
//
// Anders als PM-090/091/093 ist das hier WIRKLICH eine Katalog-Lücke, wie
// PM-076 (Rollladenkästen): Der Malerkatalog kennt fürs Streichen einer
// Nische keine Zeile, nur fürs Tapezieren (6,00 €/lfdm Aufpreis). Solange
// die Zeile fehlt, ist die richtige Antwort ein Fehlt-Eintrag — nicht eine
// erfundene bepreiste Position (Regel K.5).
// ───────────────────────────────────────────────────────────────────────────
describe('PM-089 · Regalnische außerhalb des Bades', () => {
  const T_NISCHE =
    'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen, '
    + 'da ist eine Regalnische in der Wand, ein Meter zwanzig breit, die muss mit gestrichen werden.'
  const T_OHNE = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen.'

  it('PM-089-C · Kontrolle: ohne Nischensatz stehen vier Zeilen, Wand 45 m²', () => {
    const p = lauf('maler', T_OHNE, [malerRaum('Wohnzimmer', 4, 5)])
    expect(finde(p, /Wand streichen/)!.menge).toBe(45)
    expect(p).toHaveLength(4)
  })

  it('PM-089-D · Kontrolle: der Malerkatalog kennt die Nische NUR beim Tapezieren', () => {
    // Katalog-Lücke, nicht Code — wie PM-076. Fürs Fliesen gibt es die Zeile
    // (95,00 €/Stück, PM-075), fürs Streichen nicht.
    expect(katalog('Ecken / Nischen / Laibungen tapezieren (Aufpreis)')).toBe(6)
    expect(katalog('Nische / Wandnische fliesen')).toBe(95)
    const malerNischen = DEFAULT_PRICES.filter(
      p => /^Maler/.test(p.category) && /nische/i.test(p.title) && /streich|anstrich/i.test(p.title))
    expect(malerNischen).toHaveLength(0)
  })

  // Grün seit dem PM-089-Fix (17.09.2026, Engineering): `pruefeNische` legt
  // einen Fehlt-Eintrag an. Eine bepreiste Position entsteht bewusst nicht —
  // der Malerkatalog führt fürs Streichen keine Zeile (PM-089-D).
  it('PM-089-A · die gesagte Nische hinterlässt überhaupt eine Spur', () => {
    const erg = laufVoll('maler', T_NISCHE, [malerRaum('Wohnzimmer', 4, 5)])
    const mitNische = finde(erg.positionen, /Nische/) != null
    const inFehlt = fehltHat(erg.fehlende, /Nische/i)
    expect(mitNische || inFehlt).toBe(true)
  })

  // UMGESTELLT am 17.09.2026 (Prüfmeister — Antwort auf Engineerings Frage 1).
  //
  // Der Widerspruch lag bei mir, nicht bei Engineering: -B verlangte eine
  // andere POSITIONSLISTE, PM-108-D verlangt ausdrücklich dieselbe. Beides
  // zugleich ginge nur mit einer erfundenen oder einer 0,00-€-Zeile — genau
  // das, was K.5 verbietet.
  //
  // Die Positionsliste war nie das Ziel, sie war mein Behelf: Als ich -B
  // schrieb, gab es die Fehlt-Liste als Ablage für „gesagt, aber nicht
  // bepreisbar" noch nicht. Jetzt gibt es sie, also misst -B dort.
  //
  // Und -B ist damit NICHT dasselbe wie -A: -A verlangt, dass überhaupt eine
  // Spur da ist. -B verlangt, dass diese Spur vom NISCHENSATZ kommt — der
  // gleiche Satz ohne Nische darf sie nicht erzeugen. Ohne diese Gegenprobe
  // wäre -A auch dann grün, wenn die Fehlt-Liste aus einem anderen Grund
  // etwas mit „Nische" enthielte.
  //
  // PM-108-D bleibt unangetastet und grün: die Positionsliste ändert sich
  // weiterhin nicht, und das ist richtig so, solange die Katalogzeile fehlt.
  it('PM-089-B · und diese Spur kommt vom Nischensatz, nicht von woanders', () => {
    const mit = laufVoll('maler', T_NISCHE, [malerRaum('Wohnzimmer', 4, 5)])
    const ohne = laufVoll('maler', T_OHNE, [malerRaum('Wohnzimmer', 4, 5)])
    expect(fehltHat(mit.fehlende, /Nische/i)).toBe(true)
    expect(fehltHat(ohne.fehlende, /Nische/i)).toBe(false)
    expect(mit.fehlende).not.toEqual(ohne.fehlende)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-090 · Bewohnte Baustelle: Staubschutzwand und Abendreinigung
//
// „Bewohnt" allein funktioniert — Möbel abdecken und Erschwerniszuschlag
// entstehen (Kontrolle -C). Die beiden Leistungen, die eine bewohnte
// Baustelle darüber hinaus teuer machen, entstehen NICHT:
//
//   Staubschutzwand → Katalogzeile im Abbruch-Gewerk (14,00 €/m²).
//                     Abbruch ist gesperrt ⇒ nichts Bepreistes bauen,
//                     sondern Fehlt-Eintrag (Regel K.5, wie PM-072/075).
//   Abendreinigung  → „Endreinigung Fenster / Böden", 45,00 €/Stunde, und
//                     zwar im AKTIVEN Malerkatalog. Trotzdem nichts.
//
// Warnung an Engineering (gehört in CoS-E-068 Zug 2, nicht in Zug 3):
// `gewerkFuerPosition('Staubschutzwand stellen', 'maler')` liefert 'maler'.
// Wer hier eine Position baut, statt einen Fehlt-Eintrag zu setzen, bekommt
// eine Zeile, die im Malerkatalog keinen Preis findet — also 0,00 € auf dem
// Kundenpapier, das PM-066-Muster. Erst Fehlt-Eintrag, dann Katalog.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-090 · bewohnte Baustelle', () => {
  const RAUM = [malerRaum('Wohnzimmer', 4, 5)]
  const T_BEWOHNT = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen. Die Wohnung ist bewohnt.'
  const T_VOLL =
    'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen. Die Wohnung ist bewohnt, '
    + 'wir brauchen eine Staubschutzwand zum Flur, und jeden Abend muss besenrein gereinigt werden.'

  it('PM-090-C · Kontrolle: „bewohnt" allein wirkt — Möbel und Zuschlag entstehen', () => {
    const p = lauf('maler', T_BEWOHNT, RAUM)
    expect(finde(p, /Möbel abdecken/)).toBeDefined()
    expect(finde(p, /Erschwerniszuschlag bewohnt/)).toBeDefined()
    expect(p).toHaveLength(6)
  })

  it('PM-090-D · Kontrolle: beide Katalogzeilen gibt es und beide werden gefunden', () => {
    expect(katalog('Staubschutzwand / Trennwand zu angrenzenden Bereichen')).toBe(14)
    expect(katalog('Endreinigung Fenster / Böden')).toBe(45)
    // Die Reinigung liegt im AKTIVEN Malergewerk und ist von dort erreichbar.
    expect(trefferIm('Endreinigung Fenster / Böden', 'Stunde', 'maler')?.unit_price).toBe(45)
    // Die Staubschutzwand liegt im gesperrten Abbruch-Gewerk — vom Maler aus
    // gibt es sie nicht. Genau deshalb Fehlt-Eintrag statt Position.
    expect(trefferIm('Staubschutzwand / Trennwand zu angrenzenden Bereichen', 'm²', 'maler')).toBeNull()
    expect(gewerkFuerPosition('Staubschutzwand stellen', 'maler')).toBe('maler')
  })

  it('PM-090-E · Kontrolle: die zwei Zusatzsätze ändern am Angebot nichts', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const abbild = (ps: any[]) => ps.map(p => `${p.beschreibung}|${p.menge}`).join('\n')
    expect(abbild(lauf('maler', T_VOLL, RAUM))).toBe(abbild(lauf('maler', T_BEWOHNT, RAUM)))
  })

  // Grün seit dem PM-090-Fix (17.09.2026, Engineering): `pruefeStaubschutzwand`
  // und `pruefeBaustellenreinigung` legen je einen Fehlt-Eintrag an. Bepreiste
  // Positionen entstehen bewusst nicht — die Wand ist vom Maler aus gesperrt
  // (PM-090-D), und bei der Reinigung fehlt die Menge, nicht der Preis.
  it('PM-090-A · die gesagte Staubschutzwand steht in der Fehlt-Liste', () => {
    const erg = laufVoll('maler', T_VOLL, RAUM)
    expect(fehltHat(erg.fehlende, /staubschutz|trennwand/i)).toBe(true)
  })

  it('PM-090-B · die gesagte Abendreinigung wird Position oder Fehlt-Eintrag', () => {
    const erg = laufVoll('maler', T_VOLL, RAUM)
    const alsPosition = finde(erg.positionen, /reinigung/i) != null
    const alsFehlt = fehltHat(erg.fehlende, /reinigung|besenrein/i)
    expect(alsPosition || alsFehlt).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-091 · Rissiger Estrich, muss verharzt werden
//
// Gemessen: „Der Estrich hat Risse, so acht Meter insgesamt, die müssen
// verharzt und verklammert werden" erzeugt WEDER eine Position NOCH einen
// Fehlt-Eintrag. Das Angebot besteht aus der Belagszeile und sonst nichts.
//
// Die Katalogzeile heißt fast wörtlich so, liegt im AKTIVEN Bodengewerk und
// wird unter ihrem Titel auch gefunden (Kontrolle -D):
// „Estrichriss kraftschlüssig verharzen und verklammern", 18,00 €/lfdm.
//
// Geld: 8 lfdm × 18,00 € = 144,00 €, die niemand berechnet — bei einer
// Vorarbeit, die ohne Ausführung den ganzen neuen Belag gefährdet.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-091 · rissiger Estrich', () => {
  const RAUM = [bodenRaum('Wohnzimmer', 4, 5)]
  const T_RISS =
    'Wohnzimmer vier mal fünf, Vinyl verlegen. Der Estrich hat Risse, so acht Meter insgesamt, '
    + 'die müssen verharzt und verklammert werden.'
  const T_OHNE = 'Wohnzimmer vier mal fünf, Vinyl verlegen.'

  it('PM-091-C · Kontrolle: ohne Risse steht genau die Belagszeile, 21 m²', () => {
    const p = lauf('boden_parkett', T_OHNE, RAUM)
    expect(p).toHaveLength(1)
    expect(finde(p, /Vinyl/)!.menge).toBe(21)
  })

  it('PM-091-D · Kontrolle: die Katalogzeile gibt es und sie wird gefunden', () => {
    expect(katalog('Estrichriss kraftschlüssig verharzen und verklammern')).toBe(18)
    expect(trefferIm('Estrichriss kraftschlüssig verharzen und verklammern', 'lfdm', 'boden_parkett')?.unit_price).toBe(18)
  })

  it.fails('PM-091-A · die gesagten Risse werden eine Position über 8 lfdm', () => {
    const p = lauf('boden_parkett', T_RISS, RAUM)
    const riss = finde(p, /riss/i)
    expect(riss).toBeDefined()
    expect(riss!.menge).toBe(8)
  })

  it.fails('PM-091-B · und wenn schon keine Position, dann wenigstens der Fehlt-Eintrag', () => {
    const erg = laufVoll('boden_parkett', T_RISS, RAUM)
    expect(fehltHat(erg.fehlende, /riss|verharz/i)).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-092 · Der Handwerker nennt den Preis selbst
//
// „das mach ich für zwölf Euro den Quadratmeter" — gemessen: Die Zahl wird
// vollständig verworfen. Das Angebot rechnet mit dem Katalogpreis
// 16,00 €/m² (Klick-Vinyl Standard) weiter, ohne Zeile, ohne Rückfrage,
// ohne Hinweis.
//
// Geld: 21 m² × 16,00 € = 336,00 € statt 21 m² × 12,00 € = 252,00 €.
// Auf dem Kundenpapier steht also ein Preis, den der Handwerker so nie
// gesagt hat — 84,00 € über seinem eigenen Wort. Das ist die gefährlichere
// Richtung des Fehlers: Er merkt es erst, wenn der Kunde ihn darauf
// festnagelt.
//
// Ein Positivbefund daneben: Die „zwölf" wandert NICHT ins Aufmaß (21 m²
// bleiben 21 m²). Der Zahlenparser hält sie korrekt aus den Maßen heraus.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-092 · Handwerker nennt den Preis selbst', () => {
  const RAUM = [bodenRaum('Wohnzimmer', 4, 5)]
  const T_PREIS = 'Wohnzimmer vier mal fünf, Vinyl verlegen, das mach ich für zwölf Euro den Quadratmeter.'

  it('PM-092-C · Kontrolle: die gesagte Zahl verfälscht das Aufmaß NICHT', () => {
    const p = lauf('boden_parkett', T_PREIS, RAUM)
    // 20 m² + 5 % Verschnitt = 21 m² — die „zwölf" ist kein Maß geworden.
    expect(finde(p, /Vinyl/)!.menge).toBe(21)
  })

  it('PM-092-D · Kontrolle: gerechnet wird mit dem Katalogpreis, nicht mit dem gesagten', () => {
    expect(preis(lauf('boden_parkett', T_PREIS, RAUM), /Vinyl/, 'boden_parkett')).toBe(16)
  })

  it.fails('PM-092-A · der gesagte Preis hinterlässt eine Spur', () => {
    const erg = laufVoll('boden_parkett', T_PREIS, RAUM)
    const inFehlt = fehltHat(erg.fehlende, /preis|euro|12/i)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const amPosten = (erg.positionen as any[]).some(p => p.einzelpreis === 12 || p.gesagter_preis === 12)
    expect(inFehlt || amPosten).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-093 · Der Handwerker nennt Stunden statt Mengen
//
// „Wohnzimmer streichen, das sind ungefähr sechs Stunden für den Gesellen."
//
// Gemessen: NULL Positionen, NULL Fehlt-Einträge. Das Angebot ist leer, und
// es sagt auch nicht, dass es leer ist — dasselbe Muster wie PM-085 beim
// runden Raum, nur ausgelöst durch die Sprache statt durch die Geometrie.
//
// Der Katalog wäre bereit: „Regiearbeit Geselle", 65,00 €/Stunde, im
// aktiven Malergewerk, unter dem Titel auffindbar (Kontrolle -D).
// 6 × 65,00 € = 390,00 €.
//
// So redet ein Handwerker bei Kleinaufträgen fast immer. Wer nur in Mengen
// hört, hört ihn bei jedem zweiten Kleinauftrag nicht.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-093 · Stunden statt Mengen', () => {
  const T_STUNDEN = 'Wohnzimmer streichen, das sind ungefähr sechs Stunden für den Gesellen.'
  const RAUM = [raum('Wohnzimmer', { arbeiten: ['wände streichen'] })]

  it('PM-093-C · Kontrolle: mit einem Maß entstehen sehr wohl Positionen', () => {
    const p = lauf('maler', 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen.', [wandRaum('Wohnzimmer', 4, 5)])
    expect(finde(p, /Wand streichen/)!.menge).toBe(45)
  })

  it('PM-093-D · Kontrolle: die Stundenzeile gibt es im aktiven Malerkatalog', () => {
    expect(katalog('Regiearbeit Geselle')).toBe(65)
    expect(trefferIm('Regiearbeit Geselle', 'Stunde', 'maler')?.unit_price).toBe(65)
  })

  it.fails('PM-093-A · die gesagten sechs Stunden werden eine Position', () => {
    const p = lauf('maler', T_STUNDEN, RAUM)
    const std = finde(p, /stunde|regie/i)
    expect(std).toBeDefined()
    expect(std!.menge).toBe(6)
  })

  it.fails('PM-093-B · und das leere Angebot sagt wenigstens, dass es leer ist', () => {
    const erg = laufVoll('maler', T_STUNDEN, RAUM)
    // Gemessen: positionen = [] UND fehlende = []. Beides leer ist der
    // schlimmste der beiden möglichen Fehler.
    expect(erg.positionen.length + erg.fehlende.length).toBeGreaterThan(0)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-094 · Sehr kurze Aufnahme
//
// „Wohnzimmer streichen, zwanzig Quadrat." — die kürzeste Aufnahme, die auf
// einer Baustelle wirklich vorkommt.
//
// Gemessen, und das ist der härteste Befund dieses Batches: Das Angebot
// besteht aus GENAU EINER Zeile — „Boden schützen, 20 m²" — und die hat
// niemand gesagt. Sie trägt `automatisch_ergaenzt` UND findet ihren Preis
// (1,20 €/m² = 24,00 €). Das Gestrichene, das der Handwerker als Einziges
// genannt hat, fehlt vollständig.
//
// Zwei Regeln auf einmal verletzt:
//   * „Nichts erfinden" (H, entschieden am 12.09.): Die einzige Zeile auf
//     dem Papier ist erfunden.
//   * K.4/K.5 mit PM-077: `automatisch_ergaenzt` und „bepreist" schließen
//     einander aus. Hier trifft beides auf dieselbe Zeile zu.
//
// Der Grund ist harmlos und die Wirkung nicht: Ohne Höhe lässt sich keine
// Wandfläche rechnen. Die richtige Antwort darauf ist die Rückfrage nach
// der Höhe — nicht ein Angebot über 24,00 € Bodenschutz.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-094 · sehr kurze Aufnahme', () => {
  const T_KURZ = 'Wohnzimmer streichen, zwanzig Quadrat.'
  const RAUM = [raum('Wohnzimmer', { flaeche: 20, arbeiten: ['wände streichen'] })]

  it('PM-094-C · Kontrolle: so sieht das Angebot heute aus — eine erfundene Zeile', () => {
    const erg = laufVoll('maler', T_KURZ, RAUM)
    expect(erg.positionen).toHaveLength(1)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const einzige = erg.positionen[0] as any
    expect(einzige.beschreibung).toMatch(/Boden schützen/)
    expect(einzige.automatisch_ergaenzt).toBe(true)
    expect(preis(erg.positionen, /Boden schützen/, 'maler')).toBe(1.2)
  })

  it('PM-094-D · Kontrolle: mit Höhe entsteht die Wandzeile sofort', () => {
    const p = lauf('maler', 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen.', [wandRaum('Wohnzimmer', 4, 5)])
    expect(finde(p, /Wand streichen/)).toBeDefined()
  })

  it.fails('PM-094-A · das gesagte Streichen steht im Angebot', () => {
    expect(finde(lauf('maler', T_KURZ, RAUM), /streichen/i)).toBeDefined()
  })

  it.fails('PM-094-B · oder die fehlende Höhe wird erfragt', () => {
    const erg = laufVoll('maler', T_KURZ, RAUM)
    expect(fehltHat(erg.fehlende, /höhe|hoehe|streichen/i)).toBe(true)
  })

  it.fails('PM-094-E · die einzige Zeile des Angebots ist nicht zugleich erfunden und bepreist', () => {
    // Die Regel aus K.4/K.5 (mit PM-077) auf den Extremfall angewandt.
    const erg = laufVoll('maler', T_KURZ, RAUM)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const erfundenUndBepreist = (erg.positionen as any[]).filter(
      p => p.automatisch_ergaenzt === true && preis(erg.positionen, new RegExp(p.beschreibung.split(' —')[0]), 'maler') != null)
    expect(erfundenUndBepreist).toHaveLength(0)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-095 · Widersprüchliche Angaben im selben Diktat
//
// „Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen. Das
// Wohnzimmer hat dreißig Quadratmeter Wandfläche."
//
// 4 × 5 bei 2,50 m ergibt 45 m² Wandfläche. Gesagt werden danach 30 m².
// Gemessen: Die zweite Zahl gewinnt wortlos. Keine Rückfrage, kein Hinweis,
// kein Fehlt-Eintrag — das Angebot steht auf 30 m².
//
// Geld: 15 m² × 9,50 € = 142,50 €, die der Handwerker verliert, weil eine
// von zwei widersprüchlichen Zahlen stillschweigend gewinnt. Dass die
// spätere Zahl gewinnt, ist sogar vertretbar (Selbstkorrektur, PM-001);
// dass sie ohne ein Wort gewinnt, ist es nicht: Der Widerspruch ist genau
// die Stelle, an der ein Mensch hinschauen muss.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-095 · widersprüchliche Angaben', () => {
  const RAUM = [wandRaum('Wohnzimmer', 4, 5)]
  const T_WIDER =
    'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen. '
    + 'Das Wohnzimmer hat dreißig Quadratmeter Wandfläche.'
  const T_OHNE = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen.'

  it('PM-095-C · Kontrolle: ohne den Widerspruch rechnet die Geometrie 45 m²', () => {
    expect(finde(lauf('maler', T_OHNE, RAUM), /Wand streichen/)!.menge).toBe(45)
  })

  it('PM-095-D · Kontrolle: mit dem Widerspruch gewinnt die gesagte Zahl — 30 m²', () => {
    // Kein Fund, sondern die Messung: So verhält es sich heute. 15 m² × 9,50 €
    // = 142,50 € Unterschied.
    expect(finde(lauf('maler', T_WIDER, RAUM), /Wand streichen/)!.menge).toBe(30)
    expect(katalog('Wand streichen 2x Anstrich')).toBe(9.5)
  })

  it.fails('PM-095-A · der Widerspruch erzeugt eine Rückfrage oder einen Hinweis', () => {
    const erg = laufVoll('maler', T_WIDER, RAUM)
    expect(fehltHat(erg.fehlende, /wandfläche|widerspr|abweich|prüf/i)).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-096 · Nachtrag zu einem bestehenden Angebot
//
// „Nachtrag zum Angebot von letzter Woche: im Wohnzimmer kommt noch die
// Decke dazu, vier mal fünf."
//
// Gemessen: Das Wort „Nachtrag" wirkt nirgends. Es entsteht ein ganz
// normales Angebot über eine Deckenzeile — nicht unterscheidbar von einem
// Erstangebot über dasselbe.
//
// Das Zusammenführen mit dem Vorangebot passiert oberhalb der Pipeline und
// gehört in den Live-Lauf (wie „mehrere Aufnahmen"). Prüfbar ist hier aber
// das, was die Pipeline selbst schuldet: dass sie das Wort überhaupt
// bemerkt und nach oben weiterreicht. Tut sie nicht.
//
// Warum das zählt: Ein Nachtrag, der als Erstangebot durchgeht, trägt die
// Anfahrt und die Kleinmaterialpauschale ein zweites Mal — und der Kunde
// bekommt zwei Papiere, die sich beide „Angebot" nennen.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-096 · Nachtrag zu einem bestehenden Angebot', () => {
  const T_NACHTRAG = 'Nachtrag zum Angebot von letzter Woche: im Wohnzimmer kommt noch die Decke dazu, vier mal fünf.'
  const RAUM = [raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: ['decke streichen'] })]

  it('PM-096-C · Kontrolle: die Deckenzeile selbst entsteht korrekt, 20 m²', () => {
    expect(finde(lauf('maler', T_NACHTRAG, RAUM), /Decke streichen/)!.menge).toBe(20)
  })

  it.fails('PM-096-A · das Wort „Nachtrag" hinterlässt eine Spur', () => {
    const erg = laufVoll('maler', T_NACHTRAG, RAUM)
    const inFehlt = fehltHat(erg.fehlende, /nachtrag|bestehend|vorangebot/i)
    const inPositionen = finde(erg.positionen, /nachtrag/i) != null
    expect(inFehlt || inPositionen).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-097 · Zwei Bauabschnitte, getrennte Angebote
//
// „Erster Bauabschnitt Erdgeschoss: … Zweiter Bauabschnitt Obergeschoss,
// das kommt später und wird getrennt abgerechnet: …"
//
// Gemessen: Beide Abschnitte landen in EINER Positionsliste, ohne Trennung,
// ohne Gruppe, ohne Fehlt-Eintrag. Der ausdrückliche Satz „wird getrennt
// abgerechnet" wirkt nirgends.
//
// Der Kunde bekommt eine Summe über beide Abschnitte — über Arbeiten also,
// von denen die Hälfte ausdrücklich später und getrennt beauftragt werden
// sollte. Das ist die kaufmännische Zwillingsschwester von PM-096.
//
// Die Trennung selbst (zwei Angebote erzeugen) liegt oberhalb der Pipeline.
// Geschuldet ist hier wieder nur: den Satz bemerken.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-097 · zwei Bauabschnitte', () => {
  const T_ZWEI =
    'Erster Bauabschnitt Erdgeschoss: Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen. '
    + 'Zweiter Bauabschnitt Obergeschoss, das kommt später und wird getrennt abgerechnet: '
    + 'Schlafzimmer drei mal vier, Wände streichen.'
  const T_OHNE_TRENNUNG =
    'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen. '
    + 'Schlafzimmer drei mal vier, Wände streichen.'
  const RAEUME = [malerRaum('Wohnzimmer', 4, 5), wandRaum('Schlafzimmer', 3, 4)]

  // Die Kontrolle steht bewusst auf dem Satz OHNE den Trennungssatz: sie muss
  // vor UND nach dem Bau grün bleiben. Sie belegt, dass beide Räume überhaupt
  // gerechnet werden können — der Fund ist also der Trennungssatz, keine
  // Extraktionslücke. (Vorher stand sie auf T_ZWEI und hätte beim Bau von
  // CoS-E-074 umschlagen müssen; eine Kontrolle, die der Fix rot macht, ist
  // keine Kontrolle.)
  it('PM-097-C · Kontrolle: ohne den Trennungssatz werden beide Räume gerechnet, 45 m² und 35 m²', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const p = lauf('maler', T_OHNE_TRENNUNG, RAEUME) as any[]
    expect(p.filter(x => /Wand streichen/.test(x.beschreibung)).map(x => x.menge)).toEqual([45, 35])
  })

  it.fails('PM-097-A · „getrennt abgerechnet" hinterlässt eine Spur', () => {
    const erg = laufVoll('maler', T_ZWEI, RAEUME)
    const inFehlt = fehltHat(erg.fehlende, /bauabschnitt|getrennt|abschnitt|obergeschoss|schlafzimmer|später/i)
    const inPositionen = finde(erg.positionen, /bauabschnitt/i) != null
    expect(inFehlt || inPositionen).toBe(true)
  })

  // UMFORMULIERT am 17.09.2026 (Prüfmeister — auf Bitte des Product Designers,
  // DC-116 in `docs/design-check.md`).
  //
  // Hier stand: „die beiden Abschnitte sind im Angebot unterscheidbar" — ein
  // Feld `bauabschnitt` oder `gruppe` an der Position, also eine zweite
  // Gruppierungsebene über dem Raum. Der Designer hat sie ausdrücklich gegen
  // diesen Prüfstand abgelehnt, und ich gebe ihm recht: Der Sollstand stammt
  // aus der Zeit, bevor Ausschluss im UMFANG („wird gar nicht gemacht",
  // PM-034) und Ausschluss in der ZEIT („kommt später", „wird getrennt
  // abgerechnet") getrennt waren. Ich hatte den Zeit-Fall als Gliederung
  // gelesen. Er ist keine: „nicht auf dieses Papier" heißt nicht „weiter
  // unten auf diesem Papier".
  //
  // Es gibt in der ganzen Fallbasis keinen gemessenen Fall, in dem zwei
  // Abschnitte zusammen auf EIN Blatt sollen und sich dort unterscheiden
  // müssten. Eine rote Zeile, die auf etwas zeigt, das absichtlich fehlt,
  // ist eine falsche Meldung — deshalb umformuliert und nicht „bewusst offen".
  //
  // Der neue Sollstand ist wörtlich der von PM-116-A/-B, und das ist der
  // Punkt: PM-097 und PM-116 sind derselbe Fall, einmal mit „getrennt
  // abgerechnet", einmal mit „extra angeboten". Sie müssen dasselbe Soll
  // haben, sonst baut Engineering zweimal.
  //
  // Beide Hälften gehören zusammen (DC-116: „Beides zusammen, nie nur eines").
  // Weglassen ohne Hinweis wäre der schlimmere Fehler von beiden: dann fehlt
  // die Arbeit, und niemand erfährt es.
  //
  // Kippt, sobald ein gemessener Fall zwei Abschnitte wirklich auf ein Blatt
  // verlangt. Bis dahin gilt dieser hier.
  it.fails('PM-097-B · der ausgenommene Abschnitt steht nicht im Angebot — und das Weglassen wird gezeigt', () => {
    const erg = laufVoll('maler', T_ZWEI, RAEUME)
    // 1. Das Obergeschoss ist nicht gerechnet: keine Schlafzimmer-Zeile.
    expect(erg.positionen.some(p => /Schlafzimmer/.test(p.beschreibung))).toBe(false)
    // 2. Und das Weglassen steht als Hinweis da, nicht stumm.
    expect(fehltHat(erg.fehlende, /schlafzimmer|obergeschoss|bauabschnitt/i)).toBe(true)
  })
})
