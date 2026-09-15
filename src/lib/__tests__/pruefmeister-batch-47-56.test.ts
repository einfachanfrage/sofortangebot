// Fallbasis-Batch PM-047 bis PM-056 (Prüfmeister, 15.09.2026)
//
// Zehn neue Fälle auf dem Weg zu 100. Aufbau wie
// `pruefmeister-nachtest-0709.test.ts`: über die Pipeline, nicht direkt in die
// Engine — sonst fehlen Leibungen, Mehrgewerk und Maßreparatur.
//
// Nicht abgedeckt bleibt der KI-Schritt davor. Zwei Themen, die ich für diesen
// Batch vorgesehen hatte, sind deshalb NICHT hier: Selbstkorrektur mitten im
// Diktat und ausgeschriebene Zahlwörter. Beides entsteht vor der Pipeline;
// nachgestellt bleiben die Raummaße unverändert stehen. Gehört in den
// Live-Lauf, nicht in eine Testdatei, die etwas anderes prüfen würde als das,
// was sie behauptet.
//
// Mehrere Prüfungen stehen als `it.fails` — sie halten ein Soll fest, das heute
// nicht erfüllt ist. Wird der Fall gebaut, schlägt die Sperrklinke an und der
// Test muss auf `it` zurückgestellt werden.
//
// Stand 15.09., nach Manfreds Durchsicht der Diktate überarbeitet:
//   PM-050-B  Dübellöcher: Katalog auf Pauschale 20,00 € umstellen
//   PM-052-A  Zahlwort „die zwei Heizkörper" ergibt Menge 1
//   PM-053-A  Erschwerniszuschlag Raumhöhe feuert außen neben dem Gerüst
//   PM-055-A  Verschnitt fehlt beim geklebten Belag
//   PM-056-A  Altbelag-Titel nennt den neuen Belag (TN-127)
//   PM-056-B  Entsorgungsfahrt fehlt
//   PM-063-A  „bauseits gestellt" erzeugt trotzdem 450 € Gerüst
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
  return pruefeUndErgaenzeVollstaendigkeit(gewerk, eng.positionen, transkript, meta as never, signale as never).positionen
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

describe('PM-047 — nur die Decke, die Wände bleiben', () => {
  const T = 'Schlafzimmer, vier mal drei fünfzig, Höhe zwo fünfzig. Nur die Decke streichen, zweimal. Wände bleiben wie sie sind. Ein Fenster, eine Tür normal.'
  const pos = () => lauf('maler', T, [raum('Schlafzimmer', { laenge: 4, breite: 3.5, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['decke_streichen'] })])
  it('Decke 14,00 m² zu 11,00 €', () => {
    expect(menge(pos(), /decke streichen 2x/i)).toBe(14)
    expect(preis(pos(), /decke streichen 2x/i, 'maler')).toBe(11)
  })
  it('keine Wandposition und keine Sockelleisten', () => {
    expect(finde(pos(), /wand streichen/i)).toBeUndefined()
    expect(finde(pos(), /sockelleisten/i)).toBeUndefined()
  })
})

describe('PM-048 — Wandfläche mit zwei Öffnungen, VOB-Übermessung', () => {
  const T = 'Wohnzimmer, fünf mal viereinhalb, Höhe zwo sechzig. Wände zweimal streichen. Ein Fenster, eine Tür normal.'
  const pos = () => lauf('maler', T, [raum('Wohnzimmer', { laenge: 5, breite: 4.5, hoehe: 2.6, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['waende_streichen'] })])
  it('49,40 m² — Umfang 19 × 2,60, Öffnungen unter 2,5 m² nicht abgezogen', () => {
    expect(menge(pos(), /wand streichen 2x/i)).toBe(49.4)
    expect(preis(pos(), /wand streichen 2x/i, 'maler')).toBe(9.5)
  })
  it('Sockelleisten 19,00 lfdm — Tür unter 1 m wird nicht abgezogen (VOB-012)', () => {
    expect(menge(pos(), /sockelleisten abkleben/i)).toBe(19)
  })
})

