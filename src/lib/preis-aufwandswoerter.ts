// Aufwandswörter — Wörter, die den Arbeitsaufwand ändern und deshalb nie
// stillschweigend übergangen werden dürfen.
//
// ── Herkunft (12.09.2026) ──────────────────────────────────────────────────
//
// Manfred (Testnutzer, Malermeister): *„‚Teppich verklebt' für den Preis von
// ‚Teppich lose' — das ist bei mir der Unterschied zwischen einem halben Tag
// und zwei Tagen, mit Kleberresten, Spachtel, Schleifen. Wer das drei Mal
// erlebt, glaubt der App nichts mehr."*
//
// Der Prüfmeister hat die Regel dann in beide Richtungen gedreht, und das ist
// die wichtigere Hälfte:
//
//   `Parkett schleifen` traf `Parkett schleifen + versiegeln komplett`
//   (38,00 € statt 20,00 €). Der Kunde bekommt eine Versiegelung aufs Papier,
//   die keiner bestellt hat. Fällt niemandem auf, weil es nach mehr Geld
//   aussieht — aber der Betrieb schuldet die Arbeit, die auf dem Papier steht.
//
// ── Warum die Wörter hier am ROHTITEL gelesen werden ───────────────────────
//
// Der Prüfmeister nannte zwei „Mechanik-Lecks": Die Textnormalisierung wirft
// Klammerinhalte weg (`.replace(/\([^)]*\)/g, ' ')`) und alles hinter dem
// Gedankenstrich (`split(/\s+[—–-]\s+/)[0]`) — und genau dort stehen die
// Millimeterspannen, die Schleifgänge, „(vollflächig verklebt)" und
// „Schicht 1/2". Sein Vorschlag war, die Lecks zu stopfen.
//
// Das hier ist der andere Weg, und er ist kleiner und sicherer: Die Wörter
// werden gar nicht erst durch die Normalisierung geschickt, sondern wie die
// Q-Stufe und die Anstrichzahl **als Filter am ungeschnittenen Titel**
// gelesen. Damit sind beide Lecks erledigt, ohne die Normalisierung
// anzufassen — und ein Aufwandswort kann nicht von einem hohen Textscore
// überstimmt werden. Dieselbe Bauweise, die bei PM-018 (Q-Stufe) schon
// bewiesen ist: *„Deshalb wird sie am Rohtext gelesen und als FILTER benutzt,
// nicht als Textmerkmal."*
//
// Nebeneffekt, der erwünscht ist: Farbtöne in Klammern („(Dunkelblau, Zone 1)")
// stören weiterhin nichts. Farbtöne sind laut Prüfmeister ausdrücklich KEIN
// Aufwandswort.
//
// ── Was hier bewusst NICHT steht ──────────────────────────────────────────
//
// Bauteile (Wand/Decke/Boden), Raumnamen, Farbtöne, Markennamen und
// Füllwörter („fachgerecht", „komplett", „nach VOB"). Der Prüfmeister dazu:
// *„Wer die mit aufnimmt, sperrt sich den halben Katalog weg, und dann tippt
// der Handwerker jeden zweiten Preis von Hand — das ist kein besseres
// Produkt, das ist Word mit Extraschritten."*
//
// Q-Stufe und Anstrichzahl fehlen hier ebenfalls: Die sind seit PM-018 bzw.
// CoS-E-038 bereits eigene harte Filter im Matcher und bleiben, wie sie sind.

