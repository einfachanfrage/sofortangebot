// DC-138 (21.09.2026) — der Tausenderpunkt darf kein Komma werden.
//
// Anlass: Engineering hat mit `e1b7c76` (CoS-E-090) `mitDeutschenZahlen()` an
// die zwei Renderstellen der Positionsliste in `AngebotDetail.tsx` gesetzt.
// Die Entscheidung bleibt (DC-138) — sie zieht DC-055 an der zweiten Stelle
// nach. Sie legt aber eine Falle frei: sobald CoS-E-092 den Tausenderpunkt in
// `zuschlagBerechnungsweg()` nachzieht, läuft `20 % auf 2.301,14 €` durch
// diese Hilfe — und die alte Regel `\d+(?:\.\d+)+` hätte daraus
// `20 % auf 2,301,14 €` gemacht. In der App, in der Vorschau und im PDF
// gleichzeitig.
//
// CoS-E-092 ist seit `5191791` gebaut, die Falle damit scharf. Diese Datei
// hält beide Schreibweisen fest, die dadurch gleichzeitig im Umlauf sind: die
// neue mit Tausenderpunkt und die alte ohne, die in jedem vorher angelegten
// Angebot gespeichert stehen bleibt.
import { describe, it, expect } from 'vitest'
import { mitDeutschenZahlen } from '@/lib/zahlen-text'
import { zuschlagBerechnungsweg, zuschlagsBezugAus } from '@/lib/zuschlag-basis'

describe('DC-138 — deutsche Tausenderzahlen bleiben unangetastet', () => {
  it('macht aus 2.301,14 kein 2,301,14', () => {
    expect(mitDeutschenZahlen('20 % auf 2.301,14 € (Leistungen dieses Angebots)'))
      .toBe('20 % auf 2.301,14 € (Leistungen dieses Angebots)')
  })

  it('kommt auch mit Millionen klar', () => {
    expect(mitDeutschenZahlen('Auftragssumme 1.234.567,89 €'))
      .toBe('Auftragssumme 1.234.567,89 €')
  })

  it('hält die Grenze fest: ohne Cent-Komma bleibt es eine Dezimalzahl', () => {
    // Bewusst so. `2.135` ist im Produkt eine echte Türhöhe in Metern
    // (Prüfraum E-090-A) — eine Regel, die `2.301` als Tausender läse, hätte
    // aus ihr `2.135` gemacht und den Rechenweg der Wandfläche verdorben.
    // Geldbeträge kommen über `toFixed(2)` und bringen ihr Komma mit.
    expect(mitDeutschenZahlen('Türen 1,35×2.135')).toBe('Türen 1,35×2,135')
    expect(mitDeutschenZahlen('Grundlage 2.301 €')).toBe('Grundlage 2,301 €')
  })

  it('schreibt englische Dezimalzahlen weiterhin deutsch', () => {
    expect(mitDeutschenZahlen('Wand 6 m lang, 2.4 m hoch = 14.4 m²'))
      .toBe('Wand 6 m lang, 2,4 m hoch = 14,4 m²')
    expect(mitDeutschenZahlen('Wandfläche Wohnzimmer 46.8 m²'))
      .toBe('Wandfläche Wohnzimmer 46,8 m²')
  })

  it('fasst Datumsangaben und Normnummern weiter nicht an', () => {
    expect(mitDeutschenZahlen('Aufmaß vom 11.09.2026')).toBe('Aufmaß vom 11.09.2026')
    expect(mitDeutschenZahlen('VOB/C DIN 18363 Übermessung')).toBe('VOB/C DIN 18363 Übermessung')
  })
})

describe('DC-138 — der heutige Zuschlags-Rechenweg überlebt die Hilfe unverändert', () => {
  it('seit CoS-E-092: mit Tausenderpunkt, und die Hilfe lässt ihn stehen', () => {
    const weg = zuschlagBerechnungsweg(20, 2301.14, null, null)
    expect(weg).toBe('20 % auf 2.301,14 € (Leistungen dieses Angebots)')
    expect(mitDeutschenZahlen(weg)).toBe(weg)
  })

  it('und Bestandsangebote von vor CoS-E-092 tragen die alte Schreibweise weiter', () => {
    // Nicht historisch, sondern dauerhaft: `berechnungsweg` wird beim Anlegen
    // des Angebots gespeichert (`quotes/create`, `quotes/[id]/revise`) und
    // nicht bei jeder Anzeige neu gebildet. Jedes Angebot von vor `5191791`
    // trägt die alte Schreibweise also für immer in der Spalte und läuft
    // trotzdem durch dieselbe Hilfe. Ohne Punkt greift die Regel gar nicht —
    // hier ist genau das die Zusicherung, nicht ein Nebeneffekt.
    const bestand = '20 % auf 2301,14 € (Leistungen dieses Angebots)'
    expect(mitDeutschenZahlen(bestand)).toBe(bestand)
  })

  it('und der Leser aus DC-137 findet die Grundlage in beiden Schreibweisen', () => {
    for (const weg of [
      '20 % auf 2301,14 € (Leistungen Wohnzimmer)',
      '20 % auf 2.301,14 € (Leistungen Wohnzimmer)',
    ]) {
      expect(zuschlagsBezugAus(mitDeutschenZahlen(weg))).toBe(weg)
    }
  })
})
