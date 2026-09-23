// Prüfmeister · 23.09.2026 — PM-145 und PM-146
//
// Zwei Fälle aus derselben Datei (`bauteil-ausschluss.ts`) und mit derselben
// Form: ein Satz, den der Handwerker spricht, wird von der Bremse nicht
// gelesen. Beide kommen aus Engineerings Notiz vom 21.09., 20:55 UTC; beide
// hat er ausdrücklich NICHT gebaut und mir Nummer und Wortlaut überlassen.
// Der Chief of Staff hat sie am 22.09., 05:50 UTC vor die Themenspeicher-
// Punkte 13 und 23 gestellt, weil sie Zeilen vom Kundenpapier nehmen.
//
// Gemessen am 23.09.2026 auf Sandys Rechner, über die volle Pipeline, nicht
// gelesen und nicht vermutet.
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
import { erkenneBauteilAusschluss, bauteilAusschlussHinweis } from '../bauteil-ausschluss'
import type { Bauteil } from '../bauteil-ausschluss'

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
function laufVoll(transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk: 'maler', raeume, transkript } } as never)
  const text = ersetzeZahlenWorte(transkript)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen('maler', extraktion)
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
  const erg = pruefeUndErgaenzeVollstaendigkeit('maler', eng.positionen, text, meta as never, signale as never)
  return { positionen: erg.positionen, fehlende: erg.fehlende as string[] }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lauf = (t: string, r: any[]) => laufVoll(t, r).positionen
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const titel = (pos: any[]) => pos.map(p => p.beschreibung)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hat = (pos: any[], m: RegExp) => titel(pos).some(t => m.test(t))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function summe(pos: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = pos.reduce((acc: number, p: any) => {
    const g = gewerkFuerPosition(p.beschreibung, 'maler')
    const tr = findePreisposition(p.beschreibung, p.einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))
    return acc + (tr ? tr.position.unit_price * (p.menge ?? 0) : 0)
  }, 0)
  return Number(s.toFixed(2))
}

/** Was die Bremse im Satz liest — nur die Bauteile, ohne Raum und Beleg. */
function bremse(satz: string): Bauteil[] {
  const r = erkenneBauteilAusschluss(`Wohnzimmer, 5 mal 4, Höhe 2,50. ${satz}.`, ['Wohnzimmer'])
  return [...(r.jeRaum.get('Wohnzimmer') ?? new Set<Bauteil>())]
}

// ───────────────────────────────────────────────────────────────────────────
// PM-145 · „An den Fenstern machen wir nichts" liest die Bauteil-Bremse nicht
//
// `SATZ_WORT` trägt `/\bfenster\b/` und `/\bheizk[öo]rper\b/`. Bei den vier
// anderen Bauteilen steht die Mehrzahl daneben (`w[äa]nd(?:e|en)?`,
// `decke(?:n)?`, `b[öo]den`, `t[üu]r(?:e|en)?`) — beim Fenster und beim
// Heizkörper fehlt das Dativ-n. Einzahl greift, Mehrzahl nicht.
//
// Das ist keine Feinheit des Ausdrucks: „an den Fenstern" ist die Form, in
// der ein Handwerker das sagt — und es ist Wort für Wort die Form, die
// DIESELBE Datei in `BAUTEIL_WORT` für ihre eigene Hinweiszeile benutzt.
// Die Maschine schreibt einen Satz, den sie selbst nicht lesen kann.
//
// Gemessen, nicht geschätzt: auf einem gewöhnlichen Malerangebot über
// 835,90 € hängen an diesen zwei Wörtern 370,00 € — 200,00 € Fensterblock,
// 170,00 € Heizkörperblock. Sie bleiben bepreist stehen, obwohl der Betrieb
// sie abbestellt hat.
// ───────────────────────────────────────────────────────────────────────────

// Wohnzimmer 5,00 × 4,00 × 2,50 → Wand 45,00 m² · 2 Fenster · 2 Heizkörper
const T_BASIS = 'Wohnzimmer, 5 mal 4, Höhe 2,50. Wände zweimal streichen. Die 2 Fenster streichen. Die 2 Heizkörper lackieren.'
const WZ = () => [raum('Wohnzimmer', {
  laenge: 5, breite: 4, hoehe: 2.5,
  arbeiten: ['wände streichen', 'fenster streichen', 'heizkörper lackieren'],
})]