/** Wie streng eine Gruppe vergleicht. */
export type AufwandRegel =
  /**
   * Trägt nur EINE der beiden Seiten das Wort, ist der Treffer gesperrt.
   * Für Wörter, die einen zusätzlichen Arbeitsgang oder einen erschwerten
   * Zustand bezeichnen: Sie fehlen nie zufällig.
   */
  | 'beidseitig'
  /**
   * Gesperrt erst, wenn BEIDE Seiten etwas tragen und es verschieden ist.
   * Für Abstufungen einer Skala (Millimeter, Lagen, Gänge): Der Eintrag ohne
   * Angabe ist der brauchbare Grundfall und darf einspringen — sonst stünde
   * ein Betrieb ohne jeden Preis da, nur weil sein Katalog die Spanne nicht
   * ausschreibt.
   */
  | 'nur-unterschied'
  /**
   * Gesperrt nur, wenn der GESUCHTE Titel das Wort trägt. Bringt allein der
   * Kandidat es mit, wird die Gruppe übergangen.
   *
   * Für die Verlegeart (verklebt / schwimmend / gespannt). Grund: Die Engine
   * schreibt die Verlegeart heute nur an einer einzigen Stelle in den Titel
   * (`Fertigparkett verlegen vollflächig verklebt`), der Katalog nennt sie
   * bei fast jedem Eintrag. Beidseitig gelesen heißt das: Sagt die Engine
   * nichts, fallen ALLE ehrlichen Katalogzeilen weg und übrig bleibt die
   * exotische — gemessen am 12.09.: `Laminat verlegen` 14,00 € → 24,00 €
   * (Fischgrätmuster), `Parkett verlegen` 22,00 € → 52,00 €
   * (Industrieparkett). Das ist genau der Schaden, den die Regel verhindern
   * soll, nur mit umgedrehtem Vorzeichen.
   *
   * Die andere Richtung trägt: Steht „verklebt" im gesuchten Titel, ist der
   * Preis für „lose" nachweislich falsch (Manfred). Deshalb sperrt sie.
   *
   * ── Nachtrag 12.09.2026, nach G.2 ────────────────────────────────────
   *
   * Die Annahme war: Sobald die Engine die Verlegeart schreibt, darf auch die
   * Gegenrichtung sperren. G.2 ist gebaut, und die Messung sagt Nein — die
   * Einschränkung bleibt dauerhaft. Beidseitig gemessen:
   *
   *   `Fertigparkett verlegen` 22,00 € → 52,00 € (Industrieparkett)
   *   `Vinyl-Boden verlegen`   16,00 € → 25,00 € (WPC / Outdoorvinyl)
   *   `Vinyl / Designboden`    17,00 € → 42,00 € (mit Fries / Bordüre)
   *
   * Der Grund ist einleuchtend, sobald man ihn sieht: Nach G.2 schweigt der
   * Engine-Titel nur noch dort, wo die Verlegeart WIRKLICH offen ist —
   * Teppich ohne Ansage, Vinyl ohne Ansage, unbekannter Belag. Genau dort
   * darf man sie nicht als Filter benutzen, sonst wirft man alle ehrlichen
   * Katalogzeilen weg und behält die exotische. Die richtige Antwort auf
   * einen offenen Fall ist die Rückfrage im Angebot (F.5/6), nicht eine
   * Sperre, die so tut, als wüsste sie etwas.
   */
  | 'nur-gesucht'
  /**
   * Gesperrt, wenn BEIDE Seiten etwas tragen und sich die Mengen NICHT
   * überschneiden. Für Werkstoffe, bei denen eine Katalogzeile mehrere
   * abdecken kann.
   *
   * `Untergrund grundieren (Haftgrund / Tiefengrund)` deckt beide Materialien
   * ab — gegen einen Haftgrund-Auftrag darf sie nicht fallen, nur weil sie
   * zusätzlich den Tiefengrund nennt. `Grundieren — Tiefengrund` allein
   * dagegen schon.
   */
  | 'kein-schnitt'

export interface AufwandWort {
  /**
   * Der kanonische Name. ENTSCHEIDEND: Verglichen wird dieser Name, nicht die
   * gefundene Wortform. „Grundierung", „grundieren" und „Voranstrich"
   * bedeuten dasselbe und müssen denselben Marker ergeben — sonst sperrt die
   * Regel Treffer, die sie zusammenbringen soll. (Genau das ist beim ersten
   * Anlauf passiert: 16 Titel verloren ihren Preis, weil „Grundierung" und
   * „Grundieren — Tiefengrund" als verschiedene Wörter galten.)
   */
  id: string
  muster: RegExp
}

export interface AufwandGruppe {
  name: string
  regel: AufwandRegel
  /**
   * Nur den Teil VOR dem Raum-Gedankenstrich lesen.
   * Nötig bei Ortsangaben: „Wand streichen 2x — Keller" nennt den Keller als
   * RAUM, nicht als Erschwernis. Ohne diese Einschränkung würde jeder
   * Kellerraum den normalen Wandpreis verlieren.
   */
  nurVorRaum?: boolean
  /**
   * Der gefundene WORTLAUT ist die Bedeutung, nicht der kanonische Name.
   *
   * Nötig überall dort, wo eine Zahl unterscheidet: „bis 10 kWp" und
   * „>10 kWp" treffen dieselbe Kennung, meinen aber verschiedene Preise.
   * Ohne dieses Flag wären sie gleich und die Sperre wirkungslos.
   *
   * Für WORT-Gruppen ist es falsch und richtet Schaden an. Aufgefallen beim
   * Umbenennungs-Zug (CoS-E-050): `Massivholzdielen` (Mehrzahl, alte
   * Schreibweise) sperrte gegen `Massivholzdiele` (Einzahl, neuer
   * Katalogtitel) — dasselbe Produkt, dieselbe Kennung, ein Buchstabe
   * Unterschied, und die Zeile war unerreichbar. Dort zählt der kanonische
   * Name.
   *
   * Bis zum 12.09.2026 hing das an `regel === 'nur-unterschied'` und war
   * damit eine stille Kopplung zweier Dinge, die nichts miteinander zu tun
   * haben.
   */
  genauerWortlaut?: boolean
  /**
   * Eine Katalogzeile, die mehrere Arbeitsgänge mit „/" aufzählt, bietet sie
   * als ALTERNATIVEN an — nicht als Bündel. `Tür streichen / lackieren`
   * heißt „streichen ODER lackieren, gleicher Preis". Wer „Tür streichen"
   * sucht, meint genau diese Zeile.
   *
   * Ohne dieses Flag las die Sperre die Aufzählung als „und" und sperrte:
   * `Tür streichen` → kein Preis, obwohl die Zeile danebensteht.
   * `Heizkörper lackieren` → kein Preis, obwohl `Heizkörper streichen /
   * lackieren` für 40,00 € existiert. Gemessen am 12.09.2026 auf Manfreds
   * Frage hin, ob Alltagsbegriffe noch Preise finden.
   *
   * Zwei Grenzen, die bleiben müssen:
   *   • Nur wenn das Gesuchte eine TEILMENGE des Angebotenen ist. Wer
   *     „Wand spachteln und streichen" sucht, darf weiter nicht auf
   *     `Wand streichen 2x` fallen — dort fehlt ein Arbeitsgang, den er
   *     bestellt hat.
   *   • Nicht bei BÜNDELN. `Raufaser tapezieren + überstreichen 1x` ist
   *     kein Entweder-oder, sondern beides. Wer nur tapezieren will, zahlt
   *     dort einen Anstrich mit, den niemand bestellt hat (PM/P.2, 4,00 €
   *     je m²). Erkannt am „+" bzw. „und" zwischen den Gängen.
   */
  sammelzeile?: boolean
  woerter: AufwandWort[]
}

