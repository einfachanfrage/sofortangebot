// ── PM-033, Befund 2 (Prüfmeister, 02.09.2026) ────────────────────────────
//
// Gesagt: „Sockelleisten bleiben überall, wie sie sind."
// Im Angebot stand: „Sockelleisten montieren, 22 lfdm, 121,00 €".
//
// Die 22,00 lfdm sind kein Umfang. Am Code nachgerechnet: der
// Vollständigkeits-Fallback in `boden-vorarbeiten.ts` schätzt bei fehlender
// Meterangabe einen quadratischen Raum — 4 × √31,05 m² = 22,29 → 22. Die
// 31,05 m² sind die Wohnzimmer-Verlegefläche INKLUSIVE 15 % Fischgrät-
// Verschnitt. Es ist also der Umfang eines gedachten Quadrats über einer
// Fläche, die es so gar nicht gibt. (Die Vermutung des Prüfmeisters,
// 2 × (6 + 5) aus zwei Räumen, war naheliegend, trifft es aber nicht.)
//
// Der eigentliche Fehler liegt eine Stufe davor: Der Auslöser des Fallbacks
// war `lower.includes('sockelleist')` — das Wort kommt im Satz vor, also
// wurde eine Position erzeugt. Dass der Satz sie ausdrücklich ABBESTELLT,
// hat niemand gelesen. Die bisherige Ausschluss-Prüfung kannte genau drei
// Formulierungen („ohne sockelleisten", „keine sockelleisten", „nur boden
// ohne") — die normale Sprechweise „die bleiben, wie sie sind" war nicht
// dabei.
//
// Diese Datei liest den Ausschluss so, wie er gesprochen wird — satzweise,
// mit Raumbezug, und mit dem Fall „Sockelleisten im Flur neu. Im Wohnzimmer
// bleiben sie." (Rückbezug per „sie" auf den Satz davor).

import { saetzeMitRaum } from './satz-raum'

// ── PM-034, Nachtest 04.09.2026: Whisper schreibt „Zockelleisten" ─────────
//
// Im Produktionsdiktat vom 05.09. steht wörtlich „Zockelleisten in Küche und
// Esszimmer neu" — mit Z. Whisper verhört den stimmhaften Anlaut regelmäßig.
// Jede Prüfung, die auf der exakten Schreibweise „sockelleist" stand, lief
// damit still vorbei: Die Mengen-Engine verlangt vor der Position ein
// Textsignal, fand keines, und die komplette Leistung fiel aus — 28,20 lfdm
// bzw. 155,10 € in einem 1.084-€-Angebot.
//
// Deshalb EIN toleranter Ausdruck für das Wort, exportiert und überall
// benutzt, statt drei Stellen mit drei Schreibweisen. Aufgenommen werden nur
// Varianten, die es wirklich gibt: der Z-Hörfehler, die getrennte Schreibung
// und die gängigen Synonyme aus dem Handwerk.
export const SOCKEL_WORT = /[sz]ockel[\s-]?leist|fu(?:ß|ss)[\s-]?leist|scheuerleist|bodenleist/i

const SOCKEL = /[sz]ockel[\s-]?leist|fu(?:ß|ss)[\s-]?leist|scheuerleist|bodenleist|sockel\b/i
/** „sie"/„die" als Rückbezug auf die Sockelleisten im Satz davor. */
const RUECKBEZUG = /\b(?:sie|die)\b/i
const BLEIBT = /\bbleib(?:t|en|st)?\b/i
/**
 * Was nach dem Rückbezugs-Pronomen noch stehen darf. Alles andere ist ein
 * eigenes Hauptwort — und dann handelt der Teilsatz nicht von den
 * Sockelleisten, sondern von diesem Ding.
 */
const NACHLAUF_FREI = /\b(?:sie|die)\b(?:\s+(?:alten?|alte|so|erstmal|dran|drin|liegen|h(?:ä|a)ngen|stehen|wie\s+sie\s+sind?))*\s*$/i
/** Verneint ausdrücklich — schlägt auch einen Auftrag im selben Satz. */
const STARKE_NEGATION = /\bkein(?:e|en|er|em)?\b|\bohne\b|\bnicht\b/i
/** Verneint schwächer („machen wir nichts") — reicht allein, hebt aber
 *  einen ausdrücklichen Auftrag im selben Satz nicht auf. */
const SCHWACHE_NEGATION = /\bnichts\b|unber[üu]hrt|verzicht|\bso lassen\b|\bdran lassen\b/i
/** Gegenprobe: „bleiben nicht" ist kein Ausschluss, sondern das Gegenteil. */
const BLEIBT_NICHT = /bleib(?:t|en)\s+(?:aber\s+|leider\s+)?nicht|nicht\s+bleib/i
/** Ein ausdrücklicher Auftrag im selben Satz schlägt jeden Ausschluss. */
const AUFTRAG = /\bneu\b|montier|erneuer|anbring|setzen wir|kommen?\s+(?:neue|dran|rein)|liefern/i
// ACHTUNG, teuer gelernt: `\b` funktioniert vor „ü" NICHT — in JavaScript
// zählt der Umlaut ohne u-Flag nicht als Wortzeichen, `\büberall\b` trifft
// deshalb nie. Genau daran ist die erste Fassung dieses Fixes still
// vorbeigelaufen (Ausschluss wurde als raumbezogen statt global gelesen).
const UEBERALL = /[üu]berall|generell|insgesamt|komplett|in allen r[äa]umen|nirgend/i

export interface SockelleistenAusschluss {
  /** Für den ganzen Auftrag abbestellt. */
  global: boolean
  /** Raumnamen (Original-Schreibweise), für die es abbestellt wurde. */
  raeume: Set<string>
  /** Die Sätze, auf die sich das stützt — für sichtbare Hinweise. */
  belege: string[]
}

