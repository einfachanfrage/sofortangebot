// Herkunftsprüfung — Themenspeicher-Punkt 14 (Prüfmeister, 21.09.2026)
//
// PM-132 hat gezeigt, dass ein Rechenweg „50 Tür(en) aus Transkript" drucken
// kann, obwohl im Transkript keine Türzahl steht. Punkt 10 des
// Themenspeichers fragt, ob eine gekennzeichnete ANNAHME geprüft ist — hier
// ist die KENNZEICHNUNG SELBST unwahr, und das ist die teurere Klasse:
// „aus Transkript" ist genau die Zeile, die einen Menschen vom Nachschauen
// abhält.
//
// Punkt 14 fragt: wie viele Rechenwege sagen „aus Transkript", und bei wie
// vielen steht die Zahl wirklich im Transkript? Diese Datei misst das, statt
// es zu schätzen. 40 Stellen im Produkt schreiben „aus Transkript" (gemessen
// am 21.09. über `grep -rn "aus Transkript" src/lib --include=*.ts`, ohne
// Tests); die neun Diktate unten decken die tragenden davon ab und laufen
// über die volle Pipeline, nicht an ihr vorbei.
//
// ZWEI LEHREN AUS DEM BAU DIESER MESSUNG — beide gehören zur Antwort:
//
// 1. Eine Prüfung „steht die Ziffer irgendwo im Text?" misst nichts. Bei
//    PM-132 steht die 50 im Text — nur eben an den Fliesen und nicht an den
//    Türen. Die erste Fassung dieser Datei fand deshalb null Funde und war
//    dabei wertlos. Geprüft wird seither die Zahl NEBEN ihrem Ding; das Ding
//    liest die Prüfung aus dem Rechenweg selbst („4 Tür(en) …" → Tür).
// 2. Die Messung braucht eine Gegenprobe an sich selbst. Die beiden
//    Selbsttests am Ende stellen je einen Rechenweg hin, einen falschen und
//    einen richtigen. Ohne sie wäre „0 Funde" nicht von „misst nicht" zu
//    unterscheiden — genau der Fehler, den diese Datei beim Produkt sucht.
//
// ERGEBNIS DES LAUFS VOM 21.09.: kein einziger unbelegter Rechenweg. Die drei
// bekannten Familien (PM-131 Komma · PM-132 Stück am falschen Bauteil ·
// PM-133 Ordnungszahl) sind gebaut und stehen hier als Gegenproben — am
// Zähler nachgemessen: `zaehleTueren` gibt bei „Wir liefern 50 Stück Fliesen
// dazu" heute 0 statt 50, bei „Fenster 3 ist kaputt" 0 statt 3. Deshalb
// steht in dieser Datei keine einzige `it.fails`: es gibt nichts zu sperren.
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ergaenzeAusAufnahmeHinweisen, normalisiereBodenPositionenAusAufnahme } from '../mengen/aufnahme-hinweise'
import { ersetzeZahlenWorte } from '../zahlen-parser'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(gewerk: 'maler' | 'boden_parkett', transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk, raeume, transkript } } as never)
  const text = ersetzeZahlenWorte(transkript)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen(gewerk, extraktion)
  const r2 = extraktion.raeume ?? raeume
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
  const ergebnis = pruefeUndErgaenzeVollstaendigkeit(gewerk, eng.positionen, text, meta as never, signale as never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chips: string[] = r2.flatMap((r: any) =>
    (r.arbeiten ?? []).map((a: string) => `${a}${r.name ? ` — ${r.name}` : ''}`),
  )
  return normalisiereBodenPositionenAusAufnahme(
    ergaenzeAusAufnahmeHinweisen(ergebnis.positionen, chips, text), text,
  )
}

/** Steht die Zahl als eigenes Wort im Text? Ziffer oder Zahlwort, Komma wie Punkt. */
function stehtImText(zahl: number, text: string): boolean {
  return stelleImText(zahl, text) >= 0
}

/** Position der Zahl im Text, oder -1. */
function stelleImText(zahl: number, text: string): number {
  const t = ersetzeZahlenWorte(text).toLocaleLowerCase('de-DE')
  const schreibweisen = new Set<string>()
  schreibweisen.add(String(zahl))
  schreibweisen.add(String(zahl).replace('.', ','))
  if (Number.isInteger(zahl)) { schreibweisen.add(`${zahl},0`); schreibweisen.add(`${zahl},00`) }
  else { schreibweisen.add(zahl.toFixed(2)); schreibweisen.add(zahl.toFixed(2).replace('.', ',')) }
  let beste = -1
  for (const s of schreibweisen) {
    const m = new RegExp(`(^|[^\\d.,])(${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})([^\\d.,]|$)`).exec(t)
    if (m && (beste < 0 || m.index < beste)) beste = m.index + m[1].length
  }
  return beste
}

/**
 * Das gezählte Ding, wie der Rechenweg es nennt: das Wort direkt hinter der
 * Zahl. `4 Tür(en) aus Transkript` → `tür`. Klammern und Endungen fallen weg,
 * damit „Tür(en)" auch „türen" trifft.
 */
