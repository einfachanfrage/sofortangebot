import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import type { Quote, QuoteItem, Company, Customer, Briefpapier } from './types'
import { gruppiereNachRaum } from './angebot-gruppierung'

// ── Hilfsfunktionen ────────────────────────────────────────────────────────
function fmtEuro(n: number) {
  return n.toFixed(2).replace('.', ',') + ' €'
}
function fmtDatum(d: string) {
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ── Styles ─────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#1A1A1A',
    paddingTop: 56,
    paddingBottom: 72,
    paddingHorizontal: 56,
    backgroundColor: '#FFFFFF',
  },

  // ── Header (dreispaltig) ──
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
    paddingBottom: 16,
    borderBottom: '1 solid #DDDDDD',
  },
  headerCol: { flex: 1 },
  headerColMid: { flex: 1, alignItems: 'center' },
  headerColRight: { flex: 1, alignItems: 'flex-end' },
  logoImg: { width: 80, height: 40, objectFit: 'contain', marginBottom: 6 },
  firmennameH: { fontFamily: 'Helvetica-Bold', fontSize: 11, marginBottom: 3 },
  headerSmall: { fontSize: 8, color: '#555', lineHeight: 1.5 },
  headerLabel: { fontSize: 7, color: '#888', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },

  // ── Adressblock ──
  adressBlock: { marginBottom: 20 },
  absender: { fontSize: 7, color: '#888', borderBottom: '0.5 solid #CCCCCC', paddingBottom: 2, marginBottom: 6 },
  empfaenger: { fontSize: 9, lineHeight: 1.6 },
  empfaengerName: { fontFamily: 'Helvetica-Bold', fontSize: 10 },

  // ── Angebotskopf ──
  kopfRow: { flexDirection: 'row', gap: 32, marginBottom: 20 },
  kopfLabel: { fontSize: 7, color: '#888', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  kopfWert: { fontSize: 9, fontFamily: 'Helvetica-Bold' },

  // ── Betreff ──
  betreff: { fontSize: 10, fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  anrede: { fontSize: 9, color: '#444', marginBottom: 16 },

  // ── Tabelle ──
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F2',
    borderTop: '1 solid #CCCCCC',
    borderBottom: '1 solid #CCCCCC',
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  tableHeaderText: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: '#444' },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottom: '0.5 solid #EEEEEE',
  },
  raumKopf: {
    flexDirection: 'row',
    backgroundColor: '#F7F7F7',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderTop: '0.5 solid #DDDDDD',
    marginTop: 4,
  },
  raumKopfText: { fontFamily: 'Helvetica-Bold', fontSize: 8, color: '#444', textTransform: 'uppercase', letterSpacing: 0.5 },

  // ── Spaltendefinitionen ──
  cPos:   { width: '6%' },
  cBez:   { width: '42%' },
  cMenge: { width: '10%', textAlign: 'right' },
  cEinh:  { width: '16%', textAlign: 'center' },
  cEinzel:{ width: '13%', textAlign: 'right' },
  cGes:   { width: '13%', textAlign: 'right' },

  // ── Summen ──
  summenBox: {
    alignSelf: 'flex-end',
    width: '42%',
    marginTop: 16,
    borderTop: '1 solid #CCCCCC',
  },
  summenZeile: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3, paddingHorizontal: 4 },
  summenLabel: { fontSize: 9, color: '#444' },
  summenWert: { fontSize: 9 },
  summenGesamt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderTop: '1.5 solid #1A1A1A',
    marginTop: 2,
  },
  summenGesamtText: { fontFamily: 'Helvetica-Bold', fontSize: 10 },

  // ── Schlussbereich ──
  schluss: { marginTop: 28 },
  schlussText: { fontSize: 9, color: '#444', lineHeight: 1.6, marginBottom: 20 },
  zahlungsziel: { fontSize: 9, color: '#444', marginBottom: 28 },
  unterschriftRow: { flexDirection: 'row', gap: 40, marginTop: 16 },
  unterschriftLinie: { borderTop: '0.5 solid #999', paddingTop: 4, flex: 1 },
  unterschriftLabel: { fontSize: 8, color: '#888' },

  // ── Footer (fixed, jede Seite) ──
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 56,
    right: 56,
    borderTop: '0.5 solid #CCCCCC',
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: { fontSize: 7, color: '#888', lineHeight: 1.5 },
})

// ── Props ──────────────────────────────────────────────────────────────────
interface Props {
  quote: Quote & { items: QuoteItem[]; customer?: Customer | null }
  company: Company
  quoteNumber: string
  briefpapier?: Briefpapier | null
  logoBase64?: string | null
}

