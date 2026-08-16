import { describe, it, expect } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import type { BerechnetePosition } from '../mengen/types'

// ── GOLDEN TESTS: Ausschlüsse & Korrekturen ─────────────────────────────────
//
// Diese Fälle kommen von Sandy (händisch eingesprochen + im echten Tool
// geprüft) und decken genau die Fehlerklasse ab, die dem Audit am meisten
// Sorgen macht: der Nutzer sagt ausdrücklich "X NICHT" oder korrigiert sich
// ("ein Fenster — ne, zwei"), und später überschreibt eine der Verarbeitungs-
// Stufen das still.
//
// WICHTIG — was dieser Test NICHT prüft:
// Er ruft NICHT die echte GPT-Extraktion auf (kostet Geld, ist nicht
// deterministisch). Die `raeume`-Struktur unten ist das, was eine KORREKTE
// Extraktion für den Transkript-Text liefern muss (per Hand geprüft, siehe
// Kommentar je Fall). Der Test schützt also: WENN die Extraktion richtig
// war, rechnet die Engine weiterhin richtig UND erfindet keine Position, die
// der Nutzer ausdrücklich ausgeschlossen hat. Ob GPT selbst den Ausschluss
// immer korrekt erkennt, ist eine separate Frage — dafür bräuchte es einen
// echten (kostenpflichtigen) End-to-End-Test.

type Raum = Record<string, unknown> & { name: string; arbeiten?: string[] }
interface Fall {
  name: string
  gewerk: 'maler' | 'boden_parkett'
  transkript: string
  raeume: Raum[]
  // Exakte Mengen-Prüfungen: Substring in beschreibung → erwartete Menge (±0.05)
  exakteMengen: Array<{ enthaelt: string; menge: number }>
  verboten: string[]
  // Optional: Annahme-Text muss einen Substring enthalten (fängt PM-002-Klasse:
  // Text sagt etwas anderes, als die Rechnung tatsächlich tut)
  annahmenPruefung?: Array<{ enthaelt: string; textEnthaelt: string }>
}

function pipeline(fall: Fall): BerechnetePosition[] {
  const eng = berechneMengen(fall.gewerk, { transkript: fall.transkript, raeume: fall.raeume, gewerk: fall.gewerk })
  const signale = {
    arbeitenTexte: fall.raeume.flatMap(r => r.arbeiten ?? []),
    belagText: (fall.raeume.find(r => r.belag) as { belag?: string } | undefined)?.belag ?? null,
    altbelagEntfernen: fall.raeume.some(r => (r as { altbelag_entfernen?: boolean }).altbelag_entfernen === true),
    // PM-005: Räume mit Namen weiterreichen, damit "nur X" pro Raum geprüft wird.
    raeume: fall.raeume.map(r => ({ name: r.name, arbeiten: r.arbeiten })),
  }
  const meta = {
    fensterAnzahl: zaehleFenster(fall.transkript) || undefined,
    tuerenAnzahl: zaehleTueren(fall.transkript) || undefined,
  }
  const { positionen } = pruefeUndErgaenzeVollstaendigkeit(fall.gewerk, eng.positionen, fall.transkript, meta, signale)
  return positionen
}

