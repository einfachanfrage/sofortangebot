import { describe, it, expect } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { zaehleFenster, zaehleTueren, extrahiereRaumhoehe } from '../extraktion-masse'

// ── GOLDEN CORPUS ───────────────────────────────────────────────────────────
// Fährt die ECHTE Pipeline (Engine + Vollständigkeit) mit den ECHTEN
// Gewerk-Strings ('maler' / 'boden_parkett'), so wie angebot-extrahieren es tut.
// Kein Stellvertreter-Pfad — genau der Drift, der "Boden lief in Prod nie" verursachte.
//
// Zwei Sicherungen je Fall:
//   muss[]     — Substrings, die als Position auftauchen MÜSSEN
//   verboten[] — Substrings, die NIE auftauchen dürfen (Phantom-/Falschklassen)
// Plus globale Invarianten, die ganze Fehlerklassen fangen.

type Raum = Record<string, unknown> & { name: string; arbeiten?: string[] }
interface Fall {
  name: string
  gewerk: 'maler' | 'boden_parkett'
  transkript: string
  raeume: Raum[]
  muss: string[]
  verboten: string[]
}

// Spiegelt den deterministischen Kern von angebot-extrahieren
function pipeline(fall: Fall): string[] {
  const eng = berechneMengen(fall.gewerk, { transkript: fall.transkript, raeume: fall.raeume, gewerk: fall.gewerk })
  const signale = {
    arbeitenTexte: fall.raeume.flatMap(r => r.arbeiten ?? []),
    belagText: (fall.raeume.find(r => r.belag) as { belag?: string } | undefined)?.belag ?? null,
    altbelagEntfernen: fall.raeume.some(r => (r as { altbelag_entfernen?: boolean }).altbelag_entfernen === true),
  }
  const meta = {
    fensterAnzahl: zaehleFenster(fall.transkript) || undefined,
    tuerenAnzahl: zaehleTueren(fall.transkript) || undefined,
  }
  const { positionen } = pruefeUndErgaenzeVollstaendigkeit(fall.gewerk, eng.positionen, fall.transkript, meta, signale)
  return positionen.map(p => p.beschreibung)
}

const KORPUS: Fall[] = [
  {
    name: 'Wohnzimmer komplett streichen (Bodenfläche + Kompakt-Höhe)',
    gewerk: 'maler',
    transkript: 'hier im wohnzimmer muss komplett gestrichen werden, 25 quadratmeter bodenfläche, 2 meter 60 hoch, 2 fenster 1 tür',
    raeume: [{ name: 'Wohnzimmer', flaeche: 25, hoehe: 2.6, arbeiten: ['wände streichen', 'decke streichen'], fenster: [{ anzahl: 2 }], tueren: [{ anzahl: 1 }] }],
    muss: ['wandflächen streichen', 'deckenfläche streichen'],
    verboten: ['estrich', 'epoxid', 'erschwerniszuschlag'],
  },
  {
    name: 'Tapete ab + glattgemacht + gestrichen (der Frust-Fall)',
    gewerk: 'maler',
    transkript: 'wohnzimmer, muss erst die tapete ab und dann die wände glattgemacht werden und dann gestrichen, 24 quadratmeter bodenfläche, 2,60 hoch',
    raeume: [{ name: 'Wohnzimmer', flaeche: 24, hoehe: 2.6, arbeiten: ['tapete entfernen', 'wände glätten', 'streichen'] }],
    muss: ['wandflächen streichen', 'tapete entfernen', 'spachteln'],
    verboten: ['estrich', 'epoxid'],
  },
  {
    name: 'Nur die Wände streichen (kein Decke)',
    gewerk: 'maler',
    transkript: 'schlafzimmer nur die wände streichen, 4 mal 5 meter, 2,50 hoch',
    raeume: [{ name: 'Schlafzimmer', laenge: 5, breite: 4, hoehe: 2.5, arbeiten: ['wände streichen'] }],
    muss: ['wandflächen streichen'],
    verboten: ['deckenfläche streichen', 'estrich'],
  },
  {
    name: 'Flur: verklebter Teppich + garbeltes Klick-Vinyl (Prod-Fall)',
    gewerk: 'boden_parkett',
    transkript: 'im flur soll der alte teppich raus, der ist verklebt, kleberreste abschleifen, danach glykvenyl rein, 18 quadratmeter, sockelleisten neu',
    raeume: [{ name: 'Flur', flaeche: 18, belag: 'glykvenyl', altbelag_entfernen: true, sockelleisten: true, arbeiten: ['glykvenyl verlegen', 'teppich entfernen', 'kleberreste abschleifen', 'sockelleisten'] }],
    muss: ['vinyl', 'kleberreste', 'sockelleisten'],
    verboten: ['glykvenyl', 'estrich'],
  },
  {
    name: 'Laminat verlegen mit Maßen',
    gewerk: 'boden_parkett',
    transkript: 'kinderzimmer neuen laminat verlegen, 4 mal 5 meter',
    raeume: [{ name: 'Kinderzimmer', laenge: 5, breite: 4, belag: 'laminat', sockelleisten: true, arbeiten: ['laminat verlegen', 'sockelleisten'] }],
    muss: ['laminat'],
    verboten: ['estrich', 'glykvenyl'],
  },
  {
    name: 'Hohe Decke → Erschwerniszuschlag KORREKT (Positiv-Fall)',
    gewerk: 'maler',
    transkript: 'loft streichen, 4 meter hohe decke, 40 quadratmeter wandfläche',
    raeume: [{ name: 'Loft', wandflaeche_direkt: 40, hoehe: 4, arbeiten: ['wände streichen'] }],
    muss: ['wandflächen streichen', 'erschwerniszuschlag'],
    verboten: ['estrich'],
  },
  {
    name: 'Zwei Räume streichen (Wände + Decke)',
    gewerk: 'maler',
    transkript: 'wohnzimmer und flur streichen, wände und decke, jeweils 20 quadratmeter, 2,50 hoch',
    raeume: [
      { name: 'Wohnzimmer', flaeche: 20, hoehe: 2.5, arbeiten: ['wände streichen', 'decke streichen'] },
      { name: 'Flur', flaeche: 20, hoehe: 2.5, arbeiten: ['wände streichen', 'decke streichen'] },
    ],
    muss: ['wandflächen streichen', 'deckenfläche streichen'],
    verboten: ['estrich', 'erschwerniszuschlag'],
  },
  {
    name: 'Parkett abschleifen + versiegeln',
    gewerk: 'boden_parkett',
    transkript: 'altes eichenparkett abschleifen und versiegeln, 35 quadratmeter',
    raeume: [{ name: 'Zimmer', flaeche: 35, belag: 'parkett', parkett_schleifen: true, arbeiten: ['parkett schleifen', 'versiegeln'] }],
    muss: ['schleifen', 'versiegel'],
    // "verlegen" verboten: bei reinem Abschleifen wird KEIN neuer Boden gelegt
    verboten: ['estrich', 'glykvenyl', 'verlegen'],
  },
  {
    name: 'Fassade außen streichen',
    gewerk: 'maler',
    transkript: 'hausfassade komplett neu streichen, 120 quadratmeter außenwand',
    raeume: [{ name: 'Fassade', wandflaeche_direkt: 120, arbeiten: ['fassade streichen'] }],
    muss: ['streichen'],
    verboten: ['estrich', 'erschwerniszuschlag', 'deckenfläche streichen'],
  },
]

