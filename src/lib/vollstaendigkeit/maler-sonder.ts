import type { BerechnetePosition } from '../mengen/types'
import { hat, add, filtereArray } from './helpers'

// Schimmel → Schimmelbehandlung + Sperranstrich (additiv)
export function pruefeSchimmel(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): boolean {
  const hatSchimmel = lower.includes('schimmel') || lower.includes('schimmelbehandl')
  if (!hatSchimmel || hat(ergaenzt, 'schimmelbehandlung', 'schimmel behandl')) return hatSchimmel

  const schimmelMatch = lower.match(/schimmel[^.!?]*?(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
    ?? lower.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)[^.!?]*?schimmel/i)
  const schimmelM2 = schimmelMatch ? parseFloat(schimmelMatch[1].replace(',', '.')) : null
  if (schimmelM2 && schimmelM2 > 0) {
    ergaenzt.unshift({ beschreibung: 'Schimmelbehandlung', menge: schimmelM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${schimmelM2} m² aus Transkript (Schimmelbereich)`, annahmen: [] })
    ergaenzt.push({ beschreibung: 'Sperranstrich nach Schimmelbehandlung', menge: schimmelM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${schimmelM2} m² Schimmelbereich`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, 'Schimmelbehandlung')
    add(ergaenzt, fehlende, 'Sperranstrich nach Schimmelbehandlung')
  }
  return hatSchimmel
}

// Wasserflecken / Sperranstrich an Decke
export function pruefeWasserflecken(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string, hatSchimmelFlag: boolean): void {
  const hatFlecken = !hatSchimmelFlag && (lower.includes('fleck') || lower.includes('wasserfleck') || lower.includes('sperr') || lower.includes('sperranstrich'))
  if (!hatFlecken || hat(ergaenzt, 'sperranstrich', 'flecken sperr')) return

  const deckenPos = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('deckenfläch'))
  if (deckenPos) {
    const dm2 = deckenPos.menge
    filtereArray(ergaenzt, p => !p.beschreibung.toLowerCase().includes('deckenfläch'))
    ergaenzt.push({ beschreibung: 'Sperranstrich / Flecken sperren — Decke', menge: dm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Deckenfläche ${dm2} m²`, annahmen: [] })
    ergaenzt.push({ beschreibung: 'Deckenfläche grundieren', menge: dm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Deckenfläche ${dm2} m²`, annahmen: [] })
    ergaenzt.push({ beschreibung: `Deckenfläche streichen — 2× Anstrich`, menge: dm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Deckenfläche ${dm2} m²`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, 'Sperranstrich / Flecken sperren')
  }
}

// Feuchtraum: Wandposition umbenennen
export function pruefeFeuchtraum(ergaenzt: BerechnetePosition[], lower: string): void {
  const hatFeuchtraum = lower.includes('feuchtraum') || lower.includes('feuchtraumfarbe') || lower.includes('nassraum') || lower.includes('feuchtraumfar')
  if (!hatFeuchtraum) return
  for (const p of ergaenzt) {
    if (p.beschreibung.toLowerCase().includes('wandfläch') && p.beschreibung.toLowerCase().includes('streichen') && !p.beschreibung.toLowerCase().includes('feuchtraum')) {
      p.beschreibung = p.beschreibung.replace(/streichen(\s*—\s*.+)?$/i, 'streichen (Feuchtraumfarbe)')
    }
  }
}

// Abwaschbare Farbe: Wandposition umbenennen
export function pruefeAbwaschbar(ergaenzt: BerechnetePosition[], lower: string): void {
  const hatAbwaschbar = lower.includes('abwaschbar') || lower.includes('abwischbar')
  if (!hatAbwaschbar) return
  for (const p of ergaenzt) {
    if (p.beschreibung.toLowerCase().includes('wandfläch') && p.beschreibung.toLowerCase().includes('streichen') && !p.beschreibung.toLowerCase().includes('abwaschbar')) {
      p.beschreibung = p.beschreibung.replace(/streichen/, 'streichen (abwaschbare Farbe)')
    }
  }
}

// Chlorbeständige Spezialfarbe: alle Streich-Positionen umbenennen + Aufpreis
export function pruefeChlor(ergaenzt: BerechnetePosition[], lower: string): void {
  const hatChlor = lower.includes('chlorbeständig') || lower.includes('schwimmbad') || lower.includes('chlor')
  if (!hatChlor || hat(ergaenzt, 'aufpreis spezialfarbe', 'chlorbeständig')) return
  for (const p of ergaenzt) {
    if ((p.beschreibung.toLowerCase().includes('streichen') || p.beschreibung.toLowerCase().includes('anstrich'))
      && !p.beschreibung.toLowerCase().includes('chlor')) {
      p.beschreibung += ' (chlorbeständige Spezialfarbe)'
    }
  }
  ergaenzt.push({ beschreibung: 'Aufpreis Spezialfarbe chlorbeständig', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Chlorbeständige Spezialfarbe erkannt', annahmen: [] })
}

// Betonwände → Schleifen + Tiefengrund + Betonfarbe (ersetzt Wandposition)
export function pruefeBetonwand(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatBetonwand = (lower.includes('betonwand') || lower.includes('betonwände') ||
    (lower.includes('beton') && lower.includes('wand'))) &&
    !lower.includes('balkon') && !lower.includes('beton boden')
  if (!hatBetonwand || hat(ergaenzt, 'betonwand schleifen', 'betonwände schleifen', 'tiefengrund beton')) return

  const wandPosBeton = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('wandfläch'))
  if (wandPosBeton) {
    const bm2 = wandPosBeton.menge
    filtereArray(ergaenzt, p => !p.beschreibung.toLowerCase().includes('wandfläch'))
    ergaenzt.push({ beschreibung: 'Betonwände schleifen / Untergrundvorbereitung', menge: bm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${bm2} m²`, annahmen: [] })
    ergaenzt.push({ beschreibung: 'Tiefengrund Beton', menge: bm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${bm2} m²`, annahmen: [] })
    ergaenzt.push({ beschreibung: 'Betonfarbe streichen', menge: bm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${bm2} m²`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, 'Betonwände schleifen / Untergrundvorbereitung')
    add(ergaenzt, fehlende, 'Tiefengrund Beton')
    add(ergaenzt, fehlende, 'Betonfarbe streichen')
  }
}

// Kalkputz → eigene teurere Positionen statt normales Wandstreichen
export function pruefeKalkputz(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatKalkputz = lower.includes('kalkputz') || lower.includes('kalk putz') || lower.includes('kalkfarbe')
  if (!hatKalkputz || hat(ergaenzt, 'kalkputz', 'kalk auftragen')) return

  const wandPosKalk = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('wandfläch'))
  if (wandPosKalk) {
    const km2 = wandPosKalk.menge
    filtereArray(ergaenzt, p => !p.beschreibung.toLowerCase().includes('wandfläch'))
    ergaenzt.push({ beschreibung: 'Untergrundvorbereitung für Kalkputz', menge: km2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${km2} m²`, annahmen: [] })
    ergaenzt.push({ beschreibung: 'Kalkputz auftragen', menge: km2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Wandfläche ${km2} m²`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, 'Untergrundvorbereitung für Kalkputz')
    add(ergaenzt, fehlende, 'Kalkputz auftragen')
  }
}

// Dachschräge → Spachteln + Grundierung ergänzen
export function pruefeDachschraege(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatDachschraege = lower.includes('dachschräge') || lower.includes('dachschraege') || lower.includes('schräge') || lower.includes('schraege')
    || lower.includes('kniestock') || lower.includes('deckenspiegel')
  if (!hatDachschraege) return

  const dachPos = ergaenzt.find(p => {
    const d = (p.beschreibung ?? '').toLowerCase()
    return d.includes('dachschräg') || d.includes('schräg') || d.includes('kniestock') || d.includes('deckenspiegel')
  })
  const schraegenPos = ergaenzt.find(p => (p.beschreibung ?? '').toLowerCase().includes('dachschrägen streich'))
  const dsm2 = schraegenPos?.menge ?? dachPos?.menge ?? null

  // PM-007: "Dachschräge Grundierung" wurde HIER unconditional draufgesetzt,
  // sobald irgendwo "Dachschräge"/"Kniestock" fiel — ganz ohne Prüfung, ob der
  // Nutzer je "grundieren" gesagt hat. Gleicher Fehlerbau wie PM-003 (Wand-
  // Grundierung) und wie oben bei pruefeGrundierung: nur bei echtem, im
  // Rohtext genanntem Grundierungs-Wunsch, sonst nur Erinnerung.
  const explizitGrundierung = /grundier\w*|grundierung|voranstrich|primer|tiefengrund/i.test(lower)
  // PM-007-Nachtest: dieselbe Fehlerfamilie, dritte Fundstelle — "Dachschräge
  // spachteln / Untergrundvorbereitung" kam bisher ebenso unconditional dazu,
  // nur weil "Dachschräge"/"Kniestock" irgendwo fiel. Jetzt nur bei einem
  // echten Signal für Ausbesserungsbedarf.
  const explizitSpachteln = /spachtel\w*|ausbesser\w*|reparier\w*|riss\w*|löcher|loch\b|uneben\w*|beschädigt\w*|untergrundvorbereitung/i.test(lower)

  // Katalog-Deckungsaudit 2026-08-31: Hier stand die DRITTE Schreibweise
  // derselben Leistung — „Dachschräge streichen — 2× Anstrich" neben dem
  // „Dachschrägen streichen 2x" der Engine und des Katalogs. Zwei Folgen:
  // kein Katalogpreis (0,00 €), und der Teil nach dem „ — " wurde von der
  // Raum-Gruppierung als Raumname gelesen, sodass die Position unter
  // „Allgemein" statt beim Raum landete. Jetzt überall dieselbe Bezeichnung.
  if (dsm2 !== null && dsm2 > 0) {
    if (explizitSpachteln && !hat(ergaenzt, 'spachtel', 'untergrund')) ergaenzt.push({ beschreibung: 'Dachschrägen spachteln', menge: dsm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${dsm2} m² Dachschrägenfläche`, annahmen: [] })
    if (explizitGrundierung && !hat(ergaenzt, 'grundier')) ergaenzt.push({ beschreibung: 'Dachschräge Grundierung', menge: dsm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${dsm2} m²`, annahmen: [] })
    if (!hat(ergaenzt, 'dachschrägen streich', 'dachschräge streich', 'schräge streich')) ergaenzt.push({ beschreibung: 'Dachschrägen streichen 2x', menge: dsm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${dsm2} m²`, annahmen: [] })
    if (!hat(ergaenzt, 'boden schütz', 'abdecken')) ergaenzt.push({ beschreibung: 'Boden schützen / Abdeckfolie', menge: dsm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${dsm2} m²`, annahmen: ['Bodenfläche geschätzt'] })
  } else {
    if (explizitSpachteln && !hat(ergaenzt, 'spachtel')) add(ergaenzt, fehlende, 'Dachschrägen spachteln')
    if (explizitGrundierung && !hat(ergaenzt, 'grundier')) add(ergaenzt, fehlende, 'Dachschräge Grundierung')
    if (!hat(ergaenzt, 'dachschräg streich', 'schräge streich')) add(ergaenzt, fehlende, 'Dachschrägen streichen 2x')
    if (!hat(ergaenzt, 'boden schütz')) add(ergaenzt, fehlende, 'Boden schützen / Abdeckfolie')
  }
}
