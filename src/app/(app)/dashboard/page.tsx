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
import { Mic, Clock, X, FileText, ChevronRight } from 'lucide-react'

// Status-Konfiguration — "Entwurf" und "Auf Baustelle" sind beide "In Bearbeitung"
const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  draft:          { label: 'Entwurf',        color: 'bg-[#F5C400]/15 text-[#8B7000]'  },
  in_bearbeitung: { label: 'Entwurf',        color: 'bg-[#F5C400]/15 text-[#8B7000]'  },
  sent:           { label: 'Offen',          color: 'bg-blue-50 text-blue-700'          },
  viewed:         { label: 'Geöffnet',       color: 'bg-purple-50 text-purple-700'      },
  accepted:       { label: 'Beauftragt',     color: 'bg-[#EDFAF0] text-[#1A7A38]'     },
  rejected:       { label: 'Abgelehnt',      color: 'bg-red-50 text-red-600'            },
  archived:       { label: 'Archiviert',     color: 'bg-[#F7F7F5] text-[#2C2C2C]/30'  },
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function getGreeting(stats: {
  totalCount: number
  openCount: number
  heuteErstellt: boolean
}): { greeting: string; sub: string } {
  const now = new Date()
  const hour = (now.getUTCHours() + 1) % 24
  const dayOfWeek = now.getDay() // 0=So, 1=Mo

  let greeting = 'Hallo.'
  if (hour < 5)  greeting = 'Noch wach?'
  else if (hour < 10) greeting = 'Guten Morgen.'
  else if (hour < 12) greeting = 'Moin.'
  else if (hour < 14) greeting = 'Guten Mittag.'
  else if (hour < 17) greeting = 'Guten Nachmittag.'
  else if (hour < 20) greeting = 'Guten Abend.'
  else greeting = 'Spät dran?'

  let sub: string
  if (dayOfWeek === 1 && hour >= 7 && hour < 11) {
    sub = 'Gute Woche. Was steht heute an?'
  } else if (stats.heuteErstellt) {
    sub = 'Gut gemacht. Noch mehr geht immer.'
  } else if (stats.totalCount === 0) {
    sub = 'Fang auf der Baustelle an — 2 Minuten, fertig.'
  } else if (stats.openCount > 0) {
    sub = `${stats.openCount} ${stats.openCount === 1 ? 'Angebot wartet' : 'Angebote warten'} auf Antwort.`
  } else {
    sub = 'Alle Angebote auf dem neuesten Stand.'
  }

  return { greeting, sub }
}

