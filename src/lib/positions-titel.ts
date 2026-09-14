// Positionstitel, die anderswo im Code GELESEN werden.
//
// ── Warum es diese Datei gibt (F.6, Zug 2b, 12.09.2026) ───────────────────
//
// `Wandflächen streichen 2x` wurde zu `Wand streichen 2x` und
// `Deckenfläche streichen 2x` zu `Decke streichen 2x` — „Wandflächen" ist
// ein Werkzeugwort, kein Handwerkerwort (Manfreds Bedingung).
//
// Die Umbenennung selbst war eine Zeile. Teuer war, wer den Titel LIEST:
// **zwölf Stellen** in fünf Dateien und zwei Schichten haben ihn als stillen
// Vertrag benutzt. Keine einzige davon hätte sich von selbst gemeldet:
//
//   • `maler-sonder.ts` (3×) — Betonfarbe, Kalkputz und die
//     Deckenbehandlung ERSETZEN die Streichposition per `filtereArray`.
//     Ohne Treffer bleibt sie stehen → doppelt berechnet.
//   • `maler-sonder.ts` (2×) — Feuchtraum- und Abwaschbar-Farbe benennen die
//     Wandposition um. Ohne Treffer: keine Umbenennung, wortlos.
//   • `maler-tapete.ts` (2×) — entfernt die Streichposition, wenn stattdessen
//     tapeziert wird → sonst doppelt berechnet.
//   • `maler-extras.ts` (2×) — findet die Basisfläche für die
//     Spachtelarbeiten. Ohne Treffer fallen SÄMTLICHE Spachtelpositionen
//     ersatzlos aus; die Decken-Variante verliert ihre Unterscheidung.
//   • `maler-basis.ts` (2×) — die Grundierung erbt Fläche und Raum von hier.
//   • `maler-lackieren.ts` — zählt die Räume für die Heizkörperzahl.
//   • `mengen/aufnahme-hinweise.ts` — hängt „Schleifen" an die Wandposition.
//   • `positions-untertitel.ts` — der Untertitel auf dem KUNDENDOKUMENT.
//   • `mengen/gewerke/maler.ts` — die Plausibilitätswarnung
//     „Wandfläche < Bodenfläche".
//
// Deshalb steht die Erkennung an EINER Stelle, und zwar in einem eigenen
// Modul statt in den Helpers einer Schicht: Gelesen wird der Titel in der
// Mengen-Engine, in der Vollständigkeitsprüfung und in der Darstellung. Wer
// ihn das nächste Mal ändert, ändert ihn hier — und findet über die Aufrufer
// sofort alle betroffenen Stellen.
//
// Die alten Schreibweisen bleiben in den Mustern stehen: Ein Angebot, das vor
// der Umbenennung entstanden ist, muss weiter erkannt werden.

/** Die Wand-Streichposition, unabhängig von der aktuellen Schreibweise. */
export function istWandStreichen(beschreibung: string): boolean {
  return /\bwand(?:fläche|flächen)?\s+streichen/i.test(beschreibung)
}

/** Die Decken-Streichposition, unabhängig von der aktuellen Schreibweise. */
export function istDeckeStreichen(beschreibung: string): boolean {
  return /\bdecke(?:nfläche)?\s+streichen/i.test(beschreibung)
}

/**
 * Hängt einen Zusatz an einen Positionstitel — an der richtigen Stelle.
 *
 * ── Warum das nötig ist (Prüfmeister O.3, 12.09.2026) ─────────────────────
 *
 * Drei Funktionen kennzeichnen die Streichposition nachträglich mit dem
 * verwendeten Material: Feuchtraumfarbe, abwaschbare Farbe, chlorbeständige
 * Spezialfarbe. Alle drei haben es unterschiedlich falsch gemacht:
 *
 *   `pruefeFeuchtraum`  `.replace(/streichen(\s*—\s*.+)?$/, …)`
 *       Der Titel endet seit der Anstrichzahl auf „… streichen 2x — Bad".
 *       Zwischen „streichen" und dem Gedankenstrich steht das „2x", also
 *       greift das Muster nicht — die Zusage verschwand wortlos vom
 *       Kundenpapier. Das ist **älter als die Umbenennung von heute** und war
 *       bis zur Wortsuche des Prüfmeisters unentdeckt.
 *
 *   `pruefeAbwaschbar`  `.replace(/streichen/, …)`
 *       Trifft die ERSTE Fundstelle: „Wand streichen (abwaschbare Farbe) 2x
 *       — Bad". Der Zusatz landet vor der Anstrichzahl.
 *
 *   `pruefeChlor`  `p.beschreibung += ' (…)'`
 *       Hängt hinten an, also HINTER den Raum: „… 2x — Bad (chlorbeständige
 *       Spezialfarbe)". Damit heißt der Raum plötzlich „Bad (chlorbeständige
 *       Spezialfarbe)" — jede Stelle, die den Raum aus dem Titel liest,
 *       bekommt Müll.
 *
 * Der Raum steht per Konvention hinter dem Gedankenstrich und muss dort
 * bleiben. Der Zusatz gehört davor.
 */
export function mitTitelZusatz(beschreibung: string, zusatz: string): string {
  const treffer = /^(.*?)(\s[—–-]\s.+)$/.exec(beschreibung)
  const kopf = treffer ? treffer[1] : beschreibung
  const raumTeil = treffer ? treffer[2] : ''
  return `${kopf} (${zusatz})${raumTeil}`
}

/**
 * Der Raum aus einem Positionstitel — oder null, wenn keiner drinsteht.
 *
 * Die Konvention: Hinter dem Gedankenstrich steht der Raum
 * („Wand streichen 2x — Wohnzimmer“). Diese Funktion ist die eine Stelle,
 * die das liest.
 *
 * Sie gibt es, weil derselbe Ausdruck an mehreren Stellen von Hand stand und
 * an einer davon FEHLTE: Die Deckengrundierung wurde ohne Raum gebaut und
 * landete deshalb unter „Allgemein“ (CoS-E-026). Wer eine Folgeposition aus
 * einer anderen ableitet, muss den Raum mitnehmen — sonst verliert die
 * abgeleitete Position ihre Zugehörigkeit, obwohl die Quelle sie hatte.
 */
export function raumAusTitel(beschreibung: string): string | null {
  return /\s[—–-]\s*(.+)$/.exec(beschreibung ?? '')?.[1]?.trim() ?? null
}
