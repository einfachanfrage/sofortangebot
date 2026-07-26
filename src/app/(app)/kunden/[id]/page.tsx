import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { KundeTypToggle } from './KundeTypToggle'
import { getCustomerDetail } from '@/data/customers'

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
function formatCurrency(n: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(n)
}

const STATUS: Record<string, { label: string; color: string }> = {
  draft: { label: 'Entwurf', color: 'bg-gray-100 text-gray-600' },
  sent: { label: 'Versendet', color: 'bg-blue-50 text-blue-700' },
  accepted: { label: 'Angenommen', color: 'bg-green-50 text-green-700' },
  rejected: { label: 'Abgelehnt', color: 'bg-red-50 text-red-700' },
}

export default async function KundeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { customer, quotes } = await getCustomerDetail(id)

  const acceptedValue = quotes.filter(q => q.status === 'accepted').reduce((s, q) => s + (q.total_gross ?? 0), 0)

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-24">
      <div className="bg-[#2C2C2C] px-5 pt-12 pb-6">
        <Link href="/kunden" className="text-white/50 text-sm font-semibold">← Kunden</Link>
        <div className="text-white font-syne font-black text-xl mt-1">{customer.name}</div>
        {customer.address && (
          <div className="text-white/40 text-sm font-semibold mt-0.5">{customer.address}</div>
        )}
      </div>

      <div className="px-5 md:px-8 mt-5 flex flex-col gap-4 max-w-xl mx-auto">
        {/* Kontakt */}
        {(customer.phone || customer.email) && (
          <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
            <div className="text-xs font-black text-[#2C2C2C]/40 uppercase tracking-wide mb-3">Kontakt</div>
            <div className="flex flex-col gap-2">
              {customer.phone && (
                <a href={`tel:${customer.phone}`} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F5C400]/20 rounded-xl flex items-center justify-center text-sm">📞</div>
                  <span className="font-semibold text-[#2C2C2C]">{customer.phone}</span>
                </a>
              )}
              {customer.email && (
                <a href={`mailto:${customer.email}`} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F5C400]/20 rounded-xl flex items-center justify-center text-sm">✉️</div>
                  <span className="font-semibold text-[#2C2C2C]">{customer.email}</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Kundentyp & E-Rechnung */}
        <KundeTypToggle
          kundeId={customer.id}
          istUnternehmen={customer.ist_unternehmen ?? false}
          ustid={customer.ustid ?? null}
          leitwegId={customer.leitweg_id ?? null}
        />

        {/* Statistik */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
            <div className="text-2xl font-black text-[#2C2C2C]">{quotes.length}</div>
            <div className="text-xs font-semibold text-[#2C2C2C]/50 mt-0.5">Angebote gesamt</div>
          </div>
          <div className="bg-[#F5C400]/10 rounded-2xl p-4 border border-[#F5C400]/20">
            <div className="text-lg font-black text-[#2C2C2C] leading-tight">{formatCurrency(acceptedValue)}</div>
            <div className="text-xs font-semibold text-[#2C2C2C]/50 mt-0.5">Angenommen</div>
          </div>
        </div>

        {/* Angebotsliste */}
        <div>
          <div className="text-xs font-black text-[#2C2C2C]/40 uppercase tracking-wide mb-3">Angebote</div>
          <div className="flex flex-col gap-2">
            {!quotes.length && (
              <div className="bg-white rounded-2xl p-6 text-center border border-[#2C2C2C]/5">
                <div className="text-[#2C2C2C]/40 font-semibold text-sm">Noch keine Angebote</div>
              </div>
            )}
            {quotes.map(quote => {
              const st = STATUS[quote.status] ?? STATUS.draft
              return (
                <Link
                  key={quote.id}
                  href={`/angebot/${quote.id}`}
                  className="bg-white rounded-2xl px-4 py-3 border border-[#2C2C2C]/5 flex items-center justify-between gap-2 active:scale-98 transition-transform"
                >
                  <div>
                    <div className="font-black text-[#2C2C2C]">{formatCurrency(quote.total_gross)}</div>
                    <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">{formatDate(quote.created_at)}</div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${st.color}`}>{st.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
