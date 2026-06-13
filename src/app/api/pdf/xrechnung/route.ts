// XRechnung: reines XML ohne PDF-Wrapper (für öffentliche Auftraggeber)
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateZUGFeRDXml } from '@/lib/zugferd/generateXML'

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

  if (!quote) return NextResponse.json({ error: 'Angebot nicht gefunden' }, { status: 404 })

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', quote.company_id)
    .single()

  if (!company) return NextResponse.json({ error: 'Betrieb nicht gefunden' }, { status: 404 })

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

  const sortedItems = (quote.items ?? []).sort(
    (a: { position: number }, b: { position: number }) => a.position - b.position
  )

  const datum = new Date(quote.created_at)
  const faellig = new Date(datum)
  faellig.setDate(faellig.getDate() + (company.payment_days ?? 14))

  const xml = generateZUGFeRDXml({
    nummer: quoteNumber,
    datum,
    faelligkeitsdatum: faellig,
    verkäufer: {
      name: company.name,
      adresse: company.address,
      steuernummer: company.tax_number,
      ustId: company.ust_id,
      iban: company.iban,
    },
    käufer: {
      name: quote.customer?.name ?? 'Unbekannt',
      adresse: quote.customer?.address,
      ustId: quote.customer?.ustid,
      leitwegId: quote.customer?.leitweg_id,
    },
    positionen: sortedItems.map((item: { title: string; description: string | null; quantity: number; unit: string; unit_price: number; total_price: number }, idx: number) => ({
      id: idx + 1,
      bezeichnung: item.title,
      beschreibung: item.description,
      menge: item.quantity,
      einheit: item.unit,
      einzelpreis: item.unit_price,
      gesamtpreis: item.total_price,
      steuersatz: company.vat_rate ?? 19,
    })),
    summen: {
      netto: quote.total_net,
      mwst: quote.total_vat,
      brutto: quote.total_gross,
    },
    isKleinunternehmer: (company.vat_rate ?? 19) === 0,
  })

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Content-Disposition': `attachment; filename="XRechnung-${quoteNumber}.xml"`,
    },
  })
}
