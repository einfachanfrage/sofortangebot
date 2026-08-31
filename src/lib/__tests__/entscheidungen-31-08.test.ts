// Sandys Sammel-Entscheidungen vom 2026-08-31 (docs/entscheidungen-fuer-sandy.md,
// CoS-025). Ein Test je entschiedenem Punkt, der Engineering-Arbeit ausgelöst
// hat — damit keiner davon still wieder zurückrutscht.
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  bemessungsgrundlage, euroJeProzentpunkt, istProzentZuschlag, istZuschlagsPosition,
  raumAusTitel, zuschlagBerechnungsweg, wendeProzentZuschlaegeAn,
  aktualisiereProzentZuschlaege, ZUSCHLAG_EINHEIT,
} from '../zuschlag-basis'
import { statusPatch, echterAusgang, tageBeimKunden } from '../status-uebergang'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { analysiereKontext } from '../kontext-analyzer'
import { normalisiereExtraktion } from '../mengen/extraktion-normalisierer'
import {
  pruefeErschwerniszuschlagHoehe, pruefeErschwerniszuschlagUntergrund, pruefeAltbau,
} from '../vollstaendigkeit/maler-extras'
import type { BerechnetePosition } from '../mengen/types'

// ── PM-008/PM-015: Erschwerniszuschlag = Prozent ────────────────────────────

