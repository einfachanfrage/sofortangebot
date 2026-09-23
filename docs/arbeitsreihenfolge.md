# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 23.09.2026, 07:35 UTC · Chief of Staff**
*(ersetzt die Fassung von 23.09., 07:00 UTC — diese Datei wird immer ersetzt, nie
ergänzt. Wer mir etwas mitteilen will, schreibt es in seine eigene Heimat-Datei;
was hier hineingeschrieben wird, ist beim nächsten Lauf weg.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**,
also 09:35 Uhr Ortszeit.*

⚠️ **Diese Fassung ist eine Momentaufnahme mitten im Lauf.** Vier Rollen haben
in den letzten vierzig Minuten geliefert, Finance schreibt in diesem Moment.
Was hier steht, ist um 07:35 UTC gemessen — nicht früher, nicht später.

---

## Lage in drei Zeilen

**🟢 Die CI ist grün.** Sandy hat nachgesehen: **Lauf 231 auf `221ac53`,
`main`, erfolgreich, 1 min 56 s.** Damit ist die Blindstelle aus der letzten
Fassung zu — und zum ersten Mal seit dem 22.09. sind die Tests wirklich
durchgelaufen.

**🟢 Drei meiner vier offenen Zuweisungen sind zu, alle heute früh.**
Engineering hat CoS-E-094 beantwortet (**Sperr-Fall, beide Zeilen — kein
Bau**) und **CoS-E-096 gebaut**. Marketing hat Finances zwei Sachkosten-Fragen
beantwortet (**brutto**, **Bahn**) und dabei einen Steuersatz korrigiert.

**🟡 Offen bleiben zwei Dinge: `origin` hinkt drei Commits hinterher, und
CoS-L-014 ist unverändert.** Legal hat seine Datei heute angefasst — die zwei
falschen Zeilen in `legal-007` stehen trotzdem noch da.

---

## Was seit 23.09., 07:00 UTC passiert ist

| Wer | Was | Wo |
|---|---|---|
| **Sandy** | **Committet (`221ac53`) und CI nachgesehen: Lauf 231 grün** | `origin/main` |
| **Engineering** | **CoS-E-094 beantwortet** (PM-140 ist ein Sperr-Fall, beide Zeilen, endet ohne Bau) · **CoS-E-096 gebaut** (`0dad8fc`) · PM-139-2 nachgezogen | `chief-of-staff-engineering-todos.md`, `pruefmeister-restliste.md` |
| **Marketing** | **Finances zwei Fragen beantwortet** — brutto, Bahn · **Finances 19 % auf 7 % korrigiert** (§ 12 Abs. 2 Nr. 10 UStG) · Rundung präzisiert · neue Frage an Legal zum Umsatzsteuer-Wortlaut (CoS-M-018) | `chief-of-staff-finance-todos.md`, `chief-of-staff-legal-todos.md` |
| **Legal** | Datei um 06:54 UTC angefasst — **`legal-007` Zeile 276 und 343 aber unverändert** | `chief-of-staff-legal-todos.md` |
| **Finance** | **Schreibt gerade** an `kostenuebersicht-finance.xlsx` (06:59 UTC) | Arbeitsbaum |
| **CoS** | Lage gemessen, diese Datei ersetzt | — |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, 06:51–07:35 UTC, direkt auf Sandys Rechner:**

* **`git log` + `git rev-list`:** HEAD = `3e2cded`, **drei Commits ungepusht**
  (`071a476`, `176fff3`, `3e2cded`).
* **`git show --stat 221ac53`:** genau meine vier Dateien, **507 Zeilen dazu,
  75 weg** (die 75 sind die ersetzte Vorfassung dieser Datei). Engineerings
  laufende Arbeit ist **nicht** mitgegangen — so war es gewollt.
* **`legal-007` Zeile 276 und 343:** beide sagen **weiterhin**
  „Kleinunternehmer". Zeichen für Zeichen nachgesehen, nicht aus der letzten
  Fassung abgeschrieben.
* **`node scripts/docs-sichern.mjs pruefen`:** **alle 59 Doku-Dateien in
  Ordnung.**
* **Zwei leere `.git`-Sperrdateien** nach `.git/_stale/` verschoben, nicht
  gelöscht.
* **Arbeitsbaum-Zeitstempel Datei für Datei**, daraus die Tabelle oben.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Der CI-Lauf ist Sandys Messung, nicht meine.** Ich komme unverändert nicht
  an GitHub Actions heran (`EAI_AGAIN` von hier, **403** aus dem Container).
  Für die drei ungepushten Commits gibt es **noch keinen CI-Lauf**.
* **Engineerings Bau und Marketings Rechnung.** Beide Einträge gelesen, keiner
  nachgerechnet, kein Testlauf gefahren. **Hier steht keine Abnahme.**
* **Marketings 7-%-Korrektur an Finance.** Fachlich plausibel, von mir **nicht**
  geprüft — Finance muss ihr zustimmen oder widersprechen.
* **`npm run typecheck`, `npm run lint:ci`, voller Prüfstand.** Brechen auf
  diesem Mount an der Zeitgrenze ab. Unverändert.
* **Gate 1 rechne ich nicht neu.** Stand bleibt **54,2 %**.
* **Kein Blick ins laufende Produkt. Elfter Lauf in Folge.**
* **Versicherung, Stripe, Gewerbeanmeldung, Buchhaltungs-Testlauf,
  OneDrive-Sicherung** — nicht angefasst.

---

## 🟡 Was uncommittet im Arbeitsbaum liegt

| Datei | Wessen | Fertig? |
|---|---|---|
| `docs/arbeitsreihenfolge.md` | CoS | diese Datei, **fertig** |
| `docs/kostenuebersicht-finance.xlsx` | **Finance** | **🔴 wird gerade geschrieben — nicht mitcommitten** |

**Sandys Block im Chat nennt nur diese eine Datei** und schiebt danach die
**drei fertigen Commits** nach oben. Finances Tabelle bleibt liegen, bis sie
selbst meldet — AGENTS.md, „geteilter Arbeitsbaum", Punkt 1 und 3.

---

## Reihenfolge — wer als Nächstes was macht

1. **Legal:** **CoS-L-014** — `legal-007`, Zeile 276 und 343 sagen weiter
   „Kleinunternehmer". Heute um 07:33 UTC erneut selbst nachgesehen,
   unverändert. **Dritter Tag, und du warst heute in deiner Datei.** Dazu
   **neu** Marketings Frage zum Umsatzsteuer-Wortlaut an der Preiszeile
   (CoS-M-018, 07:30 UTC).
2. **Finance:** Marketings Antwort liegt bei dir — **brutto, Bahn, 7 % statt
   19 %**. Zustimmen oder widersprechen, dann ist der Punkt zu.
3. **Prüfmeister: ✅ zu, 23.09.** Der **Fenster-/Heizkörper-Fund** hat Nummer,
   Wortlaut und Soll: **PM-145** (Dativ-Mehrzahl — gemessen **370,00 € von
   835,90 €**, stumm; Ursache zwei fehlende Buchstaben in `SATZ_WORT`, keine
   zweite Stelle im `src/lib`). Dazu der zweite Punkt aus derselben Notiz:
   **PM-146** — die Zahlangabe vor „weiß" **fällt** als Bedingung (ohne sie
   wird aus 465,90 € ein leeres Blatt). Hinterlegt als
   `pruefmeister-batch-145-146.test.ts`, **12 Zusicherungen, 8 grün /
   4 Sperrklinken / 0 rot**; `tsc` 0, `eslint` 0. **Fallbasis 146.** Befunde in
   `pruefmeister-restliste.md`, ein Fund für den Designer als **PD-026**.
   **Gebaut ist nichts — beides gehört in `bauteil-ausschluss.ts`, also
   Engineering.** Meine Spur geht danach weiter mit Themenspeicher-Punkt 13,
   dann 23.
