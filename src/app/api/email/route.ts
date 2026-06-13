import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { renderToBuffer } from '@react-pdf/renderer'

export const maxDuration = 60
import { createElement } from 'react'
import { createClient } from '@/lib/supabase/server'
import { checkUserRateLimit, rateLimitResponse } from '@/lib/rate-limiter'
import * as Sentry from '@sentry/nextjs'
import { AngebotPDF } from '@/lib/pdf'
import { generateZUGFeRDXml } from '@/lib/zugferd/generateXML'
import { embedZUGFeRDInPdf } from '@/lib/zugferd/embedXML'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { quoteId, to } = await req.json()
  if (!quoteId || !to) return NextResponse.json({ error: 'Fehlende Parameter' }, { status: 400 })

  const { data: quote } = await supabase
    .from('quotes')
    .select('*, items:quote_items(*), customer:customers(*), share_token')
    .eq('id', quoteId)
    .single()

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!quote || !company) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  const plan = (company as { plan?: string } | null)?.plan ?? 'starter'
  const rlCheck = await checkUserRateLimit(user.id, 'email_versand', plan)
  if (!rlCheck.allowed) return rateLimitResponse(rlCheck)

  let quoteNumber = (quote as { quote_number?: string }).quote_number ?? ''
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
  let pdfBuffer: Buffer = await renderToBuffer(createElement(AngebotPDF, {
    quote: { ...quote, items: sortedItems },
    company,
    quoteNumber,
  }))

  // ZUGFeRD für Geschäftskunden
  const kundeIstUnternehmen = quote.customer?.ist_unternehmen === true || !!quote.customer?.ustid
  const eRechnungAktiv = company.e_rechnung_aktiv !== false
  let xmlAttachment: { filename: string; content: Buffer } | null = null

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

      pdfBuffer = Buffer.from(await embedZUGFeRDInPdf(new Uint8Array(pdfBuffer), xml))
      xmlAttachment = { filename: `factur-x-${quoteNumber}.xml`, content: Buffer.from(xml, 'utf-8') }
    } catch (e) {
      console.error('[ZUGFeRD] Fehler beim E-Mail-Versand:', e)
      Sentry.captureException(e, { tags: { feature: 'email_zugferd' } })
    }
  }

  const totalGross = quote.total_gross.toFixed(2).replace('.', ',')
  const isZugferd = eRechnungAktiv && kundeIstUnternehmen
  const pdfFilename = isZugferd ? `Angebot-${quoteNumber}-ZUGFeRD.pdf` : `Angebot-${quoteNumber}.pdf`

  const attachments: { filename: string; content: Buffer }[] = [
    { filename: pdfFilename, content: Buffer.from(pdfBuffer) },
  ]
  if (xmlAttachment) attachments.push(xmlAttachment)

  const { error } = await resend.emails.send({
    from: `${company.name} <angebot@sofortangebot.app>`,
    to: [to],
    subject: `Angebot ${quoteNumber} – ${totalGross} €`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2C2C2C;">
        <div style="background: #2C2C2C; padding: 24px; border-radius: 8px 8px 0 0;">
          <span style="background: #F5C400; color: #2C2C2C; font-weight: 900; padding: 4px 12px; border-radius: 4px; font-size: 12px;">ANGEBOT</span>
        </div>
        <div style="background: white; padding: 32px; border: 1px solid #eee; border-top: 0; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; font-weight: 600;">Angebot ${quoteNumber}</p>
          <p>anbei erhalten Sie unser Angebot über <strong>${totalGross} €</strong>.</p>
          <p>Das Angebot finden Sie im Anhang dieser E-Mail.${isZugferd ? ' Es enthält eine eingebettete ZUGFeRD-XML (Factur-X).' : ''}</p>
          <p>Sie können das Angebot auch direkt online einsehen und digital unterschreiben:</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://sofortangebot.app'}/angebot/${quote.share_token ?? quoteId}/unterschreiben"
             style="display:inline-block;background:#F5C400;color:#2C2C2C;font-weight:900;padding:12px 24px;border-radius:8px;text-decoration:none;margin:8px 0;">
            Angebot online unterschreiben →
          </a>
          <br><br>
          <p style="color: #666;">Mit freundlichen Grüßen,<br><strong>${company.name}</strong></p>
        </div>
        <div style="padding: 16px 32px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #bbb; font-size: 11px; margin: 0;">Versendet über <a href="https://sofortangebot.app" style="color: #bbb;">sofortangebot.app</a> im Auftrag von ${company.name}</p>
        </div>
      </div>
    `,
    attachments,
  })

  if (error) {
    console.error('Resend error:', error)
    Sentry.captureException(new Error(String(error)), { tags: { feature: 'email_versand' } })
    return NextResponse.json({ error: 'E-Mail konnte nicht gesendet werden' }, { status: 500 })
  }

  await supabase.from('quotes').update({ status: 'sent' }).eq('id', quoteId)

  return NextResponse.json({ ok: true, zugferd: isZugferd })
}
