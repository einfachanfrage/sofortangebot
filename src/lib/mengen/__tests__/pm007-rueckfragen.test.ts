import { describe, expect, it } from 'vitest'
import { bereiteRueckfragenVor } from '../rueckfragen-flow'
import type { ExtrahierteDaten } from '../types'

// PM-007 (Sandy, Nachtest 2026-08-21/24): „Endlosschleife Rückfrage —
// Katastrophe". Beim Dachgeschoss-Fall kam die Frage „Wie groß ist die
// Bodenfläche in 'Dachzimmer'?", und „Später ergänzen"/„Trotzdem
// überspringen" führte nicht zum Entwurf, sondern erneut zu derselben Maske.
//
// Zwei getrennte Ursachen, beide hier abgesichert:
//   1. Die Frage hätte nie gestellt werden dürfen — „fünf mal dreieinhalb"
//      steht im Transkript, GPT liefert laenge=5/breite=3.5 und lässt nur
//      `flaeche` leer. Genau daran hing die Frage.
//   2. Überspringen kam nie beim Server an, die Frage entstand also jedes Mal
//      neu. Ein ausdrückliches `null` beendet die Schleife.

const TRANSKRIPT = 'Dachzimmer, fünf mal dreieinhalb. Kniestock ist eins zwanzig hoch. Die Dachschrägen links und rechts jeweils zwölf Quadratmeter. Ein Dachfenster drin, normale Größe. Wände, Schrägen und Kniestock alles streichen, zweimal.'

// 1:1 aus der Produktions-Datenbank (Angebot 93192e79, Sandys Lauf) — nicht
// nachgebaut, sondern der echte GPT-Output, inklusive der falsch einsortierten
// `wandflaeche_direkt: 12` (das sind in Wahrheit die Dachschrägen-Quadratmeter).
const DACHZIMMER = {
  name: 'Dachzimmer', vage: false, hoehe: null, breite: 3.5, laenge: 5,
  tueren: [], umfang: null, fenster: [{ anzahl: 1, annahme: false }], flaeche: null,
  arbeiten: ['wände streichen', 'decke streichen', 'boden abdecken', 'sockelleisten abkleben'],
  vage_typ: null, ausgleich: false,
  dachfenster: [{ hoehe: 1, anzahl: 1, breite: 1.2, annahme: true }],
  nassbereich: false, sockelleisten: false, kniestockhoehe: 1.2,
  deckenspiegel_m2: null, parkett_schleifen: false, vage_beschreibung: null,
  altbelag_entfernen: false, altbelag_vorhanden: false, deckflaeche_direkt: null,
  wandflaeche_direkt: 12, feuchtigkeitssperre: false, wandflaeche_abzug_m2: null,
  dachschraege_links_m2: null, dachschraege_rechts_m2: null,
  dachschraege_flaeche_m2: null, dachschraege_je_seite_m2: 12,
}

function extraktion(raum: Record<string, unknown> = DACHZIMMER, transkript = TRANSKRIPT): ExtrahierteDaten {
  return {
    gewerk: 'maler', confidence_gewerk: 1,
    kunde: { name: null, adresse: null, ort: null },
    raeume: [raum], waende: [], decken: [], bereiche: [],
    steckdosen: null, schalter: null, spots: null, aussenlampen: null, wandlampen: null,
    herdanschluss: false, wallbox: false, unterverteilung: false, hauptverteilung: false,
    kabelmeter: null, neu_verkabeln: false,
    wc: null, waschtisch: null, dusche: null, wanne: null, urinal: null, bidet: null,
    armaturen: null, rohrmeter: null, leitungen_erneuern: false, heizkoerper: null,
    austausch: false, erneuerung: false, altbelag: [], erschwernisse: [],
    anmerkungen: null, fehlende_angaben: [], transkript,
  } as unknown as ExtrahierteDaten
}

describe('PM-007 – die Bodenflächen-Rückfrage', () => {
  it('stellt bei Sandys Dachgeschoss-Fall gar keine Rückfrage mehr', () => {
    const { rueckfragen } = bereiteRueckfragenVor(extraktion(), {}, TRANSKRIPT)
    expect(rueckfragen).toEqual([])
  })

  it('leitet die Bodenfläche aus Länge × Breite ab, statt danach zu fragen', () => {
    const { extraktion: angereichert } = bereiteRueckfragenVor(extraktion(), {}, TRANSKRIPT)
    expect(angereichert.raeume[0].flaeche).toBe(17.5)
  })

  it('fragt weiterhin, wenn wirklich keine Maße dastehen', () => {
    // Gegenprobe: der Fix darf die Frage nicht generell abschaffen.
    const ohneMasse = { ...DACHZIMMER, laenge: null, breite: null, flaeche: null }
    const { rueckfragen } = bereiteRueckfragenVor(extraktion(ohneMasse), {}, 'Dachzimmer streichen.')
    expect(rueckfragen.length).toBeGreaterThan(0)
  })
})

