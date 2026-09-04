export interface PreisPosition {
  id: string
  title: string
  category: string
  unit: string
  unit_price: number
}

export interface Zuordnung {
  position: PreisPosition
  score: number
}

const STOPP = new Set([
  'und', 'oder', 'mit', 'inkl', 'inklusive', 'auf', 'in', 'an', 'der', 'die', 'das',
  'ein', 'eine', 'pro', 'nach', 'vor', 'aus', 'bis', 'fur', 'je', 'gesamtflache',
  'q1', 'q2', 'q3', 'q4',
])

const SYNONYME: Array<[RegExp, string]> = [
  // PM-008: "Fassadenfläche streichen" (von der Mengen-Engine generiert) fand
  // KEINEN Preis, obwohl "Fassade streichen …" im Katalog existiert — die
  // Katalog-Titel matchen nur als Ganzes ("a.includes(b) || b.includes(a)")
  // oder per Token-Überlappung, und "fassadenflache" (ein zusammengesetztes
  // Wort ohne Leerzeichen) enthält "fassade" nicht als eigenes Token. Muss
  // VOR der generischen "wande?|flache"-Regel stehen, sonst wird "fassaden"
  // + "flache" zu "fassadenflaeche" verschmolzen statt zu "fassade" verkürzt.
  [/fassadenflachen?/g, 'fassade'],
  [/wandflachen?/g, 'wand'], [/deckenflachen?/g, 'decke'], [/bodenflachen?/g, 'boden'],
  [/schutzen|abdecken|abdeckvlies/g, 'abdecken'], [/aufziehen|tapezieren|kleben/g, 'tapezieren'],
  [/ablosen|entfernung|demontieren|aufnehmen/g, 'entfernen'],
  [/sockelleisten|fussleisten/g, 'sockelleiste'], [/laufende?n? meter|lfdm|lfm/g, 'lfdm'],
  [/stuck|stk/g, 'stuck'], [/pauschal(e)?/g, 'pauschale'],
  [/fertigparkett/g, 'parkett'], [/korkboden/g, 'kork'],
  [/parkettlack versiegeln/g, 'versiegelung'], [/klickvinyl|vinylboden|vinyl boden|designbelag|designboden/g, 'vinyl'],
  [/nadelvlies|textilbelag/g, 'teppich'], [/feuchtigkeitssperre/g, 'epoxidharz sperre'],
  [/lvt|spc|dryback|dry back|luxury vinyl/g, 'vinyl'],
  [/kautschukboden|kautschukbelag|gummiboden/g, 'gummibelag'],
  [/cushion vinyl|cv belag|pvc boden|pvc belag/g, 'pvc'],
  [/landhausdielen?|massivholzdielen?|holzdielen?/g, 'diele'],
  [/gripper|gripleiste|nagelleisten?/g, 'nagelleiste'],
  [/berliner leisten?|hamburger leisten?|fussleisten?/g, 'sockelleiste'],
  [/ausgleichsmasse|nivellieren|spachtelmasse/g, 'ausgleich'],
  [/voranstrich|grundierung/g, 'grundieren'],
  [/spachtelarbeiten?/g, 'spachteln'],
  // Trockenlauf 2026-08-30: „Dehnungsfuge einbauen" (Engine) fand den
  // Katalogeintrag „Dehnungsfuge mit Bewegungsprofil herstellen" nicht — im
  // Handwerkskatalog heißt dieselbe Leistung je nach Quelle einbauen,
  // herstellen oder anlegen. Für den Abgleich dasselbe Wort.
  [/\bherstellen\b|\banlegen\b|\bsetzen\b/g, 'einbauen'],
  [/bewegungsprofil|bewegungsfuge/g, 'dehnungsfuge'],
  [/glatten|glaetten/g, 'spachteln'],
  [/malervlies|renoviervlies|glattvlies/g, 'renoviervlies'],
  [/rauhfaser|raufasertapete/g, 'raufaser'],
  [/fototapete|digitaldrucktapete|motivtapete/g, 'fototapete'],
  [/grastapete|naturtapete|naturwerkstofftapete/g, 'naturwerkstofftapete'],
  [/lackieren|lackierung|lackanstrich/g, 'lackieren'],
  [/wande?|flache/g, 'flaeche'],
  [/zweifach|2fach|2x/g, '2x'], [/einfach|1fach|1x/g, '1x'],
]

