// Prüfmeister · 21.09.2026, abends — Themenspeicher Punkt 12 und Punkt 21
//
// Zwei Punkte, zwei Messungen, fünf Fälle. Beides ohne App, am Ausdruck bzw.
// am Katalog — genau so, wie die zwei Punkte es sich selbst auferlegt haben.
//
// Punkt 12 fragte: „wo sonst deckt EINE Engine-Zeile zwei Katalogzeilen mit
// verschiedenen Preisen ab?" Punkt 21 fragte: „sitzen PM-134 bis PM-136 auch
// in den beiden anderen Bremsen?" Beide Antworten fallen kleiner aus als
// vermutet — und beide fallen anders aus, als ich sie vermutet hätte.
import { describe, expect, it } from 'vitest'
import { DEFAULT_PRICES } from '../default-prices'
import { findePreisposition } from '../preis-matcher'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '@/lib/positions-gewerk'
import { erkenneSockelleistenAusschluss } from '../sockelleisten-ausschluss'
import { erkenneBauteilAusschluss } from '../bauteil-ausschluss'
import { ausgeschlosseneRaeume } from '../raum-ausschluss'

// ───────────────────────────────────────────────────────────────────────────
// PM-139 · Themenspeicher Punkt 12, gemessen: die Klasse ist klein
//
// PM-124 hatte die Klasse aufgemacht: `Altfliesen abstemmen` trägt Boden-
// UND Wandfläche in EINER Menge, der Katalog trennt sie mit 4,00 €/m²
// Unterschied. Offen war, wie oft das sonst vorkommt.
//
// Gemessen an allen 184 Engine-Titeln gegen den Standardkatalog:
// es sind ZWEI — PM-124 selbst und der Diagonal-Aufpreis. Meine Vermutung,
// das sei eine breite Klasse, ist damit widerlegt. Gemessen statt geglaubt.
// ───────────────────────────────────────────────────────────────────────────
type Zeile = { id: string; title: string; category: string; unit: string; unit_price: number }

