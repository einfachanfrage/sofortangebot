# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 17.09.2026, 18:40 UTC · Chief of Staff**
*(ersetzt die Fassung von 18:15 UTC — diese Datei wird immer ersetzt, nie ergänzt.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**,
also 20:00 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟢 Produktion grün und gemessen, der Prüfstand ist wieder belegt.** Vercel,
17:42 UTC: jüngster Produktions-Deploy ist **`8fec90b`, READY**. Engineering
hat um 17:15 UTC über **190 Testdateien** gemessen: **2.850 grün · 104
Sperrklinken · 0 rot**. Damit ist der gelbe Punkt der letzten Fassung („seit
11:58 UTC ungemessen") **erledigt**.

**🔴 Sechs neue Funde aus Sandys zweitem Live-Lauf**, alle reproduziert:
PM-102 (626,62 € fehlen **und** 1.714,96 € erfunden auf derselben Zeile),
PM-103 (20 % Zuschlag, ausgelöst vom Wort „Altbau" im Raumnamen), PM-104
(Zuschlagszeile unlesbar), PM-105, PM-106, PM-107 — und **PM-079-A ist wieder
offen**, die Entwarnung von gestern war falsch. Alles zusammen als
**CoS-E-083**, Reihenfolge steht.

**🔴 Mein Fehler des Tages, von Sandy korrigiert: die Landingpage-Entwurfs-Adresse
existiert doch.** Sie ruft sie auf und sieht die Seite. Der unangemeldete Aufruf
landet auf `vercel.com/login`, weil die Seite hinter **Vercel Deployment
Protection** liegt — und `list_deployments` antwortet **403 Forbidden**, nicht
404. Ich habe „ich sehe es nicht" als „es gibt es nicht" gelesen. **CoS-P-032
zurückgezogen**, es braucht keinen Vorschau-Deploy, sondern **eine Freigabe von
Sandy**.

---

## Was seit 17:00 UTC passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| **Engineering** | **CoS-E-082 fertig, gemessen und gepusht** (in `8fec90b`): 190 Testdateien, 2.954 Prüfungen, 0 rot, `tsc` 0, `eslint` 0. Dazu zwei Befunde zum geteilten Arbeitsbaum — Sammel-Commit über 19 Dateien und die lautlose Falle beim eigenen Index | ✅ erledigt |
| **Prüfmeister** | **Sandys zweiten Live-Lauf ausgemessen:** sieben von zehn Fällen sauber, **vier neue Funde + eine Rücknahme** (PM-102…PM-107, PM-079-A), alle mit Sperrklinke. `pruefmeister-batch-47-56.test.ts`: 33 grün, 17 Sperrklinken | ✅ erledigt |
| **Designer** | **DC-128 gebaut** (uncommittet) und **gemessen, dass die Entwurfs-Adresse nicht existiert** — mit Vercel-API und Browser belegt, nichts angefasst | ✅ erledigt |
| **CoS** | **CoS-E-083 angelegt** — die sechs Funde als ein Auftrag mit Reihenfolge; dazu die Korrektur, dass CoS-E-081 entgegen der Meldung von 17:15 **doch im Arbeitsbaum läuft** (selbst nachgesehen: +69 Zeilen in `helpers.ts`) | ✅ verteilt |
| **CoS** | **CoS-P-032 und CoS-M-015 wieder zurückgezogen** (18:40 UTC), nachdem Sandy widersprochen hat: die Adresse existiert, sie ist geschützt. Richtigstellung in `design-check.md`, Platform- und Marketing-Liste und in Punkt 9.1 von `launch-readiness.md` | ✅ erledigt |
| **CoS** | **Verfahren entschieden statt weitergereicht:** der Baustein „geteilter Arbeitsbaum" steht jetzt in `AGENTS.md` — inklusive des dritten Schritts, ohne den „eigener Index" fremde Einträge löscht | ✅ erledigt |
| **CoS** | **Eine Entscheidung für Sandy gestellt:** auf welche Grundlage ein Erschwerniszuschlag rechnet (PM-104), mit Empfehlung | ✅ verteilt |
| **Sandy** | **Entschieden, 18:15 UTC — „ja so wie empfohlen":** ein Erschwerniszuschlag rechnet **nur auf die Positionen, die er betrifft**, nicht auf die Angebotssumme. Die Prozentsätze (15/20/30/10/10 %) bleiben als eigener Punkt offen. Freigabe an Engineering und Designer ist eingetragen | ✅ erledigt |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **Vercel-API, 17:42 UTC:** jüngster Produktions-Deploy `8fec90b`, **READY**.
* **Vercel-API, 17:41 UTC:** **ein** Team (`einfachanfrages-projects`), in
  `list_projects` **ein** Projekt (`sofortangebot`). **Das ist kein Beweis für
  Abwesenheit** — unser Zugang ist offenbar auf dieses Projekt beschränkt.
* **Aufruf der Entwurfs-Adresse, 17:42 UTC:** **302 auf
  `https://vercel.com/login`** — das ist **Vercel Deployment Protection**, kein
  fehlendes Ziel.
* **`list_deployments` auf `sofortangebot-landingpage-entwurf`, 18:35 UTC:**
  **403 Forbidden**, „You don't have permission to list the deployment" —
  **403, nicht 404.** Die Adresse existiert, unser Zugang reicht nicht heran.
* **`git fetch` + `git log`, 17:43 UTC:** `origin/main` = `8fec90b`, davor
  **3 ungepushte Commits** (`66955fa`, `f687d17`, `dbea3b5`) — `git diff
  --name-only` zeigt **ausschließlich `docs/`**, kein Code.
* **Arbeitsbaum, 17:44 UTC, Datei für Datei:** `helpers.ts` **+69 Zeilen** mit
  dem Kopf „CoS-E-081 · PM-131 / PM-132 / PM-133" (also läuft der Bau),
  vier Dateien des Designers zu DC-128, zwei Testreihen des Prüfmeisters.
* **`node scripts/docs-sichern.mjs pruefen`:** „Alle 58 Doku-Dateien in
  Ordnung", nach dem Anhängen erneut.
* **Gelesen, bevor ich darüber berichte:** Restliste, Engineering-Liste,
  design-check, Notiz an den Chief of Staff, Arbeitsreihenfolge, und die
  Zuschlag-Entscheidung vom 04.09. in `entscheidungen-fuer-sandy.md` (sonst
  hätte ich Sandy eine Frage gestellt, die sie halb schon beantwortet hat).

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **🟡 Die CI ist in diesem Lauf nicht messbar.** Zwei Abfragen kamen mit
  **403** zurück, die dritte lieferte eine Liste, die bei **#202 vom 16.09.**
  endet — das kann nicht der aktuelle Stand sein. **Für `8fec90b` behaupte ich
  keinen CI-Stand.** Der letzte belegte CI-Lauf bleibt **#213 auf `8d07102`,
  success** (gemessen 16:47 UTC). Die Produktion ist davon unabhängig grün.
* **Kein eigener Prüfstand.** Die Zahlen 2.850/104/0 sind Engineerings
  Messung von 17:15 UTC, nicht meine.
* **Der Landingpage-Entwurf selbst** — ich habe die Adresse gemessen, nicht
  die Seite beurteilt.
* **Versicherung, Stripe, Gewerbeanmeldung, Vercel-Benachrichtigung,
  Sicherungslauf um 20:00 Uhr** — nicht angefasst.
* **Gate 1 rechne ich weiter nicht neu.** Stand bleibt **53,0 %**.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Einmal pushen.** 2 Commits liegen hier, reine Doku, kein Code (die vier von vorhin sind schon draußen). Block steht unten im Chat | ein Befehl |
| 2 | 🔵 **Freigabe für den Landingpage-Entwurf** — Empfehlung: Schutz für das Entwurfs-Projekt abschalten (Vercel → Settings → Deployment Protection → Vercel Authentication off). Sonst sieht die Seite außer dir niemand. Begründung in `entscheidungen-fuer-sandy.md` | eine Minute |
| 3 | 🔵 **Nach Italien, ab 26.09.:** Gewerbeanmeldung → Fragebogen zur steuerlichen Erfassung → Geschäftskonto → Steuerberater. Finance und Legal legen die Reihenfolge fertig hin | nichts jetzt |
| 4 | 🔵 **Buchhaltungs-Testlauf** (Lexware Office, fünf Minuten — schaltet den stärksten Satz der Landingpage frei) · **E-Rechnungs-Viewer** (Quba, 0 €) | nicht eilig |
| 5 | 🔵 **Versicherung** (exali/Markel 1 Mio. €) · **Stripe** (Konto + 2 Preise) · **Vercel-Benachrichtigung** · Gewerbeanmeldung KW 41 (CoS-041) | unverändert |
| 6 | 🔵 Heute Abend nach 20:00 Uhr einmal auf `onedrive.live.com` schauen, ob der erste **automatische** Sicherungslauf angekommen ist | ein Blick |

**Eine Sache blockiert jetzt doch zwei Rollen:** Designer und Marketing können
den Landingpage-Entwurf erst ansehen, wenn die Freigabe da ist (Punkt 2).
Alles andere läuft.

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **1. CoS-E-081 fertig** (läuft uncommittet in `helpers.ts` — wer ihn angefangen hat, beendet ihn, und committet `helpers.ts` **allein**). **2. Neu: CoS-E-083** in dieser Reihenfolge: **PM-102 + PM-103 zusammen** → **PM-079-A** (Regression, nicht neu bauen: über alle Räume summieren) → **PM-106 + PM-107 zusammen** → **PM-105**. Danach unverändert **CoS-038 → PM-119/L-06 → CoS-E-080**. **Neu freigegeben (18:15 UTC):** die Bemessungsgrundlage der fünf Erschwerniszuschläge wird auf die betroffenen Positionen eingeengt, Prozentsätze unverändert — gebaut wird sie mit PM-103/PM-104, nicht vorgezogen | niemanden |
| **Designer** | **DC-127** (dunkler Tabellenkopf, nur eine der beiden Seiten ändern), dann **DC-128 zu Ende** und committen. **PD-023** liegt zum Lesen da, **PD-018 §3** (Zuschlagszeile lesbar machen) ist seiner und seit 18:15 UTC vollständig entschieden — sinnvoll erst, nachdem Engineering die Grundlage umgestellt hat. **Keine Aussage zu 9.1 erwartet**, bis Sandy die Seite freigibt (kein Vorschau-Deploy nötig, die Adresse stimmt); DC-122 Fußzeile bleibt bei Legal | Legal (nur DC-122) · Sandy (nur 9.1) |
| **Prüfmeister** | **Spur leer, Fallbasis 133.** Vorschlag, seine Entscheidung: **Themenspeicher-Punkt 14** — alle Rechenwege gegen ihren Eingabetext messen („wie viele sagen *aus Transkript*, und bei wie vielen steht die Zahl wirklich im Transkript?"). **Punkt 17** erst, wenn Marketing CoS-M-014 eingearbeitet hat | niemanden |
| **Platform** | **Nichts zu bauen — CoS-P-032 ist zurückgezogen.** Nur der Termin **CoS-P-029:** am **19.09. nach 03:30 UTC** `system_laeufe` prüfen (`aufnahmen.dateien > 0`?) | niemanden |
| **Marketing** | **CoS-M-014** (zwei Zahlen im Entwurfs-Code korrigieren). **CoS-M-015 ist zurückgezogen** — deine Adresse war richtig, der Fehler war meiner. Danach Zustelltest `support@`. Der Website-Schalter bleibt hinter **CoS-038** | Engineering (CoS-038) · Sandys Buchhaltungs-Testlauf |
| **Legal** | **Zuerst L-KI-01 einbauen** (freigegeben, Wortlaut unverändert) und melden, wenn er drin ist; dabei prüfen, ob dieselbe Zusage noch woanders steht. Dann **CoS-L-011** (dürfen freie Fußzeilen die Pflichtangaben ersetzen — A/B/C?), dann **CoS-L-012** | niemanden |
| **Finance** | **CoS-F-009** (Vorsteuer in die Kostenübersicht, Reverse-Charge auf „durchlaufend", Voranmeldungsrhythmus als Frage für den Steuerberater) · Behördenliste für Sandy bis 26.09. · **26 unbearbeitete Belege** · drei Fragen von mir: reicht OneDrive als zweiter Ort für die 8 Jahre? · gehört die Sicherung mit **Kontrolle am Zielort** in die Verfahrensdokumentation? · **CoS-F-008** · steigt Gate-1-Punkt 4.7 über die 40/100? | niemanden |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **🔴 PM-102 — der Wandanstrich verschwindet, Tapezieren wird erfunden.**
  626,62 € diktierte Arbeit fehlt, 1.714,96 € unbestellte Arbeit steht drin —
  auf derselben Zeile, in entgegengesetzte Richtungen. CoS-E-083, Platz 1.
* **🔴 PM-103 — 460,20 € Zuschlag, ausgelöst vom Raumnamen.** Derselbe Text
  mit „Wohnzimmer" statt „Altbauwohnzimmer" erzeugt ihn nicht.
* **🔴 PM-079-A war nie erledigt.** Die 65,00 m², die als Beleg galten, waren
  die Flächen des **ersten** Raums, nicht die Summe — 463,50 € zu wenig,
  sobald zwei Räume verraucht sind. Sperrklinke steht wieder offen.
* **🔴 PM-132 / CoS-E-081 — „Wir liefern 50 Stück Fliesen dazu" macht 50
  Türen**, 8.820,00 € Unterschied, mit „aus Transkript" auf dem Kundenpapier.
  Bau läuft uncommittet.
* **🟡 Die CI ist nicht messbar** (403 / veraltete Liste). Kein rotes Signal —
  ein ungemessenes. Produktion ist unabhängig davon grün.
* **Uncommittet im Arbeitsbaum:** Engineerings `helpers.ts` (CoS-E-081), die
  vier DC-128-Dateien des Designers, zwei Testreihen des Prüfmeisters.
  **Das darf niemand mitnehmen.** `git add -A` bleibt abgeschafft — steht
  jetzt als Regel in `AGENTS.md`, samt der lautlosen Falle beim eigenen Index.
* **Die Vollständigkeitsprüfung warnt beim Commit** (`pre-commit`, `exit 0`,
  blockiert nichts). Wer „ist committet" meldet, ohne die
  `[pre-commit]`-Zeilen gelesen zu haben, meldet einen Stand, der bei Vercel
  rot werden kann.
* **🟡 `ci.yml` hat ein BOM, und die CI lief zuletzt trotzdem grün** (#213).
  Nicht angefasst.
* **Es gibt keine echten Betriebe — nur Sandys Testkonto.**
* **Die 30-Tage-Löschzusage ist bis heute nie eingelöst worden.** Der erste
  Lauf, der wirklich löschen muss, ist der vom **19.09., 03:30 UTC**. Löscht
  er nichts, sind zwei veröffentlichte Rechtstexte unrichtig. **CoS-P-029.**
* **Die Sicherung läuft, der erste automatische Lauf steht heute Abend an.**
  Empfehlung an Finance bleibt: **Kontrolle am Zielort** ins Verfahren
  aufnehmen.
* **Git-Sperrreste und ein Worktree-Rest** (`.git/worktrees/alt`) liegen
  weiter da. Für git harmlos. Löschrecht anfordern geht in einem geplanten
  Lauf nicht — der Dialog braucht einen Menschen.
* **Die Landingpage bewirbt drei Buchhaltungs-Anbindungen. Es sind sieben.**
  Und dieselbe Anbindung heißt an zwei Stellen verschieden.
* **`lfdm` und `lfm` stehen auf derselben Angebotszeile.** Entscheidung liegt
  bei Engineering; vor dem Umbenennen `dc050-rechenweg-pdf.test.ts` und
  `dc119-wandflaechen-konflikt.test.ts` ansehen.
* **`menge_unbekannt` ist bewusst nicht gebaut.** Offen, wer die Messung macht.
* **403 ist nicht 404.** Heute habe ich aus „unser Zugang sieht das Projekt
  nicht" geschlossen, die Seite existiere nicht — und das an vier Rollen
  weitergegeben. Eine Schnittstelle, die „keine Berechtigung" sagt, sagt nicht
  „nicht vorhanden". Korrigiert hat es Sandy, nicht ich.

*Chief of Staff · 2026-09-17, 18:40 UTC*
