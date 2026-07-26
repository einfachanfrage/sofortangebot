import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  if (!UUID_PATTERN.test(token)) {
    return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })
  }

  const service = getServiceClient()
  const { data: quote } = await service
    .from('quotes')
    .select(`
      id, company_id, status, total_gross, total_net, total_vat,
      valid_until, notes, quote_number, created_at,
      items:quote_items(id, position, title, description, quantity, unit, unit_price, total_price),
      customer:customers(name, address)
    `)
    .eq('share_token', token)
    .in('status', ['sent', 'accepted'])
    .single()

  if (!quote) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  const { data: company } = await service
    .from('companies')
    .select('name,address,vat_rate,payment_days,agb_url')
    .eq('id', quote.company_id)
    .single()

  if (!company) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  let quoteNumber = quote.quote_number
  if (!quoteNumber) {
    const { count } = await service
      .from('quotes')
      .select('id', { count: 'exact', head: true })
      .eq('company_id', quote.company_id)
      .lte('created_at', quote.created_at)
    quoteNumber = `${new Date(quote.created_at).getFullYear()}-${String(count ?? 1).padStart(4, '0')}`
  }

  return NextResponse.json({
    quote: {
      id: quote.id,
      status: quote.status,
      total_gross: quote.total_gross,
      total_net: quote.total_net,
      total_vat: quote.total_vat,
      valid_until: quote.valid_until,
      notes: quote.notes,
      customer: quote.customer,
      items: (quote.items ?? []).sort((a, b) => a.position - b.position),
    },
    company,
    quoteNumber,
  }, {
    headers: { 'Cache-Control': 'private, no-store' },
  })
}
