// Staffeln im Katalog — findet jede Zeile ihren eigenen Namen?
//
// ── Warum es diese Datei gibt (Manfred TN-095 / CoS-E-039, 12.09.2026) ────
//
// Manfreds Meldung lautete „die Preisliste hat lauter Dopplungen". Die
// Messung (`node scripts/katalog-dopplungen.mjs`) hat gezeigt, dass es keine
// Dopplungen sind, sondern **Staffeln**: zwei Zeilen, die sich nur durch
// eine Angabe in Klammern unterscheiden. Der Preis-Matcher normalisiert
// Klammern weg — danach heißen beide gleich, und es gewinnt die Zeile, die
// im Katalog weiter oben steht. Bei einer Staffel ist das die kleinste.
//
// Die Richtung ist damit nie zufällig: **Der Betrieb rechnet systematisch zu
// billig ab.** Beim Personenaufzug waren es 10.000 €, bei der beidseitig
// lackierten Tür 30 € — und die Tür kommt jeden Tag vor.
//
// 64 von 2379 Zeilen waren betroffen. Dieser Test hält die Reparatur fest,
// Zeile für Zeile am Geld, plus eine Obergrenze für den Rest.
import { describe, expect, it } from 'vitest'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'

type Zeile = { id: string; title: string; category: string; unit: string; unit_price: number }
const KATALOG: Zeile[] = DEFAULT_PRICES.map((p, i) => ({ id: `p${i}`, ...p }))

/** Dasselbe Gruppieren wie im Messskript: alles vor dem Gedankenstrich. */
const gewerkVon = (c: string) => c.split(/\s*[–-]\s*/)[0].trim()

/** Schickt einen Titel durch den echten Matcher, gegen sein eigenes Gewerk. */
function findetSichSelbst(titel: string) {
  const eigen = KATALOG.find(p => p.title === titel)
  if (!eigen) throw new Error(`Katalogzeile gibt es nicht (mehr): „${titel}"`)
  const kandidaten = KATALOG.filter(p => gewerkVon(p.category) === gewerkVon(eigen.category))
  const treffer = findePreisposition(titel, eigen.unit, kandidaten)
  return { ok: !!treffer && treffer.position.id === eigen.id, bekommt: treffer?.position ?? null, eigen }
}

describe('Staffeln — die teurere Stufe bekommt nicht den billigen Preis', () => {
  it.each([
    // Zahl + Einheit hinter der Zahl
    ['PV-Anlage elektrisch anschließen (>10 kWp)'],
    ['Personenaufzug einbauen (5–8 Haltestellen, maschinenraumlos)'],
    ['Ausgleichsmasse 10–30 mm einbringen'],
    // Einheit VOR der Zahl (DN 150, R90) — das kann kein Suffix-Muster
    ['Kernbohrung (DN 150–300)'],
    ['Heizungsrohre verlegen (DN 50+, je m)'],
    ['Brandschutzbeschichtung Stahl (R90, je m²)'],
    // Zahl mit Bindestrich an der Einheit („3-Zimmer")
    ['Haushaltsreinigung Pauschale (3-Zimmer-Wohnung)'],
    // Zwei Maße mit x/× dazwischen — sonst sind „78x118cm" und
    // „114x118cm" für den Vergleich dasselbe („118cm")
    ['Dachflächenfenster einbauen – groß (>114x118cm)'],
    ['Naturstein Boden verlegen (Großformat >60×60cm)'],
    // Lagen als Zahl, nicht als Wort
    ['Parkett ölen (maschinell, 2-lagig inkl. Einarbeiten)'],
  ])('%s findet sich selbst', titel => {
    const { ok, bekommt, eigen } = findetSichSelbst(titel)
    expect(ok, `bekommt stattdessen „${bekommt?.title}" zu ${bekommt?.unit_price} € statt ${eigen.unit_price} €`).toBe(true)
  })
})

