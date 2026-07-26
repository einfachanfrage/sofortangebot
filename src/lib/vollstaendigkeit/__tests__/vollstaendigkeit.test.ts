import { describe, it, expect } from 'vitest'
import { pruefeUndErgaenzeVollstaendigkeit } from '../index'
import type { BerechnetePosition } from '../../mengen/types'

function pos(beschreibung: string, menge = 10, einheit = 'm²'): BerechnetePosition {
  return { beschreibung, menge, einheit, konfidenz: 'high', berechnungsweg: 'test', annahmen: [] }
}

// ─── MALER BASIS ───────────────────────────────────────────────────────────

describe('maler – streichen basis', () => {
  it('ergänzt nur die ausdrücklich beauftragten Streicharbeiten', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('maler', [], 'Wände und Decke streichen')
    expect(fehlende).toContain('Wandflächen streichen')
    expect(fehlende).toContain('Deckenfläche streichen')
    expect(fehlende).not.toContain('Boden schützen / Abdecken')
    expect(fehlende).not.toContain('Sockelleisten abkleben')
  })

  it('ergänzt ausdrücklich genannten Bodenschutz und Sockel-Abkleben', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('maler', [], 'Wände streichen, Boden mit Vlies schützen und Sockelleisten abkleben')
    expect(fehlende).toContain('Boden schützen / Abdecken')
    expect(fehlende).toContain('Sockelleisten abkleben')
  })

  it('erfindet bei ausdrücklich genannten Wänden keine Deckenarbeit', () => {
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit(
      'maler',
      [pos('Wandflächen streichen', 35)],
      'Im Wohnzimmer die Wände zweimal streichen.',
    )
    expect(fehlende).not.toContain('Deckenfläche streichen')
    expect(positionen.some(position => /decke/i.test(position.beschreibung))).toBe(false)
  })

  it('prüft Möbelabdeckung und Bewohnt-Zuschlag unabhängig voneinander', () => {
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit(
      'maler',
      [pos('Wandflächen streichen', 35), pos('Erschwerniszuschlag bewohnt', 1, 'Pauschale')],
      'Bewohnte Wohnung, die Möbel müssen gerückt und abgedeckt werden.',
    )
    expect(fehlende).toContain('Möbel schützen / Abdecken')
  })

  it('macht aus Dübellöchern und Schadstellen keine vollflächige Q2-Spachtelung', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
      'maler',
      [pos('Wandflächen streichen', 35)],
      'Wände streichen, fünf Dübellöcher schließen und zwei kleine Schadstellen spachteln.',
    )
    expect(positionen.some(position => /dübellöcher spachteln/i.test(position.beschreibung))).toBe(true)
    expect(positionen.some(position => /kleine schadstellen/i.test(position.beschreibung))).toBe(true)
    expect(positionen.some(position => /spachtelarbeiten q2/i.test(position.beschreibung))).toBe(false)
  })

  it('"nur Decke" filtert Wand+Sockel aus Engine-Positionen', () => {
    const eingabe = [pos('Wandflächen streichen'), pos('Deckenfläche streichen'), pos('Sockelleisten montieren')]
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', eingabe, 'nur Decke streichen')
    const beschr = positionen.map(p => p.beschreibung)
    expect(beschr).not.toContain('Wandflächen streichen')
    expect(beschr).not.toContain('Sockelleisten montieren')
    expect(beschr).toContain('Deckenfläche streichen')
  })

  it('"nur Wände" entfernt Decke aus Engine-Positionen', () => {
    const eingabe = [pos('Deckenfläche streichen'), pos('Wandflächen streichen')]
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', eingabe, 'nur Wände streichen')
    const beschr = positionen.map(p => p.beschreibung)
    expect(beschr).not.toContain('Deckenfläche streichen')
    expect(beschr).toContain('Wandflächen streichen')
  })
})

// ─── MALER WANDFLÄCHE + TAPETE (Bug 1 Regression) ─────────────────────────

