import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import type { AngebotsFoto } from '@/lib/angebot-fotos'
import type { Quote, QuoteItem, Company, Customer, Briefpapier } from './types'
import { gruppiereNachStruktur } from './angebot-struktur'
import { widerrufsbelehrungText, musterWiderrufsformular } from './widerrufsbelehrung'
import { effektiveOptionen, skontoText, DOKUMENT_TYP_LABEL } from './angebot-optionen'

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
    paddingTop: 52,
    paddingBottom: 72,
    paddingHorizontal: 52,
    backgroundColor: '#FFFFFF',
  },

  // ── Header ──────────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  headerLeft: { flex: 1 },
  headerRight: { alignItems: 'flex-end' },
  logoImg: { width: 72, height: 36, objectFit: 'contain', marginBottom: 8 },
  firmennameH: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 16,
    color: '#111111',
    letterSpacing: 0.2,
  },
  headerAdresse: { fontSize: 8, color: '#888888', marginTop: 4, lineHeight: 1.6 },

  // Angebot-Label rechts oben
  angebotLabel: {
    fontSize: 7,
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    textAlign: 'right',
  },
  metaGrid: { alignItems: 'flex-end' },
  metaZeile: { flexDirection: 'row', marginBottom: 3, justifyContent: 'flex-end' },
  metaLabel: { fontSize: 7, color: '#999999', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: 8, paddingTop: 1 },
  metaWert: { fontSize: 9, color: '#111111', textAlign: 'right', minWidth: 80 },

  // ── Trennlinie ──────────────────────────────────────────────────────────
  trennlinie: { borderBottom: '0.5 solid #E5E5E5', marginBottom: 20 },
  trennlinieKraeftig: { borderBottom: '1 solid #CCCCCC', marginBottom: 20 },

  // ── Adressblock ──────────────────────────────────────────────────────────
  adressBlock: { marginBottom: 24 },
  absenderZeile: { fontSize: 7, color: '#AAAAAA', marginBottom: 6 },
  empfaengerName: { fontSize: 10, color: '#111111', marginBottom: 2 },
  empfaengerAdresse: { fontSize: 9, color: '#555555', lineHeight: 1.6 },

  // ── Betreff ──────────────────────────────────────────────────────────────
  betreff: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#111111', marginBottom: 3 },
  anrede: { fontSize: 9, color: '#666666', marginBottom: 20 },

  // ── Tabelle: Header ──────────────────────────────────────────────────────
  tableHeader: {
    flexDirection: 'row',
    borderBottom: '1 solid #AAAAAA',
    paddingBottom: 6,
    marginBottom: 0,
  },
  thText: {
    fontSize: 7,
    color: '#999999',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontFamily: 'Helvetica-Bold',
  },

  // ── Tabelle: Zeile ───────────────────────────────────────────────────────
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5 solid #E5E5E5',
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  posText: { fontSize: 8, color: '#BBBBBB', paddingTop: 1 },
  titelText: { fontSize: 9, color: '#111111' },
  beschreibungText: { fontSize: 8, color: '#888888', marginTop: 2, lineHeight: 1.4 },
  mengeText: { fontSize: 9, color: '#333333', textAlign: 'right' },
  einheitText: { fontSize: 9, color: '#555555', textAlign: 'center' },
  einzelText: { fontSize: 9, color: '#333333', textAlign: 'right' },
  gesamtText: { fontSize: 9, color: '#111111', textAlign: 'right' },

  // ── Spaltenbreiten ────────────────────────────────────────────────────────
  cPos:    { width: '5%' },
  cBez:    { width: '44%' },
  cMenge:  { width: '9%', textAlign: 'right' },
  cEinh:   { width: '14%', textAlign: 'center' },
  cEinzel: { width: '14%', textAlign: 'right' },
  cGes:    { width: '14%', textAlign: 'right' },

  // ── Raumgruppe ────────────────────────────────────────────────────────────
  raumKopf: {
    paddingTop: 18,
    paddingBottom: 5,
    borderBottom: '0.5 solid #DDDDDD',
    marginBottom: 0,
  },
  raumKopfText: {
    fontSize: 7,
    color: '#AAAAAA',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: 'Helvetica-Bold',
  },
  raumSumme: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 6,
    paddingBottom: 14,
  },
  raumSummeLabel: { fontSize: 8, color: '#AAAAAA', marginRight: 12 },
  raumSummeWert: { fontSize: 8, color: '#555555', minWidth: 60, textAlign: 'right' },

  // ── Summenblock ───────────────────────────────────────────────────────────
  summenBlock: {
    alignSelf: 'flex-end',
    width: '44%',
    marginTop: 20,
  },
  summenZeile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summenLabel: { fontSize: 9, color: '#666666' },
  summenWert: { fontSize: 9, color: '#333333', textAlign: 'right' },
  summenGesamtTrennlinie: {
    borderBottom: '1 solid #111111',
    marginTop: 4,
    marginBottom: 4,
  },
  summenGesamtZeile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  summenGesamtLabel: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#111111' },
  summenGesamtWert: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#111111', textAlign: 'right' },

  // ── Schlussbereich ────────────────────────────────────────────────────────
  zahlungsziel: { fontSize: 8, color: '#888888', marginTop: 16, marginBottom: 4 },
  schlussText: { fontSize: 9, color: '#555555', lineHeight: 1.6, marginTop: 20, marginBottom: 28 },
  unterschriftRow: { flexDirection: 'row', gap: 40, marginTop: 8 },
  unterschriftLinie: { borderTop: '0.5 solid #BBBBBB', paddingTop: 5, flex: 1 },
  unterschriftLabel: { fontSize: 8, color: '#AAAAAA' },

  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 52,
    right: 52,
    borderTop: '0.5 solid #E5E5E5',
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: { fontSize: 7, color: '#AAAAAA', lineHeight: 1.5 },
})

