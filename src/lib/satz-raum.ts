// Satzweise Raumzuordnung — eine Stelle, nicht drei.
//
// Handwerker diktieren in Sätzen, nicht in Formularen. Der Raum wird einmal
// genannt und gilt dann weiter („Im Wohnzimmer muss nur eine Ecke neu.
// Ungefähr sechs Quadratmeter."), und er springt mitten im Diktat zurück
// („Im Flur muss der alte Belag raus. Im Wohnzimmer nur die Ecke ausbauen.").
// Wer das je Auswertung neu nachbaut, baut es dreimal unterschiedlich falsch —
// deshalb steht es hier einmal und wird von teilflaeche.ts, l-form.ts,
// raum-ausschluss.ts und sockelleisten-ausschluss.ts gemeinsam benutzt.

export interface SatzMitRaum {
  /** Der Teilsatz (siehe `teilsaetze`) — NICHT zwingend ein ganzer Satz. */
  satz: string
  /** Zuletzt genannter Raum — null, solange im Diktat noch keiner gefallen ist. */
  raum: string | null
  /**
   * Wurde der Raum in DIESEM Teilsatz genannt, oder wird er nur weitergetragen?
   * Der Unterschied entscheidet, ob ein Satz wie „in den Zimmern bleiben die
   * alten" wirklich den zuletzt genannten Raum meint — oder etwas anderes.
   */
  raumImSatz: boolean
  /**
   * ALLE in diesem Teilsatz genannten Räume, in Lesereihenfolge.
   * „Sockelleisten in Küche und Esszimmer neu" nennt zwei — die Leistung gilt
   * für beide. `raum` ist davon nur der zuletzt genannte.
   */
  raeumeImSatz: string[]
  /** Nummer des Satzes, aus dem dieser Teilsatz stammt (0-basiert). */
  satzIndex: number
}

// Teuer gelernt (03.09.2026, beim Durchgehen der offenen Testfälle):
// Ein Punkt ZWISCHEN ZIFFERN ist ein Dezimaltrennzeichen, kein Satzende.
// Unsere eigene Zahlen-Vorverarbeitung erzeugt genau das — „vier mal
// dreieinhalb" wird zu „4 mal 3.5", und die Produktionstranskripte enthalten
// es auch direkt („Im Flur daneben 4 mal 1.50 kommt der Boden komplett neu").
// Ein naives split(/[.!?;]/) zerlegt so mitten in der Maßangabe.
//
// 04.09.2026, dieselbe Lehre eine Ebene tiefer: Seit die Teilsätze am KOMMA
// getrennt werden, gilt exakt dasselbe für „4 x 1,50" — im Rohtranskript
// (transkript_original) steht das deutsche Dezimalkomma. Beide Trennzeichen
// werden deshalb gemeinsam geschützt. Die Platzhalter sind Steuerzeichen,
// die in keinem Transkript vorkommen können.
const SCHUTZ_PUNKT = String.fromCharCode(0)
const SCHUTZ_KOMMA = String.fromCharCode(1)
/** Platzhalter für einen bereits erkannten Raumnamen (siehe findeRaeume). */
const SCHUTZ_NAME = String.fromCharCode(2)

function schuetze(text: string): string {
  return text
    .replace(/(\d)\.(\d)/g, `$1${SCHUTZ_PUNKT}$2`)
    .replace(/(\d),(\d)/g, `$1${SCHUTZ_KOMMA}$2`)
}

function entschuetze(teil: string): string {
  return teil.split(SCHUTZ_PUNKT).join('.').split(SCHUTZ_KOMMA).join(',').trim()
}

export function saetze(text: string): string[] {
  return schuetze(text)
    .split(/[.!?;\n]+/)
    .map(entschuetze)
    .filter(Boolean)
}

/**
 * Ein Satz, zerlegt in seine durch Komma getrennten Teilsätze.
 *
 * ── PM-034 / PM-036, Nachtest 04.09.2026 ─────────────────────────────────
 * Beide Rückfälle hatten dieselbe Wurzel: Ein Satz nennt ZWEI Räume, getrennt
 * nur durch ein Komma, und die Zuordnung nahm den zuletzt genannten Raum für
 * den ganzen Satz.
 *
 *   „Sockelleisten im Flur neu, im Wohnzimmer bleiben sie."
 *      → der ganze Satz landete im Wohnzimmer. Dort stand damit
 *        „Sockelleisten … neu" im Raumtext → erfundene Position (PM-036),
 *        und der Ausschluss fiel aus, weil „neu" im selben Satz als
 *        ausdrücklicher Auftrag gilt.
 *
 *   „… im Flur machen wir nichts am Boden, der bleibt wie er ist,
 *     Zockelleisten in Küche und Esszimmer neu, je 1 Tür."
 *      → alles landete im Esszimmer.
 *
 * Der Punkt trennt Gedanken, das Komma trennt im Diktat die Räume. Wer nur am
 * Punkt trennt, liest an der Hälfte der Mehrraum-Ansagen vorbei.
 */
