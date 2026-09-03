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
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'

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

// ── Nachtrag 03.09.2026: die Korrektur muss VOR der Berechnung greifen ─────
//
// Beim Umsetzen von PM-036 aufgefallen und hier festgenagelt: Die Korrektur
// oben hing zuerst in generiere-positionen/route.ts — also NACH dem Aufruf
// der Pipeline. Sie hat damit die gespeicherten Raummaße korrigiert und den
// Hinweis erzeugt, aber die Positionen waren zu dem Zeitpunkt längst mit
// „360 m" gerechnet. Ein Fix, der aussieht als würde er wirken. Seit dem
// Umzug in extraktion-pipeline.ts läuft sie vor der Mengenberechnung — und
// genau das prüfen diese beiden Tests, nicht mehr nur die Hilfsfunktion.
describe('Die Korrektur erreicht die Positionen, nicht nur die Anzeige', () => {
  function pipelineMit(raum: Record<string, unknown>, text: string) {
    const result = {
      gewerk: 'boden_parkett',
      raeume: [raum],
      bereiche: [], waende: [], decken: [], objekte: [],
      annahmen: [], transkript: text,
    }
    return verarbeiteExtraktion(text, { result } as never)
  }

  it('„360 mal 3" ergibt 11,34 m² Vinyl — nicht 1.134 m²', () => {
    const antwort = pipelineMit({
      name: 'Küche', laenge: 360, breite: 3, hoehe: null, flaeche: null,
      belag: 'klick-vinyl', verlegerichtung: 'standard', arbeiten: ['vinyl verlegen'],
      fenster: [], tueren: [], altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
    }, 'In der Küche 360 mal 3 Klick-Vinyl verlegen.')

    const verlegen = antwort.mengen.positionen.find(p => p.beschreibung.includes('verlegen'))
    expect(verlegen?.menge).toBe(11.34) // 3,60 × 3,00 = 10,80 m² + 5 % Verschnitt
    expect(antwort.mass_hinweise.join(' ')).toContain('Küche')
  })

  it('die Sekundenzahl im Hinweis passt zur gerechneten Zahl (kein Auseinanderdriften)', () => {
    const antwort = pipelineMit({
      name: 'Esszimmer', laenge: 4, breite: 350, hoehe: null, flaeche: null,
      belag: 'laminat', verlegerichtung: 'standard', arbeiten: ['laminat verlegen'],
      fenster: [], tueren: [], altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
    }, 'Esszimmer 4 mal 350, Laminat verlegen.')

    const verlegen = antwort.mengen.positionen.find(p => p.beschreibung.includes('verlegen'))
    expect(verlegen?.menge).toBe(14.7) // 4,00 × 3,50 = 14,00 m² + 5 %
    expect(antwort.mass_hinweise[0]).toContain('3,50 m')
  })
})
