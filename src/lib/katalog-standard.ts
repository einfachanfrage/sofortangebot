/**
 * Standardzeilen — was gilt, wenn der Handwerker sich nicht festlegt.
 *
 * ── Warum es diese Datei gibt (Manfred, 12.09.2026) ───────────────────────
 *
 * Nach dem Umbenennungs-Zug (CoS-E-050) stand die Frage im Raum, die
 * eigentlich die ganze Zeit dahinterlag. Manfred hat sie gestellt und gleich
 * beantwortet:
 *
 *   *„Was soll ‚Wärmedämmung verlegen' ohne Zusatz überhaupt treffen?
 *   Bisher war die Antwort stillschweigend ‚die oberste Zeile', also die
 *   billigste. Das war der Fehler. ‚Gar nichts' ist ehrlicher, aber bei
 *   Alltagsbegriffen nervt es. Ich würd's so machen: Jede Familie hat eine
 *   Zeile, die als Standard markiert ist … Der allgemeine Begriff trifft den
 *   Standard und schreibt ihn sichtbar in den Titel, damit der Handwerker
 *   sieht, was angenommen wurde."*
 *
 * Die Messung gibt ihm recht und zeigt sogar, dass es schlimmer war als
 * „die oberste Zeile": Ohne Standard gewinnt **der kürzeste Titel**. Bei der
 * Wärmedämmung war das die Mineralwolle für 22,00 € — die teuerste der drei,
 * nicht die billigste. Bei der Tür gewann `Außentür lackieren beidseitig`
 * für 110,00 €, weil „außentür" das Wort „tür" enthält. Es war nie eine
 * Regel, es war immer ein Nebeneffekt.
 *
 * ── Die drei Zustände, die es gibt ────────────────────────────────────────
 *
 *   1. Der Handwerker legt sich fest („Tür beidseitig lackieren")
 *      → die Sperren in `preis-aufwandswoerter.ts` entscheiden. Unverändert.
 *   2. Er legt sich NICHT fest, und es gibt eine Standardzeile
 *      → sie gewinnt, und er sieht als Annahme, was angenommen wurde.
 *   3. Er legt sich nicht fest, und es gibt keine Standardzeile
 *      → weiter kein Preis. PM-018 bleibt die Grundlinie: lieber sichtbar
 *        kein Preis als still der falsche.
 *
 * Der Standard ist also kein Raten, sondern eine **benannte, sichtbare
 * Entscheidung** — und sie steht hier, an einer Stelle, wo ein Handwerker
 * sie lesen und ändern kann, statt verstreut im Matcher.
 *
 * ── Warum die Annahme nicht in den Titel geschrieben wird ─────────────────
 *
 * Manfred sagte „sichtbar in den Titel … nur eben auf dem Bildschirm, nicht
 * auf dem Kunden-PDF". Beides zusammen geht nicht, wenn der Titel die Zeile
 * auf dem Kundenpapier IST. Deshalb geht die Annahme in `annahmen` — den
 * Kanal, den es dafür schon gibt, der im Entwurf angezeigt und auf dem
 * Kunden-PDF weggelassen wird (festgehalten in
 * `pdf-rechenweg-render.test.ts`: „die Annahme steht NICHT auf dem
 * Kunden-PDF"). Gleiches Ziel, vorhandene Leitung.
 *
 * ── Wie eine Familie aussieht ─────────────────────────────────────────────
 *
 * `begriff` ist bewusst am ANFANG des Titels verankert. `Loose-Lay-Vinyl
 * verlegen` (18,00 €) ist eine eigene Zeile, keine unbestimmte Vinylanfrage —
 * beim ersten Lauf hat sie prompt den Standard für 16,00 € bekommen. Wer
 * sein Produkt vornweg nennt, hat sich festgelegt; das ist genau Manfreds
 * Regel („was unterscheidet, steht vor dem Verb"), hier von der anderen
 * Seite gelesen.
 *
 * `begriff` sagt, wann die Familie gemeint ist. `festgelegt` sagt, woran man
 * erkennt, dass er sich schon entschieden hat — dann greift der Standard
 * nicht. Beides wird am ROHTITEL gelesen, vor jeder Normalisierung, aus dem
 * Grund, der in `preis-aufwandswoerter.ts` steht: Was unterscheidet, steht
 * oft in Klammern, und Klammern wirft die Normalisierung weg.
 *
 * Steht die Standardzeile nicht im Katalog des Betriebs, passiert nichts —
 * dann sucht der Matcher wie bisher. Kein Betrieb bekommt eine Zeile
 * untergeschoben, die er nicht hat.
 */

