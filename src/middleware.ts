import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/register', '/auth/callback', '/angebot', '/vorschau', '/preise', '/impressum', '/datenschutz']
const ADMIN_PATHS = ['/admin']

export async function middleware(request: NextRequest) {
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
