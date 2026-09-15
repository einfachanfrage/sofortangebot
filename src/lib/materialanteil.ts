// Der Materialanteil je Position — die dritte Zahl.
//
// CoS-E-053, Schritt 3 der Reihenfolge aus `docs/preisliste-konzept.md`
// (Fassung 3). Sie steht bewusst VOR dem Knopf an der Zeile.
//
// ── Warum es diese Datei gibt ───────────────────────────────────────────────
//
// Manfred, 14.09.2026: *„Wenn ich Material rausziehe, sind es nicht mehr 11,50
// für Wand 2x, sondern 8,50 plus Farbe. Das muss die App wissen, sonst hab ich
// Material doppelt."*
//
// Die App kannte bis hierher genau eine Zahl je Position: 11,50. Woher die
// 8,50 kommen sollen, stand nirgends. Ein Knopf „Material herausziehen" ohne
// diese Datei erzeugt eine Materialzeile UND lässt den vollen Preis in der
// Arbeitszeile stehen — doppelt berechnetes Material, und zwar in die
// Richtung, die der Kunde merkt, nicht der Betrieb.
//
// ── Absolut oder Anteil? ────────────────────────────────────────────────────
//
// Gespeichert wird ein **absoluter Betrag je Einheit**, kein Prozentsatz.
// Material kostet, was es kostet: Ein Liter Wandfarbe wird nicht teurer, weil
// der Betrieb einen höheren Stundensatz hat. Wer seinen Preis anhebt, hebt
// seine Arbeit an — der Materialanteil bleibt. Ein Prozentsatz würde bei jeder
// Preiserhöhung stillschweigend mitwachsen.
//
// Die **Herleitung** des Startwerts läuft dagegen über einen Anteil, weil die
// Faustregel des Prüfmeisters so formuliert ist: *„bei zwei Anstrichen liegt
// der Materialanteil innen bei rund einem Viertel des Quadratmeterpreises, nie
// über einem Drittel."* Der Anteil erzeugt die Zahl einmal; danach ist sie eine
// Zahl wie der Preis selbst und wird wie er geändert.
//
// Warum nicht direkt die fünf Euro-Werte des Prüfmeisters in den Katalog: Sie
// stammen von **Manfreds** Preisniveau (Wand 2x = 11,50), der Katalog steht bei
// 9,50. Ein absoluter Wert aus einer anderen Preiswelt wäre genau die stille
// Falschheit, die wir sonst überall wegräumen. Seine Zahlen sind deshalb hier
// nicht Vorlage, sondern **Prüfstein**: Der Test rechnet unsere Anteile gegen
// seine Preise und muss seine Beträge treffen.
//
// ── Was KEINEN Schalter bekommt ─────────────────────────────────────────────
//
// Manfred: *„Kleinmaterial — Trittschall, Kleber, Übergangsprofil — ist bei mir
// drin, das ist kein Material, das ist Zubehör."* Die Trennlinie, die trägt:
// **Material ist, was der Kunde aussuchen kann.** Tapete, Farbe, Belag,
// Fliese. Kleister, Trittschall, Kleber, Grundierung und Spachtelmasse sucht
// niemand aus — die gehören zum Handwerk und bleiben in der Arbeitszeile.
//
// Deshalb hat „Fläche spachteln", „Schleifen von Hand" oder „Grundieren
// (Tiefengrund)" hier gar keinen Eintrag: nicht Anteil null, sondern **kein
// Schalter**. Ein Schalter, der nichts bewegt, ist eine Einladung zum
// Missverständnis.

export type MaterialWort = 'Farbe' | 'Lack' | 'Tapete' | 'Belag' | 'Fliesen'

/** Wie der Halbsatz heißt, wenn das Material drin bzw. draußen ist. */
export const MATERIAL_WORTE: Record<MaterialWort, { drin: string; ohne: string }> = {
  Farbe:   { drin: 'inkl. Farbe',   ohne: 'ohne Farbe' },
  Lack:    { drin: 'inkl. Lack',    ohne: 'ohne Lack' },
  Tapete:  { drin: 'inkl. Tapete',  ohne: 'ohne Tapete' },
  Belag:   { drin: 'inkl. Belag',   ohne: 'ohne Belag' },
  Fliesen: { drin: 'inkl. Fliesen', ohne: 'ohne Fliesen' },
}

