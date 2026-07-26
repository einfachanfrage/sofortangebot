import type { ExtrahierteDaten } from './types'

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

type RaumMit = ExtrahierteDaten['raeume'][number] & {
  vage?: boolean
  vage_typ?: string | null
  vage_beschreibung?: string | null
  vage_quelle?: string
  anzahl?: number
  belag?: string
}

export type KalkulationsAntwort = { wert: number | number[]; einheit: string } | null
export type KalkulationsAntworten = Record<string, KalkulationsAntwort>

const BELAG_MAP: Record<number, string> = { 1: 'Laminat', 2: 'Vinyl', 3: 'Parkett', 4: 'Teppich' }

function raumById(raeume: RaumMit[], raumId: string): RaumMit | undefined {
  return raeume.find(r => (r.name ?? '').toLowerCase().replace(/\s+/g, '_') === raumId)
}

export function verarbeiteAntworten(
  extraktion: ExtrahierteDaten & { raeume: RaumMit[] },
  antworten: KalkulationsAntworten
): ExtrahierteDaten & { raeume: RaumMit[] } {
  const angereichert = {
    ...extraktion,
    raeume: extraktion.raeume.map(r => ({ ...r })) as RaumMit[],
  }

  // ── Kontext-Analyzer Rückfragen (IDs: hoehe_xyz, masse_xyz, belag_xyz) ──────
  for (const [id, antwort] of Object.entries(antworten)) {
    if (!antwort) continue

    const hoeheM = id.match(/^hoehe_(.+)$/)
    if (hoeheM && typeof antwort.wert === 'number') {
      const raum = raumById(angereichert.raeume, hoeheM[1])
      if (raum) raum.hoehe = antwort.wert
      continue
    }

    const tuerenM = id.match(/^tueren_anzahl_(.+)$/)
    if (tuerenM && typeof antwort.wert === 'number') {
      const raum = raumById(angereichert.raeume, tuerenM[1])
      if (raum) raum.tueren = [{ anzahl: Math.max(0, Math.floor(antwort.wert)) }]
      continue
    }

    const fensterM = id.match(/^fenster_anzahl_(.+)$/)
    if (fensterM && typeof antwort.wert === 'number') {
      const raum = raumById(angereichert.raeume, fensterM[1])
      if (raum) raum.fenster = [{ anzahl: Math.max(0, Math.floor(antwort.wert)) }]
      continue
    }

    const masseLbM = id.match(/^masse_lb_(.+)$/)
    if (masseLbM) {
      const raum = raumById(angereichert.raeume, masseLbM[1])
      if (raum) {
        if (Array.isArray(antwort.wert) && antwort.wert.length === 2) {
          raum.laenge = antwort.wert[0]; raum.breite = antwort.wert[1]
          raum.flaeche = round2(antwort.wert[0] * antwort.wert[1])
        }
      }
      continue
    }

    const masseM = id.match(/^masse_(.+)$/)
    if (masseM && !id.startsWith('masse_boden_')) {
      const raum = raumById(angereichert.raeume, masseM[1])
      if (raum) {
        if (Array.isArray(antwort.wert) && antwort.wert.length === 2) {
          raum.laenge = antwort.wert[0]; raum.breite = antwort.wert[1]
          raum.flaeche = round2(antwort.wert[0] * antwort.wert[1])
        } else if (typeof antwort.wert === 'number') {
          raum.flaeche = antwort.wert
          if (raum.arbeiten.some(arbeit => /wand|streich|tapete|spachtel|grundier/i.test(arbeit))) {
            raum.wandflaeche_direkt = antwort.wert
          }
        }
      }
      continue
    }

    const masseBodenM = id.match(/^masse_boden_(.+)$/)
    if (masseBodenM) {
      const raum = raumById(angereichert.raeume, masseBodenM[1])
      if (raum) {
        if (Array.isArray(antwort.wert) && antwort.wert.length === 2) {
          raum.laenge = antwort.wert[0]; raum.breite = antwort.wert[1]
          raum.flaeche = round2(antwort.wert[0] * antwort.wert[1])
        } else if (typeof antwort.wert === 'number') {
          raum.flaeche = antwort.wert
        }
      }
      continue
    }

    const belagM = id.match(/^belag_(.+)$/)
    if (belagM && typeof antwort.wert === 'number') {
      const raum = raumById(angereichert.raeume, belagM[1])
      if (raum) raum.belag = BELAG_MAP[antwort.wert] ?? String(antwort.wert)
      continue
    }

    const altbelagM = id.match(/^altbelag_(.+)$/)
    if (altbelagM && typeof antwort.wert === 'number') {
      const raum = raumById(angereichert.raeume, altbelagM[1])
      if (raum) raum.altbelag_entfernen = antwort.wert === 1
      continue
    }

    const tapeteM = id.match(/^tapete_entfernen_(.+)$/)
    if (tapeteM && typeof antwort.wert === 'number') {
      const raum = raumById(angereichert.raeume, tapeteM[1])
      if (raum) {
        raum.arbeiten = raum.arbeiten.filter(arbeit => !arbeit.includes('tapete entfernen'))
        if (antwort.wert === 1) raum.arbeiten.push('tapete entfernen')
      }
      continue
    }

    const versiegelungM = id.match(/^versiegelung_(.+)$/)
    if (versiegelungM && typeof antwort.wert === 'number') {
      const raum = raumById(angereichert.raeume, versiegelungM[1])
      if (raum) {
        raum.arbeiten = raum.arbeiten.filter(arbeit => !arbeit.includes('versiegeln') && !arbeit.includes('ölen') && !arbeit.includes('oelen'))
        raum.arbeiten.push(antwort.wert === 1 ? 'versiegeln' : 'oelen')
      }
      continue
    }

    const flieshoeheM = id.match(/^flieshoehe_(.+)$/)
    if (flieshoeheM && typeof antwort.wert === 'number') {
      const bereich = angereichert.bereiche.find(b => (b.name ?? '').toLowerCase().replace(/\s+/g, '_') === flieshoeheM[1])
      if (bereich) bereich.flieshoehe = antwort.wert
      continue
    }

    const altfliesenM = id.match(/^altfliesen_(.+)$/)
    if (altfliesenM && typeof antwort.wert === 'number') {
      const bereich = angereichert.bereiche.find(b => (b.name ?? '').toLowerCase().replace(/\s+/g, '_') === altfliesenM[1])
      if (bereich) {
        bereich.arbeiten = bereich.arbeiten.filter(arbeit => !arbeit.includes('altfliesen'))
        if (antwort.wert === 1) bereich.arbeiten.push('altfliesen entfernen')
      }
      continue
    }
  }

  const zahlAntwort = (id: string): number | null => {
    const antwort = antworten[id]
    return antwort && typeof antwort.wert === 'number' ? antwort.wert : null
  }

  const deckeMasse = antworten.decke_masse
  if (deckeMasse && angereichert.decken[0]) {
    if (Array.isArray(deckeMasse.wert) && deckeMasse.wert.length === 2) {
      angereichert.decken[0].laenge = deckeMasse.wert[0]
      angereichert.decken[0].breite = deckeMasse.wert[1]
      angereichert.decken[0].flaeche = round2(deckeMasse.wert[0] * deckeMasse.wert[1])
    } else if (typeof deckeMasse.wert === 'number') {
      angereichert.decken[0].flaeche = deckeMasse.wert
    }
  }

  const kabelmeter = zahlAntwort('kabel_meter') ?? zahlAntwort('wallbox_zuleitung')
  if (kabelmeter !== null) angereichert.kabelmeter = kabelmeter || null

  const rohrmeter = zahlAntwort('rohre_erneuern')
  if (rohrmeter !== null) {
    angereichert.leitungen_erneuern = rohrmeter > 0
    angereichert.rohrmeter = rohrmeter || null
  }

  const unterverteilung = zahlAntwort('unterverteilung')
  if (unterverteilung !== null) angereichert.unterverteilung = unterverteilung === 1

  const duscheTyp = zahlAntwort('dusche_typ')
  if (duscheTyp !== null) {
    angereichert.situation = `${angereichert.situation ?? ''} ${duscheTyp === 1 ? 'bodengleiche Dusche' : 'Duschtasse'}`.trim()
  }

  const badAusstattung = zahlAntwort('bad_ausstattung')
  if (badAusstattung === 1) Object.assign(angereichert, { wc: 1, waschtisch: 1, dusche: 1 })
  if (badAusstattung === 2) Object.assign(angereichert, { wc: 1, waschtisch: 1, wanne: 1 })
  if (badAusstattung === 3) Object.assign(angereichert, { wc: 1, waschtisch: 1, dusche: 1, wanne: 1 })

  const daemmung = zahlAntwort('daemmung_staenderwand')
  if (daemmung !== null) angereichert.waende = angereichert.waende.map(wand => ({ ...wand, daemmung: daemmung === 1 }))

  const geruest = zahlAntwort('geruest')
  if (geruest === 1 && !angereichert.erschwernisse.includes('Gerüst erforderlich')) angereichert.erschwernisse.push('Gerüst erforderlich')
  const brandschutz = zahlAntwort('brandschutz')
  if (brandschutz === 1 && !angereichert.erschwernisse.includes('Brandschutzanforderungen')) angereichert.erschwernisse.push('Brandschutzanforderungen')

  // ── Vage-Rückfragen (alte IDs: raum_${name}_hoehe/masse/...) ─────────────
  for (const raum of angereichert.raeume) {
    if (!raum.vage) continue
    const name = raum.name || 'Raum'

    // Länge × Breite
    const masseAntwort = antworten[`raum_${name}_masse`]
    if (masseAntwort) {
      if (Array.isArray(masseAntwort.wert) && masseAntwort.wert.length === 2) {
        raum.laenge = masseAntwort.wert[0]
        raum.breite = masseAntwort.wert[1]
        raum.flaeche = round2(masseAntwort.wert[0] * masseAntwort.wert[1])
      } else if (typeof masseAntwort.wert === 'number') {
        raum.flaeche = masseAntwort.wert
      }
      raum.vage = false
      raum.vage_quelle = 'nutzer_antwort'
    }

    // Höhe
    const hoeheAntwort = antworten[`raum_${name}_hoehe`]
    if (hoeheAntwort && typeof hoeheAntwort.wert === 'number') {
      raum.hoehe = hoeheAntwort.wert
      raum.vage = false
      raum.vage_quelle = 'nutzer_antwort'
    }

    // Anzahl (Plural → Raum duplizieren)
    const anzahlAntwort = antworten[`plural_${name}_anzahl`]
    if (anzahlAntwort && typeof anzahlAntwort.wert === 'number') {
      raum.anzahl = anzahlAntwort.wert
    }

    // Mehrere Räume mit individuellen Maßen
    const mehrereAntwort = antworten[`raum_${name}_masse_mehrere`]
    if (mehrereAntwort && Array.isArray(mehrereAntwort.wert)) {
      raum.anzahl = Math.floor(mehrereAntwort.wert.length / 2)
    }
  }

  // Plural-Räume expandieren
  const expandierteRaeume: RaumMit[] = []
  for (const raum of angereichert.raeume) {
    const name = raum.name || 'Raum'
    const mehrereAntwort = antworten[`raum_${name}_masse_mehrere`]

    if (raum.anzahl && raum.anzahl > 1) {
      // Individuelle Maße pro Zimmer aus masse_mehrere
      const massenArray: Array<{ laenge: number; breite: number }> = []
      if (mehrereAntwort && Array.isArray(mehrereAntwort.wert)) {
        // wert ist [l1, b1, l2, b2, ...] flach
        const flat = mehrereAntwort.wert as number[]
        for (let i = 0; i < flat.length; i += 2) {
          if (flat[i] && flat[i + 1]) massenArray.push({ laenge: flat[i], breite: flat[i + 1] })
        }
      }
      for (let i = 0; i < raum.anzahl; i++) {
        const masse = massenArray[i]
        expandierteRaeume.push({
          ...raum,
          name: `${name} ${i + 1}`,
          laenge: masse?.laenge ?? raum.laenge,
          breite: masse?.breite ?? raum.breite,
          flaeche: masse ? round2(masse.laenge * masse.breite) : raum.flaeche,
          anzahl: undefined,
          vage: false,
          vage_quelle: 'nutzer_antwort',
        })
      }
    } else {
      expandierteRaeume.push(raum)
    }
  }

  angereichert.raeume = expandierteRaeume
  return angereichert
}
