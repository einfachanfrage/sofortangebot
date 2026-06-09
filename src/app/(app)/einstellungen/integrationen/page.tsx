'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Eye, EyeOff, Check } from 'lucide-react'

export default function IntegrationenPage() {
  const [lexofficeKey, setLexofficeKey] = useState('')
  const [sevdeskKey, setSevdeskKey] = useState('')
  const [showLex, setShowLex] = useState(false)
  const [showSev, setShowSev] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('companies').select('lexoffice_api_key,sevdesk_api_key').eq('user_id', user.id).single()
      if (data) {
        setLexofficeKey(data.lexoffice_api_key ?? '')
        setSevdeskKey(data.sevdesk_api_key ?? '')
      }
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('companies').update({
      lexoffice_api_key: lexofficeKey.trim() || null,
      sevdesk_api_key: sevdeskKey.trim() || null,
    }).eq('user_id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-dvh bg-[#F7F7F5] pb-16">
      <div className="bg-[#2C2C2C] px-5 pt-12 pb-6">
        <Link href="/einstellungen" className="text-white/50 text-sm font-semibold">← Einstellungen</Link>
        <div className="text-white font-black text-xl mt-1">Integrationen</div>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-5">

        {/* Erklärung */}
        <div className="bg-[#F5C400]/10 border border-[#F5C400]/30 rounded-2xl px-4 py-3">
          <div className="text-sm font-bold text-[#2C2C2C]">So funktioniert's</div>
          <div className="text-xs text-[#2C2C2C]/60 font-semibold mt-1 leading-relaxed">
            Trag deinen API-Key ein — dann kannst du fertige Angebote mit einem Klick direkt in Lexoffice oder sevDesk übertragen. Den Key findest du in deinem jeweiligen Konto unter Einstellungen → API.
          </div>
        </div>

        {/* Lexoffice */}
        <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#0066CC]/10 flex items-center justify-center shrink-0">
              <span className="font-black text-[#0066CC] text-sm">LO</span>
            </div>
            <div>
              <div className="font-black text-[#2C2C2C]">Lexoffice</div>
              <div className="text-xs text-[#2C2C2C]/40 font-semibold">app.lexoffice.de → Einstellungen → API-Zugänge</div>
            </div>
          </div>
          <div className="relative">
            <input
              type={showLex ? 'text' : 'password'}
              value={lexofficeKey}
              onChange={e => setLexofficeKey(e.target.value)}
              placeholder="API-Key einfügen..."
              className="w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-sm focus:outline-none focus:border-[#F5C400] pr-12"
            />
            <button
              type="button"
              onClick={() => setShowLex(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
            >
              {showLex
                ? <EyeOff size={16} color="#2C2C2C" className="opacity-30" />
                : <Eye size={16} color="#2C2C2C" className="opacity-30" />}
            </button>
          </div>
        </div>

        {/* sevDesk */}
        <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#E84B3C]/10 flex items-center justify-center shrink-0">
              <span className="font-black text-[#E84B3C] text-sm">SD</span>
            </div>
            <div>
              <div className="font-black text-[#2C2C2C]">sevDesk</div>
              <div className="text-xs text-[#2C2C2C]/40 font-semibold">my.sevdesk.de → Einstellungen → Benutzer → API-Token</div>
            </div>
          </div>
          <div className="relative">
            <input
              type={showSev ? 'text' : 'password'}
              value={sevdeskKey}
              onChange={e => setSevdeskKey(e.target.value)}
              placeholder="API-Token einfügen..."
              className="w-full bg-[#F7F7F5] border-2 border-[#2C2C2C]/10 rounded-xl px-4 py-3 text-[#2C2C2C] font-semibold text-sm focus:outline-none focus:border-[#F5C400] pr-12"
            />
            <button
              type="button"
              onClick={() => setShowSev(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
            >
              {showSev
                ? <EyeOff size={16} color="#2C2C2C" className="opacity-30" />
                : <Eye size={16} color="#2C2C2C" className="opacity-30" />}
            </button>
          </div>
        </div>

        {/* Weitere bald */}
        <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5 opacity-50">
          <div className="font-black text-[#2C2C2C] text-sm mb-2">Bald verfügbar</div>
          <div className="flex flex-wrap gap-2">
            {['FastBill', 'Billomat', 'Papierkram', 'Easybill', 'DATEV'].map(n => (
              <span key={n} className="text-xs font-bold bg-[#F7F7F5] text-[#2C2C2C]/50 px-3 py-1.5 rounded-lg">{n}</span>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-[#F5C400] text-[#2C2C2C] font-black text-lg rounded-xl py-4 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saved ? <><Check size={20} strokeWidth={3} /> Gespeichert</> : saving ? 'Speichere...' : 'Speichern'}
        </button>
      </div>
    </div>
  )
}
