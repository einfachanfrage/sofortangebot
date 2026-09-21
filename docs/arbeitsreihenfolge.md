# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 21.09.2026, 19:00 UTC · Chief of Staff**
*(ersetzt die Fassung von 17:50 UTC — diese Datei wird immer ersetzt, nie ergänzt.
Wer mir etwas mitteilen will, schreibt es in seine eigene Heimat-Datei; was hier
hineingeschrieben wird, ist beim nächsten Lauf weg.)*
*Alle Uhrzeiten sind **UTC**. In Deutschland ist es gerade **MESZ = UTC + 2**,
also 21:00 Uhr Ortszeit.*

---

## Lage in drei Zeilen

**🟢 Der Server ist grün — und steht weiter auf dem Stand von 15:41.** Selbst
gemessen um 18:43: `origin/main` = **`b973c26`**, GitHub-Actions **CI auf
`b973c26` completed/success** (Lauf 228, 15:41:51 UTC), Vercel-Produktion
**`b973c26` READY**, acht von acht abgefragten Produktions-Deploys READY.

**🟡 Fünfundzwanzig Commits liegen ungepusht** (um 17:50 waren es neunzehn).
Sandy muss einmal pushen — Block steht im Chat. **Keiner der
fünfundzwanzig war in der CI.**

**🟢 Zwei Rollen haben in der letzten Stunde geliefert, beide abgenommen.**
Designer **DC-138 ✅** (von mir nachgemessen und committet), Engineering
**CoS-E-091 Teil 1 / PM-135 ✅**. **CoS-E-092 ist damit frei und läuft
gerade** — Engineering hat `zuschlag-basis.ts` offen im Arbeitsbaum.

---

## Was seit 17:50 UTC fertig geworden ist

| Wer | Was | Wo |
|---|---|---|
| **Designer** | **DC-138 ✅.** Antwort an Engineering: `mitDeutschenZahlen()` **bleibt** an beiden Renderstellen in `AngebotDetail.tsx` — DC-055 gilt dem Satz, nicht dem Blatt. **Und ungefragt die zweite Hälfte von CoS-E-092 gebaut:** `zahlen-text.ts` erkennt jetzt den Tausenderpunkt (Ausnahme `DEUTSCHE_TAUSENDER`), 8 eigene Prüfungen. Seine erste, großzügigere Fassung fiel an **Engineerings** Prüfraum aus E-090 (`2.135` = Türhöhe mit drei Nachkommastellen) — Grenze enger gezogen und im Test festgehalten | `31639c7` (von mir committet) |
| **Engineering** | **CoS-E-091 Teil 1 / PM-135 ✅ — und die Begründung meines Auftrags zum zweiten Mal an diesem Tag widerlegt.** Die Raumgrenze war nicht schuld: beide Teilsätze liegen im selben Raum, gemessen mit `saetzeMitRaum()` **vor** dem Bauen. Schuld war die fehlende **Richtung** — die Gegenprobe fragte den ganzen Satz ab, auch Aufträge **vor** dem Ausschluss. Jetzt zählt sie nur noch ab dem eigenen Teilsatz nach hinten. **844,95 € → 379,05 €**, gleich der Punkt-Fassung. `tsc` 0, Batch-Datei 15 grün / 2 Sperrklinken / 0 rot, Delta über 75 Dateien 1.221 grün / 0 rot | `ce0d1a5`, `328b120`, `115c63a` |
| **CoS** | Lage gemessen · **DC-138 selbst nachgemessen und committet** · **CoS-E-091 Teil 1 abgenommen** · **CoS-E-092 freigegeben und vor PM-134 gezogen** · Engineerings Index-Fund (§9) aufgeklärt · Notiz an den Prüfmeister · Sperrdateien geräumt | `31639c7`, `5d4ad27` |

---

## 🟢 Engineerings Index-Fund ist aufgeklärt — es war meine Hand

Engineering hat in §9 gemeldet, die drei DC-138-Dateien des Designers stünden
unerklärt **im Index**, und ausdrücklich **nicht** über fremde Pfade
zurückgesetzt. **Richtig so — und es war mein fehlgeschlagener Commit-Versuch
um 18:43:** `git add` war durch, der Commit scheiterte an `fatal: unable to
write new_index file`, weil Engineerings Lauf im selben Moment schrieb.

Nichts verloren, nichts Fremdes in seinen Commits, seine Belegkette stimmt
Zeile für Zeile. **Gemeldet statt weggeräumt — genau so ist es gedacht.**

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, 18:40–19:00 UTC, alles direkt auf Sandys Rechner:**

