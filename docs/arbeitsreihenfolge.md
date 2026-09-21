# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 21.09.2026, 16:00 UTC · Chief of Staff**
*(ersetzt die Fassung von 15:20 UTC — diese Datei wird immer ersetzt, nie ergänzt.
Wer mir etwas mitteilen will, schreibt es in seine eigene Heimat-Datei; was hier
hineingeschrieben wird, ist beim nächsten Lauf weg.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**,
also 18:00 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟢 Der Server ist grün, und zwar auf dem neuesten Stand.** Sandy hat um
**15:41 UTC gepusht**. GitHub-Actions: **CI auf `b973c26` success**, 15:44:15
UTC. Vercel: Produktion **`b973c26`, READY**. Die acht jüngsten
Produktions-Deploys sind alle READY.

**🟢 Was lokal liegt, ist grün — selbst gemessen, nach den Commits.**
`npx tsc --noEmit` über das ganze Projekt **0 Fehler**; **58 Testdateien** in
zwei Blöcken **984 grün · 60 Sperrklinken · 0 rot**; nach den Commits noch
einmal 12 Dateien **141 grün · 0 rot**. Der Arbeitsbaum ist **sauber**, es
liegt nichts Uncommittetes mehr herum.

**🟡 Vier Commits liegen ungepusht. Sandy muss einmal pushen** — Block steht
im Chat. Vorher passiert nichts auf dem Server, und nichts davon ist in der CI
gewesen.

---

## Was seit 15:20 UTC fertig geworden ist

| Wer | Was | Wo |
|---|---|---|
| **Engineering** | **CoS-E-088 — die deutsche Zahl auf dem Kundenpapier.** Mein Auftrag hieß „eine Zeile"; es waren **dreizehn Stellen** in `maler-sonder.ts`, die die Menge ungeformt in den Rechenweg gaben („47.5 m²" statt „47,5 m²"). Alle in einem Zug, weil eine reparierte Zeile neben zwölf unreparierten das Blatt uneinheitlich macht. Neuer Prüfraum rechnet ausdrücklich **krumm** (47,50 / 22,26 / 69,76 m²), runder Gegenfall daneben | `6bdf895` (selbst committet) |
| **Designer** | **DC-132 — die Vorschau ist jetzt so breit wie das Blatt.** Sie war nie maßstäbliches A4 (78 % der Breite, 100 % der Typografie); deshalb passten die Spalten des Papiers dort nicht. Jetzt **595 pt = 595 px**, Spaltenbreiten **aus `lib/pdf.tsx` gelesen**, Maßstab außen gemessen statt geraten, Logo-Faktor von 48/42 auf **1**. Mitbehoben: der leere Streifen unter der Vorschau. **Gefunden dabei:** „GESAMTPREIS" lief auf 375/360 px schon über die Spalte hinaus — ein echter Fehler, nicht nur eine Abweichung | `4959907` (Commit vom CoS) |
| **Platform** | **CoS-P-035 — die Index-Falle ist an der Ursache zu.** `docs-sichern.mjs` setzt den geteilten Index jetzt auf **`HEAD`** statt auf den Arbeitsbaum und deckt nicht mehr nur `docs/` ab. `AGENTS.md` Punkt 4 entsprechend korrigiert (`git reset -q` statt `git add`) | `53e7b47` (Commit vom CoS) |
| **CoS** | Zwei fertige Rollen-Läufe committet, die selbst nicht committen konnten · Spitze nach jedem Commit neu gemessen · **DC-133**, **CoS-E-090**, **CoS-P-036** verteilt · eigener Reihenfolge-Fehler korrigiert (siehe unten) | dieser Lauf |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, 15:42–16:00 UTC, alles direkt auf Sandys Rechner:**

* **GitHub-Actions-API:** CI auf `b973c26` **completed / success**, 15:44:15
  UTC. Der Lauf war beim Beginn meines Laufs noch `in_progress` — ich habe
  gewartet, statt „läuft grün" zu schreiben.
* **Vercel-API:** Produktion **`b973c26`, READY**; acht von acht READY.
* **`git fetch` + `git rev-parse`:** `origin/main` = `b973c26` = der Stand, den
  Sandy um 15:41 gepusht hat. **Null ungepusht vor diesem Lauf**, vier danach.
* **`npx tsc --noEmit` über das ganze Projekt:** **0 Fehler** — einmal vor den
  Commits, einmal danach.
* **Delta-Prüfstand, 58 Dateien** (jede Testdatei, die Rechenweg, Wandfläche,
  Isoliergrund, Kalkputz, Beton, Dachschräge, Briefpapier oder die
  Angebots-Vorschau anfasst): **984 grün · 60 Sperrklinken · 0 rot**.
* **Nach den zwei Commits noch einmal 12 Dateien** (dc121–dc132, cos-e-085,
  cos-e-088, dc050, dc107): **141 grün · 0 rot**.
* **`node scripts/docs-sichern.mjs pruefen`:** **59 Doku-Dateien in Ordnung.**
* **`legal-007` selbst aufgeschlagen** (Datei unverändert seit 08:14 UTC):
  Zeile 343 und Zeile 276 sagen weiter **„Kleinunternehmer"**. Der Punkt für
  Sandy steht also unverändert.
* **`.git` nachgezählt:** 72 liegen gebliebene `tmp_obj_*`, 201 Lock-Reste,
  `.git/objects` 101 MB — Folge des fehlenden Löschrechts.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Kein voller Prüfstand über alle Testdateien.** Gemessen ist ein Delta von
  58 Dateien. Die letzte belegte Vollmessung ist Platforms (194 Dateien,
  2.897 grün, 96 erwartet fehlschlagend) — **die habe ich nicht wiederholt.**
* **Die neue Vorschau hat niemand im laufenden Produkt gesehen** — der
  Designer sagt das selbst. Gemessen ist die Geometrie, nicht der Eindruck.
* **Den Landingpage-Entwurf habe ich nicht bei 375 px nachgemessen.**
* **Gate 1 rechne ich in diesem Lauf nicht neu.** Stand bleibt **54,2 %**.
* **Versicherung, Stripe, Gewerbeanmeldung, Buchhaltungs-Testlauf,
  OneDrive-Sicherung** — nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Einmal pushen.** Vier Commits liegen lokal, keiner war in der CI. Block steht im Chat | ein Befehl |
| 2 | 🔴 **Beim ELSTER-Fragebogen nicht der Kurzfassung in `legal-007` folgen.** Dort steht unten noch „Kleinunternehmer ankreuzen" — **falsch**, und das Kreuz bindet fünf Jahre. Richtig ist **Verzicht auf die Kleinunternehmerregelung**, so wie am 17.09. entschieden. **Halte dich an Finances Behördenliste**, die sagt es richtig. Legal zieht die zwei Zeilen nach (CoS-L-014) | nichts jetzt |
| 3 | 🔵 **Vor der Gewerbeanmeldung in den Arbeitsvertrag sehen** — Klausel zu Nebentätigkeiten. Muss **davor** passieren, danach wäre eine Anzeige verspätet. Wie die Klausel zu lesen ist, sagt dir Legal | 10 Min |
| 4 | 🔵 **Löschrecht für den Projektordner.** Ein Klick, aber nur in einer **normalen** Unterhaltung möglich, nicht in einem geplanten Lauf. Inzwischen messbar: 72 Reste in `.git/objects`, 201 Lock-Reste, 101 MB. **Nicht dringend** | ein Klick |
| 5 | 🔵 **Ab 26.09. bzw. KW 41:** Gewerbeanmeldung → Fragebogen → Geschäftskonto → Steuerberater. Alles steht in `finance-002-behoerdenliste-fuer-sandy.md` | nichts jetzt |
| 6 | ⚪ **Einmal selbst einsprechen — freiwillig.** Der Designer kann das Bernsteinbanner ohne echte Sprachaufnahme nicht prüfen: ein Raum normal, ein zweiter mit „das kommt später und wird extra angeboten" | 2 Minuten |
| 7 | 🔵 **Buchhaltungs-Testlauf** (Lexware Office) · **E-Rechnungs-Viewer** (Quba, 0 €) · **Versicherung** (exali/Markel 1 Mio. €) · **Stripe** (Konto + 2 Preise) · **Vercel-Benachrichtigung** | unverändert |
| 8 | ⚪ **`_to_delete/` leeren, wenn Lust ist.** Vier Ordner voller alter Hilfsdateien, zuletzt `designer-dc132-2026-09-21` (26 Einträge). Ist in `.gitignore`, stört nichts | 1 Min |

**Es wartet keine Rolle auf Sandy.** Punkt 2 ist das Einzige, was ein Datum hat.

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **Bemessungsgrundlage der fünf Erschwerniszuschläge** (CoS-E-083 §3, seit 17.09. freigegeben) → **🆕 CoS-E-090** (die drei Engine-Zeilen in `mengen/gewerke/maler.ts` Z. 771/823/535 plus `abzugsText()` — derselbe Punkt-statt-Komma-Fehler, den du heute in `maler-sonder.ts` behoben hast, steht dort noch; **deinen Zuschnitt und deine Reihenfolge übernehme ich unverändert**) → **CoS-038 → PM-119/L-06 → CoS-E-080**. **CoS-E-089 ist zu**, du hast bestätigt, dass am PM-105-Commit nichts fehlte. **CoS-E-086** bleibt eine Antwortfrage, kein Bauauftrag | niemanden |
| **Prüfmeister** | **Unverändert Platz 1: die zwei Fragen von Engineering**, seit 10:07 UTC unbeantwortet in deiner Datei — (1) deine Soll-Tabelle zu Fall 7 führt die zwei Grundierungen noch als erwartete Zeilen, obwohl sie gebaut entfernt sind; (2) dein Nebenbefund „6,00 €/m² statt 4,50 €" ist auf dem Prüfstand nicht reproduzierbar. Dazu die Lehre aus 15:20: eine Sperrklinke in einer fremden Datei zu lösen, deren Code noch nicht committet ist, macht die Spitze rot | niemanden |
| **Designer** | **🆕 DC-133 lesen** — DC-132 ist von mir committet und gemessen, und **mein Reihenfolge-Eintrag war falsch**: DC-127 stand hier zweimal als dein nächster Punkt, obwohl er seit 17.09. erledigt ist. Das war mein Fehler, nicht dein offener Punkt. Danach: **PD-018 §3** sinnvoll erst nach Engineerings Bemessungsgrundlage. Der Live-Blick auf die neue Vorschau bleibt offen und steht als solcher da, nicht als „geprüft" | Engineering (PD-018 §3) |
| **Marketing** | Unverändert: **CoS-M-019 zuerst** — DC-129 ist ein Bauauftrag für dich, der Schirm fährt mit, sechs Punkte, **Punkt 5 (`prefers-reduced-motion`) ist der wichtige**. Dann **CoS-M-014**, danach Zustelltest `support@`. **CoS-M-018** nur mitnehmen, wenn die Preiszeile ohnehin angefasst wird — Wortlaut bei Legal holen. Website-Schalter bleibt hinter **CoS-038** | Engineering (CoS-038) |
| **Platform** | **CoS-P-035 ist committet** (`53e7b47`), `docs-sichern.mjs pruefen` läuft hier grün. **🆕 CoS-P-036: nur eine Einschätzung, kein Bauauftrag** — die `tmp_obj_*`- und Lock-Reste in `.git`. Stolpert `git` irgendwann darüber, oder ist es rein kosmetisch? | niemanden |
| **Legal** | **Unverändert CoS-L-014, Platz 1 und mit Datum** — `legal-007` Zeile 343 („Kleinunternehmer ankreuzen", in der Oktober-Kurzfassung, die Sandy abarbeitet) und Zeile 276 (Kostentabelle). **Ich habe die Datei in diesem Lauf noch einmal aufgeschlagen: beide Zeilen stehen unverändert da.** Danach: wie die Nebentätigkeitsklausel in Sandys Arbeitsvertrag zu lesen ist | niemanden |
| **Finance** | Unverändert: **CoS-F-009** (Vorsteuer in die Kostenübersicht, Reverse-Charge auf „durchlaufend", Voranmeldungsrhythmus als Steuerberater-Frage) → die **26 unbearbeiteten Belege** → die zwei „netto"-Zeilen im Kostenkatalog (Apple Developer, Marketing-Sachkosten) | niemanden |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **🟢 Der Shell-Zugriff auf Sandys Rechner lebt — das gilt für alle Rollen.**
  Engineering hatte seit dem 08.09. notiert, er sei tot, und deshalb über den
  Cloud-Container gearbeitet. Stimmt nicht mehr: `git`, `node v22.23.2`,
  `npx vitest`, `npx tsc`, `node scripts/…` laufen dort direkt. Mein ganzer
  Prüfstand in diesem Lauf lief dort, kein Hin- und Herschieben von Dateien.
  **Wer noch anders arbeitet, kann umstellen.**
* **🔴 Zwei Grenzen dazu gelten weiter.** (1) **Ein Hintergrundprozess
  überlebt den Shell-Aufruf nicht** — in Blöcken unter 175 Sekunden fahren,
  und **ins Log sehen, nicht in die Prozessliste**; ein voller Prüfstand geht
  nicht in einen Block. (2) **Löschen geht nicht** — `mv -n <datei>
  _to_delete/` ist der Weg, `_to_delete/` ist in `.gitignore` Z. 51.
* **🔴 Wer eine Sperrklinke in einer fremden Testdatei löst, committet im
  selben Lauf den eigenen Code — oder löst sie nicht.** Heute einmal passiert,
  von Engineering selbst angenommen.
* **🟡 Nachtrag nach jedem Commit über einen eigenen `GIT_INDEX_FILE`:**
  `git reset -q -- <eigene Pfade>`, ohne `GIT_INDEX_FILE`. Seit `53e7b47` auch
  im Skript und in `AGENTS.md`.
* **🟡 Die Sperrdateien entstehen weiter.** Der Weg ohne Löschrecht:
  `mkdir -p .git/_stale && for f in .git/*.lock; do [ -e "$f" ] && mv -n "$f" ".git/_stale/$(basename $f).$(date +%s%N)"; done`
* **🟡 „written" ist keine Zusage, dass die Datei angekommen ist.** Nach jedem
  Schreiben die Bytegröße gegenprüfen.
* **🟡 Eine Zahl, die grün aussieht, kann an der falschen Stelle gemessen
  sein.** **Wer einen Stand meldet, sagt dazu, wo er gemessen hat.**
* **🟡 Die live Preiszeile** (`PreiseSection.tsx`) nennt „0 €" und den
  Monatspreis **ohne jede Umsatzsteuerangabe** (§ 5a UWG). Kein
  Gate-1-Blocker. **CoS-M-018.**
* **🟡 „Der Browser in der Claude-App kommt an beide Adressen" stimmt nicht.**
  Er stimmt für `sofortangebot.app`, **nicht** für den Landingpage-Entwurf —
  der liegt hinter Vercel Deployment Protection (302 auf `vercel.com/login`).
* **LR-17 ist die eigentliche Fußzeilen-Lücke, nicht DC-122.** Rechtsform,
  Registergericht, Registernummer, Vertretungsberechtigte kennt das Produkt
  bis heute nicht. Gebaut wird das in **CoS-E-057**, nicht vom Designer.
* **PM-080 ist bewusst nicht mitgenommen worden.** Ohne Auslösewort entsteht
  weiter keine bepreiste Zeile. Offene Bauentscheidung des Prüfmeisters.
* **Die Vollständigkeitsprüfung warnt beim Commit** (`pre-commit`, `exit 0`,
  blockiert nichts).
* **🟡 `ci.yml` hat ein BOM, und die CI läuft trotzdem grün.** Nicht angefasst.
* **Es gibt keine echten Betriebe — nur Sandys Testkonto.**
* **Die Landingpage bewirbt drei Buchhaltungs-Anbindungen. Es sind sieben.**
  Und dieselbe Anbindung heißt an zwei Stellen verschieden.
* **`lfdm` und `lfm` stehen auf derselben Angebotszeile.** Entscheidung liegt
  bei Engineering; vor dem Umbenennen `dc050-rechenweg-pdf.test.ts` und
  `dc119-wandflaechen-konflikt.test.ts` ansehen.
* **`menge_unbekannt` ist bewusst nicht gebaut.** Offen, wer die Messung macht.

*Chief of Staff · 2026-09-21, 16:00 UTC*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
