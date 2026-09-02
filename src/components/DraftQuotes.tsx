'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface DraftQuote {
  id: string
  total_gross: number
  created_at: string
  customer?: { name: string } | null
}

function fmt(n: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n)
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export default function DraftQuotes({ drafts }: { drafts: DraftQuote[] }) {
  const [open, setOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  if (!drafts.length) return null

  async function deleteAll() {
    if (!confirm(`${drafts.length} Entwurf${drafts.length > 1 ? 'e' : ''} wirklich löschen?`)) return
    setDeleting(true)
    await supabase.from('quotes').delete().in('id', drafts.map(d => d.id))
    setDeleting(false)
    router.refresh()
  }

  return (
    <div className="px-5 md:px-8 mt-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full py-2"
      >
        <span className="text-sm font-bold text-anthracite/40">
          {drafts.length} Entwurf{drafts.length > 1 ? 'e' : ''}
        </span>
        {open ? <ChevronUp size={16} className="text-anthracite/30" /> : <ChevronDown size={16} className="text-anthracite/30" />}
      </button>

      {open && (
        <div className="flex flex-col gap-2 mt-1">
          {drafts.map(d => (
            <Link
              key={d.id}
              href={`/angebot/${d.id}`}
              className="bg-white/60 rounded-2xl p-4 border border-anthracite/5 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="font-bold text-anthracite/60 truncate text-sm">
                  {d.customer?.name || 'Kein Kunde'}
                </div>
                <div className="text-xs text-anthracite/30 font-semibold mt-0.5">{fmtDate(d.created_at)}</div>
              </div>
              <div className="text-sm font-black text-anthracite/40 shrink-0">{fmt(d.total_gross)}</div>
            </Link>
          ))}
          <button
            onClick={deleteAll}
            disabled={deleting}
            className="flex items-center justify-center gap-2 text-red-400 font-bold text-sm py-2 mt-1"
          >
            <Trash2 size={14} />
            {deleting ? 'Wird gelöscht...' : 'Alle Entwürfe löschen'}
          </button>
        </div>
      )}
    </div>
  )
}
