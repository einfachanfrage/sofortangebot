'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export const CURRENT_AGB_VERSION = '2026-06'

export function AgbUpdateModal() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function checkAgbVersion() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const userVersion = user.user_metadata?.agb_version
      if (!userVersion || userVersion !== CURRENT_AGB_VERSION) {
        setShow(true)
      }
    }
    checkAgbVersion()
  }, [])

  async function handleAccept() {
    setLoading(true)
    await supabase.auth.updateUser({
      data: {
        agb_akzeptiert_am: new Date().toISOString(),
        agb_version: CURRENT_AGB_VERSION,
      },
    })
    setShow(false)
    setLoading(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl border-2 border-anthracite max-w-sm w-full p-8 shadow-xl">
        <div className="text-3xl mb-4">📋</div>
        <h2 className="font-black text-xl text-anthracite mb-3">
          Wir haben unsere AGB aktualisiert.
        </h2>
        <p className="text-anthracite/60 font-semibold text-sm leading-relaxed mb-6">
          Bitte lies die Änderungen und akzeptiere die neuen AGB um weiterzumachen.
        </p>

        <Link
          href="/agb"
          target="_blank"
          className="flex items-center justify-between w-full bg-bg border border-anthracite/10 rounded-xl px-4 py-3 text-sm font-black text-anthracite mb-3 hover:bg-yellow/10 transition-colors"
        >
          AGB lesen
          <span className="text-anthracite/40">→</span>
        </Link>

        <button
          onClick={handleAccept}
          disabled={loading}
          className="w-full bg-yellow text-anthracite font-black text-base rounded-xl py-3.5 active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? 'Einen Moment...' : 'Akzeptieren & weiter'}
        </button>
      </div>
    </div>
  )
}
