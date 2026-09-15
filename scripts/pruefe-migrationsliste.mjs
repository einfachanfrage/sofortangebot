#!/usr/bin/env node
/**
 * Platform & Integrations Engineer, 2026-09-15 (aus dem Engineering-Austausch,
 * siehe docs/arbeitsreihenfolge.md "Platform" Nr. 2) — Abgleich zwischen
 * `supabase/check_migrationen.sql` und der Realität.
 *
 * Der Check-Skript selbst (im Supabase SQL-Editor ausgeführt) sagt nur, ob
 * das ERGEBNIS einer Migration in der Datenbank angekommen ist. Er prüft
 * nicht, ob die Migration, die er dafür nennt, überhaupt als Datei existiert
 * und ob diese Datei Git bekannt ist. Genau diese Lücke hätte laut Head of
 * Product Engineering am 15.09. mehr gezeigt als nur "eine unbekannte Datei
 * ist da": nämlich, dass das Repository sie bereits als vorhanden führte.
 *
 * Zwei Prüfungen, pro Migration aus check_migrationen.sql:
 *   1. Existiert `supabase/migrations/<name>.sql` auf der Platte?
 *   2. Ist diese Datei Git bekannt (`git ls-files`), nicht nur lokal da?
 *
 * Dazu, informativ (WARNT NUR, blockiert nicht — anderer Zweck als oben):
 *   3. Migrationsdateien, die auf der Platte/in Git existieren, aber in
 *      check_migrationen.sql noch gar nicht gelistet sind (normaler
 *      Zwischenstand, wenn der Check-Skript-Eintrag noch nachgetragen
 *      werden muss — kein Fehler für sich, nur sichtbar machen).
 *
 * Aufruf: node scripts/pruefe-migrationsliste.mjs
 *         npm run pruefe:migrationsliste
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const REPO_ROOT = join(import.meta.dirname, '..')
const CHECK_DATEI = join(REPO_ROOT, 'supabase', 'check_migrationen.sql')
const MIGRATIONS_ORDNER = join(REPO_ROOT, 'supabase', 'migrations')

function git(...args) {
  return execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf-8' })
}

function gitTrackedeMigrationen() {
  return new Set(
    git('ls-files', 'supabase/migrations')
      .split(/\r?\n/)
      .filter(z => z.endsWith('.sql'))
      .map(z => z.slice('supabase/migrations/'.length, -'.sql'.length))
  )
}

const checkInhalt = readFileSync(CHECK_DATEI, 'utf-8')

// Migrationsnamen aus den VALUES-Tupeln extrahieren: jede Zeile der Form
// "( 1, '20260608205834_add_plan', ...)" — erstes Textliteral je Zeile.
const zeilenMitMigration = [...checkInhalt.matchAll(/^\s*\(\s*\d+,\s*'([^']+)'/gm)]
const gelisteteMigrationen = zeilenMitMigration.map(m => m[1])

if (gelisteteMigrationen.length === 0) {
  console.error('⚠️  Keine Migrationen aus check_migrationen.sql extrahiert — Format geändert?')
  process.exit(1)
}

const getrackt = gitTrackedeMigrationen()

const fehlendAlsDatei = []
const nichtGitBekannt = []

for (const name of gelisteteMigrationen) {
  const pfad = join(MIGRATIONS_ORDNER, `${name}.sql`)
  const existiertAlsDatei = existsSync(pfad)
  const istGitBekannt = getrackt.has(name)

  if (!existiertAlsDatei) fehlendAlsDatei.push(name)
  else if (!istGitBekannt) nichtGitBekannt.push(name)
}

// Bonus, nur informativ: auf der Platte/in Git vorhandene Migrationen, die
// check_migrationen.sql noch nicht kennt (normaler Nachtrags-Rückstand).
const geplant = new Set(gelisteteMigrationen)
const nochNichtGelistet = [...getrackt].filter(n => !geplant.has(n)).sort()

let exitCode = 0

if (fehlendAlsDatei.length > 0) {
  exitCode = 1
  console.error(`❌ ${fehlendAlsDatei.length} in check_migrationen.sql gelistete Migration(en) existieren nicht als Datei unter supabase/migrations/:`)
  for (const n of fehlendAlsDatei) console.error('  ' + n)
}

if (nichtGitBekannt.length > 0) {
  exitCode = 1
  console.error(`❌ ${nichtGitBekannt.length} Migration(en) liegen als Datei da, sind aber Git nicht bekannt (nur lokal, nie eingecheckt):`)
  for (const n of nichtGitBekannt) console.error('  ' + n)
}

if (exitCode === 1) {
  console.error('\nGenau diese Fehlerklasse (Datei da, aber nicht getrackt) hat CoS-P-014')
  console.error('verursacht — bitte erst git add + commit, dann erneut prüfen.')
}

if (nochNichtGelistet.length > 0) {
  console.log(`ℹ️  ${nochNichtGelistet.length} Migration(en) existieren und sind Git bekannt, stehen aber noch nicht in check_migrationen.sql (kein Fehler, nur zur Info):`)
  for (const n of nochNichtGelistet) console.log('  ' + n)
}

if (exitCode === 0 && nochNichtGelistet.length === 0) {
  console.log(`✅ Alle ${gelisteteMigrationen.length} Migrationen aus check_migrationen.sql existieren als Datei und sind Git bekannt.`)
}

process.exit(exitCode)
