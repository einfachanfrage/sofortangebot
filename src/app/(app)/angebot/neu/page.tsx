'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

function AngebotNeuInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    async function create() {
      try {
        // DC-029: "+ Neues Angebot für diese Baustelle" auf der Kunde-Seite
        // übergibt Kunde + Baustelle direkt als Query-Parameter, statt sie
        // erst nachträglich im Editor umzustellen.
        const customerId = searchParams.get('customerId')
        const baustelleId = searchParams.get('baustelleId')
        const res = await fetch('/api/entwurf/neu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...(customerId ? { customer_id: customerId } : {}),
            ...(baustelleId ? { baustelle_id: baustelleId } : {}),
          }),
        })
        if (!res.ok) { setError('Aufmaß konnte nicht angelegt werden. Bitte neu laden.'); return }
        const { id } = await res.json() as { id: string }
        router.replace(`/angebot/${id}/entwurf`)
      } catch {
        setError('Netzwerkfehler. Bitte neu laden.')
      }
    }
    create()
  }, [router, searchParams])

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

export default function AngebotNeuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh bg-[#2C2C2C] flex flex-col items-center justify-center gap-4 px-5">
        <Loader2 size={32} color="#F5C400" className="animate-spin" />
      </div>
    }>
      <AngebotNeuInner />
    </Suspense>
  )
}
