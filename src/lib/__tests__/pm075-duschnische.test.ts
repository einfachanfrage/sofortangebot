// ══════════════════════════════════════════════════════════════════════════
// PM-075 — die Duschnische: gesagt, im Katalog vorhanden, jetzt auch im
// Angebot
// ══════════════════════════════════════════════════════════════════════════
//
// Der Fund des Prüfmeisters (Batch 69–77, 15.09.2026): „In der Dusche kommt
// eine Wandnische rein, die wird mit gefliest." ändert am Angebot nichts —
// weder Zeile noch Rückfrage. 95,00 €, die auf keinem Angebot landen.
//
// Seine Entscheidung vom 17.09.2026: bepreiste Position, Einheit Stück,
// Anzahl aus dem Satz. Nicht Fehlt-Eintrag wie beim Maler (PM-089) — dort
// fehlt die Katalogzeile, hier gibt es sie.
//
// Aufbau wie `pruefmeister-batch-69-77.test.ts`: Engine + Vollständigkeit
// direkt, weil die Fliesen-Engine `bereiche` liest und nicht `raeume`.
// Jede Zusicherung hat ihre Gegenprobe daneben.
//
// Head of Product Engineering · 17.09.2026
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '@/lib/positions-gewerk'

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function laufFliesen(transkript: string, bereiche: any[]) {
  const eng = berechneMengen('fliesen', { transkript, bereiche, altbelag: [] } as never)
  const meta = { raeume: bereiche.map(b => ({ name: b.name, hoehe: null })) }
  const signale = {
    arbeitenTexte: [], belagText: null, altbelagEntfernen: false,
    raeume: bereiche.map(b => ({ name: b.name, arbeiten: [] })),
  }
  return pruefeUndErgaenzeVollstaendigkeit('fliesen', eng.positionen, transkript, meta as never, signale as never)
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], m: RegExp) => pos.find(p => m.test(p.beschreibung))

const BAD = () => [{ name: 'Bad', laenge: 2, breite: 3, flieshoehe: 2.1, nassbereich: true }]
const T_OHNE = 'Bad zwei mal drei, Fliesenhöhe zwo Meter zehn, Wände und Boden fliesen.'
const SATZ = ' In der Dusche kommt eine Wandnische rein, die wird mit gefliest.'
const T_MIT = T_OHNE + SATZ

