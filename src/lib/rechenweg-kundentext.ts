// DC-107 (aus CoS-E-058) — der Rechenweg auf dem Kundendokument.
//
// Der Rechenweg steht laut CI-Handbuch (S. 19) auf dem Kundenpapier und ist
// dort das Beweisstück: der Kunde soll die Menge nachrechnen können. Was er
// dafür braucht, ist die RECHNUNG — „46,64 m² × 12,50 €/m²", „3 Zimmer × 2
// Anstriche". Woher die Engine die Zahl hat, ist eine Notiz an den Betrieb.
//
// Genau diese Trennung hat `pdf.tsx` schon einmal gezogen: CoS-E-005 /
// CoS-E-009 (Manfred, 11.09.2026) hat das komplette `annahmen`-Array vom
// Kundenpapier genommen, ausdrücklich auch, weil dort „das interne Wort
// ‚Transkript'" stand. Der Rechenweg läuft über einen zweiten Weg
// (`rechenwegJeItem`) und ist bei dieser Aufräumaktion durchgerutscht:
// „Transkript" steht heute in 32 Rechenweg-Zeilen in acht Dateien, dazu in
// drei weiteren über Variablen — und damit auf jedem Angebot.
//
// Und die Herkunftsnotiz taugt auch fachlich nichts mehr. Dieselben zwei
// Wörter bedeuten im Quelltext heute das Gegenteil voneinander:
//
//   maler-lackieren.ts   „aus Aufnahme" = im Satz stand KEINE Zahl, sie
//                        kommt aus dem Raumbestand (`raeume[].tueren`)
//   aufnahme-hinweise.ts „aus Aufnahme" = es stand ausdrücklich eine Zahl
//                        da (`expliziteSockelMenge`, `stueckTreffer`)
//
// Eine Angabe, die auf demselben Blatt zweierlei heißen kann, ist auf einem
// Dokument, dem der Kunde vertrauen soll, schlechter als keine. Deshalb
// fällt die Herkunft auf dem Kundenpapier weg, statt umbenannt zu werden.
//
// Was bleibt: „angenommen". Das ist keine Herkunft, sondern eine
// Einschränkung der Menge selbst — niemand hat sie genannt, die App hat sie
// gesetzt. Sie bleibt stehen und bekommt eine Klammer, damit sie als Zusatz
// zur Menge gelesen wird und nicht als Teil der Rechnung.
//
// Warum an der Ausgabe und nicht in den Engines: derselbe Grund wie bei
// `zahlen-text.ts` (DC-055 Teil 2). Es wären ~35 Template-Strings in acht
// Rechen-Dateien, jede neue Engine müsste daran denken, und es wäre
// Berechnungscode angefasst worden, um einen Darstellungsfehler zu beheben.
// An EINER Stelle am Ausgang gilt es für alle Gewerke — auch für die, die es
// noch nicht gibt — und keine einzige Berechnung wird berührt.
//
// Die App ist bewusst NICHT betroffen. In `AngebotDetail.tsx` prüft der
// Betrieb seine eigene Kalkulation; dort ist die Herkunft eine nützliche
// Information. Dieselbe Trennlinie wie bei DC-055 Teil 1 (Monospace in der
// App, Dokumentschrift auf dem Papier): zwei Leser, zwei Anforderungen.
// `AngebotVorschau.tsx` ist die Vorschau AUF das PDF und wechselt mit —
// sonst ist sie keine.
//
// ──────────────────────────────────────────────────────────────────────────
// DC-108 (aus PM-078, Prüfmeister, 15.09.2026) — zwei Sätze, die der
// DC-107-Filter nicht gesehen hat, weil in ihnen kein „Transkript" steht.
//
// Der Prüfmeister hat uns die Wahl gelassen, am Ausgang zu filtern oder in
// den Engines zu reparieren. Es bleibt der Ausgang, aus demselben Grund wie
// oben: die beiden Sätze stehen in vier Dateien (`chips-vervollstaendigung.ts`,
// `mengen/mehrgewerk.ts`, `vollstaendigkeit/boden-vorarbeiten.ts`,
// `vollstaendigkeit/maler-extras.ts`), und in allen vier sind sie für den
// BETRIEB richtig. Sie gehören nicht repariert, sie gehören nur nicht aufs
// Kundenpapier. Eine Reparatur in den Engines würde dem Handwerker etwas
// wegnehmen, um den Kunden zu schützen.
//
// A) „Erkannt, aber Menge nicht sicher berechenbar — bitte manuell ergänzen"
//    ist eine Arbeitsanweisung an den Betrieb. Der Kunde liest auf seinem
//    Angebot, dass die Menge nicht berechnet werden konnte. Exakt die Sorte
//    Text, die CoS-E-005 mit dem `annahmen`-Array vom Papier genommen hat.
//    Sie fällt ganz weg — `pdf.tsx` schreibt dann wie bei jeder Position ohne
//    Rechenweg „Pauschale", und der Kunde sieht nichts Ungewöhnliches.
//    Die Regel ist bewusst eng: Erst wenn nach dem Streichen der
//    „bitte …"-Anweisung KEINE Zahl mehr übrig ist, war der ganze Satz eine
//    Anweisung. Bleibt eine Rechnung stehen, bleibt sie stehen.
//
// B) „Umfang ≈ 4 × √20 m² = 18 lfdm" verrät dem Kunden über die Wurzel, dass
//    sein Raum als Quadrat angenommen wurde — die Annahme selbst
//    („Quadratischer Raum angenommen") steht in `annahmen` und ist für ihn
//    unsichtbar. Der Prüfmeister hat recht: entweder die Annahme wird
//    sichtbar oder der Schätzweg verschwindet, beides zugleich ist die
//    schlechteste Fassung. Sichtbar machen scheidet nach PD-015 aus (eine als
//    Annahme gekennzeichnete Menge ist kein Angebot, sondern ein Vorbehalt),
//    also verschwindet die Herleitung — das ERGEBNIS bleibt: „Umfang ≈
//    18 lfdm". Das „≈" sagt weiterhin, dass geschätzt wurde; die Zahl, die
//    der Kunde nachmessen kann, bleibt ihm erhalten.
// ──────────────────────────────────────────────────────────────────────────
// DC-110 (aus CoS-E-065 Punkt 2, 15.09.2026) — der Filter kennt die neuen
// Herkunftswörter, BEVOR es sie gibt.
//
// Engineering baut den Wortlaut aus DC-110 in die Engines ein: „aus
// Transkript" heißt dort künftig **„so gesagt"**, „aus Aufnahme" im Sinne
// des Raumbestands heißt **„aus den Raumangaben"**. Beide sind Herkunft und
// gehören nach DC-107 nicht aufs Kundenpapier — genau wie die beiden Wörter,
// die sie ablösen.
//
// Die Erweiterung steht hier schon, obwohl die Engines die neuen Wörter noch
// nicht schreiben. Grund: Umbenennung und Filter liegen in verschiedenen
// Händen (Engines = Engineering, Ausgang = Design). Käme der Filter erst
// hinterher, stünde zwischen den beiden Commits „4 Tür(en) so gesagt" auf
// jedem Angebot — derselbe Fehler, den DC-107 gerade beseitigt hat, nur mit
// neuen Wörtern. In dieser Reihenfolge kann die Umbenennung an jedem Tag
// landen, ohne dass jemand an diese Datei denken muss.
//
// Solange die Engines die alten Wörter schreiben, ändert die Erweiterung
// nichts: sie greift auf Zeichenfolgen, die heute nirgends vorkommen.
// ──────────────────────────────────────────────────────────────────────────

