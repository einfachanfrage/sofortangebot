import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { testLexofficeAPI } from '@/lib/api-health/lexoffice'
import { testLexwareAPI } from '@/lib/api-health/lexware'
import { testSevdeskAPI } from '@/lib/api-health/sevdesk'
import { nutzerFehler } from '@/lib/fehlertexte'

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

  // CoS-P-020 (Übergabe vom Designer, fehlertexte.ts): Fehlertext aus dem
  // externen API-Test (z. B. "Netzwerkfehler: TypeError: fetch failed") vor
  // der Anzeige auf einen verständlichen deutschen Satz abbilden.
  if (result.fehler) result = { ...result, fehler: nutzerFehler(result.fehler) }

  return NextResponse.json(result)
}