/**
 * Klartext fürs Kundenpapier.
 *
 * Manfred: *„Ich schreib ‚Material bauseits' — das versteht mein Bauleiter,
 * Frau Krüger nicht."* Auf dem Papier eines Privatkunden steht deshalb kein
 * Fachwort.
 */
export function kundensatz(wort: MaterialWort): string {
  const gegenstand = wort === 'Fliesen' ? 'Die Fliesen werden' : `Die ${wort} wird`
  return `${gegenstand} vom Kunden gestellt.`
}

// ── Erkennung am Rohtitel ───────────────────────────────────────────────────
//
// Reihenfolge = Vorrang, und sie ist Absicht: „Raufaser tapezieren +
// überstreichen 2x" ist eine Tapezierarbeit, keine Anstricharbeit — das
// Material, das der Kunde aussucht, ist die Tapete. „Heizkörper streichen /
// lackieren" landet umgekehrt bei Farbe, weil „streichen" vorn steht und der
// Kunde dort einen Farbton wählt, keinen Lacktyp.

const SPERRE = [
  // Aufpreis- und Zuschlagszeilen sind Veränderungen an einer anderen Zeile,
  // keine eigene Leistung. Ein Materialschalter daran hätte keinen Bezug.
  /aufpreis/i,
  /^zuschlag\b/i,
  /^erschwernis/i,
  /^sonderfarbe/i,
]

// Zubehör — Manfreds Liste, wörtlich, und was in derselben Familie liegt.
//
// *„Kleinmaterial — Trittschall, Kleber, Übergangsprofil — ist bei mir drin,
// das ist kein Material, das ist Zubehör."*
//
// Diese Sperre steht VOR den Materialwörtern, und das ist der Punkt: „Teppich-
// unterlage verlegen" enthält „Teppich", „Sockelleiste / Fliesensockel
// verlegen" enthält „Fliesen". Ohne diesen Vorrang zöge der Schalter dem
// Bodenleger genau die Zeilen auseinander, die zusammengehören.
const ZUBEHOER =
  /unterlage|d(?:ä|ae)mmung|d(?:ä|ae)mmunterlage|trittschall|entkopplung|trennfolie|pe-folie|dampfbremse|verlegeplatte|sch(?:ü|ue)ttung|estrich|folie|matte|kupferband|kleber|kleister|grundier|sockelleiste|(?:ü|ue)bergangsprofil|profil/i

// Die Nomen, die ein Material benennen, das der Kunde aussuchen kann.
//
// Warum eine Nomenliste und nicht das Verb „verlegen": Verlegt werden auch
// Erdkabel, Drainagerohre, Teichfolie, Bewässerungsschläuche und
// Luftdichtigkeitsbahnen. Nichts davon sucht sich jemand im Baumarkt aus, und
// aus keinem dieser Gewerke hat uns jemand etwas zum Material gesagt. Ein
// Schalter dort wäre eine Entscheidung, die wir für andere Berufe treffen,
// ohne sie gefragt zu haben — genau die Sorte, die wir gerade überall
// abschalten.
const BELAG_NOMEN =
  /parkett|laminat|vinyl|\blvt\b|\bspc\b|designbelag|designboden|teppich|kork|linoleum|\bpvc\b|cv-belag|gummibelag|massivholzdiele|landhausdiele|dielenboden|bambus|industrieboden|gewerbeboden|esd-boden/i

// Ein Nomen allein reicht nicht — die Arbeit muss das Material auch einbauen.
//
// „Teppichboden entfernen + entsorgen", „Parkett reinigen und pflegen",
// „Teppichboden saugen" nennen alle einen Belag und verbrauchen keinen. Wer
// hier einen Materialschalter hinsetzt, bietet an, den Belag, den er
// herausreißt, vom Kunden stellen zu lassen.
const RUECKBAU_ODER_PFLEGE =
  /entfernen|entsorg|abbruch|r(?:ü|ue)ckbau|reinig|saugen|pflegen|aufarbeit|abschleifen|demontier|aussp(?:ü|ue)l/i

/**
 * Die Arbeit, die das Material verbraucht — je Materialwort eine eigene.
 *
 * Bei „Farbe" steht bewusst `streichen` mit Endung und nicht `streich`:
 * „GK-Fläche spachteln (Q4 – Streichfertigkeit)" und „Fläche feinspachteln
 * (Q3, streichfertig)" sind Vorbereitung für einen Anstrich, nicht der
 * Anstrich. Ein Q3-Spachtel verbraucht keine Farbe.
 */
