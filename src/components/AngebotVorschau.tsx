'use client'

import type { Quote, QuoteItem, Company, Customer } from '@/lib/types'

interface Props {
  quote: Quote & { items: QuoteItem[]; customer?: Customer | null }
  company: Company
  quoteNumber: string
  modus?: 'angebot' | 'rechnung'
}

function fmt(n: number) { return n.toFixed(2).replace('.', ',') + ' €' }
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default function AngebotVorschau({ quote, company, quoteNumber, modus = 'angebot' }: Props) {
  const isKleinunternehmer = company.vat_rate === 0
  const isRechnung = modus === 'rechnung'
  const dokumentTitel = isRechnung ? 'RECHNUNG' : 'ANGEBOT'

  // Summen (inkl. Rabatt/Zuschlag wenn in quote gespeichert)
  const q = quote as Quote & {
    items: QuoteItem[]
    customer?: Customer | null
    discount_percent?: number
    discount_amount?: number
    surcharge_amount?: number
    surcharge_label?: string
  }
  const baseNet = quote.total_net
  const discountPct = q.discount_percent ?? 0
  const discountAmt = q.discount_amount ?? 0
  const discountValue = discountPct > 0 ? baseNet * (discountPct / 100) : discountAmt
  const surchargeAmt = q.surcharge_amount ?? 0
  const surchargeLabel = q.surcharge_label ?? 'Zuschlag'
  const netAfterDiscount = baseNet - discountValue
  const netWithSurcharge = netAfterDiscount + surchargeAmt
  const totalVat = !isKleinunternehmer && company.vat_rate > 0 ? netWithSurcharge * (company.vat_rate / 100) : 0
  const totalGross = netWithSurcharge + totalVat

  const co = company as Company & { ust_id?: string }

  return (
    <div className="bg-white font-sans text-[#2C2C2C] text-[10px] leading-normal min-h-full">
      {/* A4-artiges Paper-Layout */}
      <div className="px-12 py-10">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-10">
          <div className="max-w-[55%]">
            {company.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logo_url} alt={company.name} className="max-h-16 max-w-[200px] object-contain mb-2" />
            ) : (
              <div className="text-[20px] font-black text-[#2C2C2C] leading-tight mb-1">{company.name}</div>
            )}
            <div className="text-[#666] text-[9px] leading-relaxed whitespace-pre-line">{company.address}</div>
            {co.ust_id && <div className="text-[#666] text-[9px] mt-1">USt-IdNr.: {co.ust_id}</div>}
            {!co.ust_id && company.tax_number && <div className="text-[#666] text-[9px] mt-1">Steuernummer: {company.tax_number}</div>}
            {company.iban && <div className="text-[#666] text-[9px]">IBAN: {company.iban}</div>}
          </div>
          <div>
            <span className="bg-[#F5C400] text-[#2C2C2C] font-black text-[11px] px-4 py-1.5 rounded">{dokumentTitel}</span>
          </div>
        </div>

        {/* META — zweispaltig */}
        <div className="flex gap-10 mb-8">
          <div className="space-y-4 flex-1">
            {quote.customer && (
              <div>
                <div className="text-[#999] uppercase tracking-wider text-[8px] font-bold mb-1">
                  {isRechnung ? 'Rechnung an' : 'Angebot für'}
                </div>
                <div className="font-black text-[11px]">{quote.customer.name}</div>
                {quote.customer.address && (
                  <div className="text-[#666] text-[9px] leading-relaxed whitespace-pre-line">{quote.customer.address}</div>
                )}
                {quote.customer.email && <div className="text-[#666] text-[9px]">{quote.customer.email}</div>}
              </div>
            )}
          </div>
          <div className="space-y-2 text-[9px] text-right min-w-[160px]">
            <div className="flex justify-between gap-4">
              <span className="text-[#999] font-semibold">{isRechnung ? 'Rechnungsnummer:' : 'Angebotsnummer:'}</span>
              <span className="font-black">{quoteNumber}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#999] font-semibold">Datum:</span>
              <span>{fmtDate(quote.created_at)}</span>
            </div>
            {quote.valid_until && (
              <div className="flex justify-between gap-4">
                <span className="text-[#999] font-semibold">{isRechnung ? 'Fällig am:' : 'Gültig bis:'}</span>
                <span>{fmtDate(quote.valid_until)}</span>
              </div>
            )}
            <div className="flex justify-between gap-4">
              <span className="text-[#999] font-semibold">Zahlungsziel:</span>
              <span>{company.payment_days} Tage</span>
            </div>
          </div>
        </div>

        {/* Trennlinie */}
        <div className="border-t border-[#E0E0DE] mb-6" />

        {/* POSITIONEN-TABELLE */}
        <div>
          {/* Tabellenkopf */}
          <div className="bg-[#2C2C2C] text-white flex rounded text-[9px] font-bold py-2 px-2.5 mb-0.5">
            <span style={{ width: '6%' }}>#</span>
            <span style={{ width: '40%' }}>Bezeichnung</span>
            <span style={{ width: '12%', textAlign: 'right' }}>Menge</span>
            <span style={{ width: '10%', textAlign: 'center' }}>Einh.</span>
            <span style={{ width: '16%', textAlign: 'right' }}>Einzelpr.</span>
            <span style={{ width: '16%', textAlign: 'right' }}>Gesamt</span>
          </div>

          {/* Zeilen */}
          {quote.items.map((item, idx) => (
            <div
              key={item.id}
              className={`flex px-2.5 py-2 text-[9px] border-b border-[#F0F0EE] ${idx % 2 !== 0 ? 'bg-[#FAFAF8]' : ''}`}
            >
              <span style={{ width: '6%' }} className="text-[#999]">{item.position}</span>
              <div style={{ width: '40%' }}>
                <span className="font-bold">{item.title}</span>
                {item.description && <div className="text-[#666] mt-0.5">{item.description}</div>}
              </div>
              <span style={{ width: '12%', textAlign: 'right' }}>{item.quantity}</span>
              <span style={{ width: '10%', textAlign: 'center' }}>{item.unit}</span>
              <span style={{ width: '16%', textAlign: 'right' }}>{fmt(item.unit_price)}</span>
              <span style={{ width: '16%', textAlign: 'right' }} className="font-bold">{fmt(item.total_price)}</span>
            </div>
          ))}
        </div>

        {/* SUMMENBLOCK */}
        <div className="flex justify-end mt-4">
          <div className="bg-[#F7F7F5] rounded-lg p-4 w-[45%] text-[9px]">
            <div className="flex justify-between mb-1">
              <span className="text-[#666]">Nettobetrag</span>
              <span>{fmt(baseNet)}</span>
            </div>
            {discountValue > 0 && (
              <div className="flex justify-between mb-1 text-[#F5C400]">
                <span className="font-semibold">Rabatt {discountPct > 0 ? `${discountPct}%` : ''}</span>
                <span>−{fmt(discountValue)}</span>
              </div>
            )}
            {surchargeAmt > 0 && (
              <div className="flex justify-between mb-1">
                <span className="text-[#666]">{surchargeLabel}</span>
                <span>+{fmt(surchargeAmt)}</span>
              </div>
            )}
            {(discountValue > 0 || surchargeAmt > 0) && (
              <div className="flex justify-between mb-1 border-t border-[#E0E0DE] pt-1">
                <span className="text-[#666]">Netto gesamt</span>
                <span>{fmt(netWithSurcharge)}</span>
              </div>
            )}
            {!isKleinunternehmer && company.vat_rate > 0 && (
              <div className="flex justify-between mb-1">
                <span className="text-[#666]">MwSt. {company.vat_rate}%</span>
                <span>{fmt(totalVat)}</span>
              </div>
            )}
            <div className="flex justify-between border-t-2 border-[#2C2C2C] mt-1.5 pt-1.5 font-black text-[12px]">
              <span>Gesamtbetrag</span>
              <span>{fmt(totalGross)}</span>
            </div>
          </div>
        </div>

        {/* §19 UStG */}
        {isKleinunternehmer && (
          <div className="mt-3 bg-[#F7F7F5] rounded px-3 py-2 text-[8px] text-[#666]">
            Kein Ausweis von Umsatzsteuer gemäß § 19 UStG.
          </div>
        )}

        {/* Materialpreis-Hinweis */}
        {company.materialpreis_hinweis_aktiv && (
          <div className="mt-2 bg-[#FFFBEB] rounded px-3 py-2 text-[8px] text-[#92400E]">
            Hinweis: Die angegebenen Preise basieren auf aktuellen Materialkosten und können bei Preisänderungen der Lieferanten angepasst werden.
          </div>
        )}

        {/* Notizen */}
        {quote.notes && (
          <div className="mt-6">
            <div className="text-[#999] uppercase tracking-wider text-[8px] font-bold mb-1">Anmerkungen</div>
            <div className="text-[9px] text-[#444] leading-relaxed">{quote.notes}</div>
          </div>
        )}

        {/* Zahlungsbedingungen */}
        <div className="mt-6 text-[9px] text-[#666]">
          Zahlbar innerhalb von {company.payment_days} Tagen ohne Abzug.
        </div>

        {/* Unterschriftszeilen */}
        <div className="flex gap-16 mt-10">
          <div className="flex-1 border-t border-[#2C2C2C] pt-1.5">
            <span className="text-[8px] text-[#666]">Datum, Unterschrift Auftraggeber</span>
          </div>
          <div className="flex-1 border-t border-[#2C2C2C] pt-1.5">
            <span className="text-[8px] text-[#666]">{company.name}</span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 pt-3 border-t border-[#E0E0DE] flex justify-between text-[8px] text-[#999]">
          <div>
            {company.name} · {company.address?.split('\n')[0]}
            {co.ust_id && ` · USt-IdNr.: ${co.ust_id}`}
            {!co.ust_id && company.tax_number && ` · St.-Nr.: ${company.tax_number}`}
          </div>
          <div className="text-right">
            {dokumentTitel} {quoteNumber}
            {company.iban && ` · IBAN: ${company.iban}`}
          </div>
        </div>

      </div>
    </div>
  )
}
