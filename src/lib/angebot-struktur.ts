// Wählbare Gliederung des Angebots (Einstellung pro Betrieb).
// Gibt bewusst DIESELBE Form zurück wie gruppiereNachRaum — Entwurf-Ansicht und
// PDF können die Gruppen unverändert rendern (raumName = Gruppen-Überschrift).

import { gruppiereNachRaum, istAllgemeinPosition, type GruppierungsErgebnis, type GruppenItem } from './angebot-gruppierung'
import { sortiereNachAusfuehrung, stufeFuer } from './ausfuehrungs-stufen'

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

// ── PM-119 / L-06 + DC-144 §3 (23.09.2026) ───────────────────────
//
// Hier stand `PHASE_REGELN`: ein zweiter Satz Regexe, der eine **zweite
// Meinung** zur Reihenfolge hatte. Er ist ersatzlos weg. Die drei Phasen
// sind jetzt ein Bündel der sieben Ausführungsstufen:
//
//   Stufe 1–4  (Schutz · Abbruch · Untergrund · Grundierung) → Vorarbeiten
//   Stufe 5    (Hauptarbeit)                                 → Hauptarbeit
//   Stufe 6–7  (Abschluss · Zuschlag)                        → Abschluss
//
// Das ist dieselbe Lehre wie DC-125 und DC-143: eine Quelle, mehrere
// Aufrufer. Vorher gab es zwei Ordnungen im Produkt — die
// Entstehungsreihenfolge und `phaseFuer` — und keine von beiden war richtig.
//
// Die alte Regel warf `entfern`, `spachtel` und `grundier` gemeinsam in
// `vor`, also genau die drei Schritte, deren Reihenfolge untereinander der
// ganze Fund war. Die Gliederung hieß nach dem Arbeitsablauf und sortierte
// nicht danach. Der Unterschied zum alten Satz ist an einer Stelle sichtbar
// und gewollt: **Zuschläge** (Erschwernis, Kleinmaterial) trafen keine der
// drei alten Regeln und fielen auf `haupt` zurück — sie stehen jetzt unter
// „Abschluss", wo sie hingehören. Echte Allgemein-Positionen sind davon
// nicht betroffen, die sind an dieser Stelle längst aussortiert.
//
// Der Beschreibungstext in den Einstellungen („Vorarbeiten → Hauptarbeit →
// Abschluss") bleibt wortgleich richtig; umbenannt wird nichts.
function phaseFuer(titel: string): Phase {
  const stufe = stufeFuer(titel)
  if (stufe <= 4) return 'vor'
  if (stufe === 5) return 'haupt'
  return 'abschluss'
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
}>(items: T[], struktur: AngebotStruktur, bekannteRaeume?: readonly string[]): GruppierungsErgebnis | null {
  // `bekannteRaeume` sind die Räume des Angebots selbst (die Schlüssel aus
  // `quote.raum_details`). Wer sie hat, soll sie mitgeben — dann muss die
  // Gruppierung nicht aus dem Titel raten, welcher Name ein Raum ist
  // (CoS-E-022). Ohne sie greift die Formregel dort, unverändert gültig.
  if (struktur === 'raeume') return gruppiereNachRaum(items, bekannteRaeume)
  if (items.length === 0) return null

  // PM-119 / L-06: stufenweise sortieren, bevor gebündelt wird — derselbe
  // Grund wie in `gruppiereNachRaum`. Innerhalb einer Phase stand bisher die
  // vorhandene (falsche) Reihenfolge; jetzt steht dort die Ausführung.
  const alle: GruppenItem[] = sortiereNachAusfuehrung(items, i => i.title).map(i => ({
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
