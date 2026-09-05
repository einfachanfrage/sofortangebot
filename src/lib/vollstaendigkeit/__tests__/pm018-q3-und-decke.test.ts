import { describe, it, expect } from 'vitest'
import { pruefeUndErgaenzeVollstaendigkeit } from '../index'
import { positionsUntertitel } from '../../positions-untertitel'
import type { BerechnetePosition } from '../../mengen/types'

// ── PM-018, Nachtest 04.09.2026 ───────────────────────────────────────────
// „Alle acht Mengen exakt Soll" — und trotzdem 265,00 € zulasten des
// Betriebs, weil die Positionen „Q2" hießen. Im Diktat steht ausdrücklich
// „Qualitätsstufe Q3, weil später Streiflicht draufscheint".
//
// Die Ursache ist ein Komma: Die Prüfung stand auf `includes(' q3 ')` — mit
// Leerzeichen auf beiden Seiten. Nach dem Q3 kommt aber ein Komma. Zwei
// Zeilen weiter unten wurde im selben File längst mit Wortgrenzen geprüft.

const TEXT = 'arbeitszimmer 4x3,5, höhe 260, wände und decke komplett spachteln, '
  + 'qualitätsstufe q3, weil später streiflicht drauf scheint, danach beides einmal '
  + 'grundieren und zweimal streichen, eine tür normalmaß, ein fenster normale größe.'

const pos = (b: string, m: number): BerechnetePosition =>
  ({ beschreibung: b, menge: m, einheit: 'm²', konfidenz: 'high', berechnungsweg: `${m} m²`, annahmen: [] })

const lauf = (text: string) => pruefeUndErgaenzeVollstaendigkeit('maler', [
  pos('Wandflächen streichen 2x — Arbeitszimmer', 39),
  pos('Deckenfläche streichen 2x — Arbeitszimmer', 14),
], text).positionen

describe('PM-018 — die Qualitätsstufe überlebt das Komma', () => {
  it('„Qualitätsstufe Q3, weil…" ergibt Q3, nicht Q2', () => {
    const spachtel = lauf(TEXT).filter(p => /spachtelarbeiten/i.test(p.beschreibung))
    expect(spachtel).toHaveLength(2)
    for (const p of spachtel) expect(p.beschreibung).toContain('Q3')
  })

  for (const satz of ['q3, weil', 'q3. danach', 'q3 verlangt', '(q3)', 'stufe q4, weil']) {
    it(`Zeichensetzung ändert nichts: „${satz}"`, () => {
      const t = `wände und decke komplett spachteln, qualitätsstufe ${satz} später streiflicht`
      const stufe = satz.includes('q4') ? 'Q4' : 'Q3'
      const p = lauf(t).find(x => /spachtelarbeiten/i.test(x.beschreibung))
      expect(p?.beschreibung).toContain(stufe)
    })
  }

  it('ohne genannte Stufe bleibt Q2 — als sichtbare Annahme', () => {
    const p = lauf('wände und decke komplett spachteln, danach streichen')
      .find(x => /spachtelarbeiten/i.test(x.beschreibung))
    expect(p?.beschreibung).toContain('Q2')
    expect(p?.annahmen.join(' ')).toMatch(/Q2 angenommen/)
  })
})

describe('PM-018 — Wand und Decke sind zwei unterscheidbare Zeilen', () => {
  it('die Deckenzeile heißt auch so', () => {
    const namen = lauf(TEXT).filter(p => /spachtelarbeiten/i.test(p.beschreibung)).map(p => p.beschreibung)
    expect(namen).toEqual([
      'Spachtelarbeiten Q3 — Arbeitszimmer',
      'Spachtelarbeiten Q3 Decke — Arbeitszimmer',
    ])
    expect(new Set(namen).size).toBe(2)
  })

  it('die Mengen bleiben getrennt: Wand 39, Decke 14', () => {
    const p = lauf(TEXT).filter(x => /spachtelarbeiten/i.test(x.beschreibung))
    expect(p.map(x => x.menge)).toEqual([39, 14])
  })

  it('der Untertitel der Deckenzeile spricht von der Decke, nicht von Wänden', () => {
    expect(positionsUntertitel('Spachtelarbeiten Q3 Decke — Arbeitszimmer')).toMatch(/^Decke /)
    expect(positionsUntertitel('Spachtelarbeiten Q3 — Arbeitszimmer')).toMatch(/^Wände /)
  })
})

describe('PM-018 — „Vorschlag" gehört nur an Geratenes', () => {
  it('ausdrücklich verlangtes Spachteln ist kein Vorschlag', () => {
    const p = lauf(TEXT).filter(x => /spachtelarbeiten/i.test(x.beschreibung))
    for (const x of p) expect(x.automatisch_ergaenzt).toBe(false)
  })
})
