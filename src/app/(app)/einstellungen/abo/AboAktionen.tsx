'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

interface Props {
  plan: 'starter' | 'pro'
  hatStripeKonto: boolean
}

export function AboAktionen({ plan, hatStripeKonto }: Props) {
  const [laedt, setLaedt] = useState<'portal' | 'upgrade' | null>(null)
  const [fehler, setFehler] = useState('')

  async function oeffne(pfad: string, koerper: unknown, welche: 'portal' | 'upgrade') {
    setLaedt(welche)
    setFehler('')
    try {
      const res = await fetch(pfad, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(koerper),
      })
      const data = await res.json()
      if (!res.ok || !data.url) {
        setFehler(data.error ?? 'Das hat gerade nicht geklappt. Bitte später noch einmal versuchen.')
        setLaedt(null)
        return
      }
      window.location.href = data.url
    } catch {
      setFehler('Keine Verbindung. Bitte später noch einmal versuchen.')
      setLaedt(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {plan === 'starter' && (
        <button
          onClick={() => oeffne('/api/stripe', { plan: 'pro' }, 'upgrade')}
          disabled={laedt !== null}
          className="w-full bg-yellow text-anthracite font-black text-lg rounded-2xl py-4 disabled:opacity-40 transition-opacity"
        >
          {laedt === 'upgrade' ? 'Einen Moment…' : 'Auf Pro upgraden'}
        </button>
      )}

      {hatStripeKonto && (
        <button
          onClick={() => oeffne('/api/stripe/portal', {}, 'portal')}
          disabled={laedt !== null}
          className="flex items-center justify-between w-full bg-white border-2 border-anthracite/10 rounded-xl px-4 py-4 hover:border-yellow/50 transition-colors group disabled:opacity-40"
        >
          <div className="text-left">
            <span className="font-bold text-anthracite">
              {laedt === 'portal' ? 'Öffnet…' : 'Rechnungen & Zahlungsart'}
            </span>
            <div className="text-xs text-anthracite/40 font-semibold mt-0.5">
              Rechnungshistorie, Zahlungsmethode, Plan wechseln oder kündigen
            </div>
          </div>
          <ExternalLink size={16} className="text-anthracite/30 group-hover:text-anthracite/60 shrink-0" />
        </button>
      )}

      {fehler && <p className="text-sm font-bold text-red-500">{fehler}</p>}
    </div>
  )
}
