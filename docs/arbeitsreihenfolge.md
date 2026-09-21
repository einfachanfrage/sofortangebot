# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 21.09.2026, 15:20 UTC · Chief of Staff**
*(ersetzt die Fassung von 10:05 UTC — diese Datei wird immer ersetzt, nie ergänzt.
Wer mir etwas mitteilen will, schreibt es in seine eigene Heimat-Datei; was hier
hineingeschrieben wird, ist beim nächsten Lauf weg.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**,
also 17:20 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟢 Was auf dem Server liegt, ist grün.** GitHub-Actions: **CI auf `badfc93`
success**, 10:04:57 UTC. Vercel: Produktion **`badfc93`, READY**. Die zehn
jüngsten Produktions-Deploys sind alle READY, kein einziger Fehlschlag.

**🔴 Was lokal liegt, war rot — und ist es seit 15:20 UTC nicht mehr.** Die
Spitze `a7a8c65` enthielt einen entsperrten Test (**PM-105**), dessen Code
uncommittet im Arbeitsbaum lag. **Selbst gemessen, in einer Kopie außerhalb
des Arbeitsbaums: 1 rot.** Ich habe Engineerings fertige drei Dateien
committet; danach grün. **Ohne das wäre Sandys nächster Push rot in die CI
gelaufen.**

**🟡 Sieben Commits liegen ungepusht. Sandy muss einmal pushen** — Block steht
im Chat. Vorher passiert nichts auf dem Server, und nichts davon ist in der CI
gewesen.

---

## Was seit 10:05 UTC fertig geworden ist

| Wer | Was | Wo |
|---|---|---|
| **Engineering** | **CoS-E-083 Platz 4 — PM-107 + PM-106.** Eine Ansage, die keinen Raum nennt, gilt jetzt fürs ganze Angebot statt für den zuletzt genannten Raum. PM-107: **80,00 €** zu viel, weg. PM-106: zwei ungefragte Grundierungen über **279,00 €**, weg. Voller Prüfstand dazu gefahren | `c82881c`, `18d6572` |
| **Engineering** | **CoS-E-083 Platz 5 — PM-105.** „An jeder Tür eine Übergangsschiene" ergibt jetzt eine Schiene **pro Tür** statt einer insgesamt (15,00 € plus Arbeit, die eingebaut und nicht bezahlt wurde). Fertig und grün gemessen — der Commit fehlte, den habe ich gefahren | dieser Lauf |
| **Prüfmeister** | **Batch 47-56 aufgeräumt und committet** — 45 grün · 8 Sperrklinken · 0 rot. Vor dem Entsperren an der **ganzen Positionsliste** nachgerechnet. **A/B/C beantwortet: B** (Altbauwohnung/Altbauhaus zählen mit, geschlossene Liste, kein Präfix). **Themenspeicher-Punkt 14 zu:** 40 Stellen schreiben „aus Transkript", kein unbelegter Rechenweg | `a7a8c65` |
| **Marketing** | **CoS-M-016 — alle vier Handy-Befunde abgearbeitet und bei echten 375 px gemessen.** Abschluss-CTA bleibt nicht mehr leer, Vorschau-Umschalter war schon weg, Hero 152 px kürzer, Reiterkante zeigt, dass es weitergeht. Rahmen 290 → 320 px, **kein waagerechtes Seitenscrollen** | `9a068c6` |
| **Designer** | **DC-129** — Antwort auf Marketings fünften Befund: der Schirm fährt mit, keine Position fällt weg. Sechs gebaute Punkte, bei 375 px gerechnet. **DC-130 §1** — Gestaltung des neuen Rechenwegs bleibt, entschieden | uncommittet, geht mit diesem Lauf |
| **Finance** | **Behördenliste für Sandy fertig, fünf Tage vor Termin** (`finance-002-behoerdenliste-fuer-sandy.md`, fünf Schritte, 2,5 h, 15 €). **CoS-F-008 beantwortet: nein**, der Umsatzsteuerstatus ändert nichts für Sandys Vollzeitjob | `c23ca36` |
| **CoS** | Index-Falle zugemacht · Spitze gemessen und den roten Test gerettet · **CoS-E-088** (deutsche Zahl auf dem Kundenpapier), **CoS-E-089**, **CoS-P-035**, **CoS-L-014**, **CoS-M-019**, **CoS-F-010**, **DC-131** verteilt | dieser Lauf |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, 14:43–15:20 UTC:**

* **GitHub-Actions-API:** CI auf `badfc93` **success**, 10:04:57 UTC. Die acht
  jüngsten Läufe: sieben success, einer `cancelled` (`2411f76`, abgebrochen
  weil 15 Sekunden später der nächste Commit kam).
* **Vercel-API:** Produktion **`badfc93`, READY**; zehn von zehn READY.
* **`git fetch` + `git rev-parse`:** `origin/main` = `badfc93`, lokal
  `a7a8c65`, **fünf ungepusht** vor diesem Lauf, sieben danach.
* **Der geteilte Index — die Falle aus CoS-E-087 hatte zugeschnappt.** Er
  stand auf einem `HEAD` vor `a7a8c65` und führte **zwei Dateien als
  gelöscht**, die nachweislich in `HEAD` stehen und im Arbeitsbaum liegen
  (`pruefmeister-herkunft-transkript.test.ts`,
  `pruefmeister-pm103-altbau-grenze.test.ts` — darin die A/B/C-Begründung und
  drei Sperrklinken für Engineering). Gegenprobe `git cat-file -e HEAD:…` für
  beide. **`git reset -q` gefahren, Arbeitsbaum nicht angefasst, Index jetzt
  leer.** Der nächste Commit einer anderen Rolle hätte beide gelöscht.
* **Die Spitze `a7a8c65`, in einer `git archive`-Kopie außerhalb des
  Arbeitsbaums:** `tsc --noEmit` **0 Fehler**, Delta-Prüfstand über fünf
  Dateien **1 rot** (PM-105, `expected 1 to be 2`).
* **Derselbe Prüfstand im echten Arbeitsbaum:** **fünf Dateien grün, 0 rot**,
  `tsc --noEmit` **0 Fehler**. Der Unterschied ist genau eine uncommittete
  Zeile in `boden.ts`.
* **CoS-E-088 an der Zeile nachgesehen:** `maler-sonder.ts` Z. 222 gibt
  `${t.menge}` ungeformt aus; `zahlDe()` existiert
  (`mengen/wandflaechen-konflikt.ts` Z. 103) und wird in `gewerke/maler.ts`
  dreimal benutzt.
* **`legal-007` selbst aufgeschlagen:** Zeile 343 und Zeile 276 sagen weiter
  „Kleinunternehmer", der lange Text ab Zeile 113 ist korrigiert.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Kein voller Prüfstand über alle 197 Dateien.** Ein Versuch mit
  `--reporter=basic` ist ohne Testlauf abgestürzt (den Reporter gibt es in
  dieser vitest-Fassung nicht), ein zweiter Lauf im Hintergrund wurde beim
  Ende des Shell-Aufrufs mitgekillt. Gemessen habe ich den **Delta** — die
  fünf Dateien, die die ungepushten Commits berühren. Die letzten belegten
  Vollmessungen sind Engineerings (10:05 UTC: 2.915 grün · 97 Sperrklinken ·
  6 rot, die sechs in der damals uncommitteten Prüfmeister-Datei, seither zu)
  und die des Prüfmeisters über seine Datei (45 grün · 8 · 0 rot).
* **CoS-E-088 ist nicht ausgelöst worden.** Weder vom Designer noch von mir —
  die Zeile ist gelesen, der Fall nicht durch die Pipeline gefahren.
* **Den Landingpage-Entwurf habe ich nicht bei 375 px nachgemessen.** Die
  Zahlen stammen von Marketing und vom Designer.
* **Gate 1 rechne ich in diesem Lauf nicht neu.** Stand bleibt **54,2 %**.
* **Versicherung, Stripe, Gewerbeanmeldung, Buchhaltungs-Testlauf,
  OneDrive-Sicherung** — nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Einmal pushen.** Sieben Commits liegen lokal, keiner war in der CI. Block steht im Chat | ein Befehl |
| 2 | 🔴 **Beim ELSTER-Fragebogen nicht der Kurzfassung in `legal-007` folgen.** Dort steht unten noch „Kleinunternehmer ankreuzen" — **falsch**, und das Kreuz bindet fünf Jahre. Richtig ist **Verzicht auf die Kleinunternehmerregelung**, so wie am 17.09. entschieden. **Halte dich an Finances Behördenliste**, die sagt es richtig. Legal zieht die zwei Zeilen nach (CoS-L-014) | nichts jetzt |
| 3 | 🔵 **Vor der Gewerbeanmeldung in den Arbeitsvertrag sehen** — Klausel zu Nebentätigkeiten. Muss **davor** passieren, danach wäre eine Anzeige verspätet. Wie die Klausel zu lesen ist, sagt dir Legal | 10 Min |
| 4 | 🔵 **Löschrecht für den Projektordner.** Ein Klick, aber nur in einer **normalen** Unterhaltung möglich, nicht in einem geplanten Lauf. Spart jeder Rolle einen Handgriff. **Nicht dringend** | ein Klick |
| 5 | 🔵 **Ab 26.09. bzw. KW 41:** Gewerbeanmeldung → Fragebogen → Geschäftskonto → Steuerberater. Alles steht in `finance-002-behoerdenliste-fuer-sandy.md` | nichts jetzt |
| 6 | ⚪ **Einmal selbst einsprechen — freiwillig.** Der Designer kann das Bernsteinbanner ohne echte Sprachaufnahme nicht prüfen: ein Raum normal, ein zweiter mit „das kommt später und wird extra angeboten" | 2 Minuten |
| 7 | 🔵 **Buchhaltungs-Testlauf** (Lexware Office) · **E-Rechnungs-Viewer** (Quba, 0 €) · **Versicherung** (exali/Markel 1 Mio. €) · **Stripe** (Konto + 2 Preise) · **Vercel-Benachrichtigung** | unverändert |

**Es wartet keine Rolle auf Sandy.** Punkt 2 ist das Einzige, was ein Datum hat.

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **CoS-E-089 lesen** — deine PM-105-Arbeit ist von mir committet worden, weil die Spitze sonst rot geblieben wäre. Sag es, wenn daran noch etwas fehlt, dann nehme ich den Commit zurück. Danach: **🆕 CoS-E-088** (eine Zeile — `zahlDe(t.menge)` in `maler-sonder.ts` Z. 222, damit auf dem Kundenpapier „46,8 m²" statt „46.8 m²" steht; **mit einem Prüfraum, der keine runde Zahl ergibt**, sonst ist der Fix nicht belegt), dann die **Bemessungsgrundlage der fünf Erschwerniszuschläge** (CoS-E-083 §3) → **CoS-038 → PM-119/L-06 → CoS-E-080**. **CoS-E-086** bleibt eine Antwortfrage, kein Bauauftrag | niemanden |
| **Prüfmeister** | **Platz 1: die zwei Fragen von Engineering**, seit 10:07 UTC unbeantwortet in deiner Datei — (1) deine Soll-Tabelle zu Fall 7 führt die zwei Grundierungen noch als erwartete Zeilen, obwohl sie gebaut entfernt sind; (2) dein Nebenbefund „6,00 €/m² statt 4,50 €" ist auf dem Prüfstand nicht reproduzierbar. **🆕 Und eine Lehre:** eine Sperrklinke in einer fremden Datei zu committen, deren Code noch nicht committet ist, macht die Spitze rot — heute passiert, siehe CoS-E-089 | niemanden |
| **Designer** | **DC-127** (dunkler Tabellenkopf, nur eine der beiden Seiten). **PD-018 §3** sinnvoll erst nach Engineerings Umstellung. **🆕 DC-131 lesen:** DC-129 ist als Bauauftrag bei Marketing, DC-130 §2 als CoS-E-088 bei Engineering — und dein „D und ?? gleichzeitig" von heute Vormittag war kein Speicherfehler | niemanden |
| **Marketing** | **🆕 CoS-M-019 zuerst** — DC-129 ist beantwortet und ist ein Bauauftrag für dich: der Schirm fährt mit, sechs Punkte, **Punkt 5 (`prefers-reduced-motion`) ist der wichtige** — ohne ihn sieht dieser Besucher Summe und Knopf nie. Dann **CoS-M-014**, danach Zustelltest `support@`. **CoS-M-018** nur mitnehmen, wenn die Preiszeile ohnehin angefasst wird — Wortlaut bei Legal holen. Website-Schalter bleibt hinter **CoS-038** | Engineering (CoS-038) |
| **Platform** | **🆕 CoS-P-035** — der Nachzug in `docs-sichern.mjs` (Z. 160–166) setzt den geteilten Index auf den **Arbeitsbaum** statt auf `HEAD` und deckt nur `docs/` ab. Genau darüber sind heute zwei fertige Dateien fast verschwunden. Aus meiner Sicht dein Platz 1 | niemanden |
| **Legal** | **🆕 CoS-L-014, Platz 1 und mit Datum** — `legal-007` Zeile 343 („Kleinunternehmer ankreuzen", in der Oktober-Kurzfassung, die Sandy abarbeitet) und Zeile 276 (Kostentabelle). Fund von Finance, von mir in der Heimat-Datei nachgesehen. Danach: wie die Nebentätigkeitsklausel in Sandys Arbeitsvertrag zu lesen ist — das hat Finance dir zugeordnet | niemanden |
| **Finance** | **CoS-F-009** (Vorsteuer in die Kostenübersicht, Reverse-Charge auf „durchlaufend", Voranmeldungsrhythmus als Steuerberater-Frage) → die **26 unbearbeiteten Belege** → die zwei „netto"-Zeilen im Kostenkatalog (Apple Developer, Marketing-Sachkosten). **CoS-F-010 zur Kenntnis:** Behördenliste abgenommen, dein Kleinunternehmer-Fund ist eskaliert | niemanden |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **🔴 Der Umweg um die Sperrdateien legt selbst eine Falle — und sie hat heute
  zugeschnappt.** Wer mit eigenem `GIT_INDEX_FILE` committet, lässt den
  geteilten Index stehen; neu hinzugekommene Dateien stehen danach gleichzeitig
  als `D` und `??`, und der nächste Commit über den geteilten Index löscht sie.
  **Nachtrag nach jedem solchen Commit:** `git reset -q -- <eigene Pfade>`,
  ohne `GIT_INDEX_FILE`. Der Arbeitsbaum wird dabei nicht angefasst. Dauerhaft
  gehört das ins Skript — **CoS-P-035**.
* **🔴 Neues Verfahren für alle: wer eine Sperrklinke in einer fremden
  Testdatei löst, committet im selben Lauf den eigenen Code — oder löst sie
  nicht.** Sonst committet die fremde Rolle ihre Datei und die Spitze ist rot,
  ohne dass jemand es merkt. Genau das ist heute passiert.
* **🟡 Die Sperrdateien entstehen weiter.** Ursache ist das fehlende
  Löschrecht. Der Weg, der ohne dieses Recht funktioniert:
  `mkdir -p .git/_stale && for f in .git/*.lock; do [ -e "$f" ] && mv -n "$f" ".git/_stale/$(basename $f).$(date +%s%N)"; done`
* **🟡 „written" ist keine Zusage, dass die Datei angekommen ist.** Nach jedem
  Schreiben die Bytegröße gegenprüfen. Hat heute zwei Dateien gerettet.
* **🟡 Eine Zahl, die grün aussieht, kann an der falschen Stelle gemessen
  sein.** Der Prüfmeister hat heute „0 rot" gemessen — im Arbeitsbaum, in dem
  fremder uncommitteter Code lag. Dieselbe Datei war committet rot. **Wer einen
  Stand meldet, sagt dazu, wo er gemessen hat.**
* **🟡 Ein Hintergrundprozess überlebt hier den Shell-Aufruf nicht.** Lange
  Läufe müssen in Blöcken unter 175 Sekunden gefahren werden, und ein Prozess,
  der noch zu laufen scheint, kann längst tot sein — **ins Log sehen, nicht in
  die Prozessliste.** `--reporter=basic` gibt es in dieser vitest-Fassung nicht.
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
  weiter keine bepreiste Zeile. Offene Bauentscheidung des Prüfmeisters,
  festgehalten als Zusicherung (E-085-6).
* **Die Vollständigkeitsprüfung warnt beim Commit** (`pre-commit`, `exit 0`,
  blockiert nichts). Wer „ist committet" meldet, ohne die
  `[pre-commit]`-Zeilen gelesen zu haben, meldet einen Stand, der bei Vercel
  rot werden kann.
* **🟡 `ci.yml` hat ein BOM, und die CI läuft trotzdem grün.** Nicht angefasst.
* **Es gibt keine echten Betriebe — nur Sandys Testkonto.**
* **Die Landingpage bewirbt drei Buchhaltungs-Anbindungen. Es sind sieben.**
  Und dieselbe Anbindung heißt an zwei Stellen verschieden.
* **`lfdm` und `lfm` stehen auf derselben Angebotszeile.** Entscheidung liegt
  bei Engineering; vor dem Umbenennen `dc050-rechenweg-pdf.test.ts` und
  `dc119-wandflaechen-konflikt.test.ts` ansehen.
* **`menge_unbekannt` ist bewusst nicht gebaut.** Offen, wer die Messung macht.

*Chief of Staff · 2026-09-21, 15:20 UTC*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
