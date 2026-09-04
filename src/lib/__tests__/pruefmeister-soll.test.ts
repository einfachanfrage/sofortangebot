// Soll-Ist-Abgleich für JEDEN dokumentierten Prüfmeister-Testfall.
//
// Anlass (Sandy, 2026-08-31): „ich will zukünftig JEDEN testfall einsprechen
// können und er muss komplett fehlerfrei rauskommen." Bis hierher haben wir
// jeden gemeldeten Fall einzeln gefixt und den nächsten wieder von Sandy
// finden lassen. Diese Datei dreht das um: die Soll-Lösungen aus
// `docs/pruefmeister-testfaelle.md` und `-archiv.md` stehen hier als Code,
// und die ECHTE Pipeline muss sie treffen — Position für Position, Menge für
// Menge, plus Katalogpreis für jede erzeugte Position.
//
// Was dieser Test abdeckt: alles ab der geprüften Extraktion — Mengen-Engine,
// Vollständigkeitsprüfung, Gewerk-Zuordnung, Preiszuordnung.
// Was er NICHT abdecken kann: den GPT-Schritt davor (aus Sprache wird
// Struktur). Die Raumdaten hier sind deshalb so gesetzt, wie die Extraktion
// sie bei korrekter Arbeit liefern MUSS — weicht sie live davon ab, ist das
// ein Extraktions-Befund und kein Rechenfehler.
//
// Angewandte Regeln, die die ursprünglichen Soll-Zahlen überschreiben:
//   • VOB/DIN 18363 Übermessung (Sandys Entscheidung 2026-08-21): Öffnungen
//     bis 2,5 m² werden NICHT abgezogen.
//   • Verschnitt (Sandy, 2026-08-30): 5 % für Laminat/Vinyl/Parkett/Diele
//     gerade, 15 % für Fischgrät/Diagonal.
//   • Erschwerniszuschläge laufen in Prozent (Sandy, 2026-08-31).
//   • VOB-012 (CoS-042, 2026-09-04, aus dem gekauften Normtext): DIN 18363
//     und DIN 18365, jeweils 5.3.2 — Unterbrechungen bis 1 m Einzellänge
//     werden bei der Sockelleisten-Länge NICHT abgezogen. Eine Standardtür
//     (0,90 m) fällt darunter. Alle Sockelleisten-Sollwerte unten sind
//     deshalb um 0,90 lfdm je Tür GRÖSSER als in der ursprünglichen
//     Soll-Lösung des Prüfmeisters — zugunsten des Betriebs, der die Leiste
//     ja durchgehend verlegt.
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '@/app/api/angebot-generieren/route'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))

const TUER = { anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }
const FENSTER = (anzahl = 1) => ({ anzahl, breite: 1.2, hoehe: 1.0, annahme: true })

type Raum = Record<string, unknown> & { name: string }

function basisRaum(name: string, extra: Record<string, unknown> = {}): Raum {
  return {
    name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
    tueren: [], fenster: [], arbeiten: [],
    altbelag_entfernen: false, altbelag_vorhanden: false, sockelleisten: false,
    nassbereich: false, ausgleich: false, ...extra,
  }
}

interface SollPosition { muster: RegExp; menge?: number }
interface Fall {
  id: string
  titel: string
  gewerk: 'maler' | 'boden_parkett'
  transkript: string
  raeume: Raum[]
  soll: SollPosition[]
  verboten?: RegExp[]
}

