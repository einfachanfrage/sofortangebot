// Verlegeart im Titel (G.2) — und die eine Bedingung, an der sie hängt.
//
// Die Regel selbst ist klein. Gefährlich ist sie an einer Stelle: Ein Zusatz
// OHNE passende Katalogzeile ist schlimmer als gar keiner. Gemessen am
// 12.09.2026: `Vinyl-Boden verlegen vollflächig verklebt` traf
// `Fertigparkett verlegen vollflächig verklebt` — 35,00 € statt 16,00 €. Der
// Zusatz macht den Titel textlich so ähnlich zur Parkettzeile, dass der
// Belagname allein nicht mehr den Ausschlag gibt.
//
// Deshalb ist der Katalog-Abgleich hier ein Test und keine Fußnote: Wer einen
// Belag in MOEGLICH aufnimmt, dessen Zeile der Standardkatalog nicht führt,
// merkt es hier und nicht im Angebot eines Handwerkers.
import { describe, expect, it } from 'vitest'
import { verlegeartZusatz } from '../verlegeart'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'

const boden = DEFAULT_PRICES
  .filter(p => p.category.startsWith('Boden'))
  .map((p, i) => ({ id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price }))

/** Alle Belag-Labels, die Engine und Vollständigkeitsprüfung erzeugen können. */
const LABELS = [
  'Bodenbelag', 'Klick-Vinyl', 'Vinyl-Boden', 'Designboden', 'Vinyl / Designboden',
  'Laminat', 'Fertigparkett', 'Parkett', 'Eichenparkett', 'Kork', 'Linoleum',
  'Teppich', 'Teppichboden', 'Nadelvlies-Teppichboden',
]
/** Die drei Diktat-Lagen: nichts gesagt, verklebt gesagt, schwimmend gesagt. */
const DIKTAT = ['', 'vollflächig verklebt', 'Klick-System, schwimmend verlegt']

/** Das Belagwort, das die Katalogzeile tragen muss, damit sie plausibel ist. */
const ERWARTETES_WORT: Record<string, RegExp> = {
  'Klick-Vinyl': /vinyl/i,
  'Laminat': /laminat/i,
  'Fertigparkett': /parkett/i,
  'Parkett': /parkett/i,
  'Kork': /kork/i,
  'Linoleum': /linoleum/i,
  'Teppichboden': /teppich/i,
  'Nadelvlies-Teppichboden': /teppich|nadelvlies/i,
}

describe('Verlegeart — was in den Titel geschrieben wird', () => {
  it('schreibt sie, wo sie technisch feststeht', () => {
    expect(verlegeartZusatz('Laminat')).toBe(' schwimmend')
    expect(verlegeartZusatz('Linoleum')).toBe(' vollflächig verklebt')
    // Manfred und der Prüfmeister ausdrücklich: Nadelvlies wird IMMER
    // verklebt, die schwimmende Verlegung gibt es bei diesem Belag nicht.
    expect(verlegeartZusatz('Nadelvlies-Teppichboden')).toBe(' vollflächig verklebt')
  })

  it('lässt ein Verhören im Diktat die Technik nicht umstoßen', () => {
    expect(verlegeartZusatz('Nadelvlies-Teppichboden', 'schwimmend verlegt')).toBe(' vollflächig verklebt')
    expect(verlegeartZusatz('Laminat', 'vollflächig verklebt')).toBe(' schwimmend')
  })

  it('folgt dem Diktat, wo die Verlegeart offen ist', () => {
    expect(verlegeartZusatz('Fertigparkett', 'vollflächig verklebt')).toBe(' vollflächig verklebt')
    expect(verlegeartZusatz('Fertigparkett', 'Klick-System')).toBe(' schwimmend')
    expect(verlegeartZusatz('Kork', 'wird verklebt')).toBe(' vollflächig verklebt')
  })

  it('schweigt, wo nichts feststeht und nichts gesagt wurde', () => {
    expect(verlegeartZusatz('Fertigparkett')).toBe('')
    expect(verlegeartZusatz('Teppichboden')).toBe('')
    // Unbekannter Belag: Da wissen wir gar nichts. `Bodenbelag verlegen
    // schwimmend` landete in der Messung bei 22,00 € Fertigparkett.
    expect(verlegeartZusatz('Bodenbelag', 'Klick-System')).toBe('')
    expect(verlegeartZusatz('Bodenbelag', 'vollflächig verklebt')).toBe('')
  })

  it('macht aus Teppich niemals einen schwimmenden Belag', () => {
    // Teppich wird gespannt, geklebt oder lose verlegt. Ohne diese Sperre
    // machte ein „Klick-Vinyl" in einem ANDEREN Raum aus
    // `Teppichboden verlegen` ein `Teppichboden verlegen schwimmend` — und
    // das traf `Fertigparkett verlegen schwimmend`, 22,00 €/m² für Teppich.
    expect(verlegeartZusatz('Teppichboden', 'überall Klick-System')).toBe('')
    expect(verlegeartZusatz('Teppichboden', 'vollflächig verklebt')).toBe(' vollflächig verklebt')
  })

  it('hängt nie einen Zusatz an einen Belag, den der Katalog so nicht führt', () => {
    // Der eigentliche Schutz. Fällt dieser Test, steht irgendwo ein Titel im
    // Angebot, dessen Preis von einem fremden Belag kommt.
    const beschwerden: string[] = []
    for (const label of LABELS) {
      for (const diktat of DIKTAT) {
        const zusatz = verlegeartZusatz(label, diktat)
        if (zusatz === '') continue
        const titel = `${label} verlegen${zusatz}`
        const treffer = findePreisposition(titel, 'm²', boden)
        if (!treffer) { beschwerden.push(`${titel} → kein Preis`); continue }
        const erwartet = ERWARTETES_WORT[label]
        if (!erwartet) { beschwerden.push(`${titel} → kein erwartetes Belagwort hinterlegt`); continue }
        if (!erwartet.test(treffer.position.title)) {
          beschwerden.push(`${titel} → ${treffer.position.title} (${treffer.position.unit_price} €) — fremder Belag`)
        }
      }
    }
    expect(beschwerden).toEqual([])
  })

  it('trifft die Zeilen, um die es Manfred ging', () => {
    const preis = (titel: string) => findePreisposition(titel, 'm²', boden)?.position.unit_price
    expect(preis('Laminat verlegen schwimmend')).toBe(14)
    expect(preis('Teppichboden verlegen vollflächig verklebt')).toBe(18)
    expect(preis('Fertigparkett verlegen vollflächig verklebt')).toBe(35)
    expect(preis('Fertigparkett verlegen schwimmend')).toBe(22)
    expect(preis('Kork verlegen vollflächig verklebt')).toBe(24)
    expect(preis('Linoleum verlegen vollflächig verklebt')).toBe(22)
  })

  it('sperrt den Fischgrät-Ersatztitel nicht — der ist wörtlich aus dem Katalog', () => {
    expect(findePreisposition('Laminat im Fischgrätmuster verlegen', 'm²', boden)?.position.unit_price).toBe(24)
  })
})
