#!/usr/bin/env node
/**
 * Probeangebot — zeigt, was bei einem normalen Auftrag herauskommt.
 *
 * ── Wozu (Sandy, 12.09.2026) ──────────────────────────────────────────────
 *
 * *„Ich hab Sorge, dass ich einen komplett normalen Testfall einspreche und
 * plötzlich nur Scheiße rauskommt, weil du gefühlt alles umbaust und ich
 * nichts checke."*
 *
 * Berechtigt. Eine grüne Testsuite heißt „nichts kaputt, was ein Test kennt" —
 * nicht „ein Angebot sieht gut aus". Das hier schließt die Lücke: Es fährt
 * dieselbe Kette wie der echte Angebots-Endpunkt (Mengen-Engine →
 * Vollständigkeitsprüfung → Gewerke-Filter → Preis-Matching) und druckt das
 * fertige Angebot aus, so wie es der Handwerker im Entwurf sieht.
 *
 * Nicht simuliert, nicht nachgebaut: dieselben Funktionen, derselbe
 * Standardkatalog.
 *
 * Aufruf (PowerShell, im Projektordner):
 *   node scripts/probe-angebot.mjs
 *
 * Worauf man schaut:
 *   • Steht bei jeder Zeile ein Preis? („ohne Preis" ist nicht automatisch
 *     falsch — der Versand ist dann gesperrt, der Betrieb trägt ihn nach.)
 *   • Steht unter einer Zeile eine „Annahme"? Dann hat sich der Titel nicht
 *     festgelegt und die Standardzeile hat gegriffen. Stimmt die Annahme?
 *   • Sind die Mengen plausibel? (Wandfläche ≈ Umfang × Höhe minus Öffnungen)
 *   • Steht dieselbe Arbeit zweimal drin?
 *   • Heißen die Zeilen so, wie ein Handwerker sie nennen würde?
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createJiti } from 'jiti'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HIER, '..')
const jiti = createJiti(import.meta.url, { alias: { '@': path.join(ROOT, 'src') } })

const { berechneMengen } = await jiti.import(path.join(ROOT, 'src/lib/mengen/engine.ts'))
const { pruefeUndErgaenzeVollstaendigkeit } = await jiti.import(path.join(ROOT, 'src/lib/vollstaendigkeit/index.ts'))
const { findePreisposition } = await jiti.import(path.join(ROOT, 'src/lib/preis-matcher.ts'))
const { DEFAULT_PRICES } = await jiti.import(path.join(ROOT, 'src/lib/default-prices.ts'))
const { preisKategoriePasstZuGewerk } = await jiti.import(path.join(ROOT, 'src/lib/default-price-selection.ts'))

const KATALOG = DEFAULT_PRICES.map((p, i) => ({
  id: `p${i}`, title: p.title, category: p.category, unit: p.unit, unit_price: p.unit_price,
}))

/** Kopie aus src/app/api/angebot-generieren/route.ts — wie im Abgleich-Skript. */
function gewerkFuerPosition(beschreibung, hauptgewerk) {
  const text = beschreibung.toLocaleLowerCase('de-DE')
  const istBoden = /vinyl|laminat|parkett|teppich|kork|linoleum|designboden|bodenbelag|trittschall|altbelag|sockelleisten montier|boden (?:verleg|entfern|schleif)|untergrund schleifen.*kleberreste|kleberreste.*schleifen/i.test(text)
  if (istBoden) return 'boden_parkett'
  if (/boden\s*sch[üu]tz|bodenschutz|abdeckvlies|abdeckfolie|m[öo]bel\s*abdeck/i.test(text)) return 'maler'
  if (/wand|decke|streich|anstrich|tapete|raufaser|spachtel|schleifen|grundier|abdeck|abkleb/i.test(text)) return 'maler'
  if (/^\s*erschwerniszuschlag\b/i.test(text)) return 'maler'
  return hauptgewerk
}

const eur = n => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const menge = n => n.toLocaleString('de-DE', { maximumFractionDigits: 2 })

