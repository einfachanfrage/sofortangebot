// CoS-E-082 — „nur die Wandfliesen": die Bodenarbeit fällt, die Wandarbeit bleibt
// (Head of Product Engineering, 17.09.2026)
//
// ── Worum es geht ─────────────────────────────────────────────────────────
//
// Auf dem Bad „Im Bad **nur die Wandfliesen** runter" standen drei Zeilen für
// eine Arbeit, die der Kunde ausdrücklich ausgenommen hat: `Bodenfliesen
// verlegen`, `Verfugung Boden`, `Fliesensockel / Abschlussleiste`. Bis gestern
// trugen sie 0,00 € und fielen niemandem auf. Seit CoS-E-078 die Preise
// gefunden hat, sind es **324,50 € echtes Geld auf dem Kundenpapier** — ein
// Bau, der eine offene Stelle erst gefährlich gemacht hat. Deshalb stand
// PM-061-A vor allem anderen.
//
// Drei Fehler steckten in diesem einen Angebot, und sie zeigen in
// verschiedene Richtungen. Der Prüfmeister hat deshalb eine Auflage gestellt
// (PM-123) und ausdrücklich verlangt, sie ZUSAMMEN zu bauen — *„wer nur
// PM-061-A baut, meldet ‚behoben' und lässt 216,00 € falsch stehen, diesmal
// zu Lasten des Betriebs."* Gebaut sind deshalb alle drei:
//
//   PM-061-A   324,50 € zu viel    die Bodenzeilen fallen     `fliesen-richtung.ts`
//   PM-062-A    72,00 € zu wenig   Wandabbruch, Wandpreis     `fliesen-richtung.ts`
//   PM-121     144,00 € zu wenig   Entsorgung findet ihre     `preis-matcher.ts`
//                                  Katalogzeile
//
// Das Angebot steht danach auf **1.529,52 €** statt 1.638,02 € — die Zahl,
// die der Prüfmeister in PM-123-C hinterlegt hat. Diese Zusicherung ist
// seine; sie steht in seiner Datei und wird hier nicht verdoppelt.
//
// ── Was diese Datei misst, und warum sie nötig ist ────────────────────────
//
// Nicht das Ergebnis — das steht bei ihm. Sondern die **Ränder des
// Auslösers**: eine Bremse, die zu grob greift, löscht die im selben Satz
// bestellte Arbeit mit (die Lehre aus PM-105), und eine, die auf das Wort
// „nur" allein zielt, bricht die Gegenprobe (Auflage Punkt 4).
//
// Nr. 4 ist die teuerste Zeile dieser Datei: „nur bis zwei Meter zehn hoch an
// der Wand" schränkt eine HÖHE ein, kein Gewerk. Wer das für eine
// Bauteilansage hält, wirft auf jedem gewöhnlichen Bad die Bodenarbeit weg —
// ein Fehler, der in die Gegenrichtung genau so teuer ist wie der, den diese
// Datei behebt. Deshalb muss das Bauteil dicht hinter dem Einschränkungswort
// stehen.
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { erkenneFliesenEinschraenkung } from '../fliesen-richtung'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '../positions-gewerk'

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))
function preisVon(beschreibung: string, einheit: string) {
  const g = gewerkFuerPosition(beschreibung, 'fliesen')
  return findePreisposition(beschreibung, einheit,
    KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))?.position.unit_price ?? null
}

type Zeile = { beschreibung: string; einheit: string; menge: number; annahmen?: string[] }
type Bereich = { name: string; laenge: number; breite: number; flieshoehe: number; nassbereich?: boolean }

