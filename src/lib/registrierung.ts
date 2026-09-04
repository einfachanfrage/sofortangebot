// ── LR-05 / G4: Unternehmer-Bestätigung, serverseitig ────────────────────
//
// Beim Durchgehen der Legal-Punkte am 04.09.2026 aufgefallen: G4 („Keine
// Unternehmer-Prüfung bei der Registrierung") galt als umgesetzt, weil das
// Registrierungsformular eine Pflicht-Checkbox hat und `unternehmerBestaetigt`
// mitschickt. Die API-Route hat das Feld aber **gar nicht gelesen** — weder
// geprüft noch gespeichert. Praktisch heißt das:
//
//   1. Die Prüfung war rein optisch. Wer den Aufruf direkt absetzt, kommt
//      ohne Bestätigung durch.
//   2. Es gibt keinen Beleg, dass der Nutzer je bestätigt hat, Unternehmer zu
//      sein — genau der Beleg, um den es bei LR-05 geht.
//
// Head of Legal zu diesem Risiko: Für einen Nutzer, der objektiv Verbraucher
// ist, kommt der Vertrag ohne Button-Lösung nach § 312j Abs. 3 BGB nicht
// zustande — kein Zahlungsanspruch, dazu ein Widerrufsrecht von 12 Monaten
// und 14 Tagen. Das ist das einzige Risiko im Register, das direkt Sandys
// eigenes Geld betrifft.
//
// Die Prüfung steht hier als reine Funktion, damit sie ohne Datenbank testbar
// ist — der bisherige Zustand war ja gerade, dass die serverseitige Hälfte
// niemandem aufgefallen ist.

export const AGB_VERSION = '2026-06'

export interface RegistrierungsEingabe {
  email?: unknown
  password?: unknown
  agbAkzeptiert?: unknown
  unternehmerBestaetigt?: unknown
}

export type RegistrierungsPruefung =
  | { ok: true; email: string; password: string; metadata: Record<string, string> }
  | { ok: false; fehler: string; status: number }

export function pruefeRegistrierungsdaten(
  body: RegistrierungsEingabe,
  jetzt: Date = new Date(),
): RegistrierungsPruefung {
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  if (!email || !email.includes('@')) {
    return { ok: false, fehler: 'Bitte gib eine gültige E-Mail-Adresse ein.', status: 400 }
  }
  if (password.length < 8) {
    return { ok: false, fehler: 'Passwort muss mindestens 8 Zeichen lang sein.', status: 400 }
  }
  if (body.agbAkzeptiert !== true) {
    return { ok: false, fehler: 'Bitte akzeptiere die AGB um fortzufahren.', status: 400 }
  }
  if (body.unternehmerBestaetigt !== true) {
    return {
      ok: false,
      fehler: 'Bitte bestätige, dass du dich als Unternehmer anmeldest. Sofortangebot ist ein Werkzeug für Betriebe, nicht für Privatpersonen.',
      status: 400,
    }
  }

  const zeitpunkt = jetzt.toISOString()
  return {
    ok: true,
    email,
    password,
    metadata: {
      agb_akzeptiert_am: zeitpunkt,
      agb_version: AGB_VERSION,
      // Der Beleg, um den es bei LR-05 geht: WANN hat dieser Nutzer bestätigt,
      // als Unternehmer zu handeln. Ohne Zeitstempel ist die Checkbox nur ein
      // Häkchen, das niemand mehr nachweisen kann.
      unternehmer_bestaetigt_am: zeitpunkt,
    },
  }
}
