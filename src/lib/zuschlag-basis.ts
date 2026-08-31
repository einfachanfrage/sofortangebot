/**
 * Erschwerniszuschläge als Prozentsatz — Sandys Entscheidung vom 2026-08-31
 * (PM-008/PM-015): „Prozent. Katalog ist die Referenz, die Generierung wird
 * angepasst."
 *
 * Vorher trugen die generierten Zuschlagspositionen die Einheit „Pauschale",
 * der VOB-Teil des Katalogs dagegen „%" (`zuschlag_typ: 'prozent'`) — der
 * Preis-Matcher besteht auf exakter Einheiten-Übereinstimmung, also fand ein
 * Zuschlag nie seinen Katalogpreis und stand mit 0,00 € im Angebot.
 *
 * Ein Prozentsatz allein ergibt aber keinen Betrag. Er braucht eine
 * Bemessungsgrundlage — die Summe der Leistungen, auf die er sich bezieht.
 * Die steht erst fest, wenn alle anderen Positionen ihren Preis haben,
 * deshalb wird sie in `angebot-generieren` gerechnet und nicht schon in der
 * Vollständigkeitsprüfung.
 *
 * Darstellung im Angebot bleibt bewusst innerhalb des vorhandenen Schemas
 * (Menge × Einzelpreis = Gesamtpreis, so rechnen PDF, Entwurfsansicht und
 * `quotes/create` einheitlich):
 *
 *   Menge = Prozentsatz (15) · Einheit = % · Einzelpreis = Euro je
 *   Prozentpunkt (Bemessungsgrundlage / 100) · Gesamt = beides multipliziert
 *
 * Damit stimmt jede Summe ohne Sonderfall, der Handwerker kann den Satz
 * direkt auf 20 % ändern und der Betrag skaliert richtig mit.
 */

export const ZUSCHLAG_EINHEIT = '%'

export function istProzentZuschlag(einheit: string | null | undefined): boolean {
  return (einheit ?? '').trim() === ZUSCHLAG_EINHEIT
}

/** „Erschwerniszuschlag Raumhöhe > 3m — Büro" → „Büro" */
export function raumAusTitel(titel: string): string | null {
  const treffer = titel.match(/ — (.+)$/)
  return treffer ? treffer[1].trim() : null
}

/**
 * Ein Zuschlag darf nie Teil der eigenen Bemessungsgrundlage sein — weder
 * über die Einheit „%" noch als Alt-Position mit „Pauschale", die in
 * bestehenden Angeboten und Preisdatenbanken noch herumliegt.
 */
export function istZuschlagsPosition(titel: string, einheit: string): boolean {
  return istProzentZuschlag(einheit) || /^\s*(?:erschwerniszuschlag|zuschlag)\b/i.test(titel)
}

export interface ZuschlagsZeile {
  title: string
  quantity: number
  unit: string
  unit_price: number
}

/**
 * Bemessungsgrundlage in Euro. Trägt der Zuschlag einen Raum im Titel und
 * gibt es Positionen für genau diesen Raum, zählt nur dieser Raum — das ist
 * die Rechenseite von Sandys PM-024-Entscheidung („jeder Raum einzeln",
 * Begründung: ein Raum kann den Zuschlag zu Recht nicht bekommen). Sonst
 * das ganze Angebot.
 */
export function bemessungsgrundlage(zeilen: ZuschlagsZeile[], raum: string | null): number {
  const echteLeistungen = zeilen.filter(z => !istZuschlagsPosition(z.title, z.unit))
  // Nennt der Zuschlag einen Raum, zählt AUSSCHLIESSLICH dieser Raum — auch
  // wenn dort (nicht mehr) eine einzige Leistung steht. Ein Rückfall auf das
  // ganze Angebot wäre in dem Fall ein stiller Rechenfehler nach oben: der
  // Zuschlag für einen leeren Raum stünde plötzlich auf der Summe aller
  // anderen Räume. Lieber sichtbar 0,00 € als unbemerkt zu viel.
  const basis = raum ? echteLeistungen.filter(z => raumAusTitel(z.title) === raum) : echteLeistungen
  return basis.reduce((summe, z) => summe + z.quantity * z.unit_price, 0)
}

/**
 * Euro je Prozentpunkt, auf Cent gerundet: was auf dem Angebot steht, ist
 * genau das, was mal der Menge den Gesamtpreis ergibt — keine unsichtbare
 * Nachkommastelle zwischen Anzeige und Summe.
 */
