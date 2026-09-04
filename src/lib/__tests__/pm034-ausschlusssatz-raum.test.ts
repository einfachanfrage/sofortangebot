import { describe, it, expect } from 'vitest'
import { ausgeschlosseneRaeume, hatKeinerleiArbeit } from '../raum-ausschluss'
import { generiereRueckfragen } from '../mengen/rueckfragen-generator'

// PM-034, Befund 3 (Prüfmeister, 02.09.2026)
//
// Gesagt: „Im Flur machen wir nichts am Boden, der bleibt, wie er ist."
// Gefragt: „Welche Maße kennst du für „Keine Arbeiten am Boden im Flur.“?"
//
// Der Raum unten ist 1:1 aus der Produktionsdatenbank (entwurf_aufnahmen,
// Diktat vom 03.09.). Wichtig für die Einordnung: Die KI-Extraktion ist hier
// RICHTIG — der Raum heißt „Flur", die Beschreibung steht im dafür
// vorgesehenen Feld. Die Frage entstand erst in unserem Code.
const TRANSKRIPT =
  'Küche, 360 x 3, da liegen alte Fliesen, die müssen raus und danach muss der Boden gespachtelt werden. ' +
  'Ausgleichsmasse, der ist ziemlich uneben. Dann Click-Vinyl drauf, gerade verlegt. ' +
  'Esszimmer daneben, 4 x 350. Der Untergrund ist in Ordnung, da reicht Grundierung. Dann dasselbe Vinyl. ' +
  'Im Flur machen wir nichts am Boden, der bleibt, wie er ist. ' +
  'Sockelleisten in Küche und Esszimmer neu, je 1 Tür.'

function pm034Raeume() {
  return [
    {
      name: 'Küche', laenge: 3.6, breite: 3, hoehe: null, flaeche: null, vage: false,
      belag: 'click-vinyl',
      arbeiten: ['alte fliesen entfernen', 'boden spachteln', 'click-vinyl verlegen', 'sockelleisten erneuern'],
      altbelag_entfernen: true, sockelleisten: true, ausgleich: true,
      vage_typ: null as string | null, vage_beschreibung: null as string | null,
    },
    {
      name: 'Esszimmer', laenge: 4, breite: 3.5, hoehe: null, flaeche: null, vage: false,
      belag: 'click-vinyl',
      arbeiten: ['grundierung', 'click-vinyl verlegen', 'sockelleisten erneuern'],
      altbelag_entfernen: false, sockelleisten: true, ausgleich: false,
      vage_typ: null as string | null, vage_beschreibung: null as string | null,
    },
    {
      name: 'Flur', laenge: null, breite: null, hoehe: null, flaeche: null, vage: true,
      belag: null,
      arbeiten: [] as string[],
      altbelag_entfernen: false, sockelleisten: false, ausgleich: false,
      vage_typ: 'raum_ohne_masse' as string | null,
      vage_beschreibung: 'Keine Arbeiten am Boden im Flur.' as string | null,
    },
  ]
}

