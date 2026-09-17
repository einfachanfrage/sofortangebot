// ── PM-061-A / PM-062-A · die Richtung, die bestellt wurde ────────────────
//
// „Im Bad **nur die Wandfliesen** runter." — und im Angebot stehen trotzdem
// `Bodenfliesen verlegen`, `Verfugung Boden` und `Fliesensockel /
// Abschlussleiste`. Bis CoS-E-078 trugen diese drei Zeilen 0,00 € und fielen
// niemandem auf; seit die Preise sitzen, sind es **324,50 € auf einer Arbeit,
// die der Kunde ausdrücklich ausgenommen hat** (PM-061-A).
//
// `fliesenEngine` schreibt die Bodenzeilen, sobald Länge und Breite dastehen —
// sie liest das Diktat nicht. `erkenneFliesenBereich()` kannte `nurWand`
// bisher nur als `lower.includes('nur wand')` und hat den gemessenen Satz
// deshalb gar nicht erkannt („nur **die** Wandfliesen"), und selbst wenn:
// gelesen wurde das Feld erst NACH der Engine und hat nur noch entschieden,
// was zusätzlich fehlt — weggeräumt hat es nichts.
//
// Diese Datei ist deshalb die **vierte Bremse** am Ausgang, neben
// `erschwernis.ts`, `bauteil-ausschluss.ts` und `zeit-ausschluss.ts`, und aus
// demselben Grund dort: Bodenzeilen entstehen in der Engine UND in den
// Vollständigkeitsregeln. Eine Abfrage an jeder Entstehungsstelle vergisst
// man; eine Filterung am Ausgang nicht.
//
// ── Die Auflage des Prüfmeisters (PM-123), vier Punkte ────────────────────
//
//  1. **Alle DREI Bodenzeilen fallen**, der Fliesensockel auch. Er rechnet in
//     lfdm und hängt am Umfang, nicht an der Bodenfläche — er ist die Zeile,
//     die beim Aufräumen übersehen wird. Deshalb steht er hier ausdrücklich
//     im Muster und nicht nur `/boden/`.
//  2. **Die Wandzeilen bleiben unberührt.** Sie stehen auf denselben
//     Raummaßen. Hier fällt deshalb die BODENARBEIT weg, nicht das Maß —
//     die Lehre aus PM-105.
//  3. **Kein stiller Rückbau.** Es wird nur weggeräumt, wo die Einschränkung
//     WIRKLICH im Satz steht; steht sie nicht da, bleibt jede Zeile stehen.
//  4. **Die Gegenprobe im selben Zug:** das Bad ohne „nur" behält alle
//     Bodenzeilen. Ein Auslöser, der auf das Wort „nur" allein zielt, bricht
//     sie — deshalb muss das Bauteil dicht hinter dem Wort stehen (siehe
//     `FENSTER_WOERTER`) und darf die Gegenrichtung im selben Satz nicht
//     vorkommen.
//
// ── PM-062-B · und der Titel sagt danach, WAS abgestemmt wurde ────────────
//
// Steht die Richtung fest, steht sie auch auf dem Kundenpapier: Der Katalog
// trennt `Altfliesen Boden abstemmen (einlagig)` (18,00 €/m²) von
// `Altfliesen Wand abstemmen` (22,00 €/m²), die Engine schreibt einen Titel
// für beides — und er trifft immer den Boden. Auf 18 m² Wandabbruch sind das
// **72,00 € zu wenig** und eine Arbeit auf dem Papier, die nicht die
// ausgeführte ist (PM-062-A).
//
// **Umbenannt wird nur, wo die Richtung aus dem Diktat feststeht.** Fallen
// BEIDE Richtungen (das gewöhnliche Bad), bleibt die Zeile, wie sie ist: die
// eine Menge ist dann die Summe aus beidem, und es gibt keinen Preis, der
// für sie richtig wäre. Diese Aufteilung ist PM-124 und ausdrücklich NICHT
// Gegenstand dieser Datei — eine geratene Quote wäre schlimmer als die
// heutige Zeile.
import type { BerechnetePosition } from './mengen/types'
import { saetze, saetzeMitRaum, raumDerPosition } from './satz-raum'

export type Fliesenrichtung = 'wand' | 'boden'

/** Das Bauteil im Diktat. Kein `\b` vor einem Umlaut (siehe `sockelleisten-ausschluss.ts`). */
const SATZ_WAND = /\bw[äa]nd/i
const SATZ_BODEN = /\bb[öo]den|\bfu(?:ß|ss)b[öo]den/i

