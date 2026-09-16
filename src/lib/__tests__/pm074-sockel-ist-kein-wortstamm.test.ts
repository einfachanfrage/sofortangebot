// PM-074 / PM-104 (Zug 3) — „Sockel" ist ein Wort, kein Wortstamm
//
// Gemessen vor dem Bauen (Prüfmeister PM-074, PM-104-A/B, hier nachgemessen):
//   „In der Ecke steht ein Kaminsockel, ein mal ein Meter, da muss
//    ausgespart werden."               → Sockelleisten montieren, 1,00 lfdm
//   „Der Sockelputz außen ist drei Meter lang."   → 3,00 lfdm, 16,50 €
//
// Auslöser ist `extrahiereLfdm(lower, 'sockel')` in `boden-vorarbeiten.ts`:
// der Wortstamm steckt in jeder Zusammensetzung. Dieselbe Form wie
// „Sperrmüll"/„absperren" in PM-064, dieselbe Reparatur — Wortgrenze statt
// Wortstamm (`SOCKEL_ALLEIN`).
//
// Jede Bremse steht hier mit ihrer Gegenprobe: zu jedem Fall, der nichts mehr
// erzeugen darf, ein Satz, der weiterhin eine Sockelleiste bestellt. Ohne
// Gegenprobe wäre „erzeugt nichts mehr" auch mit einer kaputten Funktion wahr.
//
// Head of Product Engineering · 2026-09-16
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ersetzeZahlenWorte } from '../zahlen-parser'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function laufVoll(gewerk: 'maler' | 'boden_parkett', transkript: string, raeume: any[]) {
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
  return pruefeUndErgaenzeVollstaendigkeit(gewerk, eng.positionen, text, meta as never, signale as never)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lauf = (g: 'maler' | 'boden_parkett', t: string, r: any[]) => laufVoll(g, t, r).positionen
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const finde = (pos: any[], m: RegExp) => pos.find(p => m.test(p.beschreibung))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const titel = (pos: any[]) => pos.map(p => p.beschreibung)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const menge = (pos: any[], m: RegExp) => finde(pos, m)?.menge

const WZ = () => [raum('Wohnzimmer', { laenge: 5, breite: 4, belag: 'Laminat', arbeiten: ['laminat verlegen'] })]
const WZ104 = () => [raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: [], belag: 'laminat' })]

const NACKT_74 = 'Wohnzimmer fünf mal vier, Laminat schwimmend.'
const PM074 = 'Wohnzimmer fünf mal vier, Laminat schwimmend. In der Ecke steht ein Kaminsockel, ein mal ein Meter, da muss ausgespart werden.'
const NACKT_104 = 'Wohnzimmer vier mal fünf. Laminat verlegen.'
const PUTZ = 'Wohnzimmer vier mal fünf. Laminat verlegen. Der Sockelputz außen ist drei Meter lang.'
const KAMIN_FOLGESATZ = 'Wohnzimmer vier mal fünf. Laminat verlegen. In der Ecke steht ein Kaminsockel. Der ist ein mal ein Meter, da muss ausgespart werden.'

describe('PM-074 / PM-104 — die Zusammensetzung bestellt keine Sockelleiste', () => {
  it('PM-074 · „Kaminsockel, ein mal ein Meter" erzeugt keine Sockelleistenzeile', () => {
    expect(finde(lauf('boden_parkett', PM074, WZ()), /Sockelleisten/i)).toBeUndefined()
  })

  it('PM-074 · Gegenprobe: das Angebot ist Zeile für Zeile dasselbe wie ohne den Kaminsatz', () => {
    expect(titel(lauf('boden_parkett', PM074, WZ()))).toEqual(titel(lauf('boden_parkett', NACKT_74, WZ())))
  })

  it('PM-104-A · „Sockelputz außen" erzeugt keine Innen-Sockelleiste', () => {
    expect(finde(lauf('boden_parkett', PUTZ, WZ104()), /Sockelleisten montieren/i)).toBeUndefined()
  })

  it('PM-104-B · der Kaminsockel im FOLGESATZ erzeugt keine Sockelleiste', () => {
    expect(finde(lauf('boden_parkett', KAMIN_FOLGESATZ, WZ104()), /Sockelleisten montieren/i)).toBeUndefined()
  })

  it('PM-104 · Gegenprobe: beide Sätze lassen das übrige Angebot unberührt', () => {
    const ohne = titel(lauf('boden_parkett', NACKT_104, WZ104()))
    expect(titel(lauf('boden_parkett', PUTZ, WZ104()))).toEqual(ohne)
    expect(titel(lauf('boden_parkett', KAMIN_FOLGESATZ, WZ104()))).toEqual(ohne)
  })

  it('keine stille Verschiebung in die Fehlt-Liste — der Satz bestellt nichts, also fehlt auch nichts', () => {
    for (const t of [PM074, PUTZ, KAMIN_FOLGESATZ]) {
      const raeume = t === PM074 ? WZ() : WZ104()
      expect(laufVoll('boden_parkett', t, raeume).fehlende.filter(f => /sockel/i.test(f))).toEqual([])
    }
  })
})

describe('PM-074 / PM-104 — die Gegenprobe: bestellte Sockelleisten bleiben unberührt', () => {
  it('wirklich bestellte Sockelleisten kommen weiter mit dem Raumumfang, 18 lfdm', () => {
    const p = lauf('boden_parkett', 'Wohnzimmer fünf mal vier, Laminat schwimmend, Sockelleisten neu.',
      [raum('Wohnzimmer', { laenge: 5, breite: 4, belag: 'Laminat', sockelleisten: true, arbeiten: ['laminat verlegen', 'sockelleisten montieren'] })])
    expect(menge(p, /Sockelleisten montieren/i)).toBe(18)
  })

  it('die genannte Meterzahl schlägt weiterhin den geschätzten Umfang', () => {
    const p = lauf('boden_parkett', 'Wohnzimmer fünf mal vier, Laminat schwimmend. Sockelleisten zweiundzwanzig laufende Meter neu.',
      [raum('Wohnzimmer', { laenge: 5, breite: 4, belag: 'Laminat', sockelleisten: true, arbeiten: ['laminat verlegen', 'sockelleisten montieren'] })])
    expect(menge(p, /Sockelleisten montieren/i)).toBe(22)
  })

  it('„Sockel" ALLEIN bleibt die gültige Kurzform — 12 lfdm werden weiter gelesen', () => {
    const p = lauf('boden_parkett', 'Wohnzimmer fünf mal vier, Laminat schwimmend. Die Sockel, zwölf Meter, kommen neu.',
      [raum('Wohnzimmer', { laenge: 5, breite: 4, belag: 'Laminat', sockelleisten: true, arbeiten: ['laminat verlegen', 'sockelleisten montieren'] })])
    expect(menge(p, /Sockelleisten montieren/i)).toBe(12)
  })
})
