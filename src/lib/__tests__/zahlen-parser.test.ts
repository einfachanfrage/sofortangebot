import { describe, it, expect } from 'vitest'
import { ersetzeZahlenWorte } from '../zahlen-parser'

describe('ersetzeZahlenWorte — Handwerker-Doppelzahl (Meter,Zentimeter)', () => {
  // PM-010: "drei fünfzig" wurde bisher zu "3 50" (zwei einzelne Zahlen mit
  // nur einem Leerzeichen dazwischen) statt "3.50" — die KI hat das dann
  // leicht als "350" gelesen. Ein Gästezimmer mit 350 Metern Länge.
  it('PM-010: "drei fünfzig mal drei" → "3.50 mal 3", NICHT "3 50 mal 3"', () => {
    const ergebnis = ersetzeZahlenWorte('Gästezimmer, drei fünfzig mal drei, Höhe zwo sechzig.')
    expect(ergebnis).toContain('3.50 mal 3')
    expect(ergebnis).toContain('2.60')
    expect(ergebnis).not.toMatch(/\b3\s+50\b/)
  })

  it('funktioniert für alle Ziffern und Zehner-Wörter', () => {
    expect(ersetzeZahlenWorte('eins zwanzig hoch')).toBe('1.20 hoch')
    expect(ersetzeZahlenWorte('zwei achtzig breit')).toBe('2.80 breit')
    expect(ersetzeZahlenWorte('vier fünfzehn')).toBe('4.15')
  })

  it('bekannte Testfälle bleiben korrekt (kein Rückfall bei zweiter Zahl in der Dimension)', () => {
    expect(ersetzeZahlenWorte('fünf zwanzig mal vier zehn')).toBe('5.20 mal 4.10')
    expect(ersetzeZahlenWorte('sechs mal eins fünfzig')).toBe('6 mal 1.50')
    expect(ersetzeZahlenWorte('Deckenhöhe drei zwanzig')).toBe('Deckenhöhe 3.20')
  })

  it('einzelne Zahlwörter ohne Zehner-Partner weiterhin normal ersetzt', () => {
    expect(ersetzeZahlenWorte('drei Fenster und zwei Türen')).toBe('3 Fenster und 2 Türen')
  })
})
