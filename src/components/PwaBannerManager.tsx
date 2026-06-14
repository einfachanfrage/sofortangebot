'use client'

import { useEffect, useState } from 'react'
import { PwaBottomSheet } from '@/components/PwaBottomSheet'
import { PushBanner } from '@/components/PushBanner'

type Banner = 'pwa' | 'push' | null

const PWA_KEY = 'pwa-banner-dismissed'
const PUSH_KEY = 'push-banner-dismissed'
const ONBOARDING_DELAY = 3000 // 3s nach Dashboard-Öffnung

function isInStandaloneMode(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
  )
}

function isPwaInstallable(): boolean {
  // Only show on mobile browsers, not in standalone mode
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
  return isMobile && !isInStandaloneMode()
}

export function PwaBannerManager() {
  const [active, setActive] = useState<Banner>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const pwaDismissed = localStorage.getItem(PWA_KEY)
      const pushDismissed = localStorage.getItem(PUSH_KEY)
      const pushAlreadyGranted = 'Notification' in window && Notification.permission === 'granted'

      if (!pwaDismissed && isPwaInstallable()) {
        setActive('pwa')
      } else if (!pushDismissed && !pushAlreadyGranted && 'Notification' in window) {
        setActive('push')
      }
    }, ONBOARDING_DELAY)

    return () => clearTimeout(timer)
  }, [])

  function closePwa() {
    localStorage.setItem(PWA_KEY, '1')
    setActive(null)

    // After PWA sheet is closed, check if push should follow
    const pushDismissed = localStorage.getItem(PUSH_KEY)
    const pushAlreadyGranted = 'Notification' in window && Notification.permission === 'granted'
    if (!pushDismissed && !pushAlreadyGranted && 'Notification' in window) {
      setTimeout(() => setActive('push'), 800)
    }
  }

  function closePush() {
    localStorage.setItem(PUSH_KEY, '1')
    setActive(null)
  }

  if (active === 'pwa') return <PwaBottomSheet onClose={closePwa} />
  if (active === 'push') return <PushBanner onClose={closePush} />
  return null
}