// ── Wortgrenzen bei Umlauten ──────────────────────────────────────────────
//
// `\b` und `\w` in JavaScript kennen nur ASCII. `/\bölen\b/` trifft deshalb
// NIE: links vom „ö" steht ein Leerzeichen, und zwei Nicht-Wortzeichen
// ergeben keine Grenze. Genau daran ist der Hauptfall des Prüfmeisters beim
// zweiten Anlauf noch vorbeigerutscht — `Parkett schleifen` landete weiter
// auf einem Komplettpaket, nur auf `+ ölen` (45,00 €) statt `+ versiegeln`
// (38,00 €). Die Regel sah in der Messung richtig aus und war es nicht.
//
// Deshalb überall Unicode-Grenzen statt `\b`/`\w`.
const RECHTS = String.raw`(?![\p{L}])`
const LINKS = String.raw`(?<![\p{L}\p{N}])`

/**
 * Wortstamm → Muster mit Unicode-Grenze rechts, aber KEINER links.
 *
 * Absichtlich offen nach links: Im Deutschen ist das Kompositum dieselbe
 * Arbeit. „Feinspachteln" ist Spachteln, „Rostschutz" ist Rost,
 * „Zwischenschliff" ist Schleifen. Wer hier eine linke Grenze setzt, sperrt
 * den Katalog gegen seine eigenen Einträge — dieselbe Lehre wie beim
 * Textscore, wo genau diese Verschärfung 13 Tests gerissen hat.
 */
const w = (id: string, ...staemme: string[]): AufwandWort => ({
  id,
  muster: new RegExp(`(?:${staemme.join('|')})${RECHTS}`, 'iu'),
})

/** Wie `w`, aber mit Grenze auch links — für Stämme, die als Wortende in
 *  fremden Wörtern vorkommen („Hausbau" ist kein Ausbau). */
const wg = (id: string, ...staemme: string[]): AufwandWort => ({
  id,
  muster: new RegExp(`${LINKS}(?:${staemme.join('|')})${RECHTS}`, 'iu'),
})

const L = String.raw`[\p{L}]*`

