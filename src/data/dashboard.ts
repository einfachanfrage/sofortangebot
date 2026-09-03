import 'server-only'

import { requireCompany } from './auth'

function normalizeCustomer(value: unknown): { name: string } | null {
  if (Array.isArray(value)) return value[0] ?? null
  return (value as { name: string } | null) ?? null
}

export async function getDashboardData() {
  const { supabase, company } = await requireCompany()
  // Punkt 3 des Designer-Vorschlags „Später fertigstellen" (02.09.2026):
  // Ins Onboarding zwangsweise umgeleitet wird nur noch, wer es NIE
  // angefangen hat. Wer angefangen und abgebrochen hat, sieht das Dashboard
  // mit einem Hinweis-Banner (baut der Product Designer) statt einer
  // Sackgasse — vorher waren beide Fälle in der Datenbank nicht zu
  // unterscheiden.
  //
  // Solange `onboarding_started_at` nirgends gesetzt wird (Punkt 2, ebenfalls
  // beim Designer), ist das Verhalten unverändert: alle Bestandszeilen sind
  // NULL. Diese Zeile geht also nicht "scharf", bevor sein Teil steht.
  const onboardingBegonnen = Boolean(
    (company as { onboarding_started_at?: string | null }).onboarding_started_at,
  )
  if (!company.name && !onboardingBegonnen) return { needsOnboarding: true as const }

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  // DC-043 (2026-08-30, Sandys Go, Richtung "Warm & persönlich"): Umsatz
  // bekommt eine große, hervorgehobene Kachel mit Vergleich zum Vormonat
  // statt einer nüchternen Zahl unter drei gleich gewichteten Kacheln —
  // dafür zusätzlich der Vormonats-Umsatz mit derselben Filterlogik wie
  // der aktuelle Monat, nur einen Monat zurück.
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
  const [recentResult, monthResult, prevMonthResult, priceResult, openResult] = await Promise.all([
    supabase.from('quotes')
      .select('id, status, total_gross, created_at, quote_number, customer:customers(name), quote_items(title, position)')
      .eq('company_id', company.id).not('status', 'eq', 'archived')
      .order('created_at', { ascending: false }).limit(5),
    supabase.from('quotes').select('status, total_gross')
      .eq('company_id', company.id).gte('created_at', monthStart)
      .not('status', 'in', '("draft","in_bearbeitung","archived")'),
    supabase.from('quotes').select('status, total_gross')
      .eq('company_id', company.id).gte('created_at', prevMonthStart).lt('created_at', monthStart)
      .not('status', 'in', '("draft","in_bearbeitung","archived")'),
    supabase.from('price_items').select('id', { count: 'exact', head: true }).eq('company_id', company.id),
    supabase.from('quotes').select('id').eq('company_id', company.id).eq('status', 'sent'),
  ])

  const monthQuotes = monthResult.data ?? []
  const prevMonthQuotes = prevMonthResult.data ?? []
  const monthRevenue = monthQuotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + (q.total_gross ?? 0), 0)
  const prevMonthRevenue = prevMonthQuotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + (q.total_gross ?? 0), 0)
  return {
    needsOnboarding: false as const,
    company: { name: company.name, plan: company.plan ?? 'starter' },
    recentQuotes: (recentResult.data ?? []).map(row => ({
      id: row.id,
      status: row.status,
      total_gross: row.total_gross,
      created_at: row.created_at,
      quote_number: row.quote_number,
      customer: normalizeCustomer(row.customer),
      quote_items: row.quote_items ?? [],
    })),
    monthRevenue,
    // null wenn es im Vormonat schlicht keine Vergleichsbasis gibt (0 €
    // Vormonatsumsatz, z. B. ganz neue Firma) — dann lieber gar kein
    // Vergleich als eine bedeutungslose "+100%"/"+∞%"-Angabe.
    monthRevenueDeltaPct: prevMonthRevenue > 0 ? Math.round(((monthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100) : null,
    monthAccepted: monthQuotes.filter(q => q.status === 'accepted').length,
    priceListEmpty: (priceResult.count ?? 0) === 0,
    openCount: (openResult.data ?? []).length,
  }
}
