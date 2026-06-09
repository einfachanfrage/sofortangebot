import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { quoteId } = await req.json()
  const { data: company } = await supabase.from('companies').select('*').eq('user_id', user.id).single()

  if (!company?.billomat_api_key || !company?.billomat_subdomain) {
    return NextResponse.json({ error: 'Billomat nicht verbunden. Bitte in Einstellungen → Buchhaltung verbinden einrichten.' }, { status: 400 })
  }

  const { data: quote } = await supabase
    .from('quotes')
    .select('*, items:quote_items(*), customer:customers(name,billomat_client_id)')
    .eq('id', quoteId).eq('company_id', company.id).single()
  if (!quote) return NextResponse.json({ error: 'Angebot nicht gefunden' }, { status: 404 })

  const base = `https://${company.billomat_subdomain}.billomat.net/api`
  const headers = {
    'X-BillomatApiKey': company.billomat_api_key,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  // Angebot (Kostenvoranschlag) erstellen
  const offerBody: Record<string, unknown> = {
    offer: {
      currency_code: 'EUR',
      ...(quote.customer?.billomat_client_id ? { client_id: quote.customer.billomat_client_id } : quote.customer?.name ? { label: quote.customer.name } : {}),
    },
  }

  const offerRes = await fetch(`${base}/offers`, { method: 'POST', headers, body: JSON.stringify(offerBody) })
  if (!offerRes.ok) return NextResponse.json({ error: 'Billomat-Fehler beim Anlegen: ' + offerRes.status }, { status: 502 })
  const offerData = await offerRes.json()
  const offerId = offerData.offer?.id
  if (!offerId) return NextResponse.json({ error: 'Billomat: keine Angebots-ID erhalten' }, { status: 502 })

  // Positionen hinzufügen
  for (const item of (quote.items ?? [])) {
    await fetch(`${base}/offer-items`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        'offer-item': {
          offer_id: offerId,
          title: item.title,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          tax_name: `MwSt. ${company.vat_rate ?? 19}%`,
          tax_rate: company.vat_rate ?? 19,
        },
      }),
    })
  }

  return NextResponse.json({ id: offerId })
}
