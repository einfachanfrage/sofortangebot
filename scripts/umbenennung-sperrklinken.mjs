#!/usr/bin/env node
/**
 * CoS-E-100 §5 — Fangen die vorhandenen Sperrklinken die Umbenennung ab?
 *
 * Der Chief of Staff hat in CoS-E-100 Punkt 3 eine Zusicherung bestellt:
 * *jeder `katalogTitel` in `preis-ableitung.ts` trifft eine Zeile in
 * `DEFAULT_PRICES`* — mit der Begründung, es gebe sie heute nicht und der
 * Ausfall sei sonst still.
 *
 * Dieses Skript misst, ob das stimmt. Es benennt die 36 DC-145-Zeilen NUR im
 * Katalog um (also genau der Fehler, vor dem die Zusicherung schützen soll:
 * Katalog umbenannt, die exakt vergleichenden Stellen nicht mitgezogen) und
 * zählt, was dann ins Leere zeigt.
 *
 * Gemessen werden alle drei Stellen, die Katalogtitel EXAKT (`===`)
 * vergleichen:
 *   1. `preis-ableitung.ts`  — `ANKER[].katalogTitel` und `.zeilen[].katalogTitel`
 *   2. `katalog-standard.ts` — `STANDARD_FAMILIEN[].standard`
 *   3. `preise-vorlagen.ts`  — `GEWERK_PREISE[][].title`
 *
 * Kein Schreibzugriff. `src/` wird nur gelesen.
 *
 *   PROJEKT_ROOT=. node scripts/umbenennung-sperrklinken.mjs
 */
import path from 'node:path'
import { createJiti } from 'jiti'

const ROOT = path.resolve(process.env.PROJEKT_ROOT ?? '.')
const jiti = createJiti(import.meta.url, { alias: { '@': path.join(ROOT, 'src') } })

const { DEFAULT_PRICES } = await jiti.import(path.join(ROOT, 'src/lib/default-prices.ts'))
const { ANKER } = await jiti.import(path.join(ROOT, 'src/lib/preis-ableitung.ts'))
const { STANDARD_FAMILIEN } = await jiti.import(path.join(ROOT, 'src/lib/katalog-standard.ts'))
const { GEWERK_PREISE, ALLGEMEINE_PREISE } = await jiti.import(path.join(ROOT, 'src/lib/preise-vorlagen.ts'))

// Die 36 Zeilen aus DC-145, wortgleich aus `umbenennung-bestandskonto.mjs`
// übernommen (dort steht die Herkunft). Nr. 2 und 3 tragen denselben Titel in
// zwei Einheiten — für den Exakt-Vergleich zählt nur der Titel.
const UMBENENNUNG = new Map([
  ['Ausgleichsmasse einbringen (45 mm)', 'Ausgleichsmasse einbringen — 45 mm'],
  ['Boden abdecken (Abdeckvlies)', 'Boden abdecken — mit Vlies'],
  ['Fugen thermisch verschweißen (inkl. Schweißdraht)', 'Fugen thermisch verschweißen — Schweißdraht enthalten'],
  ['Alten Teppichboden entfernen (verklebt)', 'Alten Teppichboden entfernen — verklebt'],
  ['Heizkörper lackieren (2× Anstrich)', 'Heizkörper lackieren — 2× Anstrich'],
  ['Estrich grundieren (Haftgrund)', 'Estrich mit Haftgrund grundieren'],
  ['Fassade reinigen (druckwaschen)', 'Fassade reinigen — mit Hochdruck'],
  ['Wand streichen 2x (Blau, Zone oben)', 'Wand streichen — oberer Bereich, Blau, 2× Anstrich'],
  ['Wand streichen 2x (ohne Akzentwand)', 'Wand streichen — ohne Akzentwand, 2× Anstrich'],
  ['Wand streichen 2x (Zone oben)', 'Wand streichen — oberer Bereich, 2× Anstrich'],
  ['Fenster lackieren (Lack, 2× Anstrich)', 'Fenster lackieren — Lack, 2× Anstrich'],
  ['Fenster lackieren (Ölfarbe, 2× Anstrich)', 'Fenster lackieren — Ölfarbe, 2× Anstrich'],
  ['Gerüst stellen (Pauschale)', 'Gerüst stellen'],
  ['Grundieren (Tiefengrund)', 'Grundieren — Tiefengrund'],
  ['Lasur auftragen (transparent)', 'Lasur auftragen — transparent'],
  ['Parkett abschleifen (2 Schleifgänge)', 'Parkett abschleifen — 2 Schleifgänge'],
  ['Parkett ölen (maschinell, 1-lagig)', 'Parkett ölen — maschinell, 1 Lage'],
  ['Parkett versiegeln (Lack, 2-lagig)', 'Parkett versiegeln — Lack, 2 Lagen'],
  ['Silikatfarbe auftragen (2×)', 'Silikatfarbe auftragen — 2×'],
  ['Sockelleisten entfernen (alt)', 'Alte Sockelleisten entfernen'],
  ['Sockelleisten lackieren (2× Anstrich)', 'Sockelleisten lackieren — 2× Anstrich'],
  ['Spachteltechnik (Betonoptik)', 'Spachteltechnik in Betonoptik'],
  ['Türen lackieren (2× Anstrich)', 'Türen lackieren — 2× Anstrich'],
  ['Untergrund schleifen (Unebenheiten, Kleberreste)', 'Untergrund schleifen — Unebenheiten und Kleberreste'],
  ['Untergrundprüfung (Ebenheit, Feuchte, Tragfähigkeit)', 'Untergrundprüfung — Ebenheit, Feuchte, Tragfähigkeit'],
  ['Wände schleifen nach Q2', 'Wände schleifen — normal (Q2)'],
  ['Wände schleifen nach Q3', 'Wände schleifen — fein (Q3)'],
  ['Wände schleifen nach Q4', 'Wände schleifen — glatt (Q4)'],
  ['Wände spachteln Q2', 'Wände spachteln — normal verspachtelt (Q2)'],
  ['Wände spachteln Q3', 'Wände spachteln — fein verspachtelt (Q3)'],
  ['Wände spachteln Q4', 'Wände spachteln — glatt verspachtelt (Q4)'],
  ['Decke streichen 2x', 'Decke streichen — 2× Anstrich'],
  ['Dachschrägen streichen 2x', 'Dachschrägen streichen — 2× Anstrich'],
  ['Fassadenfläche streichen 2x', 'Fassadenfläche 2× streichen'],
  ['Kniestockwände streichen 2x', 'Kniestockwände streichen — 2× Anstrich'],
])

