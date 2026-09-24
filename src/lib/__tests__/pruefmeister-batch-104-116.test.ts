// Fallbasis — Batch PM-104 bis PM-116 (Prüfmeister, 16.09.2026, abends)
//
// Dreizehn Fälle aus dem Themenspeicher (Abschnitte A, B, C, E, G und L) und
// aus dem Fund, den Engineering am 16.09. nebenbei gemessen und mir
// überlassen hat. Alle ohne laufende App prüfbar.
//
//   der Wortstamm „sockel" baut eine Innenposition            → PM-104
//   die Verneinung MIT Menge — sie wirkt, aber zu breit       → PM-105
//   Rückbezugswörter jenseits von „auch"                      → PM-106
//   Materialwörter: nur `holzfenster` hat einen eigenen Zweig → PM-107
//   Wandnische außerhalb des Bades                            → PM-108
//   Staubschutzwand und Abendreinigung, bewohnte Baustelle    → PM-109
//   Estrich rissig, muss verharzt werden                      → PM-110
//   der Handwerker nennt seinen Preis selbst                  → PM-111
//   der Handwerker nennt Stunden statt Mengen                 → PM-112
//   die sehr kurze Aufnahme                                   → PM-113
//   widersprüchliche Angaben im selben Diktat                 → PM-114
//   Nachtrag zu einem bestehenden Angebot                     → PM-115
//   zwei Bauabschnitte, der zweite ausdrücklich ausgenommen   → PM-116
//
// Aufbau wie `pruefmeister-batch-101-103.test.ts`: über die Pipeline, Text
// einmal am Eingang normalisiert (K.2). Zu jedem Fund steht eine Kontrolle
// daneben — derselbe Satz ohne das fragliche Wort. Ohne Kontrolle ist ein
// Fund eine Behauptung.
//
// Fallbasis danach: 116 Fälle.
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const titel = (pos: any[]) => pos.map(p => p.beschreibung)
const fehltHat = (fehlende: string[], m: RegExp) => fehlende.some(f => m.test(f))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function preis(pos: any[], m: RegExp, gewerk: string) {
  const p = finde(pos, m)
  if (!p) return null
  const g = gewerkFuerPosition(p.beschreibung, gewerk)
  return findePreisposition(p.beschreibung, p.einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))?.position.unit_price ?? null
}
const katalog = (t: string) => DEFAULT_PRICES.find(p => p.title === t)!.unit_price
const katalogZeile = (t: string) => DEFAULT_PRICES.find(p => p.title === t)

const WZ_MALER = () => [raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: ['wände streichen'] })]
const WZ_BODEN = () => [raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: [], belag: 'laminat' })]

