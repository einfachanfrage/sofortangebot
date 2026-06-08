// Öffentlicher PDF-Endpunkt — kein Login nötig, nur Token
// Wird für WhatsApp-Links und E-Mail-Anhänge genutzt

import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { AngebotPDF } from '@/lib/pdf'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Kein Token' }, { status: 400 })

  const supabase = getServiceClient()

  const { data: quote } = await supabase
    .from('quotes')
    .select('*, items:quote_items(*), customer:customers(*)')
    .eq('share_token', token)
    .single()

  if (!quote) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', quote.company_id)
    .single()

  if (!company) return NextResponse.json({ error: 'Betrieb nicht gefunden' }, { status: 404 })

  // Angebotsnummer: erst quote_number aus DB, sonst berechnen
  let quoteNumber = quote.quote_number
  if (!quoteNumber) {
    const { count } = await supabase
      .from('quotes')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', company.id)
      .lte('created_at', quote.created_at)
    const year = new Date(quote.created_at).getFullYear()
    quoteNumber = `${year}-${String(count ?? 1).padStart(4, '0')}`
  }

  const sortedItems = (quote.items ?? []).sort(
    (a: { position: number }, b: { position: number }) => a.position - b.position
  )

  // @ts-expect-error react-pdf renderToBuffer typing mismatch
  const buffer: Buffer = await renderToBuffer(createElement(AngebotPDF, {
    quote: { ...quote, items: sortedItems },
    company,
    quoteNumber,
  }))

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="Angebot-${quoteNumber}.pdf"`,
    },
  })
}
