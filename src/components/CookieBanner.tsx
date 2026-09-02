'use client'

import { useEffect, useState } from 'react'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie_notice_seen')) {
      setVisible(true)
    }
  }, [])

  function dismiss() {
    localStorage.setItem('cookie_notice_seen', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 flex items-center justify-between gap-4 px-5 py-3.5 bg-anthracite text-white">
      <p className="text-xs font-semibold text-white/70 leading-snug">
        Wir verwenden ausschließlich technisch notwendige Cookies. Kein Tracking. Keine Werbung.
      </p>
      <button
        onClick={dismiss}
        className="flex-shrink-0 bg-yellow text-anthracite text-xs font-black px-4 py-2 rounded-lg active:scale-95 transition-transform"
      >
        Verstanden
      </button>
    </div>
  )
}
