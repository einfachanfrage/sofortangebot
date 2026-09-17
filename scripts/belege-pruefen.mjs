#!/usr/bin/env node
/**
 * Finance — Unveraenderbarkeitskontrolle der Eingangsrechnungen (GoBD).
 *
 * Verfahren: docs/finance-001-verfahrensdokumentation-rechnungseingang.md,
 * Schritt 3 und Teil 4.
 *
 * Das Problem: Eine Ablage ist nur dann ein Archiv, wenn eine nachtraegliche
 * Aenderung auffaellt. Ein Ordner allein leistet das nicht — eine geoeffnete
 * und neu gespeicherte PDF sieht danach genauso aus wie vorher.
 *
 * Was dieses Skript prueft:
 *   1. Jede im Eingangsbuch gefuehrte Datei ist noch da.
 *   2. Ihre SHA-256-Pruefsumme stimmt mit dem Eintrag ueberein.
 *   3. Es liegt keine Datei im Jahresordner, die nicht im Eingangsbuch steht.
 *   4. Eingangsbuch und die versionierte Pruefsummenliste
 *      (docs/finance-001-hashliste.md) sagen dasselbe.
 *
 * Aufruf:  node scripts/belege-pruefen.mjs
 * Ergebnis: Exit 0 = in Ordnung. Exit 1 = mindestens ein Befund.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const ABLAGE = join(WURZEL, 'belege', 'eingangsrechnungen');
const BUCH = join(ABLAGE, 'eingangsbuch.csv');
const HASHLISTE = join(WURZEL, 'docs', 'finance-001-hashliste.md');

const befunde = [];
const melde = (t) => befunde.push(t);

if (!existsSync(BUCH)) {
  console.error('Eingangsbuch fehlt: belege/eingangsrechnungen/eingangsbuch.csv');
  process.exit(1);
}

// --- Eingangsbuch lesen -----------------------------------------------------
const zeilen = readFileSync(BUCH, 'utf8').split(/\r?\n/).filter((z) => z.trim());
const kopf = zeilen.shift().split(';');
const iDatei = kopf.indexOf('Dateiname');
const iHash = kopf.indexOf('SHA256');
const iBemerkung = kopf.indexOf('Bemerkung');
if (iDatei < 0 || iHash < 0) {
  console.error('Eingangsbuch hat nicht die erwarteten Spalten.');
  process.exit(1);
}

const gefuehrt = new Map();
for (const z of zeilen) {
  const f = z.split(';');
  gefuehrt.set(f[iDatei], { hash: f[iHash], bemerkung: f[iBemerkung] ?? '' });
}

// --- Dateien im Jahresordner ------------------------------------------------
const jahre = readdirSync(ABLAGE).filter(
  (n) => /^\d{4}$/.test(n) && statSync(join(ABLAGE, n)).isDirectory(),
);
const aufPlatte = new Map();
for (const jahr of jahre) {
  for (const name of readdirSync(join(ABLAGE, jahr))) {
    const p = join(ABLAGE, jahr, name);
    if (statSync(p).isFile()) aufPlatte.set(name, p);
  }
}

// --- 1 + 2: vorhanden und unveraendert? -------------------------------------
let geprueft = 0;
for (const [name, eintrag] of gefuehrt) {
  const pfad = aufPlatte.get(name);
  if (!pfad) {
    melde(`FEHLT: "${name}" steht im Eingangsbuch, liegt aber nicht in der Ablage.`);
    continue;
  }
  const ist = createHash('sha256').update(readFileSync(pfad)).digest('hex');
  if (ist !== eintrag.hash) {
    melde(
      `VERAENDERT: "${name}"\n           Eingangsbuch: ${eintrag.hash}\n           tatsaechlich: ${ist}`,
    );
    continue;
  }
  geprueft += 1;
}

// --- 3: unerfasste Dateien ---------------------------------------------------
for (const name of aufPlatte.keys()) {
  if (!gefuehrt.has(name)) {
    melde(`NICHT ERFASST: "${name}" liegt in der Ablage, steht aber in keinem Eingangsbuch-Eintrag.`);
  }
}

// --- 4: Pruefsummenliste gegenlesen ------------------------------------------
if (existsSync(HASHLISTE)) {
  const text = readFileSync(HASHLISTE, 'utf8');
  for (const [name, eintrag] of gefuehrt) {
    if (!text.includes(eintrag.hash)) {
      melde(`NICHT VERSIONIERT: Pruefsumme von "${name}" fehlt in docs/finance-001-hashliste.md.`);
    }
  }
} else {
  melde('Pruefsummenliste docs/finance-001-hashliste.md fehlt.');
}

// --- Ergebnis ----------------------------------------------------------------
if (befunde.length === 0) {
  console.log(`In Ordnung: ${geprueft} Belegdateien unveraendert, keine unerfasste Datei.`);
  process.exit(0);
}
console.error(`${befunde.length} Befund(e):\n`);
for (const b of befunde) console.error('  - ' + b);
console.error(
  '\nWichtig: Ein Befund ist kein Grund, eine Datei zu ersetzen oder eine Pruefsumme\n' +
    'zu ueberschreiben. Er gehoert dem Head of Finance gemeldet und in\n' +
    'docs/chief-of-staff-finance-todos.md dokumentiert.',
);
process.exit(1);
