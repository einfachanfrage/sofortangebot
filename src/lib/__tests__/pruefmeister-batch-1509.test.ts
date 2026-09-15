// Fallbasis Richtung 100 — Batch vom 15.09.2026
//
// Zwei Themen aus dem Themenspeicher, die dort seit dem 10.09. als „offen"
// stehen und beide ohne die laufende App prüfbar sind:
//
//   F · „Türen, Zargen, Fenster lackieren (Katalog + Felder da, kein
//        Testfall)"                                        → PM-045
//   B · „Nikotin-/Rußbelastung, Sperrgrund nötig"          → PM-046
//
// Aufbau wie in `pruefmeister-nachtest-0709.test.ts`: über die Pipeline
// (verarbeiteExtraktion → berechneMengen → Vollständigkeit → Aufnahme-
// Hinweise), nicht über handgebaute Räume. Der KI-Schritt davor bleibt
// ungeprüft; die Raumdaten stehen so, wie die Extraktion sie bei korrekter
// Arbeit liefern muss.
//
// Prüfmeister · 15.09.2026
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { ergaenzeAusAufnahmeHinweisen, normalisiereBodenPositionenAusAufnahme } from '../mengen/aufnahme-hinweise'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'

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
    fensterAnzahl: zaehleFenster(transkript) || undefined,
    tuerenAnzahl: zaehleTueren(transkript) || undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeume: r2.map((r: any) => ({ name: r.name, hoehe: r.hoehe ?? null })),
  }
  const ergebnis = pruefeUndErgaenzeVollstaendigkeit(
    gewerk, eng.positionen, transkript, meta as never, signale as never,
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chips: string[] = r2.flatMap((r: any) =>
    (r.arbeiten ?? []).map((a: string) => `${a}${r.name ? ` — ${r.name}` : ''}`),
  )
  return normalisiereBodenPositionenAusAufnahme(
    ergaenzeAusAufnahmeHinweisen(ergebnis.positionen, chips, transkript), transkript,
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], muster: RegExp) => pos.find(p => muster.test(p.beschreibung))

// ══════════════════════════════════════════════════════════════════════════
// PM-045 — Vier Innentüren mit Zargen, dazu Fenster innen
// ══════════════════════════════════════════════════════════════════════════
//
// Diktat: *„Im Flur die vier Innentüren mit Zargen lackieren, beidseitig,
// weiß. Die Türen sind alt, die müssen vorher angeschliffen und grundiert
// werden. Wände machen wir nicht."*
//
// Der Katalog kann das seit PD-010 vollständig: Türblatt 90,00 · Zarge
// 45,00 · grundieren 25,00 · abschleifen 20,00 = 180,00 € je Tür. Vier
// Türen sind 720,00 €.

