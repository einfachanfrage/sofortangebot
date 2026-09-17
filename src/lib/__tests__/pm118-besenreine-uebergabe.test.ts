// PM-118 — die EINMALIGE besenreine Übergabe bleibt ein Fehlt-Eintrag
// (Prüfmeister, 17.09.2026)
//
// ── Die Frage, die Engineering gestellt hat ───────────────────────────────
//
// „Am letzten Tag wird besenrein übergeben." Dafür gibt es eine Katalogzeile
// im aktiven Malergewerk, und sie ist eine Pauschale, braucht also gar keine
// Menge:
//
//   Maler – Reinigung & Entsorgung · Baustelle kehren / saugen nach Arbeit
//   · 40,00 € Pauschale
//
// Soll daraus eine bepreiste Position werden — oder bleibt es ein
// Fehlt-Eintrag? Engineering hat es ausdrücklich nicht selbst entschieden,
// weil es keine Messfrage ist, sondern eine Kalkulationsfrage.
//
// ── Die Entscheidung: NEIN. Fehlt-Eintrag. ────────────────────────────────
//
// Drei Gründe, in der Reihenfolge ihres Gewichts:
//
// 1. ES WÄRE EINE DOPPELBERECHNUNG. „Besenrein übergeben" ist das Räumen der
//    eigenen Baustelle. DIN 18299:2019-09, Abschnitt 4.1.1, führt „Einrichten
//    und Räumen der Baustelle einschließlich der Geräte und dergleichen" als
//    NEBENLEISTUNG — sie gehört nach § 2 Abs. 1 VOB/B auch ohne Erwähnung im
//    Vertrag zur vertraglichen Leistung und steckt im Einheitspreis. Wer sie
//    zusätzlich in Rechnung stellt, berechnet zweimal dasselbe, und der Kunde
//    sieht es erst auf der Rechnung. Das ist derselbe Befund wie LR-10
//    („Boden abdecken" und „Möbel abdecken" als eigene Positionen), nur
//    teurer: dort rund 24 € je Auftrag, hier 40,00 € in einer Zeile.
//
//    Die Norm verbietet die eigene Position nicht — 0.4.1 sieht sie
//    ausdrücklich vor, wenn die Kosten für die Preisbildung erheblich sind.
//    Aber sie verlangt, dass der Betrieb sie WILL. Automatisch erzeugt heißt:
//    er hat sie nicht gewollt, sondern bekommen.
//
// 2. DER SATZ IST EINE ZUSAGE, KEINE BESTELLUNG. „Am letzten Tag wird
//    besenrein übergeben" sagt der Betrieb dem Kunden zu. Daraus eine
//    bepreiste Position zu machen, dreht die Richtung um: Der Kunde zahlt für
//    ein Versprechen, das ihm gegeben wurde. Die Regel „Nichts erfinden"
//    greift hier auf der Seite, auf der sie sonst nie greift.
//
// 3. ES WÄRE OHNEHIN DIE FALSCHE ZEILE. Die Katalogzeile heißt „Baustelle
//    kehren / saugen NACH ARBEIT" — das ist der einzelne Einsatz, nicht die
//    Übergabe am Ende. Die Zeile für das Ende heißt „Endreinigung Fenster /
//    Böden" und kostet 45,00 €/Stunde; sie ist eine andere Leistung (nass,
//    Fenster, Böden) und besenrein ist darin enthalten. Selbst ein „ja" hätte
//    also erst die Zeilenfrage klären müssen.
//
// ── Was das für den WIEDERKEHRENDEN Fall heißt: nichts ────────────────────
//
// Er bleibt, wie er ist. „Jeden Abend besenrein" ist fachlich etwas anderes:
// die bewohnte Wohnung abends benutzbar zurückzugeben geht über die eigenen
// Abfälle hinaus und ist eine Besondere Leistung. Dort fehlt wirklich nur die
// Menge — Anzahl Abende und Stunden je Abend —, und die steht in keinem
// Diktat. Der Wortlaut dieses Eintrags ist deshalb unverändert.
//
// ── Engineerings zwei Nachfragen, beantwortet für den Fall, dass ein
//    Betrieb die Zeile von Hand doch will ─────────────────────────────────
//
// (1) Steht im selben Diktat schon eine Endreinigung, SCHLIESSEN SIE
//     EINANDER AUS. Besenrein ist in der Endreinigung enthalten; beide
//     nebeneinander sind dieselbe Doppelberechnung eine Ebene höher.
// (2) PRO ANGEBOT EINMAL, nie pro Raum. Geräumt wird die Baustelle, nicht das
//     Zimmer — wer mit dem Besen durch vier Räume geht, fährt trotzdem nur
//     einmal ab.
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { DEFAULT_PRICES } from '../default-prices'
import { ersetzeZahlenWorte } from '../zahlen-parser'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

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
    belagText: null, altbelagEntfernen: false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    raeume: r2.map((r: any) => ({ name: r.name, arbeiten: r.arbeiten ?? [] })),
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meta = { raeume: r2.map((r: any) => ({ name: r.name, hoehe: r.hoehe ?? null })) }
  return pruefeUndErgaenzeVollstaendigkeit('maler', eng.positionen, text, meta as never, signale as never)
}

