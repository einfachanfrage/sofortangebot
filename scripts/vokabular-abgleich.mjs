#!/usr/bin/env node
/**
 * Fährt den Abgleich „Engine-Vokabular ↔ Standardkatalog" nach.
 *
 * Hintergrund (Prüfmeister, 11.09.2026, siehe `docs/vokabular-abgleich.md`):
 * Der erste Abgleich wurde von Hand zusammengesucht — 106 Titel, 14 Lücken.
 * Beim Nachrechnen kamen 110 Titel und 23 Lücken heraus, und drei Aussagen
 * waren falsch (u. a. „im Standardkatalog gibt es keinen Sperranstrich" —
 * den gibt es, sogar doppelt). Eine Zahl, die niemand nachrechnen kann,
 * veraltet still. Deshalb dieses Skript: Es zieht die Positionstitel aus dem
 * Quelltext der Engine, schickt jeden durch DENSELBEN Preis-Matcher wie der
 * Angebots-Endpunkt und zeigt, was ohne Preis dasteht.
 *
 * Aufruf:
 *   node scripts/vokabular-abgleich.mjs           Lücken + knappe Treffer
 *   node scripts/vokabular-abgleich.mjs --alle    zusätzlich alle guten Treffer
 *   node scripts/vokabular-abgleich.mjs --md      als Markdown-Tabellen
 *
 * Grenzen, die man kennen muss, damit man dem Ergebnis richtig traut:
 *
 * 1. Gezählt werden nur Positionen mit EIGENER Einheit (`beschreibung:` +
 *    `einheit:` im selben Objekt). Die Strings aus `fehlende.push(...)` sind
 *    Hinweistexte für den Handwerker, keine bepreisten Positionen — wer sie
 *    mitzählt, erfindet Lücken.
 * 2. Titel, die die Engine vollständig aus Variablen baut, lassen sich hier
 *    nicht auflösen und fallen raus. Sie werden am Ende gezählt, damit die
 *    Lücke in der Methode sichtbar bleibt statt zu verschwinden.
 *    (15.09.2026) Der Zähler stand still auf 6 und wuchs mit jedem neuen
 *    Ternär im Titel. Er ist jetzt 0: `literal()` liest verschachtelte
 *    Template-Literale zu Ende, der Raum-Anhang als Ternär wird wie jeder
 *    andere Raum-Anhang weggeworfen, und `${titel}` / `${zoneZusatz}` stehen
 *    in VARIANTEN. Steigt der Zähler wieder, fehlt dort ein Eintrag — das ist
 *    dann eine echte Lücke und keine Lesefehler mehr.
 * 3. (erledigt am 12.09.2026) `gewerkFuerPosition` lag hier als Kopie, weil
 *    sie im Next.js-Endpunkt neben `next/server` stand. Sie ist jetzt in
 *    `src/lib/positions-gewerk.ts` und wird importiert — eine Quelle, keine
 *    Kopie, die veralten kann.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createJiti } from 'jiti'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HIER, '..')
const jiti = createJiti(import.meta.url, { alias: { '@': path.join(ROOT, 'src') } })

const { findePreisposition } = await jiti.import(path.join(ROOT, 'src/lib/preis-matcher.ts'))
const { DEFAULT_PRICES } = await jiti.import(path.join(ROOT, 'src/lib/default-prices.ts'))
const { preisKategoriePasstZuGewerk } = await jiti.import(path.join(ROOT, 'src/lib/default-price-selection.ts'))
const { verlegeartZusatz } = await jiti.import(path.join(ROOT, 'src/lib/verlegeart.ts'))
const { ausgleichsmasseTitel } = await jiti.import(path.join(ROOT, 'src/lib/vollstaendigkeit/boden-basis.ts'))

const alle = process.argv.includes('--alle')
const alsMarkdown = process.argv.includes('--md')
// (21.09.2026, Prüfmeister) Themenspeicher Punkt 20 fragte, wie viele
// Engine-Titel auf zwei verschieden teure Katalogzeilen passen. Das zählte
// der Abgleich nicht — er kannte nur „hat einen Preis / hat keinen". Mit
// --zweittreffer zählt er es. Festgehalten als Test in
// `pruefmeister-gleichstand-katalog.test.ts` (PM-138).
const zweittreffer = process.argv.includes('--zweittreffer')

// `gewerkFuerPosition` stand bis zum 12.09.2026 im Next.js-Endpunkt und war
// von hier nicht importierbar — deshalb lag an dieser Stelle eine KOPIE, mit
// dem Hinweis im Kopfkommentar, dass sie veralten kann. Sie liegt jetzt in
// `src/lib/positions-gewerk.ts` und wird echt importiert. Punkt 3 der Grenzen
// oben ist damit erledigt.
const { gewerkFuerPosition } = await jiti.import(path.join(ROOT, 'src/lib/positions-gewerk.ts'))

// (15.09.2026) `fliesen` ist dazugekommen. Es stand nicht drin, weil der erste
// Abgleich von Maler und Boden handelte — aber das Gewerk ist in
// `gewerke-config.ts` auf `aktiv: true` gesetzt, ein Fliesenleger bekommt es
// also angeboten. Ein Abgleich, der „Engine ↔ Standardkatalog" heißt und zwei
// von sechs aktiven Gewerken liest, prüft still weniger als er behauptet —
// derselbe Fehler wie beim Zähler „nicht prüfbar", nur eine Etage höher.
// Was dabei herauskam, steht als Fall PM-060.
const QUELLEN = [
  'src/lib/mengen/gewerke/maler.ts',
  'src/lib/mengen/gewerke/boden.ts',
  'src/lib/mengen/gewerke/fliesen.ts',
  'src/lib/mengen/gewerke/sockelleisten.ts',
  'src/lib/mengen/gewerke/vob-uebermessung.ts',
  'src/lib/mengen/gewerke/trockenbau.ts',
  'src/lib/mengen/gewerke/elektro.ts',
  'src/lib/mengen/gewerke/sanitaer.ts',
  ...readdirSync(path.join(ROOT, 'src/lib/vollstaendigkeit'))
    .filter(f => /^(maler|boden|fliesen|trockenbau|elektro|sanitaer)/.test(f) && f.endsWith('.ts'))
    .map(f => 'src/lib/vollstaendigkeit/' + f),
]

// Platzhalter, die sich sinnvoll füllen lassen. Der Raumname wird abgeschnitten
// (im Angebot steht er hinter dem Gedankenstrich, in der Preisdatenbank nie),
// die Anstrichzahl bekommt einen plausiblen Wert.
const FUELLUNG = [
  // ZUERST: Raum-Anhang als Ternär im Template — `${raum ? ` — ${raum}` : ''}`.
  // Muss vor den Einzelplatzhaltern stehen, sonst ist das `${raum}` darin schon
  // ersetzt und der Ternär nicht mehr erkennbar. Im Katalog steht der Raum nie,
  // also weg damit. Lesbar ist die Stelle erst, seit literal() verschachtelte
  // Template-Literale zu Ende liest (15.09.2026).
  [/\$\{[\w$.]+\s*\?\s*`\s*[—–-]\s*\$\{[\w$.]+\}`\s*:\s*''\}/g, ''],
  // `${ab.bereich ?? 'Bereich'}` — Raumname mit Ersatzwert. Derselbe Anhang,
  // dritte Schreibweise; muss ebenfalls vor den Einzelplatzhaltern stehen.
  [/\$\{[\w$.]+\s*\?\?\s*'[^']*'\}/g, '§RAUM§'],
  [/\$\{(?:name|raum|raumName|wName)\}/g, '§RAUM§'],
  [/\$\{(?:zoneLabel|wandLabel)\}/g, 'Wand streichen 2x'],
  [/\$\{anstriche[A-Za-z]*\}/g, '2'],
  [/\$\{wAnstriche\}/g, '2'],
  // Reine Raum-/Anhang-Platzhalter: im Titel steht dann nichts.
  [/\$\{(?:raumSuffix|sfx|suffix|flaechenTeil|zweiSeitigHinweis|verschnittSuffix)\}/g, ''],
  // Funktionsaufruf im Template → auf den Platzhalternamen zurückführen,
  // damit die Variantenexpansion darüber laufen kann.
  [/\$\{verlegeartZusatz\([^}]*\)\}/g, '${verlegeart}'],
]

// ── Manfred, 12.09.2026 ───────────────────────────────────────────────────
//
// „Die 26 Titel aus Variablen sind nicht die Restlücke der Methode, die sind
// der Kern vom Boden. Wenn da einer ‚Vinyl Klick verlegen' auf ‚Vinyl
// vollflächig verkleben' trifft, ist das der Teppich-verklebt-Fehler in groß.
// Jemand setzt sich eine Stunde hin und schreibt für jedes Label die
// möglichen Werte aus. Es sind ja keine tausend."
//
// Er hat recht. Hier stehen sie. Jede Liste ist aus dem Code abgeschrieben,
// nicht ausgedacht — die Quelle steht dabei. Kommt dort ein Wert dazu,
// gehört er hier hin, sonst prüft das Skript still weniger als es behauptet.
const VARIANTEN = {
  // src/lib/mengen/gewerke/boden.ts → belagLabel()
  label: ['Bodenbelag', 'Klick-Vinyl', 'Vinyl-Boden', 'Laminat', 'Fertigparkett',
    'Kork', 'Linoleum', 'Teppichboden', 'Nadelvlies-Teppichboden'],
  // src/lib/boden-normalisierer.ts → erkenneBelagName() + BELAG_BEZEICHNUNG
  spezName: ['Klick-Vinyl', 'Designboden', 'Vinyl-Boden', 'Vinyl / Designboden',
    'Nadelvlies-Teppichboden', 'Teppichboden', 'Teppich', 'Fertigparkett',
    'Eichenparkett', 'Parkett', 'Laminat', 'Kork', 'Linoleum', 'Bodenbelag'],
  belagName: ['Klick-Vinyl', 'Designboden', 'Vinyl-Boden', 'Teppichboden',
    'Eichenparkett', 'Parkett', 'Laminat', 'Kork', 'Linoleum', 'Belag'],
  // src/lib/mengen/gewerke/boden.ts → MUSTER_KATALOG
  'musterPreis.aufpreisTitel': ['Aufpreis Fischgrät-Verlegemuster',
    'Aufpreis Diagonalverlegung', 'Aufpreis Diagonalverlegung Vinyl',
    'Aufpreis Diagonalverlegung Laminat'],
  // src/lib/vollstaendigkeit/maler-tapete.ts
  tapetenTyp: ['Raufaser', 'Malervlies', 'Vliestapete', 'Tapete'],
  fassadeFarbTyp: ['Silikatfarbe', 'Dispersionsfarbe', 'Fassadenfarbe'],
  // src/lib/vollstaendigkeit/boden-sonder.ts
  versName: ['Versiegelung', 'Parkettlack versiegeln'],
  i: ['1', '2', '3'],
  // src/lib/vollstaendigkeit/maler-extras.ts → qStufe()
  qLevel: ['Q2', 'Q3', 'Q4'],
  // src/lib/vollstaendigkeit/maler-lackieren.ts
  farbTyp: ['Ölfarbe', 'Lack'],
  // src/lib/vollstaendigkeit/maler-lackieren.ts:136 → `schritte`. Der einzige
  // Ort in den QUELLEN, an dem `${titel}` steht; die drei Werte sind von dort
  // abgeschrieben. Kommt ein Schritt dazu, gehört er hier hin.
  titel: ['Heizkörper abschleifen', 'Heizkörper grundieren',
    'Heizkörper lackieren (2× Anstrich)'],
  // src/lib/mengen/gewerke/maler.ts:421 → `zoneZusatz`. Zone und Farbe kommen
  // als freier Text aus dem Diktat, es gibt also keine Liste zum Abschreiben.
  // Nachgemessen (15.09.2026): Der Klammerzusatz bewegt den Treffer nicht —
  // „Wand streichen 2x", „… (Zone oben)" und „… (Blau, Zone oben)" landen alle
  // auf „Wand streichen 2x Anstrich", 9,50 €/m², Score 0,94. Deshalb hier zwei
  // Vertreter statt einer erfundenen Vollliste; festgehalten als Test in
  // `pm-vokabular-varianten.test.ts`.
  zoneZusatz: [' (Zone oben)', ' (Blau, Zone oben)'],
  // mmStr gibt es nicht mehr: Die Ausgleichsmasse baut ihren Titel jetzt in
  // ausgleichsmasseTitel() zusammen und steht deshalb unten in HAND_TITEL —
  // wieder gefragt statt abgeschrieben.
  // src/lib/verlegeart.ts → VerlegeartZusatz. Nicht abgeschrieben, sondern
  // aus dem Modul geholt (siehe verlegearten() unten) — eine Liste, die man
  // von Hand nachzieht, veraltet still.
  verlegeart: ['', ' schwimmend', ' vollflächig verklebt'],
}

// ── Die Verlegeart, echt statt abgeschrieben ──────────────────────────────
//
// G.2 hat die Verlegeart in die Titel gebracht. Damit steht in `boden.ts` und
// `boden-basis.ts` ein FUNKTIONSAUFRUF im Template. Den kann das Skript nicht
// statisch auflösen — und tut es nicht: Es fragt `verlegeartZusatz()` selbst,
// mit den drei Diktat-Lagen, die es gibt (nichts gesagt / verklebt gesagt /
// Klick gesagt). Was dabei herauskommt, ist genau das, was die Engine
// schreibt. Kommt in verlegeart.ts ein Fall dazu, taucht er hier von selbst
// auf, ohne dass jemand daran denkt.
const DIKTAT_LAGEN = ['', 'vollflächig verklebt', 'klick-system schwimmend']
function verlegearten(label) {
  return [...new Set(DIKTAT_LAGEN.map(text => verlegeartZusatz(label, text)))]
}

// Der Belag-Titel in boden.ts:283 ist ein Template IM Template
// (`${musterPreis?.ersatzTitel ?? `${label} verlegen`}`). Das liest kein
// Skript statisch aus — die beiden Ersatztitel stehen deshalb hier von Hand,
// wörtlich aus MUSTER_KATALOG.
const HAND_TITEL = [
  { titel: 'Designbelag im Fischgrätmuster kleben', einheit: 'm²', quelle: 'mengen/gewerke/boden.ts (MUSTER_KATALOG)' },
  { titel: 'Laminat im Fischgrätmuster verlegen', einheit: 'm²', quelle: 'mengen/gewerke/boden.ts (MUSTER_KATALOG)' },
  // src/lib/vollstaendigkeit/boden-basis.ts → ausgleichsmasseTitel().
  // Die Stärken stehen im Diktat; hier je ein Vertreter pro Staffelstufe,
  // plus „nichts gesagt" und ein Wert über der Staffel.
  ...[null, 2, 8, 25, 45].map(mm => ({
    titel: ausgleichsmasseTitel(mm), einheit: 'm²',
    quelle: 'vollstaendigkeit/boden-basis.ts (ausgleichsmasseTitel)',
  })),
  ...VARIANTEN.label.flatMap(l => verlegearten(l).map(v => ({
    titel: `${l} verlegen${v}`, einheit: 'm²', quelle: 'mengen/gewerke/boden.ts (belagLabel)',
  }))),
]

/**
 * Kombinationen wegwerfen, die die Engine gar nicht schreiben kann.
 *
 * Belag und Verlegeart werden unabhängig expandiert, also entsteht auch
 * `Laminat verlegen vollflächig verklebt` — Laminat wird aber nie verklebt,
 * und `verlegeartZusatz()` gibt das auch nie zurück. Solche Fassungen als
 * Lücke zu zählen wäre genau der Fehler, den der Prüfmeister am ersten
 * Abgleich von Hand nachgewiesen hat: erfundene Lücken in der Liste.
 */
