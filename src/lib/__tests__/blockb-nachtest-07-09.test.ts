import { describe, it, expect } from 'vitest'
import { bestimmeModus, berechneRaumMasse, berechneQuantityFuerItem } from '../raum-geometrie'
import { malerEngine } from '../mengen/gewerke/maler'
import { materialFuerPosition } from '../material-mapping'
import { positionsUntertitel } from '../positions-untertitel'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit'
import { ergaenzeAusAufnahmeHinweisen } from '../mengen/aufnahme-hinweise'
import type { BerechnetePosition } from '../mengen/types'

// ── Block B, zweite Hälfte — Nachtest (Prüfmeister, 07.09.2026) ───────────
//
// Alle sieben Altfunde grün, vier neue Funde. Sein Befund dahinter trifft den
// Kern: An einem Tag sind sechs neue Positionsarten entstanden, und **jede
// braucht drei Dinge — eine Menge, einen Katalogpreis und ein Material.**
// Mitgewachsen war nur das erste.

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: String(i), title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))
const preisFuer = (titel: string, einheit = 'm²') =>
  findePreisposition(titel, einheit, KATALOG)?.position

// ── PM-031 ────────────────────────────────────────────────────────────────
describe('PM-031 — eine Fassade überlebt das Bearbeiten als Fassade', () => {
  // Der Originalfall: Wandlänge 10 → 12 m, gespeichert. Vorher blieb die
  // Fläche bei 50,00 m² stehen (103,50 € zu wenig), weil das Objekt ohne
  // `modus` als Rechteck ohne Breite galt — und ein Rechteck ohne Breite ist
  // nicht rechenbar, also wurde gar nichts neu gerechnet.
  const fassadeOhneModus = { laenge: 12, hoehe: 5, fenster: 2, fensterFlaeche: 3.36 }

  it('erkennt die Fassade an ihrer Form, auch ohne gespeichertes modus-Feld', () => {
    expect(bestimmeModus(fassadeOhneModus)).toBe('wand')
  })

  it('die Menge folgt der Korrektur: 12,00 × 5,00 = 60,00 m²', () => {
    expect(berechneRaumMasse(fassadeOhneModus).wandflaeche).toBe(60)
    expect(berechneQuantityFuerItem('Fassadenfläche streichen 1x', 'm²', fassadeOhneModus)).toBe(60)
  })

  it('eine Fassade bekommt weder Boden noch Umfang — also auch keine Sockelleisten', () => {
    const m = berechneRaumMasse(fassadeOhneModus)
    expect(m.bodenflaeche).toBeNull()
    expect(m.umfang).toBeNull()
    expect(berechneQuantityFuerItem('Sockelleisten abkleben', 'lfdm', fassadeOhneModus)).toBeNull()
  })

  // Die Gegenrichtung: Ein echter Raum darf nicht plötzlich als Wand gelten,
  // und ein ausdrücklich gesetzter Modus gewinnt immer — der Nutzer darf über
  // „Kein Wand-Objekt?" eine Fassade zum Raum erklären.
  it('ein echter Raum bleibt ein Rechteck', () => {
    expect(bestimmeModus({ breite: 4, laenge: 5, hoehe: 2.5 })).toBe('rechteck')
    expect(berechneRaumMasse({ breite: 4, laenge: 5, hoehe: 2.5 }).umfang).toBe(18)
  })

  it('ein ausdrücklich gesetzter Modus sticht die Form', () => {
    expect(bestimmeModus({ modus: 'rechteck', laenge: 12, hoehe: 5 })).toBe('rechteck')
    expect(bestimmeModus({ modus: 'flaeche', laenge: 12, hoehe: 5, wandflaeche: 40 })).toBe('flaeche')
  })

  it('eine genannte Fläche bleibt Flächen-Modus, keine Wand', () => {
    expect(bestimmeModus({ wandflaeche: 52.5 })).toBe('flaeche')
    expect(bestimmeModus({ laenge: 12, hoehe: 5, bodenflaeche: 30 })).not.toBe('wand')
  })

  // Auftrag 3 des Prüfmeisters: Der Wächter aus dadf67b kannte nur Räume —
  // „ein Wächter, der eine Objektart nicht kennt, bewacht sie auch nicht".
  it('Engine und Bearbeiten-Ansicht rechnen die Fassade gleich', () => {
    const positionen = malerEngine({
      transkript: 'Nordseite, zwölf Meter lang, fünf Meter hoch, zwei Fenster. Einmal streichen.',
      raeume: [{
        name: 'Nordseite', ist_fassade: true, laenge: 12, hoehe: 5,
        fenster: [{ breite: 1.2, hoehe: 1.4, anzahl: 2 }], tueren: [],
        arbeiten: ['fassade streichen'],
      }],
    } as never).positionen
    const ausEngine = positionen.find(p => /fassadenfläche streichen/i.test(p.beschreibung))?.menge
    expect(ausEngine).toBe(60)
    expect(berechneQuantityFuerItem('Fassadenfläche streichen 1x', 'm²', fassadeOhneModus)).toBe(ausEngine)
  })
})