// Gewerk-Emoji-Mapping
const GEWERK_BADGE: Record<string, string> = {
  maler: '🖌 Maler',
  fliesen: '🔷 Fliesen',
  trockenbau: '🏗 Trockenbau',
  boden_parkett: '🪵 Boden',
  sanitaer_heizung: '🔧 Sanitär',
  elektro: '⚡ Elektro',
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

  // Alle Angebote laden (ohne Archivierte im Standard)
  let query = supabase
    .from('quotes')
    .select('*, customer:customers(name), gewerk, sent_via')
    .eq('company_id', company?.id)
    .order('created_at', { ascending: false })

  if (status) {
    if (status === 'in_bearbeitung') {
      // "In Bearbeitung" = draft + in_bearbeitung
      query = query.in('status', ['draft', 'in_bearbeitung'])
    } else {
      query = query.eq('status', status)
    }
  } else {
    // Standard: keine archivierten
    query = query.not('status', 'eq', 'archived')
  }

  const { data: allQuotes } = await query

  // Monatsbezogene Stats (immer unabhängig vom Filter)
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

  // In-Bearbeitung-Zähler (für Tab-Badge)
  const { data: inBearbeitungData } = await supabase
    .from('quotes')
    .select('id')
    .eq('company_id', company?.id)
    .in('status', ['draft', 'in_bearbeitung'])
  const inBearbeitungCount = (inBearbeitungData ?? []).length

  const quotes = allQuotes ?? []
  const filteredQuotes = q
    ? quotes.filter(qt => (qt.customer?.name ?? '').toLowerCase().includes(q.toLowerCase()))
    : quotes

  const { greeting, sub } = getGreeting({ totalCount, openCount, heuteErstellt })

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

      {/* ── MOBILE STATS (horizontal scroll) ── */}
      <div className="md:hidden flex gap-3 px-5 pt-4 pb-2 overflow-x-auto scrollbar-hide">
        <div className="shrink-0 bg-[#2C2C2C] rounded-2xl px-5 py-4 flex flex-col gap-1 min-w-[130px]">
          <div className="text-[#F5C400]/60 text-[10px] font-black uppercase tracking-widest">Beauftragt</div>
          <div className="font-syne font-black text-[#F5C400] leading-none" style={{ fontSize: 40 }}>{acceptedCount}</div>
          <div className="text-white/25 text-xs font-semibold">diesen Monat</div>
        </div>
        <div className="shrink-0 bg-white rounded-2xl px-4 py-4 flex flex-col gap-1 min-w-[95px] border border-[#2C2C2C]/5">
          <div className="text-[#2C2C2C]/30 text-[10px] font-black uppercase tracking-widest">Offen</div>
          <div className="font-syne font-black text-[#2C2C2C] text-3xl leading-none">{openCount}</div>
          <div className="text-[#2C2C2C]/30 text-xs font-semibold">Antwort</div>
        </div>
        <div className="shrink-0 bg-white rounded-2xl px-4 py-4 flex flex-col gap-1 min-w-[95px] border border-[#2C2C2C]/5">
          <div className="text-[#2C2C2C]/30 text-[10px] font-black uppercase tracking-widest">Gesamt</div>
          <div className="font-syne font-black text-[#2C2C2C] text-3xl leading-none">{totalCount}</div>
          <div className="text-[#2C2C2C]/30 text-xs font-semibold">Monat</div>
        </div>
        {totalAcceptedValue > 0 && (
          <div className="shrink-0 bg-white rounded-2xl px-4 py-4 flex flex-col gap-1 min-w-[150px] border border-[#2C2C2C]/5">
            <div className="text-[#2C2C2C]/30 text-[10px] font-black uppercase tracking-widest">Volumen</div>
            <div className="font-syne font-black text-[#2C2C2C] text-lg leading-tight">{formatCurrency(totalAcceptedValue)}</div>
            <div className="text-[#2C2C2C]/30 text-xs font-semibold">Auftragsvolumen</div>
          </div>
        )}
      </div>

      {/* ── DESKTOP STATS ── */}
      <div className="hidden md:block px-8 pt-6">
        <div className="grid gap-4" style={{ gridTemplateColumns: '55% 1fr 1fr 1fr' }}>
          {/* Große Beauftragt-Card */}
          <div className="bg-[#2C2C2C] rounded-2xl p-6 flex flex-col justify-between" style={{ minHeight: 156 }}>
            <div className="text-[#F5C400] text-[11px] font-black uppercase tracking-widest">Beauftragt</div>
            <div>
              <div className="font-syne font-black text-[#F5C400] leading-none" style={{ fontSize: 72 }}>{acceptedCount}</div>
              <div className="text-white/30 text-xs font-semibold mt-1">diesen Monat</div>
              {totalAcceptedValue > 0 && (
                <div className="text-white/20 text-xs font-semibold mt-0.5">{formatCurrency(totalAcceptedValue)} Auftragsvolumen</div>
              )}
            </div>
          </div>

          {/* Offen */}
          <div className="bg-white rounded-2xl p-5 flex flex-col justify-between border border-[#2C2C2C]/5">
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-[#2C2C2C]/25" />
              <div className="text-[#2C2C2C]/30 text-[10px] font-black uppercase tracking-widest">Offen</div>
            </div>
            <div>
              <div className="font-syne font-black text-[#2C2C2C] text-4xl leading-none">{openCount}</div>
              <div className="text-[#2C2C2C]/25 text-xs font-semibold mt-1">warten auf Antwort</div>
            </div>
          </div>

          {/* Abgelehnt */}
          <div className="bg-white rounded-2xl p-5 flex flex-col justify-between border border-[#2C2C2C]/5">
            <div className="flex items-center gap-1.5">
              <X size={13} className="text-[#2C2C2C]/25" />
              <div className="text-[#2C2C2C]/30 text-[10px] font-black uppercase tracking-widest">Abgelehnt</div>
            </div>
            <div className="font-syne font-black text-[#2C2C2C] text-4xl leading-none">{rejectedCount}</div>
          </div>

          {/* Gesamt */}
          <div className="bg-white rounded-2xl p-5 flex flex-col justify-between border border-[#2C2C2C]/5">
            <div className="flex items-center gap-1.5">
              <FileText size={13} className="text-[#2C2C2C]/25" />
              <div className="text-[#2C2C2C]/30 text-[10px] font-black uppercase tracking-widest">Gesamt</div>
            </div>
            <div>
              <div className="font-syne font-black text-[#2C2C2C] text-4xl leading-none">{totalCount}</div>
              <div className="text-[#2C2C2C]/25 text-xs font-semibold mt-1">diesen Monat</div>
            </div>
          </div>
        </div>

        {/* Gesamtübersicht-Link */}
        <div className="mt-2.5 text-right">
          <Link href="/dashboard?alle=1" className="text-[#2C2C2C]/30 text-xs font-semibold hover:text-[#2C2C2C]/60 transition-colors">
            Gesamtübersicht anzeigen →
          </Link>
        </div>
      </div>

      {/* ── FILTERS + TABS ── */}
      <div className="px-5 md:px-8 mt-6">
        <Suspense>
          <DashboardFilters inBearbeitungCount={inBearbeitungCount} />
        </Suspense>
      </div>

      {/* ── EMPTY STATE ── */}
      {!filteredQuotes.length && (
        <div className="px-5 md:px-8 mt-4">
          {q || status ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-[#2C2C2C]/5">
              <div className="font-black text-[#2C2C2C]/40">Keine Treffer.</div>
              <div className="text-sm text-[#2C2C2C]/25 font-semibold mt-1">Filter anpassen oder Suche löschen.</div>
            </div>
          ) : (
            <div className="bg-white border border-dashed border-[#DDDDDD] rounded-xl px-6 py-12 flex flex-col items-center text-center">
              <div style={{ fontSize: 56 }} className="leading-none mb-5">🎙</div>
              <div className="font-syne font-extrabold text-[#2C2C2C] mb-2" style={{ fontSize: 22 }}>
                Dein erstes Angebot wartet.
              </div>
              <div className="text-[#888888] mb-7 leading-relaxed" style={{ fontSize: 15 }}>
                Sag einfach laut, was du gemacht hast.<br />Das Angebot erstellt sich selbst.
              </div>
              <Link
                href="/angebot/neu"
                className="inline-flex items-center gap-2 bg-[#F5C400] text-[#2C2C2C] font-black text-sm px-6 py-3 rounded-xl hover:bg-[#e6b800] transition-colors"
              >
                🎙 Jetzt starten
              </Link>
            </div>
          )}
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
