import { describe, it, expect } from 'vitest'
import {
  ANKER,
  leiteAb,
  runde,
  katalogPreis,
  pruefeGegenKatalog,
} from '../preis-ableitung'
import { DEFAULT_PRICES } from '../default-prices'

// CoS-E-053 Schritt 3/4 — die Ableitung aus den Ankerpreisen.
//
// Die beiden großen Prüfungen unten sind wörtlich die, die der Prüfmeister in
// PD-009 §7 angekündigt hat, bevor irgendetwas gebaut war. Sie stehen hier,
// damit sie bei jedem Lauf mitlaufen und nicht einmal von Hand gemacht werden.

const ALLE = ANKER.map(a => a.taetigkeit)

describe('Die Tabelle ist in sich schlüssig', () => {
  it('jeder Anker hat eine Katalogzeile — keine abgeschriebene Basis (PD-009 §4)', () => {
    // Der schärfste Fund der Durchsicht: Im Entwurf standen die Basiswerte als
    // Zahlen daneben, und „Vliestapete kleben" stand auf 9,00 € statt 18,00 €.
    // Der Faktor ist mein/basis — eine falsche Basis verzieht JEDE Zeile der
    // Tätigkeit. Deshalb darf es hier keine Basiszahl geben, nur Titel.
    for (const anker of ANKER) {
      expect(katalogPreis(anker.katalogTitel), anker.katalogTitel).not.toBeNull()
    }
  })

  it('jede Anker-Zeile kennt ihre Katalogzeile, jede Zeit-Zeile ihre Einheit', () => {
    for (const anker of ANKER) {
      for (const z of anker.zeilen) {
        if (z.katalogTitel) {
          expect(katalogPreis(z.katalogTitel), z.katalogTitel).not.toBeNull()
        }
        if (z.art === 'anker') {
          expect(z.katalogTitel, `Anker-Zeile ohne Katalogtitel: ${z.titel ?? '?'}`).toBeTruthy()
        } else {
          expect(
            Boolean(z.katalogTitel) || Boolean(z.titel && z.einheit),
            'Zeit-Zeile braucht Zwilling ODER eigenen Titel samt Einheit',
          ).toBe(true)
        }
      }
    }
  })

  it('ein Zwilling in anderer Einheit ist kein Zwilling', () => {
    // Daran ist der erste Anlauf gescheitert: „Boden reinigen" (je m²) hatte
    // „Baustelle kehren / saugen" (je Pauschale) als Zwilling, erbte die
    // Einheit — und wurde beim Runden auf 5 € zu 0,00 €.
    for (const anker of ANKER) {
      for (const z of anker.zeilen) {
        if (!z.katalogTitel || !z.einheit) continue
        expect(katalogPreis(z.katalogTitel)!.einheit, z.katalogTitel).toBe(z.einheit)
      }
    }
  })

  it('keine Zeile kostet null', () => {
    const umsonst = leiteAb(ALLE, {}, 52).filter(p => p.preis <= 0)
    expect(umsonst.map(p => p.titel)).toEqual([])
  })
})

