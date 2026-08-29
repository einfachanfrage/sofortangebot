// Eine Quelle für "in welche Rubrik gehört ein neu angelegter Preis?" —
// vorher stand dieselbe Regel zweimal im Code (Server-Endpunkt für den
// "Preis fehlt"-Fall und, seit DC-039, nochmal im Browser). Genau so
// entstehen die doppelten Rubriken, die wir bei CoS-019 aufgeräumt haben.
//
// Bewusst grob: die drei Sammel-Rubriken existieren im Katalog bereits und
// sind als Auffangbecken gedacht. Eine feinere Einsortierung
// ("Maler – Anstrich Innen" statt "Maler – Sonstiges") wäre geraten — der
// Handwerker kann die Rubrik in der Preisdatenbank jederzeit selbst ändern,
// eine falsch geratene Rubrik wäre schwerer zu bemerken als eine neutrale.

export const RUBRIK_BODEN = 'Boden – Sonstiges'
export const RUBRIK_MALER = 'Maler – Sonstiges'
export const RUBRIK_ALLGEMEIN = 'Allgemein'

/** Maximale Länge eines Preis-Titels bzw. einer Einheit in der Preisdatenbank. */
export const TITEL_MAX_LAENGE = 120
export const EINHEIT_MAX_LAENGE = 30
/** Oberhalb davon ist ein Einheitspreis mit sehr hoher Wahrscheinlichkeit ein Tippfehler. */
export const PREIS_MAX = 100000

export function kategorieFuerTitel(titel: string): string {
  const text = titel.toLocaleLowerCase('de-DE')
  if (/vinyl|laminat|parkett|teppich|kork|linoleum|designboden|bodenbelag|trittschall|altbelag|sockelleist/.test(text)) {
    return RUBRIK_BODEN
  }
  if (/wand|decke|streich|anstrich|tapete|raufaser|spachtel|schleif|grundier|abdeck|abkleb/.test(text)) {
    return RUBRIK_MALER
  }
  return RUBRIK_ALLGEMEIN
}

/**
 * Positions-Titel tragen im Angebot den Raum als Suffix ("… — Flur"). In der
 * Preisdatenbank hat der Raum nichts verloren, sonst steht dort irgendwann
 * dieselbe Leistung einmal pro Raum.
 */
export function titelFuerPreisdatenbank(titel: string): string {
  return titel.replace(/\s+—\s+.+$/, '').trim()
}

export type GepruefterPreis = { titel: string; einheit: string; preis: number; kategorie: string }
export type PreisPruefung =
  | { ok: true; wert: GepruefterPreis }
  | { ok: false; fehler: string }

/**
 * Prüft die Eingabe für einen komplett neuen Preisdatenbank-Eintrag (DC-039).
 * Bewusst als reine Funktion neben dem Endpunkt: hier wird in die echte
 * Preisdatenbank geschrieben, und ein Dublett oder ein vertippter Preis ist
 * dort schwerer wieder loszuwerden als ein Anzeigefehler.
 */
export function pruefeNeuenPreis(roh: { titel?: unknown; einheit?: unknown; preis?: unknown }): PreisPruefung {
  const titel = titelFuerPreisdatenbank(String(roh.titel ?? ''))
  if (!titel) return { ok: false, fehler: 'Bitte einen Titel für die Position eingeben.' }
  if (titel.length > TITEL_MAX_LAENGE) {
    return { ok: false, fehler: `Der Titel ist zu lang (höchstens ${TITEL_MAX_LAENGE} Zeichen).` }
  }

  const einheit = String(roh.einheit ?? '').trim()
  if (!einheit || einheit.length > EINHEIT_MAX_LAENGE) {
    return { ok: false, fehler: 'Bitte eine gültige Einheit auswählen.' }
  }

  const preis = Math.round(Number(String(roh.preis ?? '').replace(',', '.')) * 100) / 100
  if (!Number.isFinite(preis) || preis <= 0) {
    return { ok: false, fehler: 'Bitte einen Preis größer als 0 eingeben.' }
  }
  if (preis > PREIS_MAX) {
    return { ok: false, fehler: 'Der Preis sieht nach einem Tippfehler aus — bitte prüfen.' }
  }

  return { ok: true, wert: { titel, einheit, preis, kategorie: kategorieFuerTitel(titel) } }
}
