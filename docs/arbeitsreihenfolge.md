# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 17.09.2026, 07:00 UTC · Chief of Staff**
*(ersetzt die Fassung von 06:20 UTC — diese Datei wird immer ersetzt, nie ergänzt.)*
*Alle Uhrzeiten in dieser Fassung sind **UTC**.*

---

## Lage in drei Zeilen

**Alles gepusht, alles grün.** **CI-Lauf #205 grün auf `116dee5`**,
Produktion läuft auf demselben Stand (Vercel READY, 06:25). `git log
origin/main..main` war vor meinem Commit leer.

**Neu seit 06:20:** Engineering hat **CoS-E-073 gebaut** — die allgemeine
`vage`-Regel steht jetzt an zwei Stellen, Prompt **und** Nachziehung im
Normalisierer. Die Arbeit lag unversandt auf der Platte; ich habe sie
nachgemessen und committe sie in diesem Lauf.

**Zwei Fragen weniger im Team, zwei neue bei Sandy.** Engineering hat
Marketings Ein-Wort-Frage beantwortet, der Designer hat DC-115/DC-116
entschieden. Dafür liegen jetzt **F-007** (Sicherung der Belege) und der
zurückgegebene IONOS-Punkt bei ihr.

---

## Was seit 06:20 UTC passiert ist

| Rolle | Ergebnis | Status |
|---|---|---|
| Engineering | **CoS-E-073 gebaut** — allgemeine `vage`-Regel im Extraktions-Prompt + `vageNachziehen()` im Normalisierer, 15 neue Zusicherungen | ✅ gebaut, war unversandt |
| Engineering | **Architekturfrage beantwortet** — nur `raum_ohne_masse` wird deterministisch nachgezogen; `menge_unbekannt` eigener Fall, `plural_ohne_zahl` und `referenz_ohne_kontext` bleiben Prompt-Sache | ✅ entschieden |
| Engineering | **Marketings Ein-Wort-Frage beantwortet: „Lexware Office"** (`lexoffice` ist der Altzugang) | ✅ erledigt |
| Designer | **DC-115 und DC-116 entschieden und spezifiziert** — Zeit-Ausschluss vs. Umfang-Ausschluss, Tabelle „Wer baut was" | ✅ erledigt |
| Marketing | **Finance-Korrektur 5 selbst geschlossen** — sieben echte Direktanbindungen gemessen statt drei, Textfassung A/B · M-6 Zählzeile textlich fertig · Label-Ungleichheit beim Lexoffice-Altzugang als TN-108-Nachbefund gemeldet | ✅ erledigt |
| Platform | **BOM in `ci.yml` entschieden: bleibt** — damit ist auch der zweite offene Platform-Punkt zu | ✅ entschieden |
| Platform | Zwei Finance-Punkte **zurückgegeben** (IONOS-Weiterleitung, Zustelltest) — kein technisches Hindernis, fehlender Zugang | ⚠️ zurück an CoS/Sandy |
| Finance | **F-007 gestellt** — gibt es eine laufende Sicherung des Projektordners? Dazu: Belegablage + Verfahrensdokumentation gebaut, 0 € | 🟡 wartet auf Sandy |
| CoS | **CoS-E-074 angelegt** — die drei DC-116-Teile, die beim Designer auf Engineering zeigen | ✅ erledigt |
| CoS | PM-097-B-Bitte des Designers in `pruefmeister-restliste.md` weitergereicht | ✅ erledigt |
| CoS | IONOS-Punkt als Entscheidung in `entscheidungen-fuer-sandy.md` | ✅ erledigt |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **CI-Lauf-Liste über die GitHub-API (`branch=main`):** **#205 grün**
  (`116dee5`, 06:25), #204 grün (`fdbedd2`), #203 grün (`bc877aa`),
  #202 grün (`a2c8629`), **#201 rot** (`4c3fac8`).
* **Vercel-Deploy-Liste:** Produktion **READY** auf `116dee5`, erstellt 06:25.
* **`git log origin/main..main`** nach `git fetch`: **leer**.
* **Engineerings Arbeit selbst nachgemessen**, bevor ich sie committe:
  `npx tsc --noEmit` **fehlerfrei** · `src/lib/mengen/__tests__` (22 Dateien)
  **250 grün** · die drei weiteren Dateien, die `normalisiereExtraktion`
  einlesen, **41 grün** · fünf Prüfmeister-Batches inkl.
  `pd019-leeres-ergebnis` und `golden-korrekturen` **71 grün, 26 erwartet rot,
  0 unerwartet rot**.
* **`entscheidungen-fuer-sandy.md` und `chief-of-staff-platform-todos.md`
  frisch gelesen**, bevor ich unten „offen" schreibe — CoS-P-013 steht dort
  ausdrücklich als *nicht* eingetragen.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Warum #201 rot war.** Unverändert offen, der Detail-Endpunkt bleibt `403`.
  Platform hat heute belegt, dass das **nicht** im Repo lösbar ist — es
  braucht ein Token aus Sandys GitHub-Konto. **Ich erfinde keine Ursache.**
* **Engineerings vollständigen Lauf** (166 Dateien / 2548 grün / 97
  Sperrklinken) habe ich **nicht wiederholt** — ich übernehme ihn aus ihrem
  Eintrag und sage das dort auch so.
