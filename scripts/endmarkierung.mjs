// Erkennt die Endmarkierung einer Doku-Datei — eine Zeile, ein Zweck.
//
// Warum als eigene Datei: Die Regel wird vom Prüfskript UND vom Test
// gebraucht. Läge sie zweimal da, könnte genau die Kopie falsch werden, die
// nicht getestet wird.
//
// Vorgeschichte (03.09.2026): Die erste Fassung prüfte nur
// `zeile.startsWith('<!-- ENDE DER DATEI')`. Mehrere Koordinationsdateien
// erklären die Markierung aber im Fließtext und zitieren sie dabei in
// Backticks. Beim Umbrechen des Absatzes rutschte dieses Zitat an einen
// Zeilenanfang:
//
//     ...eine feste Markierung
//     (`<!-- ENDE DER DATEI -->`). Taucht beim Lesen noch Text NACH dieser
//
// Ab dem Moment meldete das Skript drei der wichtigsten Dateien als
// beschädigt, obwohl nichts kaputt war. Ein Prüfer, der grundlos Alarm
// schlägt, ist schlimmer als keiner: Beim nächsten ECHTEN Speicherfehler
// hätte niemand mehr hingesehen. Deshalb zählt jetzt nur noch die
// vollständige Markierung — und die steht per Definition allein auf ihrer
// Zeile und endet mit `-->`.

export const MARKE_ANFANG = '<!-- ENDE DER DATEI'

/**
 * Ist diese Zeile die echte Endmarkierung?
 *
 * Bewusst nicht per Zeichenketten-Vergleich auf den exakten Wortlaut: Ein
 * zusätzliches Leerzeichen würde sonst „Markierung fehlt" auslösen. Die drei
 * Bedingungen zusammen sind eng genug, dass eine Erwähnung im Fließtext nicht
 * durchrutscht, und weit genug, dass kleine Abweichungen nicht stören.
 */
export function istEndmarkierung(zeile) {
  const t = String(zeile).trim()
  return t.startsWith(MARKE_ANFANG)
    && t.endsWith('-->')
    && t.includes('Speicherfehler')
}

/** Zeilennummern (0-basiert) aller echten Endmarkierungen. */
export function endmarkierungsZeilen(zeilen) {
  return zeilen
    .map((zeile, index) => (istEndmarkierung(zeile) ? index : -1))
    .filter(index => index >= 0)
}
