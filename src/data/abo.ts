import 'server-only'

import { requireCompany } from './auth'
import { PRICING } from '@/lib/pricing'
import { pruefeAngebotsLimit } from '@/lib/plan-limit'

// ── DC-045 (Product Designer, 06.09.2026) ─────────────────────────────────
//
// „Kein Zugang zur Abo-/Plan-Verwaltung nach dem Onboarding." Das
// Plan-Fenster wurde ausschließlich aus `?welcome=new` geöffnet — also
// einmalig, direkt nach frischem Onboarding. Wer den Moment verpasst hat
// oder später wechseln will, fand nichts: kein Plan-Wechsel, keine
// Rechnungshistorie, keine Zahlungsmethode.
//
// Zweiter Teil des Befundes, bewusst NICHT hier gelöst: Das beworbene
// Kontingent von 3 Angeboten pro Monat wird nirgends durchgesetzt. Ob es
// eine harte Grenze wird, eine Warnung oder gestrichen gehört, ist eine
// Geschäftsentscheidung und liegt bei Sandy. Diese Datei zählt deshalb nur
// und sperrt nichts — die Zahl sichtbar zu machen ist in jedem Fall richtig,
// eine Sperre einzubauen, die niemand beschlossen hat, wäre es nicht.

export interface AboStand {
  plan: 'starter' | 'pro'
  /** Ende der laufenden Abrechnungsperiode (nur bei Pro gesetzt). */
  laeuftBisISO: string | null
  /** Ist bei Stripe ein Kunde hinterlegt? Ohne das gibt es kein Portal. */
  hatStripeKonto: boolean
  /** In diesem Kalendermonat angelegte Angebote. */
  angeboteDiesenMonat: number
  /** Freikontingent laut Preisliste — im Starter-Plan die harte Grenze. */
  freikontingent: number
  /** Ist die Grenze erreicht? Dann sind neue Angebote gesperrt. */
  limitErreicht: boolean
}

export async function getAboStand(): Promise<AboStand> {
  const { supabase, company } = await requireCompany()

  const { data: firma } = await supabase.from('companies')
    .select('plan, plan_expires_at, stripe_customer_id')
    .eq('id', company.id).single()

  const plan = (firma?.plan ?? 'starter') === 'starter' ? 'starter' : 'pro'
  // Dieselbe Funktion, die auch sperrt. Eine Zahl, die der Nutzer sieht, und
  // eine andere, die ihn blockiert, wäre der schlimmste Ausgang — genau die
  // Sorte Widerspruch, die diese Woche mehrfach Geld gekostet hat.
  const limit = await pruefeAngebotsLimit(supabase, company.id, firma?.plan)

  return {
    plan,
    laeuftBisISO: (firma?.plan_expires_at as string | null) ?? null,
    hatStripeKonto: Boolean(firma?.stripe_customer_id),
    angeboteDiesenMonat: limit.anzahl,
    freikontingent: PRICING.freeAngeboteProMonat,
    limitErreicht: limit.erreicht,
  }
}