/**
 * Das Wort, das einschränkt. „nicht nur" ist das Gegenteil und wird unten
 * ausgenommen.
 */
const EINSCHRAENKUNG = /\b(?:nur|ausschlie(?:ß|ss)lich|lediglich|blo(?:ß|ss))\b/gi
const NICHT_NUR = /\b(?:nicht|nichts)\s+(?:nur|ausschlie(?:ß|ss)lich|lediglich)\b/i

/**
 * Wie viele Wörter hinter dem Einschränkungswort das Bauteil stehen darf.
 *
 * Das ist die Zeile, die diese Bremse davon abhält, eine HÖHENangabe für eine
 * Bauteilansage zu halten: „nur bis zwei Meter zehn an der Wand" nennt die
 * Wand erst an siebter Stelle — dort schränkt „nur" die Höhe ein, nicht das
 * Gewerk. „nur die Wandfliesen" und „nur noch die Wände" nennen es an zweiter
 * und dritter. Drei Wörter lassen Artikel und ein Adjektiv zu und nicht mehr.
 */
const FENSTER_WOERTER = 3

export interface FliesenEinschraenkung {
  /** Für den ganzen Auftrag: welche Richtung allein bestellt ist. */
  global: Fliesenrichtung | null
  /** Raumname → allein bestellte Richtung. */
  jeRaum: Map<string, Fliesenrichtung>
  /** Die Sätze, auf die sich das stützt. */
  belege: string[]
}

/** Die Richtung, die im Teilsatz dicht hinter dem Einschränkungswort steht. */
function richtungImTeilsatz(teil: string): Fliesenrichtung | null {
  if (NICHT_NUR.test(teil)) return null
  let gefunden: Fliesenrichtung | null = null
  EINSCHRAENKUNG.lastIndex = 0
  for (let t = EINSCHRAENKUNG.exec(teil); t !== null; t = EINSCHRAENKUNG.exec(teil)) {
    const fenster = teil
      .slice(t.index + t[0].length)
      .split(/\s+/)
      .filter(w => w.length > 0)
      .slice(0, FENSTER_WOERTER)
      .join(' ')
    const wand = SATZ_WAND.test(fenster)
    const boden = SATZ_BODEN.test(fenster)
    // Beide im selben Fenster („nur Wand und Boden") schränken nichts ein.
    if (wand === boden) continue
    const richtung: Fliesenrichtung = wand ? 'wand' : 'boden'
    if (gefunden !== null && gefunden !== richtung) return null
    gefunden = richtung
  }
  return gefunden
}

/**
 * Liest aus dem Diktat, wo nur EINE Richtung bestellt ist.
 *
 * Ohne `raumNamen` (so ruft `erkenneFliesenBereich()` auf) entsteht nur die
 * globale Aussage — dieselbe Erkennung, eine Stelle.
 */
export function erkenneFliesenEinschraenkung(
  text: string,
  raumNamen: string[] = [],
): FliesenEinschraenkung {
  const jeRaum = new Map<string, Fliesenrichtung>()
  const belege: string[] = []
  let global: Fliesenrichtung | null = null
  if (!text) return { global, jeRaum, belege }

  const namen = raumNamen.map(n => (n ?? '').trim()).filter(n => n.length >= 3)
  const volleSaetze = saetze(text)

  for (const { satz, raum, raumImSatz, satzIndex } of saetzeMitRaum(text, namen)) {
    const richtung = richtungImTeilsatz(satz)
    if (richtung === null) continue

    // Die Gegenprobe am GANZEN Satz, nicht nur am Teilsatz: Wird die andere
    // Richtung irgendwo im selben Satz genannt („nur die Wandfliesen, den
    // Boden machen wir auch"), ist die Ansage nicht eindeutig. Dann wird
    // nichts weggeräumt — eine Bremse, die rät, ist schlimmer als keine.
    const ganz = volleSaetze[satzIndex] ?? satz
    const gegen = richtung === 'wand' ? SATZ_BODEN : SATZ_WAND
    if (gegen.test(ganz)) continue

    belege.push(satz.trim())
    if (!raumImSatz && raum === null) {
      if (global !== null && global !== richtung) return { global: null, jeRaum: new Map(), belege }
      global = richtung
    } else {
      jeRaum.set(raum as string, richtung)
    }
  }

  return { global, jeRaum, belege }
}

