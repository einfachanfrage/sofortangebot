import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import * as Sentry from '@sentry/nextjs'
import { sendAccountDeletedEmail } from '@/lib/email'
import { loeschungFaelligAm, LOESCH_FRIST_TAGE } from '@/lib/konto-loeschung'

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
    } catch {
      console.error('[account-delete] Stripe-Kündigung fehlgeschlagen')
    }
  }

  // Schritt 1 von 2: `deleted_at` setzen — das startet die 30-Tage-Frist aus
  // AGB § 6.5 (Daten vorhalten, Export, Wiederherstellung). Die eigentliche,
  // unwiderrufliche Löschung macht danach `api/cron/konto-purge`. Bis zum
  // 02.09.2026 gab es diesen zweiten Schritt nicht: das Konto blieb hier
  // stehen und ist nie gelöscht worden, obwohl die Bestätigungsmail und die
  // Datenschutzerklärung genau das zugesagt haben.
  const geloeschtAm = new Date()
  const { error: softDeleteFehler } = await service
    .from('companies')
    .update({ deleted_at: geloeschtAm.toISOString() })
    .eq('user_id', user.id)

  // Dieser Fehler lief bisher ungeprüft durch: schlug das Update fehl,
  // bekam der Nutzer trotzdem „ok" und eine Bestätigungsmail — und sein
  // Konto lief unverändert weiter. Ohne gesetztes `deleted_at` findet der
  // Aufräumjob es nie.
  if (softDeleteFehler) {
    console.error('[account-delete] Konto konnte nicht zur Löschung vorgemerkt werden')
    Sentry.captureException(new Error(softDeleteFehler.message), { tags: { feature: 'account_delete_soft' } })
    return NextResponse.json(
      { error: 'Dein Konto konnte gerade nicht gelöscht werden. Bitte versuch es noch einmal.' },
      { status: 500 },
    )
  }

  // Bestätigungs-E-Mail mit dem Datum, ab dem die Daten wirklich weg sind
  const loeschungAm = loeschungFaelligAm(geloeschtAm)
  await sendAccountDeletedEmail(user.email!, loeschungAm)

  // Nutzer ausloggen (Cookie löschen)
  await supabase.auth.signOut()

  return NextResponse.json({
    ok: true,
    frist_tage: LOESCH_FRIST_TAGE,
    loeschung_am: loeschungAm.toISOString(),
  })
}
