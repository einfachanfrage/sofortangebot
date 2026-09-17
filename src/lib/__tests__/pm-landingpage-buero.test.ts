// Landingpage-Beleg: das Büro in der Fassung, die auf die Seite soll
// (Prüfmeister, 17.09.2026 — Antwort auf Marketings zwei Fragen aus
// `docs/pruefmeister-restliste.md`, Head of Marketing, 17.09.2026)
//
// Marketing hat zwei schmale Fragen gestellt und ausdrücklich KEINE Bewertung
// des Textes gewollt: kommt das so aus dem Produkt, ja oder nein.
//
//   1. Kleinmaterial — kommt die Pauschale von allein?
//   2. Das Büro einmal in der Fassung laufen lassen, die auf die Seite soll:
//      Q3 + zweimal streichen + zwei Heizkörper lackieren — UND mit „Ein
//      Fenster, eine Tür", weil die Arbeitsreihenfolge verlangt, dass diese
//      Krücke rausfliegt, bevor die Seite live geht.
//
// Frage 2 ist der eigentliche Grund für diese Datei. Der Satz enthält
// „lackieren" UND eine genannte Öffnung — das ist auf das Wort genau die
// PM-098-Konstellation (Nennung einer Öffnung ist keine Beauftragung). Wenn
// PM-098 trägt, ist der Entwurf belegt und die Auflage aus der
// Arbeitsreihenfolge in einem Zug mit erledigt. Wenn nicht, steht der Fund
// vor dem ersten Kunden statt danach.
//
// Ergebnis: PM-098 trägt. Die drei Fassungen (ohne Öffnungssatz, mit
// Öffnungssatz, Zahlwort statt Ziffer) liefern Zeile für Zeile dasselbe
// Angebot, 1.518,80 € netto. Keine Fenster- und keine Türlackierung.
//
// Aufbau wie `pruefmeister-batch-47-56.test.ts`: über die Pipeline, Text
// einmal am Eingang normalisiert (K.2).
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
import { KLEINMATERIAL_CONFIG, kleinmaterialPosition } from '../gewerke-config'

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(gewerk: 'maler' | 'boden_parkett', transkript: string, raeume: any[]) {
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
  return normalisiereBodenPositionenAusAufnahme(
    ergaenzeAusAufnahmeHinweisen(ergebnis.positionen, chips, text), text,
  )
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], m: RegExp) => pos.find(p => m.test(p.beschreibung))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const menge = (pos: any[], m: RegExp) => finde(pos, m)?.menge
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function einzelpreis(p: any, gewerk: string) {
  const g = gewerkFuerPosition(p.beschreibung, gewerk)
  return findePreisposition(p.beschreibung, p.einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))?.position.unit_price ?? null
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function preis(pos: any[], m: RegExp, gewerk: string) {
  const p = finde(pos, m)
  return p ? einzelpreis(p, gewerk) : null
}
// Arbeitssumme = die Bemessungsgrundlage der Pauschalen. Genau so rechnet
// `generiere-positionen/route.ts` (Zeile 775 ff.): alle Arbeitszeilen, ohne
// die Pauschalzeilen selbst.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function arbeitsSumme(pos: any[], gewerk: string) {
  let s = 0
  for (const p of pos) {
    const ep = einzelpreis(p, gewerk)
    if (ep !== null) s += ep * p.menge
  }
  return Number(s.toFixed(2))
}