describe('PM-145 · die Dativ-Mehrzahl am Fenster und am Heizkörper', () => {
  it('PM-145-1 · gemessener Stand: vier von sechs Bauteilen werden gelesen, zwei nicht', () => {
    // Derselbe Satzbau, sechsmal, nur das Bauteil wechselt.
    expect(bremse('An den Wänden machen wir nichts')).toEqual(['wand'])
    expect(bremse('An den Decken machen wir nichts')).toEqual(['decke'])
    expect(bremse('An den Böden machen wir nichts')).toEqual(['boden'])
    expect(bremse('An den Türen machen wir nichts')).toEqual(['tuer'])
    // Und hier hört die Bremse auf zu greifen:
    expect(bremse('An den Fenstern machen wir nichts')).toEqual([])
    expect(bremse('An den Heizkörpern machen wir nichts')).toEqual([])
    // Die Einzahl greift — der Unterschied ist genau das Dativ-n.
    expect(bremse('Am Fenster machen wir nichts')).toEqual(['fenster'])
    expect(bremse('Am Heizkörper machen wir nichts')).toEqual(['heizkoerper'])
  })

  it('PM-145-2 · die Maschine schreibt genau den Satz, den sie nicht lesen kann', () => {
    // `BAUTEIL_WORT` ist der Wemfall, „wie gesprochen" — und das ist
    // dieselbe Form, an der `SATZ_WORT` scheitert. Wer die Hinweiszeile
    // liest und sie dem Kunden nachspricht, wird nicht verstanden.
    const hinweisF = bauteilAusschlussHinweis('Wohnzimmer', ['fenster'], 'egal')
    const hinweisH = bauteilAusschlussHinweis('Wohnzimmer', ['heizkoerper'], 'egal')
    expect(hinweisF).toContain('an den Fenstern')
    expect(hinweisH).toContain('an den Heizkörpern')
    // Und wieder zurück in die Bremse gegeben, erkennt sie ihr eigenes Wort
    // nicht: aus dem Satz, den sie selbst geschrieben hat, liest sie nichts.
    expect(bremse('An den Fenstern machen wir nichts')).toEqual([])
    expect(bremse('An den Heizkörpern machen wir nichts')).toEqual([])
  })

  it('PM-145-3 · gemessener Stand: 370,00 € von 835,90 € bleiben stehen', () => {
    const ohne = lauf(T_BASIS, WZ())
    expect(summe(ohne)).toBe(835.9)
    expect(hat(ohne, /^Fenster lackieren/)).toBe(true)
    expect(hat(ohne, /^Heizkörper lackieren/)).toBe(true)

    // Einzahl — die Bremse greift, der Block fällt weg. So soll es sein.
    expect(summe(lauf(`${T_BASIS} Am Fenster machen wir nichts.`, WZ()))).toBe(635.9)
    expect(summe(lauf(`${T_BASIS} Am Heizkörper machen wir nichts.`, WZ()))).toBe(665.9)

    // Mehrzahl — Zeile für Zeile dasselbe wie ganz ohne Ausschlusssatz.
    // Nicht „fast dasselbe": dasselbe. Die Ansage kommt nirgends an.
    const mitF = lauf(`${T_BASIS} An den Fenstern machen wir nichts.`, WZ())
    const mitH = lauf(`${T_BASIS} An den Heizkörpern machen wir nichts.`, WZ())
    expect(titel(mitF)).toEqual(titel(ohne))
    expect(titel(mitH)).toEqual(titel(ohne))
    expect(summe(mitF)).toBe(835.9)
    expect(summe(mitH)).toBe(835.9)

    // Das Geld: Fensterblock 200,00 €, Heizkörperblock 170,00 €.
    expect(835.9 - 635.9).toBeCloseTo(200, 2)
    expect(835.9 - 665.9).toBeCloseTo(170, 2)

    // Und es ist stumm: kein Fehlt-Eintrag, kein Hinweis. Der Betrieb sieht
    // auf dem Blatt nicht, dass seine Ansage verlorengegangen ist.
    expect(laufVoll(`${T_BASIS} An den Fenstern machen wir nichts.`, WZ()).fehlende
      .filter(f => /^⚠/.test(f))).toEqual([])
  })

  it('PM-145-4 · die Grenze meines Solls: nur das Dativ-n fehlt, sonst nichts', () => {
    // Damit niemand beim Bauen zu weit greift: Die übrigen Formen liest die
    // Bremse heute schon. Der Werfall/Wenfall der Mehrzahl ist beim Fenster
    // und beim Heizkörper mit der Einzahl gleichlautend und deshalb in
    // Ordnung. Zu tun ist genau das Dativ-n — zwei Buchstaben, kein Umbau.
    expect(bremse('Die Fenster machen wir nicht')).toEqual(['fenster'])
    expect(bremse('Die Heizkörper machen wir nicht')).toEqual(['heizkoerper'])
    expect(bremse('Keine Fenster')).toEqual(['fenster'])
    // Gegenprobe gegen ein zu weites `\bfenster` ohne Wortgrenze: die
    // Fensterbank ist ein anderes Bauteil und darf nicht mitgehen, wenn sie
    // nicht gemeint ist. Heute ist das so, und es hat so zu bleiben.
    expect(bremse('Die Fensterläden machen wir nicht')).toEqual([])
  })

  it.fails('PM-145-A · SOLL: „An den Fenstern machen wir nichts" nimmt den Fensterblock weg', () => {
    // Sperrklinke. Wortlaut des Solls, und er ist die Einzahl:
    // Die Mehrzahl im Wemfall muss dasselbe bewirken wie die Einzahl —
    // 635,90 € statt 835,90 €, mit Hinweiszeile, Zeile für Zeile gleich.
    const mehrzahl = lauf(`${T_BASIS} An den Fenstern machen wir nichts.`, WZ())
    const einzahl = lauf(`${T_BASIS} Am Fenster machen wir nichts.`, WZ())
    expect(titel(mehrzahl)).toEqual(titel(einzahl))
    expect(summe(mehrzahl)).toBe(635.9)
  })

  it.fails('PM-145-B · SOLL: „An den Heizkörpern machen wir nichts" nimmt den Heizkörperblock weg', () => {
    // Sperrklinke, dieselbe Zusicherung am zweiten Bauteil. Beide fallen mit
    // demselben Griff — wer nur eine der zwei Zeilen anfasst, sieht es hier.
    const mehrzahl = lauf(`${T_BASIS} An den Heizkörpern machen wir nichts.`, WZ())
    const einzahl = lauf(`${T_BASIS} Am Heizkörper machen wir nichts.`, WZ())
    expect(titel(mehrzahl)).toEqual(titel(einzahl))
    expect(summe(mehrzahl)).toBe(665.9)
  })

  it.fails('PM-145-C · SOLL: der Wegfall ist nicht stumm — mit Beleg, wie bei den vier anderen', () => {
    // Sperrklinke. Die Hinweiszeile gehört zum Soll, nicht als Zugabe:
    // DC-116/DC-128 — der Betrieb muss sehen, WORAUF sich das Weglassen
    // stützt. Der Wortlaut steht bereits in `BAUTEIL_WORT`.
    const { fehlende } = laufVoll(`${T_BASIS} An den Fenstern machen wir nichts.`, WZ())
    const spur = fehlende.find(f => /fenster/i.test(f))
    expect(spur, 'kein Fehlt-Eintrag zum Fenster').toBeDefined()
    expect(spur!).toMatch(/^⚠ „Wohnzimmer": Arbeiten an den Fenstern sind nicht im Angebot/)
    expect(spur!).toMatch(/gesagt: „An den Fenstern machen wir nichts"/)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-146 · Der Anstrich ohne Zahlwort — „Wände und Decke weiß."
//
// `ANSTRICH_OHNE_TAETIGKEITSWORT` verlangt heute die Zahlangabe unmittelbar
// vor der Farbe: „zweimal weiß" zählt, „weiß" allein nicht. Engineering hat
// das am 21.09. ausdrücklich als offene Frage an mich gegeben, und der Chief
// of Staff hat es am 22.09. bestätigt: Wortlaut, also meine Spur.
//
// Meine Entscheidung: die Zahlangabe FÄLLT als Bedingung. Zwei Gründe, beide
// gemessen und keiner aus dem Bauch:
//
// 1. Die Stufe davor kennt die Bedingung nicht. `extraktion-pipeline.ts`
//    liest `/streich|anstrich|weiß|weiss/` — nackt, ohne Zahlwort. Sie
//    schreibt „Wand streichen 2x" auf das Blatt. Die Gegenprobe hier ist
//    ENGER als die Erkennung davor, und genau diese Lücke kostet: dieselbe
//    Maschine setzt die Zeile und nimmt sie im selben Lauf wieder weg.
// 2. Die Gefahr, gegen die die Zahlangabe schützen sollte — „weiß" als
//    Gegenwart von „wissen" — ist an dieser Stelle klein und anders zu
//    fassen. Ein Teilsatz wird ohnehin nur dann zum Auftrag, wenn er NICHT
//    verneint ist; „ich weiß nicht, ob …" fällt schon dort heraus. Was übrig
//    bleibt, trägt ein Fürwort unmittelbar vor oder nach dem Wort.
//
// Wortlaut des Solls: „weiß" zählt als Anstrich-Auftrag, AUSSER unmittelbar
// davor oder dahinter steht ein Fürwort (ich, du, er, sie, es, man, wer,
// wir, ihr, das, dies …). An 16 Formulierungen gemessen: heute 6 falsch,
// nach dieser Regel 0.
//
// ⚠ Für den, der es baut: `\b` hinter `weiß` gibt es nicht — ß ist ohne
// u-Flag kein Wortzeichen. Es muss der Negativ-Ausblick `(?![a-zäöüß])`
// sein, sonst greift die Regel auch in „weiße" und „weißeln". Dieselbe
// Falle steht schon zweimal in dieser Datei.
// ───────────────────────────────────────────────────────────────────────────

const T_AUS = 'Wohnzimmer, 5 mal 4, Höhe 2,50. An den Wänden machen wir nichts.'

/** Heutige Regel, Zeichen für Zeichen aus `bauteil-ausschluss.ts`. */
const HEUTE = /(?:\b(?:ein|zwei|drei|vier)\s*-?\s*mal|\b\d+\s*(?:x|mal))\s+(?:in\s+)?wei(?:ß|ss)(?![a-zäöüß])/i
/** Mein Soll-Wortlaut. */
const VERB_WEISS = /\b(?:ich|du|er|sie|es|man|wer|wir|ihr|das|dies|jemand|keiner|niemand)\s+wei(?:ß|ss)(?![a-zäöüß])|wei(?:ß|ss)\s+(?:ich|du|er|sie|es|man|wer|wir|ihr)(?![a-zäöüß])/i
const FARBE_WEISS = /wei(?:ß|ss)(?![a-zäöüß])/i
const SOLL = (s: string) => FARBE_WEISS.test(s) && !VERB_WEISS.test(s)

/** Was der Handwerker sagt → ist das ein Anstrich-Auftrag? */
const FORMULIERUNGEN: Array<[string, boolean]> = [
  ['Wände und Decke zweimal weiß', true],
  ['Wände und Decke 2x weiß', true],
  ['Wände und Decke dreimal in Weiß', true],
  ['Wände und Decke weiß', true],
  ['Wände und Decke in Weiß', true],
  ['Die Wände weiß, die Decke auch', true],
  ['Wände komplett weiß', true],
  ['alles weiß', true],
  ['Decke weiß, Wände in Grau', true],
  ['Wände zweimal weiss', true],
  ['ich weiß nicht, ob die Wände drankommen', false],
  ['weiß ich noch nicht', false],
  ['das weiß der Kunde noch nicht', false],
  ['wer weiß das schon', false],
  ['Wände zweimal in einem hellen Grau', false],
  ['Die weiße Wand bleibt', false],
  ['Wände weißeln', false],
]

describe('PM-146 · der Anstrich-Auftrag ohne Zahlwort', () => {
  it('PM-146-1 · gemessener Stand: 6 von 17 Formulierungen liest die Gegenprobe falsch', () => {
    const falsch = FORMULIERUNGEN.filter(([s, soll]) => HEUTE.test(s) !== soll).map(([s]) => s)
    expect(falsch).toEqual([
      'Wände und Decke weiß',
      'Wände und Decke in Weiß',
      'Die Wände weiß, die Decke auch',
      'Wände komplett weiß',
      'alles weiß',
      'Decke weiß, Wände in Grau',
    ])
    // Alle sechs sind Aufträge, die nicht erkannt werden. In die andere
    // Richtung liegt die heutige Regel nie daneben — sie ist zu eng, nicht
    // zu weit. Das ist der Grund, warum das Soll unten lockern und nicht
    // festziehen muss.
    expect(falsch.every(s => FORMULIERUNGEN.find(([t]) => t === s)![1])).toBe(true)
  })

  it('PM-146-2 · gemessener Stand: ein fehlendes Zahlwort macht aus 465,90 € ein leeres Blatt', () => {
    // Dieselbe Selbstkorrektur wie in PM-134 („erst nichts, dann doch"),
    // nur ohne das Wort „zweimal". Mit Zahl steht das Angebot, ohne Zahl
    // steht NICHTS mehr darauf — Boden schützen und Sockelleisten hängen
    // als Folgepositionen an der Wand und fallen mit ihr.
    const mitZahl = lauf(`${T_AUS} Wände und Decke zweimal weiß.`, WZ())
    const ohneZahl = lauf(`${T_AUS} Wände und Decke weiß.`, WZ())
    expect(summe(mitZahl)).toBe(465.9)
    expect(hat(mitZahl, /^Wand streichen 2x/)).toBe(true)
    expect(titel(ohneZahl)).toEqual([])
    expect(summe(ohneZahl)).toBe(0)
    // Und mit dem Tätigkeitswort greift es wieder — es hängt allein an der
    // Farbe ohne Zahl davor.
    expect(summe(lauf(`${T_AUS} Wände und Decke weiß streichen.`, WZ()))).toBe(465.9)
  })

  it('PM-146-3 · mein Soll-Wortlaut, an allen 17 Formulierungen gemessen', () => {
    const falsch = FORMULIERUNGEN.filter(([s, soll]) => SOLL(s) !== soll).map(([s]) => s)
    expect(falsch).toEqual([])
    // Die zwei Fallen ausdrücklich festgehalten, weil sie in dieser Datei
    // schon zweimal Geld gekostet haben:
    expect(SOLL('Die weiße Wand bleibt')).toBe(false) // kein `\b` hinter ß
    expect(SOLL('Wände weißeln')).toBe(false)
  })

  it('PM-146-4 · die Gegenprobe, die beim Bauen grün bleiben muss', () => {
    // Das Verb „wissen" darf keinen Ausschluss aufheben. Heute stimmt das
    // aus zwei Gründen — die Regel ist eng, UND der Teilsatz ist verneint.
    // Nach dem Lockern trägt nur noch der zweite Grund, und für „das weiß
    // der Kunde" trägt auch der nicht mehr. Deshalb steht die Zeile hier:
    // wer PM-146-A baut, darf diese Fälle nicht mitnehmen.
    for (const satz of ['Ich weiß nicht, ob die Wände drankommen', 'Das weiß der Kunde noch nicht']) {
      const r = erkenneBauteilAusschluss(`${T_AUS} ${satz}.`, ['Wohnzimmer'])
      expect([...(r.jeRaum.get('Wohnzimmer') ?? new Set())], satz).toEqual(['wand'])
    }
  })

  it.fails('PM-146-A · SOLL: „Wände und Decke weiß." hebt den Ausschluss auf, wie „zweimal weiß"', () => {
    // Sperrklinke. Ein Zahlwort weniger darf nicht 465,90 € kosten — der
    // Handwerker hat sich anders überlegt, und das jüngere Wort gewinnt
    // (PM-134). Gemessen wird gegen die Fassung MIT Zahlwort, Zeile für
    // Zeile, nicht gegen eine Summe allein.
    const ohneZahl = lauf(`${T_AUS} Wände und Decke weiß.`, WZ())
    const mitZahl = lauf(`${T_AUS} Wände und Decke zweimal weiß.`, WZ())
    expect(titel(ohneZahl)).toEqual(titel(mitZahl))
    expect(summe(ohneZahl)).toBe(465.9)
  })
})
