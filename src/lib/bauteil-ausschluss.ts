// ── PM-099 (Prüfmeister, Sandys Live-Lauf 16.09.2026) ─────────────────────
//
// Gesagt: „Die 4 Innentüren mit Zargen abschleifen, grundieren und weiß
// lackieren. **An den Wänden machen wir nichts.**"
// Im Angebot standen trotzdem `Wand streichen 2x` (27,50 m²),
// `Voranstrich / Grundierung` (27,50 m²), `Boden schützen` (6,00 m²) und
// `Sockelleisten abkleben` (11,00 lfdm).
//
// Nachgemessen, nicht vermutet (16.09., über die volle Pipeline): Mit und
// ohne den Ausschlusssatz entsteht Zeichen für Zeichen dieselbe Liste — und
// auch bei „Die Wände bleiben wie sie sind." Der Satz wird an dieser Stelle
// nirgends gelesen.
//
// Der Auslöser sitzt eine Stufe davor: Die KI schreibt `waende_streichen` in
// die Raumdaten, obwohl der Ausschluss danebensteht. Diese Datei repariert
// das nicht — sie ist die **zweite Bremse**, die es bisher nicht gab. Sie
// greift NACH der Mengenberechnung und ist damit unabhängig davon, was in
// `raeume[].arbeiten` steht. Genau das ist der Punkt: Eine Ansage, die einmal
// überhört wird, kam bisher durch nichts mehr heraus.
//
// Verwandt, aber enger: `sockelleisten-ausschluss.ts` (PM-033) kennt genau
// EIN Bauteil, `raum-ausschluss.ts` (PM-034) einen ganzen RAUM. Dazwischen
// fehlte die Ebene „ein Bauteil in einem Raum". Die Satzmechanik ist
// dieselbe und kommt aus `satz-raum.ts`.

// `raumDerPosition` stand bis CoS-E-074 hier. Seit der Zeit-Ausschluss (DC-116)
// dieselbe Zuordnung braucht, steht sie in `satz-raum.ts` — zwei Kopien waeren
// zwei Wahrheiten, und sie waeren genau an der Stelle auseinandergedriftet,
// an der die Raumnamen im Positionstitel stehen.
import { saetzeMitRaum, raumDerPosition } from './satz-raum'
import type { SatzMitRaum } from './satz-raum'

export type Bauteil = 'wand' | 'decke' | 'boden' | 'tuer' | 'fenster' | 'heizkoerper'

/**
 * Wie der Handwerker das Bauteil nennt.
 *
 * ACHTUNG, in diesem Projekt schon einmal teuer bezahlt (siehe
 * `sockelleisten-ausschluss.ts`): `\b` funktioniert VOR einem Umlaut nicht —
 * ohne u-Flag zählt „ü" nicht als Wortzeichen. Hier steht deshalb nirgends
 * ein `\b` direkt vor einem Umlaut; die Wörter beginnen alle mit einem
 * normalen Buchstaben.
 */
const SATZ_WORT: Array<[Bauteil, RegExp]> = [
  ['wand',        /\bw[äa]nd(?:e|en)?\b/i],
  ['decke',       /\bdecke(?:n)?\b/i],
  ['boden',       /\bb[öo]den\b|\bfu(?:ß|ss)b[öo]den\b/i],
  ['tuer',        /\bt[üu]r(?:e|en)?\b|\bzarge(?:n)?\b/i],
  ['fenster',     /\bfenster\b/i],
  ['heizkoerper', /\bheizk[öo]rper\b/i],
]

/** Wie das Bauteil im Positionstitel steht (Katalogwörter). */
const POSITION_WORT: Record<Bauteil, RegExp> = {
  wand:        /\bw[äa]nd/i,
  decke:       /\bdecke/i,
  boden:       /\bboden|\bfu(?:ß|ss)boden/i,
  tuer:        /\bt[üu]r/i,
  fenster:     /\bfenster/i,
  heizkoerper: /heizk[öo]rper/i,
}

/**
 * Folgepositionen: Schutz, Abkleben, Vorarbeit. Sie tragen keinen eigenen
 * Auftrag — sie entstehen, WEIL eine Fläche gestrichen oder tapeziert wird.
 * Fällt die Fläche weg, fallen sie mit.
 *
 * `grundierung` bewusst als Hauptwort: „Türen grundieren" ist eine eigene
 * Leistung an einem anderen Bauteil und darf hier nicht hineinrutschen.
 */
const FOLGE = /sch[üu]tz|abdeck|abkleb|abdeckfolie|abdeckvlies|voranstrich|grundierung|isoliergrund|vorstreich/i

