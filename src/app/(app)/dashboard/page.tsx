import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PwaBannerManager } from '@/components/PwaBannerManager'
import BottomNav from '@/components/BottomNav'
import { MobileQuoteCard } from '@/components/MobileQuoteCard'
import { WelcomeModalWrapper } from '@/components/WelcomeModalWrapper'
import AvatarSheet from '@/components/AvatarSheet'
import { Toast } from '@/components/Toast'
import { getDashboardData } from '@/data/dashboard'

// DC-003: hatte hier eine eigene, nur teilweise passende STATUS_LABEL-Tabelle
// (fehlte 'bereit' im Blick, führte lokal zu keinem Fehler, weil ??
// STATUS_LABEL.draft still auf "Entwurf" zurückfiel — nur eben falsch).
// MobileQuoteCard berechnet Label/Farbe jetzt selbst aus quote.status, siehe
// src/lib/status.ts — hier daher keine eigene Tabelle mehr nötig.

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
    monthRevenueDeltaPct: monatUmsatzDeltaPct,
    monthAccepted: monatBeauftragt, priceListEmpty: preislisteIstLeer,
    openCount: offeneGesamtCount,
  } = data
  const firstName = company.name?.split(' ')[0] ?? 'Hallo'
  const initial = company.name?.[0]?.toUpperCase() ?? 'A'
  const plan = company.plan
  // DC-032: "Guten Tag, Hallo." klang kaputt, sobald diese Seite dank der
  // Onboarding-Ausstiegsmöglichkeit tatsächlich mit leerem company.name
  // aufgerufen werden kann (vorher unmöglich, da needsOnboarding() vorher
  // gegriffen hätte). Ohne Namen daher eine namenlose Begrüßung.
  const greeting = company.name ? getGreeting(firstName) : 'Schön, dass du da bist.'

  const heroStatusText = offeneGesamtCount > 0
    ? `● ${offeneGesamtCount} ${offeneGesamtCount === 1 ? 'Angebot wartet' : 'Angebote warten'} auf Antwort`
    : 'Alles erledigt. Neues Aufmaß?'
  const heroStatusLink = offeneGesamtCount > 0 ? '/angebote?status=offen' : null

  return (
    <div className="min-h-dvh bg-bg">
      <PwaBannerManager />
      {welcome === 'new' && <WelcomeModalWrapper />}
      {welcome === 'pro' && <Toast message="🚀 Pro Plan aktiv — viel Erfolg!" />}

      <div className="md:max-w-5xl md:mx-auto md:px-8 md:py-8">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className="bg-anthracite px-5 pt-safe-top pt-5 pb-7 md:rounded-3xl md:px-8 md:pt-6 md:pb-8">
        {/* Topbar */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <span className="text-white/50 font-black text-sm tracking-wide md:hidden">sofortangebot</span>
          <span className="hidden md:block text-white/40 font-black text-sm uppercase tracking-widest">Übersicht</span>
          <AvatarSheet initial={initial} name={firstName} plan={plan} />
        </div>

        {/* Begrüßung */}
        <div className="font-syne font-black text-white text-[22px] md:text-[28px] leading-snug mb-2">
          {greeting}
        </div>

        {/* Dynamischer Status */}
        {/* DC-043 (2026-08-30, Sandys Go): der frühere große "Aufmaß
            starten"-Button hier führte zur exakt selben Aktion wie der
            gelbe Mikrofon-FAB in der BottomNav — zwei gleich auffällige
            CTAs für dieselbe Sache gleichzeitig sichtbar. Sandy: "das
            gelbe mikro muss IMMER da bleiben unten in der leiste" — der
            FAB bleibt, der Hero-Button entfällt dafür. Auf Desktop bleibt
            weiterhin die "Neues Angebot"-CTA in der SideNav bestehen,
            keine Lücke. */}
        {heroStatusLink ? (
          <Link href={heroStatusLink} className="inline-block text-yellow text-[13px] font-black">
            {heroStatusText}
          </Link>
        ) : (
          <div className="text-white/40 text-[13px] font-semibold">{heroStatusText}</div>
        )}
      </div>

      {/* ── UMSATZ-KACHEL + STATS ────────────────────────────────────── */}
      {/* DC-043 (2026-08-30, Sandys Go, Richtung "Warm & persönlich"):
          Umsatz war vorher eine von drei gleich gewichteten Kacheln, ohne
          Sonderstellung, ohne Vergleich zum Vormonat — für einen
          Handwerker aber die emotional wichtigste Zahl. Bekommt jetzt eine
          eigene, hervorgehobene Kachel mit Vormonatsvergleich; Beauftragt/
          Offen werden sekundär. */}
      <div className="px-5 pt-5 md:px-0 md:pt-6">
        <Link
          href="/angebote?status=beauftragt"
          className="block bg-gradient-to-br from-yellow/25 to-yellow/10 border border-yellow/40 rounded-2xl px-5 py-4 active:opacity-80 transition-opacity"
        >
          <div className="flex items-baseline justify-between gap-2 flex-wrap">
            <div className="font-syne font-black text-anthracite text-[26px] leading-none">{fmt(monatUmsatz)}</div>
            {monatUmsatzDeltaPct !== null && (
              <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap ${
                monatUmsatzDeltaPct >= 0 ? 'bg-green-100 text-green-700' : 'bg-anthracite/8 text-anthracite/50'
              }`}>
                {monatUmsatzDeltaPct >= 0 ? '+' : ''}{monatUmsatzDeltaPct}% ggü. letzten Monat
              </span>
            )}
          </div>
          <div className="text-[10px] font-bold text-anthracite/50 mt-1.5 uppercase tracking-wide">Umsatz · Monat</div>
          {monatBeauftragt > 0 && (
            <div className="text-[11px] font-bold text-[#8B7000] mt-2">
              🎉 {monatBeauftragt === 1 ? '1 Angebot' : `${monatBeauftragt} Angebote`} diesen Monat angenommen
            </div>
          )}
        </Link>

        <div className="grid grid-cols-2 gap-3 mt-3">
          <Link href="/angebote?status=beauftragt"
            className="bg-white rounded-2xl px-4 py-3.5 border border-black/5 active:opacity-70 transition-opacity">
            <div className="font-syne font-black text-anthracite text-lg leading-none truncate">{monatBeauftragt}</div>
            <div className="text-[10px] font-bold text-anthracite/50 mt-1.5 uppercase tracking-wide truncate">Beauftragt · Monat</div>
          </Link>
          <Link href="/angebote?status=offen"
            className="bg-white rounded-2xl px-4 py-3.5 border border-black/5 active:opacity-70 transition-opacity">
            <div className="font-syne font-black text-anthracite text-lg leading-none truncate">{offeneGesamtCount}</div>
            <div className="text-[10px] font-bold text-anthracite/50 mt-1.5 uppercase tracking-wide truncate">Beim Kunden</div>
          </Link>
        </div>
      </div>

      {/* ── ONBOARDING UNVOLLSTÄNDIG NUDGE ──────────────────────────────
          DC-032 (2026-09-02, Punkt 4 des Vorschlags "Später fertigstellen"):
          company.name fehlt nur, wenn der Nutzer über den neuen Ausstieg
          (Schritt 2+) vorzeitig gegangen ist — vorher landete niemand mit
          leerem Namen hier, weil getDashboardData() ihn sonst zurück ins
          Onboarding schickte. Ersetzt in diesem Fall die Preisliste-Nudge
          darunter bewusst (die wäre ohnehin redundant: ohne fertiges
          Onboarding gibt's noch keine eigenen Preise einzutragen). */}
      {!company.name ? (
        <div className="px-5 mt-4 md:px-0">
          <Link
            href="/onboarding"
            className="flex items-center gap-3 bg-yellow/10 border border-yellow/40 rounded-2xl px-4 py-3.5 active:opacity-80 transition-opacity"
          >
            <span className="text-xl shrink-0">🏗️</span>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-anthracite text-[14px]">Einrichtung fertigstellen</div>
              <div className="text-anthracite/50 font-semibold text-[12px] leading-snug mt-0.5">
                Noch ein paar Angaben, dann sind deine Angebote startklar.
              </div>
            </div>
            <span className="text-anthracite/30 font-black text-lg shrink-0">›</span>
          </Link>
        </div>
      ) : preislisteIstLeer && (
        <div className="px-5 mt-4 md:px-0">
          <Link
            href="/preise"
            className="flex items-center gap-3 bg-yellow/10 border border-yellow/40 rounded-2xl px-4 py-3.5 active:opacity-80 transition-opacity"
          >
            <span className="text-xl shrink-0">💰</span>
            <div className="flex-1 min-w-0">
              <div className="font-extrabold text-anthracite text-[14px]">Deine Preise eintragen</div>
              <div className="text-anthracite/50 font-semibold text-[12px] leading-snug mt-0.5">
                Noch keine eigenen Preise — KI nutzt Marktpreise. Trag deine echten Preise ein für genauere Angebote.
              </div>
            </div>
            <span className="text-anthracite/30 font-black text-lg shrink-0">›</span>
          </Link>
        </div>
      )}

      {/* ── ANGEBOTSLISTE ────────────────────────────────────────────── */}
      {(recentQuotes ?? []).length > 0 && (
        <div className="px-5 mt-6 pb-32 md:px-0 md:mt-8 md:pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-black text-anthracite/50 uppercase tracking-widest">
              Zuletzt erstellt
            </div>
            <Link href="/angebote" className="text-[11px] font-black text-anthracite/40 hover:text-anthracite/70">
              Alle →
            </Link>
          </div>
          <div className="flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-3">
            {recentQuotes.map(quote => {
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
        </div>
      )}

      {(recentQuotes ?? []).length === 0 && (
        <div className="px-5 mt-6 pb-32 md:px-0 md:mt-8 md:pb-4">
          <div className="bg-white rounded-2xl border border-black/5 p-8 text-center">
            <div className="font-black text-anthracite text-base">Noch keine Angebote.</div>
            {/* DC-043: verwies vorher auf den jetzt entfernten Hero-Button
                ("Tippe oben auf „Aufmaß starten"") — der einzige Weg dorthin
                ist jetzt der Mikrofon-FAB unten. */}
            {/* DC-046, beim Nachziehen gefunden: Die BottomNav ist `md:hidden`
                — auf dem Desktop gibt es unten gar kein Mikrofon, dort steht
                die CTA links in der Seitenleiste. Der Satz zeigte also auf
                dem großen Bildschirm auf etwas, das es nicht gibt. */}
            <div className="text-anthracite/50 text-sm font-semibold mt-1">
              <span className="md:hidden">Tippe unten auf das Mikrofon, um loszulegen.</span>
              <span className="hidden md:inline">Links in der Leiste auf „Neues Angebot", um loszulegen.</span>
            </div>
          </div>
        </div>
      )}

      </div>

      <BottomNav />
    </div>
  )
}
