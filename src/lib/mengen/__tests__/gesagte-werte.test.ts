import { describe, expect, it } from 'vitest'
import {
  findeGesagtenWert,
  artFuerRueckfrage,
  ergaenzeOeffnungenAusText,
} from '../gesagte-werte'

// DC-026: „Das Tool fragt nach Sachen, die ich gerade erst gesagt habe."
// Die beiden Beispiele aus dem Ticket (Fensteranzahl, Bodenfläche) sind hier
// als Testfälle festgehalten, damit sie nicht ein zweites Mal zurückkommen.

describe('DC-026 – Werte im Transkript wiederfinden', () => {
  it('findet die Fensteranzahl samt Beleg-Satz', () => {
    const treffer = findeGesagtenWert(
      'anzahl_fenster',
      'Im Wohnzimmer die Wände streichen. Da sind drei Fenster drin.',
      'Wohnzimmer',
      ['Wohnzimmer'],
    )
    expect(treffer?.wert).toBe(3)
    expect(treffer?.anzeige).toBe('3 Fenster')
  })

  it('findet die Raumhöhe, auch als „2 Meter 60"', () => {
    const treffer = findeGesagtenWert('hoehe', 'Die Küche ist 2 Meter 60 hoch.', 'Küche', ['Küche'])
    expect(treffer?.wert).toBe(2.6)
    expect(treffer?.anzeige).toBe('2,6 m')
  })

  it('findet Raummaße als „5 mal 4"', () => {
    const treffer = findeGesagtenWert('masse', 'Der Flur ist 5 mal 4 Meter.', 'Flur', ['Flur'])
    expect(treffer?.wert).toEqual([5, 4])
    expect(treffer?.anzeige).toBe('5 × 4 m')
  })

  it('findet eine direkt genannte Fläche', () => {
    const treffer = findeGesagtenWert('flaeche', 'Der Boden im Bad hat 12 qm.', 'Bad', ['Bad'])
    expect(treffer?.wert).toBe(12)
    expect(treffer?.anzeige).toBe('12 m²')
  })

  it('hält Fenstermaße von Raummaßen auseinander', () => {
    // "1,20 mal 1,40" ist das Fenster, nicht der Raum — sonst würde aus einer
    // Fensterangabe ein Vorschlag für die Raumgröße.
    const treffer = findeGesagtenWert(
      'masse',
      'Fassade Südseite, 3 Fenster drin, 1,20 mal 1,40.',
      null,
      [],
    )
    expect(treffer).toBeNull()
  })

  it('schlägt bei mehreren Räumen nichts Geratenes vor', () => {
    // Ohne klaren Raumbezug darf aus einem Mehrraum-Transkript kein Wert
    // gezogen werden — lieber normal fragen als das falsche Zimmer erwischen.
    const transkript = 'Im Wohnzimmer streichen. Die Küche ist 2,60 hoch.'
    expect(findeGesagtenWert('hoehe', transkript, null, ['Wohnzimmer', 'Küche'])).toBeNull()
  })

  it('nimmt bei mehreren Räumen den Satz des richtigen Raums', () => {
    const transkript = 'Das Wohnzimmer ist 3 Meter hoch. Die Küche ist 2,40 m hoch.'
    const treffer = findeGesagtenWert('hoehe', transkript, 'Küche', ['Wohnzimmer', 'Küche'])
    expect(treffer?.wert).toBe(2.4)
    expect(treffer?.zitat).toContain('Küche')
  })

  it('verwechselt Wandfläche NICHT mit Bodenfläche', () => {
    // Der gefährlichste Fehler in diesem Bereich: eine nackte
    // Quadratmeterzahl als Vorschlag für die falsche Fläche anzubieten. Dann
    // wäre der Vorschlag schlimmer als die Frage, die er ersetzt.
    const transkript = 'Im Flur die Wände streichen, 18 Quadratmeter Wandfläche.'
    expect(findeGesagtenWert('flaeche_boden', transkript, 'Flur', ['Flur'])).toBeNull()
  })

  it('nimmt die Bodenfläche, wenn sie als solche genannt ist', () => {
    const transkript = 'Im Flur die Wände streichen, 18 Quadratmeter Wandfläche. Der Boden hat 12 qm.'
    const treffer = findeGesagtenWert('flaeche_boden', transkript, 'Flur', ['Flur'])
    expect(treffer?.wert).toBe(12)
    expect(treffer?.zitat).toContain('Boden')
  })

  it('zitiert die Originalworte, nicht unsere umgeschriebene Fassung', () => {
    // „drei Fenster" wird intern zu „3 Fenster" — im Zitat muss aber stehen,
    // was der Handwerker wirklich gesagt hat, sonst prüft er einen Satz, den
    // es so nie gab.
    const treffer = findeGesagtenWert(
      'anzahl_fenster',
      'Im Wohnzimmer die Wände streichen. Da sind drei Fenster drin.',
      'Wohnzimmer',
      ['Wohnzimmer'],
    )
    expect(treffer?.wert).toBe(3)
    expect(treffer?.zitat).toContain('drei Fenster')
  })

  it('erfindet nichts, wenn im Text nichts steht', () => {
    expect(findeGesagtenWert('hoehe', 'Wände und Decke streichen.', 'Raum', ['Raum'])).toBeNull()
    expect(findeGesagtenWert('anzahl_fenster', 'Wände streichen.', 'Raum', ['Raum'])).toBeNull()
  })
})

