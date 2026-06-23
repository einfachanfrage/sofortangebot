import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Lexware Office (Online) nutzt dieselbe API wie Lexoffice (Haufe-Produkt, gleicher API-Host)
const LEXWARE_API = 'https://api.lexoffice.io/v1'

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

  if (!company?.lexware_api_key) {
    return NextResponse.json(
      { error: 'Kein Lexware Office API-Key hinterlegt. Bitte in Einstellungen → Integrationen eintragen.' },
      { status: 400 }
    )
  }

  const { data: quote } = await supabase
    .from('quotes')
    .select('*, items:quote_items(*), customer:customers(name,address,email,lexoffice_contact_id)')
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

  if (quote.customer?.lexoffice_contact_id) {
    body.address = { contactId: quote.customer.lexoffice_contact_id }
  } else if (quote.customer?.name) {
    // Adresse: erste Zeile = Straße, zweite Zeile = PLZ Ort
    const adressZeilen = (quote.customer.address ?? '').split('\n').map((s: string) => s.trim()).filter(Boolean)
    const strasseRaw = adressZeilen[0] ?? ''
    const plzOrtRaw = adressZeilen[1] ?? ''
    const plzMatch = plzOrtRaw.match(/^(\d{5})\s+(.+)$/)
    body.address = {
      name: quote.customer.name,
      countryCode: 'DE',
      ...(strasseRaw ? { street: strasseRaw } : {}),
      ...(plzMatch ? { zip: plzMatch[1], city: plzMatch[2] } : plzOrtRaw ? { city: plzOrtRaw } : {}),
    }
  }

  if (quote.valid_until) {
    body.expirationDate = quote.valid_until
  }

  const res = await fetch(`${LEXWARE_API}/quotations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${company.lexware_api_key}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Lexware Office error:', res.status, err)
    let detail = ''
    try { detail = JSON.parse(err)?.message ?? err } catch { detail = err }
    return NextResponse.json({ error: `Lexware Office Fehler ${res.status}: ${detail}` }, { status: 502 })
  }

  const result = await res.json()
  return NextResponse.json({ id: result.id })
}
