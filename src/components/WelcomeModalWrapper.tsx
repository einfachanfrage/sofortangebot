'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlanWahlModal } from '@/components/PlanWahlModal'

export function WelcomeModalWrapper() {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  if (!open) return null

  return (
    <PlanWahlModal
      onClose={() => {
        setOpen(false)
        // Remove ?welcome=new from URL without page reload
        router.replace('/dashboard', { scroll: false })
      }}
    />
  )
}
