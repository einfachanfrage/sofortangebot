// Landet jede Position in ihrem Raum?
//
// ── CoS-E-022 / TN-053 und CoS-E-026 / TN-064 (Manfred) ───────────────────
//
// Zwei Meldungen, eine Überschrift: „Positionen landen unter Allgemein statt
// im Raum". Beim Nachmessen waren es drei verschiedene Ursachen, und die
// dritte war keine Anzeigefrage:
//
//   1. Die Raumerkennung war eine STICHWORTLISTE mit 32 Wörtern. Von 52
//      realistischen Raumnamen erkannte sie 31. „Atelier", „Salon",
//      „Wintergarten", „Vorraum", „Schlafraum" — und das Wort „Raum" selbst —
//      standen nicht drin. Die Liste ist viermal nachträglich erweitert
//      worden, jedes Mal nach einem Vorfall.
//
//   2. Erkennt die Gruppierung GAR KEINEN Raum, liefert sie null und das
//      Angebot wird flach angezeigt. Bei „Atelier und Salon streichen" war
//      die Raumstruktur damit komplett weg — schlimmer als „Allgemein".
//
//   3. Die Deckengrundierung wurde mit `.find()` gebaut: die erste
//      Deckenposition, ohne Raum im Titel. Bei zwei Räumen entstand EINE
//      Grundierung mit der Fläche des ersten Raums. Der zweite Raum bekam
//      keine — **fehlende bezahlte Arbeit**, versteckt hinter einer
//      Anzeigemeldung. Die Wandgrundierung hatte denselben Fehler; an ihr
//      war am 30.08. (PM-028) nur der Titel repariert worden, nicht das
//      `.find()`.
import { describe, expect, it } from 'vitest'
import { gruppiereNachRaum, raeumeAusQuote } from '../angebot-gruppierung'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import type { BerechnetePosition } from '../mengen/types'

const item = (id: string, title: string, preis = 100) => ({
  id, title, description: null, quantity: 1, unit: 'm²',
  unit_price: preis, total_price: preis, position: Number(id),
})

/** Die 52 Raumnamen aus der Messung vom 13.09.2026. */
const RAUMNAMEN = [
  'Wohnzimmer', 'Schlafzimmer', 'Kinderzimmer', 'Küche', 'Bad', 'Gäste-WC', 'Flur', 'Diele',
  'Keller', 'Arbeitszimmer', 'Esszimmer', 'Gästezimmer', 'Ankleide', 'Ankleidezimmer',
  'Hauswirtschaftsraum', 'Waschküche', 'Wintergarten', 'Atelier', 'Salon', 'Galerie',
  'Windfang', 'Loggia', 'Kammer', 'Speisekammer', 'Sauna', 'Fitnessraum', 'Nähzimmer',
  'Musikzimmer', 'Praxis', 'Empfang', 'Lager', 'Laden', 'Werkstatt', 'Dachgeschoss',
  'Souterrain', 'Schlafraum', 'Studio', 'Vorraum', 'Abstellraum', 'Gästeklo', 'Treppenhaus',
  'Garage', 'Balkon', 'Terrasse', 'Wohnküche', 'Elternschlafzimmer', 'Mädchenzimmer',
  'Zimmer 1', 'Raum 2', 'OG links', '1. OG', 'Erdgeschoss',
]

describe('Ein Raumname ist ein Raumname — auch einer, den niemand vorhergesehen hat', () => {
  it.each(RAUMNAMEN)('„%s" bekommt eine eigene Raumgruppe', name => {
    const g = gruppiereNachRaum([
      item('1', `Wand streichen 2x — ${name}`),
      item('2', 'Wand streichen 2x — Wohnzimmer'),
    ])
    expect(g).not.toBeNull()
    expect(g!.raeume.map(r => r.raumName)).toContain(name)
    expect(g!.allgemein).toHaveLength(0)
  })

  it('verliert nicht die ganze Struktur, wenn kein Name bekannt vorkommt', () => {
    // Der schlimmere der beiden Fälle: Vor der Reparatur gab die Gruppierung
    // hier null zurück — das Angebot wurde flach angezeigt, ohne Räume.
    const g = gruppiereNachRaum([
      item('1', 'Wand streichen 2x — Atelier'),
      item('2', 'Wand streichen 2x — Salon'),
    ])
    expect(g).not.toBeNull()
    expect(g!.raeume).toHaveLength(2)
  })
})

