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
 *   4. `schrumpfung` — CoS-P-025: findet eine andere Fehlerform desselben
 *                   Problems. Eine Pflichtdatei (oder eine CI-Workflow-Datei)
 *                   wird beim Zurückschreiben kleiner, die Endmarkierung
 *                   bleibt dabei aber intakt — `pruefen` findet das nicht.
 *                   Vergleicht jede überwachte Datei mit ihrem Stand im
 *                   vorherigen Commit; läuft in der CI, nicht als Hook
 *                   (CoS-P-024: nichts im Push-Weg, das abbrechen kann).
 *
 * Aufruf (PowerShell oder Terminal, im Projektordner):
 *   node scripts/docs-sichern.mjs pruefen
 *   node scripts/docs-sichern.mjs sichern "CoS-025 Erledigung"
 *   node scripts/docs-sichern.mjs wiederherstellen chief-of-staff-todos.md
 *   node scripts/docs-sichern.mjs schrumpfung
 */
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { endmarkierungsZeilen } from './endmarkierung.mjs'

const DOCS = 'docs'

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
    // Nur die VOLLSTÄNDIGE Markierung zählt (siehe endmarkierung.mjs).
    // Mehrere Dateien erklären sie im Fließtext und zitieren sie dabei — beim
    // Umbrechen landet so ein Zitat leicht am Zeilenanfang und wurde früher
    // als zweite Markierung gezählt.
    const treffer = endmarkierungsZeilen(zeilen)
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

// ── Schrumpf-Prüfung (CoS-P-025) ────────────────────────────────────────────
// Der dritte Datenverlust in zwei Tagen hatte eine andere Form als die, die
// `pruefen` oben abdeckt: keine Endmarkierungs-Verletzung, sondern eine
// Pflichtdatei, die beim Zurückschreiben schlicht kürzer wurde (649 Zeilen
// bzw. 458 Zeilen weniger, in beiden Fällen mit intakter Endmarkierung).
// Betroffen war außerdem `.github/workflows/ci.yml` selbst — auf demselben
// Weg beschädigt, nur vier Tage lang unbemerkt, weil ein Lauf ohne
// startenden Job in der Liste wie ein normaler roter Lauf aussieht.
//
// Deshalb werden hier beide Gruppen beobachtet: die Pflicht-Dokus aus
// PFLICHT_MARKE und alle Workflow-Dateien unter `.github/workflows/`.
//
// Nicht jedes Kleinerwerden ist ein Fund: ein paar Bytes Unterschied durch
// getrimmtes Leerzeichen am Dateiende sind normal und kein Datenverlust —
// ein Prüfer, der dafür schon rot wird, ist genau der Fehlalarm-Fall aus
// `endmarkierung.mjs`. Die echten Vorfälle waren 649 bzw. 458 Zeilen
// (~34.000 bzw. ~21.000 Byte, 6–21 % der jeweiligen Datei). Die Schwelle
// unten liegt bewusst weit darunter, damit sie diese Fälle sicher fängt,
// ohne bei einer redaktionellen Kürzung um wenige Zeichen anzuschlagen.
const SCHRUMPF_AUSNAHME = /\[schrumpfung erlaubt\]/i
const SCHRUMPF_SCHWELLE_BYTES = 500
const SCHRUMPF_SCHWELLE_ANTEIL = 0.01 // 1 % der vorherigen Dateigröße

function istSignifikant(vorher, jetzt) {
  const differenz = vorher - jetzt
  return differenz > Math.max(SCHRUMPF_SCHWELLE_BYTES, vorher * SCHRUMPF_SCHWELLE_ANTEIL)
}

function workflowDateien() {
  const dir = '.github/workflows'
  try {
    return readdirSync(dir)
      .filter(name => name.endsWith('.yml') || name.endsWith('.yaml'))
      .map(name => `${dir}/${name}`)
  } catch {
    return [] // kein .github/workflows in diesem Checkout — kein Fund, kein Fehler
  }
}

function ueberwachteDateien() {
  return [...PFLICHT_MARKE.map(name => `${DOCS}/${name}`), ...workflowDateien()]
}

function dateigroesseBeiRevision(pfad, rev) {
  try {
    const bytes = execFileSync('git', ['cat-file', '-s', `${rev}:${pfad}`], { encoding: 'utf-8' })
    return parseInt(bytes.trim(), 10)
  } catch {
    return null // Datei existierte bei dieser Revision nicht (neu oder gelöscht) — kein Schrumpf-Fall
  }
}

/**
 * Reine Kernfunktion, ohne Git-Zugriff — damit testbar ohne echtes Repo.
 * `groesseVorher`/`groesseJetzt`: Funktionen Pfad -> Bytes oder null (Datei
 * existierte bei dieser Revision nicht). `commitNachricht`: Text des zu
 * prüfenden Commits; enthält er den Marker `[schrumpfung erlaubt]`, gilt ein
 * Schrumpfen als bewusst und erzeugt keinen Fund.
 */
export function schrumpfBefunde(dateien, groesseVorher, groesseJetzt, commitNachricht) {
  const erlaubt = SCHRUMPF_AUSNAHME.test(commitNachricht ?? '')
  const funde = []
  for (const pfad of dateien) {
    const vorher = groesseVorher(pfad)
    const jetzt = groesseJetzt(pfad)
    if (vorher === null || jetzt === null) continue
    if (istSignifikant(vorher, jetzt) && !erlaubt) {
      funde.push(`${pfad}: ${vorher} B -> ${jetzt} B (${vorher - jetzt} B weniger) — ohne "[schrumpfung erlaubt]" im Commit-Text`)
    }
  }
  return funde
}

function schrumpfungPruefen(basisRev = 'HEAD^') {
  let nachricht = ''
  try {
    nachricht = git('log', '-1', '--format=%B')
  } catch {
    // kein vorheriger Commit lesbar (z. B. allererster Commit) — dann gibt es
    // ohnehin nichts zu vergleichen, groesseVorher liefert für alles null
  }
  return schrumpfBefunde(
    ueberwachteDateien(),
    pfad => dateigroesseBeiRevision(pfad, basisRev),
    pfad => dateigroesseBeiRevision(pfad, 'HEAD'),
    nachricht,
  )
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

// Nur ausführen, wenn die Datei direkt als Skript gestartet wurde (CLI) —
// nicht beim Importieren einzelner Funktionen (z. B. `schrumpfBefunde` in
// Tests). Ohne diese Wache lief die CLI bisher bei JEDEM Import mit, auch
// unter vitest, und beendete den Prozess über process.exit(1).
const alsSkriptGestartet = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]

if (alsSkriptGestartet) {
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
    case 'schrumpfung': {
      const funde = schrumpfungPruefen(rest[0])
      if (funde.length === 0) {
        console.log(`Keine Schrumpfung gegenüber dem vorherigen Commit — ${ueberwachteDateien().length} Dateien geprüft.`)
      } else {
        console.error('Geschrumpfte Pflichtdateien gefunden:\n' + funde.map(f => '  • ' + f).join('\n'))
        console.error('\nWar das Kürzen beabsichtigt? Dann "[schrumpfung erlaubt]" in den Commit-Text aufnehmen und neu committen.')
        process.exit(1)
      }
      break
    }
    default:
      console.log('Befehle: pruefen | sichern "<Grund>" | wiederherstellen <datei> | schrumpfung')
      process.exit(1)
  }
}
