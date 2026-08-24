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

  // PM-019 (2026-08-21): echter Live-Fund. Das Fachwissen kennt drei
  // gleichwertige Erschwernis-Trigger (Höhe, Altbau, schwieriger Untergrund) —
  // nur die ersten beiden hatten eine Erkennung. "Der Putz ist total uneben
  // und bröckelig, ein wirklich schwieriger Untergrund" blieb bisher
  // komplett unerkannt, weder auf der Karte noch im Entwurf.
  it('erkennt "schwieriger Untergrund" als eigenen Erschwerniszuschlag — PM-019', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
      'maler',
      [pos('Wandflächen streichen', 14.91)],
      'Gästeklo, Wände streichen, zweimal. Der Putz ist aber total uneben und bröckelig, ' +
      'ein wirklich schwieriger Untergrund, das wird aufwendiger als normal.',
    )
    expect(positionen.some(p => /erschwerniszuschlag.*untergrund/i.test(p.beschreibung))).toBe(true)
  })

  it('erfindet keinen Untergrund-Zuschlag ohne entsprechenden Hinweis', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
      'maler',
      [pos('Wandflächen streichen', 14.91)],
      'Gästeklo, Wände streichen, zweimal. Eine Tür, kein Fenster.',
    )
    expect(positionen.some(p => /erschwerniszuschlag.*untergrund/i.test(p.beschreibung))).toBe(false)
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

  // PM-011, Nachtest (2026-08-17/19/20): echter Live-Fund. "...nicht nur ne
  // kleine Ausbesserung, wirklich die ganze Fläche" hat trotzdem eine eigene
  // Kleinreparatur-Stückposition ("Risse / Löcher spachteln") erzeugt — der
  // Nutzer hat die Kleinreparatur-Einordnung ausdrücklich verneint. Gegenprobe
  // zum Test oben: dort ist "kleine Schadstellen" echt gemeint (kein
  // "kein[e]"/"nicht nur" davor), hier ist sie ausdrücklich ausgeschlossen.
  it('erfindet keine Kleinreparatur-Position, wenn der Nutzer die volle Fläche verlangt (PM-011)', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
      'maler',
      [pos('Wandflächen streichen', 32.91)],
      'Die Wände sind ordentlich uneben — die müssen komplett gespachtelt werden, Qualitätsstufe Q2, ' +
      'nicht nur ne kleine Ausbesserung, wirklich die ganze Fläche. Danach zweimal streichen.',
    )
    expect(positionen.some(position => /risse\s*\/\s*löcher spachteln|kleine schadstellen/i.test(position.beschreibung))).toBe(false)
    expect(positionen.some(position => /dübellöcher spachteln/i.test(position.beschreibung))).toBe(false)
    expect(positionen.some(position => /spachtelarbeiten q2/i.test(position.beschreibung))).toBe(true)
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

  // PM-001-Nebenfund (2026-08-20, gefunden beim Bauen des Aufnahmekarten-Fixes):
  // "abdecken"/"abdeckfolie" enthält selbst die Zeichenkette "decke"
  // (ab-DECKE-n) — der "nur Wände"-Scope-Filter hat jede Boden-schützen-
  // Position deshalb wieder rausgeworfen, OBWOHL eine extra Ausnahme dafür im
  // Code stand (die Ausnahme griff nur für den zweiten Teil der Bedingung,
  // nicht für die "kein decke"-Prüfung selbst). Betraf die reguläre, bepreiste
  // Kalkulation, nicht nur eine Vorschau — "nur Wände streichen" ist der
  // Alltagsfall bei einem reinen Wandanstrich.
  it('"nur Wände" behält Boden schützen / Abdecken trotz der "decke"-Zeichenkette in "abdecken" (PM-001-Nebenfund)', () => {
    const eingabe = [pos('Wandflächen streichen'), pos('Boden schützen / Abdecken', 0)]
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', eingabe, 'nur Wände streichen, Boden vorher abdecken')
    const beschr = positionen.map(p => p.beschreibung)
    expect(beschr).toContain('Boden schützen / Abdecken')
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

  // PM-010: "Sockelleisten [Details]. Die sollen dann auch noch gestrichen
  // werden." — Partizip "gestrichen" über einen Satz hinweg, verbunden per
  // Bezugswort "die". Vorher komplett übersehen (zwei Lücken: Partizip nicht
  // erkannt + Satzgrenze).
  it('PM-010: "Die sollen dann auch noch gestrichen werden" (Satzgrenze) → Sockelleisten streichen erkannt', () => {
    const t = 'Die alten Sockelleisten kommen raus, neue werden montiert, weiße MDF-Leisten. Die sollen dann auch noch gestrichen werden, passend zur Wand. Wände und Decke streichen, zweimal.'
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', [], t)
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)].map(b => b.toLowerCase())
    expect(alle.some(b => b.includes('sockelleisten streichen'))).toBe(true)
  })

  // Gegen-Test: "montiert" UND "gestrichen" kommen beide im Text vor (wie bei
  // PM-010), aber diesmal mit einer echten Verneinung — darf NIE als Ja
  // zählen, sonst reproduzieren wir den gerade erst gefixten
  // "Tool erfindet Position"-Fehler an anderer Stelle.
  it('PM-002: "nicht gestrichen, nur montiert" → KEINE Sockelleisten-Streichen-Position', () => {
    const t = 'Drei Wände weiß streichen, zweimal. Sockelleisten werden neu montiert, nicht gestrichen, nur montiert.'
    const { fehlende, positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', [], t)
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)].map(b => b.toLowerCase())
    expect(alle.some(b => b.includes('sockelleisten streichen'))).toBe(false)
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
  it('ergänzt Grundierung + Farbe bei Fassadenauftrag', () => {
    const eingabe = [pos('Fassade streichen', 200)]
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', eingabe, 'Fassade streichen, 200 qm.')
    const beschr = positionen.map(p => p.beschreibung)
    expect(beschr.some(b => b.includes('Grundierung'))).toBe(true)
    expect(beschr.some(b => b.includes('Fassadenfarbe'))).toBe(true)
  })

  // PM-008-Nachtest: "Fassade reinigen" kam bisher ungefragt bei JEDEM
  // Fassadenauftrag dazu (334,80 € Beispiel), egal ob von Schmutz/Verschmutzung
  // je die Rede war — gleiches Muster wie PM-003 (nichts erfinden, was nicht
  // gesagt wurde). Jetzt nur noch bei echtem Signal (Schmutz, Algen, Risse …).
  it('ergänzt KEINE Reinigung ohne Schmutz-/Reinigungs-Signal', () => {
    const eingabe = [pos('Fassade streichen', 200)]
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', eingabe, 'Fassade streichen, 200 qm.')
    const beschr = positionen.map(p => p.beschreibung)
    expect(beschr.some(b => b.includes('reinigen'))).toBe(false)
  })

  it('ergänzt Reinigung, wenn Schmutz/Algen/Moos explizit genannt sind', () => {
    const eingabe = [pos('Fassade streichen', 200)]
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', eingabe, 'Fassade streichen, 200 qm, viel Algen und Moos dran.')
    const beschr = positionen.map(p => p.beschreibung)
    expect(beschr.some(b => b.includes('reinigen'))).toBe(true)
  })
})