describe('🔴 Probe 1 des Prüfmeisters: zwei Betriebe, 52 €/h und 75 €/h', () => {
  // Wörtlich: „Die Zeit-Zeilen müssen sich um genau diesen Faktor
  // unterscheiden, die Anker-Zeilen um gar nichts. Wenn sich eine Anker-Zeile
  // mitbewegt, steht sie in der falschen Spalte — und das sieht man an keinem
  // Bildschirm, nur am Vergleich."
  const guenstig = leiteAb(ALLE, {}, 52)
  const teuer = leiteAb(ALLE, {}, 75)

  it('gleich viele Zeilen, gleiche Reihenfolge', () => {
    expect(teuer.map(p => p.titel)).toEqual(guenstig.map(p => p.titel))
  })

  it('Anker-Zeilen bewegen sich gar nicht', () => {
    const bewegt = guenstig
      .map((p, i) => ({ p, q: teuer[i] }))
      .filter(({ p, q }) => p.art === 'anker' && p.rohpreis !== q.rohpreis)
      .map(({ p, q }) => `${p.titel}: ${p.rohpreis} → ${q.rohpreis}`)
    expect(bewegt).toEqual([])
  })

  it('Zeit-Zeilen bewegen sich um genau 75/52', () => {
    const faktor = 75 / 52
    const falsch = guenstig
      .map((p, i) => ({ p, q: teuer[i] }))
      .filter(({ p, q }) => p.art === 'zeit' && Math.abs(q.rohpreis / p.rohpreis - faktor) > 1e-9)
      .map(({ p, q }) => `${p.titel}: ${p.rohpreis} → ${q.rohpreis}`)
    expect(falsch).toEqual([])
    // Gegenprobe: Es muss überhaupt Zeit-Zeilen geben.
    expect(guenstig.filter(p => p.art === 'zeit').length).toBeGreaterThan(4)
  })
})

describe('🔴 Probe 2 des Prüfmeisters: abgeleitet gegen Katalog', () => {
  it('keine Zeile weicht um mehr als 20 % ab', () => {
    // „Für jede Position, die es auch im Standardkatalog gibt, müssen beide
    // Wege ungefähr dieselbe Zahl liefern. Sonst bekommt ein Betrieb, der die
    // Nick-Seite durchgeht, einen anderen Preis als einer, der sie wegklickt —
    // für dieselbe Arbeit, in derselben App."
    const ab = pruefeGegenKatalog(52)
    expect(
      ab.map(x => `${x.titel}: ${x.abgeleitet} statt ${x.katalog} (${Math.round(x.abweichung * 100)} %)`),
    ).toEqual([])
  })

  it('die korrigierten Zeitwerte treffen den Katalog (PD-009 §3)', () => {
    const p = leiteAb(ALLE, {}, 52)
    const finde = (m: RegExp) => p.find(x => m.test(x.titel))!
    // 0,04 h waren 2,08 €/lfm — Katalog sagt 0,80 €.
    expect(finde(/Sockelleisten abkleben/).preis).toBe(0.8)
    // Richtwert des Prüfmeisters vom 12.09.
    expect(finde(/Heizkörper abkleben/).preis).toBe(18)
    // Katalog 15,00 €.
    expect(finde(/Übergangsprofil/).preis).toBe(15)
  })
})

