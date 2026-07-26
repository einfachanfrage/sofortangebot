export function getPriceTradeKey(category: string): string {
  const prefix = category.trim().split(/\s+[–—-]\s+/u, 1)[0]?.trim() ?? category.trim()
  if (/^maler(?:\s*&|\b)/i.test(prefix)) return 'Maler'
  if (/^boden(?:beläge)?(?:\s*&|\b)/i.test(prefix)) return 'Boden'
  if (/^allgemein\b/i.test(prefix)) return 'Allgemein'
  return prefix
}

export function priceItemIdentity(item: { category: string; title: string; unit: string }): string {
  return [item.category, item.title, item.unit]
    .map(value => value.trim().toLocaleLowerCase('de-DE'))
    .join('::')
}

export function inferPriceCategory(trade: string, title: string): string {
  const value = title.trim().toLocaleLowerCase('de-DE')

  if (trade === 'Boden') {
    if (/(zuschlag|aufpreis|erschwernis)/.test(value)) return 'Boden – Erschwernisse & Zuschläge'
    if (/(anfahrt|aufmaß|besichtigung)/.test(value)) return 'Boden – Anfahrt & Organisation'
    if (/(reinigen|reinigung|entsorg|bauschutt)/.test(value)) return 'Boden – Reinigung & Entsorgung'
    if (/(altbelag|entfern|demontier|aufnehmen)/.test(value)) return 'Boden – Altbelag entfernen'
    if (/(untergrund|ausgleich|spachtel|schleif|grundier|estrich|riss|fuge)/.test(value)) return 'Boden – Untergrundvorbereitung'
    if (/(feucht|dampfbremse|epoxid|sperre)/.test(value)) return 'Boden – Feuchtigkeitsschutz'
    if (/(sockel|übergang|abschluss|profil|leiste)/.test(value)) return 'Boden – Abschlussarbeiten'
    if (/(parkett|diele|holzfußboden)/.test(value)) return 'Boden – Parkett'
    if (/laminat/.test(value)) return 'Boden – Laminat'
    if (/(vinyl|lvt|designboden)/.test(value)) return 'Boden – Vinyl / LVT'
    if (/teppich/.test(value)) return 'Boden – Teppichboden'
    if (/linoleum/.test(value)) return 'Boden – Linoleum'
    if (/kork/.test(value)) return 'Boden – Kork'
    if (/(pvc|cv-belag|elastisch)/.test(value)) return 'Boden – PVC / Elastisch'
    return 'Boden – Hauptleistung'
  }

  if (trade === 'Maler') {
    if (/(zuschlag|aufpreis|erschwernis)/.test(value)) return 'Maler – Erschwernisse & Zuschläge'
    if (/(anfahrt|aufmaß|besichtigung)/.test(value)) return 'Maler – Anfahrt & Organisation'
    if (/(reinigen|reinigung|entsorg)/.test(value)) return 'Maler – Reinigung & Entsorgung'
    if (/(abdeck|abkleb|schutz|ausräumen)/.test(value)) return 'Maler – Vorbereitung & Schutz'
    if (/(tapete|tapezier|vlies|raufaser)/.test(value)) return 'Maler – Tapezieren'
    if (/(spachtel|schleif|grundier|untergrund|riss|fuge|dübel)/.test(value)) return 'Maler – Untergrundvorbereitung'
    if (/(lack|tür|fenster|heizkörper|geländer)/.test(value)) return 'Maler – Lackierarbeiten'
    if (/(fassade|außen)/.test(value)) return 'Maler – Anstrich Außen'
    if (/(schimmel|nikotin|wasserfleck|sanier)/.test(value)) return 'Maler – Schimmel & Sanierung'
    if (/(streich|anstrich|decke|wand)/.test(value)) return 'Maler – Anstrich Innen'
    return 'Maler – Hauptleistung'
  }

  return `${trade || 'Allgemein'} – Hauptleistung`
}
