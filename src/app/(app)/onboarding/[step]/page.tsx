'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import {
  Check, Upload, ChevronDown, ChevronUp,
  Loader2, X, ArrowRight,
} from 'lucide-react'
import { Logo } from '@/components/Logo'
import { GEWERKE } from '@/lib/gewerke'
import { AKTIVE_GEWERKE } from '@/lib/gewerke-config'
import { ACCOUNTING_OPTIONS, TIER_LABEL } from '@/lib/accounting-options'
import { DEFAULT_PRICES } from '@/lib/default-prices'
import { DEFAULT_EMPFEHLUNGEN } from '@/lib/empfehlungen-defaults'
import { getPreisvorlagenForGewerke, type PreisVorlage } from '@/lib/preise-vorlagen'
import type { AccountingSoftware } from '@/lib/types'

// ─── Storage ───────────────────────────────────────────────────────────────
const STORAGE_KEY = 'sofortangebot_onboarding'

type PreisMode = 'markt' | 'manuell' | null

interface PriceEntry { category: string; title: string; unit: string; unit_price: string }

interface ObState {
  name: string; address: string; phone: string; email: string; showContact: boolean
  gewerke: string[]; vatRate: 19 | 7 | 0 | null; paymentDays: number; agbUrl: string
  preisMode: PreisMode; preisEntries: PriceEntry[]
  logoUrl: string | null; accounting: AccountingSoftware; apiKey: string
}

const DEFAULT_STATE: ObState = {
  name: '', address: '', phone: '', email: '', showContact: false,
  gewerke: [], vatRate: null, paymentDays: 14, agbUrl: '',
  preisMode: null, preisEntries: [], logoUrl: null, accounting: 'none', apiKey: '',
}

function loadState(): ObState {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    return s ? { ...DEFAULT_STATE, ...JSON.parse(s) } : DEFAULT_STATE
  } catch { return DEFAULT_STATE }
}

