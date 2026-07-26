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
