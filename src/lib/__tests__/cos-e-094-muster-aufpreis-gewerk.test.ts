// CoS-E-094-Beifang — der Muster-Aufpreis für Parkett auf dem Kundenpapier
// (Head of Product Engineering, 23.09.2026)
//
// ── Woher der Fund kommt ──────────────────────────────────────────────────
//
// Der Auftrag CoS-E-094 (PM-140) beginnt mit einer Messung, nicht mit einem
// Bau: ob der Diagonal-Aufpreis für **Fliesen** hinter die Gewerke-Sperre
// gehört. Er gehört dorthin — beide Zeilen, nicht nur die Wandzeile; die
// Messung steht in `docs/chief-of-staff-engineering-todos.md`.
//
// Beim Messen ist derselbe Fehler im **freigegebenen** Gewerk aufgefallen,
// und dort ist er kein Sperr-Fall, sondern Geld:
//
//   `bodenEngine` schreibt den Muster-Aufpreis als eigene Position; ihr Titel
//   ist der wörtliche Katalogeintrag aus `MUSTER_KATALOG`. Bei Vinyl und
//   Laminat steht der Belag im Titel (`Aufpreis Diagonalverlegung Laminat`)
//   und `gewerkFuerPosition` erkennt Bodenarbeit. Bei **Parkett** heißen die
//   zwei Einträge nur `Aufpreis Diagonalverlegung` und
//   `Aufpreis Fischgrät-Verlegemuster`. Darin steht kein Belag, kein
//   Maler-Wort, kein Fliesen-Wort — die Position fiel durch alle Regeln und
//   landete beim **Hauptgewerk**.
//
// Im reinen Parkettauftrag ist das richtig. Im gemischten Angebot
// (Parkett diagonal + Wände streichen), dessen Hauptgewerk `maler` ist,
// filtert der Endpunkt danach auf Kategorien, die mit „Maler" beginnen —
// dort gibt es keinen Muster-Aufpreis. Kandidatenliste leer, kein Treffer,
// `unit_price ?? 0`: 10,00 € bzw. 14,00 €/m² werden stumm zu 0,00 €.
//
// Dieselbe Kette wie PM-117, dieselbe Lehre wie „Boden schützen"
// (PM-024/PM-026) — nur in die andere Richtung.
//
// ── Was diese Datei fährt ─────────────────────────────────────────────────
//
// Denselben Weg wie der Endpunkt `src/app/api/angebot-generieren/route.ts`:
//
//   Titel → gewerkFuerPosition → Gewerke-Filter → findePreisposition
//   → unit_price ?? 0
//
// und zwar gegen den Katalog eines Betriebs, der sich beim Onboarding für
// **beide** freigegebenen Gewerke entschieden hat. Mehr ist dort nicht
// wählbar: `AKTIVE_GEWERKE` führt genau `maler` und `boden_parkett`.
import { describe, expect, it } from 'vitest'
import { gewerkFuerPosition } from '../positions-gewerk'
import { preisKategoriePasstZuGewerk, standardpreiseFuerGewerke } from '../default-price-selection'
import { findePreisposition } from '../preis-matcher'
import { MUSTER_KATALOG } from '../mengen/gewerke/boden'