describe('PM-008/PM-015 — Erschwerniszuschläge laufen in Prozent', () => {
  it('erzeugt die Zuschlagsposition mit Einheit % statt Pauschale', () => {
    const ergaenzt: BerechnetePosition[] = []
    pruefeErschwerniszuschlagHoehe(ergaenzt, 'büro streichen', [{ name: 'Büro', hoehe: 3.2 }])
    expect(ergaenzt).toHaveLength(1)
    expect(ergaenzt[0].beschreibung).toBe('Erschwerniszuschlag Raumhöhe > 3m — Büro')
    expect(ergaenzt[0].einheit).toBe('%')
  })

  it('findet damit endlich seinen Katalogpreis — vorher blockierte die Einheit jeden Treffer', () => {
    const katalog = DEFAULT_PRICES
      .filter(p => p.category.startsWith('Maler'))
      .map((p, i) => ({ id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price }))
    const treffer = findePreisposition('Erschwerniszuschlag Raumhöhe > 3m — Büro', ZUSCHLAG_EINHEIT, katalog)
    expect(treffer?.position.title).toBe('Erschwerniszuschlag Raumhöhe > 3m')
    expect(treffer?.position.unit_price).toBe(15)
  })

  it('verwechselt den Raumhöhen-Zuschlag nicht mit dem Gerüst-Zuschlag über 4 m', () => {
    const katalog = DEFAULT_PRICES
      .filter(p => p.category.startsWith('Maler'))
      .map((p, i) => ({ id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price }))
    const treffer = findePreisposition('Erschwerniszuschlag Altbau', ZUSCHLAG_EINHEIT, katalog)
    expect(treffer?.position.title).toBe('Erschwerniszuschlag Altbau')
  })

  it('rechnet den Zuschlag auf die Leistungen genau seines Raums, nicht auf das ganze Angebot', () => {
    const zeilen = [
      { title: 'Wandflächen streichen 2x — Büro', quantity: 57.6, unit: 'm²', unit_price: 9.5 },
      { title: 'Wandflächen streichen 2x — Küche', quantity: 40, unit: 'm²', unit_price: 9.5 },
      { title: 'Erschwerniszuschlag Raumhöhe > 3m — Büro', quantity: 15, unit: '%', unit_price: 0 },
    ]
    const basis = bemessungsgrundlage(zeilen, raumAusTitel('Erschwerniszuschlag Raumhöhe > 3m — Büro'))
    expect(basis).toBeCloseTo(547.2, 2)
    expect(euroJeProzentpunkt(basis)).toBe(5.47)
    // Menge × Einzelpreis = Gesamt — genau so rechnen PDF, Entwurf und quotes/create
    expect(15 * euroJeProzentpunkt(basis)).toBeCloseTo(82.05, 2)
  })

  it('nimmt ohne Raumbezug alle Leistungen — aber nie einen anderen Zuschlag', () => {
    const zeilen = [
      { title: 'Wandflächen streichen 2x', quantity: 10, unit: 'm²', unit_price: 10 },
      { title: 'Erschwerniszuschlag Altbau', quantity: 20, unit: '%', unit_price: 1 },
      { title: 'Erschwerniszuschlag bewohnt', quantity: 10, unit: '%', unit_price: 1 },
    ]
    expect(bemessungsgrundlage(zeilen, null)).toBe(100)
  })

  it('lässt auch eine alte Pauschal-Zuschlagszeile nicht in die Bemessungsgrundlage', () => {
    expect(istZuschlagsPosition('Erschwerniszuschlag Altbau', 'Pauschale')).toBe(true)
    expect(istZuschlagsPosition('Gerüst stellen und abbauen', 'Pauschale')).toBe(false)
    expect(istProzentZuschlag('%')).toBe(true)
  })

  it('schreibt den Rechenweg so hin, dass man ihn nachrechnen kann', () => {
    expect(zuschlagBerechnungsweg(15, 547.2, 'Büro')).toBe('15 % auf 547,20 € (Leistungen Büro)')
  })

  it('rechnet das ganze Angebot durch: zwei Räume, zwei Zuschläge, keine Kettenrechnung', () => {
    const items = [
      { title: 'Wandflächen streichen 2x — Büro', quantity: 57.6, unit: 'm²', unit_price: 9.5, berechnungsweg: null as string | null },
      { title: 'Wandflächen streichen 2x — Küche', quantity: 40, unit: 'm²', unit_price: 9.5, berechnungsweg: null as string | null },
      { title: 'Erschwerniszuschlag Raumhöhe > 3m — Büro', quantity: 1, unit: '%', unit_price: 15, berechnungsweg: 'Raumhöhe 3.2m > 3m' as string | null },
      { title: 'Erschwerniszuschlag Altbau', quantity: 1, unit: '%', unit_price: 20, berechnungsweg: null as string | null },
    ]
    wendeProzentZuschlaegeAn(items, () => true)

    const hoehe = items[2]
    expect(hoehe.quantity).toBe(15)
    expect(hoehe.unit_price).toBe(5.47)          // 547,20 € Büro / 100
    expect(hoehe.quantity * hoehe.unit_price).toBeCloseTo(82.05, 2)
    expect(hoehe.berechnungsweg).toBe('Raumhöhe 3.2m > 3m · 15 % auf 547,20 € (Leistungen Büro)')

    const altbau = items[3]
    expect(altbau.quantity).toBe(20)
    expect(altbau.unit_price).toBe(9.27)         // (547,20 + 380,00) / 100 — beide Räume
    // Der Höhen-Zuschlag darf die Grundlage des Altbau-Zuschlags nicht
    // aufblähen: kein Zuschlag auf Zuschlag.
    expect(altbau.berechnungsweg).toContain('auf 927,20 €')
  })

  it('lässt einen Zuschlag ohne Katalogpreis sichtbar bei 0,00 € stehen, statt einen Satz zu erfinden', () => {
    const items = [
      { title: 'Wandflächen streichen 2x — Büro', quantity: 10, unit: 'm²', unit_price: 10, berechnungsweg: null as string | null },
      { title: 'Erschwerniszuschlag Denkmalschutz', quantity: 1, unit: '%', unit_price: 0, berechnungsweg: null as string | null },
    ]
    wendeProzentZuschlaegeAn(items, index => index !== 1)
    expect(items[1].quantity).toBe(1)
    expect(items[1].unit_price).toBe(0)
  })

  it('ordnet Zuschläge auch im gemischten Angebot dem Maler zu (sonst 0,00 € wie bei „Boden schützen")', async () => {
    const { gewerkFuerPosition } = await import('@/app/api/angebot-generieren/route')
    expect(gewerkFuerPosition('Erschwerniszuschlag Raumhöhe > 3m — Büro', 'boden_parkett')).toBe('maler')
  })
})

