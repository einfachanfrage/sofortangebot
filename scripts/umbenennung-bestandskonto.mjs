#!/usr/bin/env node
/**
 * CoS-E-100 §3 — Was zeigt ein Bestandskonto nach der Umbenennung?
 *
 * Der Chief of Staff fragt: der gedruckte Engine-Titel steht an bis zu drei
 * Stellen (Engine-`beschreibung`, Katalogzeile `default-prices.ts`, Vorlage
 * `preise-vorlagen.ts`). Wird umbenannt — was sieht ein Konto, das den ALTEN
 * Titel als eigene Preiszeile gespeichert hat?
 *
 * Gemessen wird mit DEMSELBEN Weg wie der Angebots-Endpunkt
 * (`src/app/api/angebot-generieren/route.ts` Z. 85):
 *   findePreisposition(beschreibung, einheit,
 *     katalog.filter(p => preisKategoriePasstZuGewerk(p.category,
 *                                 gewerkFuerPosition(beschreibung, undefined))))
 *
 * Drei Szenarien je Zeile:
 *   A  Bestandskonto (Preiszeilen tragen die ALTEN Titel), Engine NEU
 *   B  Neukonto (Preiszeilen tragen die NEUEN Titel), Engine NEU
 *   0  Heute: Bestandskonto, Engine ALT  — die Vergleichsgrundlage
 */
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { createJiti } from 'jiti'

const ROOT = process.env.PROJEKT_ROOT
const jiti = createJiti(import.meta.url, { alias: { '@': path.join(ROOT, 'src') } })

const { findePreisposition } = await jiti.import(path.join(ROOT, 'src/lib/preis-matcher.ts'))
const { DEFAULT_PRICES } = await jiti.import(path.join(ROOT, 'src/lib/default-prices.ts'))
const { preisKategoriePasstZuGewerk } = await jiti.import(path.join(ROOT, 'src/lib/default-price-selection.ts'))
const { gewerkFuerPosition } = await jiti.import(path.join(ROOT, 'src/lib/positions-gewerk.ts'))
const { STANDARD_FAMILIEN } = await jiti.import(path.join(ROOT, 'src/lib/katalog-standard.ts'))

