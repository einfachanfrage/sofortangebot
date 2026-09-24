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
  // K.2 (Engineering, 15.09.): Ab hier laeuft der Text so, wie die Pipeline
  // ihn weiterreicht — einmal am Eingang durch `ersetzeZahlenWorte`, danach
  // ueberall derselbe. `verarbeiteExtraktion` bekommt weiter den ROHEN Text,
  // die normalisiert selbst (extraktion-pipeline.ts Z. 83). Vorher stand hier
  // das rohe Transkript: Damit war jede Sperrklinke, die an einer Stueckzahl
  // haengt, auf einen Zustand gesetzt, den das Produkt nicht hat.
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
  const ergebnis = pruefeUndErgaenzeVollstaendigkeit(
    gewerk, eng.positionen, text, meta as never, signale as never,
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chips: string[] = r2.flatMap((r: any) =>
    (r.arbeiten ?? []).map((a: string) => `${a}${r.name ? ` — ${r.name}` : ''}`),
  )
  return normalisiereBodenPositionenAusAufnahme(
    ergaenzeAusAufnahmeHinweisen(ergebnis.positionen, chips, text), text,
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

  // ── war Sperrklinke PM-045-A, ZURÜCKGENOMMEN am 15.09. (K.2) ───────────
  // Gemeldet war: alle vier Zeilen mit Menge 1, 540,00 € Verlust je Angebot,
  // „der teuerste Fund dieses Batches". Nachgemessen: **das Produkt kann es.**
  //
  // Der Fehler saß im Harnisch dieser Datei. `lauf()` hat der Vollständig-
  // keitsprüfung das ROHE Transkript gereicht; die Pipeline reicht dort
  // `textMitZahlen` — den einmal am Eingang normalisierten Text
  // (extraktion-pipeline.ts Z. 83, Z. 271 f.; mehrgewerk.ts Z. 212).
  // Mit dem Text, den das Produkt tatsächlich weitergibt, steht überall 4.
  //
  // Zurückgenommen wird damit auch die zweite dort behauptete Ursache
  // („auch mit tueren:[{anzahl:4}] bleibt es bei 1"): Sie war dieselbe
  // Messung, nicht eine zweite.
  it('„vier Türen" sind vier Türen — alle vier Zeilen tragen Menge 4', () => {
    const p = pos()
    for (const muster of [/Türen lackieren/, /Türzarge lackieren/, /Türen grundieren/, /Türen abschleifen/]) {
      expect(finde(p, muster)?.menge, String(muster)).toBe(4)
    }
  })

  // ── PM-045-B, neu gefasst am 15.09. (K.2) ─────────────────────────────
  //
  // Die alte Fassung prüfte `zaehleTueren('vier Türen')` nackt und stand als
  // Sperrklinke. Sie hat recht — die Funktion allein kennt nur Ziffern —,
  // aber sie beschreibt keinen Produktzustand: Das Produkt ruft sie NIE mit
  // rohem Text. Sie bekommt `textMitZahlen`, und da steht „4 Türen".
  //
  // Was hier stattdessen zugesichert wird, ist die Stelle, an der es
  // schiefgehen KANN: dass die Normalisierung am Eingang wirklich passiert
  // und die Stückzahl bis zur Position durchkommt. Bricht jemand die
  // Reihenfolge auf, fällt diese Prüfung — und zwar rot, nicht als
  // stillschweigend erfüllte Sperrklinke.
  it('PM-045-B · die Stückzahl übersteht den Weg vom Zahlwort zur Position', () => {
    // 1. der Weg, den das Produkt geht
    expect(zaehleTueren(ersetzeZahlenWorte('vier Türen lackieren'))).toBe(4)
    expect(zaehleTueren(ersetzeZahlenWorte('die zwei Türen streichen'))).toBe(2)
    expect(zaehleFenster(ersetzeZahlenWorte('drei Fenster streichen'))).toBe(3)
    // 2. die Bedingung dafür — ohne Normalisierung zählt niemand mit.
    //    Steht hier eines Tages eine Zahl statt der 0, ist die Zählung
    //    selbst robust geworden und diese Zeile darf weg.
    expect(zaehleTueren('vier Türen lackieren')).toBe(0)
  })

  // ── Sperrklinke PM-045-C GELÖST am 15.09.2026 (CoS-E-059, Eingriff 2) ──
  // Gebaut ist `vorarbeitGiltFuer` (helpers.ts): Eine im Diktat genannte
  // Vorarbeit gilt nur für das Bauteil, bei dem sie genannt wurde. Wird sie
  // gar nicht genannt, bleibt es beim fachlichen Standard — deshalb nimmt
  // der Eingriff nirgends eine Zeile weg, wo heute Geld steht.
  // Aus `it.fails` wird damit `it`; fällt die Zeile künftig, ist sie ein
  // Rückfall und keine offene Sperrklinke.
  // — Head of Product Engineering
  it('PM-045-C · was nur für die Türen gesagt wurde, gilt nicht für die Fenster', () => {
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

  // CoS-E-059 Eingriff 3 (Engineering, 15.09.2026): gebaut und gemessen — aus
  // `it.fails` wird `it`. Fällt die Zeile künftig, ist sie ein Rückschritt.
  it('PM-046-A · der Sperrgrund liegt auf der gesperrten Fläche', () => {
    // Gemessen: 17,10 m² — das ist die Decken-/Bodenfläche. Der Grund dafür
    // ist nicht fachlich, sondern historisch: Die Regel stammt aus dem
    // Wasserflecken-Fall (Flecken an der Decke) und rechnet bis heute mit
    // `dm2`, ausgelöst wird sie aber von jedem Wort mit „sperr".
    //
    // ── Antwort auf K.1 Frage 1 (Prüfmeister, 15.09.) ────────────────────
    // „Welche Fläche gilt, wenn nur ‚Sperrgrund' gesagt wurde?"
    // Die Fläche folgt der URSACHE, nicht dem Auslösewort:
    //
    //   Wasserfleck / Fleck / „schlägt von oben durch"  → Decke
    //   Nikotin / Ruß / Rauch / „verraucht" / „gelb"    → Wand UND Decke
    //   eine im Satz genannte Fläche                    → die genannte,
    //                                                     schlägt alles
    //   nichts davon (bloß „Sperrgrund")                → KEINE bepreiste
    //                                                     Zeile, Rückfrage
    //
    // Der Nikotin-Fall ist Wand UND Decke, und das ist keine Vorsicht: Rauch
    // steigt, die Decke ist die am stärksten belastete Fläche im Raum. Wer
    // nur die Wände sperrt und die Decke normal streicht, hat nach ein paar
    // Wochen gelbe Schatten an der Decke — und steht in der Gewährleistung.
    // Eine halb gesperrte Wohnung ist keine gesperrte Wohnung.
    //
    // Der letzte Fall ist Regel H Satz 3 (Sandy, 12.09.): nicht gesagt →
    // keine bepreiste Zeile. Er ist ausdrücklich NICHT „dann eben die Decke".
    //
    // Für dieses Diktat („total verraucht, gelb an den Wänden"):
    //   Soll: (41,50 + 17,10) × 9,00 = 527,40 €
    //   Ist:   17,10          × 9,00 = 153,90 €      → 373,50 € fehlen
    const p = pos()
    const wand = finde(p, /Wand streichen/)!
    const decke = finde(p, /Decke streichen/)!
    expect(finde(p, /Isoliergrund/)!.menge).toBeCloseTo(wand.menge + decke.menge, 1)
  })

  // CoS-E-059 Eingriff 3 (Engineering, 15.09.2026): gebaut und gemessen — aus
  // `it.fails` wird `it`. Fällt die Zeile künftig, ist sie ein Rückschritt.
  it('PM-046-D · „sperren" ist kein Auslöser, die Ursache ist einer', () => {
    // Zweite Hälfte derselben Antwort, und für sich ein eigener Fund:
    // Ausgelöst wird die ganze Regel von `lower.includes('sperr')`
    // (maler-sonder.ts Z. 42). Das Wort steckt in Sperrmüll, absperren,
    // Absperrband, Sperrholz, gesperrt. Siehe PM-064 —
    // dort gemessen, hier als Bedingung der Antwort auf K.1 festgehalten:
    // Solange der Auslöser am Wortstamm hängt, ist jede Antwort auf
    // „welche Fläche" nur die halbe Reparatur.
    const p = lauf('maler',
      'Wohnzimmer viereinhalb mal drei achtzig, Höhe zwei fünfzig. Wände und Decke zweimal streichen. Der alte Teppich muss raus, das ist Sperrmüll.',
      [raum('Wohnzimmer', { laenge: 4.5, breite: 3.8, hoehe: 2.5, arbeiten: ['wände streichen 2x', 'decke streichen 2x'] })])
    expect(finde(p, /Isoliergrund/), 'Sperrmüll ist kein Sperrgrund').toBeUndefined()
  })

  // CoS-E-059 Eingriff 3 (Engineering, 15.09.2026): gebaut und gemessen — aus
  // `it.fails` wird `it`. Fällt die Zeile künftig, ist sie ein Rückschritt.
  it('PM-046-B · Isoliergrund und Tiefengrund stehen nicht beide auf derselben Fläche', () => {
    // Gemessen: beide mit 17,10 m², beide automatisch ergänzt. Ein
    // Isoliergrund ERSETZT den Tiefengrund, er kommt nicht dazu — und
    // Tiefengrund über einer Sperrschicht hebt die Sperre auf. Das ist
    // 76,95 € zu viel im Angebot und eine Arbeit, die schadet.
    //
    // ── Antwort auf K.1 Frage 2 (Prüfmeister, 15.09.) ────────────────────
    // „Fällt der Tiefengrund ganz weg oder nur auf der gesperrten Fläche?"
    // **Nur auf der gesperrten Fläche. Die Regel ist je Fläche, nie je
    // Angebot.**
    //
    //   auf der gesperrten Fläche : Tiefengrund fällt weg. Der Isoliergrund
    //                               IST dort die Grundierung. Zwei Grundie-
    //                               rungen auf einem Quadratmeter ist eine
    //                               zu viel, und die Sperrwirkung braucht
    //                               den saugenden Untergrund, den ihr der
    //                               Tiefengrund darunter gerade nimmt.
    //   auf jeder anderen Fläche  : Tiefengrund bleibt, wo er hingehört.
    //
    // „Wände sperren, Decke normal grundieren" muss also BEIDE Zeilen
    // ergeben — Isoliergrund auf 41,50 m² Wand, Tiefengrund auf 17,10 m²
    // Decke. Nie beide auf derselben Zahl. Der Ausnahmefall (stark
    // sandender Untergrund, erst festigen, dann sperren) ist einer, den
    // der Handwerker ansagt — nicht einer, den die App rät (Regel H).
    const p = pos()
    const iso = finde(p, /Isoliergrund/)
    const tief = finde(p, /Grundieren \(Tiefengrund\)|Voranstrich/)
    // Engineering, 15.09.2026 (CoS-E-059 Eingriff 3): `Boolean(...)` ergänzt.
    // Ohne Tiefengrund ist `iso && tief && …` nicht `false`, sondern
    // `undefined` — die Zusicherung wäre am JS-Wahrheitswert gescheitert und
    // nicht an der Sache. Die Prüfabsicht ist unverändert: die beiden dürfen
    // nicht auf derselben Fläche stehen. Entscheidet der Prüfmeister anders,
    // überschreibt er es.
    expect(Boolean(iso && tief && Math.abs(iso.menge - tief.menge) < 0.5),
      'Isoliergrund und Tiefengrund auf derselben Fläche').toBe(false)
  })

  // CoS-E-059 Eingriff 3 (Engineering, 15.09.2026): gebaut und gemessen — aus
  // `it.fails` wird `it`. Fällt die Zeile künftig, ist sie ein Rückschritt.
  it('PM-046-E · „Wände sperren, Decke normal grundieren" — zwei Flächen, zwei Grundierungen', () => {
    // Der Fall, an dem sich Frage 2 entscheidet, gemessen:
    // Die Wände (35,00 m²) sind genannt und werden gesperrt — der
    // Isoliergrund liegt trotzdem auf der Decke (12,00 m²). Dazu bekommt
    // dieselbe Decke DREI Grundierungen übereinander:
    // `Voranstrich / Grundierung Decke` (Engine), `Grundieren — Tiefengrund`
    // und `Isoliergrund` — alle drei auf 12,00 m².
    //
    //   Soll: Isoliergrund  35,00 m²  (Wand — steht im Satz)
    //         Tiefengrund   12,00 m²  (Decke — „normal grundieren")
    const p = lauf('maler',
      'Wohnzimmer, vier mal drei, Höhe zwo fünfzig. Die Wände müssen wir sperren, Nikotin. Decke normal grundieren und streichen.',
      [raum('Wohnzimmer', { laenge: 4, breite: 3, hoehe: 2.5, arbeiten: ['wände streichen 2x', 'decke streichen 2x'] })])
    const wand = finde(p, /Wand streichen/)!
    expect(finde(p, /Isoliergrund/)?.menge, 'Isoliergrund gehört auf die Wand').toBeCloseTo(wand.menge, 1)
  })

  // CoS-E-059 Eingriff 3 (Engineering, 15.09.2026): gebaut und gemessen — aus
  // `it.fails` wird `it`. Fällt die Zeile künftig, ist sie ein Rückschritt.
  it('PM-046-C · was ausdrücklich gesagt wurde, ist kein Vorschlag', () => {
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
