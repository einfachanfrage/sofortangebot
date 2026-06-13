import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks: Record<string, unknown> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    supabase: false,
    version: process.env.NEXT_PUBLIC_VERSION ?? '1.0.0',
  }

  try {
    const supabase = await createClient()
    const { error } = await supabase.from('companies').select('id').limit(1)
    checks.supabase = !error
  } catch {
    checks.supabase = false
  }

  const allOk = checks.supabase === true
  return NextResponse.json(checks, { status: allOk ? 200 : 503 })
}
