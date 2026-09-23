// Einzige Quelle für den Preis, die Testphase und das Free-Kontingent.
//
// CoS-001/DC-001 (2026-08-16): Der Pro-Preis stand vorher an drei
// unabhängigen Stellen im Code (Landingpage, Upgrade-Dialog, alte
// /vorschau-Seite) und war dort auseinandergelaufen — 29 €, 17–22 €,
// 9–29 €. Deshalb lesen alle Preis-/Gewerke-Texte in UI-Komponenten von
// hier, statt die Zahlen erneut einzutippen.
//
// ── CoS-038-A (2026-09-23) ────────────────────────────────────────────────
//
// Diese Datei stand bis heute auf dem ABGELÖSTEN Modell: 22 €/Monat,
// 17 €/Monat im Jahresabo, 3 Angebote/Monat im Free-Tier. Das Backend fährt
// seit CoS-P-007 (06.09.) nach dem neuen Modell — 25 Gründer-Slots in
// `api/stripe/route.ts`, `companies.trial_ends_at` auf 14 Tage. Die Zahlen
// hier sind jetzt die aus `docs/preismodell.md`, Sandys Entscheidungen vom
// 03.09. (Preismodell) und 17.09. (Regelbesteuerung, § 19 Abs. 2 UStG):
//
//   * EIN bezahlter Tarif, 49 € netto/Monat, unbegrenzt Angebote
//   * Gründerpreis 29 € netto/Monat, DAUERHAFT, für die ersten 25 zahlenden
//     Betriebe (Bestandsschutz, AGB § 4.4)
//   * KEIN Jahresabo vor Gate 2
//   * 14 Tage testen, ohne Kreditkarte, keine stille Umwandlung
//   * Regelbesteuerung: alle Preise netto, zzgl. gesetzlicher MwSt.
//
// ── CoS-038-B (2026-09-23) ────────────────────────────────────────────────
//
// `freeAngeboteProMonat` und `FREE_KONTINGENT_TEXT` sind ENTFERNT, nicht auf
// 0 gesetzt. Es gibt keinen Dauer-Gratis-Tarif mehr; die Schranke vor dem
// Abo sind die 14 Testtage (`companies.trial_ends_at`, siehe
// `plan-limit.ts`). Eine stehengelassene 0 wäre eine Zahl, die jemand später
// wieder hochdreht, ohne die Entscheidung dahinter zu sehen.
export const PRICING = {
  /** Regulärer Preis, netto je Monat. */
  standardMonatlich: 49,
  /** Gründerpreis, netto je Monat, dauerhaft. */
  gruenderMonatlich: 29,
  /** So viele Betriebe bekommen den Gründerpreis (`companies.founder_slot`). */
  gruenderPlaetze: 25,
  /** Testphase ohne Kreditkarte, in Tagen (`companies.trial_ends_at`). */
  testTage: 14,
  /** Regelbesteuerung seit 17.09.2026 — Verzicht nach § 19 Abs. 2 UStG. */
  mwstSatz: 0.19,
  /** Bewusst nicht „Alle 18 Gewerke" — nur diese zwei sind auf dem nötigen Qualitätsniveau. */
  unterstuetzteGewerke: 'Maler & Bodenleger',
} as const

/**
 * Bruttopreis als deutscher Betrag, z. B. `29` → `'34,51 €'`.
 *
 * Die Zahl wird gerechnet und nicht eingetippt: „34,51 € brutto" stand bisher
 * nur in `docs/preismodell.md` und im Landingpage-Entwurf des Head of
 * Marketing. Zwei Stellen, die dieselbe Zahl von Hand tragen, sind genau der
 * Anfang, an dem der Pro-Preis schon einmal auseinandergelaufen ist.
 */
export function bruttoText(netto: number): string {
  const brutto = Math.round(netto * (1 + PRICING.mwstSatz) * 100) / 100
  return `${brutto.toFixed(2).replace('.', ',')} €`
}

/**
 * Wortlaute für die Preis-Sektion.
 *
 * ⚠ Alle drei Sätze sind WÖRTLICH aus dem freigegebenen Landingpage-Entwurf
 * des Head of Marketing übernommen (`docs/landingpage-entwurf.html`,
 * Abschnitt „6 — PREIS"). Sie sind nicht von Engineering erfunden. Wer sie
 * ändern will, ändert sie dort zuerst.
 */
export const GRUENDERPREIS_TEXT =
  `Die ersten ${PRICING.gruenderPlaetze} Betriebe, die buchen, zahlen dauerhaft ` +
  `${PRICING.gruenderMonatlich} € — auch wenn der Preis danach auf ${PRICING.standardMonatlich} € steigt.`

export const MWST_HINWEIS =
  'Preise netto, zzgl. gesetzlicher MwSt. Sofortangebot richtet sich ausschließlich an Unternehmer (§ 14 BGB).'

export const TESTPHASE_CTA = `${PRICING.testTage} Tage kostenlos testen`
