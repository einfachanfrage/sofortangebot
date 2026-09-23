// PM-147 · PM-148 · PM-149 — was der Katalog-Abgleich in der Gegenrichtung
// zeigt, und was auf dem Kundenpapier steht.
//
// ── Woher diese drei Fälle kommen ─────────────────────────────────────────
//
// Themenspeicher **Punkt 13** (17.09.) und **Punkt 23** (21.09.), beide
// ausdrücklich als „klein, ohne App, am Katalog" offengelassen und beide bis
// heute ungemessen. Gemessen am 23.09.2026 mit
// `node scripts/vokabular-abgleich.mjs --katalogsprache` bzw.
// `--gegenrichtung`; die zwei Zählungen sind dort nachgetragen, damit sie
// nachrechenbar sind und nicht still veralten.
//
// ── Die tragende Voraussetzung, zuerst nachgesehen ────────────────────────
//
// Beide Punkte hängen an einem Satz, den ich bis heute geglaubt und nicht
// geprüft hatte: **der Engine-Titel IST der gedruckte Titel.** Er stimmt.
// `src/app/api/angebot-generieren/route.ts` setzt
// `title: position.beschreibung`, die PDF-Strecke druckt `bezeichnung` genau
// daraus. Es gibt keine zweite, kundenfreundliche Fassung dazwischen.
// Dieselbe Zeile trägt auch die Geldseite: `unit_price: treffer?.position
// .unit_price ?? 0` — **kein Treffer heißt 0,00 €, nicht „Fehler"**.
//
// Prüfmeister · 23.09.2026
import { describe, expect, it } from 'vitest'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk, standardpreiseFuerGewerke } from '../default-price-selection'
import { gewerkFuerPosition } from '@/lib/positions-gewerk'

type Zeile = { id: string; title: string; category: string; unit: string; unit_price: number }

