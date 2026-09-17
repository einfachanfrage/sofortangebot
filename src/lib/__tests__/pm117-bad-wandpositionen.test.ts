// PM-117 — Der Preisweg eines gewöhnlichen Badangebots: steht bei den
// Wandpositionen ein Preis oder eine Null? (Prüfmeister, 17.09.2026)
//
// ── Warum es diesen Prüfstand gibt ────────────────────────────────────────
//
// Engineering hat beim Bau von PM-075 gemessen, dass `gewerkFuerPosition`
// jeden Titel mit „Wand" darin zum Maler schickt, und hat ausdrücklich NICHT
// behauptet, dass daraus auf einem echten Badangebot 0,00 € werden: gemessen
// war der Router und der Katalogfilter, nicht der vollständige Preisweg.
// Genau diese Lücke schließt diese Datei — sie fährt dieselbe Kette wie der
// Endpunkt `src/app/api/angebot-generieren/route.ts`:
//
//   Engine → Vollständigkeitsprüfung → gewerkFuerPosition → Gewerke-Filter
//   → findePreisposition → unit_price ?? 0
//
// Das letzte Glied ist der Grund, warum eine fehlende Zuordnung nicht
// auffällt, sondern Geld kostet: der Endpunkt setzt `treffer?.position
// .unit_price ?? 0`. Es gibt danach keine zweite Stelle, die das auffängt —
// der einzige weitere Aufruf von `findePreisposition` sitzt in
// `AngebotDetail.tsx` und feuert nur, wenn der Handwerker von Hand die
// Anstrichzahl wechselt.
//
// ── Das Ergebnis, gemessen auf Sandys Rechner ─────────────────────────────
//
// Es ist eine Null. Auf einem gewöhnlichen Bad (3,20 × 2,10 m, Wände bis
// 2,20 m, Altfliesen raus) stehen 543,84 € da, wo 2.980,44 € hingehören.
// Alle drei Wandzeilen stehen mit 0,00 € im Angebot — zusammen 1.961,38 €.
//
// ── Und die Trennung, auf die es ankommt ──────────────────────────────────
//
// Der Router ist NICHT die ganze Ursache. Von den drei Wandzeilen findet nur
// EINE — `Verbundabdichtung Wand` — im Fliesenkatalog überhaupt einen
// Treffer (Score 0,94, 28,00 €/m²). Die beiden anderen scheitern zusätzlich
// am Wortlaut und blieben auch nach einem Router-Fix bei 0,00 €:
//
//   Router allein (PM-117-A):        652,96 €  ← wird mit /wand/ frei
//   Wortlaut zusätzlich (PM-060-A): 1.308,42 €  ← bleibt danach liegen
//
// Wer also `/wand/` repariert und das Bad für erledigt hält, hebt ein Drittel
// und lässt zwei Drittel stehen. Beides gehört zusammen gebaut.
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk, standardpreiseFuerGewerke } from '../default-price-selection'
import { gewerkFuerPosition } from '../positions-gewerk'

const mk = (ps: typeof DEFAULT_PRICES) => ps.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))
// Der Betrieb, um den es geht: ein Fliesenleger. Sein Katalog entsteht beim
// Onboarding aus `standardpreiseFuerGewerke(['fliesen'])`.
const FLIESENBETRIEB = mk(standardpreiseFuerGewerke(['fliesen']))
// Zum Vergleich der volle Katalog — ein Allrounder hat alles im Schrank.
const VOLL = mk(DEFAULT_PRICES)
const katalogpreis = (titel: string) => DEFAULT_PRICES.find(p => p.title === titel)!.unit_price

// Das gewöhnliche Bad: Wände und Boden fliesen, Altfliesen raus. Kein
// Sonderfall, keine Nische, keine bodengleiche Dusche.
const T = 'Badezimmer drei Meter zwanzig mal zwei Meter zehn, alles neu fliesen, '
  + 'Wände bis zwo Meter zwanzig hoch, Boden auch. Die alten Fliesen kommen raus.'
const BEREICHE = [{ name: 'Badezimmer', laenge: 3.2, breite: 2.1, flieshoehe: 2.2, nassbereich: true }]

function badangebot() {
  const eng = berechneMengen('fliesen', { transkript: T, bereiche: BEREICHE, altbelag: [{ bereich: 'Badezimmer', flaeche: 22 }] } as never)
  const meta = { raeume: [{ name: 'Badezimmer', hoehe: null }] }
  const signale = { arbeitenTexte: [], belagText: null, altbelagEntfernen: true, raeume: [{ name: 'Badezimmer', arbeiten: [] }] }
  return pruefeUndErgaenzeVollstaendigkeit('fliesen', eng.positionen, T, meta as never, signale as never).positionen
}

