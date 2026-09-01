// Normalisiert freie Handwerker-Sprache fürs Bodenleger-Gewerk.
//
// Warum eigener Normalisierer: Boden hat ein anderes Wortfeld als Maler
// (Beläge, Altbelag-Demontage). Belag-Erkennung lag bisher dreifach vor
// (Engine, boden-basis, boden-sonder); "abgerissen"/"abgebrochen" (Partizip)
// wurde von den alten includes()-Ketten übersehen. Hier: EINE getestete Stelle.
//
// Schleifen/Grundieren teilen sich das Wortfeld mit Maler → dort per
// hatArbeit() aus arbeiten-normalisierer (kein Doppel-Pflegepunkt).

export type BelagTyp = 'parkett' | 'laminat' | 'vinyl' | 'kork' | 'linoleum' | 'teppich' | null

// Reihenfolge = Priorität: spezifischere/eindeutige Beläge zuerst
export function erkenneBelag(text: string): BelagTyp {
  const t = (text ?? '').toLowerCase()
  if (/parkett|dielen?|massivholz|fertigparkett|eichenparkett/.test(t)) return 'parkett'
  if (/laminat/.test(t)) return 'laminat'
  if (/v[ie]nyl|designboden|\blvt\b|klick/.test(t)) return 'vinyl'
  if (/kork/.test(t)) return 'kork'
  if (/linoleum/.test(t)) return 'linoleum'
  if (/teppich|teppichboden|nadelvlies/.test(t)) return 'teppich'
  return null
}

const BELAG_BEZEICHNUNG: Record<NonNullable<BelagTyp>, string> = {
  parkett: 'Parkett',
  laminat: 'Laminat',
  vinyl: 'Vinyl / Designboden',
  kork: 'Kork',
  linoleum: 'Linoleum',
  teppich: 'Teppich',
}

export function belagBezeichnung(belag: BelagTyp): string {
  return belag ? (BELAG_BEZEICHNUNG[belag] ?? 'Bodenbelag') : 'Bodenbelag'
}

/** Spezifischeren Belagnamen aus freiem Text ableiten (Klick-Vinyl, Eichenparkett …). */
export function erkenneBelagName(text: string, belag: BelagTyp): string {
  const t = (text ?? '').toLowerCase()
  if (belag === 'vinyl') {
    if (/klick-?vinyl/.test(t) || (/klick/.test(t) && /vinyl/.test(t))) return 'Klick-Vinyl'
    if (/designboden/.test(t)) return 'Designboden'
    if (/vinyl/.test(t)) return 'Vinyl-Boden'
  }
  if (belag === 'teppich') {
    if (/nadelvlies/.test(t)) return 'Nadelvlies-Teppichboden'
    return 'Teppichboden'
  }
  if (belag === 'parkett') {
    if (/fertigparkett/.test(t)) return 'Fertigparkett'
    if (/eichenparkett|eichen/.test(t)) return 'Eichenparkett'
  }
  return belagBezeichnung(belag)
}

// ── Boden-Arbeiten mit Flexions-/Partizip-Gefahr ────────────────────────────

export type BodenArbeit = 'altbelag_entfernen'

/** Zerlegt Text in Sätze (Punkt / ! / ? / Zeilenumbruch / Semikolon). */
function saetze(text: string): string[] {
  return text.split(/[.!?\n;]+/).map(s => s.trim()).filter(Boolean)
}

// Altbelag-Demontage. Anders als bei Tapete überspannt die Referenz hier oft
// mehrere Sätze ("Alter Teppichboden … 18 m². Mit dem Stripper rausreißen.").
// Darum: OR-Semantik wie bisher, aber mit VOLLSTÄNDIGER Partizip-Abdeckung.
//
// 1) expliziter Altbelag-Nomen  ("alter Boden", "Altbelag", "uralter …")
const ALTBELAG_NOMEN = /altbelag|alt(?:e|er|en)\s+(?:boden|belag|teppich\w*|parkett|laminat\w*|dielen|vinyl|linoleum|pvc)|uralt\w*/i
// 2) eindeutige Entfernen-Wörter (inkl. aller Partizipien) — gelten textweit,
// auch über Satzgrenzen hinweg ("Alter Teppichboden … 18 m². Mit dem
// Stripper rausreißen.") — weil diese Wörter kaum für irgendwas anderes als
// eine Boden-Demontage stehen.
const ENTFERNEN_EINDEUTIG = /entfern\w*|raus(?:reiß\w*|gerissen|geriss\w*)|herausgerissen|abreiß\w*|abgerissen|abbrech\w*|abgebrochen|abnehm\w*|abgenommen|demontier\w*|demontage|stripper/i
// 3) das bloße "weg" oder "raus" sind zu generisch — die können sich auf
// ALLES beziehen (PM-010: "Die alten Sockelleisten kommen raus" hat mit dem
// alten, textweiten Check fälschlich einen kompletten Bodenaustausch
// ausgelöst). Zählen deshalb nur zusammen mit einem Belag-Nomen im SELBEN SATZ.
const SCHWACHES_ENTFERNEN = /\bweg\b|\braus\b/i
const BELAG_NOMEN_SATZ = /teppich\w*|belag|boden|parkett|laminat\w*|dielen|vinyl|linoleum|pvc/i

