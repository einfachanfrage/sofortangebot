// PM-119 / L-06 — die Positionen stehen nicht in der Reihenfolge der
// Ausführung (Prüfmeister, 17.09.2026)
//
// ── Der alte Fund, jetzt mit Soll ─────────────────────────────────────────
//
// L-06 steht seit dem Live-Lauf vom 15.09. in meiner Restliste, bisher als
// ein Satz ohne Soll: „Auf dem Papier steht Grundierung, dann Anstrich, dann
// Spachtelarbeiten Q3. Gearbeitet wird umgekehrt." Diese Datei misst ihn
// nach, macht ihn auf drei Fälle breit und schreibt auf, wonach zu sortieren
// ist. Ohne Soll kann Engineering nichts bauen.
//
// ── Gemessen am 17.09.2026, drei Fälle, dreimal falsch ────────────────────
//
//   PM-051 (Büro, Q3):        Grundierung · Anstrich · Bodenschutz ·
//                             Abkleben · Spachteln Q3
//   Raufaser (Flur):          Grundierung · Bodenschutz · Abkleben ·
//                             Spachteln Q2 · Tapete entfernen · tapezieren ·
//                             überstreichen
//   Laminat (Wohnzimmer):     Laminat verlegen · Altbelag entfernen ·
//                             Sockelleisten montieren
//
// Der Flur ist der schlimmste der drei, und er ist schlimmer als das, was in
// meiner Restliste steht: `Tapete entfernen` steht an FÜNFTER Stelle — hinter
// der Grundierung und hinter der Spachtelung. Wer das liest, liest, dass
// erst grundiert und gespachtelt wird und danach die Tapete von genau dieser
// Wand gerissen wird. Beim Laminat dasselbe eine Nummer kleiner: der neue
// Boden wird verlegt, bevor der alte herauskommt.
//
// Das ist kein Schönheitsfehler. Ein Angebot ist das erste Papier, das ein
// Kunde von einem Betrieb sieht, und die Reihenfolge der Positionen ist das
// Einzige darauf, was zeigt, ob jemand den Ablauf kennt.
//
// ── Der Befund, der obendrauf kommt ───────────────────────────────────────
//
// Es gibt bereits eine Gliederung „Nach Arbeitsablauf" (`angebot-struktur.ts`,
// pro Betrieb wählbar). Sie löst L-06 NICHT, auch nicht für den Betrieb, der
// sie einschaltet:
//
//   • Ihre drei Phasen sind zu grob. `phaseFuer` wirft `entfern`, `spachtel`
//     und `grundier` gemeinsam in `vor` — also genau die drei Schritte, deren
//     Reihenfolge untereinander der ganze Fund ist.
//   • Innerhalb einer Phase wird nicht sortiert, sondern die vorhandene
//     (falsche) Reihenfolge behalten.
//
// Sortiert man PM-051 mit `phaseFuer`, kommt heraus: Grundierung ·
// Bodenschutz · Abkleben · Spachteln Q3 · Anstrich. Die Grundierung steht
// weiter vor der Spachtelung. Die Gliederung heißt nach dem Arbeitsablauf,
// sortiert aber nicht danach.
//
// ── Das Soll: sieben Stufen ───────────────────────────────────────────────
//
// Die Positionen stehen in Stufen, und innerhalb einer Stufe in der
// Reihenfolge, in der sie entstanden sind (stabil sortieren, nichts
// umstellen, was schon stimmt). Die Stufen sind die Reihenfolge, in der auf
// der Baustelle gearbeitet wird:
//
//   1 SCHUTZ        Boden schützen, Möbel abdecken und rücken, abkleben,
//                   Staubschutz, Gerüst stellen
//   2 ABBRUCH       Tapete entfernen, Altbelag entfernen, Altfliesen
//                   abstemmen, Klebstoffreste abfräsen
//   3 UNTERGRUND    Spachtelarbeiten Q1–Q4, Risse, Ausbessern, schleifen,
//                   Ausgleichsmasse
//   4 GRUNDIERUNG   Voranstrich, Grundierung, Tiefengrund, Haftgrund
//   5 HAUPTARBEIT   streichen, tapezieren, lackieren, verlegen, fliesen,
//                   abdichten, verfugen
//   6 ABSCHLUSS     Sockelleisten montieren, Übergangsprofil, Silikonfugen,
//                   Folie ab, Endreinigung, Entsorgung
//   7 ZUSCHLAG      Erschwerniszuschläge, Kleinmaterial, Anfahrt
//
// Warum 7 ganz hinten: ein Prozentzuschlag braucht eine Bemessungsgrundlage,
// die erst dasteht, wenn alles andere dasteht (PM-008/PM-015) — und
// Kleinmaterial ist kein Arbeitsgang, sondern eine Sammelzeile.
//
// Warum 4 eine eigene Stufe ist und nicht zu 3 gehört: grundiert wird auf dem
// FERTIGEN Untergrund. Das ist der eine Übergang, den das Produkt heute in
// allen drei gemessenen Fällen falsch herum hat.
//
// ── Was diese Datei ausdrücklich NICHT festlegt ───────────────────────────
//
// Die Reihenfolge INNERHALB der Stufe 5. Bei den Fliesen schreibt die Engine
// heute `Bodenfliesen verlegen · Verbundabdichtung Boden · Verfugung Boden` —
// abgedichtet wird aber VOR dem Verlegen und verfugt danach. Das ist eine
// zweite, kleinere Frage, die die Stufenregel nicht beantwortet; sie steht
// als eigener Punkt im Themenspeicher und ist nicht Gegenstand von L-06.
import { describe, expect, it } from 'vitest'
import { berechneMengen } from '../mengen/engine'
import { verarbeiteExtraktion } from '../mengen/extraktion-pipeline'
import { pruefeUndErgaenzeVollstaendigkeit } from '../vollstaendigkeit/index'
import { zaehleFenster, zaehleTueren } from '../extraktion-masse'
import { ergaenzeAusAufnahmeHinweisen, normalisiereBodenPositionenAusAufnahme } from '../mengen/aufnahme-hinweise'
import { ersetzeZahlenWorte } from '../zahlen-parser'

