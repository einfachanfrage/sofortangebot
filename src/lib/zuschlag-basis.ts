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

import { ERSCHWERNIS_ARTEN } from './erschwernis'

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

// ── CoS-043, Sandys Entscheidung vom 04.09.2026 ──────────────────────────
//
// Nicht alle Prozent-Zuschläge stehen auf derselben Grundlage, und das hängt
// davon ab, WORAN sie hängen:
//
//   * zeitbezogen (Wochenende, Feiertag, Nacht, Notdienst) — sie hängen daran,
//     WANN gearbeitet wird. Wer samstags kommt, arbeitet samstags an allem.
//     Grundlage: das ganze Angebot. Neun der vierzehn Einträge.
//   * objektbezogen (Denkmalschutz, Sondermaße/Sonderform, exotische Holzart)
//     — sie hängen daran, WORAN gearbeitet wird. Sandy dazu wörtlich:
//     „exotische Holzart auf Malerarbeiten will ich nicht im Produkt haben."
//     Grundlage: nur die Leistungen desselben Gewerks. Fünf Einträge.
//
// Der zweite Punkt ist mehr als Kosmetik: Denkmalschutz steht mit drei
// verschiedenen Sätzen im Katalog (Putz 30 %, Schreiner 30 %, Dach 35 %) —
// den Dach-Satz auf Putzarbeiten anzuwenden wäre schlicht der falsche Satz.
const ZUSCHLAG_ZEITBEZOGEN =
  /wochenend|feiertag|notdienst|nachtarbeit|soforthilfe|au(?:ß|ss)erhalb der gesch[äa]ftszeiten/i
const ZUSCHLAG_OBJEKTBEZOGEN = /denkmalschutz|sonderma(?:ß|ss)|sonderform|holzart/i

// ── CoS-E-083 §3 / PM-104, Sandys Freigabe vom 17.09.2026 ────────────────
//
// Die fünf Erschwerniszuschläge, die die Vollständigkeitsprüfung selbst
// erzeugt (Altbau, Denkmalschutz, bewohnt, schwieriger Untergrund,
// Raumhöhe), standen bis hierher auf der ganzen Angebotssumme. Am Angebot
// aus PM-104 gemessen: `Erschwerniszuschlag Altbau 20 %` rechnete auf
// 2.301,14 € — also auch auf Leistungen, die kein Maler erbringt.
//
// Alle fünf hängen am Objekt und nicht an der Arbeitszeit: ein Altbau ist
// ein Altbau, gleich wann gearbeitet wird. Damit gilt für sie dieselbe
// Regel wie für die fünf objektbezogenen Katalog-Zuschläge — Grundlage sind
// ausschließlich die Leistungen desselben Gewerks. Ein Raum im Titel engt
// zusätzlich ein, wie bisher; die beiden Filter widersprechen sich nicht,
// sie stehen hintereinander.
//
// **Keine Änderung an den Prozentsätzen** — deren Höhe ist eine getrennte
// offene Frage bei Sandy.
//
// Bewusst aus `ERSCHWERNIS_ARTEN` abgeleitet statt als zweite Wortliste
// danebengestellt: diese Liste ist die eine Stelle, an der steht, welche
// Erschwerniszuschläge es überhaupt gibt (`erschwernis.ts` sagt das
// ausdrücklich über sich selbst). Die sechste Art, die dort einmal
// dazukommt, ist damit von selbst richtig eingeordnet, statt hier
// vergessen zu werden.
const ZUSCHLAG_ERSCHWERNIS_TITEL: readonly RegExp[] = ERSCHWERNIS_ARTEN.map(a => a.titel)

/** Hängt dieser Zuschlag am Gegenstand statt an der Arbeitszeit? */
export function istObjektbezogenerZuschlag(titel: string): boolean {
  if (ZUSCHLAG_ZEITBEZOGEN.test(titel)) return false
  if (ZUSCHLAG_ERSCHWERNIS_TITEL.some(r => r.test(titel))) return true
  return ZUSCHLAG_OBJEKTBEZOGEN.test(titel)
}

/**
 * Gewerk aus der Katalogkategorie: „Dach – Erschwernisse & Zuschläge" → „dach".
 * Bewusst über die Kategorie und nicht über den Titel — „Zuschlag Denkmalschutz
 * / historische Eindeckung" nennt sein Gewerk nirgends, die Kategorie schon.
 */
