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
 * geprüft hat. Dieses Skript prüft genau das — automatisch, nicht auf
 * Zuruf.
 *
 * Zwei Aufrufarten:
 *   node scripts/pruefe-unerfasste-dateien.mjs   — von Hand, jederzeit
 *   npm run pruefe:unerfasst                      — dasselbe, kürzer
 *
 * Läuft außerdem automatisch als Git-Hook vor jedem `git push`
 * (.git/hooks/pre-push) — der Push wird dann blockiert, solange `git
 * status` irgendetwas Unerfasstes zeigt. Im Notfall bewusst umgehbar mit
 * `git push --no-verify`, aber dann bitte mit Absicht, nicht aus Eile.
 *
 * Bewusst einfach gehalten: prüft den GESAMTEN Arbeitsstand (nicht nur
 * bestimmte Ordner) — genau das hätte den CoS-P-014-Fund am 13.09. sofort
 * sichtbar gemacht, vor dem ersten fehlgeschlagenen Deploy statt erst nach
 * acht.
 */
import { execFileSync } from 'node:child_process'

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf-8' })
}

function geaendertUnbekannt() {
  const out = git('status', '--porcelain')
  return out.split(/\r?\n/).filter(Boolean)
}

const zeilen = geaendertUnbekannt()

if (zeilen.length === 0) {
  console.log('✅ Sauber — git status zeigt nichts Unerfasstes. Alles, was hier liegt, ist auch in Git.')
  process.exit(0)
}

const untracked = zeilen.filter(z => z.startsWith('??'))
const geaendert = zeilen.filter(z => !z.startsWith('??'))

console.error('⚠️  ACHTUNG — nicht alles ist erfasst:')

if (untracked.length > 0) {
  console.error(`\n${untracked.length} Datei(en) komplett unbekannt für Git (existieren nur hier auf dem Rechner, nie gepusht):`)
  for (const z of untracked) console.error('  ' + z.slice(3))
}

if (geaendert.length > 0) {
  console.error(`\n${geaendert.length} Datei(en) geändert oder gelöscht, aber noch nicht committet:`)
  for (const z of geaendert) console.error('  ' + z)
}

console.error('\nGenau das war die Ursache von CoS-P-014 (13.–14.09.2026): 17 Stunden')
console.error('lang unbemerkt acht fehlgeschlagene Produktions-Deploys, weil "fertig"')
console.error('und "eingecheckt" zwei verschiedene Dinge waren.')
console.error('\nBitte erst git add + commit für alles, was dazugehört (oder bewusst in')
console.error('.gitignore eintragen, falls es das wirklich nicht sein soll) — danach')
console.error('erst als "ausgeliefert" melden bzw. pushen.')

process.exit(1)
