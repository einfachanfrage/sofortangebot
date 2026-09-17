# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 17.09.2026, 11:50 UTC · Chief of Staff**
*(ersetzt die Fassung von 11:40 UTC — diese Datei wird immer ersetzt, nie ergänzt.)*
*Alle Uhrzeiten in dieser Fassung sind **UTC**.*

---

## Lage in drei Zeilen

**Die teuerste Zahl des Projekts ist gemessen worden: auf einem gewöhnlichen
Badangebot stehen 543,84 €, wo 2.980,44 € hingehören.** Sechs von neun Zeilen
ohne Preis. Es trifft jedes Bad und jeden Betrieb. Der Bauauftrag ist gesetzt
und steht ab jetzt **vor** allem anderen bei Engineering.

**Fünf von Sandys Punkten sind heute Vormittag weggefallen** — Passwort-Reset,
IONOS-Weiterleitung, Zustelltest, Datenschutz-Freigabe, F-007. Alle fünf hat
sie selbst beantwortet.

**Die leere Belegablage ist schon wieder erledigt: Sandy hat ihre 26
Rechnungen selbst hineingezogen**, während wir darüber schrieben. **Offen
bleibt die Sicherung** — und dazu habe ich ihr zweimal Falsches geschrieben,
beides unten richtiggestellt.

**Vierzehn Commits liegen ungepusht.** Alles Gepushte ist unverändert grün,
Produktion läuft auf `da7db10`.

---