function rechne(fall: Fall) {
  const eng = berechneMengen(fall.gewerk, {
    transkript: fall.transkript, raeume: fall.raeume, gewerk: fall.gewerk,
  })
  const signale = {
    arbeitenTexte: fall.raeume.flatMap(r => (r.arbeiten as string[] | undefined) ?? []),
    belagText: (fall.raeume.find(r => r.belag) as { belag?: string } | undefined)?.belag ?? null,
    altbelagEntfernen: fall.raeume.some(r => r.altbelag_entfernen === true),
    // PM-005: Ohne dieses Feld prüft die Vollständigkeit „nur Decke"/„nur
    // Wände" GLOBAL statt je Raum — und löscht dann die Wandpositionen eines
    // Raums, weil in einem ANDEREN Raum „nur die Decke" gesagt wurde.
    // `extraktion-pipeline.ts` reicht es im Betrieb durch; ein Test, der es
    // wegließe, würde einen Fehler melden, den es live nicht gibt (und
    // umgekehrt echte Fehler verdecken). Der Testaufbau muss die
    // Produktionssignale spiegeln, sonst prüft er etwas anderes als das
    // Produkt.
    raeume: fall.raeume.map(r => ({ name: r.name, arbeiten: (r.arbeiten as string[] | undefined) ?? [] })),
  }
  const meta = {
    fensterAnzahl: zaehleFenster(fall.transkript) || undefined,
    tuerenAnzahl: zaehleTueren(fall.transkript) || undefined,
    raeume: fall.raeume.map(r => ({ name: r.name, hoehe: (r.hoehe as number | null) ?? null })),
  }
  const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
    fall.gewerk, eng.positionen, fall.transkript, meta, signale,
  )
  return positionen
}

function preisFuer(beschreibung: string, einheit: string, hauptgewerk: string) {
  const gewerk = gewerkFuerPosition(beschreibung, hauptgewerk)
  return findePreisposition(beschreibung, einheit, KATALOG.filter(p => preisKategoriePasstZuGewerk(p.category, gewerk)))
}

// ── Die Fälle ───────────────────────────────────────────────────────────────