export function normalisierePreistext(text: string): string {
  let wert = text
    .split(/\s+[—–-]\s+/)[0]
    .toLocaleLowerCase('de-DE')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/\binkl\.?\s+\d+(?:[.,]\d+)?\s*%\s*verschnitt\b/g, '')
    .replace(/\([^)]*\)/g, ' ')
    // PM-008: "×" (Multiplikationszeichen, z.B. "2× Anstrich" im Preiskatalog)
    // fiel bisher ersatzlos der nächsten Zeile zum Opfer (nicht a-z0-9 → Leerzeichen),
    // während generierte Positionen ein ASCII-"x" nutzen ("2x"). Beide Seiten
    // verloren dadurch das Anstriche-Signal aus der zweifach/2fach/2x-Regel unten
    // — hier vereinheitlichen, BEVOR nicht-alphanumerische Zeichen entfernt werden.
    .replace(/×/g, 'x')
    .replace(/[^a-z0-9]+/g, ' ')

  for (const [muster, ersatz] of SYNONYME) wert = wert.replace(muster, ersatz)
  return wert.split(/\s+/).filter(w => w && !STOPP.has(w)).join(' ').trim()
}

function normalisiereEinheit(einheit: string): string {
  const e = einheit.toLocaleLowerCase('de-DE').replace(/²/g, '2').replace(/\s/g, '')
  if (['m2', 'qm'].includes(e)) return 'm2'
  if (['lfdm', 'lfm', 'm'].includes(e)) return 'lfdm'
  if (['stk', 'stück', 'stuck'].includes(e)) return 'stuck'
  if (['pauschal', 'pauschale'].includes(e)) return 'pauschale'
  if (['std', 'stunde', 'stunden'].includes(e)) return 'stunde'
  return e
}

function tokenScore(a: string, b: string): number {
  if (a === b) return 1
  if (a.includes(b) || b.includes(a)) return 0.94
  const aa = new Set(a.split(' '))
  const bb = new Set(b.split(' '))
  const schnitt = [...aa].filter(t => bb.has(t)).length
  if (schnitt === 0) return 0
  const precision = schnitt / bb.size
  const recall = schnitt / aa.size
  return (2 * precision * recall) / (precision + recall)
}

