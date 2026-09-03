// PM-034 Befund 2 — „drei sechzig" wird 360 (Prüfmeister, 02.09.2026)
//
// Belegt an den echten Transkripten vom 02./03.09.: Whisper schreibt im selben
// Batch mal „4,50" und „2,80" richtig, mal „360" und „350" falsch. Der Fehler
// entsteht also VOR unserem Code — wortbasierte Reparatur greift nicht, es
// gibt keine Wörter mehr.
//
// Der Prüfmeister hat die alte Einordnung („Warnung statt Korrektur") in Frage
// gestellt: „drei fünfzig" ist die normale Sprechweise auf dem Bau, in einem
// Diktat hat es zwei von drei Maßangaben zerlegt. Diese Tests halten die neue
// Grenze fest — korrigieren, wo es eindeutig ist, sonst Finger weg.
import { describe, it, expect } from 'vitest'
import { korrigiereSeitenlaenge, korrigiereRaumMasse, pruefeMassPlausibilitaet } from '../mass-plausibilitaet'

describe('Was korrigiert wird', () => {
  it('die beiden Fälle aus PM-034', () => {
    expect(korrigiereSeitenlaenge(360)).toBe(3.6)   // Küche „drei sechzig mal drei"
    expect(korrigiereSeitenlaenge(350)).toBe(3.5)   // Esszimmer „vier mal drei fünfzig"
  })

  it('weitere übliche Sprechweisen', () => {
    expect(korrigiereSeitenlaenge(120)).toBe(1.2)   // „eins zwanzig"
    expect(korrigiereSeitenlaenge(280)).toBe(2.8)   // „zwo achtzig"
    expect(korrigiereSeitenlaenge(1250)).toBe(12.5) // „zwölf fünfzig"
  })
})

describe('Was NICHT angefasst wird', () => {
  it('plausible Maße bleiben, wie sie sind', () => {
    expect(korrigiereSeitenlaenge(3.6)).toBeNull()
    expect(korrigiereSeitenlaenge(12)).toBeNull()
    expect(korrigiereSeitenlaenge(15)).toBeNull()
  })

  it('Zahlen mit Nachkommastellen — die hat Whisper schon richtig verstanden', () => {
    expect(korrigiereSeitenlaenge(350.5)).toBeNull()
  })

  it('zu kurze oder zu lange Ziffernfolgen', () => {
    expect(korrigiereSeitenlaenge(99)).toBeNull()     // zweistellig
    expect(korrigiereSeitenlaenge(12000)).toBeNull()  // fünfstellig
  })

  it('wenn das Ergebnis selbst unplausibel wäre', () => {
    // 20 → 0,20 m wäre keine Raumseite. Bleibt lieber stehen und wird gewarnt.
    expect(korrigiereSeitenlaenge(20)).toBeNull()
    expect(korrigiereSeitenlaenge(9999)).toBeNull()   // 99,99 m ist keine Raumseite
  })
})

describe('Räume korrigieren und dabei sagen, was passiert ist', () => {
  it('repariert die Küche aus PM-034 und erklärt es', () => {
    const raeume = [{ name: 'Küche', laenge: 360, breite: 3 }]
    const { hinweise } = korrigiereRaumMasse(raeume)
    expect(raeume[0].laenge).toBe(3.6)
    expect(raeume[0].breite).toBe(3)
    expect(hinweise).toHaveLength(1)
    expect(hinweise[0]).toContain('Küche')
    expect(hinweise[0]).toContain('3,60')
  })

  it('korrigiert nie stillschweigend — jede Änderung erzeugt einen Hinweis', () => {
    const raeume = [{ name: 'Küche', laenge: 360, breite: 3 }, { name: 'Esszimmer', laenge: 4, breite: 350 }]
    const { hinweise } = korrigiereRaumMasse(raeume)
    expect(hinweise).toHaveLength(2)
  })

  it('nach der Korrektur bleibt keine Warnung übrig', () => {
    // Vorher hätte die Plausibilitätsprüfung hier zweimal angeschlagen.
    const raeume = [{ name: 'Küche', laenge: 360, breite: 3 }, { name: 'Esszimmer', laenge: 4, breite: 350 }]
    korrigiereRaumMasse(raeume)
    expect(pruefeMassPlausibilitaet(raeume)).toEqual([])
  })

  it('was sich nicht eindeutig korrigieren lässt, wird weiterhin gewarnt', () => {
    // 40 m Raumseite: keine dreistellige Sprechweise, also keine Korrektur —
    // aber weiterhin unplausibel. Die Warnung von PM-010 bleibt erhalten.
    const raeume = [{ name: 'Halle', laenge: 40, breite: 3 }]
    expect(korrigiereRaumMasse(raeume).hinweise).toEqual([])
    expect(raeume[0].laenge).toBe(40)
    expect(pruefeMassPlausibilitaet(raeume)).toHaveLength(1)
  })
})