type Zeile = { beschreibung: string; einheit: string; menge: number }

/** Der Preisweg des Endpunkts, Zeile für Zeile — inklusive `?? 0` am Ende. */
function einzelpreis(z: Zeile, katalog: typeof VOLL, hauptgewerk = 'fliesen') {
  const gewerk = gewerkFuerPosition(z.beschreibung, hauptgewerk)
  const kandidaten = katalog.filter(k => preisKategoriePasstZuGewerk(k.category, gewerk))
  return findePreisposition(z.beschreibung, z.einheit, kandidaten)?.position.unit_price ?? 0
}
const summe = (zeilen: Zeile[], katalog: typeof VOLL, hauptgewerk = 'fliesen') =>
  Math.round(zeilen.reduce((s, z) => s + einzelpreis(z, katalog, hauptgewerk) * z.menge, 0) * 100) / 100
const finde = (zeilen: Zeile[], re: RegExp) => zeilen.find(z => re.test(z.beschreibung))!
const WANDZEILEN = [/^Wandfliesen verlegen/, /^Verfugung Wand/, /^Verbundabdichtung Wand/]

describe('PM-117 — der Preisweg eines gewöhnlichen Badangebots', () => {
  const pos = badangebot() as unknown as Zeile[]

  it('der Prüfstand misst überhaupt ein Bad — neun Zeilen, Mengen wie die Engine sie rechnet', () => {
    expect(pos).toHaveLength(9)
    // 3,20 × 2,10 = 6,72 m² netto, + 10 % Verschnitt = 7,39
    expect(finde(pos, /^Bodenfliesen verlegen/).menge).toBe(7.39)
    // Umfang 10,60 × 2,20 = 23,32 m² netto, + 5 % Verschnitt = 24,49
    expect(finde(pos, /^Wandfliesen verlegen/).menge).toBe(24.49)
    expect(finde(pos, /^Verfugung Wand/).menge).toBe(23.32)
    expect(finde(pos, /^Verbundabdichtung Wand/).menge).toBe(23.32)
  })

  // ── Die Antwort auf Engineerings Frage ──────────────────────────────────

  it('PM-117-A ✅ Soll erfüllt: keine der drei Wandzeilen steht mit 0,00 € im Angebot', () => {
    // GEMESSEN 17.09.2026: alle drei stehen mit 0,00 € da. Das ist die
    // Antwort — es ist eine Null, und sie trifft jedes Bad.
    const nullzeilen = WANDZEILEN
      .map(re => finde(pos, re))
      .filter(z => einzelpreis(z, FLIESENBETRIEB) === 0)
      .map(z => z.beschreibung.replace(/ — .*$/, ''))
    expect(nullzeilen).toEqual([])
  })

  it('PM-117-B ✅ Soll erfüllt: das Bad ist so viel wert, wie der Katalog dafür hergibt', () => {
    // GEMESSEN: 543,84 € statt 2.980,44 €. Auf dem Kundenpapier steht ein
    // komplett neu gefliestes Bad für unter 550 € — das unterschreibt kein
    // Betrieb und es glaubt ihm kein Kunde.
    expect(summe(pos, FLIESENBETRIEB)).toBeGreaterThan(2900)
  })

  it('PM-117-C Kontrolle · der Geldweg: die drei Wandzeilen sind 1.961,38 € wert', () => {
    // Menge × Katalogpreis, unabhängig davon, wohin der Router sie schickt —
    // diese Kontrolle bleibt grün, wenn der Fund behoben wird. Sie belegt
    // nur, worum es der Höhe nach geht.
    const wert =
      finde(pos, /^Wandfliesen verlegen/).menge * katalogpreis('Wandfliesen Standard (20×40 bis 30×60cm), gerade')
      + finde(pos, /^Verfugung Wand/).menge * katalogpreis('Verfugen Wand')
      + finde(pos, /^Verbundabdichtung Wand/).menge * katalogpreis('Verbundabdichtung Wand / Duschbereich (Flüssigfolie 2-lagig)')
    expect(Math.round(wert * 100) / 100).toBe(1961.38)
  })

  it('PM-117-D Kontrolle · die Lücke liegt nicht im Katalog — für jede der drei Zeilen gibt es eine fachlich richtige Fliesenzeile', () => {
    // Auch diese Kontrolle überlebt den Fix: sie prüft den Katalog, nicht den
    // Router. Sie schließt die Ausrede aus, dem Fliesenleger fehlten die
    // Zeilen — sie sind da und sie sind bepreist.
    expect(katalogpreis('Wandfliesen Standard (20×40 bis 30×60cm), gerade')).toBe(42)
    expect(katalogpreis('Verfugen Wand')).toBe(12)
    expect(katalogpreis('Verbundabdichtung Wand / Duschbereich (Flüssigfolie 2-lagig)')).toBe(28)
  })

  it('PM-117-E Kontrolle · warum es eine Null ist und kein schlechter Treffer: der Fliesenbetrieb hat keine einzige Maler-Kategorie', () => {
    // Der Router schickt die Zeile zum Maler, der Filter lässt danach nur
    // Kategorien durch, die mit „Maler" beginnen — im Katalog eines
    // Fliesenlegers gibt es davon keine. Die Kandidatenliste ist LEER, der
    // Matcher bekommt nichts zu sehen. Kein Wortlaut der Welt hilft hier.
    const fliesenkatalog = standardpreiseFuerGewerke(['fliesen'])
    expect(fliesenkatalog.length).toBeGreaterThan(90)
    expect(fliesenkatalog.filter(p => /^Maler/i.test(p.category))).toEqual([])
    // ── Engineering, 17.09.2026: repariert, nicht umgeschrieben ───────────
    //
    // Hier stand zusätzlich eine Schleife über die drei Wandzeilen, die
    // `gewerkFuerPosition(...) === 'maler'` voraussetzte und daraus die
    // leere Kandidatenliste ableitete. Sie hat damit die FEHLSTELLUNG
    // mitgemessen und ist durch den Bau rot geworden — dieselbe Lage, die
    // der Prüfmeister am Morgen bei PM-097-C selbst repariert hat, mit
    // seinem Satz: *eine Kontrolle, die der Fix rot macht, ist keine
    // Kontrolle.* Seine Korrektur ist hier angewandt.
    //
    // Der Zweck bleibt Wort für Wort derselbe und ist wiederhergestellt: zu
    // belegen, WARUM es eine Null war und kein schlechter Treffer. Geprüft
    // wird jetzt der Mechanismus statt der inzwischen behobenen
    // Fehlstellung — wohin auch immer eine Zeile geroutet wird: landet sie
    // beim Maler, sieht der Matcher im Katalog eines Fliesenlegers nichts.
    // Kein Wortlaut der Welt hilft dann.
    expect(FLIESENBETRIEB.filter(k => preisKategoriePasstZuGewerk(k.category, 'maler'))).toEqual([])
    // Und die Gegenprobe zum Bau: keine der drei geht heute noch dorthin.
    for (const re of WANDZEILEN) {
      const z = finde(pos, re)
      expect(gewerkFuerPosition(z.beschreibung, 'fliesen'), z.beschreibung).toBe('fliesen')
    }
  })

  it('PM-117-F Kontrolle · es trifft auch den Allrounder, der alles im Schrank hat', () => {
    // Ein Allrounder-Betrieb hat den vollen Katalog. Er bekommt trotzdem
    // dieselbe Summe, weil der Filter VOR dem Matcher greift: `maler` lässt
    // die Fliesenzeilen nicht durch. Der Fund hängt also nicht am Onboarding
    // des Betriebs, sondern am Router.
    expect(summe(pos, VOLL, 'fliesen')).toBe(summe(pos, VOLL, 'allrounder'))
  })

  it('PM-117-G ✅ Soll erfüllt: der Router-Anteil allein sind 652,96 € — und er ist nur ein Drittel', () => {
    // `Verbundabdichtung Wand` ist die EINZIGE der drei, die im
    // Fliesenkatalog einen Treffer findet (Score 0,94). Sie ist damit das,
    // was ein Router-Fix allein freimacht. Die Sperrklinke steht hier, damit
    // sie anschlägt, sobald er gebaut ist — und damit im selben Moment
    // sichtbar wird, dass PM-060-A (Wortlaut) danach immer noch offen ist.
    const z = finde(pos, /^Verbundabdichtung Wand/)
    expect(Math.round(einzelpreis(z, FLIESENBETRIEB) * z.menge * 100) / 100).toBe(652.96)
  })
})
