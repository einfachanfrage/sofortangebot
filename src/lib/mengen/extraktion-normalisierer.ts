import type { ExtrahierteDaten } from './types'

function arr<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}

function num(val: unknown): number | null {
  return typeof val === 'number' && isFinite(val) ? val : null
}

function bool(val: unknown, fallback = false): boolean {
  return typeof val === 'boolean' ? val : fallback
}

// GPT verwendet manchmal Varianten wie "fassadenarbeiten", "malerarbeiten" etc.
function normalisiereGewerk(raw: string): string {
  const g = raw.toLowerCase().trim()
  if (g === 'maler' || g === 'malerarbeiten' || g === 'malerarbeit'
      || g === 'fassade' || g === 'fassadenarbeiten' || g === 'fassadenarbeit'
      || g === 'lackierer' || g === 'maler_lackierer') return 'maler'
  if (g === 'fliesen' || g === 'fliesenarbeiten' || g === 'fliesenleger') return 'fliesen'
  if (g === 'trockenbau' || g === 'trockenausbau' || g === 'gipskarton' || g === 'rigips') return 'trockenbau'
  if (g === 'boden' || g === 'boden_parkett' || g === 'parkett' || g === 'bodenbelag'
      || g === 'bodenarbeiten' || g === 'laminat' || g === 'vinyl') return 'boden_parkett'
  if (g === 'sanitaer' || g === 'sanitaer_heizung' || g === 'sanitär' || g === 'sanitär_heizung'
      || g === 'heizung' || g === 'heizungsarbeiten' || g === 'klempner') return 'sanitaer_heizung'
  if (g === 'elektro' || g === 'elektroarbeiten' || g === 'elektriker' || g === 'elektroinstallation') return 'elektro'
  return raw // unbekanntes Gewerk unverändert lassen
}

/**
 * Normalisiert die rohe GPT-Extraktion: alle Array-Felder werden zu echten Arrays,
 * alle Zahlen/Booleans auf korrekte Typen gebracht.
 * Einmalig aufrufen direkt nach JSON.parse der GPT-Antwort.
 */
export function normalisiereExtraktion(raw: Record<string, unknown>): ExtrahierteDaten {
  const raeume = arr<Record<string, unknown>>(raw.raeume).map(r => ({
    name: (r.name as string) || 'Raum',
    laenge: num(r.laenge),
    breite: num(r.breite),
    hoehe: num(r.hoehe),
    flaeche: num(r.flaeche),
    wandflaeche_direkt: num((r as any).wandflaeche_direkt),
    deckflaeche_direkt: num((r as any).deckflaeche_direkt),
    wandflaeche_abzug_m2: num((r as any).wandflaeche_abzug_m2),
    umfang: num(r.umfang),
    fenster: arr<Record<string, unknown>>(r.fenster).map(f => ({
      breite: num(f.breite) ?? undefined,
      hoehe: num(f.hoehe) ?? undefined,
      annahme: bool(f.annahme),
    })),
    tueren: arr<Record<string, unknown>>(r.tueren).map(t => ({
      breite: num(t.breite) ?? undefined,
      hoehe: num(t.hoehe) ?? undefined,
      annahme: bool(t.annahme),
    })),
    arbeiten: arr<string>(r.arbeiten).filter(a => typeof a === 'string'),
    altbelag_vorhanden: bool(r.altbelag_vorhanden),
    altbelag_entfernen: bool(r.altbelag_entfernen),
    sockelleisten: bool(r.sockelleisten),
    nassbereich: bool(r.nassbereich),
    vage: bool(r.vage),
    vage_typ: (r.vage_typ as string | null) ?? null,
    vage_beschreibung: (r.vage_beschreibung as string | null) ?? null,
  }))

  const bereiche = arr<Record<string, unknown>>(raw.bereiche).map(b => ({
    name: (b.name as string) || 'Bereich',
    typ: (b.typ as string) || '',
    laenge: num(b.laenge),
    breite: num(b.breite),
    hoehe: num(b.hoehe),
    flieshoehe: num(b.flieshoehe),
    flaeche: num(b.flaeche),
    nassbereich: bool(b.nassbereich),
    arbeiten: arr<string>(b.arbeiten).filter(a => typeof a === 'string'),
  }))

  const waende = arr<Record<string, unknown>>(raw.waende).map(w => ({
    laenge: num(w.laenge),
    hoehe: num(w.hoehe),
    beplankung: typeof w.beplankung === 'number' ? w.beplankung : 1,
    daemmung: bool(w.daemmung),
  }))

  const decken = arr<Record<string, unknown>>(raw.decken).map(d => ({
    laenge: num(d.laenge),
    breite: num(d.breite),
    flaeche: num(d.flaeche),
  }))

  return {
    gewerk: normalisiereGewerk((raw.gewerk as string) || ''),
    confidence_gewerk: typeof raw.confidence_gewerk === 'number' ? raw.confidence_gewerk : 0,
    kunde: {
      name: (raw.kunde as Record<string, unknown> | null)?.name as string | null ?? null,
      adresse: (raw.kunde as Record<string, unknown> | null)?.adresse as string | null ?? null,
      ort: (raw.kunde as Record<string, unknown> | null)?.ort as string | null ?? null,
    },
    situation: (raw.situation as string | undefined) ?? undefined,
    annahmen: arr<string>(raw.annahmen).filter(a => typeof a === 'string'),
    rueckfragen: arr(raw.rueckfragen),
    raeume,
    waende,
    decken,
    bereiche,
    steckdosen: num(raw.steckdosen),
    schalter: num(raw.schalter),
    spots: num(raw.spots),
    aussenlampen: num(raw.aussenlampen),
    wandlampen: num(raw.wandlampen),
    herdanschluss: bool(raw.herdanschluss),
    wallbox: bool(raw.wallbox),
    unterverteilung: bool(raw.unterverteilung),
    hauptverteilung: bool(raw.hauptverteilung),
    kabelmeter: num(raw.kabelmeter),
    neu_verkabeln: bool(raw.neu_verkabeln),
    wc: num(raw.wc),
    waschtisch: num(raw.waschtisch),
    dusche: num(raw.dusche),
    wanne: num(raw.wanne),
    urinal: num(raw.urinal),
    bidet: num(raw.bidet),
    armaturen: num(raw.armaturen),
    rohrmeter: num(raw.rohrmeter),
    leitungen_erneuern: bool(raw.leitungen_erneuern),
    heizkoerper: num(raw.heizkoerper),
    austausch: bool(raw.austausch),
    erneuerung: bool(raw.erneuerung),
    altbelag: arr<Record<string, unknown>>(raw.altbelag).map(a => ({
      bereich: (a.bereich as string) || '',
      flaeche: num(a.flaeche),
    })),
    erschwernisse: arr<string>(raw.erschwernisse).filter(e => typeof e === 'string'),
    anmerkungen: (raw.anmerkungen as string | null) ?? null,
    fehlende_angaben: arr<string>(raw.fehlende_angaben).filter(f => typeof f === 'string'),
    transkript: (raw.transkript as string) ?? '',
  }
}