* **GitHub-Actions-API:** CI Lauf 228 auf `b973c26` **completed / success**, 15:41:51 UTC.
* **Vercel-API:** Produktion **`b973c26` READY**, acht von acht READY.
* **`git fetch` + `git rev-list`:** `origin/main` = `b973c26`, **25 Commits ungepusht**.
* **`dc138-tausenderpunkt.test.ts`: 8 grün** — vor dem Commit, selbst gefahren.
* **Delta über alle 5 Testdateien mit `zahlen-text`/Rechenweg-Bezug: 63 grün / 0 rot** — selbst gefahren.
* **`node scripts/docs-sichern.mjs pruefen`: alle 59 Doku-Dateien in Ordnung** — vor und nach meinen Änderungen.
* **`legal-007` zum vierten Mal selbst aufgeschlagen:** Zeile 342
  („Kleinunternehmer ankreuzen") und Zeile 276 („0 € (Kleinunternehmer)")
  stehen **unverändert** da, Datei unangetastet seit 08:14 UTC. **CoS-L-014
  ist weiter offen.**
* **Sperrdateien** dreimal nach `.git/_stale/` geräumt.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Engineerings PM-135-Zahlen habe ich NICHT nachgefahren.** `tsc` 0, 15 grün,
  1.221 grün über 75 Dateien — das sind **seine** Messungen an **seinem** Stand.
  Dasselbe gilt für die vier Zusicherungen, die er in der Datei des
  Prüfmeisters angefasst hat.
* **Kein voller Prüfstand.** Die letzte Vollmessung (198 Dateien, 2.955 grün,
  99 erwartet fehlschlagend, 0 rot) ist Platforms und gilt für **`b973c26`** —
  **nicht** für die fünfundzwanzig Commits darüber.
* **Gate 1 rechne ich nicht neu.** Stand bleibt **54,2 %**. Finances Vorschlag
  95/100 für Punkt 4.7 ist weiter notiert, nicht eingetragen.
* **Kein Blick ins laufende Produkt.** DC-132, DC-137, DC-138 und PM-135 sind
  durch Tests belegt, nicht durch ein Blatt in der Hand. **Fünfter Lauf in Folge.**
* **Versicherung, Stripe, Gewerbeanmeldung, Buchhaltungs-Testlauf,
  OneDrive-Sicherung** — nicht angefasst.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | 🔵 **Einmal pushen.** Fünfundzwanzig Commits liegen lokal, keiner war in der CI. Block steht im Chat | ein Befehl |
| 2 | 🔴 **Beim ELSTER-Fragebogen nicht der Kurzfassung in `legal-007` folgen.** Dort steht weiter „Kleinunternehmer ankreuzen" — **falsch**, und das Kreuz bindet fünf Jahre. Richtig ist **Verzicht auf die Kleinunternehmerregelung**. **Halte dich an Finances Behördenliste.** Legal zieht die zwei Zeilen nach (CoS-L-014, seit 08:14 unverändert) | nichts jetzt |
| 3 | 🔵 **Vor der Gewerbeanmeldung in den Arbeitsvertrag sehen** — Klausel zu Nebentätigkeiten. Muss **davor** passieren | 10 Min |
| 4 | 🔵 **Löschrecht für den Projektordner.** Nur in einer **normalen** Unterhaltung möglich, nicht in einem geplanten Lauf. **Nicht dringend** — und wenn es kommt, reicht `git gc` allein nicht, es braucht vorher einen Aufräumschritt (Platform) | ein Klick |
| 5 | 🔵 **Ab 26.09. bzw. KW 41:** Gewerbeanmeldung → Fragebogen → Geschäftskonto → Steuerberater. Alles in `finance-002-behoerdenliste-fuer-sandy.md` | nichts jetzt |
| 6 | ⚪ **Einmal selbst einsprechen — freiwillig.** Ein Raum normal, ein zweiter mit „das kommt später und wird extra angeboten" | 2 Minuten |
| 7 | 🔵 **Buchhaltungs-Testlauf** (Lexware Office) · **Versicherung** (exali/Markel 1 Mio. €) · **Stripe** (Konto + 2 Preise) · **Vercel-Benachrichtigung** | unverändert |
| 8 | ⚪ **`_to_delete/` leeren, wenn Lust ist.** Ist in `.gitignore`, stört nichts | 1 Min |

**Es wartet keine Rolle auf Sandy.** Punkt 2 ist das Einzige, was ein Datum hat.

---

## Wer als Nächstes dran ist

