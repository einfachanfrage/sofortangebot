import type { BerechnetePosition } from '../mengen/types'
import { hat, anzahlAus, findeRaumImSatz, raumNamenAus, istWandStreichen, raumAusTitel } from './helpers'
import type { AuftragsVerstaendnis } from '../auftrags-verstaendnis'

// Türen lackieren: Schleifen, Grundieren, 2× Lackieren, Zargen
export function pruefeTuerenLackieren(
  ergaenzt: BerechnetePosition[],
  lower: string,
  v: AuftragsVerstaendnis,
  meta?: { tuerenAnzahl?: number },
): void {
  // Raumbezug aus dem Satz ("im Wohnzimmer die Türen lackieren") → Suffix,
  // damit die Position im Raum landet und nicht unter Allgemein
  const raum = findeRaumImSatz(/tür/i, lower, raumNamenAus(ergaenzt))
  const sfx = raum ? ` — ${raum}` : ''
  const hatTuerenLackieren = /tür|türe|türen/i.test(lower) &&
    (v.hatArbeit('lackieren') || lower.includes('neu streich'))
  if (!hatTuerenLackieren || hat(ergaenzt, 'türen abschleifen', 'tür abschleifen')) return

  const anzTuerenExplizit = anzahlAus(lower, 'tür', anzahlAus(lower, 'türen', 0))
  const anzZimmerFuerTuer = anzahlAus(lower, 'zimmer', anzahlAus(lower, 'raum', anzahlAus(lower, 'räume', 0)))
  const anzTueren = meta?.tuerenAnzahl ?? (anzTuerenExplizit > 0 ? anzTuerenExplizit : anzZimmerFuerTuer > 0 ? anzZimmerFuerTuer : 1)
  const tuerAnnahme = anzTuerenExplizit === 0 && anzZimmerFuerTuer > 0 ? [`${anzZimmerFuerTuer} Zimmer → je 1 Tür angenommen`] : []

  ergaenzt.push({ beschreibung: `Türen abschleifen${sfx}`, menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en) aus Transkript`, annahmen: tuerAnnahme })
  ergaenzt.push({ beschreibung: `Türen grundieren${sfx}`, menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en)`, annahmen: tuerAnnahme })
  ergaenzt.push({ beschreibung: `Türen lackieren (2× Anstrich)${sfx}`, menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en)`, annahmen: tuerAnnahme })
  // Katalog-Deckungsaudit 2026-08-31: hieß hier „Türzargen lackieren" (Plural),
  // der Katalogeintrag heißt „Türzarge lackieren" — der Preis-Matcher kam über
  // die Schwelle nicht drüber und die Position stand mit 0,00 € da. Die Menge
  // sagt ohnehin, wie viele es sind.
  ergaenzt.push({ beschreibung: `Türzarge lackieren${sfx}`, menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Zarge(n)`, annahmen: tuerAnnahme })
  if (!hat(ergaenzt, 'türrahmen abkl', 'sockelleisten abkl', 'sockel abkl')) {
    // Vorher: „Sockelleisten abkleben" mit Einheit „Stück". Sockelleisten
    // werden aber in laufenden Metern abgeklebt (so steht es im Katalog und so
    // erzeugt es jeder andere Pfad) — hier gab es gar keinen Umfang, nur eine
    // Türanzahl. Ergebnis: falsche Einheit UND kein Preis. Gemeint war das
    // Abkleben rund um die Tür; genau dafür gibt es „Abkleben
    // Fenster-/Türrahmen" je Stück im Katalog.
    ergaenzt.push({ beschreibung: `Türrahmen abkleben${sfx}`, menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en) → je 1 Rahmen`, annahmen: tuerAnnahme })
  }
}

// Fenster lackieren: Schleifen, Grundieren, 2× Anstrich
export function pruefeFensterLackieren(
  ergaenzt: BerechnetePosition[],
  lower: string,
  v: AuftragsVerstaendnis,
  meta?: { fensterAnzahl?: number },
): void {
  const hatFensterLackieren = lower.includes('fenster') &&
    (v.hatArbeit('lackieren') || lower.includes('holzfenster') ||
     /fenster\s+(?:streich|anstrich)/i.test(lower) ||
     (lower.includes('außen') && v.hatArbeit('streichen') && lower.includes('fenster'))) &&
    !lower.includes('fenster ab')
  if (!hatFensterLackieren || hat(ergaenzt, 'fenster abschleifen')) return

  const raum = findeRaumImSatz(/fenster/i, lower, raumNamenAus(ergaenzt))
  const sfx = raum ? ` — ${raum}` : ''
  const anzFenster = (meta?.fensterAnzahl ?? 0) > 1 ? meta!.fensterAnzahl! : anzahlAus(lower, 'fenster')
  const istOelfarbe = lower.includes('ölfarbe') || lower.includes('oelfarbe') || lower.includes('öl')
  const farbTyp = istOelfarbe ? 'Ölfarbe' : 'Lack'
  const istAußen = lower.includes('außen') || lower.includes('holzfenster')
  const istZweiSeitig = lower.includes('2-seitig') || lower.includes('2 seitig') || lower.includes('2seitig') ||
    lower.includes('zweiseitig') || lower.includes('beidseitig') || lower.includes('beide seiten') ||
    lower.includes('innen und außen') || lower.includes('innen und aussen')
  const anzAnstrich = istZweiSeitig ? anzFenster * 2 : anzFenster
  const zweiSeitigHinweis = istZweiSeitig ? ' (2-seitig)' : ''

  ergaenzt.push({ beschreibung: `Fenster abschleifen${sfx}`, menge: anzFenster, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzFenster} Fenster aus Transkript`, annahmen: [] })
  ergaenzt.push({ beschreibung: `Fenster grundieren${sfx}`, menge: anzFenster, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzFenster} Fenster`, annahmen: [] })
  // Katalog-Deckungsaudit 2026-08-31: hieß „Fenster Lack (2× Anstrich)" —
  // kein Katalogtreffer und holpriges Deutsch auf dem Angebot. Der Farbtyp
  // steht jetzt in der Klammer, wo er die Preiszuordnung nicht mehr stört.
  ergaenzt.push({ beschreibung: `Fenster lackieren (${farbTyp}, 2× Anstrich${zweiSeitigHinweis})${sfx}`, menge: anzAnstrich, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzFenster} Fenster${istZweiSeitig ? ' × 2 Seiten' : ''}`, annahmen: [] })
  if (istAußen && !hat(ergaenzt, 'abdecken umgebung', 'umgebung abdecken')) {
    ergaenzt.push({ beschreibung: 'Abdecken Umgebung', menge: 1, einheit: 'Pauschale', konfidenz: 'high', berechnungsweg: 'Außenarbeiten — Umgebung abdecken', annahmen: [] })
  }
}

