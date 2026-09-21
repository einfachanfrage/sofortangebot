import { describe, it, expect } from 'vitest'
import { DEFAULT_PRICES } from '../default-prices'
import { ERSCHWERNIS_ARTEN } from '../erschwernis'
import {
  wendeProzentZuschlaegeAn,
  aktualisiereProzentZuschlaege,
  istObjektbezogenerZuschlag,
  type ZuschlagsItem,
} from '../zuschlag-basis'

// ── CoS-E-083 §3 / PM-104 — die Bemessungsgrundlage der fünf
//    Erschwerniszuschläge (Sandys Freigabe vom 17.09.2026) ─────────────────
//
// Gemessen war: `Erschwerniszuschlag Altbau 20 %` rechnete auf die
// ANGEBOTSSUMME (2.301,14 €), `Erschwerniszuschlag Raumhöhe 15 %` dagegen
// schon auf die Raumpositionen. Zwei Grundlagen für dieselbe Katalogfamilie.
//
// Sandys Linie vom 04.09.2026: objektbezogene Zuschläge werden auf das
// betroffene Gewerk eingeengt, zeitbezogene bleiben aufs ganze Angebot. Alle
// fünf Erschwerniszuschläge der Vollständigkeitsprüfung sind objektbezogen —
// sie hängen daran, WORAN gearbeitet wird, nicht daran, WANN.
//
// Was hier NICHT geprüft wird, weil es hier nicht entschieden wurde: die
// HÖHE der Prozentsätze (offene Frage bei Sandy) und die Darstellung der
// grauen Grundlagen-Zeile im Angebot (PD-018 §3, Designer).

/**
 * Ein gemischtes Angebot mit ABSICHTLICH krummen Zahlen — mit runden Zahlen
 * kann eine Rundung in `euroJeProzentpunkt` nie auffallen.
 *
 *   Maler   608,00 € + 255,99 €  =   863,99 €
 *   Fliesen                          541,80 €
 *   ─────────────────────────────────────────
 *   Angebot                        1.405,79 €
 */
const gemischt = (): ZuschlagsItem[] => [
  { title: 'Wände streichen — Wohnzimmer', quantity: 47.5, unit: 'm²', unit_price: 12.8, kategorie: 'Maler – Anstricharbeiten' },
  { title: 'Decke streichen — Wohnzimmer', quantity: 22.26, unit: 'm²', unit_price: 11.5, kategorie: 'Maler – Anstricharbeiten' },
  { title: 'Fliesen verlegen — Bad', quantity: 8.4, unit: 'm²', unit_price: 64.5, kategorie: 'Fliesen – Verlegung' },
]

const MALER_SUMME = 863.99
const ANGEBOTS_SUMME = 1405.79

const zuschlag = (title: string, satz: number, kategorie: string | null = 'Maler – Erschwernisse & Zuschläge'): ZuschlagsItem =>
  ({ title, quantity: 1, unit: '%', unit_price: satz, kategorie, berechnungsweg: null })

const gesamt = (i: { quantity: number; unit_price: number }) => Math.round(i.quantity * i.unit_price * 100) / 100