/** Verneint ausdrücklich. */
const STARKE_NEGATION = /\bkein(?:e|en|er|em)?\b|\bohne\b|\bnicht\b/i
/** Verneint schwächer („machen wir nichts"). */
const SCHWACHE_NEGATION = /\bnichts\b|\bnix\b|unber[üu]hrt|verzicht|\bso lassen\b|\bdran lassen\b|ausgenommen|au(?:ß|ss)en vor/i
/** „bleibt/bleiben so, wie sie sind". */
const BLEIBT = /\bbleib(?:t|en|st)?\s+(?:so|wie|unver|liegen|drin|dran|stehen|h(?:ä|a)ngen)/i
/** Gegenprobe: „bleiben nicht" ist kein Ausschluss, sondern das Gegenteil. */
const BLEIBT_NICHT = /bleib(?:t|en)\s+(?:aber\s+|leider\s+)?nicht|nicht\s+bleib/i
/** Eine Tätigkeit — egal ob beauftragt oder verneint. */
const TAETIGKEIT = /streich|lackier|tapezier|spachtel|schleif|grundier|verputz|verleg|montier|erneuer|tapete|anstrich|beschicht|f[üu]llen|glätten|glaetten/i
/** Ausschluss gilt für den ganzen Auftrag, nicht für einen Raum. */
const UEBERALL = /[üu]berall|generell|insgesamt|nirgend|in allen r[äa]umen|\bwohnung\b/i

/**
 * Der Anstrich ohne das Wort dafür: „Wände und Decke zweimal weiß."
 *
 * Gemessen (PM-134, 21.09.2026, am echten Projektstand): In diesem Teilsatz
 * findet `TAETIGKEIT` oben NICHTS — kein „streichen", kein „Anstrich". Die
 * Mengen-Erkennung eine Stufe davor sieht den Auftrag sehr wohl
 * (`extraktion-pipeline.ts`: `/streich|anstrich|weiß|weiss/`) und schreibt
 * `Wand streichen 2x` auf das Blatt — nur die Gegenprobe hier kannte ihn
 * nicht. Ohne diese Zeile hätte die Satzgrenze unten nichts zu finden.
 *
 * Bewusst ENGER als dort: `weiß` allein ist auch die Gegenwart von „wissen"
 * („ich weiß nicht, ob die Wände drankommen"). Verlangt wird deshalb die
 * Zahlangabe unmittelbar davor — „zweimal weiß", „2x weiß", „dreimal in
 * Weiß". Vor dem Verb „weiß" steht nie ein Zahlwort, und genau das trennt
 * die beiden Fälle. Andere Farben bleiben draußen, bis sie gemessen sind.
 *
 * `\b` steht hier NICHT hinter `weiß` — ß ist ohne u-Flag kein Wortzeichen,
 * die Grenze gäbe es also nach „weiß " gar nicht (dieselbe Falle wie oben bei
 * `SATZ_WORT`). Der Negativ-Ausblick tut, was gemeint ist.
 */
const ANSTRICH_OHNE_TAETIGKEITSWORT =
  /(?:\b(?:ein|zwei|drei|vier)\s*-?\s*mal|\b\d+\s*(?:x|mal))\s+(?:in\s+)?wei(?:ß|ss)(?![a-zäöüß])/i

/** Verneint dieser Teilsatz — egal auf welchem der drei Wege? */
function istVerneint(teil: string): boolean {
  return STARKE_NEGATION.test(teil) || SCHWACHE_NEGATION.test(teil) || BLEIBT.test(teil)
}

/** Steht in diesem Teilsatz eine Arbeit — egal ob beauftragt oder verneint? */
function istTaetigkeit(teil: string): boolean {
  return TAETIGKEIT.test(teil) || ANSTRICH_OHNE_TAETIGKEITSWORT.test(teil)
}

/** Ein Teilsatz samt Raum und den Bauteilen, für die dort ein Auftrag steht. */
interface TeilsatzLage extends SatzMitRaum {
  auftraege: Set<Bauteil>
}

/**
 * Eine einzelne Ausschluss-Stelle: WO, WAS, und WORAUF sie sich stützt.
 *
 * PD-024 (Prüfmeister, 21.09.2026) / DC-135: `belege` sagt nur, welche Sätze
 * überhaupt gegriffen haben — flach, ohne Raum und ohne Bauteil. Damit lässt
 * sich später nicht mehr entscheiden, ob ein bestimmter Satz wirklich eine
 * Zeile gekostet hat, und ein Hinweis über ein Bauteil, das gar nicht im
 * Angebot stand, wäre Lärm. Deshalb dieselbe Feststellung noch einmal, nur
 * nicht mehr flach.
 */
export interface BauteilAusschlussStelle {
  /** Raumname, oder `null` wenn der Satz für den ganzen Auftrag gilt. */
  raum: string | null
  /** Die in diesem Satz abbestellten Bauteile. */
  bauteile: Bauteil[]
  /** Der Satz, auf den sich das stützt. */
  satz: string
}

/** Für einen Raum (oder global) abbestellte Bauteile. */
export interface BauteilAusschluss {
  /** Bauteile, die im ganzen Auftrag abbestellt sind. */
  global: Set<Bauteil>
  /** Raumname → abbestellte Bauteile in diesem Raum. */
  jeRaum: Map<string, Set<Bauteil>>
  /** Die Sätze, auf die sich das stützt — für sichtbare Hinweise. */
  belege: string[]
  /** Dieselben Sätze mit Raum und Bauteil (PD-024/DC-135). */
  hinweise: BauteilAusschlussStelle[]
  /**
   * PM-136: Ausschluss-Sätze, die KEINEM Raum zuzuordnen waren — sie haben
   * nichts weggenommen und stehen deshalb weder in `global` noch in `jeRaum`.
   * `raum` ist bei ihnen immer `null`; sie tragen nur Bauteil und Beleg.
   */
  unklar: BauteilAusschlussStelle[]
}