describe('Probe 2 ist ein Test über den Stundensatz — welcher steckt im Katalog?', () => {
  // Nachgemessen am 15.09., als „Fläche oder Zeit" fachlich durchgesehen
  // werden sollte. Probe 2 darüber ruft `pruefeGegenKatalog(52)` — und
  // **hängt an dieser 52**: Der Vergleich ist nur dort aussagekräftig, wo der
  // Stundensatz des Betriebs zu dem passt, mit dem der Katalog gerechnet ist.
  // Gemessen wird der Katalog grün von 44 bis 63 €/h, darüber und darunter
  // rot. Das ist kein Fehler, sondern die Folge der Aufteilung: Zeit-Zeilen
  // folgen dem Stundensatz, Anker-Zeilen dem Ankerpreis.
  //
  // Mit einer einzelnen Zahl im Test stünde da aber eine Zusicherung, die
  // niemand mehr nachrechnet. Deshalb hier die Frage eine Ebene höher, und
  // zwar so, dass sie vom Stundensatz UNABHÄNGIG ist: Jede Zeit-Zeile mit
  // einem echten Zwilling sagt über `Katalogpreis / Stunden`, welchen
  // Stundensatz der Katalog an dieser Stelle unterstellt. Die müssen
  // zusammenpassen — der Katalog trägt EINEN Stundensatz, nicht vier.
  //
  // Genau das fängt einen falschen Stundenwert auch dann, wenn ihn niemand
  // zufällig bei 52 €/h prüft: Die fünf Korrekturen aus PD-009 §3 wären hier
  // aufgefallen, ohne dass man die richtige Zahl schon kennen muss.
  const zwillinge = ANKER.flatMap(a =>
    a.zeilen
      .filter(z => z.art === 'zeit' && z.katalogTitel && z.stunden)
      .map(z => ({
        titel: z.katalogTitel!,
        impliziert: katalogPreis(z.katalogTitel!)!.preis / z.stunden!,
      })),
  )

  it('Gegenprobe: es gibt überhaupt Zeit-Zeilen mit Zwilling', () => {
    // Ohne diese Zeile prüfte der Test bei einer leeren Liste fröhlich nichts.
    expect(zwillinge.length).toBeGreaterThanOrEqual(3)
  })

  it('jede Zeit-Zeile unterstellt denselben Stundensatz wie der Katalog', () => {
    const daneben = zwillinge
      .filter(z => z.impliziert < 50 || z.impliziert > 56)
      .map(z => `${z.titel}: ${z.impliziert.toFixed(1)} €/h`)
    expect(daneben).toEqual([])
  })

  it('und sie liegen untereinander nicht mehr als 10 % auseinander', () => {
    const saetze = zwillinge.map(z => z.impliziert)
    const spanne = Math.max(...saetze) / Math.min(...saetze)
    expect(spanne, `${Math.min(...saetze).toFixed(1)} bis ${Math.max(...saetze).toFixed(1)} €/h`)
      .toBeLessThan(1.1)
  })

  it('Probe 2 bleibt grün über die üblichen Stundensätze, nicht nur bei 52', () => {
    // 45 bis 60 €/h ist die Spanne, in der sich die Betriebe bewegen, die wir
    // kennen. Wird eine Stundenzahl geändert, wandert das Fenster — und dann
    // soll hier etwas rot werden und nicht erst bei einem Betrieb.
    const rot: string[] = []
    for (let satz = 45; satz <= 60; satz++) {
      for (const a of pruefeGegenKatalog(satz)) {
        rot.push(`${satz} €/h · ${a.titel}: ${a.abgeleitet} statt ${a.katalog}`)
      }
    }
    expect(rot).toEqual([])
  })
})

describe('Die drei Umsortierungen aus PD-009 §2', () => {
  const boden = leiteAb(['boden'], {}, 52)
  const innen = leiteAb(['maler_innen'], {}, 52)

  it('Sockelleisten montieren hängt an der Zeit, nicht am Belagspreis', () => {
    // „Ein Betrieb, der Laminat für 25 €/m² verlegt, nimmt deshalb nicht
    // 8,50 € für den laufenden Meter Leiste."
    const teuer = leiteAb(['boden'], { boden: 25 }, 52)
    const a = boden.find(p => /Sockelleisten montieren/.test(p.titel))!
    const b = teuer.find(p => /Sockelleisten montieren/.test(p.titel))!
    expect(a.art).toBe('zeit')
    expect(b.preis).toBe(a.preis)
  })

  it('Kleberreste entfernen hängt an der Zeit und sagt, dass es schwankt', () => {
    const k = boden.find(p => /Kleberreste/.test(p.titel))!
    expect(k.art).toBe('zeit')
    expect(k.herkunft).toMatch(/vor Ort prüfen/)
  })

  it('Steckdosen: der Maler klemmt nichts ab', () => {
    // „So wie es dasteht, steht auf dem Kundenangebot eine Leistung, die der
    // Betrieb gar nicht erbringen darf."
    const titel = innen.map(p => p.titel).join(' | ')
    expect(titel).not.toMatch(/abklemmen/i)
    expect(titel).toMatch(/Steckdosen-Abdeckungen ab- und anbauen/)
  })

  it('Trittschall ist wählbares Material, kein Zubehör', () => {
    expect(boden.find(p => /Trittschall/.test(p.titel))!.material).toBe('wahl')
  })
})

