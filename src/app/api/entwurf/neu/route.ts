import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const body = await req.json().catch(() => ({})) as { kunden_name?: string }

  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!company) return NextResponse.json({ error: 'Kein Unternehmen gefunden' }, { status: 404 })

  // Optionaler Kundenname als Hilfs-Bezeichnung
  let customerId: string | null = null
  if (body.kunden_name?.trim()) {
    const { data: kunde } = await supabase
      .from('customers')
      .insert({ name: body.kunden_name.trim(), company_id: company.id })
      .select('id')
      .single()
    customerId = kunde?.id ?? null
  }

  const { data: quote, error } = await supabase
    .from('quotes')
    .insert({
      company_id: company.id,
      customer_id: customerId,
      status: 'draft',
      title: body.kunden_name?.trim() ? `Entwurf — ${body.kunden_name.trim()}` : 'Entwurf',
      total_net: 0,
      total_gross: 0,
    })
    .select('id')
    .single()

  if (error || !quote) {
    return NextResponse.json({ error: error?.message ?? 'Konnte Entwurf nicht anlegen' }, { status: 500 })
  }

  return NextResponse.json({ id: quote.id })
}
