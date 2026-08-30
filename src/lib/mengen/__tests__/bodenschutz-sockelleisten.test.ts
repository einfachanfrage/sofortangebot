// Sandys Live-Fund (2026-08-30): „es fehlt aber z.B. auch Boden schützen,
// Sockelleisten abkleben".
//
// Beides gehört bei einem Wandanstrich handwerklich dazu — im Code stand für
// den Bodenschutz sogar der Kommentar „immer wenn Wände ODER Decke gestrichen
// wird". Die Bedingung darunter verlangte trotzdem, dass der Handwerker es
// ausspricht. Aufgefallen ist das nie, weil die KI die Nebenarbeiten meistens
// von sich aus mitliefert — bei „in der ganzen Wohnung 120 m² streichen" nicht.
import { describe, expect, it } from 'vitest'
import { malerEngine } from '../gewerke/maler'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function engine(raeume: any[], transkript: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return malerEngine({ gewerk: 'maler', raeume, transkript } as any).positionen
}

function finde(positionen: ReturnType<typeof engine>, suche: string) {
  return positionen.find(p => p.beschreibung.toLowerCase().includes(suche))
}

const ZIMMER = {
  name: 'Wohnzimmer', laenge: 5, breite: 4, hoehe: 2.6, flaeche: 20,
  fenster: [{ anzahl: 1 }], tueren: [{ anzahl: 1 }], arbeiten: ['waende_streichen'],
}

describe('Bodenschutz und Sockelleisten abkleben beim Wandanstrich', () => {
  it('schützt den Boden, ohne dass es jemand sagen muss', () => {
    const boden = finde(engine([ZIMMER], 'wohnzimmer 5 mal 4 meter, 2,60 hoch, wände streichen'), 'boden schützen')
    expect(boden?.menge).toBe(20)
    expect(boden?.einheit).toBe('m²')
    // Nicht gesagt → als Vorschlag gekennzeichnet (DC-027), damit der
    // Handwerker sieht, dass die Position von uns kommt.
    expect(boden?.automatisch_ergaenzt).toBe(true)
  })

  it('klebt die Sockelleisten ab, sobald der Umfang bekannt ist', () => {
    const sockel = finde(engine([ZIMMER], 'wohnzimmer 5 mal 4 meter, 2,60 hoch, wände streichen'), 'sockelleisten abkleben')
    // Umfang 18 lfm − 0,9 m Türbreite
    expect(sockel?.menge).toBe(17.1)
    expect(sockel?.einheit).toBe('lfdm')
    expect(sockel?.automatisch_ergaenzt).toBe(true)
  })

  it('kennzeichnet die Position NICHT als Vorschlag, wenn sie gesagt wurde', () => {
    const positionen = engine(
      [{ ...ZIMMER, arbeiten: ['waende_streichen', 'boden abdecken', 'sockelleisten abkleben'], sockelleisten: true }],
      'wohnzimmer 5 mal 4 meter, wände streichen, boden abdecken, sockelleisten abkleben',
    )
    expect(finde(positionen, 'boden schützen')?.automatisch_ergaenzt).toBeFalsy()
    expect(finde(positionen, 'sockelleisten abkleben')?.automatisch_ergaenzt).toBeFalsy()
  })

  it('schützt auch bei „ganze Wohnung" den Boden — mit der echten Bodenfläche', () => {
    const positionen = engine([{
      name: 'Wohnung', laenge: null, breite: null, hoehe: null, flaeche: 55,
      wandflaeche_direkt: 120, fenster: [], tueren: [], arbeiten: ['wände streichen'],
    }], 'in der ganzen wohnung müssen 120 quadratmeter wandfläche gestrichen werden')
    expect(finde(positionen, 'boden schützen')?.menge).toBe(55)
    // Ohne Umfang gibt es keine ehrliche Meterzahl für die Sockelleisten —
    // lieber keine Position als eine erfundene Länge.
    expect(finde(positionen, 'sockelleisten abkleben')).toBeUndefined()
  })

  it('schützt den Boden nicht, wenn der Boden selbst gestrichen wird', () => {
    const positionen = engine([{
      name: 'Garage', laenge: 6, breite: 3, hoehe: 2.4, flaeche: 18,
      fenster: [], tueren: [], arbeiten: ['boden streichen'],
    }], 'garage 6 mal 3 meter, boden streichen')
    expect(finde(positionen, 'boden schützen')).toBeUndefined()
  })
})
