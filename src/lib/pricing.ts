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
// `freeAngeboteProMonat` bleibt bewusst stehen: `plan-limit.ts` ist heute die
// wirksame Sperre und liest die Zahl von hier. Das Abschalten des
// Gratis-Kontingents ist CoS-038-B und NICHT Teil dieses Baus — was A ändert,
// ist ausschließlich, dass die Zahl nicht mehr BEWORBEN wird.
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
  /** Wirksame Grenze in `plan-limit.ts`. Nicht mehr beworben — siehe CoS-038-B. */
  freeAngeboteProMonat: 3,
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

/**
 * CoS-M-010 (Sandy freigegeben, 07.09.2026): Seit der harten Grenze vom 06.09.
 * zählt das Kontingent nur NEU ANGELEGTE Angebote — Überarbeitungen eines
 * bestehenden zählen nicht mit (`plan-limit.ts` filtert auf `original_id`).
 *
 * ⚠ CoS-038-A (23.09.2026): Dieser Satz wird auf keiner Marketing-Fläche mehr
 * gezeigt — das Gratis-Kontingent ist kein Teil des beschlossenen Modells.
 * Er bleibt, solange `plan-limit.ts` die Zahl noch durchsetzt und
 * `einstellungen/abo` sie dem Nutzer anzeigt; angezeigte und wirksame Grenze
 * dürfen nicht auseinanderlaufen (DC-045). Fällt mit CoS-038-B.
 *
 * Die ZAHL kommt weiterhin aus PRICING, nicht aus dem Satz.
 */
export const FREE_KONTINGENT_TEXT =
  `${PRICING.freeAngeboteProMonat} neu angelegte Angebote pro Monat — Überarbeitungen zählen nicht mit`
