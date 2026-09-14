#!/usr/bin/env node
/**
 * Prüft, ob jede Katalogzeile über ihren EIGENEN Namen auffindbar ist.
 *
 * ── Anlass (Manfred TN-095 / CoS-E-039, 12.09.2026) ───────────────────────
 *
 * Manfreds Satz war: *„Die Preisliste hat lauter Dopplungen."* Das Ticket
 * hieß entsprechend „Katalog-Dopplungen aufräumen". Die Messung hat etwas
 * anderes gezeigt: Es sind fast keine Dopplungen. Es sind **Staffeln** —
 * zwei Zeilen, die sich nur durch eine Angabe in Klammern unterscheiden:
 *
 *   PV-Anlage anschließen (bis 10 kWp)        850 €
 *   PV-Anlage anschließen (>10 kWp)         1.400 €
 *
 * Der Preis-Matcher normalisiert Klammern weg. Danach heißen beide Zeilen
 * gleich, und es gewinnt die, die im Katalog weiter oben steht — bei einer
 * Staffel ist das die kleinste. Die Richtung ist also nicht zufällig:
 * **Der Betrieb rechnet systematisch zu billig ab.** Beim Personenaufzug
 * waren es 10.000 € Unterschied.
 *
 * Am 12.09.2026 traf das 64 von 2379 Zeilen. Am Abend desselben Tages: 0.
 * Der Weg dahin hatte zwei Hälften, und nur die erste war Code:
 *
 *   64 → 22   Staffel-Erkennung in `preis-aufwandswoerter.ts` (Zahlen)
 *   22 → 21   Manfreds Dielen-Fund (eine Synonymregel löschte das Produkt)
 *   21 →  0   Umbenennungs-Zug: Manfred hat allen 22 Zeilen Namen gegeben,
 *             die das unterscheidende Wort VOR das Verb stellen
 *             (`Treppe abbrechen (Beton)` → `Betontreppe abbrechen`)
 *
 * Seine Regel dazu, die jetzt gilt: **Die Klammer ist für Erklärung, nicht
 * für Unterscheidung. Was unterscheidet, steht vor dem Verb.** Sein Grund
 * ist nicht der Matcher, sondern der Kunde: „Betontreppe abbrechen" versteht
 * man, „Treppe abbrechen (Beton)" liest sich wie aus einem Katalog.
 *
 * Bleibt die Zahl bei 0, ist nichts zu tun. Steigt sie, hat jemand eine
 * Katalogzeile angelegt, die sich von einer vorhandenen nur in der Klammer
 * unterscheidet — `--liste` zeigt dann, welche und was sie kostet.
 *
 * EINE Ausnahme hat Manfred am selben Tag gefunden, und sie ist wichtig, weil
 * sie sich der Liste entzieht: `Massivholzdielen verlegen vollflächig
 * verklebt` (52 €) traf `Landhausdiele …` (40 €), obwohl die Namen längst
 * verschieden sind. Ursache war keine Klammer, sondern eine Synonymregel im
 * Matcher, die beide Produkte zu „diele" macht. Umbenennen hätte nichts
 * geholfen. Solche Fälle erkennt man daran, dass sich die Titel auch OHNE
 * Klammer unterscheiden — von 87 Kollisionen im Katalog trifft das auf 6 zu,
 * fünf davon fängt ein Filter ab.
 *
 * Aufruf (PowerShell, im Projektordner):
 *   node scripts/katalog-dopplungen.mjs          Zahl + die teuersten Fälle
 *   node scripts/katalog-dopplungen.mjs --alle   alle Fälle
 *   node scripts/katalog-dopplungen.mjs --liste  Entscheidungsliste (Markdown)
 *
 * Was die Zahl heißt und was nicht:
 *
 * 1. Geprüft wird der Katalog GEGEN SICH SELBST: Jede Zeile wird als
 *    gesuchter Titel durch denselben `findePreisposition` geschickt wie im
 *    Angebots-Endpunkt, mit den Zeilen desselben Gewerks als Kandidaten.
 *    Kommt etwas anderes zurück als sie selbst, ist sie über ihren eigenen
 *    Namen unerreichbar.
 * 2. Das ist die härtere Prüfung als der Vokabular-Abgleich: Dort wird
 *    gefragt, ob die ENGINE ihre Titel findet. Hier, ob der Katalog in sich
 *    eindeutig ist. Eine Zeile kann hier durchfallen, ohne dass die Engine
 *    sie je anspricht — sie fällt dann dem Betrieb auf die Füße, der sie von
 *    Hand auswählt.
 * 3. Gruppiert wird nach dem Gewerk vor dem Gedankenstrich der Kategorie
 *    („Boden – Parkett" → „Boden"). Das ist etwas weiter gefasst als der
 *    Gewerke-Filter im Endpunkt und damit die vorsichtige Richtung: Wer hier
 *    besteht, besteht dort erst recht.
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createJiti } from 'jiti'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HIER, '..')
const jiti = createJiti(import.meta.url, { alias: { '@': path.join(ROOT, 'src') } })

const { findePreisposition } = await jiti.import(path.join(ROOT, 'src/lib/preis-matcher.ts'))
const { DEFAULT_PRICES } = await jiti.import(path.join(ROOT, 'src/lib/default-prices.ts'))

const alle = process.argv.includes('--alle')
const alsListe = process.argv.includes('--liste')

const katalog = DEFAULT_PRICES.map((p, i) => ({ id: `p${i}`, ...p }))
const gewerkVon = c => c.split(/\s*[–-]\s*/)[0].trim()

