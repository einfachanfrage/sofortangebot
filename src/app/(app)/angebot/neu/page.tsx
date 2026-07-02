'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AngebotNeuPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    async function create() {
      try {
        const res = await fetch('/api/entwurf/neu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        })
        if (!res.ok) { setError('Aufmaß konnte nicht angelegt werden. Bitte neu laden.'); return }
        const { id } = await res.json() as { id: string }
        router.replace(`/angebot/${id}/entwurf`)
      } catch {
        setError('Netzwerkfehler. Bitte neu laden.')
      }
    }
    create()
  }, [router])

  return (
    <div className="min-h-dvh bg-[#2C2C2C] flex flex-col items-center justify-center gap-4 px-5">
      {error ? (
        <div className="text-center">
          <p className="text-red-400 font-semibold mb-4">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-white/50 font-semibold text-sm underline"
          >
            Zurück zum Dashboard
          </button>
        </div>
      ) : (
        <>
          <Loader2 size={32} color="#F5C400" className="animate-spin" />
          <p className="text-white/60 font-semibold text-base">Aufmaß wird angelegt…</p>
        </>
      )}
    </div>
  )
}
