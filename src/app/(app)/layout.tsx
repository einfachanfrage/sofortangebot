import SideNav from '@/components/SideNav'
import { AgbUpdateModal } from '@/components/AgbUpdateModal'
import { RestoreBanner } from '@/components/RestoreBanner'
import { AppFooter } from '@/components/AppFooter'
import { requireCompany } from '@/data/auth'

// ── CoS-P-012 (Platform & Integrations Engineer, 2026-09-11) ──────────────
// TN-114: Seitenleiste zeigte fest "PRO", egal welchen Plan die Firma
// wirklich hatte — die Abo-Seite (data/abo.ts, echte DB-Abfrage) zeigte
// daneben korrekt "Starter". `requireCompany()` ist mit `cache()` gebaut,
// liefert `plan` bereits mit und läuft in fast jeder Seite ohnehin schon —
// hier zusätzlich abzufragen kostet praktisch keine neue Datenbankabfrage.
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { company } = await requireCompany()
  const plan = (company.plan ?? 'starter') === 'starter' ? 'starter' : 'pro'

  return (
    <div className="min-h-dvh bg-bg">
      <SideNav plan={plan} />
      <AgbUpdateModal />
      <RestoreBanner />
      <div className="md:ml-[220px] flex flex-col min-h-dvh">
        <main className="flex-1">
          {children}
        </main>
        <AppFooter />
      </div>
    </div>
  )
}
