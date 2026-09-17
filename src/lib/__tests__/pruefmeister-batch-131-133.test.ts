// Fallbasis — Batch PM-131 bis PM-133 (Prüfmeister, 17.09.2026, abends)
//
// Themenspeicher-Punkt 9, ganz: **`anzahlAus` sucht eine Zahl neben einem
// Wort — wo sonst steht diese Zahl aus einem ganz anderen Grund da?** Der
// Punkt war ausdrücklich als Messung am Ausdruck angelegt, nicht als
// Einzelfall. Die Familie ist größer als PM-128, und sie ist teurer.
//
//   PM-128 hängt an einem Komma                            → PM-131
//   „N Stück" irgendwo im Text wird die Stückzahl von allem → PM-132
//   die Ordnungszahl am Bauteil wird zur Stückzahl          → PM-133
//
// Der Ausdruck, um den es geht (`vollstaendigkeit/helpers.ts`, Zeile 175 ff.):
//
//   vorher          = (\d+)\s*(?:stück\s*)?(?:[a-zäöüß]+)?SCHLÜSSEL
//   nachher         = SCHLÜSSEL\s*(\d+)
//   stueckAllgemein = (\d+)\s*stück            ← ohne jeden Bezug zum Wort
//
// Er wird für dreizehn Schlüssel benutzt: zimmer · raum · räume · tür ·
// türen · fenster · heizkörper · pendelleuchte · spot · lamp · leuchte ·
// rosette · träger · meter · dübellöch · schadstell · rohr.
//
// Die drei Zweige gehen in drei Richtungen schief, und die dritte ist die
// schlimmste: **`stueckAllgemein` liest eine Zahl, die neben einem ganz
// anderen Wort steht, und schreibt sie an jedes Bauteil.** Gemessen an einem
// Flur: aus 457,25 € werden 9.277,25 €, weil im Diktat „50 Stück Fliesen"
// steht. Der Rechenweg auf dem Kundenpapier sagt dazu „50 Tür(en) **aus
// Transkript**" — er behauptet eine Herkunft, die es nicht gibt.
//
// Gegenrichtung, und sie gehört zum selben Ausdruck: **der gemeinte Fall
// wird verpasst.** „3 alte Türen lackieren." ergibt EINE Tür, weil zwischen
// „3" und „türen" ein Wort MIT Leerzeichen steht und `(?:[a-zäöüß]+)?` das
// Leerzeichen nicht mitnimmt. Der Ausdruck trifft, was er nicht meint, und
// verfehlt, wofür er da ist.
//
// Zu jedem Fund steht eine Kontrolle daneben — derselbe Fall ohne das
// fragliche Wort. Ohne Kontrolle ist ein Fund eine Behauptung.
//
// Aufbau wie `pruefmeister-batch-121-128.test.ts`: über die Pipeline, Text
// einmal am Eingang normalisiert (K.2). Dazu, wo der Themenspeicher es
// verlangt, die Messung direkt am Ausdruck.
//
// Fallbasis danach: 133 Fälle.
//
// Prüfmeister · 17.09.2026
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '../positions-gewerk'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ersetzeZahlenWorte } from '../zahlen-parser'
import { anzahlAus } from '../vollstaendigkeit/helpers'

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))
const katalog = (t: string) => DEFAULT_PRICES.find(p => p.title === t)!.unit_price

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function laufMalerVoll(transkript: string, raeume: any[]) {
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
  return pruefeUndErgaenzeVollstaendigkeit('maler', eng.positionen, text, meta as never, signale as never)
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const laufMaler = (t: string, r: any[]) => laufMalerVoll(t, r).positionen
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], m: RegExp) => pos.find(p => m.test(p.beschreibung))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function einzelpreis(p: any) {
  const g = gewerkFuerPosition(p.beschreibung, 'maler')
  return findePreisposition(p.beschreibung, p.einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))?.position.unit_price ?? null
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function summeNetto(pos: any[]) {
  let s = 0
  for (const p of pos) {
    const ep = einzelpreis(p)
    if (ep !== null) s += ep * p.menge
  }
  return Number(s.toFixed(2))
}

