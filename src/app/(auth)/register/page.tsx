'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agbAkzeptiert, setAgbAkzeptiert] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein.')
      return
    }

    if (!agbAkzeptiert) {
      setError('Bitte akzeptiere die AGB um fortzufahren.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, agbAkzeptiert }),
    })
    const result = await res.json()

    if (!res.ok || result.error) {
      setError(result.error ?? 'Registrierung fehlgeschlagen. Versuche es nochmal.')
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-dvh bg-[#F7F7F5] flex flex-col justify-center px-5">
        <div className="bg-white border-2 border-[#2C2C2C] rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">📧</div>
          <div className="font-black text-2xl text-[#2C2C2C] mb-2">Fast geschafft.</div>
          <div className="text-[#2C2C2C] font-semibold">
            Wir haben dir eine Bestätigungs-E-Mail an <strong>{email}</strong> geschickt. Klick auf den Link darin.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#F7F7F5] flex flex-col justify-center px-5">
      <div className="mb-10">
        <Logo variant="light" className="text-4xl" />
        <div className="text-[#2C2C2C] text-xl font-bold mt-1">Konto erstellen</div>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400]"
        />
        <input
          type="password"
          placeholder="Passwort (mind. 8 Zeichen)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400]"
        />

        <label className="flex items-start gap-3 cursor-pointer select-none">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={agbAkzeptiert}
              onChange={e => setAgbAkzeptiert(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                agbAkzeptiert
                  ? 'bg-[#F5C400] border-[#F5C400]'
                  : 'bg-white border-[#2C2C2C]/30'
              }`}
            >
              {agbAkzeptiert && (
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                  <path d="M1 4L4.5 7.5L11 1" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm font-semibold text-[#2C2C2C]/70 leading-snug">
            Ich habe die{' '}
            <Link href="/agb" target="_blank" className="text-[#2C2C2C] underline underline-offset-2">
              AGB
            </Link>{' '}
            und die{' '}
            <Link href="/datenschutz" target="_blank" className="text-[#2C2C2C] underline underline-offset-2">
              Datenschutzerklärung
            </Link>{' '}
            gelesen und akzeptiere sie.
          </span>
        </label>

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
          {loading ? 'Einen Moment...' : 'Loslegen'}
        </button>
      </form>

      <p className="text-center text-[#2C2C2C] mt-8 font-semibold">
        Schon dabei?{' '}
        <Link href="/login" className="text-[#F5C400] underline">
          Einloggen
        </Link>
      </p>
    </div>
  )
}
