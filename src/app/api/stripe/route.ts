import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2026-05-27.dahlia' })

const PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER ?? '',
  pro: process.env.STRIPE_PRICE_PRO ?? '',
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { plan } = await req.json()
  if (!PRICE_IDS[plan as keyof typeof PRICE_IDS]) return NextResponse.json({ error: 'Ungültiger Plan' }, { status: 400 })

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [{ price: PRICE_IDS[plan as keyof typeof PRICE_IDS], quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`,
    // DC-045, beim Bauen gefunden: `/preise` ist im eingeloggten Bereich die
    // PREISDATENBANK des Handwerkers, nicht die Tarifseite. Wer den Kauf
    // abbrach, landete also in seinen eigenen Einheitspreisen. Zurück dahin,
    // wo er hergekommen ist.
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/einstellungen/abo`,
    customer_email: user.email ?? undefined,
    metadata: { user_id: user.id, plan },
    allow_promotion_codes: true,
    locale: 'de',
  })

  return NextResponse.json({ url: session.url })
}
