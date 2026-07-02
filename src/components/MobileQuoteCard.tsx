'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Trash2, MoreHorizontal } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const BORDER_COLOR: Record<string, string> = {
  draft:          'bg-[#2C2C2C]/30',
  in_bearbeitung: 'bg-[#2C2C2C]/30',
  bereit:         'bg-[#F5C400]',
  sent:           'bg-[#3B82F6]',
  viewed:         'bg-purple-500',
  accepted:       'bg-[#22C55E]',
  rejected:       'bg-red-500',
  archived:       'bg-gray-300',
}

const STATUS_BADGE: Record<string, string> = {
  draft:          'bg-[#2C2C2C]/8 text-[#2C2C2C]/50',
  in_bearbeitung: 'bg-[#2C2C2C]/8 text-[#2C2C2C]/50',
  bereit:         'bg-[#FEF9C3] text-[#713F12]',
  sent:           'bg-[#DBEAFE] text-[#1E40AF]',
  viewed:         'bg-purple-50 text-purple-800',
  accepted:       'bg-[#DCFCE7] text-[#14532D]',
  rejected:       'bg-red-50 text-red-700',
  archived:       'bg-gray-100 text-gray-500',
}

interface Props {
  quote: {
    id: string
    quote_number?: string | null
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
  ersterItemTitel?: string | null
}

export function MobileQuoteCard({ quote, statusLabel, formattedDate, formattedAmount }: Props) {
  const [showMenu, setShowMenu] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const router = useRouter()

  // Menü schließen bei Klick außerhalb
  useEffect(() => {
    if (!showMenu) return
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [showMenu])

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault(); e.stopPropagation()
    if (!confirm('Angebot wirklich löschen?')) return
    setDeleting(true)
    setShowMenu(false)
    await supabase.from('quotes').delete().eq('id', quote.id)
    router.refresh()
  }

  const borderClass = BORDER_COLOR[quote.status] ?? 'bg-gray-300'
  const badgeClass = STATUS_BADGE[quote.status] ?? STATUS_BADGE.draft

  const kundenname = quote.customer?.name?.trim()
  const nummer = quote.quote_number
  const primaryTitle = kundenname ?? 'Kunde offen'
  const subtitle = [nummer, formattedDate].filter(Boolean).join(' · ')

  return (
    <div className="relative">
      <Link
        href={`/angebot/${quote.id}`}
        className="block active:scale-[0.99] transition-transform"
      >
        <div className="relative overflow-hidden rounded-2xl bg-white border border-black/5">
          <div className={`absolute left-0 top-0 bottom-0 w-1 ${borderClass}`} />
          <div className="pl-4 pr-3 py-3.5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className={`font-black text-sm truncate ${kundenname ? 'text-[#1A1A1A]' : 'text-[#1A1A1A]/40 italic'}`}>
                  {primaryTitle}
                </div>
                <div className="text-xs text-[#888888] font-semibold mt-0.5">{subtitle}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="text-right">
                  <div className="font-black text-[#1A1A1A] text-sm">{formattedAmount}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${badgeClass}`}>
                    {statusLabel}
                  </span>
                </div>
                {/* 3-Punkte-Button */}
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setShowMenu(v => !v) }}
                  className="p-1.5 text-[#2C2C2C]/30 hover:text-[#2C2C2C]/60 active:bg-[#2C2C2C]/5 rounded-lg transition-colors"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Dropdown-Menü */}
      {showMenu && (
        <div ref={menuRef} className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-xl border border-[#2C2C2C]/8 min-w-[150px] overflow-hidden">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2.5 w-full px-4 py-3 text-red-500 font-semibold text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <Trash2 size={15} />
            {deleting ? 'Wird gelöscht…' : 'Löschen'}
          </button>
        </div>
      )}
    </div>
  )
}
