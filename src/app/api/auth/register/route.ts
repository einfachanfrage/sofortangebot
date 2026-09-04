import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendVerificationEmail } from '@/lib/email'
import { pruefeRegistrierungsdaten, type RegistrierungsEingabe } from '@/lib/registrierung'

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

// LR-05 / G4 (04.09.2026): Die Eingangsprüfung liegt jetzt in
// src/lib/registrierung.ts — inklusive der Unternehmer-Bestätigung, die hier
// bis heute überhaupt nicht gelesen wurde (weder geprüft noch gespeichert),
// obwohl das Formular sie als Pflichtfeld abfragt und mitschickt.

export async function POST(req: NextRequest) {
  let body: RegistrierungsEingabe
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }

  const pruefung = pruefeRegistrierungsdaten(body)
  if (!pruefung.ok) {
    return NextResponse.json({ error: pruefung.fehler }, { status: pruefung.status })
  }
  const { email, password } = pruefung

  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: created, error: createError } = await service.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: pruefung.metadata,
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
