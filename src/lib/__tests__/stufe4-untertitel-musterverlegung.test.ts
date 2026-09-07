import { describe, it, expect } from 'vitest'
import { positionsUntertitel, waehleUntertitel } from '../positions-untertitel'
import { bodenEngine } from '../mengen/gewerke/boden'
import { MUSTER_KATALOG } from '../mengen/gewerke/boden'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { malerEngine } from '../mengen/gewerke/maler'
import { abgezogeneOeffnungen } from '../mengen/gewerke/vob-uebermessung'

// ── Stufe 4, Abschluss (Prüfmeister, 05.–07.09.2026) ──────────────────────
//
// Drei Funde aus PM-021, PM-022, PM-025 und PM-026 — keiner davon ein
// Rechenfehler, alle drei trotzdem teuer:
//
//   Untertitel  „Deckender 2-fach-Anstrich" unter „streichen 1x" (3 Belege)
//   PM-025-A    Fischgrät wirkt auf den Verschnitt, aber nicht auf den Preis
//   PM-021      Die Klammer im Rechenweg listet Türen, die nicht abgezogen sind

describe('Untertitel: die Anstrichzahl im Titel regiert den Text darunter', () => {
  it('1x verspricht keine zwei Lagen mehr — der Originalfund aus PM-021', () => {
    const u = positionsUntertitel('Wandflächen streichen 1x — Wohnzimmer')
    expect(u).toMatch(/einlagig/)
    expect(u).not.toMatch(/2-fach|zwei|2 Lagen/i)
  })

  it('PM-022 und PM-026: dieselbe Regel für die Decke', () => {
    expect(positionsUntertitel('Deckenfläche streichen 1x — Flur')).toMatch(/einlagig/)
    expect(positionsUntertitel('Deckenfläche streichen 1x — Küche')).not.toMatch(/2 Lagen/i)
  })

  it('2x und 3x bleiben ehrlich benannt', () => {
    expect(positionsUntertitel('Wandflächen streichen 2x — Bad')).toMatch(/zweilagig/)
    expect(positionsUntertitel('Deckenfläche streichen 2x — Bad')).toMatch(/zweilagig/)
    expect(positionsUntertitel('Wandflächen streichen 3x — Bad')).toMatch(/dreilagig/)
  })

  it('der Klammerzusatz aus PM-032 stört die Zahl nicht', () => {
    expect(positionsUntertitel('Wandflächen streichen 1x (ohne Akzentwand) — Bad')).toMatch(/einlagig/)
  })

  // Lieber gar keine Zahl als eine erfundene: Ohne „Nx" im Titel weiß
  // niemand, wie oft gestrichen wird — dann verspricht der Untertitel nichts.
  it('ohne Zahl im Titel nennt der Untertitel keine Lagen', () => {
    const u = positionsUntertitel('Wände streichen')
    expect(u).toBe('Deckender Anstrich, Kanten sauber abgeschnitten')
    expect(u).not.toMatch(/lagig|fach|Lagen/i)
  })

  it('die Engine-Titel und der Untertitel passen zusammen — Ende zu Ende', () => {
    const positionen = malerEngine({
      transkript: 'Küche, vier Meter zwanzig mal drei Meter sechzig, Höhe zwo fünfzig. '
        + 'Wände zweimal streichen, Decke reicht einmal. Zwei Fenster, Standardmaß, eine Tür, normal.',
      raeume: [{
        name: 'Küche', laenge: 4.2, breite: 3.6, hoehe: 2.5,
        fenster: [{ breite: 1.2, hoehe: 1.3, anzahl: 2 }],
        tueren: [{ breite: 0.9, hoehe: 2.1, anzahl: 1 }],
        arbeiten: ['waende_streichen', 'decke_streichen'],
      }],
    } as never).positionen

    const wand = positionen.find(p => /wandflächen streichen/i.test(p.beschreibung))
    const decke = positionen.find(p => /deckenfläche streichen/i.test(p.beschreibung))
    expect(wand?.beschreibung).toMatch(/2x/)
    expect(decke?.beschreibung).toMatch(/1x/)
    expect(positionsUntertitel(wand!.beschreibung)).toMatch(/zweilagig/)
    expect(positionsUntertitel(decke!.beschreibung)).toMatch(/einlagig/)
  })

  it('die KI darf den Untertitel weiterhin nicht überschreiben', () => {
    expect(waehleUntertitel('Deckenfläche streichen 1x — Küche', 'Deckenanstrich in 2 Lagen'))
      .toMatch(/einlagig/)
  })
})

// ── PM-025-A ──────────────────────────────────────────────────────────────
const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: String(i), title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))
const preisFuer = (beschreibung: string, einheit: string) =>
  findePreisposition(beschreibung, einheit, KATALOG)?.position

