import { describe, it, expect } from 'vitest'
import { DEFAULT_PRICES } from '../default-prices'
import { findePreisposition } from '../preis-matcher'
import { wendeProzentZuschlaegeAn, aktualisiereProzentZuschlaege, istObjektbezogenerZuschlag } from '../zuschlag-basis'

// CoS-043 / VOB-010 / LR-09 — die 14 Zuschlagspositionen.
//
// Der Katalog war schon am 01.09. umgestellt (Einheit „%", Prozentsatz im
// Preis) und ist durch `katalog-hygiene` gegen Rückfall gesichert. Was NIRGENDS
// geprüft war: ob aus einem dieser 14 Titel im fertigen Angebot auch wirklich
// Geld wird. Genau daran ist der Zuschlag vorher gescheitert — nicht am
// Katalogeintrag, sondern daran, dass der Preis-Matcher auf exakter
// Einheiten-Übereinstimmung besteht und ein Zuschlag deshalb mit 0,00 € im
// Angebot stand.

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))

/** Die 14 aus dem Legal-Befund — über zehn Gewerke. */
const DIE_VIERZEHN = DEFAULT_PRICES.filter(
  p => p.unit === '%' && /[0-9]+%\)/.test(p.title) && p.zuschlag_typ === 'prozent',
)

describe('CoS-043 — der Katalog ist vollständig und stimmig', () => {
  it('es sind die 14 Einträge aus dem Befund', () => {
    expect(DIE_VIERZEHN).toHaveLength(14)
  })

  it('jeder trägt den Prozentsatz aus dem Titel als Preis', () => {
    for (const p of DIE_VIERZEHN) {
      const ausTitel = Number(/([0-9]+)%\)/.exec(p.title)![1])
      expect(p.unit_price, p.title).toBe(ausTitel)
    }
  })
})

describe('CoS-043 — jeder der 14 findet seinen Katalogpreis', () => {
  // Ohne Treffer bleibt der Zuschlag bei 0,00 € stehen („Preis fehlt") — das
  // war der ursprüngliche Fehler bei den fünf Maler-Zuschlägen.
  it.each(DIE_VIERZEHN.map(p => [p.title, p.unit, p.unit_price] as const))(
    '%s',
    (titel, einheit, preis) => {
      const treffer = findePreisposition(titel, einheit, KATALOG)
      expect(treffer, titel).not.toBeNull()
      expect(treffer!.position.unit).toBe('%')
      expect(treffer!.position.unit_price).toBe(preis)
      expect(treffer!.position.title).toBe(titel)
    },
  )
})

describe('CoS-043 — der Prozentsatz im Titel unterscheidet gleichnamige Einträge', () => {
  // Sieben Einträge heißen wortgleich „Zuschlag Wochenend- / Feiertagsarbeit"
  // und unterscheiden sich nur im Satz: sechsmal 25 %, beim Elektriker 50 %.
  // Ohne diese Unterscheidung bekam der Elektriker 25 % statt 50 % — die
  // Hälfte, still, zulasten des Betriebs.
  it('der Elektro-Zuschlag bekommt 50 %, nicht die 25 % der anderen sechs', () => {
    const treffer = findePreisposition('Zuschlag Wochenend- / Feiertagsarbeit (50%)', '%', KATALOG)
    expect(treffer!.position.unit_price).toBe(50)
    expect(treffer!.position.category).toContain('Elektro')
  })

  it('und umgekehrt bekommt der 25-%-Zuschlag keinen 50-%-Preis', () => {
    const treffer = findePreisposition('Zuschlag Wochenend- / Feiertagsarbeit (25%)', '%', KATALOG)
    expect(treffer!.position.unit_price).toBe(25)
  })

  it('ohne Prozentsatz im gesuchten Titel bleibt alles wie bisher', () => {
    const treffer = findePreisposition('Erschwerniszuschlag Raumhöhe > 3m', '%', KATALOG)
    expect(treffer!.position.title).toBe('Erschwerniszuschlag Raumhöhe > 3m')
  })

  it('gibt es keinen Kandidaten mit genau diesem Satz, wird normal gesucht', () => {
    // 37 % kommt im Katalog nicht vor — dann darf die Regel nicht alles sperren.
    const treffer = findePreisposition('Zuschlag Denkmalschutz / besondere Sorgfalt (37%)', '%', KATALOG)
    expect(treffer).not.toBeNull()
  })
})