/** Der Katalog, den ein heute angelegter Betrieb bekommt. */
const KATALOG = standardpreiseFuerGewerke(['maler', 'boden_parkett']).map((p, i) => ({
  id: String(i), title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))

function preisweg(beschreibung: string, einheit: string, hauptgewerk: string) {
  const gewerk = gewerkFuerPosition(beschreibung, hauptgewerk)
  const kandidaten = KATALOG.filter(p => preisKategoriePasstZuGewerk(p.category, gewerk))
  const treffer = findePreisposition(beschreibung, einheit, kandidaten)
  return {
    gewerk,
    kandidaten: kandidaten.length,
    preis: treffer?.position.unit_price ?? 0,
    kategorie: treffer?.position.category ?? null,
    katalogTitel: treffer?.position.title ?? null,
  }
}

describe('CoS-E-094-A · der Muster-Aufpreis für Parkett überlebt das gemischte Angebot', () => {
  it('Diagonalverlegung Parkett trägt im Malerauftrag ihre 10,00 €/m²', () => {
    const r = preisweg('Aufpreis Diagonalverlegung — Wohnzimmer', 'm²', 'maler')
    expect(r.gewerk).toBe('boden_parkett')
    expect(r.preis).toBe(10)
    expect(r.kategorie).toBe('Boden – Parkett')
    expect(r.katalogTitel).toBe('Aufpreis Diagonalverlegung')
    // Und ausdrücklich nicht mehr die alte Antwort.
    expect(r.preis).not.toBe(0)
  })

  it('Fischgrät-Verlegemuster Parkett trägt im Malerauftrag seine 14,00 €/m²', () => {
    const r = preisweg('Aufpreis Fischgrät-Verlegemuster — Wohnzimmer', 'm²', 'maler')
    expect(r.gewerk).toBe('boden_parkett')
    expect(r.preis).toBe(14)
    expect(r.kategorie).toBe('Boden – Parkett')
    expect(r.preis).not.toBe(0)
  })

  it('der reine Bodenauftrag antwortet unverändert', () => {
    expect(preisweg('Aufpreis Diagonalverlegung — Wohnzimmer', 'm²', 'boden_parkett').preis).toBe(10)
    expect(preisweg('Aufpreis Fischgrät-Verlegemuster — Wohnzimmer', 'm²', 'boden_parkett').preis).toBe(14)
  })
})

describe('CoS-E-094-B · die Gegenproben — die Regel greift nur, wo der Belag fehlt', () => {
  it('Vinyl und Laminat gingen schon vorher richtig und gehen es weiter', () => {
    expect(preisweg('Aufpreis Diagonalverlegung Laminat — Wohnzimmer', 'm²', 'maler').preis).toBe(8)
    expect(preisweg('Aufpreis Diagonalverlegung Vinyl — Wohnzimmer', 'm²', 'maler').preis).toBe(8)
  })

  it('die Fliesen-Aufpreise bleiben Fliesenarbeit — sie nennen ihr Bauteil', () => {
    expect(gewerkFuerPosition('Aufpreis Diagonalverlegung Boden — Bad', 'fliesen')).toBe('fliesen')
    expect(gewerkFuerPosition('Aufpreis Fischgrät / Muster / Mosaik — Bad', 'fliesen')).toBe('fliesen')
    // Die Wandzeile ging schon vor dieser Regel zum Maler (PM-117-Muster) und
    // geht es weiter — sie ist der Sperr-Fall aus CoS-E-094, kein Bauauftrag.
    expect(gewerkFuerPosition('Aufpreis Diagonalverlegung Wand — Bad', 'fliesen')).toBe('maler')
  })

  it('jeder Aufpreistitel aus MUSTER_KATALOG findet seinen Katalogeintrag', () => {
    for (const belaege of Object.values(MUSTER_KATALOG)) {
      for (const eintrag of Object.values(belaege)) {
        if (!eintrag.aufpreisTitel) continue
        const r = preisweg(`${eintrag.aufpreisTitel} — Wohnzimmer`, 'm²', 'maler')
        expect(r.katalogTitel, `${eintrag.aufpreisTitel} im gemischten Angebot`).toBe(eintrag.aufpreisTitel)
        expect(r.preis, `${eintrag.aufpreisTitel} im gemischten Angebot`).toBeGreaterThan(0)
      }
    }
  })
})

describe('CoS-E-094-C · gemessener Stand: der Betriebskatalog kennt kein Fliesen', () => {
  // Das ist die Messung, die aus PM-140 einen Sperr-Fall macht, und sie
  // gehört hierher, damit sie nicht nur in einer Doku-Datei behauptet wird:
  // Ein heute angelegter Betrieb kann beim Onboarding nur Maler und
  // Bodenbeläge wählen. Damit steht in seinem Katalog keine einzige
  // Fliesen-Kategorie — jede Fliesenzeile ist 0,00 €, nicht nur der fehlende
  // Diagonal-Aufpreis. Ändert sich das (drittes Gewerk freigegeben), fällt
  // diese Zusicherung, und CoS-E-094 ist neu zu bewerten.
  it('keine Fliesen-Kategorie im Katalog eines heute angelegten Betriebs', () => {
    expect(KATALOG.filter(p => /^Fliesen/i.test(p.category))).toHaveLength(0)
    expect(KATALOG.length).toBeGreaterThan(0)
  })

  it('und deshalb trägt auch die Bodenfliesen-Zeile 0,00 €', () => {
    const r = preisweg('Bodenfliesen verlegen — Bad', 'm²', 'fliesen')
    expect(r.gewerk).toBe('fliesen')
    expect(r.preis).toBe(0)
  })
})
