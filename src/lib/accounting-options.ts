import type { AccountingSoftware } from './types'

export type IntegrationTier = 'oauth' | 'csv' | 'manual'

export interface AccountingOption {
  value: AccountingSoftware
  label: string
  desc: string
  tier: IntegrationTier   // oauth = direkte Verbindung, csv = CSV-Export, manual = manuell
  popular?: boolean
}

export const ACCOUNTING_OPTIONS: AccountingOption[] = [
  // Direkte OAuth-Integrationen
  {
    value: 'lexware',
    label: 'Lexware Office',
    // DC-019: "Lexware Office" und "Lexoffice (Legacy)" waren mit
    // identischer Beschreibung nicht unterscheidbar. Beide sind echte,
    // getrennte Integrationen (eigene API-Key-Spalten, s. types.ts) —
    // keine reine UI-Dopplung, daher Klarstellungs-Satz statt Merge.
    desc: 'Direkte Verbindung — die aktuelle Oberfläche. Im Zweifel die richtige Wahl.',
    tier: 'oauth',
    popular: true,
  },
  {
    value: 'lexoffice',
    label: 'Lexoffice (Legacy)',
    desc: 'Direkte Verbindung — nur falls du noch den alten Lexoffice-Zugang nutzt.',
    tier: 'oauth',
  },
  {
    value: 'sevdesk',
    label: 'sevDesk',
    desc: 'Direkte Verbindung — Angebot landet automatisch drin',
    tier: 'oauth',
    popular: true,
  },
  {
    value: 'fastbill',
    label: 'FastBill',
    desc: 'Direkte Verbindung — Angebot landet automatisch drin',
    tier: 'oauth',
  },
  {
    value: 'billomat',
    label: 'Billomat',
    desc: 'Direkte Verbindung — Angebot landet automatisch drin',
    tier: 'oauth',
  },
  {
    value: 'papierkram',
    label: 'Papierkram',
    desc: 'Direkte Verbindung — Angebot landet automatisch drin',
    tier: 'oauth',
  },
  {
    value: 'easybill',
    label: 'Easybill',
    desc: 'Direkte Verbindung — Angebot landet automatisch drin',
    tier: 'oauth',
  },
  // CSV / DATEV-Export
  {
    value: 'datev',
    label: 'DATEV',
    desc: 'Export als DATEV-CSV — direkt an deinen Steuerberater',
    tier: 'csv',
  },
  {
    value: 'sage',
    label: 'Sage',
    desc: 'CSV-Export kompatibel mit Sage 50 / Sage 100',
    tier: 'csv',
  },
  // Handwerker-Tools
  {
    value: 'plancraft',
    label: 'PlanCraft',
    desc: 'Handwerker-Software — Export als PDF & CSV',
    tier: 'csv',
  },
  // Kein Tool
  {
    value: 'none',
    label: 'Kein Tool / Später',
    desc: 'Nur PDF- und CSV-Export',
    tier: 'manual',
  },
]

export const TIER_LABEL: Record<IntegrationTier, string> = {
  oauth: 'Direkte Verbindung',
  csv: 'CSV-Export',
  manual: '',
}
