// ── CoS-E-097 · PM-145-A/B/C und PM-146-A ──────────────────────────────────
//
// Zwei Sätze, die Geld vom Kundenpapier genommen haben. Beide hat der
// Prüfmeister am 23.09.2026 gemessen, mit Soll und Wortlaut hinterlegt und
// ausdrücklich NICHT gebaut; gebaut sind sie hier.
//
//   PM-145  „An den Fenstern machen wir nichts."      370,00 € von 835,90 €
//           „An den Heizkörpern machen wir nichts."   blieben stehen, stumm
//   PM-146  „Wände und Decke weiß."                   0,00 €, ein leeres Blatt
//
// Die Sperrklinken dazu stehen in `pruefmeister-batch-145-146.test.ts` und
// sind mit diesem Bau eingelöst. Diese Datei sichert die GRENZEN des Baus —
// die Stellen, an denen ein zu weiter Griff teuer würde und die in den
// Sperrklinken nicht stehen.
//
// ⚠ PM-146 LOCKERT. Eine Regel, die mehr durchlässt, kann anderswo greifen;
// deshalb steht unter Gruppe 3 und 4 ausdrücklich, was weiterhin NICHT
// durchkommt — und unter Gruppe 5, was bewusst nicht mitgebaut wurde.

import { describe, it, expect } from 'vitest'
import { erkenneBauteilAusschluss, bauteilAusschlussHinweis } from '../bauteil-ausschluss'
import type { Bauteil } from '../bauteil-ausschluss'

const RAEUME = ['Wohnzimmer', 'Flur']

/** Was die Bremse für einen Raum liest. */
function bremse(text: string, raum = 'Wohnzimmer'): Bauteil[] {
  const r = erkenneBauteilAusschluss(text, RAEUME)
  return [...(r.jeRaum.get(raum) ?? new Set<Bauteil>())]
}

const WZ = 'Wohnzimmer, 5 mal 4, Höhe 2,50.'

// ───────────────────────────────────────────────────────────────────────────
// 1 · PM-145 — das Dativ-n, und nur das Dativ-n
// ───────────────────────────────────────────────────────────────────────────
describe('CoS-E-097 · Gruppe 1: die Mehrzahl im Wemfall wird gelesen', () => {
  it('alle sechs Bauteile lesen jetzt dieselbe Form', () => {
    expect(bremse(`${WZ} An den Fenstern machen wir nichts.`)).toEqual(['fenster'])
    expect(bremse(`${WZ} An den Heizkörpern machen wir nichts.`)).toEqual(['heizkoerper'])
    // Und die Schreibweise ohne Umlaut, die `SATZ_WORT` seit jeher mitführt:
    expect(bremse(`${WZ} An den Heizkorpern machen wir nichts.`)).toEqual(['heizkoerper'])
  })

  it('die Einzahl und der Werfall/Wenfall bleiben, wie sie waren', () => {
    expect(bremse(`${WZ} Am Fenster machen wir nichts.`)).toEqual(['fenster'])
    expect(bremse(`${WZ} Am Heizkörper machen wir nichts.`)).toEqual(['heizkoerper'])
    expect(bremse(`${WZ} Die Fenster machen wir nicht.`)).toEqual(['fenster'])
    expect(bremse(`${WZ} Die Heizkörper machen wir nicht.`)).toEqual(['heizkoerper'])
  })

  it('⚠ die teuerste Zeile dieser Gruppe: das `n` frisst keine Nachbarwörter', () => {
    // `\bfenstern?\b` darf nicht in ein längeres Wort hineingreifen. Ein
    // Fensterladen, eine Fensterbank und eine Fensternische sind andere
    // Bauteile; wer sie mit abbestellt, nimmt bezahlte Zeilen vom Blatt.
    expect(bremse(`${WZ} Die Fensterläden machen wir nicht.`)).toEqual([])
    expect(bremse(`${WZ} An den Fensterbänken machen wir nichts.`)).toEqual([])
    expect(bremse(`${WZ} An den Fensternischen machen wir nichts.`)).toEqual([])
    expect(bremse(`${WZ} An den Heizkörpernischen machen wir nichts.`)).toEqual([])
  })

  it('der Wegfall trägt seinen Beleg — der Wortlaut kommt aus BAUTEIL_WORT', () => {
    const r = erkenneBauteilAusschluss(`${WZ} An den Fenstern machen wir nichts.`, RAEUME)
    expect(r.hinweise.some(h => h.bauteile.includes('fenster'))).toBe(true)
    expect(bauteilAusschlussHinweis('Wohnzimmer', ['fenster'], 'egal')).toContain('an den Fenstern')
  })

  it('die Raumgrenze gilt auch für die Mehrzahl', () => {
    const t = `${WZ} Flur, 4 mal 1,50, Höhe 2,50. Fenster streichen. Im Wohnzimmer an den Fenstern machen wir nichts.`
    expect(bremse(t, 'Wohnzimmer')).toEqual(['fenster'])
    expect(bremse(t, 'Flur')).toEqual([])
  })
})

