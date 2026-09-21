// ═══════════════════════════════════════════════════════════════════════════
// CoS-E-083 Platz 5 · PM-105 — „an jeder Tür eine Übergangsschiene" ist eine
// Zahl PRO Tür, keine Gesamtzahl
// ═══════════════════════════════════════════════════════════════════════════
//
// Sandys Fall 5 (Live-Lauf 17.09.): zwei Räume, je eine Tür, Diktat „An
// jeder Tür eine Übergangsschiene." — im Angebot steht Menge **1**. Die
// zweite Schiene wird eingebaut und nicht bezahlt: 15,00 € plus die Arbeit.
//
// Die Wurzel ist dieselbe wie bei PM-033, nur eine Sprechweise weiter.
// `pruefeUebergangsprofil` liest die Stückzahl aus dem Satz, in dem der
// Übergang vorkommt. Für „an den BEIDEN Türen … jeweils eine" gibt es seit
// PM-033 den Weg über das Zahlwort vor der Tür. „An JEDER Tür eine …" nennt
// die Zahl der Türen aber gar nicht — sie steht nur in der Aufnahme. Also
// gewann die Artikel-Regel („eine Übergangsschiene" = eine) und aus zwei
// Schienen wurde eine.
//
// Woher die Zahl jetzt kommt — und warum nicht aus der Türzahl:
// gemessen am Prüfstand liefert `zaehleTueren()` für dieses Diktat **0**
// (im Satz steht keine Türzahl), und `tuerenAusAufnahme` liefert ebenfalls
// **0**, weil die Türen der Aufnahme `annahme: true` tragen und Annahmen
// dort bewusst nicht zählen (CoS-E-058). Belastbar da ist allein die Zahl
// der Räume, die einen neuen Belag bekommen. Genau die wird benutzt.
//
// Bewusst NICHT die Summe aller Türen der Aufnahme: die zählt auch Türen in
// Räumen, die gar keinen neuen Boden bekommen — dann stünde eine Schiene
// auf dem Angebot, die niemand einbaut. Das ist die teurere Fehlrichtung
// (PM-106: 279,00 € ungefragt). Lieber eine Schiene zu wenig in einem Fall,
// den wir nicht messen können, als eine zu viel in einem, den wir messen.
//
// Bekannte Grenze, hier festgehalten statt verschwiegen: ein Raum mit ZWEI
// Durchgängen bekommt weiterhin eine Schiene. Die Aufnahme trägt dort eine
// angenommene Tür je Raum; die zweite ist aus dem Diktat nicht erkennbar.
//
// Zu jedem Fund steht eine Kontrolle daneben. Ohne Kontrolle ist ein Fund
// eine Behauptung.

import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { DEFAULT_PRICES } from '../default-prices'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ergaenzeAusAufnahmeHinweisen, normalisiereBodenPositionenAusAufnahme } from '../mengen/aufnahme-hinweise'
import { ersetzeZahlenWorte } from '../zahlen-parser'

