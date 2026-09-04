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

/**
 * Sockelleisten-Länge = Umfang − Summe der Türbreiten (jede Tür unterbricht
 * die Leiste). Türbreite ohne Angabe: Standard 0,90 m (wie überall sonst in
 * der Pipeline).
 */
export function berechneSockelleistenLaenge(
  umfang: number,
  tueren: TuerFuerSockelleisten[],
): number {
  const tuerBreiten = tueren.reduce((sum, t) => sum + (t.anzahl ?? 1) * (t.breite ?? 0.9), 0)
  return round2(umfang - tuerBreiten)
}