const FAELLE: Fall[] = [
  {
    id: 'PM-001', titel: 'Ausschluss + Selbstkorrektur (Wohnzimmer)', gewerk: 'maler',
    transkript: 'Also, äh, Wohnzimmer, fünf zwanzig mal vier zehn, Deckenhöhe zwo fünfzig. Wände komplett streichen, zweimal drüber. Ein Fenster — ne halt, zwei Fenster sind da drin, Standardgröße reicht. Eine Tür, normal Maß. Die Decke lassen wir, ist erst letztes Jahr gemacht worden, die bitte NICHT mitrechnen. Sockelleisten kleben wir noch ab, sind aus Holz, werden mitgestrichen.',
    raeume: [basisRaum('Wohnzimmer', { laenge: 5.2, breite: 4.1, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER(2)], arbeiten: ['waende_streichen'] })],
    soll: [
      { muster: /wandflächen streichen 2x/i, menge: 46.5 },
      { muster: /sockelleisten abkleben/i, menge: 18.6 },
    ],
    verboten: [/deckenfläche streichen/i],
  },
  {
    id: 'PM-003', titel: 'Kleinreparatur + Höhenzuschlag + Boden-Ausschluss (Flur)', gewerk: 'maler',
    transkript: 'Flur, sechs mal eins fünfzig, Deckenhöhe drei zwanzig — is schon ne hohe Bude hier. Kein Fenster im Flur, aber eine Tür, normal Maß. Wände streichen, zweimal, Decke auch mit. Zwei Dübellöcher spachteln, sonst nix Großes. Boden lass mal weg, der bleibt wie er ist, den nicht anfassen.',
    raeume: [basisRaum('Flur', { laenge: 6, breite: 1.5, hoehe: 3.2, tueren: [TUER], fenster: [], arbeiten: ['waende_streichen', 'decke_streichen'] })],
    soll: [
      { muster: /wandflächen streichen 2x/i, menge: 48 },
      { muster: /deckenfläche streichen 2x/i, menge: 9 },
      { muster: /erschwerniszuschlag raumhöhe/i },
    ],
    verboten: [/boden streichen/i],
  },
  {
    id: 'PM-004', titel: 'Laminat gerade + Trittschalldämmung (Kinderzimmer)', gewerk: 'boden_parkett',
    transkript: 'Kinderzimmer, vier mal drei, Höhe zwo sechzig. Laminat, ganz normal gerade verlegt, keine Muster oder so. Drunter kommt noch ne Trittschalldämmung.',
    raeume: [basisRaum('Kinderzimmer', { laenge: 4, breite: 3, hoehe: 2.6, belag: 'laminat', verlegerichtung: 'standard', arbeiten: ['laminat verlegen'] })],
    soll: [
      { muster: /laminat verlegen/i, menge: 12.6 },
      { muster: /trittschall/i, menge: 12 },
    ],
  },
  {
    id: 'PM-005', titel: 'Zwei Räume, Duplikat-Falle + Scope nur Decke', gewerk: 'maler',
    transkript: 'Zwei Räume: Küche, dreieinhalb mal zwo achtzig, Höhe zwo fünfzig, Wände und Decke komplett streichen, zweimal. Daneben die Speisekammer, auch dreieinhalb mal zwo achtzig, Höhe genauso — aber da nur die Decke streichen, zweimal, die Wände lassen wir in Ruhe.',
    raeume: [
      basisRaum('Küche', { laenge: 3.5, breite: 2.8, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['waende_streichen', 'decke_streichen'] }),
      basisRaum('Speisekammer', { laenge: 3.5, breite: 2.8, hoehe: 2.5, tueren: [TUER], fenster: [], arbeiten: ['decke_streichen'] }),
    ],
    soll: [
      { muster: /wandflächen streichen 2x — küche/i, menge: 31.5 },
      { muster: /deckenfläche streichen 2x — küche/i, menge: 9.8 },
      { muster: /deckenfläche streichen 2x — speisekammer/i, menge: 9.8 },
    ],
    verboten: [/wandflächen streichen.*speisekammer/i],
  },
  {
    id: 'PM-007', titel: 'Dachgeschoss: Kniestock + Dachschrägen', gewerk: 'maler',
    transkript: 'Dachzimmer, fünf mal dreieinhalb. Kniestock ist eins zwanzig hoch. Die Dachschrägen links und rechts jeweils zwölf Quadratmeter. Ein Dachfenster drin, normale Größe. Wände, Schrägen und Kniestock alles streichen, zweimal.',
    raeume: [basisRaum('Dachzimmer', { laenge: 5, breite: 3.5, hoehe: null, kniestockhoehe: 1.2, dachschraege_je_seite_m2: 12, dachfenster: [{ anzahl: 1, breite: 0.78, hoehe: 1.18, annahme: true }], arbeiten: ['waende_streichen'] })],
    soll: [
      { muster: /kniestockwände streichen 2x/i, menge: 20.4 },
      { muster: /dachschrägen streichen 2x/i, menge: 23.08 },
    ],
    verboten: [/deckenspiegel/i],
  },
  {
    id: 'PM-008', titel: 'Fassade Südseite', gewerk: 'maler',
    transkript: 'Fassade an der Südseite, zwölf Meter lang, Giebelhöhe im Schnitt sechs Meter. Drei Fenster drin, eins zwanzig mal eins vierzig. Fassadenfarbe zweimal drauf, dazu vorher Grundierung.',
    raeume: [basisRaum('Fassade', { laenge: 12, breite: null, hoehe: 6, wandflaeche_direkt: 72, fenster: [{ anzahl: 3, breite: 1.2, hoehe: 1.4, annahme: false }], arbeiten: ['waende_streichen', 'grundieren'] })],
    soll: [
      { muster: /fassadenfläche streichen 2x/i, menge: 72 },
      { muster: /grundierung|grundieren/i, menge: 72 },
    ],
    verboten: [/boden schützen/i, /deckenfläche streichen/i],
  },
  {
    id: 'PM-009', titel: 'Bodenleger-Komplettpaket (Flur)', gewerk: 'boden_parkett',
    transkript: 'Flur, vier mal eins achtzig. Alter Teppich muss komplett raus und entsorgt werden, Untergrund ist uneben, den gleich mit ausgleichen. Dann Vinylboden drauf, ganz normal gerade verlegt. Neue Sockelleisten drumrum. Am Übergang zum Wohnzimmer brauchen wir noch ne Übergangsschiene.',
    raeume: [basisRaum('Flur', { laenge: 4, breite: 1.8, belag: 'vinyl', verlegerichtung: 'standard', altbelag_entfernen: true, altbelag_vorhanden: true, sockelleisten: true, ausgleich: true, arbeiten: ['vinyl verlegen', 'altbelag entfernen', 'ausgleichen'] })],
    soll: [
      // Die Engine benennt den Altbelag konkret („Teppichboden entfernen und
      // entsorgen") statt generisch — das ist besser als die Soll-Formulierung
      // und findet auch seinen Katalogpreis. Beide Schreibweisen zugelassen.
      { muster: /altbelag entfernen|teppichboden entfernen/i, menge: 7.2 },
      { muster: /untergrund|ausgleich/i, menge: 7.2 },
      { muster: /vinyl.*verlegen/i, menge: 7.56 },
      { muster: /sockelleisten montieren/i },
      { muster: /übergangsschiene|übergangsprofil/i, menge: 1 },
    ],
  },
  {
    id: 'PM-012', titel: 'Sockelleisten nur streichen, ausdrücklich nicht neu', gewerk: 'maler',
    transkript: 'Esszimmer, viereinhalb mal drei, Höhe zwo fünfundfünfzig. Wände streichen, zweimal drüber, ganz normal. Die Sockelleisten bleiben genau wie sie sind, die werden NICHT neu gemacht, die NICHT demontiert — die sollen nur nochmal mitgestrichen werden, in der gleichen Farbe wie die Wand. Ein Fenster, Standardgröße, eine Tür, normal Maß.',
    raeume: [basisRaum('Esszimmer', { laenge: 4.5, breite: 3, hoehe: 2.55, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['waende_streichen'] })],
    soll: [{ muster: /wandflächen streichen 2x/i, menge: 38.25 }],
    verboten: [/sockelleisten montieren/i, /sockelleisten entfernen/i],
  },
  {
    id: 'PM-017', titel: 'Tapete statt Streichen, Grundierung abgelehnt', gewerk: 'maler',
    transkript: 'Kinderzimmer, vier mal drei, Höhe zwo fünfzig. Wände tapezieren, keine Farbe. Der Putz ist frisch, aber Grundierung brauchen wir trotzdem nicht, das lassen wir weg. Ein Fenster, normale Größe, eine Tür, normal Maß.',
    raeume: [basisRaum('Kinderzimmer', { laenge: 4, breite: 3, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['tapezieren'] })],
    soll: [{ muster: /tapezieren|tapete/i }],
    verboten: [/wandflächen streichen/i, /grundierung|voranstrich/i, /tapete entfernen|tapete ablösen/i],
  },
  {
    id: 'PM-019', titel: 'Erschwerniszuschlag schwieriger Untergrund (Gäste-WC)', gewerk: 'maler',
    transkript: 'Gästeklo, zwei mal eins fünfzig, Höhe zwo vierzig. Wände streichen, zweimal. Der Putz ist aber total uneben und bröckelig, ein wirklich schwieriger Untergrund, das wird aufwendiger als normal. Eine Tür, kein Fenster.',
    raeume: [basisRaum('Gästeklo', { laenge: 2, breite: 1.5, hoehe: 2.4, tueren: [TUER], fenster: [], arbeiten: ['waende_streichen'] })],
    soll: [
      { muster: /wandflächen streichen 2x/i, menge: 16.8 },
      { muster: /erschwerniszuschlag schwieriger untergrund/i },
    ],
    verboten: [/erschwerniszuschlag raumhöhe/i, /erschwerniszuschlag altbau/i],
  },
  {
    id: 'PM-020', titel: 'Teppich verlegen, alter Belag bleibt liegen', gewerk: 'boden_parkett',
    transkript: 'Kinderzimmer zwei, drei mal drei sechzig. Teppichboden auslegen, ganz normal, kein Muster. Die alten Dielen bleiben einfach drunter liegen, die kommen nicht raus.',
    raeume: [basisRaum('Kinderzimmer', { laenge: 3, breite: 3.6, belag: 'teppich', verlegerichtung: 'standard', arbeiten: ['teppich verlegen'] })],
    soll: [{ muster: /teppich.*verlegen/i, menge: 10.8 }],
    verboten: [/altbelag entfernen/i, /trittschall/i, /sockelleisten montieren/i],
  },
  {
    id: 'PM-021', titel: 'Mehrere Öffnungen + Einfachanstrich (Wohnküche)', gewerk: 'maler',
    transkript: 'Wohnküche, sechs mal fünf, Höhe zwo sechzig. Zwei Fenster: eins ist eins zwanzig mal eins vierzig, das andere achtzig mal eins zehn. Zwei Türen: eine normal Maß, die andere eine breite Terrassentür, zwei Meter mal zwo zehn. Wände streichen, einmal drüber reicht.',
    raeume: [basisRaum('Wohnküche', {
      laenge: 6, breite: 5, hoehe: 2.6,
      tueren: [{ anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: false }, { anzahl: 1, breite: 2.0, hoehe: 2.1, annahme: false }],
      fenster: [{ anzahl: 1, breite: 1.2, hoehe: 1.4, annahme: false }, { anzahl: 1, breite: 0.8, hoehe: 1.1, annahme: false }],
      arbeiten: ['waende_streichen'],
    })],
    soll: [{ muster: /wandflächen streichen 1x/i, menge: 53 }],
  },
  {
    id: 'PM-022', titel: 'Schlafzimmer, Baseline-Malerfall', gewerk: 'maler',
    transkript: 'Schlafzimmer, vier Meter fünfzig mal drei Meter achtzig, Höhe zwo fünfzig. Wände zweimal streichen, Decke einmal mit. Ein Fenster, Standardmaß, eine Tür, normal.',
    raeume: [basisRaum('Schlafzimmer', { laenge: 4.5, breite: 3.8, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['waende_streichen', 'decke_streichen'] })],
    soll: [
      { muster: /wandflächen streichen 2x/i, menge: 41.5 },
      { muster: /deckenfläche streichen 1x/i, menge: 17.1 },
      { muster: /boden schützen/i, menge: 17.1 },
      { muster: /sockelleisten abkleben/i, menge: 16.6 },
    ],
    verboten: [/erschwerniszuschlag/i, /spachtel/i, /grundierung|voranstrich/i],
  },
  {
    id: 'PM-023', titel: 'Flur, reiner Bodenfall', gewerk: 'boden_parkett',
    transkript: 'Flur, sechs Meter mal eins Meter achtzig, eine Tür normal Maß. Laminat, ganz normal gerade verlegt, mit Trittschalldämmung drunter. Sockelleisten neu montieren rundrum.',
    raeume: [basisRaum('Flur', { laenge: 6, breite: 1.8, tueren: [TUER], belag: 'laminat', verlegerichtung: 'standard', sockelleisten: true, arbeiten: ['laminat verlegen'] })],
    soll: [
      { muster: /laminat verlegen/i, menge: 11.34 },
      { muster: /trittschall/i, menge: 10.8 },
      { muster: /sockelleisten montieren/i, menge: 15.6 },
    ],
    verboten: [/wandflächen streichen/i, /deckenfläche streichen/i],
  },
  {
    id: 'PM-024', titel: 'Büro, Erschwerniszuschlag Höhe', gewerk: 'maler',
    transkript: 'Büro, fünf Meter mal vier Meter, Höhe drei Meter zwanzig. Wände zweimal streichen. Zwei Fenster, Standardmaß, eine Tür, normal.',
    raeume: [basisRaum('Büro', { laenge: 5, breite: 4, hoehe: 3.2, tueren: [TUER], fenster: [FENSTER(2)], arbeiten: ['waende_streichen'] })],
    soll: [
      { muster: /wandflächen streichen 2x/i, menge: 57.6 },
      { muster: /erschwerniszuschlag raumhöhe > 3m — büro/i },
      { muster: /boden schützen/i, menge: 20 },
      { muster: /sockelleisten abkleben/i, menge: 18 },
    ],
    verboten: [/deckenfläche streichen/i],
  },
  {
    id: 'PM-025', titel: 'Gästezimmer, Vinyl Fischgrät + neue Sockelleisten', gewerk: 'boden_parkett',
    transkript: 'Gästezimmer, vier Meter mal drei Meter fünfzig, eine Tür normal Maß. Vinylboden im Fischgrätmuster verlegen. Sockelleisten werden auch neu montiert, passend zum Fischgrätmuster.',
    raeume: [basisRaum('Gästezimmer', { laenge: 4, breite: 3.5, tueren: [TUER], belag: 'vinyl', verlegerichtung: 'fischgraet', sockelleisten: true, arbeiten: ['vinyl verlegen'] })],
    soll: [
      { muster: /vinyl.*verlegen/i, menge: 16.1 },
      { muster: /sockelleisten montieren/i, menge: 15 },
    ],
    verboten: [/streichen/i],
  },
  {
    id: 'PM-026', titel: 'Küche, Wand 2x und Decke 1x', gewerk: 'maler',
    transkript: 'Küche, vier Meter zwanzig mal drei Meter sechzig, Höhe zwo fünfzig. Wände zweimal streichen, Decke reicht einmal. Zwei Fenster, Standardmaß, eine Tür, normal.',
    raeume: [basisRaum('Küche', { laenge: 4.2, breite: 3.6, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER(2)], arbeiten: ['waende_streichen', 'decke_streichen'] })],
    soll: [
      { muster: /wandflächen streichen 2x/i, menge: 39 },
      { muster: /deckenfläche streichen 1x/i, menge: 15.12 },
      { muster: /boden schützen/i, menge: 15.12 },
      { muster: /sockelleisten abkleben/i, menge: 15.6 },
    ],
    verboten: [/deckenfläche streichen 2x/i],
  },
  {
    id: 'PM-027', titel: 'Kellerraum, Parkett gerade + Altbelag raus', gewerk: 'boden_parkett',
    transkript: 'Kellerraum, fünf Meter mal drei Meter, eine Tür normal Maß. Der alte Teppich muss komplett raus, danach Parkett verlegen, ganz normal gerade, kein Muster.',
    raeume: [basisRaum('Kellerraum', { laenge: 5, breite: 3, tueren: [TUER], belag: 'parkett', verlegerichtung: 'standard', altbelag_entfernen: true, altbelag_vorhanden: true, arbeiten: ['parkett verlegen', 'altbelag entfernen'] })],
    soll: [
      { muster: /altbelag entfernen/i, menge: 15 },
      { muster: /parkett verlegen/i, menge: 15.75 },
    ],
    verboten: [/sockelleisten/i],
  },
  {
    id: 'PM-028', titel: 'Arbeitszimmer, Altbau + explizite Grundierung', gewerk: 'maler',
    transkript: 'Arbeitszimmer, vier Meter mal drei Meter fünfzig, Höhe zwo fünfzig, ist ein Altbau. Wände bitte grundieren und dann zweimal streichen. Ein Fenster, Standardmaß, eine Tür, normal.',
    raeume: [basisRaum('Arbeitszimmer', { laenge: 4, breite: 3.5, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['waende_streichen', 'grundieren'] })],
    soll: [
      { muster: /wandflächen streichen 2x/i, menge: 37.5 },
      { muster: /grundierung|voranstrich|grundieren/i, menge: 37.5 },
      { muster: /erschwerniszuschlag altbau/i },
      { muster: /boden schützen/i, menge: 14 },
      { muster: /sockelleisten abkleben/i, menge: 15 },
    ],
    verboten: [/spachtel/i],
  },
  {
    id: 'PM-029', titel: 'Abstellraum, Mini-Raum ohne Öffnung', gewerk: 'maler',
    transkript: 'Abstellraum, zwei Meter mal eins Meter achtzig, Höhe zwo vierzig. Wände einmal streichen reicht völlig. Kein Fenster, keine Tür.',
    raeume: [basisRaum('Abstellraum', { laenge: 2, breite: 1.8, hoehe: 2.4, tueren: [], fenster: [], arbeiten: ['waende_streichen'] })],
    soll: [
      { muster: /wandflächen streichen 1x/i, menge: 18.24 },
      { muster: /boden schützen/i, menge: 3.6 },
      { muster: /sockelleisten abkleben/i, menge: 7.6 },
    ],
  },
  {
    id: 'PM-030', titel: 'Dachzimmer 2, Dachgeschoss', gewerk: 'maler',
    transkript: 'Dachzimmer, vier Meter fünfzig mal vier Meter. Kniestock ist eins Meter hoch. Die Dachschrägen zusammen ergeben achtzehn Quadratmeter. Ein Dachfenster drin, normale Größe. Wände, Schrägen und Kniestock alles zweimal streichen.',
    raeume: [basisRaum('Dachzimmer', { laenge: 4.5, breite: 4, hoehe: null, kniestockhoehe: 1.0, dachschraege_flaeche_m2: 18, dachfenster: [{ anzahl: 1, breite: 0.78, hoehe: 1.18, annahme: true }], arbeiten: ['waende_streichen'] })],
    soll: [
      { muster: /kniestockwände streichen 2x/i, menge: 17 },
      { muster: /dachschrägen streichen 2x/i, menge: 17.08 },
      { muster: /boden schützen/i, menge: 18 },
    ],
  },
  {
    id: 'PM-031', titel: 'Fassade Nordseite', gewerk: 'maler',
    transkript: 'Fassade an der Nordseite, zehn Meter lang, Wandhöhe fünf Meter. Zwei Fenster drin, jeweils eins zwanzig mal eins vierzig. Einmal Fassadenfarbe drauf.',
    raeume: [basisRaum('Fassade', { laenge: 10, breite: null, hoehe: 5, wandflaeche_direkt: 50, fenster: [{ anzahl: 2, breite: 1.2, hoehe: 1.4, annahme: false }], arbeiten: ['waende_streichen'] })],
    soll: [{ muster: /fassadenfläche streichen 1x/i, menge: 50 }],
    verboten: [/grundierung|voranstrich/i, /boden schützen/i, /deckenfläche streichen/i],
  },
]