describe('PM-049 — Wand zweimal, Decke einmal im selben Raum', () => {
  const T = 'Küche, vier Meter zwanzig mal drei Meter sechzig, Höhe zwo fünfzig. Wände zweimal streichen, Decke reicht einmal. Zwei Fenster Standardmaß, eine Tür normal.'
  const pos = () => lauf('maler', T, [raum('Küche', { laenge: 4.2, breite: 3.6, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER(2)], arbeiten: ['waende_streichen', 'decke_streichen'] })])
  it('Wand 2x zu 9,50 €, Decke 1x zu 7,00 € — zwei Anstrichzahlen nebeneinander', () => {
    expect(menge(pos(), /wand streichen 2x/i)).toBe(39)
    expect(preis(pos(), /wand streichen 2x/i, 'maler')).toBe(9.5)
    expect(menge(pos(), /decke streichen 1x/i)).toBe(15.12)
    expect(preis(pos(), /decke streichen 1x/i, 'maler')).toBe(7)
  })
})

describe('PM-050 — Kleinreparatur: drei Dübellöcher, keine Vollflächenspachtelung', () => {
  const T = 'Küche, vier mal drei, Höhe zwo fünfzig. Wände zweimal streichen. Drei Dübellöcher müssen noch gespachtelt werden, sonst nix Großes. Eine Tür, ein Fenster.'
  const pos = () => lauf('maler', T, [raum('Küche', { laenge: 4, breite: 3, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['waende_streichen'] })])
  it('eine eigene Zeile für die Ausbesserung — nicht als Fläche', () => {
    const p = finde(pos(), /dübellöcher|kleine ausbesserungen/i)
    expect(p).toBeDefined()
  })
  it('keine Vollflächenspachtelung daneben — das ist der teure Verwechsler', () => {
    expect(finde(pos(), /spachtelarbeiten q[234]|fläche spachteln|wände spachteln/i)).toBeUndefined()
  })
  // ── PM-050-B, offen — Katalogentscheidung (Manfred, 15.09.) ────────────
  // 3,00 € je Loch heißt bei drei Löchern 9,00 €. Dafür fährt kein Betrieb
  // raus. Kleine Ausbesserungen sind eine Pauschale, Praxis 15–25 €.
  // Soll: Katalogzeile „Kleine Ausbesserungen (bis 5 Stellen)", Pauschale,
  // 20,00 €. Ab der sechsten Stelle greift die Flächen- bzw. Zeitzeile.
  // Mit der Pauschale erledigt sich hier auch die Mengenfrage — das Zahlwort
  // bleibt über PM-052-A abgedeckt.
  it.fails('OFFEN: Ausbesserung ist eine Pauschale zu 20,00 €', () => {
    const p = finde(pos(), /dübellöcher|kleine ausbesserungen/i)
    expect(p.einheit).toBe('Pauschale')
    expect(preis(pos(), /dübellöcher|kleine ausbesserungen/i, 'maler')).toBe(20)
  })
})

describe('PM-051 — Q3 vollflächig, nicht Q2', () => {
  const T = 'Büro, fünf mal vier, Höhe zwo sechzig. Die Wände müssen vollflächig gespachtelt werden, Qualitätsstufe Q3, weil da Streiflicht draufkommt. Danach zweimal streichen. Ein Fenster, eine Tür.'
  const pos = () => lauf('maler', T, [raum('Büro', { laenge: 5, breite: 4, hoehe: 2.6, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['waende_streichen', 'spachteln'] })])
  it('Spachtelarbeiten Q3 über die echte Wandfläche zu 14,00 € — nie der Q2-Satz', () => {
    expect(menge(pos(), /spachtelarbeiten q3/i)).toBe(46.8)
    expect(preis(pos(), /spachtelarbeiten q3/i, 'maler')).toBe(14)
    expect(finde(pos(), /spachtelarbeiten q2/i)).toBeUndefined()
  })
  it('Grundierung auf der frisch gespachtelten Fläche — fachlich richtig', () => {
    expect(menge(pos(), /grundierung|grundieren/i)).toBe(46.8)
  })
})

