import type { Company } from './types'

export interface Integration {
  id: string
  label: string
  short: string
  color: string
  active: boolean
}

/**
 * Buchhaltungs-Integrationen (Lexware, sevDesk, etc.) — `active` heißt: der
 * Nutzer hat die Software in den Einstellungen verknüpft (API-Key hinterlegt).
 *
 * 2026-09-11 (Sandy: "NATÜRLICH im Senden-Dialog!! ... welcher nutzer würde
 * da oben danach suchen?!"): der Export "Zu X übertragen" lebte bisher nur
 * im Aktionen-Sheet (⋯) — von dort in den Senden-Dialog (VorschauUndVersand)
 * verschoben, weil ein Nutzer eine Übertragung ans Buchhaltungsprogramm dort
 * sucht, wo er auch sonst "verschickt". Liste war vorher in AngebotDetail.tsx
 * inline definiert; jetzt hier geteilt, weil beide Stellen sie brauchen.
 */
export function getIntegrations(company: Company | null | undefined): Integration[] {
  return [
    { id: 'lexware', label: 'Lexware Office', short: 'LW', color: '#003DA5', active: !!company?.lexware_api_key },
    { id: 'lexoffice', label: 'Lexoffice', short: 'LO', color: '#0066CC', active: !!company?.lexoffice_api_key },
    { id: 'sevdesk', label: 'sevDesk', short: 'SD', color: '#E84B3C', active: !!company?.sevdesk_api_key },
    { id: 'fastbill', label: 'FastBill', short: 'FB', color: '#FF6B00', active: !!company?.fastbill_api_key && !!company?.fastbill_email },
    { id: 'billomat', label: 'Billomat', short: 'BM', color: '#4CAF50', active: !!company?.billomat_api_key && !!company?.billomat_subdomain },
    { id: 'papierkram', label: 'Papierkram', short: 'PK', color: '#795548', active: !!company?.papierkram_api_key },
    { id: 'easybill', label: 'Easybill', short: 'EB', color: '#009688', active: !!company?.easybill_api_key },
  ]
}

export function getActiveIntegrations(company: Company | null | undefined): Integration[] {
  return getIntegrations(company).filter(i => i.active)
}
