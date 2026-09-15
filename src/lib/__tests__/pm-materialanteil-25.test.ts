import { describe, it, expect } from 'vitest'
import { teileMaterialAb } from '../materialanteil'

// 25 % oder 26,1 %? — die eine fachliche Zeile der roten CI
// (Prüfmeister, 15.09.2026)
//
// Der Chief of Staff hat die Frage als einzige der sieben roten Zeilen dem
// Prüfmeister zugeschrieben: Manfreds Beispiel („nicht mehr 11,50 für Wand 2x,
// sondern 8,50 plus Farbe") entspricht 26,1 % Materialanteil, die Faustregel
// steht auf 25 % und kommt auf 8,62.
//
// ── Die Entscheidung: 25 % bleibt ─────────────────────────────────────────
//
// Nicht aus Bequemlichkeit, sondern weil **Manfreds eigene Zahlen es sagen.**
// Er hat nicht eine Zeile genannt, sondern drei:
//
//   Wand streichen 2x      11,50 €  →  3,00 € Farbe  =  26,1 %
//   Decke streichen 2x     11,00 €  →  2,50 € Farbe  =  22,7 %
//   Raufaser tapezieren    10,00 €  →  2,50 € Tapete =  25,0 %
//
//   Mittel 24,6 % · Median 25,0 %
//
// Die 26,1 % sind nicht „Manfreds Zahl" — sie sind eine von dreien, und zwar
// die höchste. Wer sie zur Regel macht, trifft die Wand auf den Cent und
// verfehlt die Decke um 37 Cent. Nachgerechnet, Summe der absoluten
// Abweichung über alle drei Zeilen:
//
//   24,0 %  0,48 €        25,5 %  0,42 €
//   24,5 %  0,43 €        26,0 %  0,47 €
//   25,0 %  0,38 €  ←     26,1 %  0,48 €
//
// **25 % ist das Minimum.** Es ist damit nicht die gerundete Bequemlichkeit,
// sondern der beste Satz über Manfreds eigene Angaben — und es ist eine
// runde Zahl, die ein Handwerker im Kopf nachrechnen kann.
//
// Dazu kommt, was die Zahlen selbst sagen: 11,50 − 8,50 = 3,00. Zwei runde
// Zahlen aus dem Kopf. Daraus einen Satz auf drei Stellen abzuleiten, liest
// mehr aus ihnen heraus, als drinsteht.
//
// ── Was das für die rote Zusicherung heißt ────────────────────────────────
//
// Engineering hat die Prüfung inzwischen auf ±0,50 gestellt, mit derselben
// Begründung („eine Regel für 140 Katalogzeilen kann eine Zeile nicht auf den
// Cent treffen, und wenn sie es täte, wäre sie hingebogen"). Das ist richtig
// und deckt sich mit der Entscheidung hier. Die Zeile ist damit fachlich
// beantwortet: **kein Änderungsbedarf an `ANTEIL_INNEN`.**
//
// Diese Datei hält die Begründung fest, damit die Frage nicht in vier Wochen
// noch einmal aufgemacht wird.

/** Manfreds drei eigene Zahlen, wörtlich. Titel · sein Preis · sein Material. */
const MANFRED: Array<[string, number, number]> = [
  ['Wand streichen 2x Anstrich', 11.5, 3.0],
  ['Decke streichen 2x Anstrich', 11.0, 2.5],
  ['Raufaser tapezieren ohne Anstrich', 10.0, 2.5],
]

describe('Materialanteil innen — 25 % gegen 26,1 %', () => {
  it('Manfreds drei Zahlen sind untereinander uneins — 22,7 bis 26,1 %', () => {
    // Der Kern der Entscheidung in einer Prüfung: Es gibt keine „Zahl von
    // Manfred". Wer eine daraus macht, hat sich eine ausgesucht.
    const saetze = MANFRED.map(([, preis, material]) => material / preis)
    expect(Math.min(...saetze)).toBeLessThan(0.23)
    expect(Math.max(...saetze)).toBeGreaterThan(0.26)
  })

  it('25 % trifft seine drei Zahlen besser als 26,1 %', () => {
    const fehler = (satz: number) =>
      MANFRED.reduce((s, [, preis, material]) => s + Math.abs(preis * satz - material), 0)
    expect(fehler(0.25)).toBeLessThan(fehler(0.261))
    // und besser als jeder andere Satz im plausiblen Band
    for (const satz of [0.22, 0.23, 0.24, 0.245, 0.255, 0.26, 0.261, 0.27]) {
      expect(fehler(0.25), `${satz}`).toBeLessThanOrEqual(fehler(satz))
    }
  })

  it('und die Aufteilung bleibt bei allen drei innerhalb von 50 Cent', () => {
    // Dieselbe Schärfe wie in `materialanteil.test.ts` — eine Aussage, ein
    // Maß. Der Preis ist jeweils MANFREDS, nicht der des Katalogs.
    for (const [titel, preis, material] of MANFRED) {
      const teile = teileMaterialAb({ title: titel, unit_price: preis })
      expect(teile, titel).not.toBeNull()
      expect(teile!.arbeit + teile!.material, titel).toBe(preis)
      expect(Math.abs(teile!.material - material), titel).toBeLessThanOrEqual(0.5)
    }
  })
})