describe('PM-034, Befund 3 — abbestellte Räume erkennen', () => {
  it('erkennt den Flur als abbestellt, Küche und Esszimmer nicht', () => {
    const treffer = ausgeschlosseneRaeume(pm034Raeume(), TRANSKRIPT)
    expect([...treffer.keys()]).toEqual(['Flur'])
    expect(treffer.get('Flur')).toBe('Keine Arbeiten am Boden im Flur.')
  })

  it('findet den Ausschluss auch ohne KI-Beschreibung, allein im Transkript', () => {
    const raeume = pm034Raeume()
    raeume[2].vage_beschreibung = null
    const treffer = ausgeschlosseneRaeume(raeume, TRANSKRIPT)
    expect(treffer.get('Flur')).toContain('machen wir nichts am Boden')
  })

  it('braucht BEIDES — ohne Arbeiten allein reicht nicht', () => {
    // Ein Raum ohne zugeordnete Arbeiten, aber ohne Absage im Text: Das ist
    // der normale „die KI hat nichts zugeordnet"-Fall. Da MUSS gefragt werden.
    const raeume = [{
      name: 'Flur', laenge: null, breite: null, vage: true, belag: null, arbeiten: [] as string[],
      vage_typ: 'raum_ohne_masse' as string | null, vage_beschreibung: null as string | null,
    }]
    expect(ausgeschlosseneRaeume(raeume, 'Im Flur kommt auch noch was hin.').size).toBe(0)
  })

  it('braucht BEIDES — eine Absage bei einem Raum MIT Auftrag zählt nicht', () => {
    // „Sockelleisten bleiben" ist eine Absage für EINE Leistung, nicht für den
    // ganzen Raum. Der Raum wird verlegt und braucht seine Maße.
    const raeume = [{
      name: 'Wohnzimmer', laenge: null, breite: null, vage: true,
      belag: 'parkett', arbeiten: ['parkett verlegen'],
      vage_typ: 'raum_ohne_masse' as string | null, vage_beschreibung: null as string | null,
    }]
    expect(ausgeschlosseneRaeume(raeume, 'Im Wohnzimmer Parkett. Sockelleisten bleiben, wie sie sind.').size).toBe(0)
  })

  it('hatKeinerleiArbeit zählt auch die stillen Flags mit', () => {
    expect(hatKeinerleiArbeit({ name: 'Flur', arbeiten: [] })).toBe(true)
    expect(hatKeinerleiArbeit({ name: 'Flur', arbeiten: [], ausgleich: true })).toBe(false)
    expect(hatKeinerleiArbeit({ name: 'Flur', arbeiten: [], altbelag_entfernen: true })).toBe(false)
    expect(hatKeinerleiArbeit({ name: 'Flur', arbeiten: [], belag: 'vinyl' })).toBe(false)
    expect(hatKeinerleiArbeit({ name: 'Flur', arbeiten: ['  '] })).toBe(true)
  })
})

describe('PM-034, Befund 3 — es wird gar nicht mehr gefragt', () => {
  it('keine Maßfrage für den abbestellten Flur', () => {
    const fragen = generiereRueckfragen({ transkript: TRANSKRIPT, raeume: pm034Raeume() })
    expect(fragen).toEqual([])
  })

  it('ein vager Raum OHNE Absage wird weiterhin gefragt — mit richtigem Artikel', () => {
    const fragen = generiereRueckfragen({
      transkript: 'Im Flur kommt Vinyl rein.',
      raeume: [{
        name: 'Flur', vage: true, vage_typ: 'raum_ohne_masse', vage_beschreibung: null,
        belag: 'vinyl', arbeiten: ['vinyl verlegen'],
      }],
    })
    expect(fragen).toHaveLength(1)
    // PM-034-Nebenfund: hieß vorher „Wie groß ist den Flur?"
    expect(fragen[0].frage).toBe('Wie groß ist der Flur?')
  })

  it('die Artikel stimmen auch sonst', () => {
    const frageFuer = (name: string) => generiereRueckfragen({
      raeume: [{ name, vage: true, vage_typ: 'raum_ohne_masse', vage_beschreibung: null, arbeiten: ['streichen'] }],
    })[0].frage
    expect(frageFuer('Küche')).toBe('Wie groß ist die Küche?')
    expect(frageFuer('Wohnzimmer')).toBe('Wie groß ist das Wohnzimmer?')
    expect(frageFuer('Keller')).toBe('Wie groß ist der Keller?')
    expect(frageFuer('Büro')).toBe('Wie groß ist das Büro?')
    expect(frageFuer('Diele')).toBe('Wie groß ist die Diele?')
  })

  it('ohne Transkript bleibt die KI-Beschreibung der Beleg', () => {
    const fragen = generiereRueckfragen({ raeume: pm034Raeume() })
    expect(fragen).toEqual([])
  })
})
