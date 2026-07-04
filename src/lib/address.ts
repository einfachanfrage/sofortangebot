// Adressen werden in der DB weiterhin als ein String gespeichert
// (Format: "Straße und Hausnr.\nPLZ Ort") — hier die Helfer zum
// Aufteilen in Einzelfelder und Wieder-Zusammensetzen.

export interface AddressValue {
  strasse: string
  plz: string
  ort: string
}

export const EMPTY_ADDRESS: AddressValue = { strasse: '', plz: '', ort: '' }

/** Zerlegt einen gespeicherten Adress-String bestmöglich in Einzelfelder. */
export function parseAddress(address: string | null | undefined): AddressValue {
  const raw = (address ?? '').trim()
  if (!raw) return { ...EMPTY_ADDRESS }
  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean)
  const strasse = lines[0] ?? ''
  const rest = lines.slice(1).join(' ').trim()
  // "12345 Berlin" → plz + ort
  const m = rest.match(/^(\d{4,5})\s+(.*)$/)
  if (m) return { strasse, plz: m[1], ort: m[2].trim() }
  // Kein Zweitzeilen-Format erkennbar: alles in Straße, Rest in Ort
  return { strasse, plz: '', ort: rest }
}

/** Setzt Einzelfelder wieder zum gespeicherten Adress-String zusammen. */
export function composeAddress(v: AddressValue): string {
  const line2 = [v.plz.trim(), v.ort.trim()].filter(Boolean).join(' ')
  return [v.strasse.trim(), line2].filter(Boolean).join('\n')
}
