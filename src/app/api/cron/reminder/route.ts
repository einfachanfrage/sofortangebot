import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  // Alle Firmen mit reminder_days holen
  const { data: companies } = await supabase
    .from('companies')
    .select('id, name, reminder_days, user_id')

  if (!companies?.length) return NextResponse.json({ sent: 0 })

  let sent = 0

  for (const company of companies) {
    const days = company.reminder_days ?? 3
    if (days === 0) continue // Erinnerung deaktiviert

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)

    // Offene Angebote die noch keine Erinnerung bekommen haben
    const { data: quotes } = await supabase
      .from('quotes')
      .select('id, total_gross, created_at, customer:customers(name, email)')
      .eq('company_id', company.id)
      .eq('status', 'sent')
      .is('reminder_sent_at', null)
      .lt('created_at', cutoff.toISOString())

    if (!quotes?.length) continue

    for (const quote of quotes) {
      const customer = quote.customer as { name: string; email: string | null } | null
      if (!customer?.email) continue

      const totalGross = quote.total_gross.toFixed(2).replace('.', ',')
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sofortangebot.de'

      const { error } = await resend.emails.send({
        from: `${company.name} <angebot@sofortangebot.de>`,
        to: [customer.email],
        subject: `Erinnerung: Ihr Angebot über ${totalGross} € wartet auf Ihre Bestätigung`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2C2C2C;">
            <div style="background: #2C2C2C; padding: 24px; border-radius: 8px 8px 0 0;">
              <span style="background: #F5C400; color: #2C2C2C; font-weight: 900; padding: 4px 12px; border-radius: 4px; font-size: 12px;">ERINNERUNG</span>
            </div>
            <div style="background: white; padding: 32px; border: 1px solid #eee; border-top: 0; border-radius: 0 0 8px 8px;">
              <p>Hallo ${customer.name},</p>
              <p>wir möchten Sie freundlich daran erinnern, dass unser Angebot über <strong>${totalGross} €</strong> noch auf Ihre Bestätigung wartet.</p>
              <p>Sie können das Angebot direkt online einsehen und unterschreiben:</p>
              <a href="${appUrl}/angebot/${quote.id}/unterschreiben"
                 style="display:inline-block;background:#F5C400;color:#2C2C2C;font-weight:900;padding:12px 24px;border-radius:8px;text-decoration:none;margin:8px 0;">
                Angebot jetzt ansehen →
              </a>
              <br><br>
              <p style="color: #666;">Mit freundlichen Grüßen,<br><strong>${company.name}</strong></p>
            </div>
          </div>
        `,
      })

      if (!error) {
        await supabase
          .from('quotes')
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq('id', quote.id)
        sent++
      }
    }
  }

  return NextResponse.json({ sent })
}
