import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendPasswordResetEmail } from '@/lib/email'
import * as Sentry from '@sentry/nextjs'

// Ersetzt den bisherigen Client-seitigen
// `supabase.auth.resetPasswordForEmail()`-Aufruf. Zwei Gründe:
//
// 1. CoS-P-004: löste bisher Supabases eigene, aus dieser Session nicht
//    prüfbare Reset-Mail aus. Läuft jetzt über unsere Resend-Anbindung.
// 2. CoS-P-016 (2026-09-14): CoS-P-013 hatte hier direkt auf `/passwort-reset`
//    umgestellt, mit der Annahme, der Supabase-Browser-Client würde das
//    `#access_token=…`-Fragment aus dem Link automatisch verarbeiten
//    (`detectSessionInUrl`). Chief of Staff fand die tiefere Ursache: dieser
//    Client hat `flowType: "pkce"` fest verdrahtet und kann ein solches
//    Fragment PRINZIPIELL nie lesen — auf keiner Seite. Jetzt der
//    dokumentierte Weg für E-Mail-Links: `properties.hashed_token` selbst zu
//    einem Link zusammenbauen, den `/auth/callback` per `verifyOtp()`
//    serverseitig gegen eine Session tauscht (derselbe Mechanismus wie bei
//    der Registrierung). `/passwort-reset` selbst bleibt unverändert — es
//    bekommt die Session jetzt einfach schon fertig im Cookie, sobald es
//    lädt, und dessen `getUser()`-Prüfung greift dann sofort.
//
// Antwort ist bewusst IMMER gleich (Erfolg), unabhängig davon, ob die
// E-Mail existiert — verhindert Account-Enumeration, exakt wie beim
// bisherigen `resetPasswordForEmail()`-Verhalten.

export async function POST(req: NextRequest) {
  let body: { email?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Bitte gib eine gültige E-Mail-Adresse ein.' }, { status: 400 })
  }

  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const origin = req.nextUrl.origin
  const { data, error } = await service.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: {
      redirectTo: `${origin}/passwort-reset`,
    },
  })

  if (!error && data?.properties?.hashed_token) {
    const resetLink =
      `${origin}/auth/callback?token_hash=${data.properties.hashed_token}&type=recovery&next=/passwort-reset`

    // CoS-P-013 Befund 2: vorher "fire and forget" (kein await, Antwort ging
    // sofort raus) — auf einer Serverless-Funktion darf die Laufzeit danach
    // jederzeit einfrieren, noch laufende Arbeit wird dann verworfen, ohne
    // dass ein catch je zum Zug kommt. Jetzt abgewartet. UND: sendPassword-
    // ResetEmail() wirft bei einem Resend-Fehler nicht, sondern gibt
    // { ok: false, error } zurück — das reine .catch() von vorher hätte einen
    // echten Resend-Fehler (falsche Domain, Rate-Limit, …) also so oder so
    // nie gesehen. Beides zusammen ist die wahrscheinlichste Erklärung dafür,
    // dass Sandys Reset-Mail heute weder ankam noch irgendwo einen Fehler
    // hinterließ.
    const versand = await sendPasswordResetEmail(email, resetLink)
    if (!versand.ok) {
      console.error('[passwort-vergessen] Reset-Mail fehlgeschlagen:', versand.error)
      Sentry.captureException(new Error(versand.error ?? 'Resend-Versand fehlgeschlagen'), {
        tags: { feature: 'passwort_reset_mail' },
      })
    }
  } else if (error) {
    // Erwarteter Fall bei unbekannter E-Mail — bewusst nicht als Fehler
    // an den Client durchreichen, siehe Kommentar oben. Absichtlich AUCH
    // nicht an Sentry gemeldet: das wäre kein echter Fehler, sondern der
    // erwartete Normalfall bei jeder E-Mail, die nicht existiert.
    console.error('[passwort-vergessen] generateLink:', error.message)
  }

  return NextResponse.json({ ok: true })
}