// Nr, alt, neu, einheit — Einheit aus dem Quelltext der Engine gegriffen,
// Titel wortgleich aus DC-145 (design-check.md ab Z. 16450).
const ZEILEN = [
  [ 1, 'Ausgleichsmasse einbringen (45 mm)', 'Ausgleichsmasse einbringen — 45 mm', 'm²'],
  [ 2, 'Boden abdecken (Abdeckvlies)', 'Boden abdecken — mit Vlies', 'Pauschale'],
  [ 3, 'Boden abdecken (Abdeckvlies)', 'Boden abdecken — mit Vlies', 'm²'],
  [ 4, 'Fugen thermisch verschweißen (inkl. Schweißdraht)', 'Fugen thermisch verschweißen — Schweißdraht enthalten', 'lfdm'],
  [ 5, 'Alten Teppichboden entfernen (verklebt)', 'Alten Teppichboden entfernen — verklebt', 'm²'],
  [ 6, 'Heizkörper lackieren (2× Anstrich)', 'Heizkörper lackieren — 2× Anstrich', 'Stück'],
  [ 7, 'Estrich grundieren (Haftgrund)', 'Estrich mit Haftgrund grundieren', 'm²'],
  [ 8, 'Fassade reinigen (druckwaschen)', 'Fassade reinigen — mit Hochdruck', 'm²'],
  [ 9, 'Wand streichen 2x (Blau, Zone oben)', 'Wand streichen — oberer Bereich, Blau, 2× Anstrich', 'm²'],
  [10, 'Wand streichen 2x (ohne Akzentwand)', 'Wand streichen — ohne Akzentwand, 2× Anstrich', 'm²'],
  [11, 'Wand streichen 2x (Zone oben)', 'Wand streichen — oberer Bereich, 2× Anstrich', 'm²'],
  [12, 'Fenster lackieren (Lack, 2× Anstrich)', 'Fenster lackieren — Lack, 2× Anstrich', 'Stück'],
  [13, 'Fenster lackieren (Ölfarbe, 2× Anstrich)', 'Fenster lackieren — Ölfarbe, 2× Anstrich', 'Stück'],
  [14, 'Gerüst stellen (Pauschale)', 'Gerüst stellen', 'Pauschale'],
  [15, 'Grundieren (Tiefengrund)', 'Grundieren — Tiefengrund', 'm²'],
  [16, 'Lasur auftragen (transparent)', 'Lasur auftragen — transparent', 'lfdm'],
  [17, 'Parkett abschleifen (2 Schleifgänge)', 'Parkett abschleifen — 2 Schleifgänge', 'm²'],
  [18, 'Parkett ölen (maschinell, 1-lagig)', 'Parkett ölen — maschinell, 1 Lage', 'm²'],
  [19, 'Parkett versiegeln (Lack, 2-lagig)', 'Parkett versiegeln — Lack, 2 Lagen', 'm²'],
  [20, 'Silikatfarbe auftragen (2×)', 'Silikatfarbe auftragen — 2×', 'm²'],
  [21, 'Sockelleisten entfernen (alt)', 'Alte Sockelleisten entfernen', 'lfdm'],
  [22, 'Sockelleisten lackieren (2× Anstrich)', 'Sockelleisten lackieren — 2× Anstrich', 'lfdm'],
  [23, 'Spachteltechnik (Betonoptik)', 'Spachteltechnik in Betonoptik', 'm²'],
  [24, 'Türen lackieren (2× Anstrich)', 'Türen lackieren — 2× Anstrich', 'Stück'],
  [25, 'Untergrund schleifen (Unebenheiten, Kleberreste)', 'Untergrund schleifen — Unebenheiten und Kleberreste', 'm²'],
  [26, 'Untergrundprüfung (Ebenheit, Feuchte, Tragfähigkeit)', 'Untergrundprüfung — Ebenheit, Feuchte, Tragfähigkeit', 'Pauschale'],
  [27, 'Wände schleifen nach Q2', 'Wände schleifen — normal (Q2)', 'm²'],
  [28, 'Wände schleifen nach Q3', 'Wände schleifen — fein (Q3)', 'm²'],
  [29, 'Wände schleifen nach Q4', 'Wände schleifen — glatt (Q4)', 'm²'],
  [30, 'Wände spachteln Q2', 'Wände spachteln — normal verspachtelt (Q2)', 'm²'],
  [31, 'Wände spachteln Q3', 'Wände spachteln — fein verspachtelt (Q3)', 'm²'],
  [32, 'Wände spachteln Q4', 'Wände spachteln — glatt verspachtelt (Q4)', 'm²'],
  [33, 'Decke streichen 2x', 'Decke streichen — 2× Anstrich', 'm²'],
  [34, 'Dachschrägen streichen 2x', 'Dachschrägen streichen — 2× Anstrich', 'm²'],
  [35, 'Fassadenfläche streichen 2x', 'Fassadenfläche 2× streichen', 'm²'],
  [36, 'Kniestockwände streichen 2x', 'Kniestockwände streichen — 2× Anstrich', 'm²'],
]

function treffer(titel, einheit, katalog) {
  const gewerk = gewerkFuerPosition(titel, undefined)
  const gefiltert = katalog.filter(p => preisKategoriePasstZuGewerk(p.category, gewerk))
  const t = findePreisposition(titel, einheit, gefiltert)
  return { gewerk, t }
}
const eur = n => (n === null || n === undefined) ? '0,00 €' : n.toFixed(2).replace('.', ',') + ' €'
const z = t => t ? t.position.title : '— kein Treffer —'
const p = t => t ? t.position.unit_price : null

// ── Bestandskonto: der Katalog von heute, so wie er bei einem bestehenden
//    Konto in `price_items` liegt. Nichts umbenannt.
const KONTO_ALT = DEFAULT_PRICES.map(x => ({ ...x, id: x.title, unit_price: x.price ?? x.unit_price }))

// ── Neukonto: derselbe Katalog, aber die Katalogzeilen, die WORTGLEICH mit
//    einem „Ist"-Titel sind, tragen den neuen Titel.
const UMBENENNUNG = new Map(ZEILEN.map(([, alt, neu]) => [alt, neu]))
const KONTO_NEU = KONTO_ALT.map(x => UMBENENNUNG.has(x.title) ? { ...x, title: UMBENENNUNG.get(x.title) } : x)
const BETROFFEN = KONTO_ALT.filter(x => UMBENENNUNG.has(x.title)).map(x => x.title)

