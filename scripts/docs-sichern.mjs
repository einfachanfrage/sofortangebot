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
import { readdirSync, readFileSync, existsSync, mkdirSync, renameSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { randomBytes } from 'node:crypto'
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

// CoS-P-034: `status`/`add` auf dem geteilten `.git/index` hinterlassen auf
// Sandys Mount manchmal eine leere `index.lock`, die sich per `unlink` nicht
// entfernen lässt ("Operation not permitted") — der nächste `git add`
// scheitert dann lautlos an genau dieser Sperre. Deshalb läuft `sichern()`
// unten durchgängig über einen eigenen GIT_INDEX_FILE außerhalb des Repos
// und fasst die geteilte Index-Datei gar nicht erst an. Diese Funktion ist
// nur eine zusätzliche, defensive Aufräumaktion: eine bereits liegende Sperre
// wird verschoben, nie gelöscht (AGENTS.md, Abschnitt „Fünf Rollen, ein
// Arbeitsbaum", Punkt 3 — `rm`/`unlink` sind in geplanten Läufen ohnehin
// nicht erlaubt und scheitern auf diesem Mount zusätzlich technisch).
function fremdeSperreWegraeumen() {
  const lockDatei = join('.git', 'index.lock')
  if (!existsSync(lockDatei)) return
  try {
    const zielOrdner = join('.git', '_stale')
    mkdirSync(zielOrdner, { recursive: true })
    const ziel = join(zielOrdner, `index.lock.${Date.now()}.${randomBytes(3).toString('hex')}`)
    renameSync(lockDatei, ziel)
  } catch {
    // Auch das Verschieben kann scheitern — dann ist das ein Befund für den
    // nächsten Lauf, kein Grund, sichern() abzubrechen: die eigentliche
    // Sicherung unten hängt nicht von der geteilten Index-Datei ab.
  }
}

function eigenerIndex() {
  return join(tmpdir(), `docs-sichern-index-${process.pid}-${randomBytes(6).toString('hex')}`)
}

function gitMitIndex(indexDatei, ...args) {
  return execFileSync('git', args, {
    encoding: 'utf-8',
    env: { ...process.env, GIT_INDEX_FILE: indexDatei },
  }).trim()
}

function sichern(grund) {
  const funde = pruefen()
  if (funde.length > 0) {
    console.error('Nicht gesichert — erst reparieren:\n' + funde.map(f => '  • ' + f).join('\n'))
    console.error('\nEine einzelne Datei zurückholen:\n  node scripts/docs-sichern.mjs wiederherstellen <datei>')
    process.exit(1)
  }

  // CoS-P-034: eigener Index statt der geteilten `.git/index` — `read-tree
  // HEAD` davor sorgt zusätzlich dafür, dass fremde uncommittete Dateien gar
  // nicht erst mitrutschen können; der eigene Index startet exakt beim
  // letzten Commit, nicht bei irgendeinem älteren Zwischenstand.
  fremdeSperreWegraeumen()
  const indexDatei = eigenerIndex()
  try {
    gitMitIndex(indexDatei, 'read-tree', 'HEAD')
    const offen = gitMitIndex(indexDatei, 'status', '--porcelain', '--', DOCS)
    if (!offen) {
      console.log('Nichts zu sichern — docs/ ist unverändert.')
      return
    }
    gitMitIndex(indexDatei, 'add', '--', DOCS)
    gitMitIndex(indexDatei, 'commit', '-m', `docs: ${grund || 'Zwischenstand gesichert'}`)
    const hash = gitMitIndex(indexDatei, 'rev-parse', 'HEAD')
    console.log(`Gesichert (${hash}):\n${offen}\n\nNoch nicht auf dem Server — dafür einmal: git push`)

    // AGENTS.md „Fünf Rollen, ein Arbeitsbaum", Punkt 4: wer mit eigenem Index
    // committet, muss den geteilten Index danach nachziehen — sonst trägt er
    // weiter die alten Blobs, und der nächste Commit über den geteilten Index
    // (z. B. eine andere Rolle, die selbst docs/ anfasst) wirft diese
    // Sicherung wieder weg. Best-effort: schlägt das fehl, bleibt die
    // Sicherung selbst trotzdem committet, nur eine Warnung wird ausgegeben.
    try {
      fremdeSperreWegraeumen()
      git('add', '--', DOCS)
      const diff = git('diff', '--cached', 'HEAD', '--', DOCS)
      if (diff) {
        console.error('Warnung: geteilter Index nach dem Sichern nicht sauber nachgezogen — bitte vor dem nächsten Commit prüfen (siehe AGENTS.md, „Fünf Rollen, ein Arbeitsbaum").')
      }
    } catch (fehler) {
      console.error(`Warnung: geteilter Index konnte nach dem Sichern nicht nachgezogen werden (${fehler.message}). Die Sicherung selbst ist trotzdem committet (${hash}) — nur ein späterer Commit einer anderen Rolle über den geteilten Index könnte sie sonst überschreiben, falls diese Rolle ebenfalls docs/-Dateien anfasst.`)
    }
  } finally {
    rmSync(indexDatei, { force: true })
  }
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