export const AUFWAND_GRUPPEN: AufwandGruppe[] = [
  {
    // Gruppe 1 beim Prüfmeister: „Ein eigener Arbeitsgang steht im Titel."
    // Seine wichtigste Gruppe — hier sitzt der Parkett-schleifen-Fall.
    name: 'Arbeitsgang',
    regel: 'beidseitig',
    sammelzeile: true,
    woerter: [
      // ── Ergänzung P.2 (Prüfmeister, 12.09.2026) ─────────────────────────
      //
      // `streichen`, `überstreichen`, `anstreichen` und `anstrich` sind EINE
      // Kennung, ebenso `tapezieren` und `aufziehen`. Seine Warnung dazu,
      // wörtlich: *„Als getrennte Kennungen würde `Heizkörper lackieren
      // (2× Anstrich)` gegen `Heizkörper streichen / lackieren` sperren —
      // zwei Wörter für denselben Arbeitsgang, und ein richtiger Treffer
      // flöge weg."* Genau derselbe Fehler wie „Grundierung" ≠ „Grundieren"
      // beim ersten Anlauf, der 16 Titel ihren Preis gekostet hat.
      //
      // Was das einbringt: `Raufaser tapezieren` traf bisher
      // `Raufaser tapezieren + überstreichen 1x` für 14,00 € — ein Anstrich,
      // den niemand bestellt hat, 4,00 €/m² zu viel, und der Betrieb schuldet
      // die Arbeit. Der unbündelte Eintrag `Raufaser tapezieren ohne
      // Anstrich` (10,00 €) stand die ganze Zeit daneben.
      // ── Zwei Fallen, beide beim ersten Lauf aufgeschlagen ──────────────
      //
      // 1. `anstrich` braucht eine Grenze nach LINKS. Ohne sie steckt es in
      //    **„Voranstrich"** — und `Voranstrich / Grundierung` galt damit als
      //    Streicharbeit. Gegen `Grundieren — Tiefengrund` (das keine ist)
      //    war das eine harte Sperre: die Grundierung verlor ihren Preis.
      //    Voranstrich IST Grundieren und steht als solches oben in der
      //    `grundieren`-Kennung.
      //
      // 2. `streich…` darf nicht in **„streichfertig"** greifen. Das
      //    beschreibt das ERGEBNIS einer Spachtelung („so glatt, dass man
      //    streichen kann"), nicht einen Arbeitsgang. `Fläche feinspachteln
      //    (Q3, streichfertig)` galt sonst als Spachteln + Streichen und
      //    sperrte gegen `Spachtelarbeiten Q3` — der Q3-Preis fiel weg und
      //    der stufenlose 9-€-Eintrag sprang ein. Genau der Fehler, den
      //    PM-018 abgestellt hat.
      //
      // Beides ist dieselbe Familie wie „Grundierung ≠ Grundieren" vom
      // ersten Anlauf: Ein Wort, das aussieht wie der Arbeitsgang, aber
      // keiner ist.
      w('streichen', `streich(?!fertig|bereit|fähig|faehig)${L}`, `überstreich${L}`, `ueberstreich${L}`, `gestrichen`),
      wg('streichen', `anstrich${L}`, `anstreich${L}`),
      w('tapezieren', `tapezier${L}`, `aufzieh${L}`, `aufgezogen`),
      w('schleifen', `schleif${L}`, `schliff${L}`, `geschliffen`),
      w('spachteln', `spachtel${L}`, `gespachtelt`),
      // „Voranstrich" ist dasselbe wie Grundieren — deshalb dieselbe id.
      w('grundieren', `grundier${L}`, `grundierung`, `voranstrich${L}`, `tiefengrund`, `haftgrund`),
      w('versiegeln', `versiegel${L}`, `versiegelung`),
      w('oelen', `öl`, `ölen`, `ölung`, `geölt`, `geoelt`),
      w('wachsen', `wachs${L}`, `gewachst`),
      w('lackieren', `lackier${L}`, `lackanstrich`),
      w('beizen', `beiz${L}`, `abbeiz${L}`),
      w('abbrennen', `abbrenn${L}`),
      w('entsorgen', `entsorg${L}`),
      wg('demontieren', `demontier${L}`, `ausbau${L}`),
      w('fraesen', `fräs${L}`, `fraes${L}`, `gefräst`),
      w('verschweissen', `verschweiß${L}`, `verschweiss${L}`),
      w('verkitten', `verkitt${L}`, `kitten`),
      w('vernaehen', `vernäh${L}`, `vernaeh${L}`),
    ],
  },
  {
    // ── Grundierungsart (Manfred, 12.09.2026) ──────────────────────────────
    //
    // *„Sechs. Nicht viereinhalb. Der Grund ist das Material, nicht die
    // Arbeit: Tiefengrund ist Wasser mit ein bisschen Bindemittel, der Eimer
    // kostet fast nichts. Haftgrund für Estrich ist gefüllt, mit Quarzsand,
    // damit die Ausgleichsmasse greift — der Eimer kostet das Drei- bis
    // Vierfache, und du brauchst mehr davon pro Quadratmeter, weil der
    // Estrich saugt."*
    //
    // Der Katalog führt beide Preise sauber getrennt:
    //   `Grundieren — Tiefengrund`            4,50 €/m²
    //   `Grundieren (Haftgrund / Sperrgrund)` 6,00 €/m²
    //
    // Trotzdem bekam jeder Estrich den Tiefengrund-Preis — und zwar egal,
    // wie der gesuchte Titel hieß. Die Ursache liegt auf der KANDIDATEN-
    // Seite: Die Normalisierung wirft Klammerinhalte weg, also heißen beide
    // Katalogzeilen für den Matcher schlicht „grundieren". Gleichstand, und
    // es gewinnt die erste — Tiefengrund, weil sie eine Zeile weiter oben
    // steht.
    //
    // Deshalb ging auch Manfreds eigener Vorschlag nicht auf, den Titel
    // ohne Klammer zu bauen („Estrich grundieren Haftgrund"): Gemessen
    // trifft er weiter 4,50 €. Der Zusatz auf der Suchseite hilft nicht,
    // solange die Kandidaten ununterscheidbar sind.
    //
    // Diese Gruppe löst es ohne Eingriff in die Normalisierung — dieselbe
    // Bauweise wie Q-Stufe und Anstrichzahl: am Rohtitel gelesen, als
    // FILTER benutzt. Damit ist das Material wieder sichtbar, und zwar auf
    // beiden Seiten.
    //
    // 'kein-schnitt', weil Sammelzeilen wie
    // `Untergrund grundieren (Haftgrund / Tiefengrund)` beide Materialien
    // abdecken und für beide gelten dürfen.
    //
    // Epoxi steht bewusst dabei und ist bewusst NICHT dasselbe wie
    // Haftgrund. Manfred: *„Wenn's Epoxi-Grund ist (feuchter Estrich,
    // Sperrschicht), sind's eher 10 — aber das wäre eine eigene Position
    // ‚Estrich sperren (Epoxi)', nicht dieselbe."* Bis diese Position
    // existiert, sperrt das Wort lieber, als den falschen Preis zu nehmen.
    name: 'Grundierungsart',
    regel: 'kein-schnitt',
    woerter: [
      w('tiefengrund', `tiefengrund`, `tiefgrund`),
      w('haftgrund', `haftgrund`, `haftbrücke`, `haftbruecke`, `haftschlämme`, `haftschlaemme`, `sperrgrund`),
      // Bindestrich und Leerzeichen mitdenken: „Epoxi-Grund", „Epoxid Grund",
      // „Epoxidgrundierung". `[\p{L}]*` allein trifft den Bindestrich nicht —
      // genau daran ist der erste Testlauf gescheitert.
      w('epoxigrund', `epoxid?[\\s-]?grund${L}`, `epoxid?harz[\\s-]?grund${L}`),
    ],
  },
  {
    // Verlegeart — die eine Gruppe, die NUR in eine Richtung sperrt.
    //
    // Manfred: *„‚Teppich verklebt' für den Preis von ‚Teppich lose' — das ist
    // bei mir der Unterschied zwischen einem halben Tag und zwei Tagen."*
    // Diese Richtung sperrt und ist am 12.09. auch messbar eingetreten:
    // `Alten Teppichboden entfernen (verklebt)` bekam vorher 6,00 €
    // (entfernen und entsorgen), jetzt 9,00 € (verklebt entfernen).
    //
    // Die Gegenrichtung schweigt, siehe 'nur-gesucht'. Sie wird
    // aufgemacht, sobald die Engine die Verlegeart selbst in den Titel
    // schreibt (G.2) — vorher richtet sie mehr Schaden an als sie verhindert.
    name: 'Verlegeart',
    regel: 'nur-gesucht',
    woerter: [
      w('verklebt', `verkleb${L}`, `geklebt`, `vollflächig`, `vollflaechig`),
      // „Klick" IST die Aussage „schwimmend" — ein Klick-Belag wird nie
      // verklebt. Ohne dieses Wort verliert `Klick-Vinyl verlegen` seinen
      // eigenen Katalogeintrag an einen Loose-Lay-Preis.
      w('schwimmend', `schwimmend`, `klick`),
      w('gespannt', `gespannt`, `getackert`, `tackern`, `nagelleiste${L}`),
      w('lose', `lose`, `loose[- ]?lay`),
    ],
  },
  {
    // Gruppe 2: Zustand des Untergrunds. Hier sperrt beides — ein Untergrund
    // ist verrußt oder er ist es nicht, das fehlt nie zufällig.
    name: 'Zustand',
    regel: 'beidseitig',
    woerter: [
      w('mehrlagig', `mehrlagig`),
      w('nikotin', `nikotin${L}`),
      wg('russ', `ruß`, `russ`, `verrußt`, `verrusst`),
      w('wasserflecken', `wasserfleck${L}`),
      w('schimmel', `schimmel${L}`),
      wg('rost', `rost`, `entrost${L}`, `rostschutz`, `rostig`),
      w('graffiti', `graffiti`),
      w('sinterschicht', `sinterschicht`),
    ],
  },
  {
    // ── Sondermaterial (Prüfmeister P.2, 12.09.2026) ──────────────────────
    //
    // Silikat, Latex, Lehm, Kalk und die Spezialfarben sind ANDERE Produkte,
    // nicht andere Arbeit — dieselbe Logik wie bei der Grundierungsart
    // (Tiefengrund gegen Haftgrund). Der Katalog führt sie sauber getrennt
    // (`Wand mit Latexfarbe streichen 2x` 13,00 €, `mit Silikatfarbe`
    // 14,00 €, `Anti-Schimmel-Anstrich 2x` 15,00 €) — der Matcher konnte sie
    // bisher nicht auseinanderhalten.
    //
    // Epoxid fehlt hier bewusst: Das ist über die Grundierungsart schon
    // abgedeckt, und zwei Gruppen für dasselbe Wort sperren doppelt.
    name: 'Sondermaterial',
    regel: 'beidseitig',
    woerter: [
      w('silikat', `silikat${L}`),
      w('latex', `latex${L}`),
      w('lehm', `lehm${L}`),
      w('kalk', `kalk${L}`),
      w('chlor', `chlorbeständig${L}`, `chlorbestaendig${L}`),
      w('brandschutz', `brandschutz${L}`),
      w('antischimmel', `anti[- ]?schimmel${L}`),
      w('mineralisch', `mineralisch${L}`),
    ],
  },
  {
    // ── Materialbeistellung (Prüfmeister P.2, 12.09.2026) ─────────────────
    //
    // „Nur verlegen" und „inkl. Material" sind derselbe Handgriff zu sehr
    // verschiedenen Preisen. Wer Material beistellt, zahlt den Lohnanteil;
    // wer es mitliefert, zahlt beides. Steht es auf einer Seite und auf der
    // anderen nicht, ist der Treffer nicht vergleichbar.
    name: 'Materialbeistellung',
    regel: 'beidseitig',
    woerter: [
      w('mitMaterial', `inkl\\.?\\s*material`, `inklusive\\s*material`, `liefern und montieren`, `liefern und verlegen`),
      w('ohneMaterial', `ohne\\s*material`, `material\\s*bauseits`, `bauseits\\s*gestellt`, `nur\\s*verlegen`, `nur\\s*montieren`),
      w('nurLiefern', `nur\\s*liefern`, `nur\\s*material`),
    ],
  },
  {
    // ── Werkstoff Boden: wenn die Normalisierung das Produkt löscht ──────
    //
    // Manfred, 12.09.2026, zur Liste der 22: *„Da steht das unterscheidende
    // Wort nicht in der Klammer – es steht ganz vorn, und trotzdem wird's
    // zusammengeworfen. Das ist kein Klammer-Fall, das ist der Matcher."*
    //
    // Er hat recht, und die Ursache ist schärfer als vermutet: Es ist keine
    // knappe Mehrheit von vier aus fünf Wörtern. In `preis-matcher.ts` steht
    //
    //     [/landhausdielen?|massivholzdielen?|holzdielen?/g, 'diele']
    //
    // — eine Synonymregel, die drei verschiedene Produkte zu EINEM Wort
    // macht. Danach heißen beide Zeilen buchstabengleich „diele verlegen
    // vollflaechig verklebt", und der Score ist nicht knapp, sondern
    // **1,000**. Massivholz (52,00 €) bekam den Landhausdielen-Preis
    // (40,00 €): 12,00 € je m², und keine Umbenennung der Welt hilft, weil
    // die Namen bereits verschieden sind.
    //
    // Gemessen: Von 87 Titelpaaren, die nach der Normalisierung gleich
    // heißen und verschieden kosten, gehen 81 auf die Klammer zurück und 6
    // auf die Normalisierung selbst. Fünf der sechs fängt ein Filter ab
    // (Q-Stufe, Staffel). Dieses eine nicht — bis jetzt.
    //
    // Warum ein Filter und nicht das Löschen der Synonymregel: Die Regel ist
    // richtig für die Suche („Holzdielen verlegen" soll etwas finden) und
    // falsch für das Geld. Genau dafür gibt es diese Datei — großzügig
    // suchen, hart trennen. Dasselbe Muster wie bei der Q-Stufe (PM-018).
    //
    // `holzdiele` bekommt bewusst KEINE Kennung: Das ist der Oberbegriff.
    // Wer ihn sagt, hat sich nicht festgelegt und bekommt weiter einen
    // Treffer — den günstigeren, wie überall in dieser Datei.
    name: 'Bodenwerkstoff',
    regel: 'nur-unterschied',
    woerter: [
      w('massivholzdiele', `massivholzdiele${L}`, `massivdiele${L}`),
      w('landhausdiele', `landhausdiele${L}`, `mehrschichtdiele${L}`),
      // Parkett ist kein Dielenboden. Aufgefallen beim Umbenennungs-Zug
      // (CoS-E-050): Nach der Umbenennung auf die Einzahl
      // („Massivholzdiele …") traf die alte Mehrzahl-Schreibweise
      // `Massivholzdielen verlegen vollflächig verklebt` plötzlich
      // `Fertigparkett verlegen vollflächig verklebt` — 35,00 € statt
      // 52,00 €, und zwar ein anderes Produkt. Ohne eigene Kennung für
      // Parkett greift `nur-unterschied` nicht, weil die Parkettzeile gar
      // keine Kennung trug.
      w('parkett', `parkett${L}`, `stabparkett${L}`),
    ],
  },
  {
    // ── Umfang der Fläche: ein- oder beidseitig (CoS-E-039, 12.09.2026) ──
    //
    // `Tür streichen / lackieren (beidseitig)` kostet 75,00 €,
    // `(einseitig)` 45,00 €. Der Matcher warf die Klammer weg und gab der
    // beidseitigen Tür den einseitigen Preis — 30,00 € je Tür zu wenig, im
    // eigenen Gewerk, bei einer der häufigsten Positionen überhaupt.
    //
    // `nur-unterschied` und nicht `beidseitig`: Sperren soll nur, wenn BEIDE
    // Seiten eine Angabe tragen und die Angaben sich widersprechen. Sagt der
    // Handwerker nur „Tür lackieren", darf er weiter einen Treffer bekommen —
    // welchen der beiden, entscheidet der Score, nicht diese Sperre.
    name: 'Umfang',
    regel: 'nur-unterschied',
    woerter: [
      w('einseitig', `einseitig`),
      w('beidseitig', `beidseitig`, `zweiseitig`),
      w('allseitig', `allseitig`, `umlaufend`, `rundum`),
    ],
  },
  {
    // ── Staffel: Größe, Leistung, Stückzahl (CoS-E-039, 12.09.2026) ──────
    //
    // Hieß bis heute „Maßschwelle" und kannte nur mm/cm/km. Anlass war
    // `Ausgleichsmasse (bis 30mm)`, die den 3-mm-Preis bekam.
    //
    // Die Messung zu Manfreds TN-095 („die Preisliste hat lauter Dopplungen")
    // hat gezeigt, dass das kein Einzelfall war, sondern ein Muster:
    // **64 Katalogzeilen können über ihren eigenen Namen nie gefunden
    // werden.** Der Matcher liefert immer eine andere — und in JEDEM der 64
    // Fälle mit einem anderen Preis.
    //
    // Es sind keine Dopplungen. Es sind Staffeln, und die unterscheidende
    // Angabe steht in Klammern, die die Normalisierung wegwirft:
    //
    //   PV-Anlage anschließen (bis 10 kWp)        850 €
    //   PV-Anlage anschließen (>10 kWp)         1.400 €   → bekam 850 €
    //   Personenaufzug (2–4 Haltestellen)      28.000 €
    //   Personenaufzug (5–8 Haltestellen)      38.000 €   → bekam 28.000 €
    //
    // Die Richtung ist immer dieselbe: Es gewinnt die Zeile, die weiter oben
    // steht — und das ist bei einer Staffel die kleinste. **Der Betrieb
    // rechnet systematisch zu billig ab**, bis zu 10.000 € bei einem Aufzug.
    //
    // Vierter Fall derselben Familie an einem Tag (nach Millimeterspanne,
    // Grundierungsart und Epoxid-Schicht): Was eine Zeile von der anderen
    // unterscheidet, steht in Klammern — und Klammern wirft die
    // Normalisierung weg. Deshalb wird es hier am ROHTITEL gelesen.
    //
    // Der Vergleichswert enthält die Vorsilbe („bis 10 kWp" ≠ „>10 kWp" ≠
    // „11–25cm"), sonst sähen die Enden einer Spanne gleich aus.
    name: 'Staffel',
    regel: 'nur-unterschied',
    genauerWortlaut: true,
    woerter: [{
      id: 'staffel',
      muster: /(?:(?:bis|ab|über|ueber|unter|max\.?|min\.?|>|<|≥|≤|[–—-])\s*)?(?:(?<![\p{L}\p{N}])(?:dn\s*|ei\s*|r|m)\d+(?:[.,]\d+)?|\d+(?:[.,]\d+)?(?:\s*[x×]\s*\d+(?:[.,]\d+)?)?[\s-]*(?:mm|cm|dm|m²|m2|qm|km|meter|m|kwp|kwh|kw|kva|dn|kg|l|zoll|t|stufen|etagen|haltestellen|stromkreis[\p{L}]*|zimmer|personen|fl(?:ü|ue)gel|\.?\s*og)(?![\p{L}]))/giu,
    }],
  },
  {
    // Gruppe 3, soweit nicht schon Filter: Schichten und Arbeitsgänge.
    // Hier sitzt `Epoxid / Versiegelung — Schicht 2`, das vorher den
    // Schicht-1-Eintrag traf — dieselbe Gedankenstrich-Falle wie TN-093,
    // nur an anderer Stelle. Fiel bisher nur deshalb nicht auf, weil beide
    // 9,00 € kosten.
    name: 'Schicht/Gang',
    regel: 'nur-unterschied',
    genauerWortlaut: true,
    woerter: [
      { id: 'schicht', muster: /schicht\s*\d+|\d+\.?\s*gang(?![\p{L}])/iu },
      // „Schleifgang" mit a, nicht nur „Schleifgänge" mit ä — der Katalog
      // schreibt den Einzahl-Eintrag `(maschinell, 1 Schleifgang)`. Ohne das
      // „a" trug er keinen Marker, und `Parkett abschleifen (2 Schleifgänge)`
      // bekam mit Score 1,00 den 12-€-Preis für EINEN Gang statt 20 € für
      // zwei. Die Sperre sah aus wie eine Sperre und war keine.
      { id: 'gaenge', muster: /\d+\s*schleifg(?:a|ä|ae)ng[\p{L}]*|\d+[\s-]*fach(?![\p{L}])/iu },
      // `einlagig` als Wort UND `2-lagig` als Zahl — der Katalog schreibt
      // beides. `Parkett ölen (maschinell, 2-lagig inkl. Einarbeiten)` (28 €)
      // bekam ohne die Zahlform den 1-lagig-Preis von 20 €.
      w('lagen', `einlagig`, `zweilagig`, `dreilagig`),
      { id: 'lagenZahl', muster: /\d+[\s-]*lagig(?![\p{L}])/iu },
    ],
  },
  {
    // Gruppe 5: Ort und Zugang — und zwar NUR die Fassade.
    //
    // Der Prüfmeister listet hier auch Treppenhaus, Dachschräge, Kniestock,
    // Giebel, Keller, Garage, bewohnt, Altbau. Die habe ich bewusst NICHT
    // aufgenommen: Für die gibt es eigene Zuschlagspositionen (das schreibt
    // er selbst dazu), und beim ersten Anlauf haben sie prompt
    // „Dachschrägen grundieren" von „Grundieren — Tiefengrund" abgeschnitten
    // — obwohl seine eigene Umbenennungstabelle (F.6) genau diese beiden
    // zusammenführen will. Grundierung ist auf der Schräge dieselbe
    // Grundierung.
    //
    // Die Fassade bleibt, weil dafür ein Beleg existiert:
    // `Grundierung / Tiefengrund Fassade` traf den Innen-Tiefengrund
    // (4,50 €) statt eines Fassadenpreises (6,00 €) — „auf einer Fassade
    // sind das schnell 150 €".
    name: 'Ort/Zugang',
    regel: 'beidseitig',
    nurVorRaum: true,
    woerter: [w('fassade', `fassade${L}`)],
  },
]

