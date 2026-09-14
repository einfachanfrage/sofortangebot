import { describe, it, expect } from 'vitest'
import {
  TAETIGKEITEN,
  taetigkeitenAusGewerken,
  taetigkeitFuerKategorie,
  materialStandard,
  vorlagenFuerTaetigkeiten,
} from '../taetigkeiten'
import { materialWort, ENTSCHIEDENE_GEWERKE } from '../materialanteil'
import { DEFAULT_PRICES } from '../default-prices'
import { GEWERK_PREISE } from '../preise-vorlagen'

// CoS-E-053 Schritt 4. Manfred: „Innen, Fassade, Boden, vielleicht Lack. Ein
// Bildschirm, vier Haken, jeder mit dem Material-Standard dran."

describe('Manfreds Tabelle ist der Maßstab', () => {
  // Wörtlich: Innen (Wand, Decke, Lack, Vlies) → Material DRIN.
  //           Fassade → getrennt.  Boden → getrennt.
  it.each([
    ['Maler – Anstrich Innen', 'drin'],
    ['Maler – Tapezieren', 'drin'],
    ['Maler – Lackierarbeiten', 'drin'],
    ['Maler – Anstrich Außen', 'getrennt'],
    ['Fassade – WDVS', 'getrennt'],
    ['Boden – Parkett', 'getrennt'],
    ['Boden – Laminat', 'getrennt'],
    ['Fliesen – Naturstein', 'getrennt'],
  ])('%s → %s', (kategorie, soll) => {
    expect(materialStandard(kategorie)).toBe(soll)
  })

  it('Vlies erbt von Innen — das war mein eigener Fehler in Fassung 3', () => {
    // In Fassung 3 stand „Tapezieren · ohne Tapete". Manfred zählt Vlies aber
    // unter „Innen … Material drin" auf. Sein Vlies-Beispiel in §4.6 war der
    // seltene Fall, für den er ausdrücklich KEINE eigene Ebene wollte.
    expect(materialStandard('Maler – Tapezieren')).toBe('drin')
  })

  it('der Betrieb kann jeden Standard umstellen', () => {
    expect(materialStandard('Maler – Anstrich Innen', { maler_innen: 'getrennt' })).toBe('getrennt')
    expect(materialStandard('Boden – Parkett', { boden: 'drin' })).toBe('drin')
  })

  it('außerhalb der entschiedenen Gewerke gibt es keinen Standard', () => {
    expect(materialStandard('Garten – Pflaster & Wege')).toBeNull()
    expect(materialStandard('Elektro – Leitungen & Kabel')).toBeNull()
    expect(materialStandard(null)).toBeNull()
  })
})

describe('Die längere Rubrik gewinnt', () => {
  it('„Maler – Anstrich Außen" ist Fassade, nicht Innen', () => {
    expect(taetigkeitFuerKategorie('Maler – Anstrich Außen')!.id).toBe('fassade')
    expect(taetigkeitFuerKategorie('Maler – Anstrich Innen')!.id).toBe('maler_innen')
  })
})

describe('Bestandsbetriebe verlieren nichts', () => {
  it('wer „maler" gewählt hatte, behält Innen, Tapezieren, Lack und Fassade', () => {
    expect(taetigkeitenAusGewerken(['maler']))
      .toEqual(['maler_innen', 'tapezieren', 'lackieren', 'fassade'])
  })

  it('boden_parkett wird Boden', () => {
    expect(taetigkeitenAusGewerken(['boden_parkett'])).toEqual(['boden'])
  })

  it('beides zusammen, ohne Dopplung und in fester Reihenfolge', () => {
    expect(taetigkeitenAusGewerken(['maler', 'boden_parkett', 'fassade']))
      .toEqual(['maler_innen', 'tapezieren', 'lackieren', 'fassade', 'boden'])
  })

  it('leer bleibt leer', () => {
    expect(taetigkeitenAusGewerken([])).toEqual([])
    expect(taetigkeitenAusGewerken(null)).toEqual([])
  })
})

describe('Die Vorlagenschlüssel gibt es wirklich', () => {
  it('jeder Schlüssel einer Tätigkeit existiert in GEWERK_PREISE', () => {
    // Genau dieser Abgleich war CoS-E-052: `maler` zeigte auf einen Schlüssel,
    // den es nicht gab, und niemand hat es gemerkt.
    for (const t of TAETIGKEITEN) {
      for (const schluessel of t.vorlagen) {
        expect(GEWERK_PREISE[schluessel], `${t.id} → ${schluessel}`).toBeDefined()
        expect(GEWERK_PREISE[schluessel].length).toBeGreaterThan(0)
      }
    }
  })

  it('ein reiner Innen-Maler bekommt keine Fassadenzeilen mehr', () => {
    expect(vorlagenFuerTaetigkeiten(['maler_innen'])).toEqual(['malerarbeiten'])
    expect(vorlagenFuerTaetigkeiten(['maler_innen'])).not.toContain('maler_fassade')
    // Vorher, über `maler`, waren es 41 Fassadenzeilen zusätzlich.
    expect(GEWERK_PREISE['maler_fassade'].length).toBeGreaterThan(30)
  })

  it('Innen und Lack teilen sich einen Schlüssel — ohne ihn doppelt zu liefern', () => {
    expect(vorlagenFuerTaetigkeiten(['maler_innen', 'tapezieren', 'lackieren']))
      .toEqual(['malerarbeiten'])
  })
})

describe('Tätigkeiten und Materialschalter decken sich', () => {
  it('jede Position mit Schalter gehört zu genau einer Tätigkeit', () => {
    const ohneTaetigkeit = DEFAULT_PRICES
      .filter(p => materialWort(p.title, p.category) !== null)
      .filter(p => taetigkeitFuerKategorie(p.category) === null)
      .map(p => p.category)

    expect([...new Set(ohneTaetigkeit)]).toEqual([])
  })

  it('und umgekehrt: keine Tätigkeit liegt außerhalb der entschiedenen Gewerke', () => {
    for (const t of TAETIGKEITEN) {
      for (const kategorie of t.kategorien) {
        expect(ENTSCHIEDENE_GEWERKE.test(kategorie), `${t.id}: ${kategorie}`).toBe(true)
      }
    }
  })
})