function bauteileImSatz(satz: string): Bauteil[] {
  return SATZ_WORT.filter(([, r]) => r.test(satz)).map(([b]) => b)
}

/**
 * Erkennt abbestellte Bauteile.
 *
 * Die Gegenprobe, die diese Bremse davon abhält, zu viel wegzunehmen:
 * Ein Bauteil, für das ein Auftrag steht, wird nicht ausgeschlossen.
 * „Die Wände nicht tapezieren, nur streichen." nennt die Wand im ersten
 * Teilsatz, der zweite trägt sie weiter und beauftragt — also kein
 * Ausschluss. „Decke streichen, an den Wänden nichts." beauftragt dagegen
 * ein ANDERES Bauteil; der Wand-Ausschluss bleibt stehen.
 *
 * ── PM-135 (21.09.2026) · Die Gegenprobe liest nur noch nach vorn ───────
 *
 * Bis dahin fragte sie den GANZEN Satz ab: steht darin irgendwo ein Auftrag
 * für das Bauteil, fällt der Ausschluss aus — auch wenn der Auftrag VOR ihm
 * steht und er ihn gerade zurücknimmt.
 *
 *   „Wände streichen, im Wohnzimmer an den Wänden nichts."
 *
 * Mit einem Punkt statt des Kommas greift derselbe Ausschluss (379,05 €),
 * mit dem Komma fiel er ganz aus (844,95 €): 465,90 € Wandarbeit standen auf
 * dem Angebot, die der Kunde abbestellt hatte. Ein Zeichen Unterschied im
 * Diktat, und das Geld läuft GEGEN DEN KUNDEN.
 *
 * Die Gegenprobe zählt deshalb nur noch Aufträge aus dem Teilsatz des
 * Ausschlusses und den Teilsätzen DANACH. Der Schutzfall bleibt unberührt:
 * in „nicht tapezieren, nur streichen" steht der Auftrag HINTER der
 * Verneinung und hebt sie weiter auf. Das jüngere Wort gewinnt, und
 * „jünger" heißt hier: weiter hinten im Satz.
 *
 * ⚠ Die Satzgrenze bleibt, wo sie war. Ein Auftrag im NÄCHSTEN Satz zählt
 * weiter nicht — das ist PM-134 und ein eigener Bauauftrag, weil er ohne
 * eine Raumgrenze nicht zu haben ist: ein Auftrag im Flur dürfte einen
 * Ausschluss im Wohnzimmer nicht aufheben. Hier ist davon bewusst NICHTS
 * vorweggenommen.
 */
