import Link from 'next/link'
import { Suspense } from 'react'
import BottomNav from '@/components/BottomNav'
import DashboardFilters from '@/components/DashboardFilters'
import { MobileQuoteCard } from '@/components/MobileQuoteCard'
import { Mic } from 'lucide-react'
import { getQuotesOverview } from '@/data/quotes'
import { getStatusInfo } from '@/lib/status'

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
  const { q, status } = await searchParams
  const { quotes, counts } = await getQuotesOverview(status)
  const entwurfCount = counts.drafts
  const archivCount = counts.archive
  const openCount = counts.open
  const acceptedCount = counts.accepted
  const rejectedCount = counts.rejected
  const filteredQuotes = q
    ? quotes.filter(qt => (qt.customer?.name ?? '').toLowerCase().includes(q.toLowerCase()))
    : quotes

  const currentStatus = status ?? ''
  const emptyText = EMPTY_STATE_TEXT[currentStatus] ?? EMPTY_STATE_TEXT['']

  return (
    <div className="min-h-dvh bg-bg pb-28">
      <div className="md:max-w-5xl md:mx-auto">
      {/* Header */}
      <div className="bg-anthracite md:bg-transparent px-5 md:px-8 pt-12 md:pt-8 pb-6 flex items-start justify-between">
        <div className="font-syne font-black text-2xl text-white md:text-anthracite">Angebote</div>
        <Link
          href="/angebot/neu"
          className="flex items-center gap-1.5 bg-yellow text-anthracite font-black text-sm rounded-xl px-4 py-2 mt-1"
        >
          <Mic size={14} strokeWidth={2.5} />
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
          <div className="bg-white rounded-2xl border border-anthracite/5 px-6 py-10 text-center">
            <div className="font-black text-anthracite text-[16px]">{emptyText.title}</div>
            <div className="text-[13px] font-semibold mt-1 text-anthracite/50">{emptyText.sub}</div>
            {emptyText.showCta && (
              <Link
                href="/angebot/neu"
                className="inline-flex items-center gap-2 bg-yellow text-anthracite font-black text-sm px-5 py-2.5 rounded-xl mt-5"
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
          <div className="bg-white rounded-2xl p-8 text-center border border-anthracite/5">
            <div className="font-black text-anthracite text-[16px]">Kein Treffer.</div>
            <div className="text-[13px] font-semibold mt-1 text-anthracite/50">Anderen Suchbegriff versuchen.</div>
          </div>
        </div>
      )}

      {/* Mobile list */}
      {filteredQuotes.length > 0 && (
        <div className="md:hidden px-5 mt-4 flex flex-col gap-3">
          {filteredQuotes.map(quote => {
            const items = (quote.quote_items ?? []).sort((a, b) => a.position - b.position)
            return (
              <MobileQuoteCard
                key={quote.id}
                quote={quote}
                formattedDate={fmtDate(quote.created_at)}
                formattedAmount={fmt(quote.total_gross)}
                ersterItemTitel={items[0]?.title ?? null}
              />
            )
          })}
        </div>
      )}

      {/* Desktop table */}
      {filteredQuotes.length > 0 && (
        <div className="hidden md:block px-8 mt-4">
          <div className="bg-white rounded-2xl border border-anthracite/5 overflow-hidden">
            <div className="grid grid-cols-[1fr_140px_110px_130px_130px] px-5 py-3 border-b border-anthracite/5">
              {['Kunde', 'Gewerk', 'Datum', 'Status', 'Betrag'].map((h, i) => (
                <div key={h} className={`text-[10px] font-black text-anthracite/30 uppercase tracking-widest ${i === 4 ? 'text-right' : ''}`}>{h}</div>
              ))}
            </div>
            {filteredQuotes.map(quote => {
              const cfg = getStatusInfo(quote.status)
              const gewerkBadge = quote.gewerk ? GEWERK_BADGE[quote.gewerk as string] : null
              return (
                <Link
                  key={quote.id}
                  href={`/angebot/${quote.id}`}
                  className="grid grid-cols-[1fr_140px_110px_130px_130px] px-5 py-3.5 border-b border-anthracite/5 last:border-0 hover:bg-bg transition-colors group"
                >
                  <div className="font-black text-anthracite text-sm truncate group-hover:text-yellow transition-colors self-center">
                    {quote.customer?.name || 'Kunde unbekannt'}
                  </div>
                  <div className="self-center">
                    {gewerkBadge
                      ? <span className="text-[11px] font-bold text-anthracite/50 bg-anthracite/5 px-2 py-0.5 rounded-full">{gewerkBadge}</span>
                      : <span className="text-anthracite/20 text-sm">—</span>}
                  </div>
                  <div className="text-sm text-anthracite/40 font-semibold self-center">{fmtDate(quote.created_at)}</div>
                  <div className="self-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>{cfg.label}</span>
                  </div>
                  <div className="text-right font-black text-anthracite text-sm self-center">{fmt(quote.total_gross)}</div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
      </div>

      <BottomNav />
    </div>
  )
}
