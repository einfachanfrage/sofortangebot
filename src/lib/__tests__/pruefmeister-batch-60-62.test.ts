// Fallbasis-Batch PM-060 bis PM-062 — Bad und Fliesen (Prüfmeister, 15.09.2026)
//
// Das Thema stand seit dem 10.09. im Themenspeicher unter F als „offen —
// eigener Batch". Es ist der erste Batch außerhalb von Maler und Boden, und
// das ist der Grund, warum er gebaut wurde: `fliesen` steht in
// `gewerke-config.ts` auf `aktiv: true`, ein Fliesenleger bekommt das Gewerk
// also angeboten — geprüft hat es bis heute niemand.
//
// Anders als die Batches PM-047 bis PM-056 läuft dieser NICHT über
// `verarbeiteExtraktion`: Die Pipeline dort normalisiert `raeume` für Maler
// und Boden; die Fliesen-Engine liest `bereiche` und `altbelag`. Hier wird
// deshalb Engine + Vollständigkeitsprüfung gefahren, so wie der Endpunkt es
// für dieses Gewerk tut. Was davor der KI-Schritt macht, ist nicht Gegenstand.
//
// Vier Prüfungen stehen als `it.fails` — sie halten ein Soll fest, das heute
// nicht erfüllt ist. Wird es gebaut, schlägt die Sperrklinke an und der Test
// muss auf `it` zurückgestellt werden.
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '../positions-gewerk'

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(transkript: string, bereiche: any[], altbelag: any[] = []) {
  const eng = berechneMengen('fliesen', { transkript, bereiche, altbelag })
  const meta = { raeume: bereiche.map(b => ({ name: b.name, hoehe: null })) }
  const signale = {
    arbeitenTexte: [], belagText: null,
    altbelagEntfernen: altbelag.length > 0,
    raeume: bereiche.map(b => ({ name: b.name, arbeiten: [] })),
  }
  return pruefeUndErgaenzeVollstaendigkeit('fliesen', eng.positionen, transkript, meta as never, signale as never).positionen
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], m: RegExp) => pos.find(p => m.test(p.beschreibung))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function preis(pos: any[], m: RegExp) {
  const p = finde(pos, m)
  if (!p) return null
  const g = gewerkFuerPosition(p.beschreibung, 'fliesen')
  return findePreisposition(p.beschreibung, p.einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))?.position.unit_price ?? null
}
const katalog = (titel: string) => DEFAULT_PRICES.find(p => p.title === titel)!.unit_price

// ── PM-060 ────────────────────────────────────────────────────────────────

