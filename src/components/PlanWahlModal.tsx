'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'

interface Props {
  onClose: () => void
}

const FREE_FEATURES = [
  '3 Angebote / Monat',
  '1 Gewerk',
  'PDF mit Logo',
]

const PRO_FEATURES = [
  'Unbegrenzte Angebote',
  'Alle 18 Gewerke',
  'Digitale Unterschrift',
  'Lexoffice & sevDesk',
  '30 Tage gratis testen',
]

export function PlanWahlModal({ onClose }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<'free' | 'pro' | null>(null)

  async function chooseFree() {
    setLoading('free')
    onClose()
    router.replace('/dashboard')
  }

  async function choosePro() {
    setLoading('pro')
    try {
      const r = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'pro',
          successUrl: `${window.location.origin}/dashboard?welcome=pro`,
          cancelUrl: `${window.location.origin}/dashboard?welcome=free`,
        }),
      })
      const data = await r.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setLoading(null)
      }
    } catch {
      setLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#2C2C2C]/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-[#F7F7F5] text-[#2C2C2C]/40 hover:text-[#2C2C2C] transition-colors z-10"
        >
          <X size={16} />
        </button>

        <div className="p-6 pb-4">
          <h2 className="font-syne font-extrabold text-[#2C2C2C] text-[22px] leading-tight mb-1">
            Womit möchtest du starten?
          </h2>
          <p className="text-[#2C2C2C]/40 font-semibold text-sm">
            Kein Risiko. Monatlich kündbar.
          </p>
        </div>

        <div className="px-4 pb-4 flex flex-col gap-3">
          {/* Free Card */}
          <div className="border-2 border-[#2C2C2C]/10 rounded-2xl p-4">
            <div className="font-extrabold text-[#2C2C2C] text-base mb-0.5">Reinschnuppern</div>
            <div className="font-extrabold text-[#2C2C2C] text-3xl mb-3">
              0 <span className="text-base font-semibold text-[#2C2C2C]/40">€</span>
            </div>
            <div className="flex flex-col gap-1.5 mb-4">
              {FREE_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-[13px] text-[#2C2C2C]/60 font-semibold">
                  <Check size={13} color="#2C2C2C" strokeWidth={2.5} className="opacity-40 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <button
              onClick={chooseFree}
              disabled={loading !== null}
              className="w-full border-2 border-[#2C2C2C]/15 rounded-xl py-3 font-extrabold text-[#2C2C2C] text-sm hover:border-[#2C2C2C]/30 transition-colors disabled:opacity-50"
            >
              {loading === 'free' ? 'Wird gestartet...' : 'Kostenlos starten'}
            </button>
          </div>

          {/* Pro Card */}
          <div className="border-2 border-[#F5C400] rounded-2xl p-4 bg-[#FFFDF0]">
            <div className="flex items-center justify-between mb-0.5">
              <div className="font-extrabold text-[#2C2C2C] text-base">⭐ Vollgas</div>
              <span className="text-[11px] font-extrabold bg-[#F5C400] text-[#2C2C2C] px-2 py-0.5 rounded-full">
                30 Tage gratis
              </span>
            </div>
            <div className="font-extrabold text-[#2C2C2C] text-3xl mb-0.5">
              17 <span className="text-base font-semibold text-[#2C2C2C]/40">€/Monat</span>
            </div>
            <div className="text-[12px] text-[#2C2C2C]/40 font-semibold mb-3">
              Bei Jahresabo. Monatlich 22 €.
            </div>
            <div className="flex flex-col gap-1.5 mb-4">
              {PRO_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-[13px] text-[#2C2C2C] font-semibold">
                  <Check size={13} color="#F5C400" strokeWidth={3} className="shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <button
              onClick={choosePro}
              disabled={loading !== null}
              className="w-full bg-[#F5C400] text-[#2C2C2C] font-extrabold text-sm rounded-xl py-3 active:scale-95 transition-transform disabled:opacity-50"
            >
              {loading === 'pro' ? 'Weiterleitung...' : '30 Tage gratis testen →'}
            </button>
          </div>
        </div>

        <div className="px-4 pb-5 text-center">
          <p className="text-[12px] text-[#2C2C2C]/30 font-semibold">
            Keine Kreditkarte für Free. Keine versteckten Kosten.
          </p>
          <button onClick={onClose} className="mt-2 text-[12px] text-[#2C2C2C]/30 font-semibold underline underline-offset-2">
            Erstmal ohne Plan fortfahren →
          </button>
        </div>
      </div>
    </div>
  )
}
