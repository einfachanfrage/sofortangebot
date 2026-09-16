// CoS-E-062 · Zug 1 — PM-066-C: die Treppennase ist gesagt und entsteht nicht
//
// Der Fund des Prüfmeisters (PM-066-C, `pruefmeister-batch-64-68.test.ts`):
// „Treppennase brauchen wir auch." steht wörtlich im Diktat, der Katalog führt
// die Zeile wörtlich `Treppennase / Kantenprofil Treppe montieren` zu
// 22,00 €/Stück — im Angebot stand nichts.
//
// Gemessen kam ein zweiter Teil dazu, den niemand gemeldet hatte: Der Titel,
// den `pruefeTreppenBoden` bisher gesetzt hätte (`Treppenkantenprofil`, bzw.
// `Treppenkantenprofil Alu rutschhemmend`), trifft KEINE Katalogzeile. Die
// Position wäre also auch dann mit 0,00 € im Angebot gelandet — dieselbe
// Fehlerform wie PM-066-A. Beide Hälften stecken in denselben vier Zeilen,
// deshalb sind sie hier zusammen abgesichert.
//
// Jede Zusicherung hat ihre Kontrolle. Ohne Kontrolle ist ein Fund eine
// Behauptung.
//
// Head of Product Engineering · 16.09.2026
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '../positions-gewerk'
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
  const gewerk = 'boden_parkett'
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk, raeume, transkript } } as never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen(gewerk, extraktion)
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
  return pruefeUndErgaenzeVollstaendigkeit(gewerk, eng.positionen, text, meta as never, signale as never).positionen
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], re: RegExp) => pos.find(p => re.test(p.beschreibung))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function preis(p: any, einheit = 'm²'): number | null {
  const erlaubt = KATALOG.filter(k =>
    preisKategoriePasstZuGewerk(k.category, gewerkFuerPosition(p.beschreibung, 'boden_parkett' as never) as never))
  const z = findePreisposition(p.beschreibung, p.einheit ?? einheit, erlaubt as never)
  return z ? z.position.unit_price : null
}


const TREPPE = () => [raum('Treppe', { laenge: 3, breite: 1, arbeiten: ['treppenstufen belegen'], belag: 'Vinyl' })]
const STUFEN = 'Treppe im Haus, vierzehn Stufen, da soll Vinyl drauf geklebt werden.'

describe('PM-066-C — „Treppennase" löst aus und trifft den Katalog', () => {
  const MIT = `${STUFEN} Treppennase brauchen wir auch.`
  const OHNE = STUFEN

  it('die Position entsteht überhaupt', () => {
    expect(finde(lauf(MIT, TREPPE()), /treppennase|kantenprofil/i)).toBeTruthy()
  })

  it('sie trägt den Katalogwortlaut und 22,00 €/Stück', () => {
    const p = finde(lauf(MIT, TREPPE()), /treppennase|kantenprofil/i)
    expect(p?.beschreibung).toBe('Treppennase / Kantenprofil Treppe montieren')
    expect(preis(p, 'Stück')).toBe(22)
  })

  it('je Stufe eine — 14 Stück', () => {
    expect(finde(lauf(MIT, TREPPE()), /treppennase|kantenprofil/i)?.menge).toBe(14)
  })

  it('Kontrolle — ohne das Wort entsteht keine Treppennase', () => {
    expect(finde(lauf(OHNE, TREPPE()), /treppennase|kantenprofil/i)).toBeUndefined()
  })
})

describe('PM-066-C — die bisherigen Auslöser bleiben, und sie tragen jetzt einen Preis', () => {
  it('„Kantenprofil" löst weiter aus, jetzt zu 22,00 €', () => {
    const T = `${STUFEN} Ein Kantenprofil soll auch drauf.`
    const p = finde(lauf(T, TREPPE()), /treppennase|kantenprofil/i)
    expect(p?.beschreibung).toBe('Treppennase / Kantenprofil Treppe montieren')
    expect(preis(p, 'Stück')).toBe(22)
  })

  it('„Alu" bleibt auf dem Kundenpapier stehen — und findet trotzdem den Preis', () => {
    const T = `${STUFEN} Da kommt ein Alu-Kantenprofil drauf, rutschhemmend.`
    const p = finde(lauf(T, TREPPE()), /treppennase|kantenprofil/i)
    expect(p?.beschreibung).toMatch(/^Treppennase \/ Kantenprofil Treppe montieren — Alu, rutschhemmend/)
    expect(preis(p, 'Stück')).toBe(22)
  })

  it('es entsteht keine zweite Zeile, wenn beide Wörter fallen', () => {
    const T = `${STUFEN} Treppennase brauchen wir auch, also ein Kantenprofil.`
    const treffer = lauf(T, TREPPE()).filter((p: { beschreibung: string }) => /treppennase|kantenprofil/i.test(p.beschreibung))
    expect(treffer).toHaveLength(1)
  })
})

describe('PM-066-C — warum es genau dieser Wortlaut ist', () => {
  const erlaubt = KATALOG.filter(k => k.category === 'Boden – Abschlussarbeiten')

  it('der Katalog führt die Zeile wörtlich, zu 22,00 €', () => {
    const z = findePreisposition('Treppennase / Kantenprofil Treppe montieren', 'Stück', erlaubt as never)
    expect(z?.position.title).toBe('Treppennase / Kantenprofil Treppe montieren')
    expect(z?.position.unit_price).toBe(22)
  })

  it('der alte Titel `Treppenkantenprofil` findet gar nichts — deshalb der Wechsel', () => {
    expect(findePreisposition('Treppenkantenprofil', 'Stück', erlaubt as never)).toBeNull()
    expect(findePreisposition('Treppenkantenprofil Alu rutschhemmend', 'Stück', erlaubt as never)).toBeNull()
  })
})
