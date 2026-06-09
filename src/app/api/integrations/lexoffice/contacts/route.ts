import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ contacts: [] })

  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (q.length < 2) return NextResponse.json({ contacts: [] })

  const { data: company } = await supabase.from('companies').select('lexoffice_api_key').eq('user_id', user.id).single()
  if (!company?.lexoffice_api_key) return NextResponse.json({ contacts: [] })

  const res = await fetch(
    `https://api.lexoffice.io/v1/contacts?name=${encodeURIComponent(q)}&page=0&size=10`,
    { headers: { 'Authorization': `Bearer ${company.lexoffice_api_key}`, 'Accept': 'application/json' } }
  )
  if (!res.ok) return NextResponse.json({ contacts: [] })

  const data = await res.json()
  const contacts = (data.content ?? []).map((c: {
    id: string
    person?: { firstName?: string; lastName?: string }
    company?: { name?: string }
    addresses?: { billing?: { street?: string; zip?: string; city?: string }[] }
    emailAddresses?: { business?: string[]; private?: string[] }
    phoneNumbers?: { business?: string[]; mobile?: string[]; private?: string[] }
  }) => {
    const name = c.person
      ? [c.person.firstName, c.person.lastName].filter(Boolean).join(' ')
      : c.company?.name ?? ''
    const billing = c.addresses?.billing?.[0]
    const address = billing
      ? [billing.street, [billing.zip, billing.city].filter(Boolean).join(' ')].filter(Boolean).join(', ')
      : null
    const email = c.emailAddresses?.business?.[0] ?? c.emailAddresses?.private?.[0] ?? null
    const phone = c.phoneNumbers?.mobile?.[0] ?? c.phoneNumbers?.business?.[0] ?? c.phoneNumbers?.private?.[0] ?? null
    return { id: c.id, name, address, email, phone, source: 'lexoffice' }
  }).filter((c: { name: string }) => c.name)

  return NextResponse.json({ contacts })
}
