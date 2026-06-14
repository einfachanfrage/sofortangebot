import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import type { Quote } from '@/lib/types'
import PwaBanner from '@/components/PwaBanner'
import BottomNav from '@/components/BottomNav'
import DashboardFilters from '@/components/DashboardFilters'
import DraftQuotes from '@/components/DraftQuotes'
import { MobileQuoteCard } from '@/components/MobileQuoteCard'
import { WelcomeModalWrapper } from '@/components/WelcomeModalWrapper'
import { Mic, ChevronRight } from 'lucide-react'

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  draft:          { label: 'Entwurf',    color: 'bg-[#F7F7F5] text-[#2C2C2C]/50'  },
  in_bearbeitung: { label: 'In Arbeit',  color: 'bg-[#F5C400]/15 text-[#8B7000]'  },
  sent:           { label: 'Offen',      color: 'bg-blue-50 text-blue-700'          },
  accepted:       { label: 'Beauftragt', color: 'bg-[#EDFAF0] text-[#1A7A38]'     },
  rejected:       { label: 'Abgelehnt', color: 'bg-red-50 text-red-600'            },
  archived:       { label: 'Archiviert', color: 'bg-[#F7F7F5] text-[#2C2C2C]/30'  },
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function getGreeting(): { greeting: string; sub: string } {
  const hour = (new Date().getUTCHours() + 1) % 24
  if (hour < 5)  return { greeting: 'Noch wach?',        sub: 'Handwerker schlafen nie.' }
  if (hour < 10) return { greeting: 'Guten Morgen.',     sub: 'Früh am Start — das mag ich.' }
  if (hour < 12) return { greeting: 'Moin.',             sub: 'Noch vor Mittag — stark.' }
  if (hour < 14) return { greeting: 'Guten Mittag.',     sub: 'Kurze Pause, neues Angebot.' }
  if (hour < 17) return { greeting: 'Guten Nachmittag.', sub: 'Die besten Aufträge kommen jetzt.' }
  if (hour < 20) return { greeting: 'Guten Abend.',      sub: 'Feierabend? Nicht für Angebote.' }
  return           { greeting: 'Spät dran?',             sub: 'Das Angebot liegt morgen früh im Postfach.' }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; welcome?: string }>
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

  const { q, status, welcome } = await searchParams

  let query = supabase
    .from('quotes')
    .select('*, customer:customers(name), sent_via')
    .eq('company_id', company?.id)
    .order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)

  const { data: allQuotes } = await query

  const drafts = (allQuotes ?? []).filter(qt => qt.status === 'draft')
  const openSessions = (allQuotes ?? []).filter(qt => qt.status === 'in_bearbeitung')
  const nonDraftQuotes = (allQuotes ?? []).filter(qt => qt.status !== 'draft' && qt.status !== 'in_bearbeitung')

  const quotes = q
    ? nonDraftQuotes.filter(qt => (qt.customer?.name ?? '').toLowerCase().includes(q.toLowerCase()))
    : nonDraftQuotes

  const openCount = nonDraftQuotes.filter(qt => qt.status === 'sent').length
  const acceptedCount = nonDraftQuotes.filter(qt => qt.status === 'accepted').length
  const rejectedCount = nonDraftQuotes.filter(qt => qt.status === 'rejected').length
  const totalCount = nonDraftQuotes.length
  const totalAcceptedValue = nonDraftQuotes
    .filter(qt => qt.status === 'accepted')
    .reduce((sum, qt) => sum + (qt.total_gross ?? 0), 0)

  const { greeting, sub } = getGreeting()

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-28 md:pb-12">
      <PwaBanner />
      {welcome === 'new' && <WelcomeModalWrapper />}
      {welcome === 'pro' && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#2C2C2C] text-white font-extrabold text-sm px-5 py-3 rounded-full shadow-xl flex items-center gap-2 animate-bounce">
          🚀 Pro Plan aktiv — viel Erfolg!
        </div>
      )}

      {/* ── MOBILE HEADER ── */}
      <div className="md:hidden bg-[#2C2C2C] px-5 pt-12 pb-7">
        <div className="font-syne font-black text-white text-2xl leading-tight">{greeting}</div>
        <div className="text-white/40 text-sm font-semibold mt-1">{sub}</div>
      </div>

      {/* ── DESKTOP HEADER ── */}
      <div className="hidden md:flex items-center justify-between px-8 pt-8 pb-0">
        <div>
          <div className="font-syne font-black text-[#2C2C2C] text-2xl leading-tight">{greeting}</div>
          <div className="text-[#2C2C2C]/40 text-sm font-semibold mt-0.5">{sub}</div>
        </div>
        <Link
          href="/angebot/neu"
          className="flex items-center gap-2 bg-[#F5C400] text-[#2C2C2C] font-black text-sm rounded-xl px-5 py-3 hover:bg-[#e6b800] transition-colors"
        >
          <Mic size={16} strokeWidth={2.5} />
          Neues Angebot
        </Link>
      </div>

      {/* ── MOBILE STATS (horizontal scroll pills) ── */}
      <div className="md:hidden flex gap-3 px-5 pt-4 pb-2 overflow-x-auto scrollbar-hide">
        <div className="shrink-0 bg-[#2C2C2C] rounded-2xl px-5 py-4 flex flex-col gap-1 min-w-[130px]">
          <div className="font-syne font-black text-[#F5C400] leading-none" style={{ fontSize: 40 }}>{acceptedCount}</div>
          <div className="text-white/50 text-xs font-semibold">Beauftragt</div>
        </div>
        <div className="shrink-0 bg-white rounded-2xl px-4 py-4 flex flex-col gap-1 min-w-[95px] border border-[#2C2C2C]/5">
          <div className="font-syne font-black text-[#2C2C2C] text-3xl leading-none">{openCount}</div>
          <div className="text-[#2C2C2C]/40 text-xs font-semibold">Offen</div>
        </div>
        <div className="shrink-0 bg-white rounded-2xl px-4 py-4 flex flex-col gap-1 min-w-[95px] border border-[#2C2C2C]/5">
          <div className="font-syne font-black text-[#2C2C2C] text-3xl leading-none">{totalCount}</div>
          <div className="text-[#2C2C2C]/40 text-xs font-semibold">Gesamt</div>
        </div>
        {totalAcceptedValue > 0 && (
          <div className="shrink-0 bg-white rounded-2xl px-4 py-4 flex flex-col gap-1 min-w-[150px] border border-[#2C2C2C]/5">
            <div className="font-syne font-black text-[#2C2C2C] text-lg leading-tight">{formatCurrency(totalAcceptedValue)}</div>
            <div className="text-[#2C2C2C]/40 text-xs font-semibold">Auftragsvolumen</div>
          </div>
        )}
      </div>

      {/* ── DESKTOP STATS (1 big + 3 small) ── */}
      <div className="hidden md:grid grid-cols-4 gap-4 px-8 pt-6">
        <div className="bg-[#2C2C2C] rounded-2xl p-6 flex flex-col justify-between" style={{ minHeight: 148 }}>
          <div className="text-white/30 text-[10px] font-black uppercase tracking-widest">Beauftragt</div>
          <div>
            <div className="font-syne font-black text-[#F5C400] leading-none" style={{ fontSize: 72 }}>{acceptedCount}</div>
            {totalAcceptedValue > 0 && (
              <div className="text-white/25 text-xs font-semibold mt-1">{formatCurrency(totalAcceptedValue)}</div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 flex flex-col justify-between border border-[#2C2C2C]/5">
          <div className="text-[#2C2C2C]/30 text-[10px] font-black uppercase tracking-widest">Offen</div>
          <div className="font-syne font-black text-[#2C2C2C] text-4xl">{openCount}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 flex flex-col justify-between border border-[#2C2C2C]/5">
          <div className="text-[#2C2C2C]/30 text-[10px] font-black uppercase tracking-widest">Abgelehnt</div>
          <div className="font-syne font-black text-[#2C2C2C] text-4xl">{rejectedCount}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 flex flex-col justify-between border border-[#2C2C2C]/5">
          <div className="text-[#2C2C2C]/30 text-[10px] font-black uppercase tracking-widest">Gesamt</div>
          <div className="font-syne font-black text-[#2C2C2C] text-4xl">{totalCount}</div>
        </div>
      </div>

      {/* ── OPEN SESSIONS ── */}
      {openSessions.length > 0 && (
        <div className="px-5 md:px-8 mt-5">
          <div className="text-[10px] font-black text-[#2C2C2C]/30 uppercase tracking-widest mb-2">In Bearbeitung</div>
          <div className="flex flex-col gap-2">
            {openSessions.map((qt: Quote & { customer?: { name: string } | null }) => (
              <Link key={qt.id} href={`/angebot/${qt.id}`}
                className="flex items-center justify-between bg-[#F5C400]/10 border border-[#F5C400]/30 rounded-xl px-4 py-3.5 hover:bg-[#F5C400]/15 transition-colors group">
                <div>
                  <div className="font-black text-[#2C2C2C] text-sm">{qt.customer?.name || 'Ohne Kunde'}</div>
                  <div className="text-xs font-semibold text-[#2C2C2C]/40 mt-0.5">{formatDate(qt.created_at)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-black text-[#2C2C2C] text-sm">{formatCurrency(qt.total_gross)}</div>
                  <ChevronRight size={14} className="text-[#2C2C2C]/30 group-hover:text-[#2C2C2C]/60 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── FILTERS ── */}
      <div className="px-5 md:px-8 mt-6">
        <Suspense>
          <DashboardFilters />
        </Suspense>
      </div>

      {/* ── EMPTY STATE ── */}
      {!quotes?.length && (
        <div className="px-5 md:px-8 mt-4">
          {q || status ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-[#2C2C2C]/5">
              <div className="font-black text-[#2C2C2C]/40">Keine Treffer.</div>
              <div className="text-sm text-[#2C2C2C]/25 font-semibold mt-1">Filter anpassen oder Suche löschen.</div>
            </div>
          ) : (
            <div className="bg-[#2C2C2C] rounded-2xl p-8 md:p-12 text-center">
              <div className="font-syne font-black text-white text-xl md:text-2xl mb-2">
                Dein erster Auftrag wartet.
              </div>
              <div className="text-white/40 text-sm font-medium mb-7 leading-relaxed">
                Sag einfach laut, was du gemacht hast.<br />
                Das Angebot erstellt sich selbst.
              </div>
              <Link
                href="/angebot/neu"
                className="inline-flex items-center gap-2 bg-[#F5C400] text-[#2C2C2C] font-black text-sm px-6 py-3 rounded-xl hover:bg-[#e6b800] transition-colors"
              >
                <Mic size={16} strokeWidth={2.5} />
                Jetzt starten
              </Link>
            </div>
          )}
        </div>
      )}

      {/* ── MOBILE QUOTE CARDS (swipeable) ── */}
      {quotes.length > 0 && (
        <div className="md:hidden px-5 mt-4 flex flex-col gap-3">
          {quotes.map((quote: Quote & { customer?: { name: string } | null }) => {
            const cfg = STATUS_LABEL[quote.status] ?? STATUS_LABEL.draft
            return (
              <MobileQuoteCard
                key={quote.id}
                quote={quote}
                statusLabel={cfg.label}
                statusColor={cfg.color}
                formattedDate={formatDate(quote.created_at)}
                formattedAmount={formatCurrency(quote.total_gross)}
              />
            )
          })}
        </div>
      )}

      {/* ── DESKTOP QUOTE TABLE ── */}
      {quotes.length > 0 && (
        <div className="hidden md:block px-8 mt-4">
          <div className="bg-white rounded-2xl border border-[#2C2C2C]/5 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_100px_130px_130px] px-5 py-3 border-b border-[#2C2C2C]/5">
              {['Kunde', 'Datum', 'Status', 'Betrag'].map((h, i) => (
                <div key={h} className={`text-[10px] font-black text-[#2C2C2C]/30 uppercase tracking-widest ${i === 3 ? 'text-right' : ''}`}>{h}</div>
              ))}
            </div>
            {/* Rows */}
            {quotes.map((quote: Quote & { customer?: { name: string } | null }) => {
              const cfg = STATUS_LABEL[quote.status] ?? STATUS_LABEL.draft
              return (
                <Link
                  key={quote.id}
                  href={`/angebot/${quote.id}`}
                  className="grid grid-cols-[1fr_100px_130px_130px] px-5 py-3.5 border-b border-[#2C2C2C]/5 last:border-0 hover:bg-[#F7F7F5] transition-colors group"
                >
                  <div className="font-black text-[#2C2C2C] text-sm truncate group-hover:text-[#F5C400] transition-colors">
                    {quote.customer?.name || 'Kein Kunde'}
                  </div>
                  <div className="text-sm text-[#2C2C2C]/40 font-semibold self-center">{formatDate(quote.created_at)}</div>
                  <div className="self-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <div className="text-right font-black text-[#2C2C2C] text-sm self-center">{formatCurrency(quote.total_gross)}</div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      <DraftQuotes drafts={drafts.map(d => ({ id: d.id, total_gross: d.total_gross, created_at: d.created_at, customer: d.customer }))} />

      <BottomNav />
    </div>
  )
}