const ALLE_LABEL = [...new Set([...VARIANTEN.label, ...VARIANTEN.spezName])]
function moeglich(fassung) {
  const treffer = /^(.+?) verlegen( schwimmend| vollflächig verklebt)?(?= |$)/.exec(fassung)
  if (!treffer) return true
  const label = treffer[1]
  if (!ALLE_LABEL.includes(label)) return true
  return verlegearten(label).includes(treffer[2] ?? '')
}

/** Expandiert einen Titel mit bekannten Platzhaltern in alle echten Fassungen. */
function variantenAus(titel) {
  let fassungen = [titel]
  for (const [platzhalter, werte] of Object.entries(VARIANTEN)) {
    const muster = new RegExp('\\$\\{' + platzhalter.replace('.', '\\.').replace('?', '\\?') + '\\}', 'g')
    if (!fassungen.some(f => muster.test(f))) continue
    fassungen = fassungen.flatMap(f => werte.map(w => f.replace(new RegExp(muster.source, 'g'), w)))
  }
  return fassungen.filter(moeglich)
}

/**
 * Liest ab Position i ein '…', "…" oder `…`-Literal.
 *
 * (15.09.2026) Bei einem Template-Literal werden `${ … }` mitgezählt: Steht im
 * Ausdruck selbst ein Template — `${raum ? ` — ${raum}` : ''}` —, dann ist der
 * Backtick davor KEIN Ende. Bis heute brach der Leser dort ab und lieferte
 * einen Rest wie `Voranstrich / Grundierung${raum ?` zurück, der als „Titel aus
 * Variablen, nicht prüfbar" gezählt wurde. Das war keine Grenze der Methode,
 * sondern ein Lesefehler: Die Titel sind prüfbar, sie wurden nur nie geprüft.
 */
