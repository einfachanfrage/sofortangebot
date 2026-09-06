'use client'

import { Input } from '@/components/Input'
import { AddressFields } from '@/components/AddressFields'
import type { AddressValue } from '@/lib/address'

// ── DC-044 (Product Designer, 06.09.2026) ─────────────────────────────────
//
// „Kundendaten lassen sich nach dem Anlegen nirgends mehr bearbeiten."
// Ein Tippfehler in der Telefonnummer war nur zu korrigieren, indem man den
// Kunden neu anlegt — und damit seine Angebots- und Baustellen-Historie
// verliert, weil eine neue Kunden-ID entsteht.
//
// Die Felder stehen jetzt EINMAL hier und werden von „Neuer Kunde" und
// „Kunde bearbeiten" gemeinsam benutzt. Zwei Formulare für dieselben Daten
// wären genau die Sorte Dopplung, die in diesem Projekt schon zweimal
// auseinandergelaufen ist (zwei Katalogeinträge für einen Arbeitsgang,
// zwei Antworten auf „welcher Raum").

export interface KundenKontakt {
  name: string
  adresse: AddressValue
  phone: string
  email: string
}

interface Props {
  wert: KundenKontakt
  onChange: (wert: KundenKontakt) => void
  autoFocus?: boolean
}

export function KundenKontaktFelder({ wert, onChange, autoFocus }: Props) {
  const setze = <K extends keyof KundenKontakt>(feld: K, v: KundenKontakt[K]) =>
    onChange({ ...wert, [feld]: v })

  return (
    <div className="bg-white rounded-2xl p-4 border border-anthracite/5 flex flex-col gap-3">
      <div>
        <label className="text-xs font-bold text-anthracite/40 uppercase tracking-wide block mb-1.5">Name *</label>
        <Input
          autoFocus={autoFocus}
          value={wert.name}
          onChange={e => setze('name', e.target.value)}
          placeholder="Max Mustermann"
        />
      </div>
      <div>
        <label className="text-xs font-bold text-anthracite/40 uppercase tracking-wide block mb-1.5">Adresse</label>
        <AddressFields value={wert.adresse} onChange={v => setze('adresse', v)} />
      </div>
      <div>
        <label className="text-xs font-bold text-anthracite/40 uppercase tracking-wide block mb-1.5">Telefon</label>
        <Input
          type="tel"
          value={wert.phone}
          onChange={e => setze('phone', e.target.value)}
          placeholder="+49 170 1234567"
        />
      </div>
      <div>
        <label className="text-xs font-bold text-anthracite/40 uppercase tracking-wide block mb-1.5">E-Mail</label>
        <Input
          type="email"
          value={wert.email}
          onChange={e => setze('email', e.target.value)}
          placeholder="max@beispiel.de"
        />
      </div>
    </div>
  )
}
