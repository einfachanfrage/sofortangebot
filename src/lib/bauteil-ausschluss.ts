// ── PM-099 (Prüfmeister, Sandys Live-Lauf 16.09.2026) ─────────────────────
//
// Gesagt: „Die 4 Innentüren mit Zargen abschleifen, grundieren und weiß
// lackieren. **An den Wänden machen wir nichts.**"
// Im Angebot standen trotzdem `Wand streichen 2x` (27,50 m²),
// `Voranstrich / Grundierung` (27,50 m²), `Boden schützen` (6,00 m²) und
// `Sockelleisten abkleben` (11,00 lfdm).
//
// Nachgemessen, nicht vermutet (16.09., über die volle Pipeline): Mit und
// ohne den Ausschlusssatz entsteht Zeichen für Zeichen dieselbe Liste — und
// auch bei „Die Wände bleiben wie sie sind." Der Satz wird an dieser Stelle
// nirgends gelesen.
//
// Der Auslöser sitzt eine Stufe davor: Die KI schreibt `waende_streichen` in
// die Raumdaten, obwohl der Ausschluss danebensteht. Diese Datei repariert
// das nicht — sie ist die **zweite Bremse**, die es bisher nicht gab. Sie
// greift NACH der Mengenberechnung und ist damit unabhängig davon, was in
// `raeume[].arbeiten` steht. Genau das ist der Punkt: Eine Ansage, die einmal
// überhört wird, kam bisher durch nichts mehr heraus.
//
// Verwandt, aber enger: `sockelleisten-ausschluss.ts` (PM-033) kennt genau
// EIN Bauteil, `raum-ausschluss.ts` (PM-034) einen ganzen RAUM. Dazwischen
// fehlte die Ebene „ein Bauteil in einem Raum". Die Satzmechanik ist
// dieselbe und kommt aus `satz-raum.ts`.

import { saetzeMitRaum, teilsaetze, saetze } from './satz-raum'

export type Bauteil = 'wand' | 'decke' | 'boden' | 'tuer' | 'fenster' | 'heizkoerper'

/**
 * Wie der Handwerker das Bauteil nennt.
 *
 * ACHTUNG, in diesem Projekt schon einmal teuer bezahlt (siehe
 * `sockelleisten-ausschluss.ts`): `\b` funktioniert VOR einem Umlaut nicht —
 * ohne u-Flag zählt „ü" nicht als Wortzeichen. Hier steht deshalb nirgends
 * ein `\b` direkt vor einem Umlaut; die Wörter beginnen alle mit einem
 * normalen Buchstaben.
 */
const SATZ_WORT: Array<[Bauteil, RegExp]> = [
  ['wand',        /\bw[äa]nd(?:e|en)?\b/i],
  ['decke',       /\bdecke(?:n)?\b/i],
  ['boden',       /\bb[öo]den\b|\bfu(?:ß|ss)b[öo]den\b/i],
  ['tuer',        /\bt[üu]r(?:e|en)?\b|\bzarge(?:n)?\b/i],
  ['fenster',     /\bfenster\b/i],
  ['heizkoerper', /\bheizk[öo]rper\b/i],
]

/** Wie das Bauteil im Positionstitel steht (Katalogwörter). */
const POSITION_WORT: Record<Bauteil, RegExp> = {
  wand:        /\bw[äa]nd/i,
  decke:       /\bdecke/i,
  boden:       /\bboden|\bfu(?:ß|ss)boden/i,
  tuer:        /\bt[üu]r/i,
  fenster:     /\bfenster/i,
  heizkoerper: /heizk[öo]rper/i,
}

/**
 * Folgepositionen: Schutz, Abkleben, Vorarbeit. Sie tragen keinen eigenen
 * Auftrag — sie entstehen, WEIL eine Fläche gestrichen oder tapeziert wird.
 * Fällt die Fläche weg, fallen sie mit.
 *
 * `grundierung` bewusst als Hauptwort: „Türen grundieren" ist eine eigene
 * Leistung an einem anderen Bauteil und darf hier nicht hineinrutschen.
 */
const FOLGE = /sch[üu]tz|abdeck|abkleb|abdeckfolie|abdeckvlies|voranstrich|grundierung|isoliergrund|vorstreich/i

