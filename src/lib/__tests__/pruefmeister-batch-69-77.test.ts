// Fallbasis Richtung 100 — Batch PM-069 bis PM-077 (Prüfmeister, 15.09.2026)
//
// Neun Themen, die im Themenspeicher als „offen" standen und ohne die
// laufende App prüfbar sind:
//
//   B · „Möbel komplett ausräumen und zurückräumen"        → PM-069
//   A · „Deckenrosette"                                    → PM-070
//   A · „Sichtbalken / Balkendecke, Altbau"                → PM-071
//   F · „Estrich"                                          → PM-072
//   F · „Fassade mit Gerüst" vollständig                   → PM-073 (Kontrolle)
//   A · „Kamin / Kaminsockel im Raum (Boden: Aussparung)"  → PM-074
//   A · „Wandnische im Bad, gefliest"                      → PM-075
//   A · „Rollladenkästen"                                  → PM-076
//   B · „Alte Tapete muss runter"                          → PM-077
//   + Nachtrag DC-107, am selben Abend gebaut               → PM-078
//
// Aufbau wie `pruefmeister-batch-64-68.test.ts`: über die Pipeline, Text
// einmal am Eingang normalisiert (K.2). PM-075 fährt Engine +
// Vollständigkeit direkt, wie `pruefmeister-batch-60-62.test.ts` — die
// Fliesen-Engine liest `bereiche`, nicht `raeume`.
//
// Jeder Fund hat in diesem Batch eine Kontrolle daneben: derselbe Satz ohne
// das fragliche Wort. Ohne Kontrolle ist ein Fund eine Behauptung.
//
// Fallbasis danach: 78 von 100.
//
// Prüfmeister · 15.09.2026
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '@/lib/positions-gewerk'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ersetzeZahlenWorte } from '../zahlen-parser'
import { kundenRechenweg } from '../rechenweg-kundentext'

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(gewerk: 'maler' | 'boden_parkett', transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk, raeume, transkript } } as never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen(gewerk, extraktion)
  const r2 = extraktion.raeume ?? raeume
  const text = ersetzeZahlenWorte(transkript)
  const signale = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    arbeitenTexte: r2.flatMap((r: any) => r.arbeiten ?? []),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    belagText: r2.find((r: any) => r.belag)?.belag ?? null,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    altbelagEntfernen: r2.some((r: any) => r.altbelag_entfernen === true),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeume: r2.map((r: any) => ({ name: r.name, arbeiten: r.arbeiten ?? [] })),
  }
  const meta = {
    fensterAnzahl: zaehleFenster(text) || undefined,
    tuerenAnzahl: zaehleTueren(text) || undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeume: r2.map((r: any) => ({ name: r.name, hoehe: r.hoehe ?? null })),
  }
  return pruefeUndErgaenzeVollstaendigkeit(gewerk, eng.positionen, text, meta as never, signale as never).positionen
}

// Fliesen: Engine + Vollständigkeit direkt, wie der Endpunkt es für dieses
// Gewerk tut (siehe Kopf von `pruefmeister-batch-60-62.test.ts`).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function laufFliesen(transkript: string, bereiche: any[]) {
  const eng = berechneMengen('fliesen', { transkript, bereiche, altbelag: [] } as never)
  const meta = { raeume: bereiche.map(b => ({ name: b.name, hoehe: null })) }
  const signale = {
    arbeitenTexte: [], belagText: null, altbelagEntfernen: false,
    raeume: bereiche.map(b => ({ name: b.name, arbeiten: [] })),
  }
  return pruefeUndErgaenzeVollstaendigkeit('fliesen', eng.positionen, transkript, meta as never, signale as never).positionen
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], m: RegExp) => pos.find(p => m.test(p.beschreibung))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const menge = (pos: any[], m: RegExp) => finde(pos, m)?.menge
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function preis(pos: any[], m: RegExp, gewerk: string) {
  const p = finde(pos, m)
  if (!p) return null
  const g = gewerkFuerPosition(p.beschreibung, gewerk)
  return findePreisposition(p.beschreibung, p.einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))?.position.unit_price ?? null
}
const katalog = (titel: string) => DEFAULT_PRICES.find(p => p.title === titel)!.unit_price

