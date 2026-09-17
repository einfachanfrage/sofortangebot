import type { Briefpapier } from './types'

// ── DC-122: Die Akzentfarbe des Briefpapiers ───────────────────────────────
//
// Bis heute war „Akzentfarbe" unter Einstellungen → Briefpapier & Design ein
// Schalter ohne Wirkung: `lib/pdf.tsx` hat aus dem Briefpapier genau ein Feld
// gelesen (`logo_url`), die Mini-Vorschau auf derselben Seite hat die Farbe
// aber gezeigt. Ein Schalter, der nichts tut, ist eine Behauptung (DC-106,
// DC-109, DC-121) — er wird entweder wahr gemacht oder entfernt. Hier wird er
// wahr gemacht.
//
// ── Die Regel: Die Akzentfarbe zieht Linien. Sie färbt keinen Text und
//    keine Fläche. ────────────────────────────────────────────────────────
//
// Zwei Gründe, und der zweite ist der wichtigere:
//
// 1. Ein Angebot ist ein Dokument, kein Prospekt. Es liegt beim Kunden auf
//    dem Tisch neben zwei anderen Angeboten und wird gelesen, nicht
//    bewundert. Farbige Überschriften und farbige Flächen machen aus einem
//    Briefkopf eine Werbedrucksache — und aus dem Ausdruck in Graustufen
//    einen grauen Kasten.
// 2. Das Feld ist ein freies Hex-Eingabefeld. Was ein Betrieb dort einträgt,
//    weiß niemand vorher. Farbiger Text kann unlesbar werden (Gelb auf
//    Weiß), eine farbige Fläche mit fester Textfarbe ebenso (die Chip-Liste
//    auf der Seite enthält heute #1C1C1C — dunkler Text auf dunkler Fläche).
//    Eine Linie hat dieses Problem nicht: Sie wird nicht gelesen. Sie kann
//    nur zu blass werden, und genau dagegen steht die Untergrenze unten.
//
// Es sind **genau zwei** Linien, an beiden Enden des Dokuments:
//
//   • die Linie unter dem Briefkopf   (`S.trennlinie`, 0,5 pt)
//   • die Linie über der Gesamtsumme  (`S.summenGesamtTrennlinie`, 1 pt)
//
// Nicht gefärbt werden die Zeilentrenner der Positionstabelle, die
// Raumgruppen-Linien und die Fußzeilen-Linie: Das ist Struktur, keine Marke.
// Wer jede Linie einfärbt, bekommt ein gestreiftes Blatt.
//
// Gelesen wird diese Datei von `lib/pdf.tsx` (dem Papier) **und** von
// `AngebotVorschau.tsx` (der Live-Vorschau, einer Client-Komponente, die
// `lib/pdf.tsx` nicht importieren darf). Gleiche Bauart und gleicher Grund
// wie `briefpapier-logo.ts`: eine Quelle, zwei Leser — abgeschriebene Werte
// sind hier schon zweimal auseinandergelaufen (DC-049, DC-055).

/** Die Vorgabe, wenn ein Betrieb nie etwas gewählt hat (Handbuch-Gelb). */
export const AKZENT_VORGABE = '#d9a400'

/** `#rrggbb`, klein geschrieben — oder die Vorgabe, wenn der Wert Unsinn ist. */
export function normalisiereAkzent(roh?: string | null): string {
  const wert = (roh ?? '').trim().replace(/^#/, '')
  if (/^[0-9a-f]{6}$/i.test(wert)) return '#' + wert.toLowerCase()
  // Kurzform #abc — kommt aus dem Eingabefeld nicht vor, aber aus fremden
  // Datensätzen und aus Tests.
  if (/^[0-9a-f]{3}$/i.test(wert)) {
    return '#' + wert.toLowerCase().split('').map(z => z + z).join('')
  }
  return AKZENT_VORGABE
}

function kanaele(hex: string): [number, number, number] {
  const h = normalisiereAkzent(hex).slice(1)
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function zuHex(r: number, g: number, b: number): string {
  const teil = (k: number) => Math.max(0, Math.min(255, Math.round(k))).toString(16).padStart(2, '0')
  return '#' + teil(r) + teil(g) + teil(b)
}

/**
 * Relative Helligkeit nach WCAG (0 = schwarz, 1 = weiß).
 *
 * Bewusst nicht „Summe der drei Kanäle durch drei": Das Auge sieht Grün
 * deutlich heller als Blau. Ein reines Blau (#0000ff) käme beim Mittelwert
 * auf 0,33 und gälte damit als mittelhell, obwohl es auf Papier fast schwarz
 * wirkt; ein reines Gelb (#ffff00) käme ebenfalls auf 0,67 statt auf die
 * fast 0,93, die es tatsächlich hat.
 */
export function helligkeit(hex: string): number {
  const linear = (k: number) => {
    const c = k / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  }
  const [r, g, b] = kanaele(hex)
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b)
}

/**
 * Die Untergrenze: **Keine Akzentlinie ist heller als die Vorgabefarbe.**
 *
 * Absichtlich gerechnet und nicht als Zahl hingeschrieben. Die Vorgabe ist
 * die einzige Farbe, von der wir wissen, dass sie als Linie auf weißem Papier
 * funktioniert — sie ist deshalb das Maß, und sie kommt garantiert
 * unverändert durch (sonst würde die Vorgabe sich selbst abdunkeln).
 */
export const AKZENT_MAX_HELLIGKEIT = helligkeit(AKZENT_VORGABE)

/**
 * Die Farbe, in der die beiden Akzentlinien gezeichnet werden.
 *
 * Normalfall: genau die gewählte Farbe. Ist sie heller als die Vorgabe, wird
 * sie **entlang ihres eigenen Farbtons** abgedunkelt, bis sie die Grenze
 * erreicht — nicht durch Grau ersetzt. Ein Betrieb mit einem hellen Blau
 * bekommt also ein dunkleres Blau und erkennt seine Farbe wieder; er bekommt
 * nur keine Linie, die auf dem Ausdruck verschwindet.
 */
export function akzentLinieAusFarbe(roh?: string | null): string {
  const hex = normalisiereAkzent(roh)
  if (helligkeit(hex) <= AKZENT_MAX_HELLIGKEIT) return hex
  const [r, g, b] = kanaele(hex)
  for (let faktor = 0.98; faktor >= 0.02; faktor -= 0.02) {
    const kandidat = zuHex(r * faktor, g * faktor, b * faktor)
    if (helligkeit(kandidat) <= AKZENT_MAX_HELLIGKEIT) return kandidat
  }
  // Nicht erreichbar: Bei Faktor 0,02 ist jede Farbe praktisch schwarz.
  // Steht hier, damit die Funktion einen Rückgabewert ohne `!` hat.
  return AKZENT_VORGABE
}

/** Dasselbe, direkt aus dem Briefpapier des Angebots. */
export function akzentLinie(briefpapier?: Briefpapier | null): string {
  return akzentLinieAusFarbe(briefpapier?.akzentfarbe)
}

/**
 * Wird die gewählte Farbe fürs Papier abgedunkelt? Nur für den Hinweis auf
 * der Einstellungsseite — der Betrieb soll den Unterschied erklärt bekommen
 * und ihn nicht für einen Fehler halten.
 */
export function wirdAbgedunkelt(roh?: string | null): boolean {
  return akzentLinieAusFarbe(roh) !== normalisiereAkzent(roh)
}
