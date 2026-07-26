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
  await supabaseAdmin.from('quotes').update({
    status: 'accepted',
    signed_at: new Date().toISOString(),
    signed_by: signedBy.trim(),
    signer_ip: ip,
    ...(signaturePath && { signature_url: signaturePath }),
  }).eq('id', quote.id)

  // Handwerker + Kunde benachrichtigen (intern, mit Secret gesichert)
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://sofortangebot.app'
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    fetch(`${appUrl}/api/notifications/unterschrift`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cronSecret}`,
      },
      body: JSON.stringify({ quoteId: quote.id, signedBy: signedBy.trim() }),
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
