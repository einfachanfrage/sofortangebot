// ══════════════════════════════════════════════════════════════════════════
// Zug 2 · die Tapezier-Nische — gesagt, im Katalog vorhanden, jetzt auch im
// Angebot
// ══════════════════════════════════════════════════════════════════════════
//
// Der Befund (Prüfmeister, 17.09.2026, Punkt 5): Eine Nische in einem
// TAPEZIER-Diktat hinterlässt keine Spur — nicht in den Positionen, nicht in
// der Fehlt-Liste. Vor dem Bau hier nachgemessen und bestätigt.
//
// Seine Fachentscheidung: `2 × (Breite + Höhe)` der Nischenöffnung, in lfdm,
// auf `Ecken / Nischen / Laibungen tapezieren (Aufpreis)`, 6,00 €/lfdm. Vier
// Seiten, weil eine Nische keine Fensterbank hat (Gegenstück zur
// dreiseitigen Fensterlaibung aus PM-037 / VOB-013). Die Tiefe geht nicht
// ein — die Katalogzeile steht in lfdm, der Aufpreis gilt der Kante.
//
// Seine zwei Auflagen sind die Zusicherungen 4 und 2:
//   1. Ohne beide Maße keine bepreiste Position, sondern der Fehlt-Eintrag.
//   2. Gegenprobe: derselbe Satz ohne Nische bekommt keine lfdm-Zeile.
//
// Aufbau wie `pruefmeister-batch-104-116.test.ts`: über die Pipeline, Text
// einmal am Eingang normalisiert (K.2). Zu jedem Fund die Gegenprobe daneben.
//
// Head of Product Engineering · 17.09.2026
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '@/lib/positions-gewerk'
import { raumAusTitel } from '@/lib/positions-titel'
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
function laufVoll(gewerk: 'maler', transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk, raeume, transkript } } as never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen(gewerk, extraktion)
  const r2 = extraktion.raeume ?? raeume
  const text = ersetzeZahlenWorte(transkript)
  const signale = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arbeitenTexte: r2.flatMap((r: any) => r.arbeiten ?? []),
    belagText: null,
    altbelagEntfernen: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeume: r2.map((r: any) => ({ name: r.name, arbeiten: r.arbeiten ?? [] })),
  }
  const meta = {
    fensterAnzahl: zaehleFenster(text) || undefined,
    tuerenAnzahl: zaehleTueren(text) || undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeume: r2.map((r: any) => ({ name: r.name, hoehe: r.hoehe ?? null })),
  }
  return pruefeUndErgaenzeVollstaendigkeit(gewerk, eng.positionen, text, meta as never, signale as never)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], m: RegExp) => pos.find(p => m.test(p.beschreibung))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const titel = (pos: any[]) => pos.map(p => p.beschreibung)
const fehltHat = (f: string[], m: RegExp) => f.some(x => m.test(x))

const WZ = () => [raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.5, arbeiten: ['wände tapezieren'] })]
const T_OHNE = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Die Wände mit Raufaser tapezieren.'
const T_MIT = T_OHNE + ' In der Wand ist eine Regalnische, ein Meter zwanzig breit und achtzig hoch, die wird mittapeziert.'

const KATALOGZEILE = 'Ecken / Nischen / Laibungen tapezieren (Aufpreis)'