describe('CoS-043 — aus dem Prozentsatz wird echtes Geld', () => {
  function angebot() {
    return [
      { title: 'Wandflächen streichen 2x — Wohnzimmer', quantity: 40, unit: 'm²', unit_price: 9.5 },
      { title: 'Deckenfläche streichen 1x — Wohnzimmer', quantity: 20, unit: 'm²', unit_price: 8 },
      { title: 'Zuschlag Wochenend- / Feiertagsarbeit (25%)', quantity: 1, unit: '%', unit_price: 25 },
    ]
  }

  it('25 % auf 540,00 € ergeben 135,00 € — nicht 25,00 €', () => {
    const items = angebot()
    wendeProzentZuschlaegeAn(items, () => true)
    const zuschlag = items[2]
    // Basis: 40 × 9,50 = 380,00 + 20 × 8,00 = 160,00 → 540,00 €
    expect(zuschlag.quantity).toBe(25)
    expect(zuschlag.unit_price).toBe(5.4) // Euro je Prozentpunkt
    expect(Math.round(zuschlag.quantity * zuschlag.unit_price * 100) / 100).toBe(135)
  })

  it('der Rechenweg sagt, worauf gerechnet wurde', () => {
    const items = angebot() as Array<{ title: string; quantity: number; unit: string; unit_price: number; berechnungsweg?: string | null }>
    wendeProzentZuschlaegeAn(items, () => true)
    expect(items[2].berechnungsweg).toContain('25 % auf 540,00 €')
    expect(items[2].berechnungsweg).toContain('Leistungen dieses Angebots')
  })

  it('der Notdienst-Zuschlag rechnet auf das GANZE Angebot, nicht auf einen Raum', () => {
    // Der Punkt, den CoS-043 ausdrücklich geklärt haben wollte: Diese 14 Titel
    // tragen kein „— Raum"-Suffix, also greift die Angebots-Grundlage. Für
    // Notdienst und Wochenendarbeit ist das fachlich richtig — der Zuschlag
    // hängt daran, WANN gearbeitet wird, nicht in welchem Zimmer.
    const items = [
      { title: 'Wandflächen streichen 2x — Wohnzimmer', quantity: 40, unit: 'm²', unit_price: 9.5 },
      { title: 'Wandflächen streichen 2x — Küche', quantity: 20, unit: 'm²', unit_price: 9.5 },
      { title: 'Zuschlag Notdienst (Wochenende / Nacht / Feiertag, 100%)', quantity: 1, unit: '%', unit_price: 100 },
    ]
    wendeProzentZuschlaegeAn(items, () => true)
    // 380,00 + 190,00 = 570,00 € → 100 % = 570,00 €
    expect(Math.round(items[2].quantity * items[2].unit_price * 100) / 100).toBe(570)
  })

  it('zwei Zuschläge stehen beide auf derselben Grundlage — keiner auf dem anderen', () => {
    const items = [
      { title: 'Wandflächen streichen 2x — Wohnzimmer', quantity: 40, unit: 'm²', unit_price: 9.5 },
      { title: 'Zuschlag Wochenend- / Feiertagsarbeit (25%)', quantity: 1, unit: '%', unit_price: 25 },
      { title: 'Zuschlag Denkmalschutz / besondere Sorgfalt (30%)', quantity: 1, unit: '%', unit_price: 30 },
    ]
    wendeProzentZuschlaegeAn(items, () => true)
    expect(items[1].unit_price).toBe(3.8) // 380,00 / 100
    expect(items[2].unit_price).toBe(3.8) // dieselbe Grundlage, nicht 380 + 95
  })

  it('ohne Katalogtreffer wird nichts geschätzt — die Position bleibt sichtbar bei 0,00 €', () => {
    const items = angebot()
    wendeProzentZuschlaegeAn(items, index => index !== 2)
    expect(items[2].quantity).toBe(1)
    expect(items[2].unit_price).toBe(25)
  })

  it('ändert der Handwerker die Grundlage im Editor, folgt der Zuschlag', () => {
    const items = [
      { title: 'Wandflächen streichen 2x — Wohnzimmer', quantity: 40, unit: 'm²', unit_price: 9.5, total_price: 380 },
      { title: 'Zuschlag Wochenend- / Feiertagsarbeit (25%)', quantity: 25, unit: '%', unit_price: 3.8, total_price: 95 },
    ]
    items[0].quantity = 50 // Handwerker korrigiert das Aufmaß: 475,00 €
    const neu = aktualisiereProzentZuschlaege(items)
    expect(neu[1].unit_price).toBe(4.75)
    expect(neu[1].total_price).toBe(118.75)
  })

  it('einen Zuschlag, den der Handwerker selbst angefasst hat, rechnet niemand um', () => {
    const items = [
      { title: 'Wandflächen streichen 2x — Wohnzimmer', quantity: 50, unit: 'm²', unit_price: 9.5, total_price: 475 },
      { title: 'Zuschlag Wochenend- / Feiertagsarbeit (25%)', quantity: 25, unit: '%', unit_price: 3.8, total_price: 95 },
    ]
    const neu = aktualisiereProzentZuschlaege(items, item => item.title.startsWith('Zuschlag'))
    expect(neu[1].unit_price).toBe(3.8)
  })
})

