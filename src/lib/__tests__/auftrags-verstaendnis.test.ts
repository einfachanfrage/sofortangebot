import { describe, it, expect } from 'vitest'
import { baueVerstaendnis } from '../auftrags-verstaendnis'

describe('baueVerstaendnis — typisierter Auftrags-Vertrag', () => {
  it('bündelt Arbeiten, Scope, Öffnungen, Kontext aus einer Ansage', () => {
    const v = baueVerstaendnis(
      'nur die Wände im Keller streichen, erst die Tapete ab und glattmachen, kein Fenster'
    )
    expect(v.hatArbeit('streichen')).toBe(true)
    expect(v.hatArbeit('tapete_entfernen')).toBe(true)
    expect(v.hatArbeit('spachteln')).toBe(true)
    expect(v.scope.nurWaende).toBe(true)
    expect(v.oeffnungen.keinFenster).toBe(true)
    expect(v.kontext.istKeller).toBe(true)
  })

  it('leere Ansage → alles leer/false, kein Absturz', () => {
    const v = baueVerstaendnis('')
    expect(v.arbeiten.size).toBe(0)
    expect(v.scope.nurWaende).toBe(false)
    expect(v.hatArbeit('streichen')).toBe(false)
  })

  it('Boden-Felder: Belag + Altbelag-Demontage (inkl. Partizip)', () => {
    const v = baueVerstaendnis('alten Teppich rausgerissen, neues Klick-Vinyl verlegen und abschleifen')
    expect(v.belag).toBe('vinyl')
    expect(v.altbelagEntfernen).toBe(true)
    expect(v.hatArbeit('schleifen')).toBe(true)
  })

  it('kein Boden-Auftrag → belag null, altbelagEntfernen false', () => {
    const v = baueVerstaendnis('Wände streichen')
    expect(v.belag).toBe(null)
    expect(v.altbelagEntfernen).toBe(false)
  })

  it('die Frust-Ansage wird vollständig verstanden', () => {
    const v = baueVerstaendnis(
      'hier im Wohnzimmer muss gestrichen werden, 24 Quadratmeter Bodenfläche. ' +
      'Muss erst die Tapete ab und dann die Wände glattgemacht werden und dann streichen.'
    )
    expect([...v.arbeiten].sort()).toEqual(['spachteln', 'streichen', 'tapete_entfernen'])
  })
})
