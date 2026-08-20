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
type Wand = Record<string, unknown> & { name?: string; arbeiten?: string[] }
interface Fall {
  name: string
  gewerk: 'maler' | 'boden_parkett'
  transkript: string
  raeume: Raum[]
  // Fassaden (kein Raum, kein Boden/Decke) — PM-008.
  waende?: Wand[]
  // Exakte Mengen-Prüfungen: Substring in beschreibung → erwartete Menge (±0.05)
  exakteMengen: Array<{ enthaelt: string; menge: number }>
  verboten: string[]
  // Optional: Annahme-Text muss einen Substring enthalten (fängt PM-002-Klasse:
  // Text sagt etwas anderes, als die Rechnung tatsächlich tut)
  annahmenPruefung?: Array<{ enthaelt: string; textEnthaelt: string }>
}

function pipeline(fall: Fall): BerechnetePosition[] {
  const eng = berechneMengen(fall.gewerk, { transkript: fall.transkript, raeume: fall.raeume, waende: fall.waende ?? [], gewerk: fall.gewerk })
  const signale = {
    arbeitenTexte: [
      ...fall.raeume.flatMap(r => r.arbeiten ?? []),
      ...(fall.waende ?? []).flatMap(w => w.arbeiten ?? []),
    ],
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
    name: 'Testfall 1b — Realitäts-Fall: GPT verpasst den Ausschluss trotzdem (Decke in arbeiten[])',
    gewerk: 'maler',
    // PM-001, echter Nachtest im Tool (2026-08-16): die Aufnahme-Karte zeigte
    // den Ausschluss korrekt (kein "Decke streichen"), aber das FERTIGE
    // Angebot enthielt trotzdem "Deckenfläche streichen 2×" für 234,52 €.
    // Erklärung: Karte und finaler Entwurf lösen zwei UNABHÄNGIGE GPT-
    // Extraktionen auf demselben Transkript aus (kein rueckfragen-Fall, also
    // kein Wiederverwenden von basis_extraktion) — bei einer davon hat GPT
    // den weit hinten im Satz stehenden Ausschluss übersehen und 'decke
    // streichen' doch in arbeiten[] gepackt. Dieser Testfall simuliert genau
    // DIESEN (nicht den korrekten) Extraktions-Ausgang und prüft, ob die
    // deterministische Scope-Prüfung — die NICHT auf GPT angewiesen ist,
    // sondern die eigenen Worte des Nutzers im Rohtranskript liest — die
    // fälschlich hinzugefügte Position trotzdem wieder rausfiltert.
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
      // Bewusst MIT 'decke streichen' — simuliert GPTs gelegentlichen Fehler.
      arbeiten: ['wände streichen', 'decke streichen'],
      fenster: [{ anzahl: 2 }],
      tueren: [{ anzahl: 1 }],
      sockelleisten: true,
    }],
    exakteMengen: [
      { enthaelt: 'wandflächen streichen', menge: 42.21 },
    ],
    verboten: ['decke'],
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
    // Nachtrag: "Wände streichen, zweimal, Decke auch mit." hatte anfangs die
    // Decke verschwinden lassen — eigener, separat gefundener Bug in
    // erkenneScope() (Kommas blockierten die alte Wortabstands-Prüfung) und
    // in der Engine (maler.ts las "Deckenhöhe" fälschlich als "Decke wird
    // gestrichen"). Beides jetzt mitrepariert, deshalb hier mitgeprüft.
    exakteMengen: [
      // Umfang 2×(6,00+1,50)=15,00 lfm; Wandbrutto 48,00 m²; kein Fenster-
      // Abzug (explizit "kein Fenster"), minus 1 Tür Standard (1,89) = 46,11 m²
      { enthaelt: 'wandflächen streichen', menge: 46.11 },
      { enthaelt: 'deckenfläche streichen', menge: 9.00 },
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
  {
    name: 'PM-007b — Dachschrägen-Grundierung nur bei explizitem Wunsch, nicht weil GPT "grundieren" vermutet',
    gewerk: 'maler',
    // PM-007, Live-Nachtest 2026-08-16: Kniestock/Dachschrägen liefen korrekt,
    // ABER eine ungefragte "Dachschrägen grundieren"-Position für 136,80 €
    // tauchte auf. "grundieren" fällt im Transkript kein einziges Mal — GPT
    // hatte es nur reflexartig in arbeiten[] gepackt (gleiches Muster wie
    // PM-003s Dübellöcher). pruefeGrundierung() hatte für den Dachschrägen-
    // Zweig keinen Schutz gegen genau diesen Fall, obwohl die Wand-Grundierung
    // direkt daneben ihn längst hatte (PM-003).
    transkript:
      'Dachzimmer, fünf mal dreieinhalb. Kniestock ist eins zwanzig hoch. Die Dachschrägen links und rechts ' +
      'jeweils zwölf Quadratmeter. Ein Dachfenster drin, normale Größe. Wände, Schrägen und Kniestock alles ' +
      'streichen, zweimal.',
    raeume: [{
      name: 'Dachzimmer',
      laenge: 5,
      breite: 3.5,
      kniestockhoehe: 1.2,
      dachschraege_je_seite_m2: 12,
      dachfenster: [{ anzahl: 1 }],
      // 'grundieren' bewusst mit drin — genau das hat GPT im echten Fall
      // getan, obwohl der Nutzer es nie gesagt hat.
      arbeiten: ['wände streichen', 'dachschrägen streichen', 'kniestock streichen', 'grundieren'],
    }],
    exakteMengen: [
      { enthaelt: 'kniestockwände streichen', menge: 20.40 },
      { enthaelt: 'dachschrägen streichen', menge: 23.08 },
    ],
    // Kernpunkt: keine erfundene Grundierung auf die volle Dachschrägenfläche (136,80 €)
    verboten: ['grundier', 'voranstrich'],
  },
  {
    name: 'PM-008b — Fassade: keine Doppelberechnung + keine ungefragte Reinigung',
    gewerk: 'maler',
    // PM-008, Live-Nachtest 2026-08-16. Fixture 1:1 aus der echten GPT-
    // Extraktion (Supabase debug_extraktion_roh, id 57ac09f2…). Fund: zwei
    // ungefragte Zusatzpositionen kamen von `pruefeFassade()` in
    // maler-tapete.ts — einer alten Funktion, die noch aus der Zeit VOR der
    // Fassaden-Engine (PM-008-Fix) stammt und die Standardpositionen selbst
    // geraten hat:
    // 1. "Fassadenfarbe 2× Anstrich" — Doppelberechnung derselben 66,96 m²,
    //    die die Engine schon als "Fassadenfläche streichen 2x" berechnet.
    // 2. "Fassade reinigen / Untergrundvorbereitung" — 66,96 m² × 5,00 € =
    //    exakt die gemeldeten 334,80 €, obwohl nie von Reinigung die Rede war.
    transkript:
      'Fassade an der Südseite, 12 Meter lang, Giebelhöhe im Schnitt 6 Meter, 3 Fenster drin, je 1.20 x 1.40, ' +
      'Fassadenfarbe zweimal drauf, dazu vorher Grundierung.',
    raeume: [],
    waende: [{
      name: 'Fassade',
      laenge: 12,
      hoehe: 6,
      fenster: [{ anzahl: 3, breite: 1.2, hoehe: 1.4 }],
      arbeiten: ['fassade grundieren', 'fassade streichen'],
    }],
    exakteMengen: [
      { enthaelt: 'fassadenfläche streichen', menge: 66.96 },
      { enthaelt: 'grundierung', menge: 66.96 },
    ],
    // Kernpunkt: keine zweite Anstrich-Position unter anderem Namen, keine
    // ungefragte Reinigung.
    verboten: ['fassadenfarbe', 'reinigen'],
  },
  {
    name: 'PM-007c — Dachfenster "normale Größe": GPTs eigene Annahme (1,20×1,00) schlägt unseren Dachfenster-Standard nicht',
    gewerk: 'maler',
    // PM-007, zweiter Live-Nachtest (2026-08-17). Fixture 1:1 aus der echten
    // GPT-Extraktion (Supabase debug_extraktion_roh, id e69ad0d0…). Sandy hat
    // "normale Größe" gesagt, ohne Maße — GPT hat sich SELBST eine Zahl
    // ausgedacht (1,20×1,00m, sein generischer "normales Fenster"-Standard,
    // ehrlich mit annahme:true markiert) statt den kleineren, für Dachfenster
    // richtigen Standard (0,78×1,18m) zu verwenden, den unser Code kennt.
    // Ergebnis vorher: 24,00 − 1,20 = 22,80 m² statt der korrekten 23,08 m².
    // Fix: bei GPTs eigener Annahme (annahme:true) gilt unser
    // Dachfenster-Standard, nicht GPTs generische Zahl.
    transkript:
      'Dachzimmer, 5 x 3.5, Kniestock ist 1.20 hoch, die Dachschrägen links und rechts jeweils 12 Quadratmeter, ' +
      '1 Dachfenster drin, normale Größe, Wände, Schrägen und Kniestock, alles streichen, zweimal.',
    raeume: [{
      name: 'Dachzimmer',
      laenge: 5,
      breite: 3.5,
      kniestockhoehe: 1.2,
      dachschraege_je_seite_m2: 12,
      dachfenster: [{ hoehe: 1, anzahl: 1, breite: 1.2, annahme: true }],
      arbeiten: ['wände streichen', 'decke streichen', 'boden abdecken', 'sockelleisten abkleben'],
    }],
    exakteMengen: [
      { enthaelt: 'kniestockwände streichen', menge: 20.40 },
      // 24,00 m² brutto − 0,92 m² (unser Dachfenster-Standard 0,78×1,18) = 23,08 m²
      { enthaelt: 'dachschrägen streichen', menge: 23.08 },
    ],
    // Nebenfund im selben Nachtest: unverlangte "Dachschräge spachteln"-
    // Position — im Transkript nie ein Ausbesserungs-Signal (kein "spachteln",
    // "Riss", "Loch" etc.), also darf sie nicht erscheinen.
    verboten: ['spachtel'],
  },
  {
    name: 'PM-012 — Sockelleisten nur streichen, ausdrücklich NICHT neu montiert (Esszimmer)',
    gewerk: 'maler',
    // PM-012, Live-Nachtest 2026-08-17. Gegenrichtung von PM-010: hier wird
    // GAR NICHT neu montiert, nur die vorhandenen Sockelleisten sollen
    // mitgestrichen werden — dreifacher, ausdrücklicher Ausschluss der
    // Neumontage im Transkript. Prüfmeister bestätigt live: kein Boden-
    // Phantom (Ausschluss wird respektiert), ABER "Sockelleisten streichen"
    // fehlte komplett — dritte unabhängige Bestätigung derselben Lücke wie
    // PM-010. Ursache (siehe Fix-Update PM-010 im Testfälle-Dokument): der
    // fünfte, eigentliche Root-Cause war, dass "fehlende" nie beim Nutzer
    // ankommt. Fix: die Menge wird jetzt von "Sockelleisten abkleben"
    // übernommen (dieselbe Umfang-minus-Türen-Formel, IMMER vorhanden sobald
    // im Raum gestrichen wird), unabhängig davon, ob neu montiert wird.
    transkript:
      'Esszimmer, viereinhalb mal drei, Höhe zwo fünfundfünfzig. Wände streichen, zweimal drüber, ganz normal. ' +
      'Die Sockelleisten bleiben genau wie sie sind, die werden NICHT neu gemacht, die NICHT demontiert — die ' +
      'sollen nur nochmal mitgestrichen werden, in der gleichen Farbe wie die Wand. Ein Fenster, Standardgröße, ' +
      'eine Tür, normal Maß.',
    raeume: [{
      name: 'Esszimmer',
      laenge: 4.5,
      breite: 3,
      hoehe: 2.55,
      // Bewusst OHNE 'sockelleisten montieren'/'entfernen' — ausdrücklicher
      // Ausschluss der Neumontage. NUR 'sockelleisten streichen' drin, das
      // korrekte Signal für den Wunsch "nur mitstreichen".
      arbeiten: ['wände streichen', 'sockelleisten streichen'],
      fenster: [{ anzahl: 1 }],
      tueren: [{ anzahl: 1 }],
      sockelleisten: true,
    }],
    exakteMengen: [
      // Umfang 2×(4,50+3,00)=15,00 lfm; Wandbrutto 38,25 m²; Abzug 1 Fenster
      // Standard (1,20) + 1 Tür Standard (1,89) = 35,16 m²
      { enthaelt: 'wandflächen streichen', menge: 35.16 },
      // Sockelleisten streichen: Umfang 15,00 − 1 Türbreite (0,90) = 14,10 lfdm
      // — übernommen von "Sockelleisten abkleben", keine eigene Meterangabe im Transkript.
      { enthaelt: 'sockelleisten streichen', menge: 14.10 },
    ],
    // Kernpunkt: kein Boden-Phantom trotz dreifacher Sockelleisten-Erwähnung,
    // UND "Sockelleisten montieren" darf nicht als Maler-Position auftauchen.
    verboten: ['sockelleisten montieren', 'sockelleisten entfernen'],
  },
  {
    name: 'PM-013 — Fischgrät-Verlegung braucht denselben Verschnitt wie Diagonal (Wohnzimmer)',
    gewerk: 'boden_parkett',
    // PM-013, Live-Nachtest 2026-08-19. Fund: GPTs Extraktion liefert für
    // Fischgrät-Verlegung `verlegerichtung: "fischgrät"` (bestätigt an echten
    // Produktions-Rohdaten, debug_extraktion_roh) — boden.ts hat aber bisher
    // NUR auf den exakten String 'diagonal' geprüft, Fischgrät fiel auf
    // standardVerschnitt() zurück, die für Parkett 0% liefert. Ergebnis im
    // echten Entwurf: 36,00 m² statt der geforderten 39,60–41,40 m²
    // (10–15% Verschnitt-Korridor lt. Testfall-Soll-Lösung). Fix:
    // MUSTER_MIT_MEHR_VERSCHNITT-Regex erkennt jetzt auch "fischgrät"/
    // "fischgrat" und wendet denselben 15%-Satz an wie bei Diagonalverlegung.
    transkript:
      'Wohnzimmer, acht mal viereinhalb. Eichenparkett, Fischgrät verlegt, das braucht ja mehr Verschnitt. ' +
      'Boden nur, an den Wänden machen wir nix.',
    raeume: [{
      name: 'Wohnzimmer',
      laenge: 8,
      breite: 4.5,
      belag: 'eichenparkett',
      verlegerichtung: 'fischgrät',
      arbeiten: ['parkett verlegen'],
    }],
    exakteMengen: [
      // Fläche 8×4,5=36,00 m² + 15% Verschnitt = 41,40 m² — liegt am oberen
      // Rand des geforderten 39,60–41,40 m²-Korridors (10–15%), klar über dem
      // (falschen) 0%-Ist-Zustand und über dem Standard für gerade Verlegung (5%).
      { enthaelt: 'fertigparkett verlegen', menge: 41.40 },
    ],
    // Kernpunkt: keine Wand-/Deckenposition — ausdrücklich ausgeschlossen
    // ("an den Wänden machen wir nix"), reiner Boden-Gewerk-Testfall.
    verboten: ['wandflächen streichen', 'deckenfläche streichen'],
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
