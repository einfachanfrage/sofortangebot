// PM-153 · PM-154 · PM-155 — die drei Aufträge des Chief of Staff vom
// 23.09.2026 (Restliste, 13:55 und 14:55 UTC), gemessen statt vermutet.
//
// ── Woher die drei kommen ─────────────────────────────────────────────────
//
// **Platz 1 (PM-153):** ein Soll-Wortlaut für die drei Schrägstrich-Titel,
// die aus CoS-E-100 zurückgegeben wurden. Der Designer hat in DC-148 dafür
// bewusst nichts vorgeschlagen: solange die Katalogzeile wortgleich so heißt,
// gibt es keine Umbenennung, die PM-122-A einlöst und den Preis behält.
//
// **Platz 2 (PM-154):** Themenspeicher 29 — die eine Zahl, von der abhängt,
// ob der Fund vor oder hinter Gate 1 gehört: *wie viele der 43 gewerklosen
// Engine-Titel erreicht ein Betrieb mit `maler` oder `boden_parkett`?*
//
// **Platz 3 (PM-155):** die 16 offenen Wortlaut-Abweichungen zwischen
// Onboarding-Vorlage und Katalog — *bewegt eine davon Geld?*
//
// ── Wie gemessen wurde ────────────────────────────────────────────────────
//
// `node scripts/vokabular-abgleich.mjs --gewerklos` und `--vorlage` (beide in
// diesem Lauf dazugekommen), gefahren gegen den Stand `02fe3d5` — nicht gegen
// den Arbeitsbaum, in dem Engineerings CoS-E-100-Umbau uncommittet liegt.
// Alles, was unten steht, ist dort nachfahrbar.
//
// Prüfmeister · 24.09.2026
import { describe, expect, it } from 'vitest'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import {
  preisKategoriePasstZuGewerk,
  preisSchluessel,
  standardpreiseFuerGewerke,
} from '../default-price-selection'
import { getPreisvorlagenForGewerke } from '../preise-vorlagen'
import { gewerkFuerPosition } from '@/lib/positions-gewerk'

type Zeile = { id: string; title: string; category: string; unit: string; unit_price: number }

