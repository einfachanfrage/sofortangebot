import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendVerificationEmail } from '@/lib/email'

// Ersetzt den bisherigen Client-seitigen `supabase.auth.signUp()`-Aufruf.
// Grund (CoS-P-004): signUp() löst Supabases eigene, aus dieser Session
// nicht prüfbare Bestätigungs-Mail aus. Hier läuft der Versand stattdessen
// über unsere bereits sauber authentifizierte Resend-Anbindung.
//
// Sicherheits-Reihenfolge bewusst so gewählt: erst `admin.createUser()` —
// das ist der dokumentiert sichere Weg, um "E-Mail schon vergeben" zu
// erkennen, OHNE ein bestehendes Konto anzufassen (liefert einen klaren
// 422-Fehler, ändert nichts am bestehenden Nutzer). Erst danach, nur für
// den frisch angelegten neuen Nutzer, wird der Bestätigungs-Link erzeugt.
// So wird `generateLink` nie mit einer bereits existierenden E-Mail
// aufgerufen — das vermeidet jede Unklarheit darüber, ob das versehentlich
// ein bestehendes Passwort überschreiben könnte.

const AGB_VERSION = '2026-06'

export async function POST(req: NextRequest) {
  let body: { email?: unknown; password?: unknown; agbAkzeptiert?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const password = typeof body.password === 'string' ? body.password : ''
  const agbAkzeptiert = body.agbAkzeptiert === true

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Bitte gib eine gültige E-Mail-Adresse ein.' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Passwort muss mindestens 8 Zeichen lang sein.' }, { status: 400 })
  }
  if (!agbAkzeptiert) {
    return NextResponse.json({ error: 'Bitte akzeptiere die AGB um fortzufahren.' }, { status: 400 })
  }

  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: created, error: createError } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: {
      agb_akzeptiert_am: new Date().toISOString(),
      agb_version: AGB_VERSION,
    },
  })

  if (createError) {
    // "Schon registriert" bewusst NICHT verraten (Account-Enumeration) —
    // gleiche generische Erfolgsantwort wie bei einer echten Neuanmeldung.
    if (createError.status === 422 || /already.*registered/i.test(createError.message)) {
      return NextResponse.json({ ok: true })
    }
    console.error('[register] createUser fehlgeschlagen:', createError.message)
    return NextResponse.json({ error: 'Registrierung fehlgeschlagen. Versuche es nochmal.' }, { status: 500 })
  }

  if (!created?.user) {
    return NextResponse.json({ error: 'Registrierung fehlgeschlagen. Versuche es nochmal.' }, { status: 500 })
  }

  const origin = req.nextUrl.origin
  const { data: linkData, error: linkError } = await service.auth.admin.generateLink({
    type: 'signup',
    email,
    password,
    options: {
      redirectTo: `${origin}/auth/callback?next=/onboarding`,
    },
  })

  if (linkError || !linkData?.properties?.action_link) {
    console.error('[register] generateLink fehlgeschlagen:', linkError?.message)
    return NextResponse.json({ error: 'Registrierung fehlgeschlagen. Versuche es nochmal.' }, { status: 500 })
  }

  sendVerificationEmail(email, linkData.properties.action_link).catch(() => {
    console.error('[register] Bestätigungs-Mail fehlgeschlagen')
  })

  return NextResponse.json({ ok: true })
}
