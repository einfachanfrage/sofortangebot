'use client'

import { Input } from './Input'
import type { AddressValue } from '@/lib/address'

// Strukturierte Adresseingabe (Straße / PLZ / Ort) statt einem großen Textfeld.
// Nutzt die einheitliche <Input>-Komponente.
export function AddressFields({
  value,
  onChange,
}: {
  value: AddressValue
  onChange: (v: AddressValue) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Input
        placeholder="Straße und Hausnummer"
        value={value.strasse}
        onChange={e => onChange({ ...value, strasse: e.target.value })}
      />
      <div className="grid grid-cols-[90px_1fr] gap-2">
        <Input
          placeholder="PLZ"
          inputMode="numeric"
          maxLength={5}
          value={value.plz}
          onChange={e => onChange({ ...value, plz: e.target.value.replace(/\D/g, '') })}
        />
        <Input
          placeholder="Ort"
          value={value.ort}
          onChange={e => onChange({ ...value, ort: e.target.value })}
        />
      </div>
    </div>
  )
}
