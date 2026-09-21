# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 21.09.2026, 08:05 UTC · Chief of Staff**
*(ersetzt die Fassung von 08:00 UTC — diese Datei wird immer ersetzt, nie ergänzt.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**,
also 10:00 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟢 Alles, was gepusht ist, ist grün — und diesmal gemessen, nicht vermutet.**
Vercel, 07:44 UTC: jüngster Produktions-Deploy ist **`3c662af`, READY**.
GitHub-Actions, 07:47 UTC: **CI-Lauf #219 auf demselben `3c662af`, success**.
Damit ist der gelbe Punkt der letzten Fassung („CI nicht messbar, 403") zu:
die Abfrage läuft aus dem Ordner auf Sandys Rechner heraus, nicht aus dem
Cloud-Container. Die Produktionssicherung der Datenbank lief am 18., 19. und
20.09. jeweils erfolgreich.

**⏸️ Zwischen dem 17.09., 18:25 UTC und heute, 07:30 UTC hat keine Rolle
gearbeitet.** Gemessen an den geplanten Aufgaben: der letzte Lauf von
Engineering war am 17.09. um 18:25, Designer 17:15, Prüfmeister 16:06,
Marketing 15:50, Finance 15:56, Legal 08:08. Seit heute ~07:30 sind **alle
Aufgaben wieder aktiv** und haben einen nächsten Termin heute (Legal 08:07,
Designer 08:15, Engineering 08:25, Platform 08:35, Marketing 09:50, Finance
09:55, Prüfmeister 10:05). **Warum es stillstand, weiß ich nicht — ich
behaupte dazu nichts.** Praktische Folge: die Reihenfolge unten ist die vom
17.09. abends, nur um das ergänzt, was seither fertig wurde.

**🔴 Zwei der drei teuersten Funde sind gebaut, der dritte ist der nächste.**
PM-102 (626,62 € fehlten, 1.714,96 € erfunden) und PM-103 (460,20 €
Zuschlag aus einem Raumnamen) sind zu (`98c41ae`). **PM-079-A** — 463,50 € zu
wenig, sobald zwei Räume verraucht sind — ist damit Platz 1 bei Engineering.

---

## Was seit dem 17.09., 18:55 UTC fertig geworden ist

| Rolle | Ergebnis | Status |
|---|---|---|
| **Engineering** | **CoS-E-081 gebaut und committet** (`a99791a`): die `anzahlAus`-Familie ist zu — PM-131/132/133 gebaut, PM-128 fällt mit. („50 Stück Fliesen" macht keine 50 Türen mehr.) | ✅ erledigt |
| **Engineering** | **CoS-E-084 gebaut und committet** (`98c41ae`): **PM-102** und **PM-103**. Platz 2 der CoS-E-083-Reihenfolge ist zu | ✅ erledigt |
| **CoS** | **Gate 1 neu gerechnet**: 53,0 % → **54,2 %** (`151f4f4`, Heimat `launch-readiness.md`) | ✅ erledigt |
| **CoS** | **Siebter wöchentlicher strategischer Check-in** eingetragen (`f249b3d`, `vision-strategie.md`) | ✅ erledigt |
| **Platform** | **CoS-P-029 eingelöst** — der Löschlauf vom 19.09., 03:30 UTC hat **4 Aufnahmen** gegen die 30-Tage-Frist geprüft, `fehler: 0`. Der Nein-Fall („zwei Rechtstexte unrichtig") ist **nicht** eingetreten, Legal muss nicht benachrichtigt werden | ✅ erledigt |
| **Platform** | **CoS-P-006 vollständig zu** — `RESEND_API_KEY` ist für `preview` **und** `production` gesetzt, Zeitstempel deckt sich mit der Rotation vom 17.08. | ✅ erledigt |
| **CoS** | **CoS-P-033 neu angelegt** — Platform hat selbst angemerkt, dass der Zähler `geprueft` heißt und nicht `geloescht`. Die Rechtstexte versprechen Löschung. Eine Abfrage, kein Bau | 🆕 verteilt |
| **CoS** | **Die Gewerke-Frage in `entscheidungen-fuer-sandy.md` gestellt** — dreimal im Strategiepapier gefragt, dreimal untergegangen. Jetzt mit A/B/C und Empfehlung an der Stelle, an der Sandys offene Punkte stehen | ✅ erledigt |
| **Sandy** | **Entschieden, 07:58 UTC — „A":** nächstes Gewerk nach Maler und Bodenleger ist **Trockenbau**, als **Richtung nach Gate 1**, nicht als Bauauftrag. Eingetragen in `entscheidungen-fuer-sandy.md` und `vision-strategie.md`; Prüfmeister und Marketing (CoS-M-017) sind informiert. Die seit 07.09. dreimal gestellte Frage ist beantwortet | ✅ erledigt |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, 07:44–07:55 UTC:**

* **Vercel-API:** jüngster Produktions-Deploy `3c662af`, **READY**.
* **GitHub-Actions-API (aus dem verbundenen Ordner heraus):** **#219 auf
  `3c662af`, success**; davor #211–#218 alle success. Sicherungslauf
  „Production database backup" #60/#61/#62 am 18./19./20.09., alle success.
* **`git fetch` + `git rev-parse`:** `origin/main` = **`3c662af`**, lokal liegt
  **ein ungepushter Commit** davor (`f249b3d`, nur Doku).
* **`git status`:** uncommittet im Arbeitsbaum liegen **vier geänderte
  Quelldateien** (`entwurf/page.tsx`, `generiere-positionen/route.ts`,
  `zeit-ausschluss.ts`, `pruefmeister-batch-47-56.test.ts`) und **eine neue
  Testdatei** (`dc128-zeit-ausschluss-sichtbar.test.ts`) — DC-128 des Designers
  und die Testreihe des Prüfmeisters, seit dem 17.09. unverändert liegen
  geblieben.
* **Die geplanten Aufgaben aller acht Rollen:** alle **aktiv**, keine
  abgeschaltet, letzte Läufe und nächste Termine wie oben.
* **`node scripts/docs-sichern.mjs pruefen`:** „Alle 58 Doku-Dateien in
  Ordnung", vor und nach meinem Anhängen.
* **Gelesen, bevor ich darüber berichte:** Engineering-Liste (CoS-E-084),
  Restliste, `entscheidungen-fuer-sandy.md`, Platform-Liste,
  `launch-readiness.md` (Zeile 41), `vision-strategie.md`.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Kein eigener Prüfstand.** Ich habe in diesem Lauf keine Tests gefahren.
  Der letzte belegte Stand ist Engineerings Messung vom 17.09., 17:15 UTC
  (190 Testdateien, 2.954 Prüfungen, 0 rot) — plus CI #219 grün auf dem
  gepushten Stand.
* **Der OneDrive-Sicherungslauf vom 17.09. abends** — ob er angekommen ist,
  habe ich nicht nachgesehen.
* **Versicherung, Stripe, Gewerbeanmeldung, Vercel-Benachrichtigung,
  Buchhaltungs-Testlauf** — nicht angefasst.
* **Gate 1 rechne ich in diesem Lauf nicht neu.** Stand bleibt **54,2 %**.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Einmal pushen.** Es liegt ein fertiger Doku-Commit hier plus meine heutigen Einträge, kein Code. Block steht unten im Chat | ein Befehl |
| 2 | ⚪ **Freigabe für den Landingpage-Entwurf — freiwillig.** Nur falls du eine Messung bei echter Handy-Breite (375 px) willst | freiwillig |
| 3 | 🔵 **Ab 26.09.:** Gewerbeanmeldung → Fragebogen zur steuerlichen Erfassung → Geschäftskonto → Steuerberater. Finance und Legal legen die Reihenfolge fertig hin | nichts jetzt |
| 4 | 🔵 **Buchhaltungs-Testlauf** (Lexware Office, fünf Minuten) · **E-Rechnungs-Viewer** (Quba, 0 €) | nicht eilig |
| 5 | 🔵 **Versicherung** (exali/Markel 1 Mio. €) · **Stripe** (Konto + 2 Preise) · **Vercel-Benachrichtigung** · Gewerbeanmeldung KW 41 (CoS-041) | unverändert |

**Es wartet keine Rolle auf Sandy, und nichts davon ist dringend.** Die eine
Frage, die nach vier Tagen Stillstand wirklich offen war — das nächste Gewerk —
ist heute um 07:58 UTC beantwortet.

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **CoS-E-083 weiter, in dieser Reihenfolge:** **PM-079-A** (Regression, nicht neu bauen: über alle Räume summieren) → **PM-106 + PM-107 zusammen** → **PM-105**. Danach unverändert **CoS-038 → PM-119/L-06 → CoS-E-080**. Die Bemessungsgrundlage der fünf Erschwerniszuschläge ist seit 17.09., 18:15 UTC freigegeben und wird mit PM-103/PM-104 gebaut, nicht vorgezogen | niemanden |
| **Prüfmeister** | **Zuerst die Frage beantworten, die Engineering ihm zurückgegeben hat:** zählt „Altbauwohnung"/„Altbauhaus" als Zustandsaussage (**A** nur freistehendes Wort · **B** Wohnung/Haus zählen mit · **C** es braucht ein Zustandswort daneben)? Bis dahin steht A. Danach: **seine eigene Testdatei committen** (liegt seit dem 17.09. uncommittet), dann **Themenspeicher-Punkt 14**. **Neu, kein Auftrag:** was ihm nebenbei zu **Trockenbau** auffällt (Vokabular, Einheiten, Rechenwege), sammelt er ab jetzt im Themenspeicher, statt es wegzuwerfen | niemanden |
| **Designer** | **DC-128 zu Ende und committen** (liegt seit dem 17.09. uncommittet, vier Dateien), dann **DC-127** (dunkler Tabellenkopf, nur eine der beiden Seiten ändern). **PD-023** liegt zum Lesen da, **PD-018 §3** ist seiner und vollständig entschieden — sinnvoll erst, nachdem Engineering die Grundlage umgestellt hat. DC-122 Fußzeile bleibt bei Legal | Legal (nur DC-122) |
| **Platform** | **🆕 CoS-P-033:** liegen die vier Aufnahmen aus dem 19.09.-Lauf wirklich nicht mehr da, oder wurden sie nur geprüft? Eine Abfrage, kein Bau. Bei „nur geprüft" nichts umbauen, sondern melden | niemanden |
| **Marketing** | **🆕 CoS-M-017 gelesen, bevor irgendetwas geschrieben wird:** Trockenbau ist entschieden, darf im Content-Vorrat mitgedacht, aber **nirgends beworben** werden und bekommt **keinen Termin**. Danach wie gehabt: **CoS-M-016 zuerst** (Abschluss-CTA kann auf dem Handy leer bleiben — die Stelle, an der geklickt werden soll), danach Vorschau-Umschalter raus (M-6), Hero kürzen, Reiter-Kante. Dann **CoS-M-014** (zwei Zahlen), danach Zustelltest `support@`. Der Website-Schalter bleibt hinter **CoS-038** | Engineering (CoS-038) · Sandys Buchhaltungs-Testlauf |
| **Legal** | **Zuerst L-KI-01 einbauen** (freigegeben, Wortlaut unverändert) und melden, wenn er drin ist; dabei prüfen, ob dieselbe Zusage noch woanders steht. Dann **CoS-L-011** (dürfen freie Fußzeilen die Pflichtangaben ersetzen — A/B/C?), dann **CoS-L-012**. **Nichts zu tun wegen der Löschfrist** — der Lauf vom 19.09. hat geprüft, der Nein-Fall ist nicht eingetreten | niemanden |
| **Finance** | **CoS-F-009** (Vorsteuer in die Kostenübersicht, Reverse-Charge auf „durchlaufend", Voranmeldungsrhythmus als Frage für den Steuerberater) · **Behördenliste für Sandy bis 26.09.** — das ist der Termin mit dem kürzesten Vorlauf · **26 unbearbeitete Belege** · **CoS-F-008** · steigt Gate-1-Punkt 4.7 über die 40/100? | niemanden |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **🔴 PM-079-A war nie erledigt.** Die 65,00 m², die als Beleg galten, waren
  die Flächen des **ersten** Raums, nicht die Summe — 463,50 € zu wenig,
  sobald zwei Räume verraucht sind. Sperrklinke steht offen, Platz 1 bei
  Engineering.
* **🟡 Uncommittet im Arbeitsbaum, seit vier Tagen:** die vier DC-128-Dateien
  des Designers und die Testreihe des Prüfmeisters. **Das darf niemand
  mitnehmen.** `git add -A` bleibt abgeschafft — die Regel steht in
  `AGENTS.md`, samt der lautlosen Falle beim eigenen Index. Wer seine Arbeit
  fortsetzt, committet **seine** Dateien.
* **🟡 „geprüft" ist nicht „gelöscht".** Der Lauf vom 19.09. hat 4 Aufnahmen
  geprüft; ob sie verschwunden sind, ist nicht gemessen. Datenschutzerklärung
  und AGB versprechen Löschung. **CoS-P-033.**
* **Die Vollständigkeitsprüfung warnt beim Commit** (`pre-commit`, `exit 0`,
  blockiert nichts). Wer „ist committet" meldet, ohne die
  `[pre-commit]`-Zeilen gelesen zu haben, meldet einen Stand, der bei Vercel
  rot werden kann.
* **🟡 `ci.yml` hat ein BOM, und die CI läuft trotzdem grün** (#219). Nicht
  angefasst.
* **Es gibt keine echten Betriebe — nur Sandys Testkonto.**
* **Git-Sperrreste und ein Worktree-Rest** (`.git/worktrees/alt`) liegen
  weiter da. Für git harmlos. Löschrecht anfordern geht in einem geplanten
  Lauf nicht — der Dialog braucht einen Menschen.
* **Die Landingpage bewirbt drei Buchhaltungs-Anbindungen. Es sind sieben.**
  Und dieselbe Anbindung heißt an zwei Stellen verschieden.
* **`lfdm` und `lfm` stehen auf derselben Angebotszeile.** Entscheidung liegt
  bei Engineering; vor dem Umbenennen `dc050-rechenweg-pdf.test.ts` und
  `dc119-wandflaechen-konflikt.test.ts` ansehen.
* **`menge_unbekannt` ist bewusst nicht gebaut.** Offen, wer die Messung macht.
* **403 ist nicht 404.** Am 17.09. habe ich aus „unser Zugang sieht das Projekt
  nicht" geschlossen, die Seite existiere nicht — und das an vier Rollen
  weitergegeben. Eine Schnittstelle, die „keine Berechtigung" sagt, sagt nicht
  „nicht vorhanden". Heute hat dieselbe Vorsicht geholfen: die
  GitHub-Abfrage, die im Cloud-Container mit 403 antwortet, läuft aus dem
  verbundenen Ordner heraus ohne Weiteres.

*Chief of Staff · 2026-09-21, 08:05 UTC*
