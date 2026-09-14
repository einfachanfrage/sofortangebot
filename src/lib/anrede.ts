// DC-078 / TN-075 (Manfred, 11.09.2026) — die Anrede in Sende-Mail und
// WhatsApp-Text.
//
// Befund: Die Mail an eine Privatkundin begann mit „Hallo Renate,". Zwei
// Fehler in einer Zeile — der Ton (Manfred: „Ich duze keine Privatkundin.
// Das ist ein Grund, die Mail nicht abzuschicken.") und die Herkunft des
// Namens: `customer.name.split(' ')[0]` nimmt schlicht das erste Wort des
// Namensfelds. Das Feld ist ein einziger Freitext ohne verlässliche Grenze
// zwischen Vor- und Nachname, also stand dort je nach Eingabe auch schon mal
// „Hallo Frau," (bei „Frau Krüger") oder „Hallo Krüger," (bei
// „Krüger, Renate").
//
// Deshalb: KEIN Raten. Solange am Kunden kein Anrede-Feld existiert
// (`Customer` in types.ts hat nur `name` und `ist_unternehmen`), wird der
// volle Name verwendet — höflich und in keiner Schreibweise falsch. Steht im
// Namensfeld bereits „Frau Krüger", ergibt das sogar genau die Anrede, die
// Manfred selbst schreiben würde.
//
// Eine gemeinsame Funktion für ALLE Kanäle, damit Mail und WhatsApp nicht
// wieder auseinanderlaufen — genau daran ist es hier zweimal nebeneinander
// schiefgegangen. Teil 2 (Feld `anrede` am Kunden -> „Sehr geehrte Frau
// Krüger") hängt sich später hier an und an keiner anderen Stelle; Spec in
// docs/design-check.md.

/**
 * Minimal getippt statt gegen `Customer`: die Aufrufstellen halten den Kunden
 * mal als vollen Datensatz, mal als Teilobjekt aus einer Query.
 */
export interface AnredeKunde {
  name?: string | null
  ist_unternehmen?: boolean | null
}

/**
 * Die Anrede-Zeile inklusive Komma, fertig zum Voranstellen.
 *
 *  - Privatkunde mit Namen  -> „Guten Tag, Renate Krüger,"
 *  - Gewerblicher Kunde     -> „Guten Tag,"   (eine Firma hat keine Anrede)
 *  - Kein Kunde / kein Name -> „Guten Tag,"
 */
export function anredeZeile(kunde: AnredeKunde | null | undefined): string {
  const name = kunde?.name?.trim()
  if (!name || kunde?.ist_unternehmen) return 'Guten Tag,'
  return `Guten Tag, ${name},`
}
