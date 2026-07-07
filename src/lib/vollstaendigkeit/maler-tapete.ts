import type { BerechnetePosition } from '../mengen/types'
import { hat, add, filtereArray } from './helpers'
import { erkenneArbeiten } from '../arbeiten-normalisierer'

// Sockelleisten lackieren: Schleifen + 2× Lackieren
export function pruefeSockelleistenLackieren(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatSockelLackieren = lower.includes('sockelleist') && (lower.includes('lackier') || lower.includes('lack'))
  if (!hatSockelLackieren || hat(ergaenzt, 'sockelleisten lackieren', 'sockelleisten abschleifen')) return

  const lfdmMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:lfm|lfdm|laufende?r?\s*meter|meter\s*umfang|meter)/i)
  const lfdm = lfdmMatch ? parseFloat(lfdmMatch[1].replace(',', '.')) : null
  if (lfdm !== null && lfdm > 0) {
    filtereArray(ergaenzt, p => !p.beschreibung.toLowerCase().includes('sockelleisten abkl'))
    ergaenzt.push({ beschreibung: 'Sockelleisten abschleifen', menge: lfdm, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `${lfdm} lfm aus Transkript`, annahmen: [] })
    ergaenzt.push({ beschreibung: 'Sockelleisten lackieren (2× Anstrich)', menge: lfdm, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `${lfdm} lfm`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, 'Sockelleisten abschleifen')
    add(ergaenzt, fehlende, 'Sockelleisten lackieren (2× Anstrich)')
  }
}

// Sockelleisten streichen: nur wenn explizit "Sockelleisten streichen" ohne Lackkontext
export function pruefeSockelleistenStreichen(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatSockelAufnehmen = lower.includes('sockelleist') &&
    (lower.includes('aufnehm') || lower.includes('mit aufnehm') || lower.includes('montier') || lower.includes('aufbring'))
  const hatSockelStreichenExplizit = lower.includes('sockelleist') && lower.includes('streich') &&
    !lower.includes('lackier') && !lower.includes('lack ') && !hatSockelAufnehmen
  if (!hatSockelStreichenExplizit || hat(ergaenzt, 'sockelleisten schleifen', 'sockelleisten streich')) return

  const lfdmMatchStr = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:lfm|lfdm|laufende?r?\s*meter|meter)/i)
  const lfdmStr = lfdmMatchStr ? parseFloat(lfdmMatchStr[1].replace(',', '.')) : null
  if (lfdmStr !== null && lfdmStr > 0) {
    filtereArray(ergaenzt, p => !p.beschreibung.toLowerCase().includes('sockelleisten abkl'))
    if (lower.includes('schleifen') || lower.includes('schleif')) {
      ergaenzt.push({ beschreibung: 'Sockelleisten schleifen', menge: lfdmStr, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `${lfdmStr} lfm aus Transkript`, annahmen: [] })
    }
    ergaenzt.push({ beschreibung: 'Sockelleisten streichen', menge: lfdmStr, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `${lfdmStr} lfm`, annahmen: [] })
  } else {
    if (lower.includes('schleifen') || lower.includes('schleif')) add(ergaenzt, fehlende, 'Sockelleisten schleifen')
    add(ergaenzt, fehlende, 'Sockelleisten streichen')
  }
}

