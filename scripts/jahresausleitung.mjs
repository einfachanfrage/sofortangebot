#!/usr/bin/env node
/**
 * Finance — Jahresausleitung: Archivkopie eines Belegjahres (GoBD, § 147 AO).
 *
 * Verfahren: docs/finance-001-verfahrensdokumentation-rechnungseingang.md,
 * Teil 4 ("Datensicherung — und warum eine Sicherung noch kein Archiv ist").
 *
 * Das Problem: Die taegliche OneDrive-Sicherung haelt den *aktuellen* Stand.
 * Sie ist kein Archiv. Die Acht-Jahres-Frist verlangt einen Bestand, der sich
 * nicht mehr von selbst aendert und der 2034 ohne dieses Projekt, ohne Git und
 * ohne Internet lesbar und pruefbar ist.
 *
 * Was dieses Skript erzeugt (in EINEM Ordner, in sich geschlossen):
 *   LIESMICH.txt              reiner Text — was das ist, wie man es 2034 prueft
 *   MANIFEST.csv              jede Datei des Buendels mit SHA-256 und Byte-Zahl
 *   pruefsummen.sha256        dasselbe im Standardformat (sha256sum -c)
 *   eingangsbuch-<jahr>.csv   die Zeilen des Jahres, Kopfzeile mitgefuehrt
 *   belege/                   die Originaldateien, Byte fuer Byte
 *   verfahrensdokumentation.md, hashliste.md, e-rechnung-ansehen.mjs
 *
 * Nach dem Schreiben liest das Skript JEDE Datei vom Ziel zurueck und
 * vergleicht die Pruefsumme mit der Quelle. Eine Erfolgsmeldung des
 * Kopiervorgangs ist kein Nachweis — das ist die Regel vom 17.09.2026.
 *
 * Aufruf:
 *   node scripts/jahresausleitung.mjs <jahr> --ziel <ordner> [--probelauf]
 *   node scripts/jahresausleitung.mjs --pruefen <ordner>
 *
 * Ergebnis: Exit 0 = in Ordnung. 1 = Befund. 2 = Aufruf/Ziel unzulaessig.
 */

import {
  readFileSync, writeFileSync, readdirSync, statSync, existsSync,
  mkdirSync, copyFileSync,
} from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname, resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const WURZEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const ABLAGE = join(WURZEL, 'belege', 'eingangsrechnungen');
const BUCH = join(ABLAGE, 'eingangsbuch.csv');
const VERFAHREN = join(WURZEL, 'docs', 'finance-001-verfahrensdokumentation-rechnungseingang.md');
const HASHLISTE = join(WURZEL, 'docs', 'finance-001-hashliste.md');
const VIEWER = join(WURZEL, 'scripts', 'e-rechnung-ansehen.mjs');

const sha256 = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');
const heute = () => new Date().toISOString().slice(0, 10);

// --- Aufrufparameter --------------------------------------------------------
const argv = process.argv.slice(2);
if (argv.length === 0 || argv.includes('--hilfe') || argv.includes('-h')) {
  console.log(`Jahresausleitung — Archivkopie eines Belegjahres

  node scripts/jahresausleitung.mjs <jahr> --ziel <ordner> [--probelauf]
  node scripts/jahresausleitung.mjs --pruefen <ordner>

  <jahr>        z. B. 2026 — muss als Ordner in belege/eingangsrechnungen/ liegen
  --ziel        wohin das Buendel geschrieben wird (externe Platte, USB-Medium)
  --probelauf   noetig, solange das Jahr nicht abgeschlossen ist
  --pruefen     prueft ein bestehendes Buendel gegen sein eigenes MANIFEST`);
  process.exit(0);
}

