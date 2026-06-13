import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { createClient } from '@/lib/supabase/server'
import { AngebotPDF } from '@/lib/pdf'
import { generateZUGFeRDXml } from '@/lib/zugferd/generateXML'
import { embedZUGFeRDInPdf } from '@/lib/zugferd/embedXML'
import { checkUserRateLimit, rateLimitResponse } from '@/lib/rate-limiter'
import * as Sentry from '@sentry/nextjs'

export const maxDuration = 60

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const quoteId = searchParams.get('id')
  if (!quoteId) return NextResponse.json({ error: 'Keine ID' }, { status: 400 })

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data: company0 } = await supabase.from('companies').select('plan').eq('user_id', user.id).single()
  const plan0 = (company0 as { plan?: string } | null)?.plan ?? 'starter'
  const rlCheck = await checkUserRateLimit(user.id, 'pdf_generierung', plan0)
  if (!rlCheck.allowed) return rateLimitResponse(rlCheck)

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

  const quoteNumber = (quote as { angebotsnummer?: string | null }).angebotsnummer
    ?? (() => {
      const year = new Date(quote.created_at).getFullYear()
      return `${year}-${quote.id.slice(-4).toUpperCase()}`
    })()

  // Briefpapier laden falls zugewiesen
  let briefpapier = null
  const bpId = (quote as { briefpapier_id?: string | null }).briefpapier_id
  if (bpId) {
    const { data: bp } = await supabase.from('briefpapiere').select('*').eq('id', bpId).single()
    briefpapier = bp
  }

  const sortedItems = (quote.items ?? []).sort((a: { position: number }, b: { position: number }) => a.position - b.position)

  // @ts-expect-error react-pdf renderToBuffer typing mismatch
  let buffer: Buffer = await renderToBuffer(createElement(AngebotPDF, {
    quote: { ...quote, items: sortedItems },
    company,
    quoteNumber,
    briefpapier,
  }))

  // ZUGFeRD einbetten wenn: E-Rechnung aktiv + Geschäftskunde
  const kundeIstUnternehmen = quote.customer?.ist_unternehmen === true
    || !!quote.customer?.ustid
  const eRechnungAktiv = company.e_rechnung_aktiv !== false

  if (eRechnungAktiv && kundeIstUnternehmen) {
    try {
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
        positionen: sortedItems.map((item: { position: number; title: string; description: string | null; quantity: number; unit: string; unit_price: number; total_price: number }, idx: number) => ({
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

      buffer = Buffer.from(await embedZUGFeRDInPdf(new Uint8Array(buffer), xml))
    } catch (e) {
      console.error('[ZUGFeRD] Einbettung fehlgeschlagen:', e)
      Sentry.captureException(e, { tags: { feature: 'pdf_zugferd' } })
      // PDF ohne ZUGFeRD zurückgeben — kein harter Fehler
    }
  }

  const isZugferd = eRechnungAktiv && kundeIstUnternehmen
  const filename = isZugferd
    ? `Angebot-${quoteNumber}-ZUGFeRD.pdf`
    : `Angebot-${quoteNumber}.pdf`

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'X-ZUGFeRD': isZugferd ? '1' : '0',
    },
  })
}