// ── PM-011: zwei Erschwernisse dürfen nebeneinander stehen ──────────────────

describe('PM-011 — „schwieriger Untergrund" und „Altbau" schließen sich nicht aus', () => {
  it('erzeugt beide Zuschläge im selben Angebot', () => {
    const ergaenzt: BerechnetePosition[] = []
    const text = 'altbau, der untergrund ist schwierig, bröckeliger putz, wände q2 spachteln'
    pruefeErschwerniszuschlagUntergrund(ergaenzt, text)
    pruefeAltbau(ergaenzt, text)
    expect(ergaenzt.map(p => p.beschreibung)).toEqual([
      'Erschwerniszuschlag schwieriger Untergrund',
      'Erschwerniszuschlag Altbau',
    ])
    expect(ergaenzt.every(p => p.einheit === '%')).toBe(true)
  })
})

// ── DC-040-Folgefrage: Türen/Fenster auch bei einzelnen Räumen ──────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fragen(transkript: string, raeume: any[]): string[] {
  const roh = {
    gewerk: 'maler', confidence_gewerk: 0.95, kunde: { name: null, adresse: null, ort: null },
    raeume, waende: [], decken: [], bereiche: [], altbelag: [], erschwernisse: [],
    anmerkungen: null, fehlende_angaben: [], transkript,
  }
  const ext = analysiereKontext(normalisiereExtraktion(JSON.parse(JSON.stringify(roh)))).extraktion_angereichert
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return ((ext as any).rueckfragen ?? []).map((r: { frage: string }) => r.frage)
}

describe('DC-040-Folgefrage — Sandys Entscheidung 31.08.: auch bei einzelnen Räumen fragen', () => {
  it('fragt beim EINZELNEN Raum nach, wenn eine Wandfläche direkt genannt wurde', () => {
    const gestellt = fragen('Im Flur sind es 18 m² Wandfläche, die sollen zweimal gestrichen werden.', [{
      name: 'Flur', laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
      wandflaeche_direkt: 18, tueren: [], fenster: [], arbeiten: ['waende_streichen'],
    }])
    expect(gestellt.some(f => /18 m² Wandfläche in "Flur" inklusive Türen und Fenster/.test(f))).toBe(true)
  })

  it('fragt NICHT, wenn die Fläche aus Roh-Maßen selbst gerechnet wird', () => {
    const gestellt = fragen('Büro, 5 m mal 4 m, Höhe 2,50 m, Wände streichen.', [{
      name: 'Büro', laenge: 5, breite: 4, hoehe: 2.5, flaeche: 20, umfang: 18,
      tueren: [{ anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }], fenster: [],
      arbeiten: ['waende_streichen'],
    }])
    expect(gestellt.some(f => /inklusive Türen und Fenster/.test(f))).toBe(false)
  })

  it('fragt nicht noch einmal, wenn der Abzug selbst genannt wurde', () => {
    const gestellt = fragen('Im Flur 18 m² Wandfläche, minus 3 m² für die Türen, streichen.', [{
      name: 'Flur', laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
      wandflaeche_direkt: 18, wandflaeche_abzug_m2: 3, tueren: [], fenster: [],
      arbeiten: ['waende_streichen'],
    }])
    expect(gestellt.some(f => /inklusive Türen und Fenster/.test(f))).toBe(false)
  })
})

// ── DC-042: Status-Modell ───────────────────────────────────────────────────