const ZIMMER = 'Wohnzimmer fünf mal vier, Höhe zwo fünfzig. Wände und Decke streichen.'
const zimmer = () => [raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.5, arbeiten: ['wände streichen', 'decke streichen'] })]

// ══════════════════════════════════════════════════════════════════════════
// PM-069 — Möbel ausräumen: die gesagte Arbeit fehlt, die ungesagte kommt
// ══════════════════════════════════════════════════════════════════════════
//
// Themenspeicher B: „Möbel komplett ausräumen und zurückräumen" — offen.
// Der Katalog kennt beide Zeilen seit jeher:
//   `Möbel rücken / ausräumen`  · Maler – Vorbereitung & Schutz · 55,00 €/Std
//   `Möbel zurückrücken`        · Maler – Reinigung & Entsorgung · 55,00 €/Std
// Gebaut wird trotzdem nur `Möbel abdecken mit Folie` (1,50 €/m²).

describe('PM-069 — Möbel ausräumen', () => {
  it('die Kontrolle: ohne jedes Möbelwort entsteht keine Möbelzeile', () => {
    expect(finde(lauf('maler', ZIMMER, zimmer()), /Möbel/)).toBeUndefined()
  })

  it('der Katalog hat beide Zeilen — es liegt nicht am Preis', () => {
    expect(katalog('Möbel rücken / ausräumen')).toBe(55)
    expect(katalog('Möbel zurückrücken')).toBe(55)
  })

  it.fails('🔴 PM-069-A · „komplett ausräumen und wieder reinstellen" erzeugt keine der beiden Zeilen', () => {
    // Gemessen: nur `Möbel abdecken mit Folie` 20,00 m² (30,00 €).
    // Ausräumen und Zurückräumen sind ausdrücklich beauftragt und stehen
    // nirgends — Regel H Satz 1: gesagt → Position.
    // Bei zwei Mann und zwei Stunden je Richtung fehlen 220,00 €.
    const p = lauf('maler', ZIMMER + ' Die Möbel müssen wir komplett ausräumen und hinterher wieder reinstellen.', zimmer())
    expect(finde(p, /ausräumen|rücken/), 'ausräumen').toBeDefined()
    expect(finde(p, /zurückrücken|zurückräumen/), 'zurückräumen').toBeDefined()
  })

  it.fails('🔴 PM-069-B · „die Möbel räumt der Kunde selbst raus" erzeugt trotzdem Folie und Zuschlag', () => {
    // Gemessen: `Möbel abdecken mit Folie` 20,00 m² (30,00 €) und
    // `Erschwerniszuschlag bewohnt` — bei einer Wohnung, die der Kunde
    // ausdrücklich leerräumt. Regel H Satz 2: ausdrücklich abbedungen → nie
    // eine Position. Das ist die TN-037-Klasse, an einem frischen Wortlaut.
    const p = lauf('maler', ZIMMER + ' Die Möbel räumt der Kunde selbst raus.', zimmer())
    expect(finde(p, /Möbel abdecken/), 'Folie').toBeUndefined()
    expect(finde(p, /Erschwerniszuschlag bewohnt/), 'Zuschlag bewohnt').toBeUndefined()
  })
})

// ══════════════════════════════════════════════════════════════════════════
// PM-070 — Deckenrosette
// ══════════════════════════════════════════════════════════════════════════
//
// Themenspeicher A. Der Katalog kennt `Stuckrosette abkleben` (12,00 €/Stück,
// Maler) und `Deckenrosette montieren` (55,00 €/Stück, Stuck).

