<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:docs-koordinationsdateien -->
# Gemeinsame Dateien unter `docs/` — bitte diese Reihenfolge

Die Koordinationsdateien (`chief-of-staff-*.md`, `design-check.md`,
`pruefmeister-testfaelle.md`, `entscheidungen-fuer-sandy.md`) werden von
mehreren Projekten gleichzeitig beschrieben. Sechsmal ist dabei Text
verlorengegangen oder als verwaister Rest am Dateiende gelandet, weil zwei
Projekte kurz nacheinander denselben Stand komplett zurückgeschrieben haben.

Deshalb gilt (CoS-013, Sandys Go vom 2026-08-31):

1. **Vor dem Bearbeiten:** `node scripts/docs-sichern.mjs pruefen`
   Findet verwaiste Reste und fehlende Endmarkierungen sofort. Braucht kein
   Git und keine besonderen Rechte — das kann jedes Projekt ausführen.
2. **Beim Bearbeiten:** neue Einträge ans Dateiende anhängen, VOR die
   Endmarkierung `<!-- ENDE DER DATEI ... -->`. Nicht die ganze Datei neu
   schreiben, wenn ein Anhängen reicht — das ist die eigentliche
   Fehlerquelle.
3. **Nach dem Bearbeiten:** `node scripts/docs-sichern.mjs sichern "<Grund>"`
   Macht daraus einen echten Git-Commit. Ab da ist jeder Stand
   wiederherstellbar, auch wenn ein anderes Projekt die Datei später
   überschreibt. Wer keine Konsole hat, sagt im Bericht an Sandy Bescheid,
   dass eine Doku-Datei geändert wurde — dann sichert sie das mit.
4. **Wenn doch etwas kaputt ist:**
   `node scripts/docs-sichern.mjs wiederherstellen <datei>` holt die Datei
   aus dem letzten sauberen Commit zurück. Nichts von Hand löschen.
<!-- END:docs-koordinationsdateien -->
