// Positionstitel als Vertrag — die Stellen, die ihn LESEN.
//
// ── Warum es diese Datei gibt (Prüfmeister O.4, 12.09.2026) ───────────────
//
// Am 12.09. wurde `Wandflächen streichen 2x` zu `Wand streichen 2x`
// umbenannt. Die Umbenennung war eine Zeile. Teuer war, dass **zwölf
// Stellen in drei Schichten** den alten Titel als stillen Vertrag gelesen
// haben. Drei davon hätten doppelt abgerechnet, zwei hätten ganze Positionen
// verschluckt, eine hätte den Untertitel vom Kundendokument genommen.
//
// Elf dieser zwölf waren durch **keinen** Test gedeckt. Der eine, der
// aufgefallen ist, hatte einen — geschrieben von jemandem, dem genau dieser
// Fall wichtig war.
//
// Deshalb prüft diese Datei jede dieser Stellen am ERGEBNIS, nicht am Code:
// Kommt die Position im Angebot an? Steht der Raum noch dran? Ist die
// ersetzte Position wirklich weg? Wer den Titel das nächste Mal ändert,
// bekommt hier zwölf rote Zeilen statt eines stillen Schadens.
//
// Die Zahlen in den Kommentaren sind der Schaden, den die jeweilige Stelle
// anrichtet, wenn sie ins Leere läuft.
import { describe, expect, it } from 'vitest'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { positionsUntertitel } from '../positions-untertitel'
import { istWandStreichen, istDeckeStreichen, mitTitelZusatz } from '../positions-titel'
import type { BerechnetePosition } from '../mengen/types'

const pos = (b: string, m: number, e = 'm²'): BerechnetePosition =>
  ({ beschreibung: b, menge: m, einheit: e, konfidenz: 'high', berechnungsweg: `${m} ${e}`, annahmen: [] })

/** Ein Angebot mit Wandposition, wie es die Mengen-Engine liefert. */
const WAND = () => [pos('Wand streichen 2x — Wohnzimmer', 45)]
const WAND_DECKE = () => [pos('Wand streichen 2x — Arbeitszimmer', 39), pos('Decke streichen 2x — Arbeitszimmer', 14)]

const lauf = (eingabe: BerechnetePosition[], text: string) =>
  pruefeUndErgaenzeVollstaendigkeit('maler', eingabe, text)

const titel = (eingabe: BerechnetePosition[], text: string) =>
  lauf(eingabe, text).positionen.map(p => p.beschreibung)

describe('Die Erkenner selbst', () => {
  it('erkennt beide Schreibweisen — alte Angebote bleiben lesbar', () => {
    // Ein Angebot, das vor der Umbenennung entstanden ist, muss weiter
    // erkannt werden. Sonst repariert man die Gegenwart und bricht die
    // Vergangenheit.
    for (const alt of ['Wandflächen streichen 2x — Bad', 'Wandfläche streichen 1x']) {
      expect(istWandStreichen(alt), alt).toBe(true)
    }
    for (const neu of ['Wand streichen 2x — Bad', 'Wand streichen 2x (ohne Akzentwand) — Salon']) {
      expect(istWandStreichen(neu), neu).toBe(true)
    }
    expect(istDeckeStreichen('Deckenfläche streichen 2x — Bad')).toBe(true)
    expect(istDeckeStreichen('Decke streichen 2x — Bad')).toBe(true)
  })

  it('hält Wand und Decke auseinander', () => {
    // Sonst bekommt die Decke den Wandpreis und umgekehrt.
    expect(istDeckeStreichen('Wand streichen 2x')).toBe(false)
    expect(istWandStreichen('Decke streichen 2x')).toBe(false)
    // Und nichts, was nur zufällig „Wand" enthält.
    expect(istWandStreichen('Betonwände schleifen')).toBe(false)
    expect(istWandStreichen('Akzentwand tapezieren')).toBe(false)
  })

  it('setzt einen Zusatz vor den Raum, nicht dahinter', () => {
    // Der Raum steht per Konvention hinter dem Gedankenstrich. Wer dahinter
    // anhängt, macht aus dem Raum „Bad (chlorbeständige Spezialfarbe)" —
    // und jede Stelle, die den Raum aus dem Titel liest, bekommt Müll.
    expect(mitTitelZusatz('Wand streichen 2x — Bad', 'Feuchtraumfarbe'))
      .toBe('Wand streichen 2x (Feuchtraumfarbe) — Bad')
    expect(mitTitelZusatz('Wand streichen 2x', 'abwaschbare Farbe'))
      .toBe('Wand streichen 2x (abwaschbare Farbe)')
  })
})