/** Verneint ausdrücklich. */
const STARKE_NEGATION = /\bkein(?:e|en|er|em)?\b|\bohne\b|\bnicht\b/i
/** Verneint schwächer („machen wir nichts"). */
const SCHWACHE_NEGATION = /\bnichts\b|\bnix\b|unber[üu]hrt|verzicht|\bso lassen\b|\bdran lassen\b|ausgenommen|au(?:ß|ss)en vor/i
/** „bleibt/bleiben so, wie sie sind". */
const BLEIBT = /\bbleib(?:t|en|st)?\s+(?:so|wie|unver|liegen|drin|dran|stehen|h(?:ä|a)ngen)/i
/** Gegenprobe: „bleiben nicht" ist kein Ausschluss, sondern das Gegenteil. */
const BLEIBT_NICHT = /bleib(?:t|en)\s+(?:aber\s+|leider\s+)?nicht|nicht\s+bleib/i
/** Eine Tätigkeit — egal ob beauftragt oder verneint. */
const TAETIGKEIT = /streich|lackier|tapezier|spachtel|schleif|grundier|verputz|verleg|montier|erneuer|tapete|anstrich|beschicht|f[üu]llen|glätten|glaetten/i
/** Ausschluss gilt für den ganzen Auftrag, nicht für einen Raum. */
const UEBERALL = /[üu]berall|generell|insgesamt|nirgend|in allen r[äa]umen|\bwohnung\b/i

/** Für einen Raum (oder global) abbestellte Bauteile. */
export interface BauteilAusschluss {
  /** Bauteile, die im ganzen Auftrag abbestellt sind. */
  global: Set<Bauteil>
  /** Raumname → abbestellte Bauteile in diesem Raum. */
  jeRaum: Map<string, Set<Bauteil>>
  /** Die Sätze, auf die sich das stützt — für sichtbare Hinweise. */
  belege: string[]
}

function bauteileImSatz(satz: string): Bauteil[] {
  return SATZ_WORT.filter(([, r]) => r.test(satz)).map(([b]) => b)
}

/**
 * Erkennt abbestellte Bauteile.
 *
 * Die Gegenprobe, die diese Bremse davon abhält, zu viel wegzunehmen:
 * Ein Bauteil, für das im SELBEN Satz ein Auftrag steht, wird nicht
 * ausgeschlossen. „Die Wände nicht tapezieren, nur streichen." nennt die
 * Wand im ersten Teilsatz, der zweite trägt sie weiter und beauftragt —
 * also kein Ausschluss. „Decke streichen, an den Wänden nichts." beauftragt
 * dagegen ein ANDERES Bauteil; der Wand-Ausschluss bleibt stehen.
 */
export function erkenneBauteilAusschluss(
  text: string,
  raumNamen: string[] = [],
): BauteilAusschluss {
  const global = new Set<Bauteil>()
  const jeRaum = new Map<string, Set<Bauteil>>()
  const belege: string[] = []
  if (!text) return { global, jeRaum, belege }

  // 1. Je Satz sammeln, für welche Bauteile ein AUFTRAG dasteht. Ein
  //    Teilsatz ohne eigenes Bauteil trägt das zuletzt genannte weiter.
  const beauftragt = new Map<number, Set<Bauteil>>()
  saetze(text).forEach((satz, i) => {
    const menge = new Set<Bauteil>()
    let getragen: Bauteil[] = []
    for (const teil of teilsaetze(satz)) {
      const eigene = bauteileImSatz(teil)
      if (eigene.length > 0) getragen = eigene
      const verneint = STARKE_NEGATION.test(teil) || SCHWACHE_NEGATION.test(teil) || BLEIBT.test(teil)
      if (!verneint && TAETIGKEIT.test(teil)) for (const b of getragen) menge.add(b)
    }
    beauftragt.set(i, menge)
  })

  // 2. Ausschlusssätze lesen — mit Raumzuordnung aus `satz-raum.ts`.
  for (const { satz, raum, raumImSatz, satzIndex } of saetzeMitRaum(text, raumNamen)) {
    if (BLEIBT_NICHT.test(satz)) continue
    const verneint = STARKE_NEGATION.test(satz) || SCHWACHE_NEGATION.test(satz) || BLEIBT.test(satz)
    if (!verneint) continue

    const auftraege = beauftragt.get(satzIndex) ?? new Set<Bauteil>()
    const treffer = bauteileImSatz(satz).filter(b => !auftraege.has(b))
    if (treffer.length === 0) continue

    belege.push(satz.trim())
    const istGlobal = UEBERALL.test(satz) || (!raumImSatz && raum === null)
    for (const b of treffer) {
      if (istGlobal) global.add(b)
      else {
        const ziel = raum as string
        if (!jeRaum.has(ziel)) jeRaum.set(ziel, new Set<Bauteil>())
        jeRaum.get(ziel)!.add(b)
      }
    }
  }

  return { global, jeRaum, belege }
}

