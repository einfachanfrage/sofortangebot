import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { testLexofficeAPI } from '@/lib/api-health/lexoffice'
import { testLexwareAPI } from '@/lib/api-health/lexware'
import { testSevdeskAPI } from '@/lib/api-health/sevdesk'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { anbieter, apiKey } = await req.json()
  if (!anbieter || !apiKey) return NextResponse.json({ error: 'Fehlende Parameter' }, { status: 400 })

  let result
  if (anbieter === 'lexoffice') result = await testLexofficeAPI(apiKey)
  else if (anbieter === 'lexware') result = await testLexwareAPI(apiKey)
  else if (anbieter === 'sevdesk') result = await testSevdeskAPI(apiKey)
  else return NextResponse.json({ error: 'Unbekannter Anbieter' }, { status: 400 })

  return NextResponse.json(result)
}
