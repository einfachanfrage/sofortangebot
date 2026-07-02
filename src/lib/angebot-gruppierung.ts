const DASH = /\s+[-–—]\s+/

// Nur echte Raumbezeichnungen werden als Gruppe behandelt — alles andere (z.B. "1. Anstrich") geht in Allgemein
const RAUM_KEYWORDS = [
  'zimmer', 'küche', 'bad', 'badezimmer', 'toilette', 'wc', 'flur', 'diele',
  'keller', 'dachboden', 'garage', 'treppenhaus', 'terrasse', 'balkon',
  'fassade', 'außen', 'büro', 'werkstatt', 'eingang', 'korridor',
]

function istEchterRaum(name: string): boolean {
  const lower = name.toLowerCase()
  return RAUM_KEYWORDS.some(k => lower.includes(k))
}

const RAUM_EMOJIS: Record<string, string> = {
  wohnzimmer:    '🛋',
  schlafzimmer:  '🛏',
  kinderzimmer:  '🧸',
  küche:         '🍳',
  bad:           '🚿',
  badezimmer:    '🚿',
  toilette:      '🚽',
  flur:          '🚪',
  diele:         '🚪',
  arbeitszimmer: '💼',
  büro:          '💼',
  keller:        '📦',
  dachboden:     '🏚',
  garage:        '🚗',
  treppenhaus:   '📐',
  esszimmer:     '🍽',
  terrasse:      '🌿',
  balkon:        '🌿',
  fassade:       '🏠',
  außen:         '🏠',
}

function getRaumEmoji(raumName: string): string {
  const lower = raumName.toLowerCase()
  const key = Object.keys(RAUM_EMOJIS).find(k => lower.includes(k))
  return key ? RAUM_EMOJIS[key] : '🏠'
}

export interface GruppenItem {
  id: string
  title: string
  titleDisplay: string
  description: string | null
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  position: number
}

export interface RaumGruppe {
  raumName: string
  emoji: string
  items: GruppenItem[]
  summe: number
}

export interface GruppierungsErgebnis {
  raeume: RaumGruppe[]
  allgemein: GruppenItem[]
  hatMehrereRaeume: boolean
  gesamtsumme: number
}

export function gruppiereNachRaum<T extends {
  id: string
  title: string
  description?: string | null
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  position: number
}>(items: T[]): GruppierungsErgebnis | null {
  const raumMap = new Map<string, GruppenItem[]>()
  const allgemein: GruppenItem[] = []
  let hatRaeume = 0

  for (const item of items) {
    const m = item.title.match(DASH)
    if (m) {
      const raum = item.title.slice(m.index! + m[0].length).trim()
      const titleDisplay = item.title.slice(0, m.index).trim()
      // Nur echte Räume gruppieren — "1. Anstrich" o.ä. geht in Allgemein
      if (istEchterRaum(raum)) {
        if (!raumMap.has(raum)) raumMap.set(raum, [])
        raumMap.get(raum)!.push({
          id: item.id,
          title: item.title,
          titleDisplay,
          description: item.description ?? null,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          total_price: item.total_price,
          position: item.position,
        })
        hatRaeume++
      } else {
        // Suffix kein Raum → als Allgemein-Item ohne Suffix anzeigen
        allgemein.push({
          id: item.id,
          title: item.title,
          titleDisplay,
          description: item.description ?? null,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unit_price,
          total_price: item.total_price,
          position: item.position,
        })
      }
    } else {
      allgemein.push({
        id: item.id,
        title: item.title,
        titleDisplay: item.title,
        description: item.description ?? null,
        quantity: item.quantity,
        unit: item.unit,
        unit_price: item.unit_price,
        total_price: item.total_price,
        position: item.position,
      })
    }
  }

  // Kein einziges Item hat Raum-Marker → kein Grouping
  if (hatRaeume === 0) return null

  let raeume: RaumGruppe[] = Array.from(raumMap.entries()).map(([raumName, raumItems]) => ({
    raumName,
    emoji: getRaumEmoji(raumName),
    items: raumItems,
    summe: raumItems.reduce((s, i) => s + i.total_price, 0),
  }))

  // Allgemein-Items (ohne Raum-Marker): bei einem einzigen Raum direkt zuordnen
  let verbleibendAllgemein = allgemein
  if (raeume.length === 1 && allgemein.length > 0) {
    raeume[0].items = [...raeume[0].items, ...allgemein]
    raeume[0].summe = raeume[0].items.reduce((s, i) => s + i.total_price, 0)
    verbleibendAllgemein = []
  }

  const gesamtsumme = items.reduce((s, i) => s + i.total_price, 0)

  return {
    raeume,
    allgemein: verbleibendAllgemein,
    hatMehrereRaeume: raeume.length > 1,
    gesamtsumme,
  }
}
