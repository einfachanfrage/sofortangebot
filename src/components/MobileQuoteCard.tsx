'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Props {
  quote: {
    id: string
    customer?: { name: string } | null
    total_gross: number
    status: string
    created_at: string
  }
  statusLabel: string
  statusColor: string
  formattedDate: string
  formattedAmount: string
}

export function MobileQuoteCard({ quote, statusLabel, statusColor, formattedDate, formattedAmount }: Props) {
  const [offset, setOffset] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)
  const supabase = createClient()
  const router = useRouter()

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
  }

  function onTouchMove(e: React.TouchEvent) {
    if (startX.current === null || startY.current === null) return
    const dx = e.touches[0].clientX - startX.current
    const dy = Math.abs(e.touches[0].clientY - startY.current)
    if (Math.abs(dx) > dy && dx < 0) {
      setOffset(Math.max(dx, -80))
    }
  }

  function onTouchEnd() {
    if (offset < -40) {
      setOffset(-80)
    } else {
      setOffset(0)
    }
    startX.current = null
    startY.current = null
  }

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    setDeleting(true)
    await supabase.from('quotes').delete().eq('id', quote.id)
    router.refresh()
  }

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Delete backdrop */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 flex items-center justify-center rounded-r-2xl">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex flex-col items-center gap-1 text-white active:opacity-70"
        >
          <Trash2 size={18} />
          <span className="text-[10px] font-bold">Löschen</span>
        </button>
      </div>

      {/* Card */}
      <div
        style={{
          transform: `translateX(${offset}px)`,
          transition: startX.current !== null ? 'none' : 'transform 0.2s ease',
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Link
          href={`/angebot/${quote.id}`}
          className="block bg-white rounded-2xl p-4 border border-[#2C2C2C]/5 active:scale-[0.99] transition-transform"
          onClick={e => { if (offset < -10) e.preventDefault() }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${statusColor}`}>
                  {statusLabel}
                </span>
                <div className="font-black text-[#2C2C2C] truncate text-sm">
                  {quote.customer?.name || 'Kunde unbekannt'}
                </div>
              </div>
              <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-1">{formattedDate}</div>
            </div>
            <div className="font-black text-[#2C2C2C] text-sm shrink-0">{formattedAmount}</div>
          </div>
        </Link>
      </div>
    </div>
  )
}
