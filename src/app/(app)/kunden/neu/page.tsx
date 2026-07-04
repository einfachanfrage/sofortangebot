'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Check } from 'lucide-react'

export default function NeuerKundePage() {
  const router = useRouter()
  const supabase = createClient()

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [istUnternehmen, setIstUnternehmen] = useState(false)
  const [ustid, setUstid] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!name.trim()) { setError('Name ist erforderlich'); return }
    setSaving(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: company } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
    if (!company) return

    const { data, error: err } = await supabase.from('customers').insert({
      company_id: company.id,
      name: name.trim(),
      address: address.trim() || null,
      phone: phone.trim() || null,
      email: email.trim() || null,
      ist_unternehmen: istUnternehmen,
      ustid: ustid.trim() || null,
    }).select().single()

    setSaving(false)
    if (err) { setError('Fehler beim Speichern: ' + err.message); return }
    router.push(`/kunden/${data.id}`)
  }

  return (
    <div className="min-h-dvh bg-[#F7F7F5]">
      <div className="bg-[#2C2C2C] px-5 md:px-8 pt-12 pb-6">
        <Link href="/kunden" className="text-white/50 text-sm font-semibold">← Kunden</Link>
        <div className="text-white font-syne font-black text-xl mt-1">Neuer Kunde</div>
      </div>

      <div className="px-5 md:px-8 pt-5 flex flex-col gap-4 max-w-lg">

        <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5 flex flex-col gap-3">
          <div>
            <label className="text-xs font-bold text-[#2C2C2C]/40 uppercase tracking-wide block mb-1.5">Name *</label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Max Mustermann"
              className="w-full border border-[#2C2C2C]/10 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#F5C400]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#2C2C2C]/40 uppercase tracking-wide block mb-1.5">Adresse</label>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder={"Musterstraße 1\n12345 Musterstadt"}
              rows={2}
              className="w-full border border-[#2C2C2C]/10 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#F5C400] resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#2C2C2C]/40 uppercase tracking-wide block mb-1.5">Telefon</label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+49 170 1234567"
              className="w-full border border-[#2C2C2C]/10 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#F5C400]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#2C2C2C]/40 uppercase tracking-wide block mb-1.5">E-Mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="max@beispiel.de"
              className="w-full border border-[#2C2C2C]/10 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#F5C400]"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5 flex flex-col gap-3">
          <button
            onClick={() => setIstUnternehmen(v => !v)}
            className="flex items-center gap-3 text-left"
          >
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${istUnternehmen ? 'bg-[#F5C400] border-[#F5C400]' : 'border-[#2C2C2C]/20'}`}>
              {istUnternehmen && <Check size={12} strokeWidth={3} color="#2C2C2C" />}
            </div>
            <span className="text-sm font-bold text-[#2C2C2C]">Gewerblicher Kunde (Unternehmen)</span>
          </button>
          {istUnternehmen && (
            <div>
              <label className="text-xs font-bold text-[#2C2C2C]/40 uppercase tracking-wide block mb-1.5">USt-IdNr.</label>
              <input
                value={ustid}
                onChange={e => setUstid(e.target.value)}
                placeholder="DE123456789"
                className="w-full border border-[#2C2C2C]/10 rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-[#F5C400]"
              />
            </div>
          )}
        </div>

        {error && <p className="text-sm font-bold text-red-500">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 disabled:opacity-40 transition-opacity"
        >
          {saving ? 'Speichert…' : 'Kunde anlegen'}
        </button>
      </div>
    </div>
  )
}
