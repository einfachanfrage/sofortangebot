#!/usr/bin/env node
/**
 * CoS-P-023 (Platform & Integrations Engineer, 2026-09-15) — isolierter
 * Checkout des tatsächlich gepushten Commits, als zweiter Baustein im
 * `pre-push`-Hook neben `pruefe-unerfasste-dateien.mjs`.
 *
 * Der Auslöser: Mehrere Rollen arbeiten gleichzeitig im selben Arbeitsordner
 * auf Sandys Rechner. Lint/TypeScript/Migrations-Abgleich direkt gegen
 * diesen gemeinsamen Ordner laufen zu lassen bringt ständig falsche
 * Blockaden — nicht weil der eigene, tatsächlich gepushte Stand ein Problem
 * hat, sondern weil eine ANDERE, gerade laufende Arbeit im selben Ordner
 * liegt (unfertige Datei, halb umgebauter Import, etc.), siehe die
 * "Nachtrag CoS-P-014 Nachlauf 2"-Erfahrung mit der ersten Hook-Fassung.
 *
 * Deshalb: ein zweiter, isolierter Git-Worktree wird auf genau den Commit
 * gebracht, der tatsächlich gepusht wird (nicht auf den Arbeitsordner-Stand),
 * und NUR dort laufen Lint, TypeScript und der Migrations-Abgleich. Was in
 * einer anderen Rolle gerade unfertig im Ordner liegt, sieht dieser Checkout
 * gar nicht — er kennt nur, was tatsächlich committet und gepusht wird.
 *
 * Der Worktree wird zwischen Aufrufen wiederverwendet (unter
 * `.git/pre-push-worktree`, selbst nicht Teil des normalen Arbeitsordners)
 * und `node_modules` wird per Verzeichnis-Link aus dem Hauptordner
 * eingebunden statt neu installiert (Junction unter Windows, Symlink sonst —
 * beides ohne Admin-/Sonderrechte). Dadurch bleibt es bei den akzeptierten
 * 6–15 Sekunden pro Push: nur der erste Aufruf legt Worktree + Link neu an,
 * jeder weitere Aufruf checkt nur den neuen Commit aus.
 *
 * Läuft NICHT die volle Testsuite und NICHT `next build` — beides würde das
 * Zeitbudget sprengen. Das bleibt Aufgabe der Server-CI
 * (`.github/workflows/ci.yml`); dieser Hook ist die schnelle Vorstufe davon,
 * gegen den tatsächlich gepushten Stand statt gegen den Arbeitsordner.
 *
 * Lint läuft dafür bewusst NUR über die Dateien, die dieser Push tatsächlich
 * verändert (`git diff --name-only <bisheriger Remote-Stand>..<gepushter
 * Commit>`), nicht über das gesamte Projekt — gemessen dauert
 * `eslint --max-warnings 110` über alle rund 250 Dateien allein schon
 * 25–35 Sekunden (in dieser Session gemessen, nicht geschätzt), das hätte
 * das von Sandy akzeptierte 6–15-Sekunden-Budget für sich allein gesprengt.
 * Über nur die geänderten Dateien liegt Lint im Bereich von ein bis wenigen
 * Sekunden. TypeScript lässt sich nicht sinnvoll auf einzelne Dateien
 * eingrenzen (Typprüfung braucht immer das ganze Programm) und läuft daher
 * weiterhin vollständig — gemessen ~6–7 Sekunden, das größte verbleibende
 * Zeitstück im Hook.
 *
 * Aufruf:
 *   Automatisch im `pre-push`-Hook, liest die von Git übergebenen Zeilen
 *   von stdin (Format: "<lokale Ref> <lokale SHA> <Remote-Ref> <Remote-SHA>").
 *   Von Hand testen: node scripts/pruefe-gepushten-commit.mjs --commit HEAD
 *   npm-Kurzform:     npm run pruefe:gepushten-commit -- --commit HEAD
 */
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, symlinkSync } from 'node:fs'
import { join } from 'node:path'

const REPO_ROOT = join(import.meta.dirname, '..')
const WORKTREE_DIR = join(REPO_ROOT, '.git', 'pre-push-worktree')
const NULL_SHA = '0000000000000000000000000000000000000000'

function git(args, cwd = REPO_ROOT) {
  return execFileSync('git', args, { cwd, encoding: 'utf-8' }).trim()
}

function gitLive(args, cwd) {
  execFileSync('git', args, { cwd, stdio: 'inherit' })
}

function npmLive(args, cwd) {
  // Bewusst OHNE shell:true: Next.js-Routengruppen wie "src/app/(app)/…"
  // enthalten Klammern, die eine Shell als Syntax interpretieren würde.
  // Unter Windows heißt das npm-Executable "npm.cmd", nicht "npm" — das
  // direkt anzusprechen vermeidet die Shell komplett, auf beiden Plattformen.
  const bin = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  execFileSync(bin, args, { cwd, stdio: 'inherit' })
}

function zeilenVonStdin() {
  let eingabe = ''
  try {
    eingabe = readFileSync(0, 'utf-8')
  } catch {
    return []
  }
  return eingabe.split(/\r?\n/).filter(z => z.trim().length > 0)
}

