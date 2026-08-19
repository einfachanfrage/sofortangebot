'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NeueBaustelleButtonProps {
  customerId: string
  /**
   * 'primary' = volle gelbe Karte (Normalfall, sobald schon mehrere
   * Baustellen sichtbar gruppiert sind). 'subtle' = dezenter Text-Link für
   * den Normalfall mit nur einer Baustelle — der Einstiegspunkt, über den
   * eine zweite Baustelle überhaupt erst entsteht, ohne dass er sich wie
   * ein neues Pflichtfeld aufdrängt (DC-029).
   */
  variant?: 'primary' | 'subtle'
}

/**
 * Legt eine neue Baustelle für einen Kunden an (DC-029). Aktualisiert nach
 * dem Anlegen die Kunde-Seite per router.refresh() — sobald es die zweite
 * Baustelle ist, wechselt die Seite dadurch automatisch in die gruppierte
 * Ansicht.
 */
export function NeueBaustelleButton({ customerId, variant = 'primary' }: NeueBaustelleButtonProps) {
  const router = useRouter()
  const supabase = createClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [adresse, setAdresse] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function anlegen() {
    if (!name.trim()) return
    setSaving(true)
    setError('')
    const { data: co } = await supabase.from('companies').select('id')
      .eq('user_id', (await supabase.auth.getUser()).data.user?.id ?? '').single()
    if (!co) { setSaving(false); setError('Betrieb nicht gefunden'); return }
    const { error: insertError } = await supabase.from('baustellen').insert({
      company_id: co.id,
      customer_id: customerId,
      name: name.trim(),
      adresse: adresse.trim() || null,
      ist_erstbaustelle: false,
    })
    setSaving(false)
    if (insertError) { setError('Baustelle konnte nicht angelegt werden'); return }
    setOpen(false)
    setName('')
    setAdresse('')
    router.refresh()
  }

  return (
    <>
      {variant === 'primary' ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-[#F5C400] text-[#2C2C2C] font-black rounded-2xl py-3 text-sm active:scale-[0.98] transition-transform"
        >
          + Neue Baustelle
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="mx-auto block text-xs font-bold text-[#2C2C2C]/35 hover:text-[#2C2C2C]/60 underline underline-offset-2 mt-2"
        >
          + Weitere Baustelle für diesen Kunden
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full md:max-w-sm bg-white rounded-t-3xl md:rounded-3xl px-5 pt-4 pb-8 md:pb-6 shadow-2xl">
            <div className="flex justify-center mb-4 md:hidden"><div className="w-10 h-1 rounded-full bg-[#2C2C2C]/20" /></div>
            <h2 className="font-syne font-extrabold text-[#2C2C2C] text-[20px] mb-4">Neue Baustelle</h2>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name (z. B. Bad OG links)"
              className="w-full border border-[#2C2C2C]/10 rounded-xl px-3 py-2.5 text-sm font-semibold mb-2 focus:outline-none focus:border-[#F5C400]"
            />
            <input
              type="text"
              value={adresse}
              onChange={e => setAdresse(e.target.value)}
              placeholder="Adresse (optional)"
              className="w-full border border-[#2C2C2C]/10 rounded-xl px-3 py-2.5 text-sm font-semibold mb-2 focus:outline-none focus:border-[#F5C400]"
            />
            {error && <p className="text-red-500 text-xs font-semibold mb-2">{error}</p>}
            <button
              onClick={anlegen}
              disabled={!name.trim() || saving}
              className="w-full bg-[#2C2C2C] text-white font-black rounded-2xl py-3.5 text-sm disabled:opacity-50 mb-2 mt-2"
            >
              {saving ? 'Wird angelegt…' : '+ Baustelle anlegen'}
            </button>
            <button onClick={() => setOpen(false)} className="w-full text-center text-xs font-bold text-[#2C2C2C]/40 py-2">
              Abbrechen
            </button>
          </div>
        </div>
      )}
    </>
  )
}