// ─── BALKON ─────────────────────────────────────────────────────────────────

describe('maler – balkon (PM-021)', () => {
  // PM-021, Live-Nachtest 2026-08-21: `lower.includes('terrasse')` fing auch
  // "Terrassentür"/"Breitterrassentür" (reine Türbezeichnung, kein eigener
  // Ort) — hat einen kompletten Phantom-Workflow ausgelöst ("Balkonboden
  // streichen", Menge = Fläche des Raums selbst). Siehe golden-korrekturen.
  // test.ts für den vollen End-to-End-Fall mit echten Produktionsdaten.
  it('erfindet KEINEN Balkon bei "Terrassentür" (nur Türbezeichnung, kein eigener Ort)', () => {
    const eingabe = [pos('Wandflächen streichen', 40), pos('Boden schützen', 30)]
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
      'maler', eingabe,
      'Wohnküche, Wände streichen. Eine Terrassentür, zwei Meter breit.',
    )
    const beschr = positionen.map(p => p.beschreibung.toLowerCase())
    expect(beschr.some(b => b.includes('balkon') || b.includes('terrasse'))).toBe(false)
  })

  it('erfindet KEINEN Balkon bei "Balkontür" (direkte Zusammensetzung, kein eigener Ort)', () => {
    const eingabe = [pos('Wandflächen streichen', 40), pos('Boden schützen', 30)]
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
      'maler', eingabe,
      'Wohnzimmer, Wände streichen. Eine Balkontür, normal breit.',
    )
    const beschr = positionen.map(p => p.beschreibung.toLowerCase())
    expect(beschr.some(b => b.includes('balkon'))).toBe(false)
  })

  it('ergänzt weiterhin Balkonboden, wenn der Balkon selbst als eigener Ort erwähnt wird', () => {
    const eingabe = [pos('Boden schützen', 12)]
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
      'maler', eingabe,
      'Der Balkon soll auch gestrichen werden, Boden mit inklusive.',
    )
    const beschr = positionen.map(p => p.beschreibung.toLowerCase())
    expect(beschr.some(b => b.includes('balkonboden'))).toBe(true)
  })

  it('ergänzt weiterhin Balkonboden bei echter Wortzusammensetzung ("Balkonboden")', () => {
    const eingabe = [pos('Boden schützen', 12)]
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
      'maler', eingabe,
      'Der Balkonboden soll auch gestrichen werden.',
    )
    const beschr = positionen.map(p => p.beschreibung.toLowerCase())
    expect(beschr.some(b => b.includes('balkonboden'))).toBe(true)
  })
})