console.log('Katalogzeilen, die wortgleich mit einem Ist-Titel sind: ' + new Set(BETROFFEN).size)
console.log([...new Set(BETROFFEN)].map(t => '  · ' + t).join('\n'))

// ── Exakt-String-Kopplung: welche Standardzeile hängt an einem Titel, der
//    umbenannt würde?
const kollision = STANDARD_FAMILIEN.filter(f => UMBENENNUNG.has(f.standard))
console.log('\nStandardzeilen (katalog-standard.ts), die einen umbenannten Titel exakt vergleichen: ' + kollision.length)
kollision.forEach(f => console.log('  🔴 ' + f.standard))

let gleich = 0, anders = 0, leer = 0
const auffaellig = []
console.log('\n| # | Titel heute | 0: heute | A: Bestandskonto, Engine neu | B: Neukonto, Engine neu |')
console.log('|---|---|---|---|---|')
for (const [nr, alt, neu, einheit] of ZEILEN) {
  const t0 = treffer(alt, einheit, KONTO_ALT)
  const tA = treffer(neu, einheit, KONTO_ALT)
  const tB = treffer(neu, einheit, KONTO_NEU)
  const f = x => `${z(x.t)} · ${eur(p(x.t))}${x.t ? ' · ' + x.t.score.toFixed(2) : ''}`
  console.log(`| ${nr} | \`${alt}\` | ${f(t0)} | ${f(tA)} | ${f(tB)} |`)

  const preisGleichA = p(t0.t) === p(tA.t)
  const zeileGleichA = z(t0.t) === z(tA.t)
  if (!t0.t && !tA.t) leer++
  else if (zeileGleichA && preisGleichA) gleich++
  else { anders++; auffaellig.push([nr, alt, 'A', `${z(t0.t)} ${eur(p(t0.t))} → ${z(tA.t)} ${eur(p(tA.t))}`]) }

  // B gegen 0: dieselbe Zeile (ggf. unter neuem Namen), derselbe Preis?
  const erwarteterNameB = UMBENENNUNG.get(z(t0.t)) ?? z(t0.t)
  if ((t0.t || tB.t) && (z(tB.t) !== erwarteterNameB || p(t0.t) !== p(tB.t))) {
    auffaellig.push([nr, alt, 'B', `${z(t0.t)} ${eur(p(t0.t))} → ${z(tB.t)} ${eur(p(tB.t))}`])
  }
  if (t0.gewerk !== tA.gewerk) auffaellig.push([nr, alt, 'Gewerk', `${t0.gewerk ?? 'kein Gewerk'} → ${tA.gewerk ?? 'kein Gewerk'}`])
}

console.log(`\nA (Bestandskonto, Engine neu): ${gleich} gleiche Zeile + gleicher Preis · ${anders} abweichend · ${leer} hat heute schon keinen Preis`)
console.log('\nAuffällig:')
if (!auffaellig.length) console.log('  keine')
auffaellig.forEach(([nr, alt, sz, was]) => console.log(`  ${sz}  Nr. ${nr}  ${alt}  →  ${was}`))

// ── Exakt-String-Kopplung Nr. 2: `katalogPreis()` in preis-ableitung.ts
//    vergleicht `DEFAULT_PRICES.find(p => p.title === titel)` gegen eine
//    fest eingetragene Liste von `katalogTitel`. Wird eine Katalogzeile
//    umbenannt, findet dieser Vergleich sie nicht mehr.
const { readFileSync } = await import('node:fs')
const quelle = readFileSync(path.join(ROOT, 'src/lib/preis-ableitung.ts'), 'utf8')
const katalogTitel = [...quelle.matchAll(/katalogTitel:\s*'([^']+)'/g)].map(m => m[1])
const betroffen2 = katalogTitel.filter(t => UMBENENNUNG.has(t))
console.log(`\n\`katalogTitel\` in preis-ableitung.ts: ${katalogTitel.length}, davon in der Umbenennungsliste: ${betroffen2.length}`)
betroffen2.forEach(t => console.log('  🔴 ' + t))
// Gegenprobe: findet katalogPreis() heute jeden dieser Titel?
const fehlt = katalogTitel.filter(t => !KONTO_ALT.some(p => p.title === t))
console.log(`\`katalogTitel\`, die HEUTE SCHON keine Katalogzeile treffen: ${fehlt.length}`)
fehlt.forEach(t => console.log('  ⚠ ' + t))