// ── Props ──────────────────────────────────────────────────────────────────
interface Props {
  quote: Quote & { items: QuoteItem[]; customer?: Customer | null }
  company: Company
  quoteNumber: string
  briefpapier?: Briefpapier | null
  logoBase64?: string | null
  revision?: number
  // CoS-021/DC-034: Aufnahme-Fotos, die der Handwerker pro Stück fürs PDF
  // freigegeben hat (siehe src/lib/angebot-fotos.ts). Optional — wer sie nicht
  // mitgibt (Health-Check, Unterschrifts-Mail), bekommt das PDF wie bisher.
  fotos?: AngebotsFoto[]
}

// ── Hauptkomponente ────────────────────────────────────────────────────────
export function AngebotPDF({ quote, company, quoteNumber, briefpapier, logoBase64, revision, fotos }: Props) {
  const isKleinunternehmer = company.vat_rate === 0
  const vatRate = company.vat_rate

  // Firmeninfo kommt zentral aus dem Betrieb (companies), nicht mehr pro Briefpapier.
  const firmenname   = company.name
  const adresse      = company.address || ''
  const telefon      = company.phone || ''
  const email        = company.contact_email || ''
  const website      = company.website || ''
  const ustId        = (company as Company & { ust_id?: string }).ust_id || ''
  const steuernummer = company.tax_number || ''
  const iban         = company.iban || ''
  // Pro-Angebot-Optionen (Zahnrad) schlagen die Betriebs-Einstellungen
  const opt = effektiveOptionen(quote, company, quote.customer?.ist_unternehmen)
  const dokTitel = DOKUMENT_TYP_LABEL[opt.dokumentTyp]
  const zahlungsTage = opt.zahlungszielTage
  const logoSrc      = logoBase64 || briefpapier?.logo_url || (company as Company & { logo_url?: string }).logo_url

  const footerLinks  = [firmenname, adresse?.split('\n')[0]].filter(Boolean).join(' · ')
  const footerMitte  = [ustId && `USt-IdNr.: ${ustId}`, steuernummer && `St.-Nr.: ${steuernummer}`].filter(Boolean).join('  ·  ')
  const footerRechts = iban ? `IBAN: ${iban}` : ''

  const ersterRaum = quote.items[0]?.title?.split(' — ')[1] ?? ''
  const gewerkName = company.gewerke?.[0]
    ? company.gewerke[0].charAt(0).toUpperCase() + company.gewerke[0].slice(1) + 'arbeiten'
    : 'Handwerkerleistungen'
  const projektBeschreibung = [gewerkName, ersterRaum && `– ${ersterRaum}`].filter(Boolean).join(' ')

  return (
    <Document>
      <Page size="A4" style={S.page} wrap>

        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <View style={S.headerRow} fixed>
          {/* Links: Logo + Firmenname + Adresse */}
          <View style={S.headerLeft}>
            {/* react-pdf's Image does not support the DOM alt attribute. */}
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            {logoSrc && <Image src={logoSrc} style={S.logoImg} />}
            <Text style={S.firmennameH}>{firmenname}</Text>
            {adresse && (
              <Text style={S.headerAdresse}>
                {[adresse.split('\n')[0], telefon, email, website].filter(Boolean).join('  ·  ')}
              </Text>
            )}
          </View>

          {/* Rechts: Dokumentinfos */}
          <View style={S.headerRight}>
            <Text style={S.angebotLabel}>{revision && revision > 1 ? `${dokTitel} · Revision ${revision}` : dokTitel}</Text>
            <View style={S.metaGrid}>
              <View style={S.metaZeile}>
                <Text style={S.metaLabel}>Nr.</Text>
                <Text style={S.metaWert}>{quoteNumber}</Text>
              </View>
              <View style={S.metaZeile}>
                <Text style={S.metaLabel}>Datum</Text>
                <Text style={S.metaWert}>{fmtDatum(quote.created_at)}</Text>
              </View>
              {quote.valid_until && (
                <View style={S.metaZeile}>
                  <Text style={S.metaLabel}>Gültig bis</Text>
                  <Text style={S.metaWert}>{fmtDatum(quote.valid_until)}</Text>
                </View>
              )}
              <View style={S.metaZeile}>
                <Text style={S.metaLabel}>Zahlungsziel</Text>
                <Text style={S.metaWert}>{zahlungsTage} Tage</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={S.trennlinie} />

        {/* ── EMPFÄNGER ──────────────────────────────────────────────────── */}
        <View style={S.adressBlock}>
          <Text style={S.absenderZeile}>{firmenname} · {adresse?.split('\n')[0] ?? ''}</Text>
          {quote.customer ? (
            <>
              <Text style={S.empfaengerName}>{quote.customer.name}</Text>
              {quote.customer.address && (
                <Text style={S.empfaengerAdresse}>{quote.customer.address}</Text>
              )}
            </>
          ) : (
            <Text style={{ ...S.empfaengerAdresse, color: '#CCCCCC' }}>(Kein Kunde angegeben)</Text>
          )}
        </View>

        {/* ── BETREFF ────────────────────────────────────────────────────── */}
        <Text style={S.betreff}>{projektBeschreibung}</Text>
        <Text style={S.anrede}>{opt.kopftext ?? `Gerne unterbreiten wir Ihnen folgendes ${dokTitel}:`}</Text>

        {/* ── TABELLEN-HEADER ────────────────────────────────────────────── */}
        <View style={S.tableHeader}>
          <Text style={{ ...S.thText, ...S.cPos }}>Pos</Text>
          <Text style={{ ...S.thText, ...S.cBez }}>Bezeichnung</Text>
          <Text style={{ ...S.thText, ...S.cMenge }}>Menge</Text>
          <Text style={{ ...S.thText, ...S.cEinh }}>Einheit</Text>
          <Text style={{ ...S.thText, ...S.cEinzel }}>Einzelpreis</Text>
          <Text style={{ ...S.thText, ...S.cGes }}>Gesamtpreis</Text>
        </View>

        {/* ── POSITIONEN ─────────────────────────────────────────────────── */}
        {(() => {
          const gruppen = gruppiereNachStruktur(quote.items, opt.struktur)

          if (!gruppen) {
            return quote.items.map((item, idx) => (
              <View key={item.id} style={S.tableRow} wrap={false}>
                <Text style={{ ...S.posText, ...S.cPos }}>{idx + 1}</Text>
                <View style={S.cBez}>
                  <Text style={S.titelText}>{item.title}</Text>
                  {item.description && <Text style={S.beschreibungText}>{item.description}</Text>}
                </View>
                <Text style={{ ...S.mengeText, ...S.cMenge }}>{item.quantity}</Text>
                <Text style={{ ...S.einheitText, ...S.cEinh }}>{item.unit}</Text>
                <Text style={{ ...S.einzelText, ...S.cEinzel }}>{fmtEuro(item.unit_price)}</Text>
                <Text style={{ ...S.gesamtText, ...S.cGes }}>{fmtEuro(item.total_price)}</Text>
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
              <View style={S.raumKopf} wrap={false}>
                <Text style={S.raumKopfText}>
                  {sek.typ === 'raum' ? sek.raum!.raumName : 'Allgemein'}
                </Text>
              </View>

              {(sek.typ === 'raum' ? sek.raum!.items : allgemein).map((gi) => (
                <View key={gi.id} style={S.tableRow} wrap={false}>
                  <Text style={{ ...S.posText, ...S.cPos }}>{gi.position}</Text>
                  <View style={S.cBez}>
                    <Text style={S.titelText}>{gi.titleDisplay}</Text>
                    {gi.description && <Text style={S.beschreibungText}>{gi.description}</Text>}
                  </View>
                  <Text style={{ ...S.mengeText, ...S.cMenge }}>{gi.quantity}</Text>
                  <Text style={{ ...S.einheitText, ...S.cEinh }}>{gi.unit}</Text>
                  <Text style={{ ...S.einzelText, ...S.cEinzel }}>{fmtEuro(gi.unit_price)}</Text>
                  <Text style={{ ...S.gesamtText, ...S.cGes }}>{fmtEuro(gi.total_price)}</Text>
                </View>
              ))}

              {hatMehrereRaeume && sek.typ === 'raum' && (
                <View style={S.raumSumme}>
                  <Text style={S.raumSummeLabel}>Summe {sek.raum!.raumName}</Text>
                  <Text style={S.raumSummeWert}>{fmtEuro(sek.raum!.summe)}</Text>
                </View>
              )}
            </View>
          ))
        })()}

        {/* Anmerkungen */}
        {quote.notes && (
          <View style={{ marginTop: 16, paddingTop: 10, borderTop: '0.5 solid #E5E5E5' }}>
            <Text style={{ fontSize: 7, color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>Anmerkungen</Text>
            <Text style={{ fontSize: 8, color: '#666666', lineHeight: 1.5 }}>{quote.notes}</Text>
          </View>
        )}

        {/* ── SUMMEN ─────────────────────────────────────────────────────── */}
        <View style={S.summenBlock}>
          <View style={{ borderTop: '0.5 solid #E5E5E5', paddingTop: 10 }}>
            <View style={S.summenZeile}>
              <Text style={S.summenLabel}>Zwischensumme (netto)</Text>
              <Text style={S.summenWert}>{fmtEuro(quote.total_net)}</Text>
            </View>
            {isKleinunternehmer ? (
              <View style={S.summenZeile}>
                <Text style={{ ...S.summenLabel, fontSize: 8 }}>Kein Ausweis MwSt. gem. § 19 UStG</Text>
              </View>
            ) : (
              <View style={S.summenZeile}>
                <Text style={S.summenLabel}>Umsatzsteuer {vatRate} %</Text>
                <Text style={S.summenWert}>{fmtEuro(quote.total_vat)}</Text>
              </View>
            )}
          </View>
          <View style={S.summenGesamtTrennlinie} />
          <View style={S.summenGesamtZeile}>
            <Text style={S.summenGesamtLabel}>Gesamtbetrag</Text>
            <Text style={S.summenGesamtWert}>{fmtEuro(quote.total_gross)}</Text>
          </View>
        </View>

        {/* Zahlungsziel */}
        <Text style={S.zahlungsziel}>Zahlungsziel: {zahlungsTage} Tage ohne Abzug</Text>
        {skontoText(opt) && (
          <Text style={S.zahlungsziel}>{skontoText(opt)}</Text>
        )}
        {opt.dokumentTyp === 'kostenvoranschlag' && (
          <Text style={S.zahlungsziel}>
            Unverbindlicher Kostenvoranschlag. Wesentliche Überschreitungen zeigen wir vorab an (§ 650 BGB).
          </Text>
        )}

        {/* Normverweise */}
        {(() => {
          const vobNormen = [...new Set(quote.items.map(i => i.vob_norm).filter(Boolean))] as string[]
          const dinNormen = [...new Set(quote.items.flatMap(i => i.din_normen ?? []))]
          if (vobNormen.length === 0 && dinNormen.length === 0) return null
          return (
            <View style={{ marginTop: 6 }}>
              <Text style={{ fontSize: 7, color: '#BBBBBB', lineHeight: 1.5 }}>
                Normgrundlagen: {[...vobNormen, ...dinNormen].join(' · ')}
              </Text>
            </View>
          )
        })()}

        {/* Schlusstext — eigener Fußtext schlägt Standard */}
        <Text style={S.schlussText}>
          {opt.fusstext ?? 'Wir freuen uns auf Ihre Auftragserteilung und sichern eine fachgerechte und einwandfreie Ausführung zu.'}
        </Text>

        {/* Unterschrift */}
        <View style={S.unterschriftRow}>
          <View style={S.unterschriftLinie}>
            <Text style={S.unterschriftLabel}>Datum, Unterschrift Auftraggeber</Text>
          </View>
          <View style={S.unterschriftLinie}>
            <Text style={S.unterschriftLabel}>{company.name}</Text>
          </View>
        </View>

        {/* ── FOOTER ─────────────────────────────────────────────────────── */}
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

      {/* ── FOTOS ZUR BAUSTELLE (CoS-021/DC-034) ──────────────────────────────
          Bewusst eine eigene Seite am Ende: Das Angebot selbst — Positionen,
          Summen, Bedingungen — bleibt unverändert kompakt lesbar. Die Fotos
          dokumentieren den Zustand vor Ort (Nachweis bei späterem Streit über
          Vorschäden) und gehören deshalb dazu, aber nicht zwischen die Preise. */}
      {(fotos?.length ?? 0) > 0 && (
        <Page size="A4" style={S.page} wrap>
          <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 4 }}>
            Fotos zur Baustelle
          </Text>
          <Text style={{ fontSize: 9, color: '#666666', marginBottom: 14 }}>
            Aufgenommen beim Aufmaß — dokumentiert den Zustand vor Beginn der Arbeiten.
          </Text>
          {fotos!.map((foto, i) => (
            <View key={i} style={{ marginBottom: 16 }} wrap={false}>
              <Image src={foto.bild} style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }} />
              {foto.beschreibung && (
                <Text style={{ fontSize: 9, color: '#333333', marginTop: 4 }}>{foto.beschreibung}</Text>
              )}
            </View>
          ))}
        </Page>
      )}

      {/* ── WIDERRUFSBELEHRUNG (nur Verbraucher / Haustürgeschäft) ─────────── */}
      {opt.widerrufBeilegen && (() => {
        const absender = { name: firmenname, adresse, telefon, email: company.contact_email }
        const text = widerrufsbelehrungText(absender, (company as Company & { widerruf_text?: string | null }).widerruf_text)
        return (
          <Page size="A4" style={S.page} wrap>
            <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', marginBottom: 10 }}>Widerrufsbelehrung</Text>
            <Text style={{ fontSize: 9, lineHeight: 1.6, color: '#333333' }}>{text}</Text>

            <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', marginTop: 20, marginBottom: 8 }}>
              Muster-Widerrufsformular
            </Text>
            <Text style={{ fontSize: 9, lineHeight: 1.6, color: '#333333' }}>
              {musterWiderrufsformular(absender)}
            </Text>
          </Page>
        )
      })()}
    </Document>
  )
}
