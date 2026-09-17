'use client'

import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

// ── CoS-P-016 (Platform & Integrations Engineer, 2026-09-14): VERWAIST ────
//
// Diese Seite wird seit dem CoS-P-016-Fix von niemandem mehr angesteuert.
// Grund: Der Ansatz unten (Fragment im Browser verarbeiten lassen) kann bei
// diesem Projekt strukturell nicht funktionieren — `@supabase/ssr`s
// Browser-Client hat `flowType: "pkce"` fest verdrahtet und liest ein
// `#access_token=…`-Fragment nie, egal auf welcher Seite. `register/route.ts`
// schickt Nutzer jetzt stattdessen direkt zu `/auth/callback?token_hash=…`,
// das serverseitig per `verifyOtp()` einlöst (siehe Kommentar dort) — bis
// dahin auch bereits fertig eingeloggt, kein Zwischenstopp mehr nötig.
//
// Bewusst nicht gelöscht (siehe „Fix-Update CoS-P-016" in
// docs/chief-of-staff-platform-todos.md) — nur nicht mehr verlinkt. Ob die
// Datei ganz aufgeräumt wird, ist Sandys Entscheidung, genau wie bei den
// stillgelegten Edge-Functions.
//
// ── CoS-P-013 Befund 1 (Platform & Integrations Engineer, 2026-09-13) ─────
//
// Der Bestätigungslink aus admin.generateLink({type:'signup', ...}) liefert
// die Session NICHT als ?code= (PKCE, serverseitig lesbar), sondern als
// #access_token=… im URL-Fragment (impliziter Ablauf) — das sieht ein Server
// nie, das kann nur der Browser lesen. Deshalb ist diese Seite bewusst eine
// ganz normale Client-Seite AUSSERHALB der (app)-Gruppe: die verlangt
// serverseitig zwingend schon eine Session (requireCompany() in layout.tsx)
// und hätte vor dem allerersten Render nach /login umgeleitet — bevor der
// Browser die Tokens im Fragment überhaupt lesen könnte. Der
// Supabase-Browser-Client verarbeitet das Fragment automatisch beim Laden
// (detectSessionInUrl, Standard an) und setzt dabei auch das Session-Cookie —
// danach sieht auch eine serverseitig geschützte Seite wie /onboarding den
// Nutzer als eingeloggt. Exakt dasselbe Muster, das /passwort-reset für den
// Reset-Link schon nutzt.
function BestaetigungInner() {
  const [ready, setReady] = useState(false)
  const [linkInvalid, setLinkInvalid] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const next = searchParams.get('next') ?? '/onboarding'

  useEffect(() => {
    let cancelled = false

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!cancelled && user) setReady(true)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') setReady(true)
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // Falls nach ein paar Sekunden weder Session noch Event da ist, ist der
    // Link vermutlich abgelaufen oder schon einmal benutzt — nicht ewig
    // "wird bestätigt" anzeigen, sondern das dem Nutzer sagen.
    if (ready) return
    const timeout = setTimeout(() => setLinkInvalid(true), 4000)
    return () => clearTimeout(timeout)
  }, [ready])

  useEffect(() => {
    if (!ready) return
    // Willkommens-Mail: beste Bemühung, blockiert die Weiterleitung nicht —
    // serverseitig zusätzlich gegen Doppelversand abgesichert
    // (api/auth/willkommen-mail/route.ts).
    fetch('/api/auth/willkommen-mail', { method: 'POST' }).catch(() => {})
    router.push(next)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  if (!ready && linkInvalid) {
    return (
      <div className="flex flex-col">
        <div className="mb-10">
          <Logo variant="light" className="text-4xl" />
        </div>
        <h1 className="font-syne text-xl font-black text-anthracite mb-3 text-center">Link ungültig oder abgelaufen</h1>
        <p className="text-anthracite/60 font-semibold text-sm text-center mb-8">
          Dieser Bestätigungslink funktioniert nicht mehr — zum Beispiel, weil
          er schon einmal geöffnet wurde. Dein Konto ist trotzdem angelegt,
          du kannst dich direkt einloggen.
        </p>
        <Link
          href="/login"
          className="w-full bg-yellow text-anthracite font-black text-lg rounded-xl py-4 text-center active:translate-y-px transition-transform"
        >
          Zum Login
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="mb-10">
        <Logo variant="light" className="text-4xl" />
      </div>
      <div className="text-anthracite/40 font-semibold text-center">Konto wird bestätigt...</div>
    </div>
  )
}

export default function BestaetigungPage() {
  return (
    <Suspense fallback={null}>
      <BestaetigungInner />
    </Suspense>
  )
}
