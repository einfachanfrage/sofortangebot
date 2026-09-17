/**
 * ── DC-119 / PD-018 Punkt 1 (PM-095) ──────────────────────────────────────
 *
 * Der Handwerker nennt im selben Diktat zwei Wandflächen, die nicht
 * zusammenpassen:
 *
 *   „Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände streichen.
 *    Das Wohnzimmer hat dreißig Quadratmeter Wandfläche."
 *
 * Aus den Maßen sind das 45 m², gesagt werden danach 30 m². Bis heute gewinnt
 * die später genannte Zahl — **wortlos**. Für den Betrieb sind das 15 m² ×
 * 9,50 € = 142,50 €, die verschwinden, ohne dass er je erfährt, dass es zwei
 * Zahlen gab.
 *
 * **Dass die spätere Zahl gewinnt, bleibt richtig** (Selbstkorrektur, PM-001)
 * — das ändert dieses Modul nicht. Es liefert nur die Erkennung, damit die
 * Entscheidung sichtbar wird: als Rückfrage im Fluss (kontext-analyzer.ts)
 * und, falls die übersprungen wird, im Rechenweg der Wandposition
 * (gewerke/maler.ts). Zwei Nutzer derselben Funktion, damit Frage und
 * Rechenweg nie verschiedene Zahlen nennen.
 *
 * **Warum eine Schwelle und nicht jede Abweichung:** Eine genannte Wandfläche
 * ist oft die Zahl, die der Betrieb selbst schon um seine Fenster und Türen
 * bereinigt hat. Ein Zimmer mit einem Fenster und einer Tür liegt damit
 * regelmäßig ein paar Quadratmeter unter der Rohgeometrie — das ist kein
 * Widerspruch, sondern dieselbe Angabe in sauber. Gefragt wird deshalb erst,
 * wenn die Abweichung **beides** ist: mindestens 10 % **und** mindestens
 * 5 m². 5 m² sind bei 9,50 €/m² rund 47 € — unterhalb davon wäre die Frage
 * teurer als der Fehler.
 *
 * **Bewusst nur Länge × Breite × Höhe.** Wird die Wandfläche aus einer
 * Bodenfläche geschätzt (Quadrat-Annahme, ≈ 7 % Fehler), ist die Abweichung
 * keine Aussage über einen Widerspruch — die Schätzung ist in maler.ts schon
 * als Annahme gekennzeichnet.
 */

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

/** Mindestabweichung in Prozent der Rohgeometrie. */
export const KONFLIKT_ANTEIL = 0.1
/** Mindestabweichung in Quadratmetern. */
export const KONFLIKT_M2 = 5

export interface KonfliktRaum {
  laenge?: number | null
  breite?: number | null
  hoehe?: number | null
  wandflaeche_direkt?: number | null
}

export interface WandflaechenKonflikt {
  /** Wandfläche brutto aus Umfang × Höhe — dieselbe Rechnung wie maler.ts. */
  geometrie: number
  /** Die im Diktat ausdrücklich genannte Wandfläche. */
  gesagt: number
  /** Umfang in lfm, für den Belegtext („Umfang 18 lfm × 2,50 m"). */
  umfang: number
}

/**
 * Wandfläche brutto aus Länge × Breite × Höhe. `null`, sobald eines der drei
 * Maße fehlt. Wortgleich zu `maler.ts` (`umfangM = 2·l + 2·b`,
 * `wandBrutto = umfang × hoehe`), damit Frage und Rechnung nicht
 * auseinanderlaufen.
 */
export function wandflaecheAusGeometrie(raum: KonfliktRaum): number | null {
  const l = raum.laenge
  const b = raum.breite
  const h = raum.hoehe
  if (!l || !b || !h) return null
  return round2(round2(2 * l + 2 * b) * h)
}

/**
 * Gibt es zu diesem Raum zwei Wandflächen, die sich widersprechen?
 * `null` = nein (oder es fehlt eine der beiden Angaben).
 *
 * Der Dachgeschoss-Fall ist hier NICHT ausgenommen — das entscheidet der
 * Aufrufer, der `istDachgeschoss` ohnehin schon kennt. Dort trägt
 * `wandflaeche_direkt` erfahrungsgemäß die Schrägenfläche (PM-007), also gar
 * keine Wandfläche, und ein Vergleich wäre sinnlos.
 */
export function findeWandflaechenKonflikt(raum: KonfliktRaum): WandflaechenKonflikt | null {
  const gesagt = raum.wandflaeche_direkt
  if (gesagt == null || !(gesagt > 0)) return null
  const geometrie = wandflaecheAusGeometrie(raum)
  if (geometrie == null || geometrie <= 0) return null

  const abweichung = Math.abs(geometrie - gesagt)
  if (abweichung < KONFLIKT_M2) return null
  if (abweichung / geometrie < KONFLIKT_ANTEIL) return null

  return {
    geometrie,
    gesagt: round2(gesagt),
    umfang: round2(2 * (raum.laenge as number) + 2 * (raum.breite as number)),
  }
}

/** „30,5" statt „30.5" — deutsche Schreibweise für alle Anzeigetexte. */
export function zahlDe(n: number): string {
  return String(round2(n)).replace('.', ',')
}

/**
 * Der Beleg-Halbsatz, der die Rohgeometrie nachvollziehbar macht:
 * „4 × 5 m bei 2,50 m Höhe".
 */
export function geometrieBeleg(raum: KonfliktRaum): string {
  return `${zahlDe(raum.laenge as number)} × ${zahlDe(raum.breite as number)} m bei ${zahlDe(raum.hoehe as number)} m Höhe`
}
