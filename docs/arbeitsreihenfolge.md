# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 23.09.2026, 08:55 UTC · Chief of Staff**
*(ersetzt die Fassung von 23.09., 08:20 UTC — diese Datei wird immer ersetzt, nie
ergänzt. Wer mir etwas mitteilen will, schreibt es in seine eigene Heimat-Datei;
was hier hineingeschrieben wird, ist beim nächsten Lauf weg.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**,
also 10:55 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟢 Die Spitze ist grün, gepusht und deployt — alles drei selbst gemessen.**
`origin/main = lokal = b65c1d2`, **0 ungepusht**. CI-**Lauf 234** auf `b65c1d2`:
**success**, 08:27 UTC. Vercel `dpl_HB9wPTbH…` auf `b65c1d2`: **READY**,
production.

**🟡 Ein CI-Lauf dazwischen war rot — und es war ein Aussetzer.** Lauf **233**
auf `4d7e172` (CoS-E-095) ist am Schritt **„Produktions-Build"** gescheitert.
Vercel hat **denselben** Commit erfolgreich gebaut, und der Folgelauf auf
demselben Code ist grün. Als **CoS-E-098** bei Engineering notiert, **ohne**
Bauauftrag — aber mit der Ansage: ein zweites Mal rot ist echt.

**🟢 PD-026 wurde innerhalb einer Stunde beantwortet.** Der Designer hat
**DC-143** gebaut: null Positionen nach einer Bremse ist jetzt ein eigener
Zustand mit Begründung, kein „Keine Positionen erkannt" mehr. Doku committet,
**Code lag uncommittet** — ich habe ihn in diesem Lauf mit committet.

---

## Was seit 23.09., 08:20 UTC passiert ist

| Wer | Was | Wo |
|---|---|---|
| **Sandy** | **Gepusht** — `origin/main` steht jetzt auf `b65c1d2`, 0 ungepusht | `origin/main` |
| **Designer** | **DC-143 fertig** (Antwort auf PD-026): eigener Zustand für „Bremse hat alles weggenommen", Grund fährt mit, Blatt nicht versendbar. Vier Dateien unter `src/`, davon eine neue Testdatei | `design-check.md`, Arbeitsbaum |
| **Engineering** | **CoS-E-097 läuft** — `bauteil-ausschluss.ts` und `pruefmeister-batch-145-146.test.ts` liegen uncommittet im Arbeitsbaum, letzte Änderung 08:31 UTC. Kein Bericht, läuft noch | Arbeitsbaum |
| **CoS** | CI-Läufe 233/234 selbst gemessen · **CoS-E-098** aufgemacht (roter Produktions-Build + geteilter Arbeitsbaum) · **PD-026-Antwort dem Prüfmeister zugewiesen** · Designers DC-143-Code und alle offenen `docs/` **selbst committet** · `.git/index.lock` nach `.git/_stale/` verschoben · diese Datei ersetzt | `chief-of-staff-engineering-todos.md`, `pruefmeister-notizen-fuer-designer.md` |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, 08:43–08:55 UTC:**

* **GitHub Actions über die API:** Lauf **234 CI / `b65c1d2` / success** (08:27),
  Lauf **233 CI / `4d7e172` / failure**, Job `quality`, **Schritt 11
  „Produktions-Build"** (08:01), Lauf 232 `4a3c33a` success, Lauf **65
  „Production database backup" / `4a3c33a` / success** (07:44, gestern noch
  laufend).
* **Vercel:** `dpl_HB9wPTbH…` / `b65c1d2` / **READY** / production. Und
  `dpl_9xt3HpWG…` / **`4d7e172`** / **READY** — derselbe Commit, den CI 233
  nicht bauen konnte.
* **`git rev-list origin/main..HEAD`: leer.** Nichts ungepusht (vor meinem
  Commit).
* **`docs/entscheidungen-fuer-sandy.md`, Überschriften ab Zeile 3050 einzeln
  aufgeschlagen:** der `support@`-Zustelltest (3161), das Löschrecht (3081) und
  die Nebentätigkeits-Klausel stehen **weiterhin offen**. Der ✅-Zustelltest von
  Zeile 2436 ist ein **anderer** (IONOS/`hallo@`, 17.09.) — nicht verwechseln.
* **`docs/design-check.md`:** DC-143 steht drin und ist in `b65c1d2` **schon
  committet**; der zugehörige Code war es **nicht**.
* **Arbeitsbaum, Datei für Datei mit Änderungszeit:** vier Dateien vom
  Designer (08:25), zwei von Engineering (08:28 / 08:31).

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Das Log von CI-Lauf 233.** Ich habe Job- und Schritt-Ergebnis über die API
  gelesen, nicht die Ausgabe des Build-Schritts.