const WZ = () => [raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: ['wände streichen', 'decke streichen'] })]
const KOPF = 'Wohnzimmer vier mal fünf, Höhe zwo fünfzig, Wände und Decke streichen.'
const T_EINMALIG = `${KOPF} Am letzten Tag wird besenrein übergeben.`
const T_WIEDERKEHREND = `${KOPF} Die Wohnung ist bewohnt, jeden Abend muss besenrein gereinigt werden.`
const T_BEIDES = `${KOPF} Jeden Abend besenrein kehren, und am letzten Tag besenrein übergeben.`

const reinigungsPositionen = (p: { beschreibung: string }[]) =>
  p.filter(x => /reinig|besenrein|baustelle kehren|endreinigung/i.test(x.beschreibung))
const reinigungsEintrag = (f: string[]) => f.filter(x => /reinig|besenrein/i.test(x))

describe('PM-118 — die einmalige besenreine Übergabe', () => {
  it('PM-118-A · sie wird KEINE bepreiste Position — das ist die Entscheidung', () => {
    // Die tragende Zusicherung dieser Datei. Wer die 40,00-€-Pauschale
    // einbaut, macht diesen Test rot, und das ist der Zweck.
    expect(reinigungsPositionen(lauf(T_EINMALIG, WZ()).positionen)).toEqual([])
  })

  it('PM-118-B · sie verschwindet trotzdem nicht spurlos — genau ein Fehlt-Eintrag', () => {
    // Die Gegenrichtung von PM-118-A und der Grund, warum PM-090/PM-109
    // gebaut wurden: gesagt ist gesagt, es muss eine Spur geben.
    expect(reinigungsEintrag(lauf(T_EINMALIG, WZ()).fehlende)).toHaveLength(1)
  })

  it('PM-118-C · der Eintrag sagt dem Betrieb, dass sie enthalten ist — und fordert ihn nicht zum Bepreisen auf', () => {
    // Der alte Wortlaut lautete „Umfang festlegen — Pauschale je Einsatz oder
    // Stunden". Das war eine Aufforderung, Geld anzusetzen, für eine
    // Nebenleistung, die im Einheitspreis steckt. Der Wortlaut des
    // Fehlt-Eintrags gehört dem Prüfmeister (Engineering, 17.09.2026), also
    // ist er hier getauscht.
    const [eintrag] = reinigungsEintrag(lauf(T_EINMALIG, WZ()).fehlende)
    expect(eintrag).toMatch(/im Einheitspreis enthalten/i)
    expect(eintrag).toMatch(/18299/)
    expect(eintrag).not.toMatch(/Umfang festlegen/i)
  })

  it('PM-118-D · der wiederkehrende Fall bleibt unverändert und unterscheidbar', () => {
    // Zwei verschiedene Fragen an den Betrieb, also zwei verschiedene Sätze.
    // Hier fehlt wirklich die Menge.
    const [eintrag] = reinigungsEintrag(lauf(T_WIEDERKEHREND, WZ()).fehlende)
    expect(eintrag).toMatch(/Anzahl Abende und Stunden je Abend/i)
    expect(eintrag).not.toMatch(/18299/)
    expect(reinigungsPositionen(lauf(T_WIEDERKEHREND, WZ()).positionen)).toEqual([])
  })

  it('PM-118-E · stehen beide Sätze im selben Diktat, gewinnt der wiederkehrende — und es bleibt EIN Eintrag', () => {
    // Die schärfere Frage schluckt die mildere: wer jeden Abend kehrt, übergibt
    // am letzten Tag ohnehin besenrein. Zwei Einträge wären zweimal dieselbe
    // Rückfrage.
    const f = reinigungsEintrag(lauf(T_BEIDES, WZ()).fehlende)
    expect(f).toHaveLength(1)
    expect(f[0]).toMatch(/Anzahl Abende und Stunden je Abend/i)
  })

  it('PM-118-F Kontrolle · der Geldweg, um den es geht: 40,00 € je Angebot', () => {
    // Bleibt grün, egal wie der Fall künftig gebaut wird — sie prüft den
    // Katalog, nicht das Verhalten. Sie hält nur fest, worum es der Höhe nach
    // ging, und belegt Grund 3: die Zeile heißt „nach Arbeit", nicht
    // „Übergabe", und die Endreinigung ist eine andere, teurere Leistung.
    const kehren = DEFAULT_PRICES.find(p => p.category === 'Maler – Reinigung & Entsorgung'
      && p.title === 'Baustelle kehren / saugen nach Arbeit')!
    expect(kehren.unit).toBe('Pauschale')
    expect(kehren.unit_price).toBe(40)
    const end = DEFAULT_PRICES.find(p => p.title === 'Endreinigung Fenster / Böden')!
    expect(end.unit).toBe('Stunde')
    expect(end.unit_price).toBe(45)
  })
})
