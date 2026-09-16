// CoS-E-062, Zug 1 — PM-066-A/B: der Stufentitel trifft den Katalog
//
// Der Fall: „Treppe, vierzehn Stufen, Vinyl geklebt." Die App erkannte die
// Stückzahl richtig und schrieb `Trittstufen belegen` — ein Titel, den der
// Katalog nicht kennt. 14 Stufen zu 0,00 €, Soll 770,00 €. Dazu legte sie
// eine zweite Zeile `Setzstufen belegen` an, die auf DIESELBE Katalogzeile
// getroffen hätte: 1.540,00 € statt 770,00 €, sobald man ihr einen Preis gibt.
//
// Die Entscheidung dazu ist K.4 (Prüfmeister, 15.09.2026): Die Setzstufe
// steckt im Stückpreis, die zweite Zeile muss weg. Es bleibt bei 770,00 €.
//
// Gebaut in `vollstaendigkeit/boden-sonder.ts`, `pruefeTreppenBoden()`:
//   1. Der Titel kommt aus einer je Belag gemessenen Tabelle
//      (`stufenTitelFuerBelag`), nicht aus zusammengesetztem Text.
//   2. Der `Setzstufen`-Block ist ersatzlos entfernt.
//
// Head of Product Engineering · 16.09.2026
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { stufenTitelFuerBelag } from '../vollstaendigkeit/boden-sonder'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '@/lib/positions-gewerk'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ersetzeZahlenWorte } from '../zahlen-parser'

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
const katalogPreis = (titel: string) => DEFAULT_PRICES.find(p => p.title === titel)?.unit_price ?? null

const treppe = (belag: string, satz: string) =>
  lauf(`Treppenhaus, vierzehn Stufen, ${satz}`, [raum('Treppe', { laenge: 3, breite: 1, arbeiten: ['treppenstufen belegen'], belag })])

describe('PM-066-A — die vierzehn Stufen finden ihren Preis', () => {
  const pos = () => treppe('Vinyl', 'da soll Vinyl drauf geklebt werden.')

  it('der Titel ist der Katalogwortlaut, nicht `Trittstufen belegen`', () => {
    expect(finde(pos(), /^Vinyl auf Treppenstufen kleben$/)).toBeDefined()
    expect(finde(pos(), /Trittstufen belegen/i)).toBeUndefined()
  })

  it('vierzehn Stück zu 55,00 € — das sind die 770,00 € aus dem Soll', () => {
    const p = pos()
    const stufe = finde(p, /auf Treppenstufen kleben/i)
    expect(stufe?.menge).toBe(14)
    expect(stufe?.einheit).toBe('Stück')
    expect(preis(p, /auf Treppenstufen kleben/i)).toBe(55)
    expect((stufe?.menge ?? 0) * (preis(p, /auf Treppenstufen kleben/i) ?? 0)).toBe(770)
  })

  it('PM-066-B / K.4 · die Setzstufe bekommt keine zweite Zeile', () => {
    // Beide Titel träfen dieselbe Katalogzeile — die zweite Zeile wäre die
    // Doppelberechnung, nicht die fehlende Position.
    expect(finde(pos(), /setzstufe/i)).toBeUndefined()
    expect(pos().filter(p => /Treppenstufen|Trittstufen|Setzstufen/i.test(p.beschreibung))).toHaveLength(1)
  })

  it('PM-066-C bleibt heil — die Treppennase steht weiter mit 22,00 € da', () => {
    const p = treppe('Vinyl', 'Vinyl geklebt, Treppennase brauchen wir auch.')
    expect(preis(p, /Treppennase|Kantenprofil/i)).toBe(22)
  })
})

