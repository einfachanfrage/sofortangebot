/**
 * Der gesprochene Ausführungstermin — als Vorschlag, nicht als Zusage.
 *
 * ── CoS-E-019 / TN-045 (Manfred) ──────────────────────────────────────────
 *
 * *„Gesprochener Ausführungstermin (‚in 3 Wochen fertig') wird nirgends
 * gespeichert, kein Feld dafür vorgesehen."*
 *
 * Er sagt den Termin im selben Atemzug wie die Maße — und danach ist er weg.
 * Beim Kundennamen war es dieselbe Geschichte (CoS-E-018): erkannt, gelesen,
 * und dann von niemandem mehr angefasst. Hier war es eine Stufe früher: Es
 * gab nicht einmal ein Feld.
 *
 * ── Warum deterministisch und nicht über den KI-Prompt ────────────────────
 *
 * Der naheliegende Weg wäre, GPT ein Feld `termin` beizubringen. Dagegen
 * sprechen zwei Dinge:
 *
 *   1. Ein Prompt-Feld braucht einen Edge-Deploy und ist danach nur so
 *      verlässlich wie das Modell an dem Tag. Diese Datei ist prüfbar: 30
 *      Sprechweisen, 30 Testfälle, kein Deploy.
 *   2. Es gibt hier nichts zu verstehen. „In drei Wochen" ist keine
 *      Bedeutungsfrage, sondern eine Schreibweise — dieselbe Art Aufgabe wie
 *      `zahlen-parser.ts` oder `extraktion-masse.ts`, und die sind aus genau
 *      diesem Grund deterministisch.
 *
 * Kommt später ein KI-Feld dazu, hat es Vorrang und das hier bleibt der
 * Rückfall — dasselbe Muster wie `baueVerstaendnis(transkript, signale)`.
 *
 * ── Was gespeichert wird: der Wortlaut, nicht das Datum ───────────────────
 *
 * Das ist die wichtigste Entscheidung in dieser Datei. „In drei Wochen"
 * rechnet sich nur von einem Stichtag aus — und der ist der Tag des Diktats,
 * nicht der Tag, an dem der Kunde zusagt. Zwischen beiden liegen oft Wochen.
 * Ein daraus errechnetes Datum sähe aus wie eine Zusage und wäre keine.
 *
 * Deshalb: Der **Wortlaut** ist das Ergebnis. Ein Datum kommt nur dazu, wenn
 * der Handwerker eines GENANNT hat („am 15. Oktober"). Lieber sichtbar eine
 * Formulierung, die der Handwerker selbst einordnet, als still ein Datum,
 * das ihn festnagelt — dieselbe Regel wie PM-018 beim Preis.
 */

export type TerminArt =
  /** Ausdrückliches Datum: „am 15. Oktober", „bis zum 30.10." */
  | 'datum'
  /** Zeitspanne ab dem Diktat: „in drei Wochen", „in 10 Tagen" */
  | 'spanne'
  /** Grobe Lage: „Ende Oktober", „nächste Woche", „KW 42" */
  | 'ungefaehr'

export interface Termin {
  art: TerminArt
  /** Wortlaut, wie er im Diktat steht — das ist das Ergebnis. */
  wortlaut: string
  /**
   * Nur bei `art: 'datum'` gesetzt, und nur wenn er eindeutig ist.
   * ISO (YYYY-MM-DD). Bei allem anderen bewusst `null`.
   */
  datum: string | null
}

const MONATE: Record<string, number> = {
  januar: 1, jänner: 1, februar: 2, märz: 3, maerz: 3, april: 4, mai: 5, juni: 6,
  juli: 7, august: 8, september: 9, oktober: 10, november: 11, dezember: 12,
}

const ZAHLWORT: Record<string, number> = {
  ein: 1, eine: 1, einem: 1, einen: 1, einer: 1, eineinhalb: 1, zwei: 2, drei: 3, vier: 4, fünf: 5, fuenf: 5,
  sechs: 6, sieben: 7, acht: 8, neun: 9, zehn: 10, elf: 11, zwölf: 12, zwoelf: 12,
  vierzehn: 14, sechzehn: 16,
}

const zahl = (roh: string): number | null => {
  const n = Number(roh.replace(',', '.'))
  if (Number.isFinite(n)) return n
  return ZAHLWORT[roh.toLowerCase()] ?? null
}

/** „3" + „10" → „2026-10-03"; gibt null bei unmöglichen Daten. */
function iso(tag: number, monat: number, jahr: number): string | null {
  if (monat < 1 || monat > 12 || tag < 1 || tag > 31) return null
  const d = new Date(Date.UTC(jahr, monat - 1, tag))
  if (d.getUTCMonth() !== monat - 1 || d.getUTCDate() !== tag) return null
  return d.toISOString().slice(0, 10)
}

const ZAHLEN = Object.keys(ZAHLWORT).join('|')

/**
 * Die Sprechweisen, in der Reihenfolge ihrer Verbindlichkeit: Ein genanntes
 * Datum schlägt eine Spanne, eine Spanne schlägt eine grobe Lage.
 *
 * Jede Regel liefert den Wortlaut so, wie er dasteht — nicht umformuliert.
 * Was der Handwerker gesagt hat, soll er auch wiederlesen.
 */
