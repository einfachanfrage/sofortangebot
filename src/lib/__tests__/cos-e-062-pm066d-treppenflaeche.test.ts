// PM-066-D — eine Treppe hat keinen Boden zum Verlegen (CoS-E-062, 16.09.2026)
//
// Der Fall: „Treppe, vierzehn Stufen, Vinyl geklebt." Die App legte die
// vierzehn Stufen richtig an (14 × 55,00 = 770,00 €) — und daneben den
// GRUNDRISS der Treppe als Fläche:
//
//   Vinyl-Boden verlegen inkl. 5% Verschnitt — Treppe   3,15 m²   16,00 €  = 50,40 €
//
// Die 3,15 m² sind Länge × Breite des Treppenlaufs plus Verschnitt. Gesagt
// hat sie niemand. Es ist derselbe Doppelbetrag wie bei der Setzstufe (K.4),
// nur in der anderen Einheit — und die Begründung steht in K.4-E vom
// Prüfmeister: *„Der Stückpreis bezahlt die Stufe als Bauteil, nicht ihren
// Grundriss."*
//
// Gebaut in `mengen/gewerke/boden.ts`. Der Schnitt verlangt BEIDE Hälften:
// der Raum ist die Treppe UND im Text steht eine Stufenzahl. Erst dann
// entsteht die Stufenposition, die die Arbeit trägt. Die beiden Gegenproben
// unten halten fest, dass nichts darüber hinaus verschwindet.
//
// Head of Product Engineering · 2026-09-16
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '@/lib/positions-gewerk'
import { ersetzeZahlenWorte } from '../zahlen-parser'
import { TREPPEN_WORT, stufenAnzahlAusText } from '../vollstaendigkeit/boden-sonder'

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk: 'boden_parkett', raeume, transkript } } as never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen('boden_parkett', extraktion)
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meta = { raeume: r2.map((r: any) => ({ name: r.name, hoehe: r.hoehe ?? null })) }
  return pruefeUndErgaenzeVollstaendigkeit('boden_parkett', eng.positionen, text, meta as never, signale as never).positionen
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], m: RegExp) => pos.find(p => m.test(p.beschreibung))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function preis(pos: any[], m: RegExp) {
  const p = finde(pos, m)
  if (!p) return null
  const g = gewerkFuerPosition(p.beschreibung, 'boden_parkett')
  return findePreisposition(p.beschreibung, p.einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))?.position.unit_price ?? null
}

describe('PM-066-D — die Treppe bekommt keine Fläche mehr', () => {
  const TREPPE = () => lauf(
    'Treppe im Haus, vierzehn Stufen, da soll Vinyl drauf geklebt werden.',
    [raum('Treppe', { laenge: 3, breite: 1, arbeiten: ['treppenstufen belegen'], belag: 'Vinyl' })],
  )

  it('die Fläche ist weg — keine Belagszeile in m² für die Treppe', () => {
    // Gemessen vorher: `Vinyl-Boden verlegen inkl. 5% Verschnitt — Treppe`,
    // 3,15 m² × 16,00 € = 50,40 €.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(TREPPE().filter((p: any) => p.einheit === 'm²')).toHaveLength(0)
  })

  it('und die Arbeit steht trotzdem im Angebot — vierzehn Stufen zu 55,00 €', () => {
    // Die Fläche darf nicht verschwinden, ohne dass die Stufen sie tragen.
    const p = TREPPE()
    const stufen = finde(p, /auf Treppenstufen kleben/i)
    expect(stufen?.menge).toBe(14)
    expect(stufen?.einheit).toBe('Stück')
    expect(preis(p, /auf Treppenstufen kleben/i)).toBe(55)
  })

  it('es bleibt bei genau EINER Zeile für die Treppe', () => {
    expect(TREPPE()).toHaveLength(1)
  })

  // ── Gegenprobe 1: ein Treppenhaus mit echter Bodenfläche ────────────────
  //
  // Der Schnitt hängt an der Stufenzahl, nicht am Raumnamen. Wird keine
  // genannt, entsteht in `boden-sonder.ts` auch keine Stufenposition — dann
  // wäre die Fläche das einzige, was die Arbeit trägt, und sie muss bleiben.
  it('Gegenprobe · ein Treppenhaus ohne Stufenzahl behält seine Fläche', () => {
    const p = lauf(
      'Treppenhaus, zwölf Quadratmeter, Laminat verlegen.',
      [raum('Treppenhaus', { flaeche: 12, arbeiten: ['laminat verlegen'], belag: 'Laminat' })],
    )
    expect(finde(p, /Laminat verlegen/i)?.einheit).toBe('m²')
  })

  // ── Gegenprobe 2: der Raum NEBEN der Treppe ─────────────────────────────
  //
  // Die Regel fragt den einzelnen Raum, nicht den Auftrag. Sonst nähme ein
  // Satz über die Treppe dem Wohnzimmer seinen Boden weg.
  it('Gegenprobe · das Wohnzimmer neben der Treppe behält seine Fläche', () => {
    const p = lauf(
      'Wohnzimmer vier mal drei fünfzig, Vinyl verlegen. Die Treppe hat vierzehn Stufen, da soll auch Vinyl drauf.',
      [
        raum('Wohnzimmer', { laenge: 4, breite: 3.5, arbeiten: ['vinyl verlegen'], belag: 'Vinyl' }),
        raum('Treppe', { laenge: 3, breite: 1, arbeiten: ['treppenstufen belegen'], belag: 'Vinyl' }),
      ],
    )
    const flaeche = finde(p, /verlegen.*— Wohnzimmer/i)
    expect(flaeche?.einheit).toBe('m²')
    expect(flaeche?.menge).toBe(14.7) // 4 × 3,50 = 14,00 m² + 5 % Verschnitt
    // und die Treppe daneben bekommt weiterhin keine eigene Fläche
    expect(finde(p, /verlegen.*— Treppe/i)).toBeUndefined()
  })

  // ── Die geteilte Quelle ─────────────────────────────────────────────────
  //
  // Engine und Vollständigkeit müssen dieselbe Frage gleich beantworten.
  // Zwei Kopien des Wortmusters wären der Weg zurück zum Doppelbetrag.
  it('Wortmuster und Stufenzahl kommen aus EINER Quelle', () => {
    expect(TREPPEN_WORT.test('Treppe')).toBe(true)
    expect(TREPPEN_WORT.test('Treppenhaus')).toBe(true)
    expect(TREPPEN_WORT.test('Wohnzimmer')).toBe(false)
    expect(stufenAnzahlAusText(ersetzeZahlenWorte('vierzehn Stufen').toLowerCase())).toBe(14)
    expect(stufenAnzahlAusText('treppe mit 14 stufen')).toBe(14)
    // Ohne Zahl im Text bleibt es bei 0 — dann greift der Schnitt nicht.
    expect(stufenAnzahlAusText('treppenhaus, laminat verlegen')).toBe(0)
  })
})
