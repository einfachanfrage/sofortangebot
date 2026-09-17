'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MailCheck } from 'lucide-react'
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
      <div className="flex flex-col">
        <div className="mb-10">
          <Logo variant="light" className="text-4xl" />
        </div>
        {/* DC-111, zweiter Punkt: Hier stand das Emoji 📬 als Bildmarke. Ein
            Emoji wird von jedem Betriebssystem anders gezeichnet — auf dem
            einen Gerät ein flacher Briefkasten, auf dem anderen ein bunter
            mit Fähnchen —, und in keinem CI-Dokument ist es gedeckt. DC-017
            hat die Bildsprache des Produkts auf Lucide vereinheitlicht; die
            Anmelde-Seiten waren nie nachgezogen worden. Gelb auf Anthrazit
            ist dieselbe Erfolgs-Geste wie im Produkt. */}
        <div className="w-14 h-14 rounded-2xl bg-yellow flex items-center justify-center mb-5">
          <MailCheck size={28} className="text-anthracite" strokeWidth={2.5} aria-hidden="true" />
        </div>
        <h1 className="font-syne text-2xl font-black text-anthracite mb-3">E-Mail gesendet!</h1>
        <p className="text-anthracite/60 font-semibold leading-relaxed mb-2">
          Wir haben einen Link zum Zurücksetzen deines Passworts an <strong>{email}</strong> geschickt.
        </p>
        <p className="text-anthracite/40 font-semibold text-sm leading-relaxed mb-8">
          Schau auch im Spam-Ordner nach. Der Link ist 1 Stunde gültig.
        </p>
        <Link href="/login" className="text-center text-anthracite/50 font-semibold text-sm">
          ← Zurück zum Login
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="mb-10">
        <Logo variant="light" className="text-4xl" />
        <div className="font-syne text-anthracite text-xl font-bold mt-1">Passwort vergessen</div>
        <p className="text-anthracite/50 font-semibold text-sm mt-1">
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
          className="w-full bg-white border-2 border-anthracite rounded-xl px-4 py-3 text-anthracite font-semibold text-base focus:outline-none focus:border-yellow"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="w-full bg-yellow text-anthracite font-black text-lg rounded-xl py-4 mt-2 active:translate-y-px transition-transform disabled:opacity-50"
        >
          {loading ? 'Sende...' : 'Reset-Link senden'}
        </button>
      </form>

      <p className="text-center mt-8">
        <Link href="/login" className="text-anthracite/40 font-semibold text-sm hover:text-anthracite transition-colors">
          ← Zurück zum Login
        </Link>
      </p>
    </div>
  )
}
