import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Quote } from '@/lib/types'
import { PwaBannerManager } from '@/components/PwaBannerManager'
import BottomNav from '@/components/BottomNav'
import { MobileQuoteCard } from '@/components/MobileQuoteCard'
import { WelcomeModalWrapper } from '@/components/WelcomeModalWrapper'
import AvatarSheet from '@/components/AvatarSheet'
import { Mic } from 'lucide-react'

const STATUS_LABEL: Record<string, { label: string }> = {
  draft:          { label: 'Entwurf'        },
  in_bearbeitung: { label: 'Entwurf'        },
  bereit:         { label: 'Fertiggestellt' },
  sent:           { label: 'Offen'          },
  viewed:         { label: 'Geöffnet'       },
  accepted:       { label: 'Beauftragt'     },
  rejected:       { label: 'Abgelehnt'      },
  archived:       { label: 'Archiviert'     },
}

function fmt(n: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
function getGreeting(name: string): string {
  const h = new Date().getHours()
  const zeit = h < 12 ? 'Morgen' : h < 17 ? 'Tag' : h < 21 ? 'Abend' : 'Nacht'
  return `Guten ${zeit}, ${name}.`
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

  // Letzte 5 Angebote — ersten Item-Titel für Fallback-Bezeichnung
  const { data: recentQuotes } = await supabase
    .from('quotes')
    .select('*, customer:customers(name), quote_items(title, position), quote_number')
    .eq('company_id', company?.id)
    .not('status', 'eq', 'archived')
    .order('created_at', { ascending: false })
    .limit(5)

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

  // Preisliste leer?
  const { count: preisCount } = await supabase
    .from('price_items')
    .select('id', { count: 'exact', head: true })
    .eq('company_id', company?.id ?? '')
  const preislisteIstLeer = (preisCount ?? 0) === 0

  // Offene gesamt (alle Monate, für Hero-Hinweis)
  const { data: offeneGesamt } = await supabase
    .from('quotes')
    .select('id')
    .eq('company_id', company?.id)
    .in('status', ['sent', 'viewed'])
  const offeneGesamtCount = (offeneGesamt ?? []).length

  const firstName = company?.name?.split(' ')[0] ?? 'Hallo'
  const initial = company?.name?.[0]?.toUpperCase() ?? 'A'
  const plan = (company as { plan?: string } | null)?.plan ?? 'starter'

  const heroStatusText = offeneGesamtCount > 0
    ? `● ${offeneGesamtCount} ${offeneGesamtCount === 1 ? 'Angebot wartet' : 'Angebote warten'} auf Antwort`
    : 'Alles erledigt. Neues Aufmaß?'
  const heroStatusLink = offeneGesamtCount > 0 ? '/angebote?status=offen' : null

  return (
    <div className="min-h-dvh bg-[#F7F7F5]">
      <PwaBannerManager />
      {welcome === 'new' && <WelcomeModalWrapper />}
      {welcome === 'pro' && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#2C2C2C] text-white font-extrabold text-sm px-5 py-3 rounded-full shadow-xl animate-bounce">
          🚀 Pro Plan aktiv — viel Erfolg!
        </div>
      )}

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className="bg-[#2C2C2C] px-5 pt-safe-top pt-5 pb-7">
        {/* Topbar */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-white/50 font-black text-sm tracking-wide">sofortangebot</span>
          <AvatarSheet initial={initial} name={firstName} plan={plan} />
        </div>

        {/* Begrüßung */}
        <div className="font-syne font-black text-white text-[22px] leading-snug mb-2">
          {getGreeting(firstName)}
        </div>

        {/* Dynamischer Status */}
        {heroStatusLink ? (
          <Link href={heroStatusLink} className="inline-block text-[#F5C400] text-[13px] font-black mb-6">
            {heroStatusText}
          </Link>
        ) : (
          <div className="text-white/40 text-[13px] font-semibold mb-6">{heroStatusText}</div>
        )}

        {/* Großer Aufmaß-Button */}
        <Link
          href="/angebot/neu"
          className="flex items-center gap-4 w-full bg-[#F5C400] rounded-xl px-5 h-16 active:opacity-90 transition-opacity"
        >
          <div className="w-10 h-10 rounded-lg bg-[#2C2C2C]/15 flex items-center justify-center shrink-0">
            <Mic size={22} className="text-[#2C2C2C]" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-syne font-black text-[#2C2C2C] text-[17px] leading-tight">Aufmaß starten</div>
            <div className="text-[#2C2C2C]/55 text-[12px] font-semibold">Einsprechen → Angebot fertig</div>
          </div>
        </Link>
      </div>

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <div className="px-5 pt-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: fmt(monatUmsatz), label: 'Umsatz' },
            { value: String(monatBeauftragt), label: 'Beauftragt' },
            { value: String(monatOffen), label: 'Offen' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl px-4 py-3.5 border border-black/5">
              <div className="font-syne font-black text-[#1A1A1A] text-lg leading-none truncate">{stat.value}</div>
              <div className="text-[10px] font-bold text-[#888] mt-1.5 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PREISLISTE LEER NUDGE ────────────────────────────────────── */}
      {preislisteIstLeer && (
        <div className="px-5 mt-4">
          <Link
            href="/preise"
            className="flex items-center gap-3 bg-[#F5C400]/10 border border-[#F5C400]/40 rounded-2xl px-4 py-3.5 active:opacity-80 transition-opacity"
          >
            <span className="text-xl shrink-0">💰</span>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-[#2C2C2C] text-[14px]">Deine Preise eintragen</div>
              <div className="text-[#2C2C2C]/50 font-semibold text-[12px] leading-snug mt-0.5">
                Noch keine eigenen Preise — KI nutzt Marktpreise. Trag deine echten Preise ein für genauere Angebote.
              </div>
            </div>
            <span className="text-[#2C2C2C]/30 font-black text-lg shrink-0">›</span>
          </Link>
        </div>
      )}

      {/* ── ANGEBOTSLISTE ────────────────────────────────────────────── */}
      {(recentQuotes ?? []).length > 0 && (
        <div className="px-5 mt-6 pb-32">
          <div className="text-[10px] font-black text-[#888] uppercase tracking-widest mb-3">
            Zuletzt erstellt
          </div>
          <div className="flex flex-col gap-3">
            {(recentQuotes ?? []).map((quote: Quote & { customer?: { name: string } | null; gewerk?: string; quote_items?: { title: string; position: number }[] }) => {
              const cfg = STATUS_LABEL[quote.status] ?? STATUS_LABEL.draft
              const items = (quote.quote_items ?? []).sort((a, b) => a.position - b.position)
              return (
                <MobileQuoteCard
                  key={quote.id}
                  quote={quote}
                  statusLabel={cfg.label}
                  formattedDate={fmtDate(quote.created_at)}
                  formattedAmount={fmt(quote.total_gross)}
                  ersterItemTitel={items[0]?.title ?? null}
                />
              )
            })}
          </div>
        </div>
      )}

      {(recentQuotes ?? []).length === 0 && (
        <div className="px-5 mt-6 pb-32">
          <div className="bg-white rounded-2xl border border-black/5 p-8 text-center">
            <div className="font-black text-[#1A1A1A] text-base">Noch keine Angebote.</div>
            <div className="text-[#888] text-sm font-semibold mt-1">Tippe oben auf „Aufmaß starten".</div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
