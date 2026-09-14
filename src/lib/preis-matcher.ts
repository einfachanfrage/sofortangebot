import { aufwandSperre } from './preis-aufwandswoerter.ts'
import { standardFamilie } from './katalog-standard.ts'

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
  /**
   * Gesetzt, wenn der Treffer aus einer Standardzeile kommt, weil der Titel
   * sich nicht festgelegt hat (siehe `katalog-standard.ts`). Der Text gehört
   * in die `annahmen` der Position — er wird im Entwurf angezeigt und steht
   * bewusst nicht auf dem Kunden-PDF.
   */
  annahme?: string
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

/**
 * Die Qualitäts-/Ausführungsstufe aus dem ROHTITEL — bewusst vor jeder
 * Normalisierung.
 *
 * ── PM-018, Prüfmeister 04.09.2026 ────────────────────────────────────────
 * „Spachtelarbeiten Q3" (39,00 m²) bekam 9,00 €/m² — den **Q2**-Preis. Die
 * Decken-Zeile „Spachtelarbeiten Q3 Decke" bekam gar keinen Treffer. Der
 * Widerspruch war der Beweis: Fehlt Q3 in der Preisliste, MÜSSTEN beide
 * „Preis fehlt" zeigen. Dass eine 9,00 € bekam, heißt, sie ist auf den
 * Q2-Eintrag ausgewichen. 195,00 € für Arbeit, die der Betrieb nachweislich
 * macht.
 *
 * Zwei Ursachen, beide in der Normalisierung:
 *   1. `STOPP` wirft q1–q4 weg — für den Vergleich sahen Q2 und Q3 gleich aus.
 *   2. Im Katalog steht die Stufe in KLAMMERN („Fläche spachteln (Q2)"), und
 *      Klammerinhalte werden ersatzlos entfernt. Selbst ohne (1) wäre die
 *      Stufe auf der Katalogseite verschwunden.
 * Deshalb wird sie hier am Rohtext gelesen und als FILTER benutzt, nicht als
 * Textmerkmal — dann stört sie den Score nicht und kann trotzdem nicht
 * übergangen werden.
 *
 * Die Regel des Prüfmeisters, wörtlich: „Trägt eine Position eine Qualitäts-
 * oder Ausführungsstufe im Titel, darf der Preis-Matcher niemals auf einen
 * Eintrag mit einer anderen Stufe ausweichen. Lieber sichtbar kein Preis als
 * still der falsche." Ein Eintrag OHNE Stufe ist keine andere Stufe — er darf
 * einspringen, genau wie bei den Anstrichzahlen (Regel 3).
 */
export function qStufeAusTitel(text: string): string | null {
  return /\bq([1-4])\b/i.exec(text ?? '')?.[1] ?? null
}

/**
 * Die Anstrichzahl (1x/2x/3x) aus dem ROHTITEL — bewusst wie die Q-Stufe
 * darüber am ungeschnittenen Text, siehe die Begründung in
 * `findePreisposition`. Erkennt „2x", „2×", „2 x" und „zweifach".
 */
export function anstrichzahlAusTitel(text: string): string | undefined {
  const roh = (text ?? '').toLocaleLowerCase('de-DE').replace(/×/g, 'x')
  const zahl = /\b([123])\s*x\b/.exec(roh)?.[1]
  if (zahl) return zahl
  if (/\beinfach\b|\b1fach\b/.test(roh)) return '1'
  if (/\bzweifach\b|\b2fach\b/.test(roh)) return '2'
  if (/\bdreifach\b|\b3fach\b/.test(roh)) return '3'
  return undefined
}

/** Flächen-Suffix, das die Engine an den Titel hängt („… Q3 Decke"). */
const FLAECHEN_SUFFIX = /\s+(decke|wand|w[äa]nde|boden)\s*$/i