const RAUM_TRENNER = /\s+[—–-]\s+/

/**
 * Die Aufwandswörter einer Gruppe aus einem Titel — am ROHTITEL, ohne
 * Normalisierung. Ergebnis ist kleingeschrieben und dedupliziert, damit
 * „Verklebt" und „verklebt" dasselbe sind.
 */
export function aufwandMarker(titel: string, gruppe: AufwandGruppe): Set<string> {
  const text = gruppe.nurVorRaum ? (titel ?? '').split(RAUM_TRENNER)[0] : (titel ?? '')
  const marker = new Set<string>()
  for (const wort of gruppe.woerter) {
    // ACHTUNG: Flags mitnehmen, nicht neu setzen. Ein hier verlorenes `u`
    // schaltet `\p{L}` still ab — dann ist `(?![\p{L}])` bloß „nicht p, {,
    // L oder }" und JEDE Wortgrenze trifft. Genau so hat `Ölfarbe` als
    // „ölen" gezählt und `Fenster lackieren (Ölfarbe, 2× Anstrich)` seinen
    // 55-€-Preis verloren. Der Fehler war unsichtbar: Die Muster sahen
    // richtig aus, nur lief ein anderes Muster.
    const flags = wort.muster.flags.includes('g') ? wort.muster.flags : `${wort.muster.flags}g`
    const treffer = text.match(new RegExp(wort.muster.source, flags))
    if (!treffer) continue
    // Bei Maßen und Schichten IST die Zahl die Bedeutung — dort zählt die
    // gefundene Stelle (Leerzeichen vereinheitlicht: „3 mm" = „3mm").
    // Überall sonst zählt der kanonische Name, nicht die Wortform.
    if (gruppe.genauerWortlaut) {
      for (const t of treffer) marker.add(`${wort.id}:${t.toLocaleLowerCase('de-DE').replace(/\s+/g, '')}`)
    } else {
      marker.add(wort.id)
    }
  }
  return marker
}