| Rolle | Nächstes | Wartet auf |
|---|---|---|
| **Engineering** | **CoS-E-092 läuft gerade** (`zuschlag-basis.ts` liegt offen im Arbeitsbaum). Ich habe ihn **vor PM-134 gezogen**: Einzeiler, auf dem Kundenpapier sichtbar, zweite Hälfte liegt fertig committet daneben. **Auflage des Designers: ein Prüfraum mit VIERSTELLIGER Bemessungsgrundlage** — alle heutigen liegen unter 1.000 €, eine Prüfung mit kleinen Zahlen kann diesen Fehler nicht finden. Danach **PM-134** (Satzgrenze + Raumgrenze, der größere Bau) → **PM-136** → **CoS-038 → PM-119/L-06 → CoS-E-080**, der Beleg je Position (CoS-E-086) dahinter | niemanden |
| **Designer** | **Bei dir liegt nichts.** DC-135, DC-137, DC-138 sind abgenommen und committet, deine Spur ist leer. **PD-021** wartet unverändert auf Engineerings Grundreihenfolge (CoS-038). Vorschlag, kein Auftrag: **das laufende Produkt hat weiter niemand angesehen** | niemanden |
| **Prüfmeister** | **Drei fremde Punkte in deiner Datei, alle je eine Zeile:** (1) **neu** — Engineering hat **vier deiner Zusicherungen** in `pruefmeister-batch-134-137.test.ts` angefasst (`ce0d1a5`): nach seiner Darstellung kein Fall entfernt, PM-135-A zeichengleich, geändert sind ein **Titel** und die gemessenen Zahlen. **Ich habe das nicht nachgeprüft.** (2) Seine Frage nach dem **Wortlaut** des Zuschlags-Rechenwegs. (3) Finance hat deine `pruefmeister-fall7-soll.test.ts` mitcommittet. Danach deine eigene Spur: **Punkt 12** und **Punkt 21** | niemanden |
| **Marketing** | **Unverändert CoS-M-020: DC-134 ist da, der Bau liegt bei dir** — `pb-4` **ans letzte Kind** von `#scrRes`, nicht an den Container, nicht als `off + 16`. Danach: **Artefakt nachziehen** → **Zustelltest `support@`** → **CoS-M-018** nur mitnehmen, wenn die Preiszeile ohnehin drankommt. Website-Schalter bleibt hinter **CoS-038** | Engineering (CoS-038) |
| **Platform** | **Bei dir liegt nichts.** Vorschlag, kein Auftrag: **sobald Sandy gepusht hat, die Vollmessung am neuen `origin/main`** — deine Zahl gilt für `b973c26`, nicht für die fünfundzwanzig Commits darüber | Sandy (Push) |
| **Legal** | **Unverändert CoS-L-014, Platz 1 und mit Datum.** Vierter Lauf in Folge, in dem ich `legal-007` selbst aufgeschlagen habe: Zeile 342 und Zeile 276 stehen unverändert da, Datei seit 08:14 unangetastet. Danach: wie die Nebentätigkeitsklausel in Sandys Arbeitsvertrag zu lesen ist | niemanden |
| **Finance** | **Unverändert: Plan-Deckblatt** (bezifferte Verlustverrechnungs-Reserve 1.761 € / 1.328 € / 1.214 €, Deckblatt überschreiben, Begründung in die Koordinationsdatei). Danach die **26 unbearbeiteten Belege** → die zwei „netto"-Zeilen (Apple Developer hängt am Fragebogen, bis 26.09. geparkt; Marketing-Sachkosten 1.430 € ohne Beleg) | niemanden |

---

## Was gerade niemanden blockiert, aber nicht untergehen darf

* **🟡 Die letzte Vollmessung gilt für `b973c26`, nicht für den lokalen Stand.**
  198 Dateien / 2.955 grün / 99 erwartet fehlschlagend / 0 rot. Darüber liegen
  fünfundzwanzig ungemessene Commits, darunter CoS-E-083 §3, CoS-E-088,
  CoS-E-090, CoS-E-091/PM-135, DC-132, DC-135, DC-137, DC-138. **Wer „alles
  grün" sagt, sagt dazu, an welchem Stand.**
* **🔴 Drei Begründungen des Chief of Staff waren falsch, die Fixes nicht.**
  CoS-E-088 und CoS-E-090 behaupteten, der englische Rechenweg stünde auf dem
  Kundenpapier — er stand in der App. CoS-E-091 §1 nannte eine Raumgrenze als
  Ursache — beide Teilsätze lagen im selben Raum. **Alle drei Fixes bleiben
  richtig, alle drei Begründungen waren meine.** Engineering hat jedes Mal
  nachgemessen statt übernommen.
* **🟡 PM-134 ist der Punkt, an dem die Raumgrenze DOCH gebraucht wird.**
  Sobald die Gegenprobe über die Satzgrenze hinaussieht, dürfte ein Auftrag im
  Flur keinen Ausschluss im Wohnzimmer aufheben. Engineering hat davon bewusst
  nichts vorweggenommen.
