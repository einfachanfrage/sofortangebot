// Aufwandswörter — die Regel, die verhindert, dass ein Arbeitsgang still
// verschwindet oder still dazukommt.
//
// Dieser Test hält die BELEGE fest, nicht die Implementierung: jeder Fall
// hier ist einer, den Manfred oder der Prüfmeister am 11./12.09.2026 an
// echten Angeboten gezeigt hat. Wer die Regel später umbaut, darf diese
// Fälle nicht verlieren.
//
// Gegenrichtung ausdrücklich mitgeprüft: Die Regel darf den Katalog nicht
// zusperren. Beim ersten Anlauf verloren 16 Titel ihren Preis, weil
// „Grundierung" und „Grundieren" als verschiedene Wörter galten — deshalb
// stehen die Nicht-Sperren hier gleichberechtigt neben den Sperren.
import { describe, expect, it } from 'vitest'
import { aufwandSperre } from '../preis-aufwandswoerter'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'

const katalog = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))
const boden = katalog.filter(p => p.category.startsWith('Boden'))
const maler = katalog.filter(p => p.category.startsWith('Maler'))

describe('Aufwandswörter — sperren, wo ein Arbeitsgang fehlt oder zu viel ist', () => {
  it.each([
    // Manfreds Fall: „Das ist bei mir der Unterschied zwischen einem halben
    // Tag und zwei Tagen, mit Kleberresten, Spachtel, Schleifen."
    ['Alten Teppichboden entfernen (verklebt)', 'Teppichboden entfernen und entsorgen'],
    // Der Fall des Prüfmeisters: Der Kunde bekommt eine Versiegelung aufs
    // Papier, die keiner bestellt hat — und der Betrieb schuldet sie dann.
    ['Parkett abschleifen (2 Schleifgänge)', 'Parkett schleifen + versiegeln komplett (2x schleifen, 2x Lack)'],
    ['Parkett abschleifen (2 Schleifgänge)', 'Parkett schleifen + ölen komplett (2x schleifen, 2x Öl)'],
    // Die leisesten: 16 € Unterschied pro m², unsichtbar im Angebot.
    ['Ausgleichsmasse einbringen (bis 30mm)', 'Ausgleichsmasse bis 3 mm einbringen'],
    // Gangzahl — der Katalog schreibt die Einzahl mit „a", nicht mit „ä".
    ['Parkett abschleifen (2 Schleifgänge)', 'Parkett abschleifen (maschinell, 1 Schleifgang)'],
    ['Parkett abschleifen (2 Schleifgänge)', 'Parkett abschleifen komplett (stark beschädigt, 3 Schleifgänge)'],
    // Gedankenstrich-Falle: beide kosten 9,00 €, deshalb fiel es nie auf.
    ['Epoxid / Versiegelung — Schicht 2', 'Epoxid / Versiegelung — Schicht 1'],
    // „Auf einer Fassade sind das schnell 150 €."
    ['Grundierung / Tiefengrund Fassade', 'Grundieren (Tiefengrund)'],
  ])('sperrt hart: %s  ←  %s', (gesucht, kandidat) => {
    expect(aufwandSperre(gesucht, kandidat)?.grad).toBe('hart')
  })

  it('sperrt den Katalog NICHT zu — dieselbe Arbeit in anderer Wortform', () => {
    const paare: Array<[string, string]> = [
      // Der Fehler aus Anlauf 1: verglichen wurde die Wortform statt der
      // Bedeutung. „Grundierung" und „Grundieren" sind dieselbe Arbeit.
      ['Dachschrägen grundieren', 'Grundieren (Tiefengrund)'],
      ['Estrich grundieren', 'Grundierung / Haftbrücke auftragen'],
      // Kompositum = dieselbe Arbeit. Eine linke Wortgrenze hier hat schon
      // einmal 13 Tests gerissen.
      ['Feinspachteln Q3', 'Spachtelarbeiten Q3'],
      // Gangzahl gleich → frei, auch bei anderem Beiwerk.
      ['Parkett abschleifen (2 Schleifgänge)', 'Parkett abschleifen (maschinell, 2 Schleifgänge inkl. Rand)'],
    ]
    for (const [gesucht, kandidat] of paare) {
      expect(aufwandSperre(gesucht, kandidat), `${gesucht} ← ${kandidat}`).not.toMatchObject({ grad: 'hart' })
    }
  })

  it('zählt Farbtöne und Materialien nicht als Aufwand (Prüfmeister: ausdrücklich kein Aufwandswort)', () => {
    // `Ölfarbe` ist ein Material, nicht der Arbeitsgang „ölen". Das ist
    // genau so schiefgegangen, als die Unicode-Flags beim Markieren
    // verlorengingen: `(?![\p{L}])` ohne `u` sperrt gar nichts ab, und
    // `Fenster lackieren (Ölfarbe, 2× Anstrich)` verlor seine 55,00 €.
    expect(aufwandSperre('Fenster lackieren (Ölfarbe, 2× Anstrich)', 'Fenster lackieren (2× Anstrich)')).toBeNull()
    expect(aufwandSperre('Wand streichen 2x (Dunkelblau, Zone 1)', 'Wand streichen 2x Anstrich')).toBeNull()
  })

  it('lässt die Verlegeart nur in EINE Richtung sperren, solange die Engine sie nicht schreibt', () => {
    // Gesucht sagt „verklebt", Kandidat sagt „lose" → gesperrt.
    expect(aufwandSperre('Teppichboden verlegen vollflächig verklebt',
      'Teppichboden verlegen lose (doppelseitiges Klebeband)')?.grad).toBe('hart')
    // Gesucht sagt nichts, Kandidat sagt „schwimmend" → NICHT gesperrt.
    // Sonst fällt jede ehrliche Katalogzeile weg und übrig bleibt die
    // exotische: `Laminat verlegen` 14,00 € → 24,00 € (Fischgrätmuster).
    expect(aufwandSperre('Laminat verlegen', 'Laminat verlegen schwimmend (Klick-System, Standard)')).toBeNull()
    expect(aufwandSperre('Parkett verlegen', 'Fertigparkett verlegen schwimmend (Klick-System)')).toBeNull()
  })

  it('unterscheidet Grundierungsarten — Material, nicht Arbeitsgang', () => {
    // Manfred, 12.09.2026: *„Sechs. Nicht viereinhalb. Der Grund ist das
    // Material, nicht die Arbeit: Tiefengrund ist Wasser mit ein bisschen
    // Bindemittel. Haftgrund für Estrich ist gefüllt, mit Quarzsand, damit
    // die Ausgleichsmasse greift — der Eimer kostet das Drei- bis
    // Vierfache."*
    expect(aufwandSperre('Estrich grundieren (Haftgrund)', 'Grundieren (Tiefengrund)')?.grad).toBe('hart')
    expect(aufwandSperre('Grundieren (Tiefengrund)', 'Grundieren (Haftgrund / Sperrgrund)')?.grad).toBe('hart')
    // Epoxi ist ausdrücklich NICHT dasselbe wie Haftgrund („eher 10 €, aber
    // das wäre eine eigene Position ‚Estrich sperren (Epoxi)'").
    expect(aufwandSperre('Estrich grundieren (Epoxi-Grund)', 'Grundieren (Haftgrund / Sperrgrund)')?.grad).toBe('hart')
  })

  it('lässt eine Sammelzeile für jedes Material gelten, das sie nennt', () => {
    // `Untergrund grundieren (Haftgrund / Tiefengrund)` deckt beide ab — sie
    // darf gegen einen Haftgrund-Auftrag nicht fallen, nur weil sie
    // zusätzlich den Tiefengrund nennt. Das ist der Unterschied zwischen
    // „anderes Material" und „auch anderes Material".
    expect(aufwandSperre('Estrich grundieren (Haftgrund)', 'Untergrund grundieren (Haftgrund / Tiefengrund)')).toBeNull()
    expect(aufwandSperre('Grundieren (Tiefengrund)', 'Untergrund grundieren (Haftgrund / Tiefengrund)')).toBeNull()
  })

  it('schweigt, wo kein Material genannt ist', () => {
    // Der häufigste Fall: „Wände grundieren" sagt nichts über das Produkt.
    // Dort darf die Regel nicht sperren, sonst verliert der halbe Katalog
    // seine Grundierungszeilen.
    expect(aufwandSperre('Wände grundieren', 'Grundieren (Tiefengrund)')).toBeNull()
    expect(aufwandSperre('Dachschräge Grundierung', 'Grundieren (Tiefengrund)')).toBeNull()
    expect(aufwandSperre('Türen grundieren', 'Türen grundieren')).toBeNull()
  })

  it('weicht auf einen gebündelten Katalogpreis aus, wenn es keinen unbündelten gibt', () => {
    // Die einzige passende Zeile heißt `Schimmelbehandlung / Grundierung` —
    // der Katalog bündelt dort zwei Schritte, unbündelt gibt es nichts.
    // Hart gesperrt stünde der Handwerker mit 0,00 € da, obwohl sein
    // eigener Katalog einen Preis führt.
    const befund = aufwandSperre('Schimmelbehandlung', 'Schimmelbehandlung / Grundierung')
    expect(befund?.grad).toBe('nachrang')
    expect(findePreisposition('Schimmelbehandlung / Grundierung', 'm²', maler)?.position.unit_price).toBeGreaterThan(0)
  })
})

