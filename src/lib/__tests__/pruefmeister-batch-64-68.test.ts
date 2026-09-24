// Fallbasis Richtung 100 — Batch PM-064 bis PM-068 (Prüfmeister, 15.09.2026)
//
// Fünf Themen, die im Themenspeicher als „offen" stehen und ohne die laufende
// App prüfbar sind:
//
//   B · Nikotin/Sperrgrund, Fehlauslöser                    → PM-064
//   D · „Treppe: Stufen, Setzstufen, Wangen, Geländer"      → PM-065 (Maler)
//   F · „Treppen komplett"                                  → PM-066 (Boden)
//   F · „Abbruch und Entsorgung, Container"                 → PM-067
//   F · „Trockenbau: Wand stellen, Decke abhängen"          → PM-068
//
// Aufbau wie `pruefmeister-batch-47-56.test.ts`: über die Pipeline, und der
// Text wird einmal am Eingang normalisiert, wie die Pipeline es tut (K.2).
// PM-068 fährt Engine + Vollständigkeit direkt — so, wie der Endpunkt es für
// ein Gewerk tut, das nicht über `raeume` normalisiert wird (wie PM-060).
//
// Fallbasis danach: 68 von 100.
//
// Prüfmeister · 15.09.2026
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
function lauf(gewerk: 'maler' | 'boden_parkett', transkript: string, raeume: any[]) {
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
  return pruefeUndErgaenzeVollstaendigkeit(gewerk, eng.positionen, text, meta as never, signale as never).positionen
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

// ══════════════════════════════════════════════════════════════════════════
// PM-064 — „Sperrmüll" ist kein Sperrgrund
// ══════════════════════════════════════════════════════════════════════════
//
// Entstanden beim Beantworten von K.1 Frage 1. Der Isoliergrund hängt an
// `lower.includes('sperr')` (vollstaendigkeit/maler-sonder.ts Z. 42) — am
// WORTSTAMM, nicht am Sachverhalt. Damit lösen ihn Sätze aus, die mit
// Nikotin und Wasserflecken nichts zu tun haben.
//
// Und die Regel ist nicht nur zusätzlich: Sie wirft die vorhandene
// `Decke streichen`-Position weg und baut drei neue auf derselben Zahl.
// Ein Wort im Nebensatz ändert also den Hauptauftrag.

describe('PM-064 — der Sperrgrund feuert am Wortstamm', () => {
  const BASIS = 'Wohnzimmer, vier mal drei, Höhe zwo fünfzig. Wände und Decke zweimal streichen.'
  const zimmer = () => [raum('Wohnzimmer', { laenge: 4, breite: 3, hoehe: 2.5, arbeiten: ['wände streichen 2x', 'decke streichen 2x'] })]

  it('ohne Auslösewort steht kein Isoliergrund im Angebot — die Gegenprobe', () => {
    expect(finde(lauf('maler', BASIS, zimmer()), /Isoliergrund/)).toBeUndefined()
  })

  // CoS-E-059 Eingriff 3 (Engineering, 15.09.2026): gebaut und gemessen — aus
  // `it.fails` wird `it`. Fällt die Zeile künftig, ist sie ein Rückschritt.
  it('PM-064-A · „das ist Sperrmüll" erzeugt keinen Isoliergrund', () => {
    // Gemessen: `Isoliergrund … 12,00 m²` (9,00 €/m² = 108,00 €) plus
    // `Grundieren — Tiefengrund` 12,00 m² (4,50 €/m² = 54,00 €).
    // **162,00 € für eine Arbeit, von der niemand gesprochen hat** — ausgelöst
    // von einem Satz über den alten Teppich.
    //
    // Regel H Satz 3: nicht gesagt → keine bepreiste Zeile. Hier ist es
    // schlimmer als eine Ergänzung: Es ist eine Fehllesung.
    const p = lauf('maler', BASIS + ' Der alte Teppich muss raus, das ist Sperrmüll.', zimmer())
    expect(finde(p, /Isoliergrund/), 'Sperrmüll').toBeUndefined()
    expect(finde(p, /Grundieren \(Tiefengrund\)/), 'Tiefengrund').toBeUndefined()
  })

  // CoS-E-059 Eingriff 3 (Engineering, 15.09.2026): gebaut und gemessen — aus
  // `it.fails` wird `it`. Fällt die Zeile künftig, ist sie ein Rückschritt.
  it('PM-064-B · „die Baustelle müssen wir absperren" erzeugt keinen Isoliergrund', () => {
    // Zweiter Satz, dieselbe Ursache. Absperren, Absperrband, Sperrholz,
    // gesperrt — der Wortstamm steckt in allem. Auf dem Bau ist „absperren"
    // ein gewöhnliches Wort.
    const p = lauf('maler', BASIS + ' Die Baustelle müssen wir absperren, da laufen Leute durch.', zimmer())
    expect(finde(p, /Isoliergrund/), 'absperren').toBeUndefined()
  })

  // CoS-E-059 Eingriff 3 (Engineering, 15.09.2026): gebaut und gemessen — aus
  // `it.fails` wird `it`. Fällt die Zeile künftig, ist sie ein Rückschritt.
  it('PM-064-C · der Nebensatz lässt die gesagte Deckenposition stehen', () => {
    // Die Regel entfernt `Decke streichen` und legt sie neu an — ohne die
    // Herkunft. Ergebnis: eine ausdrücklich bestellte Leistung trägt
    // `automatisch_ergaenzt`. Dieselbe Familie wie PM-046-C, hier aber von
    // einem Wort ausgelöst, das gar nichts mit Anstrich zu tun hat.
    const p = lauf('maler', BASIS + ' Der alte Teppich muss raus, das ist Sperrmüll.', zimmer())
    const decke = finde(p, /Decke streichen/)
    expect(decke?.automatisch_ergaenzt, '„Decke zweimal streichen" wurde gesagt').not.toBe(true)
  })
})

// ══════════════════════════════════════════════════════════════════════════
// PM-065 — Treppenhaus streichen: Stufen, Setzstufen, Wangen, Geländer
// ══════════════════════════════════════════════════════════════════════════
//
// Themenspeicher D, seit dem 10.09. offen („Treppe: nur Geländer über
// PM-042, Rest offen"). Der Katalog kann es:
//   Treppenstufen streichen / versiegeln   18,00 €/Stück
//   Treppengeländer lackieren              18,00 €/lfdm
//   Treppengerüst stellen                 120,00 €/Pauschale
//   Zuschlag enge Räume / Treppenhäuser    60,00 €/Pauschale

describe('PM-065 — Treppenhaus, Maler', () => {
  const T = 'Treppenhaus im Altbau. Die Treppe hat vierzehn Stufen, die sollen gestrichen werden, Setzstufen auch. Das Geländer ist acht Meter lang, das wird lackiert. Die Wangen mitstreichen.'
  const pos = () => lauf('maler', T, [
    raum('Treppenhaus', { laenge: 3, breite: 1.2, hoehe: 3.2, arbeiten: ['treppenstufen streichen', 'geländer lackieren'] }),
  ])

  it.fails('🔴 PM-065-A · vierzehn gestrichene Stufen ergeben eine Stufenposition', () => {
    // Gemessen: **keine einzige Treppenposition im Angebot.** Was entsteht,
    // sind Wand- und Deckenflächen für einen Raum 3,00 × 1,20 — als wäre ein
    // Treppenhaus ein Zimmer.
    //
    //   Soll: 14 × 18,00 = 252,00 €
    //   Ist:  0,00 €
    expect(menge(pos(), /treppenstufen streichen|stufen streichen/i)).toBe(14)
  })

  it.fails('🔴 PM-065-B · das Geländer wird lackiert, nicht abgeklebt', () => {
    // Gemessen: `Geländer abkleben`, Pauschale, **ohne Preis**. Die Zeile
    // kommt aus `maler-abkleben.ts` Z. 121 mit dem Kommentar „Treppenhaus —
    // Geländer immer abkleben" und feuert unbesehen, auch wenn im Diktat
    // wörtlich „das wird lackiert" steht.
    //
    // Wer lackiert, klebt nicht ab — dieselbe Verwechslung wie beim
    // Heizkörper in PM-052, hier ohne jede Bedingung.
    //
    //   Soll: Treppengeländer lackieren, 8,00 lfdm × 18,00 = 144,00 €
    //   Ist:  Geländer abkleben, 1 Pauschale, 0,00 €
    const p = pos()
    expect(finde(p, /geländer abkleben/i), 'abkleben neben lackieren').toBeUndefined()
    expect(menge(p, /geländer lackieren/i)).toBe(8)
  })

  it.fails('🔴 PM-065-C · Setzstufen und Wangen sind gesagt und fehlen im Katalog', () => {
    // Beide stehen wörtlich im Diktat. Der Malerkatalog kennt nur
    // `Treppenstufen streichen / versiegeln` — Setzstufe und Wange gibt es
    // dort nicht, obwohl der Fliesen- und der Bodenkatalog die Setzstufe
    // führen. Das ist eine Katalog-Lücke, kein Engine-Fehler: Erst die Zeile,
    // dann die Erkennung.
    const p = pos()
    expect(finde(p, /setzstufe/i), 'Setzstufen').toBeTruthy()
    expect(finde(p, /wange/i), 'Wangen').toBeTruthy()
  })
})

// ══════════════════════════════════════════════════════════════════════════
// PM-066 — Treppe mit Belag: Trittstufen, Setzstufen, Treppennase
// ══════════════════════════════════════════════════════════════════════════
//
// Themenspeicher F, „Treppen komplett". Der Bodenkatalog kann es vollständig:
//   Vinyl auf Treppenstufen kleben                      55,00 €/Stück
//   Treppenstufe mit Belag belegen (schwimmend/geklebt)  45,00 €/Stück
//   Treppennase / Kantenprofil Treppe montieren          22,00 €/Stück
//   Zuschlag Treppenstufen (aufwändig, viele Zuschnitte) 80,00 €/Pauschale

describe('PM-066 — Treppe, Bodenbelag', () => {
  const T = 'Treppe im Haus, vierzehn Stufen, da soll Vinyl drauf geklebt werden. Treppennase brauchen wir auch.'
  const pos = () => lauf('boden_parkett', T, [
    raum('Treppe', { laenge: 3, breite: 1, arbeiten: ['treppenstufen belegen'], belag: 'Vinyl' }),
  ])

  it('die Stufen werden überhaupt als Stückzahl erkannt — das kann die App', () => {
    // Suchmuster nachgezogen (CoS-E-062, Zug 1, 16.09.2026): Der Titel heißt
    // seit PM-066-A `Vinyl auf Treppenstufen kleben` — Katalogwortlaut statt
    // `Trittstufen belegen`. Die ZUSICHERUNG ist unverändert: vierzehn.
    expect(menge(pos(), /treppenstufen kleben|trittstufen belegen/i)).toBe(14)
  })

  it('✅ PM-066-A · die vierzehn Stufen finden ihren Preis — 770,00 €', () => {
    // Gemessen: 14 Stück, 0,00 €. Der Titel kommt aus
    // `vollstaendigkeit/boden-sonder.ts` Z. 208, der Katalog führt
    // `Vinyl auf Treppenstufen kleben`. Kein Treffer über der Schwelle.
    //
    //   Soll: 14 × 55,00 = 770,00 €
    //   Ist:  0,00 €
    //
    // Dieselbe Familie wie PM-060-A: Die Mengen stimmen, der Wortlaut trifft
    // den Katalog nicht. Das ist der teuerste Fund dieses Batches.
    //
    // Gebaut am 16.09.2026 (CoS-E-062, Zug 1) in `boden-sonder.ts`: Der Titel
    // ist jetzt der Katalogwortlaut, je Belag aus einer gemessenen Tabelle.
    // Sperrklinke → Zusicherung.
    const p = pos()
    expect(preis(p, /auf Treppenstufen kleben/i, 'boden_parkett')).toBe(55)
    // Und der Betrag, um den es geht — ohne ihn ließe die Zeile oben auch
    // eine Position mit Stückzahl 1 durch.
    expect(menge(p, /auf Treppenstufen kleben/i)).toBe(14)
  })

  it('✅ PM-066-B · und es bleibt bei EINER Stufenzeile — keine zweite für die Setzstufe', () => {
    // Umgestellt am 16.09.2026 (CoS-E-062, Zug 1) nach der K.4-Antwort des
    // Prüfmeisters: Die Setzstufe steckt im Stückpreis. Die Sperrklinke stand
    // auf „die zweite Zeile braucht einen Preis“ — das wäre die Doppel-
    // berechnung gewesen, 1.540,00 € statt 770,00 €. Das Soll ist jetzt:
    // die zweite Zeile ist WEG.
    //
    // **Prüfmeister: bitte gegenlesen** — die Zusicherung ist gedreht, nicht
    // gestrichen.
    expect(finde(pos(), /setzstufe/i)).toBeUndefined()
  })

  it('✅ PM-066-C · die Treppennase ist gesagt und steht jetzt im Angebot', () => {
    // Regel H Satz 1: gesagt → Position. „Treppennase brauchen wir auch"
    // steht wörtlich im Diktat, der Katalog führt die Zeile mit 22,00 €.
    //
    // Gebaut am 16.09.2026 (CoS-E-062, Zug 1) in `boden-sonder.ts`: Das Wort
    // steht jetzt im Auslöser, und der Titel ist der Katalogwortlaut — sonst
    // wäre die Zeile mit 0,00 € entstanden. Sperrklinke → Zusicherung.
    expect(finde(pos(), /treppennase|kantenprofil/i)).toBeTruthy()
    expect(preis(pos(), /treppennase|kantenprofil/i, 'boden_parkett')).toBe(22)
  })

  it('✅ PM-066-D · eine Treppe hat keine Bodenfläche zum Verlegen', () => {
    // Gemessen war: `Vinyl-Boden verlegen inkl. 5% Verschnitt — Treppe`,
    // 3,15 m² zu 16,00 € = 50,40 €. Das ist der Grundriss der Treppe,
    // einmal als Fläche berechnet — zusätzlich zu den 14 Stufen.
    // Auf der Treppe wird die Stufe belegt, nicht der Grundriss.
    //
    // Gebaut am 16.09.2026 (CoS-E-062, Zug 1 Abschluss) in
    // `mengen/gewerke/boden.ts`: Nennt der Text eine Stufenzahl UND ist der
    // Raum die Treppe, trägt die Stufenposition die Arbeit — die Fläche
    // entsteht dann nicht. Es ist derselbe Doppelbetrag wie bei der
    // Setzstufe (K.4-E), nur in der anderen Einheit.
    // Sperrklinke → Zusicherung.
    expect(finde(pos(), /vinyl-boden verlegen|boden verlegen/i), 'Fläche neben den Stufen').toBeUndefined()
  })
})

// ══════════════════════════════════════════════════════════════════════════
// PM-067 — Abbruch und Entsorgung, Container
// ══════════════════════════════════════════════════════════════════════════
//
// Themenspeicher F, „Abbruch und Entsorgung, Container". Zweites Diktat zum
// Thema aus PM-056 — dort war die Entsorgungsfahrt der Fund, hier ist es der
// ausdrücklich bestellte Container.

describe('PM-067 — Altbelag raus, Container bestellt', () => {
  const T = 'Wohnzimmer vier mal drei fünfzig. Der alte Teppich muss raus, verklebt, und entsorgt werden. Wir brauchen einen Container, das ist viel Bauschutt.'
  const pos = () => lauf('boden_parkett', T, [
    raum('Wohnzimmer', {
      laenge: 4, breite: 3.5, altbelag_entfernen: true, altbelag_vorhanden: true,
      belag: 'Laminat', arbeiten: ['altbelag entfernen', 'laminat verlegen'],
    }),
  ])

  it('der Altbelag wird auf der Rohfläche entfernt, 14,00 m²', () => {
    // Titel seit CoS-E-062 Zug 1: `Teppichboden verklebt entfernen`. Die
    // Menge ist davon unberührt — das Suchmuster ist nachgezogen, die
    // Zusicherung nicht.
    expect(menge(pos(), /teppichboden.*entfernen/i)).toBe(14)
  })

  it('✅ PM-067-A · „verklebt" steht im Diktat und jetzt auch im Titel', () => {
    // Gebaut am 16.09.2026 (CoS-E-062, Zug 1) in `boden-vorarbeiten.ts`:
    // Der Umbenennungs-Block fragt jetzt `hatVerklebt` und setzt den
    // Katalogwortlaut `Teppichboden verklebt entfernen`, 9,00 €/m².
    // Die Sperrklinke ist damit zur Zusicherung geworden.
    // Gemessen: `Teppichboden entfernen und entsorgen` zu 6,00 €/m² — das ist
    // die Zeile für den LOSEN Teppich. Verklebt kostet 9,00 €/m².
    // Auf 14 m² sind das 42,00 € zu wenig, und auf dem Kundenpapier steht
    // eine andere Arbeit als die ausgeführte.
    // Bestätigt PM-056-A aus einem zweiten Diktat.
    expect(preis(pos(), /teppichboden.*entfernen/i, 'boden_parkett')).toBe(9)
  })

  it.fails('🔴 PM-067-B · der bestellte Container steht im Angebot', () => {
    // Regel H Satz 1: gesagt → Position. „Wir brauchen einen Container" ist
    // so ausdrücklich, wie eine Ansage sein kann.
    //
    // Der Katalog führt Container erst ab `Entrümpelung – Container &
    // Entsorgung` (5 m³ = 280,00 €) und unter `Boden – Altbelag entfernen`
    // nur `Bauschutt / Altbelag entsorgen (Sackweise)`, 12,00 €/Sack.
    // Beides zusammen ist die zweite Hälfte des Funds: Selbst wenn die
    // Position entstünde, hielte `preisKategoriePasstZuGewerk` sie vom
    // Entrümpelungs-Katalog fern — dieselbe Wand wie PM-060-B.
    expect(finde(pos(), /container|bauschutt|entsorgungsfahrt|kleinfuhre/i)).toBeTruthy()
  })
})

// ══════════════════════════════════════════════════════════════════════════
// PM-068 — Trockenbau: Wand stellen, Decke abhängen
// ══════════════════════════════════════════════════════════════════════════
//
// Themenspeicher F, „Trockenbau: Wand stellen, Decke abhängen" — nie geprüft.
// Erreichbar ist das Gewerk über die Extraktion des Diktats, nicht über das
// Betriebsprofil (Themenspeicher K.3): Ein Maler, der eine Ständerwand
// diktiert, landet in `trockenBauEngine`.
//
// Der Trockenbau-Katalog ist vollständig:
//   Trennwand 75mm, 1-lagig je Seite (GK), bis H 3,25m, Q2   58,00 €/m²
//   Trennwand 100mm, 2-lagig je Seite (GK), Rw ~50dB, Q2     98,00 €/m²

describe('PM-068 — Ständerwand und abgehängte Decke', () => {
  const daten = {
    gewerk: 'trockenbau',
    transkript: 'Im Büro eine Trennwand stellen, vier Meter lang, zweifünfzig hoch, doppelt beplankt mit Dämmung. Und im Flur die Decke abhängen, drei mal zwei Meter.',
    waende: [{ laenge: 4, hoehe: 2.5, beplankung: 2, daemmung: true }],
    decken: [{ laenge: 3, breite: 2 }],
    raeume: [],
  }
  const pos = () => berechneMengen('trockenbau', daten).positionen
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = (m: RegExp) => finde(pos() as any[], m)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pr = (m: RegExp) => preis(pos() as any[], m, 'trockenbau')

  it('die Mengen selbst stimmen — 10,00 m² Wand, 6,00 m² Decke', () => {
    expect(p(/ständerwand errichten/i)?.menge).toBe(10)
    expect(p(/abgehängte decke/i)?.menge).toBe(6)
  })

  it.fails('🔴 PM-068-A · die ganze Ständerwand steht ohne Preis im Angebot', () => {
    // Gemessen im Vokabular-Abgleich (15.09., QUELLEN um die drei über das
    // Diktat erreichbaren Gewerke erweitert): **zehn neue Lücken, sechs davon
    // Trockenbau.** Ohne Preis stehen `Ständerwand errichten (GK)`,
    // `Doppelbeplankung (2× GK)`, `Dämmung Ständerwand einlegen`,
    // `Ständerwerk CW-Profil`, `Abgehängte Decke` und `Abgehängte Decke (GK)`.
    //
    // Das ist nicht eine Zeile ohne Preis, das ist das ganze Gewerk. Eine
    // 10 m²-Trennwand, doppelt beplankt: Soll 98,00 €/m² = 980,00 €,
    // Ist 0,00 €.
    expect(pr(/ständerwand errichten/i), 'Ständerwand').toBeGreaterThan(0)
    expect(pr(/abgehängte decke/i), 'Abgehängte Decke').toBeGreaterThan(0)
  })

  it.fails('🔴 PM-068-B · das Ständerwerk steckt im Quadratmeterpreis der Wand', () => {
    // `Ständerwerk CW-Profil`, 20,00 lfdm, aus `ceil(4 / 0,625) × 2,50`.
    // Jeder Trockenbau-Katalog rechnet die Unterkonstruktion im
    // Quadratmeterpreis der Trennwand ab — 58,00 € bzw. 98,00 € sind die
    // fertige Wand inklusive Profilen. Die Zeile ist also nicht nur ohne
    // Preis, sie ist eine Doppelberechnung, sobald sie einen bekommt.
    //
    // Bekäme sie einen marktüblichen Profilpreis, stünde die Wand zweimal
    // im Angebot. Die Zeile gehört weg, nicht bepreist.
    expect(p(/ständerwerk cw-profil/i), 'CW-Profil als eigene Zeile').toBeUndefined()
  })

  it.fails('🔴 PM-068-C · zwei Titel für dieselbe abgehängte Decke', () => {
    // `Abgehängte Decke (GK)` entsteht aus `decken[]`,
    // `Abgehängte Decke — <Raum>` aus `raeume[].arbeiten`. Dieselbe Arbeit,
    // zwei Schreibweisen, zwei Treffer im Katalog — oder eben keiner.
    // Dieselbe Familie wie PM-058 (dieselbe Zeile zweimal in einer
    // Preisliste), hier auf der Engine-Seite.
    const beide = berechneMengen('trockenbau', {
      ...daten,
      raeume: [{ name: 'Flur', laenge: 3, breite: 2, arbeiten: ['decke abgehängt'] }],
    }).positionen.filter(x => /abgehängte decke/i.test(x.beschreibung))
    expect(new Set(beide.map(x => x.beschreibung)).size, 'ein Titel für eine Arbeit').toBeLessThan(2)
  })
})