function literal(quelltext, i) {
  const anfuehrung = quelltext[i]
  if (!['\'', '"', '`'].includes(anfuehrung)) return null
  let text = ''
  let tiefe = 0
  for (let j = i + 1; j < quelltext.length; j++) {
    const zeichen = quelltext[j]
    if (zeichen === '\\') { text += quelltext[j + 1]; j++; continue }
    if (anfuehrung === '`') {
      if (zeichen === '$' && quelltext[j + 1] === '{') { tiefe++; text += '${'; j++; continue }
      if (zeichen === '}' && tiefe > 0) { tiefe--; text += '}'; continue }
      if (zeichen === '`' && tiefe > 0) {
        const innen = literal(quelltext, j)
        if (!innen) return null
        text += quelltext.slice(j, innen.ende + 1)
        j = innen.ende
        continue
      }
    }
    if (zeichen === anfuehrung) return { text, ende: j }
    text += zeichen
  }
  return null
}

const gefunden = new Map()
let ungeloesteTitel = 0

for (const rel of QUELLEN) {
  const quelltext = readFileSync(path.join(ROOT, rel), 'utf8')
  const muster = /beschreibung:\s*/g
  let treffer
  while ((treffer = muster.exec(quelltext))) {
    const lit = literal(quelltext, treffer.index + treffer[0].length)
    if (!lit) continue
    // Die Einheit steht im selben Objektliteral, meist ein paar Zeichen weiter.
    const einheit = /einheit:\s*'([^']*)'/.exec(quelltext.slice(lit.ende, lit.ende + 400))?.[1]
    if (!einheit) continue

    let roh = lit.text
    for (const [regel, wert] of FUELLUNG) roh = roh.replace(regel, wert)
    roh = roh.replace(/\s*[—–-]\s*§RAUM§\s*$/, '').trim()

    for (const fassung of variantenAus(roh)) {
      const titel = fassung.replace(/\s+/g, ' ').trim()
      // Verschachtelte Template-Literale (`${a ?? `${b} verlegen`}`) lassen sich
      // statisch nicht auflösen — der Leser bricht dort mitten im Ausdruck ab.
      // Solche Reste zählen als „nicht prüfbar", statt als Titel durchzurutschen.
      if (!titel || titel.includes('§RAUM§') || titel.includes('${')) {
        ungeloesteTitel++
        continue
      }
      const schluessel = `${titel}|${einheit}`
      if (!gefunden.has(schluessel)) gefunden.set(schluessel, { titel, einheit, quellen: new Set() })
      gefunden.get(schluessel).quellen.add(rel.replace('src/lib/', ''))
    }
  }
}

for (const eintrag of HAND_TITEL) {
  const schluessel = `${eintrag.titel}|${eintrag.einheit}`
  if (!gefunden.has(schluessel)) gefunden.set(schluessel, { ...eintrag, quellen: new Set([eintrag.quelle]) })
}

const zeilen = [...gefunden.values()].map(eintrag => {
  const gewerk = gewerkFuerPosition(eintrag.titel, undefined)
  const katalog = DEFAULT_PRICES
    .filter(preis => preisKategoriePasstZuGewerk(preis.category, gewerk))
    .map((preis, i) => ({ id: `standard-${i}`, ...preis }))
  const treffer = findePreisposition(eintrag.titel, eintrag.einheit, katalog)
  return {
    ...eintrag,
    quellen: [...eintrag.quellen].join(', '),
    score: treffer ? Number(treffer.score.toFixed(2)) : null,
    katalogTitel: treffer?.position.title ?? null,
    katalogPreis: treffer?.position.unit_price ?? null,
    katalogEinheit: treffer?.position.unit ?? null,
  }
}).sort((a, b) => (a.score ?? -1) - (b.score ?? -1) || a.titel.localeCompare(b.titel, 'de'))

