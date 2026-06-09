import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { quoteId } = await req.json()
  if (!quoteId) return NextResponse.json({ error: 'quoteId fehlt' }, { status: 400 })

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!company?.lexoffice_api_key) {
    return NextResponse.json({ error: 'Kein Lexoffice API-Key hinterlegt. Bitte in Einstellungen → Integrationen eintragen.' }, { status: 400 })
  }

  const { data: quote } = await supabase
    .from('quotes')
    .select('*, items:quote_items(*), customer:customers(*)')
    .eq('id', quoteId)
    .eq('company_id', company.id)
    .single()

  if (!quote) return NextResponse.json({ error: 'Angebot nicht gefunden' }, { status: 404 })

  const lineItems = (quote.items ?? []).map((item: {
    title: string; quantity: number; unit: string; unit_price: number
  }) => ({
    type: 'custom',
    name: item.title,
    quantity: item.quantity,
    unitName: item.unit,
    unitPrice: {
      currency: 'EUR',
      netAmount: item.unit_price,
      taxRatePercentage: company.vat_rate ?? 19,
    },
    discountPercentage: 0,
  }))

  const body: Record<string, unknown> = {
    voucherDate: new Date().toISOString(),
    lineItems,
    totalPrice: { currency: 'EUR' },
    taxConditions: {
      taxType: company.vat_rate === 0 ? 'vatfree' : 'net',
    },
  }

  if (quote.customer?.name) {
    body.address = {
      name: quote.customer.name,
      ...(quote.customer.address ? { street: quote.customer.address } : {}),
    }
  }

  if (quote.valid_until) {
    body.expirationDate = quote.valid_until
  }

  const res = await fetch('https://api.lexoffice.io/v1/quotations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${company.lexoffice_api_key}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Lexoffice error:', err)
    return NextResponse.json({ error: 'Lexoffice-Fehler: ' + res.status }, { status: 502 })
  }

  const result = await res.json()
  return NextResponse.json({ id: result.id })
}
