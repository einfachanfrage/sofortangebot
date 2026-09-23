// Landingpage-Beleg: die zwei Diktate, die auf der Seite stehen
// (Prüfmeister, 17.09.2026, abends — Antwort auf Marketings Bitte aus
// `docs/pruefmeister-restliste.md`, Head of Marketing, 17.09.2026)
//
// Marketing hat die Zahlen auf der Seite aus dem Code hergeleitet und dazu
// selbst geschrieben: „hergeleitet ist nicht gemessen". Genau darum geht es
// hier. Drei Fragen zum Hero-Diktat, eine zum Diktat unter
// „So funktioniert's".
//
//   Diktat 1 · Hero · Titel, Mengen, Belegtext               → PM-129
//   Diktat 2 · „Raufaser runter, dann streichen"             → PM-130
//
// Ergebnis in zwei Sätzen: **Von den drei Zahlen der Seite stimmen zwei.**
// Die Titel heißen anders als auf der Seite, eine vierte Zeile fehlt dort,
// und 17,10 lfdm gibt es im Produkt nicht — es sind 18,00. Diktat 2 erzeugt
// **keine** fünf Türen (PM-128 greift nicht), aber etwas Schlimmeres: ein
// Angebot, das aus einer einzigen Zeile besteht, die niemand gesagt hat.
// Das ist PM-094, wortgleich, auf der Landingpage.
//
// Aufbau wie `pm-landingpage-buero.test.ts`: über die Pipeline, Text einmal
// am Eingang normalisiert (K.2).
//
// Prüfmeister · 17.09.2026
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '../positions-gewerk'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ergaenzeAusAufnahmeHinweisen, normalisiereBodenPositionenAusAufnahme } from '../mengen/aufnahme-hinweise'
import { ersetzeZahlenWorte } from '../zahlen-parser'

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))
const katalog = (t: string) => DEFAULT_PRICES.find(p => p.title === t)!.unit_price
const TUER = { anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }
const FENSTER = (anzahl = 1, breite = 1.2, hoehe = 1.0) => ({ anzahl, breite, hoehe, annahme: true })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk: 'maler', raeume, transkript } } as never)
  const text = ersetzeZahlenWorte(transkript)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen('maler', extraktion)
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
  const ergebnis = pruefeUndErgaenzeVollstaendigkeit('maler', eng.positionen, text, meta as never, signale as never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chips: string[] = r2.flatMap((r: any) =>
    (r.arbeiten ?? []).map((a: string) => `${a}${r.name ? ` — ${r.name}` : ''}`),
  )
  const positionen = normalisiereBodenPositionenAusAufnahme(
    ergaenzeAusAufnahmeHinweisen(ergebnis.positionen, chips, text), text,
  )
  return { positionen, fehlende: ergebnis.fehlende ?? [] }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], m: RegExp) => pos.find(p => m.test(p.beschreibung))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const titel = (pos: any[]) => pos.map(p => p.beschreibung)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function einzelpreis(p: any) {
  const g = gewerkFuerPosition(p.beschreibung, 'maler')
  return findePreisposition(p.beschreibung, p.einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))?.position.unit_price ?? null
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function summeNetto(pos: any[]) {
  let s = 0
  for (const p of pos) {
    const ep = einzelpreis(p)
    if (ep !== null) s += ep * p.menge
  }
  return Number(s.toFixed(2))
}