// „Knapp" ist die Schwelle des ersten Abgleichs: über der Matcher-Schwelle
// (0,62), aber unter 0,75 — da steht ein Preis, und keiner weiß, ob der
// richtige. Gefährlicher als eine Lücke, weil unsichtbar.
const ohnePreis = zeilen.filter(z => z.score === null)
const knapp = zeilen.filter(z => z.score !== null && z.score < 0.75)
const gut = zeilen.filter(z => z.score !== null && z.score >= 0.75)

const euro = wert => wert.toFixed(2).replace('.', ',') + ' €'

function tabelle(titel, eintraege, mitTreffer) {
  if (eintraege.length === 0) return
  if (alsMarkdown) {
    console.log(`\n### ${titel} (${eintraege.length})\n`)
    console.log(mitTreffer ? '| Score | Engine sagt | Einheit | Katalog-Treffer |' : '| Engine sagt | Einheit | Quelle |')
    console.log(mitTreffer ? '|---|---|---|---|' : '|---|---|---|')
    for (const z of eintraege) {
      console.log(mitTreffer
        ? `| ${z.score.toFixed(2)} | ${z.titel} | ${z.einheit} | ${z.katalogTitel} — ${euro(z.katalogPreis)}/${z.katalogEinheit} |`
        : `| ${z.titel} | ${z.einheit} | ${z.quellen} |`)
    }
    return
  }
  console.log(`\n${titel} (${eintraege.length})`)
  console.log('-'.repeat(titel.length + 6))
  for (const z of eintraege) {
    console.log(mitTreffer
      ? `  ${z.score.toFixed(2)}  ${z.titel} [${z.einheit}]\n        → ${z.katalogTitel} — ${euro(z.katalogPreis)}/${z.katalogEinheit}`
      : `  ${z.titel} [${z.einheit}]   (${z.quellen})`)
  }
}

// (23.09.2026, Prüfmeister) `--json` gibt die gemessene Liste maschinenlesbar
// aus, damit eine zweite Messung sie nicht abschreiben muss. Abgeschriebene
// Listen veralten still — derselbe Grund, aus dem es dieses Skript gibt.
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(zeilen.map(z => ({
    titel: z.titel, einheit: z.einheit, score: z.score,
    katalogTitel: z.katalogTitel, katalogPreis: z.katalogPreis, katalogEinheit: z.katalogEinheit,
  })), null, 1))
  process.exit(0)
}

console.log(`\nVokabular-Abgleich Engine ↔ Standardkatalog (${new Date().toISOString().slice(0, 10)})`)
console.log(`  Engine-Titel mit eigener Einheit : ${zeilen.length}`)
console.log(`  davon ohne Preis                 : ${ohnePreis.length}`)
console.log(`  davon knapp (Score < 0,75)       : ${knapp.length}`)
console.log(`  gute Treffer (Score >= 0,75)     : ${gut.length}`)
console.log(`  Titel aus Variablen, nicht prüfbar: ${ungeloesteTitel}`)

tabelle('OHNE PREIS — im Angebot steht 0,00 €, Versand gesperrt', ohnePreis, false)
tabelle('KNAPPE TREFFER — es steht ein Preis da, nur vielleicht der falsche', knapp, true)
if (alle) tabelle('GUTE TREFFER — trotzdem durchsehen: hoher Score heißt nicht richtig', gut, true)
else console.log(`\n(${gut.length} gute Treffer nicht gezeigt — mit --alle anhängen.)`)
console.log('')

// ── Zweittreffer: wo die REIHENFOLGE im Katalog den Preis entscheidet ─────
//
// Gefährlich ist nicht „zwei Zeilen, zwei Preise" — das ist häufig und meist
// harmlos, weil ein deutlich besserer Treffer gewinnt. Gefährlich ist die
// engere Form: mehrere Zeilen teilen sich den HÖCHSTEN Score, ihre Preise
// sind verschieden, und KEINE heißt so wie der Engine-Titel. Dann gewinnt
// die Zeile, die im Katalog des Betriebs zufällig oben steht — zwei Betriebe
// bekommen aus demselben Diktat verschiedene Preise.
//
// Die Bedingung „keine heißt so wie der Titel" ist nicht ausgedacht, sondern
// gemessen: `Wände spachteln Q4` teilt sich Score 1,00 mit `Fläche spachteln`
// (9,00 € statt 22,00 €) und kippt trotzdem NICHT, weil es die
// gleichlautende Zeile gibt.
if (zweittreffer) {
  const gleich = (a, b) => a.toLowerCase().replace(/\s+/g, ' ').trim() === b.toLowerCase().replace(/\s+/g, ' ').trim()
  const scharf = []
  let geschuetzt = 0
  for (const eintrag of zeilen) {
    if (eintrag.score === null) continue
    const gewerk = gewerkFuerPosition(eintrag.titel, undefined)
    const katalog = DEFAULT_PRICES
      .filter(preis => preisKategoriePasstZuGewerk(preis.category, gewerk))
      .map((preis, i) => ({ id: `standard-${i}`, ...preis }))
    const erst = findePreisposition(eintrag.titel, eintrag.einheit, katalog)
    if (!erst) continue
    const oben = [erst.position]
    let rest = katalog
    for (let runde = 0; runde < 10; runde++) {
      rest = rest.filter(preis => preis.title !== oben[oben.length - 1].title)
      const weiter = findePreisposition(eintrag.titel, eintrag.einheit, rest)
      if (!weiter || Math.abs(weiter.score - erst.score) > 1e-9) break
      oben.push(weiter.position)
    }
    if (oben.length < 2) continue
    const preise = [...new Set(oben.map(p => p.unit_price))]
    if (preise.length < 2) continue
    if (oben.some(p => gleich(p.title, eintrag.titel))) { geschuetzt++; continue }
    scharf.push({ ...eintrag, oben, spanne: (Math.max(...preise) - Math.min(...preise)) / Math.min(...preise) })
  }
  scharf.sort((a, b) => b.spanne - a.spanne)
  console.log(`\nGLEICHSTAND AN DER SPITZE — die Katalogreihenfolge entscheidet den Preis`)
  console.log(`  betroffene Engine-Titel          : ${scharf.length}`)
  console.log(`  durch gleichlautende Zeile geschützt: ${geschuetzt}`)
  console.log('-'.repeat(72))
  for (const s of scharf) {
    console.log(`\n  +${(s.spanne * 100).toFixed(0)} %  ${s.titel} [${s.einheit}]  ·  Score ${s.score.toFixed(2)} auf ${s.oben.length} Zeilen`)
    for (const p of s.oben) console.log(`        ${euro(p.unit_price).padStart(10)}  ${p.title}`)
  }
  console.log('')
}

