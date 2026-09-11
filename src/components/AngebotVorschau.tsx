'use client'

import type { Quote, QuoteItem, Company, Customer } from '@/lib/types'
import { gruppiereNachStruktur } from '@/lib/angebot-struktur'
import { effektiveOptionen } from '@/lib/angebot-optionen'

interface Props {
  quote: Quote & { items: QuoteItem[]; customer?: Customer | null }
  company: Company
  quoteNumber: string
  modus?: 'angebot' | 'rechnung'
  /**
   * DC-050 (2026-09-11): Rechenweg auf dem Kunden-PDF zeigen? Gleiche
   * Rangfolge wie in lib/pdf.tsx (das echte PDF, gleiche Frage): Prop, dann
   * die am Angebot gespeicherte Antwort (`quote.zeige_rechenweg_auf_pdf`),
   * dann der CI-Handbuch-Standard (sichtbar). Wird von VorschauUndVersand
   * live mitgegeben, während der Handwerker die Frage dort beantwortet —
   * ohne die Prop verhält sich diese Vorschau also identisch zum PDF.
   */
  zeigeRechenweg?: boolean
}

function fmt(n: number) { return n.toFixed(2).replace('.', ',') + ' €' }
function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// DC-049 PDF-Schritt Nachtrag Teil 2 (2026-09-11, Sandy: "hier fehlt die
// raumtrennung... das soll doch genau das gleiche pdf sein"): Eine Zeile war
// hier schon immer eine Zeile — nur flach nach Position, nie nach Raum
// gruppiert, obwohl das echte PDF (lib/pdf.tsx) das längst tut. Dieselbe
// Zeilen-Darstellung jetzt einmal extrahiert, damit sie im flachen UND im
// gruppierten Pfad identisch aussieht.
function PositionsZeile({
  position, idx, title, description, berechnungsweg, annahmen, quantity, unit, unitPrice, totalPrice, zeigeRechenweg,
}: {
  position: number
  idx: number
  title: string
  description?: string | null
  berechnungsweg?: string | null
  annahmen?: string[] | null
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  // DC-050: siehe Props-Kommentar oben — hier nur durchgereicht.
  zeigeRechenweg: boolean
}) {
  return (
    <div className={`flex px-2.5 py-2 text-[9px] border-b border-[#F0F0EE] ${idx % 2 !== 0 ? 'bg-[#FAFAF8]' : ''}`}>
      <span style={{ width: '6%' }} className="text-[#999]">{position}</span>
      <div style={{ width: '40%' }}>
        <span className="font-bold">{title}</span>
        {description && <div className="text-[#666] mt-0.5">{description}</div>}
        {zeigeRechenweg && (
          <div className="font-mono text-[8px] text-[#666] mt-1 leading-relaxed">
            {berechnungsweg || 'Pauschale'}
          </div>
        )}
        {zeigeRechenweg && (annahmen?.length ?? 0) > 0 && (
          <div className="font-mono text-[7.5px] text-[#999] mt-0.5">
            {annahmen!.join(' · ')}
          </div>
        )}
      </div>
      <span style={{ width: '12%', textAlign: 'right' }}>{quantity}</span>
      <span style={{ width: '10%', textAlign: 'center' }}>{unit}</span>
      <span style={{ width: '16%', textAlign: 'right' }}>{fmt(unitPrice)}</span>
      <span style={{ width: '16%', textAlign: 'right' }} className="font-bold">{fmt(totalPrice)}</span>
    </div>
  )
}

