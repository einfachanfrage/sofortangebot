import { describe, it, expect } from 'vitest'
import { verarbeiteExtraktion } from '@/lib/mengen/extraktion-pipeline'
import { istMalerArbeit, malerImRohtext } from '@/lib/mengen/mehrgewerk'

// ── Der Umbau, den dieser Testfile absichert (03.09.2026) ─────────────────
//
// Die Boden-Vollständigkeitsprüfung lief bis hierher genau EINMAL über den
// ganzen Auftrag. Für einen Raum ist das richtig; bei mehreren Räumen war es
// die gemeinsame Ursache von fünf Befunden aus dem Boden-Batch. Statt der
// sechsten Einzelreparatur prüft sie jetzt jeden Raum als eigene kleine Welt
// (seine Sätze, seine Positionen, sein Auftrags-Verständnis) — außer den
// Prüfungen, die von Natur aus zwischen Räumen stattfinden.
//
// Die Diktate unten sind die Original-Texte des Prüfmeisters, die Räume die
// Struktur, wie sie in der Produktionsdatenbank steht.

function lauf(text: string, raeume: unknown[]) {
  const result = {
    gewerk: 'boden_parkett', raeume,
    bereiche: [], waende: [], decken: [], objekte: [], annahmen: [], transkript: text,
  }
  return verarbeiteExtraktion(text, { result } as never).mengen.positionen
    .map(p => ({ titel: p.beschreibung, menge: p.menge, einheit: p.einheit }))
}
const raum = (o: Record<string, unknown>) => ({
  hoehe: null, flaeche: null, verlegerichtung: 'standard', fenster: [], tueren: [],
  altbelag_entfernen: false, sockelleisten: false, nassbereich: false,
  ausgleich: false, feuchtigkeitssperre: false, parkett_schleifen: false, vage: false,
  ...o,
})
const menge = (p: Array<{ titel: string; menge: number }>, teil: string, raumName?: string) =>
  p.find(x => x.titel.includes(teil) && (!raumName || x.titel.endsWith(raumName)))?.menge

describe('PM-032 — ein Belag über drei Räume', () => {
  const TEXT = 'Erdgeschosswohnung. Flur, sechs mal eins zwanzig. Wohnzimmer, fünf mal vier. '
    + 'Küche, drei mal zwo achtzig. Überall dasselbe Klick-Vinyl, gerade verlegt, durchgehend ohne '
    + 'Schwellen — das läuft von der Küche durch den Flur ins Wohnzimmer. Trittschalldämmung drunter. '
    + 'Nur zum Bad hin kommt eine Übergangsschiene, im Bad selbst machen wir nichts. '
    + 'Sockelleisten überall neu, weiße MDF. Jeder Raum hat eine normale Tür.'
  const RAEUME = [
    raum({ name: 'Flur', laenge: 6, breite: 1.2, belag: 'klick-vinyl', arbeiten: ['klick-vinyl verlegen', 'sockelleisten erneuern'], tueren: [{ anzahl: 1, breite: 0.9, hoehe: 2.1 }], sockelleisten: true }),
    raum({ name: 'Wohnzimmer', laenge: 5, breite: 4, belag: 'klick-vinyl', arbeiten: ['klick-vinyl verlegen', 'sockelleisten erneuern'], tueren: [{ anzahl: 1, breite: 0.9, hoehe: 2.1 }], sockelleisten: true }),
    raum({ name: 'Küche', laenge: 3, breite: 2.8, belag: 'klick-vinyl', arbeiten: ['klick-vinyl verlegen', 'sockelleisten erneuern'], tueren: [{ anzahl: 1, breite: 0.9, hoehe: 2.1 }], sockelleisten: true }),
  ]

  it('Trittschalldämmung in ALLEN drei Räumen — der Befund, der dreimal repariert wurde', () => {
    const p = lauf(TEXT, RAEUME)
    expect(menge(p, 'Trittschalldämmung', 'Flur')).toBe(7.2)
    expect(menge(p, 'Trittschalldämmung', 'Wohnzimmer')).toBe(20)
    expect(menge(p, 'Trittschalldämmung', 'Küche')).toBe(8.4)
    // 35,60 m² statt 7,20 — es fehlten 28,40 m² zulasten des Betriebs.
    const summe = p.filter(x => x.titel.includes('Trittschall')).reduce((s, x) => s + x.menge, 0)
    expect(summe).toBe(35.6)
  })

  it('genau EINE Übergangsschiene — die Falle, auf die dieser Fall gebaut war', () => {
    expect(menge(lauf(TEXT, RAEUME), 'Übergangsschiene')).toBe(1)
  })

  it('Belag und Sockelleisten unverändert exakt Soll', () => {
    const p = lauf(TEXT, RAEUME)
    expect([menge(p, 'verlegen', 'Flur'), menge(p, 'verlegen', 'Wohnzimmer'), menge(p, 'verlegen', 'Küche')])
      .toEqual([7.56, 21, 8.82])
    expect([menge(p, 'Sockelleisten montieren', 'Flur'), menge(p, 'Sockelleisten montieren', 'Wohnzimmer'), menge(p, 'Sockelleisten montieren', 'Küche')])
      .toEqual([13.5, 17.1, 10.7])
  })

  it('kein Bad in irgendeiner Form', () => {
    expect(lauf(TEXT, RAEUME).some(x => /bad/i.test(x.titel))).toBe(false)
  })
})