// ───────────────────────────────────────────────────────────────────────────
// Frage 2 · Das Büro in der Fassung, die auf die Seite soll
// ───────────────────────────────────────────────────────────────────────────
//
// Drei Fassungen, damit der Beleg nicht an einer Schreibweise hängt:
//   SEITE   — der Satz aus dem Entwurf, ohne Öffnungssatz
//   LIVE    — derselbe Satz PLUS „Ein Fenster, eine Tür." (Krücke raus)
//   ZAHLWORT— wie LIVE, aber „die zwei Heizkörper" ausgeschrieben. Die
//             Spracherkennung liefert Ziffern (Live-Lauf 15.09.), auf der
//             Seite steht das Zahlwort. Beide müssen dasselbe ergeben.
describe('Landingpage Beispiel 4 · Büro mit Q3 und zwei Heizkörpern', () => {
  const KOPF = 'Büro, fünf mal vier, zwei sechzig hoch. Die Wände müssen vollflächig gespachtelt werden, '
    + 'Qualitätsstufe Q3, da kommt Streiflicht drauf. Danach zweimal streichen. '
  const T_SEITE = KOPF + 'Die 2 Heizkörper bitte mit lackieren.'
  const T_LIVE = KOPF + 'Die 2 Heizkörper bitte mit lackieren. Ein Fenster, eine Tür.'
  const T_ZAHLWORT = KOPF + 'Die zwei Heizkörper bitte mit lackieren. Ein Fenster, eine Tür.'

  const R = () => [raum('Büro', {
    laenge: 5, breite: 4, hoehe: 2.6, tueren: [TUER], fenster: [FENSTER()],
    arbeiten: ['waende_streichen', 'spachteln', 'heizkoerper lackieren'],
  })]
  const pos = (t: string) => lauf('maler', t, R())

  it('acht Zeilen, 1.518,80 € netto vor den Pauschalen', () => {
    const p = pos(T_LIVE)
    expect(p).toHaveLength(8)
    expect(arbeitsSumme(p, 'maler')).toBe(1518.8)
  })

  it('Q3 über die echte Wandfläche: 46,80 m² zu 14,00 € — nie der Q2-Satz', () => {
    expect(menge(pos(T_LIVE), /spachtelarbeiten q3/i)).toBe(46.8)
    expect(preis(pos(T_LIVE), /spachtelarbeiten q3/i, 'maler')).toBe(14)
    expect(finde(pos(T_LIVE), /spachtelarbeiten q2/i)).toBeUndefined()
  })

  it('Grundierung kommt von allein, über dieselbe Fläche', () => {
    expect(menge(pos(T_LIVE), /grundierung|voranstrich/i)).toBe(46.8)
    expect(preis(pos(T_LIVE), /grundierung|voranstrich/i, 'maler')).toBe(4.5)
  })

  it('drei Heizkörper-Zeilen, je Menge 2 — zusammen 170,00 €', () => {
    const p = pos(T_LIVE)
    expect(menge(p, /heizkörper abschleifen/i)).toBe(2)
    expect(menge(p, /heizkörper grundieren/i)).toBe(2)
    expect(menge(p, /heizkörper lackieren|heizkörper streichen/i)).toBe(2)
    expect(preis(p, /heizkörper abschleifen/i, 'maler')).toBe(20)
    expect(preis(p, /heizkörper grundieren/i, 'maler')).toBe(25)
    expect(preis(p, /heizkörper lackieren|heizkörper streichen/i, 'maler')).toBe(40)
  })

  // ── Der eigentliche Punkt: PM-098 trägt in dieser Konstellation ──────────
  // „lackieren" steht im Satz, Fenster und Tür stehen im Satz — und zwar in
  // einem ANDEREN Satz als das Lackieren. Genau der Fall, der vor dem
  // PM-098-Fix sieben Zeilen für 280,00 € erfunden hat.
  it('PM-098 trägt: keine Fenster- und keine Türlackierung, obwohl beide genannt sind', () => {
    const p = pos(T_LIVE)
    expect(finde(p, /fenster (abschleifen|grundieren|lackieren|streichen)/i)).toBeUndefined()
    expect(finde(p, /tür(en)? (abschleifen|grundieren|lackieren|streichen)|türzarge/i)).toBeUndefined()
  })

  // Die Krücke aus der Arbeitsreihenfolge — „Beispiel 4 umgeht PM-098 heute
  // dadurch, dass Fenster und Tür nicht im Satz stehen" — ist damit
  // gegenstandslos: der Öffnungssatz ändert Zeile für Zeile nichts.
  it('der Öffnungssatz ändert das Angebot nicht — die Krücke wird nicht mehr gebraucht', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const abbild = (ps: any[]) => ps.map(p => `${p.beschreibung}|${p.menge}`).join('\n')
    expect(abbild(pos(T_LIVE))).toBe(abbild(pos(T_SEITE)))
  })

  it('Zahlwort und Ziffer ergeben dasselbe — die Seite darf „zwei" schreiben', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const abbild = (ps: any[]) => ps.map(p => `${p.beschreibung}|${p.menge}`).join('\n')
    expect(abbild(pos(T_ZAHLWORT))).toBe(abbild(pos(T_LIVE)))
  })

  // Marketing hat nach der SUMME gefragt, nicht nach den Titeln. Die Summe
  // stimmt; zwei Zeilentitel auf der Seite lauten anders als im Produkt, und
  // das gehört gesagt, weil die Seite Positionstitel zeigt.
  it('die Titel, die auf der Seite anders lauten als im Produkt', () => {
    const p = pos(T_LIVE)
    expect(finde(p, /^Boden schützen — Büro$/)).toBeDefined()        // Seite: „Boden abdecken"
    expect(finde(p, /^Wand streichen 2x — Büro$/)).toBeDefined()     // Seite: „Wände zweimal streichen"
    expect(finde(p, /^Heizkörper lackieren \(2× Anstrich\)$/)).toBeDefined() // Seite: „Heizkörper lackieren"
  })
})

