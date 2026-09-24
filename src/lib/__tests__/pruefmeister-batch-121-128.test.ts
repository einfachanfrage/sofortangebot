// Fallbasis — Batch PM-121 bis PM-128 (Prüfmeister, 17.09.2026, nachmittags)
//
// Drei Antworten, zwei Auflagen, drei neue Fälle. Alle ohne laufende App
// geprüft, auf Sandys Rechner gemessen, nicht in der Ersatzumgebung.
//
//   Entsorgung Fliesenmaterial — Antwort auf Engineerings Frage 1  → PM-121
//   Titel der Duschnische      — Antwort auf Engineerings Frage 2  → PM-122
//   „nur die Wandfliesen": die Auflage zu PM-061-A, ganz           → PM-123
//   Altfliesen abstemmen, wenn Boden UND Wand fallen (Auflage)     → PM-124
//   die Verneinung mit Menge trifft auch Türen und Heizkörper      → PM-125
//   Reihenfolge INNERHALB der Hauptarbeit bei den Fliesen          → PM-126
//   der genannte Einheitspreis verschwindet spurlos                → PM-127
//   „Wohnzimmer vier mal fünf" wird als VIER ZIMMER gelesen        → PM-128
//
// Zu jedem Fund steht eine Kontrolle daneben — derselbe Fall ohne das
// fragliche Wort. Ohne Kontrolle ist ein Fund eine Behauptung.
//
// Im Text stehen die Fliesen-Fälle beieinander (121–124, 126) und die
// Maler-Fälle danach (125, 127, 128) — die Zahlenfolge ist deshalb nicht die
// Reihenfolge der Datei.
//
// Fallbasis danach: 128 Fälle.
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

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))
const katalog = (t: string) => DEFAULT_PRICES.find(p => p.title === t)!.unit_price
const katalogZeile = (t: string) => DEFAULT_PRICES.find(p => p.title === t)

