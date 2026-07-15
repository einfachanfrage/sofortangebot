import type { BerechnetePosition } from '../mengen/types'
import { hat, add, anzahlAus } from './helpers'
import type { AuftragsVerstaendnis } from '../auftrags-verstaendnis'

export function pruefeBodenAbdecken(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatBodenAbdecken = lower.includes('boden abdecken') || lower.includes('böden abdecken')
    || lower.includes('abdecken') || lower.includes('abdeckfolie') || lower.includes('boden schütz')
  if (!hatBodenAbdecken || hat(ergaenzt, 'boden schütz', 'boden abdecken', 'abdeckfolie')) return

  const anzZimmerBoden = anzahlAus(lower, 'zimmer', anzahlAus(lower, 'raum', anzahlAus(lower, 'räume', 1)))
  const alleFlaechen = ergaenzt.filter(p => p.einheit === 'm²' && p.menge > 0
    && (p.beschreibung.toLowerCase().includes('boden') || p.beschreibung.toLowerCase().includes('decke') || p.beschreibung.toLowerCase().includes('wand')))
  const gesamtFlaeche = alleFlaechen.length > 0 ? alleFlaechen.reduce((s, p) => s + p.menge, 0) / alleFlaechen.length * anzZimmerBoden : null
  const spanneMatch = lower.match(/(\d+)\s*[-–bis]+\s*(\d+)\s*(?:m²|qm|quadratmeter)/i)
  const einzelMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
  const flaechemittelwert = spanneMatch
    ? (parseInt(spanneMatch[1]) + parseInt(spanneMatch[2])) / 2 * anzZimmerBoden
    : einzelMatch ? parseFloat(einzelMatch[1].replace(',', '.')) * anzZimmerBoden : gesamtFlaeche

  if (flaechemittelwert !== null && flaechemittelwert > 0) {
    ergaenzt.push({ beschreibung: 'Boden schützen / Abdeckfolie', menge: Math.round(flaechemittelwert), einheit: 'm²', konfidenz: 'medium', berechnungsweg: spanneMatch ? `(${spanneMatch[1]}+${spanneMatch[2]})/2 × ${anzZimmerBoden} Zimmer` : `${flaechemittelwert} m²`, annahmen: [] })
  } else {
    ergaenzt.push({ beschreibung: 'Boden schützen / Abdeckfolie', menge: anzZimmerBoden, einheit: 'Pauschale', konfidenz: 'medium', berechnungsweg: `${anzZimmerBoden} Zimmer`, annahmen: ['Bodenfläche nicht berechnet — Pauschale pro Zimmer'] })
  }
}

export function pruefeFliesenspiegel(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatFliesenspiegel = lower.includes('fliesenspiegel') || lower.includes('kachelspiegel')
    || (lower.includes('fliesen') && lower.includes('abkl') && lower.includes('küche'))
  if (!hatFliesenspiegel || hat(ergaenzt, 'fliesenspiegel')) return

  const lfdmMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:lfdm|lfm|laufmeter|laufende)/i)
  const flm = lfdmMatch ? parseFloat(lfdmMatch[1].replace(',', '.')) : null
  if (flm !== null && flm > 0) {
    ergaenzt.push({ beschreibung: 'Fliesenspiegel abkleben', menge: flm, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `${flm} lfdm aus Transkript`, annahmen: [] })
  } else {
    // Keine Meter genannt → als Pauschale, damit die angefragte Position nicht verschwindet
    ergaenzt.push({ beschreibung: 'Fliesenspiegel abkleben', menge: 1, einheit: 'Pauschale', konfidenz: 'medium', berechnungsweg: 'Fliesenspiegel abkleben (Meter vor Ort prüfen)', annahmen: ['Laufmeter nicht genannt'] })
  }
}

export function pruefeLampenAbkleben(ergaenzt: BerechnetePosition[], lower: string, v: AuftragsVerstaendnis): void {
  const hatStreichen = v.hatArbeit('streichen')
  const hatLampenAbkleben = lower.includes('lamp') || lower.includes('leuchte') || lower.includes('deckenleuchte')
    || lower.includes('pendelleuchte') || lower.includes('einbauspot') || lower.includes('spot')
  if (!hatLampenAbkleben || !hatStreichen || hat(ergaenzt, 'lampen abkl', 'leuchten abkl', 'spots abkl', 'pendelleuchte')) return

  const anzPendel = anzahlAus(lower, 'pendelleuchte', 0)
  const anzSpots = anzahlAus(lower, 'einbauspot', anzahlAus(lower, 'spot', 0))
  const anzLampen = anzahlAus(lower, 'lamp', anzahlAus(lower, 'leuchte', 0))
  if (anzPendel > 0) ergaenzt.push({ beschreibung: 'Pendelleuchten abkleben', menge: anzPendel, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzPendel} Pendelleuchten aus Transkript`, annahmen: [] })
  if (anzSpots > 0) ergaenzt.push({ beschreibung: 'Einbauspots abkleben', menge: anzSpots, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzSpots} Spots aus Transkript`, annahmen: [] })
  if (anzLampen > 0 && anzPendel === 0 && anzSpots === 0) ergaenzt.push({ beschreibung: 'Lampen / Leuchten abkleben', menge: anzLampen, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzLampen} Leuchte(n) aus Transkript`, annahmen: [] })
}

export function pruefeHeizkAbkleben(ergaenzt: BerechnetePosition[], lower: string, v: AuftragsVerstaendnis, hatHeizkLackierenFlag: boolean): void {
  const hatStreichen = v.hatArbeit('streichen')
  const hatHeizkAbkleben = hatStreichen && (lower.includes('heizkörper') || lower.includes('heizkoerper')) && !hatHeizkLackierenFlag
  if (!hatHeizkAbkleben || hat(ergaenzt, 'heizkörper abkl', 'heizkörper abschleifen')) return

  const anzHzkAbkl = anzahlAus(lower, 'heizkörper', anzahlAus(lower, 'heizkoerper', 1))
  ergaenzt.push({ beschreibung: 'Heizkörper abkleben', menge: anzHzkAbkl, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzHzkAbkl} Heizkörper aus Transkript`, annahmen: [] })
}

export function pruefeTreppenhausGelaender(ergaenzt: BerechnetePosition[], lower: string, v: AuftragsVerstaendnis): void {
  const hatTreppenhaus = lower.includes('treppenhaus') || lower.includes('treppe') || lower.includes('treppenaufgang')
  const hatStreichen = v.hatArbeit('streichen')
  if (hatTreppenhaus && hatStreichen && !hat(ergaenzt, 'geländer abkl', 'geländer abdecken')) {
    ergaenzt.push({ beschreibung: 'Geländer abkleben', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Treppenhaus — Geländer immer abkleben', annahmen: [] })
  }
}
