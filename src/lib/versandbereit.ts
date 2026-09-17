// Darf dieses Angebot zum Kunden? — EINE Stelle für alle Wege dorthin.
//
// Aus Manfreds Testlauf (11.09.2026) kamen vier Meldungen, die dieselbe
// Lücke beschreiben:
//
//   CoS-E-004 / TN-008  „Erschwerniszuschlag – 1 Pauschale – 0,00 €" auf dem
//                       Kunden-PDF. „Eine 0-€-Zeile geht nie."
//   CoS-E-035 / TN-090  Ein Angebot mit „Boden schützen 0,00 €" ist
//                       rausgegangen UND wurde als beauftragt markiert.
//                       „Darf nicht erst bei der Rechnung auffallen."
//   CoS-E-012 / TN-019  PDF ohne zugewiesenen Kunden ist trotzdem sendbar,
//                       der Empfängerblock bleibt einfach leer.
//   CoS-E-023 / TN-054  „Senden" ist aktiv, obwohl kein Kunde zugewiesen ist.
//
// Gewarnt wurde überall: ein roter Kasten „Bei 2 Positionen fehlen noch
// Preise", ein „Preis fehlt"-Vermerk an der Position, ein leerer
// Empfängerblock. Nur gehindert hat niemand. Und eine Warnung, die man
// wegklicken kann, ist bei einem Dokument, das ein Kunde als verbindliches
// Angebot liest, keine Sicherung — sie verschiebt die Verantwortung nur auf
// den müden Donnerstagabend.
//
// Deshalb hier eine gemeinsame Prüfung statt drei Einzelabfragen an drei
// Knöpfen. Die Wege zum Kunden sind mehr geworden (Fertigstellen, E-Mail,
// WhatsApp, Link, PDF-Download), und jeder neue Weg erbt diese Regel
// automatisch, statt dass jemand daran denken muss — dieselbe Überlegung wie
// beim `automatisch_ergaenzt`-Flag (CoS-017): ein gemeinsamer
// Durchgangspunkt schlägt N Einzelstellen.
//
// Was hier bewusst NICHT passiert: die unbepreiste Position stillschweigend
// weglassen. Dann verschwände die Arbeit aus dem Angebot und der Handwerker
// führte sie aus, ohne sie berechnet zu haben — das wäre schlimmer als die
// 0,00-€-Zeile. Der Handwerker soll den Preis anlegen; die App sagt ihm nur,
// dass es ohne nicht weitergeht, und welche Position es betrifft.

export interface PositionFuerPruefung {
  title: string
  unit_price: number
  /** Verknüpfung in die Preisdatenbank. Fehlt sie UND ist der Preis 0, ist die Position unbepreist. */
  price_item_id?: string | null
}

/**
 * Positionen ohne Preis.
 *
 * Die Bedingung ist absichtlich dieselbe, die die Bearbeiten-Ansicht seit
 * jeher für ihren roten Kasten benutzt (`!price_item_id && unit_price <= 0`):
 * Eine 0,00 € teure Position ist nur dann ein Fehler, wenn ihr auch kein
 * Katalogeintrag zugeordnet ist. Ein Handwerker DARF eine Leistung bewusst
 * mit 0 € anbieten (Kulanz, „mache ich mit") — dann hängt sie aber an einem
 * echten Preiseintrag und ist eine Entscheidung, kein Loch.
 */
export function unbepreistePositionen<T extends PositionFuerPruefung>(items: T[]): T[] {
  return items.filter(i => preisFehlt(i))
}

/**
 * Dieselbe Bedingung für eine einzelne Zeile.
 *
 * Sie stand bis DC-125 dreimal im Projekt: hier, als roter Kasten in der
 * Bearbeiten-Ansicht (`AngebotDetail.tsx`) und sinngemäß im Kopf jedes
 * Lesers. Jetzt einmal — wer die Regel ändert, ändert sie überall.
 */
export function preisFehlt(i: PositionFuerPruefung): boolean {
  return !i.price_item_id && (i.unit_price ?? 0) <= 0
}

export interface VersandPruefung {
  /** Kunde am Angebot vorhanden? */
  hatKunden: boolean
  items: PositionFuerPruefung[]
}

/**
 * Was diesem Angebot noch fehlt, bevor es zum Kunden darf — als fertige
 * Sätze in Handwerkersprache, nicht als Fehlercodes. Leere Liste = alles gut.
 *
 * Die Sätze sagen, WAS zu tun ist, nicht was falsch war: Der Handwerker steht
 * abends vor dem Knopf und braucht den nächsten Handgriff, keine Diagnose.
 */