describe('Wenn die Normalisierung das Produkt löscht', () => {
  // Manfreds Fund vom 12.09.2026, und der einzige seiner Art im ganzen
  // Katalog: `preis-matcher.ts` macht per Synonymregel aus Landhausdiele,
  // Massivholzdiele und Holzdiele EIN Wort. Danach heißen zwei Zeilen mit
  // 12,00 €/m² Unterschied buchstabengleich, und der Score ist nicht knapp,
  // sondern 1,000. Umbenennen hilft hier nicht — die Namen sind bereits
  // verschieden.
  it.each([
    ['Massivholzdiele verlegen, vollflächig verklebt', 52],
    ['Landhausdiele Mehrschicht verlegen, vollflächig verklebt', 40],
    ['Massivholzdielen verlegen verschraubt', 48],
  ])('%s → %i €', (titel, betrag) => {
    const { ok, bekommt } = findetSichSelbst(titel)
    expect(ok).toBe(true)
    expect(bekommt!.unit_price).toBe(betrag)
  })

  it('findet die neue Zeile auch unter der alten Schreibweise', () => {
    // Beim Umbenennungs-Zug (CoS-E-050) wurde aus der Mehrzahl die Einzahl.
    // Ein Betrieb, der „Massivholzdielen" tippt, und jedes Angebot von
    // gestern müssen weiter den 52-€-Preis bekommen — nicht 35 € Parkett
    // und nicht 18 € PVC. Beides ist beim Bauen tatsächlich passiert.
    const boden = KATALOG.filter(p => gewerkVon(p.category) === 'Boden')
    const treffer = findePreisposition('Massivholzdielen verlegen vollflächig verklebt', 'm²', boden)
    expect(treffer?.position.unit_price).toBe(52)
  })

  it('lässt den Oberbegriff „Holzdielen" weiter durch — auf eine Dielenzeile', () => {
    // Wer sich nicht festlegt, bekommt weiter einen Preis. Die Sperre trennt
    // Produkte, sie verlangt keine Produktangabe.
    //
    // Geprüft wird bewusst nicht der Betrag: WELCHE der beiden Dielenzeilen
    // gewinnt, hängt an der Wortzahl des Titels und hat sich beim
    // Umbenennungs-Zug verschoben (vorher Landhausdiele 40 €, jetzt
    // Massivholzdiele 52 €). Das ist eine Benennungsfrage, keine Zusicherung.
    // Zugesichert ist: Es bleibt eine DIELE. Beim Bauen traf diese Anfrage
    // zwischendurch Fertigparkett (35 €) und PVC-Belag (18 €) — falsches
    // Produkt, falscher Preis, und niemandem wäre es aufgefallen.
    const boden = KATALOG.filter(p => gewerkVon(p.category) === 'Boden')
    const treffer = findePreisposition('Holzdielen verlegen vollflächig verklebt', 'm²', boden)
    expect(treffer).not.toBeNull()
    expect(treffer!.position.title).toMatch(/diele/i)
  })
})

describe('Ein- oder beidseitig — im eigenen Gewerk, jeden Tag', () => {
  it.each([
    ['Tür streichen / lackieren (beidseitig)', 75],
    ['Tür streichen / lackieren (einseitig)', 45],
  ])('%s → %i €', (titel, betrag) => {
    const { ok, bekommt } = findetSichSelbst(titel)
    expect(ok).toBe(true)
    expect(bekommt!.unit_price).toBe(betrag)
  })

  it('sperrt nicht, wenn der Handwerker gar nichts dazu sagt', () => {
    // Die Regel ist `nur-unterschied`: Sie greift nur, wenn BEIDE Seiten
    // eine Angabe tragen. Sagt jemand nur „Tür lackieren", muss er weiter
    // einen Preis bekommen — sonst repariert man die Staffel und bricht den
    // Normalfall.
    const maler = KATALOG.filter(p => gewerkVon(p.category) === 'Maler')
    const treffer = findePreisposition('Tür streichen / lackieren', 'Stück', maler)
    expect(treffer).not.toBeNull()
  })
})

describe('Der Katalog als Ganzes', () => {
  // 60 Sekunden, und das ist kein Nachgeben: Der Lauf schickt alle 2379
  // Katalogzeilen durch den echten Matcher — das IST die Prüfung, nicht ihr
  // Rahmen. Er braucht rund 20 Sekunden und ist damit der langsamste Test
  // der Suite. Er verdient es: Ohne ihn hätte niemand gemerkt, dass 64
  // Zeilen ihren eigenen Namen nicht finden, darunter eine mit 10.000 €
  // Unterschied. Wer ihn schneller haben will, macht den Matcher schneller —
  // nicht die Prüfung kleiner.
  it('hat KEINE Zeile mehr, die ihren eigenen Namen nicht findet', () => {
    // Der Weg dahin: 64 (morgens) → 22 (Staffel-Erkennung) → 21 (Manfreds
    // Dielen-Fund) → 0 (Umbenennungs-Zug CoS-E-050, in dem Manfred allen
    // 22 verbliebenen Zeilen einen Namen gegeben hat, der das
    // unterscheidende Wort VOR das Verb stellt).
    //
    // Null ist die Sperrklinke, und bei null ist sie am schärfsten: Jede
    // neue Katalogzeile, die sich von einer vorhandenen nur in der Klammer
    // unterscheidet, macht diesen Test rot — bevor sie jemandem Geld
    // kostet. Genau dafür ist er da.
    const gruppen = new Map<string, Zeile[]>()
    for (const p of KATALOG) {
      const g = gewerkVon(p.category)
      if (!gruppen.has(g)) gruppen.set(g, [])
      gruppen.get(g)!.push(p)
    }
    const unerreichbar: string[] = []
    for (const kandidaten of gruppen.values()) {
      for (const p of kandidaten) {
        const treffer = findePreisposition(p.title, p.unit, kandidaten)
        if (treffer && treffer.position.id !== p.id) unerreichbar.push(p.title)
      }
    }
    expect(unerreichbar.length, `neu unerreichbar:\n${unerreichbar.join('\n')}`).toBe(0)
  }, 60_000)
})
