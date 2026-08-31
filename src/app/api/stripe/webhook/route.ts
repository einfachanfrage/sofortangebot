import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { sendPaymentFailedEmail, sendCancellationEmail } from '@/lib/email'
import * as Sentry from '@sentry/nextjs'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2026-05-27.dahlia' })

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/** E-Mail-Adresse eines Stripe-Kunden nachschlagen */
async function getEmailForCustomer(customerId: string): Promise<string | null> {
  const supabase = getServiceClient()
  const { data } = await supabase
    .from('companies')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single()
  if (!data?.user_id) return null
  const { data: userData } = await supabase.auth.admin.getUserById(data.user_id)
  return userData?.user?.email ?? null
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
        // Audit 2026-08-31: Ohne Fehlerprüfung hätte der Kunde bezahlt, ohne
        // seinen Tarif zu bekommen — und niemand hätte davon erfahren.
        const { error: planError } = await supabase.from('companies').update({
          plan,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
        }).eq('user_id', userId)
        if (planError) {
          console.error('[stripe] Tarif nach Zahlung nicht gespeichert')
          Sentry.captureException(new Error(planError.message), { tags: { feature: 'stripe_plan_update' } })
          // 500 → Stripe stellt den Webhook erneut zu, statt ihn als erledigt
          // abzuhaken. Genau dafür sind die Wiederholungen da.
          return NextResponse.json({ error: 'Tarif konnte nicht gespeichert werden' }, { status: 500 })
        }
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

    // ── Abo gekündigt / abgelaufen → Downgrade + E-Mail ──────
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const customerId = sub.customer as string
      await downgradeToStarter(customerId)
      // Kündigungsbestätigung senden
      const subAny = sub as unknown as { current_period_end?: number }
      const ablaufdatum = subAny.current_period_end
        ? new Date(subAny.current_period_end * 1000).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : '–'
      const email = await getEmailForCustomer(customerId)
      if (email) sendCancellationEmail(email, ablaufdatum).catch(() => {
        console.error('[stripe-webhook] Kündigungs-E-Mail fehlgeschlagen')
      })
      break
    }

    // ── Zahlung fehlgeschlagen → Downgrade + E-Mail ───────────
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = typeof invoice.customer === 'string' ? invoice.customer : null
      if (customerId && (invoice.attempt_count ?? 0) > 1) {
        await downgradeToStarter(customerId)
      }
      // E-Mail bei jedem Fehlschlag (nicht nur beim letzten)
      if (customerId) {
        const email = await getEmailForCustomer(customerId)
        if (email) sendPaymentFailedEmail(email).catch(() => {
          console.error('[stripe-webhook] Zahlungswarnung fehlgeschlagen')
        })
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
