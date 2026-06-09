'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Company } from '@/lib/types'
import { GEWERKE } from '@/lib/gewerke'
import { Check, Upload, X, Loader2, Building2, Receipt, Wrench, Image, ExternalLink, LogOut } from 'lucide-react'
import BottomNav from '@/components/BottomNav'

export default function EinstellungenPage() {
  const [company, setCompany] = useState<Company | null>(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  const [ustId, setUstId] = useState('')
  const [iban, setIban] = useState('')
  const [agbUrl, setAgbUrl] = useState('')
  const [vatRate, setVatRate] = useState<19 | 7 | 0>(19)
  const [paymentDays, setPaymentDays] = useState(14)
  const [gewerke, setGewerke] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoError, setLogoError] = useState('')
  const logoInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('companies').select('*').eq('user_id', user.id).single()
      if (data) {
        setCompany(data)
        setName(data.name ?? '')
        setAddress(data.address ?? '')
        setTaxNumber(data.tax_number ?? '')
        setUstId(data.ust_id ?? '')
        setIban(data.iban ?? '')
        setAgbUrl(data.agb_url ?? '')
        setVatRate((data.vat_rate ?? 19) as 19 | 7 | 0)
        setPaymentDays(data.payment_days ?? 14)
        setGewerke(data.gewerke ?? [])
        setLogoUrl(data.logo_url ?? null)
      }
    }
    load()
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('companies').update({
      name, address, tax_number: taxNumber, ust_id: ustId || null,
      iban, agb_url: agbUrl || null,
      vat_rate: vatRate, payment_days: paymentDays, gewerke,
    }).eq('user_id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function handleLogoUpload(file: File) {
    setLogoError('')
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      setLogoError('Nur PNG, JPG, WebP oder SVG erlaubt.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setLogoError('Datei zu groß (max. 5 MB).')
      return
    }
    setLogoUploading(true)
    const fd = new FormData()
    fd.append('logo', file)
    const r = await fetch('/api/upload-logo', { method: 'POST', body: fd })
    const data = await r.json()
    setLogoUploading(false)
    if (!r.ok) { setLogoError(data.error ?? 'Upload fehlgeschlagen'); return }
    setLogoUrl(data.url + '?t=' + Date.now())
  }

  async function removeLogo() {
    setLogoUrl(null)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await supabase.from('companies').update({ logo_url: null }).eq('user_id', user.id)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-24 md:pb-12">
      {/* Header */}
      <div className="bg-[#2C2C2C] md:bg-transparent px-5 md:px-8 pt-12 md:pt-8 pb-6">
        <div className="text-[#F5C400] md:text-[#2C2C2C] text-2xl font-black">Einstellungen</div>
        <div className="text-white/40 md:text-[#2C2C2C]/40 text-sm font-semibold mt-0.5">Betrieb, Rechnungsstellung, Gewerk</div>
      </div>

      <form onSubmit={handleSave} className="px-5 md:px-8 flex flex-col gap-5 md:gap-6">

        {/* Desktop: 2-Spalten Grid für Betrieb + Logo */}
        <div className="md:grid md:grid-cols-2 md:gap-6 flex flex-col gap-5">

          {/* Betrieb */}
          <Card icon={<Building2 size={16} />} title="Betrieb">
            <Field label="Firmenname">
              <input value={name} onChange={e => setName(e.target.value)}
                className={inputCls} placeholder="Malerbetrieb Müller" />
            </Field>
            <Field label="Adresse">
              <textarea value={address} onChange={e => setAddress(e.target.value)}
                rows={3} className={`${inputCls} resize-none`}
                placeholder={'Musterstraße 1\n12345 Musterstadt'} />
            </Field>
            <Field label="Steuernummer">
              <input value={taxNumber} onChange={e => setTaxNumber(e.target.value)}
                className={inputCls} placeholder="12/345/67890" />
            </Field>
            <Field label="USt-IdNr. (optional)">
              <input value={ustId} onChange={e => setUstId(e.target.value)}
                className={inputCls} placeholder="DE123456789" />
              <p className="text-xs text-[#2C2C2C]/30 font-semibold mt-1">
                Falls vorhanden, erscheint die USt-ID statt der Steuernummer auf dem Angebot.
              </p>
            </Field>
            <Field label="IBAN">
              <input value={iban} onChange={e => setIban(e.target.value)}
                className={inputCls} placeholder="DE89 3704 0044 0532 0130 00" />
            </Field>
            <Field label="Link zu deinen AGB (optional)">
              <input value={agbUrl} onChange={e => setAgbUrl(e.target.value)}
                className={inputCls} placeholder="https://meinewebseite.de/agb" type="url" />
              <p className="text-xs text-[#2C2C2C]/30 font-semibold mt-1">
                Wenn hinterlegt, müssen Kunden deinen AGB beim Unterschreiben zustimmen.
              </p>
            </Field>
          </Card>

          {/* Logo */}
          <Card icon={<Image size={16} />} title="Firmenlogo">
            <p className="text-xs text-[#2C2C2C]/40 font-semibold -mt-2 mb-3">
              PNG, JPG, WebP oder SVG · max. 5 MB · empfohlen 400×200 px
            </p>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f) }}
            />
            {logoUrl ? (
              <div className="flex flex-col gap-3">
                <div className="relative inline-block w-fit">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={logoUrl} alt="Logo"
                    className="h-20 object-contain rounded-xl border-2 border-[#2C2C2C]/10 p-2 bg-white" />
                  <button type="button" onClick={removeLogo}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
                    <X size={10} strokeWidth={3} />
                  </button>
                </div>
                <button type="button" onClick={() => logoInputRef.current?.click()}
                  className="text-xs font-bold text-[#2C2C2C]/40 text-left">
                  Anderes Logo wählen →
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => logoInputRef.current?.click()}
                disabled={logoUploading}
                className="w-full border-2 border-dashed border-[#2C2C2C]/20 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-[#F5C400] transition-colors disabled:opacity-50">
                {logoUploading
                  ? <Loader2 size={24} color="#F5C400" className="animate-spin" />
                  : <Upload size={24} color="#2C2C2C" strokeWidth={1.5} className="opacity-30" />
                }
                <span className="font-bold text-[#2C2C2C]/50 text-sm">
                  {logoUploading ? 'Wird hochgeladen...' : 'Logo hochladen'}
                </span>
              </button>
            )}
            {logoError && (
              <div className="mt-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-xs font-semibold">
                {logoError}
              </div>
            )}
          </Card>
        </div>

        {/* Desktop: 2-Spalten Grid für Rechnungsstellung + Gewerk */}
        <div className="md:grid md:grid-cols-2 md:gap-6 flex flex-col gap-5">

          {/* Rechnungsstellung */}
          <Card icon={<Receipt size={16} />} title="Rechnungsstellung">
            <Field label="Mehrwertsteuer">
              <div className="flex gap-2">
                {([
                  { value: 19, label: '19 %' },
                  { value: 7,  label: '7 %'  },
                  { value: 0,  label: 'Kleinunternehmer' },
                ] as { value: 19 | 7 | 0; label: string }[]).map(opt => (
                  <button key={opt.value} type="button" onClick={() => setVatRate(opt.value)}
                    className={`flex-1 py-2.5 rounded-xl border-2 font-black text-xs transition-colors ${
                      vatRate === opt.value
                        ? 'border-[#F5C400] bg-[#F5C400]/10 text-[#2C2C2C]'
                        : 'border-[#2C2C2C]/10 bg-[#F7F7F5] text-[#2C2C2C]/50'
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#2C2C2C]/30 font-semibold mt-1.5">
                {vatRate === 0
                  ? 'Keine MwSt. auf Angeboten (§ 19 UStG).'
                  : `${vatRate} % MwSt. wird auf Angeboten ausgewiesen.`}
              </p>
            </Field>
            <Field label="Zahlungsziel">
              <div className="flex gap-2">
                {[7, 14, 30].map(days => (
                  <button key={days} type="button" onClick={() => setPaymentDays(days)}
                    className={`flex-1 py-2.5 rounded-xl border-2 font-black text-xs transition-colors ${
                      paymentDays === days
                        ? 'border-[#F5C400] bg-[#F5C400]/10 text-[#2C2C2C]'
                        : 'border-[#2C2C2C]/10 bg-[#F7F7F5] text-[#2C2C2C]/50'
                    }`}>
                    {days} Tage
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#2C2C2C]/30 font-semibold mt-1.5">
                Steht als Zahlungsfrist auf jedem Angebot.
              </p>
            </Field>
          </Card>

          {/* Gewerk */}
          <Card icon={<Wrench size={16} />} title="Gewerk">
            <p className="text-xs text-[#2C2C2C]/40 font-semibold -mt-2 mb-3">
              Die KI stellt passende Rückfragen für dein Handwerk.
            </p>
            <div className="flex flex-col gap-1.5">
              {GEWERKE.map(g => {
                const active = gewerke.includes(g.id)
                return (
                  <button key={g.id} type="button"
                    onClick={() => setGewerke(prev =>
                      prev.includes(g.id) ? prev.filter(x => x !== g.id) : [...prev, g.id]
                    )}
                    className={`flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left border-2 transition-colors ${
                      active ? 'border-[#F5C400] bg-[#F5C400]/5' : 'border-[#2C2C2C]/8 bg-[#F7F7F5]'
                    }`}
                  >
                    <span className="text-lg">{g.emoji}</span>
                    <span className={`font-bold text-sm flex-1 ${active ? 'text-[#2C2C2C]' : 'text-[#2C2C2C]/50'}`}>
                      {g.label}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      active ? 'border-[#F5C400] bg-[#F5C400]' : 'border-[#2C2C2C]/20'}`}>
                      {active && <Check size={11} color="#2C2C2C" strokeWidth={3} />}
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>
        </div>

        {/* Save Button */}
        <button type="submit" disabled={saving}
          className="w-full md:max-w-xs bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {saved
            ? <><Check size={18} strokeWidth={3} /> Gespeichert</>
            : saving ? 'Speichere...' : 'Speichern'
          }
        </button>
      </form>

      {/* Links */}
      <div className="px-5 md:px-8 mt-5 md:grid md:grid-cols-2 md:gap-4 flex flex-col gap-3">
        <Link href="/preise"
          className="flex items-center justify-between w-full bg-white border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-4 hover:border-[#F5C400]/50 transition-colors group">
          <div>
            <span className="font-bold text-[#2C2C2C]">Preisdatenbank</span>
            <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">Stunden- und Einheitspreise verwalten</div>
          </div>
          <ExternalLink size={16} className="text-[#2C2C2C]/30 group-hover:text-[#2C2C2C]/60" />
        </Link>
        <Link href="/einstellungen/integrationen"
          className="flex items-center justify-between w-full bg-white border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-4 hover:border-[#F5C400]/50 transition-colors group">
          <div>
            <span className="font-bold text-[#2C2C2C]">Integrationen</span>
            <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">Lexoffice, sevDesk & mehr</div>
          </div>
          <ExternalLink size={16} className="text-[#2C2C2C]/30 group-hover:text-[#2C2C2C]/60" />
        </Link>
      </div>

      <div className="px-5 md:px-8 mt-3">
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 font-bold text-sm py-3 hover:text-red-600 transition-colors">
          <LogOut size={16} />
          Ausloggen
        </button>
      </div>

      <BottomNav />
    </div>
  )
}

const inputCls = "w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400] transition-colors"

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#2C2C2C]/5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 bg-[#2C2C2C]/5 rounded-lg flex items-center justify-center text-[#2C2C2C]/50">
          {icon}
        </div>
        <div className="font-black text-[#2C2C2C]">{title}</div>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-black text-[#2C2C2C]/40 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}