* **Designers 9 + 4 Zusicherungen zu DC-143.** Gelesen, nicht nachgefahren.
  **Hier steht keine Abnahme.** Über die Richtigkeit entscheidet CI-Lauf 235
  nach Sandys Push.
* **Engineerings laufende CoS-E-097-Arbeit.** Nicht angefasst, nicht bewertet.
* **Prüfmeisters Messungen zu PM-145/PM-146** (370,00 €, 465,90 €). Unverändert
  nicht nachgerechnet.
* **`npm run typecheck`, `npm run lint:ci`, voller Prüfstand.** Brechen auf
  diesem Mount an der Zeitgrenze ab. Unverändert.
* **Gate 1 rechne ich nicht neu.** Stand bleibt **54,2 %**.
* **Kein Blick ins laufende Produkt. Dreizehnter Lauf in Folge.**
* **Versicherung, Stripe, Gewerbeanmeldung, Buchhaltungs-Testlauf,
  OneDrive-Sicherung** — nicht angefasst.

---

## 🟡 Was uncommittet im Arbeitsbaum liegt

| Datei | Wessen | Fertig? |
|---|---|---|
| `src/lib/bauteil-ausschluss.ts` | **Engineering** | 🔴 **läuft — nicht mitcommitten** |
| `src/lib/__tests__/pruefmeister-batch-145-146.test.ts` | **Engineering** | 🔴 **läuft — nicht mitcommitten** |

Alles andere ist in diesem Lauf von mir committet: die vier `docs/`-Dateien
vom 08:20-Lauf, meine zwei neuen `docs/`-Dateien und Designers vier
DC-143-Dateien unter `src/` (inkl. `git add` der neuen Testdatei, damit der
Pre-Push-Haken nicht zu Recht blockiert).

**Sandy muss nur noch pushen** — ein Befehl, Block steht im Chat.

---

## Reihenfolge — wer als Nächstes was macht

1. **Engineering:** **CoS-E-097 zu Ende bringen** (PM-145 + PM-146, liegt in
   deinem Arbeitsbaum). Dann **CoS-038-A** (Preis + Texte, ein Lauf), dann
   **CoS-038-B** (Kontingent + 14-Tage-Test). Dahinter unverändert PM-119/L-06
   → CoS-E-080 → CoS-E-086. **CoS-E-098 ist kein Bauauftrag**, nur ein
   Beobachtungspunkt zum Produktions-Build. Wenn du committest: nur deine
   beiden Dateien, `git add` mit Pfad, kein `git add -A`.
2. **Designer:** **DC-143 ist zu**, der Code ist committet und geht mit Sandys
   Push in die CI. Unverändert offen: **PD-021** („nach Arbeitsablauf" sortiert
   nicht nach Arbeitsablauf), hängt an CoS-038-A.
3. **Prüfmeister:** **PD-026 ist beantwortet** — Antwort steht als **DC-143** in
   `docs/design-check.md`, Zuweisung in deiner Datei. Danach geht deine Spur
   weiter mit Themenspeicher-Punkt 13, dann 23.
4. **Legal:** keine offene Zuweisung von mir.
5. **Finance:** unverändert — Sandys Antwort (Deutschlandticket, keine
   zusätzlichen Fahrtkosten) liegt bei dir. `Plan-Kosten!AL47`/`AM47` stehen
   noch auf den widerlegten 440 €. Ob 0 € oder ein Teilbetrag, ist **deine**
   Entscheidung, ggf. eine für den Steuerberater ab KW 41. Dazu die Frage, ob
   eine Übernachtungszeile fehlt.
6. **Marketing:** unverändert — `gtm-kanalplan.xlsx`, Blatt „Annahmen", Feld
   `F4` (440 € Fahrten) ist überholt. **Mit Finance abstimmen, wer die Zelle
   zieht** — nicht beide.
7. **Platform:** keine offene Zuweisung von mir.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Einmal pushen.** Alles ist schon committet, du brauchst nur den Push. Block steht im Chat | ein Befehl |
| 2 | 📧 **Zustelltest `support@`.** Von einer **privaten** Adresse eine Mail an `support@sofortangebot.app`, fünf Minuten später in `hallo@` nachsehen (auch Spam). Volle Anleitung in `entscheidungen-fuer-sandy.md` ab Zeile 3161 | 2 Min |
| 3 | 🔵 **Vor der Gewerbeanmeldung in den Arbeitsvertrag sehen** — Klausel zu Nebentätigkeiten. Muss **davor** passieren | 10 Min |
| 4 | 🔵 **Löschrecht für den Projektordner.** Nur in einer **normalen** Unterhaltung möglich, nicht in einem geplanten Lauf. **Nicht dringend** | ein Klick |
| 5 | 🔵 **Ab 26.09. bzw. KW 41:** Gewerbeanmeldung → Fragebogen → Geschäftskonto → Steuerberater. Alles in `finance-002-behoerdenliste-fuer-sandy.md` | nichts jetzt |


<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
