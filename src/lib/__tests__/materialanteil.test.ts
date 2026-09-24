import { describe, it, expect } from 'vitest'
import {
  materialWort,
  materialAnteil,
  teileMaterialAb,
  halbsatz,
  kundensatz,
  HOECHSTANTEIL_INNEN,
  HOECHSTANTEIL_BELAG,
  BAND_INNEN,
  ENTSCHIEDENE_GEWERKE,
} from '../materialanteil'
import { DEFAULT_PRICES } from '../default-prices'

// CoS-E-053, Schritt 3 aus `docs/preisliste-konzept.md` (Fassung 3).
//
// Der Prüfmeister hat verlangt, dass dieser Test VOR dem Knopf geschrieben
// wird: „Material herausziehen und nachrechnen, ob die Summe um genau den
// Materialanteil fällt — nicht um null und nicht um den ganzen Preis."

const istAussen = (p: { category: string; title: string }) =>
  /fassade|außen|aussen/i.test(`${p.category} ${p.title}`)

describe('🔴 Die Summe fällt um genau den Materialanteil', () => {
  it('Manfreds Beispiel: aus 11,50 für Wand 2x werden Arbeit und Farbe', () => {
    const teile = teileMaterialAb({ title: 'Wand streichen 2x Anstrich', unit_price: 11.5 })
    expect(teile).not.toBeNull()

    // Hart, ohne Toleranz: Die Summe stimmt auf den Cent. Das ist die
    // Zusicherung, auf die es ankommt — sie verhindert das doppelt
    // berechnete Material.
    expect(teile!.arbeit + teile!.material).toBe(11.5)
    expect(teile!.wort).toBe('Farbe')

    // Weich: Manfred sagt „nicht mehr 11,50, sondern 8,50 plus Farbe". Die
    // Faustregel (ein Viertel) kommt auf 8,62 + 2,88 — zwölf Cent daneben.
    //
    // Hier stand zuerst `toBeCloseTo(8.5, 1)`, also ±0,05, und der Test wurde
    // in der CI rot. Zu Recht, und der Fehler war die Zusicherung, nicht die
    // Zahl: Eine Regel, die für 140 Katalogzeilen gilt, kann Manfreds eine
    // Zeile nicht auf den Cent treffen — und wenn sie es täte, wäre sie auf
    // ihn hingebogen statt hergeleitet. Zwei verschiedene Schärfen für
    // dieselbe Aussage (unten der Prüfstein mit ±0,50) waren ohnehin ein
    // Fehler; jetzt ist es überall dieselbe.
    expect(Math.abs(teile!.arbeit - 8.5)).toBeLessThanOrEqual(0.5)
    expect(Math.abs(teile!.material - 3.0)).toBeLessThanOrEqual(0.5)
  })

  it('Arbeit plus Material ergibt auf den Cent den Preis — über den ganzen Katalog', () => {
    let geprueft = 0
    for (const p of DEFAULT_PRICES) {
      const teile = teileMaterialAb(p)
      if (!teile) continue
      geprueft++
      expect(
        Math.round((teile.arbeit + teile.material) * 100),
        `${p.title}: ${teile.arbeit} + ${teile.material} ≠ ${p.unit_price}`,
      ).toBe(Math.round(p.unit_price * 100))
      expect(teile.material, `${p.title}: Material größer als Preis`).toBeLessThanOrEqual(p.unit_price)
      expect(teile.arbeit, `${p.title}: negative Arbeitszeile`).toBeGreaterThanOrEqual(0)
    }
    // Gegenprobe: Der Test muss auch wirklich etwas geprüft haben.
    expect(geprueft).toBeGreaterThan(100)
  })

  it('weder null noch der ganze Preis', () => {
    const teile = teileMaterialAb({ title: 'Wand streichen 2x Anstrich', unit_price: 9.5 })!
    expect(teile.material).toBeGreaterThan(0)
    expect(teile.material).toBeLessThan(9.5)
  })
})

