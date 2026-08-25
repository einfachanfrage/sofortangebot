'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function PasswortResetPage() {
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const [linkInvalid, setLinkInvalid] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // CoS-P-003-Fix: der Reset-Link läuft jetzt über /auth/callback, das
    // den Code serverseitig bereits gegen eine Session getauscht hat —
    // beim Laden dieser Seite ist der Nutzer also im Normalfall schon
    // eingeloggt. Direkt prüfen, statt nur passiv auf ein Auth-Event zu
    // warten (das in diesem Fall gar nicht mehr feuert).
    let cancelled = false

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!cancelled && user) setReady(true)
    })

    // Fallback für ältere/abweichende Link-Formate.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setReady(true)
      }
    })

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    // Falls nach ein paar Sekunden weder Session noch Event da ist, ist der
    // Link vermutlich abgelaufen oder ungültig — nicht ewig "wird geprüft"
    // anzeigen, sondern das dem Nutzer sagen (statt einer Endlos-Warteseite).
    if (ready) return
    const timeout = setTimeout(() => setLinkInvalid(true), 4000)
    return () => clearTimeout(timeout)
  }, [ready])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== passwordConfirm) {
      setError('Die Passwörter stimmen nicht überein.')
      return
    }
    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein.')
      return
    }

    setLoading(true)
    setError('')

    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)
    if (error) {
      setError('Fehler beim Speichern. Bitte nochmal versuchen oder neuen Reset-Link anfordern.')
      return
    }

    router.push('/dashboard')
  }

  if (!ready && linkInvalid) {
    return (
      <div className="min-h-dvh bg-[#F7F7F5] flex flex-col justify-center px-5">
        <div className="mb-10">
          <Logo variant="light" className="text-4xl" />
        </div>
        <h1 className="text-xl font-black text-[#2C2C2C] mb-3 text-center">Link ungültig oder abgelaufen</h1>
        <p className="text-[#2C2C2C]/60 font-semibold text-sm text-center mb-8">
          Dieser Reset-Link funktioniert nicht mehr. Fordere einfach einen neuen an.
        </p>
        <Link
          href="/passwort-vergessen"
          className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 text-center active:scale-95 transition-transform"
        >
          Neuen Link anfordern
        </Link>
      </div>
    )
  }

  if (!ready) {
    return (
      <div className="min-h-dvh bg-[#F7F7F5] flex flex-col justify-center px-5">
        <div className="mb-10">
          <Logo variant="light" className="text-4xl" />
        </div>
        <div className="text-[#2C2C2C]/40 font-semibold text-center">Link wird geprüft...</div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#F7F7F5] flex flex-col justify-center px-5">
      <div className="mb-10">
        <Logo variant="light" className="text-4xl" />
        <div className="text-[#2C2C2C] text-xl font-bold mt-1">Neues Passwort</div>
        <p className="text-[#2C2C2C]/50 font-semibold text-sm mt-1">
          Wähle ein sicheres Passwort mit mindestens 8 Zeichen.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Neues Passwort"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoFocus
          minLength={8}
          className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400]"
        />
        <input
          type="password"
          placeholder="Passwort bestätigen"
          value={passwordConfirm}
          onChange={e => setPasswordConfirm(e.target.value)}
          required
          minLength={8}
          className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400]"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !password || !passwordConfirm}
          className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 mt-2 active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? 'Speichere...' : 'Passwort speichern'}
        </button>
      </form>
    </div>
  )
}
