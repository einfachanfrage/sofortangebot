import type { BerechnetePosition } from '../mengen/types'
import { hat, add, anzahlAus, findeRaumImSatz, raumNamenAus } from './helpers'
import type { AuftragsVerstaendnis } from '../auftrags-verstaendnis'

// Türen lackieren: Schleifen, Grundieren, 2× Lackieren, Zargen
export function pruefeTuerenLackieren(
  ergaenzt: BerechnetePosition[],
  lower: string,
  v: AuftragsVerstaendnis,
  meta?: { tuerenAnzahl?: number },
): void {
  // Raumbezug aus dem Satz ("im Wohnzimmer die Türen lackieren") → Suffix,
  // damit die Position im Raum landet und nicht unter Allgemein
  const raum = findeRaumImSatz(/tür/i, lower, raumNamenAus(ergaenzt))
  const sfx = raum ? ` — ${raum}` : ''
  const hatTuerenLackieren = /tür|türe|türen/i.test(lower) &&
    (v.hatArbeit('lackieren') || lower.includes('neu streich'))
  if (!hatTuerenLackieren || hat(ergaenzt, 'türen abschleifen', 'tür abschleifen')) return

  const anzTuerenExplizit = anzahlAus(lower, 'tür', anzahlAus(lower, 'türen', 0))
  const anzZimmerFuerTuer = anzahlAus(lower, 'zimmer', anzahlAus(lower, 'raum', anzahlAus(lower, 'räume', 0)))
  const anzTueren = meta?.tuerenAnzahl ?? (anzTuerenExplizit > 0 ? anzTuerenExplizit : anzZimmerFuerTuer > 0 ? anzZimmerFuerTuer : 1)
  const tuerAnnahme = anzTuerenExplizit === 0 && anzZimmerFuerTuer > 0 ? [`${anzZimmerFuerTuer} Zimmer → je 1 Tür angenommen`] : []

  ergaenzt.push({ beschreibung: `Türen abschleifen${sfx}`, menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en) aus Transkript`, annahmen: tuerAnnahme })
  ergaenzt.push({ beschreibung: `Türen grundieren${sfx}`, menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en)`, annahmen: tuerAnnahme })
  ergaenzt.push({ beschreibung: `Türen lackieren (2× Anstrich)${sfx}`, menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en)`, annahmen: tuerAnnahme })
  ergaenzt.push({ beschreibung: `Türzargen lackieren${sfx}`, menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Zarge(n)`, annahmen: tuerAnnahme })
  if (!hat(ergaenzt, 'sockelleisten abkl', 'sockel abkl')) {
    ergaenzt.push({ beschreibung: `Sockelleisten abkleben${sfx}`, menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en) → je 1 Sockelleistenbereich`, annahmen: tuerAnnahme })
  }
}

// Fenster lackieren: Schleifen, Grundieren, 2× Anstrich
export function pruefeFensterLackieren(
  ergaenzt: BerechnetePosition[],
  lower: string,
  v: AuftragsVerstaendnis,
  meta?: { fensterAnzahl?: number },
): void {
  const hatFensterLackieren = lower.includes('fenster') &&
    (v.hatArbeit('lackieren') || lower.includes('holzfenster') ||
     /fenster\s+(?:streich|anstrich)/i.test(lower) ||
     (lower.includes('außen') && v.hatArbeit('streichen') && lower.includes('fenster'))) &&
    !lower.includes('fenster ab')
  if (!hatFensterLackieren || hat(ergaenzt, 'fenster abschleifen')) return

  const raum = findeRaumImSatz(/fenster/i, lower, raumNamenAus(ergaenzt))
  const sfx = raum ? ` — ${raum}` : ''
  const anzFenster = (meta?.fensterAnzahl ?? 0) > 1 ? meta!.fensterAnzahl! : anzahlAus(lower, 'fenster')
  const istOelfarbe = lower.includes('ölfarbe') || lower.includes('oelfarbe') || lower.includes('öl')
  const farbTyp = istOelfarbe ? 'Ölfarbe' : 'Lack'
  const istAußen = lower.includes('außen') || lower.includes('holzfenster')
  const istZweiSeitig = lower.includes('2-seitig') || lower.includes('2 seitig') || lower.includes('2seitig') ||
    lower.includes('zweiseitig') || lower.includes('beidseitig') || lower.includes('beide seiten') ||
    lower.includes('innen und außen') || lower.includes('innen und aussen')
  const anzAnstrich = istZweiSeitig ? anzFenster * 2 : anzFenster
  const zweiSeitigHinweis = istZweiSeitig ? ' (2-seitig)' : ''

  ergaenzt.push({ beschreibung: `Fenster abschleifen${sfx}`, menge: anzFenster, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzFenster} Fenster aus Transkript`, annahmen: [] })
  ergaenzt.push({ beschreibung: `Fenster grundieren${sfx}`, menge: anzFenster, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzFenster} Fenster`, annahmen: [] })
  ergaenzt.push({ beschreibung: `Fenster ${farbTyp} (2× Anstrich${zweiSeitigHinweis})${sfx}`, menge: anzAnstrich, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzFenster} Fenster${istZweiSeitig ? ' × 2 Seiten' : ''}`, annahmen: [] })
  if (istAußen && !hat(ergaenzt, 'abdecken umgebung', 'umgebung abdecken')) {
    ergaenzt.push({ beschreibung: 'Abdecken Umgebung', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Außenarbeiten — Umgebung abdecken', annahmen: [] })
  }
}

// Heizkörper lackieren: Schleifen, Grundieren, 2× Anstrich
export function pruefeHeizkLackieren(
  ergaenzt: BerechnetePosition[],
  lower: string,
  v: AuftragsVerstaendnis,
): boolean {
  const hatHeizkLackieren = /heizkörper|heizkoerper|heizung/i.test(lower) &&
    (v.hatArbeit('lackieren') || lower.includes('neu streich'))
  if (!hatHeizkLackieren || hat(ergaenzt, 'heizkörper abschleifen', 'heizkoerper abschleifen')) return false

  const raum = findeRaumImSatz(/heizkörper|heizkoerper|heizung/i, lower, raumNamenAus(ergaenzt))
  const sfx = raum ? ` — ${raum}` : ''
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

  ergaenzt.push({ beschreibung: `Heizkörper abschleifen${sfx}`, menge: anzHzk, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzHzk} Heizkörper aus Transkript`, annahmen: hzkAnnahme })
  ergaenzt.push({ beschreibung: `Heizkörper grundieren${sfx}`, menge: anzHzk, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzHzk} Heizkörper`, annahmen: hzkAnnahme })
  ergaenzt.push({ beschreibung: `Heizkörper lackieren (2× Anstrich)${sfx}`, menge: anzHzk, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzHzk} Heizkörper`, annahmen: hzkAnnahme })

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
