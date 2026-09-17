// PM-120 — „Erster / Zweiter Bauabschnitt" OHNE Trennungssatz: beide
// Abschnitte gehören vollständig ins Angebot (Prüfmeister, 17.09.2026)
//
// ── Woher der Fall kommt ──────────────────────────────────────────────────
//
// Engineering hat ihn beim Bau von CoS-E-074 gemessen und mir gemeldet, weil
// er meine Fallbasis betrifft und dort fehlte:
//
//   „«Zweiter Bauabschnitt» allein darf kein Auslöser sein. Die
//    Satzzerlegung gibt den Teilsatz «Zweiter Bauabschnitt Obergeschoss» dem
//    WOHNZIMMER — er nennt keinen bekannten Raum und erbt deshalb den zuletzt
//    genannten. Ein Auslöser auf die bloße Wendung hätte den ERSTEN
//    Bauabschnitt aus dem Angebot geworfen, und PM-097-B wäre trotzdem grün
//    gewesen, weil es nur die Abwesenheit des Schlafzimmers prüft."
//
// Er hat recht, und die Lücke ist meine. PM-116 und PM-097 prüfen beide nur,
// dass der AUSGENOMMENE Abschnitt verschwindet. Keiner von beiden prüft, dass
// ein Bauabschnitt, den niemand ausgenommen hat, STEHEN BLEIBT. Genau das ist
// die Richtung, in die ein zu grob gebauter Fix kippt — und er kippt
// unbemerkt, weil er die vorhandenen Sperrklinken grün lässt.
//
// ── Der Fall ──────────────────────────────────────────────────────────────
//
//   „Erster Bauabschnitt Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände
//    streichen. Zweiter Bauabschnitt Küche drei mal drei, Wände streichen."
//
// Kein „das kommt später", kein „wird extra angeboten", kein Zeitwort. Zwei
// Abschnitte, beide bestellt, beide gehören aufs Papier — zusammen 590,40 €.
//
// ── Warum das heute grün ist und trotzdem hier stehen muss ────────────────
//
// Der Fall ist keine Sperrklinke: das Produkt macht ihn richtig. Er ist eine
// KONTROLLE gegen einen Fix, den es noch nicht gibt. Wer PM-116-A oder
// PM-097-B baut und dabei auf die Wendung „Bauabschnitt" statt auf den
// Trennungssatz zielt, macht genau diese Datei rot — und das ist ihr ganzer
// Zweck.
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
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
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk: 'maler', raeume, transkript } } as never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen('maler', extraktion)
  const r2 = extraktion.raeume ?? raeume
  const text = ersetzeZahlenWorte(transkript)
  const signale = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arbeitenTexte: r2.flatMap((r: any) => r.arbeiten ?? []),
    belagText: null, altbelagEntfernen: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeume: r2.map((r: any) => ({ name: r.name, arbeiten: r.arbeiten ?? [] })),
  }
  const meta = {
    fensterAnzahl: zaehleFenster(text) || undefined,
    tuerenAnzahl: zaehleTueren(text) || undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeume: r2.map((r: any) => ({ name: r.name, hoehe: r.hoehe ?? null })),
  }
  return pruefeUndErgaenzeVollstaendigkeit('maler', eng.positionen, text, meta as never, signale as never).positionen as
    { beschreibung: string; menge: number; einheit: string }[]
}

type Zeile = { beschreibung: string; menge: number; einheit: string }
function betrag(pos: Zeile[], z: Zeile) {
  const g = gewerkFuerPosition(z.beschreibung, 'maler')
  const p = findePreisposition(z.beschreibung, z.einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))
  return (p?.position.unit_price ?? 0) * z.menge
}
const summeRaum = (pos: Zeile[], raumName: RegExp) =>
  Number(pos.filter(z => raumName.test(z.beschreibung)).reduce((s, z) => s + betrag(pos, z), 0).toFixed(2))

const T = 'Erster Bauabschnitt Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen. '
  + 'Zweiter Bauabschnitt Küche drei mal drei, Wände streichen.'
const R = () => [
  raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: ['wände streichen'] }),
  raum('Küche', { laenge: 3, breite: 3, hoehe: 2.5, arbeiten: ['wände streichen'] }),
]

describe('PM-120 · zwei Bauabschnitte, keiner ausgenommen', () => {
  it('PM-120-A · der ERSTE Bauabschnitt steht vollständig im Angebot', () => {
    // Die Zusicherung, die ein zu grob gebauter Ausschluss-Fix rot macht.
    const pos = lauf(T, R())
    expect(pos.some(z => /Wohnzimmer/.test(z.beschreibung))).toBe(true)
    expect(summeRaum(pos, /Wohnzimmer/)).toBeGreaterThan(0)
  })

  it('PM-120-B · der ZWEITE Bauabschnitt steht vollständig im Angebot — 305,40 €', () => {
    // Dieselbe Zahl wie PM-116-D, hier aus dem anderen Blickwinkel: dort
    // belegt sie, dass die Küche gerechnet werden KANN, hier, dass sie
    // stehen BLEIBT, wenn niemand sie ausnimmt.
    const pos = lauf(T, R())
    expect(pos.some(z => /Küche/.test(z.beschreibung))).toBe(true)
    expect(summeRaum(pos, /Küche/)).toBe(305.4)
  })

  it('PM-120-C · keiner der beiden erzeugt einen Hinweis auf etwas Weggelassenes', () => {
    // Die Gegenrichtung zu PM-097-B: wo nichts weggelassen wurde, darf auch
    // nichts gemeldet werden. Sonst steht auf dem Papier ein Hinweis auf
    // einen Abschnitt, der gar nicht fehlt.
    const pos = lauf(T, R())
    expect(pos.filter(z => /später|nicht enthalten|extra angeboten|separat/i.test(z.beschreibung))).toEqual([])
  })

  it('PM-120-D Kontrolle · das Wort „Bauabschnitt" landet in keinem Positionstitel', () => {
    // Es ist eine Gliederungsansage des Handwerkers, keine Arbeit.
    expect(lauf(T, R()).filter(z => /bauabschnitt/i.test(z.beschreibung))).toEqual([])
  })
})