const raum = (belag: string, verlegerichtung: string | null) => bodenEngine({
  transkript: '',
  raeume: [{
    name: 'Gästezimmer', laenge: 4, breite: 3.5, belag, verlegerichtung,
    tueren: [{ breite: 0.9, hoehe: 2.1, anzahl: 1 }],
  }],
} as never).positionen

describe('PM-025-A — Fischgrät wirkt jetzt auch auf den Preis', () => {
  it('der Originalfall trifft das korrigierte Soll: 16,10 m² × 36,00 € = 579,60 €', () => {
    const p = raum('Vinylboden', 'fischgrät')
    const verlegen = p.find(x => /kleben|verlegen/i.test(x.beschreibung))
    expect(verlegen?.beschreibung).toMatch(/^Designbelag im Fischgrätmuster kleben/)
    expect(verlegen?.menge).toBe(16.1)
    const preis = preisFuer(verlegen!.beschreibung, verlegen!.einheit)
    expect(preis?.unit_price).toBe(36)
    expect(Math.round(16.1 * 36 * 100) / 100).toBe(579.6)
  })

  it('gerade Verlegung bleibt unverändert — die Regel gilt nur fürs Muster', () => {
    const verlegen = raum('Vinylboden', null).find(x => /verlegen/i.test(x.beschreibung))
    expect(verlegen?.beschreibung).toMatch(/^Vinyl-Boden verlegen/)
    expect(verlegen?.beschreibung).not.toMatch(/fischgr/i)
  })

  it('Laminat bekommt seinen eigenen Katalogeintrag, nicht den vom Parkett', () => {
    const verlegen = raum('Laminat', 'fischgrät').find(x => /verlegen/i.test(x.beschreibung))
    expect(verlegen?.beschreibung).toMatch(/^Laminat im Fischgrätmuster verlegen/)
    expect(preisFuer(verlegen!.beschreibung, 'm²')?.unit_price).toBe(24)
  })

  // Fertigparkett ist kein Stabparkett — der Titel darf nicht getauscht
  // werden. Genau dafür hat der Katalog den Aufpreis-Eintrag.
  it('Parkett behält seinen Titel und bekommt den Aufpreis als eigene Zeile', () => {
    const p = raum('Eichenparkett', 'fischgrät')
    const verlegen = p.find(x => /fertigparkett verlegen/i.test(x.beschreibung))
    const aufpreis = p.find(x => /aufpreis fischgr/i.test(x.beschreibung))
    expect(verlegen?.beschreibung).not.toMatch(/stabparkett/i)
    expect(aufpreis?.menge).toBe(verlegen?.menge)
    expect(preisFuer(aufpreis!.beschreibung, 'm²')?.unit_price).toBe(14)
  })

  it('Beläge ohne Fischgrät-Eintrag bekommen keine erfundene Position', () => {
    const p = raum('Teppichboden', 'fischgrät')
    expect(p.some(x => /fischgr/i.test(x.beschreibung))).toBe(false)
    expect(p.find(x => /verlegen/i.test(x.beschreibung))?.beschreibung).toMatch(/^Teppichboden verlegen/)
  })

  // Der naheliegende Weg wäre gewesen, „im Fischgrätmuster" in den Titel zu
  // schreiben und den Matcher machen zu lassen. Gegen den echten Katalog
  // geprüft findet er dann für Vinyl und Teppich das STABPARKETT (68 €) —
  // teurer als der Fehler, den es zu beheben galt. Dieser Test hält fest,
  // warum die Tabelle existiert.
  it('begründet die Tabelle: der Matcher allein greift beim Fischgrät daneben', () => {
    expect(preisFuer('Vinyl-Boden im Fischgrätmuster verlegen — Gästezimmer', 'm²')?.title)
      .toMatch(/stabparkett/i)
  })

  it('jeder Titel in der Tabelle existiert im Katalog — sonst 0,00 € im Angebot', () => {
    const titel = new Set(DEFAULT_PRICES.map(p => p.title))
    for (const [muster, jeBelag] of Object.entries(MUSTER_KATALOG)) {
      for (const [belag, eintrag] of Object.entries(jeBelag)) {
        for (const t of [eintrag.ersatzTitel, eintrag.aufpreisTitel].filter(Boolean)) {
          expect(titel.has(t as string), `${muster}/${belag}: „${t}" fehlt im Katalog`).toBe(true)
        }
      }
    }
  })
})