export default function AngebotVorschau({ quote, company, quoteNumber, modus = 'angebot', zeigeRechenweg }: Props) {
  const isKleinunternehmer = company.vat_rate === 0
  // DC-050: siehe Props-Kommentar oben — gleiche Rangfolge wie lib/pdf.tsx.
  const rechenwegSichtbar = zeigeRechenweg ?? quote.zeige_rechenweg_auf_pdf ?? true
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

  // Gleiches Muster wie lib/pdf.tsx: Rechenweg/Annahmen stehen an den
  // Rohdaten (quote.items), gruppiereNachStruktur reicht sie an den
  // gruppierten Einträgen nicht durch — deshalb einmal nach id auflösen.
  const opt = effektiveOptionen(quote, company, quote.customer?.ist_unternehmen)
  const rechenwegJeItem = new Map(
    quote.items.map(i => [i.id, { berechnungsweg: i.berechnungsweg, annahmen: i.annahmen }])
  )
  const gruppen = gruppiereNachStruktur(quote.items, opt.struktur)

  return (
    // DC-049 PDF-Schritt Nachtrag (2026-09-11, Sandy: "hier sieht das pdf so
    // aus wenn ich auf vorschau klicke" — diese Live-Vorschau und das echte
    // PDF waren auseinandergelaufen): `font-sans` überschrieb bisher die von
    // `body` geerbte Inter-Schrift mit Tailwinds System-Sans-Stack — diese
    // Vorschau lief nie auf einer Marken-Schrift. Jetzt einfach weglassen und
    // von `body` erben (siehe globals.css), wie der Rest der App.
    <div className="bg-white text-anthracite text-[10px] leading-normal min-h-full">
      {/* A4-artiges Paper-Layout */}
      <div className="px-12 py-10">

        {/* HEADER */}
        <div className="flex justify-between items-start mb-10">
          <div className="max-w-[55%]">
            {company.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={company.logo_url} alt={company.name} className="max-h-16 max-w-[200px] object-contain mb-2" />
            ) : (
              <div className="font-syne text-[20px] font-black text-anthracite leading-tight mb-1">{company.name}</div>
            )}
            <div className="text-[#666] text-[9px] leading-relaxed whitespace-pre-line">{company.address}</div>
            {co.ust_id && <div className="text-[#666] text-[9px] mt-1">USt-IdNr.: {co.ust_id}</div>}
            {!co.ust_id && company.tax_number && <div className="text-[#666] text-[9px] mt-1">Steuernummer: {company.tax_number}</div>}
            {company.iban && <div className="text-[#666] text-[9px]">IBAN: {company.iban}</div>}
          </div>
          <div>
            {/* DC-049 PDF-Schritt Nachtrag (2026-09-11): war ein gelber Pill —
                das echte Kunden-PDF (lib/pdf.tsx, S.angebotLabel) ist auf
                Sandys Entscheidung hin bewusst neutral/grau, kein Gelb-Akzent.
                Diese Vorschau behauptet "so sieht dein Angebot für den Kunden
                aus" und muss deshalb dieselbe Farbgebung/Typografie zeigen. */}
            <span className="text-[#999] uppercase tracking-wider text-[9px] font-bold">{dokumentTitel}</span>
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
          <div className="bg-anthracite text-white flex rounded text-[9px] font-bold py-2 px-2.5 mb-0.5">
            <span style={{ width: '6%' }}>#</span>
            <span style={{ width: '40%' }}>Bezeichnung</span>
            <span style={{ width: '12%', textAlign: 'right' }}>Menge</span>
            <span style={{ width: '10%', textAlign: 'center' }}>Einh.</span>
            <span style={{ width: '16%', textAlign: 'right' }}>Einzelpr.</span>
            <span style={{ width: '16%', textAlign: 'right' }}>Gesamt</span>
          </div>

          {/* Zeilen — DC-049 PDF-Schritt Nachtrag Teil 2 (2026-09-11): jetzt
              nach Raum/Gewerk/Arbeitsablauf gruppiert wie das echte PDF
              (gruppiereNachStruktur), statt immer flach nach Position. */}
          {!gruppen ? (
            quote.items.map((item, idx) => (
              <PositionsZeile
                key={item.id}
                position={item.position}
                idx={idx}
                title={item.title}
                description={item.description}
                berechnungsweg={item.berechnungsweg}
                annahmen={item.annahmen}
                quantity={item.quantity}
                unit={item.unit}
                unitPrice={item.unit_price}
                totalPrice={item.total_price}
                zeigeRechenweg={rechenwegSichtbar}
              />
            ))
          ) : (() => {
            const { raeume, allgemein, hatMehrereRaeume } = gruppen
            const sektionen = [
              ...raeume.map(r => ({ typ: 'raum' as const, raum: r })),
              ...(allgemein.length > 0 ? [{ typ: 'allgemein' as const, raum: null }] : []),
            ]
            return sektionen.map(sek => (
              <div key={sek.typ === 'raum' ? sek.raum!.raumName : 'allg'}>
                <div className="bg-bg px-2.5 py-1.5 mt-3 first:mt-0">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-[#999]">
                    {sek.typ === 'raum' ? sek.raum!.raumName : 'Allgemein'}
                  </span>
                </div>
                {(sek.typ === 'raum' ? sek.raum!.items : allgemein).map((gi, idx) => (
                  <PositionsZeile
                    key={gi.id}
                    position={gi.position}
                    idx={idx}
                    title={gi.titleDisplay}
                    description={gi.description}
                    berechnungsweg={rechenwegJeItem.get(gi.id)?.berechnungsweg}
                    annahmen={rechenwegJeItem.get(gi.id)?.annahmen}
                    quantity={gi.quantity}
                    unit={gi.unit}
                    unitPrice={gi.unit_price}
                    totalPrice={gi.total_price}
                    zeigeRechenweg={rechenwegSichtbar}
                  />
                ))}
                {hatMehrereRaeume && sek.typ === 'raum' && (
                  <div className="flex justify-end px-2.5 py-1.5 text-[8px]">
                    <span className="text-[#999] mr-3">Summe {sek.raum!.raumName}</span>
                    <span className="text-[#666] min-w-[60px] text-right">{fmt(sek.raum!.summe)}</span>
                  </div>
                )}
              </div>
            ))
          })()}
        </div>

        {/* SUMMENBLOCK */}
        <div className="flex justify-end mt-4">
          <div className="bg-bg rounded-lg p-4 w-[45%] text-[9px]">
            <div className="flex justify-between mb-1">
              <span className="text-[#666]">Nettobetrag</span>
              <span>{fmt(baseNet)}</span>
            </div>
            {discountValue > 0 && (
              <div className="flex justify-between mb-1 text-yellow">
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
            <div className="flex justify-between border-t-2 border-anthracite mt-1.5 pt-1.5 font-black text-[12px]">
              <span>Gesamtbetrag</span>
              <span>{fmt(totalGross)}</span>
            </div>
          </div>
        </div>

        {/* §19 UStG */}
        {isKleinunternehmer && (
          <div className="mt-3 bg-bg rounded px-3 py-2 text-[8px] text-[#666]">
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
          <div className="flex-1 border-t border-anthracite pt-1.5">
            <span className="text-[8px] text-[#666]">Datum, Unterschrift Auftraggeber</span>
          </div>
          <div className="flex-1 border-t border-anthracite pt-1.5">
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

      {/* KI-Hinweis — nur in Web-Vorschau, nicht im PDF */}
      <div className="mt-3 px-2 text-[10px] text-anthracite/30 font-medium text-center">
        Bitte Angebot vor dem Versand prüfen. Sofortangebot haftet nicht für fehlerhafte Berechnungen.
      </div>

    </div>
  )
}