describe('PM-052 — Heizkörper: drei Arbeitsgänge, drei Zeilen', () => {
  const T = 'Wohnzimmer, fünf mal vier, Höhe zwo fünfzig. Wände zweimal streichen. Die zwei Heizkörper bitte mit lackieren.'
  const pos = () => lauf('maler', T, [raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['waende_streichen', 'heizkoerper lackieren'] })])
  it('abschleifen 20,00 € · grundieren 25,00 € · lackieren 40,00 €', () => {
    expect(preis(pos(), /heizkörper abschleifen/i, 'maler')).toBe(20)
    expect(preis(pos(), /heizkörper grundieren/i, 'maler')).toBe(25)
    expect(preis(pos(), /heizkörper lackieren/i, 'maler')).toBe(40)
  })
  it('keine Türen und keine Fenster dazuerfunden', () => {
    expect(finde(pos(), /türen (abschleifen|grundieren|lackieren)|türzarge/i)).toBeUndefined()
    expect(finde(pos(), /fenster (abschleifen|grundieren|lackieren)/i)).toBeUndefined()
  })
  // Wer lackiert, klebt nicht ab. Die beiden Zeilen liegen im Katalog
  // nebeneinander — das ist die Verwechslung, die am nächsten liegt.
  it('kein „Heizkörper abkleben" neben dem Lackieren', () => {
    expect(finde(pos(), /heizkörper abkleben/i)).toBeUndefined()
  })
  // ── offen, gehört zu PM-045-A (stündlicher Lauf, 15.09.) ───────────────
  // „Die ZWEI Heizkörper" — im Angebot steht Menge 1. Der Betrieb schleift,
  // grundiert und lackiert zwei und bekommt einen bezahlt: 85,00 € weniger.
  // Die Zahl steht im Satz, sie wird nur nicht gelesen.
  it.fails('OFFEN: „die zwei Heizkörper" ergibt Menge 2', () => {
    expect(menge(pos(), /heizkörper lackieren/i)).toBe(2)
  })
})

describe('PM-053 — Fassade zweimal streichen, Gerüst stellen wir', () => {
  // „Gerüst wird gestellt" ist auf dem Bau zweideutig — bauseits gestellt
  // heißt: steht schon da, wird nicht berechnet. Das Diktat sagt deshalb
  // ausdrücklich, wer stellt. Der bauseitige Fall ist PM-063.
  const T = 'Einfamilienhaus, Fassade Nordseite, zwölf Meter lang, Wandhöhe sechs Meter. Zwei Fenster, jeweils eins zwanzig mal eins vierzig. Fassade zweimal streichen mit Fassadenfarbe, vorher grundieren. Wir stellen das Gerüst.'
  const pos = () => lauf('maler', T, [raum('Fassade', { laenge: 12, hoehe: 6, fenster: [{ anzahl: 2, breite: 1.2, hoehe: 1.4, annahme: false }], arbeiten: ['fassade streichen'] })])
  it('Fassadenfläche 72,00 m² — Fenster unter 2,5 m² nicht abgezogen', () => {
    expect(menge(pos(), /fassadenfläche streichen 2x/i)).toBe(72)
  })
  it('Grundierung über dieselbe Fläche, eigener Fassadenpreis 6,00 €', () => {
    expect(menge(pos(), /fassadengrundierung/i)).toBe(72)
    expect(preis(pos(), /fassadengrundierung/i, 'maler')).toBe(6)
  })
  it('Gerüst als eigene Position', () => {
    expect(finde(pos(), /gerüst/i)).toBeDefined()
  })
  // ── PM-053-A, offen — Doppelberechnung (Manfred, 15.09.) ───────────────
  // Der Zuschlag Raumhöhe > 3 m ist der Innenfall: Leiter oder Rollgerüst
  // statt Stehen auf dem Boden. Außen IST das Gerüst die Erschwernis, und es
  // steht mit 450,00 € als eigene Zeile drin. Beides zusammen ist zweimal
  // Geld für dieselbe Sache — das fällt spätestens dem Bauleiter auf.
  it.fails('OFFEN: außen kein Erschwerniszuschlag Raumhöhe neben dem Gerüst', () => {
    expect(finde(pos(), /erschwerniszuschlag raumhöhe/i)).toBeUndefined()
  })
})

