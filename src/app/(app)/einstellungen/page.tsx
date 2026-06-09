'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Company } from '@/lib/types'
import { GEWERKE } from '@/lib/gewerke'
import { Check, Upload, X } from 'lucide-react'
import BottomNav from '@/components/BottomNav'

export default function EinstellungenPage() {
  const [company, setCompany] = useState<Company | null>(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  const [iban, setIban] = useState('')
  const [vatRate, setVatRate] = useState<19 | 7 | 0>(19)
  const [paymentDays, setPaymentDays] = useState(14)
  const [reminderDays, setReminderDays] = useState(3)
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
        setName(data.name)
        setAddress(data.address)
        setTaxNumber(data.tax_number ?? '')
        setIban(data.iban ?? '')
        setVatRate(data.vat_rate as 19 | 7 | 0)
        setPaymentDays(data.payment_days)
        setReminderDays(data.reminder_days ?? 3)
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

    await supabase
      .from('companies')
      .update({ name, address, tax_number: taxNumber, iban, vat_rate: vatRate, payment_days: paymentDays, reminder_days: reminderDays, gewerke })
      .eq('user_id', user.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleLogoUpload(file: File) {
    setLogoError('')
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
    if (!allowed.includes(file.type)) {
      setLogoError('Nur PNG, JPG, WebP oder SVG erlaubt — keine Word- oder PDF-Dateien.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setLogoError('Datei zu groß. Bitte unter 5 MB.')
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
    await supabase.from('companies').update({ logo_url: null }).eq('user_id', company?.user_id ?? '')
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-24">
      <div className="bg-[#2C2C2C] px-5 pt-12 pb-6">
        <div className="text-[#F5C400] text-xl font-black tracking-tight">Einstellungen</div>
      </div>

      <form onSubmit={handleSave} className="px-5 pt-6 flex flex-col gap-5">
        <Section title="Betrieb">
          <Field label="Firmenname">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className={inputClass}
              placeholder="Muster GmbH"
            />
          </Field>
          <Field label="Adresse">
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Straße, PLZ Ort"
            />
          </Field>
          <Field label="Steuernummer">
            <input
              value={taxNumber}
              onChange={e => setTaxNumber(e.target.value)}
              className={inputClass}
              placeholder="12/345/67890"
            />
          </Field>
          <Field label="IBAN">
            <input
              value={iban}
              onChange={e => setIban(e.target.value)}
              className={inputClass}
              placeholder="DE89 3704 0044 0532 0130 00"
            />
          </Field>
        </Section>

        {/* Logo */}
        <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
          <div className="font-black text-[#2C2C2C] mb-1">Firmenlogo</div>
          <div className="text-xs text-[#2C2C2C]/40 font-semibold mb-4">PNG, JPG, WebP oder SVG · max. 5 MB · empfohlen 400×200 px</div>

          <input
            ref={logoInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoUpload(f) }}
          />

          {logoUrl ? (
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt="Logo" className="h-16 object-contain rounded-xl border border-[#2C2C2C]/10" />
              <button
                type="button"
                onClick={removeLogo}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={logoUploading}
              className="flex items-center gap-3 border-2 border-dashed border-[#2C2C2C]/20 rounded-xl px-5 py-4 active:scale-95 transition-transform disabled:opacity-50"
            >
              <Upload size={20} color="#2C2C2C" strokeWidth={2} className="opacity-40" />
              <span className="font-bold text-[#2C2C2C]/60 text-sm">
                {logoUploading ? 'Wird hochgeladen...' : 'Logo hochladen'}
              </span>
            </button>
          )}

          {!logoUrl && (
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={logoUploading}
              className={`${logoUrl ? 'mt-3 ' : 'hidden '}text-xs font-bold text-[#2C2C2C]/40`}
            >
              Anderes Logo wählen
            </button>
          )}
          {logoUrl && (
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="block mt-2 text-xs font-bold text-[#2C2C2C]/40"
            >
              Anderes Logo wählen
            </button>
          )}

          {logoError && (
            <div className="mt-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-3 py-2 text-xs font-semibold">
              {logoError}
            </div>
          )}
        </div>

        <Section title="Rechnungsstellung">
          <Field label="Mehrwertsteuer">
            <select
              value={vatRate}
              onChange={e => setVatRate(Number(e.target.value) as 19 | 7 | 0)}
              className={inputClass}
            >
              <option value={19}>19% (Regelsteuersatz)</option>
              <option value={7}>7% (ermäßigt)</option>
              <option value={0}>0% (Kleinunternehmer §19)</option>
            </select>
          </Field>
          <Field label="Zahlungsziel (Tage)">
            <input
              type="number"
              value={paymentDays}
              onChange={e => setPaymentDays(Number(e.target.value))}
              min={0}
              max={90}
              className={inputClass}
            />
          </Field>
          <Field label="Erinnerung nach (Tage)">
            <input
              type="number"
              value={reminderDays}
              onChange={e => setReminderDays(Number(e.target.value))}
              min={0}
              max={30}
              className={inputClass}
            />
            <p className="text-xs text-[#2C2C2C]/40 font-semibold mt-1">
              Automatische E-Mail an Kunden, die noch nicht unterschrieben haben. 0 = deaktiviert.
            </p>
          </Field>
        </Section>

        {/* Gewerk-Auswahl */}
        <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
          <div className="font-black text-[#2C2C2C] mb-1">Dein Gewerk</div>
          <div className="text-xs text-[#2C2C2C]/40 font-semibold mb-4">
            Die KI stellt dann die passenden Rückfragen.
          </div>
          <div className="flex flex-col gap-2">
            {GEWERKE.map(g => {
              const active = gewerke.includes(g.id)
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGewerke(prev => prev.includes(g.id) ? prev.filter(x => x !== g.id) : [...prev, g.id])}
                  className={`flex items-center gap-3 w-full rounded-xl px-3 py-3 text-left border-2 transition-colors ${
                    active ? 'border-[#F5C400] bg-[#F5C400]/5' : 'border-[#2C2C2C]/8 bg-[#F7F7F5]'
                  }`}
                >
                  <span className="text-xl">{g.emoji}</span>
                  <span className={`font-bold text-sm flex-1 ${active ? 'text-[#2C2C2C]' : 'text-[#2C2C2C]/60'}`}>{g.label}</span>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? 'border-[#F5C400] bg-[#F5C400]' : 'border-[#2C2C2C]/20'}`}>
                    {active && <Check size={12} color="#2C2C2C" strokeWidth={3} />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 active:scale-95 transition-all disabled:opacity-50"
        >
          {saved ? '✓ Gespeichert' : saving ? 'Speichere...' : 'Speichern'}
        </button>
      </form>

      <div className="px-5 mt-4 flex flex-col gap-3">
        <Link
          href="/preise"
          className="flex items-center justify-between w-full bg-white border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-4"
        >
          <span className="font-bold text-[#2C2C2C]">Preisdatenbank verwalten</span>
          <span className="text-[#2C2C2C]/40">›</span>
        </Link>
        <Link
          href="/einstellungen/integrationen"
          className="flex items-center justify-between w-full bg-white border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-4"
        >
          <div>
            <span className="font-bold text-[#2C2C2C]">Integrationen</span>
            <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">Lexoffice, sevDesk & mehr</div>
          </div>
          <span className="text-[#2C2C2C]/40">›</span>
        </Link>
      </div>

      <div className="px-5 mt-3">
        <button
          onClick={handleLogout}
          className="w-full bg-white border-2 border-red-200 text-red-600 font-bold rounded-xl py-4"
        >
          Ausloggen
        </button>
      </div>

      <BottomNav />
    </div>
  )
}

const inputClass = "w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-base focus:outline-none focus:border-[#F5C400]"

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
      <div className="font-black text-[#2C2C2C] mb-4">{title}</div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#2C2C2C]/50 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  )
}
