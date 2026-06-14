export const KATEGORIE_META: Record<string, { color: string; bg: string; gradient: string; emoji: string }> = {
  'Angebote':        { color: '#92620A', bg: '#FFFBEB', gradient: 'linear-gradient(135deg, #2C2C2C 0%, #F5C400 100%)', emoji: '📄' },
  'Preise':          { color: '#1D4ED8', bg: '#EFF6FF', gradient: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)', emoji: '💰' },
  'Recht & Steuern': { color: '#B91C1C', bg: '#FEF2F2', gradient: 'linear-gradient(135deg, #7F1D1D 0%, #EF4444 100%)', emoji: '⚖️' },
  'Gewerke':         { color: '#15803D', bg: '#F0FDF4', gradient: 'linear-gradient(135deg, #14532D 0%, #22C55E 100%)', emoji: '🔧' },
  'Tools':           { color: '#7E22CE', bg: '#FAF5FF', gradient: 'linear-gradient(135deg, #4C1D95 0%, #A855F7 100%)', emoji: '⚙️' },
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