function angebot(fall) {
  const eng = berechneMengen(fall.gewerk, { transkript: fall.transkript, raeume: fall.raeume, gewerk: fall.gewerk })
  const signale = {
    arbeitenTexte: fall.raeume.flatMap(r => r.arbeiten ?? []),
    belagText: fall.raeume.find(r => r.belag)?.belag ?? null,
    altbelagEntfernen: fall.raeume.some(r => r.altbelag_entfernen === true),
  }
  const meta = { raeume: fall.raeume.map(r => ({ name: r.name, hoehe: r.hoehe ?? null })) }
  const { positionen, fehlende } = pruefeUndErgaenzeVollstaendigkeit(
    fall.gewerk, eng.positionen, fall.transkript, meta, signale,
  )

  console.log(`\n${'═'.repeat(86)}`)
  console.log(`  ${fall.name}`)
  console.log(`  Diktat: „${fall.transkript}"`)
  console.log('═'.repeat(86))

  let summe = 0
  let ohnePreis = 0
  for (const p of positionen) {
    const gewerk = gewerkFuerPosition(p.beschreibung, fall.gewerk)
    const kandidaten = KATALOG.filter(k => preisKategoriePasstZuGewerk(k.category, gewerk))
    const treffer = findePreisposition(p.beschreibung, p.einheit, kandidaten)
    const ep = treffer?.position.unit_price ?? 0
    const gp = Math.round(p.menge * ep * 100) / 100
    summe += gp
    if (!treffer) ohnePreis++
    const preisSpalte = treffer
      ? `${eur(ep).padStart(8)} €  ${eur(gp).padStart(10)} €`
      : `${'— ohne Preis —'.padStart(10)}  ${'0,00'.padStart(10)} €`
    console.log(`  ${p.beschreibung.padEnd(46).slice(0, 46)} ${menge(p.menge).padStart(8)} ${String(p.einheit).padEnd(6)} ${preisSpalte}`)
    if (treffer && treffer.position.title !== p.beschreibung.split(' — ')[0]) {
      console.log(`  ${' '.repeat(46)} └─ Katalogzeile: ${treffer.position.title}`)
    }
    // Standardzeile (Manfred, 12.09.2026): Wo der Titel sich nicht festgelegt
    // hat, muss sichtbar sein, WAS angenommen wurde — im Entwurf, nicht auf
    // dem Kunden-PDF. Hier steht es genauso untereinander wie dort.
    if (treffer?.annahme) {
      console.log(`  ${' '.repeat(46)} └─ Annahme: ${treffer.annahme}`)
    }
  }
  console.log('  ' + '─'.repeat(84))
  console.log(`  ${'Netto-Summe'.padEnd(46)} ${' '.repeat(15)} ${eur(summe).padStart(10)} €`)
  if (ohnePreis > 0) console.log(`  ⚠  ${ohnePreis} Position(en) ohne Preis — Versand wäre gesperrt, bis der Betrieb sie einträgt.`)
  if (fehlende.length) {
    console.log('\n  Fehlt noch (Hinweise an den Handwerker, keine bepreisten Zeilen):')
    for (const f of fehlende) console.log(`    · ${f}`)
  }
}

const raum = (name, extra = {}) => ({
  name, laenge: null, breite: null, hoehe: 2.5, flaeche: null, umfang: null,
  tueren: [{ anzahl: 1, breite: 0.9, hoehe: 2.1, annahme: true }],
  fenster: [{ anzahl: 1, breite: 1.2, hoehe: 1.0, annahme: true }],
  altbelag_entfernen: false, sockelleisten: false, nassbereich: false, ...extra,
})

const FAELLE = [
  {
    name: 'Fall 1 — Zimmer streichen, Wände und Decke',
    gewerk: 'maler',
    transkript: 'Wohnzimmer vier mal fünf Meter, Höhe zwei fünfzig. Wände zweimal streichen, Decke einmal. Ein Fenster normale Größe, eine Tür.',
    raeume: [raum('Wohnzimmer', { laenge: 5, breite: 4, arbeiten: ['waende_streichen', 'decke_streichen'] })],
  },
  {
    name: 'Fall 2 — Tapete runter, neue Raufaser, streichen',
    gewerk: 'maler',
    transkript: 'Schlafzimmer, alte Tapete runter, die Wände spachteln, neue Raufaser aufziehen und zweimal weiß streichen. 42 Quadratmeter Wandfläche.',
    raeume: [raum('Schlafzimmer', { laenge: 4.5, breite: 3.5, arbeiten: ['tapezieren', 'waende_streichen'] })],
  },
  {
    name: 'Fall 3 — Alter Teppich raus, Klick-Vinyl rein',
    gewerk: 'boden_parkett',
    transkript: 'Büro, 24 Quadratmeter. Alter Teppichboden ist verklebt, muss raus, Kleberreste abschleifen. Danach Klick-Vinyl verlegen und neue Sockelleisten.',
    raeume: [raum('Büro', { laenge: 6, breite: 4, belag: 'klick-vinyl', altbelag_entfernen: true, sockelleisten: true, arbeiten: ['vinyl verlegen'] })],
  },
  {
    name: 'Fall 4 — Estrich vorbereiten und Laminat',
    gewerk: 'boden_parkett',
    transkript: 'Kinderzimmer 3,50 mal 4 Meter. Estrich grundieren, Ausgleichsmasse fünf Millimeter, dann Laminat verlegen.',
    raeume: [raum('Kinderzimmer', { laenge: 4, breite: 3.5, belag: 'laminat', ausgleich: true, arbeiten: ['laminat verlegen'] })],
  },
]

console.log('\nProbeangebot — dieselbe Kette wie der echte Endpunkt, gegen den Standardkatalog.')
for (const fall of FAELLE) angebot(fall)
console.log(`\n${'═'.repeat(86)}\n`)