describe('Prüfmeister-Soll — jeder dokumentierte Testfall trifft seine Soll-Lösung', () => {
  for (const fall of FAELLE) {
    describe(`${fall.id} — ${fall.titel}`, () => {
      const positionen = rechne(fall)
      const liste = positionen.map(p => `${p.beschreibung} = ${p.menge} ${p.einheit}`).join('\n  ')

      for (const s of fall.soll) {
        it(`enthält „${s.muster.source}"${s.menge != null ? ` mit ${s.menge}` : ''}`, () => {
          const treffer = positionen.filter(p => s.muster.test(p.beschreibung))
          expect(treffer.length, `nicht gefunden. Erzeugt wurde:\n  ${liste}`).toBeGreaterThan(0)
          if (s.menge != null) {
            const mengen = treffer.map(t => t.menge)
            const passt = mengen.some(m => Math.abs(m - s.menge!) <= 0.02)
            expect(passt, `Menge weicht ab: erwartet ${s.menge}, bekommen ${mengen.join(' / ')}`).toBe(true)
          }
        })
      }

      for (const v of fall.verboten ?? []) {
        it(`erfindet kein „${v.source}"`, () => {
          const treffer = positionen.filter(p => v.test(p.beschreibung))
          expect(treffer.map(t => t.beschreibung)).toEqual([])
        })
      }

      it('jede erzeugte Position findet einen Katalogpreis', () => {
        const ohne = positionen
          .filter(p => !preisFuer(p.beschreibung, p.einheit, fall.gewerk))
          .map(p => `${p.beschreibung} [${p.einheit}]`)
        expect(ohne).toEqual([])
      })
    })
  }
})