const alsZeilen = (liste: ReadonlyArray<{ category: string; title: string; unit: string; unit_price: number }>): Zeile[] =>
  liste.map((p, i) => ({ id: `z${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price }))

/** Derselbe Weg wie im Angebots-Endpunkt: Gewerk aus dem Titel, dann Matcher. */
const gefiltert = (liste: Zeile[], titel: string, hauptgewerk?: string) =>
  liste.filter(p => preisKategoriePasstZuGewerk(p.category, gewerkFuerPosition(titel, hauptgewerk)))

const treffer = (titel: string, einheit: string, liste: Zeile[], hauptgewerk?: string) =>
  findePreisposition(titel, einheit, gefiltert(liste, titel, hauptgewerk))

const preisVon = (titel: string, einheit: string, liste: Zeile[], hauptgewerk?: string) =>
  treffer(titel, einheit, liste, hauptgewerk)?.position.unit_price ?? null

const zeileVon = (titel: string, einheit: string, liste: Zeile[], hauptgewerk?: string) =>
  treffer(titel, einheit, liste, hauptgewerk)?.position.title ?? null

const KATALOG = alsZeilen(DEFAULT_PRICES)
/** Die Preisliste, die ein echter Betrieb nach dem Onboarding hat. */
const betrieb = (...gewerke: string[]) => alsZeilen(standardpreiseFuerGewerke(gewerke))

// ───────────────────────────────────────────────────────────────────────────
// PM-153 · Soll-Wortlaut für die drei Schrägstrich-Titel
// ───────────────────────────────────────────────────────────────────────────
describe('PM-153 · die drei Schrägstrich-Titel bekommen einen gemessenen Soll-Wortlaut', () => {
  const SOLL = [
    {
      alt: 'Isoliergrund gegen Nikotin / Ruß / Wasserflecken',
      neu: 'Isoliergrund gegen Nikotin, Ruß und Wasserflecken',
      einheit: 'm²',
      preis: 9,
      eigeneKatalogzeile: true,
    },
    {
      // Nicht `Boden abdecken — …`, obwohl das denselben Preis trifft: die
      // Maler-Engine schreibt an drei Stellen `Boden schützen — <Raum>`
      // (maler.ts Z. 552/678/862), und `mehrgewerk.ts` entdoppelt beide über
      // `boden schütz`. Ein zweiter Name für dieselbe Arbeit wäre genau die
      // Dopplung, vor der Manfred gewarnt hat.
      alt: 'Boden schützen / Abdeckfolie',
      neu: 'Boden schützen',
      einheit: 'm²',
      preis: 1.2,
      eigeneKatalogzeile: false,
    },
    {
      alt: 'Betonwände schleifen / Untergrundvorbereitung',
      neu: 'Betonwände schleifen',
      einheit: 'm²',
      preis: 5.5,
      eigeneKatalogzeile: false,
    },
  ] as const

  it('PM-153-A · nur EINER der drei ist überhaupt eine Katalogzeile', () => {
    // Der Auftrag hieß „Soll-Wortlaut für die drei Schrägstrich-KATALOGZEILEN".
    // Zwei der drei sind keine: sie sind Engine-Titel, die eine anders
    // lautende Katalogzeile fuzzy treffen. Für die zwei ist es deshalb gar
    // keine Katalogfrage — ihr Titel darf sich ändern, ohne dass der Katalog
    // angefasst wird.
    const imKatalog = SOLL.filter(s => DEFAULT_PRICES.some(p => p.title === s.alt))
    expect(imKatalog.map(s => s.alt)).toEqual(['Isoliergrund gegen Nikotin / Ruß / Wasserflecken'])
    for (const s of SOLL) {
      expect(DEFAULT_PRICES.some(p => p.title === s.alt), `${s.alt}`).toBe(s.eigeneKatalogzeile)
    }
  })

  it('PM-153-B · jeder Soll-Wortlaut trifft dieselbe Zeile zum selben Preis wie heute', () => {
    // Zwölf Messungen je Titel: vier Preislisten × drei Hauptgewerke. Die
    // Hauptgewerke stehen dabei, weil `gewerkFuerPosition` erst auf das
    // Hauptgewerk zurückfällt, wenn keine eigene Regel greift — ein
    // Wortlautwechsel kann genau diesen Rückfall auslösen (die Kette aus
    // PM-117/PM-148).
    const LISTEN: Array<[string, Zeile[]]> = [
      ['Maler', betrieb('maler')],
      ['Boden', betrieb('boden_parkett')],
      ['Maler+Boden', betrieb('maler', 'boden_parkett')],
      ['Allrounder', KATALOG],
    ]
    for (const s of SOLL) {
      for (const [name, liste] of LISTEN) {
        for (const haupt of [undefined, 'maler', 'boden_parkett']) {
          const wo = `${s.alt} · ${name} · haupt=${haupt}`
          expect(preisVon(s.neu, s.einheit, liste, haupt), `${wo}: Preis`).toBe(preisVon(s.alt, s.einheit, liste, haupt))
          expect(zeileVon(s.neu, s.einheit, liste, haupt), `${wo}: Zeile`).toBe(zeileVon(s.alt, s.einheit, liste, haupt))
        }
      }
      // Und der Preis ist der, der heute auf dem Kundenpapier steht.
      expect(preisVon(s.neu, s.einheit, betrieb('maler', 'boden_parkett')), s.alt).toBe(s.preis)
    }
  })

  it('PM-153-C · beim Isoliergrund ist der Komma-Wortlaut der EINZIGE, der ohne Katalogänderung trägt', () => {
    // Das ist der Grund, warum genau diese Fassung dasteht und keine
    // schönere. Ein Betrieb, der seinen Preis schon gespeichert hat, trägt
    // die ALTE Zeile in seiner Datenbank. Jede Fassung, die dort nichts mehr
    // trifft, macht aus 9,00 € eine 0,00-€-Zeile — still, ohne Fehlermeldung.
    const liste = betrieb('maler')
    const KANDIDATEN = [
      'Isoliergrund auftragen — Nikotin, Ruß, Wasserflecken',
      'Isoliergrund auftragen (Nikotin, Ruß, Wasserflecken)',
      'Isoliergrund gegen Flecken auftragen',
      'Isoliergrund auftragen',
    ]
    for (const k of KANDIDATEN) {
      expect(preisVon(k, 'm²', liste, 'maler'), `${k}: trifft im Bestandskonto doch etwas`).toBeNull()
    }
    expect(preisVon('Isoliergrund gegen Nikotin, Ruß und Wasserflecken', 'm²', liste, 'maler')).toBe(9)
    expect(treffer('Isoliergrund gegen Nikotin, Ruß und Wasserflecken', 'm²', liste, 'maler')?.score).toBe(1)
  })

  it('PM-153-D · kein Soll-Wortlaut trägt noch einen Schrägstrich (PM-122-A)', () => {
    for (const s of SOLL) {
      expect(s.alt.includes('/'), `${s.alt}`).toBe(true)
      expect(s.neu.includes('/'), `${s.neu}`).toBe(false)
    }
  })

  it('PM-153-F · `Boden schützen` ist der Name, den die Engine ohnehin schon schreibt', () => {
    // Der Grund, warum dort nicht `Boden abdecken — mit Folie` steht, obwohl
    // das denselben Preis trifft: dieser Name existiert im Produkt bereits
    // drei Mal (`Boden schützen — <Raum>`, maler.ts). Zwei Namen für dieselbe
    // Arbeit sind genau die Dopplung, gegen die dieser ganze Abgleich läuft.
    const liste = betrieb('maler')
    expect(preisVon('Boden schützen', 'm²', liste, 'maler')).toBe(1.2)
    expect(treffer('Boden schützen', 'm²', liste, 'maler')?.score).toBe(1)
    // Und der Raum-Anhang, den die Engine anhängt, ändert daran nichts.
    expect(preisVon('Boden schützen — Wohnzimmer', 'm²', liste, 'maler')).toBe(1.2)
    // Die Entdopplung in `mehrgewerk.ts` greift weiter: sie hängt an
    // „boden schütz", und genau das steht im Soll-Wortlaut.
    expect(/boden\s*(?:schütz|schuetz)/i.test('Boden schützen')).toBe(true)
  })

  it('PM-153-E offen · ein reiner Bodenleger bekommt alle drei zu 0,00 € — unverändert vor wie nach', () => {
    // Kein Fund dieses Laufs, sondern der Stand: die drei sind Maler-Zeilen,
    // die Liste eines reinen Bodenlegers trägt sie nicht. Sie stehen hier,
    // damit die Umbenennung nicht später für diese Lücke verantwortlich
    // gemacht wird.
    const nurBoden = betrieb('boden_parkett')
    for (const s of SOLL) {
      expect(preisVon(s.alt, s.einheit, nurBoden, 'boden_parkett'), s.alt).toBeNull()
      expect(preisVon(s.neu, s.einheit, nurBoden, 'boden_parkett'), s.neu).toBeNull()
    }
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-154 · Themenspeicher 29 — die Titel ohne Gewerk
// ───────────────────────────────────────────────────────────────────────────
describe('PM-154 · Titel ohne Gewerk suchen im ganzen Katalog', () => {
  /**
   * Die Antwort auf die Frage des Chief of Staff, ausgeschrieben statt als
   * Zahl: **alle 43 stammen aus einem Maler- oder Boden-Modul.** Hier steht
   * eine Auswahl, die das trägt — je ein Titel aus jeder beteiligten Datei.
   * Die Vollzahl (43 von 184) gehört dem Skript, nicht diesem Blatt: sie
   * hängt am Engine-Vokabular, und das ändert sich mit jedem neuen Titel.
   */
  const OHNE_GEWERK = [
    'Alte Sockelleisten entfernen',
    'Ausgleichsmasse bis 3 mm einbringen',
    'Bautrockner aufstellen und betreiben',
    'Brandschutzfarbe F30/F60',
    'Epoxid / Versiegelung — Schicht 1',
    'Epoxidharz-Feuchtigkeitssperre aufwalzen',
    'Fugen fräsen',
    'Garagenboden Betonfarbe',
    'Gerüst stellen',
    'Graffiti entfernen',
    'Kalkputz aufbringen',
    'Rissverschluss mit Gewebe',
    'Rohrleitungen lackieren',
    'Schimmelbehandlung',
    'Türzarge lackieren',
    'Untergrundprüfung (Ebenheit, Feuchte, Tragfähigkeit)',
    'Untergrundvorbereitung für Kalkputz',
  ]

  it('PM-154-A · diese Titel routen in gar kein Gewerk — der Kategorie-Filter greift nicht', () => {
    for (const titel of OHNE_GEWERK) {
      expect(gewerkFuerPosition(titel, undefined), `${titel}: hat doch ein Gewerk`).toBeUndefined()
    }
  })

  it('PM-154-B · ohne Gewerk fällt die Position auf das Hauptgewerk zurück — nicht auf „alles"', () => {
    // Die Unterscheidung, die Themenspeicher 29 bisher offenließ: „kein
    // Gewerk" heißt nur dann „ganzer Katalog", wenn auch kein Hauptgewerk
    // dasteht. Im Angebot steht immer eines — deshalb ist der gefährliche
    // Fall der gemischte Auftrag, in dem das Hauptgewerk das FALSCHE ist.
    expect(gewerkFuerPosition('Gerüst stellen', 'maler')).toBe('maler')
    expect(gewerkFuerPosition('Gerüst stellen', 'boden_parkett')).toBe('boden_parkett')
    expect(preisVon('Gerüst stellen', 'Pauschale', betrieb('maler', 'boden_parkett'), 'maler')).toBe(450)
    expect(preisVon('Gerüst stellen', 'Pauschale', betrieb('maler', 'boden_parkett'), 'boden_parkett')).toBeNull()
  })

  it('PM-154-C · ein gestrichenes Wort holt einen fremden Gewerke-Preis herein', () => {
    // Die gemessene Spitze aus `--gewerklos`. Links steht, was heute im
    // Angebot steht, rechts, was nach einer harmlos aussehenden Umbenennung
    // dort stünde — beide über den vollen Katalog, weil ohne Gewerk nicht
    // gefiltert wird.
    const FREMD: Array<[string, string, string, number, number]> = [
      ['Epoxid / Versiegelung — Schicht 1', 'Epoxid / — Schicht 1', 'm²', 9, 55],
      ['Türzarge lackieren', 'Türzarge', 'Stück', 45, 85],
      ['Ausgleichsmasse einbringen', 'einbringen', 'm²', 10, 22],
    ]
    for (const [alt, kurz, einheit, preisAlt, preisNeu] of FREMD) {
      expect(preisVon(alt, einheit, KATALOG), `${alt}: heute`).toBe(preisAlt)
      expect(gewerkFuerPosition(kurz, undefined), `${kurz}: hat ein Gewerk`).toBeUndefined()
      expect(preisVon(kurz, einheit, KATALOG), `${kurz}: nachher`).toBe(preisNeu)
    }
  })

  it('PM-154-D · die teurere Klasse: Titel, die ihr Gewerk erst durch das Wort VERLIEREN', () => {
    // Korrektur an meinem eigenen Eintrag in Themenspeicher 29: das dort
    // genannte Beispiel `Dachschrägen grundieren` gehört NICHT zu den 43 —
    // es hat ein Gewerk (`grundier` → maler) und verliert es erst durch das
    // gestrichene Wort. Das ist die größere Klasse, weil sie jeden Titel
    // betrifft und nicht nur die gewerklosen.
    expect(gewerkFuerPosition('Dachschrägen grundieren', undefined)).toBe('maler')
    expect(preisVon('Dachschrägen grundieren', 'm²', KATALOG)).toBe(4.5)
    expect(gewerkFuerPosition('Dachschrägen', undefined)).toBeUndefined()
    expect(zeileVon('Dachschrägen', 'm²', KATALOG)).toBe('Dachschrägenschrank / Nischenschrank (Sonderanpassung)')
    expect(preisVon('Dachschrägen', 'm²', KATALOG)).toBe(650)
    // Zweiter Beleg, damit es nicht am Einzelfall hängt.
    expect(gewerkFuerPosition('Fenster abschleifen', undefined)).toBe('maler')
    expect(preisVon('Fenster abschleifen', 'Stück', KATALOG)).toBe(20)
    expect(preisVon('Fenster', 'Stück', KATALOG)).toBe(580)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-155 · Onboarding-Vorlage neben dem Katalog
// ───────────────────────────────────────────────────────────────────────────
describe('PM-155 · die abweichenden Vorlagenzeilen bewegen kein Geld', () => {
  const GEWERKE = ['maler', 'boden_parkett']
  const basis = standardpreiseFuerGewerke(GEWERKE)
  const imBasis = new Set(basis.map(preisSchluessel))
  const vorlagen = getPreisvorlagenForGewerke(GEWERKE)
    .map(v => ({ category: v.category, title: v.title, unit: v.unit, unit_price: v.defaultPrice }))
  /** Was `mischeEigenePreise()` als EIGENE Zeile zusätzlich anlegt. */
  const zusaetzlich = vorlagen.filter(v => !imBasis.has(preisSchluessel(v)))
  const mitVorlage = alsZeilen([...basis, ...zusaetzlich])
  const ohneVorlage = alsZeilen(basis)

  it('PM-155-A · die 18 aus der Sperrklinke sind nicht dieselbe Menge wie die Zeilen, die wirklich dazukommen', () => {
    // Engineerings Blatt zählt Titel gegen ALLE Katalogtitel. Was der Betrieb
    // bekommt, entscheidet `preisSchluessel` (Kategorie + Titel + Einheit)
    // gegen SEINEN Katalog — das sind mehr Zeilen, nicht weniger.
    const ohneWortgleichenTitel = vorlagen.filter(v => !DEFAULT_PRICES.some(p => p.title === v.title))
    expect(ohneWortgleichenTitel).toHaveLength(18)
    expect(zusaetzlich.length).toBeGreaterThan(18)
  })

  it('PM-155-B · kein Engine-Titel trifft durch eine Vorlagenzeile eine andere Zeile oder einen anderen Preis', () => {
    // Die Frage des Chief of Staff, an den Zeilen gemessen, die im
    // Gewerke-Filter überhaupt sichtbar werden. Alles andere (Fahrtkosten,
    // Arbeitszeit, Fassade) fällt vorher heraus und kann nichts bewegen.
    const PROBEN: Array<[string, string]> = [
      ['Laminat verlegen schwimmend', 'm²'],
      ['Laminat verlegen', 'm²'],
      ['Klick-Vinyl verlegen schwimmend', 'm²'],
      ['Vinyl-Boden verlegen', 'm²'],
      ['Designboden verlegen', 'm²'],
      ['Teppichboden verlegen', 'm²'],
      ['Parkett abschleifen', 'm²'],
      ['Parkett versiegeln', 'm²'],
      ['Dampfbremse verlegen', 'm²'],
      ['Trittschalldämmung verlegen', 'm²'],
      ['Sockelleisten montieren', 'lfdm'],
    ]
    for (const [titel, einheit] of PROBEN) {
      expect(zeileVon(titel, einheit, mitVorlage), `${titel}: Zeile`).toBe(zeileVon(titel, einheit, ohneVorlage))
      expect(preisVon(titel, einheit, mitVorlage), `${titel}: Preis`).toBe(preisVon(titel, einheit, ohneVorlage))
    }
  })

  it('PM-155-C · was bleibt, ist der bekannte Gleichstand — und der liegt im Katalog selbst', () => {
    // `Laminat verlegen schwimmend` steht auf 1,00 mit DREI Zeilen: der
    // Katalogzeile (14,00 €) und zwei Vorlagenzeilen (14,00 / 16,00 €).
    // Heute gewinnt die Katalogzeile, weil sie in der Liste vorn steht — das
    // ist dieselbe Reihenfolge-Abhängigkeit wie PM-138, und sie ist mit
    // `Laminat verlegen schwimmend (Großdiele)` bereits als offen vermerkt.
    expect(preisVon('Laminat verlegen schwimmend', 'm²', mitVorlage)).toBe(14)
    expect(zusaetzlich.some(v => v.title === 'Laminat verlegen schwimmend (Großdiele)' && v.unit_price === 16)).toBe(true)
    // Die drei Vinyl-Titel teilen sich ihren Höchstscore schon OHNE jede
    // Vorlagenzeile mit mehreren verschieden teuren Katalogzeilen. Die
    // Vorlage legt dort keine neue Gefahr an, sie steht daneben.
    for (const titel of ['Designboden verlegen', 'Vinyl-Boden verlegen', 'Klick-Vinyl verlegen']) {
      const erst = treffer(titel, 'm²', ohneVorlage)
      expect(erst, titel).not.toBeNull()
      const gleichauf = gefiltert(ohneVorlage, titel)
        .map(p => ({ p, s: findePreisposition(titel, 'm²', [p])?.score ?? 0 }))
        .filter(x => Math.abs(x.s - (erst?.score ?? 0)) < 1e-9)
      expect(new Set(gleichauf.map(x => x.p.unit_price)).size, `${titel}: kein Katalog-Gleichstand`).toBeGreaterThan(1)
    }
  })
})
