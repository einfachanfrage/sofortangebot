// Alltagsbegriffe — findet ein Betrieb noch einen Preis, wenn er tippt wie er redet?
//
// ── Warum es diese Datei gibt (Manfred, 12.09.2026) ───────────────────────
//
// Nach dem Umbenennungs-Zug fragte Manfred das Richtige: *„Wenn ‚Tür
// lackieren' oder ‚Laminat verlegen' ohne Zusatz jetzt 0 € und Versandsperre
// gibt, dann fällt das nicht auf – dann steht der Handwerker Freitagabend vor
// einer gesperrten Position, die er gestern noch hatte, und weiß nicht
// warum."*
//
// Die Umbenennung war unschuldig (gemessen: identisches Ergebnis mit und
// ohne). Die Messung hat aber etwas anderes gefunden, das schon vorher da
// war: **Sechs von 32 Alltagsbegriffen fanden gar keinen Preis**, darunter
// `Tür streichen`, `Heizkörper lackieren` und `Raufaser tapezieren` — alles
// Maler, alles täglich.
//
// Ursache war die Arbeitsgang-Sperre: Sie las `Tür streichen / lackieren` als
// „streichen UND lackieren" und sperrte deshalb gegen eine Anfrage, die nur
// einen der beiden Gänge nennt. Der Schrägstrich heißt aber „oder" — die
// Zeile bietet beides zum selben Preis an.
//
// Diese Datei hält beide Seiten fest: Der Alltagsbegriff muss einen Preis
// finden, UND das Bündel darf weiter nicht einspringen.
import { describe, expect, it } from 'vitest'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'

type Zeile = { id: string; title: string; category: string; unit: string; unit_price: number }
const KATALOG: Zeile[] = DEFAULT_PRICES.map((p, i) => ({ id: `p${i}`, ...p }))
const gewerk = (praefix: string) => KATALOG.filter(p => p.category.startsWith(praefix))

const preis = (gew: string, einheit: string, titel: string) =>
  findePreisposition(titel, einheit, gewerk(gew))

describe('Der Betrieb tippt, wie er redet — und bekommt einen Preis', () => {
  it.each([
    ['Maler', 'Stück', 'Tür streichen'],
    ['Maler', 'Stück', 'Türen lackieren'],
    ['Maler', 'Stück', 'Fenster lackieren'],
    ['Maler', 'Stück', 'Heizkörper lackieren'],
    ['Maler', 'm²', 'Wand streichen'],
    ['Maler', 'm²', 'Decke streichen'],
    ['Maler', 'm²', 'Fassade streichen'],
    ['Maler', 'm²', 'Tapete entfernen'],
    ['Maler', 'm²', 'Raufaser tapezieren'],
    ['Maler', 'm²', 'Wand spachteln'],
    ['Maler', 'm²', 'Grundieren'],
    ['Boden', 'm²', 'Laminat verlegen'],
    ['Boden', 'm²', 'Parkett verlegen'],
    ['Boden', 'm²', 'Vinyl verlegen'],
    ['Boden', 'm²', 'Teppichboden verlegen'],
    ['Boden', 'm²', 'Parkett abschleifen'],
    ['Boden', 'm²', 'Altbelag entfernen'],
    ['Boden', 'lfdm', 'Sockelleisten montieren'],
    ['Boden', 'm²', 'Ausgleichsmasse einbringen'],
  ])('%s · %s · „%s"', (gew, einheit, titel) => {
    expect(preis(gew, einheit, titel), `„${titel}" findet keinen Preis`).not.toBeNull()
  })
})

describe('Sammelzeile heißt oder, Bündel heißt und', () => {
  it('gibt „Tür streichen" die Zeile, die streichen UND lackieren anbietet', () => {
    // `Tür streichen / lackieren (einseitig)` — ein Schrägstrich, zwei Wörter
    // für dieselbe Arbeit, ein Preis. 45,00 €, nicht „kein Preis".
    // 55,00 € seit PD-010 (15.09.2026): Die Zeile mit 45 € lag in „Anstrich
    // Innen" statt in „Lackierarbeiten" und war die billigere von zwei
    // Dubletten. Der Punkt dieses Tests ist unverändert — „Tür streichen"
    // findet die Zeile, die streichen UND lackieren anbietet, statt „Preis
    // fehlt" zu zeigen.
    expect(preis('Maler', 'Stück', 'Tür streichen')?.position.unit_price).toBe(55)
    expect(preis('Maler', 'Stück', 'Heizkörper lackieren')?.position.unit_price).toBe(40)
  })

  it('gibt „Raufaser tapezieren" die Zeile OHNE Anstrich', () => {
    // Der teure Fehler in die andere Richtung: `Raufaser tapezieren +
    // überstreichen 1x` (14,00 €) enthält einen Anstrich, den niemand
    // bestellt hat — 4,00 €/m², und der Betrieb schuldet die Arbeit.
    // Die unbündelte Zeile steht daneben und kostet 10,00 €.
    expect(preis('Maler', 'm²', 'Raufaser tapezieren')?.position.unit_price).toBe(10)
  })

  it('lässt „Parkett schleifen" weiter ohne Preis', () => {
    // Der Kopf-Fall des Prüfmeisters. Der Katalog kennt nur
    // `Parkett schleifen + versiegeln komplett` und `+ ölen komplett` —
    // beides Bündel. Wer nur schleifen will, darf keins davon bekommen.
    // PM-018: lieber sichtbar kein Preis als still das Doppelte.
    expect(preis('Boden', 'm²', 'Parkett schleifen')).toBeNull()
  })

  it('lässt eine Anfrage mit ZWEI Gängen nicht auf eine Zeile mit einem fallen', () => {
    // Die Teilmengen-Grenze. „Wand spachteln und streichen" enthält einen
    // Arbeitsgang, den `Wand streichen 2x` nicht abdeckt — wer hier einen
    // Treffer zulässt, verschenkt das Spachteln.
    expect(preis('Maler', 'm²', 'Wand spachteln und streichen')).toBeNull()
    expect(preis('Maler', 'm²', 'Tapete entfernen und spachteln')).toBeNull()
  })
})
