'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Share, Plus, MoreVertical } from 'lucide-react'

interface Props {
  onClose: () => void
}

function detectPlatform(): 'ios' | 'android' | 'desktop' {
  const ua = navigator.userAgent
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios'
  if (/Android/i.test(ua)) return 'android'
  return 'desktop'
}

export function PwaBottomSheet({ onClose }: Props) {
  const [visible, setVisible] = useState(false)
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop')
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPlatform(detectPlatform())
    // Slide up after mount
    requestAnimationFrame(() => setVisible(true))
  }, [])

  function close() {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={close}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative w-full bg-white rounded-t-3xl transition-transform duration-300 ease-out"
        style={{
          height: '85dvh',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#2C2C2C]/20" />
        </div>

        <button
          onClick={close}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#F7F7F5] text-[#2C2C2C]/40 hover:text-[#2C2C2C]"
        >
          <X size={18} />
        </button>

        <div className="px-6 pt-4 pb-8 overflow-y-auto h-full">
          {/* Header */}
          <div className="mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#2C2C2C] flex items-center justify-center mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h2 className="font-syne font-extrabold text-[#2C2C2C] text-[26px] leading-tight mb-2">
              App auf Homescreen
            </h2>
            <p className="text-[#2C2C2C]/50 font-semibold text-[15px]">
              Schneller starten, besser arbeiten — ohne App Store.
            </p>
          </div>

          {/* Steps */}
          {platform === 'ios' && (
            <div className="flex flex-col gap-4">
              <Step number={1} icon={<Share size={18} />} title='Tippe auf "Teilen"'>
                Das Symbol unten in der Mitte der Safari-Leiste.
              </Step>
              <Step number={2} icon={<Plus size={18} />} title='"Zum Home-Bildschirm"'>
                Im Teilen-Menü nach unten scrollen und tippen.
              </Step>
              <Step number={3} icon={<span className="text-base">✓</span>} title="Fertig!">
                Sofortangebot erscheint wie eine echte App auf deinem Homescreen.
              </Step>
            </div>
          )}

          {platform === 'android' && (
            <div className="flex flex-col gap-4">
              <Step number={1} icon={<MoreVertical size={18} />} title="Menü öffnen">
                Tippe auf die drei Punkte oben rechts in Chrome.
              </Step>
              <Step number={2} icon={<Plus size={18} />} title='"Zum Startbildschirm zufügen"'>
                Option im Chrome-Menü antippen.
              </Step>
              <Step number={3} icon={<span className="text-base">✓</span>} title="Fertig!">
                Sofortangebot ist jetzt als App auf deinem Homescreen.
              </Step>
            </div>
          )}

          {platform === 'desktop' && (
            <div className="flex flex-col gap-4">
              <Step number={1} icon={<span className="text-base">🌐</span>} title="Browser-Menü">
                In Chrome: Icon in der Adressleiste rechts oder Menü → „Sofortangebot installieren".
              </Step>
              <Step number={2} icon={<span className="text-base">✓</span>} title="Installieren">
                Im Dialog auf „Installieren" klicken.
              </Step>
              <Step number={3} icon={<span className="text-base">🚀</span>} title="Fertig!">
                Sofortangebot startet jetzt wie eine Desktop-App.
              </Step>
            </div>
          )}

          <div className="mt-8 p-4 bg-[#F7F7F5] rounded-2xl">
            <p className="text-[#2C2C2C]/50 text-[13px] font-semibold text-center">
              Kein App Store nötig · Immer aktuell · Funktioniert offline
            </p>
          </div>

          <button
            onClick={close}
            className="mt-6 w-full bg-[#2C2C2C] text-white font-extrabold text-[15px] py-4 rounded-2xl active:scale-95 transition-transform"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  )
}

function Step({ number, icon, title, children }: {
  number: number
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-10 h-10 rounded-xl bg-[#2C2C2C] text-white flex items-center justify-center font-extrabold text-[15px]">
        {number}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[#2C2C2C]/40">{icon}</span>
          <span className="font-extrabold text-[#2C2C2C] text-[15px]">{title}</span>
        </div>
        <p className="text-[#2C2C2C]/50 font-semibold text-[13px]">{children}</p>
      </div>
    </div>
  )
}
