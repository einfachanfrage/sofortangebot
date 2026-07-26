import 'server-only'

import { notFound } from 'next/navigation'
import { requireCompany } from './auth'

export interface QuoteListDTO {
  id: string
  status: string
  total_gross: number
  created_at: string
  gewerk: string | null
  customer: { name: string } | null
  quote_items: Array<{ title: string; position: number }>
}

function normalizeCustomer(value: unknown): { name: string } | null {
  if (Array.isArray(value)) return value[0] ?? null
  return (value as { name: string } | null) ?? null
}

const STATUS_FILTERS: Record<string, string[]> = {
  entwurf: ['draft', 'in_bearbeitung'],
  offen: ['sent', 'viewed'],
  beauftragt: ['accepted'],
  abgelehnt: ['rejected'],
  archived: ['archived'],
}

export async function getQuotesOverview(status?: string) {
  const { supabase, company } = await requireCompany()
  const statusValues = status ? STATUS_FILTERS[status] : undefined
  let query = supabase.from('quotes')
    .select('id, status, total_gross, created_at, gewerk, title, customer:customers(name), quote_items(title, position)')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false })
  if (statusValues) query = query.in('status', statusValues)

  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
  const [quotesResult, draftsResult, archiveResult, monthResult] = await Promise.all([
    query,
    supabase.from('quotes').select('id').eq('company_id', company.id).in('status', ['draft', 'in_bearbeitung']),
    supabase.from('quotes').select('id').eq('company_id', company.id).eq('status', 'archived'),
    supabase.from('quotes').select('status').eq('company_id', company.id).gte('created_at', monthStart)
      .not('status', 'in', '("draft","in_bearbeitung","archived")'),
  ])
  if (quotesResult.error) console.error('[quotes-dal] Abfrage fehlgeschlagen')
  const month = monthResult.data ?? []
  return {
    quotes: (quotesResult.data ?? []).map(row => ({
      id: row.id,
      status: row.status,
      total_gross: row.total_gross,
      created_at: row.created_at,
      gewerk: row.gewerk,
      customer: normalizeCustomer(row.customer),
      quote_items: row.quote_items ?? [],
    })) satisfies QuoteListDTO[],
    counts: {
      drafts: (draftsResult.data ?? []).length,
      archive: (archiveResult.data ?? []).length,
      open: month.filter(q => q.status === 'sent' || q.status === 'viewed').length,
      accepted: month.filter(q => q.status === 'accepted').length,
      rejected: month.filter(q => q.status === 'rejected').length,
    },
  }
}

export async function getQuoteDetail(id: string) {
  const { supabase, company } = await requireCompany()
  const { data: quote } = await supabase
    .from('quotes').select('*, items:quote_items(*), customer:customers(*)')
    .eq('id', id).eq('company_id', company.id).single()
  if (!quote) notFound()

  const { data: fullCompany } = await supabase.from('companies').select('*').eq('id', company.id).single()
  const quoteNumber = (quote as { angebotsnummer?: string | null }).angebotsnummer
    ?? `${new Date(quote.created_at).getFullYear()}-${quote.id.slice(-4).toUpperCase()}`
  return {
    quote: { ...quote, items: (quote.items ?? []).sort((a: { position: number }, b: { position: number }) => a.position - b.position) },
    company: fullCompany,
    quoteNumber,
  }
}