function zielCommit() {
  const flagIndex = process.argv.indexOf('--commit')
  if (flagIndex !== -1 && process.argv[flagIndex + 1]) {
    return { sha: git(['rev-parse', process.argv[flagIndex + 1]]), remoteSha: null }
  }
  const zeilen = zeilenVonStdin()
  // Löschungen oder mehrere Branches gleichzeitig: nur die letzte Zeile mit
  // einer tatsächlich vorhandenen lokalen SHA wird geprüft — für den
  // Ein-Branch-Alltag hier (nur `main`) reicht das.
  for (let i = zeilen.length - 1; i >= 0; i--) {
    const [, localSha, , remoteSha] = zeilen[i].split(/\s+/)
    if (localSha && localSha !== NULL_SHA) {
      return { sha: localSha, remoteSha: remoteSha && remoteSha !== NULL_SHA ? remoteSha : null }
    }
  }
  return null
}

function worktreeEinrichten(sha) {
  const istNeu = !existsSync(WORKTREE_DIR)

  if (istNeu) {
    console.log('→ Isolierter Checkout wird einmalig angelegt (dauert etwas länger als sonst)…')
    gitLive(['worktree', 'add', '--detach', '--quiet', WORKTREE_DIR, sha])
  } else {
    gitLive(['checkout', '--detach', '--force', '--quiet', sha], WORKTREE_DIR)
    // Nichts vom letzten Lauf soll nachwirken — ausgenommen alles, was
    // .gitignore als ignoriert kennt (node_modules-Link eingeschlossen).
    gitLive(['clean', '-fd', '--quiet'], WORKTREE_DIR)
  }

  const nodeModulesLink = join(WORKTREE_DIR, 'node_modules')
  if (!existsSync(nodeModulesLink)) {
    const quelle = join(REPO_ROOT, 'node_modules')
    if (!existsSync(quelle)) {
      throw new Error(`node_modules fehlt unter ${quelle} — einmal "npm ci" im Hauptordner laufen lassen.`)
    }
    symlinkSync(quelle, nodeModulesLink, process.platform === 'win32' ? 'junction' : 'dir')
  }
}

const ziel = zielCommit()

if (!ziel) {
  console.log('ℹ️  Kein gepushter Commit erkannt (z. B. reine Branch-Löschung) — nichts zu prüfen.')
  process.exit(0)
}

const { sha, remoteSha } = ziel
console.log(`→ Isolierter Checkout gegen den tatsächlich gepushten Commit ${sha.slice(0, 7)}…`)

try {
  worktreeEinrichten(sha)
} catch (fehler) {
  console.error('❌ Isolierter Checkout konnte nicht eingerichtet werden:')
  console.error('  ' + fehler.message)
  process.exit(1)
}

const LINT_ENDUNGEN = ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.mts', '.cts']

function geaenderteLintDateien() {
  // Ohne bekannten bisherigen Remote-Stand (z. B. beim manuellen Test via
  // --commit, oder beim allerersten Push eines neuen Branches) lässt sich
  // "geändert" nicht sinnvoll bestimmen — dann lieber einmal das ganze
  // Projekt linten als eine Lücke zu riskieren.
  if (!remoteSha) return null

  const bereich = `${remoteSha}..${sha}`
  let dateien
  try {
    dateien = git(['diff', '--name-only', '--diff-filter=ACMR', bereich], WORKTREE_DIR).split(/\r?\n/).filter(Boolean)
  } catch {
    // z. B. wenn remoteSha lokal nicht bekannt ist (Force-Push über einen
    // fremden Stand) — auch dann lieber vollständig prüfen statt zu raten.
    return null
  }
  return dateien.filter(d => LINT_ENDUNGEN.includes('.' + d.split('.').pop()) && existsSync(join(WORKTREE_DIR, d)))
}

const schritte = [
  {
    name: 'Lint',
    run: () => {
      const dateien = geaenderteLintDateien()
      if (dateien && dateien.length === 0) {
        console.log('ℹ️  Lint übersprungen — dieser Push ändert keine JS/TS-Dateien.')
        return
      }
      const args = dateien
        ? ['run', 'lint:ci', '--silent', '--', ...dateien]
        : ['run', 'lint:ci', '--silent']
      if (dateien) console.log(`→ Lint nur über die ${dateien.length} geänderte(n) Datei(en) dieses Pushs.`)
      else console.log('→ Kein bekannter bisheriger Remote-Stand — Lint läuft einmalig über das ganze Projekt.')
      npmLive(args, WORKTREE_DIR)
    },
  },
  { name: 'TypeScript', run: () => npmLive(['run', 'typecheck', '--silent'], WORKTREE_DIR) },
  { name: 'Migrations-Abgleich', run: () => execFileSync('node', ['scripts/pruefe-migrationsliste.mjs'], { cwd: WORKTREE_DIR, stdio: 'inherit' }) },
]

for (const schritt of schritte) {
  try {
    schritt.run()
  } catch {
    console.error(`\n❌ Push blockiert — ${schritt.name} schlägt im tatsächlich gepushten Commit ${sha.slice(0, 7)} fehl.`)
    console.error('Das ist unabhängig vom Stand des restlichen Arbeitsordners (isolierter Checkout,')
    console.error('siehe CoS-P-023) — der Fehler steckt im Commit, der gerade gepusht werden soll.')
    console.error('\nIm Notfall umgehbar mit: git push --no-verify')
    process.exit(1)
  }
}

console.log(`✅ Isolierter Checkout von ${sha.slice(0, 7)}: Lint, TypeScript und Migrations-Abgleich sauber.`)
process.exit(0)
