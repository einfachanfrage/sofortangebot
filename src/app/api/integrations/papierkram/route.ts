import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { quoteId } = await req.json()
  const { data: company } = await supabase.from('companies').select('*').eq('user_id', user.id).single()

  if (!company?.papierkram_api_key) {
    return NextResponse.json({ error: 'Papierkram nicht verbunden. Bitte in Einstellungen → Buchhaltung verbinden einrichten.' }, { status: 400 })
  }

  const { data: quote } = await supabase
    .from('quotes')
    .select('*, items:quote_items(*), customer:customers(*)')
    .eq('id', quoteId).eq('company_id', company.id).single()
  if (!quote) return NextResponse.json({ error: 'Angebot nicht gefunden' }, { status: 404 })

  const headers = {
    'Authorization': `Bearer ${company.papierkram_api_key}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  const lineItems = (quote.items ?? []).map((item: { title: string; quantity: number; unit: string; unit_price: number }) => ({
    name: item.title,
    quantity: item.quantity,
    unit: item.unit,
    price: item.unit_price,
    vat_rate: company.vat_rate ?? 19,
  }))

  const body: Record<string, unknown> = {
    title: `Angebot${quote.customer?.name ? ' für ' + quote.customer.name : ''}`,
    date: new Date().toISOString().split('T')[0],
    line_items: lineItems,
  }

  if (quote.valid_until) body.due_date = quote.valid_until

  const res = await fetch('https://app.papierkram.de/api/v1/income/estimates', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) return NextResponse.json({ error: 'Papierkram-Fehler: ' + res.status }, { status: 502 })
  const result = await res.json()
  return NextResponse.json({ id: result.id })
}
