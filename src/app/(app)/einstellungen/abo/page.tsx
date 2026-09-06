import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { getAboStand } from '@/data/abo'
import { PRICING } from '@/lib/pricing'
import { AboAktionen } from './AboAktionen'

// DC-045: Die einzige Stelle, an der ein Nutzer nach dem Onboarding je
// wieder etwas über seinen Plan erfahren konnte, war das Willkommens-Fenster
// — und das erscheint genau einmal.

function formatDatum(iso: string) {
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default async function AboPage() {
  const { plan, laeuftBisISO, hatStripeKonto, angeboteDiesenMonat, freikontingent, limitErreicht } = await getAboStand()
  const istPro = plan === 'pro'

  return (
    <div className="min-h-dvh bg-bg pb-24">
      <div className="bg-anthracite px-5 md:px-8 pt-12 pb-6">
        <Link href="/einstellungen" className="text-white/50 text-sm font-semibold">← Einstellungen</Link>
        <div className="text-white font-syne font-black text-xl mt-1">Abo & Rechnungen</div>
      </div>

      <div className="px-5 md:px-8 pt-5 flex flex-col gap-4 max-w-xl mx-auto">

        <div className="bg-white rounded-2xl p-5 border border-anthracite/5">
          <div className="text-xs font-black text-anthracite/40 uppercase tracking-wide mb-2">Dein Plan</div>
          <div className="flex items-baseline gap-2">
            <span className="font-syne font-black text-2xl text-anthracite">
              {istPro ? 'Pro' : 'Starter'}
            </span>
            <span className="text-sm font-bold text-anthracite/40">
              {istPro ? `${PRICING.proMonatlich} €/Monat` : 'kostenlos'}
            </span>
          </div>

          {istPro && laeuftBisISO && (
            <div className="text-sm font-semibold text-anthracite/50 mt-2">
              Verlängert sich am {formatDatum(laeuftBisISO)}
            </div>
          )}

          {!istPro && (
            <div className="text-sm font-semibold text-anthracite/50 mt-2">
              Im Jahresabo kostet Pro {PRICING.proJahresabo} €/Monat.
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-anthracite/5">
          <div className="text-xs font-black text-anthracite/40 uppercase tracking-wide mb-2">Diesen Monat</div>
          <div className="font-syne font-black text-2xl text-anthracite">
            {istPro
              ? `${angeboteDiesenMonat} ${angeboteDiesenMonat === 1 ? 'Angebot' : 'Angebote'}`
              : `${angeboteDiesenMonat} von ${freikontingent}`}
          </div>
          {/* DC-045, Sandys Entscheidung „harte Grenze": Die Zahl hier kommt
              aus derselben Funktion, die auch sperrt (plan-limit.ts). Eine
              angezeigte und eine wirksame Grenze auseinanderlaufen zu lassen
              wäre der schlimmste Ausgang. */}
          <div className="text-sm font-semibold text-anthracite/50 mt-1">
            {istPro
              ? 'Im Pro-Plan ohne Begrenzung.'
              : 'Neu angelegte Angebote. Überarbeitungen eines bestehenden Angebots zählen nicht mit.'}
          </div>
          {!istPro && limitErreicht && (
            <div className="mt-3 bg-yellow/10 border border-yellow/30 rounded-xl px-3.5 py-3">
              <div className="font-bold text-anthracite text-sm">Dein Monat ist voll</div>
              <div className="text-xs font-semibold text-anthracite/60 mt-0.5">
                Angefangene Angebote kannst du weiter bearbeiten und versenden — für ein neues brauchst du Pro.
              </div>
            </div>
          )}
        </div>

        <AboAktionen plan={plan} hatStripeKonto={hatStripeKonto} />

      </div>

      <BottomNav />
    </div>
  )
}
