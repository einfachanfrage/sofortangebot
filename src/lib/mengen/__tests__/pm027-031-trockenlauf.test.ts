// Trockenlauf für die noch nicht eingesprochenen Prüfmeister-Fälle
// (PM-027 bis PM-031), Stand 2026-08-30.
//
// Anlass: Sandy musste Testfälle zwei- bis dreimal einsprechen, weil ich immer
// nur den einen gemeldeten Fehler behoben und den Rest sie finden lassen habe.
// Diese Datei dreht das um: jeder Fall wird VOR dem Einsprechen gegen die
// dokumentierte Soll-Lösung gerechnet. Was hier grün ist, muss beim ersten
// echten Versuch stimmen — offen bleibt nur, was die KI-Extraktion daraus
// macht, und das steht in der Datei als eigener Hinweis.
import { describe, expect, it } from 'vitest'
import { berechneUndPruefeAlleGewerke } from '../mehrgewerk'
import { analysiereKontext } from '@/lib/kontext-analyzer'
import { normalisiereExtraktion } from '../extraktion-normalisierer'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rechne(gewerk: string, transkript: string, raeume: any[]) {
  const roh = {
    gewerk, confidence_gewerk: 0.95, kunde: { name: null, adresse: null, ort: null },
    raeume, waende: [], decken: [], bereiche: [], altbelag: [], erschwernisse: [],
    anmerkungen: null, fehlende_angaben: [], transkript,
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ext: any = analysiereKontext(normalisiereExtraktion(JSON.parse(JSON.stringify(roh)))).extraktion_angereichert
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const signale: any = {
    arbeitenTexte: raeume.flatMap((r: { arbeiten?: string[] }) => r.arbeiten ?? []),
    raeume: ext.raeume,
    belagText: raeume.find((r: { belag?: string }) => r.belag)?.belag ?? null,
  }
  const meta = {
    raeume: ext.raeume.map((r: { name?: string; hoehe?: number | null }) => ({ name: r.name, hoehe: r.hoehe })),
  }
  const { positionen } = berechneUndPruefeAlleGewerke(ext, transkript, meta, signale)
  return {
    titel: positionen.map(p => p.beschreibung),
    menge: (suche: RegExp) => positionen.find(p => suche.test(p.beschreibung))?.menge,
    position: (suche: RegExp) => positionen.find(p => suche.test(p.beschreibung)),
  }
}

describe('PM-027 — Kellerraum, Parkett gerade + Altbelag raus', () => {
  const ergebnis = rechne('boden_parkett',
    'Kellerraum, fünf Meter mal drei Meter, eine Tür normal Maß. Der alte Teppich muss komplett raus, danach Parkett verlegen, ganz normal gerade, kein Muster.',
    [{
      name: 'Kellerraum', laenge: 5, breite: 3, hoehe: null, flaeche: null, umfang: null,
      tueren: [{ anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }], fenster: [],
      arbeiten: ['parkett verlegen', 'altbelag entfernen'], belag: 'parkett', verlegerichtung: 'standard',
      altbelag_entfernen: true, altbelag_vorhanden: true, sockelleisten: false, nassbereich: false,
    }])

  it('rechnet 5 % Verschnitt auf gerade verlegtes Parkett (Sandy, 30.08.)', () => {
    // Vorher 0 % — die Konvention „Parkett ist keine Plattenware" entsprach
    // nicht der Praxis. 15,00 × 1,05 = 15,75 m².
    expect(ergebnis.menge(/parkett verlegen/i)).toBe(15.75)
  })

  it('entfernt den Altbelag ohne Verschnitt', () => {
    expect(ergebnis.menge(/altbelag entfernen/i)).toBe(15)
  })

  it('erfindet keine Sockelleisten — die wurden nicht erwähnt', () => {
    expect(ergebnis.titel.some(t => /sockelleiste/i.test(t))).toBe(false)
  })
})

describe('Erschwerniszuschlag Raumhöhe gehört zum Raum (Sandy, 30.08.)', () => {
  const ergebnis = rechne('maler',
    'Büro, 5m x 4m, Höhe 3,20m, Wände zweimal streichen. Küche, 4,20 m x 3,60 m, Höhe 2,50 m, Wände zweimal streichen.',
    [
      { name: 'Büro', laenge: 5, breite: 4, hoehe: 3.2, flaeche: 20, umfang: 18,
        tueren: [{ anzahl: 1 }], fenster: [{ anzahl: 2 }], arbeiten: ['wände streichen'],
        altbelag_entfernen: false, sockelleisten: false, nassbereich: false },
      { name: 'Küche', laenge: 4.2, breite: 3.6, hoehe: 2.5, flaeche: 15.12, umfang: 15.6,
        tueren: [{ anzahl: 1 }], fenster: [{ anzahl: 2 }], arbeiten: ['wände streichen'],
        altbelag_entfernen: false, sockelleisten: false, nassbereich: false },
    ])

  it('hängt den Zuschlag an den hohen Raum, nicht an „Allgemein"', () => {
    expect(ergebnis.titel).toContain('Erschwerniszuschlag Raumhöhe > 3m — Büro')
  })

  it('erzeugt ihn nicht für den normal hohen Raum', () => {
    expect(ergebnis.titel.some(t => /erschwerniszuschlag raumhöhe.*küche/i.test(t))).toBe(false)
    expect(ergebnis.titel.filter(t => /erschwerniszuschlag raumhöhe/i.test(t))).toHaveLength(1)
  })
})

describe('PM-028 — Arbeitszimmer, Altbau + ausdrücklich verlangte Grundierung', () => {
  const ergebnis = rechne('maler',
    'Arbeitszimmer, vier Meter mal drei Meter fünfzig, Höhe zwo fünfzig, ist ein Altbau. Wände bitte grundieren und dann zweimal streichen. Ein Fenster, Standardmaß, eine Tür, normal.',
    [{
      name: 'Arbeitszimmer', laenge: 4, breite: 3.5, hoehe: 2.5, flaeche: 14, umfang: 15,
      tueren: [{ anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }],
      fenster: [{ anzahl: 1, breite: 1.2, hoehe: 1.0, annahme: true }],
      arbeiten: ['wände streichen', 'grundieren', 'boden abdecken', 'sockelleisten abkleben'],
      altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
    }])

  it('trifft alle Soll-Mengen', () => {
    expect(ergebnis.menge(/wandfläch/i)).toBe(37.5)
    expect(ergebnis.menge(/grundierung/i)).toBe(37.5)
    expect(ergebnis.menge(/boden schützen/i)).toBe(14)
    expect(ergebnis.menge(/sockelleisten abkleben/i)).toBe(15) // VOB-012 (CoS-042): Tür 0,90 m nicht abgezogen
    expect(ergebnis.titel.some(t => /erschwerniszuschlag altbau/i.test(t))).toBe(true)
  })

  it('ordnet die Grundierung dem Raum zu und nennt sie nicht Vorschlag', () => {
    // Sie wurde ausdrücklich verlangt („Wände bitte grundieren").
    expect(ergebnis.position(/grundierung/i)?.beschreibung).toBe('Voranstrich / Grundierung — Arbeitszimmer')
    expect(ergebnis.position(/grundierung/i)?.automatisch_ergaenzt).toBe(false)
  })

  it('erfindet keine Spachtel-Position', () => {
    expect(ergebnis.titel.some(t => /spachtel/i.test(t))).toBe(false)
  })
})

describe('PM-029 — Abstellraum ohne jede Öffnung', () => {
  const ergebnis = rechne('maler',
    'Abstellraum, zwei Meter mal eins Meter achtzig, Höhe zwo vierzig. Wände einmal streichen reicht völlig. Kein Fenster, keine Tür.',
    [{
      name: 'Abstellraum', laenge: 2, breite: 1.8, hoehe: 2.4, flaeche: 3.6, umfang: 7.6,
      tueren: [], fenster: [], arbeiten: ['wände streichen', 'boden abdecken', 'sockelleisten abkleben'],
      altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
    }])

  it('rechnet einen Anstrich und zieht nichts ab', () => {
    expect(ergebnis.titel).toContain('Wandflächen streichen 1x — Abstellraum')
    expect(ergebnis.menge(/wandfläch/i)).toBe(18.24)
  })

  it('rechnet die Sockelleisten ohne Türabzug', () => {
    expect(ergebnis.menge(/sockelleisten abkleben/i)).toBe(7.6)
    expect(ergebnis.menge(/boden schützen/i)).toBe(3.6)
  })
})

describe('PM-030 — Dachzimmer mit Kniestock und Schrägen', () => {
  const ergebnis = rechne('maler',
    'Dachzimmer, vier Meter fünfzig mal vier Meter. Kniestock ist eins Meter hoch. Die Dachschrägen zusammen ergeben achtzehn Quadratmeter. Ein Dachfenster drin, normale Größe. Wände, Schrägen und Kniestock alles zweimal streichen.',
    [{
      name: 'Dachzimmer', laenge: 4.5, breite: 4, hoehe: null, flaeche: 18, umfang: null,
      tueren: [], fenster: [], dachfenster: [{ anzahl: 1, breite: 0.78, hoehe: 1.18 }],
      kniestockhoehe: 1.0, dachschraege_je_seite_m2: 9, deckenspiegel_m2: null,
      arbeiten: ['wände streichen', 'boden abdecken', 'sockelleisten abkleben'],
      altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
    }])

  it('rechnet Kniestock und Schrägen getrennt, Dachfenster abgezogen', () => {
    expect(ergebnis.menge(/kniestockwände/i)).toBe(17)
    expect(ergebnis.menge(/dachschrägen streichen/i)).toBe(17.08)
    expect(ergebnis.menge(/boden schützen/i)).toBe(18)
  })
})

describe('PM-031 — Fassade Nordseite, einfacher Fall', () => {
  const ergebnis = rechne('maler',
    'Fassade an der Nordseite, zehn Meter lang, Wandhöhe fünf Meter. Zwei Fenster drin, jeweils eins zwanzig mal eins vierzig. Einmal Fassadenfarbe drauf.',
    [{
      name: 'Fassade', laenge: 10, breite: null, hoehe: 5, flaeche: null, umfang: null,
      tueren: [], fenster: [{ anzahl: 2, breite: 1.2, hoehe: 1.4 }],
      arbeiten: ['fassade streichen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
    }])

  it('nennt die Position Fassadenfläche — nicht Wandfläche', () => {
    // Am Titel hängt der Katalogpreis: „Wandflächen streichen" zöge den
    // Innenraum-Preis auf eine Fassade.
    expect(ergebnis.titel).toContain('Fassadenfläche streichen 1x — Fassade')
    expect(ergebnis.menge(/fassadenfläche/i)).toBe(50)
  })

  it('rechnet die Fläche genau EINMAL ab', () => {
    // Vorher setzte die Fassaden-Regel „Fassadenfarbe 2× Anstrich" mit
    // denselben 50 m² nochmal obendrauf, weil sie den Titel nicht erkannte.
    expect(ergebnis.titel.filter(t => /50|fassadenfarbe/i.test(t)).length).toBeLessThanOrEqual(1)
    expect(ergebnis.titel.some(t => /fassadenfarbe/i.test(t))).toBe(false)
  })

  it('erfindet keine Grundierung, die niemand verlangt hat', () => {
    expect(ergebnis.titel.some(t => /grundierung|tiefengrund/i.test(t))).toBe(false)
  })
})