// ── Katalogsprache: was von diesen Titeln auf dem KUNDENPAPIER landet ─────
//
// (23.09.2026, Prüfmeister) Themenspeicher Punkt 13. PM-122 entschied den
// Einzelfall — kein Schrägstrich auf dem Kundenpapier — und machte damit eine
// Klasse auf: Der Engine-Titel IST der gedruckte Titel, es gibt keine zweite,
// kundenfreundliche Fassung dazwischen. Jedes Klammerzeichen, jeder
// Schrägstrich und jede Q-Stufe, die hier steht, steht auch auf dem Angebot,
// das der Betrieb seinem Kunden schickt. Diese Zählung sagt, wie groß die
// Klasse ist — sie entscheidet nichts. Was davon umbenannt gehört, gehört
// dem Designer und mir gemeinsam.
if (process.argv.includes('--katalogsprache')) {
  const MARKER = [
    ['Schrägstrich', /\//, 'PM-122: entschieden — gehört nicht aufs Kundenpapier'],
    ['Klammerzusatz', /\([^)]*\)/, 'Fachzusatz in Klammern'],
    ['Q-Stufe', /\bQ[1-4]\b/, 'Norm-Kürzel ohne Erklärung'],
    ['Mal-Zeichen', /\d\s*[×x]\b/, '„2× Anstrich" — Katalogschreibweise'],
    ['Abkürzung', /\b(?:GK|CW|UW|inkl\.|ggf\.|bzw\.|zzgl\.|o\. ?g\.|z\. ?B\.)\b/, 'Kürzel aus der Preisliste'],
  ]
  const betroffen = new Map()
  for (const z of zeilen) {
    for (const [name, muster] of MARKER) {
      if (!muster.test(z.titel)) continue
      if (!betroffen.has(name)) betroffen.set(name, [])
      betroffen.get(name).push(z)
    }
  }
  const eindeutig = new Set()
  for (const liste of betroffen.values()) for (const z of liste) eindeutig.add(z.titel)
  console.log(`\nKATALOGSPRACHE IM GEDRUCKTEN TITEL (Themenspeicher 13)`)
  console.log(`  geprüfte Engine-Titel            : ${zeilen.length}`)
  console.log(`  davon mit mindestens einem Marker: ${eindeutig.size}`)
  console.log('-'.repeat(72))
  for (const [name, , hinweis] of MARKER) {
    const liste = betroffen.get(name) ?? []
    console.log(`\n  ${name} — ${liste.length}   (${hinweis})`)
    for (const z of liste) console.log(`        ${z.titel} [${z.einheit}]`)
  }
  console.log('')
}

// ── Gegenrichtung: Katalogzeilen, die die Engine nie erreicht ─────────────
//
// (23.09.2026, Prüfmeister) Themenspeicher Punkt 23. Der Abgleich misst bisher
// nur eine Richtung: Engine-Titel ohne Preis. Die andere Richtung ist ebenso
// teuer und war nie gezählt — eine Katalogzeile, auf die KEIN Engine-Titel
// trifft, kann nie auf ein Angebot kommen. Der Betrieb pflegt einen Preis,
// den das Produkt nicht abrufen kann; er merkt es nie, weil nichts rot wird.
// PM-140 ist der gemessene Einzelfall (Diagonalverlegung Boden/Wand); diese
// Zählung sagt, wie viele Zeilen sonst noch so dastehen.
if (process.argv.includes('--gegenrichtung')) {
  // Die rohe Zahl über den ganzen Katalog trägt NICHT. Der Standardkatalog
  // hat 2.374 Zeilen über Dach, Garten, Schreiner, Abbruch, Reinigung —
  // Gewerke, für die die Engine gar nicht gebaut ist. „2.242 nie erreichbar"
  // wäre eine Schlagzeile ohne Aussage. Gemessen wird deshalb je AKTIVEM
  // Gewerk (gewerke-config.ts) und nur in den Kategorien, die der Matcher für
  // dieses Gewerk überhaupt zur Auswahl stellt: dort, und nur dort, ist eine
  // unerreichte Zeile ein gepflegter Preis, den das Produkt nicht abrufen kann.
  const GEWERKE = ['maler', 'boden_parkett', 'fliesen', 'trockenbau', 'sanitaer_heizung', 'elektro']
  console.log(`\nKATALOGZEILEN OHNE ENGINE-TITEL (Themenspeicher 23)`)
  console.log(`  Zeilen im Standardkatalog gesamt : ${DEFAULT_PRICES.length}  (über alle Gewerke, auch die ohne Engine)`)
  console.log('-'.repeat(72))
  let summeIn = 0, summeErreicht = 0
  for (const gewerk of GEWERKE) {
    const katalog = DEFAULT_PRICES.filter(p => preisKategoriePasstZuGewerk(p.category, gewerk))
    const titelDesGewerks = zeilen.filter(z => gewerkFuerPosition(z.titel, undefined) === gewerk)
    const erreicht = new Set(titelDesGewerks.map(z => z.katalogTitel).filter(Boolean))
    const nie = katalog.filter(p => !erreicht.has(p.title))
    summeIn += katalog.length; summeErreicht += erreicht.size
    console.log(`\n  ${gewerk}: ${katalog.length} Katalogzeilen · ${titelDesGewerks.length} Engine-Titel · ${erreicht.size} erreicht · ${nie.length} NIE erreichbar`)
    const jeKategorie = new Map()
    for (const p of nie) {
      if (!jeKategorie.has(p.category)) jeKategorie.set(p.category, [])
      jeKategorie.get(p.category).push(p)
    }
    for (const [kategorie, liste] of [...jeKategorie].sort((a, b) => b[1].length - a[1].length)) {
      console.log(`      ${String(liste.length).padStart(3)}  ${kategorie}`)
      if (process.argv.includes('--alle')) for (const p of liste) console.log(`             ${euro(p.unit_price).padStart(10)}  ${p.title} [${p.unit}]`)
    }
  }
  console.log(`\n  ZUSAMMEN über die sechs aktiven Gewerke: ${summeIn} Katalogzeilen, ${summeErreicht} erreicht, ${summeIn - summeErreicht} nie erreichbar`)
  console.log('')
}

