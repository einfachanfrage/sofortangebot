// Fallbasis — Batch PM-134 bis PM-137 (Prüfmeister, 21.09.2026, abends)
//
// Themenspeicher Punkt 11, wörtlich: „Die Verneinungsmaschine hat einen
// Umfang, und den kennt niemand. Ungemessen ist, WELCHEN TEXT die Maschine
// eigentlich als ‚Block' ansieht — Satz, Absatz, Raum oder Bauteilgruppe.
// Ohne diese Antwort ist jeder Fix an PM-101/PM-105/PM-125 geraten."
//
// Hier ist die Antwort, gemessen am Ausdruck (`bauteil-ausschluss.ts` und
// `satz-raum.ts`) und am Geldweg (volle Vollständigkeitsprüfung):
//
//   **Die Maschine hat DREI verschiedene Grenzen, nicht eine.**
//
//   | wofür | Einheit | wo im Code |
//   |---|---|---|
//   | Gegenprobe „steht für dasselbe Bauteil ein Auftrag?" | **Satz** | `saetze()` — Trenner `. ! ? ;` und Zeilenumbruch |
//   | Raumzuordnung des Ausschlusses | **Teilsatz** | `teilsaetze()` — Trenner Komma, Raum wird weitergetragen |
//   | Reichweite des Ausschlusses selbst | **der ganze Text** | keine Entfernung, keine Richtung |
//
// Aus dem Auseinanderfallen dieser drei Grenzen kommen die drei Fälle
// PM-134 bis PM-136. PM-137 hält die Grenzen selbst fest, damit ein Fix an
// PM-101/PM-105/PM-125 nicht wieder geraten werden muss.
//
// Fallbasis danach: 137 Fälle.
//
// Aufbau: zu jedem Fund steht eine Kontrolle daneben — derselbe Text ohne das
// fragliche Zeichen bzw. ohne den Ausschluss. Ohne Kontrolle ist ein Fund eine
// Behauptung. Das Soll steht je Fall als `it.fails`: schnappt die Sperrklinke
// zu, ist der Fall gebaut und die Prüfung gehört auf `it` zurück.
//
// Gemessen auf Sandys Rechner, nicht in der Ersatzumgebung.
//
// Prüfmeister · 21.09.2026
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { findePreisposition } from '../preis-matcher'
import { DEFAULT_PRICES } from '../default-prices'
import { preisKategoriePasstZuGewerk } from '../default-price-selection'
import { gewerkFuerPosition } from '@/lib/positions-gewerk'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ersetzeZahlenWorte } from '../zahlen-parser'
import { erkenneBauteilAusschluss } from '../bauteil-ausschluss'
import { saetze, teilsaetze } from '../satz-raum'

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function laufVoll(transkript: string, raeume: any[]) {
  const vor = verarbeiteExtraktion(transkript, { result: { gewerk: 'maler', raeume, transkript } } as never)
  const text = ersetzeZahlenWorte(transkript)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extraktion = vor.extraktion as any
  const eng = berechneMengen('maler', extraktion)
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
  const erg = pruefeUndErgaenzeVollstaendigkeit('maler', eng.positionen, text, meta as never, signale as never)
  return { positionen: erg.positionen, fehlende: erg.fehlende as string[] }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lauf = (t: string, r: any[]) => laufVoll(t, r).positionen
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const titel = (pos: any[]) => pos.map(p => p.beschreibung)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const hat = (pos: any[], m: RegExp) => titel(pos).some(t => m.test(t))
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function summe(pos: any[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const s = pos.reduce((acc: number, p: any) => {
    const g = gewerkFuerPosition(p.beschreibung, 'maler')
    const tr = findePreisposition(p.beschreibung, p.einheit, KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, g)))
    return acc + (tr ? tr.position.unit_price * (p.menge ?? 0) : 0)
  }, 0)
  return Number(s.toFixed(2))
}

