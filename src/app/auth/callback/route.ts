import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email'
import * as Sentry from '@sentry/nextjs'

// ── CoS-P-016 (Platform & Integrations Engineer, 2026-09-14) ──────────────
//
// Chief of Staff hat die eigentliche Ursache hinter CoS-P-013/CoS-P-015
// gefunden: `@supabase/ssr`s Browser-Client hat `flowType: "pkce"` fest
// verdrahtet (`createBrowserClient.js:40`, nach dem Options-Spread, also von
// außen nicht überschreibbar). Er kann ein `#access_token=…`-Fragment
// (impliziter Ablauf) strukturell nie verarbeiten — unabhängig davon, auf
// welcher Seite man landet. `/bestaetigt` (CoS-P-013) und `/passwort-reset`
// waren damit von Anfang an auf einem Weg gebaut, den der verwendete Client
// gar nicht gehen kann.
//
// Fix (Vorschlag von Chief of Staff, hier umgesetzt): admin.generateLink()
// liefert neben `action_link` (der zu Supabases eigenem `/verify` mit
// implizitem Ablauf führt) auch `properties.hashed_token`. Damit bauen
// register/route.ts und passwort-vergessen/route.ts jetzt einen EIGENEN Link
// auf diese Route hier: `/auth/callback?token_hash=…&type=signup|recovery
// &next=…`. Diese Route tauscht den Token serverseitig per `verifyOtp()`
// gegen eine Session — das ist der dokumentierte, PKCE-unabhängige Weg für
// E-Mail-Links, setzt das Session-Cookie ganz normal server-seitig, und
// funktioniert unabhängig vom Browser-Client-Bug oben. Kein Token mehr in
// der Adresszeile oder im Verlauf (launch-readiness.md 6.2), nebenbei erledigt.
//
// Damit werden `/bestaetigt` (CoS-P-013) und `api/auth/willkommen-mail`
// überflüssig — die Willkommens-Mail steht deshalb wieder hier, direkt nach
// erfolgreicher Bestätigung, wie ursprünglich vor CoS-P-013. Beide Dateien
// bewusst nicht gelöscht (siehe Fix-Update CoS-P-016 in der Doku), nur nicht
// mehr angesteuert.
//
// `?code=` (PKCE) bleibt zusätzlich unterstützt — falls die App später einen
// echten OAuth-Login bekommt, ist der Code dafür bereits da.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const next = searchParams.get('next') ?? '/dashboard'

  const supabase = await createClient()

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  } else if (tokenHash && (type === 'signup' || type === 'recovery')) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (!error && data.user) {
      if (type === 'signup' && data.user.email) {
        // Beste Bemühung — ein Fehler beim Mailversand soll die Weiterleitung
        // ins Onboarding nicht verhindern, der Nutzer ist ja erfolgreich
        // bestätigt.
        await schickeWillkommensmailFallsNoch(data.user.id, data.user.email, data.user.user_metadata)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}

async function schickeWillkommensmailFallsNoch(
  userId: string,
  email: string,
  userMetadata: Record<string, unknown> | undefined
) {
  // Doppelversand-Schutz: derselbe Link kann theoretisch zweimal geöffnet
  // werden (z. B. E-Mail-Client-Vorschau, die Links vorab lädt).
  if (userMetadata?.welcome_email_sent_at) return

  const vorname = (userMetadata?.full_name as string | undefined)?.split(' ')[0]

  // sendWelcomeEmail() wirft bei einem Resend-Fehler nicht, sondern gibt
  // { ok: false, error } zurück — Ergebnis deshalb aktiv prüfen (CoS-P-013
  // Befund 2 hat genau diese Lücke bei der Reset-Mail gefunden).
  const versand = await sendWelcomeEmail(email, vorname)
  if (!versand.ok) {
    console.error('[auth-callback] Willkommens-Mail fehlgeschlagen:', versand.error)
    Sentry.captureException(new Error(versand.error ?? 'Resend-Versand fehlgeschlagen'), {
      tags: { feature: 'willkommen_mail' },
    })
    return
  }

  // Markierung ist nur der Doppelversand-Schutz oben, kein kritischer Pfad —
  // ein Fehler hier soll die (bereits verschickte) Mail nicht als
  // fehlgeschlagen melden.
  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  await service.auth.admin.updateUserById(userId, {
    user_metadata: { ...userMetadata, welcome_email_sent_at: new Date().toISOString() },
  }).catch(() => {})
}
