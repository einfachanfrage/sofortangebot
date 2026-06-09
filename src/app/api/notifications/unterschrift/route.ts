import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { quoteId, signedBy } = await req.json()
  if (!quoteId) return NextResponse.json({ error: 'quoteId fehlt' }, { status: 400 })

  const { data: quote } = await supabase
    .from('quotes')
    .select('*, customer:customers(name, email)')
    .eq('id', quoteId)
    .single()
  if (!quote) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  const { data: company } = await supabase
    .from('companies')
    .select('name')
    .eq('id', quote.company_id)
    .single()
  if (!company) return NextResponse.json({ ok: true })

  // E-Mail-Adresse des Betriebsinhabers über user_id der company
  const { data: companyWithUser } = await supabase
    .from('companies')
    .select('user_id')
    .eq('id', quote.company_id)
    .single()
  if (!companyWithUser) return NextResponse.json({ ok: true })

  const { data: { user } } = await supabase.auth.admin.getUserById(companyWithUser.user_id)
  const ownerEmail = user?.email
  if (!ownerEmail) return NextResponse.json({ ok: true })

  const { count } = await supabase
    .from('quotes')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', quote.company_id)
    .lte('created_at', quote.created_at)

  const year = new Date(quote.created_at).getFullYear()
  const quoteNumber = `${year}-${String(count ?? 1).padStart(4, '0')}`
  const totalGross = quote.total_gross.toFixed(2).replace('.', ',')
  const customerName = signedBy || quote.customer?.name || 'Kunde'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.sofortangebot.app'

  // Bestätigung an Kunden senden (wenn E-Mail vorhanden)
  const customerEmail = quote.customer?.email
  if (customerEmail) {
    await resend.emails.send({
      from: `${company.name} <angebot@sofortangebot.de>`,
      to: [customerEmail],
      subject: `Ihre Auftragsbestätigung – Angebot ${quoteNumber}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #2C2C2C;">
          <div style="background: #2C2C2C; padding: 24px; border-radius: 8px 8px 0 0;">
            <span style="background: #F5C400; color: #2C2C2C; font-weight: 900; padding: 4px 12px; border-radius: 4px; font-size: 12px;">AUFTRAGSBESTÄTIGUNG</span>
          </div>
          <div style="background: white; padding: 32px; border: 1px solid #eee; border-top: 0; border-radius: 0 0 8px 8px;">
            <p>Hallo ${customerName},</p>
            <p>vielen Dank! Ihre Unterschrift wurde erfolgreich übermittelt. Wir haben Ihre Auftragsbestätigung für Angebot <strong>${quoteNumber}</strong> über <strong>${totalGross} €</strong> erhalten.</p>
            <p>Wir melden uns bei Ihnen, um die nächsten Schritte zu besprechen.</p>
            <br>
            <p style="color: #666;">Mit freundlichen Grüßen,<br><strong>${company.name}</strong></p>
          </div>
        </div>
      `,
    }).catch(() => {})
  }

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
