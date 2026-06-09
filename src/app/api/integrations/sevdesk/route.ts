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

  if (!company?.sevdesk_api_key) {
    return NextResponse.json({ error: 'Kein sevDesk API-Key hinterlegt. Bitte in Einstellungen → Integrationen eintragen.' }, { status: 400 })
  }

  const { data: quote } = await supabase
    .from('quotes')
    .select('*, items:quote_items(*), customer:customers(*)')
    .eq('id', quoteId)
    .eq('company_id', company.id)
    .single()

  if (!quote) return NextResponse.json({ error: 'Angebot nicht gefunden' }, { status: 404 })

  const headers = {
    'Authorization': company.sevdesk_api_key,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  const base = 'https://my.sevdesk.de/api/v1'

  // Kontakt in sevDesk suchen oder anlegen
  let contactId: string | null = null
  if (quote.customer?.name) {
    const search = await fetch(
      `${base}/Contact?name=${encodeURIComponent(quote.customer.name)}&limit=1`,
      { headers }
    )
    if (search.ok) {
      const searchData = await search.json()
      if (searchData.objects?.length > 0) {
        contactId = searchData.objects[0].id
      }
    }

    if (!contactId) {
      const createContact = await fetch(`${base}/Contact`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: quote.customer.name,
          customerNumber: null,
          category: { id: '3', objectName: 'Category' },
          objectName: 'Contact',
        }),
      })
      if (createContact.ok) {
        const cd = await createContact.json()
        contactId = cd.objects?.id ?? null
      }
    }
  }

  // Angebot erstellen
  const orderBody: Record<string, unknown> = {
    objectName: 'Order',
    orderType: 'AN',
    orderDate: new Date().toISOString().split('T')[0],
    currency: 'EUR',
    status: '100',
    ...(contactId ? { contact: { id: contactId, objectName: 'Contact' } } : {}),
  }

  if (quote.valid_until) {
    orderBody.deliveryDate = quote.valid_until
  }

  const orderRes = await fetch(`${base}/Order`, {
    method: 'POST',
    headers,
    body: JSON.stringify(orderBody),
  })

  if (!orderRes.ok) {
    const err = await orderRes.text()
    console.error('sevDesk Order error:', err)
    return NextResponse.json({ error: 'sevDesk-Fehler beim Anlegen des Angebots' }, { status: 502 })
  }

  const orderData = await orderRes.json()
  const orderId = orderData.objects?.id
  if (!orderId) return NextResponse.json({ error: 'sevDesk: keine Order-ID' }, { status: 502 })

  // Positionen hinzufügen
  for (const item of (quote.items ?? [])) {
    await fetch(`${base}/OrderPos`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        objectName: 'OrderPos',
        order: { id: orderId, objectName: 'Order' },
        name: item.title,
        quantity: item.quantity,
        unity: { id: '1', objectName: 'Unity' },
        price: item.unit_price,
        taxRate: company.vat_rate ?? 19,
      }),
    })
  }

  return NextResponse.json({ id: orderId })
}