// ── Wortabhängigkeit: wie fest hängt der Preis an einem einzigen Wort ─────
//
// (23.09.2026, Prüfmeister) Themenspeicher Punkt 27. PM-147 hat es sichtbar
// gemacht, DC-145 macht es akut: 36 Engine-Titel sollen umbenannt werden,
// weil sie auf dem Kundenpapier nach Preisliste klingen. Der Titel ist aber
// zugleich der Schlüssel zum Preis. Der Designer hat seine 36 einzeln
// gemessen — das ist die richtige Antwort auf „sind DIESE 36 sicher?", aber
// nicht auf „wie gefährlich ist Umbenennen überhaupt?". Diese Zählung
// beantwortet die zweite Frage, und zwar ohne App: jeder Titel wird Wort für
// Wort um ein Wort gekürzt und erneut durch denselben Matcher geschickt.
//
// Warum Weglassen und nicht Umformulieren: Weglassen ist die kleinste
// denkbare Änderung und braucht kein Urteil darüber, was ein „schönerer"
// Titel wäre. Fällt der Treffer schon, wenn EIN Wort fehlt, dann trägt dieses
// Wort den Preis allein. Das ist die Untergrenze der Gefahr, nicht ihr Maß:
// DC-145 zeigt am verworfenen ersten Entwurf, dass auch das Ersetzen eines
// Wortes durch ein anderes den Treffer verlieren kann.
//
// Gemessen wird gegen den Katalog des Gewerks, das der URSPRÜNGLICHE Titel
// routet — Umbenennen soll das Gewerk nicht wechseln. Wechselt es trotzdem,
// steht das als eigene Zahl darunter; das ist die schlimmere Klasse, weil
// dann nicht nur der Treffer, sondern die ganze Katalogseite wechselt.
if (process.argv.includes('--wortabhaengigkeit')) {
  const katalogFuer = gewerk => DEFAULT_PRICES
    .filter(preis => preisKategoriePasstZuGewerk(preis.category, gewerk))
    .map((preis, i) => ({ id: `standard-${i}`, ...preis }))

  const mitTreffer = zeilen.filter(z => z.score !== null)
  const befunde = []
  let routingWechsel = 0
  const routingBeispiele = []

  for (const z of mitTreffer) {
    const gewerk = gewerkFuerPosition(z.titel, undefined)
    const katalog = katalogFuer(gewerk)
    const woerter = z.titel.split(/\s+/)
    if (woerter.length < 2) continue
    const tragend = []
    for (let i = 0; i < woerter.length; i++) {
      const kurz = woerter.filter((_, j) => j !== i).join(' ').replace(/\s+/g, ' ').trim()
      if (!kurz) continue
      const neu = findePreisposition(kurz, z.einheit, katalog)
      let klasse = null
      if (!neu) klasse = 'weg'
      else if (neu.position.unit_price !== z.katalogPreis) klasse = 'preis'
      else if (neu.position.title !== z.katalogTitel) klasse = 'zeile'
      else if (z.score >= 0.75 && neu.score < 0.75) klasse = 'knapp'
      if (klasse) tragend.push({ wort: woerter[i], kurz, klasse, neu })
      if (gewerkFuerPosition(kurz, undefined) !== gewerk) {
        routingWechsel++
        if (routingBeispiele.length < 8) routingBeispiele.push(`${z.titel}  ohne „${woerter[i]}"  →  ${gewerkFuerPosition(kurz, undefined) ?? 'kein Gewerk'} (statt ${gewerk})`)
      }
    }
    if (tragend.length) befunde.push({ ...z, gewerk, woerter: woerter.length, tragend })
  }

  const hat = (b, ...klassen) => b.tragend.some(t => klassen.includes(t.klasse))
  const verliertTreffer = befunde.filter(b => hat(b, 'weg'))
  const anderePreisZeile = befunde.filter(b => !hat(b, 'weg') && hat(b, 'preis'))
  const nurStill = befunde.filter(b => !hat(b, 'weg', 'preis'))
  // Die härteste Klasse: EIN Wort trägt den Treffer, und es ist nicht das
  // Tätigkeitswort — solche Titel sehen harmlos aus und sind es nicht.
  const einWort = befunde.filter(b => b.tragend.filter(t => t.klasse === 'weg' || t.klasse === 'preis').length === 1)

  console.log(`\nWORTABHÄNGIGKEIT DES PREISTREFFERS (Themenspeicher 27)`)
  console.log(`  Engine-Titel mit Preis, mehr als ein Wort : ${mitTreffer.filter(z => z.titel.split(/\s+/).length > 1).length}`)
  console.log(`  davon hängt der Treffer an mind. einem Wort: ${verliertTreffer.length + anderePreisZeile.length}`)
  console.log(`      Wort fehlt → gar kein Preis mehr (0,00 €): ${verliertTreffer.length}`)
  console.log(`      Wort fehlt → anderer Preis               : ${anderePreisZeile.length}`)
  console.log(`      Wort fehlt → andere Zeile/Score, Preis gleich (still): ${nurStill.length}`)
  console.log(`  davon hängt es an GENAU EINEM Wort        : ${einWort.length}`)
  console.log(`  Wortauslassungen, die das GEWERK wechseln : ${routingWechsel}`)
  console.log('-'.repeat(72))

  const zeige = (ueberschrift, liste, klassen) => {
    if (!liste.length) return
    console.log(`\n  ${ueberschrift} (${liste.length})`)
    for (const b of liste) {
      const w = b.tragend.filter(t => klassen.includes(t.klasse))
      if (!w.length) continue
      console.log(`\n    ${b.titel} [${b.einheit}] · ${b.gewerk} · Score ${b.score.toFixed(2)}`)
      console.log(`        heute → ${b.katalogTitel} — ${euro(b.katalogPreis)}`)
      for (const t of w) {
        console.log(t.klasse === 'weg'
          ? `        ohne „${t.wort}" → KEIN TREFFER (0,00 €)`
          : `        ohne „${t.wort}" → ${t.neu.position.title} — ${euro(t.neu.position.unit_price)}`)
      }
    }
  }
  // ── Der Schnitt, der die Entscheidung trägt ───────────────────────────
  //
  // Die Gesamtzahl sagt, wie gefährlich Umbenennen im Allgemeinen ist. Die
  // Frage aus PM-147 ist enger: wie gefährlich ist es an genau den Titeln,
  // die umbenannt werden SOLLEN? Deshalb dieselbe Messung noch einmal, nur
  // über die Titel mit Katalogsprache — dieselben Marker wie
  // `--katalogsprache`, damit beide Zahlen aufeinander passen.
  const MARKER_27 = [
    ['Schrägstrich', /\//],
    ['Klammerzusatz', /\([^)]*\)/],
    ['Q-Stufe', /\bQ[1-4]\b/],
    ['Mal-Zeichen', /\d\s*[×x]\b/],
    ['Abkürzung', /\b(?:GK|CW|UW|inkl\.|ggf\.|bzw\.|zzgl\.|o\. ?g\.|z\. ?B\.)\b/],
  ]
  console.log(`\n  SCHNITT MIT PM-147 — die Titel, die umbenannt werden sollen`)
  for (const [name, muster] of MARKER_27) {
    const inKlasse = mitTreffer.filter(z => muster.test(z.titel) && z.titel.split(/\s+/).length > 1)
    const haengt = inKlasse.filter(z => befunde.some(b => b.titel === z.titel && hat(b, 'weg', 'preis')))
    const verliert = inKlasse.filter(z => befunde.some(b => b.titel === z.titel && hat(b, 'weg')))
    console.log(`        ${name.padEnd(14)} ${String(inKlasse.length).padStart(3)} mit Preis · ${String(haengt.length).padStart(3)} hängen an einem Wort · ${String(verliert.length).padStart(2)} davon auf 0,00 €`)
    for (const z of verliert) console.log(`             🔴 ${z.titel}`)
  }

  zeige('TRÄGT DEN PREIS ALLEIN — ohne dieses Wort steht 0,00 € im Angebot', verliertTreffer, ['weg'])
  zeige('TRÄGT DEN PREIS ALLEIN — ohne dieses Wort ein ANDERER Preis', anderePreisZeile, ['preis'])
  if (alle) zeige('STILL — andere Zeile oder schwächerer Score, Preis gleich', nurStill, ['zeile', 'knapp'])
  if (routingBeispiele.length) {
    console.log(`\n  GEWERK-WECHSEL durch ein fehlendes Wort (erste ${routingBeispiele.length})`)
    for (const b of routingBeispiele) console.log(`        ${b}`)
  }
  console.log('')
}

