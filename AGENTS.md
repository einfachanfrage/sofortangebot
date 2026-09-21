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

<!-- BEGIN:geteilter-arbeitsbaum -->
# Fünf Rollen, ein Arbeitsbaum — committen ohne fremde Arbeit

Am 17.09.2026 ist beides an einem Tag passiert: ein Commit hat **19 Dateien
von fünf Rollen** mitgenommen (`git add -A`), und ein Commit mit eigenem Index
hätte zwei fremde Doku-Einträge **lautlos gelöscht**. Der Unterschied zwischen
„gutgegangen" und „Produktion 45 Minuten rot" war beide Male nur, welche
Dateien zufällig gleichzeitig im Index lagen.

Deshalb gilt (Entscheidung des Chief of Staff, 17.09.2026, auf Befund und
Bitte des Head of Product Engineering):

1. **`git add -A` und `git add .` sind abgeschafft.** Es werden ausschließlich
   die eigenen Dateien mit vollem Pfad genannt.
2. **Zwischen `git add` und `git commit` gehört nichts als eine Sekunde.**
   Wer dazwischen noch etwas prüft oder schreibt, riskiert einen fremden
   Commit über seinen Index.
3. **Fremde Sperrdateien werden verschoben, nie gelöscht:**
   `mkdir -p .git/_stale` und `mv .git/*.lock .git/_stale/…`. Löschen ist in
   geplanten Läufen nicht erlaubt, und `rm` scheitert dort mit
   „Operation not permitted".
4. **Wer mit eigenem Index committet** (`GIT_INDEX_FILE`, `git commit-tree`,
   `git update-ref … $ALT`), **muss danach drei Schritte fahren** — sonst
   trägt der geteilte Index weiter die alten Blobs, und der nächste fremde
   Commit wirft die eigene Arbeit weg:
   ```bash
   # 1. fremde Sperrdateien wegräumen (verschieben, nicht löschen)
   # 2. den geteilten Index nachziehen
   git reset -q -- <dieselben Dateien>
   # 3. nachsehen, nicht annehmen — diese Ausgabe MUSS leer sein
   git diff --cached HEAD -- <dieselben Dateien>
   ```
   **Schritt 3 ist der eigentliche Punkt:** liegt eine fremde `index.lock`
   daneben, scheitert der Nachzug **lautlos** und sieht wie ein Erfolg aus.
   „Eigener Index" ohne Schritt 3 ist eine Anleitung zum Löschen fremder
   Einträge — halb ist hier schlechter als gar nicht.

   **Schritt 2 bitte als `git reset -q`, nicht als `git add`** (CoS-P-035,
   21.09.2026): `add` merkt den aktuellen ARBEITSBAUM-Stand des Pfads vor,
   nicht den gerade committeten HEAD-Stand — liegt darunter noch uncommittete
   fremde Arbeit einer anderen Rolle, landet die als vorgemerkt im geteilten
   Index. `reset -q` stellt stattdessen exakt HEAD wieder her: keine alten
   Blobs, nichts Fremdes vorgemerkt.

   **Praktisch, statt aller drei Schritte von Hand:**
   `node scripts/docs-sichern.mjs nachziehen <dieselben Dateien>` macht genau
   das in einem Aufruf, an einer einzigen Stelle für alle Rollen gepflegt.
5. **Gemeldet wird, was man selbst committet hat.** Findet eine Rolle ihre
   Arbeit in einem fremden Commit wieder, ist das ein Befund für den Chief of
   Staff, kein Anlass, den Commit zu wiederholen.
<!-- END:geteilter-arbeitsbaum -->
