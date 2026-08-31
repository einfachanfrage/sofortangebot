#!/usr/bin/env node
/**
 * Gleicht den Preiskatalog der bestehenden Betriebe mit `default-prices.ts` ab.
 *
 * Hintergrund (Audit 2026-08-31): Über Monate sind Positionen zu
 * `default-prices.ts` dazugekommen, ohne dass eine Migration sie in die
 * Preisdatenbanken der bereits angelegten Betriebe nachgezogen hätte. Neue
 * Konten bekamen sie beim Onboarding, bestehende nie. Ergebnis: Der Code
 * „kennt" eine Position, das echte Konto nicht — und im Angebot steht
 * 0,00 € mit „Preis fehlt". Genau so ist der Erschwerniszuschlag Raumhöhe
 * aufgefallen (PM-008/PM-015), und genau so fehlen live u. a.
 * „Dachschrägen streichen 2x" und „Kniestockwände streichen 1x/2x/3x".
 *
 * Zwei bewusste Entscheidungen:
 *
 * 1. Der Dubletten-Schutz vergleicht Gewerk-Präfix + Bezeichnung + Einheit,
 *    NICHT die vollständige Rubrik. Rubriken sind über die Zeit umbenannt
 *    worden (z. B. „Maler – Stuck & Dekorative Techniken" vs. live „Maler –
 *    Dekorative Techniken"); ein Vergleich auf die volle Rubrik würde
 *    dieselbe Leistung ein zweites Mal anlegen.
 * 2. Eingefügt wird nur in Betriebe, die dieses Gewerk schon führen. Ein
 *    Maler-Konto bekommt keine Aufzugstechnik untergeschoben.
 *
 * Persönlich geänderte Preise bleiben unangetastet — es wird nur ergänzt,
 * nie überschrieben.
 *
 * Aufruf: node scripts/katalog-abgleich-migration.mjs [zielpfad]
 */
import { readFileSync, writeFileSync } from 'node:fs'

const ziel = process.argv[2] ?? 'supabase/migrations/20260831093000_katalog_abgleich.sql'
const quelle = readFileSync('src/lib/default-prices.ts', 'utf8')

const eintraege = []
const kategorieMuster = /category:\s*'((?:[^'\\]|\\.)*)'/g
let treffer
while ((treffer = kategorieMuster.exec(quelle))) {
  const block = quelle.slice(treffer.index, treffer.index + 900)
  const title = block.match(/title:\s*'((?:[^'\\]|\\.)*)'/)
  const unit = block.match(/unit:\s*'((?:[^'\\]|\\.)*)'/)
  const preis = block.match(/unit_price:\s*([0-9.]+)/)
  if (!title || !unit || !preis) throw new Error(`Unvollständiger Eintrag bei "${treffer[1]}"`)
  eintraege.push({ category: treffer[1], title: title[1], unit: unit[1], unit_price: Number(preis[1]) })
}
if (eintraege.length < 2000) throw new Error(`Nur ${eintraege.length} Einträge gefunden — Muster prüft nicht mehr richtig`)

const praefixVon = kategorie => (kategorie.includes(' – ') ? kategorie.split(' – ')[0] : kategorie)

const nachGewerk = new Map()
for (const e of eintraege) {
  const p = praefixVon(e.category)
  if (!nachGewerk.has(p)) nachGewerk.set(p, [])
  nachGewerk.get(p).push(e)
}

const esc = wert => String(wert).replaceAll("'", "''")

const bloecke = [...nachGewerk.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([praefix, zeilen]) => {
  const values = zeilen.map(z =>
    `  ('${esc(z.category)}', '${esc(z.title)}', '${esc(z.unit)}', ${z.unit_price.toFixed(2)}::numeric)`).join(',\n')
  // "Allgemein" hat keinen "– "-Teil; die Zugehörigkeit prüft dort die Rubrik selbst.
  const gewerkFilter = praefix === 'Allgemein'
    ? `existing_trade.category = 'Allgemein'`
    : `existing_trade.category like '${esc(praefix)} %'`
  return `-- ── ${praefix} (${zeilen.length} Katalogzeilen) ──────────────────────────────
insert into price_items (company_id, category, title, unit, unit_price)
select c.id, p.category, p.title, p.unit, p.unit_price
from companies c
cross join (values
${values}
) as p(category, title, unit, unit_price)
where exists (
    select 1 from price_items existing_trade
    where existing_trade.company_id = c.id and ${gewerkFilter}
  )
  and not exists (
    select 1 from price_items existing
    where existing.company_id = c.id
      and split_part(existing.category, ' – ', 1) = '${esc(praefix)}'
      and lower(btrim(existing.title)) = lower(btrim(p.title))
      and lower(btrim(existing.unit)) = lower(btrim(p.unit))
  );`
})

const kopf = `-- Katalog-Abgleich: fehlende Standardpositionen für BESTEHENDE Betriebe
-- nachziehen. Erzeugt von scripts/katalog-abgleich-migration.mjs am
-- ${new Date().toISOString().slice(0, 10)} aus src/lib/default-prices.ts (${eintraege.length} Zeilen,
-- ${nachGewerk.size} Gewerke).
--
-- Warum: Positionen sind über Monate in default-prices.ts dazugekommen, ohne
-- dass eine Migration sie in bereits angelegte Konten nachgezogen hätte. Neue
-- Konten bekamen sie beim Onboarding, bestehende nie — im Angebot steht dann
-- 0,00 € mit "Preis fehlt", obwohl der Code die Position kennt.
--
-- Ergänzt nur, überschreibt nie: persönlich geänderte Preise bleiben stehen.
-- Idempotent — ein zweiter Lauf fügt nichts erneut ein.

`

writeFileSync(ziel, kopf + bloecke.join('\n\n') + '\n', 'utf8')
console.log(`${ziel} geschrieben: ${eintraege.length} Zeilen in ${nachGewerk.size} Gewerken`)
for (const [p, z] of [...nachGewerk.entries()].sort(([a],[b]) => a.localeCompare(b))) console.log(`  ${p}: ${z.length}`)
