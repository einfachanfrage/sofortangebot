'use client'

import { useEffect, useState } from 'react'
import { X, Bell } from 'lucide-react'

interface Props {
  onClose: () => void
  onGranted?: () => void
}

type Status = 'idle' | 'requesting' | 'granted' | 'denied'

export function PushBanner({ onClose, onGranted }: Props) {
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
  }, [])

  function close() {
    setVisible(false)
    setTimeout(onClose, 300)
  }

  async function requestPermission() {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      setStatus('denied')
      return
    }

    setStatus('requesting')

    try {
      const permission = await Notification.requestPermission()

      if (permission === 'granted') {
        await subscribeToPush()
        setStatus('granted')
        onGranted?.()
        setTimeout(close, 1500)
      } else {
        setStatus('denied')
      }
    } catch {
      setStatus('denied')
    }
  }

  async function subscribeToPush() {
    const reg = await navigator.serviceWorker.ready
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    if (!vapidKey) return

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    })

    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub.toJSON()),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={status === 'idle' || status === 'denied' ? close : undefined}
      />

      <div
        className="relative w-full bg-white rounded-t-3xl transition-transform duration-300 ease-out"
        style={{
          height: '50dvh',
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-anthracite/20" />
        </div>

        <button
          onClick={close}
          className="absolute top-4 right-4 p-2 rounded-full bg-bg text-anthracite/40"
        >
          <X size={18} />
        </button>

        <div className="px-6 pt-4 pb-8 flex flex-col h-full">
          {status === 'granted' ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">🔔</div>
              <h2 className="font-syne font-extrabold text-anthracite text-[24px] mb-2">
                Super, du bekommst Bescheid!
              </h2>
              <p className="text-anthracite/50 font-semibold text-[15px]">
                Wir informieren dich bei wichtigen Ereignissen.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-yellow flex items-center justify-center shrink-0">
                  <Bell size={24} color="var(--color-anthracite)" />
                </div>
                <div>
                  <h2 className="font-syne font-extrabold text-anthracite text-[22px] leading-tight mb-1">
                    Verpasse keine Angebots-Updates
                  </h2>
                  <p className="text-anthracite/50 font-semibold text-[14px]">
                    Wenn ein Kunde unterschrieben hat oder du erinnert werden willst — wir schicken dir Bescheid.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-6">
                {[
                  '✅ Kunde hat Angebot unterschrieben',
                  '⏰ Angebot läuft bald ab',
                  '📄 Neues Angebot bereit',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3 bg-bg rounded-xl px-4 py-3">
                    <span className="font-semibold text-anthracite text-[13px]">{item}</span>
                  </div>
                ))}
              </div>

              {status === 'denied' ? (
                <div className="text-center">
                  <p className="text-anthracite/40 font-semibold text-[13px] mb-3">
                    Benachrichtigungen blockiert. Du kannst sie in den Browser-Einstellungen aktivieren.
                  </p>
                  <button onClick={close} className="text-anthracite font-extrabold text-[14px] underline underline-offset-2">
                    Schließen
                  </button>
                </div>
              ) : (
                <button
                  onClick={requestPermission}
                  disabled={status === 'requesting'}
                  className="w-full bg-anthracite text-white font-extrabold text-[15px] py-4 rounded-2xl active:scale-95 transition-transform disabled:opacity-60 mt-auto"
                >
                  {status === 'requesting' ? 'Wird aktiviert...' : 'Benachrichtigungen erlauben →'}
                </button>
              )}

              <button onClick={close} className="mt-3 text-center text-anthracite/30 font-semibold text-[13px] w-full">
                Vielleicht später
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const arr = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) arr[i] = rawData.charCodeAt(i)
  return arr.buffer as ArrayBuffer
}