export function erkenneBauteilAusschluss(
  text: string,
  raumNamen: string[] = [],
): BauteilAusschluss {
  const global = new Set<Bauteil>()
  const jeRaum = new Map<string, Set<Bauteil>>()
  const belege: string[] = []
  const hinweise: BauteilAusschlussStelle[] = []
  const unklar: BauteilAusschlussStelle[] = []
  if (!text) return { global, jeRaum, belege, hinweise, unklar }

  // 1. Je TEILSATZ die Lage festhalten: Raum, und für welche Bauteile dort ein
  //    AUFTRAG steht. Ein Teilsatz ohne eigenes Bauteil trägt das zuletzt
  //    genannte weiter; über die Satzgrenze hinweg wird nichts getragen.
  //
  //    PM-135: bis dahin wurde je SATZ EINE Menge gebildet. Sie sagte, DASS im
  //    Satz ein Auftrag steht, aber nicht mehr, WO — und damit ließ sich ein
  //    Auftrag vor der Verneinung nicht von einem dahinter unterscheiden.
  //
  //    PM-134: der Text wird nur noch EINMAL zerlegt. Bis hierhin lief er
  //    zweimal durch — hier durch `saetze()`/`teilsaetze()`, unten durch
  //    `saetzeMitRaum()` — und die Stelle im Satz wurde unten mitgezählt, um
  //    beide Listen wieder zur Deckung zu bringen. Zwei Zerlegungen sind zwei
  //    Wahrheiten; und die Gegenprobe braucht ab jetzt den RAUM des Auftrags,
  //    den es nur in `saetzeMitRaum()` gibt.
  const lagen: TeilsatzLage[] = []
  {
    let getragen: Bauteil[] = []
    let letzterSatz = -1
    for (const stelle of saetzeMitRaum(text, raumNamen)) {
      if (stelle.satzIndex !== letzterSatz) { getragen = []; letzterSatz = stelle.satzIndex }
      const eigene = bauteileImSatz(stelle.satz)
      if (eigene.length > 0) getragen = eigene
      const auftraege = new Set<Bauteil>()
      if (!istVerneint(stelle.satz) && istTaetigkeit(stelle.satz)) {
        for (const b of getragen) auftraege.add(b)
      }
      lagen.push({ ...stelle, auftraege })
    }
  }

  // ── PM-136 (21.09.2026) · Wann ist ein Ausschluss ohne Raumnamen GERATEN? ──
  //
  // „Flur … Wände streichen. Wohnzimmer … Wände streichen. An den Wänden
  // machen wir nichts." — der letzte Satz nennt keinen Raum. Bis hierhin erbte
  // er den zuletzt genannten (Wohnzimmer); der Flur behielt seine Wand.
  // Gemeint ist erkennbar „nirgends", entschieden hat es die Reihenfolge der
  // Räume im Diktat. Das ist geraten, und der Satz dieser Datei lautet:
  // eine Bremse, die rät, ist schlimmer als keine.
  //
  // ⚠ Die Vererbung als solche ist RICHTIG und bleibt. Gemessen am echten
  // Prüfstand (PM-099, „der Ausschluss gilt nur für seinen Raum"):
  //
  //   „Wohnzimmer … Wände zweimal streichen. Flur, 4 mal 1,50, Höhe 2,50.
  //    An den Wänden machen wir nichts."
  //
  // Auch hier nennt der Ausschlusssatz keinen Raum und auch hier sind vorher
  // zwei Räume gefallen — trotzdem ist nichts zu raten: der Flur ist gerade
  // aufgemacht worden, der Ausschluss IST sein Inhalt. Eine Regel, die nur
  // Sätze und Raumnamen zählt, hätte diesen Fall mitgenommen und die Bremse
  // still abgeschaltet. (Erst beim Messen aufgefallen, nicht beim Lesen.)
  //
  // Der Unterschied liegt nicht im Ort des Ausschlusses, sondern in dem, was
  // vorher BESTELLT wurde: Steht für dasselbe Bauteil in MEHREREN Räumen ein
  // ausdrücklicher Auftrag, dann widerspricht der Ausschluss mehr als einem
  // davon und die Vererbung greift sich einen heraus. Steht der Auftrag nur
  // in einem Raum (oder in keinem), gibt es nichts zu raten.
  //
  // Zwei Grenzen also, und beide werden unten festgehalten:
  //
  //   1. Es zählt der ganze SATZ, nicht der Teilsatz. „Wohnzimmer, 4 mal 5,
  //      an den Wänden nichts" nennt den Raum eine Kommastelle vorher — das
  //      ist dieselbe Ansage, nicht eine zweite.
  //   2. Für das fragliche BAUTEIL müssen vorher in mindestens ZWEI Räumen
  //      Aufträge gefallen sein.
  //
  // Ausdrücklich NICHT „dann eben global": das wäre genauso geraten, nur in
  // die andere Richtung. Der Satz nimmt dann gar nichts weg und wird als
  // Rückfrage sichtbar (`unklar` → Hinweiszeile → Banner).
  const satzNenntRaum = new Set<number>()
  for (const lage of lagen) if (lage.raumImSatz) satzNenntRaum.add(lage.satzIndex)

  /** In wie vielen verschiedenen Räumen ist `b` bis Teilsatz `bis` beauftragt? */
  const raeumeMitAuftragBis = (bis: number, b: Bauteil): number => {
    const gesehen = new Set<string>()
    for (let k = 0; k <= bis; k += 1) {
      const lage = lagen[k]
      if (!lage.auftraege.has(b)) continue
      const ziele = lage.raeumeImSatz.length > 0
        ? lage.raeumeImSatz
        : (lage.raum === null ? [] : [lage.raum])
      for (const z of ziele) gesehen.add(z)
    }
    return gesehen.size
  }

  /**
   * Die Gegenprobe: welche Bauteile sind ab der Stelle `ab` noch ausdrücklich
   * beauftragt? Was hier steht, wird nicht ausgeschlossen — das jüngere Wort
   * gewinnt.
   *
   * Der eigene Teilsatz ist bewusst mitgezählt und kostet nichts: er ist
   * verneint (sonst stünde dort kein Ausschluss), und ein verneinter Teilsatz
   * trägt oben eine leere Menge bei.
   *
   * ── PM-134 (21.09.2026) · zwei Grenzen statt einer ──────────────────────
   *
   * Bis hierhin endete die Gegenprobe am Satzende. „An den Wänden machen wir
   * nichts. Wände und Decke zweimal weiß." — die Selbstkorrektur mitten im
   * Diktat — verlor deshalb 356,25 € Wandarbeit, obwohl der Handwerker sie
   * einen Satz später ausdrücklich bestellt hat.
   *
   * Die Satzgrenze fällt, aber sie fällt nicht ersatzlos: An ihre Stelle tritt
   * die RAUMGRENZE. Ein Auftrag im Flur darf einen Ausschluss im Wohnzimmer
   * nicht aufheben — ohne diese zweite Grenze wäre die erste nicht zu haben,
   * weil ein Diktat mit mehreren Räumen sonst jeden Ausschluss von hinten
   * aufräumt. Gezählt wird ein späterer Teilsatz deshalb nur, wenn er
   * DENSELBEN Raum meint (`raeumeImSatz` deckt „in Flur und Wohnzimmer" mit ab).
   *
   * ⚠ Ein GLOBALER Ausschluss („überall", oder gar kein Raum bekannt) behält
   * die alte Satzgrenze. Grund: Er hat keinen Raum, gegen den sich prüfen
   * ließe, und ein Auftrag für EINEN Raum würde ihn sonst für ALLE aufheben —
   * aus einer Bremse, die zu viel nimmt, würde eine, die zu wenig nimmt.
   * Die richtige Antwort dafür ist ein Teil-Aufheben, und das ist nicht
   * gemessen. Hier ist davon bewusst nichts vorweggenommen.
   */
  const auftraegeAb = (ab: number, zielRaum: string | null): Set<Bauteil> => {
    const menge = new Set<Bauteil>()
    const nurEigenerSatz = zielRaum === null
    for (let k = ab; k < lagen.length; k += 1) {
      const lage = lagen[k]
      if (nurEigenerSatz && lage.satzIndex !== lagen[ab].satzIndex) break
      if (!nurEigenerSatz && lage.raum !== zielRaum && !lage.raeumeImSatz.includes(zielRaum)) continue
      for (const b of lage.auftraege) menge.add(b)
    }
    return menge
  }

  // 2. Ausschluss-Teilsätze lesen — mit der Raumzuordnung aus `satz-raum.ts`.
  for (let i = 0; i < lagen.length; i += 1) {
    const { satz, raum, raumImSatz } = lagen[i]

    if (BLEIBT_NICHT.test(satz)) continue
    if (!istVerneint(satz)) continue

    const istGlobal = UEBERALL.test(satz) || (!raumImSatz && raum === null)
    // PM-136: Ein geerbter Raum ist nur dann geraten, wenn für DIESES Bauteil
    // vorher in mehreren Räumen ein Auftrag stand (siehe oben). Die Frage
    // stellt sich deshalb je Bauteil, nicht je Satz.
    const geerbt = !istGlobal && !raumImSatz && !satzNenntRaum.has(lagen[i].satzIndex)
    // Ein unzuordenbarer Satz hat keinen Raum, gegen den sich die Gegenprobe
    // prüfen ließe — sie bleibt deshalb beim eigenen Satz, wie beim globalen.
    const auftraegeImSatz = auftraegeAb(i, null)
    const auftraegeImRaum = istGlobal ? auftraegeImSatz : auftraegeAb(i, raum as string)

    const treffer: Bauteil[] = []
    const trefferUnklar: Bauteil[] = []
    for (const b of bauteileImSatz(satz)) {
      if (geerbt && raeumeMitAuftragBis(i, b) >= 2) {
        if (!auftraegeImSatz.has(b)) trefferUnklar.push(b)
      } else if (!auftraegeImRaum.has(b)) {
        treffer.push(b)
      }
    }

    if (trefferUnklar.length > 0) {
      unklar.push({ raum: null, bauteile: [...trefferUnklar], satz: satz.trim() })
    }
    if (treffer.length === 0) continue

    belege.push(satz.trim())
    hinweise.push({
      raum: istGlobal ? null : (raum as string),
      bauteile: [...treffer],
      satz: satz.trim(),
    })
    for (const b of treffer) {
      if (istGlobal) global.add(b)
      else {
        const ziel = raum as string
        if (!jeRaum.has(ziel)) jeRaum.set(ziel, new Set<Bauteil>())
        jeRaum.get(ziel)!.add(b)
      }
    }
  }


  return { global, jeRaum, belege, hinweise, unklar }
}

