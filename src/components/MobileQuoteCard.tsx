'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const BORDER_COLOR: Record<string, string> = {
  draft:          'bg-[#F5C400]',
  in_bearbeitung: 'bg-[#F5C400]',
  sent:           'bg-[#3B82F6]',
  viewed:         'bg-purple-500',
  accepted:       'bg-[#22C55E]',
  rejected:       'bg-red-500',
  archived:       'bg-gray-300',
}

const STATUS_BADGE: Record<string, string> = {
  draft:          'bg-[#FEF9C3] text-[#713F12]',
  in_bearbeitung: 'bg-[#FEF9C3] text-[#713F12]',
  sent:           'bg-[#DBEAFE] text-[#1E40AF]',
  viewed:         'bg-purple-50 text-purple-800',
  accepted:       'bg-[#DCFCE7] text-[#14532D]',
  rejected:       'bg-red-50 text-red-700',
  archived:       'bg-gray-100 text-gray-500',
}

const GEWERK_LABEL: Record<string, string> = {
  maler:            'Maler',
  fliesen:          'Fliesen',
  trockenbau:       'Trockenbau',
  boden_parkett:    'Boden',
  sanitaer_heizung: 'Sanitär',
  elektro:          'Elektro',
}

interface Props {
  quote: {
    id: string
    customer?: { name: string } | null
    total_gross: number
    status: string
    created_at: string
    gewerk?: string | null
  }
  statusLabel: string
  statusColor?: string
  formattedDate: string
  formattedAmount: string
}

export function MobileQuoteCard({ quote, statusLabel, formattedDate, formattedAmount }: Props) {
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
    if (Math.abs(dx) > dy && dx < 0) setOffset(Math.max(dx, -80))
  }
  function onTouchEnd() {
    setOffset(offset < -40 ? -80 : 0)
    startX.current = null
    startY.current = null
  }
  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation()
    setDeleting(true)
    await supabase.from('quotes').delete().eq('id', quote.id)
    router.refresh()
  }

  const borderClass = BORDER_COLOR[quote.status] ?? 'bg-gray-300'
  const badgeClass = STATUS_BADGE[quote.status] ?? STATUS_BADGE.draft
  const customerName = quote.customer?.name
  const gewerkLabel = quote.gewerk ? GEWERK_LABEL[quote.gewerk] : null

  // Haupttitel: Kundenname wenn vorhanden, sonst Gewerk, sonst leer
  const primaryTitle = customerName || gewerkLabel || null
  const subtitle = [gewerkLabel && customerName ? gewerkLabel : null, formattedDate]
    .filter(Boolean).join(' · ')

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-red-500 flex items-center justify-center rounded-r-2xl">
        <button onClick={handleDelete} disabled={deleting} className="flex flex-col items-center gap-1 text-white active:opacity-70">
          <Trash2 size={18} />
          <span className="text-[10px] font-bold">Löschen</span>
        </button>
      </div>
      <div
        style={{ transform: `translateX(${offset}px)`, transition: startX.current !== null ? 'none' : 'transform 0.2s ease' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Link
          href={`/angebot/${quote.id}`}
          className="block active:scale-[0.99] transition-transform"
          onClick={e => { if (offset < -10) e.preventDefault() }}
        >
          <div className="relative overflow-hidden rounded-2xl bg-white border border-black/5">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderClass}`} />
            <div className="pl-4 pr-4 py-3.5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {primaryTitle ? (
                    <div className="font-black text-[#1A1A1A] text-sm truncate">{primaryTitle}</div>
                  ) : (
                    <div className="font-black text-[#888888] text-sm">Aufmaß</div>
                  )}
                  <div className="text-xs text-[#888888] font-semibold mt-0.5">{subtitle || formattedDate}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-[#1A1A1A] text-sm">{formattedAmount}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${badgeClass}`}>
                    {statusLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