const TUER = { anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }
const FENSTER = (anzahl = 1, breite = 1.2, hoehe = 1.0) => ({ anzahl, breite, hoehe, annahme: true })

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const raum = (name: string, extra: any = {}): any => ({
  name, laenge: null, breite: null, hoehe: null, flaeche: null, umfang: null,
  tueren: [], fenster: [], arbeiten: [], altbelag_entfernen: false,
  altbelag_vorhanden: false, sockelleisten: false, nassbereich: false, ausgleich: false, ...extra,
})

// Dieselbe Kette wie in `pruefmeister-batch-47-56.test.ts`, inklusive der
// beiden Aufnahme-Stufen, die die echte Route über die Vollständigkeit legt.
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
    (r.arbeiten ?? []).map((a: string) => `${a}${r.name ? ` — ${r.name}` : ''}`))
  return normalisiereBodenPositionenAusAufnahme(
    ergaenzeAusAufnahmeHinweisen(ergebnis.positionen, chips, text), text,
  ) as { beschreibung: string; menge: number; einheit: string }[]
}

// ── Das Soll als Funktion. Wer L-06 baut, baut genau das. ─────────────────
//
// Reihenfolge der Regeln = Vorrang. Spezifisch vor generisch: „Sockelleisten
// abkleben" ist Schutz, „Sockelleisten montieren" ist Abschluss; „Untergrund
// schleifen" ist Untergrund, „Parkett schleifen" ist Hauptarbeit.
const STUFEN: { stufe: number; name: string; test: RegExp }[] = [
  { stufe: 7, name: 'ZUSCHLAG', test: /erschwerniszuschlag|zuschlag\b|kleinmaterial|verbrauchsmaterial|anfahrt|kleinstauftrag|mindestauftrag/i },
  { stufe: 6, name: 'ABSCHLUSS', test: /sockelleisten\s*montier|stuckleisten\s*montier|übergangs?(profil|schiene)|anschlussprofil|silikon|versiegel|parkettlack|folie\s*entfern|abdeckfolie\s*\/?\s*abklebeband\s*entfern|endreinigung|feinreinigung|baustelle\s*kehren|entsorg|möbel\s*zurück/i },
  { stufe: 1, name: 'SCHUTZ', test: /abkleb|abdeck|schütz|staubschutz|staubwand|gerüst|möbel\s*rück|boden\s*schütz/i },
  { stufe: 2, name: 'ABBRUCH', test: /entfern|abnehm|abstemm|demontier|demontage|aufnehm|rausreiß|abfräs|kleberreste|altkleber|graffiti/i },
  { stufe: 3, name: 'UNTERGRUND', test: /spachtel|glätt|ausbesser|riss|schleif|ausgleich|untergrund|quarzsand|feuchtigkeitssperre|trittschall/i },
  { stufe: 4, name: 'GRUNDIERUNG', test: /grundier|voranstrich|tiefengrund|haftgrund/i },
  { stufe: 5, name: 'HAUPTARBEIT', test: /streich|anstrich|tapezier|raufaser|lackier|verleg|verkleb|fliesen|verfug|abdicht|abdichtung|sockel/i },
]
function stufeFuer(titel: string): number {
  for (const r of STUFEN) if (r.test.test(titel)) return r.stufe
  return 5
}
const stufenfolge = (pos: { beschreibung: string }[]) => pos.map(p => stufeFuer(p.beschreibung))
const istSortiert = (n: number[]) => n.every((x, i) => i === 0 || n[i - 1] <= x)
const titel = (pos: { beschreibung: string }[]) => pos.map(p => p.beschreibung.replace(/ — .*$/, ''))

