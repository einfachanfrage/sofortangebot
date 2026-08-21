import { describe, it, expect } from 'vitest'
import {
  sekundaerGewerk,
  berechneUndPruefeAlleGewerke,
  entferneRedundantenBodenschutz,
} from '../mehrgewerk'
import { normalisiereExtraktion } from '../extraktion-normalisierer'
import type { BerechnetePosition } from '../types'

function position(beschreibung: string): BerechnetePosition {
  return {
    beschreibung,
    menge: 15,
    einheit: 'm²',
    konfidenz: 'high',
    berechnungsweg: 'Test',
    annahmen: [],
  }
}

describe('sekundaerGewerk — erkennt das zweite Gewerk im Auftrag', () => {
  it('Maler-Primär + Boden-Arbeiten → boden_parkett', () => {
    expect(sekundaerGewerk('maler', {
      raeume: [{ arbeiten: ['wände streichen'], belag: 'vinyl', altbelag_entfernen: true }],
    })).toBe('boden_parkett')
  })
  it('Boden-Primär + Maler-Arbeiten → maler', () => {
    expect(sekundaerGewerk('boden_parkett', {
      raeume: [{ arbeiten: ['vinyl verlegen', 'wände streichen'] }],
    })).toBe('maler')
  })
  it('reiner Maler-Auftrag → kein zweites Gewerk', () => {
    expect(sekundaerGewerk('maler', { raeume: [{ arbeiten: ['wände streichen', 'decke streichen'] }] })).toBe(null)
  })
  it('reiner Boden-Auftrag → kein zweites Gewerk', () => {
    expect(sekundaerGewerk('boden_parkett', { raeume: [{ arbeiten: ['laminat verlegen'], belag: 'laminat' }] })).toBe(null)
  })
})

describe('berechneUndPruefeAlleGewerke — Maler UND Boden im selben Raum', () => {
  // ECHTER Prod-Fall: KI wählte gewerk=maler und legte die Boden-Arbeiten GAR NICHT
  // in raeume[] ab (kein belag, keine Boden-Arbeiten) — nur der Rohtext verrät es.
  const extraktion = {
    gewerk: 'maler',
    transkript: 'im flur wird gestrichen, wände und decke, 15 quadratmeter, 2,60 hoch. und im gleichen flur kommt neuer vinylboden rein, der alte teppich muss vorher raus.',
    raeume: [{
      name: 'Flur', flaeche: 15, hoehe: 2.6,
      arbeiten: ['wände streichen', 'decke streichen'],
    }],
  }
  const { positionen } = berechneUndPruefeAlleGewerke(
    extraktion as never,
    extraktion.transkript,
    {},
    // Signale wie bei Maler-Extraktion: NUR Maler-Arbeiten, kein Belag/Altbelag —
    // der Boden-Anteil muss allein aus dem Rohtext kommen
    { arbeitenTexte: extraktion.raeume[0].arbeiten, belagText: null, altbelagEntfernen: false },
  )
  const namen = positionen.map(p => p.beschreibung.toLowerCase())

  it('enthält die MALER-Arbeiten', () => {
    expect(namen.some(n => n.includes('wandflächen streichen'))).toBe(true)
    expect(namen.some(n => n.includes('deckenfläche streichen'))).toBe(true)
  })
  it('enthält die BODEN-Arbeiten (das war der gedroppte Teil)', () => {
    expect(namen.some(n => n.includes('vinyl') && n.includes('verlegen'))).toBe(true)
    expect(namen.some(n => n.includes('altbelag entfernen') || n.includes('teppich'))).toBe(true)
  })
  it('keine kaputten Mengen, keine exakten Duplikate', () => {
    for (const p of positionen) {
      expect(Number.isFinite(p.menge)).toBe(true)
      // PM-016 (2026-08-19): eine `konfidenz: 'low'`-Platzhalterposition
      // (aus `fehlende`, siehe mehrgewerk.ts Schritt 5) hat bewusst `menge:
      // 0` — sichtbar statt spurlos verschwunden, s. PM-010/012/013. Jede
      // andere Position muss weiterhin eine echte, positive Menge haben.
      if (p.konfidenz === 'low') {
        expect(p.menge).toBe(0)
      } else {
        expect(p.menge > 0).toBe(true)
      }
    }
    const keys = positionen.map(p => `${p.beschreibung.toLowerCase()}|${p.menge}`)
    expect(new Set(keys).size).toBe(keys.length)
  })
  it('entfernt den überflüssigen Bodenschutz im neu belegten Raum', () => {
    expect(namen.some(n => n.includes('boden schützen') && n.includes('flur'))).toBe(false)
  })
})