describe('PM-033 — drei Beläge, drei Verschnittsätze', () => {
  const TEXT = 'Wohnzimmer, sechs mal vier fünfzig, da kommt Eichenparkett rein, Fischgrät verlegt. '
    + 'Schlafzimmer, vier mal drei sechzig, da wollen die Teppich, Bahnenware. '
    + 'Flur, fünf mal eins fünfzig, da kommt Laminat, ganz normal gerade. '
    + 'An den beiden Türen zum Wohnzimmer und zum Schlafzimmer jeweils eine Übergangsschiene, weil ja unterschiedliche Beläge. '
    + 'Trittschall nur unterm Laminat im Flur. Sockelleisten bleiben überall, wie sie sind.'
  const RAEUME = [
    raum({ name: 'Wohnzimmer', laenge: 6, breite: 4.5, belag: 'eichenparkett', verlegerichtung: 'fischgrät', arbeiten: ['eichenparkett verlegen'], sockelleisten: true }),
    raum({ name: 'Schlafzimmer', laenge: 4, breite: 3.6, belag: 'teppich', arbeiten: ['teppich verlegen'], sockelleisten: true }),
    raum({ name: 'Flur', laenge: 5, breite: 1.5, belag: 'laminat', arbeiten: ['laminat verlegen'], sockelleisten: true }),
  ]

  it('die drei Verschnittsätze bleiben getrennt (15 / 0 / 5 %)', () => {
    const p = lauf(TEXT, RAEUME)
    expect(menge(p, 'verlegen', 'Wohnzimmer')).toBe(31.05)
    expect(menge(p, 'verlegen', 'Schlafzimmer')).toBe(14.4)
    expect(menge(p, 'verlegen', 'Flur')).toBe(7.88)
  })

  it('keine Sockelleisten — auch nicht als raumlose „Allgemein"-Position', () => {
    expect(lauf(TEXT, RAEUME).some(x => /sockelleisten/i.test(x.titel))).toBe(false)
  })

  it('ZWEI Übergangsschienen: „an den beiden Türen … jeweils eine"', () => {
    expect(menge(lauf(TEXT, RAEUME), 'Übergangsschiene')).toBe(2)
  })
})