export function gewerkAusKategorie(kategorie: string | null | undefined): string | null {
  const kopf = (kategorie ?? '').split(/[–—-]/)[0].trim().toLocaleLowerCase('de-DE')
  return kopf || null
}

export interface ZuschlagsZeile {
  title: string
  quantity: number
  unit: string
  unit_price: number
  /** Katalogkategorie, falls bekannt — Grundlage für die Gewerke-Zuordnung. */
  kategorie?: string | null
}

/**
 * Bemessungsgrundlage in Euro. Trägt der Zuschlag einen Raum im Titel und
 * gibt es Positionen für genau diesen Raum, zählt nur dieser Raum — das ist
 * die Rechenseite von Sandys PM-024-Entscheidung („jeder Raum einzeln",
 * Begründung: ein Raum kann den Zuschlag zu Recht nicht bekommen). Sonst
 * das ganze Angebot.
 */
export function bemessungsgrundlage(
  zeilen: ZuschlagsZeile[],
  raum: string | null,
  /** Gesetzt nur bei objektbezogenen Zuschlägen mit bekanntem Gewerk. */
  gewerk: string | null = null,
): number {
  const echteLeistungen = zeilen.filter(z => !istZuschlagsPosition(z.title, z.unit))
  // Nennt der Zuschlag einen Raum, zählt AUSSCHLIESSLICH dieser Raum — auch
  // wenn dort (nicht mehr) eine einzige Leistung steht. Ein Rückfall auf das
  // ganze Angebot wäre in dem Fall ein stiller Rechenfehler nach oben: der
  // Zuschlag für einen leeren Raum stünde plötzlich auf der Summe aller
  // anderen Räume. Lieber sichtbar 0,00 € als unbemerkt zu viel.
  const nachRaum = raum ? echteLeistungen.filter(z => raumAusTitel(z.title) === raum) : echteLeistungen
  // Dasselbe Prinzip beim Gewerk: Ist der Zuschlag objektbezogen und sein
  // Gewerk bekannt, zählen ausschließlich Leistungen dieses Gewerks. Zeilen
  // ohne Kategorie bleiben draußen — sie einzurechnen wäre wieder die stille
  // Rechnung nach oben.
  const basis = gewerk
    ? nachRaum.filter(z => gewerkAusKategorie(z.kategorie) === gewerk)
    : nachRaum
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

export function zuschlagBerechnungsweg(
  prozent: number,
  basis: number,
  raum: string | null,
  gewerk: string | null = null,
): string {
  // CoS-E-092 (21.09.2026) · dieselbe Zahl, dieselbe Schreibweise.
  //
  // Bis hierhin stand auf dem Kundenpapier „20 % auf 2301,14 €“ — und EINE
  // ZEILE DANEBEN, in der Betragsspalte, „2.301,14 €“. Dieselbe Zahl in zwei
  // Schreibweisen nebeneinander liest sich wie ein Rechenfehler, und genau
  // nachrechnen soll der Kunde hier ja.
  //
  // `toFixed(2)` bleibt vorne stehen, damit die Rundung dieselbe ist wie
  // bisher; `toLocaleString` setzt danach nur noch die Gruppierung — dieselbe
  // Form, die die Betragsspalte in `AngebotDetail.tsx` benutzt.
  //
  // ⚠ Diese Zeichenkette läuft in der App (CoS-E-090), in der Vorschau und
  // im PDF (DC-137) durch `mitDeutschenZahlen()`. Ohne die Ausnahme für
  // deutsche Tausenderzahlen, die der Designer in DC-138 (`zahlen-text.ts`)
  // gebaut hat, stünde hier ab sofort „2,301,14 €“. Die beiden Hälften
  // gehören zusammen — wer eine davon zurücknimmt, nimmt beide zurück.
  const euro = Number(basis.toFixed(2))
    .toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const bezug = raum
    ? `(Leistungen ${raum})`
    : gewerk
      ? `(Leistungen ${gewerk.charAt(0).toLocaleUpperCase('de-DE')}${gewerk.slice(1)})`
      : '(Leistungen dieses Angebots)'
  return `${prozent} % auf ${euro} € ${bezug}`
}

/**
 * Der Leser zu `zuschlagBerechnungsweg()` — bewusst direkt daneben, nach der
 * Lehre aus DC-125/DC-135: wer einen Satz zusammensetzt, schreibt auch den,
 * der ihn wieder auseinandernimmt. Sonst entsteht die zweite, leicht andere
 * Fassung derselben Bedingung an einer fremden Stelle.
 *
 * Gebraucht wird er auf dem Kundenpapier (DC-137 / PD-018 §3): dort darf ein
 * Prozentsatz nie ohne seine Bemessungsgrundlage stehen. Der Handwerker kann
 * den Rechenweg je Angebot abschalten (DC-050) — dann bliebe von einer
 * Zuschlagszeile „15 % × 4,56 €“ übrig, und 4,56 € ist für den Kunden keine
 * nachvollziehbare Zahl: es sind Euro je Prozentpunkt, eine reine
 * Rechenhilfe (siehe Kopf dieser Datei).
 *
 * Gibt `null` zurück, wenn der Satz keine Grundlage nennt — dann steht nichts
 * da, statt etwas Erfundenem.
 */
const ZUSCHLAG_BEZUG_MUSTER = /\d+(?:[.,]\d+)?\s*%\s+auf\s+[\d.,]+\s*€\s+\([^)]*\)/

