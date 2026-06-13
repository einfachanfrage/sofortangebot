export type Plan = 'starter' | 'pro'
export type AccountingSoftware =
  | 'lexoffice'
  | 'sevdesk'
  | 'fastbill'
  | 'billomat'
  | 'papierkram'
  | 'easybill'
  | 'datev'
  | 'sage'
  | 'plancraft'
  | 'none'
export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected'
export type VatRate = 19 | 7 | 0

export interface Company {
  id: string
  user_id: string
  name: string
  address: string
  tax_number: string | null
  iban: string | null
  logo_url: string | null
  signature_url: string | null
  vat_rate: VatRate
  payment_days: number
  language: string
  accounting_software: AccountingSoftware
  gewerke: string[]
  created_at: string
  lexoffice_api_key: string | null
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
  customer?: Customer
  items?: QuoteItem[]
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
}
