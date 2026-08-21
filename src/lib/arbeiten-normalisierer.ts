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
  | 'lackieren'
  | 'schleifen'
  | 'grundieren'

const STAMM_MUSTER: Partial<Record<ArbeitsKategorie, RegExp>> = {
  streichen:
    /streich\w*|gestrichen|anstrich|anstreich\w*|\banmal(en|t)\b|angemalt|pinsel\w*|gepinselt|weißel\w*|geweißelt|farbe\s+(drauf|dran|an\s+die|auf\s+die)/i,
  spachteln:
    /spachtel\w*|gespachtelt|verspachtel\w*|glätt(en|et)|geglättet|glatt\s?(?:gemacht|machen|gezogen|ziehen|geschliffen|schleifen)|\bq[234]\b/i,
  lackieren:
    /lackier\w*|lackiert|lackierung|\black(?:e|en)?\b|lasier\w*|lasur/i,
  schleifen:
    /(?:ab)?schleif\w*|geschliffen|angeschliffen|anschleif\w*/i,
  grundieren:
    /grundier\w*|grundierung|voranstrich|primer/i,
}

// Subjekt + Aktion müssen im selben Satz vorkommen (Reihenfolge egal)
const SATZ_MUSTER: Partial<Record<ArbeitsKategorie, { subjekt: RegExp; aktion: RegExp }>> = {
  tapete_entfernen: {
    subjekt: /tapete|raufaser/i,
    aktion:
      // "\bab\b" fängt das lose Partikel ("die Tapete ab", "erst die Tapete ab") —
      // sicher, weil im selben Satz zwingend "tapete/raufaser" stehen muss.
      // Guard nur gegen "ab 20 km" (Zahl) und das Idiom "ab und zu" —
      // "ab und dann/danach streichen" bleibt gültig.
      /runter|herunter|entfern\w*|abnehm\w*|abgenommen|abmach\w*|abgemacht|abreiß\w*|abgerissen|abzieh\w*|abgezogen|ablös\w*|abgelöst|\bweg\b|\bab\b(?!\s*(?:\d|und\s+zu\b))/i,
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
//
// PM-017: "decke\w*" traf auch mitten in "abdecken"/"Abdeckens" (Boden
// schützen/abdecken) — die Zeichenkette "decke" steckt buchstäblich in
// "ab-DECKE-n". Dadurch wurde z. B. bei "Wände tapezieren... Boden
// abdecken" ein Decken-Scope erkannt, obwohl "Decke" nie gemeint war —
// mit Folgefehlern bis in erkenneScope()/scopeProRaum hinein (ein Raum
// bekam fälschlich "nur Decke" zugewiesen, wodurch die echte Wandposition
// aus dem Ergebnis herausgefiltert wurde). Gleiche Fehlerklasse wie schon
// vorher lokal in maler-basis.ts (istBodenSchutz) und maler.ts
// (hatDeckenSignal) umschifft — hier jetzt an der gemeinsamen Quelle
// behoben, die von beiden mitbenutzt wird.
const FLAECHE = {
  waende: String.raw`(?:wänd\w*|wand)`,
  decke: String.raw`(?:(?<!ab)decke\w*)`,
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

// Ausschluss-Verben: "lassen wir" (X bleibt unangetastet) und "nicht
// mitrechnen/-kalkulieren/berücksichtigen" — im Ausschluss-Kontext eindeutig,
// anders als bloßes "nicht" (siehe Kommentar bei ohneMuster, bewusst NICHT
// erweitert). Bewusst als eigene, ENGE Phrasen-Erkennung: Fläche und Verb
// müssen im selben Satz stehen ([^.!?]), aber die Wortzahl dazwischen darf
// groß sein — echte Sprache schiebt oft einen ganzen Nebensatz dazwischen.
//
// Fund PM-001 (schwerster Fund bisher): "Die Decke lassen wir, ist erst
// letztes Jahr gemacht worden, die bitte NICHT mitrechnen" wurde von KEINEM
// bestehenden Muster erkannt — das Tool hat die Decke danach trotzdem
// stillschweigend wieder eingerechnet. Genau der eine Fehler, den Sandy als
// kritisch markiert hat: ein ausdrücklicher Ausschluss wird überschrieben.
function ausschlussMuster(flaeche: string): RegExp {
  return new RegExp(
    `${flaeche}[^.!?]{0,90}(?:lassen wir\\b|nicht\\s+mit(?:ein)?(?:rechnen|kalkulieren)|nicht\\s+ber[üu]cksichtig\\w*)`,
    'i',
  )
}
const AUSSCHLUSS_DECKE = ausschlussMuster(FLAECHE.decke)
const AUSSCHLUSS_WAENDE = ausschlussMuster(FLAECHE.waende)

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

  // Ausschluss-Phrasen ("lassen wir" / "nicht mitrechnen") — PM-001.
  if (!nurWaende && !nurDecke && !nurBoden) {
    if (AUSSCHLUSS_DECKE.test(t)) nurWaende = true
    else if (AUSSCHLUSS_WAENDE.test(t)) nurDecke = true
  }

  // Eine ausdrücklich benannte Fläche begrenzt den Auftrag ebenfalls. Der Nutzer
  // muss nicht künstlich "nur die Wände" sagen: kommt "Decke" im GANZEN Text
  // kein einziges Mal vor, während "Wand" ausdrücklich fällt, ist das genug.
  //
  // PM-003-Nachtrag: Die alte Version prüfte stattdessen Wortabstand zum
  // Arbeits-Verb ("Wände ... streichen", höchstens 3 Wörter auseinander).
  // Das brach an Kommas ("Wände streichen, Decke auch mit" — das Komma
  // blockierte die Abstandsprüfung) UND an Umlauten (\w kennt kein ä/ö/ü/ß,
  // "Wände" wurde als Lückenfüller-Wort nie vollständig erkannt) — beides hat
  // in PM-003 die Decke aus einem Angebot geworfen, obwohl sie ausdrücklich
  // genannt wurde. Reine Erwähnung statt Wortabstand ist robuster — aber
  // Maßangaben zur Deckenhöhe ("Deckenhöhe 3,20", "Decke ist 3 Meter hoch",
  // "4 Meter hohe Decke") zählen NICHT als Erwähnung, sonst geriete jeder
  // Raum mit Höhenangabe fälschlich auf "nur Decke".
  const tOhneDeckenhoehe = t
    .replace(/deckenh[öo]he\w*/gi, ' ')
    .replace(/decke\w*[^.,;]{0,20}\bhoch\w*/gi, ' ')
    .replace(/\d[^.,;]{0,15}\bhohe?\b[^.,;]{0,10}decke\w*/gi, ' ')
  if (!nurWaende && !nurDecke && !nurBoden) {
    const erwaehntWaende = new RegExp(FLAECHE.waende, 'i').test(t)
    const erwaehntDecke = new RegExp(FLAECHE.decke, 'i').test(tOhneDeckenhoehe)
    if (erwaehntWaende && !erwaehntDecke) nurWaende = true
    else if (erwaehntDecke && !erwaehntWaende) nurDecke = true
  }

  return { nurWaende, nurDecke, nurBoden }
}

// ── Raumkontext: Keller / Garage / Dachschräge / Fassade ────────────────────
// Bestimmt Sonderregeln (Keller: kein Std-Fenster, keine Sockelleisten; …).

export interface Raumkontext {
  istKeller: boolean
  istGarage: boolean
  istDachschraege: boolean
  istFassade: boolean
}

const MUSTER_KELLER = /keller|souterrain|untergeschoss|kellerraum/i
const MUSTER_GARAGE = /garage|carport|tiefgarage/i
const MUSTER_DACHSCHRAEGE = /dachschräg\w*|\bschräge?n?\b|mansard\w*|dachgeschoss|dachboden/i
const MUSTER_FASSADE = /fassade|außenwand|außenwände|außenfassade|hauswand/i

export function erkenneRaumkontext(text: string): Raumkontext {
  const t = text ?? ''
  return {
    istKeller: MUSTER_KELLER.test(t),
    istGarage: MUSTER_GARAGE.test(t),
    istDachschraege: MUSTER_DACHSCHRAEGE.test(t),
    istFassade: MUSTER_FASSADE.test(t),
  }
}

// ── Öffnungs-Negation: "kein Fenster" / "ohne Tür" ──────────────────────────
// Unterdrückt die Standard-Annahme (sonst wird 1 Fenster / 1 Tür unterstellt).

export interface OeffnungsNegation {
  keinFenster: boolean
  keineTuer: boolean
}

// "kein/keine/ohne Fenster", "fensterlos", "0 Fenster"
const KEIN_FENSTER = /(?:kein[e]?|ohne)\s+fenster|fensterlos|\b0\s*fenster|null\s+fenster/i
// "kein/keine/ohne Tür(en)", "kein Eingang", "türlos"
const KEINE_TUER = /(?:kein[e]?|ohne)\s+(?:tür|türe|türen)|kein\s+eingang|türlos|\b0\s*tür|null\s+tür/i

export function erkenneOeffnungen(text: string): OeffnungsNegation {
  const t = text ?? ''
  return {
    keinFenster: KEIN_FENSTER.test(t),
    keineTuer: KEINE_TUER.test(t),
  }
}

// ── "komplett / alles / ganze Wohnung" ──────────────────────────────────────
const MUSTER_KOMPLETT = /\bkomplett\b|\balles\b|\bvollständig\b|ganze[sn]?\s+(?:wohnung|haus|zimmer|raum|räume|fläche)/i

export function istKomplett(text: string): boolean {
  return MUSTER_KOMPLETT.test(text ?? '')
}

// ── "eine Wand" / Akzentwand ────────────────────────────────────────────────
// Eine Wand wird anders behandelt (z.B. Akzentwand tapezieren, Rest streichen).
const MUSTER_AKZENTWAND = /akzentwand|\beine\s+wand\b|\b1\s+wand\b|einzelne\s+wand/i

export function hatAkzentwand(text: string): boolean {
  return MUSTER_AKZENTWAND.test(text ?? '')
}
