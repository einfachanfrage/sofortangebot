import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { AngebotPDF } from '@/lib/pdf'

export const maxDuration = 60

function getService() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!company) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  // Explizit auf company_id filtern statt nur auf RLS zu vertrauen (Verteidigung
  // in der Tiefe -- zweite, unabhaengige Absicherung derselben Regel).
  const { data: quote } = await supabase
    .from('quotes')
    .select('*, items:quote_items(*), customer:customers(*)')
    .eq('id', id)
    .eq('company_id', company.id)
    .single()

  if (!quote) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  // Bereits vorhandene URL zurückgeben wenn noch gültig
  const existingUrl = (quote as { pdf_public_url?: string; pdf_url_gueltig_bis?: string }).pdf_public_url
  const existingExpiry = (quote as { pdf_url_gueltig_bis?: string }).pdf_url_gueltig_bis
  if (existingUrl && existingExpiry && new Date(existingExpiry) > new Date()) {
    return NextResponse.json({ url: existingUrl, gueltig_bis: existingExpiry })
  }

  const quoteNumber = (quote as { angebotsnummer?: string | null }).angebotsnummer
    ?? (() => { const y = new Date(quote.created_at).getFullYear(); return `${y}-${quote.id.slice(-4).toUpperCase()}` })()

  // Briefpapier laden
  let briefpapier = null
  const bpId = (quote as { briefpapier_id?: string | null }).briefpapier_id
  if (bpId) {
    const { data: bp } = await supabase.from('briefpapiere').select('*').eq('id', bpId).single()
    briefpapier = bp
  }

  const sortedItems = (quote.items ?? []).sort((a: { position: number }, b: { position: number }) => a.position - b.position)

  // @ts-expect-error react-pdf typing
  const pdfBuffer: Buffer = await renderToBuffer(createElement(AngebotPDF, {
    quote: { ...quote, items: sortedItems },
    company,
    quoteNumber,
    briefpapier,
    revision: (quote as { revision?: number }).revision ?? 1,
  }))

  // Upload zu Supabase Storage (public bucket)
  const service = getService()
  const token = quote.share_token ?? id
  const storagePath = `${company.id}/${token}.pdf`

  const { error: uploadError } = await service.storage
    .from('public-pdfs')
    .upload(storagePath, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    })

  if (uploadError) {
    console.error('[public-pdf] Storage-Upload fehlgeschlagen')
    return NextResponse.json({ error: 'PDF-Upload fehlgeschlagen' }, { status: 500 })
  }

  const { data: publicData } = service.storage.from('public-pdfs').getPublicUrl(storagePath)
  const publicUrl = publicData.publicUrl

  // Ablauf: 30 Tage
  const gueltigBis = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  await supabase.from('quotes').update({
    pdf_public_url: publicUrl,
    pdf_url_gueltig_bis: gueltigBis,
  }).eq('id', id)

  return NextResponse.json({ url: publicUrl, gueltig_bis: gueltigBis })
}
