// Satzweise Raumzuordnung — eine Stelle, nicht drei.
//
// Handwerker diktieren in Sätzen, nicht in Formularen. Der Raum wird einmal
// genannt und gilt dann weiter („Im Wohnzimmer muss nur eine Ecke neu.
// Ungefähr sechs Quadratmeter."), und er springt mitten im Diktat zurück
// („Im Flur muss der alte Belag raus. Im Wohnzimmer nur die Ecke ausbauen.").
// Wer das je Auswertung neu nachbaut, baut es dreimal unterschiedlich falsch —
// deshalb steht es hier einmal und wird von teilflaeche.ts und
// sockelleisten-ausschluss.ts gemeinsam benutzt.

export interface SatzMitRaum {
  satz: string
  /** Zuletzt genannter Raum — null, solange im Diktat noch keiner gefallen ist. */
  raum: string | null
}

export function saetze(text: string): string[] {
  return text
    .split(/[.!?;\n]+/)
    .map(s => s.trim())
    .filter(Boolean)
}

/**
 * Ordnet jedem Satz den zuletzt genannten Raum zu. Nennt ein Satz mehrere
 * Räume, gewinnt der zuletzt genannte — so, wie man es liest.
 */
export function saetzeMitRaum(text: string, raumNamen: string[]): SatzMitRaum[] {
  const namen = raumNamen
    .map(n => (n ?? '').trim())
    .filter(n => n.length >= 3)
    .map(n => ({ original: n, lower: n.toLocaleLowerCase('de-DE') }))
    // Längere Namen zuerst: „Wohnzimmer" darf nicht von „Zimmer" geschlagen werden.
    .sort((a, b) => b.lower.length - a.lower.length)

  const ergebnis: SatzMitRaum[] = []
  let aktuell: string | null = null

  for (const satz of saetze(text)) {
    const lower = satz.toLocaleLowerCase('de-DE')
    let bestName: string | null = null
    let bestPos = -1
    for (const n of namen) {
      const pos = lower.lastIndexOf(n.lower)
      if (pos > bestPos) {
        bestPos = pos
        bestName = n.original
      }
    }
    if (bestName !== null && bestPos >= 0) aktuell = bestName
    ergebnis.push({ satz, raum: aktuell })
  }

  return ergebnis
}

/** Alle einem Raum zugeordneten Sätze — auch nicht zusammenhängende. */
export function saetzeJeRaum(text: string, raumNamen: string[]): Map<string, string[]> {
  const zuordnung = new Map<string, string[]>()
  for (const { satz, raum } of saetzeMitRaum(text, raumNamen)) {
    if (raum === null) continue
    const bisher = zuordnung.get(raum)
    if (bisher) bisher.push(satz)
    else zuordnung.set(raum, [satz])
  }
  return zuordnung
}