const KORPUS: Fall[] = [
  {
    name: 'Testfall 1 — Ausschluss + Selbstkorrektur (Wohnzimmer)',
    gewerk: 'maler',
    // Sandys Original-Einsprache, 2026-08-09. Im Tool geprüft (gpt-4o):
    // Decke korrekt ausgeschlossen, Fenster korrekt bei 2 (Korrektur gefangen).
    // raeume unten spiegelt genau dieses korrekte Extraktions-Ergebnis.
    transkript:
      'Also, äh, Wohnzimmer, fünf zwanzig mal vier zehn, Deckenhöhe zwo fünfzig. Wände komplett streichen, ' +
      'zweimal drüber. Ein Fenster — ne halt, zwei Fenster sind da drin, Standardgröße reicht. Eine Tür, normal ' +
      'Maß. Die Decke lassen wir, ist erst letztes Jahr gemacht worden, die bitte NICHT mitrechnen. Sockelleisten ' +
      'kleben wir noch ab, sind aus Holz, werden mitgestrichen.',
    raeume: [{
      name: 'Wohnzimmer',
      laenge: 5.2,
      breite: 4.1,
      hoehe: 2.5,
      // Bewusst OHNE 'decke streichen' — das ist der ausdrückliche Ausschluss.
      arbeiten: ['wände streichen'],
      fenster: [{ anzahl: 2 }],
      tueren: [{ anzahl: 1 }],
      sockelleisten: true,
    }],
    exakteMengen: [
      // Umfang 2×(5,20+4,10)=18,60 lfm; Wandfläche brutto 46,50 m²;
      // Abzug 2 Fenster Standard (1,20×1,00=1,20 je Stk) + 1 Tür Standard
      // (0,90×2,10=1,89): 46,50 − 2,40 − 1,89 = 42,21 m²
      { enthaelt: 'wandflächen streichen', menge: 42.21 },
      // Sockelleisten abkleben: Umfang 18,60 − 1 Türbreite (0,90) = 17,70 lfm
      { enthaelt: 'sockelleisten abkleben', menge: 17.70 },
    ],
    // Größter Fehler laut Sandy: Decke taucht trotz ausdrücklichem
    // Ausschluss doch auf. Zweitgrößter: Sockelleisten landet als
    // "montieren" statt "abkleben" (falsches Gewerk-Verhalten).
    verboten: ['decke', 'sockelleisten montieren'],
  },
  {
    name: 'PM-002a — Akzentwand + Restwände (Maler-Teil, Schlafzimmer)',
    gewerk: 'maler',
    // PM-002, 2026-08-16. Fund: Code nahm die LÄNGERE Wandseite (Math.max),
    // Kommentar + Annahme-Text sagten "kürzere" — Code war abgedriftet.
    // Fix: zurück auf Math.min (siehe maler.ts), Text und Rechnung stimmen
    // jetzt wieder überein.
    transkript:
      'Schlafzimmer, vier mal dreieinhalb, Höhe zwo sechzig. Drei Wände weiß streichen, zweimal. Die Wand ' +
      'hinterm Bett kriegt Tapete, sozusagen Akzentwand, der Rest bleibt weiß. Ein Fenster, eine Tür, normal.',
    raeume: [{
      name: 'Schlafzimmer',
      laenge: 4,
      breite: 3.5,
      hoehe: 2.6,
      arbeiten: ['wände streichen'],
      fenster: [{ anzahl: 1 }],
      tueren: [{ anzahl: 1 }],
    }],
    exakteMengen: [
      // Umfang 2×(4+3,5)=15,00 lfm; Wandbrutto 39,00 m²; Abzug Fenster
      // 1,20 m² + Tür 1,89 m² = Wandnetto 35,91 m²
      // Akzentwand = KÜRZERE Seite (3,50 m) × 2,60 m = 9,10 m²
      { enthaelt: 'akzentwand', menge: 9.10 },
      // Restwände: 35,91 − 9,10 = 26,81 m²
      { enthaelt: 'restwände streichen', menge: 26.81 },
    ],
    verboten: [],
    annahmenPruefung: [
      { enthaelt: 'akzentwand', textEnthaelt: 'kürzere' },
    ],
  },
  {
    name: 'PM-002b — Sockelleisten mit Türabzug (Boden-Teil, Schlafzimmer)',
    gewerk: 'boden_parkett',
    // PM-002, 2026-08-16. Fund: boden.ts hat tueren[] nie aus dem Raum
    // gelesen, Sockelleisten-Umfang lief immer ohne Türabzug — inkonsistent
    // zu maler.ts, wo der Abzug an zwei Stellen schon lief. Fix: gemeinsame
    // Funktion berechneSockelleistenLaenge() für beide Gewerke.
    transkript: 'Schlafzimmer, Boden kriegt Klick-Vinyl, diagonal verlegt. Sockelleisten werden neu montiert.',
    raeume: [{
      name: 'Schlafzimmer',
      laenge: 4,
      breite: 3.5,
      belag: 'klick-vinyl',
      verlegerichtung: 'diagonal',
      sockelleisten: true,
      tueren: [{ anzahl: 1, breite: 0.9 }],
      arbeiten: ['vinyl verlegen'],
    }],
    exakteMengen: [
      // Vinyl diagonal: 4×3,5=14,00 m² + 15% Verschnitt = 16,10 m²
      { enthaelt: 'vinyl verlegen', menge: 16.10 },
      // Sockelleisten: Umfang 15,00 − 1 Türbreite (0,90) = 14,10 lfm
      // (vorher, ohne Fix: 15,00 lfm — kompletter Türabzug hat gefehlt)
      { enthaelt: 'sockelleisten montieren', menge: 14.10 },
    ],
    verboten: ['estrich'],
  },
  {
    name: 'PM-005 — Zwei Räume, "nur Decke" in einem Raum darf den anderen nicht ausbremsen',
    gewerk: 'maler',
    // PM-005, 2026-08-16, Sandys "schwerster Fund bisher". Fund: "nur Decke"
    // wurde GLOBAL über den ganzen Mehrraum-Text erkannt statt pro Raum — die
    // Speisekammer-Einschränkung hat der Küche ihre Wandflächen weggefiltert.
    // Fix: scopeProRaum in auftrags-verstaendnis.ts (Scope aus der arbeiten[]-
    // Liste JEDES Raums, nicht aus dem Rohtext) + raum-scoped Filter in
    // wendeNurXFilterAn (maler-basis.ts).
    transkript:
      'Zwei Räume: Küche, dreieinhalb mal zwo achtzig, Höhe zwo fünfzig, Wände und Decke komplett streichen, ' +
      'zweimal. Daneben die Speisekammer, auch dreieinhalb mal zwo achtzig, Höhe genauso — aber da nur die ' +
      'Decke streichen, zweimal, die Wände lassen wir in Ruhe.',
    raeume: [
      {
        name: 'Küche',
        laenge: 3.5,
        breite: 2.8,
        hoehe: 2.5,
        arbeiten: ['wände streichen', 'decke streichen'],
        fenster: [{ anzahl: 1 }],
        tueren: [{ anzahl: 1 }],
      },
      {
        name: 'Speisekammer',
        laenge: 3.5,
        breite: 2.8,
        hoehe: 2.5,
        // Bewusst OHNE 'wände streichen' — ausdrücklicher Ausschluss
        // ("die Wände lassen wir in Ruhe").
        arbeiten: ['decke streichen'],
      },
    ],
    exakteMengen: [
      // Umfang 2×(3,50+2,80)=12,60 lfm; Wandbrutto 31,50 m²; Abzug 1 Fenster
      // Standard (1,20) + 1 Tür Standard (1,89) = 28,41 m²
      { enthaelt: 'wandflächen streichen 2x — küche', menge: 28.41 },
      { enthaelt: 'deckenfläche streichen 2x — küche', menge: 9.80 },
      { enthaelt: 'deckenfläche streichen 2x — speisekammer', menge: 9.80 },
    ],
    // Kernpunkt des Fixes: die Speisekammer darf trotz "nur Decke" niemals
    // eine eigene Wandposition bekommen — UND das darf die Küches Wand von
    // oben (siehe exakteMengen) nicht mit wegreißen.
    verboten: ['wandflächen streichen 2x — speisekammer'],
  },
  {
    name: 'PM-003 — Kleinreparatur (Dübellöcher) darf keine Grundierung auf volle Wandfläche auslösen',
    gewerk: 'maler',
    // PM-003, 2026-08-16. Fund: GPT trug "grundieren" wegen der Dübellöcher in
    // die arbeiten[]-Liste ein (fachlich nachvollziehbar), obwohl im Transkript
    // nie "grundieren"/"Neubau"/"Erstanstrich" fällt. pruefeGrundierung hat das
    // trotzdem auf die KOMPLETTE Wandfläche gerechnet: 276,66 € für zwei
    // Dübellöcher. Fix: ohne echtes Vollflächen-Signal im Rohtext gibt's dafür
    // nur noch eine Erinnerung in "fehlende", keine erfundene Zahl.
    transkript:
      'Flur, sechs mal eins fünfzig, Deckenhöhe drei zwanzig — is schon ne hohe Bude hier. Kein Fenster im ' +
      'Flur, aber eine Tür, normal Maß. Wände streichen, zweimal, Decke auch mit. 2 Dübellöcher spachteln, ' +
      'sonst nix Großes. Boden lass mal weg, der bleibt wie er ist, den nicht anfassen.',
    raeume: [{
      name: 'Flur',
      laenge: 6,
      breite: 1.5,
      hoehe: 3.2,
      // 'grundieren' bewusst mit drin — genau das hat GPT im echten Fall
      // getan (Reparatur → Grundierung mitgedacht). Der Bug war NIE, ob das
      // erkannt wird, sondern WELCHE Fläche dafür berechnet wird.
      arbeiten: ['wände streichen', 'decke streichen', 'grundieren'],
      tueren: [{ anzahl: 1 }],
    }],
    // ACHTUNG: Deckenfläche fehlt hier separat — eigener, neu gefundener Bug
    // (nicht Teil der ursprünglichen PM-003-Befunde, siehe Notiz an Sandy):
    // "Wände streichen, zweimal, Decke auch mit." lässt erkenneScope() wegen
    // der Kommas fälschlich "nur Wände" annehmen. Erster Fixversuch hat 4
    // andere Tests zerschossen — bewusst NICHT hier mit-repariert, sondern
    // zurückgestellt für einen eigenen, sauberen Anlauf. Dieser Test prüft
    // NUR den Grundierungs-Fix, nicht die Decke.
    exakteMengen: [
      // Umfang 2×(6,00+1,50)=15,00 lfm; Wandbrutto 48,00 m²; kein Fenster-
      // Abzug (explizit "kein Fenster"), minus 1 Tür Standard (1,89) = 46,11 m²
      { enthaelt: 'wandflächen streichen', menge: 46.11 },
      { enthaelt: 'dübellöcher spachteln', menge: 2 },
    ],
    // Kernpunkt: keine Grundierung/Voranstrich-Position auf 46,11 m² (276,66 €)
    verboten: ['voranstrich', 'grundierung'],
  },
  {
    name: 'PM-004 — Verschnitt bei gerader Verlegung: 5%, nicht pauschal 10%',
    gewerk: 'boden_parkett',
    // PM-004, 2026-08-16. Fund: standardVerschnitt() gab pauschal 10% für
    // Laminat/Vinyl/Linoleum, egal wie verlegt wird — nur Diagonal hatte
    // einen eigenen Wert (15%). Fachwissen-Standard bei gerader Verlegung:
    // ca. 5%. Fix: standardVerschnitt() gibt jetzt 5%.
    transkript: 'Kinderzimmer, vier mal drei, Höhe zwo sechzig. Laminat, ganz normal gerade verlegt, keine ' +
      'Muster oder so. Drunter kommt noch ne Trittschalldämmung.',
    raeume: [{
      name: 'Kinderzimmer',
      laenge: 4,
      breite: 3,
      belag: 'laminat',
      verlegerichtung: 'gerade',
      arbeiten: ['laminat verlegen'],
    }],
    exakteMengen: [
      // Fläche 4×3=12,00 m² + 5% Verschnitt = 12,60 m² (vorher, ohne Fix: 13,20 m²)
      { enthaelt: 'laminat verlegen', menge: 12.60 },
    ],
    verboten: ['estrich'],
  },
]

