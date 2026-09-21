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
 * Eine bereits deutsch geschriebene Zahl mit Tausenderpunkt: `2.301,14` oder
 * `1.234.567`. Der Punkt trennt dort Tausender, nicht Dezimalstellen — aus ihm
 * ein Komma zu machen, ergäbe `2,301,14` und damit eine Zahl, die niemand mehr
 * lesen kann.
 *
 * DC-138 (21.09.2026): Der Anlass ist kein gedachter. `zuschlagBerechnungsweg()`
 * schreibt die Bemessungsgrundlage eines Zuschlags heute ohne Tausenderpunkt
 * (`20 % auf 2301,14 €`) — CoS-E-092 zieht ihn nach. Ab dann läuft genau diese
 * Zeichenkette hier durch: in der App (seit `e1b7c76`), in der Vorschau und im
 * PDF (DC-137). Ohne diese Ausnahme hätte Engineerings Einzeiler drei
 * Ausgabestellen auf einmal unlesbar gemacht.
 *
 * Die Regel ist bewusst eng gezogen: erkannt wird nur, was als englische
 * Dezimalzahl gar nicht mehr lesbar wäre — ein Cent-Komma dahinter
 * (`2.301,14`) oder zwei Punktgruppen (`1.234.567`). Ein einzelnes `2.301`
 * ohne Nachkommastelle bleibt eine Dezimalzahl und wird zu `2,301`.
 *
 * Warum diese Grenze und keine weitere: `2.135` ist im Produkt eine echte
 * Türhöhe in Metern (Prüfraum aus CoS-E-090). Drei Nachkommastellen sind hier
 * also nicht theoretisch, Tausenderzahlen ohne Cent dagegen entstehen nirgends
 * — Geldbeträge laufen über `toFixed(2)` und bringen ihr Komma mit.
 */
const DEUTSCHE_TAUSENDER = /^[1-9]\d{0,2}(?:\.\d{3})+,\d+$|^[1-9]\d{0,2}(?:\.\d{3}){2,}$/

/**
 * Schreibt Dezimalzahlen in einem Fließtext deutsch: `2.4 m` → `2,4 m`.
 * Alles andere bleibt unangetastet — Normnummern ohne Punkt („DIN 18363")
 * sowieso, Datumsangaben und deutsche Tausenderzahlen ausdrücklich.
 */
export function mitDeutschenZahlen(text: string | null | undefined): string {
  if (!text) return ''
  return text.replace(/\d+(?:\.\d+)+(?:,\d+)?/g, treffer =>
    DATUM.test(treffer) || DEUTSCHE_TAUSENDER.test(treffer)
      ? treffer
      : treffer.replace(/\./g, ','),
  )
}
