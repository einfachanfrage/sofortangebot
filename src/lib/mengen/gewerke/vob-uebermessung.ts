// VOB-Übermessungsregel für Anstricharbeiten (VOB/C, DIN 18363) — EINE
// Stelle für alle Fenster-/Türabzüge in der Maler-Engine.
//
// Sandys Entscheidung (PM-021, 2026-08-21, siehe pruefmeister-testfaelle.md):
// Öffnungen (Fenster, Türen) bis 2,5 m² Einzelgröße werden beim Ausmessen
// NICHT von der zu streichenden Wandfläche abgezogen — der Mehraufwand für
// Kantenarbeit/Leibungen an einer kleinen Öffnung gleicht die eingesparte
// Fläche ungefähr aus. Gängige Handwerker-Praxis, jetzt Standard für ALLE
// Malerangebote (kein Toggle, keine Sonderbedingung — bewusst einfach
// gehalten, siehe Fix-Update). NUR Öffnungen ÜBER 2,5 m² (z.B. eine breite
// Terrassentür) werden weiterhin einzeln abgezogen.
//
// Bewusst NICHT Teil dieser Funktion: die VOB-Regel besagt zusätzlich, dass
// Leibungen übermessener (nicht abgezogener) Öffnungen nicht separat
// vergütet werden. `daten.leibungen[]` hat aktuell keine Verknüpfung zu
// einzelnen Fenster-/Tür-Objekten (siehe maler.ts) — diese Verfeinerung ist
// bewusst zurückgestellt, nicht Teil des aktuellen Fixes.

export const VOB_UEBERMESSUNG_SCHWELLE_M2 = 2.5

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export interface OeffnungFuerAbzug {
  anzahl?: number
  breite?: number
  hoehe?: number
}

export interface OeffnungsabzugErgebnis {
  /** Tatsächlich von der Wandfläche abzuziehende Fläche (nur Öffnungen > 2,5 m²). */
  abzugFlaeche: number
  /** Rohsumme aller Öffnungsflächen, unabhängig von der VOB-Regel — für Anzeige/Durchschnitt. */
  rohFlaeche: number
  /** Anzahl der wegen der VOB-Regel NICHT abgezogenen (übermessenen) Öffnungen. */
  uebermessenAnzahl: number
  /** Flächensumme der übermessenen Öffnungen (Teilmenge von rohFlaeche). */
  uebermessenFlaeche: number
}

/**
 * Öffnungsfläche für den Wandflächen-Abzug — je Öffnung einzeln geprüft
 * (nicht in Summe): Einzelgröße ≤ 2,5 m² → nicht abziehen (Übermessung),
 * sonst wie bisher voll abziehen. `anzahl` gruppiert IDENTISCH große
 * Öffnungen (z.B. "2 Fenster gleicher Größe") — die Einzelgröße entscheidet
 * für alle gemeinsam.
 */
export function berechneOeffnungsabzugVob(
  oeffnungen: OeffnungFuerAbzug[],
  standardBreite: number,
  standardHoehe: number,
): OeffnungsabzugErgebnis {
  let abzugFlaeche = 0
  let rohFlaeche = 0
  let uebermessenAnzahl = 0
  let uebermessenFlaeche = 0

  for (const o of oeffnungen ?? []) {
    const anzahl = o?.anzahl ?? 1
    const breite = o?.breite ?? standardBreite
    const hoehe = o?.hoehe ?? standardHoehe
    const einzelFlaeche = breite * hoehe
    const gesamtFlaeche = anzahl * einzelFlaeche
    rohFlaeche += gesamtFlaeche

    if (einzelFlaeche <= VOB_UEBERMESSUNG_SCHWELLE_M2) {
      uebermessenAnzahl += anzahl
      uebermessenFlaeche += gesamtFlaeche
      continue
    }
    abzugFlaeche += gesamtFlaeche
  }

  return {
    abzugFlaeche: round2(abzugFlaeche),
    rohFlaeche: round2(rohFlaeche),
    uebermessenAnzahl,
    uebermessenFlaeche: round2(uebermessenFlaeche),
  }
}

