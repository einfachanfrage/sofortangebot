'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { TESTPHASE_ENDE_TITEL, TESTPHASE_ENDE_ZUSAGE, ABO_CTA } from '@/lib/pricing'

function AngebotNeuInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  // DC-045: Die Monatsgrenze ist kein Fehler, sondern eine Ansage. Sie
  // bekommt deshalb einen eigenen Zustand und einen eigenen Bildschirm —
  // ein rotes „Aufmaß konnte nicht angelegt werden. Bitte neu laden."
  // würde jemanden, der beim Kunden steht, ratlos zurücklassen.
  const [limitText, setLimitText] = useState('')
  // Head of Marketing (23.09.2026): Welcher Grund dasteht, entscheidet die
  // Überschrift. „Dein Monat ist voll" war der Grund aus dem abgelösten
  // Modell und stand hier noch, nachdem CoS-038-B das Kontingent entfernt
  // hatte — über einem Text, der von der Testphase sprach. Zwei Gründe auf
  // einem Bildschirm, und der größer gesetzte war der falsche.
  const [testphaseVorbei, setTestphaseVorbei] = useState(false)

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
        if (res.status === 403) {
          const daten = await res.json().catch(() => ({})) as { error?: string; message?: string }
          // CoS-038-B: Der Schlüssel heißt jetzt nach dem Grund ('testphase_abgelaufen');
          // 'limit_erreicht' bleibt für den Fall stehen, dass noch eine alte Antwort unterwegs ist.
          if (daten.error === 'testphase_abgelaufen') {
            // Der Grund steht schon in der Überschrift — hier nur die Zusage,
            // sonst stünde „Deine Testphase ist vorbei" zweimal untereinander.
            setTestphaseVorbei(true)
            setLimitText(TESTPHASE_ENDE_ZUSAGE)
            return
          }
          if (daten.error === 'limit_erreicht' && daten.message) { setLimitText(daten.message); return }
        }
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
    <div className="min-h-dvh bg-anthracite flex flex-col items-center justify-center gap-4 px-5">
      {limitText ? (
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-white font-syne font-black text-lg mb-2">
            {testphaseVorbei ? TESTPHASE_ENDE_TITEL : 'Dein Monat ist voll'}
          </p>
          <p className="text-white/60 font-semibold text-sm mb-6">{limitText}</p>
          <Link
            href="/einstellungen/abo"
            className="block w-full transition-colors bg-yellow hover:bg-yellow-600 active:bg-yellow-700 text-anthracite font-black rounded-2xl py-3.5 mb-3"
          >
            {ABO_CTA}
          </Link>
          <button
            onClick={() => router.push('/angebote')}
            className="text-white/50 font-semibold text-sm underline"
          >
            Zu meinen Angeboten
          </button>
        </div>
      ) : error ? (
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
          <Loader2 size={32} color="var(--color-yellow)" className="animate-spin" />
          <p className="text-white/60 font-semibold text-base">Aufmaß wird angelegt…</p>
        </>
      )}
    </div>
  )
}

export default function AngebotNeuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-dvh bg-anthracite flex flex-col items-center justify-center gap-4 px-5">
        <Loader2 size={32} color="var(--color-yellow)" className="animate-spin" />
      </div>
    }>
      <AngebotNeuInner />
    </Suspense>
  )
}
