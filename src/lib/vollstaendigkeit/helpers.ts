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
  return giltFuerBauteil(bauteil, vorarbeit, lower, andereBauteile)
}

/**
 * ── PM-098 / CoS-E-069 Nachtrag (16.09.2026) ─────────────────────────────
 *
 * Gilt ein im Diktat genannter AUFTRAG auch für DIESES Bauteil?
 *
 * Der Fund: *„Wohnzimmer, 5 mal 4, Höhe 2,50. Wände zweimal streichen. Die 2
 * Heizkörper bitte mit lackieren. Ein Fenster, eine Tür."* — daraus entstanden
 * sieben Positionen für 280,00 €: Tür und Fenster wurden abgeschliffen,
 * grundiert und lackiert. Gesagt war das Lackieren für die HEIZKÖRPER.
 *
 * `Ein Fenster, eine Tür` ist eine MASSANGABE, keine Beauftragung — die App
 * fordert sie selbst ein, um die Wandfläche zu rechnen. Die Auslöser oben
 * lasen aber das ganze Transkript: Bauteil irgendwo, Lackieren irgendwo,
 * fertig. Das trifft fast jedes Maler-Diktat mit Lackierarbeiten.
 *
 * Dieselbe Mechanik und dieselbe Staffelung wie bei `vorarbeitGiltFuer` —
 * bewusst keine zweite Art, einen Auftrag einem Bauteil zuzuordnen:
 *
 *   1. Die Arbeit steht im Rohtext überhaupt nicht → unverändert. Dann
 *      stammt der Auslöser allein aus den KI-Signalen (`raeume[].arbeiten`),
 *      und über die kann dieser Satz-Test nichts sagen. Nichts wegnehmen,
 *      wo wir nichts wissen.
 *   2. Die Arbeit steht in einem Satz MIT diesem Bauteil → sie gilt.
 *   3. Sie steht nur in Sätzen mit einem ANDEREN Bauteil → sie gilt hier
 *      nicht. Das ist der Fund.
 *   4. Sie steht in einem Satz ohne jedes Bauteil („alles lackieren", „die
 *      müssen abgeschliffen und lackiert werden") → allgemeine Ansage, gilt
 *      wieder für alle.
 *
 * Der Unterschied zu `vorarbeitGiltFuer` ist nicht die Mechanik, sondern was
 * am Ergebnis hängt: dort eine Vorarbeit an einer bestellten Leistung, hier
 * die Bestellung selbst.
 */
export function auftragGiltFuer(
  bauteil: RegExp,
  auftrag: RegExp,
  lower: string,
  andereBauteile: RegExp[],
): boolean {
  return giltFuerBauteil(bauteil, auftrag, lower, andereBauteile)
}

/** Der gemeinsame Kern von `vorarbeitGiltFuer` und `auftragGiltFuer`. */
function giltFuerBauteil(
  bauteil: RegExp,
  arbeit: RegExp,
  lower: string,
  andereBauteile: RegExp[],
): boolean {
  const text = lower ?? ''
  if (!arbeit.test(text)) return true                       // 1.
  const alle = saetze(text)
  if (alle.some(s => bauteil.test(s) && arbeit.test(s))) return true      // 2.
  const beiAnderem = alle.some(s =>
    arbeit.test(s) && !bauteil.test(s) && andereBauteile.some(b => b.test(s)))
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

/**
 * ── PM-089 / PM-108 / PM-075 — „nische" ist ein Wort, kein Wortstamm ───────
 *
 * Wortgrenzen statt Wortstamm, dieselbe Falle wie PM-064 und PM-074:
 * „nische" steckt in „technische", „mechanische", „elektronische",
 * „hygienische", „spanische", „botanische". Ein blosses
 * `lower.includes('nische')` hätte in jedem zweiten Diktat gefeuert. Die
 * Umlaute stehen ausgeschrieben statt `\b`, weil `\b` in JavaScript ASCII
 * ist und an „Fußnische" wieder eine falsche Grenze sähe.
 *
 * Steht hier und nicht im Gewerk, weil zwei Gewerke sie brauchen: der Maler
 * (`maler-sonder.ts`, Fehlt-Eintrag) und der Fliesenleger
 * (`fliesen-sonder.ts`, bepreiste Position). Eine Wahrheit pro Sache — sonst
 * driften die beiden Wortgrenzen auseinander.
 */
export const NISCHE_WORT = /(?<![a-zäöüß])(?:regal|wand|mauer)?nischen?(?![a-zäöüß])/
