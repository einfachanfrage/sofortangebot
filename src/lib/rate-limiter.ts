import { createClient as createServiceClient } from '@supabase/supabase-js'

// Service-Role-Client (umgeht RLS — nur server-seitig verwenden)
function getService() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export type RateLimitEndpunkt =
  | 'ki_transkription'
  | 'ki_extraktion'
  | 'pdf_generierung'
  | 'angebot_erstellen'
  | 'email_versand'
  | 'api_global'

interface LimitConfig {
  limit: number
  fenster: number  // Minuten
  // Pro-Plan bekommt dieselben Limits (ausreichend für normale Nutzung)
  freePlanLimit?: number
  freePlanFenster?: number  // Minuten (größeres Fenster = Tag = 1440)
}

const LIMITS: Record<RateLimitEndpunkt, LimitConfig> = {
  ki_transkription:  { limit: 50,  fenster: 60,   freePlanLimit: 10,  freePlanFenster: 1440 },
  ki_extraktion:     { limit: 50,  fenster: 60,   freePlanLimit: 10,  freePlanFenster: 1440 },
  pdf_generierung:   { limit: 100, fenster: 60,   freePlanLimit: 3,   freePlanFenster: 1440 },
  angebot_erstellen: { limit: 30,  fenster: 60,   freePlanLimit: 3,   freePlanFenster: 43200 }, // 30 Tage
  email_versand:     { limit: 20,  fenster: 60 },
  api_global:        { limit: 200, fenster: 10 },
}

interface RateLimitResult {
  allowed: boolean
  message?: string
  resetAt?: string
  isFreePlanLimit?: boolean
}

export async function checkUserRateLimit(
  userId: string,
  endpunkt: RateLimitEndpunkt,
  plan: string = 'pro'
): Promise<RateLimitResult> {
  const config = LIMITS[endpunkt]
  if (!config) return { allowed: true }

  const isFree = plan === 'starter' || plan === 'free'
  const limit = isFree && config.freePlanLimit ? config.freePlanLimit : config.limit
  const fenster = isFree && config.freePlanFenster ? config.freePlanFenster : config.fenster

  try {
    const service = getService()
    const { data } = await service.rpc('check_rate_limit', {
      p_identifier: `user:${userId}`,
      p_endpunkt: endpunkt,
      p_limit: limit,
      p_fenster_minuten: fenster,
    })

    if (!data?.allowed) {
      const resetAt = data?.reset_at as string | undefined
      const minutesLeft = resetAt
        ? Math.ceil((new Date(resetAt).getTime() - Date.now()) / 60000)
        : fenster

      const isFreePlanLimit = isFree && !!config.freePlanLimit

      return {
        allowed: false,
        resetAt,
        isFreePlanLimit,
        message: isFreePlanLimit
          ? endpunkt === 'angebot_erstellen'
            ? 'Free-Limit erreicht. Mit Pro gibt es unbegrenzte Angebote.'
            : 'KI-Tageslimit erreicht. Morgen geht\'s weiter — oder jetzt auf Pro upgraden.'
          : minutesLeft <= 1
            ? 'Du bist heute sehr fleißig! 🔨 Kurze Pause — gleich geht\'s weiter.'
            : `Du bist heute sehr fleißig! 🔨 Kurze Pause — in ${minutesLeft} Minuten geht\'s weiter.`,
      }
    }

    return { allowed: true }
  } catch {
    // Bei Fehler im Rate-Limiter nicht blockieren
    return { allowed: true }
  }
}

export async function checkIpRateLimit(ip: string): Promise<RateLimitResult> {
  try {
    const service = getService()
    const { data } = await service.rpc('check_rate_limit', {
      p_identifier: `ip:${ip}`,
      p_endpunkt: 'api_global',
      p_limit: LIMITS.api_global.limit,
      p_fenster_minuten: LIMITS.api_global.fenster,
    })

    if (!data?.allowed) {
      return {
        allowed: false,
        resetAt: data?.reset_at,
        message: 'Zu viele Anfragen. Bitte warte kurz.',
      }
    }
    return { allowed: true }
  } catch {
    return { allowed: true }
  }
}

export async function checkKIBudget(userId: string): Promise<{ allowed: boolean; tageskosten: number }> {
  try {
    const service = getService()
    const heute = new Date().toISOString().split('T')[0]

    const [{ data: usage }, { data: company }] = await Promise.all([
      service
        .from('ki_usage')
        .select('kosten_eur')
        .eq('user_id', userId)
        .gte('created_at', `${heute}T00:00:00`),
      service
        .from('companies')
        .select('ki_budget_tagesmaximum_eur')
        .eq('user_id', userId)
        .single(),
    ])

    const tageskosten = (usage ?? []).reduce((s: number, r: { kosten_eur: number }) => s + (r.kosten_eur ?? 0), 0)
    const max = (company as { ki_budget_tagesmaximum_eur?: number } | null)?.ki_budget_tagesmaximum_eur ?? 2.0

    return { allowed: tageskosten < max, tageskosten }
  } catch {
    return { allowed: true, tageskosten: 0 }
  }
}

export async function trackKIUsage(params: {
  userId: string
  endpunkt: string
  tokensIn?: number
  tokensOut?: number
  kostenEur?: number
}) {
  try {
    const service = getService()
    await service.from('ki_usage').insert({
      user_id: params.userId,
      endpunkt: params.endpunkt,
      tokens_in: params.tokensIn ?? 0,
      tokens_out: params.tokensOut ?? 0,
      kosten_eur: params.kostenEur ?? 0,
    })
  } catch {
    // Tracking-Fehler nie den Request blockieren lassen
  }
}

/**
 * Kombinierter Check für KI-Routen: Plan laden → Rate-Limit → Tagesbudget.
 * Gibt eine fertige 429-Response zurück wenn blockiert, sonst null.
 */
export async function pruefeKIZugriff(
  userId: string,
  endpunkt: RateLimitEndpunkt
): Promise<Response | null> {
  // Plan-Lookup und Budget-Check parallel (Budget ist plan-unabhängig) —
  // spart einen DB-Roundtrip pro KI-Aufruf
  const planPromise = (async () => {
    try {
      const service = getService()
      const { data: company } = await service
        .from('companies')
        .select('plan')
        .eq('user_id', userId)
        .single()
      return (company as { plan?: string } | null)?.plan ?? 'starter'
    } catch {
      return 'starter' // Lookup-Fehler → konservativ als Free behandeln
    }
  })()

  const [plan, budgetCheck] = await Promise.all([planPromise, checkKIBudget(userId)])

  if (!budgetCheck.allowed) {
    return Response.json(
      { error: 'KI-Tageslimit erreicht. Morgen geht\'s weiter.', isKIBudget: true },
      { status: 429, headers: { 'Retry-After': '3600' } }
    )
  }

  const rlCheck = await checkUserRateLimit(userId, endpunkt, plan)
  if (!rlCheck.allowed) return rateLimitResponse(rlCheck)

  return null
}

export function rateLimitResponse(result: RateLimitResult) {
  return Response.json(
    { error: result.message ?? 'Zu viele Anfragen', reset_at: result.resetAt, isFreePlanLimit: result.isFreePlanLimit },
    {
      status: 429,
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Reset': result.resetAt ?? '',
      },
    }
  )
}
