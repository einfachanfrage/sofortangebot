import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import * as Sentry from '@sentry/nextjs'

// ── CoS-P-007 (Platform & Integrations Engineer, 2026-09-06) ──────────────
//
// Neues Preismodell (docs/preismodell.md, Sandys Entscheidung 03.09.2026):
// EIN bezahlter Tarif, 49 €/Monat, unbegrenzt Angebote, monatlich kündbar.
// Kein Jahresabo zum Launch — deshalb nimmt diese Route bewusst KEINEN
// Plan-Parameter vom Client mehr entgegen. Es gibt nichts auszuwählen; was
// hier ankommt, ist immer derselbe eine Preis. Ein Jahresabo einzuführen
// bedeutet später, hier bewusst einen neuen Zweig hinzuzufügen — nicht,
// dass der Client heimlich einen anderen Preis anfordern könnte.
//
// Gründerpreis (29 €/Monat, dauerhaft, erste 25 zahlende Betriebe): Die
// Zählung, WER den Gründerpreis bekommt, ist rein lesend an dieser Stelle
// (`select count(*) ... where founder_slot is not null`) — sie entscheidet
// nur, welcher Preis in DIESER Checkout-Session verwendet wird. Serverseitig
// endgültig vergeben (geschrieben in `companies.founder_slot`) wird der Slot
// erst im Webhook bei `checkout.session.completed`, also erst wenn wirklich
// bezahlt wurde — ein abgebrochener Checkout verbraucht dadurch keinen der
// 25 Plätze. Siehe `claim_founder_slot()` (Migration
// add_pricing_v2_trial_and_founder_slot) und stripe/webhook/route.ts.
//
// Testphase (14 Tage, ohne Kreditkarte, keine stille Umwandlung): Diese
// Route hat damit nichts zu tun. Die Testphase läuft komplett ohne Stripe —
// `companies.trial_ends_at` wird beim Registrieren gesetzt (Spalten-Default
// `now() + 14 Tage`), niemand legt dafür eine Zahlungsmethode ab. Stripe
// kommt erst in dem Moment ins Spiel, in dem der Nutzer hier aktiv auf
// „Jetzt abonnieren" klickt — genau die aktive Entscheidung, die
// `docs/preismodell.md` verlangt. Deshalb auch kein `trial_period_days` in
// der Checkout-Session: Die eigentliche Testphase ist zu diesem Zeitpunkt
// bereits vorbei oder wird bewusst vorzeitig beendet: Zahlung erfolgt sofort
// bei Abschluss dieses Checkouts, nie im Hintergrund.
//
// L7 / Kündigen-Weg: Bereits über stripe/portal/route.ts (Stripes eigenes
// Billing Portal) gelöst — siehe Nachtrag zu CoS-P-007 in
// docs/chief-of-staff-platform-todos.md. Diese Route setzt das nicht neu um.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', { apiVersion: '2026-05-27.dahlia' })

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data: company } = await supabase
    .from('companies')
    .select('id, plan, stripe_customer_id, is_founder_price')
    .eq('user_id', user.id)
    .single()

  if (!company) return NextResponse.json({ error: 'Kein Betrieb gefunden' }, { status: 404 })

  // Wer schon zahlt, braucht keinen neuen Checkout — Plan-/Zahlungsverwaltung
  // läuft für bestehende Abos ausschließlich über das Billing Portal
  // (stripe/portal/route.ts), nicht über einen zweiten Checkout.
  if (company.plan === 'pro') {
    return NextResponse.json({ error: 'Es besteht bereits ein aktives Abo' }, { status: 409 })
  }

  const standardPriceId = process.env.STRIPE_PRICE_STANDARD ?? ''
  const founderPriceId = process.env.STRIPE_PRICE_FOUNDER ?? ''
  if (!standardPriceId || !founderPriceId) {
    return NextResponse.json({ error: 'Preise sind noch nicht konfiguriert' }, { status: 500 })
  }

  const service = getServiceClient()
  let priceTier: 'founder' | 'standard'

  if (company.is_founder_price) {
    // Wiederkehrender Fall: Betrieb hatte den Gründerpreis schon einmal
    // (z. B. gekündigt und startet jetzt neu). Der Slot ist dauerhaft
    // seiner — „Bestandsschutz" gilt auch beim Wiedereinstieg, unabhängig
    // davon, ob die 25 Plätze inzwischen anderweitig voll sind.
    priceTier = 'founder'
  } else {
    // Nur eine Einschätzung für DIESE Checkout-Session — die endgültige,
    // serverseitige Vergabe passiert erst im Webhook nach erfolgreicher
    // Zahlung (claim_founder_slot). Zwei Betriebe, die im selben Moment
    // checken, könnten hier theoretisch beide „Gründerpreis" sehen; das ist
    // bei der tatsächlichen Größenordnung dieses Produkts kein reales
    // Risiko, und selbst falls es einträte, entscheidet claim_founder_slot()
    // beim Webhook verbindlich und fair (wer zuerst zahlt, bekommt den Slot).
    const { count: vergebeneSlots } = await service
      .from('companies')
      .select('id', { count: 'exact', head: true })
      .not('founder_slot', 'is', null)

    priceTier = (vergebeneSlots ?? 0) < 25 ? 'founder' : 'standard'
  }
  const priceId = priceTier === 'founder' ? founderPriceId : standardPriceId

  // Stripe erlaubt `customer` und `customer_email` nicht gleichzeitig —
  // nur beim allerersten Checkout (noch kein Stripe-Kunde) wird die E-Mail
  // übergeben, danach immer der bestehende Kunde.
  const kundenFeld = company.stripe_customer_id
    ? { customer: company.stripe_customer_id }
    : { customer_email: user.email ?? undefined }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/einstellungen/abo?abo=aktiv`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/einstellungen/abo`,
      ...kundenFeld,
      metadata: { user_id: user.id, company_id: company.id, price_tier: priceTier },
      subscription_data: {
        metadata: { user_id: user.id, company_id: company.id, price_tier: priceTier },
      },
      locale: 'de',
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    // Revenue-kritischer Pfad — ohne dieses Fangnetz hätte ein Stripe-Fehler
    // hier (z. B. ungültige Preis-ID) einen zahlungsbereiten Kunden einfach
    // mit einem 500er stehen gelassen, ohne dass wir es bemerken.
    console.error('[stripe-checkout] Checkout-Session konnte nicht erstellt werden')
    Sentry.captureException(error, { tags: { feature: 'stripe_checkout' } })
    return NextResponse.json({ error: 'Checkout ist gerade nicht erreichbar. Bitte später erneut versuchen.' }, { status: 500 })
  }
}
