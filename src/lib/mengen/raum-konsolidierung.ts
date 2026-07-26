import type { ExtrahierteDaten } from './types'

const RAUMNAMEN = ['wohnzimmer', 'schlafzimmer', 'kinderzimmer', 'arbeitszimmer', 'esszimmer', 'gästezimmer', 'badezimmer', 'bad', 'küche', 'flur', 'diele', 'keller', 'garage', 'treppenhaus', 'büro']

export function konsolidierePlatzhalterRaum(extraktion: ExtrahierteDaten, transkript = ''): ExtrahierteDaten {
  const echte = extraktion.raeume.filter(r => !/^(raum|zimmer)$/i.test((r.name ?? '').trim()))
  const platzhalter = extraktion.raeume.filter(r => /^(raum|zimmer)$/i.test((r.name ?? '').trim()))
  if (echte.length === 0 && platzhalter.length === 1) {
    const treffer = RAUMNAMEN.filter(name => new RegExp(`\\b${name}\\b`, 'i').test(transkript))
    if (treffer.length === 1) {
      const name = treffer[0].charAt(0).toLocaleUpperCase('de-DE') + treffer[0].slice(1)
      return { ...extraktion, raeume: [{ ...platzhalter[0], name }] }
    }
  }
  if (echte.length !== 1 || platzhalter.length === 0) return extraktion

  const ziel = echte[0]
  const quelle = platzhalter[0]
  return {
    ...extraktion,
    raeume: [{
      ...quelle,
      ...ziel,
      laenge: ziel.laenge ?? quelle.laenge,
      breite: ziel.breite ?? quelle.breite,
      hoehe: ziel.hoehe ?? quelle.hoehe,
      flaeche: ziel.flaeche ?? quelle.flaeche,
      fenster: ziel.fenster.length > 0 ? ziel.fenster : quelle.fenster,
      tueren: ziel.tueren.length > 0 ? ziel.tueren : quelle.tueren,
      arbeiten: [...new Set([...(quelle.arbeiten ?? []), ...(ziel.arbeiten ?? [])])],
    }],
  }
}
