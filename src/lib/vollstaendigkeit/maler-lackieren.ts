import type { BerechnetePosition } from '../mengen/types'
import { hat, add, anzahlAus } from './helpers'

// Türen lackieren: Schleifen, Grundieren, 2× Lackieren, Zargen
export function pruefeTuerenLackieren(
  ergaenzt: BerechnetePosition[],
  lower: string,
  meta?: { tuerenAnzahl?: number },
): void {
  const hatTuerenLackieren = (lower.includes('tür') || lower.includes('türen')) &&
    (lower.includes('lackier') || lower.includes('lack') || lower.includes('neu streich'))
  if (!hatTuerenLackieren || hat(ergaenzt, 'türen abschleifen', 'tür abschleifen')) return

  const anzTuerenExplizit = anzahlAus(lower, 'tür', anzahlAus(lower, 'türen', 0))
  const anzZimmerFuerTuer = anzahlAus(lower, 'zimmer', anzahlAus(lower, 'raum', anzahlAus(lower, 'räume', 0)))
  const anzTueren = meta?.tuerenAnzahl ?? (anzTuerenExplizit > 0 ? anzTuerenExplizit : anzZimmerFuerTuer > 0 ? anzZimmerFuerTuer : 1)
  const tuerAnnahme = anzTuerenExplizit === 0 && anzZimmerFuerTuer > 0 ? [`${anzZimmerFuerTuer} Zimmer → je 1 Tür angenommen`] : []

  ergaenzt.push({ beschreibung: 'Türen abschleifen', menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en) aus Transkript`, annahmen: tuerAnnahme })
  ergaenzt.push({ beschreibung: 'Türen grundieren', menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en)`, annahmen: tuerAnnahme })
  ergaenzt.push({ beschreibung: 'Türen lackieren — 1. Anstrich', menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en)`, annahmen: tuerAnnahme })
  ergaenzt.push({ beschreibung: 'Türen lackieren — 2. Anstrich', menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en)`, annahmen: tuerAnnahme })
  ergaenzt.push({ beschreibung: 'Türzargen lackieren', menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Zarge(n)`, annahmen: tuerAnnahme })
  if (!hat(ergaenzt, 'sockelleisten abkl', 'sockel abkl')) {
    ergaenzt.push({ beschreibung: 'Sockelleisten abkleben', menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en) → je 1 Sockelleistenbereich`, annahmen: tuerAnnahme })
  }
}