// ── Sandys Entscheidung vom 04.09.2026: neun zeitbezogen, fünf objektbezogen
//
// „exotische Holzart auf Malerarbeiten will ich nicht im Produkt haben."
describe('CoS-043 — zeitbezogen rechnet aufs Angebot, objektbezogen aufs Gewerk', () => {
  const gemischt = () => [
    { title: 'Wandflächen streichen 2x — Flur', quantity: 40, unit: 'm²', unit_price: 9.5, kategorie: 'Maler – Wandflächen' },
    { title: 'Holztreppe fertigen', quantity: 1, unit: 'Stück', unit_price: 9500, kategorie: 'Schreiner – Treppen' },
  ]

  it('exotische Holzart (40 %) rechnet NUR auf die Schreinerleistung', () => {
    const items = [...gemischt(), {
      title: 'Aufpreis exotische Holzart (Teak, Wenge, Nussbaum) ggü. Eiche (40%)',
      quantity: 1, unit: '%', unit_price: 40, kategorie: 'Schreiner – Erschwernisse & Zuschläge',
    }]
    wendeProzentZuschlaegeAn(items, () => true)
    // 40 % auf 9.500,00 € = 3.800,00 € — NICHT auf 9.880,00 € (mit Malerarbeit)
    expect(items[2].unit_price).toBe(95)
    expect(Math.round(items[2].quantity * items[2].unit_price * 100) / 100).toBe(3800)
  })

  it('der Wochenendzuschlag rechnet weiterhin auf alles', () => {
    const items = [...gemischt(), {
      title: 'Zuschlag Wochenend- / Feiertagsarbeit (25%)',
      quantity: 1, unit: '%', unit_price: 25, kategorie: 'Maler – Erschwernisse & Zuschläge',
    }]
    wendeProzentZuschlaegeAn(items, () => true)
    // 380,00 + 9.500,00 = 9.880,00 € → 25 % = 2.470,00 €
    expect(Math.round(items[2].quantity * items[2].unit_price * 100) / 100).toBe(2470)
  })

  it('Denkmalschutz Dach (35 %) greift nicht auf Putzarbeiten über', () => {
    const items = [
      { title: 'Putz auftragen — Fassade', quantity: 100, unit: 'm²', unit_price: 30, kategorie: 'Putz – Fassade' },
      { title: 'Dacheindeckung erneuern', quantity: 80, unit: 'm²', unit_price: 60, kategorie: 'Dach – Eindeckung' },
      { title: 'Zuschlag Denkmalschutz / historische Eindeckung (35%)', quantity: 1, unit: '%', unit_price: 35, kategorie: 'Dach – Erschwernisse & Zuschläge' },
    ]
    wendeProzentZuschlaegeAn(items, () => true)
    // 35 % auf 4.800,00 € (nur Dach), nicht auf 7.800,00 €
    expect(Math.round(items[2].quantity * items[2].unit_price * 100) / 100).toBe(1680)
  })

  it('der Rechenweg nennt das Gewerk, auf das gerechnet wurde', () => {
    const items = [...gemischt(), {
      title: 'Zuschlag Sondermaße / Sonderform (20%)',
      quantity: 1, unit: '%', unit_price: 20, kategorie: 'Schreiner – Erschwernisse & Zuschläge',
    }] as Array<{ title: string; quantity: number; unit: string; unit_price: number; kategorie?: string | null; berechnungsweg?: string | null }>
    wendeProzentZuschlaegeAn(items, () => true)
    expect(items[2].berechnungsweg).toContain('(Leistungen Schreiner)')
  })

  it('ohne bekannte Kategorie bleibt es beim bisherigen Verhalten — nichts wird geraten', () => {
    const items = [...gemischt(), {
      title: 'Zuschlag Denkmalschutz / besondere Sorgfalt (30%)',
      quantity: 1, unit: '%', unit_price: 30, kategorie: null,
    }]
    wendeProzentZuschlaegeAn(items, () => true)
    expect(Math.round(items[2].quantity * items[2].unit_price * 100) / 100).toBe(2964) // 30 % auf 9.880,00 €
  })

  it('die Aufteilung im Katalog stimmt: neun zeitbezogen, fünf objektbezogen', () => {
    const zeit = DIE_VIERZEHN.filter(p => !istObjektbezogenerZuschlag(p.title))
    const objekt = DIE_VIERZEHN.filter(p => istObjektbezogenerZuschlag(p.title))
    expect(zeit).toHaveLength(9)
    expect(objekt).toHaveLength(5)
    // Und der Beschreibungstext passt jeweils zur Rechnung.
    for (const p of zeit) expect(p.erschwerniszuschlag_fuer, p.title).toBe('Leistungen dieses Angebots')
    for (const p of objekt) expect(p.erschwerniszuschlag_fuer, p.title).toBe('Leistungen dieses Gewerks')
  })
})