describe('PM-063 — Gerüst steht schon, bauseits gestellt', () => {
  const T = 'Einfamilienhaus, Fassade Nordseite, zwölf Meter lang, Wandhöhe sechs Meter. Fassade zweimal streichen, vorher grundieren. Das Gerüst wird bauseits gestellt, das steht schon.'
  const pos = () => lauf('maler', T, [raum('Fassade', { laenge: 12, hoehe: 6, fenster: [{ anzahl: 2, breite: 1.2, hoehe: 1.4, annahme: false }], arbeiten: ['fassade streichen'] })])
  it('Fassade und Grundierung stehen wie bei PM-053', () => {
    expect(menge(pos(), /fassadenfläche streichen 2x/i)).toBe(72)
    expect(menge(pos(), /fassadengrundierung/i)).toBe(72)
  })
  // ── PM-063-A, offen ────────────────────────────────────────────────────
  // „bauseits" wird nicht gelesen: das Angebot enthält trotzdem „Gerüst
  // stellen (Pauschale)" zu 450,00 €. Der Kunde hat das Gerüst schon stehen
  // und liest eine Position, die er nicht bestellt hat.
  it.fails('OFFEN: bauseits gestelltes Gerüst wird nicht berechnet', () => {
    expect(finde(pos(), /gerüst stellen/i)).toBeUndefined()
  })
})

describe('PM-054 — Boden komplett: Belag, Dämmung, Leisten, Schiene', () => {
  const T = 'Kinderzimmer, vier mal drei fünfzig. Laminat, gerade verlegt, mit Trittschalldämmung drunter. Sockelleisten neu montieren, weiße MDF. Eine Tür, da kommt eine Übergangsschiene hin.'
  const pos = () => lauf('boden_parkett', T, [raum('Kinderzimmer', { laenge: 4, breite: 3.5, belag: 'laminat', verlegerichtung: 'standard', sockelleisten: true, tueren: [TUER], arbeiten: ['laminat verlegen', 'trittschall', 'sockelleisten montieren'] })])
  it('Laminat 14,70 m² (14 + 5 % Verschnitt) zu 14,00 €', () => {
    expect(menge(pos(), /laminat verlegen/i)).toBe(14.7)
    expect(preis(pos(), /laminat verlegen/i, 'boden_parkett')).toBe(14)
  })
  it('Dämmung auf der Rohfläche 14,00 m² — ohne Verschnitt', () => {
    expect(menge(pos(), /trittschall/i)).toBe(14)
  })
  it('Sockelleisten 15,00 lfdm und eine Schiene', () => {
    expect(menge(pos(), /sockelleisten montieren/i)).toBe(15)
    expect(menge(pos(), /übergangsschiene/i)).toBe(1)
  })
})

describe('PM-055 — Kork vollflächig verklebt', () => {
  const T = 'Arbeitszimmer, vier mal drei. Korkboden, vollflächig verklebt.'
  const pos = () => lauf('boden_parkett', T, [raum('Arbeitszimmer', { laenge: 4, breite: 3, belag: 'kork', verlegerichtung: 'standard', arbeiten: ['kork verlegen'] })])
  it('Verlegeart steht im Titel und trifft die teurere Zeile: 24,00 €', () => {
    const p = finde(pos(), /kork verlegen/i)
    expect(p.beschreibung).toMatch(/vollflächig verklebt/i)
    expect(preis(pos(), /kork verlegen/i, 'boden_parkett')).toBe(24)
  })
  // ── PM-055-A, offen — Regelfehler (Manfred, 15.09.) ────────────────────
  // Heute gibt es 5 % Verschnitt nur beim schwimmenden Belag. Kork kommt in
  // Platten, da ist der Verschnitt eher höher als beim Klick-Laminat. Eine
  // Regel „Verschnitt nur bei schwimmend" ist fachlich falsch.
  // Entscheidung: 5 % auf jeden Belag, unabhängig von der Verlegeart;
  // 15 % bei Fischgrät und Diagonalverlegung. Soll hier: 12,60 m².
  it.fails('OFFEN: 12,60 m² — 5 % Verschnitt auch beim geklebten Belag', () => {
    expect(menge(pos(), /kork verlegen/i)).toBe(12.6)
  })
})

