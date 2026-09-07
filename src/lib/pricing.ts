// Einzige Quelle für den Pro-Preis + das Free-Kontingent.
//
// CoS-001/DC-001 (2026-08-16): Der Pro-Preis stand vorher an drei
// unabhängigen Stellen im Code (Landingpage, Upgrade-Dialog, alte
// /vorschau-Seite) und war dort auseinandergelaufen — 29 €, 17–22 €,
// 9–29 €. Sandys Entscheidung (siehe docs/entscheidungen-fuer-sandy.md):
// 22 €/Monat Standard, 17 €/Monat bei Jahresabo, 3 Angebote/Monat im
// Free-Tier, „Maler & Bodenleger" statt „Alle 18 Gewerke" bewerben — nur
// diese zwei Gewerke sind bisher durch die Prüfmeister-Testreihe gelaufen.
//
// Alle Preis-/Gewerke-Texte in UI-Komponenten sollen von hier lesen, statt
// die Zahlen/Texte erneut einzutippen — genau das hat beim letzten Mal zur
// Drift geführt.
export const PRICING = {
  proMonatlich: 22,
  proJahresabo: 17,
  freeAngeboteProMonat: 3,
  /** Bewusst nicht „Alle 18 Gewerke" — nur diese zwei sind auf dem nötigen Qualitätsniveau. */
  unterstuetzteGewerke: 'Maler & Bodenleger',
} as const

/**
 * CoS-M-010 (Sandy freigegeben, 07.09.2026): Seit der harten Grenze vom 06.09.
 * zählt das Kontingent nur NEU ANGELEGTE Angebote — Überarbeitungen eines
 * bestehenden zählen nicht mit (`plan-limit.ts` filtert auf `original_id`).
 * Die beworbene Zahl wirkte damit anders, als das Produkt rechnet; zugunsten
 * des Kunden, aber ungenau bleibt ungenau, und genau diese Konstellation setzt
 * Legal jedes Mal 🔴.
 *
 * Die ZAHL kommt weiterhin aus PRICING, nicht aus dem Satz — sonst stünde sie
 * wieder an zwei Stellen, und genau daran ist der Pro-Preis schon einmal
 * auseinandergelaufen (CoS-001/DC-001).
 */
export const FREE_KONTINGENT_TEXT =
  `${PRICING.freeAngeboteProMonat} neu angelegte Angebote pro Monat — Überarbeitungen zählen nicht mit`
