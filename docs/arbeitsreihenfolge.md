# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 23.09.2026, 06:20 UTC · Chief of Staff**
*(ersetzt die Fassung von 22.09., 05:55 UTC — diese Datei wird immer ersetzt, nie
ergänzt. Wer mir etwas mitteilen will, schreibt es in seine eigene Heimat-Datei;
was hier hineingeschrieben wird, ist beim nächsten Lauf weg.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**,
also 08:20 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🔴 Die CI war seit 22.09. rot — und niemand hat es gemerkt.** Sandy hat am
22.09. gegen 05:50 UTC die achtunddreißig Commits gepusht. **CI Lauf 229 auf
`51b1ddb` ist um 05:58:23 UTC durchgefallen**, an Schritt 7 (**Lint**).
Schritt 8–11 (TypeScript, Umgebung, **Tests**, Build) wurden übersprungen:
**für diese achtunddreißig Commits hat die CI nie einen Test gefahren.**

**🟢 Die Ursache ist gefunden und behoben** — Warnbudget `lint:ci` um genau
eine Warnung gesprengt (121 > 120), neun davon aus Finances neuem
`scripts/e-rechnung-ansehen.mjs`. Nach dem Fix: **112 Warnungen, 0 Fehler,
Exit 0**. Details: `chief-of-staff-finance-todos.md`, CoS-F-011.

**🟡 Seit 22.09., 06:20 UTC hat niemand mehr eine Datei angefasst** — 24
Stunden Stillstand über alle acht Rollen. Vercel-Produktion steht auf
`51b1ddb` **READY**, `origin/main` = lokal, **0 ungepusht**.

---

## Was seit 22.09., 05:55 UTC passiert ist

| Wer | Was | Wo |
|---|---|---|
| **Sandy** | **Gepusht.** Die achtunddreißig Commits sind oben, Vercel hat `51b1ddb` produktiv ausgerollt (READY) | `origin/main` |
| **Designer** | **DC-142 gebaut, aber nicht eingetragen und nicht committet** — Wortlaut der Rückfrage + neue Rangfolge im Bernsteinbanner, drei Dateien im Arbeitsbaum, eine davon unversioniert | Arbeitsbaum |
| **CoS** | CI-Rot gemessen, Ursache gefunden, behoben, geprüft · CoS-F-011 und den DC-142-Fund verteilt · diese Datei ersetzt | CoS-F-011, `design-check.md` |

**Sonst nichts.** Prüfmeister, Engineering, Marketing, Platform, Legal und
Finance haben seit 22.09., 05:55 UTC keine Datei angefasst.

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, 05:45–06:20 UTC, direkt auf Sandys Rechner:**

* **GitHub-Actions-API:** **Lauf 229, `51b1ddb`, 22.09. 05:58:23 UTC,
  completed / failure**, Job `quality`, Schritt **7 Lint** rot, Schritte 8–11
  `skipped`. Danach kein weiterer CI-Lauf. Der Datenbank-Sicherungslauf vom
  22.09., 07:41 UTC ist **success**.
* **Vercel-API:** Produktion **`51b1ddb` READY**, acht von acht abgefragten
  Produktions-Deploys READY.
* **`git fetch` + `git rev-list`:** `origin/main` = lokal = `51b1ddb`,
  **0 ungepusht**.
* **`npm run lint:ci` vor dem Fix:** 121 Warnungen, 0 Fehler, Exit 1.
  Warnungen Datei für Datei gezählt, Verursacher zugeordnet (`b0bf9ab`, im
  letzten grünen Lauf `b973c26` noch nicht im Baum).
* **`npm run lint:ci` nach dem Fix:** **112 Warnungen, 0 Fehler, Exit 0.**
* **`npm run typecheck`:** **0 Fehler.**
* **Drei berührte Testdateien** (`dc135-bauteil-ausschluss-sichtbar`,
  `dc138-tausenderpunkt`, `pruefmeister-batch-134-137`): **45 grün / 0 rot.**
* **`node scripts/docs-sichern.mjs pruefen`:** alle 59 Doku-Dateien in Ordnung.
* **Arbeitsbaum-Zeitstempel Datei für Datei:** nichts nach 22.09., 06:20 UTC.
* **`design-check.md` durchsucht:** **DC-142 kommt dort nicht vor**, höchste
  Nummer ist DC-141. **Verzeichnis `src/lib/__tests__/` durchsucht:** die im
  Code zugesagte Datei `dc142-rueckfrage-wortlaut.test.ts` **existiert nicht.**

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Kein voller Prüfstand.** Der Durchlauf bricht auf diesem Mount an der
  Zeitgrenze ab; ich habe es zweimal versucht. Die letzte Vollmessung ist
  Platforms und gilt für **`b973c26`** — **nicht** für die achtunddreißig
  Commits darüber. **Die CI holt das nach, sobald der nächste Push oben ist**
  — jetzt zum ersten Mal, weil Lint sie nicht mehr abwürgt.
* **Gate 1 rechne ich nicht neu.** Stand bleibt **54,2 %**. Finances Vorschlag
  95/100 für Punkt 4.7 ist weiter notiert, nicht eingetragen.
* **Kein Blick ins laufende Produkt. Neunter Lauf in Folge.**
* **Versicherung, Stripe, Gewerbeanmeldung, Buchhaltungs-Testlauf,
  OneDrive-Sicherung** — nicht angefasst.

---

## 🟡 Elf Dateien liegen uncommittet im Arbeitsbaum

| Datei | Wessen | Fertig? |
|---|---|---|
| `scripts/e-rechnung-ansehen.mjs` | CoS (CI-Fix) | **fertig, geprüft** |
| `src/lib/hinweis-rang.ts` | Designer | **unversioniert** — DC-142 |
| `src/lib/bauteil-ausschluss.ts` | Designer | DC-142 |
| `src/app/(app)/angebot/[id]/entwurf/page.tsx` | Designer | DC-142 |
| `src/lib/__tests__/dc135-bauteil-ausschluss-sichtbar.test.ts` | Designer | **DC-141 fertig** |
| `src/lib/__tests__/dc138-tausenderpunkt.test.ts` | Designer | **DC-139 fertig** |
| `docs/design-check.md` | CoS | fertig |
| `docs/chief-of-staff-finance-todos.md` | CoS | fertig |
| `docs/chief-of-staff-marketing-todos.md` | CoS | fertig |
| `docs/pruefmeister-restliste.md` | CoS | fertig |
| `docs/arbeitsreihenfolge.md` | CoS | diese Datei |

**`src/lib/hinweis-rang.ts` ist unversioniert** — Sandys Pre-Push-Haken
blockiert den Push bei unversionierten Dateien außerhalb von `docs/`. Der
Block im Chat nimmt sie mit (`git add -A`).

---

## Reihenfolge — wer als Nächstes was macht

1. **Designer:** DC-142 in `design-check.md` eintragen · zugesagte Testdatei
   schreiben oder den Verweis im Kommentar geradeziehen. Danach DC-141/DC-139
   abschließen.
2. **Prüfmeister:** der **Fenster-/Heizkörper-Fund** (Dativ-Mehrzahl, nimmt
   Zeilen vom Kundenpapier) **vor** Themenspeicher-Punkt 13 und 23. Nummer und
   Wortlaut gehören ihm. Steht in `pruefmeister-restliste.md`.
3. **Marketing:** Finances zwei Fragen zu den Sachkosten (1.430 €) liegen seit
   21.09., 19:05 UTC unbeantwortet. Finance wartet auf niemanden sonst.
4. **Legal:** **CoS-L-014** — `legal-007`, Zeile 343 und 276 sagen weiter
   „Kleinunternehmer". Gemessen am 22.09., unverändert.
5. **Engineering:** keine offene Zuweisung von mir.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Einmal committen und pushen.** Elf Dateien, darunter der CI-Fix. Danach fährt die CI zum ersten Mal die Tests der achtunddreißig Commits. Block steht im Chat | ein Block |
| 2 | 🔴 **Beim ELSTER-Fragebogen nicht der Kurzfassung in `legal-007` folgen.** Dort steht weiter „Kleinunternehmer ankreuzen" — **falsch**, und das Kreuz bindet fünf Jahre. Richtig ist **Verzicht auf die Kleinunternehmerregelung**. **Halte dich an Finances Behördenliste.** Legal zieht die zwei Zeilen nach (CoS-L-014) | nichts jetzt |
| 3 | 📧 **Zustelltest `support@`.** Von einer **privaten** Adresse eine Mail an `support@sofortangebot.app`, fünf Minuten später in `hallo@` nachsehen (auch Spam). Volle Anleitung in `entscheidungen-fuer-sandy.md` | 2 Min |
| 4 | 🔵 **Vor der Gewerbeanmeldung in den Arbeitsvertrag sehen** — Klausel zu Nebentätigkeiten. Muss **davor** passieren | 10 Min |
| 5 | 🔵 **Löschrecht für den Projektordner.** Nur in einer **normalen** Unterhaltung möglich, nicht in einem geplanten Lauf. **Nicht dringend** | ein Klick |
| 6 | 🔵 **Ab 26.09. bzw. KW 41:** Gewerbeanmeldung → Fragebogen → Geschäftskonto → Steuerberater. Alles in `finance-002-behoerdenliste-fuer-sandy.md` | nichts jetzt |


<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