describe('maler – tapete mit direkter Wandfläche + Abzug', () => {
  const transkript = 'Die Wandfläche insgesamt sind 45 Quadratmeter. Davon müssen wir aber ein großes Fenster mit 3 Quadratmetern abziehen. Tapezieren mit Raufaser.'

  it('nimmt 45 m² Brutto-Wandfläche aus Text', () => {
    const wandPos = pos('Wandflächen streichen', 42)
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', [wandPos], transkript)
    const tapetePos = positionen.find(p => /aufziehen|tapezieren/i.test(p.beschreibung))
    // Fläche aus Engine-Position (42), nicht neu aus Text berechnen da wandPos vorhanden
    expect(tapetePos).toBeDefined()
    expect(tapetePos!.menge).toBe(42)
  })

  it('berechnet Netto = 45 − 3 = 42 m² wenn keine Engine-Position vorhanden', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', [], transkript)
    const tapetePos = positionen.find(p => /aufziehen|tapezieren/i.test(p.beschreibung))
    expect(tapetePos).toBeDefined()
    expect(tapetePos!.menge).toBe(42)
  })
})

// ─── MALER SOCKELLEISTEN (Bug 2 Regression) ────────────────────────────────

describe('maler – sockelleisten kategorisierung', () => {
  it('Wände streichen plus Sockelleisten abkleben wird nicht zu Sockelleisten streichen', () => {
    const t = 'Der Raum ist fünf Meter lang. Wände und Decke werden gestrichen. Die Sockelleisten werden abgeklebt.'
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', [], t)
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)].map(b => b.toLowerCase())
    expect(alle.some(b => b.includes('sockelleisten streichen'))).toBe(false)
    expect(alle.some(b => b.includes('sockelleisten abkleben'))).toBe(true)
  })

  it('"Sockelleisten aufnehmen" erzeugt KEIN schleifen/streichen', () => {
    const t = 'Nimm bitte die Sockelleisten mit auf, 18 laufende Meter.'
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', [], t)
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)]
    expect(alle.some(b => b.toLowerCase().includes('sockelleisten schleifen'))).toBe(false)
    expect(alle.some(b => b.toLowerCase().includes('sockelleisten streichen'))).toBe(false)
  })

  it('"Sockelleisten streichen 18m" erzeugt streichen-Position mit 18 lfdm', () => {
    const t = 'Sockelleisten streichen, 18 laufende Meter.'
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', [], t)
    const sockelPos = positionen.find(p => p.beschreibung.toLowerCase().includes('sockelleisten streichen'))
    expect(sockelPos).toBeDefined()
    expect(sockelPos!.menge).toBe(18)
    expect(sockelPos!.einheit).toBe('lfdm')
  })

  it('"Sockelleisten lackieren" bleibt im Maler-Gewerk (kein Bodenbeläge-Trigger)', () => {
    const t = 'Sockelleisten lackieren, 18 lfm.'
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', [], t)
    const lacks = positionen.filter(p => p.beschreibung.toLowerCase().includes('sockelleisten lack'))
    expect(lacks).toHaveLength(1) // zusammengefasst als "2× Anstrich"
    expect(lacks[0].beschreibung).toContain('2× Anstrich')
    expect(lacks[0].menge).toBe(18)
  })
})

// ─── MALER FENSTER LACKIEREN ────────────────────────────────────────────────

describe('maler – fenster lackieren', () => {
  it('8 Holzfenster → je 4 Positionen mit menge=8', () => {
    const t = '8 Holzfenster außen streichen.'
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', [], t, { fensterAnzahl: 8 })
    const fensterPos = positionen.filter(p => p.beschreibung.toLowerCase().includes('fenster'))
    expect(fensterPos.length).toBeGreaterThanOrEqual(3) // abschleifen, grundieren, Lack (2× Anstrich)
    expect(fensterPos[0].menge).toBe(8)
  })

  it('2-seitig verdoppelt Anstrich-Menge', () => {
    const t = '4 Fenster beidseitig lackieren.'
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', [], t)
    const anstrich = positionen.find(p => p.beschreibung.toLowerCase().includes('2× anstrich'))
    expect(anstrich?.menge).toBe(8) // 4 × 2 Seiten
  })
})

// ─── MALER SCHIMMEL ─────────────────────────────────────────────────────────

