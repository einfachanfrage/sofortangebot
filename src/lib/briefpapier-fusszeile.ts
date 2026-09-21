import type { Briefpapier } from './types'

// ── DC-122 Teil 2: Die drei freien Fußzeilen-Felder ────────────────────────
//
// Teil 1 (17.09.) hat die Akzentfarbe wahr gemacht und die Schriftauswahl
// abgeschafft. Übrig blieben die drei Felder „Fußzeile links / Mitte /
// rechts" unter Einstellungen → Briefpapier & Design: eingebbar, in der
// Mini-Vorschau sichtbar — und auf dem Kundendokument nicht vorhanden. Der
// Grund war keine Gestaltungsfrage, sondern eine Rechtsfrage: Der feste Fuß
// trägt Pflichtangaben (Firma, Anschrift, USt-IdNr./St.-Nr., IBAN). Darf
// freier Text die ersetzen?
//
// ── Die Antwort von Head of Legal (CoS-L-011, 21.09.2026): B ──────────────
//
// Die drei freien Zeilen **ersetzen nichts, sie kommen zusätzlich**, in einer
// eigenen Zeile über dem festen Fuß. Daraus folgen die vier Regeln, die diese
// Datei durchsetzt:
//
// 1. ZUSÄTZLICH, NIE ERSETZEND. Der feste Fuß wird von hier aus nicht
//    angefasst — kein Feld von ihm wird überschrieben, keins weggelassen.
//    Deshalb liefert diese Datei ausschließlich den freien Teil und weiß vom
//    festen nichts.
// 2. DER FESTE FUSS IST NICHT ENDGÜLTIG. Die vollständige Pflichtzeile
//    (Rechtsform, Registergericht, Registernummer, Vertretungsberechtigte)
//    wird in CoS-E-057 gebaut, nicht hier. Bis dahin bleibt der heutige
//    stehen — er ist nicht falsch, nur unvollständig (LR-17).
// 3. KEIN BUDGET, DAS DEN FESTEN FUSS VERDRÄNGT. Zu langer Freitext wird
//    gekürzt, nie der feste Teil. Deshalb die Längengrenze unten. Sie ist
//    eine Platzgrenze, kein Urteil über den Inhalt — siehe 4.
// 4. KEINE PRÜFUNG DES FREITEXTES. Nicht auf Pflichtangaben, nicht auf
//    Dopplungen. Stehen Registerangaben zweimal da, ist das hässlich und
//    ausdrücklich nicht unser Problem. Diese Datei liest den Text deshalb
//    nirgends inhaltlich an; sie schneidet ihn nur auf Zeilenbreite zu.
//
// Was NICHT hierher gehört: die Steuernummer aus dem Fuß nehmen, sobald eine
// USt-IdNr. da ist. Das ist L-35a-01 und gehört zu CoS-E-057.
//
// Gelesen wird diese Datei von `lib/pdf.tsx` (dem Papier), von
// `AngebotVorschau.tsx` (der großen Live-Vorschau) und von der Mini-Vorschau
// auf der Einstellungsseite. Gleiche Bauart und gleicher Grund wie bei
// `briefpapier-farbe.ts` und `briefpapier-logo.ts`: Die Vorschauen sind
// Client-Komponenten und dürfen `lib/pdf.tsx` nicht importieren (das zöge
// `@react-pdf/renderer` samt Schriftdateien ins Browser-Bündel). Die
// Alternative — die Regel an drei Stellen nachbauen — ist genau der Fehler,
// der DC-049 und DC-055 verursacht hat. Eine Quelle, drei Leser.

/**
 * Höchstlänge je freiem Feld, in Zeichen.
 *
 * Kein Qualitätsurteil, sondern die Breite der Spalte: Der Fußbereich ist auf
 * A4 rund 491 pt breit, geteilt durch drei Spalten also ~163 pt. Bei 7 pt
 * Inter sind das grob 45 Zeichen je Spalte. 60 ist bewusst etwas großzügiger
 * gewählt — bis dahin darf eine Zeile umbrechen (dafür ist unter dem Fuß
 * Platz), darüber hinaus nicht mehr, weil sonst der feste Fuß nach oben
 * geschoben würde. Genau das verbietet Regel 3.
 */
export const FUSSZEILE_MAX_ZEICHEN = 60

/** Die drei freien Felder, fertig für die Ausgabe. */
export interface FreieFusszeile {
  links: string
  mitte: string
  rechts: string
}

/**
 * Schneidet ein einzelnes Feld auf Zeilenbreite zu.
 *
 * Gekürzt wird mit „…", damit sichtbar ist, dass da noch etwas stand — ein
 * stilles Abschneiden wäre wieder ein Unterschied zwischen Eingabefeld und
 * Papier, also genau der Fehler, den DC-122 behebt. Zeilenumbrüche aus dem
 * Eingabefeld werden zu Leerzeichen: Der Fuß ist eine Zeile, kein Absatz.
 */
function aufZeilenbreite(wert: string | null | undefined): string {
  if (!wert) return ''
  const einzeilig = wert.replace(/\s+/g, ' ').trim()
  if (einzeilig.length <= FUSSZEILE_MAX_ZEICHEN) return einzeilig
  return einzeilig.slice(0, FUSSZEILE_MAX_ZEICHEN - 1).trimEnd() + '…'
}

/**
 * Der freie Teil der Fußzeile — oder `null`, wenn alle drei Felder leer sind.
 *
 * `null` heißt: Es gibt nichts zusätzlich zu zeigen, und der Fuß sieht aus
 * wie vor DC-122. Ein Betrieb, der nichts einträgt, bekommt also kein leeres
 * Band und keine zusätzliche Linie.
 */
export function freieFusszeile(
  bp?: Briefpapier | Partial<Briefpapier> | null,
): FreieFusszeile | null {
  const links  = aufZeilenbreite(bp?.fusszeile_links)
  const mitte  = aufZeilenbreite(bp?.fusszeile_mitte)
  const rechts = aufZeilenbreite(bp?.fusszeile_rechts)
  if (!links && !mitte && !rechts) return null
  return { links, mitte, rechts }
}

/** Nur die nicht-leeren Felder, in der Reihenfolge links → Mitte → rechts. */
export function freieFusszeileZeilen(
  bp?: Briefpapier | Partial<Briefpapier> | null,
): string[] {
  const f = freieFusszeile(bp)
  if (!f) return []
  return [f.links, f.mitte, f.rechts].filter(Boolean)
}
