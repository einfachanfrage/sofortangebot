import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import type { Quote } from '@/lib/types'
import BottomNav from '@/components/BottomNav'
import DashboardFilters from '@/components/DashboardFilters'
import { MobileQuoteCard } from '@/components/MobileQuoteCard'
import { Mic } from 'lucide-react'

const STATUS_FILTER_MAP: Record<string, string[]> = {
  entwurf:    ['draft', 'in_bearbeitung'],
  offen:      ['sent', 'viewed'],
  beauftragt: ['accepted'],
  abgelehnt:  ['rejected'],
  archived:   ['archived'],
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  draft:          { label: 'In Bearbeitung', color: 'bg-[#F5C400]/15 text-[#8B7000]'  },
  in_bearbeitung: { label: 'In Bearbeitung', color: 'bg-[#F5C400]/15 text-[#8B7000]'  },
  sent:           { label: 'Offen',          color: 'bg-blue-50 text-blue-700'          },
  viewed:         { label: 'Geöffnet',       color: 'bg-purple-50 text-purple-700'      },
  accepted:       { label: 'Beauftragt',     color: 'bg-[#EDFAF0] text-[#1A7A38]'     },
  rejected:       { label: 'Abgelehnt',      color: 'bg-red-50 text-red-600'            },
  archived:       { label: 'Archiviert',     color: 'bg-[#F7F7F5] text-[#2C2C2C]/30'  },
}

const GEWERK_BADGE: Record<string, string> = {
  maler:            '🖌 Maler',
  fliesen:          '🔷 Fliesen',
  trockenbau:       '🏗 Trockenbau',
  boden_parkett:    '🪵 Boden',
  sanitaer_heizung: '🔧 Sanitär',
  elektro:          '⚡ Elektro',
}

const EMPTY_STATE_TEXT: Record<string, { title: string; sub: string; showCta?: boolean }> = {
  entwurf:    { title: 'Nichts in Bearbeitung.',     sub: 'Starte ein neues Aufmaß.',                      showCta: true  },
  offen:      { title: 'Keine offenen Angebote.',    sub: 'Schick dein nächstes Angebot raus.',            showCta: false },
  beauftragt: { title: 'Noch kein Auftrag.',         sub: 'Der erste kommt.',                              showCta: false },
  abgelehnt:  { title: 'Kein Angebot abgelehnt.',   sub: 'Gut so. 💪',                                    showCta: false },
  archived:   { title: 'Archiv ist leer.',           sub: 'Abgeschlossene Angebote landen hier.',          showCta: false },
  '':         { title: 'Noch kein Angebot.',         sub: 'Einfach auf der Baustelle einsprechen.',        showCta: true  },
}

