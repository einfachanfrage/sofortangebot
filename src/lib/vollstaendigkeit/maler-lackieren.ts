import type { BerechnetePosition } from '../mengen/types'
import { hat, anzahlAus, findeRaumImSatz, raumNamenAus, istWandStreichen, raumAusTitel, vorarbeitGiltFuer, auftragGiltFuer } from './helpers'
import type { AuftragsVerstaendnis } from '../auftrags-verstaendnis'

// ── CoS-E-059 / PM-045-C, Eingriff 2 (15.09.2026) ─────────────────────────
//
// Die Bauteile, die in diesem Modul um dieselben Vorarbeiten konkurrieren,
// und die Wörter, mit denen ein Handwerker sie bestellt. Eine Vorarbeit, die
// im Diktat bei EINEM dieser Bauteile steht, darf nicht bei den anderen
// landen — siehe `vorarbeitGiltFuer` in `helpers.ts`.
const TUER = /tür|tuer/i
const FENSTER = /fenster/i
const HEIZKOERPER = /heizkörper|heizkoerper|heizung/i
const SCHLEIFEN = /schleif|schliff/i      // abschleifen, anschleifen, angeschliffen
const GRUNDIEREN = /grundier/i            // grundieren, grundiert, Grundierung

// ── PM-098 / CoS-E-069 Nachtrag (16.09.2026) ──────────────────────────────
//
// Der Lackier-Auftrag selbst — die Wortform, auf die die beiden Auslöser
// unten anspringen. Deckungsgleich mit dem, was `hatTuerenLackieren` und
// `hatFensterLackieren` als Auftrag lesen: die `lackieren`-Kategorie des
// Normalisierers PLUS das „neu streichen", das dort als zweiter Zweig steht.
// Steht im Rohtext keins von beidem, greift die Bremse nicht (Staffelung 1 in
// `auftragGiltFuer`) — dann kommt der Auslöser aus den KI-Signalen.
const LACKIERAUFTRAG = /lackier\w*|lackierung|\black(?:e|en)?\b|lasier\w*|lasur|neu\s+streich\w*/i

// Alle Bauteile, um die es in einem Maler-Diktat beim Lackieren geht. Nennt
// ein Satz das Lackieren zusammen mit EINEM davon, ist es dessen Auftrag —
// nicht der aller anderen, die irgendwo sonst im Diktat vorkommen.
//
// Wand und Decke stehen bewusst mit drin: „Die Wände neu streichen." ist der
// zweite Weg in denselben Fehler, weil `neu streich` derselbe Auslöser ist.
const SOCKELLEISTE = /sockelleiste|fußleiste|fussleiste|scheuerleiste/i
const WAND_DECKE = /wand|wände|waende|decke/i
const TREPPE = /treppe|geländer|gelaender|handlauf/i
const BAUTEILE_AUSSER_TUER = [FENSTER, HEIZKOERPER, SOCKELLEISTE, WAND_DECKE, TREPPE]
const BAUTEILE_AUSSER_FENSTER = [TUER, HEIZKOERPER, SOCKELLEISTE, WAND_DECKE, TREPPE]

