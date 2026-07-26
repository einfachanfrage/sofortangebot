import 'server-only'

import { requireCompany } from './auth'

function normalizeCustomer(value: unknown): { name: string } | null {
  if (Array.isArray(value)) return value[0] ?? null
  return (value as { name: string } | null) ?? null
}

export async function getDashboardData() {
  const { supabase, company } = await requireCompany()
  if (!company.name) return { needsOnboarding: true as const }

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const [recentResult, monthResult, priceResult, openResult] = await Promise.all([
    supabase.from('quotes')
      .select('id, status, total_gross, created_at, quote_number, customer:customers(name), quote_items(title, position)')
      .eq('company_id', company.id).not('status', 'eq', 'archived')
      .order('created_at', { ascending: false }).limit(5),
    supabase.from('quotes').select('status, total_gross')
      .eq('company_id', company.id).gte('created_at', monthStart)
      .not('status', 'in', '("draft","in_bearbeitung","archived")'),
    supabase.from('price_items').select('id', { count: 'exact', head: true }).eq('company_id', company.id),
    supabase.from('quotes').select('id').eq('company_id', company.id).in('status', ['sent', 'viewed']),
  ])

  const monthQuotes = monthResult.data ?? []
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
    monthRevenue: monthQuotes.filter(q => q.status === 'accepted').reduce((sum, q) => sum + (q.total_gross ?? 0), 0),
    monthAccepted: monthQuotes.filter(q => q.status === 'accepted').length,
    priceListEmpty: (priceResult.count ?? 0) === 0,
    openCount: (openResult.data ?? []).length,
  }
}
