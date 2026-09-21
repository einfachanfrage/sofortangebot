import { describe, it, expect } from 'vitest'
import {
  zuschlagBerechnungsweg,
  zuschlagsBezugAus,
  wendeProzentZuschlaegeAn,
  ZUSCHLAG_EINHEIT,
  type ZuschlagsItem,
} from '../zuschlag-basis'
import { kundenRechenweg, kundenRechenwegZeile } from '../rechenweg-kundentext'

// ── DC-137 (aus PD-018 §3, Prüfmeister, 16.09.2026) ───────────────────────
//
// „15 % von der Wandfläche? Von den Anstricharbeiten? Von der Angebotssumme?
// Auf dem Kundenpapier muss das dastehen."
//
// Die Grundlage steht seit CoS-E-083 §3 im Rechenweg der Zuschlagszeile —
// und hing damit am Schalter `zeige_rechenweg_auf_pdf` (DC-050). Diese Datei
// hält fest, dass sie das nicht mehr tut, und dass sie es NUR für
// Prozentzuschläge nicht tut.

describe('DC-137 · der Leser sitzt neben dem Schreiber', () => {
  it('findet die Grundlage in genau dem Satz, den zuschlagBerechnungsweg schreibt — Raum-Fall', () => {
    const weg = zuschlagBerechnungsweg(15, 456, 'Wohnzimmer')
    expect(weg).toBe('15 % auf 456,00 € (Leistungen Wohnzimmer)')
    expect(zuschlagsBezugAus(weg)).toBe(weg)
  })

  it('… Gewerke-Fall', () => {
    const weg = zuschlagBerechnungsweg(20, 2301.14, null, 'maler')
    expect(weg).toBe('20 % auf 2301,14 € (Leistungen Maler)')
    expect(zuschlagsBezugAus(weg)).toBe(weg)
  })

  it('… und der Fall ohne beides', () => {
    const weg = zuschlagBerechnungsweg(10, 800, null)
    expect(weg).toBe('10 % auf 800,00 € (Leistungen dieses Angebots)')
    expect(zuschlagsBezugAus(weg)).toBe(weg)
  })

  it('schneidet den Anlass vorne ab — der steht mit dem Schalter zur Debatte, die Grundlage nicht', () => {
    const weg = `Raumhöhe 3,2m > 3m · ${zuschlagBerechnungsweg(15, 456, 'Wohnzimmer')}`
    expect(zuschlagsBezugAus(weg)).toBe('15 % auf 456,00 € (Leistungen Wohnzimmer)')
  })

  it('erfindet nichts, wo keine Grundlage steht', () => {
    expect(zuschlagsBezugAus('Altbau im Transkript erkannt')).toBeNull()
    expect(zuschlagsBezugAus('20 m² + 5% Verschnitt')).toBeNull()
    expect(zuschlagsBezugAus(null)).toBeNull()
    expect(zuschlagsBezugAus('')).toBeNull()
  })
})

describe('DC-137 · was auf dem Kundenpapier steht', () => {
  const weg = `Raumhöhe 3,2m > 3m · ${zuschlagBerechnungsweg(15, 456, 'Wohnzimmer')}`

  it('Rechenweg sichtbar: unverändert der ganze Satz wie vor DC-137', () => {
    expect(kundenRechenwegZeile(weg, ZUSCHLAG_EINHEIT, true)).toBe(kundenRechenweg(weg))
  })

  it('Rechenweg sichtbar, ohne Rechenweg: weiterhin „Pauschale"', () => {
    expect(kundenRechenwegZeile(null, 'Pauschale', true)).toBe('Pauschale')
  })

  it('Rechenweg aus, Prozentzuschlag: die Grundlage bleibt stehen', () => {
    expect(kundenRechenwegZeile(weg, ZUSCHLAG_EINHEIT, false)).toBe(
      '15 % auf 456,00 € (Leistungen Wohnzimmer)',
    )
  })

  it('Rechenweg aus, gewöhnliche Position: nichts — der Schalter gilt wie bisher', () => {
    expect(kundenRechenwegZeile('46,64 m² × 2 Anstriche', 'm²', false)).toBeNull()
    expect(kundenRechenwegZeile('Gerüst im Aufmaß erkannt', 'Pauschale', false)).toBeNull()
  })

  it('Rechenweg aus, Zuschlag aus einem alten Angebot ohne Grundlage im Satz: nichts statt Halbem', () => {
    expect(kundenRechenwegZeile('Altbau im Transkript erkannt', ZUSCHLAG_EINHEIT, false)).toBeNull()
    expect(kundenRechenwegZeile(null, ZUSCHLAG_EINHEIT, false)).toBeNull()
  })
})

describe('DC-137 · am gerechneten Angebot, nicht am Beispielsatz', () => {
  // Der Fall aus PD-018 §3: ein Zuschlag, dessen Einzelpreis für sich
  // genommen nichts bedeutet.
  const items: ZuschlagsItem[] = [
    { title: 'Wände streichen 2x — Wohnzimmer', quantity: 40, unit: 'm²', unit_price: 9.5, kategorie: 'Maler – Innen' },
    { title: 'Decke streichen 2x — Wohnzimmer', quantity: 20, unit: 'm²', unit_price: 3.8, kategorie: 'Maler – Innen' },
    { title: 'Erschwerniszuschlag Raumhöhe > 3m — Wohnzimmer', quantity: 1, unit: ZUSCHLAG_EINHEIT, unit_price: 15, kategorie: 'Maler – Erschwernisse & Zuschläge' },
  ]

  it('zeigt dem Kunden die Summe, auf die gerechnet wurde — nicht die Euro je Prozentpunkt', () => {
    const kopie = items.map(i => ({ ...i }))
    wendeProzentZuschlaegeAn(kopie, () => true)
    const zuschlag = kopie[2]

    // 40 × 9,50 + 20 × 3,80 = 456,00 €
    expect(zuschlag.unit_price).toBe(4.56)
    expect(zuschlag.quantity).toBe(15)

    const zeile = kundenRechenwegZeile(zuschlag.berechnungsweg, zuschlag.unit, false)
    expect(zeile).toContain('456,00 €')
    // Genau das ist der Befund: „15 % × 4,56 €" allein ist keine Aussage.
    expect(zeile).not.toBe('')
    expect(zeile).not.toBeNull()
  })

  it('gewöhnliche Positionen desselben Angebots bleiben bei abgeschaltetem Rechenweg stumm', () => {
    const kopie = items.map(i => ({ ...i }))
    wendeProzentZuschlaegeAn(kopie, () => true)
    expect(kundenRechenwegZeile(kopie[0].berechnungsweg, kopie[0].unit, false)).toBeNull()
    expect(kundenRechenwegZeile(kopie[1].berechnungsweg, kopie[1].unit, false)).toBeNull()
  })
})
