export const ERGAENZUNGS_SIGNALE = {
  vergessen: [
    'ich vergaß',
    'ich hab vergessen',
    'fast vergessen',
    'beinahe vergessen',
    'ach ja',
    'ach so',
    'ach stimmt',
    'fällt mir noch ein',
    'fällt mir gerade ein',
    'noch was',
    'noch etwas',
    'eins noch',
    'eines noch',
    'noch kurz',
  ],
  zusatz: [
    'außerdem',
    'zusätzlich',
    'dazu noch',
    'dazu kommt',
    'und außerdem',
    'und zusätzlich',
    'plus noch',
    'obendrauf',
    'on top',
    'ebenfalls',
    'genauso',
    'auch noch',
    'noch dazu',
  ],
  praezisierung: [
    'also ich meine',
    'gemeint ist',
    'das heißt',
    'd.h.',
    'sprich',
    'konkret',
    'genauer gesagt',
    'um das zu präzisieren',
    'noch genauer',
  ],
  korrektur: [
    'nein warte',
    'warte mal',
    'stopp',
    'halt',
    'moment',
    'nicht ganz',
    'das stimmt nicht',
    'falsch',
    'ich muss korrigieren',
    'korrektur',
    'sondern',
    'eigentlich',
    'oder doch',
    'besser gesagt',
    'vielmehr',
  ],
  mengen_korrektur: [
    'nicht \\d+',
    'sondern \\d+',
    'eher \\d+',
    'ca\\. \\d+',
    'ungefähr \\d+',
  ],
}

export type ErgaenzungsTyp =
  | 'vergessen'
  | 'zusatz'
  | 'praezisierung'
  | 'korrektur'
  | 'mengen_korrektur'
  | 'unbekannt'

export interface ErkannteErgaenzung {
  typ: ErgaenzungsTyp
  signal: string
  text_vorher: string
  text_nachher: string
  position_in_text: number
}

export function erkenneErgaenzungen(transkript: string): ErkannteErgaenzung[] {
  const ergebnisse: ErkannteErgaenzung[] = []
  const lower = transkript.toLowerCase()

  for (const [typ, signale] of Object.entries(ERGAENZUNGS_SIGNALE) as [ErgaenzungsTyp, string[]][]) {
    for (const signal of signale) {
      const pattern = new RegExp(`\\b${signal}\\b`, 'gi')
      let match: RegExpExecArray | null

      while ((match = pattern.exec(lower)) !== null) {
        const pos = match.index
        ergebnisse.push({
          typ,
          signal,
          text_vorher: transkript.slice(Math.max(0, pos - 100), pos).trim(),
          text_nachher: transkript.slice(pos + match[0].length, pos + match[0].length + 200).trim(),
          position_in_text: pos,
        })
      }
    }
  }

  return ergebnisse.sort((a, b) => a.position_in_text - b.position_in_text)
}

export function bereiteFuerKiAuf(transkript: string, ergaenzungen: ErkannteErgaenzung[]): string {
  if (ergaenzungen.length === 0) return transkript

  let result = transkript

  // Von hinten nach vorne ersetzen (Positionen bleiben valide)
  const sortiert = [...ergaenzungen].sort((a, b) => b.position_in_text - a.position_in_text)

  for (const e of sortiert) {
    const escaped = e.signal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const signalPattern = new RegExp(`\\b${escaped}\\b`, 'i')
    result = result.replace(signalPattern, `\n[${e.typ.toUpperCase()}] `)
  }

  return result
}
