'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function PasswortVergessenPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/passwort-vergessen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    setLoading(false)
    if (!res.ok) {
      setError('E-Mail konnte nicht gesendet werden. Bitte prüfe die Adresse.')
      return
    }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-dvh bg-[#F7F7F5] flex flex-col justify-center px-5">
        <div className="mb-10">
          <Logo variant="light" className="text-4xl" />
        </div>
        <div className="text-5xl mb-5">📬</div>
        <h1 className="text-2xl font-black text-[#2C2C2C] mb-3">E-Mail gesendet!</h1>
        <p className="text-[#2C2C2C]/60 font-semibold leading-relaxed mb-2">
          Wir haben einen Link zum Zurücksetzen deines Passworts an <strong>{email}</strong> geschickt.
        </p>
        <p className="text-[#2C2C2C]/40 font-semibold text-sm leading-relaxed mb-8">
          Schau auch im Spam-Ordner nach. Der Link ist 1 Stunde gültig.
        </p>
        <Link href="/login" className="text-center text-[#2C2C2C]/50 font-semibold text-sm">
          ← Zurück zum Login
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-[#F7F7F5] flex flex-col justify-center px-5">
      <div className="mb-10">
        <Logo variant="light" className="text-4xl" />
        <div className="text-[#2C2C2C] text-xl font-bold mt-1">Passwort vergessen</div>
        <p className="text-[#2C2C2C]/50 font-semibold text-sm mt-1">
          Wir schicken dir einen Reset-Link per E-Mail.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Deine E-Mail-Adresse"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus
          className="w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400]"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 mt-2 active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? 'Sende...' : 'Reset-Link senden'}
        </button>
      </form>

      <p className="text-center mt-8">
        <Link href="/login" className="text-[#2C2C2C]/40 font-semibold text-sm hover:text-[#2C2C2C] transition-colors">
          ← Zurück zum Login
        </Link>
      </p>
    </div>
  )
}