describe('Golden Corpus — echte Pipeline, echte Gewerk-Strings', () => {
  it.each(KORPUS)('$name', (fall) => {
    const namen = pipeline(fall).map(n => n.toLowerCase())

    for (const m of fall.muss) {
      expect(namen.some(n => n.includes(m)), `MUSS enthalten: "${m}" — hat: ${namen.join(' | ')}`).toBe(true)
    }
    for (const v of fall.verboten) {
      expect(namen.some(n => n.includes(v)), `VERBOTEN: "${v}" — hat: ${namen.join(' | ')}`).toBe(false)
    }
  })
})

describe('Golden Corpus — globale Invarianten (fangen ganze Fehlerklassen)', () => {
  it.each(KORPUS)('$name', (fall) => {
    const eng = berechneMengen(fall.gewerk, { transkript: fall.transkript, raeume: fall.raeume, gewerk: fall.gewerk })
    const signale = {
      arbeitenTexte: fall.raeume.flatMap(r => r.arbeiten ?? []),
      belagText: (fall.raeume.find(r => r.belag) as { belag?: string } | undefined)?.belag ?? null,
      altbelagEntfernen: fall.raeume.some(r => (r as { altbelag_entfernen?: boolean }).altbelag_entfernen === true),
    }
    const { positionen } = pruefeUndErgaenzeVollstaendigkeit(fall.gewerk, eng.positionen, fall.transkript,
      { fensterAnzahl: zaehleFenster(fall.transkript) || undefined, tuerenAnzahl: zaehleTueren(fall.transkript) || undefined }, signale)
    const t = fall.transkript.toLowerCase()

    // 1) Kein erfundenes Boden-Coating aus Maßangaben/"gestrichen"
    if (!/\bestrich/.test(t)) expect(positionen.some(p => /\bestrich/i.test(p.beschreibung))).toBe(false)
    if (!t.includes('epoxid')) expect(positionen.some(p => /epoxid/i.test(p.beschreibung))).toBe(false)

    // 2) Kein falscher Erschwerniszuschlag bei normaler Höhe
    const hoehe = extrahiereRaumhoehe(t)
    if ((hoehe == null || hoehe <= 3) && !t.includes('hohe decke')) {
      expect(positionen.some(p => /erschwerniszuschlag/i.test(p.beschreibung))).toBe(false)
    }

    // 3) Keine kaputten Mengen (NaN / ≤0) — die "Nullerpositionen"-Klasse
    for (const p of positionen) {
      expect(Number.isFinite(p.menge), `NaN-Menge: ${p.beschreibung}`).toBe(true)
      expect(p.menge > 0, `Menge ≤ 0: ${p.beschreibung}`).toBe(true)
    }

    // 4) Keine exakten Duplikate (Beschreibung + Menge)
    const keys = positionen.map(p => `${p.beschreibung.toLowerCase()}|${p.menge}`)
    expect(new Set(keys).size, `Duplikate: ${keys.join(' , ')}`).toBe(keys.length)
  })
})