export function findePreisposition(
  beschreibung: string,
  einheit: string,
  preise: PreisPosition[],
): Zuordnung | null {
  const gesucht = normalisierePreistext(beschreibung)
  const einheitNorm = normalisiereEinheit(einheit)
  const gesuchtAnstriche = gesucht.match(/\b([123])x\b/)?.[1]

  // Anstrich-Varianten (1x/2x/3x) — die Regeln, festgeklopft am 2026-08-24
  // (Sandys „klopf fest"), nachdem PM-007 gezeigt hat, wie teuer eine
  // ungeschriebene Regel wird:
  //
  //   1. Ein 2x-Auftrag bekommt NIE einen 1x-Preis (und umgekehrt). Lieber
  //      „Preis fehlt" und 0,00 € als eine Position, die zu billig im Angebot
  //      steht. Das ist die eine Regel, die nicht verhandelbar ist — sie
  //      schützt den Handwerker vor einer Kalkulation, die er nicht bemerkt.
  //   2. Gibt es zum gesuchten Anstrich eine passende Variante im Katalog,
  //      gewinnt sie gegen einen Eintrag ohne Anstrichzahl — auch wenn der
  //      rein textlich zufällig besser passt.
  //   3. Gibt es KEINE passende Variante, darf ein Eintrag ohne Anstrichzahl
  //      einspringen. Ein Katalogeintrag „Kniestockwände streichen" ohne
  //      Zusatz ist der eigene Preis des Betriebs für genau diese Arbeit —
  //      den zu ignorieren wäre keine Vorsicht, sondern Verlust.
  //
  // PM-007 (2026-08-24): Regel 2 war vorher GLOBAL formuliert — es genügte,
  // dass IRGENDEIN Katalogeintrag mit derselben Einheit ein „2x" trug, um
  // jeden variantenlosen Eintrag zu sperren. In Sandys Konto reichte das
  // unbeteiligte „Wand streichen 2x Anstrich", damit „Kniestockwände
  // streichen 2x" seinen eigenen Katalogpreis (11 €) nicht mehr fand und mit
  // 0,00 € im Angebot stand — während dieselbe Position mit „1x" sauber
  // matchte. Diese Asymmetrie war kein Vorsatz, sondern ein Fehler. Jetzt
  // wirkt Regel 2 dort, wo sie hingehört: zwischen den Kandidaten dieser
  // einen Suche, nicht über den ganzen Katalog.
  // ── CoS-043 (04.09.2026): Prozentsatz im Titel unterscheidet die Kandidaten
  //
  // Sieben Katalogeinträge heißen wortgleich „Zuschlag Wochenend- /
  // Feiertagsarbeit" und unterscheiden sich NUR im Prozentsatz — sechs mal
  // 25 %, beim Elektriker 50 %. Die Textnormalisierung wirft Klammern und
  // Zahlen weg, für den Matcher sahen alle sieben identisch aus, und es gewann
  // schlicht der erste. In einem Elektro-Angebot stand der Wochenendzuschlag
  // damit auf 25 % statt 50 % — die Hälfte, still, zulasten des Betriebs.
  //
  // In der Praxis fängt das meist der Gewerke-Filter vor dieser Funktion ab
  // (nur Elektro-Kategorien im Rennen). „Meist" ist hier aber zu wenig: Eine
  // manuell hinzugefügte Position bringt keinen Gewerke-Kontext mit. Deshalb
  // die Regel eine Ebene tiefer: Steht im gesuchten Titel ein Prozentsatz und
  // gibt es Kandidaten mit genau diesem Preis, kommen nur die in Frage.
  const gesuchterProzentsatz = einheitNorm === '%'
    ? Number(/\(?\s*(\d+(?:[.,]\d+)?)\s*%\s*\)/.exec(beschreibung)?.[1]?.replace(',', '.') ?? NaN)
    : NaN
  const passendeProzentKandidaten = Number.isFinite(gesuchterProzentsatz)
    ? preise.filter(p => normalisiereEinheit(p.unit) === einheitNorm && p.unit_price === gesuchterProzentsatz)
    : []
  const kandidatenListe = passendeProzentKandidaten.length > 0 ? passendeProzentKandidaten : preise

  const SCHWELLE = 0.62
  let besteMitVariante: Zuordnung | null = null
  let besteOhneVariante: Zuordnung | null = null

  for (const position of kandidatenListe) {
    if (normalisiereEinheit(position.unit) !== einheitNorm) continue
    const kandidat = normalisierePreistext(position.title)
    const kandidatAnstriche = kandidat.match(/\b([123])x\b/)?.[1]

    // Regel 1: andere Anstrichzahl → nie ein Treffer.
    if (gesuchtAnstriche && kandidatAnstriche && gesuchtAnstriche !== kandidatAnstriche) continue

    const score = tokenScore(gesucht, kandidat)

    // Regel 2/3: variantenlose Kandidaten getrennt sammeln — sie kommen nur
    // zum Zug, wenn keine passende Variante über die Schwelle kommt.
    if (gesuchtAnstriche && !kandidatAnstriche) {
      if (!besteOhneVariante || score > besteOhneVariante.score) besteOhneVariante = { position, score }
      continue
    }

    if (!besteMitVariante || score > besteMitVariante.score) besteMitVariante = { position, score }
  }

  if (besteMitVariante && besteMitVariante.score >= SCHWELLE) return besteMitVariante
  if (besteOhneVariante && besteOhneVariante.score >= SCHWELLE) return besteOhneVariante
  return null
}