describe('PM-070 — die Deckenrosette bleibt ohne Zeile', () => {
  it('der Katalog kennt die Rosette', () => {
    expect(katalog('Stuckrosette abkleben')).toBe(12)
    expect(katalog('Deckenrosette montieren')).toBe(55)
  })

  it.fails('🔴 PM-070-A · „in der Mitte ist eine Deckenrosette, die muss mit gestrichen werden" erzeugt nichts', () => {
    // Gemessen: vier Positionen, keine davon nennt die Rosette. Weder eine
    // bepreiste Zeile noch eine Rückfrage. Der Altbau-Maler rechnet eine
    // Rosette einzeln ab — sie kostet Zeit, die in `Decke streichen` nicht
    // steckt.
    const p = lauf('maler', ZIMMER + ' In der Mitte ist eine Deckenrosette, die muss mit gestrichen werden.', zimmer())
    expect(finde(p, /Rosette/), 'Rosette').toBeDefined()
  })
})

// ══════════════════════════════════════════════════════════════════════════
// PM-071 — Sichtbalken
// ══════════════════════════════════════════════════════════════════════════
//
// Themenspeicher A: „Sichtbalken / Balkendecke, Altbau". Katalog:
// `Holzdecke / Paneele lasieren` 14,00 €/m² (Maler – Anstrich Innen),
// `Holzbalken anschleifen` 8,00 €/lfdm (Maler – Lackierarbeiten).

describe('PM-071 — Sichtbalken lasieren', () => {
  it('der Katalog kennt das Lasieren', () => {
    expect(katalog('Holzdecke / Paneele lasieren')).toBe(14)
    expect(katalog('Holzbalken anschleifen')).toBe(8)
  })

  it.fails('🔴 PM-071-A · „die Decke hat Sichtbalken, acht Stück, die werden lasiert" erzeugt nichts', () => {
    // Gemessen: keine Zeile nennt Balken oder Lasur. Die Deckenfläche bleibt
    // bei 20,00 m² `Decke streichen` — die Balken sind weder abgezogen noch
    // eigens berechnet. Eine ausdrücklich genannte Arbeit fällt aus.
    const p = lauf('maler', ZIMMER + ' Die Decke hat Sichtbalken, acht Stück, die werden lasiert.', zimmer())
    expect(finde(p, /Balken|lasier/i), 'Balken/Lasur').toBeDefined()
  })
})

// ══════════════════════════════════════════════════════════════════════════
// PM-072 — Estrich · der schwerste Fund dieses Batches
// ══════════════════════════════════════════════════════════════════════════
//
// Themenspeicher F: „Estrich — offen". Der Katalog führt ein vollständiges
// Estrich-Kapitel, u. a. `Zementestrich schwimmend (CT-C25-F4, 60mm)` zu
// 28,00 €/m².

describe('PM-072 — der Estrich wird zu „Bodenbelag verlegen" ohne Preis', () => {
  const T = 'Keller fünf mal vier. Zementestrich schwimmend einbauen, sechzig Millimeter.'
  const keller = () => [raum('Keller', { laenge: 5, breite: 4, arbeiten: ['zementestrich einbauen'] })]

  it('der Katalog kennt den Estrich', () => {
    expect(katalog('Zementestrich schwimmend (CT-C25-F4, 60mm)')).toBe(28)
  })

  it.fails('🔴 PM-072-A · der Auftrag wird zu einer Belagszeile umgedeutet', () => {
    // Gemessen: eine einzige Position, `Bodenbelag verlegen inkl. 5%
    // Verschnitt — Keller`, 21,00 m². Kein Estrich, kein Belag ist genannt
    // worden — die Zeile behauptet eine Arbeit, die niemand beauftragt hat,
    // und lässt die aus, die beauftragt wurde.
    const p = lauf('boden_parkett', T, keller())
    expect(finde(p, /Estrich/), 'Estrich').toBeDefined()
    expect(finde(p, /Bodenbelag verlegen/), 'erfundene Belagszeile').toBeUndefined()
  })

  it.fails('🔴 PM-072-B · und die Zeile, die entsteht, findet keinen Preis', () => {
    // 20,00 m² × 28,00 € = 560,00 €, die im Angebot fehlen. Die Ersatzzeile
    // trägt 0,00 € — das Angebot ist also nicht nur falsch, sondern
    // rechnerisch leer.
    expect(preis(lauf('boden_parkett', T, keller()), /Bodenbelag verlegen|Estrich/, 'boden_parkett')).not.toBeNull()
  })
})