describe('Der Prüfstein: unsere Anteile gegen Manfreds eigene Zahlen', () => {
  // Diese Beträge gehören zu MANFREDS Preisniveau (Wand 2x = 11,50), nicht zum
  // Katalog (9,50). Deshalb stehen sie hier als Prüfstein und nicht als
  // hinterlegte Werte — ein absoluter Wert aus einer fremden Preiswelt wäre
  // genau die stille Falschheit, die wir sonst wegräumen.
  it.each([
    ['Wand streichen 2x Anstrich', 11.5, 3.0],
    ['Decke streichen 2x Anstrich', 11.0, 2.5],
    ['Raufaser tapezieren ohne Anstrich', 10.0, 2.5],
  ])('%s zu %s € → rund %s € Material', (titel, preis, soll) => {
    const anteil = materialAnteil({ title: titel as string, unit_price: preis as number })!
    expect(Math.abs(anteil - (soll as number))).toBeLessThanOrEqual(0.5)
  })

  it('die zwei Bänder der Faustregel werden eingehalten', () => {
    for (const p of DEFAULT_PRICES) {
      const teile = teileMaterialAb(p)
      if (!teile) continue
      const grenze = BAND_INNEN.includes(teile.wort) && !istAussen(p)
        ? HOECHSTANTEIL_INNEN
        : HOECHSTANTEIL_BELAG
      expect(teile.material / p.unit_price, `${p.title} (${teile.wort})`)
        .toBeLessThanOrEqual(grenze + 1e-9)
    }
  })
})

describe('Zubehör ist kein Material — dort gibt es keinen Schalter', () => {
  it.each([
    // Manfreds eigene Liste, wörtlich
    'Trittschalldämmung verlegen (PE-Schaum / Filz)',
    'Sockelleiste / Fliesensockel verlegen',
    // dieselbe Familie
    'Entkopplungsmatte verlegen',
    'Teppichunterlage / Dämmunterlage verlegen',
    'Dampfbremse / PE-Folie verlegen (Feuchtigkeitsschutz)',
    'Grundieren — Tiefengrund',
    // reine Vorbereitung
    'Fläche spachteln (Flächenspachtel)',
    'Schleifen von Hand',
    'Abkleben Kanten / Leisten',
    'Möbel rücken / ausräumen',
  ])('%s hat kein Kundenmaterial', titel => {
    expect(materialWort(titel)).toBeNull()
    expect(materialAnteil({ title: titel, unit_price: 10 })).toBeNull()
    expect(teileMaterialAb({ title: titel, unit_price: 10 })).toBeNull()
  })

  it('Rückbau und Reinigung nennen einen Belag und verbrauchen keinen', () => {
    // Wer hier einen Schalter hinsetzt, bietet an, den Belag, den er
    // herausreißt, vom Kunden stellen zu lassen.
    expect(materialWort('Teppichboden entfernen + entsorgen')).toBeNull()
    expect(materialWort('Bodenbelag entfernen + entsorgen (Laminat / Parkett)')).toBeNull()
    expect(materialWort('Parkett / Holzboden reinigen und pflegen')).toBeNull()
    expect(materialWort('Teppichboden saugen (je m², je Reinigung)')).toBeNull()
  })

  it('„streichfertig" ist kein Anstrich', () => {
    expect(materialWort('GK-Fläche spachteln (Q4 – Glätten/Streichfertigkeit)')).toBeNull()
    expect(materialWort('Fläche feinspachteln (Q3, streichfertig)')).toBeNull()
  })

  it('Aufpreis- und Zuschlagszeilen bekommen keinen Schalter', () => {
    expect(materialWort('Sonderfarbe / RAL-Farbe (Aufpreis)')).toBeNull()
    expect(materialWort('Aufpreis Diagonalverlegung Laminat')).toBeNull()
    expect(materialWort('Zuschlag Wochenend- / Feiertagsarbeit (50%)')).toBeNull()
  })
})