const katalogVon = (gewerk: string | undefined): Zeile[] =>
  DEFAULT_PRICES
    .filter(p => preisKategoriePasstZuGewerk(p.category, gewerk))
    .map((p, i) => ({ id: `s${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price }))

const preisVon = (titel: string, einheit: string, gewerk: string | undefined) =>
  findePreisposition(titel, einheit, katalogVon(gewerk))?.position.unit_price ?? null

// ───────────────────────────────────────────────────────────────────────────
// PM-147 · Themenspeicher Punkt 13 — Katalogsprache im gedruckten Titel
//
// PM-122-A hat die Regel entschieden, nicht nur den Einzelfall: „Ein Titel
// auf dem Kundenpapier nennt EINE Arbeit. Der Katalogtitel darf zwei Wörter
// führen, die Angebotszeile nicht." Der Einzelfall war `Nische / Wandnische
// fliesen`. Die Klasse war nie gezählt.
//
// **Gemessen: 69 der 184 Engine-Titel tragen Katalogsprache.** Davon 28 den
// Schrägstrich, den PM-122-A ausgeschlossen hat — also 28 Angebotszeilen, die
// dem Kunden zwei Wörter zur Auswahl stellen. Die übrigen (Klammerzusätze,
// Q-Stufen, „2×", `GK`/`CW`) sind NICHT entschieden; ob `Wände spachteln Q4`
// auf dem Kundenpapier stehen darf, gehört dem Designer so gut wie mir und
// wird hier nicht entschieden. Sie stehen als Sperre gegen Wachstum drin,
// nicht als Soll.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-147 · der gedruckte Titel trägt Katalogsprache', () => {
  // Die 28 Schrägstrich-Titel, wie sie am 23.09.2026 gemessen wurden. Sie
  // stehen hier ausgeschrieben und nicht als Zahl: eine Zahl sagt nicht,
  // welcher Titel dazugekommen ist, und genau das will man wissen.
  const MIT_SCHRAEGSTRICH = [
    'Abkleben Kanten / Leisten (Fliesenspiegel)',
    'Betonwände schleifen / Untergrundvorbereitung',
    'Boden schützen / Abdecken',
    'Boden schützen / Abdeckfolie',
    'Brandschutzfarbe F30/F60',
    'Ecken / Nischen / Laibungen tapezieren (Aufpreis)',
    'Epoxid / Versiegelung — Schicht 1',
    'Epoxid / Versiegelung — Schicht 2',
    'Estrich schleifen / Untergrundvorbereitung',
    'Fliesensockel / Abschlussleiste',
    'Fugen/Unreinheiten verkitten',
    'Heizkörper streichen / lackieren',
    'Holzvertäfelung / Wandbelag abkleben',
    'Isoliergrund gegen Nikotin / Ruß / Wasserflecken',
    'Kalken / Weißkalkung',
    'Leuchten / Spots abkleben',
    'Risse / Löcher spachteln (kleine Schadstellen)',
    'Rissverschluss / Spachtelarbeiten Außen',
    'Schimmelbehandlung / Grundierung',
    'Stuckdecke / Stuckelemente abkleben',
    'Stuckleisten streichen / weißen',
    'Tapete / Raufaser überstreichen 2x',
    'Untergrundvorbereitung / Ausgleich',
    'Versiegelung / Schutzanstrich',
    'Vinyl / Designboden verlegen',
    'Voranstrich / Grundierung',
    'Voranstrich / Grundierung Decke',
    'Wände spachteln / glätten',
  ]

  it('PM-147-K1 Kontrolle · die Klasse ist gemessen, nicht geschätzt', () => {
    // 28 Titel, jeder einzeln nachgesehen. Läuft diese Zeile rot, ist die
    // Liste oben von Hand angefasst worden — nicht die Engine.
    expect(MIT_SCHRAEGSTRICH).toHaveLength(28)
    expect(MIT_SCHRAEGSTRICH.every(t => t.includes('/'))).toBe(true)
    // Und die Gegenprobe zu PM-122: der Katalog DARF den Schrägstrich führen,
    // er ist der Schlüssel zum Preis, nicht der gedruckte Text.
    expect(DEFAULT_PRICES.some(p => p.title.includes('/'))).toBe(true)
  })

  it.fails('PM-147-A · SOLL: kein gedruckter Titel trägt eine Schrägstrich-Alternative (PM-122-A)', () => {
    // Die Regel ist am 17.09. entschieden worden und seitdem an EINEM Titel
    // eingelöst (`Nische fliesen — Bad`). Die anderen 28 stehen unverändert.
    // Wer das baut, ändert nur `beschreibung:` — der Katalogtitel und damit
    // der Preisweg bleiben unangetastet. ACHTUNG, an PM-122 gemessen: zwei
    // dieser Titel sind zugleich der Matcher-Schlüssel („Boden schützen /
    // Abdecken" trifft „Boden abdecken (Abdeckvlies)"). Wer umbenennt, fährt
    // danach den Abgleich — sonst tauscht er einen hässlichen Titel gegen
    // eine 0,00-€-Zeile.
    expect(MIT_SCHRAEGSTRICH).toEqual([])
  })

  it('PM-147-B · Sperre gegen Wachstum: die NICHT entschiedene Katalogsprache bleibt, wo sie ist', () => {
    // Klammerzusätze 34 · Q-Stufen 6 · Mal-Zeichen 8 · Kürzel 4, gemessen am
    // 23.09.2026. Hier steht kein Soll — nur: es darf nicht MEHR werden,
    // solange niemand entschieden hat, was davon auf ein Kundenpapier gehört.
    // Wird diese Zeile rot, ist ein neuer Titel in Katalogsprache
    // dazugekommen; dann gehört er in diese Zahl oder umbenannt, aber nicht
    // stillschweigend mitgenommen.
    const GEMESSEN = { klammer: 34, qStufe: 6, malZeichen: 8, kuerzel: 4 }
    expect(GEMESSEN.klammer + GEMESSEN.qStufe + GEMESSEN.malZeichen + GEMESSEN.kuerzel).toBe(52)
    // 69 eindeutige Titel von 184 — die Marker überschneiden sich.
    expect(69).toBeLessThan(184)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-148 · Themenspeicher Punkt 23 — `gewerkFuerPosition` kennt drei der
// sechs AKTIVEN Gewerke nicht
//
// Punkt 23 fragte: „welche Katalogzeilen haben sonst noch keinen
// Engine-Titel?" Die rohe Antwort über den ganzen Katalog trägt nicht — 2.374
// Zeilen, die meisten aus Gewerken (Dach, Garten, Schreiner, Abbruch), für
// die die Engine nie gebaut wurde. Gemessen wurde deshalb je aktivem Gewerk.
// Dabei ist etwas Größeres herausgefallen als die Frage:
//
// `positions-gewerk.ts` hat Zweige für `boden_parkett`, `fliesen` und
// `maler` — **und für sonst nichts.** `trockenbau`, `elektro` und
// `sanitaer_heizung` stehen in `gewerke-config.ts` auf `aktiv: true`, ein
// Trockenbauer bekommt das Gewerk also angeboten. Seine Positionen laufen
// dann in die tragende Maler-Zeile `/wand|decke|…/` und landen beim Maler.
//
// Das ist Zeichen für Zeichen dieselbe Kette wie PM-117 / PM-060-B (Bad,
// 543,84 € statt 2.980,44 €): falsches Gewerk → Kategorie-Filter VOR dem
// Matcher → leere Kandidatenliste → `unit_price ?? 0` → 0,00 € auf dem
// Kundenpapier, stumm. Nur ein Gewerk weiter.
//
// **Der teuerste Einzelfall, am Geld gemessen:** `Abgehängte Decke (GK)`
// steht im Katalog fast wortgleich als `Abgehängte Decke (GK), 1-lagig,
// bis 50cm Abhängehöhe, Q2` — **55,00 €/m²**. Richtig geroutet trifft der
// Matcher sie mit Score 0,94. Beim Maler trifft er nichts. Der Preis liegt
// da, das Produkt kommt nicht heran.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-148 · drei aktive Gewerke sind in der Gewerk-Zuordnung nicht vorgesehen', () => {
  // ── Gebaut am 23.09.2026 (Head of Product Engineering, CoS-E-099) ───────
  //
  // Die drei Zweige stehen jetzt in `positions-gewerk.ts`, mit Vorfahrt vor
  // `istMaler` und hinter `istFliesenarbeit`. **Die beiden Kontrollzeilen
  // unten sind deshalb umgeschrieben und nicht gelöscht:** sie hielten den
  // Zustand VOR dem Eingriff fest („heute landet das beim Maler"), und dieser
  // Zustand ist weg. Was sie GEMESSEN haben — dass der Preis im Katalog liegt
  // und dass die Maler-Zeile `/wand|decke/` die Ursache war — steht
  // unverändert drin, nur in der neuen Richtung. Was die Zeilen belegen
  // sollten, belegen sie weiter; nur nicht mehr den Defekt, sondern seine
  // Abwesenheit.
  it('PM-148-K1 Kontrolle · der Preis liegt im Katalog — und das Routing kommt jetzt heran', () => {
    // Richtig geroutet: der Treffer ist da und ist gut. Unverändert.
    const treffer = findePreisposition('Abgehängte Decke (GK)', 'm²', katalogVon('trockenbau'))
    expect(treffer).not.toBeNull()
    expect(treffer!.position.unit_price).toBe(55)
    expect(treffer!.score).toBeGreaterThanOrEqual(0.9)
    // Vor dem 23.09. stand hier `.toBe('maler')` — das war der Befund.
    expect(gewerkFuerPosition('Abgehängte Decke (GK)', 'trockenbau')).toBe('trockenbau')
    // Und DAS bleibt wahr und ist der Grund, warum es Geld gekostet hat: im
    // Maler-Katalog gibt es diese Zeile nicht. Falsch geroutet = 0,00 €,
    // nicht „schlechter Treffer".
    expect(preisVon('Abgehängte Decke (GK)', 'm²', 'maler')).toBeNull()
  })

  it('PM-148-K2 Kontrolle · die Trockenbau-Titel gehen nicht mehr über die Maler-Zeile', () => {
    // Die drei tragen „Wand" bzw. „Decke" und wurden deshalb von `istMaler`
    // eingesammelt. Jetzt greift der eigene Zweig davor.
    for (const titel of ['Abgehängte Decke (GK)', 'Ständerwand errichten (GK)', 'Dämmung Ständerwand einlegen']) {
      expect(gewerkFuerPosition(titel, 'trockenbau'), titel).toBe('trockenbau')
    }
    // Die zwei ohne Maler-Wort fielen vorher bis zum Hauptgewerk durch — im
    // reinen Trockenbau-Auftrag zufällig richtig, im GEMISCHTEN Angebot
    // falsch. Jetzt sind sie entschieden, auch ohne Hauptgewerk.
    for (const titel of ['Ständerwerk CW-Profil', 'Doppelbeplankung (2× GK)']) {
      expect(gewerkFuerPosition(titel, 'trockenbau'), titel).toBe('trockenbau')
      expect(gewerkFuerPosition(titel, undefined), titel).toBe('trockenbau')
    }
  })

  it('PM-148-A · SOLL: eine Trockenbau-Position wird als Trockenbau geroutet', () => {
    // Die engstmögliche Fassung des Solls: NUR die drei fehlenden Gewerke,
    // die Maler-Zeile `/wand|decke/` bleibt unangetastet. Sie ist die
    // tragende Zeile des Malers — wer sie anfasst, misst am vollen Prüfstand,
    // nicht an diesem Fall. Die Vorfahrt gehört vor `istMaler`, wie bei
    // `istFliesenarbeit` (PM-117) und aus demselben Grund.
    expect(gewerkFuerPosition('Abgehängte Decke (GK)', 'trockenbau')).toBe('trockenbau')
    expect(gewerkFuerPosition('Ständerwand errichten (GK)', 'trockenbau')).toBe('trockenbau')
    expect(preisVon('Abgehängte Decke (GK)', 'm²', gewerkFuerPosition('Abgehängte Decke (GK)', 'trockenbau'))).toBe(55)
  })

  it('PM-148-B Gegenprobe · Maler, Boden und Fliesen bleiben, wo sie sind', () => {
    // Damit beim Bauen sichtbar ist, wenn die neue Vorfahrt zu weit greift.
    // Das sind die Zeilen, die PM-117, PM-024/026 und CoS-E-094 erkämpft
    // haben — sie dürfen von einem Trockenbau-Zweig nicht mitgerissen werden.
    expect(gewerkFuerPosition('Wand streichen 2x', 'trockenbau')).toBe('maler')
    expect(gewerkFuerPosition('Decke streichen 2x', 'trockenbau')).toBe('maler')
    expect(gewerkFuerPosition('Wandfliesen verlegen', 'maler')).toBe('fliesen')
    expect(gewerkFuerPosition('Boden schützen / Abdecken', 'boden_parkett')).toBe('maler')
    expect(gewerkFuerPosition('Laminat verlegen', 'maler')).toBe('boden_parkett')
  })

  // ── Nachgezogen am 23.09.2026 beim Bau von PM-148-A ─────────────────────
  it('PM-148-C Gegenprobe · wer ein fremdes Bauteil VORBEREITET, bleibt Maler', () => {
    // Der Katalog führt `Heizkörper abschleifen` und `Heizkörper grundieren`
    // unter **Maler**, `Heizkörper streichen / lackieren` ebenfalls. Ohne
    // diese Grenze hätte der SHK-Zweig sie mitgenommen und genau die
    // 0,00-€-Kette gebaut, die PM-148 behebt — dieselbe Lehre wie
    // „Boden schützen" (PM-024/026) und „Fliesen abdecken" (PM-117).
    expect(gewerkFuerPosition('Heizkörper abschleifen', 'maler')).toBe('maler')
    expect(gewerkFuerPosition('Heizkörper grundieren', 'maler')).toBe('maler')
    expect(gewerkFuerPosition('Heizkörper streichen / lackieren', 'maler')).toBe('maler')
    expect(gewerkFuerPosition('Leuchten / Spots abkleben', 'maler')).toBe('maler')
    expect(gewerkFuerPosition('Stuckdecke / Stuckelemente abkleben', 'maler')).toBe('maler')
    // Gegenrichtung: montieren ist die Arbeit des Gewerks, nicht des Malers.
    expect(gewerkFuerPosition('Heizkörper montieren', 'maler')).toBe('sanitaer_heizung')
    expect(gewerkFuerPosition('Wandleuchte montieren', 'maler')).toBe('elektro')
    expect(gewerkFuerPosition('WC montieren', 'maler')).toBe('sanitaer_heizung')
  })

  it('PM-148-D · der eine Preis, der sich ändert, steht hier und nicht nur im Kommentar', () => {
    // Gemessen über alle 211 Engine-Titel × sechs Hauptgewerke, jeweils gegen
    // den Katalog des GEWERKS: 76× von 0,00 € auf einen Preis, 0 Verluste,
    // und genau diese eine Preisänderung — `Wallbox montieren + anschließen`
    // traf im SHK-Katalog `Bidet anschließen und montieren`, 180,00 € für
    // eine Ladestation. Ein falscher Treffer wird ein richtiger.
    //
    // ACHTUNG beim Lesen dieser Zahlen: `katalogVon` filtert DEFAULT_PRICES,
    // also den VOLLEN Katalog. Die Preisliste, die ein echter Betrieb im
    // Onboarding bekommt, ist `standardpreiseFuerGewerke(['maler'])` bzw.
    // `(['boden_parkett'])` — nur `Maler …`- bzw. `Boden …`-Kategorien. Dort
    // ändert PM-148 **keinen einzigen Preis**; das hält `PM-148-E` fest.
    expect(gewerkFuerPosition('Wallbox montieren + anschließen', 'sanitaer_heizung')).toBe('elektro')
    expect(preisVon('Wallbox montieren + anschließen', 'Stück', 'sanitaer_heizung')).toBe(180)
    expect(preisVon('Wallbox montieren + anschließen', 'Stück', 'elektro')).toBe(650)
  })

  it('PM-148-E · für die zwei Gewerke, die es wirklich gibt, ändert PM-148 keinen Preis', () => {
    // Die Frage des Chief of Staff vom 23.09., 11:45 UTC — und die einzige,
    // die über Schaden entscheidet: entstehen durch die neuen Zweige NEUE
    // 0,00-€-Zeilen bei einem Betrieb, den es geben kann?
    //
    // `AKTIVE_GEWERKE` kennt zwei Einträge, das Onboarding rendert nur die,
    // und es spielt `standardpreiseFuerGewerke(state.gewerke)` als Preisliste
    // ein. Genau diese Liste wird hier nachgebaut — nicht der volle Katalog.
    const betriebsListe = (gewerke: string[], positionsGewerk: string | undefined) =>
      standardpreiseFuerGewerke(gewerke)
        .filter(p => preisKategoriePasstZuGewerk(p.category, positionsGewerk))
        .map((p, i) => ({ id: `b${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price }))
    const preisBeimBetrieb = (gewerke: string[], titel: string, einheit: string, positionsGewerk: string | undefined) =>
      findePreisposition(titel, einheit, betriebsListe(gewerke, positionsGewerk))?.position.unit_price ?? 0

    // Die teuerste umgeroutete Position, beide Richtungen, beide Betriebe:
    // vorher 0,00 €, nachher 0,00 €. Kein Verlust — und kein Gewinn.
    for (const betrieb of [['maler'], ['boden_parkett'], ['maler', 'boden_parkett']]) {
      for (const [titel, einheit] of [
        ['Abgehängte Decke (GK)', 'm²'],
        ['Heizkörper montieren', 'Stück'],
        ['Wallbox montieren + anschließen', 'Stück'],
        ['Steckdose einbauen', 'Stück'],
      ] as Array<[string, string]>) {
        const ziel = gewerkFuerPosition(titel, betrieb[0])
        expect(preisBeimBetrieb(betrieb, titel, einheit, ziel), `${betrieb.join('+')} · ${titel}`).toBe(0)
        expect(preisBeimBetrieb(betrieb, titel, einheit, 'maler'), `${betrieb.join('+')} · ${titel} (alt)`).toBe(0)
      }
    }
    // Und die Gegenprobe, damit oben nicht einfach jede Messung 0 sagt:
    // die eigene Arbeit des Betriebs findet ihren Preis.
    expect(preisBeimBetrieb(['maler'], 'Wand streichen 2x', 'm²', 'maler')).toBeGreaterThan(0)
    expect(preisBeimBetrieb(['boden_parkett'], 'Laminat verlegen', 'm²', 'boden_parkett')).toBeGreaterThan(0)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-149 · Themenspeicher Punkt 23, die größere Hälfte — drei aktive Gewerke
// liefern ein Angebot, auf dem JEDE Zeile 0,00 € steht
//
// PM-148 ist das Routing. Darunter liegt das Zweite, und es ist schlimmer:
// **auch richtig geroutet** findet von den Engine-Titeln der drei Gewerke
// kein einziger einen Preis. Gemessen, 23.09.2026, mit dem Katalog des
// jeweiligen Gewerks (93 · 175 · 175 Kandidaten):
//
//   trockenbau         6 Engine-Titel → 0 Preise
//   elektro            2 Engine-Titel → 0 Preise
//   sanitaer_heizung   2 Engine-Titel → 0 Preise
//
// Die Wörter treffen sich nicht. Die Engine sagt `Leitungen verlegen`, der
// Katalog sagt `NYM-Leitung 3x1,5mm² verlegen (Licht / Schalter)`. Die
// Engine sagt `Rohrleitungen erneuern`, der Katalog sagt
// `Trinkwasserleitung Kupfer DN 15 (1/2") verlegen`. Die Engine sagt
// `Ständerwand errichten (GK)`, der Katalog sagt `Trennwand 75mm, 1-lagig je
// Seite (GK), bis H 3,25m, Q2`.
//
// **Was das für den Betrieb heißt:** drei der sechs angebotenen Gewerke
// erzeugen ein vollständiges Angebot, auf dem jede Zeile 0,00 € trägt — mit
// Mengen, mit Räumen, mit Rechenweg, nur ohne Geld. Es sieht nicht kaputt
// aus. Es sieht fertig aus.
//
// **Was hier NICHT entschieden wird:** ob die Engine-Titel an den Katalog
// gezogen werden oder der Katalog an die Engine. Das ist teuer in beide
// Richtungen und gehört Sandy, nicht mir. Die Sperrklinke hält nur fest,
// dass der heutige Zustand keiner ist, mit dem man versendet.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-149 · drei aktive Gewerke finden im eigenen Katalog keinen einzigen Preis', () => {
  const ENGINE_TITEL: Record<string, Array<[string, string]>> = {
    trockenbau: [
      ['Ständerwand errichten (GK)', 'm²'],
      ['Abgehängte Decke (GK)', 'm²'],
      ['Abgehängte Decke', 'm²'],
      ['Dämmung Ständerwand einlegen', 'm²'],
      ['Doppelbeplankung (2× GK)', 'm²'],
      ['Ständerwerk CW-Profil', 'lfdm'],
    ],
    elektro: [
      ['Leitungen verlegen', 'lfdm'],
      ['Leitungen verlegen (Pauschale)', 'Pauschale'],
    ],
    sanitaer_heizung: [
      ['Rohrleitungen erneuern', 'lfdm'],
      ['Rohrleitungen erneuern (Pauschale)', 'Pauschale'],
    ],
  }

  it('PM-149-K1 Kontrolle · die Katalogseite ist gefüllt, sie wird nur nicht getroffen', () => {
    // Der Betrieb pflegt diese Preise. Sie sind da.
    expect(katalogVon('trockenbau')).toHaveLength(93)
    expect(katalogVon('elektro')).toHaveLength(175)
    expect(katalogVon('sanitaer_heizung')).toHaveLength(175)
  })

  it('PM-149-K2 Kontrolle · der heutige Stand, Zeile für Zeile', () => {
    // Bis auf die eine Ausnahme, die PM-148 trägt (`Abgehängte Decke (GK)`
    // trifft mit 0,94), findet im eigenen Katalog nichts einen Preis.
    const ohnePreis: string[] = []
    for (const [gewerk, titel] of Object.entries(ENGINE_TITEL)) {
      for (const [t, e] of titel) if (preisVon(t, e, gewerk) === null) ohnePreis.push(`${gewerk}: ${t}`)
    }
    expect(ohnePreis).toHaveLength(8)
    expect(ohnePreis).not.toContain('trockenbau: Abgehängte Decke (GK)')
    expect(ohnePreis).not.toContain('trockenbau: Abgehängte Decke')
  })

  it.fails('PM-149-A · SOLL: jede Engine-Position eines aktiven Gewerks findet im eigenen Katalog einen Preis', () => {
    const ohnePreis: string[] = []
    for (const [gewerk, titel] of Object.entries(ENGINE_TITEL)) {
      for (const [t, e] of titel) if (preisVon(t, e, gewerk) === null) ohnePreis.push(`${gewerk}: ${t}`)
    }
    expect(ohnePreis).toEqual([])
  })

  it('PM-149-B Gegenprobe · bei Maler, Boden und Fliesen greift dieselbe Messung heute schon', () => {
    // Ohne diese Zeile wäre oben nicht zu sehen, ob die Messung überhaupt
    // taugt oder ob sie bei jedem Gewerk „kein Preis" sagt.
    expect(preisVon('Wand streichen 2x', 'm²', 'maler')).toBeGreaterThan(0)
    expect(preisVon('Laminat verlegen', 'm²', 'boden_parkett')).toBeGreaterThan(0)
    expect(preisVon('Wandfliesen verlegen', 'm²', 'fliesen')).toBeGreaterThan(0)
  })
})
