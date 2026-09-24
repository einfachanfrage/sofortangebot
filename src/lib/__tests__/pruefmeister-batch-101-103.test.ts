// Fallbasis — Batch PM-101 bis PM-103 (Prüfmeister, 16.09.2026)
//
// Drei Soll-Fragen, die der Chief of Staff und Engineering am 16.09. aus dem
// Messen der PM-098/PM-099-Grenzen mitgebracht haben. Sie sind hier
// beantwortet — als Zusicherung, nicht als Prosa:
//
//   die qualifizierte Verneinung („nicht tapezieren, nur streichen")  → PM-101
//   „Ein Holzfenster, eine Tür." — Material oder Bestand?             → PM-102
//   „Heizkörper lackieren. Und die Türen auch."                       → PM-103
//
// Aufbau wie `pruefmeister-batch-89-97.test.ts`: über die Pipeline, Text
// einmal am Eingang normalisiert (K.2). Zu jedem Fund steht eine Kontrolle
// daneben — derselbe Satz ohne das fragliche Wort. Ohne Kontrolle ist ein
// Fund eine Behauptung.
//
// Fallbasis danach: 103 Fälle (die Nummerierung hat mit PM-099/PM-100 aus
// dem Live-Lauf die 100 erreicht).
//
// Prüfmeister · 16.09.2026
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
function laufVoll(gewerk: 'maler' | 'boden_parkett', transkript: string, raeume: any[]) {
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
  return pruefeUndErgaenzeVollstaendigkeit(gewerk, eng.positionen, text, meta as never, signale as never)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lauf = (g: 'maler' | 'boden_parkett', t: string, r: any[]) => laufVoll(g, t, r).positionen
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], m: RegExp) => pos.find(p => m.test(p.beschreibung))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const titel = (pos: any[]) => pos.map(p => p.beschreibung)
const fehltHat = (fehlende: string[], m: RegExp) => fehlende.some(f => m.test(f))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function preis(pos: any[], m: RegExp, gewerk: string) {
  const p = finde(pos, m)
  if (!p) return null
  const g = gewerkFuerPosition(p.beschreibung, gewerk)
  return findePreisposition(p.beschreibung, p.einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))?.position.unit_price ?? null
}
const katalog = (t: string) => DEFAULT_PRICES.find(p => p.title === t)!.unit_price

