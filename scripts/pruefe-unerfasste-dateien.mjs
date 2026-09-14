#!/usr/bin/env node
/**
 * CoS-P-014 Nachlauf 2 (Platform & Integrations Engineer, 2026-09-14) —
 * Warnung vor unerfassten Dateien, bevor etwas als "ausgeliefert" gemeldet
 * wird.
 *
 * Der Auslöser (13.–14.09.2026): 13 Produktivdateien, 21 Tests und 3
 * DB-Migrationen aus der "Manfred-Welle" waren untracked — existierten also
 * nur auf Sandys Rechner, nie in Git. Acht Produktions-Builds in Folge sind
 * deshalb 17 Stunden lang unbemerkt fehlgeschlagen, weil "fertig" und
 * "eingecheckt" zwei verschiedene Dinge waren und das niemand vor dem Push
 * geprüft hat.
 *
 * Nachtrag vom selben Tag, nach dem ersten echten Einsatz: die erste
 * Fassung blockierte JEDE Abweichung von `git status` — auch bereits
 * getrackte, nur noch nicht committete Änderungen (nichts davon ist
 * verloren, `git diff` zeigt sie jederzeit) und reine docs/-Änderungen (die
 * haben mit `docs-sichern.mjs` schon einen eigenen Schutz). Weil hier
 * mehrere Rollen gleichzeitig im selben Arbeitsordner arbeiten, ist der
 * Baum fast nie wirklich "sauber" — das hätte fast jeden Push blockiert,
 * unabhängig davon, ob er selbst ein Problem hat (genau so beim ersten
 * echten Aufruf passiert: drei fremde, laufende Arbeiten haben Sandys Push
 * blockiert, obwohl ihre eigene Änderung vollständig war). Jetzt genauer,
 * näher am eigentlichen CoS-P-014-Muster:
 *
 *   BLOCKIERT (exit 1) nur, was komplett unbekannt für Git ist (`??`) UND
 *   außerhalb von docs/ liegt — genau die Art Datei, die letztes Mal 17
 *   Stunden lang niemand bemerkt hat, weil sie nirgends aufschien.
 *
 *   WARNT NUR (exit 0, blockiert nicht) bei bereits getrackten, aber noch
 *   nicht committeten Änderungen, und bei allem unter docs/ — sichtbar,
 *   aber nicht blockierend, weil das der normale Zwischenstand paralleler
 *   Arbeit ist, nicht das Risiko von CoS-P-014.
 *
 * Zwei Aufrufarten:
 *   node scripts/pruefe-unerfasste-dateien.mjs   — von Hand, jederzeit
 *   npm run pruefe:unerfasst                      — dasselbe, kürzer
 *
 * Läuft außerdem automatisch als Git-Hook vor jedem `git push`
 * (.git/hooks/pre-push). Im Notfall umgehbar mit `git push --no-verify`.
 */
import { execFileSync } from 'node:child_process'

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf-8' })
}

function status() {
  return git('status', '--porcelain').split(/\r?\n/).filter(Boolean)
}

function pfadVon(zeile) {
  const roh = zeile.slice(3)
  const pfeil = roh.indexOf(' -> ')
  return pfeil >= 0 ? roh.slice(pfeil + 4) : roh
}

const zeilen = status()

if (zeilen.length === 0) {
  console.log('✅ Sauber — git status zeigt nichts Unerfasstes.')
  process.exit(0)
}

const eintraege = zeilen.map(z => ({ zeile: z, pfad: pfadVon(z), untracked: z.startsWith('??') }))

const blockierend = eintraege.filter(e => e.untracked && !e.pfad.startsWith('docs/'))
const nurWarnung = eintraege.filter(e => !blockierend.includes(e))

if (nurWarnung.length > 0) {
  console.log(`ℹ️  ${nurWarnung.length} Datei(en) unfertig, blockiert den Push aber nicht (docs/ oder bereits getrackt):`)
  for (const e of nurWarnung) console.log('  ' + e.zeile)
}

if (blockierend.length === 0) {
  process.exit(0)
}

console.error('\n⚠️  ACHTUNG — Push blockiert:')
console.error(`\n${blockierend.length} Datei(en) komplett unbekannt für Git, außerhalb von docs/ (existieren nur hier auf dem Rechner, nie gepusht):`)
for (const e of blockierend) console.error('  ' + e.pfad)

console.error('\nGenau das war die Ursache von CoS-P-014 (13.–14.09.2026): 17 Stunden')
console.error('lang unbemerkt acht fehlgeschlagene Produktions-Deploys, weil neue')
console.error('Dateien nie eingecheckt waren.')
console.error('\nBitte erst git add + commit dafür (oder bewusst in .gitignore')
console.error('eintragen, falls es das wirklich nicht sein soll) — danach erst')
console.error('pushen. Falls die Datei bewusst (noch) nicht dazugehört, z. B.')
console.error('weil sie zu einer anderen, noch laufenden Arbeit gehört: einmal')
console.error('bewusst git push --no-verify.')

process.exit(1)
