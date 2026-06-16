import type { BerechnetePosition } from './types'

interface CheckErgebnis {
  fehlende: string[]
  positionen: BerechnetePosition[]
}

function hat(positionen: BerechnetePosition[], ...begriffe: string[]): boolean {
  return positionen.some(p => begriffe.some(b => p.beschreibung.toLowerCase().includes(b)))
}

export function pruefeUndErgaenzeVollstaendigkeit(
  gewerk: string,
  positionen: BerechnetePosition[],
  transkript: string
): CheckErgebnis {
  const lower = transkript.toLowerCase()
  const fehlende: string[] = []
  const ergaenzt: BerechnetePosition[] = [...positionen]

  function add(beschreibung: string, einheit: string, menge = 1) {
    if (!hat(ergaenzt, beschreibung.toLowerCase().split(' ')[0])) {
      fehlende.push(beschreibung)
      ergaenzt.push({
        beschreibung,
        menge,
        einheit,
        konfidenz: 'low',
        berechnungsweg: 'Vollständigkeits-Check (automatisch ergänzt)',
        annahmen: ['Automatisch ergänzt — Menge bitte prüfen'],
      })
    }
  }

  if (gewerk === 'maler') {
    const hatStreichen = lower.includes('streichen') || lower.includes('anstrich') || lower.includes('anstreichen')
    if (hatStreichen) {
      if (!hat(ergaenzt, 'wand', 'wandfläche')) add('Wandflächen streichen', 'm²', 0)
      if (!hat(ergaenzt, 'decke', 'deckenfläche')) add('Deckenfläche streichen', 'm²', 0)
      if (!hat(ergaenzt, 'boden schütz', 'abdeck', 'abdecken')) add('Boden schützen / Abdecken', 'm²', 0)
      if (!hat(ergaenzt, 'sockel', 'abkleben')) add('Sockelleisten abkleben', 'lfdm', 0)
    }
    const hatTapez = lower.includes('tapez')
    if (hatTapez) {
      if (!hat(ergaenzt, 'tapete entfern', 'tapete abnehm')) add('Tapete entfernen', 'm²', 0)
      if (!hat(ergaenzt, 'untergrund', 'vorbereiten', 'glätten')) add('Untergrund vorbereiten', 'm²', 0)
      if (!hat(ergaenzt, 'tapete aufzieh', 'tapezieren')) add('Tapete aufziehen', 'm²', 0)
    }
  }

  if (gewerk === 'fliesen') {
    const hatNass = lower.includes('bad') || lower.includes('dusche') || lower.includes('nassbereich') || lower.includes('wc')
    if (hatNass) {
      if (!hat(ergaenzt, 'abdicht')) add('Verbundabdichtung', 'm²', 0)
      if (!hat(ergaenzt, 'verfug')) add('Verfugung', 'm²', 0)
    }
    if (lower.includes('bodengleich')) {
      if (!hat(ergaenzt, 'bodengleich')) add('Bodengleiche Dusche einbauen', 'Stk', 1)
    }
  }

  if (gewerk === 'sanitaer_heizung') {
    const hatTausch = lower.includes('tausch') || lower.includes('wechsel') || lower.includes('erneuern')
    if (hatTausch && !hat(ergaenzt, 'demon', 'ausbauen', 'entfernen')) {
      add('Demontage Altanlage', 'Stk', 1)
    }
    const hatObjekte = lower.includes('wc') || lower.includes('waschtisch') || lower.includes('dusche') || lower.includes('wanne')
    if (hatObjekte && !hat(ergaenzt, 'silikon')) {
      add('Silikon Anschlussfugen', 'Stk', 1)
    }
  }

  if (gewerk === 'trockenbau') {
    const hatWand = lower.includes('wand') || lower.includes('ständer') || lower.includes('rigips') || lower.includes('gk')
    if (hatWand) {
      if (!hat(ergaenzt, 'spachtel')) add('Spachtelarbeiten Q2', 'm²', 0)
      if (!hat(ergaenzt, 'ständer')) add('Ständerwerk', 'm²', 0)
    }
  }

  return { fehlende, positionen: ergaenzt }
}