const REGELN: { wort: MaterialWort; nomen?: RegExp; arbeit: RegExp }[] = [
  { wort: 'Tapete',  arbeit: /tapezier/i },
  { wort: 'Belag',   nomen: BELAG_NOMEN, arbeit: /verleg/i },
  { wort: 'Fliesen', nomen: /\bfliesen\b|naturstein/i, arbeit: /verleg|verflies/i },
  // Lack VOR Farbe, und das ist keine Sortierfrage:
  //
  // Seit PD-010 heißen die Türzeilen „Türen lackieren (2× Anstrich)". Sie
  // tragen damit beide Wörter — und `Farbe` griff zuerst, weil es oben stand.
  // Die Folge stand nicht im Code, sondern auf dem Kundenangebot: „ohne
  // Farbe" unter einer Lackierposition, dazu 25 % Materialanteil statt der
  // 30 %, die der Prüfmeister für Lack genannt hat („beim Lack höher").
  //
  // „Anstrich" heißt Arbeitsgang, nicht Material. Sagt ein Titel „lackieren",
  // ist das Material Lack — auch wenn daneben steht, wie viele Gänge es sind.
  // Betroffen sind vier Zeilen: die drei aus „Maler – Lackierarbeiten" und
  // „Heizkörper streichen / lackieren".
  { wort: 'Lack',    arbeit: /lackier/i },
  { wort: 'Farbe',   arbeit: /streichen|streicht|anstrich(?!s?fertig)|lasur/i },
]

/**
 * Die Gewerke, für die die Materialfrage entschieden ist.
 *
 * Manfred hat drei Zeilen gesagt — Innen, Fassade, Boden — und der Katalog
 * führt Fliesen in derselben Logik (der Kunde sucht die Fliese aus). Weiter
 * geht die Entscheidung nicht.
 *
 * Ohne diese Grenze bekämen Schreiner („Türblatt schleifen + lackieren"),
 * Fensterbauer („PVC-Fenster inkl. Element"), Garten- und Landschaftsbau
 * („Natursteinpflaster verlegen") und Dachdecker einen Materialschalter,
 * über den nie jemand aus diesen Berufen etwas gesagt hat. Das wäre dieselbe
 * Art stiller Entscheidung, die wir mit dem Mindestauftragswert und der
 * E-Rechnung gerade abgeräumt haben — nur in einem Bereich, in dem sie
 * niemandem auffiele.
 *
 * Erweitern ist billig: eine Zeile, sobald jemand aus dem Gewerk gefragt
 * wurde. Das ist die richtige Reihenfolge.
 */
export const ENTSCHIEDENE_GEWERKE = /^\s*(maler|boden|fliesen|fassade)\b/i

/**
 * Welches Material steckt in dieser Position — und kann der Kunde es
 * aussuchen? `null` heißt: kein Schalter, nicht „Anteil null".
 */
export function materialWort(
  titel: string | null | undefined,
  kategorie?: string | null,
): MaterialWort | null {
  const t = titel ?? ''
  if (!t.trim()) return null
  // Die Kategorie grenzt das GEWERK ab, der Titel entscheidet die SACHE.
  // Fehlt die Kategorie — eine Angebotsposition trägt keine —, entscheidet der
  // Titel allein.
  if (kategorie != null && !ENTSCHIEDENE_GEWERKE.test(kategorie)) return null
  if (SPERRE.some(muster => muster.test(t))) return null
  if (ZUBEHOER.test(t)) return null
  if (RUECKBAU_ODER_PFLEGE.test(t)) return null
  return REGELN.find(
    regel => regel.arbeit.test(t) && (!regel.nomen || regel.nomen.test(t)),
  )?.wort ?? null
}

// ── Faustregel für den Startwert ────────────────────────────────────────────
//
// Prüfmeister, 14.09.2026: innen rund ein Viertel, nie über ein Drittel; beim
// Lack höher; bei Fassade und Boden ein Drittel bis die Hälfte, „und er
// schwankt mit der Auswahl des Kunden — genau da wird ein eingerechneter
// Materialanteil zum Risiko für den Betrieb."

const ANTEIL_INNEN: Record<MaterialWort, number> = {
  Farbe: 0.25,
  Lack: 0.30,
  Tapete: 0.25,
  Belag: 0.45,
  Fliesen: 0.45,
}

