'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function RestoreBanner() {
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: co } = await supabase
        .from('companies')
        .select('deleted_at')
        .eq('user_id', user.id)
        .single()
      if (co?.deleted_at) {
        const deletedAt = new Date(co.deleted_at)
        const diff = Date.now() - deletedAt.getTime()
        const days30 = 30 * 24 * 60 * 60 * 1000
        if (diff < days30) setShow(true)
      }
    }
    check()
  }, [])

  async function restore() {
    setLoading(true)
    await fetch('/api/account/restore', { method: 'POST' })
    setShow(false)
    router.refresh()
  }

  async function dismiss() {
    setShow(false)
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!show) return null

  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-yellow px-5 py-4 shadow-lg">
      <p className="font-bold text-anthracite text-sm mb-3 leading-snug">
        Dein Account wurde gelöscht, kann aber noch wiederhergestellt werden.
        Wiederherstellen?
      </p>
      <div className="flex gap-3">
        <button
          onClick={restore}
          disabled={loading}
          className="bg-anthracite text-white font-black text-sm px-5 py-2.5 rounded-xl active:scale-95 transition-transform disabled:opacity-50"
        >
          {loading ? '...' : 'Ja, wiederherstellen'}
        </button>
        <button
          onClick={dismiss}
          className="text-anthracite/60 font-bold text-sm px-4 py-2.5"
        >
          Nein, neu starten
        </button>
      </div>
    </div>
  )
}
