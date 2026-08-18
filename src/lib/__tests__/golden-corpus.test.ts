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
    // Reines Abschleifen: KEIN neuer Boden, keine Untergrundvorbereitung, keine
    // neuen Sockelleisten (die alten bleiben dran)
    verboten: ['estrich', 'glykvenyl', 'verlegen', 'untergrundvorbereitung', 'sockelleisten montieren'],
  },
  {
    name: 'Fassade außen streichen',
    gewerk: 'maler',
    transkript: 'hausfassade komplett neu streichen, 120 quadratmeter außenwand',
    raeume: [{ name: 'Fassade', wandflaeche_direkt: 120, arbeiten: ['fassade streichen'] }],
    muss: ['streichen'],
    verboten: ['estrich', 'erschwerniszuschlag', 'deckenfläche streichen'],
  },

  // ── Maler Sonderregeln ────────────────────────────────────────────────────
  {
    name: 'Schimmel im Bad + streichen',
    gewerk: 'maler',
    transkript: 'im bad ist schimmel an der wand, muss behandelt und dann gestrichen werden, 12 quadratmeter, 2,40 hoch',
    raeume: [{ name: 'Bad', flaeche: 12, hoehe: 2.4, arbeiten: ['wände streichen'] }],
    muss: ['schimmel'],
    verboten: ['estrich', 'erschwerniszuschlag'],
  },
  {
    name: 'Feuchtraum Bad — abwaschbare Farbe',
    gewerk: 'maler',
    transkript: 'badezimmer streichen mit abwaschbarer feuchtraumfarbe, 10 quadratmeter wandfläche',
    raeume: [{ name: 'Bad', wandflaeche_direkt: 10, arbeiten: ['wände streichen'] }],
    muss: ['streichen'],
    verboten: ['estrich', 'erschwerniszuschlag'],
  },
  {
    name: 'Türen lackieren (3 Türen)',
    gewerk: 'maler',
    transkript: 'drei zimmertüren abschleifen grundieren und weiß lackieren',
    raeume: [{ name: 'Wohnung', arbeiten: ['türen lackieren'], tueren: [{ anzahl: 3 }] }],
    muss: ['türen', 'lackier'],
    verboten: ['estrich', 'deckenfläche streichen'],
  },
  {
    name: 'Fenster außen lackieren',
    gewerk: 'maler',
    transkript: 'zwei holzfenster außen abschleifen und mit ölfarbe streichen',
    raeume: [{ name: 'Haus', arbeiten: ['fenster lackieren'], fenster: [{ anzahl: 2 }] }],
    muss: ['fenster'],
    verboten: ['estrich', 'erschwerniszuschlag'],
  },
  {
    name: 'Heizkörper lackieren',
    gewerk: 'maler',
    transkript: 'im wohnzimmer den heizkörper abschleifen und neu lackieren',
    raeume: [{ name: 'Wohnzimmer', arbeiten: ['heizkörper lackieren'] }],
    muss: ['heizkörper'],
    verboten: ['estrich'],
  },
  {
    name: 'Raufaser neu tapezieren + streichen',
    gewerk: 'maler',
    transkript: 'wohnzimmer, alte tapete runter, neue raufaser aufziehen und weiß streichen, 45 quadratmeter wandfläche',
    raeume: [{ name: 'Wohnzimmer', wandflaeche_direkt: 45, arbeiten: ['tapete entfernen', 'raufaser aufziehen', 'streichen'] }],
    muss: ['tapete entfernen', 'tapezieren'],
    verboten: ['estrich'],
  },
  {
    name: 'Malervlies bleibt für die Preiszuordnung erhalten',
    gewerk: 'maler',
    transkript: 'Im Schlafzimmer sind 42 Quadratmeter Wandfläche. Malervlies tapezieren und zweimal weiß streichen.',
    raeume: [{ name: 'Schlafzimmer', wandflaeche_direkt: 42, arbeiten: ['Tapete aufziehen', 'Wände streichen'] }],
    muss: ['malervlies tapezieren'],
    verboten: ['fototapete', 'digitaldrucktapete', 'estrich'],
  },
  {
    name: 'Dachschräge streichen',
    gewerk: 'maler',
    transkript: 'dachgeschoss mit schräge komplett streichen, 40 quadratmeter, 2,40 an der niedrigsten stelle',
    raeume: [{ name: 'Dachzimmer', flaeche: 40, hoehe: 2.4, arbeiten: ['wände streichen', 'decke streichen'] }],
    muss: ['streichen'],
    verboten: ['estrich'],
  },
  {
    name: 'Stuckleisten montieren + streichen',
    gewerk: 'maler',
    transkript: 'altbauwohnzimmer streichen und neue stuckleisten anbringen, 30 quadratmeter',
    raeume: [{ name: 'Wohnzimmer', flaeche: 30, hoehe: 3.2, arbeiten: ['wände streichen', 'decke streichen'] }],
    muss: ['stuckleisten'],
    verboten: ['estrich'],
  },
  {
    name: 'Graffiti entfernen',
    gewerk: 'maler',
    transkript: 'an der hauswand ist ein graffiti, das soll entfernt und überstrichen werden, 15 quadratmeter',
    raeume: [{ name: 'Hauswand', wandflaeche_direkt: 15, arbeiten: ['wände streichen'] }],
    muss: ['graffiti'],
    verboten: ['estrich', 'erschwerniszuschlag'],
  },
  {
    name: 'Denkmalschutz Altbau',
    gewerk: 'maler',
    transkript: 'denkmalgeschütztes altbauzimmer streichen, 25 quadratmeter, 3 meter 20 hoch',
    raeume: [{ name: 'Altbauzimmer', flaeche: 25, hoehe: 3.2, arbeiten: ['wände streichen', 'decke streichen'] }],
    muss: ['denkmal'],
    verboten: ['estrich'],
  },
  {
    name: 'Fassade mit Gerüst',
    gewerk: 'maler',
    transkript: 'fassade streichen, dafür brauchen wir ein gerüst, 80 quadratmeter außenwand',
    raeume: [{ name: 'Fassade', wandflaeche_direkt: 80, arbeiten: ['fassade streichen'] }],
    muss: ['gerüst'],
    verboten: ['estrich', 'deckenfläche streichen'],
  },
  {
    name: 'Kellerraum streichen, kein Fenster',
    gewerk: 'maler',
    transkript: 'kellerraum weiß streichen, 18 quadratmeter bodenfläche, 2,20 hoch, keine fenster',
    raeume: [{ name: 'Keller', flaeche: 18, hoehe: 2.2, arbeiten: ['wände streichen', 'decke streichen'] }],
    muss: ['wandflächen streichen'],
    verboten: ['estrich', 'erschwerniszuschlag'],
  },

  // ── Boden Sonderregeln ────────────────────────────────────────────────────
  {
    name: 'Vinyl diagonal verlegen',
    gewerk: 'boden_parkett',
    transkript: 'wohnzimmer klick-vinyl diagonal verlegen, 25 quadratmeter',
    raeume: [{ name: 'Wohnzimmer', flaeche: 25, belag: 'klick-vinyl', verlegerichtung: 'diagonal', sockelleisten: true, arbeiten: ['vinyl verlegen', 'sockelleisten'] }],
    muss: ['vinyl'],
    verboten: ['estrich', 'glykvenyl'],
  },
  {
    name: 'Laminat + Fußbodenheizung',
    gewerk: 'boden_parkett',
    transkript: 'schlafzimmer laminat verlegen, ist eine fußbodenheizung drunter, 20 quadratmeter',
    raeume: [{ name: 'Schlafzimmer', flaeche: 20, belag: 'laminat', arbeiten: ['laminat verlegen'] }],
    muss: ['laminat'],
    verboten: ['estrich', 'glykvenyl'],
  },
  {
    name: 'Fertigparkett Fischgrät verkleben',
    gewerk: 'boden_parkett',
    transkript: 'esszimmer fertigparkett im fischgrätmuster vollflächig verkleben, 30 quadratmeter',
    raeume: [{ name: 'Esszimmer', flaeche: 30, belag: 'fertigparkett', arbeiten: ['parkett verlegen'] }],
    muss: ['fischgrät'],
    verboten: ['estrich', 'glykvenyl'],
  },
  {
    name: 'Trittschalldämmung + Laminat',
    gewerk: 'boden_parkett',
    transkript: 'kinderzimmer, erst trittschalldämmung dann laminat, 4 mal 4 meter',
    raeume: [{ name: 'Kinderzimmer', laenge: 4, breite: 4, belag: 'laminat', sockelleisten: true, arbeiten: ['laminat verlegen'] }],
    muss: ['trittschall', 'laminat'],
    verboten: ['estrich', 'glykvenyl'],
  },
  {
    name: 'Übergangsprofil zwischen Räumen',
    gewerk: 'boden_parkett',
    transkript: 'vinyl im flur verlegen, am übergang zum wohnzimmer ein alu-anschlussprofil, 12 quadratmeter',
    raeume: [{ name: 'Flur', flaeche: 12, belag: 'vinyl', arbeiten: ['vinyl verlegen'] }],
    muss: ['übergangsprofil'],
    verboten: ['estrich', 'glykvenyl'],
  },
  {
    name: 'Estrich grundieren + ausgleichen (estrich HIER erlaubt)',
    gewerk: 'boden_parkett',
    transkript: 'estrich grundieren und mit ausgleichsmasse bis 5 millimeter ausgleichen, dann vinyl, 22 quadratmeter',
    raeume: [{ name: 'Raum', flaeche: 22, belag: 'vinyl', ausgleich: true, arbeiten: ['vinyl verlegen'] }],
    muss: ['ausgleich', 'vinyl'],
    verboten: ['glykvenyl'],
  },

  // ── Runde 2: Kanten & Wechselwirkungen ────────────────────────────────────
  {
    name: 'Nur die Decke streichen (Scope)',
    gewerk: 'maler',
    transkript: 'im schlafzimmer nur die decke streichen, die wände bleiben, 16 quadratmeter, 2,50 hoch',
    raeume: [{ name: 'Schlafzimmer', flaeche: 16, hoehe: 2.5, arbeiten: ['decke streichen'] }],
    muss: ['deckenfläche streichen'],
    verboten: ['wandflächen streichen', 'estrich'],
  },
  {
    name: 'Zwei Räume, unterschiedlicher Scope',
    gewerk: 'maler',
    transkript: 'wohnzimmer nur die wände streichen, schlafzimmer komplett wände und decke, jeweils 20 quadratmeter, 2,50 hoch',
    raeume: [
      { name: 'Wohnzimmer', flaeche: 20, hoehe: 2.5, arbeiten: ['wände streichen'] },
      { name: 'Schlafzimmer', flaeche: 20, hoehe: 2.5, arbeiten: ['wände streichen', 'decke streichen'] },
    ],
    muss: ['wandflächen streichen'],
    verboten: ['estrich'],
  },
  {
    name: 'Balkon streichen',
    gewerk: 'maler',
    transkript: 'balkon außen streichen mit wetterfester fassadenfarbe, 20 quadratmeter',
    raeume: [{ name: 'Balkon', wandflaeche_direkt: 20, arbeiten: ['wände streichen'] }],
    muss: ['streichen'],
    verboten: ['estrich', 'deckenfläche streichen'],
  },
  {
    name: 'Treppenhaus streichen + Geländer',
    gewerk: 'maler',
    transkript: 'treppenhaus komplett streichen, geländer muss abgeklebt werden, 60 quadratmeter wandfläche',
    raeume: [{ name: 'Treppenhaus', wandflaeche_direkt: 60, arbeiten: ['wände streichen'] }],
    muss: ['geländer'],
    verboten: ['estrich'],
  },
  {
    name: 'Küche streichen + Fliesenspiegel abkleben',
    gewerk: 'maler',
    transkript: 'küche streichen, den fliesenspiegel bitte abkleben, 18 quadratmeter wandfläche',
    raeume: [{ name: 'Küche', wandflaeche_direkt: 18, arbeiten: ['wände streichen'] }],
    muss: ['fliesenspiegel'],
    verboten: ['estrich'],
  },
  {
    name: 'Wohnzimmer streichen + Deckenlampe abkleben',
    gewerk: 'maler',
    transkript: 'wohnzimmer streichen, die deckenlampe und zwei einbauspots abkleben, 24 quadratmeter, 2,60 hoch',
    raeume: [{ name: 'Wohnzimmer', flaeche: 24, hoehe: 2.6, arbeiten: ['wände streichen', 'decke streichen'] }],
    muss: ['abkleben'],
    verboten: ['estrich', 'erschwerniszuschlag'],
  },
  {
    name: 'Akzentwand tapezieren, Rest weiß streichen',
    gewerk: 'maler',
    transkript: 'wohnzimmer, eine akzentwand mit vliestapete tapezieren, die restlichen wände weiß streichen, 45 quadratmeter wandfläche',
    raeume: [{ name: 'Wohnzimmer', wandflaeche_direkt: 45, arbeiten: ['tapezieren', 'wände streichen'] }],
    muss: ['streichen'],
    verboten: ['estrich'],
  },
  {
    name: 'Garage streichen + Garagentor',
    gewerk: 'maler',
    transkript: 'garage innen weiß streichen, das garagentor ist 2,5 mal 2 meter, 45 quadratmeter wandfläche',
    raeume: [{ name: 'Garage', wandflaeche_direkt: 45, arbeiten: ['wände streichen'], tueren: [{ breite: 2.5, hoehe: 2 }] }],
    muss: ['streichen'],
    verboten: ['estrich', 'erschwerniszuschlag'],
  },
  {
    name: 'Nadelvlies vollflächig verkleben',
    gewerk: 'boden_parkett',
    transkript: 'büro nadelvlies teppichboden vollflächig verkleben mit öko-kleber, 30 quadratmeter',
    raeume: [{ name: 'Büro', flaeche: 30, belag: 'nadelvlies', arbeiten: ['teppichboden verkleben'] }],
    muss: ['nadelvlies'],
    verboten: ['estrich', 'glykvenyl'],
  },
  {
    name: 'Treppe mit Vinyl verkleiden',
    gewerk: 'boden_parkett',
    transkript: 'treppe mit 14 stufen mit vinyl verkleiden',
    raeume: [{ name: 'Treppe', belag: 'vinyl', arbeiten: ['treppe verkleiden'] }],
    muss: ['stufen'],
    verboten: ['estrich', 'glykvenyl'],
  },
  {
    name: 'Linoleum Bahnenware + Fugen verschweißen',
    gewerk: 'boden_parkett',
    transkript: 'flur linoleum bahnenware verlegen und die fugen thermisch verschweißen, 40 quadratmeter, so um die 30 laufende meter fugen',
    raeume: [{ name: 'Flur', flaeche: 40, belag: 'linoleum', arbeiten: ['linoleum verlegen'] }],
    muss: ['verschweiß'],
    verboten: ['estrich', 'glykvenyl'],
  },
  {
    name: 'Epoxidharz-Feuchtigkeitssperre + Quarzsand',
    gewerk: 'boden_parkett',
    transkript: 'estrich hat restfeuchte, epoxidharz feuchtigkeitssperre aufwalzen und quarzsand absanden, danach vinyl, 25 quadratmeter',
    raeume: [{ name: 'Raum', flaeche: 25, belag: 'vinyl', feuchtigkeitssperre: true, arbeiten: ['vinyl verlegen'] }],
    muss: ['epoxid', 'quarzsand'],
    verboten: ['glykvenyl'],
  },
  {
    name: 'Kork verlegen',
    gewerk: 'boden_parkett',
    transkript: 'arbeitszimmer korkboden verlegen, 18 quadratmeter',
    raeume: [{ name: 'Arbeitszimmer', flaeche: 18, belag: 'kork', sockelleisten: true, arbeiten: ['kork verlegen'] }],
    muss: ['kork'],
    verboten: ['estrich', 'glykvenyl'],
  },
  {
    name: 'Boden gestapelt: Teppich raus + Ausgleich + Vinyl diagonal + Türübergäng-Profile',
    gewerk: 'boden_parkett',
    transkript: 'großes wohnzimmer, 40 quadratmeter. alter verklebter teppich raus, kleberreste abschleifen. dann ausgleichsmasse bis 3 millimeter. danach klick-vinyl diagonal verlegen, neue sockelleisten, und an den 2 türübergängen alu-profile.',
    raeume: [{ name: 'Wohnzimmer', flaeche: 40, belag: 'klick-vinyl', verlegerichtung: 'diagonal', altbelag_entfernen: true, sockelleisten: true, ausgleich: true, arbeiten: ['vinyl verlegen'] }],
    // "übergangsprofil" trotz Flexion "türübergängEN" (ä) + "alu-profile"
    muss: ['vinyl', 'kleberreste', 'sockelleisten', 'übergangsprofil'],
    verboten: ['estrich', 'glykvenyl'],
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

    // 2) Kein falscher HÖHEN-Erschwerniszuschlag bei normaler Höhe
    //    (Altbau-/Denkmal-Zuschläge sind höhenunabhängig und legitim)
    const hoehe = extrahiereRaumhoehe(t)
    if ((hoehe == null || hoehe <= 3) && !t.includes('hohe decke')) {
      expect(positionen.some(p => /erschwerniszuschlag\s*raumhöhe|raumhöhe.*3\s*m/i.test(p.beschreibung))).toBe(false)
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