// ── PM-012-A ──────────────────────────────────────────────────────────────
describe('PM-012-A — eine bestellte Leistung ist kein Vorschlag', () => {
  const PM012 = 'Esszimmer, viereinhalb mal drei, Höhe zwo fünfundfünfzig. Wände streichen, zweimal drüber. '
    + 'Die Sockelleisten bleiben genau wie sie sind, die werden NICHT neu gemacht, die NICHT demontiert — '
    + 'die sollen nur nochmal mitgestrichen werden, in der gleichen Farbe wie die Wand.'

  it('über die Vollständigkeitsprüfung: nicht als ergänzt markiert', () => {
    const basis: BerechnetePosition[] = [
      { beschreibung: 'Wandflächen streichen 2x — Esszimmer', menge: 38.25, einheit: 'm²', konfidenz: 'high', berechnungsweg: '', annahmen: [] },
      { beschreibung: 'Sockelleisten abkleben — Esszimmer', menge: 15, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: '', annahmen: [] },
    ]
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit('maler', basis, PM012, undefined,
      { arbeitenTexte: ['wände streichen', 'sockelleisten streichen'] })
    const streichen = positionen.find(p => /sockelleisten streichen/i.test(p.beschreibung))
    expect(streichen).toBeDefined()
    expect(streichen?.automatisch_ergaenzt).toBe(false)
  })

  it('über das Sicherheitsnetz der Route: ebenfalls nicht', () => {
    const streichen = ergaenzeAusAufnahmeHinweisen(
      [
        { beschreibung: 'Wandflächen streichen 2x — Esszimmer', menge: 38.25, einheit: 'm²', konfidenz: 'high', berechnungsweg: '', annahmen: [] },
        { beschreibung: 'Sockelleisten abkleben — Esszimmer', menge: 15, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: '', annahmen: [] },
      ],
      ['Wände streichen', 'Sockelleisten streichen'],
      PM012,
    ).find(p => /sockelleisten streichen/i.test(p.beschreibung))
    expect(streichen?.automatisch_ergaenzt).toBe(false)
  })

  // Unsicher bleibt die MENGE, nicht der Auftrag — das gehört weiterhin
  // sichtbar in Konfidenz und Annahme, nur eben nicht ins Etikett.
  it('die übernommene Menge bleibt als Annahme gekennzeichnet', () => {
    const streichen = ergaenzeAusAufnahmeHinweisen(
      [
        { beschreibung: 'Wandflächen streichen 2x — Esszimmer', menge: 38.25, einheit: 'm²', konfidenz: 'high', berechnungsweg: '', annahmen: [] },
        { beschreibung: 'Sockelleisten abkleben — Esszimmer', menge: 15, einheit: 'lfdm', konfidenz: 'high', berechnungsweg: '', annahmen: [] },
      ],
      ['Sockelleisten streichen'], PM012,
    ).find(p => /sockelleisten streichen/i.test(p.beschreibung))
    expect(streichen?.konfidenz).toBe('medium')
    expect(streichen?.annahmen?.join(' ')).toMatch(/übernommen/)
  })
})

