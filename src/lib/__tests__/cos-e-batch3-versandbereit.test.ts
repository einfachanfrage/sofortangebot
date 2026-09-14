// Batch 3 der Manfred-Tickets (11.09.2026) — was zwischen einem halbfertigen
// Angebot und dem Kunden steht.
//
// CoS-E-004/012/023/035: Gewarnt hat die App überall (roter Kasten, „Preis
// fehlt", leerer Empfängerblock), gehindert hat niemand. Manfreds Angebot mit
// „Boden schützen 0,00 €" ist rausgegangen und wurde als beauftragt markiert.
// CoS-E-041: Die Kleinmaterial-Pauschale war nie irgendwo eingehängt.
import { describe, it, expect } from 'vitest'
import { unbepreistePositionen, versandHindernisse, darfZumKunden } from '@/lib/versandbereit'
import {
  kleinmaterialPosition, anfahrtPosition,
  istPauschalZeile, pauschalZeilenNamen, MINDESTAUFTRAG_BEZEICHNUNG,
} from '@/lib/gewerke-config'

const bepreist = { title: 'Wandfläche streichen 2x', unit_price: 12.5, price_item_id: 'p1' }
const ohnePreis = { title: 'Boden schützen', unit_price: 0, price_item_id: null }
const kulanz = { title: 'Kleinreparatur', unit_price: 0, price_item_id: 'p2' }

describe('CoS-E-004/035 — unbepreiste Positionen', () => {
  it('findet die Position ohne Preis', () => {
    expect(unbepreistePositionen([bepreist, ohnePreis]).map(i => i.title)).toEqual(['Boden schützen'])
  })

  it('hält eine bewusste 0-€-Position aus der Preisliste NICHT für einen Fehler', () => {
    // Ein Handwerker darf etwas mit 0 € anbieten („mache ich mit") — dann
    // hängt die Zeile aber an einem echten Preiseintrag und ist eine
    // Entscheidung, kein Loch.
    expect(unbepreistePositionen([kulanz])).toEqual([])
  })
})

describe('CoS-E-012/023 — kein Kunde', () => {
  it('nennt den fehlenden Kunden als Hindernis', () => {
    const h = versandHindernisse({ hatKunden: false, items: [bepreist] })
    expect(h).toHaveLength(1)
    expect(h[0]).toContain('kein Kunde')
  })

  it('lässt ein fertiges Angebot durch', () => {
    expect(darfZumKunden({ hatKunden: true, items: [bepreist, kulanz] })).toBe(true)
  })
})

describe('Hindernisse sind Sätze, keine Fehlercodes', () => {
  it('nennt bei einer Position deren Namen', () => {
    const h = versandHindernisse({ hatKunden: true, items: [bepreist, ohnePreis] })
    expect(h[0]).toBe('Bei „Boden schützen" fehlt noch der Preis.')
  })

  it('fasst mehrere zusammen, ohne die Liste ausufern zu lassen', () => {
    const viele = ['A', 'B', 'C', 'D', 'E'].map(t => ({ title: t, unit_price: 0, price_item_id: null }))
    const h = versandHindernisse({ hatKunden: true, items: viele })
    expect(h[0]).toContain('„A", „B", „C"')
    expect(h[0]).toContain('und 2 weiteren')
  })

  it('meldet Kunde UND Preise, wenn beides fehlt', () => {
    expect(versandHindernisse({ hatKunden: false, items: [ohnePreis] })).toHaveLength(2)
  })
})

describe('CoS-E-041 — Kleinmaterial-Pauschale (TN-098)', () => {
  it('greift bei Manfreds 1.700-€-Angebot', () => {
    const p = kleinmaterialPosition('maler', 1700, null)
    expect(p).not.toBeNull()
    expect(p!.unit_price).toBe(25)
  })

  it('greift unterhalb der Schwelle nicht', () => {
    expect(kleinmaterialPosition('maler', 150, null)).toBeNull()
  })

  it('nimmt die Betriebseinstellung, nicht den Gewerk-Standard', () => {
    const p = kleinmaterialPosition('maler', 1700, { betrag_eur: 40, schwelle_eur: 500 })
    expect(p!.unit_price).toBe(40)
    expect(kleinmaterialPosition('maler', 300, { schwelle_eur: 500 })).toBeNull()
  })

  it('bleibt aus, wenn der Betrieb sie abgeschaltet hat', () => {
    expect(kleinmaterialPosition('maler', 1700, { aktiv: false })).toBeNull()
  })

  it('An-/Abfahrt ist standardmäßig aus und kennt keine Schwelle', () => {
    expect(anfahrtPosition(null)).toBeNull()
    expect(anfahrtPosition({ aktiv: true })!.unit_price).toBe(45)
  })
})

describe('CoS-E-041 — Pauschalen zählen nicht in ihre eigene Grundlage', () => {
  const namen = pauschalZeilenNamen('maler', null, null)

  it('erkennt alle drei Pauschalzeilen', () => {
    expect(istPauschalZeile('Kleinmaterial und Verbrauchsmaterial', namen)).toBe(true)
    expect(istPauschalZeile('An- und Abfahrt', namen)).toBe(true)
    expect(istPauschalZeile(MINDESTAUFTRAG_BEZEICHNUNG, namen)).toBe(true)
  })

  it('verwechselt „Anfahrt & Vorbereitung" nicht mit „An- und Abfahrt"', () => {
    // Zwei verschiedene Zeilen mit ähnlichem Namen — eine Teilstring-Suche
    // auf „anfahrt" hätte sie über einen Kamm geschoren.
    expect(istPauschalZeile('Anfahrt & Vorbereitung', ['An- und Abfahrt'])).toBe(false)
  })

  it('hält eine echte Arbeitsposition nicht für eine Pauschale', () => {
    expect(istPauschalZeile('Anfahrtsweg absichern', namen)).toBe(false)
    expect(istPauschalZeile('Wandfläche streichen 2x', namen)).toBe(false)
  })

  it('ignoriert Groß-/Kleinschreibung und Leerzeichen', () => {
    expect(istPauschalZeile('  an- UND abfahrt  ', namen)).toBe(true)
  })

  it('gibt bei leerem Titel nichts zurück', () => {
    expect(istPauschalZeile('', namen)).toBe(false)
    expect(istPauschalZeile(null, namen)).toBe(false)
  })
})