describe('DC-042 — Status-Modell nach Sandys vier Entscheidungen', () => {
  it('Punkt 1: der tote „viewed"-Status kommt in keiner Filterabfrage mehr vor', () => {
    const wurzel = join(__dirname, '..', '..')
    for (const datei of ['data/quotes.ts', 'data/dashboard.ts']) {
      expect(readFileSync(join(wurzel, datei), 'utf-8')).not.toContain("'viewed'")
    }
  })

  it('Punkt 3: „Abgelehnt" kann den Grund tragen, ohne ihn zu erfinden', () => {
    expect(statusPatch('sent', 'rejected').abgelehnt_grund).toBeNull()
    expect(statusPatch('sent', 'rejected', { grund: 'aktiv' }).abgelehnt_grund).toBe('aktiv')
    expect(statusPatch('rejected', 'accepted').abgelehnt_grund).toBeNull()
  })

  it('Punkt 4: „Beim Kunden seit X Tagen" rechnet auf dem echten Versanddatum', () => {
    const jetzt = new Date('2026-08-31T12:00:00Z')
    expect(tageBeimKunden('2026-08-24T12:00:00Z', jetzt)).toBe(7)
    expect(tageBeimKunden(null, jetzt)).toBeNull()
  })

  it('Archivieren überschreibt den echten Ausgang nicht mehr', () => {
    const patch = statusPatch('accepted', 'archived', { jetzt: new Date('2026-08-31T12:00:00Z') })
    expect(patch.status_vor_archiv).toBe('accepted')
    expect(patch.archiviert_am).toBe('2026-08-31T12:00:00.000Z')
    expect(echterAusgang({ status: 'archived', status_vor_archiv: 'accepted' })).toBe('accepted')
  })

  it('zweimal archivieren verliert den Ausgang nicht', () => {
    expect(statusPatch('archived', 'archived').status_vor_archiv).toBeUndefined()
  })

  it('Ent-Archivieren räumt die Archiv-Felder wieder ab', () => {
    const patch = statusPatch('archived', 'accepted')
    expect(patch.archiviert_am).toBeNull()
    expect(patch.status_vor_archiv).toBeNull()
  })
})

// ── CoS-019 Teil 2: Anfahrt-Rubriken ───────────────────────────────────────

describe('CoS-019 Teil 2 — eine Schreibweise für die Anfahrt-Rubrik', () => {
  it('kennt nur noch „Anfahrt & Organisation"', () => {
    const rubriken = new Set(DEFAULT_PRICES.map(p => p.category).filter(c => c.includes('Anfahrt')))
    for (const rubrik of rubriken) expect(rubrik).toMatch(/– Anfahrt & Organisation$/)
    expect(rubriken.size).toBeGreaterThan(5)
  })
})

// ── CoS-026: Zuschlag folgt seiner Bemessungsgrundlage ─────────────────────

