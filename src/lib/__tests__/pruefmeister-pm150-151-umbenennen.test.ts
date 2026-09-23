// PM-150 · PM-151 — was das Umbenennen eines gedruckten Titels kostet.
//
// ── Woher diese zwei Fälle kommen ─────────────────────────────────────────
//
// Themenspeicher **Punkt 27**, aufgemacht am 23.09.2026 aus PM-147 und dort
// als „ungemessen" stehengelassen: *an wie vielen der 184 Engine-Titel hängt
// der Preistreffer an einem einzigen Wort?* Die Frage ist nicht akademisch —
// **DC-145 schlägt 36 Umbenennungen vor**, und der gedruckte Titel IST der
// Schlüssel zum Preis (PM-147, nachgesehen: `title: position.beschreibung`,
// `unit_price: treffer?.position.unit_price ?? 0`). Wer umbenennt und
// danebengreift, erzeugt keine Fehlermeldung, sondern eine 0,00-€-Zeile, die
// fertig aussieht.
//
// Der Designer hat seine 36 Vorschläge einzeln gemessen — das beantwortet
// „sind DIESE 36 sicher?". Punkt 27 fragt das andere: **wie gefährlich ist
// Umbenennen überhaupt?**
//
// ── Wie gemessen wurde ────────────────────────────────────────────────────
//
// `node scripts/vokabular-abgleich.mjs --wortabhaengigkeit`. Jeder Titel mit
// Preis wird Wort für Wort um EIN Wort gekürzt und erneut durch denselben
// Matcher geschickt wie der Angebots-Endpunkt. Weglassen ist die kleinste
// denkbare Änderung und braucht kein Urteil darüber, was ein „schönerer"
// Titel wäre: fällt der Treffer schon, wenn ein Wort fehlt, trägt dieses Wort
// den Preis allein.
//
// **Ergebnis am 23.09.2026, 157 Titel mit Preis und mehr als einem Wort:**
//
// * **101 hängen an mindestens einem Wort** (64 %),
// * davon **9 auf 0,00 €** — das Wort fehlt, es gibt gar keinen Preis mehr,
// * **92 auf einen ANDEREN Preis** — die gefährlichere Hälfte, weil nichts
//   leer bleibt und niemand hinsieht,
// * **69 hängen an genau einem einzigen Wort**,
// * **112 Wortauslassungen wechseln zusätzlich das GEWERK** — dann wechselt
//   nicht der Treffer, sondern die ganze Katalogseite (die Kette aus PM-117 /
//   PM-148).
//
// Geschnitten auf die Titel, die umbenannt werden SOLLEN (die Marker aus
// `--katalogsprache`): Schrägstrich 26 mit Preis → 10 hängen an einem Wort,
// **3 davon auf 0,00 €**; Klammerzusatz 27 → 16, **2 davon auf 0,00 €**;
// Q-Stufe 6 → 5; Mal-Zeichen 8 → 7; Kürzel 1 → 0.
//
// ── Was daraus folgt, in einem Satz ───────────────────────────────────────
//
// **Ein hoher Score schützt nicht.** Von den neun Titeln, die ihren Preis
// ganz verlieren, stehen drei heute auf **1,00** — darunter einer, der an dem
// Füllwort „bis" hängt. Deshalb ist R5 aus DC-145 (kein Titel geht ohne
// Abgleich in den Code) keine Förmlichkeit, sondern die tragende Regel.
//
// Prüfmeister · 23.09.2026
import { describe, expect, it } from 'vitest'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import {
  mischeEigenePreise,
  preisKategoriePasstZuGewerk,
  standardpreiseFuerGewerke,
} from '../default-price-selection'
import { getPreisvorlagenForGewerke } from '../preise-vorlagen'
import { gewerkFuerPosition } from '@/lib/positions-gewerk'

type Zeile = { id: string; title: string; category: string; unit: string; unit_price: number }

