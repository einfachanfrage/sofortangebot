import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

const PUBLIC_PATHS = ['/', '/login', '/register', '/auth/callback', '/angebot', '/vorschau', '/preise', '/impressum', '/datenschutz']
const ADMIN_PATHS = ['/admin']
const RATE_LIMIT_EXEMPT = ['/api/health', '/api/stripe']

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Globales IP-Rate-Limit für API-Routen
  if (path.startsWith('/api/') && !RATE_LIMIT_EXEMPT.some(p => path.startsWith(p))) {
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
          JSON.stringify({ error: 'Zu viele Anfragen. Bitte warte kurz.', reset_at: data.reset_at }),
          { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
        )
      }
    } catch {
      // fail open
    }
  }

  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PATHS.some(p => pathname.startsWith(p))

  // Ohne Supabase-Credentials (lokal ohne .env) alle public Pfade durchlassen
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || supabaseUrl === 'your_supabase_url') {
    if (isPublic) return NextResponse.next()
    return NextResponse.redirect(new URL('/vorschau', request.url))
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin-Bereich: nur für ADMIN_EMAIL
  const isAdminPath = ADMIN_PATHS.some(p => pathname.startsWith(p))
  if (isAdminPath) {
    const adminEmail = process.env.ADMIN_EMAIL
    if (!user || !adminEmail || user.email !== adminEmail) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  if (user && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sw\\.js|manifest\\.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