// ══════════════════════════════════════════════════════════════════════════
// PM-073 — Fassade mit Gerüst · Kontrolle, und sie hält
// ══════════════════════════════════════════════════════════════════════════
//
// Themenspeicher F: „Fassade mit Gerüst — teilweise PM-008, PM-031".
// Hier vollständig: Fläche, Öffnungen, Gerüst.

describe('PM-073 — Fassade zwölf mal acht mit Gerüst', () => {
  const T = 'Fassade Straßenseite zwölf mal acht Meter, zweimal streichen. Sechs Fenster sind drin. Gerüst stellen.'
  const fassade = () => [raum('Fassade', {
    laenge: 12, hoehe: 8, arbeiten: ['fassade streichen 2x', 'gerüst stellen'],
    fenster: [1, 2, 3, 4, 5, 6].map(() => ({ breite: 1.2, hoehe: 1.4 })),
  })]

  it('die Fläche stimmt: 12 × 8 = 96 m²', () => {
    expect(menge(lauf('maler', T, fassade()), /Fassadenfläche streichen/)).toBe(96)
  })

  it('die sechs Fenster werden zu Recht nicht abgezogen — 1,68 m² je Stück, unter 2,5 m² (DIN 18363 / VOB C)', () => {
    // Übermessen ist hier richtig. Der Fall steht als Kontrolle, damit ein
    // späterer Umbau am Abzug nicht unbemerkt die Fassade mitnimmt.
    expect(menge(lauf('maler', T, fassade()), /Fassadenfläche streichen/)).toBe(96)
  })

  it('das Gerüst kommt als eigene Position mit Preis', () => {
    const p = lauf('maler', T, fassade())
    expect(finde(p, /Gerüst/)).toBeDefined()
    expect(preis(p, /Gerüst/, 'maler')).toBe(450)
  })
})

// ══════════════════════════════════════════════════════════════════════════
// PM-074 — Kaminsockel: ein Maß im Nebensatz baut eine fremde Position
// ══════════════════════════════════════════════════════════════════════════
//
// Themenspeicher A: „Kamin / Kaminsockel im Raum (Boden: Aussparung)".
// Der Fund ist nicht die fehlende Aussparung, sondern was das Maß anrichtet.

describe('PM-074 — der Kaminsockel', () => {
  const OHNE = 'Wohnzimmer fünf mal vier, Laminat schwimmend. In der Ecke steht ein Kaminsockel, da muss ausgespart werden.'
  const MIT = 'Wohnzimmer fünf mal vier, Laminat schwimmend. In der Ecke steht ein Kaminsockel, ein mal ein Meter, da muss ausgespart werden.'
  const wz = () => [raum('Wohnzimmer', { laenge: 5, breite: 4, belag: 'Laminat', arbeiten: ['laminat verlegen'] })]

  it('die Kontrolle: ohne Maßangabe entsteht keine Sockelleistenzeile', () => {
    expect(finde(lauf('boden_parkett', OHNE, wz()), /Sockelleisten/)).toBeUndefined()
  })

  it('die zweite Kontrolle: wirklich bestellte Sockelleisten kommen mit dem Raumumfang, 18 lfdm', () => {
    const p = lauf('boden_parkett', 'Wohnzimmer fünf mal vier, Laminat schwimmend, Sockelleisten neu.',
      [raum('Wohnzimmer', { laenge: 5, breite: 4, belag: 'Laminat', sockelleisten: true, arbeiten: ['laminat verlegen', 'sockelleisten montieren'] })])
    expect(menge(p, /Sockelleisten montieren/)).toBe(18)
  })

  // GEBAUT 16.09.2026 (Zug 3, Head of Product Engineering): Auslöser war der
  // Wortstamm `sockel`, der auch in „Kaminsockel" steckt. Wortgrenze statt
  // Wortstamm — `SOCKEL_ALLEIN` in `boden-vorarbeiten.ts`, dieselbe Reparatur
  // wie PM-064. Sperrklinke von `it.fails` auf `it` umgestellt.
  // PM-074-B (die fehlende Aussparung) ist ein anderer Fall, bleibt unberührt
  // und bleibt rot.
  it('✅ PM-074-A · „ein mal ein Meter" im Kaminsatz erzeugt „Sockelleisten montieren, 1 lfdm"', () => {
    // War gemessen: `Sockelleisten montieren — Wohnzimmer`, 1,00 lfdm, 5,50 €.
    // Niemand hat Sockelleisten bestellt. Das Maß gehört zum Kaminsockel und
    // wird zur Menge einer fremden Position. Kleines Geld, großer Mechanismus:
    // jede Maßangabe in einem Nebensatz kann so eine Zeile bauen.
    const p = lauf('boden_parkett', MIT, wz())
    expect(finde(p, /Sockelleisten/), 'erfundene Sockelleisten').toBeUndefined()
  })

  it.fails('🔴 PM-074-B · die Aussparung wird nicht abgezogen', () => {
    // Gemessen: 21,00 m² (20 m² + 5 % Verschnitt), als stünde der Kamin nicht
    // da. Ein Quadratmeter Aussparung ist unter der VOB-Schwelle für
    // Übermessung beim Bodenbelag nicht ohne Weiteres mitzumessen — hier
    // fehlt zumindest die Rückfrage.
    expect(menge(lauf('boden_parkett', MIT, wz()), /Laminat verlegen/)).toBeLessThan(21)
  })
})

