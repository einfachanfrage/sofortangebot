import { describe, it, expect } from 'vitest'
import { berechneSockelleistenLaenge, sockelAbzug, VOB_SOCKEL_ABZUG_AB_M } from '../gewerke/sockelleisten'
import { malerEngine } from '../gewerke/maler'
import { bodenEngine } from '../gewerke/boden'
import { VOB_UEBERMESSUNG_SCHWELLE_M2, VOB_UEBERMESSUNG_SCHWELLE_BODEN_M2 } from '../gewerke/vob-uebermessung'

// CoS-042 — vier Punkte aus Head of Legals Auswertung des gekauften
// VOB-Normtexts (VOB Gesamtausgabe 2019). Diese Datei hält fest, was der
// Normtext entschieden hat, damit es niemand später „nach Gefühl" zurückdreht.

describe('VOB-012 — Unterbrechungen bis 1 m werden nicht abgezogen', () => {
  // DIN 18363 und DIN 18365, jeweils Abschnitt 5.3.2. Eine Standard-Zimmertür
  // ist 0,90 m breit und fällt damit darunter. Vorher zog das Tool jede
  // Türbreite voll ab — zulasten des Betriebs, der die Leiste ja verlegt.
  it('die Schwelle liegt bei genau 1,00 m', () => {
    expect(VOB_SOCKEL_ABZUG_AB_M).toBe(1.0)
  })

  it('Standardtür 0,90 m: kein Abzug', () => {
    expect(berechneSockelleistenLaenge(22, [{ breite: 0.9 }])).toBe(22)
    expect(sockelAbzug([{ breite: 0.9 }])).toBe(0)
  })

  it('genau 1,00 m: noch kein Abzug (bis 1 m heißt einschließlich)', () => {
    expect(berechneSockelleistenLaenge(22, [{ breite: 1.0 }])).toBe(22)
  })

  it('breite Terrassentür 2,00 m: wird abgezogen', () => {
    expect(berechneSockelleistenLaenge(22, [{ breite: 2 }])).toBe(20)
  })

  it('gemischt — nur die breite Öffnung zählt', () => {
    // Der reale PM-021-Fall: eine Normaltür und eine Breitterrassentür.
    expect(berechneSockelleistenLaenge(22, [{ breite: 0.9 }, { breite: 2 }])).toBe(20)
  })

  it('die Stückzahl gilt weiterhin — aber nur über der Schwelle', () => {
    expect(berechneSockelleistenLaenge(30, [{ anzahl: 3, breite: 1.2 }])).toBe(26.4)
    expect(berechneSockelleistenLaenge(30, [{ anzahl: 3, breite: 0.9 }])).toBe(30)
  })

  it('ohne Breitenangabe gilt das Standardmaß 0,90 m — also kein Abzug', () => {
    expect(berechneSockelleistenLaenge(22, [{ anzahl: 2 }])).toBe(22)
  })
})

