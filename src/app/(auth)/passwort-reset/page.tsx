'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'

export default function PasswortResetPage() {
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Supabase verarbeitet den Token aus dem URL-Hash automatisch
    // onAuthStateChange feuert mit SIGNED_IN wenn Token gültig
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

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
