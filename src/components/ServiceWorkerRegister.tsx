'use client'
import { useEffect } from 'react'

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        console.error('[service-worker] Registrierung fehlgeschlagen')
      })
    }
  }, [])
  return null
}
