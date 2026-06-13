'use client'

export function StagingBanner() {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT !== 'staging') return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-500 text-white text-center py-1 text-xs font-bold tracking-wide">
      ⚠️ STAGING — Keine echten Daten — Stripe Testmodus
    </div>
  )
}