export function teilsaetze(satz: string): string[] {
  return schuetze(satz)
    .split(',')
    .map(entschuetze)
    .filter(Boolean)
}

interface RaumName { original: string; lower: string }

function findeRaeume(teilLower: string, namen: RaumName[]): { name: string; pos: number }[] {
  // Gefundene Namen werden im Suchtext ausgeixt, bevor der nächste (kürzere)
  // Name gesucht wird: Sonst findet „Zimmer" sich selbst mitten in
  // „Wohnzimmer" und eine Aufzählung bekäme einen Raum zu viel.
  let rest = teilLower
  const treffer: { name: string; pos: number }[] = []
  for (const n of namen) {
    let pos = rest.indexOf(n.lower)
    while (pos >= 0) {
      treffer.push({ name: n.original, pos })
      rest = rest.slice(0, pos) + SCHUTZ_NAME.repeat(n.lower.length) + rest.slice(pos + n.lower.length)
      pos = rest.indexOf(n.lower)
    }
  }
  return treffer.sort((a, b) => a.pos - b.pos)
}

/**
 * Ordnet jedem Teilsatz den zuletzt genannten Raum zu. Nennt ein Teilsatz
 * mehrere Räume, gewinnt für `raum` der zuletzt genannte — so, wie man es
 * liest; `raeumeImSatz` führt sie alle.
 */
export function saetzeMitRaum(text: string, raumNamen: string[]): SatzMitRaum[] {
  const namen: RaumName[] = raumNamen
    .map(n => (n ?? '').trim())
    .filter(n => n.length >= 3)
    .map(n => ({ original: n, lower: n.toLocaleLowerCase('de-DE') }))
    // Längere Namen zuerst: „Wohnzimmer" darf nicht von „Zimmer" geschlagen werden.
    .sort((a, b) => b.lower.length - a.lower.length)

  const ergebnis: SatzMitRaum[] = []
  let aktuell: string | null = null
  let satzIndex = 0

  for (const satz of saetze(text)) {
    for (const teil of teilsaetze(satz)) {
      const treffer = findeRaeume(teil.toLocaleLowerCase('de-DE'), namen)
      const raeumeImSatz = [...new Set(treffer.map(t => t.name))]
      if (treffer.length > 0) aktuell = treffer[treffer.length - 1].name
      ergebnis.push({
        satz: teil,
        raum: aktuell,
        raumImSatz: treffer.length > 0,
        raeumeImSatz,
        satzIndex,
      })
    }
    satzIndex += 1
  }

  return ergebnis
}

/**
 * Alle einem Raum zugeordneten Satzstücke — auch nicht zusammenhängende.
 *
 * Teilsätze, die aus DEMSELBEN Satz stammen und demselben Raum gehören,
 * werden wieder mit Komma zusammengesetzt. Das ist kein Schönheitsdienst:
 * Die Teilflächen-Erkennung braucht den Einschränkungs-Marker und die Fläche
 * im selben Stück Text („nur eine Ecke neu, ungefähr 6 Quadratmeter"), und
 * genau die stehen im Diktat regelmäßig links und rechts eines Kommas.
 *
 * Nennt ein Teilsatz mehrere Räume („in Küche und Esszimmer neu"), bekommt
 * ihn JEDER genannte Raum. Sonst fällt eine Leistung, die für zwei Räume in
 * einem Satz gesagt wurde, für den erstgenannten aus — der schwerste Befund
 * aus dem Boden-Batch (PM-034).
 */
export function saetzeJeRaum(text: string, raumNamen: string[]): Map<string, string[]> {
  const zuordnung = new Map<string, string[]>()
  const letzterSatz = new Map<string, number>()

  for (const { satz, raum, raeumeImSatz, satzIndex } of saetzeMitRaum(text, raumNamen)) {
    const ziele = raeumeImSatz.length > 1 ? raeumeImSatz : (raum === null ? [] : [raum])
    for (const ziel of ziele) {
      const bisher = zuordnung.get(ziel)
      if (!bisher) {
        zuordnung.set(ziel, [satz])
      } else if (letzterSatz.get(ziel) === satzIndex) {
        bisher[bisher.length - 1] += `, ${satz}`
      } else {
        bisher.push(satz)
      }
      letzterSatz.set(ziel, satzIndex)
    }
  }

  return zuordnung
}