// ───────────────────────────────────────────────────────────────────────────
// Frage 1 · Kleinmaterial — kommt die Pauschale von allein?
// ───────────────────────────────────────────────────────────────────────────
//
// Ja. Und der Grund ist ein anderer als Marketing vermutet hat: nicht, dass
// sie „im Testkonto nicht hinterlegt" wäre. Sie ist per Gewerk-Default AN
// (`KLEINMATERIAL_CONFIG`, alle sechs aktiven Gewerke `aktiv: true`); ein
// Betrieb, der gar nichts einstellt, bekommt sie trotzdem. Eingehängt ist sie
// seit CoS-E-041 in `generiere-positionen/route.ts` (Zeile 815 ff.) — also
// EINE Ebene über der Pipeline, die dieser Prüfstand fährt. Deshalb steht sie
// in keinem meiner Läufe und trotzdem live in jedem Angebot.
//
// Belegt hat das der Live-Lauf vom 16.09. selbst: L-08 in
// `pruefmeister-restliste.md` — die Pauschale kam in 048 bis 054 und fehlte
// in 047 und 055.
describe('Kleinmaterial-Pauschale · kommt von allein, nach einer Schwelle', () => {
  it('alle aktiven Gewerke stehen ab Werk auf „an" — ohne dass ein Betrieb etwas einstellt', () => {
    for (const [gewerk, cfg] of Object.entries(KLEINMATERIAL_CONFIG)) {
      expect(cfg.aktiv, gewerk).toBe(true)
    }
    expect(KLEINMATERIAL_CONFIG.maler).toMatchObject({ schwelle_eur: 200, betrag_eur: 25 })
    expect(KLEINMATERIAL_CONFIG.boden_parkett).toMatchObject({ schwelle_eur: 300, betrag_eur: 35 })
  })

  // `betriebsConfig = null` ist der Betrieb, der die Einstellung nie
  // angefasst hat — genau Marketings Fall.
  it('ohne jede Betriebs-Einstellung: Maler 25,00 €, Boden 35,00 €', () => {
    expect(kleinmaterialPosition('maler', 1518.8, null)).toMatchObject({ unit_price: 25, unit: 'Pauschale' })
    expect(kleinmaterialPosition('boden_parkett', 366.3, null)).toMatchObject({ unit_price: 35, unit: 'Pauschale' })
  })

  // Damit sind die vier Tabs des Entwurfs belegt.
  it('die vier Summen des Entwurfs stimmen — Arbeitssumme plus Pauschale', () => {
    const mit = (g: 'maler' | 'boden_parkett', s: number) =>
      Number((s + (kleinmaterialPosition(g, s, null)?.unit_price ?? 0)).toFixed(2))
    expect(mit('boden_parkett', 366.3)).toBe(401.3)   // Bodenleger · Laminat
    expect(mit('maler', 1666.31)).toBe(1691.31)       // Maler · ganze Wohnung
    expect(mit('maler', 703)).toBe(728)               // Maler · Wohnzimmer
    expect(mit('maler', 1518.8)).toBe(1543.8)         // Maler · Büro mit Q3
  })

  // ── L-08 erledigt, und zwar gegen mich ──────────────────────────────────
  // L-08 lautete: die Pauschale komme „mal 25,00 €, mal nichts", abhängig
  // davon, „wie viele Positionen zufällig entstanden sind". Das war falsch.
  // Es ist die Schwelle, und die lässt sich erklären — womit L-08 sein
  // eigenes Soll („entweder immer oder nach einer Regel, die sich erklären
  // lässt") bereits erfüllt.
  it('L-08 · PM-047 bleibt ohne Pauschale, weil 170,80 € unter der Schwelle 200,00 € liegen', () => {
    const p = lauf('maler', 'Schlafzimmer, vier mal drei fünfzig, Höhe zwo fünfzig. Nur die Decke streichen, zweimal. Wände bleiben wie sie sind. Ein Fenster, eine Tür normal.',
      [raum('Schlafzimmer', { laenge: 4, breite: 3.5, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['decke_streichen'] })])
    const s = arbeitsSumme(p, 'maler')
    expect(s).toBe(170.8)
    expect(kleinmaterialPosition('maler', s, null)).toBeNull()
  })

  it('L-08 · PM-055 bleibt ohne Pauschale, weil 288,00 € unter der Boden-Schwelle 300,00 € liegen', () => {
    const p = lauf('boden_parkett', 'Arbeitszimmer, vier mal drei. Korkboden, vollflächig verklebt.',
      [raum('Arbeitszimmer', { laenge: 4, breite: 3, belag: 'kork', verlegerichtung: 'standard', arbeiten: ['kork verlegen'] })])
    const s = arbeitsSumme(p, 'boden_parkett')
    expect(s).toBe(288)
    expect(kleinmaterialPosition('boden_parkett', s, null)).toBeNull()
  })

  it('L-08 · Gegenprobe PM-048: 511,50 € über der Schwelle — die Pauschale kommt', () => {
    const p = lauf('maler', 'Wohnzimmer, fünf mal viereinhalb, Höhe zwo sechzig. Wände zweimal streichen. Ein Fenster, eine Tür normal.',
      [raum('Wohnzimmer', { laenge: 5, breite: 4.5, hoehe: 2.6, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['waende_streichen'] })])
    const s = arbeitsSumme(p, 'maler')
    expect(s).toBe(511.5)
    expect(kleinmaterialPosition('maler', s, null)).toMatchObject({ unit_price: 25 })
  })
})
