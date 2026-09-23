// PM-119 / L-06 — die Grundreihenfolge des Angebots ist die Reihenfolge der
// Ausführung (gebaut 23.09.2026, Head of Product Engineering)
//
// ── Woher die Tabelle kommt ───────────────────────────────────────────────
//
// Das Soll ist nicht hier erfunden. Es steht als Messung und als Begründung
// in `src/lib/__tests__/pm119-l06-ausfuehrungsreihenfolge.test.ts`
// (Prüfmeister, 17.09.2026): drei nachgemessene Fälle, dreimal falsch, und
// sieben Stufen als Soll. Die Regeltabelle unten ist Zeile für Zeile
// dieselbe wie die, mit der er misst. Wer sie hier ändert, ändert das Soll —
// dann gehört die Änderung erst in seine Datei.
//
// Die vier Gestaltungsfragen hat der Designer in DC-144 beantwortet
// (`docs/design-check.md` ab Z. 16095). Die vier Sätze, die hier gebaut sind:
//
//   1. Die Stufe SORTIERT nur. Sie ist keine Überschrift, kein Badge, kein
//      Filter, und sie wird nirgends gedruckt. `stufeFuer` ist deshalb
//      absichtlich nicht nach außen als Anzeigewert gedacht.
//   2. Sortiert wird VOR dem Gruppieren — also in jeder Gliederung, auch und
//      vor allem in „Nach Räumen", der Vorauswahl. Wer nur die Option
//      „Nach Arbeitsablauf" repariert, repariert die Ansicht, die fast
//      niemand eingeschaltet hat.
//   3. `PHASE_REGELN` in `angebot-struktur.ts` fällt weg; die drei Phasen
//      werden aus den Stufen gebündelt (1–4 · 5 · 6–7). Eine Quelle,
//      mehrere Aufrufer.
//   4. Stufe 7 muss INNERHALB der Raumgruppe greifen — der
//      Erschwerniszuschlag ist keine Allgemein-Position, sondern eine echte
//      Zeile pro hohem Raum (DC-073).
//
// ── Was die Tabelle ausdrücklich NICHT verspricht ─────────────────────────
//
// `Gerüst stellen`, `Entsorgung` und `Schuttcontainer` stehen in den
// Beispielen zu Stufe 1 und 6, kommen dort aber nie an: `ALLGEMEIN_MUSTER`
// (`angebot-gruppierung.ts`) fängt sie ab, bevor gruppiert wird, und schiebt
// sie in den Allgemein-Block am Blattende. **Das ist so gewollt** (DC-144
// §4a) — sie gehören keinem einzelnen Raum. Hier steht es, damit der
// Nächste keinen Fehler sucht, der keiner ist. `Endreinigung` und
// `Feinreinigung` sind NICHT im Allgemein-Muster und bleiben echte
// Stufe-6-Zeilen.
//
// Die Reihenfolge INNERHALB von Stufe 5 legt diese Datei nicht fest (bei den
// Fliesen wird vor dem Verlegen abgedichtet und danach verfugt). Der
// Prüfmeister hat sie aus L-06 herausgenommen; sie liegt als eigener Punkt
// in seinem Themenspeicher.

/** Die sieben Stufen. Reihenfolge der Einträge = Vorrang, spezifisch vor
 *  generisch: „Sockelleisten abkleben" ist Schutz, „Sockelleisten montieren"
 *  ist Abschluss; „Untergrund schleifen" ist Untergrund, „Parkett schleifen"
 *  ist Hauptarbeit. Deshalb stehen 7 und 6 vor 1. */
export const AUSFUEHRUNGS_STUFEN: { stufe: number; name: string; test: RegExp }[] = [
  { stufe: 7, name: 'ZUSCHLAG', test: /erschwerniszuschlag|zuschlag\b|kleinmaterial|verbrauchsmaterial|anfahrt|kleinstauftrag|mindestauftrag/i },
  { stufe: 6, name: 'ABSCHLUSS', test: /sockelleisten\s*montier|stuckleisten\s*montier|übergangs?(profil|schiene)|anschlussprofil|silikon|versiegel|parkettlack|folie\s*entfern|abdeckfolie\s*\/?\s*abklebeband\s*entfern|endreinigung|feinreinigung|baustelle\s*kehren|entsorg|möbel\s*zurück/i },
  { stufe: 1, name: 'SCHUTZ', test: /abkleb|abdeck|schütz|staubschutz|staubwand|gerüst|möbel\s*rück|boden\s*schütz/i },
  { stufe: 2, name: 'ABBRUCH', test: /entfern|abnehm|abstemm|demontier|demontage|aufnehm|rausreiß|abfräs|kleberreste|altkleber|graffiti/i },
  { stufe: 3, name: 'UNTERGRUND', test: /spachtel|glätt|ausbesser|riss|schleif|ausgleich|untergrund|quarzsand|feuchtigkeitssperre|trittschall/i },
  { stufe: 4, name: 'GRUNDIERUNG', test: /grundier|voranstrich|tiefengrund|haftgrund/i },
  { stufe: 5, name: 'HAUPTARBEIT', test: /streich|anstrich|tapezier|raufaser|lackier|verleg|verkleb|fliesen|verfug|abdicht|abdichtung|sockel/i },
]

/** Die Stufe einer Zeile. Was keine Regel trifft, ist Hauptarbeit — das
 *  Auffangbecken liegt bewusst in der Mitte und nicht am Rand, damit eine
 *  unbekannte Zeile weder vor den Schutz noch hinter den Zuschlag rutscht. */
export function stufeFuer(titel: string): number {
  for (const r of AUSFUEHRUNGS_STUFEN) if (r.test.test(titel ?? '')) return r.stufe
  return 5
}

/**
 * Dieselbe Liste, stufenweise sortiert — innerhalb einer Stufe bleibt die
 * bestehende Reihenfolge unangetastet.
 *
 * Stabil ist hier kein Nebensatz, sondern die halbe Zusicherung: die
 * Reihenfolge innerhalb einer Stufe ist entstanden (Raum für Raum, Wand vor
 * Decke) und vielfach woanders gemessen. `Array.prototype.sort` ist seit
 * ES2019 stabil; der Index als zweiter Schlüssel steht trotzdem da, weil
 * diese Zusicherung zu teuer ist, um sie einer Laufzeiteigenschaft zu
 * überlassen.
 */
export function sortiereNachAusfuehrung<T>(items: readonly T[], titelVon: (i: T) => string): T[] {
  return items
    .map((item, index) => ({ item, index, stufe: stufeFuer(titelVon(item)) }))
    .sort((a, b) => (a.stufe - b.stufe) || (a.index - b.index))
    .map(e => e.item)
}
