// Widerrufsbelehrung für Verbraucher-Verträge außerhalb der Geschäftsräume.
//
// WARUM: Unterschreibt ein Verbraucher beim Kunden vor Ort (Haustürgeschäft,
// § 312b BGB), hat er 14 Tage Widerrufsrecht (§ 355 BGB). Ohne korrekte Belehrung
// verlängert sich die Frist auf 12 Monate + 14 Tage — der Kunde kann fast ein Jahr
// später widerrufen, obwohl schon gearbeitet wurde.
//
// ⚠️ RECHTSHINWEIS: Der Standardtext orientiert sich am amtlichen Muster
// (Anlage 1 zu Art. 246a § 1 Abs. 2 S. 2 EGBGB). Er ist eine Vorlage, KEINE
// Rechtsberatung — der Betrieb sollte ihn anwaltlich prüfen lassen und kann ihn
// in den Einstellungen überschreiben (companies.widerruf_text).

export interface WiderrufAbsender {
  name: string
  adresse?: string | null
  telefon?: string | null
  email?: string | null
}

function kontaktZeile(a: WiderrufAbsender): string {
  const teile = [
    a.name,
    (a.adresse ?? '').replace(/\n+/g, ', ').trim(),
    a.telefon ? `Tel.: ${a.telefon}` : '',
    a.email ? `E-Mail: ${a.email}` : '',
  ].filter(Boolean)
  return teile.join(', ')
}

/** Amtliches Muster (Dienstleistungen), mit den Betriebsdaten befüllt. */
export function standardWiderrufsbelehrung(a: WiderrufAbsender): string {
  const kontakt = kontaktZeile(a)
  return `Widerrufsrecht

Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.

Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (${kontakt}) mittels einer eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.

Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.

Folgen des Widerrufs

Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.

Haben Sie verlangt, dass die Arbeiten während der Widerrufsfrist beginnen sollen, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses Vertrags unterrichten, bereits erbrachten Leistungen im Vergleich zum Gesamtumfang der im Vertrag vorgesehenen Leistungen entspricht.`
}

/** Muster-Widerrufsformular (Anlage 2 EGBGB), mit den Betriebsdaten befüllt. */
export function musterWiderrufsformular(a: WiderrufAbsender): string {
  const kontakt = kontaktZeile(a)
  return `(Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es zurück.)

An: ${kontakt}

Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über die Erbringung der folgenden Dienstleistung:

______________________________________________

Bestellt am (*) / erhalten am (*): __________________

Name des/der Verbraucher(s): __________________

Anschrift des/der Verbraucher(s): __________________

Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier): __________________

Datum: __________________

(*) Unzutreffendes streichen.`
}

/**
 * Soll die Belehrung ans Angebot? Nur bei Privatkunden (Verbraucher) und wenn
 * der Betrieb es aktiviert hat. Geschäftskunden haben kein Widerrufsrecht.
 */
export function braucheWiderrufsbelehrung(opts: {
  widerrufAktiv?: boolean | null
  kundeIstUnternehmen?: boolean | null
}): boolean {
  return opts.widerrufAktiv !== false && opts.kundeIstUnternehmen !== true
}

/** Finaler Text: eigener Text des Betriebs, sonst amtliches Muster. */
export function widerrufsbelehrungText(a: WiderrufAbsender, eigenerText?: string | null): string {
  const t = (eigenerText ?? '').trim()
  return t.length > 0 ? t : standardWiderrufsbelehrung(a)
}
