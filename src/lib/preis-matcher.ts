export interface PreisPosition {
  id: string
  title: string
  category: string
  unit: string
  unit_price: number
}

export interface Zuordnung {
  position: PreisPosition
  score: number
}

const STOPP = new Set([
  'und', 'oder', 'mit', 'inkl', 'inklusive', 'auf', 'in', 'an', 'der', 'die', 'das',
  'ein', 'eine', 'pro', 'nach', 'vor', 'aus', 'bis', 'fur', 'je', 'gesamtflache',
  'q1', 'q2', 'q3', 'q4',
])

const SYNONYME: Array<[RegExp, string]> = [
  [/wandflachen?/g, 'wand'], [/deckenflachen?/g, 'decke'], [/bodenflachen?/g, 'boden'],
  [/schutzen|abdecken|abdeckvlies/g, 'abdecken'], [/aufziehen|tapezieren|kleben/g, 'tapezieren'],
  [/ablosen|entfernung|demontieren|aufnehmen/g, 'entfernen'],
  [/sockelleisten|fussleisten/g, 'sockelleiste'], [/laufende?n? meter|lfdm|lfm/g, 'lfdm'],
  [/stuck|stk/g, 'stuck'], [/pauschal(e)?/g, 'pauschale'],
  [/fertigparkett/g, 'parkett'], [/klickvinyl|vinylboden|vinyl boden|designbelag|designboden/g, 'vinyl'],
  [/nadelvlies|textilbelag/g, 'teppich'], [/feuchtigkeitssperre/g, 'epoxidharz sperre'],
  [/lvt|spc|dryback|dry back|luxury vinyl/g, 'vinyl'],
  [/kautschukboden|kautschukbelag|gummiboden/g, 'gummibelag'],
  [/cushion vinyl|cv belag|pvc boden|pvc belag/g, 'pvc'],
  [/landhausdielen?|massivholzdielen?|holzdielen?/g, 'diele'],
  [/gripper|gripleiste|nagelleisten?/g, 'nagelleiste'],
  [/berliner leisten?|hamburger leisten?|fussleisten?/g, 'sockelleiste'],
  [/ausgleichsmasse|nivellieren|spachtelmasse/g, 'ausgleich'],
  [/voranstrich|grundierung/g, 'grundieren'],
  [/spachtelarbeiten?/g, 'spachteln'],
  [/glatten|glaetten/g, 'spachteln'],
  [/malervlies|renoviervlies|glattvlies/g, 'renoviervlies'],
  [/rauhfaser|raufasertapete/g, 'raufaser'],
  [/fototapete|digitaldrucktapete|motivtapete/g, 'fototapete'],
  [/grastapete|naturtapete|naturwerkstofftapete/g, 'naturwerkstofftapete'],
  [/lackieren|lackierung|lackanstrich/g, 'lackieren'],
  [/wande?|flache/g, 'flaeche'],
  [/zweifach|2fach|2x/g, '2x'], [/einfach|1fach|1x/g, '1x'],
]

export function normalisierePreistext(text: string): string {
  let wert = text
    .split(/\s+[—–-]\s+/)[0]
    .toLocaleLowerCase('de-DE')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss')
    .replace(/\binkl\.?\s+\d+(?:[.,]\d+)?\s*%\s*verschnitt\b/g, '')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')

  for (const [muster, ersatz] of SYNONYME) wert = wert.replace(muster, ersatz)
  return wert.split(/\s+/).filter(w => w && !STOPP.has(w)).join(' ').trim()
}

function normalisiereEinheit(einheit: string): string {
  const e = einheit.toLocaleLowerCase('de-DE').replace(/²/g, '2').replace(/\s/g, '')
  if (['m2', 'qm'].includes(e)) return 'm2'
  if (['lfdm', 'lfm', 'm'].includes(e)) return 'lfdm'
  if (['stk', 'stück', 'stuck'].includes(e)) return 'stuck'
  if (['pauschal', 'pauschale'].includes(e)) return 'pauschale'
  if (['std', 'stunde', 'stunden'].includes(e)) return 'stunde'
  return e
}

function tokenScore(a: string, b: string): number {
  if (a === b) return 1
  if (a.includes(b) || b.includes(a)) return 0.94
  const aa = new Set(a.split(' '))
  const bb = new Set(b.split(' '))
  const schnitt = [...aa].filter(t => bb.has(t)).length
  if (schnitt === 0) return 0
  const precision = schnitt / bb.size
  const recall = schnitt / aa.size
  return (2 * precision * recall) / (precision + recall)
}

export function findePreisposition(
  beschreibung: string,
  einheit: string,
  preise: PreisPosition[],
): Zuordnung | null {
  const gesucht = normalisierePreistext(beschreibung)
  const einheitNorm = normalisiereEinheit(einheit)
  const gesuchtAnstriche = gesucht.match(/\b([123])x\b/)?.[1]
  const hatPassendeAnstrichVariante = !!gesuchtAnstriche && preise.some(position => {
    if (normalisiereEinheit(position.unit) !== einheitNorm) return false
    return normalisierePreistext(position.title).match(/\b([123])x\b/)?.[1] === gesuchtAnstriche
  })
  let beste: Zuordnung | null = null

  for (const position of preise) {
    if (normalisiereEinheit(position.unit) !== einheitNorm) continue
    const kandidat = normalisierePreistext(position.title)
    // Ein expliziter 1x/2x/3x-Auftrag darf niemals auf eine andere Anzahl
    // Anstriche gematcht werden, auch wenn der restliche Titel ähnlich ist.
    const kandidatAnstriche = kandidat.match(/\b([123])x\b/)?.[1]
    if (gesuchtAnstriche && kandidatAnstriche && gesuchtAnstriche !== kandidatAnstriche) continue
    // Existiert eine passende explizite Preisvariante, darf ein generischer
    // Eintrag ohne Anstrichzahl sie nicht durch einen zufällig höheren
    // Text-Score verdrängen.
    if (hatPassendeAnstrichVariante && !kandidatAnstriche) continue
    const score = tokenScore(gesucht, kandidat)
    if (!beste || score > beste.score) beste = { position, score }
  }

  return beste && beste.score >= 0.62 ? beste : null
}