describe('Komplettrenovierung mit Maler- und Bodenarbeiten', () => {
  it('behält alle ausdrücklich genannten Arbeitsschritte', () => {
    const text = 'Wohnzimmer fünf Meter zwanzig lang, vier Meter zehn breit und zwei Meter siebzig hoch. Die alte Raufasertapete muss entfernt werden. Danach werden die Wände gespachtelt, geschliffen, grundiert und zweimal gestrichen. Die Decke wird ebenfalls zweimal gestrichen. Der alte Teppichboden wird entfernt und anschließend Klickvinyl mit Trittschalldämmung verlegt. Es werden achtzehn laufende Meter Sockelleisten montiert. Zwei Fenster und eine Tür.'
    const { positionen } = berechneUndPruefeAlleGewerke({
      gewerk: 'maler', transkript: text,
      raeume: [{
        name: 'Wohnzimmer', laenge: 5.2, breite: 4.1, hoehe: 2.7, flaeche: 21.32,
        fenster: [{ anzahl: 2 }], tueren: [{ anzahl: 1 }],
        arbeiten: ['raufasertapete entfernen', 'waende spachteln', 'waende grundieren', 'waende streichen', 'decke streichen'],
      }],
    } as never, text, {}, {
      arbeitenTexte: ['raufasertapete entfernen', 'waende spachteln', 'waende grundieren', 'waende streichen', 'decke streichen'],
      belagText: null, altbelagEntfernen: false,
    })
    const namen = positionen.map(p => p.beschreibung.toLowerCase())
    for (const erwartet of ['wandflächen streichen', 'deckenfläche streichen', 'spachtel', 'schleifen', 'grundier', 'tapete entfernen', 'altbelag entfernen', 'vinyl', 'trittschall', 'sockelleisten montieren']) {
      expect(namen.some(name => name.includes(erwartet)), `fehlt: ${erwartet}`).toBe(true)
    }
    expect(namen.some(name => name.includes('sockelleisten abkleben'))).toBe(false)
    const sockel = positionen.find(p => /sockelleisten montieren/i.test(p.beschreibung))
    expect(sockel?.menge).toBe(18)
    const trittschall = positionen.find(p => /trittschall/i.test(p.beschreibung))
    expect(trittschall?.menge).toBe(21.32)
  })
})

