import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import type { Quote } from '@/lib/types'
import { PwaBannerManager } from '@/components/PwaBannerManager'
import BottomNav from '@/components/BottomNav'
import DashboardFilters from '@/components/DashboardFilters'
import { MobileQuoteCard } from '@/components/MobileQuoteCard'
import { WelcomeModalWrapper } from '@/components/WelcomeModalWrapper'
import { Mic } from 'lucide-react'

// Status-Filter-Mapping
const STATUS_FILTER_MAP: Record<string, string[]> = {
  entwurf:    ['draft', 'in_bearbeitung'],
  offen:      ['sent', 'viewed'],
  beauftragt: ['accepted'],
  abgelehnt:  ['rejected'],
  archived:   ['archived'],
}

// Status-Konfiguration
const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  draft:          { label: 'In Bearbeitung', color: 'bg-[#F5C400]/15 text-[#8B7000]'  },
  in_bearbeitung: { label: 'In Bearbeitung', color: 'bg-[#F5C400]/15 text-[#8B7000]'  },
  sent:           { label: 'Offen',          color: 'bg-blue-50 text-blue-700'          },
  viewed:         { label: 'Geöffnet',       color: 'bg-purple-50 text-purple-700'      },
  accepted:       { label: 'Beauftragt',     color: 'bg-[#EDFAF0] text-[#1A7A38]'     },
  rejected:       { label: 'Abgelehnt',      color: 'bg-red-50 text-red-600'            },
  archived:       { label: 'Archiviert',     color: 'bg-[#F7F7F5] text-[#2C2C2C]/30'  },
}

// Gewerk-Emoji-Mapping
const GEWERK_BADGE: Record<string, string> = {
  maler:            '🖌 Maler',
  fliesen:          '🔷 Fliesen',
  trockenbau:       '🏗 Trockenbau',
  boden_parkett:    '🪵 Boden',
  sanitaer_heizung: '🔧 Sanitär',
  elektro:          '⚡ Elektro',
}

// Empty-State-Texte
const EMPTY_STATE_TEXT: Record<string, { title: string; sub: string }> = {
  entwurf:    { title: 'Keine Entwürfe.',          sub: 'Neue Aufnahme starten.' },
  offen:      { title: 'Keine offenen Angebote.',  sub: 'Alle Angebote haben eine Antwort.' },
  beauftragt: { title: 'Noch kein Auftrag.',       sub: 'Offen lassen, Angebote überzeugen.' },
  abgelehnt:  { title: 'Kein Angebot abgelehnt.',  sub: 'Gut so.' },
  '':         { title: 'Noch kein Angebot.',       sub: 'Fang auf der Baustelle an.' },
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Guten Morgen.'
  if (h < 17) return 'Guten Tag.'
  if (h < 21) return 'Guten Abend.'
  return 'Noch am Arbeiten?'
}

function getSubText(stats: { totalCount: number; openCount: number; heuteErstellt: boolean }): string {
  if (stats.totalCount === 0) return 'Fang auf der Baustelle an — 2 Minuten, fertig.'
  if (stats.heuteErstellt) return 'Gut gemacht. Noch mehr geht immer.'
  if (stats.openCount > 0) return `${stats.openCount} ${stats.openCount === 1 ? 'Angebot wartet' : 'Angebote warten'} auf Antwort.`
  return 'Alle Angebote auf dem neuesten Stand.'
}

interface StatItemProps {
  label: string
  value: number
  sub?: string | null
  filterKey: string
  currentFilter: string
}