const REGELN: Array<{
  art: TerminArt
  muster: RegExp
  datum?: (t: RegExpExecArray, heute: Date) => string | null
}> = [
  {
    // „am 15. Oktober", „bis zum 30. November", „zum 3. Dezember"
    art: 'datum',
    muster: new RegExp(String.raw`\b(?:bis\s+zum|bis|ab|am|zum)\s+(\d{1,2})\.\s*(${Object.keys(MONATE).join('|')})\b`, 'i'),
    datum: (t, heute) => {
      const tag = Number(t[1])
      const monat = MONATE[t[2].toLowerCase()]
      const jahr = heute.getUTCFullYear()
      const kandidat = iso(tag, monat, jahr)
      // Ein Monat, der dieses Jahr schon vorbei ist, meint das nächste Jahr.
      if (kandidat && kandidat >= heute.toISOString().slice(0, 10)) return kandidat
      return iso(tag, monat, jahr + 1)
    },
  },
  {
    // „bis zum 30.10.", „am 15.10.2026", „ab 1.11."
    art: 'datum',
    muster: /\b(?:bis\s+zum|bis|ab|am|zum)\s+(\d{1,2})\.\s*(\d{1,2})\.(?:\s*(\d{2,4}))?/i,
    datum: (t, heute) => {
      const tag = Number(t[1])
      const monat = Number(t[2])
      const jahrRoh = t[3]
      if (jahrRoh) {
        const j = Number(jahrRoh)
        return iso(tag, monat, j < 100 ? 2000 + j : j)
      }
      const jahr = heute.getUTCFullYear()
      const kandidat = iso(tag, monat, jahr)
      if (kandidat && kandidat >= heute.toISOString().slice(0, 10)) return kandidat
      return iso(tag, monat, jahr + 1)
    },
  },
  {
    // „in drei Wochen", „in 2 Wochen fertig", „in 10 Tagen", „in einem Monat"
    art: 'spanne',
    muster: new RegExp(String.raw`\bin\s+(?:etwa\s+|ca\.?\s+|rund\s+)?(\d{1,2}|${ZAHLEN})\s*(tag|tagen|woche|wochen|monat|monaten)\b`, 'i'),
  },
  {
    // „innerhalb von zwei Wochen", „binnen 14 Tagen"
    art: 'spanne',
    muster: new RegExp(String.raw`\b(?:innerhalb\s+von|binnen)\s+(\d{1,2}|${ZAHLEN})\s*(tag|tagen|woche|wochen|monat|monaten)\b`, 'i'),
  },
  {
    // „Ende Oktober", „Anfang November", „Mitte September"
    art: 'ungefaehr',
    muster: new RegExp(String.raw`\b(?:anfang|mitte|ende)\s+(${Object.keys(MONATE).join('|')})\b`, 'i'),
  },
  {
    // „nächste Woche", „übernächste Woche", „nächsten Monat"
    art: 'ungefaehr',
    muster: /\b(?:über|ueber)?n(?:ä|ae)chste[nrs]?\s+(?:woche|monat)\b/i,
  },
  {
    // „KW 42", „Kalenderwoche 42"
    art: 'ungefaehr',
    muster: /\b(?:kw|kalenderwoche)\s*\.?\s*(\d{1,2})\b/i,
  },
  {
    // „bis Freitag", „bis nächsten Montag"
    art: 'ungefaehr',
    muster: /\bbis\s+(?:n(?:ä|ae)chsten\s+)?(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag)\b/i,
  },
]

/**
 * Liest den Ausführungstermin aus dem Diktat.
 *
 * `heute` ist der Stichtag für Datumsangaben ohne Jahr — in der Anwendung
 * der Tag des Diktats, im Test ein fester Wert.
 *
 * Gibt `null` zurück, wenn nichts Eindeutiges dasteht. Das ist der
 * Normalfall und kein Fehler: Die meisten Diktate nennen keinen Termin, und
 * einer, der keiner ist, wäre schlimmer als keiner.
 */
export function lesTermin(transkript: string, heute: Date = new Date()): Termin | null {
  const text = transkript ?? ''
  for (const regel of REGELN) {
    const treffer = regel.muster.exec(text)
    if (!treffer) continue
    return {
      art: regel.art,
      wortlaut: treffer[0].trim(),
      datum: regel.datum?.(treffer, heute) ?? null,
    }
  }
  return null
}

/**
 * Ein Satz für die interne Notiz des Handwerkers.
 *
 * Beantwortet zugleich CoS-E-032 („Feld ‚Interne Notiz' bleibt leer, obwohl
 * genau dort ein gesprochener Termin hingehört hätte"). Bewusst mit dem
 * Wortlaut in Anführungszeichen: Der Handwerker soll sehen, dass das SEIN
 * Satz ist und keine Auslegung der App.
 */
export function terminNotiz(termin: Termin): string {
  const datum = termin.datum
    ? ` (${new Date(`${termin.datum}T00:00:00Z`).toLocaleDateString('de-DE', { timeZone: 'UTC' })})`
    : ''
  return `Termin aus dem Diktat: „${termin.wortlaut}"${datum}`
}
