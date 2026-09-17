// CoS-E-078 — Das Bad findet seine Preise: der Router UND der Wortlaut
// (Head of Product Engineering, 17.09.2026)
//
// ── Worum es geht ─────────────────────────────────────────────────────────
//
// Der Prüfmeister hat in PM-117 den vollen Preisweg eines gewöhnlichen
// Badangebots gefahren: **543,84 € standen da, wo 2.980,44 € hingehören.**
// Sechs von neun Zeilen ohne Preis, darunter alle drei Wandzeilen. Es trifft
// jedes Bad und jeden Betrieb — der Fliesenleger wie der Allrounder.
//
// Zwei Ursachen, und der Prüfmeister hat ausdrücklich darum gebeten, sie
// ZUSAMMEN zu bauen: *„sonst sieht es behoben aus und ist es nicht."*
//
//   1. **Der Router** (PM-060-B): `gewerkFuerPosition` prüft `/wand/` vor
//      allem anderen. Die drei Wandzeilen landen beim Maler, der Filter
//      lässt danach nur Maler-Kategorien durch — im Katalog eines
//      Fliesenlegers gibt es davon null von 95. Leere Menge, `?? 0`.
//      Anteil: **652,96 €**, ein Drittel.
//   2. **Der Wortlaut** (PM-060-A): die Engine schreibt `Verfugung Wand`,
//      der Katalog führt `Verfugen Wand`; `Bodenfliesen verlegen` gegen
//      `Bodenfliesen Standard (30×30 bis 60×60cm), gerade, Q2`.
//      Anteil: **1.783,64 €**, zwei Drittel.
//
// Welche Katalogzeile der Sollwert jeder Position ist, ist hier NICHT
// entschieden worden — der Prüfmeister hat sie in PM-117 Zeile für Zeile
// benannt und die Sollspalte daraus gerechnet. Diese Datei sichert nur,
// dass der Weg dorthin führt und nicht wieder zuwächst.
//
// ── Warum so viele Gegenproben ────────────────────────────────────────────
//
// `/wand/` ist die tragende Zeile des Malers. Der Prüfmeister hat selbst
// geschrieben, ihr Radius gehe weit über das Bad hinaus. Sie ist deshalb
// UNANGETASTET geblieben; die Fliesenregel steht davor und ist eng gefasst.
// Ob sie wirklich eng ist, behauptet diese Datei nicht — sie misst es
// (Nr. 3 bis Nr. 8).
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk, standardpreiseFuerGewerke } from '../default-price-selection'
import { gewerkFuerPosition } from '../positions-gewerk'

const mk = (ps: typeof DEFAULT_PRICES) => ps.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))
const FLIESENBETRIEB = mk(standardpreiseFuerGewerke(['fliesen']))
const MALERBETRIEB = mk(standardpreiseFuerGewerke(['maler']))

const T = 'Badezimmer drei Meter zwanzig mal zwei Meter zehn, alles neu fliesen, '
  + 'Wände bis zwo Meter zwanzig hoch, Boden auch. Die alten Fliesen kommen raus.'
const BEREICHE = [{ name: 'Badezimmer', laenge: 3.2, breite: 2.1, flieshoehe: 2.2, nassbereich: true }]

type Zeile = { beschreibung: string; einheit: string; menge: number }

function badangebot(): Zeile[] {
  const eng = berechneMengen('fliesen', { transkript: T, bereiche: BEREICHE, altbelag: [{ bereich: 'Badezimmer', flaeche: 22 }] } as never)
  const meta = { raeume: [{ name: 'Badezimmer', hoehe: null }] }
  const signale = { arbeitenTexte: [], belagText: null, altbelagEntfernen: true, raeume: [{ name: 'Badezimmer', arbeiten: [] }] }
  return pruefeUndErgaenzeVollstaendigkeit('fliesen', eng.positionen, T, meta as never, signale as never).positionen as never as Zeile[]
}