describe('Aufwandswörter im Matcher — was am Ende im Angebot steht', () => {
  it('gibt dem verklebten Teppich den Verklebt-Preis, nicht den losen', () => {
    const treffer = findePreisposition('Alten Teppichboden entfernen (verklebt)', 'm²', boden)
    expect(treffer?.position.title).toBe('Teppichboden verklebt entfernen')
    expect(treffer?.position.unit_price).toBe(9)
  })

  it('gibt dem 2-Gang-Schliff den 2-Gang-Preis, nicht den 1-Gang-Preis', () => {
    const treffer = findePreisposition('Parkett abschleifen (2 Schleifgänge) — Wohnzimmer', 'm²', boden)
    expect(treffer?.position.title).toContain('2 Schleifgänge')
    expect(treffer?.position.unit_price).toBe(20)
  })

  it('gibt dem Estrich den Haftgrund-Preis, nicht den Tiefengrund-Preis', () => {
    // Der Fall, an dem sich zeigt, warum die Klammer allein nicht reicht:
    // Beide Katalogzeilen heißen nach der Normalisierung „grundieren", der
    // Gleichstand ging an die obere — Tiefengrund, 4,50 €. Auch Manfreds
    // eigener Vorschlag, den Titel ohne Klammer zu bauen, half nicht; der
    // Unterschied sitzt auf der KANDIDATEN-Seite.
    const treffer = findePreisposition('Estrich grundieren (Haftgrund)', 'm²', maler)
    expect(treffer?.position.title).toBe('Grundieren (Haftgrund / Sperrgrund)')
    expect(treffer?.position.unit_price).toBe(6)
    // Gegenprobe: Wer keinen Haftgrund bestellt, bekommt ihn auch nicht.
    expect(findePreisposition('Wände grundieren', 'm²', maler)?.position.unit_price).toBe(4.5)
  })

  it('sperrt die Ausgleichsmasse sichtbar, statt still den 3-mm-Preis zu nehmen', () => {
    // PM-018: „lieber sichtbar kein Preis als still der falsche."
    // Der Katalog hat für 10 mm und 30 mm keine Zeile. Also 0,00 € im
    // Entwurf, Versand gesperrt (CoS-E-004) — bis der Betrieb den Preis
    // einträgt. Das ist das gewollte Ergebnis, kein Ausfall.
    expect(findePreisposition('Ausgleichsmasse einbringen (bis 30mm)', 'm²', boden)).toBeNull()
    // Ohne Spannenangabe darf der Grundfall dagegen einspringen.
    expect(findePreisposition('Ausgleichsmasse einbringen', 'm²', boden)?.position.unit_price).toBe(10)
  })

  it('lässt den Aufpreis aufs Verlegemuster verlegeartneutral', () => {
    // Ein Aufpreis auf das MUSTER hängt nicht an der Verlegeart. Der
    // erfundene Zusatz „(vollflächig verklebt)" im Engine-Titel sperrte den
    // einzigen passenden Katalogeintrag aus: 14,00 € wurden zu 0,00 €.
    expect(findePreisposition('Aufpreis Fischgrät-Verlegemuster', 'm²', boden)?.position.unit_price).toBe(14)
  })
})
