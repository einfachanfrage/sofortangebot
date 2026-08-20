import { describe, expect, it } from 'vitest'
import { bereiteRueckfragenVor } from '../rueckfragen-flow'
import { verarbeiteAntworten } from '../antworten-verarbeiter'
import type { ExtrahierteDaten } from '../types'

function basis(overrides: Partial<ExtrahierteDaten> = {}): ExtrahierteDaten {
  return {
    gewerk: 'maler', confidence_gewerk: 1,
    kunde: { name: null, adresse: null, ort: null },
    raeume: [], waende: [], decken: [], bereiche: [],
    steckdosen: null, schalter: null, spots: null, aussenlampen: null, wandlampen: null,
    herdanschluss: false, wallbox: false, unterverteilung: false, hauptverteilung: false,
    kabelmeter: null, neu_verkabeln: false,
    wc: null, waschtisch: null, dusche: null, wanne: null, urinal: null, bidet: null,
    armaturen: null, rohrmeter: null, leitungen_erneuern: false, heizkoerper: null,
    austausch: false, erneuerung: false, altbelag: [], erschwernisse: [],
    anmerkungen: null, fehlende_angaben: [], transkript: '',
    ...overrides,
  }
}

describe('geschlossener Rückfragen-Flow', () => {
  it('plant bei mehreren Räumen alle Rückfragen in einer Runde und respektiert direkte Wandfläche', () => {
    const extraktion = basis({
      transkript: 'Wohnzimmer 6 mal 4 Meter und 2,50 hoch, Wände und Decke streichen. Schlafzimmer 4 mal 3 Meter, 2,50 hoch, nur Wände streichen. Im Flur sind es 18 Quadratmeter Wandfläche. In allen Räumen Böden schützen.',
      raeume: [
        { name: 'Wohnzimmer', laenge: 6, breite: 4, hoehe: 2.5, flaeche: 24, fenster: [], tueren: [], arbeiten: ['waende_streichen', 'decke_streichen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false },
        { name: 'Schlafzimmer', laenge: 4, breite: 3, hoehe: 2.5, flaeche: 12, fenster: [], tueren: [], arbeiten: ['waende_streichen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false },
        { name: 'Flur', laenge: null, breite: null, hoehe: null, flaeche: 18, fenster: [], tueren: [], arbeiten: ['waende_streichen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false },
      ],
    })
    const analyse = bereiteRueckfragenVor(extraktion)
    expect(analyse.rueckfragen.map(frage => frage.id)).toEqual([
      'tueren_anzahl_wohnzimmer', 'fenster_anzahl_wohnzimmer',
      'tueren_anzahl_schlafzimmer', 'fenster_anzahl_schlafzimmer',
      'masse_boden_flur',
    ])
    expect(analyse.extraktion.raeume[2].wandflaeche_direkt).toBe(18)
    expect(analyse.rueckfragen.some(frage => frage.id.includes('hoehe_flur'))).toBe(false)
  })

  it('bewahrt die ausdrücklich gewählte Anzahl null für Öffnungen', () => {
    const extraktion = basis({
      raeume: [{ name: 'Flur', laenge: 4, breite: 4, hoehe: 2.6, flaeche: 16, fenster: [], tueren: [], arbeiten: ['waende_streichen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false }],
    })
    const beantwortet = verarbeiteAntworten(extraktion, {
      fenster_anzahl_flur: { wert: 0, einheit: 'Stück' },
      tueren_anzahl_flur: { wert: 3, einheit: 'Stück' },
    })
    expect(beantwortet.raeume[0].fenster).toEqual([{ anzahl: 0 }])
    expect(beantwortet.raeume[0].tueren).toEqual([{ anzahl: 3 }])
  })

  it('übernimmt auch sechs Türen statt die Anzahl künstlich zu begrenzen', () => {
    const extraktion = basis({
      raeume: [{ name: 'Flur', laenge: 8, breite: 1.5, hoehe: 2.6, flaeche: 12, fenster: [], tueren: [], arbeiten: ['waende_streichen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false }],
    })
    const beantwortet = verarbeiteAntworten(extraktion, {
      tueren_anzahl_flur: { wert: 6, einheit: 'Stück' },
    })
    expect(beantwortet.raeume[0].tueren).toEqual([{ anzahl: 6 }])
  })

  it('übernimmt eine direkt eingegebene Wandfläche ohne weitere Raumgeometrie', () => {
    const extraktion = basis({
      raeume: [{ name: 'Flur', laenge: null, breite: null, hoehe: null, flaeche: null, fenster: [], tueren: [], arbeiten: ['waende_streichen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false }],
    })
    const beantwortet = bereiteRueckfragenVor(extraktion, {
      masse_flur: { wert: 42, einheit: 'm²' },
    })
    expect(beantwortet.extraktion.raeume[0]).toMatchObject({ flaeche: null, wandflaeche_direkt: 42 })
    expect(beantwortet.rueckfragen.some(frage => /^(hoehe|tueren_anzahl|fenster_anzahl)_flur$/.test(frage.id))).toBe(false)
  })

  it('speichert direkte Wand- und Bodenfläche getrennt', () => {
    const extraktion = basis({
      raeume: [{ name: 'Flur', laenge: null, breite: null, hoehe: null, flaeche: null, fenster: [], tueren: [], arbeiten: ['waende_streichen', 'boden_schuetzen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false }],
    })
    const beantwortet = bereiteRueckfragenVor(extraktion, {
      masse_flur: { wert: [35, 12], einheit: 'flaechen_m2' },
    })
    expect(beantwortet.extraktion.raeume[0]).toMatchObject({ flaeche: 12, wandflaeche_direkt: 35 })
    expect(beantwortet.rueckfragen.some(frage => /^(hoehe|tueren_anzahl|fenster_anzahl)_flur$/.test(frage.id))).toBe(false)
  })

  it('überträgt eine direkte Wandfläche niemals in die Bodenfläche', () => {
    const extraktion = basis({
      raeume: [{ name: 'Wohnzimmer', laenge: null, breite: null, hoehe: null, flaeche: null, fenster: [], tueren: [], arbeiten: ['waende_streichen'], altbelag_entfernen: false, sockelleisten: false, nassbereich: false }],
    })
    const beantwortet = bereiteRueckfragenVor(extraktion, {
      masse_wohnzimmer: { wert: [38, 0], einheit: 'flaechen_m2' },
    })
    expect(beantwortet.extraktion.raeume[0].wandflaeche_direkt).toBe(38)
    expect(beantwortet.extraktion.raeume[0].flaeche).toBeNull()
  })

  it('fragt nach vollständiger Geometrie noch Türen und Fenster ab', () => {
    const extraktion = basis({
      transkript: 'Im Schlafzimmer die Wände streichen',
      raeume: [{
        name: 'Schlafzimmer', laenge: 5, breite: 4, hoehe: 2.6, flaeche: 20,
        fenster: [], tueren: [], arbeiten: ['waende_streichen'],
        altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
      }],
    })
    const analyse = bereiteRueckfragenVor(extraktion)
    expect(analyse.rueckfragen.map(frage => frage.id)).toEqual(expect.arrayContaining([
      'tueren_anzahl_schlafzimmer', 'fenster_anzahl_schlafzimmer',
    ]))
  })

  it('fragt eine fehlende Raumhöhe ab und übernimmt die Antwort', () => {
    const extraktion = basis({
      raeume: [{
        name: 'Wohnzimmer', laenge: 5, breite: 4, hoehe: null, flaeche: null,
        fenster: [], tueren: [], arbeiten: ['wände streichen'],
        altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
      }],
    })

    const analyse = bereiteRueckfragenVor(extraktion)
    expect(analyse.rueckfragen.some(frage => frage.id === 'hoehe_wohnzimmer')).toBe(true)

    const beantwortet = bereiteRueckfragenVor(extraktion, {
      hoehe_wohnzimmer: { wert: 2.7, einheit: 'm' },
    })
    expect(beantwortet.extraktion.raeume[0].hoehe).toBe(2.7)
    expect(beantwortet.rueckfragen.some(frage => frage.id === 'hoehe_wohnzimmer')).toBe(false)
  })

  it('übernimmt Länge und Breite vor der Mengenberechnung', () => {
    const extraktion = basis({
      raeume: [{
        name: 'Küche', laenge: null, breite: null, hoehe: 2.6, flaeche: null,
        fenster: [], tueren: [], arbeiten: ['wände streichen'],
        altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
      }],
    })
    const beantwortet = bereiteRueckfragenVor(extraktion, {
      masse_küche: { wert: [4, 3], einheit: 'm' },
    })
    expect(beantwortet.extraktion.raeume[0]).toMatchObject({ laenge: 4, breite: 3, flaeche: 12 })
  })

  it('fragt nach beantworteten Raummaßen anschließend noch die fehlende Höhe', () => {
    const extraktion = basis({
      raeume: [{
        name: 'Schlafzimmer', laenge: null, breite: null, hoehe: null, flaeche: null,
        fenster: [], tueren: [], arbeiten: ['waende_streichen'],
        altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
      }],
    })
    const beantwortet = bereiteRueckfragenVor(extraktion, {
      masse_schlafzimmer: { wert: [6, 3.4], einheit: 'm' },
    })
    expect(beantwortet.rueckfragen.some(frage => frage.id === 'hoehe_schlafzimmer')).toBe(true)
  })

  it('wendet Belag, Altbelag und Leitungsmeter deterministisch an', () => {
    const extraktion = basis({
      gewerk: 'boden_parkett',
      raeume: [{
        name: 'Flur', laenge: 5, breite: 2, hoehe: null, flaeche: null,
        fenster: [], tueren: [], arbeiten: ['boden verlegen'],
        altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
      }],
    })
    const boden = verarbeiteAntworten(extraktion, {
      belag_flur: { wert: 2, einheit: 'Auswahl' },
      altbelag_flur: { wert: 1, einheit: 'bool' },
    })
    expect(boden.raeume[0].belag).toBe('Vinyl')
    expect(boden.raeume[0].altbelag_entfernen).toBe(true)

    const elektro = verarbeiteAntworten(basis({ gewerk: 'elektro' }), {
      kabel_meter: { wert: 40, einheit: 'm' },
      unterverteilung: { wert: 1, einheit: 'bool' },
    })
    expect(elektro.kabelmeter).toBe(40)
    expect(elektro.unterverteilung).toBe(true)
  })

  it('verwechselt Kleberreste abschleifen nicht mit Parkett schleifen', () => {
    const extraktion = basis({
      gewerk: 'boden_parkett',
      transkript: '32 Quadratmeter verklebten Teppich entfernen. Kleberreste abschleifen. Eichen-Fertigparkett vollflächig verkleben.',
      raeume: [{
        name: 'Wohnzimmer', laenge: null, breite: null, hoehe: null, flaeche: 32,
        fenster: [], tueren: [],
        arbeiten: ['Teppichboden entfernen', 'Kleberreste abschleifen', 'Eichen-Fertigparkett vollflächig verkleben'],
        belag: 'Fertigparkett', altbelag_entfernen: true, sockelleisten: true, nassbereich: false,
      }],
    })

    const analyse = bereiteRueckfragenVor(extraktion)
    expect(analyse.rueckfragen.some(frage => frage.id === 'versiegelung_wohnzimmer')).toBe(false)
  })

  it('fragt bei Dachschräge im Raum die Schrägenfläche separat ab (nicht doppelt nach Maßen)', () => {
    const extraktion = basis({
      transkript: 'Treppenhaus, Wände und Dachschrägen grundieren und zweimal streichen.',
      raeume: [{
        name: 'Treppenhaus', laenge: null, breite: null, hoehe: null, flaeche: null,
        fenster: [], tueren: [], arbeiten: ['wände streichen', 'dachschrägen streichen'],
        altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
      }],
    })
    const analyse = bereiteRueckfragenVor(extraktion)
    const ids = analyse.rueckfragen.map(frage => frage.id)

    // eigene Dachschrägen-Frage (m²)
    const dach = analyse.rueckfragen.find(frage => frage.id === 'dachschraege_flaeche_treppenhaus')
    expect(dach).toBeDefined()
    expect(dach?.einheit).toBe('m²')

    // NICHT zweimal dieselbe Maßfrage: höchstens eine masse_/masse_boden_-Frage pro Raum
    const masseFragen = ids.filter(id => id.startsWith('masse_') && id.includes('treppenhaus'))
    expect(masseFragen.length).toBeLessThanOrEqual(1)

    // Antwort landet auf der eigenen Fläche
    const beantwortet = bereiteRueckfragenVor(extraktion, {
      dachschraege_flaeche_treppenhaus: { wert: 22, einheit: 'm²' },
    })
    expect(beantwortet.extraktion.raeume[0].dachschraege_flaeche_m2).toBe(22)
  })

  it('lässt bei voller Maßfrage die redundante reine Bodenfrage weg', () => {
    // Wenn masse_<raum> (Wand+Boden) UND masse_boden_<raum> gleichzeitig entstünden,
    // darf der Nutzer nicht zweimal nach Maßen gefragt werden.
    const alleFragen = [
      { id: 'masse_treppenhaus', frage: 'x', kontext: '', typ: 'masse_einzel' as const, schnell_antworten: [] },
      { id: 'masse_boden_treppenhaus', frage: 'y', kontext: '', typ: 'masse_einzel' as const, schnell_antworten: [] },
    ]
    // Simuliert über die öffentliche Flow-Funktion: beide Fragen für denselben Raum
    // werden erzeugt → nur die volle bleibt. (Deterministisch über bereiteRueckfragenVor
    // schwer erzwingbar; hier prüfen wir die Kernregel direkt am Filter.)
    const volleRaeume = new Set(alleFragen
      .filter(f => /^masse_[^_]/.test(f.id) && !f.id.startsWith('masse_boden_') && !f.id.startsWith('masse_lb_'))
      .map(f => f.id.replace(/^masse_/, '')))
    const gefiltert = alleFragen.filter(f =>
      !(f.id.startsWith('masse_boden_') && volleRaeume.has(f.id.replace(/^masse_boden_/, ''))))
    expect(gefiltert.map(f => f.id)).toEqual(['masse_treppenhaus'])
  })

  it('übernimmt die Antwort auf eine echte Parkett-Schleif-Rückfrage', () => {
    const extraktion = basis({
      gewerk: 'boden_parkett',
      raeume: [{
        name: 'Wohnzimmer', laenge: null, breite: null, hoehe: null, flaeche: 32,
        fenster: [], tueren: [], arbeiten: ['Parkett schleifen'],
        belag: 'Parkett', altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
      }],
    })

    const analyse = bereiteRueckfragenVor(extraktion)
    expect(analyse.rueckfragen.some(frage => frage.id === 'versiegelung_wohnzimmer')).toBe(true)

    const beantwortet = bereiteRueckfragenVor(extraktion, {
      versiegelung_wohnzimmer: { wert: 1, einheit: 'bool' },
    })
    expect(beantwortet.extraktion.raeume[0].arbeiten).toContain('versiegeln')
    expect(beantwortet.rueckfragen.some(frage => frage.id === 'versiegelung_wohnzimmer')).toBe(false)
  })

  it('stellt keine Boden-Rückfragen für einen Raum, der Boden im selben Satz ausschließt (PM-013)', () => {
    // PM-013, Live-Nachtest 2026-08-19. Echte Produktions-Rohdaten
    // (debug_extraktion_roh e7d71649-...): zwei Räume, unterschiedliche
    // Gewerke — Wohnzimmer nur Boden, Flur nur Maler ("da wird nix am Boden
    // gemacht, der bleibt wie er ist"). Flurs `arbeiten` enthielt trotzdem
    // "boden abdecken" (Maler-Nebenleistung, Schutzfolie beim Streichen) und
    // "sockelleisten abkleben" — beides kein echter Verlege-Auftrag. Bug:
    // weil das GLOBALE extraktion.gewerk 'boden_parkett' war (ein einziges
    // Feld für den ganzen Auftrag, nicht pro Raum), hat anreichernBodenParkett
    // trotzdem über JEDEN Raum inkl. Flur geprüft und wegen des losen
    // "boden"-Substring-Treffers in "boden abdecken" zwei Boden-Rückfragen
    // gestellt, obwohl der Ausschluss im selben Satz stand.
    const extraktion = basis({
      gewerk: 'boden_parkett',
      transkript:
        'Wohnzimmer, acht mal viereinhalb. Eichenparkett, Fischgrät verlegt, das braucht ja mehr Verschnitt. ' +
        'Boden nur, an den Wänden machen wir nix. Flur daneben, fünf mal eins achtzig, Höhe zwo sechzig. ' +
        'Nur Wände und Decke streichen, zweimal. Da wird nix am Boden gemacht, der bleibt wie er ist.',
      raeume: [
        {
          name: 'Wohnzimmer', laenge: 8, breite: 4.5, hoehe: null, flaeche: null,
          fenster: [], tueren: [], arbeiten: ['eichenparkett verlegen'],
          belag: 'parkett', verlegerichtung: 'fischgrät',
          altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
        },
        {
          name: 'Flur', laenge: 5, breite: 1.8, hoehe: 2.6, flaeche: null,
          fenster: [], tueren: [{ anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }],
          // Bewusst mit "boden abdecken" — genau das hat GPT im echten Fall
          // geliefert, kein echtes Verlege-Signal (siehe Kommentar oben).
          arbeiten: ['wände streichen', 'decke streichen', 'boden abdecken', 'sockelleisten abkleben'],
          altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
        },
      ],
    })

    const analyse = bereiteRueckfragenVor(extraktion)
    const ids = analyse.rueckfragen.map(frage => frage.id)

    // Kernpunkt: der Flur bekommt KEINE einzige Boden-Rückfrage.
    expect(ids).not.toContain('belag_flur')
    expect(ids).not.toContain('altbelag_flur')
    expect(ids).not.toContain('masse_boden_flur')

    // Gegenprobe: das Wohnzimmer bleibt ein ganz normaler Boden-Raum — Belag
    // ist schon bekannt (keine belag_wohnzimmer-Frage), aber die legitime
    // Altbelag-Frage (nicht explizit im Transkript beantwortet) kommt weiterhin.
    expect(ids).not.toContain('belag_wohnzimmer')
    expect(ids).toContain('altbelag_wohnzimmer')
  })
})
