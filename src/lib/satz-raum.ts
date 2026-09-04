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
  /**
   * Wurde der Raum in DIESEM Satz genannt, oder wird er nur weitergetragen?
   * Der Unterschied entscheidet, ob ein Satz wie „in den Zimmern bleiben die
   * alten" wirklich den zuletzt genannten Raum meint — oder etwas anderes.
   */
  raumImSatz: boolean
}

// Teuer gelernt (03.09.2026, beim Durchgehen der offenen Testfälle):
// Ein Punkt ZWISCHEN ZIFFERN ist ein Dezimaltrennzeichen, kein Satzende.
// Unsere eigene Zahlen-Vorverarbeitung erzeugt genau das — „vier mal
// dreieinhalb" wird zu „4 mal 3.5", und die Produktionstranskripte enthalten
// es auch direkt („Im Flur daneben 4 mal 1.50 kommt der Boden komplett neu").
// Ein naives split(/[.!?;]/) zerlegt so mitten in der Maßangabe: Aus
// „Flur, 4 mal 3.5, Laminat, Trittschalldämmung drunter" werden zwei Stücke,
// und das Stück mit der Dämmung enthält den Raumnamen nicht mehr. Die
// Trittschalldämmung landete dadurch wieder in allen Räumen statt im
// genannten — der Fehler, der schon dreimal repariert wurde, durch die
// Hintertür. Deshalb: Ziffer.Ziffer wird vor dem Trennen geschützt.
const DEZIMAL_SCHUTZ = '\u0000'

export function saetze(text: string): string[] {
  return text
    .replace(/(\d)\.(\d)/g, `$1${DEZIMAL_SCHUTZ}$2`)
    .split(/[.!?;\n]+/)
    .map(s => s.split(DEZIMAL_SCHUTZ).join('.').trim())
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
    const raumImSatz = bestName !== null && bestPos >= 0
    if (raumImSatz) aktuell = bestName
    ergebnis.push({ satz, raum: aktuell, raumImSatz })
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
