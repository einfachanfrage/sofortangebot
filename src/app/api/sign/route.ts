/**
 * Punkt 1 + 2 + 5: Server-seitige Unterschrift
 * - Umgeht RLS-Problem (Service Role Key)
 * - Validiert über share_token (nicht UUID — Punkt 2)
 * - Loggt IP-Adresse für rechtlichen Nachweis (Punkt 5)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { shareToken, signedBy, signatureDataUrl } = await req.json()

  if (!shareToken || !signedBy || !signatureDataUrl) {
    return NextResponse.json({ error: 'Fehlende Parameter' }, { status: 400 })
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
  const base64 = signatureDataUrl.replace(/^data:image\/png;base64,/, '')
  const sigBuffer = Buffer.from(base64, 'base64')
  const filePath = `signatures/${quote.id}.png`

  let signatureUrl: string | null = null
  const { error: uploadError } = await supabaseAdmin.storage
    .from('quote-signatures')
    .upload(filePath, sigBuffer, { upsert: true, contentType: 'image/png' })

  if (!uploadError) {
    // Privater Bucket — Signed URL mit 10 Jahren Gültigkeit (für rechtliche Dokumentation)
    const { data } = await supabaseAdmin.storage
      .from('quote-signatures')
      .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10)
    signatureUrl = data?.signedUrl ?? null
  }

  // Angebot aktualisieren — mit IP für rechtlichen Nachweis
  await supabaseAdmin.from('quotes').update({
    status: 'accepted',
    signed_at: new Date().toISOString(),
    signed_by: signedBy,
    signer_ip: ip,
    ...(signatureUrl && { signature_url: signatureUrl }),
  }).eq('id', quote.id)

  // Handwerker + Kunde benachrichtigen (intern, mit Secret gesichert)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sofortangebot.app'
  const cronSecret = process.env.CRON_SECRET ?? ''
  fetch(`${appUrl}/api/notifications/unterschrift`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cronSecret}`,
    },
    body: JSON.stringify({ quoteId: quote.id, signedBy }),
  }).catch(() => {})

  return NextResponse.json({ ok: true })
}
