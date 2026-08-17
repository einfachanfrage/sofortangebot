// PM-014 (2026-08-17): Angebot 2026-0016 verdoppelte sich komplett — jede
// Position exakt zweimal, Nettosumme exakt verdoppelt. Ursache: Positionen
// MIT Raum-Suffix ("Wandflächen streichen — Flur") wurden nie gegen bereits
// vorhandene Positionen derselben Quote geprüft, weil zwei unterschiedliche
// Räume denselben Titel mit unterschiedlichem Raum-Suffix haben dürfen.
// Trifft die Generierungs-Route ein zweites Mal auf dieselben Daten (z.B.
// doppelter Request nach Neuladen), landet exakt derselbe Titel MIT
// derselben Menge nochmal in der Liste — das muss geblockt werden.
//
// Wichtig, was das NICHT abfängt: zwei parallele Anfragen, die beide GLEICH-
// ZEITIG den Datenbank-Stand lesen, bevor die jeweils andere geschrieben hat
// (echte Race Condition). Dafür bräuchte es einen DB-seitigen Unique-
// Constraint oder eine Lock-Spalte — ein größerer Schritt, absichtlich nicht
// Teil dieses Fixes.

export interface BestehendesQuoteItem {
  title: string
  quantity: number | null
}

export interface NeuesQuoteItem {
  title: string
  quantity?: number | null
}

/** Baut den Dublette-Schlüssel: Titel (normalisiert) + Menge. */
function schluessel(titel: string, menge: number | null | undefined): string {
  return `${titel.toLowerCase().trim()}|${menge ?? 1}`
}

/**
 * Filtert exakte Dubletten (gleicher Titel + gleiche Menge) heraus, die in
 * `bestehende` schon vorhanden sind — unabhängig davon, ob der Titel einen
 * Raum-Suffix hat oder nicht. Reihenfolge der übrigen Items bleibt erhalten.
 */
export function filtereExakteDubletten<T extends NeuesQuoteItem>(
  neue: T[],
  bestehende: BestehendesQuoteItem[],
): T[] {
  const bestehendeSchluessel = new Set(bestehende.map(i => schluessel(i.title, i.quantity)))
  return neue.filter(item => !bestehendeSchluessel.has(schluessel(item.title, item.quantity)))
}
