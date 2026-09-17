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

// DC-124: Dieselbe Rechnung noch einmal, für die Mini-Vorschau auf der
// Briefpapier-Seite. Sie ist kleiner als die große Vorschau (Fließtext 7 px
// statt 11 px), und auch hier gibt es keinen „richtigen" Faktor, sondern nur
// einen gesetzten Bezugspunkt: Das Logo stand dort bisher auf `max-h-8` =
// 32 px, und das war die Vorgabestufe „mittel". Genau dieser eine Wert bleibt,
// die anderen beiden Stufen folgen daraus im Verhältnis des PDF.
//
//   klein  28 pt → 21 px
//   mittel 42 pt → 32 px   (der gesetzte Bezugspunkt, wie bisher)
//   groß   60 pt → 46 px
export const LOGO_PT_ZU_PX_MINI = 32 / 42

/**
 * Dasselbe wie `logoKopf()`, nur in Pixeln für eine der beiden Vorschauen.
 * Position kommt unverändert durch — sie ist eine Anordnung, kein Maß.
 *
 * Der Faktor ist absichtlich ein Parameter und keine zweite Funktion: beide
 * Vorschauen sollen dieselben drei Stufen im selben Verhältnis zeigen und sich
 * nur in ihrem Maßstab unterscheiden. Wer eine Stufe ändert, ändert sie für
 * beide.
 */
export function logoKopfVorschau(briefpapier?: Briefpapier | null, faktor: number = LOGO_PT_ZU_PX) {
  const kopf = logoKopf(briefpapier)
  return {
    hoehePx: Math.round(kopf.hoehe * faktor),
    maxBreitePx: Math.round(LOGO_MAX_BREITE_PT * faktor),
    position: kopf.position,
  }
}

// ── DC-124: WELCHES Bild im Kopf steht ─────────────────────────────────────
//
// Es gibt zwei Spalten, die ein Logo halten: `companies.logo_url` (Einstellungen
// → Firmenlogo) und `briefpapiere.logo_url` (Briefpapier & Design). Das
// Dokument liest seit jeher das Briefpapier zuerst und fällt nur dann auf den
// Betrieb zurück. Wer sein Logo unter „Firmenlogo" wechselt und danach ein
// Angebot öffnet, sieht deshalb das alte — ohne einen Hinweis darauf, dass es
// eine zweite Stelle gibt, die gewinnt.
//
// Die Gestaltungsentscheidung dazu (DC-124, 17.09.2026): **Ein Betrieb hat ein
// Logo, und es wird an einer Stelle hochgeladen.** Ein Briefpapier bestimmt,
// WO das Logo steht und WIE GROSS es ist — nicht, WELCHES es ist. Genau so
// hält es die Karte „Firmenangaben" im Briefpapier-Editor schon immer mit Name
// und Adresse: sie zeigt sie und verweist zum Pflegen auf Einstellungen →
// Betrieb.
//
// Die Rangfolge selbst bleibt unverändert — sie ist die Wahrheit für jedes
// bestehende Briefpapier, das heute ein eigenes Logo trägt, und darf nicht
// stillschweigend kippen. Neu ist nur, dass es keine Stelle mehr gibt, die
// diese Überschreibung ANLEGT, und dass jede Ansicht dieselbe Rangfolge liest
// statt sie abzuschreiben (dieselbe Begründung wie bei `logoKopf` in DC-123).
//
// `eigenes` sagt, ob die Überschreibung greift. Nur daran hängt der Hinweis in
// der Oberfläche; die Anzeige selbst braucht die Unterscheidung nicht.
export function logoQuelle(
  briefpapier?: { logo_url?: string | null } | null,
  company?: { logo_url?: string | null } | null,
): { src: string | null; eigenes: boolean } {
  const eigen = briefpapier?.logo_url ?? null
  if (eigen) return { src: eigen, eigenes: true }
  return { src: company?.logo_url ?? null, eigenes: false }
}
