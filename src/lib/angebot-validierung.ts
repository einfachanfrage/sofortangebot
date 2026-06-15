export interface ValidationFehler {
  typ: string
  nachricht: string
  position?: string
}

export interface ValidationResult {
  valide: boolean
  fehler: ValidationFehler[]
  warnungen: string[]
}

interface ValidierbarPosition {
  title?: string
  bezeichnung?: string
  beschreibung?: string
  menge?: number
  quantity?: number
  einheit?: string
  unit?: string
  unit_price?: number
  einzelpreis?: number
  ist_pauschale?: boolean
}

export function validiereAngebot(positionen: ValidierbarPosition[]): ValidationResult {
  const fehler: ValidationFehler[] = []
  const warnungen: string[] = []

  for (const pos of positionen) {
    const name = pos.title ?? pos.bezeichnung ?? pos.beschreibung ?? 'Position'
    const menge = pos.menge ?? pos.quantity ?? 0
    const einheit = pos.einheit ?? pos.unit ?? ''
    const preis = pos.unit_price ?? pos.einzelpreis ?? 0

    if (!menge || menge <= 0) {
      fehler.push({ typ: 'menge_null', nachricht: `"${name}": Menge ist 0 — bitte prüfen`, position: name })
    }

    if (einheit === 'm²' && menge > 1000) {
      warnungen.push(`"${name}": ${menge} m² — sehr groß, bitte prüfen`)
    }

    if (einheit === 'Stk' && menge > 100) {
      warnungen.push(`"${name}": ${menge} Stück — sehr viel, bitte prüfen`)
    }

    if (preis === 0 && !pos.ist_pauschale) {
      warnungen.push(`"${name}": Preis fehlt`)
    }
  }

  // Wandfläche < Bodenfläche = klassischer Berechnungsfehler
  const wandPos = positionen.find(p => {
    const n = (p.title ?? p.bezeichnung ?? '').toLowerCase()
    const e = p.einheit ?? p.unit ?? ''
    return (n.includes('wand') || n.includes('streichen')) && e === 'm²'
  })
  const bodenPos = positionen.find(p => {
    const n = (p.title ?? p.bezeichnung ?? '').toLowerCase()
    const e = p.einheit ?? p.unit ?? ''
    return (n.includes('boden') || n.includes('decke') || n.includes('fläche')) && e === 'm²'
  })
  if (wandPos && bodenPos) {
    const wMenge = wandPos.menge ?? wandPos.quantity ?? 0
    const bMenge = bodenPos.menge ?? bodenPos.quantity ?? 0
    if (wMenge > 0 && bMenge > 0 && wMenge < bMenge) {
      fehler.push({
        typ: 'wandflaeche_kleiner_boden',
        nachricht: 'Wandfläche kleiner als Bodenfläche — Raumhöhe prüfen!',
      })
    }
  }

  return { valide: fehler.length === 0, fehler, warnungen }
}