describe('PM-010 — Sockelleisten-only-Auftrag erfindet keinen Bodenaustausch mehr', () => {
  // ECHTER Prod-Fall (Supabase debug_extraktion_roh, id 9f7c0ed9…, 2026-08-17,
  // Sandys zweiter Live-Nachtest NACH dem ersten PM-010-Fix). GPTs eigene
  // Rohantwort — bewusst NICHT von Hand nachgebaut, 1:1 aus der DB kopiert.
  // Zeigt alle drei damals noch offenen Lücken auf einmal:
  //  1) altbelag_entfernen:true + altbelag_vorhanden:true, obwohl belag:null
  //     und kein Belag-Verb in arbeiten[] steht — GPTs eigener Widerspruch
  //     (Fix: extraktion-normalisierer.ts, hatEchtenBodenHinweis).
  //  2) Der Boden-Anteil wird trotzdem korrekt aktiviert (wegen
  //     sockelleisten:true — reine Sockelleisten-Arbeiten laufen über die
  //     Boden-Engine), aber die Engine darf dann NICHT automatisch auch noch
  //     einen neuen Belag verlegen (Fix: boden.ts, hatEchtenBelagAuftrag).
  //  3) "Sockelleisten streichen" steht sauber in arbeiten[], wurde aber vom
  //     groben add()-Dublettencheck verschluckt, sobald "Sockelleisten
  //     montieren" schon als Position existierte (Fix: maler-tapete.ts,
  //     direkter fehlende.push() statt add()).
  const rawGptResult = {
    gewerk: 'maler',
    raeume: [{
      name: 'Gästezimmer', hoehe: 2.6, breite: 3, laenge: 3.5, tueren: [], fenster: [],
      arbeiten: [
        'wände streichen', 'decke streichen', 'boden abdecken',
        'sockelleisten abkleben', 'sockelleisten demontieren',
        'sockelleisten montieren', 'sockelleisten streichen',
      ],
      sockelleisten: true, altbelag_entfernen: true, altbelag_vorhanden: true,
    }],
  }
  const extraktion = normalisiereExtraktion(rawGptResult as never)
  const transkript = 'Gästezimmer, 350 x 3, Höhe 260, die alten Sockelleisten kommen raus, neue werden montiert, ' +
    'weiße MDF-Leisten, die sollen dann noch gestrichen werden, passend zur Wand, Wände und Decke streichen, zweimal.'
  const signale = {
    arbeitenTexte: extraktion.raeume.flatMap(r => r.arbeiten ?? []),
    belagText: null,
    altbelagEntfernen: extraktion.raeume.some(r => r.altbelag_entfernen === true),
    raeume: [],
  }
  const { positionen, fehlende } = berechneUndPruefeAlleGewerke(
    { ...extraktion, transkript },
    transkript,
    {},
    signale,
  )
  const namen = positionen.map(p => p.beschreibung.toLowerCase())

  it('korrigiert GPTs widersprüchliches altbelag_entfernen-Signal (kein Belag genannt)', () => {
    expect(extraktion.raeume[0].altbelag_entfernen).toBe(false)
    expect(extraktion.raeume[0].altbelag_vorhanden).toBe(false)
  })

  it('erfindet keinen Bodenbelag-Austausch', () => {
    expect(namen.some(n => n.includes('verlegen'))).toBe(false)
    expect(namen.some(n => n.includes('altbelag entfernen'))).toBe(false)
  })

  it('behält die echten Sockelleisten-Arbeiten (montieren)', () => {
    expect(namen.some(n => n.includes('sockelleisten montieren'))).toBe(true)
  })

  it('"Sockelleisten streichen" wird eine ECHTE Position, nicht nur "fehlende" (fünfter PM-010-Fund)', () => {
    // "fehlende" aus pruefeUndErgaenzeVollstaendigkeit wird in
    // angebot-extrahieren/route.ts nie gelesen — landet ein Fund NUR dort,
    // sieht der Nutzer ihn nie (das war der wahre Grund, warum die letzten
    // vier Fix-Versuche live nie gewirkt haben). Deshalb hier hart prüfen,
    // dass es eine echte Position wird, nicht nur in "fehlende" landet.
    const streichPosition = positionen.find(p => p.beschreibung.toLowerCase().includes('sockelleisten streich'))
    expect(streichPosition, `keine Position — hat: ${namen.join(' | ')} | fehlend: ${fehlende.join(' | ')}`).toBeDefined()
    // Gleiche Länge wie "Sockelleisten montieren" (13,00 lfdm, keine Tür in diesem Testfall) — keine eigene Meterangabe fürs Streichen im Transkript.
    expect(streichPosition!.menge).toBeCloseTo(13.0, 1)
  })
})