/**
 * Anweisung an den Betrieb („… bitte manuell ergänzen", „… — Menge bitte
 * prüfen"). Zwei Fassungen, in dieser Reihenfolge angewandt:
 *
 *  1. als angehängter Teilsatz hinter einem Trennzeichen — dann fällt der
 *     Teilsatz ganz weg, nicht nur das Wort ab „bitte" (sonst bliebe ein
 *     Rest wie „… = 583,00 € — Menge" stehen);
 *  2. ohne Trennzeichen davor, als Auffangnetz.
 *
 * Beide enden am Satzende, damit eine Rechnung im selben Feld unangetastet
 * bleibt.
 */
const ANWEISUNG_MIT_TRENNER = /\s*[—–;,-]\s*[^—–;,.]*\bbitte\b[^.]*/gi
const ANWEISUNG_BLANK = /\s*\bbitte\b[^.]*/gi

/**
 * Macht aus dem internen Rechenweg den Satz, den der Kunde liest.
 *
 * - „… aus Transkript" / „… aus Aufnahme"  → fällt weg (reine Herkunft)
 * - „… so gesagt" / „… aus den Raumangaben" → fällt weg (DC-110, dieselbe
 *   Herkunft mit den Wörtern, die die Engines künftig schreiben)
 * - „… im Transkript erkannt"              → „… im Aufmaß erkannt"
 * - „1 Fenster angenommen"                 → „1 Fenster (angenommen)"
 * - „… bitte manuell ergänzen" (ganzer Satz) → fällt weg (DC-108 A)
 * - „Umfang ≈ 4 × √20 m² = 18 lfdm"        → „Umfang ≈ 18 lfdm" (DC-108 B)
 *
 * Die Menge selbst wird nie angefasst — nur der Satz daneben.
 * Mehrfach angewendet ändert sich nichts mehr (idempotent).
 */
