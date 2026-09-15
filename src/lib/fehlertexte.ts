// DC-014 (Sandy, 17.08.2026, Screenshot aus dem Onboarding-Schritt „Dein Logo")
// — Fehlertexte für Menschen.
//
// Befund: Im roten Banner unter dem Upload-Feld stand wörtlich
// „Upload fehlgeschlagen: new row violates row-level security policy" — die
// Rohmeldung der Datenbank, auf Englisch, eins zu eins an den Handwerker
// durchgereicht. Punkt 1 des Befundes (die kaputte RLS-Policy) ist über
// CoS-P-005 behoben. Punkt 2 blieb offen und ist der Grund für diese Datei:
// *jede* Meldung, die aus einer API- oder Datenbank-Antwort stammt, wird vor
// der Anzeige auf einen freundlichen deutschen Text abgebildet. Nie die
// Rohmeldung eines Systems direkt anzeigen — das gilt nicht nur beim Logo.
//
// Warum an der Anzeige und nicht in jeder aufrufenden Stelle einzeln: Eine
// Rohmeldung entsteht nicht dort, wo sie angezeigt wird, sondern irgendwo
// tiefer (Supabase, Storage, fetch, unsere eigenen Routen). Jede Anzeigestelle
// müsste sonst selbst wissen, wie eine Postgres-Meldung aussieht. Hier ist es
// eine Stelle, und eine neue Anzeigestelle erbt den Schutz, statt ihn
// nachzubauen.
//
// Der technische Wortlaut geht dadurch nicht verloren: Er gehört in
// console.error und Sentry, wo ihn jemand lesen kann, der ihn deuten kann —
// nicht in ein rotes Banner auf einer Baustelle.

/** Der Satz, wenn wir nichts Besseres über die Ursache wissen. */
export const FEHLER_STANDARD =
  'Das hat gerade nicht geklappt — bitte nochmal versuchen.'

/**
 * Bekannte Ursachen, von der speziellsten zur allgemeinsten geprüft.
 * Die Texte sagen, was der Betrieb TUN kann — eine Ursache ohne nächsten
 * Schritt ist für ihn dasselbe wie gar keine Antwort.
 */
const REGELN: { muster: RegExp; text: string }[] = [
  {
    // Abgelaufene Sitzung — steht vor der Berechtigungs-Regel, weil eine
    // abgelaufene Sitzung sich in Postgres wie eine fehlende Berechtigung
    // anfühlt, für den Nutzer aber etwas anderes bedeutet.
    muster: /\bjwt\b|token (?:is )?expired|session (?:has )?expired|refresh[_ ]token/i,
    text: 'Deine Sitzung ist abgelaufen — bitte melde dich neu an und versuch es nochmal.',
  },
  {
    // Der gemeldete Fall aus DC-014.
    muster: /row[- ]level security|permission denied|insufficient[_ ]privilege|not authorized|unauthorized|forbidden|\b42501\b/i,
    text: 'Dafür fehlt gerade die Berechtigung. Melde dich einmal neu an — bleibt es dabei, meld dich bitte bei uns.',
  },
  {
    muster: /duplicate key|already exists|unique constraint|\b23505\b/i,
    text: 'Das gibt es schon — bitte einen anderen Wert wählen.',
  },
  {
    muster: /null value in column|not[- ]null constraint|\b23502\b/i,
    text: 'Da fehlt noch eine Angabe — bitte alle Pflichtfelder ausfüllen.',
  },
  {
    muster: /foreign key|\b23503\b/i,
    text: 'Der Bezug dazu fehlt — bitte die Seite neu laden und nochmal versuchen.',
  },
  {
    muster: /payload too large|entity too large|maximum allowed size|file too large|\b413\b/i,
    text: 'Die Datei ist zu groß — bitte eine kleinere verwenden.',
  },
  {
    muster: /mime[- ]type|unsupported media|invalid file type|\b415\b/i,
    text: 'Dieses Dateiformat können wir nicht verarbeiten.',
  },
  {
    muster: /failed to fetch|fetch failed|network(?:error)?\b|load failed|econnreset|econnrefused|enotfound/i,
    text: 'Keine Verbindung zum Server — prüf kurz dein Netz und versuch es nochmal.',
  },
  {
    muster: /timed? ?out|etimedout|\baborted?\b|deadline exceeded/i,
    text: 'Das hat zu lange gedauert — bitte nochmal versuchen.',
  },
  {
    muster: /rate limit|too many requests|\b429\b/i,
    text: 'Gerade zu viele Anfragen — bitte kurz warten und nochmal versuchen.',
  },
  {
    muster: /internal server error|bad gateway|service unavailable|\b50[0234]\b/i,
    text: 'Beim Server ist gerade etwas schiefgegangen — bitte gleich nochmal versuchen.',
  },
  {
    muster: /bucket not found|object not found|storage/i,
    text: 'Die Datei konnte nicht gespeichert werden — bitte nochmal versuchen.',
  },
]

