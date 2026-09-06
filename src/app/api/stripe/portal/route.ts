import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

// ── DC-045 (Product Designer, 06.09.2026) ─────────────────────────────────
//
// Rechnungshistorie, Zahlungsmethode und Kündigung waren aus dem Produkt
// heraus nicht erreichbar. Statt das alles selbst zu bauen, öffnet diese
// Route Stripes eigenes Kundenportal — dort sind Rechnungen, Zahlungsart,
// Plan-Wechsel und Kündigung bereits rechtssicher und auf Deutsch enthalten.
//
// Bewusst kein eigener Kündigen-Knopf im Produkt: Ein zweiter Weg, ein Abo
// zu beenden, wäre ein zweiter Zustand, den wir mit Stripe synchron halten
// müssten. Der Webhook ist die eine Quelle, das Portal der eine Weg.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2026-05-27.dahlia' })

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data: company } = await supabase
    .from('companies')
    .select('stripe_customer_id')
    .eq('user_id', user.id)
    .single()

  const customerId = company?.stripe_customer_id as string | null | undefined
  if (!customerId) {
    // Kein Stripe-Kunde: Es gab nie eine Zahlung. Das ist kein Fehler,
    // sondern der Normalfall im Starter-Plan — die Oberfläche zeigt dann
    // „Auf Pro upgraden" statt „Abo verwalten".
    return NextResponse.json({ error: 'Noch kein Abo vorhanden' }, { status: 404 })
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/einstellungen/abo`,
    locale: 'de',
  })

  return NextResponse.json({ url: session.url })
}
