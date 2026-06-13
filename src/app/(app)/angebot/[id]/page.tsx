import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import AngebotDetail from './AngebotDetail'

export default async function AngebotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: quote } = await supabase
    .from('quotes')
    .select('*, items:quote_items(*), customer:customers(*)')
    .eq('id', id)
    .single()

  if (!quote) notFound()

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', quote.company_id)
    .single()

  // Angebotsnummer: aus DB-Spalte (GoBD) oder Fallback
  const quoteNumber = (quote as { angebotsnummer?: string | null }).angebotsnummer ?? (() => {
    const year = new Date(quote.created_at).getFullYear()
    return `${year}-${quote.id.slice(-4).toUpperCase()}`
  })()

  const sortedItems = (quote.items ?? []).sort((a: { position: number }, b: { position: number }) => a.position - b.position)

  return (
    <AngebotDetail
      quote={{ ...quote, items: sortedItems }}
      company={company}
      quoteNumber={quoteNumber}
    />
  )
}
