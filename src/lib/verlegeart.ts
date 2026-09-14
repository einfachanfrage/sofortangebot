// Verlegeart im Positionstitel — G.2 (Prüfmeister, 12.09.2026)
//
// ── Das Problem ───────────────────────────────────────────────────────────
//
// Der Standardkatalog nennt bei fast JEDEM Verlege-Eintrag die Verlegeart:
// `Laminat verlegen schwimmend (Klick-System, Standard)` 14,00 €,
// `Teppichboden verlegen vollflächig verklebt` 18,00 €,
// `Teppichboden verlegen lose (doppelseitiges Klebeband)` 10,00 €.
// Die Engine schrieb sie an genau einer Stelle in den Titel. Überall sonst
// stand nur `Laminat verlegen`, und welcher der drei Preise im Angebot
// landete, entschied die Textähnlichkeit.
//
// Manfred, an seinem eigenen Fall: *„‚Teppich verklebt' für den Preis von
// ‚Teppich lose' — das ist bei mir der Unterschied zwischen einem halben Tag
// und zwei Tagen, mit Kleberresten, Spachtel, Schleifen."*
//
// Solange die Engine schweigt, kann der Preis-Matcher die Verlegeart nicht
// als Filter benutzen: Er würde dann alle ehrlichen Katalogzeilen wegwerfen
// und die exotische übrig lassen (`Laminat verlegen` → 24,00 € Fischgrät).
// Gemessen am 12.09., dokumentiert in `docs/vokabular-abgleich.md`, H.3.
//
// ── Die Regel, und wo sie aufhört ─────────────────────────────────────────
//
// Geschrieben wird die Verlegeart nur dort, wo sie **feststeht** — entweder
// weil sie im Diktat gesagt wurde oder weil der Belag sie technisch vorgibt.
// Wo sie eine echte Wahl ist, bleibt der Titel stumm. Eine erfundene
// Verlegeart wäre schlimmer als gar keine: Sie sähe im Angebot aus wie eine
// Feststellung, und der Betrieb steht am Ende für sie gerade.
//
// Feststehend:
//   Laminat            → schwimmend. Laminat wird nicht verklebt.
//   Klick-Belag        → schwimmend. Das Klickprofil IST die Verlegeart.
//   Linoleum           → vollflächig verklebt. Rollenware wird geklebt.
//   Nadelvlies         → vollflächig verklebt. Manfred und der Prüfmeister
//                        ausdrücklich: Bei Nadelvlies gibt es die
//                        schwimmende Verlegung gar nicht.
//
// Offen (bewusst kein Zusatz):
//   Teppichboden       gespannt 14,00 € / verklebt 18,00 € / lose 10,00 €
//   Fertigparkett      schwimmend 22,00 € / vollflächig verklebt 35,00 €
//   Kork               schwimmend 18,00 € / verklebt 24,00 €
//   Vinyl ohne Klick   Klebe-Vinyl 22–28 € / Loose-Lay 18,00 €
//
// Für die offenen Fälle ist die Rückfrage im Angebot die richtige Antwort
// (F.5/6), nicht eine stille Annahme hier.

/** Was im Titel hinter „verlegen" steht — leer, wenn die Verlegeart offen ist. */
export type VerlegeartZusatz = '' | ' schwimmend' | ' vollflächig verklebt'

/** Im Diktat ausdrücklich genannte Verklebung. */
const GESAGT_VERKLEBT = /verkleb|vollfl[äa]chig|geklebt|angeklebt/i
/** Im Diktat ausdrücklich genannte schwimmende Verlegung. */
const GESAGT_SCHWIMMEND = /schwimmend|klick/i

/**
 * Welche Verlegearten es bei diesem Belag überhaupt gibt.
 *
 * Diese Tabelle ist der Kern, und sie ist bewusst eng. Zwei Fälle haben in
 * der Messung am 12.09. gezeigt, warum:
 *
 * 1. **Ein Belag kann eine Verlegeart gar nicht haben.** Ohne Tabelle machte
 *    ein „Klick-Vinyl" in einem anderen Raum aus `Teppichboden verlegen` ein
 *    `Teppichboden verlegen schwimmend` — und das traf im Katalog
 *    `Fertigparkett verlegen schwimmend`, 22,00 €/m² für einen Teppich.
 *    Teppich wird gespannt, geklebt oder lose verlegt, nie schwimmend.
 * 2. **Bei unbekanntem Belag wissen wir nichts.** `Bodenbelag` ist der
 *    Rückfall, wenn die Extraktion keinen Belag erkannt hat. Dort eine
 *    Verlegeart anzuhängen heißt raten, und `Bodenbelag verlegen schwimmend`
 *    landete prompt bei 22,00 € Fertigparkett.
 */