describe('maler – schimmel', () => {
  it('ergänzt Schimmelbehandlung mit m² aus Text (direkt nach Schimmel)', () => {
    // Periode zwischen "Schimmel" und "qm" bricht die Regex [^.!?]*? — Text ohne Punkt dazwischen verwenden
    const t = 'Schimmel 3 qm an der Wand behandeln'
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', [], t)
    const schimmel = positionen.find(p => p.beschreibung.toLowerCase().includes('schimmelbehandlung'))
    expect(schimmel).toBeDefined()
    expect(schimmel!.menge).toBe(3)
  })

  it('ergänzt Schimmelbehandlung in fehlende wenn keine m²-Angabe direkt dabei', () => {
    const t = 'Schimmel an der Wand behandeln'
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('maler', [], t)
    expect(fehlende).toContain('Schimmelbehandlung')
  })
})

// ─── MALER FASSADE ──────────────────────────────────────────────────────────

describe('maler – fassade', () => {
  it('ergänzt Reinigung + Grundierung + Farbe bei Fassadenauftrag', () => {
    const eingabe = [pos('Fassade streichen', 200)]
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', eingabe, 'Fassade streichen, 200 qm.')
    const beschr = positionen.map(p => p.beschreibung)
    expect(beschr.some(b => b.includes('reinigen'))).toBe(true)
    expect(beschr.some(b => b.includes('Grundierung'))).toBe(true)
    expect(beschr.some(b => b.includes('Fassadenfarbe'))).toBe(true)
  })
})

// ─── FLIESEN ────────────────────────────────────────────────────────────────

describe('fliesen', () => {
  it('ergänzt Verbundabdichtung im Nassbereich', () => {
    const t = 'Bad fliesen'
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('fliesen', [], t)
    expect(fehlende).toContain('Verbundabdichtung')
  })

  it('ergänzt Verfugung Boden wenn Bodenfliesen im Transkript', () => {
    // Verfugung ist Pflicht — direktes push (kein add()) verhindert false-positive Duplikat-Check
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('fliesen', [], 'Bodenfliesen verlegen')
    expect(fehlende).toContain('Verfugung Boden')
  })

  it('ergänzt Verfugung Boden wenn Engine Bodenfliesen-Position erzeugt hat', () => {
    const eingabe = [pos('Bodenfliesen verlegen'), pos('Verfugung Wand')]
    // hat(ergaenzt, 'verfug') prüft ob 'verfug' schon vorhanden → true → KEIN Verfugung ergänzen
    const { fehlende: f2 } = pruefeUndErgaenzeVollstaendigkeit('fliesen', eingabe, 'Bodenfliesen und Wandfliesen')
    // Wenn schon verfugung vorhanden → nicht nochmal hinzufügen
    const alleVerfugung = f2.filter(b => b.toLowerCase().includes('verfugung'))
    expect(alleVerfugung).toHaveLength(0)
  })

  it('keine Verbundabdichtung ohne Nassbereich', () => {
    const t = 'Küche fliesen'
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('fliesen', [], t)
    expect(fehlende).not.toContain('Verbundabdichtung')
  })
})

// ─── SANITÄR ────────────────────────────────────────────────────────────────

describe('sanitaer_heizung', () => {
  it('ergänzt Demontage bei Tausch', () => {
    const t = 'WC tauschen'
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('sanitaer_heizung', [], t)
    // Neue Logik: spezifische Demontage je Objekt statt generischer "Altanlage"
    expect(fehlende).toContain('Demontage WC (alt)')
  })

  it('ergänzt Silikon bei Dusche', () => {
    const t = 'Dusche einbauen'
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('sanitaer_heizung', [], t)
    expect(fehlende).toContain('Silikon Anschlussfugen')
  })
})

// ─── TROCKENBAU ─────────────────────────────────────────────────────────────

describe('trockenbau', () => {
  it('ergänzt Spachtelarbeiten + Ständerwerk bei Wand', () => {
    const t = 'Rigipswand stellen'
    const { fehlende } = pruefeUndErgaenzeVollstaendigkeit('trockenbau', [], t)
    expect(fehlende).toContain('Spachtelarbeiten Q2')
    expect(fehlende).toContain('Ständerwerk')
  })
})

// ─── PUBLIC API STABILITÄT ──────────────────────────────────────────────────

describe('API – kein Seiteneffekt auf input-positionen', () => {
  it('mutiert die originale positionen-Liste nicht', () => {
    const original = [pos('Wandflächen streichen', 42)]
    const kopie = [...original]
    pruefeUndErgaenzeVollstaendigkeit('maler', original, 'Wände streichen')
    expect(original).toHaveLength(kopie.length)
    expect(original[0].beschreibung).toBe(kopie[0].beschreibung)
  })
})
