// CoS-E-083 · PM-107 + PM-106 — eine Ansage gilt für alles, was sie betrifft
// (Engineering, 21.09.2026)
//
// Zwei Funde aus Sandys zweitem Live-Lauf, vom Chief of Staff bewusst als EIN
// Punkt vergeben: beide Male wird eine Ansage auf einen Teil des Auftrags
// angewandt statt auf den, den sie meint.
//
//   PM-107 · „Wände zweimal und Decken einmal streichen" für zwei Räume.
//            Der zweite Raum bekam seine Decke mit 1x, der erste mit 2x —
//            80,00 € zu viel, und auf dem Papier stehen zwei verschiedene
//            Anstrichzahlen für dieselbe Ansage.
//
//   PM-106 · „Die 4 Innentüren abschleifen, grundieren und weiß lackieren."
//            Daraus entstanden `Voranstrich / Grundierung` über die ganze
//            Wandfläche (225,00 €) und `Voranstrich / Grundierung Decke`
//            (54,00 €) — 279,00 €, die niemand bestellt hat. Das Wort
//            „grundieren" galt den Türen, nicht dem Raum.
//
// Die Gegenproben stehen absichtlich neben den Sperrklinken: eine Regel, die
// den Fehler wegnimmt und dabei die richtigen Fälle mitnimmt, ist keine
// Reparatur. Deshalb hier je Fund mindestens eine Kontrolle, die VOR und NACH
// dem Bau grün sein muss.
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '@/lib/positions-gewerk'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ergaenzeAusAufnahmeHinweisen, normalisiereBodenPositionenAusAufnahme } from '../mengen/aufnahme-hinweise'
import { ersetzeZahlenWorte } from '../zahlen-parser'

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))
const TUER = { anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }
const FENSTER = (anzahl = 1, breite = 1.2, hoehe = 1.0) => ({ anzahl, breite, hoehe, annahme: true })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// Derselbe Weg wie in den Prüfmeister-Batches: über die Pipeline, nicht in die
// Engine hinein — sonst fehlen Leibungen, Mehrgewerk und Maßreparatur.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(gewerk: 'maler' | 'boden_parkett', transkript: string, raeume: any[], extra: any = {}) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk, raeume, transkript, ...extra } } as never)
  const text = ersetzeZahlenWorte(transkript)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen(gewerk, extraktion)
  const r2 = extraktion.raeume ?? raeume
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
  const ergebnis = pruefeUndErgaenzeVollstaendigkeit(gewerk, eng.positionen, text, meta as never, signale as never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chips: string[] = r2.flatMap((r: any) =>
    (r.arbeiten ?? []).map((a: string) => `${a}${r.name ? ` — ${r.name}` : ''}`),
  )
  return normalisiereBodenPositionenAusAufnahme(
    ergaenzeAusAufnahmeHinweisen(ergebnis.positionen, chips, text),
    text,
  )
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], m: RegExp) => pos.find(p => m.test(p.beschreibung))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const menge = (pos: any[], m: RegExp) => finde(pos, m)?.menge
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function preis(pos: any[], m: RegExp, gewerk: string) {
  const p = finde(pos, m)
  if (!p) return null
  const g = gewerkFuerPosition(p.beschreibung, gewerk)
  return findePreisposition(p.beschreibung, p.einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))?.position.unit_price ?? null
}