// Tapete entfernen + dann streichen (kein neues Tapezieren)
export function pruefeTapeteWegDannStreich(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): boolean {
  // Normalisierte Kategorien statt Wort-Fetzen: deckt "gestrichen", "abgemacht",
  // "muss runter" etc. zentral ab (siehe arbeiten-normalisierer.ts)
  const kat = erkenneArbeiten(lower)
  const hatTapeteWegDannStreich = kat.has('tapete_entfernen') && kat.has('streichen') && !kat.has('tapezieren')
  if (!hatTapeteWegDannStreich) return false

  const wandPosTapRaus = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('wandfläch'))
  const tfmRaus = wandPosTapRaus?.menge ?? null
  if (tfmRaus !== null && tfmRaus > 0) {
    if (!hat(ergaenzt, 'tapete entfern')) ergaenzt.push({ beschreibung: 'Tapete entfernen', menge: tfmRaus, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfmRaus} m²`, annahmen: [] })
    if (!hat(ergaenzt, 'spachtel', 'glätten')) ergaenzt.push({ beschreibung: 'Wände spachteln / glätten', menge: tfmRaus, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfmRaus} m²`, annahmen: [] })
  } else {
    if (!hat(ergaenzt, 'tapete entfern')) add(ergaenzt, fehlende, 'Tapete entfernen')
    if (!hat(ergaenzt, 'spachtel', 'glätten')) add(ergaenzt, fehlende, 'Wände spachteln / glätten')
  }
  return true
}

// Tapete / Raufaser aufziehen + streichen
export function pruefeTapezieren(
  ergaenzt: BerechnetePosition[],
  fehlende: string[],
  lower: string,
  transkript: string,
  positionen: BerechnetePosition[],
  hatTapeteWegFlag: boolean,
): void {
  const hatAkzentwandPos = ergaenzt.some(p => {
    const d = p.beschreibung.toLowerCase()
    return d.includes('akzentwand') || d.includes('motivtapete') || d.includes('vliestapete')
  })
  const hatTapez = !hatAkzentwandPos && !hatTapeteWegFlag && (lower.includes('tapez') || lower.includes('raufaser') || lower.includes('tapete'))
  if (!hatTapez) return

  const wandPosTapez = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('wand'))
  let tfm = wandPosTapez?.menge ?? null
  if (tfm === null) {
    const wandM2Match =
      transkript.match(/(?:wandfläche|wand(?:fläche)?|wände)[^.!?]*?(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i) ??
      transkript.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)[^.!?]*?(?:wandfläche|wand(?:fläche)?|wände)/i)
    if (wandM2Match) {
      const brutto = parseFloat(wandM2Match[1].replace(',', '.'))
      const abzugMatch = transkript.match(/(?:abzieh|minus|abzug|abzügl)[^.!?]*?(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
        ?? transkript.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)[^.!?]*?(?:abzieh|abzug)/i)
      const abzug = abzugMatch ? parseFloat(abzugMatch[1].replace(',', '.')) : 0
      tfm = Math.max(0, brutto - abzug)
    } else {
      const m2Match = transkript.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
      if (m2Match) tfm = parseFloat(m2Match[1].replace(',', '.'))
    }
  }
  if (tfm !== null) {
    const etMatch = transkript.match(/(\d+)\s*(?:etagen?|stockwerke?|etag\b)/i)
    if (etMatch) {
      const etagen = parseInt(etMatch[1])
      if (etagen > 1) tfm = tfm * etagen
    }
  }

  if (tfm !== null && tfm > 0) {
    filtereArray(ergaenzt, p => !p.beschreibung.toLowerCase().includes('wandflächen streichen'))

    const hatEntfernen = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('tapete entf') || p.beschreibung.toLowerCase().includes('tapete abneh'))
    const hatAufziehen = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('aufzieh') || p.beschreibung.toLowerCase().includes('tapezier'))
    const hatStreichen = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('raufaser streich') || p.beschreibung.toLowerCase().includes('tapete streich') || p.beschreibung.toLowerCase().includes('vliestapete streich'))

    const istRaufaser = lower.includes('raufaser')
    const istVliestapete = lower.includes('vliestapete') || lower.includes('vlies')
    const tapetenTyp = istRaufaser ? 'Raufaser' : istVliestapete ? 'Vliestapete' : 'Tapete'

    if (!hatEntfernen) ergaenzt.push({ beschreibung: 'Tapete entfernen', menge: tfm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfm} m²`, annahmen: [] })
    if (!hatAufziehen) ergaenzt.push({ beschreibung: `${tapetenTyp} aufziehen`, menge: tfm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfm} m²`, annahmen: [] })
    if (!hatStreichen) ergaenzt.push({ beschreibung: `${tapetenTyp} streichen`, menge: tfm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${tfm} m²`, annahmen: [] })

    if (!hat(ergaenzt, 'boden schütz', 'abdeck')) {
      const bodenEnginePos = positionen.find(p => p.beschreibung.toLowerCase().includes('boden'))
      if (bodenEnginePos) {
        ergaenzt.push({ beschreibung: 'Boden schützen / Abdecken', menge: bodenEnginePos.menge, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${bodenEnginePos.menge} m²`, annahmen: [] })
      } else {
        add(ergaenzt, fehlende, 'Boden schützen / Abdecken')
      }
    }
  } else {
    if (!hat(ergaenzt, 'tapete entfern', 'tapete abnehm')) add(ergaenzt, fehlende, 'Tapete entfernen')
    if (!hat(ergaenzt, 'untergrund', 'glätten')) add(ergaenzt, fehlende, 'Untergrund glätten / Spachteln')
    if (!hat(ergaenzt, 'aufzieh', 'tapezieren')) add(ergaenzt, fehlende, 'Raufaser aufziehen')
    if (!hat(ergaenzt, 'raufaser streich')) add(ergaenzt, fehlende, 'Raufaser streichen')
  }
}

