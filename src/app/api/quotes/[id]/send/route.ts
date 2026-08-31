import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { AngebotPDF } from '@/lib/pdf'
import { ladeFotosFuerPdf } from '@/lib/angebot-fotos'
import { generateZUGFeRDXml } from '@/lib/zugferd/generateXML'
import { embedZUGFeRDInPdf } from '@/lib/zugferd/embedXML'
import * as Sentry from '@sentry/nextjs'

export const maxDuration = 60

const resend = new Resend(process.env.RESEND_API_KEY)

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

  const { to, betreff, nachricht, via } = await req.json() as {
    to: string
    betreff: string
    nachricht: string
    via: 'email' | 'whatsapp' | 'link'
  }

  if (!to || !via) return NextResponse.json({ error: 'Fehlende Parameter' }, { status: 400 })

  const { data: quote } = await supabase
    .from('quotes')
    .select('*, items:quote_items(*), customer:customers(*), share_token')
    .eq('id', id)
    .single()

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!quote || !company) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  // Angebotsnummer
  const { count } = await supabase
    .from('quotes')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', company.id)
    .lte('created_at', quote.created_at)
  const year = new Date(quote.created_at).getFullYear()
  const quoteNumber = `${year}-${String(count ?? 1).padStart(4, '0')}`

  const sortedItems = (quote.items ?? []).sort((a: { position: number }, b: { position: number }) => a.position - b.position)

  // ── E-Mail Versand ───────────────────────────────────────────────────────
  if (via === 'email') {
    // Briefpapier laden
    let briefpapier = null
    const bpId = (quote as { briefpapier_id?: string | null }).briefpapier_id
    if (bpId) {
      const { data: bp } = await supabase.from('briefpapiere').select('*').eq('id', bpId).single()
      briefpapier = bp
    }

    const fotos = await ladeFotosFuerPdf(supabase, quote.id)

    // PDF generieren
    // @ts-expect-error react-pdf typing
    let pdfBuffer: Buffer = await renderToBuffer(createElement(AngebotPDF, {
      quote: { ...quote, items: sortedItems },
      company,
      quoteNumber,
      briefpapier,
      revision: (quote as { revision?: number }).revision ?? 1,
      fotos,
    }))

    // ZUGFeRD für B2B-Kunden
    const kundeIstUnternehmen = quote.customer?.ist_unternehmen === true || !!quote.customer?.ustid
    let xmlAttachment: { filename: string; content: Buffer } | null = null
    if (company.e_rechnung_aktiv !== false && kundeIstUnternehmen) {
      try {
        const xml = generateZUGFeRDXml({
          nummer: quoteNumber,
          datum: new Date(quote.created_at),
          faelligkeitsdatum: new Date(quote.valid_until ?? Date.now() + 30 * 86400000),
          verkäufer: { name: company.name, adresse: company.address, steuernummer: company.tax_number ?? null, ustId: (company as { ust_id?: string }).ust_id ?? null, iban: company.iban ?? null },
          käufer: { name: quote.customer!.name, adresse: quote.customer!.address ?? null },
          positionen: sortedItems.map((item: { title: string; description: string | null; quantity: number; unit: string; unit_price: number; total_price: number }, idx: number) => ({ id: idx + 1, bezeichnung: item.title, beschreibung: item.description, menge: item.quantity, einheit: item.unit, einzelpreis: item.unit_price, steuersatz: company.vat_rate, gesamtpreis: item.total_price })),
          summen: { netto: quote.total_net, mwst: quote.total_vat, brutto: quote.total_gross },
          waehrung: 'EUR',
          isKleinunternehmer: company.vat_rate === 0,
        })
        pdfBuffer = Buffer.from(await embedZUGFeRDInPdf(pdfBuffer, xml))
        xmlAttachment = { filename: `factur-x-${quoteNumber}.xml`, content: Buffer.from(xml) }
      } catch {
        console.error('[quote-send] ZUGFeRD-Erstellung fehlgeschlagen')
      }
    }

    // Handwerker-E-Mail als reply-to
    const service = getService()
    const { data: userData } = await service.auth.admin.getUserById(user.id)
    const handwerkerEmail = userData?.user?.email ?? ''

    const pdfBase64 = pdfBuffer.toString('base64')
    const revision = (quote as { revision?: number }).revision ?? 1
    const pdfDateiname = revision > 1 ? `Angebot-${quoteNumber}-R${revision}.pdf` : `Angebot-${quoteNumber}.pdf`
    const attachments: { filename: string; content: string }[] = [
      { filename: pdfDateiname, content: pdfBase64 },
    ]
    if (xmlAttachment) {
      attachments.push({ filename: xmlAttachment.filename, content: xmlAttachment.content.toString('base64') })
    }

    // Nachricht als HTML (Zeilenumbrüche erhalten)
    const nachrichtHtml = (nachricht ?? '').replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;')

    const { error } = await resend.emails.send({
      from: `${company.name} via Sofortangebot <noreply@sofortangebot.app>`,
      replyTo: handwerkerEmail || undefined,
      to: [to],
      subject: betreff ?? `Angebot #${quoteNumber} – ${company.name}`,
      text: nachricht ?? '',
      html: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="margin:0;padding:32px 20px;background:#F7F7F5;font-family:sans-serif;">
<div style="max-width:520px;margin:0 auto;background:white;border-radius:16px;padding:36px 32px;color:#2C2C2C;line-height:1.6;">
<p style="white-space:pre-line;font-size:14px;">${nachrichtHtml}</p>
<hr style="border:none;border-top:1px solid #eee;margin:28px 0;">
<p style="color:#999;font-size:11px;margin:0;">Erstellt mit <a href="https://sofortangebot.app" style="color:#999;">Sofortangebot</a></p>
</div></body></html>`,
      attachments,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Status aktualisieren. Audit 2026-08-31: ohne Fehlerprüfung blieb das
    // Angebot nach erfolgreichem Mailversand auf "Bereit" stehen — der
    // Handwerker hätte es ein zweites Mal verschickt.
    const { error: statusError } = await supabase.from('quotes').update({
      status: 'sent',
      gesendet_am: new Date().toISOString(),
      gesendet_via: 'email',
      empfaenger_email: to,
    }).eq('id', id)
    if (statusError) {
      console.error('[quotes/send] Status nach E-Mail-Versand nicht gespeichert')
      Sentry.captureException(new Error(statusError.message), { tags: { feature: 'quote_send_status' } })
    }

    return NextResponse.json({ ok: true, quoteNumber, zugferd: !!xmlAttachment })
  }

  // ── WhatsApp / Link: Status aktualisieren ─────────────────────────────────
  const { error: linkStatusError } = await supabase.from('quotes').update({
    status: 'sent',
    gesendet_am: new Date().toISOString(),
    gesendet_via: via,
    empfaenger_email: to || null,
  }).eq('id', id)
  if (linkStatusError) {
    console.error('[quotes/send] Status nach Link-/WhatsApp-Versand nicht gespeichert')
    Sentry.captureException(new Error(linkStatusError.message), { tags: { feature: 'quote_send_status' } })
  }

  return NextResponse.json({ ok: true, quoteNumber })
}
