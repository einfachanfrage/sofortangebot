// Nachtestplan vom 07.09.2026 — die sechs Fälle, die in
// `pruefmeister-soll.test.ts` fehlten.
//
// Sieben der dreizehn Fälle des Plans (PM-021, PM-022, PM-025, PM-026,
// PM-012, PM-030, PM-031) stehen dort bereits und laufen grün. Diese sechs
// standen nirgends — sie wurden bisher von Hand eingesprochen oder gar nicht.
//
// ── Ein Unterschied zum Soll-Test, der zählt ──────────────────────────────
// `pruefmeister-soll.test.ts` ruft `berechneMengen` DIREKT mit handgebauten
// Räumen. Damit überspringt er `verarbeiteExtraktion` — und alles, was erst
// dort entsteht, kann er nicht sehen: Leibungen, Fensterbänke, Zahlwörter,
// Maßreparatur, Mehrgewerk-Aufteilung. Genau deshalb galt PM-037 als „läuft
// nie durch": Der Fall war grün, nur hat ihn niemand an der Stelle geprüft,
// an der die Positionen entstehen.
//
// Diese Datei läuft deshalb über die Pipeline. Nicht abgedeckt bleibt der
// KI-Schritt davor (Sprache → Struktur); die Raumdaten sind so gesetzt, wie
// die Extraktion sie bei korrekter Arbeit liefern muss.
//
// Prüfmeister · 14.09.2026
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '@/lib/positions-gewerk'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'

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
    fensterAnzahl: zaehleFenster(transkript) || undefined,
    tuerenAnzahl: zaehleTueren(transkript) || undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeume: r2.map((r: any) => ({ name: r.name, hoehe: r.hoehe ?? null })),
  }
  const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
    gewerk, eng.positionen, transkript, meta as never, signale as never,
  )
  return positionen
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], muster: RegExp) => pos.find(p => muster.test(p.beschreibung))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const menge = (pos: any[], muster: RegExp) => finde(pos, muster)?.menge
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function preis(pos: any[], muster: RegExp, gewerk: string) {
  const p = finde(pos, muster)
  if (!p) return null
  const g = gewerkFuerPosition(p.beschreibung, gewerk)
  return findePreisposition(p.beschreibung, p.einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))?.position.unit_price ?? null
}

describe('PM-013 — Parkett-Fischgrät, Aufpreis als eigene Zeile', () => {
  const T = 'Wohnzimmer, acht mal viereinhalb. Eichenparkett, Fischgrät verlegt, das braucht ja mehr Verschnitt. Ist schon ne große Fläche, da muss wahrscheinlich ne Dehnungsfuge rein, mach das bitte mit rein. Boden nur, an den Wänden machen wir nix.'
  const pos = () => lauf('boden_parkett', T, [
    raum('Wohnzimmer', { laenge: 8, breite: 4.5, belag: 'parkett', verlegerichtung: 'fischgrät', arbeiten: ['parkett verlegen', 'dehnungsfuge einbauen'] }),
  ])

  it('Parkett 41,40 m² (36 + 15 % Verschnitt) zu 22,00 €', () => {
    expect(menge(pos(), /parkett verlegen/i)).toBe(41.4)
    expect(preis(pos(), /parkett verlegen/i, 'boden_parkett')).toBe(22)
  })
  it('Aufpreis Fischgrät als eigene Zeile, gleiche Menge, 14,00 €', () => {
    expect(menge(pos(), /aufpreis fischgrät/i)).toBe(41.4)
    expect(preis(pos(), /aufpreis fischgrät/i, 'boden_parkett')).toBe(14)
  })
  it('keine Wandposition im Wohnzimmer', () => {
    expect(finde(pos(), /wand streichen|wandfläche/i)).toBeUndefined()
  })

  // ── OFFENER FUND PM-013-A (Prüfmeister, 14.09.2026) ─────────────────────
  // „mach das bitte mit rein" — die Dehnungsfuge steht im Transkript UND als
  // Arbeit in der Extraktion, und es entsteht keine Position. Im Quelltext
  // erzeugt sie niemand (kein Treffer in boden.ts oder den
  // Vollständigkeits-Dateien); der Katalog führt sie doppelt:
  // „Dehnungsfuge mit Bewegungsprofil herstellen" 18,00 €/lfdm und
  // „Dehnungsfuge einbauen" 45,00 €/Stück.
  // Das ist nicht nur Geld: Ein Parkett über 40 m² ohne Dehnungsfuge wölbt
  // sich. Die Position fehlt, der Handwerker baut sie trotzdem — oder,
  // schlimmer, er verlässt sich auf die Liste.
  // Dieser Test ist bewusst als `fails` markiert: Sobald jemand die Position
  // baut, wird er ROT und muss auf `it` zurückgestellt werden. Sperrklinke,
  // kein Schweigen.
  it.fails('OFFEN: Dehnungsfuge erzeugt keine Position', () => {
    expect(finde(pos(), /dehnungsfuge|dehnfuge/i)).toBeDefined()
  })
})