export interface PositionFuerAusschluss {
  beschreibung: string
}

/**
 * Zu welchem Raum gehört diese Position? Die Titel tragen den Raum als
 * Zusatz („Wand streichen 2x — Flur"). Steht kein Raum drin, ist die
 * Position nicht zuzuordnen — dann entscheidet der Aufrufer.
 */
function raumDerPosition(beschreibung: string, raumNamen: string[]): string | null {
  const lower = beschreibung.toLocaleLowerCase('de-DE')
  let treffer: string | null = null
  for (const n of raumNamen) {
    const name = (n ?? '').trim()
    if (name.length < 3) continue
    if (lower.includes(name.toLocaleLowerCase('de-DE'))) {
      if (treffer === null || name.length > treffer.length) treffer = name
    }
  }
  return treffer
}

/**
 * Nimmt die Positionen heraus, die im Diktat ausdrücklich abbestellt wurden.
 *
 * Zwei Durchgänge, bewusst getrennt:
 *
 *   1. **Direkt** — der Positionstitel nennt das abbestellte Bauteil.
 *   2. **Folge** — Schutz, Abkleben, Vorarbeit. Die fallen NUR, wenn für
 *      denselben Raum danach keine Wand- und keine Deckenleistung mehr
 *      übrig ist. Bleibt die Decke beauftragt („Nur die Decke streichen,
 *      Wände bleiben wie sie sind"), bleibt auch `Boden schützen` stehen —
 *      dort wird ja gestrichen.
 *
 * Die Objekt-Identität bleibt erhalten (reines Filtern, kein Umkopieren) —
 * darauf stützt sich die Kennzeichnung `automatisch_ergaenzt` in
 * `vollstaendigkeit/index.ts`.
 */
export function entferneAusgeschlosseneBauteile<T extends PositionFuerAusschluss>(
  positionen: T[],
  transkript: string,
  raumNamen: string[] = [],
): T[] {
  if (!transkript || positionen.length === 0) return positionen
  const namen = raumNamen.map(n => (n ?? '').trim()).filter(n => n.length >= 3)
  const a = erkenneBauteilAusschluss(transkript, namen)
  if (a.global.size === 0 && a.jeRaum.size === 0) return positionen

  /** Welche Bauteile sind für diese Position abbestellt? */
  const verbotIn = (raum: string | null): Set<Bauteil> => {
    const menge = new Set<Bauteil>(a.global)
    // Ohne Raum im Titel: nur wenn der Auftrag genau EINEN Raum hat, ist die
    // Zuordnung eindeutig. Bei mehreren Räumen wird nichts entfernt — eine
    // Bremse, die rät, ist schlimmer als keine.
    const ziel = raum ?? (namen.length === 1 ? namen[0] : null)
    if (ziel) for (const b of a.jeRaum.get(ziel) ?? []) menge.add(b)
    return menge
  }

  // ── Durchgang 1: direkt benanntes Bauteil ───────────────────────────────
  const nachDirekt = positionen.filter(p => {
    const titel = p.beschreibung ?? ''
    if (FOLGE.test(titel)) return true // erst im zweiten Durchgang
    const verboten = verbotIn(raumDerPosition(titel, namen))
    for (const b of verboten) if (POSITION_WORT[b].test(titel)) return false
    return true
  })

  // ── Durchgang 2: Folgepositionen ────────────────────────────────────────
  /** Räume, in denen nach Durchgang 1 noch eine Wand-/Deckenleistung steht. */
  const traegtNoch = new Set<string>()
  let traegtNochOhneRaum = false
  for (const p of nachDirekt) {
    const titel = p.beschreibung ?? ''
    if (FOLGE.test(titel)) continue
    if (!POSITION_WORT.wand.test(titel) && !POSITION_WORT.decke.test(titel)) continue
    const r = raumDerPosition(titel, namen)
    if (r) traegtNoch.add(r)
    else traegtNochOhneRaum = true
  }

  return nachDirekt.filter(p => {
    const titel = p.beschreibung ?? ''
    if (!FOLGE.test(titel)) return true
    const r = raumDerPosition(titel, namen)
    const ziel = r ?? (namen.length === 1 ? namen[0] : null)
    if (!ziel) return true
    // Nur dort bremsen, wo überhaupt etwas abbestellt wurde.
    const verboten = verbotIn(r)
    if (!verboten.has('wand') && !verboten.has('decke')) return true
    if (traegtNoch.has(ziel) || (r === null && traegtNochOhneRaum)) return true
    return false
  })
}