function normalisiereEinheit(einheit: string): string {
  const e = einheit.toLocaleLowerCase('de-DE').replace(/²/g, '2').replace(/\s/g, '')
  if (['m2', 'qm'].includes(e)) return 'm2'
  if (['lfdm', 'lfm', 'm'].includes(e)) return 'lfdm'
  if (['stk', 'stück', 'stuck'].includes(e)) return 'stuck'
  if (['pauschal', 'pauschale'].includes(e)) return 'pauschale'
  if (['std', 'stunde', 'stunden'].includes(e)) return 'stunde'
  return e
}

// ── CoS-E-038 / TN-094 (Manfred, 11.09.2026) ───────────────────────────────
//
// Manfred: „Fischer-Angebot: Wände 2x für 9,50 €/m². Krüger-Angebot: Wände 2x
// für 11,50 €/m². Gleicher Betrieb, gleiche Position, zwei Preise. Preise
// werden irgendwo ausgewürfelt."
//
// Nachgestellt mit seinem echten Katalog: „Wandflächen streichen 2x" traf
// **„Kniestockwände streichen 2x" (11,50 €)** statt „Wand streichen 2x
// Anstrich" (9,50 €). Beide bekamen 0,94 — und bei Gleichstand gewann der
// alphabetisch erste, also K vor W.
//
// Die 0,94 kam aus dieser Enthaltensein-Regel, und zwar MITTEN IM WORT:
// Nach der Normalisierung heißt die gesuchte Position „flaeche streichen 2x",
// der Kniestock-Eintrag „kniestockflaeche streichen 2x" — und der enthält den
// gesuchten Text, weil „...stock|flaeche streichen 2x" zufällig an einer
// Wortmitte beginnt. Ein Kniestock ist aber eine andere Wandart, kein
// Spezialfall einer Wand.
//
// Die Enthaltensein-Regel bleibt — sie ist richtig für „Fassade streichen"
// gegen „Fassade streichen mit Silikatfarbe". Sie greift nur nicht mehr
// mitten im Wort. Ohne sie übernimmt die Token-Wertung und entscheidet
// richtig: 0,86 für den Wand-Eintrag gegen 0,67 für den Kniestock.
// Erster Anlauf war eine harte Wortgrenze — die Tests haben ihn zu Recht
// abgeräumt: Im Deutschen ist die Zusammensetzung der Normalfall, und
// „feinspachteln" enthält „spachteln" mitten im Wort und meint trotzdem
// dieselbe Arbeit (PM-018). Ein Mitten-im-Wort-Treffer ist also nicht
// falsch — er ist nur **schwächer** als einer, der an der Wortgrenze
// aufgeht. Genau diese Abstufung hat gefehlt: Vorher bekamen beide 0,94,
// und bei Gleichstand entschied die Sortierung.
//
//   „flaeche streichen 2x anstrich" enthält „flaeche streichen 2x" ab
//   Wortanfang            → 0,94
//   „kniestockflaeche streichen 2x" enthält es mitten im Wort → 0,90
//
// Damit gewinnt der Wand-Eintrag gegen den Kniestock-Eintrag, ohne dass
// irgendein bisher funktionierender Treffer unter die Schwelle (0,62) fällt.
function enthaeltAnWortgrenze(lang: string, kurz: string): boolean {
  const i = lang.indexOf(kurz)
  if (i === -1) return false
  const linksFrei = i === 0 || lang[i - 1] === ' '
  const rechtsFrei = i + kurz.length === lang.length || lang[i + kurz.length] === ' '
  return linksFrei && rechtsFrei
}

