'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/Input'

interface Props {
  kundeId: string
  istUnternehmen: boolean
  ustid: string | null
  leitwegId: string | null
}

export function KundeTypToggle({ kundeId, istUnternehmen, ustid, leitwegId }: Props) {
  const [isUnternehmen, setIsUnternehmen] = useState(istUnternehmen)
  const [ustidVal, setUstidVal] = useState(ustid ?? '')
  const [leitwegVal, setLeitwegVal] = useState(leitwegId ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  async function save(overrideUnternehmen?: boolean) {
    setSaving(true)
    const val = overrideUnternehmen ?? isUnternehmen
    await supabase.from('customers').update({
      ist_unternehmen: val,
      ustid: ustidVal || null,
      leitweg_id: leitwegVal || null,
    }).eq('id', kundeId)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function toggleTyp() {
    const newVal = !isUnternehmen
    setIsUnternehmen(newVal)
    await save(newVal)
  }

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#2C2C2C]/5 flex flex-col gap-3">
      <div className="text-xs font-black text-[#2C2C2C]/40 uppercase tracking-wide">Kundentyp & E-Rechnung</div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="font-bold text-sm text-[#2C2C2C]">
            {isUnternehmen ? 'Geschäftskunde' : 'Privatkunde'}
          </div>
          <div className="text-xs text-[#2C2C2C]/40 font-semibold mt-0.5">
            {isUnternehmen
              ? 'ZUGFeRD-PDFs werden automatisch erstellt'
              : 'Kein ZUGFeRD — kein E-Rechnungspflicht'}
          </div>
        </div>
        <button type="button" onClick={toggleTyp} disabled={saving}
          className={`relative inline-flex h-7 w-12 items-center rounded-full border-2 transition-colors flex-shrink-0 ${
            isUnternehmen ? 'bg-[#F5C400] border-[#F5C400]' : 'bg-[#2C2C2C]/10 border-transparent'
          }`}>
          <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
            isUnternehmen ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>

      {isUnternehmen && (
        <div className="flex flex-col gap-2 pt-2 border-t border-[#2C2C2C]/5">
          <div>
            <label className="block text-xs font-black text-[#2C2C2C]/40 mb-1 uppercase tracking-wide">
              USt-IdNr. (optional)
            </label>
            <Input
              value={ustidVal}
              onChange={e => setUstidVal(e.target.value)}
              onBlur={() => save()}
              placeholder="DE123456789"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-[#2C2C2C]/40 mb-1 uppercase tracking-wide">
              Leitweg-ID (nur öffentliche Auftraggeber)
            </label>
            <Input
              value={leitwegVal}
              onChange={e => setLeitwegVal(e.target.value)}
              onBlur={() => save()}
              placeholder="991-12345678-06"
            />
          </div>
          {saved && (
            <p className="text-xs text-green-600 font-semibold">Gespeichert</p>
          )}
        </div>
      )}
    </div>
  )
}