export interface PositionFuerAusschluss {
  beschreibung: string
}

/**
 * Nimmt die Positionen heraus, die im Diktat ausdrücklich abbestellt wurden.
 *
 * Zwei Durchgänge, bewusst getrennt:
 *
 *   1. **Direkt** — der Positionstitel nennt das abbestellte Bauteil.
 *   2. **Folge** — Schutz, Abkleben, Vorarbeit. Die fallen NUR, wenn für
 *      denselben Raum danach keine Wand- und keine Deckenleistung mehr
 *      übrig ist. Bleibt die Decke beauftragt („Nur die Decke streichen,
 *      Wände bleiben wie sie sind"), bleibt auch `Boden schützen` stehen —
 *      dort wird ja gestrichen.
 *
 * Die Objekt-Identität bleibt erhalten (reines Filtern, kein Umkopieren) —
 * darauf stützt sich die Kennzeichnung `automatisch_ergaenzt` in
 * `vollstaendigkeit/index.ts`.
 */
export function entferneAusgeschlosseneBauteileMitHinweisen<T extends PositionFuerAusschluss>(
  positionen: T[],
  transkript: string,
  raumNamen: string[] = [],
): BauteilAusschlussErgebnis<T> {
  if (!transkript || positionen.length === 0) return { positionen, hinweise: [] }
  const namen = raumNamen.map(n => (n ?? '').trim()).filter(n => n.length >= 3)
  const a = erkenneBauteilAusschluss(transkript, namen)
  // PM-136: `unklar` nimmt nichts weg, muss aber gesagt werden — deshalb
  // steht es hier mit in der Abbruchbedingung.
  if (a.global.size === 0 && a.jeRaum.size === 0 && a.unklar.length === 0) {
    return { positionen, hinweise: [] }
  }

  /** Welche Bauteile sind für diese Position abbestellt? */
  const verbotIn = (raum: string | null): Set<Bauteil> => {
    const menge = new Set<Bauteil>(a.global)
    // Ohne Raum im Titel: nur wenn der Auftrag genau EINEN Raum hat, ist die
    // Zuordnung eindeutig. Bei mehreren Räumen wird nichts entfernt — eine
    // Bremse, die rät, ist schlimmer als keine.
    const ziel = raum ?? (namen.length === 1 ? namen[0] : null)
    if (ziel) for (const b of a.jeRaum.get(ziel) ?? []) menge.add(b)
    return menge
  }

  // ── Durchgang 1: direkt benanntes Bauteil ───────────────────────────────
  const nachDirekt = positionen.filter(p => {
    const titel = p.beschreibung ?? ''
    if (FOLGE.test(titel)) return true // erst im zweiten Durchgang
    const verboten = verbotIn(raumDerPosition(titel, namen))
    for (const b of verboten) if (POSITION_WORT[b].test(titel)) return false
    return true
  })

  // ── Durchgang 2: Folgepositionen ────────────────────────────────────────
  /** Räume, in denen nach Durchgang 1 noch eine Wand-/Deckenleistung steht. */
  const traegtNoch = new Set<string>()
  let traegtNochOhneRaum = false
  for (const p of nachDirekt) {
    const titel = p.beschreibung ?? ''
    if (FOLGE.test(titel)) continue
    if (!POSITION_WORT.wand.test(titel) && !POSITION_WORT.decke.test(titel)) continue
    const r = raumDerPosition(titel, namen)
    if (r) traegtNoch.add(r)
    else traegtNochOhneRaum = true
  }

  const geblieben = nachDirekt.filter(p => {
    const titel = p.beschreibung ?? ''
    if (!FOLGE.test(titel)) return true
    const r = raumDerPosition(titel, namen)
    const ziel = r ?? (namen.length === 1 ? namen[0] : null)
    if (!ziel) return true
    // Nur dort bremsen, wo überhaupt etwas abbestellt wurde.
    const verboten = verbotIn(r)
    if (!verboten.has('wand') && !verboten.has('decke')) return true
    if (traegtNoch.has(ziel) || (r === null && traegtNochOhneRaum)) return true
    return false
  })

  // ── PD-024 / DC-135: der Satz, der die Zeile genommen hat, wird sichtbar ──
  //
  // Nur für Ausschlüsse, die WIRKLICH etwas weggenommen haben. Ein Hinweis
  // über ein Bauteil, das ohnehin nicht im Angebot stand, wäre kein Hinweis,
  // sondern Lärm — und Lärm im Bernsteinbanner macht die echten Hinweise
  // unsichtbar (dieselbe Überlegung wie in DC-128, wo die Mängelliste
  // ausdrücklich draußen bleibt).
  const stehtNoch = new Set<T>(geblieben)
  const entfernt = positionen.filter(p => !stehtNoch.has(p))
  const hinweise: string[] = []
  for (const stelle of a.hinweise) {
    const hatGekostet = entfernt.some(p => {
      const titel = p.beschreibung ?? ''
      const r = raumDerPosition(titel, namen) ?? (namen.length === 1 ? namen[0] : null)
      // Ein globaler Satz nimmt überall; ein Raumsatz nur in seinem Raum.
      if (stelle.raum !== null && stelle.raum !== r) return false
      // Folgepositionen (Schutz, Abkleben, Vorarbeit) nennen das Bauteil
      // nicht im Titel — sie fallen trotzdem wegen dieses Satzes.
      if (FOLGE.test(titel)) return true
      return stelle.bauteile.some(b => POSITION_WORT[b].test(titel))
    })
    if (!hatGekostet) continue
    const zeile = bauteilAusschlussHinweis(stelle.raum, stelle.bauteile, stelle.satz)
    if (!hinweise.includes(zeile)) hinweise.push(zeile)
  }

  // ── PM-136 · die Rückfrage ─────────────────────────────────────────────
  //
  // Dieselbe Zurückhaltung wie darüber: gefragt wird nur zu einem Bauteil,
  // das im Angebot überhaupt vorkommt. Eine Rückfrage zu einer Wand, die auf
  // keinem Blatt steht, wäre kein Hinweis, sondern Lärm — und Lärm im
  // Bernsteinbanner macht die echten Hinweise unsichtbar (DC-128/PD-024).
  //
  // Geprüft wird gegen ALLE Positionen, nicht nur die gebliebenen: Ein
  // unzuordenbarer Satz nimmt ja gerade nichts weg, `geblieben` und
  // `positionen` tragen für ihn dasselbe.
  for (const stelle of a.unklar) {
    const betrifft = positionen.some(p => {
      const titel = p.beschreibung ?? ''
      return stelle.bauteile.some(bt => POSITION_WORT[bt].test(titel))
    })
    if (!betrifft) continue
    const zeile = bauteilUnklarHinweis(stelle.bauteile, stelle.satz)
    if (!hinweise.includes(zeile)) hinweise.push(zeile)
  }

  return { positionen: geblieben, hinweise }
}

