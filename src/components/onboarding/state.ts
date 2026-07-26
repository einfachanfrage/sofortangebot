import type { AccountingSoftware } from '@/lib/types'

const STORAGE_KEY = 'sofortangebot_onboarding'

export type PreisMode = 'markt' | 'manuell' | null

export interface PriceEntry {
  category: string
  title: string
  unit: string
  unit_price: string
}

export interface OnboardingState {
  name: string
  strasse: string
  plz: string
  ort: string
  phone: string
  email: string
  showContact: boolean
  gewerke: string[]
  vatRate: 19 | 7 | 0 | null
  paymentDays: number
  agbUrl: string
  preisMode: PreisMode
  preisEntries: PriceEntry[]
  logoUrl: string | null
  accounting: AccountingSoftware
  apiKey: string
}

export const DEFAULT_ONBOARDING_STATE: OnboardingState = {
  name: '', strasse: '', plz: '', ort: '', phone: '', email: '', showContact: false,
  gewerke: [], vatRate: null, paymentDays: 14, agbUrl: '',
  preisMode: null, preisEntries: [], logoUrl: null, accounting: 'none', apiKey: '',
}

export function loadOnboardingState(): OnboardingState {
  if (typeof window === 'undefined') return DEFAULT_ONBOARDING_STATE
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...DEFAULT_ONBOARDING_STATE, ...JSON.parse(stored) } : DEFAULT_ONBOARDING_STATE
  } catch {
    return DEFAULT_ONBOARDING_STATE
  }
}

export function saveOnboardingState(state: OnboardingState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch {}
}

export function clearOnboardingState() {
  try { localStorage.removeItem(STORAGE_KEY) } catch {}
}
