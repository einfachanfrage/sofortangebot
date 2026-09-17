// Landingpage Beispiel 2 · Bodenleger, Kinderzimmer — die drei Zeilentitel,
// nach denen Marketing gefragt hat (Prüfmeister, 17.09.2026)
//
// ── Die Frage ─────────────────────────────────────────────────────────────
//
// Der Head of Marketing hat die Titel für Beispiel 2 nur im Quelltext
// gelesen, und gelesen ist nicht gemessen. Sein eigentlicher Verdacht war der
// dritte: auf der Seite steht „Übergangsschiene", die Engine sagt an jeder
// Stelle, die er finden konnte, „Übergangsprofil" (`kontext-analyzer.ts:588`,
// `positions-untertitel.ts:96`) — derselbe kleine Widerspruch, den wir gerade
// an sechs anderen Stellen ausgeräumt haben.
//
// ── Die Antwort: kein Widerspruch. Die Seite stimmt. ──────────────────────
//
// Gemessen auf Sandys Rechner am 17.09.2026, eine Aufnahme, vier Zeilen:
//
//   1. Laminat verlegen schwimmend inkl. 5% Verschnitt — Kinderzimmer
//   2. Sockelleisten montieren — Kinderzimmer
//   3. Übergangsschiene
//   4. Trittschalldämmung — Kinderzimmer
//
// „Übergangsschiene" ist das Wort aus dem Diktat und steht so auf dem
// Angebot — die Zeile entsteht aus dem Aufnahme-Hinweis und trägt deshalb
// auch keinen Raumnamen. `Übergangsprofil` ist das Wort der Engine für ihre
// eigene RÜCKFRAGE („Bei mehreren Räumen an Übergängen", kontext-analyzer.ts
// Z. 588), und die feuert hier gar nicht, weil es nur einen Raum gibt. Zwei
// Wörter, zwei verschiedene Stellen, kein Widerspruch auf dem Kundenpapier:
// der Betrieb liest, was er gesagt hat.
//
// Die beiden anderen Titel weichen ab, und zwar in die andere Richtung als
// befürchtet — die SEITE ist kürzer als das Produkt, nicht anders:
//
//   Auf der Seite                   Im Produkt
//   Trittschalldämmung              Trittschalldämmung — Kinderzimmer
//   Laminat verlegen, schwimmend    Laminat verlegen schwimmend inkl. 5%
//                                   Verschnitt — Kinderzimmer
//
// Das Komma gibt es im Produkt nicht, „inkl. 5% Verschnitt" steht dort im
// TITEL, und die Raumnamen hängen am Titel. Ob die Seite das übernimmt, ist
// die Entscheidung des Chief of Staff (Punkt 9.1), nicht meine — ich messe
// nur, dass es abweicht.
//
// ── Ein Fund nebenbei, der Marketing nicht betrifft ───────────────────────
//
// Für eine Arbeit stehen VIER Zeilen in derselben Katalogkategorie
// `Boden – Abschlussarbeiten`:
//
//   Übergangsschiene                    15,00 €/Stück
//   Übergangsprofil                     15,00 €/Stück
//   Übergangsprofil / Schwelle einbauen 15,00 €/Stück
//   Alu-Übergangsprofil                 18,00 €/Stück
//
// Drei zu 15,00 €, eine zu 18,00 €. Welche gilt, entscheidet heute der
// Matcher am Wortlaut des Diktats — dasselbe Muster wie PM-058 (Grundieren
// steht zweimal mit zwei Preisen), nur dass es hier dreimal derselbe Preis
// ist und deshalb noch kein Geld verschiebt. Es steht als Meldung in der
// Restliste, nicht als Auftrag.
//
// Prüfmeister · 17.09.2026
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk: 'boden_parkett', raeume, transkript } } as never)
  const text = ersetzeZahlenWorte(transkript)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen('boden_parkett', extraktion)
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
  const ergebnis = pruefeUndErgaenzeVollstaendigkeit('boden_parkett', eng.positionen, text, meta as never, signale as never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chips: string[] = r2.flatMap((r: any) =>
    (r.arbeiten ?? []).map((a: string) => `${a}${r.name ? ` — ${r.name}` : ''}`))
  return {
    positionen: normalisiereBodenPositionenAusAufnahme(
      ergaenzeAusAufnahmeHinweisen(ergebnis.positionen, chips, text), text,
    ) as { beschreibung: string; menge: number; einheit: string }[],
    fehlende: ergebnis.fehlende as string[],
  }
}

type Zeile = { beschreibung: string; menge: number; einheit: string }
const finde = (pos: Zeile[], m: RegExp) => pos.find(p => m.test(p.beschreibung))
function preis(pos: Zeile[], m: RegExp) {
  const p = finde(pos, m)
  if (!p) return null
  const g = gewerkFuerPosition(p.beschreibung, 'boden_parkett')
  return findePreisposition(p.beschreibung, p.einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))?.position.unit_price ?? null
}