describe('VOB-008 — die Malerschwelle gilt nicht für den Boden', () => {
  // DIN 18365:2019-09, 5.3.1: Für Bodenbelagarbeiten liegt die Schwelle bei
  // 0,1 m², nicht bei 2,5 m² wie beim Maler. Nachgesehen: Die Boden-Engine
  // zieht überhaupt keine Öffnungen von der Bodenfläche ab — sie kann die
  // falsche Schwelle also gar nicht erben. Dieser Test hält genau das fest.
  it('die beiden Schwellen stehen getrennt und unterscheiden sich um Faktor 25', () => {
    expect(VOB_UEBERMESSUNG_SCHWELLE_M2).toBe(2.5)
    expect(VOB_UEBERMESSUNG_SCHWELLE_BODEN_M2).toBe(0.1)
    expect(VOB_UEBERMESSUNG_SCHWELLE_M2 / VOB_UEBERMESSUNG_SCHWELLE_BODEN_M2).toBe(25)
  })

  it('die Bodenfläche wird durch Fenster und Türen nicht kleiner', () => {
    const ohneOeffnungen = bodenEngine({
      transkript: 'Wohnzimmer 5 mal 4, Laminat verlegen.',
      raeume: [{ name: 'Wohnzimmer', laenge: 5, breite: 4, belag: 'laminat', arbeiten: ['laminat verlegen'], fenster: [], tueren: [] }],
    })
    const mitOeffnungen = bodenEngine({
      transkript: 'Wohnzimmer 5 mal 4, Laminat verlegen.',
      raeume: [{
        name: 'Wohnzimmer', laenge: 5, breite: 4, belag: 'laminat', arbeiten: ['laminat verlegen'],
        fenster: [{ anzahl: 2, breite: 1.2, hoehe: 1.4 }],
        tueren: [{ anzahl: 2, breite: 0.9, hoehe: 2.1 }],
      }],
    })
    const menge = (e: { positionen: Array<{ beschreibung: string; menge: number }> }) =>
      e.positionen.find(p => /verlegen/i.test(p.beschreibung))?.menge
    expect(menge(ohneOeffnungen)).toBe(21) // 20 m² + 5 % Verschnitt
    expect(menge(mitOeffnungen)).toBe(menge(ohneOeffnungen))
  })
})

describe('CoS-042 Punkt 4 — Leibungen nur, wenn sie beschichtet werden', () => {
  // DIN 18363:2019-09, 5.2.3 spricht von „beschichteten Rückflächen … sowie
  // Leibungen". Eine Leibung, die gar nicht gestrichen wird, darf keine
  // „… streichen"-Position erzeugen.
  const leibung = { anzahl: 2, breite: 1.2, hoehe: 1.0, tiefe: 0.25, typ: 'fenster' }
  const lauf = (transkript: string) =>
    malerEngine({ gewerk: 'maler', raeume: [], waende: [], leibungen: [leibung], transkript })

  it('normaler Fall: Leibungen genannt, Anstrich läuft → Position bleibt', () => {
    const e = lauf('Wände streichen, die Fensterleibungen mit streichen.')
    expect(e.positionen.some(p => /leibungen streichen/i.test(p.beschreibung))).toBe(true)
    expect(e.warnungen.some(w => /Leibungen/i.test(w))).toBe(false)
  })

  it('ohne jede Aussage zur Leibung bleibt es beim Anstrich — im Zweifel dafür', () => {
    const e = lauf('Wände streichen, zwei Fenster.')
    expect(e.positionen.some(p => /leibungen streichen/i.test(p.beschreibung))).toBe(true)
  })

  it('ausdrücklich nicht gestrichen: keine Position, aber eine Warnung', () => {
    const e = lauf('Wände streichen. Die Leibungen werden nicht gestrichen.')
    expect(e.positionen.some(p => /leibungen streichen/i.test(p.beschreibung))).toBe(false)
    expect(e.warnungen.some(w => /Leibungen wurden genannt/i.test(w))).toBe(true)
  })

  it('anderes Gewerk an der Leibung: gedämmt, verputzt, verkleidet', () => {
    for (const satz of [
      'Die Leibungen werden nur gedämmt.',
      'Die Laibungen werden verputzt, mehr nicht.',
      'Die Leibungen bleiben roh.',
    ]) {
      const e = lauf(`Wände streichen. ${satz}`)
      expect(e.positionen.some(p => /leibungen streichen/i.test(p.beschreibung)), satz).toBe(false)
    }
  })

  it('gemischt: eine Absage, aber woanders ausdrücklich streichen → Position bleibt', () => {
    const e = lauf('Die Leibungen im Bad werden nur verputzt. Im Wohnzimmer die Leibungen mitstreichen.')
    expect(e.positionen.some(p => /leibungen streichen/i.test(p.beschreibung))).toBe(true)
  })
})
