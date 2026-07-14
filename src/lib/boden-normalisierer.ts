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
// 2) eindeutiges Entfernen-Verb (inkl. aller Partizipien) irgendwo im Text
const ENTFERNEN_STARK = /entfern\w*|raus(?:reiß\w*|gerissen|geriss\w*)|\braus\b|herausgerissen|abreiß\w*|abgerissen|abbrech\w*|abgebrochen|abnehm\w*|abgenommen|demontier\w*|demontage|stripper/i
// 3) schwaches "weg" nur zusammen mit einem Belag-Nomen im selben Satz
const BELAG_NOMEN_SATZ = /teppich\w*|belag|boden|parkett|laminat\w*|dielen|vinyl|linoleum|pvc/i

/** Erkennt alle flexions-anfälligen Boden-Arbeiten in freiem Text. */
export function erkenneBodenArbeiten(text: string): Set<BodenArbeit> {
  const ergebnis = new Set<BodenArbeit>()
  if (!text?.trim()) return ergebnis

  const wegMitBelag = saetze(text).some(s => /\bweg\b/i.test(s) && BELAG_NOMEN_SATZ.test(s))
  if (ALTBELAG_NOMEN.test(text) || ENTFERNEN_STARK.test(text) || wegMitBelag) {
    ergebnis.add('altbelag_entfernen')
  }
  return ergebnis
}

/** Bequemer Einzel-Check als Drop-in-Ersatz für includes()-Ketten. */
export function hatBodenArbeit(text: string, kategorie: BodenArbeit): boolean {
  return erkenneBodenArbeiten(text).has(kategorie)
}