// Fassade: Folgepositionen mit gleicher Fläche
export function pruefeFassade(ergaenzt: BerechnetePosition[], lower: string, transkript: string): void {
  const istFassade = lower.includes('fassade') || lower.includes('außenwand')
    || (lower.includes('außen') && lower.includes('streichen') && !lower.includes('fenster') && !lower.includes('außenfen'))
    || lower.includes('garagenfassade') || lower.includes('garage außen')
  if (!istFassade) return

  const hatRisse = lower.includes('riss') || lower.includes('schäden') || lower.includes('abgeplatzt')
    || lower.includes('moos') || lower.includes('algen')
  const wandPos = ergaenzt.find(p =>
    p.beschreibung.toLowerCase().includes('wand') ||
    p.beschreibung.toLowerCase().includes('fassade') ||
    p.beschreibung.toLowerCase().includes('streichen')
  )
  let fm = wandPos?.menge ?? null
  if (fm === null) {
    const m2Match = transkript.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
    if (m2Match) fm = parseFloat(m2Match[1].replace(',', '.'))
  }
  if (fm === null || fm <= 0) return

  const hatReinigen = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('reinigen'))
  const hatGrundierung = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('grundierung'))
  const hatFarbe = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('fassadenfarbe'))
  const hatRissfix = ergaenzt.some(p => p.beschreibung.toLowerCase().includes('rissverschluss'))
  const fassadeFarbTyp = lower.includes('silikat') ? 'Silikatfarbe' : lower.includes('dispersion') ? 'Dispersionsfarbe' : 'Fassadenfarbe'

  if (!hatReinigen) ergaenzt.push({ beschreibung: 'Fassade reinigen / Untergrundvorbereitung', menge: fm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie Fassadenanstrich (${fm} m²)`, annahmen: [] })
  if (!hatGrundierung) ergaenzt.push({ beschreibung: 'Grundierung / Tiefengrund Fassade', menge: fm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie Fassadenanstrich (${fm} m²)`, annahmen: [] })
  if (!hatFarbe) ergaenzt.push({ beschreibung: `${fassadeFarbTyp} 2× Anstrich`, menge: fm, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie Fassadenanstrich (${fm} m²)`, annahmen: [] })
  if (hatRisse && !hatRissfix) ergaenzt.push({ beschreibung: 'Rissverschluss / Spachtelarbeiten Außen', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Pauschale bei Rissen/Schäden', annahmen: [] })
}
