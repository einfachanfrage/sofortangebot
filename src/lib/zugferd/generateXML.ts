// ZUGFeRD 2.3 / Factur-X EN 16931 XML Generator
// Spec: https://www.ferd-net.de/standards/zugferd-2.3/

export interface ZUGFeRDPosition {
  id: number
  bezeichnung: string
  beschreibung?: string | null
  menge: number
  einheit: string
  einzelpreis: number
  gesamtpreis: number
  steuersatz: number
}

export interface ZUGFeRDRechnung {
  nummer: string
  datum: Date
  faelligkeitsdatum: Date
  verkäufer: {
    name: string
    adresse: string
    steuernummer?: string | null
    ustId?: string | null
    iban?: string | null
  }
  käufer: {
    name: string
    adresse?: string | null
    ustId?: string | null
    leitwegId?: string | null
  }
  positionen: ZUGFeRDPosition[]
  summen: {
    netto: number
    mwst: number
    brutto: number
  }
  isKleinunternehmer: boolean
  waehrung?: string
}

// UN/CEFACT unit codes
const UNIT_MAP: Record<string, string> = {
  'stk': 'C62', 'stück': 'C62', 'stücke': 'C62', 'pcs': 'C62',
  'std': 'HUR', 'stunde': 'HUR', 'stunden': 'HUR', 'h': 'HUR',
  'm²': 'MTK', 'm2': 'MTK', 'qm': 'MTK',
  'm³': 'MTQ', 'm3': 'MTQ', 'cbm': 'MTQ',
  'm': 'MTR', 'lfdm': 'MTR', 'lfm': 'MTR',
  'kg': 'KGM',
  'pauschale': 'LS', 'pauschal': 'LS', 'ls': 'LS', 'pos': 'LS',
  'tag': 'DAY', 'tage': 'DAY',
  'monat': 'MON', 'monate': 'MON',
}

function toUnitCode(unit: string): string {
  return UNIT_MAP[unit.toLowerCase().trim()] ?? 'C62'
}

function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

function formatAmount(n: number): string {
  return n.toFixed(2)
}

// Parse German address "Musterstr. 1, 12345 Berlin" into components
function parseAddress(addr: string): { lineOne: string; postcode: string; city: string; country: string } {
  const parts = addr.split(',').map(s => s.trim())
  if (parts.length >= 2) {
    const lineOne = parts[0]
    const cityPart = parts[parts.length - 1]
    const match = cityPart.match(/^(\d{5})\s+(.+)$/)
    if (match) {
      return { lineOne, postcode: match[1], city: match[2], country: 'DE' }
    }
    return { lineOne, postcode: '', city: cityPart, country: 'DE' }
  }
  return { lineOne: addr, postcode: '', city: '', country: 'DE' }
}

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function sellerAddress(adresse: string): string {
  const a = parseAddress(adresse)
  return `
        <ram:PostalTradeAddress>
          <ram:PostcodeCode>${xmlEscape(a.postcode)}</ram:PostcodeCode>
          <ram:LineOne>${xmlEscape(a.lineOne)}</ram:LineOne>
          <ram:CityName>${xmlEscape(a.city)}</ram:CityName>
          <ram:CountryID>${a.country}</ram:CountryID>
        </ram:PostalTradeAddress>`
}

function buyerAddress(adresse?: string | null): string {
  if (!adresse) return `
        <ram:PostalTradeAddress>
          <ram:CountryID>DE</ram:CountryID>
        </ram:PostalTradeAddress>`
  const a = parseAddress(adresse)
  return `
        <ram:PostalTradeAddress>
          ${a.postcode ? `<ram:PostcodeCode>${xmlEscape(a.postcode)}</ram:PostcodeCode>` : ''}
          <ram:LineOne>${xmlEscape(a.lineOne)}</ram:LineOne>
          ${a.city ? `<ram:CityName>${xmlEscape(a.city)}</ram:CityName>` : ''}
          <ram:CountryID>${a.country}</ram:CountryID>
        </ram:PostalTradeAddress>`
}