/**
 * Andere Gewerke-Gegenstände. Nur für den Rückbezugs-Zweig: „Sockelleisten im
 * Flur neu. Die Türen werden nicht gestrichen." darf NICHT als Sockelleisten-
 * Ausschluss durchgehen, nur weil „die" und „nicht" im Satz stehen.
 */
const ANDERER_GEGENSTAND = /t[üu]r|fenster|boden|wand|w[äa]nde|decke|belag|parkett|laminat|v[ie]nyl|teppich|fliese|d[äa]mmung|schiene|estrich|heizk[öo]rper|treppe/i

function istAusschlussSatz(satz: string, sockelSchonGenannt: boolean): boolean {
  const nenntSockel = SOCKEL.test(satz)
  if (!nenntSockel) {
    // Rückbezug per „sie"/„die" auf eine frühere Sockelleisten-Ansage
    // („Sockelleisten im Flur neu. … Im Wohnzimmer bleiben sie."). Bewusst
    // streng, weil ein loses „sie" sonst alles Mögliche einfängt: nur mit
    // „bleiben", nur wenn kein anderer Gegenstand im Satz steht, und nur in
    // einem kurzen Satz — ein langer Satz handelt von etwas anderem.
    // 04.09.2026: Seit die Zuordnung am Komma trennt (satz-raum.ts), sind die
    // Stücke kürzer — „im Wohnzimmer bleiben sie" ist jetzt ein eigenes Stück
    // statt Teil eines langen Satzes. Das ist der Grund, warum dieser Zweig
    // überhaupt greift, macht ihn aber auch großzügiger. Gegengewicht:
    // Nach dem Pronomen darf nichts mehr stehen außer einem kurzen, bekannten
    // Nachlauf. „im Wohnzimmer bleiben sie" ✓, „in den Zimmern bleiben die
    // alten" ✓ — „im Wohnzimmer bleiben die Möbel stehen" ✗.
    const kurz = satz.trim().split(/\s+/).length <= 8
    const rueckbezug = sockelSchonGenannt && kurz && RUECKBEZUG.test(satz)
      && NACHLAUF_FREI.test(satz)
      && BLEIBT.test(satz) && !ANDERER_GEGENSTAND.test(satz)
    if (!rueckbezug) return false
    return !BLEIBT_NICHT.test(satz)
  }
  if (BLEIBT_NICHT.test(satz)) return false
  const starkVerneint = STARKE_NEGATION.test(satz)
  const verneintOderBleibt = starkVerneint || SCHWACHE_NEGATION.test(satz) || BLEIBT.test(satz)
  if (!verneintOderBleibt) return false
  // Ein ausdrücklicher Auftrag im selben Satz gewinnt — außer der Satz
  // verneint ihn ausdrücklich („Sockelleisten nicht neu machen").
  if (AUFTRAG.test(satz) && !starkVerneint) return false
  return true
}

/**
 * PM-035 (03.09.2026): „Sockelleisten nur im Flur neu. **In den Zimmern**
 * bleiben die alten." Der zweite Satz nennt keinen konkreten Raum, sondern
 * eine Gruppe. Ohne diese Behandlung wurde er dem zuletzt genannten Raum
 * zugeschlagen — also ausgerechnet dem Flur, der die Sockelleisten bekommen
 * soll. Der Ausschluss traf damit exakt den falschen Raum.
 */
const GENERISCH_ZIMMER = /\bzimmern?\b/i
const GENERISCH_ALLE = /\br[äa]um(?:e|en)?\b|\bwohnung\b/i

export function erkenneSockelleistenAusschluss(
  text: string,
  raumNamen: string[] = [],
): SockelleistenAusschluss {
  const raeume = new Set<string>()
  const belege: string[] = []
  let global = false
  if (!text) return { global, raeume, belege }

  const saetze = saetzeMitRaum(text, raumNamen)
  let sockelSchonGenannt = false

  for (const { satz, raum, raumImSatz, raeumeImSatz } of saetze) {
    if (istAusschlussSatz(satz, sockelSchonGenannt)) {
      belege.push(satz.trim())
      // „in den Zimmern", „in den anderen Räumen": eine Gruppe, nicht der
      // zuletzt genannte Raum. Nur wenn in DIESEM Satz kein konkreter Raum
      // steht — „im Wohnzimmer bleiben sie" bleibt raumgenau.
      const gruppe = !raumImSatz && GENERISCH_ZIMMER.test(satz)
        ? raumNamen.filter(n => /zimmer/i.test(n))
        : null

      if (UEBERALL.test(satz) || (!raumImSatz && GENERISCH_ALLE.test(satz))) global = true
      else if (gruppe && gruppe.length > 0) for (const n of gruppe) raeume.add(n)
      // Aufzählung: „In Küche und Esszimmer bleiben sie" meint beide Räume,
      // nicht nur den zuletzt genannten (PM-034).
      else if (raeumeImSatz.length > 1) for (const n of raeumeImSatz) raeume.add(n)
      else if (raum === null) global = true
      else raeume.add(raum)
    }
    if (SOCKEL.test(satz)) sockelSchonGenannt = true
  }

  return { global, raeume, belege }
}

/** Kurzform für die Stellen, die nur „ja/nein für diesen Raum" brauchen. */
export function sockelleistenAusgeschlossen(
  text: string,
  raumName?: string | null,
  alleRaumNamen: string[] = [],
): boolean {
  const namen = alleRaumNamen.length > 0
    ? alleRaumNamen
    : (raumName ? [raumName] : [])
  const a = erkenneSockelleistenAusschluss(text, namen)
  if (a.global) return true
  if (!raumName) return false
  return a.raeume.has(raumName)
}