// Flur 6,00 × 1,50 × 2,50 → Wand 37,50 m² (356,25 €) · Decke 9,00 m² (99,00 €)
const FLUR = () => [raum('Flur', { laenge: 6, breite: 1.5, hoehe: 2.5, arbeiten: ['wände streichen', 'decke streichen'] })]
// Flur wie oben, dazu Wohnzimmer 4,00 × 5,00 × 2,50 → Wand 45,00 m² (427,50 €)
const ZWEI = () => [
  raum('Flur', { laenge: 6, breite: 1.5, hoehe: 2.5, arbeiten: ['wände streichen'] }),
  raum('Wohnzimmer', { laenge: 4, breite: 5, hoehe: 2.5, arbeiten: ['wände streichen'] }),
]

// ───────────────────────────────────────────────────────────────────────────
// PM-134 · Der Ausschluss kennt keine Reihenfolge
//
// „An den Wänden machen wir nichts. Wände und Decke zweimal weiß."
// Der Handwerker sagt erst nichts, dann doch — die Selbstkorrektur mitten im
// Diktat, die jeder kennt. Die Maschine liest beide Sätze, ohne zu merken,
// welcher der spätere ist: der Ausschluss gewinnt, 356,25 € fallen weg.
//
// Gegenprobe im Code: Die Gegenprobe „steht ein Auftrag dafür?" wirkt nur
// INNERHALB desselben Satzes (`beauftragt.get(satzIndex)`). Ein Auftrag im
// NÄCHSTEN Satz zählt nicht — und ein Ausschluss im nächsten Satz genauso
// wenig, nur fällt es dort nicht auf, weil das Ergebnis zufällig stimmt.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-134 · der Ausschluss vor dem Auftrag', () => {
  const T_VORHER = 'Flur, 6 mal 1,50, 2,50 hoch. An den Wänden machen wir nichts. Wände und Decke zweimal weiß.'
  const T_NACHHER = 'Flur, 6 mal 1,50, 2,50 hoch. Wände und Decke zweimal weiß. An den Wänden machen wir nichts.'
  const T_OHNE = 'Flur, 6 mal 1,50, 2,50 hoch. Wände und Decke zweimal weiß.'

  it('PM-134-C · Kontrolle: ohne Ausschlusssatz steht die Wand da, 478,05 €', () => {
    const pos = lauf(T_OHNE, FLUR())
    expect(hat(pos, /^Wand streichen 2x/)).toBe(true)
    expect(summe(pos)).toBe(478.05)
  })

  it('PM-134 · gemessener Stand: vorher und nachher sind Zeile für Zeile gleich', () => {
    // Das ist der Fund. Die Reihenfolge der zwei Sätze ändert nichts —
    // 356,25 € fallen in beiden Fassungen weg.
    expect(titel(lauf(T_VORHER, FLUR()))).toEqual(titel(lauf(T_NACHHER, FLUR())))
    expect(summe(lauf(T_VORHER, FLUR()))).toBe(121.8)
    expect(summe(lauf(T_NACHHER, FLUR()))).toBe(121.8)
  })

  it('PM-134-B · der Wegfall ist nicht mehr stumm — seit DC-135 mit Beleg', () => {
    // Gemessen am 21.09. war er stumm: kein Fehlt-Eintrag, das Blatt sagte
    // nicht, warum die Wand fehlt — genau daran konnte Manfred den Fehler
    // nicht sehen. DC-135 (Antwort auf PD-024) reicht den Satz mit, auf den
    // sich die Bremse stützt. Der Wegfall selbst bleibt falsch: das ist
    // PM-134-A, und die Sperrklinke darunter steht unverändert.
    //
    // Diese Zusicherung ist damit von „so ist es" zu „so soll es bleiben"
    // geworden. Wer den Hinweis wieder entfernt, sieht es hier.
    const { fehlende } = laufVoll(T_VORHER, FLUR())
    const spur = fehlende.find(f => /wand|wänd/i.test(f))
    expect(spur, 'kein Fehlt-Eintrag zur Wand').toBeDefined()
    expect(spur!).toMatch(/^⚠/)
    expect(spur!).toMatch(/„Flur": Arbeiten an den Wänden sind nicht im Angebot/)
    // Der Beleg-Satz gehört dazu — ohne ihn kann der Betrieb nicht
    // beurteilen, ob die Bremse richtig gegriffen hat (DC-116/DC-128).
    expect(spur!).toMatch(/gesagt: „An den Wänden machen wir nichts"/)
  })

  it.fails('PM-134-A · SOLL: der spätere ausdrückliche Auftrag hebt den früheren Ausschluss auf', () => {
    // Soll-Lösung: Wer nach dem Ausschluss dasselbe Bauteil ausdrücklich
    // beauftragt, hat es sich anders überlegt. Der Auftrag ist das jüngere
    // Wort und gewinnt. (Der umgekehrte Fall — erst Auftrag, dann Ausschluss
    // — bleibt wie er ist: dort gewinnt ebenfalls das jüngere Wort.)
    expect(hat(lauf(T_VORHER, FLUR()), /^Wand streichen 2x/)).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-135 · Das Komma trennt die Räume — die Gegenprobe liest den ganzen Satz
//
// `satz-raum.ts` sagt es in seinem eigenen Kommentar: „Der Punkt trennt
// Gedanken, das Komma trennt im Diktat die Räume." Die Raumzuordnung hält
// sich daran, die Gegenprobe nicht: sie fragt je SATZ, ob für das Bauteil
// irgendwo ein Auftrag steht.
//
//   „Wände streichen, im Wohnzimmer an den Wänden nichts."
//
// Der erste Teilsatz beauftragt `wand` (im Flur), der zweite bestellt `wand`
// ab (im Wohnzimmer). Für die Gegenprobe ist beides derselbe Satz — also
// gilt „dafür steht ja ein Auftrag da" und der Ausschluss fällt ganz aus.
// Ergebnis: 465,90 € stehen auf dem Blatt, die abbestellt sind. Diesmal geht
// das Geld GEGEN DEN KUNDEN, nicht gegen den Betrieb.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-135 · Komma statt Punkt hebelte den Ausschluss aus — gebaut 21.09.', () => {
  const T_PUNKT = 'Flur, 6 mal 1,50, 2,50 hoch. Wände streichen. Wohnzimmer, 4 mal 5, 2,50 hoch. Wände streichen. Im Wohnzimmer machen wir an den Wänden nichts.'
  const T_KOMMA = 'Flur, 6 mal 1,50, 2,50 hoch. Wände streichen. Wohnzimmer, 4 mal 5, 2,50 hoch. Wände streichen, im Wohnzimmer an den Wänden nichts.'

  it('PM-135-C · Kontrolle: mit Punkt greift derselbe Ausschluss sauber', () => {
    const pos = lauf(T_PUNKT, ZWEI())
    expect(hat(pos, /^Wand streichen 2x — Wohnzimmer/)).toBe(false)
    expect(hat(pos, /^Wand streichen 2x — Flur/)).toBe(true)
    expect(summe(pos)).toBe(379.05)
  })

  it('PM-135 · Punkt und Komma ergeben jetzt dieselbe Summe — 379,05 €', () => {
    // Gemessener Stand bis zum 21.09., 18:30 UTC: 844,95 €. Der Ausschluss
    // fiel mit dem Komma GANZ aus, weil die Gegenprobe den ganzen Satz las
    // und den Auftrag im Teilsatz DAVOR mitzählte — 465,90 € Wandarbeit
    // standen auf dem Blatt, die abbestellt war. Seit CoS-E-091 (PM-135-A)
    // liest die Gegenprobe nur noch nach vorn.
    const pos = lauf(T_KOMMA, ZWEI())
    expect(hat(pos, /^Wand streichen 2x — Wohnzimmer/)).toBe(false)
    expect(hat(pos, /^Wand streichen 2x — Flur/)).toBe(true)
    expect(summe(pos)).toBe(379.05)
    // Ein Zeichen Unterschied im Diktat darf keinen Preisunterschied machen.
    expect(summe(pos)).toBe(summe(lauf(T_PUNKT, ZWEI())))
  })

  it('PM-135-D · am Ausdruck: die Maschine sieht den Ausschluss jetzt', () => {
    const a = erkenneBauteilAusschluss(
      'Flur Wände streichen, im Wohnzimmer an den Wänden nichts',
      ['Flur', 'Wohnzimmer'],
    )
    // Bis zum 21.09. stand hier dreimal „leer": kein Beleg, kein globaler,
    // kein räumlicher Ausschluss — die Bremse griff überhaupt nicht.
    expect(a.belege).toEqual(['im Wohnzimmer an den Wänden nichts'])
    expect(a.global.size).toBe(0)
    expect([...(a.jeRaum.get('Wohnzimmer') ?? [])]).toEqual(['wand'])
    // Und er bleibt, wo er hingehört: der Flur verliert nichts.
    expect(a.jeRaum.has('Flur')).toBe(false)
    // Die Raumzuordnung selbst konnte es immer schon: sie trennt am Komma.
    expect(teilsaetze('Flur Wände streichen, im Wohnzimmer an den Wänden nichts'))
      .toEqual(['Flur Wände streichen', 'im Wohnzimmer an den Wänden nichts'])
  })

  it('PM-135-A · GEBAUT: ein Auftrag VOR dem Ausschluss hebt ihn nicht mehr auf', () => {
    // ⚠ Der Titel dieser Zusicherung lautete bis zum 21.09. „die Gegenprobe
    // zählt nur Aufträge aus demselben Teilsatz-Raum". Engineering hat das
    // nachgemessen, statt es zu übernehmen: In T_KOMMA liegen BEIDE
    // Teilsätze des letzten Satzes im Wohnzimmer („Wände streichen" trägt
    // den Raum aus dem Satz davor weiter). Eine Raumgrenze hätte hier also
    // gar nichts getrennt. Die Naht ist die REIHENFOLGE, nicht der Raum —
    // das Soll darunter ist unverändert dasselbe geblieben.
    // Die Raumgrenze wird trotzdem gebraucht, aber für PM-134.
    expect(hat(lauf(T_KOMMA, ZWEI()), /^Wand streichen 2x — Wohnzimmer/)).toBe(false)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-136 · Der Ausschluss ohne Raumnamen erbt den zuletzt genannten Raum
//
// „Flur … Wände streichen. Wohnzimmer … Wände streichen. An den Wänden
// machen wir nichts."
//
// Der Satz nennt keinen Raum. Gemeint ist erkennbar: nirgends. Die Maschine
// hängt ihn an den zuletzt genannten Raum (Wohnzimmer) — der Flur behält
// seine Wand, 356,25 €. Global wird ein Ausschluss nur, wenn ein Wort aus
// `UEBERALL` dasteht („überall", „generell", „in allen Räumen", „Wohnung")
// oder wenn gar kein Raum bekannt ist.
//
// Das ist die Gegenrichtung zu PM-105: dort nimmt die Verneinung zu viel mit,
// hier zu wenig. Beide kommen aus derselben Stelle.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-136 · der Ausschluss ohne Raumnamen', () => {
  const T_OHNE_RAUM = 'Flur, 6 mal 1,50, 2,50 hoch. Wände streichen. Wohnzimmer, 4 mal 5, 2,50 hoch. Wände streichen. An den Wänden machen wir nichts.'
  const T_UEBERALL = 'Flur, 6 mal 1,50, 2,50 hoch. Wände streichen. Wohnzimmer, 4 mal 5, 2,50 hoch. Wände streichen. An den Wänden machen wir überall nichts.'

  it('PM-136 · gemessener Stand: nur der zuletzt genannte Raum verliert die Wand', () => {
    const pos = lauf(T_OHNE_RAUM, ZWEI())
    expect(hat(pos, /^Wand streichen 2x — Wohnzimmer/)).toBe(false)
    expect(hat(pos, /^Wand streichen 2x — Flur/)).toBe(true)
  })

  it('PM-136-D · am Ausdruck: der Ausschluss ist nicht global, er hängt am Wohnzimmer', () => {
    const a = erkenneBauteilAusschluss(
      'Flur Wände streichen. Wohnzimmer Wände streichen. An den Wänden machen wir nichts.',
      ['Flur', 'Wohnzimmer'],
    )
    expect(a.global.size).toBe(0)
    expect([...(a.jeRaum.get('Wohnzimmer') ?? [])]).toEqual(['wand'])
    expect(a.jeRaum.has('Flur')).toBe(false)
  })

  it('PM-136-C · Kontrolle: mit „überall" wird derselbe Satz global', () => {
    const a = erkenneBauteilAusschluss(
      'Flur Wände streichen. Wohnzimmer Wände streichen. An den Wänden machen wir überall nichts.',
      ['Flur', 'Wohnzimmer'],
    )
    expect([...a.global]).toEqual(['wand'])
    const pos = lauf(T_UEBERALL, ZWEI())
    expect(hat(pos, /^Wand streichen 2x/)).toBe(false)
  })

  it.fails('PM-136-A · SOLL: ohne Raumnamen nach mehreren Räumen wird nachgefragt, nicht geerbt', () => {
    // Soll-Lösung — und bewusst NICHT „dann eben global": Beides ist geraten.
    // Richtig ist ein Fehlt-Eintrag / eine Rückfrage, der sagt, dass die
    // Ansage nicht zugeordnet werden konnte. Eine Bremse, die rät, ist
    // schlimmer als keine — der Satz steht so in `bauteil-ausschluss.ts`.
    //
    // NACHGEZOGEN am 21.09. (DC-135): Seit der Bauteil-Ausschluss seinen
    // Beleg mitreicht, steht in `fehlende` eine Zeile mit „Wänden" — aber
    // sie sagt das Falsche. Sie behauptet die geerbte Zuordnung („Wohnzimmer:
    // Arbeiten an den Wänden sind nicht im Angebot") statt zuzugeben, dass
    // die Ansage nicht zugeordnet werden konnte. Die alte Fassung dieser
    // Zusicherung („irgendeine Zeile nennt die Wand") wäre dadurch grün
    // geworden, ohne dass der Befund behoben ist. Sie prüft deshalb jetzt
    // auf das, was PM-136-A wirklich verlangt.
    const { fehlende } = laufVoll(T_OHNE_RAUM, ZWEI())
    expect(fehlende.some(f => /nicht zugeordnet|welchem Raum|nicht eindeutig/i.test(f))).toBe(true)
  })
})

// ───────────────────────────────────────────────────────────────────────────
// PM-137 · Der „Block" — drei Grenzen, gemessen statt gelesen
//
// Die eigentliche Antwort auf Themenspeicher Punkt 11. Wer PM-101, PM-105
// oder PM-125 baut, baut auf diesen drei Grenzen auf; stehen sie nicht fest,
// ist der Fix geraten.
// ───────────────────────────────────────────────────────────────────────────
describe('PM-137 · der Umfang der Verneinungsmaschine', () => {
  it('PM-137-1 · die Gegenprobe-Grenze ist der Satz — Trenner sind . ! ? ; und Zeilenumbruch', () => {
    expect(saetze('Flur, Wände weiß. An den Wänden nichts')).toEqual([
      'Flur, Wände weiß', 'An den Wänden nichts',
    ])
    // Der Zeilenumbruch ist derselbe Trenner wie der Punkt — ein Absatz ist
    // für diese Maschine keine eigene Einheit.
    expect(saetze('Flur, Wände weiß\n\nAn den Wänden nichts')).toEqual([
      'Flur, Wände weiß', 'An den Wänden nichts',
    ])
    // Und die Dezimalzahl bleibt dabei heil (PM-034/PM-036-Erbe).
    expect(saetze('Flur 6 mal 1,50. Wände weiß')).toEqual(['Flur 6 mal 1,50', 'Wände weiß'])
  })

  it('PM-137-2 · die Raumgrenze ist der Teilsatz — Trenner ist das Komma', () => {
    expect(teilsaetze('Flur Wände streichen, im Wohnzimmer nichts')).toEqual([
      'Flur Wände streichen', 'im Wohnzimmer nichts',
    ])
  })

  it('PM-137-3 · die Reichweite ist der ganze Text — keine Entfernung, keine Richtung', () => {
    const wand = (t: string) =>
      [...(erkenneBauteilAusschluss(t, ['Flur']).jeRaum.get('Flur') ?? [])]
    // direkt danach
    expect(wand('Flur, Wände weiß. An den Wänden machen wir nichts.')).toEqual(['wand'])
    // zwei Sätze später, mit einem fremden Satz dazwischen
    expect(wand('Flur, Wände weiß. Vier Innentüren lackieren. An den Wänden machen wir nichts.')).toEqual(['wand'])
    // davor
    expect(wand('Flur. An den Wänden machen wir nichts. Wände weiß.')).toEqual(['wand'])
    // über einen Absatz hinweg
    expect(wand('Flur, Wände weiß.\n\nAn den Wänden machen wir nichts.')).toEqual(['wand'])
  })

  it('PM-137-4 · die Gegenprobe wirkt nur im selben Satz — das ist die ganze Bremse', () => {
    const wand = (t: string) =>
      [...(erkenneBauteilAusschluss(t, ['Flur']).jeRaum.get('Flur') ?? [])]
    // Auftrag im selben Satz für dasselbe Bauteil → kein Ausschluss.
    expect(wand('Flur. Die Wände nicht tapezieren, nur streichen.')).toEqual([])
    // Auftrag im selben Satz für ein ANDERES Bauteil → Ausschluss bleibt.
    expect(wand('Flur. Decke streichen, an den Wänden machen wir nichts.')).toEqual(['wand'])
    // Auftrag im NÄCHSTEN Satz → zählt nicht mehr (das ist PM-134).
    expect(wand('Flur. An den Wänden machen wir nichts. Wände streichen.')).toEqual(['wand'])
    // CoS-E-091 (PM-135), 21.09.: innerhalb des Satzes hat die Gegenprobe
    // seitdem eine RICHTUNG. Sie zählt den Teilsatz des Ausschlusses und
    // alles dahinter — ein Auftrag DAVOR hebt ihn nicht mehr auf.
    expect(wand('Flur. Wände streichen, an den Wänden machen wir nichts.')).toEqual(['wand'])
    // Gegenprobe zur Gegenprobe: derselbe Satz andersherum gelesen bleibt,
    // was er war — der Auftrag dahinter gewinnt.
    expect(wand('Flur. An den Wänden machen wir nichts, Wände streichen.')).toEqual([])
  })

  it('PM-137-5 · die Belege werden gesammelt und nirgends gezeigt', () => {
    // `belege` trägt den Satz, auf den sich die Bremse stützt — und wird
    // außerhalb von `bauteil-ausschluss.ts` von niemandem gelesen. Deshalb
    // ist jeder Wegfall stumm (PM-134-B, PM-113, PM-125). Kein Bauauftrag
    // des Prüfmeisters: wo der Satz hingehört, entscheidet der Designer.
    const a = erkenneBauteilAusschluss('Flur, Wände weiß. An den Wänden machen wir nichts.', ['Flur'])
    expect(a.belege).toEqual(['An den Wänden machen wir nichts'])
  })
})