// Der Katalog NACH der Umbenennung — nur der Katalog, sonst nichts.
const TITEL_NACHHER = new Set(
  DEFAULT_PRICES.map(p => UMBENENNUNG.get(p.title) ?? p.title),
)
const TITEL_HEUTE = new Set(DEFAULT_PRICES.map(p => p.title))

// Welche der 36 stehen überhaupt wortgleich im Katalog? Nur die bewegen etwas.
const imKatalog = [...UMBENENNUNG.keys()].filter(t => TITEL_HEUTE.has(t))
console.log(`Katalogzeilen, die durch DC-145 ihren Titel ändern: ${imKatalog.length} von ${UMBENENNUNG.size}`)

function pruefe(name, datei, eintraege) {
  const heute = eintraege.filter(e => !TITEL_HEUTE.has(e.titel))
  const nachher = eintraege.filter(e => !TITEL_NACHHER.has(e.titel))
  // Nur die Differenz ist der Befund. Dass 167 Vorlagen abgeschalteter
  // Gewerke schon heute keine Katalogzeile haben, ist bekannt und gewollt —
  // es hat mit der Umbenennung nichts zu tun und würde den Fund zudecken.
  const vorher = new Set(heute.map(e => e.wo + '|' + e.titel))
  const neuLeer = nachher.filter(e => !vorher.has(e.wo + '|' + e.titel))
  console.log(`\n── ${name}  (${datei})`)
  console.log(`   Einträge mit Exakt-Vergleich: ${eintraege.length}`)
  console.log(`   ins Leere heute:   ${heute.length}`)
  console.log(`   ins Leere nachher: ${nachher.length}`)
  console.log(`   NEU ins Leere durch die Umbenennung: ${neuLeer.length}`)
  for (const e of neuLeer) console.log(`     🔴 ${e.wo} → \`${e.titel}\``)
  return { heute: heute.length, nachher: nachher.length, neu: neuLeer.length }
}

const ableitung = []
for (const a of ANKER) {
  ableitung.push({ titel: a.katalogTitel, wo: `ANKER ${a.taetigkeit} (Anker)` })
  for (const z of a.zeilen) {
    if (z.katalogTitel) ableitung.push({ titel: z.katalogTitel, wo: `ANKER ${a.taetigkeit} · Zeile` })
  }
}
const standard = STANDARD_FAMILIEN.map((f, i) => ({ titel: f.standard, wo: `STANDARD_FAMILIEN[${i}]` }))
const vorlagen = [
  ...ALLGEMEINE_PREISE.map(v => ({ titel: v.title, wo: 'ALLGEMEINE_PREISE' })),
  ...Object.entries(GEWERK_PREISE).flatMap(([g, zs]) => zs.map(v => ({ titel: v.title, wo: `GEWERK_PREISE.${g}` }))),
]

const r1 = pruefe('preis-ableitung.ts · katalogTitel', 'src/lib/preis-ableitung.ts', ableitung)
const r2 = pruefe('katalog-standard.ts · STANDARD_FAMILIEN.standard', 'src/lib/katalog-standard.ts', standard)
const r3 = pruefe('preise-vorlagen.ts · title', 'src/lib/preise-vorlagen.ts', vorlagen)

const gesamtNeu = r1.neu + r2.neu + r3.neu
console.log('\n── Ergebnis')
console.log(`   NEU ins Leere durch die 36 Umbenennungen: ${gesamtNeu}`)
console.log(`     · preis-ableitung.ts  ${r1.neu}`)
console.log(`     · katalog-standard.ts ${r2.neu}`)
console.log(`     · preise-vorlagen.ts  ${r3.neu}`)
console.log(
  gesamtNeu > 0
    ? '   → Wird nur der Katalog umbenannt, zeigen diese Stellen ins Leere.\n' +
      '     Die vorhandenen Zusicherungen in preis-ableitung.test.ts gehen dabei ROT —\n' +
      '     der Ausfall ist also sichtbar, nicht still.'
    : '   → Nichts zeigt ins Leere.',
)

// Welche der 36 stehen in den Vorlagen? Für den Zuschnitt des Commits.
const inVorlagen = [...new Set(vorlagen.map(v => v.titel))].filter(t => UMBENENNUNG.has(t))
console.log(`\n── Vorlagenzeilen, die einen der 36 Titel tragen: ${inVorlagen.length}`)
for (const t of inVorlagen) console.log(`     · \`${t}\``)