/**
 * Dieselbe Bremse ohne die Hinweise — der Weg, den es seit PM-099 gibt.
 * Bleibt als eigene Funktion stehen, damit kein Aufrufer, der nur filtern
 * will, ein Ergebnisobjekt auspacken muss.
 */
export function entferneAusgeschlosseneBauteile<T extends PositionFuerAusschluss>(
  positionen: T[],
  transkript: string,
  raumNamen: string[] = [],
): T[] {
  return entferneAusgeschlosseneBauteileMitHinweisen(positionen, transkript, raumNamen).positionen
}

// ── PD-024 / DC-135 · Die stumme Bremse bekommt eine Stimme ────────────────
//
// Gemessen, PD-024 (Prüfmeister, 21.09.2026, abends):
//
//   gesagt:        „Flur … An den Wänden machen wir nichts. Wände und Decke
//                   zweimal weiß."
//   auf dem Blatt: Decke streichen 2x, Boden schützen, Sockelleisten —
//                  zusammen 121,80 €
//   nicht mehr da: die Wand, 37,50 m², 356,25 €
//
// Die Bremse oben tut das RICHTIGE. Sie tut es nur vollkommen stumm: Es gibt
// keinen Fehlt-Eintrag, keine Zeile, keinen Hinweis. Wer das Ergebnis liest,
// sieht nicht, dass dort einmal etwas stand.
//
// ── Wohin der Satz gehört — und wohin ausdrücklich nicht ──────────────────
//
// NICHT auf das Kundenpapier. Zwei Gründe, beide aus früheren Tickets:
//
//   1. DC-125 trennt Arbeitsansicht und Kundenpapier: das Papier trägt, was
//      angeboten wird und was es kostet. Ein Satz über etwas, das NICHT
//      angeboten wird, ist dort eine Ausschlussklausel — und wie die zu
//      formulieren ist, entscheidet Legal, nicht ein Gestaltungsticket.
//   2. Prüfen kann das ohnehin nur der Betrieb. Der Kunde weiß nicht, was
//      diktiert wurde; der Handwerker weiß es und muss sehen, ob die Bremse
//      RICHTIG gegriffen hat.
//
// Sondern in dieselbe Hinweisliste, in der seit DC-128 schon der zeitliche
// Ausschluss steht: `fehlende` → `warnungen` → das bernsteinfarbene Banner
// auf der Entwurfsseite. Gleiche Herkunft, gleiche Form, gleicher Ort —
// zwei Bremsen, die dasselbe tun, dürfen sich nicht verschieden anfühlen.
//
// Das „⚠ " am Anfang ist kein Schmuck, sondern die Kennzeichnung „Hinweis,
// keine Leistung": `mengen/mehrgewerk.ts` verwandelt sonst jeden
// `fehlende`-Eintrag in eine 0,00-€-Position — und genau dieser Satz hat auf
// dem Kundenpapier nichts verloren.

