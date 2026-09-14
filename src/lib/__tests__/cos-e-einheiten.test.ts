// Einheiten-Eimer (Manfred, 11.09.2026, nach dem Vokabular-Abgleich)
//
// Manfred: „Vier von den 14 Lücken sind gar keine Wortlücken, sondern falsche
// Einheiten. Fugen und Kanten sind immer laufende Meter, in jedem Betrieb in
// Deutschland. Und ich würd mal schauen, ob die Engine an anderen Stellen
// auch Einheiten von der Quellposition erbt — wo das einmal passiert,
// passiert's öfter."
//
// Beim Nachsehen war es schlimmer als ein falsches Etikett: Auch die MENGE
// war die Bodenfläche. Eine Fuge wurde nach Quadratmetern berechnet. Verdeckt
// hat das ein zweiter Fehler — zu diesen Positionen gibt es gar keinen
// Katalogpreis, sie standen also mit 0,00 € da. Wer den Preis anlegt, ohne
// das hier zu kennen, bekommt sofort Fuge × Bodenfläche.
import { describe, it, expect } from 'vitest'
import { pruefeStosskanten, fugenMeterAusText } from '../vollstaendigkeit/boden-sonder'
import type { BerechnetePosition } from '../mengen/types'

describe('Fugenmeter kommen aus dem Gesagten, nicht aus der Fläche', () => {
  it('liest eine genannte Meterzahl', () => {
    expect(fugenMeterAusText('etwa 18 laufende meter fugen verschweißen')).toBe(18)
    expect(fugenMeterAusText('die nähte, so um die 12 meter')).toBe(12)
  })

  it('erfindet nichts, wenn keine genannt wurde', () => {
    expect(fugenMeterAusText('vinyl verlegen, stoßkanten verkleben')).toBeNull()
    expect(fugenMeterAusText('wohnzimmer 5 mal 4 meter')).toBeNull()
  })
})

describe('Stoßkanten sind laufende Meter, keine Bodenfläche', () => {
  it('nimmt die genannten Nahtmeter', () => {
    const ergaenzt: BerechnetePosition[] = []
    const fehlende: string[] = []
    pruefeStosskanten(ergaenzt, fehlende, 'küche 20 quadratmeter vinyl, stoßkanten verkleben, 14 meter nähte')
    const p = ergaenzt.find(x => /stoßkanten/i.test(x.beschreibung))
    expect(p?.einheit).toBe('lfdm')
    expect(p?.menge).toBe(14)
  })

  it('rechnet NICHT mehr die Bodenfläche ab', () => {
    // Vorher entstand hier „Stoßkanten verkleben — 20 m²": die Naht mit der
    // Fläche des ganzen Raums bepreist.
    const ergaenzt: BerechnetePosition[] = []
    const fehlende: string[] = []
    pruefeStosskanten(ergaenzt, fehlende, 'küche 20 quadratmeter vinyl verlegen, stoßkanten verkleben')
    expect(ergaenzt.find(x => /stoßkanten/i.test(x.beschreibung))).toBeUndefined()
    expect(fehlende.some(f => /stoßkanten/i.test(f))).toBe(true)
  })

  it('fragt nach, statt aus der Fläche zu schätzen', () => {
    const ergaenzt: BerechnetePosition[] = []
    const fehlende: string[] = []
    pruefeStosskanten(ergaenzt, fehlende, 'stoßkanten verkleben')
    expect(fehlende[0]).toContain('Meter prüfen')
  })
})
