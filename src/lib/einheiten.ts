/**
 * Die Einheiten, die der Betrieb zur Auswahl bekommt.
 *
 * ── CoS-E-024 / TN-060 (Manfred) ──────────────────────────────────────────
 *
 * Manfred legte für „Heizkörper abkleben – 1 Stück" einen Preis an und bekam
 * **m²** vorgeschlagen. Der Code sah richtig aus: Die Einheit der Position
 * wird übernommen. Die Auswahlliste kannte das Ergebnis nur nicht.
 *
 * Die Mengen-Engine schreibt „Stück" (44 Positionstypen) und „Pauschale"
 * (10), der Standardkatalog ebenso (597 bzw. 321 Zeilen). Die Liste kannte
 * statt dessen „Stk" und „pauschal". Ein `<select>`, dessen `value` in keiner
 * Option vorkommt, zeigt die ERSTE Option — und die war m². Der Wert im
 * State war die ganze Zeit richtig; angezeigt wurde etwas anderes.
 *
 * Das ist die teure Sorte Anzeigefehler: Wer ihm glaubt und die Einheit
 * „korrigiert", legt den Preis unter der falschen Einheit an — und der
 * Matcher vergleicht Einheiten hart, die Position bleibt danach dauerhaft
 * bei 0,00 €.
 *
 * Deshalb liegt die Liste hier und nicht in der Seite: So kann ein Test
 * prüfen, dass sie zu dem passt, was Engine und Katalog tatsächlich
 * erzeugen. Eine Liste, die nur in einer 170-KB-Komponente steht, prüft
 * niemand.
 */
export const UNITS = ['m²', 'Stück', 'lfdm', 'm', 'Pauschale', 'Stunde', 'm³', 'kg', 'km', 'Tag', '%']

/**
 * Die Auswahl für EINE Position — mit ihrer eigenen Einheit vorneweg, falls
 * die Liste sie nicht kennt.
 *
 * Der Katalog kennt Randfälle wie „m²/cm" (Aufpreis Estrichdicke) oder
 * „Fahrt". Die gehören nicht in eine Auswahlliste für alle, dürfen aber
 * auch nicht stillschweigend durch m² ersetzt werden. Lieber eine Einheit
 * zu viel in der Liste als eine falsch angezeigte.
 */
export function einheitenFuer(aktuell?: string | null): string[] {
  const e = (aktuell ?? '').trim()
  if (!e || UNITS.includes(e)) return UNITS
  return [e, ...UNITS]
}