describe('PM-075 — die gesagte Duschnische steht im Angebot', () => {
  it('1 · die Zeile entsteht', () => {
    expect(finde(laufFliesen(T_MIT, BAD()).positionen, /Nische/), 'Nische').toBeDefined()
  })

  it('2 · die Gegenprobe: ohne den Satz entsteht sie nicht', () => {
    const erg = laufFliesen(T_OHNE, BAD())
    expect(finde(erg.positionen, /Nische/)).toBeUndefined()
    expect(erg.positionen).toHaveLength(7)
    expect(erg.fehlende.filter(f => /Nische/i.test(f))).toHaveLength(0)
  })

  it('3 · Einheit Stück, Menge 1 — die Anzahl steht im Satz', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const z = finde(laufFliesen(T_MIT, BAD()).positionen, /Nische/) as any
    expect(z.einheit).toBe('Stück')
    expect(z.menge).toBe(1)
  })

  it('4 · der Raumname hängt am Titel, wie bei den übrigen Fliesenzeilen', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const z = finde(laufFliesen(T_MIT, BAD()).positionen, /Nische/) as any
    expect(z.beschreibung).toBe('Nische fliesen — Bad')
  })

  it('5 · der Katalog kennt die Zeile — 95,00 €/Stück', () => {
    const t = DEFAULT_PRICES.find(p => p.title === 'Nische / Wandnische fliesen')
    expect(t?.unit).toBe('Stück')
    expect(t?.unit_price).toBe(95)
  })

  it('6 · 🔴 der eigentliche Fund: der Titel findet seinen Preis — keine 0,00-€-Zeile', () => {
    // Die Falle von PM-090: `gewerkFuerPosition` prüft /wand/ zuerst. Jeder
    // Titel mit „Wand" darin landet beim Maler, und dann ist die Kategorie
    // „Fliesen – Sonderarbeiten" gar kein Kandidat mehr.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const z = finde(laufFliesen(T_MIT, BAD()).positionen, /Nische/) as any
    const gewerk = gewerkFuerPosition(z.beschreibung, 'fliesen')
    expect(gewerk, 'Gewerk der Nischenzeile').toBe('fliesen')
    const treffer = findePreisposition(z.beschreibung, z.einheit,
      KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, gewerk)))
    expect(treffer?.position.title).toBe('Nische / Wandnische fliesen')
    expect(treffer?.position.unit_price).toBe(95)
  })

  it('7 · der Beleg für Punkt 6: die Katalogschreibweise selbst wäre preislos', () => {
    // Nicht Kosmetik, sondern der Grund für den kürzeren Titel.
    for (const titel of ['Nische / Wandnische fliesen', 'Wandnische fliesen — Bad']) {
      expect(gewerkFuerPosition(titel, 'fliesen'), titel).toBe('maler')
    }
  })

  it('8 · die Zeile ist diktiert, nicht ergänzt (PM-077 / Regel H Satz 3)', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const z = finde(laufFliesen(T_MIT, BAD()).positionen, /Nische/) as any
    expect(z.automatisch_ergaenzt, 'diktiert, nicht ergänzt').toBe(false)
  })

  it('9 · zwei Nischen sind zwei Stück', () => {
    const t = T_OHNE + ' In der Dusche kommen zwei Wandnischen rein, die werden mit gefliest.'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const z = finde(laufFliesen(t, BAD()).positionen, /Nische/) as any
    expect(z.menge).toBe(2)
  })

  it('10 · Mehrzahl ohne Zahl bekommt keinen Preis, sondern eine Frage', () => {
    const t = T_OHNE + ' Da kommen noch Nischen rein, die werden mit gefliest.'
    const erg = laufFliesen(t, BAD())
    expect(finde(erg.positionen, /Nische/), 'keine geratene Stückzahl').toBeUndefined()
    expect(erg.fehlende.some(f => /Nische fliesen/.test(f)), 'stattdessen gefragt').toBe(true)
  })

  it('11 · die Nische ohne Fliesenauftrag erzeugt nichts', () => {
    // „bleibt wie sie ist" — genannt, aber nicht beauftragt.
    const t = T_OHNE + ' Die Wandnische in der Dusche bleibt, wie sie ist.'
    const erg = laufFliesen(t, BAD())
    expect(finde(erg.positionen, /Nische/)).toBeUndefined()
    expect(erg.positionen).toHaveLength(7)
  })

  it('12 · „nische" ist ein Wort, kein Wortstamm — fünf harmlose Sätze', () => {
    for (const wort of ['technische', 'mechanische', 'elektronische', 'hygienische', 'spanische']) {
      const t = `${T_OHNE} Das sind ${wort} Fliesen.`
      const erg = laufFliesen(t, BAD())
      expect(finde(erg.positionen, /Nische/), wort).toBeUndefined()
      expect(erg.positionen, wort).toHaveLength(7)
    }
  })

  it('13 · die Zeile entsteht nur einmal, auch wenn die Nische zweimal vorkommt', () => {
    const t = T_MIT + ' Die Nische muss sauber gefliest werden.'
    const treffer = laufFliesen(t, BAD()).positionen.filter(p => /Nische/.test(p.beschreibung ?? ''))
    expect(treffer).toHaveLength(1)
  })

  it('14 · die übrigen sieben Positionen bewegen sich nicht', () => {
    const ohne = laufFliesen(T_OHNE, BAD()).positionen
    const mit = laufFliesen(T_MIT, BAD()).positionen.filter(p => !/Nische/.test(p.beschreibung ?? ''))
    expect(mit.map(p => [p.beschreibung, p.menge, p.einheit]))
      .toEqual(ohne.map(p => [p.beschreibung, p.menge, p.einheit]))
  })
})