describe('Nur die Gewerke, für die die Frage entschieden ist', () => {
  it('kein fremdes Gewerk bekommt einen Materialschalter', () => {
    const fremde = DEFAULT_PRICES
      .filter(p => materialWort(p.title, p.category) !== null)
      .filter(p => !ENTSCHIEDENE_GEWERKE.test(p.category))
      .map(p => `${p.category} :: ${p.title}`)

    // Wird dieser Test rot, hat ein Schalter ein Gewerk erreicht, in dem
    // niemand gefragt wurde, ob Material drin oder getrennt gehört. Der Weg
    // zurück ist, jemanden aus dem Gewerk zu fragen — nicht, die Liste zu
    // erweitern.
    expect(fremde).toEqual([])
  })

  it('die Kategorie grenzt das Gewerk ab, nicht die Sache', () => {
    // Derselbe Titel: im entschiedenen Gewerk mit Schalter, außerhalb ohne.
    expect(materialWort('Naturstein Boden verlegen (bis 60×60cm)', 'Fliesen – Naturstein')).toBe('Fliesen')
    expect(materialWort('Natursteinplatten verlegen (Sandstein / Schiefer)', 'Garten – Pflaster & Wege')).toBeNull()
  })

  it('Maler und Boden sind wirklich abgedeckt', () => {
    const mitSchalter = DEFAULT_PRICES.filter(p => materialWort(p.title, p.category) !== null)
    expect(mitSchalter.filter(p => /^Maler/.test(p.category)).length).toBeGreaterThan(50)
    expect(mitSchalter.filter(p => /^Boden/.test(p.category)).length).toBeGreaterThan(30)
  })
})

describe('Das Material heißt beim Namen', () => {
  it.each([
    ['Wand streichen 2x Anstrich', 'Farbe'],
    ['Türen lackieren — 2× Anstrich', 'Lack'],
    ['Vliestapete tapezieren', 'Tapete'],
    ['Laminat verlegen, schwimmend', 'Belag'],
  ])('%s → %s', (titel, wort) => {
    expect(materialWort(titel)).toBe(wort)
  })

  it('Tapezieren mit Anstrich bleibt Tapete — der Kunde sucht die Tapete aus', () => {
    expect(materialWort('Raufaser tapezieren + überstreichen 2x')).toBe('Tapete')
  })

  it('„ohne Material" kommt nirgends vor', () => {
    for (const p of DEFAULT_PRICES) {
      const satz = halbsatz(p, true)
      if (satz == null) continue
      expect(satz, p.title).not.toBe('ohne Material')
      expect(satz).toMatch(/^ohne (Farbe|Lack|Tapete|Belag|Fliesen)$/)
    }
  })

  it('der Halbsatz steht in beide Richtungen', () => {
    expect(halbsatz('Vliestapete tapezieren', false)).toBe('inkl. Tapete')
    expect(halbsatz('Vliestapete tapezieren', true)).toBe('ohne Tapete')
    expect(halbsatz('Schleifen von Hand', true)).toBeNull()
  })

  it('auf dem Kundenpapier steht kein Fachwort', () => {
    // Manfred: „‚Material bauseits' versteht mein Bauleiter, Frau Krüger nicht."
    expect(kundensatz('Tapete')).toBe('Die Tapete wird vom Kunden gestellt.')
    expect(kundensatz('Fliesen')).toBe('Die Fliesen werden vom Kunden gestellt.')
    expect(kundensatz('Farbe')).not.toMatch(/bauseits/i)
  })
})

describe('Der eigene Wert des Betriebs gewinnt — aber nie über den Preis', () => {
  it('hinterlegter Wert schlägt die Faustregel', () => {
    const teile = teileMaterialAb({
      title: 'Wand streichen 2x Anstrich', unit_price: 11.5, material_anteil: 4.2,
    })!
    expect(teile.material).toBe(4.2)
    expect(teile.arbeit).toBe(7.3)
  })

  it('Material über dem Preis wird gedeckelt, statt eine negative Arbeitszeile zu erzeugen', () => {
    const teile = teileMaterialAb({
      title: 'Wand streichen 2x Anstrich', unit_price: 5, material_anteil: 9,
    })!
    expect(teile.material).toBe(5)
    expect(teile.arbeit).toBe(0)
  })

  it('ein hinterlegter Wert macht aus einer Zubehörzeile keine Materialzeile', () => {
    // NULL heißt „nicht gesetzt", nicht „kein Material" — und umgekehrt macht
    // ein gesetzter Wert aus Trittschall keine Kundenauswahl.
    expect(teileMaterialAb({
      title: 'Trittschalldämmung verlegen (PE-Schaum / Filz)', unit_price: 6, material_anteil: 2,
    })).toBeNull()
  })
})
