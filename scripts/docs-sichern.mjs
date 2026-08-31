#!/usr/bin/env node
/**
 * CoS-013 — Schutz für die gemeinsamen Koordinationsdateien unter `docs/`.
 *
 * Das Problem (sechsmal aufgetreten): mehrere Projekte schreiben dieselbe
 * Markdown-Datei direkt auf der Platte. Liest A die Datei, schreibt B, und
 * schreibt A danach seinen alten Stand komplett zurück, entsteht ein
 * verwaister Textrest am Ende oder ein stiller Verlust — ohne dass jemand
 * es merkt.
 *
 * Zwei Ebenen, weil nicht jedes Projekt eine Konsole hat:
 *
 *   1. `pruefen`  — findet Beschädigungen sofort statt zufällig. Braucht kein
 *                   Git, keine Rechte, nichts. Kann jeder ausführen.
 *   2. `sichern`  — macht aus jeder Doku-Änderung einen echten Git-Commit.
 *                   Damit ist jeder Stand wiederherstellbar, auch wenn ein
 *                   Projekt die Datei später überschreibt. Das ist der Teil,
 *                   den Sandy am 31.08. freigegeben hat.
 *   3. `wiederherstellen <datei>` — holt eine beschädigte Datei aus dem
 *                   letzten sauberen Commit zurück.
 *
 * Aufruf (PowerShell oder Terminal, im Projektordner):
 *   node scripts/docs-sichern.mjs pruefen
 *   node scripts/docs-sichern.mjs sichern "CoS-025 Erledigung"
 *   node scripts/docs-sichern.mjs wiederherstellen chief-of-staff-todos.md
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'

const DOCS = 'docs'
const MARKE = '<!-- ENDE DER DATEI'

// Die sechs Dateien, an denen der Fehler aufgetreten ist. Verliert eine davon
// ihre Endmarkierung, ist das selbst schon ein Warnzeichen — dann hat jemand
// die Datei komplett überschrieben statt ergänzt.
const PFLICHT_MARKE = [
  'chief-of-staff-todos.md',
  'chief-of-staff-platform-todos.md',
  'chief-of-staff-marketing-todos.md',
  'chief-of-staff-finance-todos.md',
  'design-check.md',
  'pruefmeister-testfaelle.md',
]

function markdownDateien() {
  return readdirSync(DOCS).filter(name => name.endsWith('.md'))
}

function pruefen() {
  const funde = []
  for (const name of markdownDateien()) {
    const zeilen = readFileSync(join(DOCS, name), 'utf-8').split(/\r?\n/)
    // Nur eine Zeile, die MIT der Markierung beginnt, zählt als echte
    // Endmarkierung. In mehreren Dateien wird sie zusätzlich im Fließtext
    // erwähnt (in Backticks) — das ist keine zweite Markierung.
    const treffer = zeilen
      .map((zeile, index) => (zeile.trimStart().startsWith(MARKE) ? index : -1))
      .filter(index => index >= 0)
    const pflicht = PFLICHT_MARKE.includes(name)

    if (treffer.length === 0) {
      if (pflicht) funde.push(`${name}: Endmarkierung fehlt komplett — entweder nie gesetzt oder die Datei wurde überschrieben statt ergänzt.`)
      continue
    }
    if (treffer.length > 1) {
      funde.push(`${name}: Endmarkierung steht ${treffer.length}× in der Datei (Zeilen ${treffer.map(i => i + 1).join(', ')}) — zwei Schreibvorgänge sind ineinander gerutscht.`)
    }

    const danach = zeilen.slice(treffer[treffer.length - 1] + 1).join('\n').trim()
    if (danach.length > 0) {
      funde.push(`${name}: ${danach.length} Zeichen stehen NACH der Endmarkierung — Speicherfehler.`)
    }
  }
  return funde
}

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf-8' }).trim()
}

function sichern(grund) {
  const funde = pruefen()
  if (funde.length > 0) {
    console.error('Nicht gesichert — erst reparieren:\n' + funde.map(f => '  • ' + f).join('\n'))
    console.error('\nEine einzelne Datei zurückholen:\n  node scripts/docs-sichern.mjs wiederherstellen <datei>')
    process.exit(1)
  }
  const offen = git('status', '--porcelain', '--', DOCS)
  if (!offen) {
    console.log('Nichts zu sichern — docs/ ist unverändert.')
    return
  }
  git('add', '--', DOCS)
  git('commit', '-m', `docs: ${grund || 'Zwischenstand gesichert'}`)
  console.log(`Gesichert:\n${offen}\n\nNoch nicht auf dem Server — dafür einmal: git push`)
}

function wiederherstellen(datei) {
  if (!datei) {
    console.error('Bitte den Dateinamen angeben, z. B. chief-of-staff-todos.md')
    process.exit(1)
  }
  const pfad = `${DOCS}/${datei}`
  git('checkout', 'HEAD', '--', pfad)
  console.log(`${pfad} auf den letzten Commit zurückgesetzt.`)
}

const [befehl, ...rest] = process.argv.slice(2)
switch (befehl) {
  case 'pruefen': {
    const funde = pruefen()
    if (funde.length === 0) {
      console.log(`Alle ${markdownDateien().length} Doku-Dateien in Ordnung.`)
    } else {
      console.error('Beschädigte Dateien gefunden:\n' + funde.map(f => '  • ' + f).join('\n'))
      process.exit(1)
    }
    break
  }
  case 'sichern':
    sichern(rest.join(' '))
    break
  case 'wiederherstellen':
    wiederherstellen(rest[0])
    break
  default:
    console.log('Befehle: pruefen | sichern "<Grund>" | wiederherstellen <datei>')
    process.exit(1)
}
