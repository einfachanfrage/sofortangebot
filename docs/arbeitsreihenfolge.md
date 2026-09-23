# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 23.09.2026, 07:55 UTC · Chief of Staff**
*(ersetzt die Fassung von 23.09., 07:35 UTC — diese Datei wird immer ersetzt, nie
ergänzt. Wer mir etwas mitteilen will, schreibt es in seine eigene Heimat-Datei;
was hier hineingeschrieben wird, ist beim nächsten Lauf weg.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**,
also 09:55 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟢 Die CI ist grün — und diesmal habe ich sie selbst gemessen.** Der
GitHub-Zugang vom Rechner aus funktioniert wieder: **Lauf 232, CI, auf
`4a3c33a`, `main`, `success`, 07:07 UTC**. Das ist die Spitze von
`origin/main`. Zum ersten Mal seit Wochen steht diese Zeile nicht auf Sandys
Messung, sondern auf meiner.

**🟢 Sandy hat gepusht, Vercel hat nachgezogen.** `origin/main = 4a3c33a`,
Deployment `dpl_6MjT9Rhv…` auf genau diesem Commit **READY**, production.

**🟡 Zwei neue Befunde vom Prüfmeister sind verteilt, zwei Dinge bleiben
offen:** zwei Commits liegen wieder ungepusht, und **CoS-L-014 ist den
dritten Tag unverändert**.

---

## Was seit 23.09., 07:35 UTC passiert ist

| Wer | Was | Wo |
|---|---|---|
| **Sandy** | **Gepusht** — `origin/main` steht jetzt auf `4a3c33a` | `origin/main` |
| **Prüfmeister** | **PM-145 und PM-146 gemessen, Soll gestellt, Fallbasis 146** · Testdatei `pruefmeister-batch-145-146.test.ts` committet (`eaf6bf1`, `e1531d7`) · **PD-026** für den Designer angelegt | `pruefmeister-restliste.md`, `pruefmeister-notizen-fuer-designer.md` |
| **Engineering** | **CoS-E-095 läuft** — `sockelleisten-ausschluss.ts` und eine neue Testdatei liegen uncommittet im Arbeitsbaum | Arbeitsbaum |
| **CoS** | **CoS-E-097 verteilt** (PM-145 + PM-146 bauen) · **CoS-038 eingeteilt** (A/B, Antwort auf Engineerings Frage von 07:05) · **PD-026 dem Designer zugewiesen** · CI selbst gemessen · diese Datei ersetzt | `chief-of-staff-engineering-todos.md`, `design-check.md` |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, 07:43–07:55 UTC:**

* **GitHub Actions, direkt über die API vom Rechner aus** (neu — ging seit
  Tagen nicht): Lauf **232 CI / `4a3c33a` / success**, Lauf 231 `221ac53`
  success, Lauf 230 `e6ac85e` success. Lauf **65 „Production database backup"
  auf `4a3c33a` läuft noch** (`in_progress`, 07:44 UTC) — das ist die
  Tagessicherung, kein Testlauf.
* **Vercel:** `dpl_6MjT9Rhv…`, Commit `4a3c33a`, **READY**, production.
* **`git rev-list origin/main..HEAD`:** **zwei Commits ungepusht** —
  `eaf6bf1`, `e1531d7`, beide vom Prüfmeister.
* **`legal-007` Zeile 276 und 343:** beide sagen **weiterhin**
  „Kleinunternehmer". Zeichen für Zeichen aufgeschlagen, nicht aus der letzten
  Fassung abgeschrieben. Zeile 113 und 123 sagen das Richtige — die Datei
  widerspricht sich weiterhin selbst.
* **Arbeitsbaum:** drei Dateien unter `src/`, alle aus Engineerings laufendem
  CoS-E-095.
* **Eine leere `.git/index.lock`** nach `.git/_stale/` verschoben, nicht
  gelöscht.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Für die zwei ungepushten Commits gibt es noch keinen CI-Lauf.**
* **Prüfmeisters Messungen zu PM-145/PM-146** (370,00 €, 465,90 €, 12
  Zusicherungen). Gelesen, nicht nachgefahren. **Hier steht keine Abnahme.**
* **Engineerings laufende CoS-E-095-Arbeit.** Nicht angefasst, nicht bewertet.
* **Marketings 7-%-Korrektur und Finances Eintrag dazu.** Beide melden den
  Punkt als zu; ich habe nicht nachgerechnet.
* **`npm run typecheck`, `npm run lint:ci`, voller Prüfstand.** Brechen auf
  diesem Mount an der Zeitgrenze ab. Unverändert.
* **Gate 1 rechne ich nicht neu.** Stand bleibt **54,2 %**.
* **Kein Blick ins laufende Produkt. Zwölfter Lauf in Folge.**
* **Versicherung, Stripe, Gewerbeanmeldung, Buchhaltungs-Testlauf,
  OneDrive-Sicherung** — nicht angefasst.

---

## 🟡 Was uncommittet im Arbeitsbaum liegt

| Datei | Wessen | Fertig? |
|---|---|---|
| `docs/arbeitsreihenfolge.md` | CoS | diese Datei, **fertig** |
| `docs/chief-of-staff-engineering-todos.md` | CoS | **fertig** |
| `docs/design-check.md` | CoS | **fertig** |
| `src/lib/sockelleisten-ausschluss.ts` | **Engineering** | 🔴 **läuft — nicht mitcommitten** |
| `src/lib/__tests__/pruefmeister-batch-139-143.test.ts` | **Engineering** | 🔴 **läuft — nicht mitcommitten** |
| `src/lib/__tests__/cos-e-095-sockelleisten-richtung.test.ts` | **Engineering** | 🔴 **läuft — nicht mitcommitten** |

**Sandys Block im Chat nimmt nur die drei `docs/`-Dateien** und schiebt danach
die **zwei fertigen Prüfmeister-Commits** mit nach oben. Engineerings Arbeit
bleibt liegen, bis es selbst meldet — AGENTS.md, „geteilter Arbeitsbaum",
Punkt 1 und 3.

---

## Reihenfolge — wer als Nächstes was macht

1. **Engineering:** **CoS-E-095 zu Ende bringen** (liegt in deinem
   Arbeitsbaum), dann **CoS-E-097** — PM-145 und PM-146 bauen, beides in
   `bauteil-ausschluss.ts`. Danach **CoS-038-A** (Preis + Texte, ein Lauf),
   dann **CoS-038-B** (Kontingent + 14-Tage-Test). **Deine Frage von 07:05 ist
   beantwortet**, die Einteilung steht in deiner Datei. Dahinter unverändert
   PM-119/L-06 → CoS-E-080 → CoS-E-086.
2. **Legal:** **CoS-L-014** — `legal-007`, Zeile 276 und 343 sagen weiter
   „Kleinunternehmer". Heute um 07:44 UTC erneut selbst nachgesehen,
   unverändert. **Dritter Tag.** Dazu **Marketings Frage zum
   Umsatzsteuer-Wortlaut** an der Preiszeile (CoS-M-018, seit 07:30 UTC in
   deiner Datei) — keine Eile, aber sie wartet.
3. **Designer:** **PD-026** — das leere Blatt sagt „Keine Positionen erkannt",
   obwohl die Maschine den Grund kennt. Zuweisung steht in `design-check.md`,
   der Fall in `pruefmeister-notizen-fuer-designer.md`. Daneben unverändert
   **PD-021**, das an CoS-038-A hängt.
4. **Prüfmeister:** ✅ zu für den 23.09. Deine Spur geht weiter mit
   Themenspeicher-Punkt 13, dann 23.
5. **Finance, Marketing, Platform:** keine offene Zuweisung von mir. Finance
   wartet auf **eine Zeile von Sandy** (Bahn oder Auto).

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Einmal pushen.** Zwei fertige Prüfmeister-Commits plus meine drei Dateien. Block steht im Chat | ein Block |
| 2 | 🚆 **Ein Wort an Finance: Bahn oder Auto** für die zehn Fahrten nach Dessau. Auto kostet rund **420 € mehr** und braucht ein Fahrtenbuch. „Weiß ich noch nicht" ist auch eine Antwort | ein Wort |
| 3 | 🔴 **Beim ELSTER-Fragebogen nicht der Kurzfassung in `legal-007` folgen.** Dort steht weiter „Kleinunternehmer ankreuzen" — **falsch**, und das Kreuz bindet fünf Jahre. Richtig ist **Verzicht auf die Kleinunternehmerregelung**. **Halte dich an Finances Behördenliste.** Legal zieht die zwei Zeilen nach (CoS-L-014) | nichts jetzt |
| 4 | 📧 **Zustelltest `support@`.** Von einer **privaten** Adresse eine Mail an `support@sofortangebot.app`, fünf Minuten später in `hallo@` nachsehen (auch Spam). Volle Anleitung in `entscheidungen-fuer-sandy.md` | 2 Min |
| 5 | 🔵 **Vor der Gewerbeanmeldung in den Arbeitsvertrag sehen** — Klausel zu Nebentätigkeiten. Muss **davor** passieren | 10 Min |
| 6 | 🔵 **Löschrecht für den Projektordner.** Nur in einer **normalen** Unterhaltung möglich, nicht in einem geplanten Lauf. **Nicht dringend** | ein Klick |
| 7 | 🔵 **Ab 26.09. bzw. KW 41:** Gewerbeanmeldung → Fragebogen → Geschäftskonto → Steuerberater. Alles in `finance-002-behoerdenliste-fuer-sandy.md` | nichts jetzt |


<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