/** Derselbe Weg wie im Endpunkt: Engine, dann Vollständigkeitsprüfung. */
function lauf(transkript: string, bereiche: Bereich[], altbelagFlaeche: number | null = null): Zeile[] {
  const altbelag = altbelagFlaeche === null ? [] : [{ bereich: bereiche[0].name, flaeche: altbelagFlaeche }]
  const eng = berechneMengen('fliesen', { transkript, bereiche, altbelag } as never)
  const meta = { raeume: bereiche.map(b => ({ name: b.name, hoehe: null })) }
  const signale = {
    arbeitenTexte: [], belagText: null, altbelagEntfernen: altbelag.length > 0,
    raeume: bereiche.map(b => ({ name: b.name, arbeiten: [] })),
  }
  return pruefeUndErgaenzeVollstaendigkeit('fliesen', eng.positionen, transkript, meta as never, signale as never)
    .positionen as never as Zeile[]
}
const finde = (z: Zeile[], m: RegExp) => z.find(p => m.test(p.beschreibung))
const BAD: Bereich[] = [{ name: 'Bad', laenge: 2.4, breite: 1.8, flieshoehe: 2.1 }]

const T_NUR_WAND = 'Im Bad nur die Wandfliesen runter, die alten Fliesen an der Wand kommen weg, achtzehn Quadratmeter. Danach neu fliesen bis zwei Meter zehn. Bad ist zwei Meter vierzig mal ein Meter achtzig.'