// ───────────────────────────────────────────────────────────────────────────
// PM-101 · „Die Wände nicht tapezieren, nur streichen."
//
// Die qualifizierte Verneinung: ein Satz, der eine Leistung ABBESTELLT und im
// selben Atemzug eine andere BEAUFTRAGT. Von Engineering beim Messen der
// PM-099-Grenzen gefunden.
//
// Gemessen am 16.09.2026, und es ist schwerer als gemeldet — der Satz geht in
// BEIDE Richtungen schief:
//
//   Soll (= Kontrolle „Die Wände streichen."):
//     Wand streichen 2x        45,00 m² ×  9,50 € = 427,50 €
//     Boden schützen           20,00 m² ×  1,20 € =  24,00 €
//     Sockelleisten abkleben   18,00 lfdm × 0,80 € = 14,40 €
//                                            Summe   465,90 €
//
//   Ist:
//     Boden schützen           20,00 m² ×  1,20 € =  24,00 €
//     Sockelleisten abkleben   18,00 lfdm × 0,80 € = 14,40 €
//     Tapete tapezieren        45,00 m² × 18,00 € = 810,00 €   ← abbestellt
//     Tapete/Raufaser 2x       45,00 m² × 11,00 € = 495,00 €   ← abbestellt
//                                            Summe 1.343,40 €
//
// 1.305,00 € nicht bestellte Tapezierarbeit stehen drin, 427,50 € bestellte
// Malerarbeit fehlen. Auf einem Auftrag von 465,90 € ist das der schwerste
// Sprachfund der Fallbasis — schwerer als PM-099 (277,25 €).
//
// Die Wortstellung ist egal (vier Fassungen gemessen), und `fehlende` bleibt
// leer: es gibt keine Rückfrage, die den Widerspruch sichtbar machen würde.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-101 · die qualifizierte Verneinung', () => {
  const R = () => [raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: ['wände streichen'] })]
  const T_VERNEINT = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Die Wände nicht tapezieren, nur streichen.'
  const T_KONTROLLE = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Die Wände streichen.'

  it('PM-101-C · Kontrolle: ohne den Nebensatz entsteht genau die Malerleistung', () => {
    const p = lauf('maler', T_KONTROLLE, R())
    expect(finde(p, /^Wand streichen 2x/)!.menge).toBe(45)
    expect(titel(p).some(t => /Tapete/i.test(t))).toBe(false)
  })

  it('PM-101-D · Kontrolle: die Preise, mit denen gerechnet wird, stehen im Katalog', () => {
    // `Tapete tapezieren` ist kein Katalogtitel — der Matcher landet mit
    // Score 0,90 auf `Vliestapete tapezieren`, 18,00 €/m². Die 810,00 € sind
    // also echtes Geld auf dem Kundenpapier, keine Nullzeile.
    expect(preis(lauf('maler', T_VERNEINT, R()), /^Tapete tapezieren/, 'maler')).toBe(katalog('Vliestapete tapezieren'))
    expect(katalog('Vliestapete tapezieren')).toBe(18)
    expect(katalog('Tapete / Raufaser überstreichen 2x')).toBe(11)
    expect(preis(lauf('maler', T_KONTROLLE, R()), /^Wand streichen 2x/, 'maler')).toBe(9.5)
  })

  it.fails('PM-101-A · die abbestellte Tapezierarbeit steht nicht im Angebot', () => {
    // Ist: `Tapete tapezieren` 45,00 m² und `Tapete / Raufaser überstreichen 2x`
    // 45,00 m² — zusammen 1.305,00 € für genau das, was der Satz abbestellt.
    expect(titel(lauf('maler', T_VERNEINT, R())).some(t => /Tapete/i.test(t))).toBe(false)
  })

  it.fails('PM-101-B · die bestellte Malerarbeit steht im Angebot', () => {
    // „nur streichen" ist die Bestellung. Ist: keine Wandzeile — sie ist durch
    // `Tapete / Raufaser überstreichen 2x` ersetzt worden.
    const wand = finde(lauf('maler', T_VERNEINT, R()), /^Wand streichen 2x/)
    expect(wand).toBeDefined()
    expect(wand!.menge).toBe(45)
  })

  it.fails('PM-101-E · die Wortstellung ändert nichts — auch andersherum bleibt es falsch', () => {
    const t = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Die Wände nur streichen, nicht tapezieren.'
    expect(titel(lauf('maler', t, R())).some(x => /Tapete/i.test(x))).toBe(false)
  })

  it.fails('PM-101-F · „Keine Tapete, nur streichen." ist derselbe Fall', () => {
    const t = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Keine Tapete, nur streichen.'
    expect(titel(lauf('maler', t, R())).some(x => /Tapete/i.test(x))).toBe(false)
  })

  it.fails('PM-101-G · oder der Widerspruch wird wenigstens erfragt', () => {
    // Die schwächere Forderung: Wenn die Pipeline den Satz nicht auflösen
    // kann, darf sie ihn nicht still in Geld verwandeln — dann gehört er in
    // die Fehlt-Liste. Ist: `fehlende` ist leer.
    const erg = laufVoll('maler', T_VERNEINT, R())
    expect(fehltHat(erg.fehlende, /tapet|streichen|widerspr/i)).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-102 · „Ein Holzfenster, eine Tür."
//
// Die Soll-Frage von Engineering: Ist die Nennung des MATERIALS schon eine
// Beauftragung, oder ist sie wie „ein Fenster" nur Bestand?
//
// Meine Antwort steht als Zusicherung hier: Bestand. Ein Zahlwort plus
// Bauteil ist eine Aufzählung dessen, WAS DA IST — das Holz sagt, woraus das
// Fenster besteht, nicht, dass daran gearbeitet wird. Genau die Lesart, die
// PM-098 für „ein Fenster" gebaut hat.
//
// Gemessen: der Satz erzeugt heute 100,00 € Lackierarbeit (Fenster
// abschleifen 20,00 € + grundieren 25,00 € + lackieren 55,00 €) plus eine
// Nullzeile `Abdecken Umgebung` ohne Katalogpreis. Die Kontrolle mit
// „Ein Fenster, eine Tür." erzeugt nichts davon — ein Wort Unterschied.
//
// Die Grenze nach oben bleibt, wo Engineering sie gezogen hat: „Die
// Holzfenster machen wir auch." ist eine echte Ansage und behält ihr Geld.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-102 · Material ist Bestand, nicht Beauftragung', () => {
  const R = () => [raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: ['wände streichen', 'decke streichen'] })]
  const KOPF = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig. Wände und Decke zweimal weiß streichen. '

  it('PM-102-C · Kontrolle: „Ein Fenster, eine Tür." erzeugt keine Lackierarbeit (PM-098)', () => {
    const p = lauf('maler', KOPF + 'Ein Fenster, eine Tür.', R())
    expect(titel(p).some(t => /Fenster (abschleifen|grundieren|lackieren)/i.test(t))).toBe(false)
  })

  it('PM-102-D · Kontrolle: „Die Holzfenster machen wir auch." behält ihre Zeilen', () => {
    // Die Grenze nach oben. Fällt diese Prüfung, ist beim Bauen von PM-102-A
    // zu viel weggenommen worden.
    const p = lauf('maler', KOPF + 'Die Holzfenster machen wir auch.', R())
    expect(finde(p, /Fenster lackieren/i)).toBeDefined()
  })

  it.fails('PM-102-A · die bloße Nennung „Ein Holzfenster, eine Tür." erzeugt keine Lackierarbeit', () => {
    const p = lauf('maler', KOPF + 'Ein Holzfenster, eine Tür.', R())
    expect(titel(p).some(t => /Fenster (abschleifen|grundieren|lackieren)/i.test(t))).toBe(false)
  })

  it.fails('PM-102-B · und damit auch dieselbe Liste wie ohne den Satz', () => {
    const mit = titel(lauf('maler', KOPF + 'Ein Holzfenster, eine Tür.', R()))
    const ohne = titel(lauf('maler', KOPF.trim(), R()))
    expect(mit).toEqual(ohne)
  })

  it.fails('PM-102-E · die Nullzeile „Abdecken Umgebung" entsteht gar nicht erst', () => {
    // Nebenbefund: die Zeile hat keinen Katalogpreis (sie steht im
    // Vokabular-Abgleich unter „ohne Preis") und stünde mit 0,00 € auf dem
    // Kundenpapier — zusätzlich zu den 100,00 €, die dort nicht hingehören.
    const p = lauf('maler', KOPF + 'Ein Holzfenster, eine Tür.', R())
    expect(finde(p, /Abdecken Umgebung/i)).toBeUndefined()
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-103 · „Heizkörper lackieren. Und die Türen auch."
//
// Der zweite Satz nennt das Bauteil, aber nicht die Arbeit. Engineering lässt
// die Tür deshalb bewusst weg — „lieber eine Zeile zu wenig, die der Betrieb
// nachträgt, als 280,00 € zu viel auf dem Kundenpapier."
//
// Mein Soll: Die RICHTUNG stimmt, keine Position. Die Ausführung stimmt
// nicht. Gemessen: Die Türen fehlen, UND `fehlende` ist leer — es bleibt
// keine Spur. Das sind 720,00 € (4 Türen × 20,00 + 25,00 + 90,00 + 45,00),
// die niemand nachträgt, weil niemand sie vermisst.
//
// Nach K.5 gilt für nicht gesagte Vorarbeit: in die Fehlt-Liste, nicht ins
// Angebot. Hier ist die Arbeit GESAGT, nur nicht auflösbar — dann erst recht.
// „Eine Zeile zu wenig" ist die richtige Entscheidung nur dann, wenn die
// fehlende Zeile sichtbar ist.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-103 · das unaufgelöste „auch"', () => {
  const R = () => [raum('Flur', { laenge: 4, breite: 1.5, hoehe: 2.5, arbeiten: [] })]
  const T_AUCH = 'Flur vier mal eins fünfzig, Höhe zwo fünfzig. Zwei Heizkörper lackieren. Und die Türen auch. Vier Innentüren.'
  const T_KONTROLLE = 'Flur vier mal eins fünfzig, Höhe zwo fünfzig. Zwei Heizkörper lackieren. Vier Innentüren lackieren.'

  it('PM-103-C · Kontrolle: ausgeschrieben entstehen die vier Türen vollständig', () => {
    const p = lauf('maler', T_KONTROLLE, R())
    expect(finde(p, /Türen lackieren/i)!.menge).toBe(4)
    expect(finde(p, /Türzarge lackieren/i)!.menge).toBe(4)
  })

  it('PM-103-D · Kontrolle: der Geldweg, um den es geht, steht im Katalog', () => {
    const je = katalog('Türen abschleifen') + katalog('Türen grundieren')
      + katalog('Türen lackieren — 2× Anstrich') + katalog('Türzarge lackieren')
    expect(je * 4).toBe(720)
  })

  it('PM-103-B · die Regel hält: keine erfundene Türposition', () => {
    // Das ist die Seite, die Engineering absichtlich so gebaut hat, und sie
    // ist richtig. Steht sie hier grün, ist PM-103-A kein Rückbau davon.
    const p = lauf('maler', T_AUCH, R())
    expect(titel(p).some(t => /Tür(en|zarge)/i.test(t))).toBe(false)
  })

  it.fails('PM-103-A · aber die weggelassene Tür hinterlässt eine Spur', () => {
    // Ist: `fehlende` ist leer. 720,00 € verschwinden lautlos.
    const erg = laufVoll('maler', T_AUCH, R())
    expect(fehltHat(erg.fehlende, /tür|zarge/i)).toBe(true)
  })
})
