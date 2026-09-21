// ═══════════════════════════════════════════════════════════════════════════
// CoS-E-085 · PM-079-A / PM-079-B — der Isoliergrund gehört auf ALLE
// betroffenen Räume, und nur auf die betroffenen
// ═══════════════════════════════════════════════════════════════════════════
//
// Der Fund des Prüfmeisters (15.09., nachgemessen 16.09. und 17.09.):
// `pruefeWasserflecken()` sucht die Wand- und die Deckenposition mit
// `find` — das nimmt die ERSTE und führt den Raumbezug des Auslösersatzes
// nicht mit. Zwei Wirkungen aus einer Zeile:
//
//   PM-079-A  zwei verrauchte Räume → der Isoliergrund steht nur auf dem
//             ersten. 47,00 m² × 9,00 €/m² = 423,00 € fehlen auf dem
//             Angebot (live gemessen an Fall 8 sogar 463,50 €).
//   PM-079-B  ist NUR der zweite Raum verraucht, steht der Isoliergrund
//             trotzdem auf den Flächen des ersten — nicht bloß zu wenig,
//             sondern auf dem FALSCHEN Raum. Der Handwerker sperrt ein
//             Zimmer, das keinen Sperrgrund braucht, und lässt ihn dort
//             weg, wo er nötig ist.
//
// Die Sperrklinken PM-079-A/B stehen in `pruefmeister-batch-79-88.test.ts`
// (Datei des Prüfmeisters). Diese Zusicherungen hier sind meine eigenen:
// ein Fix, dessen einziger Nachweis in einer fremden Datei hängt, ist
// nicht abgesichert.
//
// Zu jedem Fund steht eine Kontrolle daneben. Ohne Kontrolle ist ein Fund
// eine Behauptung.

import { describe, it, expect } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { DEFAULT_PRICES } from '../default-prices'
import { kundenRechenweg } from '../rechenweg-kundentext'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ersetzeZahlenWorte } from '../zahlen-parser'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk: 'maler', raeume, transkript } } as never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen('maler', extraktion)
  const r2 = extraktion.raeume ?? raeume
  const text = ersetzeZahlenWorte(transkript)
  const signale = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arbeitenTexte: r2.flatMap((r: any) => r.arbeiten ?? []),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    belagText: r2.find((r: any) => r.belag)?.belag ?? null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    altbelagEntfernen: r2.some((r: any) => r.altbelag_entfernen === true),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeume: r2.map((r: any) => ({ name: r.name, arbeiten: r.arbeiten ?? [] })),
  }
  const meta = {
    fensterAnzahl: zaehleFenster(text) || undefined,
    tuerenAnzahl: zaehleTueren(text) || undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeume: r2.map((r: any) => ({ name: r.name, hoehe: r.hoehe ?? null })),
  }
  return pruefeUndErgaenzeVollstaendigkeit('maler', eng.positionen, text, meta as never, signale as never).positionen
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iso = (pos: any[]) => pos.find(p => /Isoliergrund/.test(p.beschreibung))
const malerRaum = (name: string, l: number, b: number, h = 2.5) =>
  raum(name, { laenge: l, breite: b, hoehe: h, arbeiten: ['wände streichen', 'decke streichen'] })

const WOHNEN_SCHLAFEN = [malerRaum('Wohnzimmer', 4, 5), malerRaum('Schlafzimmer', 3, 4)]
// Wohnzimmer: Wand 45,00 m² + Decke 20,00 m² = 65,00 m²
// Schlafzimmer: Wand 35,00 m² + Decke 12,00 m² = 47,00 m²

