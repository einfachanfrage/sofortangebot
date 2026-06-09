import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { quoteId } = await req.json()
  const { data: company } = await supabase.from('companies').select('*').eq('user_id', user.id).single()

  if (!company?.fastbill_api_key || !company?.fastbill_email) {
    return NextResponse.json({ error: 'FastBill nicht verbunden. Bitte in Einstellungen → Buchhaltung verbinden einrichten.' }, { status: 400 })
  }

  const { data: quote } = await supabase
    .from('quotes')
    .select('*, items:quote_items(*), customer:customers(name,fastbill_customer_id)')
    .eq('id', quoteId).eq('company_id', company.id).single()
  if (!quote) return NextResponse.json({ error: 'Angebot nicht gefunden' }, { status: 404 })

  const auth = Buffer.from(`${company.fastbill_email}:${company.fastbill_api_key}`).toString('base64')

  const items = (quote.items ?? []).map((item: { title: string; quantity: number; unit_price: number }) => ({
    ARTICLE_NUMBER: '',
    DESCRIPTION: item.title,
    QUANTITY: item.quantity,
    UNIT_PRICE: item.unit_price,
    VAT_PERCENT: company.vat_rate ?? 19,
  }))

  const body = {
    SERVICE: 'estimate.create',
    DATA: {
      CUSTOMER_ID: '',
      CUSTOMER_COSTCENTER_ID: '',
      CURRENCY_CODE: 'EUR',
      ITEMS: items,
      ...(quote.customer?.fastbill_customer_id ? { CUSTOMER_ID: quote.customer.fastbill_customer_id } : quote.customer?.name ? { ORGANIZATION: quote.customer.name } : {}),
    },
  }

  const res = await fetch('https://www.fastbill.com/api/1.0/api.php', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) return NextResponse.json({ error: 'FastBill-Fehler: ' + res.status }, { status: 502 })
  const result = await res.json()
  if (result.RESPONSE?.ERRORS?.length) {
    return NextResponse.json({ error: result.RESPONSE.ERRORS[0] }, { status: 502 })
  }
  return NextResponse.json({ id: result.RESPONSE?.ESTIMATE_ID })
}