describe('CoS-026 — ändert der Handwerker die Grundlage, geht der Zuschlag mit', () => {
  const angebot = () => [
    { title: 'Wandflächen streichen 2x — Büro', quantity: 57.6, unit: 'm²', unit_price: 9.5, total_price: 547.2 },
    { title: 'Erschwerniszuschlag Raumhöhe > 3m — Büro', quantity: 15, unit: '%', unit_price: 5.47, total_price: 82.05 },
  ]

  it('zieht Einzelpreis und Gesamtpreis nach, wenn die Menge korrigiert wird', () => {
    const items = angebot()
    items[0] = { ...items[0], quantity: 70, total_price: 665 }
    const neu = aktualisiereProzentZuschlaege(items)
    expect(neu[1].unit_price).toBe(6.65)      // 665,00 € / 100
    expect(neu[1].total_price).toBe(99.75)    // 15 × 6,65
  })

  it('gibt bei unveränderter Lage EXAKT dieselbe Instanz zurück (kein Render-Kreisel)', () => {
    const items = angebot()
    expect(aktualisiereProzentZuschlaege(items)).toBe(items)
  })

  it('lässt einen von Hand geänderten Zuschlag in Ruhe (CoS-014-Regel)', () => {
    const items = angebot()
    items[0] = { ...items[0], quantity: 70, total_price: 665 }
    items[1] = { ...items[1], unit_price: 9, total_price: 135 }
    const neu = aktualisiereProzentZuschlaege(items, i => i.unit === '%')
    expect(neu[1].unit_price).toBe(9)
    expect(neu).toBe(items)
  })

  it('fällt bei gelöschter Grundlage auf 0,00 € statt still auf fremde Räume', () => {
    const items = [
      { title: 'Wandflächen streichen 2x — Küche', quantity: 100, unit: 'm²', unit_price: 10, total_price: 1000 },
      { title: 'Erschwerniszuschlag Raumhöhe > 3m — Büro', quantity: 15, unit: '%', unit_price: 5.47, total_price: 82.05 },
    ]
    const neu = aktualisiereProzentZuschlaege(items)
    expect(neu[1].unit_price).toBe(0)
    expect(neu[1].total_price).toBe(0)
  })
})

// ── PM-024, vierter Nachtest (Sandy, 2026-08-31) ───────────────────────────

describe('PM-024 — Büro mit 3,20 m Raumhöhe, Zuschlag als Prozent', () => {
  // Sandys echte Zahlen aus dem vierten Nachtest, 1:1 aus
  // pruefmeister-testfaelle.md übernommen.
  const buero = () => [
    { title: 'Wandflächen streichen 2x — Büro', quantity: 57.6, unit: 'm²', unit_price: 9.5, berechnungsweg: null as string | null },
    { title: 'Boden schützen / Abdecken — Büro', quantity: 20, unit: 'm²', unit_price: 1.2, berechnungsweg: null as string | null },
    { title: 'Sockelleisten abkleben — Büro', quantity: 17.1, unit: 'lfdm', unit_price: 0.8, berechnungsweg: null as string | null },
    { title: 'Erschwerniszuschlag Raumhöhe > 3m — Büro', quantity: 1, unit: '%', unit_price: 15, berechnungsweg: 'Raumhöhe 3.2m > 3m' as string | null },
  ]

  it('trifft die Soll-Lösung des Prüfmeisters auf den Cent', () => {
    const items = buero()
    wendeProzentZuschlaegeAn(items, () => true)
    const zuschlag = items[3]
    // 547,20 + 24,00 + 13,68 = 584,88 € · 1 % gerundet = 5,85 € · × 15 = 87,75 €
    expect(zuschlag.quantity).toBe(15)
    expect(zuschlag.unit_price).toBe(5.85)
    expect(zuschlag.quantity * zuschlag.unit_price).toBeCloseTo(87.75, 2)
  })

  it('ersetzt den Platzhalter „1" — er darf nie im fertigen Entwurf stehen', () => {
    const items = buero()
    wendeProzentZuschlaegeAn(items, () => true)
    expect(items[3].quantity).not.toBe(1)
  })

  it('Vorschau-Karte: ein Prozent-Zuschlag ist als „Menge steht noch nicht fest" erkennbar', () => {
    // Der Prozentsatz kommt aus der Preisliste des Betriebs, nicht aus dem
    // Transkript — die Karte kann ihn vor der Bepreisung nicht kennen und
    // zeigt deshalb keine Zahl statt der Platzhalter-1 (Sandys Fund).
    expect(istProzentZuschlag('%')).toBe(true)
    expect(istProzentZuschlag('m²')).toBe(false)
    const seite = readFileSync(join(__dirname, '..', '..', 'app/(app)/angebot/[id]/entwurf/page.tsx'), 'utf-8')
    expect(seite).toContain('mengeOffen: istProzentZuschlag(p.einheit)')
    expect(seite).toContain('Satz aus Preisliste')
  })
})
