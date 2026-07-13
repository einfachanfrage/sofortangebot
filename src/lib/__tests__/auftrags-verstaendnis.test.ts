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

  it('Etappe 2: KI-Signale ergänzen, wo Rohtext-Regex nichts fände', () => {
    // Rohtext ohne erkennbares Verb, aber die KI hat die Arbeit sauber verstanden
    const v = baueVerstaendnis('die Oberflächen im Bad auffrischen', {
      arbeitenTexte: ['Wände streichen', 'Tapete entfernen'],
      belagText: null,
      altbelagEntfernen: false,
    })
    expect(v.hatArbeit('streichen')).toBe(true)
    expect(v.hatArbeit('tapete_entfernen')).toBe(true)
  })

  it('Etappe 2: KI-Belag hat Vorrang, KI-Altbelag-Flag greift', () => {
    const v = baueVerstaendnis('Boden neu machen', {
      arbeitenTexte: ['Belag verlegen'],
      belagText: 'Eichenparkett',
      altbelagEntfernen: true,
    })
    expect(v.belag).toBe('parkett')
    expect(v.altbelagEntfernen).toBe(true)
  })

  it('Etappe 2: ohne Signale identisch zum Regex-Weg (Fallback)', () => {
    const text = 'Wände streichen, nur die Wände'
    const mit = baueVerstaendnis(text, undefined)
    const ohne = baueVerstaendnis(text)
    expect([...mit.arbeiten]).toEqual([...ohne.arbeiten])
    expect(mit.scope.nurWaende).toBe(ohne.scope.nurWaende)
  })

  it('die Frust-Ansage wird vollständig verstanden', () => {
    const v = baueVerstaendnis(
      'hier im Wohnzimmer muss gestrichen werden, 24 Quadratmeter Bodenfläche. ' +
      'Muss erst die Tapete ab und dann die Wände glattgemacht werden und dann streichen.'
    )
    expect([...v.arbeiten].sort()).toEqual(['spachteln', 'streichen', 'tapete_entfernen'])
  })
})
