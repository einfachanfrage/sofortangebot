import type { ExtrahierteDaten } from '@/lib/mengen/types'

export function buildSituation(extraktion: ExtrahierteDaten): string {
  const teile: string[] = []

  if (extraktion.gewerk) {
    teile.push(`Gewerk: ${extraktion.gewerk}`)
  }

  if (extraktion.raeume?.length > 0) {
    for (const raum of extraktion.raeume) {
      teile.push(`${raum.name || 'Raum'}${raum.nassbereich ? ' (Nassbereich)' : ''}`)
    }
  }

  if (extraktion.bereiche?.length > 0) {
    for (const b of extraktion.bereiche) {
      teile.push(`${b.name || b.typ}${b.nassbereich ? ' (Nassbereich)' : ''}`)
    }
  }

  if (extraktion.austausch) teile.push('Austausch/Erneuerung')
  if (extraktion.leitungen_erneuern) teile.push('Leitungen erneuern')
  if (extraktion.neu_verkabeln) teile.push('Neu verkabeln')

  if (extraktion.erschwernisse?.length > 0) {
    teile.push('Erschwernisse: ' + extraktion.erschwernisse.join(', '))
  }

  if (extraktion.anmerkungen) {
    teile.push(extraktion.anmerkungen)
  }

  return teile.join(' — ') || 'Nicht angegeben'
}

export function buildRaumdetails(extraktion: ExtrahierteDaten): string {
  const teile: string[] = []

  for (const raum of (extraktion.raeume ?? [])) {
    const details: string[] = []
    if (raum.laenge && raum.breite) details.push(`${raum.laenge}×${raum.breite} m`)
    if (raum.hoehe) details.push(`H ${raum.hoehe} m`)
    if (raum.fenster?.length) details.push(`${raum.fenster.length} Fenster`)
    if (raum.tueren?.length) details.push(`${raum.tueren.length} Türen`)
    if (raum.flaeche) details.push(`${raum.flaeche} m²`)
    if (details.length > 0) teile.push(`${raum.name || 'Raum'}: ${details.join(', ')}`)
  }

  for (const b of (extraktion.bereiche ?? [])) {
    const details: string[] = []
    const fl = b.flaeche ?? (b.laenge && b.breite ? b.laenge * b.breite : null)
    if (fl) details.push(`${fl} m²`)
    if (b.flieshoehe) details.push(`Fliesenhöhe ${b.flieshoehe} m`)
    if (details.length > 0) teile.push(`${b.name || b.typ}: ${details.join(', ')}`)
  }

  for (const w of (extraktion.waende ?? [])) {
    if (w.laenge && w.hoehe) teile.push(`Wand: ${w.laenge}×${w.hoehe} m`)
  }

  for (const d of (extraktion.decken ?? [])) {
    const fl = d.flaeche ?? (d.laenge && d.breite ? d.laenge * d.breite : null)
    if (fl) teile.push(`Decke: ${fl} m²`)
  }

  // Elektro/Sanitär Stückzahlen
  const stueck: string[] = []
  if (extraktion.steckdosen) stueck.push(`${extraktion.steckdosen} Steckdosen`)
  if (extraktion.schalter) stueck.push(`${extraktion.schalter} Schalter`)
  if (extraktion.spots) stueck.push(`${extraktion.spots} Spots`)
  if (extraktion.wc) stueck.push(`${extraktion.wc} WC`)
  if (extraktion.waschtisch) stueck.push(`${extraktion.waschtisch} Waschtisch`)
  if (extraktion.dusche) stueck.push(`${extraktion.dusche} Dusche`)
  if (extraktion.heizkoerper) stueck.push(`${extraktion.heizkoerper} Heizkörper`)
  if (stueck.length > 0) teile.push(stueck.join(', '))

  return teile.join(' | ') || 'Nicht angegeben'
}
