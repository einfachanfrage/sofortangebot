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

/**
 * Macht aus dem internen Rechenweg den Satz, den der Kunde liest.
 *
 * - „… aus Transkript" / „… aus Aufnahme"  → fällt weg (reine Herkunft)
 * - „… im Transkript erkannt"              → „… im Aufmaß erkannt"
 * - „1 Fenster angenommen"                 → „1 Fenster (angenommen)"
 *
 * Die Menge selbst wird nie angefasst — nur der Satz daneben.
 * Mehrfach angewendet ändert sich nichts mehr (idempotent).
 */
export function kundenRechenweg(text: string | null | undefined): string {
  if (!text) return ''
  return text
    // Herkunftsnotiz am Ende einer Mengenangabe: trägt für den Kunden nichts
    // und bedeutet je nach Engine Gegenteiliges (siehe Kopf).
    .replace(/\s*\baus (?:Transkript|Aufnahme)\b/g, '')
    // Fließtext-Formen („Altbau im Transkript erkannt"): hier trägt das Wort
    // den Satz, es wird deshalb ersetzt statt gestrichen. „Aufmaß" ist das
    // Wort, das der Handwerker in der App sieht („Aufmaß starten", „Fotos
    // vom Aufmaß") und das der Kunde aus dem Handwerk kennt.
    .replace(/\bim Transkript\b/g, 'im Aufmaß')
    // Sicherheitsnetz für künftige Formulierungen.
    .replace(/\bTranskript(?:e|s)?\b/g, 'Aufmaß')
    // Angenommene Menge als Zusatz kennzeichnen, nicht als Teil der Rechnung.
    // Steht die Klammer schon da, greift die Regel nicht erneut.
    .replace(/(\S)[ \t]+angenommen\b/g, '$1 (angenommen)')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}