## Was seit 09:50 UTC passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| **Prüfmeister** | **🔴 PM-117 — den Preisweg eines Bades nachgefahren: 543,84 € statt 2.980,44 €**, sechs von neun Zeilen ohne Preis. Die Ursachen sauber getrennt (Router vs. Wortlaut) | ✅ gemessen |
| Prüfmeister | **PM-118** (keine Pauschale für die besenreine Übergabe) · **PM-119** (L-06 hat ein Soll: sieben Ausführungsstufen) · **PM-120** (Kontrolle gegen den Bauabschnitt-Auslöser) · **PD-021/PD-022** an den Designer | ✅ erledigt, Fallbasis 120 |
| **Engineering** | **CoS-E-074 gebaut** — der Bauabschnitt, der „später und extra" kommt, steht nicht mehr im Angebot. PM-116 **und** PM-097 grün, einmal gebaut statt zweimal | ✅ gebaut, von mir nachgemessen, committet |
| **Designer** | **DC-123 gebaut** — die Live-Vorschau kennt jetzt das Briefpapier. **Und ein zweiter Befund darunter:** die Briefpapier-Auswahl am Angebot war nie zu sehen (`briefpapier` statt `briefpapiere`, eine Abfrage ins Leere) | ✅ gebaut, nachgemessen, committet |
| **Sandy** | **CoS-P-013 beantwortet** („JA klappt!") · **IONOS-Weiterleitung eingerichtet** · **Zustelltest durchgeführt, kam an** | ✅ drei Punkte weg |
| **Sandy** | **L-KI-01 freigegeben** („ja darf rein!") | ✅ an Legal, Wortlaut unverändert. **Erst als zu geführt, wenn Legal meldet, dass der Satz drin ist** |
| **Sandy** | **F-007 beantwortet: es läuft KEINE Sicherung.** OneDrive-Konto vorhanden, nichts eingerichtet. Dazu von sich aus: ihre Rechnungen liegen in `Documents\sofortangebot\Rechnungen` | ✅ beantwortet |
| **Sandy** | **Neue Frage (CoS-F-008):** ändert die §-19-Entscheidung etwas für ihren Vollzeit-Job? | ✅ vorläufig beantwortet (nein, betrifft nur das Gewerbe), zur Bestätigung an Finance |
| CoS | **🔴 `belege/eingangsrechnungen/` war leer** — eine Datei, das Eingangsbuch | ✅ gefunden, an Finance |
| **Sandy** | **Alle Rechnungen selbst nach `belege\eingangsrechnungen\` gezogen** — nachgezählt **26 Dateien, 1,7 MB**, Unterordner `2026\` | ✅ **Ablage stimmt jetzt mit der Verfahrensdokumentation überein**, ohne Pfadänderung |
| **Sandy** | **Widerspruch: sie WILL den ganzen Projektordner gesichert haben** („Laptop ist nicht mehr der neuste") | ✅ **berechtigt — mein Gegenargument war falsch**, siehe unten |
| CoS | **`scripts/sicherung-onedrive.ps1` gebaut** — ganzer Projektordner nach OneDrive, ohne `node_modules`/`.next`, löscht nichts, reines ASCII ohne BOM | ✅ gebaut, ungetestet (läuft auf Windows, nicht in dieser Shell) |
| CoS | **Zwei eigene Fehler richtiggestellt** (Größe des Projektordners · „liegt ja auf GitHub") | ✅ korrigiert, an Sandy und Finance |
| CoS | **CoS-E-078** — PM-117 + PM-060-A als nächster Bau gesetzt, **vor** der Tapezier-Nische; meine eigene Reihenfolge von 09:50 dafür zurückgezogen | ✅ erledigt |
| CoS | **DC-125** — die Nullzeile ist ab jetzt eine Produktregel, keine Einzelfrage. Regel selbst entschieden, nicht Sandy vorgelegt | ✅ erledigt |
| CoS | **Beide ENDE-Meldungen des Prüfmeisters erledigt** — fünf Dateien hatten gar keine Markierung, jetzt gesetzt; das Bruchstück in `pruefmeister-testfaelle.md` als Fließtext neu geschrieben | ✅ erledigt |
| CoS | **`tsconfig.json`: `_to_delete` ausgeschlossen** — `tsc` ist lokal wieder aussagekräftig (Meldung des Designers) | ✅ erledigt |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **Alle 180 Prüfstände, in 17 Teilen, auf Sandys Rechner, auf dem gemeinsamen
  Stand aus Engineering + Designer:** **2693 grün · 94 Sperrklinken · 0 rot.**
  Keine fremde Zusicherung ist rot geworden.
* **`npx tsc --noEmit -p tsconfig.json`: sauber** — nach meinem eigenen
  `exclude`-Fix. Vorher meldete es 33 Fehler, alle aus `_to_delete/`.
* **`eslint` über die 11 geänderten Dateien: 0 Fehler**, 14 Warnungen (Bestand).
* **Vercel-Deploy-Liste:** Produktion **READY** auf `da7db10`, 07:35.
  **Kein neuer Deploy seit dem letzten Durchlauf.**
* **`git log origin/main..main`: vierzehn** Commits ungepusht, `origin/main`
  steht unverändert auf `da7db10`.
* **ENDE-Markierungen über alle `docs/*.md` gezählt:** keine Datei mit mehr als
  einer, 33 mit genau einer.
* **`node scripts/docs-sichern.mjs pruefen`:** „Alle 57 Doku-Dateien in Ordnung."
* **`entscheidungen-fuer-sandy.md` frisch gelesen**, bevor ich unten „offen"
  schreibe.
* **Die Belegablage zweimal gezählt:** um 10:45 **eine** Datei, um 11:45
  **26 Dateien / 1,7 MB** in `belege/eingangsrechnungen/2026/`. `.gitignore`
  Zeile 59 hält sie weiterhin aus dem öffentlichen Repo heraus.
* **🔴 Die Größe NEU gemessen — meine erste Zahl war falsch.** Ich hatte „2,9 GB"
  geschrieben; mein `--exclude=node_modules` hatte nicht gegriffen. Richtig:
  `node_modules` **rund 2,8 GB**, **alles andere zusammen rund 135 MB**
  (`.git` 100 MB · `docs/` 15 MB · `src/` 7 MB · `_to_delete/` 4,7 MB ·
  `tests/` 2,3 MB · `belege/` 1,7 MB). **Darauf stand mein „lohnt sich nicht"
  — es stand auf einer falsch erhobenen Zahl.**
* **Die OneDrive-Einschränkung nachgelesen, nicht vermutet:** der
  Windows-Client synchronisiert **nur ein privates Microsoft-Konto
  gleichzeitig** (Microsoft-Learn-Auskunft).
* **Sandys Benutzerordner abgefragt:** **kein OneDrive-Ordner sichtbar** —
  spricht dafür, dass noch keins eingerichtet ist.
* **Zur CI-Widersprüchlichkeit unten:** die **#206 grün auf `da7db10`** stammt
  aus einer eigenen Messung um **09:43 UTC** aus derselben Shell, zusammen mit
  #205/#204/#203/#202 und dem zweiten Arbeitsablauf #59. Die `403` sind also
  **zeitweise, nicht dauerhaft**. Beide Beobachtungen stimmen; die Laufliste
  ist mal erreichbar und mal nicht.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Die CI-Laufliste konnte ich in diesem Lauf nicht messen.** Die GitHub-API
  hat dreimal mit `403` geantwortet; die eine Antwort, die durchkam, endete bei
  Lauf **#194 vom 16.09.** und widerspricht damit dem, was um 09:50 hier stand
  (#206 grün). **Ich lasse den Widerspruch stehen, statt eine der beiden Zahlen
  zu glauben.** Was sicher ist und nicht aus der API kommt: seit 07:35 wurde
  **nichts gepusht**, der CI-Stand kann sich also nicht geändert haben.
* **Die Badrechnung des Prüfmeisters habe ich nicht nachgerechnet.** Die
  543,84 € sind seine Zahl. Ich habe sie gelesen, für schlüssig gehalten und
  weitergegeben.
* **Gate 1 rechne ich weiter nicht neu.** Stand bleibt **53,0 %**. Legals 7.13
  und inzwischen sechs DC-Punkte sind nicht eingerechnet — das gehört in einen
  Lauf, der `launch-readiness.md` ganz durchgeht.
* **Die 26 Belege habe ich nicht angefasst** — nicht gelesen, nicht
  umbenannt, nicht sortiert, nicht ins Eingangsbuch eingetragen. Das ist
  Finance' Verfahren, daran arbeite ich nicht vorbei.
* **`scripts/sicherung-onedrive.ps1` ist ungetestet.** Es läuft auf Windows;
  diese Shell ist Linux und hat weder `robocopy` noch OneDrive. Geprüft habe
  ich nur, was hier prüfbar ist: Klammern paarig, **kein BOM, reines ASCII**
  (die Fehlerklasse aus `ci.yml` und `pre-push`).
* **Ob OneDrive für die 8-Jahres-Aufbewahrungspflicht als zweiter Ort
  ausreicht**, ist eine Fachfrage und liegt bei Finance.
* **Ob die §-19-Entscheidung wirklich nichts an Sandys Arbeitsverhältnis
  ändert**, habe ich nicht fachlich geprüft. Ich habe ihr gesagt, was ich weiß,
  und dass ich kein Steuerberater bin. Die Bestätigung holt Finance.
* **Ob die Zusage „unwiderruflich entfernt" noch an anderer Stelle steht**
  (AGB, KI-Kennzeichnung, Hilfetexte), habe ich nicht nachgezählt. Legal prüft
  es beim Einbauen mit.
* **Wie ein Badangebot oder die drei Logo-Stufen auf Papier aussehen**, hat
  niemand gesehen. Ein Prüfstand misst, dass ein PDF entsteht, nicht wie es
  aussieht.
* **Die Landingpage selbst habe ich nicht aufgerufen.**
* **Versicherung, Stripe, Gewerbeanmeldung, Vercel-Benachrichtigung** — in
  diesem Lauf nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🟡 **Pushen.** **Vierzehn Commits** liegen bereit. | ein Befehl |
| 2 | 🔴 **Preis bei § 19 (A/B), F-006** — tendiert zu **B** (Regelbesteuerung). **Die Landingpage darf vorher nicht live gehen.** | ein Satz |
| 3 | 🔴 **Sicherung einschalten.** OneDrive mit `einfachanfrage@outlook.com` anmelden, dann `scripts\sicherung-onedrive.ps1` einmal starten und als tägliche Aufgabe einrichten. Anleitung liegt bereit | einmal 10 Minuten |
| 4 | 🔵 **Buchhaltungs-Testlauf** (Lexware Office) · **E-Rechnungs-Viewer** (Quba, 0 €) | nicht eilig |
| 5 | Vercel-Benachrichtigung · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert, in diesem Lauf nicht geprüft |

**Erledigt und weg von ihrer Liste:** **CoS-P-013** (Passwort-Reset komplett
durchgelaufen) · **IONOS-Weiterleitung `rechnung@`** · **Zustelltest** (kam an,
mit allen drei Anhängen — damit ist der E-Rechnungs-Empfang belegt und nicht
nur eingerichtet) · **L-KI-01** (freigegeben, Einbau läuft) · **F-007**
(beantwortet).

**Fünf an einem Vormittag — und einer davon hat einen roten Punkt
hinterlassen.** F-007 hat nicht nur eine Antwort gebracht, sondern den Fund,
dass die Belege nirgends gesichert sind. **Drei offene Punkte statt sechs**,
aber der neue wiegt schwerer als die fünf, die gegangen sind.

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **🔴 PM-117 + PM-060-A, zusammen** (1.961,38 € auf jedem Bad). Danach **PM-119/L-06** (Soll liegt vor), danach Zug 2 mit der **Tapezier-Nische**. **Die Reihenfolge von 09:50 ist damit zurückgezogen.** | niemanden |
| **Designer** | **DC-122** ohne den Fußzeilenteil (Schrift, Akzentfarbe), dann die Fußzeile nach Legals Antwort, dann **DC-124**. Dazu neu und ohne Zeitdruck: **DC-125** (Anzeige der Nullzeile) und **PD-021** (die Gliederung „Nach Arbeitsablauf"). | Legal (nur der Fußzeilenteil von DC-122) |
| **Prüfmeister** | **Spur leer.** Alles aus dem Mittagslauf ist beantwortet, beide ENDE-Meldungen sind zu. Nächstes: wartet auf neue Bitten, sonst Fallbasis weiter (120 Fälle). | niemanden |
| **Legal** | **Zuerst: L-KI-01 einbauen** (freigegeben, Wortlaut unverändert) und melden, wenn er drin ist; dabei prüfen, ob dieselbe Zusage noch woanders steht. Danach **CoS-L-011** — dürfen freie Fußzeilen die Pflichtangaben auf dem Angebot ersetzen (A/B/C)? | niemanden |
| **Marketing** | **Textseitig fertig, wartet bewusst.** Positionstitel entschieden, der Prüfmeister hat die Bodenleger-Zeilen bestätigt. | Sandys A/B zu § 19 · Sandys Buchhaltungs-Testlauf |
| **Platform** | **CoS-P-029 — ein Termin, kein Auftrag:** am **19.09. nach 03:30 UTC** einmal `system_laeufe` prüfen (`aufnahmen.dateien > 0`?). | niemanden |
| **Finance** | **Sein Zug: 26 unbearbeitete Belege liegen jetzt in seiner Ablage** — prüfen, ins Eingangsbuch, Prüfsummen. Dazu drei Fragen von mir: reicht OneDrive als zweiter Ort für die 8 Jahre? · gehört die Sicherung in die Verfahrensdokumentation? · **CoS-F-008** (ändert § 19 etwas für Sandys Vollzeit-Job?). Und ob Gate-1-Punkt 4.7 über die 40/100 steigt | Sandys A/B zu § 19 |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **🔴 PM-117 — 543,84 € statt 2.980,44 € auf einem gewöhnlichen Bad.**
  Sechs von neun Zeilen ohne Preis. **Die Auflage, auf die es ankommt:**
  `/wand/` im Router trägt nur 652,96 € davon; die beiden anderen Wandzeilen
  (1.308,42 €) scheitern zusätzlich am Wortlaut (PM-060-A) und blieben nach
  einem reinen Router-Fix bei null. **Ein halber Fix sieht behoben aus und ist
  es nicht.** CoS-E-078.
* **🔴 Der ganze Projektordner hängt an einer einzigen Festplatte**, bis die
  Sicherung läuft. **„Liegt ja auf GitHub" trägt nicht** — genau die Dateien,
  die man nicht nachbauen kann, sind dort ausgeschlossen: die 26
  Eingangsrechnungen (`.gitignore` Zeile 59, richtig so, das Repo ist
  öffentlich) und die `.env`-Dateien. **Das habe ich Sandy zunächst falsch
  gesagt; sie hat widersprochen und hatte recht.**
* **DC-125 — eine Zeile ohne Betrag darf ein Kundenangebot nicht verlassen.**
  Das ist ab jetzt Produktregel, nicht Einzelfall. Vierte Ausprägung derselben
  Frage (H, L.5, DC-112, PM-117). Die Anzeige gehört dem Designer, die Ursache
  Engineering.
* **Die Briefpapier-Auswahl am einzelnen Angebot war nie sichtbar** — seit
  Monaten, weil eine Abfrage ins Leere lief und der Fehler still als „keine
  Briefpapiere" gelesen wurde. Behoben in DC-123. **Es sah nie kaputt aus** —
  die Fehlerform, die keine Prüfliste findet.
* **Die Mini-Vorschau auf der Briefpapier-Seite zeigt eine Wirkung, die es
  nicht gibt** (Schrift, Akzentfarbe, drei Fußzeilen). DC-122.
* **Zwei Stellen laden ein Logo hoch**, das Briefpapier gewinnt stillschweigend.
  DC-124.
* **Die 30-Tage-Löschzusage ist bis heute nie eingelöst worden.** Der erste
  Lauf, der wirklich löschen muss, ist der vom **19.09., 03:30 UTC**. Löscht er
  nichts, sind zwei veröffentlichte Rechtstexte unrichtig. **CoS-P-029.**
* **Die ENDE-Markierung steht ab jetzt in jeder Datei genau einmal — und die
  einfache Suche stimmt jetzt auch.** Das Bruchstück in
  `pruefmeister-testfaelle.md` ist weg; niemand muss mehr wissen, dass eine
  Datei eine Ausnahme war.
* **`git add -A` ist abgeschafft.** Dateien werden einzeln benannt.
* **Löschen geht in dieser Shell nicht**, und die Anforderung des Löschrechts
  wird in einem geplanten Lauf abgelehnt — niemand ist da, der den Dialog
  beantwortet. `mv` nach `_to_delete/git-reste-JJJJ-MM-TT/` ist die
  Vorgehensweise, nicht der Notbehelf.
* **`_to_delete/` ist jetzt aus `tsconfig.json` ausgeschlossen.** Wer von Hand
  `tsc` laufen lässt, bekommt wieder eine ehrliche Ausgabe.
* **Die Landingpage bewirbt drei Buchhaltungs-Anbindungen. Es sind sieben.**
* **Dieselbe Anbindung heißt an zwei Stellen verschieden** („Lexoffice" vs.
  „Lexoffice (Legacy)"). Ein Wort in `integrations.ts`. Kein Auftrag, eine
  Meldung.
* **`menge_unbekannt` ist bewusst nicht gebaut.** Offen, wer die Messung macht.
* **Das GitHub-403 bleibt, und es ist schlimmer geworden:** in diesem Lauf war
  nicht nur die Schritt-Ebene gesperrt, sondern auch die Laufliste. Ohne Token
  aus Sandys Konto ist der CI-Stand zeitweise gar nicht messbar.

*Chief of Staff · 2026-09-17, 11:50 UTC*