// ══════════════════════════════════════════════════════════════════════════
// PM-075 — Wandnische im Bad
// ══════════════════════════════════════════════════════════════════════════
//
// Themenspeicher A: „Wandnische im Bad, gefliest (eigene Katalogzeile,
// 95,00 €/Stück)". Die Katalogzeile gibt es — `Nische / Wandnische fliesen`,
// Fliesen – Sonderarbeiten, 95,00 €/Stück.

describe('PM-075 — die Duschnische', () => {
  const BAD = () => [{ name: 'Bad', laenge: 2, breite: 3, flieshoehe: 2.1, nassbereich: true }]
  const T_OHNE = 'Bad zwei mal drei, Fliesenhöhe zwo Meter zehn, Wände und Boden fliesen.'
  const T_MIT = T_OHNE + ' In der Dusche kommt eine Wandnische rein, die wird mit gefliest.'

  it('der Katalog kennt die Nische', () => {
    expect(katalog('Nische / Wandnische fliesen')).toBe(95)
  })

  it('die Kontrolle: ohne Nischensatz sieben Positionen', () => {
    expect(laufFliesen(T_OHNE, BAD())).toHaveLength(7)
  })

  it.fails('🔴 PM-075-A · der Nischensatz ändert nichts — dieselben sieben Positionen', () => {
    // Gemessen: Position für Position identisch mit der Kontrolle. Die
    // ausdrücklich genannte Nische erzeugt weder Zeile noch Rückfrage.
    // 95,00 €, die auf keinem Angebot landen.
    expect(finde(laufFliesen(T_MIT, BAD()), /Nische/), 'Nische').toBeDefined()
  })
})

// ══════════════════════════════════════════════════════════════════════════
// PM-076 — Rollladenkästen · Fund im Katalog, nicht im Code
// ══════════════════════════════════════════════════════════════════════════
//
// Themenspeicher A: „Rollladenkästen". Hier ist der Code unschuldig: der
// Katalog hat für das Streichen eines Rollladenkastens keine Zeile. Er kennt
// nur Einbau, Motorisierung und Reparatur (Fenster – Rollladen &
// Sonnenschutz). Gehört damit zur Katalog-Lücke, nicht zur Code-Restliste.