// ─── DACHSCHRÄGE ────────────────────────────────────────────────────────────

describe('maler – dachschräge', () => {
  // PM-007, zweiter Live-Nachtest: "Dachschräge spachteln / Untergrund-
  // vorbereitung" (0 €, unbepreist) kam bisher ungefragt bei JEDER
  // Dachschräge dazu — dieselbe Fehlerfamilie wie die schon gefixte
  // Grundierung, nur eine dritte Fundstelle. Jetzt nur bei echtem Signal.
  it('ergänzt KEIN Spachteln ohne Ausbesserungs-Signal', () => {
    const eingabe = [pos('Dachschrägen streichen 2x — Dachzimmer', 23.08)]
    const { positionen, fehlende } = pruefeUndErgaenzeVollstaendigkeit('maler', eingabe, 'Dachschrägen streichen, 23 qm, zweimal.')
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)]
    expect(alle.some(b => b.toLowerCase().includes('spachtel'))).toBe(false)
  })

  it('ergänzt Spachteln, wenn Risse/Löcher/uneben explizit genannt sind', () => {
    const eingabe = [pos('Dachschrägen streichen 2x — Dachzimmer', 23.08)]
    const { positionen, fehlende } = pruefeUndErgaenzeVollstaendigkeit('maler', eingabe, 'Dachschrägen streichen, 23 qm, ein paar Risse drin, bitte ausbessern.')
    const alle = [...fehlende, ...positionen.map(p => p.beschreibung)]
    expect(alle.some(b => b.toLowerCase().includes('spachtel'))).toBe(true)
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

// ─── DC-027 / CoS-017: "vom Tool ergänzt" vs. "gesagt" ─────────────────────
// Die Kennzeichnung wird bewusst an EINER zentralen Stelle gesetzt
// (Vorher/Nachher-Vergleich in index.ts), nicht an ~117 push-Fundstellen.
// Diese Tests sichern genau diese zentrale Stelle ab.

describe('DC-027 – Kennzeichnung automatisch ergänzter Positionen', () => {
  it('lässt vom Nutzer gesagte Positionen unmarkiert', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
      'maler',
      [pos('Wandflächen streichen', 35)],
      'Im Wohnzimmer die Wände zweimal streichen.',
    )
    const gesagt = positionen.find(p => p.beschreibung === 'Wandflächen streichen')
    expect(gesagt).toBeDefined()
    expect(gesagt?.automatisch_ergaenzt).toBeFalsy()
  })

  it('markiert eine vom Tool ergänzte Position als automatisch ergänzt', () => {
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit(
      'maler',
      [pos('Wandflächen streichen', 35)],
      'Im Wohnzimmer die Wände streichen, wir haben hohe Decken.',
    )
    const ergaenzt = positionen.find(p => /erschwerniszuschlag raumhöhe/i.test(p.beschreibung))
    expect(ergaenzt).toBeDefined()
    expect(ergaenzt?.automatisch_ergaenzt).toBe(true)
  })

  it('verliert eine bereits gesetzte Markierung im zweiten Durchlauf nicht', () => {
    // Mehrgewerk-Fall: die Prüfung läuft nacheinander für zwei Gewerke.
    const ersterLauf = pruefeUndErgaenzeVollstaendigkeit(
      'maler',
      [pos('Wandflächen streichen', 35)],
      'Im Wohnzimmer die Wände streichen, wir haben hohe Decken.',
    )
    const zweiterLauf = pruefeUndErgaenzeVollstaendigkeit(
      'boden_parkett',
      ersterLauf.positionen,
      'Im Wohnzimmer die Wände streichen, wir haben hohe Decken.',
    )
    const ergaenzt = zweiterLauf.positionen.find(p => /erschwerniszuschlag raumhöhe/i.test(p.beschreibung))
    expect(ergaenzt?.automatisch_ergaenzt).toBe(true)
    const gesagt = zweiterLauf.positionen.find(p => p.beschreibung === 'Wandflächen streichen')
    expect(gesagt?.automatisch_ergaenzt).toBeFalsy()
  })

  it('mutiert die übergebenen Original-Positionen nicht', () => {
    const original = [pos('Wandflächen streichen', 35)]
    pruefeUndErgaenzeVollstaendigkeit('maler', original, 'Wände streichen, hohe Decken.')
    expect(original[0].automatisch_ergaenzt).toBeUndefined()
  })
})