export function versandHindernisse(p: VersandPruefung): string[] {
  const hindernisse: string[] = []

  if (!p.hatKunden) {
    hindernisse.push('Diesem Angebot ist noch kein Kunde zugewiesen.')
  }

  const ohnePreis = unbepreistePositionen(p.items)
  if (ohnePreis.length === 1) {
    hindernisse.push(`Bei „${ohnePreis[0].title}" fehlt noch der Preis.`)
  } else if (ohnePreis.length > 1) {
    const namen = ohnePreis.slice(0, 3).map(i => `„${i.title}"`).join(', ')
    const rest = ohnePreis.length > 3 ? ` und ${ohnePreis.length - 3} weiteren` : ''
    hindernisse.push(`Bei ${namen}${rest} fehlt noch der Preis.`)
  }

  return hindernisse
}

/** Kurzform für Knöpfe und Routen. */
export function darfZumKunden(p: VersandPruefung): boolean {
  return versandHindernisse(p).length === 0
}

// ── DC-125 — Die Nullzeile als Produktregel (Chief of Staff, 17.09.2026) ───
//
// Seine Entscheidung, wörtlich: „Eine Zeile ohne Betrag darf ein
// Kundenangebot nicht verlassen." Der Versand ist dafür oben seit Manfreds
// Testlauf gesperrt. Was ab hier dazukommt, ist die ANZEIGE-Seite derselben
// Regel — und sie ist nötig, weil der Versand nicht der einzige Weg zum
// Kunden ist: „PDF herunterladen" im Aktionen-Sheet erzeugt dasselbe Blatt,
// ohne durch `darfZumKunden` zu gehen, und der Handwerker verschickt es
// danach selbst über WhatsApp oder sein eigenes Mailprogramm.
//
// PM-117 hat gemessen, wie das heute aussieht: auf einem gewöhnlichen
// Badangebot finden sechs von neun Positionen keinen Preis, jede steht mit
// „0,00 €" da, und darunter eine Summe von 543,84 € statt 2.980,44 €. Der
// Prüfmeister dazu (PD-022): „Eine Liste mit sechs Nullen und einer Summe,
// die offensichtlich falsch ist, ist schlimmer als gar keine Summe."
//
// Daraus zwei Sätze, die zusammengehören:
//
//   1. **Eine Position ohne Preis zeigt keinen Betrag.** „0,00 €" ist eine
//      Behauptung — nämlich die, dass diese Arbeit nichts kostet. Das ist
//      genau die Aussage, die der Handwerker am Ende ausführen müsste.
//      `PREIS_FEHLT_KURZ` steht stattdessen dort und ist mit nichts
//      verwechselbar.
//   2. **Eine Summe, in der eine solche Position steckt, ist kein
//      Gesamtbetrag.** Auf dem Kundenpapier (PDF und Vorschau) steht dann
//      gar keine Zahl, sondern der Satz aus `fehlendePreiseSatz()`. In der
//      Arbeitsansicht bleibt die Zahl stehen, heißt aber „Zwischenstand".
//
// Der Unterschied zwischen beiden Orten ist Absicht und nicht Bequemlichkeit:
// Der Handwerker BRAUCHT die mitwandernde Summe, während er tippt (CoS-026).
// Der Kunde darf sie nicht bekommen, solange sie nicht stimmt.
//
// Was hier bewusst NICHT passiert — zum zweiten Mal in dieser Datei, aus
// demselben Grund: die unbepreiste Zeile weglassen. Sie bleibt stehen, sie
// sagt nur nicht mehr „0,00 €".

/** Was in der Betragsspalte steht, wenn kein Preis da ist. */
export const PREIS_FEHLT_KURZ = 'fehlt'

/** Die IDs der Positionen ohne Preis — für Renderpfade, die nur noch die ID haben. */
export function idsOhnePreis<T extends PositionFuerPruefung & { id: string }>(items: T[]): Set<string> {
  return new Set(unbepreistePositionen(items).map(i => i.id))
}

/**
 * Der eine Satz, der die fehlende Summe ersetzt.
 *
 * Er nennt die Zahl, weil „ein paar Positionen" nichts wert ist: Bei sechs
 * von neun weiß der Handwerker sofort, dass er nicht eine Zeile nachträgt,
 * sondern dass sein Katalog eine Lücke hat.
 */
export function fehlendePreiseSatz(ohnePreis: number, gesamt: number): string {
  if (ohnePreis <= 0) return ''
  if (ohnePreis === 1) return 'Bei einer Position fehlt noch der Preis.'
  if (ohnePreis >= gesamt) return `Bei allen ${ohnePreis} Positionen fehlt noch der Preis.`
  return `Bei ${ohnePreis} von ${gesamt} Positionen fehlt noch der Preis.`
}