export function zuschlagsBezugAus(berechnungsweg: string | null | undefined): string | null {
  const treffer = (berechnungsweg ?? '').match(ZUSCHLAG_BEZUG_MUSTER)
  return treffer ? treffer[0] : null
}

export interface ZuschlagsItem extends ZuschlagsZeile {
  berechnungsweg?: string | null
}

/**
 * Das Gewerk, auf das ein Zuschlag sich beschränkt — oder null, wenn er auf
 * dem ganzen Angebot steht. Null auch dann, wenn der Zuschlag objektbezogen
 * ist, sein Gewerk aber unbekannt ist (frei getippte Position ohne
 * Katalogbezug): dann bleibt es beim bisherigen Verhalten, statt still auf 0 zu
 * fallen.
 */
function gewerkFuerZuschlag(titel: string, kategorie: string | null | undefined): string | null {
  return istObjektbezogenerZuschlag(titel) ? gewerkAusKategorie(kategorie) : null
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
  const zeilen = items.map(i => ({ title: i.title, quantity: i.quantity, unit: i.unit, unit_price: i.unit_price, kategorie: i.kategorie }))
  items.forEach((item, index) => {
    if (!istProzentZuschlag(item.unit) || !hatKatalogpreis(index)) return
    const prozent = item.unit_price
    const raum = raumAusTitel(item.title)
    const gewerk = gewerkFuerZuschlag(item.title, item.kategorie)
    const basis = bemessungsgrundlage(zeilen, raum, gewerk)
    item.quantity = prozent
    item.unit_price = euroJeProzentpunkt(basis)
    const weg = zuschlagBerechnungsweg(prozent, basis, raum, gewerk)
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
  /**
   * Katalogkategorie je Position — im Editor über `price_item_id` auflösbar.
   * Ohne diese Auskunft bleibt es beim Verhalten von vorher (ganzes Angebot);
   * geraten wird nichts.
   */
  kategorieVon: (item: T) => string | null | undefined = () => null,
): T[] {
  const zeilen = items.map(i => ({ title: i.title, quantity: i.quantity, unit: i.unit, unit_price: i.unit_price, kategorie: kategorieVon(i) }))
  let geaendert = false
  const naechste = items.map(item => {
    if (!istProzentZuschlag(item.unit) || istGeschuetzt(item)) return item
    const gewerk = gewerkFuerZuschlag(item.title, kategorieVon(item))
    const basis = bemessungsgrundlage(zeilen, raumAusTitel(item.title), gewerk)
    const einzelpreis = euroJeProzentpunkt(basis)
    const gesamt = Math.round(item.quantity * einzelpreis * 100) / 100
    if (einzelpreis === item.unit_price && gesamt === item.total_price) return item
    geaendert = true
    return { ...item, unit_price: einzelpreis, total_price: gesamt }
  })
  return geaendert ? naechste : items
}
