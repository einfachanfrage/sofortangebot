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
    <div className="min-h-dvh bg-[#F7F7F5] flex flex-col justify-center px-5">
      <div className="mb-10">
        <Logo variant="light" className="text-4xl" />
        <div className="text-[#2C2C2C] text-xl font-bold mt-1">Einloggen</div>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400]"
        />
        <div>
          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400]"
          />
          <div className="text-right mt-1.5">
            <Link href="/passwort-vergessen" className="text-sm font-semibold text-[#2C2C2C]/40 hover:text-[#2C2C2C] transition-colors">
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
          className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 mt-2 active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? 'Einen Moment...' : 'Einloggen'}
        </button>
      </form>

      <p className="text-center text-[#2C2C2C] mt-8 font-semibold">
        Noch kein Konto?{' '}
        <Link href="/register" className="text-[#F5C400] underline">
          Jetzt registrieren
        </Link>
      </p>
    </div>
  )
}