describe('Stellen, die die Streichposition ERSETZEN — sonst doppelt berechnet', () => {
  it('Betonwand: Wandanstrich raus, Beton-Kette rein', () => {
    // Läuft der Erkenner ins Leere, steht die Betonwand-Kette NEBEN dem
    // normalen Wandanstrich: der Kunde zahlt die Wand zweimal.
    const namen = titel(WAND(), 'Betonwände im Keller, 45 Quadratmeter, streichen.')
    expect(namen.some(n => /betonfarbe|betonwände/i.test(n))).toBe(true)
    expect(namen.filter(n => istWandStreichen(n))).toHaveLength(0)
  })

  it('Kalkputz: Wandanstrich raus, Kalkputz rein', () => {
    // Der teuerste der Fälle: Kalkputz kostet 35,00 €/m², ein Wandanstrich
    // 9,50 €. Bleibt der Anstrich stehen, steht auf dem Kundenpapier die
    // falsche Leistung UND der falsche Preis.
    const namen = titel(WAND(), 'Wohnzimmer mit Kalkputz, 45 Quadratmeter.')
    expect(namen.some(n => /kalkputz aufbringen/i.test(n))).toBe(true)
    expect(namen.filter(n => istWandStreichen(n))).toHaveLength(0)
  })

  it('Tapete: Streichposition raus, Tapete entfernen + spachteln rein', () => {
    // 4,00 €/m² ablösen + 9,00 €/m² spachteln — auf 45 m² rund 585 €, die
    // sonst aus dem Angebot in die Fehlt-Liste rutschen.
    const namen = titel(WAND(), 'Alte Tapete runter, Wände spachteln, neue Raufaser drauf und streichen.')
    expect(namen.some(n => /tapete entfern/i.test(n))).toBe(true)
    expect(namen.some(n => /raufaser tapezieren/i.test(n))).toBe(true)
  })
})

describe('Stellen, die die Streichposition UMBENENNEN — sonst verschwindet die Zusage', () => {
  it('Feuchtraumfarbe steht im Titel, der Raum bleibt dahinter', () => {
    // Diese Stelle war schon VOR der Umbenennung tot: Sie ersetzte mit
    // `/streichen(\s*—\s*.+)?$/`, der Titel endet aber auf „… 2x — Bad".
    // Zwischen „streichen" und dem Gedankenstrich steht die Anstrichzahl.
    const namen = titel([pos('Wand streichen 2x — Bad', 20)], 'Bad streichen mit Feuchtraumfarbe.')
    const wand = namen.find(n => istWandStreichen(n))
    expect(wand).toMatch(/Feuchtraumfarbe/)
    expect(wand).toMatch(/— Bad$/)
  })

  it('abwaschbare Farbe steht im Titel, der Raum bleibt dahinter', () => {
    const namen = titel([pos('Wand streichen 2x — Küche', 25)], 'Küche streichen, bitte abwaschbare Farbe.')
    const wand = namen.find(n => istWandStreichen(n))
    expect(wand).toMatch(/abwaschbare Farbe/)
    expect(wand).toMatch(/— Küche$/)
  })
})

