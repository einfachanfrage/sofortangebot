'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { PRICING, GRUENDERPREIS_TEXT, TESTPHASE_CTA, bruttoText } from '@/lib/pricing'

interface Props {
  onClose: () => void
}

// ── CoS-038-A (Head of Product Engineering, 23.09.2026) ───────────────────
//
// Nur die BESCHRIFTUNG ist geändert, der Ablauf nicht: „erst mal testen"
// führt unverändert auf das Dashboard, „abonnieren" unverändert in den
// Stripe-Checkout. Was hier stand, bewarb das abgelöste Modell — ein
// Gratis-Kontingent, ein Jahresabo zu 17 € und „30 Tage gratis", eine Zahl,
// die es in KEINEM der beiden Modelle je gab. Die Testphase sind 14 Tage
// (`companies.trial_ends_at`), sie läuft ohne Kreditkarte und ohne Stripe.
const TEST_FEATURES = [
  `${PRICING.testTage} Tage voller Funktionsumfang`,
  'Keine Kreditkarte, keine stille Verlängerung',
  'Angebote bleiben dir erhalten',
]

const PRO_FEATURES = [
  'Unbegrenzte Angebote',
  PRICING.unterstuetzteGewerke,
  'Digitale Unterschrift',
  'Lexware Office & sevDesk Export',
  'Monatlich kündbar',
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
      <div className="absolute inset-0 bg-anthracite/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-bg hover:bg-sunken text-anthracite/40 hover:text-anthracite transition-colors z-10"
        >
          <X size={16} />
        </button>

        <div className="p-6 pb-4">
          <h2 className="font-syne font-extrabold text-anthracite text-[22px] leading-tight mb-1">
            Womit möchtest du starten?
          </h2>
          <p className="text-anthracite/40 font-semibold text-sm">
            {TESTPHASE_CTA}. Danach monatlich kündbar.
          </p>
        </div>

        <div className="px-4 pb-4 flex flex-col gap-3">
          {/* Free Card */}
          <div className="border-2 border-anthracite/10 rounded-2xl p-4">
            <div className="font-extrabold text-anthracite text-base mb-0.5">Erst mal testen</div>
            <div className="font-extrabold text-anthracite text-3xl mb-3">
              {PRICING.testTage} <span className="text-base font-semibold text-anthracite/40">Tage</span>
            </div>
            <div className="flex flex-col gap-1.5 mb-4">
              {TEST_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-[13px] text-anthracite/60 font-semibold">
                  <Check size={13} color="var(--color-anthracite)" strokeWidth={2.5} className="opacity-40 shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <button
              onClick={chooseFree}
              disabled={loading !== null}
              className="w-full border-2 border-anthracite/15 hover:bg-sunken rounded-xl py-3 font-extrabold text-anthracite text-sm hover:border-anthracite/30 transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
            >
              {loading === 'free' ? 'Wird gestartet...' : `${PRICING.testTage} Tage testen`}
            </button>
          </div>

          {/* Pro Card */}
          <div className="border-2 border-yellow rounded-2xl p-4 bg-[#FFFDF0]">
            <div className="flex items-center justify-between mb-0.5">
              <div className="font-extrabold text-anthracite text-base">⭐ Vollgas</div>
              <span className="text-[11px] font-extrabold bg-yellow text-anthracite px-2 py-0.5 rounded-full">
                Gründerpreis
              </span>
            </div>
            <div className="font-extrabold text-anthracite text-3xl mb-0.5">
              {PRICING.gruenderMonatlich} <span className="text-base font-semibold text-anthracite/40">€/Monat</span>
            </div>
            <div className="text-[12px] text-anthracite/40 font-semibold mb-1">
              zzgl. MwSt. — {bruttoText(PRICING.gruenderMonatlich)} brutto
            </div>
            <div className="text-[12px] text-anthracite/40 font-semibold mb-3">
              {GRUENDERPREIS_TEXT}
            </div>
            <div className="flex flex-col gap-1.5 mb-4">
              {PRO_FEATURES.map(f => (
                <div key={f} className="flex items-center gap-2 text-[13px] text-anthracite font-semibold">
                  <Check size={13} color="var(--color-yellow)" strokeWidth={3} className="shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <button
              onClick={choosePro}
              disabled={loading !== null}
              className="w-full bg-yellow hover:bg-yellow-600 active:bg-yellow-700 disabled:hover:bg-yellow text-anthracite font-extrabold text-sm rounded-xl py-3 active:translate-y-px transition-all disabled:opacity-50"
            >
              {loading === 'pro' ? 'Weiterleitung...' : 'Jetzt abonnieren →'}
            </button>
          </div>
        </div>

        <div className="px-4 pb-5 text-center">
          <p className="text-[12px] text-anthracite/30 font-semibold">
            Keine Kreditkarte für den Test. Keine versteckten Kosten.
          </p>
          <button onClick={onClose} className="mt-2 text-[12px] text-anthracite/30 font-semibold underline underline-offset-2">
            Erstmal ohne Plan fortfahren →
          </button>
        </div>
      </div>
    </div>
  )
}