// ── --gewerklos: die Titel, die in gar kein Gewerk routen (Themenspeicher 29)
//
// (24.09.2026, Prüfmeister) Der Chief of Staff hat nach genau EINER Zahl
// gefragt: wie viele der gewerklosen Engine-Titel ein Betrieb mit `maler` oder
// `boden_parkett` überhaupt erreicht. Seine Annahme dahinter: Trockenbau,
// Elektro und SHK sind im Onboarding nicht wählbar, also kann ein Maler ihre
// Titel nie sehen. Die Annahme trägt nicht, und das ist hier mitgemessen:
// `berechneUndPruefeAlleGewerke()` nimmt das Gewerk aus der EXTRAKTION
// (`extraktion.gewerk`, mehrgewerk.ts Z. 198), nicht aus `companies.gewerke`.
// Die Gewerke des Betriebs stehen nur als Bitte im Prompt
// (angebot-extrahieren/route.ts Z. 74: „Bevorzuge diese Gewerke"). Deshalb
// zählt die Spalte „Weg" beides: über welches Modul der Titel entsteht, und
// ob dieses Modul für einen Maler/Bodenleger laufen kann.
if (process.argv.includes('--gewerklos')) {
  const MALER_BODEN = /^(?:mengen\/gewerke\/(?:maler|boden|sockelleisten|vob-uebermessung)|vollstaendigkeit\/(?:maler|boden))/
  const FREMD = /^(?:mengen\/gewerke\/(?:trockenbau|elektro|sanitaer|fliesen)|vollstaendigkeit\/(?:trockenbau|elektro|sanitaer|fliesen))/

  const ohneGewerk = zeilen.filter(z => gewerkFuerPosition(z.titel, undefined) === undefined)
  const direkt = ohneGewerk.filter(z => MALER_BODEN.test(z.quellen))
  const ueberDiktat = ohneGewerk.filter(z => !MALER_BODEN.test(z.quellen) && FREMD.test(z.quellen))
  const unklar = ohneGewerk.filter(z => !MALER_BODEN.test(z.quellen) && !FREMD.test(z.quellen))

  console.log(`\nTITEL OHNE GEWERK (Themenspeicher 29)`)
  console.log(`  Engine-Titel insgesamt                        : ${zeilen.length}`)
  console.log(`  davon ohne Gewerk (Filter greift nicht)       : ${ohneGewerk.length}`)
  console.log(`  aus einem Maler-/Boden-Modul (direkt erreichbar): ${direkt.length}`)
  console.log(`  aus Trockenbau/Elektro/SHK/Fliesen-Modul       : ${ueberDiktat.length}`)
  console.log(`  Quelle nicht zugeordnet                       : ${unklar.length}`)
  console.log('-'.repeat(72))
  const zeig = (name, liste) => {
    if (!liste.length) return
    console.log(`\n  ${name} (${liste.length})`)
    for (const z of liste) {
      const p = z.score === null ? 'KEIN TREFFER (0,00 €)' : `${z.score.toFixed(2)} → ${z.katalogTitel} — ${euro(z.katalogPreis)}`
      console.log(`    ${z.titel} [${z.einheit}]\n        ${p}\n        ${z.quellen}`)
    }
  }
  // ── Der zweite Teil von Themenspeicher 29: was ein gestrichenes Wort kostet
  //
  // Ohne Gewerk sucht der Matcher im GANZEN Katalog (2.374 Zeilen über Dach,
  // Garten, Schreiner, Abbruch). Gefährlich wird das erst, wenn ein Wort
  // wegfällt: `Dachschrägen grundieren` → `Dachschrägen` trifft
  // `Dachschrägenschrank …` zu 650,00 €/m². Hier wird für jeden der
  // gewerklosen Titel jede Wortauslassung gefahren und die Treffer-Kategorie
  // gelesen: Landet sie außerhalb von Maler/Boden, ist es ein Fremdgewerk-
  // Treffer. Gezählt wird der teuerste je Titel.
  const alleZeilen = DEFAULT_PRICES.map((preis, i) => ({ id: `standard-${i}`, ...preis }))
  const EIGEN = /^(?:Maler|Boden|Parkett)/i
  const fremd = []
  for (const z of ohneGewerk) {
    const woerter = z.titel.split(/\s+/)
    if (woerter.length < 2) continue
    const funde = []
    for (let i = 0; i < woerter.length; i++) {
      const kurz = woerter.filter((_, j) => j !== i).join(' ').trim()
      if (!kurz) continue
      if (gewerkFuerPosition(kurz, undefined) !== undefined) continue
      const neu = findePreisposition(kurz, z.einheit, alleZeilen)
      if (!neu) continue
      if (EIGEN.test(neu.position.category)) continue
      funde.push({ wort: woerter[i], kurz, ziel: neu.position, score: neu.score })
    }
    if (funde.length) {
      funde.sort((a, b) => b.ziel.unit_price - a.ziel.unit_price)
      fremd.push({ ...z, funde })
    }
  }
  fremd.sort((a, b) => b.funde[0].ziel.unit_price - a.funde[0].ziel.unit_price)
  console.log(`\n  BEIM KÜRZEN IN EIN FREMDES GEWERK (${fremd.length} der ${ohneGewerk.length})`)
  for (const f of fremd) {
    console.log(`\n    ${f.titel} [${f.einheit}]`)
    console.log(`        heute → ${f.katalogTitel ?? 'KEIN TREFFER'}${f.katalogPreis === null ? '' : ' — ' + euro(f.katalogPreis)}`)
    for (const g of f.funde) {
      console.log(`        ohne „${g.wort}" → ${g.ziel.title} — ${euro(g.ziel.unit_price)}/${g.ziel.unit} [${g.ziel.category}] Score ${g.score.toFixed(2)}`)
    }
  }

  // ── Die zweite Klasse, und die teurere: Titel, die ihr Gewerk VERLIEREN
  //
  // (24.09.2026) Mein eigenes Beispiel in Themenspeicher 29
  // (`Dachschrägen grundieren` → 650,00 €) gehört gar nicht zu den 43: der
  // Titel HAT ein Gewerk (`grundier` → maler) und verliert es erst durch das
  // gestrichene Wort. Das ist die gefährlichere Klasse, weil sie jeden Titel
  // betrifft, nicht nur die 43. Hier gezählt: Wortauslassung → kein Gewerk
  // mehr → Treffer außerhalb von Maler/Boden.
  const verlierer = []
  for (const z of zeilen) {
    const gewerk = gewerkFuerPosition(z.titel, undefined)
    if (gewerk === undefined) continue
    const woerter = z.titel.split(/\s+/)
    if (woerter.length < 2) continue
    const funde = []
    for (let i = 0; i < woerter.length; i++) {
      const kurz = woerter.filter((_, j) => j !== i).join(' ').trim()
      if (!kurz) continue
      if (gewerkFuerPosition(kurz, undefined) !== undefined) continue
      const treffer = findePreisposition(kurz, z.einheit, alleZeilen)
      if (!treffer || EIGEN.test(treffer.position.category)) continue
      funde.push({ wort: woerter[i], ziel: treffer.position, score: treffer.score })
    }
    if (funde.length) {
      funde.sort((a, b) => b.ziel.unit_price - a.ziel.unit_price)
      verlierer.push({ ...z, gewerk, funde })
    }
  }
  verlierer.sort((a, b) => b.funde[0].ziel.unit_price - a.funde[0].ziel.unit_price)
  console.log(`\n  VERLIEREN IHR GEWERK DURCH EIN WORT UND LANDEN FREMD (${verlierer.length} von ${zeilen.length})`)
  for (const v of verlierer) {
    console.log(`\n    ${v.titel} [${v.einheit}] · heute ${v.gewerk} · ${v.katalogTitel ?? 'KEIN TREFFER'}${v.katalogPreis === null ? '' : ' — ' + euro(v.katalogPreis)}`)
    for (const g of v.funde) {
      console.log(`        ohne „${g.wort}" → ${g.ziel.title} — ${euro(g.ziel.unit_price)}/${g.ziel.unit} [${g.ziel.category}] Score ${g.score.toFixed(2)}`)
    }
  }

  zeig('AUS EINEM MALER-/BODEN-MODUL — ein Maler oder Bodenleger erreicht sie im Normalbetrieb', direkt)
  zeig('AUS EINEM FREMDEN MODUL — nur über ein Diktat, das die KI auf dieses Gewerk zieht', ueberDiktat)
  zeig('QUELLE NICHT ZUGEORDNET', unklar)
  console.log('')
}

