import { describe, it, expect } from 'vitest'
import { ANKER, katalogPreis, leiteAb, runde } from '../preis-ableitung'

// PD-013 — die Gegenprüfung zu „Fläche oder Zeit" (Prüfmeister, 15.09.2026)
//
// Engineering hat in PD-011 die drei Stellen ausgerechnet, an denen die
// Einteilung Geld bewegt, und ausdrücklich nichts entschieden: *„Die
// Einteilung ist Fachwissen und gehört dir."* Hier steht die Entscheidung —
// als Test, damit sie nicht in einer Datei verwelkt.
//
// ── Die Regel, nach der entschieden ist ───────────────────────────────────
//
// Die Frage heißt nicht „Fläche oder Zeit". Sie heißt:
//
//   **Bestimmt die neue Leistung den Aufwand, oder bestimmt ihn der Bestand?**
//
//   * Aufwand aus dem, was ENTSTEHT (Güte der neuen Oberfläche, Anzahl der
//     Gänge, Sorgfalt am Finish) → `anker`. Wer eine Tür für 120 € lackiert,
//     schleift sie auch anders an als für 90 €: feinere Körnung, ein Gang
//     mehr, sauberere Kanten. Dieselbe Arbeit in einer anderen Güte.
//   * Aufwand aus dem, was SCHON DA IST (Altbelag, Altkleber, alte Tapete,
//     verschmutzte Fassade, möbliertes Zimmer) → `zeit`. Was der Handwerker
//     vorfindet, wird nicht dadurch aufwendiger, dass er anschließend teures
//     Laminat verlegt. Es kostet, was es an Stunden kostet.
//
// Die Regel entscheidet alle drei Stellen aus PD-011 und noch zwei weitere,
// ohne dass für jede eine eigene Begründung nötig wäre.
//
// ── Was daraus folgt, Stelle für Stelle ───────────────────────────────────
//
// 1. Boden, Altbelag gegen Kleberreste → **beide auf `zeit`**.
//    Gemessen bei 75 €/h und 25 €/m² Laminat: Altbelag verklebt 16,00 €,
//    Kleberreste 11,50 € — Verhältnis 1,39. Der Katalog sagt 9,00/8,00 =
//    1,13. Zwei Gänge am selben Vormittag am selben Boden, deren Verhältnis
//    sich um ein Viertel verschiebt, weil einer am Belagspreis hängt.
//    Mit `zeit` steht es wieder auf 1,13, bei jedem Stundensatz.
//
// 2. Maler innen, Abdecken gegen Abkleben → **Abdecken auf `zeit`**.
//    Vlies auslegen und Kreppband ziehen sind derselbe Handgriff. Der
//    Aufwand kommt aus dem Zimmer, nicht aus der Wandfarbe.
//
// 3. Lackieren, Türen abschleifen und grundieren → **bleiben `anker`**.
//    Das ist keine Bequemlichkeit, sondern dieselbe Regel: Beide Zeilen
//    hängen an der Güte des Finishs, das entsteht. Engineerings Prüffrage
//    („schleift er die Tür dann auch teurer?") ist für das Anschleifen vor
//    dem Lack mit Ja zu beantworten — anders als beim Altkleber, dessen
//    Aufwand der alte Boden vorgibt, nicht der neue.
//
// Zwei weitere Zeilen fallen unter dieselbe Regel und sind mitentschieden:
// `Tapete ablösen (einlagig)` (was an der Wand klebt, gibt den Aufwand vor)
// und `Fassade reinigen / druckwaschen` (der Zustand der Fassade, nicht die
// Farbe, die danach draufkommt).
//
// Ausdrücklich NICHT entschieden: `Untergrund spachteln / ausgleichen
// (bis 5mm)`. Nach der Regel wäre es `zeit` — der Estrich gibt den Aufwand
// vor. Dagegen steht ein Materialanteil, der bei einer Ausgleichsmasse nicht
// klein ist. Die Zeile bleibt, wo sie ist, bis jemand den Materialanteil
// gemessen hat; sie steht als offener Punkt in der Restliste.
//
// ── Woher die Stundenzahlen kommen ────────────────────────────────────────
//
// Nicht geschätzt: zurückgerechnet aus dem Katalogpreis der Zeile über den
// Stundensatz, den der Katalog selbst trägt (53,3 €/h, vier unabhängige
// Zeilen in PD-011). Der Beleg steht unten als eigener Test — nach dem
// Vorschlag sind es NEUN Zeilen statt vier, und die Spanne bleibt bei 6,3 %.
// Damit ist die Zahl nicht mehr nur Beiwerk, sondern gemessen.

/** Die Entscheidung, in einer Tabelle. Titel wörtlich wie im Katalog. */
const AUF_ZEIT: Record<string, number> = {
  'Teppichboden verklebt entfernen': 0.17,      // Altbelag aufnehmen, verklebt
  'Laminat demontieren und entsorgen': 0.094,   // Altbelag aufnehmen, lose verlegt
  'Boden abdecken (Abdeckvlies)': 0.0225,
  'Tapete ablösen (einlagig)': 0.075,
  'Fassade reinigen / druckwaschen': 0.094,
}

/** Die vier, die schon vor PD-013 auf `zeit` standen und einen Zwilling haben. */
const SCHON_ZEIT: Record<string, number> = {
  'Sockelleisten abkleben': 0.015,
  'Altkleber abschaben': 0.15,
  'Sockelleisten montieren (Holz / MDF / Kunststoff)': 0.10,
  'Übergangsprofil / Schwelle einbauen': 0.29,
}