function gleich(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false
  for (const x of a) if (!b.has(x)) return false
  return true
}

/**
 * Wie hart ein Aufwandswort sperrt.
 *
 * ── Warum zwei Stufen und nicht eine ──────────────────────────────────────
 *
 * Der erste Anlauf hat beide Richtungen gleich hart gesperrt. Ergebnis:
 * `Schimmelbehandlung` fand keinen Preis mehr, weil die einzige passende
 * Katalogzeile `Schimmelbehandlung / Grundierung` heißt — der Katalog
 * bündelt dort zwei Schritte, und ein unbündelter Eintrag existiert nicht.
 * Der Handwerker hätte für eine saubere Position 0,00 € bekommen.
 *
 * Dieselbe Lage wie bei `Parkett schleifen` → `Parkett schleifen +
 * versiegeln komplett`, nur mit anderem Ausgang: Dort GIBT es den
 * unbündelten Eintrag (20,00 €), hier nicht. Der Unterschied ist also nicht
 * die Regel, sondern ob eine Alternative im Katalog steht — und das kann
 * diese Funktion nicht wissen, der Matcher aber sehr wohl.
 *
 * Deshalb:
 *   'hart'      — kommt nie in Frage. Das gesuchte Wort fehlt dem Kandidaten
 *                 (Manfreds Fall: „verklebt" darf nie den Preis für „lose"
 *                 bekommen), oder beide tragen etwas Verschiedenes
 *                 (bis 30 mm ≠ bis 3 mm).
 *   'nachrang'  — der KANDIDAT bringt einen Arbeitsgang mit, den keiner
 *                 bestellt hat. Nur einsetzen, wenn sonst gar nichts passt —
 *                 dann ist ein gebündelter Preis besser als keiner, und der
 *                 Handwerker sieht die Position im Entwurf.
 */