describe('PM-007 – keine Fragen nach Zahlen, die niemand benutzt', () => {
  it('fragt im Dachgeschoss nicht nach der Wandhöhe', () => {
    // Der Dachgeschoss-Zweig der Engine rechnet über Kniestockhöhe und
    // Dachschrägen-m² — `raum.hoehe` liest er nie. Im echten Lauf blieb die
    // Frage nur deshalb aus, weil GPT versehentlich eine (falsche)
    // `wandflaeche_direkt` gesetzt hatte. Ohne diesen Zufall kam sie.
    const sauber = { ...DACHZIMMER, wandflaeche_direkt: null }
    const { rueckfragen } = bereiteRueckfragenVor(extraktion(sauber), {}, TRANSKRIPT)
    expect(rueckfragen.map(f => f.id)).not.toContain('hoehe_dachzimmer')
  })

  it('fragt in einem normalen Raum weiterhin nach der Wandhöhe', () => {
    // Gegenprobe: dort braucht die Berechnung die Höhe wirklich.
    const normal = {
      ...DACHZIMMER, kniestockhoehe: null, dachschraege_je_seite_m2: null,
      dachfenster: [], wandflaeche_direkt: null, hoehe: null,
    }
    const { rueckfragen } = bereiteRueckfragenVor(extraktion(normal), {}, 'Wohnzimmer streichen, fünf mal dreieinhalb.')
    expect(rueckfragen.map(f => f.id)).toContain('hoehe_dachzimmer')
  })
})

describe('PM-007 – Überspringen muss die Schleife beenden', () => {
  // Raum ohne jedes Maß: hier gibt es eine echte, offene Frage.
  const OHNE_MASSE = { ...DACHZIMMER, laenge: null, breite: null, flaeche: null, wandflaeche_direkt: null }

  it('stellt dieselbe Frage erneut, wenn gar nichts mitgeschickt wird', () => {
    // Das war der Zustand VOR dem Fix — hier festgehalten, damit klar bleibt,
    // was die Endlosschleife ausgelöst hat.
    const runde1 = bereiteRueckfragenVor(extraktion(OHNE_MASSE), {}, 'Dachzimmer streichen.')
    const runde2 = bereiteRueckfragenVor(extraktion(OHNE_MASSE), {}, 'Dachzimmer streichen.')
    expect(runde2.rueckfragen.map(f => f.id)).toEqual(runde1.rueckfragen.map(f => f.id))
  })

  it('stellt eine ausdrücklich übersprungene Frage NICHT erneut', () => {
    const runde1 = bereiteRueckfragenVor(extraktion(OHNE_MASSE), {}, 'Dachzimmer streichen.')
    expect(runde1.rueckfragen.length).toBeGreaterThan(0)

    // Genau das schickt der Bildschirm jetzt beim Überspringen: der Schlüssel
    // ist da, der Wert ist `null`.
    const uebersprungen = Object.fromEntries(runde1.rueckfragen.map(f => [f.id, null]))
    const runde2 = bereiteRueckfragenVor(extraktion(OHNE_MASSE), uebersprungen, 'Dachzimmer streichen.')
    expect(runde2.rueckfragen).toEqual([])
  })

  it('verträgt eine Mischung aus beantwortet und übersprungen', () => {
    const runde1 = bereiteRueckfragenVor(extraktion(OHNE_MASSE), {}, 'Dachzimmer streichen.')
    const ids = runde1.rueckfragen.map(f => f.id)
    const gemischt: Record<string, { wert: number; einheit: string } | null> = {}
    ids.forEach((id, i) => { gemischt[id] = i === 0 ? { wert: 20, einheit: 'm²' } : null })

    const runde2 = bereiteRueckfragenVor(extraktion(OHNE_MASSE), gemischt as never, 'Dachzimmer streichen.')
    // Keine der bereits erledigten Fragen darf zurückkommen — weder die
    // beantwortete noch die übersprungene. Dass durch die neue Antwort eine
    // ANSCHLUSSFRAGE entstehen kann (nach der Fläche wird die Raumhöhe für die
    // Wandfläche gebraucht), ist gewollt und keine Schleife.
    for (const id of ids) {
      expect(runde2.rueckfragen.map(f => f.id)).not.toContain(id)
    }
  })
})