describe('CoS-E-083 §3 — der Zuschlag rechnet nur auf die Leistungen, die er betrifft', () => {
  it('E-083-A · die Grundlage der Probe stimmt, bevor irgendein Zuschlag darauf rechnet', () => {
    const zeilen = gemischt()
    const maler = zeilen.filter(z => (z.kategorie ?? '').startsWith('Maler')).reduce((s, z) => s + z.quantity * z.unit_price, 0)
    const alles = zeilen.reduce((s, z) => s + z.quantity * z.unit_price, 0)
    expect(Math.round(maler * 100) / 100).toBe(MALER_SUMME)
    expect(Math.round(alles * 100) / 100).toBe(ANGEBOTS_SUMME)
    // Und die beiden Grundlagen sind weit genug auseinander, dass die Prüfung
    // die eine nicht versehentlich für die andere halten kann.
    expect(MALER_SUMME).toBeLessThan(ANGEBOTS_SUMME)
  })

  it('E-083-B · Altbau 20 % rechnet auf die Malerleistungen, nicht auf die Angebotssumme (PM-104)', () => {
    const items = [...gemischt(), zuschlag('Erschwerniszuschlag Altbau', 20)]
    wendeProzentZuschlaegeAn(items, () => true)
    expect(items[3].unit_price).toBe(8.64) // 864 / 100, nicht 1406 / 100
    expect(gesamt(items[3])).toBe(172.8)
    expect(items[3].berechnungsweg).toContain('863,99 €')
    expect(items[3].berechnungsweg).toContain('(Leistungen Maler)')
  })

  it('E-083-C · dieselbe Grundlage für alle fünf Arten — der Katalog ist einheitlich', () => {
    for (const art of ERSCHWERNIS_ARTEN) {
      // Der Titel, unter dem die Vollständigkeitsprüfung die Art erzeugt.
      const titel = art.titel.source.replace(/^\^/, '')
      const items = [...gemischt(), zuschlag(titel, 20)]
      wendeProzentZuschlaegeAn(items, () => true)
      expect(gesamt(items[3]), titel).toBe(172.8)
      expect(items[3].berechnungsweg, titel).toContain('(Leistungen Maler)')
    }
  })

  it('E-083-D · Raumhöhe engt weiter auf den Raum ein — Raum UND Gewerk, nicht das eine statt des anderen', () => {
    // Im Wohnzimmer liegen 863,99 € Maler; im Bad liegt Fliesenarbeit. Der
    // Raumhöhen-Zuschlag für das Wohnzimmer darf das Bad nicht sehen — und
    // auch nicht Fliesenarbeit IM Wohnzimmer.
    const items = [
      ...gemischt(),
      { title: 'Fliesen verlegen — Wohnzimmer', quantity: 3.2, unit: 'm²', unit_price: 64.5, kategorie: 'Fliesen – Verlegung' } as ZuschlagsItem,
      zuschlag('Erschwerniszuschlag Raumhöhe > 3m — Wohnzimmer', 15),
    ]
    wendeProzentZuschlaegeAn(items, () => true)
    expect(items[4].unit_price).toBe(8.64)
    expect(gesamt(items[4])).toBe(129.6)
  })

  it('E-083-E · Gegenprobe: der zeitbezogene Zuschlag rechnet unverändert aufs ganze Angebot', () => {
    // Wer samstags kommt, arbeitet samstags an allem. Wenn diese Zusicherung
    // mitkippt, ist die Regel zu breit geraten.
    const items = [...gemischt(), zuschlag('Zuschlag Wochenend- / Feiertagsarbeit (25%)', 25)]
    wendeProzentZuschlaegeAn(items, () => true)
    expect(items[3].unit_price).toBe(14.06) // 1406 / 100
    expect(gesamt(items[3])).toBe(351.5)
    expect(items[3].berechnungsweg).toContain('(Leistungen dieses Angebots)')
  })

  it('E-083-F · Gegenprobe: ohne bekannte Kategorie wird nichts geraten', () => {
    // Frei getippte Zuschlagszeile ohne Katalogbezug — sie darf nicht still
    // auf 0,00 € fallen, sondern bleibt beim bisherigen Verhalten.
    const items = [...gemischt(), zuschlag('Erschwerniszuschlag Altbau', 20, null)]
    wendeProzentZuschlaegeAn(items, () => true)
    expect(gesamt(items[3])).toBe(281.2) // 20 % auf 1.405,79 €
  })

  it('E-083-G · die Prozentsätze bleiben unangetastet', () => {
    // Ausdrücklicher Teil der Freigabe: „Keine Änderung an den Prozentsätzen."
    const SOLL: Record<string, number> = {
      'Erschwerniszuschlag Altbau': 20,
      'Erschwerniszuschlag Denkmalschutz': 30,
      'Erschwerniszuschlag bewohnt': 10,
      'Erschwerniszuschlag schwieriger Untergrund': 10,
      'Erschwerniszuschlag Raumhöhe > 3m': 15,
    }
    const saetze = Object.fromEntries(
      DEFAULT_PRICES.filter(p => p.title in SOLL).map(p => [p.title, p.unit_price]),
    )
    expect(saetze).toEqual(SOLL)
  })

  it('E-083-H · die Regel hängt an ERSCHWERNIS_ARTEN, nicht an einer zweiten Wortliste', () => {
    // Damit die sechste Art, die dort einmal dazukommt, nicht durchfällt.
    for (const art of ERSCHWERNIS_ARTEN) {
      expect(istObjektbezogenerZuschlag(art.titel.source.replace(/^\^/, '')), art.label).toBe(true)
    }
  })

  it('E-083-I · die 14 Katalog-Zuschläge behalten ihre Aufteilung neun zu fünf', () => {
    // Kontrolle, dass die neue Regel nicht in die Katalogfamilie hineinblutet.
    const vierzehn = DEFAULT_PRICES.filter(p => p.unit === '%' && /[0-9]+%\)/.test(p.title) && p.zuschlag_typ === 'prozent')
    expect(vierzehn).toHaveLength(14)
    expect(vierzehn.filter(p => istObjektbezogenerZuschlag(p.title))).toHaveLength(5)
  })

  it('E-083-J · im Editor gilt dieselbe Grundlage wie bei der Erzeugung', () => {
    // `aktualisiereProzentZuschlaege` ist der zweite Weg zum selben Geld
    // (CoS-026). Zwei Wege, zwei Zahlen wäre der schlimmere Fehler.
    const items = [...gemischt(), { ...zuschlag('Erschwerniszuschlag Altbau', 0), quantity: 20, unit_price: 14.06 }]
      .map(i => ({ ...i, total_price: Math.round((i.quantity ?? 0) * (i.unit_price ?? 0) * 100) / 100 }))
    const naechste = aktualisiereProzentZuschlaege(items, () => false, i => i.kategorie)
    expect(naechste[3].unit_price).toBe(8.64)
    expect(naechste[3].total_price).toBe(172.8)
  })
})
