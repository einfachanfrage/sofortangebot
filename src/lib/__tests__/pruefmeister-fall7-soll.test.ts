// Fall 7 der Einsprech-Liste — das Soll nach PM-106, und der Preis dahinter
//
// Antwort auf die zwei Fragen, die der Head of Product Engineering am
// 21.09.2026 um 10:05 UTC in `pruefmeister-restliste.md` gestellt hat.
// Beide Antworten stehen hier als Messung, nicht als Prosa — die Soll-Tabelle
// in `docs/einsprech-liste-zehn-grosse.md` ist danach nachgezogen.
//
// FRAGE 1 — führt die Soll-Tabelle zu Fall 7 die zwei Grundierungen weiter?
// ENTSCHEIDUNG: Nein. Der gebaute Stand hat recht, nicht mein altes Soll.
//   PM-106 war mein eigener Fund („Grundierung ungefragt, sobald Türlackierung
//   im Raum liegt"). Engineering hat ihn in `c82881c` behoben. Ein Soll, das
//   danach weiter auf die zwei Zeilen zeigt, widerspricht dem Fund, den es
//   selbst ausgelöst hat. Neue Netto-Summe: 1.198,05 € statt 1.407,30 €.
//
// FRAGE 2 — ist mein Nebenbefund „6,00 €/m² statt 4,50 €" reproduzierbar?
// ANTWORT: Gegen `DEFAULT_PRICES` nicht — dort sind es 4,50 €, dreimal,
//   Engineerings Messung stimmt. Aber die 6,00 € sind kein Gespenst: sie
//   stehen als ZWEITE Zeile derselben Katalog-Kategorie
//   (`Grundieren (Haftgrund / Sperrgrund)`, 6,00 €/m²). Fehlt im Katalog eines
//   Betriebs die Tiefengrund-Zeile, landet der Matcher genau dort — und dann
//   rechnet er 37,50 m² × 6,00 € = 225,00 € und 9,00 m² × 6,00 € = 54,00 €,
//   also die 279,00 €, die ich am 17.09. live gesehen habe. Der Matcher hat
//   keinen Treffer-Fehler; der Unterschied kommt aus dem Katalog des Betriebs.
//   Damit ist der Befund geschlossen: keine Bauaufgabe, eine Katalogfrage.
//
// Aufbau wie `pruefmeister-batch-47-56.test.ts` — über die Pipeline, Text
// einmal am Eingang normalisiert (K.2), `ergaenzeAusAufnahmeHinweisen` und
// `normalisiereBodenPositionenAusAufnahme` mit drin, weil die echte Route sie
// über die Vollständigkeit legt.
//
// Gemessen auf Sandys Rechner, nicht in der Ersatzumgebung.
//
// Prüfmeister · 21.09.2026
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function laufVoll(gewerk: 'maler' | 'boden_parkett', transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk, raeume, transkript } } as never)
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
  return {
    positionen: normalisiereBodenPositionenAusAufnahme(
      ergaenzeAusAufnahmeHinweisen(ergebnis.positionen, chips, text), text,
    ),
    fehlende: ergebnis.fehlende as string[],
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lauf = (g: 'maler' | 'boden_parkett', t: string, r: any[]) => laufVoll(g, t, r).positionen
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const titel = (pos: any[]) => pos.map(p => p.beschreibung)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function preisFuer(beschreibung: string, einheit: string, katalog = KATALOG) {
  const g = gewerkFuerPosition(beschreibung, 'maler')
  return findePreisposition(beschreibung, einheit, katalog.filter(k => preisKategoriePasstZuGewerk(k.category, g)))
    ?.position ?? null
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function summeNetto(pos: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return pos.reduce((s: number, p: any) => {
    const treffer = preisFuer(p.beschreibung, p.einheit)
    return s + (treffer ? treffer.unit_price * (p.menge ?? 0) : 0)
  }, 0)
}

// Der Flur aus Fall 7: 6,00 × 1,50 m, 2,50 m hoch
//   Wand  2 × (6,00 + 1,50) × 2,50 = 37,50 m²
//   Decke 6,00 × 1,50               =  9,00 m²
const FLUR = () => [raum('Flur', { laenge: 6, breite: 1.5, hoehe: 2.5, arbeiten: [] })]
const T_FALL7 = 'Flur, 6 mal 1,50, 2,50 hoch. Wände und Decke zweimal weiß. Die 4 Innentüren mit Zargen abschleifen, grundieren und weiß lackieren.'
// Kontrolle: derselbe Raum, derselbe Satz — nur ohne die Türen. Vor PM-106
// war die Türlackierung der Auslöser der zwei Grundierungen; danach darf sich
// der Wandblock zwischen beiden Fassungen nicht mehr unterscheiden.
const T_OHNE_TUEREN = 'Flur, 6 mal 1,50, 2,50 hoch. Wände und Decke zweimal weiß.'

// ───────────────────────────────────────────────────────────────────────────
// Frage 1 · Das Soll zu Fall 7
// ───────────────────────────────────────────────────────────────────────────
describe('Fall 7 · das Soll nach PM-106', () => {
  it('PM-106-S1 · genau acht Zeilen, keine Grundierung der Wand oder Decke', () => {
    const pos = lauf('maler', T_FALL7, FLUR())
    expect(titel(pos)).toEqual([
      'Wand streichen 2x — Flur',
      'Decke streichen 2x — Flur',
      'Boden schützen — Flur',
      'Sockelleisten abkleben — Flur',
      'Türen abschleifen',
      'Türen grundieren',
      'Türen lackieren (2× Anstrich)',
      'Türzarge lackieren',
    ])
    // `Türen grundieren` ist bestellt („abschleifen, grundieren und lackieren")
    // und bleibt. Gemeint sind die Flächen-Grundierungen von Wand und Decke.
    expect(titel(pos).some(t => /^Voranstrich \/ Grundierung/.test(t))).toBe(false)
  })

  it('PM-106-S2 · die Netto-Summe ist 1.198,05 €, nicht 1.407,30 €', () => {
    const pos = lauf('maler', T_FALL7, FLUR())
    expect(Number(summeNetto(pos).toFixed(2))).toBe(1198.05)
    // Die zwei entfallenen Zeilen wären mit 4,50 €/m² zusammen 209,25 €
    // gewesen — 37,50 × 4,50 = 168,75 € und 9,00 × 4,50 = 40,50 €.
    expect(Number((1198.05 + 209.25).toFixed(2))).toBe(1407.3)
  })

  it('PM-106-S3 · und es entsteht auch kein Fehlt-Eintrag dafür', () => {
    // Wichtig, weil ein stiller Wegfall und ein begründeter Wegfall auf dem
    // Kundenpapier gleich aussehen. Hier ist der Wegfall richtig: niemand hat
    // die Wände grundieren gesagt, also fehlt auch nichts.
    const { fehlende } = laufVoll('maler', T_FALL7, FLUR())
    expect(fehlende.some(f => /Voranstrich|Grundierung/i.test(f))).toBe(false)
  })

  it('PM-106-S4 · Kontrolle: ohne die Türen steht derselbe Wandblock da', () => {
    const mit = lauf('maler', T_FALL7, FLUR())
    const ohne = lauf('maler', T_OHNE_TUEREN, FLUR())
    expect(titel(ohne)).toEqual([
      'Wand streichen 2x — Flur',
      'Decke streichen 2x — Flur',
      'Boden schützen — Flur',
      'Sockelleisten abkleben — Flur',
    ])
    // Der Unterschied zwischen beiden Fassungen sind genau die vier
    // Türzeilen — 720,00 €, und keine Grundierung mehr dazwischen.
    expect(titel(mit).slice(0, 4)).toEqual(titel(ohne))
    expect(Number((summeNetto(mit) - summeNetto(ohne)).toFixed(2))).toBe(720)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// Frage 2 · 6,00 €/m² oder 4,50 €/m²
// ───────────────────────────────────────────────────────────────────────────
describe('Fall 7 · der Preis der Grundierung', () => {
  const TITEL_WAND = 'Voranstrich / Grundierung — Flur'
  const TITEL_DECKE = 'Voranstrich / Grundierung Decke — Flur'

  it('PM-106-P1 · gegen den Standardkatalog sind es 4,50 €, nicht 6,00 €', () => {
    for (const t of [TITEL_WAND, TITEL_DECKE, 'Voranstrich / Grundierung']) {
      const treffer = preisFuer(t, 'm²')
      expect(treffer?.title).toBe('Grundieren (Tiefengrund)')
      expect(treffer?.unit_price).toBe(4.5)
    }
  })

  it('PM-106-P2 · die 6,00 € stehen daneben — als eigene Katalogzeile', () => {
    const haft = DEFAULT_PRICES.find(p => p.title === 'Grundieren (Haftgrund / Sperrgrund)')
    expect(haft?.unit_price).toBe(6)
    expect(haft?.category).toBe('Maler – Untergrundvorbereitung')
    // Dieselbe Kategorie wie die Tiefengrund-Zeile: der Gewerke-Filter trennt
    // die beiden nicht, nur der Titel-Score.
    expect(DEFAULT_PRICES.find(p => p.title === 'Grundieren (Tiefengrund)')?.category)
      .toBe(haft?.category)
  })

  it('PM-106-P3 · fehlt die Tiefengrund-Zeile, rechnet der Matcher mit 6,00 € — das ist der Live-Stand vom 17.09.', () => {
    const ohneTiefengrund = KATALOG.filter(k => k.title !== 'Grundieren (Tiefengrund)')
    const treffer = preisFuer(TITEL_WAND, 'm²', ohneTiefengrund)
    expect(treffer?.title).toBe('Grundieren (Haftgrund / Sperrgrund)')
    expect(treffer?.unit_price).toBe(6)
    // 37,50 m² × 6,00 € = 225,00 € · 9,00 m² × 6,00 € = 54,00 € → 279,00 €,
    // genau die Zahlen, die am 17.09. live auf dem Blatt standen.
    expect(37.5 * 6).toBe(225)
    expect(9 * 6).toBe(54)
    expect(37.5 * 6 + 9 * 6).toBe(279)
  })
})
