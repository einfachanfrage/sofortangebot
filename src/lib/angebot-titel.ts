const GEWERK_LABELS: Record<string, string> = {
  maler:            'Maler',
  fliesen:          'Fliesen',
  trockenbau:       'Trockenbau',
  boden_parkett:    'Boden',
  sanitaer_heizung: 'Sanitär',
  elektro:          'Elektro',
  schreiner:        'Schreiner',
  garten:           'Garten',
  fassade:          'Fassade',
  rohbau:           'Rohbau',
  putz:             'Putz',
  estrich:          'Estrich',
}

// Extrahiert den Raumnamen aus einem Item-Titel der Form "Leistung — Raum"
function raumAusItemTitel(itemTitel: string): string | null {
  const sep = itemTitel.lastIndexOf(' — ')
  if (sep === -1) return null
  const raum = itemTitel.slice(sep + 3).trim()
  return raum || null
}

export interface AngebotTitelInput {
  kunde?: { name?: string | null } | null
  gewerk?: string | null
  ersterItemTitel?: string | null
  transkript?: string | null
  created_at?: string | null
}

export function generiereAngebotsTitel(a: AngebotTitelInput): string {
  // 1. Kundenname
  if (a.kunde?.name?.trim()) return a.kunde.name.trim()

  const gewerkLabel = a.gewerk ? GEWERK_LABELS[a.gewerk] : null

  // 2. Gewerk + Raum aus erstem Item-Titel
  if (a.ersterItemTitel) {
    const raum = raumAusItemTitel(a.ersterItemTitel)
    if (gewerkLabel && raum) return `${gewerkLabel} · ${raum}`
    if (gewerkLabel) return gewerkLabel
    if (raum) return raum
  }

  // 3. Nur Gewerk
  if (gewerkLabel) return gewerkLabel

  // 4. Erste 5 Wörter aus Transkript
  if (a.transkript?.trim()) {
    const worte = a.transkript.trim().split(/\s+/)
    return worte.slice(0, 5).join(' ') + (worte.length > 5 ? '…' : '')
  }

  // 5. Datum
  if (a.created_at) {
    const d = new Date(a.created_at)
    return `Angebot ${d.getDate()}.${d.getMonth() + 1}.${String(d.getFullYear()).slice(2)}`
  }

  return 'Neues Angebot'
}