function fmt(n: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n)
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export default async function AngebotePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: company } = await supabase
    .from('companies')
    .select('id, name')
    .eq('user_id', user.id)
    .single()

  const { q, status } = await searchParams

  const statusValues = status && STATUS_FILTER_MAP[status] ? STATUS_FILTER_MAP[status] : null

  const { data: allQuotes, error: quotesError } = statusValues
    ? await supabase
        .from('quotes')
        .select('*, customer:customers(name)')
        .eq('company_id', company?.id)
        .in('status', statusValues)
        .order('created_at', { ascending: false })
    : await supabase
        .from('quotes')
        .select('*, customer:customers(name)')
        .eq('company_id', company?.id)
        .order('created_at', { ascending: false })

  if (quotesError) console.error('Angebote query error:', quotesError.message)

  const { data: entwurfData } = await supabase
    .from('quotes').select('id').eq('company_id', company?.id).in('status', ['draft', 'in_bearbeitung'])
  const entwurfCount = (entwurfData ?? []).length

  const { data: archivData } = await supabase
    .from('quotes').select('id').eq('company_id', company?.id).eq('status', 'archived')
  const archivCount = (archivData ?? []).length

  const now = new Date()
  const monatStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const { data: monatQuotes } = await supabase
    .from('quotes').select('status, total_gross')
    .eq('company_id', company?.id)
    .gte('created_at', monatStart)
    .not('status', 'in', '("draft","in_bearbeitung","archived")')
  const monatDaten = monatQuotes ?? []
  const openCount = monatDaten.filter(q => q.status === 'sent' || q.status === 'viewed').length
  const acceptedCount = monatDaten.filter(q => q.status === 'accepted').length
  const rejectedCount = monatDaten.filter(q => q.status === 'rejected').length

  const quotes = allQuotes ?? []
  const filteredQuotes = q
    ? quotes.filter(qt => (qt.customer?.name ?? '').toLowerCase().includes(q.toLowerCase()))
    : quotes

  const currentStatus = status ?? ''
  const emptyText = EMPTY_STATE_TEXT[currentStatus] ?? EMPTY_STATE_TEXT['']

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#F7F7F5] px-5 pt-safe-top pt-4 pb-3 flex items-center justify-between">
        <span className="font-syne font-black text-[#2C2C2C] text-xl">Angebote</span>
        <Link
          href="/angebot/neu"
          className="flex items-center gap-1.5 bg-[#F5C400] text-[#2C2C2C] font-black text-xs rounded-xl px-3.5 py-2"
        >
          <Mic size={13} strokeWidth={2.5} />
          Neu
        </Link>
      </div>

      {/* Filters */}
      <div className="px-5 mt-1">
        <Suspense>
          <DashboardFilters
            entwurfCount={entwurfCount}
            openCount={openCount}
            acceptedCount={acceptedCount}
            rejectedCount={rejectedCount}
            archivCount={archivCount}
          />
        </Suspense>
      </div>

      {/* Empty state — kein Suchbegriff */}
      {filteredQuotes.length === 0 && !q && (
        <div className="px-5 mt-4">
          <div className="bg-white rounded-2xl border border-[#2C2C2C]/5 px-6 py-10 text-center">
            <div className="font-black text-[#1A1A1A] text-[16px]">{emptyText.title}</div>
            <div className="text-[13px] font-semibold mt-1" style={{ color: '#888888' }}>{emptyText.sub}</div>
            {emptyText.showCta && (
              <Link
                href="/angebot/neu"
                className="inline-flex items-center gap-2 bg-[#F5C400] text-[#2C2C2C] font-black text-sm px-5 py-2.5 rounded-xl mt-5"
              >
                <Mic size={14} />
                {status === 'entwurf' ? 'Aufmaß starten' : 'Erstes Aufmaß starten'}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Empty state — Suche ohne Treffer */}
      {filteredQuotes.length === 0 && q && (
        <div className="px-5 mt-4">
          <div className="bg-white rounded-2xl p-8 text-center border border-[#2C2C2C]/5">
            <div className="font-black text-[#1A1A1A] text-[16px]">Kein Treffer.</div>
            <div className="text-[13px] font-semibold mt-1" style={{ color: '#888888' }}>Anderen Suchbegriff versuchen.</div>
          </div>
        </div>
      )}

      {/* Mobile list */}
      {filteredQuotes.length > 0 && (
        <div className="md:hidden px-5 mt-4 flex flex-col gap-3">
          {filteredQuotes.map((quote: Quote & { customer?: { name: string } | null; gewerk?: string }) => {
            const cfg = STATUS_LABEL[quote.status] ?? STATUS_LABEL.draft
            return (
              <MobileQuoteCard
                key={quote.id}
                quote={quote}
                statusLabel={cfg.label}
                statusColor={cfg.color}
                formattedDate={fmtDate(quote.created_at)}
                formattedAmount={fmt(quote.total_gross)}
              />
            )
          })}
        </div>
      )}

      {/* Desktop table */}
      {filteredQuotes.length > 0 && (
        <div className="hidden md:block px-8 mt-4">
          <div className="bg-white rounded-2xl border border-[#2C2C2C]/5 overflow-hidden">
            <div className="grid grid-cols-[1fr_140px_110px_130px_130px] px-5 py-3 border-b border-[#2C2C2C]/5">
              {['Kunde', 'Gewerk', 'Datum', 'Status', 'Betrag'].map((h, i) => (
                <div key={h} className={`text-[10px] font-black text-[#2C2C2C]/30 uppercase tracking-widest ${i === 4 ? 'text-right' : ''}`}>{h}</div>
              ))}
            </div>
            {filteredQuotes.map((quote: Quote & { customer?: { name: string } | null; gewerk?: string }) => {
              const cfg = STATUS_LABEL[quote.status] ?? STATUS_LABEL.draft
              const gewerkBadge = quote.gewerk ? GEWERK_BADGE[quote.gewerk as string] : null
              return (
                <Link
                  key={quote.id}
                  href={`/angebot/${quote.id}`}
                  className="grid grid-cols-[1fr_140px_110px_130px_130px] px-5 py-3.5 border-b border-[#2C2C2C]/5 last:border-0 hover:bg-[#F7F7F5] transition-colors group"
                >
                  <div className="font-black text-[#2C2C2C] text-sm truncate group-hover:text-[#F5C400] transition-colors self-center">
                    {quote.customer?.name || 'Kunde unbekannt'}
                  </div>
                  <div className="self-center">
                    {gewerkBadge
                      ? <span className="text-[11px] font-bold text-[#2C2C2C]/50 bg-[#2C2C2C]/5 px-2 py-0.5 rounded-full">{gewerkBadge}</span>
                      : <span className="text-[#2C2C2C]/20 text-sm">—</span>}
                  </div>
                  <div className="text-sm text-[#2C2C2C]/40 font-semibold self-center">{fmtDate(quote.created_at)}</div>
                  <div className="self-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <div className="text-right font-black text-[#2C2C2C] text-sm self-center">{fmt(quote.total_gross)}</div>
                </Link>
              )
            })}
          </div>
        </div>
      )}


      <BottomNav />
    </div>
  )
}
