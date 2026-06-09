import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ contacts: [] })
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (q.length < 2) return NextResponse.json({ contacts: [] })

  const { data: company } = await supabase.from('companies').select('billomat_api_key,billomat_subdomain').eq('user_id', user.id).single()
  if (!company?.billomat_api_key || !company?.billomat_subdomain) return NextResponse.json({ contacts: [] })

  const res = await fetch(
    `https://${company.billomat_subdomain}.billomat.net/api/clients?name=${encodeURIComponent(q)}&per_page=10`,
    { headers: { 'X-BillomatApiKey': company.billomat_api_key, 'Accept': 'application/json' } }
  )
  if (!res.ok) return NextResponse.json({ contacts: [] })

  const data = await res.json()
  const list = Array.isArray(data.clients?.client) ? data.clients.client : data.clients?.client ? [data.clients.client] : []
  const contacts = list.map((c: {
    id: string
    name?: string
    first_name?: string
    last_name?: string
    street?: string
    zip?: string
    city?: string
    email?: string
    phone?: string
    mobile?: string
  }) => {
    const name = c.name || [c.first_name, c.last_name].filter(Boolean).join(' ')
    const address = [c.street, [c.zip, c.city].filter(Boolean).join(' ')].filter(Boolean).join(', ') || null
    return { id: String(c.id), name, address, email: c.email || null, phone: c.mobile || c.phone || null, source: 'billomat' }
  }).filter((c: { name: string }) => c.name)

  return NextResponse.json({ contacts })
}