const katalogVon = (gewerk: string | undefined): Zeile[] =>
  DEFAULT_PRICES
    .filter(p => preisKategoriePasstZuGewerk(p.category, gewerk))
    .map((p, i) => ({ id: `s${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price }))

/** Derselbe Weg wie im Angebots-Endpunkt: Gewerk aus dem Titel, dann Matcher. */
const treffer = (titel: string, einheit: string, katalog?: Zeile[]) =>
  findePreisposition(titel, einheit, katalog ?? katalogVon(gewerkFuerPosition(titel, undefined)))

const preisVon = (titel: string, einheit: string, katalog?: Zeile[]) =>
  treffer(titel, einheit, katalog)?.position.unit_price ?? null

const ohneWort = (titel: string, wort: string) =>
  titel.split(/\s+/).filter(w => w !== wort).join(' ')

/**
 * Der gekürzte Titel, gemessen im Katalog des URSPRÜNGLICHEN Gewerks.
 *
 * Das ist die Annahme, unter der das Skript zählt, und sie ist die
 * wohlwollende: eine Umbenennung SOLL das Gewerk nicht wechseln. Wechselt es
 * doch, ist der Schaden größer, nicht kleiner — dann wechselt nicht der
 * Treffer, sondern die ganze Katalogseite. `PM-150-K3` hält beide Richtungen
 * nebeneinander.
 */
const imSelbenGewerk = (original: string, titel: string, einheit: string) =>
  preisVon(titel, einheit, katalogVon(gewerkFuerPosition(original, undefined)))

// ───────────────────────────────────────────────────────────────────────────
// PM-150 · Themenspeicher Punkt 27 — der Titel trägt den Preis, und oft trägt
// ihn ein einziges Wort
// ───────────────────────────────────────────────────────────────────────────
describe('PM-150 · der Preistreffer hängt an einzelnen Wörtern', () => {
  // Die neun Titel, die ihren Preis GANZ verlieren, sobald ein Wort fehlt.
  // Ausgeschrieben und nicht als Zahl: eine Zahl sagt nicht, welcher Titel
  // dazugekommen ist. `wort` ist das erste gemessene tragende Wort; mehrere
  // dieser Titel haben zwei oder drei davon (siehe Skript-Ausgabe).
  const VERLIERT_DEN_PREIS: Array<{ titel: string; einheit: string; wort: string }> = [
    { titel: 'Alten Teppichboden entfernen (verklebt)', einheit: 'm²', wort: 'Teppichboden' },
    { titel: 'Dispersionsfarbe 2× Anstrich', einheit: 'm²', wort: 'Anstrich' },
    { titel: 'Betonwände schleifen / Untergrundvorbereitung', einheit: 'm²', wort: 'schleifen' },
    { titel: 'Boden schützen / Abdeckfolie', einheit: 'm²', wort: 'schützen' },
    { titel: 'Estrich grundieren (Haftgrund)', einheit: 'm²', wort: 'grundieren' },
    { titel: 'Gerüst stellen und abbauen', einheit: 'Pauschale', wort: 'Gerüst' },
    { titel: 'Ausgleichsmasse bis 3 mm einbringen', einheit: 'm²', wort: 'bis' },
    { titel: 'Entsorgung Fliesenmaterial', einheit: 'm²', wort: 'Fliesenmaterial' },
    { titel: 'Isoliergrund gegen Nikotin / Ruß / Wasserflecken', einheit: 'm²', wort: 'Nikotin' },
  ]

  it('PM-150-K1 Kontrolle · neun Titel verlieren ihren Preis, wenn ein einziges Wort fehlt', () => {
    expect(VERLIERT_DEN_PREIS).toHaveLength(9)
    for (const { titel, einheit, wort } of VERLIERT_DEN_PREIS) {
      // Heute steht ein Preis da …
      expect(preisVon(titel, einheit), `${titel}: hat heute keinen Preis`).not.toBeNull()
      // … und ohne dieses eine Wort steht 0,00 € auf dem Kundenpapier.
      expect(imSelbenGewerk(titel, ohneWort(titel, wort), einheit), `${titel}: „${wort}" trägt den Preis nicht mehr allein`).toBeNull()
    }
  })

  it('PM-150-K2 Kontrolle · ein Score von 1,00 schützt nicht — „bis" trägt 10,00 €/m²', () => {
    // Der härteste Einzelfall der Messung: Engine-Titel und Katalogzeile sind
    // WORTGLEICH, der Score ist 1,00, und es hängt trotzdem alles an einem
    // Füllwort. Wer „bis 3 mm" zu „3 mm" glättet — sprachlich die
    // naheliegendste aller Umbenennungen —, erzeugt eine 0,00-€-Zeile.
    expect(treffer('Ausgleichsmasse bis 3 mm einbringen', 'm²')?.score).toBe(1)
    expect(preisVon('Ausgleichsmasse bis 3 mm einbringen', 'm²')).toBe(10)
    expect(preisVon('Ausgleichsmasse 3 mm einbringen', 'm²')).toBeNull()
    // Und die Umstellung, die den Treffer behält, kostet den Score: 1,00 →
    // 0,67, mitten in die „knapp"-Zone des Abgleichs (unter 0,75).
    expect(treffer('Ausgleichsmasse einbringen — bis 3 mm', 'm²')?.score).toBeLessThan(0.75)
  })

  it('PM-150-K3 Kontrolle · die gefährlichere Hälfte ist still: es steht ein Preis da, nur der falsche', () => {
    // 92 der 101 wortabhängigen Titel fallen nicht auf 0,00 €, sondern auf
    // einen ANDEREN Preis. Nichts bleibt leer, nichts wird rot, und im
    // Angebot steht eine Zahl, die jemand für geprüft hält.
    expect(preisVon('Heizkörper lackieren (2× Anstrich)', 'Stück')).toBe(40)
    expect(imSelbenGewerk('Heizkörper lackieren (2× Anstrich)', 'lackieren (2× Anstrich)', 'Stück')).toBe(55)
    expect(preisVon('Dachschrägen grundieren', 'm²')).toBe(4.5)
    expect(imSelbenGewerk('Dachschrägen grundieren', 'Dachschrägen', 'm²')).toBe(7.5)

    // Und die andere Richtung, die das Skript getrennt zählt (112
    // Wortauslassungen wechseln das Gewerk): fällt mit dem Wort auch das
    // Gewerk weg, filtert nichts mehr, und der Matcher sucht im GANZEN
    // Katalog — über Dach, Garten und Schreiner hinweg.
    expect(gewerkFuerPosition('Dachschrägen grundieren', undefined)).toBe('maler')
    expect(gewerkFuerPosition('Dachschrägen', undefined)).toBeUndefined()
    // 650,00 €/m² statt 4,50 €/m², aus dem Schreiner-Katalog, Score 0,90.
    expect(preisVon('Dachschrägen', 'm²')).toBe(650)
  })

  it('PM-150-K4 Kontrolle · drei der 28 Schrägstrich-Titel aus PM-147-A hängen an einem Wort', () => {
    // Die Kollision, die vor der ersten Umbenennung auf dem Tisch liegen
    // muss: PM-147-A will den Schrägstrich auflösen, und bei diesen dreien
    // steht in den Alternativen das Wort, das den Preis trägt.
    // `Isoliergrund gegen Nikotin / Ruß / Wasserflecken` hängt an ALLEN
    // DREI Aufzählungswörtern — die Zeile heißt im Katalog genauso.
    for (const wort of ['Nikotin', 'Ruß', 'Wasserflecken']) {
      expect(
        imSelbenGewerk('Isoliergrund gegen Nikotin / Ruß / Wasserflecken', ohneWort('Isoliergrund gegen Nikotin / Ruß / Wasserflecken', wort), 'm²'),
        `Isoliergrund ohne „${wort}"`,
      ).toBeNull()
    }
    expect(preisVon('Boden schützen / Abdeckfolie', 'm²')).toBe(1.2)
    expect(imSelbenGewerk('Boden schützen / Abdeckfolie', 'schützen / Abdeckfolie', 'm²')).toBeNull()
    expect(preisVon('Betonwände schleifen / Untergrundvorbereitung', 'm²')).toBe(5.5)
    expect(imSelbenGewerk('Betonwände schleifen / Untergrundvorbereitung', 'Betonwände / Untergrundvorbereitung', 'm²')).toBeNull()
  })

  it('PM-150-K5 Kontrolle · das Trennzeichen ist NICHT folgenlos — Komma statt Gedankenstrich kostet den Treffer', () => {
    // DC-145 zieht aus dem verworfenen ersten Entwurf die Lehre „der Matcher
    // hängt an den Wörtern, nicht an der Zeichensetzung". Der erste Teil
    // stimmt, der zweite ist zu weit: bei GLEICHEN Wörtern entscheidet hier
    // allein das Trennzeichen. Gemessen, damit die Regel in R5 die engere
    // Form behält: Klammer → Gedankenstrich ist gemessen harmlos, Klammer →
    // Komma ist es nicht.
    expect(preisVon('Heizkörper lackieren (2× Anstrich)', 'Stück')).toBe(40)
    expect(preisVon('Heizkörper lackieren — 2× Anstrich', 'Stück')).toBe(40)
    expect(preisVon('Heizkörper lackieren, 2× Anstrich', 'Stück')).toBeNull()
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-151 · Die Gegenprobe des Chief of Staff (CoS-E-100, 23.09.2026):
// „was sieht ein Konto, das den alten Titel gespeichert hat, nach der
// Umbenennung — Treffer, anderer Preis, oder 0,00 €?"
//
// Die Frage ist berechtigt, weil ALLE bisherigen Messungen — meine, die des
// Abgleichs und die des Designers — gegen `DEFAULT_PRICES` laufen. Ein echter
// Betrieb hat diesen Katalog nicht: er bekommt `standardpreiseFuerGewerke()`
// **plus** die Vorlagenzeilen, die er im Onboarding eingetippt hat, und die
// davon, die es im Basiskatalog nicht gibt, kommen als EIGENE Zeilen dazu
// (`mischeEigenePreise` → `zusaetzlich`, CoS-E-052). Diese Zeilen kennt der
// Abgleich nicht — und eine davon kann den Treffer gewinnen.
//
// Gemessen: **sie gewinnt ihn nicht.** Für alle 36 Vorschläge aus DC-145
// trifft der neue Titel im Betriebskatalog dieselbe Zeile zum selben Preis
// wie der alte. Der Betrieb sieht **seinen eigenen Preis, unverändert** —
// nicht 0,00 €, nicht den fremden.
//
// **Wofür das NICHT gilt** (und deshalb steht es hier und nicht als Haken):
// für einen Betrieb, der eine Katalogzeile selbst umbenannt oder eine eigene
// Zeile frei getippt hat. Was dort steht, weiß nur seine Datenbank.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-151 · die 36 Umbenennungen aus DC-145 gegen den Katalog eines echten Betriebs', () => {
  /** Basiskatalog der Gewerke + eingetippte Vorlagen, wie nach dem Onboarding. */
  function betriebsKatalog(gewerke: string[], fuerGewerk: string | undefined): Zeile[] {
    const basis = standardpreiseFuerGewerke(gewerke).map(p => ({
      category: p.category, title: p.title, unit: p.unit, unit_price: p.unit_price,
    }))
    const eigene = getPreisvorlagenForGewerke(gewerke).map(v => ({
      category: v.category, title: v.title, unit: v.unit, unit_price: v.defaultPrice,
    }))
    const { zeilen, zusaetzlich } = mischeEigenePreise(basis, eigene)
    return [...zeilen, ...zusaetzlich]
      .filter(p => preisKategoriePasstZuGewerk(p.category, fuerGewerk))
      .map((p, i) => ({ id: `b${i}`, ...p }))
  }

  const BETRIEB: Record<string, string[]> = {
    maler: ['maler'], boden_parkett: ['boden_parkett'], fliesen: ['fliesen'],
  }

  // Die 36 aus DC-145, abgeschrieben mit der Einheit aus dem Abgleich.
  // Sechs weitere (Trockenbau, Elektro, SHK) sind dort bewusst nicht
  // vorgeschlagen, solange die drei Gewerke geparkt sind.
  const VORSCHLAEGE: Array<[nr: number, alt: string, neu: string, einheit: string]> = [
    [1, 'Ausgleichsmasse einbringen (45 mm)', 'Ausgleichsmasse einbringen — 45 mm', 'm²'],
    [2, 'Boden abdecken (Abdeckvlies)', 'Boden abdecken — mit Vlies', 'Pauschale'],
    [3, 'Boden abdecken (Abdeckvlies)', 'Boden abdecken — mit Vlies', 'm²'],
    [4, 'Fugen thermisch verschweißen (inkl. Schweißdraht)', 'Fugen thermisch verschweißen — Schweißdraht enthalten', 'lfdm'],
    [5, 'Alten Teppichboden entfernen (verklebt)', 'Alten Teppichboden entfernen — verklebt', 'm²'],
    [6, 'Heizkörper lackieren (2× Anstrich)', 'Heizkörper lackieren — 2× Anstrich', 'Stück'],
    [7, 'Estrich grundieren (Haftgrund)', 'Estrich mit Haftgrund grundieren', 'm²'],
    [8, 'Fassade reinigen (druckwaschen)', 'Fassade reinigen — mit Hochdruck', 'm²'],
    [9, 'Wand streichen 2x (Blau, Zone oben)', 'Wand streichen — oberer Bereich, Blau, 2× Anstrich', 'm²'],
    [10, 'Wand streichen 2x (ohne Akzentwand)', 'Wand streichen — ohne Akzentwand, 2× Anstrich', 'm²'],
    [11, 'Wand streichen 2x (Zone oben)', 'Wand streichen — oberer Bereich, 2× Anstrich', 'm²'],
    [12, 'Fenster lackieren (Lack, 2× Anstrich)', 'Fenster lackieren — Lack, 2× Anstrich', 'Stück'],
    [13, 'Fenster lackieren (Ölfarbe, 2× Anstrich)', 'Fenster lackieren — Ölfarbe, 2× Anstrich', 'Stück'],
    [14, 'Gerüst stellen (Pauschale)', 'Gerüst stellen', 'Pauschale'],
    [15, 'Grundieren (Tiefengrund)', 'Grundieren — Tiefengrund', 'm²'],
    [16, 'Lasur auftragen (transparent)', 'Lasur auftragen — transparent', 'lfdm'],
    [17, 'Parkett abschleifen (2 Schleifgänge)', 'Parkett abschleifen — 2 Schleifgänge', 'm²'],
    [18, 'Parkett ölen (maschinell, 1-lagig)', 'Parkett ölen — maschinell, 1 Lage', 'm²'],
    [19, 'Parkett versiegeln (Lack, 2-lagig)', 'Parkett versiegeln — Lack, 2 Lagen', 'm²'],
    [20, 'Silikatfarbe auftragen (2×)', 'Silikatfarbe auftragen — 2×', 'm²'],
    [21, 'Sockelleisten entfernen (alt)', 'Alte Sockelleisten entfernen', 'lfdm'],
    [22, 'Sockelleisten lackieren (2× Anstrich)', 'Sockelleisten lackieren — 2× Anstrich', 'lfdm'],
    [23, 'Spachteltechnik (Betonoptik)', 'Spachteltechnik in Betonoptik', 'm²'],
    [24, 'Türen lackieren (2× Anstrich)', 'Türen lackieren — 2× Anstrich', 'Stück'],
    [25, 'Untergrund schleifen (Unebenheiten, Kleberreste)', 'Untergrund schleifen — Unebenheiten und Kleberreste', 'm²'],
    [26, 'Untergrundprüfung (Ebenheit, Feuchte, Tragfähigkeit)', 'Untergrundprüfung — Ebenheit, Feuchte, Tragfähigkeit', 'Pauschale'],
    [27, 'Wände schleifen nach Q2', 'Wände schleifen — normal (Q2)', 'm²'],
    [28, 'Wände schleifen nach Q3', 'Wände schleifen — fein (Q3)', 'm²'],
    [29, 'Wände schleifen nach Q4', 'Wände schleifen — glatt (Q4)', 'm²'],
    [30, 'Wände spachteln Q2', 'Wände spachteln — normal verspachtelt (Q2)', 'm²'],
    [31, 'Wände spachteln Q3', 'Wände spachteln — fein verspachtelt (Q3)', 'm²'],
    [32, 'Wände spachteln Q4', 'Wände spachteln — glatt verspachtelt (Q4)', 'm²'],
    [33, 'Decke streichen 2x', 'Decke streichen — 2× Anstrich', 'm²'],
    [34, 'Dachschrägen streichen 2x', 'Dachschrägen streichen — 2× Anstrich', 'm²'],
    [35, 'Fassadenfläche streichen 2x', 'Fassadenfläche 2× streichen', 'm²'],
    [36, 'Kniestockwände streichen 2x', 'Kniestockwände streichen — 2× Anstrich', 'm²'],
  ]

  it('PM-151-K1 Kontrolle · der Betriebskatalog ist wirklich ein anderer — sonst sagt die Messung nichts', () => {
    // Ohne diese Zeile wäre PM-151-A eine Tautologie: wenn beide Kataloge
    // gleich sind, misst die Gegenprobe dasselbe zweimal.
    for (const [gewerk, ids] of Object.entries(BETRIEB)) {
      const abgleich = katalogVon(gewerk)
      const betrieb = betriebsKatalog(ids, gewerk)
      const nurBeimBetrieb = betrieb.filter(b => !abgleich.some(a => a.title === b.title))
      expect(nurBeimBetrieb.length, `${gewerk}: keine eigene Zeile`).toBeGreaterThan(0)
    }
    // Die größte Abweichung liegt beim Boden: 13 Vorlagenzeilen, die im
    // Basiskatalog gar nicht vorkommen (u. a. `Parkett schleifen +
    // versiegeln komplett`, `Parkett ölen (maschinell, 2-lagig)`).
    expect(
      betriebsKatalog(['boden_parkett'], 'boden_parkett')
        .filter(b => !katalogVon('boden_parkett').some(a => a.title === b.title)).length,
    ).toBeGreaterThanOrEqual(13)
  })

  it('PM-151-A · jeder der 36 Vorschläge trifft beim Betrieb dieselbe Zeile zum selben Preis', () => {
    expect(VORSCHLAEGE).toHaveLength(36)
    for (const [nr, alt, neu, einheit] of VORSCHLAEGE) {
      const gewerk = gewerkFuerPosition(alt, undefined)
      const katalog = betriebsKatalog(BETRIEB[gewerk ?? ''] ?? ['maler'], gewerk)
      const vorher = treffer(alt, einheit, katalog)
      const nachher = treffer(neu, einheit, katalog)
      expect(nachher?.position.title ?? null, `#${nr} ${alt}: andere Katalogzeile`).toBe(vorher?.position.title ?? null)
      expect(nachher?.position.unit_price ?? null, `#${nr} ${alt}: anderer Preis`).toBe(vorher?.position.unit_price ?? null)
      // Und das Gewerk darf die Umbenennung nicht wechseln — sonst wechselt
      // nicht der Treffer, sondern die ganze Katalogseite (PM-148).
      expect(gewerkFuerPosition(neu, undefined), `#${nr} ${alt}: Gewerk wechselt`).toBe(gewerk)
    }
  })

  it('PM-147-B-2 · die Zusicherung zu „2×": Schreibweise, nicht Anzahl', () => {
    // Die Antwort auf PM-147-B, als Regel ausgeschrieben. R2 aus DC-145:
    // die Anzahl der Anstriche bleibt gedruckt, einheitlich als `2×`
    // hinter dem Gedankenstrich. Die Marker-Zahl „Mal-Zeichen" fällt damit
    // ausdrücklich NICHT auf 0 — sie fällt auf die Zeilen, in denen `2×`
    // bewusst steht. Wer gegen 0 prüft, prüft gegen eine Regel, die
    // niemand getroffen hat.
    const neueTitel = VORSCHLAEGE.map(([, , neu]) => neu)

    // 1. kein `2x` ohne `×` — das kleine x ist die Katalogschreibweise.
    for (const titel of neueTitel) {
      expect(/\d\s*x\b/.test(titel), `${titel}: trägt „2x" statt „2×"`).toBe(false)
    }
    // 2. kein `2×` allein in Klammern — die Klammer ist nach R1 weg.
    for (const titel of neueTitel) {
      expect(/\(\s*\d\s*×[^)]*\)/.test(titel), `${titel}: „2×" steht in Klammern`).toBe(false)
    }
    // 3. kein `2x` als Wortanhang (`streichen 2x`) — abgedeckt von 1., hier
    //    noch einmal für den Fall, dass jemand 1. lockert.
    for (const titel of neueTitel) {
      expect(/\s\d+x$/.test(titel), `${titel}: „2x" hängt hinten am Titel`).toBe(false)
    }
    // 4. Und die Gegenrichtung, die diese Zusicherung erst richtig macht:
    //    das Mal-Zeichen VERSCHWINDET nicht. Liefe diese Zeile rot, hätte
    //    jemand R2 als „weg damit" gelesen — und dem Kunden die
    //    Information genommen, die 3,50 €/m² erklärt.
    expect(neueTitel.filter(t => t.includes('×')).length).toBeGreaterThanOrEqual(12)
  })

  it('PM-151-B Gegenprobe · die Messung hat Zähne: ein einziges getauschtes Wort fällt hier durch', () => {
    // Der verworfene erste Entwurf des Designers, durch dieselbe Schleife.
    // Liefe PM-151-A auch damit grün, würde es nichts prüfen.
    const gewerk = gewerkFuerPosition('Parkett versiegeln (Lack, 2-lagig)', undefined)
    const katalog = betriebsKatalog(BETRIEB[gewerk ?? ''] ?? ['maler'], gewerk)
    expect(treffer('Parkett versiegeln (Lack, 2-lagig)', 'm²', katalog)?.position.unit_price).toBe(18)
    expect(treffer('Parkett mit Lack versiegeln, zwei Lagen', 'm²', katalog)).toBeNull()
  })
})
