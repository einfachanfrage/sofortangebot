import type { BerechnetePosition } from '../mengen/types'
import { hat, add, anzahlAus, filtereArray } from './helpers'
import { hatArbeit } from '../arbeiten-normalisierer'

export function pruefeErschwerniszuschlagHoehe(ergaenzt: BerechnetePosition[], lower: string): void {
  // Deckenhöhe nur aus expliziten Höhenangaben lesen, nicht aus Raummaßen
  const hoeheMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*m?\s*(?:hoch|deckenhöhe|raumhöhe)/i)
  const raumHoehe = hoeheMatch ? parseFloat(hoeheMatch[1].replace(',', '.')) : 0
  const hatHohesRaum = raumHoehe > 3.0
    || /[45][.,]\d*\s*m\s*(?:hoch|deckenhöhe|raumhöhe)/i.test(lower)
    || lower.includes('hohe decke') || lower.includes('hohen decken')
  if (hatHohesRaum && !hat(ergaenzt, 'erschwerniszuschlag höhe', 'höhe zuschlag', 'gerüst')) {
    ergaenzt.push({ beschreibung: 'Erschwerniszuschlag Raumhöhe > 3m', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: `Raumhöhe ${raumHoehe > 0 ? raumHoehe + 'm' : 'erkannt'} > 3m`, annahmen: [] })
  }
}

