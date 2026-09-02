'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('E-Mail oder Passwort falsch.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-dvh bg-bg flex flex-col justify-center px-5">
      <div className="mb-10">
        <Logo variant="light" className="text-4xl" />
        <div className="text-anthracite text-xl font-bold mt-1">Einloggen</div>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full bg-white border-2 border-anthracite rounded-xl px-4 py-3 text-anthracite font-semibold text-base focus:outline-none focus:border-yellow"
        />
        <div>
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full bg-white border-2 border-anthracite rounded-xl px-4 py-3 text-anthracite font-semibold text-base focus:outline-none focus:border-yellow"
          />
          <div className="text-right mt-1.5">
            <Link href="/passwort-vergessen" className="text-sm font-semibold text-anthracite/40 hover:text-anthracite transition-colors">
              Passwort vergessen?
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow text-anthracite font-black text-lg rounded-xl py-4 mt-2 active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? 'Einen Moment...' : 'Einloggen'}
        </button>
      </form>

      <p className="text-center text-anthracite mt-8 font-semibold">
        Noch kein Konto?{' '}
        <Link href="/register" className="text-yellow underline">
          Jetzt registrieren
        </Link>
      </p>
    </div>
  )
}