/** Kurzer, lesbarer Hinweistext fürs `annahmen`-Array, wenn die Regel gegriffen hat. */
export function vobHinweistext(fenster: OeffnungsabzugErgebnis, tueren: OeffnungsabzugErgebnis): string | null {
  const anzahl = fenster.uebermessenAnzahl + tueren.uebermessenAnzahl
  if (anzahl === 0) return null
  const flaeche = round2(fenster.uebermessenFlaeche + tueren.uebermessenFlaeche)
  const teile = anzahl === 1 ? 'Öffnung' : 'Öffnungen'
  return `${anzahl} ${teile} bis 2,5 m² Einzelgröße nicht abgezogen (${flaeche} m², VOB/C DIN 18363 Übermessung)`
}

// ── Endkunden-Sicht (VOB-004 / Legal G5) ──────────────────────────────────
// Der Satz aus vobHinweistext() landet über `annahmen` in `quote_items` und
// war bisher nur in der App sichtbar. Der Endkunde las auf dem PDF „50,00 m²",
// maß 46,64 m² nach und fand keine Erklärung — genau die Konstellation, aus
// der Streit entsteht (Head of Legal, LR-01, 🔴). Freigegeben von Sandy
// (S-2, 01.09.2026). Die Erkennung läuft über eine Textprobe statt über ein
// eigenes Feld, weil bereits erzeugte Angebote den Hinweis nur als Freitext
// im annahmen-Array haben — ein neues Feld hätte den Bestand nicht erreicht.

/** Kennzeichen, an dem ein Übermessungs-Hinweis im annahmen-Array erkennbar ist. */
const UEBERMESSUNG_KENNZEICHEN = /nicht abgezogen.*Übermessung|Übermessung.*nicht abgezogen/i

export function istUebermessungsHinweis(text: string): boolean {
  return UEBERMESSUNG_KENNZEICHEN.test(text)
}

/** Holt den Übermessungs-Hinweis aus dem annahmen-Array einer Position (oder null). */
export function uebermessungsHinweis(annahmen: string[] | null | undefined): string | null {
  if (!annahmen?.length) return null
  return annahmen.find(a => typeof a === 'string' && istUebermessungsHinweis(a)) ?? null
}

/**
 * Alle Positionen eines Angebots auf einmal: id → Hinweistext.
 * Bewusst eine eigene Funktion und nicht inline im PDF: Die Positionsliste
 * wird im PDF an ZWEI Stellen gerendert (flach und nach Räumen gruppiert).
 * Eine gemeinsame Quelle verhindert, dass eine der beiden Ansichten den
 * Hinweis verliert — genau die Divergenz-Klasse, die uns bei „Karte zeigt
 * etwas anderes als der Entwurf" schon einmal getroffen hat.
 */
export function uebermessungsHinweiseJePosition<T extends { id: string; annahmen?: string[] | null }>(
  items: T[],
): Map<string, string> {
  const map = new Map<string, string>()
  for (const item of items) {
    const hinweis = uebermessungsHinweis(item.annahmen)
    if (hinweis) map.set(item.id, hinweis)
  }
  return map
}

/**
 * Die einmalige Erklärung unter der Positionsliste. Bewusst nicht defensiv
 * formuliert: sie erklärt dem Endkunden, warum die Abrechnung fair ist.
 * „In Anlehnung an" statt „nach" — konsistent mit VOB-007: das Produkt weicht
 * an mehreren Stellen bewusst von DIN 18363 ab, eine Vollzusage wäre falsch.
 */
export const UEBERMESSUNG_ERKLAERUNG =
  'Aufmaß in Anlehnung an VOB/C (DIN 18363): Fenster- und Türöffnungen bis 2,5 m² ' +
  'Einzelgröße werden nicht von der Fläche abgezogen. Der Mehraufwand für das saubere Arbeiten ' +
  'an Kanten, Laibungen und Anschlüssen gleicht die eingesparte Fläche aus. Die oben genannten ' +
  'Öffnungsflächen sind deshalb in der abgerechneten Menge enthalten.'
