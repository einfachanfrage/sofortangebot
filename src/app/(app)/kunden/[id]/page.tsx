import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { KundeTypToggle } from './KundeTypToggle'
import { NeueBaustelleButton } from '@/components/NeueBaustelleButton'
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

interface AngebotRowData {
  id: string
  status: string
  total_gross: number
  created_at: string
  valid_until: string | null
  baustelle_id?: string | null
}

function AngebotRow({ quote }: { quote: AngebotRowData }) {
  const st = STATUS[quote.status] ?? STATUS.draft
  return (
    <Link
      href={`/angebot/${quote.id}`}
      className="bg-white rounded-2xl px-4 py-3 border border-[#2C2C2C]/5 flex items-center justify-between gap-2 active:scale-[0.98] transition-transform"
    >
      <div>
        <div className="font-black text-[#2C2C2C]">{formatCurrency(quote.total_gross)}</div>
        <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">{formatDate(quote.created_at)}</div>
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${st.color}`}>{st.label}</span>
    </Link>
  )
}

export default async function KundeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { customer, quotes, baustellen } = await getCustomerDetail(id)

  const acceptedValue = quotes.filter(q => q.status === 'accepted').reduce((s, q) => s + (q.total_gross ?? 0), 0)

  // DC-029: "unsichtbar, bis es gebraucht wird" — bei höchstens einer
  // Baustelle bringt eine Gruppierung keinen Mehrwert, nur eine leere
  // Gruppen-Überschrift. Erst ab der zweiten wird nach Baustelle gruppiert
  // (der Clemens-Fall: mehrere Angebote für dieselbe Baustelle über Zeit).
  const gruppiert = baustellen.length > 1
  const baustellenMitAngeboten = gruppiert
    ? baustellen.map(b => ({ baustelle: b, angebote: quotes.filter(q => q.baustelle_id === b.id) }))
    : []
  const ohneBaustelle = gruppiert
    ? quotes.filter(q => !baustellen.some(b => b.id === q.baustelle_id))
    : []

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

        {gruppiert ? (
          <div>
            <div className="text-xs font-black text-[#2C2C2C]/40 uppercase tracking-wide mb-3">Baustellen</div>
            <div className="flex flex-col gap-3">
              {baustellenMitAngeboten.map(({ baustelle, angebote }) => (
                <div key={baustelle.id} className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-sm">🏗️</span>
                    <span className="font-syne font-bold text-[#2C2C2C] text-sm">{baustelle.name}</span>
                    <span className="ml-auto text-xs font-bold text-[#2C2C2C]/40">
                      {angebote.length === 0 ? 'Noch kein Angebot' : `${angebote.length} ${angebote.length === 1 ? 'Angebot' : 'Angebote'}`}
                    </span>
                  </div>
                  {angebote.length > 0 && (
                    <div className="flex flex-col gap-2 mb-2">
                      {angebote.map(q => <AngebotRow key={q.id} quote={q} />)}
                    </div>
                  )}
                  <Link
                    href={`/angebot/neu?customerId=${customer.id}&baustelleId=${baustelle.id}`}
                    className="block w-full text-center border border-dashed border-[#2C2C2C]/15 text-[#2C2C2C]/50 font-bold text-xs rounded-xl py-2.5 hover:border-[#2C2C2C]/30 hover:text-[#2C2C2C]/70 transition-colors"
                  >
                    + Neues Angebot für diese Baustelle
                  </Link>
                </div>
              ))}

              {ohneBaustelle.length > 0 && (
                <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-syne font-bold text-[#2C2C2C] text-sm">Sonstige Angebote</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {ohneBaustelle.map(q => <AngebotRow key={q.id} quote={q} />)}
                  </div>
                </div>
              )}

              <NeueBaustelleButton customerId={customer.id} variant="primary" />
            </div>
          </div>
        ) : (
          <div>
            <div className="text-xs font-black text-[#2C2C2C]/40 uppercase tracking-wide mb-3">Angebote</div>
            <div className="flex flex-col gap-2">
              {!quotes.length && (
                <div className="bg-white rounded-2xl p-6 text-center border border-[#2C2C2C]/5">
                  <div className="text-[#2C2C2C]/40 font-semibold text-sm">Noch keine Angebote</div>
                </div>
              )}
              {quotes.map(q => <AngebotRow key={q.id} quote={q} />)}
            </div>
            <NeueBaustelleButton customerId={customer.id} variant="subtle" />
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
