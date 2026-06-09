'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Company } from '@/lib/types'
import { GEWERKE } from '@/lib/gewerke'
import { Check } from 'lucide-react'
import BottomNav from '@/components/BottomNav'

export default function EinstellungenPage() {
  const [company, setCompany] = useState<Company | null>(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [taxNumber, setTaxNumber] = useState('')
  const [iban, setIban] = useState('')
  const [vatRate, setVatRate] = useState<19 | 7 | 0>(19)
  const [paymentDays, setPaymentDays] = useState(14)
  const [gewerke, setGewerke] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
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
        setGewerke(data.gewerke ?? [])
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
      .update({ name, address, tax_number: taxNumber, iban, vat_rate: vatRate, payment_days: paymentDays, gewerke })
      .eq('user_id', user.id)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