export function kundenRechenweg(text: string | null | undefined): string {
  if (!text) return ''

  // DC-108 A: War der Satz nichts als eine Anweisung an den Betrieb, bleibt
  // nach dem Streichen keine Zahl übrig — dann ist er kein Rechenweg.
  const ohneAnweisung = text
    .replace(ANWEISUNG_MIT_TRENNER, '')
    .replace(ANWEISUNG_BLANK, '')
    .trim()
  if (ohneAnweisung !== text.trim() && !/\d/.test(ohneAnweisung)) return ''

  const ergebnis = ohneAnweisung
    // Herkunftsnotiz am Ende einer Mengenangabe: trägt für den Kunden nichts
    // und bedeutet je nach Engine Gegenteiliges (siehe Kopf).
    .replace(/\s*\baus (?:Transkript|Aufnahme|den Raumangaben)\b/g, '')
    // DC-110: dasselbe für den Fall „die Zahl stand im Satz". „so gesagt"
    // wird als Ganzes gesucht — ein einzelnes „gesagt" ist an anderen Stellen
    // Teil eines Satzes („keine Stückzahl gesagt") und bleibt unangetastet.
    .replace(/\s*\bso gesagt\b/g, '')
    // Fließtext-Formen („Altbau im Transkript erkannt"): hier trägt das Wort
    // den Satz, es wird deshalb ersetzt statt gestrichen. „Aufmaß" ist das
    // Wort, das der Handwerker in der App sieht („Aufmaß starten", „Fotos
    // vom Aufmaß") und das der Kunde aus dem Handwerk kennt.
    .replace(/\bim Transkript\b/g, 'im Aufmaß')
    // Sicherheitsnetz für künftige Formulierungen.
    .replace(/\bTranskript(?:e|s)?\b/g, 'Aufmaß')
    // DC-108 B: Schätzweg über die Wurzel — Herleitung raus, Ergebnis bleibt.
    .replace(/≈\s*[^=]*√[^=]*=\s*/g, '≈ ')
    // Angenommene Menge als Zusatz kennzeichnen, nicht als Teil der Rechnung.
    // Steht die Klammer schon da, greift die Regel nicht erneut.
    .replace(/(\S)[ \t]+angenommen\b/g, '$1 (angenommen)')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()

  // DC-108 B, Sicherheitsnetz: eine Wurzel darf in keiner Schreibweise aufs
  // Kundenpapier. Bleibt eine stehen, ist der Satz für uns unverstanden —
  // dann lieber gar kein Rechenweg („Pauschale") als ein halb verstandener.
  if (ergebnis.includes('√')) return ''

  return ergebnis
}
