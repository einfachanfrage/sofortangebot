import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PwaBannerManager } from '@/components/PwaBannerManager'
import BottomNav from '@/components/BottomNav'
import { MobileQuoteCard } from '@/components/MobileQuoteCard'
import { WelcomeModalWrapper } from '@/components/WelcomeModalWrapper'
import AvatarSheet from '@/components/AvatarSheet'
import { Mic } from 'lucide-react'
import { Toast } from '@/components/Toast'
import { getDashboardData } from '@/data/dashboard'

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
  const { welcome } = await searchParams
  const data = await getDashboardData()
  if (data.needsOnboarding) redirect('/onboarding')
  const {
    company, recentQuotes, monthRevenue: monatUmsatz,
    monthAccepted: monatBeauftragt, priceListEmpty: preislisteIstLeer,
    openCount: offeneGesamtCount,
  } = data
  const firstName = company.name?.split(' ')[0] ?? 'Hallo'
  const initial = company.name?.[0]?.toUpperCase() ?? 'A'
  const plan = company.plan

  const heroStatusText = offeneGesamtCount > 0
    ? `● ${offeneGesamtCount} ${offeneGesamtCount === 1 ? 'Angebot wartet' : 'Angebote warten'} auf Antwort`
    : 'Alles erledigt. Neues Aufmaß?'
  const heroStatusLink = offeneGesamtCount > 0 ? '/angebote?status=offen' : null

  return (
    <div className="min-h-dvh bg-[#F7F7F5]">
      <PwaBannerManager />
      {welcome === 'new' && <WelcomeModalWrapper />}
      {welcome === 'pro' && <Toast message="🚀 Pro Plan aktiv — viel Erfolg!" />}

      <div className="md:max-w-5xl md:mx-auto md:px-8 md:py-8">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className="bg-[#2C2C2C] px-5 pt-safe-top pt-5 pb-7 md:rounded-3xl md:px-8 md:pt-6 md:pb-8">
        {/* Topbar */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <span className="text-white/50 font-black text-sm tracking-wide md:hidden">sofortangebot</span>
          <span className="hidden md:block text-white/40 font-black text-sm uppercase tracking-widest">Übersicht</span>
          <AvatarSheet initial={initial} name={firstName} plan={plan} />
        </div>

        <div className="md:flex md:items-end md:justify-between md:gap-10">
          <div className="md:flex-1">
            {/* Begrüßung */}
            <div className="font-syne font-black text-white text-[22px] md:text-[28px] leading-snug mb-2">
              {getGreeting(firstName)}
            </div>

            {/* Dynamischer Status */}
            {heroStatusLink ? (
              <Link href={heroStatusLink} className="inline-block text-[#F5C400] text-[13px] font-black mb-6 md:mb-0">
                {heroStatusText}
              </Link>
            ) : (
              <div className="text-white/40 text-[13px] font-semibold mb-6 md:mb-0">{heroStatusText}</div>
            )}
          </div>

          {/* Großer Aufmaß-Button */}
          <Link
            href="/angebot/neu"
            className="flex items-center gap-4 w-full md:w-auto md:shrink-0 bg-[#F5C400] rounded-xl px-5 md:pr-8 h-16 active:opacity-90 hover:opacity-90 transition-opacity"
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
      </div>

      {/* ── STATS ────────────────────────────────────────────────────── */}
      <div className="px-5 pt-5 md:px-0 md:pt-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: fmt(monatUmsatz), label: 'Umsatz · Monat', href: '/angebote?status=beauftragt' },
            { value: String(monatBeauftragt), label: 'Beauftragt · Monat', href: '/angebote?status=beauftragt' },
            { value: String(offeneGesamtCount), label: 'Offen', href: '/angebote?status=offen' },
          ].map(stat => (
            <Link key={stat.label} href={stat.href}
              className="bg-white rounded-2xl px-4 py-3.5 border border-black/5 active:opacity-70 transition-opacity">
              <div className="font-syne font-black text-[#2C2C2C] text-lg leading-none truncate">{stat.value}</div>
              <div className="text-[10px] font-bold text-[#2C2C2C]/50 mt-1.5 uppercase tracking-wide truncate">{stat.label}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── PREISLISTE LEER NUDGE ────────────────────────────────────── */}
      {preislisteIstLeer && (
        <div className="px-5 mt-4 md:px-0">
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
        <div className="px-5 mt-6 pb-32 md:px-0 md:mt-8 md:pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-black text-[#2C2C2C]/50 uppercase tracking-widest">
              Zuletzt erstellt
            </div>
            <Link href="/angebote" className="text-[11px] font-black text-[#2C2C2C]/40 hover:text-[#2C2C2C]/70">
              Alle →
            </Link>
          </div>
          <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-3">
            {recentQuotes.map(quote => {
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
        <div className="px-5 mt-6 pb-32 md:px-0 md:mt-8 md:pb-4">
          <div className="bg-white rounded-2xl border border-black/5 p-8 text-center">
            <div className="font-black text-[#2C2C2C] text-base">Noch keine Angebote.</div>
            <div className="text-[#2C2C2C]/50 text-sm font-semibold mt-1">Tippe oben auf „Aufmaß starten".</div>
          </div>
        </div>
      )}

      </div>

      <BottomNav />
    </div>
  )
}