describe('PM-056 — alter Teppich raus, Laminat rein', () => {
  const T = 'Schlafzimmer, vier mal drei fünfzig. Der alte Teppichboden ist vollflächig verklebt und muss raus und entsorgt werden. Danach Laminat, gerade verlegt.'
  const pos = () => lauf('boden_parkett', T, [raum('Schlafzimmer', { laenge: 4, breite: 3.5, belag: 'laminat', altbelag: 'teppich', verlegerichtung: 'standard', altbelag_entfernen: true, altbelag_vorhanden: true, arbeiten: ['altbelag entfernen', 'laminat verlegen'] })])
  it('neuer Belag: Laminat 14,70 m² zu 14,00 €', () => {
    expect(menge(pos(), /laminat verlegen/i)).toBe(14.7)
    expect(preis(pos(), /laminat verlegen/i, 'boden_parkett')).toBe(14)
  })
  it('der Altbelag wird auf der Rohfläche entfernt, 14,00 m²', () => {
    expect(menge(pos(), /entfern|demontier/i)).toBe(14)
  })
  // ── PM-056-A, offen — das ist TN-127 ───────────────────────────────────
  // Im Raum liegt TEPPICH. Im Angebot steht „Laminat demontieren und
  // entsorgen" — der Titel nimmt den NEUEN Belag. Zweitens fehlt „verklebt":
  // verklebter Teppich kostet 9,00 €/m², loser 6,00 €. Auf 14 m² sind das
  // 42,00 €, und auf dem Kundenpapier steht eine Arbeit, die es im Raum
  // nicht gibt.
  it.fails('OFFEN: Titel nennt den Altbelag und seine Verlegeart', () => {
    const p = finde(pos(), /entfern|demontier/i)
    expect(p.beschreibung).toMatch(/teppich/i)
    expect(p.beschreibung).toMatch(/verklebt/i)
  })
  // ── PM-056-B, offen — Entsorgung fehlt (Manfred, 15.09.) ───────────────
  // „raus UND entsorgt werden" ist gesagt. Die richtige Zeile für verklebten
  // Teppich heißt „Teppichboden verklebt entfernen" (9,00 €/m²) — die Wörter
  // „und entsorgen" stehen dort NICHT drin, anders als bei der losen Zeile.
  // 14 m² verklebter Teppich sind rund ein Kubikmeter Sperrmüll: das ist die
  // Kleinfuhre bis 1 m³ aus dem Onboarding, 110,00 €. Fehlt sie, fährt der
  // Betrieb die Fuhre umsonst.
  // Der Katalog kennt die Zeile heute nur in der Allrounder-Vorlage, nicht
  // unter „Boden – Reinigung & Entsorgung". Soll: dort aufnehmen und setzen,
  // sobald Altbelag entfernt wird und der Entfernen-Titel die Entsorgung
  // nicht selbst schon enthält.
  it.fails('OFFEN: Entsorgungsfahrt / Kleinfuhre steht im Angebot', () => {
    expect(finde(pos(), /kleinfuhre|entsorgungsfahrt/i)).toBeDefined()
  })
  // Kein Fehler, wenn zusätzlich „Klebstoffreste / Altkleber abfräsen"
  // (14,00 €/m²) auftaucht — nach verklebtem Teppich ist das die Regel und
  // nicht die Ausnahme. Deshalb steht hier bewusst keine Verbotsprüfung.
})