/** Für Fassade und Außenarbeiten: dort ist der Anteil größer. */
const ANTEIL_AUSSEN = 0.33

/**
 * Die Obergrenzen aus der Faustregel.
 *
 * Der Prüfmeister hat zwei Bänder genannt, nicht eines: *„bei zwei Anstrichen
 * liegt der Materialanteil innen bei rund einem Viertel, nie über einem
 * Drittel"* — und für Fassade und Boden *„nicht ein Viertel, sondern ein
 * Drittel bis die Hälfte."* Beim ersten Testlauf hatte ich das Drittel auf
 * alles angewandt; der Test wurde rot, und zwar zu Recht.
 */
export const HOECHSTANTEIL_INNEN = 1 / 3
export const HOECHSTANTEIL_BELAG = 1 / 2

/** Für welche Materialien gilt das engere Band? */
export const BAND_INNEN: readonly MaterialWort[] = ['Farbe', 'Lack', 'Tapete']

function istAussen(titel: string, kategorie?: string | null): boolean {
  return /fassade|außen|aussen/i.test(`${kategorie ?? ''} ${titel}`)
}

const runde = (wert: number) => Math.round(wert * 100) / 100

export interface PositionMitPreis {
  title: string
  unit_price: number
  category?: string | null
  /** Eigener Wert des Betriebs. Schlägt die Faustregel. */
  material_anteil?: number | null
}

/**
 * Der Materialanteil dieser Position in € je Einheit.
 *
 * `null` = diese Position hat kein Material, das der Kunde aussucht. Dann gibt
 * es auch keinen Schalter.
 *
 * Ein hinterlegter eigener Wert gewinnt immer — aber nie über den Preis
 * hinaus: Wer seinen Preis unter den Materialanteil senkt, bekommt keine
 * negative Arbeitszeile, sondern eine Arbeitszeile von null.
 */
export function materialAnteil(position: PositionMitPreis): number | null {
  const wort = materialWort(position.title, position.category)
  if (!wort) return null

  const preis = position.unit_price
  if (!(preis > 0)) return null

  if (position.material_anteil != null) {
    return runde(Math.min(Math.max(position.material_anteil, 0), preis))
  }

  const satz = istAussen(position.title, position.category)
    ? ANTEIL_AUSSEN
    : ANTEIL_INNEN[wort]

  return runde(Math.min(preis * satz, preis))
}

export interface MaterialAufteilung {
  /** Der Preis der Arbeitszeile, wenn das Material herausgezogen ist. */
  arbeit: number
  /** Der Preis der Materialzeile. */
  material: number
  wort: MaterialWort
}

/**
 * Zerlegt eine Position in Arbeit und Material.
 *
 * 🔴 Die Zusicherung, auf die es ankommt: **`arbeit + material` ist exakt der
 * ursprüngliche Preis.** Nicht ungefähr — exakt, auf den Cent. Der Prüfmeister
 * hat die Probe so formuliert: *„Material herausziehen und nachrechnen, ob die
 * Summe um genau den Materialanteil fällt — nicht um null und nicht um den
 * ganzen Preis."* Deshalb wird nur das Material gerundet und die Arbeit als
 * Rest gebildet, nie beides einzeln.
 */
export function teileMaterialAb(position: PositionMitPreis): MaterialAufteilung | null {
  const wort = materialWort(position.title, position.category)
  const material = materialAnteil(position)
  if (!wort || material == null) return null
  return { arbeit: runde(position.unit_price - material), material, wort }
}

/**
 * Der Halbsatz, der ans Feld gehört.
 *
 * Manfred: *„Der Halbsatz ist wichtiger als der Schalter."* Der Prüfmeister
 * eine Stufe schärfer: **„ohne Material" ist selbst schon falsch** — bei
 * „Vliestapete tapezieren ohne Material" bleibt der Kleister drin, und man
 * streitet später über zwanzig Euro. Deshalb steht hier immer das Material
 * beim Namen.
 */
export function halbsatz(
  position: { title: string; category?: string | null } | string,
  materialGetrennt: boolean,
): string | null {
  const titel = typeof position === 'string' ? position : position.title
  const kategorie = typeof position === 'string' ? undefined : position.category
  const wort = materialWort(titel, kategorie)
  if (!wort) return null
  return materialGetrennt ? MATERIAL_WORTE[wort].ohne : MATERIAL_WORTE[wort].drin
}
