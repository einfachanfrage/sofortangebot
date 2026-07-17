export type Plan = 'starter' | 'pro'
export type AccountingSoftware =
  | 'lexoffice'
  | 'lexware'
  | 'sevdesk'
  | 'fastbill'
  | 'billomat'
  | 'papierkram'
  | 'easybill'
  | 'datev'
  | 'sage'
  | 'plancraft'
  | 'none'
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'in_bearbeitung' | 'archived'

export type EntwurfVerarbeitungStatus = 'ausstehend' | 'verarbeitung' | 'fertig' | 'fehler'
export type EntwurfAufnahmeTyp = 'sprache' | 'notiz' | 'foto'

export interface EntwurfAufnahme {
  id: string
  angebot_id: string
  typ: EntwurfAufnahmeTyp
  audio_url: string | null
  audio_dauer_sekunden: number | null
  transkript: string | null
  erkannte_positionen: ErkanntPosition[]
  verarbeitung_status: EntwurfVerarbeitungStatus
  notiz_text: string | null
  foto_url: string | null
  foto_beschreibung: string | null
  in_pdf: boolean
  erstellt_am: string
  geraet: string | null
  sortierung: number
  // für Signed URLs
  audio_signed_url?: string
  foto_signed_url?: string
}

export interface ErkanntPosition {
  titel: string
  menge: number
  einheit: string
  einzelpreis: number
  gesamtpreis: number
  erkannt: boolean
}
export type VatRate = 19 | 7 | 0

export interface Company {
  id: string
  user_id: string
  name: string
  address: string
  phone: string | null
  contact_email: string | null
  website: string | null
  tax_number: string | null
  iban: string | null
  logo_url: string | null
  signature_url: string | null
  vat_rate: VatRate
  payment_days: number
  language: string
  accounting_software: AccountingSoftware
  abrechnungs_modus: 'inapp' | 'extern'
  angebot_struktur: 'raeume' | 'arbeitsablauf' | 'gewerk'
  gewerke: string[]
  created_at: string
  lexoffice_api_key: string | null
  lexware_api_key: string | null
  sevdesk_api_key: string | null
  fastbill_api_key: string | null
  fastbill_email: string | null
  billomat_api_key: string | null
  billomat_subdomain: string | null
  papierkram_api_key: string | null
  easybill_api_key: string | null
  ust_id: string | null
  agb_url: string | null
  plan: string | null
  reminder_days: number | null
  regionaler_preisfaktor_prozent: number
  angebot_gueltig_tage: number
  materialpreis_hinweis_aktiv: boolean
  mindestauftragswert: number
  e_rechnung_aktiv: boolean
  onboarding_completed: boolean
  onboarding_step: number
  kleinmaterial_config: {
    aktiv?: boolean
    betrag_eur?: number
    schwelle_eur?: number
    bezeichnung?: string
  } | null
  anfahrt_config: {
    aktiv?: boolean
    betrag_eur?: number
    bezeichnung?: string
  } | null
}

export interface MengenrabattTier {
  ab: number
  rabatt_prozent: number
}

export interface PriceItem {
  id: string
  company_id: string
  category: string
  title: string
  unit: string
  unit_price: number
  description: string | null
  mengenrabatt: MengenrabattTier[] | null
  vob_norm: string | null
  din_normen: string[] | null
  ist_erschwerniszuschlag: boolean
  erschwerniszuschlag_fuer: string | null
  zuschlag_typ: 'prozent' | 'festbetrag' | 'je_einheit' | null
  nutzungshaeufigkeit: number
}

export interface Customer {
  id: string
  company_id: string
  name: string
  address: string | null
  email: string | null
  phone: string | null
  ist_unternehmen: boolean
  ustid: string | null
  leitweg_id: string | null
}

export interface Quote {
  id: string
  company_id: string
  customer_id: string | null
  status: QuoteStatus
  created_at: string
  valid_until: string | null
  total_net: number
  total_vat: number
  total_gross: number
  notes: string | null
  signed_at: string | null
  signed_by: string | null
  angebotsnummer: string | null
  briefpapier_id: string | null
  revision: number
  original_id: string | null
  customer?: Customer
  items?: QuoteItem[]
}

export interface Nummernkreis {
  id: string
  betrieb_id: string
  typ: 'angebot' | 'rechnung'
  prefix: string
  jahr_aktiv: number | null
  trennzeichen: string
  naechste_nummer: number
  min_stellen: number
  letztes_update: string
}

export interface VergebeneNummer {
  id: string
  betrieb_id: string
  typ: 'angebot' | 'rechnung'
  nummer: string
  sequenz_nummer: number
  angebot_id: string | null
  vergeben_am: string
  storniert: boolean
}

export interface Briefpapier {
  id: string
  betrieb_id: string
  name: string
  ist_standard: boolean
  firmenname: string | null
  zusatz: string | null
  strasse: string | null
  plz: string | null
  ort: string | null
  telefon: string | null
  email: string | null
  website: string | null
  logo_url: string | null
  logo_position: 'links' | 'mitte' | 'rechts'
  logo_groesse: 'klein' | 'mittel' | 'gross'
  akzentfarbe: string
  fusszeile_links: string | null
  fusszeile_mitte: string | null
  fusszeile_rechts: string | null
  schrift: 'inter' | 'roboto' | 'opensans'
  erstellt_am: string
  aktualisiert_am: string
}

export interface QuoteItem {
  id: string
  quote_id: string
  position: number
  title: string
  description: string | null
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  vob_norm: string | null
  din_normen: string[] | null
}