// ═══════════════════════════════════════════════════════════════════════════
// PM-107 — die Anstrichzahl gilt für alle Räume, nicht nur für den letzten
// ═══════════════════════════════════════════════════════════════════════════
describe('E-087 · PM-107 — „Decken einmal" gilt für beide Räume', () => {
  const T = 'Büro 5 mal 4 und Besprechungsraum 4 mal 4, beide 2,60 hoch. In beiden die alte Tapete runter, dann vollflächig spachteln Q3 wegen Streiflicht, danach Wände zweimal und Decken einmal streichen.'
  const R = () => [
    raum('Büro', { laenge: 5, breite: 4, hoehe: 2.6, tueren: [TUER], fenster: [FENSTER(2)], arbeiten: ['tapete entfernen', 'spachteln', 'waende_streichen', 'decke_streichen'] }),
    raum('Besprechungsraum', { laenge: 4, breite: 4, hoehe: 2.6, tueren: [TUER], fenster: [FENSTER(2)], arbeiten: ['tapete entfernen', 'spachteln', 'waende_streichen', 'decke_streichen'] }),
  ]

  // E-087-1 · Kontrolle, muss vorher wie nachher grün sein.
  it('E-087-1 · die Wände stehen in beiden Räumen auf 2x', () => {
    const p = lauf('maler', T, R())
    expect(menge(p, /wand streichen 2x — Büro/i)).toBe(46.8)
    expect(menge(p, /wand streichen 2x — Besprechungsraum/i)).toBe(41.6)
  })

  // E-087-2 · Kontrolle: der Raum, der die Ansage schon hatte, behält sie.
  it('E-087-2 · der Besprechungsraum behält seine Decke mit 1x', () => {
    expect(finde(lauf('maler', T, R()), /decke streichen 1x — Besprechungsraum/i)).toBeDefined()
  })

  // E-087-3 · der Fund selbst.
  it('E-087-3 · das Büro bekommt die Decke mit 1x, nicht mit 2x', () => {
    expect(finde(lauf('maler', T, R()), /decke streichen 1x — Büro/i)).toBeDefined()
  })

  // E-087-4 · dieselbe Ansage darf nicht in zwei Anstrichzahlen zerfallen.
  it('E-087-4 · auf dem Papier steht nirgends „Decke streichen 2x"', () => {
    expect(finde(lauf('maler', T, R()), /decke streichen 2x/i)).toBeUndefined()
  })

  // E-087-5 · der Geldweg: 20,00 m² × (11,00 − 7,00) = 80,00 €.
  it('E-087-5 · die Bürodecke kostet 7,00 €/m², nicht 11,00 €', () => {
    const p = lauf('maler', T, R())
    expect(menge(p, /decke streichen 1x — Büro/i)).toBe(20)
    expect(preis(p, /decke streichen 1x — Büro/i, 'maler')).toBe(7)
  })

  // E-087-6 · Gegenprobe zu PM-005/PM-026: eine Ansage, die AUSDRÜCKLICH an
  // einem Raum hängt, darf nicht in den anderen bluten. Sonst hätte die
  // Reparatur nur die Richtung des Fehlers gedreht.
  const T_JE_RAUM = 'Büro 5 mal 4 und Besprechungsraum 4 mal 4, beide 2,60 hoch. Im Büro die Decke einmal streichen, im Besprechungsraum die Decke zweimal streichen. Wände überall zweimal.'
  it('E-087-6 · steht die Ansage je Raum, bleibt sie beim eigenen Raum', () => {
    const p = lauf('maler', T_JE_RAUM, R())
    expect(finde(p, /decke streichen 1x — Büro/i)).toBeDefined()
    expect(finde(p, /decke streichen 2x — Besprechungsraum/i)).toBeDefined()
  })
})