describe('PM-034 — Untergrundarbeiten je Raum verschieden', () => {
  const TEXT = 'Küche, drei sechzig mal drei, da liegen alte Fliesen, die müssen raus und danach muss der '
    + 'Boden gespachtelt werden. Ausgleichsmasse, der ist ziemlich uneben. Dann Click-Vinyl drauf, gerade verlegt. '
    + 'Esszimmer daneben, vier mal drei fünfzig. Der Untergrund ist in Ordnung, da reicht Grundierung. Dann dasselbe Vinyl. '
    + 'Im Flur machen wir nichts am Boden, der bleibt, wie er ist. Sockelleisten in Küche und Esszimmer neu, je eine Tür.'
  const RAEUME = [
    raum({ name: 'Küche', laenge: 360, breite: 3, belag: 'click-vinyl', arbeiten: ['alte fliesen entfernen', 'boden spachteln', 'click-vinyl verlegen', 'sockelleisten erneuern'], tueren: [{ anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }], altbelag_entfernen: true, sockelleisten: true, ausgleich: true }),
    raum({ name: 'Esszimmer', laenge: 4, breite: 350, belag: 'click-vinyl', arbeiten: ['grundierung', 'click-vinyl verlegen', 'sockelleisten erneuern'], tueren: [{ anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }], sockelleisten: true }),
    raum({ name: 'Flur', laenge: null, breite: null, belag: null, arbeiten: [], vage: true, vage_typ: 'raum_ohne_masse', vage_beschreibung: 'Keine Arbeiten am Boden im Flur.' }),
  ]

  it('Befund 5: die Grundierung im Esszimmer ist da — mit der Fläche DIESES Raums', () => {
    expect(menge(lauf(TEXT, RAEUME), 'grundieren', 'Esszimmer')).toBe(14)
  })

  it('Befund 4: keine Maler-Spachtelpositionen in einem reinen Bodenauftrag', () => {
    const p = lauf(TEXT, RAEUME)
    expect(p.some(x => /Wände spachteln|Wände schleifen|Spachtelarbeiten/i.test(x.titel))).toBe(false)
  })

  it('der Ausgleich bleibt in der Küche und schwappt nicht ins Esszimmer', () => {
    const p = lauf(TEXT, RAEUME)
    expect(menge(p, 'Ausgleich', 'Küche')).toBe(10.8)
    expect(p.some(x => /Ausgleich/i.test(x.titel) && x.titel.endsWith('Esszimmer'))).toBe(false)
  })

  it('der abbestellte Flur kommt im Angebot nicht vor', () => {
    expect(lauf(TEXT, RAEUME).some(x => x.titel.endsWith('Flur'))).toBe(false)
  })

  it('und die Maße stimmen: 11,34 statt 1.134 m², 14,70 statt 1.400 m²', () => {
    const p = lauf(TEXT, RAEUME)
    expect(menge(p, 'verlegen', 'Küche')).toBe(11.34)
    expect(menge(p, 'verlegen', 'Esszimmer')).toBe(14.7)
  })
})

describe('Gegenrichtung — was NICHT passieren darf', () => {
  it('ein Raum ohne Bodenauftrag bekommt keinen erfundenen Belag', () => {
    // PM-013 aus neuer Richtung: Vorher schützte den Flur nur, dass die
    // Verlege-Position des NACHBARZIMMERS die Regel früh aussteigen ließ.
    const TEXT = 'Wohnzimmer, acht mal vier fünfzig, Eichenparkett. Daneben ist noch der Flur, '
      + 'fünf mal eins achtzig, nur Wände und Decke streichen, da wird nix am Boden gemacht.'
    const p = lauf(TEXT, [
      raum({ name: 'Wohnzimmer', laenge: 8, breite: 4.5, belag: 'eichenparkett', arbeiten: ['eichenparkett verlegen'] }),
      raum({ name: 'Flur', laenge: 5, breite: 1.8, belag: null, arbeiten: ['wände streichen', 'decke streichen'] }),
    ])
    expect(p.some(x => /verlegen/i.test(x.titel) && x.titel.endsWith('Flur'))).toBe(false)
  })

  it('istMalerArbeit: die sechs Einträge, die es in den echten Daten gibt', () => {
    // Vier nennen ihr Objekt selbst — die bleiben Maler.
    expect(istMalerArbeit('wände grundieren', false)).toBe(true)
    expect(istMalerArbeit('wände spachteln q3', false)).toBe(true)
    expect(istMalerArbeit('decke spachteln q3', false)).toBe(true)
    expect(istMalerArbeit('decke grundieren', false)).toBe(true)
    // Einer nennt den Boden — der nicht.
    expect(istMalerArbeit('boden spachteln', false)).toBe(false)
    // Einer nennt nichts — der folgt seinem Raum.
    expect(istMalerArbeit('grundierung', false)).toBe(false)
    expect(istMalerArbeit('grundierung', true)).toBe(true)
  })

  it('istMalerArbeit: eindeutige Malerarbeit gewinnt immer, ohne Bedingung', () => {
    expect(istMalerArbeit('wände streichen', false)).toBe(true)
    expect(istMalerArbeit('tapete entfernen', false)).toBe(true)
    expect(istMalerArbeit('heizkörper lackieren', false)).toBe(true)
  })

  it('malerImRohtext: „der Boden muss gespachtelt werden" ist keine Malerarbeit', () => {
    expect(malerImRohtext('Danach muss der Boden gespachtelt werden. Ausgleichsmasse.')).toBe(false)
    expect(malerImRohtext('Der Untergrund ist in Ordnung, da reicht Grundierung.')).toBe(false)
    expect(malerImRohtext('Die Wände müssen gespachtelt werden, Q3.')).toBe(true)
    expect(malerImRohtext('Wände streichen, zweimal weiß.')).toBe(true)
  })
})
