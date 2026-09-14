// DC-055 / TN-007 (Manfred, 11.09.2026) — deutsche Zahlen im Rechenweg.
import { describe, it, expect } from 'vitest'
import { mitDeutschenZahlen } from '@/lib/zahlen-text'

describe('DC-055 — Dezimalpunkt wird Komma', () => {
  it('schreibt den gemeldeten Fall deutsch', () => {
    expect(mitDeutschenZahlen('Wand 6 m lang, 2.4 m hoch = 14.4 m²'))
      .toBe('Wand 6 m lang, 2,4 m hoch = 14,4 m²')
  })

  it('fasst Normnummern nicht an', () => {
    expect(mitDeutschenZahlen('VOB/C DIN 18363 Übermessung')).toBe('VOB/C DIN 18363 Übermessung')
  })

  it('fasst Datumsangaben nicht an', () => {
    expect(mitDeutschenZahlen('Aufmaß vom 11.09.2026')).toBe('Aufmaß vom 11.09.2026')
  })

  it('ändert bereits deutsche Texte nicht', () => {
    const schon = '46,64 m² × 12,50 €/m² = 583,00 €'
    expect(mitDeutschenZahlen(schon)).toBe(schon)
  })

  it('erwischt auch den Übermessungs-Hinweis', () => {
    expect(mitDeutschenZahlen('3 Öffnungen bis 2,5 m² Einzelgröße nicht abgezogen (4.29 m², VOB/C DIN 18363 Übermessung)'))
      .toBe('3 Öffnungen bis 2,5 m² Einzelgröße nicht abgezogen (4,29 m², VOB/C DIN 18363 Übermessung)')
  })

  it('kommt mit leer und null klar', () => {
    expect(mitDeutschenZahlen(null)).toBe('')
    expect(mitDeutschenZahlen(undefined)).toBe('')
    expect(mitDeutschenZahlen('')).toBe('')
  })
})
