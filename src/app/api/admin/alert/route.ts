import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_ALERT_EMAIL ?? 'sandraholm95@gmail.com'

// Interne Secret-Prüfung — nur Supabase-Trigger dürfen diesen Endpoint aufrufen
const ALERT_SECRET = process.env.ALERT_SECRET ?? ''

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-alert-secret')
  if (ALERT_SECRET && secret !== ALERT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { typ, user_id, tageskosten } = body

  if (typ === 'kosten_spike') {
    const kostenFormatiert = typeof tageskosten === 'number'
      ? tageskosten.toFixed(2).replace('.', ',')
      : '?'

    const { error } = await resend.emails.send({
      from: 'Sofortangebot Monitoring <monitoring@sofortangebot.app>',
      to: [ADMIN_EMAIL],
      subject: `⚠️ Kosten-Spike: ${kostenFormatiert} € KI-Kosten heute`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #2C2C2C;">
          <h2 style="color: #dc2626;">⚠️ KI-Kosten-Spike erkannt</h2>
          <p>Ein Nutzer hat heute ungewöhnlich hohe KI-Kosten verursacht.</p>
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Nutzer-ID</td>
              <td style="padding: 8px; border: 1px solid #eee;">${user_id}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Tageskosten</td>
              <td style="padding: 8px; border: 1px solid #eee; color: #dc2626; font-weight: bold;">${kostenFormatiert} €</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #eee; font-weight: bold;">Zeitpunkt</td>
              <td style="padding: 8px; border: 1px solid #eee;">${new Date().toLocaleString('de-DE')}</td>
            </tr>
          </table>
          <p style="margin-top: 16px; color: #666;">
            Prüfe die ki_usage Tabelle in Supabase für Details.<br>
            Das KI-Tagesbudget des Nutzers beträgt standardmäßig 2,00 €.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('[Admin Alert] E-Mail Fehler:', error)
      return NextResponse.json({ error: 'E-Mail konnte nicht gesendet werden' }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true })
}