describe('Der Faktor wirkt — und nur auf die Anker-Zeilen', () => {
  it('Manfreds 11,00 € statt 9,50 € heben die abgeleiteten Zeilen', () => {
    const katalog = leiteAb(['maler_innen'], {}, 52)
    const seine = leiteAb(['maler_innen'], { maler_innen: 11 }, 52)
    const k = katalog.find(p => /Wand streichen 1x/.test(p.titel))!
    const s = seine.find(p => /Wand streichen 1x/.test(p.titel))!
    expect(s.rohpreis).toBeGreaterThan(k.rohpreis)
    expect(s.rohpreis / k.rohpreis).toBeCloseTo(11 / 9.5, 6)
  })

  it('ohne eigene Zahl bleibt der Katalogpreis stehen', () => {
    // „Leere Felder sind erlaubt. Wer nur zwei Zahlen weiß, kommt weiter."
    for (const p of leiteAb(ALLE, {}, 52)) {
      if (p.art !== 'anker' || !p.katalogTitel) continue
      expect(p.rohpreis, p.titel).toBeCloseTo(katalogPreis(p.katalogTitel)!.preis, 6)
    }
  })

  it('über Kopf bleibt teurer als an der Wand (PD-009 §4)', () => {
    // Im Entwurf standen Decke 2x und Wand 2x beide auf 10,00 €. Wer aus dem
    // Katalog liest, kann das nicht mehr falsch abschreiben.
    const p = leiteAb(['maler_innen'], {}, 52)
    const decke = p.find(x => /Decke streichen 2x/.test(x.titel))!
    expect(decke.rohpreis).toBeGreaterThan(katalogPreis('Wand streichen 2x Anstrich')!.preis)
  })
})

describe('Die Herkunftszeile beantwortet die 63-%-Frage (PD-009 §5)', () => {
  it('1x-Zeilen sagen, dass die Vorbereitung extra zählt', () => {
    // Manfred sagt 75 %, der Katalog sagt 63 %. Beide haben recht — es hängt
    // daran, ob die Vorbereitung im m²-Preis steckt. Bei uns nicht. Das ist
    // nichts zum Entscheiden, sondern etwas zum Anzeigen.
    for (const p of leiteAb(ALLE, {}, 52)) {
      if (!/ 1x /.test(p.titel)) continue
      expect(p.herkunft, p.titel).toMatch(/ohne Vorbereitung, die zählt extra/)
    }
  })
})

describe('Kaufmännisch runden', () => {
  it('kleine Beträge auf 10 Cent, damit sie nicht verschwinden', () => {
    // Auf 0,50 € gerundet landen 0,78 € und 1,12 € beide auf 1,00 € — und der
    // Unterschied zwischen 52 €/h und 75 €/h wäre weg.
    expect(runde(0.78, 'lfdm')).toBe(0.8)
    expect(runde(1.125, 'lfdm')).toBe(1.1)
  })

  it('größere Beträge wie im Entwurf', () => {
    expect(runde(10.4, 'm²')).toBe(10.5)
    expect(runde(43.2, 'Stück')).toBe(43)
    expect(runde(37, 'Pauschale')).toBe(35)
  })
})

describe('Alle Katalogtitel der Tabelle gibt es wirklich', () => {
  it('kein Tippfehler zwischen Tabelle und Katalog', () => {
    // Genau dieser Abgleich war CoS-E-052: Ein Schlüssel zeigte auf etwas, das
    // es nicht gab, und niemand hat es gemerkt.
    const titel = new Set(DEFAULT_PRICES.map(p => p.title))
    const unbekannt: string[] = []
    for (const a of ANKER) {
      if (!titel.has(a.katalogTitel)) unbekannt.push(a.katalogTitel)
      for (const z of a.zeilen) {
        if (z.katalogTitel && !titel.has(z.katalogTitel)) unbekannt.push(z.katalogTitel)
      }
    }
    expect(unbekannt).toEqual([])
  })
})