function saveState(s: ObState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

// ─── Shared styles ─────────────────────────────────────────────────────────
const inputCls = 'w-full bg-white border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-3.5 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400] transition-colors'
const labelCls = 'block text-[11px] font-extrabold text-[#2C2C2C]/40 mb-1.5 uppercase tracking-widest'
const btnPrimary = 'w-full bg-[#F5C400] text-[#2C2C2C] font-extrabold text-lg rounded-xl py-4 active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2'
const btnBack = 'flex-1 bg-white border-2 border-[#2C2C2C]/15 text-[#2C2C2C] font-extrabold text-base rounded-xl py-4 active:scale-95 transition-transform'

// ─── Progress Bar ──────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: number }) {
  const filled = step - 1 // step 2→1 filled, step 7→6 filled
  return (
    <div className="flex gap-1.5 mb-8">
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < filled ? 'bg-[#F5C400]' : 'bg-[#2C2C2C]/12'}`}
        />
      ))}
    </div>
  )
}

// ─── Accounting label helper ────────────────────────────────────────────────
function softwareLabel(s: string) {
  const m: Record<string, string> = {
    lexoffice: 'LexOffice', sevdesk: 'sevDesk', fastbill: 'FastBill',
    billomat: 'Billomat', papierkram: 'Papierkram', easybill: 'Easybill',
  }
  return m[s] ?? s
}

const API_KEY_SOFTWARES = ['lexoffice', 'sevdesk', 'fastbill', 'billomat', 'papierkram', 'easybill']

// ─── Main Component ─────────────────────────────────────────────────────────
export default function OnboardingStep() {
  const params = useParams()
  const step = Math.min(8, Math.max(1, parseInt(params.step as string, 10) || 1))
  const router = useRouter()
  const supabase = createClient()

  const [state, setState] = useState<ObState>(DEFAULT_STATE)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [connStatus, setConnStatus] = useState<'idle' | 'testing' | 'ok' | 'error'>('idle')
  const [nameError, setNameError] = useState(false)
  const [addrError, setAddrError] = useState(false)
  const [gewerkError, setGewerkError] = useState(false)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoError, setLogoError] = useState('')

  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set())

  // Hydrate from localStorage
  useEffect(() => { setState(loadState()) }, [])

  // On step 1: check if onboarding already completed
  useEffect(() => {
    if (step !== 1) return
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push('/login'); return }
      supabase.from('companies')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.onboarding_completed) router.replace('/dashboard')
        })
    })
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  function update(patch: Partial<ObState>) {
    setState(prev => {
      const next = { ...prev, ...patch }
      saveState(next)
      return next
    })
  }

  function goTo(n: number) {
    saveState(state)
    router.push(`/onboarding/${n}`)
  }

  // ── Logo Upload ──────────────────────────────────────────────────────────
  async function handleLogoUpload(file: File) {
    setLogoError('')
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) { setLogoError('Nur PNG, JPG, WebP oder SVG.'); return }
    if (file.size > 5 * 1024 * 1024) { setLogoError('Max. 5 MB.'); return }
    setLogoUploading(true)
    const fd = new FormData()
    fd.append('logo', file)
    const r = await fetch('/api/upload-logo', { method: 'POST', body: fd })
    const data = await r.json()
    setLogoUploading(false)
    if (!r.ok) { setLogoError(data.error ?? 'Upload fehlgeschlagen'); return }
    update({ logoUrl: data.url + '?t=' + Date.now() })
  }

  function selectPreisMode(mode: PreisMode) {
    if (mode === 'manuell') {
      const vorlagen = getPreisvorlagenForGewerke(state.gewerke)
      const entries = vorlagen.map((v: PreisVorlage) => ({
        category: v.category, title: v.title, unit: v.unit, unit_price: String(v.defaultPrice),
      }))
      setExpandedCats(new Set([...new Set(entries.map(e => e.category))].slice(0, 1)))
      update({ preisMode: mode, preisEntries: entries })
    } else {
      update({ preisMode: mode })
    }
  }

  function updateEntry(idx: number, field: keyof PriceEntry, value: string) {
    update({ preisEntries: state.preisEntries.map((e, i) => i !== idx ? e : { ...e, [field]: value }) })
  }
  function removeEntry(idx: number) {
    update({ preisEntries: state.preisEntries.filter((_, i) => i !== idx) })
  }
  function toggleCat(cat: string) {
    setExpandedCats(prev => { const n = new Set(prev); n.has(cat) ? n.delete(cat) : n.add(cat); return n })
  }

  const grouped = state.preisEntries.reduce<Record<string, { e: PriceEntry; idx: number }[]>>((acc, e, idx) => {
    ;(acc[e.category] ??= []).push({ e, idx })
    return acc
  }, {})

  // ── Connection Test ──────────────────────────────────────────────────────
  async function testConnection() {
    setConnStatus('testing')
    try {
      const r = await fetch('/api/integrations/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ software: state.accounting, apiKey: state.apiKey }),
      })
      setConnStatus(r.ok ? 'ok' : 'error')
    } catch { setConnStatus('error') }
  }

  // ── Finish (Step 7 → save to DB) ────────────────────────────────────────
  async function handleFinish() {
    setSaving(true); setSaveError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const apiKeyFields: Record<string, string> = {
      lexoffice: 'lexoffice_api_key', sevdesk: 'sevdesk_api_key',
      fastbill: 'fastbill_api_key', billomat: 'billomat_api_key',
      papierkram: 'papierkram_api_key', easybill: 'easybill_api_key',
    }

    const updateData: Record<string, unknown> = {
      name: state.name,
      address: state.address,
      gewerke: state.gewerke,
      vat_rate: state.vatRate ?? 19,
      payment_days: state.paymentDays,
      agb_url: state.agbUrl || null,
      accounting_software: state.accounting,
      onboarding_completed: true,
    }
    if (state.phone) updateData.phone = state.phone
    if (state.email) updateData.contact_email = state.email
    if (state.apiKey && apiKeyFields[state.accounting]) {
      updateData[apiKeyFields[state.accounting]] = state.apiKey
    }

    const { error: companyErr } = await supabase
      .from('companies').update(updateData).eq('user_id', user.id)
    if (companyErr) { setSaveError('Speichern fehlgeschlagen. Bitte nochmal versuchen.'); setSaving(false); return }

    const { data: company } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
    if (company) {
      if (state.preisMode === 'markt') {
        const all = DEFAULT_PRICES.map(p => ({ ...p, company_id: company.id }))
        const BATCH = 400
        for (let i = 0; i < all.length; i += BATCH) {
          await supabase.from('price_items').insert(all.slice(i, i + BATCH))
        }
      } else if (state.preisMode === 'manuell' && state.preisEntries.length > 0) {
        const toInsert = state.preisEntries
          .filter(e => e.title.trim() && parseFloat(e.unit_price) > 0)
          .map(e => ({ company_id: company.id, category: e.category, title: e.title, unit: e.unit, unit_price: parseFloat(e.unit_price) }))
        if (toInsert.length > 0) await supabase.from('price_items').insert(toInsert)
      }
      await supabase.from('positions_empfehlungen')
        .insert(DEFAULT_EMPFEHLUNGEN.map(e => ({ ...e, company_id: company.id })))
    }

    try { localStorage.removeItem(STORAGE_KEY) } catch {}
    setSaving(false)
    router.push('/onboarding/8')
  }

  const firstName = state.name.trim().split(/\s+/)[0] ?? ''
  const darkBg = step === 1 || step === 8

  return (
    <motion.div
      key={step}
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`min-h-dvh flex flex-col px-5 pt-10 pb-10 ${darkBg ? 'bg-[#2C2C2C]' : 'bg-[#F7F7F5]'}`}
    >
      {/* Header: logo + progress (steps 2–7) */}
      {step >= 2 && step <= 7 && (
        <div className="mb-2">
          <Logo variant="light" className="text-xl mb-5 block" />
          <ProgressBar step={step} />
        </div>
      )}

      {/* ── STEP 1: Welcome ─────────────────────────────────────────────── */}
      {step === 1 && (
        <div className="flex flex-col flex-1 items-center justify-center text-center">
          <Logo variant="dark" className="text-3xl mb-10 block" />
          <div className="text-[64px] leading-none mb-6">👋</div>
          <h1 className="font-syne font-extrabold text-white text-[32px] leading-tight mb-4">
            Schön dass du dabei bist.
          </h1>
          <p className="text-[#AAAAAA] text-base leading-relaxed mb-3 max-w-xs">
            In den nächsten 3 Minuten richten wir dein Tool ein — dann kannst du sofort loslegen.
          </p>
          <p className="text-[#666666] text-[14px] leading-relaxed mb-12 max-w-xs">
            Kein Papierkram. Kein Tippen. Einfach sprechen — und dein Angebot ist fertig.
          </p>
          <button
            onClick={() => goTo(2)}
            className="w-full max-w-xs bg-[#F5C400] text-[#2C2C2C] font-extrabold text-xl rounded-2xl py-[18px] active:scale-95 transition-transform flex items-center justify-center gap-3"
          >
            Einrichten <ArrowRight size={22} strokeWidth={2.5} />
          </button>
          <p className="text-[#666666] text-[13px] mt-3">Dauert ca. 3 Minuten</p>
        </div>
      )}

      {/* ── STEP 2: Betrieb ─────────────────────────────────────────────── */}
      {step === 2 && (
        <div className="flex flex-col flex-1">
          <div className="text-[40px] leading-none mb-4">🏗️</div>
          <h1 className="font-syne font-extrabold text-[#2C2C2C] text-[26px] leading-tight mb-2">
            Wie heißt dein Betrieb?
          </h1>
          <p className="text-[#2C2C2C]/50 font-semibold text-[15px] leading-relaxed mb-6">
            Das erscheint auf jedem Angebot das du rausschickst.
          </p>

          <div className="flex flex-col gap-5">
            <div>
              <label className={labelCls}>Firmenname oder dein Name</label>
              <input
                type="text" autoFocus
                placeholder="z.B. Müller Malerbetrieb"
                value={state.name}
                onChange={e => { update({ name: e.target.value }); setNameError(false) }}
                className={`${inputCls} ${nameError ? 'border-red-400' : ''}`}
              />
              {nameError && <p className="text-[12px] text-red-500 font-semibold mt-1.5">Bitte Firmenname eingeben.</p>}
            </div>
            <div>
              <label className={labelCls}>Adresse</label>
              <textarea
                placeholder={'Musterstraße 1\n12345 Berlin'}
                value={state.address}
                onChange={e => { update({ address: e.target.value }); setAddrError(false) }}
                rows={3}
                className={`${inputCls} resize-none ${addrError ? 'border-red-400' : ''}`}
              />
              <p className="text-[13px] text-[#2C2C2C]/30 font-semibold mt-1.5">
                Wird auf dem Angebot als Absender angezeigt.
              </p>
              {addrError && <p className="text-[12px] text-red-500 font-semibold mt-1">Bitte Adresse eingeben.</p>}
            </div>

            {/* Optional contact */}
            <button
              onClick={() => update({ showContact: !state.showContact })}
              className="flex items-center gap-2 text-[#2C2C2C]/40 font-semibold text-sm text-left"
            >
              <span className="text-[#F5C400] font-extrabold text-base">{state.showContact ? '−' : '+'}</span>
              Telefon & E-Mail ergänzen (optional)
            </button>

            {state.showContact && (
              <div className="flex flex-col gap-4 pl-4 border-l-2 border-[#F5C400]/40">
                <div>
                  <label className={labelCls}>Telefon</label>
                  <input type="tel" placeholder="+49 30 123456" value={state.phone}
                    onChange={e => update({ phone: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>E-Mail</label>
                  <input type="email" placeholder="kontakt@meinbetrieb.de" value={state.email}
                    onChange={e => update({ email: e.target.value })} className={inputCls} />
                </div>
                <p className="text-[13px] text-[#2C2C2C]/30 font-semibold">Erscheint ebenfalls auf dem Angebot.</p>
              </div>
            )}
          </div>

          <div className="mt-auto pt-8">
            <button
              onClick={() => {
                const noName = !state.name.trim()
                const noAddr = state.address.trim().length < 5
                setNameError(noName); setAddrError(noAddr)
                if (!noName && !noAddr) {
                  // Gewerk-Auswahl entfällt — Preset: Maler + Bodenbeläge
                  update({ gewerke: ['maler', 'boden_parkett'] })
                  goTo(4)
                }
              }}
              className={btnPrimary}
            >
              Weiter →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Gewerk ──────────────────────────────────────────────── */}
      {step === 3 && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="text-[40px] leading-none mb-4">🔨</div>
          <h1 className="font-syne font-extrabold text-[#2C2C2C] text-[26px] leading-tight mb-2">
            Was machst du?
          </h1>
          <p className="text-[#2C2C2C]/50 font-semibold text-[15px] leading-relaxed mb-4">
            Die KI kennt dann die typischen Leistungen und Einheiten für dein Handwerk — und fragt beim Aufmaß genau die richtigen Dinge nach.
          </p>

          <div className="flex flex-col gap-2 overflow-y-auto flex-1">
            {AKTIVE_GEWERKE.map(g => {
              const active = state.gewerke.includes(g.id)
              return (
                <button
                  key={g.id}
                  onClick={() => {
                    setGewerkError(false)
                    const next = active
                      ? state.gewerke.filter(x => x !== g.id)
                      : [...state.gewerke, g.id]
                    update({ gewerke: next })
                  }}
                  className={`flex items-center gap-4 w-full rounded-2xl px-4 py-[14px] text-left transition-colors border-2 ${
                    active ? 'border-[#F5C400] bg-[#F5C400]/5' : 'border-[#2C2C2C]/10 bg-white'
                  }`}
                >
                  <span className="text-2xl">{g.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-[#2C2C2C]">{g.name}</div>
                    <div className="text-xs text-[#2C2C2C]/50 font-semibold">{g.beschreibung}</div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    active ? 'border-[#F5C400] bg-[#F5C400]' : 'border-[#2C2C2C]/20'
                  }`}>
                    {active && <Check size={14} color="#2C2C2C" strokeWidth={3} />}
                  </div>
                </button>
              )
            })}
          </div>

          <p className="text-[13px] text-[#2C2C2C]/25 font-semibold text-center mt-3">
            Mehr Gewerke kommen bald — Dachdecker, Schreiner, GaLaBau & mehr.
          </p>
          {gewerkError && <p className="text-[12px] text-red-500 font-semibold text-center mt-1">Bitte mindestens ein Gewerk wählen.</p>}

          <div className="pt-4 flex gap-3">
            <button onClick={() => goTo(2)} className={btnBack}>← Zurück</button>
            <button
              onClick={() => {
                if (state.gewerke.length === 0) { setGewerkError(true); return }
                goTo(4)
              }}
              className={`${btnPrimary} flex-[2]`}
            >
              Weiter {state.gewerke.length > 0 && `(${state.gewerke.length})`} →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: MwSt + Zahlungsziel ────────────────────────────────── */}
      {step === 4 && (
        <div className="flex flex-col flex-1">
          <div className="text-[40px] leading-none mb-4">💶</div>
          <h1 className="font-syne font-extrabold text-[#2C2C2C] text-[26px] leading-tight mb-6">
            Wie stellst du Rechnungen?
          </h1>

          <div className="flex flex-col gap-7">
            {/* MwSt */}
            <div>
              <label className={labelCls}>Mehrwertsteuer</label>
              <div className="flex gap-2">
                {([{ v: 19 as const, l: '19 %' }, { v: 7 as const, l: '7 %' }, { v: 0 as const, l: 'Kleinunternehmer' }]).map(opt => (
                  <button
                    key={opt.v}
                    onClick={() => update({ vatRate: opt.v })}
                    className={`flex-1 py-[14px] rounded-xl border-2 font-extrabold text-[13px] transition-colors ${
                      state.vatRate === opt.v
                        ? 'border-[#F5C400] bg-[#F5C400]/10 text-[#2C2C2C]'
                        : 'border-[#2C2C2C]/10 bg-white text-[#2C2C2C]/60'
                    }`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
              {state.vatRate === 0 && (
                <p className="text-[13px] text-[#2C2C2C]/40 font-semibold mt-2">
                  Kein MwSt-Ausweis. Hinweis nach §19 UStG wird automatisch ergänzt.
                </p>
              )}
              {state.vatRate !== null && state.vatRate > 0 && (
                <p className="text-[13px] text-[#2C2C2C]/40 font-semibold mt-2">
                  {state.vatRate}% MwSt. wird auf Angeboten ausgewiesen.
                </p>
              )}
            </div>

            {/* Zahlungsziel */}
            <div>
              <label className={labelCls}>Zahlungsziel</label>
              <div className="flex gap-2">
                {[7, 14, 30].map(days => (
                  <button
                    key={days}
                    onClick={() => update({ paymentDays: days })}
                    className={`flex-1 py-[14px] rounded-xl border-2 font-extrabold text-sm transition-colors ${
                      state.paymentDays === days
                        ? 'border-[#F5C400] bg-[#F5C400]/10 text-[#2C2C2C]'
                        : 'border-[#2C2C2C]/10 bg-white text-[#2C2C2C]/60'
                    }`}
                  >
                    {days} Tage
                  </button>
                ))}
              </div>
              <p className="text-[13px] text-[#2C2C2C]/30 font-semibold mt-2">
                Steht als Zahlungsfrist auf jedem Angebot.
              </p>
            </div>

            {/* AGB */}
            <div>
              <label className={labelCls}>Deine AGB (optional)</label>
              <input
                type="url"
                placeholder="https://meinewebseite.de/agb"
                value={state.agbUrl}
                onChange={e => update({ agbUrl: e.target.value })}
                className={inputCls}
              />
              <p className="text-[13px] text-[#2C2C2C]/30 font-semibold mt-2">
                Wenn hinterlegt, müssen Kunden beim Unterschreiben deinen AGB zustimmen — rechtlich sauberer.
              </p>
            </div>
          </div>

          <p className="text-[13px] text-[#2C2C2C]/20 font-semibold mt-6">
            Alles kann später in den Einstellungen geändert werden.
          </p>

          <div className="mt-auto pt-6 flex gap-3">
            <button onClick={() => goTo(2)} className={btnBack}>← Zurück</button>
            <button
              onClick={() => { if (state.vatRate === null) return; goTo(5) }}
              disabled={state.vatRate === null}
              className={`${btnPrimary} flex-[2]`}
            >
              Weiter →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 5: Preise ──────────────────────────────────────────────── */}
      {step === 5 && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="text-[40px] leading-none mb-4">💰</div>
          <h1 className="font-syne font-extrabold text-[#2C2C2C] text-[26px] leading-tight mb-2">
            Deine Preise
          </h1>
          <p className="text-[#2C2C2C]/50 font-semibold text-[15px] leading-relaxed mb-5">
            Die KI rechnet damit, wenn du ein Angebot sprichst. Je genauer deine Preise, desto besser das Ergebnis.
          </p>

          {/* Mode selection */}
          {!state.preisMode && (
            <div className="flex flex-col gap-3 flex-1">
              <button
                onClick={() => selectPreisMode('markt')}
                className="relative bg-white border-l-4 border-l-[#F5C400] border border-[#2C2C2C]/5 rounded-2xl p-5 text-left active:scale-[0.98] transition-transform shadow-sm"
              >
                <span className="absolute top-3 right-3 bg-[#F5C400] text-[#2C2C2C] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Empfohlen
                </span>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5C400] rounded-xl flex items-center justify-center shrink-0 text-lg">📊</div>
                  <div>
                    <div className="font-extrabold text-[#2C2C2C]">Marktpreise laden</div>
                    <div className="text-sm text-[#2C2C2C]/50 font-semibold mt-1 leading-relaxed">
                      Ich lade dir aktuelle Durchschnittspreise für dein Gewerk. Du kannst sie jederzeit anpassen.
                    </div>
                    <div className="mt-2 text-xs font-extrabold text-[#F5C400]">Sofort loslegen →</div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => selectPreisMode('manuell')}
                className="bg-[#F7F7F5] border border-[#2C2C2C]/5 rounded-2xl p-5 text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#2C2C2C] rounded-xl flex items-center justify-center shrink-0 text-lg">✏️</div>
                  <div>
                    <div className="font-extrabold text-[#2C2C2C]">Eigene Preise eingeben</div>
                    <div className="text-sm text-[#2C2C2C]/50 font-semibold mt-1 leading-relaxed">
                      Trag deine echten Stunden- und Einheitspreise ein. Die KI rechnet dann mit deinen Zahlen.
                    </div>
                    <div className="mt-2 text-xs font-semibold text-[#2C2C2C]/40">~3 Minuten</div>
                  </div>
                </div>
              </button>

              <p className="text-[13px] text-[#2C2C2C]/25 font-semibold text-center">
                Kannst du jederzeit in den Einstellungen → Preise anpassen.
              </p>

              <div className="mt-auto flex gap-3 pt-2">
                <button onClick={() => goTo(4)} className={btnBack}>← Zurück</button>
                <button
                  onClick={() => goTo(6)}
                  className="flex-[2] py-4 text-[#2C2C2C]/40 font-semibold text-sm text-center"
                >
                  Erstmal überspringen →
                </button>
              </div>
            </div>
          )}

          {/* Marktpreise bestätigt */}
          {state.preisMode === 'markt' && (
            <div className="flex-1 flex flex-col">
              <div className="bg-[#F5C400]/10 border-2 border-[#F5C400] rounded-2xl p-5 mb-4">
                <div className="font-extrabold text-[#2C2C2C] mb-2 flex items-center gap-2">
                  <Check size={18} strokeWidth={3} /> Marktpreise werden geladen
                </div>
                <div className="text-sm text-[#2C2C2C]/60 font-semibold leading-relaxed">
                  Basierend auf deinem Gewerk lade ich aktuelle Durchschnittspreise. Du kannst alle Preise jederzeit in den Einstellungen anpassen.
                </div>
              </div>
              <div className="mt-auto flex gap-3">
                <button onClick={() => update({ preisMode: null })} className={btnBack}>Zurück</button>
                <button onClick={() => goTo(6)} className={`${btnPrimary} flex-[2]`}>Weiter →</button>
              </div>
            </div>
          )}

          {/* Manuell: Preisliste */}
          {state.preisMode === 'manuell' && state.preisEntries.length > 0 && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="text-xs font-extrabold text-[#2C2C2C]/40 mb-3 uppercase tracking-wide">
                {state.preisEntries.length} Positionen — passe an oder lass leer
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-4">
                {Object.entries(grouped).map(([cat, entries]) => (
                  <div key={cat} className="bg-white rounded-2xl border border-[#2C2C2C]/5 overflow-hidden">
                    <button onClick={() => toggleCat(cat)} className="w-full flex items-center justify-between px-4 py-3">
                      <span className="font-extrabold text-[#2C2C2C] text-sm">{cat}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#2C2C2C]/40 font-bold">{entries.length}</span>
                        {expandedCats.has(cat) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>
                    {expandedCats.has(cat) && (
                      <div className="border-t border-[#2C2C2C]/5">
                        {entries.map(({ e, idx }) => (
                          <div key={idx} className="flex items-center gap-2 px-4 py-3 border-b border-[#2C2C2C]/5 last:border-0">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-[#2C2C2C]/60 font-semibold mb-1">{e.title}</div>
                              <div className="flex gap-2 items-center">
                                <div className="relative max-w-[100px]">
                                  <input type="number" step="0.01" min="0" value={e.unit_price}
                                    onChange={ev => updateEntry(idx, 'unit_price', ev.target.value)}
                                    className="w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-lg px-3 py-2 text-[#2C2C2C] font-extrabold text-sm focus:outline-none focus:border-[#F5C400] pr-6" />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#2C2C2C]/40 font-bold">€</span>
                                </div>
                                <span className="text-xs text-[#2C2C2C]/50 font-semibold">/ {e.unit}</span>
                              </div>
                            </div>
                            <button onClick={() => removeEntry(idx)} className="p-1.5 shrink-0">
                              <X size={14} color="#ef4444" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-3 border-t border-[#2C2C2C]/10">
                <button onClick={() => update({ preisMode: null })} className={btnBack}>Zurück</button>
                <button onClick={() => goTo(6)} className={`${btnPrimary} flex-[2]`}>
                  Weiter ({state.preisEntries.filter(e => parseFloat(e.unit_price) > 0).length}) →
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ── STEP 6: Logo ────────────────────────────────────────────────── */}
      {step === 6 && (
        <div className="flex flex-col flex-1">
          <div className="text-[40px] leading-none mb-4">🎨</div>
          <h1 className="font-syne font-extrabold text-[#2C2C2C] text-[26px] leading-tight mb-2">
            Dein Logo
          </h1>
          <p className="text-[#2C2C2C]/50 font-semibold text-[15px] leading-relaxed mb-6">
            Angebote mit Logo wirken professioneller — und werden häufiger unterschrieben.
          </p>

          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f) }}
          />

          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            {state.logoUrl ? (
              <div className="flex flex-col items-center gap-4 w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={state.logoUrl} alt="Logo"
                  className="max-h-28 max-w-xs object-contain rounded-2xl border-2 border-[#2C2C2C]/10 p-3 bg-white" />
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                  <Check size={16} color="#16a34a" strokeWidth={2.5} />
                  <span className="text-green-700 font-extrabold text-sm">Logo hochgeladen</span>
                </div>
                <button onClick={() => logoInputRef.current?.click()} className="text-xs font-semibold text-[#2C2C2C]/40">
                  Anderes Logo wählen
                </button>
              </div>
            ) : (
              <button
                onClick={() => logoInputRef.current?.click()}
                disabled={logoUploading}
                className="w-full border-2 border-dashed border-[#2C2C2C]/20 rounded-2xl p-10 flex flex-col items-center gap-3 active:scale-[0.98] transition-transform disabled:opacity-50 bg-white"
              >
                {logoUploading
                  ? <Loader2 size={32} color="#F5C400" className="animate-spin" />
                  : <Upload size={32} color="#2C2C2C" strokeWidth={1.5} className="opacity-30" />
                }
                <div className="font-extrabold text-[#2C2C2C]">
                  {logoUploading ? 'Wird hochgeladen...' : 'Logo hochladen'}
                </div>
                {!logoUploading && (
                  <div className="text-sm text-[#2C2C2C]/40 font-semibold">Tippe hier um eine Datei auszuwählen</div>
                )}
              </button>
            )}
            {logoError && (
              <div className="w-full bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">
                {logoError}
              </div>
            )}
            <p className="text-[13px] text-[#2C2C2C]/25 font-semibold text-center">
              PNG, JPG, WebP oder SVG · max. 5 MB · empfohlen 400×200 px
            </p>
          </div>

          <div className="pt-4 flex gap-3">
            <button onClick={() => goTo(5)} className={btnBack}>← Zurück</button>
            <button onClick={() => goTo(7)} className={`${btnPrimary} flex-[2]`}>
              {state.logoUrl ? 'Weiter →' : 'Überspringen →'}
            </button>
          </div>
          <p className="text-[13px] text-[#2C2C2C]/25 font-semibold text-center mt-2">
            Kann jederzeit in den Einstellungen hochgeladen werden.
          </p>
        </div>
      )}

      {/* ── STEP 7: Buchhaltung ─────────────────────────────────────────── */}
      {step === 7 && (
        <div className="flex flex-col flex-1">
          <div className="text-[40px] leading-none mb-4">📊</div>
          <h1 className="font-syne font-extrabold text-[#2C2C2C] text-[26px] leading-tight mb-4">
            Nutzt du eine Buchhaltungssoftware?
          </h1>

          <div className="bg-[#2C2C2C] rounded-2xl p-4 mb-5">
            <div className="text-[#F5C400] font-extrabold text-sm mb-2">💡 Warum das sinnvoll ist</div>
            <p className="text-white/70 text-sm font-semibold leading-relaxed">
              Wenn du z.B. sevDesk oder Lexoffice nutzt, kannst du fertige Angebote mit einem einzigen Tap direkt rüberschieben — kein Abtippen, kein Copy-Paste, keine Doppeleingabe.
            </p>
            <div className="flex gap-3 mt-3">
              <div className="flex-1 bg-white/5 rounded-xl p-3">
                <div className="text-white font-extrabold text-xs mb-1">Ohne Verknüpfung</div>
                <div className="text-white/40 text-xs font-semibold leading-relaxed">Erstellen → Abtippen → In Software eintragen</div>
              </div>
              <div className="flex-1 bg-[#F5C400]/10 rounded-xl p-3 border border-[#F5C400]/30">
                <div className="text-[#F5C400] font-extrabold text-xs mb-1">Mit Verknüpfung ✓</div>
                <div className="text-white/70 text-xs font-semibold leading-relaxed">Erstellen → 1x tippen → Fertig ✓</div>
              </div>
            </div>
            <p className="text-white/30 text-xs font-semibold mt-3">
              Kannst du auch später in den Einstellungen einrichten. Kein Druck.
            </p>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0">
            {ACCOUNTING_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => { update({ accounting: opt.value as AccountingSoftware, apiKey: '' }); setConnStatus('idle') }}
                className={`flex items-center justify-between w-full bg-white border-2 rounded-2xl px-4 py-3.5 text-left transition-colors ${
                  state.accounting === opt.value ? 'border-[#F5C400] bg-[#F5C400]/5' : 'border-[#2C2C2C]/10'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-[#2C2C2C] text-sm">{opt.label}</span>
                    {opt.tier !== 'manual' && (
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${opt.tier === 'oauth' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'}`}>
                        {TIER_LABEL[opt.tier]}
                      </span>
                    )}
                    {opt.popular && (
                      <span className="text-[10px] font-extrabold bg-[#F5C400]/30 text-[#2C2C2C] px-1.5 py-0.5 rounded">Beliebt</span>
                    )}
                  </div>
                  <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">{opt.desc}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 transition-colors ${
                  state.accounting === opt.value ? 'border-[#F5C400] bg-[#F5C400]' : 'border-[#2C2C2C]/30'
                }`}>
                  {state.accounting === opt.value && <div className="w-2 h-2 rounded-full bg-[#2C2C2C]" />}
                </div>
              </button>
            ))}
          </div>

          {/* API Key */}
          {API_KEY_SOFTWARES.includes(state.accounting) && (
            <div className="mt-4 bg-white rounded-2xl border border-[#2C2C2C]/10 p-4 shrink-0">
              <label className={labelCls}>API-Key eingeben</label>
              <input
                type="text"
                placeholder="Deinen API-Key hier einfügen"
                value={state.apiKey}
                onChange={e => { update({ apiKey: e.target.value }); setConnStatus('idle') }}
                className={inputCls}
              />
              <p className="text-[12px] text-[#2C2C2C]/30 font-semibold mt-1.5">
                {softwareLabel(state.accounting)} → Einstellungen → API → Key kopieren
              </p>
              {state.apiKey && connStatus !== 'ok' && (
                <button
                  onClick={testConnection}
                  disabled={connStatus === 'testing'}
                  className="mt-3 w-full border border-[#2C2C2C]/10 rounded-xl py-2.5 text-sm font-extrabold text-[#2C2C2C] hover:border-[#F5C400] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {connStatus === 'testing' && <Loader2 size={14} className="animate-spin" />}
                  {connStatus === 'idle' && 'Verbindung testen'}
                  {connStatus === 'testing' && 'Verbinde...'}
                  {connStatus === 'error' && '✗ Fehlgeschlagen — Key prüfen'}
                </button>
              )}
              {connStatus === 'ok' && (
                <div className="mt-3 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                  <Check size={16} color="#16a34a" strokeWidth={2.5} />
                  <span className="text-green-700 font-extrabold text-sm">Verbindung erfolgreich</span>
                </div>
              )}
            </div>
          )}

          {saveError && (
            <div className="mt-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold shrink-0">
              {saveError}
            </div>
          )}

          <div className="mt-4 flex gap-3 shrink-0">
            <button onClick={() => goTo(6)} className={btnBack}>← Zurück</button>
            <button onClick={handleFinish} disabled={saving} className={`${btnPrimary} flex-[2]`}>
              {saving ? <><Loader2 size={18} className="animate-spin" /> Speichert…</> : 'Fertig 🚀'}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 8: Fertig ──────────────────────────────────────────────── */}
      {step === 8 && (
        <div className="flex flex-col flex-1 items-center justify-center text-center px-4">
          <Logo variant="dark" className="text-3xl mb-10 block" />
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 10 }}
            className="text-[72px] leading-none mb-6"
          >
            🎉
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="font-syne font-extrabold text-white text-[32px] leading-tight mb-4"
          >
            Alles eingerichtet!
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="text-[#AAAAAA] text-base leading-relaxed mb-12 max-w-xs"
          >
            {firstName ? `${firstName}, du` : 'Du'} kannst jetzt dein erstes Angebot erstellen — einfach sprechen, fertig.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.4 }}
            className="w-full max-w-xs"
          >
            <button
              onClick={() => router.push('/dashboard?welcome=new')}
              className="w-full bg-[#F5C400] text-[#2C2C2C] font-extrabold text-xl rounded-2xl py-[18px] active:scale-95 transition-transform flex items-center justify-center gap-3"
            >
              🎙 Erstes Angebot erstellen →
            </button>
            <p className="text-[#666666] text-[13px] mt-3">Dauert 2 Minuten. Versprochen.</p>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