* **Die Code-Fundstellen des Designers** zu `raum-ausschluss.ts` habe ich
  nicht nachgelesen. Heimat bleibt `design-check.md`.
* **Gate 1 rechne ich nicht neu.** Stand bleibt **53,0 %**. Es fehlen weiter
  Manfreds Session 3 und die Bewertung der neu erhobenen Felder.
* **Die Landingpage selbst habe ich nicht aufgerufen**, die sechs Stopper
  nicht nachgemessen. Heimat `chief-of-staff-marketing-todos.md`.
* **Versicherung, Stripe, Gewerbeanmeldung, Vercel-Benachrichtigung** — in
  diesem Lauf nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🟡 **Pushen.** Ein Commit von mir (Engineerings CoS-E-073 + Doku). | ein Befehl |
| 2 | 🔴 **Preis bei § 19 (A/B)** — tendiert zu **B** (Regelbesteuerung), noch nicht bestätigt. **Die Landingpage darf vorher nicht live gehen.** | ein Satz |
| 3 | 🟡 **F-007, neu:** Gibt es eine laufende Sicherung deines Rechners, und liegt der Projektordner mit drin? | ein Satz |
| 4 | 🟡 **IONOS-Weiterleitung `rechnung@`, neu** — machst du sie selbst, oder soll ich? Empfehlung: selbst, dann ist der Zustelltest dieselbe Mail. | ein Satz |
| 5 | 🟡 **CoS-P-013: ein Satz fehlt** — ging „Passwort speichern" durch und konntest du dich danach neu anmelden? | ein Satz |
| 6 | 🔵 **Buchhaltungs-Testlauf, neu** — einmal ein Angebot in deine eigene lexoffice-Buchhaltung schieben (fünf Minuten, braucht deinen API-Key). Entscheidet nur, ob auf der Seite die starke oder die vorsichtige Fassung steht. Blockiert nichts. | fünf Minuten |
| 7 | 🔵 **E-Rechnungs-Viewer installieren** (Quba, 0 €) — F-004, nicht eilig | einmalig |
| 8 | Vercel-Benachrichtigung · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert, in diesem Lauf nicht neu geprüft |

**Erledigt und weg von ihrer Liste:** nichts Neues — die Zählzeile und die
dritte Finance-Frage waren schon im letzten Lauf zu.

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **PM-090** (Staubschutzwand / Abendreinigung, Zug 2) — von ihnen selbst gesetzt. Danach **CoS-E-074** (die drei DC-116-Teile: Zeit-Ausschluss erkennen, Maße beim Herausnehmen erhalten, Hinweiszeile in `fehlende_angaben`). | niemanden |
| **Prüfmeister** | Marketings zwei Fragen (Kleinmaterial-Pauschale · **das Büro in der Fassung laufen lassen, die auf die Seite soll**) · Engineerings zwei Nischen-Rückfragen · neu: **PM-097-B** umformulieren oder als bewusst offen markieren | niemanden |
| **Marketing** | **Textseitig fertig, wartet bewusst.** Vier der sechs Stopper sind textlich zu, Fassung A/B für die Buchhaltungs-Zeile liegt bereit. | Sandys A/B zu § 19 · Sandys Buchhaltungs-Testlauf (nur A-vs-B) · Prüfmeister-Lauf Büro |
| **Designer** | **PD-019 Punkt 2** (Nachtrag ohne Kennzeichnung, PM-115) und **Punkt 3** (zwei Bauabschnitte, PM-116) · die Hinweis-Karte zu DC-116 wird erst sinnvoll, wenn Engineering den Erkenner hat · PD-018 Punkt 3 wartet auf die Messung des Prüfmeisters | Engineering (nur die DC-116-Karte) · Prüfmeister (nur PD-018 P3) |
| **Platform** | Beide offenen Punkte heute selbst geschlossen (BOM bleibt, Token nicht im Repo lösbar). **Nichts Zugewiesenes offen.** | niemanden |
| **Finance** | F-007 gestellt, Belegablage steht | Sandys Satz zur Sicherung · Sandys A/B zu § 19 |
| **Legal** | unverändert | niemanden |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **`menge_unbekannt` ist bewusst nicht gebaut.** Engineering nennt es einen
  eigenen Fall mit eigener Messung — offen, wer sie macht.
* **Der Extraktions-Prompt bekommt keine Sperrklinke.** Ein Prüfstand kann
  nicht messen, ob ein Sprachmodell eine Regel befolgt; die Nachziehung im
  Normalisierer ist der Beleg. So festgehalten, damit es später niemanden
  überrascht.
* **Das GitHub-403 auf Schritt-Ebene bleibt.** Ohne Token sehe ich weiter nur,
  **ob** ein Lauf grün war, nie **warum** er rot war.
* **Der Tiefengrund nach dem Tapetenabriss ist entschieden, aber nicht
  gebaut.** Marketing nimmt die Zeile aus dem Hero, statt darauf zu warten.
* **Ein Betrieb hängt an genau einem Konto.** Mitarbeiterzugänge gibt es
  nicht; die FAQ wird entsprechend gekürzt (M-5).

*Chief of Staff · 2026-09-17, 07:00 UTC*
