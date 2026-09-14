// DC-055 / TN-007 (Manfred, 11.09.2026) — Zahlen in Fließtexten auf dem
// Kundendokument.
//
// Befund: „Der Rechenweg sieht aus wie Computer: Schreibmaschinenschrift,
// Punkt statt Komma („2.4 m")." Die Spalten Menge/Einzelpreis/Gesamtpreis
// gehen im PDF längst durch deutsche Formatter (fmtMenge/fmtEuro) — die
// Fließtexte darunter nicht. Rechenweg und Übermessungs-Hinweis entstehen als
// rohe Template-Strings in den Mengen-Engines (maler.ts, boden.ts,
// fliesen.ts, vob-uebermessung.ts), und eine JS-Zahl schreibt sich dort mit
// englischem Dezimalpunkt. Direkt neben „12,50 €" sieht das aus wie ein
// Fehler, auch wenn gerechnet richtig wurde.
//
// Warum hier und nicht in den Engines: der Punkt ist kein Rechen-, sondern
// ein Darstellungsfehler. An der Ausgabe angesetzt, ist er mit EINER Stelle
// für alle Gewerke erledigt — auch für die, die es noch nicht gibt —, und es
// wird keine einzige Berechnung angefasst. Sollte Engineering die Texte
// später schon deutsch formatiert erzeugen, ändert das hier nichts: aus einem
// Komma wird kein zweites.

/** Datum (11.09.2026) — die Punkte darin sind keine Dezimaltrenner. */
const DATUM = /^\d{1,2}\.\d{1,2}\.\d{2,4}$/

/**
 * Schreibt Dezimalzahlen in einem Fließtext deutsch: `2.4 m` → `2,4 m`.
 * Alles andere bleibt unangetastet — Normnummern ohne Punkt („DIN 18363")
 * sowieso, Datumsangaben ausdrücklich.
 */
export function mitDeutschenZahlen(text: string | null | undefined): string {
  if (!text) return ''
  return text.replace(/\d+(?:\.\d+)+/g, treffer =>
    DATUM.test(treffer) ? treffer : treffer.replace(/\./g, ','),
  )
}
