# Arbeitsreihenfolge — wer macht was, in welcher Reihenfolge

**Stand: 16.09.2026, 13:05 MESZ · Chief of Staff**
*(ersetzt die Fassung von 12:00 MESZ — diese Datei wird immer ersetzt, nie ergänzt.)*

---

## Lage in drei Zeilen

**Seit 12:00 MESZ hat keine Rolle etwas Neues geliefert.** Geprüft: alle 79
Einträge in `docs/`, alle 63 im Projektwurzelverzeichnis, `src/` vollständig.
Einzige Änderung: der Prüfmeister hat `einsprech-liste-alle-faelle.md` um 12:23
noch einmal nachgezogen.

**Sandy hat den Block aus dem letzten Lauf noch nicht ausgeführt** —
`.github/workflows/ci.yml` liegt unverändert kaputt auf der Platte, es gibt
keinen neuen Commit und keinen neuen CI-Lauf. Produktion ist weiter `1ebda34`,
`READY`.

**Neu und der eigentliche Ertrag dieses Laufs: der CI-Lauf ist gemessen, ohne
auf GitHub zu warten.** Ich habe `1ebda34` frisch geklont und die Schritte der
CI selbst gefahren. **Lint, TypeScript, Env, Tests und die Doku-Prüfung sind
grün.** Nur der Produktions-Build ist in meiner Umgebung nicht messbar.

---

## Was seit 12:00 MESZ dazugekommen ist — und wo es jetzt liegt