describe('CoS-E-082 — die bestellte Richtung, und nur sie', () => {
  // ── 1.–3. Was gebaut ist ────────────────────────────────────────────────

  it('1 · die ausgenommene Bodenarbeit fällt — alle drei Zeilen, der Sockel auch', () => {
    // Auflage Punkt 1. Der Fliesensockel rechnet in lfdm und hängt am
    // Umfang, nicht an der Bodenfläche — er trägt das Wort „Boden" nicht und
    // ist trotzdem Bodenarbeit. Er ist die Zeile, die beim Aufräumen
    // übersehen wird, und steht deshalb ausdrücklich im Muster.
    const p = lauf(T_NUR_WAND, BAD, 18)
    for (const m of [/^Bodenfliesen verlegen/, /^Verfugung Boden/, /^Fliesensockel/]) {
      expect(finde(p, m), String(m)).toBeUndefined()
    }
  })

  it('2 · die bestellte Wandarbeit bleibt unberührt — Menge für Menge', () => {
    // Auflage Punkt 2, und das ist die Lehre aus PM-105: Die Wandzeilen
    // stehen auf DENSELBEN Raummaßen wie die Bodenzeilen. Ein Fix, der die
    // Maße wegwirft, statt die Bodenarbeit auszunehmen, nimmt sie mit.
    // Gemessen werden deshalb die Mengen und nicht nur das Dasein.
    const p = lauf(T_NUR_WAND, BAD, 18)
    expect(finde(p, /^Wandfliesen verlegen/)!.menge).toBe(18.52)
    expect(finde(p, /^Verfugung Wand/)!.menge).toBe(17.64)
  })

  it('3 · der Abbruch heißt nach seiner Richtung und bekommt den Wandpreis', () => {
    // PM-062-A/B. Der Katalog trennt mit 4,00 €/m²; die Engine schrieb einen
    // Titel für beides, und er traf immer den Boden.
    //
    // Der Wortlaut ist bewusst „Altfliesen abstemmen, Wand" und nicht die
    // Katalogschreibweise „Altfliesen Wand abstemmen": beide finden dieselben
    // 22,00 €, aber nur der erste lässt die Zeile über `altfliesen abstemmen`
    // auffindbar — und genau so suchen die Zusicherungen des Prüfmeisters
    // sie. Ein Titel, den danach niemand mehr wiederfindet, ist kein
    // besserer Titel.
    const z = finde(lauf(T_NUR_WAND, BAD, 18), /^Altfliesen abstemmen/)!
    expect(z.menge).toBe(18)
    expect(z.beschreibung).toMatch(/wand/i)
    expect(preisVon(z.beschreibung, z.einheit)).toBe(22)
    // Und das Umstellen steht sichtbar in der Annahme, nicht nur im Preis.
    expect((z.annahmen ?? []).join(' ')).toMatch(/Wandpreis/)
  })

  // ── 4.–8. Die Ränder: was der Auslöser NICHT tun darf ───────────────────

  it('4 · „nur bis zwei Meter zehn hoch an der Wand" schränkt eine Höhe ein, kein Gewerk', () => {
    // Die teuerste Gegenprobe dieser Datei. Das Wort „nur" steht da, ein
    // Wandwort steht auch da — und trotzdem ist es keine Bauteilansage.
    // Fiele die Bodenarbeit hier, wäre der Fehler in die Gegenrichtung
    // genauso teuer wie der, den diese Datei behebt.
    //
    // Die Regel dahinter: Das Bauteil muss DICHT hinter dem
    // Einschränkungswort stehen (drei Wörter — Artikel und ein Adjektiv,
    // nicht mehr). Hier steht es an siebter Stelle.
    const t = 'Bad komplett neu fliesen, nur bis zwei Meter zehn hoch an der Wand. Zwei Meter vierzig mal ein Meter achtzig.'
    const p = lauf(t, BAD)
    expect(finde(p, /^Bodenfliesen verlegen/)).toBeDefined()
    expect(finde(p, /^Verfugung Boden/)).toBeDefined()
    expect(finde(p, /^Fliesensockel/)).toBeDefined()
    expect(erkenneFliesenEinschraenkung(t).global).toBeNull()
  })

  it('5 · ohne „nur" bleibt jede Bodenzeile stehen', () => {
    // Auflage Punkt 4, in dieser Datei als eigene Zeile: kein stiller
    // Rückbau. Steht die Ausnahme nicht im Satz, verschwindet nichts.
    const t = 'Bad komplett neu fliesen, zwei Meter vierzig mal ein Meter achtzig, Fliesenhöhe zwo Meter zehn. Die alten Fliesen kommen raus, das sind sechzehn Quadratmeter.'
    const p = lauf(t, BAD, 16)
    for (const m of [/^Bodenfliesen verlegen/, /^Verfugung Boden/, /^Fliesensockel/, /^Wandfliesen verlegen/]) {
      expect(finde(p, m), String(m)).toBeDefined()
    }
    // Und der Abbruchtitel bleibt, wie er war: fallen BEIDE Richtungen, ist
    // die eine Menge die Summe aus beidem, und es gibt keinen Preis, der für
    // sie richtig wäre. Die Aufteilung ist PM-124-A und steht offen — eine
    // geratene Quote wäre schlimmer als die heutige Zeile.
    const z = finde(p, /^Altfliesen abstemmen/)!
    expect(z.beschreibung).not.toMatch(/boden|wand/i)
    expect(preisVon(z.beschreibung, z.einheit)).toBe(18)
  })

  it('6 · „nicht nur die Wandfliesen" ist das Gegenteil und räumt nichts weg', () => {
    // Die Verneinung der Einschränkung. Ohne diese Gegenprobe macht der
    // Auslöser aus „auch der Boden" ein „kein Boden".
    const t = 'Im Bad nicht nur die Wandfliesen, zwei Meter vierzig mal ein Meter achtzig, bis zwo Meter zehn hoch.'
    expect(erkenneFliesenEinschraenkung(t).global).toBeNull()
    expect(finde(lauf(t, BAD), /^Bodenfliesen verlegen/)).toBeDefined()
  })

  it('7 · steht die Gegenrichtung im selben Satz, wird nicht geraten', () => {
    // „nur die Wandfliesen, den Boden machen wir auch" ist nicht eindeutig.
    // Dann bleibt alles stehen: eine Bremse, die rät, ist schlimmer als
    // keine. Der Satz wird an dieser Stelle NICHT ausgewertet — wo eine
    // Arbeit wirklich abbestellt ist, greift `bauteil-ausschluss.ts`.
    const t = 'Im Bad nur die Wandfliesen neu, den Boden machen wir auch. Zwei Meter vierzig mal ein Meter achtzig, bis zwo Meter zehn.'
    expect(erkenneFliesenEinschraenkung(t).global).toBeNull()
    expect(finde(lauf(t, BAD), /^Bodenfliesen verlegen/)).toBeDefined()
  })

  it('8 · die Ansage gilt dem Raum, in dem sie gefallen ist', () => {
    // Zwei Bäder, eine Einschränkung. Nähme die Bremse sie global, verlöre
    // das zweite Bad seinen Boden — 324,50 € in die Gegenrichtung, und
    // niemand sieht es.
    const t = 'Im Gästebad nur die Wandfliesen neu. Das Hauptbad wird komplett neu gefliest.'
    const zwei: Bereich[] = [
      { name: 'Gästebad', laenge: 2.4, breite: 1.8, flieshoehe: 2.1 },
      { name: 'Hauptbad', laenge: 2.4, breite: 1.8, flieshoehe: 2.1 },
    ]
    const p = lauf(t, zwei)
    expect(finde(p, /^Bodenfliesen verlegen — Gästebad/)).toBeUndefined()
    expect(finde(p, /^Fliesensockel.*Gästebad/)).toBeUndefined()
    expect(finde(p, /^Bodenfliesen verlegen — Hauptbad/)).toBeDefined()
    expect(finde(p, /^Fliesensockel.*Hauptbad/)).toBeDefined()
    // Die Wandarbeit steht in beiden.
    expect(finde(p, /^Wandfliesen verlegen — Gästebad/)).toBeDefined()
    expect(finde(p, /^Wandfliesen verlegen — Hauptbad/)).toBeDefined()
  })

  it('9 · die Bremse läuft nur für Fliesen — ein Malerangebot rührt sie nicht an', () => {
    // „Nur die Decke streichen, Wände bleiben" gehört dem Maler und wird
    // dort seit PM-047 anders und vollständiger behandelt. Zwei Bremsen auf
    // demselben Satz wären zwei Wahrheiten.
    const t = 'Im Wohnzimmer nur die Wände streichen, vier mal drei Meter, Höhe zwo fünfzig.'
    const eng = berechneMengen('maler', {
      transkript: t,
      raeume: [{ name: 'Wohnzimmer', laenge: 4, breite: 3, hoehe: 2.5, arbeiten: ['waende_streichen'] }],
    } as never)
    const ohne = eng.positionen.length
    const nach = pruefeUndErgaenzeVollstaendigkeit('maler', eng.positionen, t,
      { raeume: [{ name: 'Wohnzimmer', hoehe: 2.5 }] } as never,
      { arbeitenTexte: [], belagText: null, altbelagEntfernen: false,
        raeume: [{ name: 'Wohnzimmer', arbeiten: ['waende_streichen'] }] } as never).positionen
    // Kein Anspruch darauf, WAS der Maler rechnet — nur darauf, dass diese
    // Datei ihm nichts wegnimmt: die Vollständigkeitsprüfung ergänzt, sie
    // entfernt hier nichts. (Ohne den Selbsttest darunter wäre die Zeile
    // wertlos: bei null Positionen ginge sie auch dann durch, wenn die
    // Bremse alles gelöscht hätte.)
    expect(ohne).toBeGreaterThan(0)
    expect(nach.length).toBeGreaterThanOrEqual(ohne)
    // Und der Satz wird sehr wohl gelesen — die Bremse hängt am Gewerk,
    // nicht daran, dass die Erkennung nichts findet.
    expect(erkenneFliesenEinschraenkung(t).global).toBe('wand')
  })

  // ── 10. Der Geldweg, damit die Zahlen nicht auseinanderlaufen ───────────

  it('10 · die Auflage geht auf: 1.638,02 − 324,50 + 72,00 + 144,00 = 1.529,52', () => {
    // Die Summe selbst ist die Zusicherung des Prüfmeisters (PM-123-C) und
    // steht in seiner Datei. Hier steht die Zerlegung, damit sichtbar bleibt,
    // WELCHER der drei Punkte welchen Teil trägt — eine Summe kann stimmen,
    // während zwei Zeilen sich gegenseitig ausgleichen.
    const p = lauf(T_NUR_WAND, BAD, 18)
    const summe = p.reduce((s, z) => s + (preisVon(z.beschreibung, z.einheit) ?? 0) * z.menge, 0)
    expect(Math.round(summe * 100) / 100).toBe(1529.52)
    expect(Math.round((1638.02 - 324.5 + 72 + 144) * 100) / 100).toBe(1529.52)
    // PM-121: keine Zeile dieses Bades ohne Preis.
    for (const z of p) expect(preisVon(z.beschreibung, z.einheit), z.beschreibung).not.toBeNull()
  })
})