// ───────────────────────────────────────────────────────────────────────────
// 2 · PM-146 — „weiß" ohne Zahlwort ist ein Auftrag
// ───────────────────────────────────────────────────────────────────────────
describe('CoS-E-097 · Gruppe 2: die Farbe zählt ohne Zahlwort', () => {
  const AUS = `${WZ} An den Wänden machen wir nichts.`

  it('der Auftrag hinter dem Ausschluss hebt ihn auf — mit und ohne Zahlwort', () => {
    expect(bremse(`${AUS} Wände und Decke zweimal weiß.`)).toEqual([])
    expect(bremse(`${AUS} Wände und Decke weiß.`)).toEqual([])
    expect(bremse(`${AUS} Wände komplett weiß.`)).toEqual([])
    expect(bremse(`${AUS} Die Wände weiß, die Decke auch.`)).toEqual([])
    expect(bremse(`${AUS} Wände in Weiß.`)).toEqual([])
    expect(bremse(`${AUS} Wände weiss.`)).toEqual([])
  })
})

// ───────────────────────────────────────────────────────────────────────────
// 3 · Was das Lockern NICHT mitnimmt — das Zeitwort „wissen"
// ───────────────────────────────────────────────────────────────────────────
describe('CoS-E-097 · Gruppe 3: „weiß" von „wissen" hebt nichts auf', () => {
  const AUS = `${WZ} An den Wänden machen wir nichts.`

  it('⚠ das Fürwort trägt jetzt allein, wo vorher die Zahlangabe mittrug', () => {
    // Nach dem Lockern schützt bei „Das weiß der Kunde" NICHT mehr die
    // Verneinung (es ist keine), sondern nur noch das Fürwort davor.
    for (const satz of [
      'Das weiß der Kunde noch nicht',
      'Weiß ich noch nicht',
      'Wer weiß das schon',
      'Ich weiß nicht, ob die Wände drankommen',
    ]) {
      expect(bremse(`${AUS} ${satz}.`), satz).toEqual(['wand'])
    }
  })

  it('⚠ kein `\\b` hinter ß: „weiße" und „weißeln" sind keine Aufhebung', () => {
    // ß ist ohne u-Flag kein Wortzeichen — die Grenze gäbe es gar nicht.
    // Dieselbe Falle hat in diesem Projekt schon zweimal Geld gekostet.
    expect(bremse(`${AUS} Die weiße Wand bleibt.`)).toEqual(['wand'])
    // „weißeln" IST eine Tätigkeit und wird von TAETIGKEIT ohnehin gelesen —
    // hier zählt nur, dass nicht die Farbregel dafür herhält.
    expect(bremse(`${AUS} Die weißen Flächen bleiben.`)).toEqual(['wand'])
  })
})

// ───────────────────────────────────────────────────────────────────────────
// 4 · Die zwei Grenzen aus PM-134/PM-135 halten auch die gelockerte Regel
// ───────────────────────────────────────────────────────────────────────────
describe('CoS-E-097 · Gruppe 4: Richtung und Raumgrenze gelten weiter', () => {
  it('⚠ nach vorn, nicht zurück: die Farbe VOR dem Ausschluss hebt ihn nicht auf', () => {
    // Das ist die Richtung aus PM-135 — dort kostete ihr Fehlen 465,90 €
    // GEGEN den Kunden. Das Lockern darf sie nicht aushebeln.
    expect(bremse(`${WZ} Wände weiß, an den Wänden machen wir nichts.`)).toEqual(['wand'])
  })

  it('die Farbe in einem anderen Raum hebt den Ausschluss nicht auf', () => {
    const t = `${WZ} An den Wänden machen wir nichts. Flur, 4 mal 1,50, Höhe 2,50. Wände weiß.`
    expect(bremse(t, 'Wohnzimmer')).toEqual(['wand'])
  })
})

// ───────────────────────────────────────────────────────────────────────────
// 5 · Was bewusst NICHT mitgebaut ist
// ───────────────────────────────────────────────────────────────────────────
describe('CoS-E-097 · Gruppe 5: die Grenze des Auftrags', () => {
  it('andere Farben bleiben draußen, bis sie gemessen sind', () => {
    // Der Prüfmeister hat „weiß" gemessen, 17 Formulierungen, sonst nichts.
    // „Wände in Grau" ohne Tätigkeitswort ist hier deshalb weiterhin kein
    // Auftrag. Das ist keine Nachlässigkeit, sondern die Grenze des Solls —
    // wer sie verschiebt, misst vorher.
    expect(bremse(`${WZ} An den Wänden machen wir nichts. Wände in Grau.`)).toEqual(['wand'])
  })
})