function gezaehltesDing(weg: string): string | null {
  const m = /\d+(?:[.,]\d+)?\s+([A-Za-zÄÖÜäöüß²()/]+)/.exec(weg)
  if (!m) return null
  const wort = m[1].replace(/\(.*?\)/g, '').replace(/[^A-Za-zÄÖÜäöüß²]/g, '').toLocaleLowerCase('de-DE')
  return wort.length >= 2 ? wort : null
}

/** Stamm für den Vergleich — deutsche Endungen abschneiden, aber nicht zu viel. */
const stamm = (w: string) => w.replace(/(en|er|e|n|s)$/u, '').slice(0, 6)

/**
 * Steht die Zahl im Transkript NEBEN dem Ding, das sie zählt?
 *
 * Das ist die eigentliche Frage von Punkt 14. Eine Prüfung, die nur fragt, ob
 * die ZIFFER irgendwo im Text vorkommt, geht an PM-132 vorbei: dort steht die
 * 50 im Text („50 Stück Fliesen") — nur eben nicht an den Türen.
 */
function stehtNebenDing(zahl: number, ding: string, text: string): boolean {
  const t = ersetzeZahlenWorte(text).toLocaleLowerCase('de-DE')
  if (ding === 'm²' || ding === 'm' || ding === 'lfdm' || ding === 'stück') {
    // Einheiten: die Einheit selbst muss neben der Zahl stehen.
    const einheiten = ding === 'm²' ? '(m²|quadratmeter|qm)' : ding === 'stück' ? '(stück|st)' : '(m|meter|lfm)'
    // Kein `\b` hinter der Einheit: „m²" endet auf einem Zeichen, das keine
    // Wortgrenze bildet — die Prüfung ginge sonst immer schief.
    return new RegExp(`(^|[^\\d.,])${String(zahl).replace('.', '[.,]')}\\s*${einheiten}(?![\\p{L}])`, 'u').test(t)
  }
  const st = stamm(ding)
  if (st.length < 3) return true
  const stelle = stelleImText(zahl, t)
  if (stelle < 0) return false
  // Fenster von 30 Zeichen hinter und 20 vor der Zahl — das ist großzügiger
  // als jede Formulierung, die ein Handwerker spricht.
  const umfeld = t.slice(Math.max(0, stelle - 20), stelle + 30)
  return umfeld.includes(st)
}

/** Die Zahlen, die der Rechenweg VOR „aus Transkript" nennt. */
function zahlenImRechenweg(weg: string): number[] {
  const vorn = weg.split(/aus Transkript/i)[0]
  return [...vorn.matchAll(/\d+(?:[.,]\d+)?/g)].map(m => Number(m[0].replace(',', '.')))
}

type Fund = { beschreibung: string; menge: number; weg: string }

