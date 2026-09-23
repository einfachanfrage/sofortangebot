import { describe, it, expect } from 'vitest'
import { istProPlan, monatsStartISO, bewerteTestphase, sperrNachricht } from '../plan-limit'
import { PRICING } from '../pricing'

// ── DC-045 (06.09.2026) nach CoS-038-B (23.09.2026) ───────────────────────
//
// Diese Datei hielt Sandys Entscheidung vom 06.09. fest: „harte Grenze — ab
// dem 4. Angebot geht es erst nach dem Upgrade weiter." Die Grenze war ein
// Monatskontingent von 3 neu angelegten Angeboten.
//
// **Was hier gestrichen ist und warum.** Das Kontingent selbst. Sandys
// Preismodell vom 03.09. (`docs/preismodell.md`) kennt keinen
// Dauer-Gratis-Tarif; davor stehen 14 Testtage, danach das Abo. Damit sind
// die Zusicherungen „drei sind erlaubt, das vierte nicht", „der letzte Monat
// zählt nicht mehr mit" und „Überarbeitungen zählen nicht mit" gegenstandslos
// — nicht falsch geworden, sondern ohne Gegenstand: es gibt nichts mehr zu
// zählen, das sperrt. Sie sind hier GESTRICHEN und nicht umgeschrieben,
// damit niemand später eine Zusicherung liest, die eine Regel beschreibt,
// die das Produkt nicht mehr hat.
//
// **Was von DC-045 bleibt, steht unverändert unten.** Es sind die drei
// Zusagen, an denen eine Sperre gefährlich wird — und die sind vom
// Modellwechsel gar nicht berührt:
//
//   1. Gesperrt wird nur das ANLEGEN. Wer beim Kunden steht, bleibt nicht
//      mitten in der Aufnahme hängen.
//   2. Pro wird nie gesperrt.
//   3. Anzeige und Sperre kommen aus einer Quelle.
//
// Eine Sperre ist die gefährlichste Sorte Fix: Sie fällt erst auf, wenn
// jemand vor einem Kunden steht und nicht weiterkommt. Deshalb sind hier
// nicht nur die Grenze, sondern vor allem ihre AUSNAHMEN festgehalten.

const JETZT = new Date('2026-09-23T10:00:00.000Z')
const inTagen = (n: number) => new Date(JETZT.getTime() + n * 24 * 60 * 60 * 1000).toISOString()

describe('DC-045 — die Sperre greift, aber nur wo sie soll', () => {
  it('Pro wird nie gesperrt — auch ohne jede Testphase', () => {
    expect(bewerteTestphase('pro', null, JETZT).gesperrt).toBe(false)
    expect(bewerteTestphase('pro', inTagen(-99), JETZT).gesperrt).toBe(false)
    expect(bewerteTestphase('enterprise', inTagen(-99), JETZT).gesperrt).toBe(false)
  })

  it('während der Testphase ist nichts gesperrt', () => {
    const stand = bewerteTestphase('starter', inTagen(5), JETZT)
    expect(stand.gesperrt).toBe(false)
    expect(stand.grund).toBe('keine')
    expect(stand.tageRestlich).toBe(5)
  })

  it('nach der Testphase ist das Anlegen gesperrt', () => {
    const stand = bewerteTestphase('starter', inTagen(-1), JETZT)
    expect(stand.gesperrt).toBe(true)
    expect(stand.grund).toBe('testphase_abgelaufen')
  })

  // CoS-P-007 (Platform, 06.09.): Für die zwei bereits bestehenden Firmen ist
  // `trial_ends_at` bewusst leer geblieben. Ihnen rückwirkend eine Testphase
  // anzudichten hieße, sie über Nacht auszusperren.
  it('Bestandskonten ohne trial_ends_at werden nie gesperrt', () => {
    const stand = bewerteTestphase('starter', null, JETZT)
    expect(stand.gesperrt).toBe(false)
    expect(stand.istBestandskonto).toBe(true)
  })

  // Ein kaputter Wert in einer Spalte darf niemanden vor dem Kunden
  // aussperren — dieselbe Vorsicht wie bei `baustelle_id` in den Insert-Routen.
  it('ein unlesbares Datum sperrt nicht', () => {
    expect(bewerteTestphase('starter', 'kein Datum', JETZT).gesperrt).toBe(false)
  })
})

describe('DC-045 — der Text sagt, was weiter geht', () => {
  it('die Nachricht nennt die Testtage aus der Preisliste', () => {
    expect(sperrNachricht()).toContain(`${PRICING.testTage} Tage`)
    expect(PRICING.testTage).toBe(14)
  })

  // Die wichtigste Zusage aus DC-045, Wort für Wort unverändert: niemand
  // bleibt beim Kunden hängen.
  it('die Nachricht sagt, dass Angefangenes weitergeht', () => {
    expect(sperrNachricht()).toMatch(/weiter bearbeiten und versenden/)
  })
})

describe('DC-045 — Hilfsfunktionen', () => {
  it('istProPlan: alles außer starter ist unbegrenzt', () => {
    expect(istProPlan('starter')).toBe(false)
    expect(istProPlan(null)).toBe(false)
    expect(istProPlan(undefined)).toBe(false)
    expect(istProPlan('pro')).toBe(true)
    expect(istProPlan('enterprise')).toBe(true)
  })

  it('monatsStartISO liegt auf dem Monatsersten', () => {
    const start = new Date(monatsStartISO(new Date(2026, 8, 17, 23, 30)))
    expect(start.getDate()).toBe(1)
    expect(start.getMonth()).toBe(8)
  })
})
