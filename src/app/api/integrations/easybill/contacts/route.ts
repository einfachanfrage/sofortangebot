import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ contacts: [] })
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (q.length < 2) return NextResponse.json({ contacts: [] })

  const { data: company } = await supabase.from('companies').select('easybill_api_key').eq('user_id', user.id).single()
  if (!company?.easybill_api_key) return NextResponse.json({ contacts: [] })

  const res = await fetch(
    `https://api.easybill.de/rest/v1/customers?search=${encodeURIComponent(q)}&limit=10`,
    { headers: { 'Authorization': `Bearer ${company.easybill_api_key}`, 'Accept': 'application/json' } }
  )
  if (!res.ok) return NextResponse.json({ contacts: [] })

  const data = await res.json()
  const contacts = (data.items ?? []).map((c: {
    id: string
    company_name?: string
    first_name?: string
    last_name?: string
    street?: string
    zip_code?: string
    city?: string
    email?: string
    phone?: string
    mobile?: string
  }) => {
    const name = c.company_name || [c.first_name, c.last_name].filter(Boolean).join(' ')
    const address = [c.street, [c.zip_code, c.city].filter(Boolean).join(' ')].filter(Boolean).join(', ') || null
    return { id: String(c.id), name, address, email: c.email || null, phone: c.mobile || c.phone || null, source: 'easybill' }
  }).filter((c: { name: string }) => c.name)

  return NextResponse.json({ contacts })
}