export function euroJeProzentpunkt(basis: number): number {
  return Math.round(basis) / 100
}

export function zuschlagBerechnungsweg(prozent: number, basis: number, raum: string | null): string {
  const euro = basis.toFixed(2).replace('.', ',')
  return `${prozent} % auf ${euro} € ${raum ? `(Leistungen ${raum})` : '(Leistungen dieses Angebots)'}`
}

export interface ZuschlagsItem extends ZuschlagsZeile {
  berechnungsweg?: string | null
}

/**
 * Rechnet alle Prozent-Zuschläge einer Positionsliste zu echtem Geld.
 * Verändert die Liste an Ort und Stelle, weil genau das der Aufrufer
 * (`angebot-generieren`) braucht — und lebt hier statt dort, damit der
 * Geldweg testbar ist, ohne eine Datenbank zu brauchen.
 *
 * `hatKatalogpreis(index)` entscheidet, ob es einen Katalogtreffer gab. Ohne
 * Treffer bleibt die Position unangetastet und läuft wie jede andere in das
 * sichtbare „Preis fehlt" — geschätzt wird hier nichts.
 */
export function wendeProzentZuschlaegeAn(
  items: ZuschlagsItem[],
  hatKatalogpreis: (index: number) => boolean,
): void {
  // Die Bemessungsgrundlage wird EINMAL aus dem Ausgangszustand gebildet.
  // Sonst würde ein bereits umgerechneter Zuschlag die Grundlage des
  // nächsten verändern — zwei Zuschläge auf denselben Raum müssen aber
  // beide auf derselben Zahl stehen.
  const zeilen = items.map(i => ({ title: i.title, quantity: i.quantity, unit: i.unit, unit_price: i.unit_price }))
  items.forEach((item, index) => {
    if (!istProzentZuschlag(item.unit) || !hatKatalogpreis(index)) return
    const prozent = item.unit_price
    const raum = raumAusTitel(item.title)
    const basis = bemessungsgrundlage(zeilen, raum)
    item.quantity = prozent
    item.unit_price = euroJeProzentpunkt(basis)
    const weg = zuschlagBerechnungsweg(prozent, basis, raum)
    item.berechnungsweg = item.berechnungsweg ? `${item.berechnungsweg} · ${weg}` : weg
  })
}

export interface ZuschlagsAngebotsPosition extends ZuschlagsZeile {
  total_price: number
}

/**
 * CoS-026: Zuschläge in einem BEREITS bepreisten Angebot nachziehen, wenn der
 * Handwerker die Grundlage im Editor geändert hat (Menge korrigiert, Position
 * gelöscht, neue dazugestellt).
 *
 * Unterschied zu `wendeProzentZuschlaegeAn`: dort kommt der Prozentsatz frisch
 * aus dem Katalog und steht noch im Einzelpreis. Hier steht er längst da, wo
 * er hingehört — in der Menge —, und nur der Einzelpreis (Euro je
 * Prozentpunkt) muss der neuen Grundlage folgen.
 *
 * Gibt bei unveränderter Lage EXAKT dieselbe Array-Instanz zurück. Darauf
 * verlässt sich der Aufrufer in der Bearbeiten-Ansicht: so lässt sich das
 * Ergebnis gefahrlos in einem Effekt zurückschreiben, ohne eine Schleife zu
 * bauen.
 *
 * `istGeschuetzt` hält CoS-014 ein: einen Zuschlag, den der Handwerker selbst
 * angefasst hat, rechnet niemand mehr um. Seine Zahl gewinnt.
 */
export function aktualisiereProzentZuschlaege<T extends ZuschlagsAngebotsPosition>(
  items: T[],
  istGeschuetzt: (item: T) => boolean = () => false,
): T[] {
  const zeilen = items.map(i => ({ title: i.title, quantity: i.quantity, unit: i.unit, unit_price: i.unit_price }))
  let geaendert = false
  const naechste = items.map(item => {
    if (!istProzentZuschlag(item.unit) || istGeschuetzt(item)) return item
    const basis = bemessungsgrundlage(zeilen, raumAusTitel(item.title))
    const einzelpreis = euroJeProzentpunkt(basis)
    const gesamt = Math.round(item.quantity * einzelpreis * 100) / 100
    if (einzelpreis === item.unit_price && gesamt === item.total_price) return item
    geaendert = true
    return { ...item, unit_price: einzelpreis, total_price: gesamt }
  })
  return geaendert ? naechste : items
}
