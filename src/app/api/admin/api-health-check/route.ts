import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { testLexofficeAPI } from '@/lib/api-health/lexoffice'
import { testSevdeskAPI } from '@/lib/api-health/sevdesk'
import { testOpenAIAPI } from '@/lib/api-health/openai'
import type { ApiHealthResult } from '@/lib/api-health/lexoffice'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_ALERT_EMAIL ?? 'sandraholm95@gmail.com'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-alert-secret')
  const alertSecret = process.env.ALERT_SECRET
  const hasValidInternalSecret = !!alertSecret && secret === alertSecret

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = !!user && !!process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL

  if (!hasValidInternalSecret && !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const service = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const now = new Date().toISOString()
  const ergebnisse: { anbieter: string; ok: boolean; version?: string; fehler?: string }[] = []

  async function saveAndAlert(anbieter: string, result: ApiHealthResult) {
    ergebnisse.push({ anbieter, ...result })

    await service.from('api_versionen').update({
      status: result.ok ? 'ok' : 'fehler',
      letzter_test: now,
      ...(result.ok && { letzter_erfolgreicher_test: now, aktuelle_version: result.version }),
      ...(!result.ok && { letzter_fehler: result.fehler, letzter_fehler_am: now }),
    }).eq('anbieter', anbieter)

    if (!result.ok) {
      await resend.emails.send({
        from: 'Sofortangebot Monitoring <monitoring@sofortangebot.app>',
        to: [ADMIN_EMAIL],
        subject: `🚨 API-Fehler: ${anbieter}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;color:#2C2C2C">
            <h2 style="color:#dc2626">🚨 API-Fehler: ${anbieter}</h2>
            <p>Die <strong>${anbieter}</strong>-API antwortet nicht mehr korrekt.</p>
            <table style="border-collapse:collapse;width:100%">
              <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Fehler</td><td style="padding:8px;border:1px solid #eee;color:#dc2626">${result.fehler}</td></tr>
              <tr><td style="padding:8px;border:1px solid #eee;font-weight:bold">Zeitpunkt</td><td style="padding:8px;border:1px solid #eee">${new Date().toLocaleString('de-DE')}</td></tr>
            </table>
            <p style="margin-top:16px">Prüfe:<br>
            1. Ist die API des Anbieters down? → Status-Seite prüfen<br>
            2. Hat sich die API-Version geändert? → ${anbieter} Changelog prüfen<br>
            3. Ist der Test-API-Key noch gültig?</p>
            <p>Alle Nutzer mit ${anbieter}-Integration sind betroffen.</p>
          </div>
        `,
      }).catch(() => {
        console.error('[api-health-check] Warn-E-Mail fehlgeschlagen')
      })
    }
  }

  // Lexoffice testen (falls Test-Key vorhanden)
  const lexofficeKey = process.env.LEXOFFICE_TEST_API_KEY
  if (lexofficeKey) {
    await saveAndAlert('lexoffice', await testLexofficeAPI(lexofficeKey))
  }

  // sevDesk testen
  const sevdeskKey = process.env.SEVDESK_TEST_API_KEY
  if (sevdeskKey) {
    await saveAndAlert('sevdesk', await testSevdeskAPI(sevdeskKey))
  }

  // OpenAI immer testen
  await saveAndAlert('openai', await testOpenAIAPI())

  return NextResponse.json({ ergebnisse, getestet_am: now })
}
