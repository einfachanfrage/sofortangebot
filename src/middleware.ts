import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { wrapMiddlewareWithSentry } from '@sentry/nextjs'

// Health-Endpunkte vom globalen Rate-Limit ausschließen
const EXEMPT_PATHS = ['/api/health', '/api/stripe']

async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Health-Checks + Stripe-Webhooks ausschließen
  if (EXEMPT_PATHS.some(p => path.startsWith(p))) {
    return NextResponse.next()
  }

  // Nur API-Routen rate-limiten
  if (!path.startsWith('/api/')) {
    return NextResponse.next()
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'

  try {
    const service = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data } = await service.rpc('check_rate_limit', {
      p_identifier: `ip:${ip}`,
      p_endpunkt: 'api_global',
      p_limit: 200,
      p_fenster_minuten: 10,
    })

    if (data && !data.allowed) {
      return new NextResponse(
        JSON.stringify({
          error: 'Zu viele Anfragen. Bitte warte kurz.',
          reset_at: data.reset_at,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
            'X-RateLimit-Limit': '200',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': data.reset_at ?? '',
          },
        }
      )
    }
  } catch {
    // Middleware-Fehler nie den Request blockieren — fail open
  }

  return NextResponse.next()
}

export default wrapMiddlewareWithSentry(middleware)

export const config = {
  matcher: '/api/:path*',
}