describe('DC-026 – Zuordnung Frage → gesuchter Wert', () => {
  it.each([
    ['fenster_anzahl_wohnzimmer', 'anzahl', 'anzahl_fenster'],
    ['tueren_anzahl_wohnzimmer', 'anzahl', 'anzahl_tueren'],
    ['hoehe_wohnzimmer', 'hoehe', 'hoehe'],
    ['raum_Küche_hoehe', 'hoehe', 'hoehe'],
    ['masse_boden_wohnzimmer', 'masse_einzel', 'flaeche_boden'],
    ['masse_wohnzimmer', 'masse_einzel', 'masse'],
  ])('%s → %s', (id, typ, erwartet) => {
    expect(artFuerRueckfrage(id, typ)).toBe(erwartet)
  })

  it('lässt unbekannte Fragen unangetastet', () => {
    expect(artFuerRueckfrage('geruest', 'ja_nein')).toBeNull()
    expect(artFuerRueckfrage('dusche_typ', 'ja_nein')).toBeNull()
  })
})

describe('DC-026 – Öffnungen in den Raum schreiben, statt danach zu fragen', () => {
  function raum(extra: Record<string, unknown> = {}) {
    return { fenster: [], tueren: [], ...extra }
  }

  it('trägt die im Text genannten Fenster in den Einzelraum ein', () => {
    const extraktion = { transkript: 'Wohnzimmer streichen, 3 Fenster drin.', raeume: [raum()] }
    ergaenzeOeffnungenAusText(extraktion, 'Wohnzimmer streichen, 3 Fenster drin.')
    expect(extraktion.raeume[0].fenster).toEqual([{ anzahl: 3 }])
  })

  it('respektiert eine Verneinung („ohne Fenster")', () => {
    const text = 'Kellerraum streichen, ohne Fenster, nur 1 Tür.'
    const extraktion = { transkript: text, raeume: [raum()] }
    ergaenzeOeffnungenAusText(extraktion, text)
    expect(extraktion.raeume[0].fenster).toEqual([])
    expect(extraktion.raeume[0].tueren).toEqual([{ anzahl: 1 }])
  })

  it('überschreibt bereits erkannte Öffnungen nicht', () => {
    const text = 'Wohnzimmer streichen, 3 Fenster drin.'
    const extraktion = { transkript: text, raeume: [raum({ fenster: [{ anzahl: 2, breite: 1.2, hoehe: 1.4 }] })] }
    ergaenzeOeffnungenAusText(extraktion, text)
    expect(extraktion.raeume[0].fenster).toEqual([{ anzahl: 2, breite: 1.2, hoehe: 1.4 }])
  })

  it('rührt Mehrraum-Aufträge nicht an (Zuordnung wäre geraten)', () => {
    const text = 'Wohnzimmer streichen, 3 Fenster. Küche auch streichen.'
    const extraktion = { transkript: text, raeume: [raum(), raum()] }
    ergaenzeOeffnungenAusText(extraktion, text)
    expect(extraktion.raeume[0].fenster).toEqual([])
    expect(extraktion.raeume[1].fenster).toEqual([])
  })
})
