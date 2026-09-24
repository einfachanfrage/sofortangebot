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
//   PM-053-A  Erschwerniszuschlag Raumhöhe feuert außen neben dem Gerüst
//   PM-055-A  Verschnitt fehlt beim geklebten Belag
//   PM-056-A  Altbelag-Titel nennt den neuen Belag (TN-127)
//   PM-056-B  Entsorgungsfahrt fehlt
//   PM-056-C  Altbelag zweimal abgerechnet: 168,00 € statt 126,00 €
//   PM-063-A  „bauseits gestellt" erzeugt trotzdem 450 € Gerüst
//
// Nach dem Live-Lauf am 15.09. abends nachgezogen — zwei Korrekturen an
// diesem Prüfstand, beide gegen mich:
//   1. Die Spracherkennung liefert Zahlen als ZIFFERN („die 2 Heizkörper",
//      „3 Dübellöcher"). Hier standen ausgeschriebene Zahlwörter, die es im
//      echten Transkript gar nicht gibt. Damit fällt die ganze
//      Zahlwort-Familie weg: PM-050-A und PM-052-A waren keine Produktfehler.
//      Die Diktate sind auf die Schreibweise der Spracherkennung gebracht.
//   2. `ergaenzeAusAufnahmeHinweisen` und
//      `normalisiereBodenPositionenAusAufnahme` liefen hier nicht mit,
//      obwohl die echte Route sie über die Vollständigkeit legt — derselbe
//      Fehler wie bei PM-013-A. Jetzt drin; dadurch wird PM-056-C sichtbar.
//
// Stand 21.09.2026 — Sperrklinken zugeschnappt:
//   PM-098-A  „Ein Fenster, eine Tuer" erzeugt keine Lack-Zeilen mehr.
//   PM-099-A  Der Ausschlusssatz bremst die Wandarbeit jetzt in der Pipeline.
// Beide Pruefungen stehen wieder auf `it` — nachgemessen am 21.09. ueber die
// volle Positionsliste, nicht nur am Ausbleiben einer Zeile: bei PM-098 sind
// beide Fassungen Zeile fuer Zeile gleich (Wand 45 m², Heizkoerper 3x2), bei
// PM-099 faellt genau der Wandblock weg (Wand streichen 2x 27,50 m², Boden
// schuetzen, Sockelleisten abkleben) und die vier Tuerzeilen bleiben stehen.
// Der Beleg-Test darunter behauptete das Gegenteil und ist umgeschrieben.
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(gewerk: 'maler' | 'boden_parkett', transkript: string, raeume: any[], extra: any = {}) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk, raeume, transkript, ...extra } } as never)
  // K.2 (Engineering, 15.09.): Ab hier laeuft der Text so, wie die Pipeline ihn
  // weiterreicht — einmal am Eingang durch `ersetzeZahlenWorte`
  // (extraktion-pipeline.ts Z. 83), danach ueberall derselbe.
  // `verarbeiteExtraktion` bekommt weiter den ROHEN Text, die normalisiert
  // selbst. Seit der Live-Lauf gezeigt hat, dass die Spracherkennung Ziffern
  // liefert, aendert das an diesen Diktaten nichts — es haelt den Prüfstand
  // aber auf dem Weg, den das Produkt geht, statt auf einem daneben.
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
  // Live-Nachtest 15.09.: diese beiden Stufen fehlten hier — derselbe Fehler
  // wie bei PM-013-A. Die echte Route legt sie über die Vollständigkeit,
  // und genau dort entsteht die doppelte Altbelag-Zeile aus PM-056-C.
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
  const T = 'Küche, vier mal drei, Höhe zwo fünfzig. Wände zweimal streichen. 3 Dübellöcher müssen noch gespachtelt werden, sonst nix Großes. Eine Tür, ein Fenster.'
  const pos = () => lauf('maler', T, [raum('Küche', { laenge: 4, breite: 3, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['waende_streichen'] })])
  it('eine eigene Zeile für die Ausbesserung, Menge 3 aus dem Satz', () => {
    const p = finde(pos(), /dübellöcher|kleine ausbesserungen/i)
    expect(p).toBeDefined()
    expect(menge(pos(), /dübellöcher|kleine ausbesserungen/i)).toBe(3)
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
  const T = 'Wohnzimmer, fünf mal vier, Höhe zwo fünfzig. Wände zweimal streichen. Die 2 Heizkörper bitte mit lackieren.'
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
  // ── PM-052-A, ERLEDIGT durch den Live-Lauf am 15.09. ───────────────────
  // Hier stand: „die zwei Heizkörper ergibt Menge 1, 85,00 € zu wenig."
  // Das war ein Fehler in diesem Prüfstand, nicht im Produkt. Live steht in
  // allen drei Zeilen Menge 2. Das Zahlwort liest der KI-Schritt, der hier
  // übersprungen wird; die Anzahl reist als `sonder[].anzahl` an.
  it('alle drei Zeilen tragen die Anzahl aus dem Satz: 2', () => {
    expect(menge(pos(), /heizkörper abschleifen/i)).toBe(2)
    expect(menge(pos(), /heizkörper grundieren/i)).toBe(2)
    expect(menge(pos(), /heizkörper lackieren|heizkörper streichen/i)).toBe(2)
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
  //
  // Live am 15.09. nachgestellt: die Zeile steht im Angebot, aber mit
  // 15 % × 0,00 € = 0,00 €, weil sie an einem leeren Zweitraum „Raum" hängt,
  // den die Aufnahme zusätzlich angelegt hat. Kein doppeltes Geld, aber eine
  // Zeile auf dem Kundenpapier, die 15 % Zuschlag ankündigt und nichts
  // berechnet. Der Phantomraum selbst ist der schwerere Fund und steht in der
  // Restliste; er entsteht vor dieser Stufe und ist hier nicht prüfbar.
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
  // ── PM-056-C, offen — dieselbe Arbeit zweimal im Angebot ───────────────
  // Live am 15.09. nachgestellt und hier reproduziert, seit dieser Prüfstand
  // die Aufnahme-Hinweise mitlaufen lässt:
  //   „Laminat demontieren und entsorgen"  14 m² × 5,00 € =  70,00 €
  //   „Altbelag entfernen"                 14 m² × 7,00 € =  98,00 €
  // Zusammen 168,00 € für einen Arbeitsgang; richtig wären 126,00 €
  // (Teppichboden verklebt entfernen, 14 m² × 9,00 €).
  // Ursache: `pruefeAltbelag` benennt die Engine-Zeile in „Laminat demontieren
  // und entsorgen" um. Danach sucht `ergaenzeAusAufnahmeHinweisen` nach
  // /altbelag entfernen|teppichboden entfernen/ — findet nichts mehr und legt
  // die Zeile ein zweites Mal an. Die Umbenennung macht die vorhandene
  // Position für die eigene Dopplungsbremse unsichtbar; gleicher Mechanismus
  // wie bei der Zug-2b-Regression im September.
  it.fails('OFFEN: nur eine Zeile fürs Entfernen des Altbelags', () => {
    const treffer = pos().filter(p => /entfern|demontier/i.test(p.beschreibung))
    expect(treffer).toHaveLength(1)
  })
  // Kein Fehler, wenn zusätzlich „Klebstoffreste / Altkleber abfräsen"
  // (14,00 €/m²) auftaucht — nach verklebtem Teppich ist das die Regel und
  // nicht die Ausnahme. Deshalb steht hier bewusst keine Verbotsprüfung.
})

// ─────────────────────────────────────────────────────────────────────────────
// PM-098 — „Ein Fenster, eine Tür" plus „lackieren" erfindet 280,00 €
//
// Gefunden am 16.09. beim Durchrechnen der Landingpage-Beispiele.
// Zwei Diktate, die sich um genau einen Satz unterscheiden.
// ─────────────────────────────────────────────────────────────────────────────
describe('PM-098 — die Nennung einer Öffnung ist keine Beauftragung', () => {
  const OHNE = 'Wohnzimmer, 5 mal 4, Höhe 2,50. Wände zweimal streichen. Die 2 Heizkörper bitte mit lackieren.'
  const MIT = OHNE + ' Ein Fenster, eine Tür.'
  const bau = (t: string) => () => lauf('maler', t, [raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['waende_streichen', 'heizkoerper lackieren'] })])
  const ohne = bau(OHNE)
  const mit = bau(MIT)

  it('ohne den Satz ist das Angebot richtig: nur die Heizkörper werden lackiert', () => {
    expect(menge(ohne(), /heizkörper lackieren|heizkörper streichen/i)).toBe(2)
    expect(finde(ohne(), /türen (abschleifen|grundieren|lackieren)|türzarge/i)).toBeUndefined()
    expect(finde(ohne(), /fenster (abschleifen|grundieren|lackieren)/i)).toBeUndefined()
  })

  // ── PM-098-A, geschlossen am 21.09. ────────────────────────────────────
  // Derselbe Auftrag, ein Satz mehr — und im Angebot stehen sieben Zeilen,
  // die niemand bestellt hat: Türen abschleifen 20,00 € · Türen grundieren
  // 25,00 € · Türen lackieren 90,00 € · Türzarge lackieren 45,00 € · Fenster
  // abschleifen 20,00 € · Fenster grundieren 25,00 € · Fenster lackieren
  // 55,00 €. Zusammen 280,00 €.
  //
  // „Ein Fenster, eine Tür" ist eine Maßangabe — die App fordert sie selbst
  // ein, um die Wandfläche zu rechnen. Sie darf nicht als Beauftragung gelesen
  // werden. Gleiche Unterscheidung wie PM-033 (Sockelleisten) und PM-034.
  it('die genannte Tür wird nicht mitlackiert', () => {
    expect(finde(mit(), /türen (abschleifen|grundieren|lackieren)|türzarge/i)).toBeUndefined()
  })
  it('das genannte Fenster wird nicht mitlackiert', () => {
    expect(finde(mit(), /fenster (abschleifen|grundieren|lackieren)/i)).toBeUndefined()
  })
  it('die Heizkörper bleiben in beiden Fassungen gleich — der Auftrag ist derselbe', () => {
    expect(menge(mit(), /heizkörper lackieren|heizkörper streichen/i)).toBe(2)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// PM-099 — der Ausschlusssatz hat keine Wirkung mehr, sobald die Arbeit
// einmal in den Raumdaten steht
//
// Sandy, Live-Lauf 16.09., Fall 17 der Einsprech-Liste. Diktat:
// „Die 4 Innentüren mit Zargen abschleifen, grundieren und weiß lackieren.
//  An den Wänden machen wir nichts."
// Im Angebot standen trotzdem Wand streichen 2x (27,50 m²), Boden schützen
// und Sockelleisten abkleben — zusammen 277,25 €, die niemand bestellt hat.
// ─────────────────────────────────────────────────────────────────────────────
describe('PM-099 — „An den Wänden machen wir nichts"', () => {
  const RAUM = (arb: string[]) => [raum('Flur', { laenge: 4, breite: 1.5, hoehe: 2.5, tueren: [{ anzahl: 4, breite: 0.9, hoehe: 2.1, annahme: false }], fenster: [], arbeiten: arb })]
  const TUEREN = 'Flur, 4 mal 1,50, Höhe 2,50. Die 4 Innentüren mit Zargen abschleifen, grundieren und weiß lackieren.'
  const MIT_AUSSCHLUSS = TUEREN + ' An den Wänden machen wir nichts.'
  const ARB = ['tueren lackieren', 'waende_streichen']

  it('die Türarbeiten stehen richtig da — je 4 Stück', () => {
    const p = lauf('maler', MIT_AUSSCHLUSS, RAUM(ARB))
    expect(menge(p, /türen abschleifen/i)).toBe(4)
    expect(menge(p, /türen grundieren/i)).toBe(4)
    expect(menge(p, /türen lackieren/i)).toBe(4)
    expect(menge(p, /türzarge lackieren/i)).toBe(4)
  })

  // ── PM-099-A, geschlossen am 21.09. ────────────────────────────────────
  // Steht `waende_streichen` erst einmal in den Raumdaten, erzeugt die
  // Pipeline die Wandpositionen — der Ausschlusssatz im Diktat wird an
  // dieser Stelle nirgends mehr gelesen. Nachgemessen: das Ergebnis ist
  // Zeichen für Zeichen dasselbe, ob der Satz dasteht oder nicht, und auch
  // bei der Variante „Die Wände bleiben wie sie sind."
  //
  // Der Auslöser sitzt davor: die KI schreibt die Wandarbeit trotz des
  // Ausschlusses in die Raumdaten. Aber die Pipeline hat keine zweite
  // Bremse — und genau dafür gibt es PM-034.
  it('keine Wandposition, wenn der Satz sie ausschließt', () => {
    const p = lauf('maler', MIT_AUSSCHLUSS, RAUM(ARB))
    expect(finde(p, /wand streichen/i)).toBeUndefined()
  })
  it('auch kein Boden schützen und kein Sockelleisten abkleben', () => {
    const p = lauf('maler', MIT_AUSSCHLUSS, RAUM(ARB))
    expect(finde(p, /boden schützen/i)).toBeUndefined()
    expect(finde(p, /sockelleisten abkleben/i)).toBeUndefined()
  })
  it('derselbe Befund bei „Die Wände bleiben wie sie sind."', () => {
    const p = lauf('maler', TUEREN + ' Die Wände bleiben wie sie sind.', RAUM(ARB))
    expect(finde(p, /wand streichen/i)).toBeUndefined()
  })

  // Gegenprobe zur Sperrklinke: der Satz wirkt, und er wirkt genau auf den
  // Wandblock. Ohne Ausschluss stehen drei Zeilen mehr da — Wand streichen 2x,
  // Boden schützen, Sockelleisten abkleben. Die vier Türzeilen sind in beiden
  // Fassungen identisch. Geprüft wird die Differenz, nicht nur das Fehlen:
  // ein leeres Angebot würde die Sperrklinke sonst mit bestehen.
  it('Beleg: der Ausschlusssatz nimmt genau den Wandblock weg, sonst nichts', () => {
    const mit = lauf('maler', MIT_AUSSCHLUSS, RAUM(ARB)).map(p => p.beschreibung).sort()
    const ohne = lauf('maler', TUEREN, RAUM(ARB)).map(p => p.beschreibung).sort()
    expect(mit).not.toEqual(ohne)
    expect(ohne.filter(b => !mit.includes(b))).toEqual([
      'Boden schützen — Flur',
      'Sockelleisten abkleben — Flur',
      'Wand streichen 2x — Flur',
    ])
    expect(mit.filter(b => !ohne.includes(b))).toEqual([])
    expect(mit).toEqual([
      'Türen abschleifen',
      'Türen grundieren',
      'Türen lackieren — 2× Anstrich',
      'Türzarge lackieren',
    ])
  })
})

// ═════════════════════════════════════════════════════════════════════════════
// Sandys zweiter Live-Lauf, 17.09.2026 — die zehn großen Fälle.
// Sieben sauber, vier Funde. Alle hier reproduziert.
// ═════════════════════════════════════════════════════════════════════════════

// ── PM-102 ───────────────────────────────────────────────────────────────────
// „Alte Tapete muss runter. Danach Wände und Decke zweimal weiß."
// Im Angebot: keine Wandposition. Stattdessen „Tapete tapezieren" 65,96 m² ×
// 26,00 € = 1.714,96 €, als Vorschlag. Niemand hat tapezieren gesagt — es ist
// das Gegenteil von dem, was gesagt wurde.
describe('PM-102 — Tapete runter heißt nicht tapezieren', () => {
  const T = 'Altbauwohnzimmer, 5,50 mal 4,20, Deckenhöhe 3,40. Alte Tapete muss runter. Danach Wände und Decke zweimal weiß.'
  const R = (arb: string[]) => [raum('W', { laenge: 5.5, breite: 4.2, hoehe: 3.4, tueren: [TUER], fenster: [FENSTER()], arbeiten: arb })]

  it('mit richtig gelesener Arbeit steht der Wandanstrich da — 65,96 m²', () => {
    const p = lauf('maler', T, R(['tapete entfernen', 'waende_streichen', 'decke_streichen']))
    expect(menge(p, /wand streichen 2x/i)).toBe(65.96)
    expect(menge(p, /tapete entfernen/i)).toBe(65.96)
  })

  // ── PM-102-A, offen ────────────────────────────────────────────────────
  // Steht `tapezieren` in den Arbeiten, verschwindet der Wandanstrich
  // ersatzlos — 626,62 € Arbeit, die diktiert wurde und nicht im Angebot
  // steht. Der Betrieb streicht und bekommt es nicht bezahlt.
  // Sperrklinke zu, CoS-E-084 (Engineering, 17.09.2026). Ursache war nicht
  // `pruefeTapezieren`, sondern der Scope PRO RAUM: in
  // `["tapete entfernen", "tapezieren", "decke_streichen"]` kommt das Wort
  // „Wand" nicht vor, „Decke" schon — die schwache Erwähnungs-Regel schloss
  // daraus „nur Decke" und löschte Wandanstrich UND Sockelleisten.
  // Tapezierarbeiten zählen jetzt als Wandarbeiten, auch ohne das Wort „Wand".
  it('der Wandanstrich verschwindet nicht, nur weil tapezieren im Spiel ist', () => {
    const p = lauf('maler', T, R(['tapete entfernen', 'tapezieren', 'decke_streichen']))
    expect(finde(p, /wand streichen/i)).toBeDefined()
    // 626,62 € — die Zahl aus dem Fund, als Maßstab in der Zeile.
    expect(menge(p, /wand streichen 2x/i)).toBe(65.96)
    expect(finde(p, /sockelleisten abkleben/i)).toBeDefined()
  })

  // ── PM-102-C, CoS-E-084 ────────────────────────────────────────────────
  // Der Live-Fall: die Extraktion schrieb „tapete aufziehen" in die
  // Arbeitenliste, und daraus entstand `Tapete tapezieren` 65,96 m² ×
  // 26,00 € = 1.714,96 €. Im Diktat steht davon kein Wort. Eine erfundene
  // Arbeit darf die ausgesprochene nicht überstimmen.
  it('eine Tapezierzeile nur aus der Arbeitenliste schlägt die Ansage nicht', () => {
    const p = lauf('maler', T, R(['tapete entfernen', 'tapete aufziehen', 'decke_streichen']))
    expect(finde(p, /tapezieren/i)).toBeUndefined()
    expect(menge(p, /wand streichen 2x/i)).toBe(65.96)
    expect(menge(p, /tapete entfernen/i)).toBe(65.96)
  })

  // Gegenprobe, damit der Fix nicht in die andere Richtung Geld verliert:
  // Sagt das Diktat wirklich, dass neu tapeziert wird, bleibt es dabei.
  it('Gegenprobe: „danach neue Raufaser drauf" bleibt Tapezieren', () => {
    const T2 = 'Altbauwohnzimmer, 5,50 mal 4,20, Deckenhöhe 3,40. Alte Tapete muss runter. Danach neue Raufaser drauf und zweimal weiß streichen.'
    const p = lauf('maler', T2, R(['tapete entfernen', 'tapete aufziehen', 'waende_streichen']))
    expect(finde(p, /tapezier/i)).toBeDefined()
  })

  // ── PM-102-B ───────────────────────────────────────────────────────────
  // Live steht zusätzlich `Tapete tapezieren` 65,96 m² × 26,00 € = 1.714,96 €
  // im Angebot, als „Vorschlag". Nach „Tapete muss runter … danach weiß
  // streichen" ist Tapezieren ausgeschlossen — es ist das Gegenteil der
  // Ansage. Das Angebot wird dadurch mehr als doppelt so teuer.
  //
  // Diese Stufe erzeugt die Zeile NICHT — hier ist die Prüfung grün. Sie
  // entsteht live weiter vorn. Der Test bleibt trotzdem stehen: er schlägt
  // an, falls jemand die Zeile in die Pipeline einbaut, und hält den Soll
  // fest, solange die eigentliche Stelle gesucht wird.
  it('an dieser Stufe entsteht keine Tapezierzeile — live tut sie es trotzdem', () => {
    const p = lauf('maler', T, R(['tapete entfernen', 'tapezieren', 'decke_streichen']))
    expect(finde(p, /tapezieren/i)).toBeUndefined()
  })
})

// ── PM-103 ───────────────────────────────────────────────────────────────────
describe('PM-103 — der Altbau-Zuschlag feuert am Raumnamen', () => {
  const R = () => [raum('W', { laenge: 5.5, breite: 4.2, hoehe: 3.4, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['tapete entfernen', 'waende_streichen', 'decke_streichen'] })]
  const MIT = 'Altbauwohnzimmer, 5,50 mal 4,20, Deckenhöhe 3,40. Alte Tapete muss runter. Danach Wände und Decke zweimal weiß.'
  const OHNE = 'Wohnzimmer, 5,50 mal 4,20, Deckenhöhe 3,40. Alte Tapete muss runter. Danach Wände und Decke zweimal weiß.'

  // ── Repariert, CoS-E-084 (Engineering, 17.09.2026) ─────────────────────
  // Der Beleg hielt den FEHLER fest: „mit Raumname entsteht er, ohne nicht."
  // Der Fix macht die erste Hälfte rot — und eine Kontrolle, die der Fix rot
  // macht, ist keine Kontrolle (PM-097-C). Gegenstand und Zählweise bleiben,
  // die Richtung dreht sich: der Raumname entscheidet jetzt gar nichts mehr,
  // die Aussage über den Zustand entscheidet alles. Die alte Fassung stand so:
  //   expect(finde(lauf('maler', MIT, R()), /erschwerniszuschlag altbau/i)).toBeDefined()
  //   expect(finde(lauf('maler', OHNE, R()), /erschwerniszuschlag altbau/i)).toBeUndefined()
  const ZUSTAND = 'Wohnzimmer, 5,50 mal 4,20, Deckenhöhe 3,40. Ist ein Altbau, Kalkputz, alles krumm. Alte Tapete muss runter. Danach Wände und Decke zweimal weiß.'

  it('Beleg: der Raumname entscheidet nichts mehr — mit und ohne ist gleich', () => {
    expect(finde(lauf('maler', MIT, R()), /erschwerniszuschlag altbau/i)).toBeUndefined()
    expect(finde(lauf('maler', OHNE, R()), /erschwerniszuschlag altbau/i)).toBeUndefined()
  })

  it('Beleg: die Aussage über den Zustand entscheidet — „ist ein Altbau"', () => {
    expect(finde(lauf('maler', ZUSTAND, R()), /erschwerniszuschlag altbau/i)).toBeDefined()
  })

  // ── PM-103-A, offen — Entscheidung nötig ───────────────────────────────
  // Live sind das 20 % auf die gesamte Angebotssumme: 460,20 € auf einem
  // Angebot von 2.301,14 €. Ausgelöst hat es das Wort „Altbauwohnzimmer" —
  // ein Raumname, keine Aussage über den Untergrund.
  //
  // Ein Altbau-Zuschlag ist fachlich richtig, wenn der Untergrund es
  // hergibt: krumme Wände, alter Kalkputz, Stuck, keine geraden Kanten. Aber
  // nicht, weil jemand seinen Raum so nennt. „Altbauwohnzimmer" sagt der
  // Kunde, „Altbau mit Stuck und Kalkputz" sagt der Handwerker.
  //
  // Soll (Prüfmeister): der Zuschlag entsteht nur aus einer Aussage über den
  // Zustand, nicht aus einem Raumnamen. Und nie in Höhe von 20 % der
  // Gesamtsumme, ohne dass die Bezugsgröße auf dem Papier steht.
  // Sperrklinke zu, CoS-E-084 (Engineering, 17.09.2026): „Altbau" zählt nur
  // noch als eigenes Wort, und Raumnamen aus der Aufnahme werden vorher aus
  // dem Text genommen. 460,20 € auf 2.301,14 €, ausgelöst von einem Namen —
  // die Zahl bleibt als Maßstab in der Zeile stehen.
  it('ein Raumname löst keinen Erschwerniszuschlag aus', () => {
    expect(finde(lauf('maler', MIT, R()), /erschwerniszuschlag altbau/i)).toBeUndefined()
  })
})

// ── PM-104 ───────────────────────────────────────────────────────────────────
// Live: „Erschwerniszuschlag Altbau · 20 % × 23,01 € · 460,20 €"
// 23,01 € ist 1 % der Angebotssumme (2.301,14 €). Gerechnet stimmt es.
// Auf dem Kundenpapier steht damit eine Zeile, die niemand lesen kann:
// eine Prozentzahl mal einem Eurobetrag, der nirgends sonst vorkommt.
// Gehört zur Darstellung — liegt beim Designer als PD-018 §3.

// ── PM-105 ───────────────────────────────────────────────────────────────────
describe('PM-105 — „an jeder Tür eine Übergangsschiene" bei zwei Räumen', () => {
  const T = 'Kinderzimmer 4 mal 3,50 und Arbeitszimmer 3 mal 3. In beiden Laminat, gerade verlegt, Trittschalldämmung drunter. Sockelleisten neu, weiße MDF. An jeder Tür eine Übergangsschiene.'
  const R = () => [
    raum('Kinderzimmer', { laenge: 4, breite: 3.5, belag: 'laminat', verlegerichtung: 'standard', sockelleisten: true, tueren: [TUER], arbeiten: ['laminat verlegen', 'trittschall', 'sockelleisten montieren'] }),
    raum('Arbeitszimmer', { laenge: 3, breite: 3, belag: 'laminat', verlegerichtung: 'standard', sockelleisten: true, tueren: [TUER], arbeiten: ['laminat verlegen', 'trittschall', 'sockelleisten montieren'] }),
  ]
  it('beide Räume bekommen Belag, Dämmung und Sockelleisten getrennt', () => {
    const p = lauf('boden_parkett', T, R())
    expect(p.filter(x => /laminat verlegen/i.test(x.beschreibung))).toHaveLength(2)
    expect(p.filter(x => /sockelleisten montieren/i.test(x.beschreibung))).toHaveLength(2)
  })
  // ── PM-105-A, offen ────────────────────────────────────────────────────
  // Zwei Räume, je eine Tür, „an JEDER Tür eine Übergangsschiene" — im
  // Angebot steht Menge 1. Die zweite Schiene wird eingebaut und nicht
  // bezahlt: 15,00 € plus die Arbeit.
  // ✅ CoS-E-083 Platz 5 / PM-105 (21.09.2026, Engineering): gebaut. Die
  // Sperrklinke ist gelöst — dieselbe Zusicherung steht als Gegenprobe in
  // `cos-e-083-schiene-je-tuer.test.ts` (E-088-1), mit dem Geldweg daneben.
  it('zwei Türen ergeben zwei Übergangsschienen', () => {
    expect(menge(lauf('boden_parkett', T, R()), /übergangsschiene/i)).toBe(2)
  })
})

// ── PM-106 ───────────────────────────────────────────────────────────────────
describe('PM-107 — die Anstrichzahl der Decke gilt nur für einen Raum', () => {
  // „Wände zweimal und Decken einmal streichen" — beide Räume.
  const T = 'Büro 5 mal 4 und Besprechungsraum 4 mal 4, beide 2,60 hoch. In beiden die alte Tapete runter, dann vollflächig spachteln Q3 wegen Streiflicht, danach Wände zweimal und Decken einmal streichen.'
  const R = () => [
    raum('Büro', { laenge: 5, breite: 4, hoehe: 2.6, tueren: [TUER], fenster: [FENSTER(2)], arbeiten: ['tapete entfernen', 'spachteln', 'waende_streichen', 'decke_streichen'] }),
    raum('Besprechungsraum', { laenge: 4, breite: 4, hoehe: 2.6, tueren: [TUER], fenster: [FENSTER(2)], arbeiten: ['tapete entfernen', 'spachteln', 'waende_streichen', 'decke_streichen'] }),
  ]
  it('die Wände stehen in beiden Räumen richtig auf 2x', () => {
    const p = lauf('maler', T, R())
    expect(menge(p, /wand streichen 2x — Büro/i)).toBe(46.8)
    expect(menge(p, /wand streichen 2x — Besprechungsraum/i)).toBe(41.6)
  })
  it('der Besprechungsraum bekommt die Decke richtig mit 1x', () => {
    expect(finde(lauf('maler', T, R()), /decke streichen 1x — Besprechungsraum/i)).toBeDefined()
  })
  // ── PM-107-A, offen ────────────────────────────────────────────────────
  // Das Büro bekommt `Decke streichen 2x` (11,00 €) statt 1x (7,00 €),
  // obwohl „Decken einmal" für beide Räume gesagt wurde. 20,00 m² × 4,00 € =
  // 80,00 € zu viel, und auf dem Papier stehen zwei verschiedene
  // Anstrichzahlen für dieselbe Ansage. Sandy hat es selbst gefunden.
  // ✅ CoS-E-083 / PM-107 (21.09.2026, Engineering): gebaut. Die Sperrklinke
  // ist gelöst — dieselbe Zusicherung steht als Gegenprobe in
  // `cos-e-083-ansage-gilt-fuer-alle.test.ts` (E-087-3 / E-087-4).
  it('„Decken einmal" gilt für alle Räume, nicht nur für den letzten', () => {
    const p = lauf('maler', T, R())
    expect(finde(p, /decke streichen 2x/i)).toBeUndefined()
    expect(finde(p, /decke streichen 1x — Büro/i)).toBeDefined()
  })
})

// ── PM-079-A, WIEDER OFFEN ───────────────────────────────────────────────────
describe('PM-079-A — der Isoliergrund deckt nicht alle verrauchten Räume', () => {
  // Gestern als erledigt gemeldet, weil ein Ein-Raum-Fall live 65,00 m²
  // lieferte. Sandys Zwei-Raum-Fall vom 17.09. zeigt: das waren die 65 m²
  // des ERSTEN Raums, nicht die Summe.
  const T = 'Wohnzimmer 5 mal 4 und Schlafzimmer 4 mal 3,50, beide 2,50 hoch. Wände und Decken streichen, alles verraucht, da muss Sperrgrund drauf.'
  const R = () => [
    raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['waende_streichen', 'decke_streichen', 'nikotinsperre'] }),
    raum('Schlafzimmer', { laenge: 4, breite: 3.5, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['waende_streichen', 'decke_streichen', 'nikotinsperre'] }),
  ]
  // Soll: Wohnzimmer 45 + 20, Schlafzimmer 37,5 + 14 = 116,50 m².
  // Live: 65,00 m². Fehlbetrag 51,50 m² × 9,00 € = 463,50 €.
  // ✅ CoS-E-085 (21.09.2026, Engineering): gebaut und committet. Die
  // Sperrklinke ist gelöst — dieselbe Zusicherung steht als Gegenprobe in
  // `cos-e-085-isoliergrund-alle-raeume.test.ts`.
  it('der Isoliergrund läuft über alle verrauchten Flächen — 116,50 m²', () => {
    expect(menge(lauf('maler', T, R()), /isoliergrund/i)).toBe(116.5)
  })
})
