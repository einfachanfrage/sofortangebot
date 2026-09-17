// ── CoS-E-074 / DC-116 · Ausschluss in der ZEIT ───────────────────────────
//
// Gemessen, PM-116 (Prüfmeister, 16.09.2026):
//
//   „Erster Bauabschnitt Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände
//    streichen. Zweiter Bauabschnitt Küche drei mal drei, DAS KOMMT SPÄTER
//    UND WIRD EXTRA ANGEBOTEN."
//
// Die Küche stand vollständig im selben Angebot — 305,40 € für einen
// Bauabschnitt, den der Satz ausdrücklich herausnimmt. PM-097 ist derselbe
// Fall mit anderem Wortlaut („wird getrennt abgerechnet"); der Prüfmeister
// hat beide Sollstände am 17.09. wortgleich gemacht, damit hier einmal
// gebaut wird und nicht zweimal.
//
// ── Warum das nicht `raum-ausschluss.ts` (PM-034) erledigt ────────────────
//
// Der Product Designer trennt in DC-116 zwei Dinge, die gleich aussehen:
//
//   Ausschluss im UMFANG  „wird gar nicht gemacht"   → raum-ausschluss.ts
//   Ausschluss in der ZEIT „jetzt nicht, und nicht
//                           auf diesem Papier"       → diese Datei
//
// `ausgeschlosseneRaeume()` verlangt bewusst ZWEI Bedingungen: keine Arbeit
// UND abbestellt. Der Zeit-Fall trifft gerade Räume, die Arbeiten HABEN —
// die Küche trägt `arbeiten: ['wände streichen']`. `hatKeinerleiArbeit` darf
// hier deshalb keine Bedingung sein. Das ist der ganze Unterschied, und er
// ist inhaltlich, nicht technisch.
//
// ── Was NICHT passiert: die Maße werden nicht verworfen ───────────────────
//
// Diese Datei fasst `extraktion.raeume` nicht an. Sie filtert POSITIONEN am
// Ausgang, so wie `bauteil-ausschluss.ts` (PM-099) es eine Ebene tiefer tut.
// Der ausgenommene Raum behält damit Länge, Breite, Höhe und Arbeiten —
// Voraussetzung für die Tippfläche „Als eigenes Angebot anlegen" (DC-116,
// führt auf den DC-029-Weg „+ Neues Angebot für diese Baustelle").
//
// ── Die teuerste Zeile dieser Datei ist die, die NICHT drinsteht ──────────
//
// „Zweiter Bauabschnitt" allein ist KEIN Auslöser, und das ist gemessen,
// nicht vorsichtshalber. In PM-097 zerlegt `saetzeJeRaum()` den Satz am
// Komma, und der Teilsatz „Zweiter Bauabschnitt Obergeschoss" nennt keinen
// bekannten Raum — er erbt deshalb den zuletzt genannten:
//
//   Wohnzimmer  → ["… Erster Bauabschnitt … Wände und Decke streichen",
//                  "Zweiter Bauabschnitt Obergeschoss"]   ← hier!
//   Schlafzimmer→ ["das kommt später und wird getrennt abgerechnet:
//                  Schlafzimmer 3 mal 4, Wände streichen"]
//
// Ein Auslöser auf „zweiter Bauabschnitt" hätte damit den ERSTEN Abschnitt
// aus dem Angebot geworfen — genau den, der bezahlt werden soll. Der
// Designer nennt in DC-116 die Wendung „im zweiten Bauabschnitt", mit
// Präposition; genau so und nicht breiter steht sie unten. Gegenprobe Nr. 8.

import { saetzeJeRaum, raumDerPosition } from './satz-raum'

/**
 * Die Wendungen, mit denen ein Handwerker einen Teil der Arbeit auf ein
 * anderes Papier schiebt. Alle vier Gruppen stammen aus DC-116; die ersten
 * beiden sind in PM-116 und PM-097 gemessen, die übrigen sind derselbe
 * Gedanke in anderen Worten.
 *
 * ACHTUNG (in diesem Projekt schon zweimal bezahlt, siehe
 * `bauteil-ausschluss.ts`): `\b` wirkt VOR einem Umlaut nicht — ohne u-Flag
 * zählt „ä" nicht als Wortzeichen. Vor „ä/ö/ü" steht hier deshalb nirgends
 * ein `\b`.
 */
