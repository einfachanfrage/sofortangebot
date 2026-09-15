// PM-057 bis PM-059 — die Materialseite der abgeleiteten Preisliste
// (Prüfmeister, 15.09.2026).
//
// Ausgangspunkt war Restliste Nr. 9: `Übergangsprofil / Schwelle einbauen`
// steht mit 15,00 €/Stück im Katalog und mit 0,29 h in `preis-ableitung.ts`.
// Bei 52 €/h sind das 15,08 € reine Zeit — für das Profil selbst bliebe
// nichts. Gefragt war: sind die Stunden zu hoch, oder fehlt das Material?
//
// Beim Nachmessen sind daraus drei Fälle geworden. Sie hängen zusammen: In
// allen dreien behauptet eine Marke etwas über das Material, das der Preis
// daneben nicht einhält.
//
// Zwei Prüfungen stehen als `it.fails` — sie halten ein Soll fest, das heute
// nicht erfüllt ist. Wird es gebaut, schlägt die Sperrklinke an und der Test
// muss auf `it` zurückgestellt werden.
import { describe, expect, it } from 'vitest'
import { ANKER, leiteAb, katalogPreis, pruefeGegenKatalog } from '../preis-ableitung'
import { materialWort } from '../materialanteil'

const STUNDENSATZ_KATALOG = 52

// ── PM-057 ────────────────────────────────────────────────────────────────

describe('PM-057 — Übergangsprofil: die Stunden stimmen, das Material fehlt', () => {
  it('0,29 h liegt im selben Stundenband wie die übrigen Zeit-Zeilen', () => {
    // Jede Zeit-Zeile mit Katalogzwilling unterstellt einen Stundensatz:
    // Katalogpreis ÷ Stunden. Streuen die weit, ist eine Stundenzahl geraten.
    const saetze = ANKER.flatMap(a => a.zeilen
      .filter(z => z.art === 'zeit' && z.katalogTitel)
      .map(z => {
        const k = katalogPreis(z.katalogTitel!)!
        return { titel: z.katalogTitel!, satz: k.preis / (z.stunden ?? 0) }
      }))
    const profil = saetze.find(s => s.titel === 'Übergangsprofil / Schwelle einbauen')!
    expect(profil.satz).toBeCloseTo(51.7, 1)
    // Spanne über alle Zeit-Zwillinge unter 10 % — das Profil ist das untere
    // Ende, kein Ausreißer.
    const min = Math.min(...saetze.map(s => s.satz))
    const max = Math.max(...saetze.map(s => s.satz))
    expect((max - min) / min).toBeLessThan(0.1)
  })

  it('15,00 € KÖNNEN das Profil nicht enthalten — der Katalog widerlegt sich selbst', () => {
    // Der Beweis kommt aus dem Katalog, nicht aus einem Baumarktpreis:
    // Ein Profil HERAUSnehmen kostet 8,00 €/Stück und verbraucht kein Material.
    // Steckten im Einbau 8–12 € Profil, bliebe für die Einbau-ARBEIT 3,00 bis
    // 7,00 € — weniger als für den Ausbau. Niemand setzt ein Profil schneller,
    // als er eines herausreißt (messen, ablängen, bohren, dübeln, schrauben).
    // Also: 15,00 € ist Arbeitslohn, das Profil ist nicht darin.
    const einbau = katalogPreis('Übergangsprofil / Schwelle einbauen')!
    const ausbau = katalogPreis('Schwelle / Übergangsprofil entfernen')!
    expect(einbau.einheit).toBe('Stück')
    expect(ausbau.einheit).toBe('Stück')
    expect(einbau.preis - 12).toBeLessThan(ausbau.preis)
    expect(einbau.preis - 8).toBeLessThan(ausbau.preis)
  })

  it('der abgeleitete Preis ist zu 100 % Zeit — bei jedem Stundensatz', () => {
    for (const satz of [52, 60, 75, 90]) {
      const p = leiteAb(['boden'], {}, satz)
        .find(z => z.katalogTitel === 'Übergangsprofil / Schwelle einbauen')!
      // rohpreis = stunden × satz, ohne jeden festen Materialbetrag.
      expect(p.rohpreis).toBeCloseTo(0.29 * satz, 6)
    }
  })

  it.fails('SOLL: eine Zeile mit `material: zubehoer` trägt das Zubehör auch im Preis', () => {
    // Manfred: „Kleinmaterial — Trittschall, Kleber, Übergangsprofil — ist bei
    // mir drin." Bei Kreppband und Folie stimmt das auch ohne eigenen Betrag;
    // beim Profil sind es 8–12 € auf eine 15-€-Zeile, also über die Hälfte.
    // Solange eine `zeit`-Zeile keinen festen Materialbetrag kennt, ist die
    // Marke eine Zusage, die der Preis nicht hält — und der Betrieb zahlt das
    // Profil aus der eigenen Tasche, bei jeder Tür.
    const p = leiteAb(['boden'], {}, 75)
      .find(z => z.katalogTitel === 'Übergangsprofil / Schwelle einbauen')!
    expect(p.rohpreis).toBeGreaterThan(0.29 * 75)
  })

  it('das grüne Band von pruefeGegenKatalog ist 44–63 €/h, und das Profil reißt es zuerst', () => {
    const band: number[] = []
    for (let s = 30; s <= 120; s++) if (pruefeGegenKatalog(s).length === 0) band.push(s)
    expect([band[0], band[band.length - 1]]).toEqual([44, 63])
    const erste = pruefeGegenKatalog(64).map(a => a.titel)
    expect(erste).toContain('Übergangsprofil / Schwelle einbauen')
  })
})