// ============================================================================
// Betriebsart 2: ein bestehendes Buendel pruefen
// ============================================================================
if (argv[0] === '--pruefen') {
  const ordner = argv[1] ? resolve(argv[1]) : null;
  if (!ordner || !existsSync(ordner)) {
    console.error('Aufruf: node scripts/jahresausleitung.mjs --pruefen <ordner>');
    process.exit(2);
  }
  const manifest = join(ordner, 'MANIFEST.csv');
  if (!existsSync(manifest)) {
    console.error(`Kein MANIFEST.csv in ${ordner} — das ist kein Ausleitungs-Buendel.`);
    process.exit(2);
  }
  const zeilen = readFileSync(manifest, 'utf8').split(/\r?\n/).filter((z) => z.trim());
  zeilen.shift();
  const befunde = [];
  const gefuehrt = new Set();
  for (const z of zeilen) {
    const [rel, hash, bytes] = z.split(';');
    gefuehrt.add(rel);
    const p = join(ordner, rel);
    if (!existsSync(p)) { befunde.push(`FEHLT: ${rel}`); continue; }
    const ist = sha256(p);
    const istBytes = String(statSync(p).size);
    if (ist !== hash) befunde.push(`VERAENDERT: ${rel}\n    Manifest ${hash}\n    Datei    ${ist}`);
    else if (istBytes !== bytes) befunde.push(`GROESSE ABWEICHEND: ${rel} (${bytes} → ${istBytes})`);
  }
  // Ueberzaehlige Dateien im Buendel
  const alle = [];
  (function lauf(d, praefix = '') {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      const rel = praefix ? `${praefix}/${n}` : n;
      if (statSync(p).isDirectory()) lauf(p, rel);
      else alle.push(rel);
    }
  })(ordner);
  for (const rel of alle) {
    if (rel === 'MANIFEST.csv') continue;
    if (!gefuehrt.has(rel)) befunde.push(`NICHT IM MANIFEST: ${rel}`);
  }
  if (befunde.length) {
    console.error(`\n${befunde.length} Befund(e) im Buendel ${ordner}:\n`);
    for (const b of befunde) console.error(`  - ${b}`);
    console.error('');
    process.exit(1);
  }
  console.log(`${zeilen.length} Dateien geprueft, alle unveraendert. Buendel in Ordnung.`);
  process.exit(0);
}

// ============================================================================
// Betriebsart 1: ausleiten
// ============================================================================
const jahr = argv[0];
if (!/^\d{4}$/.test(jahr)) {
  console.error(`"${jahr}" ist keine Jahreszahl. Aufruf mit --hilfe.`);
  process.exit(2);
}
const iZiel = argv.indexOf('--ziel');
if (iZiel < 0 || !argv[iZiel + 1]) {
  console.error('--ziel <ordner> fehlt. Aufruf mit --hilfe.');
  process.exit(2);
}
const zielWurzel = resolve(argv[iZiel + 1]);
const probelauf = argv.includes('--probelauf');

const quelle = join(ABLAGE, jahr);
if (!existsSync(quelle)) {
  console.error(`Kein Jahresordner belege/eingangsrechnungen/${jahr}/.`);
  process.exit(2);
}

// --- Schutz 1: niemals in die Ablage selbst schreiben -----------------------
const drin = (kind, elternteil) => {
  const r = relative(elternteil, kind);
  return r === '' || (!r.startsWith('..') && !r.startsWith(`..${sep}`));
};
if (drin(zielWurzel, join(WURZEL, 'belege'))) {
  console.error('Das Ziel liegt in belege/. Dorthin schreibt dieses Programm nicht.');
  process.exit(2);
}

// --- Schutz 2: ein laufendes Jahr wird nicht als Archiv ausgegeben ----------
const laufendesJahr = String(new Date().getFullYear());
if (jahr >= laufendesJahr && !probelauf) {
  console.error(
    `${jahr} ist nicht abgeschlossen. Eine Archivkopie eines laufenden Jahres\n` +
    'waere unvollstaendig. Fuer einen Probelauf: --probelauf anhaengen.',
  );
  process.exit(2);
}

const ordnerName = probelauf
  ? `Sofortangebot-Archiv-${jahr}-PROBELAUF`
  : `Sofortangebot-Archiv-${jahr}`;
const ziel = join(zielWurzel, ordnerName);

// --- Schutz 3: eine bestehende Archivkopie wird nicht ueberschrieben --------
if (existsSync(ziel)) {
  console.error(`${ziel} gibt es schon. Eine Archivkopie wird nicht ueberschrieben.`);
  process.exit(2);
}

// --- Quelldateien einsammeln ------------------------------------------------
const quellDateien = []; // { rel, absolut }
(function lauf(d, praefix) {
  for (const n of readdirSync(d).sort()) {
    const p = join(d, n);
    const rel = praefix ? `${praefix}/${n}` : n;
    if (statSync(p).isDirectory()) lauf(p, rel);
    else quellDateien.push({ rel: `belege/${rel}`, absolut: p });
  }
})(quelle, '');

