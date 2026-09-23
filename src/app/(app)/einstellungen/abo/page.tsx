import Link from 'next/link'
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
  const { plan, laeuftBisISO, hatStripeKonto, angeboteDiesenMonat, testEndeISO, testTageRestlich, gesperrt, istGruenderpreis } = await getAboStand()
  const istPro = plan === 'pro'
  // CoS-038-A (23.09.2026): Der Preis hing an `PRICING.proMonatlich` — einer
  // Zahl aus dem abgelösten Modell, die es nicht mehr gibt. Es gibt zwei
  // Preise, und welcher gilt, steht am Betrieb (`is_founder_price`), nicht an
  // einer Konstante.
  const monatspreis = istGruenderpreis ? PRICING.gruenderMonatlich : PRICING.standardMonatlich

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
            {/* CoS-038-B (23.09.2026): Hier stand „kostenlos" neben „Starter".
                Das war die Beschriftung eines Dauer-Gratis-Tarifs — den gibt es
                nicht mehr. Was der Starter-Betrieb hat, ist eine Testphase mit
                einem Ende. Bestandskonten (ohne `trial_ends_at`) bekommen gar
                keinen Zusatz, statt eine Zusage, die für sie nicht stimmt. */}
            <span className="text-sm font-bold text-anthracite/40">
              {istPro
                ? `${monatspreis} € /Monat zzgl. MwSt.`
                : testEndeISO ? (gesperrt ? 'Testphase beendet' : 'Testphase') : ''}
            </span>
          </div>

          {istPro && laeuftBisISO && (
            <div className="text-sm font-semibold text-anthracite/50 mt-2">
              Verlängert sich am {formatDatum(laeuftBisISO)}
            </div>
          )}

          {istPro && istGruenderpreis && (
            <div className="text-sm font-semibold text-anthracite/50 mt-2">
              Gründerpreis — dieser Preis bleibt dir dauerhaft erhalten.
            </div>
          )}

          {/* CoS-038-A: Hier stand „Im Jahresabo kostet Pro 17 €/Monat." Ein
              Jahresabo gibt es vor Gate 2 nicht; `api/stripe/route.ts` nimmt
              deshalb bewusst gar keinen Plan-Parameter mehr entgegen. */}
          {!istPro && (
            <div className="text-sm font-semibold text-anthracite/50 mt-2">
              Unbegrenzt Angebote ab {PRICING.gruenderMonatlich} € /Monat zzgl. MwSt.
            </div>
          )}
        </div>

        {/* CoS-038-B (23.09.2026): Hier stand „X von 3" — das Monatskontingent
            aus dem abgelösten Modell. Es gibt keins mehr; was vor dem Abo
            steht, sind die 14 Testtage. Die Zahl der Angebote bleibt als
            Auskunft stehen, ohne Grenze dahinter.

            DC-045 gilt unverändert weiter: Angezeigter und wirksamer Stand
            kommen aus derselben Funktion (plan-limit.ts). */}
        <div className="bg-white rounded-2xl p-5 border border-anthracite/5">
          <div className="text-xs font-black text-anthracite/40 uppercase tracking-wide mb-2">Diesen Monat</div>
          <div className="font-syne font-black text-2xl text-anthracite">
            {angeboteDiesenMonat} {angeboteDiesenMonat === 1 ? 'Angebot' : 'Angebote'}
          </div>
          <div className="text-sm font-semibold text-anthracite/50 mt-1">
            Neu angelegte Angebote. Überarbeitungen eines bestehenden Angebots zählen nicht mit.
          </div>
        </div>

        {!istPro && testEndeISO && (
          <div className="bg-white rounded-2xl p-5 border border-anthracite/5">
            <div className="text-xs font-black text-anthracite/40 uppercase tracking-wide mb-2">Testphase</div>
            {gesperrt ? (
              <>
                <div className="font-syne font-black text-2xl text-anthracite">Abgelaufen</div>
                <div className="text-sm font-semibold text-anthracite/50 mt-1">
                  Seit {formatDatum(testEndeISO)}.
                </div>
                <div className="mt-3 bg-yellow/10 border border-yellow/30 rounded-xl px-3.5 py-3">
                  <div className="font-bold text-anthracite text-sm">Deine Testzeit ist vorbei</div>
                  <div className="text-xs font-semibold text-anthracite/60 mt-0.5">
                    Angefangene Angebote kannst du weiter bearbeiten und versenden — für ein neues brauchst du ein Abo.
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="font-syne font-black text-2xl text-anthracite">
                  {testTageRestlich !== null && testTageRestlich > 0
                    ? `Noch ${testTageRestlich} ${testTageRestlich === 1 ? 'Tag' : 'Tage'}`
                    : 'Läuft heute ab'}
                </div>
                <div className="text-sm font-semibold text-anthracite/50 mt-1">
                  Bis {formatDatum(testEndeISO)}. Keine Kreditkarte, keine stille Verlängerung.
                </div>
              </>
            )}
          </div>
        )}

        <AboAktionen plan={plan} hatStripeKonto={hatStripeKonto} />

      </div>

    </div>
  )
}
