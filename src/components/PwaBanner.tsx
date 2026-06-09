'use client'

import { useEffect, useState } from 'react'
import { X, Share, MoreVertical } from 'lucide-react'

export default function PwaBanner() {
  const [show, setShow] = useState(false)
  const [platform, setPlatform] = useState<'ios' | 'android' | null>(null)

  useEffect(() => {
    // Nicht zeigen wenn bereits als PWA installiert
    if (window.matchMedia('(display-mode: standalone)').matches) return
    // Nicht zeigen wenn bereits weggeklickt
    if (localStorage.getItem('pwa-banner-dismissed')) return

    const ua = navigator.userAgent
    if (/iphone|ipad|ipod/i.test(ua)) {
      setPlatform('ios')
      setShow(true)
    } else if (/android/i.test(ua)) {
      setPlatform('android')
      setShow(true)
    }
  }, [])

  function dismiss() {
    localStorage.setItem('pwa-banner-dismissed', '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="mx-5 mt-4 bg-[#2C2C2C] rounded-2xl p-4 relative">
      <button onClick={dismiss} className="absolute top-3 right-3 p-1">
        <X size={16} color="white" className="opacity-40" />
      </button>

      <div className="pr-6">
        <div className="font-black text-white text-sm mb-1">💡 App auf dem Handy speichern</div>
        <div className="text-white/50 text-xs font-semibold mb-3">
          Einmal installieren — dann startet sie wie eine richtige App, ohne Browser.
        </div>

        {platform === 'ios' && (
          <div className="flex flex-col gap-2">
            <Step n={1} color="white">
              Tippe unten in Safari auf das{' '}
              <span className="inline-flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded-lg">
                <Share size={11} color="white" />
                <span>Teilen</span>
              </span>
              {' '}Symbol
            </Step>
            <Step n={2} color="white">Scrolle runter → „Zum Home-Bildschirm"</Step>
            <Step n={3} color="white">Tippe oben rechts auf „Hinzufügen" — fertig!</Step>
          </div>
        )}

        {platform === 'android' && (
          <div className="flex flex-col gap-2">
            <Step n={1} color="white">
              Tippe in Chrome oben rechts auf{' '}
              <span className="inline-flex items-center gap-1 bg-white/10 px-1.5 py-0.5 rounded-lg">
                <MoreVertical size={11} color="white" />
                <span>Menü</span>
              </span>
            </Step>
            <Step n={2} color="white">Tippe auf „App installieren" oder „Zum Startbildschirm"</Step>
            <Step n={3} color="white">Bestätige mit „Installieren" — fertig!</Step>
          </div>
        )}
      </div>
    </div>
  )
}

function Step({ n, color, children }: { n: number; color: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-5 h-5 rounded-full bg-[#F5C400] flex items-center justify-center shrink-0 font-black text-[#2C2C2C] text-[10px] mt-0.5">
        {n}
      </div>
      <span className={`text-xs font-semibold leading-relaxed text-${color}/70`}>{children}</span>
    </div>
  )
}
