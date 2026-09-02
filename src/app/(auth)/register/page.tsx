'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agbAkzeptiert, setAgbAkzeptiert] = useState(false)
  // G4 (2026-09-02, Head of Legal & Compliance, CoS-L-001 → design-check.md
  // "Design-Hälfte"): die Registrierung fragte die Unternehmereigenschaft
  // (§ 14 BGB) bisher gar nicht ab — die AGB schließen Verbraucher zwar per
  // Klausel aus (§ 1.2), das ist aber objektiv zu bestimmen, nicht per
  // Klausel herbeizuschreiben. Rutscht ein Verbraucher durch, greifen
  // §§ 312g/312j/312k BGB (Widerruf, Button-Lösung, Kündigungsbutton) voll.
  // Serverseitige Prüfung/Persistierung (analog `agbAkzeptiert` unten) ist
  // bewusst NICHT Teil dieser Änderung — offenes Ticket bei Head of Product
  // Engineering (CoS-026 Punkt 1), um keine parallele Arbeit an derselben
  // Route zu riskieren.
  const [unternehmerBestaetigt, setUnternehmerBestaetigt] = useState(false)
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

    if (!unternehmerBestaetigt) {
      setError('Bitte bestätige, dass du dich als Unternehmer anmeldest.')
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
      body: JSON.stringify({ email, password, agbAkzeptiert, unternehmerBestaetigt }),
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
      <div className="min-h-dvh bg-bg flex flex-col justify-center px-5">
        <div className="bg-white border-2 border-anthracite rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">📧</div>
          <div className="font-black text-2xl text-anthracite mb-2">Fast geschafft.</div>
          <div className="text-anthracite font-semibold">
            Wir haben dir eine Bestätigungs-E-Mail an <strong>{email}</strong> geschickt. Klick auf den Link darin.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-bg flex flex-col justify-center px-5">
      <div className="mb-10">
        <Logo variant="light" className="text-4xl" />
        <div className="text-anthracite text-xl font-bold mt-1">Konto erstellen</div>
      </div>

      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="E-Mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full bg-white border-2 border-anthracite rounded-xl px-4 py-3 text-anthracite font-semibold text-base focus:outline-none focus:border-yellow"
        />
        <input
          type="password"
          placeholder="Passwort (mind. 8 Zeichen)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full bg-white border-2 border-anthracite rounded-xl px-4 py-3 text-anthracite font-semibold text-base focus:outline-none focus:border-yellow"
        />

        {/* G4: eigene Pflicht-Checkbox für die Unternehmereigenschaft —
            bisher fragte die Registrierung das gar nicht ab. */}
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={unternehmerBestaetigt}
              onChange={e => setUnternehmerBestaetigt(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                unternehmerBestaetigt
                  ? 'bg-yellow border-yellow'
                  : 'bg-white border-anthracite/30'
              }`}
            >
              {unternehmerBestaetigt && (
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                  <path d="M1 4L4.5 7.5L11 1" stroke="var(--color-anthracite)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm font-semibold text-anthracite/70 leading-snug">
            Ich melde mich als Unternehmer an (§ 14 BGB) — sofortangebot ist
            für den gewerblichen Einsatz gemacht, nicht für Verbraucher.
          </span>
        </label>

        {/* G4: AGB-Zustimmung (Checkbox — eine Einwilligung) und
            Datenschutzerklärung (nur Info-Link nach Art. 13 DSGVO, keine
            Einwilligung) waren vorher fälschlich in einer Checkbox
            zusammengefasst. */}
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
                  ? 'bg-yellow border-yellow'
                  : 'bg-white border-anthracite/30'
              }`}
            >
              {agbAkzeptiert && (
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                  <path d="M1 4L4.5 7.5L11 1" stroke="var(--color-anthracite)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm font-semibold text-anthracite/70 leading-snug">
            Ich habe die{' '}
            <Link href="/agb" target="_blank" className="text-anthracite underline underline-offset-2">
              AGB
            </Link>{' '}
            gelesen und akzeptiere sie.
          </span>
        </label>

        <p className="text-xs font-semibold text-anthracite/50 leading-snug -mt-1">
          Informationen zur Verarbeitung deiner Daten findest du in unserer{' '}
          <Link href="/datenschutz" target="_blank" className="text-anthracite/70 underline underline-offset-2">
            Datenschutzerklärung
          </Link>.
        </p>

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
          {loading ? 'Einen Moment...' : 'Loslegen'}
        </button>
      </form>

      <p className="text-center text-anthracite mt-8 font-semibold">
        Schon dabei?{' '}
        <Link href="/login" className="text-yellow underline">
          Einloggen
        </Link>
      </p>
    </div>
  )
}
