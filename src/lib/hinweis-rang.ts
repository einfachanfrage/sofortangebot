import { istZeitAusschlussHinweis } from '@/lib/zeit-ausschluss'
import {
  istBauteilAusschlussHinweis,
  istBauteilUnklarHinweis,
} from '@/lib/bauteil-ausschluss'

/**
 * Die Reihenfolge der Zeilen im Bernsteinbanner (DC-128 → PD-024/DC-135 →
 * DC-142).
 *
 * Bis DC-142 stand die Regel nur als lokale Funktion in
 * `angebot/[id]/entwurf/page.tsx` und war damit nicht prüfbar — eine
 * Anzeige-Entscheidung, die niemand messen kann, ist eine Meinung. Sie steht
 * jetzt hier, wird dort benutzt und ist in
 * `src/lib/__tests__/dc142-rueckfrage-wortlaut.test.ts` zugesichert.
 *
 * **Zwei Achsen, in dieser Folge:**
 *
 * 1. **Offen vor abgeschlossen.** Eine Rückfrage (PM-136) ist die einzige
 *    Zeile im Banner, die eine Entscheidung des Betriebs verlangt — alle
 *    anderen melden eine fertige, richtige Tatsache. Sie ist außerdem die
 *    einzige, bei der das Blatt gerade womöglich FALSCH ist: es steht Arbeit
 *    darauf, die abbestellt sein könnte. Das Banner ist wegklickbar; was eine
 *    Antwort braucht, darf deshalb nicht unter Erledigtem stehen.
 * 2. **Danach die Schwere der Folge.** Ein ganzer Raum, den der Handwerker
 *    auf später geschoben hat, wiegt mehr als ein einzelnes Bauteil darin;
 *    beides wiegt mehr als ein korrigiertes Maß. Das ist keine Sortierung
 *    nach Text, sondern nach Folgen: die oberen Sorten sagen „hier fehlt
 *    Arbeit im Angebot", die unterste sagt „hier ist eine Zahl geradegerückt
 *    worden".
 *
 * Engineering hatte die Rückfrage mit `1` gleichauf mit dem
 * Bauteil-Ausschluss eingeordnet (gleiche Folge: im Angebot fehlt womöglich
 * Arbeit) und die Entscheidung ausdrücklich offengelassen. Sie steht jetzt
 * darüber — nicht weil sie mehr Geld bewegt, sondern weil sie die einzige
 * ist, die ohne den Betrieb nicht zu Ende geht.
 */
export function hinweisRang(zeile: string): number {
  if (istBauteilUnklarHinweis(zeile)) return 3
  if (istZeitAusschlussHinweis(zeile)) return 2
  if (istBauteilAusschlussHinweis(zeile)) return 1
  return 0
}

/**
 * Dieselbe Regel als fertige Sortierung — stabil, weil `Array.prototype.sort`
 * seit ES2019 stabil ist: Zeilen gleichen Rangs behalten die Reihenfolge, in
 * der sie entstanden sind (und das ist die Reihenfolge im Diktat).
 */
export function sortiereHinweise(zeilen: string[]): string[] {
  return [...zeilen].sort((a, b) => hinweisRang(b) - hinweisRang(a))
}
