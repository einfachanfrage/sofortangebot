import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
function formatCurrency(n: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n)
}

export default async function KundenPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: company } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
  if (!company) redirect('/onboarding')

  const { data: customers } = await supabase
    .from('customers')
    .select('*, quotes(id, status, total_gross, created_at)')
    .eq('company_id', company.id)
    .order('name')

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-24 md:pb-12">
      <div className="md:max-w-5xl md:mx-auto">
      <div className="bg-[#2C2C2C] md:bg-transparent px-5 md:px-8 pt-12 md:pt-8 pb-6 flex items-start justify-between">
        <div>
          <div className="text-white md:text-[#2C2C2C] font-syne font-black text-2xl">Kunden</div>
          <div className="text-white/40 md:text-[#2C2C2C]/40 text-sm font-semibold mt-0.5">
            {customers?.length ?? 0} Kunden gesamt
          </div>
        </div>
        <Link href="/kunden/neu"
          className="bg-[#F5C400] text-[#2C2C2C] font-black text-sm rounded-xl px-4 py-2 mt-1">
          + Neu
        </Link>
      </div>

      <div className="px-5 md:px-8 mt-5 md:grid md:grid-cols-2 md:gap-3 flex flex-col gap-3">
        {!customers?.length && (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#2C2C2C]/5">
            <div className="text-4xl mb-3">👷</div>
            <div className="font-black text-[#2C2C2C] mb-1">Noch keine Kunden</div>
            <div className="text-sm text-[#2C2C2C]/50 font-semibold">Kunden werden automatisch angelegt wenn du ein Angebot erstellst.</div>
          </div>
        )}

        {customers?.map(customer => {
          const quotes = customer.quotes ?? []
          const totalValue = quotes.reduce((s: number, q: { total_gross: number }) => s + (q.total_gross ?? 0), 0)
          const lastQuote = quotes.sort((a: { created_at: string }, b: { created_at: string }) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )[0]
          const acceptedCount = quotes.filter((q: { status: string }) => q.status === 'accepted').length

          return (
            <Link
              key={customer.id}
              href={`/kunden/${customer.id}`}
              className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5 active:scale-98 transition-transform"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="font-black text-[#2C2C2C] truncate">{customer.name}</div>
                  {customer.address && (
                    <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5 truncate">{customer.address}</div>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs font-bold text-[#2C2C2C]/50">{quotes.length} Angebot{quotes.length !== 1 ? 'e' : ''}</span>
                    {acceptedCount > 0 && (
                      <span className="text-xs font-bold text-green-600">{acceptedCount} angenommen</span>
                    )}
                    {lastQuote && (
                      <span className="text-xs text-[#2C2C2C]/30 font-semibold">Zuletzt {formatDate(lastQuote.created_at)}</span>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-[#2C2C2C]">{formatCurrency(totalValue)}</div>
                  <div className="text-xs text-[#2C2C2C]/30 font-semibold mt-0.5">Gesamt</div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
      </div>

      <BottomNav />
    </div>
  )
}