describe('PM-066-A — jeder Belag trifft SEINE Katalogzeile, nicht die des Laminats', () => {
  // Die Gegenprobe zur naheliegenden Bauart: Ein zusammengesetzter Titel aus
  // `erkenneBelagName` hätte Teppich, Parkett und Kork auf die LAMINAT-Zeile
  // geschickt — 0,67 Trefferwert, 48,00 €, falscher Preis unter richtig
  // klingendem Titel.
  it('Laminat → 48,00 €', () => {
    expect(preis(treppe('Laminat', 'Laminat drauf.'), /auf Treppenstufen/i)).toBe(48)
    expect(finde(treppe('Laminat', 'Laminat drauf.'), /^Laminat auf Treppenstufen verlegen$/)).toBeDefined()
  })

  it('Teppichboden → 48,00 € aus der TEPPICH-Zeile, nicht aus der Laminat-Zeile', () => {
    const p = treppe('Teppichboden', 'Teppichboden drauf.')
    expect(finde(p, /^Teppich auf Treppenstufen verlegen$/)).toBeDefined()
    expect(preis(p, /auf Treppenstufen/i)).toBe(katalogPreis('Teppich auf Treppenstufen verlegen'))
  })

  it('Linoleum → 58,00 €', () => {
    const p = treppe('Linoleum', 'Linoleum drauf.')
    expect(preis(p, /auf Treppenstufen/i)).toBe(58)
  })

  it('Parkett hat keine eigene Stufenzeile → die belagsoffene Zeile, 45,00 €', () => {
    // Und ausdrücklich NICHT die 48,00 € des Laminats.
    const p = treppe('Parkett', 'Fertigparkett drauf.')
    expect(finde(p, /^Treppenstufe mit Belag belegen/)).toBeDefined()
    expect(preis(p, /Treppenstufe mit Belag belegen/)).toBe(45)
    expect(preis(p, /Treppenstufe mit Belag belegen/)).not.toBe(48)
  })
})

describe('PM-066-A — die Tabelle selbst, gegen den Katalog', () => {
  it('jeder Titel aus `stufenTitelFuerBelag` steht wörtlich im Katalog', () => {
    for (const belag of ['vinyl', 'laminat', 'linoleum', 'teppich', 'parkett', 'kork', null]) {
      const titel = stufenTitelFuerBelag(belag)
      expect(katalogPreis(titel), `${belag} → ${titel}`).not.toBeNull()
    }
  })

  it('Kontrolle: der alte Titel `Trittstufen belegen` trifft den Katalog bis heute nicht', () => {
    // Steht hier, damit niemand ihn versehentlich zurückbaut.
    expect(findePreisposition('Trittstufen belegen', 'Stück', KATALOG)).toBeNull()
    expect(findePreisposition('Setzstufen belegen', 'Stück', KATALOG)).toBeNull()
  })

  it('Kontrolle: der naive Titel aus `erkenneBelagName` läge beim Teppich falsch', () => {
    // 0,67 Trefferwert auf die Laminat-Zeile. Genau dieser Weg ist NICHT
    // gebaut, und die Zeile hält fest, warum.
    const z = findePreisposition('Teppichboden auf Treppenstufen verlegen', 'Stück', KATALOG)
    expect(z?.position.title).toBe('Laminat auf Treppenstufen verlegen')
  })
})

describe('PM-066-A — was ausdrücklich NICHT mitgebaut wurde', () => {
  it.fails('🔴 offen · die VERKLEIDETE Treppe findet weiter keinen Preis', () => {
    // `Trittstufen Vinyl-Boden verkleiden` trifft im Katalog nichts (gemessen).
    // Der Bodenkatalog kennt für die Treppe nur „kleben" und „verlegen".
    // Ob das Verkleiden dieselbe Leistung ist oder eine eigene Zeile braucht,
    // ist eine Katalogfrage — die entscheidet der Prüfmeister, nicht wir.
    // Bis dahin bleibt der Zweig unverändert, und diese Sperrklinke hält den
    // Punkt sichtbar.
    const p = treppe('Vinyl', 'die Treppe soll mit Vinyl verkleidet werden.')
    expect(preis(p, /verkleiden/i)).toBeGreaterThan(0)
  })

  it('✅ PM-066-D · die Treppe bekommt KEINEN Grundriss als Fläche mehr', () => {
    // Gebaut am 16.09.2026 (CoS-E-062, Zug 1 Abschluss) in
    // `mengen/gewerke/boden.ts`: Trägt die Stufe den Belag, entsteht für
    // denselben Raum keine Belagsfläche mehr. Sperrklinke → Zusicherung.
    // Gemessen war `Vinyl-Boden verlegen inkl. 5% Verschnitt — Treppe`,
    // 3,15 m² × 16,00 € = 50,40 € neben den 770,00 € der vierzehn Stufen.
    const p = treppe('Vinyl', 'da soll Vinyl drauf geklebt werden.')
    expect(finde(p, /Vinyl-Boden verlegen/i)).toBeUndefined()
  })
})