// Fenster lackieren: Schleifen, Grundieren, 2× Anstrich
export function pruefeFensterLackieren(
  ergaenzt: BerechnetePosition[],
  lower: string,
  meta?: { fensterAnzahl?: number },
): void {
  const hatFensterLackieren = lower.includes('fenster') &&
    (lower.includes('lackier') || lower.includes('holzfenster') ||
     lower.includes('fenster streich') || lower.includes('fenster anstrich') ||
     (lower.includes('außen') && lower.includes('streich') && lower.includes('fenster'))) &&
    !lower.includes('fenster ab')
  if (!hatFensterLackieren || hat(ergaenzt, 'fenster abschleifen')) return

  const anzFenster = (meta?.fensterAnzahl ?? 0) > 1 ? meta!.fensterAnzahl! : anzahlAus(lower, 'fenster')
  const istOelfarbe = lower.includes('ölfarbe') || lower.includes('oelfarbe') || lower.includes('öl')
  const farbTyp = istOelfarbe ? 'Ölfarbe' : 'Lack'
  const istAußen = lower.includes('außen') || lower.includes('holzfenster')
  const istZweiSeitig = lower.includes('2-seitig') || lower.includes('2 seitig') || lower.includes('2seitig') ||
    lower.includes('zweiseitig') || lower.includes('beidseitig') || lower.includes('beide seiten') ||
    lower.includes('innen und außen') || lower.includes('innen und aussen')
  const anzAnstrich = istZweiSeitig ? anzFenster * 2 : anzFenster
  const zweiSeitigHinweis = istZweiSeitig ? ' (2-seitig)' : ''

  ergaenzt.push({ beschreibung: 'Fenster abschleifen', menge: anzFenster, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzFenster} Fenster aus Transkript`, annahmen: [] })
  ergaenzt.push({ beschreibung: 'Fenster grundieren', menge: anzFenster, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzFenster} Fenster`, annahmen: [] })
  ergaenzt.push({ beschreibung: `Fenster ${farbTyp} — 1. Anstrich${zweiSeitigHinweis}`, menge: anzAnstrich, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzFenster} Fenster${istZweiSeitig ? ' × 2 Seiten' : ''}`, annahmen: [] })
  ergaenzt.push({ beschreibung: `Fenster ${farbTyp} — 2. Anstrich${zweiSeitigHinweis}`, menge: anzAnstrich, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzFenster} Fenster${istZweiSeitig ? ' × 2 Seiten' : ''}`, annahmen: [] })
  if (istAußen && !hat(ergaenzt, 'abdecken umgebung', 'umgebung abdecken')) {
    ergaenzt.push({ beschreibung: 'Abdecken Umgebung', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Außenarbeiten — Umgebung abdecken', annahmen: [] })
  }
}

// Heizkörper lackieren: Schleifen, Grundieren, 2× Anstrich
export function pruefeHeizkLackieren(
  ergaenzt: BerechnetePosition[],
  lower: string,
): boolean {
  const hatHeizkLackieren = (lower.includes('heizkörper') || lower.includes('heizkoerper') || lower.includes('heizung')) &&
    (lower.includes('lackier') || lower.includes('lack') || lower.includes('neu streich'))
  if (!hatHeizkLackieren || hat(ergaenzt, 'heizkörper abschleifen', 'heizkoerper abschleifen')) return false

  const jeHzkMatch = lower.match(/je\s+(\d+)\s*(?:stück\s*)?(?:heizkörper|heizkoerper)/i)
  const anzHzkExplizit = !jeHzkMatch ? anzahlAus(lower, 'heizkörper', anzahlAus(lower, 'heizkoerper', 0)) : 0
  const anzZimmer = anzahlAus(lower, 'zimmer', anzahlAus(lower, 'raum', anzahlAus(lower, 'räume', 0)))
  const anzRaeumeAusPos = ergaenzt.filter(p => p.beschreibung.toLowerCase().includes('wandflächen streichen')).length
  const anzZimmerEff = anzZimmer > 0 ? anzZimmer : anzRaeumeAusPos > 0 ? anzRaeumeAusPos : 0
  let anzHzk: number
  if (jeHzkMatch) {
    anzHzk = parseInt(jeHzkMatch[1]) * Math.max(anzZimmerEff, 1)
  } else {
    anzHzk = anzHzkExplizit > 0 ? anzHzkExplizit : anzZimmerEff > 0 ? anzZimmerEff : 1
  }
  const hzkAnnahme = !jeHzkMatch && anzHzkExplizit === 0 && anzZimmerEff > 0 ? [`${anzZimmerEff} Zimmer → je 1 Heizkörper angenommen`] : []

  ergaenzt.push({ beschreibung: 'Heizkörper abschleifen', menge: anzHzk, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzHzk} Heizkörper aus Transkript`, annahmen: hzkAnnahme })
  ergaenzt.push({ beschreibung: 'Heizkörper grundieren', menge: anzHzk, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzHzk} Heizkörper`, annahmen: hzkAnnahme })
  ergaenzt.push({ beschreibung: 'Heizkörper lackieren — 1. Anstrich', menge: anzHzk, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzHzk} Heizkörper`, annahmen: hzkAnnahme })
  ergaenzt.push({ beschreibung: 'Heizkörper lackieren — 2. Anstrich', menge: anzHzk, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzHzk} Heizkörper`, annahmen: hzkAnnahme })

  const hatRohre = lower.includes('rohr') || lower.includes('heizungsrohr') || lower.includes('rohre')
  if (hatRohre && !hat(ergaenzt, 'rohr lackier', 'rohre lackier')) {
    const rohrM = anzahlAus(lower, 'rohr', anzahlAus(lower, 'rohre', 0))
    if (rohrM > 0) {
      ergaenzt.push({ beschreibung: 'Rohre lackieren', menge: rohrM, einheit: 'lfdm', konfidenz: 'medium', berechnungsweg: `${rohrM} lfdm aus Transkript`, annahmen: [] })
    } else {
      ergaenzt.push({ beschreibung: 'Rohre lackieren', menge: anzHzk, einheit: 'Stück', konfidenz: 'medium', berechnungsweg: `${anzHzk} Stück (1 pro Heizkörper angenommen)`, annahmen: ['Rohrlänge nicht angegeben — pauschale Stückzahl'] })
    }
  }

  return true // hatHeizkLackieren für Caller (verhindert abkleben-Block)
}