describe('Zug 2 · Tapezier-Nische', () => {
  it('1 · die Zeile entsteht — der Satz verschwindet nicht mehr spurlos', () => {
    const z = finde(laufVoll('maler', T_MIT, WZ()).positionen, /Nischen/)
    expect(z, 'Nischenzeile').toBeDefined()
  })

  it('2 · ⚠️ Auflage 2 des Prüfmeisters — die Gegenprobe: ohne Nische keine lfdm-Zeile', () => {
    const erg = laufVoll('maler', T_OHNE, WZ())
    expect(finde(erg.positionen, /Nisch|Laibung/)).toBeUndefined()
    expect(erg.fehlende.filter(f => /Nisch|Laibung/i.test(f))).toHaveLength(0)
  })

  it('3 · die Menge ist der Umfang der Öffnung: 2 × (1,20 + 0,80) = 4,00 lfdm', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const z = finde(laufVoll('maler', T_MIT, WZ()).positionen, /Nischen/) as any
    expect(z.einheit).toBe('lfdm')
    expect(z.menge).toBe(4)
    expect(z.berechnungsweg).toContain('2 × (1,20 + 0,80)')
  })

  it('4 · ⚠️ Auflage 1 des Prüfmeisters — ohne Höhe wird nicht gerechnet, sondern gefragt', () => {
    // Der häufigere Fall, nicht der Randfall: die Diktate nennen fast immer
    // nur die Breite. Eine Zahl daraus wäre geraten.
    const t = T_OHNE + ' In der Wand ist eine Regalnische, ein Meter zwanzig breit, die wird mittapeziert.'
    const erg = laufVoll('maler', t, WZ())
    expect(finde(erg.positionen, /Nischen/), 'keine geratene Menge').toBeUndefined()
    expect(fehltHat(erg.fehlende, /Nischen \/ Laibungen tapezieren/), 'stattdessen gefragt').toBe(true)
  })

  it('5 · das Beispiel des Prüfmeisters, 1,00 × 2,00 m → 6,00 lfdm → 36,00 €', () => {
    // Seine Rechnung wörtlich: 2 × (1,00 + 2,00) = 6,00 lfdm × 6,00 €/lfdm.
    // Und zugleich die Sprechweise aus PM-108 („ein mal zwei Meter").
    const t = T_OHNE + ' In der Wand ist eine Regalnische, ein mal zwei Meter, die wird mittapeziert.'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const z = finde(laufVoll('maler', t, WZ()).positionen, /Nischen/) as any
    expect(z.menge).toBe(6)
    const g = gewerkFuerPosition(z.beschreibung, 'maler')
    const treffer = findePreisposition(z.beschreibung, z.einheit,
      KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))
    expect(treffer?.position.unit_price).toBe(6)
    expect(z.menge * (treffer?.position.unit_price ?? 0)).toBe(36)
  })

  it('6 · 🔴 der Titel findet seinen Preis — keine 0,00-€-Zeile (PM-066)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const z = finde(laufVoll('maler', T_MIT, WZ()).positionen, /Nischen/) as any
    const g = gewerkFuerPosition(z.beschreibung, 'maler')
    expect(g, 'Gewerk der Nischenzeile').toBe('maler')
    const treffer = findePreisposition(z.beschreibung, z.einheit,
      KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))
    expect(treffer?.position.title).toBe(KATALOGZEILE)
    expect(treffer?.position.unit).toBe('lfdm')
    expect(treffer?.position.unit_price).toBe(6)
  })

  it('7 · auch der Fehlt-Eintrag trifft die Katalogzeile — die Platzhalter-Zeile aus PM-010 bleibt bepreisbar', () => {
    // `mehrgewerk.ts` macht aus jedem Fehlt-Eintrag ohne „⚠ " eine Zeile mit
    // Menge 0. Trägt der Betrieb die lfdm nach, muss der Preis greifen —
    // sonst ist der Fehlt-Eintrag eine Sackgasse statt einer Frage.
    const t = T_OHNE + ' In der Wand ist eine Regalnische, ein Meter zwanzig breit, die wird mittapeziert.'
    const eintrag = laufVoll('maler', t, WZ()).fehlende.find(f => /Nischen/.test(f))!
    expect(eintrag.startsWith('⚠ '), 'kein Hinweis, sondern eine Leistung mit offener Menge').toBe(false)
    const g = gewerkFuerPosition(eintrag, 'maler')
    const treffer = findePreisposition(eintrag, 'lfdm',
      KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))
    expect(treffer?.position.unit_price).toBe(6)
  })

  it('8 · der Raum hängt hinter dem einzigen Gedankenstrich — nicht der Zusatz', () => {
    // `raumAusTitel` liest alles nach dem ersten „ — " als Raumnamen. Ein
    // erklärender Nachsatz dort würde die Zeile unter einem erfundenen Raum
    // einsortieren (die Falle aus dem Dachschrägen-Audit).
    const t = T_OHNE + ' In der Wand ist eine Regalnische, ein Meter zwanzig breit, die wird mittapeziert.'
    const erg = laufVoll('maler', t, WZ())
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const z = finde(laufVoll('maler', T_MIT, WZ()).positionen, /Nischen/) as any
    expect(raumAusTitel(z.beschreibung)).toBe('Wohnzimmer')
    expect(raumAusTitel(erg.fehlende.find(f => /Nischen/.test(f))!)).toBe('Wohnzimmer')
  })

  it('9 · die Zeile ist diktiert, nicht ergänzt (PM-023 / PM-077, Regel H Satz 3)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const z = finde(laufVoll('maler', T_MIT, WZ()).positionen, /Nischen/) as any
    expect(z.automatisch_ergaenzt).toBe(false)
  })

  it('10 · Ziffern, Meter und Zentimeter im selben Satz', () => {
    const t = T_OHNE + ' Da ist eine Nische, 1,20 m breit und 80 cm hoch, die wird mit tapeziert.'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const z = finde(laufVoll('maler', t, WZ()).positionen, /Nischen/) as any
    expect(z.menge).toBe(4)
  })

  it('11 · „achtzig hoch" ist 0,80 m, nicht 80 m — die Plausibilität entscheidet, nicht eine Annahme', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const z = finde(laufVoll('maler', T_MIT, WZ()).positionen, /Nischen/) as any
    expect(z.berechnungsweg).toContain('0,80 m')
    expect(z.menge).toBeLessThan(10)
  })

  it('12 · die Raummaße aus demselben Diktat werden nicht eingesammelt', () => {
    // „vier mal fünf" steht im Transkript. Käme es durch, stünden 18 lfdm
    // statt 4 auf dem Papier.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const z = finde(laufVoll('maler', T_MIT, WZ()).positionen, /Nischen/) as any
    expect(z.menge).toBe(4)
  })

  it('13 · genannt, aber nicht beauftragt — „bleibt, wie sie ist" erzeugt nichts', () => {
    const t = T_OHNE + ' Die Regalnische in der Wand bleibt, wie sie ist.'
    const erg = laufVoll('maler', t, WZ())
    expect(finde(erg.positionen, /Nischen/)).toBeUndefined()
    expect(erg.fehlende.filter(f => /Nischen/.test(f))).toHaveLength(0)
    expect(titel(erg.positionen)).toEqual(titel(laufVoll('maler', T_OHNE, WZ()).positionen))
  })

  it('14 · Mehrzahl bekommt keinen Preis, sondern eine Frage', () => {
    // Ein Maß auf mehrere Nischen zu übertragen hieße anzunehmen, dass sie
    // gleich groß sind. Bewusst nicht gebaut, Frage liegt beim Prüfmeister.
    const t = T_OHNE + ' Da sind zwei Regalnischen, je ein Meter zwanzig breit und achtzig hoch, die werden mittapeziert.'
    const erg = laufVoll('maler', t, WZ())
    expect(finde(erg.positionen, /Nischen \/ Laibungen/), 'keine geratene Menge').toBeUndefined()
    expect(fehltHat(erg.fehlende, /Nischen \/ Laibungen tapezieren/)).toBe(true)
  })

  it('15 · „nische" ist ein Wort, kein Wortstamm — sechs harmlose Sätze', () => {
    for (const wort of ['technische', 'mechanische', 'elektronische', 'hygienische', 'spanische', 'botanische']) {
      const t = `${T_OHNE} Das ist eine ${wort} Raufaser.`
      const erg = laufVoll('maler', t, WZ())
      expect(finde(erg.positionen, /Nisch|Laibung/), wort).toBeUndefined()
      expect(erg.fehlende.filter(f => /Nisch|Laibung/i.test(f)), wort).toHaveLength(0)
    }
  })

  it('16 · die Zeile entsteht genau einmal, auch wenn die Nische zweimal vorkommt', () => {
    const t = T_MIT + ' Die Nische muss sauber tapeziert werden.'
    const treffer = laufVoll('maler', t, WZ()).positionen.filter(p => /Nischen/.test(p.beschreibung ?? ''))
    expect(treffer).toHaveLength(1)
  })

  it('17 · der Streich-Fall bleibt beim Fehlt-Eintrag — PM-089 / PM-108 unberührt', () => {
    // Die beiden Regeln lesen dieselbe Nische; der Katalog entscheidet, welche
    // zuständig ist. Wo gestrichen und nicht tapeziert wird, gilt weiter die
    // Kataloglücke.
    const t = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Wände streichen. In der Wand ist eine Regalnische, ein mal zwei Meter, die wird mitgestrichen.'
    const erg = laufVoll('maler', t, [raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.5, arbeiten: ['wände streichen'] })])
    expect(finde(erg.positionen, /Laibungen tapezieren/), 'keine Tapezierzeile ohne Tapezierauftrag').toBeUndefined()
    expect(fehltHat(erg.fehlende, /Nische streichen/), 'der Fehlt-Eintrag aus PM-089 steht weiter').toBe(true)
  })

  it('18 · die übrigen Positionen bewegen sich nicht', () => {
    const ohne = laufVoll('maler', T_OHNE, WZ()).positionen
    const mit = laufVoll('maler', T_MIT, WZ()).positionen.filter(p => !/Nischen/.test(p.beschreibung ?? ''))
    expect(mit.map(p => [p.beschreibung, p.menge, p.einheit]))
      .toEqual(ohne.map(p => [p.beschreibung, p.menge, p.einheit]))
  })

  it('19 · der Katalog: die Zeile steht in lfdm und ist für den Maler erreichbar', () => {
    const k = DEFAULT_PRICES.find(p => p.title === KATALOGZEILE)!
    expect(k.unit).toBe('lfdm')
    expect(k.unit_price).toBe(6)
    expect(preisKategoriePasstZuGewerk(k.category, 'maler')).toBe(true)
  })
})