describe('Golden Tests — Ausschlüsse & Korrekturen (exakte Mengen)', () => {
  it.each(KORPUS)('$name', (fall) => {
    const positionen = pipeline(fall)
    const namen = positionen.map(p => p.beschreibung.toLowerCase())

    for (const { enthaelt, menge } of fall.exakteMengen) {
      const treffer = positionen.find(p => p.beschreibung.toLowerCase().includes(enthaelt))
      expect(treffer, `Position fehlt: "${enthaelt}" — vorhanden: ${namen.join(' | ')}`).toBeDefined()
      expect(treffer!.menge, `Falsche Menge bei "${enthaelt}"`).toBeCloseTo(menge, 1)
    }

    for (const v of fall.verboten) {
      expect(namen.some(n => n.includes(v)), `VERBOTEN aber vorhanden: "${v}" — hat: ${namen.join(' | ')}`).toBe(false)
    }

    for (const { enthaelt, textEnthaelt } of fall.annahmenPruefung ?? []) {
      const treffer = positionen.find(p => p.beschreibung.toLowerCase().includes(enthaelt))
      expect(treffer, `Position fehlt: "${enthaelt}"`).toBeDefined()
      const annahmenText = treffer!.annahmen.join(' ').toLowerCase()
      expect(annahmenText.includes(textEnthaelt), `Annahme-Text bei "${enthaelt}" sollte "${textEnthaelt}" enthalten — hat: "${annahmenText}"`).toBe(true)
    }
  })
})
