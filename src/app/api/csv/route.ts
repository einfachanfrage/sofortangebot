import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const maxDuration = 30

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const quoteId = searchParams.get('id')
  if (!quoteId) return NextResponse.json({ error: 'Keine ID' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data: quote } = await supabase
    .from('quotes')
    .select('*, items:quote_items(*), customer:customers(*)')
    .eq('id', quoteId)
    .single()

  if (!quote) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  const { data: company } = await supabase.from('companies').select('name').eq('id', quote.company_id).single()

  let quoteNumber = (quote as { quote_number?: string }).quote_number ?? ''
  if (!quoteNumber) {
    const { count } = await supabase.from('quotes').select('*', { count: 'exact', head: true }).eq('company_id', quote.company_id).lte('created_at', quote.created_at)
    const year = new Date(quote.created_at).getFullYear()
    quoteNumber = `${year}-${String(count ?? 1).padStart(4, '0')}`
  }

  const items = (quote.items ?? []).sort((a: { position: number }, b: { position: number }) => a.position - b.position)

  const header = ['Angebotsnummer', 'Datum', 'Kunde', 'Pos', 'Bezeichnung', 'Menge', 'Einheit', 'Einzelpreis', 'Gesamtpreis']
  const rows = items.map((item: { position: number; title: string; quantity: number; unit: string; unit_price: number; total_price: number }) => [
    quoteNumber,
    new Date(quote.created_at).toLocaleDateString('de-DE'),
    quote.customer?.name ?? '',
    item.position,
    item.title,
    item.quantity,
    item.unit,
    item.unit_price.toFixed(2).replace('.', ','),
    item.total_price.toFixed(2).replace('.', ','),
  ])

  const csv = [header, ...rows]
    .map(row => row.map((cell: unknown) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
    .join('\r\n')

  const bom = '﻿' // UTF-8 BOM für Excel
  return new NextResponse(bom + csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="Angebot-${quoteNumber}.csv"`,
    },
  })
}