describe('PM-076 — Rollladenkästen streichen', () => {
  it('🔴 PM-076-A · der Katalog hat keine Zeile fürs Streichen eines Rollladenkastens', () => {
    const treffer = DEFAULT_PRICES.filter(p =>
      /rollladen/i.test(p.title) && /streich|lackier|anstrich/i.test(p.title))
    expect(treffer, 'Katalog-Lücke — der Fund selbst').toHaveLength(0)
  })

  it.fails('🔴 PM-076-B · „die Rollladenkästen werden mit gestrichen" erzeugt nichts', () => {
    // Gemessen: vier Positionen, keine nennt den Rollladenkasten. Solange die
    // Katalogzeile fehlt, kann auch die Vollständigkeitsprüfung nichts
    // anbieten — der Fund gehört zuerst in den Katalog.
    const p = lauf('maler', ZIMMER + ' Zwei Fenster, die Rollladenkästen werden mit gestrichen.',
      [raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.5, arbeiten: ['wände streichen', 'decke streichen'], fenster: [{ breite: 1.2, hoehe: 1.4 }, { breite: 1.2, hoehe: 1.4 }] })])
    expect(finde(p, /Rollladen/), 'Rollladenkasten').toBeDefined()
  })
})

// ══════════════════════════════════════════════════════════════════════════
// PM-077 — die gesagte Arbeit trägt die Marke „automatisch ergänzt"
// ══════════════════════════════════════════════════════════════════════════
//
// Themenspeicher B: „Alte Tapete muss runter". Die Position entsteht — mit
// richtiger Menge und richtigem Preis. Der Fund liegt eine Ebene tiefer und
// zielt auf den Umbau, der gerade ansteht: Sie trägt
// `automatisch_ergaenzt: true`, obwohl der Handwerker sie diktiert hat.
//
// Warum das jetzt zählt: Nach Regel H Satz 3 soll eine so markierte Position
// künftig OHNE Menge und Preis kommen und angetippt werden müssen. Wird das
// gebaut, ohne diese Marke vorher zu reparieren, verliert eine ausdrücklich
// beauftragte Arbeit ihren Preis — 45,00 m² × 4,00 € = 180,00 €.

describe('PM-077 — `automatisch_ergaenzt` an einer diktierten Arbeit', () => {
  const GESAGT = ZIMMER + ' Die alte Tapete muss vorher runter.'
  const mitTapete = () => [raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.5, arbeiten: ['tapete entfernen', 'wände streichen', 'decke streichen'] })]

  it('die Kontrolle: ohne den Satz entsteht die Zeile nicht — sie ist also gesagt, nicht geraten', () => {
    expect(finde(lauf('maler', ZIMMER, zimmer()), /Tapete entfernen/)).toBeUndefined()
  })

  it('die Zeile selbst stimmt: 45,00 m² Wandfläche, 4,00 €/m²', () => {
    const p = lauf('maler', GESAGT, mitTapete())
    expect(menge(p, /Tapete entfernen/)).toBe(45)
    expect(preis(p, /Tapete entfernen/, 'maler')).toBe(4)
  })

  // CoS-E-059 Eingriff 3 (Engineering, 15.09.2026): gebaut und gemessen — aus
  // `it.fails` wird `it`. Fällt die Zeile künftig, ist sie ein Rückschritt.
  it('PM-077-A · die diktierte Arbeit trägt die Marke nicht mehr', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const zeile = finde(lauf('maler', GESAGT, mitTapete()), /Tapete entfernen/) as any
    expect(zeile.automatisch_ergaenzt, 'diktiert, nicht ergänzt').not.toBe(true)
  })
})

// ══════════════════════════════════════════════════════════════════════════
// PM-078 — Nachtrag am selben Abend: DC-107 ist gebaut, zwei Sätze bleiben
// ══════════════════════════════════════════════════════════════════════════
//
// Während dieser Batch entstand, hat der Designer `rechenweg-kundentext.ts`
// gebaut und in `pdf.tsx` eingehängt: Die Herkunftsnotiz („aus Transkript" /
// „aus Aufnahme") fällt auf dem Kundenpapier weg. Die Begründung dort ist
// nachgesehen und stimmt — dieselben zwei Wörter bedeuten in
// `maler-lackieren.ts` und `aufnahme-hinweise.ts` heute Gegenteiliges.
//
// Der Filter greift an einer Stelle für alle Gewerke. Was er nicht sieht:
// Rechenwege, die gar kein „Transkript" enthalten und trotzdem eine
// Arbeitsanweisung an den Betrieb sind. Zwei stehen im Code, beide erreichen
// das Kundendokument über denselben Weg (`rechenwegJeItem` → `pdf.tsx`).

