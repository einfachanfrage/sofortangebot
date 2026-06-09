'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Check, Upload, FileText, X, ChevronDown, ChevronUp, Loader2, Share, MoreVertical } from 'lucide-react'
import type { AccountingSoftware } from '@/lib/types'
import { GEWERKE } from '@/lib/gewerke'
import { Logo } from '@/components/Logo'
import { ACCOUNTING_OPTIONS, TIER_LABEL } from '@/lib/accounting-options'
import { DEFAULT_PRICES } from '@/lib/default-prices'
import { getPreisvorlagenForGewerke, type PreisVorlage } from '@/lib/preise-vorlagen'

type PreisMode = 'markt' | 'manuell' | 'pdf' | null

interface PriceEntry {
  category: string
  title: string
  unit: string
  unit_price: string // String für Input-Kontrolle
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [selectedGewerke, setSelectedGewerke] = useState<string[]>([])
  const [accounting, setAccounting] = useState<AccountingSoftware>('none')

  // Preise
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

  function toggleGewerk(id: string) {
    setSelectedGewerke(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  // Wenn Preismodus gewählt wird → Vorlagen laden
  function selectPreisMode(mode: PreisMode) {
    setPreisMode(mode)
    if (mode === 'manuell') {
      const vorlagen = getPreisvorlagenForGewerke(selectedGewerke)
      setPreisEntries(vorlagen.map(v => ({
        category: v.category,
        title: v.title,
        unit: v.unit,
        unit_price: String(v.defaultPrice),
      })))
      // Erste Kategorie aufklappen
      const cats = [...new Set(vorlagen.map(v => v.category))]
      setExpandedCats(new Set(cats.slice(0, 1)))
    }
  }

  async function analyzePdfs() {
    if (!pdfFiles.length) return
    setPdfAnalyzing(true)
    setPdfError('')

    const fd = new FormData()
    pdfFiles.forEach(f => fd.append('pdfs', f))

    const r = await fetch('/api/preise-aus-pdf', { method: 'POST', body: fd })
    const data = await r.json()

    if (!r.ok) {
      setPdfError(data.error ?? 'Analyse fehlgeschlagen')
      setPdfAnalyzing(false)
      return
    }

    const extracted: PriceEntry[] = (data.preise ?? []).map((p: {
      category: string; title: string; unit: string; unit_price: number
    }) => ({
      category: p.category,
      title: p.title,
      unit: p.unit,
      unit_price: String(p.unit_price),
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

    // Firmendaten + Gewerke + Buchhaltung speichern
    const { error: companyError } = await supabase
      .from('companies')
      .update({ name, address, accounting_software: accounting, gewerke: selectedGewerke })
      .eq('user_id', user.id)

    if (companyError) {
      setError('Speichern fehlgeschlagen. Bitte nochmal versuchen.')
      setLoading(false)
      return
    }

    // Preise speichern
    const { data: company } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
    if (company) {
      if (preisMode === 'markt') {
        // Standard-Preise importieren
        await supabase.from('price_items').insert(
          DEFAULT_PRICES.map(p => ({ ...p, company_id: company.id }))
        )
      } else if ((preisMode === 'manuell' || preisMode === 'pdf') && preisEntries.length > 0) {
        // Eigene / analysierte Preise speichern
        const toInsert = preisEntries
          .filter(e => e.title.trim() && parseFloat(e.unit_price) > 0)
          .map(e => ({
            company_id: company.id,
            category: e.category,
            title: e.title,
            unit: e.unit,
            unit_price: parseFloat(e.unit_price),
          }))
        if (toInsert.length > 0) {
          await supabase.from('price_items').insert(toInsert)
        }
      }
    }

    setStep(5)
    setLoading(false)
  }

  const TOTAL_STEPS = 4

  return (
    <div className="min-h-dvh bg-[#F7F7F5] flex flex-col px-5 pt-12 pb-8">
      <Logo variant="light" className="text-3xl mb-1 block" />

      {/* Fortschritt */}
      <div className="flex gap-2 mt-4 mb-8">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(n => (
          <div key={n} className={`h-1.5 flex-1 rounded-full transition-colors ${n <= step ? 'bg-[#F5C400]' : 'bg-[#2C2C2C]/20'}`} />
        ))}
      </div>

      {/* ── Schritt 1: Firmendaten ── */}
      {step === 1 && (
        <div className="flex flex-col flex-1">
          <h1 className="text-2xl font-black text-[#2C2C2C] mb-1">Dein Betrieb</h1>
          <p className="text-[#2C2C2C]/50 font-semibold mb-8">Erscheint auf deinen Angeboten.</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-black text-[#2C2C2C]/40 mb-1.5 uppercase tracking-wide">Firmenname</label>
              <input type="text" placeholder="Muster GmbH / Max Mustermann" value={name}
                onChange={e => setName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-black text-[#2C2C2C]/40 mb-1.5 uppercase tracking-wide">Adresse</label>
              <textarea placeholder={'Musterstraße 1\n12345 Musterstadt'} value={address}
                onChange={e => setAddress(e.target.value)} rows={3} className={`${inputCls} resize-none`} />
            </div>
          </div>
          <div className="mt-auto pt-8">
            <button onClick={() => setStep(2)} disabled={!name.trim()}
              className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 active:scale-95 transition-transform disabled:opacity-40">
              Weiter
            </button>
          </div>
        </div>
      )}

      {/* ── Schritt 2: Gewerk(e) ── */}
      {step === 2 && (
        <div className="flex flex-col flex-1">
          <h1 className="text-2xl font-black text-[#2C2C2C] mb-1">Dein Gewerk</h1>
          <p className="text-[#2C2C2C]/50 font-semibold mb-6">
            Die KI kennt dann alle typischen Rückfragen. Mehrere möglich.
          </p>
          <div className="flex flex-col gap-2 overflow-y-auto flex-1">
            {GEWERKE.filter(g => g.id === 'allrounder').concat(GEWERKE.filter(g => g.id !== 'allrounder')).map(g => {
              const active = selectedGewerke.includes(g.id)
              return (
                <button key={g.id} onClick={() => toggleGewerk(g.id)}
                  className={`flex items-center gap-4 w-full rounded-2xl px-4 py-4 text-left transition-colors border-2 ${
                    active ? 'border-[#F5C400] bg-[#F5C400]/5'
                    : g.id === 'allrounder' ? 'border-[#2C2C2C] bg-white'
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
            <button onClick={() => setStep(1)}
              className="flex-1 bg-white border-2 border-[#2C2C2C] text-[#2C2C2C] font-black text-lg rounded-xl py-4 active:scale-95 transition-transform">
              Zurück
            </button>
            <button onClick={() => setStep(3)} disabled={selectedGewerke.length === 0}
              className="flex-[2] bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 active:scale-95 transition-transform disabled:opacity-40">
              Weiter {selectedGewerke.length > 0 && `(${selectedGewerke.length})`}
            </button>
          </div>
        </div>
      )}

      {/* ── Schritt 3: Preise ── */}
      {step === 3 && (
        <div className="flex flex-col flex-1">
          <h1 className="text-2xl font-black text-[#2C2C2C] mb-1">Deine Preise</h1>
          <p className="text-[#2C2C2C]/50 font-semibold mb-6">
            Die KI rechnet damit. Je genauer, desto besser deine Angebote.
          </p>

          {/* Modus-Auswahl */}
          {!preisMode && (
            <div className="flex flex-col gap-3 flex-1">
              {/* Option 1: Marktpreise */}
              <button onClick={() => selectPreisMode('markt')}
                className="bg-white border-2 border-[#2C2C2C]/10 rounded-2xl p-5 text-left active:scale-95 transition-transform">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#F5C400] rounded-xl flex items-center justify-center shrink-0 text-lg">📊</div>
                  <div>
                    <div className="font-black text-[#2C2C2C]">Marktübliche Preise starten</div>
                    <div className="text-sm text-[#2C2C2C]/50 font-semibold mt-1 leading-relaxed">
                      Ich lade dir aktuelle Durchschnittspreise für dein Gewerk. Du kannst sie jederzeit anpassen.
                    </div>
                    <div className="mt-2 text-xs font-black text-[#F5C400]">Sofort loslegen →</div>
                  </div>
                </div>
              </button>

              {/* Option 2: Manuell eingeben */}
              <button onClick={() => selectPreisMode('manuell')}
                className="bg-white border-2 border-[#2C2C2C]/10 rounded-2xl p-5 text-left active:scale-95 transition-transform">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#2C2C2C] rounded-xl flex items-center justify-center shrink-0 text-lg">✏️</div>
                  <div>
                    <div className="font-black text-[#2C2C2C]">Eigene Preise eingeben</div>
                    <div className="text-sm text-[#2C2C2C]/50 font-semibold mt-1 leading-relaxed">
                      Trag deine echten Stunden- und Einheitspreise ein. Die KI rechnet dann sofort mit deinen Zahlen.
                    </div>
                    <div className="mt-2 text-xs font-black text-[#2C2C2C]/40">~3 Minuten</div>
                  </div>
                </div>
              </button>

              {/* Option 3: PDF hochladen */}
              <button onClick={() => selectPreisMode('pdf')}
                className="bg-white border-2 border-[#2C2C2C]/10 rounded-2xl p-5 text-left active:scale-95 transition-transform">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#2C2C2C] rounded-xl flex items-center justify-center shrink-0 text-lg">🤖</div>
                  <div>
                    <div className="font-black text-[#2C2C2C]">Alte Angebote hochladen</div>
                    <div className="text-sm text-[#2C2C2C]/50 font-semibold mt-1 leading-relaxed">
                      Schick 1–5 deiner alten Angebote als PDF. Die KI liest deine Preislogik raus und übernimmt sie.
                    </div>
                    <div className="mt-2 text-xs font-black text-[#2C2C2C]/40">Smarteste Option</div>
                  </div>
                </div>
              </button>

              <button onClick={() => setStep(4)}
                className="mt-auto text-center text-[#2C2C2C]/30 font-semibold text-sm py-3">
                Erstmal überspringen
              </button>
            </div>
          )}

          {/* Markt-Modus: Bestätigung */}
          {preisMode === 'markt' && (
            <div className="flex-1 flex flex-col">
              <div className="bg-[#F5C400]/10 border-2 border-[#F5C400] rounded-2xl p-5 mb-4">
                <div className="font-black text-[#2C2C2C] mb-2">Marktübliche Preise werden geladen</div>
                <div className="text-sm text-[#2C2C2C]/60 font-semibold leading-relaxed">
                  Basierend auf deinem Gewerk lade ich aktuelle Durchschnittspreise aus deiner Branche.
                  Du kannst alle Preise später in den Einstellungen anpassen.
                </div>
              </div>
              <div className="mt-auto flex gap-3 pt-4">
                <button onClick={() => setPreisMode(null)}
                  className="flex-1 bg-white border-2 border-[#2C2C2C] text-[#2C2C2C] font-black text-base rounded-xl py-4">
                  Zurück
                </button>
                <button onClick={() => setStep(4)}
                  className="flex-[2] bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 active:scale-95 transition-transform">
                  Weiter
                </button>
              </div>
            </div>
          )}

          {/* Manuell-Modus: Preisfelder */}
          {preisMode === 'manuell' && preisEntries.length > 0 && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="text-xs font-bold text-[#2C2C2C]/40 mb-3 uppercase tracking-wide">
                {preisEntries.length} Positionen — anpassen oder leer lassen
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-4">
                {Object.entries(groupedEntries).map(([cat, entries]) => (
                  <div key={cat} className="bg-white rounded-2xl border border-[#2C2C2C]/5 overflow-hidden">
                    <button
                      onClick={() => setExpandedCats(prev => {
                        const next = new Set(prev)
                        next.has(cat) ? next.delete(cat) : next.add(cat)
                        return next
                      })}
                      className="w-full flex items-center justify-between px-4 py-3"
                    >
                      <span className="font-black text-[#2C2C2C] text-sm">{cat}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#2C2C2C]/40 font-bold">{entries.length}</span>
                        {expandedCats.has(cat)
                          ? <ChevronUp size={16} color="#2C2C2C" />
                          : <ChevronDown size={16} color="#2C2C2C" />
                        }
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
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={entry.unit_price}
                                    onChange={e => updatePreisEntry(idx, 'unit_price', e.target.value)}
                                    className="w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-lg px-3 py-2 text-[#2C2C2C] font-black text-sm focus:outline-none focus:border-[#F5C400] pr-6"
                                  />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#2C2C2C]/40 font-bold">€</span>
                                </div>
                                <span className="text-xs text-[#2C2C2C]/50 font-semibold">/ {entry.unit}</span>
                              </div>
                            </div>
                            <button onClick={() => removePreisEntry(idx)} className="p-1.5 shrink-0">
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
                <button onClick={() => setPreisMode(null)}
                  className="flex-1 bg-white border-2 border-[#2C2C2C] text-[#2C2C2C] font-black text-base rounded-xl py-4">
                  Zurück
                </button>
                <button onClick={() => setStep(4)}
                  className="flex-[2] bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 active:scale-95 transition-transform">
                  Weiter ({preisEntries.filter(e => parseFloat(e.unit_price) > 0).length})
                </button>
              </div>
            </div>
          )}

          {/* PDF-Modus */}
          {preisMode === 'pdf' && !pdfResult && (
            <div className="flex-1 flex flex-col">
              {!pdfAnalyzing ? (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    multiple
                    className="hidden"
                    onChange={e => {
                      const files = Array.from(e.target.files ?? []).slice(0, 5)
                      setPdfFiles(files)
                      setPdfError('')
                    }}
                  />

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#2C2C2C]/20 rounded-2xl p-8 text-center mb-4 active:scale-95 transition-transform"
                  >
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
                          <button onClick={() => setPdfFiles(prev => prev.filter((_, j) => j !== i))}>
                            <X size={14} color="#ef4444" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {pdfError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold mb-4">
                      {pdfError}
                    </div>
                  )}

                  <div className="mt-auto flex gap-3">
                    <button onClick={() => setPreisMode(null)}
                      className="flex-1 bg-white border-2 border-[#2C2C2C] text-[#2C2C2C] font-black text-base rounded-xl py-4">
                      Zurück
                    </button>
                    <button
                      onClick={analyzePdfs}
                      disabled={pdfFiles.length === 0}
                      className="flex-[2] bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 active:scale-95 transition-transform disabled:opacity-40"
                    >
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

          {/* PDF-Ergebnis bestätigen */}
          {preisMode === 'pdf' && pdfResult && preisEntries.length > 0 && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="bg-[#F5C400]/10 border border-[#F5C400] rounded-xl px-4 py-3 mb-3">
                <div className="font-black text-[#2C2C2C] text-sm">
                  ✓ {preisEntries.length} Preise erkannt — prüfe und passe an
                </div>
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-4">
                {Object.entries(groupedEntries).map(([cat, entries]) => (
                  <div key={cat} className="bg-white rounded-2xl border border-[#2C2C2C]/5 overflow-hidden">
                    <button
                      onClick={() => setExpandedCats(prev => {
                        const next = new Set(prev)
                        next.has(cat) ? next.delete(cat) : next.add(cat)
                        return next
                      })}
                      className="w-full flex items-center justify-between px-4 py-3"
                    >
                      <span className="font-black text-[#2C2C2C] text-sm">{cat}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#2C2C2C]/40 font-bold">{entries.length}</span>
                        {expandedCats.has(cat)
                          ? <ChevronUp size={16} color="#2C2C2C" />
                          : <ChevronDown size={16} color="#2C2C2C" />
                        }
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
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={entry.unit_price}
                                    onChange={e => updatePreisEntry(idx, 'unit_price', e.target.value)}
                                    className="w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-lg px-3 py-2 text-[#2C2C2C] font-black text-sm focus:outline-none focus:border-[#F5C400] pr-6"
                                  />
                                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#2C2C2C]/40 font-bold">€</span>
                                </div>
                                <span className="text-xs text-[#2C2C2C]/50 font-semibold">/ {entry.unit}</span>
                              </div>
                            </div>
                            <button onClick={() => removePreisEntry(idx)} className="p-1.5 shrink-0">
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
                <button onClick={() => { setPdfResult(null); setPreisEntries([]) }}
                  className="flex-1 bg-white border-2 border-[#2C2C2C] text-[#2C2C2C] font-black text-base rounded-xl py-4">
                  Nochmal
                </button>
                <button onClick={() => setStep(4)}
                  className="flex-[2] bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 active:scale-95 transition-transform">
                  Übernehmen ({preisEntries.filter(e => parseFloat(e.unit_price) > 0).length})
                </button>
              </div>
            </div>
          )}

          {/* Nur bei Modus-Auswahl: Zurück-Button */}
          {!preisMode && (
            <button onClick={() => setStep(2)}
              className="mt-3 text-[#2C2C2C]/40 font-semibold text-sm text-center">
              ← Zurück
            </button>
          )}
        </div>
      )}

      {/* ── Schritt 5: App speichern (PWA) ── */}
      {step === 5 && <PwaOnboardingStep onDone={() => router.push('/dashboard')} />}

      {/* ── Schritt 4: Buchhaltung ── */}
      {step === 4 && (
        <div className="flex flex-col flex-1">
          <h1 className="text-2xl font-black text-[#2C2C2C] mb-1">Buchhaltungssoftware</h1>
          <p className="text-[#2C2C2C]/50 font-semibold mb-6">
            Angebote landen mit einem Tap direkt darin.
          </p>
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
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                        opt.tier === 'oauth' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'
                      }`}>{TIER_LABEL[opt.tier]}</span>
                    )}
                    {opt.popular && <span className="text-[10px] font-black bg-[#F5C400]/30 text-[#2C2C2C] px-1.5 py-0.5 rounded">Beliebt</span>}
                  </div>
                  <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">{opt.desc}</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 ${
                  accounting === opt.value ? 'border-[#F5C400] bg-[#F5C400]' : 'border-[#2C2C2C]/30'
                }`}>
                  {accounting === opt.value && <div className="w-2 h-2 rounded-full bg-[#2C2C2C]" />}
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-semibold">
              {error}
            </div>
          )}

          <div className="mt-auto pt-6 flex gap-3">
            <button onClick={() => setStep(3)}
              className="flex-1 bg-white border-2 border-[#2C2C2C] text-[#2C2C2C] font-black text-lg rounded-xl py-4 active:scale-95 transition-transform">
              Zurück
            </button>
            <button onClick={handleFinish} disabled={loading}
              className="flex-[2] bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 active:scale-95 transition-transform disabled:opacity-50">
              {loading ? 'Speichere...' : "Los geht's"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const inputCls = "w-full bg-white border-2 border-[#2C2C2C] rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400]"

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
        <h1 className="text-2xl font-black text-[#2C2C2C] mb-2 text-center">
          Fast fertig!
        </h1>
        <p className="text-[#2C2C2C]/50 font-semibold text-center mb-8">
          Speicher die App auf deinem Homescreen — dann startet sie wie eine echte App, ohne Browser-Leiste.
        </p>

        <div className="bg-[#2C2C2C] rounded-2xl p-5">
          <div className="text-[#F5C400] font-black text-sm mb-4 uppercase tracking-wide">
            {platform === 'ios' ? 'Safari — so geht\'s' : 'Chrome — so geht\'s'}
          </div>

          {platform === 'ios' && (
            <div className="flex flex-col gap-3">
              <OnboardingStep n={1}>
                Tippe unten in Safari auf das{' '}
                <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg">
                  <Share size={12} color="white" />
                  <span className="text-white font-bold text-xs">Teilen</span>
                </span>
                {' '}Symbol
              </OnboardingStep>
              <OnboardingStep n={2}>Scrolle in der Liste nach unten</OnboardingStep>
              <OnboardingStep n={3}>Tippe auf <span className="text-white font-bold">„Zum Home-Bildschirm"</span></OnboardingStep>
              <OnboardingStep n={4}>Oben rechts auf <span className="text-white font-bold">„Hinzufügen"</span> — fertig!</OnboardingStep>
            </div>
          )}

          {platform === 'android' && (
            <div className="flex flex-col gap-3">
              <OnboardingStep n={1}>
                Tippe in Chrome oben rechts auf{' '}
                <span className="inline-flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg">
                  <MoreVertical size={12} color="white" />
                  <span className="text-white font-bold text-xs">Menü</span>
                </span>
              </OnboardingStep>
              <OnboardingStep n={2}>Tippe auf <span className="text-white font-bold">„App installieren"</span> oder <span className="text-white font-bold">„Zum Startbildschirm"</span></OnboardingStep>
              <OnboardingStep n={3}>Bestätige mit <span className="text-white font-bold">„Installieren"</span> — fertig!</OnboardingStep>
            </div>
          )}
        </div>

        <p className="text-center text-[#2C2C2C]/30 text-xs font-semibold mt-4">
          Kannst du auch später noch machen.
        </p>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <button
          onClick={onDone}
          className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 active:scale-95 transition-transform"
        >
          Los geht's →
        </button>
        <button onClick={onDone} className="text-center text-[#2C2C2C]/30 font-semibold text-sm py-1">
          Überspringen
        </button>
      </div>
    </div>
  )
}

function OnboardingStep({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-[#F5C400] flex items-center justify-center shrink-0 font-black text-[#2C2C2C] text-xs mt-0.5">
        {n}
      </div>
      <span className="text-white/70 text-sm font-semibold leading-relaxed">{children}</span>
    </div>
  )
}
