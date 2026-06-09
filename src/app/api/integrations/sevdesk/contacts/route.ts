import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ contacts: [] })
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (q.length < 2) return NextResponse.json({ contacts: [] })

  const { data: company } = await supabase.from('companies').select('sevdesk_api_key').eq('user_id', user.id).single()
  if (!company?.sevdesk_api_key) return NextResponse.json({ contacts: [] })

  const res = await fetch(
    `https://my.sevdesk.de/api/v1/Contact?name=${encodeURIComponent(q)}&limit=10`,
    { headers: { 'Authorization': company.sevdesk_api_key, 'Accept': 'application/json' } }
  )
  if (!res.ok) return NextResponse.json({ contacts: [] })

  const data = await res.json()
  const contacts = (data.objects ?? []).map((c: {
    id: string
    name?: string
    surename?: string
    familyname?: string
    addresses?: { street?: string; zip?: string; city?: string }[]
    communicationWays?: { type: string; value: string }[]
  }) => {
    const name = c.name || [c.surename, c.familyname].filter(Boolean).join(' ')
    const addr = c.addresses?.[0]
    const address = addr ? [addr.street, [addr.zip, addr.city].filter(Boolean).join(' ')].filter(Boolean).join(', ') : null
    const email = c.communicationWays?.find(cw => cw.type === 'EMAIL')?.value ?? null
    const phone = c.communicationWays?.find(cw => cw.type === 'PHONE' || cw.type === 'MOBILE')?.value ?? null
    return { id: c.id, name, address, email, phone, source: 'sevdesk' }
  }).filter((c: { name: string }) => c.name)

  return NextResponse.json({ contacts })
}
