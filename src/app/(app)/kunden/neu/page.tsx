'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Input } from '@/components/Input'
import { KundenKontaktFelder, type KundenKontakt } from '@/components/KundenKontaktFelder'
import { EMPTY_ADDRESS, composeAddress } from '@/lib/address'

export default function NeuerKundePage() {
  const router = useRouter()
  const supabase = createClient()

  // DC-044: Die Kontaktfelder stehen jetzt in KundenKontaktFelder und werden
  // von „Neuer Kunde" und „Kunde bearbeiten" gemeinsam benutzt — zwei
  // Formulare für dieselben Daten laufen sonst auseinander.
  const [kontakt, setKontakt] = useState<KundenKontakt>({ name: '', adresse: EMPTY_ADDRESS, phone: '', email: '' })
  const [istUnternehmen, setIstUnternehmen] = useState(false)
  const [ustid, setUstid] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!kontakt.name.trim()) { setError('Name ist erforderlich'); return }
    setSaving(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data: company } = await supabase.from('companies').select('id').eq('user_id', user.id).single()
    if (!company) return

    const { data, error: err } = await supabase.from('customers').insert({
      company_id: company.id,
      name: kontakt.name.trim(),
      address: composeAddress(kontakt.adresse) || null,
      phone: kontakt.phone.trim() || null,
      email: kontakt.email.trim() || null,
      ist_unternehmen: istUnternehmen,
      ustid: ustid.trim() || null,
    }).select().single()

    setSaving(false)
    if (err) { setError('Fehler beim Speichern: ' + err.message); return }
    router.push(`/kunden/${data.id}`)
  }

  return (
    <div className="min-h-dvh bg-bg">
      <div className="bg-anthracite px-5 md:px-8 pt-12 pb-6">
        <Link href="/kunden" className="text-white/50 text-sm font-semibold">← Kunden</Link>
        <div className="text-white font-syne font-black text-xl mt-1">Neuer Kunde</div>
      </div>

      <div className="px-5 md:px-8 pt-5 flex flex-col gap-4 max-w-xl mx-auto">

        <KundenKontaktFelder wert={kontakt} onChange={setKontakt} autoFocus />

        <div className="bg-white rounded-2xl p-4 border border-anthracite/5 flex flex-col gap-3">
          <button
            onClick={() => setIstUnternehmen(v => !v)}
            className="flex items-center gap-3 text-left"
          >
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${istUnternehmen ? 'bg-yellow border-yellow' : 'border-anthracite/20'}`}>
              {istUnternehmen && <Check size={12} strokeWidth={3} color="var(--color-anthracite)" />}
            </div>
            <span className="text-sm font-bold text-anthracite">Gewerblicher Kunde (Unternehmen)</span>
          </button>
          {istUnternehmen && (
            <div>
              <label className="text-xs font-bold text-anthracite/40 uppercase tracking-wide block mb-1.5">USt-IdNr.</label>
              <Input
                value={ustid}
                onChange={e => setUstid(e.target.value)}
                placeholder="DE123456789"
              />
            </div>
          )}
        </div>

        {error && <p className="text-sm font-bold text-red-500">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving || !kontakt.name.trim()}
          className="w-full bg-yellow text-anthracite font-black text-lg rounded-2xl py-4 disabled:opacity-40 transition-opacity"
        >
          {saving ? 'Speichert…' : 'Kunde anlegen'}
        </button>
      </div>
    </div>
  )
}
