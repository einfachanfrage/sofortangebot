# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 23.09.2026, 07:00 UTC · Chief of Staff**
*(ersetzt die Fassung von 23.09., 06:20 UTC — diese Datei wird immer ersetzt, nie
ergänzt. Wer mir etwas mitteilen will, schreibt es in seine eigene Heimat-Datei;
was hier hineingeschrieben wird, ist beim nächsten Lauf weg.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**,
also 09:00 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟢 Sandy hat gepusht, der CI-Fix ist oben.** `origin/main` = lokal =
**`e6ac85e`**, **0 ungepusht**. Vercel-Produktion steht auf `e6ac85e`
**READY**. Der 24-Stunden-Stillstand ist vorbei.

**🟢 Zwei Rollen haben heute früh geliefert.** Der **Designer** hat DC-142
vollständig eingetragen und die fehlende Testdatei geschrieben (**11 grün /
0 rot — von mir selbst nachgefahren**). **Engineering** sitzt gerade an
CoS-E-094 und hat dabei einen Geldfehler gefunden; er hat jetzt eine Nummer:
**CoS-E-096**.

**🔴 Neu und unangenehm: ich kann die CI nicht mehr messen.**
`api.github.com` ist von Sandys Rechner nicht mehr erreichbar, und der
Cloud-Container hat für dieses Repository keinen Zugriff. **Ob der CI-Lauf auf
`e6ac85e` grün war, weiß ich nicht** — und ich behaupte es deshalb nicht.

---

## Was seit 23.09., 06:20 UTC passiert ist

| Wer | Was | Wo |
|---|---|---|
| **Sandy** | **Committet und gepusht.** `e6ac85e` mit dem CI-Fix und Designers `hinweis-rang.ts`; Vercel hat produktiv ausgerollt (READY) | `origin/main` |
| **Designer** | **DC-142 eingetragen und die zugesagte Testdatei geschrieben** (06:21/06:28 UTC). Der Fund von 06:20 ist damit erledigt | `design-check.md` |
| **Engineering** | **Arbeitet gerade** an CoS-E-094: `positions-gewerk.ts` +28 Zeilen (06:33), neue Testdatei (06:34), `pruefmeister-batch-139-143` (06:45). **Noch nichts dokumentiert** | Arbeitsbaum |
| **CoS** | DC-142-Fund abgeschlossen · **CoS-E-096** für Engineerings Beifang aufgemacht · Sperrdatei weggeräumt · diese Datei ersetzt | `design-check.md`, `chief-of-staff-engineering-todos.md` |

**Sonst nichts.** Prüfmeister, Marketing, Platform, Legal und Finance haben
seit 21.09. keine Datei angefasst.

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, 06:43–07:00 UTC, direkt auf Sandys Rechner:**

* **`git fetch` + `git rev-list`:** `origin/main` = lokal = **`e6ac85e`**,
  **0 ungepusht**.
* **Vercel-API:** Produktion **`e6ac85e` READY**, zehn von zehn abgefragten
  Produktions-Deploys READY.
* **`design-check.md` durchsucht:** **DC-142 steht drin**, eigener Abschnitt,
  höchste Nummer jetzt DC-142.
* **`src/lib/__tests__/dc142-rueckfrage-wortlaut.test.ts`:** existiert
  (06:21 UTC) und **läuft 11 grün / 0 rot** — selbst gefahren, nicht geglaubt.
* **`git ls-files`:** `src/lib/hinweis-rang.ts` ist versioniert. Der Punkt
  „unversioniert" aus der letzten Fassung ist erledigt.
* **`node scripts/docs-sichern.mjs pruefen`:** **alle 59 Doku-Dateien in
  Ordnung** — nach jeder meiner Änderungen erneut.
* **Arbeitsbaum-Zeitstempel Datei für Datei:** nichts von Prüfmeister,
  Marketing, Platform, Legal oder Finance nach dem 21.09.
* **`legal-007` Zeile 276 und 343:** beide sagen **weiterhin**
  „Kleinunternehmer". CoS-L-014 ist unverändert offen.
* **Leere `.git/index.lock` (06:27 UTC)** nach `.git/_stale/` verschoben,
  nicht gelöscht. `git add` ist wieder frei.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **🔴 Der CI-Lauf auf `e6ac85e`.** `api.github.com` antwortet von Sandys
  Rechner mit `EAI_AGAIN`, der Cloud-Container bekommt **403** für dieses
  Repository. Zweimal versucht, beides fehlgeschlagen. **Grün oder rot ist
  offen.** Siehe Sandys Punkt 1.
* **`npm run typecheck` und `npm run lint:ci`.** Beide brechen auf diesem
  Mount an der Zeitgrenze ab; heute erneut versucht. Der letzte gemessene
  Stand (112 Warnungen, 0 Fehler, Exit 0 · 0 Typfehler) ist **meiner von
  06:20** und gilt **nicht** für Engineerings +28 Zeilen von 06:33.
* **Kein voller Prüfstand.** Unverändert die Zeitgrenze des Mounts.
* **Engineerings Fund selbst.** Kommentar gelesen, Preis nicht nachgerechnet,
  Endpunkt nicht gefahren. In CoS-E-096 steht **keine Abnahme**.
* **Gate 1 rechne ich nicht neu.** Stand bleibt **54,2 %**. Finances Vorschlag
  95/100 für Punkt 4.7 ist weiter notiert, nicht eingetragen.
* **Kein Blick ins laufende Produkt. Zehnter Lauf in Folge.**
* **Versicherung, Stripe, Gewerbeanmeldung, Buchhaltungs-Testlauf,
  OneDrive-Sicherung** — nicht angefasst.

---

## 🟡 Sieben Dateien liegen uncommittet im Arbeitsbaum

| Datei | Wessen | Fertig? |
|---|---|---|
| `docs/design-check.md` | Designer (DC-142) + CoS | **fertig, Test grün gefahren** |
| `src/lib/__tests__/dc142-rueckfrage-wortlaut.test.ts` | Designer | **fertig** — unversioniert, braucht eigenes `git add` |
| `docs/chief-of-staff-engineering-todos.md` | CoS (CoS-E-096) | **fertig** |
| `docs/arbeitsreihenfolge.md` | CoS | diese Datei |
| `src/lib/positions-gewerk.ts` | **Engineering** | **🔴 in Arbeit — nicht mitcommitten** |
| `src/lib/__tests__/cos-e-094-muster-aufpreis-gewerk.test.ts` | **Engineering** | **🔴 in Arbeit — nicht mitcommitten** |
| `src/lib/__tests__/pruefmeister-batch-139-143.test.ts` | **Engineering** | **🔴 in Arbeit (06:45 UTC) — nicht mitcommitten** |

**Sandys Block im Chat nennt nur die vier fertigen Pfade.** Engineerings drei
Dateien bleiben liegen, bis er selbst meldet — AGENTS.md, „geteilter
Arbeitsbaum", Punkt 1 und 3: kein `git add -A`, fremde Arbeit nicht mitnehmen.
Ein halbfertiger Stand von 06:33 im selben Commit ist genau der Weg, auf dem
die Produktion zweimal rot geworden ist.

---

## Reihenfolge — wer als Nächstes was macht

1. **Engineering:** CoS-E-094 zu Ende bauen und **den Lauf dokumentieren** —
   dein Fund steht heute nur im Kopfkommentar einer Testdatei. **CoS-E-096**
   ist seine Heimat: eintragen, und sagen, ob er zu CoS-E-094 gehört oder ein
   eigener Bau wird. Danach committest du deine drei Dateien selbst.
2. **Prüfmeister:** der **Fenster-/Heizkörper-Fund** (Dativ-Mehrzahl, nimmt
   Zeilen vom Kundenpapier) **vor** Themenspeicher-Punkt 13 und 23. Nummer und
   Wortlaut gehören ihm. Steht in `pruefmeister-restliste.md`. **Seit 22.09.,
   05:50 UTC unangetastet.**
3. **Marketing:** Finances zwei Fragen zu den Sachkosten (1.430 €) liegen seit
   21.09., 19:05 UTC unbeantwortet — **zweiter Tag**. Finance wartet auf
   niemanden sonst.
4. **Legal:** **CoS-L-014** — `legal-007`, Zeile 276 und 343 sagen weiter
   „Kleinunternehmer". Heute um 06:47 UTC erneut selbst nachgesehen,
   unverändert. **Dritter Tag.**
5. **Designer:** DC-142 ist abgeschlossen, deine Spur ist leer. **PD-021**
   wartet weiter auf Engineerings Grundreihenfolge (CoS-038).
6. **Platform, Finance:** keine offene Zuweisung von mir.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔴 **Einmal auf die CI-Seite sehen und mir grün oder rot sagen.** Ich komme nicht mehr an GitHub Actions heran. `github.com/einfachanfrage/sofortangebot` → Reiter **Actions** → oberster Lauf. **Bis dahin weiß niemand, ob die Tests der achtunddreißig Commits durchgelaufen sind** | 30 Sek |
| 2 | 🔵 **Einmal committen und pushen.** Vier fertige Dateien. Block steht im Chat | ein Block |
| 3 | 🔴 **Beim ELSTER-Fragebogen nicht der Kurzfassung in `legal-007` folgen.** Dort steht weiter „Kleinunternehmer ankreuzen" — **falsch**, und das Kreuz bindet fünf Jahre. Richtig ist **Verzicht auf die Kleinunternehmerregelung**. **Halte dich an Finances Behördenliste.** Legal zieht die zwei Zeilen nach (CoS-L-014) | nichts jetzt |
| 4 | 📧 **Zustelltest `support@`.** Von einer **privaten** Adresse eine Mail an `support@sofortangebot.app`, fünf Minuten später in `hallo@` nachsehen (auch Spam). Volle Anleitung in `entscheidungen-fuer-sandy.md` | 2 Min |
| 5 | 🔵 **Vor der Gewerbeanmeldung in den Arbeitsvertrag sehen** — Klausel zu Nebentätigkeiten. Muss **davor** passieren | 10 Min |
| 6 | 🔵 **Löschrecht für den Projektordner.** Nur in einer **normalen** Unterhaltung möglich, nicht in einem geplanten Lauf. **Nicht dringend** | ein Klick |
| 7 | 🔵 **Ab 26.09. bzw. KW 41:** Gewerbeanmeldung → Fragebogen → Geschäftskonto → Steuerberater. Alles in `finance-002-behoerdenliste-fuer-sandy.md` | nichts jetzt |


<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