const ZEIT_AUSSCHLUSS =
  /kommt\s+sp[äa]ter|kommen\s+sp[äa]ter|sp[äa]ter\s+(?:gemacht|beauftragt|angeboten|abgerechnet|dran)/i

const GETRENNT_ANGEBOTEN =
  /(?:extra|getrennt|separat|gesondert)\s+(?:angeboten|beauftragt|abgerechnet|berechnet)/i

/** „im zweiten Bauabschnitt" — mit Präposition, siehe Kopf der Datei. */
const SPAETERER_ABSCHNITT =
  /\b(?:im|in|f[üu]r\s+den)\s+(?:zweiten|dritten|vierten|n[äa]chsten|sp[äa]teren)\s+(?:bauabschnitt|abschnitt)/i

/** Eigenes Papier, ausdrücklich benannt. */
const EIGENES_ANGEBOT = /\beigene(?:s|n)\s+angebot/i

export function istZeitAusschluss(satz: string): boolean {
  return ZEIT_AUSSCHLUSS.test(satz)
    || GETRENNT_ANGEBOTEN.test(satz)
    || SPAETERER_ABSCHNITT.test(satz)
    || EIGENES_ANGEBOT.test(satz)
}

/**
 * Räume, die im Diktat auf ein späteres, eigenes Angebot geschoben wurden.
 * Ergebnis: Raumname → der Satz, auf den es sich stützt.
 *
 * Der Beleg-Satz ist kein Beiwerk: DC-116 verlangt ihn wörtlich in der
 * Hinweiszeile („Gesagt: …"), damit der Betrieb sieht, WORAUF sich das
 * Weglassen stützt, und es mit einem Tipp umkehren kann.
 *
 * Bewusst OHNE `hatKeinerleiArbeit` — siehe Kopf der Datei.
 */
export function zeitlichAusgenommeneRaeume(
  transkript: string | null | undefined,
  raumNamen: string[],
): Map<string, string> {
  const treffer = new Map<string, string>()
  const namen = raumNamen.map(n => (n ?? '').trim()).filter(n => n.length >= 3)
  if (!transkript || namen.length === 0) return treffer

  const zuordnung = saetzeJeRaum(transkript, namen)
  for (const name of namen) {
    const satz = (zuordnung.get(name) ?? []).find(istZeitAusschluss)
    if (satz) treffer.set(name, satz.trim())
  }
  return treffer
}

/**
 * Die Hinweiszeile. Raumname UND Beleg-Satz, beides verlangt DC-116.
 *
 * Das Warnzeichen am Anfang ist kein Schmuck: Es ist die Kennzeichnung
 * „Hinweis, keine Leistung". `mengen/mehrgewerk.ts` verwandelt sonst jeden
 * `fehlende`-Eintrag in eine 0,00-€-Position, und dieser Satz hat auf dem
 * Kundenpapier nichts verloren.
 */
export function zeitAusschlussHinweis(raum: string, satz: string): string {
  return `⚠ „${raum}" steht nicht in diesem Angebot — gesagt: „${satz}"`
}

export interface PositionMitBeschreibung {
  beschreibung: string
}

/**
 * Nimmt die Positionen der zeitlich ausgenommenen Räume heraus.
 *
 * Die Objekt-Identität bleibt erhalten (reines Filtern, kein Umkopieren) —
 * darauf stützt sich die Kennzeichnung `automatisch_ergaenzt` in
 * `vollstaendigkeit/index.ts`.
 *
 * Positionen OHNE Raum im Titel fallen nur, wenn der Auftrag genau einen
 * Raum hat und der ausgenommen ist. Bei mehreren Räumen wird nichts
 * entfernt, was sich nicht zuordnen lässt — dieselbe Regel wie in
 * `bauteil-ausschluss.ts`: eine Bremse, die rät, ist schlimmer als keine.
 */
export function entferneZeitlichAusgenommene<T extends PositionMitBeschreibung>(
  positionen: T[],
  ausgenommen: Map<string, string>,
  raumNamen: string[],
): T[] {
  if (ausgenommen.size === 0 || positionen.length === 0) return positionen
  const namen = raumNamen.map(n => (n ?? '').trim()).filter(n => n.length >= 3)
  const nurEinRaum = namen.length === 1 ? namen[0] : null

  return positionen.filter(p => {
    const raum = raumDerPosition(p.beschreibung ?? '', namen) ?? nurEinRaum
    return raum === null || !ausgenommen.has(raum)
  })
}
