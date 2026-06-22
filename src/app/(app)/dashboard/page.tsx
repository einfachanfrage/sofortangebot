import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Quote } from '@/lib/types'
import { PwaBannerManager } from '@/components/PwaBannerManager'
import BottomNav from '@/components/BottomNav'
import { MobileQuoteCard } from '@/components/MobileQuoteCard'
import { WelcomeModalWrapper } from '@/components/WelcomeModalWrapper'
import AvatarSheet from '@/components/AvatarSheet'
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

const TIPPS = [
  'Schick Angebote direkt per WhatsApp — Kunden antworten schneller als per E-Mail.',
  'Füge Kundennamen hinzu — macht einen professionelleren Eindruck.',
  'Gültigkeitsdauer auf 14 Tage setzen erhöht die Abschlussrate.',
  'Mehrere Räume? Einfach nacheinander einsprechen.',
  'Kleinmaterial-Pauschale wird automatisch ergänzt.',
  'Preisliste anpassen → KI übernimmt deine Marktpreise.',
  'Angebote mit Foto überzeugen öfter. Kommt bald.',
]

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
function getDynamicSubtitle(offeneCount: number, gesamtCount: number, beauftragtCount: number): string {
  if (offeneCount > 0) return `${offeneCount} Angebot${offeneCount > 1 ? 'e warten' : ' wartet'} auf Antwort.`
  if (gesamtCount === 0) return 'Fang auf der Baustelle an.'
  if (beauftragtCount > 0 && beauftragtCount >= gesamtCount) return 'Stark. Alle Angebote beauftragt.'
  return 'Alles auf dem neuesten Stand.'
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

  // Letzte 3 Angebote
  const { data: recentQuotes } = await supabase
    .from('quotes')
    .select('*, customer:customers(name)')
    .eq('company_id', company?.id)
    .not('status', 'eq', 'archived')
    .order('created_at', { ascending: false })
    .limit(3)

  // Gesamtzahl aller Angebote (für Onboarding-Check)
  const { count: allTimeCount } = await supabase
    .from('quotes')
    .select('id', { count: 'exact', head: true })
    .eq('company_id', company?.id)

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

  // Offene Angebote gesamt (alle Monate)
  const { data: offeneGesamt } = await supabase
    .from('quotes')
    .select('id')
    .eq('company_id', company?.id)
    .in('status', ['sent', 'viewed'])
  const offeneGesamtCount = (offeneGesamt ?? []).length

  // Beauftragte gesamt (für Subtitle)
  const { data: beauftragtGesamt } = await supabase
    .from('quotes')
    .select('id')
    .eq('company_id', company?.id)
    .eq('status', 'accepted')
  const beauftragtGesamtCount = (beauftragtGesamt ?? []).length

  const firstName = company?.name?.split(' ')[0] ?? ''
  const initial = company?.name?.[0]?.toUpperCase() ?? 'A'
  const plan = (company as { plan?: string } | null)?.plan ?? 'starter'
  const greeting = getGreeting()
  const subtitle = getDynamicSubtitle(offeneGesamtCount, allTimeCount ?? 0, beauftragtGesamtCount)
  const istNeuling = (allTimeCount ?? 0) === 0
  const tipp = TIPPS[new Date().getDay() % TIPPS.length]

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
          <div className="font-syne font-black text-[#2C2C2C] text-2xl leading-tight mt-0.5">{firstName || 'Willkommen'}</div>
          <div className="text-[#2C2C2C]/40 text-xs font-semibold mt-0.5">{subtitle}</div>
        </div>
        <AvatarSheet initial={initial} name={firstName || company?.name || ''} plan={plan} />
      </div>

      {/* Stats — kein Label, "—" wenn null */}
      <div className="px-5 mt-5">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
            <TrendingUp size={16} className="text-[#1A7A38] mb-2" strokeWidth={2.5} />
            <div className="font-syne font-black text-[#2C2C2C] text-lg leading-none">
              {monatUmsatz > 0 ? fmt(monatUmsatz) : '—'}
            </div>
            <div className="text-[10px] font-bold text-[#2C2C2C]/40 mt-1">Umsatz</div>
            <div className="text-[9px] text-[#2C2C2C]/25 font-semibold">diesen Monat</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
            <CheckCircle size={16} className="text-[#1A7A38] mb-2" strokeWidth={2.5} />
            <div className="font-syne font-black text-[#2C2C2C] text-lg leading-none">
              {monatBeauftragt > 0 ? monatBeauftragt : '—'}
            </div>
            <div className="text-[10px] font-bold text-[#2C2C2C]/40 mt-1">Aufträge</div>
            <div className="text-[9px] text-[#2C2C2C]/25 font-semibold">diesen Monat</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
            <Clock size={16} className="text-blue-500 mb-2" strokeWidth={2.5} />
            <div className="font-syne font-black text-[#2C2C2C] text-lg leading-none">
              {monatOffen > 0 ? monatOffen : '—'}
            </div>
            <div className="text-[10px] font-bold text-[#2C2C2C]/40 mt-1">Offen</div>
            <div className="text-[9px] text-[#2C2C2C]/25 font-semibold">diesen Monat</div>
          </div>
        </div>
      </div>

      {/* Onboarding-Nudge — nur wenn noch gar kein Angebot */}
      {istNeuling && (
        <div className="px-5 mt-4">
          <div className="bg-[#FFFBEB] border border-[#F5C400]/30 rounded-2xl px-5 py-4">
            <div className="font-black text-[#2C2C2C] text-[15px] mb-1">🎯 Erstelle dein erstes Angebot</div>
            <div className="text-[#2C2C2C]/60 text-[13px] font-semibold leading-relaxed">
              Dauert 2 Minuten. Einfach auf den Button tippen und loslegen.
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-5 mt-4">
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
          <div className="text-[10px] font-black text-[#2C2C2C]/30 uppercase tracking-widest mb-3">
            Zuletzt erstellt
          </div>
          <div className="flex flex-col gap-3">
            {(recentQuotes ?? []).map((quote: Quote & { customer?: { name: string } | null; gewerk?: string }) => {
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

      {/* Empty state */}
      {(recentQuotes ?? []).length === 0 && !istNeuling && (
        <div className="px-5 mt-6">
          <div className="bg-white rounded-2xl border border-[#2C2C2C]/5 p-8 text-center">
            <div className="font-black text-[#2C2C2C] text-base">Keine aktiven Angebote.</div>
            <div className="text-[#2C2C2C]/40 text-sm font-semibold mt-1">Neues Aufmaß starten.</div>
          </div>
        </div>
      )}

      {/* Tipp-Card unten */}
      <div className="px-5 mt-5">
        <div className="bg-white border border-[#2C2C2C]/5 rounded-2xl px-5 py-4">
          <div className="text-[10px] font-black text-[#2C2C2C]/30 uppercase tracking-widest mb-1.5">💡 Tipp</div>
          <div className="text-[#2C2C2C]/60 text-[13px] font-semibold leading-relaxed">{tipp}</div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
