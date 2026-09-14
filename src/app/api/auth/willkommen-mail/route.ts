import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendWelcomeEmail } from '@/lib/email'
import * as Sentry from '@sentry/nextjs'

// ── CoS-P-016 (Platform & Integrations Engineer, 2026-09-14): VERWAIST ────
//
// Wird seit dem CoS-P-016-Fix von niemandem mehr aufgerufen — die einzige
// Aufruferin war `/bestaetigt` (siehe deren Kommentar, selbst jetzt
// verwaist). Die Willkommens-Mail steht wieder direkt in
// `auth/callback/route.ts`, mit derselben Doppelversand-Absicherung wie
// hier. Bewusst nicht gelöscht, nur nicht mehr angesteuert — Aufräumen ist
// Sandys Entscheidung.
//
// ── CoS-P-013 Befund 1 (Platform & Integrations Engineer, 2026-09-13) ─────
//
// Die Willkommens-Mail stand vorher in auth/callback/route.ts, innerhalb
// eines "if (code)"-Zweigs, den die echten Bestätigungslinks dieser App nie
// betreten konnten (siehe Kommentar dort) — die Mail ging im echten Ablauf
// deshalb nie raus, obwohl sie als die eine sicher funktionierende Mail aus
// CoS-P-004 galt. Jetzt ein eigener, kleiner Endpunkt: aufgerufen von der
// neuen Client-Seite /bestaetigt, NACHDEM der Browser die Session aus dem
// URL-Fragment gesetzt hat (Cookie ist dann schon da) — dieser Endpunkt
// liest den Nutzer also ganz normal aus dem Session-Cookie, kein Sonderfall.
//
// "Beste Bemühung", blockiert die Weiterleitung ins Onboarding nicht: die
// Client-Seite ruft diesen Endpunkt fire-and-forget auf. Deshalb hier ein
// eigener Doppelversand-Schutz (user_metadata.welcome_email_sent_at) statt
// uns darauf zu verlassen, dass die Seite nur einmal geladen wird.
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return NextResponse.json({ ok: false }, { status: 401 })

  if (user.user_metadata?.welcome_email_sent_at) {
    return NextResponse.json({ ok: true })
  }

  const vorname = (user.user_metadata?.full_name as string | undefined)?.split(' ')[0]

  // sendWelcomeEmail() wirft bei einem Resend-Fehler nicht, sondern gibt
  // { ok: false, error } zurück — deshalb hier das Ergebnis prüfen, nicht nur
  // versuchen/fangen (genau die Lücke, die CoS-P-013 Befund 2 bei der
  // Reset-Mail gefunden hat).
  const versand = await sendWelcomeEmail(user.email, vorname)
  if (!versand.ok) {
    console.error('[willkommen-mail] Versand fehlgeschlagen:', versand.error)
    Sentry.captureException(new Error(versand.error ?? 'Resend-Versand fehlgeschlagen'), {
      tags: { feature: 'willkommen_mail' },
    })
    return NextResponse.json({ ok: false })
  }

  // Markierung ist nur der Doppelversand-Schutz oben, kein kritischer Pfad —
  // ein Fehler hier soll die (bereits verschickte) Mail nicht als
  // fehlgeschlagen melden, deshalb absichtlich kein await auf den Fehlerfall.
  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  await service.auth.admin.updateUserById(user.id, {
    user_metadata: { ...user.user_metadata, welcome_email_sent_at: new Date().toISOString() },
  }).catch(() => {})

  return NextResponse.json({ ok: true })
}
