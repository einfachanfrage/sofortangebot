import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Quote, QuoteItem, Company, Customer, Briefpapier } from './types'

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF',
    fontSize: 10,
    color: '#2C2C2C',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  companyName: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#2C2C2C',
  },
  companyAddress: {
    marginTop: 4,
    color: '#666',
    lineHeight: 1.5,
  },
  badge: {
    backgroundColor: '#F5C400',
    padding: '6 12',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#2C2C2C',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2C',
    padding: '8 10',
    borderRadius: 4,
    marginBottom: 2,
  },
  tableHeaderText: {
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
    fontSize: 9,
  },
  tableRow: {
    flexDirection: 'row',
    padding: '7 10',
    borderBottom: '1 solid #F0F0EE',
  },
  tableRowAlt: {
    flexDirection: 'row',
    padding: '7 10',
    borderBottom: '1 solid #F0F0EE',
    backgroundColor: '#FAFAF8',
  },
  colPos: { width: '6%' },
  colTitle: { width: '40%' },
  colQty: { width: '12%', textAlign: 'right' },
  colUnit: { width: '10%', textAlign: 'center' },
  colPrice: { width: '16%', textAlign: 'right' },
  colTotal: { width: '16%', textAlign: 'right' },
  totalsBox: {
    backgroundColor: '#F7F7F5',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignSelf: 'flex-end',
    width: '45%',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalLabel: { color: '#666', fontSize: 10 },
  totalValue: { fontSize: 10 },
  totalGross: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop: '2 solid #2C2C2C',
    marginTop: 6,
    paddingTop: 6,
  },
  totalGrossLabel: { fontFamily: 'Helvetica-Bold', fontSize: 12 },
  totalGrossValue: { fontFamily: 'Helvetica-Bold', fontSize: 12 },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 48,
    right: 48,
    borderTop: '1 solid #E0E0DE',
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#999',
    fontSize: 8,
  },
})