export interface StandardFamilie {
  /** Kurzname, nur für Tests und Doku. */
  name: string
  /** Wann ist diese Familie gemeint? Am Rohtitel. */
  begriff: RegExp
  /** Woran erkennt man, dass er sich schon festgelegt hat? */
  festgelegt: RegExp
  /** Die Zeile, die ohne Festlegung gilt — wörtlich wie im Katalog. */
  standard: string
  /** Was der Handwerker im Entwurf als Annahme liest. */
  annahme: string
  /** Wer das so entschieden hat. Damit es niemand still ändert. */
  quelle: string
}

export const STANDARD_FAMILIEN: StandardFamilie[] = [
  // ── Maler ───────────────────────────────────────────────────────────────
  {
    // Manfreds eigenes Beispiel: „bei der Tür einseitig".
    // Ohne diese Zeile gewann `Außentür lackieren beidseitig` mit 110,00 €,
    // weil „außentür" das Wort „tür" enthält — 65,00 € zu viel an einer
    // Zimmertür, und niemandem fällt es auf.
    name: 'Tür streichen/lackieren',
    begriff: /^\s*t(?:ü|ue)r(?:en)?\s+(?:streichen|lackieren)/iu,
    festgelegt: /einseitig|beidseitig|au(?:ß|ss)en|innen|zarge|rahmen|leibung|schleif|grundier|\d\s*[x×]|\d\s*[-\s]?fach/iu,
    standard: 'Tür streichen / lackieren (einseitig)',
    annahme: 'Einseitig angenommen — beidseitig kostet mehr',
    quelle: 'Manfred, 12.09.2026',
  },
  {
    // Dieselbe Lage wie bei der Tür: innen 55,00 €, außen 70,00 €. Wer nur
    // „Fenster lackieren" sagt, meint fast immer innen — außen ist Gerüst
    // und Wetter und wird ausdrücklich gesagt.
    name: 'Fenster streichen/lackieren',
    begriff: /^\s*fenster\s+(?:streichen|lackieren)/iu,
    festgelegt: /innen|au(?:ß|ss)en|rahmen|bank|b(?:ä|ae)nke|leibung|laden|l(?:ä|ae)den|schleif|grundier|\d\s*[x×]|\d\s*[-\s]?fach/iu,
    standard: 'Fenster streichen innen',
    annahme: 'Innenseite angenommen — außen kostet mehr',
    quelle: 'Head of Product Engineering, 12.09.2026 — bitte bestätigen',
  },
  {
    // Die Anstrichzahl war die erste Familie überhaupt, für die es einen
    // Standard gab („2x als Standard angenommen", seit 24.08.). Er stand
    // aber nur in der Mengen-Engine, nicht im Preis-Matching: Wer eine
    // Position von Hand „Wand streichen" nennt, bekam den 1x-Preis von
    // 6,00 € statt 9,50 €. Derselbe Standard, jetzt an beiden Stellen.
    name: 'Wand streichen ohne Anstrichzahl',
    begriff: /^\s*(?:wand|w(?:ä|ae)nde|wandfl(?:ä|ae)che[n]?)\s+streichen/iu,
    festgelegt: /\d\s*[x×]|\d\s*[-\s]?fach|einfach|zweifach|dreifach/iu,
    standard: 'Wand streichen 2x Anstrich',
    annahme: '2x Anstrich angenommen',
    quelle: 'Sandy, 24.08.2026 („klopf fest") — hier auf das Preis-Matching übertragen',
  },
  {
    name: 'Decke streichen ohne Anstrichzahl',
    begriff: /^\s*(?:decke|deckenfl(?:ä|ae)che)\s+streichen/iu,
    festgelegt: /\d\s*[x×]|\d\s*[-\s]?fach|einfach|zweifach|dreifach|spiegel/iu,
    standard: 'Decke streichen 2x Anstrich',
    annahme: '2x Anstrich angenommen',
    quelle: 'Sandy, 24.08.2026 („klopf fest") — hier auf das Preis-Matching übertragen',
  },
  {
    name: 'Fassade streichen ohne Anstrichzahl',
    begriff: /^\s*(?:fassade|fassadenfl(?:ä|ae)che)\s+streichen/iu,
    festgelegt: /\d\s*[x×]|\d\s*[-\s]?fach|einfach|zweifach|dreifach/iu,
    standard: 'Fassade streichen 2x Anstrich',
    annahme: '2x Anstrich angenommen',
    quelle: 'Sandy, 24.08.2026 („klopf fest") — hier auf das Preis-Matching übertragen',
  },

  // ── Boden ───────────────────────────────────────────────────────────────
  {
    // Manfreds zweites Beispiel: „beim Laminat Klick Standard".
    name: 'Laminat verlegen',
    begriff: /^\s*laminat\s+verlegen/iu,
    festgelegt: /schwimmend|verklebt|gro(?:ß|ss)diele|breit|klick/iu,
    standard: 'Laminat verlegen, schwimmend',
    annahme: 'Schwimmend, Standardformat angenommen',
    quelle: 'Manfred, 12.09.2026',
  },
  {
    name: 'Parkett verlegen',
    begriff: /^\s*parkett\s+verlegen/iu,
    festgelegt: /schwimmend|verklebt|massiv|mehrschicht|stab|fischgr(?:ä|ae)t|verband|mosaik|industrie|bambus/iu,
    standard: 'Fertigparkett verlegen schwimmend (Klick-System)',
    annahme: 'Fertigparkett, schwimmend angenommen',
    quelle: 'Head of Product Engineering, 12.09.2026 — bitte bestätigen',
  },
  {
    name: 'Vinyl verlegen',
    begriff: /^\s*vinyl(?:boden)?\s+verlegen/iu,
    festgelegt: /klick|klebe|selbstklebend|nasskleber|schwimmend|verklebt|d(?:ü|ue)nnbett/iu,
    standard: 'Klick-Vinyl (LVT) verlegen schwimmend, Standard',
    annahme: 'Klick-Vinyl, schwimmend angenommen',
    quelle: 'Head of Product Engineering, 12.09.2026 — bitte bestätigen',
  },
  {
    name: 'Teppichboden verlegen',
    begriff: /^\s*teppich(?:boden)?\s+verlegen/iu,
    festgelegt: /gespannt|verklebt|tackern|lose|nagelleiste/iu,
    standard: 'Teppichboden verlegen (gespannt / Tackern auf Nagelleiste)',
    annahme: 'Gespannt angenommen — vollflächig verklebt kostet mehr',
    quelle: 'Head of Product Engineering, 12.09.2026 — bitte bestätigen',
  },

  // ── Estrich ─────────────────────────────────────────────────────────────
  {
    // Manfreds drittes Beispiel: „bei der Dämmung EPS bis 60". Der Fall, an
    // dem sichtbar wurde, dass ein einheitliches Namensmuster allein den
    // allgemeinen Begriff nicht löst.
    name: 'Wärmedämmung verlegen',
    begriff: /^\s*w(?:ä|ae)rmed(?:ä|ae)mmung\s+verlegen/iu,
    festgelegt: /eps|mineralwolle|steinwolle|\d+\s*mm/iu,
    standard: 'Wärmedämmung EPS verlegen, bis 60 mm',
    annahme: 'EPS bis 60 mm angenommen',
    quelle: 'Manfred, 12.09.2026',
  },
]

/**
 * Welche Standardfamilie gilt für diesen Titel — wenn überhaupt?
 *
 * Gibt `null` zurück, sobald der Titel eine Festlegung enthält. Das ist der
 * wichtigere der beiden Fälle: Ein Standard, der eine ausdrückliche Ansage
 * überstimmt, wäre schlimmer als gar keiner.
 */
export function standardFamilie(titel: string): StandardFamilie | null {
  const text = titel ?? ''
  for (const familie of STANDARD_FAMILIEN) {
    if (!familie.begriff.test(text)) continue
    if (familie.festgelegt.test(text)) return null
    return familie
  }
  return null
}