/** Wie das Bauteil in der Hinweiszeile steht (Wemfall, wie gesprochen). */
const BAUTEIL_WORT: Record<Bauteil, string> = {
  wand:        'an den Wänden',
  decke:       'an der Decke',
  boden:       'am Boden',
  tuer:        'an den Türen',
  fenster:     'an den Fenstern',
  heizkoerper: 'an den Heizkörpern',
}

/**
 * Feste Reihenfolge der Aufzählung.
 *
 * Nicht Geschmack: `Set` gibt die Einfügereihenfolge zurück, und die hängt
 * davon ab, in welcher Reihenfolge die Wörter im Satz stehen. Ohne feste
 * Reihenfolge stünde derselbe Ausschluss je nach Diktat einmal als
 * „an den Wänden und an der Decke" und einmal umgekehrt da — und die
 * Dublettenprüfung unten würde beide durchlassen.
 */
const BAUTEIL_REIHENFOLGE: Bauteil[] = ['wand', 'decke', 'boden', 'tuer', 'fenster', 'heizkoerper']

/**
 * Die Hinweiszeile. Ort, Bauteil UND Beleg-Satz — alle drei.
 *
 * Der Beleg ist kein Beiwerk (DC-116, wörtlich übernommen in DC-128): Der
 * Betrieb muss sehen, WORAUF sich das Weglassen stützt, sonst kann er nicht
 * beurteilen, ob die Bremse richtig gegriffen hat. „Arbeiten an den Wänden
 * sind nicht im Angebot" allein lässt offen, ob das Absicht war.
 */
function aufzaehlungDer(bauteile: Bauteil[]): string {
  const teile = BAUTEIL_REIHENFOLGE.filter(b => bauteile.includes(b)).map(b => BAUTEIL_WORT[b])
  return teile.length <= 1
    ? (teile[0] ?? 'an diesem Bauteil')
    : `${teile.slice(0, -1).join(', ')} und ${teile[teile.length - 1]}`
}