if (quellDateien.length === 0) {
  console.error(`Der Jahresordner ${jahr} ist leer. Nichts auszuleiten.`);
  process.exit(2);
}

// --- Eingangsbuch des Jahres ------------------------------------------------
if (!existsSync(BUCH)) {
  console.error('Eingangsbuch fehlt — ohne Eingangsbuch keine Ausleitung.');
  process.exit(2);
}
const buchZeilen = readFileSync(BUCH, 'utf8').split(/\r?\n/).filter((z) => z.trim());
const kopf = buchZeilen.shift();
const iDatei = kopf.split(';').indexOf('Dateiname');
const namenImJahr = new Set(quellDateien.map((d) => d.rel.split('/').pop()));
const jahresZeilen = buchZeilen.filter((z) => namenImJahr.has(z.split(';')[iDatei]));
const ohneBuchEintrag = [...namenImJahr].filter(
  (n) => !buchZeilen.some((z) => z.split(';')[iDatei] === n),
);

mkdirSync(ziel, { recursive: true });

// --- Kopieren ---------------------------------------------------------------
const manifest = []; // { rel, hash, bytes }
const merke = (rel, absolut) => {
  manifest.push({ rel, hash: sha256(absolut), bytes: statSync(absolut).size });
};
for (const d of quellDateien) {
  const zielDatei = join(ziel, d.rel);
  mkdirSync(dirname(zielDatei), { recursive: true });
  copyFileSync(d.absolut, zielDatei);
  merke(d.rel, d.absolut);
}

const schreibe = (rel, inhalt) => {
  const p = join(ziel, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, inhalt);
  manifest.push({ rel, hash: createHash('sha256').update(readFileSync(p)).digest('hex'), bytes: statSync(p).size });
};

schreibe(`eingangsbuch-${jahr}.csv`, `${kopf}\n${jahresZeilen.join('\n')}\n`);

for (const [rel, src] of [
  ['verfahrensdokumentation.md', VERFAHREN],
  ['hashliste.md', HASHLISTE],
  ['e-rechnung-ansehen.mjs', VIEWER],
]) {
  if (!existsSync(src)) { console.error(`Fehlt und gehoert ins Buendel: ${src}`); process.exit(2); }
  copyFileSync(src, join(ziel, rel));
  merke(rel, src);
}

const belegDateien = manifest.filter((m) => m.rel.startsWith('belege/'));
const belegBytes = belegDateien.reduce((s, m) => s + m.bytes, 0);
const frist = Number(jahr) + 8;

schreibe('LIESMICH.txt',
`ARCHIVKOPIE BELEGJAHR ${jahr}${probelauf ? '  —  PROBELAUF, KEIN ARCHIV' : ''}
${'='.repeat(60)}

Betrieb:        Sofortangebot (Einzelunternehmen, Sandy)
Erstellt am:    ${heute()}
Erstellt durch: scripts/jahresausleitung.mjs
Inhalt:         ${belegDateien.length} Belegdateien, ${belegBytes} Bytes
                dazu Eingangsbuch, Pruefsummen, Verfahrensdokumentation und
                Betrachter. Vollstaendige Liste: MANIFEST.csv
${probelauf ? `
!! PROBELAUF. Das Jahr ${jahr} ist nicht abgeschlossen. Dieses Buendel ist
!! ein Test des Verfahrens, KEINE Archivkopie im Sinne des § 147 AO.
!! Die echte Ausleitung fuer ${jahr} erfolgt im Januar ${Number(jahr) + 1}.
` : `
AUFBEWAHRUNG BIS ENDE ${frist}
8 Jahre ab Ende des Kalenderjahres der Rechnungsausstellung
(§ 14b Abs. 1 UStG, § 147 Abs. 3 AO). Nicht vorher loeschen.
`}
WAS HIER LIEGT
${'-'.repeat(60)}

  belege/                    Die Originaldateien, Byte fuer Byte wie empfangen.
                             Nicht umgewandelt, nicht neu gespeichert.
  ${`eingangsbuch-${jahr}.csv`.padEnd(25)}  Zu jeder Datei: Lieferant, Rechnungsnummer,
                             Datum, Betrag, Pruefsumme. Semikolon-getrennt,
                             UTF-8, mit jedem Tabellenprogramm lesbar.
  pruefsummen.sha256         Pruefsummen im Standardformat.
  MANIFEST.csv               Jede Datei dieses Buendels mit Pruefsumme
                             und Byte-Zahl.
  verfahrensdokumentation.md Wie die Belege erfasst wurden (GoBD verlangt,
                             dass das Verfahren beim Bestand liegt).
  hashliste.md               Die Pruefsummen zum Zeitpunkt der Ablage.
  e-rechnung-ansehen.mjs     Betrachter fuer XRechnung/ZUGFeRD. Braucht nur
                             Node.js, kein Internet, keine Installation:
                             node e-rechnung-ansehen.mjs belege/<datei>

IST HIER ETWAS VERAENDERT WORDEN?
${'-'.repeat(60)}

Zwei Wege, beide ohne dieses Projekt:

  1) Mit Bordmitteln, in diesem Ordner:
       Linux/macOS:  sha256sum -c pruefsummen.sha256
       Windows:      Get-FileHash -Algorithm SHA256 <datei>
                     und mit pruefsummen.sha256 vergleichen

  2) Mit dem mitgelieferten Skript, falls Node.js vorhanden:
       node <projekt>/scripts/jahresausleitung.mjs --pruefen <dieser Ordner>

Weicht eine Pruefsumme ab, ist die Datei nach der Ausleitung veraendert
worden. Das ist der Zweck der Liste.

WORAUF DIESE KOPIE GEHOERT
${'-'.repeat(60)}

Auf einen Datentraeger, der sich nicht von selbst aendert: externe Platte
oder USB-Medium, danach abgezogen. Eine laufende Synchronisierung
(OneDrive u. ae.) ist eine Sicherung, aber kein Archiv — sie haelt den
aktuellen Stand, nicht den Stand von ${jahr}.
`);