function tokenScore(a: string, b: string): number {
  if (a === b) return 1
  if (enthaeltAnWortgrenze(a, b) || enthaeltAnWortgrenze(b, a)) return 0.94
  if (a.includes(b) || b.includes(a)) return 0.90
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

  // ── Standardzeile vor allem anderen (Manfred, 12.09.2026) ────────────────
  //
  // Legt der Titel sich nicht fest („Tür lackieren", „Wärmedämmung
  // verlegen"), entschied bisher der Zufall der Wortüberlappung — und zwar
  // zugunsten des KÜRZESTEN Titels, nicht des sinnvollsten. Gemessen:
  // `Tür lackieren` → `Außentür lackieren beidseitig`, 110,00 € statt 45,00 €.
  //
  // Deshalb steht die Frage jetzt am Anfang, nicht am Ende: Gibt es für
  // diesen Begriff eine benannte Standardzeile, und hat der Betrieb sie?
  // Dann gilt sie, und die Annahme wird mitgegeben. Die Begründung je
  // Familie steht in `katalog-standard.ts`.
  //
  // Enthält der Titel eine Festlegung, liefert `standardFamilie` null und
  // hier passiert nichts — eine ausdrückliche Ansage darf ein Standard nie
  // überstimmen.
  const familie = standardFamilie(beschreibung)
  if (familie) {
    const standardZeile = preise.find(
      p => p.title === familie.standard && normalisiereEinheit(p.unit) === einheitNorm,
    )
    if (standardZeile) return { position: standardZeile, score: 1, annahme: familie.annahme }
  }

  // ── CoS-E-038 / TN-093 (Manfred, 11.09.2026) ─────────────────────────────
  //
  // Manfred: Katalog „Decke streichen 2x — 11,00 €", im Angebot stand
  // „Deckenfläche streichen — 2× Anstrich — 7,00 €". 7,00 € ist der **1x**-
  // Preis. Also genau das, was Regel 1 unten seit dem 24.08. ausschließen
  // soll: ein 2x-Auftrag darf nie einen 1x-Preis bekommen.
  //
  // Die Regel war nicht kaputt, sie kam nur nie zum Zug. Die Anstrichzahl
  // wurde aus dem NORMALISIERTEN Text gelesen, und der entsteht aus
  // `text.split(/\s+[—–-]\s+/)[0]` — alles nach dem Gedankenstrich fällt weg,
  // weil dort normalerweise der Raum steht („… — Wohnzimmer"). Bei dieser
  // Position stand hinter dem Strich aber die Anstrichzahl. Gesucht wurde
  // damit nach „decke streichen" ohne jede Variante, Regel 1 hatte nichts
  // zu vergleichen, und unter 1x/2x/3x gewann der erste — alphabetisch 1x.
  //
  // Die Anstrichzahl wird deshalb jetzt am ROHTITEL gelesen, genau wie die
  // Qualitätsstufe darunter und aus demselben, bereits festgehaltenen Grund
  // (siehe qStufeAusTitel): Sie ist ein FILTER, kein Textmerkmal. Wo im
  // Titel sie steht, darf nicht darüber entscheiden, ob sie gilt.
  //
  // Für die Q-Stufe fällt derselbe Schnitt weg — ein Raumname trägt kein
  // „Q3", der Split hat dort nie geschützt, nur verdeckt.
  const gesuchtAnstriche = anstrichzahlAusTitel(beschreibung)
  const gesuchteQ = qStufeAusTitel(beschreibung)

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
  // ── CoS-E-038, zweiter Teil: Gleichstand ──────────────────────────────────
  //
  // Hier stand kurzzeitig eine schärfere Regel: Bei Gleichstand mit
  // unterschiedlichen Preisen gar keinen Treffer liefern („lieber sichtbar
  // kein Preis als still der falsche", PM-018). Sie ist wieder raus, und
  // zwar aus einem Grund, der festgehalten gehört:
  //
  // Sie hat 13 bestehende Tests gerissen — vor allem die Anstrich-Familie.
  // Fragt die Engine nach „Wandflächen streichen" OHNE Anstrichzahl, stehen
  // 1x, 2x und 3x gleichauf und haben naturgemäß verschiedene Preise. Das
  // ist kein Würfeln, sondern eine Variantenfamilie, und sie pauschal
  // preislos zu machen hätte funktionierende Angebote kaputtgemacht.
  //
  // Manfreds „Preise werden ausgewürfelt" (TN-094) war außerdem gar kein
  // Zufall: Die Ursache waren die beiden Fehler darüber (verschluckte
  // Anstrichzahl, Kniestock schlägt Wand), beide nachgestellt und behoben.
  // Der Gleichstand entscheidet weiterhin nach der stabilen Sortierung der
  // Preisliste — gleiche Eingabe, gleicher Preis.
  //
  // Was DAMIT nicht gelöst ist, ehrlich gesagt: Zwei echte Doppeleinträge
  // mit verschiedenen Preisen (TN-095 — „gefühlt ein Drittel Varianten")
  // liefern weiterhin still einen davon. Die Antwort darauf ist, den Katalog
  // aufzuräumen, nicht den Matcher raten zu lassen. Steht als eigener Punkt.
  let besteMitVariante: Zuordnung | null = null
  let besteOhneVariante: Zuordnung | null = null

  for (const position of kandidatenListe) {
    if (normalisiereEinheit(position.unit) !== einheitNorm) continue
    const kandidat = normalisierePreistext(position.title)
    // Auch hier der Rohtitel: Ein Katalogeintrag „Wand streichen — 2x
    // Anstrich" verlöre seine Variante sonst genauso wie die gesuchte Seite.
    const kandidatAnstriche = anstrichzahlAusTitel(position.title)

    // Regel 1: andere Anstrichzahl → nie ein Treffer.
    if (gesuchtAnstriche && kandidatAnstriche && gesuchtAnstriche !== kandidatAnstriche) continue

    // Dieselbe Regel für die Qualitätsstufe: eine andere Stufe ist ein
    // anderer Arbeitsgang. Q3 ist Feinspachteln über die ganze Fläche, nicht
    // nur an den Stößen — wer das zum Q2-Preis anbietet, arbeitet umsonst.
    const kandidatQ = qStufeAusTitel(position.title)
    if (gesuchteQ && kandidatQ && gesuchteQ !== kandidatQ) continue

    // Aufwandswörter (Prüfmeister F.1, 12.09.2026) — dieselbe Bauweise wie
    // die Q-Stufe darüber: ein Filter am Rohtitel, kein Textmerkmal. Sperrt
    // in BEIDE Richtungen, und die zweite ist die wichtigere: Ein
    // Arbeitsgang im Katalogtitel, der im Auftrag nicht steht, sieht nach
    // mehr Geld aus — aber der Betrieb schuldet die Arbeit, die auf dem
    // Papier steht. Begründung und Wortliste in preis-aufwandswoerter.ts.
    const aufwand = aufwandSperre(beschreibung, position.title)
    if (aufwand?.grad === 'hart') continue

    const score = tokenScore(gesucht, kandidat)

    // Regel 2/3: variantenlose Kandidaten getrennt sammeln — sie kommen nur
    // zum Zug, wenn keine passende Variante über die Schwelle kommt.
    if (aufwand?.grad === 'nachrang' || (gesuchtAnstriche && !kandidatAnstriche) || (gesuchteQ && !kandidatQ)) {
      if (!besteOhneVariante || score > besteOhneVariante.score) besteOhneVariante = { position, score }
      continue
    }

    if (!besteMitVariante || score > besteMitVariante.score) besteMitVariante = { position, score }
  }

  if (besteMitVariante && besteMitVariante.score >= SCHWELLE) return besteMitVariante
  if (besteOhneVariante && besteOhneVariante.score >= SCHWELLE) return besteOhneVariante

  // PM-018, zweiter Teil des Fundes: „Spachtelarbeiten Q3 **Decke**" fand gar
  // keinen Treffer, „Spachtelarbeiten Q3" schon. Das Flächen-Suffix ist ein
  // zusätzliches Token und drückt die Übereinstimmung unter die Schwelle —
  // die Wand-Zeile lag bei 0,67, die Decken-Zeile bei 0,50.
  //
  // Zweiter Anlauf ohne das Suffix. Bewusst NUR als Rückfall und mit
  // unveränderter Stufen-Sperre: Die Decke bekommt damit denselben Preis wie
  // die Wand, wenn der Katalog keinen eigenen Deckeneintrag führt — aber
  // niemals den einer anderen Qualitätsstufe.
  const ohneSuffix = beschreibung.split(/\s+[—–-]\s+/)[0].replace(FLAECHEN_SUFFIX, '')
  if (ohneSuffix !== beschreibung.split(/\s+[—–-]\s+/)[0]) {
    return findePreisposition(ohneSuffix, einheit, preise)
  }
  return null
}
