// Heizkörper — jeder in seinem Raum.
//
// ── DC-091 / TN-104, hinter CoS-E-026 ─────────────────────────────────────
//
// Der Designer hatte DC-091 bewusst offen gelassen: Der Erklärtext in den
// Einstellungen („An- und Abfahrt, Kleinmaterial und Aufmaß stehen immer
// separat unter ‚Allgemein'") war richtig — falsch war nur, was Manfred
// daraus schließen musste, nämlich dass auch seine Flurdecke aus demselben
// Grund dort liegt. Seine Notiz dazu: *„Der Text wird deshalb ausdrücklich
// nicht angepasst: einen Fehler in der Erklärung zur Normalität zu erklären,
// wäre die schlechteste Lösung von allen. Sobald CoS-E-026 behoben ist,
// stimmt der Satz wieder von allein."*
//
// Beim Nachmessen stimmte er noch nicht ganz. Die Decke saß im Flur, aber
// die Heizkörper nicht: Bei „Flur und Wohnzimmer … je ein Heizkörper" stand
// auf dem Kundenpapier unter **Flur zwei Heizkörper** und unter Wohnzimmer
// keiner. Die Summe stimmte, die Zuordnung nicht — und in einem nach Räumen
// gegliederten Angebot liest der Kunde genau die.
//
// Zwei Ursachen, beide dieselbe Familie wie CoS-E-026:
//   1. Kommt die Stückzahl aus der ZAHL DER RÄUME, gehört sie nicht in einen
//      Raum, sondern in jeden.
//   2. `findeRaumImSatz` nahm den Raum, der in der Übergabeliste zuerst
//      steht — nicht den, der im Satz neben der Arbeit steht.
import { describe, expect, it } from 'vitest'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { gruppiereNachRaum, istAllgemeinPosition } from '../angebot-gruppierung'
import { ersetzeZahlenWorte } from '../zahlen-parser'
import type { BerechnetePosition } from '../mengen/types'

const wand = (raum: string): BerechnetePosition =>
  ({ beschreibung: `Wand streichen 2x — ${raum}`, menge: 40, einheit: 'm²', konfidenz: 'high', berechnungsweg: '', annahmen: [] })

/** Wie die echte Pipeline: Zahlwörter zuerst in Ziffern. */
const lauf = (text: string, raeume: string[]) =>
  pruefeUndErgaenzeVollstaendigkeit('maler', raeume.map(wand), ersetzeZahlenWorte(text)).positionen

const heizkoerper = (text: string, raeume: string[]) =>
  lauf(text, raeume)
    .filter(p => /Heizkörper lackieren/.test(p.beschreibung))
    .map(p => ({ titel: p.beschreibung, menge: p.menge }))

describe('Stückzahl aus der Raumzahl → eine Position je Raum', () => {
  it('„je ein Heizkörper" bei zwei Räumen: einer hier, einer dort', () => {
    const h = heizkoerper('Flur und Wohnzimmer, Wände streichen, je ein Heizkörper lackieren.', ['Flur', 'Wohnzimmer'])
    expect(h).toHaveLength(2)
    expect(h.every(x => x.menge === 1)).toBe(true)
    expect(h.map(x => x.titel).join(' ')).toMatch(/— Flur/)
    expect(h.map(x => x.titel).join(' ')).toMatch(/— Wohnzimmer/)
  })

  it('„je zwei Heizkörper" ergibt zwei je Raum, nicht zwei insgesamt', () => {
    const h = heizkoerper('Flur und Wohnzimmer, Wände streichen, je zwei Heizkörper lackieren.', ['Flur', 'Wohnzimmer'])
    expect(h).toHaveLength(2)
    expect(h.every(x => x.menge === 2)).toBe(true)
  })

  it('eine ausdrückliche Gesamtzahl bleibt EINE Position', () => {
    // „3 Heizkörper" sagt nichts darüber, wie sie sich auf die Räume
    // verteilen. Die App darf das nicht erfinden — sie würde es auf dem
    // Kundenpapier behaupten.
    const h = heizkoerper('Flur und Wohnzimmer streichen, 3 Heizkörper lackieren.', ['Flur', 'Wohnzimmer'])
    expect(h).toHaveLength(1)
    expect(h[0].menge).toBe(3)
  })

  it('bei einem Raum bleibt alles wie bisher', () => {
    expect(heizkoerper('Wohnzimmer streichen, Heizkörper lackieren.', ['Wohnzimmer'])).toHaveLength(1)
  })
})

describe('Der nächste Raumname gewinnt, nicht der erste der Liste', () => {
  it('„im Bad zwei Heizkörper" landet im Bad — auch wenn der Flur vorher steht', () => {
    // Vorher gewann der Flur, weil er in der Raumliste zuerst kam. Deutsch
    // stellt den Ort voran; der Raum direkt vor der Arbeit ist gemeint.
    const h = heizkoerper('Flur und Wohnzimmer streichen, im Bad zwei Heizkörper lackieren.', ['Flur', 'Wohnzimmer', 'Bad'])
    expect(h).toHaveLength(1)
    expect(h[0].titel).toMatch(/— Bad$/)
    expect(h[0].menge).toBe(2)
  })
})

describe('DC-091: Was unter „Allgemein" steht, ist genau das, was der Erklärtext nennt', () => {
  it('Flurdecke und Heizkörper sind im Raum, nur Anfahrt und Kleinmaterial bleiben', () => {
    // Manfreds Fall (TN-104). Der Satz in den Einstellungen stimmt erst dann
    // wieder, wenn hier nichts anderes mehr steht — das war die Bedingung,
    // unter der DC-091 offen gelassen wurde.
    const positionen = lauf('Flur und Wohnzimmer, Wände und Decken zweimal streichen, je ein Heizkörper lackieren.', ['Flur', 'Wohnzimmer'])
    const items = positionen.map((p, i) => ({
      id: `i${i}`, title: p.beschreibung, description: null, quantity: p.menge,
      unit: p.einheit, unit_price: 1, total_price: p.menge, position: i,
    }))
    items.push({ id: 'a1', title: 'An- und Abfahrt', description: null, quantity: 1, unit: 'Pauschale', unit_price: 45, total_price: 45, position: 900 })
    items.push({ id: 'a2', title: 'Kleinmaterial und Verbrauchsmaterial', description: null, quantity: 1, unit: 'Pauschale', unit_price: 25, total_price: 25, position: 901 })

    const g = gruppiereNachRaum(items, ['Flur', 'Wohnzimmer'])!
    // Jede einzelne Zeile unter „Allgemein" muss eine echte Allgemein-Position
    // sein — keine Arbeit, die nur ihren Raum verloren hat.
    for (const a of g.allgemein) {
      expect(istAllgemeinPosition(a.title), `„${a.title}" ist Arbeit, keine Allgemein-Position`).toBe(true)
    }
    // Und beide Räume haben ihre Heizkörper.
    for (const raum of g.raeume) {
      expect(raum.items.some(i => /Heizkörper lackieren/.test(i.title)), raum.raumName).toBe(true)
    }
  })
})