// ── Korrektur am selben Tag ───────────────────────────────────────────────
//
// Die Diagonalverlegung war als Rückfrage an den Prüfmeister gegangen, mit der
// Begründung, der Katalog benenne sie „nur mittelbar". Das war falsch
// nachgesehen — gesucht wurde nach „fischgrät", nicht nach „diagonal". Für
// jeden Belag steht ein eigener Diagonal-Aufpreis im Katalog. Diese Tests
// halten fest, dass die Frage beantwortet ist und nicht wieder aufgemacht wird.
describe('Diagonalverlegung — dieselbe Regel, eigene Katalogzeile', () => {
  const faelle: Array<[string, string, number]> = [
    ['Vinylboden', 'Aufpreis Diagonalverlegung Vinyl', 8],
    ['Laminat', 'Aufpreis Diagonalverlegung Laminat', 8],
    ['Eichenparkett', 'Aufpreis Diagonalverlegung', 10],
  ]

  for (const [belag, katalogTitel, preis] of faelle) {
    it(`${belag}: Aufpreis „${katalogTitel}" zu ${preis},00 €/m²`, () => {
      const p = raum(belag, 'diagonal')
      const aufpreis = p.find(x => /aufpreis diagonal/i.test(x.beschreibung))
      const verlegen = p.find(x => /verlegen/i.test(x.beschreibung) && !/aufpreis/i.test(x.beschreibung))
      expect(aufpreis?.beschreibung).toMatch(new RegExp(`^${katalogTitel}`))
      expect(aufpreis?.menge).toBe(verlegen?.menge)
      expect(preisFuer(aufpreis!.beschreibung, 'm²')?.unit_price).toBe(preis)
    })
  }

  // „Aufpreis Diagonalverlegung" (Parkett) und „Aufpreis Diagonalverlegung
  // Boden" (Fliesen) liegen im Katalog nah beieinander — der Matcher darf sie
  // nicht verwechseln, sonst zahlt der Parkettleger den Fliesenaufpreis.
  it('der Parkett-Aufpreis trifft nicht die Fliesenzeile', () => {
    const t = preisFuer('Aufpreis Diagonalverlegung — Wohnzimmer', 'm²')
    expect(t?.category).toMatch(/parkett/i)
    expect(t?.title).not.toMatch(/boden|wand/i)
  })

  it('Beläge ohne Diagonal-Eintrag bekommen keine erfundene Position', () => {
    expect(raum('Teppichboden', 'diagonal').some(x => /aufpreis/i.test(x.beschreibung))).toBe(false)
  })

  it('gerade Verlegung bekommt weiterhin keinen Aufpreis', () => {
    expect(raum('Vinylboden', null).some(x => /aufpreis/i.test(x.beschreibung))).toBe(false)
  })

  it('Fischgrät und Diagonale schließen sich aus — nie beide Aufpreise', () => {
    for (const richtung of ['fischgrät', 'diagonal']) {
      const p = raum('Eichenparkett', richtung)
      expect(p.filter(x => /aufpreis/i.test(x.beschreibung))).toHaveLength(1)
    }
  })
})

// ── PM-021, Rechenweg ─────────────────────────────────────────────────────
describe('PM-021 — die Klammer listet nur, was auch abgezogen wurde', () => {
  it('die übermessene Zimmertür steht nicht mehr in der Klammer', () => {
    // Zimmertür 0,90 × 2,10 = 1,89 m² (übermessen) · Terrassentür 2,00 × 2,10
    // = 4,20 m² (abgezogen). Vorher stand in der Klammer beides.
    expect(abgezogeneOeffnungen(
      [{ breite: 0.9, hoehe: 2.1, anzahl: 1 }, { breite: 2, hoehe: 2.1, anzahl: 1 }], 0.9, 2.1,
    )).toEqual(['2×2.1'])
  })

  it('sind alle Öffnungen übermessen, bleibt die Klammer leer', () => {
    expect(abgezogeneOeffnungen([{ breite: 0.9, hoehe: 2.1, anzahl: 3 }], 0.9, 2.1)).toEqual([])
  })

  it('Ende zu Ende: Zahl und Klammer widersprechen sich nicht mehr', () => {
    const positionen = malerEngine({
      transkript: 'Wohnzimmer, Umfang 22 Meter, Höhe 2,60. Wände zweimal streichen. '
        + 'Zwei Fenster und eine Zimmertür, dazu eine Terrassentür zwei Meter breit.',
      raeume: [{
        name: 'Wohnzimmer', umfang: 22, hoehe: 2.6,
        fenster: [{ breite: 1.2, hoehe: 1.4, anzahl: 2 }],
        tueren: [{ breite: 0.9, hoehe: 2.1, anzahl: 1 }, { breite: 2, hoehe: 2.1, anzahl: 1 }],
        arbeiten: ['waende_streichen'],
      }],
    } as never).positionen

    const wand = positionen.find(p => /wandflächen streichen/i.test(p.beschreibung))
    const weg = wand?.berechnungsweg ?? ''
    expect(weg).toMatch(/Türen 4\.2 m²/)
    expect(weg).toContain('[2×2.1]')
    expect(weg).not.toContain('0.9×2.1')
  })
})