export type AufwandSperrGrad = 'hart' | 'nachrang'

export interface AufwandBefund {
  grad: AufwandSperrGrad
  gruppe: string
}

/** Ist `a` ganz in `b` enthalten? */
function teilmenge(a: Set<string>, b: Set<string>): boolean {
  for (const x of a) if (!b.has(x)) return false
  return true
}

/**
 * Bündelt der Titel mehrere Arbeitsgänge, statt sie zur Wahl zu stellen?
 *
 * „Raufaser tapezieren + überstreichen 1x" und „Parkett schleifen und ölen"
 * enthalten beide Gänge im Preis. „Tür streichen / lackieren" stellt sie zur
 * Wahl. Das Zeichen dazwischen ist der ganze Unterschied — und es ist das
 * einzige Signal, das der Katalog dafür hat.
 */
function istBuendel(titel: string): boolean {
  return /\s\+\s|\s&\s|\sund\s|\sinkl\.?\s|\sinklusive\s/i.test(titel ?? '')
}

export function aufwandSperre(gesuchterTitel: string, kandidatTitel: string): AufwandBefund | null {
  let nachrang: AufwandBefund | null = null
  for (const gruppe of AUFWAND_GRUPPEN) {
    const a = aufwandMarker(gesuchterTitel, gruppe)
    const b = aufwandMarker(kandidatTitel, gruppe)
    if (a.size === 0 && b.size === 0) continue
    if (a.size > 0 && b.size > 0) {
      if (gruppe.regel === 'kein-schnitt') {
        // Eine Sammelzeile deckt mehrere Werkstoffe ab — eine Überschneidung
        // genügt. Erst wenn gar keiner passt, ist der Treffer ausgeschlossen.
        let schnitt = false
        for (const x of a) if (b.has(x)) { schnitt = true; break }
        if (!schnitt) return { grad: 'hart', gruppe: gruppe.name }
        continue
      }
      if (!gleich(a, b)) {
        // Sammelzeile: „Tür streichen / lackieren" bietet beide Gänge an.
        // Wer einen davon sucht, sucht diese Zeile — es sei denn, die Zeile
        // bündelt (Plus/und), dann ist der zweite Gang nicht wählbar,
        // sondern mitgekauft.
        if (gruppe.sammelzeile && !istBuendel(kandidatTitel) && teilmenge(a, b)) continue
        return { grad: 'hart', gruppe: gruppe.name }
      }
      continue
    }
    if (gruppe.regel === 'nur-unterschied' || gruppe.regel === 'kein-schnitt') continue
    // Das gesuchte Wort fehlt dem Kandidaten — der kann es nie sein.
    if (a.size > 0) return { grad: 'hart', gruppe: gruppe.name }
    if (gruppe.regel === 'nur-gesucht') continue
    // Der Kandidat bringt etwas mit, das nicht bestellt wurde.
    nachrang ??= { grad: 'nachrang', gruppe: gruppe.name }
  }
  return nachrang
}