/**
 * Zeichen, die in einem Satz für einen Handwerker nichts zu suchen haben:
 * geschweifte Klammern, Pfade, Namensräume, snake_case-Spaltennamen, URLs.
 * `<` und `>` fehlen bewusst — „Raumhöhe > 3 m" ist im Produkt ein normaler
 * deutscher Satz.
 */
const TECHNISCHE_ZEICHEN = /[{}\\]|::|->|_[a-z]|https?:\/\/|\/[a-z0-9._-]+\//i

/** Wörter, die eine Maschinenmeldung verraten. Deutsche Wörter stehen hier
 *  ausdrücklich nicht drin — „Fehler" und „Server" schreiben wir selbst. */
const ENGLISCHE_WOERTER =
  /\b(error|failed|failure|invalid|unexpected|undefined|null|exception|violates|policy|constraint|column|relation|schema|database|query|statement|syntax|duplicate|key|row|denied|permission|exists?|fetch|internal|cannot|typeerror)\b/i

/** Eine Spur Deutsch — ein Umlaut oder eins der Wörter, die in fast jedem
 *  unserer eigenen Sätze vorkommen. */
const DEUTSCHE_SPUR =
  /[äöüß]|\b(bitte|nicht|noch|nochmal|kein|keine|keinen|der|die|das|den|dem|ein|eine|einen|ist|sind|war|wurde|kann|konnte|hat|haben|und|oder|aber|für|mit|ohne|zu|zum|zur|vom|beim|im|am|auf|dein|deine|du|dich|dir|es|schon|mehr|gibt|wir|uns)\b/i

/**
 * Sieht dieser Text nach Maschine aus?
 *
 * Bewusst zurückhaltend: unterdrückt wird nur, was sich positiv als
 * Maschinentext erkennen lässt. Ein kurzer deutscher Satz ohne Umlaut
 * („Keine Datei") läuft durch — lieber eine knappe eigene Meldung zu viel
 * als eine gute Meldung verschluckt. Erst ab 40 Zeichen ohne jede deutsche
 * Spur gilt ein Text auch ohne weitere Indizien als fremd.
 */
export function istTechnisch(text: string): boolean {
  const t = text.trim()
  if (!t) return true
  if (TECHNISCHE_ZEICHEN.test(t)) return true
  if (ENGLISCHE_WOERTER.test(t)) return true
  if (t.length > 40 && !DEUTSCHE_SPUR.test(t)) return true
  return false
}

/** Holt den Meldungstext aus dem, was an einer Fehlerstelle so ankommt:
 *  Error, String, Supabase-Fehlerobjekt, JSON-Antwort `{ error: … }`. */
function rohtext(roh: unknown): string {
  if (!roh) return ''
  if (typeof roh === 'string') return roh
  if (roh instanceof Error) return roh.message
  if (typeof roh === 'object') {
    const o = roh as Record<string, unknown>
    for (const feld of ['error', 'message', 'msg', 'details', 'hint']) {
      const wert = o[feld]
      if (typeof wert === 'string' && wert.trim()) return wert
    }
  }
  return ''
}

/**
 * Macht aus allem, was an einer Fehlerstelle ankommt, einen Satz, den man
 * einem Handwerker zeigen kann.
 *
 * - Bekannte Ursache  → der passende Satz mit nächstem Schritt
 * - Maschinentext     → `fallback` (der Satz der aufrufenden Stelle)
 * - eigener Text      → unverändert; unsere Meldungen sind schon deutsch
 *
 * @param roh      Error, String oder Antwortobjekt
 * @param fallback Was stattdessen dasteht, wenn `roh` nichts Zeigbares ist
 */
export function nutzerFehler(roh: unknown, fallback: string = FEHLER_STANDARD): string {
  const text = rohtext(roh).trim()
  if (!text) return fallback
  for (const regel of REGELN) {
    if (regel.muster.test(text)) return regel.text
  }
  return istTechnisch(text) ? fallback : text
}