describe('Stellen, die von der Streichposition ERBEN — sonst fehlt die Folgearbeit', () => {
  it('Grundierung erbt Fläche und Raum von der Wandposition', () => {
    // Ohne Treffer fällt die Grundierung aus oder verliert den Raum und
    // landet im Angebot unter „Allgemein" (Trockenlauf PM-028).
    const ergebnis = lauf(WAND(), 'Wohnzimmer, Wände bitte grundieren und streichen.')
    const grund = ergebnis.positionen.find(p => /grundierung|voranstrich/i.test(p.beschreibung))
    expect(grund).toBeDefined()
    expect(grund!.menge).toBe(45)
    expect(grund!.beschreibung).toMatch(/— Wohnzimmer$/)
  })

  it('Spachtelarbeiten erben die Fläche — und Wand und Decke bleiben unterscheidbar', () => {
    // Ohne Treffer fallen SÄMTLICHE Spachtelpositionen ersatzlos aus. Und
    // ohne die Decken-Unterscheidung stehen zwei gleich benannte Zeilen mit
    // verschiedenen Mengen auf dem Angebot (PM-018, Darstellungsfund 1).
    const namen = titel(WAND_DECKE(), 'Arbeitszimmer, Wände und Decke komplett spachteln, Qualitätsstufe Q3, danach streichen.')
    const spachtel = namen.filter(n => /spachtelarbeiten/i.test(n))
    expect(spachtel).toHaveLength(2)
    expect(spachtel.filter(n => /decke/i.test(n))).toHaveLength(1)
    for (const s of spachtel) expect(s).toMatch(/Q3/)
  })

  it('Heizkörper: die Raumzahl kommt aus den Wandpositionen', () => {
    // `maler-lackieren.ts` zählt die Räume anhand dieser Positionen. Ohne
    // Treffer sind es null Räume und die Heizkörperzahl stimmt nicht.
    //
    // ── Geändert am 14.09.2026 (DC-091) ───────────────────────────────
    //
    // Hier stand `.find(...)` und `menge === 2`: EINE Position mit beiden
    // Heizkörpern. Genau die war der Fehler — sie trug den Raum der ersten
    // Wandposition, also standen auf dem Kundenpapier unter „Wohnzimmer"
    // zwei Heizkörper und unter „Schlafzimmer" keiner.
    //
    // Die Zusicherung dieses Tests bleibt dieselbe: Die Zahl muss aus den
    // Wandpositionen kommen. Sie steht jetzt nur in der SUMME statt in einer
    // Zeile — und die Summe ist der schärfere Test: Fällt der Erkenner aus,
    // sind es null Räume und damit eine Position mit Menge 1, nicht zwei.
    const eingabe = [
      pos('Wand streichen 2x — Wohnzimmer', 45),
      pos('Wand streichen 2x — Schlafzimmer', 38),
    ]
    const hzk = lauf(eingabe, 'Wohnzimmer und Schlafzimmer streichen, je ein Heizkörper lackieren.')
      .positionen.filter(p => /heizkörper.*(?:lackieren|streichen)/i.test(p.beschreibung))
    expect(hzk.length).toBeGreaterThan(0)
    expect(hzk.reduce((summe, p) => summe + p.menge, 0)).toBe(2)
    // Und jeder in seinem Raum — das ist der Teil, der vorher fehlte.
    expect(hzk.map(p => p.beschreibung).join(' ')).toMatch(/— Wohnzimmer/)
    expect(hzk.map(p => p.beschreibung).join(' ')).toMatch(/— Schlafzimmer/)
  })
})

describe('Das Kundendokument', () => {
  it('gibt der häufigsten Position des Produkts einen Untertitel', () => {
    // `positions-untertitel.ts` prüfte auf `wandfläche(n) streich`. Ohne
    // Anpassung stünde unter „Wand streichen 2x" auf dem KUNDENDOKUMENT
    // nichts mehr — wortlos.
    expect(positionsUntertitel('Wand streichen 2x — Wohnzimmer')).toBeTruthy()
    expect(positionsUntertitel('Decke streichen 2x — Wohnzimmer')).toBeTruthy()
    // Und die alte Schreibweise bleibt bedient.
    expect(positionsUntertitel('Wandflächen streichen 2x — Wohnzimmer')).toBeTruthy()
  })
})