export function generateZUGFeRDXml(r: ZUGFeRDRechnung): string {
  const currency = r.waehrung ?? 'EUR'

  // Group taxes — Kleinunternehmer has one exempt group, otherwise group by rate
  const taxGroups = r.isKleinunternehmer
    ? [{ rate: 0, netto: r.summen.netto, mwst: 0, code: 'E' }]
    : groupByTaxRate(r.positionen)

  const lineItems = r.positionen.map((p, idx) => {
    const vatCode = r.isKleinunternehmer ? 'E' : 'S'
    return `
    <ram:IncludedSupplyChainTradeLineItem>
      <ram:AssociatedDocumentLineDocument>
        <ram:LineID>${idx + 1}</ram:LineID>
      </ram:AssociatedDocumentLineDocument>
      <ram:SpecifiedTradeProduct>
        <ram:Name>${xmlEscape(p.bezeichnung)}</ram:Name>
        ${p.beschreibung ? `<ram:Description>${xmlEscape(p.beschreibung)}</ram:Description>` : ''}
      </ram:SpecifiedTradeProduct>
      <ram:SpecifiedLineTradeAgreement>
        <ram:NetPriceProductTradePrice>
          <ram:ChargeAmount>${formatAmount(p.einzelpreis)}</ram:ChargeAmount>
        </ram:NetPriceProductTradePrice>
      </ram:SpecifiedLineTradeAgreement>
      <ram:SpecifiedLineTradeDelivery>
        <ram:BilledQuantity unitCode="${toUnitCode(p.einheit)}">${formatAmount(p.menge)}</ram:BilledQuantity>
      </ram:SpecifiedLineTradeDelivery>
      <ram:SpecifiedLineTradeSettlement>
        <ram:ApplicableTradeTax>
          <ram:TypeCode>VAT</ram:TypeCode>
          <ram:CategoryCode>${vatCode}</ram:CategoryCode>
          ${!r.isKleinunternehmer ? `<ram:RateApplicablePercent>${p.steuersatz}</ram:RateApplicablePercent>` : ''}
        </ram:ApplicableTradeTax>
        <ram:SpecifiedTradeSettlementLineMonetarySummation>
          <ram:LineTotalAmount>${formatAmount(p.gesamtpreis)}</ram:LineTotalAmount>
        </ram:SpecifiedTradeSettlementLineMonetarySummation>
      </ram:SpecifiedLineTradeSettlement>
    </ram:IncludedSupplyChainTradeLineItem>`
  }).join('')

  const taxBlocks = taxGroups.map(tg => `
      <ram:ApplicableTradeTax>
        <ram:CalculatedAmount>${formatAmount(tg.mwst)}</ram:CalculatedAmount>
        <ram:TypeCode>VAT</ram:TypeCode>
        ${r.isKleinunternehmer ? '<ram:ExemptionReason>Umsatzsteuerbefreiung gemäß § 19 UStG (Kleinunternehmerregelung)</ram:ExemptionReason>' : ''}
        <ram:BasisAmount>${formatAmount(tg.netto)}</ram:BasisAmount>
        <ram:CategoryCode>${tg.code}</ram:CategoryCode>
        ${!r.isKleinunternehmer ? `<ram:RateApplicablePercent>${tg.rate}</ram:RateApplicablePercent>` : ''}
      </ram:ApplicableTradeTax>`).join('')

  const sellerTaxBlock = r.verkäufer.ustId
    ? `<ram:SpecifiedTaxRegistration>
          <ram:ID schemeID="VA">${xmlEscape(r.verkäufer.ustId)}</ram:ID>
        </ram:SpecifiedTaxRegistration>`
    : r.verkäufer.steuernummer
    ? `<ram:SpecifiedTaxRegistration>
          <ram:ID schemeID="FC">${xmlEscape(r.verkäufer.steuernummer)}</ram:ID>
        </ram:SpecifiedTaxRegistration>`
    : ''

  const ibanBlock = r.verkäufer.iban ? `
      <ram:SpecifiedTradeSettlementPaymentMeans>
        <ram:TypeCode>58</ram:TypeCode>
        <ram:PayeePartyCreditorFinancialAccount>
          <ram:IBANID>${xmlEscape(r.verkäufer.iban.replace(/\s/g, ''))}</ram:IBANID>
        </ram:PayeePartyCreditorFinancialAccount>
      </ram:SpecifiedTradeSettlementPaymentMeans>` : ''

  const buyerVatBlock = r.käufer.ustId ? `
        <ram:SpecifiedTaxRegistration>
          <ram:ID schemeID="VA">${xmlEscape(r.käufer.ustId)}</ram:ID>
        </ram:SpecifiedTaxRegistration>` : ''

  const leitwegBlock = r.käufer.leitwegId ? `
      <ram:BuyerOrderReferencedDocument>
        <ram:IssuerAssignedID>${xmlEscape(r.käufer.leitwegId)}</ram:IssuerAssignedID>
      </ram:BuyerOrderReferencedDocument>` : ''

  return `<?xml version="1.0" encoding="UTF-8"?>
<rsm:CrossIndustryInvoice
  xmlns:rsm="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100"
  xmlns:ram="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100"
  xmlns:udt="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100">

  <rsm:ExchangedDocumentContext>
    <ram:GuidelineSpecifiedDocumentContextParameter>
      <ram:ID>urn:cen.eu:en16931:2017#compliant#urn:factur-x.eu:1p0:en16931</ram:ID>
    </ram:GuidelineSpecifiedDocumentContextParameter>
  </rsm:ExchangedDocumentContext>

  <rsm:ExchangedDocument>
    <ram:ID>${xmlEscape(r.nummer)}</ram:ID>
    <ram:TypeCode>380</ram:TypeCode>
    <ram:IssueDateTime>
      <udt:DateTimeString format="102">${formatDate(r.datum)}</udt:DateTimeString>
    </ram:IssueDateTime>
  </rsm:ExchangedDocument>

  <rsm:SupplyChainTradeTransaction>
    ${lineItems}

    <ram:ApplicableHeaderTradeAgreement>
      <ram:SellerTradeParty>
        <ram:Name>${xmlEscape(r.verkäufer.name)}</ram:Name>
        ${sellerAddress(r.verkäufer.adresse)}
        ${sellerTaxBlock}
      </ram:SellerTradeParty>
      <ram:BuyerTradeParty>
        <ram:Name>${xmlEscape(r.käufer.name)}</ram:Name>
        ${buyerAddress(r.käufer.adresse)}
        ${buyerVatBlock}
      </ram:BuyerTradeParty>
      ${leitwegBlock}
    </ram:ApplicableHeaderTradeAgreement>

    <ram:ApplicableHeaderTradeDelivery />

    <ram:ApplicableHeaderTradeSettlement>
      <ram:PaymentReference>${xmlEscape(r.nummer)}</ram:PaymentReference>
      <ram:InvoiceCurrencyCode>${currency}</ram:InvoiceCurrencyCode>
      ${ibanBlock}
      ${taxBlocks}
      <ram:SpecifiedTradePaymentTerms>
        <ram:DueDateDateTime>
          <udt:DateTimeString format="102">${formatDate(r.faelligkeitsdatum)}</udt:DateTimeString>
        </ram:DueDateDateTime>
      </ram:SpecifiedTradePaymentTerms>
      <ram:SpecifiedTradeSettlementHeaderMonetarySummation>
        <ram:LineTotalAmount>${formatAmount(r.summen.netto)}</ram:LineTotalAmount>
        <ram:TaxBasisTotalAmount>${formatAmount(r.summen.netto)}</ram:TaxBasisTotalAmount>
        <ram:TaxTotalAmount currencyID="${currency}">${formatAmount(r.summen.mwst)}</ram:TaxTotalAmount>
        <ram:GrandTotalAmount>${formatAmount(r.summen.brutto)}</ram:GrandTotalAmount>
        <ram:DuePayableAmount>${formatAmount(r.summen.brutto)}</ram:DuePayableAmount>
      </ram:SpecifiedTradeSettlementHeaderMonetarySummation>
    </ram:ApplicableHeaderTradeSettlement>
  </rsm:SupplyChainTradeTransaction>

</rsm:CrossIndustryInvoice>`
}

function groupByTaxRate(positionen: ZUGFeRDPosition[]): Array<{ rate: number; netto: number; mwst: number; code: string }> {
  const groups = new Map<number, { netto: number; mwst: number }>()
  for (const p of positionen) {
    const existing = groups.get(p.steuersatz) ?? { netto: 0, mwst: 0 }
    const mwst = p.gesamtpreis * (p.steuersatz / 100)
    groups.set(p.steuersatz, {
      netto: existing.netto + p.gesamtpreis,
      mwst: existing.mwst + mwst,
    })
  }
  return Array.from(groups.entries()).map(([rate, { netto, mwst }]) => ({
    rate,
    netto,
    mwst,
    code: rate === 0 ? 'E' : 'S',
  }))
}
