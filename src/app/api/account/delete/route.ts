import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { sendAccountDeletedEmail } from '@/lib/email'

export const maxDuration = 30

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const service = getServiceClient()

  // Company holen — brauchen wir für Stripe und E-Mail
  const { data: company } = await service
    .from('companies')
    .select('id, stripe_subscription_id, stripe_customer_id, name')
    .eq('user_id', user.id)
    .single()

  // Stripe-Abo canceln
  if (company?.stripe_subscription_id) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2026-05-27.dahlia' })
      await stripe.subscriptions.cancel(company.stripe_subscription_id)
    } catch (e) {
      console.error('[AccountDelete] Stripe cancel error:', e)
    }
  }

  // Soft-Delete: companies.deleted_at setzen
  await service
    .from('companies')
    .update({ deleted_at: new Date().toISOString() })
    .eq('user_id', user.id)

  // Bestätigungs-E-Mail senden
  await sendAccountDeletedEmail(user.email!)

  // Nutzer ausloggen (Cookie löschen)
  await supabase.auth.signOut()

  return NextResponse.json({ ok: true })
}
