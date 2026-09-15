// CoS-E-058 / PM-045-A — Türen und Fenster aus der Aufnahme, nicht nur aus dem Satz.
//
// Der Fund des Prüfmeisters: Auf einer Wohnung mit vier Innentüren stand im
// Angebot eine. Nicht weil die Zahl fehlte — sie stand in der Aufnahme —
// sondern weil sie nie bis zu der Regel kam, die die Lackier-Positionen
// baut. `pruefeTuerenLackieren` bekam `lower`, `v` und `meta`; die Räume
// bekam sie nie. Ohne Zahl im Satz endete jede Kette bei `1`.
//
// Der Betrag dahinter: 540,00 € auf einer Wohnung.
//
// Was hier zugesichert wird, in dieser Reihenfolge:
//   1. das gesprochene Wort schlägt die Aufnahme („die zwei Türen" bleibt 2,
//      auch wenn die Aufnahme vier führt) — sonst erfindet die App Arbeit;
//   2. ohne Zahl im Satz tritt die Aufnahme an die Stelle der alten `1`;
//   3. ohne beides bleibt alles wie vorher;
//   4. eine ANGENOMMENE Öffnung trägt keine Menge (PM-023).
//
// Punkt 5 ist der eigentliche Grund für die letzte Gruppe: dass die Zahl im
// ECHTEN Weg ankommt, nicht nur in einer von Hand gebauten `meta`. Genau
// daran ist PM-045-B gescheitert — ein Test, der einen Zustand misst, den
// die Pipeline nicht hat, hätte den Fehler nie gezeigt.
import { describe, expect, it } from 'vitest'
import { oeffnungenAusAufnahme } from '../mengen/gesagte-werte'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { ersetzeZahlenWorte } from '../zahlen-parser'
import type { BerechnetePosition } from '../mengen/types'

const wand = (raum: string): BerechnetePosition =>
  ({ beschreibung: `Wand streichen 2x — ${raum}`, menge: 40, einheit: 'm²', konfidenz: 'high', berechnungsweg: '', annahmen: [] })