| Rolle | Ergebnis | Status |
|---|---|---|
| Chief of Staff | **CI-Schritte auf `1ebda34` selbst gefahren** — Lint 110 Warnungen/0 Fehler, `tsc` sauber, **155 Testdateien / 2402 bestanden / 75 erwartet-rot**, `env:check` grün, Doku-Endmarkierung grün. Als **CoS-P-026 Nachtrag 1** bei Platform, als Nachtrag bei Engineering | ✅ erledigt |
| Chief of Staff | **Produktions-Build: ehrlich offen.** Fällt hier mit genau drei Fehlern, alle drei „Google Fonts nicht erreichbar" — in meiner Umgebung gesperrt, kein Code-Fehler. Weitere Fehler gab es nicht | offen, **nicht messbar** |
| Chief of Staff | **Doku-Endmarkierung mit den sechs uncommitteten Dateien geprüft** — „Alle 55 Doku-Dateien in Ordnung". Der neue CI-Schritt wird sie nicht rot machen | ✅ erledigt |
| Chief of Staff | **`.github/` erneut versucht zu beschreiben** — wieder abgelehnt („protected file"). Der CI-Fix geht endgültig nur über Sandys Block | bestätigt |
| Chief of Staff | **`ci.yml`-Fix auf reines ASCII umgestellt** (`Abhaengigkeiten installieren`), wie in CoS-P-026 angekündigt | fertig, **liegt nicht auf der Platte** |
| Prüfmeister | **Einsprech-Liste nachgezogen** (12:23) — 18 Aufnahmen plus zwei Klick-Prüfungen (doppelter Klick auf „Angebot erstellen", Raummaß nachträglich ändern) | fertig, **nicht committet** |

---

## 🔎 Was ich selbst nachgesehen habe — und was nicht

**Selbst gemessen, nicht vermutet:**

* **`1ebda34` geklont, `npm ci`, dann die CI-Schritte einzeln** mit denselben
  Env-Werten aus `ci.yml`:
  * `node scripts/docs-sichern.mjs pruefen` → „Alle 55 Doku-Dateien in Ordnung"
  * `npm run lint:ci` → 110 Warnungen, 0 Fehler, Rückgabewert 0 (Budget 120)
  * `npm run typecheck` → Rückgabewert 0
  * `npm run env:check` → „Umgebung gültig: ci / Supabase example"
  * `npm test` → **155 Dateien, 2402 bestanden, 75 erwartet-rot**, 62 s
  * `npm run build` → 3 Fehler, **alle drei `next/font` / Google Fonts**
* **Dass die Fonts an der Umgebung liegen, nicht am Code:**
  `fonts.googleapis.com` und `fonts.gstatic.com` antworten hier mit 403 auf den
  CONNECT des Proxys. Auf GitHub sind beide erreichbar.
* **Der Fix gegen einen YAML-Parser:** neun Schritte, jeder mit `run` oder
  `uses`, keine doppelten Schlüssel, kein BOM, keine Nicht-ASCII-Zeichen.
* **Alle Dateien in `docs/` und im Wurzelverzeichnis nach Änderungszeit** gegen
  den Stand von 12:00 MESZ.
* **Produktion über die Vercel-API:** `1ebda34`, `READY`, kein neuer Deploy.
* **CI-Läufe #185–#191:** #187 grün, #188–#191 rot, kein neuer Lauf seit 10:24.

**Nicht geprüft, und ich behaupte es deshalb nicht:**

* **Der Produktions-Build.** Er ist der einzige CI-Schritt, über den weiterhin
  nichts bekannt ist. Ich sage nicht „wird grün".
* **Die Testläufe der Rollen einzeln.** Unverändert nicht nachgefahren — die
  2402 oben sind die gemeinsame Suite, nicht deren Eigenprüfungen.
* **Gate 1 rechne ich weiterhin nicht neu** — ich warte auf Manfreds Session 3.

---

## Sandy — was offen ist

| # | Was | Aufwand |
|---|---|---|
| 1 | **Block im Chat ausführen** — schreibt den CI-Fix und committet sieben Dateien | ein Block |
| 2 | 🟡 **DC-109 entscheiden** — „A" oder „B", Empfehlung in `entscheidungen-fuer-sandy.md` | eine Antwort |
| 3 | 🟡 **LR-18 freigeben** — dritte Datenschutz-Korrektur, Textfix an zwei Zeilen | ein Wort |
| 4 | 🟡 **Einsprech-Liste terminieren** — vor oder nach Italien; Empfehlung: vorher, notfalls nur Fall 01–10 | eine Antwort |
| 5 | 🟡 **Einmal „Passwort vergessen" durchklicken** (CoS-P-013), dann ist der Punkt zu | zwei Minuten |
| 6 | Vercel-Benachrichtigung · Versicherung · Stripe · Gewerbeanmeldung KW 41 (CoS-041) | unverändert, in diesem Lauf nicht neu geprüft |

### Nicht im Repository — einzeln gegen `1ebda34` geprüft

```
.github/workflows/ci.yml                   <- der CI-Fix; der Block schreibt die Datei
docs/design-check.md                       <- DC-108 (Designer)
docs/chief-of-staff-platform-todos.md      <- CoS-P-026 + Nachtrag 1
docs/chief-of-staff-engineering-todos.md   <- CI-Messung + LR-19/CoS-L-006
docs/entscheidungen-fuer-sandy.md          <- LR-18 + Commit-Liste
docs/arbeitsreihenfolge.md                 <- in diesem Lauf ersetzt
docs/einsprech-liste-alle-faelle.md        <- Prüfmeister, 12:23 nachgezogen
```

**Alles andere ist committet** — `launch-readiness.md`,
`chief-of-staff-legal-todos.md`, `legal-002-risikobewertung-vob.md`,
`dc-102-*`, `pruefmeister-*`, `vokabular-abgleich.md`,
`testnutzer-notizen-manfred.md`, `landingpage-fuenf-beispiele.md`,
`package.json`: nicht suchen.

---

## Head of Product Engineering

1. ✅ **Neu: euer Stand ist gemessen.** Lint, TypeScript und die 2402 Tests auf
   `1ebda34` sind grün. In den vier ungemessenen Läufen ist bei euch nichts
   liegen geblieben. Die Warnung von heute früh gilt **nur noch für den
   Build-Schritt**. Nichts anders bauen, nichts nacharbeiten.
2. 🔴 **Zug 3 in dieser Reihenfolge: PM-098 → PM-072 → PM-074 → PM-079.**
   PM-098 (280,00 € erfundene Lackierarbeiten aus „Ein Fenster, eine Tür")
   steht an der Spitze, Vorrang vor Gate 1 bestätigt. Mechanik bei **PM-033**
   und **PM-034** abschauen.
3. **CoS-E-069** — Batch PM-089…097. **PM-094** in Zug 3; **PM-089, 090, 091,
   093, 096, 097** in Zug 2; **PM-092 / PM-095** in den kleinen Zahlen-Zug.
   **Vor dem Bauen die drei Warnungen im Ticket lesen**, besonders PM-090.
4. **CoS-E-068** — Batch PM-079…088. **PM-085 nicht bauen, bis PD-016 Punkt 1
   beantwortet ist.**
5. **CoS-E-070 Teil A** — eine Quelle für das Fischgrät-Muster. Teil B
   (5 % oder 15 %) hängt an **CoS-E-054**, nicht hier.
6. **Reihenfolge insgesamt:** Zug 3 → Zug 2 → Zahlen-Zug (PM-092, PM-095,
   CoS-E-070 Teil A) → **CoS-E-061**.
7. **LR-19 / L-MAIL-01** — kein `reply_to` in den Mails an den Endkunden.
   Bauauftrag von Legal, hängt an **CoS-E-057**. Keine Frage an euch.
8. **CoS-E-057 (§ 35a)** — CoS-L-008 ist geliefert, bauen möglich. Migration
   **und** Eintrag in `check_migrationen.sql`.
9. ✅ **CoS-L-006 ist vollständig zu.** E-Rechnungspflicht erst **ab 01.01.2028**
   und nur gegenüber Geschäftskunden — die Abschaltung aus DC-100 ist gedeckt.
10. **CoS-E-053** weiterbauen, mit den vier Legal-Bedingungen. Preisanpassungs-
    Hinweis nicht aufs Kunden-PDF vor Sandys Freigabe (LR-16).
11. **CoS-E-063** — Heizkörper. **CoS-E-060** — offen: welche Datei speist die
    Oberfläche, `preis-ableitung.ts` oder `materialanteil.ts`?
12. **CoS-E-067** — `no-explicit-any`-Aufräumrunde, eigener Lauf, ganz hinten.
    Zur Größenordnung, frisch gezählt: von den 110 Lint-Warnungen ist der
    größte Block `no-explicit-any` in `supabase/functions/`.

## Product Designer

1. ✅ **DC-108 ist gebaut** — Hinweissatz unter „Tapezieren", Schalter heißt
   „Malerware". Prototyp und Spec, kein App-Code. **Nicht committet.**
2. 🟡 **DC-109 wartet auf Sandy**, nicht auf euch. Sagt sie „B", baut ihr den
   bereitliegenden Ersatztext ein; sagt sie „A", fliegt die Karte.
3. 🔴 **PD-016 Punkt 1** (runder Raum, PM-085) ist der **einzige** Punkt bei
   euch, an dem Engineering hängt — CoS-E-068 Teil C.
4. **PD-018, drei Fragen vom Prüfmeister.** Punkt 2 liefert zugleich den Beleg
   für **PD-016 Punkt 2**. **Keiner der drei blockiert etwas.**
5. **Nachzuziehen, jetzt möglich:** die eine Stelle in `AngebotDetail.tsx`,
   bewusst ausgelassen — Engineering hat committet.
6. **DC-102** freigegeben — Ablauf und Darstellung, **nicht die Zahlen**.
   Einbau hängt an CoS-E-053.
7. 🔴 **`docs/landingpage-fuenf-beispiele.md` geht nicht live, bevor PM-098
   gebaut ist.**
8. **Live-Test von DC-105 / DC-101 / DC-103 / DC-104 / DC-089 / DC-047 /
   DC-048** — braucht Sandy am Rechner.

## Platform

1. 🔴 **CoS-P-026 — `ci.yml` gegenlesen, nicht neu bauen.** Der korrigierte
   Stand kommt mit Sandys nächstem Push. `npm ci` ist zurück in seinem Schritt,
   euer Doku-Schritt steht unverändert als eigener Schritt dahinter, der
   Schrittname ist jetzt **reines ASCII**. Wenn euch am Doku-Schritt etwas
   fehlt, ändert ihn — lasst die Struktur.
2. 🆕 **CoS-P-026 Nachtrag 1 — der Lauf ist gemessen.** Lint, TypeScript, Env,
   Tests und die Doku-Prüfung auf `1ebda34` sind grün. Offen bleibt allein der
   Produktions-Build. Zahlen im Ticket.
3. 🔴 **CoS-P-025 — die Schrumpf-Prüfung, und sie deckt jetzt auch
   `.github/workflows/` ab.** `ci.yml` ist auf demselben Weg beschädigt worden
   wie die drei Doku-Dateien (BOM, doppelt kodierte Umlaute, ganze Datei
   zurückgeschrieben statt angehängt) — nur hat es hier vier Tage niemand
   gemerkt. Zweiter Teil unverändert: ist **CoS-P-022** ohne `device_bash`
   überhaupt lösbar?
4. 🔴 **CoS-P-024 — der Push-Hook wird ersatzlos abgeschafft.** Sandys
   Anweisung. **Noch nicht als umgesetzt eingetragen.**
5. ✅ **CoS-P-020 und CoS-P-021 sind zu**, das Budget 120 ist committet.
   **Es war nicht die Ursache der roten Läufe** — und, jetzt belegt: mit 110
   Warnungen hätte auch das alte Budget gehalten.
6. **CoS-P-013** — der letzte Rest ist Sandys Klick-Durchlauf, kein Code.
7. **CoS-P-005** — die fehlende RLS-Policy für den Logo-Upload.

## Prüfmeister

1. ✅ **Einsprech-Liste geliefert und um 12:23 nachgezogen**
   (`einsprech-liste-alle-faelle.md`, 18 Fälle + 2 Klick-Prüfungen).
   Sie liegt als Termin-Entscheidung bei Sandy, nicht mehr bei euch.
   **Die Frage von 12:00 steht weiter offen:** `docs/pruefmeister-einsprechen-47-56.md`
   vom 15.09. liegt unverändert daneben. Ist sie durch die neue Liste abgelöst?
   Wenn ja, ersetzt sie durch einen Verweis — zwei Einsprech-Listen nebeneinander
   sind genau der Parallelstand, den Sandys Datei-Regel ausschließt.
2. **Fallbasis 98/100.** Die Sperrklinke für PM-098 in
   `pruefmeister-batch-47-56.test.ts` fehlt noch.
3. **Die letzten zwei Fälle bis 100, ohne App prüfbar:** Selbstkorrektur mitten
   im Satz · Kunde redet im Hintergrund dazwischen · Aufnahme bricht ab und
   wird fortgesetzt.
4. **Die 142 Vorlagen der gesperrten Gewerke** — jeweils vor der Freischaltung.
5. **Größter blinder Fleck, festgehalten:** **jedes** Gewerk hat Stundenzeilen
   im Katalog, die Engine hat an keiner Stelle einen Weg dorthin (Abschnitt W
   in `vokabular-abgleich.md`, PM-093). Steht in CoS-E-069 mit drin.
6. **Braucht die laufende App, unverändert offen:** PM-002 · PM-032 ·
   PM-031 Teil 2 · PM-030 · PM-014/PM-015 · G.3 · Gegenprobe aus PD-009 §7.

## Legal

1. ✅ **CoS-L-006 vollständig abgeschlossen**, einschließlich § 14 Abs. 2 UStG.
2. ✅ **DC-106 ist auf eurer Seite zu.** Übrig: L-MAIL-01 als Bauauftrag (bei
   Engineering, CoS-E-057) und L-MAIL-02 als Textfix.
3. 🟡 **LR-18 wartet auf Sandys Freigabe** — steht mit Empfehlung in
   `entscheidungen-fuer-sandy.md`. Nicht selbst einbauen, bis sie antwortet.
4. **CoS-L-009** — darf „Aufmaß" auf dem Angebot stehen? Hängt an LR-16,
   blockiert nichts.
5. **Materialangabe auf dem Kunden-PDF bewerten** — vier Bedingungen sind an
   Engineering übergeben.
6. CoS-L-002 · CoS-L-004 laufend.

## Manfred

1. **Session 3: Registrierung end-to-end** — steht weiterhin aus. **Das ist der
   Posten, an dem die Gate-1-Zahl hängt.**
2. **DC-101 nachprüfen**: am Handy laden und **sofort** lostippen.
3. **Aus PD-009 §5:** Seine 75 % gegen die 63 % des Katalogs sind kein
   Widerspruch — zu bestätigen, nicht zu entscheiden.
4. **G.3** — seine zwei Szenarien in der laufenden App, offen seit 11.09.

---

## Was ich als Nächstes tue

**Den Produktions-Build nachmessen, sobald er messbar ist** — entweder über den
ersten wieder laufenden CI-Lauf nach Sandys Push, oder gar nicht. Er ist der
einzige Schritt, über den ich nichts sagen kann.

**Die Lehre aus diesem Lauf:** Auf einen fremden Lauf zu warten war unnötig.
Die CI-Schritte sind gewöhnliche Befehle — ich kann sie selbst fahren, und
damit steht das Ergebnis Stunden früher fest als der nächste Push. Das gilt ab
jetzt als Standard, wenn ein Lauf rot ist oder lange keiner gelaufen ist.

**DC-109, LR-18 und den Termin für die Einsprech-Liste nachhalten** — die drei
Antworten, die auf Sandy warten.

**Zum Ablauf dieses Laufs:** `device_bash` auf Sandys Rechner ist weiterhin tot
(`no Plan9 drive shares mounted`, Windows-Update vom 08.09.). Gelesen und
geschrieben wurde über Staging/Commit mit `expectedMtimeMs`; die GitHub-API ist
in dieser Umgebung gesperrt (403), der Lauf-Status kam über die Actions-Seite.
An `chief-of-staff-platform-todos.md` und `chief-of-staff-engineering-todos.md`
wurde ausschließlich vor der Endmarkierung angehängt. Ersetzt wurde nur diese
Datei. `.github/workflows/ci.yml` konnte ich erneut nicht schreiben —
schreibgeschützt für die Dateiwerkzeuge dieser Umgebung.

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
