// Wählbare Gliederung des Angebots (Einstellung pro Betrieb).
// Gibt bewusst DIESELBE Form zurück wie gruppiereNachRaum — Entwurf-Ansicht und
// PDF können die Gruppen unverändert rendern (raumName = Gruppen-Überschrift).

import { gruppiereNachRaum, istAllgemeinPosition, type GruppierungsErgebnis, type GruppenItem } from './angebot-gruppierung'

export type AngebotStruktur = 'raeume' | 'arbeitsablauf' | 'gewerk'

export const STRUKTUR_LABEL: Record<AngebotStruktur, string> = {
  raeume: 'Nach Räumen',
  arbeitsablauf: 'Nach Arbeitsablauf',
  gewerk: 'Nach Gewerk',
}

// ── Arbeitsablauf: Vorarbeiten → Hauptarbeit → Abschluss ────────────────────
type Phase = 'vor' | 'haupt' | 'abschluss'

const PHASE_META: Record<Phase, { label: string; emoji: string }> = {
  vor: { label: 'Vorarbeiten', emoji: '🧹' },
  haupt: { label: 'Hauptarbeit', emoji: '🎨' },
  abschluss: { label: 'Abschluss', emoji: '✨' },
}

// Reihenfolge = Priorität (spezifisch vor generisch)
const PHASE_REGELN: { test: RegExp; phase: Phase }[] = [
  // Abschluss zuerst prüfen — "Sockelleisten montieren" ist kein Vorarbeit-Abkleben
  { test: /versiegel|parkettlack|sockelleisten\s*montier|stuckleisten\s*montier|übergangs?profil|anschlussprofil|endreinigung|feinreinigung/i, phase: 'abschluss' },
  // Vorarbeiten: schützen, demontieren, Untergrund herrichten
  { test: /abkleb|abdeck|schütz|demontage|entfern|aufnehm|rausreiß|kleberreste|spachtel|glätt|schleif|grundier|voranstrich|tiefengrund|ausgleich|untergrund|feuchtigkeitssperre|quarzsand|trittschall|fräsen/i, phase: 'vor' },
  // Hauptarbeit
  { test: /streich|anstrich|tapezier|aufzieh|verleg|verkleb|lackier|verschweiß|verschweiss/i, phase: 'haupt' },
]

function phaseFuer(titel: string): Phase {
  for (const r of PHASE_REGELN) if (r.test.test(titel)) return r.phase
  return 'haupt'
}

// ── Gewerk: Maler vs. Boden ────────────────────────────────────────────────
type Gewerk = 'maler' | 'boden'

const GEWERK_META: Record<Gewerk, { label: string; emoji: string }> = {
  maler: { label: 'Malerarbeiten', emoji: '🎨' },
  boden: { label: 'Bodenarbeiten', emoji: '🪵' },
}

const BODEN_RE = /verleg|altbelag|kleberreste|sockelleisten\s*montier|trittschall|versiegel|parkettlack|estrich|übergangs?profil|anschlussprofil|fischgrät|bahnenware|verschweiß|verschweiss|stoßkanten|parkett\s*schleifen|quarzsand|feuchtigkeitssperre|ausgleichsmasse/i
const MALER_RE = /streich|anstrich|tapete|tapezier|raufaser|spachtel|glätt|lackier|grundier|voranstrich|abkleb|stuck|boden\s*schütz|abdeck/i

function gewerkFuer(titel: string): Gewerk {
  if (BODEN_RE.test(titel)) return 'boden'
  if (MALER_RE.test(titel)) return 'maler'
  return 'maler'
}

/** Baut Gruppen aus items nach beliebigem Schlüssel, in fester Reihenfolge. */
function baueGruppen<K extends string>(
  items: GruppenItem[],
  keyFn: (titel: string) => K,
  meta: Record<K, { label: string; emoji: string }>,
  reihenfolge: K[],
) {
  const map = new Map<K, GruppenItem[]>()
  for (const it of items) {
    const k = keyFn(it.title)
    if (!map.has(k)) map.set(k, [])
    map.get(k)!.push(it)
  }
  return reihenfolge
    .filter(k => (map.get(k)?.length ?? 0) > 0)
    .map(k => ({
      raumName: meta[k].label,
      emoji: meta[k].emoji,
      items: map.get(k)!,
      summe: map.get(k)!.reduce((s, i) => s + i.total_price, 0),
    }))
}

/**
 * Gruppiert nach gewählter Struktur. 'raeume' delegiert an die Raum-Gruppierung.
 * Echte Allgemein-Positionen (Anfahrt, Kleinmaterial …) bleiben immer separat.
 */
export function gruppiereNachStruktur<T extends {
  id: string
  title: string
  description?: string | null
  quantity: number
  unit: string
  unit_price: number
  total_price: number
  position: number
}>(items: T[], struktur: AngebotStruktur): GruppierungsErgebnis | null {
  if (struktur === 'raeume') return gruppiereNachRaum(items)
  if (items.length === 0) return null

  const alle: GruppenItem[] = items.map(i => ({
    id: i.id,
    title: i.title,
    // Raum-Suffix als Zusatz im Titel behalten — hier gruppieren wir ja anders
    titleDisplay: i.title,
    description: i.description ?? null,
    quantity: i.quantity,
    unit: i.unit,
    unit_price: i.unit_price,
    total_price: i.total_price,
    position: i.position,
  }))

  const allgemein = alle.filter(i => istAllgemeinPosition(i.title))
  const arbeit = alle.filter(i => !istAllgemeinPosition(i.title))

  const gruppen = struktur === 'arbeitsablauf'
    ? baueGruppen<Phase>(arbeit, phaseFuer, PHASE_META, ['vor', 'haupt', 'abschluss'])
    : baueGruppen<Gewerk>(arbeit, gewerkFuer, GEWERK_META, ['maler', 'boden'])

  return {
    raeume: gruppen,
    allgemein,
    hatMehrereRaeume: gruppen.length > 1,
    gesamtsumme: alle.reduce((s, i) => s + i.total_price, 0),
  }
}