// ═══════════════════════════════════════════════════════════════════════════
// PM-106 — „grundieren" an den Türen grundiert nicht den Raum
// ═══════════════════════════════════════════════════════════════════════════
describe('E-087 · PM-106 — Grundierung ungefragt, sobald Türen lackiert werden', () => {
  // Fall 7 der Einsprech-Liste, live am 17.09. bestätigt.
  const T = 'Flur, 6 mal 1,50, 2,50 hoch. Wände und Decke zweimal weiß. Die 4 Innentüren mit Zargen abschleifen, grundieren und weiß lackieren.'
  const R = () => [raum('Flur', {
    laenge: 6, breite: 1.5, hoehe: 2.5,
    tueren: [{ anzahl: 4, breite: 0.9, hoehe: 2.1, annahme: false }], fenster: [],
    arbeiten: ['waende_streichen', 'decke_streichen', 'tueren lackieren'],
  })]

  // E-087-7 · Kontrolle: die bestellte Arbeit bleibt vollständig stehen.
  it('E-087-7 · die vier Türen behalten Schleifen, Grundieren und Lackieren', () => {
    const p = lauf('maler', T, R())
    expect(menge(p, /türen abschleifen/i)).toBe(4)
    expect(menge(p, /türen grundieren/i)).toBe(4)
    expect(menge(p, /türen lackieren/i)).toBe(4)
  })

  // E-087-8 · Kontrolle: der Raumanstrich selbst bleibt unberührt.
  it('E-087-8 · Wand und Decke stehen weiter mit 2x da', () => {
    const p = lauf('maler', T, R())
    expect(menge(p, /wand streichen 2x — Flur/i)).toBe(37.5)
    expect(menge(p, /decke streichen 2x — Flur/i)).toBe(9)
  })

  // E-087-9 · der Fund: 225,00 €.
  it('E-087-9 · keine Wandgrundierung über die ganze Wandfläche', () => {
    const p = lauf('maler', T, R())
    expect(finde(p, /^Voranstrich \/ Grundierung(?! Decke)/i)).toBeUndefined()
  })

  // E-087-10 · der Fund, zweiter Teil: 54,00 €.
  it('E-087-10 · keine Deckengrundierung', () => {
    expect(finde(lauf('maler', T, R()), /Voranstrich \/ Grundierung Decke/i)).toBeUndefined()
  })

  // E-087-11 · Gegenprobe, muss vorher wie nachher grün sein: wird der RAUM
  // ausdrücklich zum Grundieren angesagt, entsteht die Grundierung weiter.
  // Eine Regel, die auch diese Position wegnimmt, wäre der teurere Fehler —
  // dann fehlte bezahlte Arbeit im Angebot.
  const T_ECHT = 'Flur, 6 mal 1,50, 2,50 hoch. Die Wände grundieren und danach zweimal weiß streichen.'
  const R_ECHT = () => [raum('Flur', {
    laenge: 6, breite: 1.5, hoehe: 2.5, tueren: [TUER], fenster: [],
    arbeiten: ['waende_streichen', 'grundieren'],
  })]
  it('E-087-11 · „die Wände grundieren" erzeugt die Wandgrundierung weiterhin', () => {
    const p = lauf('maler', T_ECHT, R_ECHT())
    expect(menge(p, /^Voranstrich \/ Grundierung/i)).toBe(37.5)
  })

  // E-087-12 · Der Nebenbefund des Prüfmeisters, nachgemessen statt
  // übernommen: er hat live 6,00 €/m² gesehen und vermutet, der Titel
  // `Voranstrich / Grundierung` treffe eine andere Katalogzeile als
  // `Grundieren — Tiefengrund` (4,50 €). **Auf dem Prüfstand ist das nicht
  // reproduzierbar** — hier trifft der Preis-Matcher 4,50 €, in Fall 7 wie im
  // Normalfall (gemessen 21.09. gegen `DEFAULT_PRICES`, einmal auch gegen den
  // Stand vor diesem Bau). Der Unterschied muss also aus dem echten Katalog
  // kommen, nicht aus dem Titel. Der Befund bleibt beim Prüfmeister; dieser
  // Test hält fest, was der Prüfstand sagt, damit der Unterschied auffällt,
  // sobald jemand ihn verschiebt.
  it('E-087-12 · die Wandgrundierung trifft auf dem Prüfstand 4,50 €/m²', () => {
    expect(preis(lauf('maler', T_ECHT, R_ECHT()), /^Voranstrich \/ Grundierung/i, 'maler')).toBe(4.5)
  })
})