// ── Hauptkomponente ────────────────────────────────────────────────────────
export function AngebotPDF({ quote, company, quoteNumber, briefpapier, logoBase64 }: Props) {
  const isKleinunternehmer = company.vat_rate === 0
  const vatRate = company.vat_rate

  // Briefpapier-Werte nehmen Vorrang
  const firmenname    = briefpapier?.firmenname || company.name
  const strasse       = briefpapier?.strasse    || ''
  const plzOrt        = [briefpapier?.plz, briefpapier?.ort].filter(Boolean).join(' ')
  const adresse       = company.address || [strasse, plzOrt].filter(Boolean).join('\n')
  const telefon       = briefpapier?.telefon    || ''
  const email         = briefpapier?.email      || ''
  const website       = briefpapier?.website    || ''
  const ustId         = (company as Company & { ust_id?: string }).ust_id || ''
  const steuernummer  = company.tax_number || ''
  const iban          = company.iban || ''
  const zahlungsTage  = company.payment_days || 14
  const logoSrc       = logoBase64 || briefpapier?.logo_url || (company as Company & { logo_url?: string }).logo_url

  // Footer-Texte
  const footerLinks  = [firmenname, adresse?.split('\n')[0]].filter(Boolean).join(' · ')
  const footerMitte  = [ustId && `USt-IdNr.: ${ustId}`, steuernummer && `St.-Nr.: ${steuernummer}`].filter(Boolean).join('  |  ')
  const footerRechts = iban ? `IBAN: ${iban}` : ''

  // Projektbeschreibung aus erstem Item-Raum ableiten
  const ersterRaum = quote.items[0]?.title?.split(' — ')[1] ?? ''
  const projektBeschreibung = [
    company.gewerke?.[0] ? `${company.gewerke[0].charAt(0).toUpperCase() + company.gewerke[0].slice(1)}arbeiten` : 'Handwerkerleistungen',
    ersterRaum && `– ${ersterRaum}`,
  ].filter(Boolean).join(' ')

  return (
    <Document>
      <Page size="A4" style={S.page} wrap>

        {/* ── HEADER (dreispaltig) ──────────────────────────────────────── */}
        <View style={S.headerRow} fixed>
          {/* Links: Logo + Firmendaten */}
          <View style={S.headerCol}>
            {logoSrc && <Image src={logoSrc} style={S.logoImg} />}
            <Text style={S.firmennameH}>{firmenname}</Text>
            {adresse && <Text style={S.headerSmall}>{adresse}</Text>}
            {telefon  && <Text style={S.headerSmall}>Tel.: {telefon}</Text>}
            {email    && <Text style={S.headerSmall}>{email}</Text>}
            {website  && <Text style={S.headerSmall}>{website}</Text>}
          </View>

          {/* Mitte: Steuer */}
          <View style={S.headerColMid}>
            {ustId       && <><Text style={S.headerLabel}>USt-IdNr.</Text><Text style={S.headerSmall}>{ustId}</Text></>}
            {steuernummer && <><Text style={{ ...S.headerLabel, marginTop: 6 }}>Steuernummer</Text><Text style={S.headerSmall}>{steuernummer}</Text></>}
          </View>

          {/* Rechts: Bankverbindung */}
          <View style={S.headerColRight}>
            {iban && (
              <>
                <Text style={S.headerLabel}>Bankverbindung</Text>
                <Text style={S.headerSmall}>{company.name}</Text>
                <Text style={S.headerSmall}>IBAN: {iban}</Text>
              </>
            )}
          </View>
        </View>

        {/* ── ANGEBOTSKOPF ─────────────────────────────────────────────── */}
        {/* Empfänger-Adresse (Sichtfenster-Format) */}
        <View style={S.adressBlock}>
          <Text style={S.absender}>{firmenname} · {adresse?.split('\n')[0] ?? ''}</Text>
          {quote.customer ? (
            <View>
              <Text style={S.empfaengerName}>{quote.customer.name}</Text>
              {quote.customer.address && <Text style={S.empfaenger}>{quote.customer.address}</Text>}
            </View>
          ) : (
            <Text style={{ ...S.empfaenger, color: '#AAA' }}>(Kein Kunde angegeben)</Text>
          )}
        </View>

        {/* Angebotsdaten */}
        <View style={S.kopfRow}>
          <View>
            <Text style={S.kopfLabel}>Angebotsnummer</Text>
            <Text style={S.kopfWert}>{quoteNumber}</Text>
          </View>
          <View>
            <Text style={S.kopfLabel}>Datum</Text>
            <Text style={S.kopfWert}>{fmtDatum(quote.created_at)}</Text>
          </View>
          {quote.valid_until && (
            <View>
              <Text style={S.kopfLabel}>Gültig bis</Text>
              <Text style={S.kopfWert}>{fmtDatum(quote.valid_until)}</Text>
            </View>
          )}
          <View>
            <Text style={S.kopfLabel}>Zahlungsziel</Text>
            <Text style={S.kopfWert}>{zahlungsTage} Tage</Text>
          </View>
        </View>

        {/* Betreff + Anrede */}
        <Text style={S.betreff}>{projektBeschreibung}</Text>
        <Text style={S.anrede}>Gerne bieten wir Ihnen an:</Text>

        {/* ── TABELLE ──────────────────────────────────────────────────── */}
        {/* Tabellenkopf */}
        <View style={S.tableHeader}>
          <Text style={{ ...S.tableHeaderText, ...S.cPos }}>Pos.</Text>
          <Text style={{ ...S.tableHeaderText, ...S.cBez }}>Bezeichnung</Text>
          <Text style={{ ...S.tableHeaderText, ...S.cMenge }}>Menge</Text>
          <Text style={{ ...S.tableHeaderText, ...S.cEinh }}>Einheit</Text>
          <Text style={{ ...S.tableHeaderText, ...S.cEinzel }}>Einzel €</Text>
          <Text style={{ ...S.tableHeaderText, ...S.cGes }}>Gesamt €</Text>
        </View>

        {/* Positionen */}
        {(() => {
          const gruppen = gruppiereNachRaum(quote.items)
          const mwstSuffix = isKleinunternehmer ? '' : ` ${vatRate}% MWSt.`

          if (!gruppen || (!gruppen.hatMehrereRaeume && gruppen.allgemein.length === 0)) {
            return quote.items.map((item, idx) => (
              <View key={item.id} style={S.tableRow} wrap={false}>
                <Text style={S.cPos}>{idx + 1}</Text>
                <View style={S.cBez}>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>{item.title}</Text>
                  {item.description && <Text style={{ fontSize: 8, color: '#555', marginTop: 1 }}>{item.description}</Text>}
                </View>
                <Text style={S.cMenge}>{item.quantity}</Text>
                <Text style={S.cEinh}>{item.unit}{mwstSuffix}</Text>
                <Text style={S.cEinzel}>{fmtEuro(item.unit_price)}</Text>
                <Text style={{ ...S.cGes, fontFamily: 'Helvetica-Bold' }}>{fmtEuro(item.total_price)}</Text>
              </View>
            ))
          }

          const { raeume, allgemein, hatMehrereRaeume } = gruppen
          const sektionen = [
            ...raeume.map(r => ({ typ: 'raum' as const, raum: r })),
            ...(allgemein.length > 0 ? [{ typ: 'allgemein' as const, raum: null }] : []),
          ]

          return sektionen.map(sek => (
            <View key={sek.typ === 'raum' ? sek.raum!.raumName : 'allg'}>
              {/* Raum-Überschrift */}
              {hatMehrereRaeume && (
                <View style={S.raumKopf} wrap={false}>
                  <Text style={{ ...S.raumKopfText, ...S.cPos }}></Text>
                  <Text style={{ ...S.raumKopfText, flex: 1 }}>
                    {sek.typ === 'raum' ? sek.raum!.raumName : 'Allgemein'}
                  </Text>
                </View>
              )}

              {/* Positionen */}
              {(sek.typ === 'raum' ? sek.raum!.items : allgemein).map((gi, idx) => (
                <View key={gi.id} style={S.tableRow} wrap={false}>
                  <Text style={S.cPos}>{gi.position}</Text>
                  <View style={S.cBez}>
                    <Text style={{ fontFamily: 'Helvetica-Bold', fontSize: 9 }}>{gi.titleDisplay}</Text>
                    {gi.description && <Text style={{ fontSize: 8, color: '#555', marginTop: 1 }}>{gi.description}</Text>}
                  </View>
                  <Text style={S.cMenge}>{gi.quantity}</Text>
                  <Text style={S.cEinh}>{gi.unit}{mwstSuffix}</Text>
                  <Text style={S.cEinzel}>{fmtEuro(gi.unit_price)}</Text>
                  <Text style={{ ...S.cGes, fontFamily: 'Helvetica-Bold' }}>{fmtEuro(gi.total_price)}</Text>
                </View>
              ))}

              {/* Zwischensumme Raum */}
              {hatMehrereRaeume && sek.typ === 'raum' && (
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingVertical: 3, paddingHorizontal: 6, borderTop: '0.5 solid #DDDDDD' }}>
                  <Text style={{ fontSize: 8, color: '#666', marginRight: 8 }}>Summe {sek.raum!.raumName}</Text>
                  <Text style={{ fontSize: 8, fontFamily: 'Helvetica-Bold' }}>{fmtEuro(sek.raum!.summe)}</Text>
                </View>
              )}
            </View>
          ))
        })()}

        {/* Anmerkungen aus KI (z.B. Kleinmaterial-Pauschale) */}
        {quote.notes && (
          <View style={{ marginTop: 10, paddingTop: 6, borderTop: '0.5 solid #EEEEEE' }}>
            <Text style={{ fontSize: 8, color: '#555', fontFamily: 'Helvetica-Bold', marginBottom: 2 }}>Anmerkungen</Text>
            <Text style={{ fontSize: 8, color: '#555', lineHeight: 1.5 }}>{quote.notes}</Text>
          </View>
        )}

        {/* ── SUMMEN ───────────────────────────────────────────────────── */}
        <View style={S.summenBox}>
          <View style={S.summenZeile}>
            <Text style={S.summenLabel}>Zwischensumme (netto)</Text>
            <Text style={S.summenWert}>{fmtEuro(quote.total_net)}</Text>
          </View>
          {isKleinunternehmer ? (
            <View style={S.summenZeile}>
              <Text style={{ ...S.summenLabel, fontSize: 8 }}>Gem. §19 UStG keine MwSt.</Text>
            </View>
          ) : (
            <View style={S.summenZeile}>
              <Text style={S.summenLabel}>Umsatzsteuer {vatRate} %</Text>
              <Text style={S.summenWert}>{fmtEuro(quote.total_vat)}</Text>
            </View>
          )}
          <View style={S.summenGesamt}>
            <Text style={S.summenGesamtText}>Gesamtbetrag</Text>
            <Text style={S.summenGesamtText}>{fmtEuro(quote.total_gross)}</Text>
          </View>
        </View>

        {/* Zahlungsziel */}
        <Text style={{ ...S.zahlungsziel, marginTop: 8, fontSize: 8, color: '#555' }}>
          Zahlungsziel: {zahlungsTage} Tage ohne Abzug
        </Text>

        {/* ── SCHLUSS ──────────────────────────────────────────────────── */}
        <View style={S.schluss}>
          <Text style={S.schlussText}>
            Wir freuen uns auf Ihre Auftragserteilung und sichern eine fachgerechte und einwandfreie Ausführung zu.
          </Text>
        </View>

        {/* Normverweise */}
        {(() => {
          const vobNormen = [...new Set(quote.items.map(i => i.vob_norm).filter(Boolean))] as string[]
          const dinNormen = [...new Set(quote.items.flatMap(i => i.din_normen ?? []))]
          if (vobNormen.length === 0 && dinNormen.length === 0) return null
          return (
            <View style={{ marginTop: 8, paddingTop: 6, borderTop: '0.5 solid #EEEEEE' }}>
              <Text style={{ fontSize: 7, color: '#AAA', lineHeight: 1.5 }}>
                Normgrundlagen: {[...vobNormen, ...dinNormen].join(' · ')}
              </Text>
            </View>
          )
        })()}

        {/* Unterschrift */}
        <View style={{ ...S.unterschriftRow, marginTop: 32 }}>
          <View style={S.unterschriftLinie}>
            <Text style={S.unterschriftLabel}>Datum, Unterschrift Auftraggeber</Text>
          </View>
          <View style={S.unterschriftLinie}>
            <Text style={S.unterschriftLabel}>{company.name}</Text>
          </View>
        </View>

        {/* ── FOOTER (fixed, wiederholt auf jeder Seite) ────────────────── */}
        <View style={S.footer} fixed>
          <View style={{ flex: 1 }}>
            <Text style={S.footerText}>{footerLinks}</Text>
          </View>
          {footerMitte ? (
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={S.footerText}>{footerMitte}</Text>
            </View>
          ) : <View style={{ flex: 1 }} />}
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            {footerRechts && <Text style={S.footerText}>{footerRechts}</Text>}
            <Text style={S.footerText} render={({ pageNumber, totalPages }) => `Seite ${pageNumber}/${totalPages}`} />
          </View>
        </View>

      </Page>
    </Document>
  )
}
