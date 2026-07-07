// Normalisiert freie Handwerker-Sprache in feste Arbeits-Kategorien.
//
// Warum: `lower.includes('streich')` übersieht "gestrichen" (Partizip!),
// "gepinselt", "Farbe drauf" … — jede Formulierungsvariante wurde bisher
// einzeln an zig Stellen geflickt. Hier gibt es EINE Stelle, die alle
// Flexionen und Umgangssprache kennt. Regeln fragen Kategorien ab.
//
// Zwei Matcher-Arten:
//  - einfache Stamm-Muster (streichen: das Wortfeld ist eindeutig)
//  - Satz-Ko-Okkurrenz (tapete_entfernen: "Tapete … runter" — Subjekt und
//    Aktion müssen im SELBEN Satz stehen, Reihenfolge egal)

export type ArbeitsKategorie =
  | 'streichen'
  | 'tapete_entfernen'
  | 'tapezieren'        // NEU aufziehen — nicht bloß "Tapete" erwähnt
  | 'spachteln'

const STAMM_MUSTER: Partial<Record<ArbeitsKategorie, RegExp>> = {
  streichen:
    /streich\w*|gestrichen|anstrich|anstreich\w*|\banmal(en|t)\b|angemalt|\bpinsel\w*|gepinselt|weißeln|geweißelt|farbe\s+(drauf|dran|an\s+die|auf\s+die)/i,
  spachteln:
    /spachtel\w*|gespachtelt|verspachtel\w*|glätt(en|et)|geglättet|\bq[234]\b/i,
}

// Subjekt + Aktion müssen im selben Satz vorkommen (Reihenfolge egal)
const SATZ_MUSTER: Partial<Record<ArbeitsKategorie, { subjekt: RegExp; aktion: RegExp }>> = {
  tapete_entfernen: {
    subjekt: /tapete|raufaser/i,
    aktion:
      /runter|herunter|entfern\w*|abnehm\w*|abgenommen|abmach\w*|abgemacht|abreiß\w*|abgerissen|abzieh\w*|abgezogen|ablös\w*|abgelöst|\bweg\b|\bmuss\s+ab\b|\bkommt\s+ab\b/i,
  },
  tapezieren: {
    subjekt: /tapete|raufaser|vlies/i,
    // bewusst KEIN bloßes "neu" — "abnehmen und neu streichen" wäre sonst falsch tapezieren
    aktion:
      /aufzieh\w*|aufgezogen|tapezier\w*|aufbring\w*|aufgebracht|anbring\w*|angebracht|verkleb\w*|\bkleben\b|neue?\s+(tapete|raufaser|vlies)|neu\s+(drauf|dran|machen)/i,
  },
}

/** Zerlegt Text in Sätze (Punkt / ! / ? / Zeilenumbruch / Semikolon). */
function saetze(text: string): string[] {
  return text.split(/[.!?\n;]+/).map(s => s.trim()).filter(Boolean)
}

/** Erkennt alle Arbeits-Kategorien in einem freien Text. */
export function erkenneArbeiten(text: string): Set<ArbeitsKategorie> {
  const ergebnis = new Set<ArbeitsKategorie>()
  if (!text?.trim()) return ergebnis

  for (const [kat, muster] of Object.entries(STAMM_MUSTER)) {
    if (muster.test(text)) ergebnis.add(kat as ArbeitsKategorie)
  }

  const teile = saetze(text)
  for (const [kat, { subjekt, aktion }] of Object.entries(SATZ_MUSTER)) {
    if (teile.some(s => subjekt.test(s) && aktion.test(s))) {
      ergebnis.add(kat as ArbeitsKategorie)
    }
  }

  return ergebnis
}

/** Bequemer Einzel-Check als Drop-in-Ersatz für includes()-Ketten. */
export function hatArbeit(text: string, kategorie: ArbeitsKategorie): boolean {
  return erkenneArbeiten(text).has(kategorie)
}
