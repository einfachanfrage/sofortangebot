// Katalog-Deckung — findet jede Position, die die Pipeline erzeugen kann,
// auch einen Preis?
//
// Anlass (Audit 2026-08-31): Über Monate sind Positionen in
// `default-prices.ts` dazugekommen, ohne dass eine Migration sie in die
// Preisdatenbanken bestehender Betriebe nachgezogen hätte — und umgekehrt
// erzeugt die Vollständigkeitsprüfung Positionen, zu denen es im Katalog gar
// keinen Gegen-Eintrag gibt. Beides endet identisch: 0,00 € und „Preis fehlt"
// im fertigen Angebot. So ist der Erschwerniszuschlag Raumhöhe aufgefallen,
// und so fehlten „Dachschrägen streichen 2x" und „Kniestockwände streichen".
//
// Dieser Test fährt die ECHTE Kette: Engine → Vollständigkeit →
// gewerkFuerPosition → Gewerk-Filter → findePreisposition, gegen den echten
// Standardkatalog. Was hier durchfällt, fällt im Angebot als 0,00 € auf.
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '@/app/api/angebot-generieren/route'

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))

function findetPreis(beschreibung: string, einheit: string, hauptgewerk: string) {
  const gewerk = gewerkFuerPosition(beschreibung, hauptgewerk)
  const kandidaten = KATALOG.filter(p => preisKategoriePasstZuGewerk(p.category, gewerk))
  return findePreisposition(beschreibung, einheit, kandidaten)
}

type Raum = Record<string, unknown> & { name: string; arbeiten?: string[] }

function pipeline(gewerk: 'maler' | 'boden_parkett', transkript: string, raeume: Raum[]) {
  const eng = berechneMengen(gewerk, { transkript, raeume, gewerk })
  const signale = {
    arbeitenTexte: raeume.flatMap(r => r.arbeiten ?? []),
    belagText: (raeume.find(r => r.belag) as { belag?: string } | undefined)?.belag ?? null,
    altbelagEntfernen: raeume.some(r => (r as { altbelag_entfernen?: boolean }).altbelag_entfernen === true),
  }
  const meta = { raeume: raeume.map(r => ({ name: r.name, hoehe: (r as { hoehe?: number | null }).hoehe ?? null })) }
  const { positionen } = pruefeUndErgaenzeVollstaendigkeit(gewerk, eng.positionen, transkript, meta, signale)
  return positionen
}

const raum = (name: string, extra: Record<string, unknown> = {}): Raum => ({
  name, laenge: 5, breite: 4, hoehe: 2.5, flaeche: null, umfang: null,
  tueren: [{ anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }],
  fenster: [{ anzahl: 1, breite: 1.2, hoehe: 1.0, annahme: true }],
  altbelag_entfernen: false, sockelleisten: false, nassbereich: false, ...extra,
})