export function bauteilAusschlussHinweis(
  raum: string | null,
  bauteile: Bauteil[],
  satz: string,
): string {
  const ort = raum ? `„${raum}": ` : ''
  return `⚠ ${ort}Arbeiten ${aufzaehlungDer(bauteile)} sind nicht im Angebot — gesagt: „${satz}"`
}

// ── PM-136 · die zweite Sorte Zeile: die Rückfrage ─────────────────────────
//
// Sie sagt bewusst das GEGENTEIL der Zeile darüber: dort ist etwas aus dem
// Angebot genommen worden, hier ist ausdrücklich NICHTS genommen worden. Der
// Betrieb muss beides auf einen Blick unterscheiden können — sonst sucht er
// nach einer Zeile, die noch dasteht.
//
// Warum das keine eigene Bauart bekommt, sondern die Form der Nachbarzeile
// erbt: gleiche Herkunft, gleicher Ort, gleicher Beleg — die DC-128-Lehre
// „zwei Bremsen, die dasselbe tun, dürfen sich nicht verschieden anfühlen".
// Der Beleg-Satz steht auch hier hinten, und zwar unverzichtbar: ohne ihn
// weiß niemand, WELCHE Ansage gemeint ist.

export function bauteilUnklarHinweis(bauteile: Bauteil[], satz: string): string {
  return `⚠ Nicht eindeutig: Arbeiten ${aufzaehlungDer(bauteile)} — zu welchem Raum? `
    + `Es wurde nichts entfernt — gesagt: „${satz}"`
}

const BAUTEIL_UNKLAR_MUSTER =
  /^⚠\s*Nicht eindeutig:\s*Arbeiten ((?:an|am)\s[\s\S]+?) — zu welchem Raum\? Es wurde nichts entfernt\s+—\s+gesagt:\s*„([\s\S]+)"$/

export interface BauteilUnklarHinweis {
  /** Die Aufzählung, fertig gesetzt: „an den Wänden und an der Decke". */
  arbeiten: string
  /** Der Beleg-Satz aus dem Diktat. */
  satz: string
}

export function zerlegeBauteilUnklarHinweis(zeile: string): BauteilUnklarHinweis | null {
  const m = BAUTEIL_UNKLAR_MUSTER.exec((zeile ?? '').trim())
  if (!m) return null
  const arbeiten = m[1].trim()
  const satz = m[2].trim()
  if (arbeiten.length === 0 || satz.length === 0) return null
  return { arbeiten, satz }
}

/** Ist diese Hinweiszeile eine PM-136-Rückfrage? */
export function istBauteilUnklarHinweis(zeile: string): boolean {
  return zerlegeBauteilUnklarHinweis(zeile) !== null
}

/**
 * Derselbe Satzbau einmal rückwärts — dieselbe Bauweise wie
 * `zerlegeZeitAusschlussHinweis()` in `zeit-ausschluss.ts`.
 *
 * Die Zeile reist als EIN Stück Text bis auf den Bildschirm; das Banner
 * braucht sie in zwei Teilen (Aussage fett, Beleg als Zitat darunter).
 * Erzeuger und Leser stehen deshalb nebeneinander in einer Datei — die
 * DC-125-Lehre „eine Bedingung, drei Leser": Wer den Wortlaut oben ändert,
 * sieht diese Funktion beim Hinsehen.
 *
 * `null` heißt: keine Bauteil-Ausschluss-Zeile. Das Banner zeigt sie dann
 * unverändert als gewöhnlichen Hinweis — lieber der rohe Satz als ein
 * verschluckter.
 */
const BAUTEIL_HINWEIS_MUSTER =
  /^⚠\s*(?:„(.+?)":\s*)?Arbeiten ((?:an|am)\s[\s\S]+?) sind nicht im Angebot\s+—\s+gesagt:\s*„([\s\S]+)"$/

export interface BauteilAusschlussHinweis {
  /** Raumname, oder `null` bei einem Satz für den ganzen Auftrag. */
  raum: string | null
  /** Die Aufzählung, fertig gesetzt: „an den Wänden und an der Decke". */
  arbeiten: string
  /** Der Beleg-Satz aus dem Diktat. */
  satz: string
}

export function zerlegeBauteilAusschlussHinweis(zeile: string): BauteilAusschlussHinweis | null {
  const m = BAUTEIL_HINWEIS_MUSTER.exec((zeile ?? '').trim())
  if (!m) return null
  const arbeiten = m[2].trim()
  const satz = m[3].trim()
  if (arbeiten.length === 0 || satz.length === 0) return null
  const raum = m[1] === undefined ? null : m[1].trim()
  if (raum !== null && raum.length === 0) return null
  return { raum, arbeiten, satz }
}

/** Ist diese Hinweiszeile ein Bauteil-Ausschluss (PD-024/DC-135)? */
export function istBauteilAusschlussHinweis(zeile: string): boolean {
  return zerlegeBauteilAusschlussHinweis(zeile) !== null
}

/** Gefilterte Positionen samt der Hinweise, die das Filtern erklärt haben. */
export interface BauteilAusschlussErgebnis<T> {
  positionen: T[]
  hinweise: string[]
}