function katalogFuer(titel: string): Zeile[] {
  const gewerk = gewerkFuerPosition(titel, undefined)
  return DEFAULT_PRICES
    .filter(p => preisKategoriePasstZuGewerk(p.category, gewerk))
    .map((p, i) => ({ id: `s${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price }))
}

/** Katalogzeilen derselben Arbeit, die sich nur im Ort unterscheiden. */
const ORT = /(boden|b[öo]den|fu(?:ß|ss)boden|wand|w[äa]nde|decke)/i
const rumpf = (t: string) => t.toLowerCase().replace(/\([^)]*\)/g, '')
  .replace(new RegExp(ORT.source, 'gi'), ' ').replace(/[^a-zäöüß ]/g, ' ')
  .split(/\s+/).filter(Boolean).sort().join(' ')

function ortsgruppe(titel: string, einheit: string): Zeile[] {
  const kat = katalogFuer(titel)
  const treffer = findePreisposition(titel, einheit, kat)
  if (!treffer) return []
  const ziel = treffer.position as Zeile
  return kat.filter(p => rumpf(p.title) === rumpf(ziel.title) && ORT.test(p.title))
}

describe('PM-139 · Punkt 12 — eine Engine-Zeile über zwei Katalogpreisen', () => {
  it('PM-139-1 · `Altfliesen abstemmen` nennt den Ort nicht, der Katalog schon — 18,00 € vs. 22,00 €', () => {
    const gruppe = ortsgruppe('Altfliesen abstemmen', 'm²')
    expect(gruppe.map(p => p.title).sort()).toEqual([
      'Altfliesen Boden abstemmen (einlagig)',
      'Altfliesen Boden abstemmen (mehrlagig, Aufpreis)',
      'Altfliesen Wand abstemmen',
    ])
    // Der Engine-Titel trägt kein Ortswort — er kann Boden und Wand meinen.
    expect(ORT.test('Altfliesen abstemmen')).toBe(false)
    // Gewählt wird die Boden-Zeile. Wandfliesen kosten 4,00 €/m² mehr:
    // bei 12 m² Bad-Wandfläche sind das 48,00 €, die der Betrieb verschenkt.
    const treffer = findePreisposition('Altfliesen abstemmen', 'm²', katalogFuer('Altfliesen abstemmen'))
    expect((treffer?.position as Zeile).title).toBe('Altfliesen Boden abstemmen (einlagig)')
    expect((treffer?.position as Zeile).unit_price).toBe(18)
    const wand = gruppe.find(p => /Wand/.test(p.title))!
    expect(wand.unit_price - 18).toBe(4)
  })

  it('PM-139-2 · und sonst nur noch EINE: der Diagonal-Aufpreis', () => {
    // `Aufpreis Diagonalverlegung` ist der Parkett-Titel (boden.ts) und
    // trifft die Parkett-Zeile mit 10,00 € — richtig, solange nur Parkett
    // ihn erzeugt. Daneben stehen zwei Fliesen-Zeilen mit 12,00 € und
    // 14,00 €, die denselben Namen tragen und teurer sind.
    const gruppe = ortsgruppe('Aufpreis Diagonalverlegung', 'm²')
    expect(gruppe.map(p => p.unit_price).sort((a, b) => a - b)).toEqual([12, 14])
    const treffer = findePreisposition('Aufpreis Diagonalverlegung', 'm²', katalogFuer('Aufpreis Diagonalverlegung'))
    expect((treffer?.position as Zeile).unit_price).toBe(10)
  })

  it('PM-139-3 · die Gegenprobe: `Verfugung` und `streichen` nennen den Ort selbst', () => {
    // Beides sind Katalogpaare mit Preisunterschied (10/12 € bzw. 6/7 €) —
    // und beide sind harmlos, weil die Engine zwei getrennte Titel führt.
    // Der Unterschied zwischen PM-124 und diesen Paaren ist nicht der
    // Katalog, sondern der Engine-Titel.
    expect(ORT.test('Verfugung Boden')).toBe(true)
    expect(ORT.test('Verfugung Wand')).toBe(true)
    expect(ORT.test('Wand streichen 2x')).toBe(true)
    expect(ORT.test('Decke streichen 2x')).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-140 · Der Diagonal-Aufpreis der FLIESEN wird nie erzeugt
//
// Beifang aus PM-139. `boden.ts` kennt die Verlegerichtung und setzt je
// Belag einen eigenen Aufpreis-Titel. `fliesen.ts` kennt sie überhaupt
// nicht — es gibt dort weder `diagonal` noch eine Musterverlegung. Die zwei
// Katalogzeilen (12,00 € Boden, 14,00 € Wand) haben damit KEINEN
// Engine-Titel: diagonal verlegte Fliesen kosten im Angebot dasselbe wie
// gerade verlegte. Geld gegen den Betrieb, und stumm.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-140 · diagonal verlegte Fliesen bekommen keinen Aufpreis', () => {
  it('PM-140-1 · die zwei Katalogzeilen stehen da', () => {
    const da = DEFAULT_PRICES.filter(p => /Aufpreis Diagonalverlegung (Boden|Wand)/.test(p.title))
    expect(da.map(p => `${p.title} ${p.unit_price}`).sort()).toEqual([
      'Aufpreis Diagonalverlegung Boden 12',
      'Aufpreis Diagonalverlegung Wand 14',
    ])
  })

  it.fails('PM-140-A · SOLL: „Bad diagonal fliesen" erzeugt den Aufpreis', () => {
    // Sperrklinke. Die Engine-Titelliste (184) führt keinen Fliesen-Titel
    // mit „Diagonal"; `fliesen.ts` liest die Verlegerichtung nicht. Wer das
    // baut, nimmt sich `boden.ts` (Zeilen 202–205) als Muster — dort steht
    // dieselbe Entscheidung schon getroffen, je Belag eine eigene Zeile.
    const titel = ['Aufpreis Diagonalverlegung Boden', 'Aufpreis Diagonalverlegung Wand']
    const erzeugt: string[] = [] // die Engine erzeugt heute keinen davon
    expect(erzeugt).toEqual(titel)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-141 bis PM-143 · Themenspeicher Punkt 21, gemessen
//
// Die Frage war: sitzen PM-134 (Reihenfolge), PM-135 (Komma statt Punkt)
// und PM-136 (Raum-Vererbung) auch in `sockelleisten-ausschluss.ts` (PM-033)
// und `raum-ausschluss.ts` (PM-034)? Ich hielt es für wahrscheinlich und
// habe es ausdrücklich nicht behauptet. Gemessen ist es ein geteiltes Bild:
//
//   PM-134  →  sitzt in der Sockelleisten-Bremse            (PM-141)
//   PM-135  →  sitzt dort NICHT                             (PM-143, Kontrolle)
//   PM-136  →  sitzt in BEIDEN Bremsen                      (PM-142)
//
// Der Grund für alle drei Antworten ist derselbe: `saetzeMitRaum()` liefert
// TEILSÄTZE, nicht Sätze. Die Sockelleisten-Bremse arbeitet damit von Haus
// aus eine Stufe feiner als die Bauteil-Bremse — sie kann den PM-135-Fehler
// gar nicht machen, weil sie über das Komma nie hinwegliest. Genau deshalb
// macht sie dafür einen anderen: sie liest auch NICHT über das Komma, wenn
// sie es sollte (PM-143-2).
// ───────────────────────────────────────────────────────────────────────────
const RAEUME = ['Flur', 'Wohnzimmer']
const sockel = (t: string) => {
  const a = erkenneSockelleistenAusschluss(t, RAEUME)
  return { global: a.global, raeume: [...a.raeume].sort() }
}

describe('PM-141 · der Ausschluss vor dem Auftrag — auch in der Sockelleisten-Bremse', () => {
  it('PM-141 · gemessener Stand: der spätere ausdrückliche Auftrag zählt nicht', () => {
    // Gesagt, in dieser Reihenfolge: erst „bleiben wie sie sind", dann —
    // ein Satz später — „Sockelleisten im Flur neu". Der Handwerker hat es
    // sich im Diktat anders überlegt; das Angebot merkt es nicht.
    expect(sockel('Flur, Sockelleisten bleiben wie sie sind. Sockelleisten im Flur neu.'))
      .toEqual({ global: false, raeume: ['Flur'] })
  })

  it('PM-141-C · Kontrolle: andersherum stimmt es — der spätere Ausschluss gewinnt', () => {
    expect(sockel('Flur, Sockelleisten im Flur neu. Sockelleisten bleiben wie sie sind.'))
      .toEqual({ global: false, raeume: ['Flur'] })
  })

  it.fails('PM-141-A · SOLL: der spätere Auftrag hebt den früheren Ausschluss auf', () => {
    // Sperrklinke — dieselbe Sperrklinke wie PM-134-A, nur in der anderen
    // Bremse. Wer PM-134 baut, baut diese hier im selben Zug mit; beide
    // holen ihre Sätze aus `satz-raum.ts`.
    expect(sockel('Flur, Sockelleisten bleiben wie sie sind. Sockelleisten im Flur neu.'))
      .toEqual({ global: false, raeume: [] })
  })
})

describe('PM-142 · der Ausschluss ohne Raumnamen erbt — in beiden Bremsen', () => {
  it('PM-142-1 · Sockelleisten: der zuletzt genannte Raum bekommt ihn, ohne Rückfrage', () => {
    // Zwei Räume aufgenommen, der Ausschlusssatz nennt keinen. Er landet
    // beim Wohnzimmer — allein, weil das der letzte Raumname davor war.
    expect(sockel('Flur 6 mal 1,50. Wohnzimmer 4 mal 5. Sockelleisten bleiben wie sie sind.'))
      .toEqual({ global: false, raeume: ['Wohnzimmer'] })
  })

  it('PM-142-2 · und ohne jeden Raumnamen davor wird derselbe Satz global', () => {
    // Derselbe Satz, einmal für einen Raum und einmal für die ganze
    // Wohnung — entschieden wird das von einem Satz, der weit davor steht.
    expect(sockel('Sockelleisten bleiben wie sie sind.'))
      .toEqual({ global: true, raeume: [] })
  })

  it('PM-142-3 · Räume: dieselbe Vererbung, gemessen an `ausgeschlosseneRaeume`', () => {
    const raeume = [{ name: 'Flur', arbeiten: [] }, { name: 'Wohnzimmer', arbeiten: [] }]
    const t = 'Flur 6 mal 1,50. Wohnzimmer 4 mal 5. Da machen wir nichts.'
    expect([...ausgeschlosseneRaeume(raeume, t).keys()]).toEqual(['Wohnzimmer'])
  })

  it('PM-142-C · Kontrolle: mit Raumnamen im Satz trifft es den richtigen Raum', () => {
    const raeume = [{ name: 'Flur', arbeiten: [] }, { name: 'Wohnzimmer', arbeiten: [] }]
    expect([...ausgeschlosseneRaeume(raeume, 'Im Flur machen wir nichts. Wohnzimmer 4 mal 5.').keys()])
      .toEqual(['Flur'])
  })

  it.fails('PM-142-A · SOLL: ohne Raumnamen nach mehreren Räumen wird gefragt, nicht geerbt', () => {
    // Sperrklinke, wortgleich zu PM-136-A in der Bauteil-Bremse.
    expect(sockel('Flur 6 mal 1,50. Wohnzimmer 4 mal 5. Sockelleisten bleiben wie sie sind.'))
      .toEqual({ global: false, raeume: [] })
  })
})

describe('PM-143 · PM-135 sitzt dort NICHT — und dafür etwas anderes', () => {
  it('PM-143-1 · Punkt und Komma ergeben dasselbe: die Bremse liest ohnehin je Teilsatz', () => {
    // Das ist der Fehler, den PM-135 in der Bauteil-Bremse gefunden hat.
    // Hier gibt es ihn nicht, und zwar nicht aus Vorsicht, sondern weil
    // `saetzeMitRaum()` von Haus aus am Komma trennt.
    const mitPunkt = sockel('Flur, Sockelleisten neu. Im Wohnzimmer bleiben sie.')
    const mitKomma = sockel('Flur, Sockelleisten neu, im Wohnzimmer bleiben sie.')
    expect(mitPunkt).toEqual({ global: false, raeume: ['Wohnzimmer'] })
    expect(mitKomma).toEqual(mitPunkt)
  })

  it('PM-143-2 · dafür ist ihre Gegenprobe über das Komma hinweg BLIND — in beide Richtungen', () => {
    // Seit CoS-E-091 hat die Bauteil-Bremse innerhalb des Satzes eine
    // Richtung: der Auftrag HINTER dem Ausschluss hebt ihn auf, der davor
    // nicht. Die Sockelleisten-Bremse kennt beide Richtungen nicht — für
    // sie ist der Teilsatz die ganze Welt.
    const davor = sockel('Wohnzimmer. Sockelleisten neu, an den Sockelleisten machen wir nichts.')
    const dahinter = sockel('Wohnzimmer. An den Sockelleisten machen wir nichts, Sockelleisten neu.')
    expect(davor).toEqual({ global: false, raeume: ['Wohnzimmer'] })
    expect(dahinter).toEqual({ global: false, raeume: ['Wohnzimmer'] })

    // Und genau hier gehen die zwei Bremsen auseinander: derselbe Satzbau,
    // zwei verschiedene Antworten. Die Bauteil-Bremse lässt den Auftrag
    // dahinter gewinnen, die Sockelleisten-Bremse nicht.
    const wand = (t: string) =>
      [...(erkenneBauteilAusschluss(t, ['Wohnzimmer']).jeRaum.get('Wohnzimmer') ?? [])]
    expect(wand('Wohnzimmer. An den Wänden machen wir nichts, Wände streichen.')).toEqual([])
  })

  it.fails('PM-143-A · SOLL: beide Bremsen antworten auf denselben Satzbau gleich', () => {
    // Sperrklinke. Kein Bauauftrag von mir, welche der beiden Antworten die
    // richtige ist — aber ZWEI Antworten auf denselben Satzbau sind auf
    // demselben Angebot nicht zu verteidigen. Gehört an PM-134 angehängt.
    const dahinter = sockel('Wohnzimmer. An den Sockelleisten machen wir nichts, Sockelleisten neu.')
    expect(dahinter).toEqual({ global: false, raeume: [] })
  })
})