/** Die Zeilen der jeweiligen Richtung, so wie sie im Angebot stehen. */
const POSITION_WAND = /\bw[äa]nd/i
// Der Fliesensockel trägt das Wort „Boden" nicht und ist trotzdem Bodenarbeit
// — Auflage Punkt 1. `Sockelleisten abkleben` (Maler) kommt in diesem Gewerk
// nicht vor; die Bremse läuft ohnehin nur für `fliesen`.
const POSITION_BODEN = /\bb[öo]den|\bfu(?:ß|ss)b[öo]den|sockelleiste|fliesensockel|abschlussleiste/i

/** Die Abbruchzeile, deren Titel offenlässt, WAS abgestemmt wurde (PM-062-B). */
const ABBRUCH_OHNE_BAUTEIL = /^\s*Altfliesen abstemmen\b/i

export interface RichtungsErgebnis {
  positionen: BerechnetePosition[]
  /** Die Sätze, auf die sich das Weglassen stützt — für sichtbare Hinweise. */
  belege: string[]
}

/**
 * Nimmt die Zeilen der NICHT bestellten Richtung heraus und schärft den Titel
 * der Abbruchzeile, wo die Richtung feststeht.
 *
 * Läuft am Ausgang der Vollständigkeitsprüfung, nur für das Gewerk `fliesen`.
 */
export function wendeFliesenrichtungAn(
  positionen: BerechnetePosition[],
  transkript: string,
  raumNamen: string[] = [],
): RichtungsErgebnis {
  if (!transkript || positionen.length === 0) return { positionen, belege: [] }
  const namen = raumNamen.map(n => (n ?? '').trim()).filter(n => n.length >= 3)
  const e = erkenneFliesenEinschraenkung(transkript, namen)
  if (e.global === null && e.jeRaum.size === 0) return { positionen, belege: [] }

  const richtungFuer = (titel: string): Fliesenrichtung | null => {
    const raum = raumDerPosition(titel, namen)
    // Ohne Raum im Titel ist die Zuordnung nur bei genau EINEM Raum eindeutig.
    const ziel = raum ?? (namen.length === 1 ? namen[0] : null)
    return (ziel !== null ? e.jeRaum.get(ziel) ?? null : null) ?? e.global
  }

  const gefiltert: BerechnetePosition[] = []
  for (const p of positionen) {
    const titel = p.beschreibung ?? ''
    const richtung = richtungFuer(titel)
    if (richtung === null) { gefiltert.push(p); continue }

    const weg = richtung === 'wand' ? POSITION_BODEN : POSITION_WAND
    const bleibt = richtung === 'wand' ? POSITION_WAND : POSITION_BODEN
    // Nennt eine Zeile BEIDE Bauteile, bleibt sie stehen — sie gehört nicht
    // eindeutig der abbestellten Richtung.
    if (weg.test(titel) && !bleibt.test(titel)) continue

    if (ABBRUCH_OHNE_BAUTEIL.test(titel)) {
      const bauteil = richtung === 'wand' ? 'Wand' : 'Boden'
      gefiltert.push({
        ...p,
        // Das Bauteil wird ANGEHÄNGT, nicht in den Titel hineingeschoben.
        // Gemessen, bevor es so gebaut wurde: `Altfliesen Wand abstemmen`
        // (die Katalogschreibweise) findet dieselben 22,00 €/m² — aber der
        // Wortlaut `Altfliesen abstemmen` steht darin nicht mehr zusammen,
        // und jede Zusicherung des Prüfmeisters, die die Zeile über
        // `/altfliesen abstemmen/i` sucht, findet sie danach nicht mehr.
        // Eine Zeile, die niemand mehr wiederfindet, ist kein besserer
        // Titel. `Wandfliesen abstemmen` scheidet zusätzlich am Preis aus:
        // die Normalisierung macht daraus `flaechefliesen` (die Regel
        // `wande? → flaeche` greift mitten im Wort) — kein Treffer, 0,00 €.
        beschreibung: titel.replace(/^(\s*Altfliesen abstemmen)/i, `$1, ${bauteil}`),
        annahmen: [...(p.annahmen ?? []), `Nur ${bauteil}fliesen abgestemmt — ${bauteil}preis angesetzt`],
      })
      continue
    }
    gefiltert.push(p)
  }

  return { positionen: gefiltert, belege: e.belege }
}
