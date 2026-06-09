import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import type { Quote } from '@/lib/types'
import { Logo } from '@/components/Logo'
import PwaBanner from '@/components/PwaBanner'
import BottomNav from '@/components/BottomNav'
import DashboardFilters from '@/components/DashboardFilters'
import DraftQuotes from '@/components/DraftQuotes'
import { Mic, FileText } from 'lucide-react'

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  draft:    { label: 'Entwurf',    color: 'bg-gray-100 text-gray-600'  },
  sent:     { label: 'Offen',      color: 'bg-blue-50 text-blue-700'   },
  accepted: { label: 'Beauftragt', color: 'bg-green-50 text-green-700' },
  rejected: { label: 'Abgelehnt', color: 'bg-red-50 text-red-700'     },
  archived: { label: 'Archiviert', color: 'bg-gray-50 text-gray-400'   },
}

const VIA_ICON: Record<string, string> = {
  email: '✉️', whatsapp: '💬', link: '🔗',
  lexoffice: 'LO', sevdesk: 'SD', fastbill: 'FB',
  billomat: 'BM', papierkram: 'PK', easybill: 'EB',
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (company && !company.name) redirect('/onboarding')

  const { q, status } = await searchParams

  let query = supabase
    .from('quotes')
    .select('*, customer:customers(name), sent_via')
    .eq('company_id', company?.id)
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data: allQuotes } = await query

  const drafts = (allQuotes ?? []).filter(qt => qt.status === 'draft')
  const nonDraftQuotes = (allQuotes ?? []).filter(qt => qt.status !== 'draft')

  const quotes = (q
    ? nonDraftQuotes.filter(qt => (qt.customer?.name ?? '').toLowerCase().includes(q.toLowerCase()))
    : nonDraftQuotes)

  const openCount = nonDraftQuotes.filter(qt => qt.status === 'sent').length
  const acceptedCount = nonDraftQuotes.filter(qt => qt.status === 'accepted').length

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-24 md:pb-8">
      {/* Header — mobile only (desktop hat SideNav) */}
      <div className="md:hidden bg-[#2C2C2C] px-5 pt-12 pb-6">
        <Logo variant="dark" className="text-xl" />
        <div className="text-white font-bold mt-1 text-lg">
          {company?.name || 'Mein Betrieb'}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:flex items-center justify-between px-8 pt-8 pb-6">
        <div>
          <div className="text-2xl font-black text-[#2C2C2C]">{company?.name || 'Mein Betrieb'}</div>
          <div className="text-[#2C2C2C]/40 font-semibold text-sm mt-0.5">Übersicht</div>
        </div>
        <Link
          href="/angebot/neu"
          className="flex items-center gap-2 bg-[#F5C400] text-[#2C2C2C] font-black text-sm rounded-xl px-5 py-3 hover:bg-[#F5C400]/90 transition-colors"
        >
          <Mic size={16} strokeWidth={2.5} />
          Neues Angebot
        </Link>
      </div>

      <PwaBanner />

      {/* Stats */}
      <div className="px-5 md:px-8 -mt-4 md:mt-0 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#2C2C2C]/5">
          <div className="text-3xl font-black text-[#2C2C2C]">{openCount}</div>
          <div className="text-sm font-semibold text-[#2C2C2C]/60">Offen</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#2C2C2C]/5">
          <div className="text-3xl font-black text-[#2C2C2C]">{acceptedCount}</div>
          <div className="text-sm font-semibold text-[#2C2C2C]/60">Beauftragt</div>
        </div>
        <div className="hidden md:block bg-white rounded-2xl p-4 shadow-sm border border-[#2C2C2C]/5">
          <div className="text-3xl font-black text-[#2C2C2C]">{nonDraftQuotes.filter(qt => qt.status === 'rejected').length}</div>
          <div className="text-sm font-semibold text-[#2C2C2C]/60">Abgelehnt</div>
        </div>
        <div className="hidden md:block bg-white rounded-2xl p-4 shadow-sm border border-[#2C2C2C]/5">
          <div className="text-3xl font-black text-[#2C2C2C]">{nonDraftQuotes.length}</div>
          <div className="text-sm font-semibold text-[#2C2C2C]/60">Gesamt</div>
        </div>
      </div>

      {/* CTA — mobile only */}
      <div className="md:hidden px-5 mt-5">
        <Link
          href="/angebot/neu"
          className="flex items-center justify-center gap-3 w-full bg-[#F5C400] text-[#2C2C2C] font-black text-xl rounded-2xl py-5 shadow-sm active:scale-95 transition-transform"
        >
          <Mic size={22} strokeWidth={2.5} />
          Neues Angebot
        </Link>
      </div>

      {/* Suche + Filter */}
      <div className="px-5 md:px-8 mt-6">
        <Suspense>
          <DashboardFilters />
        </Suspense>
      </div>

      {/* Angebote */}
      <div className="px-5 md:px-8 mt-4">
        {!quotes?.length && (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#2C2C2C]/5">
            <FileText size={36} color="#2C2C2C" strokeWidth={1.5} className="mx-auto mb-3 opacity-20" />
            {q || status
              ? <div className="font-bold text-[#2C2C2C]/60">Keine Treffer.</div>
              : <>
                  <div className="font-bold text-[#2C2C2C]/60">Noch keine Angebote.</div>
                  <div className="text-sm text-[#2C2C2C]/40 font-semibold mt-1">Starte mit dem Mikrofon-Button oben.</div>
                </>
            }
          </div>
        )}

        <div className="flex flex-col gap-3">
          {quotes?.map((quote: Quote & { customer?: { name: string }; sent_via?: string[] }) => {
            const statusCfg = STATUS_LABEL[quote.status] ?? STATUS_LABEL.draft
            const via = quote.sent_via ?? []
            return (
              <Link
                key={quote.id}
                href={`/angebot/${quote.id}`}
                className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5 shadow-sm active:scale-98 transition-transform"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-black text-[#2C2C2C] truncate">
                      {quote.customer?.name || 'Kein Kunde'}
                    </div>
                    <div className="text-sm text-[#2C2C2C]/50 font-semibold mt-0.5">
                      {formatDate(quote.created_at)}
                    </div>
                    {via.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {via.map((v: string) => (
                          <span key={v} className="text-[10px] font-black bg-[#2C2C2C]/5 text-[#2C2C2C]/50 px-1.5 py-0.5 rounded-full">
                            {VIA_ICON[v] ?? v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="font-black text-[#2C2C2C]">{formatCurrency(quote.total_gross)}</div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <DraftQuotes drafts={drafts.map(d => ({ id: d.id, total_gross: d.total_gross, created_at: d.created_at, customer: d.customer }))} />

      <BottomNav />
    </div>
  )
}
