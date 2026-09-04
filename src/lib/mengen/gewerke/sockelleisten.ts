// Sockelleisten-Länge: EINE Stelle für alle Gewerke (Maler, Boden, …).
//
// Warum: boden.ts hat die Türbreiten beim Sockelleisten-Umfang nie
// abgezogen, maler.ts an zwei Stellen schon (normale Wände + Kniestock) —
// beide mit eigener, leicht abweichender Inline-Rechnung. Ein Raum hat aber
// nur EINEN Umfang und EINE Anzahl Türen; welches Gewerk die Leiste verlegt
// oder abklebt, ändert daran nichts. Diese Funktion ist jetzt die einzige
// Stelle, die "Umfang minus Türbreiten" rechnet — Fund PM-002.

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export interface TuerFuerSockelleisten {
  breite?: number
  /**
   * PM-035, Befund 3 (Prüfmeister, 02.09.2026): „Drei Türen gehen da ab" — die
   * Extraktion liefert das korrekt als EINEN Eintrag mit `anzahl: 3`. Diese
   * Funktion hat die Stückzahl bis heute ignoriert und genau eine Türbreite
   * abgezogen. Bei einem Flur ist das der unwahrscheinlichste aller Fälle;
   * Flure haben per Definition viele Türen.
   */
  anzahl?: number
}

// ── VOB-012 (CoS-042, 04.09.2026): Normtext ausgewertet ──────────────────
//
// DIN 18363 und DIN 18365, jeweils Abschnitt 5.3.2: Unterbrechungen bis 1 m
// Einzellänge werden bei der Sockelleisten-Länge NICHT abgezogen. Eine
// Standard-Zimmertür ist 0,90 m breit — sie fällt darunter.
//
// Das war vorher als Preis-Entscheidung für Sandy offen; mit dem gekauften
// Normtext ist es keine Entscheidung mehr, sondern eine Tatsache. Bisher zog
// das Tool jede Türbreite voll ab, also 1,80 lfdm bei zwei Türen im Raum, die
// der Betrieb verlegt und nicht bezahlt bekommt.
//
// Dieselbe Schwelle für Maler (Abkleben) und Boden (Montage): Es ist dieselbe
// Leiste am selben Raum, nur ein anderes Gewerk fasst sie an.
export const VOB_SOCKEL_ABZUG_AB_M = 1.0

/**
 * Sockelleisten-Länge = Umfang − Summe der Unterbrechungen ÜBER 1 m
 * Einzellänge (VOB-012, siehe oben). Breite ohne Angabe: Standard 0,90 m
 * (wie überall sonst in der Pipeline) — die wird damit nie abgezogen.
 */
export function berechneSockelleistenLaenge(
  umfang: number,
  tueren: TuerFuerSockelleisten[],
): number {
  return round2(umfang - sockelAbzug(tueren))
}

/** Der tatsächlich abgezogene Anteil — getrennt, damit der Rechenweg stimmt. */
export function sockelAbzug(tueren: TuerFuerSockelleisten[]): number {
  const summe = (tueren ?? []).reduce((sum, t) => {
    const breite = t.breite ?? 0.9
    if (breite <= VOB_SOCKEL_ABZUG_AB_M) return sum
    return sum + (t.anzahl ?? 1) * breite
  }, 0)
  return round2(summe)
}