describe('CoS-E-085 · Isoliergrund über alle betroffenen Räume', () => {

  it('E-085-1 · PM-079-A: beide verrauchten Räume tragen den Isoliergrund', () => {
    const t =
      'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen, alles verraucht, da muss Sperrgrund drauf. '
      + 'Schlafzimmer drei mal vier, Höhe zwo fünfzig, Wände und Decke streichen, auch verraucht.'
    const p = iso(lauf(t, WOHNEN_SCHLAFEN))
    expect(p).toBeDefined()
    // 45 + 20 + 35 + 12 = 112,00 m². Vor dem Bau: 65,00 m² —
    // 47,00 m² × 9,00 €/m² = 423,00 € zu wenig.
    expect(p!.menge).toBe(112)
  })

  it('E-085-2 · PM-079-B: ist nur der zweite Raum verraucht, steht der Isoliergrund auf DIESEM Raum', () => {
    const t =
      'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen. '
      + 'Schlafzimmer drei mal vier, Höhe zwo fünfzig, Wände und Decke streichen, total verraucht, da muss Sperrgrund drauf.'
    const p = iso(lauf(t, WOHNEN_SCHLAFEN))
    expect(p).toBeDefined()
    // Schlafzimmer allein: 35 + 12 = 47,00 m². Vor dem Bau: 65,00 m² —
    // die Flächen des Wohnzimmers, das keinen Sperrgrund braucht.
    expect(p!.menge).toBe(47)
  })

  it('E-085-3 · der Rechenweg nennt den Raum, damit der Handwerker sieht WO gesperrt wird', () => {
    const t =
      'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen. '
      + 'Schlafzimmer drei mal vier, Höhe zwo fünfzig, Wände und Decke streichen, total verraucht, da muss Sperrgrund drauf.'
    const p = iso(lauf(t, WOHNEN_SCHLAFEN))
    expect(p).toBeDefined()
    expect(p!.berechnungsweg).toContain('Schlafzimmer')
    expect(p!.berechnungsweg).not.toContain('Wohnzimmer')
  })

  it('E-085-4 · Kontrolle: bei EINEM Raum bleibt alles wie bisher — 65,00 m²', () => {
    const p = iso(lauf(
      'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen, alles verraucht, da muss Sperrgrund drauf.',
      [malerRaum('Wohnzimmer', 4, 5)]))
    expect(p).toBeDefined()
    expect(p!.menge).toBe(65)
    expect(p!.berechnungsweg).toBe('Wandfläche 45 m² + Deckenfläche 20 m²')
  })

  it('E-085-5 · Kontrolle: der unbetroffene dritte Raum bleibt draußen', () => {
    const t =
      'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen, alles verraucht, da muss Sperrgrund drauf. '
      + 'Schlafzimmer drei mal vier, Höhe zwo fünfzig, Wände und Decke streichen, auch verraucht. '
      + 'Flur zwei mal drei, Höhe zwo fünfzig, Wände und Decke streichen.'
    const p = iso(lauf(t, [...WOHNEN_SCHLAFEN, malerRaum('Flur', 2, 3)]))
    expect(p).toBeDefined()
    // Flur (Wand 25,00 + Decke 6,00 = 31,00 m²) ist nicht verraucht und
    // zählt nicht mit. 112,00 m² bleiben 112,00 m².
    expect(p!.menge).toBe(112)
    expect(p!.berechnungsweg).not.toContain('Flur')
  })

  it('E-085-6 · Kontrolle: ohne Auslösewort entsteht weiter KEINE bepreiste Zeile', () => {
    // PM-080 ist ein eigener, offener Punkt (die Ursachenwörter fehlen im
    // Auslöser). Dieser Bau ändert daran nichts — festgehalten, damit die
    // Änderung nicht still eine fremde Entscheidung mitnimmt.
    const t = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen, alles verraucht.'
    expect(iso(lauf(t, [malerRaum('Wohnzimmer', 4, 5)]))).toBeUndefined()
  })

  it('E-085-8 · der Live-Fall vom 17.09. (Fall 8): 116,50 m², die vollen 463,50 €', () => {
    // Sandys Zwei-Raum-Fall, wie der Prüfmeister ihn hinterlegt hat
    // (`pruefmeister-batch-47-56.test.ts`). Hier nennt der Auslösersatz
    // KEINEN Raum — dann gilt das ganze Angebot, wie bisher, nur eben
    // vollständig. Wohnzimmer 45 + 20, Schlafzimmer 37,50 + 14.
    // Vor dem Bau: 65,00 m² — 51,50 m² × 9,00 €/m² = 463,50 € zu wenig.
    const t =
      'Wohnzimmer fünf mal vier und Schlafzimmer vier mal drei Komma fünf, beide zwo fünfzig hoch. '
      + 'Wände und Decken streichen, alles verraucht, da muss Sperrgrund drauf.'
    const p = iso(lauf(t, [malerRaum('Wohnzimmer', 5, 4), malerRaum('Schlafzimmer', 4, 3.5)]))
    expect(p).toBeDefined()
    expect(p!.menge).toBe(116.5)
  })

  it('E-085-9 · der Raumname übersteht den Filter fürs Kundenpapier', () => {
    // Zwischen Fallbasis und Kundenblatt liegt `kundenRechenweg()`
    // (CoS-E-086 / DC-107): Herkunftswörter fallen dort weg. Der Raumname
    // ist keine Herkunft, sondern Teil der Rechnung — gemessen, nicht
    // angenommen, weil der Rechenweg auf dem Kundenpapier das Beweisstück ist.
    const t =
      'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen, alles verraucht, da muss Sperrgrund drauf. '
      + 'Schlafzimmer drei mal vier, Höhe zwo fünfzig, Wände und Decke streichen, auch verraucht.'
    const p = iso(lauf(t, WOHNEN_SCHLAFEN))
    expect(p).toBeDefined()
    expect(kundenRechenweg(p!.berechnungsweg)).toBe(
      'Wandfläche Wohnzimmer 45 m² + Wandfläche Schlafzimmer 35 m² + Deckenfläche Wohnzimmer 20 m² + Deckenfläche Schlafzimmer 12 m²')
  })

  it('E-085-7 · Kontrolle: der Katalogpreis von 9,00 €/m² hängt weiter am Titel', () => {
    const p = iso(lauf(
      'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen, alles verraucht, da muss Sperrgrund drauf.',
      [malerRaum('Wohnzimmer', 4, 5)]))
    expect(p).toBeDefined()
    expect(DEFAULT_PRICES.find(k => k.title === p!.beschreibung)?.unit_price).toBe(9)
  })
})