describe('PM-033 — Fischgrät nur in einem von drei Räumen', () => {
  const T = 'Wohnzimmer, sechs mal vier fünfzig, da kommt Eichenparkett rein, Fischgrät verlegt. Schlafzimmer, vier mal drei sechzig, da wollen die Teppich, Bahnenware. Flur, fünf mal eins fünfzig, da kommt Laminat, ganz normal gerade. An den beiden Türen zum Wohnzimmer und zum Schlafzimmer jeweils eine Übergangsschiene, weil ja unterschiedliche Beläge. Trittschall nur unterm Laminat im Flur. Sockelleisten bleiben überall, wie sie sind.'
  const pos = () => lauf('boden_parkett', T, [
    raum('Wohnzimmer', { laenge: 6, breite: 4.5, belag: 'parkett', verlegerichtung: 'fischgrät', arbeiten: ['parkett verlegen'] }),
    raum('Schlafzimmer', { laenge: 4, breite: 3.6, belag: 'teppich', arbeiten: ['teppich verlegen'] }),
    raum('Flur', { laenge: 5, breite: 1.5, belag: 'laminat', verlegerichtung: 'standard', arbeiten: ['laminat verlegen'] }),
  ])

  it('Mengen je Raum: 31,05 / 14,40 / 7,88', () => {
    expect(menge(pos(), /parkett verlegen/i)).toBe(31.05)
    expect(menge(pos(), /teppich(boden)? verlegen/i)).toBe(14.4)
    expect(menge(pos(), /laminat verlegen/i)).toBe(7.88)
  })
  it('Aufpreis Fischgrät NUR im Wohnzimmer', () => {
    const treffer = pos().filter(p => /aufpreis fischgrät/i.test(p.beschreibung))
    expect(treffer).toHaveLength(1)
    expect(treffer[0].menge).toBe(31.05)
    expect(treffer[0].beschreibung.toLowerCase()).toContain('wohnzimmer')
  })
  it('zwei Übergangsschienen, Trittschall nur im Flur, keine Sockelleisten', () => {
    expect(menge(pos(), /übergangsschiene/i)).toBe(2)
    const trittschall = pos().filter(p => /trittschall/i.test(p.beschreibung))
    expect(trittschall).toHaveLength(1)
    expect(trittschall[0].beschreibung.toLowerCase()).toContain('flur')
    expect(finde(pos(), /sockelleiste/i)).toBeUndefined()
  })
})

describe('PM-032 — Klick-Vinyl durchgehend, drei Räume', () => {
  const T = 'Erdgeschosswohnung. Flur, sechs mal eins zwanzig. Wohnzimmer, fünf mal vier. Küche, drei mal zwo achtzig. Überall dasselbe Klick-Vinyl, gerade verlegt, durchgehend ohne Schwellen — das läuft von der Küche durch den Flur ins Wohnzimmer. Trittschalldämmung drunter. Nur zum Bad hin kommt eine Übergangsschiene, im Bad selbst machen wir nichts. Sockelleisten überall neu, weiße MDF. Jeder Raum hat eine normale Tür.'
  const belag = { belag: 'klick-vinyl', verlegerichtung: 'standard', sockelleisten: true, tueren: [TUER], arbeiten: ['vinyl verlegen', 'sockelleisten montieren'] }
  const pos = () => lauf('boden_parkett', T, [
    raum('Flur', { laenge: 6, breite: 1.2, ...belag }),
    raum('Wohnzimmer', { laenge: 5, breite: 4, ...belag }),
    raum('Küche', { laenge: 3, breite: 2.8, ...belag }),
  ])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const summe = (muster: RegExp) => pos().filter((p: any) => muster.test(p.beschreibung))
    .reduce((s: number, p: any) => s + p.menge, 0)

  it('Titel „Klick-Vinyl" zu 16,00 € — nicht „Vinyl-Boden" zu 22,00 €', () => {
    const p = finde(pos(), /vinyl/i)
    expect(p.beschreibung.toLowerCase()).toContain('klick-vinyl')
    expect(preis(pos(), /vinyl/i, 'boden_parkett')).toBe(16)
  })
  it('Belag 37,38 m², Dämmung 35,60 m², Sockelleisten 44,00 lfdm, eine Schiene', () => {
    expect(Number(summe(/vinyl verlegen/i).toFixed(2))).toBe(37.38)
    expect(Number(summe(/trittschall/i).toFixed(2))).toBe(35.6)
    expect(Number(summe(/sockelleisten montieren/i).toFixed(2))).toBe(44)
    expect(menge(pos(), /übergangsschiene/i)).toBe(1)
  })
})

