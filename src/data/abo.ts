import 'server-only'

import { requireCompany } from './auth'
import { pruefeAngebotsSperre, zaehleNeueAngeboteDiesenMonat } from '@/lib/plan-limit'

// ── DC-045 (Product Designer, 06.09.2026) ─────────────────────────────────
//
// „Kein Zugang zur Abo-/Plan-Verwaltung nach dem Onboarding." Das
// Plan-Fenster wurde ausschließlich aus `?welcome=new` geöffnet — also
// einmalig, direkt nach frischem Onboarding. Wer den Moment verpasst hat
// oder später wechseln will, fand nichts: kein Plan-Wechsel, keine
// Rechnungshistorie, keine Zahlungsmethode.
//
// Zweiter Teil des Befundes, damals offen gelassen: Ob das Kontingent von 3
// Angeboten pro Monat eine harte Grenze wird, eine Warnung oder gestrichen
// gehört, war eine Geschäftsentscheidung und lag bei Sandy.
//
// CoS-038-B (23.09.2026): Sie ist gefallen — gestrichen. Es gibt kein
// Kontingent mehr, sondern 14 Testtage und danach das Abo. Diese Datei zeigt
// deshalb den Stand der Testphase an und nicht mehr „X von 3". Die Zählung
// der Angebote bleibt als Auskunft stehen, ohne Grenze dahinter.

export interface AboStand {
  plan: 'starter' | 'pro'
  /** Ende der laufenden Abrechnungsperiode (nur bei Pro gesetzt). */
  laeuftBisISO: string | null
  /** Ist bei Stripe ein Kunde hinterlegt? Ohne das gibt es kein Portal. */
  hatStripeKonto: boolean
  /** In diesem Kalendermonat angelegte Angebote. Reine Auskunft, keine Grenze. */
  angeboteDiesenMonat: number
  /**
   * CoS-038-B: Ende der 14-Tage-Testphase (`companies.trial_ends_at`).
   * null = Pro oder Bestandskonto ohne Testphase.
   */
  testEndeISO: string | null
  /** Volle Tage bis zum Ende der Testphase; negativ = abgelaufen, null = keine. */
  testTageRestlich: number | null
  /** Ist das Anlegen neuer Angebote gesperrt? */
  gesperrt: boolean
  /**
   * CoS-038-A (23.09.2026): Zahlt dieser Betrieb den Gründerpreis?
   *
   * Ohne dieses Feld konnte die Abo-Seite nur EINE Zahl anzeigen — und zeigte
   * damit jedem zweiten Zahler den falschen Preis, sobald es zwei gibt
   * (29 € für die ersten 25, danach 49 €). Die Quelle ist dieselbe Spalte,
   * nach der auch `api/stripe/route.ts` den Preis wählt.
   */
  istGruenderpreis: boolean
}

export async function getAboStand(): Promise<AboStand> {
  const { supabase, company } = await requireCompany()

  const { data: firma } = await supabase.from('companies')
    .select('plan, plan_expires_at, stripe_customer_id, is_founder_price')
    .eq('id', company.id).single()

  const plan = (firma?.plan ?? 'starter') === 'starter' ? 'starter' : 'pro'
  // Dieselbe Funktion, die auch sperrt. Ein Stand, den der Nutzer sieht, und
  // ein anderer, der ihn blockiert, wäre der schlimmste Ausgang — genau die
  // Sorte Widerspruch, die diese Woche mehrfach Geld gekostet hat.
  const sperre = await pruefeAngebotsSperre(supabase, company.id)
  const angeboteDiesenMonat = await zaehleNeueAngeboteDiesenMonat(supabase, company.id)

  return {
    plan,
    laeuftBisISO: (firma?.plan_expires_at as string | null) ?? null,
    hatStripeKonto: Boolean(firma?.stripe_customer_id),
    angeboteDiesenMonat,
    testEndeISO: sperre.testEndeISO,
    testTageRestlich: sperre.tageRestlich,
    gesperrt: sperre.gesperrt,
    istGruenderpreis: Boolean(firma?.is_founder_price),
  }
}