describe('PM-045 — Türen und Zargen lackieren', () => {
  const T = 'Im Flur die vier Innentüren mit Zargen lackieren, beidseitig, weiß. Die Türen sind alt, die müssen vorher angeschliffen und grundiert werden. Wände machen wir nicht.'
  const pos = () => lauf('maler', T, [
    raum('Flur', {
      laenge: 4, breite: 1.5, hoehe: 2.5,
      tueren: [{ anzahl: 4, breite: 0.9, hoehe: 2.1, annahme: false }],
      arbeiten: ['türen lackieren beidseitig'],
    }),
  ])

  it('die vier Zeilen je Tür entstehen überhaupt', () => {
    // Das kann die App — und zwar seit PD-010 sauber, auf die richtigen
    // Katalogzeilen. Nur die Menge stimmt nicht; siehe darunter.
    const p = pos()
    expect(finde(p, /Türen lackieren/), 'Türblatt').toBeTruthy()
    expect(finde(p, /Türzarge lackieren/), 'Zarge').toBeTruthy()
    expect(finde(p, /Türen grundieren/), 'grundieren').toBeTruthy()
    expect(finde(p, /Türen abschleifen/), 'abschleifen').toBeTruthy()
  })

  it.fails('🔴 PM-045-A · „vier Türen" sind vier Türen, nicht eine', () => {
    // **Der teuerste Fund dieses Batches.** Gemessen: Alle vier Zeilen
    // stehen mit Menge 1 im Angebot, obwohl im Diktat „die vier Innentüren"
    // steht UND der Raum vier Türen trägt.
    //
    //   Soll: 4 × 180,00 € = 720,00 €
    //   Ist:  1 × 180,00 € = 180,00 €      → 540,00 € fehlen
    //
    // Zwei Ursachen, unabhängig voneinander, jede allein reicht:
    //   1. `zaehleTueren` versteht nur Ziffern (PM-045-B unten).
    //   2. Auch mit `tueren: [{ anzahl: 4 }]` am Raum bleibt es bei 1 —
    //      die Lackierzeilen lesen die Stückzahl nicht aus dem Raum.
    //      Deshalb steht diese Prüfung getrennt von PM-045-B: Wer nur die
    //      Zahlwörter repariert, hat den Fehler nicht behoben.
    const p = pos()
    for (const muster of [/Türen lackieren/, /Türzarge lackieren/, /Türen grundieren/, /Türen abschleifen/]) {
      expect(finde(p, muster)?.menge, String(muster)).toBe(4)
    }
  })

  it.fails('🔴 PM-045-B · Stückzahlen als Zahlwort — so redet der Handwerker', () => {
    // Gemessen: „4 Türen" → 4 · „vier Türen" → 0 · „zwei Türen" → 0 ·
    // „drei Fenster" → 0. Ziffern versteht die Zählung, Zahlwörter nicht.
    // Kein Handwerker diktiert Ziffern.
    //
    // Im Themenspeicher steht „Zahlwörter, Dialekt" als abgedeckt (PM-034,
    // PM-035) — das gilt für die MASSE über `zahlen-parser.ts`. Die
    // STÜCKZAHLEN laufen über `zaehleTueren`/`zaehleFenster`, einen anderen
    // Weg, und der war nie geprüft. Genau deshalb steht der Eintrag jetzt
    // getrennt.
    expect(zaehleTueren('vier Türen lackieren')).toBe(4)
    expect(zaehleTueren('die zwei Türen streichen')).toBe(2)
    expect(zaehleFenster('drei Fenster streichen')).toBe(3)
  })

  it.fails('🔴 PM-045-C · was nur für die Türen gesagt wurde, gilt nicht für die Fenster', () => {
    // Mit einem zweiten Raum („die zwei Fenster im Wohnzimmer von innen
    // streichen") entstehen zusätzlich `Fenster abschleifen` (20,00 €) und
    // `Fenster grundieren` (25,00 €) — beide mit Preis, beide automatisch
    // ergänzt. Gesagt war das Anschleifen und Grundieren für die TÜREN
    // („die Türen sind alt"), nicht für die Fenster.
    //
    // Das ist die Regel „Nichts erfinden" (Sandy, 12.09.), Satz 3: nicht
    // gesagt → keine bepreiste Zeile. Und es ist zugleich ein Fund zur
    // Reichweite: Eine Begründung, die an einem Bauteil hängt, wandert hier
    // auf ein anderes.
    const p = lauf('maler',
      'Im Flur die vier Innentüren lackieren, die sind alt, die müssen vorher angeschliffen und grundiert werden. Im Wohnzimmer die zwei Fenster von innen streichen.',
      [
        raum('Flur', { laenge: 4, breite: 1.5, hoehe: 2.5, tueren: [{ anzahl: 4, breite: 0.9, hoehe: 2.1, annahme: false }], arbeiten: ['türen lackieren beidseitig'] }),
        raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.5, fenster: [{ anzahl: 2, breite: 1.2, hoehe: 1.4, annahme: false }], arbeiten: ['fenster streichen innen'] }),
      ])
    expect(finde(p, /Fenster abschleifen/), 'Fenster abschleifen war nicht gesagt').toBeUndefined()
    expect(finde(p, /Fenster grundieren/), 'Fenster grundieren war nicht gesagt').toBeUndefined()
  })
})

// ══════════════════════════════════════════════════════════════════════════
// PM-046 — Verrauchte Wohnung, Sperrgrund
// ══════════════════════════════════════════════════════════════════════════
//
// Diktat: *„Wohnzimmer viereinhalb mal drei achtzig, Höhe zwei fünfzig. Die
// Wohnung ist total verraucht, gelb an den Wänden. Da muss ein Sperrgrund
// drauf, sonst schlägt das durch. Wände und Decke zweimal streichen."*
//
// Raum: 4,50 × 3,80 × 2,50 → Wandfläche 41,50 m² (nach Abzug),
// Decken-/Bodenfläche 17,10 m². Isoliergrund 9,00 €/m², Tiefengrund
// 4,50 €/m².