// Der Flur ist mit Absicht kein „…zimmer" — PM-128. So bleibt die Türzahl
// bei 1 und jede Abweichung gehört dem gemessenen Satz.
const FLUR = () => [raum('Flur', { laenge: 4, breite: 1.5, hoehe: 2.5, arbeiten: ['wände streichen'] })]
const KOPF = 'Flur 4 mal 1,50, Höhe 2,50. Wände streichen. '

const TUERBLOCK = () => katalog('Türen abschleifen') + katalog('Türen grundieren')
  + katalog('Türen lackieren (2× Anstrich)') + katalog('Türzarge lackieren')
const FENSTERBLOCK = () => katalog('Fenster abschleifen') + katalog('Fenster grundieren')
  + katalog('Fenster lackieren (2× Anstrich)')
const HEIZBLOCK = () => katalog('Heizkörper abschleifen') + katalog('Heizkörper grundieren')
  + katalog('Heizkörper streichen / lackieren')

// ───────────────────────────────────────────────────────────────────────────
// PM-131 · PM-128 hängt an einem Komma
//
// PM-128 hat den Auslöser als „Raumname auf …zimmer + erstes Maß" benannt.
// Das ist richtig, aber eine Stelle zu grob. Gemessen, zweimal derselbe
// Satz, einmal mit und einmal ohne das Komma hinter dem Raumnamen:
//
//   „Wohnzimmer, fünf mal vier, …"   → 1 Tür   ✅
//   „Wohnzimmer fünf mal vier, …"    → 5 Türen 🔴  (+ „5 Zimmer → je 1 Tür")
//
// Der Grund steht im Ausdruck: `nachher` ist `zimmer\s*(\d+)`, und `\s*`
// nimmt kein Komma mit. **Über 720,00 € entscheidet ein Satzzeichen, das
// niemand gesprochen hat** — es kommt aus der Spracherkennung.
//
// Das hat zwei Folgen, die größer sind als der Fall:
//
//   1. **Der Hero-Satz der Landingpage ist nur durch dieses Komma harmlos**
//      (PM-129/PM-130). Eine andere Transkription, und die Seite lädt zum
//      teuersten offenen Fehler ein.
//   2. **Jede Messung an einem „…zimmer"-Satz hängt an der Zeichensetzung
//      des Diktats.** Wer PM-128 nachmisst und ein Komma tippt, sieht den
//      Fehler nicht und hält ihn für behoben.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-131 · die Raumzahl hängt am Komma', () => {
  const MIT = 'Wohnzimmer, fünf mal vier, zwei sechzig hoch. Wände streichen. Die Türen lackieren.'
  const OHNE = 'Wohnzimmer fünf mal vier, zwei sechzig hoch. Wände streichen. Die Türen lackieren.'
  const WZ = () => [raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.6, arbeiten: ['wände streichen', 'tueren lackieren'] })]
  const tueren = (t: string) => finde(laufMaler(t, WZ()), /^Türen abschleifen/)!

  it('PM-131-K1 Kontrolle · beide Sätze unterscheiden sich in genau einem Zeichen', () => {
    expect(MIT.replace(',', '')).toBe(OHNE)
    expect(ersetzeZahlenWorte(MIT)).toContain('Wohnzimmer, 5 mal 4')
    expect(ersetzeZahlenWorte(OHNE)).toContain('Wohnzimmer 5 mal 4')
  })

  it('PM-131-K2 Kontrolle · mit Komma ist alles richtig: eine Tür, keine Annahme', () => {
    const z = tueren(MIT)
    expect(z.menge).toBe(1)
    expect(z.annahmen ?? []).toEqual([])
  })

  it('PM-131-A · ohne Komma ist es jetzt auch EIN Raum — das Satzzeichen entscheidet nichts mehr', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-081)
    //
    // Hier stand, dass derselbe Satz **ohne** das Komma 5 Türen ergibt, mit
    // der Annahme „5 Zimmer → je 1 Tür angenommen". Der Grund war `nachher`
    // (`zimmer\s*(\d+)`), und `\s*` nimmt kein Komma mit. Der Zweig ist weg:
    // eine Zahl **hinter** dem Wort ist eine Ordnungs- oder Maßzahl, keine
    // Menge. Damit ist „Wohnzimmer 5 mal 4" ein Maß, wie es gesprochen war.
    //
    // Gegenstand und Zählweise bleiben; nur die Richtung dreht sich. Die
    // Gegenprobe steht unverändert in PM-131-K2 und ist grün geblieben.
    const z = tueren(OHNE)
    expect(z.menge).toBe(1)
    expect(z.annahmen ?? []).toEqual([])
  })

  it('PM-131-B · der Geldweg ist zu: die beiden Sätze kosten jetzt dasselbe', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-081)
    //
    // Hier stand die Differenz 720,00 € zwischen denselben zwei Sätzen.
    // Der Türblock (180,00 €) wird weiter nachgerechnet — er ist der
    // Maßstab, an dem die Differenz gemessen wird, und muss stehen bleiben,
    // sonst misst die Zusicherung 0 gegen 0.
    expect(TUERBLOCK()).toBe(180)
    expect((5 - 1) * TUERBLOCK()).toBe(720)   // was es gekostet hätte
    expect(summeNetto(laufMaler(OHNE, WZ())) - summeNetto(laufMaler(MIT, WZ()))).toBe(0)
    // Und nicht nur gleich, sondern gleich **richtig** — nicht beide auf dem
    // teuren Wert. Gemessen: 663,00 € je Satz.
    expect(summeNetto(laufMaler(MIT, WZ()))).toBe(663)
    expect(summeNetto(laufMaler(OHNE, WZ()))).toBe(663)
  })

  it('PM-131-C · am Ausdruck: mit Komma wie ohne — beides ist ein Maß, keine Menge', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-081)
    //
    // Hier stand `…'wohnzimmer 4 mal 5'…).toBe(4)` gegen `…', 4 mal 5'…).toBe(0)`
    // — der gemessene Beleg, dass allein das Satzzeichen entschied. Beide
    // Sätze liefern jetzt denselben Wert, und zwar den richtigen.
    expect(anzahlAus('wohnzimmer 4 mal 5', 'zimmer', 0)).toBe(0)
    expect(anzahlAus('wohnzimmer, 4 mal 5', 'zimmer', 0)).toBe(0)
    // Die Gegenprobe, damit „0" nicht heißt, dass der Ausdruck nichts mehr
    // findet: eine echte Raumzahl **vor** dem Wort zählt weiter.
    expect(anzahlAus('2 zimmer streichen', 'zimmer', 0)).toBe(2)
  })

  // `.fails` gestrichen am 17.09.2026 (Engineering, CoS-E-081) — gebaut.
  it('PM-131-D · SOLL: ein Raum ist ein Raum, mit Komma wie ohne', () => {
    expect(tueren(OHNE).menge).toBe(1)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-132 · „N Stück" irgendwo im Text wird die Stückzahl von allem
//
// Der dritte Zweig von `anzahlAus` ist `(\d+)\s*stück`, **ohne jeden Bezug
// zum gesuchten Wort**. Er greift, sobald die ersten zwei Zweige nichts
// finden — also im Normalfall. Damit wird jede Stückzahl im Diktat zur
// Stückzahl jedes Bauteils, das der Satz bestellt.
//
// Gemessen am Flur, eine Tür bestellt, ein Nebensatz über Material dabei:
//
//   „Die Türen lackieren."                                   →  1 Tür
//   „Die Türen lackieren. Wir liefern 50 Stück Fliesen dazu." → 50 Türen
//
//   457,25 €  →  9.277,25 €      Unterschied: **8.820,00 €**
//
// Und der Rechenweg auf dem Kundenpapier lautet „50 Tür(en) **aus
// Transkript**". Das ist die Stelle, an der es aufhört, ein Rechenfehler zu
// sein: **die Zeile behauptet eine Herkunft, die es nicht gibt.** Bei einer
// Annahme steht „angenommen" daneben (PM-128); hier steht „aus Transkript",
// und im Transkript steht keine Türzahl. Die Gegenrichtung zu PM-023.
//
// Es ist auch nicht auf Fliesen beschränkt — jedes Stück tut es:
// „20 Stück Dübellöcher zumachen." → 20 Türen.
//
// Die Familie ist damit nicht „zimmer", sondern jeder der dreizehn
// Schlüssel: **eine Zahl mit „Stück" irgendwo im Diktat schlägt auf Türen,
// Fenster, Heizkörper, Leuchten, Spots und Rosetten gleichzeitig durch**,
// sobald die dazugehörige Arbeit bestellt ist.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-132 · die fremde Stückzahl', () => {
  const T_REIN = KOPF + 'Die Türen lackieren.'
  const T_FLIESEN = KOPF + 'Die Türen lackieren. Wir liefern 50 Stück Fliesen dazu.'
  const T_DUEBEL = KOPF + 'Die Türen lackieren. 20 Stück Dübellöcher zumachen.'
  // Gegenprobe zu PM-132-C: eine Zahl, die wirklich an der Tür steht.
  const T_DREI_C = KOPF + '3 alte Türen lackieren.'

  it('PM-132-K1 Kontrolle · ohne den Materialsatz: eine Tür, 457,25 €', () => {
    const p = laufMaler(T_REIN, FLUR())
    expect(finde(p, /^Türen abschleifen/)!.menge).toBe(1)
    expect(summeNetto(p)).toBe(457.25)
  })

  it('PM-132-A · „50 Stück Fliesen" lässt die Türzahl jetzt in Ruhe — alle drei Zeilen', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-081)
    //
    // Hier stand 50 auf allen drei Türzeilen. Zweig 3 (`(\d+)\s*stück`)
    // kannte das gesuchte Wort gar nicht und griff im Normalfall. Er ist
    // weg. Alle drei Zeilen werden weiter einzeln gemessen — der Fehler
    // schlug auf jede durch, also muss jede die Reparatur belegen.
    const p = laufMaler(T_FLIESEN, FLUR())
    expect(finde(p, /^Türen abschleifen/)!.menge).toBe(1)
    expect(finde(p, /^Türen lackieren/)!.menge).toBe(1)
    expect(finde(p, /^Türzarge lackieren/)!.menge).toBe(1)
  })

  it('PM-132-B · der Geldweg ist zu: der Materialsatz kostet nichts mehr', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-081)
    //
    // Hier stand 9.277,25 € gegen 457,25 € — 8.820,00 € aus einem Nebensatz
    // über Material, der teuerste gemessene Einzelfall dieses Projekts.
    // Der Satz mit und der Satz ohne den Nebensatz kosten jetzt dasselbe,
    // und zwar den Wert aus der Kontrolle PM-132-K1.
    expect(summeNetto(laufMaler(T_FLIESEN, FLUR()))).toBe(457.25)
    expect(summeNetto(laufMaler(T_REIN, FLUR()))).toBe(457.25)
    // Was es gekostet hätte — die Rechnung bleibt als Maßstab stehen.
    expect(Number((9277.25 - 457.25).toFixed(2))).toBe(8820)
    expect((50 - 1) * TUERBLOCK()).toBe(8820)
  })

  it('PM-132-C · der Rechenweg sagt nicht mehr „aus Transkript", wo keine Türzahl steht', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-081)
    //
    // Das war der zweite Teil des Auftrags und nicht der kleinere: die
    // Zeile druckte „50 Tür(en) **aus Transkript**", während im Transkript
    // keine Türzahl stand. „aus Transkript" ist das stärkere der beiden
    // Herkunftswörter (neben „angenommen", PM-023/PM-128) und hält einen
    // Menschen genau davon ab, nachzuschauen.
    //
    // Er ist **an der Wurzel** zu, nicht durch eine zweite Beschriftung:
    // seit die Zahl nur noch neben dem gesuchten Wort gelesen wird, kommt
    // keine fremde Zahl mehr bis zu dieser Zeile. Übrig bleibt der Fallback,
    // und der beschriftet sich seit CoS-E-065 selbst richtig.
    const z = finde(laufMaler(T_FLIESEN, FLUR()), /^Türen abschleifen/)!
    expect(z.berechnungsweg).toBe('1 Tür(en) angenommen')
    expect(z.berechnungsweg).not.toContain('aus Transkript')
    expect(z.annahmen ?? []).toEqual([])
    // Der Beleg des Prüfmeisters bleibt stehen: im Text steht keine Türzahl.
    expect(T_FLIESEN).not.toMatch(/50\s*(stück\s*)?tür/i)
    // Gegenprobe, damit „aus Transkript" nicht einfach verschwunden ist:
    // steht die Zahl wirklich am Wort, sagt die Zeile es weiter — zu Recht.
    const zd = finde(laufMaler(T_DREI_C, FLUR()), /^Türen abschleifen/)!
    expect(zd.berechnungsweg).toBe('3 Tür(en) aus Transkript')
  })

  it('PM-132-D · auch „20 Stück Dübellöcher" lässt die Türen in Ruhe — und zählt selbst richtig', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-081)
    //
    // Hier stand 20 Türen. Der Fall war der Beleg, dass es nicht am Wort
    // „Fliesen" lag, sondern am Zweig. Dazu die Gegenprobe, die vorher
    // niemand brauchte: die 20 gehört den **Dübellöchern** und muss dort
    // ankommen — ein Fix, der jede Stückzahl folgenlos macht, wäre kein Fix.
    expect(finde(laufMaler(T_DUEBEL, FLUR()), /^Türen abschleifen/)!.menge).toBe(1)
    expect(anzahlAus(ersetzeZahlenWorte(T_DUEBEL).toLowerCase(), 'dübellöch', 1)).toBe(20)
  })

  it('PM-132-E · am Ausdruck: eine Stückzahl am fremden Wort bleibt jetzt dort', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-081)
    //
    // Hier stand dreimal die fremde Zahl (50/50/20). Alle drei liefern
    // jetzt den Fallback: zwischen Zahl und gesuchtem Wort steht ein Komma,
    // und über ein Satzzeichen greift der Ausdruck nicht mehr hinweg.
    expect(anzahlAus('wir liefern 50 stück fliesen, tür lackieren', 'tür', 0)).toBe(0)
    expect(anzahlAus('wir liefern 50 stück fliesen, fenster streichen', 'fenster', 0)).toBe(0)
    expect(anzahlAus('20 stück dübellöcher, heizkörper lackieren', 'heizkörper', 0)).toBe(0)
    // Der Beleg des Prüfmeisters bleibt: ohne „Stück" war dieselbe Zahl
    // schon vorher folgenlos. Jetzt ist sie es mit „Stück" ebenso.
    expect(anzahlAus('wir liefern 50 fliesen, tür lackieren', 'tür', 0)).toBe(0)
    // Und die Gegenrichtung: „Stück" direkt am Wort zählt weiter.
    expect(anzahlAus('3 stück türen lackieren', 'tür', 0)).toBe(3)
  })

  // `.fails` gestrichen am 17.09.2026 (Engineering, CoS-E-081) — gebaut.
  it('PM-132-F · SOLL: eine Stückzahl gehört dem Wort, neben dem sie steht', () => {
    expect(finde(laufMaler(T_FLIESEN, FLUR()), /^Türen abschleifen/)!.menge).toBe(1)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-133 · die Ordnungszahl am Bauteil wird zur Stückzahl — und der
//          gemeinte Fall wird verpasst
//
// Der zweite Zweig ist `SCHLÜSSEL\s*(\d+)`. Handwerker nummerieren Bauteile
// beim Aufmaß durch, das ist die normale Sprache auf der Baustelle:
//
//   „Die Fenster streichen. Fenster 3 ist kaputt."     → 3 Fenster  🔴
//   „Die Heizkörper lackieren. Heizkörper 2 im Flur."  → 2 Heizkörper 🔴
//
// Zwei Fenster zu viel = 200,00 €, ein Heizkörper zu viel = 85,00 €. Beide
// ohne Annahme, beide mit einem Rechenweg, der „aus Transkript" sagt.
//
// ── Und die Gegenrichtung, im selben Ausdruck ────────────────────────────
//
// Der erste Zweig ist `(\d+)\s*(?:stück\s*)?(?:[a-zäöüß]+)?SCHLÜSSEL`. Das
// optionale Wort dazwischen darf **kein Leerzeichen** haben. Also:
//
//   „3 alte Türen lackieren."        → 1 Tür  🔴  (2 × 180 € zu wenig)
//   „die tür 1 und die tür 2 …"      → 1 Tür  🔴  (der erste Treffer gewinnt)
//
// Das Geld läuft hier **gegen den Betrieb** — dieselbe Richtung wie PM-127.
// Damit ist die Diagnose zu Punkt 9 vollständig: der Ausdruck trifft, was er
// nicht meint, und verfehlt, wofür er da ist. Ein Fix an einem Zweig allein
// verschiebt den Fehler nur.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-133 · die Ordnungszahl und der verpasste Normalfall', () => {
  const T_FENSTER = KOPF + 'Die Fenster streichen. Fenster 3 ist kaputt.'
  const T_FENSTER_K = KOPF + 'Die Fenster streichen.'
  const T_HEIZ = KOPF + 'Die Heizkörper lackieren. Heizkörper 2 im Flur.'
  const T_HEIZ_K = KOPF + 'Die Heizkörper lackieren.'
  const T_DREI = KOPF + '3 alte Türen lackieren.'

  it('PM-133-K1 Kontrolle · ohne den Nummernsatz: ein Fenster, ein Heizkörper', () => {
    expect(finde(laufMaler(T_FENSTER_K, FLUR()), /^Fenster abschleifen/)!.menge).toBe(1)
    expect(finde(laufMaler(T_HEIZ_K, FLUR()), /^Heizkörper abschleifen/)!.menge).toBe(1)
  })

  it('PM-133-A · „Fenster 3 ist kaputt" ist wieder eine Nummer, kein Dreierpack', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-081)
    //
    // Hier standen 3 Fenster auf beiden Zeilen, 200,00 € zu viel. Handwerker
    // nummerieren Bauteile beim Aufmaß durch — das ist normale Sprache auf
    // der Baustelle und darf keine Menge erzeugen. Der Fensterblock
    // (100,00 €) bleibt als Maßstab stehen.
    const p = laufMaler(T_FENSTER, FLUR())
    expect(finde(p, /^Fenster abschleifen/)!.menge).toBe(1)
    expect(finde(p, /^Fenster lackieren/)!.menge).toBe(1)
    expect(FENSTERBLOCK()).toBe(100)
    expect((3 - 1) * FENSTERBLOCK()).toBe(200)   // was es gekostet hätte
  })

  it('PM-133-B · „Heizkörper 2 im Flur" ist wieder eine Nummer', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-081)
    //
    // Hier standen 2 Heizkörper, 85,00 € zu viel. Dieselbe Ursache wie
    // PM-133-A, an einem anderen Bauteil gemessen — beide bleiben stehen,
    // damit der Zweig nicht an einem Einzelwort hängt.
    expect(finde(laufMaler(T_HEIZ, FLUR()), /^Heizkörper abschleifen/)!.menge).toBe(1)
    expect(HEIZBLOCK()).toBe(85)
  })

  it('PM-133-C · die Gegenrichtung ist zu: „3 alte Türen lackieren" sind drei Türen', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-081)
    //
    // Hier stand EINE Tür — 360,00 € **gegen den Betrieb**, dieselbe
    // Richtung wie PM-127. Grund: das optionale Wort zwischen Zahl und
    // Schlüssel durfte kein Leerzeichen haben. Jetzt sind bis zu zwei
    // Füllwörter erlaubt, solange kein Satzzeichen dazwischensteht.
    const p = laufMaler(T_DREI, FLUR())
    expect(finde(p, /^Türen abschleifen/)!.menge).toBe(3)
    expect(2 * TUERBLOCK()).toBe(360) // was dem Betrieb gefehlt hat, wie PM-127
    // Zusammengesetzte Wörter dürfen dabei nicht verloren gehen — der alte
    // Zweig konnte sie (ohne Leerzeichen), und CoS-E-058 hängt daran.
    expect(anzahlAus('die 4 innentüren lackieren', 'tür', 0)).toBe(4)
    expect(anzahlAus('die 3 alten innentüren lackieren', 'tür', 0)).toBe(3)
  })

  it('PM-133-D · am Ausdruck: das Zwischenwort darf jetzt ein Leerzeichen haben', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-081)
    //
    // Hier standen die beiden Nullen, die den Grund belegten. Die Grenze
    // liegt bewusst bei **zwei** Füllwörtern: je weiter der Ausdruck greift,
    // desto eher zieht er wieder eine Zahl aus dem Nebensatz.
    expect(anzahlAus('3 alte türen lackieren', 'tür', 0)).toBe(3)
    expect(anzahlAus('die 3 großen alten türen lackieren', 'tür', 0)).toBe(3)
    // Ohne Zwischenwort greift derselbe Zweig richtig — es ist das Leerzeichen.
    expect(anzahlAus('3 türen lackieren', 'tür', 0)).toBe(3)
    expect(anzahlAus('3 stück türen lackieren', 'tür', 0)).toBe(3)
  })

  it('PM-133-E · am Ausdruck: die Ordnungszahl hinter dem Wort zählt nicht mehr', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-081)
    //
    // Hier standen 3 und 2 für „fenster 3" und „heizkörper 2" — der Zweig
    // `SCHLÜSSEL\s*(\d+)` ist gestrichen, eine Zahl **hinter** dem Wort ist
    // eine Nummer. Die erste Zeile behält ihren Wert: „die tür 1 und die
    // tür 2" liefert weiter 1, jetzt aber über den Mengenzweig („1 und die
    // tür") statt über die Ordnungszahl. **Richtig wären 2** — das ist ein
    // eigener, unbeauftragter Fall und bleibt hier nur festgehalten.
    expect(anzahlAus('die tür 1 und die tür 2 lackieren', 'tür', 0)).toBe(1)
    expect(anzahlAus('fenster 3 ist kaputt', 'fenster', 0)).toBe(0)
    expect(anzahlAus('heizkörper 2 im flur', 'heizkörper', 0)).toBe(0)
    // Kontrolle, damit der Fund nicht „jede Zahl" heißt: eine Zahl, die
    // nicht direkt am Wort klebt, bleibt folgenlos.
    expect(anzahlAus('im 3. og, fenster streichen', 'fenster', 0)).toBe(0)
    expect(anzahlAus('baujahr 1974, tür lackieren', 'tür', 0)).toBe(0)
  })

  // `.fails` gestrichen am 17.09.2026 (Engineering, CoS-E-081) — gebaut.
  it('PM-133-F · SOLL: eine Nummer ist keine Stückzahl', () => {
    expect(finde(laufMaler(T_FENSTER, FLUR()), /^Fenster abschleifen/)!.menge).toBe(1)
  })

  // `.fails` gestrichen am 17.09.2026 (Engineering, CoS-E-081) — gebaut.
  it('PM-133-G · SOLL: „3 alte Türen" sind drei Türen', () => {
    expect(finde(laufMaler(T_DREI, FLUR()), /^Türen abschleifen/)!.menge).toBe(3)
  })
})
