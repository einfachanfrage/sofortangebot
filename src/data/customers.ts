import 'server-only'

import { notFound } from 'next/navigation'
import { requireCompany } from './auth'

export async function getCustomersOverview() {
  const { supabase, company } = await requireCompany()
  const { data } = await supabase.from('customers')
    .select('id, name, address, quotes(id, status, total_gross, created_at)')
    .eq('company_id', company.id).order('name')
  return data ?? []
}

export async function getCustomerDetail(id: string) {
  const { supabase, company } = await requireCompany()
  const [{ data: customer }, { data: quotes }] = await Promise.all([
    supabase.from('customers')
      .select('id, name, address, phone, email, ist_unternehmen, ustid, leitweg_id')
      .eq('id', id).eq('company_id', company.id).single(),
    supabase.from('quotes').select('id, status, total_gross, created_at, valid_until')
      .eq('customer_id', id).eq('company_id', company.id)
      .order('created_at', { ascending: false }),
  ])
  if (!customer) notFound()
  return { customer, quotes: quotes ?? [] }
}