// Heizkörper lackieren: Schleifen, Grundieren, 2× Anstrich
export function pruefeHeizkLackieren(
  ergaenzt: BerechnetePosition[],
  // F.2 #8: neu dazu — ohne Meterangabe gehören die Rohre in die Fehlt-Liste
  // statt als erfundene Stück-Position ins Angebot.
  fehlende: string[],
  lower: string,
  v: AuftragsVerstaendnis,
): boolean {
  const hatHeizkLackieren = /heizkörper|heizkoerper|heizung/i.test(lower) &&
    (v.hatArbeit('lackieren') || lower.includes('neu streich'))
  if (!hatHeizkLackieren || hat(ergaenzt, 'heizkörper abschleifen', 'heizkoerper abschleifen')) return false

  const raum = findeRaumImSatz(/heizkörper|heizkoerper|heizung/i, lower, raumNamenAus(ergaenzt))
  const sfx = raum ? ` — ${raum}` : ''
  const jeHzkMatch = lower.match(/je\s+(\d+)\s*(?:stück\s*)?(?:heizkörper|heizkoerper)/i)
  const anzHzkExplizit = !jeHzkMatch ? anzahlAus(lower, 'heizkörper', anzahlAus(lower, 'heizkoerper', 0)) : 0
  const anzZimmer = anzahlAus(lower, 'zimmer', anzahlAus(lower, 'raum', anzahlAus(lower, 'räume', 0)))
  const anzRaeumeAusPos = ergaenzt.filter(p => istWandStreichen(p.beschreibung)).length
  const anzZimmerEff = anzZimmer > 0 ? anzZimmer : anzRaeumeAusPos > 0 ? anzRaeumeAusPos : 0
  let anzHzk: number
  if (jeHzkMatch) {
    anzHzk = parseInt(jeHzkMatch[1]) * Math.max(anzZimmerEff, 1)
  } else {
    anzHzk = anzHzkExplizit > 0 ? anzHzkExplizit : anzZimmerEff > 0 ? anzZimmerEff : 1
  }
  const hzkAnnahme = !jeHzkMatch && anzHzkExplizit === 0 && anzZimmerEff > 0 ? [`${anzZimmerEff} Zimmer → je 1 Heizkörper angenommen`] : []

  // ── DC-091 / TN-104, 13.09.2026 ────────────────────────────────────────
  //
  // Kommt die Stückzahl aus der ZAHL DER RÄUME („je ein Heizkörper", oder
  // die Annahme „n Zimmer → je 1"), dann gehört sie nicht in einen Raum,
  // sondern in jeden.
  //
  // Vorher stand `findeRaumImSatz` davor und fand bei „Flur und Wohnzimmer,
  // … je ein Heizkörper lackieren" den **Flur** — den ersten Raum im Satz.
  // Ergebnis auf dem Kundenpapier: unter „Flur" zwei Heizkörper, unter
  // „Wohnzimmer" keiner. Die Summe stimmte, die Zuordnung nicht — und in
  // einem nach Räumen gegliederten Angebot liest der Kunde genau die.
  //
  // Derselbe Fehler wie bei der Deckengrundierung (CoS-E-026): Eine
  // abgeleitete Position nimmt den Raum der ERSTEN Quelle statt ihren
  // eigenen. Deshalb hier dieselbe Reparatur — eine Position je Raum.
  //
  // Ein ausdrücklich genannter Raum gewinnt weiter, aber nur, wenn die Zahl
  // NICHT aus der Raumzahl kommt: „im Bad zwei Heizkörper" ist eine Ansage,
  // „Flur und Wohnzimmer … je einer" ist keine über den Flur.
  const raeumeMitWand = ergaenzt
    .filter(p => istWandStreichen(p.beschreibung))
    .map(p => raumAusTitel(p.beschreibung))
    .filter((r): r is string => Boolean(r))
  const jeRaum = jeHzkMatch
    ? parseInt(jeHzkMatch[1])
    : (anzHzkExplizit === 0 && anzZimmerEff > 0 ? 1 : null)

  const schritte: Array<[string, string]> = [
    ['Heizkörper abschleifen', 'aus Transkript'],
    ['Heizkörper grundieren', ''],
    ['Heizkörper lackieren (2× Anstrich)', ''],
  ]

  if (jeRaum !== null && raeumeMitWand.length > 1) {
    for (const raumName of raeumeMitWand) {
      for (const [titel] of schritte) {
        ergaenzt.push({
          beschreibung: `${titel} — ${raumName}`,
          menge: jeRaum,
          einheit: 'Stück',
          konfidenz: 'high',
          berechnungsweg: `${jeRaum} Heizkörper in ${raumName}`,
          annahmen: hzkAnnahme,
        })
      }
    }
  } else {
    for (const [titel, zusatz] of schritte) {
      ergaenzt.push({
        beschreibung: `${titel}${sfx}`,
        menge: anzHzk,
        einheit: 'Stück',
        konfidenz: 'high',
        berechnungsweg: `${anzHzk} Heizkörper${zusatz ? ' ' + zusatz : ''}`,
        annahmen: hzkAnnahme,
      })
    }
  }

  // ── F.2 #8 (Prüfmeister, 12.09.2026) ────────────────────────────────────
  //
  // Zwei Änderungen, beide aus derselben Zeile seiner Liste:
  //
  // 1. **Titel.** Der Katalog sagt `Rohrleitungen lackieren` (9,00 €/lfdm).
  //    Die Engine sagte „Rohre lackieren" und fand deshalb gar nichts —
  //    0,00 € im Angebot, obwohl der Preis dasteht.
  //
  // 2. **Der Stück-Zweig fliegt raus.** *„Rohre rechnet man in lfdm."*
  //    Ohne Meterangabe wurde bisher „1 Stück pro Heizkörper" erfunden und
  //    als Stück-Position ausgegeben — eine Einheit, die der Katalog für
  //    diese Arbeit nicht führt, mit einer Menge, die niemand gesagt hat.
  //    Zwei Fehler in einer Zeile: erfundene Menge UND falsche Einheit.
  //    Jetzt steht die Position sichtbar in `fehlende`, mit der Bitte um die
  //    Meter. Das ist Manfreds Einheiten-Eimer und PM-018 in einem.
  const hatRohre = lower.includes('rohr') || lower.includes('heizungsrohr') || lower.includes('rohre')
  if (hatRohre && !hat(ergaenzt, 'rohr lackier', 'rohre lackier', 'rohrleitungen lackier')) {
    const rohrM = anzahlAus(lower, 'rohr', anzahlAus(lower, 'rohre', 0))
    if (rohrM > 0) {
      ergaenzt.push({ beschreibung: 'Rohrleitungen lackieren', menge: rohrM, einheit: 'lfdm', konfidenz: 'medium', berechnungsweg: `${rohrM} lfdm aus Transkript`, annahmen: [] })
    } else {
      fehlende.push('Rohrleitungen lackieren (laufende Meter prüfen)')
    }
  }

  return true // hatHeizkLackieren für Caller (verhindert abkleben-Block)
}
