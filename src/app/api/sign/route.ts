/**
 * Punkt 1 + 2 + 5: Server-seitige Unterschrift
 * - Umgeht RLS-Problem (Service Role Key)
 * - Validiert über share_token (nicht UUID — Punkt 2)
 * - Loggt IP-Adresse für rechtlichen Nachweis (Punkt 5)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/nextjs'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { shareToken, signedBy, signatureDataUrl } = await req.json()

  if (typeof shareToken !== 'string' || typeof signedBy !== 'string' || typeof signatureDataUrl !== 'string') {
    return NextResponse.json({ error: 'Fehlende Parameter' }, { status: 400 })
  }
  if (shareToken.length > 100 || !signedBy.trim() || signedBy.trim().length > 120) {
    return NextResponse.json({ error: 'Ungültige Parameter' }, { status: 400 })
  }
  const signatureMatch = signatureDataUrl.match(/^data:image\/png;base64,([A-Za-z0-9+/]+={0,2})$/)
  if (!signatureMatch) {
    return NextResponse.json({ error: 'Ungültiges Unterschriftsformat' }, { status: 400 })
  }
  const base64 = signatureMatch[1]
  if (base64.length > 1_500_000) {
    return NextResponse.json({ error: 'Unterschrift zu groß' }, { status: 413 })
  }

  // Angebot per share_token laden (NICHT per UUID — sicherer)
  const { data: quote } = await supabaseAdmin
    .from('quotes')
    .select('id, company_id, status, total_gross, created_at, customer:customers(name, email)')
    .eq('share_token', shareToken)
    .eq('status', 'sent')
    .single()

  if (!quote) {
    return NextResponse.json({ error: 'Angebot nicht gefunden oder bereits unterschrieben' }, { status: 404 })
  }

  // IP-Adresse aus Request-Headers (Vercel-spezifisch)
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unbekannt'

  // Unterschrift-PNG aus DataURL → Buffer
  const sigBuffer = Buffer.from(base64, 'base64')
  const filePath = `signatures/${quote.id}.png`

  let signaturePath: string | null = null
  const { error: uploadError } = await supabaseAdmin.storage
    .from('quote-signatures')
    .upload(filePath, sigBuffer, { upsert: true, contentType: 'image/png' })

  if (!uploadError) {
    // Pfad speichern — Signed URL wird on-demand über /api/quotes/[id]/signature generiert
    signaturePath = filePath
  }

  // Angebot aktualisieren — mit IP für rechtlichen Nachweis
  // Audit 2026-08-31: Dieser Schreibvorgang lief ohne Fehlerprüfung. Schlug er
  // fehl, sah der Kunde trotzdem "Danke, unterschrieben", das Angebot stand
  // aber weiter auf "Beim Kunden" — die Zusage wäre spurlos verloren gewesen.
  // Der Fehler MUSS hier sichtbar werden, nicht später beim Nachfragen.
  const { error: signError } = await supabaseAdmin.from('quotes').update({
    status: 'accepted',
    signed_at: new Date().toISOString(),
    signed_by: signedBy.trim(),
    signer_ip: ip,
    ...(signaturePath && { signature_url: signaturePath }),
  }).eq('id', quote.id)
  if (signError) {
    console.error('[sign] Unterschrift konnte nicht gespeichert werden')
    Sentry.captureException(new Error(signError.message), { tags: { feature: 'angebot_unterschrift' } })
    return NextResponse.json(
      { error: 'Die Unterschrift konnte nicht gespeichert werden. Bitte versuche es noch einmal.' },
      { status: 500 },
    )
  }

  // Handwerker + Kunde benachrichtigen (intern, mit Secret gesichert)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sofortangebot.app'
  const cronSecret = process.env.CRON_SECRET

  // 2026-09-02: Fehlt CRON_SECRET, wurde dieser Block bisher einfach
  // übersprungen — der Kunde unterschrieb, und der Handwerker erfuhr nie
  // davon. Kein Fehler, keine Spur, nur eine Benachrichtigung, die es nie
  // gab. Dieselbe fehlende Konfiguration legt auch die beiden Cron-Jobs
  // still. Eine ausgefallene Benachrichtigung über einen ANGENOMMENEN
  // Auftrag ist das Teuerste, was hier lautlos schiefgehen kann.
  if (!cronSecret) {
    console.error('[sign] CRON_SECRET fehlt — Handwerker wird über die Unterschrift NICHT benachrichtigt')
    Sentry.captureException(
      new Error('CRON_SECRET nicht gesetzt: Benachrichtigung über Unterschrift entfällt'),
      { level: 'fatal', tags: { feature: 'cron_konfiguration' } },
    )
  } else {
    fetch(`${appUrl}/api/notifications/unterschrift`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cronSecret}`,
      },
      body: JSON.stringify({ quoteId: quote.id, signedBy: signedBy.trim() }),
    }).catch(fehler => {
      // Auch der Fehlschlag war bisher stumm.
      console.error('[sign] Benachrichtigung über Unterschrift fehlgeschlagen')
      Sentry.captureException(fehler instanceof Error ? fehler : new Error(String(fehler)), {
        tags: { feature: 'unterschrift_benachrichtigung' },
      })
    })
  }

  return NextResponse.json({ ok: true })
}