const gruppen = new Map()
for (const p of katalog) {
  const g = gewerkVon(p.category)
  if (!gruppen.has(g)) gruppen.set(g, [])
  gruppen.get(g).push(p)
}

const unerreichbar = []
for (const kandidaten of gruppen.values()) {
  for (const p of kandidaten) {
    const treffer = findePreisposition(p.title, p.unit, kandidaten)
    if (treffer && treffer.position.id !== p.id) unerreichbar.push({ p, traf: treffer.position })
  }
}

const eur = n => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const echteDopplung = unerreichbar.filter(x => x.p.title === x.traf.title)
const gleicherPreis = unerreichbar.filter(x => x.p.title !== x.traf.title && x.p.unit_price === x.traf.unit_price)
const andererPreis = unerreichbar.filter(x => x.p.title !== x.traf.title && x.p.unit_price !== x.traf.unit_price)
andererPreis.sort((a, b) => Math.abs(b.traf.unit_price - b.p.unit_price) - Math.abs(a.traf.unit_price - a.p.unit_price))

if (alsListe) {
  // Entscheidungsliste für Manfred / den Prüfmeister. Jede Zeile ist eine
  // Frage: Wie soll die teurere Variante heißen, damit sie sich vom
  // Grundfall unterscheidet — OHNE Klammer, denn die wirft der Matcher weg?
  console.log('# Katalog: Zeilen, die ihren eigenen Namen nicht finden\n')
  console.log(`Stand ${new Date().toLocaleDateString('de-DE')} · ${unerreichbar.length} von ${katalog.length} Zeilen\n`)
  console.log('Die linke Zeile wird nie gefunden; wer sie sucht, bekommt die rechte')
  console.log('und damit deren Preis. Beide unterscheiden sich nur durch ein Wort in')
  console.log('der Klammer — und Klammern wirft die Preissuche weg.\n')
  console.log('**Die Frage an den Handwerker:** Wie heißt die linke Zeile, wenn man')
  console.log('sie ohne Klammer schreiben müsste? (`Treppe abbrechen (Beton)` →')
  console.log('`Betontreppe abbrechen`.) Steht das unterscheidende Wort vor der')
  console.log('Klammer, findet die Suche sie wieder.\n')
  // Nach Gewerk gruppiert, innerhalb des Gewerks das teuerste zuerst —
  // damit jede Überschrift einmal kommt und der Handwerker seinen eigenen
  // Abschnitt am Stück lesen kann.
  const liste = [...andererPreis, ...gleicherPreis].sort((a, b) => {
    const ga = gewerkVon(a.p.category), gb = gewerkVon(b.p.category)
    if (ga !== gb) return ga.localeCompare(gb, 'de-DE')
    return Math.abs(b.traf.unit_price - b.p.unit_price) - Math.abs(a.traf.unit_price - a.p.unit_price)
  })
  let gewerk = null
  for (const { p, traf } of liste) {
    const g = gewerkVon(p.category)
    if (g !== gewerk) { gewerk = g; console.log(`\n## ${g}\n`) }
    console.log(`- **${p.title}** — ${eur(p.unit_price)} €/${p.unit}`)
    console.log(`  bekommt heute: *${traf.title}* — ${eur(traf.unit_price)} €`)
  }
  if (echteDopplung.length) {
    console.log('\n## Echte Dopplungen — gleicher Titel, zwei Preise\n')
    for (const { p, traf } of echteDopplung) {
      console.log(`- **${p.title}** (${p.category}): ${eur(p.unit_price)} € und ${eur(traf.unit_price)} € — eine der beiden muss weg.`)
    }
  }
  process.exit(0)
}

console.log(`\nKatalogzeilen gesamt                       : ${katalog.length}`)
console.log(`Zeilen, die sich selbst NICHT finden       : ${unerreichbar.length}`)
console.log(`  davon echte Dopplung (gleicher Titel)    : ${echteDopplung.length}`)
console.log(`  davon gleicher Preis (harmlos fürs Geld) : ${gleicherPreis.length}`)
console.log(`  davon ANDERER Preis (still falsches Geld): ${andererPreis.length}`)

const zeigen = alle ? andererPreis : andererPreis.slice(0, 15)
if (zeigen.length) {
  console.log('\n── Hier entscheidet der Zufall über Geld ' + '─'.repeat(38))
  for (const { p, traf } of zeigen) {
    const d = traf.unit_price - p.unit_price
    console.log(`\n  ${(d > 0 ? '+' : '') + eur(d)} €   ${p.title}  (${eur(p.unit_price)} €)`)
    console.log(`           bekommt: ${traf.title}  (${eur(traf.unit_price)} €)   [${traf.category}]`)
  }
  if (!alle && andererPreis.length > zeigen.length) {
    console.log(`\n  … ${andererPreis.length - zeigen.length} weitere. Alle: --alle · Als Entscheidungsliste: --liste`)
  }
}
for (const { p, traf } of echteDopplung) {
  console.log(`\n  ECHTE DOPPLUNG: „${p.title}" steht zweimal — ${eur(p.unit_price)} € und ${eur(traf.unit_price)} €  [${p.category}]`)
}
console.log('')
