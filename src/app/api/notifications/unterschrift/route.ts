import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { renderToBuffer } from '@react-pdf/renderer'
import { createElement } from 'react'
import { createClient } from '@supabase/supabase-js'
import { AngebotPDF } from '@/lib/pdf'

// PDF-Generierung kann länger dauern
export const maxDuration = 60

const resend = new Resend(process.env.RESEND_API_KEY)

// Service-Role-Client: auth.admin.getUserById braucht Service Role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  // Nur intern aufrufbar — CRON_SECRET oder interner Aufruf von /api/sign
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { quoteId, signedBy } = await req.json()
  if (!quoteId) return NextResponse.json({ error: 'quoteId fehlt' }, { status: 400 })

  const { data: quote } = await supabaseAdmin
    .from('quotes')
    .select('*, items:quote_items(*), customer:customers(*), share_token')
    .eq('id', quoteId)
    .single()
  if (!quote) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  const { data: company } = await supabaseAdmin
    .from('companies')
    .select('*')
    .eq('id', quote.company_id)
    .single()
  if (!company) return NextResponse.json({ ok: true })

  // E-Mail-Adresse des Betriebsinhabers
  const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(company.user_id)
  const ownerEmail = user?.email
  if (!ownerEmail) return NextResponse.json({ ok: true })

  // Angebotsnummer bestimmen
  let quoteNumber = (quote as { quote_number?: string }).quote_number ?? ''
  if (!quoteNumber) {
    const { count } = await supabaseAdmin
      .from('quotes')
      .select('*', { count: 'exact', head: true })
      .eq('company_id', quote.company_id)
      .lte('created_at', quote.created_at)
    const year = new Date(quote.created_at).getFullYear()
    quoteNumber = `${year}-${String(count ?? 1).padStart(4, '0')}`
  }

  const totalGross = quote.total_gross.toFixed(2).replace('.', ',')
  const customerName = signedBy || quote.customer?.name || 'Kunde'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sofortangebot.app'
  const sortedItems = (quote.items ?? []).sort((a: { position: number }, b: { position: number }) => a.position - b.position)

  // PDF generieren
  let pdfBuffer: Buffer | null = null
  try {
    // @ts-expect-error react-pdf renderToBuffer typing mismatch
    const buf = await renderToBuffer(createElement(AngebotPDF, {
      quote: { ...quote, items: sortedItems },
      company,
      quoteNumber,
    }))
    pdfBuffer = Buffer.from(buf)
  } catch {
    // PDF-Fehler darf Benachrichtigung nicht blockieren
  }

  // Bestätigung an Kunden (mit PDF wenn vorhanden)
  const customerEmail = quote.customer?.email
  if (customerEmail) {
    await resend.emails.send({
      from: `${company.name} <angebot@sofortangebot.app>`,
      to: [customerEmail],
      subject: `Ihre Auftragsbestätigung – Angebot ${quoteNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #2C2C2C;">
          <div style="background: #2C2C2C; padding: 24px; border-radius: 8px 8px 0 0;">
            <span style="background: #F5C400; color: #2C2C2C; font-weight: 900; padding: 4px 12px; border-radius: 4px; font-size: 12px;">AUFTRAGSBESTÄTIGUNG</span>
          </div>
          <div style="background: white; padding: 32px; border: 1px solid #eee; border-top: 0; border-radius: 0 0 8px 8px;">
            <p style="font-size: 18px; font-weight: 900; margin: 0 0 12px;">Vielen Dank für Ihren Auftrag! 🤝</p>
            <p style="color: #555; margin: 0 0 8px;">Hallo ${customerName},</p>
            <p style="color: #555; margin: 0 0 20px;">Ihre Unterschrift für Angebot <strong>${quoteNumber}</strong> über <strong>${totalGross} €</strong> wurde erfolgreich übermittelt. ${pdfBuffer ? 'Ihr Exemplar des Angebots finden Sie im Anhang.' : ''}</p>
            <p style="color: #555; margin: 0 0 24px;">${company.name} wird sich in Kürze mit Ihnen in Verbindung setzen, um die nächsten Schritte zu besprechen.</p>
            <p style="color: #666; margin: 0;">Mit freundlichen Grüßen,<br><strong>${company.name}</strong></p>
          </div>
          <div style="padding: 16px 32px; border-top: 1px solid #eee; text-align: center;">
            <p style="color: #bbb; font-size: 11px; margin: 0;">Versendet über <a href="https://sofortangebot.app" style="color: #bbb;">sofortangebot.app</a> im Auftrag von ${company.name}</p>
          </div>
        </div>
      `,
      ...(pdfBuffer && {
        attachments: [{
          filename: `Auftragsbestaetigung-${quoteNumber}.pdf`,
          content: pdfBuffer,
        }],
      }),
    }).catch(() => {})
  }

  // Benachrichtigung an Handwerker
  await resend.emails.send({
    from: `sofortangebot <info@sofortangebot.app>`,
    to: [ownerEmail],
    subject: `✅ Angebot ${quoteNumber} wurde unterschrieben`,
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #2C2C2C;">
        <div style="background: #2C2C2C; padding: 24px; border-radius: 8px 8px 0 0;">
          <span style="background: #F5C400; color: #2C2C2C; font-weight: 900; padding: 4px 12px; border-radius: 4px; font-size: 12px;">UNTERSCHRIEBEN</span>
        </div>
        <div style="background: white; padding: 32px; border: 1px solid #eee; border-top: 0; border-radius: 0 0 8px 8px;">
          <p style="font-size: 18px; font-weight: 900; margin: 0 0 8px;">Angebot angenommen! 🎉</p>
          <p style="color: #666; margin: 0 0 24px;"><strong>${customerName}</strong> hat dein Angebot unterschrieben.</p>
          <div style="background: #F7F7F5; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #666; font-size: 13px;">Angebotsnummer</span>
              <strong>${quoteNumber}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #666; font-size: 13px;">Kunde</span>
              <strong>${customerName}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 2px solid #2C2C2C; padding-top: 8px; margin-top: 8px;">
              <span style="font-weight: 900;">Gesamtbetrag</span>
              <strong style="font-size: 18px;">${totalGross} €</strong>
            </div>
          </div>
          <a href="${appUrl}/angebot/${quoteId}" style="display: block; background: #F5C400; color: #2C2C2C; font-weight: 900; text-align: center; padding: 14px; border-radius: 8px; text-decoration: none; font-size: 15px;">
            Angebot ansehen →
          </a>
        </div>
      </div>
    `,
  })

  return NextResponse.json({ ok: true })
}
