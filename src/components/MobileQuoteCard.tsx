'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Trash2, MoreHorizontal } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { getStatusInfo } from '@/lib/status'

// DC-003: hatte hier vorher zwei eigene Status→Farbe-Tabellen (Rand +
// Badge), unabhängig von den drei weiteren im Rest des Produkts — jetzt
// eine gemeinsame Quelle, siehe src/lib/status.ts. `statusLabel`/
// `statusColor` kamen bisher als Props von außen (angebote/page.tsx,
// dashboard/page.tsx hatten dafür jeweils eigene STATUS_LABEL-Tabellen) —
// `statusColor` wurde nie ausgewertet (siehe altes Props-Destructuring
// unten, das den Parameter gar nicht auflistete). Jetzt berechnet die Karte
// Label UND Farbe selbst aus `quote.status`, keine Props mehr nötig, keine
// Möglichkeit mehr, dass zwei Aufrufstellen unterschiedliche Werte liefern.

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
  formattedDate: string
  formattedAmount: string
  ersterItemTitel?: string | null
}

export function MobileQuoteCard({ quote, formattedDate, formattedAmount }: Props) {
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

  const status = getStatusInfo(quote.status)

  // DC-042 (2026-08-30, Sandys Go): "Beim Kunden seit X Tagen" macht
  // "wartet auf Antwort" konkret statt vage — Grundlage ist `created_at`
  // (kein neues Feld, dafür leicht ungenau, falls "Bereit" länger vor dem
  // eigentlichen Versand lag). Ein exaktes `sent_at`-Feld wäre eine
  // Datenbank-Änderung und bewusst NICHT Teil dieser Änderung, siehe
  // design-check.md DC-042.
  const tageSeitVersand = quote.status === 'sent'
    ? Math.max(0, Math.floor((Date.now() - new Date(quote.created_at).getTime()) / 86400000))
    : null

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
          <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: status.dot }} />
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
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                  {tageSeitVersand !== null && (
                    <div className="text-[9.5px] font-bold text-anthracite/40 mt-1">
                      seit {tageSeitVersand === 1 ? '1 Tag' : `${tageSeitVersand} Tagen`}
                    </div>
                  )}
                </div>
                {/* 3-Punkte-Button */}
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setShowMenu(v => !v) }}
                  className="p-1.5 text-anthracite/30 hover:text-anthracite/60 active:bg-anthracite/5 rounded-lg transition-colors"
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
        <div ref={menuRef} className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-xl border border-anthracite/8 min-w-[150px] overflow-hidden">
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
