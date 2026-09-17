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

<!-- BEGIN:commit-vollstaendigkeit -->
# Vor jedem „ist committet" — die Vollständigkeitsprüfung

Zweimal in vier Tagen ist die Produktion an derselben Form kaputtgegangen:
eine Datei wurde committet, die von ihr importierte zweite blieb ungebunden im
Arbeitsbaum liegen. 13./14.09.2026 siebzehn Stunden (CoS-P-014), 17.09.2026
achtundsechzig Minuten (`zeit-ausschluss.ts` committet, `satz-raum.ts` nicht).

Deshalb gilt (CoS-P-031, Sandys Entscheidung vom 17.09.2026 „ja, einbauen"):

1. **Der Hook meldet es von selbst.** `.git/hooks/pre-commit` ruft bei jedem
   Commit `scripts/pruefe-unerfasste-dateien.mjs` auf und schreibt das Ergebnis
   mit dem Präfix `[pre-commit]` in die Ausgabe. **Er blockiert nichts.**
   Lies diese Zeilen — steht dort eine Datei, die zu deiner Arbeit gehört,
   gehört sie in denselben Commit.
2. **Melde erst danach „ist committet".** Wer eine fertige Änderung meldet,
   ohne die `[pre-commit]`-Zeilen gelesen zu haben, meldet einen Stand, der
   bei Vercel rot werden kann.
3. **Fremde Dateien sind kein Grund zu warten.** Der Hinweis listet den ganzen
   Arbeitsbaum, also auch die laufende Arbeit anderer Rollen. Nimm nur mit, was
   dir gehört — fremde Dateien nicht mitcommitten und nicht anfassen.
4. **`exit 0` im Hook bleibt.** Sandys Vorgabe vom 15.09.2026: „Ein Push darf
   NIE mehr blockiert werden." Ein `pre-push`, der anhält, ist ausgeschlossen —
   die Prüfung sitzt beim Commit, wo der Fehler entsteht, nicht bei Sandy.
5. **Nach frischem `git clone`:** `scripts/hooks/LIESMICH.md` — eine Zeile
   Einrichtung, `.git/hooks/` liegt nicht im Repository.
<!-- END:commit-vollstaendigkeit -->