// ── Fliesen: Engine + Vollständigkeitsprüfung, so wie der Endpunkt es tut ──
// Gleicher Aufbau wie `pruefmeister-batch-60-62.test.ts`; die Fliesen-Engine
// liest `bereiche` und `altbelag`, nicht `raeume`.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function laufFliesen(transkript: string, bereiche: any[], altbelag: any[] = []) {
  const eng = berechneMengen('fliesen', { transkript, bereiche, altbelag })
  const meta = { raeume: bereiche.map(b => ({ name: b.name, hoehe: null })) }
  const signale = {
    arbeitenTexte: [], belagText: null,
    altbelagEntfernen: altbelag.length > 0,
    raeume: bereiche.map(b => ({ name: b.name, arbeiten: [] })),
  }
  return pruefeUndErgaenzeVollstaendigkeit('fliesen', eng.positionen, transkript, meta as never, signale as never).positionen
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], m: RegExp) => pos.find(p => m.test(p.beschreibung))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const titel = (pos: any[]) => pos.map(p => p.beschreibung)
// Der Weg, den die App geht: Gewerk der Zeile bestimmen, dann im dafür
// zugelassenen Katalogausschnitt suchen.
function preisVon(beschreibung: string, einheit: string, gewerk = 'fliesen') {
  const g = gewerkFuerPosition(beschreibung, gewerk)
  return findePreisposition(beschreibung, einheit,
    KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))?.position.unit_price ?? null
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const preis = (pos: any[], m: RegExp) => {
  const p = finde(pos, m)
  return p ? preisVon(p.beschreibung, p.einheit) : null
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function summeNetto(pos: any[]) {
  let s = 0
  for (const z of pos) {
    const p = preisVon(z.beschreibung, z.einheit)
    if (p !== null) s += p * z.menge
  }
  return Math.round(s * 100) / 100
}

// Das Bad aus PM-060: alles neu, 16 m² Altbelag, Nassbereich.
const T_GANZ = 'Bad komplett neu fliesen, zwei Meter vierzig mal ein Meter achtzig, Fliesenhöhe zwo Meter zehn. Nassbereich, Dusche. Die alten Fliesen kommen raus, das sind sechzehn Quadratmeter.'
const POS_GANZ = () => laufFliesen(T_GANZ,
  [{ name: 'Bad', laenge: 2.4, breite: 1.8, flieshoehe: 2.1, nassbereich: true }],
  [{ bereich: 'Bad', flaeche: 16 }])

// Dasselbe Bad aus PM-061/PM-062: „nur die Wandfliesen", 18 m² Altbelag.
const T_NUR_WAND = 'Im Bad nur die Wandfliesen runter, die alten Fliesen an der Wand kommen weg, achtzehn Quadratmeter. Danach neu fliesen bis zwei Meter zehn. Bad ist zwei Meter vierzig mal ein Meter achtzig.'
const POS_NUR_WAND = () => laufFliesen(T_NUR_WAND,
  [{ name: 'Bad', laenge: 2.4, breite: 1.8, flieshoehe: 2.1, nassbereich: false }],
  [{ bereich: 'Bad', flaeche: 18 }])

// ───────────────────────────────────────────────────────────────────────────
// PM-121 · `Entsorgung Fliesenmaterial` — Antwort auf Engineerings Frage 1
//
// ── Die Frage ─────────────────────────────────────────────────────────────
//
// Engineering hat am 17.09. (CoS-E-078) sechs der sieben preislosen Zeilen
// des Bades an ihren Katalogpreis gebracht. Eine ist übrig, und zu der habe
// ich mir selbst widersprochen:
//
//   • PM-060-A rechnet `Fliesenschutt entsorgen (Container / Absackung)`
//     in die 1.935,94 € ein — es gäbe also eine Katalogzeile.
//   • PM-117 notiert in der Sollspalte „keine Katalogzeile" — es gäbe keine.
//
// ── Die Antwort: dieselbe Arbeit. PM-060-A hat recht, PM-117 war falsch ───
//
// Mein Fehler in PM-117 ist benennbar: Ich habe dort aufgeschrieben, was der
// Preis-Matcher findet, und es als Aussage über den Katalog hingeschrieben.
// „Der Matcher findet nichts" und „es gibt keine Katalogzeile" sind aber
// zwei verschiedene Sätze. Der erste stimmte, der zweite nicht.
//
// Fachlich ist es eine Arbeit, und zwar aus drei Gründen:
//
//   1. Die Menge. Die Engine schreibt die Zeile mit der Begründung „Gleiche
//      Fläche wie Demontage" — sie hängt an der abgestemmten Fläche, nicht
//      an der neu verlegten. Das ist Abbruchschutt, nichts anderes.
//   2. Die Einheit. Der Katalog führt den Abbruchschutt in m²
//      (`Fliesenschutt entsorgen`, 8,00 €/m²) — dieselbe Bezugsgröße.
//   3. Die Gegenkandidaten scheiden aus. `Fliesenreste / Bruch entsorgen`
//      (Pauschale, 35,00 €) ist der Verschnitt der NEUEN Fliesen, entsteht
//      also aus der Verlegung. `Altbelag-Schutt entsorgen (Container)`
//      rechnet in m³ — ein anderes Maß, das die Engine nicht liefert.
//      Es bleibt genau ein Kandidat mit derselben Einheit übrig.
//
// **Entscheidung: `Entsorgung Fliesenmaterial` ist `Fliesenschutt entsorgen
// (Container / Absackung)`, 8,00 €/m². Eine Zeile Synonym.** Der Wortlaut
// der Angebotszeile bleibt, wie er ist — „Entsorgung Fliesenmaterial" sagt
// dem Kunden, was weggefahren wird; „Fliesenschutt" ist Katalogsprache.
//
// Geld, gemessen an drei Bädern: 128,00 € (PM-060, 16 m²) · 144,00 €
// (PM-061, 18 m²) · 176,00 € (PM-117, 22 m²). Jedes Bad mit Altbelag.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-121 · Entsorgung Fliesenmaterial ist Fliesenschutt entsorgen', () => {
  it('PM-121-K1 Kontrolle · der Katalog führt genau einen m²-Kandidaten für Abbruchschutt', () => {
    const schutt = katalogZeile('Fliesenschutt entsorgen (Container / Absackung)')!
    expect(schutt.unit).toBe('m²')
    expect(schutt.unit_price).toBe(8)
    // Die beiden Gegenkandidaten — andere Einheit, anderer Gegenstand.
    expect(katalogZeile('Fliesenreste / Bruch entsorgen')!.unit).toBe('Pauschale')
    expect(katalogZeile('Altbelag-Schutt entsorgen (Container)')!.unit).toBe('m³')
  })

  it('PM-121-K2 Kontrolle · die Zeile hängt an der Abbruchfläche, nicht an der Verlegefläche', () => {
    // 16 m² abgestemmt → 16 m² entsorgt. Die neu verlegte Fläche ist eine
    // andere (4,75 m² Boden, 18,52 m² Wand) — die Zeile folgt ihr nicht.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const z = finde(POS_GANZ(), /^Entsorgung Fliesenmaterial/) as any
    expect(z.menge).toBe(16)
    expect(z.einheit).toBe('m²')
    expect(z.berechnungsweg).toMatch(/Demontage/i)
    expect(finde(POS_GANZ(), /^Altfliesen abstemmen/)!.menge).toBe(16)
  })

  it('PM-121-K3 Kontrolle · es liegt am Wortlaut, nicht am Gewerk oder am Katalogausschnitt', () => {
    // Dieselbe Zeile unter dem Katalogwort findet sofort ihre 8,00 €. Die
    // Zuordnung zum Gewerk `fliesen` stimmt in beiden Schreibweisen — es ist
    // also kein zweiter Fall von PM-117 (`/wand/`-Router), sondern reiner
    // Wortlaut. Gemeinsame Wörter nach der Normalisierung: null.
    expect(gewerkFuerPosition('Entsorgung Fliesenmaterial — Bad', 'fliesen')).toBe('fliesen')
    expect(preisVon('Fliesenschutt entsorgen — Bad', 'm²')).toBe(8)
  })

  it('PM-121-K4 Kontrolle · es war die einzige Zeile des Bades ohne Preis — jetzt ist keine mehr übrig', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-082)
    //
    // Diese Kontrolle hielt fest, dass `Entsorgung Fliesenmaterial` 0,00 €
    // trägt und die einzige solche Zeile ist. Genau das ist gebaut worden
    // (eine Zeile Synonym in `preis-matcher.ts`, wie PM-121 entschieden
    // hat) — sie hat also die Fehlstellung gemessen und ist durch den Bau
    // rot geworden. Der Satz des Prüfmeisters aus PM-097-C gilt: *eine
    // Kontrolle, die der Fix rot macht, ist keine Kontrolle.*
    //
    // Gegenstand und Zählweise bleiben; nur die Richtung dreht sich. Was
    // dieselbe Zeile kostet, steht unberührt in PM-121-K5.
    const p = POS_GANZ()
    expect(preis(p, /^Entsorgung Fliesenmaterial/)).toBe(8)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ohnePreis = p.filter((z: any) => preisVon(z.beschreibung, z.einheit) === null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(ohnePreis.map((z: any) => z.beschreibung.replace(/ — .*$/, ''))).toEqual([])
  })

  it('PM-121-K5 Kontrolle · der Geldweg, an drei Bädern gerechnet', () => {
    const satz = katalog('Fliesenschutt entsorgen (Container / Absackung)')
    expect(16 * satz).toBe(128)  // PM-060
    expect(18 * satz).toBe(144)  // PM-061 / PM-062
    expect(22 * satz).toBe(176)  // PM-117 — Engineerings Zahl, nachgerechnet
  })

  // `.fails` gestrichen am 17.09.2026 (Engineering, CoS-E-082) — gebaut.
  it('PM-121-A 🔴 SOLL: `Entsorgung Fliesenmaterial` findet 8,00 €/m²', () => {
    // Die Zusicherung schlägt an, sobald das Synonym gebaut ist. Entschieden
    // ist sie mit dieser Datei — Engineering darf bauen.
    expect(preis(POS_GANZ(), /^Entsorgung Fliesenmaterial/)).toBe(8)
  })

  // `.fails` gestrichen am 17.09.2026 (Engineering, CoS-E-082) — gebaut.
  it('PM-121-B 🔴 SOLL: danach trägt keine Zeile dieses Bades mehr 0,00 €', () => {
    const p = POS_GANZ()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const z of p) expect(preisVon(z.beschreibung, z.einheit), z.beschreibung).not.toBeNull()
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-122 · der Titel der Duschnische — Antwort auf Engineerings Frage 2
//
// ── Die Frage ─────────────────────────────────────────────────────────────
//
// Die Zeile heißt `Nische fliesen — Bad` statt der Katalogschreibweise
// `Nische / Wandnische fliesen`, weil „Wandnische" früher über `/wand/` beim
// Maler landete und dort preislos blieb (PM-075, Zusicherung 7). Seit
// CoS-E-078 ist diese Ursache weg; Engineering hat den Titel nicht angefasst
// und fragt, ob er zurück soll.
//
// ── Die Antwort: nein. Der Titel bleibt `Nische fliesen — Bad`. ───────────
//
// Nicht, weil die alte Ursache noch wirkt — sie wirkt nicht mehr, das ist
// unten gemessen. Sondern weil die Katalogschreibweise auf einem
// Kundenpapier nichts zu suchen hat: `Nische / Wandnische fliesen` ist ein
// Nachschlagewort mit zwei Namen für dieselbe Sache. Auf einem Angebot liest
// sich der Schrägstrich als offene Alternative — der Kunde fragt sich, ob er
// eine Nische oder eine Wandnische bekommt. Ein Angebot nennt eine Arbeit
// und einen Ort, nicht zwei Wörter zur Auswahl.
//
// Das ist dieselbe Richtung wie PM-062-B (der Titel nennt das Bauteil, das
// abgestemmt wird): der Titel wird zum Kunden hin schärfer, nicht zum
// Katalog hin. Der Katalogtitel bleibt der Schlüssel zum Preis; er ist nicht
// der Text, der gedruckt wird.
//
// Damit ist Frage 2 zu und Zusicherung 7 in `pm075-duschnische.test.ts`
// braucht keinen Nachtrag mehr.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-122 · der Titel der Duschnische bleibt', () => {
  const NISCHE = 'Nische / Wandnische fliesen'

  it('PM-122-K1 Kontrolle · es gibt keinen Preisgrund mehr für den kurzen Titel', () => {
    // Engineerings Messung, nachgemessen: beide Schreibweisen finden heute
    // dieselben 95,00 €. Die Einheit ist Stück, nicht m² — wer hier m²
    // einsetzt, misst an beiden Schreibweisen „kein Treffer" und hält den
    // Fund für breiter, als er ist.
    for (const t of ['Nische fliesen — Bad', 'Wandnische fliesen — Bad', NISCHE]) {
      expect(gewerkFuerPosition(t, 'fliesen'), t).toBe('fliesen')
      expect(preisVon(t, 'Stück'), t).toBe(95)
    }
    expect(katalogZeile(NISCHE)!.unit).toBe('Stück')
  })

  it('PM-122-A · entschieden: der gedruckte Titel trägt keine Schrägstrich-Alternative', () => {
    // Die Regel, die hier entschieden wird, und nicht nur der Einzelfall:
    // Ein Titel auf dem Kundenpapier nennt EINE Arbeit. Der Katalogtitel
    // darf zwei Wörter führen, die Angebotszeile nicht.
    const t = 'Nische fliesen — Bad'
    expect(t).not.toMatch(/\//)
    expect(NISCHE).toMatch(/\//)   // der Katalog darf das, das Angebot nicht
    expect(preisVon(t, 'Stück')).toBe(95)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-123 · „nur die Wandfliesen" — die Auflage zu PM-061-A, ganz
//
// Engineering hat PM-061-A zum obersten Punkt meiner Spur erklärt und
// ausdrücklich gefragt, ob eine Auflage nötig ist, bevor gebaut wird. Sie
// ist nötig, und zwar aus demselben Grund wie bei PM-117: **ein halber Fix
// sieht behoben aus und ist es nicht.**
//
// ── Gemessen, heute, an diesem einen Bad ──────────────────────────────────
//
//   Bodenfliesen verlegen      4,75 m²  × 38,00 =   180,50 €   ← nicht bestellt
//   Verfugung Boden            4,32 m²  × 10,00 =    43,20 €   ← nicht bestellt
//   Fliesensockel/Abschluss    8,40 lfdm× 12,00 =   100,80 €   ← nicht bestellt
//   Wandfliesen verlegen      18,52 m²  × 42,00 =   777,84 €   ← richtig
//   Verfugung Wand            17,64 m²  × 12,00 =   211,68 €   ← richtig
//   Altfliesen abstemmen      18,00 m²  × 18,00 =   324,00 €   ← Bodenpreis auf
//                                                                Wandabbruch
//   Entsorgung Fliesenmaterial18,00 m²  ×     0 =     0,00 €   ← PM-121
//   ───────────────────────────────────────────────────────
//   Summe heute                                   1.638,02 €
//   Summe richtig                                 1.529,52 €
//
// Drei Fehler in einem Angebot, und sie zeigen in verschiedene Richtungen:
// 324,50 € zu viel (PM-061-A), 72,00 € zu wenig (PM-062-A), 144,00 € zu
// wenig (PM-121). Wer nur PM-061-A baut, meldet „behoben" und lässt
// 216,00 € falsch stehen — diesmal zu Lasten des Betriebs.
//
// ── Die Auflage, vier Punkte ──────────────────────────────────────────────
//
//   1. Alle DREI Bodenzeilen fallen weg, nicht zwei. Der Fliesensockel
//      rechnet in lfdm und hängt am Umfang, nicht an der Bodenfläche — er
//      ist die Zeile, die beim Aufräumen übersehen wird.
//   2. Die Wandzeilen bleiben unberührt. Sie stehen auf denselben
//      Raummaßen wie die Bodenzeilen; ein Fix, der die Maße wegwirft, statt
//      die Bodenarbeit auszunehmen, nimmt sie mit. Das ist die Lehre aus
//      PM-105: eine Verneinung, die zu grob greift, löscht die im selben
//      Satz bestellte Arbeit mit.
//   3. Kein stiller Rückbau. Fällt der Boden weg, weil er ausgenommen
//      wurde, braucht es dafür keinen Fehlt-Eintrag — ausgenommen ist nicht
//      vergessen. Aber die Zeilen dürfen auch nicht kommentarlos
//      verschwinden, wenn die Ausnahme NICHT im Satz steht: das wäre PM-113
//      (leeres Angebot ohne Begründung) an einer neuen Stelle.
//   4. Die Gegenprobe gehört in denselben Zug: das Bad ohne „nur" (PM-060)
//      behält alle seine Bodenzeilen. Ein Auslöser, der auf das Wort „nur"
//      allein zielt, bricht sie.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-123 · Auflage zu PM-061-A', () => {
  it('PM-123-K1 Kontrolle · der Stand nach dem Bau, Zeile für Zeile', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-082)
    //
    // Hier standen die sieben Zeilen und die 1.638,02 € von heute morgen —
    // der Fund selbst. Drei davon sind weg (PM-123-A), eine heißt jetzt
    // nach ihrer Richtung (PM-062-B), und die Summe steht auf dem Soll des
    // Prüfmeisters. Die alte Liste ist damit keine Kontrolle mehr.
    //
    // Die alte Fassung, damit der Weg nachlesbar bleibt:
    //   Bodenfliesen verlegen · Verfugung Boden · Wandfliesen verlegen ·
    //   Verfugung Wand · Fliesensockel / Abschlussleiste ·
    //   Altfliesen abstemmen · Entsorgung Fliesenmaterial  →  1.638,02 €
    const p = POS_NUR_WAND()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(titel(p).map((t: string) => t.replace(/ — .*$/, ''))).toEqual([
      'Wandfliesen verlegen', 'Verfugung Wand',
      'Altfliesen abstemmen, Wand', 'Entsorgung Fliesenmaterial',
    ])
    expect(summeNetto(p)).toBe(1529.52)
  })

  it('PM-123-K2 Kontrolle · die 324,50 € stehen nicht mehr auf dem Kundenpapier', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-082)
    //
    // Hier stand, dass die drei Bodenzeilen seit CoS-E-078 ihren Preis
    // finden — 38,00 € · 10,00 € · 12,00 €, zusammen 324,50 € auf einer
    // Arbeit, die der Kunde ausgenommen hat. Das war der Fund, und er ist
    // gebaut: die Zeilen sind weg. Der Betrag wird weiter aus dem Katalog
    // gerechnet — er ist die Zahl, um die es ging und bleibt unberührt.
    const p = POS_NUR_WAND()
    const boden = 4.75 * katalog('Bodenfliesen Standard (30×30 bis 60×60cm), gerade, Q2')
    const fuge = 4.32 * katalog('Verfugen Boden')
    const sockel = 8.4 * katalog('Sockelleiste / Fliesensockel verlegen')
    expect(preis(p, /^Bodenfliesen verlegen/)).toBeNull()
    expect(preis(p, /^Verfugung Boden/)).toBeNull()
    expect(preis(p, /^Fliesensockel/)).toBeNull()
    expect(Math.round((boden + fuge + sockel) * 100) / 100).toBe(324.5)
  })

  it('PM-123-K3 Kontrolle · die Gegenprobe: ohne „nur" bleiben die Bodenzeilen stehen', () => {
    // Auflage Punkt 4. Bricht ein Fix diese Zusicherung, zielt er auf das
    // Wort statt auf den Sinn.
    const p = POS_GANZ()
    expect(finde(p, /^Bodenfliesen verlegen/)).toBeDefined()
    expect(finde(p, /^Verfugung Boden/)).toBeDefined()
    expect(finde(p, /^Fliesensockel/)).toBeDefined()
  })

  it('PM-123-K4 Kontrolle · die Rechnung der Auflage geht auf', () => {
    // 1.638,02 − 324,50 (PM-061-A) + 72,00 (PM-062-A) + 144,00 (PM-121)
    expect(Math.round((1638.02 - 324.5 + 72 + 144) * 100) / 100).toBe(1529.52)
    // und dieselbe Zahl von unten, aus den vier Zeilen, die bleiben sollen:
    const soll = 18.52 * katalog('Wandfliesen Standard (20×40 bis 30×60cm), gerade')
      + 17.64 * katalog('Verfugen Wand')
      + 18 * katalog('Altfliesen Wand abstemmen')
      + 18 * katalog('Fliesenschutt entsorgen (Container / Absackung)')
    expect(Math.round(soll * 100) / 100).toBe(1529.52)
  })

  // `.fails` gestrichen am 17.09.2026 (Engineering, CoS-E-082) — gebaut in
  // `fliesen-richtung.ts`; der Sockel steht dort ausdrücklich im Muster.
  it('PM-123-A 🔴 SOLL (Auflage 1): alle drei Bodenzeilen fallen weg, der Sockel auch', () => {
    const p = POS_NUR_WAND()
    expect(finde(p, /^Bodenfliesen verlegen/), 'Bodenfliesen').toBeUndefined()
    expect(finde(p, /^Verfugung Boden/), 'Verfugung Boden').toBeUndefined()
    expect(finde(p, /^Fliesensockel/), 'Fliesensockel').toBeUndefined()
  })

  it('PM-123-B · SOLL (Auflage 2): die Wandzeilen bleiben — heute grün, und das muss so bleiben', () => {
    // Bewusst als gewöhnliches `it`: Diese Zusicherung ist heute erfüllt.
    // Sie steht hier, damit ein Fix für PM-123-A sie nicht mitnimmt.
    const p = POS_NUR_WAND()
    expect(finde(p, /^Wandfliesen verlegen/)!.menge).toBe(18.52)
    expect(finde(p, /^Verfugung Wand/)!.menge).toBe(17.64)
    expect(finde(p, /^Altfliesen abstemmen/)!.menge).toBe(18)
  })

  // `.fails` gestrichen am 17.09.2026 (Engineering, CoS-E-082): PM-061-A,
  // PM-062-A und PM-121 sind zusammen gebaut. PM-124-A (beide Richtungen,
  // zwei Zeilen) steht weiter offen und ist hier nicht enthalten.
  it('PM-123-C 🔴 SOLL (Auflage, ganz): das Angebot steht bei 1.529,52 €', () => {
    // Die Zusicherung gegen den halben Fix. Sie schlägt erst an, wenn
    // PM-061-A, PM-062-A und PM-121 zusammen gebaut sind.
    expect(summeNetto(POS_NUR_WAND())).toBe(1529.52)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-124 · Altfliesen abstemmen, wenn Boden UND Wand fallen — Auflage auf
//          PM-062-A
//
// PM-062-A fordert bei Wandfliesen den Wandpreis (22,00 € statt 18,00 €).
// Das ist richtig — aber wer den Preis dieser einen Zeile umstellt, baut den
// nächsten Fehler ein. Denn im gewöhnlichen Bad (PM-060) kommen Boden UND
// Wand herunter, und die Engine schreibt dafür EINE Zeile mit EINER Menge:
//
//   `Altfliesen abstemmen — Bad`, 16,00 m², heute 18,00 €/m² = 288,00 €
//
// Diese 16 m² sind die Summe aus beidem. Es gibt keinen Preis, der für diese
// Zeile richtig ist: mit 18,00 € ist der Wandanteil zu billig, mit 22,00 €
// der Bodenanteil zu teuer. Der Katalog trennt (`Altfliesen Boden abstemmen
// (einlagig)` · `Altfliesen Wand abstemmen`), die Angebotszeile nicht.
//
// **Die Auflage: PM-062-A wird nicht durch einen Preiswechsel erfüllt,
// sondern durch eine Trennung der Zeile.** Wo nur eine Richtung abgestemmt
// wird, steht eine Zeile mit dem passenden Bauteil im Titel (PM-062-B); wo
// beide fallen, stehen zwei. Solange die Mengen nicht getrennt vorliegen,
// ist die ehrliche Form ein Fehlt-Eintrag nach der Aufteilung — nicht eine
// geratene Quote.
//
// Das ist dieselbe Familie wie TN-127 / PM-056-A: der Titel nimmt nicht,
// was im Raum liegt.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-124 · eine Abbruchzeile für zwei Preise', () => {
  it('PM-124-K1 Kontrolle · der Katalog trennt, mit 4,00 €/m² Unterschied', () => {
    expect(katalog('Altfliesen Boden abstemmen (einlagig)')).toBe(18)
    expect(katalog('Altfliesen Wand abstemmen')).toBe(22)
  })

  it('PM-124-K2 Kontrolle · im Komplettbad steht eine Zeile über beide Richtungen', () => {
    const p = POS_GANZ()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const abbruch = p.filter((z: any) => /^Altfliesen abstemmen/.test(z.beschreibung))
    expect(abbruch).toHaveLength(1)
    expect(abbruch[0].menge).toBe(16)
    expect(abbruch[0].beschreibung).not.toMatch(/boden|wand/i)
    // …und sie nimmt den Bodenpreis, obwohl die Wand mit drinsteckt.
    expect(preis(p, /^Altfliesen abstemmen/)).toBe(18)
  })

  it('PM-124-K3 Kontrolle · kein Preis ist für diese Zeile richtig', () => {
    // Die Spanne, in der die Wahrheit liegt: 16 m² ausschließlich Boden
    // wären 288,00 €, ausschließlich Wand 352,00 €. Welcher Anteil welcher
    // ist, sagt die Aufnahme nicht — deshalb ist auch 22,00 € kein Fix.
    expect(16 * 18).toBe(288)
    expect(16 * 22).toBe(352)
  })

  it.fails('PM-124-A 🔴 SOLL: fallen beide Richtungen, stehen zwei Abbruchzeilen', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const abbruch = POS_GANZ().filter((z: any) => /abstemmen/i.test(z.beschreibung))
    expect(abbruch.length).toBeGreaterThan(1)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(abbruch.some((z: any) => /boden/i.test(z.beschreibung))).toBe(true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(abbruch.some((z: any) => /wand/i.test(z.beschreibung))).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-126 · die Reihenfolge INNERHALB der Hauptarbeit (Themenspeicher,
//          Nachtrag 17.09. Punkt 6)
//
// PM-119 legt sieben Ausführungsstufen fest und schließt die Reihenfolge
// innerhalb einer Stufe ausdrücklich aus. Hier ist sie, gemessen.
//
// Das Komplettbad, in der Reihenfolge, in der die Zeilen entstehen:
//
//   0 Bodenfliesen verlegen        ← verlegt
//   1 Verbundabdichtung Boden      ← abgedichtet: zu spät
//   2 Verfugung Boden              ← verfugt: richtig
//   3 Wandfliesen verlegen         ← verlegt
//   4 Verfugung Wand               ← verfugt
//   5 Verbundabdichtung Wand       ← abgedichtet: noch später
//   6 Fliesensockel / Abschluss
//   7 Altfliesen abstemmen         ← der Abbruch, ganz am Ende
//   8 Entsorgung Fliesenmaterial
//
// Auf der Baustelle wird abgedichtet, dann verlegt, dann verfugt. Auf dem
// Papier steht es zweimal falsch, und an der Wand schlimmer als am Boden:
// dort steht die Abdichtung sogar hinter der Verfugung. Wer das liest,
// liest, dass hinter die fertig verfugte Wand noch Flüssigfolie gestrichen
// wird.
//
// Der Abbruch an Stelle 7 ist L-06 (PM-119, Stufe 2) — ein vierter Fall zu
// den drei dort gemessenen, im Gewerk Fliesen, das dort nicht vorkam.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-126 · Abdichten, verlegen, verfugen — in dieser Reihenfolge', () => {
  const idx = (m: RegExp) => titel(POS_GANZ()).findIndex((t: string) => m.test(t))

  it('PM-126-K1 Kontrolle · der Stand heute, als Reihenfolge', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(titel(POS_GANZ()).map((t: string) => t.replace(/ — .*$/, ''))).toEqual([
      'Bodenfliesen verlegen', 'Verbundabdichtung Boden', 'Verfugung Boden',
      'Wandfliesen verlegen', 'Verfugung Wand', 'Verbundabdichtung Wand',
      'Fliesensockel / Abschlussleiste', 'Altfliesen abstemmen',
      'Entsorgung Fliesenmaterial',
    ])
  })

  it('PM-126-K2 Kontrolle · verfugt wird nach dem Verlegen — die eine Hälfte stimmt am Boden', () => {
    expect(idx(/^Verfugung Boden/)).toBeGreaterThan(idx(/^Bodenfliesen verlegen/))
  })

  it.fails('PM-126-A 🔴 SOLL: am Boden wird abgedichtet, bevor verlegt wird', () => {
    expect(idx(/^Verbundabdichtung Boden/)).toBeLessThan(idx(/^Bodenfliesen verlegen/))
  })

  it.fails('PM-126-B 🔴 SOLL: an der Wand ebenso — und vor allem vor der Verfugung', () => {
    expect(idx(/^Verbundabdichtung Wand/)).toBeLessThan(idx(/^Wandfliesen verlegen/))
    expect(idx(/^Verbundabdichtung Wand/)).toBeLessThan(idx(/^Verfugung Wand/))
  })

  it.fails('PM-126-C 🔴 SOLL (L-06, vierter Fall): der Abbruch steht vor der Hauptarbeit', () => {
    // PM-119 Stufe 2 vor Stufe 5. Im Gewerk Fliesen bisher ungemessen.
    expect(idx(/^Altfliesen abstemmen/)).toBeLessThan(idx(/^Bodenfliesen verlegen/))
    expect(idx(/^Entsorgung Fliesenmaterial/)).toBeGreaterThan(idx(/^Wandfliesen verlegen/))
  })
})

// ── Maler: über die Pipeline, Text einmal am Eingang normalisiert (K.2) ────
// Gleicher Aufbau wie `pruefmeister-batch-104-116.test.ts`.
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
const fehltHat = (fehlende: string[], m: RegExp) => fehlende.some(f => m.test(f))

// Der Flur ist mit Absicht kein „…zimmer" — siehe PM-128. Ein Raumname mit
// `zimmer` hätte die Türzahl verfälscht und diese Messung unbrauchbar
// gemacht.
const FLUR = () => [raum('Flur', { laenge: 4, breite: 1.5, hoehe: 2.5, arbeiten: ['wände streichen'] })]
const KOPF_FLUR = 'Flur vier mal eins fünfzig, Höhe zwo fünfzig. Wände streichen. '

// ───────────────────────────────────────────────────────────────────────────
// PM-125 · die Verneinung mit Menge trifft auch Türen, Heizkörper und
//          Sockelleisten (Themenspeicher M.2)
//
// PM-105 hat das Muster an den Fenstern gefunden: „Die drei kleinen Fenster
// nicht, nur das große." löscht auch das große. Der Themenspeicher fragt
// seit dem 16.09., ob das ein Einzelfall ist — mit der ausdrücklichen
// Auflage, es **vor** PM-101 zu messen, weil PM-101 auf derselben Maschine
// aufbaut.
//
// Gemessen, drei Bauteile, dreimal dasselbe:
//
//   „Die drei schmalen Türen nicht, nur die breite."   → kein Türblock
//   „Die zwei alten Heizkörper nicht, nur den neuen."  → kein Heizkörperblock
//   „Die alten Sockelleisten nicht, nur die neuen."    → kein Sockelblock
//
// Damit ist es kein Einzelfall, sondern der Zustand der Verneinungsmaschine:
// **sie streicht den Block, in dem das verneinte Wort vorkommt, und nimmt
// die im selben Satz bestellte Arbeit mit.** In allen drei Fällen bleibt
// `fehlende` leer — es gibt keine Spur.
//
// Geld, am Flur gerechnet: der Türblock ist 180,00 € (20 + 25 + 90 + 45),
// der Heizkörperblock 85,00 € (20 + 25 + 40). Bestellt war je eins davon.
//
// Der Bauauftrag ist derselbe wie bei PM-105-A/B und PM-101: die bestellte
// Arbeit bleibt — oder der Satz hinterlässt wenigstens einen Fehlt-Eintrag.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-125 · die Verneinung mit Menge, jenseits der Fenster', () => {
  const T_TUER = KOPF_FLUR + 'Die Türen lackieren. Die drei schmalen Türen nicht, nur die breite.'
  const T_HEIZ = KOPF_FLUR + 'Die Heizkörper lackieren. Die zwei alten Heizkörper nicht, nur den neuen.'
  const T_SOCKEL = KOPF_FLUR + 'Die Sockelleisten lackieren. Die alten Sockelleisten nicht, nur die neuen.'

  it('PM-125-K1 Kontrolle · ausgeschrieben entsteht der Türblock, 180,00 €', () => {
    const p = laufMaler(KOPF_FLUR + 'Nur die breite Tür lackieren.', FLUR())
    expect(finde(p, /^Türen lackieren/)!.menge).toBe(1)
    expect(katalog('Türen abschleifen') + katalog('Türen grundieren')
      + katalog('Türen lackieren — 2× Anstrich') + katalog('Türzarge lackieren')).toBe(180)
  })

  it('PM-125-K2 Kontrolle · ausgeschrieben entsteht der Heizkörperblock, 85,00 €', () => {
    const p = laufMaler(KOPF_FLUR + 'Nur den neuen Heizkörper lackieren.', FLUR())
    expect(finde(p, /^Heizkörper lackieren/)!.menge).toBe(1)
    expect(katalog('Heizkörper abschleifen') + katalog('Heizkörper grundieren')
      + katalog('Heizkörper streichen / lackieren')).toBe(85)
  })

  it('PM-125-K3 Kontrolle · mit „auch" statt „nicht" bleibt der Türblock stehen', () => {
    const p = laufMaler(KOPF_FLUR + 'Die Türen lackieren. Die drei schmalen Türen auch.', FLUR())
    expect(finde(p, /^Türen lackieren/)).toBeDefined()
  })

  it('PM-125-K4 Kontrolle · die Wandarbeit bleibt in allen drei Fällen unberührt', () => {
    // Die Verneinung wirkt nicht wahllos auf das ganze Angebot — sie trifft
    // den Block. Das ist der Unterschied zwischen „zu grob" und „kaputt".
    for (const t of [T_TUER, T_HEIZ, T_SOCKEL]) {
      expect(finde(laufMaler(t, FLUR()), /^Wand streichen/), t).toBeDefined()
    }
  })

  it.fails('PM-125-A 🔴 die ausdrücklich bestellte Tür bleibt im Angebot', () => {
    const z = finde(laufMaler(T_TUER, FLUR()), /^Türen lackieren/)
    expect(z).toBeDefined()
    expect(z!.menge).toBe(1)
  })

  it.fails('PM-125-B 🔴 der ausdrücklich bestellte Heizkörper bleibt im Angebot', () => {
    const z = finde(laufMaler(T_HEIZ, FLUR()), /^Heizkörper lackieren/)
    expect(z).toBeDefined()
    expect(z!.menge).toBe(1)
  })

  it.fails('PM-125-C 🔴 dasselbe an den Sockelleisten', () => {
    expect(finde(laufMaler(T_SOCKEL, FLUR()), /Sockelleisten lackieren/)).toBeDefined()
  })

  // GELÖST am 21.09.2026 durch DC-135 (Product Designer, Antwort auf PD-024) —
  // derselbe Grund wie bei PM-105-B: der Ausschlusssatz reicht seinen Beleg
  // jetzt bis in `fehlende` durch. PM-125-A/B/C bleiben rot: die ausdrücklich
  // bestellte Tür bzw. der Heizkörper sind weiter nicht im Angebot.
  it('PM-125-D 🔴 oder der Satz hinterlässt wenigstens eine Spur', () => {
    // Die schwächere Forderung, dieselbe wie PM-105-B, PM-101-G, PM-103-A.
    expect(fehltHat(laufMalerVoll(T_TUER, FLUR()).fehlende, /tür/i), 'Tür').toBe(true)
    expect(fehltHat(laufMalerVoll(T_HEIZ, FLUR()).fehlende, /heizk/i), 'Heizkörper').toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-127 · der genannte Einheitspreis (Themenspeicher M.4)
//
// PM-111 misst den genannten PAUSCHALPREIS und hält fest, dass die App ihn
// nicht nimmt. Der Themenspeicher nennt den Einheitspreis als den leichteren
// Fall: „den Quadratmeter machen wir für zwölf Euro" ist auflösbar, wo eine
// Pauschale es nicht ist — die Menge steht ja daneben.
//
// Gemessen: Er ist genauso spurlos wie die Pauschale. Der Satz erzeugt
// nichts, ändert nichts und hinterlässt keinen Fehlt-Eintrag; das Angebot
// ist Zeichen für Zeichen dasselbe wie ohne ihn.
//
// Das Geld läuft diesmal gegen den Betrieb: `Wand streichen 2x` steht mit
// 9,50 €/m² im Standardkatalog, gesagt hat der Betrieb 12,00 €. Auf den
// 27,50 m² des Flurs sind das **68,75 €**, die er selbst genannt und nicht
// bekommen hat.
//
// Das ist die dritte Ausprägung derselben Regel wie L.5, DC-112 und PM-113:
// **was die Aufnahme sagt und die App nicht auflöst, muss als Frage übrig
// bleiben.** Eine Position darf daraus nicht werden — ein genannter Preis
// ist kein gemessener (PM-023) —, aber lautlos verschwinden darf er auch
// nicht.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-127 · der genannte Einheitspreis', () => {
  const T_EP = KOPF_FLUR + 'Den Quadratmeter machen wir für zwölf Euro.'

  it('PM-127-K1 Kontrolle · der Satz ändert am Angebot nichts, Zeichen für Zeichen', () => {
    expect(titel(laufMaler(T_EP, FLUR()))).toEqual(titel(laufMaler(KOPF_FLUR.trim(), FLUR())))
    expect(finde(laufMaler(T_EP, FLUR()), /^Wand streichen/)!.menge).toBe(27.5)
  })

  it('PM-127-K2 Kontrolle · der Geldweg: 68,75 € gegen den Betrieb', () => {
    expect(katalog('Wand streichen 2x Anstrich')).toBe(9.5)
    expect(Math.round(27.5 * (12 - 9.5) * 100) / 100).toBe(68.75)
  })

  it.fails('PM-127-A 🔴 SOLL: der genannte Preis bleibt als Frage übrig', () => {
    expect(fehltHat(laufMalerVoll(T_EP, FLUR()).fehlende, /euro|preis|quadratmeter/i)).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-128 · „Wohnzimmer vier mal fünf" wird als VIER ZIMMER gelesen
//
// Nebenbefund aus der Messung zu PM-125, und der teuerste dieses Batches.
//
// `maler-lackieren.ts` Zeile 59 zählt die Zimmer so:
//   `anzahlAus(lower, 'zimmer', …)`
// und findet in „wohnzimmer 4 mal 5" die 4. Aus vier Zimmern macht die
// Kette darunter vier Türen — je eine pro Zimmer, ausdrücklich als Annahme
// ausgewiesen (CoS-E-065). Die Annahme ist sauber gekennzeichnet; sie ist
// nur falsch, und zwar sichtbar auf dem Kundenpapier:
//
//   Türen abschleifen · 4 Stück · „4 Zimmer → je 1 Tür angenommen"
//
// Auf einem Angebot über EINEN Raum. Gemessen an fünf Fassungen:
//
//   „Wohnzimmer vier mal fünf …"    → 4 Türen  ← die erste Raumzahl
//   „Schlafzimmer drei mal vier …"  → 3 Türen  ← dieselbe Mechanik
//   „Flur vier mal eins fünfzig …"  → 1 Tür    ← kein „zimmer" im Namen
//   „Bad zwo vierzig mal …"         → 1 Tür    ← kein „zimmer" im Namen
//   „Im Wohnzimmer die Wände …"     → 1 Tür    ← „zimmer", aber keine Zahl
//
// Der Auslöser ist damit genau benannt: **ein Raumname auf „…zimmer",
// gefolgt von seinem ersten Maß.** Es ist nicht der Raumname allein und
// nicht die Zahl allein — beide zusammen.
//
// Geld: drei Türen zu viel, 3 × 180,00 € = **540,00 €** auf einem Angebot,
// das eine Tür nennt. Und es trifft den häufigsten Satz überhaupt, mit dem
// eine Aufnahme anfängt.
//
// Zwei Nebenwirkungen, die dazugehören:
//   • Es verfälscht Messungen. `WZ_MALER` in
//     `pruefmeister-batch-104-116.test.ts` steht auf „Wohnzimmer vier mal
//     fünf" — dort geht es um Fenster, die Türzahl fällt nicht auf.
//   • Die Herkunftsangabe ist richtig („angenommen"), die Zahl ist falsch.
//     Eine sauber gekennzeichnete Annahme schützt nicht vor einer falschen.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-128 · die Raumzahl aus dem Raumnamen', () => {
  const tuerenBei = (name: string, satz: string) => {
    const p = laufMaler(satz, [raum(name, { laenge: null, breite: null, hoehe: 2.5, arbeiten: ['wände streichen'] })])
    return finde(p, /^Türen abschleifen/)
  }

  it('PM-128-K1 Kontrolle · ohne „zimmer" im Namen steht genau eine Tür da', () => {
    expect(tuerenBei('Flur', 'Flur vier mal eins fünfzig, Höhe zwo fünfzig. Wände streichen. Die Türen lackieren.')!.menge).toBe(1)
    expect(tuerenBei('Bad', 'Bad zwo vierzig mal ein achtzig, Höhe zwo fünfzig. Wände streichen. Die Türen lackieren.')!.menge).toBe(1)
  })

  it('PM-128-K2 Kontrolle · „zimmer" ohne Zahl daneben reicht nicht', () => {
    expect(tuerenBei('Wohnzimmer', 'Im Wohnzimmer die Wände streichen. Die Türen lackieren.')!.menge).toBe(1)
  })

  it('PM-128-K3 Kontrolle · der Rechenweg bleibt gekennzeichnet — jetzt mit der richtigen Zahl', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-081)
    //
    // Diese Kontrolle hielt fest, dass die falsche Vier sauber als Annahme
    // ausgewiesen war: `annahmen = ['4 Zimmer → je 1 Tür angenommen']`. Sie
    // hat also die Fehlstellung mitgemessen und ist durch den Bau rot
    // geworden — der Satz aus PM-097-C gilt: *eine Kontrolle, die der Fix
    // rot macht, ist keine Kontrolle.*
    //
    // Gegenstand bleibt: **steht die Herkunft sichtbar am Rechenweg?** Ja.
    // Die Zahl kommt jetzt nicht mehr aus dem Raumnamen, sondern aus dem
    // Fallback, und sagt das auch. Die Zimmer-Annahme entfällt mit ihr —
    // es gibt keine vier Zimmer, über die etwas anzunehmen wäre.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const z = tuerenBei('Wohnzimmer', 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Wände streichen. Die Türen lackieren.') as any
    expect(z.menge).toBe(1)
    expect(z.berechnungsweg).toBe('1 Tür(en) angenommen')
    expect(z.berechnungsweg).not.toContain('aus Transkript')
    expect(z.annahmen ?? []).toEqual([])
  })

  it('PM-128-K4 Kontrolle · der Geldweg, der zu war: 540,00 €', () => {
    // Der Block bleibt als Maßstab stehen — er misst, was es gekostet hat.

    const block = katalog('Türen abschleifen') + katalog('Türen grundieren')
      + katalog('Türen lackieren — 2× Anstrich') + katalog('Türzarge lackieren')
    expect(block).toBe(180)
    expect((4 - 1) * block).toBe(540)
  })

  // `.fails` gestrichen am 17.09.2026 (Engineering, CoS-E-081) — gebaut.
  // Nicht eigens gebaut: PM-128 ist der Sonderfall der `anzahlAus`-Familie,
  // den der Chief of Staff in CoS-E-081 benannt hat („hängt am Komma hinter
  // dem Raumnamen"). Mit dem Zweig `SCHLÜSSEL\s*(\d+)` fällt er mit.
  it('PM-128-A · SOLL: ein Raum ist ein Raum, auch wenn er „Wohnzimmer" heißt', () => {
    expect(tuerenBei('Wohnzimmer', 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Wände streichen. Die Türen lackieren.')!.menge).toBe(1)
  })

  // `.fails` gestrichen am 17.09.2026 (Engineering, CoS-E-081) — gebaut.
  it('PM-128-B · SOLL: dasselbe beim Schlafzimmer — es ist die Mechanik, nicht das Wort', () => {
    expect(tuerenBei('Schlafzimmer', 'Schlafzimmer drei mal vier, Höhe zwo fünfzig. Wände streichen. Die Türen lackieren.')!.menge).toBe(1)
  })
})
