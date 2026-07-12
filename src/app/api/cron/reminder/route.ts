import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Cron kann bei vielen Nutzern lange laufen
export const maxDuration = 300

const resend = new Resend(process.env.RESEND_API_KEY)

// Service Role — kein Auth-Context in Cron-Jobs
function getSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sofortangebot.app'

  // Alle Firmen mit aktiviertem Reminder in einer Query holen
  const { data: companies } = await supabase
    .from('companies')
    .select('id, name, reminder_days')
    .gt('reminder_days', 0) // reminder_days = 0 → deaktiviert, direkt filtern

  if (!companies?.length) return NextResponse.json({ sent: 0 })

  // Für jede Firma parallel die fälligen Angebote laden und E-Mails senden
  const results = await Promise.allSettled(
    companies.map(company => processCompany(supabase, company, appUrl))
  )

  const sent = results.reduce((sum, r) => sum + (r.status === 'fulfilled' ? r.value : 0), 0)
  const errors = results.filter(r => r.status === 'rejected').length

  return NextResponse.json({ sent, errors, companies: companies.length })
}

async function processCompany(
  supabase: ReturnType<typeof getSupabase>,
  company: { id: string; name: string; reminder_days: number },
  appUrl: string
): Promise<number> {
  const days = company.reminder_days ?? 3
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  // WICHTIG (Abrechnungs-Modus): Dies ist ein ANGEBOTS-Nachfass (Status 'sent',
  // vor der Rechnung) — kein Zahlungs-Mahnwesen. Läuft daher bewusst in BEIDEN
  // Modi ('inapp' und 'extern'), weil Buchhaltungstools Angebots-Nachfassen nicht
  // abdecken. Eine spätere Zahlungs-Erinnerung (bei In-App-Rechnung) MUSS dagegen
  // auf abrechnungs_modus === 'inapp' gaten, sonst Doppel-Mahnung in Modus 'extern'.

  // Offene Angebote mit Kunden-E-Mail, noch ohne Erinnerung
  const { data: quotes } = await supabase
    .from('quotes')
    .select('id, total_gross, created_at, share_token, customer:customers(name, email)')
    .eq('company_id', company.id)
    .eq('status', 'sent')
    .is('reminder_sent_at', null)
    .lt('created_at', cutoff.toISOString())

  if (!quotes?.length) return 0

  // Angebote dieser Firma parallel versenden
  const emailResults = await Promise.allSettled(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    quotes.map((quote: any) => sendReminder(supabase, quote, company, appUrl))
  )

  return emailResults.filter(r => r.status === 'fulfilled' && r.value).length
}

async function sendReminder(
  supabase: ReturnType<typeof getSupabase>,
  quote: {
    id: string
    total_gross: number
    created_at: string
    share_token: string | null
    customer: { name: string; email: string | null } | null
  },
  company: { id: string; name: string },
  appUrl: string
): Promise<boolean> {
  const customer = quote.customer as { name: string; email: string | null } | null
  if (!customer?.email) return false

  const totalGross = quote.total_gross.toFixed(2).replace('.', ',')
  // Share-Token für Signing-Link verwenden (nicht UUID)
  const signingLink = `${appUrl}/angebot/${quote.share_token ?? quote.id}/unterschreiben`

  const { error } = await resend.emails.send({
    from: `${company.name} <angebot@sofortangebot.app>`,
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
          <a href="${signingLink}"
             style="display:inline-block;background:#F5C400;color:#2C2C2C;font-weight:900;padding:12px 24px;border-radius:8px;text-decoration:none;margin:8px 0;">
            Angebot jetzt ansehen →
          </a>
          <br><br>
          <p style="color: #666;">Mit freundlichen Grüßen,<br><strong>${company.name}</strong></p>
        </div>
        <div style="padding: 16px 32px; border-top: 1px solid #eee; text-align: center;">
          <p style="color: #bbb; font-size: 11px; margin: 0;">Versendet über <a href="https://sofortangebot.app" style="color: #bbb;">sofortangebot.app</a> im Auftrag von ${company.name}</p>
        </div>
      </div>
    `,
  })

  if (error) return false

  await supabase
    .from('quotes')
    .update({ reminder_sent_at: new Date().toISOString() })
    .eq('id', quote.id)

  return true
}
