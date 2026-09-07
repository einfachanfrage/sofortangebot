// Welche Maße gehören auf die Raumkarte?
//
// ── PM-034, Nachtest 05.09.2026 (Sandys Live-Lauf) ───────────────────────
// Im Esszimmer eines REINEN Bodenauftrags stand „Raumhöhe !" — ein rotes
// Ausrufezeichen für eine Angabe, die in diesem Angebot nirgends gebraucht
// wird. In der Küche daneben stand es nicht. Der Unterschied zwischen den
// beiden Räumen war eine einzige Position:
//
//     Esszimmer: „Estrich grundieren"
//
// Die Prüfung stand auf einer Wortliste, in der `grundier` als
// Wandarbeit galt. Estrich grundiert man aber am Boden. Ein Wort, das für
// beide Gewerke dasselbe heißt, hat den Raum zum Malerraum gemacht.
//
// Ein „!" an einer Zahl, die niemand braucht, kostet Vertrauen wie eine
// falsche Zahl — der Handwerker sucht nach einer Lücke, die es nicht gibt.
// Deshalb steht die Entscheidung jetzt hier, mit Tests, statt als Regex in
// einer 2000-Zeilen-Komponente.

/**
 * Gegenstände, die es nur an der Wand oder an der Decke gibt. Kommt eines
 * davon vor, ist der Raum ohne Weiteres wandrelevant — auch zusammen mit
 * einem Boden-Wort („Wandfliesen" neben „Bodenfliesen").
 */
const WAND_OBJEKT = /w[äa]nd|decke|tapete|stuck|akzent|dachschr[äa]g|kniestock|leibung|fassade|giebel/i

/**
 * Tätigkeiten, die es in BEIDEN Gewerken gibt. Sie allein sagen nichts —
 * gespachtelt, grundiert und gestrichen wird oben wie unten.
 */
const ARBEIT_MEHRDEUTIG = /spachtel|gl[äa]tt|grundier|voranstrich|streich|lackier|schleif/i

/**
 * Gegenstände, die eindeutig am Boden liegen. Stehen sie im selben Titel wie
 * eine mehrdeutige Tätigkeit, gewinnt der Boden.
 */
const BODEN_OBJEKT = /estrich|boden|untergrund|parkett|laminat|v[ie]nyl|teppich|linoleum|kork|sockelleist|fu(?:ß|ss)leist|altbelag|trittschall|dielen|treppenstufe/i

/**
 * Dachgeschoss: Kniestock, Dachschrägen, Deckenspiegel. Solche Räume haben
 * keine sinnvolle EINE Raumhöhe — die Flächen stehen bereits fest, weil sie
 * einzeln genannt wurden.
 *
 * PM-030, Befund 3 (Prüfmeister, 04.09.2026): „Bei einem Raum mit Kniestock
 * und Dachschrägen gibt es keine sinnvolle einzelne Raumhöhe; die Flächen
 * stehen bereits fest. Die Warnung ist also folgenlos und verunsichert nur."
 * Für reine Bodenaufträge ist sie am 05.09. schon verschwunden — derselbe
 * Gedanke, dieselbe Stelle.
 */
const DACHGESCHOSS = /kniestock|dachschr[äa]g|deckenspiegel|dachfl[äa]che/i

/**
 * Braucht dieser Raum die Wandmaße (Raumhöhe, Türen, Fenster)?
 *
 * Nur dann werden sie auf der Karte gezeigt — und nur dann ist ein fehlender
 * Wert eine echte Lücke. Bei einem reinen Bodenauftrag ist die Raumhöhe
 * keine fehlende Angabe, sondern eine Angabe, die niemand braucht.
 */
export function brauchtWandmasse(positionsTitel: (string | null | undefined)[]): boolean {
  return positionsTitel.some(titel => {
    const t = titel ?? ''
    if (WAND_OBJEKT.test(t)) return true
    return ARBEIT_MEHRDEUTIG.test(t) && !BODEN_OBJEKT.test(t)
  })
}

/**
 * Braucht dieser Raum eine RAUMHÖHE?
 *
 * Beim Einbau von PM-030, Befund 3 gemerkt: Das sind ZWEI Fragen, nicht eine.
 * „Hat der Raum Wandarbeiten?" (dann gehören Türen und Fenster auf die Karte,
 * im Dachgeschoss auch das Dachfenster) und „Wird eine Raumhöhe gebraucht?"
 * — im Dachgeschoss lautet die erste Antwort ja und die zweite nein, weil
 * Kniestockhöhe und Schrägenflächen einzeln genannt sind.
 *
 * Der erste Versuch hat beides in `brauchtWandmasse` zusammengeworfen und
 * damit auch das Dachfenster von der Karte genommen — ausgerechnet die Zahl,
 * die in die Schrägenfläche eingeht. Zwei Tests von gestern haben das sofort
 * gefangen. Deshalb zwei Funktionen.
 */
export function brauchtRaumhoehe(positionsTitel: (string | null | undefined)[]): boolean {
  if (positionsTitel.some(t => DACHGESCHOSS.test(t ?? ''))) return false
  return brauchtWandmasse(positionsTitel)
}