const ALLE_ZEIT = { ...SCHON_ZEIT, ...AUF_ZEIT }

function zeileVon(katalogTitel: string) {
  for (const anker of ANKER) {
    for (const z of anker.zeilen) if (z.katalogTitel === katalogTitel) return z
  }
  return null
}

describe('PD-013 · Die Stundenzahlen sind aus dem Katalog gelesen, nicht geschätzt', () => {
  it('jede der neun Zeit-Zeilen unterstellt denselben Stundensatz', () => {
    // Bewusst ohne vorgegebenen Stundensatz: Die Zeilen müssen untereinander
    // zusammenpassen. Eine verstellte Stundenzahl fällt damit auf, ohne dass
    // jemand vorher die richtige Zahl kennen muss.
    const saetze = Object.entries(ALLE_ZEIT).map(([titel, h]) => {
      const k = katalogPreis(titel)
      expect(k, `Katalogzeile fehlt: ${titel}`).not.toBeNull()
      return k!.preis / h
    })
    const min = Math.min(...saetze)
    const max = Math.max(...saetze)
    expect(min).toBeGreaterThanOrEqual(50)
    expect(max).toBeLessThanOrEqual(56)
    expect((max - min) / min).toBeLessThan(0.1)
  })

  it('und der Vorschlag macht das Band der Stundensätze nicht enger (44–63 €/h)', () => {
    // Probe 2 des Prüfmeisters, vorweggenommen: Wären die fünf neuen Zahlen
    // schlecht geraten, würde das grüne Band schrumpfen. Es tut es nicht.
    for (const satz of [44, 45, 52, 58, 63]) {
      for (const [titel, h] of Object.entries(ALLE_ZEIT)) {
        const k = katalogPreis(titel)!
        const abweichung = Math.abs(runde(h * satz, k.einheit) - k.preis) / k.preis
        expect(abweichung, `${titel} bei ${satz} €/h`).toBeLessThanOrEqual(0.2)
      }
    }
  })
})

describe('PD-013 · Was ausdrücklich `anker` bleibt', () => {
  it.each([
    ['Türen abschleifen', 'die Güte des Finishs gibt den Aufwand vor'],
    ['Türen grundieren', 'der Grundgang gehört zum Lackaufbau'],
    ['Schleifen von Hand', 'die Q-Stufe der neuen Fläche gibt den Aufwand vor'],
    ['Fläche spachteln (Flächenspachtel)', 'dito'],
  ])('„%s" hängt am Anker — %s', titel => {
    const z = zeileVon(titel)
    expect(z, `Zeile nicht in der Ableitungstabelle: ${titel}`).not.toBeNull()
    expect(z!.art).toBe('anker')
  })
})

describe('🔒 PD-013 · Sperrklinke: die fünf Zeilen gehören auf `zeit`', () => {
  // Diese vier Prüfungen sind heute GRÜN, weil der Fund bestätigt ist: Die
  // Zeilen stehen noch auf `anker`. Sobald Engineering sie umstellt, werden
  // sie ROT und zwingen dazu, das `.fails` zu streichen. Sperrklinke statt
  // Schweigen — dieselbe Bauart wie PM-013-A.
  it.fails.each(Object.keys(AUF_ZEIT))('noch nicht umgestellt: „%s"', titel => {
    const z = zeileVon(titel)
    expect(z, `Zeile nicht in der Ableitungstabelle: ${titel}`).not.toBeNull()
    expect(z!.art, `${titel} soll auf 'zeit' stehen, mit ${AUF_ZEIT[titel]} h`).toBe('zeit')
  })

  it.fails('Altbelag verklebt und Kleberreste halten das Katalogverhältnis 1,13 — auch bei 75 €/h', () => {
    // Der Geldweg in einer Zeile: Ein Betrieb mit 75 €/h und 25 €/m² Laminat
    // rechnet den verklebten Altbelag heute mit 16,00 € ab, die Kleberreste
    // mit 11,50 €. Der Katalog kennt das Verhältnis 9,00 : 8,00.
    const p = leiteAb(['boden'], { boden: 25 }, 75)
    const alt = p.find(x => x.titel === 'Altbelag aufnehmen, verklebt')!
    const kleber = p.find(x => x.titel === 'Kleberreste entfernen')!
    const katalogVerhaeltnis = katalogPreis('Teppichboden verklebt entfernen')!.preis
      / katalogPreis('Altkleber abschaben')!.preis
    expect(alt.preis / kleber.preis).toBeCloseTo(katalogVerhaeltnis, 1)
  })

  it.fails('Abdecken und Abkleben bewegen sich gemeinsam, nicht gegeneinander', () => {
    // Zwei Betriebe, gleicher Stundensatz, verschiedener Wandpreis. Vlies
    // auslegen darf sich dabei nicht anders verhalten als Kreppband ziehen.
    const guenstig = leiteAb(['maler_innen'], { maler_innen: 9.5 }, 52)
    const teuer = leiteAb(['maler_innen'], { maler_innen: 16 }, 52)
    const hol = (l: typeof guenstig, t: string) => l.find(x => x.titel === t)!.preis
    expect(hol(teuer, 'Boden abdecken (Abdeckvlies)'))
      .toBe(hol(guenstig, 'Boden abdecken (Abdeckvlies)'))
  })
})
