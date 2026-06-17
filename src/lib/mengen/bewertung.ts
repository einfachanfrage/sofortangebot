import type { ExtrahierteDaten, MengenErgebnis, KalkulationsBewertung, Vertrauensstufe } from './types'

export function berechneBewertung(
  extraktion: ExtrahierteDaten,
  mengen: MengenErgebnis
): KalkulationsBewertung {
  const erkannte_angaben: string[] = []
  const fehlende_angaben: string[] = []
  const annahmen: string[] = []

  const gewerk = extraktion.gewerk

  // Erkannte Angaben aus Räumen/Bereichen
  for (const raum of extraktion.raeume ?? []) {
    if (raum.laenge && raum.breite && raum.hoehe) {
      erkannte_angaben.push(`✓ ${raum.name}: ${raum.laenge} × ${raum.breite} × ${raum.hoehe} m`)
    } else if (raum.laenge && raum.breite) {
      erkannte_angaben.push(`✓ ${raum.name}: ${raum.laenge} × ${raum.breite} m`)
      // Raumhöhe fehlt — ist Annahme, nicht fehlende Angabe (Decke/Boden/Sockel sind trotzdem berechenbar)
      annahmen.push(`${raum.name}: Raumhöhe nicht angegeben — Wandfläche nicht berechnet`)
    } else if (raum.flaeche) {
      erkannte_angaben.push(`✓ ${raum.name}: ${raum.flaeche} m² (Fläche)`)
      annahmen.push(`${raum.name}: Nur Gesamtfläche angegeben — Länge × Breite wären präziser`)
    } else {
      fehlende_angaben.push(`⚠ ${raum.name}: Keine Maße angegeben`)
    }
    if (raum.fenster?.some((f: { breite?: number; hoehe?: number }) => !f.breite || !f.hoehe)) {
      annahmen.push(`${raum.name}: Fenstergröße 1,50 × 1,20 m angenommen`)
    }
  }

  // Gewerk-spezifische Auswertung
  if (gewerk === 'elektro') {
    if (extraktion.steckdosen != null) erkannte_angaben.push(`✓ Steckdosen: ${extraktion.steckdosen} Stück`)
    if (extraktion.schalter != null) erkannte_angaben.push(`✓ Schalter: ${extraktion.schalter} Stück`)
    if (extraktion.spots != null) erkannte_angaben.push(`✓ Einbauspots: ${extraktion.spots} Stück`)
    if (extraktion.herdanschluss) erkannte_angaben.push('✓ Herdanschluss')
    if (extraktion.wallbox) erkannte_angaben.push('✓ Wallbox')
    if (extraktion.kabelmeter) erkannte_angaben.push(`✓ Kabelmeter: ${extraktion.kabelmeter} m`)
    else if (extraktion.neu_verkabeln) {
      fehlende_angaben.push('⚠ Kabelmeter nicht angegeben — Pauschale wird verwendet')
      annahmen.push('Kabelmeter: Pauschale 150 m angenommen')
    }
  }

  if (gewerk === 'sanitaer_heizung') {
    if (extraktion.wc) erkannte_angaben.push(`✓ WC: ${extraktion.wc} Stück`)
    if (extraktion.waschtisch) erkannte_angaben.push(`✓ Waschtisch: ${extraktion.waschtisch} Stück`)
    if (extraktion.dusche) erkannte_angaben.push(`✓ Dusche: ${extraktion.dusche} Stück`)
    if (extraktion.wanne) erkannte_angaben.push(`✓ Badewanne: ${extraktion.wanne} Stück`)
    if (extraktion.heizkoerper) erkannte_angaben.push(`✓ Heizkörper: ${extraktion.heizkoerper} Stück`)
    if (extraktion.rohrmeter) erkannte_angaben.push(`✓ Rohrmeter: ${extraktion.rohrmeter} m`)
    else if (extraktion.leitungen_erneuern) {
      fehlende_angaben.push('⚠ Rohrmeter nicht angegeben — Schätzung nötig')
      annahmen.push('Rohrmeter: Schätzung je Objekt')
    }
  }

  if (gewerk === 'fliesen') {
    for (const b of extraktion.bereiche ?? []) {
      if (b.flaeche || (b.laenge && b.breite)) {
        const fl = b.flaeche ?? (b.laenge! * b.breite!)
        erkannte_angaben.push(`✓ ${b.name} (${b.typ}): ${fl} m²`)
      } else {
        fehlende_angaben.push(`⚠ ${b.name}: Fläche nicht angegeben`)
      }
      if (b.nassbereich) erkannte_angaben.push(`✓ ${b.name}: Nassbereich (Abdichtung geplant)`)
    }
    annahmen.push('Fliesenverschnitt: 10 % auf Bodenfläche, 5 % auf Wandfläche')
  }

  if (gewerk === 'trockenbau') {
    for (const w of extraktion.waende ?? []) {
      if (w.laenge && w.hoehe) {
        erkannte_angaben.push(`✓ Ständerwand: ${w.laenge} × ${w.hoehe} m`)
      } else {
        fehlende_angaben.push('⚠ Ständerwand: Maße unvollständig')
      }
    }
    for (const d of extraktion.decken ?? []) {
      if (d.flaeche || (d.laenge && d.breite)) {
        erkannte_angaben.push(`✓ Abgehängte Decke: ${d.flaeche ?? d.laenge! * d.breite!} m²`)
      }
    }
  }

  if (gewerk === 'boden_parkett') {
    for (const raum of extraktion.raeume ?? []) {
      if (raum.flaeche || (raum.laenge && raum.breite)) {
        const fl = raum.flaeche ?? raum.laenge! * raum.breite!
        erkannte_angaben.push(`✓ ${raum.name}: ${fl} m²`)
      }
    }
    annahmen.push('Belagverschnitt: 10 % (bei Diagonalverlegung 15 %)')
  }

  // Warnungen aus Mengenengine übernehmen
  for (const w of mengen.warnungen ?? []) {
    fehlende_angaben.push(`⚠ ${w}`)
  }

  // Annahmen aus Positionen sammeln
  for (const pos of mengen.positionen ?? []) {
    for (const a of pos.annahmen ?? []) {
      if (!annahmen.includes(a)) annahmen.push(a)
    }
  }

  // Vertrauensstufe berechnen
  const lowCount = mengen.positionen.filter(p => p.konfidenz === 'low').length
  const total = mengen.positionen.length
  const highCount = mengen.positionen.filter(p => p.konfidenz === 'high').length
  const hatRueckfragen = mengen.rueckfragen.length > 0
  const hatWarnungen = mengen.warnungen.length > 0

  let vertrauensstufe: Vertrauensstufe
  if (total === 0 || lowCount > total * 0.5 || fehlende_angaben.length > erkannte_angaben.length) {
    vertrauensstufe = 'gering'
  } else if (lowCount > 0 || hatRueckfragen || hatWarnungen || annahmen.length > 2) {
    vertrauensstufe = 'mittel'
  } else if (highCount === total && !hatRueckfragen) {
    vertrauensstufe = 'hoch'
  } else {
    vertrauensstufe = 'mittel'
  }

  // Bewertungstext
  const bewertungstextMap: Record<Vertrauensstufe, string> = {
    hoch: `Alle relevanten Maße wurden erkannt. Die Mengen wurden geometrisch aus den Raumangaben berechnet. Das Angebot basiert auf einer soliden Grundlage.`,
    mittel: `Die meisten Angaben wurden erkannt, aber ${fehlende_angaben.length > 0 ? 'einige Maße fehlen und' : ''} einzelne Mengen basieren auf Standardannahmen. Bitte prüfe die markierten Positionen.`,
    gering: `Wesentliche Maßangaben fehlen. Die Mengen konnten nicht vollständig berechnet werden und basieren auf Schätzungen. Bitte ergänze die fehlenden Angaben oder passe die Mengen manuell an.`,
  }

  // Empfehlungen
  const empfehlung: string[] = []
  if (fehlende_angaben.some(f => f.includes('Raumhöhe'))) {
    empfehlung.push('Raumhöhe nachmessen und in der nächsten Aufnahme angeben (z. B. „Höhe 2,60 m")')
  }
  if (fehlende_angaben.some(f => f.includes('Fläche') || f.includes('Maße'))) {
    empfehlung.push('Länge × Breite der Räume angeben für präzise Flächenberechnungen')
  }
  if (mengen.rueckfragen.length > 0) {
    empfehlung.push('Die offenen Rückfragen beantworten für genauere Mengen')
  }
  if (lowCount > 0) {
    empfehlung.push(`${lowCount} Position${lowCount > 1 ? 'en' : ''} mit unsicherer Menge — bitte vor Versand prüfen`)
  }
  if (empfehlung.length === 0 && vertrauensstufe === 'hoch') {
    empfehlung.push('Angebot ist gut vorbereitet. Preise prüfen und freigeben.')
  }

  return {
    vertrauensstufe,
    erkannte_angaben,
    fehlende_angaben,
    annahmen,
    bewertungstext: bewertungstextMap[vertrauensstufe],
    empfehlung,
  }
}
