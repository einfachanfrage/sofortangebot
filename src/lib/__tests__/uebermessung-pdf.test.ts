// VOB-004 / Legal G5 (🔴 LR-01), freigegeben von Sandy als S-2 am 01.09.2026.
//
// Der Endkunde liest auf dem PDF „50,00 m²", misst 46,64 m² nach und fand
// bisher keine Erklärung — der erzeugende Satz existierte, landete aber nur
// im annahmen-Array und damit nur in der App. Diese Tests sichern die Kette
// ab: Öffnung → Übermessungsregel → Hinweistext → Erkennung → PDF-Map.
import { describe, it, expect } from 'vitest'
import {
  berechneOeffnungsabzugVob,
  vobHinweistext,
  istUebermessungsHinweis,
  uebermessungsHinweis,
  uebermessungsHinweiseJePosition,
  UEBERMESSUNG_ERKLAERUNG,
} from '../mengen/gewerke/vob-uebermessung'

const leer = { abzugFlaeche: 0, rohFlaeche: 0, uebermessenAnzahl: 0, uebermessenFlaeche: 0 }

describe('Übermessungshinweis — Kette bis ins Kunden-PDF', () => {
  it('erkennt den Satz, den vobHinweistext tatsächlich erzeugt', () => {
    // 2 Fenster 1,20 × 1,30 = je 1,56 m² → unter 2,5 m², also übermessen
    const fenster = berechneOeffnungsabzugVob([{ anzahl: 2, breite: 1.2, hoehe: 1.3 }], 1.2, 1.3)
    const text = vobHinweistext(fenster, leer)
    expect(text).toBeTruthy()
    expect(istUebermessungsHinweis(text!)).toBe(true)
    expect(text).toContain('nicht abgezogen')
  })

  it('erzeugt keinen Hinweis, wenn nichts übermessen wurde (Öffnung > 2,5 m²)', () => {
    const fenster = berechneOeffnungsabzugVob([{ anzahl: 1, breite: 2.0, hoehe: 2.2 }], 1.2, 1.3)
    expect(fenster.uebermessenAnzahl).toBe(0)
    expect(vobHinweistext(fenster, leer)).toBeNull()
  })

  it('greift keine fremden Annahmen ab', () => {
    expect(uebermessungsHinweis(['Zweifacher Anstrich als Standard angenommen — bitte prüfen'])).toBeNull()
    expect(uebermessungsHinweis(['Raumhöhe 2,50 m angenommen'])).toBeNull()
    expect(uebermessungsHinweis([])).toBeNull()
    expect(uebermessungsHinweis(null)).toBeNull()
    expect(uebermessungsHinweis(undefined)).toBeNull()
  })

  it('findet den Hinweis auch zwischen anderen Annahmen', () => {
    const fenster = berechneOeffnungsabzugVob([{ anzahl: 2, breite: 1.2, hoehe: 1.3 }], 1.2, 1.3)
    const text = vobHinweistext(fenster, leer)!
    const gefunden = uebermessungsHinweis(['Raumhöhe 2,50 m angenommen', text, 'Zweifacher Anstrich'])
    expect(gefunden).toBe(text)
  })

  it('liefert eine Map nur für die Positionen, die wirklich einen Hinweis haben', () => {
    const fenster = berechneOeffnungsabzugVob([{ anzahl: 2, breite: 1.2, hoehe: 1.3 }], 1.2, 1.3)
    const text = vobHinweistext(fenster, leer)!
    const map = uebermessungsHinweiseJePosition([
      { id: 'a', annahmen: [text] },
      { id: 'b', annahmen: ['Zweifacher Anstrich als Standard angenommen'] },
      { id: 'c', annahmen: [] },
      { id: 'd' },
    ])
    expect([...map.keys()]).toEqual(['a'])
    expect(map.get('a')).toBe(text)
  })

  it('bleibt leer, wenn kein Angebotsposten übermessen wurde — dann darf auch keine Fußnote erscheinen', () => {
    const map = uebermessungsHinweiseJePosition([{ id: 'a', annahmen: ['Raumhöhe 2,50 m angenommen'] }])
    expect(map.size).toBe(0)
  })

  it('Erklärtext bleibt „in Anlehnung an" (VOB-007) und nennt die 2,5-m²-Grenze', () => {
    expect(UEBERMESSUNG_ERKLAERUNG).toContain('in Anlehnung an')
    expect(UEBERMESSUNG_ERKLAERUNG).toContain('2,5 m²')
    // Keine Vollzusage der Norm — das Produkt weicht bewusst an mehreren
    // Stellen von DIN 18363 ab (Verschnitt, Nebenleistungen, Höhenzuschlag).
    expect(UEBERMESSUNG_ERKLAERUNG).not.toMatch(/Abrechnung nach VOB\/C|gemäß DIN 18363/)
  })
})
