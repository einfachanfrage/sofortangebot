'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { KundenKontaktFelder, type KundenKontakt } from '@/components/KundenKontaktFelder'
import { composeAddress, parseAddress } from '@/lib/address'

interface Props {
  kundeId: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
}

export function KundeBearbeitenFormular({ kundeId, name, address, phone, email }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [wert, setWert] = useState<KundenKontakt>({
    name,
    adresse: parseAddress(address),
    phone: phone ?? '',
    email: email ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function speichern() {
    if (!wert.name.trim()) { setError('Name ist erforderlich'); return }
    setSaving(true)
    setError('')
    // Bewusst NUR die Kontaktfelder. Kundentyp, USt-IdNr. und Leitweg-ID
    // haben auf der Detailseite bereits ihre eigene, funktionierende Stelle
    // (KundeTypToggle) — sie hier ein zweites Mal zu schreiben hieße, zwei
    // Schreibwege für dieselben Spalten zu haben. Genau das war der Fehler
    // beim doppelten Wandpreis.
    const { error: err } = await supabase.from('customers').update({
      name: wert.name.trim(),
      address: composeAddress(wert.adresse) || null,
      phone: wert.phone.trim() || null,
      email: wert.email.trim() || null,
    }).eq('id', kundeId)

    setSaving(false)
    if (err) { setError('Fehler beim Speichern: ' + err.message); return }
    router.push(`/kunden/${kundeId}`)
    router.refresh()
  }

  return (
    <>
      <KundenKontaktFelder wert={wert} onChange={setWert} autoFocus />

      <div className="text-xs font-semibold text-anthracite/40 px-1">
        Kundentyp, USt-IdNr. und Leitweg-ID änderst du auf der Kundenseite direkt.
      </div>

      {error && <p className="text-sm font-bold text-red-500">{error}</p>}

      <button
        onClick={speichern}
        disabled={saving || !wert.name.trim()}
        className="w-full bg-yellow text-anthracite font-black text-lg rounded-2xl py-4 disabled:opacity-40 transition-opacity"
      >
        {saving ? 'Speichert…' : 'Änderungen speichern'}
      </button>
    </>
  )
}