export function pruefeGraffiti(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatGraffiti = lower.includes('graffiti') || lower.includes('schmiererei') || lower.includes('vandalism')
  if (!hatGraffiti || hat(ergaenzt, 'graffiti entfern')) return

  const m2Match = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
  const gm2 = m2Match ? parseFloat(m2Match[1].replace(',', '.')) : null
  if (gm2 !== null && gm2 > 0) {
    ergaenzt.push({ beschreibung: 'Graffiti entfernen', menge: gm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${gm2} m² aus Transkript`, annahmen: [] })
    ergaenzt.push({ beschreibung: 'Grundierung Fassade nach Graffiti', menge: gm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${gm2} m²`, annahmen: [] })
    ergaenzt.push({ beschreibung: 'Fassadenfarbe 2× Anstrich', menge: gm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${gm2} m²`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, 'Graffiti entfernen')
    add(ergaenzt, fehlende, 'Grundierung Fassade nach Graffiti')
    add(ergaenzt, fehlende, 'Fassadenfarbe 2× Anstrich')
  }
}

export function pruefeAltbau(ergaenzt: BerechnetePosition[], lower: string): void {
  const hatAltbau = lower.includes('altbau') || lower.includes('altgebäude') || lower.includes('altbestand')
  if (hatAltbau && !hat(ergaenzt, 'erschwerniszuschlag altbau', 'altbau pauschale')) {
    ergaenzt.push({ beschreibung: 'Erschwerniszuschlag Altbau', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Altbau im Transkript erkannt', annahmen: [] })
  }
}

export function pruefeDenkmalschutz(ergaenzt: BerechnetePosition[], lower: string): void {
  const hatDenkmal = lower.includes('denkmal') || lower.includes('denkmalschutz') || lower.includes('denkmalgeschütz')
  if (hatDenkmal && !hat(ergaenzt, 'erschwerniszuschlag denkmal', 'denkmal pauschale')) {
    ergaenzt.push({ beschreibung: 'Erschwerniszuschlag Denkmalschutz', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Denkmalschutz im Transkript erkannt', annahmen: [] })
  }
}

export function pruefeSpachteln(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatStreichen = hatArbeit(lower, 'streichen')
  const hatSpachteln = lower.includes('spachtel') || lower.includes('q2') || lower.includes('q3') || lower.includes('q4')
  const istNurSpachteln = hatSpachteln && !hatStreichen
    && (lower.includes('spachtel') || lower.includes(' q2 ') || lower.includes(' q3 ') || lower.includes(' q4 '))
  if (!istNurSpachteln || hat(ergaenzt, 'spachteln', 'spachelarbeit')) return

  const qLevel = lower.includes('q4') ? 'Q4' : lower.includes('q3') ? 'Q3' : 'Q2'
  const wandPos = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('wand') && p.einheit === 'm²')
  const spachtelM2 = wandPos?.menge ?? null
  if (spachtelM2 !== null && spachtelM2 > 0) {
    ergaenzt.push({ beschreibung: `Wände spachteln ${qLevel}`, menge: spachtelM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${spachtelM2} m² Wandfläche`, annahmen: [] })
    ergaenzt.push({ beschreibung: `Wände schleifen nach ${qLevel}`, menge: spachtelM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${spachtelM2} m²`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, `Wände spachteln ${qLevel}`)
    add(ergaenzt, fehlende, `Wände schleifen nach ${qLevel}`)
  }
}

export function pruefeSpachtelarbeiten(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatStreichen = hatArbeit(lower, 'streichen')
  const hatSpachteln2 = lower.includes('spachtel') || lower.includes('q2') || lower.includes('q3')
  const hatSchleifenArb = /\bschleif(?:en|t)?\b/i.test(lower) && !lower.includes('abschleif')
  if ((!hatSpachteln2 && !hatSchleifenArb) || hat(ergaenzt, 'spachtelarbeiten', 'q2')) return

  const basisPositionen = ergaenzt.filter(p => {
    const d = p.beschreibung.toLowerCase()
    return (d.includes('wandfläch') || d.includes('deckenfläch')) && p.einheit === 'm²'
  })
  if (basisPositionen.length > 0) {
    for (const basisPos of basisPositionen) {
      const raumMatch = basisPos.beschreibung.match(/ — (.+)$/)
      const raumSuffix = raumMatch ? ` — ${raumMatch[1]}` : ''
      if (hatSpachteln2) ergaenzt.push({ beschreibung: `Spachtelarbeiten Q2${raumSuffix}`, menge: basisPos.menge, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie ${basisPos.beschreibung.split(' — ')[0]}`, annahmen: [] })
      if (hatSchleifenArb) ergaenzt.push({ beschreibung: `Schleifen${raumSuffix}`, menge: basisPos.menge, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Gleiche Fläche wie ${basisPos.beschreibung.split(' — ')[0]}`, annahmen: [] })
    }
  } else {
    if (hatSpachteln2) add(ergaenzt, fehlende, 'Spachtelarbeiten Q2')
    if (hatSchleifenArb) add(ergaenzt, fehlende, 'Schleifen')
  }
  void hatStreichen // unused but preserved for clarity
}

export function pruefeEstrich(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatEstrich = lower.includes('estrich') || lower.includes('epoxid') || lower.includes('versiegeln')
  if (!hatEstrich || hat(ergaenzt, 'estrich schleifen', 'epoxid')) return

  const bodenPosEstrich = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('boden'))
  const em2 = bodenPosEstrich?.menge ?? null
  if (em2 !== null && em2 > 0) {
    filtereArray(ergaenzt, p => !p.beschreibung.toLowerCase().includes('boden schütz') && !p.beschreibung.toLowerCase().includes('boden — '))
    ergaenzt.push({ beschreibung: 'Estrich schleifen / Untergrundvorbereitung', menge: em2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${em2} m²`, annahmen: [] })
    ergaenzt.push({ beschreibung: 'Epoxid / Versiegelung — Schicht 1', menge: em2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${em2} m²`, annahmen: [] })
    ergaenzt.push({ beschreibung: 'Epoxid / Versiegelung — Schicht 2', menge: em2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${em2} m²`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, 'Estrich schleifen / Untergrundvorbereitung')
    add(ergaenzt, fehlende, 'Epoxid / Versiegelung — Schicht 1')
    add(ergaenzt, fehlende, 'Epoxid / Versiegelung — Schicht 2')
  }
}

export function pruefeGaragenboden(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatGaragenboden = (lower.includes('garagenboden') || (lower.includes('garage') && lower.includes('boden')))
    && (lower.includes('beton') || lower.includes('betonfarbe') || lower.includes('grau'))
  if (!hatGaragenboden || hat(ergaenzt, 'garagenboden', 'garagenbod')) return

  const bodenPosGar = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('boden'))
  const gm2 = bodenPosGar?.menge ?? null
  if (gm2 !== null && gm2 > 0) {
    ergaenzt.unshift({ beschreibung: 'Garagenboden Betonfarbe', menge: gm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${gm2} m²`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, 'Garagenboden Betonfarbe')
  }
}

export function pruefeGeruest(ergaenzt: BerechnetePosition[], lower: string): void {
  const hatGeruest = lower.includes('gerüst') || lower.includes('geruest') || lower.includes('gerüst nötig')
  if (hatGeruest && !hat(ergaenzt, 'gerüst', 'geruest')) {
    ergaenzt.push({ beschreibung: 'Gerüst stellen und abbauen', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Gerüst im Transkript erwähnt', annahmen: [] })
  }
}

export function pruefeBewohnt(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatBewohnt = lower.includes('bewohnt') || lower.includes('möbel') || lower.includes('einrichtung') || lower.includes('bewohnte')
  if (!hatBewohnt || hat(ergaenzt, 'möbel schütz', 'möbel abdeck', 'erschwerniszuschlag bewohnt')) return

  const bodenPos = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('boden'))
  const bodenmenge = bodenPos?.menge ?? null
  if (bodenmenge !== null) {
    ergaenzt.push({ beschreibung: 'Möbel schützen / Abdecken', menge: bodenmenge, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${bodenmenge} m²`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, 'Möbel schützen / Abdecken')
  }
  ergaenzt.push({ beschreibung: 'Erschwerniszuschlag bewohnt', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Bewohnter Zustand im Transkript erkannt', annahmen: [] })
}

export function pruefeBalkon(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatBalkon = lower.includes('balkon') || lower.includes('loggia') || lower.includes('terrasse')
  if (!hatBalkon || hat(ergaenzt, 'balkonboden', 'brüstung', 'terrasse')) return

  const hatBeton = lower.includes('beton') || lower.includes('betonfarbe')
  const hatBruestung = lower.includes('brüstung') || lower.includes('bruestung') || lower.includes('geländer')
  const bodenPos = ergaenzt.find(p => p.beschreibung.toLowerCase().includes('boden'))
  const bodenM2 = bodenPos?.menge ?? null
  const beschrBoden = hatBeton ? 'Balkonboden Betonfarbe' : 'Balkonboden streichen'

  if (bodenM2 !== null) {
    ergaenzt.push({ beschreibung: beschrBoden, menge: bodenM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Bodenfläche ${bodenM2} m²`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, beschrBoden)
  }
  if (hatBruestung) {
    const lfdmBrMatch = lower.match(/brüst(?:ung)?[^.!?]*?(\d+(?:[.,]\d+)?)\s*(?:lfm|lfdm|laufende?r?\s*meter|meter)/i)
    const lfdmBr = lfdmBrMatch ? parseFloat(lfdmBrMatch[1].replace(',', '.')) : null
    const hBrMatch = lower.match(/brüst(?:ung)?[^.!?]*?(\d+(?:[.,]\d+)?)\s*m?\s*hoch/i)
      ?? lower.match(/(\d+(?:[.,]\d+)?)\s*m?\s*hoch[^.!?]*?brüst/i)
    const hBr = hBrMatch ? parseFloat(hBrMatch[1].replace(',', '.')) : 1.0
    if (lfdmBr !== null && lfdmBr > 0) {
      const brM2 = Math.round(lfdmBr * hBr * 100) / 100
      ergaenzt.push({ beschreibung: 'Brüstung innen streichen', menge: brM2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${lfdmBr} lfm × ${hBr} m = ${brM2} m²`, annahmen: [] })
    } else {
      add(ergaenzt, fehlende, 'Brüstung innen streichen')
    }
  }
  if (hatBeton && !hat(ergaenzt, 'untergrundvorbereitung beton', 'betonvorbereitung')) {
    ergaenzt.push({ beschreibung: 'Untergrundvorbereitung Beton', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Betonuntergrund im Transkript erkannt', annahmen: [] })
  }
}

export function pruefeHolzOelen(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatHolzOelen = (lower.includes('holzdecke') || (lower.includes('holz') && (lower.includes('decke') || lower.includes('dielen') || lower.includes('holzbalken'))))
    && (lower.includes('öl') || lower.includes('oel') || lower.includes('ölen'))
  if (!hatHolzOelen || hat(ergaenzt, 'holzdecke abschleifen', 'holzdecke ölen')) return

  const m2Match = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
  const hm2 = m2Match ? parseFloat(m2Match[1].replace(',', '.')) : null
  if (hm2 !== null && hm2 > 0) {
    ergaenzt.push({ beschreibung: 'Holzdecke abschleifen', menge: hm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${hm2} m² aus Transkript`, annahmen: [] })
    ergaenzt.push({ beschreibung: 'Holzdecke ölen — 2× Anstrich', menge: hm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${hm2} m²`, annahmen: [] })
    if (!hat(ergaenzt, 'boden schütz', 'abdeck')) {
      ergaenzt.push({ beschreibung: 'Boden schützen / Abdecken', menge: hm2, einheit: 'm²', konfidenz: 'high', berechnungsweg: `Schutz unter Deckenfläche ${hm2} m²`, annahmen: [] })
    }
  } else {
    add(ergaenzt, fehlende, 'Holzdecke abschleifen')
    add(ergaenzt, fehlende, 'Holzdecke ölen — 2× Anstrich')
    add(ergaenzt, fehlende, 'Boden schützen / Abdecken')
  }
}

export function pruefeBrandschutzfarbe(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatBrandschutzfarbe = lower.includes('brandschutzfarbe') || lower.includes('brandschutz f') || lower.includes('brandschutz stahl')
  if (!hatBrandschutzfarbe || hat(ergaenzt, 'brandschutzfarbe', 'rostschutz')) return

  const lfdmMatch = lower.match(/(\d+)\s*(?:stück|träger)[^.!?]*?(\d+)\s*m/i)
  const anzTraeger = lfdmMatch ? parseInt(lfdmMatch[1]) : anzahlAus(lower, 'träger', 1)
  const laengeTraeger = lfdmMatch ? parseFloat(lfdmMatch[2]) : anzahlAus(lower, 'meter', anzahlAus(lower, 'm lang', 0))
  const lfdmTraeger = anzTraeger * (laengeTraeger > 0 ? laengeTraeger : 1)
  if (lfdmTraeger > 1) {
    ergaenzt.push({ beschreibung: 'Rostschutzgrund Träger', menge: lfdmTraeger, einheit: 'lfdm', konfidenz: 'medium', berechnungsweg: `${anzTraeger} Träger × ${laengeTraeger} m`, annahmen: ['Alle Seiten mit Standardbreite'] })
    ergaenzt.push({ beschreibung: 'Brandschutzfarbe F30/F60', menge: lfdmTraeger, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `${lfdmTraeger} lfdm`, annahmen: [] })
  } else {
    add(ergaenzt, fehlende, 'Rostschutzgrund Träger')
    add(ergaenzt, fehlende, 'Brandschutzfarbe F30/F60')
  }
}

export function pruefeStuckleisten(ergaenzt: BerechnetePosition[], fehlende: string[], lower: string): void {
  const hatStuckleisten = lower.includes('stuckleiste') || lower.includes('stuckleis')
    || lower.includes('stuckprofil') || lower.includes('stuck montier')
  if (!hatStuckleisten || hat(ergaenzt, 'stuckleisten montier', 'stuckelemente montier')) return

  const flaecheMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:m²|qm|quadratmeter)/i)
  const fm2 = flaecheMatch ? parseFloat(flaecheMatch[1].replace(',', '.')) : null
  const umfangGeschaetzt = fm2 !== null ? Math.round(4 * Math.sqrt(fm2)) : null
  const umfangAusEngine = ergaenzt.find(p => p.einheit === 'lfdm' && p.beschreibung.toLowerCase().includes('sockel'))?.menge ?? null
  const stuckM = umfangAusEngine ?? umfangGeschaetzt
  if (stuckM !== null && stuckM > 0) {
    ergaenzt.push({ beschreibung: 'Stuckleisten montieren', menge: stuckM, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: fm2 ? `Umfang ≈ 4 × √${fm2} m² = ${stuckM} lfdm (voller Umfang, kein Türabzug)` : `${stuckM} lfdm`, annahmen: fm2 ? ['Quadratischer Raum angenommen'] : [] })
    if (hatArbeit(lower, 'streichen')) {
      ergaenzt.push({ beschreibung: 'Stuckleisten streichen / weißen', menge: stuckM, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: `${stuckM} lfdm`, annahmen: [] })
    }
  } else {
    add(ergaenzt, fehlende, 'Stuckleisten montieren')
    if (hatArbeit(lower, 'streichen')) add(ergaenzt, fehlende, 'Stuckleisten streichen / weißen')
  }
}

export function pruefeStuck(ergaenzt: BerechnetePosition[], lower: string): void {
  const hatStuck = lower.includes('stuck') || lower.includes('stuckdecke') || lower.includes('stuckelement') || lower.includes('stuckrosette')
  if (!hatStuck || hat(ergaenzt, 'stuck abkl', 'stuckdecke abkl', 'stuckrosette', 'stuck restau')) return

  const istRosette = lower.includes('stuckrosette') || lower.includes('rosette')
  const istRestaurieren = lower.includes('stuck restau') || lower.includes('stuckrestau') ||
    (lower.includes('stuck') && (lower.includes('restau') || lower.includes('sanieren') || lower.includes('instandsetz')))
  if (istRosette) {
    const anzRosetten = anzahlAus(lower, 'rosette', anzahlAus(lower, 'stuckrosette', 1))
    ergaenzt.push({ beschreibung: 'Stuckrosette abkleben', menge: anzRosetten, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzRosetten} Stuckrosette(n) aus Transkript`, annahmen: [] })
  } else if (istRestaurieren) {
    ergaenzt.push({ beschreibung: 'Stuck restaurieren', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Stuckrestaurierung im Transkript erkannt', annahmen: [] })
  } else {
    ergaenzt.push({ beschreibung: 'Stuckdecke / Stuckelemente abkleben', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Stuck im Transkript erkannt', annahmen: [] })
  }
}

export function pruefeTuerrahmen(ergaenzt: BerechnetePosition[], lower: string): void {
  const hatTuerrahmen = lower.includes('türrahmen') || lower.includes('tuerrahmen') || lower.includes('türrahmen streich')
  if (!hatTuerrahmen || hat(ergaenzt, 'türrahmen')) return

  const anzRahmen = anzahlAus(lower, 'türrahmen', anzahlAus(lower, 'tuerrahmen', 3))
  ergaenzt.push({ beschreibung: 'Türrahmen schleifen', menge: anzRahmen, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzRahmen} Türrahmen aus Transkript`, annahmen: [] })
  ergaenzt.push({ beschreibung: 'Türrahmen streichen', menge: anzRahmen, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzRahmen} Türrahmen`, annahmen: [] })
}
