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
  const tuerBreiten = tueren.reduce((sum, t) => sum + (t.breite ?? 0.9), 0)
  return round2(umfang - tuerBreiten)
}
