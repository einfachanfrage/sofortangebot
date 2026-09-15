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
