// ═══════════════════════════════════════════════════════════════════════════
// CoS-E-090 — der Rechenweg mit englischem Dezimalpunkt. Gemessen: er steht
// NICHT auf dem Kundenpapier, sondern in der App des Handwerkers.
// ═══════════════════════════════════════════════════════════════════════════
//
// Der Auftrag lautete: die drei Engine-Zeilen in `mengen/gewerke/maler.ts`
// (Z. 771 Wand, Z. 823 Decke, Z. 535 Kniestock) plus `abzugsText()` über
// `zahlDe()` schicken, weil „es auf dem Papier steht, das der Kunde bekommt".
//
// Vor dem Bauen gemessen — und die Begründung trägt nicht:
//
//   Kundenpapier (PDF `pdf.tsx` Z. 327, Vorschau `AngebotVorschau.tsx`
//   Z. 106): der Rechenweg läuft seit DC-055 durch `mitDeutschenZahlen()`.
//   Dort steht längst „47,5 m²". Der Kunde hat den Punkt nie gesehen.
//
//   App des Handwerkers (`AngebotDetail.tsx`, zwei Renderstellen): dort stand
//   `{item.berechnungsweg}` roh — und daneben `{item.annahmen.join(' · ')}`
//   ebenfalls roh. DAS ist die Stelle mit dem Punkt.
//
// `zahlen-text.ts` sagt in seinem eigenen Kopf, warum die Ausgabe und nicht
// die Engine der richtige Ort ist: „An der Ausgabe angesetzt, ist er mit
// EINER Stelle für alle Gewerke erledigt — auch für die, die es noch nicht
// gibt." Ein zweiter Formatierer in der Engine hätte nur `maler.ts` erreicht;
// `boden.ts` und `fliesen.ts` wären in der App englisch geblieben.
//
// Deshalb gebaut: dieselbe Hilfe an den zwei Renderstellen der App, an denen
// sie fehlte. Die drei beauftragten Engine-Zeilen sind damit erledigt — sie
// stehen unten einzeln als Zusicherung, am krummen Prüfraum aus CoS-E-088
// gemessen, nicht behauptet.

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { mitDeutschenZahlen } from '../zahlen-text'
import { zuschlagBerechnungsweg } from '../zuschlag-basis'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ersetzeZahlenWorte } from '../zahlen-parser'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// Derselbe Weg wie in `cos-e-088-deutsche-zahl-rechenweg.test.ts` — über die
// Pipeline, nicht direkt in die Engine.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk: 'maler', raeume, transkript } } as never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen('maler', extraktion)
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
  return pruefeUndErgaenzeVollstaendigkeit('maler', eng.positionen, text, meta as never, signale as never).positionen
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const weg = (pos: any[], muster: RegExp) => pos.find(p => muster.test(p.beschreibung))?.berechnungsweg as string

// ── Der krumme Prüfraum aus CoS-E-088, um zwei große Öffnungen ergänzt ─────
//
//   Wohnzimmer 4,20 × 5,30 bei 2,50 m
//     Umfang      2 × (4,20 + 5,30)   = 19,00 lfm
//     Wandfläche  19,00 × 2,50        = 47,50 m²
//     Deckenfläche 4,20 × 5,30        = 22,26 m²
//
// Fenster 1,85 × 1,45 = 2,68 m² und Tür 1,35 × 2,135 = 2,88 m² liegen BEIDE
// über der VOB-Schwelle von 2,5 m² — nur so entsteht überhaupt ein
// `abzugsText()`, der vierte Teil des Auftrags.
const KRUMM = () => [raum('Wohnzimmer', {
  laenge: 4.2, breite: 5.3, hoehe: 2.5, sockelleisten: true,
  arbeiten: ['wände streichen', 'decke streichen'],
  tueren: [{ breite: 1.35, hoehe: 2.135 }],
  fenster: [{ breite: 1.85, hoehe: 1.45 }],
})]
const T_KRUMM =
  'Wohnzimmer 4,20 mal 5,30, Höhe 2,50, ein Fenster 1,85 mal 1,45, eine Tür 1,35 mal 2,135, Wände und Decke streichen, Sockelleisten abkleben.'

// Der Dachgeschoss-Prüfraum für die dritte Zeile (Kniestock, Z. 535).
const KRUMM_DG = () => [raum('Spitzboden', {
  laenge: 4.2, breite: 5.3, hoehe: 2.5, kniestockhoehe: 1.15, dachgeschoss: true,
  arbeiten: ['wände streichen', 'decke streichen'],
})]
const T_DG = 'Spitzboden im Dachgeschoss, 4,20 mal 5,30, Kniestock 1,15, Wände und Decke streichen.'

// Der runde Gegenfall: ohne ihn wäre der Fix ein Tausch eines
// Schönheitsfehlers gegen einen anderen.
const RUND = () => [raum('Wohnzimmer', {
  laenge: 4, breite: 5, hoehe: 3, arbeiten: ['wände streichen', 'decke streichen'],
})]
const T_RUND = 'Wohnzimmer vier mal fünf, Höhe drei Meter, Wände und Decke streichen.'