const F_Q3 = () => lauf('maler',
  'Büro, fünf mal vier, Höhe zwo sechzig. Die Wände müssen vollflächig gespachtelt werden, '
  + 'Qualitätsstufe Q3, weil da Streiflicht draufkommt. Danach zweimal streichen. Ein Fenster, eine Tür.',
  [raum('Büro', { laenge: 5, breite: 4, hoehe: 2.6, tueren: [TUER], fenster: [FENSTER()], arbeiten: ['waende_streichen', 'spachteln'] })])

const F_RAUFASER = () => lauf('maler',
  'Flur, vier mal zwei, Höhe zwo fünfzig. Alte Raufasertapete abnehmen, danach spachteln, '
  + 'grundieren und neu tapezieren, dann zweimal streichen.',
  [raum('Flur', { laenge: 4, breite: 2, hoehe: 2.5, tueren: [TUER], fenster: [], arbeiten: ['tapete_entfernen', 'spachteln', 'tapezieren', 'waende_streichen'] })])

const F_LAMINAT = () => lauf('boden_parkett',
  'Wohnzimmer, fünf mal vier. Alter Teppich raus, danach Laminat verlegen, Sockelleisten neu.',
  [raum('Wohnzimmer', { laenge: 5, breite: 4, hoehe: 2.5, belag: 'laminat', altbelag_entfernen: true, altbelag_vorhanden: true, sockelleisten: true, arbeiten: ['laminat verlegen', 'altbelag entfernen'] })])

describe('PM-119 / L-06 — Positionen in der Reihenfolge der Ausführung', () => {
  it('PM-119-Z Kontrolle · die Stufenregel trifft jede gemessene Zeile — keine landet im Auffangbecken', () => {
    // Bleibt grün, wenn L-06 gebaut wird: sie prüft die Regel, nicht das
    // Produkt. Ohne sie wäre jede Sperrklinke unten wertlos, weil eine
    // Regel, die alles auf Stufe 5 wirft, immer „sortiert" aussieht.
    for (const fall of [F_Q3(), F_RAUFASER(), F_LAMINAT()]) {
      for (const p of fall) {
        const t = p.beschreibung
        expect(STUFEN.some(r => r.test.test(t)), `keine Stufe für „${t}"`).toBe(true)
      }
    }
    // Und die Regel unterscheidet die Fälle, die sich am nächsten liegen:
    expect(stufeFuer('Sockelleisten abkleben — Büro')).toBe(1)
    expect(stufeFuer('Sockelleisten montieren — Wohnzimmer')).toBe(6)
    expect(stufeFuer('Tapete entfernen')).toBe(2)
    expect(stufeFuer('Spachtelarbeiten Q3 — Büro')).toBe(3)
    expect(stufeFuer('Voranstrich / Grundierung — Büro')).toBe(4)
    expect(stufeFuer('Wand streichen 2x — Büro')).toBe(5)
    expect(stufeFuer('Erschwerniszuschlag Raumhöhe > 3m — Büro')).toBe(7)
  })

  it.fails('PM-119-A 🔴 Soll: PM-051 steht in der Reihenfolge der Ausführung', () => {
    // IST 17.09.2026: Grundierung · Anstrich · Bodenschutz · Abkleben ·
    // Spachteln Q3  →  Stufen 4, 5, 1, 1, 3
    // SOLL: Bodenschutz · Abkleben · Spachteln Q3 · Grundierung · Anstrich
    expect(istSortiert(stufenfolge(F_Q3()))).toBe(true)
  })

  it.fails('PM-119-B 🔴 Soll: beim Raufaser-Flur steht „Tapete entfernen" vor der Grundierung', () => {
    // Der schwerste der drei. IST: die Tapete wird an fünfter Stelle
    // entfernt — hinter Grundierung und Spachtelung derselben Wand.
    const pos = F_RAUFASER()
    const iTapete = titel(pos).findIndex(t => /tapete entfernen/i.test(t))
    const iGrund = titel(pos).findIndex(t => /grundierung|voranstrich/i.test(t))
    const iSpachtel = titel(pos).findIndex(t => /spachtelarbeiten/i.test(t))
    expect(iTapete).toBeGreaterThanOrEqual(0)
    expect(iTapete).toBeLessThan(iSpachtel)
    expect(iSpachtel).toBeLessThan(iGrund)
  })

  it.fails('PM-119-C 🔴 Soll: der alte Boden kommt raus, bevor der neue verlegt wird', () => {
    // IST: Laminat verlegen · Altbelag entfernen · Sockelleisten montieren.
    const t = titel(F_LAMINAT())
    expect(t.findIndex(x => /altbelag entfernen/i.test(x)))
      .toBeLessThan(t.findIndex(x => /laminat verlegen/i.test(x)))
  })

  it.fails('PM-119-D 🔴 Soll: alle drei Fälle sind stufenweise sortiert', () => {
    // Die zusammenfassende Sperrklinke — sie ist die, die grün wird, wenn
    // L-06 wirklich gebaut ist, und nicht nur der Einzelfall repariert.
    expect([F_Q3(), F_RAUFASER(), F_LAMINAT()].map(f => istSortiert(stufenfolge(f))))
      .toEqual([true, true, true])
  })
})