/**
 * Alle Positionen eines Laufs, die „aus Transkript" behaupten, deren Menge
 * aber im Transkript nicht neben dem gezählten Ding steht. Eine Menge, die
 * Summe genannter Zahlen ist, gilt als gedeckt (`3 Spots + 2 Leuchten`).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unbelegt(transkript: string, positionen: any[]): Fund[] {
  return positionen
    .filter(p => typeof p.berechnungsweg === 'string' && /aus Transkript/i.test(p.berechnungsweg))
    .filter(p => {
      const ding = gezaehltesDing(p.berechnungsweg)
      const teile = zahlenImRechenweg(p.berechnungsweg)
      if (teile.length > 1 && teile.every(z => stehtImText(z, transkript))) return false
      if (!ding) return !stehtImText(p.menge, transkript)
      return !stehtNebenDing(p.menge, ding, transkript)
    })
    .map(p => ({ beschreibung: p.beschreibung, menge: p.menge, weg: p.berechnungsweg }))
}

// ─────────────────────────────────────────────────────────────────────────────
// Die Diktate. Jedes trifft mindestens eine der Stellen, die „aus Transkript"
// schreiben. Alle Zahlen als ZIFFERN — so liefert die Spracherkennung sie
// (K.2, 15.09.).
// ─────────────────────────────────────────────────────────────────────────────
const FAELLE: Array<{ id: string; gewerk: 'maler' | 'boden_parkett'; text: string; raeume: unknown[] }> = [
  {
    id: 'H-01 Heizkörper und Türen, beide genannt',
    gewerk: 'maler',
    text: 'Wohnzimmer, 5 mal 4, Höhe 2,50. Wände zweimal streichen. Die 2 Heizkörper abschleifen und lackieren. 3 Türen lackieren.',
    raeume: [raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.5, tueren: [{ anzahl: 3, breite: 0.9, hoehe: 2.1, annahme: false }], fenster: [], arbeiten: ['waende_streichen', 'heizkoerper lackieren', 'tueren lackieren'] })],
  },
  {
    id: 'H-02 Schimmel mit Fläche',
    gewerk: 'maler',
    text: 'Keller, 4 mal 3, Höhe 2,20. Wände einmal streichen. An der Nordwand 6 m² Schimmel, der muss behandelt werden.',
    raeume: [raum('Keller', { laenge: 4, breite: 3, hoehe: 2.2, arbeiten: ['waende_streichen'] })],
  },
  {
    id: 'H-03 Leuchten und Spots, zwei Zahlen',
    gewerk: 'maler',
    text: 'Büro, 5 mal 5, Höhe 3. Decke zweimal streichen. 3 Spots und 2 Leuchten abkleben.',
    raeume: [raum('Büro', { laenge: 5, breite: 5, hoehe: 3, arbeiten: ['decke_streichen'] })],
  },
  {
    id: 'H-04 Sockelleisten mit Meterangabe',
    gewerk: 'boden_parkett',
    text: 'Flur, 6 mal 2, Höhe 2,50. Laminat schwimmend verlegen. 16 Meter Sockelleisten montieren.',
    raeume: [raum('Flur', { laenge: 6, breite: 2, hoehe: 2.5, sockelleisten: true, belag: 'Laminat', arbeiten: ['bodenbelag verlegen'] })],
  },
  {
    id: 'H-05 Gegenprobe PM-132: Stückzahl an einem anderen Bauteil',
    gewerk: 'maler',
    text: 'Wohnzimmer, 5 mal 4, Höhe 2,50. Türen lackieren. Wir liefern 50 Stück Fliesen dazu.',
    raeume: [raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.5, arbeiten: ['tueren lackieren'] })],
  },
  {
    id: 'H-06 Gegenprobe PM-133: Ordnungszahl am Bauteil',
    gewerk: 'maler',
    text: 'Wohnzimmer, 5 mal 4, Höhe 2,50. Fenster 3 ist kaputt, die Fenster bitte lackieren.',
    raeume: [raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.5, arbeiten: ['fenster lackieren'] })],
  },
  {
    id: 'H-07 Graffiti mit Fläche',
    gewerk: 'maler',
    text: 'Fassade Süd, 12 mal 6. Fassade streichen. Unten sind 8 m² Graffiti, die müssen weg.',
    raeume: [raum('Fassade', { laenge: 12, breite: 6, hoehe: 6, arbeiten: ['fassade streichen'] })],
  },
  {
    id: 'H-09 Gegenprobe PM-131: derselbe Raumsatz ohne Komma',
    gewerk: 'maler',
    text: 'Wohnzimmer 5 mal 4 Höhe 2,50. Wände zweimal streichen. Türen lackieren.',
    raeume: [raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.5, arbeiten: ['waende_streichen', 'tueren lackieren'] })],
  },
  {
    id: 'H-08 Türrahmen, Zahl genannt',
    gewerk: 'maler',
    text: 'Flur, 4 mal 1,50, Höhe 2,50. 4 Türrahmen schleifen.',
    raeume: [raum('Flur', { laenge: 4, breite: 1.5, hoehe: 2.5, arbeiten: ['tueren lackieren'] })],
  },
]

describe('Herkunftsprüfung — „aus Transkript" muss wahr sein', () => {
  // Erst die Messung selbst: sie darf nicht an einem leeren Lauf vorbeigehen.
  it('die Diktate erzeugen überhaupt Zeilen mit dieser Kennzeichnung', () => {
    const mitKennzeichnung = FAELLE.flatMap(f => lauf(f.gewerk, f.text, f.raeume as never[]))
      .filter(p => typeof p.berechnungsweg === 'string' && /aus Transkript/i.test(p.berechnungsweg))
    expect(mitKennzeichnung.length).toBeGreaterThan(0)
  })

  // Alle Diktate, auch die drei Gegenproben zu PM-131/132/133: keine Zeile
  // darf „aus Transkript" sagen und eine Menge tragen, die im Transkript
  // nicht neben ihrem Ding steht.
  for (const f of FAELLE) {
    it(`${f.id}: jede „aus Transkript"-Menge steht auch im Transkript`, () => {
      expect(unbelegt(f.text, lauf(f.gewerk, f.text, f.raeume as never[]))).toEqual([])
    })
  }

  // Die Messung muss den Fehler auch sehen können, sonst misst sie nichts.
  // Gegenprobe an einem gestellten Rechenweg: 50 im Text, aber an den Fliesen.
  it('die Prüfung schlägt an, wenn die Zahl am falschen Ding steht', () => {
    const text = 'Wohnzimmer, 5 mal 4, Höhe 2,50. Türen lackieren. Wir liefern 50 Stück Fliesen dazu.'
    const gestellt = [{ beschreibung: 'Türen lackieren', menge: 50, einheit: 'Stück', berechnungsweg: '50 Tür(en) aus Transkript' }]
    expect(unbelegt(text, gestellt)).toHaveLength(1)
  })

  // Und sie darf nicht bei jeder Zeile anschlagen.
  it('die Prüfung schlägt nicht an, wenn die Zahl am richtigen Ding steht', () => {
    const text = 'Wohnzimmer, 5 mal 4, Höhe 2,50. Die 3 Türen lackieren.'
    const gestellt = [{ beschreibung: 'Türen lackieren', menge: 3, einheit: 'Stück', berechnungsweg: '3 Tür(en) aus Transkript' }]
    expect(unbelegt(text, gestellt)).toEqual([])
  })
})
