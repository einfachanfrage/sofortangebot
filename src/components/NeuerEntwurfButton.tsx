'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mic, Loader2 } from 'lucide-react'
import { nutzerFehler } from '@/lib/fehlertexte'

export function NeuerEntwurfButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function start() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/entwurf/neu', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      const data = await res.json() as { id?: string; error?: string }
      if (!res.ok || !data.id) { setError(nutzerFehler(data, 'Der Entwurf konnte nicht angelegt werden — bitte nochmal versuchen.')); setLoading(false); return }
      router.push(`/angebot/${data.id}/entwurf`)
    } catch {
      setError('Verbindungsfehler')
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={start}
        disabled={loading}
        className="flex items-center gap-2 bg-yellow hover:bg-yellow-600 active:bg-yellow-700 disabled:hover:bg-yellow text-anthracite font-extrabold text-[14px] px-5 py-3 rounded-2xl active:translate-y-px transition-all disabled:opacity-60 shadow-sm shadow-yellow/30"
      >
        {loading
          ? <Loader2 size={16} className="animate-spin" />
          : <Mic size={16} />
        }
        Entwurf starten
      </button>
      {error && <p className="text-red-500 text-[12px] font-semibold mt-1">{error}</p>}
    </div>
  )
}
