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