describe('PM-046 — Nikotin und Sperrgrund', () => {
  const T = 'Wohnzimmer viereinhalb mal drei achtzig, Höhe zwei fünfzig. Die Wohnung ist total verraucht, gelb an den Wänden. Da muss ein Sperrgrund drauf, sonst schlägt das durch. Wände und Decke zweimal streichen.'
  const pos = () => lauf('maler', T, [
    raum('Wohnzimmer', {
      laenge: 4.5, breite: 3.8, hoehe: 2.5,
      tueren: [{ anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }],
      fenster: [{ anzahl: 1, breite: 1.2, hoehe: 1.0, annahme: true }],
      arbeiten: ['wände streichen 2x', 'decke streichen 2x', 'sperrgrund'],
    }),
  ])

  it('der Sperrgrund wird erkannt und trifft die richtige Katalogzeile', () => {
    // Das kann die App: „Sperrgrund" im Diktat erzeugt
    // `Isoliergrund gegen Nikotin / Ruß / Wasserflecken`. Der Titel ist
    // richtig, die Fläche nicht — siehe darunter.
    expect(finde(pos(), /Isoliergrund/)).toBeTruthy()
  })

  it.fails('🔴 PM-046-A · der Sperrgrund liegt auf der Wand, nicht auf dem Boden', () => {
    // Gemessen: 17,10 m² — das ist die Decken-/Bodenfläche. Gelb sind die
    // WÄNDE, 41,50 m².
    //
    //   Soll: 41,50 × 9,00 = 373,50 €
    //   Ist:  17,10 × 9,00 = 153,90 €      → 219,60 € fehlen
    //
    // Und fachlich schlimmer als die Zahl: Wer den Sperrgrund nur auf einem
    // Drittel der Fläche anbietet, streicht den Rest ohne Sperre. Nikotin
    // schlägt durch, spätestens nach ein paar Wochen, und der Handwerker
    // steht in der Gewährleistung.
    const p = pos()
    const wand = finde(p, /Wand streichen/)!
    expect(finde(p, /Isoliergrund/)!.menge).toBeCloseTo(wand.menge, 1)
  })

  it.fails('🔴 PM-046-B · Isoliergrund und Tiefengrund stehen nicht beide auf derselben Fläche', () => {
    // Gemessen: beide mit 17,10 m², beide automatisch ergänzt. Ein
    // Isoliergrund ERSETZT den Tiefengrund, er kommt nicht dazu — und
    // Tiefengrund über einer Sperrschicht hebt die Sperre auf. Das ist
    // 76,95 € zu viel im Angebot und eine Arbeit, die schadet.
    const p = pos()
    const iso = finde(p, /Isoliergrund/)
    const tief = finde(p, /Grundieren \(Tiefengrund\)|Voranstrich/)
    expect(iso && tief && Math.abs(iso.menge - tief.menge) < 0.5,
      'Isoliergrund und Tiefengrund auf derselben Fläche').toBe(false)
  })

  it.fails('🔴 PM-046-C · was ausdrücklich gesagt wurde, ist kein Vorschlag', () => {
    // Gemessen: `Decke streichen 2x` trägt `automatisch_ergaenzt`, obwohl im
    // Diktat wörtlich „Wände und Decke zweimal streichen" steht. Die
    // Wand-Zeile trägt die Marke nicht, die Decken-Zeile schon.
    //
    // Heute ist das nur eine Marke. Mit der Regel „Nichts erfinden" (Sandy,
    // 12.09., Satz 3) wird sie tragend: Eine so markierte Position soll
    // künftig OHNE Menge und Preis kommen und angetippt werden müssen. Dann
    // fällt die ausdrücklich bestellte Decke aus dem Angebot, wenn der
    // Handwerker nicht tippt — und das wäre schlimmer als der heutige Stand.
    //
    // Deshalb gehört diese Zeile VOR den Umbau der Regel, nicht danach.
    const decke = finde(pos(), /Decke streichen/)
    expect(decke, 'Deckenposition').toBeTruthy()
    expect(decke!.automatisch_ergaenzt ?? false, 'Decke war gesagt').toBe(false)
  })
})
