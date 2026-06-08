import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

function getServiceClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET(req: NextRequest) {
  // Auth-Check: nur Admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const adminEmail = process.env.ADMIN_EMAIL
  if (!user || !adminEmail || user.email !== adminEmail) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const db = getServiceClient()
  const now = new Date()

  // Monatsgrenzen für die letzten 6 Monate
  const months: { label: string; from: string; to: string }[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    months.push({
      label: d.toLocaleDateString('de-DE', { month: 'short', year: '2-digit' }),
      from: d.toISOString(),
      to: end.toISOString(),
    })
  }

  // Alle Companies (= registrierte Nutzer)
  const { data: companies } = await db
    .from('companies')
    .select('id, name, plan, created_at, stripe_customer_id, stripe_subscription_id, gewerke')
    .order('created_at', { ascending: false })

  const totalUsers = companies?.length ?? 0
  const proUsers = companies?.filter(c => c.plan === 'pro').length ?? 0
  const starterUsers = companies?.filter(c => c.plan === 'starter').length ?? 0

  // Angebote gesamt + diesen Monat
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const { count: totalQuotes } = await db.from('quotes').select('id', { count: 'exact', head: true })
  const { count: quotesThisMonth } = await db.from('quotes').select('id', { count: 'exact', head: true }).gte('created_at', firstOfMonth)

  // Neue User diesen Monat
  const newUsersThisMonth = companies?.filter(c => c.created_at >= firstOfMonth).length ?? 0

  // MRR (vereinfacht: Pro-User × Monatspreis)
  const PRO_MONTHLY = 29 // €
  const mrr = proUsers * PRO_MONTHLY

  // Signups pro Monat (letzte 6 Monate)
  const signupsPerMonth = await Promise.all(months.map(async m => {
    const count = companies?.filter(c => c.created_at >= m.from && c.created_at < m.to).length ?? 0
    return { label: m.label, signups: count }
  }))

  // Quotes pro Monat
  const quotesPerMonth = await Promise.all(months.map(async m => {
    const { count } = await db.from('quotes')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', m.from)
      .lt('created_at', m.to)
    return { label: m.label, quotes: count ?? 0 }
  }))

  // Umsatz pro Monat (angenommene Upgrades aus Stripe — vereinfacht)
  const revenuePerMonth = signupsPerMonth.map((m, i) => ({
    label: m.label,
    revenue: (quotesPerMonth[i]?.quotes ?? 0) > 0 ? proUsers * PRO_MONTHLY : 0,
  }))

  // Letzten 10 Nutzer mit Aktivität
  const recentUsers = (companies ?? []).slice(0, 10).map(c => ({
    id: c.id,
    name: c.name || '(kein Name)',
    plan: c.plan,
    gewerke: (c.gewerke ?? []).slice(0, 2),
    created_at: c.created_at,
    hasStripe: !!c.stripe_customer_id,
  }))

  return NextResponse.json({
    totalUsers,
    proUsers,
    starterUsers,
    newUsersThisMonth,
    totalQuotes: totalQuotes ?? 0,
    quotesThisMonth: quotesThisMonth ?? 0,
    mrr,
    arr: mrr * 12,
    signupsPerMonth,
    quotesPerMonth,
    revenuePerMonth,
    recentUsers,
  })
}
