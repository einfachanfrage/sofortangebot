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

// ── Scope-Einschränkung: "nur die Wände / nur Decke / nur Boden" ────────────
// Zentral, weil das an ä≠a und Wortstellung immer wieder scheiterte
// ("nur die Wände" ≠ "nur die wand", ≠ "nur wände").

export interface RaumScope {
  nurWaende: boolean
  nurDecke: boolean
  nurBoden: boolean
}

// Einschränkungs-Wörter: nur, bloß, lediglich, ausschließlich, einzig, allein
const NUR = String.raw`(?:nur|blo[sß]{1,2}|lediglich|ausschlie[sß]{1,2}lich|einzig|allein)`
// Flächen (mit Flexionen): Wand/Wände/Wänden, Decke/Decken, Boden/Böden
const FLAECHE = {
  waende: String.raw`(?:wänd\w*|wand)`,
  decke: String.raw`(?:decke\w*)`,
  boden: String.raw`(?:b[oö]den|boden)`,
}
// Optionaler Artikel/Präposition zwischen Einschränkung und Fläche: "die", "an den", …
const LUECKE = String.raw`(?:\s+(?:die|den|der|das|an|am|auf|nur)\b)*\s+`

function nurMuster(flaeche: string): RegExp {
  return new RegExp(`${NUR}${LUECKE}${flaeche}`, 'i')
}
// Negation: nur das eindeutige "ohne Decke" / "keine Decke" (word-order-unabhängig).
// "Decke ... nicht" bewusst NICHT — zu gierig (matcht auch "Decke streichen, Wände nicht").
function ohneMuster(flaeche: string): RegExp {
  return new RegExp(`(?:ohne|keine?)\\s+${flaeche}`, 'i')
}

const NUR_WAENDE = nurMuster(FLAECHE.waende)
const NUR_DECKE = nurMuster(FLAECHE.decke)
const NUR_BODEN = nurMuster(FLAECHE.boden)
const OHNE_DECKE = ohneMuster(FLAECHE.decke)
const OHNE_WAENDE = ohneMuster(FLAECHE.waende)

/**
 * Erkennt, ob nur bestimmte Flächen bearbeitet werden sollen.
 * Deckt "nur die Wände", "bloß Decke", "ohne Decke", "Wände, Decke nicht" ab.
 */
export function erkenneScope(text: string): RaumScope {
  const t = (text ?? '').toLowerCase()
  // Explizites "nur X" hat Vorrang
  let nurWaende = NUR_WAENDE.test(t) && !NUR_DECKE.test(t) && !NUR_BODEN.test(t)
  let nurDecke = NUR_DECKE.test(t) && !NUR_WAENDE.test(t) && !NUR_BODEN.test(t)
  const nurBoden = NUR_BODEN.test(t) && !NUR_WAENDE.test(t) && !NUR_DECKE.test(t)

  // Negation: "Wände streichen, ohne Decke" → nur Wände
  if (!nurWaende && !nurDecke && !nurBoden) {
    if (OHNE_DECKE.test(t) && FLAECHE.waende && new RegExp(FLAECHE.waende, 'i').test(t)) nurWaende = true
    else if (OHNE_WAENDE.test(t) && new RegExp(FLAECHE.decke, 'i').test(t)) nurDecke = true
  }

  return { nurWaende, nurDecke, nurBoden }
}