describe('CoS-E-090 — die drei Engine-Zeilen, wie der Handwerker sie in der App liest', () => {

  it('E-090-A · Z. 771 Wand (samt abzugsText): kein Punkt mehr', () => {
    const roh = weg(lauf(T_KRUMM, KRUMM()), /^Wand streichen/)
    // Gemessen vor dem Bau — so kam es aus der Engine und so stand es in der App:
    expect(roh).toBe('Umfang 19 lfm × 2.5 m = 47.5 m² − Fenster 2.68 m² − Türen 2.88 m² [1.35×2.135]')
    // Und so liest es der Handwerker jetzt. Die Maßliste in der Klammer
    // (`abzugsText`, Feld `masse`) kommt mit — sie war der vierte Teil des Auftrags.
    expect(mitDeutschenZahlen(roh))
      .toBe('Umfang 19 lfm × 2,5 m = 47,5 m² − Fenster 2,68 m² − Türen 2,88 m² [1,35×2,135]')
  })

  it('E-090-B · Z. 823 Decke: kein Punkt mehr', () => {
    const roh = weg(lauf(T_KRUMM, KRUMM()), /^Decke streichen/)
    expect(roh).toBe('Länge (4.2) × Breite (5.3)')
    expect(mitDeutschenZahlen(roh)).toBe('Länge (4,2) × Breite (5,3)')
  })

  it('E-090-C · Z. 535 Kniestock: kein Punkt mehr', () => {
    const roh = weg(lauf(T_DG, KRUMM_DG()), /^Kniestockwände streichen/)
    expect(roh).toBe('Umfang 19 lfm × 1.15 m = 21.85 m²')
    expect(mitDeutschenZahlen(roh)).toBe('Umfang 19 lfm × 1,15 m = 21,85 m²')
  })

  it('E-090-D · Kontrolle über den ganzen Prüfraum: nach der Ausgabe bleibt nirgends ein Dezimalpunkt', () => {
    const positionen = [...lauf(T_KRUMM, KRUMM()), ...lauf(T_DG, KRUMM_DG())]
    expect(positionen.length).toBeGreaterThan(4)
    for (const p of positionen) {
      // Ziffer, Punkt, Ziffer — genau die englische Schreibweise.
      expect(mitDeutschenZahlen(p.berechnungsweg)).not.toMatch(/\d\.\d/)
      for (const a of p.annahmen ?? []) expect(mitDeutschenZahlen(a)).not.toMatch(/\d\.\d/)
    }
  })

  it('E-090-E · Kontrolle: der runde Fall bekommt keine erfundene Null und kein erfundenes Komma', () => {
    const roh = weg(lauf(T_RUND, RUND()), /^Wand streichen/)
    expect(roh).toBe('Umfang 18 lfm × 3 m = 54 m²')
    expect(mitDeutschenZahlen(roh)).toBe('Umfang 18 lfm × 3 m = 54 m²')
  })

  it('E-090-F · Kontrolle: der Übermessungs-Hinweis aus dem annahmen-Feld kommt mit', () => {
    // Wortgleich aus `pm-landingpage-hero.test.ts` Z. 196 — eine bestehende,
    // grüne Zusicherung, die den englischen Punkt im annahmen-Feld belegt.
    expect(mitDeutschenZahlen('2 Öffnungen bis 2,5 m² Einzelgröße nicht abgezogen (3.09 m², VOB/C DIN 18363 Übermessung)'))
      .toBe('2 Öffnungen bis 2,5 m² Einzelgröße nicht abgezogen (3,09 m², VOB/C DIN 18363 Übermessung)')
  })

  it('E-090-G · Kontrolle: was die Hilfe NICHT anfassen darf', () => {
    // Der Zuschlags-Rechenweg (CoS-E-083 §3) bringt den Betrag bereits deutsch
    // mit und ohne Tausenderpunkt — er darf sich nicht verändern.
    const zw = zuschlagBerechnungsweg(20, 2301.14, null, 'maler')
    expect(zw).toBe('20 % auf 2301,14 € (Leistungen Maler)')
    expect(mitDeutschenZahlen(zw)).toBe(zw)
    // Ein Datum ist kein Dezimaltrenner.
    expect(mitDeutschenZahlen('Aufmaß vom 11.09.2026')).toBe('Aufmaß vom 11.09.2026')
  })
})

describe('CoS-E-090 — wo der Rechenweg gerendert wird', () => {
  const lies = (p: string) => readFileSync(join(process.cwd(), p), 'utf-8')

  it('E-090-H · die App des Handwerkers schickt Rechenweg UND Annahmen durch die Hilfe', () => {
    const src = lies('src/app/(app)/angebot/[id]/AngebotDetail.tsx')
    expect(src).toContain("from '@/lib/zahlen-text'")
    // Beide Renderstellen (flache Liste und nach Räumen gruppiert). Wer eine
    // vergisst, baut genau die Divergenz, vor der `vob-uebermessung.ts`
    // ausdrücklich warnt: „Karte zeigt etwas anderes als der Entwurf."
    expect(src.match(/mitDeutschenZahlen\(item\.berechnungsweg\)/g) ?? []).toHaveLength(2)
    expect(src.match(/annahmen!\.map\(mitDeutschenZahlen\)/g) ?? []).toHaveLength(2)
    // Und nirgends mehr roh.
    expect(src).not.toMatch(/\{item\.berechnungsweg \|\| 'Pauschale'\}/)
    expect(src).not.toMatch(/\{item\.annahmen!\.join/)
  })

  it('E-090-I · das Kundenpapier war nie die Baustelle — es tut das seit DC-055', () => {
    // Diese Zusicherung hält die Messung fest, die die Begründung des Auftrags
    // widerlegt hat. Wer sie eines Tages rot sieht, hat den Rechenweg am
    // Kundenpapier vorbeigeführt — dann ist DORT wieder ein Punkt.
    expect(lies('src/lib/pdf.tsx')).toMatch(/mitDeutschenZahlen\(zeile\)/)
    expect(lies('src/components/AngebotVorschau.tsx')).toMatch(/mitDeutschenZahlen\(rechenwegZeile\)/)
  })
})
