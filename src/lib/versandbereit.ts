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
  return items.filter(i => !i.price_item_id && (i.unit_price ?? 0) <= 0)
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