const TUER = { anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

const bodenRaum = (name: string, laenge: number, breite: number) =>
  raum(name, {
    laenge, breite, belag: 'laminat', verlegerichtung: 'standard', sockelleisten: true,
    tueren: [TUER], arbeiten: ['laminat verlegen', 'trittschall', 'sockelleisten montieren'],
  })

// Derselbe Weg wie in `pruefmeister-batch-47-56.test.ts` — über die Pipeline,
// nicht direkt in die Engine, sonst fehlen die Aufnahme-Stufen.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function lauf(transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk: 'boden_parkett', raeume, transkript } } as never)
  const text = ersetzeZahlenWorte(transkript)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen('boden_parkett', extraktion)
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
  const ergebnis = pruefeUndErgaenzeVollstaendigkeit('boden_parkett', eng.positionen, text, meta as never, signale as never)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chips: string[] = r2.flatMap((r: any) =>
    (r.arbeiten ?? []).map((a: string) => `${a}${r.name ? ` — ${r.name}` : ''}`),
  )
  return normalisiereBodenPositionenAusAufnahme(
    ergaenzeAusAufnahmeHinweisen(ergebnis.positionen, chips, text),
    text,
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const schiene = (pos: any[]) => pos.find(p => /überg[aä]ngs(?:schiene|profil)/i.test(p.beschreibung))

const ZWEI_RAEUME = () => [bodenRaum('Kinderzimmer', 4, 3.5), bodenRaum('Arbeitszimmer', 3, 3)]
const EIN_RAUM = () => [bodenRaum('Kinderzimmer', 4, 3.5)]

const VORLAUF = 'In beiden Laminat, gerade verlegt, Trittschalldämmung drunter. Sockelleisten neu, weiße MDF.'
const T_JEDE_TUER = `Kinderzimmer 4 mal 3,50 und Arbeitszimmer 3 mal 3. ${VORLAUF} An jeder Tür eine Übergangsschiene.`

describe('CoS-E-083 Platz 5 · PM-105 — eine Schiene je Tür', () => {

  it('E-088-1 · PM-105: zwei Räume, „an jeder Tür" → zwei Übergangsschienen', () => {
    const p = schiene(lauf(T_JEDE_TUER, ZWEI_RAEUME()))
    expect(p).toBeDefined()
    // Vor dem Bau: 1. Die zweite Schiene wurde eingebaut und nicht bezahlt.
    expect(p!.menge).toBe(2)
    expect(p!.einheit).toBe('Stück')
  })

  it('E-088-2 · der Geldweg: 15,00 €/Stück — aus dem Katalog gelesen, nicht behauptet', () => {
    const katalogPreis = DEFAULT_PRICES
      .find(k => k.title === 'Übergangsschiene' && k.unit === 'Stück')?.unit_price
    expect(katalogPreis).toBe(15)
    const p = schiene(lauf(T_JEDE_TUER, ZWEI_RAEUME()))
    // 2 × 15,00 € = 30,00 € statt 15,00 € — 15,00 € plus die Arbeit, die
    // der Betrieb bisher verschenkt hat.
    expect(p!.menge * katalogPreis!).toBe(30)
  })

  it('E-088-3 · Kontrolle: ein Raum bleibt bei einer Schiene', () => {
    const t = `Kinderzimmer 4 mal 3,50. Laminat, gerade verlegt, Trittschalldämmung drunter. Sockelleisten neu, weiße MDF. An jeder Tür eine Übergangsschiene.`
    expect(schiene(lauf(t, EIN_RAUM()))!.menge).toBe(1)
  })

  it('E-088-4 · Kontrolle (PM-032): ohne „jede" bleibt eine Schiene eine Schiene', () => {
    const t = `Kinderzimmer 4 mal 3,50 und Arbeitszimmer 3 mal 3. ${VORLAUF} Dazu eine Übergangsschiene.`
    expect(schiene(lauf(t, ZWEI_RAEUME()))!.menge).toBe(1)
  })

  it('E-088-5 · Kontrolle (PM-009): das Raummaß wird nicht zur Stückzahl', () => {
    const t = `Kinderzimmer 4 mal 3,50 und Arbeitszimmer 3 mal 3. ${VORLAUF} Dazu noch ne Übergangsschiene.`
    expect(schiene(lauf(t, ZWEI_RAEUME()))!.menge).toBe(1)
  })

  it('E-088-6 · Kontrolle (PM-033): „an den beiden Türen jeweils eine" bleibt bei zwei', () => {
    const t = `Kinderzimmer 4 mal 3,50 und Arbeitszimmer 3 mal 3. ${VORLAUF} An den beiden Türen zum Kinderzimmer und zum Arbeitszimmer jeweils eine Übergangsschiene.`
    expect(schiene(lauf(t, ZWEI_RAEUME()))!.menge).toBe(2)
  })

  it('E-088-7 · Kontrolle: eine ausdrücklich genannte Stückzahl schlägt die Raumzahl', () => {
    // Steht eine echte Zahl im Satz, gewinnt sie — auch wenn sie nicht zur
    // Raumzahl passt. Multipliziert wird nie.
    const t = `Kinderzimmer 4 mal 3,50 und Arbeitszimmer 3 mal 3. ${VORLAUF} Dazu 3 Übergangsschienen.`
    expect(schiene(lauf(t, ZWEI_RAEUME()))!.menge).toBe(3)
  })

  it('E-088-8 · Kontrolle: die Wortwahl des Handwerkers bleibt stehen („Schiene", nicht „Profil")', () => {
    expect(schiene(lauf(T_JEDE_TUER, ZWEI_RAEUME()))!.beschreibung).toBe('Übergangsschiene')
  })

  it('E-088-9 · der Rechenweg nennt den Grund, nicht nur die Zahl', () => {
    // Auf dem Kundenpapier muss nachvollziehbar sein, woher die 2 kommt.
    expect(schiene(lauf(T_JEDE_TUER, ZWEI_RAEUME()))!.berechnungsweg)
      .toBe('2 Stück — je Tür eine, 2 Räume mit neuem Belag')
  })

  it('E-088-10 · Kontrolle: der Rest des Auftrags bleibt raumweise getrennt', () => {
    const p = lauf(T_JEDE_TUER, ZWEI_RAEUME())
    expect(p.filter(x => /laminat verlegen/i.test(x.beschreibung))).toHaveLength(2)
    expect(p.filter(x => /sockelleisten montieren/i.test(x.beschreibung))).toHaveLength(2)
  })
})
