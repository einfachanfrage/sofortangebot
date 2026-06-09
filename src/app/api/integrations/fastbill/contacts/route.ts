import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ contacts: [] })
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (q.length < 2) return NextResponse.json({ contacts: [] })

  const { data: company } = await supabase.from('companies').select('fastbill_api_key,fastbill_email').eq('user_id', user.id).single()
  if (!company?.fastbill_api_key || !company?.fastbill_email) return NextResponse.json({ contacts: [] })

  const auth = Buffer.from(`${company.fastbill_email}:${company.fastbill_api_key}`).toString('base64')
  const res = await fetch('https://www.fastbill.com/api/1.0/api.php', {
    method: 'POST',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ SERVICE: 'customer.get', FILTER: { TERM: q }, LIMIT: 10 }),
  })
  if (!res.ok) return NextResponse.json({ contacts: [] })

  const data = await res.json()
  const contacts = (data.RESPONSE?.CUSTOMERS ?? []).map((c: {
    CUSTOMER_ID: string
    FIRST_NAME?: string
    LAST_NAME?: string
    ORGANIZATION?: string
    ADDRESS?: string
    ZIPCODE?: string
    CITY?: string
    EMAIL?: string
    PHONE?: string
    MOBILE?: string
  }) => {
    const name = c.ORGANIZATION || [c.FIRST_NAME, c.LAST_NAME].filter(Boolean).join(' ')
    const address = [c.ADDRESS, [c.ZIPCODE, c.CITY].filter(Boolean).join(' ')].filter(Boolean).join(', ') || null
    return { id: c.CUSTOMER_ID, name, address, email: c.EMAIL || null, phone: c.MOBILE || c.PHONE || null, source: 'fastbill' }
  }).filter((c: { name: string }) => c.name)

  return NextResponse.json({ contacts })
}