describe('Was KEIN Raum ist, wird auch keiner', () => {
  it.each([
    '2× Anstrich',
    'Schicht 1',
    '1. Anstrich',
    'Q3',
    'groß (>114x118cm)',
    '3x Anstrich (Vollton / Dunkelfarbe)',
    'Klick-System, Standard',
  ])('„%s" ist kein Raum', suffix => {
    // Diese Formen erzeugt die Engine selbst — sie sind abzählbar, im
    // Gegensatz zu den Namen, die sich ein Kunde ausdenkt. Genau deshalb
    // prüft die Regel auf sie und nicht auf Raumwörter.
    const g = gruppiereNachRaum([
      item('1', `Irgendwas — ${suffix}`),
      item('2', 'Wand streichen 2x — Wohnzimmer'),
      item('3', 'Wand streichen 2x — Bad'),
    ])!
    expect(g.raeume.map(r => r.raumName)).toEqual(expect.arrayContaining(['Wohnzimmer', 'Bad']))
    expect(g.raeume.map(r => r.raumName)).not.toContain(suffix)
  })
})

describe('Die Räume des Angebots schlagen jede Regel', () => {
  it('nimmt einen Namen an, den die Formregel ablehnen würde', () => {
    // „Halle 3 (Nord)" hat eine Klammer und sähe aus wie eine Beschreibung.
    // Steht er in `raum_details`, ist er trotzdem ein Raum — der Handwerker
    // hat ihn so genannt.
    const g = gruppiereNachRaum(
      [item('1', 'Wand streichen 2x — Halle 3 (Nord)'), item('2', 'Wand streichen 2x — Wohnzimmer')],
      ['Halle 3 (Nord)'],
    )!
    expect(g.raeume.map(r => r.raumName)).toContain('Halle 3 (Nord)')
    expect(g.allgemein).toHaveLength(0)
  })

  it('liest die Raumnamen defensiv aus dem Angebot', () => {
    expect(raeumeAusQuote({ raum_details: { Atelier: {}, Salon: {} } })).toEqual(['Atelier', 'Salon'])
    // Alte Angebote haben das Feld nicht — dann greift die Formregel.
    expect(raeumeAusQuote(null)).toEqual([])
    expect(raeumeAusQuote({})).toEqual([])
    expect(raeumeAusQuote({ raum_details: 'kaputt' as unknown })).toEqual([])
  })
})

describe('Abgeleitete Positionen behalten ihren Raum — und es gibt sie je Raum', () => {
  const pos = (b: string, m: number): BerechnetePosition =>
    ({ beschreibung: b, menge: m, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${m} m²`, annahmen: [] })

  const zweiRaeume = () => pruefeUndErgaenzeVollstaendigkeit('maler', [
    pos('Wand streichen 2x — Wohnzimmer', 45),
    pos('Decke streichen 2x — Wohnzimmer', 20),
    pos('Wand streichen 2x — Bad', 30),
    pos('Decke streichen 2x — Bad', 10),
  ], 'Wohnzimmer und Bad, Wände und Decken grundieren und zweimal streichen.').positionen

  const grundierungen = (re: RegExp) =>
    zweiRaeume().filter(p => /grundier|voranstrich/i.test(p.beschreibung) && re.test(p.beschreibung))

  it('jeder Raum bekommt seine Deckengrundierung, mit seiner eigenen Fläche', () => {
    // Das ist der eigentliche Fund: Vorher gab es EINE Deckengrundierung für
    // zwei Räume. Die 10 m² im Bad standen in keinem Angebot.
    const decke = grundierungen(/decke/i)
    expect(decke).toHaveLength(2)
    expect(decke.map(p => p.menge).sort((a, b) => a - b)).toEqual([10, 20])
  })

  it('jeder Raum bekommt seine Wandgrundierung, mit seiner eigenen Fläche', () => {
    const wand = grundierungen(/^(?!.*decke)/i)
    expect(wand).toHaveLength(2)
    expect(wand.map(p => p.menge).sort((a, b) => a - b)).toEqual([30, 45])
  })

  it('und beide tragen ihren Raum im Titel', () => {
    // Ohne den Raum im Titel landet die Position unter „Allgemein" — das war
    // Manfreds Meldung. Der Raum steht immer in der Quellposition; er muss
    // beim Ableiten nur mitgenommen werden.
    for (const p of grundierungen(/./)) {
      expect(p.beschreibung, p.beschreibung).toMatch(/ — (Wohnzimmer|Bad)$/)
    }
  })

  it('und landen damit im Raum statt unter Allgemein', () => {
    const items = zweiRaeume().map((p, i) => ({
      id: `i${i}`, title: p.beschreibung, description: null, quantity: p.menge,
      unit: p.einheit, unit_price: 1, total_price: p.menge, position: i,
    }))
    const g = gruppiereNachRaum(items)!
    for (const raum of g.raeume) {
      expect(raum.items.some(i => /grundier|voranstrich/i.test(i.title) && /decke/i.test(i.title)), raum.raumName).toBe(true)
    }
    expect(g.allgemein.some(i => /grundier|voranstrich/i.test(i.title))).toBe(false)
  })
})
