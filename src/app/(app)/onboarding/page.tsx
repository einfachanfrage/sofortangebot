'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Check, Upload, FileText, X, ChevronDown, ChevronUp, Loader2, Share, MoreVertical, ArrowRight } from 'lucide-react'
import type { AccountingSoftware } from '@/lib/types'
import { GEWERKE } from '@/lib/gewerke'
import { Logo } from '@/components/Logo'
import { ACCOUNTING_OPTIONS, TIER_LABEL } from '@/lib/accounting-options'
import { DEFAULT_PRICES } from '@/lib/default-prices'
import { DEFAULT_EMPFEHLUNGEN } from '@/lib/empfehlungen-defaults'
import { getPreisvorlagenForGewerke, type PreisVorlage } from '@/lib/preise-vorlagen'

type PreisMode = 'markt' | 'manuell' | 'pdf' | null

interface PriceEntry {
  category: string
  title: string
  unit: string
  unit_price: string
}

// step 0 = Welcome, 1-6 = real steps, 7 = PWA
const PROGRESS_STEPS = 6

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [selectedGewerke, setSelectedGewerke] = useState<string[]>([])
  const [accounting, setAccounting] = useState<AccountingSoftware>('none')
  const [vatRate, setVatRate] = useState<19 | 7 | 0 | null>(null)
  const [paymentDays, setPaymentDays] = useState(14)
  const [agbUrl, setAgbUrl] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoError, setLogoError] = useState('')
  const logoInputRef = useRef<HTMLInputElement>(null)

  const [preisMode, setPreisMode] = useState<PreisMode>(null)
  const [preisEntries, setPreisEntries] = useState<PriceEntry[]>([])
  const [pdfFiles, setPdfFiles] = useState<File[]>([])
  const [pdfAnalyzing, setPdfAnalyzing] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const [pdfResult, setPdfResult] = useState<PriceEntry[] | null>(null)
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set())

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Vorname aus Firmenname ableiten für persönliche Ansprache
  const firstName = name.trim().split(/\s+/)[0] ?? ''

  function toggleGewerk(id: string) {
    setSelectedGewerke(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  function selectPreisMode(mode: PreisMode) {
    setPreisMode(mode)
    if (mode === 'manuell') {
      const vorlagen = getPreisvorlagenForGewerke(selectedGewerke)
      setPreisEntries(vorlagen.map((v: PreisVorlage) => ({
        category: v.category, title: v.title, unit: v.unit,
        unit_price: String(v.defaultPrice),
      })))
      const cats = [...new Set(vorlagen.map((v: PreisVorlage) => v.category))]
      setExpandedCats(new Set(cats.slice(0, 1)))
    }
  }

  async function handleLogoUpload(file: File) {
    setLogoError('')
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      setLogoError('Nur PNG, JPG, WebP oder SVG — keine Word- oder PDF-Dateien.')
      return
    }
    if (file.size > 5 * 1024 * 1024) { setLogoError('Datei zu groß (max. 5 MB).'); return }
    setLogoUploading(true)
    const fd = new FormData()
    fd.append('logo', file)
    const r = await fetch('/api/upload-logo', { method: 'POST', body: fd })
    const data = await r.json()
    setLogoUploading(false)
    if (!r.ok) { setLogoError(data.error ?? 'Upload fehlgeschlagen'); return }
    setLogoUrl(data.url + '?t=' + Date.now())
  }

  async function analyzePdfs() {
    if (!pdfFiles.length) return
    setPdfAnalyzing(true)
    setPdfError('')
    const fd = new FormData()
    pdfFiles.forEach(f => fd.append('pdfs', f))
    const r = await fetch('/api/preise-aus-pdf', { method: 'POST', body: fd })
    const data = await r.json()
    if (!r.ok) { setPdfError(data.error ?? 'Analyse fehlgeschlagen'); setPdfAnalyzing(false); return }
    const extracted: PriceEntry[] = (data.preise ?? []).map((p: { category: string; title: string; unit: string; unit_price: number }) => ({
      category: p.category, title: p.title, unit: p.unit, unit_price: String(p.unit_price),
    }))
    setPdfResult(extracted)
    setPreisEntries(extracted)
    const cats = [...new Set(extracted.map((p: PriceEntry) => p.category))]
    setExpandedCats(new Set(cats.slice(0, 2)))
    setPdfAnalyzing(false)
  }

  function updatePreisEntry(idx: number, field: keyof PriceEntry, value: string) {
    setPreisEntries(prev => prev.map((e, i) => i !== idx ? e : { ...e, [field]: value }))
  }
  function removePreisEntry(idx: number) {
    setPreisEntries(prev => prev.filter((_, i) => i !== idx))
  }

  const groupedEntries = preisEntries.reduce<Record<string, { entry: PriceEntry; idx: number }[]>>(
    (acc, entry, idx) => {
      if (!acc[entry.category]) acc[entry.category] = []
      acc[entry.category].push({ entry, idx })
      return acc
    }, {}
  )

  async function handleFinish() {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error: companyError } = await supabase
      .from('companies')
      .update({ name, address, accounting_software: accounting, gewerke: selectedGewerke, vat_rate: vatRate ?? 19, payment_days: paymentDays, agb_url: agbUrl || null })
      .eq('user_id', user.id)

    if (companyError) { setError('Speichern fehlgeschlagen. Bitte nochmal versuchen.'); setLoading(false); return }

    const { data: company } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
    if (company) {
      if (preisMode === 'markt') {
        await supabase.from('price_items').insert(DEFAULT_PRICES.map(p => ({ ...p, company_id: company.id })))
      } else if ((preisMode === 'manuell' || preisMode === 'pdf') && preisEntries.length > 0) {
        const toInsert = preisEntries
          .filter(e => e.title.trim() && parseFloat(e.unit_price) > 0)
          .map(e => ({ company_id: company.id, category: e.category, title: e.title, unit: e.unit, unit_price: parseFloat(e.unit_price) }))
        if (toInsert.length > 0) await supabase.from('price_items').insert(toInsert)
      }
      await supabase.from('positions_empfehlungen').insert(
        DEFAULT_EMPFEHLUNGEN.map(e => ({ ...e, company_id: company.id }))
      )
    }

    setStep(6)
    setLoading(false)
  }

  // Progress-Balken: step 0 = kein Balken, step 1-6 = Fortschritt
  const progressStep = Math.max(0, step - 1)

  return (
    <div className="min-h-dvh bg-[#F7F7F5] flex flex-col px-5 pt-12 pb-8">

      {/* Logo + Fortschritt (ab step 1) */}
      {step > 0 && step < 7 && (
        <>
          <Logo variant="light" className="text-2xl mb-4 block" />
          <div className="flex gap-1.5 mb-8">
            {Array.from({ length: PROGRESS_STEPS }, (_, i) => i + 1).map(n => (
              <div key={n} className={`h-1 flex-1 rounded-full transition-all duration-300 ${n <= progressStep ? 'bg-[#F5C400]' : 'bg-[#2C2C2C]/15'}`} />
            ))}
          </div>
        </>
      )}

      {/* ── Step 0: Welcome ── */}
      {step === 0 && (
        <div className="flex flex-col flex-1 items-center justify-center text-center gap-0">
          <Logo variant="light" className="text-3xl mb-8 block" />
          <div className="text-6xl mb-5">👋</div>
          <h1 className="text-3xl font-black text-[#2C2C2C] mb-3 leading-tight">
            Schön, dass du da bist.
          </h1>
          <p className="text-[#2C2C2C]/60 font-semibold text-base leading-relaxed max-w-xs mb-3">
            In den nächsten 3 Minuten richten wir dein Tool ein — dann kannst du sofort loslegen.
          </p>
          <p className="text-[#2C2C2C]/40 font-semibold text-sm leading-relaxed max-w-xs mb-12">
            Kein Papierkram. Kein Tippen. Einfach sprechen — und dein Angebot ist fertig.
          </p>
          <button
            onClick={() => setStep(1)}
            className="w-full max-w-xs bg-[#F5C400] text-[#2C2C2C] font-black text-xl rounded-2xl py-5 active:scale-95 transition-transform flex items-center justify-center gap-3"
          >
            Einrichten
            <ArrowRight size={22} strokeWidth={3} />
          </button>
        </div>
      )}

      {/* ── Step 1: Betrieb ── */}
      {step === 1 && (
        <div className="flex flex-col flex-1">
          <div className="text-3xl mb-3">🏗️</div>
          <h1 className="text-2xl font-black text-[#2C2C2C] mb-1">Wie heißt dein Betrieb?</h1>
          <p className="text-[#2C2C2C]/50 font-semibold mb-2 leading-relaxed">
            Das erscheint auf jedem Angebot, das du rausschickst.
          </p>
          <div className="flex flex-col gap-4 mt-4">
            <div>
              <label className={labelCls}>Firmenname oder dein Name</label>
              <input type="text" placeholder="z.B. Malerbetrieb Müller" value={name}
                onChange={e => setName(e.target.value)} className={inputCls} autoFocus />
            </div>
            <div>
              <label className={labelCls}>Adresse</label>
              <textarea placeholder={'Musterstraße 1\n12345 Musterstadt'} value={address}
                onChange={e => setAddress(e.target.value)} rows={3} className={`${inputCls} resize-none`} />
              <p className="text-xs text-[#2C2C2C]/30 font-semibold mt-1.5">
                Wird auf dem Angebot als Absender angezeigt.
              </p>
            </div>
            <div>
              <label className={labelCls}>Bist du umsatzsteuerpflichtig?</label>
              <p className="text-xs text-[#2C2C2C]/40 font-semibold mb-2 leading-relaxed">
                Wenn dein Jahresumsatz unter 25.000 € liegt, bist du vermutlich Kleinunternehmer (§ 19 UStG) — dann keine MwSt. auf Angeboten.
              </p>
              <div className="flex gap-2">
                {([
                  { value: 19 as const, label: '19 % MwSt.' },
                  { value: 7 as const,  label: '7 % MwSt.'  },
                  { value: 0 as const,  label: 'Kleinunternehmer' },
                ]).map(opt => (
                  <button key={opt.value} type="button" onClick={() => setVatRate(opt.value)}
                    className={`flex-1 py-3 rounded-xl border-2 font-black text-xs transition-colors ${
                      vatRate === opt.value
                        ? 'border-[#F5C400] bg-[#F5C400]/10 text-[#2C2C2C]'
                        : 'border-[#2C2C2C]/10 bg-white text-[#2C2C2C]/60'
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {vatRate === 0 && (
                <p className="text-xs text-[#2C2C2C]/40 font-semibold mt-1.5">
                  Kein Ausweis von Umsatzsteuer gemäß § 19 UStG. Pflichthinweis erscheint automatisch auf dem Angebot.
                </p>
              )}
              {vatRate !== null && vatRate > 0 && (
                <p className="text-xs text-[#2C2C2C]/30 font-semibold mt-1.5">
                  {vatRate} % MwSt. wird auf Angeboten ausgewiesen (Netto + MwSt. = Brutto).
                </p>
              )}
              {vatRate === null && (
                <p className="text-xs text-amber-600 font-semibold mt-1.5">
                  Bitte wählen — diese Einstellung bestimmt, was auf deinen Angeboten steht.
                </p>
              )}
            </div>
            <div>
              <label className={labelCls}>Zahlungsziel</label>
              <div className="flex gap-2">
                {[7, 14, 30].map(days => (
                  <button key={days} type="button" onClick={() => setPaymentDays(days)}
                    className={`flex-1 py-3 rounded-xl border-2 font-black text-sm transition-colors ${
                      paymentDays === days ? 'border-[#F5C400] bg-[#F5C400]/10 text-[#2C2C2C]' : 'border-[#2C2C2C]/10 bg-white text-[#2C2C2C]/60'
                    }`}>
                    {days} Tage
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#2C2C2C]/30 font-semibold mt-1.5">
                Steht als Zahlungsfrist auf jedem Angebot.
              </p>
            </div>
          </div>
            <div>
              <label className={labelCls}>Deine AGB (optional)</label>
              <input
                type="url"
                placeholder="https://meinewebseite.de/agb"
                value={agbUrl}
                onChange={e => setAgbUrl(e.target.value)}
                className={inputCls}
              />
              <p className="text-xs text-[#2C2C2C]/30 font-semibold mt-1.5">
                Wenn hinterlegt, müssen Kunden beim Unterschreiben deinen AGB zustimmen — rechtlich sauberer.
              </p>
            </div>
          <div className="mt-auto pt-8">
            <button onClick={() => setStep(2)} disabled={!name.trim() || vatRate === null}
              className={btnPrimary}>
              Weiter
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Gewerk ── */}
      {step === 2 && (
        <div className="flex flex-col flex-1">
          <div className="text-3xl mb-3">🔨</div>
          <h1 className="text-2xl font-black text-[#2C2C2C] mb-1">Was machst du?</h1>
          <p className="text-[#2C2C2C]/50 font-semibold mb-2 leading-relaxed">
            Die KI kennt dann die typischen Leistungen und Einheiten für dein Handwerk — und fragt beim Aufmaß genau die richtigen Dinge nach.
          </p>
          <div className="flex flex-col gap-2 overflow-y-auto flex-1 mt-4">
            {GEWERKE.filter(g => g.id === 'allrounder').concat(GEWERKE.filter(g => g.id !== 'allrounder')).map(g => {
              const active = selectedGewerke.includes(g.id)
              return (
                <button key={g.id} onClick={() => toggleGewerk(g.id)}
                  className={`flex items-center gap-4 w-full rounded-2xl px-4 py-4 text-left transition-colors border-2 ${
                    active ? 'border-[#F5C400] bg-[#F5C400]/5'
                    : g.id === 'allrounder' ? 'border-[#2C2C2C]/20 bg-white'
                    : 'border-[#2C2C2C]/10 bg-white'}`}
                >
                  <span className="text-2xl">{g.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-[#2C2C2C]">{g.label}</div>
                    <div className="text-xs text-[#2C2C2C]/50 font-semibold">{g.beschreibung}</div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? 'border-[#F5C400] bg-[#F5C400]' : 'border-[#2C2C2C]/20'}`}>
                    {active && <Check size={14} color="#2C2C2C" strokeWidth={3} />}
                  </div>
                </button>
              )
            })}
          </div>
          <div className="pt-6 flex gap-3">
            <button onClick={() => setStep(1)} className={btnBack}>Zurück</button>
            <button onClick={() => setStep(3)} disabled={selectedGewerke.length === 0}
              className={`${btnPrimary} flex-[2]`}>
              Weiter {selectedGewerke.length > 0 && `(${selectedGewerke.length})`}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Logo ── */}
      {step === 3 && (
        <div className="flex flex-col flex-1">
          <div className="text-3xl mb-3">🎨</div>
          <h1 className="text-2xl font-black text-[#2C2C2C] mb-1">Dein Logo</h1>
          <p className="text-[#2C2C2C]/50 font-semibold mb-2 leading-relaxed">
            Angebote mit Logo wirken professioneller — und werden häufiger unterschrieben.
          </p>
          <p className="text-xs text-[#2C2C2C]/30 font-semibold mb-6">
            PNG, JPG, WebP oder SVG · max. 5 MB · empfohlen 400×200 px
          </p>

          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f) }}
          />

          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            {logoUrl ? (
              <div className="flex flex-col items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt="Logo" className="max-h-28 max-w-xs object-contain rounded-2xl border-2 border-[#2C2C2C]/10 p-3 bg-white" />
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                  <Check size={16} color="#16a34a" strokeWidth={2.5} />
                  <span className="text-green-700 font-bold text-sm">Logo hochgeladen</span>
                </div>
                <button onClick={() => logoInputRef.current?.click()} className="text-xs font-bold text-[#2C2C2C]/40">
                  Anderes Logo wählen
                </button>
              </div>
            ) : (
              <button
                onClick={() => logoInputRef.current?.click()}
                disabled={logoUploading}
                className="w-full border-2 border-dashed border-[#2C2C2C]/20 rounded-2xl p-10 flex flex-col items-center gap-3 active:scale-95 transition-transform disabled:opacity-50 bg-white"
              >
                {logoUploading
                  ? <Loader2 size={32} color="#F5C400" className="animate-spin" />
                  : <Upload size={32} color="#2C2C2C" strokeWidth={1.5} className="opacity-30" />
                }
                <div className="font-black text-[#2C2C2C]">
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
          </div>

          <div className="pt-6 flex gap-3">
            <button onClick={() => setStep(2)} className={btnBack}>Zurück</button>
            <button onClick={() => setStep(4)} className={`${btnPrimary} flex-[2]`}>
              {logoUrl ? 'Weiter' : 'Überspringen'}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 4: Preise ── */}
      {step === 4 && (
        <div className="flex flex-col flex-1">
          <div className="text-3xl mb-3">💰</div>
          <h1 className="text-2xl font-black text-[#2C2C2C] mb-1">Deine Preise</h1>
          <p className="text-[#2C2C2C]/50 font-semibold mb-2 leading-relaxed">
            Die KI rechnet damit, wenn du ein Angebot sprichst. Je genauer deine Preise, desto besser das Ergebnis.
          </p>

          {!preisMode && (
            <div className="flex flex-col gap-3 flex-1 mt-4">
              <button onClick={() => selectPreisMode('markt')}
                className="bg-white border-2 border-[#2C2C2C]/10 rounded-2xl p-5 text-left active:scale-95 transition-transform">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5C400] rounded-xl flex items-center justify-center shrink-0 text-lg">📊</div>
                  <div>
                    <div className="font-black text-[#2C2C2C]">Marktpreise laden</div>
                    <div className="text-sm text-[#2C2C2C]/50 font-semibold mt-1 leading-relaxed">
                      Ich lade dir aktuelle Durchschnittspreise für dein Gewerk. Du kannst sie jederzeit anpassen.
                    </div>
                    <div className="mt-2 text-xs font-black text-[#F5C400]">Sofort loslegen →</div>
                  </div>
                </div>
              </button>

              <button onClick={() => selectPreisMode('manuell')}
                className="bg-white border-2 border-[#2C2C2C]/10 rounded-2xl p-5 text-left active:scale-95 transition-transform">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#2C2C2C] rounded-xl flex items-center justify-center shrink-0 text-lg">✏️</div>
                  <div>
                    <div className="font-black text-[#2C2C2C]">Eigene Preise eingeben</div>
                    <div className="text-sm text-[#2C2C2C]/50 font-semibold mt-1 leading-relaxed">
                      Trag deine echten Stunden- und Einheitspreise ein. Die KI rechnet dann mit deinen Zahlen.
                    </div>
                    <div className="mt-2 text-xs font-black text-[#2C2C2C]/40">~3 Minuten</div>
                  </div>
                </div>
              </button>

              <button onClick={() => selectPreisMode('pdf')}
                className="bg-white border-2 border-[#2C2C2C]/10 rounded-2xl p-5 text-left active:scale-95 transition-transform">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#2C2C2C] rounded-xl flex items-center justify-center shrink-0 text-lg">🤖</div>
                  <div>
                    <div className="font-black text-[#2C2C2C]">Alte Angebote hochladen</div>
                    <div className="text-sm text-[#2C2C2C]/50 font-semibold mt-1 leading-relaxed">
                      Schick 1–5 alte Angebote als PDF. Die KI liest deine Preislogik raus und übernimmt sie.
                    </div>
                    <div className="mt-2 text-xs font-black text-[#2C2C2C]/40">Smarteste Option</div>
                  </div>
                </div>
              </button>

              <button onClick={() => setStep(5)} className="mt-auto text-center text-[#2C2C2C]/30 font-semibold text-sm py-3">
                Erstmal überspringen
              </button>
            </div>
          )}

          {preisMode === 'markt' && (
            <div className="flex-1 flex flex-col mt-4">
              <div className="bg-[#F5C400]/10 border-2 border-[#F5C400] rounded-2xl p-5 mb-4">
                <div className="font-black text-[#2C2C2C] mb-2">✓ Marktpreise werden geladen</div>
                <div className="text-sm text-[#2C2C2C]/60 font-semibold leading-relaxed">
                  Basierend auf deinem Gewerk lade ich aktuelle Durchschnittspreise. Du kannst alle Preise jederzeit in den Einstellungen anpassen.
                </div>
              </div>
              <div className="mt-auto flex gap-3 pt-4">
                <button onClick={() => setPreisMode(null)} className={btnBack}>Zurück</button>
                <button onClick={() => setStep(5)} className={`${btnPrimary} flex-[2]`}>Weiter</button>
              </div>
            </div>
          )}

          {preisMode === 'manuell' && preisEntries.length > 0 && (
            <div className="flex-1 flex flex-col min-h-0 mt-4">
              <div className="text-xs font-bold text-[#2C2C2C]/40 mb-3 uppercase tracking-wide">
                {preisEntries.length} Positionen — passe an oder lass leer
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-4">
                {Object.entries(groupedEntries).map(([cat, entries]) => (
                  <div key={cat} className="bg-white rounded-2xl border border-[#2C2C2C]/5 overflow-hidden">
                    <button onClick={() => setExpandedCats(prev => { const n = new Set(prev); n.has(cat) ? n.delete(cat) : n.add(cat); return n })}
                      className="w-full flex items-center justify-between px-4 py-3">
                      <span className="font-black text-[#2C2C2C] text-sm">{cat}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#2C2C2C]/40 font-bold">{entries.length}</span>
                        {expandedCats.has(cat) ? <ChevronUp size={16} color="#2C2C2C" /> : <ChevronDown size={16} color="#2C2C2C" />}
                      </div>
                    </button>
                    {expandedCats.has(cat) && (
                      <div className="border-t border-[#2C2C2C]/5">
                        {entries.map(({ entry, idx }) => (
                          <div key={idx} className="flex items-center gap-2 px-4 py-3 border-b border-[#2C2C2C]/5 last:border-0">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-[#2C2C2C]/60 font-semibold mb-1">{entry.title}</div>
                              <div className="flex gap-2 items-center">
                                <div className="relative flex-1 max-w-[100px]">
                                  <input type="number" step="0.01" min="0" value={entry.unit_price}
                                    onChange={e => updatePreisEntry(idx, 'unit_price', e.target.value)}
                                    className="w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-lg px-3 py-2 text-[#2C2C2C] font-black text-sm focus:outline-none focus:border-[#F5C400] pr-6" />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#2C2C2C]/40 font-bold">€</span>
                                </div>
                                <span className="text-xs text-[#2C2C2C]/50 font-semibold">/ {entry.unit}</span>
                              </div>
                            </div>
                            <button onClick={() => removePreisEntry(idx)} className="p-1.5 shrink-0"><X size={14} color="#ef4444" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-3 border-t border-[#2C2C2C]/10">
                <button onClick={() => setPreisMode(null)} className={btnBack}>Zurück</button>
                <button onClick={() => setStep(5)} className={`${btnPrimary} flex-[2]`}>
                  Weiter ({preisEntries.filter(e => parseFloat(e.unit_price) > 0).length})
                </button>
              </div>
            </div>
          )}

          {preisMode === 'pdf' && !pdfResult && (
            <div className="flex-1 flex flex-col mt-4">
              {!pdfAnalyzing ? (
                <>
                  <input ref={fileInputRef} type="file" accept=".pdf" multiple className="hidden"
                    onChange={e => { setPdfFiles(Array.from(e.target.files ?? []).slice(0, 5)); setPdfError('') }} />
                  <button onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#2C2C2C]/20 rounded-2xl p-8 text-center mb-4 active:scale-95 transition-transform">
                    <Upload size={32} color="#2C2C2C" strokeWidth={1.5} className="mx-auto mb-3 opacity-30" />
                    <div className="font-black text-[#2C2C2C]">PDFs auswählen</div>
                    <div className="text-sm text-[#2C2C2C]/40 font-semibold mt-1">Bis zu 5 alte Angebote</div>
                  </button>
                  {pdfFiles.length > 0 && (
                    <div className="flex flex-col gap-2 mb-4">
                      {pdfFiles.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-[#2C2C2C]/5">
                          <FileText size={16} color="#2C2C2C" strokeWidth={2} className="opacity-40 shrink-0" />
                          <span className="flex-1 text-sm font-semibold text-[#2C2C2C] truncate">{f.name}</span>
                          <button onClick={() => setPdfFiles(prev => prev.filter((_, j) => j !== i))}><X size={14} color="#ef4444" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  {pdfError && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold mb-4">{pdfError}</div>}
                  <div className="mt-auto flex gap-3">
                    <button onClick={() => setPreisMode(null)} className={btnBack}>Zurück</button>
                    <button onClick={analyzePdfs} disabled={pdfFiles.length === 0} className={`${btnPrimary} flex-[2] disabled:opacity-40`}>
                      KI analysieren lassen
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-4">
                  <Loader2 size={40} color="#F5C400" className="animate-spin" />
                  <div className="font-black text-[#2C2C2C] text-xl text-center">KI liest deine Angebote...</div>
                  <div className="text-[#2C2C2C]/40 font-semibold text-sm text-center">
                    Extrahiere Preise aus {pdfFiles.length} PDF{pdfFiles.length > 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </div>
          )}

          {preisMode === 'pdf' && pdfResult && preisEntries.length > 0 && (
            <div className="flex-1 flex flex-col min-h-0 mt-4">
              <div className="bg-[#F5C400]/10 border border-[#F5C400] rounded-xl px-4 py-3 mb-3">
                <div className="font-black text-[#2C2C2C] text-sm">✓ {preisEntries.length} Preise erkannt — prüfe und passe an</div>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-4">
                {Object.entries(groupedEntries).map(([cat, entries]) => (
                  <div key={cat} className="bg-white rounded-2xl border border-[#2C2C2C]/5 overflow-hidden">
                    <button onClick={() => setExpandedCats(prev => { const n = new Set(prev); n.has(cat) ? n.delete(cat) : n.add(cat); return n })}
                      className="w-full flex items-center justify-between px-4 py-3">
                      <span className="font-black text-[#2C2C2C] text-sm">{cat}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#2C2C2C]/40 font-bold">{entries.length}</span>
                        {expandedCats.has(cat) ? <ChevronUp size={16} color="#2C2C2C" /> : <ChevronDown size={16} color="#2C2C2C" />}
                      </div>
                    </button>
                    {expandedCats.has(cat) && (
                      <div className="border-t border-[#2C2C2C]/5">
                        {entries.map(({ entry, idx }) => (
                          <div key={idx} className="flex items-center gap-2 px-4 py-3 border-b border-[#2C2C2C]/5 last:border-0">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs text-[#2C2C2C]/60 font-semibold mb-1">{entry.title}</div>
                              <div className="flex gap-2 items-center">
                                <div className="relative flex-1 max-w-[100px]">
                                  <input type="number" step="0.01" min="0" value={entry.unit_price}
                                    onChange={e => updatePreisEntry(idx, 'unit_price', e.target.value)}
                                    className="w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-lg px-3 py-2 text-[#2C2C2C] font-black text-sm focus:outline-none focus:border-[#F5C400] pr-6" />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#2C2C2C]/40 font-bold">€</span>
                                </div>
                                <span className="text-xs text-[#2C2C2C]/50 font-semibold">/ {entry.unit}</span>
                              </div>
                            </div>
                            <button onClick={() => removePreisEntry(idx)} className="p-1.5 shrink-0"><X size={14} color="#ef4444" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-3 border-t border-[#2C2C2C]/10">
                <button onClick={() => { setPdfResult(null); setPreisEntries([]) }} className={btnBack}>Nochmal</button>
                <button onClick={() => setStep(5)} className={`${btnPrimary} flex-[2]`}>
                  Übernehmen ({preisEntries.filter(e => parseFloat(e.unit_price) > 0).length})
                </button>
              </div>
            </div>
          )}

          {!preisMode && (
            <button onClick={() => setStep(3)} className="mt-3 text-[#2C2C2C]/40 font-semibold text-sm text-center">← Zurück</button>
          )}
        </div>
      )}

      {/* ── Step 5: Buchhaltung ── */}
      {step === 5 && (
        <div className="flex flex-col flex-1">
          <div className="text-3xl mb-3">📊</div>
          <h1 className="text-2xl font-black text-[#2C2C2C] mb-1">Nutzt du eine Buchhaltungssoftware?</h1>

          {/* Warum das sinnvoll ist */}
          <div className="bg-[#2C2C2C] rounded-2xl p-4 mb-5 mt-2">
            <div className="text-[#F5C400] font-black text-sm mb-2">💡 Warum das sinnvoll ist</div>
            <p className="text-white/70 text-sm font-semibold leading-relaxed">
              Wenn du z.B. sevDesk oder Lexoffice nutzt, kannst du fertige Angebote mit einem einzigen Tap direkt rüberschieben — kein Abtippen, kein Copy-Paste, kein Doppleingabe.
            </p>
            <div className="flex gap-4 mt-3">
              <div className="flex-1 bg-white/5 rounded-xl p-3">
                <div className="text-white font-black text-xs mb-1">Ohne Verknüpfung</div>
                <div className="text-white/40 text-xs font-semibold">Angebot in Tool erstellen → Daten abtippen → In Software eintragen</div>
              </div>
              <div className="flex-1 bg-[#F5C400]/10 rounded-xl p-3 border border-[#F5C400]/30">
                <div className="text-[#F5C400] font-black text-xs mb-1">Mit Verknüpfung</div>
                <div className="text-white/70 text-xs font-semibold">Angebot erstellen → 1x tippen → Fertig in der Software ✓</div>
              </div>
            </div>
            <p className="text-white/40 text-xs font-semibold mt-3">
              Du kannst das auch später in den Einstellungen einrichten. Kein Druck.
            </p>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto flex-1">
            {ACCOUNTING_OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => setAccounting(opt.value as AccountingSoftware)}
                className={`flex items-center justify-between w-full bg-white border-2 rounded-2xl px-4 py-3.5 text-left transition-colors ${
                  accounting === opt.value ? 'border-[#F5C400] bg-[#F5C400]/5' : 'border-[#2C2C2C]/10'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#2C2C2C] text-sm">{opt.label}</span>
                    {opt.tier !== 'manual' && (
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${opt.tier === 'oauth' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'}`}>
                        {TIER_LABEL[opt.tier]}
                      </span>
                    )}
                    {opt.popular && <span className="text-[10px] font-black bg-[#F5C400]/30 text-[#2C2C2C] px-1.5 py-0.5 rounded">Beliebt</span>}
                  </div>
                  <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">{opt.desc}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 ${accounting === opt.value ? 'border-[#F5C400] bg-[#F5C400]' : 'border-[#2C2C2C]/30'}`}>
                  {accounting === opt.value && <div className="w-2 h-2 rounded-full bg-[#2C2C2C]" />}
                </div>
              </button>
            ))}
          </div>

          {error && <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">{error}</div>}

          <div className="mt-auto pt-6 flex gap-3">
            <button onClick={() => setStep(4)} className={btnBack}>Zurück</button>
            <button onClick={handleFinish} disabled={loading} className={`${btnPrimary} flex-[2]`}>
              {loading ? 'Speichere...' : "Los geht's 🚀"}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 6: Abschluss vor PWA ── */}
      {step === 6 && (
        <div className="flex flex-col flex-1 items-center justify-center text-center">
          <div className="text-6xl mb-5">🎉</div>
          <h1 className="text-3xl font-black text-[#2C2C2C] mb-3">Alles eingerichtet!</h1>
          <p className="text-[#2C2C2C]/60 font-semibold text-base leading-relaxed max-w-xs mb-8">
            {firstName ? `${firstName}, du` : 'Du'} kannst jetzt dein erstes Angebot erstellen — einfach sprechen, fertig.
          </p>
          <button onClick={() => setStep(7)} className="w-full max-w-xs bg-[#F5C400] text-[#2C2C2C] font-black text-xl rounded-2xl py-5 active:scale-95 transition-transform flex items-center justify-center gap-3">
            Zum Dashboard
            <ArrowRight size={22} strokeWidth={3} />
          </button>
        </div>
      )}

      {/* ── Step 7: PWA ── */}
      {step === 7 && <PwaOnboardingStep onDone={() => router.push('/dashboard')} />}
    </div>
  )
}

const inputCls = "w-full bg-white border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400]"
const labelCls = "block text-xs font-black text-[#2C2C2C]/40 mb-1.5 uppercase tracking-wide"
const btnPrimary = "w-full bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 active:scale-95 transition-transform disabled:opacity-50"
const btnBack = "flex-1 bg-white border-2 border-[#2C2C2C]/15 text-[#2C2C2C] font-black text-base rounded-xl py-4 active:scale-95 transition-transform"

function PwaOnboardingStep({ onDone }: { onDone: () => void }) {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other' | null>(null)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) { onDone(); return }
    const ua = navigator.userAgent
    if (/iphone|ipad|ipod/i.test(ua)) setPlatform('ios')
    else if (/android/i.test(ua)) setPlatform('android')
    else { onDone() }
  }, [])

  if (!platform) return null

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-5xl mb-5 text-center">📱</div>
        <h1 className="text-2xl font-black text-[#2C2C2C] mb-2 text-center">Noch ein letzter Schritt</h1>
        <p className="text-[#2C2C2C]/50 font-semibold text-center mb-2 leading-relaxed">
          Speicher die App auf deinem Homescreen — dann öffnet sie sich wie eine echte App, ohne Browser-Leiste und deutlich schneller.
        </p>
        <p className="text-[#2C2C2C]/30 font-semibold text-center text-sm mb-8">
          Dauert 10 Sekunden.
        </p>

        <div className="bg-[#2C2C2C] rounded-2xl p-5">
          <div className="text-[#F5C400] font-black text-sm mb-4 uppercase tracking-wide">
            {platform === 'ios' ? 'Safari — so geht\'s' : 'Chrome — so geht\'s'}
          </div>

          {platform === 'ios' && (
            <div className="flex flex-col gap-3">
              <PwaStep n={1}>
                Tippe unten in Safari auf das{' '}
                <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg">
                  <Share size={12} color="white" />
                  <span className="text-white font-bold text-xs">Teilen</span>
                </span>
                {' '}Symbol
              </PwaStep>
              <PwaStep n={2}>Scrolle runter bis <span className="text-white font-bold">„Zum Home‑Bildschirm"</span></PwaStep>
              <PwaStep n={3}>Oben rechts auf <span className="text-white font-bold">„Hinzufügen"</span> — fertig!</PwaStep>
            </div>
          )}

          {platform === 'android' && (
            <div className="flex flex-col gap-3">
              <PwaStep n={1}>
                Tippe in Chrome oben rechts auf{' '}
                <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg">
                  <MoreVertical size={12} color="white" />
                  <span className="text-white font-bold text-xs">Menü</span>
                </span>
              </PwaStep>
              <PwaStep n={2}>Tippe auf <span className="text-white font-bold">„App installieren"</span></PwaStep>
              <PwaStep n={3}>Bestätige mit <span className="text-white font-bold">„Installieren"</span> — fertig!</PwaStep>
            </div>
          )}
        </div>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <button onClick={onDone} className={btnPrimary}>
          Zum Dashboard →
        </button>
        <button onClick={onDone} className="text-center text-[#2C2C2C]/30 font-semibold text-sm py-1">
          Überspringen
        </button>
      </div>
    </div>
  )
}

function PwaStep({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-[#F5C400] flex items-center justify-center shrink-0 font-black text-[#2C2C2C] text-xs mt-0.5">{n}</div>
      <span className="text-white/70 text-sm font-semibold leading-relaxed">{children}</span>
    </div>
  )
}