// ── Umlaut-Invarianz ────────────────────────────────────────────────────────
//
// Beim Soll-Audit am 2026-08-31 war DREIMAL dieselbe Ursache im Spiel: ein
// Muster, das die umlautlose Schreibweise nicht trifft. „waende_streichen"
// wurde nicht als Wand-Arbeit erkannt (und die teuerste Position des Angebots
// still gelöscht), „fischgraet" nicht als Musterverlegung (zu wenig
// Verschnitt), und `\w` schloss in „Alu-Übergangsprofil" das „Ü" aus (falsche
// Stückzahl). Whisper, GPT und unsere eigenen Datenfelder schreiben mal so,
// mal so — das Ergebnis darf davon nicht abhängen.
//
// Dieser Test prüft die REGEL, nicht die drei Einzelfälle: derselbe Auftrag,
// einmal mit Umlaut und einmal ohne, muss Position für Position dasselbe
// ergeben.
describe('Umlaut-Invarianz — ä/ae, ö/oe, ü/ue dürfen das Ergebnis nie ändern', () => {
  const paare: Array<{ name: string; gewerk: 'maler' | 'boden_parkett'; transkript: string; mitUmlaut: Raum[]; ohneUmlaut: Raum[] }> = [
    {
      name: 'Wände + Decke streichen', gewerk: 'maler',
      transkript: 'Schlafzimmer, vier Meter fünfzig mal drei Meter achtzig, Höhe zwo fünfzig. Wände zweimal streichen, Decke einmal mit.',
      mitUmlaut: [basisRaum('Schlafzimmer', { laenge: 4.5, breite: 3.8, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['wände_streichen', 'decke_streichen'] })],
      ohneUmlaut: [basisRaum('Schlafzimmer', { laenge: 4.5, breite: 3.8, hoehe: 2.5, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['waende_streichen', 'decke_streichen'] })],
    },
    {
      name: 'Fischgrät-Verlegung', gewerk: 'boden_parkett',
      transkript: 'Gästezimmer, vier Meter mal drei Meter fünfzig. Vinylboden im Fischgrätmuster verlegen.',
      mitUmlaut: [basisRaum('Gästezimmer', { laenge: 4, breite: 3.5, belag: 'vinyl', verlegerichtung: 'fischgrät', arbeiten: ['vinyl verlegen'] })],
      ohneUmlaut: [basisRaum('Gästezimmer', { laenge: 4, breite: 3.5, belag: 'vinyl', verlegerichtung: 'fischgraet', arbeiten: ['vinyl verlegen'] })],
    },
    {
      name: 'Dachschrägen', gewerk: 'maler',
      transkript: 'Dachzimmer, vier Meter fünfzig mal vier Meter. Kniestock ist eins Meter hoch. Die Dachschrägen zusammen ergeben achtzehn Quadratmeter. Alles zweimal streichen.',
      mitUmlaut: [basisRaum('Dachzimmer', { laenge: 4.5, breite: 4, kniestockhoehe: 1, dachschraege_flaeche_m2: 18, arbeiten: ['wände_streichen'] })],
      ohneUmlaut: [basisRaum('Dachzimmer', { laenge: 4.5, breite: 4, kniestockhoehe: 1, dachschraege_flaeche_m2: 18, arbeiten: ['waende_streichen'] })],
    },
  ]

  for (const paar of paare) {
    it(`${paar.name}: beide Schreibweisen ergeben dasselbe Angebot`, () => {
      const alsText = (raeume: Raum[]) => rechne({
        id: paar.name, titel: paar.name, gewerk: paar.gewerk,
        transkript: paar.transkript, raeume, soll: [],
      }).map(p => `${p.beschreibung} = ${p.menge} ${p.einheit}`).sort()
      expect(alsText(paar.ohneUmlaut)).toEqual(alsText(paar.mitUmlaut))
    })
  }
})