describe('PM-013, Nachtest 3 — Zwei Räume, Maler-primär + Boden-sekundär, keine Cross-Room-Phantome', () => {
  // ECHTER Prod-Fall (Supabase entwurf_aufnahmen, id 704a58d1…, 2026-08-21,
  // Sandys dritter Live-Nachtest). GPTs eigene Rohantwort — bewusst NICHT von
  // Hand nachgebaut, 1:1 aus der DB kopiert (voll_extraktion.result).
  //
  // Zeigt zwei unabhängige Cross-Room-Bugs auf einmal, beide mit derselben
  // Wurzel wie schon in Fix-Update 2 (kontext-analyzer.ts,
  // anreichernBodenParkett): ein GLOBALES Signal (aus dem GANZEN Transkript
  // oder einem bloßen Boolean-Flag) wurde ungeprüft auf JEDEN Raum
  // angewendet, statt nur auf den Raum, der es wirklich betrifft.
  //  1) reichereBodenAn (mehrgewerk.ts) übergab den aus dem GANZEN Transkript
  //     erkannten Belag ("parkett", wegen Wohnzimmers "Eichenparkett") auch
  //     dem Flur, der ausdrücklich "da wird nix am Boden gemacht" sagt —
  //     Ergebnis: eine echte, bepreiste "Fertigparkett verlegen — Flur"
  //     (9 m²), die wiederum "Boden schützen — Flur" als vermeintlich
  //     redundant entfernte (Fix: boden.ts, hatEchtenBelagAuftrag).
  //  2) boden.ts vertraute GPTs `sockelleisten`-Boolean blind — beim
  //     Wohnzimmer stand es auf true, obwohl "Sockelleisten" im Transkript
  //     kein einziges Mal vorkommt. Menge exakt 25 lfdm = voller
  //     Wohnzimmer-Umfang (2×(8+4,5)) — sieht nach einer GPT-seitigen
  //     Standardannahme "neuer Boden → automatisch neue Sockelleisten" aus.
  //     Diese Phantom-Position triggerte wiederum aufnahme-hinweise.ts'
  //     "sockelleisten montieren"-Sicherheitsnetz, das (raumblind) ALLE
  //     "Sockelleisten abkleben"-Positionen im ganzen Auftrag entfernte —
  //     hier speziell die des Flurs, obwohl die Karte sie korrekt mit Menge
  //     gemeldet hatte.
  const rawGptResult = {
    gewerk: 'maler',
    raeume: [
      {
        name: 'Wohnzimmer', belag: 'parkett', breite: 4.5, laenge: 8, tueren: [], fenster: [],
        arbeiten: ['eichenparkett verlegen'], sockelleisten: true, verlegerichtung: 'fischgrät',
        altbelag_entfernen: false, altbelag_vorhanden: true,
      },
      {
        name: 'Flur', hoehe: 2.6, breite: 1.8, laenge: 5,
        tueren: [{ hoehe: 2.1, anzahl: 1, breite: 0.9, annahme: true }], fenster: [],
        arbeiten: ['wände streichen', 'decke streichen', 'boden abdecken', 'sockelleisten abkleben'],
      },
    ],
  }
  const extraktion = normalisiereExtraktion(rawGptResult as never)
  const transkript = 'Wohnzimmer, 8x4,5, Eichenparkett, Fischgrät verlegt, das brauche ja mehr Verschnitt, ist ' +
    'schon eine große Fläche, da muss wahrscheinlich eine Dehnungsfuge rein, macht das bitte mit rein, Boden ' +
    'nur, an den Wänden machen wir nix. Daneben ist noch der Flur, 5x1,80, Höhe 2,60, kein Fenster, aber eine ' +
    'Tür Normalmaß, nur Wände und Decke streichen, zweimal, da wird nix am Boden gemacht, der bleibt wie er ist.'
  const signale = {
    arbeitenTexte: extraktion.raeume.flatMap(r => r.arbeiten ?? []),
    belagText: null,
    altbelagEntfernen: extraktion.raeume.some(r => r.altbelag_entfernen === true),
    raeume: [],
  }
  const { positionen } = berechneUndPruefeAlleGewerke(
    { ...extraktion, transkript },
    transkript,
    {},
    signale,
  )
  const namen = positionen.map(p => p.beschreibung.toLowerCase())

  it('erfindet keine Bodenposition im Flur trotz global erkanntem Belag', () => {
    expect(namen.some(n => n.includes('verlegen') && n.includes('flur'))).toBe(false)
  })

  it('erfindet keine Sockelleisten-Montage im Wohnzimmer ohne Textbeleg', () => {
    expect(namen.some(n => n.includes('sockelleisten montieren'))).toBe(false)
  })

  it('behält die echten Flur-Nebenleistungen (Boden schützen, Sockelleisten abkleben)', () => {
    expect(namen.some(n => n.includes('boden schütz') && n.includes('flur'))).toBe(true)
    expect(namen.some(n => n.includes('sockelleisten abkleben') && n.includes('flur'))).toBe(true)
  })

  it('rechnet den Fischgrät-Verschnitt weiterhin korrekt in die Wohnzimmer-Position ein', () => {
    const parkett = positionen.find(p => /fertigparkett verlegen/i.test(p.beschreibung))
    expect(parkett?.menge).toBe(41.4)
  })

  it('erzeugt keine doppelte, raumlose Fischgrät-Position', () => {
    expect(namen.some(n => n.includes('fischgrät') || n.includes('fischgraet'))).toBe(false)
  })
})

describe('entferneRedundantenBodenschutz', () => {
  it('entfernt Schutz nur im Raum mit einer Verlegeposition', () => {
    const ergebnis = entferneRedundantenBodenschutz([
      position('Boden schützen — Flur'),
      position('Boden schützen — Wohnzimmer'),
      position('Vinyl-Boden verlegen inkl. 10% Verschnitt — Flur'),
    ])

    expect(ergebnis.map(p => p.beschreibung)).toEqual([
      'Boden schützen — Wohnzimmer',
      'Vinyl-Boden verlegen inkl. 10% Verschnitt — Flur',
    ])
  })

  it('behält pauschalen Bodenschutz ohne eindeutige Raumzuordnung', () => {
    const ergebnis = entferneRedundantenBodenschutz([
      position('Boden schützen / Abdecken'),
      position('Laminat verlegen — Flur'),
    ])

    expect(ergebnis).toHaveLength(2)
  })

  it('wertet reine Bodenaufarbeitung nicht als Neuverlegung', () => {
    const ergebnis = entferneRedundantenBodenschutz([
      position('Boden schützen — Flur'),
      position('Parkett schleifen — Flur'),
    ])

    expect(ergebnis).toHaveLength(2)
  })
})
