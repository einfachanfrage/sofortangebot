import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2026-05-27.dahlia' })

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/** Downgrade auf Starter — bei Kündigung, Zahlungsausfall, etc. */
async function downgradeToStarter(customerId: string) {
  const supabase = getServiceClient()
  await supabase
    .from('companies')
    .update({ plan: 'starter', stripe_subscription_id: null, plan_expires_at: null })
    .eq('stripe_customer_id', customerId)
}

/** Upgrade/Bestätigung auf Pro */
async function upgradeToProUntil(customerId: string, subscriptionId: string, periodEnd: number | null) {
  const supabase = getServiceClient()
  await supabase
    .from('companies')
    .update({
      plan: 'pro',
      stripe_subscription_id: subscriptionId,
      plan_expires_at: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    })
    .eq('stripe_customer_id', customerId)
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

  switch (event.type) {
    // ── Checkout abgeschlossen → Plan aktivieren ──────────────
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const plan = session.metadata?.plan ?? 'pro'
      const customerId = typeof session.customer === 'string' ? session.customer : null
      const subscriptionId = typeof session.subscription === 'string' ? session.subscription : null

      if (userId && customerId) {
        await supabase.from('companies').update({
          plan,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
        }).eq('user_id', userId)
      }
      break
    }

    // ── Abo aktualisiert → Status auswerten ───────────────────
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string

      if (sub.status === 'active' || sub.status === 'trialing') {
        // Pro aktiv — Ablaufdatum aus current_period_end speichern
        await upgradeToProUntil(customerId, sub.id, (sub as unknown as { current_period_end: number }).current_period_end)
      } else if (
        sub.status === 'past_due' ||
        sub.status === 'incomplete' ||
        sub.status === 'incomplete_expired' ||
        sub.status === 'unpaid' ||
        sub.status === 'paused'
      ) {
        // Zahlung fehlgeschlagen / ausgesetzt → sofort downgraden
        await downgradeToStarter(customerId)
      }
      // 'canceled' wird über customer.subscription.deleted behandelt
      break
    }

    // ── Abo gekündigt / abgelaufen → Downgrade ────────────────
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      await downgradeToStarter(sub.customer as string)
      break
    }

    // ── Zahlung fehlgeschlagen → Downgrade ────────────────────
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : null
      // Nur downgraden wenn das Abo nicht mehr recoverable ist (attempt_count > 1)
      if (customerId && (invoice.attempt_count ?? 0) > 1) {
        await downgradeToStarter(customerId)
      }
      break
    }

    // ── Zahlung erfolgreich → Pro bestätigen ──────────────────
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : null
      const invoiceAny = invoice as unknown as { subscription: string | null }
      const subscriptionId = typeof invoiceAny.subscription === 'string' ? invoiceAny.subscription : null

      if (customerId && subscriptionId && invoice.billing_reason !== 'subscription_create') {
        // Verlängerung → Plan-Ablaufdatum aktualisieren
        const sub = await stripe.subscriptions.retrieve(subscriptionId)
        await upgradeToProUntil(customerId, subscriptionId, (sub as unknown as { current_period_end: number }).current_period_end)
      }
      break
    }

    default:
      // Unbekannte Events ignorieren
      break
  }

  return NextResponse.json({ received: true })
}