4. **Engineering:** CoS-E-094 und CoS-E-096 sind zu. Weiter nach deiner
   eigenen Reihenfolge: **CoS-038 → CoS-E-095 → PM-119/L-06 → CoS-E-080**.
5. **Designer, Marketing, Platform:** keine offene Zuweisung von mir.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Einmal pushen.** Drei fertige Commits von Marketing und Engineering liegen lokal fest, dazu diese Datei. Block steht im Chat | ein Block |
| 2 | 🔴 **Beim ELSTER-Fragebogen nicht der Kurzfassung in `legal-007` folgen.** Dort steht weiter „Kleinunternehmer ankreuzen" — **falsch**, und das Kreuz bindet fünf Jahre. Richtig ist **Verzicht auf die Kleinunternehmerregelung**. **Halte dich an Finances Behördenliste.** Legal zieht die zwei Zeilen nach (CoS-L-014) | nichts jetzt |
| 3 | 📧 **Zustelltest `support@`.** Von einer **privaten** Adresse eine Mail an `support@sofortangebot.app`, fünf Minuten später in `hallo@` nachsehen (auch Spam). Volle Anleitung in `entscheidungen-fuer-sandy.md` | 2 Min |
| 4 | 🔵 **Vor der Gewerbeanmeldung in den Arbeitsvertrag sehen** — Klausel zu Nebentätigkeiten. Muss **davor** passieren | 10 Min |
| 5 | 🔵 **Löschrecht für den Projektordner.** Nur in einer **normalen** Unterhaltung möglich, nicht in einem geplanten Lauf. **Nicht dringend** | ein Klick |
| 6 | 🔵 **Ab 26.09. bzw. KW 41:** Gewerbeanmeldung → Fragebogen → Geschäftskonto → Steuerberater. Alles in `finance-002-behoerdenliste-fuer-sandy.md` | nichts jetzt |


<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
