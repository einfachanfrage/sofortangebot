import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      // Willkommens-E-Mail nur bei erster Registrierung senden
      // Erkennung: user wurde gerade erstellt (created_at ≈ now, kein company-Eintrag)
      const isNew = next.includes('/onboarding')
      if (isNew && data.user.email) {
        const vorname = data.user.user_metadata?.full_name?.split(' ')[0]
        sendWelcomeEmail(data.user.email, vorname).catch(console.error)
      }
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