const MOEGLICH: Array<{ belag: RegExp; arten: VerlegeartZusatz[]; fest?: VerlegeartZusatz }> = [
  // Technisch festgelegt — das Diktat kann es nicht umstoßen. Ein Verhörer
  // („Nadelvlies schwimmend") darf die Kalkulation nicht kippen.
  { belag: /^laminat$|^feuchtraumlaminat$/i, arten: [' schwimmend'], fest: ' schwimmend' },
  { belag: /^linoleum$/i, arten: [' vollflächig verklebt'], fest: ' vollflächig verklebt' },
  { belag: /^nadelvlies/i, arten: [' vollflächig verklebt'], fest: ' vollflächig verklebt' },

  // Der Belagname sagt die Verlegeart schon selbst. Kein Zusatz — er würde
  // den Titel nur verlängern und im Katalog einen Gleichstand erzeugen:
  // `Klick-Vinyl verlegen schwimmend` traf die SPC-Variante (18,00 €) statt
  // der Standard-LVT (16,00 €), weil „, Standard" ein Token zu viel war.
  { belag: /^klick-/i, arten: [], fest: '' },

  // Offen: beide Verlegearten kommen vor, das Diktat entscheidet.
  { belag: /^fertigparkett$|^parkett$|^kork$|^korkboden$/i,
    arten: [' schwimmend', ' vollflächig verklebt'] },

  // Teppich: gespannt / verklebt / lose — aber nie schwimmend. Verklebt ist
  // die einzige der drei, die der Katalog unter „verlegen … verklebt" führt;
  // gespannt und lose stehen dort in Klammern und brauchen die Rückfrage.
  { belag: /^teppichboden$/i, arten: [' vollflächig verklebt'] },
]

// ── Wo der Zusatz BEWUSST fehlt, obwohl die Verlegeart bekannt wäre ───────
//
// Vinyl-Boden, Designboden, Eichenparkett und der nackte „Teppich" stehen
// oben nicht. Nicht weil ihre Verlegeart offen wäre, sondern weil der
// Standardkatalog sie unter ANDEREN Wörtern führt:
//
//   Vinyl verklebt  → `Klebe-Vinyl verlegen, Nasskleber` 28,00 € (hieß bis
//                     zum Umbenennungs-Zug am 12.09.2026 „… vollflächig
//                     (Profikleber, Nasskleber)") oder
//                     `Dryback-Designbelag vollflächig kleben` 28,00 €
//   Eichenparkett   → je nach Aufbau Massiv- (55,00 €) oder Fertigparkett
//
// Mit Zusatz, aber ohne passende Katalogzeile passiert Folgendes, gemessen
// am 12.09.: `Vinyl-Boden verlegen vollflächig verklebt` traf
// `Fertigparkett verlegen vollflächig verklebt` — **35,00 € statt 16,00 €**.
// Der Zusatz macht den Titel textlich so ähnlich zur Parkettzeile, dass der
// Belagname allein den Ausschlag nicht mehr gibt. Ein Zusatz ohne
// Gegenstück im Katalog ist also schlimmer als keiner.
//
// Diese Beläge gehören in die Umbenennungstabelle F.6 (Titel wörtlich wie im
// Katalog), nicht hierher. Welcher Vinyl-Kleber der Standard ist — Dünnbett
// 22,00 € (jetzt `Selbstklebendes Vinyl verlegen`) oder Nasskleber 28,00 € —,
// ist eine Preisfrage für Manfred, keine Ableitung.
//
// Nachtrag 12.09.2026: Seit dem Umbenennungs-Zug trägt KEINE der beiden
// Vinylzeilen mehr das Wort „vollflächig". Eine Suche nach
// `Klebe-Vinyl verlegen vollflächig` findet deshalb gar nichts mehr — vorher
// fand sie still die Dünnbett-Zeile. Das ist die gewollte Richtung (PM-018),
// aber es ist ein weiterer Grund, hier keinen Verlegeart-Zusatz zu setzen.
//
// Der Test `verlegeart.test.ts` hält das nach: Jede Kombination, die diese
// Datei erzeugt, muss im Standardkatalog eine Zeile mit demselben Belagwort
// finden. Kommt ein Belag dazu, dessen Zeile fehlt, fällt der Test.

/**
 * Die Verlegeart für einen Belag, als Titelzusatz.
 *
 * @param label      Belagname, wie er im Titel steht („Laminat", „Klick-Vinyl",
 *                   „Nadelvlies-Teppichboden", „Teppichboden", …)
 * @param raumText   Der Text, der für DIESEN Raum gilt. Bewusst raumweise:
 *                   „In der Küche vollflächig verklebt, im Wohnzimmer
 *                   Klick-Vinyl" darf nicht beide Räume gleich machen —
 *                   dieselbe Regel wie bei `klickGesagt` in boden.ts.
 *
 * Reihenfolge: erst was technisch feststeht, dann was gesagt wurde, dann
 * nichts. Ein unbekannter Belag bekommt nie einen Zusatz.
 */
export function verlegeartZusatz(label: string, raumText = ''): VerlegeartZusatz {
  const name = (label ?? '').trim()
  const eintrag = MOEGLICH.find(e => e.belag.test(name))
  if (!eintrag) return ''
  if (eintrag.fest !== undefined) return eintrag.fest

  const text = raumText ?? ''
  if (GESAGT_VERKLEBT.test(text) && eintrag.arten.includes(' vollflächig verklebt')) {
    return ' vollflächig verklebt'
  }
  if (GESAGT_SCHWIMMEND.test(text) && eintrag.arten.includes(' schwimmend')) {
    return ' schwimmend'
  }
  return ''
}