// PM-020 (2026-08-21): ALTBELAG_NOMEN allein erkennt nur die ERWÄHNUNG eines
// alten Belags ("die alten Dielen …"), nicht ob er auch WEG soll — Live-Fund
// "die alten Dielen bleiben einfach drunter liegen, die kommen nicht raus"
// hat ALTBELAG_NOMEN ("alten Dielen") UND SCHWACHES_ENTFERNEN ("raus" im
// selben Satz wie "Dielen"/"Teppichboden") ausgelöst, obwohl der Satz
// explizit das Gegenteil sagt. Dieser Regex-Fallback lief zudem komplett
// unabhängig vom KI-Signal `raum.altbelag_entfernen` — in auftrags-
// verstaendnis.ts wird `signale.altbelagEntfernen` nur EINSEITIG auf true
// verodert, nie zurück auf false korrigiert (siehe Kommentar dort), GPT hatte
// hier aber schon korrekt false erkannt. Deckt außerdem die schon vorher
// beobachteten Ausschluss-Formulierungen ab ("X lassen wir", "ohne X",
// "keine X", "bleibt wie er ist").
const ALTBELAG_VERNEINT =
  /bleib\w*[^.!?\n;]{0,40}(?:liegen|drunter|drin|wie\s+(?:er|es|sie)\s+(?:ist|sind))|komm\w*\s+nicht\s+raus|nicht\s+raus\w*|(?:kein[e]?|ohne)\s+(?:altbelag|entfernung)|lassen\s+(?:wir|ihn|sie|es)[^.!?\n;]{0,20}(?:liegen|drunter|drin)/i

/** Erkennt alle flexions-anfälligen Boden-Arbeiten in freiem Text. */
export function erkenneBodenArbeiten(text: string): Set<BodenArbeit> {
  const ergebnis = new Set<BodenArbeit>()
  if (!text?.trim()) return ergebnis

  const saetzeListe = saetze(text)
  const altbelagNomenOhneVerneinung = saetzeListe.some(s => ALTBELAG_NOMEN.test(s) && !ALTBELAG_VERNEINT.test(s))
  const schwachMitBelag = saetzeListe.some(s => SCHWACHES_ENTFERNEN.test(s) && BELAG_NOMEN_SATZ.test(s) && !ALTBELAG_VERNEINT.test(s))
  if (altbelagNomenOhneVerneinung || ENTFERNEN_EINDEUTIG.test(text) || schwachMitBelag) {
    ergebnis.add('altbelag_entfernen')
  }
  return ergebnis
}

/** Bequemer Einzel-Check als Drop-in-Ersatz für includes()-Ketten. */
export function hatBodenArbeit(text: string, kategorie: BodenArbeit): boolean {
  return erkenneBodenArbeiten(text).has(kategorie)
}

/**
 * Verschnittsatz bei GERADER Verlegung — eine Quelle für Engine und
 * Vollständigkeitsprüfung.
 *
 * Vorher stand die Regel zweimal im Code und die beiden waren auseinander-
 * gelaufen: die Engine rechnete 5 %, die Vollständigkeitsprüfung 10 % — je
 * nachdem, welcher Weg eine Position erzeugte, kam eine andere Menge heraus.
 *
 * Sandys Entscheidung (2026-08-30, PM-027): Parkett bekommt bei gerader
 * Verlegung ebenfalls 5 %. Vorher stand hier 0 %, weil Parkett in der alten
 * Konvention nicht als Plattenware galt — das entsprach nicht der Praxis.
 * Muster-/Winkelverlegung (diagonal, Fischgrät) hat weiterhin ihren eigenen,
 * höheren Satz beim Aufrufer (15 %).
 *
 * Kork und Teppich stehen bewusst weiterhin auf 0 % — dazu gibt es keine
 * Entscheidung; wer sie ändert, sollte sie mit Sandy klären, nicht raten.
 */
export function standardVerschnitt(belag: BelagTyp | string | undefined): number {
  if (!belag) return 0.05
  const b = String(belag).toLocaleLowerCase('de-DE')
  if (/laminat|vinyl|linoleum|parkett|diele/.test(b)) return 0.05
  return 0
}

/** Muster-/Winkelverlegung braucht mehr Zuschnitt als gerade Verlegung. */
export const MUSTER_VERLEGUNG = /diagonal|fischgr(?:ä|ae|a)t|schr(?:ä|ae|a)g\s*verlegt|45\s*grad|45°/i

/**
 * Verschnittsatz inklusive Verlegeart — die Form, die BEIDE Wege benutzen
 * sollten. Ohne sie rechnete die Vollständigkeitsprüfung bei einer diagonalen
 * Verlegung mit dem Satz für gerade Verlegung, während die Engine 15 % nahm
 * (aufgefallen 2026-08-30 beim Angleich der Verschnitt-Regeln).
 */
export function verschnittFuerVerlegung(belag: BelagTyp | string | undefined, text: string): number {
  return MUSTER_VERLEGUNG.test(text ?? '') ? 0.15 : standardVerschnitt(belag)
}