// ── PM-058 ────────────────────────────────────────────────────────────────

describe('PM-058 — „Grundieren (Tiefengrund)" steht zweimal in einer Preisliste', () => {
  // Ein Betrieb, der Maler innen UND Tapezieren ankreuzt, bekommt dieselbe
  // Katalogzeile zweimal — einmal aus dem Wand-Anker, einmal aus dem
  // Tapeten-Anker. Dieselbe Familie wie Q.2 („Kleinstauftrag pauschal" steht
  // zweimal): zwei Quellen für eine Zahl, und welche im Angebot landet,
  // entscheidet der Matcher, nicht der Betrieb.
  const liste = () => leiteAb(['maler_innen', 'tapezieren'], { maler_innen: 11.5, tapezieren: 12 }, STUNDENSATZ_KATALOG)

  it('die Zeile kommt doppelt, mit zwei verschiedenen Preisen', () => {
    const doppelt = liste().filter(p => p.katalogTitel === 'Grundieren (Tiefengrund)')
    expect(doppelt).toHaveLength(2)
    expect(doppelt.map(p => p.preis).sort((a, b) => a - b)).toEqual([3, 5.5])
    // 2,50 €/m² Spanne auf einen Katalogwert von 4,50 €.
    expect(katalogPreis('Grundieren (Tiefengrund)')!.preis).toBe(4.5)
  })

  it('und mit zwei verschiedenen Material-Marken', () => {
    const marken = liste()
      .filter(p => p.katalogTitel === 'Grundieren (Tiefengrund)')
      .map(p => p.material)
      .sort()
    expect(marken).toEqual(['wahl', 'zubehoer'])
  })

  it.fails('SOLL: jede Katalogzeile steht höchstens einmal in einer Preisliste', () => {
    const alle = leiteAb(ANKER.map(a => a.taetigkeit), {}, STUNDENSATZ_KATALOG)
    const titel = alle.map(p => p.katalogTitel ?? p.titel)
    expect(new Set(titel).size).toBe(titel.length)
  })
})

// ── PM-059 ────────────────────────────────────────────────────────────────

describe('PM-059 — zwei Dateien, zwei Antworten auf dieselbe Materialfrage', () => {
  // `preis-ableitung.ts` sagt je Zeile `material: 'wahl' | 'zubehoer' | null`.
  // `materialanteil.ts` entscheidet dieselbe Frage noch einmal, am Titel, mit
  // eigener Zubehör-Liste. Wo beide dasselbe meinen müssten, widersprechen sie
  // sich bei fünf Zeilen — und zwar immer in dieselbe Richtung: Die Preisliste
  // verspricht einen Materialschalter, die Angebotszeile hat keinen.
  //
  // Bei zweien ist der Widerspruch ausdrücklich entstanden: Trittschalldämmung
  // und Sockelleisten wurden in PD-009 §2 bewusst auf `wahl` gesetzt, während
  // die Zubehör-Liste in `materialanteil.ts` `trittschall` und `sockelleiste`
  // wörtlich sperrt — beide am selben Tag geschrieben.
  //
  // Das ist kein Schönheitsfehler: Wer Material selbst stellt, bekommt bei
  // diesen Zeilen nichts abgezogen, weil `teileMaterialAb()` `null` liefert.
  const zeilen = () => leiteAb(ANKER.map(a => a.taetigkeit), {}, STUNDENSATZ_KATALOG)

  const streitfaelle = () => zeilen()
    .filter(p => (p.material === 'wahl') !== (materialWort(p.katalogTitel ?? p.titel, null) !== null))
    .map(p => p.katalogTitel ?? p.titel)

  it('fünf Zeilen, alle in derselben Richtung: `wahl` ohne Schalter', () => {
    expect(streitfaelle().sort()).toEqual([
      'Fassadengrundierung auftragen',
      'Grundieren (Tiefengrund)',
      'Isoliergrund gegen Nikotin / Ruß / Wasserflecken',
      'Sockelleisten montieren (Holz / MDF / Kunststoff)',
      'Trittschalldämmung verlegen (PE-Schaum / Filz)',
    ])
    for (const titel of streitfaelle()) {
      expect(materialWort(titel, null)).toBeNull()
    }
  })

  it('umgekehrt gibt es den Fall nicht — kein Schalter ohne `wahl`', () => {
    const umgekehrt = zeilen()
      .filter(p => p.material !== 'wahl' && materialWort(p.katalogTitel ?? p.titel, null) !== null)
    expect(umgekehrt).toEqual([])
  })

  it('die Zeilen, bei denen beide Dateien übereinstimmen, tragen einen Anteil', () => {
    // Gegenprobe, damit der Test nicht nur Fehler zählt: Wo `wahl` und
    // Schalter zusammenfallen, muss auch ein Materialwort herauskommen.
    const einig = zeilen().filter(p => p.material === 'wahl' && materialWort(p.katalogTitel ?? p.titel, null) !== null)
    expect(einig.length).toBeGreaterThan(8)
    for (const p of einig) expect(materialWort(p.katalogTitel ?? p.titel, null)).not.toBeNull()
  })
})