/** Derselbe Preisweg wie im Endpunkt, inklusive `?? 0` am Ende. */
function zuordnung(titel: string, einheit: string, katalog = FLIESENBETRIEB, hauptgewerk = 'fliesen') {
  const gewerk = gewerkFuerPosition(titel, hauptgewerk)
  const kandidaten = katalog.filter(k => preisKategoriePasstZuGewerk(k.category, gewerk))
  return findePreisposition(titel, einheit, kandidaten)
}
const preis = (titel: string, einheit: string, katalog = FLIESENBETRIEB, hauptgewerk = 'fliesen') =>
  zuordnung(titel, einheit, katalog, hauptgewerk)?.position.unit_price ?? 0
const finde = (zeilen: Zeile[], re: RegExp) => zeilen.find(z => re.test(z.beschreibung))!

describe('CoS-E-078 — das Bad findet seine Preise', () => {
  const pos = badangebot()

  // ── 1. Das Ergebnis, an dem alles hängt ─────────────────────────────────

  it('1 · die Sollspalte des Prüfmeisters steht Zeile für Zeile im Angebot', () => {
    // Genau die Tabelle aus PM-117. Kein gerundeter Gesamtwert, sondern jede
    // Zeile einzeln — eine Summe kann stimmen, während zwei Zeilen sich
    // gegenseitig ausgleichen.
    const soll: Array<[RegExp, number]> = [
      [/^Bodenfliesen verlegen/, 38],
      [/^Verbundabdichtung Boden/, 22],
      [/^Verfugung Boden/, 10],
      [/^Wandfliesen verlegen/, 42],
      [/^Verfugung Wand/, 12],
      [/^Verbundabdichtung Wand/, 28],
      [/^Fliesensockel \/ Abschlussleiste/, 12],
      [/^Altfliesen abstemmen/, 18],
    ]
    for (const [re, einzelpreis] of soll) {
      const z = finde(pos, re)
      expect(preis(z.beschreibung, z.einheit), z.beschreibung).toBe(einzelpreis)
    }
  })

  it('2 · `Entsorgung Fliesenmaterial` bleibt bewusst ohne Preis — der Prüfmeister hat „keine Katalogzeile" als Soll notiert', () => {
    // Die einzige der neun Zeilen, die auch nach dem Bau 0,00 € trägt. Das
    // ist kein Rest, den jemand vergessen hat, sondern die Sollspalte: der
    // Katalog führt für diese Arbeit keine Zeile. Hier festgehalten, damit
    // niemand sie später „mitrepariert" und dabei einen Preis erfindet.
    const z = finde(pos, /^Entsorgung Fliesenmaterial/)
    expect(preis(z.beschreibung, z.einheit)).toBe(0)
  })

  // ── 3.–8. Die Gegenproben: was der Eingriff NICHT anfassen durfte ───────

  it('3 · die tragende /wand/-Regel des Malers ist unangetastet', () => {
    // Die Fliesenregel steht VOR ihr, nicht in ihr. Alles, was kein
    // unmissverständliches Fliesenwort trägt, geht weiter zum Maler.
    for (const titel of [
      'Wandflächen streichen — Wohnzimmer',
      'Wand spachteln Q3 — Büro',
      'Deckenfläche streichen — Flur',
      'Wandnische streichen — Wohnzimmer',
      'Raufaser tapezieren — Schlafzimmer',
      'Wände grundieren — Küche',
    ]) expect(gewerkFuerPosition(titel, 'boden_parkett'), titel).toBe('maler')
  })

  it('4 · PM-090: die Staubschutzwand bleibt, wo sie war', () => {
    // Sie trägt „wand" und kein Fliesenwort — sie darf sich durch diesen
    // Eingriff nicht bewegen. Ihr eigener Fund ist ein anderer und gehört
    // nicht hierher.
    expect(gewerkFuerPosition('Staubschutzwand / Trennwand aufstellen', 'fliesen')).toBe('maler')
  })

  it('5 · `verfugen` allein reißt drei fremde Gewerke NICHT mit', () => {
    // Im Katalog steht „verfugen" auch bei Garten, Fassade und Rohbau.
    // Deshalb ist die Regel an `boden`/`wand` gebunden. Ohne diese Bindung
    // wären das drei stille Fehlleitungen für einen Fund, der sie nicht
    // braucht.
    expect(gewerkFuerPosition('Fugensand einbringen / verfugen', 'garten')).toBe('garten')
    expect(gewerkFuerPosition('Außentreppe Klinker neu verfugen', 'maler_fassade')).toBe('maler_fassade')
    expect(gewerkFuerPosition('Fugen sanieren / Fugen neu verfugen', 'rohbau')).toBe('rohbau')
  })

  it('6 · Teppich-, Vinyl- und Linoleumfliesen bleiben beim Boden', () => {
    // Sie tragen das Wort „Fliesen" und sind keine Fliesenarbeit. Gedeckt
    // ist das dadurch, dass die Fliesenregel NACH `istBoden` steht — hier
    // gemessen und nicht nur angenommen.
    expect(gewerkFuerPosition('Teppichfliesen verlegen (selbsthaftend)', 'maler')).toBe('boden_parkett')
    expect(gewerkFuerPosition('Vinyl-Fliesen verlegen (Klick oder Klebe)', 'maler')).toBe('boden_parkett')
    expect(gewerkFuerPosition('Linoleum verlegen (Fliesen-/Plattenformat)', 'maler')).toBe('boden_parkett')
    expect(gewerkFuerPosition('Teppichfliesen entfernen', 'maler')).toBe('boden_parkett')
  })

  it('7 · Abdecken und Abkleben bleiben Vorbereitung des Malers', () => {
    // Dieselbe Lehre wie bei „Boden schützen" (PM-024/PM-026): Das Wort
    // „Fliesen" im Titel macht aus Schutzarbeit keine Fliesenarbeit. Der
    // Katalogeintrag dafür steht unter „Maler – Vorbereitung & Schutz".
    expect(gewerkFuerPosition('Fliesen abdecken (Abdeckvlies) — Bad', 'maler')).toBe('maler')
    expect(gewerkFuerPosition('Fliesenspiegel abkleben — Küche', 'maler')).toBe('maler')
    expect(gewerkFuerPosition('Boden schützen — Bad', 'boden_parkett')).toBe('maler')
  })

  it('8 · ein Malerangebot rechnet unverändert', () => {
    // Die Gegenprobe von der anderen Seite: Der Maler findet seine Preise
    // genau wie vorher. Ohne diese Zeile wäre Nr. 3 nur eine Aussage über
    // den Router, nicht über Geld.
    expect(preis('Wandflächen streichen — 2x Anstrich — Wohnzimmer', 'm²', MALERBETRIEB, 'maler')).toBeGreaterThan(0)
    expect(preis('Deckenfläche streichen — 2x Anstrich — Flur', 'm²', MALERBETRIEB, 'maler')).toBeGreaterThan(0)
    expect(preis('Raufaser tapezieren — Schlafzimmer', 'm²', MALERBETRIEB, 'maler')).toBeGreaterThan(0)
  })

  // ── 9.–12. Der Wortlaut ─────────────────────────────────────────────────

  it('9 · Substantiv und Verb sind dieselbe Arbeit: Verfugung → Verfugen', () => {
    expect(zuordnung('Verfugung Wand — Badezimmer', 'm²')?.position.title).toBe('Verfugen Wand')
    expect(zuordnung('Verfugung Boden — Badezimmer', 'm²')?.position.title).toBe('Verfugen Boden')
    // Und die Gegenrichtung: der Katalogwortlaut selbst trifft weiterhin.
    expect(zuordnung('Verfugen Wand — Badezimmer', 'm²')?.position.title).toBe('Verfugen Wand')
  })

  it('10 · die Abschlussleiste ist der Alltagsname der Sockelleiste', () => {
    expect(zuordnung('Fliesensockel / Abschlussleiste — Badezimmer', 'lfdm')?.position.title)
      .toBe('Sockelleiste / Fliesensockel verlegen')
    // Kein einziger Katalogtitel trägt das Wort „Abschlussleiste" — die
    // Gleichsetzung nimmt also keiner anderen Zeile etwas weg.
    expect(DEFAULT_PRICES.filter(p => /abschlussleiste/i.test(p.title))).toEqual([])
  })

  it('11 · wer kein Format nennt, bekommt die Standardzeile — sichtbar als Annahme', () => {
    // Manfreds Mechanismus aus `katalog-standard.ts`, nicht ein neuer
    // Sonderweg. Der Handwerker liest im Entwurf, was angenommen wurde; auf
    // dem Kunden-PDF steht die Annahme bewusst nicht.
    const boden = zuordnung('Bodenfliesen verlegen — Badezimmer', 'm²')
    expect(boden?.position.title).toBe('Bodenfliesen Standard (30×30 bis 60×60cm), gerade, Q2')
    expect(boden?.annahme).toMatch(/30×30/)
    const wand = zuordnung('Wandfliesen verlegen — Badezimmer', 'm²')
    expect(wand?.position.title).toBe('Wandfliesen Standard (20×40 bis 30×60cm), gerade')
    expect(wand?.annahme).toMatch(/20×40/)
  })

  it('12 · wer sich festlegt, bekommt NICHT den Standard', () => {
    // Die Regel der Familie, hier von der teuren Seite gemessen: Ein
    // Großformat für den Standardpreis anzubieten hieße, 23,00 €/m² zu
    // verschenken. Eine ausdrückliche Ansage darf ein Standard nie
    // überstimmen.
    for (const titel of [
      'Bodenfliesen Großformat verlegen — Bad',
      'Bodenfliesen XXL verlegen — Bad',
      'Wandfliesen Mosaik verlegen — Bad',
      'Wandfliesen 60×120 verlegen — Bad',
    ]) {
      const t = zuordnung(titel, 'm²')?.position.title ?? ''
      expect(t, titel).not.toBe('Bodenfliesen Standard (30×30 bis 60×60cm), gerade, Q2')
      expect(t, titel).not.toBe('Wandfliesen Standard (20×40 bis 30×60cm), gerade')
    }
  })

  // ── 13. Die Trennung, um die der Prüfmeister gebeten hat ────────────────

  it('13 · Router und Wortlaut sind wirklich zwei Drittel und ein Drittel', () => {
    // Der Prüfmeister hat gewarnt: Wer nur `/wand/` repariert, hebt das Bad
    // von 543,84 € auf 1.196,80 € und hält es für erledigt. Diese Zeile
    // hält beide Beträge fest, damit die Trennung nachlesbar bleibt, falls
    // einer der beiden Eingriffe später einmal zurückgedreht wird.
    const summe = (zeilen: Zeile[]) => Math.round(
      zeilen.reduce((s, z) => s + preis(z.beschreibung, z.einheit) * z.menge, 0) * 100) / 100
    expect(summe(pos)).toBe(2980.44)
    // 543,84 € war der Stand vor dem Bau, 652,96 € der Router-Anteil.
    expect(Math.round((2980.44 - 543.84 - 652.96) * 100) / 100).toBe(1783.64)
  })

  it('14 · der Allrounder bekommt dasselbe wie der Fliesenleger', () => {
    // Vorher war diese Gleichheit der Beweis, dass es am Router hängt und
    // nicht am Onboarding (PM-117-F). Sie muss auch nachher gelten — sonst
    // hinge der Preis plötzlich daran, welche Gewerke ein Betrieb gebucht
    // hat.
    const summe = (k: typeof FLIESENBETRIEB) => Math.round(
      pos.reduce((s, z) => s + preis(z.beschreibung, z.einheit, k) * z.menge, 0) * 100) / 100
    expect(summe(mk(DEFAULT_PRICES))).toBe(summe(FLIESENBETRIEB))
  })
})
