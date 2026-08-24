// CoS-014 (2026-08-24, Sandys Auftrag „fix das"): Handänderungen des
// Handwerkers vor einer späteren Neu-Berechnung schützen.
//
// Ausgangslage: Eine manuell geänderte Position hat eine Neu-Berechnung
// bisher nur ZUFÄLLIG überlebt — `generiere-positionen` arbeitet rein additiv
// (nur INSERT, nie UPDATE/DELETE), bestehende Zeilen wurden deshalb nie
// angefasst. Einen echten „das war ich"-Schutz gab es nicht. Zwei Löcher
// blieben dadurch offen:
//   1. Der Dublettenschutz vergleicht Titel UND Menge exakt. Ändert jemand
//      die Menge von Hand, entsteht bei der nächsten Berechnung eine
//      fast-gleiche Zeile DANEBEN statt dass die eigene Version gewinnt.
//   2. Eine gelöschte Position kam kommentarlos zurück — Löschen hinterlässt
//      keine Spur, an der sich die Berechnung orientieren könnte.
//
// Lösung bewusst über EINE Liste am Angebot (`quotes.manuell_bearbeitete_positionen`)
// statt über ein Flag je Zeile: Der Löschfall hat gar keine Zeile mehr, an
// der ein Flag hängen könnte — eine Liste von Titeln deckt Ändern, Löschen
// und Selbst-Hinzufügen mit demselben Mechanismus ab.
//
// Der Titel ist hier bewusst die Identität: Er trägt im ganzen Produkt schon
// die Raum-Zuordnung als Suffix („Wandflächen streichen — Flur") und ist
// genau das, was die Engine bei einer Neu-Berechnung wieder erzeugen würde.

/** Vergleichsform eines Positionstitels (Groß/klein und Mehrfach-Leerzeichen egal). */
export function positionsSchluessel(titel: string): string {
  return titel.toLocaleLowerCase('de-DE').replace(/\s+/g, ' ').trim()
}

export interface PositionsStand {
  id: string
  title: string
  description?: string | null
  quantity: number
  unit: string
  unit_price: number
}

/** Zahlenvergleich mit Toleranz — Cent- und Rundungsrauschen ist keine Änderung. */
function gleicheZahl(a: number, b: number): boolean {
  return Math.abs((a ?? 0) - (b ?? 0)) < 0.0001
}

function istUnveraendert(alt: PositionsStand, neu: PositionsStand): boolean {
  return positionsSchluessel(alt.title) === positionsSchluessel(neu.title)
    && gleicheZahl(alt.quantity, neu.quantity)
    && gleicheZahl(alt.unit_price, neu.unit_price)
    && (alt.unit ?? '').trim() === (neu.unit ?? '').trim()
    && (alt.description ?? '').trim() === (neu.description ?? '').trim()
}

/**
 * Titel, die der Handwerker in diesem Speichervorgang angefasst hat —
 * geändert, gelöscht oder selbst hinzugefügt. Bei einer Änderung zählt der
 * URSPRÜNGLICHE Titel (unter dem würde die Engine die Position wieder
 * anlegen); wurde auch der Titel geändert, zählen beide.
 */
export function ermittleHandaenderungen(
  original: PositionsStand[],
  bearbeitet: PositionsStand[],
): string[] {
  const titel: string[] = []
  const merke = (t: string) => {
    const sauber = (t ?? '').trim()
    if (sauber && !titel.some(v => positionsSchluessel(v) === positionsSchluessel(sauber))) titel.push(sauber)
  }

  const nachId = new Map(original.map(p => [p.id, p]))
  const nochVorhanden = new Set<string>()

  for (const neu of bearbeitet) {
    const alt = nachId.get(neu.id)
    if (!alt) {
      merke(neu.title) // selbst hinzugefügt
      continue
    }
    nochVorhanden.add(neu.id)
    if (istUnveraendert(alt, neu)) continue
    merke(alt.title)
    merke(neu.title)
  }

  for (const alt of original) {
    if (!nochVorhanden.has(alt.id)) merke(alt.title) // gelöscht
  }

  return titel
}

/** Trennt neu berechnete Positionen in „darf rein" und „Hand des Handwerkers gewinnt". */
export function trenneGeschuetzte<T extends { title: string }>(
  neue: T[],
  geschuetzteTitel: string[] | null | undefined,
): { behalten: T[]; geschuetzt: T[] } {
  if (!geschuetzteTitel?.length) return { behalten: neue, geschuetzt: [] }
  const gesperrt = new Set(geschuetzteTitel.map(positionsSchluessel))
  const behalten: T[] = []
  const geschuetzt: T[] = []
  for (const item of neue) {
    if (gesperrt.has(positionsSchluessel(item.title))) geschuetzt.push(item)
    else behalten.push(item)
  }
  return { behalten, geschuetzt }
}

/**
 * Hinweistext für den Handwerker. Bewusst nicht warnend-rot gemeint, sondern
 * erklärend: er soll sehen, dass etwas NICHT passiert ist, und warum.
 */
export function handaenderungsHinweis(geschuetzt: Array<{ title: string }>): string | null {
  const titel: string[] = []
  for (const g of geschuetzt) {
    const sauber = (g.title ?? '').trim()
    if (sauber && !titel.some(v => positionsSchluessel(v) === positionsSchluessel(sauber))) titel.push(sauber)
  }
  if (titel.length === 0) return null
  const sichtbar = titel.slice(0, 3).join(', ')
  const rest = titel.length > 3 ? ` und ${titel.length - 3} weitere` : ''
  return titel.length === 1
    ? `„${sichtbar}" hast du selbst angepasst — deine Fassung bleibt stehen, sie wurde nicht neu berechnet.`
    : `Diese Positionen hast du selbst angepasst — deine Fassung bleibt stehen, sie wurden nicht neu berechnet: ${sichtbar}${rest}.`
}
