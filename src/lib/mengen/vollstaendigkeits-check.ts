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

  // Nur als Hinweis loggen — keine menge:0 Positionen einfügen die GPT dann falsch schätzt
  function add(beschreibung: string) {
    if (!hat(ergaenzt, ...beschreibung.toLowerCase().split(' ').slice(0, 2))) {
      fehlende.push(beschreibung)
      // Keine Position ergänzen: Engine hat keine Maße → GPT soll schätzen (besser als menge:0)
    }
  }

  if (gewerk === 'maler') {
    const hatStreichen = lower.includes('streichen') || lower.includes('anstrich') || lower.includes('anstreichen')
    if (hatStreichen) {
      if (!hat(ergaenzt, 'wand', 'wandfläche')) add('Wandflächen streichen')
      if (!hat(ergaenzt, 'decke', 'deckenfläche')) add('Deckenfläche streichen')
      if (!hat(ergaenzt, 'boden schütz', 'abdeck', 'abdecken')) add('Boden schützen / Abdecken')
      if (!hat(ergaenzt, 'sockel', 'abkleben')) add('Sockelleisten abkleben')
    }
    const hatTapez = lower.includes('tapez')
    if (hatTapez) {
      if (!hat(ergaenzt, 'tapete entfern', 'tapete abnehm')) add('Tapete entfernen')
      if (!hat(ergaenzt, 'untergrund', 'vorbereiten', 'glätten')) add('Untergrund vorbereiten')
      if (!hat(ergaenzt, 'tapete aufzieh', 'tapezieren')) add('Tapete aufziehen')
    }
  }

  if (gewerk === 'fliesen') {
    const hatNass = lower.includes('bad') || lower.includes('dusche') || lower.includes('nassbereich') || lower.includes('wc')
    if (hatNass) {
      if (!hat(ergaenzt, 'abdicht')) add('Verbundabdichtung')
      if (!hat(ergaenzt, 'verfug')) add('Verfugung')
    }
    if (lower.includes('bodengleich')) {
      if (!hat(ergaenzt, 'bodengleich')) add('Bodengleiche Dusche einbauen')
    }
  }

  if (gewerk === 'sanitaer_heizung') {
    const hatTausch = lower.includes('tausch') || lower.includes('wechsel') || lower.includes('erneuern')
    if (hatTausch && !hat(ergaenzt, 'demon', 'ausbauen', 'entfernen')) {
      add('Demontage Altanlage')
    }
    const hatObjekte = lower.includes('wc') || lower.includes('waschtisch') || lower.includes('dusche') || lower.includes('wanne')
    if (hatObjekte && !hat(ergaenzt, 'silikon')) {
      add('Silikon Anschlussfugen')
    }
  }

  if (gewerk === 'trockenbau') {
    const hatWand = lower.includes('wand') || lower.includes('ständer') || lower.includes('rigips') || lower.includes('gk')
    if (hatWand) {
      if (!hat(ergaenzt, 'spachtel')) add('Spachtelarbeiten Q2')
      if (!hat(ergaenzt, 'ständer')) add('Ständerwerk')
    }
  }

  return { fehlende, positionen: ergaenzt }
}