schreibe('pruefsummen.sha256',
  `${manifest.filter((m) => m.rel !== 'pruefsummen.sha256')
    .map((m) => `${m.hash}  ${m.rel}`).join('\n')}\n`);

writeFileSync(join(ziel, 'MANIFEST.csv'),
  `Datei;SHA256;Bytes\n${manifest.map((m) => `${m.rel};${m.hash};${m.bytes}`).join('\n')}\n`);

// --- Kontrolle am Zielort ---------------------------------------------------
// Vom Ziel zurueckgelesen, nicht vom Kopiervorgang geglaubt.
const befunde = [];
for (const m of manifest) {
  const p = join(ziel, m.rel);
  if (!existsSync(p)) { befunde.push(`nicht angekommen: ${m.rel}`); continue; }
  if (sha256(p) !== m.hash) befunde.push(`Pruefsumme weicht ab: ${m.rel}`);
  else if (statSync(p).size !== m.bytes) befunde.push(`Byte-Zahl weicht ab: ${m.rel}`);
}
for (const d of quellDateien) {
  if (sha256(d.absolut) !== manifest.find((m) => m.rel === d.rel).hash) {
    befunde.push(`QUELLE hat sich waehrend des Laufs geaendert: ${d.rel}`);
  }
}

const gesamtDateien = manifest.length + 1; // + MANIFEST.csv, das sich nicht selbst fuehrt
const gesamtBytes = manifest.reduce((s, m) => s + m.bytes, 0)
  + statSync(join(ziel, 'MANIFEST.csv')).size;

console.log(`\nJahresausleitung ${jahr}${probelauf ? ' (PROBELAUF)' : ''}`);
console.log(`Ziel: ${ziel}`);
console.log(`  ${belegDateien.length} Belegdateien (${belegBytes} Bytes)`);
console.log(`  ${gesamtDateien} Dateien im Buendel insgesamt, ${gesamtBytes} Bytes`);
console.log(`  Eingangsbuch: ${jahresZeilen.length} Zeilen des Jahres uebernommen`);
if (ohneBuchEintrag.length) {
  console.log(`  ! ${ohneBuchEintrag.length} Datei(en) ohne Eingangsbuch-Eintrag:`);
  for (const n of ohneBuchEintrag) console.log(`      ${n}`);
}
if (befunde.length) {
  console.error(`\n${befunde.length} Befund(e) bei der Kontrolle am Zielort:\n`);
  for (const b of befunde) console.error(`  - ${b}`);
  console.error('');
  process.exit(1);
}
console.log('  Kontrolle am Zielort: jede Datei zurueckgelesen, alle Pruefsummen gleich.');
if (ohneBuchEintrag.length) process.exit(1);
process.exit(0);