function StatItem({ label, value, sub, filterKey, currentFilter }: StatItemProps) {
  const isActive = currentFilter === filterKey
  return (
    <Link
      href={`/dashboard${filterKey ? `?status=${filterKey}` : ''}`}
      className={`flex flex-col gap-0.5 hover:opacity-70 transition-opacity ${isActive ? 'opacity-100' : 'opacity-60'}`}
    >
      <div className="font-syne font-black text-[#2C2C2C] text-2xl leading-none">{value}</div>
      <div className="text-[10px] font-black text-[#2C2C2C]/40 uppercase tracking-widest">{label}</div>
      {sub && <div className="text-xs text-[#2C2C2C]/30 font-semibold">{sub}</div>}
    </Link>
  )
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

  // Angebote laden (mit Status-Filter)
  let query = supabase
    .from('quotes')
    .select('*, customer:customers(name), gewerk, sent_via')
    .eq('company_id', company?.id)
    .order('created_at', { ascending: false })

  if (status && STATUS_FILTER_MAP[status]) {
    query = query.in('status', STATUS_FILTER_MAP[status])
  } else if (!status) {
    query = query.not('status', 'eq', 'archived')
  }

  const { data: allQuotes, error: quotesError } = await query

  if (quotesError) {
    console.error('Dashboard quotes error:', JSON.stringify(quotesError))
  }
  console.log('Dashboard debug — company_id:', company?.id, '| quotes count:', allQuotes?.length ?? 0, '| error:', quotesError?.message)

  // Monatsbezogene Stats (unabhängig vom Filter)
  const now = new Date()
  const monatStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const { data: monatQuotes } = await supabase
    .from('quotes')
    .select('status, total_gross, created_at')
    .eq('company_id', company?.id)
    .gte('created_at', monatStart)
    .not('status', 'in', '("draft","in_bearbeitung","archived")')

  const monatDaten = monatQuotes ?? []
  const acceptedCount = monatDaten.filter(q => q.status === 'accepted').length
  const openCount = monatDaten.filter(q => q.status === 'sent' || q.status === 'viewed').length
  const rejectedCount = monatDaten.filter(q => q.status === 'rejected').length
  const totalCount = monatDaten.length
  const totalAcceptedValue = monatDaten
    .filter(q => q.status === 'accepted')
    .reduce((sum, q) => sum + (q.total_gross ?? 0), 0)

  // Heute erstellte Angebote
  const heute = new Date()
  heute.setHours(0, 0, 0, 0)
  const heuteErstellt = monatDaten.some(q => new Date(q.created_at) >= heute)

  // In-Bearbeitung-Zähler
  const { data: entwurfData } = await supabase
    .from('quotes')
    .select('id')
    .eq('company_id', company?.id)
    .in('status', ['draft', 'in_bearbeitung'])
  const entwurfCount = (entwurfData ?? []).length

  const quotes = allQuotes ?? []
  const filteredQuotes = q
    ? quotes.filter(qt => (qt.customer?.name ?? '').toLowerCase().includes(q.toLowerCase()))
    : quotes

  const greeting = getGreeting()
  const sub = getSubText({ totalCount, openCount, heuteErstellt })

  const currentStatus = status ?? ''
  const emptyText = EMPTY_STATE_TEXT[currentStatus] ?? EMPTY_STATE_TEXT['']

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-28 md:pb-12">
      <PwaBannerManager />
      {welcome === 'new' && <WelcomeModalWrapper />}
      {welcome === 'pro' && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#2C2C2C] text-white font-extrabold text-sm px-5 py-3 rounded-full shadow-xl flex items-center gap-2 animate-bounce">
          🚀 Pro Plan aktiv — viel Erfolg!
        </div>
      )}

      {/* ── MOBILE HEADER ── */}
      <div className="md:hidden sticky top-0 z-20 bg-[#F7F7F5] px-5 pt-safe-top pt-4 pb-3 flex items-center justify-between">
        <span className="font-syne font-black text-[#2C2C2C] text-lg">sofortangebot</span>
        <div className="w-8 h-8 rounded-full bg-[#2C2C2C] flex items-center justify-center">
          <span className="text-white font-black text-xs">{company?.name?.[0]?.toUpperCase() ?? 'A'}</span>
        </div>
      </div>

      {/* ── MOBILE BEGRÜSSUNG ── */}
      <div className="md:hidden px-5 pt-2 pb-4">
        <div className="font-syne font-black text-[#2C2C2C] text-2xl">{greeting}</div>
        <div className="text-[#2C2C2C]/40 text-sm font-semibold mt-0.5">{sub}</div>
      </div>

      {/* ── DESKTOP HEADER ── */}
      <div className="hidden md:flex items-center justify-between px-8 pt-8 pb-6">
        <div>
          <div className="font-syne font-black text-[#2C2C2C] text-2xl">{greeting}</div>
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

      {/* ── DESKTOP STATS ── */}
      <div className="hidden md:block px-8 mb-6">
        <div className="bg-white rounded-2xl border border-[#2C2C2C]/5 px-6 py-4 flex items-center gap-8">
          <StatItem label="Beauftragt" value={acceptedCount} sub={totalAcceptedValue > 0 ? formatCurrency(totalAcceptedValue) : null} filterKey="beauftragt" currentFilter={currentStatus} />
          <div className="w-px h-8 bg-[#2C2C2C]/8" />
          <StatItem label="Offen" value={openCount} filterKey="offen" currentFilter={currentStatus} />
          <div className="w-px h-8 bg-[#2C2C2C]/8" />
          <StatItem label="In Bearbeitung" value={entwurfCount} filterKey="entwurf" currentFilter={currentStatus} />
          <div className="w-px h-8 bg-[#2C2C2C]/8" />
          <StatItem label="Gesamt" value={totalCount} filterKey="" currentFilter={currentStatus} />
        </div>
      </div>

      {/* ── FILTERS + TABS ── */}
      <div className="px-5 md:px-8 mt-2 md:mt-0">
        <Suspense>
          <DashboardFilters
            entwurfCount={entwurfCount}
            openCount={openCount}
            acceptedCount={acceptedCount}
            rejectedCount={rejectedCount}
          />
        </Suspense>
      </div>

      {/* ── EMPTY STATE ── */}
      {filteredQuotes.length === 0 && !q && (
        <div className="px-5 md:px-8 mt-4">
          <div className="bg-white rounded-2xl border border-[#2C2C2C]/5 p-10 text-center">
            <div className="font-black text-[#2C2C2C] text-lg">{emptyText.title}</div>
            <div className="text-[#2C2C2C]/40 text-sm font-semibold mt-1">{emptyText.sub}</div>
            {(!status || status === 'entwurf') && (
              <Link
                href="/angebot/neu"
                className="inline-flex items-center gap-2 bg-[#F5C400] text-[#2C2C2C] font-black text-sm px-5 py-2.5 rounded-xl mt-4 hover:bg-[#e6b800] transition-colors"
              >
                <Mic size={14} /> Jetzt starten
              </Link>
            )}
          </div>
        </div>
      )}

      {filteredQuotes.length === 0 && q && (
        <div className="px-5 md:px-8 mt-4">
          <div className="bg-white rounded-2xl p-8 text-center border border-[#2C2C2C]/5">
            <div className="font-black text-[#2C2C2C]/40">Keine Treffer.</div>
            <div className="text-sm text-[#2C2C2C]/25 font-semibold mt-1">Filter anpassen oder Suche löschen.</div>
          </div>
        </div>
      )}

      {/* ── MOBILE QUOTE CARDS ── */}
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
                formattedDate={formatDate(quote.created_at)}
                formattedAmount={formatCurrency(quote.total_gross)}
              />
            )
          })}
        </div>
      )}

      {/* ── DESKTOP QUOTE TABLE ── */}
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
              const gewerkBadge = quote.gewerk ? GEWERK_BADGE[quote.gewerk] : null
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
                    {gewerkBadge ? (
                      <span className="text-[11px] font-bold text-[#2C2C2C]/50 bg-[#2C2C2C]/5 px-2 py-0.5 rounded-full">
                        {gewerkBadge}
                      </span>
                    ) : (
                      <span className="text-[#2C2C2C]/20 text-sm">—</span>
                    )}
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

      {/* Archivierte Angebote — versteckter Link */}
      <div className="px-5 md:px-8 mt-4 text-center">
        <Link href="/dashboard?status=archived" className="text-[#2C2C2C]/25 text-xs font-semibold hover:text-[#2C2C2C]/50 transition-colors">
          Archivierte Angebote anzeigen
        </Link>
      </div>

      <BottomNav />
    </div>
  )
}
