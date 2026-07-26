import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendDataExportEmail } from '@/lib/email'

export const maxDuration = 30

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Nicht eingeloggt' }, { status: 401 })

  const { data: company } = await supabase
    .from('companies').select('id').eq('user_id', user.id).single()
  if (!company) return NextResponse.json({ error: 'Betrieb nicht gefunden' }, { status: 404 })

  const [{ data: customers }, { data: quotes }] = await Promise.all([
    supabase.from('customers').select('*').eq('company_id', company.id),
    supabase.from('quotes').select('*').eq('company_id', company.id).order('created_at', { ascending: false }),
  ])

  function toCsv(rows: Record<string, unknown>[]): string {
    if (!rows?.length) return ''
    const headers = Object.keys(rows[0])
    const escape = (v: unknown) => {
      const s = v == null ? '' : String(v)
      return s.includes(',') || s.includes('"') || s.includes('\n')
        ? `"${s.replace(/"/g, '""')}"` : s
    }
    return [
      headers.join(','),
      ...rows.map(r => headers.map(h => escape(r[h])).join(',')),
    ].join('\n')
  }

  const datum = new Date().toISOString().split('T')[0]
  await sendDataExportEmail({
    to: user.email!,
    quotesCsv: toCsv(quotes as Record<string, unknown>[] ?? []),
    customersCsv: toCsv(customers as Record<string, unknown>[] ?? []),
    datum,
  })

  return NextResponse.json({ ok: true })
}