// ── PM-030-A ──────────────────────────────────────────────────────────────
describe('PM-030-A — beauftragte Giebelwände werden erfragt statt verschwiegen', () => {
  const dachzimmer = (transkript: string, arbeiten: string[]) => malerEngine({
    transkript,
    raeume: [{
      name: 'Dachzimmer', laenge: 4.5, breite: 4, kniestockhoehe: 1, dachschraege_flaeche_m2: 18,
      dachfenster: [{ anzahl: 1, annahme: true }], tueren: [], fenster: [], arbeiten,
    }],
  } as never)

  const PM030 = 'Dachzimmer, vier Meter fünfzig mal vier Meter. Kniestock ist eins Meter hoch. '
    + 'Die Dachschrägen zusammen ergeben achtzehn Quadratmeter. Ein Dachfenster drin, normale Größe. '
    + 'Wände, Schrägen und Kniestock alles zweimal streichen.'

  it('der Originalfall erzeugt einen sichtbaren Hinweis', () => {
    const r = dachzimmer(PM030, ['wände streichen', 'dachschrägen streichen', 'kniestock streichen'])
    expect(r.warnungen.join(' ')).toMatch(/Giebelwände/)
    expect(r.warnungen.join(' ')).toMatch(/Firsthöhe|Giebel-/)
  })

  it('die vier richtigen Positionen bleiben unverändert', () => {
    const p = dachzimmer(PM030, ['wände streichen', 'dachschrägen streichen', 'kniestock streichen']).positionen
    const menge = (m: RegExp) => p.find(x => m.test(x.beschreibung))?.menge
    expect(menge(/kniestockwände streichen/i)).toBe(17)
    expect(menge(/dachschrägen streichen/i)).toBe(18)
    expect(menge(/boden schützen/i)).toBe(18)
    expect(menge(/sockelleisten abkleben/i)).toBe(17)
  })

  // „Kniestockwände" enthält „wände" — das Wort im Wort ist die Falle, die
  // diese Woche viermal Geld gekostet hat. Wer nur den Kniestock beauftragt,
  // darf keine Rückfrage nach Giebelwänden bekommen.
  it('„Kniestockwände" allein löst keine Rückfrage aus', () => {
    const r = dachzimmer(
      'Dachzimmer, vier Meter fünfzig mal vier Meter. Kniestock ist eins Meter hoch. '
      + 'Die Dachschrägen zusammen ergeben achtzehn Quadratmeter. Schrägen und Kniestockwände zweimal streichen.',
      ['dachschrägen streichen', 'kniestockwände streichen'],
    )
    expect(r.warnungen.join(' ')).not.toMatch(/Giebel/)
  })

  it('ein normaler Raum bekommt die Rückfrage nie', () => {
    const r = malerEngine({
      transkript: 'Büro, fünf mal vier, Höhe 2,50. Wände zweimal streichen.',
      raeume: [{ name: 'Büro', laenge: 5, breite: 4, hoehe: 2.5, tueren: [], fenster: [], arbeiten: ['wände streichen'] }],
    } as never)
    expect(r.warnungen.join(' ')).not.toMatch(/Giebel/)
  })
})

// ── PM-030-B / PM-025 / PM-037-A ─────────────────────────────────────────
describe('Jede neue Positionsart hat Menge, Preis und Material', () => {
  const neueArten = [
    'Dachschrägen streichen 2x — Dachzimmer',
    'Kniestockwände streichen 2x — Dachzimmer',
    'Fassadenfläche streichen 1x — Nordseite',
    'Fenster Innenleibungen streichen — Büro',
    'Designbelag im Fischgrätmuster kleben inkl. 15% Verschnitt — Gästezimmer',
  ]

  for (const titel of neueArten) {
    it(`„${titel.split(' — ')[0]}" hat Untertitel und Material`, () => {
      expect(positionsUntertitel(titel), 'Untertitel').not.toBeNull()
      expect(materialFuerPosition(titel), 'Material').not.toBeNull()
    })
  }

  // Ein Aufpreis ist ein Arbeitszuschlag auf eine Position, die ihr Material
  // schon trägt. Ohne diese Ausnahme stünde der Belag zweimal im Angebot —
  // „Aufpreis Diagonalverlegung Vinyl" trifft das Muster `verleg.*vinyl`.
  it('Aufpreiszeilen bekommen kein zweites Material', () => {
    for (const t of ['Aufpreis Diagonalverlegung Vinyl — Raum', 'Aufpreis Fischgrät-Verlegemuster — Wohnzimmer']) {
      expect(materialFuerPosition(t), t).toBeNull()
      expect(positionsUntertitel(t), t).not.toBeNull()
    }
  })

  it('PM-037-A: alle drei Leibungstitel der Engine finden einen Preis', () => {
    for (const t of ['Fenster Innenleibungen streichen', 'Türleibungen streichen', 'Fensterleibungen streichen']) {
      expect(preisFuer(`${t} — Büro`)?.unit_price, t).toBe(45)
    }
    // Der Originalfall: 1,60 m² × 45,00 € = 72,00 € statt 0,00 €
    expect(Math.round(1.6 * 45 * 100) / 100).toBe(72)
  })

  it('die Fensterbank bleibt bei ihrem eigenen Eintrag', () => {
    expect(preisFuer('Fensterbänke streichen — Büro')?.title).toBe('Fensterbänke streichen')
  })
})
