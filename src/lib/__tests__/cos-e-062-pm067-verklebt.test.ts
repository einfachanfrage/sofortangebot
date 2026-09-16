// CoS-E-062 · Zug 1 — PM-067-A: „verklebt" steht im Diktat und muss in den Titel
//
// Der Fund des Prüfmeisters (PM-067-A, `pruefmeister-batch-64-68.test.ts`):
// „Der alte Teppich muss raus, verklebt, und entsorgt werden." ergab
// `Teppichboden entfernen und entsorgen` zu 6,00 €/m² — die Katalogzeile für
// den LOSEN Teppich. Verklebt kostet 9,00 €/m²; auf 14 m² sind das 42,00 €
// zu wenig, und auf dem Kundenpapier steht eine andere Arbeit als die
// ausgeführte.
//
// Die Klasse ist nicht der Preis-Matcher, sondern der Titel: Das Merkmal aus
// dem Diktat kommt nicht im Titel an. `pruefeAltbelag` kennt es als
// `hatVerklebt`, der Umbenennungs-Block fragte es nur nicht.
//
// Jede Zusicherung hat hier ihre Kontrolle — derselbe Satz ohne „verklebt".
// Ohne Kontrolle ist ein Fund eine Behauptung.
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
function preis(p: any): number | null {
  const erlaubt = KATALOG.filter(k =>
    preisKategoriePasstZuGewerk(k.category, gewerkFuerPosition(p.beschreibung, 'boden_parkett' as never) as never))
  const z = findePreisposition(p.beschreibung, p.einheit ?? 'm²', erlaubt as never)
  return z ? z.position.unit_price : null
}

const WOHNZIMMER = () => [raum('Wohnzimmer', {
  laenge: 4, breite: 3.5, altbelag_entfernen: true, altbelag_vorhanden: true,
  belag: 'Laminat', arbeiten: ['altbelag entfernen', 'laminat verlegen'],
})]

describe('PM-067-A — der verklebte Teppich trifft seine eigene Katalogzeile', () => {
  const VERKLEBT = 'Wohnzimmer vier mal drei fünfzig. Der alte Teppich muss raus, verklebt, und entsorgt werden. Wir brauchen einen Container, das ist viel Bauschutt.'
  const LOSE = 'Wohnzimmer vier mal drei fünfzig. Der alte Teppich muss raus und entsorgt werden. Wir brauchen einen Container, das ist viel Bauschutt.'

  it('verklebt: der Titel nennt „verklebt"', () => {
    const p = finde(lauf(VERKLEBT, WOHNZIMMER()), /teppichboden.*entfernen/i)
    expect(p?.beschreibung).toMatch(/^Teppichboden verklebt entfernen/)
  })

  it('verklebt: die Position trägt 9,00 €/m² statt 6,00 €', () => {
    const p = finde(lauf(VERKLEBT, WOHNZIMMER()), /teppichboden.*entfernen/i)
    expect(preis(p)).toBe(9)
  })

  it('Kontrolle — ohne „verklebt" bleibt es bei 6,00 €/m²', () => {
    const p = finde(lauf(LOSE, WOHNZIMMER()), /teppichboden.*entfernen/i)
    expect(p?.beschreibung).toMatch(/^Teppichboden entfernen und entsorgen/)
    expect(preis(p)).toBe(6)
  })

  it('die Menge bleibt in beiden Fällen die Rohfläche, 14,00 m²', () => {
    expect(finde(lauf(VERKLEBT, WOHNZIMMER()), /teppichboden.*entfernen/i)?.menge).toBe(14)
    expect(finde(lauf(LOSE, WOHNZIMMER()), /teppichboden.*entfernen/i)?.menge).toBe(14)
  })

  it('der Raumbezug im Titel geht nicht verloren', () => {
    expect(finde(lauf(VERKLEBT, WOHNZIMMER()), /teppichboden.*entfernen/i)?.beschreibung)
      .toMatch(/—\s*Wohnzimmer$/)
  })
})

describe('PM-067-A — die Nachbarbeläge bleiben unberührt', () => {
  it('Laminat behält seinen Titel und seinen Preis', () => {
    const T = 'Wohnzimmer vier mal drei fünfzig. Das alte Laminat muss raus und entsorgt werden.'
    const p = finde(lauf(T, [raum('Wohnzimmer', {
      laenge: 4, breite: 3.5, altbelag_entfernen: true, altbelag_vorhanden: true,
      belag: 'Vinyl', arbeiten: ['altbelag entfernen', 'vinyl verlegen'],
    })]), /laminat demontieren/i)
    expect(p?.beschreibung).toMatch(/^Laminat demontieren und entsorgen/)
    expect(preis(p)).toBe(5)
  })

  it('auch „verklebtes Laminat" bleibt Laminat — die Regel gilt nur für Teppich', () => {
    const T = 'Wohnzimmer vier mal drei fünfzig. Das alte Laminat ist verklebt und muss raus und entsorgt werden.'
    const p = finde(lauf(T, [raum('Wohnzimmer', {
      laenge: 4, breite: 3.5, altbelag_entfernen: true, altbelag_vorhanden: true,
      belag: 'Vinyl', arbeiten: ['altbelag entfernen', 'vinyl verlegen'],
    })]), /laminat demontieren/i)
    expect(p?.beschreibung).toMatch(/^Laminat demontieren und entsorgen/)
  })
})

describe('PM-067-A — die Schablone ist der Katalogwortlaut, nicht ein eigener Satz', () => {
  const erlaubt = KATALOG.filter(k => k.category === 'Boden – Altbelag entfernen')

  it('`Teppichboden verklebt entfernen` steht so im Katalog, zu 9,00 €', () => {
    const z = findePreisposition('Teppichboden verklebt entfernen', 'm²', erlaubt as never)
    expect(z?.position.title).toBe('Teppichboden verklebt entfernen')
    expect(z?.position.unit_price).toBe(9)
  })

  it('das Merkmal angehängt statt eingesetzt findet gar nichts', () => {
    expect(findePreisposition('Teppichboden entfernen und entsorgen (verklebt)', 'm²', erlaubt as never)).toBeNull()
  })
})
