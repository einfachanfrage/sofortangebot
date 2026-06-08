import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import type { Quote, QuoteItem, Company, Customer } from './types'

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
}

export function AngebotPDF({ quote, company, quoteNumber }: Props) {
  const vatLabel = company.vat_rate === 0 ? 'Gem. §19 UStG keine MwSt.' : `MwSt. ${company.vat_rate}%`

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.companyName}>{company.name}</Text>
            <Text style={styles.companyAddress}>{company.address}</Text>
            {company.tax_number && <Text style={{ ...styles.companyAddress, marginTop: 8 }}>Steuernummer: {company.tax_number}</Text>}
            {company.iban && <Text style={styles.companyAddress}>IBAN: {company.iban}</Text>}
          </View>
          <View>
            <View style={styles.badge}>
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
        <View style={styles.footer}>
          <Text>{company.name} • {company.address?.split('\n')[0]}</Text>
          <Text>Angebot {quoteNumber}</Text>
        </View>
      </Page>
    </Document>
  )
}