const FAELLE: Array<{ name: string; gewerk: 'maler' | 'boden_parkett'; transkript: string; raeume: Raum[] }> = [
  { name: 'Wände streichen', gewerk: 'maler',
    transkript: 'Wohnzimmer fünf mal vier Meter, Höhe zwei fünfzig, Wände zweimal streichen.',
    raeume: [raum('Wohnzimmer', { arbeiten: ['waende_streichen'] })] },
  { name: 'Wände und Decke streichen', gewerk: 'maler',
    transkript: 'Schlafzimmer streichen komplett, Wände und Decke.',
    raeume: [raum('Schlafzimmer', { arbeiten: ['waende_streichen', 'decke_streichen'] })] },
  { name: 'Raufaser abnehmen und neu', gewerk: 'maler',
    transkript: 'Flur, alte Raufasertapete abnehmen, danach spachteln, grundieren und neu tapezieren.',
    raeume: [raum('Flur', { arbeiten: ['tapete_entfernen', 'tapezieren', 'waende_streichen'] })] },
  { name: 'Dachgeschoss mit Schrägen', gewerk: 'maler',
    transkript: 'Dachzimmer, Dachschrägen und Kniestock streichen, zweimal.',
    raeume: [raum('Dachzimmer', { arbeiten: ['waende_streichen', 'dachschraegen streichen'], kniestockhoehe: 1.2, dachschraege_flaeche_m2: 14 })] },
  { name: 'Fassade außen', gewerk: 'maler',
    transkript: 'Fassade zwölf Meter lang, Giebelhöhe sechs Meter, zweimal streichen.',
    raeume: [raum('Fassade', { arbeiten: ['waende_streichen'], hoehe: 6 })] },
  { name: 'Hoher Raum mit Altbau', gewerk: 'maler',
    transkript: 'Büro im Altbau, Höhe drei Meter zwanzig, Wände zweimal streichen, der Untergrund ist schwierig.',
    raeume: [raum('Büro', { hoehe: 3.2, arbeiten: ['waende_streichen'] })] },
  { name: 'Lackieren Türen und Heizkörper', gewerk: 'maler',
    transkript: 'Kinderzimmer, zwei Türen lackieren und den Heizkörper streichen.',
    raeume: [raum('Kinderzimmer', { arbeiten: ['tueren_lackieren', 'heizkoerper_lackieren'] })] },
  { name: 'Keller streichen', gewerk: 'maler',
    transkript: 'Keller, Wände weißen, kein Sockel.',
    raeume: [raum('Keller', { arbeiten: ['waende_streichen'] })] },
  { name: 'Laminat mit Altbelag', gewerk: 'boden_parkett',
    transkript: 'Wohnzimmer, alter Teppich raus, danach Laminat verlegen, Sockelleisten neu.',
    raeume: [raum('Wohnzimmer', { belag: 'laminat', altbelag_entfernen: true, altbelag_vorhanden: true, sockelleisten: true, arbeiten: ['laminat verlegen', 'altbelag entfernen'] })] },
  { name: 'Parkett gerade', gewerk: 'boden_parkett',
    transkript: 'Kellerraum, Parkett ganz normal gerade verlegen, kein Muster.',
    raeume: [raum('Kellerraum', { belag: 'parkett', verlegerichtung: 'standard', arbeiten: ['parkett verlegen'] })] },
  { name: 'Vinyl Fischgrät', gewerk: 'boden_parkett',
    transkript: 'Gästezimmer, Vinylboden im Fischgrätmuster verlegen, Sockelleisten neu montiert.',
    raeume: [raum('Gästezimmer', { belag: 'vinyl', verlegerichtung: 'fischgraet', sockelleisten: true, arbeiten: ['vinyl verlegen'] })] },
  { name: 'Teppich raus, Kork rein', gewerk: 'boden_parkett',
    transkript: 'Arbeitszimmer, Teppich entfernen, Korkboden verlegen.',
    raeume: [raum('Arbeitszimmer', { belag: 'kork', altbelag_entfernen: true, altbelag_vorhanden: true, arbeiten: ['kork verlegen', 'altbelag entfernen'] })] },
  { name: 'Bad Vinyl mit Trittschall', gewerk: 'boden_parkett',
    transkript: 'Bad, Vinyl verlegen mit Trittschalldämmung, Übergangsschiene zur Küche.',
    raeume: [raum('Bad', { belag: 'vinyl', nassbereich: true, arbeiten: ['vinyl verlegen'] })] },
  { name: 'Fenster lackieren', gewerk: 'maler',
    transkript: 'Wohnzimmer, drei Fenster innen neu lackieren.',
    raeume: [raum('Wohnzimmer', { arbeiten: ['fenster_lackieren'], fenster: [{ anzahl: 3, breite: 1.2, hoehe: 1, annahme: false }] })] },
  { name: 'Q2-Spachtelung Altbau', gewerk: 'maler',
    transkript: 'Arbeitszimmer, Wände vollflächig spachteln in Q2, danach zweimal streichen. Altbau, Untergrund schwierig.',
    raeume: [raum('Arbeitszimmer', { arbeiten: ['waende_streichen', 'spachteln'] })] },
  { name: 'Graffiti Fassade', gewerk: 'maler',
    transkript: 'Fassade, Graffiti entfernen und danach neu streichen.',
    raeume: [raum('Fassade', { arbeiten: ['waende_streichen'], hoehe: 4 })] },
  { name: 'Garage Bodenbeschichtung', gewerk: 'maler',
    transkript: 'Garage, Boden streichen mit Epoxid, Estrich vorher schleifen.',
    raeume: [raum('Garage', { arbeiten: ['boden_streichen'] })] },
  { name: 'Tapete neu mit Grundierung', gewerk: 'maler',
    transkript: 'Esszimmer, Vliestapete neu tapezieren, vorher grundieren.',
    raeume: [raum('Esszimmer', { arbeiten: ['tapezieren'] })] },
  { name: 'Bewohnte Wohnung, Denkmalschutz', gewerk: 'maler',
    transkript: 'Wohnzimmer im Denkmalschutz, bewohnt, Wände zweimal streichen.',
    raeume: [raum('Wohnzimmer', { arbeiten: ['waende_streichen'] })] },
  { name: 'Dachschräge mit Spachteln und Grundierung', gewerk: 'maler',
    transkript: 'Dachzimmer, Schrägen spachteln wegen Rissen, grundieren und streichen.',
    raeume: [raum('Dachzimmer', { arbeiten: ['dachschraegen streichen'], kniestockhoehe: 1.1, dachschraege_flaeche_m2: 18 })] },
  { name: 'Estrich ausgleichen vor Laminat', gewerk: 'boden_parkett',
    transkript: 'Flur, Untergrund ausgleichen und grundieren, danach Laminat verlegen.',
    raeume: [raum('Flur', { belag: 'laminat', ausgleich: true, arbeiten: ['laminat verlegen'] })] },
  { name: 'Parkett abschleifen und ölen', gewerk: 'boden_parkett',
    transkript: 'Wohnzimmer, vorhandenes Parkett abschleifen und ölen.',
    raeume: [raum('Wohnzimmer', { belag: 'parkett', parkett_schleifen: true, arbeiten: ['parkett schleifen'] })] },
  { name: 'Teppich neu verlegen', gewerk: 'boden_parkett',
    transkript: 'Büro, Teppichboden neu verlegen, vollflächig verkleben.',
    raeume: [raum('Büro', { belag: 'teppich', arbeiten: ['teppich verlegen'] })] },
  { name: 'Linoleum mit Sockel', gewerk: 'boden_parkett',
    transkript: 'Praxis, Linoleum verlegen, Sockelleisten neu montieren.',
    raeume: [raum('Praxis', { belag: 'linoleum', sockelleisten: true, arbeiten: ['linoleum verlegen'] })] },
  { name: 'Ganze Wohnung streichen', gewerk: 'maler',
    transkript: 'In der ganzen Wohnung 120 Quadratmeter Wandfläche, alles zweimal streichen.',
    raeume: [raum('Wohnung', { wandflaeche_direkt: 120, laenge: null, breite: null, arbeiten: ['waende_streichen'] })] },
]

describe('Katalog-Deckung — jede erzeugbare Position findet einen Preis', () => {
  const ohnePreis: string[] = []
  for (const fall of FAELLE) {
    const positionen = pipeline(fall.gewerk, fall.transkript, fall.raeume)
    for (const p of positionen) {
      if (!findetPreis(p.beschreibung, p.einheit, fall.gewerk)) {
        ohnePreis.push(`${fall.name}: „${p.beschreibung}" [${p.einheit}]`)
      }
    }
  }

  it('erzeugt in keinem Fall eine Position ohne Katalogpreis', () => {
    // Schlägt dieser Test fehl, steht die genannte Position im echten Angebot
    // mit 0,00 € und „Preis fehlt in deiner Preisdatenbank".
    expect([...new Set(ohnePreis)]).toEqual([])
  })

  it('prüft überhaupt etwas — der Korpus darf nicht still leerlaufen', () => {
    const anzahl = FAELLE.reduce((s, f) => s + pipeline(f.gewerk, f.transkript, f.raeume).length, 0)
    expect(anzahl).toBeGreaterThan(30)
  })
})