// Türen lackieren: Schleifen, Grundieren, 2× Lackieren, Zargen
export function pruefeTuerenLackieren(
  ergaenzt: BerechnetePosition[],
  lower: string,
  v: AuftragsVerstaendnis,
  meta?: { tuerenAnzahl?: number; tuerenAusAufnahme?: number },
): void {
  // Raumbezug aus dem Satz ("im Wohnzimmer die Türen lackieren") → Suffix,
  // damit die Position im Raum landet und nicht unter Allgemein
  const raum = findeRaumImSatz(/tür/i, lower, raumNamenAus(ergaenzt))
  const sfx = raum ? ` — ${raum}` : ''
  // PM-098: Der Auftrag muss der TÜR gelten, nicht irgendeinem Bauteil im
  // selben Diktat. „Die 2 Heizkörper bitte mit lackieren. Ein Fenster, eine
  // Tür." bestellt keine Türlackierung — die Tür ist dort eine Maßangabe.
  const hatTuerenLackieren = /tür|türe|türen/i.test(lower) &&
    (v.hatArbeit('lackieren') || lower.includes('neu streich')) &&
    auftragGiltFuer(TUER, LACKIERAUFTRAG, lower, BAUTEILE_AUSSER_TUER)
  if (!hatTuerenLackieren || hat(ergaenzt, 'türen abschleifen', 'tür abschleifen')) return

  const anzTuerenExplizit = anzahlAus(lower, 'tür', anzahlAus(lower, 'türen', 0))
  const anzZimmerFuerTuer = anzahlAus(lower, 'zimmer', anzahlAus(lower, 'raum', anzahlAus(lower, 'räume', 0)))

  // ── CoS-E-058 / PM-045-A (15.09.2026) ───────────────────────────────────
  //
  // Vorher endete diese Kette bei `1`, sobald im Satz keine Zahl stand:
  // „die Innentüren lackieren" ergab EINE Tür — auch wenn die Aufnahme des
  // Raums vier trägt. Auf einer Wohnung mit vier Innentüren fehlten damit
  // drei Türen in jeder der fünf Positionen unten.
  //
  // Die Zahl war nie verloren, sie kam nur nie hier an: `raeume[].tueren`
  // steht seit jeher in der Extraktion, die Regel bekam aber nur `lower`,
  // `v` und `meta`. Jetzt liegt sie in `meta.tuerenAusAufnahme`.
  //
  // **Reihenfolge, bewusst so und nicht anders:** Das gesprochene Wort
  // gewinnt vor der Aufnahme. Sagt jemand „die zwei Türen streichen",
  // während die Aufnahme vier führt, sind zwei bestellt und zwei gemeint —
  // die Aufnahme ist der Bestand, der Satz ist der Auftrag. Erst wenn der
  // Satz gar keine Zahl nennt, tritt die Aufnahme an die Stelle der
  // bisherigen `1`. Angenommene Öffnungen zählen dabei nicht mit (siehe
  // `oeffnungenAusAufnahme`) — sonst stünde eine Annahme als Menge im
  // Angebot, und das ist genau die Grenze aus PM-023.
  const anzTuerenAufnahme = meta?.tuerenAusAufnahme ?? 0
  const anzTueren = meta?.tuerenAnzahl
    ?? (anzTuerenExplizit > 0 ? anzTuerenExplizit
      : anzTuerenAufnahme > 0 ? anzTuerenAufnahme
      : anzZimmerFuerTuer > 0 ? anzZimmerFuerTuer : 1)
  const ausAufnahme = meta?.tuerenAnzahl === undefined && anzTuerenExplizit === 0 && anzTuerenAufnahme > 0
  // ── CoS-E-065 Punkt 1 (16.09.2026) ──────────────────────────────────────
  //
  // Vorher zweiwertig: alles, was nicht aus der Aufnahme kam, hieß „aus
  // Transkript" — auch die zwei Fälle, in denen im Transkript gar keine Zahl
  // stand. „Die Innentüren lackieren." ohne Raumbestand ergab `1 Tür(en) aus
  // Transkript`; die Eins hat aber niemand gesagt, die setzt die App. Bei den
  // Fenstern steht der dritte Fall 52 Zeilen weiter unten seit CoS-E-058
  // richtig (`fensterQuelle`) — bei den Türen ist er nie nachgezogen worden.
  //
  // Die drei Fälle, in der Reihenfolge, in der die Menge oben entsteht:
  //   1. Zahl im Satz (`anzTuerenExplizit`) oder aus dem Text gezählt
  //      (`meta.tuerenAnzahl` kommt aus `zaehleTueren`)      → aus Transkript
  //   2. Raumbestand (`meta.tuerenAusAufnahme`)              → aus Aufnahme
  //   3. Zimmerzahl → je 1 Tür, sonst die Eins als Rest      → angenommen
  //
  // Fall 3 ist genau der, den `tuerAnnahme` eine Zeile tiefer schon als
  // Annahme ausweist — die Herkunftsangabe daneben hat ihm bis jetzt
  // widersprochen. Auf dem Kundenpapier wird daraus „1 Tür(en) (angenommen)"
  // (`rechenweg-kundentext.ts`, DC-108); „aus Transkript" wäre dort
  // stillschweigend gestrichen worden und die Annahme unsichtbar geblieben.
  const tuerQuelle = ausAufnahme ? 'aus Aufnahme'
    : (meta?.tuerenAnzahl !== undefined || anzTuerenExplizit > 0) ? 'aus Transkript'
    : 'angenommen'
  const tuerAnnahme = !ausAufnahme && anzTuerenExplizit === 0 && anzZimmerFuerTuer > 0 ? [`${anzZimmerFuerTuer} Zimmer → je 1 Tür angenommen`] : []

  // CoS-E-059 / PM-045-C: Anschleifen und Grundieren nur dann, wenn das
  // Diktat sie nicht ausdrücklich einem ANDEREN Bauteil zugeordnet hat.
  const tuerSchleifen = vorarbeitGiltFuer(TUER, SCHLEIFEN, lower, [FENSTER, HEIZKOERPER])
  const tuerGrundieren = vorarbeitGiltFuer(TUER, GRUNDIEREN, lower, [FENSTER, HEIZKOERPER])
  if (tuerSchleifen) {
    ergaenzt.push({ beschreibung: `Türen abschleifen${sfx}`, menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en) ${tuerQuelle}`, annahmen: tuerAnnahme })
  }
  if (tuerGrundieren) {
    ergaenzt.push({ beschreibung: `Türen grundieren${sfx}`, menge: anzTueren, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzTueren} Tür(en)`, annahmen: tuerAnnahme })
  }
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
  meta?: { fensterAnzahl?: number; fensterAusAufnahme?: number },
): void {
  // PM-098: wie bei den Türen — aber nur der BREITE Auslöser bekommt die
  // Bremse. Die drei Zweige darunter nennen das Fenster bereits im selben
  // Atemzug wie die Arbeit („Fenster streichen", „Holzfenster") und sind
  // damit schon die Beauftragung, die PM-098 verlangt. Über sie zu bremsen
  // hieße, „Heizkörper lackieren. Fenster streichen." das Fenster zu nehmen.
  const fensterSelbstGenannt = lower.includes('holzfenster') ||
    /fenster\s+(?:streich|anstrich)/i.test(lower) ||
    (lower.includes('außen') && v.hatArbeit('streichen'))
  const hatFensterLackieren = lower.includes('fenster') &&
    (fensterSelbstGenannt ||
     (v.hatArbeit('lackieren') &&
      auftragGiltFuer(FENSTER, LACKIERAUFTRAG, lower, BAUTEILE_AUSSER_FENSTER))) &&
    !lower.includes('fenster ab')
  if (!hatFensterLackieren || hat(ergaenzt, 'fenster abschleifen')) return

  const raum = findeRaumImSatz(/fenster/i, lower, raumNamenAus(ergaenzt))
  const sfx = raum ? ` — ${raum}` : ''
  // CoS-E-058 / PM-045-A: dieselbe Lücke wie bei den Türen — ohne Zahl im
  // Satz stand hier `1`, auch wenn die Aufnahme drei Fenster führt. Die
  // Reihenfolge ist dieselbe: gesprochene Zahl vor Aufnahme vor `1`.
  const anzFensterText = (meta?.fensterAnzahl ?? 0) > 1 ? meta!.fensterAnzahl! : anzahlAus(lower, 'fenster', 0)
  const anzFensterAufnahme = meta?.fensterAusAufnahme ?? 0
  const anzFenster = anzFensterText > 0 ? anzFensterText : anzFensterAufnahme > 0 ? anzFensterAufnahme : 1
  const fensterQuelle = anzFensterText > 0 ? 'aus Transkript' : anzFensterAufnahme > 0 ? 'aus Aufnahme' : 'angenommen'
  const istOelfarbe = lower.includes('ölfarbe') || lower.includes('oelfarbe') || lower.includes('öl')
  const farbTyp = istOelfarbe ? 'Ölfarbe' : 'Lack'
  const istAußen = lower.includes('außen') || lower.includes('holzfenster')
  const istZweiSeitig = lower.includes('2-seitig') || lower.includes('2 seitig') || lower.includes('2seitig') ||
    lower.includes('zweiseitig') || lower.includes('beidseitig') || lower.includes('beide seiten') ||
    lower.includes('innen und außen') || lower.includes('innen und aussen')
  const anzAnstrich = istZweiSeitig ? anzFenster * 2 : anzFenster
  const zweiSeitigHinweis = istZweiSeitig ? ' (2-seitig)' : ''

  // CoS-E-059 / PM-045-C — das ist der gemessene Fall: „die Türen … müssen
  // vorher angeschliffen und grundiert werden" stand im Türen-Satz, die
  // beiden Zeilen entstanden trotzdem für die Fenster im Satz danach.
  const fensterSchleifen = vorarbeitGiltFuer(FENSTER, SCHLEIFEN, lower, [TUER, HEIZKOERPER])
  const fensterGrundieren = vorarbeitGiltFuer(FENSTER, GRUNDIEREN, lower, [TUER, HEIZKOERPER])
  if (fensterSchleifen) {
    ergaenzt.push({ beschreibung: `Fenster abschleifen${sfx}`, menge: anzFenster, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzFenster} Fenster ${fensterQuelle}`, annahmen: [] })
  }
  if (fensterGrundieren) {
    ergaenzt.push({ beschreibung: `Fenster grundieren${sfx}`, menge: anzFenster, einheit: 'Stück', konfidenz: 'high', berechnungsweg: `${anzFenster} Fenster`, annahmen: [] })
  }
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

  // CoS-E-059 / PM-045-C: dieselbe Regel wie bei Türen und Fenstern. Steht
  // das Anschleifen im Diktat nur beim Türen- oder Fenstersatz, entsteht es
  // hier nicht. Der Anstrich selbst ist der Auftrag und bleibt immer.
  const hzkSchleifen = vorarbeitGiltFuer(HEIZKOERPER, SCHLEIFEN, lower, [TUER, FENSTER])
  const hzkGrundieren = vorarbeitGiltFuer(HEIZKOERPER, GRUNDIEREN, lower, [TUER, FENSTER])
  const schritte: Array<[string, string]> = ([
    ['Heizkörper abschleifen', 'aus Transkript', hzkSchleifen],
    ['Heizkörper grundieren', '', hzkGrundieren],
    ['Heizkörper lackieren (2× Anstrich)', '', true],
  ] as Array<[string, string, boolean]>)
    .filter(([, , gilt]) => gilt)
    .map(([titel, zusatz]) => [titel, zusatz] as [string, string])

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