describe('PM-060 — Bad komplett neu fliesen, Nassbereich', () => {
  const T = 'Bad komplett neu fliesen, zwei Meter vierzig mal ein Meter achtzig, Fliesenhöhe zwo Meter zehn. Nassbereich, Dusche. Die alten Fliesen kommen raus, das sind sechzehn Quadratmeter.'
  const pos = () => lauf(T, [{ name: 'Bad', laenge: 2.4, breite: 1.8, flieshoehe: 2.1, nassbereich: true }], [{ bereich: 'Bad', flaeche: 16 }])

  it('die Mengen stimmen — Verschnitt 10 % Boden, 5 % Wand, Verfugung auf netto', () => {
    const p = pos()
    // 2,40 × 1,80 = 4,32 m² netto, + 10 % = 4,75
    expect(finde(p, /bodenfliesen verlegen/i).menge).toBe(4.75)
    expect(finde(p, /verfugung boden/i).menge).toBe(4.32)
    // Umfang 8,40 × 2,10 = 17,64 m² netto, + 5 % = 18,52
    expect(finde(p, /wandfliesen verlegen/i).menge).toBe(18.52)
    expect(finde(p, /verfugung wand/i).menge).toBe(17.64)
    expect(finde(p, /fliesensockel/i).menge).toBe(8.4)
    // Abdichtung liegt auf der NETTO-Fläche, nicht auf der Verschnittmenge —
    // das ist richtig so: abgedichtet wird die Wand, nicht der Verschnitt.
    expect(finde(p, /verbundabdichtung boden/i).menge).toBe(4.32)
    expect(finde(p, /verbundabdichtung wand/i).menge).toBe(17.64)
  })

  it('PM-060-A ✅ von den sieben preislosen Zeilen ist eine übrig — und die ist eine Frage an den Prüfmeister', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-078)
    //
    // Nachgezählt statt vermutet: Das hier war KEINE Sperrklinke, sondern
    // ein gewöhnliches `it`, das den Fund festhielt — es zählte sieben
    // Zeilen ohne Preis und wurde grün, solange der Fund bestand. Damit hat
    // es die Fehlstellung gemessen und ist durch den Bau rot geworden.
    // Dieselbe Lage wie bei PM-097-C, und derselbe Satz des Prüfmeisters
    // gilt: *eine Kontrolle, die der Fix rot macht, ist keine Kontrolle.*
    //
    // Gebaut sind seither beide Ursachen, die er selbst getrennt hat: der
    // Router (PM-060-B / PM-117) und der Wortlaut (diese Zeile). Sechs der
    // sieben finden ihren Preis. Die Kontrolle zählt ab jetzt, was übrig
    // ist — derselbe Gegenstand, dieselbe Zählweise, andere Richtung.
    //
    // ── ❓ Die eine, die übrig ist, ist ein Widerspruch in zwei Notizen ───
    //
    // `Entsorgung Fliesenmaterial` (16,00 m²) findet nichts: der Katalog
    // führt `Fliesenschutt entsorgen (Container / Absackung)`, 8,00 €/m².
    // Gemeinsames Wort: keines. 128,00 €.
    //
    // Der Prüfmeister hat die Zeile ZWEIMAL bewertet, und die beiden Notizen
    // widersprechen sich:
    //   • PM-060-A rechnet `Fliesenschutt entsorgen` in die 1.935,94 € ein —
    //     also: es gibt eine Katalogzeile.
    //   • PM-117 notiert in der Sollspalte „keine Katalogzeile" — also: es
    //     gibt keine.
    //
    // Ob `Entsorgung Fliesenmaterial` und `Fliesenschutt entsorgen` dieselbe
    // Arbeit sind, ist ein Wortlaut und gehört ihm. **Nicht entschieden, die
    // Frage liegt in seiner Datei.** Gebaut ist der Stand aus PM-117 (keine
    // Zeile), weil dessen Sollspalte die jüngere der beiden ist und weil
    // PM-117-B daran misst. Kippt seine Antwort, ist es eine Zeile
    // Synonym — dann schlägt diese Zusicherung an.
    const p = pos()
    const ohnePreis = p.filter(z => preis(p, new RegExp(z.beschreibung.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')) === null)
    expect(ohnePreis.map(z => z.beschreibung.replace(/ — .*$/, '')).sort()).toEqual([
      'Entsorgung Fliesenmaterial',
    ])
    // Was die sieben Zeilen kosten würden, fänden sie ihre Katalogzeile:
    const summe =
      4.75 * katalog('Bodenfliesen Standard (30×30 bis 60×60cm), gerade, Q2')
      + 4.32 * katalog('Verfugen Boden')
      + 18.52 * katalog('Wandfliesen Standard (20×40 bis 30×60cm), gerade')
      + 17.64 * katalog('Verfugen Wand')
      + 17.64 * katalog('Verbundabdichtung Wand / Duschbereich (Flüssigfolie 2-lagig)')
      + 8.4 * katalog('Sockelleiste / Fliesensockel verlegen')
      + 16 * katalog('Fliesenschutt entsorgen (Container / Absackung)')
    expect(Math.round(summe * 100) / 100).toBe(1935.94)
  })

  it('PM-060-B ✅ die drei Wand-Zeilen gehen dorthin, wo ihr Preis steht', () => {
    // ── Repariert, nicht umgeschrieben, 17.09.2026 (Engineering, CoS-E-078)
    //
    // Auch das war keine Sperrklinke, sondern ein gewöhnliches `it`: es
    // hielt fest, dass `gewerkFuerPosition` die drei Wand-Zeilen des Bades
    // zum Maler schickt, und wurde durch den Bau rot. Seit CoS-E-078 geht
    // Fliesenarbeit VOR der `/wand/`-Regel — die `/wand/`-Regel selbst ist
    // dabei unangetastet geblieben, ihr Radius gehört dem Maler. Der zweite
    // Teil der Kontrolle (die Boden-Zwillinge landen richtig) steht
    // unverändert darunter und war nie betroffen.
    for (const titel of ['Wandfliesen verlegen — Bad', 'Verfugung Wand — Bad', 'Verbundabdichtung Wand — Bad']) {
      expect(gewerkFuerPosition(titel, 'fliesen'), titel).toBe('fliesen')
    }
    // Und die Boden-Zwillinge derselben Arbeit landen richtig:
    for (const titel of ['Bodenfliesen verlegen — Bad', 'Verfugung Boden — Bad', 'Verbundabdichtung Boden — Bad']) {
      expect(gewerkFuerPosition(titel, 'fliesen')).toBe('fliesen')
    }
  })

  it('PM-060-B, der Geldweg: eine der drei Zeilen hätte im Fliesenkatalog getroffen', () => {
    // `Verbundabdichtung Wand` trifft im Fliesenkatalog mit Score 0,94 auf
    // 28,00 €/m². Nur die Gewerke-Zuordnung steht davor. 17,64 × 28,00.
    const nurFliesen = KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, 'fliesen'))
    const t = findePreisposition('Verbundabdichtung Wand — Bad', 'm²', nurFliesen)
    expect(t?.position.unit_price).toBe(28)
    expect(Math.round(17.64 * 28 * 100) / 100).toBe(493.92)
    // ── Engineering, 17.09.2026: repariert, nicht umgeschrieben ──────────
    //
    // Hier stand `expect(preis(pos(), /verbundabdichtung wand/i)).toBeNull()`
    // — „…während der Weg, den die App heute geht, nichts findet". Diese
    // Zeile hat die FEHLSTELLUNG gemessen und ist durch den Bau rot
    // geworden. Dieselbe Lage, die der Prüfmeister am Morgen bei PM-097-C
    // selbst repariert hat, mit seinem Satz: *eine Kontrolle, die der Fix
    // rot macht, ist keine Kontrolle.* Seine Korrektur ist hier angewandt.
    //
    // Der Zweck ist unverändert und wiederhergestellt: zu belegen, dass die
    // Zuordnung davorstand und nicht der Katalog. Die 493,92 € oben sind
    // sein Betrag und stehen unberührt. Geprüft wird ab jetzt, dass der Weg
    // der App denselben Preis findet wie der Katalog hergibt.
    expect(preis(pos(), /verbundabdichtung wand/i)).toBe(28)
  })

  it.fails('SOLL: ein aktives Gewerk bringt für jede erzeugte Zeile einen Preis mit', () => {
    const p = pos()
    for (const z of p) {
      expect(preis(p, new RegExp(z.beschreibung.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'))).not.toBeNull()
    }
  })

  it('die zwei Zeilen, die einen Preis finden, finden den richtigen', () => {
    expect(preis(pos(), /verbundabdichtung boden/i)).toBe(22)
    expect(preis(pos(), /altfliesen abstemmen/i)).toBe(18)
  })
})

// ── PM-061 ────────────────────────────────────────────────────────────────

describe('PM-061 — „nur die Wandfliesen": der Boden wird trotzdem berechnet', () => {
  // Das Gegenstück zu PM-047 („nur die Decke, Wände bleiben"), das für Maler
  // grün ist. Für Fliesen gibt es die Prüfung nicht: `fliesenEngine` schreibt
  // Bodenfliesen, sobald Länge und Breite dastehen — unabhängig davon, was
  // gesagt wurde. `erkenneFliesenBereich()` kennt `nurWand` sogar, aber es
  // wird erst NACH der Engine gelesen und räumt nichts mehr weg.
  //
  // Das ist die Regel „Nichts erfinden" (Themenspeicher H, von Sandy am 12.09.
  // entschieden), einmal ganz: nicht eine ergänzte Zeile mit Preis, sondern
  // drei Zeilen für eine Arbeit, die ausdrücklich ausgenommen wurde.
  const T = 'Im Bad nur die Wandfliesen runter, die alten Fliesen an der Wand kommen weg, achtzehn Quadratmeter. Danach neu fliesen bis zwei Meter zehn. Bad ist zwei Meter vierzig mal ein Meter achtzig.'
  const pos = () => lauf(T, [{ name: 'Bad', laenge: 2.4, breite: 1.8, flieshoehe: 2.1, nassbereich: false }], [{ bereich: 'Bad', flaeche: 18 }])

  it('die Wandseite steht richtig da', () => {
    expect(finde(pos(), /wandfliesen verlegen/i).menge).toBe(18.52)
    expect(finde(pos(), /verfugung wand/i).menge).toBe(17.64)
  })

  it.fails('PM-061-A SOLL: keine Bodenzeile, wenn „nur die Wandfliesen" gesagt ist', () => {
    const p = pos()
    expect(finde(p, /bodenfliesen verlegen/i)).toBeUndefined()
    expect(finde(p, /verfugung boden/i)).toBeUndefined()
    expect(finde(p, /fliesensockel/i)).toBeUndefined()
  })

  it('der Geldweg dazu: 324,50 € Arbeit, die niemand bestellt hat', () => {
    // Zu heutigen Katalogpreisen, sobald PM-060-A behoben ist. Solange die
    // Zeilen 0,00 € tragen, ist es „nur" Papier — danach ist es Geld.
    const p = pos()
    expect(finde(p, /bodenfliesen verlegen/i).menge).toBe(4.75)
    expect(finde(p, /verfugung boden/i).menge).toBe(4.32)
    expect(finde(p, /fliesensockel/i).menge).toBe(8.4)
    const summe = 4.75 * katalog('Bodenfliesen Standard (30×30 bis 60×60cm), gerade, Q2')
      + 4.32 * katalog('Verfugen Boden')
      + 8.4 * katalog('Sockelleiste / Fliesensockel verlegen')
    expect(Math.round(summe * 100) / 100).toBe(324.5)
  })
})

// ── PM-062 ────────────────────────────────────────────────────────────────

describe('PM-062 — Altfliesen abstemmen: der Titel sagt nicht, welche', () => {
  // Der Katalog unterscheidet Boden (18,00 €/m²) und Wand (22,00 €/m²). Die
  // Engine schreibt einen Titel für beides — und er trifft immer den Boden.
  // Bei Wandfliesen sind das 4,00 €/m² zu wenig, und auf dem Kundenpapier
  // steht eine Arbeit, die nicht die ausgeführte ist.
  //
  // Dieselbe Familie wie TN-127 (PM-056-A): Der Titel nimmt nicht, was im
  // Raum liegt.
  const T = 'Im Bad nur die Wandfliesen runter, die alten Fliesen an der Wand kommen weg, achtzehn Quadratmeter. Danach neu fliesen bis zwei Meter zehn. Bad ist zwei Meter vierzig mal ein Meter achtzig.'
  const pos = () => lauf(T, [{ name: 'Bad', laenge: 2.4, breite: 1.8, flieshoehe: 2.1 }], [{ bereich: 'Bad', flaeche: 18 }])

  it('der Katalog kennt beide Richtungen mit verschiedenen Preisen', () => {
    expect(katalog('Altfliesen Boden abstemmen (einlagig)')).toBe(18)
    expect(katalog('Altfliesen Wand abstemmen')).toBe(22)
  })

  it.fails('PM-062-A SOLL: bei Wandfliesen der Wandpreis — 22,00 € statt 18,00 €', () => {
    expect(preis(pos(), /altfliesen abstemmen/i)).toBe(22)
  })

  it('heute: 18,00 €/m², auf 18 m² sind das 72,00 € zu wenig', () => {
    expect(preis(pos(), /altfliesen abstemmen/i)).toBe(18)
    expect(18 * (22 - 18)).toBe(72)
  })

  it.fails('PM-062-B SOLL: der Titel nennt das Bauteil, das abgestemmt wird', () => {
    expect(finde(pos(), /altfliesen abstemmen/i).beschreibung).toMatch(/wand/i)
  })
})
