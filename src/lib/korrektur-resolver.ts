export interface KorrekturPaar {
  alter_wert: string | number
  neuer_wert: string | number
  typ: 'zahl' | 'text' | 'boolean'
  kontext: string
}

export function extrahiereKorrekturen(text: string): KorrekturPaar[] {
  const korrekturen: KorrekturPaar[] = []

  // "nicht X sondern Y"
  for (const match of text.matchAll(/nicht\s+(\d+[.,]?\d*|\w+)\s+sondern\s+(\d+[.,]?\d*|\w+)/gi)) {
    korrekturen.push({
      alter_wert: match[1],
      neuer_wert: match[2],
      typ: /^\d/.test(match[1]) ? 'zahl' : 'text',
      kontext: match[0],
    })
  }

  // "X, nein Y" (direkte Zahlenkorrektur)
  for (const match of text.matchAll(/(\d+[.,]?\d*)\s*(?:m²|meter|lfdm)?,?\s+nein,?\s+(\d+[.,]?\d*)/gi)) {
    korrekturen.push({
      alter_wert: parseFloat(match[1].replace(',', '.')),
      neuer_wert: parseFloat(match[2].replace(',', '.')),
      typ: 'zahl',
      kontext: match[0],
    })
  }

  // "eher/eigentlich/also X" nach einer Zahl
  for (const match of text.matchAll(/(\d+[.,]?\d*)\s+(?:eher|eigentlich|also)\s+(\d+[.,]?\d*)/gi)) {
    korrekturen.push({
      alter_wert: parseFloat(match[1].replace(',', '.')),
      neuer_wert: parseFloat(match[2].replace(',', '.')),
      typ: 'zahl',
      kontext: match[0],
    })
  }

  // "doch größer/breiter/höher/kleiner, 1,50"
  for (const match of text.matchAll(/(?:doch\s+(?:größer|breiter|höher|kleiner))[,\s]+(\d+[.,]?\d*)/gi)) {
    korrekturen.push({
      alter_wert: 'unbekannt',
      neuer_wert: parseFloat(match[1].replace(',', '.')),
      typ: 'zahl',
      kontext: match[0],
    })
  }

  return korrekturen
}

export function formatKorrekturenFuerKi(korrekturen: KorrekturPaar[]): string {
  if (korrekturen.length === 0) return ''

  return (
    '\n\nERKANNTE KORREKTUREN:\n' +
    korrekturen.map(k => `- "${k.alter_wert}" wurde korrigiert zu "${k.neuer_wert}"`).join('\n') +
    '\nVerwende immer den NEUEN Wert.\n'
  )
}