describe('PM-011 — kein Zuschlag neben der Q2-Spachtelung', () => {
  const T = 'Ähm, Arbeitszimmer, vier mal drei zwanzig, Höhe zwo fünfzig. Ist n Altbau, die Wände sind ordentlich uneben — die müssen komplett gespachtelt werden, Qualitätsstufe Q2, nicht nur ne kleine Ausbesserung, wirklich die ganze Fläche. Danach zweimal streichen. Ein Fenster, Standardmaß, eine Tür, normal. Sockelleisten kleben wir ab, die bleiben wie sie sind.'
  const pos = () => lauf('maler', T, [
    raum('Arbeitszimmer', { laenge: 4, breite: 3.2, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['waende_streichen', 'spachteln'] }),
  ])

  it('Q2 vollflächig über die echte Wandfläche, 36,00 m² zu 9,00 €', () => {
    expect(menge(pos(), /spachtelarbeiten q2/i)).toBe(36)
    expect(preis(pos(), /spachtelarbeiten q2/i, 'maler')).toBe(9)
  })
  it('KEIN Erschwerniszuschlag „schwieriger Untergrund" neben der Q2-Zeile', () => {
    expect(finde(pos(), /erschwerniszuschlag.*untergrund/i)).toBeUndefined()
  })
  it('Altbau-Zuschlag bleibt, Sockelleisten abkleben 14,40 lfdm', () => {
    expect(finde(pos(), /erschwerniszuschlag altbau/i)).toBeDefined()
    expect(menge(pos(), /sockelleisten abkleben/i)).toBe(14.4)
  })
})

describe('PM-037 — Leibungen und Fensterbänke', () => {
  const T = 'Wohnzimmer, fünf mal vier, Höhe zwo sechzig. Wände zweimal streichen. Zwei Fenster, jeweils eins zwanzig mal einen Meter, die Leibungen werden mitgestrichen, fünfundzwanzig Zentimeter tief. Die Fensterbänke werden auch gestrichen. Eine Tür, normal Maß.'
  const pos = () => lauf('maler', T, [
    raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.6, tueren: [TUER], fenster: [FENSTER(2)], arbeiten: ['waende_streichen'] }),
  ])

  it('Fensterleibungen 1,60 m² — dreiseitig, nicht rundherum', () => {
    expect(menge(pos(), /leibungen streichen/i)).toBe(1.6)
  })
  it('Fensterbänke 0,60 m² als eigene Position', () => {
    expect(menge(pos(), /fensterbänke streichen/i)).toBe(0.6)
  })
  it('Wand 46,80 m², Boden schützen 20,00 m², Sockelleisten abkleben 18,00 lfdm', () => {
    expect(menge(pos(), /wand streichen 2x/i)).toBe(46.8)
    expect(menge(pos(), /boden (schützen|abdecken)/i)).toBe(20)
    expect(menge(pos(), /sockelleisten abkleben/i)).toBe(18)
  })
  it('beide Kleinteil-Positionen haben einen Preis (45,00 €/m², PM-037-A)', () => {
    expect(preis(pos(), /leibungen streichen/i, 'maler')).toBe(45)
    expect(preis(pos(), /fensterbänke streichen/i, 'maler')).toBe(45)
  })
})

// PM-002 fehlt hier bewusst: Der Fall ist gemischt (Maler + Boden in einem
// Raum) und hängt damit an der Gewerke-Aufteilung, die erst der KI-Schritt
// liefert. Mit einem handgebauten Raum entsteht immer nur die Hälfte — der
// Test würde etwas anderes prüfen als das Produkt. Gehört in den Live-Lauf
// (Spur 6 Nr. 3), nicht in diese Datei.