// ───────────────────────────────────────────────────────────────────────────
// PM-104 · der Wortstamm „sockel" baut eine Innenposition
//
// Von Engineering am 16.09. beim Beantworten der PM-074-Frage gemessen und
// mir überlassen. Gegengemessen, beide Hälften stimmen:
//
//   „Der Sockelputz außen ist drei Meter lang."  → Sockelleisten montieren
//                                                   3,00 lfdm × 5,50 = 16,50 €
//   „In der Ecke steht ein Kaminsockel. Der ist
//    ein mal ein Meter, da muss ausgespart werden." → 1,00 lfdm =  5,50 €
//
// Zwei Sätze, die beide KEINE Sockelleiste bestellen. Der erste nennt ein
// Bauteil an der AUSSENWAND, der zweite einen Kaminsockel, um den herum
// ausgespart werden soll — also ausdrücklich weniger Arbeit, nicht mehr.
//
// Damit verallgemeinert PM-104 den Fund PM-074: Auslöser ist nicht der
// Nebensatz und nicht das Maß im selben Satz, sondern der WORTSTAMM „sockel"
// (`extrahiereLfdm(lower, 'sockel')` in `boden-vorarbeiten.ts`) — dieselbe
// Form wie „Sperrmüll"/„absperren" in PM-064. Ohne das Wort entsteht nichts;
// das ist die Kontrolle.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-104 · der Wortstamm „sockel"', () => {
  const T_PUTZ = 'Wohnzimmer vier mal fünf. Laminat verlegen. Der Sockelputz außen ist drei Meter lang.'
  const T_KAMINSOCKEL = 'Wohnzimmer vier mal fünf. Laminat verlegen. In der Ecke steht ein Kaminsockel. Der ist ein mal ein Meter, da muss ausgespart werden.'
  const T_KAMIN = 'Wohnzimmer vier mal fünf. Laminat verlegen. In der Ecke steht ein Kamin. Der ist ein mal ein Meter, da muss ausgespart werden.'
  const T_NACKT = 'Wohnzimmer vier mal fünf. Laminat verlegen.'

  it('PM-104-C · Kontrolle: ohne das Wort „Sockel" entsteht keine Sockelleiste', () => {
    expect(finde(lauf('boden_parkett', T_KAMIN, WZ_BODEN()), /Sockelleisten montieren/i)).toBeUndefined()
    expect(titel(lauf('boden_parkett', T_KAMIN, WZ_BODEN()))).toEqual(titel(lauf('boden_parkett', T_NACKT, WZ_BODEN())))
  })

  // 16.09.2026, Engineering: Diese Kontrolle hing am FEHLER — sie las den Preis
  // an genau der Zeile ab, die „Sockelputz" fälschlich erzeugt hat. Seit
  // PM-104-A gebaut ist, gibt es diese Zeile nicht mehr. Die Aussage der
  // Kontrolle („der Geldweg ist echt, es ist keine Nullzeile") bleibt wörtlich
  // stehen — sie wird nur an einem Satz gemessen, der Sockelleisten wirklich
  // bestellt.
  it('PM-104-D · Kontrolle: der Geldweg steht im Katalog, es ist keine Nullzeile', () => {
    const T_BESTELLT = 'Wohnzimmer vier mal fünf. Laminat verlegen. Sockelleisten neu.'
    expect(preis(lauf('boden_parkett', T_BESTELLT, WZ_BODEN()), /Sockelleisten montieren/i, 'boden_parkett')).toBe(5.5)
  })

  // GEBAUT 16.09.2026 (Zug 3, Head of Product Engineering) — zusammen mit
  // PM-074: Wortgrenze statt Wortstamm (`SOCKEL_ALLEIN` in
  // `boden-vorarbeiten.ts`). Beide Sperrklinken hier auf `it` umgestellt.
  it('✅ PM-104-A · „Sockelputz außen" erzeugt keine Innen-Sockelleiste', () => {
    // War: `Sockelleisten montieren — Wohnzimmer`, 3,00 lfdm, 16,50 €.
    // Ein Bauteil an der Außenwand baut eine Innenposition.
    expect(finde(lauf('boden_parkett', T_PUTZ, WZ_BODEN()), /Sockelleisten montieren/i)).toBeUndefined()
  })

  it('✅ PM-104-B · „Kaminsockel … aussparen" erzeugt keine Sockelleiste', () => {
    // War: 1,00 lfdm, 5,50 €. Das Maß steht im FOLGESATZ — der Auslöser ist
    // also nicht der Nebensatz, sondern das Wort.
    expect(finde(lauf('boden_parkett', T_KAMINSOCKEL, WZ_BODEN()), /Sockelleisten montieren/i)).toBeUndefined()
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-105 · die Verneinung MIT Menge — sie wirkt, und zwar zu breit
//
// Die vierte Stufe der Verneinungsklasse aus L.1, und sie fällt in die
// GEGENRICHTUNG von PM-099 und PM-101. Dort bleibt die Verneinung wirkungslos;
// hier wirkt sie — aber sie nimmt auch das mit, was im selben Satz BESTELLT
// wird.
//
//   „Die Fenster lackieren. Die drei kleinen Fenster nicht, nur das große."
//
//   Soll (= Kontrolle „Nur das große Fenster lackieren."):
//     Fenster abschleifen    1 Stück × 20,00 =  20,00 €
//     Fenster grundieren     1 Stück × 25,00 =  25,00 €
//     Fenster lackieren 2x   1 Stück × 55,00 =  55,00 €
//                                      Summe   100,00 €
//   Ist: keine einzige Fensterzeile. 100,00 € bestellte Arbeit fällt weg,
//        `fehlende` bleibt leer.
//
// Isoliert gemessen, der Auslöser ist eindeutig:
//   „Die drei kleinen Fenster auch."  → Block bleibt stehen (PM-105-D)
//   „Die Heizkörper nicht."           → Block bleibt stehen (PM-105-E)
// Es ist also das Paar aus Bauteilwort und „nicht", nicht die Zahl und nicht
// die Verneinung an sich.
//
// ⚠️ Warnung an Engineering, bevor PM-099/PM-101 gebaut werden: Die Maschine,
// die eine Verneinung in Wirkung übersetzt, ist an dieser Stelle schon da —
// und sie ist zu grob. Wer PM-101 baut, baut auf diesem Stück auf.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-105 · die Verneinung mit Menge', () => {
  const KOPF = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Wände streichen. Die Fenster lackieren. '
  const T_VERNEINT = KOPF + 'Die drei kleinen Fenster nicht, nur das große.'
  const T_SOLL = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Wände streichen. Nur das große Fenster lackieren.'

  it('PM-105-C · Kontrolle: ausgeschrieben entsteht genau ein Fenster, 100,00 €', () => {
    const p = lauf('maler', T_SOLL, WZ_MALER())
    expect(finde(p, /^Fenster lackieren/)!.menge).toBe(1)
    expect(katalog('Fenster abschleifen') + katalog('Fenster grundieren')
      + katalog('Fenster lackieren (2× Anstrich)')).toBe(100)
  })

  it('PM-105-D · Kontrolle: mit „auch" statt „nicht" bleibt der Block stehen', () => {
    expect(finde(lauf('maler', KOPF + 'Die drei kleinen Fenster auch.', WZ_MALER()), /^Fenster lackieren/)).toBeDefined()
  })

  it('PM-105-E · Kontrolle: die Verneinung wirkt nicht wahllos', () => {
    // „Die Heizkörper nicht." lässt den Fensterblock unberührt — die Zuordnung
    // Bauteil ↔ Verneinung stimmt also im Grundsatz.
    expect(finde(lauf('maler', KOPF + 'Die Heizkörper nicht.', WZ_MALER()), /^Fenster lackieren/)).toBeDefined()
  })

  it.fails('PM-105-A · das ausdrücklich bestellte große Fenster bleibt im Angebot', () => {
    // Ist: keine Fensterzeile. 100,00 € bestellte Arbeit fällt mit der
    // Verneinung der anderen drei weg.
    const fenster = finde(lauf('maler', T_VERNEINT, WZ_MALER()), /^Fenster lackieren/)
    expect(fenster).toBeDefined()
    expect(fenster!.menge).toBe(1)
  })

  // GELÖST am 21.09.2026 durch DC-135 (Product Designer, Antwort auf PD-024).
  // Die Sperrklinke stand auf `it.fails`, weil der Verneinungssatz spurlos
  // blieb. Seit `bauteil-ausschluss.ts` seine Belege mitreicht, entsteht ein
  // Fehlt-Eintrag „⚠ Arbeiten an den Fenstern sind nicht im Angebot —
  // gesagt: …". PM-105-A bleibt offen: eine Spur ist noch kein zurückgeholtes
  // Fenster, und 100,00 € bestellte Arbeit fehlen weiter.
  it('PM-105-B · oder der Satz hinterlässt wenigstens eine Spur', () => {
    // Die schwächere Forderung, dieselbe wie PM-101-G und PM-103-A.
    expect(fehltHat(laufVoll('maler', T_VERNEINT, WZ_MALER()).fehlende, /fenster/i)).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-106 · Rückbezugswörter jenseits von „auch"
//
// PM-103 misst nur „auch". Themenspeicher L.2 fragt nach den übrigen. Vier
// Fassungen gemessen, alle vier verhalten sich gleich — und gleich falsch:
// keine Türposition (richtig, nichts erfunden) UND `fehlende` leer (falsch,
// 720,00 € verschwinden lautlos).
//
//   „Die Türen ebenso."                      → keine Spur
//   „Bei den Türen das gleiche nochmal."     → keine Spur
//   „Türen dito."                            → keine Spur
//   „Die Türen genauso wie die Heizkörper."  → keine Spur
//
// Damit ist PM-103 kein Einzelfall, sondern eine Klasse. Der Bauauftrag ist
// derselbe: ein Fehlt-Eintrag, keine Position.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-106 · Rückbezugswörter', () => {
  const R = () => [raum('Flur', { laenge: 4, breite: 1.5, hoehe: 2.5, arbeiten: [] })]
  const KOPF = 'Flur vier mal eins fünfzig, Höhe zwo fünfzig. Zwei Heizkörper lackieren. '
  const WOERTER: Array<[string, string]> = [
    ['ebenso', 'Die Türen ebenso. Vier Innentüren.'],
    ['das gleiche nochmal', 'Bei den Türen das gleiche nochmal. Vier Innentüren.'],
    ['dito', 'Türen dito. Vier Innentüren.'],
    ['genauso wie', 'Die Türen genauso wie die Heizkörper. Vier Innentüren.'],
  ]

  it('PM-106-C · Kontrolle: ausgeschrieben entstehen die vier Türen vollständig', () => {
    const p = lauf('maler', KOPF + 'Vier Innentüren lackieren.', R())
    expect(finde(p, /Türen lackieren/i)!.menge).toBe(4)
    expect(finde(p, /Türzarge lackieren/i)!.menge).toBe(4)
  })

  it('PM-106-D · Kontrolle: der Geldweg ist derselbe wie bei PM-103 — 720,00 €', () => {
    const je = katalog('Türen abschleifen') + katalog('Türen grundieren')
      + katalog('Türen lackieren — 2× Anstrich') + katalog('Türzarge lackieren')
    expect(je * 4).toBe(720)
  })

  for (const [name, satz] of WOERTER) {
    it(`PM-106-${name} · die Regel hält: keine erfundene Türposition`, () => {
      expect(titel(lauf('maler', KOPF + satz, R())).some(t => /Tür(en|zarge)/i.test(t))).toBe(false)
    })

    it.fails(`PM-106-A · „${name}" hinterlässt eine Spur`, () => {
      expect(fehltHat(laufVoll('maler', KOPF + satz, R()).fehlende, /tür|zarge/i)).toBe(true)
    })
  }
})

// ───────────────────────────────────────────────────────────────────────────
// PM-107 · Materialwörter: nur `holzfenster` hat einen eigenen Zweig
//
// Themenspeicher L.3. Gemessen, alle vier Fassungen desselben Satzes:
//
//   „Ein Alufenster, eine Tür."          → keine Lackierarbeit  ✅
//   „Ein Kunststofffenster, eine Tür."   → keine Lackierarbeit  ✅
//   „Eine Stahlzarge, ein Fenster."      → keine Lackierarbeit  ✅
//   „Ein Holzfenster, eine Tür."         → 100,00 € + Nullzeile ❌ (PM-102)
//
// Das ist eine gute Nachricht und ein enger Bauauftrag zugleich: Der Fehler
// aus PM-102 sitzt NICHT in einer allgemeinen Materialregel, sondern an genau
// einem Wort. Wer PM-102 baut, muss nur diesen einen Zweig anfassen — und die
// drei Zeilen hier sind die Kontrolle, dass dabei nichts Neues aufgeht.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-107 · Materialwörter', () => {
  const KOPF = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Wände und Decke zweimal weiß streichen. '
  const LACK = /Fenster (abschleifen|grundieren|lackieren)/i

  for (const satz of ['Ein Alufenster, eine Tür.', 'Ein Kunststofffenster, eine Tür.', 'Eine Stahlzarge, ein Fenster.']) {
    it(`PM-107-C · „${satz}" ist Bestand und erzeugt keine Lackierarbeit`, () => {
      expect(titel(lauf('maler', KOPF + satz, WZ_MALER())).some(t => LACK.test(t))).toBe(false)
      expect(titel(lauf('maler', KOPF + satz, WZ_MALER()))).toEqual(titel(lauf('maler', KOPF.trim(), WZ_MALER())))
    })
  }

  it.fails('PM-107-A · „Holzfenster" verhält sich wie „Alufenster"', () => {
    // Ist: Holz erzeugt 100,00 € plus die Nullzeile `Abdecken Umgebung`,
    // Alu erzeugt nichts. Ein Wort Unterschied, 100,00 € Unterschied.
    // Diese Prüfung wird grün, wenn PM-102 gebaut ist — und sie ist die
    // engste Fassung des Bauauftrags.
    expect(titel(lauf('maler', KOPF + 'Ein Holzfenster, eine Tür.', WZ_MALER())))
      .toEqual(titel(lauf('maler', KOPF + 'Ein Alufenster, eine Tür.', WZ_MALER())))
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-108 · Wandnische außerhalb des Bades
//
// Themenspeicher A. „In der Wand ist eine Regalnische, ein mal zwei Meter,
// die wird mitgestrichen." → keine Position, `fehlende` leer.
//
// Der Katalog ist hier die eigentliche Auskunft: Für das TAPEZIEREN von
// Nischen gibt es einen Aufpreis (`Ecken / Nischen / Laibungen tapezieren`,
// 6,00 €/lfdm, für Maler erreichbar), für das STREICHEN gibt es nichts. Die
// Laibungsflächen einer Nische sind Mehrarbeit auf derselben Grundfläche —
// der m²-Preis der Wand deckt sie nicht ab.
//
// Damit ist PM-108 zweierlei: eine Kataloglücke von genau einer Zeile und,
// bis die Zeile da ist, ein fehlender Fehlt-Eintrag.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-108 · Wandnische', () => {
  const T = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Wände streichen. In der Wand ist eine Regalnische, ein mal zwei Meter, die wird mitgestrichen.'

  it('PM-108-C · Katalog: der Aufpreis gibt es fürs Tapezieren, nicht fürs Streichen', () => {
    const tap = katalogZeile('Ecken / Nischen / Laibungen tapezieren (Aufpreis)')!
    expect(tap.unit_price).toBe(6)
    expect(preisKategoriePasstZuGewerk(tap.category, 'maler')).toBe(true)
    expect(DEFAULT_PRICES.some(p => /nisch/i.test(p.title) && /streich/i.test(p.title))).toBe(false)
  })

  it('PM-108-D · Kontrolle: gemessen — der Satz ändert die Liste heute nicht', () => {
    expect(titel(lauf('maler', T, WZ_MALER())))
      .toEqual(titel(lauf('maler', 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Wände streichen.', WZ_MALER())))
  })

  // Grün seit dem PM-089-Fix (17.09.2026, Engineering) — derselbe Fall,
  // dieselbe Reparatur: `pruefeNische` in `vollstaendigkeit/maler-sonder.ts`.
  it('PM-108-A · die mitgestrichene Nische hinterlässt eine Spur', () => {
    expect(fehltHat(laufVoll('maler', T, WZ_MALER()).fehlende, /nisch|laibung|leibung/i)).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-109 · Staubschutzwand und Abendreinigung, bewohnte Baustelle
//
// Themenspeicher B. Der Satz erkennt das Bewohntsein richtig — `Möbel
// abdecken mit Folie` und der `Erschwerniszuschlag bewohnter Bereich` (10 %)
// entstehen. Die zwei AUSDRÜCKLICH GESAGTEN Leistungen entstehen nicht:
//
//   Staubschutzwand / Trennwand …   Abbruch – Baustelleneinrichtung  14,00 €/m²
//   Baustelle besenrein räumen …    Abbruch – Nacharbeiten          180,00 € Pausch.
//
// Beide Zeilen STEHEN im Katalog. Sie sind nur aus dem Maler-Gewerk nicht
// erreichbar (`preisKategoriePasstZuGewerk` liefert `false`). Das ist der
// Mechanismus aus PM-068, hier an zwei Zeilen, die in jeder bewohnten
// Wohnung anfallen — und es entsteht nicht einmal ein Fehlt-Eintrag.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-109 · bewohnte Baustelle', () => {
  const T = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Wände streichen. Die Wohnung ist bewohnt, wir brauchen eine Staubschutzwand und räumen jeden Abend auf.'

  it('PM-109-C · Kontrolle: das Bewohntsein wird erkannt', () => {
    const p = lauf('maler', T, WZ_MALER())
    expect(finde(p, /Möbel abdecken/i)).toBeDefined()
    expect(finde(p, /Erschwerniszuschlag/i)).toBeDefined()
  })

  it('PM-109-D · Katalog: beide Zeilen gibt es, beide sind für Maler gesperrt', () => {
    const wand = katalogZeile('Staubschutzwand / Trennwand zu angrenzenden Bereichen')!
    const rein = katalogZeile('Baustelle besenrein räumen + abschließende Reinigung')!
    expect(wand.unit_price).toBe(14)
    expect(rein.unit_price).toBe(180)
    expect(preisKategoriePasstZuGewerk(wand.category, 'maler')).toBe(false)
    expect(preisKategoriePasstZuGewerk(rein.category, 'maler')).toBe(false)
  })

  // Grün seit dem PM-090-Fix (17.09.2026, Engineering): `pruefeStaubschutzwand`
  // und `pruefeBaustellenreinigung` legen je einen Fehlt-Eintrag an. Bepreiste
  // Positionen entstehen bewusst nicht — die Wand ist vom Maler aus gesperrt
  // (PM-090-D), und bei der Reinigung fehlt die Menge, nicht der Preis.
  it('PM-109-A · die gesagte Staubschutzwand hinterlässt eine Spur', () => {
    const erg = laufVoll('maler', T, WZ_MALER())
    expect(titel(erg.positionen).some(t => /staubschutz|trennwand/i.test(t))
      || fehltHat(erg.fehlende, /staubschutz|trennwand/i)).toBe(true)
  })

  it('PM-109-B · die gesagte Abendreinigung hinterlässt eine Spur', () => {
    const erg = laufVoll('maler', T, WZ_MALER())
    expect(titel(erg.positionen).some(t => /reinig|besenrein/i.test(t))
      || fehltHat(erg.fehlende, /reinig|besenrein/i)).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-110 · „Der Estrich ist rissig, der muss verharzt werden."
//
// Themenspeicher C. Der reinste Fall der ganzen Fallbasis: Die Arbeit ist
// gesagt, die Katalogzeile heißt fast wörtlich so, sie ist im richtigen
// Gewerk und für `boden_parkett` ERREICHBAR —
//
//   Estrichriss kraftschlüssig verharzen und verklammern
//   Boden – Untergrundvorbereitung · 18,00 €/lfdm · erreichbar: ja
//
// — und es entsteht trotzdem weder eine Position noch ein Fehlt-Eintrag.
// Hier ist weder der Katalog schuld noch die Gewerkesperre. Dasselbe Muster
// wie PM-070/PM-071/PM-075, an einer Zeile mit klarem Geldweg: Ein Riss von
// 4,00 m sind 72,00 €, die der Betrieb arbeitet und nicht abrechnet.
//
// Die Menge ist nicht gesagt — nach K.5 also Fehlt-Eintrag, keine erfundene
// Länge. Das ist die Forderung von PM-110-A, nicht mehr.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-110 · Estrichriss verharzen', () => {
  const T = 'Wohnzimmer vier mal fünf. Laminat verlegen. Der Estrich ist rissig, der muss verharzt werden.'

  it('PM-110-C · Katalog: die Zeile gibt es, und sie ist für Boden erreichbar', () => {
    const z = katalogZeile('Estrichriss kraftschlüssig verharzen und verklammern')!
    expect(z.unit_price).toBe(18)
    expect(z.unit).toBe('lfdm')
    expect(preisKategoriePasstZuGewerk(z.category, 'boden_parkett')).toBe(true)
  })

  it('PM-110-D · Kontrolle: gemessen — der Satz ändert die Liste heute nicht', () => {
    expect(titel(lauf('boden_parkett', T, WZ_BODEN())))
      .toEqual(titel(lauf('boden_parkett', 'Wohnzimmer vier mal fünf. Laminat verlegen.', WZ_BODEN())))
  })

  it.fails('PM-110-A · die gesagte Rissverharzung hinterlässt eine Spur', () => {
    const erg = laufVoll('boden_parkett', T, WZ_BODEN())
    expect(titel(erg.positionen).some(t => /riss|verharz/i.test(t))
      || fehltHat(erg.fehlende, /riss|verharz/i)).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-111 · der Handwerker nennt seinen Preis selbst
//
// Themenspeicher E. „Das machen wir für fünfhundert Euro pauschal." — der
// Satz verschwindet spurlos. Das Angebot rechnet weiter seine 465,90 € aus
// Katalogpreisen.
//
// Der Geldweg geht hier in beide Richtungen und ist deshalb heikler als er
// aussieht: Sagt der Betrieb 500,00 € und das Papier sagt 465,90 €, verliert
// er 34,10 €. Sagt er 400,00 €, steht auf dem Kundenpapier ein höherer Preis,
// als er dem Kunden mündlich genannt hat — das ist kein Rechenfehler mehr,
// sondern ein Streit.
//
// Soll: keine stille Übernahme (die Pauschale kann sich auf alles oder auf
// einen Teil beziehen — das ist nicht auflösbar), aber ein Fehlt-Eintrag.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-111 · genannter Pauschalpreis', () => {
  const T = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Wände streichen. Das machen wir für fünfhundert Euro pauschal.'

  it('PM-111-C · Kontrolle: gemessen — der Satz ändert das Angebot heute nicht', () => {
    const p = lauf('maler', T, WZ_MALER())
    expect(titel(p)).toEqual(titel(lauf('maler', 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Wände streichen.', WZ_MALER())))
    const summe = 45 * katalog('Wand streichen 2x Anstrich') + 20 * 1.2 + 18 * 0.8
    expect(Number(summe.toFixed(2))).toBe(465.9)
  })

  it.fails('PM-111-A · der genannte Preis hinterlässt eine Spur', () => {
    expect(fehltHat(laufVoll('maler', T, WZ_MALER()).fehlende, /pauschal|preis|euro/i)).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-112 · der Handwerker nennt Stunden statt Mengen
//
// Themenspeicher E. „Da sind wir zwei Tage dran, zwei Mann." — spurlos.
//
// Auch hier ist der Katalog vollständig: `Regiearbeit Geselle`, 65,00 €/Stunde,
// `Maler – Stundenleistungen`, für Maler erreichbar. Es fehlt also keine
// Zeile, es fehlt die Brücke von der gesagten ZEIT zur Menge — und die darf
// die App nicht selbst schlagen: „zwei Tage" sind keine Stundenzahl, und ein
// unterstellter Achtstundentag wäre eine erfundene Menge mit Preis (K.5).
//
// Soll also: Rückfrage / Fehlt-Eintrag, nicht Rechnen.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-112 · Zeit statt Menge', () => {
  const T = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Wände streichen. Da sind wir zwei Tage dran, zwei Mann.'

  it('PM-112-C · Katalog: die Stundenzeile gibt es und sie ist erreichbar', () => {
    const z = katalogZeile('Regiearbeit Geselle')!
    expect(z.unit_price).toBe(65)
    expect(z.unit).toBe('Stunde')
    expect(preisKategoriePasstZuGewerk(z.category, 'maler')).toBe(true)
  })

  it('PM-112-D · Kontrolle: gemessen — der Satz ändert die Liste heute nicht', () => {
    expect(titel(lauf('maler', T, WZ_MALER())))
      .toEqual(titel(lauf('maler', 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Wände streichen.', WZ_MALER())))
  })

  it('PM-112-B · die Regel hält: keine erfundene Stundenzahl', () => {
    // Die richtige Seite — es wird NICHT still ein Achtstundentag unterstellt.
    expect(finde(lauf('maler', T, WZ_MALER()), /Regiearbeit/i)).toBeUndefined()
  })

  it.fails('PM-112-A · die gesagte Zeit hinterlässt eine Spur', () => {
    expect(fehltHat(laufVoll('maler', T, WZ_MALER()).fehlende, /stunde|zeit|regie|tag/i)).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-113 · die sehr kurze Aufnahme
//
// Themenspeicher E, und der Fall mit der unangenehmsten Antwort:
//
//   „Wohnzimmer streichen."  →  NULL Positionen, `fehlende` LEER.
//
// Kein Maß, also keine Menge, also keine Zeile — das ist für sich genommen
// richtig und die Regel „Nichts erfinden" (H) verlangt es so. Falsch ist die
// zweite Hälfte: Es bleibt auch keine Spur. Der Betrieb bekommt ein leeres
// Angebot ohne einen einzigen Satz darüber, WARUM es leer ist.
//
// Das ist derselbe Befund wie der leere Raum mit 0,00 € auf dem
// Fassaden-Entwurf (L-02 / PD-018 a) — dort fällt er auf, weil ein Raum
// danebensteht. Hier fällt er nicht einmal auf.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-113 · die sehr kurze Aufnahme', () => {
  const R = () => [raum('Wohnzimmer', { arbeiten: ['wände streichen'] })]
  const T = 'Wohnzimmer streichen.'

  it('PM-113-B · die Regel hält: ohne Maß keine erfundene Menge', () => {
    expect(lauf('maler', T, R())).toHaveLength(0)
  })

  it.fails('PM-113-A · das leere Angebot sagt, was ihm fehlt', () => {
    // Ist: `fehlende` ist leer. Null Positionen und null Einträge — genau die
    // Kombination, die DC-112 für den runden Raum ausdrücklich ausschließt.
    expect(laufVoll('maler', T, R()).fehlende.length).toBeGreaterThan(0)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-114 · widersprüchliche Angaben im selben Diktat
//
// Themenspeicher E. „Das Wohnzimmer hat zwanzig Quadratmeter. … Der Raum ist
// vier mal sechs." — zwei Angaben zum selben Raum, 20 m² und 24 m².
//
// Gemessen: Die Pipeline entscheidet sich still für die Abmessungen und
// rechnet mit 24 m² Boden und 50 m² Wand. Der Unterschied ist nicht groß,
// aber er ist stumm — und er geht zu Lasten des Kunden:
//
//   nach 4 × 6:   Wand 50,00 m² × 9,50 = 475,00 €
//   nach 20 m²:   Wand 45,00 m² × 9,50 = 427,50 €   (Umfang aus der Fläche)
//                                          rund 53,90 € Unterschied im Angebot
//
// Die Wahl selbst ist verteidigbar (zwei Maße sind genauer als eine Fläche).
// Nicht verteidigbar ist, dass der Widerspruch nirgends auftaucht.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-114 · zwei Angaben zum selben Raum', () => {
  const R = () => [raum('Wohnzimmer', { flaeche: 20, laenge: 4, breite: 6, hoehe: 2.5, arbeiten: ['wände streichen'] })]
  const T = 'Das Wohnzimmer hat zwanzig Quadratmeter. Wände streichen, Höhe zwo fünfzig. Der Raum ist vier mal sechs.'

  it('PM-114-B · gemessen: gerechnet wird mit den Abmessungen, nicht mit der Fläche', () => {
    const p = lauf('maler', T, R())
    expect(finde(p, /^Wand streichen 2x/)!.menge).toBe(50)
    expect(finde(p, /^Boden schützen/)!.menge).toBe(24)
  })

  it.fails('PM-114-A · der Widerspruch wird erfragt statt still entschieden', () => {
    expect(fehltHat(laufVoll('maler', T, R()).fehlende, /widersp|fläche|maß|quadratmeter/i)).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-115 · Nachtrag zu einem bestehenden Angebot
//
// Themenspeicher G. „Nachtrag zum Angebot von letzter Woche. Im Wohnzimmer
// kommt noch die Decke dazu, vier mal fünf." — es entsteht ein vollständiges,
// eigenständiges Angebot ohne jeden Hinweis darauf, dass es ein Nachtrag ist.
//
// Das ist kein Rechenfehler: die Decke ist richtig gerechnet. Es ist eine
// Produktfrage im Sinne von H — ein Nachtrag, der aussieht wie ein
// Erstangebot, wird beim Kunden zweimal gelesen und einmal zu viel bezahlt,
// oder er wird zurückgewiesen. Das Wort steht im Diktat; es darf nicht
// spurlos bleiben.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-115 · Nachtrag', () => {
  const R = () => [raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: ['decke streichen'] })]
  const T = 'Nachtrag zum Angebot von letzter Woche. Im Wohnzimmer kommt noch die Decke dazu, vier mal fünf.'

  it('PM-115-B · gemessen: die Decke selbst ist richtig gerechnet', () => {
    expect(finde(lauf('maler', T, R()), /^Decke streichen 2x/)!.menge).toBe(20)
  })

  it.fails('PM-115-A · das Wort „Nachtrag" hinterlässt eine Spur', () => {
    expect(fehltHat(laufVoll('maler', T, R()).fehlende, /nachtrag|bestehend|angebot/i)).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-116 · zwei Bauabschnitte, der zweite ausdrücklich ausgenommen
//
// Themenspeicher G — und der schwerste Fund dieses Batches.
//
//   „Erster Bauabschnitt Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände
//    streichen. Zweiter Bauabschnitt Küche drei mal drei, das kommt später
//    und wird EXTRA ANGEBOTEN."
//
// Die Küche steht vollständig im selben Angebot:
//
//     Wand streichen 2x — Küche      30,00 m² × 9,50 = 285,00 €
//     Boden schützen — Küche          9,00 m² × 1,20 =  10,80 €
//     Sockelleisten abkleben — Küche 12,00 lfdm × 0,80 =  9,60 €
//                                              Summe   305,40 €
//
// 305,40 € für einen Bauabschnitt, den der Satz ausdrücklich herausnimmt.
// Dieselbe Klasse wie PM-099 (Ausschlusssatz ohne Wirkung), nur nicht auf
// ein Bauteil bezogen, sondern auf einen ganzen Raum und einen Zeitpunkt.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-116 · der ausgenommene zweite Bauabschnitt', () => {
  const R = () => [
    raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: ['wände streichen'] }),
    raum('Küche', { laenge: 3, breite: 3, hoehe: 2.5, arbeiten: ['wände streichen'] }),
  ]
  const R1 = () => [raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: ['wände streichen'] })]
  const T = 'Erster Bauabschnitt Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen. Zweiter Bauabschnitt Küche drei mal drei, das kommt später und wird extra angeboten.'
  const T_SOLL = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen.'
  // 17.09.2026, Engineering (CoS-E-074) — dieselbe Korrektur, die der
  // Prüfmeister am selben Tag an PM-097-C vorgenommen hat, mit seiner
  // Begründung: „eine Kontrolle, die der Fix rot macht, ist keine
  // Kontrolle." PM-116-D stand auf T, also auf dem Satz MIT dem Ausschluss —
  // und maß damit genau das Geld, das der Fix aus dem Angebot nimmt. Der
  // Zweck der Kontrolle ist ein anderer: zu belegen, dass die Küche
  // überhaupt gerechnet werden KANN, der Fund also am Ausschlusssatz hängt
  // und nicht an einer Extraktionslücke. Dafür gehört sie auf den Satz OHNE
  // den Ausschluss. Wortlaut und Sollzahl des Prüfmeisters unverändert;
  // gemeldet in `pruefmeister-restliste.md`.
  const T_OHNE_AUSSCHLUSS = 'Erster Bauabschnitt Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen. Zweiter Bauabschnitt Küche drei mal drei, Wände streichen.'

  it('PM-116-C · Kontrolle: allein ergibt der erste Bauabschnitt genau drei Zeilen', () => {
    expect(titel(lauf('maler', T_SOLL, R1()))).toHaveLength(3)
  })

  it('PM-116-D · Kontrolle: der Geldweg, um den es geht, sind 305,40 €', () => {
    const p = lauf('maler', T_OHNE_AUSSCHLUSS, R())
    const kueche = p.filter(x => /Küche/.test(x.beschreibung))
    const summe = kueche.reduce((s, x) => s + (preis(p, new RegExp(`^${x.beschreibung.split(' — ')[0]}`), 'maler') ?? 0) * (x.menge as number), 0)
    expect(Number(summe.toFixed(2))).toBe(305.4)
  })

  it('PM-116-A · der ausgenommene Bauabschnitt steht nicht im Angebot', () => {
    // Ist: die Küche steht vollständig drin, 305,40 €.
    expect(titel(lauf('maler', T, R())).some(t => /Küche/.test(t))).toBe(false)
  })

  // „oder … wenigstens" gestrichen am 17.09.2026 (Prüfmeister, nach DC-116).
  // Der Designer hat entschieden, und ich ziehe nach: -A und -B sind keine
  // Alternativen, sondern zwei Hälften desselben Solls. Das Weglassen OHNE
  // Hinweis ist der schlimmere der beiden Fehler — dann fehlen 305,40 €
  // Arbeit und niemand erfährt es. Wortgleich mit PM-097-B.
  it('PM-116-B · und das Weglassen wird gezeigt, nicht stumm ausgeführt', () => {
    expect(fehltHat(laufVoll('maler', T, R()).fehlende, /bauabschnitt|küche|später/i)).toBe(true)
  })
})