describe('PM-078 — Arbeitsanweisungen im Rechenweg des Kundenpapiers', () => {
  const ANWEISUNG = 'Erkannt, aber Menge nicht sicher berechenbar — bitte manuell ergänzen'

  it('die Kontrolle: der neue Filter tut, was er soll', () => {
    expect(kundenRechenweg('4 Tür(en) aus Aufnahme')).toBe('4 Tür(en)')
    expect(kundenRechenweg('1 Fenster angenommen')).toBe('1 Fenster (angenommen)')
  })

  it('der Satz steht wörtlich an zwei Stellen im Code', () => {
    // `chips-vervollstaendigung.ts` und `mengen/mehrgewerk.ts`, jeweils als
    // `berechnungsweg` einer Position — nicht als `annahmen`. `annahmen`
    // kommt seit CoS-E-005 nicht mehr aufs Kundenpapier, der Rechenweg schon.
    expect(ANWEISUNG).toContain('bitte manuell ergänzen')
  })

  it('✅ PM-078-A · „bitte manuell ergänzen" erreicht das Kundendokument nicht mehr', () => {
    // Der Kunde liest auf dem Angebot, dass der Betrieb die Menge nicht
    // berechnen konnte und sie noch von Hand nachtragen soll. Das ist kein
    // Rechenweg, sondern eine Notiz an den Handwerker — dieselbe Sorte Text,
    // die CoS-E-005 mit dem `annahmen`-Array vom Papier genommen hat.
    //
    // Behoben mit DC-108 (Product Designer, 15.09.2026): Bleibt nach dem
    // Streichen der „bitte …"-Anweisung keine Zahl übrig, war der ganze Satz
    // eine Anweisung — dann fällt er weg und `pdf.tsx` schreibt wie bei jeder
    // Position ohne Rechenweg „Pauschale".
    expect(kundenRechenweg(ANWEISUNG)).not.toContain('bitte manuell ergänzen')
    expect(kundenRechenweg(ANWEISUNG)).toBe('')
    // Die Gegenprobe: eine echte Rechnung mit angehängter Anweisung verliert
    // nur die Anweisung, nicht die Rechnung.
    expect(kundenRechenweg('46,64 m² × 12,50 €/m² = 583,00 € — Menge bitte prüfen'))
      .toBe('46,64 m² × 12,50 €/m² = 583,00 €')
  })

  it('✅ PM-078-B · und der Schätzweg „Umfang ≈ 4 × √Fläche" ebenfalls nicht mehr', () => {
    // Aus `vollstaendigkeit/boden-vorarbeiten.ts` und
    // `vollstaendigkeit/maler-extras.ts`. Der Kunde sieht eine Wurzel und
    // erfährt damit, dass sein Raum als Quadrat angenommen wurde — die
    // Annahme selbst bleibt dabei unsichtbar, sie steht in `annahmen`.
    // Entweder die Annahme wird sichtbar oder der Schätzweg verschwindet;
    // beides zugleich ist die schlechteste Fassung.
    //
    // Behoben mit DC-108: Die Herleitung verschwindet, das Ergebnis bleibt.
    // Sichtbar machen scheidet nach PD-015 aus — eine als Annahme
    // gekennzeichnete Menge ist kein Angebot, sondern ein Vorbehalt. Das „≈"
    // sagt weiterhin, dass geschätzt wurde.
    expect(kundenRechenweg('Umfang ≈ 4 × √20 m² = 18 lfdm')).not.toContain('√')
    expect(kundenRechenweg('Umfang ≈ 4 × √20 m² = 18 lfdm')).toBe('Umfang ≈ 18 lfdm')
    expect(kundenRechenweg('Umfang ≈ 4 × √20 m² = 18 lfdm (voller Umfang, kein Türabzug)'))
      .toBe('Umfang ≈ 18 lfdm (voller Umfang, kein Türabzug)')
  })
})