function formatCurrency(n: number) {
  return n.toFixed(2).replace('.', ',') + ' €'
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

interface Props {
  quote: Quote & { items: QuoteItem[]; customer?: Customer | null }
  company: Company
  quoteNumber: string
  briefpapier?: Briefpapier | null
}

export function AngebotPDF({ quote, company, quoteNumber, briefpapier }: Props) {
  const isKleinunternehmer = company.vat_rate === 0
  const vatLabel = isKleinunternehmer ? 'Gem. §19 UStG keine MwSt.' : `MwSt. ${company.vat_rate}%`

  // Briefpapier-Werte überschreiben Firmendaten falls vorhanden
  const firmenname = briefpapier?.firmenname || company.name
  const adresszeilen = briefpapier?.strasse
    ? [briefpapier.strasse, [briefpapier.plz, briefpapier.ort].filter(Boolean).join(' ')].filter(Boolean).join('\n')
    : company.address
  const akzentfarbe = briefpapier?.akzentfarbe || '#F5C400'
  const fusszeileLinks = briefpapier?.fusszeile_links ?? `${firmenname} · ${adresszeilen?.split('\n')[0] ?? ''}`
  const fusszeileRechts = briefpapier?.fusszeile_rechts ?? (company.iban ? `IBAN: ${company.iban}` : '')
  const fusszeileMitte = briefpapier?.fusszeile_mitte ?? ''

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>{firmenname}</Text>
            {briefpapier?.zusatz && <Text style={{ ...styles.companyAddress, fontFamily: 'Helvetica' }}>{briefpapier.zusatz}</Text>}
            <Text style={styles.companyAddress}>{adresszeilen}</Text>
            {/* Pflichtangaben § 14 UStG */}
            {(company as Company & { ust_id?: string }).ust_id && (
              <Text style={{ ...styles.companyAddress, marginTop: 8 }}>
                USt-IdNr.: {(company as Company & { ust_id?: string }).ust_id}
              </Text>
            )}
            {!((company as Company & { ust_id?: string }).ust_id) && company.tax_number && (
              <Text style={{ ...styles.companyAddress, marginTop: 8 }}>Steuernummer: {company.tax_number}</Text>
            )}
            {company.iban && <Text style={styles.companyAddress}>IBAN: {company.iban}</Text>}
          </View>
          <View>
            <View style={{ ...styles.badge, backgroundColor: akzentfarbe }}>
              <Text style={styles.badgeText}>ANGEBOT</Text>
            </View>
          </View>
        </View>

        {/* Meta */}
        <View style={{ flexDirection: 'row', gap: 40, marginBottom: 32 }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Angebotsnummer</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>{quoteNumber}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datum</Text>
            <Text>{formatDate(quote.created_at)}</Text>
          </View>
          {quote.valid_until && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gültig bis</Text>
              <Text>{formatDate(quote.valid_until)}</Text>
            </View>
          )}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Zahlungsziel</Text>
            <Text>{company.payment_days} Tage</Text>
          </View>
        </View>

        {/* Kunde */}
        {quote.customer && (
          <View style={{ marginBottom: 32 }}>
            <Text style={styles.sectionTitle}>Angebot für</Text>
            <Text style={{ fontFamily: 'Helvetica-Bold' }}>{quote.customer.name}</Text>
            {quote.customer.address && <Text style={{ color: '#666', lineHeight: 1.5 }}>{quote.customer.address}</Text>}
            {quote.customer.email && <Text style={{ color: '#666' }}>{quote.customer.email}</Text>}
          </View>
        )}

        {/* Tabelle Header */}
        <View style={styles.tableHeader}>
          <Text style={{ ...styles.tableHeaderText, ...styles.colPos }}>#</Text>
          <Text style={{ ...styles.tableHeaderText, ...styles.colTitle }}>Bezeichnung</Text>
          <Text style={{ ...styles.tableHeaderText, ...styles.colQty }}>Menge</Text>
          <Text style={{ ...styles.tableHeaderText, ...styles.colUnit }}>Einh.</Text>
          <Text style={{ ...styles.tableHeaderText, ...styles.colPrice }}>Einzelpreis</Text>
          <Text style={{ ...styles.tableHeaderText, ...styles.colTotal }}>Gesamt</Text>
        </View>

        {/* Positionen */}
        {quote.items.map((item, idx) => (
          <View key={item.id} style={idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
            <Text style={styles.colPos}>{item.position}</Text>
            <View style={styles.colTitle}>
              <Text style={{ fontFamily: 'Helvetica-Bold' }}>{item.title}</Text>
              {item.description && <Text style={{ color: '#666', marginTop: 2 }}>{item.description}</Text>}
            </View>
            <Text style={styles.colQty}>{item.quantity}</Text>
            <Text style={styles.colUnit}>{item.unit}</Text>
            <Text style={styles.colPrice}>{formatCurrency(item.unit_price)}</Text>
            <Text style={{ ...styles.colTotal, fontFamily: 'Helvetica-Bold' }}>{formatCurrency(item.total_price)}</Text>
          </View>
        ))}

        {/* Summen */}
        <View style={styles.totalsBox}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Nettobetrag</Text>
            <Text style={styles.totalValue}>{formatCurrency(quote.total_net)}</Text>
          </View>
          {company.vat_rate > 0 ? (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{vatLabel}</Text>
              <Text style={styles.totalValue}>{formatCurrency(quote.total_vat)}</Text>
            </View>
          ) : (
            <View style={styles.totalRow}>
              <Text style={{ ...styles.totalLabel, fontSize: 8 }}>{vatLabel}</Text>
            </View>
          )}
          <View style={styles.totalGross}>
            <Text style={styles.totalGrossLabel}>Gesamtbetrag</Text>
            <Text style={styles.totalGrossValue}>{formatCurrency(quote.total_gross)}</Text>
          </View>
        </View>

        {/* § 19 UStG Pflichthinweis */}
        {isKleinunternehmer && (
          <View style={{ marginTop: 12, padding: '8 12', backgroundColor: '#F7F7F5', borderRadius: 4 }}>
            <Text style={{ fontSize: 8, color: '#666', lineHeight: 1.5 }}>
              Kein Ausweis von Umsatzsteuer gemäß § 19 UStG.
            </Text>
          </View>
        )}

        {/* Materialpreis-Hinweis */}
        {company.materialpreis_hinweis_aktiv && (
          <View style={{ marginTop: 8, padding: '8 12', backgroundColor: '#FFFBEB', borderRadius: 4 }}>
            <Text style={{ fontSize: 8, color: '#92400E', lineHeight: 1.5 }}>
              Hinweis: Die angegebenen Preise basieren auf aktuellen Materialkosten und können bei Preisänderungen der Lieferanten angepasst werden.
            </Text>
          </View>
        )}

        {/* Notizen */}
        {quote.notes && (
          <View style={{ marginTop: 24 }}>
            <Text style={styles.sectionTitle}>Anmerkungen</Text>
            <Text style={{ lineHeight: 1.5, color: '#444' }}>{quote.notes}</Text>
          </View>
        )}

        {/* Unterschrift */}
        <View style={{ marginTop: 40, flexDirection: 'row', gap: 60 }}>
          <View style={{ flex: 1 }}>
            <View style={{ borderTop: '1 solid #2C2C2C', paddingTop: 6 }}>
              <Text style={{ color: '#666', fontSize: 9 }}>Datum, Unterschrift Auftraggeber</Text>
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ borderTop: '1 solid #2C2C2C', paddingTop: 6 }}>
              <Text style={{ color: '#666', fontSize: 9 }}>{company.name}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={{ ...styles.footer, borderTop: `1 solid ${akzentfarbe}` }}>
          <View style={{ flex: 1 }}>
            <Text>{fusszeileLinks}</Text>
            {!(company as Company & { ust_id?: string }).ust_id && company.tax_number && (
              <Text style={{ marginTop: 2 }}>St.-Nr.: {company.tax_number}</Text>
            )}
          </View>
          {fusszeileMitte ? <View style={{ flex: 1, textAlign: 'center' }}><Text>{fusszeileMitte}</Text></View> : null}
          <View style={{ textAlign: 'right' }}>
            <Text>{fusszeileRechts || `Angebot ${quoteNumber}`}</Text>
            {fusszeileRechts && <Text style={{ marginTop: 2 }}>Angebot {quoteNumber}</Text>}
          </View>
        </View>
      </Page>
    </Document>
  )
}
