import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Quote } from '@/lib/types'
import { PwaBannerManager } from '@/components/PwaBannerManager'
import BottomNav from '@/components/BottomNav'
import { MobileQuoteCard } from '@/components/MobileQuoteCard'
import { WelcomeModalWrapper } from '@/components/WelcomeModalWrapper'
import { Mic, ArrowRight, TrendingUp, Clock, CheckCircle } from 'lucide-react'

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  draft:          { label: 'In Bearbeitung', color: 'bg-[#F5C400]/15 text-[#8B7000]'  },
  in_bearbeitung: { label: 'In Bearbeitung', color: 'bg-[#F5C400]/15 text-[#8B7000]'  },
  sent:           { label: 'Offen',          color: 'bg-blue-50 text-blue-700'          },
  viewed:         { label: 'Geöffnet',       color: 'bg-purple-50 text-purple-700'      },
  accepted:       { label: 'Beauftragt',     color: 'bg-[#EDFAF0] text-[#1A7A38]'     },
  rejected:       { label: 'Abgelehnt',      color: 'bg-red-50 text-red-600'            },
  archived:       { label: 'Archiviert',     color: 'bg-[#F7F7F5] text-[#2C2C2C]/30'  },
}

function fmt(n: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Guten Morgen.'
  if (h < 17) return 'Guten Tag.'
  if (h < 21) return 'Guten Abend.'
  return 'Noch am Arbeiten?'
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>
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

  const { welcome } = await searchParams

  // Letzte 3 Angebote (nicht archiviert)
  const { data: recentQuotes } = await supabase
    .from('quotes')
    .select('*, customer:customers(name)')
    .eq('company_id', company?.id)
    .not('status', 'eq', 'archived')
    .order('created_at', { ascending: false })
    .limit(3)

  // Monatsstats
  const now = new Date()
  const monatStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const { data: monatQuotes } = await supabase
    .from('quotes')
    .select('status, total_gross')
    .eq('company_id', company?.id)
    .gte('created_at', monatStart)
    .not('status', 'in', '("draft","in_bearbeitung","archived")')

  const monat = monatQuotes ?? []
  const monatUmsatz = monat.filter(q => q.status === 'accepted').reduce((s, q) => s + (q.total_gross ?? 0), 0)
  const monatOffen = monat.filter(q => q.status === 'sent' || q.status === 'viewed').length
  const monatBeauftragt = monat.filter(q => q.status === 'accepted').length

  // Gesamtanzahl laufende Angebote
  const { data: offeneGesamt } = await supabase
    .from('quotes')
    .select('id')
    .eq('company_id', company?.id)
    .in('status', ['sent', 'viewed'])
  const offeneGesamtCount = (offeneGesamt ?? []).length

  const firstName = company?.name?.split(' ')[0] ?? ''
  const greeting = getGreeting()

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-28">
      <PwaBannerManager />
      {welcome === 'new' && <WelcomeModalWrapper />}
      {welcome === 'pro' && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#2C2C2C] text-white font-extrabold text-sm px-5 py-3 rounded-full shadow-xl flex items-center gap-2 animate-bounce">
          🚀 Pro Plan aktiv — viel Erfolg!
        </div>
      )}

      {/* Header */}
      <div className="px-5 pt-safe-top pt-6 pb-2 flex items-start justify-between">
        <div>
          <div className="text-[#2C2C2C]/40 text-sm font-semibold">{greeting}</div>
          <div className="font-syne font-black text-[#2C2C2C] text-2xl leading-tight mt-0.5">
            {firstName || 'Willkommen'}
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#2C2C2C] flex items-center justify-center mt-1">
          <span className="text-white font-black text-sm">{company?.name?.[0]?.toUpperCase() ?? 'A'}</span>
        </div>
      </div>

      {/* Monatsstats */}
      <div className="px-5 mt-5">
        <div className="text-[10px] font-black text-[#2C2C2C]/30 uppercase tracking-widest mb-2">
          Dieser Monat
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
            <TrendingUp size={16} className="text-[#1A7A38] mb-2" strokeWidth={2.5} />
            <div className="font-syne font-black text-[#2C2C2C] text-lg leading-none">{fmt(monatUmsatz)}</div>
            <div className="text-[10px] font-bold text-[#2C2C2C]/40 mt-1">Umsatz</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
            <CheckCircle size={16} className="text-[#1A7A38] mb-2" strokeWidth={2.5} />
            <div className="font-syne font-black text-[#2C2C2C] text-lg leading-none">{monatBeauftragt}</div>
            <div className="text-[10px] font-bold text-[#2C2C2C]/40 mt-1">Aufträge</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
            <Clock size={16} className="text-blue-500 mb-2" strokeWidth={2.5} />
            <div className="font-syne font-black text-[#2C2C2C] text-lg leading-none">{monatOffen}</div>
            <div className="text-[10px] font-bold text-[#2C2C2C]/40 mt-1">Offen</div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 mt-5">
        <Link
          href="/angebot/neu"
          className="flex items-center justify-between w-full bg-[#2C2C2C] text-white rounded-2xl px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5C400] flex items-center justify-center">
              <Mic size={20} className="text-[#2C2C2C]" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-black text-[15px]">Aufmaß starten</div>
              <div className="text-white/50 text-[12px] font-semibold">Einsprechen → Angebot fertig</div>
            </div>
          </div>
          <ArrowRight size={18} className="text-white/40" />
        </Link>
      </div>

      {/* Offene Angebote Hinweis */}
      {offeneGesamtCount > 0 && (
        <div className="px-5 mt-3">
          <Link
            href="/angebote?status=offen"
            className="flex items-center justify-between w-full bg-blue-50 rounded-2xl px-5 py-3.5"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="font-black text-blue-700 text-sm">
                {offeneGesamtCount} {offeneGesamtCount === 1 ? 'Angebot wartet' : 'Angebote warten'} auf Antwort
              </span>
            </div>
            <ArrowRight size={15} className="text-blue-400" />
          </Link>
        </div>
      )}

      {/* Letzte Angebote */}
      {(recentQuotes ?? []).length > 0 && (
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-black text-[#2C2C2C]/30 uppercase tracking-widest">
              Zuletzt erstellt
            </div>
            <Link href="/angebote" className="text-[#2C2C2C]/40 text-xs font-bold flex items-center gap-1">
              Alle <ArrowRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {(recentQuotes ?? []).map((quote: Quote & { customer?: { name: string } | null }) => {
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
        </div>
      )}

      {/* Empty state — noch gar keine Angebote */}
      {(recentQuotes ?? []).length === 0 && (
        <div className="px-5 mt-6">
          <div className="bg-white rounded-2xl border border-[#2C2C2C]/5 p-8 text-center">
            <div className="font-black text-[#2C2C2C] text-base">Noch kein Angebot.</div>
            <div className="text-[#2C2C2C]/40 text-sm font-semibold mt-1">Fang auf der Baustelle an.</div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
