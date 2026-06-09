import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { createClient } from '@/lib/supabase/server'
import { AngebotPDF } from '@/lib/pdf'

// PDF-Generierung kann auf großen Angeboten >10s dauern — Vercel default wäre 10s
export const maxDuration = 60

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

  if (!quote) return NextResponse.json({ error: 'Angebot nicht gefunden' }, { status: 404 })

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', quote.company_id)
    .single()

  if (!company) return NextResponse.json({ error: 'Betrieb nicht gefunden' }, { status: 404 })

  // Gespeicherte Angebotsnummer bevorzugen (Punkt 3 — Race-Condition-Fix)
  let quoteNumber = quote.quote_number as string | null
  if (!quoteNumber) {
    const { count } = await supabase
      .from('quotes')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', company.id)
      .lte('created_at', quote.created_at)
    const year = new Date(quote.created_at).getFullYear()
    quoteNumber = `${year}-${String(count ?? 1).padStart(4, '0')}`
  }

  const sortedItems = (quote.items ?? []).sort((a: { position: number }, b: { position: number }) => a.position - b.position)

  // @ts-expect-error react-pdf renderToBuffer typing mismatch
  const buffer: Buffer = await renderToBuffer(createElement(AngebotPDF, {
    quote: { ...quote, items: sortedItems },
    company,
    quoteNumber,
  }))

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Angebot-${quoteNumber}.pdf"`,
    },
  })
}
