import { readFileSync, writeFileSync } from 'node:fs'

const [prefix, tradeId, expectedCount, targetFile] = process.argv.slice(2)

if (!prefix || !tradeId || !expectedCount || !targetFile) {
  throw new Error(
    'Usage: node scripts/generate-price-catalog-migration.mjs <prefix> <trade-id> <count> <target-file>',
  )
}

const source = readFileSync('src/lib/default-prices.ts', 'utf8')
const rowPattern =
  /\{ category: '([^']+)', title: '([^']+)', unit: '([^']+)', unit_price: ([0-9.]+) \},/g
const multilineRowPattern =
  /\{\s*category: '([^']+)',\s*title: '([^']+)',\s*unit: '([^']+)',\s*unit_price: ([0-9.]+),[\s\S]*?\n\s*\},/g
const rows = [...source.matchAll(rowPattern), ...source.matchAll(multilineRowPattern)]
  .map(([, category, title, unit, price]) => ({ category, title, unit, price }))
  .filter(row => row.category.startsWith(`${prefix} – `))

if (rows.length !== Number(expectedCount)) {
  throw new Error(`Expected ${expectedCount} ${prefix} rows, found ${rows.length}`)
}

const escapeSql = value => value.replaceAll("'", "''")
const values = rows
  .map(
    row =>
      `  ('${escapeSql(row.category)}', '${escapeSql(row.title)}', '${escapeSql(row.unit)}', ${Number(row.price).toFixed(2)}::numeric)`,
  )
  .join(',\n')

const sql = `-- Vollständiger ${prefix}-Katalog für neue und bestehende Betriebe.
-- Persönlich geänderte Preise bleiben unangetastet; ergänzt werden nur fehlende
-- Kombinationen aus Bezeichnung und Einheit.

insert into price_items (company_id, category, title, unit, unit_price)
select c.id, p.category, p.title, p.unit, p.unit_price
from companies c
cross join (values
${values}
) as p(category, title, unit, unit_price)
where (
    '${escapeSql(tradeId)}' = any(coalesce(c.gewerke, '{}'::text[]))
    or exists (
      select 1 from price_items existing_trade
      where existing_trade.company_id = c.id
        and existing_trade.category like '${escapeSql(prefix)} %'
    )
  )
  and not exists (
    select 1
    from price_items existing
    where existing.company_id = c.id
      and lower(existing.title) = lower(p.title)
      and lower(existing.unit) = lower(p.unit)
  );
`

writeFileSync(targetFile, sql, 'utf8')
