import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// ── CoS-P-013 Befund 1 (Platform & Integrations Engineer, 2026-09-13) ─────
//
// Sandys Live-Test am 13.09. zeigte: JEDER neue Nutzer landete nach dem
// Bestätigungslink auf "/login?error=auth" statt im Onboarding, und die
// Willkommens-Mail (die vorher hier unten hing) ging deshalb nie raus.
//
// Root Cause: Diese Route liest ausschließlich `?code=` (PKCE-Ablauf) und
// tauscht ihn serverseitig gegen eine Session. Die Links, die diese App
// tatsächlich erzeugt — `admin.generateLink({type:'signup'|'recovery', ...})`
// in register/route.ts und passwort-vergessen/route.ts — liefern die Session
// aber NIE als `?code=`, sondern als `#access_token=…` im URL-Fragment
// (impliziter Ablauf; belegt im Supabase-Auth-Log: "login_method":"implicit").
// Ein Fragment sieht ein Server-Handler wie dieser hier strukturell nie —
// das ist kein Bug im eigentlichen Sinn, sondern ein Pfad, der mit den
// echten Aufrufern dieser App nie etwas anderes tun konnte als fehlzuschlagen.
//
// Fix: Beide Aufrufer wurden umgehängt. `passwort-vergessen/route.ts` leitet
// jetzt direkt auf `/passwort-reset` (Client-Seite, verarbeitet das Fragment
// selbst über den Supabase-Browser-Client). `register/route.ts` leitet auf
// die neue Client-Seite `/bestaetigt` (gleiches Prinzip; schickt danach auch
// die Willkommens-Mail über den neuen Endpunkt `api/auth/willkommen-mail`).
//
// Diese Route hier bleibt bewusst stehen und funktionsfähig — falls die App
// später einen echten PKCE-/OAuth-Ablauf bekommt (z. B. "Login mit Google"),
// ist das hier der richtige, fertige Code dafür. Nur reicht aktuell kein
// Aufrufer mehr `?code=` an, sie ist also praktisch unerreicht. Vor einer
// künftigen Wiederverwendung bitte kurz gegenprüfen, welchen Ablauf (Code
// vs. Fragment) der jeweils neue Link-Erzeuger liefert — genau das war hier
// die eigentliche Ursache.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
