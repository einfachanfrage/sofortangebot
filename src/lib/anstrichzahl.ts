/**
 * Die Anstrichzahl im Titel ändern — Titel, Preis und Untertitel in einem.
 *
 * ── CoS-E-021 / TN-052 (Manfred) ──────────────────────────────────────────
 *
 * *„Wechsel 1× → 2× verlangt manuelles Ändern von Titel, Untertitel UND
 * Preis statt eines Umschalters, obwohl die App den Preis kennt."*
 *
 * Er hat recht, und der Satz hinten ist der wichtige. Der Katalog führt die
 * drei Zeilen längst getrennt:
 *
 *   Wand streichen 1x Anstrich     6,00 €
 *   Wand streichen 2x Anstrich     9,50 €
 *   Wand streichen 3x Anstrich    13,00 €
 *
 * Und der Preis-Matcher liest die Anstrichzahl als **harten Filter** (Regel 1
 * vom 24.08.: ein 2x-Auftrag bekommt nie einen 1x-Preis). Wer also den Titel
 * von Hand auf 2x ändert und den Preis stehen lässt, hat genau den Zustand,
 * den diese Regel verhindern soll — eine Position, die 2x verspricht und 1x
 * kostet. Die Handarbeit war nicht nur lästig, sie war eine Fehlerquelle.
 *
 * Diese Datei macht aus den drei Handgriffen einen: Sie schreibt die Zahl um
 * und sagt, wie die Zeile danach heißt. Den Preis holt die Oberfläche aus
 * derselben Preisdatenbank wie überall sonst — nicht aus einer Formel.
 *
 * ── Warum nicht einfach × 2 rechnen ──────────────────────────────────────
 *
 * Weil es falsch wäre. Der zweite Anstrich kostet nicht so viel wie der
 * erste: 6,00 € → 9,50 €, nicht 12,00 €. Grundierung, Abkleben und Anfahrt
 * fallen einmal an. Genau deshalb steht im Katalog eine eigene Zeile und
 * keine Formel — und deshalb fragt diese Reparatur den Katalog.
 */

/** Die Schreibweisen, in denen eine Anstrichzahl im Titel stehen kann. */
//
// Die Grenze nach rechts ist ein Lookahead und KEIN `\b`: Nach dem „×“ in
// `Türen lackieren (2× Anstrich)` steht ein Leerzeichen — zwei Zeichen ohne
// Wortcharakter, also gar keine Wortgrenze. Mit `\b` blieb ausgerechnet die
// Schreibweise des Katalogs unerkannt, und der Umschalter wäre bei der
// häufigsten Position nicht erschienen.
const ZAHL_IM_TITEL = /\b([123])(\s*)([x×])(?![\p{L}\p{N}])|\b(ein|zwei|drei)(fach)\b/iu

const WORTZAHL: Record<string, string> = { ein: '1', zwei: '2', drei: '3' }
const ZAHLWORT: Record<string, string> = { '1': 'ein', '2': 'zwei', '3': 'drei' }

/**
 * Trägt der Titel überhaupt eine Anstrichzahl?
 *
 * Nur dann ist der Umschalter sinnvoll — „Boden abdecken" hat keine.
 */
export function hatAnstrichzahl(titel: string): boolean {
  return ZAHL_IM_TITEL.test(titel ?? '')
}

/** Welche Anstrichzahl steht drin? `null`, wenn keine. */
export function anstrichzahl(titel: string): '1' | '2' | '3' | null {
  const t = ZAHL_IM_TITEL.exec(titel ?? '')
  if (!t) return null
  const zahl = t[1] ?? WORTZAHL[(t[4] ?? '').toLowerCase()]
  return (zahl === '1' || zahl === '2' || zahl === '3') ? zahl : null
}

/**
 * Denselben Titel mit einer anderen Anstrichzahl.
 *
 * Bewusst eine ERSETZUNG an Ort und Stelle, kein neu zusammengesetzter
 * Titel: Alles andere — der Raum hinter dem Gedankenstrich, Klammerzusätze
 * wie „(ohne Akzentwand)", die Schreibweise „×" statt „x" — bleibt genau so
 * stehen, wie es war. Ein Titel, der beim Umschalten seine Form ändert,
 * verliert seinen Preis (die Klammer) oder seinen Raum (der Gedankenstrich);
 * beides ist heute schon teuer genug gewesen.
 */
export function mitAnstrichzahl(titel: string, neu: '1' | '2' | '3'): string {
  return (titel ?? '').replace(ZAHL_IM_TITEL, (treffer, ziffer, luecke, mal, wort, fach) => {
    if (ziffer) return `${neu}${luecke}${mal}`
    // Schreibweise erhalten: „Zweifach" bleibt groß, „zweifach" klein.
    const ersatz = ZAHLWORT[neu]
    const grossGeschrieben = (wort as string)[0] === (wort as string)[0].toUpperCase()
    return `${grossGeschrieben ? ersatz[0].toUpperCase() + ersatz.slice(1) : ersatz}${fach}`
  })
}

/** Die drei Stufen, in der Reihenfolge, in der sie im Umschalter stehen. */
export const ANSTRICHSTUFEN: Array<'1' | '2' | '3'> = ['1', '2', '3']