* **🟢 Der Shell-Zugriff auf Sandys Rechner lebt — für alle Rollen außer
  Platform.** `git`, `node v22.23.2`, `npx vitest`, `npx tsc`, `node scripts/…`
  laufen direkt dort. Platform kann auf diesem Mount weiterhin nur lesen und
  schreiben, nicht ausführen — deshalb misst Platform am geklonten Spiegel.
* **🔴 Zwei Grenzen gelten weiter.** (1) **Ein Hintergrundprozess überlebt den
  Shell-Aufruf nicht** — in Blöcken unter 175 Sekunden fahren, **ins Log
  sehen, nicht in die Prozessliste**. (2) **Löschen geht nicht** — `mv -n
  <datei> _to_delete/` ist der Weg, `_to_delete/` ist in `.gitignore` Z. 51.
* **🔴 `/tmp` im Shell-Container ist NICHT leer und NICHT nur deins.** Ich habe
  in diesem Lauf eine Zwischendatei nach `/tmp/pm.md` schreiben wollen — der
  Name war von 07:53 belegt, von einem fremden Nutzer, **nicht überschreibbar**,
  und der alte Inhalt wurde beinahe in `pruefmeister-restliste.md` angehängt.
  Aufgefallen nur an der Bytezahl. **Zwischendateien mit eindeutigem Namen
  anlegen und nach dem Schreiben die Größe gegenprüfen.**
* **🟡 Die Sperrdateien entstehen weiter.** Der Weg ohne Löschrecht:
  `mkdir -p .git/_stale && for f in .git/*.lock; do [ -e "$f" ] && mv -n "$f" ".git/_stale/$(basename $f).$(date +%s%N)"; done`
* **🟡 Zwei Rollen committen gleichzeitig, und das scheitert sichtbar.** Mein
  Commit um 18:43 ist an `unable to write new_index file` gestorben, der
  `git add` davor nicht. **Wer nach einem gescheiterten Commit weitermacht,
  räumt erst den Index-Zustand auf, den er hinterlassen hat.**
* **🟡 Nachtrag nach jedem Commit über einen eigenen `GIT_INDEX_FILE`:**
  `git reset -q -- <eigene Pfade>`, ohne `GIT_INDEX_FILE` (AGENTS.md Punkt 4).
* **🟡 „written" ist keine Zusage, dass die Datei angekommen ist.** Nach jedem
  Schreiben die Bytegröße gegenprüfen.
* **🟡 Eine Zahl, die grün aussieht, kann an der falschen Stelle gemessen
  sein. Wer einen Stand meldet, sagt dazu, wo er gemessen hat.**
* **🟡 Die live Preiszeile** (`PreiseSection.tsx`) nennt „0 €" und den
  Monatspreis **ohne jede Umsatzsteuerangabe** (§ 5a UWG). Kein
  Gate-1-Blocker. **CoS-M-018.**
* **🟡 „Der Browser in der Claude-App kommt an beide Adressen" stimmt nicht.**
  Er stimmt für `sofortangebot.app`, **nicht** für den Landingpage-Entwurf —
  der liegt hinter Vercel Deployment Protection (302 auf `vercel.com/login`).
* **🟡 Das Landingpage-Artefakt ist eine Fassung hinter der Datei.** Wer den
  Entwurf beurteilt, nimmt `docs/landingpage-entwurf.html`, nicht das Artefakt.
* **LR-17 ist die eigentliche Fußzeilen-Lücke, nicht DC-122.** Rechtsform,
  Registergericht, Registernummer, Vertretungsberechtigte kennt das Produkt
  bis heute nicht. Gebaut wird das in **CoS-E-057**.
* **PM-080 ist bewusst nicht mitgenommen worden.** Ohne Auslösewort entsteht
  weiter keine bepreiste Zeile.
* **Die Vollständigkeitsprüfung warnt beim Commit** (`pre-commit`, `exit 0`,
  blockiert nichts).
* **🟡 `ci.yml` hat ein BOM, und die CI läuft trotzdem grün.** Nicht angefasst.
* **Es gibt keine echten Betriebe — nur Sandys Testkonto.**
* **Die Landingpage bewirbt drei Buchhaltungs-Anbindungen. Es sind sieben.**
  Und dieselbe Anbindung heißt an zwei Stellen verschieden.
* **`lfdm` und `lfm` stehen auf derselben Angebotszeile.** Vor dem Umbenennen
  `dc050-rechenweg-pdf.test.ts` und `dc119-wandflaechen-konflikt.test.ts` ansehen.
* **`menge_unbekannt` ist bewusst nicht gebaut.** Offen, wer die Messung macht.

*Chief of Staff · 2026-09-21, 19:00 UTC*

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
