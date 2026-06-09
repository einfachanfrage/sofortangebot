import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Quote } from '@/lib/types'
import { Logo } from '@/components/Logo'
import PwaBanner from '@/components/PwaBanner'
import BottomNav from '@/components/BottomNav'
import { Mic, FileText } from 'lucide-react'

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  draft:    { label: 'Entwurf',    color: 'bg-gray-100 text-gray-600'  },
  sent:     { label: 'Offen',      color: 'bg-blue-50 text-blue-700'   },
  accepted: { label: 'Beauftragt', color: 'bg-green-50 text-green-700' },
  rejected: { label: 'Abgelehnt', color: 'bg-red-50 text-red-700'     },
  archived: { label: 'Archiviert', color: 'bg-gray-50 text-gray-400'   },
}

const VIA_ICON: Record<string, string> = {
  email: '✉️', whatsapp: '💬', link: '🔗',
  lexoffice: 'LO', sevdesk: 'SD', fastbill: 'FB',
  billomat: 'BM', papierkram: 'PK', easybill: 'EB',
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (company && !company.name) {
    redirect('/onboarding')
  }

  const { data: quotes } = await supabase
    .from('quotes')
    .select('*, customer:customers(name), sent_via')
    .eq('company_id', company?.id)
    .order('created_at', { ascending: false })
    .limit(20)

  const openCount = quotes?.filter(q => q.status === 'sent').length ?? 0
  const acceptedCount = quotes?.filter(q => q.status === 'accepted').length ?? 0

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-24">
      {/* Header */}
      <div className="bg-[#2C2C2C] px-5 pt-12 pb-6">
        <Logo variant="dark" className="text-xl" />
        <div className="text-white font-bold mt-1 text-lg">
          {company?.name || 'Mein Betrieb'}
        </div>
      </div>

      <PwaBanner />

      {/* Stats */}
      <div className="px-5 -mt-4 grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#2C2C2C]/5">
          <div className="text-3xl font-black text-[#2C2C2C]">{openCount}</div>
          <div className="text-sm font-semibold text-[#2C2C2C]/60">Offen</div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#2C2C2C]/5">
          <div className="text-3xl font-black text-[#2C2C2C]">{acceptedCount}</div>
          <div className="text-sm font-semibold text-[#2C2C2C]/60">Angenommen</div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 mt-5">
        <Link
          href="/angebot/neu"
          className="flex items-center justify-center gap-3 w-full bg-[#F5C400] text-[#2C2C2C] font-black text-xl rounded-2xl py-5 shadow-sm active:scale-95 transition-transform"
        >
          <Mic size={22} strokeWidth={2.5} />
          Neues Angebot
        </Link>
      </div>

      {/* Angebote */}
      <div className="px-5 mt-8">
        <h2 className="font-black text-[#2C2C2C] text-lg mb-3">Letzte Angebote</h2>

        {!quotes?.length && (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#2C2C2C]/5">
            <FileText size={36} color="#2C2C2C" strokeWidth={1.5} className="mx-auto mb-3 opacity-20" />
            <div className="font-bold text-[#2C2C2C]/60">Noch keine Angebote.</div>
            <div className="text-sm text-[#2C2C2C]/40 font-semibold mt-1">Starte mit dem Mikrofon-Button oben.</div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {quotes?.map((quote: Quote & { customer?: { name: string }; sent_via?: string[] }) => {
            const status = STATUS_LABEL[quote.status] ?? STATUS_LABEL.draft
            const via = quote.sent_via ?? []
            return (
              <Link
                key={quote.id}
                href={`/angebot/${quote.id}`}
                className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5 shadow-sm active:scale-98 transition-transform"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-black text-[#2C2C2C] truncate">
                      {quote.customer?.name || 'Kein Kunde'}
                    </div>
                    <div className="text-sm text-[#2C2C2C]/50 font-semibold mt-0.5">
                      {formatDate(quote.created_at)}
                    </div>
                    {via.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {via.map((v: string) => (
                          <span key={v} className="text-[10px] font-black bg-[#2C2C2C]/5 text-[#2C2C2C]/50 px-1.5 py-0.5 rounded-full">
                            {VIA_ICON[v] ?? v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="font-black text-[#2C2C2C]">{formatCurrency(quote.total_gross)}</div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
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
