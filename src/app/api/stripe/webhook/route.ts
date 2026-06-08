import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2026-05-27.dahlia' })

// Service-Role für Webhook (kein Auth-Context)
function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') ?? ''

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? '')
  } catch {
    return NextResponse.json({ error: 'Webhook-Signatur ungültig' }, { status: 400 })
  }

  const supabase = getServiceClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id
    const plan = session.metadata?.plan ?? 'pro'
    const customerId = typeof session.customer === 'string' ? session.customer : null
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null

    if (userId) {
      await supabase.from('companies').update({
        plan,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
      }).eq('user_id', userId)
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const customerId = sub.customer as string
    // Abo-Status prüfen
    if (sub.status === 'active' || sub.status === 'trialing') {
      await supabase.from('companies')
        .update({ plan: 'pro', stripe_subscription_id: sub.id })
        .eq('stripe_customer_id', customerId)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    const customerId = sub.customer as string

    // Downgrade auf Starter wenn Abo endet
    await supabase.from('companies')
      .update({ plan: 'starter', stripe_subscription_id: null })
      .eq('stripe_customer_id', customerId)
  }

  return NextResponse.json({ received: true })
}
