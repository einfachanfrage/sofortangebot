import { saetze } from '../satz-raum'
import type { BerechnetePosition } from '../mengen/types'

export function hat(positionen: BerechnetePosition[], ...begriffe: string[]): boolean {
  return positionen.some(p => p.beschreibung != null && begriffe.some(b => p.beschreibung.toLowerCase().includes(b)))
}

export function add(ergaenzt: BerechnetePosition[], fehlende: string[], beschreibung: string): void {
  if (!hat(ergaenzt, ...beschreibung.toLowerCase().split(' ').slice(0, 2))) {
    fehlende.push(beschreibung)
  }
}

/**
 * Findet den Raum, zu dem eine Arbeit gehört: sucht den Satz, der den Begriff
 * enthält ("im Wohnzimmer den Heizkörper lackieren"), und darin einen der
 * bekannten Raumnamen. So bekommen raumbezogene Positionen ihr "— Raum"-Suffix
 * und landen nicht im Allgemein-Topf.
 */
export function findeRaumImSatz(begriff: RegExp, lower: string, raumNamen: string[]): string | null {
  if (raumNamen.length === 0) return null
  for (const satz of saetze(lower ?? '')) {
    const begriffTreffer = begriff.exec(satz)
    if (!begriffTreffer) continue

    // DC-091 (13.09.2026): Der NÄCHSTE Raumname gewinnt, nicht der erste aus
    // der Liste.
    //
    // Vorher stand hier `raumNamen.find(...)` — das lieferte den Raum, der in
    // der ÜBERGABELISTE zuerst steht, nicht den, der im Satz neben der Arbeit
    // steht. Bei „Flur und Wohnzimmer streichen, im Bad zwei Heizkörper
    // lackieren" gewann der Flur, obwohl „Bad" unmittelbar davor steht.
    // Auf dem Kundenpapier standen die Heizkörper damit im falschen Raum.
    //
    // Deutsch stellt den Ort meist voran („im Bad zwei Heizkörper"), deshalb
    // gewinnt bei gleichem Abstand der Raum VOR dem Begriff.
    const ziel = begriffTreffer.index
    let bester: string | null = null
    let besteEntfernung = Infinity
    for (const raum of raumNamen) {
      const stelle = satz.indexOf(raum.toLocaleLowerCase('de-DE'))
      if (stelle === -1) continue
      const entfernung = stelle <= ziel ? ziel - stelle : (stelle - ziel) + 0.5
      if (entfernung < besteEntfernung) {
        besteEntfernung = entfernung
        bester = raum
      }
    }
    if (bester) return bester
  }
  return null
}

/**
 * ── CoS-E-059 / PM-045-C, Eingriff 2 (15.09.2026) ────────────────────────
 *
 * Gilt eine im Diktat genannte VORARBEIT auch für DIESES Bauteil?
 *
 * Der Fund: *„Im Flur die vier Innentüren lackieren, die sind alt, die
 * müssen vorher angeschliffen und grundiert werden. Im Wohnzimmer die zwei
 * Fenster von innen streichen."* — dabei entstanden zusätzlich
 * `Fenster abschleifen` und `Fenster grundieren`, beide mit Preis. Gesagt
 * war das Anschleifen für die TÜREN. Eine Begründung, die an einem Bauteil
 * hängt, wanderte auf ein anderes, weil die Regeln das ganze Transkript
 * lesen und nicht den Satz, in dem das Bauteil steht.
 *
 * Die Regel, die daraus folgt — bewusst in DIESER Staffelung, damit sie
 * nirgends Geld wegnimmt, wo heute welches steht:
 *
 *   1. Die Vorarbeit fällt im Diktat überhaupt nicht → unverändert. Wer
 *      „die Türen lackieren" sagt, bekommt Anschleifen und Grundieren
 *      weiter als fachliche Vorarbeit. Ob das so bleiben soll, ist eine
 *      Frage an den Prüfmeister, nicht an diesen Eingriff.
 *   2. Die Vorarbeit steht in einem Satz MIT diesem Bauteil → sie gilt.
 *   3. Sie steht nur in Sätzen mit einem ANDEREN Bauteil → sie gilt hier
 *      nicht. Das ist der Fund.
 *   4. Sie steht in einem Satz ohne jedes Bauteil („alles vorher
 *      anschleifen") → allgemeine Ansage, gilt wieder für alle.
 *
 * Satz, nicht Teilsatz: „…, die sind alt, die müssen angeschliffen werden"
 * hängt per Komma am Hauptsatz und meint dessen Bauteil.
 */
export function vorarbeitGiltFuer(
  bauteil: RegExp,
  vorarbeit: RegExp,
  lower: string,
  andereBauteile: RegExp[],
): boolean {
  const text = lower ?? ''
  if (!vorarbeit.test(text)) return true                    // 1.
  const alle = saetze(text)
  if (alle.some(s => bauteil.test(s) && vorarbeit.test(s))) return true   // 2.
  const beiAnderem = alle.some(s =>
    vorarbeit.test(s) && !bauteil.test(s) && andereBauteile.some(b => b.test(s)))
  return !beiAnderem                                        // 3. / 4.
}

/** Alle Raumnamen aus vorhandenen Positions-Suffixen ("… — Wohnzimmer"). */
export function raumNamenAus(positionen: BerechnetePosition[]): string[] {
  const namen: string[] = []
  for (const p of positionen) {
    const m = p.beschreibung?.match(/\s+[-–—]\s+(.+)$/)
    const n = m?.[1]?.trim()
    if (n && !namen.includes(n)) namen.push(n)
  }
  return namen
}

export function addMitMenge(ergaenzt: BerechnetePosition[], beschreibung: string, menge: number, einheit: string, berechnungsweg: string): void {
  if (!hat(ergaenzt, ...beschreibung.toLowerCase().split(' ').slice(0, 2))) {
    ergaenzt.push({ beschreibung, menge, einheit, konfidenz: 'high', berechnungsweg, annahmen: [] })
  }
}

// Ersetzt den ergaenzt.length = 0 + forEach-Pattern
export function filtereArray(ergaenzt: BerechnetePosition[], filterFn: (p: BerechnetePosition) => boolean): void {
  const gefiltert = ergaenzt.filter(filterFn)
  ergaenzt.length = 0
  gefiltert.forEach(p => ergaenzt.push(p))
}

// Zahl vor/nach Schlüsselwort im Text suchen
export function anzahlAus(lower: string, schluessel: string, fallback = 1): number {
  const escaped = schluessel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const vorher = new RegExp(`(\\d+)\\s*(?:stück\\s*)?(?:[a-zäöüß]+)?${escaped}`, 'i')
  const nachher = new RegExp(`${escaped}\\s*(\\d+)`, 'i')
  const stueckAllgemein = new RegExp(`(\\d+)\\s*stück`, 'i')
  const m = lower.match(vorher) ?? lower.match(nachher) ?? lower.match(stueckAllgemein)
  return m ? parseInt(m[1]) : fallback
}

// Der Titel-Erkenner ist schichtübergreifend (auch die Mengen-Engine liest
// ihn) und wohnt deshalb in `positions-titel.ts`. Hier nur weitergereicht,
// damit die bestehenden Importe aus './helpers' unverändert bleiben.
export { istWandStreichen, istDeckeStreichen, raumAusTitel } from '../positions-titel'