// ───────────────────────────────────────────────────────────────────────────
// PM-129 · Diktat 1, der Satz im Hero
//
//   „Wohnzimmer, fünf mal vier, zwei sechzig hoch, Wände und Decke
//    streichen, ein Fenster, eine Tür."
//
// Auf der Seite stehen daneben drei Zeilen: Wandflächen streichen 46,80 m² ·
// Deckenfläche streichen 20,00 m² · Sockelleisten abkleben 17,10 lfdm.
//
// ── Was das Produkt wirklich liefert ─────────────────────────────────────
//
//   Wand streichen 2x — Wohnzimmer        46,80 m²    9,50 €/m²
//   Decke streichen 2x — Wohnzimmer       20,00 m²   11,00 €/m²
//   Boden schützen — Wohnzimmer           20,00 m²    1,20 €/m²
//   Sockelleisten abkleben — Wohnzimmer   18,00 lfdm  0,80 €/lfdm
//
// ── Marketings drei Fragen, in ihrer Reihenfolge ──────────────────────────
//
// **1. Wie heißen die Positionen wirklich?** `Wand streichen 2x` und
// `Decke streichen 2x`, beide mit dem Raumnamen als Zusatz. Die Anstrichzahl
// steht also im Titel, **obwohl das Diktat „zweimal" nicht sagt** — sie kommt
// aus einer Annahme, und die Annahme steht sichtbar an der Zeile:
// „Zweifacher Anstrich als Standard angenommen — bitte prüfen". Wer
// `Wand streichen 2x` auf die Seite schreibt, druckt eine Annahme als
// Ergebnis. Wer „Wandflächen streichen" schreibt, druckt einen Titel, den
// das Produkt nicht kennt. **Beides ist falsch; der zweite Fehler ist der
// kleinere.** Meine Empfehlung an Marketing steht in der Restliste.
//
// **2. Stimmen 46,80 · 20,00 · 17,10?** Die ersten zwei ja, aufs Komma.
// **17,10 lfdm gibt es im Produkt nicht.** Es sind **18,00 lfdm** — der
// Umfang ungekürzt, weil Öffnungen bis 1 m Breite nach VOB nicht abgezogen
// werden. Die 17,10 ist 18,00 − 0,90 (Türbreite), also genau der Abzug, den
// das Produkt bewusst nicht macht. Und **eine vierte Zeile fehlt auf der
// Seite**: `Boden schützen`, 20,00 m², 24,00 €. Sie ist
// `automatisch_ergaenzt` und trotzdem bepreist.
//
// **3. Steht der Beleg wörtlich so da?** Nein, und er ist an zwei Stellen
// geteilt. Der Rechenweg der Wandzeile lautet „Umfang 18 lfm × 2.6 m =
// 46.8 m²". Der Übermessungs-Hinweis ist **keine Belegzeile, sondern eine
// Annahme** und lautet „2 Öffnungen bis 2,5 m² Einzelgröße nicht abgezogen
// (3.09 m², VOB/C DIN 18363 Übermessung)". Marketings Frage dahinter ist
// beantwortet: **ja, er erscheint auch dann, wenn nichts abgezogen wurde** —
// er sagt ja gerade das. Was auf der Seite fehlt, ist die zweite Annahme
// („bitte prüfen").
//
// Geld auf dieser Karte: 46,80 × 9,50 + 20 × 11,00 + 20 × 1,20 + 18 × 0,80
// = **703,00 €** netto.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-129 · Landingpage Hero — das Wohnzimmer-Diktat', () => {
  const T = 'Wohnzimmer, fünf mal vier, zwei sechzig hoch, Wände und Decke streichen, ein Fenster, eine Tür.'
  const R = () => [raum('Wohnzimmer', {
    laenge: 5, breite: 4, hoehe: 2.6, tueren: [TUER], fenster: [FENSTER()],
    arbeiten: ['waende_streichen', 'decke_streichen'],
  })]
  const pos = () => lauf(T, R()).positionen

  // PM-119 / L-06 (Engineering, 23.09.2026): **dieselben vier Zeilen, neue
  // Reihenfolge.** Der Schutz (Stufe 1) steht seit dem Bau der
  // Ausführungsreihenfolge vor der Hauptarbeit (Stufe 5) — vorher wurde auf
  // dem Papier gestrichen und danach der Boden abgedeckt. Die Zusicherung
  // ist nicht abgeschwächt: es sind weiter genau vier Zeilen, wortgleich,
  // und der Geldweg in PM-129-H (703,00 €) ist unverändert gemessen.
  it('PM-129-A · vier Zeilen, und die Seite zeigt drei', () => {
    expect(titel(pos())).toEqual([
      'Boden schützen — Wohnzimmer',
      'Sockelleisten abkleben — Wohnzimmer',
      'Wand streichen 2x — Wohnzimmer',
      'Decke streichen 2x — Wohnzimmer',
    ])
  })

  it('PM-129-B · die Titel tragen die Anstrichzahl, das Diktat sagt sie nicht', () => {
    expect(T).not.toMatch(/zweimal|2x|zwei mal/i)
    const wand = finde(pos(), /^Wand streichen/)!
    expect(wand.beschreibung).toBe('Wand streichen 2x — Wohnzimmer')
    expect(wand.annahmen).toContain('Zweifacher Anstrich als Standard angenommen — bitte prüfen')
  })

  it('PM-129-C · 46,80 m² und 20,00 m² stimmen aufs Komma', () => {
    const p = pos()
    expect(finde(p, /^Wand streichen/)!.menge).toBe(46.8)
    expect(finde(p, /^Decke streichen/)!.menge).toBe(20)
  })

  it('PM-129-D · 17,10 lfdm gibt es nicht — es sind 18,00', () => {
    expect(finde(pos(), /^Sockelleisten abkleben/)!.menge).toBe(18)
    // Die Zahl der Seite ist genau der Türabzug, den das Produkt nicht macht.
    expect(Number((18 - 0.9).toFixed(2))).toBe(17.1)
  })

  it('PM-129-E · die vierte Zeile: Boden schützen, 20,00 m², bepreist', () => {
    const b = finde(pos(), /^Boden schützen/)!
    expect(b.menge).toBe(20)
    expect(einzelpreis(b)).toBe(1.2)
  })

  it('PM-129-F · der Belegtext der Wandzeile, wörtlich', () => {
    const wand = finde(pos(), /^Wand streichen/)!
    expect(wand.berechnungsweg).toBe('Umfang 18 lfm × 2.6 m = 46.8 m²')
    expect(wand.annahmen).toContain('2 Öffnungen bis 2,5 m² Einzelgröße nicht abgezogen (3.09 m², VOB/C DIN 18363 Übermessung)')
  })

  it('PM-129-G · der Übermessungs-Hinweis erscheint, obwohl nichts abgezogen wurde', () => {
    // Genau Marketings dritte Frage. Fenster 1,2 × 1,0 = 1,20 m², Tür
    // 0,9 × 2,1 = 1,89 m², zusammen 3,09 m² — beide einzeln unter 2,5 m².
    expect(Number((1.2 * 1.0 + 0.9 * 2.1).toFixed(2))).toBe(3.09)
    expect(finde(pos(), /^Wand streichen/)!.menge).toBe(46.8) // ungekürzt
  })

  it('PM-129-H · der Geldweg der Karte: 703,00 € netto', () => {
    expect(summeNetto(pos())).toBe(703)
    expect(katalog('Wand streichen 2x Anstrich')).toBe(9.5)
    expect(katalog('Decke streichen 2x Anstrich')).toBe(11)
  })

  it('PM-129-K1 Kontrolle · ohne Öffnungssatz dieselben vier Zeilen (PM-098 trägt)', () => {
    const ohne = lauf('Wohnzimmer, fünf mal vier, zwei sechzig hoch, Wände und Decke streichen.', R()).positionen
    expect(titel(ohne)).toEqual(titel(pos()))
    expect(summeNetto(ohne)).toBe(703)
  })

  it('PM-129-K2 Kontrolle · keine Tür- und keine Fensterlackierung', () => {
    expect(finde(pos(), /Türen|Türzarge/)).toBeUndefined()
    expect(finde(pos(), /Fenster/)).toBeUndefined()
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-130 · Diktat 2, der Satz unter „So funktioniert's"
//
//   „Wohnzimmer, fünf mal vier, Raufaser runter, dann streichen."
//
// Marketing fragt: **fällt dieser Satz unter PM-128** (Raumname auf „…zimmer"
// + erstes Maß → vier Türen)? Er hat den Auslöser richtig erkannt und die
// richtige Sorge gehabt.
//
// ── Die Antwort: nein, und das ist Zufall ─────────────────────────────────
//
// Es entsteht **keine einzige Türzeile** — weil das Diktat keine Türarbeit
// nennt. Marketings eigenes Lesen von `maler-lackieren.ts` war richtig.
// Warum es nur Zufall ist, steht in PM-131: der Satz hängt am Komma hinter
// „Wohnzimmer". Ohne dieses Komma wären es fünf Türen.
//
// ── Der eigentliche Fund: es ist PM-094, auf der Landingpage ─────────────
//
// Das Diktat nennt keine Raumhöhe. Ohne Höhe gibt es keine Wandfläche, und
// ohne Wandfläche entsteht **von den zwei bestellten Arbeiten keine**:
//
//   Angebot:   Boden schützen — Wohnzimmer   20,00 m²   =  24,00 €
//   fehlende:  „Tapete entfernen"
//
// Das ist wortgleich PM-094: **das ganze Angebot besteht aus einer Zeile,
// und die hat niemand gesagt.** Sie trägt `automatisch_ergaenzt` und findet
// ihren Preis. Das Streichen — das, wofür der Handwerker angerufen hat —
// fehlt **ohne jede Spur**; nur die Raufaser hinterlässt einen
// Fehlt-Eintrag. Der Unterschied zu PM-094 ist allein der Ort: dort war es
// ein Testfall, hier ist es der Satz, den die Landingpage dem ersten Kunden
// zum Nachsprechen anbietet.
//
// Kontrolle mit Höhe (2,50 m): vier Zeilen, 45,00 m² Wand, 45,00 m²
// Raufaser, **645,90 €** statt 24,00 €. Es fehlt genau eine Zahl im Diktat.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-130 · Landingpage „So funktioniert es" — Raufaser runter', () => {
  const T = 'Wohnzimmer, fünf mal vier, Raufaser runter, dann streichen.'
  const OHNE_HOEHE = () => [raum('Wohnzimmer', {
    laenge: 5, breite: 4, hoehe: null, arbeiten: ['tapete_entfernen', 'waende_streichen'],
  })]
  const MIT_HOEHE = () => [raum('Wohnzimmer', {
    laenge: 5, breite: 4, hoehe: 2.5, arbeiten: ['tapete_entfernen', 'waende_streichen'],
  })]

  it('PM-130-A · Marketings Frage: keine fünf Türen, keine einzige Türzeile', () => {
    expect(finde(lauf(T, OHNE_HOEHE()).positionen, /Tür/)).toBeUndefined()
    expect(finde(lauf(T, MIT_HOEHE()).positionen, /Tür/)).toBeUndefined()
  })

  it('PM-130-B 🔴 der Fund: eine Zeile, und die hat niemand gesagt (PM-094)', () => {
    const r = lauf(T, OHNE_HOEHE())
    expect(titel(r.positionen)).toEqual(['Boden schützen — Wohnzimmer'])
    expect(summeNetto(r.positionen)).toBe(24)
    expect(T).not.toMatch(/boden|schützen|abdeck/i)
  })

  it('PM-130-C 🔴 das Streichen fehlt ohne Spur, nur die Raufaser hinterlässt eine', () => {
    const r = lauf(T, OHNE_HOEHE())
    expect(r.fehlende).toEqual(['Tapete entfernen'])
    expect(r.fehlende.some(f => /streich/i.test(f))).toBe(false)
  })

  it('PM-130-K1 Kontrolle · mit Höhe 2,50 m stimmt alles: vier Zeilen, 645,90 €', () => {
    const r = lauf(T, MIT_HOEHE())
    // PM-119 / L-06: dieselben vier Zeilen, neue Reihenfolge. `Tapete
    // entfernen` (Stufe 2) stand bisher **hinter** dem Anstrich derselben
    // Wand — genau der Fund, gegen den L-06 gebaut ist. Menge und Summe
    // unten sind unverändert: 45 m², 45 m², 645,90 €.
    expect(titel(r.positionen)).toEqual([
      'Boden schützen — Wohnzimmer',
      'Sockelleisten abkleben — Wohnzimmer',
      'Tapete entfernen',
      'Wand streichen 2x — Wohnzimmer',
    ])
    expect(finde(r.positionen, /^Wand streichen/)!.menge).toBe(45)
    expect(finde(r.positionen, /^Tapete entfernen/)!.menge).toBe(45)
    expect(r.fehlende).toEqual([])
    expect(summeNetto(r.positionen)).toBe(645.9)
  })

  it.fails('PM-130-D 🔴 SOLL: ohne Höhe eine Rückfrage, kein Angebot über 24,00 € Bodenschutz', () => {
    const r = lauf(T, OHNE_HOEHE())
    expect(titel(r.positionen)).toEqual([])
  })

  it.fails('PM-130-E 🔴 SOLL: was bestellt war, steht wenigstens in der Fehlt-Liste', () => {
    const r = lauf(T, OHNE_HOEHE())
    expect(r.fehlende.some(f => /streich/i.test(f))).toBe(true)
  })
})
