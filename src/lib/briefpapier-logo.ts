import type { Briefpapier } from './types'

// ── DC-121 / DC-123: Logo im Angebotskopf ──────────────────────────────────
//
// Diese Datei ist aus `lib/pdf.tsx` herausgelöst worden (DC-123, 17.09.2026)
// und hat genau einen Grund: Die Live-Vorschau (`AngebotVorschau.tsx`) ist
// eine Client-Komponente und darf `lib/pdf.tsx` nicht importieren — das würde
// `@react-pdf/renderer` samt Schriftdateien in das Browser-Bündel ziehen. Ohne
// eine gemeinsame Datei hätte die Vorschau die drei Stufen aber abschreiben
// müssen, und genau daran ist die Vorschau schon zweimal auseinandergelaufen
// (DC-049, DC-055). Eine Quelle, zwei Leser: `lib/pdf.tsx` re-exportiert von
// hier, `AngebotVorschau.tsx` importiert direkt.
//
// Die Regel: **Ein Logo wird über seine Höhe ausgerichtet, nie über seine
// Breite.** So machen es Briefköpfe seit es Briefköpfe gibt — nebeneinander
// gestellte Marken wirken nur dann gleich gewichtet, wenn sie gleich hoch
// sind. Die Breite ergibt sich aus dem Bild. Ein Betrieb hat das Logo, das er
// hat: rund, quadratisch oder breit. Keine dieser Formen darf dadurch
// benachteiligt sein, dass unser Kopf ein bestimmtes Seitenverhältnis erwartet.
//
// Die drei Stufen sind die, die unter Einstellungen → Briefpapier & Design
// bereits als „Klein / Mittel / Groß" angeboten werden.
export const LOGO_HOEHE_PT = { klein: 28, mittel: 42, gross: 60 } as const

// Notbremse gegen ein sehr breites Banner-Logo: der Block rechts (Nr., Datum,
// Gültig bis) braucht rund 150 pt, die Textspalte darf nicht zusammenfallen.
export const LOGO_MAX_BREITE_PT = 200

/** Höhe + Position des Kopflogos aus dem Briefpapier, mit den Vorgabewerten. */
export function logoKopf(briefpapier?: Briefpapier | null) {
  return {
    hoehe: LOGO_HOEHE_PT[briefpapier?.logo_groesse ?? 'mittel'] ?? LOGO_HOEHE_PT.mittel,
    position: briefpapier?.logo_position ?? 'links',
  }
}

// DC-123: Die Live-Vorschau ist kein maßstäbliches A4 — sie ist eine
// CSS-Nachbildung, die in der Breite mitläuft. Es gibt deshalb keinen
// „richtigen" pt→px-Faktor, den man ausrechnen könnte, sondern nur einen
// gesetzten Bezugspunkt. Der ist in DC-121 bereits gefallen: die Vorgabestufe
// „mittel" (42 pt) steht dort als `max-h-12` = 48 px. Genau dieser eine Wert
// ist hier festgehalten, damit die anderen beiden Stufen NICHT frei gewählt
// werden, sondern im selben Verhältnis zueinander stehen wie im PDF.
//
//   klein  28 pt → 32 px
//   mittel 42 pt → 48 px   (der gesetzte Bezugspunkt aus DC-121)
//   groß   60 pt → 69 px
export const LOGO_PT_ZU_PX = 48 / 42

/**
 * Dasselbe wie `logoKopf()`, nur in Pixeln für die Live-Vorschau.
 * Position kommt unverändert durch — sie ist eine Anordnung, kein Maß.
 */
export function logoKopfVorschau(briefpapier?: Briefpapier | null) {
  const kopf = logoKopf(briefpapier)
  return {
    hoehePx: Math.round(kopf.hoehe * LOGO_PT_ZU_PX),
    maxBreitePx: Math.round(LOGO_MAX_BREITE_PT * LOGO_PT_ZU_PX),
    position: kopf.position,
  }
}
