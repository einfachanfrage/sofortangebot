import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendPasswordResetEmail } from '@/lib/email'
import * as Sentry from '@sentry/nextjs'

// Ersetzt den bisherigen Client-seitigen
// `supabase.auth.resetPasswordForEmail()`-Aufruf. Zwei Gründe:
//
// 1. CoS-P-004: löste bisher Supabases eigene, aus dieser Session nicht
//    prüfbare Reset-Mail aus. Läuft jetzt über unsere Resend-Anbindung.
// 2. CoS-P-003: der bisherige Redirect ging direkt auf `/passwort-reset`,
//    ohne den PKCE-Code serverseitig gegen eine Session zu tauschen — der
//    bekannte "Auth session missing"-Fehler. Der neue Link läuft über
//    `/auth/callback`, genau wie bei der Registrierung, wo der Tausch
//    bereits korrekt passiert.
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
      redirectTo: `${origin}/auth/callback?next=/passwort-reset`,
    },
  })

  if (!error && data?.properties?.action_link) {
    sendPasswordResetEmail(email, data.properties.action_link).catch(fehler => {
      console.error('[passwort-vergessen] Reset-Mail fehlgeschlagen')
      Sentry.captureException(fehler instanceof Error ? fehler : new Error(String(fehler)), {
        tags: { feature: 'passwort_reset_mail' },
      })
    })
  } else if (error) {
    // Erwarteter Fall bei unbekannter E-Mail — bewusst nicht als Fehler
    // an den Client durchreichen, siehe Kommentar oben. Absichtlich AUCH
    // nicht an Sentry gemeldet: das wäre kein echter Fehler, sondern der
    // erwartete Normalfall bei jeder E-Mail, die nicht existiert.
    console.error('[passwort-vergessen] generateLink:', error.message)
  }

  return NextResponse.json({ ok: true })
}