// ── --vorlage: bewegen die abweichenden Onboarding-Vorlagen Geld?
//
// (24.09.2026, Prüfmeister) Platz 3 des Chief of Staff. Engineerings neue
// Sperrklinke zählt 18 Vorlagenzeilen ohne wortgleichen Katalogtitel; sie ist
// eine Bestandsaufnahme und behauptet nichts über Geld. Gemessen wird deshalb
// der Zustand, den der Betrieb wirklich bekommt: `mischeEigenePreise()`
// (onboarding/[step]/page.tsx Z. 323) legt die ausgefüllten Vorlagen auf den
// Basiskatalog; was es dort unter `category::title::unit` nicht gibt, kommt
// als EIGENE Zeile dazu. Genau diese Zeilen stehen danach als Zwilling neben
// der Katalogzeile — und der Matcher sieht beide. Gefragt ist: wie viele
// Engine-Titel treffen dadurch eine andere Zeile oder einen anderen Preis?
if (process.argv.includes('--vorlage')) {
  const { getPreisvorlagenForGewerke } = await jiti.import(path.join(ROOT, 'src/lib/preise-vorlagen.ts'))
  const { standardpreiseFuerGewerke, preisSchluessel } = await jiti.import(path.join(ROOT, 'src/lib/default-price-selection.ts'))

  const GEWERKE = ['maler', 'boden_parkett']
  const basis = standardpreiseFuerGewerke(GEWERKE)
  const imBasis = new Set(basis.map(preisSchluessel))
  const vorlagen = getPreisvorlagenForGewerke(GEWERKE)
    .map(v => ({ category: v.category, title: v.title, unit: v.unit, unit_price: v.defaultPrice }))
  const zusaetzlich = vorlagen.filter(v => !imBasis.has(preisSchluessel(v)))

  const liste = (extra) => [...basis, ...extra].map((preis, i) => ({ id: `b-${i}`, ...preis }))
  const ohne = liste([])
  const mit = liste(zusaetzlich)
  const nimm = (l, titel) => {
    const gewerk = gewerkFuerPosition(titel, undefined)
    return l.filter(preis => preisKategoriePasstZuGewerk(preis.category, gewerk))
  }

  const bewegt = []
  for (const z of zeilen) {
    const a = findePreisposition(z.titel, z.einheit, nimm(ohne, z.titel))
    const b = findePreisposition(z.titel, z.einheit, nimm(mit, z.titel))
    const preisA = a?.position.unit_price ?? null
    const preisB = b?.position.unit_price ?? null
    const zeileA = a?.position.title ?? null
    const zeileB = b?.position.title ?? null
    if (preisA === preisB && zeileA === zeileB) continue
    bewegt.push({ ...z, a, b, preisA, preisB, zeileA, zeileB, geld: preisA !== preisB })
  }
  const mitGeld = bewegt.filter(b => b.geld)
  const schuldige = new Set(bewegt.map(b => b.zeileB).filter(t => zusaetzlich.some(v => v.title === t)))
  const schuldigeGeld = new Set(mitGeld.map(b => b.zeileB).filter(t => zusaetzlich.some(v => v.title === t)))

  console.log(`\nONBOARDING-VORLAGE NEBEN DEM KATALOG (CoS-Platz 3)`)
  console.log(`  Vorlagenzeilen für ${GEWERKE.join(' + ')}          : ${vorlagen.length}`)
  console.log(`  davon nicht im Basiskatalog → eigene Zeile : ${zusaetzlich.length}`)
  console.log(`  Engine-Titel, die dadurch anders treffen   : ${bewegt.length}`)
  console.log(`      davon mit ANDEREM Preis               : ${mitGeld.length}`)
  console.log(`  abweichende Vorlagenzeilen, die etwas verändern: ${schuldige.size} (davon Geld: ${schuldigeGeld.size})`)
  console.log('-'.repeat(72))
  for (const b of bewegt) {
    console.log(`\n    ${b.titel} [${b.einheit}]`)
    console.log(`        nur Katalog      : ${b.zeileA ?? 'KEIN TREFFER'}${b.preisA === null ? ' (0,00 €)' : ' — ' + euro(b.preisA)}${b.a ? ' · Score ' + b.a.score.toFixed(2) : ''}`)
    console.log(`        mit Vorlagenzeile: ${b.zeileB ?? 'KEIN TREFFER'}${b.preisB === null ? ' (0,00 €)' : ' — ' + euro(b.preisB)}${b.b ? ' · Score ' + b.b.score.toFixed(2) : ''}${b.geld ? '   🔴 anderer Preis' : ''}`)
  }
  if (!bewegt.length) console.log('\n    Keine. Die abweichenden Vorlagenzeilen bewegen keinen Engine-Titel.')
  console.log('')
}
