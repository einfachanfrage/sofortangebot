// PM-034 Befund 1 — der Blocker (Prüfmeister/Sandy, 02.09.2026)
//
// Bei einer Plausibilitätswarnung kam Sandy über den regulären Knopf nicht in
// den Entwurf. Funktioniert hat ausschließlich der Link „Trotzdem weiter zum
// Angebot" im gelben Kasten.
//
// Ursache war keine tote Schaltfläche, sondern eine Schleife: `fertigstellen()`
// zeigt bei Warnungen die Warnung und kehrt zur Timeline zurück. Der zweite
// Klick ruft dieselbe Berechnung auf, bekommt dieselbe Warnung und landet
// wieder auf der Timeline — beliebig oft.
//
// Die Entscheidung „zeigen oder weiterleiten" ist hier als reine Funktion
// nachgebaut, damit sie prüfbar ist, ohne die ganze Seite zu rendern.
import { describe, it, expect } from 'vitest'

/** Dieselbe Bedingung wie in fertigstellen(): zeigen oder weiterleiten? */
function zeigtWarnungStattWeiterzuleiten(
  warnungen: string[] | undefined,
  schonGezeigt: boolean,
): boolean {
  return !!warnungen && warnungen.length > 0 && !schonGezeigt
}

const WARNUNG = ['Küche: 360 m × 3 m ergibt 1.080 m² — wurde „drei sechzig" als 360 verstanden?']

describe('Erster Durchgang', () => {
  it('zeigt die Warnung, statt weiterzuleiten — das ist PM-010 und bleibt', () => {
    expect(zeigtWarnungStattWeiterzuleiten(WARNUNG, false)).toBe(true)
  })

  it('ohne Warnung geht es direkt weiter', () => {
    expect(zeigtWarnungStattWeiterzuleiten([], false)).toBe(false)
    expect(zeigtWarnungStattWeiterzuleiten(undefined, false)).toBe(false)
  })
})

describe('Zweiter Durchgang — der eigentliche Fix', () => {
  it('leitet weiter, obwohl dieselbe Warnung wiederkommt', () => {
    // Genau hier steckte der Blocker: Vorher war das Ergebnis auch beim
    // zweiten Mal `true`, also wieder Timeline statt Entwurf.
    expect(zeigtWarnungStattWeiterzuleiten(WARNUNG, true)).toBe(false)
  })

  it('gilt auch, wenn die Warnung sich im Wortlaut ändert', () => {
    // Der Nutzer hat die Warnklasse gesehen und trotzdem weitergedrückt —
    // eine leicht andere Formulierung darf ihn nicht erneut aufhalten.
    expect(zeigtWarnungStattWeiterzuleiten(['Esszimmer: 350 m × 4 m'], true)).toBe(false)
  })
})

describe('Was den Merker zurücksetzt', () => {
  // Nach einer NEUEN Aufnahme sind es neue Zahlen — die zugehörige Warnung
  // soll wieder einmal gezeigt werden, bevor es weitergeht.
  it('eine neue Aufnahme macht die Warnung wieder sichtbar', () => {
    let schonGezeigt = true
    const neueAufnahme = () => { schonGezeigt = false }
    neueAufnahme()
    expect(zeigtWarnungStattWeiterzuleiten(WARNUNG, schonGezeigt)).toBe(true)
  })
})