/** Wie die echte Pipeline: Zahlwörter zuerst in Ziffern. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lauf = (text: string, meta?: any) =>
  pruefeUndErgaenzeVollstaendigkeit('maler', [wand('Wohnzimmer')], ersetzeZahlenWorte(text), meta).positionen

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const menge = (text: string, titel: RegExp, meta?: any): number | null =>
  lauf(text, meta).find(p => titel.test(p.beschreibung))?.menge ?? null

describe('oeffnungenAusAufnahme — was die Aufnahme wirklich sagt', () => {
  it('summiert über alle Räume', () => {
    expect(oeffnungenAusAufnahme({
      raeume: [
        { tueren: [{ anzahl: 2 }], fenster: [{ anzahl: 1 }] },
        { tueren: [{ anzahl: 3 }], fenster: [{ anzahl: 2 }] },
      ],
    })).toEqual({ tueren: 5, fenster: 3 })
  })

  it('ein Eintrag ohne `anzahl` ist genau eine Öffnung', () => {
    expect(oeffnungenAusAufnahme({ raeume: [{ tueren: [{}, {}], fenster: [{}] }] }))
      .toEqual({ tueren: 2, fenster: 1 })
  })

  it('angenommene Öffnungen zählen NICHT mit (PM-023: nichts erfinden)', () => {
    expect(oeffnungenAusAufnahme({
      raeume: [{ tueren: [{ anzahl: 2 }, { anzahl: 5, annahme: true }], fenster: [{ anzahl: 3, annahme: true }] }],
    })).toEqual({ tueren: 2, fenster: 0 })
  })

  it('keine Räume, keine Öffnungen — und kein Absturz', () => {
    expect(oeffnungenAusAufnahme({})).toEqual({ tueren: 0, fenster: 0 })
    expect(oeffnungenAusAufnahme({ raeume: [{}] })).toEqual({ tueren: 0, fenster: 0 })
  })
})

describe('Türen lackieren — Reihenfolge der Quellen', () => {
  it('ohne Zahl im Satz zählt die Aufnahme — das ist der Fund (1 → 4)', () => {
    expect(menge('Die Innentüren lackieren.', /Türen lackieren/, { tuerenAusAufnahme: 4 })).toBe(4)
  })

  it('das gesprochene Wort schlägt die Aufnahme — „zwei" bleibt zwei', () => {
    // Die Aufnahme ist der Bestand, der Satz ist der Auftrag. Wer zwei Türen
    // bestellt, bekommt keine vier ins Angebot geschrieben.
    expect(menge('Die zwei Türen lackieren.', /Türen lackieren/, { tuerenAusAufnahme: 4 })).toBe(2)
  })

  it('ohne Aufnahme bleibt es beim bisherigen Verhalten', () => {
    expect(menge('Die Innentüren lackieren.', /Türen lackieren/)).toBe(1)
  })

  it('die Zimmer-Annahme bleibt Annahme und steht weiter dabei', () => {
    const p = lauf('Drei Zimmer, Türen lackieren.').find(x => /Türen lackieren/.test(x.beschreibung))
    expect(p?.menge).toBe(3)
    expect(p?.annahmen.join(' ')).toMatch(/angenommen/)
  })

  it('kommt die Zahl aus der Aufnahme, ist sie KEINE Annahme', () => {
    const p = lauf('Die Innentüren lackieren.', { tuerenAusAufnahme: 4 })
      .find(x => /Türen abschleifen/.test(x.beschreibung))
    expect(p?.annahmen).toEqual([])
    expect(p?.berechnungsweg).toMatch(/Aufnahme/)
  })

  it('alle fünf Tür-Positionen tragen dieselbe Menge', () => {
    const mengen = lauf('Die Innentüren lackieren.', { tuerenAusAufnahme: 4 })
      .filter(p => /Tür|Zarge/i.test(p.beschreibung))
      .map(p => p.menge)
    expect(mengen.length).toBeGreaterThanOrEqual(4)
    expect(new Set(mengen)).toEqual(new Set([4]))
  })
})

describe('Fenster lackieren — dieselbe Reihenfolge', () => {
  it('ohne Zahl im Satz zählt die Aufnahme', () => {
    expect(menge('Die Fenster lackieren.', /Fenster lackieren/, { fensterAusAufnahme: 3 })).toBe(3)
  })

  it('das gesprochene Wort schlägt die Aufnahme', () => {
    expect(menge('Die zwei Fenster lackieren.', /Fenster lackieren/, { fensterAusAufnahme: 5 })).toBe(2)
  })

  it('ohne Aufnahme bleibt es beim bisherigen Verhalten', () => {
    expect(menge('Die Fenster lackieren.', /Fenster lackieren/)).toBe(1)
  })
})

describe('Sperrklinke: die Zahl kommt auf dem ECHTEN Weg an', () => {
  // Kein von Hand gebautes `meta`. Nur Transkript + Aufnahme, wie im Betrieb.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raum = (extra: any = {}) => ({
    name: 'Wohnzimmer', laenge: 5, breite: 4, hoehe: 2.5, flaeche: 20, umfang: 18,
    fenster: [], tueren: [], arbeiten: ['streichen', 'lackieren'],
    altbelag_entfernen: false, altbelag_vorhanden: false, sockelleisten: false,
    nassbereich: false, ausgleich: false, ...extra,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const durchLauf = (transkript: string, raeume: any[]) =>
    verarbeiteExtraktion(transkript, { result: { gewerk: 'maler', raeume, transkript } } as never)
      .mengen.positionen

  const TEXT = 'Im Wohnzimmer die Wände und die Decke streichen, die Innentüren lackieren.'

  it('vier Türen in der Aufnahme, keine Zahl im Satz → vier im Angebot', () => {
    const p = durchLauf(TEXT, [raum({ tueren: [{ anzahl: 4 }] })])
      .filter(x => /Türen lackieren/.test(x.beschreibung))
    expect(p).toHaveLength(1)
    expect(p[0].menge).toBe(4)
  })

  it('angenommene Türen in der Aufnahme tragen weiterhin keine Menge', () => {
    const p = durchLauf(TEXT, [raum({ tueren: [{ anzahl: 4, annahme: true }] })])
      .filter(x => /Türen lackieren/.test(x.beschreibung))
    expect(p).toHaveLength(1)
    expect(p[0].menge).toBe(1)
  })
})