// Das Diktat, unverändert aus `docs/landingpage-fuenf-beispiele.md`.
const T = 'Kinderzimmer, vier mal drei fünfzig. Laminat, gerade verlegt, '
  + 'Trittschalldämmung drunter. Sockelleisten neu, weiße MDF. '
  + 'An der Tür kommt eine Übergangsschiene hin.'
const R = () => [raum('Kinderzimmer', {
  laenge: 4, breite: 3.5, tueren: [TUER], belag: 'laminat', sockelleisten: true,
  arbeiten: ['laminat verlegen'],
})]

describe('Landingpage Beispiel 2 · Bodenleger, Kinderzimmer', () => {
  it('vier Zeilen, keine Fehlt-Einträge', () => {
    const { positionen, fehlende } = lauf(T, R())
    expect(positionen).toHaveLength(4)
    expect(fehlende).toEqual([])
  })

  it('Marketings dritte Frage · die Zeile heißt „Übergangsschiene", genau wie auf der Seite', () => {
    // Der eigentliche Grund für seine Frage. Kein Widerspruch: das Wort aus
    // dem Diktat steht auf dem Angebot.
    const p = finde(lauf(T, R()).positionen, /übergang/i)!
    expect(p.beschreibung).toBe('Übergangsschiene')
    expect(p.menge).toBe(1)
    expect(p.einheit).toBe('Stück')
    expect(preis(lauf(T, R()).positionen, /übergang/i)).toBe(15)
  })

  it('„Übergangsprofil" ist das Wort der Rückfrage, nicht des Angebots — und hier entsteht es gar nicht', () => {
    // `kontext-analyzer.ts:588` schlägt Übergangsprofile vor, wenn MEHRERE
    // Räume aneinanderstoßen. Ein Kinderzimmer ist ein Raum.
    expect(finde(lauf(T, R()).positionen, /übergangsprofil/i)).toBeUndefined()
  })

  it('die beiden anderen Titel: das Produkt ist länger als die Seite, nicht anders', () => {
    const { positionen } = lauf(T, R())
    expect(finde(positionen, /laminat/i)!.beschreibung)
      .toBe('Laminat verlegen schwimmend inkl. 5% Verschnitt — Kinderzimmer')
    expect(finde(positionen, /trittschall/i)!.beschreibung)
      .toBe('Trittschalldämmung — Kinderzimmer')
    // Das Komma der Seite („Laminat verlegen, schwimmend") ist der
    // KATALOG-Titel, nicht der Positionstitel — daher der Eindruck im
    // Quelltext.
    expect(DEFAULT_PRICES.some(p => p.title === 'Laminat verlegen, schwimmend')).toBe(true)
  })

  it('die vier Beträge der Seite stimmen — 366,30 € vor dem Kleinmaterial', () => {
    // Danach hat Marketing nicht gefragt; wenn ich den Lauf schon fahre,
    // rechne ich die Tabelle gleich mit nach.
    const { positionen } = lauf(T, R())
    expect(finde(positionen, /trittschall/i)!.menge).toBe(14)      // ohne Verschnitt
    expect(preis(positionen, /trittschall/i)).toBe(4.5)            //  63,00 €
    expect(finde(positionen, /laminat/i)!.menge).toBe(14.7)        // 14,00 + 5 %
    expect(preis(positionen, /laminat/i)).toBe(14)                 // 205,80 €
    expect(finde(positionen, /sockelleisten/i)!.menge).toBe(15)
    expect(preis(positionen, /sockelleisten/i)).toBe(5.5)          //  82,50 €
    const summe = positionen.reduce((s, p) => s + (preis(positionen, new RegExp(
      p.beschreibung.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')) ?? 0) * p.menge, 0)
    expect(Number(summe.toFixed(2))).toBe(366.3)
  })

  it('Meldung · vier Katalogzeilen für eine Arbeit, drei davon zum selben Preis', () => {
    // Kein Auftrag, eine Meldung — das PM-058-Muster ohne Geldweg.
    const uebergaenge = DEFAULT_PRICES
      .filter(p => p.category === 'Boden – Abschlussarbeiten' && /übergang/i.test(p.title))
      .map(p => `${p.title} · ${p.unit_price.toFixed(2)}`)
      .sort()
    expect(uebergaenge).toEqual([
      'Alu-Übergangsprofil Silber · 18.00',
      'Alu-Übergangsprofil · 18.00',
      'Übergangsprofil / Schwelle einbauen · 15.00',
      'Übergangsprofil · 15.00',
      'Übergangsschiene · 15.00',
    ])
  })
})
